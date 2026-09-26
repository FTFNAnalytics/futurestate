import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {backlogArtifactChecks, backlogResearchReviews, backlogReviewDate} from './content-205-216/backlog-reviews.mjs';
import {backlogHash, verifyBacklogInputs, assembleBacklogReview} from './lib/backlog-research.mjs';
import {backlogReviewsFor, backlogReviewFacts, backlogDecisionFor} from '../src/lib/backlog-research.mjs';
import {verifyAuthorizedAdjudications} from './lib/authorized-adjudications.mjs';
import {readShelfInputs} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = async path => JSON.parse(await readFile(join(root, path), 'utf8'));
const [ops, pins, backlog, ledger, registry] = await Promise.all([
  'src/data/phase-207-current-operations.json', 'scripts/content-205-216/backlog-review-inputs.json',
  'src/data/phase-182-evidence-source-backlog.json', 'src/data/phase-206-editorial-classification.json',
  'src/data/phase-61-project-conversion-registry.json'
].map(read));
const now = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
assert(backlogReviewDate <= now);
assert.equal(backlogReviewDate, pins.reviewed_date);
await verifyBacklogInputs(root, pins, backlog, backlogResearchReviews);
assert.equal(ops.backlog_research_checked, 25);
assert.equal(ops.backlog_research_unchecked, 0);
const policy=await read('src/data/build-review-policy.json'),decisions=await read('src/data/owner-authorized-adjudications.json');
verifyAuthorizedAdjudications(policy,decisions,ops.backlog_reviews,ops.backlog_artifact_checks);
assert.equal(ops.backlog_authorized_dispositions, 25);
assert.deepEqual(ops.review_policy,policy);
assert.deepEqual(ops.backlog_adjudications,decisions.backlog);
for(const row of ops.review_batch){const d=decisions.backlog.find(d=>d.backlog_item_id===row.backlog_item_id);assert.equal(row.decision_id,d.decision_id);assert.equal(row.reason,d.rationale);assert.equal(row.next_action,d.reopening_condition);}
assert.equal(backlogDecisionFor(ops,ops.backlog_reviews[0],'2026-09-24'),undefined);
assert.equal(backlogDecisionFor(ops,{...ops.backlog_reviews[0],sha256:'changed'}),undefined);
for(const [mutate,expected] of [
 [d=>{d.backlog[0].research_receipt_sha256='0'.repeat(64);},/Research changed/],
 [d=>{d.backlog[0].artifact_checks_sha256='0'.repeat(64);},/Artifact changed/],
 [d=>{d.human_reviewer='Invented person';},/human reviewer/],
 [d=>{d.backlog[0].series_admitted=true;},/measured series/],
 [d=>{d.backlog.pop();},/Incomplete/]
]){const changed=structuredClone(decisions);mutate(changed);assert.throws(()=>verifyAuthorizedAdjudications(policy,changed,ops.backlog_reviews,ops.backlog_artifact_checks),expected);}
assert.equal(ops.review_batch.filter(r => r.research_review_id).length, 25);
assert.equal(ops.review_batch.filter(r => !r.research_review_id).length, 0);
assert.deepEqual(ops.backlog_artifact_checks, backlogArtifactChecks);
assert.equal(new Set(backlogArtifactChecks.map(c => c.check_id)).size, backlogArtifactChecks.length);
assert.equal(ops.receipts[0].sha256, 'c1dd2323581bf7d38d0e336a16a3fc04a0bfcf5a99320b154f633d6aad9566f7', 'Toronto receipt was rewritten');
assert.deepEqual(ops.receipts.map(r=>r.receipt_id),['207-TORONTO-2026-09-14-BOUNDED-RECHECK','207-TORONTO-2026-09-21-BOUNDED-RECHECK'], 'Only the two separately dated Toronto checks are project-file decisions; backlog research adds none');
const sourceIds = new Set((await readShelfInputs(root)).sources.map(s => s.id));
for (const check of backlogArtifactChecks) {
  assert(new URL(check.url).protocol === 'https:');
  for (const field of ['issuer','artifact_date','observation_period','locator','access','finding','limitation']) assert(typeof check[field] === 'string' && check[field].trim().length > 0, `${check.check_id}/${field}`);
  assert(check.source_ids.every(id => sourceIds.has(id)));
}
for (const r of ops.backlog_reviews) {
  const {sha256, ...unsigned} = r;
  assert.equal(sha256, backlogHash(JSON.stringify(unsigned)));
  assert.equal(r.checked_date, backlogReviewDate);
  assert.equal(r.human_admission_authorized, false); assert.equal(r.publication_authorized, false);
  assert.equal(r.adjudication_complete, false); assert.equal(r.final_disposition, null); assert.equal(r.human_reviewer, null);
  assert.equal(r.phase_60_gate_decision, false); assert.equal(r.source_profile_dates_changed, false);
  assert(r.next_check_date > r.checked_date);
  const prior = backlog.backlog_items.find(b => b.backlog_item_id === r.backlog_item_id);
  assert.equal(prior.triage_state, 'Queued — no admissibility or publication decision made');
  assert.equal(prior.signal_id, r.signal_id); assert.deepEqual(prior.source_ids, r.source_ids);
  for (const id of [r.backlog_item_id,r.signal_id,...r.source_ids,'briefing-outcomes-watch-001-what-actually-changed','briefing-evidence-cycle-001-operating-baseline']) assert(r.affected_record_ids.includes(id), `Missing bound target ${r.review_id}/${id}`);
  assert.deepEqual(r.named_file_ids, registry.records.filter(file => file.signal_ids.includes(r.signal_id)).map(file => file.file_id));
  assert.equal(r.named_file_ids.length, 0, 'No unrelated Phase 61 file may be promoted by a shared topic or source');
  assert.equal(new Set(r.affected_routes).size, r.affected_routes.length);
  for (const target of r.propagation_targets) {
    assert(target.route.startsWith('/') && target.route.endsWith('/'));
    assert(r.affected_record_ids.includes(target.record_id)); assert(r.affected_routes.includes(target.route));
    if(target.relation.startsWith('Exact source/signal'))assert(target.matched_ids.some(id => [r.signal_id,...r.source_ids].includes(id)));
  }
  for (const id of r.check_ids) assert(backlogArtifactChecks.find(c => c.check_id === id));
  const update = await read(`src/content/updates/2026-09-14-backlog-research-${r.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id, r.review_id); assert.equal(update.decision_date, undefined);
  assert.equal(update.summary, r.finding); assert.equal(update.source_checked_date, r.checked_date);
  assert.deepEqual(update.affected_record_ids, r.affected_record_ids);
  assert(r.affected_routes.every(route => update.related_paths.includes(route)));
  assert.equal(update.materiality, 'No record-state change');
  assert.equal(backlogReviewsFor(ops,{recordId:r.signal_id}).filter(x=>x.review_id===r.review_id).length,1);
  assert.equal(backlogReviewsFor(ops,{route:r.route}).filter(x=>x.review_id===r.review_id).length,1);
}
assert.deepEqual(backlogReviewsFor(ops,{asOfDate:'2026-09-13'}),[]);
assert.deepEqual(backlogReviewsFor(ops,{recordId:'unrelated'}),[]);
assert.throws(()=>backlogReviewsFor(ops,{asOfDate:'tomorrow'}),/ISO/);
const changedPins=structuredClone(pins);changedPins.records[0].inputs[0].sha256='0'.repeat(64);
await assert.rejects(verifyBacklogInputs(root,changedPins,backlog,backlogResearchReviews),/individual re-review/);
const changedIdentity=structuredClone(backlog);changedIdentity.backlog_items.find(r=>r.backlog_item_id==='182-BACKLOG-001').signal_id='unrelated';
await assert.rejects(verifyBacklogInputs(root,pins,changedIdentity,backlogResearchReviews),/Changed backlog identity/);
const args={review:backlogResearchReviews[0],prior:backlog.backlog_items[0],pin:pins.records[0],checks:backlogArtifactChecks,propagation:{},date:backlogReviewDate};
assert.throws(()=>assembleBacklogReview({...args,checks:[]}),/Unknown artifact/);
assert.throws(()=>assembleBacklogReview({...args,review:{...args.review,next_check_date:backlogReviewDate}}),/Invalid next/);
const inputs=await readShelfInputs(root),before=JSON.stringify(inputs),shelves=createShelfData(inputs,ledger,ops).shelves;
assert.equal(JSON.stringify(inputs),before);
for(const r of ops.backlog_reviews){
  for(const id of [r.signal_id,...r.source_ids]){
    const kind=id.startsWith('source-')?'sources':ledger.records.some(c=>c.id===id)?'classification':'signals';
    const card=shelves[kind].find(c=>c.id===id);
    assert(card,`Missing research card ${id}`);
    assert(card.facts.some(f=>f.value.includes(r.review_id)));
    assert(searchShelf(shelves[kind],{q:r.review_id}).some(c=>c.id===id));
    assert.equal(card.facts.filter(f=>f.value.includes(r.review_id)).length,1,'Duplicated shared-shelf decoration');
  }
}
assert.deepEqual(backlogReviewFacts(ops,'unrelated'),[]);
console.log(`Backlog assertions passed: ${ops.backlog_research_checked} preserved research receipts; ${backlogArtifactChecks.length} bounded artifact checks; 25 owner-authorized AI determinations. Input binding, cutoff, failure, propagation, search and no-promotion guards passed.`);
