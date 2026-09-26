import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {manufacturingArtifactChecks as checks,manufacturingResearchReviews as reviews} from './content-205-216/backlog-manufacturing-reviews.mjs';
import {backlogHash} from './lib/backlog-research.mjs';
import {computeV1refCandidateDigest} from './lib/v1ref-candidate-digest.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFile(join(root,p),'utf8');
const json=async p=>JSON.parse(await read(p));
const ops=await json('src/data/phase-207-current-operations.json');
const pins=await json('scripts/content-205-216/backlog-review-inputs.json');
const backlog=await json('src/data/phase-182-evidence-source-backlog.json');
const baselineReceiptHashes = {"182-BACKLOG-001":"8fffa6102c84f9396a78332ae03cfdd523a8d6091da4709194009f8be0a97a72","182-BACKLOG-007":"7a55bdfe3aba4e91827657d6786c1f25a0e82e2ec435fb6ad3458d0b899008c4","182-BACKLOG-008":"0a7002d3d6e9de8ccda7ef878fa74b0c9611d621b48804230f86dc68ec26ea2c","182-BACKLOG-009":"db7591cb54a422abfcf4a69b5831461cbca2051789c7a80a27756ce83ee7d3ff","182-BACKLOG-012":"48b439f12f4f5a6e5791ab685b04959b0aad5ebd51f1260dd01fefad4aa084a4","182-BACKLOG-016":"87506f1b44ba2bf3b69e639468bc13c40a20ec2bd73401733ff3ec4335df37ac"};
for(const [id,sha] of Object.entries(baselineReceiptHashes))assert.equal(ops.backlog_reviews.find(r=>r.backlog_item_id===id).sha256,sha,'Earlier research receipt was rewritten');
assert.deepEqual(reviews.map(r=>r.backlog_item_id),['182-BACKLOG-013','182-BACKLOG-017','182-BACKLOG-018','182-BACKLOG-019']);
assert.equal(checks.length,15);assert.equal(new Set(checks.map(c=>c.check_id)).size,15);
assert(ops.backlog_research_checked>=10);assert(ops.backlog_artifact_checks.length>=30);
assert.equal(ops.backlog_authorized_dispositions,25);assert.equal(ops.governed_series_admitted,0);
for(const review of reviews){
  const prior=backlog.backlog_items.find(r=>r.backlog_item_id===review.backlog_item_id);
  const pin=pins.records.find(r=>r.backlog_item_id===review.backlog_item_id);
  const current=ops.backlog_reviews.find(r=>r.review_id===review.review_id);
  for(const[key,value]of Object.entries(review))assert.deepEqual(current[key],value);
  assert.equal(current.checked_date,'2026-09-14');assert.equal(current.next_check_date,'2026-09-21');
  assert.equal(current.final_disposition,null);assert.equal(current.adjudication_complete,false);assert.equal(current.human_reviewer,null);
  assert.equal(current.human_admission_authorized,false);assert.equal(current.publication_authorized,false);assert.equal(current.phase_60_gate_decision,false);
  for(const input of pin.inputs)assert.equal(backlogHash(await read(input.path)),input.sha256,'Full source input must still match the actual review');
  for(const id of prior.source_ids){
    const source=await json(`src/content/sources/${id}.json`);
    assert.equal(source.last_checked_date,'2026-07-24','Later research must not mutate historical source dates');
    assert(checks.some(c=>review.check_ids.includes(c.check_id)&&c.source_ids.includes(id)&&c.url===source.url&&c.evidence_role==='Exact bound source'),`${id}: contextual URL cannot replace an exact bound-source attempt`);
  }
  assert.equal(current.named_file_ids.length,0);
  const update=await json(`src/content/updates/2026-09-14-backlog-research-${review.backlog_item_id.slice(-3)}.json`);
  assert.equal(update.receipt_id,review.review_id);assert.equal(update.decision_date,undefined);assert.equal(update.source_checked_date,'2026-09-14');
}
for(const check of checks){
  assert.deepEqual(ops.backlog_artifact_checks.find(c=>c.check_id===check.check_id),check);
  assert(['Text inspected','Text inspected; visual check unavailable','Unreadable artifact','Retrieval failed'].includes(check.access_result));
  assert(check.evidence_role&&check.limitation&&check.observation_period&&check.locator);
  assert(!('observed_values' in check));assert(!('admitted_series' in check));
}
const byId=id=>checks.find(c=>c.check_id===id);
const exact=byId('207-CHECK-MONAGHAN-TPLC-BOUND-QUERY'),alt=byId('207-CHECK-MONAGHAN-TPLC-ALTERNATE-2011');
assert.equal(new URL(exact.url).searchParams.get('min_report_year'),'2017');assert.equal(exact.access_result,'Retrieval failed');
assert.equal(new URL(alt.url).searchParams.get('min_report_year'),'2011');assert.equal(alt.evidence_role,'Different query - contextual only');
assert(alt.limitation.includes('not compatible repeats'));assert(alt.finding.includes('not sufficient'));
assert.equal(byId('207-CHECK-MONAGHAN-TPLC-ALTERNATE-2019').access_result,'Retrieval failed');
const certificate=byId('207-CHECK-ISLAND-CERTIFICATE-IMAGE');
assert.equal(certificate.access_result,'Unreadable artifact');assert(certificate.artifact_date.includes('unverified'));assert(certificate.limitation.includes('filename'));
assert(byId('207-CHECK-ISLAND-QF36-REVF').access.includes('visual verification unavailable'));
assert(byId('207-CHECK-ISLAND-CERTIFICATION-PAGE').limitation.includes('every listed group certification'));
assert(byId('207-CHECK-CURRENT-CFA-19418').limitation.includes('Zero grant disbursement is not zero investment'));
assert(byId('207-CHECK-CURRENT-OSHA-314347824').artifact_date.includes('2010-10-26'));
assert(byId('207-CHECK-CURRENT-OSHA-314347824').artifact_date.includes('2011-01-24'));
assert(byId('207-CHECK-FDA-MDR-METHOD').limitation.includes('not a finding about Monaghan'));
const digest=await computeV1refCandidateDigest();
const phasePackages=digest.artifact_paths.filter(p=>/^\.\.\/docs\/work-packages\/phase-(20[5-9]|21[0-6])-/.test(p));
assert.equal(phasePackages.length,12,'All twelve current-program acceptance contracts must be bound');
assert(digest.artifact_paths.includes('scripts/content-205-216/backlog-manufacturing-reviews.mjs'));
for(const review of reviews)assert(digest.artifact_paths.includes(`src/content/updates/2026-09-14-backlog-research-${review.backlog_item_id.slice(-3)}.json`));
const packageJson=await json('package.json');assert(packageJson.scripts.build.startsWith('npm run current:test &&'),'Build must run all current source checks before Astro');
console.log('Manufacturing backlog checks passed: four pinned reviews, 15 actual artifact checks, exact-bound attempts distinct from alternate queries, PDF/FDA failures visible, original dates and all admission/causation holds retained.');
