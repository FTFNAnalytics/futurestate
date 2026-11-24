import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import montanaDossiers from '../../src/data/montana-project-dossiers.json' with {type:'json'};
export const receiptPayloadHash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(new Date(d+'T00:00:00Z').valueOf())&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
// Pure preparation for a bounded follow-up on the same already-decided gate.
// No automatic research, ledger write, stage advancement or new cycle identity.
export function prepareBoundedCycleFollowup(ledger,review,{asOfDate}={}){
  assert(validDate(asOfDate),'Actual inspection boundary required');
  const arizona=review.cycle_item_id==='60-CYCLE-ARIZONA-WASTEWATER';
  const montana=review.cycle_item_id==='60-CYCLE-MONTANA-COMPLETED-QUARTER';
  assert(arizona||montana||review.cycle_item_id==='60-CYCLE-LOUDOUN-STANDARDS','Only explicitly reviewed bounded gates are supported');
  const prior=ledger.receipts.find(r=>r.receipt_id===review.prior_receipt_id);
  assert(prior&&prior.cycle_item_id===review.cycle_item_id&&prior.counts_as_cycle_decision===true,'Exact prior primary identity required');
  const {artifact_digest,...priorPayload}=prior;
  assert.equal(receiptPayloadHash(priorPayload),artifact_digest,'Prior receipt drift');
  assert.equal(artifact_digest,review.prior_receipt_artifact_digest,'Wrong predecessor digest');
  assert.equal(review.follow_up_scheduled_date,prior.next_check_date,'Wrong follow-up appointment');
  assert([review.decision_date,review.source_checked_date,review.next_check_date,review.follow_up_scheduled_date].every(validDate),'Invalid follow-up date');
  assert(review.decision_date===review.source_checked_date&&review.decision_date<=asOfDate&&review.decision_date>prior.decision_date&&review.decision_date>=review.follow_up_scheduled_date&&review.next_check_date>review.decision_date,'Follow-up chronology invalid');
  const previous=ledger.receipts.filter(r=>r.cycle_item_id===review.cycle_item_id&&r.receipt_id!==review.receipt_id).sort((a,b)=>a.decision_date.localeCompare(b.decision_date)).at(-1);
  assert.equal(previous?.receipt_id,prior.receipt_id,'A newer saved decision supersedes this appointment');
  assert(review.receipt_id!==prior.receipt_id,'Follow-up must preserve its predecessor');
  assert.equal(review.receipt_type,'Watch Note');assert.equal(review.decision_status,'rescheduled_with_watch_note');
  assert.equal(review.signal_decision,arizona?'retain_published_agreement_no_downstream_admission':'retain_in_review_watch_note');assert.equal(prior.underlying_signal_status,arizona?'Published':'In Review');
  for(const key of ['artifact_digest','schema_version','origin_record_id','desk_item_id','underlying_signal_id','underlying_signal_status','counts_as_cycle_decision','scheduled_check_date','envelope_id','checked_source_ids','exact_next_artifact','canonical_dossier_ids','reader_pathway_ids','dependency_map_ids','local_system_ids','evidence_gap_ids','propagation_targets','affected_routes','affected_record_ids','named_file_ids','qualification_packet_ids','publication_authorized','human_reviewer','independent_stage_admission','propagation_status','content_propagation_status','git_backed_release_status','formal_artifact','current_named_file_account','gate_route','review_kind','watch_note'])assert(!(key in review),`Bounded review cannot replace protected assignment: ${key}`);
  assert(review.official_surface_checks.length>=2&&review.official_surface_checks.every(s=>s.accessed_date===review.decision_date&&new URL(s.url).protocol==='https:'),'Dated official checks required');
  // These later-authored dossiers cite the exact assigned program source. The
  // notice is reporting context, never an observation about any named project.
  const additions=montana?[
    ...montanaDossiers.records.map(r=>{
      assert(r.source_ids.includes(prior.checked_source_ids[0]),'Exact Montana source binding required');
      return {record_id:r.record_id,route:r.route,relation:'Related program reporting context only; proposal identity, article date and operating observations unchanged'};
    }),
    {record_id:prior.checked_source_ids[0],route:'/atlas/projects/montana-bead/',relation:'Program reporting context for the retained 32-project cohort; no project admission'},
    {record_id:prior.checked_source_ids[0],route:'/data/build-decisions.json',relation:'Separate additive reporting context; exact historical dossier export retained'},
  ]:[];
  if(montana){assert.equal(montanaDossiers.records.length,32);assert.equal(new Set(montanaDossiers.records.map(r=>r.record_id)).size,32);}
  const assignments=montana?{
    propagation_targets:[...prior.propagation_targets,...additions],
    affected_record_ids:[...new Set([...prior.affected_record_ids,...additions.map(r=>r.record_id)])],
    affected_routes:[...new Set([...prior.affected_routes,...additions.map(r=>r.route)])],
  }:{};
  const payload={...priorPayload,...review,...assignments,review_kind:'bounded_followup',
    watch_note:{receipt_type:'Watch Note',dated:review.decision_date,prior_scheduled_date:review.follow_up_scheduled_date,next_check_date:review.next_check_date,reason:review.next_action},
    binding_decision:arizona?'Same Arizona agreement gate and predecessor propagation assignments. Published agreement retained; no asset, operating, qualification or receiving-system admission. The separate Phase 55Q acceptance hold is not another cycle identity.':montana?'Same completed-quarter gate; all predecessor assignments retained. Exact-source context is added to the 32 later-authored Montana proposal dossiers, their index and export. No completed quarter, named-project outcome, Phase 61 file or qualification admission is created.':'Same policy gate and prior propagation assignments. Northern Virginia named-file and qualification context only: Golden-Mars/GS-5 artifacts, dates, stages and receiving-system admissions do not change.',
    history_boundary:'Append-only bounded follow-up. Original primary schedule, predecessor receipt and all earlier ledger entries remain intact. This updates one existing cycle identity, not its count. Source projection is separate from production verification, Git-backed release and cycle closure.',
    validation_boundary_at_recording:'Source projection and assignments can be checked locally. Full production/output verification remains unperformed while the generated-output deletion restriction blocks the build; no new candidate acceptance is claimed.'};
  const receipt={...payload,artifact_digest:receiptPayloadHash(payload)};
  const existing=ledger.receipts.find(r=>r.receipt_id===receipt.receipt_id);
  if(existing)assert.deepEqual(existing,receipt,'Refusing to rewrite a dated follow-up');
  return receipt;
}
