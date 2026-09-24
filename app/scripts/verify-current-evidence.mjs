// Production-only verification. Do not run against a partial/interrupted dist.
import assert from 'node:assert/strict';
import './verify-current-project-followups.mjs';
import {readFile} from 'node:fs/promises';
import {currentEvidenceLedger,projectEvidenceRecord,projectNamedFile} from '../src/lib/current-evidence.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const json=async path=>JSON.parse(await read(path));
assert.deepEqual(await json('dist/data/current-evidence-decisions.json'),currentEvidenceLedger);
for(const receipt of currentEvidenceLedger.receipts){
  for(const route of receipt.affected_routes){
    const raw=await read(`dist${route}${route.endsWith('.json')?'':'index.html'}`);
    assert(raw.includes(receipt.receipt_id),`Missing evidence propagation at ${route}: ${receipt.receipt_id}`);
    if(!route.endsWith('.json')){
      assert(raw.includes('data-current-evidence-notice'),`Missing visible notice at ${route}`);
      assert(raw.includes(receipt.source_checked_date),`Missing actual check date at ${route}`);
    }
  }
}
const cycle=await json('src/data/phase-60-operating-cycle.json');
const exported=await json('dist/data/operating-cycle.json');
for(const r of cycle.records){const output=exported.records.find(x=>x.cycle_item_id===r.cycle_item_id);assert.deepEqual(output.current_state,projectEvidenceRecord(r));assert.equal(output.current_state_as_of,currentEvidenceLedger.as_of_date);assert.equal(output.receipt_id,r.receipt_id);}
assert.equal(exported.records.length,13);
assert.equal(exported.records.filter(r=>r.current_state.decision_date&&r.current_state.receipt_id).length,10);
const slf=exported.records.find(r=>r.cycle_item_id==='60-CYCLE-SPACE-COAST-SLF-LICENCE');
assert.equal(slf.current_state.decision_date,'2026-08-15');
assert.equal(slf.current_state.companion_rechecks.at(-1).counts_as_cycle_decision,false);
const registry=await json('src/data/phase-61-project-conversion-registry.json');
const file=registry.records.find(r=>r.file_id==='61-PROJECT-SPACE-COAST-AUTHORITY');
const project=(await json('dist/data/project-conversion.json')).records.find(r=>r.file_id===file.file_id);
assert.equal(project.current_stage,projectNamedFile(file).current_stage);
assert.equal(project.historical_current_stage,file.current_stage);
assert.equal(project.next_check_date,'2026-10-09');
assert.equal(project.current_site_authority_account.independent_stage_admission,false);
const matrix=await json('src/data/phase-64-conversion-stage-matrix.json');
const cells=(await json('dist/data/conversion-stage-matrix.json')).records;
for(const row of matrix.file_rows)for(const cell of row.stage_cells){const output=cells.find(r=>r.file_id===row.file_id&&r.stage_id===cell.stage_id);for(const key of ['cell_state','evidence_event_ids','basis'])assert.deepEqual(output[key],cell[key]);}
const packets=await json('src/data/phase-67-qualification-packet-registry.json');
const packetOutput=(await json('dist/data/qualification-packets.json')).records;
for(const r of packets.packet_records){const output=packetOutput.find(p=>p.packet_id===r.packet_id);for(const key of ['current_decision_state','packet_state','receipt_id','decision_date','phase64_cell_change'])assert.deepEqual(output[key],r[key]);}
const html=await read('dist/review/evidence-cycle/space-coast-slf-licence/index.html');
const az=currentEvidenceLedger.receipts.find(r=>r.cycle_item_id==='60-CYCLE-ARIZONA-WASTEWATER');
const azFile=registry.records.find(r=>r.file_id===az.named_file_ids[0]);
const azProject=(await json('dist/data/project-conversion.json')).records.find(r=>r.file_id===azFile.file_id);
assert.equal(azProject.current_stage,azFile.current_stage);assert.equal(azProject.next_check_date,az.next_check_date);
assert.equal(azProject.historical_next_check_date,'2026-09-22');
assert.equal(azProject.current_site_authority_account,null);
for(const p of packetOutput.filter(r=>az.qualification_packet_ids.includes(r.packet_id))){assert.equal(p.next_check_date,az.next_check_date);assert(p.dated_review_receipts.some(r=>r.receipt_id===az.receipt_id));}
const azHtml=await read(`dist${az.gate_route}index.html`);
assert(azHtml.includes('Signal retained Published.'));assert(!azHtml.includes('Signal retained In Review.'));
const azGate=(await json('dist/data/conversion-gates.json')).records.find(r=>r.gate_id===az.conversion_gate_id);
assert.equal(azGate.next_check_date,az.next_check_date);
const events=(await json('dist/data/conversion-events.json')).records.filter(r=>r.file_id===azFile.file_id);
assert(events.length>0);assert(events.every(r=>r.dated_review_receipts.some(c=>c.receipt_id===az.receipt_id)));
for(const token of ['receipt-60-slf-2026-08-15-no-material-change','receipt-60-slf-2026-09-15-renewal-discovered','2026-01-08','2026-01-15','2031-01-15'])assert(html.includes(token));
const nnsa=currentEvidenceLedger.receipts.find(r=>r.cycle_item_id==='60-CYCLE-NNSA-ACCEPTED-CAPACITY');
const queue=(await json('dist/data/evidence-queue.json')).records.find(r=>r.queue_id===nnsa.origin_record_id);
assert.equal(queue.current_receipt.receipt_id,nnsa.receipt_id);
assert.equal(queue.current_state.latest_receipt_id,nnsa.receipt_id);
assert.equal(queue.current_state.underlying_signal_status,'In Review');
assert.equal(queue.current_state.next_check_date,'2026-10-09');
const envelope=(await json('dist/data/evidence-return-envelopes.json')).records.find(r=>r.envelope_id===nnsa.envelope_id);
assert.equal(envelope.current_state.receipt_id,nnsa.receipt_id);
assert.equal(envelope.receipt_id,null,'Historical envelope must not be rewritten');
assert((await read(`dist${nnsa.gate_route}index.html`)).includes('Signal retained In Review.'));
for(const id of ['60-CYCLE-LOUDOUN-STANDARDS','60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY','60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE'])assert.equal(exported.records.find(r=>r.cycle_item_id===id).current_state.receipt_id,null);
assert.equal(exported.records.find(r=>r.cycle_item_id==='60-CYCLE-NNSA-GAO-BASELINE').current_state.decision_date,'2026-09-10');
for(const r of (await json('dist/data/project-conversion.json')).records)assert(!JSON.stringify(r.dated_review_receipts??[]).includes(nnsa.receipt_id),'Capacity receipt transferred into an unrelated Phase 61 file');
console.log('Current evidence production verified: all assigned receipt routes, exact JSON, 10/13 decisions, separate NNSA gates, renewal companion and preserved qualification states.');
