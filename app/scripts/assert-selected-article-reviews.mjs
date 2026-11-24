import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import data from '../src/data/selected-article-ai-reviews.json' with {type:'json'};
import corpus from '../src/data/phase-205-216-current-editorial.json' with {type:'json'};
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import {selectedArticleReviews,selectedArticleReviewFor,selectedArticlePresentation,selectedReviewInputs,selectedReviewDate,selectedReviewStatus,validateSelectedArticleReview,earlierAcceptanceSentence} from '../src/lib/selected-article-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
const hash=v=>createHash('sha256').update(v).digest('hex');
const prepared=[];
assert.equal(data.preparation_artifacts.length,5);
for(const input of data.preparation_artifacts){
 const raw=await readFile(new URL(`../../${input.path}`,import.meta.url),'utf8'),value=JSON.parse(raw);
 assert.equal(hash(raw),input.sha256);assert.equal(value.application_projection_integrated,false);
 assert.deepEqual(value.records.map(r=>r.record_id),input.record_ids);prepared.push(...value.records);
}
assert.deepEqual(data.records,prepared);assert.equal(data.application_projection_integrated,true);
assert.equal(data.reviewed_articles,33);assert.equal(data.remaining_selected_articles,0);
assert.equal(data.explicit_presentation_changes,46);assert.equal(data.generic_scope_history_changes,12);assert.equal(data.initial_project_identity_history_changes,2);
assert.deepEqual(selectedArticleReviews.map(r=>r.record_id).sort(),corpus.records.map(r=>r.record_id).sort());
const resign=r=>{const {sha256,...body}=structuredClone(r);return {...body,sha256:hash(JSON.stringify(body))};};
let changes=0,sections=0,nested=0,inputs=0;
for(const r of selectedArticleReviews){
 const article=corpus.records.find(a=>a.record_id===r.record_id),card=readerCatalog.find(c=>c.id===r.record_id);
 const original=JSON.stringify(article),view=selectedArticlePresentation(article,{route:r.route});
 assert.equal(view.review,r);assert.notEqual(view.article,article);assert.equal(view.article.review_status,article.review_status);
 for(const c of view.changes){assert.equal(c.path.reduce((v,k)=>v[k],article),c.prior);assert.equal(c.path.reduce((v,k)=>v[k],view.article),c.replacement);}
 assert.equal(new Set(view.changes.map(c=>JSON.stringify(c.path))).size,view.changes.length);
 for(const required of r.required_presentational_changes??[])assert(view.changes.some(c=>JSON.stringify(c.path)===JSON.stringify(required.path)&&c.prior===required.prior&&c.replacement===required.replacement));
 assert.deepEqual(view.article.sources,article.sources);assert.deepEqual(view.article.source_notes,article.source_notes);
 for(let i=0;i<article.sections.length;i++){
  assert.equal(view.article.sections[i].heading,article.sections[i].heading);
  assert.deepEqual(view.article.sections[i].citations,article.sections[i].citations);
  assert.equal(view.article.sections[i].paragraphs?.length,article.sections[i].paragraphs?.length);
  for(let j=0;j<(article.sections[i].paragraphs??[]).length;j++)assert.deepEqual(view.article.sections[i].paragraphs[j].citations,article.sections[i].paragraphs[j].citations);
 }
 const expected=structuredClone(article);
 for(const c of view.changes){let target=expected;for(const k of c.path.slice(0,-1))target=target[k];target[c.path.at(-1)]=c.replacement;}
 assert.deepEqual(view.article,expected);assert.equal(JSON.stringify(article),original,'Original record mutated');
 assert(!view.article.sections.some(s=>s.heading==='Scope of this answer'&&s.text.includes(earlierAcceptanceSentence)));
 if(article.identity_evidence)assert(!view.article.identity_evidence.disposition.toLowerCase().includes('pending'));
 for(const n of view.article.language_notes??[])assert(!n.review_status.toLowerCase().includes('pending'));
 changes+=view.changes.length;sections+=article.sections.length;nested+=article.sections.reduce((n,s)=>n+(s.paragraphs??[]).length,0);
 assert.equal(article.approved,false);assert(article.review_status.includes('independent review pending'));
 assert.equal(selectedArticleReviewFor(article,{route:r.route}),r);
 assert.equal(selectedArticleReviewFor(article,{route:r.route+'copy/'}),null);
 assert.equal(selectedArticleReviewFor(article),null);
 assert.equal(selectedArticleReviewFor({...article,answer:'Changed'},{route:r.route}),null);
 for(const route of [undefined,r.route+'copy/','/reference/field-report/2026-09-14/']){
  if(route===r.route)continue;
  const copy=selectedArticlePresentation(article,{route});assert.equal(copy.review,null);assert.equal(copy.article,article);assert.deepEqual(copy.changes,[]);
 }
 assert.equal(card.status,selectedReviewStatus);assert.equal(card.date,selectedReviewDate);assert.equal(card.summary,article.answer);
 for(const field of ['operating_outcomes_admitted','current_external_status_verified','original_record_changed']){
  const bad=resign({...r,[field]:true});
  assert.throws(()=>validateSelectedArticleReview(bad,article),/boundary invalid/);
 }
 assert.throws(()=>validateSelectedArticleReview(r,{...article,answer:'Changed'}),/article drift/);
 const bad=resign({...r,route:'/copied-article/'});
 assert.throws(()=>validateSelectedArticleReview(bad,article),/article drift/);
 for(const [field,key,label] of [['receipt_inputs','receipt_id','receipt'],['pilot_inputs','review_id','pilot'],['related_article_inputs','record_id','related-article']])for(const input of r[field]??[]){
  inputs++;const changed=new Map(selectedReviewInputs);changed.set(input[key],{...changed.get(input[key]),bounded_finding:'Changed'});assert.throws(()=>validateSelectedArticleReview(r,article,changed),new RegExp(label+' drift'));
  changed.delete(input[key]);assert.throws(()=>validateSelectedArticleReview(r,article,changed),new RegExp(label+' drift'));
  const wrong=resign({...r,[field]:(r[field]??[]).map(x=>x===input?{...x,path:'app/src/data/wrong.json'}:x)});assert.throws(()=>validateSelectedArticleReview(wrong,article),/drift/);
 }
 assert.throws(()=>validateSelectedArticleReview(resign({...r,source_notes_absent:!!article.source_notes}),article),/source-note drift/);
 assert.throws(()=>validateSelectedArticleReview(resign({...r,reviewed_section_hashes:[]}),article),/section drift/);
 for(const change of r.required_presentational_changes??[]){
  const wrong=resign({...r,required_presentational_changes:[{...change,prior:'Different original'}]});assert.throws(()=>validateSelectedArticleReview(wrong,article),/presentation drift/);
  const duplicate=resign({...r,required_presentational_changes:[change,change]});assert.throws(()=>validateSelectedArticleReview(duplicate,article),/presentation drift/);
 }
 const unsafe=resign({...r,required_presentational_changes:[{path:['__proto__','polluted'],prior:'x',replacement:'y',original_preservation:'history'}]});assert.throws(()=>validateSelectedArticleReview(unsafe,article),/presentation drift/);assert.equal({}.polluted,undefined);
 if(r.reviewed_identity_evidence_sha256)assert.throws(()=>validateSelectedArticleReview(resign({...r,reviewed_identity_evidence_sha256:'bad'}),article),/identity drift/);
 if(r.reviewed_language_notes_sha256)assert.throws(()=>validateSelectedArticleReview(resign({...r,reviewed_language_notes_sha256:'bad'}),article),/language drift/);
 if(article.casebook_ids){assert.deepEqual(view.chapters.map(c=>c.record_id),article.casebook_ids);assert.throws(()=>validateSelectedArticleReview(resign({...r,required_chapter_ids:[]}),article),/chapter drift/);}
}
assert.deepEqual({changes,sections,nested,inputs},{changes:60,sections:152,nested:84,inputs:33});
assert.equal(selectedArticlePresentation({record_id:'unrelated'},{route:'/unrelated/'}).review,null);
const directAtlas=corpus.records.filter(r=>r.route.startsWith('/atlas/projects/'));
assert.deepEqual(directAtlas.map(r=>r.record_id),['119-PROJECT-001','119-PROJECT-022']);
for(const article of directAtlas){
 const project=atlas.projects.find(p=>p.atlas_project_id===article.record_id);assert(project);
 assert.equal(article.route,`/atlas/projects/${project.slug}/`);assert.equal(article.sections.length,6);
 assert(selectedArticleReviewFor(article,{route:article.route}));
 assert.equal(selectedArticleReviewFor(article,{route:directAtlas.find(a=>a!==article).route}),null,'Another assessed project cannot inherit this exact-route review');
 assert.equal(selectedArticleReviewFor({...article,sections:[]},{route:article.route}),null,'An altered direct reading cannot hide its earlier account as assessed');
}
const atlasTemplate=await readFile(new URL('../src/pages/atlas/projects/[slug].astro',import.meta.url),'utf8');
for(const token of [
 'const directArticleReview=currentArticle?selectedArticleReviewFor(currentArticle,{route:Astro.url.pathname}):null;',
 'const hasCurrentAccount=Boolean(canonicalReader||refreshedArticle||annualReader||directArticleReview||comparisonAccount);',
 "const LegacyContainer=hasCurrentAccount?'details':'div';",
 "hasCurrentAccount?'Historical Atlas review':'Reviewed'",'data-prior-atlas-account','data-recorded-conversion-stage'
])assert(atlasTemplate.includes(token),token);
assert(atlasTemplate.indexOf('<CurrentResearchArticle')<atlasTemplate.indexOf('data-recorded-conversion-stage'));
assert(atlasTemplate.indexOf('data-recorded-conversion-stage')<atlasTemplate.indexOf('<LegacyContainer'));
const sitemapTemplate=await readFile(new URL('../src/pages/sitemap.xml.ts',import.meta.url),'utf8');
assert(sitemapTemplate.includes("if(['/atlas/projects/tsmc-arizona/','/atlas/projects/hanford-dflaw-operation/'].includes(path))lastModified=new Date('2026-11-22');"));
console.log('Selected-article AI assertions passed: all 33 exact decisions from five unchanged preparation ledgers; 60 current/history field changes; 152 sections, 84 nested paragraphs and 33 retained input instances; all original records/citations preserved. Missing, altered, duplicated and unsafe inputs or paths fail closed; copied routes and embedded historical chapters inherit no decision. Annual and reachable-content review remain separate.');
console.log('Direct Atlas source checks passed: TSMC and Hanford exact-route assessments control historical presentation; their twelve complete sections, original review dates and identities remain unchanged. Production rendering is a separate check.');
