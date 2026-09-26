import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {agencyArtifactChecks as checks,agencyResearchReviews as reviews} from './content-205-216/backlog-agency-reviews.mjs';
import {backlogHash,verifyBacklogInputs} from './lib/backlog-research.mjs';
import {backlogResearchReviews} from './content-205-216/backlog-reviews.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json');
const pins=await json('scripts/content-205-216/backlog-review-inputs.json');
const backlog=await json('src/data/phase-182-evidence-source-backlog.json');
await verifyBacklogInputs(root,pins,backlog,backlogResearchReviews);
assert(ops.backlog_research_checked>=11);
assert.equal(ops.backlog_research_checked+ops.backlog_research_unchecked,25);
assert(ops.backlog_artifact_checks.length>=48);
assert.equal(ops.backlog_authorized_dispositions,25);
assert.equal(ops.governed_series_admitted,0);
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-006']);
assert.equal(checks.length,18);
assert.equal(new Set(checks.map(c=>c.check_id)).size,18);
const priorHashes={
  '182-BACKLOG-001':'8fffa6102c84f9396a78332ae03cfdd523a8d6091da4709194009f8be0a97a72',
  '182-BACKLOG-007':'7a55bdfe3aba4e91827657d6786c1f25a0e82e2ec435fb6ad3458d0b899008c4',
  '182-BACKLOG-008':'0a7002d3d6e9de8ccda7ef878fa74b0c9611d621b48804230f86dc68ec26ea2c',
  '182-BACKLOG-009':'db7591cb54a422abfcf4a69b5831461cbca2051789c7a80a27756ce83ee7d3ff',
  '182-BACKLOG-012':'48b439f12f4f5a6e5791ab685b04959b0aad5ebd51f1260dd01fefad4aa084a4',
  '182-BACKLOG-016':'87506f1b44ba2bf3b69e639468bc13c40a20ec2bd73401733ff3ec4335df37ac',
  '182-BACKLOG-013':'ef0c33b38c3a632e53619d75e0b86b1a26bdafd3d482b3e59dab2d4b65cd598b',
  '182-BACKLOG-017':'af88849a5b318c6738d836548f95d70f2587c8d160c01e0c412a02601d31108e',
  '182-BACKLOG-018':'223483346bb9bedcf7172405853569748548420544bf3089c5321b29f10f88e0',
  '182-BACKLOG-019':'b3771036c4e1bbacd5dd7509174108099ba1d4cce0890f433961292e15b92278'
};
for(const[id,sha]of Object.entries(priorHashes))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Prior research receipt changed');
const current=ops.backlog_reviews.find(r=>r.backlog_item_id==='182-BACKLOG-006');
for(const[key,value]of Object.entries(reviews[0]))assert.deepEqual(current[key],value);
assert.equal(current.checked_date,'2026-09-14');
assert.equal(current.next_check_date,'2026-09-21');
assert.equal(current.human_reviewer,null);assert.equal(current.final_disposition,null);
for(const key of ['human_admission_authorized','publication_authorized','adjudication_complete','phase_60_gate_decision','source_profile_dates_changed'])assert.equal(current[key],false);
assert.deepEqual(current.named_file_ids,[]);
const pin=pins.records.find(r=>r.backlog_item_id===current.backlog_item_id);
assert.equal(pin.inputs.length,10);assert.equal(current.source_ids.length,9);
for(const input of pin.inputs)assert.equal(backlogHash(await read(input.path)),input.sha256);
for(const id of current.source_ids){
  const source=await json(`src/content/sources/${id}.json`);
  assert.equal(source.last_checked_date,'2026-07-24');
  assert(checks.some(c=>c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),'Every bound URL needs its own attempt; alternate copies cannot erase failures');
}
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['oig.nasa.gov','www.oig.dhs.gov','oig.hhs.gov','www.oversight.gov'].includes(new URL(check.url).hostname));
  assert(['Text inspected','Text inspected; visual check unavailable','Retrieval failed'].includes(check.access_result));
  for(const key of ['artifact_date','observation_period','locator','access','evidence_role','finding','limitation'])assert(check[key]?.trim());
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
}
const byId=id=>checks.find(c=>c.check_id===`207-CHECK-${id}`);
assert.equal(checks.filter(c=>c.access_result==='Retrieval failed').length,5);
assert.equal(checks.filter(c=>c.evidence_role==='Exact bound source').length,9);
assert(byId('NASA-FISMA-2022').finding.includes('three operational'));
assert(byId('NASA-FISMA-2023-OFFICIAL-COPY').observation_period.includes('2023-05-31'));
assert(byId('NASA-FISMA-2023-OFFICIAL-COPY').finding.includes('not rounded'));
assert(byId('NASA-FISMA-2023-OFFICIAL-COPY').finding.includes('risk-based Level 3'));
assert(byId('NASA-FISMA-2024-MEMORANDUM').finding.includes('four judgmentally selected'));
assert(byId('DHS-FISMA-2021-OFFICIAL-COPY').finding.includes('component assessment but excluded'));
assert(byId('DHS-FISMA-2022-BOUND').access.includes('403 Forbidden'));
assert(byId('DHS-FISMA-2022-CATALOG').limitation.includes('nor proves their remediation'));
assert(byId('DHS-FISMA-2023-CATALOG').limitation.includes('not certified current closure status'));
assert(byId('HHS-FISMA-2022-PAGE').finding.includes('Closed Unimplemented'));
assert(byId('HHS-FISMA-2023-BRIEF').finding.includes('one staff division'));
const hhs24=byId('HHS-FISMA-2024-PAGE');
for(const text of ['.01 is Closed Superseded (2026-08-24)','.02 Closed Implemented (2025-05-27)','.03 Open Unimplemented','.04 Closed Superseded (2026-05-29)','.05 Open Unimplemented','.06 Closed Implemented (2025-06-17)'])assert(hhs24.finding.includes(text));
assert(hhs24.limitation.includes('Closed Superseded is not Closed Implemented'));
assert(byId('HHS-FISMA-2024-HIGHLIGHTS').limitation.includes('do not contain the later recommendation states'));
const update=await json('src/content/updates/2026-09-14-backlog-research-006.json');
assert.equal(update.receipt_id,current.review_id);assert.equal(update.decision_date,undefined);
assert.equal(update.materiality,'No record-state change');assert.equal(update.source_checked_date,'2026-09-14');
assert.deepEqual(update.affected_record_ids,current.affected_record_ids);
const digest=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/backlog-agency-reviews.mjs','scripts/assert-current-agency-backlog.mjs','src/content/updates/2026-09-14-backlog-research-006.json','../docs/phase-207-agency-research-2026-09-14.md'])assert(digest.artifact_paths.includes(path));
console.log('Agency backlog checks passed: nine exact bound-source attempts, 18 distinct artifact checks, cutoff/method/sample/closure distinctions, failed-access boundaries and ten prior receipts preserved; no ranking, admission or phase completion.');
