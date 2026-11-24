import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {readShelfInputs,expectedShelfMembership,shelfFrontmatter} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const input=await readShelfInputs(root),ledger=JSON.parse(await readFile(join(root,'src/data/phase-206-editorial-classification.json'),'utf8'));
const operations=JSON.parse(await readFile(join(root,'src/data/phase-207-current-operations.json'),'utf8'));
const before=JSON.stringify(input),result=createShelfData(input,ledger,operations),expected=expectedShelfMembership(input,ledger);
assert.equal(JSON.stringify(input),before,'Navigation must not edit historical metadata');
assert.equal(Object.keys(result.shelves).length,44+1+input.sources.length+input.organizations.length+input.technologies.length+input.evidenceGaps.length+2*input.dependencyMaps.length+input.briefings.length+input.signals.filter(s=>input.dependencyMaps.some(d=>d.signal_ids.includes(s.id))).length);assert.deepEqual(Object.keys(result.shelves).sort(),Object.keys(expected).sort());
const held=new Set(ledger.records.map(r=>r.id));
for(const[kind,records]of Object.entries(result.shelves)){
  assert.deepEqual(records.map(r=>r.id).sort(),expected[kind].sort(),`${kind}: independent source inventory`);
  assert.equal(new Set(records.map(r=>r.id)).size,records.length);
  for(const r of records){assert(r.title&&r.summary&&/^\/[a-z0-9\-/]+\/$/.test(r.route),`${kind}/${r.id}`);assert(Object.values(r.filters).every(v=>Array.isArray(v)&&v.every(s=>typeof s==='string')));}
  if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(records.every(r=>!held.has(r.id)),`${kind}: excluded signal leaked`);
  assert.equal(searchShelf(records,{q:'missing-needle-5909283471'}).length,0);
  for(const r of records.slice(0,3)){assert(searchShelf(records,{q:r.title}).some(x=>x.id===r.id));for(const [key,values]of Object.entries(r.filters))if(values.length)assert(searchShelf(records,{[key]:values[0]}).some(x=>x.id===r.id));}
}
for(const s of input.localSystems){const rows=result.shelves[`local-${s.slug}`];assert.deepEqual(rows.filter(r=>r.filters.relationship.includes('Cited by local profile')).map(r=>r.id).sort(),[...s.source_ids].sort());assert(rows.filter(r=>r.filters.relationship.includes('Geography/role candidate — not cited by this profile')).every(r=>!s.source_ids.includes(r.id)));}
for(const p of input.readerPathways){for(const r of result.shelves[`pathway-${p.slug}`].filter(r=>held.has(r.id))){assert(r.filters.kind.includes('Classification archive'));assert.equal(r.summary,ledger.records.find(c=>c.id===r.id).reason);}}
for(const u of input.updates){if(u.receipt_id)assert(searchShelf(result.shelves.updates,{q:u.receipt_id}).some(r=>r.id===u.id));if(u.affected_record_ids.length)assert(searchShelf(result.shelves.updates,{q:u.affected_record_ids[0]}).some(r=>r.id===u.id));}
for(const s of input.sources){const row=result.shelves.sources.find(r=>r.id===s.id);assert.equal(row.date,s.last_checked_date);if(!s.review_cadence_days)assert(row.filters.cadence.includes('Fallback cadence — review required'));}
assert.throws(()=>createShelfData({...input,readerPathways:[{id:'test-only',slug:'test-only',title:'Test',signal_ids:['missing-id']}]},ledger),/Unresolved pathway membership/);
assert.throws(()=>shelfFrontmatter('---\nid: "x"\nsummary: |\n  unsupported\n---\n'),/Unsupported/);
await import('./assert-current-atlas-navigation.mjs');
await import('./assert-current-reading-navigation.mjs');
await import('./assert-source-review-clock.mjs');
console.log(`Navigation assertions passed: ${Object.keys(result.shelves).length} complete shelves, 17 topics, 5 local systems, 15 exact-ID pathway archives, ${input.updates.length} update receipts; distinct candidate/cited relationships, all holds retained, searchable receipt IDs, no source-date mutation.`);
