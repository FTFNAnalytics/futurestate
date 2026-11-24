import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {claimReviews} from './content-205-216/claim-reviews.mjs';
import inputPins from './content-205-216/claim-review-inputs.json' with {type:'json'};
import {verifyClassifiedInput,retainDocketSourceReviews} from './lib/classification-review.mjs';
import {append57lClassifications} from './lib/classification-57l.mjs';
import {appendDatedSignalClassifications} from './lib/append-dated-signal-classifications.mjs';
import attribution56tPins from './content-205-216/reference-attribution-56t-inputs.json' with {type:'json'};
import {signalReviews56t} from './content-205-216/reference-attribution-56t-reviews.mjs';
import attribution57kPins from './content-205-216/reference-attribution-57k-inputs.json' with {type:'json'};
import {signalReviews57k} from './content-205-216/reference-attribution-57k-reviews.mjs';
import attribution57jPins from './content-205-216/reference-attribution-57j-inputs.json' with {type:'json'};
import {signalReviews57j} from './content-205-216/reference-attribution-57j-reviews.mjs';
import attribution57iPins from './content-205-216/reference-attribution-57i-inputs.json' with {type:'json'};
import {signalReviews57i} from './content-205-216/reference-attribution-57i-reviews.mjs';
import attribution57hPins from './content-205-216/reference-attribution-57h-inputs.json' with {type:'json'};
import {signalReviews57h} from './content-205-216/reference-attribution-57h-reviews.mjs';
import attribution57gPins from './content-205-216/reference-attribution-57g-inputs.json' with {type:'json'};
import {signalReviews57g} from './content-205-216/reference-attribution-57g-reviews.mjs';
import attribution56ghPins from './content-205-216/reference-attribution-56gh-inputs.json' with {type:'json'};
import {signalReviews56gh,screeningBasis56gh} from './content-205-216/reference-attribution-56gh-reviews.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const audit=JSON.parse(await readFile(join(root,'../docs/audits/2026-09-09-audit-evidence.json'),'utf8'));
const reviewedId='signal-57n-amtrak-24-accepted-label-conformance-tests';
const records=[];
const cohort=[...audit.signal_screening_cohort,{id:reviewedId,file:`${reviewedId}.mdx`,title:'Amtrak passes 24 accepted-label conformance tests',evidence_quality:'Official Data',verification_status:'Verified Against Primary Source'}];
// Browser QA found workflow-origin records missed by the keyword screen. Hold the
// entire additional Phase 57M–Y origin cohort pending individual review, without
// declaring its members method notes or asserting that every claim is defective.
const originalIds=new Set(cohort.map(r=>r.id));
for(const file of (await readdir(join(root,'src/content/signals'))).filter(f=>/^signal-57[m-y]-.*\.mdx$/.test(f)).sort()){
  const body=await readFile(join(root,'src/content/signals',file),'utf8');
  const field=key=>body.match(new RegExp(`^${key}: "([^"]+)"`,'m'))?.[1];
  const id=field('id');if(!id)throw new Error(`Missing origin-cohort ID: ${file}`);
  if(!originalIds.has(id))cohort.push({id,file,title:field('title'),evidence_quality:field('evidence_quality'),verification_status:field('verification_status'),expanded_origin_screen:true});
}
for(const item of cohort){
  const body=await readFile(join(root,'src/content/signals',item.file),'utf8');
  const confirmed=item.id===reviewedId;
  records.push({id:item.id,slug:body.match(/^slug: "([^"]+)"/m)?.[1],source_file:item.file,source_sha256:createHash('sha256').update(body).digest('hex'),action_date:'2026-09-14',claim_review_complete:confirmed,content_type:confirmed?'FTFN method/test note':'Unclassified — review pending',disposition:confirmed?'Corrected current presentation; exclude from external-development feed':'Temporary current-feed exclusion pending individual claim review',current_feed_eligible:false,reason:confirmed?'The body reports FTFN adapter-label tests, zero actual candidate packets and zero reviewer receipts. The original headline attributed the test passage to Amtrak.':'The September 9 keyword screen identified this record for review. A keyword match is not a finding that the record is a method note or factually wrong. No individual adjudication is claimed.',prior:{title:item.title,evidence_quality:item.evidence_quality,verification_status:item.verification_status},...(confirmed?{correction:{title:'FTFN adapter passes 24 Amtrak-label conformance tests',summary:'FTFN software tests accepted-label matching. No Amtrak operating outcome, real candidate evaluation or independent reviewer receipt is established.',evidence_quality:'Internal FTFN test — not external outcome evidence',verification_status:'Software-test result; external outcome not verified'}}:{})});
}
// Origin screening remains provenance even after a record receives a real review.
// Apply it before adjudication, so it can never overwrite an individual reason.
for(const r of records){
  const body=await readFile(join(root,'src/content/signals',r.source_file),'utf8');
  for(const key of ['summary','signal_type','maturity_level','record_status','why_it_matters','claim_scope','local_evidence_level'])r.prior[key]=body.match(new RegExp(`^${key}: "([^"]+)"`,'m'))?.[1];
  r.screening_basis=originalIds.has(r.id)?(r.id===reviewedId?'Separately confirmed Amtrak correction':'Original September 9 keyword-screen cohort'):'Additional Phase 57M–Y workflow-origin cohort, discovered during browser QA';
  if(!originalIds.has(r.id))r.reason='The original keyword screen missed workflow-origin records visible in the signal shelf. This additional origin cohort is temporarily excluded pending individual claim review. Origin is not a semantic classification, a factual defect verdict or an evidence decision.';
}
if(new Set(claimReviews.map(r=>r.id)).size!==claimReviews.length)throw new Error('Duplicate authored classification ID');
for(const review of claimReviews){
  const record=records.find(r=>r.id===review.id);if(!record)throw new Error(`Unknown reviewed ID ${review.id}`);
  const body=await readFile(join(root,'src/content/signals',record.source_file),'utf8');verifyClassifiedInput({id:review.id,body,excerpt:review.excerpt,expectedHash:inputPins.records[review.id]});
  Object.assign(record,{claim_review_complete:true,content_type:review.type,reason:review.reason,review_excerpt:review.excerpt,review_scope:'Individual headline, metadata and complete body classification; not a fresh external-artifact verification or independent approval',reviewer:'Codex — editorial classification pass',disposition:review.title?'Corrected current presentation; exclude from external-development feed':'Classification reviewed; retain exclusion pending external source review'});
  if(review.title)record.correction={title:review.title,summary:review.summary,evidence_quality:'Internal FTFN record — not external outcome evidence',verification_status:'Editorial classification reviewed; external outcome not verified',signal_type:review.type,maturity_level:'Not an external maturity assessment',why_it_matters:review.reason};
  if(review.review_scope)record.review_scope=review.review_scope;
  if(review.reopening_contract)record.reopening_contract=review.reopening_contract;
}
for(const r of records.filter(r=>r.claim_review_complete)){
  const body=await readFile(join(root,'src/content/signals',r.source_file),'utf8');verifyClassifiedInput({id:r.id,body,expectedHash:inputPins.records[r.id]});
  r.reviewed_source_sha256=inputPins.records[r.id];r.classification_review_date=inputPins.review_date;
  if(r.id===reviewedId)Object.assign(r.correction,{signal_type:r.content_type,maturity_level:'Not an external maturity assessment',why_it_matters:r.reason});
  if(r.correction&&['FTFN method/test note','Research docket'].includes(r.content_type))Object.assign(r.correction,{claim_scope:'Internal FTFN record',local_evidence_level:'Not local operating evidence'});
  const review=claimReviews.find(review=>review.id===r.id);
  if(review?.presentation_overrides||review?.retained_source_reviews){
    const {receipts}=JSON.parse(await readFile(join(root,'src/data/phase-58-change-receipts.json'),'utf8'));
    Object.assign(r,retainDocketSourceReviews({review,correction:r.correction,receipts,body,reviewDate:inputPins.review_date}));
  }
}
const completed=records.filter(r=>r.claim_review_complete).length;
const remainingOriginal=records.filter(r=>originalIds.has(r.id)&&!r.claim_review_complete).length;
const remainingAdditional=records.filter(r=>!originalIds.has(r.id)&&!r.claim_review_complete).length;
if(records.length!==621||completed!==621||Object.keys(inputPins.records).length!==completed)throw new Error('Unexpected screening, adjudication or pinned-input inventory');
const through57l=await append57lClassifications(root,records);
const through56t=await appendDatedSignalClassifications({root,previous:through57l,pins:attribution56tPins,reviews:signalReviews56t,screeningBasis:'Complete Phase 56T linked-signal review following confirmed research-document attribution defects',reviewScope:'Individual headline, metadata and complete body attribution with exact historical recommendation matrices; not a fresh external verification, GAO decision or independent approval'});
const through57k=await appendDatedSignalClassifications({root,previous:through56t,pins:attribution57kPins,reviews:signalReviews57k,screeningBasis:'Complete Phase 57K linked-signal review following confirmed research-document attribution defects',reviewScope:attribution57kPins.review_scope});
const through57j=await appendDatedSignalClassifications({root,previous:through57k,pins:attribution57jPins,reviews:signalReviews57j,screeningBasis:'Complete Phase 57J linked-signal review following confirmed research-document attribution and denominator defects',reviewScope:attribution57jPins.review_scope});
const through57i=await appendDatedSignalClassifications({root,previous:through57j,pins:attribution57iPins,reviews:signalReviews57i,screeningBasis:'Complete Phase 57I linked-signal review following confirmed research-document attribution defects',reviewScope:attribution57iPins.review_scope});
const through57h=await appendDatedSignalClassifications({root,previous:through57i,pins:attribution57hPins,reviews:signalReviews57h,screeningBasis:'Complete Phase 57H linked-signal review following confirmed research-document attribution and claim defects',reviewScope:attribution57hPins.review_scope});
const through57g=await appendDatedSignalClassifications({root,previous:through57h,pins:attribution57gPins,reviews:signalReviews57g,screeningBasis:'Complete Phase 57G linked-signal review following confirmed research-document attribution and claim defects',reviewScope:attribution57gPins.review_scope});
const currentRecords=await appendDatedSignalClassifications({root,previous:through57g,pins:attribution56ghPins,reviews:signalReviews56gh,screeningBasis:screeningBasis56gh,reviewScope:attribution56ghPins.review_scope});
const currentCompleted=currentRecords.filter(r=>r.claim_review_complete).length;
await writeFile(join(root,'src/data/phase-206-editorial-classification.json'),JSON.stringify({schema_version:'1.3',as_of_date:'2026-09-15',screened_records:405,additional_confirmed_corrections:1,additional_origin_screened_records:215,additional_attribution_reviewed_records:205,individually_reviewed:currentCompleted,corrected_presentations:currentRecords.filter(r=>r.correction).length,remaining_original_cohort_reviews:remainingOriginal,remaining_additional_cohort_reviews:remainingAdditional,remaining_individual_reviews:currentRecords.length-currentCompleted,phase_state:'In progress — not complete',indexing_policy:'Preserve historical Published URL indexing; current feed eligibility is a separate dimension. Classification notices and corrections travel with the record.',records:currentRecords},null,2)+'\n');
console.log(`${currentCompleted} individual classifications recorded, including seven new 56G/56H reviews; earlier 819 decisions unchanged. All reviewed-cohort feed exclusions remain. No external refresh or whole-corpus clearance inferred.`);
