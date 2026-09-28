import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import data from '../src/data/locality-dossiers.json' with {type:'json'};
import history from '../src/data/phase-178-systems-atlas-and-compendium-depth-expansion.json' with {type:'json'};
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
const read=route=>readFile(new URL(`../dist${route}`,import.meta.url),'utf8');
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const all=(node,test)=>[...(test(node)?[node]:[]),...(node.childNodes??[]).flatMap(c=>all(c,test))];
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const places=await read('/atlas/places/index.html'),hub=await read(`${history.routes.hub}index.html`),catalog=JSON.parse(await read('/data/reader-catalog.json')).records,sitemap=await read('/sitemap.xml');
assert.deepEqual(JSON.parse(await read('/data/build-decisions.json')).locality_dossiers,data);
assert.equal((places.match(/data-locality-index=/g)??[]).length,10);assert.equal((hub.match(/data-locality-card=/g)??[]).length,10);
for(const r of data.records){
 const html=await read(`${r.route}index.html`),dom=parse(html),articles=all(dom,n=>attr(n,'data-locality-article')===r.record_id),histories=all(dom,n=>attr(n,'data-locality-history')===r.record_id);
 assert.equal(articles.length,1);assert.equal(histories.length,1);const article=articles[0],body=text(article);assert.equal(histories[0].tagName,'details');assert.equal(attr(histories[0],'id'),'locality-history');
 assert.equal(all(dom,n=>n.tagName==='h1').length,1);assert.equal(text(all(dom,n=>n.tagName==='h1')[0]),r.title);assert(text(all(dom,n=>n.tagName==='title')[0]).includes(r.title));
 for(const name of ['description','og:description','twitter:description'])assert.equal(attr(all(dom,n=>n.tagName==='meta'&&(attr(n,'name')===name||attr(n,'property')===name))[0],'content'),r.answer);
 for(const value of [r.answer,r.scope,r.ai_review_date,r.sha256,r.next_artifact,...r.sections.flatMap(s=>[s.heading,s.text]),...r.timeline.flatMap(t=>[t.date,t.kind,t.text])])assert(body.includes(value),`${r.record_id}: missing current article text`);
 const links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));for(const source of r.source_checks){assert(links.includes(source.url));for(const value of [source.title,source.locator,source.access,source.recorded_check_date])assert(body.includes(value));}
 const old=history.place_system_dossiers.find(o=>o.place_system_dossier_id===r.record_id);assert(text(histories[0]).includes(old.title));assert(text(histories[0]).includes(old.reader_narrative));assert(text(histories[0]).includes(old.source_factual_nucleus));
 assert(html.includes('class="skip-link" href="#main-content"'));assert(html.includes('tabindex="-1"'));assert(!/<script\b/i.test(html));const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);for(const href of links.filter(h=>h.startsWith('#')))assert(ids.includes(href.slice(1)));
 assert(places.includes(`href="${r.route}"`));assert(hub.includes(`href="${r.route}"`));assert(sitemap.includes(`<loc>https://ftfn.io${r.route}</loc>`));assert.equal(catalog.filter(c=>c.id===r.record_id).length,1);assert.equal(catalog.find(c=>c.id===r.record_id).title,r.title);
 const page=Math.floor(readerCatalog.findIndex(c=>c.id===r.record_id)/40)+1;assert((await read(`/reference/explore/${page}/index.html`)).includes(`href="${r.route}"`));
 for(const related of r.related_record_ids)assert(links.includes(data.records.find(d=>d.record_id===related).route));
 assert(Buffer.byteLength(html)<150000,`${r.record_id}: combined current/history page too large`);
}
for(const r of [...history.comparison_overlays,...history.interpretive_essays])assert(!(await read(`${r.route}index.html`)).includes('data-locality-article='));
console.log('Locality production passed: ten complete current articles on unchanged routes, exact metadata/catalog/export, original narratives and source checks preserved, unique headings/IDs, static history disclosures and no projection to the twelve comparison/essay routes.');
