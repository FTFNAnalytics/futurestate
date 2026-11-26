import {assertOnlyApprovedAnalyticsScripts} from './lib/assert-approved-analytics.mjs';
import assert from 'node:assert/strict';
import canonicalEdition from '../src/data/v1-public-reference-edition.json' with {type:'json'};
import {assertCanonicalSitemapEntry} from './lib/assert-canonical-sitemap-entry.mjs';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {nordicCitiesDossiers,nordicCitiesSourcesFor,nordicCitiesAcquisitionPathsFor} from '../src/lib/nordic-cities-named-dossiers.mjs';
import {currentPortfolioSummary,namedDossierAdditions} from '../src/lib/current-named-dossiers.mjs';
import reviews from '../src/data/nordic-cities-named-dossier-reviews.json' with {type:'json'};
const read=path=>readFile(new URL(`../dist${path}`,import.meta.url),'utf8');
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const all=(node,test)=>[...(test(node)?[node]:[]),...(node.childNodes??[]).flatMap(c=>all(c,test))];
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const data=JSON.parse(await read('/data/build-decisions.json'));
assert.deepEqual(data.nordic_cities_named_dossiers,nordicCitiesDossiers);assert.deepEqual(data.nordic_cities_named_dossier_reviews,reviews);assert.deepEqual(data.current_portfolio_summary,currentPortfolioSummary);
const sitemap=await read('/sitemap.xml'),catalog=JSON.parse(await read('/data/reader-catalog.json')).records;
const portfolio=parse(await read('/method/portfolio-decisions/index.html'));
assert.deepEqual(all(portfolio,n=>attr(n,'data-portfolio-addition')!==undefined).map(n=>attr(n,'data-portfolio-addition')).sort(),namedDossierAdditions.map(r=>r.record_id).sort());
assert.equal(all(portfolio,n=>attr(n,'data-portfolio-record')!==undefined).length,103);
for(const r of nordicCitiesDossiers.records){
 const html=await read(`${r.route}index.html`),dom=parse(html),articles=all(dom,n=>attr(n,'data-nordic-cities-dossier')===r.record_id);
 assert.equal(articles.length,1);const article=articles[0],body=text(article),links=all(article,n=>n.tagName==='a').map(n=>attr(n,'href'));
 assert.equal(all(dom,n=>n.tagName==='h1').length,1);assert.equal(text(all(dom,n=>n.tagName==='h1')[0]),r.title);
 assert.equal(all(article,n=>attr(n,'data-dossier-event')!==undefined).length,r.timeline.length);
 assert.equal(all(article,n=>attr(n,'data-dossier-section')!==undefined).length,6);
 for(const value of [r.answer,r.scope,r.stage,r.identity_decision.rationale,...r.sections.flatMap(s=>[s.heading,s.text]),...r.timeline.flatMap(t=>[t.date,t.event]),...r.next_artifacts])assert(body.includes(value),`${r.record_id}: missing rendered content`);
 for(const source of nordicCitiesSourcesFor(r)){
   assert(links.includes(source.url));assert(links.includes(`#source-${source.id}`));assert.equal(all(article,n=>attr(n,'id')===`source-${source.id}`).length,1);
   for(const value of [source.locator,source.inspection,source.boundary,source.language,source.interpretation_note,...Object.entries(source).filter(([k,v])=>(k.endsWith('_date')||k.endsWith('_period'))&&v).map(([,v])=>v)])assert(body.includes(value));
   if(source.period_basis)assert(body.includes(source.period_basis));if(source.index_url)assert(links.includes(source.index_url));
 }
 if(r.historical_acquisition){assert(links.includes(r.historical_acquisition.route));assert(body.includes(r.historical_acquisition.decision));}else assert(body.includes('New municipal identity with no reused historical acquisition docket.'));
 for(const path of nordicCitiesAcquisitionPathsFor(r)){
  const historicalDom=parse(await read(`${path}index.html`));
  const notices=all(historicalDom,n=>attr(n,'data-current-nordic-cities-acquisition')!==undefined);
  assert.equal(notices.length,1);assert.equal(attr(notices[0],'data-current-nordic-cities-acquisition'),r.historical_acquisition.record_id);
  const noticeText=text(notices[0]);
  for(const value of [r.scope,r.historical_acquisition.decision,nordicCitiesDossiers.inspected_date,'retained history'])assert(noticeText.includes(value));
  assert(all(notices[0],n=>n.tagName==='a').some(n=>attr(n,'href')===r.route));
  assertCanonicalSitemapEntry({sitemap,dom:historicalDom,route:path,canonicalRoute:canonicalEdition.canonical_route_map[path],date:nordicCitiesDossiers.inspected_date});
 }
 for(const link of r.related)assert(links.includes(link.route));
 assert(sitemap.includes(`<loc>https://ftfn.io${r.route}</loc>\n    <lastmod>${nordicCitiesDossiers.inspected_date}</lastmod>`));
 assert.equal(catalog.filter(c=>c.id===r.record_id).length,1);assert.equal(catalog.find(c=>c.id===r.record_id).route,r.route);
 const page=Math.floor(catalog.findIndex(c=>c.id===r.record_id)/40)+1;assert((await read(`/reference/explore/${page}/index.html`)).includes(`href="${r.route}"`));
 assert((await read(`/atlas/${r.kind==='Project'?'projects':'places'}/index.html`)).includes(`data-nordic-cities-index="${r.record_id}"`));
 assert(Buffer.byteLength(html)<64000);assertOnlyApprovedAnalyticsScripts(html);
}
console.log('NordicCities production verification passed: full articles, exact dates and source scopes, export, catalog, sitemap, Atlas hubs and retained historical determinations.');
