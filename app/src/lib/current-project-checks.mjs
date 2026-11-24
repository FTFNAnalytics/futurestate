import operations from '../data/phase-207-current-operations.json' with {type:'json'};
export const projectChecksAsOfDate=operations.as_of_date;
export function projectChecksFor(id,asOfDate=projectChecksAsOfDate){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(asOfDate))throw new Error('Project checks require an ISO calendar date');
  if(!id)return [];
  return operations.receipts.filter(r=>r.checked_date<=asOfDate&&(r.file_id===id||r.affected_record_ids.includes(id)))
    .sort((a,b)=>a.checked_date.localeCompare(b.checked_date)||a.receipt_id.localeCompare(b.receipt_id));
}
export const latestProjectCheckFor=(id,asOfDate=projectChecksAsOfDate)=>projectChecksFor(id,asOfDate).at(-1)??null;
// A named-file desk check is not a cycle gate, a stage admission or a return envelope.
export function projectNamedFileDesk(record,asOfDate=projectChecksAsOfDate){
  if(record.item_kind!=='named_file_recheck')return record;
  const receipt=latestProjectCheckFor(record.named_file_id,asOfDate);
  if(!receipt)return record;
  return {...record,receipt_id:receipt.receipt_id,decision_date:receipt.checked_date,
    source_checked_date:receipt.checked_date,decision_status:receipt.decision_status??'no_material_change',
    ...(receipt.receipt_type?{receipt_type:receipt.receipt_type}:{}),
    next_check_date:receipt.next_check_date,exact_next_artifact:receipt.next_action,
    bounded_finding:receipt.bounded_finding,dated_project_checks:projectChecksFor(record.named_file_id,asOfDate),
    counts_as_cycle_decision:false,git_backed_release_status:'held'};
}
