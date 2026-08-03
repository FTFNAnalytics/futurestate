import "./generate-phase57h-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-03";
const collectionSlug = "versioned-registry-change-detection-bounded-observation-ingestion-2026";
const collectionId = "research-collection-" + collectionSlug;
const briefingId = "briefing-research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion";
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57h = JSON.parse(await readFile(join(dataRoot, "phase-57h-registry-revision-provenance-compatible-observation-joins.json"), "utf8"));
const amtrak57h = JSON.parse(await readFile(join(dataRoot, "phase-57h-amtrak-station-alias-revision-matrix.json"), "utf8"));
const montana57h = JSON.parse(await readFile(join(dataRoot, "phase-57h-montana-field-provenance-version-matrix.json"), "utf8"));
const hanford57h = JSON.parse(await readFile(join(dataRoot, "phase-57h-hanford-authority-observation-compatibility-matrix.json"), "utf8"));
const nnsa57h = JSON.parse(await readFile(join(dataRoot, "phase-57h-nnsa-fy26-fy27-gao-change-history.json"), "utf8"));
if (phase57h.phase !== "57H" || phase57h.records.length !== 29) throw new Error("Phase 57I requires the complete Phase 57H release.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const amtrakDiffRows = amtrak57h.current_station_rows.map((row, index) => {
  const identityState = row.match_method === "exact_display_name"
    ? "accepted_exact_identity_join"
    : row.match_method.startsWith("controlled_alias")
      ? "accepted_controlled_alias_join"
      : "blocked_pending_official_station_code_or_crosswalk";
  return {
    queue_id: "AMTRAK-DIFF-" + String(index + 1).padStart(3, "0"),
    historical_snapshot_id: "AMTRAK-APPENDIX-B-FY2024-2029",
    current_snapshot_id: "AMTRAK-ADA-PROGRESS-JUNE-2026",
    current_display_name: row.current_display_name,
    current_cohorts: row.current_cohorts,
    historical_station_id: row.resolved_historical_station_id,
    historical_display_name: row.historical_display_name,
    historical_state: row.historical_state,
    official_station_code: null,
    match_method: row.match_method,
    identity_review_state: identityState,
    diff_decision: row.resolved_historical_station_id ? "existing_identity_with_new_source_observation" : "unresolved_identity",
    added_state: "not_assessed",
    removed_state: "not_assessed",
    renamed_state: "not_assessed",
    replaced_state: "not_assessed",
    operating_outcome: null,
  };
});
const amtrakHistoricalQueue = amtrak57h.historical_revision_rows.map((row) => ({
  historical_station_id: row.historical_station_id,
  historical_display_name: row.historical_display_name,
  historical_state: row.state,
  current_observation_state: row.revision_state,
  removal_state: "not_assessed",
  review_action: row.current_completion_display_name ? "retain_identity_and_attach_bounded_observation" : "retain_historical_identity_without_deletion_inference",
}));
const amtrakRail = {
  phase: "57I",
  captured_date: capturedDate,
  rail_type: "Versioned station registry change-detection queue",
  source_snapshots: amtrak57h.source_versions.map((source, index) => ({
    snapshot_id: index === 0 ? "AMTRAK-APPENDIX-B-FY2024-2029" : "AMTRAK-ADA-PROGRESS-JUNE-2026",
    ...source,
  })),
  review_vocabulary: ["unchanged identity", "added", "removed", "renamed", "replaced", "unresolved", "new bounded observation"],
  current_name_queue_count: amtrakDiffRows.length,
  historical_identity_queue_count: amtrakHistoricalQueue.length,
  accepted_identity_joins: amtrakDiffRows.filter((row) => row.identity_review_state.startsWith("accepted")).length,
  unresolved_identity_joins: amtrakDiffRows.filter((row) => row.identity_review_state.startsWith("blocked")).length,
  official_station_codes_present: amtrakDiffRows.filter((row) => row.official_station_code).length,
  official_station_codes_pending: amtrakDiffRows.filter((row) => !row.official_station_code).length,
  asserted_additions: 0,
  asserted_removals: 0,
  asserted_renames: 0,
  asserted_replacements: 0,
  operating_outcomes_ingested: 0,
  promotion_rule: "A diff decision requires compatible source scope, identity authority, station code or controlled crosswalk, effective date, and reviewer disposition. A cohort appearance remains a bounded observation, not an addition, rename, replacement, or reliability result.",
  current_name_diff_queue: amtrakDiffRows,
  historical_identity_queue: amtrakHistoricalQueue,
};
await writeJson(join(dataRoot, "phase-57i-amtrak-source-diff-queue.json"), amtrakRail);

