import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {parseFrontmatter} from '@astrojs/markdown-remark';
import {readShelfInputs,shelfFrontmatter} from './lib/read-shelf-inputs.mjs';
import {createShelfData} from '../src/lib/shelf-data.mjs';
import {projectBriefing} from '../src/lib/reference-attribution.mjs';
import {searchShelf} from '../src/lib/shelf-search.mjs';
import {goldenMarsBriefingReview as review,goldenMarsBriefingContext as context,projectGoldenMarsBriefingData as project,projectGoldenMarsBriefingBody as body} from '../src/lib/golden-mars-briefing-review.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex'),at=(d,p)=>p.reduce((v,k)=>v[k],d);
let fields=0,paragraphs=0;
const beforeReview=JSON.stringify(review);
for(const record of review.records){
  const raw=await readFile(new URL('../'+record.source_file,import.meta.url),'utf8');
  assert.equal(hash(raw),record.source_sha256);
  const front=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);const original=parseFrontmatter(raw).frontmatter,before=JSON.stringify(original);
  const current=project(original),restored=structuredClone(current);
  assert.deepEqual(projectBriefing({data:original}).data,current);
  assert.deepEqual(shelfFrontmatter(raw).top_takeaways,original.top_takeaways);
  assert.deepEqual(shelfFrontmatter(raw).what_to_watch_next,original.what_to_watch_next);
  assert.equal(JSON.stringify(original),before);assert.deepEqual(project(current),current);
  assert.equal(project(original,'2026-09-22'),original);
  for(const key of ['slug','record_status'])assert.throws(()=>project({...original,[key]:'wrong'}),/identity drift/);
  for(const c of record.changes){
    fields++;assert.equal(at(current,c.path),c.current);const parent=c.path.length===1?restored:at(restored,c.path.slice(0,-1));parent[c.path.at(-1)]=c.prior;
    const drift=structuredClone(original);(c.path.length===1?drift:at(drift,c.path.slice(0,-1)))[c.path.at(-1)]='wrong';assert.throws(()=>project(drift),/wording drift/);
    assert(['summary','top_takeaways','what_to_watch_next'].includes(c.path[0]));
  }
  assert.deepEqual(restored,original);
  const view=body(record.id,raw);assert.equal(body(record.id,raw,'2026-09-22'),null);
  if(record.body_replacements.length){
    let restoredBody=view.current;
    for(const c of [...record.body_replacements].reverse()){paragraphs++;assert(view.current.includes(c.current));restoredBody=restoredBody.replace(c.current,c.prior);}
    assert.equal(restoredBody,view.original);
    const driftedBody=front[0]+raw.slice(front[0].length).replace(record.body_replacements[0].prior,'unexpected edit');
    assert.throws(()=>body(record.id,driftedBody),/paragraph drift/);
    assert.throws(()=>body(record.id,raw.replace('id: "'+record.id+'"','id: "wrong"')),/identity drift/);
    assert.throws(()=>body(record.id,raw+'\nexport const forbidden = true;'),/ordinary Markdown/);
  }else{assert.equal(view,null);assert(record.context_note);assert.equal(current,original);}
  const note=context(record.id);assert.equal(note.source_check_date,'2026-09-22');assert.equal(note.review_date,'2026-09-23');
  assert.equal(hash(JSON.stringify(note.source_checks)),'99a14f6598f8e8c76e4a806179cdf0fb23e26c2bdcc36e48c091aff1c32b75b2');
  assert.equal(note.independent_review,false);assert.equal(note.approval_receipt_id,null);assert.equal(context(record.id,'2026-09-22'),null);
}
assert.equal(fields,6);assert.equal(paragraphs,10);assert.equal(JSON.stringify(review),beforeReview);
const unrelated={id:'unrelated'};assert.equal(project(unrelated),unrelated);assert.equal(body(unrelated.id,'anything'),null);assert.equal(context(unrelated.id),null);
for(const date of ['September 23','2026-02-30']){assert.throws(()=>project(unrelated,date),/ISO calendar date/);assert.throws(()=>context(unrelated.id,date),/ISO calendar date/);assert.throws(()=>body(unrelated.id,'anything',date),/ISO calendar date/);}


const app=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,app),'utf8');
const inputs=await readShelfInputs(fileURLToPath(app)),beforeInputs=JSON.stringify(inputs);
const classification=JSON.parse(await read('src/data/phase-206-editorial-classification.json'));
const operations=JSON.parse(await read('src/data/phase-207-current-operations.json'));
const shelves=createShelfData(inputs,classification,operations).shelves;
assert.equal(JSON.stringify(inputs),beforeInputs);
const ids=new Set(review.records.map(r=>r.id));let unchanged=0,summaryCards=0;
for(const data of inputs.briefings)if(!ids.has(data.id)){assert.equal(project(data),data);assert.equal(context(data.id),null);unchanged++;}
assert.equal(unchanged,inputs.briefings.length-8);
for(const rows of Object.values(shelves))for(const card of rows){
  const record=review.records.find(r=>r.id===card.id);
  const summary=record?.changes.find(c=>c.path[0]==='summary');
  if(summary){assert.equal(card.summary,summary.current);summaryCards++;}
}
assert(summaryCards>0);
assert(searchShelf(shelves.briefings,{q:'located Golden-Mars Route 3A'}).some(r=>r.id==='briefing-acceptance-dossier-003-northern-virginia-large-load'));
const update=JSON.parse(await read('src/content/updates/2026-09-23-golden-mars-briefing-followthrough.json'));
assert.equal(update.id,review.update_id);assert.equal(update.receipt_id,review.review_id);assert.equal(update.effective_date,review.review_date);
assert.deepEqual(update.affected_record_ids,review.records.map(r=>r.id));
for(const record of review.records)assert(update.related_paths.includes(record.route));
const oldWider=JSON.parse(await read('src/data/golden-mars-wider-review.json'));
assert.equal(oldWider.records.length,7);
console.log('Golden-Mars briefing source checks passed: eight original files, six fields, ten body changes, four context-only methods, exact retained sources, '+summaryCards+' current summary cards and '+unchanged+' unaffected briefings. No evidence state, dates or review authority changed.');
