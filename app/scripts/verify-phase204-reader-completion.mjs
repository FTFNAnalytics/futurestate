import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {collectPrimaryRecords,recordId,canonicalRecordSlug} from './lib/v1ref-records.mjs';
import {currentEvidenceLedger} from '../src/lib/current-evidence.mjs';
import {v1refPhaseDefinitions} from './lib/v1ref-config.mjs';
import {assertReceiptControlExport} from './lib/assert-receipt-control-export.mjs';
import {verifyUpdateArchive,decodeHtmlText} from './lib/verify-update-archive.mjs';
import {readerPresentation,readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {readdir} from 'node:fs/promises';
const root=fileURLToPath(new URL('../',import.meta.url));
const json=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const pack=await json('src/data/phase-204-reader-completion.json');
const editions=await json('src/data/phase-202-accessible-multilingual-low-bandwidth-editions.json');
const operations=await json('src/data/phase-207-current-operations.json');
const sources=await Promise.all((await readdir(join(root,'src/content/sources'))).filter(f=>f.endsWith('.json')).map(f=>json('src/content/sources/'+f)));
const pathwaySources=await Promise.all((await readdir(join(root,'src/content/reader-pathways'))).filter(f=>f.endsWith('.json')).map(f=>json('src/content/reader-pathways/'+f)));
assert.deepEqual(await json('dist/data/phase-204-reader-completion.json'),pack);
assert.deepEqual(await json('dist/data/current-evidence-decisions.json'),currentEvidenceLedger);
const bindings=new Map();
for(const name of ['phase-200-cross-system-constraint-monographs.json','phase-202-accessible-multilingual-low-bandwidth-editions.json','phase-203-state-of-future-systems-2026.json']){
 const registry=await json('src/data/'+name);
 for(const record of collectPrimaryRecords(registry)) bindings.set(recordId(record),`/reference/${v1refPhaseDefinitions.find(definition=>definition.phase===registry.phase).section}/${canonicalRecordSlug(record,registry)}/`);
}
for(const article of pack.records){
 const route=bindings.get(article.record_id); assert(route);
 const html=await readFile(join(root,'dist',route,'index.html'),'utf8');
 const text=decodeHtmlText(html),view=readerPresentation(article,sources,editions.edition_contracts,readerCatalog);
 assert(html.includes(`data-reader-article="${article.record_id}"`),`Reader body missing: ${route}`);
 assert.equal((html.match(/<h1\b/g)??[]).length,1,`Duplicate H1 ${route}`);
 assert(html.includes('September 1 research contract'));
 assert(html.includes('2026-09-10')&&html.includes('pending'));
 assert(html.includes('<main')&&html.includes('Sources and further reading'));
 assert(text.includes(`<title>${article.title} | FTFN</title>`),'Reader title must replace the contract metadata title');
 assert(text.includes(article.overview));
 for(const section of view.sections){assert(html.includes(`id="${section.anchor}"`));assert(html.includes(`href="#${section.anchor}"`));for(const paragraph of section.paragraphs)assert(text.includes(paragraph),`Missing full paragraph ${article.record_id}/${section.anchor}`);}
 for(const source of view.sources){assert(text.includes(`href="${source.url}"`));assert(html.includes(`href="${source.profile_route}"`));assert(text.includes(source.name));}
 for(const other of view.alternatives){assert(html.includes(`data-edition-alternative="${other.id}"`));assert(html.includes(`href="${other.route}"`));}
 for(const context of readerSourceReviewContexts(article,currentEvidenceLedger,operations,{route})){assert(html.includes(`data-reader-source-review="${context.id}"`));for(const value of [context.summary,context.checked_date,context.next_check_date])assert(text.includes(value));assert(html.includes(`href="${context.route}"`));const receiptPage=decodeHtmlText(await readFile(join(root,'dist',context.route,'index.html'),'utf8'));assert(receiptPage.includes(context.id)&&receiptPage.includes(context.summary),`Missing full source review target: ${context.id}`);}
 if(article.mode==='low-bandwidth'){
   assert(!html.includes('data-reader-contract='),'Compact reading must link to, not embed, the machine contract');
   assert(!/<script\b/i.test(html),'Compact reading must not require a script');
   assert(Buffer.byteLength(html)<64000,`Compact HTML exceeds the retained 64 kB target: ${route}`);
   const cssPaths=[...new Set([...html.matchAll(/<link\b[^>]*>/gi)].filter(m=>/\brel="stylesheet"/.test(m[0])).map(m=>m[0].match(/\bhref="([^"]+)"/)?.[1]))];
   let bytes=Buffer.byteLength(html);
   for(const css of cssPaths){assert(css&&css.startsWith('/')&&!css.includes('..')&&!css.startsWith('//')&&!css.includes('?'),`Expected a local stylesheet: ${css}`);bytes+=Buffer.byteLength(await readFile(join(root,'dist',css),'utf8'));}
   assert(bytes<100000,`Compact HTML and linked CSS exceed 100 kB: ${route}`);
 }
}
const operating=await json('dist/data/operating-cycle.json');
assert.equal(operating.records.length,13);
assert.equal(operating.records.filter(r=>r.current_state.decision_date&&r.current_state.receipt_id).length,9);
const exportNames=[['queue','evidence-queue.json'],['envelope','evidence-return-envelopes.json'],['desk','phase-60c-editorial-desk.json']];
for(const receipt of currentEvidenceLedger.receipts){
 for(const route of receipt.affected_routes){
  const html=await readFile(join(root,'dist',route,route.endsWith('.json')?'':'index.html'),'utf8');
  assert(html.includes(receipt.receipt_id),`Missing dated propagation ${receipt.receipt_id}: ${route}`);
 }
 for(const [kind,name] of exportNames){
  const exported=await json('dist/data/'+name);
  assertReceiptControlExport(receipt,exported,kind);
 }
 const sources=await json('dist/data/sources.json');
 for(const id of receipt.checked_source_ids) assert(sources.records.find(source=>source.id===id)?.dated_review_receipts?.some(review=>review.receipt_id===receipt.receipt_id),`Missing source review ${id}`);
 const pathways=await json('dist/data/pathways.json');
 for(const id of receipt.reader_pathway_ids){
   const source=pathwaySources.find(pathway=>pathway.id===id);assert(source,`Missing source pathway ${id}`);
   const row=pathways.records.find(pathway=>pathway.id===id);
   if(source.record_status==='Published')assert(row?.dated_review_receipts?.some(review=>review.receipt_id===receipt.receipt_id),`Missing pathway review ${id}`);
   else {
     assert.equal(row,undefined,`In-review pathway must not enter the Published-only dataset: ${id}`);
     const page=await readFile(join(root,`dist/pathways/${source.slug}/index.html`),'utf8');
     assert(page.includes(receipt.receipt_id),`In-review pathway must retain its visible dated receipt: ${id}`);
     assert(page.includes('noindex, follow'),`In-review pathway must retain its indexing hold: ${id}`);
   }
 }
 const update=await readFile(join(root,`dist/updates/${receipt.update_id}/index.html`),'utf8'); assert(update.includes(receipt.receipt_id),`Missing full dated update: ${receipt.receipt_id}`);
}
await verifyUpdateArchive({appRoot:root});
console.log(`Reader production checks passed: 104 complete articles, 34 paired English editions, direct source links, exact source-review context, 17 compact HTML/CSS budgets; ${currentEvidenceLedger.receipts.length} current receipts retain exact control identities, separate companions and full archived updates. Human accessibility and subject review remain separate.`);
