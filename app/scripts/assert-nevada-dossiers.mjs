import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertNevadaDossiers} from './lib/assert-nevada-dossiers.mjs';
import {nevadaDossiers,currentPortfolioSummary} from '../src/lib/nevada-named-dossiers.mjs';
import reviews from '../src/data/nevada-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertNevadaDossiers(nevadaDossiers,reviews);
for(const mutate of [
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['not-inspected'],
 d=>d.sources[0].publication_date='2026-11-22',
 d=>d.records[1].stage='Operating',
 d=>d.records[2].scope='Humboldt County California',
 d=>d.records[0].sections[0].text+=' Unsupported extra claim.',
 d=>d.independent_review=true,
 d=>d.sources.find(s=>s.id==='fws-tiehms-rule').effective_date='2022-12-16'
]){const changed=structuredClone(nevadaDossiers);mutate(changed);assert.throws(()=>assertNevadaDossiers(changed,reviews));}
const forged=structuredClone(reviews);forged.phase_216_complete=true;assert.throws(()=>assertNevadaDossiers(nevadaDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
assert.equal(historical.canonical.find(r=>r.record_id==='casebook-nevada-lithium-to-qualified-material').eligible_count,0);
assert.deepEqual([currentPortfolioSummary.historical_projects,currentPortfolioSummary.historical_places,currentPortfolioSummary.added_projects,currentPortfolioSummary.added_places,currentPortfolioSummary.eligible_projects,currentPortfolioSummary.eligible_places,currentPortfolioSummary.projects_needed,currentPortfolioSummary.places_needed],[54,25,2,1,56,26,44,44]);
for(const r of nevadaDossiers.records){
 assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...nevadaDossiers.records.map(record=>urlEntry(record.route,new Date(nevadaDossiers.inspected_date)))'));
for(const token of ['nevada_named_dossiers:nevadaDossiers','nevada_named_dossier_reviews:nevadaReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-nevada-index'));
for(const path of ['src/pages/atlas/projects/[slug].astro','src/pages/atlas/places/[slug].astro'])assert((await read(path)).includes('<NevadaDossierLinks/>'));
const project=await read('src/pages/atlas/projects/nevada/[project].astro'),place=await read('src/pages/atlas/places/humboldt-county-nevada.astro');
assert(project.includes('nevadaProjects.map('));assert(project.includes('<NevadaDossierArticle record={record}/>'));assert(place.includes('<NevadaDossierArticle record={record}/>'));
const component=await read('src/components/review/NevadaDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('section.source_ids.map('));assert(component.includes('data-dossier-source'));
const update=JSON.parse(await read('src/content/updates/2026-11-21-nevada-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,nevadaDossiers.records.map(r=>r.record_id));for(const r of nevadaDossiers.records)assert(update.related_paths.includes(r.route));
console.log('Nevada source checks passed: three exact-version articles, 18 sections, 11 inspected-source records, distinct project/county identities, retained 56/26 post-Nevada inventory snapshot, historical census/Atlas/Phase 61 unchanged; ten invalid fixtures rejected. Later cohorts compose the current inventory separately. Production acceptance remains separate.');
