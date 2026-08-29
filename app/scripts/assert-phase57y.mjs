import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57y-federation-remediation-rotation-recusal-holdover-rollout-recovery.json"));
const phase57x = await readJson(join(dataRoot, "phase-57x-federation-health-diversity-adjudication-time-patch-decommissioning.json"));
const harness = await readJson(join(dataRoot, "phase-57y-remediation-rotation-recusal-rollout-recovery-harness-results.json"));
const review = await readJson(join(dataRoot, "phase-57y-publication-review.json"));
const railSpecs = [
  ["phase-57y-health-breach-remediation-capacity-planning.json", 270, "remediation"],
  ["phase-57y-witness-rotation-jurisdiction-exit-correlated-failure.json", 270, "rotation"],
  ["phase-57y-adjudicator-conflict-recusal-precedent-consistency.json", 270, "recusal"],
  ["phase-57y-time-holdover-resynchronization-leap-smear.json", 243, "holdover"],
  ["phase-57y-vulnerability-embargo-canary-hotfix-rollout-rollback.json", 288, "rollout"],
  ["phase-57y-legacy-retention-tombstone-discoverability-disaster-recovery.json", 288, "recovery"],
];

check(ledger.phase === "57Y" && ledger.records_reviewed === 63 && ledger.records.length === 63, "Phase 57Y must contain exactly sixty-three records.");
const published = ledger.records.filter((record) => record.record_status === "Published");
const held = ledger.records.filter((record) => record.record_status === "In Review");
check(published.length === 54 && held.length === 9, "Phase 57Y must publish fifty-four controls and preserve nine holds.");
check(new Set(ledger.records.map((record) => record.record_id)).size === 63 && new Set(ledger.records.map((record) => record.document_id)).size === 63 && new Set(ledger.records.map((record) => record.signal_id)).size === 63 && new Set(ledger.records.map((record) => record.action_key)).size === 63, "Phase 57Y record identities must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1459 && Math.max(...ledger.records.map((record) => record.document_number)) === 1521, "Phase 57Y document numbers must span 1459 through 1521.");
check(new Set(published.flatMap((record) => record.supporting_source_ids)).size === 36 && ledger.carried_tier1_source_count === 36, "Phase 57Y must reuse thirty-six Tier 1 source profiles.");

for (const [file, caseCount, label] of railSpecs) {
  const rail = await readJson(join(dataRoot, file));
  check(rail.phase === "57Y" && rail.schemas.length === 9 && rail.cases.length === caseCount && rail.passed_case_count === caseCount && rail.failed_case_count === 0, `Phase 57Y ${label} rail totals are incorrect.`);
  check(new Set(rail.schemas.map((row) => row.contract_id)).size === 9 && new Set(rail.cases.map((row) => row.test_id)).size === caseCount, `Phase 57Y ${label} identities must be unique.`);
  check(rail.cases.every((row) => row.passes && row.synthetic && !row.actual_event && !row.evidence_created && !row.history_rewritten && !row.fires_trigger && !row.assigns_human_blame && !row.changes_reader_state && !row.closes_hold_automatically && !row.publishes_automatically), `Every Phase 57Y ${label} case must remain passing, synthetic, immutable, non-blaming, and non-automating.`);
}

check(ledger.total_contract_specific_schemas === 54 && ledger.total_workflow_cases === 1629 && ledger.valid_or_preservation_routes === 423 && ledger.rejected_routes === 1206 && ledger.workflow_test_failures === 0, "Phase 57Y aggregate schema or case totals are incorrect.");
check(harness.phase === "57Y" && harness.total_schema_count === 54 && harness.total_case_count === 1629 && harness.passed_case_count === 1629 && harness.failed_case_count === 0 && harness.valid_or_preservation_routes === 423 && harness.rejected_routes === 1206 && new Set(harness.test_ids).size === 1629, "Phase 57Y harness totals or IDs are incorrect.");
for (const field of ["actual_breaches", "actual_capacity_changes", "actual_rotations", "actual_jurisdiction_exits", "actual_correlated_failures", "actual_recusals", "actual_precedents", "actual_holdovers", "actual_resynchronizations", "actual_embargoes", "actual_canaries", "actual_hotfixes", "actual_rollouts", "actual_rollbacks", "actual_tombstones", "actual_restorations", "actual_recoveries", "actual_reader_state_changes", "evidence_records_created", "reopening_triggers_fired", "automated_closures_or_publications", "human_blame_assignments", "history_rewrites"]) check(harness[field] === 0, `Phase 57Y harness field ${field} must remain zero.`);

const phase57xHolds = phase57x.records.filter((record) => record.record_status === "In Review");
check(JSON.stringify([...ledger.preserved_phase57x_holds].sort()) === JSON.stringify(phase57xHolds.map((record) => record.action_key).sort()), "Phase 57Y must preserve all Phase 57X holds exactly once.");
check(ledger.new_visible_holds.length === 0 && new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57Y must add no hold and preserve nine unique hold lineages.");
check(review.promoted_signal_ids.length === 54 && review.held_signal_ids.length === 9 && review.total_workflow_cases_executed === 1629, "Phase 57Y publication-review totals are incorrect.");
check(ledger.post_batch_closure_counts.Closed === 1 && ledger.post_batch_closure_counts["Partially Closed"] === 21 && ledger.post_batch_closure_counts.Open === 2, "Phase 57Y must preserve the entity closure ledger.");

const collectionSlug = "federation-remediation-witness-rotation-recusal-time-holdover-coordinated-rollout-legacy-recovery-2026";
const collectionId = `research-collection-${collectionSlug}`;
const collection = await readJson(join(contentRoot, "research-collections", `${collectionSlug}.json`));
check(collection.document_ids.length === 63 && new Set(collection.document_ids).size === 63 && /sixty-six-file/.test(collection.download_note), "Phase 57Y collection must include sixty-three documents and declare a sixty-six-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
const signalFiles = await readdir(join(contentRoot, "signals"));
check(ledger.records.every((record) => documentFiles.some((file) => file.startsWith(`${record.document_number}-`) && file.endsWith(`${record.signal_id.replace(/^signal-/, "")}.json`))), "Every Phase 57Y research document must exist.");
check(ledger.records.every((record) => signalFiles.includes(`${record.signal_id}.mdx`)), "Every Phase 57Y signal must exist.");
const archivePath = join(appRoot, "public", "downloads", `${collectionSlug}.zip`);
await access(archivePath);
check((await stat(archivePath)).size > 0, "Phase 57Y archive must be nonempty.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57Y")), `${file} must include a Phase 57Y watch question.`);
}
const stage = "Phase 57Y federation remediation, rotation, recusal, holdover, coordinated rollout, and long-term recovery";
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57Y collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === stage), `${file} must include the Phase 57Y dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57y-remediation-long-term-recovery"), "Dependency map must include the Phase 57Y node.");
check(map.links.filter((link) => link.from === "node-phase57y-remediation-long-term-recovery").length === 3, "Dependency map must include three Phase 57Y links.");

if (errors.length) {
  console.error("Phase 57Y assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57Y assertions passed: 54 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 54 schemas, 1,629 cases, zero production events, zero blame, zero triggers, and unchanged outcome and closure ledgers.");
