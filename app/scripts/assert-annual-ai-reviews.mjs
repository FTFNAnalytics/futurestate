import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {annualAiReviewData as data,annualAiDecisions,annualAiReadings,annualAiReviewFor,annualAiPresentation,annualAiReviewStatus,validateAnnualAiDecision,annualAiInputReceipts} from '../src/lib/annual-ai-reviews.mjs';
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
assert.deepEqual(data.records,preparation.records);assert.deepEqual(data.source_checks,preparation.source_checks);assert.deepEqual(data.retained_supplemental_checks,preparation.retained_supplemental_checks);
const packetText=await read(data.preparation_packet.path),packet=JSON.parse(packetText);
assert.equal(sha(packetText),data.preparation_packet.whole_file_sha256);
assert.equal(data.reviewed_annual_records,4);assert.equal(data.remaining_annual_records,54);assert.equal(annualAiReadings.length,6);assert.equal(data.source_checks.length,3);
const before=JSON.stringify({originals,evidence,operations,data});
let edits=0,sections=0,paragraphs=0,claims=0;
for(const decision of annualAiDecisions){
  const assignment=packet.assignments.find(r=>r.annual_id===decision.record_id);
  assert.equal(assignment.disposition,null);assert.equal(assignment.reviewer.name,null);
  assert.equal(decision.claim_findings.length,assignment.claims.length);
  for(const claim of decision.claim_findings){assert.equal(claim.claim_payload_sha256,hash(assignment.claims.find(c=>c.id===claim.claim_id)));claims++;}
  for(const reading of decision.readings){
    const article=originals.records.find(a=>a.record_id===reading.record_id),catalog=readerCatalog.find(r=>r.id===reading.record_id);
    const baseline=applyAnnualCaseReview(article,{route:reading.route}),view=annualAiPresentation(article,{route:reading.route});
    assert.equal(view.aiReview,decision);assert.equal(view.aiReading,reading);assert.deepEqual(view.review,baseline.review);assert.equal(view.title,baseline.title);assert.equal(view.overview,baseline.overview);
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
assert.deepEqual({edits,sections,paragraphs,claims},{edits:7,sections:30,paragraphs:54,claims:21});
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
assert.equal(JSON.stringify({originals,evidence,operations,data}),before);
console.log('Annual AI source checks passed: four exact decisions, six designated readings, 30 sections/54 paragraphs, 21 claim findings and seven separate current/history changes; prepared packet, prior reviews, profiles and original records unchanged. Wrong route/date, mutated input, unsafe/duplicate edits and missing receipts reject; three dated source checks propagate only by exact source ID without whole-article acceptance.');
