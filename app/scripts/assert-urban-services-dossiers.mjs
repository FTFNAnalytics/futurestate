import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertUrbanServicesDossiers,urbanServicesHash,urbanServicesCriticalPhrases} from './lib/assert-urban-services-dossiers.mjs';
import {urbanServicesDossiers,urbanServicesAcquisitionFor,urbanServicesAcquisitionPathsFor} from '../src/lib/urban-services-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/urban-services-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertUrbanServicesDossiers(urbanServicesDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].identity_decision.eligible_count=4,
 d=>d.records[0].scope='Four separately counted projects',
 d=>d.records[0].stage='Housing occupied and Metro open',
 d=>d.records[1].scope='All of the autonomous community',
 d=>d.records[1].stage='Citywide outcomes accepted',
 d=>d.records[2].scope='All metropolitan municipalities',
 d=>d.records[2].stage='Current service verified',
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-006',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='mnn-metro').event_date='2026-10-21',
 d=>d.sources.find(s=>s.id==='mnn-metro').gazette_date='2026-10-16',
 d=>d.sources.find(s=>s.id==='mnn-water').publication_date='2021-03-04',
 d=>d.sources.find(s=>s.id==='cdmx-register').reference_period='Fiscal year 2026',
 d=>d.sources.find(s=>s.id==='cdmx-boundary').reference_period='November 2026 survey',
 ...urbanServicesDossiers.sources.filter(s=>s.id.startsWith('cdmx-')).map(s=>d=>{d.sources.find(x=>x.id===s.id).inspection='Live page inspected';}),
 ...urbanServicesCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(urbanServicesDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:urbanServicesHash(changed),sources_sha256:urbanServicesHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:urbanServicesHash(r)}))};assert.throws(()=>assertUrbanServicesDossiers(changed,rehashed));}
const stale=structuredClone(urbanServicesDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertUrbanServicesDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertUrbanServicesDossiers(urbanServicesDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(urbanServicesDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[74,41,26,29],'Retained post-urban-services inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const boundAcquisitions=namedDossierAdditions.filter(r=>r.historical_acquisition).map(r=>r.historical_acquisition.record_id);
assert.equal(new Set(boundAcquisitions).size,boundAcquisitions.length,'Acquisition docket reused');
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of urbanServicesDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<UrbanServicesDossierArticle record={record}/>'));
}
assert.equal(urbanServicesAcquisitionFor('unrelated-record'),undefined);
for(const r of urbanServicesDossiers.records){
 assert.equal(urbanServicesAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=urbanServicesAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/UrbanServicesDossierLinks.astro');
assert(notice.includes('data-current-urban-services-acquisition')&&notice.includes('retained history')&&notice.includes('urbanServicesDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<UrbanServicesDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...urbanServicesDossiers.records.map(record=>urlEntry(record.route,new Date(urbanServicesDossiers.inspected_date)))'));
for(const token of ['urban_services_named_dossiers:urbanServicesDossiers','urban_services_named_dossier_reviews:urbanServicesReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-urban-services-index'));
const component=await read('src/components/review/UrbanServicesDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-urban-services-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,urbanServicesDossiers.records.map(r=>r.record_id));for(const r of urbanServicesDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Urban-service source checks passed: three exact-version articles, 18 sections, eleven chronology events, fifteen source records with explicit retrieval limits and three additive acquisition links; post-cohort inventory 74/41; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
