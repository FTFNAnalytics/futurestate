import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {canonicalPlaceReadings as data,canonicalPlaceReview as review,placeReadingHash as hash,validatePlaceReadings,placeReadingFor,placeReadingForPriorRoute,placeReadingSources,placeReadingContext,placeReadingRelatedContexts,placeReadingAssignedGateContexts} from '../src/lib/canonical-place-readings.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import {currentEvidenceLedger} from '../src/lib/current-evidence.mjs';
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
import {currentPortfolioSummary} from '../src/lib/current-named-dossiers.mjs';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const resign=(d,r)=>{r.edition_sha256=hash(d);for(const pin of r.records){const record=d.records.find(x=>x.record_id===pin.record_id);if(record)pin.sha256=hash(record);}return r;};
const negative=[
 d=>d.records.pop(),d=>d.records.push(structuredClone(d.records[0])),d=>d.sources.pop(),d=>d.sources.push(structuredClone(d.sources[0])),
 d=>d.retained_receipts.pop(),d=>d.retained_receipts[0].sha256='0'.repeat(64),d=>d.new_identity_count=4,d=>d.review_date='2026-11-21',
 ...['human_review_claimed','independent_review_claimed','fresh_external_source_check','publication_authorized','launch_authorized','phase_216_complete'].map(k=>d=>{d[k]=true;}),
 ...data.records.flatMap((_,i)=>[
  d=>d.records[i].route='/atlas/places/unrelated/',d=>d.records[i].prior_route='/unrelated/',d=>d.records[i].canonical_id='unrelated',
  d=>d.records[i].kind='Project',d=>d.records[i].eligible_count=2,d=>d.records[i].new_identity_count=1,
  ...['place_stage_established','project_stage_changed','operating_outcomes_admitted'].map(k=>d=>{d.records[i][k]=true;}),
  d=>d.records[i].current_cycle_id='60-CYCLE-DARPA-RESULTS',d=>d.records[i].receipt_ids=[],d=>d.records[i].sections.pop(),
  d=>d.records[i].sections[0].text='Unsupported blanket outcome.',d=>d.records[i].sections[0].source_ids=['wrong-place-source'],
  d=>d.records[i].related=[{route:'/atlas/projects/unrelated/'}],d=>d.records[i].next_artifacts=[],d=>d.records[i].scope='Unbounded'
 ]),
 ...data.sources.map((_,i)=>d=>{d.sources[i].check.accessed_date='2026-11-22';}),
 d=>d.sources[0].check.finding='Completed and accepted works',d=>d.sources[0].receipt_id=data.sources.at(-1).receipt_id,
 d=>d.sources[0].check_index=10,d=>d.sources[0].id=d.sources[1].id,
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace('not a share of wastewater volume','a share of wastewater volume'),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace('165 containers shipped','165 containers accepted'),
 d=>d.records[2].sections[1].text=d.records[2].sections[1].text.replace('January 8, 2026','September 15, 2026'),
 d=>d.records[3].sections[5].text=d.records[3].sections[5].text.replace('does not reset Golden-Mars','resets Golden-Mars'),
 d=>d.records[4].related_cycle_contexts=[],d=>d.records[4].related_cycle_contexts.push(structuredClone(d.records[4].related_cycle_contexts[0])),
 d=>d.records[4].related_cycle_contexts[0].cycle_id='60-CYCLE-MONTANA-COMPLETED-QUARTER',
 d=>d.records[4].related_cycle_contexts[0].relation='Assigned place decision and new primary gate.',
 d=>d.records[4].related_cycle_contexts[0].label='Statewide adopted outcome',
 d=>d.records[5].related_cycle_contexts=structuredClone(d.records[4].related_cycle_contexts),
 d=>d.records[4].sections[3].text=d.records[4].sections[3].text.replace('must not replace','replaces'),
 d=>d.records[4].sections[1].text=d.records[4].sections[1].text.replace('104-location service area is in Bossier','104-location service area is in Bienville'),
 d=>d.records[4].sections[2].text=d.records[4].sections[2].text.replace('planned 10,635-location scope','10,635 active subscribers'),
 d=>d.records[5].sections[1].text=d.records[5].sections[1].text.replace('empty attachment is not evidence of zero construction','empty attachment proves zero construction'),
 d=>d.records[5].sections[4].text=d.records[5].sections[4].text.replace('ConnectMT ARPA support','ConnectMT BEAD support'),
 d=>d.records[5].sections[5].text=d.records[5].sections[5].text.replace('does not redate the thirty-two proposal dossiers','redates the thirty-two proposal dossiers'),
 ...[6,7].flatMap(i=>[
  d=>d.records[i].kind='Place',d=>d.records[i].eligible_count=1,d=>d.records[i].assigned_cycle_contexts=[],
  d=>d.records[i].assigned_cycle_contexts.push(structuredClone(d.records[i].assigned_cycle_contexts[0])),
  d=>d.records[i].assigned_cycle_contexts[0].cycle_id='60-CYCLE-DARPA-RESULTS',
  d=>d.records[i].assigned_cycle_contexts[0].label='Shared program approval',
  d=>d.records[i].assigned_cycle_contexts[0].relation='The gates have one shared decision and inspection date.'
 ]),
 d=>d.records[0].assigned_cycle_contexts=structuredClone(d.records[6].assigned_cycle_contexts),
 d=>d.records[6].sections[1].text=d.records[6].sections[1].text.replace('93 and 117 counts must not be reconciled by assumption','93 and 117 counts are interchangeable'),
 d=>d.records[6].sections[5].text=d.records[6].sections[5].text.replace('November 25 for named-asset reliability and December 21 for closeout','December 21 for both gates'),
 d=>d.records[7].sections[0].text=d.records[7].sections[0].text.replace('contributes zero to the eligible-place target','contributes one to the eligible-place target'),
 d=>d.records[7].sections[1].text=d.records[7].sections[1].text.replace('GAO-20-703 recommendation 3','GAO-20-703 recommendation 2'),
 d=>d.records[7].sections[3].text=d.records[7].sections[3].text.replace('October 2, 2024','October 2, 2026'),
 d=>d.records[7].sections[4].text=d.records[7].sections[4].text.replace('Only the cover and administrative cover sheet','All technical sections'),
 d=>d.records[7].sections[5].text=d.records[7].sections[5].text.replace('No Phase 61 named file is assigned','A new Phase 61 named file is assigned')
];
for(const mutate of negative){const d=structuredClone(data),r=structuredClone(review);mutate(d);assert.notDeepEqual(d,data);resign(d,r);assert.throws(()=>validatePlaceReadings(d,r));}
for(const k of ['human_review_claimed','independent_review_claimed','fresh_external_source_check','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'])assert.throws(()=>validatePlaceReadings(data,{...review,[k]:true}));
for(const pin of review.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,pin.path);
for(const pin of data.retained_receipts){
 const ledger=structuredClone(currentEvidenceLedger);ledger.receipts.find(r=>r.receipt_id===pin.receipt_id).bounded_finding+=' Changed.';assert.throws(()=>validatePlaceReadings(data,review,{ledger}));
}
let sections=0,sources=0;
for(const r of data.records){
 const place=atlas.places.find(p=>p.atlas_place_id===r.record_id);assert.equal(placeReadingFor(place),r);assert.equal(placeReadingForPriorRoute(r.prior_route),r);
 assert.equal(placeReadingFor({...place,atlas_place_id:'unrelated'}),null);assert.throws(()=>placeReadingFor({...place,title:'Changed identity'}));
 assert.equal(placeReadingForPriorRoute(r.route),null);assert.equal(placeReadingForPriorRoute(r.prior_route+'copy/'),null);
 const rows=readerCatalog.filter(c=>c.id===r.record_id);assert.equal(rows.length,1);assert.equal(rows[0].route,r.route);assert.equal(rows[0].kind,r.kind);assert.equal(rows[0].date,data.review_date);assert.equal(rows[0].summary,r.answer);
 assert(searchReaders(readerCatalog,r.record_id,r.kind).some(c=>c.id===r.record_id));
 if(r.kind==='Context'){assert.equal(r.eligible_count,0);assert.equal(searchReaders(readerCatalog,r.record_id,'Place').some(c=>c.id===r.record_id),false);}
 const ctx=placeReadingContext(r);assert(ctx);assert.equal(ctx.source_checked_date,'2026-11-21');assert.equal(ctx.next_check_date,r.record_id==='119-PLACE-003'?'2026-12-02':'2026-12-21');
 assert(r.receipt_ids.includes(ctx.receipt_id));assert.equal(ctx.cycle_item_id,r.current_cycle_id);
 const missing=structuredClone(currentEvidenceLedger);missing.receipts=missing.receipts.filter(x=>x.cycle_item_id!==r.current_cycle_id);assert.equal(placeReadingContext(r,{ledger:missing}),null);
 for(const change of [x=>{x.affected_routes=['/unrelated/'];},x=>{x.affected_record_ids=['unrelated'];},x=>{x.cycle_item_id='unrelated';},x=>{x.decision_date='2099-01-01';},x=>{x.source_checked_date='2099-01-01';}]){
  const ledger=structuredClone(currentEvidenceLedger),bad={...structuredClone(ctx),receipt_id:'test-unrelated',decision_date:ledger.as_of_date};change(bad);ledger.receipts.push(bad);assert.equal(placeReadingContext(r,{ledger}).receipt_id,ctx.receipt_id);
 }
 sections+=r.sections.length;sources+=placeReadingSources(r).length;
}
assert.equal(sections,48);assert.equal(sources,55);assert.equal(data.records[2].receipt_ids.length,2,'Retain renewal and later access blocker');
for(const r of data.records){
 const assigned=placeReadingAssignedGateContexts(r);assert.equal(assigned.length,r.record_id==='119-PLACE-010'?1:r.record_id==='119-PLACE-011'?2:0);
 const historical=placeReadingAssignedGateContexts(r,{ledger:{...currentEvidenceLedger,as_of_date:'2026-11-25'}});
 assert(historical.every(({receipt})=>r.receipt_ids.includes(receipt.receipt_id)),'Assessed November place narrative retains its original receipt bindings');
 for(const {receipt} of assigned){
  const capacity=receipt.cycle_item_id==='60-CYCLE-NNSA-ACCEPTED-CAPACITY';
  assert(r.receipt_ids.includes(capacity?receipt.receipt_id:receipt.prior_receipt_id));assert(receipt.affected_routes.includes(r.route)&&receipt.affected_record_ids.includes(r.record_id));
  assert.equal(receipt.counts_as_cycle_decision,true);assert.notEqual(receipt.cycle_item_id,placeReadingContext(r).cycle_item_id);
  assert.equal(receipt.source_checked_date,capacity?'2026-11-21':'2026-11-26');assert.equal(receipt.next_check_date,capacity?'2026-12-21':'2026-12-26');
  if(!capacity){assert.equal(receipt.follow_up_scheduled_date,'2026-11-25');assert.equal(receipt.prior_receipt_id,historical.find(x=>x.receipt.cycle_item_id===receipt.cycle_item_id).receipt.receipt_id);}
  const missing=structuredClone(currentEvidenceLedger);missing.receipts=missing.receipts.filter(x=>x.cycle_item_id!==receipt.cycle_item_id);
  assert.deepEqual(placeReadingAssignedGateContexts(r,{ledger:missing}).map(x=>x.receipt.cycle_item_id),assigned.filter(x=>x.receipt.cycle_item_id!==receipt.cycle_item_id).map(x=>x.receipt.cycle_item_id));
  for(const change of [x=>{x.affected_routes=['/unrelated/'];},x=>{x.affected_record_ids=['unrelated'];},x=>{x.cycle_item_id='unrelated';},x=>{x.decision_date='2099-01-01';},x=>{x.source_checked_date='2099-01-01';}]){
   const ledger=structuredClone(currentEvidenceLedger),bad={...structuredClone(receipt),receipt_id:'test-unrelated-assigned',decision_date:ledger.as_of_date};change(bad);ledger.receipts.push(bad);assert.deepEqual(placeReadingAssignedGateContexts(r,{ledger}).map(x=>x.receipt.receipt_id),assigned.map(x=>x.receipt.receipt_id));
  }
 }
}
assert.throws(()=>placeReadingAssignedGateContexts({...data.records[6]}));
const la=data.records[4],companion=placeReadingRelatedContexts(la);assert.equal(companion.length,1);
assert.equal(companion[0].receipt.receipt_id,'receipt-60-starlink-2026-11-21-companion-watch-note');
assert.equal(companion[0].receipt.counts_as_cycle_decision,false);
assert.equal(companion[0].receipt.affected_routes.includes(la.route),false,'Do not invent earlier assignment');
assert.notEqual(companion[0].receipt.cycle_item_id,placeReadingContext(la).cycle_item_id);
assert.equal(companion[0].receipt.source_checked_date,'2026-11-21');assert.equal(companion[0].receipt.next_check_date,'2026-12-21');
for(const r of data.records.filter(r=>r!==la))assert.deepEqual(placeReadingRelatedContexts(r),[]);
const absent=structuredClone(currentEvidenceLedger);absent.receipts=absent.receipts.filter(r=>r.cycle_item_id!==companion[0].receipt.cycle_item_id);assert.deepEqual(placeReadingRelatedContexts(la,{ledger:absent}),[]);
for(const change of [r=>{r.cycle_item_id='unrelated';},r=>{r.decision_date='2099-01-01';},r=>{r.source_checked_date='2099-01-01';}]){
 const ledger=structuredClone(currentEvidenceLedger),bad={...structuredClone(companion[0].receipt),receipt_id:'unrelated-test',decision_date:ledger.as_of_date};change(bad);ledger.receipts.push(bad);assert.equal(placeReadingRelatedContexts(la,{ledger})[0].receipt.receipt_id,companion[0].receipt.receipt_id);
}
assert.throws(()=>placeReadingRelatedContexts({...la}));
assert.equal(hash({...data,records:data.records.slice(0,4),sources:data.sources.slice(0,19),retained_receipts:data.retained_receipts.slice(0,5)}),'305c8da600c977bffaea5e85d6e225f2228f672a7b4e6a7329f1c5ef7f8534b0');
assert.equal(hash(review.records.slice(0,4)),'8fcd8b65950cb3090f55f682087f1c8bee2780b6cc14832428b0357950809d13');
assert.equal(hash({...data,records:data.records.slice(0,6),sources:data.sources.slice(0,36),retained_receipts:data.retained_receipts.slice(0,8)}),'97babe4d65a59be9cf6c7ef750a1bb88df45ba84217d341c36946d70244bed4c');
assert.equal(hash(review.records.slice(0,6)),'de8f5b88a8d874529b4f1cecb29ed1abece33918b24694b4e1ef0a30e0fa3aed');
assert.throws(()=>placeReadingContext({...data.records[0]}),'Unbound copies must not inherit context');
assert.deepEqual([currentPortfolioSummary.eligible_projects,currentPortfolioSummary.eligible_places],[100,70]);
const template=await read('src/pages/atlas/places/[slug].astro');
for(const token of ['placeReadingFor(place)','hasCurrentPlaceAccount=Boolean(canonicalReader||placeReading||regionalReading)','<CanonicalPlaceReading record={placeReading}','Historical Atlas appointment','data-prior-atlas-account'])assert(template.includes(token),token);
assert(template.indexOf('<CanonicalPlaceReading')<template.indexOf('data-recorded-system-boundary'));assert(template.indexOf('data-recorded-system-boundary')<template.indexOf('<LegacyContainer'));
for(const p of ['src/pages/atlas/local-systems/[slug].astro','src/pages/review/regions/[slug].astro']){const t=await read(p);assert(t.includes('placeReadingForPriorRoute(Astro.url.pathname)')&&t.includes('data-current-place-reading-link'));}
const component=await read('src/components/review/CanonicalPlaceReading.astro');for(const token of ['data-place-reading-section','data-place-reading-source','data-place-reading-context','data-place-related-companion','data-place-assigned-gate','data-place-reading-scope','It adds zero counted places','placeReadingRelatedContexts(record)','placeReadingAssignedGateContexts(record)','receipt.gate_route','source.check.accessed_date','source.check.limitation','data-place-reading-assessment','record.scope'])assert(component.includes(token),token);
assert(template.includes('data-excluded-system-context'));assert((await read('src/pages/review/regions/[slug].astro')).includes('Later dated system context'));
const exported=await read('src/pages/data/build-decisions.json.ts');assert(exported.includes('canonical_place_readings:canonicalPlaceReadings')&&exported.includes('canonical_place_reading_review:canonicalPlaceReview'));
assert((await read('src/pages/sitemap.xml.ts')).includes('canonicalPlaceReadings.records.some(r=>[r.route,r.prior_route].includes(path))'));
assert((await read('src/pages/method/portfolio-decisions.astro')).includes('data-canonical-place-summary'));
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const p of ['src/data/canonical-place-readings.json','src/data/canonical-place-reading-reviews.json','src/lib/canonical-place-readings.mjs','src/components/review/CanonicalPlaceReading.astro','scripts/assert-canonical-place-readings.mjs','scripts/verify-canonical-place-readings.mjs','src/content/updates/2026-11-22-canonical-place-readings.json'])assert(candidate.candidate_digest.artifact_paths.includes(p),p);
assert(candidate.candidate_digest.artifact_paths.includes('src/content/updates/2026-11-22-broadband-place-readings.json'));
assert(candidate.candidate_digest.artifact_paths.includes('src/content/updates/2026-11-22-amtrak-nnsa-system-readings.json'));
console.log('Canonical place/context source checks passed: 8 readings (6 places, 2 excluded contexts), 48 complete sections, 55 retained source checks and 13 receipt pins; '+negative.length+' rehashed invalid editions plus review, runtime and receipt mutations rejected. Preceding six accounts/assessments exact; three assigned gates preserve historical bindings while reliability/rate expose actual November 26 context and December 26 appointments. 100/70 eligibility unchanged; no narrative rewrite, outcome admission or backdated November 25 review.');
