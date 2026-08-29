
import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57v-threshold-witness-gossip-time-verifiers-compromise-recovery.json"));
const threshold = await readJson(join(dataRoot, "phase-57v-threshold-release-authorizations.json"));
const witnesses = await readJson(join(dataRoot, "phase-57v-independent-witness-checkpoints.json"));
const gossip = await readJson(join(dataRoot, "phase-57v-cross-log-gossip.json"));
const trustedTime = await readJson(join(dataRoot, "phase-57v-trusted-time-receipts.json"));
const verifiers = await readJson(join(dataRoot, "phase-57v-verifier-diversity-conformance.json"));
const compromise = await readJson(join(dataRoot, "phase-57v-compromise-recovery.json"));
const harness = await readJson(join(dataRoot, "phase-57v-threshold-witness-gossip-compromise-harness-results.json"));
const review = await readJson(join(dataRoot, "phase-57v-publication-review.json"));
const phase57u = await readJson(join(dataRoot, "phase-57u-governed-keys-transparency-origins-incidents-recovery.json"));

check(ledger.phase === "57V" && ledger.records_reviewed === 63 && ledger.records.length === 63, "Phase 57V must contain exactly sixty-three records.");
const published = ledger.records.filter((record) => record.record_status === "Published");
const held = ledger.records.filter((record) => record.record_status === "In Review");
check(published.length === 54 && held.length === 9, "Phase 57V must publish fifty-four controls and preserve nine holds.");
check(new Set(ledger.records.map((record) => record.record_id)).size === 63 && new Set(ledger.records.map((record) => record.document_id)).size === 63 && new Set(ledger.records.map((record) => record.signal_id)).size === 63 && new Set(ledger.records.map((record) => record.action_key)).size === 63, "Phase 57V record identities must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1270 && Math.max(...ledger.records.map((record) => record.document_number)) === 1332, "Phase 57V document numbers must span 1270 through 1332.");
check(new Set(published.flatMap((record) => record.supporting_source_ids)).size === 36 && ledger.carried_official_source_profiles === 36 && ledger.new_official_source_profiles === 0, "Phase 57V must reuse thirty-six Tier 1 source profiles and add none.");

const rails = [
  [threshold, 225, "threshold"], [witnesses, 216, "witness"], [gossip, 198, "gossip"], [trustedTime, 207, "trusted-time"], [verifiers, 216, "verifier"], [compromise, 234, "compromise-recovery"],
];
for (const [rail, caseCount, label] of rails) {
  check(rail.phase === "57V" && rail.schemas.length === 9 && rail.cases.length === caseCount && rail.passed_case_count === caseCount && rail.failed_case_count === 0, `Phase 57V ${label} rail totals are incorrect.`);
  check(new Set(rail.schemas.map((row) => row.contract_id)).size === 9 && new Set(rail.cases.map((row) => row.test_id)).size === caseCount, `Phase 57V ${label} identities must be unique.`);
  check(rail.cases.every((row) => row.passed && row.fixture_only && !row.actual_threshold_share && !row.actual_witness_signature && !row.actual_checkpoint && !row.actual_gossip_message && !row.actual_time_receipt && !row.actual_verifier_run && !row.actual_compromise_event && !row.actual_recovery_action && !row.actual_algorithm_migration && !row.actual_reader_state_changed && !row.prior_artifact_rewritten && !row.evidence_created && !row.fires_trigger && !row.closes_hold_automatically && !row.publishes_automatically), `Every Phase 57V ${label} case must remain passing, synthetic, immutable, and non-automating.`);
}
check(ledger.total_contract_specific_schemas === 54 && ledger.total_workflow_cases === 1296 && ledger.valid_or_preservation_routes === 360 && ledger.rejected_routes === 936 && ledger.workflow_test_failures === 0, "Phase 57V aggregate schema or case totals are incorrect.");
check(harness.phase === "57V" && harness.total_case_count === 1296 && harness.passed_case_count === 1296 && harness.failed_case_count === 0 && harness.valid_or_preservation_routes === 360 && harness.rejected_routes === 936 && new Set(harness.test_ids).size === 1296, "Phase 57V harness totals or IDs are incorrect.");
for (const field of ["actual_threshold_shares", "actual_witness_signatures", "actual_checkpoints", "actual_gossip_messages", "actual_time_receipts", "actual_verifier_runs", "actual_compromise_events", "actual_recovery_actions", "actual_algorithm_migrations", "actual_reader_state_changes", "evidence_records_created", "reopening_triggers_fired", "automated_closures_or_publications", "prior_artifact_rewrites"]) check(harness[field] === 0, `Phase 57V harness field ${field} must remain zero.`);

const phase57uHolds = phase57u.records.filter((record) => record.record_status === "In Review");
check(JSON.stringify([...ledger.preserved_phase57u_holds].sort()) === JSON.stringify(phase57uHolds.map((record) => record.action_key).sort()), "Phase 57V must preserve all Phase 57U holds exactly once.");
check(ledger.new_visible_holds.length === 0 && new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57V must add no hold and preserve nine unique hold lineages.");
check(review.promoted_signal_ids.length === 54 && review.held_signal_ids.length === 9 && review.total_workflow_cases_executed === 1296, "Phase 57V publication-review totals are incorrect.");
check(ledger.post_batch_closure_counts.Closed === 1 && ledger.post_batch_closure_counts["Partially Closed"] === 21 && ledger.post_batch_closure_counts.Open === 2, "Phase 57V must preserve the entity closure ledger.");

const collectionSlug = "threshold-authorization-witness-gossip-trusted-time-verifier-diversity-compromise-recovery-2026";
const collectionId = `research-collection-${collectionSlug}`;
const collection = await readJson(join(contentRoot, "research-collections", `${collectionSlug}.json`));
check(collection.document_ids.length === 63 && new Set(collection.document_ids).size === 63 && /sixty-six-file/.test(collection.download_note), "Phase 57V collection must include sixty-three documents and declare a sixty-six-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
const signalFiles = await readdir(join(contentRoot, "signals"));
check(ledger.records.every((record) => documentFiles.some((file) => file.startsWith(`${record.document_number}-`) && file.endsWith(`${record.signal_id.replace(/^signal-/, "")}.json`))), "Every Phase 57V research document must exist.");
check(ledger.records.every((record) => signalFiles.includes(`${record.signal_id}.mdx`)), "Every Phase 57V signal must exist.");
const archivePath = join(appRoot, "public", "downloads", `${collectionSlug}.zip`);
await access(archivePath);
check((await stat(archivePath)).size > 0, "Phase 57V archive must be nonempty.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57V")), `${file} must include a Phase 57V watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57V collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57V threshold trust, witness federation, trusted time, verifier diversity, and compromise recovery"), `${file} must include the Phase 57V dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57v-threshold-federation-compromise-recovery"), "Dependency map must include the Phase 57V node.");
check(map.links.filter((link) => link.from === "node-phase57v-threshold-federation-compromise-recovery").length === 3, "Dependency map must include three Phase 57V links.");

if (errors.length) {
  console.error("Phase 57V assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57V assertions passed: 54 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 54 schemas, 1,296 cases, actor- and domain-separated threshold authorization, independent witnesses, cross-log gossip, trusted time, three-verifier conformance, inactive compromise recovery, zero actual events, zero triggers, and unchanged scope, outcome, and closure ledgers.");

