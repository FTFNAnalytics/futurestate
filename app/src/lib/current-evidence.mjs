import ledger from '../data/phase-60-current-decisions.json' with { type: 'json' };
import namedFiles from '../data/phase-61-project-conversion-registry.json' with { type: 'json' };
import {projectChecksAsOfDate,latestProjectCheckFor,projectNamedFileDesk} from './current-project-checks.mjs';
export const currentEvidenceAsOfDate=[ledger.as_of_date,projectChecksAsOfDate].sort().at(-1);

export const currentEvidenceLedger = ledger;
const sameGate = (record, receipt) => (
  (record.cycle_item_id && receipt.cycle_item_id === record.cycle_item_id)
  || (record.queue_id && receipt.origin_record_id === record.queue_id)
  || (record.envelope_id && receipt.envelope_id === record.envelope_id)
  || (record.desk_item_id && receipt.desk_item_id === record.desk_item_id)
);
// Exact control identity, including retained predecessors and separate companions.
// Exports carry this history beside current_state; no baseline field is replaced.
export function evidenceReceiptsForControl(record, asOfDate = currentEvidenceAsOfDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) throw new Error('Evidence projection requires an ISO calendar date');
  return ledger.receipts.filter(receipt => receipt.decision_date <= asOfDate && sameGate(record, receipt));
}
export function currentDecisionFor(record, asOfDate = ledger.as_of_date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) throw new Error('Evidence projection requires an ISO calendar date');
  return ledger.receipts.filter((receipt) => receipt.decision_date <= asOfDate && sameGate(record, receipt)
    && (receipt.counts_as_cycle_decision !== false
      || (record.item_kind === 'named_file_recheck' && record.desk_item_id === receipt.desk_item_id))
  ).sort((a,b) => a.decision_date.localeCompare(b.decision_date)).at(-1) ?? null;
}

export function projectEvidenceRecord(record, asOfDate = currentEvidenceAsOfDate) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate))throw new Error('Evidence projection requires an ISO calendar date');
  const namedCheck=projectNamedFileDesk(record,asOfDate);
  if(namedCheck!==record)return namedCheck;
  const receipt = currentDecisionFor(record, asOfDate);
  const projected = receipt ? {
    ...record,
    decision_date: receipt.decision_date, source_checked_date: receipt.source_checked_date,
    decision_status: receipt.decision_status, receipt_id: receipt.receipt_id,
    receipt_type: receipt.receipt_type, next_check_date: receipt.next_check_date,
    exact_next_artifact: receipt.exact_next_artifact, bounded_finding: receipt.bounded_finding,
    evidence_boundary: receipt.evidence_boundary,
    propagation_status: receipt.propagation_status, content_propagation_status: receipt.content_propagation_status,
    git_backed_release_status: receipt.git_backed_release_status,
    checked_source_ids: receipt.checked_source_ids,
    attempted_surfaces: receipt.official_surface_checks.map((surface) => surface.url),
    access_result: receipt.bounded_finding,
    ...(record.envelope_id ? {envelope_state:'Propagation Complete — Git Held'} : {}),
    ...(record.queue_id ? {last_checked_date:receipt.source_checked_date,current_decision:receipt.decision_status,latest_receipt_id:receipt.receipt_id} : {}),
  } : record;
  // A named-file desk owns its latest companion decision. Earlier companions
  // remain in dated_review_receipts, but cannot roll its appointment backward.
  if(record.item_kind==='named_file_recheck'&&receipt)return projected;
  // A companion corrects the current account, never replaces/counts the original cycle decision.
  const companions = ledger.receipts.filter(r => r.counts_as_cycle_decision === false
    && r.decision_date <= asOfDate && sameGate(record, r) && r.receipt_id !== receipt?.receipt_id);
  if (!companions.length) return projected;
  const latest = [...companions].sort((a,b) => a.decision_date.localeCompare(b.decision_date)).at(-1);
  return {...projected, next_check_date: latest.next_check_date,
    companion_rechecks: [...new Map([...(record.companion_rechecks ?? []), ...companions].map(r=>[r.receipt_id,r])).values()],
    current_account_receipt_id: latest.receipt_id, current_account_checked_date: latest.source_checked_date,
    current_account_finding: latest.bounded_finding, current_account_boundary: latest.evidence_boundary,
    current_account_release_status: latest.git_backed_release_status};
}