const montanaSchemaVersions = [
  { schema_id: "MT-BEAD-APPROVED-PROPOSAL-2026-01-05", rail: "proposal baseline", status: "available", field_definition_state: "versioned Phase 57H baseline" },
  { schema_id: "MT-BEAD-TERRESTRIAL-QUARTERLY-NEXT", rail: "terrestrial", status: "contract_only_no_completed_public_table", field_definition_state: "requires official completed-table schema" },
  { schema_id: "MT-BEAD-LEO-QUARTERLY-NEXT", rail: "LEO", status: "contract_only_no_completed_public_table", field_definition_state: "requires official completed-table schema" },
];
const montanaFieldMigrationRows = montana57h.field_dictionary.map((field, index) => ({
  migration_id: "MT-FIELD-MIGRATION-" + String(index + 1).padStart(2, "0"),
  source_schema_id: "MT-BEAD-APPROVED-PROPOSAL-2026-01-05",
  source_field: field.field,
  source_authority: field.authority,
  definition: field.definition,
  privacy_class: field.privacy_class,
  join_role: field.join_role,
  terrestrial_target_field: null,
  leo_target_field: null,
  migration_status: field.field === "outcome_state"
    ? "reserved_until_validated_completed_record"
    : field.field === "raw_technology_codes"
      ? "blocked_pending_official_code_dictionary"
      : "pending_compatible_official_target_schema",
  automatic_migration_allowed: false,
  operating_outcome: null,
}));
const montanaProjectQuarterEnvelopes = montana57h.project_versions.map((project) => ({
  envelope_id: project.project_id + "|pending-period|pending-schema",
  project_id: project.project_id,
  subgrantee_id: project.subgrantee_id,
  reporting_rail: project.reporting_rail,
  baseline_schema_id: "MT-BEAD-APPROVED-PROPOSAL-2026-01-05",
  required_observation_key: project.compatible_future_observation_key,
  reporting_period: null,
  source_schema_id: null,
  source_authority: null,
  state_acceptance: null,
  privacy_review: "required_before_publication",
  ingestion_state: "waiting_for_completed_public_project_quarter",
  operating_outcome: null,
}));
const montanaRailCounts = Object.fromEntries(["terrestrial", "LEO"].map((rail) => [rail, montanaProjectQuarterEnvelopes.filter((row) => row.reporting_rail === rail).length]));
const montanaRail = {
  phase: "57I",
  captured_date: capturedDate,
  rail_type: "Field-schema migration and completed-project-quarter intake contract",
  schema_versions: montanaSchemaVersions,
  field_migration_decision_count: montanaFieldMigrationRows.length,
  project_quarter_envelope_count: montanaProjectQuarterEnvelopes.length,
  reporting_rail_counts: montanaRailCounts,
  completed_project_quarters_ingested: 0,
  accepted_field_migrations: 0,
  blocked_or_pending_field_migrations: montanaFieldMigrationRows.length,
  individual_bsl_identifiers_published: 0,
  individual_cai_details_published: 0,
  automatic_cross_rail_migrations: 0,
  validation_requirements: ["project_id", "reporting period", "official schema version", "reporting rail", "field definition", "unit", "authority", "privacy class", "state acceptance or corrective-action state"],
  publication_rule: "Publish a project-quarter observation only after its project, period, source schema, field definition, reporting rail, unit, authority, privacy class, and state disposition are compatible. Terrestrial and LEO fields never cross-migrate automatically.",
  field_migration_rows: montanaFieldMigrationRows,
  project_quarter_envelopes: montanaProjectQuarterEnvelopes,
};
await writeJson(join(dataRoot, "phase-57i-montana-schema-migration-project-quarter-intake.json"), montanaRail);

const hanfordValidatorFields = ["identity", "period", "stage", "measure", "threshold_operator", "method", "unit", "authority", "quality", "acceptance", "disposition"];
const hanfordObservationEnvelopes = hanford57h.observations.map((observation) => ({
  observation_id: observation.event_id,
  source_id: observation.source_id,
  stage_id: observation.stage_id,
  observation_date: observation.observation_date ?? null,
  observation_period: observation.observation_period ?? null,
  measure: observation.measure,
  threshold_operator: observation.operator,
  value: observation.value,
  unit: observation.unit,
  authority: observation.authority,
  method: null,
  stable_batch_id: null,
  stable_container_id: null,
  quality_state: null,
  acceptance_state: null,
  disposition_state: null,
  ingestion_state: "accepted_as_bounded_standalone_observation",
  numeric_join_eligible: false,
  operating_outcome: null,
}));
const observationById = new Map(hanfordObservationEnvelopes.map((row) => [row.observation_id, row]));
const hanfordPairDecisions = hanford57h.observation_pairs.map((pair) => {
  const left = observationById.get(pair.left_event_id);
  const right = observationById.get(pair.right_event_id);
  const checks = {
    identity: Boolean(left.stable_batch_id && right.stable_batch_id && left.stable_batch_id === right.stable_batch_id),
    period: Boolean((left.observation_date || left.observation_period) && (left.observation_date || left.observation_period) === (right.observation_date || right.observation_period)),
    stage: left.stage_id === right.stage_id,
    measure: left.measure === right.measure,
    threshold_operator: left.threshold_operator === right.threshold_operator,
    method: Boolean(left.method && right.method && left.method === right.method),
    unit: Boolean(left.unit && left.unit === right.unit),
    authority: left.authority === right.authority,
    quality: Boolean(left.quality_state && right.quality_state && left.quality_state === right.quality_state),
    acceptance: Boolean(left.acceptance_state && right.acceptance_state && left.acceptance_state === right.acceptance_state),
    disposition: Boolean(left.disposition_state && right.disposition_state && left.disposition_state === right.disposition_state),
  };
  const failedChecks = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  return {
    pair_id: pair.pair_id,
    left_observation_id: pair.left_event_id,
    right_observation_id: pair.right_event_id,
    prior_compatibility_class: pair.compatibility,
    validator_checks: checks,
    failed_checks: failedChecks,
    direct_numeric_join_allowed: failedChecks.length === 0,
    decision: failedChecks.length === 0 ? "accepted_compatible_numeric_join" : "rejected_incompatible_numeric_join",
    operating_outcome: null,
  };
});
const hanfordRail = {
  phase: "57I",
  captured_date: capturedDate,
  rail_type: "Bounded-observation intake and compatible-join validator",
  validator_fields: hanfordValidatorFields,
  validator_field_count: hanfordValidatorFields.length,
  bounded_standalone_observations_ingested: hanfordObservationEnvelopes.length,
  observation_pair_decisions: hanfordPairDecisions.length,
  accepted_direct_numeric_joins: hanfordPairDecisions.filter((row) => row.direct_numeric_join_allowed).length,
  rejected_direct_numeric_joins: hanfordPairDecisions.filter((row) => !row.direct_numeric_join_allowed).length,
  lifecycle_transition_count: hanford57h.transitions.length,
  public_batch_ids: 0,
  public_container_ids: 0,
  complete_material_balances: 0,
  validation_rule: "A numeric join passes only when identity, period, stage, measure, threshold operator, method, unit, authority, quality, acceptance, and disposition all align. Standalone observations may remain published with null compatibility fields, but cannot be combined.",
  nonconversion_rules: hanford57h.nonconversion_rules,
  observation_envelopes: hanfordObservationEnvelopes,
  pair_validation_decisions: hanfordPairDecisions,
};
await writeJson(join(dataRoot, "phase-57i-hanford-bounded-observation-validator.json"), hanfordRail);

