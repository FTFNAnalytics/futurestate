import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {decodeHtmlText} from './lib/verify-update-archive.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const json=async path=>JSON.parse(await read(path));
const receipt=(await json('src/data/phase-207-current-operations.json')).receipts.find(r=>r.checked_date==='2026-09-21');
for(const route of receipt.affected_routes){
 const raw=await read(`dist${route}${route.endsWith('.json')?'':'index.html'}`);
 assert(raw.includes(receipt.receipt_id),`Missing Toronto receipt at ${route}`);
 if(!route.endsWith('.json')){assert(raw.includes('data-operations-receipt='));assert(decodeHtmlText(raw).includes(receipt.bounded_finding));assert(raw.includes(receipt.next_check_date));}
}
const project=(await json('dist/data/project-conversion.json')).records.find(r=>r.file_id===receipt.file_id);
assert.equal(project.next_check_date,'2026-09-28');assert.equal(project.historical_next_check_date,'2026-09-09');
assert.equal(project.dated_project_checks.length,2);assert.equal(project.current_stage,receipt.current_stage);
const desk=(await json('dist/data/phase-60c-editorial-desk.json')).records.find(r=>r.desk_item_id===receipt.desk_item_id);
assert.equal(desk.current_state.receipt_id,receipt.receipt_id);assert.equal(desk.current_state.next_check_date,'2026-09-28');assert.equal(desk.current_state_as_of,'2026-09-22');
const gate=(await json('dist/data/conversion-gates.json')).records.find(r=>r.gate_id===receipt.conversion_gate_id);
assert.equal(gate.next_check_date,'2026-09-28');assert.equal(gate.dated_project_checks.at(-1).receipt_id,receipt.receipt_id);
const packets=(await json('dist/data/qualification-packets.json')).records.filter(r=>r.file_id===receipt.file_id);
assert.equal(packets.length,4);for(const p of packets){assert.equal(p.next_check_date,'2026-09-28');assert.equal(p.dated_project_checks.at(-1).receipt_id,receipt.receipt_id);assert.equal(p.receipt_id,null);assert.equal(p.phase64_cell_change,'none');}
const cycle=(await json('dist/data/operating-cycle.json')).records;
assert.equal(cycle.length,13);assert.equal(cycle.filter(r=>r.current_state.decision_date&&r.current_state.receipt_id).length,9);
console.log(`Toronto production propagation passed: ${receipt.affected_routes.length} assigned/contextual routes, latest project/desk/gate/packet dates, no cycle or qualification advancement.`);
