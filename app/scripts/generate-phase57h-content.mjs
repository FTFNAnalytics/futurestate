import "./generate-phase57g-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-03";
const collectionSlug = "registry-revision-provenance-compatible-observation-joins-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-038-registry-revision-provenance-compatible-observation-joins";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57g = JSON.parse(await readFile(join(dataRoot, "phase-57g-named-asset-project-cohort-registry-expansion.json"), "utf8"));
const amtrak57g = JSON.parse(await readFile(join(dataRoot, "phase-57g-amtrak-named-station-registry.json"), "utf8"));
const montana57g = JSON.parse(await readFile(join(dataRoot, "phase-57g-montana-project-cohort-registry.json"), "utf8"));
const hanford57g = JSON.parse(await readFile(join(dataRoot, "phase-57g-hanford-batch-container-stage-registry.json"), "utf8"));
const nnsa57g = JSON.parse(await readFile(join(dataRoot, "phase-57g-nnsa-work-breakdown-registry.json"), "utf8"));
if (phase57g.phase !== "57G" || phase57g.records.length !== 29) throw new Error("Phase 57H requires the complete Phase 57G release.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

// Amtrak: retain the historical Appendix B snapshot and join only the names that
// actually appear in the June 2026 completion cohorts. Absence from those cohorts
// is never interpreted as removal.
const currentAmtrakCohorts = {
  substantial_completion: ["Camden", "Detroit Lakes", "Du Quoin", "Fort Morgan", "Granby", "Hamlet", "Havre", "Miami", "Pomona", "Rocklin", "Rugby"],
  final_completion: ["Albany", "Camden", "Columbus", "Detroit Lakes", "Devils Lake", "Fort Morgan", "Mount Pleasant", "Tomah"],
};
const canonicalStationName = (value) => value.toLowerCase().normalize("NFKD")
  .replace(/\bmount\b/g, "mt").replace(/\bsaint\b/g, "st").replace(/[^a-z0-9]+/g, "");
const stationByCanonicalName = new Map();
for (const station of amtrak57g.stations) {
  const key = canonicalStationName(station.source_display_name);
  stationByCanonicalName.set(key, [...(stationByCanonicalName.get(key) ?? []), station]);
}
const currentStationNames = [...new Set(Object.values(currentAmtrakCohorts).flat())];
const currentStationRows = currentStationNames.map((currentName) => {
  const candidates = stationByCanonicalName.get(canonicalStationName(currentName)) ?? [];
  const cohorts = Object.entries(currentAmtrakCohorts).filter(([, names]) => names.includes(currentName)).map(([cohort]) => cohort);
  const matched = candidates.length === 1 ? candidates[0] : null;
  return {
    current_display_name: currentName,
    current_cohorts: cohorts,
    candidate_historical_station_ids: candidates.map((station) => station.station_id),
    resolved_historical_station_id: matched?.station_id ?? null,
    historical_display_name: matched?.source_display_name ?? null,
    historical_state: matched?.state ?? null,
    match_method: !matched ? "unresolved_no_historical_name_match" : matched.source_display_name.toLowerCase() === currentName.toLowerCase() ? "exact_display_name" : "controlled_alias_rule_mount_to_mt",
    revision_state: matched ? "current_completion_observation_joined" : "current_name_unresolved_against_historical_snapshot",
    outcome_state: null,
  };
});
const currentRowsByHistoricalId = new Map(currentStationRows.filter((row) => row.resolved_historical_station_id).map((row) => [row.resolved_historical_station_id, row]));
const historicalRevisionRows = amtrak57g.stations.map((station) => {
  const current = currentRowsByHistoricalId.get(station.station_id);
  return {
    historical_station_id: station.station_id,
    historical_display_name: station.source_display_name,
    state: station.state,
    historical_membership_ids: station.cohorts,
    current_completion_display_name: current?.current_display_name ?? null,
    current_completion_cohorts: current?.current_cohorts ?? [],
    revision_state: current ? "observed_in_june_2026_completion_cohort" : "not_observed_in_june_2026_completion_cohorts",
    removal_state: "not_assessed",
    outcome_state: null,
  };
});
const amtrakMatrix = {
  phase: "57H", captured_date: capturedDate, matrix_type: "Station alias and historical-to-current revision matrix",
  source_versions: [
    { source_id: "source-57f-amtrak-stations-alp-fy24-29", source_date: "2023-04-30", role: "Historical Appendix B membership and plan-state snapshot" },
    { source_id: "source-57b-amtrak-ada-progress-june-2026", source_date: "2026-06", role: "Named substantial- and final-completion cohort observations" },
  ],
  controlled_alias_rules: [{ rule_id: "AMTRAK-ALIAS-001", from: "Mount", to: "Mt.", applied_to: ["Mount Pleasant"], authority: "FTFN normalization rule; not an Amtrak rename determination" }],
  historical_station_count: historicalRevisionRows.length,
  current_distinct_name_count: currentStationRows.length,
  current_cohort_membership_count: Object.values(currentAmtrakCohorts).flat().length,
  exact_matches: currentStationRows.filter((row) => row.match_method === "exact_display_name").length,
  controlled_alias_matches: currentStationRows.filter((row) => row.match_method.startsWith("controlled_alias")).length,
  unresolved_current_names: currentStationRows.filter((row) => !row.resolved_historical_station_id).map((row) => row.current_display_name),
  added_removed_renamed_replaced_rule: "A completion-cohort appearance can establish only a source-versioned observation. Nonappearance cannot establish removal; alias normalization cannot establish an official rename or replacement.",
  current_station_rows: currentStationRows,
  historical_revision_rows: historicalRevisionRows,
};
await writeJson(join(dataRoot, "phase-57h-amtrak-station-alias-revision-matrix.json"), amtrakMatrix);

// Montana: publish a field dictionary and project-version matrix without exposing
// individual BSL, subscriber, or CAI records and without guessing code meanings.
const fieldSpecs = [
  ["project_id", "project_id", "Official CSV field", "Public project identifier", "public", "join key"],
  ["project_name", "project_name", "Official CSV field", "Public project name", "public", "label"],
  ["uei", "uei", "Official CSV field", "Subgrantee Unique Entity Identifier", "public", "join key"],
  ["subgrantee_id", null, "FTFN derived field", "Namespaced UEI join key", "public", "derived join key"],
  ["bsl_count", null, "FTFN aggregate", "Count of proposal-baseline BSL rows assigned to the project", "privacy-safe aggregate", "denominator"],
  ["cai_count", null, "FTFN aggregate", "Count of proposal-baseline CAI rows assigned to the project", "privacy-safe aggregate", "denominator"],
  ["bead_support_usd", "bead_support", "Official CSV field", "Approved proposal support amount in U.S. dollars", "public", "baseline amount"],
  ["subgrantee_match_usd", "subgrantee_match", "Official CSV field", "Approved proposal match amount in U.S. dollars", "public", "baseline amount"],
  ["raw_technology_codes", "technology", "Official raw code", "Untranslated technology code values retained from the source", "public aggregate", "classification pending schema"],
  ["intersects_tribal_land", null, "FTFN normalized field", "Project-level indicator derived from the public proposal record", "public project level", "routing attribute"],
  ["tribal_consent_name", null, "FTFN normalized field", "Public project-level Tribal consent name when present", "public project level", "routing attribute"],
  ["reporting_contract", null, "FTFN routing decision", "Expected terrestrial or LEO reporting rail", "public project level", "compatibility routing"],
  ["outcome_state", null, "FTFN reserved field", "Reserved operating-outcome slot", "public null", "future observation"],
];
const montanaFieldDictionary = fieldSpecs.map(([field, official_source_field, authority, definition, privacy_class, join_role]) => ({
  field, official_source_field, authority, definition, privacy_class, join_role,
  source_version: "Montana BEAD Final Proposal files dated 2026-01-05",
  official_code_definition_available: field !== "raw_technology_codes" ? "not_applicable" : "not_joined_in_current_public_source_set",
}));
const montanaProjectVersions = montana57g.projects.map((project) => ({
  project_id: project.project_id, subgrantee_id: project.subgrantee_id, proposal_version: "2026-01-05-approved-final-proposal",
  baseline: { bsl_count: project.bsl_count, cai_count: project.cai_count, bead_support_usd: project.bead_support_usd, subgrantee_match_usd: project.subgrantee_match_usd, raw_technology_codes: project.raw_technology_codes },
  reporting_rail: project.reporting_contract.startsWith("LEO") ? "LEO" : "terrestrial",
  compatible_future_observation_key: `${project.project_id}|reporting-period|field-definition-version`,
  current_completed_project_quarter: null, current_service_state: null, current_adoption_state: null, current_acceptance_state: null,
}));
const montanaMatrix = {
  phase: "57H", captured_date: capturedDate, matrix_type: "Official-field provenance and project-version compatibility matrix",
  source_versions: montana57g.source_ids.map((source_id) => ({ source_id, role: source_id.includes("final-proposal") || source_id.includes("-csv") ? "Approved proposal baseline" : source_id.includes("leo") ? "LEO reporting contract" : "Terrestrial monitoring and reporting contract" })),
  field_count: montanaFieldDictionary.length, project_count: montanaProjectVersions.length,
  technology_code_values: [...new Set(montana57g.projects.flatMap((project) => project.raw_technology_codes))].sort(),
  technology_code_definition_state: "unresolved_official_mapping",
  privacy_boundary: montana57g.privacy_boundary,
  compatibility_rule: "A future observation must match project_id, reporting period, field definition/version, reporting rail, unit, authority, and acceptance state. Terrestrial and LEO reporting fields are not interchangeable.",
  field_dictionary: montanaFieldDictionary, project_versions: montanaProjectVersions,
};
await writeJson(join(dataRoot, "phase-57h-montana-field-provenance-version-matrix.json"), montanaMatrix);

// Hanford: make authority, custody, unit, operator, and observation compatibility
// explicit. No container, batch, volume, or mass conversion is created.
const authorityBySource = {
  "source-57g-hanford-dflaw-process-animation": ["DOE Office of Environmental Management", "process description"],
  "source-57g-hanford-ap106-feed-staging": ["DOE Office of Environmental Management", "tank-operations mission statement"],
  "source-57c-hanford-20-containers-2025": ["DOE Office of Environmental Management", "commissioning campaign statement"],
  "source-57e-doe-hanford-acceptable-glass-startup": ["DOE Office of Environmental Management", "startup milestone statement"],
  "source-57f-hanford-wtp-pmm-february-2026": ["DOE and Washington State project managers", "joint project-management record"],
  "source-57b-ecology-wtp-byproduct-response-comments": ["Washington State Department of Ecology", "regulatory record"],
  "source-56x-hanford-first-ilaw-disposal-2026": ["DOE Office of Environmental Management", "disposal milestone statement"],
  "source-57b-hanford-wtp-project-managers-may-2026": ["DOE and Washington State project managers", "joint project-management record"],
  "source-57f-doe-hanford-100k-gallons-may-2026": ["DOE Office of Environmental Management", "cumulative volume threshold statement"],
};
const hanfordAuthorityRows = hanford57g.source_ids.map((source_id) => ({
  source_id, authority: authorityBySource[source_id]?.[0] ?? "Source authority retained from profile",
  record_role: authorityBySource[source_id]?.[1] ?? "bounded public record",
  can_establish_regulator_acceptance: source_id.includes("ecology") || source_id.includes("project-managers") ? "only_when_explicitly_stated" : "no",
  can_establish_container_identity: "no", can_establish_batch_identity: "no",
}));
const transitionPairs = [
  ["HANFORD-DFLAW-RETRIEVAL", "HANFORD-DFLAW-TSCR"], ["HANFORD-DFLAW-TSCR", "HANFORD-DFLAW-AP106"],
  ["HANFORD-DFLAW-AP106", "HANFORD-DFLAW-222S"], ["HANFORD-DFLAW-222S", "HANFORD-DFLAW-TRANSFER"],
  ["HANFORD-DFLAW-TRANSFER", "HANFORD-LAW-FEED"], ["HANFORD-LAW-FEED", "HANFORD-LAW-MELTER-1"],
  ["HANFORD-LAW-FEED", "HANFORD-LAW-MELTER-2"], ["HANFORD-LAW-MELTER-1", "HANFORD-LAW-CONTAINER-FILL"],
  ["HANFORD-LAW-MELTER-2", "HANFORD-LAW-CONTAINER-FILL"], ["HANFORD-LAW-CONTAINER-FILL", "HANFORD-LAW-CONTAINER-HANDLING"],
  ["HANFORD-LAW-CONTAINER-HANDLING", "HANFORD-LAW-EXPORT-BAY"], ["HANFORD-LAW-EXPORT-BAY", "HANFORD-IDF-TRANSPORT"],
  ["HANFORD-IDF-TRANSPORT", "HANFORD-IDF-STAGING"], ["HANFORD-IDF-STAGING", "HANFORD-IDF-DISPOSAL"],
];
const stageById = new Map(hanford57g.stages.map((stage) => [stage.stage_id, stage]));
const hanfordTransitions = transitionPairs.map(([from_stage_id, to_stage_id], index) => ({
  transition_id: `HANFORD-TRANSITION-${String(index + 1).padStart(2, "0")}`, from_stage_id, to_stage_id,
  from_custodian: stageById.get(from_stage_id)?.custodian, to_custodian: stageById.get(to_stage_id)?.custodian,
  stable_public_batch_join: false, stable_public_container_join: false,
  compatible_observation_requirements: ["same identified cohort", "dated transfer and receipt", "compatible units and method", "explicit quality and acceptance state"],
}));
const observationPairs = [];
for (let left = 0; left < hanford57g.observations.length; left += 1) {
  for (let right = left + 1; right < hanford57g.observations.length; right += 1) {
    const a = hanford57g.observations[left]; const b = hanford57g.observations[right];
    const sameStage = a.stage_id === b.stage_id; const sameUnit = a.unit === b.unit && a.unit !== null;
    let compatibility = "incompatible_measure_or_unit";
    if (sameStage && sameUnit && a.measure === b.measure && a.operator === b.operator) compatibility = "potentially_comparable_requires_same_cohort_period_and_method";
    else if (sameStage && sameUnit) compatibility = "same_stage_unit_but_terms_or_operators_require_alignment";
    else if (sameUnit) compatibility = "same_unit_different_stage_not_directly_comparable";
    else if (a.unit === null || b.unit === null) compatibility = "milestone_and_quantity_not_directly_comparable";
    observationPairs.push({ pair_id: `${a.event_id}__${b.event_id}`, left_event_id: a.event_id, right_event_id: b.event_id, same_stage: sameStage, same_unit: sameUnit, compatibility, direct_numeric_join_allowed: false });
  }
}
const compatibilityCounts = Object.fromEntries([...new Set(observationPairs.map((row) => row.compatibility))].map((state) => [state, observationPairs.filter((row) => row.compatibility === state).length]));
const hanfordMatrix = {
  phase: "57H", captured_date: capturedDate, matrix_type: "Authority, custody, transition, threshold-operator, unit, and observation-compatibility matrix",
  authority_count: hanfordAuthorityRows.length, transition_count: hanfordTransitions.length,
  observation_count: hanford57g.observations.length, observation_pair_count: observationPairs.length,
  direct_numeric_joins_allowed: 0, public_batch_ids: 0, public_container_ids: 0,
  compatibility_counts: compatibilityCounts,
  authority_rows: hanfordAuthorityRows, transitions: hanfordTransitions,
  observations: hanford57g.observations.map((row) => ({ ...row, authority: authorityBySource[row.source_id]?.[0] ?? null, identity_join_state: "no_public_batch_or_container_id" })),
  observation_pairs: observationPairs,
  nonconversion_rules: hanford57g.nonconversion_rules,
};
await writeJson(join(dataRoot, "phase-57h-hanford-authority-observation-compatibility-matrix.json"), hanfordMatrix);

// NNSA: record source-version presence and bounded change events at the exact
// work-breakdown object. Budget structure, GAO assessment, capacity, qualification,
// and independent recommendation closure remain distinct.
const nnsaVersions = [
  { version_id: "FY2026-CJ", source_id: "source-57g-nnsa-fy2026-weapons-activities", effective_period: "FY 2026 request", authority: "DOE/NNSA", observation_type: "budget structure and forecast" },
  { version_id: "FY2027-CJ", source_id: "source-56w-nnsa-fy2027-weapons-activities", effective_period: "FY 2027 request", authority: "DOE/NNSA", observation_type: "budget structure, scope, cost, and forecast" },
  { version_id: "GAO-26-107625", source_id: "source-56x-gao-nnsa-major-projects-2026", effective_period: "published 2026; data generally through June 2025", authority: "U.S. Government Accountability Office", observation_type: "independent project assessment" },
  { version_id: "GAO-23-104661-REC1", source_id: "source-56q-gao-23-104661-recommendation-status", effective_period: "current captured recommendation status", authority: "U.S. Government Accountability Office", observation_type: "independent recommendation status" },
];
const lap4Ids = nnsa57g.entries.filter((entry) => entry.registry_id.includes("LAP4")).map((entry) => entry.registry_id);
const srppfIds = nnsa57g.entries.filter((entry) => entry.registry_id.includes("SRPPF") || entry.registry_id === "NNSA-SRS-MOX").map((entry) => entry.registry_id);
const versionPresence = (entry, version) => {
  if (version.version_id.startsWith("FY") && (lap4Ids.includes(entry.registry_id) || srppfIds.includes(entry.registry_id) || ["NNSA-PIT-MISSION", "NNSA-LANL", "NNSA-SRS", "NNSA-CAPACITY-30-50-80"].includes(entry.registry_id))) return "source_version_relevant_object_level_extraction_bounded";
  if (version.version_id === "GAO-26-107625" && (lap4Ids.includes(entry.registry_id) || srppfIds.includes(entry.registry_id))) return "independent_project_assessment_source_joined";
  if (version.version_id === "GAO-23-104661-REC1" && entry.registry_id === "NNSA-GAO-23-104661-REC1") return "independent_recommendation_status_joined";
  return "not_used_for_this_object_state";
};
const nnsaObjectHistory = nnsa57g.entries.map((entry) => ({
  ...entry,
  versions: Object.fromEntries(nnsaVersions.map((version) => [version.version_id, versionPresence(entry, version)])),
  compatibility_decision: entry.object_type === "Capacity plan" ? "capacity_not_output" : entry.object_type === "Qualification and acceptance event" ? "single_accepted_unit_not_rate" : entry.object_type === "Independent recommendation baseline" ? "recommendation_status_not_project_baseline" : "compare_only_same_object_scope_cost_schedule_definition_and_effective_period",
}));
const nnsaChangeEvents = [
  { change_id: "NNSA-CHANGE-LAP4-FY26-STRUCTURE", registry_id: "NNSA-LANL-LAP4", from_version: null, to_version: "FY2026-CJ", change_type: "budget_structure_snapshot", bounded_change: "FY 2026 source version retained for LAP4 scope and forecast comparison", operating_outcome: null },
  { change_id: "NNSA-CHANGE-LAP4-FY27-COST", registry_id: "NNSA-LANL-LAP4", from_version: "FY2026-CJ", to_version: "FY2027-CJ", change_type: "versioned_cost_and_scope_observation", bounded_change: "FY 2027 source records a $5.879431 billion LAP4 current total project cost; this is not an enterprise life-cycle cost or completion result", operating_outcome: null },
  { change_id: "NNSA-CHANGE-30D-SCOPE", registry_id: "NNSA-LANL-LAP4-30D", from_version: "FY2026-CJ", to_version: "FY2027-CJ", change_type: "scope_strategy_revision", bounded_change: "30 Diamond remains a versioned scope strategy rather than a facility or output object", operating_outcome: null },
  { change_id: "NNSA-CHANGE-LAP4-GAO", registry_id: "NNSA-LANL-LAP4", from_version: "FY2027-CJ", to_version: "GAO-26-107625", change_type: "independent_assessment_join", bounded_change: "GAO project assessment is retained separately from NNSA budget assertions and forecasts", operating_outcome: null },
  { change_id: "NNSA-CHANGE-SRPPF-FY26", registry_id: "NNSA-SRS-SRPPF", from_version: null, to_version: "FY2026-CJ", change_type: "budget_structure_snapshot", bounded_change: "FY 2026 project structure retained without inferring accepted capability", operating_outcome: null },
  { change_id: "NNSA-CHANGE-SRPPF-FY27", registry_id: "NNSA-SRS-SRPPF", from_version: "FY2026-CJ", to_version: "FY2027-CJ", change_type: "budget_structure_revision", bounded_change: "FY 2027 structure is comparable only at matched project and subproject objects", operating_outcome: null },
  { change_id: "NNSA-CHANGE-SRPPF-GAO", registry_id: "NNSA-SRS-SRPPF", from_version: "FY2027-CJ", to_version: "GAO-26-107625", change_type: "independent_assessment_join", bounded_change: "GAO definitions, cost ranges, approved baselines, completion, and capability remain separate observations", operating_outcome: null },
  { change_id: "NNSA-CHANGE-W87-FPU", registry_id: "NNSA-W87-1-FPU", from_version: null, to_version: "2024-10-01-FPU", change_type: "qualification_and_acceptance_event", bounded_change: "One fully qualified and diamond-stamped first production unit; not a recurring site-period rate", operating_outcome: null },
  { change_id: "NNSA-CHANGE-CAPACITY-PLAN", registry_id: "NNSA-CAPACITY-30-50-80", from_version: null, to_version: "CURRENT-PLAN", change_type: "capacity_plan", bounded_change: "30 plus at least 50 for at least 80 per year is a capacity objective, not measured output", operating_outcome: null },
  { change_id: "NNSA-CHANGE-GAO-REC1", registry_id: "NNSA-GAO-23-104661-REC1", from_version: null, to_version: "GAO-23-104661-REC1", change_type: "independent_recommendation_status", bounded_change: "Recommendation remains an independent enterprise-baseline object; project baselines cannot substitute for closure", operating_outcome: null },
];
const nnsaMatrix = {
  phase: "57H", captured_date: capturedDate, matrix_type: "FY2026-to-FY2027-to-GAO work-breakdown change history",
  object_count: nnsaObjectHistory.length, version_count: nnsaVersions.length, change_event_count: nnsaChangeEvents.length,
  source_versions: nnsaVersions, object_history: nnsaObjectHistory, change_events: nnsaChangeEvents,
  compatibility_rule: "Compare only the same registry object, scope definition, cost concept, schedule basis, effective period, source authority, and revision. Capacity, qualification, accepted output, project completion, capability, and recommendation closure are not interchangeable.",
};
await writeJson(join(dataRoot, "phase-57h-nnsa-fy26-fy27-gao-change-history.json"), nnsaMatrix);

const specs = [
  { slug: "amtrak-controlled-station-alias-registry", agency: "DOT", actionKey: "AMTRAK-ALIAS-REVISION-2026-01", stage: "Alias and revision provenance", sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57b-amtrak-ada-progress-june-2026"], title: "Amtrak station names now resolve through a controlled alias registry", finding: `${amtrakMatrix.exact_matches} current names match exactly and ${amtrakMatrix.controlled_alias_matches} resolves through the explicit Mount-to-Mt. rule.`, denominator: `${amtrakMatrix.current_distinct_name_count} distinct current names against ${amtrakMatrix.historical_station_count} historical station keys.`, limits: ["FTFN normalization is not an official rename.", "State and identity must remain explicit.", "Unresolved names are not silently merged."], next: "Attach future station records through source-versioned aliases and keep ambiguous matches unresolved.", registry: "phase-57h-amtrak-station-alias-revision-matrix.json" },
  { slug: "amtrak-current-completion-cohort-intersection", agency: "DOT", actionKey: "AMTRAK-COMPLETION-COHORT-JOIN-2026-01", stage: "Alias and revision provenance", sourceIds: ["source-57b-amtrak-ada-progress-june-2026", "source-57f-amtrak-stations-alp-fy24-29"], title: "Eleven current Amtrak completion names join to historical station keys", finding: "Ten exact names and one controlled alias connect June 2026 completion observations to the Appendix B registry.", denominator: "Eleven resolved current names; nineteen current cohort memberships; sixteen distinct current names.", limits: ["Completion is not feature uptime.", "Substantial and final completion remain separate cohorts.", "A name join is not device identity."], next: "Add current station-device, feature, outage, maintenance, use, and complaint observations only when identifiers align.", registry: "phase-57h-amtrak-station-alias-revision-matrix.json" },
  { slug: "amtrak-five-unresolved-current-names", agency: "DOT", actionKey: "AMTRAK-UNRESOLVED-CURRENT-NAMES-2026-01", stage: "Alias and revision provenance", sourceIds: ["source-57b-amtrak-ada-progress-june-2026", "source-57f-amtrak-stations-alp-fy24-29"], title: "Five June 2026 Amtrak station names remain unresolved against Appendix B", finding: `The unresolved names are ${amtrakMatrix.unresolved_current_names.join(", ")}.`, denominator: "Five of sixteen distinct current completion-cohort names.", limits: ["Unresolved does not mean newly opened.", "Historical nonappearance does not establish addition.", "No station identity is guessed from geography."], next: "Resolve each name with an official station code, state-qualified record, or explicit source crosswalk.", registry: "phase-57h-amtrak-station-alias-revision-matrix.json" },
  { slug: "amtrak-nonappearance-is-not-removal", agency: "DOT", actionKey: "AMTRAK-NONREMOVAL-REVISION-RULE-2026-01", stage: "Alias and revision provenance", sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57b-amtrak-ada-progress-june-2026"], title: "Historical stations absent from a completion list are not classified as removed", finding: "All 178 historical keys retain a removal state of not assessed; the June 2026 report is a completion cohort, not a registry replacement.", denominator: "178 historical station keys and sixteen current names.", limits: ["Cohort omission is not deletion.", "A current report can have narrower scope than the historical appendix.", "No asset outcome is inferred."], next: "Require an official revision, closure, replacement, or station-code record before changing identity state.", registry: "phase-57h-amtrak-station-alias-revision-matrix.json" },
  { slug: "amtrak-revision-state-vocabulary", agency: "DOT", actionKey: "AMTRAK-REVISION-VOCABULARY-2026-01", stage: "Alias and revision provenance", sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57b-amtrak-ada-progress-june-2026"], title: "Amtrak revision states now separate observed, unresolved, renamed, replaced, and removed", finding: "The matrix publishes observed and unresolved states while leaving renamed, replaced, added, and removed unasserted without direct authority.", denominator: "Two official source versions and one controlled alias rule.", limits: ["Alias is not rename.", "Current-only is not added.", "Historical-only is not removed."], next: "Store every later change with source version, effective date, authority, and identity evidence.", registry: "phase-57h-amtrak-station-alias-revision-matrix.json" },

  { slug: "montana-official-field-provenance-dictionary", agency: "NTIA", actionKey: "MT-BEAD-FIELD-DICTIONARY-2026-01", stage: "Field provenance and version compatibility", sourceIds: montana57g.source_ids, title: "Montana BEAD fields now distinguish official values, FTFN aggregates, and reserved slots", finding: `The dictionary classifies ${montanaMatrix.field_count} public fields by authority, source version, privacy class, and join role.`, denominator: `${montanaMatrix.field_count} fields across ${montanaMatrix.project_count} projects.`, limits: ["FTFN-derived fields are not labeled official.", "Reserved outcome fields remain null.", "Definitions are version-specific."], next: "Join official schema revisions at field level before ingesting later reports.", registry: "phase-57h-montana-field-provenance-version-matrix.json" },
  { slug: "montana-thirty-two-project-version-baseline", agency: "NTIA", actionKey: "MT-BEAD-PROJECT-VERSION-BASELINE-2026-01", stage: "Field provenance and version compatibility", sourceIds: montana57g.source_ids, title: "All thirty-two Montana projects now carry a versioned observation key", finding: "Each approved proposal project retains its January 5, 2026 baseline and a future join key for project, period, and field-definition version.", denominator: "Thirty-two project rows and nineteen named subgrantees.", limits: ["Proposal baseline is not executed agreement.", "Funding is not construction.", "A future report must preserve project identity."], next: "Ingest completed project-quarter tables only when project, period, version, and authority align.", registry: "phase-57h-montana-field-provenance-version-matrix.json" },
  { slug: "montana-privacy-classification-matrix", agency: "NTIA", actionKey: "MT-BEAD-PRIVACY-CLASSIFICATION-2026-01", stage: "Field provenance and version compatibility", sourceIds: ["source-57g-montana-locations-csv", "source-57g-montana-cai-csv", "source-57g-montana-deployment-projects-csv"], title: "Montana project fields now carry explicit privacy classifications", finding: "Project identifiers and aggregate counts remain public while individual BSL, subscriber, and CAI detail stays excluded.", denominator: "Zero individual BSL identifiers and zero individual CAI details in public output.", limits: ["Aggregate counts cannot be reversed into locations.", "Subscriber records are outside scope.", "CAI facility detail remains excluded."], next: "Apply the same classification before publishing any later quarterly extract.", registry: "phase-57h-montana-field-provenance-version-matrix.json" },
  { slug: "montana-raw-technology-code-hold", agency: "NTIA", actionKey: "MT-BEAD-RAW-CODE-PROVENANCE-2026-01", stage: "Field provenance and version compatibility", sourceIds: ["source-57g-montana-locations-csv", "source-57g-montana-deployment-projects-csv"], title: "Five Montana technology-code values remain untranslated pending an official schema", finding: `Values ${montanaMatrix.technology_code_values.join(", ")} remain raw source codes with unresolved official mapping.`, denominator: "Five distinct raw code values across privacy-safe project and statewide aggregates.", limits: ["Code meaning is not guessed.", "Mixed-code projects remain mixed.", "Code presence is not deployed technology."], next: "Attach an official field schema and effective version before publishing labels.", registry: "phase-57h-montana-field-provenance-version-matrix.json" },
  { slug: "montana-terrestrial-leo-compatibility-routing", agency: "NTIA", actionKey: "MT-BEAD-REPORTING-RAIL-COMPATIBILITY-2026-01", stage: "Field provenance and version compatibility", sourceIds: ["source-57f-montana-leo-quarterly-instructions-june-2026", "source-57e-montana-quarterly-report-instructions-june-2026", "source-57e-montana-project-monitoring-guide-june-2026"], title: "Montana terrestrial and LEO projects now route to separate reporting contracts", finding: "Every project has an explicit reporting rail so fields from terrestrial construction and LEO availability reporting are not combined by label alone.", denominator: "Thirty-two project rows routed to terrestrial or LEO source contracts.", limits: ["Routing is an FTFN compatibility decision.", "Similar labels can have different definitions.", "Reporting does not establish acceptance."], next: "Version each official quarterly schema and compare only compatible fields within the correct rail.", registry: "phase-57h-montana-field-provenance-version-matrix.json" },

  { slug: "hanford-source-authority-matrix", agency: "DOE", actionKey: "HANFORD-AUTHORITY-MATRIX-2026-01", stage: "Authority and observation compatibility", sourceIds: hanford57g.source_ids, title: "Nine Hanford source roles now distinguish operator, regulator, and joint records", finding: "Each lifecycle observation carries its publishing authority and bounded record role.", denominator: `${hanfordMatrix.authority_count} source-authority rows and ${hanfordMatrix.observation_count} observations.`, limits: ["DOE assertion is not automatically regulator acceptance.", "Joint minutes retain their stated scope.", "Authority does not supply missing identities."], next: "Preserve source authority on every later observation and acceptance claim.", registry: "phase-57h-hanford-authority-observation-compatibility-matrix.json" },
  { slug: "hanford-fourteen-transition-custody-matrix", agency: "DOE", actionKey: "HANFORD-CUSTODY-TRANSITION-MATRIX-2026-01", stage: "Authority and observation compatibility", sourceIds: ["source-57g-hanford-dflaw-process-animation", "source-57g-hanford-ap106-feed-staging"], title: "Fourteen Hanford transitions now preserve stage and custody boundaries", finding: "The matrix expands the lifecycle into fourteen directed transitions across tank operations, laboratory certification, LAW processing, transport, staging, and disposal.", denominator: `${hanfordMatrix.transition_count} transitions across fourteen registered stages.`, limits: ["A process edge is not an observed transfer.", "Custody label is not container acceptance.", "Parallel melters do not create container lineage."], next: "Add transfer and receipt events only with compatible identifiers, dates, units, and dispositions.", registry: "phase-57h-hanford-authority-observation-compatibility-matrix.json" },
  { slug: "hanford-unit-threshold-operator-matrix", agency: "DOE", actionKey: "HANFORD-UNIT-OPERATOR-MATRIX-2026-01", stage: "Authority and observation compatibility", sourceIds: hanford57g.source_ids, title: "Hanford exact, threshold, approximate, and milestone observations remain distinct", finding: "The matrix retains equals, greater-than, approximately, and milestone operators together with source units and stages.", denominator: "Nine source-attributed observations using container, gallon, null-unit milestone, and text states.", limits: ["Greater-than is not equals.", "Approximately is not exact.", "Milestones are not quantities."], next: "Preserve the original operator, unit, period, and method on every insert.", registry: "phase-57h-hanford-authority-observation-compatibility-matrix.json" },
  { slug: "hanford-thirty-six-observation-pair-decisions", agency: "DOE", actionKey: "HANFORD-PAIR-COMPATIBILITY-2026-01", stage: "Authority and observation compatibility", sourceIds: hanford57g.source_ids, title: "All thirty-six Hanford observation pairs now have explicit compatibility decisions", finding: "Every unordered pair of the nine observations is classified; zero direct numeric joins are allowed in the current public record.", denominator: `${hanfordMatrix.observation_pair_count} observation pairs and zero stable public batch or container identities.`, limits: ["Same unit across stages is not a cohort join.", "Same stage can still have different measures.", "No pair proves a complete material balance."], next: "Upgrade a pair only when identity, period, measure, operator, method, unit, authority, and disposition align.", registry: "phase-57h-hanford-authority-observation-compatibility-matrix.json" },
  { slug: "hanford-nonconversion-rejection-contract", agency: "DOE", actionKey: "HANFORD-NONCONVERSION-CONTRACT-2026-01", stage: "Authority and observation compatibility", sourceIds: ["source-57f-hanford-wtp-pmm-february-2026", "source-57f-doe-hanford-100k-gallons-may-2026", "source-56x-hanford-first-ilaw-disposal-2026"], title: "Hanford joins now reject synthetic container-mass and gallon conversions", finding: "The release encodes the four Phase 57G nonconversion rules as compatibility gates rather than narrative cautions alone.", denominator: "Nine observations, thirty-six pairs, fourteen transitions, zero direct numeric joins.", limits: ["Nominal container weight is not observed output.", "Gallons cannot be converted without a source method.", "Filled, shipped, staged, and disposed counts need identity joins."], next: "Require a regulator-verifiable batch-container ledger before mass-balance reconciliation.", registry: "phase-57h-hanford-authority-observation-compatibility-matrix.json" },

  { slug: "nnsa-fy26-fy27-object-change-history", agency: "DOE", actionKey: "NNSA-FY26-FY27-WBS-HISTORY-2026-01", stage: "Work-breakdown version history", sourceIds: nnsa57g.source_ids, title: "NNSA FY 2026, FY 2027, and GAO records now join at exact work-breakdown objects", finding: "Eighteen registry objects carry source-version states and object-specific compatibility decisions.", denominator: `${nnsaMatrix.object_count} objects, ${nnsaMatrix.version_count} formal source versions, and ${nnsaMatrix.change_event_count} bounded change events.`, limits: ["Budget year is not completion year.", "Scope revision is not operating outcome.", "GAO assessment remains independently attributed."], next: "Store later changes at the exact object and definition version before comparison.", registry: "phase-57h-nnsa-fy26-fy27-gao-change-history.json" },
  { slug: "nnsa-lap4-versioned-scope-cost-matrix", agency: "DOE", actionKey: "NNSA-LAP4-VERSIONED-SCOPE-COST-2026-01", stage: "Work-breakdown version history", sourceIds: ["source-57g-nnsa-fy2026-weapons-activities", "source-56w-nnsa-fy2027-weapons-activities", "source-56x-gao-nnsa-major-projects-2026", "source-57g-nnsa-lap4-30-base-construction"], title: "LAP4 scope, subprojects, and cost concepts now retain source versions", finding: "The LAP4 umbrella and six child scope objects remain separate; the FY 2027 $5.879431 billion current total project cost is stored at the umbrella and not promoted to enterprise cost or completion.", denominator: "One LAP4 umbrella, six child objects, and four bounded source-version joins.", limits: ["Current total project cost is not enterprise life-cycle cost.", "30 Diamond remains a scope strategy.", "CD approval is not completion."], next: "Track later baseline, forecast, and actual observations with unchanged object and cost definitions.", registry: "phase-57h-nnsa-fy26-fy27-gao-change-history.json" },
  { slug: "nnsa-srppf-versioned-baseline-matrix", agency: "DOE", actionKey: "NNSA-SRPPF-VERSIONED-BASELINE-2026-01", stage: "Work-breakdown version history", sourceIds: ["source-57g-nnsa-fy2026-weapons-activities", "source-56w-nnsa-fy2027-weapons-activities", "source-56x-gao-nnsa-major-projects-2026"], title: "SRPPF umbrella, host building, and subproject baselines remain non-substitutable", finding: "The former MOX host, SRPPF umbrella, Main Process Building, and HFTOC carry separate version states across budget and GAO records.", denominator: "Four Savannah River facility, project, and subproject objects across three source-version families.", limits: ["Host repurposing is not accepted capability.", "Subproject baseline is not umbrella completion.", "GAO ranges and approved baselines remain distinct."], next: "Attach each later critical decision, cost, schedule, completion, and capability observation to its exact object.", registry: "phase-57h-nnsa-fy26-fy27-gao-change-history.json" },
  { slug: "nnsa-capacity-qualification-output-separation", agency: "DOE", actionKey: "NNSA-CAPACITY-QUALIFICATION-SEPARATION-2026-01", stage: "Work-breakdown version history", sourceIds: ["source-57f-nnsa-pit-production-current", "source-57a-nnsa-w87-1-first-production-unit", "source-56w-nnsa-fy2027-weapons-activities"], title: "NNSA capacity, qualification, accepted unit, and recurring output remain separate states", finding: "The 30-plus-50 capacity plan and the October 2024 W87-1 first production unit retain distinct objects and cannot be joined into a production rate.", denominator: "One capacity-plan object and one qualification-and-acceptance event.", limits: ["Capacity is not output.", "One accepted unit is not a rate.", "Site-period disposition counts remain absent."], next: "Publish site-period produced, rejected, reworked, qualified, accepted, and stockpile-entered counts.", registry: "phase-57h-nnsa-fy26-fy27-gao-change-history.json" },
  { slug: "nnsa-gao-independent-baseline-provenance", agency: "DOE", actionKey: "NNSA-GAO-INDEPENDENT-BASELINE-PROVENANCE-2026-01", stage: "Work-breakdown version history", sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-56x-gao-nnsa-major-projects-2026", "source-57g-nnsa-fy2026-weapons-activities", "source-56w-nnsa-fy2027-weapons-activities"], title: "GAO enterprise-baseline status remains independent of NNSA project baselines", finding: "Recommendation 1 retains its own versioned object; budget submissions and project baselines cannot substitute for GAO implementation or closure.", denominator: "One independent recommendation object joined to two budget versions and one GAO project-assessment family.", limits: ["Agency planning is not GAO closure.", "Project estimates are not the requested enterprise life-cycle estimate.", "Forecast dates are not accepted completion."], next: "Change state only when GAO records implementation or closure against its sufficiency criteria.", registry: "phase-57h-nnsa-fy26-fy27-gao-change-history.json" },
];

const holdKeyMap = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-06": "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-07",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-05": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-06",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-06": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-07",
  "LA-BEAD-STARLINK-HOLD-2026-06": "LA-BEAD-STARLINK-HOLD-2026-07",
  "MT-BEAD-QUARTERLY-HOLD-2026-06": "MT-BEAD-QUARTERLY-HOLD-2026-07",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-03": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-04",
  "NNSA-PIT-RATE-HOLD-2026-06": "NNSA-PIT-RATE-HOLD-2026-07",
  "NNSA-PIT-PEIS-HOLD-2026-06": "NNSA-PIT-PEIS-HOLD-2026-07",
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-07": "NNSA-PIT-GAO-BASELINE-HOLD-2026-08",
};
const inheritedHolds = phase57g.records.filter((record) => record.record_status === "In Review").map((record) => ({
  slug: `preserved-${record.record_id.replace(/^record-57g-preserved-/, "")}`, agency: record.agency,
  actionKey: holdKeyMap[record.action_key], parentHold: record.action_key, stage: record.evidence_stage,
  sourceIds: record.supporting_source_ids, title: record.title, finding: record.finding,
  denominator: record.denominator, limits: record.evidence_limits, next: record.next_action, registry: null,
  status: "In Review", publicationDate: record.publication_date,
}));
if (specs.length !== 20 || inheritedHolds.length !== 9 || inheritedHolds.some((hold) => !hold.actionKey)) throw new Error("Phase 57H requires twenty provenance panels and nine preserved holds.");
const allSpecs = [...specs.map((spec) => ({ ...spec, status: "Published", publicationDate: capturedDate })), ...inheritedHolds];

const sourceIds = [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))];
const sourceById = new Map();
for (const id of sourceIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const authorityBoundary = "A source-version change, alias match, field-definition match, custody edge, compatible unit, work-breakdown join, budget entry, or independent assessment is not an operating result. Unresolved identities remain unresolved; privacy-sensitive location detail stays excluded; stage, unit, operator, authority, acceptance, capacity, qualification, output, implementation, and closure remain non-interchangeable. No record supports rankings, composite scores, readiness scores, generalized savings, or unsupported causal attribution.";
const records = allSpecs.map((spec, index) => ({
  record_id: `record-57h-${spec.slug}`, document_id: `research-doc-57h-${spec.slug}`, signal_id: `signal-57h-${spec.slug}`,
  document_number: 757 + index, phase: "57H", action_key: spec.actionKey, parent_hold_key: spec.parentHold ?? null,
  agency: spec.agency, entity_id: agencyMeta[spec.agency].entity, record_type: "Registry revision, provenance, and compatible-observation join panel",
  evidence_stage: spec.stage, title: spec.title, record_status: spec.status, source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
  official_url: sourceById.get(spec.sourceIds[0])?.url, publication_date: spec.publicationDate,
  document_type: spec.status === "In Review" ? "Technical Report" : "Data Release",
  finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits, next_action: spec.next,
  structured_registry_file: spec.registry, exact_target_artifact_acquired: false, directive_scope_change: false,
  implementation_change: false, closure_change: false, contact_or_foia_submitted: false,
  authority_boundary: authorityBoundary, captured_date: capturedDate,
}));
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const evidenceStageCounts = Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length]));
const priorHoldKeys = phase57g.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57h-registry-revision-provenance-compatible-observation-joins.json"), {
  phase: "57H", captured_date: capturedDate,
  goal: "Make the four Phase 57G registries source-versioned and observation-ready without converting revision, alias, field, authority, custody, or work-breakdown matches into operating outcomes.",
  publication_rule: "Publish bounded provenance and compatibility decisions only; keep unresolved joins explicit and preserve all nine operating-outcome holds.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length, records_published: published.length, records_held: held.length,
  evidence_stage_counts: evidenceStageCounts, new_official_source_profiles: 0, carried_official_source_profiles: sourceIds.length,
  structured_matrices: [
    { file: "phase-57h-amtrak-station-alias-revision-matrix.json", historical_stations: amtrakMatrix.historical_station_count, current_names: amtrakMatrix.current_distinct_name_count, unresolved_names: amtrakMatrix.unresolved_current_names.length },
    { file: "phase-57h-montana-field-provenance-version-matrix.json", fields: montanaMatrix.field_count, projects: montanaMatrix.project_count },
    { file: "phase-57h-hanford-authority-observation-compatibility-matrix.json", authorities: hanfordMatrix.authority_count, transitions: hanfordMatrix.transition_count, observation_pairs: hanfordMatrix.observation_pair_count, direct_numeric_joins: 0 },
    { file: "phase-57h-nnsa-fy26-fy27-gao-change-history.json", objects: nnsaMatrix.object_count, source_versions: nnsaMatrix.version_count, change_events: nnsaMatrix.change_event_count },
  ],
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [], inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57g.post_batch_visible_scope, post_batch_visible_scope: phase57g.post_batch_visible_scope,
  post_batch_closure_counts: phase57g.post_batch_closure_counts, preserved_phase57g_holds: priorHoldKeys,
  new_visible_holds: [], records,
});
await writeJson(join(dataRoot, "phase-57h-publication-review.json"), {
  phase: "57H", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key })),
  exact_target_artifacts_acquired: 0,
  decision: "Twenty bounded provenance and compatibility panels publish. All nine Phase 57G operating-outcome holds remain visible; no new hold, trigger, contact, scope change, implementation change, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 756).padStart(2, "0")}-${record.record_id.replace(/^record-57h-/, "")}.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57h-${record.record_id.replace(/^record-57h-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date,
    document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record makes source-version, identity, field, authority, stage, unit, and work-breakdown compatibility inspectable before later observations are joined." : "The visible hold prevents provenance structure from being mistaken for current reliability, adoption, material balance, qualified output, capacity, or independent baseline closure.",
    ftfn_relevance: ["Makes revisions and join decisions reproducible.", "Preserves unresolved identities and incompatible observations.", "Separates provenance from operating outcomes, implementation, acceptance, and closure."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls, official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`, archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record", captured_date: capturedDate,
  });
  const signal = [
    "---", `id: ${JSON.stringify(record.signal_id)}`, `title: ${JSON.stringify(record.title)}`, `slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}`,
    `record_status: ${JSON.stringify(record.record_status)}`, `summary: ${JSON.stringify(record.finding)}`, yamlList("source_ids", record.supporting_source_ids),
    `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, `primary_topic: ${JSON.stringify(meta.topics[0])}`, yamlList("framework_layers", meta.layers),
    'signal_type: "Research Result"', 'maturity_level: "Infrastructure"', 'time_horizon: "Now"', 'evidence_quality: "Official Data"',
    'verification_status: "Verified Against Primary Source"', `why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}`,
    yamlList("dependencies", ["stable identity and source-version lineage", "field, unit, operator, period, method, privacy, and authority compatibility", "separate outcome, forecast, implementation, acceptance, and closure evidence"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]), yamlList("receiving_systems", ["Phase 57H versioned provenance matrices"]),
    yamlList("local_implications", ["Do not promote a compatible join, source revision, or field match into an operating outcome."]),
    yamlList("evidence_gap_ids", meta.gaps), 'claim_scope: "Specific Source Update"', 'local_evidence_level: "General Source Layer"',
    `last_reviewed_date: ${capturedDate}`, `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57H provenance-and-compatibility contract." : "Held under the exact inherited Phase 57G operating-outcome reopening condition.")}`,
    "---", "", "## Phase 57H provenance panel", "", record.finding, "", "## Evidence stage and denominator", "", `**${record.evidence_stage}.** ${record.denominator}`,
    "", ...(record.structured_registry_file ? ["Structured matrix: `" + record.structured_registry_file + "`.", ""] : []),
    "## Evidence boundaries", "", ...record.evidence_limits.map((limit) => `- ${limit}`), "",
    "Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.", "", `Next action: ${record.next_action}`, "", "## Authority boundary", "", record.authority_boundary, "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Registry Revision, Provenance, and Compatible-Observation Joins, 2026", slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57H publishes twenty bounded provenance and compatibility panels across Amtrak, Montana BEAD, Hanford DFLAW, and NNSA while preserving all nine operating-outcome holds.",
  scope: `${amtrakMatrix.current_distinct_name_count} current Amtrak names against ${amtrakMatrix.historical_station_count} historical keys; ${montanaMatrix.field_count} Montana fields across ${montanaMatrix.project_count} projects; ${hanfordMatrix.observation_pair_count} Hanford observation-pair decisions; ${nnsaMatrix.object_count} NNSA objects across ${nnsaMatrix.version_count} source versions; and nine preserved holds.`,
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Source revision and compatible join are not operating outcomes. Alias, field, authority, stage, operator, unit, work-breakdown, capacity, qualification, acceptance, implementation, and closure remain distinct.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---", `id: ${JSON.stringify(briefingId)}`, 'title: "Research Watch 038: Registry Revision, Provenance, and Compatible-Observation Joins"',
  'slug: "research-watch-038-registry-revision-provenance-compatible-observation-joins"', 'record_status: "Published"',
  'summary: "Phase 57H publishes twenty version-aware provenance panels and preserves all nine operating-outcome holds."',
  `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, yamlList("signal_ids", signalIds), yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  'claim_scope: "Editorial Synthesis"', 'local_evidence_level: "General Source Layer"', `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "Amtrak current completion names now join through explicit alias and revision states; five unresolved names stay unresolved.",
    "Montana project fields now carry source-version, privacy, authority, and reporting-rail classifications.",
    "All thirty-six Hanford observation pairs have compatibility decisions, with zero direct numeric joins.",
    "NNSA FY 2026, FY 2027, and GAO records now align to exact work-breakdown objects without substituting cost, capacity, qualification, output, or closure states.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["Official Amtrak station-code revisions", "Montana versioned completed project-quarter tables", "Hanford batch-container identity ledger", "NNSA site-period disposition counts and exact GAO closure decision"]),
  "---", "", "## What Phase 57H adds", "",
  "Four version-aware matrices now expose alias decisions, field authority, privacy classification, custody transitions, threshold operators, unit compatibility, work-breakdown history, and source-version provenance.",
  "", "## What did not move", "",
  "No compatibility decision is an operating outcome. None of the nine inherited holds clears, and no revision is interpreted as implementation, acceptance, closure, reliability, adoption, material balance, readiness, capacity achievement, or recurring qualified output.",
  "", "## Evidence boundary", "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57H records no trigger, agency contact, FOIA request, directive-scope change, implementation change, or closure change.", "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-038-registry-revision-provenance-compatible-observation-joins.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-03-phase-57h-registry-revision-provenance-compatible-observation-joins.json"), {
  id: "update-2026-08-03-phase-57h-registry-revision-provenance-compatible-observation-joins", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57H publishes twenty versioned provenance and compatibility panels",
  summary: "Carried Tier 1 sources support four structured matrices, twenty Published panels, and nine preserved operating-outcome holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-038-registry-revision-provenance-compatible-observation-joins/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Source revision and compatible join remain separate from operating outcome, implementation, acceptance, and closure.",
  work_package: "docs/work-packages/phase-57h-registry-revision-provenance-compatible-observation-joins.md",
});

