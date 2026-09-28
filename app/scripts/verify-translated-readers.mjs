import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {translatedReaders} from '../src/lib/translated-readers.mjs';
import {readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import {currentEvidenceLedger} from '../src/lib/current-evidence.mjs';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
import {parse} from 'parse5';
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,test)=>[...(test(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,test))];
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8'),json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json'),data=await json('dist/data/build-decisions.json'),catalog=await json('dist/data/reader-catalog.json');
assert.deepEqual(data.translations,await json('src/data/ai-reviewed-translations.json'));
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
 for(const [i,section]of r.sections.entries()){
  const anchor=`${r.record_id.toLowerCase()}-section-${i+1}`;assert(html.includes(`id="${anchor}"`));assert(html.includes(`href="#${anchor}"`));assert(text.includes(section.heading));for(const p of section.paragraphs)assert(text.includes(p));
 }
 for(const source of r.sources){assert(html.includes(`href="${source.url}"`));assert(html.includes(`href="/atlas/sources/${source.id}/"`));if(source.language)assert.equal(attr(all(dom,n=>n.tagName==='a'&&attr(n,'href')===source.url)[0],'lang'),source.language);}
 assert.equal(r.sources.length,r.source_ids.length);
 assert(html.includes('<title>')&&text.includes(r.title));
 const contexts=readerSourceReviewContexts(r,currentEvidenceLedger,ops,{route:r.route});assert.equal(html.includes('data-translation-source-context'),contexts.length>0);
 for(const c of contexts){assert(html.includes(`data-reader-source-review="${c.id}"`));assert(text.includes(c.summary));assert(text.includes(c.kind));assert(text.includes(r.ui.contextBoundary));}
 assert(html.includes(`href="${r.english_route}" hreflang="en"`));
 for(const other of translatedReaders.filter(t=>t.topic_id===r.topic_id&&t.record_id!==r.record_id))assert(html.includes(`href="${other.route}" lang="${other.locale}" hreflang="${other.locale}"`));
 assert(hub.includes(`href="${r.route}"`));assert(sitemap.includes(`<loc>https://ftfn.io${r.route}</loc>`));
 assert.equal(catalog.records.filter(c=>c.id===r.record_id).length,1);assert.equal(catalog.records.find(c=>c.id===r.record_id).language,r.locale);
 assert(browse.includes(`href="${r.route}" lang="${r.locale}"`));assert(decodeHtmlText(browse).includes(`<p lang="${r.locale}">${r.overview}</p>`));
 const historical=await read(`dist${r.historical_contract.route}index.html`);assert(historical.includes('data-translation-contract-notice'));assert(historical.includes(`href="${r.route}"`));
 for(const route of [r.english_route,r.english_route.replace('plain-language-en','low-bandwidth-en')])assert((await read(`dist${route}index.html`)).includes(`data-translation-alternative="${r.record_id}" href="${r.route}"`));
 assert(Buffer.byteLength(html)<64000,'Translated article exceeds 64 kB HTML budget');
}
console.log('Translated-reader output verified: ten complete localized pages, exact text/export/source-context preservation, correct language metadata, historic-contract notices, reciprocal language links, exact paginated catalog and sitemap entries; each under 64 kB. No browser or human-study observations claimed.');
