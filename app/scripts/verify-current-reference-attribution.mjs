import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import ledger from '../src/data/phase-206-reference-attribution.json' with {type:'json'};
import {referenceAttributionUpdateFor} from '../src/lib/reference-attribution.mjs';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const exported=JSON.parse(await read('dist/data/research.json')).records;
const shelf=JSON.parse(await read('dist/data/shelves/documents.json')).records;
for(const review of ledger.records){
  const document=review.record_kind==='research_document';
  const tranche=ledger.tranches.find(t=>t.record_ids.includes(review.id));
  assert(tranche,`Unassigned attribution tranche: ${review.id}`);
  const rawSource=await read(`src/content/${review.source_file}`);
  const slug=document?JSON.parse(rawSource).slug:rawSource.match(/^slug: "([^"]+)"/m)?.[1];
  assert(slug,`Attribution review ${review.id} lacks a source-bound canonical slug`);
  const route=document?`/research/documents/${slug}/`:`/briefings/${slug}/`;
  const html=await read(`dist${route}index.html`),text=decodeHtmlText(html);
  assert(html.includes(`data-reference-attribution="${review.id}"`));
  assert(html.includes(`/updates/${referenceAttributionUpdateFor(review.id)}/`),'Attribution correction link points to another tranche');
  assert(decodeHtmlText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]??'').includes(review.correction.title));
  assert(text.includes(review.reason));assert(text.includes(review.prior.title));
  for(const key of document?['summary','publisher','document_type','capture_status','key_findings','why_it_matters','ftfn_relevance','evidence_limits']:['summary','claim_scope','local_evidence_level','top_takeaways']){
    for(const value of [review.correction[key]].flat())assert(text.includes(value),`${review.id}: omitted current ${key}`);
  }
  if(!document){assert(text.includes('Historical briefing text follows'));assert(text.includes(tranche.historical_heading));continue;}
  const data=JSON.parse(await read(`src/content/${review.source_file}`));
  assert(text.includes('FTFN record describes'));assert(text.includes('not a new external source check'));
  assert(html.includes(data.official_url.replaceAll('&','&amp;')));assert(html.includes(review.correction.local_capture_path));
  assert(html.includes(review.historical_download.path));
  assert.equal(await read('dist'+review.correction.local_capture_path),await read('public'+review.correction.local_capture_path));
  assert.equal(await read('dist'+review.historical_download.path),await read('public'+review.historical_download.path));
  const card=shelf.find(r=>r.id===review.id);assert.equal(card.title,review.correction.title);assert.deepEqual(card.filters.publisher,['FTFN']);
  const row=exported.find(r=>r.id===review.id);
  if(data.record_status==='Published'){
    assert(row);for(const[key,value]of Object.entries(review.correction))assert.deepEqual(row[key],value,`${review.id}: export ${key}`);
    assert.deepEqual(row.editorial_attribution,review);
  }else assert.equal(row,undefined,'Historical In Review documents cannot enter the Published dataset');
}
for(const tranche of ledger.tranches){
 const collection=await read(`dist/research/${tranche.collection_slug}/index.html`);
 assert(collection.includes('data-attribution-collection='));assert(decodeHtmlText(collection).includes('uncorrected labels'));
 assert(collection.includes(`/updates/${tranche.update_id}/`));
 for(const review of ledger.records.filter(r=>r.record_kind==='research_document'&&tranche.record_ids.includes(r.id)))assert(decodeHtmlText(collection).includes(review.correction.title));
}
const briefingIndex=JSON.parse(await read('dist/data/shelves/briefings.json')).records;
const briefingPages=await Promise.all(Array.from({length:Math.ceil(briefingIndex.length/40)},(_,i)=>read(`dist/browse/briefings/${i+1}/index.html`)));
const briefings=decodeHtmlText(briefingPages.join('\n'));
for(const review of ledger.records.filter(r=>r.record_kind==='briefing')){
 assert(briefings.includes(review.correction.title));
 assert.equal(briefingIndex.find(r=>r.id===review.id)?.title,review.correction.title);
 assert.equal(briefingPages.join('\n').split(`data-shelf-card="${review.id}"`).length-1,1);
}
console.log(`Rendered reference attribution verified: ${ledger.records.length} details, ${ledger.records.filter(r=>r.record_kind==='research_document').length} corrected and preserved link files, ${ledger.tranches.length} collections, separate correction links, cards and Published-only JSON. This is not independent editorial or hosted acceptance.`);
