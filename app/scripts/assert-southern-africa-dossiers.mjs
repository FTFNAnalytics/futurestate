import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertSouthernAfricaDossiers} from './lib/assert-southern-africa-dossiers.mjs';
import {southernAfricaDossiers} from '../src/lib/southern-africa-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/southern-africa-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertSouthernAfricaDossiers(southernAfricaDossiers,reviews);
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].stage='Accepted water-transfer service',
 d=>d.records[0].identity_decision.eligible_count=3,
 d=>d.records[1].scope='Mokhotlong town only',
 d=>d.records[1].timeline[0].date='2026-11-21',
 d=>d.records[2].scope='All Western Cape province',
 d=>d.sources.find(s=>s.id==='cape-town-november').effective_date='2026-11-16',
 d=>d.sources.find(s=>s.id==='cape-town-november').publication_date='2026-12-01',
 d=>d.sources.find(s=>s.id==='lhda-resettlement-june').publication_date='2026-06-01',
 d=>d.records[2].sections[2].text=d.records[2].sections[2].text.replace('not yet in force','already in force'),
 d=>d.phase_60_identity_added=true
];
for(const mutate of invalid){const changed=structuredClone(southernAfricaDossiers);mutate(changed);assert.throws(()=>assertSouthernAfricaDossiers(changed,reviews));}
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertSouthernAfricaDossiers(southernAfricaDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(southernAfricaDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[59,29,41,41],'Retained post-Southern-Africa inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of southernAfricaDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<SouthernAfricaDossierArticle record={record}/>'));
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...southernAfricaDossiers.records.map(record=>urlEntry(record.route,new Date(southernAfricaDossiers.inspected_date)))'));
for(const token of ['southern_africa_named_dossiers:southernAfricaDossiers','southern_africa_named_dossier_reviews:southernAfricaReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-southern-africa-index'));
const component=await read('src/components/review/SouthernAfricaDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.period_basis')&&component.includes('source.index_url'));
const update=JSON.parse(await read('src/content/updates/2026-11-21-southern-africa-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,southernAfricaDossiers.records.map(r=>r.record_id));for(const r of southernAfricaDossiers.records)assert(update.related_paths.includes(r.route));
console.log('Southern Africa source checks passed: three exact-version articles, 18 sections, nine chronology events and 12 inspected-source records; retained post-cohort inventory 59/29; historical inputs retained; sixteen invalid fixtures rejected. Production acceptance remains separate.');
