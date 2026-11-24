import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertTuasDossiers,tuasHash} from './lib/assert-tuas-dossiers.mjs';
import {tuasDossiers,tuasAcquisitionFor,tuasAcquisitionPathsFor} from '../src/lib/tuas-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/tuas-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertTuasDossiers(tuasDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].identity_decision.eligible_count=3,
 d=>d.records[0].scope='All Singapore terminals',
 d=>d.records[0].stage='Comparable outcomes accepted',
 d=>d.records[1].scope='Every component is another project',
 d=>d.records[1].stage='Integrated operations accepted',
 d=>d.records[2].scope='The whole country',
 d=>d.records[0].timeline[0].date='2022-09-01',
 d=>d.records[1].timeline[1].date='2021-05',
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-025',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.records[0].sections[0].text=d.records[0].sections[0].text.replace("2040s, rather than the port’s present throughput","2026 as current throughput"),
 d=>d.records[0].sections[1].text=d.records[0].sections[1].text.replace("not as a fresh November 22 census","as a fresh November 22 census"),
 d=>d.records[0].sections[1].text=d.records[0].sections[1].text.replace("PSA can then build the terminal","PSA has commissioned the terminal"),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace("25 million TEUs handled on August 6","25 million physical boxes annually"),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace("September 2022 as the start","December 2021 as the start"),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace("not one year’s throughput or a measure of spare capacity","one year’s throughput and spare capacity"),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace("progressive operation from 2028","full operation in 2026"),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace("Neither the berth total nor the fleet plan becomes an operating inventory","Both are current operating inventory"),
 d=>d.records[1].sections[0].text=d.records[1].sections[0].text.replace("old forecast for completion in 2025–26 should remain history","forecast proves completion"),
 d=>d.records[1].sections[1].text=d.records[1].sections[1].text.replace("650,000-cubic-metre daily treatment module","650,000-litre treatment module"),
 d=>d.records[1].sections[1].text=d.records[1].sections[1].text.replace("150,000 cubic metres per day","150,000 tonnes per day"),
 d=>d.records[1].sections[1].text=d.records[1].sections[1].text.replace("design rates, not measured daily output","measured daily output"),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace("wider design, not the initial phase","initial commissioned phase"),
 d=>d.records[1].sections[3].text=d.records[1].sections[3].text.replace("deep tunnels and link sewers","deep tunnels only"),
 d=>d.records[1].sections[3].text=d.records[1].sections[3].text.replace("does not establish that the whole collection and treatment chain was commissioned","proves whole-chain commissioning"),
 d=>d.records[1].sections[4].text=d.records[1].sections[4].text.replace("40 tonnes of combined food waste and sludge daily","40 tonnes of food waste alone daily"),
 d=>d.records[1].sections[4].text=d.records[1].sections[4].text.replace("pilot evidence at another site, not Tuas throughput","measured Tuas output"),
 d=>d.records[2].sections[1].text=d.records[2].sections[1].text.replace("does not, by itself, establish construction funding","establishes all construction funding"),
 d=>d.records[2].sections[2].text=d.records[2].sections[2].text.replace("not observed ridership or mode share","observed ridership"),
 d=>d.records[2].sections[3].text=d.records[2].sections[3].text.replace("37 submissions","37 awarded construction contracts"),
 d=>d.records[2].sections[4].text=d.records[2].sections[4].text.replace("district-specific future targets, not current regional performance","current regional performance"),
 d=>d.sources.find(s=>s.id==='tuas-volume').reference_period='Calendar year 2026',
 d=>d.sources.find(s=>s.id==='tuas-water').publication_date='2026-03-03',
 d=>d.sources.find(s=>s.id==='west-connections').page_update_date='2026-11-20'
];
for(const mutate of invalid){const changed=structuredClone(tuasDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:tuasHash(changed),sources_sha256:tuasHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:tuasHash(r)}))};assert.throws(()=>assertTuasDossiers(changed,rehashed));}
const stale=structuredClone(tuasDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertTuasDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertTuasDossiers(tuasDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(tuasDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[72,37,28,33],'Retained post-Tuas inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of tuasDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<TuasDossierArticle record={record}/>'));
}
assert.equal(tuasAcquisitionFor('unrelated-record'),undefined);
for(const r of tuasDossiers.records){
 assert.equal(tuasAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=tuasAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/TuasDossierLinks.astro');
assert(notice.includes('data-current-tuas-acquisition')&&notice.includes('retained history')&&notice.includes('tuasDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<TuasDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...tuasDossiers.records.map(record=>urlEntry(record.route,new Date(tuasDossiers.inspected_date)))'));
for(const token of ['tuas_named_dossiers:tuasDossiers','tuas_named_dossier_reviews:tuasReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-tuas-index'));
const component=await read('src/components/review/TuasDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-tuas-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,tuasDossiers.records.map(r=>r.record_id));for(const r of tuasDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Tuas source checks passed: three exact-version articles, 18 sections, thirteen chronology events, fifteen inspected sources and three additive acquisition links; post-cohort inventory 72/37; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
