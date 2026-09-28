import {createHash} from 'node:crypto';
import reviews from '../data/selected-article-ai-reviews.json' with {type:'json'};
import editorial from '../data/phase-205-216-current-editorial.json' with {type:'json'};
import evidence from '../data/phase-60-current-decisions.json' with {type:'json'};
import toronto from '../data/phase-207-project-checks/207-TORONTO-2026-09-21-BOUNDED-RECHECK.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};
import operations from '../data/phase-207-current-operations.json' with {type:'json'};
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const selectedReviewInputs=new Map([
 ...[...evidence.receipts,toronto].map(r=>[r.receipt_id,r]),
 ...operations.pilot_research_followups.map(r=>[r.review_id,r]),
 ...editorial.records.map(r=>[r.record_id,r]),
]);
const valueAt=(value,path)=>path.reduce((v,key)=>v?.[key],value);
const validPresentationPath=path=>Array.isArray(path)&&(
 (path.length===3&&path[0]==='sections'&&Number.isInteger(path[1])&&path[1]>=0&&path[2]==='text')||
 (path.length===5&&path[0]==='sections'&&Number.isInteger(path[1])&&path[1]>=0&&path[2]==='paragraphs'&&Number.isInteger(path[3])&&path[3]>=0&&path[4]==='text')||
 (path.length===2&&path[0]==='identity_evidence'&&path[1]==='disposition')||
 (path.length===3&&path[0]==='language_notes'&&Number.isInteger(path[1])&&path[1]>=0&&path[2]==='review_status')
);
/** @param {any} review @param {any} article */
export function validateSelectedArticleReview(review,article,inputs=selectedReviewInputs){
 const {sha256,...body}=review;
 if(hash(body)!==sha256)throw Error(`Selected-review decision drift: ${review.record_id}`);
 if(!article||review.record_id!==article.record_id||review.route!==article.route||review.title!==article.title||hash(article)!==review.source_record_sha256)throw Error(`Selected-review article drift: ${review.record_id}`);
 if(JSON.stringify(review.reviewed_section_hashes)!==JSON.stringify(article.sections.map(s=>({heading:s.heading,sha256:hash(s)}))))throw Error(`Selected-review section drift: ${review.record_id}`);
 const notesPresent=Object.hasOwn(article,'source_notes');
 if((notesPresent?hash(article.source_notes):null)!==review.reviewed_source_notes_sha256||(!notesPresent&&review.source_notes_absent!==true)||(notesPresent&&review.source_notes_absent===true))throw Error(`Selected-review source-note drift: ${review.record_id}`);
 if(review.reviewed_identity_evidence_sha256&&hash(article.identity_evidence??null)!==review.reviewed_identity_evidence_sha256)throw Error(`Selected-review identity drift: ${review.record_id}`);
 if(review.reviewed_language_notes_sha256&&hash(article.language_notes??null)!==review.reviewed_language_notes_sha256)throw Error(`Selected-review language drift: ${review.record_id}`);
 const inputKinds=[
  ['receipt_inputs','receipt_id','receipt',new Set(['app/src/data/phase-60-current-decisions.json','app/src/data/phase-207-project-checks/207-TORONTO-2026-09-21-BOUNDED-RECHECK.json'])],
  ['pilot_inputs','review_id','pilot',new Set(['app/src/data/phase-207-current-operations.json'])],
  ['related_article_inputs','record_id','related-article',new Set(['app/src/data/phase-205-216-current-editorial.json'])],
 ];
 for(const [field,key,label,paths] of inputKinds){
  const seen=new Set();
  for(const input of review[field]??[]){
   const id=input[key],source=inputs.get(id);
   if(!paths.has(input.path)||seen.has(id)||!source||source[key]!==id||hash(source)!==input.sha256)throw Error(`Selected-review ${label} drift: ${id}`);
   if(label==='receipt'&&input.path.endsWith('207-TORONTO-2026-09-21-BOUNDED-RECHECK.json')!==(id===toronto.receipt_id))throw Error(`Selected-review receipt path drift: ${id}`);
   seen.add(id);
  }
 }
 const changedPaths=new Set();
 for(const change of review.required_presentational_changes??[]){
  const key=JSON.stringify(change.path);
  if(!validPresentationPath(change.path)||changedPaths.has(key)||typeof change.prior!=='string'||valueAt(article,change.path)!==change.prior||typeof change.replacement!=='string'||!change.replacement.trim()||change.replacement===change.prior||!change.original_preservation)throw Error(`Selected-review presentation drift: ${review.record_id}`);
  changedPaths.add(key);
 }
 if(review.required_chapter_ids&&JSON.stringify(review.required_chapter_ids)!==JSON.stringify(article.casebook_ids??[]))throw Error(`Selected-review chapter drift: ${review.record_id}`);
 if(review.operating_outcomes_admitted!==false||review.current_external_status_verified!==false||review.original_record_changed!==false)throw Error(`Selected-review boundary invalid: ${review.record_id}`);
 return review;
}
if(reviews.policy_id!==policy.policy_id||policy.human_review_required!==false||reviews.human_review_required!==false||reviews.human_review_claimed!==false||reviews.fresh_external_source_check!==false||reviews.application_projection_integrated!==true)throw Error('Selected-review policy mismatch');
export const selectedArticleReviews=reviews.records.map(r=>validateSelectedArticleReview(r,editorial.records.find(a=>a.record_id===r.record_id)));
if(new Set(selectedArticleReviews.map(r=>r.record_id)).size!==selectedArticleReviews.length||new Set(selectedArticleReviews.map(r=>r.route)).size!==selectedArticleReviews.length||reviews.reviewed_articles!==selectedArticleReviews.length||reviews.remaining_selected_articles!==editorial.records.length-selectedArticleReviews.length)throw Error('Selected-review coverage mismatch');
for(const review of selectedArticleReviews)for(const id of review.required_chapter_ids??[])if(!selectedArticleReviews.some(r=>r.record_id===id))throw Error(`Selected-review missing chapter: ${id}`);
export const selectedReviewDate=reviews.decision_date;
export const selectedReviewStatus='AI editorial review accepted with stated limits';
// A named decision applies only to its exact article bytes and designated route.
// Shared subject names, historical/copy routes and changed content inherit none.
/** @param {{record_id:string}} article @param {{route?:string}} options */
export function selectedArticleReviewFor(article,{route}={route:undefined}){
 const review=selectedArticleReviews.find(r=>r.record_id===article?.record_id);
 return review&&route===review.route&&hash(article)===review.source_record_sha256?review:null;
}

