import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {translatedReaders,translationHistoricalContractRoute,translationContractNavigation} from '../src/lib/translated-readers.mjs';
import {readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import {currentEvidenceLedger} from '../src/lib/current-evidence.mjs';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
import {parse} from 'parse5';
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const assertSourceLink=(dom,source,recordId)=>{
 const rows=all(dom,n=>n.tagName==='li'&&attr(n,'data-reader-source')===source.id);
 assert.equal(rows.length,1,`Expected one source row: ${recordId}/${source.id}`);
 // Compare parsed attributes: HTML correctly escapes query-string ampersands.
 const links=all(rows[0],n=>n.tagName==='a'&&attr(n,'href')===source.url);
 assert.equal(links.length,1,`Missing exact source URL: ${recordId}/${source.id}`);
 assert.equal(all(rows[0],n=>n.tagName==='a'&&attr(n,'href')===`/atlas/sources/${source.id}/`).length,1,`Missing source profile: ${recordId}/${source.id}`);
 if(source.language)assert.equal(attr(links[0],'lang'),source.language);
};
const sourceFixture={id:'query-source',url:'https://example.test/report?a=1&b=2',language:'en'};
const sourceFixtureHtml='<ul><li data-reader-source="query-source"><a href="https://example.test/report?a=1&amp;b=2" lang="en">Report</a><a href="/atlas/sources/query-source/">Source</a></li></ul>';
assertSourceLink(parse(sourceFixtureHtml),sourceFixture,'fixture');
for(const html of [sourceFixtureHtml.replace('b=2','b=3'),sourceFixtureHtml.replace('&amp;','&amp;amp;'),sourceFixtureHtml.replace('/atlas/sources/query-source/','/atlas/sources/wrong/'),sourceFixtureHtml.replace('lang="en"','lang="fr"')])assert.throws(()=>assertSourceLink(parse(html),sourceFixture,'fixture'),assert.AssertionError);
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8'),json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json'),data=await json('dist/data/build-decisions.json'),catalog=await json('dist/data/reader-catalog.json');
assert.deepEqual(data.translations,await json('src/data/ai-reviewed-translations.json'));
assert.deepEqual(data.translation_contract_navigation,translationContractNavigation);
const hub=await read('dist/reference/accessible-editions/index.html'),sitemap=await read('dist/sitemap.xml');
for(const r of translatedReaders){
 const page=Math.floor(catalog.records.findIndex(c=>c.id===r.record_id)/40)+1;
 const browse=await read(`dist/reference/explore/${page}/index.html`);
 const html=await read(`dist${r.route}index.html`),text=decodeHtmlText(html),dom=parse(html);
 for(const name of ['description','og:description','twitter:description'])assert.equal(attr(all(dom,n=>n.tagName==='meta'&&(attr(n,'name')===name||attr(n,'property')===name))[0],'content'),r.overview);
 for(const name of ['og:title','twitter:title'])assert.equal(attr(all(dom,n=>n.tagName==='meta'&&(attr(n,'name')===name||attr(n,'property')===name))[0],'content'),`${r.title} | FTFN`);
 const ids=all(dom,n=>attr(n,'id')!==undefined).map(n=>attr(n,'id'));assert.equal(ids.length,new Set(ids).size);
 for(const link of all(dom,n=>n.tagName==='a'&&attr(n,'href')?.startsWith('#')))assert(ids.includes(attr(link,'href').slice(1)));
 assert(html.includes(`<html lang="${r.locale}"`));assert(html.includes('<body lang="en"'));
 assert(html.includes(`lang="${r.locale}" data-translated-reader="${r.record_id}"`));
 assert(html.includes(`data-translation-sha256="${r.sha256}"`));assert.equal((html.match(/<h1(?:\s|>)/g)??[]).length,1);
 for(const value of [r.title,r.overview,r.review_notice,r.ui.contractBoundary])assert(text.includes(value),`Missing translation text: ${r.record_id}`);
 const preparation=all(dom,n=>attr(n,'data-translation-preparation-notice')!==undefined);assert.equal(preparation.length,r.preparation_notice_is_historical?1:0);if(preparation.length){assert.equal(preparation[0].tagName,'details');assert.equal(all(preparation[0],n=>attr(n,'data-translation-review')!==undefined).length,1);}
 const applied=all(dom,n=>attr(n,'data-translation-integration-date')!==undefined);assert.equal(applied.length,r.preparation_notice_is_historical||r.integration_date!==r.ai_review_date?1:0);if(applied.length){const dated=decodeHtmlText(html);assert(dated.includes(r.integration_date)&&dated.includes(r.ai_review_date)&&dated.includes(r.evidence_cutoff));}
 for(const [i,section]of r.sections.entries()){
  const anchor=`${r.record_id.toLowerCase()}-section-${i+1}`;assert(html.includes(`id="${anchor}"`));assert(html.includes(`href="#${anchor}"`));assert(text.includes(section.heading));for(const p of section.paragraphs)assert(text.includes(p));
 }
 for(const source of r.sources)assertSourceLink(dom,source,r.record_id);
 assert.equal(r.sources.length,r.source_ids.length);
 assert(html.includes('<title>')&&text.includes(r.title));
 const contexts=readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route});assert.equal(html.includes('data-translation-source-context'),contexts.length>0);
 for(const c of contexts){assert(html.includes(`data-reader-source-review="${c.id}"`));assert(text.includes(c.summary));assert(text.includes(c.kind));assert(text.includes(r.ui.contextBoundary));}
 assert(html.includes(`href="${r.english_route}" hreflang="en"`));
 for(const other of translatedReaders.filter(t=>t.topic_id===r.topic_id&&t.record_id!==r.record_id))assert(html.includes(`href="${other.route}" lang="${other.locale}" hreflang="${other.locale}"`));
 assert(hub.includes(`href="${r.route}"`));assert(sitemap.includes(`<loc>https://ftfn.io${r.route}</loc>`));
 assert.equal(catalog.records.filter(c=>c.id===r.record_id).length,1);assert.equal(catalog.records.find(c=>c.id===r.record_id).language,r.locale);
 assert.equal(catalog.records.find(c=>c.id===r.record_id).date,r.integration_date);
 assert(browse.includes(`href="${r.route}" lang="${r.locale}"`));assert(decodeHtmlText(browse).includes(`<p lang="${r.locale}">${r.overview}</p>`));
 const historicalRoute=translationHistoricalContractRoute(r);assert(html.includes(`href="${historicalRoute}"`));
 const historical=await read(`dist${historicalRoute}index.html`);assert(historical.includes('data-translation-contract-notice'));assert(historical.includes(`href="${r.route}"`));
 for(const route of [r.english_route,r.english_route.replace('plain-language-en','low-bandwidth-en')])assert((await read(`dist${route}index.html`)).includes(`data-translation-alternative="${r.record_id}" href="${r.route}"`));
 assert(Buffer.byteLength(html)<64000,'Translated article exceeds 64 kB HTML budget');
}
console.log(`Translated-reader output verified: ${translatedReaders.length} complete localized pages, exact text/export/source contexts, separate preparation, assessment and integration notices, historic-contract notices, reciprocal links and exact catalog/sitemap entries; each under 64 kB. No browser or human-study observations claimed.`);
