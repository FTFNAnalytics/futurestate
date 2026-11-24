import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertKenyaCorridorDossiers,kenyaCorridorHash,kenyaCorridorCriticalPhrases} from './lib/assert-kenya-corridor-dossiers.mjs';
import {kenyaCorridorDossiers} from '../src/lib/kenya-corridor-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/kenya-corridor-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertKenyaCorridorDossiers(kenyaCorridorDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].kind='Project',
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].sections[0].source_ids=['nairobi-meals'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=['mombasa-plan'],
 d=>d.records[0].identity_decision.eligible_count=2,
 d=>d.records[0].scope='The entire Northern Corridor',
 d=>d.records[1].scope='The entire metropolitan region',
 d=>d.records[2].scope='Port users across East Africa',
 d=>d.records[0].stage='Recurring outcomes accepted',
 d=>d.records[1].stage='Operating underground railway',
 d=>d.records[2].stage='Stations opened and water always available',
 ...kenyaCorridorDossiers.records.map((_record,i)=>d=>{d.records[i].historical_acquisition={record_id:'191-PROJECT-006'};}),
 d=>d.records[1].timeline[2].event='Observed exact opening day',
 d=>d.records[2].timeline[1].event='Plan adopted on this exact date',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='sgr-opening').commercial_start_date='2017-05-31',
 d=>d.sources.find(s=>s.id==='sgr-vehicles').event_date='2026-11-02',
 d=>d.sources.find(s=>s.id==='nairobi-jericho').event_date='2025-10-27',
 d=>d.sources.find(s=>s.id==='nairobi-meals').reference_period='Unique learners in one day',
 d=>d.sources.find(s=>s.id==='mombasa-plan').publication_date='2023-01-01',
 d=>d.sources.find(s=>s.id==='mombasa-stations').forecast_period='Observed completion',
 ...kenyaCorridorDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).inspection='All linked files and current services independently inspected';}),
 ...kenyaCorridorCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(kenyaCorridorDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:kenyaCorridorHash(changed),sources_sha256:kenyaCorridorHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:kenyaCorridorHash(r)}))};assert.throws(()=>assertKenyaCorridorDossiers(changed,rehashed));}
const stale=structuredClone(kenyaCorridorDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertKenyaCorridorDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertKenyaCorridorDossiers(kenyaCorridorDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(kenyaCorridorDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[78,46,22,24],'Retained post-kenya-corridor inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const boundAcquisitions=namedDossierAdditions.filter(r=>r.historical_acquisition).map(r=>r.historical_acquisition.record_id);
assert.equal(new Set(boundAcquisitions).size,boundAcquisitions.length,'Acquisition docket reused');
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of kenyaCorridorDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<KenyaCorridorDossierArticle record={record}/>'));
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...kenyaCorridorDossiers.records.map(record=>urlEntry(record.route,new Date(kenyaCorridorDossiers.inspected_date)))'));
for(const token of ['kenya_corridor_named_dossiers:kenyaCorridorDossiers','kenya_corridor_named_dossier_reviews:kenyaCorridorReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-kenya-corridor-index'));
const component=await read('src/components/review/KenyaCorridorDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','New named identity with no reused historical acquisition docket.'])assert(component.includes(token));
assert(!component.includes('record.historical_acquisition'));
for(const r of kenyaCorridorDossiers.records)assert(!Object.hasOwn(r,'historical_acquisition'));
const update=JSON.parse(await read('src/content/updates/2026-11-22-kenya-corridor-named-dossiers.json'));
const digestSource=await read('scripts/lib/v1ref-candidate-digest.mjs');
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const r of kenyaCorridorDossiers.records){
 const path=`src/pages${r.route.slice(0,-1)}.astro`;
 assert(digestSource.includes(`'${path}'`),'New article route missing from fingerprint inputs');
 assert(candidate.candidate_digest.artifact_paths.includes(path),'Regenerate candidate to bind every new article route');
}
assert.deepEqual(update.affected_record_ids,kenyaCorridorDossiers.records.map(r=>r.record_id));for(const r of kenyaCorridorDossiers.records){assert(update.related_paths.includes(r.route));}
console.log('Kenya corridor source checks passed: three exact-version articles, 18 sections, thirteen chronology events, fourteen HTML records and one text-inspected PDF, three distinct new identities; post-cohort inventory 78/46; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
