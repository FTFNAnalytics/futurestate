import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import data from '../src/data/selected-article-ai-reviews.json' with {type:'json'};
import corpus from '../src/data/phase-205-216-current-editorial.json' with {type:'json'};
import {selectedArticleReviews,selectedArticleReviewFor,selectedReviewInputs,selectedReviewDate,selectedReviewStatus,validateSelectedArticleReview} from '../src/lib/selected-article-reviews.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
const hash=v=>createHash('sha256').update(v).digest('hex');
const preparedRaw=await readFile(new URL(`../../${data.preparation_artifact.path}`,import.meta.url),'utf8'),prepared=JSON.parse(preparedRaw);
assert.equal(hash(preparedRaw),data.preparation_artifact.sha256);
assert.deepEqual(data.records,prepared.records);
assert.equal(prepared.application_projection_integrated,false);assert.equal(data.application_projection_integrated,true);
assert.equal(data.reviewed_articles,4);assert.equal(data.remaining_selected_articles,29);
assert.equal(corpus.records.length-data.records.length,data.remaining_selected_articles);
assert.deepEqual(selectedArticleReviews.map(r=>r.record_id),['119-PROJECT-001','191-PROJECT-001','195-BRIEF-047','195-BRIEF-057']);
for(const r of selectedArticleReviews){
 const article=corpus.records.find(a=>a.record_id===r.record_id),card=readerCatalog.find(c=>c.id===r.record_id);
 assert.equal(article.approved,false);assert(article.review_status.includes('independent review pending'));
 assert.equal(selectedArticleReviewFor(article,{route:r.route}),r);
 assert.equal(selectedArticleReviewFor(article,{route:r.route+'copy/'}),null);
 assert.equal(selectedArticleReviewFor(article),null);
 assert.equal(selectedArticleReviewFor({...article,answer:'Changed'},{route:r.route}),null);
 assert.equal(card.status,selectedReviewStatus);assert.equal(card.date,selectedReviewDate);assert.equal(card.summary,article.answer);
 for(const field of ['operating_outcomes_admitted','current_external_status_verified','original_record_changed']){
  const {sha256,...body}=r,bad={...body,[field]:true};bad.sha256=hash(JSON.stringify(bad));
  assert.throws(()=>validateSelectedArticleReview(bad,article),/boundary invalid/);
 }
 assert.throws(()=>validateSelectedArticleReview(r,{...article,answer:'Changed'}),/article drift/);
 const {sha256,...body}=r,bad={...body,route:'/copied-article/'};bad.sha256=hash(JSON.stringify(bad));
 assert.throws(()=>validateSelectedArticleReview(bad,article),/article drift/);
 for(const input of r.receipt_inputs){const changed=new Map(selectedReviewInputs);changed.set(input.receipt_id,{...changed.get(input.receipt_id),bounded_finding:'Changed'});assert.throws(()=>validateSelectedArticleReview(r,article,changed),/receipt drift/);}
}
for(const article of corpus.records.filter(a=>!data.records.some(r=>r.record_id===a.record_id))){
 assert.equal(selectedArticleReviewFor(article,{route:article.route}),null);
 assert.equal(readerCatalog.find(c=>c.id===article.record_id).status,article.review_status);
}
console.log('Selected-article AI assertions passed: four exact authored decisions, complete article/section/source-note/receipt pins, preserved historical fields, designated routes only, and rejected stale inputs, copied routes and fabricated operating/source-review claims. 29 selected assessments remain.');
