import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {secondCohortArtifactChecks as checks,secondCohortResearchReviews as reviews} from './content-205-216/backlog-second-cohort-reviews.mjs';
import {backlogHash,verifyBacklogInputs} from './lib/backlog-research.mjs';
import {backlogResearchReviews} from './content-205-216/backlog-reviews.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json');
const pins=await json('scripts/content-205-216/backlog-review-inputs.json');
await verifyBacklogInputs(root,pins,await json('src/data/phase-182-evidence-source-backlog.json'),backlogResearchReviews);
assert(ops.backlog_research_checked>=23);
assert.equal(ops.backlog_research_checked+ops.backlog_research_unchecked,25);
assert(ops.backlog_artifact_checks.length>=189);
assert.equal(ops.backlog_authorized_dispositions,0);
assert.equal(ops.governed_series_admitted,0);
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-020','182-BACKLOG-021']);
assert.equal(checks.length,31);assert.equal(new Set(checks.map(c=>c.check_id)).size,31);
assert.equal(checks.filter(c=>c.evidence_role==='Exact bound source').length,24);
assert.equal(checks.filter(c=>c.evidence_role==='Official linked report').length,7);
assert.equal(checks.filter(c=>c.access_result==='Text inspected; visual check unavailable').length,14);
assert.equal(checks.filter(c=>c.access_result==='Text inspected').length,17);
for(const[id,sha]of Object.entries({
  '182-BACKLOG-004':'41b6264e1b442275a471963a2f2563ce27dd6a61cb174814699591d67cd6b72a',
  '182-BACKLOG-005':'acc94f2cb5d03a97ded2e1004354d339392b217ef82d5605887d31c2e4761e6e'
}))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Earlier program/transport receipt changed');
const used=new Set();
for(const review of reviews){
  const current=ops.backlog_reviews.find(r=>r.backlog_item_id===review.backlog_item_id);
  for(const[key,value]of Object.entries(review))assert.deepEqual(current[key],value);
  assert.equal(current.checked_date,'2026-09-14');assert.equal(current.next_check_date,'2026-09-21');
  assert.equal(current.human_reviewer,null);assert.equal(current.final_disposition,null);
  for(const key of ['human_admission_authorized','publication_authorized','adjudication_complete','phase_60_gate_decision','source_profile_dates_changed'])assert.equal(current[key],false);
  assert.deepEqual(current.named_file_ids,[]);
  const pin=pins.records.find(r=>r.backlog_item_id===current.backlog_item_id);
  assert.equal(current.source_ids.length,12);assert.equal(pin.inputs.length,13);
  for(const input of pin.inputs)assert.equal(backlogHash(await read(input.path)),input.sha256);
  for(const id of current.check_ids){
    used.add(id);
    assert(checks.find(c=>c.check_id===id)?.source_ids.some(source=>current.source_ids.includes(source)),'Unrelated artifact assigned');
  }
  for(const id of current.source_ids){
    const source=await json(`src/content/sources/${id}.json`);
    assert.equal(source.last_checked_date,'2026-07-24','Original source date changed');
    assert(checks.some(c=>current.check_ids.includes(c.check_id)&&c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),'Missing exact bound check');
    assert(current.affected_record_ids.includes(id));
  }
  const update=await json(`src/content/updates/2026-09-14-backlog-research-${current.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id,current.review_id);assert.equal(update.decision_date,undefined);
  assert.equal(update.materiality,'No record-state change');assert.equal(update.source_checked_date,current.checked_date);
  assert.deepEqual(update.affected_record_ids,current.affected_record_ids);
  assert(current.affected_routes.every(route=>update.related_paths.includes(route)));
}
assert.equal(used.size,31);
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['www.vaoig.gov','www.gao.gov','www.energy.gov','www.oig.dot.gov','www.aemo.com.au','www.aer.gov.au','www.energymining.sa.gov.au','www.energysafe.vic.gov.au','arena.gov.au'].includes(new URL(check.url).hostname));
  for(const key of ['artifact_date','observation_period','locator','access','evidence_role','finding','limitation'])assert(check[key]?.trim());
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
}
const byId=id=>checks.find(c=>c.check_id===`207-CHECK-COHORT-${id}`);
assert(byId('VA2022').finding.includes('47 selected'));
assert(byId('VA2023').finding.includes('Closed-Not Implemented'));
assert(byId('VA2024').finding.includes('All 23 displayed entries'));
assert(byId('VA-CIO').finding.includes('four are designated priority'));
assert(byId('DOE2023-PDF').limitation.includes('overlap analysis'));
assert(byId('DOE2024-PDF').finding.includes('120 still open after three'));
assert(byId('DOE2025').finding.includes('explicitly includes FISMA'));
assert(byId('DOE2025-PDF').finding.includes('73 recommendations within 30'));
assert(byId('DOE2025-PDF').limitation.includes('not the complete restricted'));
assert(byId('DOE-SHARING-PDF').artifact_date.includes('March 30, 2026'));
assert(byId('DOT2023').limitation.includes('audit quality'));
assert(byId('DOT2023-PDF').observation_period.includes('June 30, 2023'));
assert(byId('DOT2024-PDF').finding.includes('61 of 443'));
assert(byId('DOT2025-PDF').finding.includes('60 of 447'));
assert(byId('DOT2025-PDF').finding.includes('adds Govern'));
assert(byId('DOT2025-PDF').finding.includes('emphasizes core results'));
assert(byId('DOT-CDM').artifact_date.includes('December 16, 2025'));
assert(byId('DOT-CDM').artifact_date.includes('June 23, 2026'));
assert(byId('HPR-PRELIMINARY').limitation.includes('final version of this November event'));
assert(byId('HPR-FINAL').artifact_date.includes('November 2021'));
assert(byId('HPR-AER').limitation.includes('ends before the November 16'));
assert(byId('HPR-CAPACITY').limitation.includes('add the expansion again'));
assert(byId('VBB-FINDINGS').limitation.includes('not final enforcement closure'));
assert(byId('VBB-OPERATIONAL').finding.includes('250 MW reserve'));
assert(byId('VBB-INDEX').artifact_date.includes('Reviewed September 1, 2023'));
assert(byId('DALRYMPLE-OP2').finding.includes('below 2.4 MWh'));
assert(byId('DALRYMPLE-OP2').limitation.includes('standby-inclusive energy totals'));
assert(byId('DALRYMPLE-SOC').finding.includes('twelve-year design life'));
assert(byId('DALRYMPLE-SOC').limitation.includes('cycle restriction did not apply'));
assert(byId('DALRYMPLE-FINAL').finding.includes('extracted fourth half-year heading'));
assert(byId('DALRYMPLE-FINAL').limitation.includes('not net profit'));
assert(byId('DALRYMPLE-STORY').limitation.includes('part of the total'));
const digest=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/backlog-second-cohort-reviews.mjs','scripts/assert-current-second-cohort-backlog.mjs','src/content/updates/2026-09-14-backlog-research-020.json','src/content/updates/2026-09-14-backlog-research-021.json','../docs/phase-207-second-cohort-research-2026-09-14.md'])assert(digest.artifact_paths.includes(path));
console.log('Second-cohort checks passed: two pinned reviews, 24 bound sources, 31 artifact checks; audit roles/statuses, changing samples/metrics, event identity, contract units, life-stage capacity, access boundaries and propagation preserved. No admission or publication.');
