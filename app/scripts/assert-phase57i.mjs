import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57i-versioned-registry-change-detection-bounded-observation-ingestion.json"));
const review = await readJson(join(dataRoot, "phase-57i-publication-review.json"));
const phase57h = await readJson(join(dataRoot, "phase-57h-registry-revision-provenance-compatible-observation-joins.json"));
const amtrak = await readJson(join(dataRoot, "phase-57i-amtrak-source-diff-queue.json"));
const montana = await readJson(join(dataRoot, "phase-57i-montana-schema-migration-project-quarter-intake.json"));
const hanford = await readJson(join(dataRoot, "phase-57i-hanford-bounded-observation-validator.json"));
const nnsa = await readJson(join(dataRoot, "phase-57i-nnsa-object-level-source-diff-ledger.json"));
const collection = await readJson(join(contentRoot, "research-collections", "versioned-registry-change-detection-bounded-observation-ingestion-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57i-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57i-") && name.endsWith(".mdx"));

check(ledger.phase === "57I", "Phase 57I ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((item) => item.record_id)).size === 29, "Phase 57I must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57I must publish twenty records and hold nine.");
check(ledger.evidence_stage_counts["Versioned station change detection"] === 5, "Phase 57I must publish five Amtrak controls.");
check(ledger.evidence_stage_counts["Schema migration and bounded intake"] === 5, "Phase 57I must publish five Montana controls.");
check(ledger.evidence_stage_counts["Compatible-observation validation"] === 5, "Phase 57I must publish five Hanford controls.");
check(ledger.evidence_stage_counts["Object-level source diff"] === 5, "Phase 57I must publish five NNSA controls.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57I source-profile counts are incorrect.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57I must record zero target acquisitions, triggers, contacts, and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57I must preserve directive and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57h.post_batch_visible_scope), "Phase 57I must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57I must preserve the 1 / 21 / 2 entity ledger.");
check(documents.length === 29 && documents.filter((item) => item.record_status === "Published").length === 20 && documents.filter((item) => item.record_status === "In Review").length === 9, "Phase 57I document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57I document must be an official-link record.");
check(signalFiles.length === 29 && collection.document_ids.length === 29, "Phase 57I must generate twenty-nine signals and collection documents.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57I publication-review counts are incorrect.");

check(amtrak.current_name_queue_count === 16 && amtrak.historical_identity_queue_count === 178, "Amtrak diff queue must retain 16 current and 178 historical identities.");
check(amtrak.accepted_identity_joins === 11 && amtrak.unresolved_identity_joins === 5, "Amtrak identity decisions must remain 11 accepted and 5 unresolved.");
check(amtrak.official_station_codes_present === 0 && amtrak.official_station_codes_pending === 16, "Amtrak source-explicit station-code state is incorrect.");
check(amtrak.asserted_additions === 0 && amtrak.asserted_removals === 0 && amtrak.asserted_renames === 0 && amtrak.asserted_replacements === 0, "Amtrak must assert zero structural registry changes.");
check(amtrak.current_name_diff_queue.every((row) => row.operating_outcome === null), "Amtrak diff rows must not imply operating outcomes.");
check(JSON.stringify(amtrak.current_name_diff_queue.filter((row) => row.identity_review_state.startsWith("blocked")).map((row) => row.current_display_name).sort()) === JSON.stringify(["Du Quoin", "Granby", "Hamlet", "Pomona", "Rocklin"].sort()), "Amtrak unresolved queue is incorrect.");

check(montana.field_migration_decision_count === 13 && montana.project_quarter_envelope_count === 32, "Montana migration or envelope counts are incorrect.");
check(montana.reporting_rail_counts.terrestrial === 30 && montana.reporting_rail_counts.LEO === 2, "Montana reporting-rail counts must be 30 terrestrial and 2 LEO.");
check(montana.completed_project_quarters_ingested === 0 && montana.accepted_field_migrations === 0, "Montana must ingest zero completed quarters and accept zero unversioned migrations.");
check(montana.field_migration_rows.every((row) => !row.automatic_migration_allowed && row.operating_outcome === null), "Montana field migrations must remain review-gated.");
check(montana.project_quarter_envelopes.every((row) => row.ingestion_state === "waiting_for_completed_public_project_quarter" && row.operating_outcome === null), "Montana project-quarter envelopes must remain waiting with null outcomes.");
check(montana.individual_bsl_identifiers_published === 0 && montana.individual_cai_details_published === 0 && montana.automatic_cross_rail_migrations === 0, "Montana privacy and cross-rail boundaries changed.");

check(hanford.validator_field_count === 11 && hanford.bounded_standalone_observations_ingested === 9, "Hanford validator must retain eleven fields and nine standalone observations.");
check(hanford.observation_pair_decisions === 36 && hanford.accepted_direct_numeric_joins === 0 && hanford.rejected_direct_numeric_joins === 36, "Hanford pair decisions must reject all thirty-six direct joins.");
check(hanford.pair_validation_decisions.every((row) => !row.direct_numeric_join_allowed && row.failed_checks.length > 0 && row.operating_outcome === null), "Every Hanford pair must have explicit failed checks and a null outcome.");
check(hanford.observation_envelopes.every((row) => row.ingestion_state === "accepted_as_bounded_standalone_observation" && !row.numeric_join_eligible), "Hanford standalone envelopes must remain non-joinable.");
check(hanford.public_batch_ids === 0 && hanford.public_container_ids === 0 && hanford.complete_material_balances === 0, "Hanford public identity and material-balance counts must remain zero.");

check(nnsa.object_count === 18 && nnsa.source_version_count === 4 && nnsa.object_version_cell_count === 72, "NNSA ledger counts must be 18 objects, 4 versions, and 72 cells.");
check(nnsa.bounded_diff_event_count === 10 && nnsa.accepted_bounded_diff_events === 10, "NNSA must retain ten bounded source-diff events.");
check(nnsa.object_version_cells.every((row) => row.operating_outcome === null), "NNSA object-version cells must not imply operating outcomes.");
check(nnsa.bounded_diff_queue.every((row) => row.review_state === "accepted_as_bounded_object_level_diff" && row.operating_outcome === null && !row.implementation_change && !row.closure_change), "NNSA bounded diffs must preserve outcome, implementation, and closure boundaries.");
check(nnsa.operating_outcomes_ingested === 0 && nnsa.implementation_changes === 0 && nnsa.closure_changes === 0, "NNSA state promotions must remain zero.");

const phase57hHolds = phase57h.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
const inheritedParents = ledger.records.filter((item) => item.parent_hold_key).map((item) => item.parent_hold_key).sort();
check(JSON.stringify([...ledger.preserved_phase57h_holds].sort()) === JSON.stringify(phase57hHolds) && JSON.stringify(inheritedParents) === JSON.stringify(phase57hHolds) && phase57hHolds.length === 9, "All nine Phase 57H holds must be preserved exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57I must add no new visible hold.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion"), file + " must link Research Watch 039.");
  check(pathway.research_collection_ids.includes("research-collection-versioned-registry-change-detection-bounded-observation-ingestion-2026"), file + " must link the Phase 57I collection.");
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57I change-detection and bounded-ingestion rails"), file + " must include the Phase 57I dependency stage.");
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57i-ingestion-rails"), "Dependency map must include the Phase 57I node.");
check(map.links.filter((link) => link.from === "node-phase57i-ingestion-rails").length === 3, "Dependency map must include three Phase 57I links.");
await access(join(appRoot, "public", "downloads", "versioned-registry-change-detection-bounded-observation-ingestion-2026.zip"));

if (failures.length) {
  console.error("Phase 57I assertions failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("Phase 57I assertions passed: 20 Published controls, 9 In Review holds, 36 carried Tier 1 sources, four structured rails, all 9 Phase 57H holds preserved, no new hold, and unchanged scope and closure ledgers.");
