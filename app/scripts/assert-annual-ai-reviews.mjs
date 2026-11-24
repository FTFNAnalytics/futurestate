import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {annualAiReviewData as data,annualAiDecisions,annualAiReadings,annualAiReviewFor,annualAiPresentation,annualAiReviewStatus,validateAnnualAiDecision,annualAiInputReceipts,annualAiOperationInputs,annualAiLocalInputs,annualAiAvailableDate,annualAiProjectionDate} from '../src/lib/annual-ai-reviews.mjs';
import {applyAnnualCaseReview} from '../src/lib/annual-case-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {readerSourceReviewContexts} from '../src/lib/reader-presentation.mjs';
import originals from '../src/data/phase-204-reader-completion.json' with {type:'json'};
import evidence from '../src/data/phase-60-current-decisions.json' with {type:'json'};
import operations from '../src/data/phase-207-current-operations.json' with {type:'json'};
import {annualAiInputPath,retainedAnnualAiInput,retainedTranslationInput} from '../src/lib/annual-ai-review-inputs.mjs';
const root=new URL('../../',import.meta.url),read=path=>readFile(new URL(path,root),'utf8');
const sha=value=>createHash('sha256').update(value).digest('hex'),hash=value=>sha(JSON.stringify(value));
const preparationText=await read(data.preparation_artifact.path),preparation=JSON.parse(preparationText);
assert.equal(sha(preparationText),data.preparation_artifact.whole_file_sha256);
assert.deepEqual(data.records.slice(0,4),preparation.records);assert.deepEqual(data.source_checks,preparation.source_checks);assert.deepEqual(data.retained_supplemental_checks,preparation.retained_supplemental_checks);
const preparedRecords=[];
for(const batch of data.integration_batches){
  const raw=await read(batch.preparation.path),prepared=JSON.parse(raw);assert.equal(sha(raw),batch.preparation.whole_file_sha256);
  assert.deepEqual(batch.record_ids,prepared.records.map(r=>r.record_id));preparedRecords.push(...prepared.records);
  for(const input of prepared.input_files??[])assert.equal(sha(await read(annualAiInputPath(input))),input.whole_file_sha256);
}
assert.deepEqual(data.records,preparedRecords);
assert.equal(data.local_input_bindings.length,5);
for(const input of data.local_input_bindings){const raw=await read(annualAiInputPath(input));assert.equal(sha(raw),input.whole_file_sha256);assert.equal(hash(JSON.parse(raw)),input.payload_sha256);assert.equal(hash(annualAiLocalInputs.get(input.path)),input.payload_sha256);}
const retained=JSON.parse(await read(retainedTranslationInput.storage_path)),live=JSON.parse(await read(retainedTranslationInput.source_path));
assert.equal(retained.records.length,10);assert.equal(live.records.length,34);assert.deepEqual(live.records.slice(0,10),retained.records,'Existing reviewed translations must remain exact');
assert.equal(hash(live.records.slice(0,16)),'c94c9024f10d3f7cb65dc4a574f96431f0c5b935b2df4a474dd93d8a43b805e4','All sixteen preceding translated records are preserved');
assert.notEqual(sha(await read(retainedTranslationInput.source_path)),retainedTranslationInput.whole_file_sha256,'Live expansion must not impersonate the earlier reviewed input');
assert.throws(()=>retainedAnnualAiInput({path:retainedTranslationInput.source_path,whole_file_sha256:'0'.repeat(64)}),/Unknown retained/);
assert.equal(annualAiInputPath({path:'unknown.json',whole_file_sha256:retainedTranslationInput.whole_file_sha256}),'unknown.json','A hash alone must not redirect another identity');
const retainedView=annualAiPresentation(originals.records.find(r=>r.record_id==='203-APPENDIX-04'),{route:'/reference/state-of-future-systems/'+JSON.parse(await read('app/src/data/phase-203-state-of-future-systems-2026.json')).report_package_records.find(r=>r.report_record_id==='203-APPENDIX-04').slug+'/'}).aiLocalInputs.find(r=>r.path===retainedTranslationInput.source_path);
assert.equal(retainedView.route,retainedTranslationInput.route);assert.equal(retainedView.retained_as_of,'2026-09-27');
const packetText=await read(data.preparation_packet.path),packet=JSON.parse(packetText);
assert.equal(sha(packetText),data.preparation_packet.whole_file_sha256);
assert.equal(data.reviewed_annual_records,58);assert.equal(data.remaining_annual_records,0);assert.equal(annualAiReadings.length,70);assert.equal(data.source_checks.length,3);assert.equal(data.integration_batches.length,8);
assert.equal(annualAiProjectionDate,'2026-09-29');
assert.deepEqual(data.records.map(r=>r.record_id).sort(),JSON.parse(await read('app/src/data/phase-203-state-of-future-systems-2026.json')).report_package_records.map(r=>r.report_record_id).sort());
const before=JSON.stringify({originals,evidence,operations,data});
let edits=0,sections=0,paragraphs=0,claims=0,absent=0,additional=0,local=0;
for(const decision of annualAiDecisions){
  const assignment=packet.assignments.find(r=>r.annual_id===decision.record_id);
  if(assignment){assert.equal(assignment.disposition,null);assert.equal(assignment.reviewer.name,null);assert.equal(decision.claim_findings.length,assignment.claims.length);for(const claim of decision.claim_findings)assert.equal(claim.claim_payload_sha256,hash(assignment.claims.find(c=>c.id===claim.claim_id)));}
  else {for(const reading of decision.readings){const a=originals.records.find(r=>r.record_id===reading.record_id),view=applyAnnualCaseReview(a,{route:reading.route});assert.equal(decision.claim_findings.length,view.sections.length);for(const [i,claim] of decision.claim_findings.entries()){assert.equal(claim.claim_payload_sha256,hash(view.sections[i]));if(decision.readings.length>1)assert.deepEqual(claim.reading_record_ids,decision.readings.map(r=>r.record_id));}}}
  claims+=decision.claim_findings.length;
  for(const reading of decision.readings){
    const article=originals.records.find(a=>a.record_id===reading.record_id),catalog=readerCatalog.find(r=>r.id===reading.record_id);
    const baseline=applyAnnualCaseReview(article,{route:reading.route}),view=annualAiPresentation(article,{route:reading.route});
    assert.equal(view.aiReview,decision);assert.equal(view.aiReading,reading);assert.deepEqual(view.review,baseline.review);assert.equal(view.title,baseline.title);assert.equal(view.overview,baseline.overview);
    absent+=Number(baseline.review===null);additional+=view.aiAdditionalInputs.length;local+=view.aiLocalInputs.length;
    assert.equal(view.aiUpdateRoute,data.integration_batches.find(b=>b.record_ids.includes(decision.record_id)).update_route);
    assert.deepEqual(view.aiAdditionalInputs.map(b=>b.id),(decision.additional_evidence_inputs??[]).map(b=>b.id));
    for(const input of view.aiAdditionalInputs){const rows=input.collection==='evidence_receipts'?evidence.receipts:operations[input.collection],receipt=rows.find(r=>(r.receipt_id??r.review_id)===input.id);assert.deepEqual(input.access_limits,receipt.access_limits??[]);assert.deepEqual(input.required_artifacts,receipt.required_artifacts??[]);assert.equal(input.exact_next_artifact,receipt.exact_next_artifact??null);assert.equal(input.next_action,receipt.next_action??null);}
    for(const binding of [...reading.retained_contexts,...(decision.additional_evidence_inputs??[])]){const rows=binding.collection==='evidence_receipts'?evidence.receipts:operations[binding.collection];const receipt=rows.find(r=>(r.receipt_id??r.review_id)===binding.id);assert.equal(hash(receipt),binding.payload_sha256);assert.equal(receipt.source_checked_date??receipt.checked_date,binding.checked_date);}
    assert.equal(catalog.status,annualAiReviewStatus);assert.equal(catalog.date,annualAiAvailableDate(decision.record_id));assert.equal(catalog.route,reading.route);
    if(catalog.date==='2026-09-29'){assert.equal(decision.review_date,'2026-09-27');assert.equal(annualAiReviewFor(article,{route:reading.route,asOfDate:'2026-09-28'}),null);assert.equal(annualAiReviewFor(article,{route:reading.route,asOfDate:'2026-09-29'}).decision,decision);}
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
assert.deepEqual({edits,sections,paragraphs,claims,absent,additional,local},{edits:66,sections:326,paragraphs:470,claims:257,absent:42,additional:20,local:7});
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
const f15=annualAiDecisions.find(r=>r.record_id==='203-CASE-16');
for(const binding of [...f15.readings[0].retained_contexts,...f15.additional_evidence_inputs]){const key=`${binding.collection}:${binding.id}`,missing=new Map(annualAiOperationInputs);missing.delete(key);assert.throws(()=>validateAnnualAiDecision(f15,originals.records,annualAiInputReceipts,{operationInputs:missing}));for(const field of ['access_limits','required_artifacts']){const changed=new Map(annualAiOperationInputs);changed.set(key,{...changed.get(key),[field]:[]});assert.throws(()=>validateAnnualAiDecision(f15,originals.records,annualAiInputReceipts,{operationInputs:changed}));}}
for(const mutate of [r=>r.additional_evidence_inputs[0].route='/method/editorial-review/#wrong',r=>r.additional_evidence_inputs[0].collection='receipts',r=>r.additional_evidence_inputs[0].checked_date='2026-09-22',r=>r.additional_evidence_inputs[0].path='app/src/data/phase-60-current-decisions.json',r=>r.readings[0].retained_contexts=[]]){const changed=structuredClone(f15);mutate(changed);assert.throws(()=>validateAnnualAiDecision(seal(changed)));}
for(const id of ['203-CASE-21','203-CASE-24'])for(const binding of annualAiDecisions.find(r=>r.record_id===id).additional_evidence_inputs){const changed=new Map(annualAiInputReceipts);changed.set(binding.id,{...changed.get(binding.id),exact_next_artifact:'Removed the actual requirement'});assert.throws(()=>validateAnnualAiDecision(annualAiDecisions.find(r=>r.record_id===id),originals.records,changed));}
const accessibility=annualAiDecisions.find(r=>r.record_id==='203-APPENDIX-04');
const liveSubstitution=new Map(annualAiLocalInputs);liveSubstitution.set(retainedTranslationInput.source_path,live);assert.throws(()=>validateAnnualAiDecision(accessibility,originals.records,annualAiInputReceipts,{localInputs:liveSubstitution}),'The expanded inventory was not assessed in September');
for(const input of accessibility.local_evidence_inputs){const missing=new Map(annualAiLocalInputs);missing.delete(input.path);assert.throws(()=>validateAnnualAiDecision(accessibility,originals.records,annualAiInputReceipts,{localInputs:missing}));const altered=new Map(annualAiLocalInputs);altered.set(input.path,{changed:true});assert.throws(()=>validateAnnualAiDecision(accessibility,originals.records,annualAiInputReceipts,{localInputs:altered}));}
for(const mutate of [r=>r.local_evidence_inputs[0].path='app/src/data/elsewhere.json',r=>r.local_evidence_inputs[0].whole_file_sha256='0'.repeat(64),r=>r.readings[0].retained_contexts.push(tsmc.additional_evidence_inputs[0])]){const changed=structuredClone(accessibility);mutate(changed);assert.throws(()=>validateAnnualAiDecision(seal(changed)));}
assert.equal(JSON.stringify({originals,evidence,operations,data}),before);
const paired=annualAiDecisions.find(r=>r.record_id==='203-SYNTHESIS-01');
for(const mutate of [r=>r.readings.pop(),r=>r.readings[1].route=r.readings[0].route,r=>r.readings[1].record_id='200-MONOGRAPH-02',r=>r.claim_findings[0].reading_record_ids.pop(),r=>r.claim_findings[0].reading_record_ids.reverse(),r=>delete r.claim_findings[0].reading_record_ids,r=>r.claim_findings[0].reading_record_ids.push('unrelated'),r=>r.readings[1].reviewed_section_hashes.pop(),r=>delete r.readings[1].reviewed_section_hashes,r=>r.readings.forEach(x=>delete x.reviewed_section_hashes),r=>r.claim_findings[0].new_primary_inspection_this_assessment=true,r=>r.readings[1].required_presentation_changes[0].prior='invented',r=>r.claim_findings[0].claim_payload_sha256='0'.repeat(64)]){const changed=structuredClone(paired);mutate(changed);assert.throws(()=>validateAnnualAiDecision(seal(changed)));}
const noPriorPair=annualAiDecisions.find(r=>r.readings.length===2&&r.readings.some(x=>x.existing_review_absent));
for(const mutate of [r=>r.readings.find(x=>x.existing_review_absent).existing_review_absent=false,r=>r.readings.find(x=>x.existing_review_absent).existing_review_payload_sha256=hash({})]){const changed=structuredClone(noPriorPair);mutate(changed);assert.throws(()=>validateAnnualAiDecision(seal(changed)));}
console.log('Annual AI source checks passed: all 58 annual decisions on 70 exact readings, 326 sections/470 paragraphs, 257 findings and 66 current/history changes. Eight preparation artifacts and all original/profile/receipt inputs preserved; 42 absent prior reviews stay absent. Explicit paired scope, actual monograph routes, September 29 integration versus September 27 assessment, wrong-input and no-promotion fixtures pass. No new primary inspection or human observations claimed.');
