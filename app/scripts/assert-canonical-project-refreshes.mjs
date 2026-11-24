import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {canonicalProjectRefreshes as data,canonicalProjectRefreshReview as review,validateProjectRefreshes,projectRefreshFor,projectRefreshHash,projectRefreshSources,projectRefreshAccessLimits,projectRefreshCatalogKind,canonicalProjectRefreshHistory as history} from '../src/lib/canonical-project-refreshes.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import {currentPortfolioSummary} from '../src/lib/current-named-dossiers.mjs';
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
validateProjectRefreshes(data);
const invalid=[
 d=>d.records.push(structuredClone(d.records[0])),
 d=>d.records[0].record_id='119-PROJECT-015',
 d=>d.records[0].route='/atlas/projects/f35-production-readiness/',
 d=>d.records[0].canonical_id='casebook-kc46-readiness',
 d=>d.records[0].kind='Place',
 d=>d.records[0].new_identity_count=1,
 d=>d.records[0].governed_stage_changed=true,
 d=>d.records[0].series_admitted=true,
 d=>d.records[0].retained_pilot_id='160-PILOT-002',
 d=>d.records[0].sections.pop(),
 d=>d.records[0].timeline.pop(),
 d=>d.records[0].sections[0].source_ids=['unread'],
 d=>d.records[0].timeline[0].date='2026-08-04',
 d=>d.sources[0].posting_date='2025-12-15',
 d=>d.sources[1].event_date='2026-02-17',
 d=>d.sources[1].access='Video fully inspected',
 d=>d.sources[2].posting_date='2026-09-29',
 d=>d.sources[3].publication_date='2026-11-22',
 d=>d.sources[0].inspection_date='2026-09-25',
 d=>d.access_limits.pop(),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace('editorial inference, not an issuer correction','issuer-corrected date'),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replaceAll('target rate','achieved rate'),
 d=>d.records[0].sections[5].text=d.records[0].sections[5].text.replace('documented zero from a missing month','missing months are zero'),
 d=>d.records[1].record_id='119-PROJECT-007',
 d=>d.records[1].new_identity_count=1,
 d=>d.records[1].retained_pilot_id='160-PILOT-003',
 d=>d.records[1].counting_note='One eligible project',
 d=>d.records[1].decision_boundary='Artifacts do not exist',
 d=>d.records[1].sections[2].text='All testing is complete',
 d=>d.records[1].timeline[0].date='2025-06-01',
 d=>d.records[1].sections[0].source_ids=['aria-report'],
 d=>d.records[2].sections[2].text='Higher scores mean greater safety',
 d=>d.records[2].sections[3].text='All applications were tested equally',
 d=>d.records[2].counting_note='Seven eligible projects',
 d=>d.records[2].governed_stage_changed=true,
 d=>d.sources[4].publication_date='2025-06-01',
 d=>d.sources[6].event_date='2026-08-24',
 d=>d.sources[8].publication_date='2026-11-22',
 d=>d.sources[9].editorial_approval_date='2025-11-13',
 d=>d.sources[9].access='PDF text and all page images inspected',
 d=>d.records[3].canonical_id='casebook-gateway-battery-storage',
 d=>d.records[3].scope='All California batteries combined',
 d=>d.records[3].counting_note='Two eligible projects',
 d=>d.records[3].decision_boundary='A governed operating file is now accepted',
 d=>d.records[3].governed_stage_changed=true,
 d=>d.records[3].sections[0].text='All storage facilities have restarted',
 d=>d.records[3].sections[2].text='The September fire was a grid-connected operating incident',
 d=>d.records[3].sections[3].text='Cleanup completed in November 2026',
 d=>d.records[3].sections[4].text='No pollutants exceeded screening levels',
 d=>d.records[3].sections[5].text='The regulator accepted the cause of both fires',
 d=>d.records[3].timeline[4].date='2026-09-30',
 d=>d.records[3].sections[0].source_ids=['aria-report'],
 d=>d.records[3].access_limits.pop(),
 d=>d.records[3].access_limits[1].result='County laboratory reports inspected',
 d=>d.sources[14].signature_date='2026-09-30',
 d=>d.sources[14].filing_date='2026-11-06',
 d=>d.sources[15].latest_entry_date='2026-11-22',
 d=>d.sources[12].event_date='2025-01-16',
 d=>d.records[4].canonical_id='casebook-gateway-battery-storage',
 d=>d.records[4].new_identity_count=1,
 d=>d.records[4].governed_stage_changed=true,
 d=>d.records[4].series_admitted=true,
 d=>d.records[4].counting_note='Two assets added',
 d=>d.records[4].decision_boundary='Monthly evidence does not exist',
 d=>d.records[4].sections[0].text=d.records[4].sections[0].text.replace('2.20 hours','4.00 hours'),
 d=>d.records[4].sections[1].text='Both older units are permanently retired',
 d=>d.records[4].sections[2].text='991 MW is Manatee available output',
 d=>d.records[4].sections[3].text='The August workbook was freshly extracted',
 d=>d.records[4].sections[4].text='Lansing Smith is an expansion of Manatee',
 d=>d.records[4].sections[5].text='Missing intervals are zero',
 d=>d.records[4].retained_evidence.checked_date='2026-11-22',
 d=>d.records[4].retained_evidence.closure_status='Closed',
 d=>d.records[4].retained_evidence.entity_id='eia-plant-63834',
 d=>d.records[4].retained_evidence.statement='A new interval availability series is accepted',
 d=>d.records[4].retained_evidence.reporting_period='January–August 2026',
 d=>d.records[4].access_limits=[],
 d=>d.records[4].timeline[2].date='2026-04-01',
 d=>d.records[4].sections[0].source_ids=['moss-epa-overview'],
 d=>d.sources[18].publication_date='2026-11-22',
 d=>d.sources[19].access='All PDF pages visually inspected',
 d=>d.sources[20].monthly_release_date='2026-08-01',
 d=>d.sources[20].access='ZIP workbook freshly extracted',
 d=>d.records[5].canonical_id='casebook-moss-landing-battery-safety',
 d=>d.records[5].scope='Gateway Generating Station in Antioch',
 d=>d.records[5].counting_note='Two eligible batteries',
 d=>d.records[5].decision_boundary='Full restoration is accepted',
 d=>d.records[5].governed_stage_changed=true,
 d=>d.records[5].series_admitted=true,
 d=>d.records[5].sections[0].text='250 MW operating on the announcement date',
 d=>d.records[5].sections[1].text='The entire facility stayed offline',
 d=>d.records[5].sections[2].text='Cleanup is complete',
 d=>d.records[5].sections[3].text='All findings accepted closed in October',
 d=>d.records[5].sections[4].text='Delivery occurred in 2025',
 d=>d.records[5].sections[5].text='Missing periods are zero',
 d=>d.records[5].retained_open_rail.captured_date='2026-11-22',
 d=>d.records[5].retained_open_rail.closure_status='Closed',
 d=>d.records[5].retained_open_rail.entity_id='eia-plant-60014',
 d=>d.records[5].retained_open_rail.statement='Fresh queue review proved full restoration',
 d=>d.records[5].timeline[2].date='2024-11-01',
 d=>d.records[5].timeline[4].date='2025-07-07',
 d=>d.records[5].sections[0].source_ids=['manatee-commissioning'],
 d=>d.records[5].access_limits=[],
 d=>d.records[5].access_limits[0].result='All cleanup closeout documents inspected',
 d=>d.sources[22].access='Video fully inspected',
 d=>d.sources[23].snapshot_date='2026-11-22',
 d=>d.sources[24].header_date='2025-07-07',
 d=>d.sources[25].publication_date='2026-11-22',
 d=>d.sources[27].audit_start_date='2025-08-29',
 d=>d.sources[28].role='Regulator acceptance',
 d=>d.sources[28].finding_1_target_date='2025-10-31',
 d=>d.sources[28].issuance_date='2025-09-09',
 d=>d.sources[29].url='https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M584/K052/584052019.PDF',
 d=>d.sources[29].issuance_date='2025-11-20',
 d=>d.sources[29].expected_delivery_date='2025-11-24',
 d=>d.sources[29].access='All tables and page images inspected',
 d=>d.records[6].scope='All global deliveries occurred at Fort Worth',
 d=>d.records[6].new_identity_count=191,
 d=>d.records[6].series_admitted=true,
 d=>d.records[6].sections[0].text='43 plus 1387 newly delivered this quarter',
 d=>d.records[6].sections[1].text='All 2025 deliveries were manufactured that year',
 d=>d.records[6].sections[2].text='Every aircraft capability restriction is independently closed',
 d=>d.records[6].sections[3].text='44 percent of delivered aircraft are defective',
 d=>d.records[6].sections[4].text='All 31 billion dollars in parts are missing',
 d=>d.records[6].sections[5].text='A missing month is zero output',
 d=>d.records[6].retained_research[0].status='Closed',
 d=>d.records[6].retained_research[0].checked_date='2026-11-22',
 d=>d.records[6].retained_research[1].status='Accept ranking',
 d=>d.records[6].retained_research[1].text='The new series reverses the ranking hold',
 d=>d.records[6].timeline[0].date='2024-03-01',
 d=>d.records[6].sections[0].source_ids=['kc46-final-q3'],
 d=>d.records[6].decision_boundary='A governed production stage is admitted',
 d=>d.records[7].scope='Only the KC-46A fleet appears in the GAO audit',
 d=>d.records[7].sections[0].text='The 15 and 7 deliveries sum to 22',
 d=>d.records[7].sections[1].text='All three Air Force articles were freshly inspected',
 d=>d.records[7].sections[2].text='Reconstructed readiness rates are accepted',
 d=>d.records[7].sections[3].text='RVS 2.0 is certified across the entire fleet',
 d=>d.records[7].sections[4].text='A representative sample proves all recommendations closed',
 d=>d.records[7].sections[5].text='Missing observations are zero availability',
 d=>d.records[7].retained_research[0].text='The planned 20 percent improvement is observed',
 d=>d.records[7].retained_research[1].checked_date='2026-11-22',
 d=>d.records[7].retained_research[2].text='The 105th and 25th total 130 aircraft',
 d=>d.records[7].retained_research.pop(),
 d=>d.records[7].access_limits.pop(),
 d=>d.records[7].access_limits[0].result='HTML article body inspected today',
 d=>d.records[7].access_limits[1].url=d.records[7].access_limits[0].url,
 d=>d.records[7].timeline[3].date='2026-09-30',
 d=>d.sources[30].milestone_date='2024-03-01',
 d=>d.sources[31].capability_snapshot_date='2025-09-03',
 d=>d.sources[32].comment_date='2026-11',
 d=>d.sources[33].publication_date='2025-12-31',
 d=>d.sources[34].filing_date='2026-10-22',
 d=>d.sources[34].reporting_end_date='2026-09-30',
 d=>d.sources[35].publication_date='2026-11-22',
 d=>d.sources[36].loss_status_date='2026-11-09',
 d=>d.sources[37].access='Restricted annual rates recovered',
 d=>d.sources[38].artifact_id='INDEPENDENT-SECOND-AUDIT',
 d=>d.sources[39].publication_date='2026-06-30',
 d=>d.sources[40].publication_date='2026-10-27',
 d=>d.sources[41].url=d.sources[40].url
];

