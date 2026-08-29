import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57u-governed-keys-transparency-origins-incidents-recovery.json"));
const keys = await readJson(join(dataRoot, "phase-57u-governed-verification-key-registries.json"));
const lifecycle = await readJson(join(dataRoot, "phase-57u-key-lifecycle-receipts.json"));
const transparency = await readJson(join(dataRoot, "phase-57u-transparency-log-proofs.json"));
const origins = await readJson(join(dataRoot, "phase-57u-multi-origin-consistency.json"));
const incidents = await readJson(join(dataRoot, "phase-57u-incident-containment-receipts.json"));
const recovery = await readJson(join(dataRoot, "phase-57u-recovery-objective-drills.json"));
const harness = await readJson(join(dataRoot, "phase-57u-governed-trust-recovery-harness-results.json"));
const review = await readJson(join(dataRoot, "phase-57u-publication-review.json"));
const phase57t = await readJson(join(dataRoot, "phase-57t-canonical-endpoints-signed-indexes-cache-mirror-recovery.json"));

check(ledger.phase === "57U" && ledger.records_reviewed === 63 && ledger.records.length === 63, "Phase 57U must contain exactly sixty-three records.");
const published = ledger.records.filter((record) => record.record_status === "Published");
const held = ledger.records.filter((record) => record.record_status === "In Review");
check(published.length === 54 && held.length === 9, "Phase 57U must publish fifty-four controls and preserve nine holds.");
check(new Set(ledger.records.map((record) => record.record_id)).size === 63 && new Set(ledger.records.map((record) => record.document_id)).size === 63 && new Set(ledger.records.map((record) => record.signal_id)).size === 63 && new Set(ledger.records.map((record) => record.action_key)).size === 63, "Phase 57U record identities must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1207 && Math.max(...ledger.records.map((record) => record.document_number)) === 1269, "Phase 57U document numbers must span 1207 through 1269.");
check(new Set(published.flatMap((record) => record.supporting_source_ids)).size === 36 && ledger.carried_official_source_profiles === 36 && ledger.new_official_source_profiles === 0, "Phase 57U must reuse thirty-six Tier 1 source profiles and add none.");

const rails = [
  [keys, 180, "key-registry"], [lifecycle, 198, "key-lifecycle"], [transparency, 198, "transparency"], [origins, 180, "multi-origin"], [incidents, 198, "incident"], [recovery, 216, "recovery-objective"],
];
for (const [rail, caseCount, label] of rails) {
  check(rail.phase === "57U" && rail.schemas.length === 9 && rail.cases.length === caseCount && rail.passed_case_count === caseCount && rail.failed_case_count === 0, `Phase 57U ${label} rail totals are incorrect.`);
  check(new Set(rail.schemas.map((row) => row.contract_id)).size === 9 && new Set(rail.cases.map((row) => row.test_id)).size === caseCount, `Phase 57U ${label} identities must be unique.`);
  check(rail.cases.every((row) => row.passed && row.fixture_only && !row.actual_key_event && !row.actual_signature && !row.actual_log_entry && !row.actual_origin_observation && !row.actual_incident && !row.actual_receipt && !row.actual_replay && !row.actual_recovery_drill && !row.actual_reader_state_changed && !row.prior_artifact_rewritten && !row.evidence_created && !row.fires_trigger && !row.closes_hold_automatically && !row.publishes_automatically), `Every Phase 57U ${label} case must remain passing, synthetic, immutable, and non-automating.`);
}
check(ledger.total_contract_specific_schemas === 54 && ledger.total_workflow_cases === 1170 && ledger.valid_or_preservation_routes === 342 && ledger.rejected_routes === 828 && ledger.workflow_test_failures === 0, "Phase 57U aggregate schema or case totals are incorrect.");
check(harness.phase === "57U" && harness.total_case_count === 1170 && harness.passed_case_count === 1170 && harness.failed_case_count === 0 && harness.valid_or_preservation_routes === 342 && harness.rejected_routes === 828 && new Set(harness.test_ids).size === 1170, "Phase 57U harness totals or IDs are incorrect.");
for (const field of ["actual_key_events", "actual_signatures", "actual_log_entries", "actual_origin_observations", "actual_incidents", "actual_receipts", "actual_replays", "actual_recovery_drills", "actual_reader_state_changes", "evidence_records_created", "reopening_triggers_fired", "automated_closures_or_publications", "prior_artifact_rewrites"]) check(harness[field] === 0, `Phase 57U harness field ${field} must remain zero.`);

const phase57tHolds = phase57t.records.filter((record) => record.record_status === "In Review");
check(JSON.stringify([...ledger.preserved_phase57t_holds].sort()) === JSON.stringify(phase57tHolds.map((record) => record.action_key).sort()), "Phase 57U must preserve all Phase 57T holds exactly once.");
check(ledger.new_visible_holds.length === 0 && new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57U must add no hold and preserve nine unique hold lineages.");
check(review.promoted_signal_ids.length === 54 && review.held_signal_ids.length === 9 && review.total_workflow_cases_executed === 1170, "Phase 57U publication-review totals are incorrect.");
check(ledger.post_batch_closure_counts.Closed === 1 && ledger.post_batch_closure_counts["Partially Closed"] === 21 && ledger.post_batch_closure_counts.Open === 2, "Phase 57U must preserve the entity closure ledger.");

const collectionSlug = "governed-keys-transparency-multi-origin-incidents-recovery-objectives-2026";
const collectionId = `research-collection-${collectionSlug}`;
const collection = await readJson(join(contentRoot, "research-collections", `${collectionSlug}.json`));
check(collection.document_ids.length === 63 && new Set(collection.document_ids).size === 63 && /sixty-six-file/.test(collection.download_note), "Phase 57U collection must include sixty-three documents and declare a sixty-six-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
const signalFiles = await readdir(join(contentRoot, "signals"));
check(ledger.records.every((record) => documentFiles.some((file) => file.startsWith(`${record.document_number}-`) && file.endsWith(`${record.signal_id.replace(/^signal-/, "")}.json`))), "Every Phase 57U research document must exist.");
check(ledger.records.every((record) => signalFiles.includes(`${record.signal_id}.mdx`)), "Every Phase 57U signal must exist.");
const archivePath = join(appRoot, "public", "downloads", `${collectionSlug}.zip`);
await access(archivePath);
check((await stat(archivePath)).size > 0, "Phase 57U archive must be nonempty.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57U")), `${file} must include a Phase 57U watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57U collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57U governed trust, transparency, incident, and recovery objectives"), `${file} must include the Phase 57U dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57u-governed-trust-recovery"), "Dependency map must include the Phase 57U node.");
check(map.links.filter((link) => link.from === "node-phase57u-governed-trust-recovery").length === 3, "Dependency map must include three Phase 57U links.");

if (errors.length) {
  console.error("Phase 57U assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57U assertions passed: 54 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 54 schemas, 1,170 cases, governed trust roots, append-only key lifecycle, transparency proofs, exact three-origin consistency, fail-closed incident containment, measured inactive recovery, zero actual events, zero triggers, and unchanged scope, outcome, and closure ledgers.");
