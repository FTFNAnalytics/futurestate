import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57r-publication-status-change-notices-restore-republication-provenance.json"));
const review = await readJson(join(dataRoot, "phase-57r-publication-review.json"));
const statuses = await readJson(join(dataRoot, "phase-57r-reader-facing-publication-status-registries.json"));
const notices = await readJson(join(dataRoot, "phase-57r-immutable-public-change-notices.json"));
const restores = await readJson(join(dataRoot, "phase-57r-restore-republication-provenance-fixtures.json"));
const harness = await readJson(join(dataRoot, "phase-57r-publication-status-harness-results.json"));
const phase57q = await readJson(join(dataRoot, "phase-57q-manual-release-authorization-publication-bundles-withdrawal-rollback-receipts.json"));

check(ledger.phase === "57R" && ledger.records.length === 45 && new Set(ledger.records.map((record) => record.record_id)).size === 45, "Phase 57R must contain 45 unique records.");
const published = ledger.records.filter((record) => record.record_status === "Published");
const held = ledger.records.filter((record) => record.record_status === "In Review");
check(published.length === 36 && held.length === 9, "Phase 57R must publish 36 controls and retain 9 holds.");
check(new Set(published.flatMap((record) => record.supporting_source_ids)).size === 36, "Phase 57R must reuse 36 distinct Tier 1 source profiles.");
check(new Set(ledger.records.map((record) => record.document_id)).size === 45 && new Set(ledger.records.map((record) => record.signal_id)).size === 45, "Phase 57R document and signal IDs must be unique.");
check(Math.min(...ledger.records.map((record) => record.document_number)) === 1063 && Math.max(...ledger.records.map((record) => record.document_number)) === 1107, "Phase 57R document numbering must span 1063 through 1107.");
check(ledger.structured_rails === 3 && ledger.publication_status_registries === 9 && ledger.immutable_change_notice_schemas === 9 && ledger.restore_republication_schemas === 9, "Phase 57R must contain 27 contract-specific schemas across three rails.");
check(ledger.total_workflow_cases === 396 && ledger.workflow_test_failures === 0, "Phase 57R must pass all 396 workflow cases.");
check(ledger.actual_publication_statuses === 0 && ledger.actual_change_notices === 0 && ledger.actual_restore_actors === 0 && ledger.actual_restore_authorizations === 0 && ledger.actual_restorations === 0 && ledger.actual_republications === 0, "Phase 57R must record zero actual statuses, notices, actors, authorizations, restorations, and republications.");
check(ledger.eligible_records_accepted === 0 && ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57R must record zero accept, acquisition, trigger, agency-contact, and FOIA events.");
check(ledger.directive_scope_changes === 0 && ledger.implementation_changes === 0 && ledger.capability_changes === 0 && ledger.closure_changes === 0 && ledger.operating_outcome_changes === 0 && ledger.inherited_entity_ledger_closure_changes === 0, "Phase 57R must not change scope, implementation, capability, closure, or operating outcomes.");
check(JSON.stringify(ledger.post_batch_closure_counts) === JSON.stringify({ Closed: 1, "Partially Closed": 21, Open: 2 }), "Phase 57R must preserve the entity closure ledger.");

check(statuses.status_registry_count === 9 && statuses.status_case_count === 126 && statuses.valid_derived_status_routes === 54 && statuses.rejected_status_routes === 72 && statuses.failed_case_count === 0, "Phase 57R status registry totals are incorrect.");
check(statuses.schemas.every((schema) => schema.append_only_event_types.length === 7 && schema.derivation_fields.length === 5 && !schema.automatic_publication_allowed), "Each status registry must cover seven lifecycle events, five derivation fields, and zero automatic publication.");
check(Object.keys(statuses.case_distribution).length === 14 && Object.values(statuses.case_distribution).every((count) => count === 9), "Every status test class must execute once per contract.");
check(notices.notice_schema_count === 9 && notices.notice_case_count === 126 && notices.valid_notice_routes === 54 && notices.rejected_notice_routes === 72 && notices.failed_case_count === 0, "Phase 57R immutable notice totals are incorrect.");
check(notices.schemas.every((schema) => schema.required_bindings.length === 5 && schema.immutable_after_issue && /never_rewrite/.test(schema.replacement_policy)), "Each change notice must carry five immutable controlling bindings.");
check(Object.keys(notices.case_distribution).length === 14 && Object.values(notices.case_distribution).every((count) => count === 9), "Every notice test class must execute once per contract.");
check(restores.restore_schema_count === 9 && restores.restore_case_count === 144 && restores.valid_or_history_preservation_routes === 54 && restores.rejected_restore_routes === 90 && restores.failed_case_count === 0, "Phase 57R restore and provenance totals are incorrect.");
check(restores.schemas.every((schema) => schema.required_new_bindings.length === 6 && !schema.stale_authorization_allowed && !schema.stale_bundle_allowed && !schema.prior_history_rewrite_allowed), "Every restore schema must require six new bindings and reject stale authority, stale bundles, and history rewrites.");
check(Object.keys(restores.case_distribution).length === 16 && Object.values(restores.case_distribution).every((count) => count === 9), "Every restore/provenance test class must execute once per contract.");

for (const rows of [statuses.cases, notices.cases, restores.cases]) {
  check(rows.every((row) => row.passed && row.fixture_only && !row.actual_publication_status_created && !row.actual_change_notice_created && !row.actual_restore_or_republication && !row.actual_actor_or_authorization && !row.prior_history_mutated && !row.evidence_created && !row.fires_trigger && !row.closes_hold_automatically && !row.publishes_automatically), "Every Phase 57R case must remain passing, synthetic, immutable, and non-automating.");
}
check(harness.phase === "57R" && harness.total_case_count === 396 && harness.passed_case_count === 396 && harness.failed_case_count === 0 && new Set(harness.test_ids).size === 396, "Phase 57R aggregate harness totals or identifiers are incorrect.");
check(harness.actual_publication_statuses === 0 && harness.actual_change_notices === 0 && harness.actual_restore_actors === 0 && harness.actual_restore_authorizations === 0 && harness.actual_restorations === 0 && harness.actual_republications === 0 && harness.evidence_records_created === 0 && harness.reopening_triggers_fired === 0 && harness.automated_closures_or_publications === 0 && harness.prior_history_mutations === 0, "Phase 57R aggregate harness must record zero actual workflow, evidence, trigger, closure, and mutation events.");

const phase57qHolds = phase57q.records.filter((record) => record.record_status === "In Review");
check(JSON.stringify([...ledger.preserved_phase57q_holds].sort()) === JSON.stringify(phase57qHolds.map((record) => record.action_key).sort()), "Phase 57R must preserve all Phase 57Q holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57R must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57R hold lineage must preserve nine unique parents and contracts.");
check(review.promoted_signal_ids.length === 36 && review.held_signal_ids.length === 9 && review.total_workflow_cases_executed === 396, "Phase 57R publication review totals are incorrect.");

const collectionId = "research-collection-publication-status-change-notices-restore-republication-provenance-2026";
const collection = await readJson(join(contentRoot, "research-collections", "publication-status-change-notices-restore-republication-provenance-2026.json"));
check(collection.document_ids.length === 45 && new Set(collection.document_ids).size === 45 && /forty-eight-file/.test(collection.download_note), "Phase 57R collection must include 45 documents and declare a 48-file archive.");
const documentFiles = await readdir(join(contentRoot, "research-documents"));
const signalFiles = await readdir(join(contentRoot, "signals"));
check(ledger.records.every((record) => documentFiles.some((file) => file.startsWith(`${record.document_number}-`) && file.endsWith(`${record.signal_id.replace(/^signal-/, "")}.json`))), "Every Phase 57R research document must exist.");
check(ledger.records.every((record) => signalFiles.includes(`${record.signal_id}.mdx`)), "Every Phase 57R signal must exist.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57R")), `${file} must include a Phase 57R watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes(collectionId), `${file} must link the Phase 57R collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57R publication status, change notices, and provenance"), `${file} must include the Phase 57R dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57r-publication-status-provenance"), "Dependency map must include the Phase 57R node.");
check(map.links.filter((link) => link.from === "node-phase57r-publication-status-provenance").length === 3, "Dependency map must include three Phase 57R links.");

if (errors.length) {
  console.error("Phase 57R assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57R assertions passed: 36 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 27 contract-specific schemas, 396 workflow cases, immutable history, new authorization and bundle requirements, zero actual lifecycle events, zero triggers, and unchanged scope, outcome, and closure ledgers.");
