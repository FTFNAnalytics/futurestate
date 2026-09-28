import {createHash} from 'node:crypto';
import reviews from '../data/selected-article-ai-reviews.json' with {type:'json'};
import editorial from '../data/phase-205-216-current-editorial.json' with {type:'json'};
import evidence from '../data/phase-60-current-decisions.json' with {type:'json'};
import toronto from '../data/phase-207-project-checks/207-TORONTO-2026-09-21-BOUNDED-RECHECK.json' with {type:'json'};
import policy from '../data/build-review-policy.json' with {type:'json'};
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const selectedReviewInputs=new Map([...evidence.receipts,toronto].map(r=>[r.receipt_id,r]));
/** @param {(typeof reviews.records)[number]} review @param {any} article */
export function validateSelectedArticleReview(review,article,inputs=selectedReviewInputs){
 const {sha256,...body}=review;
 if(hash(body)!==sha256)throw Error(`Selected-review decision drift: ${review.record_id}`);
 if(!article||review.record_id!==article.record_id||review.route!==article.route||review.title!==article.title||hash(article)!==review.source_record_sha256)throw Error(`Selected-review article drift: ${review.record_id}`);
 if(JSON.stringify(review.reviewed_section_hashes)!==JSON.stringify(article.sections.map(s=>({heading:s.heading,sha256:hash(s)})))||review.reviewed_source_notes_sha256!==hash(article.source_notes))throw Error(`Selected-review section drift: ${review.record_id}`);
 for(const input of review.receipt_inputs)if(hash(inputs.get(input.receipt_id)??null)!==input.sha256)throw Error(`Selected-review receipt drift: ${input.receipt_id}`);
 if(review.operating_outcomes_admitted!==false||review.current_external_status_verified!==false||review.original_record_changed!==false)throw Error(`Selected-review boundary invalid: ${review.record_id}`);
 return review;
}
if(reviews.policy_id!==policy.policy_id||policy.human_review_required!==false||reviews.human_review_required!==false||reviews.human_review_claimed!==false||reviews.fresh_external_source_check!==false||reviews.application_projection_integrated!==true)throw Error('Selected-review policy mismatch');
export const selectedArticleReviews=reviews.records.map(r=>validateSelectedArticleReview(r,editorial.records.find(a=>a.record_id===r.record_id)));
export const selectedReviewDate=reviews.decision_date;
export const selectedReviewStatus='AI editorial review accepted with stated limits';
// A named decision applies only to its exact article bytes and designated route.
// Shared subject names, historical/copy routes and changed content inherit none.
/** @param {{record_id:string}} article @param {{route?:string}} options */
export function selectedArticleReviewFor(article,{route}={route:undefined}){
 const review=selectedArticleReviews.find(r=>r.record_id===article?.record_id);
 return review&&route===review.route&&hash(article)===review.source_record_sha256?review:null;
}