export const earlierAcceptanceSentence='Independent editorial/subject acceptance is pending.';
const currentScopeSentence='This exact article has a dated, owner-authorized AI assessment; linked material is not approved by association.';
/** A separate render view; the signed original article and decision are never edited.
 * @param {any} article @param {{route?:string}} options
 */
export function selectedArticlePresentation(article,{route}={route:undefined}){
 const review=selectedArticleReviewFor(article,{route});
 if(!review)return {article,review:null,changes:[],chapters:[]};
 const projected=structuredClone(article),changes=[];
 const apply=(path,replacement)=>{
  const prior=valueAt(article,path);if(prior===replacement)return;
  let target=projected;for(const key of path.slice(0,-1))target=target[key];target[path.at(-1)]=replacement;
  const label=path[0]==='sections'?article.sections[path[1]].heading:path[0]==='identity_evidence'?'Identity review wording':`Language review: ${article.language_notes[path[1]].term}`;
  changes.push({path,prior,replacement,label});
 };
 for(const change of review.required_presentational_changes??[])apply(change.path,change.replacement);
 // The initial two project decisions already authorize keeping old identity fields as history.
 if(['119-PROJECT-001','191-PROJECT-001'].includes(article.record_id)&&article.identity_evidence)apply(['identity_evidence','disposition'],'AI editorial assessment accepts the stated entity boundary for this exact dated account; portfolio eligibility and operating stage remain separate recorded decisions.');
 article.sections.forEach((section,index)=>{
  if(section.heading==='Scope of this answer'&&section.text.endsWith(earlierAcceptanceSentence))apply(['sections',index,'text'],section.text.replace(earlierAcceptanceSentence,currentScopeSentence));
 });
 const chapters=(review.required_chapter_ids??[]).map(id=>selectedArticleReviews.find(r=>r.record_id===id));
 return {article:projected,review,changes,chapters};
}
