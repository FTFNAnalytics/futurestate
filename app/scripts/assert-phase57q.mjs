import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const countBy = (rows, field) => rows.reduce((counts, row) => { counts[row[field]] = (counts[row[field]] ?? 0) + 1; return counts; }, {});

const ledger = await readJson(join(dataRoot, "phase-57q-manual-release-authorization-publication-bundles-withdrawal-rollback-receipts.json"));
const review = await readJson(join(dataRoot, "phase-57q-publication-review.json"));
const releases = await readJson(join(dataRoot, "phase-57q-manual-release-authorization-checklists.json"));
const bundles = await readJson(join(dataRoot, "phase-57q-immutable-publication-bundle-manifests.json"));
const lifecycles = await readJson(join(dataRoot, "phase-57q-withdrawal-rollback-receipt-fixtures.json"));
const harness = await readJson(join(dataRoot, "phase-57q-release-lifecycle-harness-results.json"));
const phase57p = await readJson(join(dataRoot, "phase-57p-append-only-dual-review-audit-chains-cross-role-adjudication-publication-review-receipts.json"));
const collection = await readJson(join(contentRoot, "research-collections", "manual-release-authorization-publication-bundles-withdrawal-rollback-receipts-2026.json"));
const documents = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^\d+-57q-.*\.json$/.test(name));
const signals = (await readdir(join(contentRoot, "signals"))).filter((name) => /^signal-57q-.*\.mdx$/.test(name));
const phase57pHolds = phase57p.records.filter((record) => record.record_status === "In Review");

check(ledger.phase === "57Q", "Phase 57Q ledger has the wrong phase.");
check(ledger.records.length === 45 && new Set(ledger.records.map((record) => record.record_id)).size === 45, "Phase 57Q must contain forty-five unique records.");
check(ledger.records_published === 36 && ledger.records_held === 9, "Phase 57Q must publish thirty-six controls and preserve nine holds.");
for (const stage of ["Manual release-authorization checklist controls", "Immutable publication-bundle manifest controls", "Withdrawal, rollback, and supersession receipt controls", "Zero-automation release lifecycle controls"]) {
  check(ledger.evidence_stage_counts[stage] === 9, `Phase 57Q must publish nine records for ${stage}.`);
}
check(ledger.evidence_stage_counts["Manual release, publication-bundle, and rollback hold"] === 9, "Phase 57Q must preserve nine release-lifecycle holds.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57Q source-profile counts are incorrect.");
check(ledger.release_checklist_schemas === 9 && ledger.publication_bundle_schemas === 9 && ledger.lifecycle_state_machines === 9, "Phase 57Q must define twenty-seven contract-specific schemas.");
check(ledger.release_authorization_cases === 126 && ledger.publication_bundle_cases === 126 && ledger.withdrawal_rollback_lifecycle_cases === 144, "Phase 57Q case-class totals are incorrect.");
check(ledger.valid_manual_authorization_routes === 9 && ledger.rejected_release_routes === 117 && ledger.valid_bundle_routes === 9 && ledger.rejected_bundle_routes === 117, "Phase 57Q valid and rejected release or bundle routes are incorrect.");
check(ledger.release_append_routes === 9 && ledger.publication_append_routes === 9 && ledger.withdrawal_append_routes === 9 && ledger.rollback_append_routes === 9 && ledger.supersession_append_routes === 9 && ledger.history_preservation_routes === 9 && ledger.rejected_lifecycle_routes === 90, "Phase 57Q lifecycle route totals are incorrect.");
check(ledger.total_workflow_cases === 396 && ledger.workflow_test_failures === 0, "All 396 Phase 57Q workflow cases must pass.");
check(ledger.actual_candidate_packets_evaluated === 0 && ledger.actual_reviewer_identities === 0 && ledger.actual_release_actors === 0 && ledger.actual_release_authorizations === 0 && ledger.actual_publication_bundles === 0 && ledger.actual_publications === 0 && ledger.actual_withdrawals === 0 && ledger.actual_rollbacks === 0 && ledger.actual_supersessions === 0, "Phase 57Q must record zero actual lifecycle actors, artifacts, receipts, and events.");
check(ledger.eligible_records_accepted === 0 && ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57Q must record zero accept decisions, acquisitions, triggers, contacts, and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.capability_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.operating_outcome_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57Q must preserve scope, implementation, capability, closure, and outcome state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57p.post_batch_visible_scope), "Phase 57Q must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57Q must preserve the 1 / 21 / 2 entity ledger.");

