import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {placeSystemDepth,deepenPlaceSystems,validateRetainedPlaceReceipt} from './content-205-216/place-system-depth.mjs';
import {validateGlobalIdentity} from './content-205-216/global-cohort-depth.mjs';
import {placeDossiers} from './content-205-216/place-dossiers.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {searchReaders} from '../src/lib/reader-search.mjs';

const read=async file=>JSON.parse(await readFile(new URL(`../${file}`,import.meta.url),'utf8'));
const corpus=await read('src/data/phase-205-216-current-editorial.json');
const historical=await read('src/data/phase-192-global-place-systems-atlas.json');
const operations=await read('src/data/phase-207-current-operations.json');
const ids=Object.keys(placeSystemDepth);
assert.deepEqual(ids,['192-PLACE-001','192-PLACE-002']);
assert.equal(corpus.records.filter(r=>r.kind==='Place'&&r.identity_evidence).length,4);
let notes=0,sections=0;
for(const id of ids){
  const expected=placeSystemDepth[id],article=corpus.records.find(r=>r.record_id===id),original=historical.place_system_dossiers.find(r=>r.global_place_dossier_id===id);
  assert(article&&original);
  validateGlobalIdentity(article,original);
  validateRetainedPlaceReceipt(article,operations.receipts);
  assert.equal(article.approved,false);
  assert.match(article.review_status,/independent review pending/);
  assert.equal(article.identity_evidence.origin,'Inherited exact place anchor');
  assert.equal(original.selection_decision,null);assert.equal(original.review_date,null);
  for(const field of ['sections','identity_evidence','source_notes'])assert.deepEqual(article[field],expected[field],`Incomplete generated ${field}: ${id}`);
  assert.deepEqual(article.sources,expected.sources.map(([title,url,artifact_date])=>({title,url,artifact_date})));
  assert.equal(new Set(article.sources.map(s=>s.url)).size,article.sources.length);
  assert.deepEqual(article.source_notes.map(n=>n.source_index),article.sources.map((_,i)=>i));
  for(const n of article.source_notes){assert(n.locator&&n.scope&&n.access);assert.equal(n.checked_date,'2026-09-14');notes++;}
  for(const s of article.sections){
    assert(s.heading&&s.text);sections++;
    for(const i of s.citations)assert(article.sources[i]);
    for(const p of s.paragraphs){assert(p.text.startsWith('FTFN interpretation:'));assert.deepEqual(p.citations,[]);}
  }
  assert.equal(article.language_notes,undefined,'Do not invent a foreign-language review for English-only sources');
  assert.throws(()=>validateGlobalIdentity(article,{...original,current_stage_snapshot:'Changed without review'}),/Historical identity changed/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,candidate_name:'A different place'}},original),/cannot be renamed/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,origin:'Invented authority'}},original),/Unknown identity origin/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,reviewer:'Invented reviewer'}},original),/cannot invent/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,decision_receipt:'Invented decision'}},original),/cannot issue/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,matched_source_indices:[0,999]}},original),/Unbound identity/);
}
assert.equal(notes,10);assert.equal(sections,13);
const ontario=corpus.records.find(r=>r.record_id===ids[0]),sa=corpus.records.find(r=>r.record_id===ids[1]);
const onText=JSON.stringify(ontario.sections),saText=JSON.stringify(sa.sections);
for(const term of ['four-quarter moving sum','6,386','12,062','8,289','rent quartiles, not dates','7.9%','12.1%','Ottawa finding is not a Toronto statistic','methodology','direction/number inconsistency','HTTP 403','September 21'])assert(onText.includes(term),`Lost Ontario scope: ${term}`);
for(const term of ['1,910.6 thousand','subject to revision','77.0%','21.3%','annual generation mix','30 MW / 8 MWh','1.4% increase','1.1% decrease','not changes in every household','PDF visual inspection could not be completed'])assert(saText.includes(term),`Lost South Australia scope: ${term}`);
assert(!ontario.identity_evidence.aliases.includes('Toronto CMA'),'A component geography is not an Ontario alias');
assert(!ontario.sections.slice(0,-1).some(s=>s.citations.includes(5)),'Unavailable tracker used for a positive claim');
assert(!sa.sources.some(s=>s.url.includes('.pdf')),'Excluded PDF restored without its required visual inspection');
assert.throws(()=>validateRetainedPlaceReceipt(ontario,[]),/Missing retained project receipt/);
const changed=operations.receipts.map(r=>r.receipt_id===ontario.retained_receipt.receipt_id?{...r,next_check_date:'2026-09-22'}:r);
assert.throws(()=>validateRetainedPlaceReceipt(ontario,changed),/Retained project receipt changed/);
assert.deepEqual(deepenPlaceSystems(placeDossiers),placeDossiers,'Depth application must be idempotent');
assert.deepEqual(deepenPlaceSystems([...placeDossiers].reverse()),[...placeDossiers].reverse(),'Identity binding must not depend on array order');
for(const [query,id]of [['Ontario',ids[0]],['South Australia',ids[1]]])assert(searchReaders(readerCatalog,query,'Place').some(r=>r.id===id));
const update=await read('src/content/updates/2026-09-14-place-system-depth.json');
assert.deepEqual(update.affected_record_ids,ids);
for(const id of ids)assert(update.related_paths.includes(corpus.records.find(r=>r.record_id===id).route));
assert.match(update.publication_effect,/held/);
assert.equal(historical.counts.exact_place_anchors,3);
console.log('Place-system checks passed: 2 inherited identities, 13 sections, 10 source notes, retained Toronto receipt and canonical routes; negative identity/receipt-drift tests. No independent acceptance or series admission.');
