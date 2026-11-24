import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const projectReceiptHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const validDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
// Pure bounded Toronto preparation, not a source fetch, file write or admission.
export function prepareBoundedTorontoProjectCheck(operations,review,{asOfDate}={}){
 assert(validDate(asOfDate));assert.equal(review.file_id,'61-PROJECT-TORONTO-24-254930');
 const prior=operations.receipts.find(r=>r.receipt_id===review.prior_receipt_id);
 assert(prior&&prior.file_id===review.file_id,'Exact predecessor required');
 const {sha256,...previous}=prior;assert.equal(projectReceiptHash(previous),sha256,'Predecessor drift');assert.equal(sha256,review.prior_receipt_sha256,'Wrong predecessor pin');
 const latest=operations.receipts.filter(r=>r.file_id===review.file_id&&r.receipt_id!==review.receipt_id).sort((a,b)=>a.checked_date.localeCompare(b.checked_date)).at(-1);
 assert.equal(latest?.receipt_id,prior.receipt_id,'A newer operation supersedes this appointment');
 assert.equal(review.scheduled_date,prior.next_check_date);assert.equal(review.original_scheduled_date,prior.original_scheduled_date);
 assert([review.checked_date,review.scheduled_date,review.next_check_date].every(validDate));
 assert(review.checked_date>prior.checked_date&&review.checked_date>=review.scheduled_date&&review.checked_date<=asOfDate&&review.next_check_date>review.checked_date,'Invalid actual/scheduled/future chronology');
 assert.notEqual(review.receipt_id,prior.receipt_id);assert.equal(review.decision_status,'blocked');assert.equal(review.receipt_type,'Watch Note');
 for(const field of ['sha256','desk_item_id','conversion_gate_id','prior_stage','current_stage','cycle_item_id','counts_as_cycle_decision','phase64_cell_change','qualification_packet_change','return_envelope_id','return_envelope_boundary','source_profile_dates_changed','source_ids','checked_source_ids','context_only_source_ids','qualification_packet_ids','propagation_targets','affected_record_ids','affected_routes','git_backed_release_status','human_admission_authorized','publication_authorized','independent_review_complete','history_boundary'])assert(!(field in review),`Protected assignment: ${field}`);
 assert.deepEqual(review.permit_address_checks,[],'No current permit address queries occurred');assert.deepEqual(review.open_data_permit_queries,[],'No current permit dataset queries occurred');
 assert(review.source_checks.length>=2&&review.source_checks.every(c=>c.checked_date===review.checked_date&&new URL(c.url).protocol==='https:'),'Dated source checks required');
 assert.equal(review.dated_artifact_context.retrieved_date,review.checked_date);assert.equal(review.dated_artifact_context.visual_review_complete,false);assert.equal(review.dated_artifact_context.signature_verified,false);
 const payload={...previous,...review,
  history_boundary:'All three September project receipts remain exact history, including the September 28 blocker. Their portal/permit observations are not November 21 findings. The October 5 appointment is caught up on the actual November 21 inspection date. This separate project check adds no cycle identity, completes no condition and admits no qualification stage.',
  validation_boundary_at_recording:'Local source projection can be checked. Production/output and full release verification remain unperformed while the generated-output deletion restriction blocks the build; no new candidate acceptance is claimed.'};
 const receipt={...payload,sha256:projectReceiptHash(payload)};
 const saved=operations.receipts.find(r=>r.receipt_id===receipt.receipt_id);if(saved)assert.deepEqual(saved,receipt,'Refusing to rewrite a dated operation');
 return receipt;
}
