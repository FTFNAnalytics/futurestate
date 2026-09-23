import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const corpus=await read('src/data/phase-205-216-current-editorial.json');
const ids=['195-BRIEF-054','195-BRIEF-067','195-BRIEF-051','195-BRIEF-027','195-BRIEF-039'];
const expectedSourceCounts=[2,3,2,3,2];
const articles=ids.map(id=>corpus.records.find(r=>r.record_id===id));

function assertBoundary(article,count){
  assert.equal(article.kind,'Question');
  assert.equal(article.authored_date,'2026-09-14');
  assert.equal(article.updated_date,'2026-09-22');
  assert.equal(article.approved,false);
  assert.match(article.review_status,/independent review pending/);
  assert.match(article.source_check_boundary,/September 22/);
  assert.match(article.source_check_boundary,/independent/);
  assert.equal(article.sources.length,count);
  assert.deepEqual(article.source_notes.map(n=>n.source_index),Array.from({length:count},(_,i)=>i));
  for(const note of article.source_notes){
    assert.equal(note.checked_date,'2026-09-22');
    assert(note.locator.length>25&&note.scope.length>60&&note.access.length>25);
  }
}
for(const [i,article]of articles.entries()){
  assertBoundary(article,expectedSourceCounts[i]);
  const card=readerCatalog.find(r=>r.id===article.record_id);
  assert.equal(card.title,article.title);assert.equal(card.summary,article.answer);assert.equal(card.date,article.updated_date);
  assert.throws(()=>assertBoundary({...article,approved:true},expectedSourceCounts[i]));
  assert.throws(()=>assertBoundary({...article,authored_date:'2026-09-22'},expectedSourceCounts[i]));
  assert.throws(()=>assertBoundary({...article,source_notes:article.source_notes.slice(1)},expectedSourceCounts[i]));
}
const [nnsa,hanford,amtrak,minerals,battery]=articles;
assert.match(nnsa.title,/pit-production/);
for(const value of ['Recommendation 1','GAO-23-104661','Recommendation 3','GAO-20-703','Open'])assert(nnsa.answer.includes(value));
for(const value of ['April 2026','December 2026','fiscal 2026','September 10'])assert(nnsa.detail.includes(value));
for(const [a,id]of [[nnsa,'receipt-60-nnsa-2026-09-10-no-material-change'],[hanford,'receipt-60-hanford-2026-09-10-no-material-change'],[amtrak,'receipt-60-pids-2026-09-10-no-material-change']])assert.deepEqual(a.receipt_ids,[id]);
for(const value of ['38,412.1','163,718.5','119 containers','7,274','September meeting','June data','opening/closing inventories','no efficiency'])assert(hanford.detail.includes(value));
assert.match(hanford.source_notes[1].locator,/printed pages 22–23 \(PDF pages 23–24\)/);
assert.match(hanford.source_notes[2].locator,/printed pages 13–14 \(PDF pages 16–17\)/);
function assertAmtrakAccess(article){
  assert.match(article.source_check_boundary,/text-only/);
  assert.match(article.source_check_boundary,/HTTP 403/);
  assert.match(article.source_check_boundary,/visual table verification remains pending/);
  assert(article.source_notes.every(n=>/Web-extracted PDF text/.test(n.access)));
  assert.match(article.detail,/page-image verification remains pending/);
}
assertAmtrakAccess(amtrak);
assert.throws(()=>assertAmtrakAccess({...amtrak,source_check_boundary:'Full visual inspection complete'}));
for(const value of ['November 1, 2025–April 30, 2026','May 1, 2025–April 30, 2026','93 as deployments','117 as installations','reconciliation crosswalk','March 31','May 31'])assert(amtrak.detail.includes(value));
for(const value of ['archived','October 2024','Phase 1 and Phase 2','accepted','no investment recommendation'])assert(minerals.detail.includes(value));
assert.match(minerals.source_notes[1].locator,/printed page 25/);
assert.match(battery.source_check_boundary,/match the retained September 15 capture/);
for(const value of ['June 14–December 14, 2020','Table 3-1','Section 6.2','Operating Protocol','eligible/available interval ledger','without calling them admitted'])assert(battery.detail.includes(value));
assert.equal(battery.source_project,'191-PROJECT-005');

const update=await read('src/content/updates/2026-09-22-remaining-answer-source-review.json');
assert.deepEqual(update.affected_record_ids,ids);
assert.equal(update.effective_date,'2026-09-22');
assert.equal(update.receipt_id,'209-ANSWER-BOUNDARIES-2026-09-22');
assert.deepEqual(update.related_paths.slice().sort(),[...articles.map(a=>a.route),'/reference/explore/1/','/data/current-editorial.json','/data/reader-catalog.json'].sort());
assert.match(update.evidence_note,/Amtrak.*text-only/);
assert.match(update.publication_effect,/independent review, measurement admission and release remain held/);
const questions=corpus.records.filter(r=>r.kind==='Question');
assert.equal(questions.length,12);assert(questions.every(q=>q.updated_date==='2026-09-22'&&q.approved===false));
console.log('Remaining-answer source checks passed: five stable identities, twelve exact source notes, original gate receipts, distinct source/reporting periods, explicit Amtrak visual-access gap and no measurement admission. All twelve questions have dated assisted passes; independent approval remains absent.');
