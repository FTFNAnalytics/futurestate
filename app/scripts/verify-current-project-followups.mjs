import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const json=async path=>JSON.parse(await read(path));
const operations=await json('src/data/phase-207-current-operations.json');
const evidence=await json('src/data/phase-60-current-decisions.json');
const receipt=operations.receipts.find(r=>r.receipt_id==='207-TORONTO-2026-11-21-BOUNDED-BLOCKER');
assert.equal(operations.as_of_date,'2026-11-21');assert.equal(operations.receipts.length,4);
assert.equal(receipt.decision_status,'blocked');
for(const check of operations.receipts)for(const route of check.affected_routes){
 const raw=await read(`dist${route}${route.endsWith('.json')?'':'index.html'}`);
 assert(raw.includes(check.receipt_id),`Missing Toronto receipt ${check.receipt_id} at ${route}`);
 if(!route.endsWith('.json')){assert(raw.includes('data-operations-receipt='));assert(decodeHtmlText(raw).includes(check.bounded_finding));assert(raw.includes(check.next_check_date));}
}
const project=(await json('dist/data/project-conversion.json')).records.find(r=>r.file_id===receipt.file_id);
assert.equal(project.next_check_date,receipt.next_check_date);assert.equal(project.historical_next_check_date,'2026-09-09');
assert.equal(project.dated_project_checks.length,4);assert.equal(project.current_stage,receipt.current_stage);
assert.deepEqual(project.dated_project_checks,operations.receipts);
const desk=(await json('dist/data/phase-60c-editorial-desk.json')).records.find(r=>r.desk_item_id===receipt.desk_item_id);
// Projection currency follows the latest input, while the named project's
// actual source/decision dates remain tied to its own immutable receipt.
const expectedAsOf=[operations.as_of_date,evidence.as_of_date].sort().at(-1);
function verifyDeskDates(value){
 assert.equal(value.current_state_as_of,expectedAsOf);
 assert.equal(value.current_state.receipt_id,receipt.receipt_id);
 assert.equal(value.current_state.next_check_date,receipt.next_check_date);
 assert.equal(value.current_state.decision_status,'blocked');
 assert.equal(value.current_state.receipt_type,'Watch Note');
 assert.equal(value.current_state.source_checked_date,receipt.checked_date);
 assert.equal(value.current_state.decision_date,receipt.checked_date);
}
verifyDeskDates(desk);
assert.throws(()=>verifyDeskDates({...desk,current_state_as_of:'2099-01-01'}));
if(expectedAsOf!==receipt.checked_date){
 assert.throws(()=>verifyDeskDates({...desk,current_state_as_of:receipt.checked_date}));
 assert.throws(()=>verifyDeskDates({...desk,current_state:{...desk.current_state,source_checked_date:expectedAsOf}}));
}
const gate=(await json('dist/data/conversion-gates.json')).records.find(r=>r.gate_id===receipt.conversion_gate_id);
assert.equal(gate.next_check_date,receipt.next_check_date);assert.equal(gate.dated_project_checks.at(-1).receipt_id,receipt.receipt_id);
const packets=(await json('dist/data/qualification-packets.json')).records.filter(r=>r.file_id===receipt.file_id);
assert.equal(packets.length,4);for(const p of packets){assert.equal(p.next_check_date,receipt.next_check_date);assert.equal(p.dated_project_checks.at(-1).receipt_id,receipt.receipt_id);assert.equal(p.receipt_id,null);assert.equal(p.phase64_cell_change,'none');}
const cycle=(await json('dist/data/operating-cycle.json')).records;
assert.equal(cycle.length,13);assert.equal(cycle.filter(r=>r.current_state.decision_date&&r.current_state.receipt_id).length,13);
console.log(`Toronto production propagation passed: ${receipt.affected_routes.length} assigned/contextual routes, latest project/desk/gate/packet dates, no cycle or qualification advancement.`);
