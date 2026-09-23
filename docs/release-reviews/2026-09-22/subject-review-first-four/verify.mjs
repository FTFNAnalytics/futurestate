import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

// Read-only integrity of an unperformed-review preparation packet.
// This neither fetches sources nor creates/validates human acceptance.
const directory=dirname(fileURLToPath(import.meta.url));
const root=resolve(directory,'../../../..');
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const manifest=JSON.parse(await readFile(join(directory,'manifest.json'),'utf8'));
const articles=(await read(manifest.article_source)).records;
const {computeV1refCandidateDigest}=await import(pathToFileURL(join(root,'app/scripts/lib/v1ref-candidate-digest.mjs')));
const currentCandidate=await computeV1refCandidateDigest({appRoot:join(root,'app')});
const supplemental=new Map();
for(const pin of manifest.supplementary_records){
  const data=await read(pin.file);
  const record=pin.array?data[pin.array].find(row=>row[pin.key]===pin.id):data;
  assert(record,`Supplementary record missing: ${pin.id}`);
  supplemental.set(pin.id,record);
}
const expectedIds=['195-BRIEF-017','195-BRIEF-053','195-BRIEF-047','195-BRIEF-057'];
const expectedCounts=[4,3,3,4];
function validate(packet){
  assert.equal(packet.candidate_binding.candidate_digest,currentCandidate.digest,'Candidate differs');
  assert.equal(packet.independent_approvals,0,'Preparation cannot supply approval');
  assert.equal(packet.external_contacts,0,'Preparation cannot supply contact');
  assert.deepEqual(packet.assignments.map(a=>a.article_id),expectedIds,'Assignment membership');
  assert.deepEqual(packet.assignments.map(a=>a.claims.length),expectedCounts,'Claim coverage');
  assert.equal(new Set(packet.supplementary_records.map(r=>r.id)).size,packet.supplementary_records.length);
  for(const pin of packet.supplementary_records){
    const record=supplemental.get(pin.id);
    assert(record,`Unknown supplementary record: ${pin.id}`);
    assert.equal(hash(record),pin.record_sha256,`Supplementary hash: ${pin.id}`);
    if(pin.source_notes)assert.deepEqual(pin.source_notes,record.source_notes);
    if(pin.bounded_finding)assert.equal(pin.bounded_finding,record.bounded_finding);
  }
  const ids=new Set(packet.supplementary_records.map(r=>r.id));
  for(const assignment of packet.assignments){
    const current=articles.find(a=>a.record_id===assignment.article_id);
    assert(current,`Missing article ${assignment.article_id}`);
    assert.equal(assignment.article_payload_sha256,current.sha256);
    assert.equal(assignment.record_sha256,hash(current),'Complete article hash');
    assert.deepEqual(assignment.article_snapshot,current,'Article snapshot');
    assert.deepEqual(assignment.reviewer,{name:null,expertise:null,conflicts:null,review_date:null,contact_authorized:false});
    assert.equal(assignment.article_decision,null);
    assert.equal(assignment.decision_rationale,null);
    assert.equal(new Set(assignment.claims.map(c=>c.id)).size,assignment.claims.length);
    for(const claim of assignment.claims){
      assert(['answer','detail'].includes(claim.article_field),'Located article field');
      assert(claim.exact_text.length>20&&current[claim.article_field].includes(claim.exact_text),'Exact claim membership');
      assert(claim.source_indices.length>0);
      for(const index of claim.source_indices)assert(Number.isInteger(index)&&index>=0&&index<current.sources.length,'Source index');
      for(const id of claim.supplementary_ids)assert(ids.has(id),'Supplementary reference');
      assert(claim.review_question.length>30&&claim.entity_period_unit_boundary.length>30);
      for(const key of ['reviewer_finding','reviewer_rationale','proposed_wording','editor_response','revised_article_sha256','revised_version_acceptance'])assert.equal(claim[key],null,`Unperformed return: ${key}`);
    }
  }
}
validate(manifest);
const mutations=[
  p=>p.candidate_binding.candidate_digest='0'.repeat(64),
  p=>p.assignments.pop(),
  p=>p.assignments[0].claims.pop(),
  p=>p.assignments[0].article_snapshot.answer+=' changed',
  p=>p.assignments[0].record_sha256='0'.repeat(64),
  p=>p.assignments[0].claims[0].exact_text='Invented unsupported wording that does not occur',
  p=>p.assignments[0].claims[0].source_indices=[99],
  p=>p.assignments[0].claims[0].supplementary_ids=['unknown-receipt'],
  p=>p.supplementary_records[0].record_sha256='0'.repeat(64),
  p=>p.assignments[0].reviewer.name='Invented reviewer',
  p=>p.assignments[0].claims[0].reviewer_finding='supported as written',
  p=>p.independent_approvals=1,
];
for(const mutate of mutations){const fixture=structuredClone(manifest);mutate(fixture);assert.throws(()=>validate(fixture),'Unsafe packet mutation must fail');}
for(const assignment of manifest.assignments){
  const md=await readFile(join(directory,assignment.article_id+'.md'),'utf8');
  for(const value of [assignment.article_snapshot.title,assignment.article_snapshot.route,assignment.article_payload_sha256,assignment.record_sha256,manifest.candidate_binding.candidate_digest,...assignment.claims.map(c=>c.exact_text)])assert(md.includes(value),'Worksheet exact content');
  for(const claim of assignment.claims)assert.equal(md.split('### '+claim.id+'\n').length-1,1);
  assert(md.includes('no decision is recorded'));
  assert(md.includes('Reviewer return — leave blank until actual review'));
  for(const match of md.matchAll(/\]\(<(C:\/[^>]+)>\)/g))await readFile(match[1]);
}
if(manifest.candidate_binding.validation_status==='terminal_pass'){
  const results=await read(manifest.candidate_binding.validation_results);
  assert.deepEqual(results.results.map(r=>[r.script,r.exit_code]),[['current:generate',0],['current:validate',0]]);
  assert.equal(results.results[1].finished_at,manifest.candidate_binding.validation_finished_at);
  const receipt=await read('app/src/data/phase-204-receipts/'+manifest.candidate_binding.receipt_id+'.json');
  assert.equal(receipt.artifact_digest,currentCandidate.digest);
  const recovery=await read(manifest.candidate_binding.recovery_report);
  assert.equal(recovery.commit,manifest.candidate_binding.recovered_source_commit);
  assert.equal(recovery.candidate_digest,currentCandidate.digest);
  assert.equal(recovery.validation_receipt,manifest.candidate_binding.receipt_id);
}else{
  assert.equal(manifest.candidate_binding.validation_status,'pending_terminal_result');
  assert.equal(manifest.candidate_binding.receipt_id,null);
  assert.equal(manifest.candidate_binding.validation_finished_at,null);
}
console.log(`Four worksheets / fourteen located claims verified against exact current records and six supplementary records; ${mutations.length} negative fixtures rejected. Human reviews, contacts and approvals remain unperformed. Candidate validation: ${manifest.candidate_binding.validation_status}.`);
