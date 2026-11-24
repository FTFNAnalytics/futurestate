import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {getSourceFreshness,getSourceReviewWindowDays,sourceReviewCalendarDate,sourceReviewAsOfDate} from '../src/lib/sourceFreshness.ts';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';

// Preserve historical seasonal offsets and test the current Alberta rule too.
// https://www.alberta.ca/albertas-new-time-system-abt
// Updated tzdata keeps Edmonton on UTC-6 in November 2026; UTC-7 then was a stale fixture.
for(const [instant,date] of [
  ['2024-01-15T06:59:59Z','2024-01-14'],['2024-01-15T07:00:00Z','2024-01-15'],
  ['2024-06-12T05:59:59Z','2024-06-11'],['2024-06-12T06:00:00Z','2024-06-12'],
  ['2026-11-23T01:00:00Z','2026-11-22'],['2026-11-23T05:59:59Z','2026-11-22'],
  ['2026-11-23T06:00:00Z','2026-11-23'],['2026-11-23T06:59:59Z','2026-11-23'],
]) assert.equal(sourceReviewCalendarDate(new Date(instant)),date);
assert.equal(sourceReviewAsOfDate,sourceReviewCalendarDate());

const freshness=(checked,asOf='2024-03-01',cadence=30)=>getSourceFreshness(checked,'Monthly','High',asOf,cadence);
assert.equal(freshness('2024-01-31').status,'Watch soon');
assert.equal(freshness('2024-01-30').status,'Review due');
assert.equal(freshness('2024-02-29').ageDays,1);
assert.equal(freshness(new Date('2024-02-29T23:59:59Z')).ageDays,1);
assert.equal(freshness('2024-03-01').ageDays,0);
assert.equal(freshness('2024-03-01').status,'Current');
for(const invalid of ['2024-02-30','2026-02-29','2024-13-01','2024-1-01','2024-03-01T00:00:00Z','',new Date(NaN)]) {
  const result=freshness(invalid);
  assert.equal(result.status,'Review due');
  assert.equal(result.ageDays,null);
  assert.match(result.note,/Invalid recorded inspection date/);
}
const future=freshness('2024-03-02');
assert.equal(future.status,'Review due');
assert.equal(future.ageDays,null);
assert.match(future.note,/later than the calculation date/);
assert.throws(()=>freshness('2024-02-29','2024-02-30'),/calculation date/);
for(const invalid of [0,-1,0.5,NaN,Infinity,3651,'30',null]) {
  const result=freshness('2024-03-01','2024-03-01',invalid);
  assert.equal(result.status,'Review due');
  assert.equal(result.ageDays,null);
  assert.match(result.note,/Invalid declared review cadence/);
}
assert.equal(getSourceReviewWindowDays('Irregular','Medium'),120);
assert.equal(getSourceReviewWindowDays('Irregular','High'),90);
assert.equal(getSourceReviewWindowDays('Regular','Medium'),60);
assert.equal(getSourceReviewWindowDays('Annual','High'),400);
assert.equal(getSourceReviewWindowDays('Daily','High'),10);
assert.equal(getSourceReviewWindowDays('Monthly','High'),45);
assert.equal(getSourceReviewWindowDays('Irregular','Medium',14),14);
assert.equal(getSourceReviewWindowDays('Daily','Low'),60);

const root=fileURLToPath(new URL('../',import.meta.url));
const input=await readShelfInputs(root),ledger=JSON.parse(await readFile(join(root,'src/data/phase-206-editorial-classification.json'),'utf8'));
const operations=JSON.parse(await readFile(join(root,'src/data/phase-207-current-operations.json'),'utf8'));
const before=JSON.stringify({input,ledger,operations});
const live=createShelfData(input,ledger,operations);
assert.equal(live.asOfDate,sourceReviewAsOfDate);
const replay=createShelfData(input,ledger,operations,'2026-11-22');
const otherClassificationDate=createShelfData(input,{...ledger,as_of_date:'1999-01-01'},operations,'2026-11-22');
assert.deepEqual(otherClassificationDate.shelves.sources,replay.shelves.sources,'Source queue must not inherit the classification clock');
for(const source of input.sources) {
  const row=replay.sourceRows.find(row=>row.source.id===source.id);
  const expected=getSourceFreshness(source.last_checked_date,source.update_frequency,source.capture_priority,'2026-11-22',source.review_cadence_days);
  assert.deepEqual(row.freshness,expected);
  const card=replay.shelves.sources.find(row=>row.id===source.id);
  assert.equal(card.date,source.last_checked_date);
  assert(card.facts.find(f=>f.label==='Checked-date age').value.endsWith('as of 2026-11-22'));
}
assert.equal(JSON.stringify({input,ledger,operations}),before);
const sample=input.sources[0],changed=structuredClone(input);
changed.sources[0]={...sample,last_checked_date:'2026-11-23'};
const invalidQueue=createShelfData(changed,ledger,operations,'2026-11-22');
const card=invalidQueue.shelves.sources.find(row=>row.id===sample.id);
assert(card.filters.freshness.includes('Review due'));
assert.equal(card.facts.find(f=>f.label==='Checked-date age').value,'Unresolved metadata as of 2026-11-22');
assert(!JSON.stringify(card).includes('NaN'));
assert(!JSON.stringify(card).includes('null days'));
assert.match(card.facts.find(f=>f.label==='Next action').value,/later than the calculation date/);

for(const file of ['src/pages/atlas/index.astro','src/pages/atlas/sources/[id].astro','src/pages/atlas/source-coverage/index.astro']) {
  const text=await readFile(join(root,file),'utf8');
  assert(text.includes('sourceReviewAsOfDate'),`Shared clock missing: ${file}`);
  assert(!text.includes('const generatedAt = new Date();'),`Unbounded instant clock: ${file}`);
}
const exported=await readFile(join(root,'src/pages/data/shelves/[kind].json.ts'),'utf8');
assert(exported.includes('metadata_as_of_date:props.asOfDate'));
console.log(`Source review clock passed: historical Edmonton winter/summer midnight and current Alberta UTC-6 midnight, invalid/future dates, cadence bounds, irregular fallback, ${input.sources.length} unchanged source dates and classification-independent shelf replay. No source retrieval or appointment change.`);

