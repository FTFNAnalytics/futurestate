import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertNordicCitiesDossiers,nordicCitiesHash,nordicCitiesCriticalPhrases} from './lib/assert-nordic-cities-dossiers.mjs';
import {nordicCitiesDossiers,nordicCitiesAcquisitionFor,nordicCitiesAcquisitionPathsFor} from '../src/lib/nordic-cities-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/nordic-cities-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertNordicCitiesDossiers(nordicCitiesDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].identity_decision.eligible_count=17,
 d=>d.records[0].scope='All Metro branches',
 d=>d.records[0].stage='Operator transfer complete',
 d=>d.records[1].scope='All Greater Copenhagen',
 d=>d.records[1].stage='Carbon neutrality achieved',
 d=>d.records[2].scope='All regional municipalities',
 d=>d.records[2].stage='All systems reliable',
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-007',
 d=>d.records[1].historical_acquisition={record_id:'192-PLACE-003'},
 d=>d.records[2].historical_acquisition={record_id:'192-PLACE-003'},
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='hel-heat').event_date='2025-05-30',
 d=>d.sources.find(s=>s.id==='hel-water').reference_period='Calendar year 2026',
 d=>d.sources.find(s=>s.id==='cph-climate').publication_date='2025-09-18',
 d=>d.sources.find(s=>s.id==='m3-january').reference_period='M3 only, November 2026',
 ...nordicCitiesDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).inspection='Live service verified';}),
 ...nordicCitiesCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(nordicCitiesDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:nordicCitiesHash(changed),sources_sha256:nordicCitiesHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:nordicCitiesHash(r)}))};assert.throws(()=>assertNordicCitiesDossiers(changed,rehashed));}
const stale=structuredClone(nordicCitiesDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertNordicCitiesDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertNordicCitiesDossiers(nordicCitiesDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(nordicCitiesDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[75,43,25,27],'Retained post-nordic-cities inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const boundAcquisitions=namedDossierAdditions.filter(r=>r.historical_acquisition).map(r=>r.historical_acquisition.record_id);
assert.equal(new Set(boundAcquisitions).size,boundAcquisitions.length,'Acquisition docket reused');
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of nordicCitiesDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<NordicCitiesDossierArticle record={record}/>'));
}
assert.equal(nordicCitiesAcquisitionFor('unrelated-record'),undefined);
for(const r of nordicCitiesDossiers.records){
 if(!r.historical_acquisition){assert.deepEqual(nordicCitiesAcquisitionPathsFor(r),[]);continue;}
 assert.equal(nordicCitiesAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=nordicCitiesAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/NordicCitiesDossierLinks.astro');
assert(notice.includes('data-current-nordic-cities-acquisition')&&notice.includes('retained history')&&notice.includes('nordicCitiesDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<NordicCitiesDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...nordicCitiesDossiers.records.map(record=>urlEntry(record.route,new Date(nordicCitiesDossiers.inspected_date)))'));
for(const token of ['nordic_cities_named_dossiers:nordicCitiesDossiers','nordic_cities_named_dossier_reviews:nordicCitiesReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-nordic-cities-index'));
const component=await read('src/components/review/NordicCitiesDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-nordic-cities-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,nordicCitiesDossiers.records.map(r=>r.record_id));for(const r of nordicCitiesDossiers.records){assert(update.related_paths.includes(r.route));if(r.historical_acquisition)assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Nordic-city source checks passed: three exact-version articles, 18 sections, eleven chronology events, fifteen HTML source records; one acquisition link and two new municipal identities; post-cohort inventory 75/43; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
