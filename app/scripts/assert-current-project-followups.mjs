import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {projectChecksFor,latestProjectCheckFor,projectNamedFileDesk} from '../src/lib/current-project-checks.mjs';
import {projectEvidenceRecord,projectNamedFile} from '../src/lib/current-evidence.mjs';
import {priorLedgerSnapshot} from './content-205-216/arizona-september-22-review.mjs';
const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const json=async path=>JSON.parse(await read(path));
const hash=value=>createHash('sha256').update(value).digest('hex');
const ops=await json('src/data/phase-207-current-operations.json');
const id='61-PROJECT-TORONTO-24-254930';
const file=(await json('src/data/phase-61-project-conversion-registry.json')).records.find(r=>r.file_id===id);
const desk=(await json('src/data/phase-60c-editorial-desk.json')).records.find(r=>r.named_file_id===id);
const receipt=ops.receipts.find(r=>r.checked_date==='2026-09-21');
assert(receipt);
assert.equal(receipt.sha256,'5ba881ceb03e744a896558e2eb1a51f149845e56c51327ed85c587f95cc2a6ef');
assert.deepEqual(receipt,await json(`src/data/phase-207-project-checks/${receipt.receipt_id}.json`));
assert.equal(ops.receipts.filter(r=>r.checked_date<='2026-09-21').length,2);
assert.equal(ops.receipts[0].sha256,'c1dd2323581bf7d38d0e336a16a3fc04a0bfcf5a99320b154f633d6aad9566f7');
for(const r of ops.receipts){const {sha256,...unsigned}=r;assert.equal(hash(JSON.stringify(unsigned)),sha256);}
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function boundary(r){
 assert.equal(r.file_id,id);assert.equal(r.desk_item_id,'60C-DESK-003');
 assert.equal(r.checked_date,'2026-09-21');assert(r.checked_date<=today);
 assert.equal(r.scheduled_date,ops.receipts[0].next_check_date);assert.equal(r.next_check_date,'2026-09-28');
 assert.equal(r.original_scheduled_date,'2026-09-09');
 assert.equal(r.current_stage,file.current_stage);assert.equal(r.prior_stage,file.current_stage);
 assert.equal(r.counts_as_cycle_decision,false);assert.equal(r.cycle_item_id,null);assert.equal(r.return_envelope_id,null);
 assert.equal(r.phase64_cell_change,'none');assert.equal(r.qualification_packet_change,'none');
 for(const key of ['publication_authorized','human_admission_authorized','independent_review_complete','source_profile_dates_changed'])assert.equal(r[key],false);
 assert.equal(r.source_checks.length,6);assert.equal(r.permit_address_checks.length,8);
 assert(r.permit_address_checks.every(c=>c.exact_address_application_found===false&&c.nearby_area_results>0));
 assert.deepEqual(r.checked_source_ids,['source-toronto-2026-sc33-9-item-history']);
 assert.deepEqual(r.context_only_source_ids,['source-toronto-development-pipeline-2025']);
 assert(r.bounded_finding.includes('do not prove'));assert(r.source_checks[4].finding.includes('not downloaded or inspected'));
}
boundary(receipt);
for(const mutation of [{checked_date:'2099-01-01'},{counts_as_cycle_decision:true},{current_stage:'Permit issued'},{phase64_cell_change:'accepted'},{publication_authorized:true},{file_id:'unrelated'},{independent_review_complete:true},{permit_address_checks:[]}])assert.throws(()=>boundary({...receipt,...mutation}));
assert.deepEqual(projectChecksFor(id,'2026-09-13'),[]);
assert.equal(latestProjectCheckFor(id,'2026-09-14').receipt_id,ops.receipts[0].receipt_id);
assert.equal(latestProjectCheckFor(id,'2026-09-20').next_check_date,'2026-09-21');
assert.equal(latestProjectCheckFor(id,'2026-09-21').receipt_id,receipt.receipt_id);
assert.equal(latestProjectCheckFor(undefined),null);assert.equal(latestProjectCheckFor('unrelated'),null);
assert.throws(()=>projectChecksFor(id,'tomorrow'),/ISO calendar date/);
assert.equal(projectNamedFile(file,'2026-09-13'),file);
assert.equal(projectNamedFile(file,'2026-09-21').next_check_date,receipt.next_check_date);
assert.equal(projectNamedFile(file).historical_account,file);
assert.deepEqual(projectNamedFile(projectNamedFile(file)),projectNamedFile(file));
assert.equal(projectEvidenceRecord(desk,'2026-09-13'),desk);
assert.equal(projectEvidenceRecord(desk,'2026-09-21').receipt_id,receipt.receipt_id);
assert.deepEqual(projectEvidenceRecord(projectEvidenceRecord(desk)),projectEvidenceRecord(desk));
assert.equal(projectNamedFileDesk({cycle_item_id:'unrelated'}).receipt_id,undefined);
const packets=(await json('src/data/phase-67-qualification-packet-registry.json')).packet_records.filter(p=>p.file_id===id);
assert.equal(packets.length,4);assert.deepEqual(receipt.qualification_packet_ids,packets.map(p=>p.packet_id));
for(const recordId of [...file.source_ids,...file.signal_ids,file.canonical_briefing_id,...file.reader_pathway_ids,...file.dependency_map_ids,...file.evidence_gap_ids,...file.local_system_ids,desk.desk_item_id,desk.conversion_gate_id,'briefing-outcomes-watch-001-what-actually-changed','briefing-evidence-cycle-001-operating-baseline',...packets.map(p=>p.packet_id)])assert(receipt.affected_record_ids.includes(recordId),`Missing assigned target ${recordId}`);
const pins={
 'phase-60-operating-cycle.json':'65668916dbf24bb594be6a2254e2adb013f947106f19a5c27be5a2c5d807cdd2',
 'phase-60c-editorial-desk.json':'0d13281e59cc709a12350f6961de106671534f4f2dd55c947ad398b5dc188cc6',
 'phase-61-project-conversion-registry.json':'9b1f9c6237ebdc9692a748798d400229410c475e5510f2af14a1e2ff22ab8e00',
 'phase-62-conversion-event-ledgers.json':'d8d447ddfcb0c4aee003af78479764394edf799a23876b3ad6d9f225eb2393e2',
 'phase-63-conversion-gate-calendar.json':'ac7e196f5dbef11398ab7900a1130f729595566c655138da493e17fb65631831',
 'phase-64-conversion-stage-matrix.json':'d1094276a6156f3d7f4fade0edd08ea5aad94a56c8ae1de80e98a0c2ac18016f',
 'phase-67-qualification-packet-registry.json':'dbe7718f79a082a7d75f2d5620e86f2e329b3189ea041bac67fb27c24bd3c953',
 'phase-67-evidence-return-envelope-ledger.json':'fd1dbbcd2058e290cdba0521ca14ef171cf19d32c501c92994e85f679b9b5685',
 'phase-60-current-decisions.json':'a499d9fd1d00e9516adf247683e2540ba13f53aa7cd91f7606be5599601d0685'
};
for(const [name,pin]of Object.entries(pins))assert.equal(hash(name==='phase-60-current-decisions.json'?priorLedgerSnapshot(await json(`src/data/${name}`)):await read(`src/data/${name}`)),pin,`Preserved baseline changed: ${name}`);
const update=await json('src/content/updates/2026-09-21-toronto-bounded-project-recheck.json');
assert.equal(update.receipt_id,receipt.receipt_id);assert.deepEqual(update.affected_record_ids,receipt.affected_record_ids);assert.deepEqual(update.related_paths,receipt.affected_routes);
console.log('Toronto follow-up passed: additive September 21 receipt, eight bounded address checks, four unpromoted packets, September 28 next check, immutable September 14/history and thirteen cycle identities preserved.');
