import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57k-cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry.json"));
const review = await readJson(join(dataRoot, "phase-57k-publication-review.json"));
const phase57j = await readJson(join(dataRoot, "phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution.json"));
const amtrak = await readJson(join(dataRoot, "phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json"));
const montana = await readJson(join(dataRoot, "phase-57k-montana-project-field-compatibility-matrix.json"));
const hanford = await readJson(join(dataRoot, "phase-57k-hanford-observation-transition-applicability-matrix.json"));
const nnsa = await readJson(join(dataRoot, "phase-57k-nnsa-object-transition-dimension-matrix.json"));
const triggers = await readJson(join(dataRoot, "phase-57k-reopening-trigger-registry.json"));
const collection = await readJson(join(contentRoot, "research-collections", "cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57k-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57k-") && name.endsWith(".mdx"));

check(ledger.phase === "57K", "Phase 57K ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((item) => item.record_id)).size === 29, "Phase 57K must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57K must publish twenty records and hold nine.");
check(ledger.evidence_stage_counts["Identity-snapshot longitudinal matrix"] === 5, "Phase 57K must publish five Amtrak controls.");
check(ledger.evidence_stage_counts["Project-field compatibility matrix"] === 5, "Phase 57K must publish five Montana controls.");
check(ledger.evidence_stage_counts["Observation-transition applicability matrix"] === 5, "Phase 57K must publish five Hanford controls.");
check(ledger.evidence_stage_counts["Object-version transition matrix"] === 5, "Phase 57K must publish five NNSA controls.");
check(ledger.evidence_stage_counts["Reopening-trigger contract hold"] === 9, "Phase 57K must preserve nine reopening-contract holds.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57K source-profile counts are incorrect.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57K must record zero acquisitions, triggers, contacts, and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57K must preserve directive and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57j.post_batch_visible_scope), "Phase 57K must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57K must preserve the 1 / 21 / 2 entity ledger.");
check(documents.length === 29 && documents.filter((item) => item.record_status === "Published").length === 20 && documents.filter((item) => item.record_status === "In Review").length === 9, "Phase 57K document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57K document must be an official-link record.");
check(signalFiles.length === 29 && collection.document_ids.length === 29, "Phase 57K must generate twenty-nine signals and collection documents.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57K publication-review counts are incorrect.");

check(amtrak.identity_count === 178 && amtrak.snapshot_count === 2 && amtrak.presence_cell_count === 356 && amtrak.longitudinal_transition_count === 178, "Amtrak longitudinal dimensions are incorrect.");
check(amtrak.presence_state_counts.present_in_source_snapshot === 178 && amtrak.presence_state_counts.bounded_cohort_observation_linked === 11 && amtrak.presence_state_counts.not_observed_in_bounded_cohort_no_deletion_inference === 167, "Amtrak presence-state counts are incorrect.");
check(amtrak.transition_classification_counts.historical_presence_to_bounded_current_observation === 11 && amtrak.transition_classification_counts.historical_presence_to_current_nonobservation_no_deletion_inference === 167, "Amtrak transition-state counts are incorrect.");
check(amtrak.current_name_queue_count === 16 && amtrak.unresolved_identity_count === 5, "Amtrak name-lineage queue counts are incorrect.");
check(amtrak.presence_matrix.every((row) => row.structural_change === "not_asserted" && row.operating_outcome === null) && amtrak.longitudinal_transitions.every((row) => !row.observed_structural_event && row.operating_outcome === null), "Amtrak matrix must retain null structural and outcome states.");
check(amtrak.asserted_additions === 0 && amtrak.asserted_removals === 0 && amtrak.asserted_renames === 0 && amtrak.asserted_replacements === 0 && amtrak.operating_outcomes_ingested === 0, "Amtrak must promote zero structural changes and outcomes.");

check(montana.project_count === 32 && montana.field_count === 13 && montana.compatibility_cell_count === 416, "Montana project-field matrix dimensions are incorrect.");
check(montana.compatibility_state_counts.blocked_missing_compatible_official_target_schema === 352 && montana.compatibility_state_counts.blocked_missing_official_code_dictionary === 32 && montana.compatibility_state_counts.blocked_missing_validated_completed_project_quarter === 32, "Montana compatibility blocker counts are incorrect.");
check(montana.compatible_cells === 0 && montana.blocked_cells === 416 && montana.compatibility_matrix.every((row) => !row.migration_allowed && row.accepted_value === null && row.operating_outcome === null), "Montana compatibility cells must remain blocked and null.");
check(montana.terrestrial_projects === 30 && montana.leo_projects === 2 && montana.envelope_requirement_count === 7 && montana.envelope_requirement_check_count === 224 && montana.envelope_requirements_met === 0, "Montana rail or requirement-check counts are incorrect.");
check(montana.project_envelope_requirement_checks.every((row) => row.state === "unmet" && row.source_value === null && row.accepted_observation === null), "Every Montana envelope requirement must remain explicitly unmet.");
check(montana.completed_project_quarters_ingested === 0 && montana.individual_bsl_identifiers_published === 0 && montana.individual_cai_details_published === 0 && montana.automatic_cross_rail_migrations === 0, "Montana privacy, outcome, or cross-rail boundaries changed.");

check(hanford.observation_count === 9 && hanford.transition_count === 14 && hanford.applicability_cell_count === 126, "Hanford applicability matrix dimensions are incorrect.");
check(hanford.applicability_state_counts.stage_not_applicable === 106 && hanford.applicability_state_counts.to_stage_candidate_requires_identity_and_custody === 12 && hanford.applicability_state_counts.from_stage_candidate_requires_identity_and_custody === 8, "Hanford applicability-state counts are incorrect.");
check(hanford.transition_requirement_types === 5 && hanford.transition_requirement_check_count === 70 && hanford.transition_requirements_met === 0, "Hanford transition-requirement counts are incorrect.");
check(hanford.observation_transition_applicability_matrix.every((row) => !row.join_eligible && !row.accepted_custody_link && row.operating_outcome === null), "Every Hanford applicability cell must remain non-joinable.");
check(hanford.transition_requirement_checks.every((row) => row.state === "unmet" && row.evidence_value === null && !row.custody_transfer_accepted), "Every Hanford transition requirement must remain unmet.");
check(hanford.accepted_observation_transition_joins === 0 && hanford.public_batch_ids === 0 && hanford.public_container_ids === 0 && hanford.accepted_custody_transfers === 0 && hanford.complete_material_balances === 0, "Hanford identity, custody, or material-balance counts changed.");

check(nnsa.object_count === 18 && nnsa.source_version_count === 4 && nnsa.adjacent_source_transition_count === 3 && nnsa.object_transition_count === 54, "NNSA object-transition dimensions are incorrect.");
check(nnsa.classification_dimension_count === 12 && nnsa.transition_dimension_cell_count === 648, "NNSA must classify twelve dimensions across 648 transition cells.");
check(nnsa.transition_classification_counts.bounded_dimension_state_unchanged === 288 && nnsa.transition_classification_counts.authority_boundary_change_requires_review === 216 && nnsa.transition_classification_counts.bounded_dimension_state_change_requires_exact_extraction === 24 && nnsa.transition_classification_counts.source_scope_change_requires_review === 120, "NNSA transition-classification counts are incorrect.");
check(nnsa.authority_boundary_transition_count === 18 && nnsa.bounded_diff_events_retained === 10, "NNSA authority-boundary or bounded-diff counts are incorrect.");
check(nnsa.transition_dimension_matrix.every((row) => row.operating_outcome === null && !row.implementation_change && !row.closure_change), "Every NNSA transition cell must retain zero promotions.");
check(nnsa.operating_outcomes_ingested === 0 && nnsa.implementation_changes === 0 && nnsa.capability_promotions === 0 && nnsa.closure_changes === 0, "NNSA state promotions must remain zero.");

check(triggers.contract_count === 9 && triggers.contracts_triggered === 0 && triggers.contracts_not_triggered === 9 && triggers.automated_publication_contracts === 0, "Reopening-contract registry counts are incorrect.");
check(new Set(triggers.contracts.map((item) => item.contract_id)).size === 9, "Reopening contract IDs must be unique.");
check(triggers.contracts.every((item) => item.required_fields.length === item.required_field_count && item.required_field_count >= 5 && item.trigger_state === "not_fired" && !item.evidence_received && !item.automated_publication_allowed && item.publication_state === "remains_in_review"), "Every reopening contract must remain complete, not fired, and human-reviewed.");
const phase57jHolds = phase57j.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
const inheritedParents = ledger.records.filter((item) => item.parent_hold_key).map((item) => item.parent_hold_key).sort();
check(JSON.stringify([...ledger.preserved_phase57j_holds].sort()) === JSON.stringify(phase57jHolds) && JSON.stringify(inheritedParents) === JSON.stringify(phase57jHolds) && phase57jHolds.length === 9, "All nine Phase 57J holds must be preserved exactly once.");
check(JSON.stringify([...ledger.reopening_contract_ids].sort()) === JSON.stringify(triggers.contracts.map((item) => item.contract_id).sort()), "Every hold must link one reopening contract.");
check(ledger.new_visible_holds.length === 0, "Phase 57K must add no new visible hold.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-041-cross-version-transition-matrices-longitudinal-panels"), `${file} must link Research Watch 041.`);
  check(pathway.research_collection_ids.includes("research-collection-cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry-2026"), `${file} must link the Phase 57K collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57K cross-version transition matrices and reopening contracts"), `${file} must include the Phase 57K dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57k-transition-matrices"), "Dependency map must include the Phase 57K node.");
check(map.links.filter((link) => link.from === "node-phase57k-transition-matrices").length === 3, "Dependency map must include three Phase 57K links.");
await access(join(appRoot, "public", "downloads", "cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry-2026.zip"));

if (failures.length) {
  console.error("Phase 57K assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57K assertions passed: 20 Published transition controls, 9 In Review holds, 36 carried Tier 1 sources, four longitudinal matrices, 1,546 bounded matrix cells, 294 requirement checks, 9 not-fired reopening contracts, all Phase 57J holds preserved, and unchanged scope and closure ledgers.");
