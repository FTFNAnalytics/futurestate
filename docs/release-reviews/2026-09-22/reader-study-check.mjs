import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

// Read-only verification of unperformed test preparation, not reader acceptance.
const directory=dirname(fileURLToPath(import.meta.url));
const root=resolve(directory,'../../..');
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const hash=value=>createHash('sha256').update(Buffer.isBuffer(value)?value:JSON.stringify(value)).digest('hex');
const study=await read('docs/release-reviews/2026-09-22/reader-study-bindings.json');
const editorial=(await read('app/src/data/phase-205-216-current-editorial.json')).records;
const classification=(await read('app/src/data/phase-206-editorial-classification.json')).records;
const update=await read('app/src/content/updates/2026-09-23-annual-battery-chronology.json');
const {computeV1refCandidateDigest}=await import(pathToFileURL(join(root,'app/scripts/lib/v1ref-candidate-digest.mjs')));
const candidate=await computeV1refCandidateDigest({appRoot:join(root,'app')});
assert.equal(candidate.digest,study.candidate_binding.candidate_digest);
const recovery=await read(study.candidate_binding.recovery_report);
assert.equal(recovery.commit,study.candidate_binding.source_commit);
assert.equal(recovery.candidate_digest,candidate.digest);
assert.equal(recovery.validation_receipt,study.candidate_binding.validation_receipt);
const run=await read(study.candidate_binding.validation_results);
assert.deepEqual(run.results.map(r=>[r.script,r.exit_code]),[['current:generate',0],['current:validate',0]]);
assert.equal(study.start_route,'/');
assert.equal(study.required_actual_readers,5);
assert.equal(study.required_successes_on_each_task,4);
assert.equal(study.actual_readers,0);assert.equal(study.completed_attempts,0);
assert.equal(study.tasks.length,5);assert.equal(study.participants.length,5);
const prompts=await readFile(join(directory,'reader-participant-prompts.md'),'utf8');
const moderator=await readFile(join(directory,'reader-session-sheet.md'),'utf8');
for(const [i,task]of study.tasks.entries()){
  assert.equal(task.task,i+1);assert.equal(task.successful_readers,null);assert.equal(task.acceptance,null);
  assert(prompts.includes(task.prompt)&&moderator.includes(task.prompt));
  const key=task.moderator_answer_key;
  const record=i<3?editorial.find(r=>r.record_id===key.id):i===3?classification.find(r=>r.id===key.id):update;
  assert.equal(hash(record),key.record_sha256,'Exact task-record version');
  if(i===3){assert.equal(key.original_title,record.prior.title);assert.equal(key.title,record.correction.title);}
  else assert.equal(key.title,record.title);
  assert.equal(hash(await readFile(join(root,'app/dist'+key.route+'index.html'))),key.rendered_sha256);
  assert(!prompts.includes(key.route),'Participant prompts must not reveal the answer-key route');
  assert(!prompts.includes(task.success_criterion),'Participant prompts must not reveal the success criterion');
}
for(const [i,p]of study.participants.entries()){
  assert.equal(p.code,'P'+(i+1));assert.equal(p.assigned,false);
  for(const key of ['recording_permission','actual_session_date','device','browser','assistive_technology'])assert.equal(p[key],null);
  assert.equal(p.attempts.length,5);
  for(const [j,a]of p.attempts.entries()){
    assert.equal(a.task,j+1);assert.equal(a.attempted,false);
    for(const key of ['success_unaided','duration_seconds','wrong_turns','search_terms','misunderstood_wording','assistance','reader_comments'])assert.equal(a[key],null,'No invented attempt result');
  }
}
assert.deepEqual(study.format_routes.map(r=>r.id),['202-EDITION-001','202-EDITION-002']);
for(const r of study.format_routes)assert.equal(hash(await readFile(join(root,'app/dist'+r.route+'index.html'))),r.rendered_sha256);
assert.deepEqual(study.accessibility_checks.map(c=>c.id),['keyboard','assistive-technology','zoom-200','narrow-reflow','tables']);
for(const check of study.accessibility_checks){
  assert.equal(check.performed,false);assert.equal(check.result,null);
  for(const route of check.routes)await readFile(join(root,'app/dist'+route+'index.html'));
}
assert.equal(study.independent_accessibility_acceptance,null);
assert(study.ui_automation_permission.includes('do not resume without explicit permission'));
console.log('Reader study preparation verified: five version-bound tasks, two format routes, 25 unperformed attempts, five unperformed accessibility checks, unchanged 4-of-5-per-task threshold and no disclosed answer routes in participant prompts. No reader/accessibility acceptance supplied.');