for(let i=8;i<11;i++){
 invalid.push(d=>d.records[i].series_admitted=true,d=>d.records[i].new_identity_count=1,d=>d.records[i].counting_note='A second project added',d=>d.records[i].decision_boundary='All evidence gates closed');
 for(let j=0;j<6;j++)invalid.push(d=>d.records[i].sections[j].text='Unsupported replacement claim');
 for(let j=0;j<data.records[i].retained_research.length;j++)invalid.push(d=>d.records[i].retained_research[j].checked_date='2026-11-22');
}
invalid.push(
 d=>d.records[8].sections[0].source_ids=['island-mep'],
 d=>d.records[8].timeline[2].date='2024-01-13',
 d=>d.records[9].retained_research[0].text='Fourteen planned jobs are fourteen completed new jobs',
 d=>d.records[10].retained_research[1].text='All committed credits were issued',
 d=>d.records[10].retained_research[1].status='Closed',
 d=>d.records[10].access_limits[0].result='The exact FDA query confirms zero events',
 d=>d.records[10].access_limits[0].url=d.records[10].access_limits[0].url.replace('2017','2011'),
 d=>d.records[10].access_limits=[],
 d=>d.sources[42].created_date='2024-01-13',
 d=>d.sources[42].event_date='2026-01-13',
 d=>d.sources[43].effective_date='2026-11-22',
 d=>d.sources[46].reporting_date='2026-11-22',
 d=>d.sources[47].closed_date='2026-11-22',
 d=>d.sources[48].created_date='2024-07-01',
 d=>d.sources[49].announcement_date='2021-11-18',
 d=>d.sources[51].expiry_date='2027-10-01',
 d=>d.sources[51].boundary='All listed certificates verified current for Hauppauge',
 d=>d.sources[52].created_date='2024-01-14',
 d=>d.sources[53].announcement_date='2021-01-01',
 d=>d.sources[54].announcement_date='2026-02-27',
 d=>d.sources[55].publication_date='2026-11-22',
 d=>d.sources[56].reporting_end_date='2026-12-31',
 d=>d.sources[56].role='Audited series and verified patient outcomes',
 d=>d.sources[57].role='A finding that Monaghan devices are defective',
 d=>d.sources[57].access='Patient records inspected',
 d=>d.sources[57].url=d.records[10].access_limits[0].url
);