const nnsaObjectVersionCells = nnsa57h.object_history.flatMap((object) => nnsa57h.source_versions.map((version) => ({
  cell_id: object.registry_id + "|" + version.version_id,
  registry_id: object.registry_id,
  object_type: object.object_type,
  source_version_id: version.version_id,
  source_id: version.source_id,
  effective_period: version.effective_period,
  authority: version.authority,
  version_state: object.versions[version.version_id],
  comparison_rule: object.compatibility_decision,
  operating_outcome: null,
})));
const nnsaDiffQueue = nnsa57h.change_events.map((event, index) => ({
  queue_id: "NNSA-DIFF-" + String(index + 1).padStart(2, "0"),
  ...event,
  review_state: "accepted_as_bounded_object_level_diff",
  compatible_object_identity: true,
  scope_preserved: true,
  cost_concept_preserved: !event.change_type.includes("cost") || event.bounded_change.includes("cost"),
  operating_outcome: null,
  implementation_change: false,
  closure_change: false,
}));
const nnsaRail = {
  phase: "57I",
  captured_date: capturedDate,
  rail_type: "Object-level FY and GAO source-diff ledger",
  object_count: nnsa57h.object_count,
  source_version_count: nnsa57h.version_count,
  object_version_cell_count: nnsaObjectVersionCells.length,
  bounded_diff_event_count: nnsaDiffQueue.length,
  accepted_bounded_diff_events: nnsaDiffQueue.length,
  operating_outcomes_ingested: 0,
  implementation_changes: 0,
  closure_changes: 0,
  comparison_dimensions: ["registry object", "scope definition", "cost concept", "schedule basis", "effective period", "source authority", "capacity state", "qualification state", "output state", "project completion", "capability state", "independent closure state"],
  validation_rule: "Store a source diff at the exact work-breakdown object and preserve scope, cost concept, schedule basis, effective period, and authority. Budget, project estimate, capacity, qualification, accepted unit, recurring output, completion, capability, implementation, and independent recommendation closure are never substituted.",
  source_versions: nnsa57h.source_versions,
  object_version_cells: nnsaObjectVersionCells,
  bounded_diff_queue: nnsaDiffQueue,
};
await writeJson(join(dataRoot, "phase-57i-nnsa-object-level-source-diff-ledger.json"), nnsaRail);

