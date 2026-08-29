import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution.json"));
const review = await readJson(join(dataRoot, "phase-57j-publication-review.json"));
const phase57i = await readJson(join(dataRoot, "phase-57i-versioned-registry-change-detection-bounded-observation-ingestion.json"));
const amtrak = await readJson(join(dataRoot, "phase-57j-amtrak-historical-snapshot-review-queue.json"));
const montana = await readJson(join(dataRoot, "phase-57j-montana-migration-envelope-rejection-taxonomy.json"));
const hanford = await readJson(join(dataRoot, "phase-57j-hanford-observation-transition-rejection-taxonomy.json"));
const nnsa = await readJson(join(dataRoot, "phase-57j-nnsa-object-version-classification-queue.json"));
const collection = await readJson(join(contentRoot, "research-collections", "historical-backfill-rejection-taxonomy-review-queue-execution-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57j-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57j-") && name.endsWith(".mdx"));

check(ledger.phase === "57J", "Phase 57J ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((item) => item.record_id)).size === 29, "Phase 57J must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57J must publish twenty records and hold nine.");
check(ledger.evidence_stage_counts["Historical identity backfill"] === 5, "Phase 57J must publish five Amtrak controls.");
check(ledger.evidence_stage_counts["Migration and envelope rejection taxonomy"] === 5, "Phase 57J must publish five Montana controls.");
check(ledger.evidence_stage_counts["Observation and transition rejection taxonomy"] === 5, "Phase 57J must publish five Hanford controls.");
check(ledger.evidence_stage_counts["Object-version classification queue"] === 5, "Phase 57J must publish five NNSA controls.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57J source-profile counts are incorrect.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57J must record zero target acquisitions, triggers, contacts, and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57J must preserve directive and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57i.post_batch_visible_scope), "Phase 57J must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57J must preserve the 1 / 21 / 2 entity ledger.");
check(documents.length === 29 && documents.filter((item) => item.record_status === "Published").length === 20 && documents.filter((item) => item.record_status === "In Review").length === 9, "Phase 57J document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57J document must be an official-link record.");
check(signalFiles.length === 29 && collection.document_ids.length === 29, "Phase 57J must generate twenty-nine signals and collection documents.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57J publication-review counts are incorrect.");

check(amtrak.source_snapshot_count === 2 && amtrak.historical_identity_decision_count === 178 && amtrak.historical_presence_count === 178, "Amtrak must retain two snapshots and 178 historical presence decisions.");
check(amtrak.current_bounded_observation_links === 11 && amtrak.historical_only_retentions === 167, "Amtrak current-link and historical-retention counts are incorrect.");
check(amtrak.current_name_queue_count === 16 && amtrak.accepted_exact_identity_links === 10 && amtrak.accepted_controlled_alias_links === 1 && amtrak.rejected_unresolved_identity_links === 5, "Amtrak current identity queue decisions are incorrect.");
check(amtrak.historical_identity_decisions.every((row) => row.historical_snapshot_presence === "present" && row.structural_change_decision === "not_asserted" && row.operating_outcome === null), "Every Amtrak historical row must preserve bounded presence and null outcomes.");
check(amtrak.current_name_review_queue.filter((row) => row.review_disposition.startsWith("rejected")).every((row) => row.rejection_reason_codes.length === 2), "Each unresolved Amtrak row must retain both rejection reasons.");
check(amtrak.asserted_additions === 0 && amtrak.asserted_removals === 0 && amtrak.asserted_renames === 0 && amtrak.asserted_replacements === 0 && amtrak.operating_outcomes_ingested === 0, "Amtrak must promote zero structural changes and outcomes.");

check(montana.migration_test_count === 13 && montana.migration_tests_accepted === 0 && montana.migration_tests_rejected === 13, "Montana migration test counts are incorrect.");
check(montana.migration_rejection_counts.missing_compatible_official_target_schema === 11 && montana.migration_rejection_counts.missing_official_code_dictionary === 1 && montana.migration_rejection_counts.missing_validated_completed_project_quarter === 1, "Montana migration rejection taxonomy is incorrect.");
check(montana.project_envelope_test_count === 32 && montana.project_envelopes_accepted === 0 && montana.project_envelopes_rejected === 32, "Montana project-envelope decisions are incorrect.");
check(montana.reporting_rail_counts.terrestrial === 30 && montana.reporting_rail_counts.LEO === 2, "Montana reporting rails must remain 30 terrestrial and 2 LEO.");
check(Object.values(montana.envelope_rejection_counts).every((count) => count === 32) && montana.project_envelope_tests.every((row) => row.rejection_reason_codes.length === 7 && row.operating_outcome === null), "Every Montana envelope must retain seven explicit rejection classes and a null outcome.");
check(montana.completed_project_quarters_ingested === 0 && montana.individual_bsl_identifiers_published === 0 && montana.individual_cai_details_published === 0 && montana.automatic_cross_rail_migrations === 0, "Montana privacy, outcome, or cross-rail boundaries changed.");

check(hanford.standalone_observation_review_count === 9 && hanford.bounded_standalone_observations_retained === 9 && hanford.observation_join_reviews_rejected === 9, "Hanford observation-review counts are incorrect.");
check(Object.values(hanford.observation_join_rejection_counts).every((count) => count === 9) && hanford.normalized_observation_reviews.every((row) => row.join_rejection_reason_codes.length === 6 && !row.material_balance_eligible), "Every Hanford observation must retain six join blockers.");
check(hanford.pair_review_count === 36 && hanford.pair_reviews_accepted === 0 && hanford.pair_reviews_rejected === 36, "Hanford pair-review counts are incorrect.");
check(hanford.pair_primary_rejection_counts.stage === 32 && hanford.pair_primary_rejection_counts.measure === 4, "Hanford primary pair-rejection taxonomy must be 32 stage and 4 measure.");
check(hanford.pair_all_failure_counts.identity === 36 && hanford.pair_all_failure_counts.period === 35 && hanford.pair_all_failure_counts.authority === 20, "Hanford complete pair-failure counts changed.");
check(hanford.transition_review_count === 14 && hanford.transition_reviews_accepted === 0 && hanford.transition_reviews_rejected === 14 && hanford.transition_evidence_reviews.every((row) => row.rejection_reason_codes.length === 5 && !row.custody_transfer_accepted), "Hanford transition rejection taxonomy is incorrect.");
check(hanford.public_batch_ids === 0 && hanford.public_container_ids === 0 && hanford.accepted_custody_transfers === 0 && hanford.complete_material_balances === 0, "Hanford public identity, custody, or material-balance counts changed.");

check(nnsa.object_count === 18 && nnsa.source_version_count === 4 && nnsa.object_version_cell_count === 72, "NNSA ledger counts must remain 18 objects, 4 versions, and 72 cells.");
check(nnsa.classification_dimension_count === 12 && nnsa.dimension_classification_count === 864, "NNSA must classify twelve dimensions across 864 cell-dimension pairs.");
check(nnsa.presence_classification_counts.agency_source_object_state_present_bounded === 30 && nnsa.presence_classification_counts.not_used_for_this_object_scope === 30 && nnsa.presence_classification_counts.independent_project_assessment_present === 11 && nnsa.presence_classification_counts.independent_recommendation_status_present === 1, "NNSA presence-classification counts are incorrect.");
check(nnsa.object_version_classification_queue.every((row) => Object.keys(row.dimension_states).length === 12 && row.promoted_operating_outcome === null && !row.implementation_change && !row.closure_change), "Every NNSA cell must retain twelve bounded dimensions and zero promotions.");
check(nnsa.bounded_diff_review_count === 10 && nnsa.bounded_diff_review_queue.every((row) => row.phase57j_review_state === "retained_bounded_source_diff" && row.classified_dimensions.length === 12), "NNSA bounded-diff queue is incomplete.");
check(nnsa.operating_outcomes_ingested === 0 && nnsa.implementation_changes === 0 && nnsa.capability_promotions === 0 && nnsa.closure_changes === 0, "NNSA state promotions must remain zero.");

const phase57iHolds = phase57i.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
const inheritedParents = ledger.records.filter((item) => item.parent_hold_key).map((item) => item.parent_hold_key).sort();
check(JSON.stringify([...ledger.preserved_phase57i_holds].sort()) === JSON.stringify(phase57iHolds) && JSON.stringify(inheritedParents) === JSON.stringify(phase57iHolds) && phase57iHolds.length === 9, "All nine Phase 57I holds must be preserved exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57J must add no new visible hold.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution"), file + " must link Research Watch 040.");
  check(pathway.research_collection_ids.includes("research-collection-historical-backfill-rejection-taxonomy-review-queue-execution-2026"), file + " must link the Phase 57J collection.");
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57J historical backfill and rejection taxonomy"), file + " must include the Phase 57J dependency stage.");
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57j-review-queue-execution"), "Dependency map must include the Phase 57J node.");
check(map.links.filter((link) => link.from === "node-phase57j-review-queue-execution").length === 3, "Dependency map must include three Phase 57J links.");
await access(join(appRoot, "public", "downloads", "historical-backfill-rejection-taxonomy-review-queue-execution-2026.zip"));

if (failures.length) {
  console.error("Phase 57J assertions failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("Phase 57J assertions passed: 20 Published controls, 9 In Review holds, 36 carried Tier 1 sources, four executed review rails, complete rejection taxonomies, all 9 Phase 57I holds preserved, no new hold, and unchanged scope and closure ledgers.");
