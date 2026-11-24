import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {globalCohortDepth,deepenGlobalCohort,validateGlobalIdentity} from './content-205-216/global-cohort-depth.mjs';
import {globalDossiers} from './content-205-216/global-dossiers.mjs';
import {placeDossiers} from './content-205-216/place-dossiers.mjs';
import {readerCatalog} from '../src/lib/reader-catalog.mjs';
import {searchReaders} from '../src/lib/reader-search.mjs';
const read=async path=>JSON.parse(await readFile(new URL(`../${path}`,import.meta.url),'utf8'));
const corpus=await read('src/data/phase-205-216-current-editorial.json');
const projects=await read('src/data/phase-191-international-named-project-conversion-cohort.json');
const places=await read('src/data/phase-192-global-place-systems-atlas.json');
const originals=new Map([...projects.project_conversion_packets.map(r=>[r.international_project_packet_id,r]),...places.place_system_dossiers.map(r=>[r.global_place_dossier_id,r])]);
const ids=Object.keys(globalCohortDepth);assert.equal(ids.length,4);
assert.equal(corpus.records.filter(r=>ids.includes(r.record_id)&&r.identity_evidence).length,4);
let sourceNotes=0,languageNotes=0;
for(const id of ids){
  const expected=globalCohortDepth[id],article=corpus.records.find(r=>r.record_id===id),original=originals.get(id);
  assert(article&&original);
  assert.equal(article.approved,false);assert.match(article.review_status,/independent review pending/);
  validateGlobalIdentity(article,original);
  assert.equal(original[id.startsWith('191-')?'project_name':'place_name'],null,'Historical acquisition docket was silently promoted');
  assert.equal(original.current_stage_snapshot,null);
  assert.deepEqual(article.sections,expected.sections,'Cited global paragraphs dropped by generation');
  assert.deepEqual(article.identity_evidence,expected.identity_evidence);
  assert.deepEqual(article.language_notes,expected.language_notes);
  assert.deepEqual(article.source_notes,expected.source_notes);
  assert.deepEqual(article.sources,expected.sources.map(([title,url,artifact_date])=>({title,url,artifact_date})));
  assert(article.sections.length>=6);assert(article.sources.length>=4);
  assert.equal(new Set(article.sources.map(s=>s.url)).size,article.sources.length);
  assert.deepEqual(article.source_notes.map(n=>n.source_index),article.sources.map((_,i)=>i));
  for(const note of article.source_notes){assert.equal(note.checked_date,'2026-09-14');assert(note.locator&&note.scope&&note.access);sourceNotes++;}
  for(const source of article.sources)assert.equal(new URL(source.url).protocol,'https:');
  for(const section of article.sections){
    for(const index of section.citations)assert(article.sources[index]);
    for(const paragraph of section.paragraphs){assert(paragraph.text.startsWith('FTFN interpretation:'));assert.deepEqual(paragraph.citations,[]);}
  }
  for(const note of article.language_notes){assert(['fr','ja'].includes(note.lang));assert(article.sources[note.source_index]);assert.match(note.review_status,/pending/);languageNotes++;}
  for(const field of ['chronology','dependencies','adverse','next'])assert.equal(article[field],undefined,'Replaced prose survived as stale export fields');
  assert.throws(()=>validateGlobalIdentity(article,{...original,current_stage_snapshot:'Unreviewed change'}),/Historical identity changed/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,reviewer:'Invented reviewer'}},original),/cannot invent/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,decision_receipt:'Invented decision'}},original),/cannot issue/);
  assert.throws(()=>validateGlobalIdentity({...article,identity_evidence:{...article.identity_evidence,matched_source_indices:[0,999]}},original),/Unbound identity/);
}
assert.equal(sourceNotes,18);assert.equal(languageNotes,10);
assert.equal(new Set(ids.flatMap(id=>globalCohortDepth[id].sources.map(s=>s[1]))).size,12);
const merged=[...globalDossiers,...placeDossiers];
for(const record of deepenGlobalCohort([...merged].reverse()))assert.deepEqual(record,merged.find(r=>r.record_id===record.record_id));
assert.equal(globalDossiers.length,8);assert.equal(placeDossiers.length,4);
assert(globalDossiers.filter(r=>r.jurisdiction!=='United States').length>=4);
assert(new Set(globalDossiers.map(r=>r.region)).size>=3);
const fr=corpus.records.find(r=>r.record_id==='192-PLACE-006'),ja=corpus.records.find(r=>r.record_id==='192-PLACE-010');
for(const term of ['885','9,068','2023','suppressed'])assert(JSON.stringify(fr.sections).includes(term));
for(const term of ['52,176','51,193','23,834','2020','2025'])assert(JSON.stringify(ja.sections).includes(term));
assert(searchReaders(readerCatalog,'那珂市','Place').some(r=>r.id==='192-PLACE-010'));
assert(searchReaders(readerCatalog,'COG 13099','Place').some(r=>r.id==='192-PLACE-006'));
assert(searchReaders(readerCatalog,'INB 174','Project').some(r=>r.id==='191-PROJECT-012'));
const update=await read('src/content/updates/2026-09-14-global-cohort-depth.json');
assert.deepEqual(update.affected_record_ids,ids);
for(const id of ids)assert(update.related_paths.includes(corpus.records.find(r=>r.record_id===id).route));
assert.match(update.publication_effect,/held/);
assert.equal(projects.counts.exact_named_project_anchors,4);assert.equal(places.counts.exact_place_anchors,3);
console.log('Global source-level checks passed: 4 unchanged acquisition identities, 12 distinct exact sources, 18 source notes, 10 language notes, complete paragraph/citation generation, searchable aliases and negative promotion/drift tests. Independent acceptance remains pending.');