for(let j=0;j<6;j++)invalid.push(d=>d.records[11].sections[j].text='Unsupported replacement claim');
invalid.push(
 d=>d.records[11].new_identity_count=1,
 d=>d.records[11].series_admitted=true,
 d=>d.records[11].governed_stage_changed=true,
 d=>d.records[11].counting_note='A new project',
 d=>d.records[11].decision_boundary='Tier B with no governed conversion file',
 d=>d.records[11].scope='All international Waymo operations',
 d=>d.records[11].retained_research[0].checked_date='2026-11-22',
 d=>d.records[11].retained_research[0].status='Complete',
 d=>d.records[11].retained_research[0].text='No public data exists',
 d=>d.records[11].answer='Unrestricted operation is established',
 d=>d.records[11].timeline.at(-1).event='The order took effect on this publication date',
 d=>d.records[11].access_limits[0].result='The archive contains no data',
 d=>d.records[11].access_limits[0].url='https://example.com/archive.zip',
 d=>d.sources[58].effective_date='2026-11-22',
 d=>d.sources[58].supplement_filing_date='2026-08-14',
 d=>d.sources[59].reporting_end_date='2026-11-17',
 d=>d.sources[59].submission_date='2026-11-01',
 d=>d.sources[59].access='All rows extracted',
 d=>d.sources[60].effective_date='2026-11-22',
 d=>d.sources[60].access='All map images inspected',
 d=>d.sources[61].data_end_date='2026-11',
 d=>d.sources[61].role='Independent regulator finding',
 d=>d.sources[61].access='CSV data independently replicated',
 d=>d.sources[62].publication_date='2026-09-24',
 d=>d.sources[62].data_end_date='2026-10',
 d=>d.sources[63].final_remedy_date='2026-04-20',
 d=>d.sources[63].letter_date='2026-04-20',
 d=>d.sources[64].role='Regulator decision',
 d=>d.sources[64].effective_date='2026-11-18',
 d=>d.sources[64].syndication_date='2026-11-17',
 d=>d.sources[64].access='All PDF page images inspected'
);

