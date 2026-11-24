// Production-only checks: never run against the blocked/partial dist.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {currentGapReviewLedger} from '../src/lib/current-gap-reviews.mjs';
const read=path=>readFile(new URL('../dist'+path,import.meta.url),'utf8');
assert.deepEqual(JSON.parse(await read('/data/current-gap-reviews.json')),currentGapReviewLedger);
for(const r of currentGapReviewLedger.records){
 for(const route of r.affected_routes){const html=await read(route+'index.html');assert(html.includes(`data-current-gap-review="${r.receipt_id}"`));assert(html.includes(r.source_checked_date));assert(html.includes(r.next_check_date));}
 const html=await read('/atlas/evidence-gaps/gap-002-arizona-industrial-water-capacity/index.html');
 assert(html.includes('Retained Evidence Decision'));assert(html.includes('2026-09-22')||html.includes('Sep 22, 2026'));assert(html.includes(r.next_action));
 for(const [path,key]of [['/data/sources.json','sources'],['/data/signals.json','signals']]){
  const data=JSON.parse(await read(path)),records=Array.isArray(data)?data:data[key]??data.records;
  const id=r.affected_record_ids.find(id=>id.startsWith(key==='sources'?'source-':'signal-'));
  const record=records.find(row=>row.id===id);assert(record,`Missing assigned ${key} record: ${id}`);assert(record.dated_acceptance_reviews.some(review=>review.receipt_id===r.receipt_id));
 }
}
const hub=await read('/data/index.html');assert(hub.includes('href="/data/current-gap-reviews.json"'));
console.log('Separate gap acceptance receipts verified in production output; this does not close the cycle or authorize launch.');