const amtrakSourceIds = amtrak57h.source_versions.map((source) => source.source_id);
const montanaSourceIds = montana57h.source_versions.map((source) => source.source_id);
const hanfordSourceIds = hanford57h.authority_rows.map((row) => row.source_id);
const nnsaSourceIds = nnsa57h.source_versions.map((source) => source.source_id);
const specs = [
  { slug: "amtrak-sixteen-name-source-diff-queue", agency: "DOT", actionKey: "AMTRAK-SOURCE-DIFF-QUEUE-2026-01", stage: "Versioned station change detection", sourceIds: amtrakSourceIds, title: "Sixteen Amtrak current names now enter a versioned source-diff queue", finding: "The queue records eleven accepted identity joins and five unresolved identities without asserting additions, removals, renames, or replacements.", denominator: "Sixteen current names, nineteen cohort memberships, and 178 retained historical identities.", limits: ["A source observation is not a registry replacement.", "Historical nonappearance is not deletion.", "Operating outcomes remain null."], next: "Review each later source snapshot against the same identity and scope contract.", registry: "phase-57i-amtrak-source-diff-queue.json" },
  { slug: "amtrak-eleven-reviewed-identity-joins", agency: "DOT", actionKey: "AMTRAK-IDENTITY-JOIN-REVIEW-2026-01", stage: "Versioned station change detection", sourceIds: amtrakSourceIds, title: "Eleven Amtrak identity joins pass exact or controlled-alias review", finding: "Ten exact names and one controlled Mount-to-Mt. alias can receive bounded June 2026 observations while retaining historical identity.", denominator: "Eleven accepted identity joins: ten exact and one controlled alias.", limits: ["Alias is not an official rename.", "Name identity is not device identity.", "Completion is not reliability."], next: "Require official station and device identifiers before attaching asset-level outcomes.", registry: "phase-57i-amtrak-source-diff-queue.json" },
  { slug: "amtrak-official-station-code-resolution-queue", agency: "DOT", actionKey: "AMTRAK-STATION-CODE-QUEUE-2026-01", stage: "Versioned station change detection", sourceIds: amtrakSourceIds, title: "Official station-code resolution remains queued for all sixteen current names", finding: "The carried source set supplies no explicit official station-code field, so all sixteen current names retain a null station-code slot.", denominator: "Sixteen current names; zero source-explicit station codes in the carried matrices.", limits: ["FTFN does not manufacture codes.", "Exact name match does not prove code identity.", "State-qualified ambiguity remains reviewable."], next: "Join an official code-bearing station registry before any automated identity merge.", registry: "phase-57i-amtrak-source-diff-queue.json" },
  { slug: "amtrak-five-unresolved-diff-decisions", agency: "DOT", actionKey: "AMTRAK-UNRESOLVED-DIFF-QUEUE-2026-01", stage: "Versioned station change detection", sourceIds: amtrakSourceIds, title: "Five Amtrak names remain blocked from automated registry change decisions", finding: "Du Quoin, Granby, Hamlet, Pomona, and Rocklin remain unresolved and cannot be classified as added, renamed, or replaced.", denominator: "Five unresolved names among sixteen current names.", limits: ["Geography alone is not identity authority.", "Current-only is not added.", "No ambiguous merge is promoted."], next: "Resolve with an official code, state-qualified record, or explicit crosswalk.", registry: "phase-57i-amtrak-source-diff-queue.json" },
  { slug: "amtrak-zero-asserted-registry-changes", agency: "DOT", actionKey: "AMTRAK-ZERO-ASSERTED-CHANGES-2026-01", stage: "Versioned station change detection", sourceIds: amtrakSourceIds, title: "Phase 57I asserts zero Amtrak additions, removals, renames, or replacements", finding: "The queue stores bounded observations and unresolved identities while leaving every structural registry-change state unasserted.", denominator: "178 historical identities and sixteen current names across two source snapshots.", limits: ["Absence is not removal.", "Alias is not rename.", "Observation is not structural change."], next: "Promote a structural change only with direct source authority and reviewer disposition.", registry: "phase-57i-amtrak-source-diff-queue.json" },

  { slug: "montana-thirteen-field-schema-migration-ledger", agency: "NTIA", actionKey: "MT-SCHEMA-MIGRATION-LEDGER-2026-01", stage: "Schema migration and bounded intake", sourceIds: montanaSourceIds, title: "Thirteen Montana fields now have explicit migration decisions", finding: "Every Phase 57H field carries a source schema, authority, privacy class, join role, target-schema slot, and blocked or pending migration state.", denominator: "Thirteen field-migration rows across three schema-version rails.", limits: ["No target field is guessed.", "Raw codes remain untranslated.", "Reserved outcomes stay null."], next: "Populate target fields only from an official completed-table schema.", registry: "phase-57i-montana-schema-migration-project-quarter-intake.json" },
  { slug: "montana-thirty-two-project-quarter-envelopes", agency: "NTIA", actionKey: "MT-PROJECT-QUARTER-ENVELOPES-2026-01", stage: "Schema migration and bounded intake", sourceIds: montanaSourceIds, title: "All thirty-two Montana projects now have bounded quarter-intake envelopes", finding: "Each approved project retains its identity, subgrantee, rail, baseline version, required observation key, privacy gate, and null outcome slot.", denominator: "Thirty-two projects and nineteen subgrantees.", limits: ["An envelope is not a submitted report.", "Proposal baselines are not completed quarters.", "Null outcomes are not zeros."], next: "Attach a completed public project-quarter only after all compatibility checks pass.", registry: "phase-57i-montana-schema-migration-project-quarter-intake.json" },
  { slug: "montana-thirty-terrestrial-two-leo-intake-rails", agency: "NTIA", actionKey: "MT-TERRESTRIAL-LEO-INTAKE-2026-01", stage: "Schema migration and bounded intake", sourceIds: montanaSourceIds, title: "Montana intake preserves thirty terrestrial and two LEO project rails", finding: "The project queue routes thirty terrestrial projects and two LEO projects to non-interchangeable future schemas.", denominator: "Thirty-two project envelopes: thirty terrestrial and two LEO.", limits: ["Similar labels do not establish common definitions.", "Cross-rail migration is prohibited.", "Reporting obligation is not performance."], next: "Validate completed reports only within their official rail and schema version.", registry: "phase-57i-montana-schema-migration-project-quarter-intake.json" },
  { slug: "montana-privacy-gated-observation-intake", agency: "NTIA", actionKey: "MT-PRIVACY-GATED-INTAKE-2026-01", stage: "Schema migration and bounded intake", sourceIds: montanaSourceIds, title: "Montana project-quarter intake applies privacy review before publication", finding: "All thirty-two envelopes require privacy review; public output continues to contain zero individual BSL identifiers and zero individual CAI details.", denominator: "Thirty-two project envelopes and thirteen classified fields.", limits: ["Project aggregates cannot expose locations.", "Subscriber data remains outside scope.", "CAI detail remains excluded."], next: "Publish only privacy-safe project or statewide aggregates after state disposition.", registry: "phase-57i-montana-schema-migration-project-quarter-intake.json" },
  { slug: "montana-zero-completed-project-quarters-ingested", agency: "NTIA", actionKey: "MT-ZERO-COMPLETED-QUARTERS-2026-01", stage: "Schema migration and bounded intake", sourceIds: montanaSourceIds, title: "No completed Montana project-quarter result is ingested in Phase 57I", finding: "The source set provides contracts and baselines but no compatible completed public project-quarter table, so all operating outcome slots remain null.", denominator: "Thirty-two waiting project envelopes and zero completed project-quarter inserts.", limits: ["Instructions are not results.", "Required fields are not observed values.", "No acceptance or corrective action is inferred."], next: "Reopen when a compatible official completed table and state disposition are public.", registry: "phase-57i-montana-schema-migration-project-quarter-intake.json" },

  { slug: "hanford-nine-bounded-observation-envelopes", agency: "DOE", actionKey: "HANFORD-OBSERVATION-ENVELOPES-2026-01", stage: "Compatible-observation validation", sourceIds: hanfordSourceIds, title: "Nine Hanford records now ingest as bounded standalone observations", finding: "Each observation preserves source, stage, date or period, measure, threshold operator, value, unit, and authority while leaving missing identity and disposition fields null.", denominator: "Nine source-attributed observations across the DFLAW lifecycle.", limits: ["Standalone acceptance is not a numeric join.", "Null identity is not a shared cohort.", "Milestones and quantities remain distinct."], next: "Add later observations through the same envelope before comparison.", registry: "phase-57i-hanford-bounded-observation-validator.json" },
  { slug: "hanford-thirty-six-pair-validator-rejections", agency: "DOE", actionKey: "HANFORD-PAIR-VALIDATOR-2026-01", stage: "Compatible-observation validation", sourceIds: hanfordSourceIds, title: "The Hanford validator rejects all thirty-six direct numeric pair joins", finding: "Every candidate pair fails at least one required compatibility field; no direct numeric join is accepted.", denominator: "Thirty-six unordered observation pairs and eleven required validator fields.", limits: ["Same unit is insufficient.", "Same stage is insufficient.", "Different authorities and dispositions remain explicit."], next: "Re-evaluate only when every required compatibility field is present and aligned.", registry: "phase-57i-hanford-bounded-observation-validator.json" },
  { slug: "hanford-eleven-field-compatibility-contract", agency: "DOE", actionKey: "HANFORD-ELEVEN-FIELD-VALIDATOR-2026-01", stage: "Compatible-observation validation", sourceIds: hanfordSourceIds, title: "Hanford numeric joins now require eleven aligned fields", finding: "Identity, period, stage, measure, threshold operator, method, unit, authority, quality, acceptance, and disposition must all pass.", denominator: "Eleven validator fields applied to every candidate observation pair.", limits: ["Missing values fail the direct-join gate.", "Threshold operators are preserved.", "Authority cannot be inherited across records."], next: "Keep failed checks visible and never coerce missing fields into matches.", registry: "phase-57i-hanford-bounded-observation-validator.json" },
  { slug: "hanford-fourteen-transition-intake-boundaries", agency: "DOE", actionKey: "HANFORD-TRANSITION-INTAKE-2026-01", stage: "Compatible-observation validation", sourceIds: hanfordSourceIds, title: "Fourteen Hanford transitions remain routing boundaries, not observed transfers", finding: "The validator retains all fourteen lifecycle edges while requiring dated transfer, receipt, stable identity, method, unit, quality, acceptance, and disposition evidence.", denominator: "Fourteen registered transitions and nine standalone observations.", limits: ["Process adjacency is not custody evidence.", "Parallel stages do not establish lineage.", "No batch or container IDs are public."], next: "Ingest a transition only with compatible sending and receiving records.", registry: "phase-57i-hanford-bounded-observation-validator.json" },
  { slug: "hanford-zero-material-balance-joins", agency: "DOE", actionKey: "HANFORD-ZERO-MATERIAL-BALANCE-2026-01", stage: "Compatible-observation validation", sourceIds: hanfordSourceIds, title: "Phase 57I creates zero synthetic Hanford material-balance joins", finding: "Nine bounded observations remain standalone; zero public batch IDs, container IDs, direct numeric joins, or complete material balances are created.", denominator: "Nine observations, thirty-six pair decisions, and fourteen transitions.", limits: ["Container counts are not mass.", "Gallons are not glass output without a source method.", "Shipment, staging, and disposal require identity lineage."], next: "Require a regulator-verifiable batch-container ledger before reconciliation.", registry: "phase-57i-hanford-bounded-observation-validator.json" },

  { slug: "nnsa-seventy-two-object-version-cells", agency: "DOE", actionKey: "NNSA-OBJECT-VERSION-CELLS-2026-01", stage: "Object-level source diff", sourceIds: nnsaSourceIds, title: "NNSA source history now resolves into seventy-two object-version cells", finding: "Eighteen work-breakdown objects are evaluated against four formal source versions with explicit relevance and comparison rules.", denominator: "Eighteen objects multiplied by four source versions equals seventy-two cells.", limits: ["Non-use is not deletion.", "Version presence is not completion.", "Object boundaries remain fixed."], next: "Attach every later source observation to the same object-version cell structure.", registry: "phase-57i-nnsa-object-level-source-diff-ledger.json" },
  { slug: "nnsa-ten-bounded-source-diff-events", agency: "DOE", actionKey: "NNSA-BOUNDED-DIFF-EVENTS-2026-01", stage: "Object-level source diff", sourceIds: nnsaSourceIds, title: "Ten NNSA changes pass bounded object-level diff review", finding: "The existing ten scope, budget, cost, schedule, capacity, qualification, and GAO-state events are accepted as source diffs with operating outcomes left null.", denominator: "Ten reviewed change events across LAP4, SRPPF, capacity, qualification, and GAO objects.", limits: ["Budget change is not implementation.", "Forecast change is not completion.", "Accepted source diff is not accepted output."], next: "Compare later versions only against the same object and definition.", registry: "phase-57i-nnsa-object-level-source-diff-ledger.json" },
  { slug: "nnsa-lap4-object-level-diff-guard", agency: "DOE", actionKey: "NNSA-LAP4-DIFF-GUARD-2026-01", stage: "Object-level source diff", sourceIds: nnsaSourceIds, title: "LAP4 diffs remain attached to the umbrella or exact child object", finding: "The validator prevents umbrella cost, 30 Diamond scope, subproject baseline, and critical-decision states from replacing one another.", denominator: "One LAP4 umbrella and six registered child objects across four source versions.", limits: ["Umbrella cost is not enterprise lifecycle cost.", "Scope strategy is not completion.", "Critical decision is not operating output."], next: "Store each later LAP4 change at its exact work-breakdown object.", registry: "phase-57i-nnsa-object-level-source-diff-ledger.json" },
  { slug: "nnsa-srppf-object-level-diff-guard", agency: "DOE", actionKey: "NNSA-SRPPF-DIFF-GUARD-2026-01", stage: "Object-level source diff", sourceIds: nnsaSourceIds, title: "SRPPF host, umbrella, and subproject diffs remain separate", finding: "The former MOX host, SRPPF umbrella, Main Process Building, and HFTOC keep distinct object-version cells and comparison rules.", denominator: "Four Savannah River facility, project, and subproject objects across four source versions.", limits: ["Host reuse is not project completion.", "Subproject baseline is not umbrella capability.", "GAO assessment retains independent attribution."], next: "Join later cost, schedule, completion, and capability states to the exact object.", registry: "phase-57i-nnsa-object-level-source-diff-ledger.json" },
  { slug: "nnsa-zero-outcome-implementation-closure-promotions", agency: "DOE", actionKey: "NNSA-ZERO-STATE-PROMOTIONS-2026-01", stage: "Object-level source diff", sourceIds: nnsaSourceIds, title: "Phase 57I promotes zero NNSA outcomes, implementation changes, or closures", finding: "All ten accepted source diffs remain bounded history; capacity, qualification, recurring output, completion, capability, implementation, and GAO closure remain separate.", denominator: "Seventy-two cells, ten bounded diff events, and zero operating-outcome promotions.", limits: ["One accepted unit is not a rate.", "Capacity is not output.", "Agency planning is not GAO closure."], next: "Change operating or closure state only with exact object-level authority.", registry: "phase-57i-nnsa-object-level-source-diff-ledger.json" },
];

