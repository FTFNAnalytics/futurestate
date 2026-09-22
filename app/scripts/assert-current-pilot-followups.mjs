import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {pilotResearchFollowups} from './content-205-216/pilot-research-followups.mjs';
import {priorLedgerSnapshot} from './content-205-216/arizona-september-22-review.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFile(join(root,path),'utf8'),json=async path=>JSON.parse(await read(path));
const ops=await json('src/data/phase-207-current-operations.json'),editorial=await json('src/data/phase-205-216-current-editorial.json');
const hash=value=>createHash('sha256').update(value).digest('hex');
assert.equal(hash(JSON.stringify(ops.pilot_reviews)),'9b3a4f2bbc9607277cec906b227690b268891137fb1bf9d540d5d657d0802739','Original pilot reviews and observations must remain unchanged');
const baseline=Object.fromEntries(Object.entries(ops).filter(([key])=>!['as_of_date','pilot_research_followups'].includes(key)));
assert.deepEqual(ops.receipts.map(r=>r.receipt_id),['207-TORONTO-2026-09-14-BOUNDED-RECHECK','207-TORONTO-2026-09-21-BOUNDED-RECHECK']);
// Preserve the complete original baseline; the additive Toronto receipt has its own hash/semantic tests.
baseline.receipts=[ops.receipts[0]];
assert.equal(hash(JSON.stringify(baseline)),'8ca999c6161da994b813d3bb3dbf10bbe1be1b3a9958e38f68fe3eed43a165e1','Original operations, receipts and research must remain unchanged');
assert.equal(hash(priorLedgerSnapshot(await json('src/data/phase-60-current-decisions.json'))),'a499d9fd1d00e9516adf247683e2540ba13f53aa7cd91f7606be5599601d0685');
assert.deepEqual(ops.pilot_research_followups,pilotResearchFollowups);
assert.equal(ops.pilot_research_followups.length,5);assert.equal(ops.as_of_date,'2026-09-22');assert.equal(ops.governed_series_admitted,0);
const now=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Edmonton',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function checkResearchBoundary(r){
 assert.equal(r.visual_review_complete,['211-DALRYMPLE-VISUAL-2026-09-15','211-HORNSDALE-ACCESS-2026-09-22'].includes(r.review_id));assert.equal(r.independent_review_complete,false);
 assert.equal(r.admitted,false);assert.equal(r.admission_receipt,null);assert.equal(r.second_reviewer,null);
 assert.equal(r.issuer_correction_claimed,false);assert.equal(r.publication_authorized,false);assert.equal(r.prior_extraction_preserved,true);
 assert.deepEqual(r.candidate_observations_added,[]);assert(r.checked_date<=now&&r.checked_date<=ops.as_of_date,'Future research cannot appear as current');
 const original=ops.pilot_reviews.find(p=>p.pilot_id===r.pilot_id);assert(original);assert.equal(original.entity_id,r.entity_id);
 assert.equal(new Set(r.affected_routes).size,r.affected_routes.length);
 assert.deepEqual([...r.affected_routes].sort(),['/method/editorial-review/',...r.affected_record_ids.map(id=>{const a=editorial.records.find(a=>a.record_id===id);assert(a);return a.route;})].sort());
}
const note=ops.pilot_research_followups[0];checkResearchBoundary(note);
assert.equal(hash(JSON.stringify(note)),'b9107cf89ffc88eba01afbb4929fd2b004b16837bb36304ee68b57db666635e9','Earlier text-only receipt must remain unchanged');
for(const field of ['visual_review_complete','independent_review_complete','admitted','publication_authorized','issuer_correction_claimed'])assert.throws(()=>checkResearchBoundary({...note,[field]:true}));
assert.throws(()=>checkResearchBoundary({...note,checked_date:'2099-01-01'}));
assert.throws(()=>checkResearchBoundary({...note,entity_id:'119-PROJECT-012'}));
assert.throws(()=>checkResearchBoundary({...note,candidate_observations_added:[{value:98.27}]}));
assert.throws(()=>checkResearchBoundary({...note,affected_routes:[...note.affected_routes,'/unrelated/']}));
assert.equal(note.source_checks.length,3);assert.equal(note.access_limits.length,3);assert.equal(note.required_artifacts.length,3);
assert.deepEqual(note.source_checks.map(s=>s.artifact_date),['2019-07','2020-08','2021-03']);
assert(note.source_checks.every(s=>s.url.startsWith('https://')&&s.locator&&s.access.includes('not inspected')));
assert(note.source_checks[0].finding.includes('Schedule 7'));assert(note.source_checks[0].finding.includes('proposed'));
assert(note.source_checks[1].finding.includes('monthly'));assert(note.source_checks[1].finding.includes('version history'));
assert(note.access_limits.some(s=>s.includes('socket permissions')));assert(note.access_limits.some(s=>s.includes('not claimed as freshly reverified')));
const update=await json('src/content/updates/2026-09-15-dalrymple-measurement-definition.json');
assert.equal(update.receipt_id,note.review_id);assert.equal(update.source_checked_date,note.checked_date);assert.equal(update.materiality,'No record-state change');
assert.deepEqual(update.affected_record_ids,[note.pilot_id,note.entity_id,...note.affected_record_ids]);
assert.deepEqual(update.related_paths,[...note.affected_routes,'/data/current-operations.json']);
const visual=ops.pilot_research_followups[1];checkResearchBoundary(visual);
assert.equal(visual.supersedes_access_limits_of,note.review_id);
assert.equal(visual.source_checks.length,4);
assert.deepEqual(visual.source_checks.map(s=>s.visually_checked_pages),[[21,40,42],[14,36],[14,35],[19,20]]);
assert.deepEqual(visual.source_checks.map(s=>s.captured_sha256),[
 'fbdf1d3596780d246495eb4825e75acdccb65a413ccbd663779144bb6f0503d6',
 '2afdd486f367c6957acd9bf8f3f8d60da65c67a313fc967bd4ce826cc3a0b6f6',
 'f07576cf0ede7d0b8db5187a5e354efbdf4445b3dda1c70697e1b2b4df9d1679',
 'f431e507a48bb61c27247495e8365f9bb1e2b830c5b2145d0ca6bf41aaee7b99'
]);
assert.deepEqual(visual.source_checks.map(s=>s.captured_bytes),[2801275,1865567,2591957,1271033]);
assert(visual.source_checks.every(s=>s.access.includes('visually inspected')&&s.visually_checked_pages.every(p=>p>0&&p<=s.document_pages)));
assert(visual.visual_review_scope.includes('Nine named pages'));assert(visual.access_limits.some(s=>s.includes('only the nine named pages')));
assert.throws(()=>checkResearchBoundary({...visual,visual_review_complete:false}));
assert.throws(()=>checkResearchBoundary({...visual,independent_review_complete:true}));
assert.throws(()=>checkResearchBoundary({...visual,admitted:true}));
const visualUpdate=await json('src/content/updates/2026-09-15-dalrymple-visual-source-check.json');
assert.equal(visualUpdate.receipt_id,visual.review_id);assert.equal(visualUpdate.source_checked_date,visual.checked_date);
assert.equal(visualUpdate.materiality,'No record-state change');
assert.deepEqual(visualUpdate.affected_record_ids,[visual.pilot_id,visual.entity_id,...visual.affected_record_ids]);
assert.deepEqual(visualUpdate.related_paths,[...visual.affected_routes,'/data/current-operations.json']);
const acquisitions=ops.pilot_research_followups.slice(2);
assert.deepEqual(acquisitions.map(r=>r.pilot_id),['160-PILOT-001','160-PILOT-002','160-PILOT-003']);
assert.deepEqual(acquisitions.map(r=>r.review_id),['211-HORNSDALE-ACCESS-2026-09-22','211-DALRYMPLE-ACQUISITION-2026-09-22','211-F15EX-ACCESS-2026-09-22']);
for(const r of acquisitions){
 checkResearchBoundary(r);assert.equal(r.checked_date,'2026-09-22');assert.match(r.status,/held/);
 for(const field of ['independent_review_complete','admitted','publication_authorized','issuer_correction_claimed'])assert.throws(()=>checkResearchBoundary({...r,[field]:true}));
 assert.throws(()=>checkResearchBoundary({...r,candidate_observations_added:[{value:1}]}));
 const file={'160-PILOT-001':'hornsdale-report-access','160-PILOT-002':'dalrymple-acquisition','160-PILOT-003':'f15ex-access'}[r.pilot_id];
 const update=await json(`src/content/updates/2026-09-22-${file}.json`);
 assert.equal(update.receipt_id,r.review_id);assert.equal(update.source_checked_date,r.checked_date);assert.equal(update.materiality,'No record-state change');
 assert.deepEqual(update.affected_record_ids,[r.pilot_id,r.entity_id,...r.affected_record_ids]);
 assert.deepEqual(update.related_paths,[...r.affected_routes,'/data/current-operations.json']);
}
const hornsdale=acquisitions[0],source=hornsdale.source_checks[0];
assert.equal(source.captured_sha256,'e228a12b0320a0ebcaa2c81caa246081be0ca647327afe73c1764065a1b9bea5');
assert.equal(source.captured_bytes,1130456);assert.equal(source.document_pages,18);assert.deepEqual(source.visually_checked_pages,[1,9,13]);
assert.equal(source.artifact_date,'2025-02-21');assert.equal(source.observation_period,'H1 2024');
assert.match(source.page_number_convention,/physical/);assert.match(hornsdale.finding,/31\/11\/2023/);assert.match(hornsdale.finding,/not a reproduced half-year/);
const dossier=editorial.records.find(r=>r.record_id==='191-PROJECT-003');
assert.equal(dossier.updated_date,'2026-09-22');assert.match(dossier.source_notes[2].access,/three named pages visually inspected/);
assert.match(dossier.sections[3].text,/31\/11\/2023/);assert(!dossier.sections.some(s=>s.heading==='The unavailable operating report remains visible'));
assert.deepEqual(acquisitions[1].source_checks.map(s=>s.artifact_date),['2020-02','2020-08']);
assert.match(acquisitions[2].source_checks[0].access,/Access Denied/);assert.match(acquisitions[2].finding,/not freshly verified/);
const template=await read('src/components/review/CurrentOperationsNotice.astro'),verifier=await read('scripts/verify-current-editorial.mjs');
for(const marker of ['data-pilot-research={r.review_id}','r.checked_date<=operations.as_of_date','r.source_checks.map','r.access_limits.map','r.required_artifacts.map','original extraction and period amendment remain unchanged'])assert(template.includes(marker));
assert(verifier.includes('ops.pilot_research_followups'));assert(verifier.includes('data-pilot-research='));
// Exercise the actual validator with altered in-memory reads, never edited files.
function rejectedReferenceFixture(target,mutation,expected){
 const code=`import fs from 'node:fs';import {syncBuiltinESMExports} from 'node:module';
 const original=fs.readFileSync;
 fs.readFileSync=(...args)=>{const raw=original(...args);if(String(args[0]).replaceAll('\\\\','/').endsWith(${JSON.stringify(target)})){const value=JSON.parse(raw);${mutation};return JSON.stringify(value);}return raw;};
 syncBuiltinESMExports();await import('./scripts/validate-content-references.mjs');`;
 const result=spawnSync(process.execPath,['--input-type=module','-e',code],{cwd:root,encoding:'utf8',windowsHide:true});
 assert.equal(result.status,1);assert(result.stderr.includes(expected),result.stderr);
}
rejectedReferenceFixture('src/content/updates/2026-09-15-dalrymple-measurement-definition.json',"value.affected_record_ids.push('212-REPORT-NONEXISTENT')",'references missing public record "212-REPORT-NONEXISTENT"');
rejectedReferenceFixture('src/data/phase-205-216-current-editorial.json',"value.records.find(r=>r.record_id==='212-REPORT-001').route='/reference/invented-report/'",'unresolved current reader route for "212-REPORT-001"');
console.log('Measurement follow-up checks passed: two preserved Dalrymple receipts plus three September 22 acquisition outcomes; Hornsdale hash, exact pages and invalid date pinned; original operations/pilots/evidence preserved with zero added observations or admissions. Production acceptance is checked separately.');