for(const [fixtureIndex,mutate] of invalid.entries()){const changed=structuredClone(data);mutate(changed);assert.notDeepEqual(changed,data);const rehashed={...review,edition_sha256:projectRefreshHash(changed),records:review.records.map((p,i)=>({...p,sha256:projectRefreshHash(changed.records[i])}))};assert.throws(()=>validateProjectRefreshes(changed,rehashed),undefined,'invalid fixture '+fixtureIndex);}
const stale=structuredClone(data);stale.records[0].sections[0].text+=' Unreviewed claim.';assert.throws(()=>validateProjectRefreshes(stale));
for(const field of ['human_review_claimed','independent_review_claimed','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'])assert.throws(()=>validateProjectRefreshes(data,{...review,[field]:true}));
assert.throws(()=>validateProjectRefreshes(data,{...review,pilot_followups_sha256:'0'.repeat(64)}));
for(const p of review.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(p.path)).digest('hex'),p.sha256,p.path);
const original=atlas.projects.find(r=>r.atlas_project_id==='119-PROJECT-016');assert.equal(projectRefreshFor(original),data.records[0]);assert.equal(projectRefreshFor(atlas.projects[0]),null);assert.throws(()=>projectRefreshFor({...original,title:'Changed program'}));
assert.deepEqual([currentPortfolioSummary.eligible_projects,currentPortfolioSummary.eligible_places],[100,70]);
const r=data.records[0];assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);assert.equal(readerCatalog.find(c=>c.id===r.record_id).date,data.review_date);
for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,'Project').some(c=>c.id===r.record_id));
assert.equal(readerCatalog.find(c=>c.id==='198-CASE-016').route,r.related[0].route);
const template=await read('src/pages/atlas/projects/[slug].astro');for(const token of ['projectRefreshFor(project)','<CanonicalProjectRefresh record={refreshedArticle} />',"const LegacyContainer=hasCurrentAccount?'details':'div';",'data-recorded-conversion-stage','data-prior-atlas-account'])assert(template.includes(token),token);
assert(template.indexOf('<CanonicalProjectRefresh')<template.indexOf('data-recorded-conversion-stage'));assert(template.indexOf('data-recorded-conversion-stage')<template.indexOf('<LegacyContainer'));
const component=await read('src/components/review/CanonicalProjectRefresh.astro');for(const token of ['data-refresh-section','data-refresh-event','data-refresh-source','data-refresh-pilot-boundary','data-refresh-access-limits','source.boundary','source.access'])assert(component.includes(token));assert(!/<script\b/i.test(component));
const exportSource=await read('src/pages/data/build-decisions.json.ts');assert(exportSource.includes('canonical_project_refreshes:canonicalProjectRefreshes'));assert(exportSource.includes('canonical_project_refresh_review:canonicalProjectRefreshReview'));
const earlierTemplate=await read('src/components/review/CurrentResearchArticle.astro');for(const token of ['Astro.url.pathname===original.route?canonicalProjectRefreshes.records.find','data-later-project-account','This earlier reading retains its own dates and review.'])assert(earlierTemplate.includes(token),token);
assert((await read('src/pages/sitemap.xml.ts')).includes('if(canonicalProjectRefreshes.records.some(r=>r.route===path))lastModified=new Date(canonicalProjectRefreshes.review_date);'));
assert((await read('src/pages/method/portfolio-decisions.astro')).includes('GSA procurement guidance remains excluded'));
assert.equal(projectRefreshHash(history),review.retained_history_sha256);
assert.deepEqual(data.records[0],history.editions[0].data.records[0]);
assert.deepEqual(data.sources.slice(0,4),history.editions[0].data.sources);
assert.deepEqual(data.access_limits,history.editions[0].data.access_limits);
assert.deepEqual(review.records[0],history.editions[0].review.records[0]);
assert.deepEqual(data.records.slice(0,3),history.editions[1].data.records);
assert.deepEqual(data.sources.slice(0,10),history.editions[1].data.sources);
assert.deepEqual(review.records.slice(0,3),history.editions[1].review.records);
assert.deepEqual(data.records.slice(0,4),history.editions[2].data.records);
assert.deepEqual(data.sources.slice(0,16),history.editions[2].data.sources);
assert.deepEqual(review.records.slice(0,4),history.editions[2].review.records);
assert.equal((900/409).toFixed(2),'2.20');
assert.equal(review.historical_inputs_retained.length,30);
assert.deepEqual(data.records.slice(0,6),history.editions[4].data.records);
assert.deepEqual(data.sources.slice(0,30),history.editions[4].data.sources);
assert.deepEqual(review.records.slice(0,6),history.editions[4].review.records);
assert.deepEqual(data.records.slice(0,8),history.editions[5].data.records);
assert.deepEqual(data.sources.slice(0,42),history.editions[5].data.sources);
assert.deepEqual(review.records.slice(0,8),history.editions[5].review.records);
assert.deepEqual(data.records.slice(0,11),history.editions[6].data.records);
assert.deepEqual(data.sources.slice(0,58),history.editions[6].data.sources);
assert.deepEqual(review.records.slice(0,11),history.editions[6].review.records);
assert.equal(Object.keys(review.retained_waymo_inputs).length,4);
for(const key of Object.keys(review.retained_waymo_inputs))assert.throws(()=>validateProjectRefreshes(data,{...review,retained_waymo_inputs:{...review.retained_waymo_inputs,[key]:'0'.repeat(64)}}));
assert(component.includes("const secondaryCount=sources.filter(s=>s.role==='Secondary reported warning').length;"));
assert(component.includes("secondaryCount?"));
assert.equal(Object.keys(review.retained_manufacturing_inputs).length,4);
for(const key of Object.keys(review.retained_manufacturing_inputs))assert.throws(()=>validateProjectRefreshes(data,{...review,retained_manufacturing_inputs:{...review.retained_manufacturing_inputs,[key]:'0'.repeat(64)}}));
assert.equal((105/40).toFixed(3),'2.625');assert.equal(((120/75-1)*100).toFixed(0),'60');assert.equal(((717-156)/717*100).toFixed(1),'78.2');assert.equal((9000/6000-1)*100,50);assert.equal((10-7)/10*100,30);
assert.equal(Object.keys(review.retained_aircraft_inputs).length,9);
for(const key of Object.keys(review.retained_aircraft_inputs))assert.throws(()=>validateProjectRefreshes(data,{...review,retained_aircraft_inputs:{...review.retained_aircraft_inputs,[key]:'0'.repeat(64)}}));
assert.equal(data.records.filter(r=>r.retained_research).length,6);
assert.equal(data.records.flatMap(r=>r.retained_research??[]).length,20);
assert(component.includes("const retainedResearch=('retained_research' in record?record.retained_research:[])??[];"));
for(const token of ['data-refresh-retained-research','data-retained-research-id={item.id}','item.checked_date','item.status','item.text'])assert(component.includes(token));
assert.deepEqual(data.records.slice(0,5),history.editions[3].data.records);
assert.deepEqual(data.sources.slice(0,22),history.editions[3].data.sources);
assert.deepEqual(review.records.slice(0,5),history.editions[3].review.records);
for(const key of ['retained_gateway_open_rail_sha256','retained_gateway_dossier_sha256'])assert.throws(()=>validateProjectRefreshes(data,{...review,[key]:'0'.repeat(64)}));
assert.equal(data.records.filter(r=>r.retained_open_rail).length,1);
for(const token of ['data-refresh-retained-open-rail={retainedOpenRail.coverage_id}','retainedOpenRail.captured_date','retainedOpenRail.statement'])assert(component.includes(token));
assert.throws(()=>validateProjectRefreshes(data,{...review,retained_manatee_acquisition_sha256:'0'.repeat(64)}));
assert.equal(data.records.filter(r=>r.retained_evidence).length,1);
assert(component.includes('data-refresh-retained-evidence={retainedEvidence.acquisition_id}'));
assert(component.includes('retainedEvidence.checked_date'));
assert(component.includes('retainedEvidence.statement'));
const expanded=await read('src/pages/review/casebooks/expanded/[slug].astro');
assert(expanded.includes('r.record_id===atlasProject.atlas_project_id&&r.related[0]?.route===Astro.url.pathname'));
assert(expanded.includes('data-later-project-account={refreshedAccount.record_id}'));
const place=await read('src/pages/atlas/places/[slug].astro');
assert(place.includes('place.relationships.related_project_ids.includes(r.record_id)'));
assert(place.includes('data-related-current-projects={place.atlas_place_id}'));
assert(place.includes('They do not establish a place-wide outcome'));
assert((await read('src/pages/sitemap.xml.ts')).includes("if(['/review/casebooks/expanded/moss-landing-battery-safety/','/atlas/places/california-battery-safety/','/review/casebooks/expanded/manatee-battery-storage/','/atlas/places/florida-utility-storage/','/review/casebooks/expanded/gateway-battery-storage/','/review/casebooks/expanded/f35-production-readiness/','/review/casebooks/expanded/kc46-readiness/','/review/casebooks/expanded/current-applications-capacity/','/review/casebooks/expanded/island-components-capacity/','/review/casebooks/expanded/monaghan-medical-capacity/','/review/casebooks/waymo-california-service/','/atlas/places/california-autonomous-mobility/'].includes(path))"));
assert.throws(()=>validateProjectRefreshes(data,{...review,prior_research_review_sha256:'0'.repeat(64)}));
const casebook=await read('src/pages/review/casebooks/[slug].astro');
assert(casebook.includes('r.related[0]?.route===Astro.url.pathname'));
assert(casebook.includes('data-later-project-account={refreshedAccount.record_id}'));
assert(exportSource.includes('canonical_project_refresh_history:canonicalProjectRefreshHistory'));
for(const r of data.records){
 assert.equal(projectRefreshFor(atlas.projects.find(p=>p.atlas_project_id===r.record_id)),r);
 assert.equal(readerCatalog.filter(c=>c.id===r.record_id&&c.route===r.route).length,1);
 assert.equal(readerCatalog.find(c=>c.id===r.record_id).kind,projectRefreshCatalogKind(r));
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,projectRefreshCatalogKind(r)).some(c=>c.id===r.record_id));
 assert.equal(projectRefreshSources(r).length,r.record_id==='119-PROJECT-008'?7:['119-PROJECT-018','119-PROJECT-020'].includes(r.record_id)?6:r.record_id==='119-PROJECT-019'?4:r.record_id==='119-PROJECT-015'?7:r.record_id==='119-PROJECT-017'?5:r.record_id==='119-PROJECT-011'?8:['119-PROJECT-010','119-PROJECT-009'].includes(r.record_id)?6:r.retained_pilot_id?4:3);
 assert.equal(projectRefreshAccessLimits(r).length,['119-PROJECT-008','119-PROJECT-020'].includes(r.record_id)?1:r.record_id==='119-PROJECT-017'?3:r.record_id==='119-PROJECT-010'?2:['119-PROJECT-009','119-PROJECT-011'].includes(r.record_id)?1:r.retained_pilot_id?3:0);
}
assert(component.includes('projectRefreshSources(record)'));
assert(component.includes('projectRefreshAccessLimits(record)'));
assert(component.includes('record.retained_pilot_id?<section data-refresh-pilot-boundary'));
assert(component.includes('record.counting_note??'));
assert(!component.includes('These four public'));
assert.throws(()=>validateProjectRefreshes(data,{...review,retained_history_sha256:'0'.repeat(64)}));
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const p of ['src/lib/canonical-waymo-refresh.mjs','src/content/updates/2026-11-22-waymo-canonical-account.json','src/lib/canonical-manufacturing-refreshes.mjs','src/content/updates/2026-11-22-manufacturing-canonical-accounts.json','src/content/updates/2026-11-22-aircraft-canonical-accounts.json','src/content/updates/2026-11-22-gateway-canonical-account.json','src/content/updates/2026-11-22-manatee-canonical-account.json','src/pages/review/casebooks/expanded/[slug].astro','src/pages/atlas/places/[slug].astro','src/content/updates/2026-11-22-moss-landing-canonical-account.json','src/data/canonical-project-refresh-history.json','src/pages/review/casebooks/[slug].astro','src/content/updates/2026-11-22-gsa-aria-canonical-accounts.json','src/data/canonical-project-refreshes.json','src/data/canonical-project-refresh-reviews.json','src/lib/canonical-project-refreshes.mjs','src/components/review/CanonicalProjectRefresh.astro','scripts/assert-canonical-project-refreshes.mjs','scripts/verify-canonical-project-refreshes.mjs','src/content/updates/2026-11-22-f15ex-canonical-account.json'])assert(candidate.candidate_digest.artifact_paths.includes(p),p);
console.log('Canonical project refresh checks passed: twelve existing accounts, seventy-two sections, fifty-six dated entries, sixty-five scoped source records; one Waymo, thirteen manufacturing and six aircraft notices preserve earlier dates and decisions; '+invalid.length+' rehashed invalid fixtures rejected; 100/70 counts unchanged.');
