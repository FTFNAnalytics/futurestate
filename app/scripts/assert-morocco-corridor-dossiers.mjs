import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertMoroccoCorridorDossiers,moroccoCorridorHash,moroccoCorridorCriticalPhrases} from './lib/assert-morocco-corridor-dossiers.mjs';
import {moroccoCorridorDossiers} from '../src/lib/morocco-corridor-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/morocco-corridor-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertMoroccoCorridorDossiers(moroccoCorridorDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].kind='Project',
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].aliases=['Wrong identity'],
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].sections[0].source_ids=['tangier-identity'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=['casablanca-cleanliness'],
 d=>d.records[0].identity_decision.eligible_count=2,
 ...moroccoCorridorDossiers.records.map((_r,i)=>d=>{d.records[i].scope='All of Morocco';}),
 ...moroccoCorridorDossiers.records.map((_r,i)=>d=>{d.records[i].stage='All outcomes independently verified';}),
 ...moroccoCorridorDossiers.records.map((_r,i)=>d=>{d.records[i].historical_acquisition={record_id:'191-PROJECT-006'};}),
 d=>d.records[0].timeline[1].event='All eighteen trains accepted for commercial service',
 d=>d.records[1].timeline[3].event='Rahrah works completed',
 d=>d.records[2].timeline[5].event='Climate strategy adopted and outcomes verified',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='al-boraq-network-plan').dispatch_date='2025-04-25',
 d=>d.sources.find(s=>s.id==='al-boraq-casablanca-works').scheduled_end_period='2026',
 d=>d.sources.find(s=>s.id==='tangier-identity').publication_date='2002-01-01',
 d=>d.sources.find(s=>s.id==='tangier-coach-terminal').reporting_cutoff_date='2022-12-31',
 d=>d.sources.find(s=>s.id==='tangier-parking').effective_date='2025-07-04',
 d=>d.sources.find(s=>s.id==='casablanca-climate-plan').event_date='2026-07-20',
 ...moroccoCorridorDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).inspection='All linked files and current services independently inspected';}),
 ...moroccoCorridorDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).boundary='Verified outcomes';}),
 ...moroccoCorridorDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).access_mode='Official indexed text';}),
 ...moroccoCorridorDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).language='Unsupported language';}),
 ...moroccoCorridorCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(moroccoCorridorDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:moroccoCorridorHash(changed),sources_sha256:moroccoCorridorHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:moroccoCorridorHash(r)}))};assert.throws(()=>assertMoroccoCorridorDossiers(changed,rehashed));}
const stale=structuredClone(moroccoCorridorDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertMoroccoCorridorDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertMoroccoCorridorDossiers(moroccoCorridorDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(moroccoCorridorDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[83,53,17,17],'Retained post-morocco-corridor inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const boundAcquisitions=namedDossierAdditions.filter(r=>r.historical_acquisition).map(r=>r.historical_acquisition.record_id);
assert.equal(new Set(boundAcquisitions).size,boundAcquisitions.length,'Acquisition docket reused');
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of moroccoCorridorDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<MoroccoCorridorDossierArticle record={record}/>'));
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...moroccoCorridorDossiers.records.map(record=>urlEntry(record.route,new Date(moroccoCorridorDossiers.inspected_date)))'));
for(const token of ['morocco_corridor_named_dossiers:moroccoCorridorDossiers','morocco_corridor_named_dossier_reviews:moroccoCorridorReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-morocco-corridor-index'));
const component=await read('src/components/review/MoroccoCorridorDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','New named identity with no reused historical acquisition docket.'])assert(component.includes(token));
assert(!component.includes('record.historical_acquisition'));
for(const r of moroccoCorridorDossiers.records)assert(!Object.hasOwn(r,'historical_acquisition'));
const update=JSON.parse(await read('src/content/updates/2026-11-22-morocco-corridor-named-dossiers.json'));
const digestSource=await read('scripts/lib/v1ref-candidate-digest.mjs');
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const r of moroccoCorridorDossiers.records){
 const path=`src/pages${r.route.slice(0,-1)}.astro`;
 assert(digestSource.includes(`'${path}'`),'New article route missing from fingerprint inputs');
 assert(candidate.candidate_digest.artifact_paths.includes(path),'Regenerate candidate to bind every new article route');
}
assert.deepEqual(update.affected_record_ids,moroccoCorridorDossiers.records.map(r=>r.record_id));for(const r of moroccoCorridorDossiers.records){assert(update.related_paths.includes(r.route));}
console.log('Morocco corridor source checks passed: three exact-version articles, 18 sections, sixteen chronology events, sixteen official multilingual HTML records, three distinct new identities; post-cohort inventory 83/53; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
