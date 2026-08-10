import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57s-reader-verification-freshness-provenance-exports-digest-reconciliation.json"));
const review = await readJson(join(dataRoot, "phase-57s-publication-review.json"));
const manifests = await readJson(join(dataRoot, "phase-57s-reader-verifiable-lifecycle-manifests.json"));
const freshness = await readJson(join(dataRoot, "phase-57s-status-freshness-stale-view-detection.json"));
const exportsData = await readJson(join(dataRoot, "phase-57s-provenance-export-digest-reconciliation-fixtures.json"));
const harness = await readJson(join(dataRoot, "phase-57s-verification-harness-results.json"));
const phase57r = await readJson(join(dataRoot, "phase-57r-publication-status-change-notices-restore-republication-provenance.json"));

check(ledger.phase === "57S" && ledger.records.length === 45 && new Set(ledger.records.map((record) => record.record_id)).size === 45, "Phase 57S must contain 45 unique records.");
const published = ledger.records.filter((record) => record.record_status === "Published");
const held = ledger.records.filter((record) => record.record_status === "In Review");
check(published.length === 36 && held.length === 9, "Phase 57S must publish 36 controls and retain 9 holds.");
check(new Set(published.flatMap((record) => record.supporting_source_ids)).size === 36, "Phase 57S must reuse 36 distinct Tier 1 source profiles.");
check(new Set(ledger.records.map((record) => record.document_id)).size === 45 && new Set(ledger.records.map((record) => record.signal_id)).size === 45, "Phase 57S document and signal IDs must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1108 && Math.max(...ledger.records.map((record) => record.document_number)) === 1152, "Phase 57S document numbering must span 1108 through 1152.");
check(ledger.structured_rails === 3 && ledger.lifecycle_manifest_schemas === 9 && ledger.status_freshness_schemas === 9 && ledger.provenance_export_reconciliation_schemas === 9, "Phase 57S must contain 27 contract-specific schemas across three rails.");
check(ledger.total_workflow_cases === 450 && ledger.workflow_test_failures === 0, "Phase 57S must pass all 450 workflow cases.");
check(ledger.actual_lifecycle_manifests === 0 && ledger.actual_status_verifications === 0 && ledger.actual_provenance_exports === 0 && ledger.actual_reconciliation_receipts === 0, "Phase 57S must record zero actual manifests, verifications, exports, and reconciliation receipts.");
check(ledger.eligible_records_accepted === 0 && ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57S must record zero accept, acquisition, trigger, agency-contact, and FOIA events.");
check(ledger.directive_scope_changes === 0 && ledger.implementation_changes === 0 && ledger.capability_changes === 0 && ledger.closure_changes === 0 && ledger.attribution_changes === 0 && ledger.operating_outcome_changes === 0 && ledger.inherited_entity_ledger_closure_changes === 0, "Phase 57S must not change scope, implementation, capability, closure, attribution, or operating outcomes.");
check(JSON.stringify(ledger.post_batch_closure_counts) === JSON.stringify({ Closed: 1, "Partially Closed": 21, Open: 2 }), "Phase 57S must preserve the entity closure ledger.");

check(manifests.lifecycle_manifest_schema_count === 9 && manifests.manifest_case_count === 144 && manifests.valid_manifest_routes === 45 && manifests.rejected_manifest_routes === 99 && manifests.failed_case_count === 0, "Phase 57S lifecycle-manifest totals are incorrect.");
check(manifests.schemas.every((schema) => schema.required_manifest_fields.length === 10 && schema.hash_algorithm === "sha256" && schema.complete_history_required && schema.immutable_notice_set_required), "Each lifecycle manifest must require ten fields, SHA-256, complete history, and immutable notices.");
check(Object.keys(manifests.case_distribution).length === 16 && Object.values(manifests.case_distribution).every((count) => count === 9), "Every manifest test class must execute once per contract.");
check(freshness.freshness_schema_count === 9 && freshness.freshness_case_count === 144 && freshness.valid_freshness_routes === 36 && freshness.rejected_stale_or_partial_routes === 108 && freshness.failed_case_count === 0, "Phase 57S freshness totals are incorrect.");
check(freshness.schemas.every((schema) => schema.required_comparisons.length === 7 && schema.stale_or_partial_policy === "fail_closed" && !schema.warning_only_allowed && !schema.automatic_publication_allowed), "Each freshness schema must compare seven fields and fail closed without warning-only or automatic publication.");
check(Object.keys(freshness.case_distribution).length === 16 && Object.values(freshness.case_distribution).every((count) => count === 9), "Every freshness test class must execute once per contract.");
check(exportsData.export_schema_count === 9 && exportsData.export_case_count === 162 && exportsData.valid_or_preservation_routes === 54 && exportsData.rejected_export_or_reconciliation_routes === 108 && exportsData.failed_case_count === 0, "Phase 57S export and reconciliation totals are incorrect.");
check(exportsData.schemas.every((schema) => schema.required_export_fields.length === 9 && /never_rewrite/.test(schema.reconciliation_policy) && !schema.prior_export_rewrite_allowed && !schema.evidence_side_effects_allowed), "Each export schema must require nine fields and prohibit rewrite and evidence side effects.");
check(Object.keys(exportsData.case_distribution).length === 18 && Object.values(exportsData.case_distribution).every((count) => count === 9), "Every export/reconciliation test class must execute once per contract.");

for (const rows of [manifests.cases, freshness.cases, exportsData.cases]) {
  check(rows.every((row) => row.passed && row.fixture_only && !row.actual_manifest_created && !row.actual_status_verified && !row.actual_provenance_export_created && !row.actual_reconciliation_receipt_created && !row.prior_history_mutated && !row.evidence_created && !row.fires_trigger && !row.closes_hold_automatically && !row.publishes_automatically), "Every Phase 57S case must remain passing, synthetic, immutable, and non-automating.");
}
check(harness.phase === "57S" && harness.total_case_count === 450 && harness.passed_case_count === 450 && harness.failed_case_count === 0 && new Set(harness.test_ids).size === 450, "Phase 57S aggregate harness totals or IDs are incorrect.");
check(harness.actual_lifecycle_manifests === 0 && harness.actual_status_verifications === 0 && harness.actual_provenance_exports === 0 && harness.actual_reconciliation_receipts === 0 && harness.evidence_records_created === 0 && harness.reopening_triggers_fired === 0 && harness.automated_closures_or_publications === 0 && harness.prior_history_mutations === 0, "Phase 57S aggregate harness must record zero actual events or mutations.");

const phase57rHolds = phase57r.records.filter((record) => record.record_status === "In Review");
check(JSON.stringify([...ledger.preserved_phase57r_holds].sort()) === JSON.stringify(phase57rHolds.map((record) => record.action_key).sort()), "Phase 57S must preserve all Phase 57R holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57S must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57S hold lineage must preserve nine unique parents and contracts.");
check(review.promoted_signal_ids.length === 36 && review.held_signal_ids.length === 9 && review.total_workflow_cases_executed === 450, "Phase 57S publication-review totals are incorrect.");

const collectionId = "research-collection-reader-verifiable-lifecycle-manifests-stale-view-provenance-exports-2026";
const collection = await readJson(join(contentRoot, "research-collections", "reader-verifiable-lifecycle-manifests-stale-view-provenance-exports-2026.json"));
check(collection.document_ids.length === 45 && new Set(collection.document_ids).size === 45 && /forty-eight-file/.test(collection.download_note), "Phase 57S collection must include 45 documents and declare a 48-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
const signalFiles = await readdir(join(contentRoot, "signals"));
check(ledger.records.every((record) => documentFiles.some((file) => file.startsWith(`${record.document_number}-`) && file.endsWith(`${record.signal_id.replace(/^signal-/, "")}.json`))), "Every Phase 57S research document must exist.");
check(ledger.records.every((record) => signalFiles.includes(`${record.signal_id}.mdx`)), "Every Phase 57S signal must exist.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57S")), `${file} must include a Phase 57S watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57S collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57S reader verification, freshness, and provenance exports"), `${file} must include the Phase 57S dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57s-reader-verification-freshness"), "Dependency map must include the Phase 57S node.");
check(map.links.filter((link) => link.from === "node-phase57s-reader-verification-freshness").length === 3, "Dependency map must include three Phase 57S links.");

if (errors.length) {
  console.error("Phase 57S assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57S assertions passed: 36 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 27 schemas, 450 cases, complete lifecycle manifests, fail-closed freshness, immutable provenance exports, zero actual workflow events, zero triggers, and unchanged scope, outcome, and closure ledgers.");
