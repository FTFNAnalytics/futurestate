import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
// Reconstructed from commit 44dacef1ff824b2a637656c1b4886dd4a09333f3.
// Only this independently dated metadata refresh is recognized. Other content
// changes still fail the original semantic digest; no historical file is edited.
export function august31SourceSemantics(semantics,refresh,loudounNote){
  if(semantics.id==='source-loudoun-phase2-data-center-standards'){
    // July 24 source semantics reconstructed from 589467a4's parent. The
    // committed October 1 Phase 55U note is not a Phase 60 gate receipt.
    const historical={...semantics,last_checked_date:'2026-07-24'};
    assert.equal(digest(historical),'8320dd0f9695b1d4bf5aa7ec9173cedee3184fabef02e6513655ea3463f79b58','Loudoun historical source semantics changed beyond the dated metadata refresh');
    if(semantics.last_checked_date==='2026-07-24')return semantics;
    assert.equal(semantics.last_checked_date,'2026-10-01','Unreconciled Loudoun source refresh');
    assert.equal(typeof loudounNote,'string','The exact October 1 Phase 55U note is required');
    assert.equal(createHash('sha256').update(loudounNote).digest('hex'),'3fce77736f8fc33c4e609d0102011aba7720e3211f78ef9a0be60ec7a641b66d','Loudoun dated note changed');
    return historical;
  }
  if(semantics.id!=='source-phoenix-tsmc-2026-wastewater-development-agreement')return semantics;
  const historical={...semantics,last_checked_date:'2026-07-22'};
  assert.equal(digest(historical),'5ff83ad2abc26b595efb39c9bf41b20c8449c300ba8f8812781c445f3a5b5c91','Arizona historical source semantics changed beyond the dated metadata refresh');
  if(semantics.last_checked_date==='2026-07-22')return semantics;
  assert.equal(semantics.last_checked_date,'2026-09-22','Unreconciled Arizona source refresh');
  assert.equal(refresh.receipt_id,'receipt-55q-gap-002-2026-09-22-dated-hold');
  assert.equal(refresh.receipt_type,'No Material Change');
  assert.equal(refresh.source_checked_date,semantics.last_checked_date);
  assert.equal(refresh.decision_date,semantics.last_checked_date);
  assert(refresh.affected_record_ids.includes(semantics.id));
  return historical;
}
