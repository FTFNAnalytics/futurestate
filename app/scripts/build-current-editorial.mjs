import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { v1refPhaseDefinitions } from './lib/v1ref-config.mjs';
import { collectPrimaryRecords, recordId, canonicalRecordSlug } from './lib/v1ref-records.mjs';
import { thinTopicEditions } from './content-205-216/thin-topic-editions.mjs';
import { globalDossiers } from './content-205-216/global-dossiers.mjs';
import { validateGlobalIdentity } from './content-205-216/global-cohort-depth.mjs';
import { questionAnswers } from './content-205-216/question-answers.mjs';
import { placeDossiers } from './content-205-216/place-dossiers.mjs';
import { validateRetainedPlaceReceipt } from './content-205-216/place-system-depth.mjs';
import { validateRetainedCycleReceipt } from './content-205-216/project-stage-depth.mjs';
import { casebooks } from './content-205-216/casebooks.mjs';
import { fieldReport } from './content-205-216/field-report.mjs';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = join(appRoot,'src/data');
const read = async path => JSON.parse(await readFile(path,'utf8'));
const retainedProjectReceipts=(await read(join(dataRoot,'phase-207-current-operations.json'))).receipts;
const retainedCycleReceipts=(await read(join(dataRoot,'phase-60-current-decisions.json'))).receipts;
const byId = new Map();
for(const def of v1refPhaseDefinitions) {
  const registry = await read(join(dataRoot,def.file));
  for(const record of collectPrimaryRecords(registry)) {
    const sourceRecord=(registry.project_conversion_packets??registry.place_system_dossiers??[]).find(candidate=>recordId(candidate)===recordId(record))??record;
    byId.set(recordId(record), {record,sourceRecord,route:`/reference/${def.section}/${canonicalRecordSlug(record,registry)}/`});
  }
}
const atlas = await read(join(dataRoot,'phase-119-deep-project-place-atlas.json'));
for(const p of atlas.projects) byId.set(p.atlas_project_id,{record:p,route:`/atlas/projects/${p.slug}/`});
const records=[];
byId.set('212-REPORT-001',{record:{title:'September 14 selected field edition — new editorial identity'},route:'/reference/field-report/2026-09-14/'});
const makeSources = sources => sources.map(([title,url,artifact_date])=>({title,url,artifact_date}));
const add = article => {
  const binding=byId.get(article.record_id);
  assert(binding, `Unresolved identity ${article.record_id}`);
  if(article.identity_evidence) validateGlobalIdentity(article,binding.sourceRecord??binding.record);
  validateRetainedPlaceReceipt(article,retainedProjectReceipts);
  validateRetainedCycleReceipt(article,retainedCycleReceipts);
  records.push({...article, route:binding.route, authored_date:'2026-09-14', review_status:'Editorial draft — independent review pending', approved:false, source_check_boundary:'Source notes distinguish September 14–15 review, inherited September 10 receipts and remaining retrieval gaps. This is not a blanket refresh of the corpus.', historical_record_title:binding.record.title??binding.record.question??binding.record.project_name??binding.record.place_name, sha256:createHash('sha256').update(JSON.stringify(article)).digest('hex')});
};
for(const t of thinTopicEditions) {
  const binding=[...byId].find(([id,{record}])=>id.startsWith('184-TOPIC-')&&record.slug===t.slug);
  assert(binding,`Missing topic ${t.slug}`);
  add({...t,record_id:binding[0],kind:'Topic',sources:makeSources(t.sources)});
}
for(const p of globalDossiers) add({...p,sources:makeSources(p.sources),sections:p.sections??[{heading:'Chronology and identity',text:p.chronology,citations:p.sources.map((_,i)=>i)},{heading:'Dependencies and receiving system',text:p.dependencies,citations:[]},{heading:'Adverse evidence and limits',text:p.adverse,citations:p.sources.map((_,i)=>i)},{heading:'Next decisive record',text:p.next,citations:[]}]});
for(const p of placeDossiers) {
  const project=globalDossiers.find(x=>x.record_id===p.source_project);assert(project);
  add({...p,kind:'Place',sources:makeSources(p.sources??project.sources),sections:p.sections.map(s=>({...s,citations:s.citations??[]}))});
}
for(const q of questionAnswers) {
  const sourceOwner = q.source_topic ? thinTopicEditions.find(t=>t.slug===q.source_topic) : globalDossiers.find(p=>p.record_id===q.source_project);
  const sources=q.sources??sourceOwner?.sources; assert(sources?.length,`Missing question sources ${q.record_id}`);
  add({...q,kind:'Question',sources:makeSources(sources),sections:[{heading:'What the evidence establishes',text:q.detail,citations:sources.map((_,i)=>i)},{heading:'What would change this answer',text:q.next,citations:[]},{heading:'Scope of this answer',text:'This is a named-case answer under a broader existing research question. It does not resolve every entity or jurisdiction covered by that question. Independent editorial/subject acceptance is pending.',citations:[]}]});
}
for(const c of casebooks) add({...c,sources:makeSources(c.sources)});
add({...fieldReport,sources:makeSources(fieldReport.sources)});
assert.equal(records.length,33);assert.equal(new Set(records.map(x=>x.record_id)).size,33);
const asOfDate=records.map(r=>r.updated_date??r.authored_date).sort().at(-1);
await writeFile(join(dataRoot,'phase-205-216-current-editorial.json'),JSON.stringify({schema_version:'1.0',as_of_date:asOfDate,publication_state:'Local drafts; independent review and release held',counts:{topics:4,projects:8,places:4,questions:12,casebooks:4,reports:1,independently_approved:0},records},null,2)+'\n');
console.log('Built 32 existing-identity reader additions plus a selected field-report edition. No independent approval or release inferred.');