const holdKeyMap = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-07": "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-08",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-06": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-07",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-07": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-08",
  "LA-BEAD-STARLINK-HOLD-2026-07": "LA-BEAD-STARLINK-HOLD-2026-08",
  "MT-BEAD-QUARTERLY-HOLD-2026-07": "MT-BEAD-QUARTERLY-HOLD-2026-08",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-04": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-05",
  "NNSA-PIT-RATE-HOLD-2026-07": "NNSA-PIT-RATE-HOLD-2026-08",
  "NNSA-PIT-PEIS-HOLD-2026-07": "NNSA-PIT-PEIS-HOLD-2026-08",
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-08": "NNSA-PIT-GAO-BASELINE-HOLD-2026-09",
};
const inheritedHolds = phase57h.records.filter((record) => record.record_status === "In Review").map((record) => ({
  slug: "preserved-" + record.record_id.replace(/^record-57h-preserved-/, ""),
  agency: record.agency,
  actionKey: holdKeyMap[record.action_key],
  parentHold: record.action_key,
  stage: record.evidence_stage,
  sourceIds: record.supporting_source_ids,
  title: record.title,
  finding: record.finding,
  denominator: record.denominator,
  limits: record.evidence_limits,
  next: record.next_action,
  registry: null,
  status: "In Review",
  publicationDate: record.publication_date,
}));
if (specs.length !== 20 || inheritedHolds.length !== 9 || inheritedHolds.some((hold) => !hold.actionKey)) {
  throw new Error("Phase 57I requires twenty control panels and nine preserved holds.");
}
const allSpecs = [...specs.map((spec) => ({ ...spec, status: "Published", publicationDate: capturedDate })), ...inheritedHolds];
const carriedSourceIds = [...new Set(phase57h.records.flatMap((record) => record.supporting_source_ids))];
const sourceById = new Map();
for (const id of carriedSourceIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", id + ".json"), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const authorityBoundary = "A queued diff, accepted identity match, migration plan, intake envelope, validator result, source-version cell, or bounded insert is not an operating outcome. Unresolved identities, missing fields, privacy-sensitive detail, incompatible periods, stages, units, operators, methods, authorities, dispositions, work-breakdown objects, implementation states, and closure states remain explicit. No record supports rankings, composite scores, readiness scores, generalized savings, or unsupported causal attribution.";
const records = allSpecs.map((spec, index) => ({
  record_id: "record-57i-" + spec.slug,
  document_id: "research-doc-57i-" + spec.slug,
  signal_id: "signal-57i-" + spec.slug,
  document_number: 786 + index,
  phase: "57I",
  action_key: spec.actionKey,
  parent_hold_key: spec.parentHold ?? null,
  agency: spec.agency,
  entity_id: agencyMeta[spec.agency].entity,
  record_type: "Versioned change-detection and bounded-observation ingestion panel",
  evidence_stage: spec.stage,
  title: spec.title,
  record_status: spec.status,
  source_id: spec.sourceIds[0],
  supporting_source_ids: spec.sourceIds,
  official_url: sourceById.get(spec.sourceIds[0])?.url,
  publication_date: spec.publicationDate,
  document_type: spec.status === "In Review" ? "Technical Report" : "Data Release",
  finding: spec.finding,
  denominator: spec.denominator,
  evidence_limits: spec.limits,
  next_action: spec.next,
  structured_registry_file: spec.registry,
  exact_target_artifact_acquired: false,
  directive_scope_change: false,
  implementation_change: false,
  closure_change: false,
  contact_or_foia_submitted: false,
  authority_boundary: authorityBoundary,
  captured_date: capturedDate,
}));
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const evidenceStageCounts = Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length]));
const priorHoldKeys = phase57h.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57i-versioned-registry-change-detection-bounded-observation-ingestion.json"), {
  phase: "57I",
  captured_date: capturedDate,
  goal: "Turn the four Phase 57H provenance matrices into repeatable reviewed source-diff and bounded-observation intake rails without bypassing publication review.",
  publication_rule: "Publish control, validation, and bounded insert decisions only; preserve unresolved and incompatible states and all nine operating-outcome holds.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: evidenceStageCounts,
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57i-amtrak-source-diff-queue.json", current_names: amtrakRail.current_name_queue_count, accepted_identity_joins: amtrakRail.accepted_identity_joins, unresolved_identity_joins: amtrakRail.unresolved_identity_joins, asserted_structural_changes: 0 },
    { file: "phase-57i-montana-schema-migration-project-quarter-intake.json", fields: montanaRail.field_migration_decision_count, projects: montanaRail.project_quarter_envelope_count, completed_project_quarters_ingested: 0 },
    { file: "phase-57i-hanford-bounded-observation-validator.json", observations: hanfordRail.bounded_standalone_observations_ingested, pair_decisions: hanfordRail.observation_pair_decisions, accepted_direct_numeric_joins: 0 },
    { file: "phase-57i-nnsa-object-level-source-diff-ledger.json", objects: nnsaRail.object_count, object_version_cells: nnsaRail.object_version_cell_count, bounded_diff_events: nnsaRail.bounded_diff_event_count },
  ],
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57h.post_batch_visible_scope,
  post_batch_visible_scope: phase57h.post_batch_visible_scope,
  post_batch_closure_counts: phase57h.post_batch_closure_counts,
  preserved_phase57h_holds: priorHoldKeys,
  new_visible_holds: [],
  records,
});
await writeJson(join(dataRoot, "phase-57i-publication-review.json"), {
  phase: "57I",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key })),
  exact_target_artifacts_acquired: 0,
  decision: "Twenty bounded change-detection and ingestion-control panels publish. All nine Phase 57H operating-outcome holds remain visible; no new hold, trigger, contact, scope change, implementation change, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = String(record.document_number - 785).padStart(2, "0") + "-" + record.record_id.replace(/^record-57i-/, "") + ".txt";
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", record.document_number + "-57i-" + record.record_id.replace(/^record-57i-/, "") + ".json"), {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status,
    publisher: firstSource?.owner ?? "U.S. public-sector authority",
    publication_date: record.publication_date,
    document_type: record.document_type,
    summary: record.finding + " Denominator: " + record.denominator,
    key_findings: ["Evidence stage: " + record.evidence_stage + ".", "Finding: " + record.finding, "Denominator: " + record.denominator, ...record.evidence_limits.map((limit) => "Boundary: " + limit), "Next action: " + record.next_action],
    why_it_matters: record.record_status === "Published"
      ? "The record makes change detection, schema migration, observation validation, and object-level source diffs reviewable before publication."
      : "The visible hold prevents an intake rail from being mistaken for current reliability, adoption, material balance, qualified output, capacity, or independent baseline closure.",
    ftfn_relevance: ["Turns provenance matrices into repeatable review rails.", "Keeps rejected joins and unresolved identities explicit.", "Separates bounded inserts from operating outcomes, implementation, acceptance, and closure."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: sourceUrls,
    official_url: record.official_url,
    local_capture_path: "/downloads/" + collectionSlug + "/official-links/" + archiveName,
    archive_member: "official-links/" + archiveName,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });
  const signal = [
    "---",
    "id: " + JSON.stringify(record.signal_id),
    "title: " + JSON.stringify(record.title),
    "slug: " + JSON.stringify(record.signal_id.replace(/^signal-/, "")),
    "record_status: " + JSON.stringify(record.record_status),
    "summary: " + JSON.stringify(record.finding),
    yamlList("source_ids", record.supporting_source_ids),
    "published_date: " + capturedDate,
    "captured_date: " + capturedDate,
    "primary_topic: " + JSON.stringify(meta.topics[0]),
    yamlList("framework_layers", meta.layers),
    "signal_type: \"Research Result\"",
    "maturity_level: \"Infrastructure\"",
    "time_horizon: \"Now\"",
    "evidence_quality: \"Official Data\"",
    "verification_status: \"Verified Against Primary Source\"",
    "why_it_matters: " + JSON.stringify("Evidence stage: " + record.evidence_stage + ". Denominator: " + record.denominator),
    yamlList("dependencies", ["stable source snapshots and identity lineage", "schema, period, stage, measure, operator, method, unit, authority, privacy, acceptance, and disposition compatibility", "separate outcome, implementation, capability, and closure evidence"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57I change-detection and bounded-ingestion rails"]),
    yamlList("local_implications", ["Do not promote a queued diff, accepted envelope, or validator result into an operating outcome."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    "last_reviewed_date: " + capturedDate,
    "editorial_notes: " + JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57I change-detection-and-ingestion contract." : "Held under the exact inherited Phase 57H operating-outcome reopening condition."),
    "---",
    "",
    "## Phase 57I control panel",
    "",
    record.finding,
    "",
    "## Evidence stage and denominator",
    "",
    "**" + record.evidence_stage + ".** " + record.denominator,
    "",
    ...(record.structured_registry_file ? ["Structured rail: " + record.structured_registry_file + ".", ""] : []),
    "## Evidence boundaries",
    "",
    ...record.evidence_limits.map((limit) => "- " + limit),
    "",
    "Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.",
    "",
    "Next action: " + record.next_action,
    "",
    "## Authority boundary",
    "",
    record.authority_boundary,
    "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", record.signal_id + ".mdx"), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", collectionSlug + ".json"), {
  id: collectionId,
  title: "Versioned Registry Change Detection and Bounded-Observation Ingestion, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57I publishes twenty bounded change-detection and ingestion-control panels across Amtrak, Montana BEAD, Hanford DFLAW, and NNSA while preserving all nine operating-outcome holds.",
  scope: "16 Amtrak current-name diffs; 13 Montana field migrations and 32 project-quarter envelopes; 9 Hanford standalone observations and 36 pair validations; 18 NNSA objects, 72 object-version cells, and 10 bounded diffs; plus nine preserved holds.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: "/downloads/" + collectionSlug + ".zip",
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "A queued diff, schema migration, accepted standalone observation, validator result, or bounded object-level change is not an operating outcome. Identity, privacy, period, stage, method, unit, authority, acceptance, implementation, capability, and closure remain distinct.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  "id: " + JSON.stringify(briefingId),
  "title: \"Research Watch 039: Versioned Change Detection and Bounded-Observation Ingestion\"",
  "slug: \"research-watch-039-versioned-change-detection-bounded-observation-ingestion\"",
  "record_status: \"Published\"",
  "summary: \"Phase 57I publishes twenty reviewed change-detection and ingestion-control panels and preserves all nine operating-outcome holds.\"",
  "published_date: " + capturedDate,
  "captured_date: " + capturedDate,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  "last_reviewed_date: " + capturedDate,
  yamlList("top_takeaways", [
    "Amtrak now has a sixteen-name diff queue with eleven reviewed identity joins, five unresolved names, and zero asserted structural changes.",
    "Montana now has thirteen field-migration decisions and thirty-two privacy-gated project-quarter envelopes split across terrestrial and LEO rails.",
    "Hanford ingests nine bounded standalone observations while rejecting every one of thirty-six direct numeric pair joins.",
    "NNSA now has seventy-two object-version cells and ten bounded source diffs without promoting output, implementation, capability, or closure.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["Official code-bearing Amtrak station registry", "Montana completed public project-quarter schemas and tables", "Hanford batch-container identity and disposition records", "NNSA later object-level budget, output, and exact GAO status versions"]),
  "---",
  "",
  "## What Phase 57I adds",
  "",
  "Four repeatable review rails now convert source snapshots and standalone observations into explicit queues, envelopes, validator decisions, and object-version diffs.",
  "",
  "## What did not move",
  "",
  "No control result is an operating outcome. None of the nine inherited holds clears, and no record establishes a registry addition or removal, completed project quarter, direct Hanford numeric join, NNSA implementation change, or closure.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57I records no trigger, agency contact, FOIA request, directive-scope change, implementation change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-03-phase-57i-versioned-registry-change-detection-bounded-observation-ingestion.json"), {
  id: "update-2026-08-03-phase-57i-versioned-registry-change-detection-bounded-observation-ingestion",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57I publishes twenty change-detection and bounded-ingestion controls",
  summary: "Thirty-six carried Tier 1 sources support four structured rails, twenty Published control panels, and nine preserved operating-outcome holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: ["/research/" + collectionSlug + "/", "/briefings/research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion/", ...signalIds.map((id) => "/signals/" + id.replace(/^signal-/, "") + "/")],
  evidence_note: "Queued changes, schema migrations, bounded observations, validator decisions, and object-level diffs remain separate from operating outcomes, implementation, acceptance, and closure.",
  work_package: "docs/work-packages/phase-57i-versioned-registry-change-detection-bounded-observation-ingestion.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};
const allSourceIds = carriedSourceIds;
const broadbandSourceIds = montanaSourceIds;
const energySourceIds = [...new Set([...hanfordSourceIds, ...nnsaSourceIds])];
for (const [file, selected, question] of [
  ["finance-and-risk.json", allSourceIds, "Which reviewed Phase 57I intake first carries a compatible accepted operating observation without changing its object, definition, or authority?"],
  ["policy-and-standards.json", allSourceIds, "Which official source version first clears a Phase 57I identity, schema, validator, or object-diff gate?"],
  ["mobility.json", amtrakSourceIds, "Which official code-bearing Amtrak source resolves the sixteen-name queue and five blocked identities?"],
  ["chips-and-compute.json", broadbandSourceIds, "Which Montana source first supplies a completed privacy-safe project-quarter table against a versioned terrestrial or LEO schema?"],
  ["energy.json", energySourceIds, "Which Hanford or NNSA source first supplies a fully compatible join, accepted output, implementation, capability, or exact closure state?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected);
    value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, allSourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...amtrakSourceIds, ...broadbandSourceIds]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), energySourceIds],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57i-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57I change-detection and bounded-ingestion rails");
    value.dependency_stack.push({
      stage: "Phase 57I change-detection and bounded-ingestion rails",
      current_state: "Twenty Published control panels, four structured rails, and nine preserved operating-outcome holds.",
      boundary: "A queued diff, migration plan, accepted envelope, validator decision, or bounded source change is not an operating outcome, implementation, acceptance, capability, or closure.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57I prohibits silent identity merges, guessed station codes or field mappings, privacy-detail exposure, cross-rail migration, coerced missing fields, synthetic numeric joins, work-breakdown substitution, rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Reviewed source-version inserts with stable identity, definition, period, stage, measure, operator, method, unit, authority, privacy, quality, acceptance, and disposition."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57I adds four reviewed change-detection and bounded-ingestion rails while preserving nine operating-outcome holds.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57i-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57i-ingestion-rails");
  value.links = value.links.filter((link) => link.from !== "node-phase57i-ingestion-rails");
  value.nodes.push({ id: "node-phase57i-ingestion-rails", label: "Four reviewed diff and ingestion rails; twenty Published controls; nine holds", node_type: "Signal", note: "Source changes and standalone observations become reviewable without bypassing identity, schema, compatibility, privacy, or publication gates." });
  value.links.push(
    { from: "node-phase57i-ingestion-rails", to: "node-phase57h-provenance-matrices", relationship: "Depends On", confidence: "Supported", note: "Phase 57I operationalizes the four Phase 57H provenance matrices." },
    { from: "node-phase57i-ingestion-rails", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Unresolved identities, missing schemas, incompatible fields, and object-definition changes remain explicit." },
    { from: "node-phase57i-ingestion-rails", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Validation and ingestion controls do not establish operating outcomes or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Four Phase 57I change-detection and bounded-ingestion rails, twenty Published control panels, and nine preserved operating-outcome holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Compatible reviewed observations with stable identity, schema, definition, period, stage, measure, operator, method, unit, authority, privacy, quality, acceptance, and disposition."]);
});

console.log("Generated Phase 57I: " + published.length + " Published controls, " + held.length + " In Review holds, " + carriedSourceIds.length + " carried Tier 1 sources, four structured rails, and Research Watch 039.");
