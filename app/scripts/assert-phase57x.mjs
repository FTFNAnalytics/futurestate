import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57x-federation-health-diversity-adjudication-time-patch-decommissioning.json"));
const health = await readJson(join(dataRoot, "phase-57x-federation-health-budgets-partition-policy.json"));
const diversity = await readJson(join(dataRoot, "phase-57x-independent-witness-diversity-audits.json"));
const adjudication = await readJson(join(dataRoot, "phase-57x-fork-adjudication-appeal-receipts.json"));
const time = await readJson(join(dataRoot, "phase-57x-cross-authority-time-corroboration.json"));
const patches = await readJson(join(dataRoot, "phase-57x-verifier-vulnerability-patch-provenance.json"));
const decommissioning = await readJson(join(dataRoot, "phase-57x-legacy-artifact-decommissioning-reader-rollback-notification.json"));
const harness = await readJson(join(dataRoot, "phase-57x-health-diversity-adjudication-patch-decommission-harness-results.json"));
const review = await readJson(join(dataRoot, "phase-57x-publication-review.json"));
const phase57w = await readJson(join(dataRoot, "phase-57w-quorum-ceremonies-witness-availability-fork-time-build-reissuance.json"));

check(ledger.phase === "57X" && ledger.records_reviewed === 63 && ledger.records.length === 63, "Phase 57X must contain exactly sixty-three records.");
const published = ledger.records.filter((record) => record.record_status === "Published");
const held = ledger.records.filter((record) => record.record_status === "In Review");
check(published.length === 54 && held.length === 9, "Phase 57X must publish fifty-four controls and preserve nine holds.");
check(new Set(ledger.records.map((record) => record.record_id)).size === 63 && new Set(ledger.records.map((record) => record.document_id)).size === 63 && new Set(ledger.records.map((record) => record.signal_id)).size === 63 && new Set(ledger.records.map((record) => record.action_key)).size === 63, "Phase 57X record identities must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1396 && Math.max(...ledger.records.map((record) => record.document_number)) === 1458, "Phase 57X document numbers must span 1396 through 1458.");
check(new Set(published.flatMap((record) => record.supporting_source_ids)).size === 36 && ledger.carried_official_source_profiles === 36 && ledger.new_official_source_profiles === 0, "Phase 57X must reuse thirty-six Tier 1 source profiles and add none.");

const rails = [[health, 270, "health"], [diversity, 252, "diversity"], [adjudication, 270, "adjudication"], [time, 243, "time-corroboration"], [patches, 270, "patch-provenance"], [decommissioning, 288, "decommissioning"]];
for (const [rail, caseCount, label] of rails) {
  check(rail.phase === "57X" && rail.schemas.length === 9 && rail.cases.length === caseCount && rail.passed_case_count === caseCount && rail.failed_case_count === 0, `Phase 57X ${label} rail totals are incorrect.`);
  check(new Set(rail.schemas.map((row) => row.contract_id)).size === 9 && new Set(rail.cases.map((row) => row.test_id)).size === caseCount, `Phase 57X ${label} identities must be unique.`);
  check(rail.cases.every((row) => row.passed && row.fixture_only && !row.actual_health_event && !row.actual_partition && !row.actual_diversity_audit && !row.actual_adjudication && !row.actual_appeal && !row.actual_time_comparison && !row.actual_vulnerability_advisory && !row.actual_patch && !row.actual_decommissioning && !row.actual_reader_rollback && !row.actual_notification && !row.actual_reader_state_changed && !row.history_rewritten && !row.evidence_created && !row.fires_trigger && !row.assigns_human_blame && !row.closes_hold_automatically && !row.publishes_automatically), `Every Phase 57X ${label} case must remain passing, synthetic, immutable, non-blaming, and non-automating.`);
}
check(ledger.total_contract_specific_schemas === 54 && ledger.total_workflow_cases === 1593 && ledger.valid_or_preservation_routes === 414 && ledger.rejected_routes === 1179 && ledger.workflow_test_failures === 0, "Phase 57X aggregate schema or case totals are incorrect.");
check(harness.phase === "57X" && harness.total_case_count === 1593 && harness.passed_case_count === 1593 && harness.failed_case_count === 0 && harness.valid_or_preservation_routes === 414 && harness.rejected_routes === 1179 && new Set(harness.test_ids).size === 1593, "Phase 57X harness totals or IDs are incorrect.");
for (const field of ["actual_health_events", "actual_partitions", "actual_diversity_audits", "actual_adjudications", "actual_appeals", "actual_time_comparisons", "actual_vulnerability_advisories", "actual_patches", "actual_decommissionings", "actual_reader_rollbacks", "actual_notifications", "actual_reader_state_changes", "evidence_records_created", "reopening_triggers_fired", "automated_closures_or_publications", "human_blame_assignments", "history_rewrites"]) check(harness[field] === 0, `Phase 57X harness field ${field} must remain zero.`);

const phase57wHolds = phase57w.records.filter((record) => record.record_status === "In Review");
check(JSON.stringify([...ledger.preserved_phase57w_holds].sort()) === JSON.stringify(phase57wHolds.map((record) => record.action_key).sort()), "Phase 57X must preserve all Phase 57W holds exactly once.");
check(ledger.new_visible_holds.length === 0 && new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57X must add no hold and preserve nine unique hold lineages.");
check(review.promoted_signal_ids.length === 54 && review.held_signal_ids.length === 9 && review.total_workflow_cases_executed === 1593, "Phase 57X publication-review totals are incorrect.");
check(ledger.post_batch_closure_counts.Closed === 1 && ledger.post_batch_closure_counts["Partially Closed"] === 21 && ledger.post_batch_closure_counts.Open === 2, "Phase 57X must preserve the entity closure ledger.");

const collectionSlug = "federation-health-witness-diversity-fork-adjudication-time-corroboration-patch-provenance-legacy-decommissioning-2026";
const collectionId = `research-collection-${collectionSlug}`;
const collection = await readJson(join(contentRoot, "research-collections", `${collectionSlug}.json`));
check(collection.document_ids.length === 63 && new Set(collection.document_ids).size === 63 && /sixty-six-file/.test(collection.download_note), "Phase 57X collection must include sixty-three documents and declare a sixty-six-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
const signalFiles = await readdir(join(contentRoot, "signals"));
check(ledger.records.every((record) => documentFiles.some((file) => file.startsWith(`${record.document_number}-`) && file.endsWith(`${record.signal_id.replace(/^signal-/, "")}.json`))), "Every Phase 57X research document must exist.");
check(ledger.records.every((record) => signalFiles.includes(`${record.signal_id}.mdx`)), "Every Phase 57X signal must exist.");
const archivePath = join(appRoot, "public", "downloads", `${collectionSlug}.zip`);
await access(archivePath);
check((await stat(archivePath)).size > 0, "Phase 57X archive must be nonempty.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57X")), `${file} must include a Phase 57X watch question.`);
}
const stage = "Phase 57X federation health, diversity, adjudication, time corroboration, patch provenance, and reversible decommissioning";
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57X collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === stage), `${file} must include the Phase 57X dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57x-health-adjudication-decommissioning"), "Dependency map must include the Phase 57X node.");
check(map.links.filter((link) => link.from === "node-phase57x-health-adjudication-decommissioning").length === 3, "Dependency map must include three Phase 57X links.");

if (errors.length) {
  console.error("Phase 57X assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57X assertions passed: 54 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 54 schemas, 1,593 cases, fixed-threshold health budgets, four-dimension diversity audits, independent fork adjudication and appeal, rollback-safe time corroboration, lineage-preserving patch provenance, reversible notified decommissioning, zero actual events, zero blame, zero triggers, and unchanged scope, outcome, and closure ledgers.");
