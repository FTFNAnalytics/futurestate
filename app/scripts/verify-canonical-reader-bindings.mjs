import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {canonicalReaderBindings as data,canonicalReaderLinksFor,canonicalReaderPresentation} from '../src/lib/canonical-reader-bindings.mjs';
import editorial from '../src/data/phase-205-216-current-editorial.json' with {type:'json'};
import operations from '../src/data/phase-207-current-operations.json' with {type:'json'};
const read=route=>readFile(new URL('../dist'+route,import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
assert.deepEqual(JSON.parse(await read('/data/build-decisions.json')).canonical_reader_bindings,data);
const sitemap=await read('/sitemap.xml'),method=await read('/method/portfolio-decisions/index.html');
for(const binding of data.records){
 const original=editorial.records.find(r=>r.record_id===binding.article_record_id),view=canonicalReaderPresentation(original,{route:binding.target_route});
 const html=await read(binding.target_route+'index.html'),dom=parse(html);
 const notices=all(dom,n=>attr(n,'data-canonical-reader-binding')===binding.binding_id);assert.equal(notices.length,1);
 const boundaryAttr=original.kind==='Place'?'data-recorded-system-boundary':'data-recorded-conversion-stage';
 const stage=all(dom,n=>attr(n,boundaryAttr)===binding.atlas_record_id);assert.equal(stage.length,1);
 const articles=all(dom,n=>attr(n,'data-current-research')===binding.article_record_id);assert.equal(articles.length,1);
 const article=articles[0],notice=notices[0],history=all(dom,n=>attr(n,'data-prior-atlas-account')===binding.atlas_record_id);
 assert.equal(history.length,1);assert.equal(history[0].tagName,'details');assert.equal(attr(history[0],'open'),undefined);
 assert.equal(all(history[0],n=>attr(n,'data-current-research')!==undefined).length,0);
 assert.equal(all(history[0],n=>attr(n,boundaryAttr)!==undefined).length,0);
 assert(html.indexOf(boundaryAttr+'="'+binding.atlas_record_id+'"')<html.indexOf('data-prior-atlas-account="'+binding.atlas_record_id+'"'));
 assert(text(history[0]).includes('Earlier Atlas account and evidence links'));
 assert(text(notice).includes(data.review_date)&&text(notice).includes(binding.current_status_boundary));
 assert(all(notice,n=>n.tagName==='a').some(n=>attr(n,'href')===binding.article_route));
 const related=canonicalReaderLinksFor(binding.binding_id),relatedLists=all(notice,n=>attr(n,'data-canonical-related-readers')!==undefined);
 assert.equal(relatedLists.length,related.length?1:0);
 if(related.length)assert.deepEqual(all(relatedLists[0],n=>n.tagName==='a').map(n=>({route:attr(n,'href'),label:text(n)})),related.map(r=>({route:r.route,label:r.label})));
 const decisions=all(article,n=>attr(n,'data-selected-ai-review')===binding.article_record_id);assert.equal(decisions.length,1);assert.equal(attr(decisions[0],'data-review-sha256'),binding.article_review_sha256);
 const sections=all(article,n=>attr(n,'data-current-section')!==undefined);assert.equal(sections.length,binding.section_count);
 for(let i=0;i<view.presentation.article.sections.length;i++){
  const expected=view.presentation.article.sections[i],section=sections.find(n=>attr(n,'data-current-section')===String(i));
  const paragraphs=(section.childNodes??[]).filter(n=>n.tagName==='p'&&attr(n,'class')!=='citations');
  assert.deepEqual(paragraphs.map(text),[expected.text,...(expected.paragraphs??[]).map(p=>p.text)]);
  const citations=(section.childNodes??[]).filter(n=>n.tagName==='p'&&attr(n,'class')==='citations').map(n=>all(n,c=>c.tagName==='a').map(c=>attr(c,'href')));
  const expectedCitations=[expected.citations??[],...(expected.paragraphs??[]).map(p=>p.citations)].filter(ids=>ids.length).map(ids=>ids.map(id=>original.sources[id].url));
  assert.deepEqual(citations,expectedCitations);
 }
 for(const note of original.source_notes??[])for(const value of [note.checked_date,note.locator,note.scope,note.access])assert(text(article).includes(value));
 assert.equal(all(dom,n=>n.tagName==='h1').length,1);
 const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);
 assert(sitemap.includes('<loc>https://ftfn.io'+binding.target_route+'</loc>\n    <lastmod>'+data.review_date+'</lastmod>'));
 assert(method.includes('href="'+binding.target_route+'"'));
 for(const receipt of operations.receipts.filter(r=>r.affected_routes.includes(binding.target_route))){
  assert.equal(all(dom,n=>attr(n,'data-operations-receipt')===receipt.receipt_id).length,1);
  assert.equal(all(history[0],n=>attr(n,'data-operations-receipt')===receipt.receipt_id).length,0);
  assert(html.indexOf('data-operations-receipt="'+receipt.receipt_id+'"')<html.indexOf('data-current-research="'+binding.article_record_id+'"'));
 }
 const originalDom=parse(await read(binding.article_route+'index.html'));
 assert.equal(all(originalDom,n=>attr(n,'data-canonical-reader-binding')!==undefined).length,0);
 assert.equal(all(originalDom,n=>attr(n,'data-selected-ai-review')===binding.article_record_id).length,1);
}
console.log('Canonical reader production passed: 6 canonical pages, 37 complete sections and 37 nested paragraphs with exact citations; dated source notes, separate later operations, original routes and accessible historical accounts preserved.');
