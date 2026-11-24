import assert from 'node:assert/strict';
import {parse} from 'parse5';
import {decodeHtmlText} from './verify-update-archive.mjs';
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];

export function assertCanonicalSitemapEntry({sitemap,dom,route,canonicalRoute,date}){
 assert(canonicalRoute?.startsWith('/')&&!canonicalRoute.startsWith('//'),'An explicit local canonical route is required');
 const canonical=all(dom,n=>n.tagName==='link'&&attr(n,'rel')==='canonical');
 assert.equal(canonical.length,1,`One canonical link: ${route}`);
 assert.equal(attr(canonical[0],'href'),`https://ftfn.io${canonicalRoute}`,`Canonical target: ${route}`);
 const entries=[...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>({url:decodeHtmlText(m[1].match(/<loc>([^<]*)<\/loc>/)?.[1]??''),date:m[1].match(/<lastmod>([^<]*)<\/lastmod>/)?.[1]}));
 const indexed=entries.filter(e=>e.url===`https://ftfn.io${canonicalRoute}`);
 assert.equal(indexed.length,1,`One indexed canonical URL: ${route}`);
 assert.equal(indexed[0].date,date,`Exact canonical revision date: ${route}`);
 if(route!==canonicalRoute)assert(!entries.some(e=>e.url===`https://ftfn.io${route}`),`Legacy alias must not duplicate its canonical sitemap entry: ${route}`);
}

const fixture={route:'/old/',canonicalRoute:'/canonical/',date:'2026-11-22',sitemap:'<urlset><url><loc>https://ftfn.io/canonical/</loc><lastmod>2026-11-22</lastmod></url></urlset>',dom:parse('<link rel="canonical" href="https://ftfn.io/canonical/">')};
assertCanonicalSitemapEntry(fixture);
for(const changed of [{date:'2026-11-21'},{canonicalRoute:'/wrong/'},{sitemap:'<urlset></urlset>'},{dom:parse('<link rel="canonical" href="https://ftfn.io/wrong/">')},{sitemap:fixture.sitemap.replace('</urlset>','<url><loc>https://ftfn.io/old/</loc><lastmod>2026-11-22</lastmod></url></urlset>')}])assert.throws(()=>assertCanonicalSitemapEntry({...fixture,...changed}),assert.AssertionError);
