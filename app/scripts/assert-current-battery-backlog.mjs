import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {batteryArtifactChecks as checks,batteryResearchReviews as reviews} from './content-205-216/backlog-battery-reviews.mjs';
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
assert(ops.backlog_research_checked>=15);
assert.equal(ops.backlog_research_checked+ops.backlog_research_unchecked,25);
assert(ops.backlog_artifact_checks.length>=77);
assert.equal(ops.backlog_authorized_dispositions,25);
assert.equal(ops.governed_series_admitted,0);
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-011','182-BACKLOG-015']);
assert.equal(checks.length,16);assert.equal(new Set(checks.map(c=>c.check_id)).size,16);
assert.equal(checks.filter(c=>c.evidence_role==='Exact bound source').length,12);
assert.equal(checks.filter(c=>c.access_result==='Retrieval failed').length,5);
assert.equal(checks.filter(c=>c.access_result==='Indexed excerpt only').length,4);
assert.equal(checks.filter(c=>c.access_result==='Text inspected; visual check unavailable').length,4);
assert.equal(checks.filter(c=>c.access_result==='Text inspected').length,3);
const earlier={
  '182-BACKLOG-010':'b52f563a98245be504f7454732eab6ab11eb96135cc7752f58622213f9794d10',
  '182-BACKLOG-014':'93163514fdad6c56125f9f3e5816b1ac123ac995a179f038c240b42870419d4c'
};
for(const[id,sha]of Object.entries(earlier))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Earlier agency follow-up changed');
const used=new Set();
for(const review of reviews){
  const current=ops.backlog_reviews.find(r=>r.backlog_item_id===review.backlog_item_id);
  for(const[key,value]of Object.entries(review))assert.deepEqual(current[key],value);
  assert.equal(current.checked_date,'2026-09-14');assert.equal(current.next_check_date,'2026-09-21');
  assert.equal(current.human_reviewer,null);assert.equal(current.final_disposition,null);
  for(const key of ['human_admission_authorized','publication_authorized','adjudication_complete','phase_60_gate_decision','source_profile_dates_changed'])assert.equal(current[key],false);
  assert.deepEqual(current.named_file_ids,[]);
  const pin=pins.records.find(r=>r.backlog_item_id===current.backlog_item_id);
  assert.equal(pin.inputs.length,7);assert.equal(current.source_ids.length,6);
  for(const input of pin.inputs)assert.equal(backlogHash(await read(input.path)),input.sha256);
  for(const id of current.check_ids){
    used.add(id);
    assert(checks.find(c=>c.check_id===id)?.source_ids.some(source=>current.source_ids.includes(source)),'Unrelated check assigned');
  }
  for(const id of current.source_ids){
    const source=await json(`src/content/sources/${id}.json`);
    assert.equal(source.last_checked_date,'2026-07-24');
    assert(checks.some(c=>current.check_ids.includes(c.check_id)&&c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),'An indexed excerpt must not erase a failed exact URL attempt');
    assert(current.affected_record_ids.includes(id));
  }
  const update=await json(`src/content/updates/2026-09-14-backlog-research-${current.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id,current.review_id);assert.equal(update.decision_date,undefined);
  assert.equal(update.materiality,'No record-state change');assert.equal(update.source_checked_date,current.checked_date);
  assert.deepEqual(update.affected_record_ids,current.affected_record_ids);
  assert(current.affected_routes.every(route=>update.related_paths.includes(route)));
}
assert.equal(used.size,16);
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['www.cpuc.ca.gov','docs.cpuc.ca.gov','www.psc.state.fl.us','www.epa.gov'].includes(new URL(check.url).hostname));
  for(const key of ['artifact_date','observation_period','locator','access','evidence_role','finding','limitation'])assert(check[key]?.trim());
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
  if(check.access_result==='Indexed excerpt only'){
    assert.equal(check.evidence_role,'Indexed official excerpt, not full report');
    assert(checks.some(c=>c.url===check.url&&c.access_result==='Retrieval failed'),'Indexed evidence needs its retained failed retrieval');
  }
}
const byId=id=>checks.find(c=>c.check_id===`207-CHECK-${id}`);
assert(byId('MOSS-AUDIT-2025-BOUND').access.includes('17,058,600'));
assert(byId('MOSS-AUDIT-2025-INDEXED').limitation.includes('response-extension history'));
assert(byId('MOSS-AUDIT-2025-RESPONSE').finding.includes('In progress status'));
assert(byId('MOSS-AUDIT-2025-RESPONSE').limitation.includes('status/prose mismatch'));
assert.notEqual(byId('MANATEE-REQUEST-2025-UPPER-BOUND').url,byId('MANATEE-REQUEST-2025-LOWER-BOUND').url);
const request=byId('MANATEE-REQUEST-2025-INDEXED');
assert.equal(request.source_ids.length,2);
for(const text of ['ST/NG','CC/NG','not the battery'])assert(request.finding.includes(text));
assert(request.limitation.includes('No battery availability value is extracted'));
assert(request.limitation.includes('complete-file absence'));
const testimony=byId('MANATEE-RATE-TESTIMONY-2025');
for(const text of ['409 MW','2.2-hour','469 MW','two other facilities'])assert(testimony.finding.includes(text));
assert(testimony.limitation.includes('transfer solar resilience'));
const response=byId('GATEWAY-AUDIT-2025-RESPONSE');
for(const text of ['14 of 16','declining','October','December 31, 2025','1 and 7 In-Progress'])assert(response.finding.includes(text));
assert(response.limitation.includes('not CPUC acceptance'));
const timeline=byId('MOSS-EPA-TIMELINE-2026');
assert(timeline.artifact_date.includes('2026-06-24'));
assert(timeline.limitation.includes('different boundaries'));assert(timeline.limitation.includes('not September outcomes'));
assert(byId('MOSS-EPA-AGREEMENT-2025').access.includes('agreement text not inspected'));
assert(byId('MANATEE-SITE-PLAN-2025-BOUND').access.includes('10,755,221'));
assert(byId('MANATEE-SITE-PLAN-2025-INDEXED').limitation.includes('county-name match'));
const resolution=byId('GATEWAY-RESOLUTION-E5428');
assert(resolution.artifact_date.includes('2025-11-20'));assert(resolution.artifact_date.includes('2025-11-24'));
for(const text of ['75 MW','55.5 MW','partial return'])assert(resolution.finding.includes(text));
assert(resolution.limitation.includes('not 75 MW restored'));assert(resolution.observation_period.includes('2027-08-01'));
assert(byId('EPA-BESS-CONSIDERATIONS-2026').artifact_date.includes('2026-07-31'));
assert(byId('EPA-BESS-CONSIDERATIONS-2026').limitation.includes('No current standards-edition determination'));
const digest=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/backlog-battery-reviews.mjs','scripts/assert-current-battery-backlog.mjs','src/content/updates/2026-09-14-backlog-research-011.json','src/content/updates/2026-09-14-backlog-research-015.json','../docs/phase-207-battery-research-2026-09-14.md'])assert(digest.artifact_paths.includes(path));
console.log('Battery backlog checks passed: two pinned reviews, twelve exact URL attempts, sixteen checks; failed/full/indexed access, operator/regulator roles, thermal/battery identities, date conflicts and no-outcome boundaries preserved. Earlier research remains unchanged.');
