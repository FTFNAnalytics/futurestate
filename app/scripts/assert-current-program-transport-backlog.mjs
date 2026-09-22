import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {programTransportArtifactChecks as checks,programTransportResearchReviews as reviews} from './content-205-216/backlog-program-transport-reviews.mjs';
import {backlogHash,verifyBacklogInputs} from './lib/backlog-research.mjs';
import {backlogResearchReviews} from './content-205-216/backlog-reviews.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json');
const pins=await json('scripts/content-205-216/backlog-review-inputs.json');
await verifyBacklogInputs(root,pins,await json('src/data/phase-182-evidence-source-backlog.json'),backlogResearchReviews);
assert(ops.backlog_research_checked>=21);
assert.equal(ops.backlog_research_checked+ops.backlog_research_unchecked,25);
assert(ops.backlog_artifact_checks.length>=158);
assert.equal(ops.backlog_authorized_dispositions,0);
assert.equal(ops.governed_series_admitted,0);
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-004','182-BACKLOG-005']);
assert.equal(checks.length,33);assert.equal(new Set(checks.map(c=>c.check_id)).size,33);
assert.equal(checks.filter(c=>c.evidence_role==='Exact bound source').length,19);
for(const[state,count]of Object.entries({'Retrieval failed':3,'Text inspected':18,'Text inspected; linked file retrieval failed':2,'Text inspected; visual check unavailable':9,'Indexed excerpt only':1}))assert.equal(checks.filter(c=>c.access_result===state).length,count);
for(const[id,sha]of Object.entries({
  '182-BACKLOG-002':'6995937a5bfd66ea831fa733ab7a224131dc68e3c9ace02c518ff6e7f599c853',
  '182-BACKLOG-003':'956b5ae198f157757f186e912aadb2d92d66694c6f3d815e588d8c224b06f4d4'
}))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Earlier system-series receipt changed');
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
    assert.equal(source.last_checked_date,id.startsWith('source-56a-dot-atcr-')?'2026-08-30':'2026-07-24','Original source-profile date changed');
    assert(checks.some(c=>current.check_ids.includes(c.check_id)&&c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),'Missing exact bound attempt');
    assert(current.affected_record_ids.includes(id));
  }
  const update=await json(`src/content/updates/2026-09-14-backlog-research-${current.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id,current.review_id);assert.equal(update.decision_date,undefined);
  assert.equal(update.materiality,'No record-state change');assert.equal(update.source_checked_date,current.checked_date);
  assert.deepEqual(update.affected_record_ids,current.affected_record_ids);
  assert(current.affected_routes.every(route=>update.related_paths.includes(route)));
}
assert.equal(used.size,33);
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['www.nist.gov','www.niimbl.org','www.census.gov','www2.census.gov','www.transportation.gov','www.dmv.ca.gov','www.faa.gov','www.nasa.gov'].includes(new URL(check.url).hostname));
  for(const key of ['artifact_date','observation_period','locator','access','evidence_role','finding','limitation'])assert(check[key]?.trim());
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
}
const byId=id=>checks.find(c=>c.check_id===`207-CHECK-PROGRAM-${id}`);
assert(byId('MEP-2021-BOUND').access.includes('404'));
assert(byId('MEP-2021-ALTERNATE').finding.includes('broader reach count'));
assert(byId('MEP-2022').limitation.includes('currently open'));
assert(byId('MEP-2024').finding.includes('11,734 clients were due for survey and 8,771 completed it'));
assert.equal(byId('MEP-2024').source_ids[0],'source-56a-nist-mep-impact-fy2023');
assert.equal(byId('NIIMBL-INDEX').source_ids.length,3);
assert(byId('NIIMBL-INDEX').limitation.includes('not itself a government agency'));
assert(byId('NIIMBL-2024').observation_period.includes('July 1, 2023–June 30, 2024'));
assert(byId('ASM-BENCHMARK').observation_period.includes('2018–2021'));
assert(byId('AIES-SERIES').artifact_date.includes('September 10, 2026'));
assert(byId('AIES-CHANGES').limitation.includes('must not be transferred to manufacturing'));
assert(byId('AIES-METHOD').finding.includes('capital-expenditure and robotics estimates are not linked'));
assert(byId('AIES-METHOD').limitation.includes('D is not zero'));
assert(byId('ATCR-FEB23-PDF').finding.includes('181,286 cancellations of 6,729,125'));
assert(byId('ATCR-FEB24-PDF').finding.includes('87,943 cancellations of 6,847,899'));
assert(byId('ATCR-FEB24-PDF').finding.includes('fifteen operating-carrier rows'));
assert(byId('ATCR-FEB24-PDF').limitation.includes('Delayed complaints are not zero'));
assert(byId('AV-2022').limitation.includes('cannot yield a precise prior total'));
assert(byId('AV-LINK-DRIFT').finding.includes('not the historical disengagement rows'));
assert.equal(byId('FAA-BOUND').source_ids.length,3);
assert.equal(byId('FAA-INDEXED').access_result,'Indexed excerpt only');
assert(byId('FAA-INDEXED').finding.includes('as-of note'));
assert(byId('NASA-2024').finding.includes('from 2018 onward'));
assert(byId('NASA-2024').finding.includes('not mission success'));
const digest=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/backlog-program-transport-reviews.mjs','scripts/assert-current-program-transport-backlog.mjs','src/content/updates/2026-09-14-backlog-research-004.json','src/content/updates/2026-09-14-backlog-research-005.json','../docs/phase-207-program-transport-research-2026-09-14.md'])assert(digest.artifact_paths.includes(path));
console.log('Program/transport checks passed: two pinned reviews, 24 sources, 33 checks; response denominators, method changes, reporting units, access limits and exact propagation preserved. No admission or publication.');
