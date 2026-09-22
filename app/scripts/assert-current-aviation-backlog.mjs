import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {aviationArtifactChecks as checks,aviationResearchReviews as reviews} from './content-205-216/backlog-aviation-reviews.mjs';
import {backlogHash,verifyBacklogInputs} from './lib/backlog-research.mjs';
import {backlogResearchReviews} from './content-205-216/backlog-reviews.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json');
const pins=await json('scripts/content-205-216/backlog-review-inputs.json');
await verifyBacklogInputs(root,pins,await json('src/data/phase-182-evidence-source-backlog.json'),backlogResearchReviews);
assert(ops.backlog_research_checked>=17);
assert.equal(ops.backlog_research_checked+ops.backlog_research_unchecked,25);
assert(ops.backlog_artifact_checks.length>=98);
assert.equal(ops.backlog_authorized_dispositions,0);
assert.equal(ops.governed_series_admitted,0);
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-022','182-BACKLOG-023']);
assert.equal(checks.length,21);assert.equal(new Set(checks.map(c=>c.check_id)).size,21);
assert.equal(checks.filter(c=>c.evidence_role==='Exact bound source').length,16);
for(const[state,count]of Object.entries({'Retrieval failed':2,'Indexed excerpt only':2,'Partial text inspected':2,'Text inspected; visual check unavailable':3,'Text inspected':12}))assert.equal(checks.filter(c=>c.access_result===state).length,count);
const earlier={
  '182-BACKLOG-011':'ada7cdcc0c65cccbb35cd4d334549d18d6fb71ee147a1bda0cffccc343132c01',
  '182-BACKLOG-015':'3fe01e99df6825609d7280049aea83b75798a5fd21c80cbbb1b0f01481f71f93'
};
for(const[id,sha]of Object.entries(earlier))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Earlier battery research changed');
const used=new Set();
for(const review of reviews){
  const current=ops.backlog_reviews.find(r=>r.backlog_item_id===review.backlog_item_id);
  for(const[key,value]of Object.entries(review))assert.deepEqual(current[key],value);
  assert.equal(current.checked_date,'2026-09-14');assert.equal(current.next_check_date,'2026-09-21');
  assert.equal(current.human_reviewer,null);assert.equal(current.final_disposition,null);
  for(const key of ['human_admission_authorized','publication_authorized','adjudication_complete','phase_60_gate_decision','source_profile_dates_changed'])assert.equal(current[key],false);
  assert.deepEqual(current.named_file_ids,[]);
  const pin=pins.records.find(r=>r.backlog_item_id===current.backlog_item_id);
  assert.equal(current.source_ids.length,review.backlog_item_id.endsWith('022')?4:12);
  assert.equal(pin.inputs.length,current.source_ids.length+1);
  for(const input of pin.inputs)assert.equal(backlogHash(await read(input.path)),input.sha256);
  for(const id of current.check_ids){
    used.add(id);
    assert(checks.find(c=>c.check_id===id)?.source_ids.some(source=>current.source_ids.includes(source)),'Unrelated artifact assigned');
  }
  for(const id of current.source_ids){
    const source=await json(`src/content/sources/${id}.json`);
    assert.equal(source.last_checked_date,id==='source-56e-atcr-may-2026'?'2026-07-25':'2026-07-24','Historical source date must remain exact');
    assert(checks.some(c=>current.check_ids.includes(c.check_id)&&c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),'Alternate evidence must not erase the exact bound attempt');
    assert(current.affected_record_ids.includes(id));
  }
  const update=await json(`src/content/updates/2026-09-14-backlog-research-${current.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id,current.review_id);assert.equal(update.decision_date,undefined);
  assert.equal(update.materiality,'No record-state change');assert.equal(update.source_checked_date,current.checked_date);
  assert.deepEqual(update.affected_record_ids,current.affected_record_ids);
  assert(current.affected_routes.every(route=>update.related_paths.includes(route)));
}
assert.equal(used.size,21);
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['www.transportation.gov','www.gao.gov','files.gao.gov','www.f35.com','www.saffm.hq.af.mil','www.afmc.af.mil','www.amc.af.mil','www.af.mil','www.acc.af.mil','www.aflcmc.af.mil'].includes(new URL(check.url).hostname));
  for(const key of ['artifact_date','observation_period','locator','access','evidence_role','finding','limitation'])assert(check[key]?.trim());
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
}
const byId=id=>checks.find(c=>c.check_id===`207-CHECK-${id}`);
assert(byId('CARRIER-2024-OPERATING').finding.includes('15,252 cancellations among 984,306'));
assert(byId('CARRIER-2025-OPERATING').finding.includes('17,679 cancellations among 973,653'));
assert(byId('CARRIER-2025-OPERATING').finding.includes('separate Hawaiian annual row'));
assert(byId('CARRIER-MAY-2026').limitation.includes('prior-year complaint cells as zero'));
assert(byId('CARRIER-MAY-2026').finding.includes('less-than-15-minute'));
assert(byId('CARRIER-DASHBOARD-ACCESSIBLE').artifact_date.includes('December 3, 2024'));
assert(byId('CARRIER-DASHBOARD-ACCESSIBLE').limitation.includes('delay wording'));
assert(byId('CARRIER-DASHBOARD-BOUND').access.includes('absent from extraction'));
assert(byId('AIRCRAFT-F35-GAO-2025').limitation.includes('Calendar arrival is not action completion'));
assert(byId('AIRCRAFT-F35-COMPANY-2025').artifact_date.includes('January 7, 2026'));
assert(byId('AIRCRAFT-F35-COMPANY-2025').limitation.includes('does not establish the composition'));
assert(byId('AIRCRAFT-F35-SUSTAINMENT-2026').limitation.includes('not delivery-defect percentages'));
assert(byId('AIRCRAFT-KC46-GAO-2026').finding.includes('KC-135 and KC-46A'));
assert(byId('AIRCRAFT-KC46-GAO-2026').limitation.includes('not reconstructed'));
assert(byId('AIRCRAFT-KC46-GAO-2026').limitation.includes('nongeneralizable'));
assert(byId('AIRCRAFT-KC46-105TH').limitation.includes('nested fleet counts'));
assert(byId('AIRCRAFT-F15-FOUR').limitation.includes('not four new deliveries'));
assert(byId('AIRCRAFT-F15-GAO-BOUND').access.includes('46,644,590'));
assert(byId('AIRCRAFT-F15-GAO-INDEXED').finding.includes('EPAWSS is assessed separately'));
assert(byId('AIRCRAFT-F15-GAO-LANDING').limitation.includes('not an F-15EX technical deficiency closure'));
assert(byId('AIRCRAFT-F15-RESUMPTION').limitation.includes('production stoppage'));
const digest=await computeV1refCandidateDigest();
for(const path of ['scripts/content-205-216/backlog-aviation-reviews.mjs','scripts/assert-current-aviation-backlog.mjs','src/content/updates/2026-09-14-backlog-research-022.json','src/content/updates/2026-09-14-backlog-research-023.json','../docs/phase-207-aviation-research-2026-09-14.md'])assert(digest.artifact_paths.includes(path));
console.log('Aviation backlog checks passed: two pinned reviews, sixteen exact URL attempts, twenty-one checks; period, carrier, program, metric, role, failure and propagation boundaries retained. No independent admission or publication approval.');
