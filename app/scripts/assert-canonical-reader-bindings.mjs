import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {canonicalReaderBindings as data,validateCanonicalReaderBindings,canonicalReaderForProject,canonicalReaderForPlace,canonicalReaderLinksFor,canonicalReaderPresentation} from '../src/lib/canonical-reader-bindings.mjs';
import {selectedArticleReviewFor,selectedArticlePresentation} from '../src/lib/selected-article-reviews.mjs';
import initial from '../src/data/canonical-reader-bindings-initial-2026-11-22.json' with {type:'json'};
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import editorial from '../src/data/phase-205-216-current-editorial.json' with {type:'json'};
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {currentPortfolioSummary} from '../src/lib/current-named-dossiers.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const negative=[
 d=>d.records.pop(),d=>d.records.push(structuredClone(d.records[0])),
 d=>d.records[0].article_record_id='191-PROJECT-003',d=>d.records[0].target_route='/atlas/projects/dalrymple-grid-battery/',
 d=>d.records[0].article_route=d.records[0].target_route,d=>d.records[0].atlas_record_id='119-PROJECT-001',
 d=>d.records[0].article_sha256='0'.repeat(64),d=>d.records[0].article_review_sha256='0'.repeat(64),
 d=>d.records[0].presentation_sha256='0'.repeat(64),d=>d.records[0].atlas_record_sha256='0'.repeat(64),
 d=>d.records[0].portfolio_decision_sha256='0'.repeat(64),d=>d.records[0].section_count=5,
 d=>d.records[0].nested_paragraph_count=5,d=>d.records[0].original_review_date='2026-11-22',
 d=>d.records[0].current_status_boundary='Current external status verified',
 d=>d.records[0].findings=[],d=>d.records[0].historical_atlas_handling='Delete old account',
 d=>d.historical_inputs_retained=[],d=>d.new_identity_count=3,d=>d.review_date='2026-09-27',
 d=>d.revision=1,d=>d.related_readings.pop(),d=>d.related_readings[0].to='119-PROJECT-002',
 ...[3,4,5].flatMap(index=>[
  d=>d.records[index].article_record_id='191-PROJECT-001',d=>d.records[index].atlas_record_id='119-PROJECT-002',
  d=>d.records[index].target_route='/atlas/projects/toronto-24-254930/',d=>d.records[index].article_route='/reference/international-projects/toronto-24-254930/',
  ...['article_sha256','article_review_sha256','presentation_sha256','atlas_record_sha256','portfolio_decision_sha256'].map(key=>d=>{d.records[index][key]='0'.repeat(64);}),
  d=>d.records[index].section_count=1,d=>d.records[index].nested_paragraph_count=1,
  d=>d.records[index].original_review_date='2026-11-22',d=>d.records[index].findings=[],
  d=>d.records[index].current_status_boundary='Every project outcome applies to the whole place'
 ]),
 ...['human_review_claimed','fresh_external_source_check','operating_outcomes_admitted','publication_authorized','launch_authorized','phase_216_complete'].map(key=>d=>{d[key]=true;})
];
for(const mutate of negative){const changed=structuredClone(data);mutate(changed);assert.notDeepEqual(changed,data);assert.throws(()=>validateCanonicalReaderBindings(changed));}
for(const pin of data.historical_inputs_retained)assert.equal(createHash('sha256').update(await read(pin.path)).digest('hex'),pin.sha256,pin.path);
for(const binding of data.records){
 const article=editorial.records.find(a=>a.record_id===binding.article_record_id),isPlace=article.kind==='Place';
 const idKey=isPlace?'atlas_place_id':'atlas_project_id',project=atlas[isPlace?'places':'projects'].find(p=>p[idKey]===binding.atlas_record_id);
 const lookup=isPlace?canonicalReaderForPlace:canonicalReaderForProject,wrongLookup=isPlace?canonicalReaderForProject:canonicalReaderForPlace;
 assert.equal(lookup(project).article,article);assert.equal(wrongLookup(project),null,'Project and place lookups must not inherit each other');
 for(const link of canonicalReaderLinksFor(binding.binding_id)){assert(data.records.some(r=>r.target_route===link.route));assert.notEqual(link.route,binding.target_route);}
 assert.equal(selectedArticleReviewFor(article,{route:binding.target_route}),null,'Original route-only approval must stay narrow');
 const view=canonicalReaderPresentation(article,{route:binding.target_route});
 assert.deepEqual(view.presentation,selectedArticlePresentation(article,{route:binding.article_route}));
 for(const route of [binding.article_route,'/atlas/projects/unrelated/','/'])assert.equal(canonicalReaderPresentation(article,{route}),null);
 const changed=structuredClone(article);changed.sections[0].paragraphs[0].text+=' Changed.';assert.throws(()=>canonicalReaderPresentation(changed,{route:binding.target_route}));
 const wrongProject=structuredClone(project);wrongProject.named_entity='Different asset';assert.throws(()=>lookup(wrongProject));
 const rows=readerCatalog.filter(c=>c.id===article.record_id);assert.equal(rows.length,1);assert.equal(rows[0].route,binding.article_route);
}
for(const project of atlas.projects.filter(p=>!data.records.some(r=>r.atlas_record_id===p.atlas_project_id)))assert.equal(canonicalReaderForProject(project),null);
for(const place of atlas.places.filter(p=>!data.records.some(r=>r.atlas_record_id===p.atlas_place_id)))assert.equal(canonicalReaderForPlace(place),null);
assert.deepEqual(data.records.slice(0,3),initial.records);
assert.equal(data.prior_revision.sha256,'3f7a94d71a2a35a88841efb0cd753ea21bbfcad72cf5a79fcc8b063482efd508');
assert.equal(data.records.filter(r=>r.atlas_record_id.startsWith('119-PROJECT-')).length,4);
assert.equal(data.records.filter(r=>r.atlas_record_id.startsWith('119-PLACE-')).length,2);
assert.deepEqual(data.records.reduce((a,r)=>[a[0]+r.section_count,a[1]+r.nested_paragraph_count],[0,0]),[37,37]);
assert.equal(data.related_readings.length,5);assert.deepEqual(canonicalReaderLinksFor('unrelated'),[]);
assert.deepEqual([currentPortfolioSummary.eligible_projects,currentPortfolioSummary.eligible_places],[100,70]);
const template=await read('src/pages/atlas/projects/[slug].astro');
for(const token of ['canonicalReaderForProject(project)','canonicalReader?.article ?? currentEditorial.records.find','<LegacyContainer','data-prior-atlas-account','Earlier Atlas account and evidence links','</LegacyContainer>'])assert(template.includes(token),token);
assert(template.indexOf('<CurrentResearchArticle')<template.indexOf('data-recorded-conversion-stage'));
assert(template.indexOf('data-recorded-conversion-stage')<template.indexOf('<LegacyContainer'),'Recorded stage must not be collapsed as historical background');
const placeTemplate=await read('src/pages/atlas/places/[slug].astro');
for(const token of ['canonicalReaderForPlace(place)','<CurrentResearchArticle','data-recorded-system-boundary','<LegacyContainer','data-prior-atlas-account','</LegacyContainer>'])assert(placeTemplate.includes(token),token);
assert(placeTemplate.indexOf('<CurrentResearchArticle')<placeTemplate.indexOf('data-recorded-system-boundary'));
assert(placeTemplate.indexOf('data-recorded-system-boundary')<placeTemplate.indexOf('<LegacyContainer'));
const component=await read('src/components/review/CurrentResearchArticle.astro');
for(const token of ['canonicalReaderPresentation(original,{route:Astro.url.pathname})','canonicalPresentation?.presentation ?? selectedArticlePresentation','data-canonical-reader-binding','binding.current_status_boundary','binding.article_route','data-canonical-related-readers','canonicalReaderLinksFor(binding.binding_id)'])assert(component.includes(token),token);
const exportFile=await read('src/pages/data/build-decisions.json.ts');assert(exportFile.includes('canonical_reader_bindings:canonicalReaderBindings'));
const sitemap=await read('src/pages/sitemap.xml.ts');assert(sitemap.includes('if(canonicalReaderBindings.records.some(r=>r.target_route===path))lastModified=new Date(canonicalReaderIntegrationDate);'));
const method=await read('src/pages/method/portfolio-decisions.astro');assert(method.includes('data-canonical-reader-summary')&&method.includes('binding.target_route'));
const candidate=JSON.parse(await read('src/data/v1-public-reference-edition.json'));
for(const path of ['src/data/canonical-reader-bindings-initial-2026-11-22.json','src/content/updates/2026-11-22-canonical-place-project-readers.json','src/data/canonical-reader-bindings.json','src/lib/canonical-reader-bindings.mjs','scripts/assert-canonical-reader-bindings.mjs','scripts/verify-canonical-reader-bindings.mjs','src/content/updates/2026-11-22-canonical-reader-bindings.json'])assert(candidate.candidate_digest.artifact_paths.includes(path),path);
const base=await read('src/components/layout/BaseLayout.astro');assert(base.indexOf('<CurrentOperationsNotice')<base.indexOf('<slot'));
console.log('Canonical reader source checks passed: 6 exact-route integrations (4 projects and 2 places), 37 sections, 37 nested paragraphs, 6 unchanged historical inputs and 5 separate-scope related links; '+negative.length+' malformed decisions plus runtime article/identity mutations rejected. Original review routes and 100/70 identities remain unchanged; production rendering remains separate.');
