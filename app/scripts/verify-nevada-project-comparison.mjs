import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {parse} from 'parse5';
import {nevadaComparison as data,nevadaComparisonReview as review,nevadaComparisonSources} from '../src/lib/nevada-project-comparison.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import atlas from '../src/data/phase-119-deep-project-place-atlas.json' with {type:'json'};
import portfolio from '../src/data/portfolio-eligibility-decisions.json' with {type:'json'};
const read=route=>readFile(new URL('../dist'+route,import.meta.url),'utf8');
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const r=data.records[0],project=atlas.projects.find(p=>p.atlas_project_id===r.record_id);
const exported=JSON.parse(await read('/data/build-decisions.json'));assert.deepEqual(exported.nevada_project_comparison,data);assert.deepEqual(exported.nevada_project_comparison_review,review);
const html=await read(r.route+'index.html'),dom=parse(html),articles=all(dom,n=>attr(n,'data-nevada-project-comparison')===r.record_id);assert.equal(articles.length,1);const article=articles[0];
assert.equal(text(all(article,n=>n.tagName==='h2')[0]),r.title);assert(text(article).includes(r.answer)&&text(article).includes(r.scope));
const exclusion=all(dom,n=>attr(n,'data-excluded-project-context')===r.record_id);assert.equal(exclusion.length,1);assert(text(exclusion[0]).includes('excluded from the eligible-project target'));
const sections=all(article,n=>attr(n,'data-comparison-section')!==undefined);assert.equal(sections.length,6);
for(let i=0;i<r.sections.length;i++){
 const s=r.sections[i],node=sections.find(n=>attr(n,'data-comparison-section')===String(i));assert(node);
 assert.equal(text(all(node,n=>n.tagName==='h3')[0]),s.heading);
 assert.deepEqual((node.childNodes??[]).filter(n=>n.tagName==='p'&&attr(n,'class')!=='citations').map(text),[s.text]);
 assert.deepEqual(all(node,n=>n.tagName==='a').map(n=>attr(n,'href')),s.source_ids.map(id=>'#comparison-source-'+id));
}
const tables=all(article,n=>attr(n,'data-nevada-project-matrix')!==undefined);assert.equal(tables.length,1);
assert.equal(all(tables[0],n=>n.tagName==='caption').length,1);assert.equal(all(tables[0],n=>n.tagName==='th'&&attr(n,'scope')==='col').length,3);
const rows=all(tables[0],n=>attr(n,'data-comparison-row')!==undefined);assert.equal(rows.length,3);
for(let i=0;i<r.comparison_rows.length;i++){
 const row=r.comparison_rows[i],node=rows.find(n=>attr(n,'data-comparison-row')===String(i));assert(node);
 assert.equal(text(all(node,n=>n.tagName==='th'&&attr(n,'scope')==='row')[0]),row.dimension);
 const cells=all(node,n=>n.tagName==='td');assert.equal(cells.length,2);
 for(const [j,cell] of [row.thacker,row.rhyolite].entries()){assert(text(cells[j]).includes(cell.text));assert.deepEqual(all(cells[j],n=>n.tagName==='a').map(n=>attr(n,'href')),cell.source_ids.map(id=>'#comparison-source-'+id));}
}
const sources=nevadaComparisonSources(r),sourceNodes=all(article,n=>attr(n,'data-comparison-source')!==undefined);assert.equal(sourceNodes.length,8);
for(const s of sources){
 const node=sourceNodes.find(n=>attr(n,'data-comparison-source')===s.id);assert(node);assert.equal(attr(node,'id'),'comparison-source-'+s.id);
 assert(all(node,n=>n.tagName==='a').some(n=>attr(n,'href')===s.url));
 for(const k of ['title','publisher','role','locator','inspection','boundary'])assert(text(node).includes(s[k]),s.id+': '+k);
 for(const [k,v] of Object.entries(s).filter(([key,value])=>value&&(key.endsWith('_date')||key==='period_end')))assert(text(node).includes(k.replaceAll('_',' ')+': '+v));
}
assert(text(article).includes(data.source_inspection_date)&&text(article).includes(data.review_date)&&text(article).includes('no fresh source check or independent review is claimed'));
const decisions=all(article,n=>attr(n,'data-comparison-assessment')!==undefined);assert.equal(decisions.length,1);
for(const value of [review.records[0].sha256,review.records[0].decision,...review.records[0].findings])assert(text(decisions[0]).includes(value));
assert.equal(all(article,n=>attr(n,'data-comparison-governance')!==undefined).length,1);
const history=all(dom,n=>attr(n,'data-prior-atlas-account')===r.record_id);assert.equal(history.length,1);assert.equal(history[0].tagName,'details');assert.equal(attr(history[0],'open'),undefined);
assert.equal(all(history[0],n=>attr(n,'data-nevada-project-comparison')!==undefined).length,0);
assert.equal(all(dom,n=>attr(n,'data-recorded-conversion-stage')===r.record_id).length,1);
assert(html.indexOf('data-nevada-project-comparison="'+r.record_id+'"')<html.indexOf('data-recorded-conversion-stage="'+r.record_id+'"'));
assert(html.indexOf('data-recorded-conversion-stage="'+r.record_id+'"')<html.indexOf('data-prior-atlas-account="'+r.record_id+'"'));
assert(text(dom).includes('Historical Atlas review '+project.last_reviewed_date));
const links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));for(const route of [...r.related.map(l=>l.route),r.prior_route,'/data/build-decisions.json'])assert(links.includes(route));
for(const item of r.next_artifacts)assert(text(article).includes(item));
assert.equal(all(dom,n=>attr(n,'data-nevada-current-links')!==undefined).length,1);
const prior=parse(await read(r.prior_route+'index.html')),returnLinks=all(prior,n=>attr(n,'data-nevada-comparison-link')===r.record_id);assert.equal(returnLinks.length,1);assert(all(returnLinks[0],n=>n.tagName==='a').some(n=>attr(n,'href')===r.route));
assert.equal(all(prior,n=>attr(n,'data-nevada-project-comparison')!==undefined).length,0);
const sitemap=await read('/sitemap.xml');for(const route of [r.route,r.prior_route])assert(sitemap.includes('<loc>https://ftfn.io'+route+'</loc>\n    <lastmod>'+data.review_date+'</lastmod>'));
assert((await read('/method/portfolio-decisions/index.html')).includes('data-nevada-comparison-summary'));
assert.equal(all(dom,n=>n.tagName==='h1').length,1);
const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);
for(const a of all(article,n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')))assert(ids.includes(attr(a,'href').slice(1)));
assert(gzipSync(html).byteLength<150000);
const catalog=JSON.parse(await read('/data/reader-catalog.json')).records;assert.equal(catalog.filter(x=>x.id===r.record_id&&x.kind==='Context').length,1);assert.equal(catalog.filter(x=>x.id===r.record_id&&x.kind==='Project').length,0);
const page=Math.floor(readerCatalog.findIndex(c=>c.id===r.record_id)/40)+1,explore=parse(await read('/reference/explore/'+page+'/index.html')),link=all(explore,n=>n.tagName==='a').find(n=>attr(n,'href')===r.route);assert(link);
const card=all(explore,n=>n.tagName==='article').find(n=>all(n,x=>x===link).length);assert(card&&text(card).includes('Context'));
const excludedProjects=atlas.projects.filter(p=>portfolio.canonical.find(x=>x.record_id===p.canonical_id)?.eligible_count===0);assert.equal(excludedProjects.length,4);
for(const p of excludedProjects){
 const pageDom=parse(await read(p.routes.atlas+'index.html')),labels=all(pageDom,n=>attr(n,'data-excluded-project-context')===p.atlas_project_id);assert.equal(labels.length,1);assert(text(labels[0]).includes('excluded from the eligible-project target'));
 const item=catalog.find(x=>x.route===p.routes.atlas);assert(item&&item.kind==='Context');
}
console.log('Nevada comparison production passed: one excluded parent, six full sections, three exact comparison rows, eight retained source notes, exact assessment/export, dates, visible stage, preserved history, reciprocal link, Context catalog, sitemap, anchors, one h1 and gzip budget. No fresh source check, new project or browser testing claimed.');
