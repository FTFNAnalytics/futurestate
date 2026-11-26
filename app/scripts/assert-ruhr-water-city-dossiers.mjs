import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertRuhrWaterCityDossiers,ruhrWaterCityHash,ruhrWaterCityCriticalPhrases} from './lib/assert-ruhr-water-city-dossiers.mjs';
import {ruhrWaterCityDossiers} from '../src/lib/ruhr-water-city-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/ruhr-water-city-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertRuhrWaterCityDossiers(ruhrWaterCityDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].kind='Place',
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].aliases=['Wrong identity'],
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].sections[0].source_ids=['phoenix-dialogue'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2026-02-30',
 d=>d.records[0].timeline[0].source_ids=['dortmund-heat'],
 d=>d.records[0].identity_decision.eligible_count=2,
 ...ruhrWaterCityDossiers.records.map((_r,i)=>d=>{d.records[i].scope='All of the Ruhr region';}),
 ...ruhrWaterCityDossiers.records.map((_r,i)=>d=>{d.records[i].stage='All outcomes independently verified';}),
 ...ruhrWaterCityDossiers.records.map((_r,i)=>d=>{d.records[i].historical_acquisition={record_id:'191-PROJECT-006'};}),
 d=>d.records[0].timeline[3].event='All river ecological recovery completed',
 d=>d.records[1].timeline[3].event='Every surrounding development plot completed',
 d=>d.records[2].timeline[3].event='Waste collection savings independently measured',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='ake-delivery').publication_date='2026-12-01',
 d=>d.sources.find(s=>s.id==='ake-pump').reported_completion_period='2018',
 d=>d.sources.find(s=>s.id==='phoenix-water').water_quality_reporting_period='2026',
 d=>d.sources.find(s=>s.id==='phoenix-path').announced_start_date='2026-10-08',
 d=>d.sources.find(s=>s.id==='phoenix-path').completion_target_period='2026-Q4',
 d=>d.sources.find(s=>s.id==='dortmund-housing').reporting_period='2026',
 d=>d.sources.find(s=>s.id==='dortmund-waste').publication_date='2026-10-07',
 ...ruhrWaterCityDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).inspection='All linked files and current services independently inspected';}),
 ...ruhrWaterCityDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).boundary='Verified outcomes';}),
 ...ruhrWaterCityDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).access_mode='Official indexed text';}),
 ...ruhrWaterCityDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).language='Unsupported language';}),
 ...ruhrWaterCityCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(ruhrWaterCityDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:ruhrWaterCityHash(changed),sources_sha256:ruhrWaterCityHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:ruhrWaterCityHash(r)}))};assert.throws(()=>assertRuhrWaterCityDossiers(changed,rehashed));}
const stale=structuredClone(ruhrWaterCityDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertRuhrWaterCityDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertRuhrWaterCityDossiers(ruhrWaterCityDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(ruhrWaterCityDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[89,59,11,11],'Retained post-ruhr-water-city inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const boundAcquisitions=namedDossierAdditions.filter(r=>r.historical_acquisition).map(r=>r.historical_acquisition.record_id);
assert.equal(new Set(boundAcquisitions).size,boundAcquisitions.length,'Acquisition docket reused');
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of ruhrWaterCityDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<RuhrWaterCityDossierArticle record={record}/>'));
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...ruhrWaterCityDossiers.records.map(record=>urlEntry(record.route,new Date(ruhrWaterCityDossiers.inspected_date)))'));
for(const token of ['ruhr_water_city_named_dossiers:ruhrWaterCityDossiers','ruhr_water_city_named_dossier_reviews:ruhrWaterCityReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-ruhr-water-city-index'));
const component=await read('src/components/review/RuhrWaterCityDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','New named identity with no reused historical acquisition docket.'])assert(component.includes(token));
assert(!component.includes('record.historical_acquisition'));
for(const r of ruhrWaterCityDossiers.records)assert(!Object.hasOwn(r,'historical_acquisition'));
const update=JSON.parse(await read('src/content/updates/2026-11-22-ruhr-water-city-named-dossiers.json'));
const digestSource=await read('scripts/lib/v1ref-candidate-digest.mjs');
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const r of ruhrWaterCityDossiers.records){
 const path=`src/pages${r.route.slice(0,-1)}.astro`;
 assert(digestSource.includes(`'${path}'`),'New article route missing from fingerprint inputs');
 assert(candidate.candidate_digest.artifact_paths.includes(path),'Regenerate candidate to bind every new article route');
}
assert.deepEqual(update.affected_record_ids,ruhrWaterCityDossiers.records.map(r=>r.record_id));for(const r of ruhrWaterCityDossiers.records){assert(update.related_paths.includes(r.route));}
console.log('Ruhr water/city source checks passed: three exact-version articles, 18 sections, twelve chronology events, sixteen official German HTML records, three distinct new identities; post-cohort inventory 89/59; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
