import assert from 'node:assert/strict';
// Match a real receipt to its assigned control, not any row containing its ID.
// Local monitors have no Phase 58 queue row; later waves may have no 60C desk.
export function assertReceiptControlExport(receipt,exported,kind){
  const binding={queue:['queue_id','origin_record_id'],envelope:['envelope_id','envelope_id'],desk:['desk_item_id','desk_item_id']}[kind];
  assert(binding,`Unknown control kind: ${kind}`);
  const [field,receiptField]=binding,id=receipt[receiptField];
  if(kind==='queue'&&!String(id).startsWith('58-QUEUE-')){assert(!exported.records.some(r=>r[field]===id));return 'not_applicable_local_monitor';}
  if(kind==='desk'&&!id)return 'not_applicable_outside_desk';
  assert(id,`Missing ${kind} assignment: ${receipt.receipt_id}`);
  const rows=exported.records.filter(r=>r[field]===id);assert.equal(rows.length,1,`One assigned ${kind} row: ${receipt.receipt_id}`);
  const current=rows[0].current_state;assert(current,`Missing ${kind} current state: ${receipt.receipt_id}`);
  let bound=current;
  if(receipt.counts_as_cycle_decision===false&&kind!=='desk'){
    const companions=(current.companion_rechecks??[]).filter(r=>r.receipt_id===receipt.receipt_id);
    assert.equal(companions.length,1,`One separate ${kind} companion: ${receipt.receipt_id}`);
    assert.notEqual(current.receipt_id,receipt.receipt_id,'A companion cannot replace the primary cycle receipt');
    bound=companions[0];assert.equal(bound.counts_as_cycle_decision,false);
  }
  for(const key of ['receipt_id','decision_date','source_checked_date','decision_status','bounded_finding','next_check_date','content_propagation_status','git_backed_release_status'])assert.deepEqual(bound[key],receipt[key],`${kind}/${id}/${key}`);
  return 'verified';
}
