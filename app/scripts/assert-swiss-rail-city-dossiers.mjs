import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertSwissRailCityDossiers,swissRailCityHash,swissRailCityCriticalPhrases} from './lib/assert-swiss-rail-city-dossiers.mjs';
import {swissRailCityDossiers} from '../src/lib/swiss-rail-city-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/swiss-rail-city-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertSwissRailCityDossiers(swissRailCityDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].sections[0].source_ids=['ceneri-opening'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].identity_decision.eligible_count=2,
 d=>d.records[0].scope='The entire NRLA programme',
 d=>d.records[1].scope='Alias of the Gotthard tunnel',
 d=>d.records[2].scope='All of Canton Zürich',
 d=>d.records[0].stage='All freight outcomes admitted',
 d=>d.records[1].stage='All regional services reliable',
 d=>d.records[2].stage='Discount fare available now',
 ...swissRailCityDossiers.records.map((_record,i)=>d=>{d.records[i].historical_acquisition={record_id:'191-PROJECT-006'};}),
 d=>d.records[1].timeline[2].event='Observed first service on this date',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='gotthard-return').updated_date='2023-08-16',
 d=>d.sources.find(s=>s.id==='gotthard-freight').reference_period='Gotthard only 2026',
 d=>d.sources.find(s=>s.id==='ceneri-permit').scheduled_date='2020-12-01',
 d=>d.sources.find(s=>s.id==='zurich-fares').publication_date='2026-09-28',
 d=>d.sources.find(s=>s.id==='zurich-fares').period_basis='An assumed day',
 d=>d.sources.find(s=>s.id==='zurich-water-data').reference_period='Inspected raw 2026 measurements',
 ...swissRailCityDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).inspection='All linked files and current service inspected';}),
 ...swissRailCityCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(swissRailCityDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:swissRailCityHash(changed),sources_sha256:swissRailCityHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:swissRailCityHash(r)}))};assert.throws(()=>assertSwissRailCityDossiers(changed,rehashed));}
const stale=structuredClone(swissRailCityDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertSwissRailCityDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertSwissRailCityDossiers(swissRailCityDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(swissRailCityDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[77,44,23,26],'Retained post-swiss-rail-city inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const boundAcquisitions=namedDossierAdditions.filter(r=>r.historical_acquisition).map(r=>r.historical_acquisition.record_id);
assert.equal(new Set(boundAcquisitions).size,boundAcquisitions.length,'Acquisition docket reused');
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of swissRailCityDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<SwissRailCityDossierArticle record={record}/>'));
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...swissRailCityDossiers.records.map(record=>urlEntry(record.route,new Date(swissRailCityDossiers.inspected_date)))'));
for(const token of ['swiss_rail_city_named_dossiers:swissRailCityDossiers','swiss_rail_city_named_dossier_reviews:swissRailCityReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-swiss-rail-city-index'));
const component=await read('src/components/review/SwissRailCityDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','source.period_basis','New named identity with no reused historical acquisition docket.'])assert(component.includes(token));
assert(!component.includes('record.historical_acquisition'));
for(const r of swissRailCityDossiers.records)assert(!Object.hasOwn(r,'historical_acquisition'));
const update=JSON.parse(await read('src/content/updates/2026-11-22-swiss-rail-city-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,swissRailCityDossiers.records.map(r=>r.record_id));for(const r of swissRailCityDossiers.records){assert(update.related_paths.includes(r.route));}
console.log('Swiss rail/city source checks passed: three exact-version articles, 18 sections, thirteen chronology events, fifteen HTML records, three distinct new identities; post-cohort inventory 77/44; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
