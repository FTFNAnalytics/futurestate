import assert from 'node:assert/strict';
import {currentDecisionFor} from '../../src/lib/current-evidence.mjs';
// Match a real receipt to its assigned control, not any row containing its ID.
// Local monitors have no Phase 58 queue row; later waves may have no 60C desk.
export function assertReceiptControlExport(receipt,exported,kind){
  const binding={queue:['queue_id','origin_record_id'],envelope:['envelope_id','envelope_id'],desk:['desk_item_id','desk_item_id']}[kind];
  assert(binding,`Unknown control kind: ${kind}`);
  const [field,receiptField]=binding,id=receipt[receiptField];
  if(kind==='queue'&&!String(id).startsWith('58-QUEUE-')){
    assert(!exported.records.some(r=>r[field]===id));
    if(receipt.affected_routes.includes('/data/evidence-queue.json')){
      const context=(exported.related_cycle_reviews??[]).filter(r=>r.receipt_id===receipt.receipt_id);
      assert.equal(context.length,1,`One separate local-monitor receipt: ${receipt.receipt_id}`);
      assert.deepEqual(context[0],receipt,'Local-monitor receipt must retain its exact identity and dates');
      assert(!exported.records.some(r=>(r.dated_review_receipts??[]).some(d=>d.receipt_id===receipt.receipt_id)),'A local-monitor receipt must not be assigned to a queue row');
    }
    return 'not_applicable_local_monitor';
  }
  if(kind==='desk'&&!id){
    if(receipt.affected_routes.includes('/data/phase-60c-editorial-desk.json')){
      const context=(exported.related_cycle_reviews??[]).filter(r=>r.receipt_id===receipt.receipt_id);
      assert.equal(context.length,1,`One separate related-cycle receipt: ${receipt.receipt_id}`);
      assert.deepEqual(context[0],receipt,'Related-cycle receipt must retain its exact identity and dates');
      assert(!exported.records.some(r=>(r.dated_review_receipts??[]).some(d=>d.receipt_id===receipt.receipt_id)),'An outside-desk receipt must not be assigned to a desk row');
    }
    return 'not_applicable_outside_desk';
  }
  assert(id,`Missing ${kind} assignment: ${receipt.receipt_id}`);
  const rows=exported.records.filter(r=>r[field]===id);assert.equal(rows.length,1,`One assigned ${kind} row: ${receipt.receipt_id}`);
  const current=rows[0].current_state;assert(current,`Missing ${kind} current state: ${receipt.receipt_id}`);
  const history=(rows[0].dated_review_receipts??[]).filter(r=>r.receipt_id===receipt.receipt_id);
  assert.equal(history.length,1,`One retained ${kind} receipt: ${receipt.receipt_id}`);
  assert.deepEqual(history[0],receipt,`Retained ${kind} receipt drift: ${receipt.receipt_id}`);
  let bound=current;
  // A named-file recheck owns its desk decision; a cycle-gate companion does
  // not. Starlink's cycle desk retains September 1 beside later companions.
  if(receipt.counts_as_cycle_decision===false&&(kind!=='desk'||rows[0].item_kind!=='named_file_recheck')){
    const companions=(current.companion_rechecks??[]).filter(r=>r.receipt_id===receipt.receipt_id);
    assert.equal(companions.length,1,`One separate ${kind} companion: ${receipt.receipt_id}`);
    assert.notEqual(current.receipt_id,receipt.receipt_id,'A companion cannot replace the primary cycle receipt');
    bound=companions[0];assert.equal(bound.counts_as_cycle_decision,false);
  }else{
    const latest=currentDecisionFor({[field]:id,item_kind:rows[0].item_kind});
    assert(latest,`Missing latest ${kind} decision: ${receipt.receipt_id}`);
    assert.equal(current.receipt_id,latest.receipt_id,`Latest ${kind} decision must not roll back to retained history`);
    for(const key of ['decision_date','source_checked_date','decision_status','bounded_finding'])assert.deepEqual(current[key],latest[key],`${kind}/${id}/latest/${key}`);
    if(receipt.receipt_id!==latest.receipt_id){
      assert(latest.decision_date>receipt.decision_date,'A retained predecessor must predate the latest decision');
      bound=history[0];
    }
  }
  for(const key of ['receipt_id','decision_date','source_checked_date','decision_status','bounded_finding','next_check_date','content_propagation_status','git_backed_release_status'])assert.deepEqual(bound[key],receipt[key],`${kind}/${id}/${key}`);
  return 'verified';
}
