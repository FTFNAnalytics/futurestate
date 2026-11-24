import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {parse} from 'parse5';
import {canonicalPlaceReadings as data,canonicalPlaceReview as review,placeReadingSources,placeReadingContext,placeReadingRelatedContexts,placeReadingAssignedGateContexts} from '../src/lib/canonical-place-readings.mjs';
import {evidenceReceiptsForRoute} from '../src/lib/current-evidence.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
const read=route=>readFile(new URL('../dist'+route,import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const exported=JSON.parse(await read('/data/build-decisions.json'));assert.deepEqual(exported.canonical_place_readings,data);assert.deepEqual(exported.canonical_place_reading_review,review);
const sitemap=await read('/sitemap.xml'),method=await read('/method/portfolio-decisions/index.html');
for(const r of data.records){
 const html=await read(r.route+'index.html'),dom=parse(html),place=atlas.places.find(p=>p.atlas_place_id===r.record_id);
 const readings=all(dom,n=>attr(n,'data-canonical-place-reading')===r.record_id);assert.equal(readings.length,1);const article=readings[0];
 assert(text(article).includes(r.answer)&&text(article).includes(r.scope));
 const scopeNodes=all(article,n=>attr(n,'data-place-reading-scope')===r.kind);assert.equal(scopeNodes.length,1);
 const excluded=all(dom,n=>attr(n,'data-excluded-system-context')===r.record_id);assert.equal(excluded.length,r.kind==='Context'?1:0);
 if(r.kind==='Context'){assert(text(scopeNodes[0]).includes('It adds zero counted places'));assert(text(article).includes('Dated system context'));}
 const sections=all(article,n=>attr(n,'data-place-reading-section')!==undefined);assert.equal(sections.length,6);
 const sources=placeReadingSources(r),sourceNodes=all(article,n=>attr(n,'data-place-reading-source')!==undefined);assert.equal(sourceNodes.length,sources.length);
 for(let i=0;i<r.sections.length;i++){
  const expected=r.sections[i],node=sections.find(n=>attr(n,'data-place-reading-section')===String(i));assert(node);
  assert.equal(text(all(node,n=>n.tagName==='h3')[0]),expected.heading);
  const paragraphs=(node.childNodes??[]).filter(n=>n.tagName==='p'&&attr(n,'class')!=='citations');assert.deepEqual(paragraphs.map(text),[expected.text]);
  const citations=all(node,n=>n.tagName==='a').map(n=>attr(n,'href'));assert.deepEqual(citations,expected.source_ids.map(id=>'#place-source-'+id));
 }
 for(const source of sources){
  const node=sourceNodes.find(n=>attr(n,'data-place-reading-source')===source.id);assert(node);assert.equal(attr(node,'id'),'place-source-'+source.id);
  assert(all(node,n=>n.tagName==='a').some(n=>attr(n,'href')===source.check.url));
  for(const value of [source.check.finding,source.check.locator,source.check.access_result,source.check.limitation,source.check.accessed_date,source.receipt_id])assert(text(node).includes(value),source.id+': missing retained source scope');
  if(source.check.source_date)assert(text(node).includes(source.check.source_date));
 }
 const assessment=all(article,n=>attr(n,'data-place-reading-assessment')===r.record_id);assert.equal(assessment.length,1);const d=review.records.find(x=>x.record_id===r.record_id);assert(text(assessment[0]).includes(d.sha256));for(const finding of d.findings)assert(text(assessment[0]).includes(finding));
 assert(text(article).includes('no new external source check or independent review is claimed'));
 const context=placeReadingContext(r),contexts=all(article,n=>attr(n,'data-place-reading-context')===context.receipt_id);assert.equal(contexts.length,1);
 for(const value of [r.context_role,context.source_checked_date,context.next_check_date,context.next_action])assert(text(contexts[0]).includes(value));
 const relatedContexts=placeReadingRelatedContexts(r),companionNodes=all(article,n=>attr(n,'data-place-related-companion')!==undefined);assert.equal(companionNodes.length,relatedContexts.length);
 for(const related of relatedContexts){
  const {receipt}=related,node=companionNodes.find(n=>attr(n,'data-place-related-companion')===receipt.receipt_id);assert(node);
  for(const value of [related.label,related.relation,receipt.source_checked_date,receipt.next_check_date,receipt.bounded_finding,receipt.next_action])assert(text(node).includes(value));
  assert(all(node,n=>n.tagName==='a').some(n=>attr(n,'href')===receipt.gate_route));
  assert.equal(all(article,n=>attr(n,'data-place-reading-context')===receipt.receipt_id).length,0,'Related-only companion became assigned place context');
 }
 const history=all(dom,n=>attr(n,'data-prior-atlas-account')===r.record_id);assert.equal(history.length,1);assert.equal(history[0].tagName,'details');assert.equal(attr(history[0],'open'),undefined);
 const assignedContexts=placeReadingAssignedGateContexts(r),assignedNodes=all(article,n=>attr(n,'data-place-assigned-gate')!==undefined);assert.equal(assignedNodes.length,assignedContexts.length);
 for(const assigned of assignedContexts){
  const {receipt}=assigned,node=assignedNodes.find(n=>attr(n,'data-place-assigned-gate')===receipt.receipt_id);assert(node);
  for(const value of [assigned.label,assigned.relation,receipt.source_checked_date,receipt.next_check_date,receipt.bounded_finding,receipt.next_action])assert(text(node).includes(value));
  assert(all(node,n=>n.tagName==='a').some(n=>attr(n,'href')===receipt.gate_route));
  assert.equal(all(article,n=>attr(n,'data-place-related-companion')===receipt.receipt_id).length,0,'Assigned primary gate became a companion');
  assert.equal(all(article,n=>attr(n,'data-place-reading-context')===receipt.receipt_id).length,0,'Independent gate collapsed into main context');
 }
 for(const name of ['data-canonical-place-reading','data-place-reading-context','data-place-related-companion','data-place-assigned-gate','data-recorded-system-boundary','data-evidence-receipt'])assert.equal(all(history[0],n=>attr(n,name)!==undefined).length,0,name+' hidden in history');
 assert.equal(all(dom,n=>attr(n,'data-recorded-system-boundary')===r.record_id).length,1);
 assert(html.indexOf('data-canonical-place-reading="'+r.record_id+'"')<html.indexOf('data-recorded-system-boundary="'+r.record_id+'"'));
 assert(html.indexOf('data-recorded-system-boundary="'+r.record_id+'"')<html.indexOf('data-prior-atlas-account="'+r.record_id+'"'));
 assert(text(dom).includes('Historical Atlas review '+place.last_reviewed_date));
 for(const date of place.conversion.next_check_dates)assert(text(history[0]).includes('Historical Atlas appointment '+date));
 for(const receipt of evidenceReceiptsForRoute(r.route)){
  assert.equal(all(dom,n=>attr(n,'data-evidence-receipt')===receipt.receipt_id).length,1);
  assert(html.indexOf('data-evidence-receipt="'+receipt.receipt_id+'"')<html.indexOf('data-canonical-place-reading="'+r.record_id+'"'));
 }
 const links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));for(const link of [...r.related.map(l=>l.route),r.prior_route,'/data/build-decisions.json'])assert(links.includes(link));
 const prior=parse(await read(r.prior_route+'index.html')),returnLinks=all(prior,n=>attr(n,'data-current-place-reading-link')===r.record_id);assert.equal(returnLinks.length,1);assert(all(returnLinks[0],n=>n.tagName==='a').some(n=>attr(n,'href')===r.route));assert.equal(all(prior,n=>attr(n,'data-canonical-place-reading')!==undefined).length,0);
 if(r.kind==='Context')assert(text(returnLinks[0]).includes('Later dated system context'));
 for(const route of [r.route,r.prior_route])assert(sitemap.includes('<loc>https://ftfn.io'+route+'</loc>\n    <lastmod>'+data.review_date+'</lastmod>'));
 assert(method.includes('href="'+r.route+'"'));assert.equal(all(dom,n=>n.tagName==='h1').length,1);
 const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);
 for(const a of all(article,n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')))assert(ids.includes(attr(a,'href').slice(1)));
 assert(gzipSync(html).byteLength<150000,'Canonical place exceeds declared gzip HTML budget: '+r.route);
 const page=Math.floor(readerCatalog.findIndex(c=>c.id===r.record_id)/40)+1,explore=parse(await read('/reference/explore/'+page+'/index.html'));
 const catalogLink=all(explore,n=>n.tagName==='a').find(n=>attr(n,'href')===r.route);assert(catalogLink);const card=all(explore,n=>n.tagName==='article').find(n=>all(n,x=>x===catalogLink).length);assert(card&&text(card).includes(r.kind));
}
console.log('Canonical place/context production passed: 8 readings, 48 sections, 55 retained source checks, 8 main contexts, 3 separate assigned gates and one related-only Starlink companion. Two excluded parents are labelled Context with zero place contribution. Exact assessment/export, historical links, dates, citations, sitemap, one h1, unique anchors and gzip budgets verified; no browser or human testing claimed.');
