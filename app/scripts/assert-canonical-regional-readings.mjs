import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {canonicalRegionalReadings as data,canonicalRegionalReview as review,regionalReadingHash as hash,validateRegionalReadings,regionalReadingFor,regionalReadingForPriorRoute,regionalReadingSources} from '../src/lib/canonical-regional-readings.mjs';
import {placeReadingFor} from '../src/lib/canonical-place-readings.mjs';
import {canonicalReaderForPlace} from '../src/lib/canonical-reader-bindings.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
import {currentPortfolioSummary} from '../src/lib/current-named-dossiers.mjs';
import {evidenceReceiptsForRoute} from '../src/lib/current-evidence.mjs';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const resign=(d,r)=>{r.edition_sha256=hash(d);for(const pin of r.records){const record=d.records.find(x=>x.record_id===pin.record_id);if(record)pin.sha256=hash(record);}};
const flags=['human_review_claimed','independent_review_claimed','fresh_external_source_check','publication_authorized','launch_authorized','phase_216_complete','operating_outcomes_admitted'];
const negative=[
 d=>d.records.pop(),d=>d.records.push(structuredClone(d.records[0])),d=>d.sources.pop(),d=>d.sources.push(structuredClone(d.sources[0])),
 d=>d.new_identity_count=5,d=>d.review_date='2026-11-23',...flags.map(k=>d=>{d[k]=true;}),
 ...data.records.flatMap((_,i)=>[
  d=>d.records[i].record_id='119-PLACE-001',d=>d.records[i].canonical_id='unrelated',d=>d.records[i].route='/atlas/places/unrelated/',d=>d.records[i].prior_route='/unrelated/',
  d=>d.records[i].kind='Project',d=>d.records[i].eligible_count=2,d=>d.records[i].new_identity_count=1,d=>d.records[i].scope='Unbounded',
  d=>d.records[i].current_cycle_id='60-CYCLE-DARPA-RESULTS',d=>d.records[i].receipt_ids=['invented'],d=>d.records[i].next_check_date='2026-12-21',
  ...['place_stage_established','project_stage_changed','operating_outcomes_admitted'].map(k=>d=>{d.records[i][k]=true;}),
  d=>d.records[i].sections.pop(),d=>d.records[i].sections[0].text='Blanket state-level outcome',
  d=>d.records[i].sections[0].source_ids=['unrelated'],d=>d.records[i].related=[],d=>d.records[i].next_artifacts=[],
  d=>d.records[i].aliases=['Unrelated'],
 ]),
 ...data.sources.flatMap((_,i)=>[
  d=>d.sources[i].retained.locator='Invented locator',d=>d.sources[i].collection='invented',
 ]),
 d=>d.records[0].sections[1].text=d.records[0].sections[1].text.replace('issuer targets','accepted completion dates'),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace('did not extract the ZIP','extracted all ZIP rows'),
 d=>d.records[2].sections[2].text=d.records[2].sections[2].text.replace('not a continuing safety audit','a continuing safety audit'),
 d=>d.records[3].sections[4].text=d.records[3].sections[4].text.replace('adds no fresh plant rows','adds fresh plant rows'),
 d=>d.records[4].sections[5].text=d.records[4].sections[5].text.replace('Two selected incidents are not a statewide denominator','Two selected incidents are a statewide denominator')
];
for(const mutate of negative){const d=structuredClone(data),r=structuredClone(review);mutate(d);assert.notDeepEqual(d,data);resign(d,r);assert.throws(()=>validateRegionalReadings(d,r));}
for(const k of flags)assert.throws(()=>validateRegionalReadings(data,{...review,[k]:true}));
for(const pin of review.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,pin.path);
const badReview=structuredClone(review);badReview.retained_narratives[0].sha256='0'.repeat(64);assert.throws(()=>validateRegionalReadings(data,badReview));
for(const r of data.records){
 const place=atlas.places.find(p=>p.atlas_place_id===r.record_id);
 assert.equal(regionalReadingFor(place),r);assert.equal(regionalReadingForPriorRoute(r.prior_route),r);
 assert.throws(()=>regionalReadingFor({...place,title:'Changed'}));assert.throws(()=>regionalReadingSources(structuredClone(r)));
 assert.equal(placeReadingFor(place),null);assert.equal(canonicalReaderForPlace(place),null);assert.equal(evidenceReceiptsForRoute(r.route).length,0);
 const sources=regionalReadingSources(r);assert(sources.length>=4);assert(sources.every(s=>s.title&&s.url.startsWith('https://')&&s.locator&&s.access&&s.boundary&&s.inspected_date<=data.review_date));
 assert.equal(readerCatalog.filter(c=>c.id===r.record_id&&c.route===r.route&&c.kind==='Place').length,1);assert(searchReaders(readerCatalog,r.canonical_id).some(c=>c.id===r.record_id));
}
assert.equal(regionalReadingFor({atlas_place_id:'not-bound'}),null);assert.equal(regionalReadingForPriorRoute('/not-bound/'),null);
assert.deepEqual(regionalReadingSources(data.records[2]).map(s=>s.inspected_date),['2026-09-23','2026-09-23','2026-09-22','2026-09-22']);
assert(regionalReadingSources(data.records[0]).every(s=>s.inspected_date==='2026-11-21'));
assert.equal(currentPortfolioSummary.eligible_projects,100);assert.equal(currentPortfolioSummary.eligible_places,70);
const covered=atlas.places.map(p=>[canonicalReaderForPlace(p),placeReadingFor(p),regionalReadingFor(p)].filter(Boolean).length);
assert.equal(covered.length,15);assert(covered.every(n=>n===1),'Exactly one dedicated current reading per original Atlas place route');
// Other reviewed cohorts may grow; only this cohort and the original Atlas are fixed here.
assert.equal(new Set(readerCatalog.map(r=>r.id)).size,readerCatalog.length);
for(const [path,fragment] of [
 ['src/pages/atlas/places/[slug].astro','<CanonicalRegionalReading record={regionalReading} />'],
 ['src/pages/atlas/local-systems/[slug].astro','??regionalReadingForPriorRoute(Astro.url.pathname)'],
 ['src/pages/review/regions/[slug].astro','??regionalReadingForPriorRoute(Astro.url.pathname)'],
 ['src/pages/data/build-decisions.json.ts','canonical_regional_reading_review:canonicalRegionalReview'],
 ['src/pages/sitemap.xml.ts','canonicalRegionalReadings.records.some'],
 ['src/pages/method/portfolio-decisions.astro','data-canonical-regional-summary'],
 ['scripts/verify-authorized-build.mjs',"import './verify-canonical-regional-readings.mjs'"]
])assert((await read(path)).includes(fragment),path);
const component=await read('src/components/review/CanonicalRegionalReading.astro');for(const fragment of ['max-width:76ch','line-height:1.75',':focus-visible','data-regional-no-cycle','no new external source check or independent review is claimed'])assert(component.includes(fragment));
const update=JSON.parse(await read('src/content/updates/2026-11-22-canonical-regional-readings.json'));assert.deepEqual(update.affected_record_ids,data.records.map(r=>r.record_id));
console.log('Canonical regional readings passed: 5 existing places, 30 sections, 42 exact retained sources, 10 narrative pins; '+negative.length+' rehashed invalid editions rejected. All 15 original Atlas place routes have exactly one dedicated current account; no new gate, count, inspection or outcome. Production remains separate.');
