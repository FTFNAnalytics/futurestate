import { access, readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57t-canonical-endpoints-signed-indexes-cache-mirror-recovery.json"));
const endpoints = await readJson(join(dataRoot, "phase-57t-canonical-reader-verification-endpoints.json"));
const indexes = await readJson(join(dataRoot, "phase-57t-signed-release-indexes.json"));
const caches = await readJson(join(dataRoot, "phase-57t-cache-coherence-receipts.json"));
const mirrors = await readJson(join(dataRoot, "phase-57t-mirror-redirect-integrity.json"));
const recovery = await readJson(join(dataRoot, "phase-57t-recovery-drill-fixtures.json"));
const harness = await readJson(join(dataRoot, "phase-57t-canonical-delivery-recovery-harness-results.json"));
const review = await readJson(join(dataRoot, "phase-57t-publication-review.json"));
const phase57s = await readJson(join(dataRoot, "phase-57s-reader-verification-freshness-provenance-exports-digest-reconciliation.json"));

check(ledger.phase === "57T" && ledger.records_reviewed === 54 && ledger.records.length === 54, "Phase 57T must contain exactly fifty-four records.");
const published = ledger.records.filter((record) => record.record_status === "Published");
const held = ledger.records.filter((record) => record.record_status === "In Review");
check(published.length === 45 && held.length === 9, "Phase 57T must publish forty-five controls and preserve nine holds.");
check(new Set(ledger.records.map((record) => record.record_id)).size === 54 && new Set(ledger.records.map((record) => record.document_id)).size === 54 && new Set(ledger.records.map((record) => record.signal_id)).size === 54 && new Set(ledger.records.map((record) => record.action_key)).size === 54, "Phase 57T record identities must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1153 && Math.max(...ledger.records.map((record) => record.document_number)) === 1206, "Phase 57T document numbers must span 1153 through 1206.");
check(new Set(published.flatMap((record) => record.supporting_source_ids)).size === 36 && ledger.carried_official_source_profiles === 36 && ledger.new_official_source_profiles === 0, "Phase 57T must reuse thirty-six Tier 1 source profiles and add none.");

const rails = [
  [endpoints, 162, 9, "endpoint"], [indexes, 162, 9, "signed-index"], [caches, 162, 9, "cache"], [mirrors, 162, 9, "mirror"], [recovery, 180, 9, "recovery"],
];
for (const [rail, caseCount, schemaCount, label] of rails) {
  check(rail.phase === "57T" && rail.schemas.length === schemaCount && rail.cases.length === caseCount && rail.passed_case_count === caseCount && rail.failed_case_count === 0, `Phase 57T ${label} rail totals are incorrect.`);
  check(new Set(rail.schemas.map((row) => row.contract_id)).size === 9 && new Set(rail.cases.map((row) => row.test_id)).size === caseCount, `Phase 57T ${label} identities must be unique.`);
  check(rail.cases.every((row) => row.passed && row.fixture_only && !row.actual_endpoint_published && !row.actual_release_index_signed && !row.actual_cache_receipt_created && !row.actual_mirror_or_redirect_event && !row.actual_recovery_drill_executed && !row.actual_reader_state_changed && !row.prior_artifact_rewritten && !row.evidence_created && !row.fires_trigger && !row.closes_hold_automatically && !row.publishes_automatically), `Every Phase 57T ${label} case must remain passing, synthetic, immutable, and non-automating.`);
}
check(ledger.total_contract_specific_schemas === 45 && ledger.total_workflow_cases === 828 && ledger.workflow_test_failures === 0, "Phase 57T aggregate schema or case totals are incorrect.");
check(harness.phase === "57T" && harness.total_case_count === 828 && harness.passed_case_count === 828 && harness.failed_case_count === 0 && new Set(harness.test_ids).size === 828, "Phase 57T harness totals or IDs are incorrect.");
check(harness.endpoint_case_count === 162 && harness.index_case_count === 162 && harness.cache_case_count === 162 && harness.mirror_case_count === 162 && harness.recovery_case_count === 180, "Phase 57T harness rail counts are incorrect.");
for (const field of ["actual_endpoints_published", "actual_release_indexes_signed", "actual_cache_receipts_created", "actual_mirror_or_redirect_events", "actual_recovery_drills_executed", "actual_reader_state_changes", "evidence_records_created", "reopening_triggers_fired", "automated_closures_or_publications", "prior_artifact_rewrites"]) check(harness[field] === 0, `Phase 57T harness field ${field} must remain zero.`);

const phase57sHolds = phase57s.records.filter((record) => record.record_status === "In Review");
check(JSON.stringify([...ledger.preserved_phase57s_holds].sort()) === JSON.stringify(phase57sHolds.map((record) => record.action_key).sort()), "Phase 57T must preserve all Phase 57S holds exactly once.");
check(ledger.new_visible_holds.length === 0 && new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57T must add no hold and preserve nine unique hold lineages.");
check(review.promoted_signal_ids.length === 45 && review.held_signal_ids.length === 9 && review.total_workflow_cases_executed === 828, "Phase 57T publication-review totals are incorrect.");
check(ledger.post_batch_closure_counts.Closed === 1 && ledger.post_batch_closure_counts["Partially Closed"] === 21 && ledger.post_batch_closure_counts.Open === 2, "Phase 57T must preserve the entity closure ledger.");

const collectionSlug = "canonical-verification-endpoints-signed-release-indexes-cache-mirror-recovery-2026";
const collectionId = `research-collection-${collectionSlug}`;
const collection = await readJson(join(contentRoot, "research-collections", `${collectionSlug}.json`));
check(collection.document_ids.length === 54 && new Set(collection.document_ids).size === 54 && /fifty-seven-file/.test(collection.download_note), "Phase 57T collection must include fifty-four documents and declare a fifty-seven-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
const signalFiles = await readdir(join(contentRoot, "signals"));
check(ledger.records.every((record) => documentFiles.some((file) => file.startsWith(`${record.document_number}-`) && file.endsWith(`${record.signal_id.replace(/^signal-/, "")}.json`))), "Every Phase 57T research document must exist.");
check(ledger.records.every((record) => signalFiles.includes(`${record.signal_id}.mdx`)), "Every Phase 57T signal must exist.");
const archivePath = join(appRoot, "public", "downloads", `${collectionSlug}.zip`);
await access(archivePath);
check((await stat(archivePath)).size > 0, "Phase 57T archive must be nonempty.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57T")), `${file} must include a Phase 57T watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57T collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57T canonical verification delivery and recovery"), `${file} must include the Phase 57T dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57t-canonical-delivery-recovery"), "Dependency map must include the Phase 57T node.");
check(map.links.filter((link) => link.from === "node-phase57t-canonical-delivery-recovery").length === 3, "Dependency map must include three Phase 57T links.");

if (errors.length) {
  console.error("Phase 57T assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57T assertions passed: 45 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 45 schemas, 828 cases, canonical endpoint binding, signed index chaining, fail-closed cache coherence, mirror and redirect integrity, immutable-source recovery, zero actual delivery or recovery events, zero triggers, and unchanged scope, outcome, and closure ledgers.");
