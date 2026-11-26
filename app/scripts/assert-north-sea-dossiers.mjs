import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertNorthSeaDossiers,northSeaHash} from './lib/assert-north-sea-dossiers.mjs';
import {northSeaDossiers,northSeaAcquisitionFor,northSeaAcquisitionPathsFor} from '../src/lib/north-sea-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/north-sea-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertNorthSeaDossiers(northSeaDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].stage='Certified sustained reliability',
 d=>d.records[0].identity_decision.eligible_count=3,
 d=>d.records[0].scope='Every phase and customer counts separately',
 d=>d.records[1].scope='The pre-2020 smaller municipality',
 d=>d.records[2].scope='The entire metropolitan region',
 d=>d.records[0].timeline[0].date='2025-08-25',
 d=>d.records[1].timeline[0].date='2021-01-01',
 d=>d.records[0].sections[1].text=d.records[0].sections[1].text.replace('99.81 mole percent','99.81 mass percent'),
 d=>d.records[0].sections[1].text=d.records[0].sections[1].text.replace('30 ppm-mol','30 percent'),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace('not a reported annual quantity stored','a reported annual quantity stored'),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace('2028–2029','2028'),
 d=>d.records[0].sections[4].text=d.records[0].sections[4].text.replace('not a capture-inclusive removal rate','a capture-inclusive removal rate'),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace('still supplied no replacement date and expected opening after 2027','confirmed opening in 2027'),
 d=>d.records[1].sections[3].text=d.records[1].sections[3].text.replace('not a substitute for dated interruption','proof of no interruption'),
 d=>d.records[2].sections[2].text=d.records[2].sections[2].text.replace('not a measured citywide reduction in flood damage','a measured citywide reduction in flood damage'),
 d=>d.records[2].sections[4].text=d.records[2].sections[4].text.replace('cannot become a score for Rotterdam households','can become a score for Rotterdam households'),
 d=>d.records[2].sections[5].text=d.records[2].sections[5].text.replace('not evidence that the two municipalities share the same hazards or a proven Northern Lights cargo route','proof of a Northern Lights cargo route'),
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-030',
 d=>d.sources[0].interpretation_note='',
 d=>d.sources.find(s=>s.id==='nl-completion').event_date='2025-10-29',
 d=>d.sources.find(s=>s.id==='nl-cargo-specification').publication_date='2025-06-23',
 d=>d.sources.find(s=>s.id==='nl-footprint-model').publication_date='2023-11-01',
 d=>d.sources.find(s=>s.id==='nl-wastewater-pilot').reference_period='Annual measured delivery in 2026',
 d=>d.sources.find(s=>s.id==='sotra-november-local').event_date='2026-11-20',
 d=>d.sources.find(s=>s.id==='rotterdam-benthemplein').publication_date='2013-12-04',
 d=>d.sources.find(s=>s.id==='rotterdam-grp').reference_period='No extension beyond 2025',
 d=>d.phase_60_identity_added=true
];
for(const mutate of invalid){const changed=structuredClone(northSeaDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:northSeaHash(changed),sources_sha256:northSeaHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:northSeaHash(r)}))};assert.throws(()=>assertNorthSeaDossiers(changed,rehashed));}
const stale=structuredClone(northSeaDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertNorthSeaDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertNorthSeaDossiers(northSeaDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(northSeaDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[66,34,34,36],'Retained post-North Sea inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of northSeaDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<NorthSeaDossierArticle record={record}/>'));
}
assert.equal(northSeaAcquisitionFor('unrelated-record'),undefined);
for(const r of northSeaDossiers.records){
 assert.equal(northSeaAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=northSeaAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/NorthSeaDossierLinks.astro');
assert(notice.includes('data-current-north-sea-acquisition')&&notice.includes('retained history')&&notice.includes('northSeaDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<NorthSeaDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...northSeaDossiers.records.map(record=>urlEntry(record.route,new Date(northSeaDossiers.inspected_date)))'));
for(const token of ['north_sea_named_dossiers:northSeaDossiers','north_sea_named_dossier_reviews:northSeaReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-north-sea-index'));
const component=await read('src/components/review/NorthSeaDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-north-sea-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,northSeaDossiers.records.map(r=>r.record_id));for(const r of northSeaDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('North Sea source checks passed: three exact-version articles, 18 sections, eleven chronology events, sixteen inspected sources and three additive acquisition links; post-cohort inventory 66/34; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
