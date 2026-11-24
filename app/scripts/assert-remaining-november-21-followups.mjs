import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ledger from '../src/data/phase-60-current-decisions.json' with {type:'json'};
import cycle from '../src/data/phase-60-operating-cycle.json' with {type:'json'};
import desk from '../src/data/phase-60c-editorial-desk.json' with {type:'json'};
import returns from '../src/data/phase-67-evidence-return-envelope-ledger.json' with {type:'json'};
import named from '../src/data/phase-61-project-conversion-registry.json' with {type:'json'};
import {receiptPayloadHash as hash} from './lib/bounded-cycle-followup.mjs';
import {prepareRemainingFollowups} from './lib/remaining-cycle-followups.mjs';
import {evidenceReviewDate,priorLedgerSnapshot,priorLedgerSha256,remainingReviews,predecessorPins} from './content-205-216/remaining-november-21-reviews.mjs';
import {projectEvidenceRecord,currentDecisionFor,evidenceReceiptsForControl,evidenceReceiptsForRecord,evidenceReceiptsForRoute,projectNamedFile,currentNamedFileAccount} from '../src/lib/current-evidence.mjs';
import {assertReceiptControlExport} from './lib/assert-receipt-control-export.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const before=JSON.stringify({ledger,cycle,desk,returns,named});
const bound=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/remaining-november-21-reviews.mjs','scripts/lib/remaining-cycle-followups.mjs','scripts/prepare-november-21-remaining-followups.mjs','scripts/assert-remaining-november-21-followups.mjs',...remainingReviews.map(r=>'src/content/updates/'+r.update_id.replace(/^update-/,'')+'.json')])assert(bound.artifact_paths.includes(path),'Unbound follow-up artifact '+path);
assert.equal(hash(priorLedgerSnapshot(ledger)),priorLedgerSha256);
const receipts=await prepareRemainingFollowups({asOfDate:evidenceReviewDate});
const counts=[[484,482,491],[238,236,245],[657,655,664],[586,584,592],[199,200,208]];
for(const [i,r]of receipts.entries()){
 assert.deepEqual(ledger.receipts.find(p=>p.receipt_id===r.receipt_id),r);
 assert.deepEqual([r.propagation_targets.length,r.affected_record_ids.length,r.affected_routes.length],counts[i]);
 assert.equal(r.source_checked_date,evidenceReviewDate);assert.equal(r.follow_up_scheduled_date,'2026-10-09');assert.equal(r.next_check_date,'2026-12-21');
 assert.equal(r.publication_authorized,false);assert.equal(r.independent_stage_admission,false);assert.equal(r.underlying_signal_status,'In Review');
 for(const id of r.affected_record_ids)assert(evidenceReceiptsForRecord(id).some(p=>p.receipt_id===r.receipt_id));
 for(const route of r.affected_routes)assert(evidenceReceiptsForRoute(route).some(p=>p.receipt_id===r.receipt_id));
 const update=JSON.parse(await readFile(new URL('../src/content/updates/'+r.update_id.replace(/^update-/,'')+'.json',import.meta.url),'utf8'));
 assert.equal(update.receipt_id,r.receipt_id);assert.deepEqual(update.affected_record_ids,r.affected_record_ids);assert.deepEqual(update.related_paths,r.affected_routes);
 if(i<4){
  assert.equal(r.counts_as_cycle_decision,true);assert.equal(r.prior_receipt_id,predecessorPins[i][0]);assert.deepEqual(r.named_file_ids,[]);assert.deepEqual(r.qualification_packet_ids,[]);
  assert.equal(currentDecisionFor({cycle_item_id:r.cycle_item_id},'2026-11-20').receipt_id,r.prior_receipt_id);
  assert.equal(currentDecisionFor({cycle_item_id:r.cycle_item_id}).receipt_id,r.receipt_id);
  for(const file of named.records)assert(!JSON.stringify(projectNamedFile(file)).includes(r.receipt_id));
 }
 const base=cycle.records.find(p=>p.cycle_item_id===r.cycle_item_id);assert.equal(projectEvidenceRecord(base).scheduled_check_date,base.scheduled_check_date);assert.deepEqual(projectEvidenceRecord(projectEvidenceRecord(base)),projectEvidenceRecord(base));
}
const [pids,hanford,baseline,capacity,slf]=receipts;
assert.equal(new Set(receipts.map(r=>r.cycle_item_id)).size,5);assert.equal(new Set(receipts.map(r=>r.envelope_id)).size,5);
assert.equal(baseline.shared_inspection_id,capacity.shared_inspection_id);assert.deepEqual(baseline.official_surface_checks[2],capacity.official_surface_checks[0]);
assert(baseline.context_only_source_ids.includes('source-56x-gao-nnsa-major-projects-2026'));assert(baseline.context_only_source_ids.includes('source-56w-nnsa-fy2027-weapons-activities'));
assert(hanford.official_surface_checks.some(c=>c.url.endsWith('AR-42526')&&c.access_result.includes('Timeout')));
assert(pids.evidence_boundary.includes('93 and 117'));assert(capacity.evidence_boundary.includes('November 25'));
assert.equal(slf.counts_as_cycle_decision,false);assert.equal(slf.decision_status,'blocked');assert.equal(slf.prior_receipt_id,'receipt-60-slf-2026-08-15-no-material-change');
assert.equal(slf.prior_companion_receipt_id,'receipt-60-slf-2026-09-15-renewal-discovered');assert.equal(slf.retained_authority_receipt_id,slf.prior_companion_receipt_id);
assert.equal(slf.formal_artifact,undefined);assert.equal(slf.current_named_file_account,undefined);
assert(slf.official_surface_checks.some(c=>c.url.startsWith('https://drs.faa.gov/')&&c.access_result==='No readable text returned.'));
const prior=ledger.receipts.find(r=>r.receipt_id===slf.prior_companion_receipt_id),file=named.records.find(r=>r.file_id===slf.named_file_ids[0]),project=projectNamedFile(file);
assert.equal(project.current_account_receipt_id,prior.receipt_id);assert.equal(project.current_followup_receipt_id,slf.receipt_id);assert.equal(project.current_followup_checked_date,evidenceReviewDate);
assert.equal(project.current_stage,prior.current_named_file_account.current_stage);assert.deepEqual(project.current_site_authority_account,prior.current_named_file_account);assert.deepEqual(currentNamedFileAccount(file.file_id),prior.current_named_file_account);
assert.equal(project.next_check_date,'2026-12-21');assert.equal(project.exact_next_artifact,slf.next_action);assert.equal(project.historical_account,file);assert.deepEqual(projectNamedFile(project),project);
assert.equal(projectNamedFile(file,'2026-11-20').next_check_date,'2026-10-09');assert.equal(projectNamedFile(file,'2026-11-20').current_followup_receipt_id,undefined);
const slfBase=cycle.records.find(r=>r.cycle_item_id===slf.cycle_item_id),slfCurrent=projectEvidenceRecord(slfBase);
assert.equal(slfCurrent.receipt_id,slf.prior_receipt_id);assert.equal(slfCurrent.decision_date,'2026-08-15');assert.deepEqual(slfCurrent.companion_rechecks.map(r=>r.receipt_id),[prior.receipt_id,slf.receipt_id]);assert.equal(slfCurrent.next_check_date,'2026-12-21');
const deskRow=desk.records.find(r=>r.desk_item_id===slf.desk_item_id),exported={records:[{...deskRow,current_state:projectEvidenceRecord(deskRow),dated_review_receipts:evidenceReceiptsForControl(deskRow)}]};
assert.equal(exported.records[0].current_state.receipt_id,slf.receipt_id);assert.equal(exported.records[0].current_state.next_check_date,'2026-12-21');assert.equal(exported.records[0].current_state.companion_rechecks,undefined);
for(const r of [prior,slf])assert.doesNotThrow(()=>assertReceiptControlExport(r,exported,'desk'));
for(const mutation of ['rollback','drop_history','redate_authority','wrong_next_date']){
 const invalid=structuredClone(exported);
 if(mutation==='rollback')invalid.records[0].current_state=projectEvidenceRecord(deskRow,'2026-11-20');
 if(mutation==='drop_history')invalid.records[0].dated_review_receipts=invalid.records[0].dated_review_receipts.filter(r=>r.receipt_id!==prior.receipt_id);
 if(mutation==='redate_authority')invalid.records[0].dated_review_receipts[0].source_checked_date=evidenceReviewDate;
 if(mutation==='wrong_next_date')invalid.records[0].current_state.next_check_date='2026-10-09';
 assert.throws(()=>{assertReceiptControlExport(prior,invalid,'desk');assertReceiptControlExport(slf,invalid,'desk');});
}
assert.equal(cycle.records.length,13);assert.equal(cycle.records.map(r=>projectEvidenceRecord(r)).filter(r=>r.receipt_id&&r.decision_date).length,13);
for(const id of ['60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY','60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE']){assert.equal(currentDecisionFor({cycle_item_id:id}).decision_date,'2026-10-28');assert.equal(currentDecisionFor({cycle_item_id:id}).next_check_date,'2026-11-25');}
await assert.rejects(()=>prepareRemainingFollowups({asOfDate:'2026-11-20'}));
await assert.rejects(()=>prepareRemainingFollowups({asOfDate:evidenceReviewDate,ledger:{...ledger,receipts:ledger.receipts.map((r,i)=>i===0?{...r,next_check_date:'2026-12-31'}:r)}}));
for(const mutation of [{named_file_ids:['invented']},{decision_date:'2026-11-22'},{follow_up_scheduled_date:'2026-11-21'},{decision_status:'material_change'}]){const reviews=structuredClone(remainingReviews);Object.assign(reviews[0],mutation);await assert.rejects(()=>prepareRemainingFollowups({asOfDate:evidenceReviewDate,reviews}));}
const invented=structuredClone(remainingReviews);invented[4].formal_artifact={issued_date:evidenceReviewDate};await assert.rejects(()=>prepareRemainingFollowups({asOfDate:evidenceReviewDate,reviews:invented}));
assert.equal(JSON.stringify({ledger,cycle,desk,returns,named}),before);
console.log('Five November 21 follow-ups passed: sixteen predecessors exact; four independent primary follow-ups and one blocked SLF companion; retained September authority, current December appointment, thirteen identities and no early November 25 review.');
