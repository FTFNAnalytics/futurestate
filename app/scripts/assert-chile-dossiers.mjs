import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertChileDossiers,chileHash} from './lib/assert-chile-dossiers.mjs';
import {chileDossiers,chileAcquisitionFor,chileAcquisitionPathsFor} from '../src/lib/chile-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/chile-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertChileDossiers(chileDossiers,reviews);
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
 d=>d.records[1].scope='AguasCAP industrial desalination',
 d=>d.records[2].scope='The whole Copiapó province',
 d=>d.records[2].timeline[1].date='2022',
 d=>d.records[2].sections[4].text=d.records[2].sections[4].text.replace('Shares are not litres per second','Shares are litres per second'),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace('not silently repaired','silently repaired'),
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-033',
 d=>d.sources[0].interpretation_note='',
 d=>d.sources.find(s=>s.id==='atacama-mop-visit').publication_date='2025-03-26',
 d=>d.sources.find(s=>s.id==='atacama-inima-leaflet').publication_date='2023-05-01',
 d=>d.sources.find(s=>s.id==='atacama-sma-construction').event_date='2019-05-30',
 d=>d.sources.find(s=>s.id==='copiapo-bcn-2026').publication_period='2026-13',
 d=>d.sources.find(s=>s.id==='copiapo-mop-2012').publication_date='2011-08-06',
 d=>d.phase_60_identity_added=true
];
for(const mutate of invalid){const changed=structuredClone(chileDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:chileHash(changed),sources_sha256:chileHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:chileHash(r)}))};assert.throws(()=>assertChileDossiers(changed,rehashed));}
const stale=structuredClone(chileDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertChileDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertChileDossiers(chileDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(chileDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[63,31,37,39],'Retained post-Chile inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of chileDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<ChileDossierArticle record={record}/>'));
}
assert.equal(chileAcquisitionFor('unrelated-record'),undefined);
for(const r of chileDossiers.records){
 assert.equal(chileAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=chileAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/ChileDossierLinks.astro');
assert(notice.includes('data-current-chile-acquisition')&&notice.includes('retained history')&&notice.includes('chileDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<ChileDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...chileDossiers.records.map(record=>urlEntry(record.route,new Date(chileDossiers.inspected_date)))'));
for(const token of ['chile_named_dossiers:chileDossiers','chile_named_dossier_reviews:chileReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-chile-index'));
const component=await read('src/components/review/ChileDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.period_basis'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-chile-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,chileDossiers.records.map(r=>r.record_id));for(const r of chileDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Chile source checks passed: three exact-version articles, 18 sections, nine chronology events, thirteen inspected sources and three additive acquisition links; post-cohort inventory 63/31; 23 invalid fixtures rejected. Production acceptance remains separate.');
