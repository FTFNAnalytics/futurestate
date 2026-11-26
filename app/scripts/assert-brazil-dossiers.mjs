import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertBrazilDossiers,brazilHash} from './lib/assert-brazil-dossiers.mjs';
import {brazilDossiers,brazilAcquisitionFor,brazilAcquisitionPathsFor} from '../src/lib/brazil-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/brazil-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertBrazilDossiers(brazilDossiers,reviews);
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
 d=>d.records[1].scope='Every terminal counts separately',
 d=>d.records[2].scope='The entire Norte Fluminense region',
 d=>d.records[2].timeline[0].date='2023',
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace('should not invent a first-service date','can invent a first-service date'),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace('not a new issuance','a new issuance'),
 d=>d.records[1].sections[1].text=d.records[1].sections[1].text.replace('cannot be added directly to tonnes','can be added directly to tonnes'),
 d=>d.records[1].sections[3].text=d.records[1].sections[3].text.replace('Capability is not a report of the fuel actually used','Capability proves actual fuel use'),
 d=>d.records[2].sections[2].text=d.records[2].sections[2].text.replace('published on November 18, not held that day','held November 18'),
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-031',
 d=>d.sources[0].interpretation_note='',
 d=>d.sources.find(s=>s.id==='rmc-fourth-amendment').document_date='2026-06-26',
 d=>d.sources.find(s=>s.id==='rmc-fourth-amendment').effective_date='2024-05-10',
 d=>d.sources.find(s=>s.id==='rmc-tariff-125').application_date='2025-07-18',
 d=>d.sources.find(s=>s.id==='acu-financial-2025').publication_date='2026-03-01',
 d=>d.sources.find(s=>s.id==='sjb-environment-minutes').event_date='2026-11-18',
 d=>d.sources.find(s=>s.id==='sjb-education-plan').reference_period='Current 2026 population and schools',
 d=>d.phase_60_identity_added=true
];
for(const mutate of invalid){const changed=structuredClone(brazilDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:brazilHash(changed),sources_sha256:brazilHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:brazilHash(r)}))};assert.throws(()=>assertBrazilDossiers(changed,rehashed));}
const stale=structuredClone(brazilDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertBrazilDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertBrazilDossiers(brazilDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(brazilDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[65,32,35,38],'Retained post-Brazil inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of brazilDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<BrazilDossierArticle record={record}/>'));
}
assert.equal(brazilAcquisitionFor('unrelated-record'),undefined);
for(const r of brazilDossiers.records){
 assert.equal(brazilAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=brazilAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/BrazilDossierLinks.astro');
assert(notice.includes('data-current-brazil-acquisition')&&notice.includes('retained history')&&notice.includes('brazilDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<BrazilDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...brazilDossiers.records.map(record=>urlEntry(record.route,new Date(brazilDossiers.inspected_date)))'));
for(const token of ['brazil_named_dossiers:brazilDossiers','brazil_named_dossier_reviews:brazilReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-brazil-index'));
const component=await read('src/components/review/BrazilDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.index_url'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-brazil-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,brazilDossiers.records.map(r=>r.record_id));for(const r of brazilDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Brazil source checks passed: three exact-version articles, 18 sections, ten chronology events, twelve inspected sources and three additive acquisition links; post-cohort inventory 65/32; 27 invalid fixtures rejected. Production acceptance remains separate.');
