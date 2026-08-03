import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57h-registry-revision-provenance-compatible-observation-joins.json"));
const review = await readJson(join(dataRoot, "phase-57h-publication-review.json"));
const phase57g = await readJson(join(dataRoot, "phase-57g-named-asset-project-cohort-registry-expansion.json"));
const amtrak = await readJson(join(dataRoot, "phase-57h-amtrak-station-alias-revision-matrix.json"));
const montana = await readJson(join(dataRoot, "phase-57h-montana-field-provenance-version-matrix.json"));
const hanford = await readJson(join(dataRoot, "phase-57h-hanford-authority-observation-compatibility-matrix.json"));
const nnsa = await readJson(join(dataRoot, "phase-57h-nnsa-fy26-fy27-gao-change-history.json"));
const collection = await readJson(join(contentRoot, "research-collections", "registry-revision-provenance-compatible-observation-joins-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57h-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57h-") && name.endsWith(".mdx"));

check(ledger.phase === "57H", "Phase 57H ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((item) => item.record_id)).size === 29, "Phase 57H must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57H must publish twenty records and hold nine.");
check(ledger.evidence_stage_counts["Alias and revision provenance"] === 5 && ledger.evidence_stage_counts["Field provenance and version compatibility"] === 5 && ledger.evidence_stage_counts["Authority and observation compatibility"] === 5 && ledger.evidence_stage_counts["Work-breakdown version history"] === 5, "Phase 57H must publish five panels in each matrix family.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57H source-profile counts are incorrect.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57H must record zero target acquisitions, triggers, contacts, and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57H must preserve directive and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57g.post_batch_visible_scope), "Phase 57H must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57H must preserve the 1 / 21 / 2 entity ledger.");
check(documents.length === 29 && documents.filter((item) => item.record_status === "Published").length === 20 && documents.filter((item) => item.record_status === "In Review").length === 9, "Phase 57H document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57H document must be an official-link record.");
check(signalFiles.length === 29 && collection.document_ids.length === 29, "Phase 57H must generate twenty-nine signals and collection documents.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57H publication-review counts are incorrect.");

check(amtrak.historical_station_count === 178 && amtrak.current_distinct_name_count === 16 && amtrak.current_cohort_membership_count === 19, "Amtrak revision denominators must be 178 / 16 / 19.");
check(amtrak.exact_matches === 10 && amtrak.controlled_alias_matches === 1 && amtrak.unresolved_current_names.length === 5, "Amtrak match counts must be 10 exact, 1 controlled alias, and 5 unresolved.");
check(JSON.stringify([...amtrak.unresolved_current_names].sort()) === JSON.stringify(["Du Quoin", "Granby", "Hamlet", "Pomona", "Rocklin"].sort()), "Amtrak unresolved names are incorrect.");
check(amtrak.current_station_rows.find((row) => row.current_display_name === "Mount Pleasant")?.historical_display_name === "Mt. Pleasant", "Mount Pleasant must resolve only through the controlled alias rule.");
check(amtrak.historical_revision_rows.every((row) => row.removal_state === "not_assessed" && row.outcome_state === null), "Amtrak historical nonappearance must not imply removal or outcome.");

check(montana.field_count === 13 && montana.project_count === 32 && montana.field_dictionary.length === 13 && montana.project_versions.length === 32, "Montana field or project matrix counts are incorrect.");
check(JSON.stringify(montana.technology_code_values) === JSON.stringify(["50", "61", "70", "71", "72"]), "Montana raw technology-code values are incorrect.");
check(montana.technology_code_definition_state === "unresolved_official_mapping", "Montana code definitions must remain unresolved.");
check(montana.privacy_boundary.individual_bsl_identifiers_published === 0 && montana.privacy_boundary.individual_cai_details_published === 0, "Montana public output must retain the privacy boundary.");
check(montana.project_versions.every((row) => row.current_completed_project_quarter === null && row.current_service_state === null && row.current_adoption_state === null && row.current_acceptance_state === null), "Montana project outcome slots must remain null.");

check(hanford.authority_count === 9 && hanford.transition_count === 14 && hanford.observation_count === 9 && hanford.observation_pair_count === 36, "Hanford matrix counts must be 9 / 14 / 9 / 36.");
check(hanford.direct_numeric_joins_allowed === 0 && hanford.observation_pairs.every((row) => !row.direct_numeric_join_allowed), "Hanford must permit zero direct numeric joins.");
check(hanford.public_batch_ids === 0 && hanford.public_container_ids === 0, "Hanford public batch and container identity counts must remain zero.");
check(hanford.observation_pairs.some((row) => row.compatibility === "same_unit_different_stage_not_directly_comparable") && hanford.observation_pairs.some((row) => row.compatibility === "milestone_and_quantity_not_directly_comparable"), "Hanford pair classifications are incomplete.");
check(hanford.nonconversion_rules.length === 4, "Hanford must preserve all four nonconversion rules.");

check(nnsa.object_count === 18 && nnsa.object_history.length === 18 && nnsa.version_count === 4 && nnsa.change_event_count === 10, "NNSA history counts must be 18 objects, 4 versions, and 10 changes.");
check(nnsa.object_history.find((row) => row.registry_id === "NNSA-LANL-LAP4-30D")?.object_type === "Scope strategy", "NNSA 30 Diamond must remain a scope strategy.");
check(nnsa.change_events.find((row) => row.change_id === "NNSA-CHANGE-LAP4-FY27-COST")?.bounded_change.includes("$5.879431 billion"), "NNSA LAP4 FY 2027 cost observation is missing.");
check(nnsa.change_events.every((row) => row.operating_outcome === null), "NNSA version changes must not imply operating outcomes.");

const phase57gHolds = phase57g.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
const inheritedParents = ledger.records.filter((item) => item.parent_hold_key).map((item) => item.parent_hold_key).sort();
check(JSON.stringify([...ledger.preserved_phase57g_holds].sort()) === JSON.stringify(phase57gHolds) && JSON.stringify(inheritedParents) === JSON.stringify(phase57gHolds) && phase57gHolds.length === 9, "All nine Phase 57G holds must be preserved exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57H must add no new visible hold.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-038-registry-revision-provenance-compatible-observation-joins"), `${file} must link Research Watch 038.`);
  check(pathway.research_collection_ids.includes("research-collection-registry-revision-provenance-compatible-observation-joins-2026"), `${file} must link the Phase 57H collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57H versioned provenance and compatibility matrices"), `${file} must include the Phase 57H dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57h-provenance-matrices"), "Dependency map must include the Phase 57H node.");
check(map.links.filter((link) => link.from === "node-phase57h-provenance-matrices").length === 3, "Dependency map must include three Phase 57H links.");
await access(join(appRoot, "public", "downloads", "registry-revision-provenance-compatible-observation-joins-2026.zip"));

if (failures.length) {
  console.error("Phase 57H assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57H assertions passed: 20 Published, 9 In Review, 36 carried Tier 1 sources, four versioned provenance matrices, all 9 Phase 57G holds preserved, no new hold, and unchanged scope and closure ledgers.");
