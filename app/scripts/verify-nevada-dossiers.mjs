import {assertOnlyApprovedAnalyticsScripts} from './lib/assert-approved-analytics.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {nevadaDossiers,nevadaSourcesFor} from '../src/lib/nevada-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/nevada-named-dossier-reviews.json' with {type:'json'};
const read=path=>readFile(new URL(`../dist${path}`,import.meta.url),'utf8');
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const all=(node,test)=>[...(test(node)?[node]:[]),...(node.childNodes??[]).flatMap(c=>all(c,test))];
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const data=JSON.parse(await read('/data/build-decisions.json'));
assert.deepEqual(data.nevada_named_dossiers,nevadaDossiers);assert.deepEqual(data.nevada_named_dossier_reviews,reviews);assert.deepEqual(data.current_portfolio_summary,currentPortfolioSummary);
const sitemap=await read('/sitemap.xml'),catalog=JSON.parse(await read('/data/reader-catalog.json')).records;
const portfolio=parse(await read('/method/portfolio-decisions/index.html'));
assert.deepEqual(all(portfolio,n=>attr(n,'data-portfolio-addition')!==undefined).map(n=>attr(n,'data-portfolio-addition')).sort(),namedDossierAdditions.map(r=>r.record_id).sort());
assert.equal(all(portfolio,n=>attr(n,'data-portfolio-record')!==undefined).length,103);
for(const r of nevadaDossiers.records){
 const html=await read(`${r.route}index.html`),dom=parse(html),articles=all(dom,n=>attr(n,'data-nevada-dossier')===r.record_id);
 assert.equal(articles.length,1);const article=articles[0],body=text(article),links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));
 assert.equal(all(dom,n=>n.tagName==='h1').length,1);assert.equal(text(all(dom,n=>n.tagName==='h1')[0]),r.title);
 for(const value of [r.answer,r.scope,r.stage,r.identity_decision.rationale,...r.sections.flatMap(s=>[s.heading,s.text]),...r.next_artifacts])assert(body.includes(value),`${r.record_id}: missing rendered content`);
 for(const source of nevadaSourcesFor(r)){assert(links.includes(source.url));assert(links.includes(`#source-${source.id}`));assert.equal(all(article,n=>attr(n,'id')===`source-${source.id}`).length,1);for(const value of [source.locator,source.inspection,source.boundary,...Object.entries(source).filter(([k,v])=>(k.endsWith('_date')||k==='period_end')&&v).map(([,v])=>v)])assert(body.includes(value));}
 for(const link of r.related)assert(links.includes(link.route));
 assert(sitemap.includes(`<loc>https://ftfn.io${r.route}</loc>\n    <lastmod>${nevadaDossiers.inspected_date}</lastmod>`));
 assert.equal(catalog.filter(c=>c.id===r.record_id).length,1);assert.equal(catalog.find(c=>c.id===r.record_id).route,r.route);
 const page=Math.floor(catalog.findIndex(c=>c.id===r.record_id)/40)+1;assert((await read(`/reference/explore/${page}/index.html`)).includes(`href="${r.route}"`));
 assert((await read(`/atlas/${r.kind==='Project'?'projects':'places'}/index.html`)).includes(`data-nevada-index="${r.record_id}"`));
 assert(Buffer.byteLength(html)<64000);assertOnlyApprovedAnalyticsScripts(html);
}
for(const route of ['/atlas/projects/nevada-lithium-to-qualified-material/','/atlas/places/nevada-lithium-battery-materials-corridor/']){const dom=parse(await read(`${route}index.html`)),panels=all(dom,n=>attr(n,'data-nevada-current-links')!==undefined);assert.equal(panels.length,1);for(const r of nevadaDossiers.records)assert(all(panels[0],n=>n.tagName==='a').some(n=>attr(n,'href')===r.route));}
console.log('Nevada production verification passed: exact three full articles, source locators/dates, citations, export, catalog, sitemap, parent links and 103 retained historical determinations.');