export const evidenceReceiptsForRoute = (route) => ledger.receipts.filter((receipt) => receipt.affected_routes.includes(route));
export function evidenceReceiptsForRecord(id, asOfDate = ledger.as_of_date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) throw new Error('Evidence projection requires an ISO calendar date');
  return ledger.receipts.filter(r => r.decision_date <= asOfDate && r.affected_record_ids.includes(id));
}
export function currentNamedFileAccount(id, asOfDate = ledger.as_of_date) {
  return evidenceReceiptsForRecord(id, asOfDate).filter(r=>r.current_named_file_account)
    .sort((a,b)=>a.decision_date.localeCompare(b.decision_date)).at(-1)?.current_named_file_account ?? null;
}
/** A named-file policy receipt is context for that file's gate, not a new gate decision.
 * @param {{gate_id:string,file_id:string}} gate @param {string} asOfDate
 */
export function evidenceReceiptsForConversionGate(gate, asOfDate = ledger.as_of_date) {
  if(!gate?.gate_id||!gate?.file_id)return [];
  return evidenceReceiptsForRecord(gate.file_id,asOfDate).filter(r=>r.named_file_ids.includes(gate.file_id)
    &&(!r.conversion_gate_id||r.conversion_gate_id===gate.gate_id));
}
/** Context from a related policy does not reschedule a different named-project artifact.
 * @param {string} fileId @param {string} asOfDate
 */
export function namedFileEvidenceDecisions(fileId, asOfDate = ledger.as_of_date) {
  const file=namedFiles.records.find(r=>r.file_id===fileId);
  if(!file)return [];
  return evidenceReceiptsForRecord(fileId,asOfDate).filter(r=>r.named_file_ids.includes(fileId)
    &&file.signal_ids.includes(r.underlying_signal_id)).sort((a,b)=>a.decision_date.localeCompare(b.decision_date));
}
/**
 * @template {{file_id:string}} T
 * @param {T} record
 * @param {string} asOfDate
 * @returns {T & {current_stage?:string,established?:string,unresolved?:string,exact_next_artifact?:string,next_check_date?:string,historical_account?:T,current_site_authority_account?:NonNullable<ReturnType<typeof currentNamedFileAccount>>,current_account_receipt_id?:string,current_followup_receipt_id?:string,current_followup_checked_date?:string}}
 */
export function projectNamedFile(record, asOfDate = currentEvidenceAsOfDate) {
  const projectCheck=latestProjectCheckFor(record.file_id,asOfDate);
  const authorityReceipt=evidenceReceiptsForRecord(record.file_id,asOfDate).filter(r=>r.current_named_file_account).at(-1);
  if(projectCheck&&(!authorityReceipt||projectCheck.checked_date>authorityReceipt.decision_date)){
    return {...record,current_stage:projectCheck.current_stage,exact_next_artifact:projectCheck.next_action,
      next_check_date:projectCheck.next_check_date,historical_account:(/** @type {T & {historical_account?:T}} */ (record)).historical_account??record,
      current_account_receipt_id:projectCheck.receipt_id};
  }
  const account = currentNamedFileAccount(record.file_id, asOfDate);
  if (!account) {
    const latest=namedFileEvidenceDecisions(record.file_id,asOfDate).at(-1);
    // A bounded recheck updates the appointment, never a historical conversion stage.
    return latest ? {...record,next_check_date:latest.next_check_date,
      exact_next_artifact:latest.next_action,historical_account:(/** @type {T & {historical_account?:T}} */ (record)).historical_account??record,
      current_account_receipt_id:latest.receipt_id} : record;
  }
  const receipt = evidenceReceiptsForRecord(record.file_id, asOfDate).filter(r=>r.current_named_file_account).at(-1);
  const followup=namedFileEvidenceDecisions(record.file_id,asOfDate).at(-1)??receipt;
  return {...record, current_stage:account.current_stage, established:account.established,
    unresolved:account.unresolved, exact_next_artifact:followup.next_action,
    next_check_date:followup.next_check_date, historical_account:(/** @type {T & {historical_account?:T}} */ (record)).historical_account??record,
    current_site_authority_account:account, current_account_receipt_id:receipt.receipt_id,
    ...(followup.receipt_id!==receipt.receipt_id?{current_followup_receipt_id:followup.receipt_id,current_followup_checked_date:followup.source_checked_date}:{})};
}
