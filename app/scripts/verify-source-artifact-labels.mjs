import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {parse} from 'parse5';
import labels from '../src/data/source-artifact-labels.json' with {type:'json'};
import {artifactLabelMetadata} from '../src/lib/source-artifact-labels.mjs';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const hash=s=>createHash('sha256').update(s).digest('hex');
const exports=JSON.parse(await read('dist/data/research.json')).records;
const allShelves=[];for(const file of await readdir(join(root,'dist/data/shelves')))if(file.endsWith('.json'))allShelves.push(...JSON.parse(await read('dist/data/shelves/'+file)).records);
const collectionMap=new Map();for(const file of await readdir(join(root,'src/content/research-collections'))){if(!file.endsWith('.json'))continue;const c=JSON.parse(await read('src/content/research-collections/'+file));collectionMap.set(c.id,c);}
const nodeText=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(nodeText).join('');
function articleFor(html,route){const matches=[];function hasLink(n){return(n.tagName==='a'&&n.attrs.some(a=>a.name==='href'&&a.value===route))||(n.childNodes??[]).some(hasLink);}function visit(n){if(n.tagName==='article'&&hasLink(n))matches.push(nodeText(n));for(const child of n.childNodes??[])visit(child);}visit(parse(html));assert.equal(matches.length,1,`Unique collection card for ${route}`);return matches[0];}
for(const review of labels.records){
 const original=JSON.parse(await read(`src/content/${review.source_file}`)),route=`/research/documents/${original.slug}/`;
 const html=await read(`dist${route}index.html`),text=decodeHtmlText(html);
 assert.equal(html.split(`data-source-artifact-label="${review.id}"`).length-1,1);assert(text.includes(review.current_document_type));assert(text.includes(`Historical label: ${review.original_document_type}`));
 assert(html.includes(`/updates/${labels.update_id}/`));assert(html.includes(review.historical_download.path));
 const check=labels.source_checks.find(c=>c.id===review.source_check_id);for(const value of [check.finding,check.locator,check.access,check.date_boundary])assert(text.includes(value));
 assert(text.includes('does not approve the underlying claims'));assert(!html.includes('data-reference-attribution='),'Source-type correction is not FTFN reattribution');
 assert.equal(hash(await read('dist'+review.historical_download.path)),review.historical_download.sha256);
 const row=exports.find(r=>r.id===review.id);assert.equal(row.document_type,review.current_document_type);assert.equal(row.publisher,review.publisher);assert.deepEqual(row.source_artifact_label,artifactLabelMetadata(review));
 for(const field of ['title','summary','record_status','publication_date','captured_date','official_url','local_capture_path','capture_status'])assert.equal(row[field],original[field]);
 const cards=allShelves.filter(c=>c.id===review.id);assert(cards.length);for(const card of cards){assert.deepEqual(card.filters.documentType,[review.current_document_type]);assert.deepEqual(card.filters.publisher,[review.publisher]);}
 const collection=collectionMap.get(original.collection_id),collectionHtml=await read(`dist/research/${collection.slug}/index.html`);
 assert(collectionHtml.includes(`data-artifact-label-collection="${collection.id}"`));assert(decodeHtmlText(collectionHtml).includes('Download historical archive — uncorrected labels'));
 assert(articleFor(collectionHtml,route).includes(review.current_document_type));
}
for(const pin of labels.unchanged_consumers){const row=exports.find(r=>r.id===pin.id);assert.equal(row.document_type,pin.document_type);assert.equal(row.source_artifact_label,undefined);}
assert((await read(`dist/updates/${labels.update_id}/index.html`)).includes(labels.receipt_id));
console.log('Artifact-label production verified: three dated notices, current detail/collection cards, every exported shelf facet, complete research metadata, unchanged original downloads and two unchanged confirmations. No project decision or review approval.');
