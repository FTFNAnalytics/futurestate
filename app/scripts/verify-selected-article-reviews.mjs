import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import data from '../src/data/selected-article-ai-reviews.json' with {type:'json'};
import annualReviews from '../src/data/annual-ai-reviews.json' with {type:'json'};
import corpus from '../src/data/phase-205-216-current-editorial.json' with {type:'json'};
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import topics from '../src/data/phase-184-canonical-topic-edition-2.json' with {type:'json'};
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {selectedReviewDate,selectedReviewStatus,selectedArticlePresentation} from '../src/lib/selected-article-reviews.mjs';
const read=route=>readFile(new URL(`../dist${route}`,import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const visibleWithoutHistory=n=>attr(n,'data-prior-editorial-review')!==undefined?'':n.nodeName==='#text'?n.value:(n.childNodes??[]).map(visibleWithoutHistory).join('');
assert.deepEqual(JSON.parse(await read('/data/build-decisions.json')).selected_article_reviews,data);
assert.deepEqual(JSON.parse(await read('/data/current-editorial.json')),corpus);
const method=await read('/method/editorial-review/index.html'),sitemap=await read('/sitemap.xml');
assert(method.includes('33 of 33 selected articles assessed by AI'));
assert(method.includes(`Of the ${annualReviews.annual_target} annual assessments, ${annualReviews.reviewed_annual_records} are integrated below; the remaining ${annualReviews.remaining_annual_records} and reachable-content review remain separate work`));
let changedFields=0,verifiedSections=0,verifiedNested=0;
for(const r of data.records){
 const a=corpus.records.find(a=>a.record_id===r.record_id),html=await read(`${r.route}index.html`),dom=parse(html);
 const view=selectedArticlePresentation(a,{route:r.route}),projected=view.article;
 const notices=all(dom,n=>attr(n,'data-selected-ai-review')===r.record_id);assert.equal(notices.length,1);
 const article=all(dom,n=>attr(n,'data-current-research')===r.record_id)[0],body=text(article),current=visibleWithoutHistory(article);
 assert.equal(attr(notices[0],'data-review-sha256'),r.sha256);
 for(const value of [r.decision,r.rationale,r.source_record_sha256,...r.findings.flatMap(f=>[f.location,f.disposition,f.finding])])assert(body.includes(value),`${r.record_id}: missing decision text`);
 const histories=all(article,n=>attr(n,'data-prior-editorial-review')!==undefined);assert.equal(histories.length,1);assert.equal(histories[0].tagName,'details');assert(text(histories[0]).includes(a.review_status));assert(!current.includes(a.review_status));
 assert(current.includes(selectedReviewStatus));assert(current.includes(`AI reviewed ${selectedReviewDate}`));
 assert(!current.includes('Independent editorial/subject acceptance is pending.'));
 for(const change of view.changes){
  const originals=all(histories[0],n=>attr(n,'data-original-field')===change.path.join('.'));assert.equal(originals.length,1);assert.equal(text(originals[0]),change.prior);
  assert(current.includes(change.replacement),`${r.record_id}: required change absent from current reader`);changedFields++;
 }
 const sections=all(article,n=>attr(n,'data-current-section')!==undefined);assert.equal(sections.length,a.sections.length);
 for(let i=0;i<projected.sections.length;i++){
  const expected=projected.sections[i],node=sections.find(n=>attr(n,'data-current-section')===String(i));assert(node);
  const paragraphs=(node.childNodes??[]).filter(n=>n.tagName==='p'&&attr(n,'class')!=='citations');
  assert.deepEqual(paragraphs.map(text),[expected.text,...(expected.paragraphs??[]).map(p=>p.text)],`${r.record_id}: section or nested text differs`);
  const citations=(node.childNodes??[]).filter(n=>n.tagName==='p'&&attr(n,'class')==='citations').map(n=>all(n,c=>c.tagName==='a').map(c=>attr(c,'href')));
  const expectedCitations=[expected.citations??[],...(expected.paragraphs??[]).map(p=>p.citations)].filter(ids=>ids.length).map(ids=>ids.map(id=>a.sources[id].url));
  assert.deepEqual(citations,expectedCitations,`${r.record_id}: citation attachment changed`);verifiedSections++;verifiedNested+=(expected.paragraphs??[]).length;
 }
 if(a.identity_evidence){const identity=all(article,n=>attr(n,'data-identity-evidence')===r.record_id)[0];assert(text(identity).includes(projected.identity_evidence.disposition));assert(!text(identity).includes(a.identity_evidence.disposition));assert(text(identity).includes(`Evidence checked ${a.identity_evidence.checked_date}`));}
 if(a.language_notes){
  const language=all(article,n=>attr(n,'data-language-notes')!==undefined)[0];assert(language);
  for(const note of projected.language_notes){const term=all(language,n=>n.tagName==='dt'&&text(n)===note.term)[0];assert.equal(attr(term,'lang'),note.lang);assert(text(language).includes(note.reading));assert(text(language).includes(note.review_status));}
  for(const note of a.language_notes)assert(!text(language).includes(note.review_status));
 }
 for(const value of [a.answer,a.source_check_boundary,...a.sections.flatMap(s=>[s.heading,s.text,...(s.paragraphs??[]).map(p=>p.text)]),...(a.source_notes??[]).flatMap(n=>[n.locator,n.scope,n.access,n.checked_date])])assert(body.includes(value),`${r.record_id}: original article truncated`);
 const links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));for(const s of a.sources)assert(links.includes(s.url));assert(links.includes('/data/build-decisions.json'));
 for(const chapter of view.chapters)assert(links.includes(`${chapter.route}#${chapter.record_id}-ai-review`));
 assert.equal(all(dom,n=>n.tagName==='h1').length,1);const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);
 assert(ids.includes(`${r.record_id}-ai-review`));for(const link of all(dom,n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')))assert(ids.includes(attr(link,'href').slice(1)),`${r.record_id}: missing local anchor`);
 const atlasProject=r.route.startsWith('/atlas/projects/')?atlas.projects.find(p=>p.atlas_project_id===r.record_id):null;
 const title=atlasProject?`${atlasProject.title} | FTFN Project Atlas`:`${a.title} | FTFN`,description=atlasProject?.editorial_question??a.answer;
 assert.equal(text(all(dom,n=>n.tagName==='title')[0]),title);
 for(const name of ['description','og:description','twitter:description'])assert.equal(attr(all(dom,n=>n.tagName==='meta'&&(attr(n,'name')===name||attr(n,'property')===name))[0],'content'),description);
 for(const name of ['og:title','twitter:title'])assert.equal(attr(all(dom,n=>n.tagName==='meta'&&(attr(n,'name')===name||attr(n,'property')===name))[0],'content'),title);
 assert(method.includes(`href="${r.route}#${r.record_id}-ai-review"`));
 assert(sitemap.includes(`<loc>https://ftfn.io${r.route}</loc>\n    <lastmod>${selectedReviewDate}</lastmod>`));
 const page=Math.floor(readerCatalog.findIndex(c=>c.id===r.record_id)/40)+1,cards=parse(await read(`/reference/explore/${page}/index.html`));
 const card=all(cards,n=>n.tagName==='article'&&all(n,x=>x.tagName==='a'&&attr(x,'href')===r.route).length===1)[0];assert(card);assert(text(card).includes(selectedReviewStatus));assert(!text(card).includes(a.review_status));
 assert(Buffer.byteLength(html)<160000,`${r.record_id}: reader too large`);
}
assert.deepEqual({changedFields,verifiedSections,verifiedNested},{changedFields:60,verifiedSections:152,verifiedNested:84});
for(const a of corpus.records.filter(a=>a.kind==='Topic')){
 const original=topics.topic_editions.find(t=>t.topic_edition_id===a.record_id);assert(original&&original.route!==a.route);
 const dom=parse(await read(`${original.route}index.html`)),historical=all(dom,n=>attr(n,'data-current-research')===a.record_id)[0];
 assert(historical);assert.equal(all(dom,n=>attr(n,'data-selected-ai-review')!==undefined).length,0);assert(text(historical).includes(a.review_status));
 for(const section of a.sections)assert(text(historical).includes(section.text),'Historical topic alias was silently rewritten');
}
const report=parse(await read('/reference/field-report/2026-09-14/index.html'));
assert.equal(all(report,n=>attr(n,'data-selected-ai-review')!==undefined).length,1);
for(const a of corpus.records.filter(a=>a.kind==='Casebook')){
 const reference=all(report,n=>attr(n,'data-selected-case-reference')===a.record_id)[0];assert(reference);
 const history=all(reference,n=>attr(n,'data-prior-report-chapter')!==undefined)[0];assert.equal(history.tagName,'details');
 const original=all(history,n=>attr(n,'data-current-research')===a.record_id)[0];assert(original);
 assert.equal(all(original,n=>attr(n,'data-selected-ai-review')!==undefined).length,0);
 for(const section of a.sections)assert(text(original).includes(section.text));
 assert(all(reference,n=>n.tagName==='a').some(n=>attr(n,'href')===`${a.route}#${a.record_id}-ai-review`));
}
console.log('Selected-article production passed: all 33 current AI decisions and 60 exact current/history field changes; 152 complete sections, 84 nested paragraphs and exact attached citations. Original exports and historical aliases/report chapters remain unchanged; 33 catalog entries, metadata, method anchors, chapter decisions and sitemap dates match. No browser/human assessment claimed.');
