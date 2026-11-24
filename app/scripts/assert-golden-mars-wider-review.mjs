import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {goldenMarsWiderReview as review,goldenMarsWiderContext,goldenMarsSourceExportContext,projectGoldenMarsRecordData as project,projectGoldenMarsSystemBody} from '../src/lib/golden-mars-wider-review.mjs';
import {readShelfInputs,shelfFrontmatter} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
import {projectResearchDocument} from '../src/lib/reference-attribution.mjs';
import {serializePublicSource,serializePublicResearchDocument,serializePublicReaderPathway} from '../src/lib/public-data.ts';
const root=fileURLToPath(new URL('../',import.meta.url)),read=p=>readFile(join(root,p),'utf8');
const hash=x=>createHash('sha256').update(x).digest('hex'),at=(x,path)=>path.reduce((v,k)=>v[k],x);
assert.equal(review.records.length,7);assert.equal(new Set(review.records.map(r=>r.id)).size,7);
assert.equal(review.review_date,'2026-09-23');assert.equal(review.source_check_date,'2026-09-22');
assert.equal(review.independent_review,false);assert.equal(review.approval_receipt_id,null);
const originals=new Map();let fields=0,paragraphs=0;
for(const r of review.records){
  const raw=await read(r.source_file);assert.equal(hash(raw),r.source_sha256,`Original changed: ${r.id}`);
  const original=r.source_file.endsWith('.json')?JSON.parse(raw):shelfFrontmatter(raw);originals.set(r.id,original);
  const before=JSON.stringify(original),current=project(original),restored=structuredClone(current);
  assert.equal(JSON.stringify(original),before,'Projection mutated input');assert.deepEqual(project(current),current);
  assert.equal(project(original,'2026-09-22'),original,'Historical projection changed');
  assert.throws(()=>project({...original,...(r.identity.slug?{slug:'wrong'}:{name:'wrong'})}),/identity drift/);
  for(const c of r.changes){
    fields++;assert.equal(at(original,c.path),c.prior);assert.equal(at(current,c.path),c.current);
    assert(!['status','record_status','last_checked_date','latest_review','source_ids','source_id','captured_date','publication_date'].includes(c.path[0]));
    const parent=c.path.length===1?restored:at(restored,c.path.slice(0,-1));parent[c.path.at(-1)]=c.prior;
  }
  assert.deepEqual(restored,original,'A non-reviewed field changed');
  if(r.changes.length){const mixed=structuredClone(original),c=r.changes[0];(c.path.length===1?mixed:at(mixed,c.path.slice(0,-1)))[c.path.at(-1)]=c.current;assert.throws(()=>project(mixed),/wording drift/);}
  if(r.body_replacements){
    const bodies=projectGoldenMarsSystemBody(r.id,raw);let reverted=bodies.current;
    for(const c of r.body_replacements){paragraphs++;assert(bodies.original.includes(c.prior));assert(!bodies.current.includes(c.prior));assert(bodies.current.includes(c.current));reverted=reverted.replace(c.current,c.prior);}
    assert.equal(reverted,bodies.original);assert.throws(()=>projectGoldenMarsSystemBody(r.id,raw.replace(r.body_replacements[0].prior,'Unexpected edit')),/paragraph drift/);
    assert.throws(()=>projectGoldenMarsSystemBody(r.id,raw.replace(`id: "${r.id}"`,'id: "wrong"')),/identity drift/);
  }
  const context=goldenMarsWiderContext(r.id);assert.equal(context.source_check_date,'2026-09-22');
  assert.equal(hash(JSON.stringify(context.source_checks)),'7cb5752ac71d304e7ee7fcc5069a1bd02bcc07a26fa42a54da018766436adee6');
}
assert.equal(fields,18);assert.equal(paragraphs,5);
assert.equal(goldenMarsWiderContext('unrelated'),null);assert.equal(projectGoldenMarsSystemBody('unrelated','anything'),null);
assert.throws(()=>project({id:'unrelated'},'2026-02-30'),/ISO calendar date/);
for(const pin of review.historical_downloads)assert.equal(hash(await read('public'+pin.path)),pin.sha256);
const source=originals.get('source-virginia-scc-golden-mars-2026');
const exportedSource=serializePublicSource({data:{...source,last_checked_date:new Date(source.last_checked_date)}});
assert.equal(exportedSource.last_checked_date,'2026-07-24');assert.equal(exportedSource.known_limitations,project(source).known_limitations);
assert.equal(exportedSource.url,source.url);assert.equal(exportedSource.dated_golden_mars_review.review_id,review.review_id);
const fullSourceContext=goldenMarsWiderContext(source.id),sourceContextBefore=JSON.stringify(fullSourceContext);
assert.deepEqual(exportedSource.dated_golden_mars_review,goldenMarsSourceExportContext(source.id));
assert.deepEqual(exportedSource.dated_golden_mars_review.record.changes,fullSourceContext.record.changes.filter(c=>c.path[0]==='known_limitations'));
assert.equal(exportedSource.dated_golden_mars_review.record.changes.length,1);
assert.deepEqual(exportedSource.dated_golden_mars_review.source_checks,fullSourceContext.source_checks);
const sourceJson=JSON.stringify(exportedSource);
for(const forbidden of ['"automation_notes"','"notes"',source.automation_notes,project(source).automation_notes])assert(!sourceJson.includes(forbidden),'Source review bypassed the export allowlist');
const injected=serializePublicSource({data:{...source,last_checked_date:new Date(source.last_checked_date),notes:'PRIVATE_EXPORT_SENTINEL'}});
assert(!JSON.stringify(injected).includes('PRIVATE_EXPORT_SENTINEL'));
assert.equal(JSON.stringify(goldenMarsWiderContext(source.id)),sourceContextBefore,'Export mutated the complete on-page review');
assert.equal(goldenMarsSourceExportContext('unrelated'),null);
assert.throws(()=>goldenMarsSourceExportContext('gap-011'),/source export identity drift/);
for(const r of review.records.filter(r=>r.source_file.includes('research-documents'))){
  const original=originals.get(r.id),data={...original,publication_date:new Date(original.publication_date),captured_date:new Date(original.captured_date)};
  assert.deepEqual(projectResearchDocument({data}).data,project(data));
  const exported=serializePublicResearchDocument({data});assert.equal(exported.summary,project(original).summary);
  assert.deepEqual(exported.key_findings,project(original).key_findings);assert.equal(exported.local_capture_path,original.local_capture_path);
  assert.equal(exported.publication_date,original.publication_date);assert.equal(exported.captured_date,original.captured_date);
}
for(const r of review.records.filter(r=>r.source_file.includes('reader-pathways'))){const original=originals.get(r.id),exported=serializePublicReaderPathway({data:original});assert.deepEqual(exported.current_state,project(original).current_state);assert.deepEqual(exported.next_records,project(original).next_records);assert.equal(exported.record_status,original.record_status);}
const gap=project(originals.get('gap-011'));assert.equal(gap.latest_review.next_check_date,'2026-10-01');assert.deepEqual(gap.latest_review,originals.get('gap-011').latest_review);
const input=await readShelfInputs(root),before=JSON.stringify(input),ledger=JSON.parse(await read('src/data/phase-206-editorial-classification.json'));
const shelves=createShelfData(input,ledger,JSON.parse(await read('src/data/phase-207-current-operations.json'))).shelves;
assert.equal(JSON.stringify(input),before);let cards=0;
for(const rows of Object.values(input))for(const data of rows)if(!originals.has(data.id))assert.equal(project(data),data);
for(const rows of Object.values(shelves))for(const card of rows){const r=review.records.find(r=>r.id===card.id);if(!r)continue;const c=r.changes.find(c=>['summary','known_limitations','next_action'].includes(c.path[0]));if(c){cards++;assert.equal(card.summary,c.current);}}
assert(cards>10);assert(searchShelf(shelves.documents,{q:'Golden-Mars Route 3A'}).some(r=>r.id==='research-doc-phase65-020'));
const update=JSON.parse(await read('src/content/updates/2026-09-23-golden-mars-wider-followthrough.json'));
assert.deepEqual(update.affected_record_ids,review.records.map(r=>r.id));assert.equal(update.receipt_id,review.review_id);
console.log(`Golden-Mars wider source checks passed: 7 original hashes, ${fields} exact fields, ${paragraphs} body changes, ${cards} current cards, preserved downloads/dates/status/October 1 decision and drift/idempotence boundaries. No independent acceptance.`);
