import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertEuropeDossiers} from './lib/assert-europe-dossiers.mjs';
import {europeDossiers} from '../src/lib/europe-named-dossiers.mjs';
import {nevadaDossiers} from '../src/lib/nevada-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/europe-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertEuropeDossiers(europeDossiers,reviews);
for(const mutate of [
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].stage='Operating at full power',
 d=>d.records[1].scope='All Olkiluoto facilities combined',
 d=>d.records[2].scope='Ceremonial Somerset',
 d=>d.sources.find(s=>s.id==='somerset-lhna').publication_date='2026-04-01',
 d=>d.records[1].sections[2].text+=' Full power was achieved.',
 d=>d.phase_60_identity_added=true
]){const changed=structuredClone(europeDossiers);mutate(changed);assert.throws(()=>assertEuropeDossiers(changed,reviews));}
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertEuropeDossiers(europeDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
// Retain the post-Europe snapshot; current totals must also include later reviewed cohorts.
const throughEurope=[...nevadaDossiers.records,...europeDossiers.records];
const count=(records,kind)=>records.filter(r=>r.kind===kind).reduce((sum,r)=>sum+r.identity_decision.eligible_count,0);
assert.deepEqual([historical.summary.eligible_project_candidates+count(throughEurope,'Project'),historical.summary.eligible_place_candidates+count(throughEurope,'Place')],[58,27]);
assert.deepEqual([currentPortfolioSummary.historical_projects,currentPortfolioSummary.historical_places],[54,25]);
assert.equal(currentPortfolioSummary.added_projects,count(namedDossierAdditions,'Project'));
assert.equal(currentPortfolioSummary.added_places,count(namedDossierAdditions,'Place'));
assert.equal(currentPortfolioSummary.eligible_projects,54+currentPortfolioSummary.added_projects);
assert.equal(currentPortfolioSummary.eligible_places,25+currentPortfolioSummary.added_places);
assert.equal(currentPortfolioSummary.projects_needed,100-currentPortfolioSummary.eligible_projects);
assert.equal(currentPortfolioSummary.places_needed,70-currentPortfolioSummary.eligible_places);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of europeDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...europeDossiers.records.map(record=>urlEntry(record.route,new Date(europeDossiers.inspected_date)))'));
for(const token of ['europe_named_dossiers:europeDossiers','europe_named_dossier_reviews:europeReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-europe-index'));
assert((await read('src/pages/atlas/projects/europe/[project].astro')).includes('europeProjects.map('));
for(const path of ['src/pages/atlas/projects/europe/[project].astro','src/pages/atlas/places/somerset-council-area.astro'])assert((await read(path)).includes('<EuropeDossierArticle record={record}/>'));
const component=await read('src/components/review/EuropeDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('section.source_ids.map('));
const update=JSON.parse(await read('src/content/updates/2026-11-21-europe-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,europeDossiers.records.map(r=>r.record_id));for(const r of europeDossiers.records)assert(update.related_paths.includes(r.route));
console.log('Europe source checks passed: three exact-version articles, 18 sections, 11 chronology events and 11 inspected-source records; retained post-Europe snapshot 58/27 and current cohort composition verified; historical inputs retained; twelve invalid fixtures rejected. Production acceptance remains separate.');
