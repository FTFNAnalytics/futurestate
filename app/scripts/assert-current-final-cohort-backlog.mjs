import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {finalCohortArtifactChecks as checks,finalCohortResearchReviews as reviews} from './content-205-216/backlog-final-cohort-reviews.mjs';
import {backlogHash,verifyBacklogInputs} from './lib/backlog-research.mjs';
import {backlogResearchReviews} from './content-205-216/backlog-reviews.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json');
const pins=await json('scripts/content-205-216/backlog-review-inputs.json');
await verifyBacklogInputs(root,pins,await json('src/data/phase-182-evidence-source-backlog.json'),backlogResearchReviews);
assert.equal(ops.backlog_research_checked,25);assert.equal(ops.backlog_research_unchecked,0);
assert.equal(ops.backlog_artifact_checks.length,213);
assert.equal(ops.backlog_authorized_dispositions,25);assert.equal(ops.governed_series_admitted,0);
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-024','182-BACKLOG-025']);
assert.equal(checks.length,24);assert.equal(new Set(checks.map(c=>c.check_id)).size,24);
assert.equal(checks.filter(c=>c.evidence_role==='Exact bound source').length,20);
assert.equal(checks.filter(c=>c.evidence_role==='Official linked report').length,2);
assert.equal(checks.filter(c=>c.evidence_role==='Official alternative; retrieval failed').length,2);
assert.equal(checks.filter(c=>c.access_result==='Retrieval failed').length,5);
assert.equal(checks.filter(c=>c.access_result==='Text inspected').length,12);
assert.equal(checks.filter(c=>c.access_result==='Text inspected; visual check unavailable').length,7);
for(const[id,sha]of Object.entries({
  '182-BACKLOG-020':'43e61a793df4415ac47e68ba48933602b4d2261499d5b33296cec998b26b0958',
  '182-BACKLOG-021':'3c3b27f919237e1e47509f257fa6e6271f18949f388a969dbf5e5604af4ea8fd'
}))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Earlier second-cohort receipt changed');
const used=new Set();
for(const review of reviews){
  const current=ops.backlog_reviews.find(r=>r.backlog_item_id===review.backlog_item_id);
  for(const[key,value]of Object.entries(review))assert.deepEqual(current[key],value);
  assert.equal(current.checked_date,'2026-09-14');assert.equal(current.next_check_date,'2026-09-21');
  assert.equal(current.human_reviewer,null);assert.equal(current.final_disposition,null);
  for(const key of ['human_admission_authorized','publication_authorized','adjudication_complete','phase_60_gate_decision','source_profile_dates_changed'])assert.equal(current[key],false);
  assert.deepEqual(current.named_file_ids,[]);
  const count=review.backlog_item_id.endsWith('024')?14:6;
  const pin=pins.records.find(r=>r.backlog_item_id===current.backlog_item_id);
  assert.equal(current.source_ids.length,count);assert.equal(pin.inputs.length,count+1);
  for(const input of pin.inputs)assert.equal(backlogHash(await read(input.path)),input.sha256);
  for(const id of current.check_ids){
    used.add(id);
    assert(checks.find(c=>c.check_id===id)?.source_ids.some(source=>current.source_ids.includes(source)),'Unrelated artifact assigned');
  }
  for(const id of current.source_ids){
    const source=await json(`src/content/sources/${id}.json`);
    const expected=['source-56f-island-components-scida-2023','source-56g-dhs-oig-report-index-july-2026'].includes(id)?'2026-07-25':'2026-07-24';
    assert.equal(source.last_checked_date,expected,'Historical source date changed');
    assert(checks.some(c=>current.check_ids.includes(c.check_id)&&c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),'Missing exact bound check');
    assert(current.affected_record_ids.includes(id));
  }
  const update=await json(`src/content/updates/2026-09-14-backlog-research-${current.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id,current.review_id);assert.equal(update.decision_date,undefined);
  assert.equal(update.materiality,'No record-state change');assert.equal(update.source_checked_date,current.checked_date);
  assert.deepEqual(update.affected_record_ids,current.affected_record_ids);
  assert(current.affected_routes.every(route=>update.related_paths.includes(route)));
}
assert.equal(used.size,24);
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['oig.nasa.gov','vaoig.gov','www.energy.gov','www.oig.dot.gov','jcida.com','suffolkida.org','esd.ny.gov','www.gao.gov','www.saffm.hq.af.mil','www.cpuc.ca.gov','www.energysafe.vic.gov.au','arena.gov.au','www.bts.gov','www.oig.dhs.gov','www.f35.com','www.fpl.com','www.caiso.com','www.aemo.com.au'].includes(new URL(check.url).hostname));
  for(const key of ['artifact_date','observation_period','locator','access','evidence_role','finding','limitation'])assert(check[key]?.trim());
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
}
const byId=id=>checks.find(c=>c.check_id==='207-CHECK-FINAL-'+id);
assert(byId('NASA').limitation.includes('not an immutable July dataset'));
assert(byId('VA').finding.includes('three displayed recommendations are open'));
assert(byId('DOE-SAR-PDF').finding.includes('15 prior-year'));
assert(byId('DOE-SAR-PDF').finding.includes('233 agreed but unimplemented'));
assert(byId('DOE-SAR-PDF').limitation.includes('too categorical'));
assert(byId('DOT').finding.includes('RMA Associates'));
assert(byId('CURRENT').observation_period.includes('Undated'));
assert(byId('ISLAND').finding.includes('prospective'));
assert(byId('MONAGHAN').finding.includes('adopted a General Project Plan'));
assert(byId('GAO').finding.includes('104 selected'));
for(const id of ['AF-BOUND','AF-INDEX','AF-HIGHLIGHTS','VBB-ANNUAL','DHS'])assert.equal(byId(id).access_result,'Retrieval failed');
assert(byId('DHS').finding.includes('403 Forbidden'));
assert(byId('CPUC').limitation.includes('not a September final-disposition'));
assert(byId('DALRYMPLE').limitation.includes('not plant retirement'));
assert(byId('BTS-DIRECTIVE').artifact_date.includes('November 17, 2025'));
assert(byId('BTS-MAY').limitation.includes('denominator for a cancellation rate'));
assert(byId('DOE-GOV-PDF').limitation.includes('not the complete underlying audit'));
assert(byId('F35').artifact_date.includes('March 31, 2026'));
assert(byId('MANATEE').observation_period.includes('December 31, 2025'));
for(const text of ['1170','2185','1290','COMPLETED','ACTIVE','WITHDRAWN'])assert(byId('GATEWAY').finding.includes(text));
assert(byId('GATEWAY').limitation.includes('not current availability'));
assert(byId('HPR-DATA').finding.includes('element 330'));
assert(byId('HPR-DATA').limitation.includes('No archive was downloaded or decoded'));
const digest=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/backlog-final-cohort-reviews.mjs','scripts/assert-current-final-cohort-backlog.mjs','src/content/updates/2026-09-14-backlog-research-024.json','src/content/updates/2026-09-14-backlog-research-025.json','../docs/phase-207-first-batch-research-complete-2026-09-14.md'])assert(digest.artifact_paths.includes(path));
console.log('Backlog research preservation passed: 25 pinned reviews, 213 checks and 25 separately recorded owner-authorized AI determinations. Final two research receipts retain access failures, source dates, project identities, measurement definitions and exact propagation; no publication or series admission.');
