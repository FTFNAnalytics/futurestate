import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {assertAucklandDossiers,aucklandHash} from './lib/assert-auckland-dossiers.mjs';
import {aucklandDossiers,aucklandAcquisitionFor,aucklandAcquisitionPathsFor} from '../src/lib/auckland-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierCohorts,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/auckland-named-dossier-reviews.json' with {type:'json'};
import historical from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
import {readerCatalog,searchReaders} from '../src/lib/reader-catalog.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
assertAucklandDossiers(aucklandDossiers,reviews);
// Rehash malformed fixtures so structural checks, not stale-digest checks, must reject them.
const invalid=[
 d=>d.records[1].record_id=d.records[0].record_id,
 d=>d.records[1].route=d.records[0].route,
 d=>d.records[0].sections[0].source_ids=['unread-source'],
 d=>d.records[0].timeline[0].date='2027-01',
 d=>d.records[0].timeline[0].date='2025-02-30',
 d=>d.records[0].timeline[0].source_ids=[],
 d=>d.records[0].identity_decision.eligible_count=3,
 d=>d.records[0].scope='The entire Auckland rail network counts as one new project',
 d=>d.records[0].stage='Long-run comparable outcomes accepted',
 d=>d.records[1].scope='Every collector adds a project',
 d=>d.records[1].stage='Only under construction',
 d=>d.records[2].scope='Only the central city',
 d=>d.records[0].timeline[2].date='2026-09-11',
 d=>d.records[1].timeline[0].date='2025-01',
 d=>d.records[1].timeline[1].date='2026-12',
 d=>d.records[0].historical_acquisition.record_id='191-PROJECT-029',
 d=>d.sources[0].interpretation_note='',
 d=>d.phase_60_identity_added=true,
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace("528,007","528,008"),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace("HOP and payment-card data","estimated head counts"),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace("not unique people or tunnel-only journeys","unique people using the tunnel"),
 d=>d.records[0].sections[2].text=d.records[0].sections[2].text.replace("early Waitematā fire","uninterrupted opening day"),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace("506,083","506,038"),
 d=>d.records[0].sections[3].text=d.records[0].sections[3].text.replace("1,034,090","1,034,091"),
 d=>d.records[0].sections[4].text=d.records[0].sections[4].text.replace("names gifted through the Mana Whenua Forum","names invented by this author"),
 d=>d.records[1].sections[0].text=d.records[1].sections[0].text.replace("top-level status still reads Construction","status is consistent everywhere"),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace("741,000 cubic metres","741,000 litres"),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace("by July 1, 2026","by November 22, 2026"),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace("operator estimate","independently measured outcome"),
 d=>d.records[1].sections[2].text=d.records[1].sections[2].text.replace("299,000 cubic metres","299,000 cubic metres per second"),
 d=>d.records[1].sections[3].text=d.records[1].sections[3].text.replace("future design figure","observed operating rate"),
 d=>d.records[1].sections[4].text=d.records[1].sections[4].text.replace("do not establish awarded contracts","establish awarded contracts"),
 d=>d.records[2].sections[1].text=d.records[2].sections[1].text.replace("rather than a representative satisfaction measure","and is a representative satisfaction measure"),
 d=>d.records[2].sections[2].text=d.records[2].sections[2].text.replace("wastewater role from Auckland Council’s stormwater responsibility","responsibility for every kind of water"),
 d=>d.records[2].sections[3].text=d.records[2].sections[3].text.replace("not an observed count","an observed count"),
 d=>d.records[2].sections[4].text=d.records[2].sections[4].text.replace("not 17 million distinct residents or a library-only total","17 million distinct library users"),
 d=>d.sources.find(s=>s.id==='crl-closeout').event_date='2026-10-02',
 d=>d.sources.find(s=>s.id==='crl-week-one').reference_period='September 13–26, 2026',
 d=>d.sources.find(s=>s.id==='ci-live').publication_date='2026-07-01',
 d=>d.sources.find(s=>s.id==='auckland-annual-services').reference_period='2026 calendar year'
];
for(const mutate of invalid){const changed=structuredClone(aucklandDossiers);mutate(changed);const rehashed={...reviews,edition_sha256:aucklandHash(changed),sources_sha256:aucklandHash(changed.sources),records:changed.records.map(r=>({record_id:r.record_id,sha256:aucklandHash(r)}))};assert.throws(()=>assertAucklandDossiers(changed,rehashed));}
const stale=structuredClone(aucklandDossiers);stale.records[0].sections[0].text+=' Unreviewed change.';assert.throws(()=>assertAucklandDossiers(stale,reviews));
const forged=structuredClone(reviews);forged.launch_authorized=true;assert.throws(()=>assertAucklandDossiers(aucklandDossiers,forged));
for(const pin of reviews.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,`Historical input changed: ${pin.path}`);
const retained=namedDossierCohorts.slice(0,namedDossierCohorts.indexOf(aucklandDossiers)+1).flatMap(c=>c.records);
const projects=54+retained.filter(r=>r.kind==='Project').length,places=25+retained.filter(r=>r.kind==='Place').length;
assert.deepEqual([projects,places,100-projects,70-places],[70,36,30,34],'Retained post-Auckland inventory');
assert.equal(currentPortfolioSummary.eligible_projects,54+namedDossierAdditions.filter(r=>r.kind==='Project').length);
assert.equal(currentPortfolioSummary.eligible_places,25+namedDossierAdditions.filter(r=>r.kind==='Place').length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.record_id)).size,namedDossierAdditions.length);
assert.equal(new Set(namedDossierAdditions.map(r=>r.route)).size,namedDossierAdditions.length);
const historicalIds=new Set([...historical.canonical,...historical.named_places,...historical.new_editorial_candidates].map(r=>r.record_id));
for(const r of aucklandDossiers.records){
 assert(!historicalIds.has(r.record_id));assert.equal(readerCatalog.filter(c=>c.id===r.record_id).length,1);assert.equal(readerCatalog.filter(c=>c.route===r.route).length,1);
 for(const alias of r.aliases)assert(searchReaders(readerCatalog,alias,r.kind).some(c=>c.id===r.record_id),`Search alias missing: ${alias}`);
 for(const link of r.related)assert(namedDossierAdditions.some(other=>other.route===link.route),'Related route does not resolve');
 const routeSource=await read(`src/pages${r.route.slice(0,-1)}.astro`);assert(routeSource.includes(`r.record_id==='${r.record_id}'`));assert(routeSource.includes('<AucklandDossierArticle record={record}/>'));
}
assert.equal(aucklandAcquisitionFor('unrelated-record'),undefined);
for(const r of aucklandDossiers.records){
 assert.equal(aucklandAcquisitionFor(r.historical_acquisition.record_id),r);
 const [native,canonical]=aucklandAcquisitionPathsFor(r);assert.equal(native,r.historical_acquisition.route);
 assert(canonical.startsWith(r.kind==='Project'?'/reference/international-projects/':'/reference/global-places-ii/'));
}
const notice=await read('src/components/review/AucklandDossierLinks.astro');
assert(notice.includes('data-current-auckland-acquisition')&&notice.includes('retained history')&&notice.includes('aucklandDossiers.inspected_date'));
assert((await read('src/components/review/RegistryDetail.astro')).includes('<AucklandDossierLinks recordId={String(id)} />'));
const sitemap=await read('src/pages/sitemap.xml.ts'),exports=await read('src/pages/data/build-decisions.json.ts');
assert(sitemap.includes('...aucklandDossiers.records.map(record=>urlEntry(record.route,new Date(aucklandDossiers.inspected_date)))'));
for(const token of ['auckland_named_dossiers:aucklandDossiers','auckland_named_dossier_reviews:aucklandReviews','current_portfolio_summary:currentPortfolioSummary'])assert(exports.includes(token));
for(const path of ['src/pages/atlas/projects/index.astro','src/pages/atlas/places/index.astro'])assert((await read(path)).includes('data-auckland-index'));
const component=await read('src/components/review/AucklandDossierArticle.astro');assert(!/<script\b/i.test(component));assert(component.includes('data-dossier-event')&&component.includes('data-dossier-source')&&component.includes('source.boundary'));
for(const token of ['source.language','source.interpretation_note','record.historical_acquisition.route','record.historical_acquisition.decision'])assert(component.includes(token));
const update=JSON.parse(await read('src/content/updates/2026-11-22-auckland-named-dossiers.json'));
assert.deepEqual(update.affected_record_ids,aucklandDossiers.records.map(r=>r.record_id));for(const r of aucklandDossiers.records){assert(update.related_paths.includes(r.route));assert(update.related_paths.includes(r.historical_acquisition.route));}
console.log('Auckland source checks passed: three exact-version articles, 18 sections, eleven chronology events, sixteen inspected sources and three additive acquisition links; post-cohort inventory 70/36; '+(invalid.length+2)+' invalid fixtures rejected. Production acceptance remains separate.');
