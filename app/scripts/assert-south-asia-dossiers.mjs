import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertSouthAsiaDossiers,southAsiaHash} from './lib/assert-south-asia-dossiers.mjs';
import {southAsiaDossiers} from '../src/lib/south-asia-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/south-asia-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertSouthAsiaDossiers(southAsiaDossiers,reviews);
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
 d=>d.records[1].stage='Extension accepted',
 d=>d.records[2].scope='The whole Mumbai Metropolitan Region',
 d=>d.records[2].timeline[0].date='2022',
 d=>d.sources.find(s=>s.id==='dhaka-road-study-35').reference_period='November 2026',
 d=>d.sources.find(s=>s.id==='dhaka-household-conference').publication_date='2026-01-26',
 d=>d.sources.find(s=>s.id==='dhaka-jica-visit').publication_date='2026-07-10',
 d=>d.sources.find(s=>s.id==='mumbai-climate-summary').publication_period='2022-13',
 d=>d.sources.find(s=>s.id==='mumbai-budget-circular').document_date='2026-11-21',
 d=>d.phase_60_identity_added=true
];
for(const mutate of invalid){const changed=structuredClone(southAsiaDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:southAsiaHash(changed),sources_sha256:southAsiaHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:southAsiaHash(r)}))};assert.throws(()=>assertSouthAsiaDossiers(changed,rehashed));}
const stale=structuredClone(southAsiaDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertSouthAsiaDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertSouthAsiaDossiers(southAsiaDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(southAsiaDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[61,30,39,40],'Retained post-South-Asia inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of southAsiaDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<SouthAsiaDossierArticle record={record}/>'));
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...southAsiaDossiers.records.map(record=>urlEntry(record.route,new Date(southAsiaDossiers.inspected_date)))'));
for(const token of ['south_asia_named_dossiers:southAsiaDossiers','south_asia_named_dossier_reviews:southAsiaReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-south-asia-index'));
const component=await read('src/components/review/SouthAsiaDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.period_basis'));
const update=JSON.parse(await read('src/content/updates/2026-11-21-south-asia-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,southAsiaDossiers.records.map(r=>r.record_id));for(const r of southAsiaDossiers.records)assert(update.related_paths.includes(r.route));
console.log('South Asia source checks passed: three exact-version articles, 18 sections, 11 chronology events, nine inspected-source records; post-cohort eligible inventory 61/30; nineteen invalid fixtures rejected. Production acceptance remains separate.');
