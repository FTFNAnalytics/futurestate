import {retainedNovemberLedgerInput} from './lib/retained-november-ledger-input.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertItalyRailLagoonDossiers,italyRailLagoonHash,italyRailLagoonCriticalPhrases} from './lib/assert-italy-rail-lagoon-dossiers.mjs';
import {italyRailLagoonDossiers} from '../src/lib/italy-rail-lagoon-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/italy-rail-lagoon-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertItalyRailLagoonDossiers(italyRailLagoonDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].kind='Place',
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].aliases=['Wrong identity'],
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].sections[0].source_ids=['venice-identity'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2026-02-30',
 d=>d.records[0].timeline[0].source_ids=['m4-financing'],
 d=>d.records[0].identity_decision.eligible_count=2,
 ...italyRailLagoonDossiers.records.map((_r,i)=>d=>{d.records[i].scope='All of Italy';}),
 ...italyRailLagoonDossiers.records.map((_r,i)=>d=>{d.records[i].stage='All outcomes independently verified';}),
 ...italyRailLagoonDossiers.records.map((_r,i)=>d=>{d.records[i].historical_acquisition={record_id:'191-PROJECT-006'};}),
 d=>d.records[0].timeline[3].event='Both morning and scheduled evening closures completed',
 d=>d.records[1].timeline[0].event='Full line opened on October 12 and recurring reliability accepted',
 d=>d.records[2].timeline[2].event='Twenty-eight hydrants installed and accepted',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.sources.find(s=>s.id==='mose-financing').publication_date='2024-09-30',
 d=>d.sources.find(s=>s.id==='mose-financing').act_date='2024-10-28',
 d=>d.sources.find(s=>s.id==='mose-operations').page_metadata_date='2026-11-22',
 d=>d.sources.find(s=>s.id==='mose-operations').completed_event_date='2026-10-20',
 d=>d.sources.find(s=>s.id==='m4-operation').opening_event_period='2024-10-12',
 d=>d.sources.find(s=>s.id==='venice-waste').reporting_period='2026',
 d=>d.sources.find(s=>s.id==='venice-walkways').displayed_map_period='2026',
 ...italyRailLagoonDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).inspection='All linked files and current services independently inspected';}),
 ...italyRailLagoonDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).boundary='Verified outcomes';}),
 ...italyRailLagoonDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).access_mode='Official indexed text';}),
 ...italyRailLagoonDossiers.sources.map(s=>d=>{d.sources.find(x=>x.id===s.id).language='Unsupported language';}),
 ...italyRailLagoonCriticalPhrases.map(([ri,si,phrase])=>d=>{d.records[ri].sections[si].text=d.records[ri].sections[si].text.replace(phrase,'Unbounded replacement');})
];
for(const mutate of invalid){const changed=structuredClone(italyRailLagoonDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:italyRailLagoonHash(changed),sources_sha256:italyRailLagoonHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:italyRailLagoonHash(r)}))};assert.throws(()=>assertItalyRailLagoonDossiers(changed,rehashed));}
const stale=structuredClone(italyRailLagoonDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertItalyRailLagoonDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertItalyRailLagoonDossiers(italyRailLagoonDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(retainedNovemberLedgerInput(pin,await read(pin.path))).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(italyRailLagoonDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[86,56,14,14],'Retained post-italy-rail-lagoon inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const boundAcquisitions=namedDossierAdditions.filter(r=>r.historical_acquisition).map(r=>r.historical_acquisition.record_id);
assert.equal(new Set(boundAcquisitions).size,boundAcquisitions.length,'Acquisition docket reused');
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of italyRailLagoonDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<ItalyRailLagoonDossierArticle record={record}/>'));
}
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...italyRailLagoonDossiers.records.map(record=>urlEntry(record.route,new Date(italyRailLagoonDossiers.inspected_date)))'));
for(const token of ['italy_rail_lagoon_named_dossiers:italyRailLagoonDossiers','italy_rail_lagoon_named_dossier_reviews:italyRailLagoonReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-italy-rail-lagoon-index'));
const component=await read('src/components/review/ItalyRailLagoonDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','New named identity with no reused historical acquisition docket.'])assert(component.includes(token));
assert(!component.includes('record.historical_acquisition'));
for(const r of italyRailLagoonDossiers.records)assert(!Object.hasOwn(r,'historical_acquisition'));
const update=JSON.parse(await read('src/content/updates/2026-11-22-italy-rail-lagoon-named-dossiers.json'));
const digestSource=await read('scripts/lib/v1ref-candidate-digest.mjs');
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const r of italyRailLagoonDossiers.records){
 const path=`src/pages${r.route.slice(0,-1)}.astro`;
 assert(digestSource.includes(`'${path}'`),'New article route missing from fingerprint inputs');
 assert(candidate.candidate_digest.artifact_paths.includes(path),'Regenerate candidate to bind every new article route');
}
assert.deepEqual(update.affected_record_ids,italyRailLagoonDossiers.records.map(r=>r.record_id));for(const r of italyRailLagoonDossiers.records){assert(update.related_paths.includes(r.route));}
console.log('Italy rail/lagoon source checks passed: three exact-version articles, 18 sections, twelve chronology events, sixteen official Italian HTML records, three distinct new identities; post-cohort inventory 86/56; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');

