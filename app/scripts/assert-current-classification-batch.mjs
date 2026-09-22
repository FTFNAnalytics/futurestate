import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {claimReviews57OP} from './content-205-216/claim-reviews-57op.mjs';
import {verifyClassifiedInput} from './lib/classification-review.mjs';
import {createSignalProjection} from '../src/lib/signal-classification.mjs';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
import {getStatusNote,getClaimScopeNote,getLocalEvidenceNote} from '../src/lib/editorial.ts';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async file=>JSON.parse(await readFile(join(root,file),'utf8'));
const ledger=await read('src/data/phase-206-editorial-classification.json');
const pins=await read('scripts/content-205-216/claim-review-inputs.json');
const operations=await read('src/data/phase-207-current-operations.json');
const input=await readShelfInputs(root);
const before=JSON.stringify(input),projection=createSignalProjection(ledger.records);
const shelves=createShelfData(input,ledger,operations).shelves;
assert.equal(JSON.stringify(input),before,'Classification must not mutate historical navigation inputs');
const ids=claimReviews57OP.map(r=>r.id);
const inventory=(await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-57[op]-.*\.mdx$/.test(f)).map(f=>f.slice(0,-4));
assert.deepEqual([...ids].sort(),inventory.sort(),'The full O/P body-review cohort must remain enumerated');
assert.equal(ids.length,58);assert.equal(new Set(ids).size,58);
assert.equal(claimReviews57OP.filter(r=>r.type==='FTFN method/test note').length,40);
assert.equal(claimReviews57OP.filter(r=>r.type==='Research docket').length,18);
assert.equal(new Set(claimReviews57OP.map(r=>r.reason)).size,58,'Each reviewed record needs its own rationale');
for(const phase of ['57o','57p'])assert.equal(ids.filter(id=>id.startsWith(`signal-${phase}-`)).length,29);
for(const review of claimReviews57OP){
  const record=ledger.records.find(r=>r.id===review.id),raw=await readFile(join(root,'src/content/signals',record.source_file),'utf8');
  verifyClassifiedInput({id:review.id,body:raw,excerpt:review.excerpt,expectedHash:pins.records[review.id]});
  const body=raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)?.[1];
  assert(body,'Missing complete signal body');
  assert(body.includes(review.excerpt),'Review evidence must be present in the body, not just repeated metadata');
  assert.equal(record.claim_review_complete,true);assert.equal(record.content_type,review.type);
  assert.equal(record.reason,review.reason);assert.equal(record.classification_review_date,'2026-09-14');
  assert(record.correction.title.startsWith('FTFN '));assert.equal(record.correction.summary,review.summary);
  assert.equal(record.correction.claim_scope,'Internal FTFN record');
  assert.equal(record.correction.local_evidence_level,'Not local operating evidence');
  assert.equal(record.prior.claim_scope,'Specific Source Update');assert.equal(record.prior.local_evidence_level,'General Source Layer');
  assert.equal(record.current_feed_eligible,false);
  const original={data:{...input.signals.find(s=>s.id===review.id),...record.prior,id:review.id,slug:record.slug}};
  const snapshot=JSON.stringify(original),projected=projection.project(original);
  assert.equal(JSON.stringify(original),snapshot,'Projection must preserve the source object');
  for(const [key,value]of Object.entries(record.correction))assert.equal(projected.data[key],value,`${review.id}: lost ${key}`);
  assert.equal(projected.data.record_status,record.prior.record_status);
  assert.equal(projected.data.slug,record.slug);assert.deepEqual(projected.data.source_ids,original.data.source_ids);
  assert.equal(projection.eligible(projected),false);
  const archive=shelves.classification.find(r=>r.id===review.id);
  assert.equal(archive.title,review.title);assert.equal(archive.summary,review.reason);
  assert.deepEqual(archive.filters.type,[review.type]);
  assert(searchShelf(shelves.classification,{q:review.title,type:review.type}).some(r=>r.id===review.id));
  assert.equal(archive.route,`/signals/${record.slug}/`);
  for(const [kind,rows]of Object.entries(shelves))if(kind==='signals'||kind.startsWith('topic-')||kind.startsWith('local-'))assert(!rows.some(r=>r.id===review.id),`${kind}: reviewed hold leaked into a development shelf`);
  assert.throws(()=>verifyClassifiedInput({id:review.id,body:`${raw}\nA new unreviewed claim.`,excerpt:review.excerpt,expectedHash:pins.records[review.id]}),/individual re-review required/);
  if(review.type==='Research docket'){
    assert.equal(record.prior.record_status,'In Review');assert(body.includes('Trigger state: **not fired**'));
    assert(review.excerpt.startsWith('Reopening contract: REOPEN-'));
  }
}
for(const record of ledger.records.filter(r=>r.correction)){
  const mixed=record.id==='signal-57y-preserved-la-starlink-adoption';
  assert.equal(record.correction.claim_scope,mixed?'FTFN research docket with dated source reviews':'Internal FTFN record');
  assert.equal(record.correction.local_evidence_level,mixed?'Planned Louisiana cohort; observed adoption not established':'Not local operating evidence');
  assert(!getStatusNote(record.prior.record_status,true).includes('Source checked;'));
  assert.match(getClaimScopeNote(record.correction.claim_scope),/not an outside/);
  assert.match(getLocalEvidenceNote(record.correction.local_evidence_level),/does not establish/);
}
// Prefix inventory is a review checklist, never an automatic classification rule.
const pending=ledger.records.filter(r=>!r.claim_review_complete);
assert.equal(pending.length,ledger.remaining_individual_reviews);assert(pending.every(r=>r.content_type==='Unclassified — review pending'&&!r.correction));
const untouched={data:{id:'unrelated-not-screened',record_status:'Published',title:'Unrelated external record'}};
assert.deepEqual(projection.project(untouched),untouched);assert.equal(projection.eligible(untouched),true);
const update=await read('src/content/updates/2026-09-14-57op-individual-classifications.json');
// This dated correction covers the M–P snapshot, not later review batches.
assert.deepEqual([...update.affected_record_ids].sort(),ledger.records.filter(r=>r.correction&&/^signal-57[m-p]-/.test(r.id)).map(r=>r.id).sort());
for(const id of ids)assert(update.related_paths.includes(`/signals/${ledger.records.find(r=>r.id===id).slug}/`));
assert.equal(new Set(update.affected_record_ids).size,116);
assert.match(update.evidence_note,/not newly executed/);
console.log(`Classification batch passed: 58 individual O/P reviews, 40 method notes, 18 dockets, 116 historical scope-label corrections, full input pins, archive/search/feed projection, unchanged history and drift rejection. ${pending.length} reviews remain; no external refresh or independent approval.`);
