import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {readShelfInputs,expectedShelfMembership,shelfFrontmatter} from './lib/read-shelf-inputs.mjs';
import {readingShelfRelations} from '../src/lib/reading-shelf-relations.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
import {countInitialResultCards} from './lib/count-initial-result-cards.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const input=await readShelfInputs(root),ledger=JSON.parse(await read('src/data/phase-206-editorial-classification.json')),operations=JSON.parse(await read('src/data/phase-207-current-operations.json'));
const before=JSON.stringify(input),archives=readingShelfRelations(input),{shelves}=createShelfData(input,ledger,operations),expected=expectedShelfMembership(input,ledger),classified=new Map(shelves.classification.map(r=>[r.id,r]));
assert.equal(JSON.stringify(input),before,'Reading archives must not alter history');
assert.equal(archives.length,1202);assert.equal(archives.filter(a=>a.key.startsWith('briefing-')).length,458);
for(const a of archives){
  const rows=shelves[a.key];assert.deepEqual(rows.map(r=>r.id).sort(),[...expected[a.key]].sort());assert.equal(rows.length,new Set(rows.map(r=>r.id)).size);
  for(const member of a.members){const r=rows.find(r=>r.id===member.id);assert.deepEqual(r.filters.relationship,member.relationships);for(const f of member.facts)assert(r.facts.some(v=>v.label===f.label&&v.value===f.value));if(classified.has(r.id)){const c=classified.get(r.id);assert.equal(r.title,c.title);assert.equal(r.summary,c.summary);assert.deepEqual(r.filters.kind,['Classification archive']);assert(r.filters.review.includes('Classified — feed hold retained'));}}
  for(const index of new Set([0,Math.floor(rows.length/2),rows.length-1]))if(rows[index])assert(searchShelf(rows,{q:rows[index].title}).some(r=>r.id===rows[index].id));
}
for(const b of input.briefings){
  const rows=shelves[`briefing-${b.id}`];
  const directCount=new Set([...(b.signal_ids??[]),...(b.evidence_gap_ids??[])]).size;
  assert(rows.slice(0,directCount).every(r=>!r.filters.kind.includes('Dependency map')),'Direct references precede shared-ID maps');assert(rows.slice(directCount).every(r=>r.filters.kind.includes('Dependency map')));
  for(const id of new Set(b.signal_ids??[]))assert.deepEqual(rows.find(r=>r.id===id).filters.relationship,['Signal explicitly referenced by briefing']);
  for(const id of new Set(b.evidence_gap_ids??[]))assert.deepEqual(rows.find(r=>r.id===id).filters.relationship,['Evidence gap explicitly referenced by briefing']);
  for(const d of input.dependencyMaps){
    const signals=[...new Set(d.signal_ids.filter(id=>(b.signal_ids??[]).includes(id)))],gaps=[...new Set(d.evidence_gap_ids.filter(id=>(b.evidence_gap_ids??[]).includes(id)))],card=rows.find(r=>r.id===d.id);
    assert.equal(Boolean(card),Boolean(signals.length||gaps.length));if(!card)continue;
    assert.deepEqual(card.filters.relationship,[`Shared IDs: ${signals.length} signals; ${gaps.length} evidence gaps`]);
    if(signals.length)assert(card.facts.some(f=>f.label==='Shared signal IDs'&&f.value===signals.join(', ')));
    if(gaps.length)assert(card.facts.some(f=>f.label==='Shared evidence-gap IDs'&&f.value===gaps.join(', ')));
    assert(card.facts.some(f=>f.label==='Connection boundary'&&f.value.includes('not a direct map citation')));
  }
}
const mapsBySignal=new Map(input.signals.map(s=>[s.id,input.dependencyMaps.filter(d=>d.signal_ids.includes(s.id))]));
for(const s of input.signals){const maps=mapsBySignal.get(s.id),rows=shelves[`signal-maps-${s.id}`];assert.equal(Boolean(rows),maps.length>0);if(rows){assert.deepEqual(rows.map(r=>r.id).sort(),maps.map(r=>r.id).sort());assert(rows.every(r=>r.filters.relationship.includes('Map explicitly cites this signal ID')));}const remaining=(s.source_ids??[]).length+(s.evidence_gap_ids??[]).length+input.localSystems.filter(l=>(s.receiving_systems??[]).includes(l.name)).length;assert(remaining+Math.min(maps.length,20)<=50,`Signal template cardinality remains over budget: ${s.id}`);}
const worst=input.briefings.find(b=>b.id==='briefing-research-watch-055-federation-remediation-and-long-term-recovery');assert.equal(shelves[`briefing-${worst.id}`].length,241);
assert.deepEqual(shelfFrontmatter('---\nid: "test"\nsignal_ids:\n  - "signal-one"\n  - "signal-two"\n---\n').signal_ids,['signal-one','signal-two']);
assert.throws(()=>createShelfData({...input,briefings:[...input.briefings,{...input.briefings[0],id:'test-bad-briefing',slug:'test-bad-briefing',signal_ids:['unknown-reading-id']}]},ledger),/Unresolved reading membership/);
const sampleMap={...input.dependencyMaps[0],id:'test-map',signal_ids:['s','s'],evidence_gap_ids:['g','g']};
const dedup=readingShelfRelations({briefings:[{id:'b',slug:'b',title:'B',signal_ids:['s','s'],evidence_gap_ids:['g','g']}],dependencyMaps:[sampleMap]})[0];assert.equal(dedup.members.length,3);assert.deepEqual(dedup.members.find(r=>r.id==='test-map').relationships,['Shared IDs: 1 signals; 1 evidence gaps']);
const component=await read('src/components/atlas/DependencyMapLinks.astro'),briefing=await read('src/pages/briefings/[slug].astro'),signal=await read('src/pages/signals/[slug].astro');
assert(component.includes('limit={10}'));assert(component.includes('data-reading-relationships={shelf}'));assert(!component.includes('maps.map('));assert(briefing.includes('kind="briefing"'));assert(briefing.includes('recordId={briefing.data.id}'));assert(signal.includes('recordId={signal.data.id}'));assert(!briefing.includes('{signals.map('));assert(!briefing.includes('{linkedEvidenceGaps.map('));assert(!briefing.includes('getCollection("dependencyMaps")'));
assert(signal.includes('<Content />')&&briefing.includes('<Content />'),'Historical full narratives remain');assert(signal.includes('href={source.data.url}'),'Direct original-source links remain');
assert.equal(countInitialResultCards('<article class="record-card"></article><div data-shelf-card="x" class="record-card" data-overview-card="x"></div>'),2);
assert.equal(countInitialResultCards("<article class='record-card other'></article><article class=record-card></article><div data-overview-card=x></div>"),3);
assert.equal(countInitialResultCards('<div data-note="class=record-card >" class="not-record-card"></div><!-- <article class="record-card"> --><script>"<article class=record-card>"</script><style>/* <div data-shelf-card=x> */</style>'),0);
assert.equal(countInitialResultCards('<article class="record-card">'.repeat(51)),51);
const verifier=await read('scripts/verify-current-navigation.mjs');assert(verifier.includes("record.record_status==='Published'"));assert(verifier.includes("indexed?'index':'noindex'"));assert(verifier.includes('countInitialResultCards(html)<=50'));
console.log(`Reading navigation source checks passed: ${archives.length} complete archives for 458 briefings and 744 signal backlinks; exact references, shared-ID counts, full narratives and classification holds retained. All selected initial template card counts fit fifty; rendered bytes and browser acceptance remain unverified.`);
