import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {thinTopicEditions} from './content-205-216/thin-topic-editions.mjs';
import {deepenThinTopics} from './content-205-216/thin-topic-case-depth.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const corpus=await read('src/data/phase-205-216-current-editorial.json');
const topics=corpus.records.filter(r=>r.kind==='Topic');
const ids={'climate':'184-TOPIC-006','agriculture-and-bioeconomy':'184-TOPIC-002','quantum':'184-TOPIC-015','discovery-technologies':'184-TOPIC-009'};
assert.equal(topics.length,4);
const caseIds=[];
for(const draft of thinTopicEditions){
  const article=topics.find(r=>r.record_id===ids[draft.slug]);assert(article);
  assert.deepEqual(article.sections,draft.sections,'Generated topic silently omitted case text');
  assert.deepEqual(article.source_notes,draft.source_notes,'Generated topic omitted source appendix');
  assert.equal(article.approved,false);assert.match(article.review_status,/independent review pending/);
  assert.equal(new Set(article.sources.map(s=>s.url)).size,article.sources.length);
  assert(article.sources.length>=3);
  const cases=article.sections.filter(s=>s.case_id);assert.equal(cases.length,2);
  assert.deepEqual(article.source_notes.map(n=>n.source_index).sort((a,b)=>a-b),article.sources.map((_,i)=>i));
  for(const source of article.sources)assert(source.title&&source.artifact_date&&new URL(source.url).protocol==='https:');
  for(const note of article.source_notes){assert.equal(note.checked_date,'2026-09-14');assert(note.locator.length>20&&note.scope.length>40&&note.access.length>15);}
  for(const section of article.sections){
    for(const index of section.citations??[])assert(article.sources[index]);
    for(const p of section.paragraphs??[]){
      assert(p.text.length>200);
      assert(p.citations.length||p.text.startsWith('FTFN interpretation:'));
      for(const index of p.citations)assert(article.sources[index]);
    }
  }
  for(const c of cases){
    caseIds.push(c.case_id);assert.equal(c.paragraphs.length,2);
    // Regression floor only, not a substitute for factual or subject acceptance.
    assert([c.text,...c.paragraphs.map(p=>p.text)].join(' ').split(/\s+/).length>=200);
    assert(c.citations.length>0&&c.paragraphs[0].citations.length>0);
    assert(c.paragraphs[1].text.startsWith('FTFN interpretation:'));
  }
}
assert.deepEqual(caseIds.sort(),Array.from({length:8},(_,i)=>`209-CASE-${String(i+1).padStart(3,'0')}`));
const reversed=deepenThinTopics([...thinTopicEditions].reverse());
for(const r of reversed)assert.deepEqual(r.sections.filter(s=>s.case_id).map(s=>s.case_id),thinTopicEditions.find(t=>t.slug===r.slug).sections.filter(s=>s.case_id).map(s=>s.case_id),'Case IDs must not depend on edition ordering');
assert.throws(()=>deepenThinTopics([{slug:'unrecognized',sections:[]}]),/Missing topic/);
assert.throws(()=>deepenThinTopics([{slug:'climate',sections:[]}]),/two distinct cases/);
const quantum=topics.find(t=>t.slug==='quantum');
assert(quantum.sources.some(s=>s.url==='https://arxiv.org/abs/2404.02280v3'));
assert(quantum.sources.some(s=>s.url==='https://www.nature.com/articles/s41586-026-10559-8'));
assert(JSON.stringify(quantum.sections).includes('post-selection'));
assert(JSON.stringify(quantum.sections).includes('teleportation baseline'));
assert(JSON.stringify(quantum.sections).includes('Figure 3a'));
const discovery=topics.find(t=>t.slug==='discovery-technologies');
assert(discovery.sources[2].artifact_date.includes('2026-08-25'));
assert(!discovery.sources[2].artifact_date.includes('2026-08-27'));
for(const [file,required]of [
  ['2026-09-14-thin-topic-case-depth',Object.values(ids)],
  ['2026-09-14-quantum-version-correction',['184-TOPIC-015','195-BRIEF-057']],
  ['2026-09-14-dss23-source-date-correction',['184-TOPIC-009','195-BRIEF-033']]
]){const update=await read(`src/content/updates/${file}.json`);assert.deepEqual(update.affected_record_ids,required);assert.match(update.publication_effect,/held/);}
const answer=corpus.records.find(r=>r.record_id==='195-BRIEF-057');assert(JSON.stringify(answer.sections).includes('post-selection'));assert(answer.sources.some(s=>s.url.endsWith('2404.02280v3')));
assert(JSON.stringify(corpus.records.find(r=>r.record_id==='195-BRIEF-033').sections).includes('August 25'));
console.log('Thin-topic source-level checks passed: 4 editions, 8 stable expanded cases, 13 source-location notes, complete paragraphs/citations, exact version/date corrections, independent acceptance still pending.');
