import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertStockholmDossiers,stockholmHash} from './lib/assert-stockholm-dossiers.mjs';
import {stockholmDossiers,stockholmAcquisitionFor,stockholmAcquisitionPathsFor} from '../src/lib/stockholm-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/stockholm-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertStockholmDossiers(stockholmDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].stage='Fully open and reliable',
 d=>d.records[0].identity_decision.eligible_count=3,
 d=>d.records[0].scope='The entire E4 and all connected routes',
 d=>d.records[1].scope='Each bridge and terminal counts separately',
 d=>d.records[1].stage='All passenger and water operations accepted',
 d=>d.records[2].scope='The entire Stockholm County',
 d=>d.records[0].timeline[0].date='2026-04-23',
 d=>d.records[1].timeline[2].date='2026-11-13',
 d=>d.records[0].sections[1].text=d.records[0].sections[1].text.replace('the first opening remains future-dated','the first opening is complete'),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace('not a statement that the full bypass will operate as a one-lane road','proof of a one-lane full bypass'),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace('not a public-service reliability series','a public-service reliability series'),
 d=>d.records[0].sections[4].text=d.records[0].sections[4].text.replace('does not establish the present court disposition','establishes the present court disposition'),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace('November 16 body update','October 16 body update'),
 d=>d.records[1].sections[3].text=d.records[1].sections[3].text.replace('still gave no fixed date for passenger traffic','confirmed passenger service had opened'),
 d=>d.records[1].sections[4].text=d.records[1].sections[4].text.replace('without actors representing passengers','with actors representing passengers'),
 d=>d.records[1].sections[4].text=d.records[1].sections[4].text.replace('exact publication day is left unspecified','exact publication day is November 21'),
 d=>d.records[2].sections[3].text=d.records[2].sections[3].text.replace('sampling in 2025','sampling in 2026'),
 d=>d.records[2].sections[3].text=d.records[2].sections[3].text.replace('neither a maximum nor a current reading','a maximum and current reading'),
 d=>d.records[2].sections[4].text=d.records[2].sections[4].text.replace('does not itself establish the survey’s numerical results','establishes the survey’s numerical results'),
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-019',
 d=>d.sources[0].interpretation_note='',
 d=>d.sources.find(s=>s.id==='bypass-groundwater-2021').document_date='2026-04-23',
 d=>d.sources.find(s=>s.id==='bypass-exercise').reference_period='Exercise held November 10, 2026',
 d=>d.sources.find(s=>s.id==='slussen-water-works').footer_updated_date='2026-11-16',
 d=>d.sources.find(s=>s.id==='slussen-week47').publication_date='2026-11-21',
 d=>d.sources.find(s=>s.id==='stockholm-northwest-water-2025').reference_period='2026 sampling programme',
 d=>d.sources.find(s=>s.id==='stockholm-northwest-water-2025').publication_date='2026-03-30',
 d=>d.phase_60_identity_added=true
];
for(const mutate of invalid){const changed=structuredClone(stockholmDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:stockholmHash(changed),sources_sha256:stockholmHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:stockholmHash(r)}))};assert.throws(()=>assertStockholmDossiers(changed,rehashed));}
const stale=structuredClone(stockholmDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertStockholmDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertStockholmDossiers(stockholmDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(stockholmDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[68,35,32,35],'Retained post-Stockholm inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of stockholmDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<StockholmDossierArticle record={record}/>'));
}
assert.equal(stockholmAcquisitionFor('unrelated-record'),undefined);
for(const r of stockholmDossiers.records){
 assert.equal(stockholmAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=stockholmAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/StockholmDossierLinks.astro');
assert(notice.includes('data-current-stockholm-acquisition')&&notice.includes('retained history')&&notice.includes('stockholmDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<StockholmDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...stockholmDossiers.records.map(record=>urlEntry(record.route,new Date(stockholmDossiers.inspected_date)))'));
for(const token of ['stockholm_named_dossiers:stockholmDossiers','stockholm_named_dossier_reviews:stockholmReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-stockholm-index'));
const component=await read('src/components/review/StockholmDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-stockholm-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,stockholmDossiers.records.map(r=>r.record_id));for(const r of stockholmDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Stockholm source checks passed: three exact-version articles, 18 sections, eleven chronology events, seventeen inspected sources and three additive acquisition links; post-cohort inventory 68/35; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