const updateJson = async (path, mutate) => { const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value); };
const amtrakSourceIds = ["source-57f-amtrak-stations-alp-fy24-29", "source-57b-amtrak-ada-progress-june-2026"];
const broadbandSourceIds = montana57g.source_ids;
const energySourceIds = [...new Set([...hanford57g.source_ids, ...nnsa57g.source_ids])];
for (const [file, selected, question] of [
  ["finance-and-risk.json", sourceIds, "Which Phase 57H source version first carries a compatible accepted operating observation against an unchanged identity and definition?"],
  ["policy-and-standards.json", sourceIds, "Which official revision first resolves a Phase 57H alias, field definition, custody join, or work-breakdown state?"],
  ["mobility.json", amtrakSourceIds, "Which official Amtrak record resolves the five current-only names or supplies station-code and device-level revision identity?"],
  ["chips-and-compute.json", broadbandSourceIds, "Which Montana report first supplies a versioned completed project-quarter table on the correct terrestrial or LEO rail?"],
  ["energy.json", energySourceIds, "Which Hanford or NNSA source first supplies compatible identity, disposition, output, or independent-closure evidence?"],
]) await updateJson(join(contentRoot, "topics", file), (value) => { value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]); });

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, sourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...amtrakSourceIds, ...broadbandSourceIds]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), energySourceIds],
]) await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57h-")), selectedSignals);
  value.source_ids = appendUnique(value.source_ids, selectedSources); value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
  value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
  value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57H versioned provenance and compatibility matrices");
  value.dependency_stack.push({ stage: "Phase 57H versioned provenance and compatibility matrices", current_state: "Twenty Published provenance panels, four structured matrices, and nine preserved operating-outcome holds.", boundary: "A revision or compatible join is not reliability, adoption, material balance, readiness, output, implementation, acceptance, or closure." });
  value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57H prohibits silent alias merges, source-version erasure, raw-code guessing, privacy-detail exposure, cross-stage or cross-unit conversion, work-breakdown substitution, rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
  value.next_records = appendUnique(value.next_records, ["Source-versioned compatible observations with stable identity, period, field definition, unit, method, authority, quality, acceptance, and disposition."]);
});

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57H adds four versioned provenance and compatibility matrices while preserving nine operating-outcome holds.";
  value.source_ids = appendUnique(value.source_ids, sourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57h-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57h-provenance-matrices");
  value.links = value.links.filter((link) => link.from !== "node-phase57h-provenance-matrices");
  value.nodes.push({ id: "node-phase57h-provenance-matrices", label: "Four versioned provenance matrices; twenty Published panels; nine holds", node_type: "Signal", note: "Alias, field, authority, unit, stage, and work-breakdown joins become inspectable without asserting outcomes." });
  value.links.push(
    { from: "node-phase57h-provenance-matrices", to: "node-phase57g-identity-registries", relationship: "Depends On", confidence: "Supported", note: "Phase 57H versions and constrains the four Phase 57G registries." },
    { from: "node-phase57h-provenance-matrices", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Unresolved aliases, field definitions, identities, periods, units, operators, and work-breakdown changes remain explicit." },
    { from: "node-phase57h-provenance-matrices", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Provenance and compatibility do not establish operating outcomes or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Four Phase 57H versioned provenance matrices, twenty bounded Published panels, and nine preserved operating-outcome holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Compatible source-versioned observations with stable identity, definition, period, unit, method, authority, quality, acceptance, and disposition."]);
});

console.log(`Generated Phase 57H: ${published.length} Published records, ${held.length} In Review holds, ${sourceIds.length} carried Tier 1 sources, four structured provenance matrices, and Research Watch 038.`);