const statuses = countBy(ledger.records, "record_status");
check(statuses.Published === 36 && statuses["In Review"] === 9, "Phase 57Q record statuses are incorrect.");
check(documents.length === 45 && signals.length === 45 && collection.document_ids.length === 45, "Phase 57Q must generate forty-five documents, signals, and collection members.");
check(review.promoted_document_ids.length === 36 && review.promoted_signal_ids.length === 36 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57Q publication-review counts are incorrect.");

check(releases.phase === "57Q" && releases.checklist_schema_count === 9 && releases.release_case_count === 126, "Phase 57Q release registry totals are incorrect.");
check(releases.valid_manual_authorization_routes === 9 && releases.rejected_release_routes === 117 && releases.passed_case_count === 126 && releases.failed_case_count === 0, "All release cases must pass with nine bounded valid routes and 117 rejections.");
check(releases.schemas.every((schema) => schema.required_items.length === 12 && schema.required_role_separation.length === 3 && schema.release_actor_type === "named_human" && !schema.automatic_release_allowed && !schema.automatic_publication_allowed), "Every release checklist must require twelve items, three separated roles, a human actor, and no automation.");
check(Object.keys(releases.case_distribution).length === 14 && Object.values(releases.case_distribution).every((count) => count === 9), "Every release test class must execute once per contract.");

check(bundles.phase === "57Q" && bundles.bundle_schema_count === 9 && bundles.bundle_case_count === 126, "Phase 57Q bundle registry totals are incorrect.");
check(bundles.valid_bundle_routes === 9 && bundles.rejected_bundle_routes === 117 && bundles.passed_case_count === 126 && bundles.failed_case_count === 0, "All bundle cases must pass with nine bounded valid routes and 117 rejections.");
check(bundles.schemas.every((schema) => schema.required_digest_fields.length === 5 && schema.canonical_hash_algorithm === "sha256" && schema.canonical_artifact_order_required && schema.immutable_after_signature), "Every bundle schema must bind five digest classes using canonical immutable SHA-256 manifests.");
check(Object.keys(bundles.case_distribution).length === 14 && Object.values(bundles.case_distribution).every((count) => count === 9), "Every bundle test class must execute once per contract.");

check(lifecycles.phase === "57Q" && lifecycles.lifecycle_schema_count === 9 && lifecycles.lifecycle_case_count === 144, "Phase 57Q lifecycle registry totals are incorrect.");
check(lifecycles.release_append_routes === 9 && lifecycles.publication_append_routes === 9 && lifecycles.withdrawal_append_routes === 9 && lifecycles.rollback_append_routes === 9 && lifecycles.supersession_append_routes === 9 && lifecycles.history_preservation_routes === 9 && lifecycles.rejected_lifecycle_routes === 90, "Lifecycle append, preservation, and rejection totals are incorrect.");
check(lifecycles.passed_case_count === 144 && lifecycles.failed_case_count === 0 && lifecycles.actual_publications === 0 && lifecycles.actual_withdrawals === 0 && lifecycles.actual_rollbacks === 0 && lifecycles.actual_supersessions === 0 && lifecycles.prior_events_mutated === 0, "Lifecycle cases must pass without actual events or history mutation.");
check(lifecycles.schemas.every((schema) => schema.append_only_event_types.length === 5 && schema.prohibited_side_effects.length === 9 && schema.rollback_scope === "publication_state_only"), "Every lifecycle schema must preserve five event types and prohibit nine side effects.");
check(Object.keys(lifecycles.case_distribution).length === 16 && Object.values(lifecycles.case_distribution).every((count) => count === 9), "Every lifecycle test class must execute once per contract.");

for (const rows of [releases.cases, bundles.cases, lifecycles.cases]) {
  check(rows.every((row) => row.passed && row.fixture_only && !row.actual_release_authorization && !row.actual_publication_bundle && !row.actual_publication_event && !row.actual_withdrawal && !row.actual_rollback && !row.prior_history_mutated && !row.evidence_created && !row.fires_trigger && !row.closes_hold_automatically && !row.publishes_automatically), "All Phase 57Q cases must remain passing, synthetic, immutable, and non-automating.");
}
check(harness.phase === "57Q" && harness.total_case_count === 396 && harness.passed_case_count === 396 && harness.failed_case_count === 0, "Phase 57Q aggregate harness totals are incorrect.");
check(new Set(harness.test_ids).size === 396, "Phase 57Q test identifiers must be unique.");
check(harness.actual_candidate_packets_evaluated === 0 && harness.actual_reviewer_identities === 0 && harness.actual_release_actors === 0 && harness.actual_release_authorizations === 0 && harness.actual_publication_bundles === 0 && harness.actual_publications === 0 && harness.actual_withdrawals === 0 && harness.actual_rollbacks === 0 && harness.actual_supersessions === 0 && harness.eligible_records_accepted === 0 && harness.reopening_triggers_fired === 0 && harness.automated_closures_or_publications === 0 && harness.evidence_records_created === 0, "Phase 57Q aggregate harness must record zero actual workflow and evidence events.");

const priorHoldKeys = phase57pHolds.map((record) => record.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57p_holds].sort()) === JSON.stringify(priorHoldKeys), "Phase 57Q must preserve all Phase 57P holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57Q must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57Q hold lineage must preserve nine unique parents and contracts.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57Q")), `${file} must include a Phase 57Q watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes("research-collection-manual-release-authorization-publication-bundles-withdrawal-rollback-receipts-2026"), `${file} must link the Phase 57Q collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57Q manual release, immutable bundles, and reversible publication"), `${file} must include the Phase 57Q dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57q-manual-release-bundles"), "Dependency map must include the Phase 57Q node.");
check(map.links.filter((link) => link.from === "node-phase57q-manual-release-bundles").length === 3, "Dependency map must include three Phase 57Q links.");

if (errors.length) {
  console.error("Phase 57Q assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57Q assertions passed: 36 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 27 contract-specific schemas, 396 workflow cases, zero actual lifecycle events, zero triggers, and unchanged scope, outcome, and closure ledgers.");
