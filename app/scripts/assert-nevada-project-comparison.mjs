import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {nevadaComparison as data,nevadaComparisonReview as review,nevadaComparisonHash as hash,validateNevadaComparison,nevadaComparisonFor,nevadaComparisonForPriorRoute,nevadaComparisonSources} from '../src/lib/nevada-project-comparison.mjs';
import {canonicalReaderForProject,canonicalReaderForPlace} from '../src/lib/canonical-reader-bindings.mjs';
import {canonicalAnnualForProject} from '../src/lib/canonical-annual-reader-bindings.mjs';
import {projectRefreshFor,projectRefreshCatalogKind} from '../src/lib/canonical-project-refreshes.mjs';
import {selectedArticleReviewFor} from '../src/lib/selected-article-reviews.mjs';
import {placeReadingFor} from '../src/lib/canonical-place-readings.mjs';
import {regionalReadingFor} from '../src/lib/canonical-regional-readings.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import editorial from '../src/data/phase-205-216-current-editorial.json' with {type:'json'};
import portfolio from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
import {currentPortfolioSummary} from '../src/lib/current-named-dossiers.mjs';
import {evidenceReceiptsForRoute} from '../src/lib/current-evidence.mjs';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const flags=['human_review_claimed','independent_review_claimed','fresh_external_source_check','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'];
const resign=(d,r)=>{r.edition_sha256=hash(d);if(d.records[0])r.records[0].sha256=hash(d.records[0]);};
const negative=[
 d=>d.records=[],d=>d.records.push(structuredClone(d.records[0])),d=>d.sources.pop(),d=>d.sources.push(structuredClone(d.sources[0])),
 d=>d.review_date='2026-11-21',d=>d.source_inspection_date='2026-11-22',...flags.map(k=>d=>{d[k]=true;}),
 d=>d.records[0].record_id='119-PROJECT-001',d=>d.records[0].canonical_id='unrelated',d=>d.records[0].kind='Project',d=>d.records[0].route='/atlas/projects/unrelated/',d=>d.records[0].prior_route='/unrelated/',
 d=>d.records[0].eligible_count=1,d=>d.records[0].new_identity_count=1,d=>d.records[0].governed_stage_changed=true,d=>d.records[0].series_admitted=true,
 d=>d.records[0].retained_named_file_id='61-PROJECT-NEW',d=>d.records[0].retained_gate_id='63-GATE-NEW',d=>d.records[0].current_cycle_id='60-CYCLE-DARPA-RESULTS',d=>d.records[0].next_check_date='2026-12-21',
 d=>d.records[0].sections.pop(),d=>d.records[0].sections[0].text='Unsupported combined project outcome',d=>d.records[0].sections[0].source_ids=['unrelated'],d=>d.records[0].next_artifacts=[],
 d=>d.records[0].related.reverse(),d=>d.records[0].aliases=['Unrelated'],d=>d.records[0].scope='Unbounded',
 ...data.sources.flatMap((_,i)=>[d=>d.sources[i].boundary='Accepted output without qualification',d=>d.sources[i].url='https://example.com/unrelated']),
 ...data.records[0].comparison_rows.flatMap((_,i)=>[d=>d.records[0].comparison_rows[i].thacker.text='Both projects are in operation',d=>d.records[0].comparison_rows[i].rhyolite.source_ids=['lac-q3-2026']]),
 d=>d.records[0].sections[1].text=d.records[0].sections[1].text.replace('not completion certificates','accepted completion certificates'),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace('final investment decision as TBA','final investment decision as completed'),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace('does not update financing status','updates financing status'),
 d=>d.records[0].sections[4].text=d.records[0].sections[4].text.replace('not a new court judgment or evidence of universal consent','a new court judgment and evidence of universal consent'),
 d=>d.records[0].sections[5].text=d.records[0].sections[5].text.replace('no Phase 60 identity or dated appointment','a new Phase 60 identity and appointment')
];
for(const mutate of negative){const d=structuredClone(data),r=structuredClone(review);mutate(d);assert.notDeepEqual(d,data);resign(d,r);assert.throws(()=>validateNevadaComparison(d,r));}
for(const key of flags)assert.throws(()=>validateNevadaComparison(data,{...review,[key]:true}));
for(const key of ['retained_nevada_edition_sha256','retained_nevada_review_sha256','retained_file_sha256','retained_gate_sha256'])assert.throws(()=>validateNevadaComparison(data,{...review,[key]:'0'.repeat(64)}));
for(const pin of review.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,pin.path);
const record=data.records[0],project=atlas.projects.find(p=>p.atlas_project_id===record.record_id);
assert.equal(nevadaComparisonFor(project),record);assert.equal(nevadaComparisonForPriorRoute(record.prior_route),record);
assert.equal(nevadaComparisonFor({atlas_project_id:'unbound'}),null);assert.equal(nevadaComparisonForPriorRoute('/unbound/'),null);
assert.throws(()=>nevadaComparisonFor({...project,title:'Changed'}));assert.throws(()=>nevadaComparisonSources(structuredClone(record)));
assert.equal(nevadaComparisonSources(record).length,8);assert.equal(evidenceReceiptsForRoute(record.route).length,0);
assert.equal(readerCatalog.filter(r=>r.id===record.record_id&&r.route===record.route&&r.kind==='Context').length,1);
assert.equal(searchReaders(readerCatalog,record.canonical_id,'Context').length,1);assert.equal(searchReaders(readerCatalog,record.canonical_id,'Project').length,0);
assert.equal(new Set(readerCatalog.map(r=>r.id)).size,readerCatalog.length);
assert.deepEqual([currentPortfolioSummary.eligible_projects,currentPortfolioSummary.eligible_places],[100,70]);
// Direct route-bound selected readings are first-class accounts, not missing mappings.
for(const p of atlas.projects){
 const article=editorial.records.find(r=>r.record_id===p.atlas_project_id),direct=article?selectedArticleReviewFor(article,{route:p.routes.atlas}):null;
 const accounts=[canonicalReaderForProject(p),canonicalAnnualForProject(p),projectRefreshFor(p),direct,nevadaComparisonFor(p)].filter(Boolean);
 assert.equal(accounts.length,1,p.atlas_project_id+': exactly one dedicated current account');
}
assert.equal(atlas.projects.length,24);
const excludedProjects=atlas.projects.filter(p=>portfolio.canonical.find(x=>x.record_id===p.canonical_id)?.eligible_count===0);
assert.deepEqual(excludedProjects.map(p=>p.atlas_project_id),['119-PROJECT-004','119-PROJECT-005','119-PROJECT-006','119-PROJECT-023']);
for(const p of excludedProjects){const item=readerCatalog.find(x=>x.route===p.routes.atlas);assert(item&&item.kind==='Context');assert(!searchReaders(readerCatalog,p.canonical_id,'Project').some(x=>x.route===p.routes.atlas));}
const gsa=projectRefreshFor(atlas.projects.find(p=>p.atlas_project_id==='119-PROJECT-006'));assert.equal(gsa.kind,'Project','Preserve the assessed input');assert.equal(projectRefreshCatalogKind(gsa),'Context');assert.throws(()=>projectRefreshCatalogKind({...gsa}));
for(const p of atlas.places)assert.equal([canonicalReaderForPlace(p),placeReadingFor(p),regionalReadingFor(p)].filter(Boolean).length,1,p.atlas_place_id);
assert.equal(atlas.places.length,15);
const template=await read('src/pages/atlas/projects/[slug].astro');
for(const fragment of ['nevadaComparisonFor(project)','hasCurrentAccount=Boolean(canonicalReader||refreshedArticle||annualReader||directArticleReview||comparisonAccount)','data-excluded-project-context','<NevadaProjectComparison record={comparisonAccount}'])assert(template.includes(fragment),fragment);
assert(template.includes('excludedFromProjectTarget&&<p data-excluded-project-context'));
assert(template.indexOf('<NevadaProjectComparison')<template.indexOf('data-recorded-conversion-stage'));assert(template.indexOf('data-recorded-conversion-stage')<template.indexOf('<LegacyContainer'));
const component=await read('src/components/review/NevadaProjectComparison.astro');
for(const fragment of ['max-width:76ch','line-height:1.75',':focus-visible','<caption>','scope="col"','scope="row"','data-nevada-current-links','no fresh source check or independent review is claimed'])assert(component.includes(fragment));
for(const [path,fragment] of [
 ['src/pages/review/casebooks/[slug].astro','data-nevada-comparison-link'],
 ['src/pages/data/build-decisions.json.ts','nevada_project_comparison_review:nevadaComparisonReview'],
 ['src/pages/sitemap.xml.ts','nevadaComparison.records.some'],
 ['src/pages/method/portfolio-decisions.astro','data-nevada-comparison-summary'],
 ['scripts/verify-authorized-build.mjs',"import './verify-nevada-project-comparison.mjs'"]
])assert((await read(path)).includes(fragment),path);
const update=JSON.parse(await read('src/content/updates/2026-11-22-nevada-project-comparison.json'));assert.deepEqual(update.affected_record_ids,[record.record_id,'119-PROJECT-004','119-PROJECT-006','119-PROJECT-023']);
console.log('Nevada comparison passed: one excluded Context, zero new projects, six sections, three comparison rows and eight exact retained sources. '+negative.length+' rehashed invalid editions plus review/runtime mutations rejected. All 24 original project and 15 place routes have exactly one dedicated current account; TSMC/Hanford direct assessments included. Historical files, dates, gates and 100/70 eligibility unchanged; production remains separate.');
