import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {projectStageDepth,deepenProjectStages,validateRetainedCycleReceipt} from './content-205-216/project-stage-depth.mjs';
import {validateGlobalIdentity} from './content-205-216/global-cohort-depth.mjs';
import {validateRetainedPlaceReceipt} from './content-205-216/place-system-depth.mjs';
import {globalDossiers} from './content-205-216/global-dossiers.mjs';
const read=async name=>JSON.parse(await readFile(new URL(`../${name}`,import.meta.url),'utf8'));
const corpus=await read('src/data/phase-205-216-current-editorial.json');
const atlas=await read('src/data/phase-119-deep-project-place-atlas.json');
const registry=await read('src/data/phase-191-international-named-project-conversion-cohort.json');
const operations=await read('src/data/phase-207-current-operations.json');
const cycle=await read('src/data/phase-60-current-decisions.json');
const originals=new Map([...atlas.projects.map(r=>[r.atlas_project_id,r]),...registry.project_conversion_packets.map(r=>[r.international_project_packet_id,r])]);
const ids=Object.keys(projectStageDepth);assert.equal(ids.length,6);
assert.equal(corpus.as_of_date,'2026-09-15');
assert.equal(corpus.records.filter(r=>r.kind==='Project'&&r.sections.length>=6).length,8);
assert.equal(corpus.records.filter(r=>r.kind==='Place'&&r.sections.length>=6).length,4);
let noteCount=0;
for(const id of ids){
  const expected=projectStageDepth[id],article=corpus.records.find(r=>r.record_id===id),original=originals.get(id);
  assert(article&&original);assert.equal(article.approved,false);assert.equal(article.updated_date,'2026-09-15');
  validateGlobalIdentity(article,original);
  if(id!=='191-PROJECT-001')assert.equal(article.identity_evidence.identifier,null,'Internal registry ID must not be presented as an official identifier');
  assert.deepEqual(article.sections,expected.sections);assert.deepEqual(article.source_notes,expected.source_notes);
  assert.deepEqual(article.sources,expected.sources.map(([title,url,artifact_date])=>({title,url,artifact_date})));
  assert.equal(article.sections.length,6);assert(article.sources.length>=2);
  assert.deepEqual(article.source_notes.map(n=>n.source_index),article.sources.map((_,i)=>i));
  assert.equal(new Set(article.sources.map(s=>s.url)).size,article.sources.length);
  for(const n of article.source_notes){assert.equal(n.checked_date,'2026-09-15');assert(n.locator&&n.scope&&n.access);noteCount++;}
  for(const source of article.sources)assert.equal(new URL(source.url).protocol,'https:');
  for(const s of article.sections){for(const index of s.citations)assert(article.sources[index]);for(const p of s.paragraphs){assert(p.text.startsWith('FTFN interpretation:'));assert.deepEqual(p.citations,[]);}}
  for(const field of ['chronology','dependencies','adverse','next'])assert.equal(article[field],undefined,'Stale project prose survived export');
  assert.throws(()=>validateGlobalIdentity(article,{...original,unreviewed_change:true}),/Historical identity changed/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,reviewer:'invented'}},original),/cannot invent/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,candidate_name:'different project'}},original),/cannot be renamed/);
}
assert.equal(noteCount,16);
assert.deepEqual(deepenProjectStages(globalDossiers),globalDossiers,'Depth overlay is not idempotent');
const toronto=corpus.records.find(r=>r.record_id==='191-PROJECT-001');
validateRetainedPlaceReceipt(toronto,operations.receipts);
assert.throws(()=>validateRetainedPlaceReceipt(toronto,[]),/Missing retained/);
assert.throws(()=>validateRetainedPlaceReceipt(toronto,operations.receipts.map(r=>({...r,current_stage:'fabricated advancement'}))),/receipt changed/);
const hanford=corpus.records.find(r=>r.record_id==='119-PROJECT-022');
validateRetainedCycleReceipt(hanford,cycle.receipts);
assert.throws(()=>validateRetainedCycleReceipt(hanford,[]),/Missing retained/);
assert.throws(()=>validateRetainedCycleReceipt(hanford,cycle.receipts.map(r=>({...r,decision_status:'closed'}))),/receipt changed/);
assert.throws(()=>validateRetainedCycleReceipt(hanford,cycle.receipts.map(r=>({...r,cycle_item_id:'different-gate'}))),/identity changed/);
assert.equal(cycle.receipts.find(r=>r.receipt_id===hanford.retained_cycle_receipt.receipt_id).next_check_date,'2026-10-09');
assert.equal(operations.pilot_reviews.find(p=>p.pilot_id==='160-PILOT-002').amendment.issuer_correction_claimed,false);
assert.equal(operations.governed_series_admitted,0);
const tsmc=corpus.records.find(r=>r.record_id==='195-BRIEF-017');
assert.match(tsmc.answer,/requests authority/);assert.match(tsmc.detail,/does not independently re-certify/);
const update=await read('src/content/updates/2026-09-15-project-stage-depth.json');
assert.equal(update.effective_date,'2026-09-15');
for(const id of [...ids,'195-BRIEF-017','195-BRIEF-053','195-BRIEF-067','195-BRIEF-039']){
  assert(update.affected_record_ids.includes(id));assert(update.related_paths.includes(corpus.records.find(r=>r.record_id===id).route));
}
assert.equal(corpus.records.length,33);assert.equal(corpus.counts.independently_approved,0);
console.log('Project depth checks passed: six expanded dossiers / 36 sections / 16 source notes; all eight projects and four places expanded; historical identities and Toronto/Hanford receipts pinned; adverse evidence and zero admissions retained.');
