import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {annualAiReviewData as data,annualAiDecisions,annualAiReadings,annualAiReviewFor,annualAiPresentation,annualAiReviewStatus,validateAnnualAiDecision,annualAiInputReceipts,annualAiOperationInputs,annualAiLocalInputs} from '../src/lib/annual-ai-reviews.mjs';
import {applyAnnualCaseReview} from '../src/lib/annual-case-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import originals from '../src/data/phase-204-reader-completion.json' with {type:'json'};
import evidence from '../src/data/phase-60-current-decisions.json' with {type:'json'};
import operations from '../src/data/phase-207-current-operations.json' with {type:'json'};
const root=new URL('../../',import.meta.url),read=path=>readFile(new URL(path,root),'utf8');
const sha=value=>createHash('sha256').update(value).digest('hex'),hash=value=>sha(JSON.stringify(value));
const preparationText=await read(data.preparation_artifact.path),preparation=JSON.parse(preparationText);
assert.equal(sha(preparationText),data.preparation_artifact.whole_file_sha256);
assert.deepEqual(data.records.slice(0,4),preparation.records);assert.deepEqual(data.source_checks,preparation.source_checks);assert.deepEqual(data.retained_supplemental_checks,preparation.retained_supplemental_checks);
const preparedRecords=[];
for(const batch of data.integration_batches){
  const raw=await read(batch.preparation.path),prepared=JSON.parse(raw);assert.equal(sha(raw),batch.preparation.whole_file_sha256);
  assert.deepEqual(batch.record_ids,prepared.records.map(r=>r.record_id));preparedRecords.push(...prepared.records);
  for(const input of prepared.input_files??[])assert.equal(sha(await read(input.path)),input.whole_file_sha256);
}
assert.deepEqual(data.records,preparedRecords);
assert.equal(data.local_input_bindings.length,5);
for(const input of data.local_input_bindings){const raw=await read(input.path);assert.equal(sha(raw),input.whole_file_sha256);assert.equal(hash(JSON.parse(raw)),input.payload_sha256);assert.equal(hash(annualAiLocalInputs.get(input.path)),input.payload_sha256);}
const packetText=await read(data.preparation_packet.path),packet=JSON.parse(packetText);
assert.equal(sha(packetText),data.preparation_packet.whole_file_sha256);
assert.equal(data.reviewed_annual_records,21);assert.equal(data.remaining_annual_records,37);assert.equal(annualAiReadings.length,23);assert.equal(data.source_checks.length,3);
const before=JSON.stringify({originals,evidence,operations,data});
let edits=0,sections=0,paragraphs=0,claims=0,absent=0,additional=0,local=0;
for(const decision of annualAiDecisions){
  const assignment=packet.assignments.find(r=>r.annual_id===decision.record_id);
  if(assignment){assert.equal(assignment.disposition,null);assert.equal(assignment.reviewer.name,null);assert.equal(decision.claim_findings.length,assignment.claims.length);for(const claim of decision.claim_findings)assert.equal(claim.claim_payload_sha256,hash(assignment.claims.find(c=>c.id===claim.claim_id)));}
  else {assert.equal(decision.readings.length,1);const a=originals.records.find(r=>r.record_id===decision.record_id),view=applyAnnualCaseReview(a,{route:decision.readings[0].route});assert.equal(decision.claim_findings.length,view.sections.length);for(const [i,claim] of decision.claim_findings.entries())assert.equal(claim.claim_payload_sha256,hash(view.sections[i]));}
  claims+=decision.claim_findings.length;
  for(const reading of decision.readings){
    const article=originals.records.find(a=>a.record_id===reading.record_id),catalog=readerCatalog.find(r=>r.id===reading.record_id);
    const baseline=applyAnnualCaseReview(article,{route:reading.route}),view=annualAiPresentation(article,{route:reading.route});
    assert.equal(view.aiReview,decision);assert.equal(view.aiReading,reading);assert.deepEqual(view.review,baseline.review);assert.equal(view.title,baseline.title);assert.equal(view.overview,baseline.overview);
    absent+=Number(baseline.review===null);additional+=view.aiAdditionalInputs.length;local+=view.aiLocalInputs.length;
    assert.equal(view.aiUpdateRoute,data.integration_batches.find(b=>b.record_ids.includes(decision.record_id)).update_route);
    assert.deepEqual(view.aiAdditionalInputs.map(b=>b.id),(decision.additional_evidence_inputs??[]).map(b=>b.id));
    for(const binding of [...reading.retained_contexts,...(decision.additional_evidence_inputs??[])]){const rows=binding.collection==='evidence_receipts'?evidence.receipts:operations[binding.collection];const receipt=rows.find(r=>(r.receipt_id??r.review_id)===binding.id);assert.equal(hash(receipt),binding.payload_sha256);assert.equal(receipt.source_checked_date??receipt.checked_date,binding.checked_date);}
    assert.equal(catalog.status,annualAiReviewStatus);assert.equal(catalog.date,decision.review_date);assert.equal(catalog.route,reading.route);
    sections+=view.sections.length;paragraphs+=view.sections.reduce((n,s)=>n+s.paragraphs.length,0);
    const expected=structuredClone(baseline.sections);
    for(const change of reading.required_presentation_changes){assert.equal(expected[change.path[1]].paragraphs[change.path[3]],change.prior);expected[change.path[1]].paragraphs[change.path[3]]=change.replacement;edits++;}
    assert.deepEqual(view.sections,expected);
    for(const profile of reading.source_profiles)assert.equal(sha(await read(profile.path)),profile.whole_file_sha256);
    for(const options of [{route:'/copied/'},{route:reading.route,asOfDate:'2026-09-26'}]){assert.equal(annualAiReviewFor(article,options),null);assert.deepEqual(annualAiPresentation(article,options).sections,applyAnnualCaseReview(article,options).sections);}
    assert.equal(annualAiReviewFor({...article,overview:'changed'},{route:reading.route}),null);
    assert.equal(annualAiReviewFor(article),null);
    assert.throws(()=>annualAiReviewFor(article,{route:reading.route,asOfDate:'2026-02-30'}));
    const contexts=readerSourceReviewContexts(article,evidence,operations,{route:reading.route});
    assert(!contexts.some(c=>data.source_checks.some(s=>s.id===c.id)),'Own source checks are shown once, not repeated in related context');
  }
}
assert.deepEqual({edits,sections,paragraphs,claims,absent,additional,local},{edits:22,sections:91,paragraphs:115,claims:82,absent:10,additional:3,local:7});
for(const article of originals.records){
  const route=readerCatalog.find(c=>c.id===article.record_id).route;
  if(!annualAiReviewFor(article,{route}))assert.deepEqual(annualAiPresentation(article,{route}).sections,applyAnnualCaseReview(article,{route}).sections,'Unassessed current bodies must remain unchanged');
}
for(const source of data.source_checks){
  const related={record_id:'unassessed-copy',source_ids:[source.source_id]};
  const contexts=readerSourceReviewContexts(related,evidence,operations,{route:'/unassessed/'}).filter(c=>c.id===source.id);
  assert.equal(contexts.length,1);assert.equal(contexts[0].checked_date,source.checked_date);assert.deepEqual(contexts[0].source_check,source);assert.equal(contexts[0].independent_article_review,false);
  assert(!readerSourceReviewContexts(related,evidence,operations,{route:'/unassessed/',asOfDate:'2026-09-26'}).some(c=>c.id===source.id));
}
assert(!readerSourceReviewContexts({source_ids:['unrelated']},evidence,operations).some(c=>data.source_checks.some(s=>s.id===c.id)));
const seal=record=>{const {review_payload_sha256,...body}=record;record.review_payload_sha256=hash(body);return record;};
const gateway=annualAiDecisions[0];
for(const mutate of [
  r=>r.new_operating_observation=true,r=>r.independent_human_review=true,r=>r.new_safety_classification=true,r=>r.new_series_admission=true,
  r=>r.readings[0].route='/wrong/',r=>r.readings[0].original_payload_sha256='0'.repeat(64),r=>r.readings[0].current_reading_sha256='0'.repeat(64),r=>r.readings[0].existing_review_payload_sha256='0'.repeat(64),
  r=>r.readings[0].sections_reviewed++,r=>r.readings[0].source_profiles[0].path='app/src/data/elsewhere.json',
  r=>r.readings[0].required_presentation_changes[0].prior='invented prior',r=>r.readings[0].required_presentation_changes[0].replacement='',
  r=>r.readings[0].required_presentation_changes[0].path=['__proto__','polluted'],r=>r.readings[0].required_presentation_changes.push(structuredClone(r.readings[0].required_presentation_changes[0])),
  r=>r.claim_findings.push(structuredClone(r.claim_findings[0])),r=>r.readings.push(structuredClone(r.readings[0])),
]){const changed=structuredClone(gateway);mutate(changed);assert.throws(()=>validateAnnualAiDecision(seal(changed)));}
const altered=structuredClone(gateway);altered.rationale='Changed unsigned judgment';assert.throws(()=>validateAnnualAiDecision(altered));
const climate=annualAiDecisions.find(r=>r.record_id==='203-SYNTHESIS-08'),receiptId=climate.readings[0].retained_contexts[0].id;
const missing=new Map(annualAiInputReceipts);missing.delete(receiptId);assert.throws(()=>validateAnnualAiDecision(climate,originals.records,missing));
const changedReceipts=new Map(annualAiInputReceipts);changedReceipts.set(receiptId,{...changedReceipts.get(receiptId),bounded_finding:'Changed'});assert.throws(()=>validateAnnualAiDecision(climate,originals.records,changedReceipts));
const tsmc=annualAiDecisions.find(r=>r.record_id==='203-CASE-01');
for(const mutate of [r=>r.readings[0].existing_review_absent=false,r=>delete r.readings[0].existing_review_absent,r=>r.readings[0].route='/wrong/',r=>r.readings[0].existing_review_payload_sha256=hash({}),r=>r.additional_evidence_inputs[0].path='app/src/data/elsewhere.json',r=>r.additional_evidence_inputs[0].route='/wrong/',r=>r.additional_evidence_inputs[0].checked_date='2026-09-28',r=>r.additional_evidence_inputs[0].collection='receipts',r=>r.readings[0].reviewed_section_hashes[0].payload_sha256='0'.repeat(64),r=>r.claim_findings[0].section_index=1,r=>r.claim_findings[0].claim_payload_sha256='0'.repeat(64),r=>r.claim_findings.pop()]){const changed=structuredClone(tsmc);mutate(changed);assert.throws(()=>validateAnnualAiDecision(seal(changed)));}
for(const id of ['203-CASE-02','203-CASE-12','203-CASE-14']){const record=annualAiDecisions.find(r=>r.record_id===id),b=record.readings[0].retained_contexts[0],key=`${b.collection}:${b.id}`;const missing=new Map(annualAiOperationInputs);missing.delete(key);assert.throws(()=>validateAnnualAiDecision(record,originals.records,annualAiInputReceipts,{operationInputs:missing}));const altered=new Map(annualAiOperationInputs);altered.set(key,{...altered.get(key),checked_date:'2026-09-28'});assert.throws(()=>validateAnnualAiDecision(record,originals.records,annualAiInputReceipts,{operationInputs:altered}));}
const accessibility=annualAiDecisions.find(r=>r.record_id==='203-APPENDIX-04');
for(const input of accessibility.local_evidence_inputs){const missing=new Map(annualAiLocalInputs);missing.delete(input.path);assert.throws(()=>validateAnnualAiDecision(accessibility,originals.records,annualAiInputReceipts,{localInputs:missing}));const altered=new Map(annualAiLocalInputs);altered.set(input.path,{changed:true});assert.throws(()=>validateAnnualAiDecision(accessibility,originals.records,annualAiInputReceipts,{localInputs:altered}));}
for(const mutate of [r=>r.local_evidence_inputs[0].path='app/src/data/elsewhere.json',r=>r.local_evidence_inputs[0].whole_file_sha256='0'.repeat(64),r=>r.readings[0].retained_contexts.push(tsmc.additional_evidence_inputs[0])]){const changed=structuredClone(accessibility);mutate(changed);assert.throws(()=>validateAnnualAiDecision(seal(changed)));}
assert.equal(JSON.stringify({originals,evidence,operations,data}),before);
console.log('Annual AI source checks passed: 21 exact decisions on 23 readings, 91 sections/115 paragraphs, 82 findings and 22 current/history changes. All four preparation artifacts, prior records, source profiles and local-input versions preserved; ten absent prior reviews stay absent. Wrong routes/dates, unsafe edits, missing or mismatched receipts, section findings and policy/workflow/translation inputs reject. No new primary inspection or human observations claimed.');
