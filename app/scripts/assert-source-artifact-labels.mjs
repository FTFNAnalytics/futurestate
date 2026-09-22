import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import labels from '../src/data/source-artifact-labels.json' with {type:'json'};
import {createArtifactLabelProjection,artifactLabelMetadata} from '../src/lib/source-artifact-labels.mjs';
import {projectResearchDocument} from '../src/lib/reference-attribution.mjs';
import {serializePublicResearchDocument} from '../src/lib/public-data.ts';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8'),hash=s=>createHash('sha256').update(s).digest('hex');
assert.equal(labels.review_date,'2026-09-22');assert.equal(labels.records.length,3);assert.equal(labels.unchanged_consumers.length,2);
for(const key of ['independent_review_complete','publication_authorized','evidence_decision_created'])assert.equal(labels[key],false);
assert.deepEqual(labels.records.map(r=>r.id).sort(),['research-doc-56c-current-applications-drivers-1','research-doc-57z-toronto-council-adoption','research-doc-phase65-009']);
const attribution=JSON.parse(await read('src/data/phase-206-reference-attribution.json'));
assert(labels.records.every(r=>!attribution.records.some(a=>a.id===r.id)),'Type review must not overwrite an authorship correction');
const input=await readShelfInputs(root),ledger=JSON.parse(await read('src/data/phase-206-editorial-classification.json'));
const shelves=createShelfData(input,ledger).shelves,documents=new Map(input.documents.map(r=>[r.id,r]));
const checks=new Map(labels.source_checks.map(r=>[r.id,r]));
const knownUrls=new Set(labels.source_checks.map(r=>r.url));
assert.deepEqual(input.documents.filter(r=>knownUrls.has(r.official_url)).map(r=>r.id).sort(),[...labels.records,...labels.unchanged_consumers].map(r=>r.id).sort(),'Review all existing consumers of both exact URLs');
for(const pin of [...labels.records,...labels.unchanged_consumers]){
 const raw=await read(`src/content/${pin.source_file}`);assert.equal(hash(raw),pin.source_sha256,`Source review stale: ${pin.id}`);
 const original=JSON.parse(raw);assert.equal(original.id,pin.id);assert.equal(original.official_url,pin.official_url);
 if('current_document_type' in pin){
  assert.equal(original.document_type,pin.original_document_type);assert.equal(original.publisher,pin.publisher);
  assert.equal(original.local_capture_path,pin.historical_download.path);assert.equal(hash(await read('public'+pin.historical_download.path)),pin.historical_download.sha256);
  assert(!/Document type:\s*Technical Report/i.test(await read('public'+pin.historical_download.path)),'A stale type in a current link download requires its own correction');
  const check=checks.get(pin.source_check_id);assert(check);assert.equal(check.url,pin.official_url);assert.equal(check.source_kind,pin.current_document_type);
  const entry={data:structuredClone(original)},before=structuredClone(entry),current=projectResearchDocument(entry);
  assert.deepEqual(entry,before);assert.equal(current.data.document_type,pin.current_document_type);assert.deepEqual(current.data.source_artifact_label,artifactLabelMetadata(pin));
  const reverted=structuredClone(current.data);delete reverted.source_artifact_label;reverted.document_type=pin.original_document_type;assert.deepEqual(reverted,original,'Only current document type and its explanation may change');
  assert.deepEqual(projectResearchDocument(current),current,'Type projection is idempotent');
  for(const values of Object.values(shelves))for(const card of values.filter(c=>c.id===pin.id)){
   assert.deepEqual(card.filters.documentType,[pin.current_document_type]);assert.deepEqual(card.filters.publisher,[pin.publisher]);
  }
  assert(searchShelf(shelves.documents,{documentType:pin.current_document_type,q:original.title}).some(c=>c.id===pin.id));
  const exported=serializePublicResearchDocument({data:{...original,publication_date:original.publication_date?new Date(original.publication_date):null,captured_date:new Date(original.captured_date)}});
  assert.equal(exported.document_type,pin.current_document_type);assert.equal(exported.publisher,original.publisher);assert.deepEqual(exported.source_artifact_label,artifactLabelMetadata(pin));
  assert.equal(exported.local_capture_path,original.local_capture_path);assert.equal(exported.captured_date,original.captured_date);
  for(const [key,value]of [['official_url','https://example.invalid/'],['publisher','FTFN'],['document_type','Data Release'],['local_capture_path','/another.txt']])assert.throws(()=>projectResearchDocument({data:{...original,[key]:value}}));
  assert.throws(()=>projectResearchDocument({data:{...current.data,source_artifact_label:{...current.data.source_artifact_label,publication_authorized:true}}}));
 }else{
  assert.equal(original.document_type,pin.document_type);const entry={data:original};assert.equal(projectResearchDocument(entry),entry,'Already correct type must remain unmodified');
 }
}
assert.throws(()=>createArtifactLabelProjection([labels.records[0],labels.records[0]]));
for(const mutation of [{source_sha256:'bad'},{current_document_type:'FTFN method/test note'},{source_check_id:'unknown'}])assert.throws(()=>createArtifactLabelProjection([{...labels.records[0],...mutation}]));
const update=JSON.parse(await read('src/content/updates/2026-09-22-source-artifact-labels.json'));
assert.equal(update.id,labels.update_id);assert.equal(update.receipt_id,labels.receipt_id);assert.equal(update.effective_date,labels.review_date);
assert.deepEqual(update.affected_record_ids.slice().sort(),labels.records.map(r=>r.id).sort());
const collections=new Map(input.collections.map(r=>[r.id,r]));
const paths=new Set(['/data/research.json','/data/shelves/documents.json']);
for(const r of labels.records){const d=documents.get(r.id);paths.add(`/research/documents/${d.slug}/`);paths.add(`/research/${collections.get(d.collection_id).slug}/`);}
assert.deepEqual(update.related_paths.slice().sort(),[...paths].sort());
console.log('Source-artifact labels passed: three exact type corrections; two already-correct URL consumers untouched; all source/download hashes, publishers, dates and evidence preserved; drift and authority mutations rejected. No independent approval.');
