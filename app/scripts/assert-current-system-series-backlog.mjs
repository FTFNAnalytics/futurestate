import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {systemSeriesArtifactChecks as checks,systemSeriesResearchReviews as reviews} from './content-205-216/backlog-system-series-reviews.mjs';
import {backlogHash,verifyBacklogInputs} from './lib/backlog-research.mjs';
import {backlogResearchReviews} from './content-205-216/backlog-reviews.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json');
const pins=await json('scripts/content-205-216/backlog-review-inputs.json');
await verifyBacklogInputs(root,pins,await json('src/data/phase-182-evidence-source-backlog.json'),backlogResearchReviews);
assert(ops.backlog_research_checked>=19);
assert.equal(ops.backlog_research_checked+ops.backlog_research_unchecked,25);
assert(ops.backlog_artifact_checks.length>=125);
assert.equal(ops.backlog_authorized_dispositions,25);
assert.equal(ops.governed_series_admitted,0);
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-002','182-BACKLOG-003']);
assert.equal(checks.length,27);assert.equal(new Set(checks.map(c=>c.check_id)).size,27);
assert.equal(checks.filter(c=>c.evidence_role==='Exact bound source').length,21);
for(const[state,count]of Object.entries({'Retrieval failed':3,'Text inspected':17,'Text inspected; linked file retrieval failed':4,'Text inspected; visual check unavailable':3}))assert.equal(checks.filter(c=>c.access_result===state).length,count);
for(const[id,sha]of Object.entries({
  '182-BACKLOG-022':'b25ddaa7573a3f25399fc3e657f46d6d9079a6668eecc12711dbce0ec9d1c02c',
  '182-BACKLOG-023':'16c11feb1c101b5085e1f4ea1d0870f9a8f169e34075c4a1e2fd80995b3a03f8'
}))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Earlier aviation receipt changed');
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
    assert(checks.find(c=>c.check_id===id)?.source_ids.some(source=>current.source_ids.includes(source)),'Unrelated check assigned');
  }
  for(const id of current.source_ids){
    const source=await json(`src/content/sources/${id}.json`);
    assert.equal(source.last_checked_date,'2026-07-24','Preserve original source-profile dates');
    assert(checks.some(c=>current.check_ids.includes(c.check_id)&&c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),'Missing exact bound source attempt');
    assert(current.affected_record_ids.includes(id));
  }
  const update=await json(`src/content/updates/2026-09-14-backlog-research-${current.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id,current.review_id);assert.equal(update.decision_date,undefined);
  assert.equal(update.materiality,'No record-state change');assert.equal(update.source_checked_date,current.checked_date);
  assert.deepEqual(update.affected_record_ids,current.affected_record_ids);
  assert(current.affected_routes.every(route=>update.related_paths.includes(route)));
}
assert.equal(used.size,27);
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['www.whitehouse.gov','www.gao.gov','www.nasa.gov','www.eia.gov','www.epa.gov','www.usgs.gov'].includes(new URL(check.url).hostname));
  for(const key of ['artifact_date','observation_period','locator','access','evidence_role','finding','limitation'])assert(check[key]?.trim());
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
}
const byId=id=>checks.find(c=>c.check_id===`207-CHECK-SYSTEM-${id}`);
for(const year of [2021,2022,2023])assert(byId(`OMB-${year}`).access.includes('stopped without retry or workaround'));
assert(byId('CYBER-FEDERAL-2023').finding.includes('712 public recommendations'));
assert(byId('CYBER-HIGH-RISK-2024').finding.includes('four challenge areas'));
assert(byId('FISMA-PRELIMINARY-2020').limitation.includes('denominator of 24'));
assert(byId('FISMA-COMPLETE-2020').limitation.includes('share an observation year'));
assert(byId('FISMA-COMPLETE-2020').finding.includes('Recommendation 2 remains Open'));
assert(byId('FISMA-EFFECTIVENESS-2022').artifact_date.includes('February 2025'));
assert.equal(byId('NASA-LEGACY-LANDING').source_ids.length,2);
assert(byId('NASA-INVENTORY-LINK').access.includes('spreadsheets not opened'));
assert(byId('BATTERY-2021').observation_period.includes('end-2020'));
assert(byId('BATTERY-2022').limitation.includes('October is not a year-end observation'));
assert(byId('BATTERY-2023').finding.includes('primary purpose'));
assert(byId('EIA-ANNUAL-BOUND').observation_period.includes('2024'));
assert(byId('EIA-2023-TABLE').finding.includes('342 minutes'));
assert(byId('EIA-2023-TABLE').limitation.includes('loss-of-supply removal'));
assert.equal(byId('EPA-WRAP-INDEX').source_ids.length,3);
assert(byId('EPA-WRAP-TWO').finding.includes('422 total'));
assert(byId('EPA-WRAP-THREE').limitation.includes('Thirteen cumulative completions and eight past-year'));
for(const year of [2023,2024,2025])assert(byId(`USGS-${year}`).access.includes('no target URL'));
assert(byId('USGS-2025').observation_period.includes('not verified'));
const digest=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/backlog-system-series-reviews.mjs','scripts/assert-current-system-series-backlog.mjs','src/content/updates/2026-09-14-backlog-research-002.json','src/content/updates/2026-09-14-backlog-research-003.json','../docs/phase-207-system-series-research-2026-09-14.md'])assert(digest.artifact_paths.includes(path));
console.log('System-series backlog checks passed: two pinned reviews, 24 source profiles, 27 checks; repeated periods, rolling vintages, method populations, cumulative/annual units, access failures and propagation preserved. No independent admission or publication approval.');
