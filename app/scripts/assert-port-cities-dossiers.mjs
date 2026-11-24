import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertPortCitiesDossiers,portCitiesHash,portCitiesCriticalPhrases} from './lib/assert-port-cities-dossiers.mjs';
import {portCitiesDossiers,portCitiesAcquisitionFor,portCitiesAcquisitionPathsFor} from '../src/lib/port-cities-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/port-cities-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertPortCitiesDossiers(portCitiesDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].identity_decision.eligible_count=3,
 d=>d.records[0].scope='All ports and municipalities',
 d=>d.records[0].stage='Comparable outcomes accepted',
 d=>d.records[1].scope='The entire maritime region',
 d=>d.records[1].stage='Citywide outcomes accepted',
 d=>d.records[2].scope='The whole metropolitan region',
 d=>d.records[2].stage='Citywide outcomes accepted',
 d=>d.records[0].timeline[0].date='1995-01-01',
 d=>d.records[1].timeline[0].date='2023-09-01',
 d=>d.records[2].timeline[0].event='Groundbreaking on an exact day',
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-023',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='busan-port-demo').event_date='2023-10-30',
 d=>d.sources.find(s=>s.id==='busan-port-opening').publication_date='2024-04-05',
 d=>d.sources.find(s=>s.id==='busan-port-opening').language='English',
 d=>d.sources.find(s=>s.id==='busan-districts').boundary='Current population',
 d=>d.sources.find(s=>s.id==='hamburg-summer').reference_period='All city residents in 2026',
 d=>d.sources.find(s=>s.id==='hamburg-water-cargo').language='English',
 ...portCitiesCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(portCitiesDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:portCitiesHash(changed),sources_sha256:portCitiesHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:portCitiesHash(r)}))};assert.throws(()=>assertPortCitiesDossiers(changed,rehashed));}
const stale=structuredClone(portCitiesDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertPortCitiesDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertPortCitiesDossiers(portCitiesDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(portCitiesDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[73,39,27,31],'Retained post-port-cities inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of portCitiesDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<PortCitiesDossierArticle record={record}/>'));
}
assert.equal(portCitiesAcquisitionFor('unrelated-record'),undefined);
for(const r of portCitiesDossiers.records){
 assert.equal(portCitiesAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=portCitiesAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/PortCitiesDossierLinks.astro');
assert(notice.includes('data-current-port-cities-acquisition')&&notice.includes('retained history')&&notice.includes('portCitiesDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<PortCitiesDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...portCitiesDossiers.records.map(record=>urlEntry(record.route,new Date(portCitiesDossiers.inspected_date)))'));
for(const token of ['port_cities_named_dossiers:portCitiesDossiers','port_cities_named_dossier_reviews:portCitiesReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-port-cities-index'));
const component=await read('src/components/review/PortCitiesDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-port-cities-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,portCitiesDossiers.records.map(r=>r.record_id));for(const r of portCitiesDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Port-city source checks passed: three exact-version articles, 18 sections, thirteen chronology events, fifteen inspected sources and three additive acquisition links; post-cohort inventory 73/39; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
