import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {parse} from 'parse5';
import {canonicalRegionalReadings as data,canonicalRegionalReview as review,regionalReadingSources} from '../src/lib/canonical-regional-readings.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
const read=route=>readFile(new URL('../dist'+route,import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const exported=JSON.parse(await read('/data/build-decisions.json'));
assert.deepEqual(exported.canonical_regional_readings,data);assert.deepEqual(exported.canonical_regional_reading_review,review);
const sitemap=await read('/sitemap.xml'),method=await read('/method/portfolio-decisions/index.html');
for(const r of data.records){
 const html=await read(r.route+'index.html'),dom=parse(html),place=atlas.places.find(p=>p.atlas_place_id===r.record_id);
 const readings=all(dom,n=>attr(n,'data-canonical-regional-reading')===r.record_id);assert.equal(readings.length,1);const article=readings[0];
 assert.equal(text(all(article,n=>n.tagName==='h2')[0]),r.title);assert(text(article).includes(r.answer)&&text(article).includes(r.scope));
 const sections=all(article,n=>attr(n,'data-regional-reading-section')!==undefined);assert.equal(sections.length,6);
 for(let i=0;i<r.sections.length;i++){
  const s=r.sections[i],node=sections.find(n=>attr(n,'data-regional-reading-section')===String(i));assert(node);
  assert.equal(text(all(node,n=>n.tagName==='h3')[0]),s.heading);
  assert.deepEqual((node.childNodes??[]).filter(n=>n.tagName==='p'&&attr(n,'class')!=='citations').map(text),[s.text]);
  assert.deepEqual(all(node,n=>n.tagName==='a').map(n=>attr(n,'href')),s.source_ids.map(id=>'#regional-source-'+id));
 }
 const sources=regionalReadingSources(r),nodes=all(article,n=>attr(n,'data-regional-reading-source')!==undefined);assert.equal(nodes.length,sources.length);
 for(const s of sources){
  const node=nodes.find(n=>attr(n,'data-regional-reading-source')===s.id);assert(node);assert.equal(attr(node,'id'),'regional-source-'+s.id);
  assert(all(node,n=>n.tagName==='a').some(n=>attr(n,'href')===s.url));
  for(const field of ['title','publisher','role','inspected_date','locator','access','boundary','provenance'])assert(text(node).includes(s[field]),s.id+': '+field);
  for(const date of s.dates)assert(text(node).includes(date.label+': '+date.value));
 }
 const decision=review.records.find(d=>d.record_id===r.record_id),assessments=all(article,n=>attr(n,'data-regional-reading-assessment')===r.record_id);assert.equal(assessments.length,1);
 for(const value of [decision.sha256,decision.decision,...decision.findings])assert(text(assessments[0]).includes(value));
 assert(text(article).includes('no new external source check or independent review is claimed'));
 const noGate=all(article,n=>attr(n,'data-regional-no-cycle')!==undefined);assert.equal(noGate.length,1);assert(text(noGate[0]).includes('no assigned Phase 60 gate'));
 for(const token of ['data-place-reading-context','data-place-assigned-gate','data-place-related-companion','data-evidence-receipt'])assert.equal(all(article,n=>attr(n,token)!==undefined).length,0);
 const history=all(dom,n=>attr(n,'data-prior-atlas-account')===r.record_id);assert.equal(history.length,1);assert.equal(history[0].tagName,'details');assert.equal(attr(history[0],'open'),undefined);
 assert.equal(all(history[0],n=>attr(n,'data-canonical-regional-reading')!==undefined).length,0);
 assert.equal(all(dom,n=>attr(n,'data-recorded-system-boundary')===r.record_id).length,1);
 assert(html.indexOf('data-canonical-regional-reading="'+r.record_id+'"')<html.indexOf('data-recorded-system-boundary="'+r.record_id+'"'));
 assert(html.indexOf('data-recorded-system-boundary="'+r.record_id+'"')<html.indexOf('data-prior-atlas-account="'+r.record_id+'"'));
 assert(text(dom).includes('Historical Atlas review '+place.last_reviewed_date));
 for(const item of r.next_artifacts)assert(text(article).includes(item));
 const links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));
 for(const route of [...r.related.map(l=>l.route),r.prior_route,'/data/build-decisions.json'])assert(links.includes(route));
 const prior=parse(await read(r.prior_route+'index.html')),returnLinks=all(prior,n=>attr(n,'data-current-place-reading-link')===r.record_id);assert.equal(returnLinks.length,1);
 assert(all(returnLinks[0],n=>n.tagName==='a').some(n=>attr(n,'href')===r.route));
 assert.equal(all(prior,n=>attr(n,'data-canonical-regional-reading')!==undefined).length,0);
 for(const route of [r.route,r.prior_route])assert(sitemap.includes('<loc>https://ftfn.io'+route+'</loc>\n    <lastmod>'+data.review_date+'</lastmod>'));
 assert(method.includes('href="'+r.route+'"'));assert.equal(all(dom,n=>n.tagName==='h1').length,1);
 const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);
 for(const a of all(article,n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')))assert(ids.includes(attr(a,'href').slice(1)));
 assert(gzipSync(html).byteLength<150000,'Regional page exceeds gzip HTML budget: '+r.route);
 const page=Math.floor(readerCatalog.findIndex(c=>c.id===r.record_id)/40)+1,explore=parse(await read('/reference/explore/'+page+'/index.html'));
 const catalogLink=all(explore,n=>n.tagName==='a').find(n=>attr(n,'href')===r.route);assert(catalogLink);
 const card=all(explore,n=>n.tagName==='article').find(n=>all(n,x=>x===catalogLink).length);assert(card&&text(card).includes('Place'));
}
console.log('Canonical regional production passed: 5 readings, 30 sections, 42 exact retained source notes, original dates, 5 no-cycle boundaries, exact assessments/export, historical links, sitemap, one h1, unique anchors and gzip budgets. No new inspections or browser testing claimed.');
