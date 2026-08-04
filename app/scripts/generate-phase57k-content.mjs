import "./generate-phase57j-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-03";
const collectionSlug = "cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-041-cross-version-transition-matrices-longitudinal-panels";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const countBy = (rows, field) => rows.reduce((counts, row) => {
  const value = typeof field === "function" ? field(row) : row[field];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57j = JSON.parse(await readFile(join(dataRoot, "phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution.json"), "utf8"));
const amtrak57j = JSON.parse(await readFile(join(dataRoot, "phase-57j-amtrak-historical-snapshot-review-queue.json"), "utf8"));
const montana57j = JSON.parse(await readFile(join(dataRoot, "phase-57j-montana-migration-envelope-rejection-taxonomy.json"), "utf8"));
const hanford57j = JSON.parse(await readFile(join(dataRoot, "phase-57j-hanford-observation-transition-rejection-taxonomy.json"), "utf8"));
const nnsa57j = JSON.parse(await readFile(join(dataRoot, "phase-57j-nnsa-object-version-classification-queue.json"), "utf8"));
if (phase57j.phase !== "57J" || phase57j.records.length !== 29) throw new Error("Phase 57K requires the complete Phase 57J release.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};
const authorityBoundary = "Agency assertions, independent oversight, FTFN control classifications, acceptance, implementation, capability, closure, and operating outcomes remain separate evidence states.";

const amtrakPresenceCells = amtrak57j.historical_identity_decisions.flatMap((row) => [
  {
    cell_id: `${row.historical_station_id}|AMTRAK-APPENDIX-B-FY2024-2029`,
    historical_station_id: row.historical_station_id,
    display_name: row.historical_display_name,
    state: row.historical_state,
    snapshot_id: "AMTRAK-APPENDIX-B-FY2024-2029",
    snapshot_state: "present_in_source_snapshot",
    identity_link_state: "historical_identity_retained",
    structural_change: "not_asserted",
    operating_outcome: null,
  },
  {
    cell_id: `${row.historical_station_id}|AMTRAK-ADA-PROGRESS-JUNE-2026`,
    historical_station_id: row.historical_station_id,
    display_name: row.historical_display_name,
    state: row.historical_state,
    snapshot_id: "AMTRAK-ADA-PROGRESS-JUNE-2026",
    snapshot_state: row.current_bounded_cohort_observation === "present"
      ? "bounded_cohort_observation_linked"
      : "not_observed_in_bounded_cohort_no_deletion_inference",
    identity_link_state: row.current_queue_id ? "accepted_bounded_identity_link" : "no_current_link_no_negative_inference",
    structural_change: "not_asserted",
    operating_outcome: null,
  },
]);
const amtrakTransitions = amtrak57j.historical_identity_decisions.map((row, index) => ({
  transition_id: `AMTRAK-LONGITUDINAL-${String(index + 1).padStart(3, "0")}`,
  historical_station_id: row.historical_station_id,
  from_snapshot_id: "AMTRAK-APPENDIX-B-FY2024-2029",
  to_snapshot_id: "AMTRAK-ADA-PROGRESS-JUNE-2026",
  transition_classification: row.current_bounded_cohort_observation === "present"
    ? "historical_presence_to_bounded_current_observation"
    : "historical_presence_to_current_nonobservation_no_deletion_inference",
  current_queue_id: row.current_queue_id,
  observed_structural_event: false,
  operating_outcome: null,
}));
const unresolvedAmtrak = amtrak57j.current_name_review_queue.filter((row) => !row.historical_station_id);
const amtrakRail = {
  phase: "57K",
  captured_date: capturedDate,
  rail_type: "Identity-by-snapshot longitudinal presence matrix",
  identity_count: 178,
  snapshot_count: 2,
  presence_cell_count: amtrakPresenceCells.length,
  presence_state_counts: countBy(amtrakPresenceCells, "snapshot_state"),
  longitudinal_transition_count: amtrakTransitions.length,
  transition_classification_counts: countBy(amtrakTransitions, "transition_classification"),
  current_name_queue_count: amtrak57j.current_name_queue_count,
  unresolved_identity_count: unresolvedAmtrak.length,
  asserted_additions: 0,
  asserted_removals: 0,
  asserted_renames: 0,
  asserted_replacements: 0,
  operating_outcomes_ingested: 0,
  review_rule: "Each identity receives one cell per retained source snapshot. A longitudinal state records only source presence or bounded cohort observation; nonobservation does not establish deletion, renaming, replacement, failure, or service quality.",
  presence_matrix: amtrakPresenceCells,
  longitudinal_transitions: amtrakTransitions,
  unresolved_identity_queue: unresolvedAmtrak,
};
await writeJson(join(dataRoot, "phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json"), amtrakRail);

const montanaCompatibilityCells = montana57j.project_envelope_tests.flatMap((project) =>
  montana57j.field_migration_tests.map((field) => ({
    cell_id: `${project.project_id}|${field.source_field}`,
    project_id: project.project_id,
    subgrantee_id: project.subgrantee_id,
    reporting_rail: project.reporting_rail,
    source_field: field.source_field,
    source_schema_id: field.source_schema_id,
    privacy_class: field.privacy_class,
    join_role: field.join_role,
    compatibility_state: `blocked_${field.primary_rejection_reason}`,
    target_field: project.reporting_rail === "LEO" ? field.leo_target_field : field.terrestrial_target_field,
    migration_allowed: false,
    accepted_value: null,
    operating_outcome: null,
  })),
);
const requirementNames = [
  "reporting_period",
  "source_schema",
  "source_authority",
  "field_definition_version",
  "privacy_review_complete",
  "state_disposition",
  "completed_public_record",
];
const montanaRequirementChecks = montana57j.project_envelope_tests.flatMap((project) =>
  requirementNames.map((requirement) => ({
    check_id: `${project.project_id}|${requirement}`,
    project_id: project.project_id,
    reporting_rail: project.reporting_rail,
    requirement,
    state: "unmet",
    source_value: null,
    accepted_observation: null,
  })),
);
const montanaRail = {
  phase: "57K",
  captured_date: capturedDate,
  rail_type: "Project-by-field compatibility matrix and envelope requirement panel",
  project_count: montana57j.project_envelope_test_count,
  field_count: montana57j.migration_test_count,
  compatibility_cell_count: montanaCompatibilityCells.length,
  compatibility_state_counts: countBy(montanaCompatibilityCells, "compatibility_state"),
  compatible_cells: 0,
  blocked_cells: montanaCompatibilityCells.length,
  terrestrial_projects: montana57j.reporting_rail_counts.terrestrial,
  leo_projects: montana57j.reporting_rail_counts.LEO,
  envelope_requirement_count: requirementNames.length,
  envelope_requirement_check_count: montanaRequirementChecks.length,
  envelope_requirements_met: 0,
  completed_project_quarters_ingested: 0,
  individual_bsl_identifiers_published: 0,
  individual_cai_details_published: 0,
  automatic_cross_rail_migrations: 0,
  review_rule: "Every project-field cell inherits its exact official source schema, rail, privacy class, and migration blocker. Longitudinal completeness cannot populate a missing target schema, code dictionary, accepted quarter, or privacy-safe observation.",
  compatibility_matrix: montanaCompatibilityCells,
  project_envelope_requirement_checks: montanaRequirementChecks,
};
await writeJson(join(dataRoot, "phase-57k-montana-project-field-compatibility-matrix.json"), montanaRail);

const hanfordApplicabilityCells = hanford57j.normalized_observation_reviews.flatMap((observation) =>
  hanford57j.transition_evidence_reviews.map((transition) => {
    const applicabilityState = observation.stage_id === transition.from_stage_id
      ? "from_stage_candidate_requires_identity_and_custody"
      : observation.stage_id === transition.to_stage_id
        ? "to_stage_candidate_requires_identity_and_custody"
        : "stage_not_applicable";
    return {
      cell_id: `${observation.observation_id}|${transition.transition_id}`,
      observation_id: observation.observation_id,
      observation_stage_id: observation.stage_id,
      transition_id: transition.transition_id,
      from_stage_id: transition.from_stage_id,
      to_stage_id: transition.to_stage_id,
      applicability_state: applicabilityState,
      join_eligible: false,
      accepted_custody_link: false,
      operating_outcome: null,
    };
  }),
);
const hanfordRequirementChecks = hanford57j.transition_evidence_reviews.flatMap((transition) =>
  transition.rejection_reason_codes.map((reason) => ({
    check_id: `${transition.transition_id}|${reason}`,
    transition_id: transition.transition_id,
    requirement: reason.replace(/^missing_/, ""),
    state: "unmet",
    evidence_value: null,
    custody_transfer_accepted: false,
  })),
);
const hanfordRail = {
  phase: "57K",
  captured_date: capturedDate,
  rail_type: "Observation-by-transition applicability matrix and transition-requirement panel",
  observation_count: hanford57j.standalone_observation_review_count,
  transition_count: hanford57j.transition_review_count,
  applicability_cell_count: hanfordApplicabilityCells.length,
  applicability_state_counts: countBy(hanfordApplicabilityCells, "applicability_state"),
  transition_requirement_types: 5,
  transition_requirement_check_count: hanfordRequirementChecks.length,
  transition_requirements_met: 0,
  accepted_observation_transition_joins: 0,
  public_batch_ids: 0,
  public_container_ids: 0,
  accepted_custody_transfers: 0,
  complete_material_balances: 0,
  review_rule: "Stage adjacency only identifies a candidate applicability cell. A cell remains non-joinable until stable identity, dated transfer and receipt, compatible measure and unit, method, quality, acceptance, disposition, and custody evidence align.",
  observation_transition_applicability_matrix: hanfordApplicabilityCells,
  transition_requirement_checks: hanfordRequirementChecks,
};
await writeJson(join(dataRoot, "phase-57k-hanford-observation-transition-applicability-matrix.json"), hanfordRail);

const versionOrder = ["FY2026-CJ", "FY2027-CJ", "GAO-26-107625", "GAO-23-104661-REC1"];
const nnsaDimensions = nnsa57j.classification_dimensions;
const nnsaRowsByObject = new Map();
for (const row of nnsa57j.object_version_classification_queue) {
  const rows = nnsaRowsByObject.get(row.registry_id) ?? [];
  rows.push(row);
  nnsaRowsByObject.set(row.registry_id, rows);
}
const nnsaObjectTransitions = [];
const nnsaDimensionCells = [];
for (const [registryId, rows] of nnsaRowsByObject) {
  const byVersion = new Map(rows.map((row) => [row.source_version_id, row]));
  for (let index = 0; index < versionOrder.length - 1; index += 1) {
    const from = byVersion.get(versionOrder[index]);
    const to = byVersion.get(versionOrder[index + 1]);
    const transitionId = `${registryId}|${versionOrder[index]}|${versionOrder[index + 1]}`;
    const authorityChanged = from.authority !== to.authority;
    const transition = {
      transition_id: transitionId,
      registry_id: registryId,
      object_type: from.object_type,
      from_source_version_id: from.source_version_id,
      to_source_version_id: to.source_version_id,
      from_authority: from.authority,
      to_authority: to.authority,
      authority_boundary_state: authorityChanged ? "authority_changed_keep_separate" : "same_authority_bounded_comparison",
      dimension_count: nnsaDimensions.length,
      promoted_operating_outcome: null,
      implementation_change: false,
      closure_change: false,
    };
    nnsaObjectTransitions.push(transition);
    for (const dimension of nnsaDimensions) {
      const fromState = from.dimension_states[dimension];
      const toState = to.dimension_states[dimension];
      const classification = authorityChanged
        ? "authority_boundary_change_requires_review"
        : fromState === toState
          ? "bounded_dimension_state_unchanged"
          : fromState.includes("not_classified") || toState.includes("not_classified")
            ? "source_scope_change_requires_review"
            : "bounded_dimension_state_change_requires_exact_extraction";
      nnsaDimensionCells.push({
        cell_id: `${transitionId}|${dimension}`,
        transition_id: transitionId,
        registry_id: registryId,
        dimension,
        from_state: fromState,
        to_state: toState,
        transition_classification: classification,
        operating_outcome: null,
        implementation_change: false,
        closure_change: false,
      });
    }
  }
}
const nnsaRail = {
  phase: "57K",
  captured_date: capturedDate,
  rail_type: "Object-by-adjacent-version transition matrix",
  object_count: nnsa57j.object_count,
  source_version_count: nnsa57j.source_version_count,
  adjacent_source_transition_count: versionOrder.length - 1,
  object_transition_count: nnsaObjectTransitions.length,
  classification_dimension_count: nnsaDimensions.length,
  transition_dimension_cell_count: nnsaDimensionCells.length,
  transition_classification_counts: countBy(nnsaDimensionCells, "transition_classification"),
  authority_boundary_transition_count: nnsaObjectTransitions.filter((row) => row.authority_boundary_state === "authority_changed_keep_separate").length,
  bounded_diff_events_retained: nnsa57j.bounded_diff_review_count,
  operating_outcomes_ingested: 0,
  implementation_changes: 0,
  capability_promotions: 0,
  closure_changes: 0,
  review_rule: "Every adjacent source-version pair receives twelve explicit dimension classifications. A changed classification identifies a review need, not a cost, schedule, capacity, qualification, output, completion, capability, implementation, or closure event.",
  source_version_order: versionOrder,
  classification_dimensions: nnsaDimensions,
  object_transitions: nnsaObjectTransitions,
  transition_dimension_matrix: nnsaDimensionCells,
  retained_bounded_diff_queue: nnsa57j.bounded_diff_review_queue,
};
await writeJson(join(dataRoot, "phase-57k-nnsa-object-transition-dimension-matrix.json"), nnsaRail);

const contractDefinitions = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-09": { id: "REOPEN-AMTRAK-PIDS", rail: "Amtrak", trigger: "A code-bearing official current asset register supplies station, asset, reporting-period, closeout, and acceptance state.", fields: ["official_station_code", "asset_id", "reporting_period", "closeout_state", "acceptance_authority"] },
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-08": { id: "REOPEN-AMTRAK-RELIABILITY", rail: "Amtrak", trigger: "A named-asset-period record supplies a defined reliability measure with numerator, denominator, period, and authority.", fields: ["official_station_code", "asset_id", "measure_definition", "numerator", "denominator", "reporting_period", "source_authority"] },
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-09": { id: "REOPEN-LA-NEXTLINK-ADOPTION", rail: "Broadband", trigger: "A privacy-safe official completed-period table reports the 104-location cohort through a defined adoption measure.", fields: ["award_id", "cohort_denominator", "active_subscriber_measure", "reporting_period", "privacy_review", "state_disposition"] },
  "LA-BEAD-STARLINK-HOLD-2026-09": { id: "REOPEN-LA-STARLINK-ADOPTION", rail: "Broadband", trigger: "A privacy-safe official completed-period table reports the 10,635-location LEO cohort through a defined adoption measure.", fields: ["award_id", "cohort_denominator", "active_subscriber_measure", "reporting_period", "privacy_review", "state_disposition"] },
  "MT-BEAD-QUARTERLY-HOLD-2026-09": { id: "REOPEN-MT-BEAD-QUARTER", rail: "Broadband", trigger: "A completed public project-quarter table clears schema, definition, privacy, authority, and state-disposition checks.", fields: ["project_id", "reporting_rail", "reporting_period", "source_schema_id", "field_definition_version", "privacy_review", "state_disposition"] },
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-06": { id: "REOPEN-HANFORD-MASS-BALANCE", rail: "Hanford", trigger: "Source-explicit records establish stable batch and container identity, compatible measures and units, dated transfers, method, quality, acceptance, disposition, and every stage balance.", fields: ["stable_batch_id", "stable_container_id", "from_stage", "to_stage", "transfer_date", "receipt_date", "measure", "unit", "method", "quality_state", "acceptance_state", "disposition_state"] },
  "NNSA-PIT-RATE-HOLD-2026-09": { id: "REOPEN-NNSA-QUALIFIED-RATE", rail: "NNSA", trigger: "An official site-period record reports recurring qualified and accepted output with a defined denominator.", fields: ["site_id", "reporting_period", "qualified_units", "accepted_units", "rate_denominator", "acceptance_authority"] },
  "NNSA-PIT-PEIS-HOLD-2026-09": { id: "REOPEN-NNSA-ACCEPTED-CAPACITY", rail: "NNSA", trigger: "Official site-specific installed, qualified, and accepted operating capacity is reported for a defined period.", fields: ["site_id", "reporting_period", "installed_capacity", "qualified_capacity", "accepted_capacity", "acceptance_authority"] },
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-10": { id: "REOPEN-NNSA-GAO-BASELINE", rail: "NNSA", trigger: "GAO reports the exact enterprise-baseline recommendation Closed after reviewing responsive agency evidence.", fields: ["recommendation_id", "agency_evidence_date", "agency_evidence_scope", "gao_status", "gao_status_date"] },
};
const nextHoldKeys = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-09": "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-10",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-08": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-09",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-09": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-10",
  "LA-BEAD-STARLINK-HOLD-2026-09": "LA-BEAD-STARLINK-HOLD-2026-10",
  "MT-BEAD-QUARTERLY-HOLD-2026-09": "MT-BEAD-QUARTERLY-HOLD-2026-10",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-06": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-07",
  "NNSA-PIT-RATE-HOLD-2026-09": "NNSA-PIT-RATE-HOLD-2026-10",
  "NNSA-PIT-PEIS-HOLD-2026-09": "NNSA-PIT-PEIS-HOLD-2026-10",
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-10": "NNSA-PIT-GAO-BASELINE-HOLD-2026-11",
};
const priorHolds = phase57j.records.filter((record) => record.record_status === "In Review");
const reopeningContracts = priorHolds.map((hold) => {
  const definition = contractDefinitions[hold.action_key];
  if (!definition) throw new Error(`Missing reopening contract for ${hold.action_key}`);
  return {
    contract_id: definition.id,
    parent_hold_key: hold.action_key,
    phase57k_hold_key: nextHoldKeys[hold.action_key],
    evidence_rail: definition.rail,
    reopening_trigger: definition.trigger,
    required_fields: definition.fields,
    required_field_count: definition.fields.length,
    required_authority_state: "official_source_and_named_acceptance_or_independent_closure_authority_as_applicable",
    denominator_guard: "The source must preserve the named cohort, asset, project, batch, container, site, object, period, measure, unit, and authority boundaries.",
    trigger_state: "not_fired",
    evidence_received: false,
    automated_publication_allowed: false,
    publication_state: "remains_in_review",
  };
});
const reopeningRegistry = {
  phase: "57K",
  captured_date: capturedDate,
  registry_type: "Machine-readable reopening-trigger contracts",
  contract_count: reopeningContracts.length,
  contracts_triggered: 0,
  contracts_not_triggered: reopeningContracts.length,
  automated_publication_contracts: 0,
  review_rule: "A contract defines the exact evidence required to reopen a hold. Defining, evaluating, or scheduling a trigger is not evidence that the trigger fired; publication always requires human review.",
  contracts: reopeningContracts,
};
await writeJson(join(dataRoot, "phase-57k-reopening-trigger-registry.json"), reopeningRegistry);

const sourcesForStage = (stage) => [...new Set(phase57j.records.filter((record) => record.evidence_stage === stage).flatMap((record) => record.supporting_source_ids))];
const amtrakSourceIds = sourcesForStage("Historical identity backfill");
const montanaSourceIds = sourcesForStage("Migration and envelope rejection taxonomy");
const hanfordSourceIds = sourcesForStage("Observation and transition rejection taxonomy");
const nnsaSourceIds = sourcesForStage("Object-version classification queue");

const specs = [
  { slug: "amtrak-356-snapshot-presence-cells", agency: "DOT", actionKey: "AMTRAK-LONGITUDINAL-PRESENCE-MATRIX-2026-01", stage: "Identity-snapshot longitudinal matrix", sourceIds: amtrakSourceIds, title: "Amtrak's longitudinal matrix contains 356 identity-snapshot presence cells", finding: "All 178 historical identities receive one bounded state in each of two retained source snapshots, producing 356 explicit cells.", denominator: "178 identities by two source snapshots: 356 cells.", limits: ["Snapshot presence is not current physical presence.", "Cohort nonobservation is not deletion.", "Operating outcomes remain null."], next: "Append later code-bearing snapshots only through the same identity and effective-period contract.", registry: "phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json" },
  { slug: "amtrak-178-longitudinal-transition-classifications", agency: "DOT", actionKey: "AMTRAK-LONGITUDINAL-TRANSITIONS-2026-01", stage: "Identity-snapshot longitudinal matrix", sourceIds: amtrakSourceIds, title: "Amtrak classifies 178 longitudinal source transitions without asserting asset changes", finding: "Eleven rows move from historical presence to a bounded current cohort observation; 167 move to current nonobservation with no deletion inference.", denominator: "178 transition rows: eleven bounded observations and 167 nonobservations.", limits: ["A classified row is not evidence of a structural transition.", "Nonobservation is not removal or failure.", "No reliability measure is inferred."], next: "Reclassify only when a later official snapshot supplies stable identity and effective period.", registry: "phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json" },
  { slug: "amtrak-16-name-lineage-rows-retained", agency: "DOT", actionKey: "AMTRAK-NAME-LINEAGE-PANEL-2026-01", stage: "Identity-snapshot longitudinal matrix", sourceIds: amtrakSourceIds, title: "The sixteen-name Amtrak lineage panel retains ten exact, one alias, and five unresolved rows", finding: "The current-name queue remains ten exact links, one controlled alias, and five unresolved identities; the longitudinal matrix changes none of those decisions.", denominator: "Sixteen names across one retained review queue.", limits: ["A controlled alias is not an official rename.", "Unresolved rows remain visible.", "No station code is guessed."], next: "Use the Amtrak identity reopening contract for any code-bearing official resolution.", registry: "phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json" },
  { slug: "amtrak-five-unresolved-identities-linked-to-trigger", agency: "DOT", actionKey: "AMTRAK-UNRESOLVED-TRIGGER-LINKS-2026-01", stage: "Identity-snapshot longitudinal matrix", sourceIds: amtrakSourceIds, title: "Five unresolved Amtrak identities are linked to an explicit reopening trigger", finding: "Each unresolved identity remains rejected until an official station code or authoritative crosswalk satisfies the named trigger contract.", denominator: "Five unresolved current-name rows and one code-bearing identity trigger.", limits: ["A trigger definition is not evidence that it fired.", "Search results do not replace official identity evidence.", "No automatic publication is allowed."], next: "Review a future code-bearing official registry against the five rows.", registry: "phase-57k-reopening-trigger-registry.json" },
  { slug: "amtrak-zero-structural-or-outcome-transitions", agency: "DOT", actionKey: "AMTRAK-LONGITUDINAL-ZERO-PROMOTIONS-2026-01", stage: "Identity-snapshot longitudinal matrix", sourceIds: amtrakSourceIds, title: "Amtrak's longitudinal panel promotes zero structural changes or operating outcomes", finding: "No matrix cell or transition row establishes an addition, removal, rename, replacement, closeout, reliability result, or service outcome.", denominator: "356 cells and 178 transition rows; zero structural or outcome promotions.", limits: ["Matrix completeness is not outcome completeness.", "Historical-to-current comparison is bounded to source state.", "Closeout and reliability holds remain In Review."], next: "Keep both Amtrak holds closed until their exact contracts are satisfied.", registry: "phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json" },

  { slug: "montana-416-project-field-compatibility-cells", agency: "NTIA", actionKey: "MT-PROJECT-FIELD-MATRIX-2026-01", stage: "Project-field compatibility matrix", sourceIds: montanaSourceIds, title: "Montana's project-field matrix contains 416 explicit compatibility cells", finding: "Thirty-two projects are evaluated across thirteen official source fields, producing 416 bounded project-field cells.", denominator: "Thirty-two projects by thirteen fields: 416 cells.", limits: ["A matrix cell is not a reported project-quarter value.", "Source and target schemas remain distinct.", "Privacy boundaries remain attached."], next: "Append a completed public quarter only through the same project, rail, schema, and definition keys.", registry: "phase-57k-montana-project-field-compatibility-matrix.json" },
  { slug: "montana-352-schema-32-dictionary-32-quarter-blockers", agency: "NTIA", actionKey: "MT-COMPATIBILITY-BLOCKER-DISTRIBUTION-2026-01", stage: "Project-field compatibility matrix", sourceIds: montanaSourceIds, title: "Montana's 416 cells retain 352 schema, 32 dictionary, and 32 completed-quarter blockers", finding: "Eleven fields across thirty-two projects lack a compatible target schema; one field lacks a code dictionary and one lacks a validated completed project quarter.", denominator: "416 blocked cells: 352 schema, 32 dictionary, and 32 completed-quarter blockers.", limits: ["A blocker count is not a project-performance result.", "Missing does not mean withheld or never submitted.", "No value is coerced across schemas."], next: "Re-evaluate individual cells only against compatible official definitions and completed records.", registry: "phase-57k-montana-project-field-compatibility-matrix.json" },
  { slug: "montana-224-envelope-requirement-checks-unmet", agency: "NTIA", actionKey: "MT-ENVELOPE-REQUIREMENT-PANEL-2026-01", stage: "Project-field compatibility matrix", sourceIds: montanaSourceIds, title: "All 224 Montana envelope-requirement checks remain explicitly unmet", finding: "Seven requirements are evaluated for each of thirty-two projects; none clears without a completed privacy-safe official project-quarter record.", denominator: "Thirty-two projects by seven requirements: 224 checks.", limits: ["An unmet requirement is not a failed project.", "State disposition remains required.", "No completed quarter is inferred."], next: "Use the Montana quarterly reopening contract when a completed official table appears.", registry: "phase-57k-montana-project-field-compatibility-matrix.json" },
  { slug: "montana-30-terrestrial-two-leo-boundaries-retained", agency: "NTIA", actionKey: "MT-REPORTING-RAIL-LONGITUDINAL-BOUNDARY-2026-01", stage: "Project-field compatibility matrix", sourceIds: montanaSourceIds, title: "Montana retains thirty terrestrial and two LEO project rails without cross-rail migration", finding: "All 416 cells preserve their project's terrestrial or LEO reporting rail and associated privacy and definition boundaries.", denominator: "Thirty terrestrial projects, two LEO projects, and zero cross-rail migrations.", limits: ["Rail membership is not a performance comparison.", "Individual BSL, subscriber, and CAI details remain excluded.", "LEO and terrestrial definitions are not interchangeable."], next: "Keep rail-specific definitions and denominators in every later quarter.", registry: "phase-57k-montana-project-field-compatibility-matrix.json" },
  { slug: "montana-zero-compatible-cells-or-completed-quarters", agency: "NTIA", actionKey: "MT-COMPATIBILITY-ZERO-PROMOTIONS-2026-01", stage: "Project-field compatibility matrix", sourceIds: montanaSourceIds, title: "Montana promotes zero compatible cells or completed project-quarter outcomes", finding: "All 416 cells remain blocked and all 224 envelope checks remain unmet; no project-quarter observation publishes.", denominator: "416 compatibility cells and 224 envelope checks; zero accepted observations.", limits: ["Longitudinal structure cannot fill absent records.", "Zero accepted observations is not zero deployment progress.", "Adoption holds remain In Review."], next: "Wait for source-explicit completed quarters that satisfy the reopening contracts.", registry: "phase-57k-montana-project-field-compatibility-matrix.json" },

  { slug: "hanford-126-observation-transition-applicability-cells", agency: "DOE", actionKey: "HANFORD-OBSERVATION-TRANSITION-MATRIX-2026-01", stage: "Observation-transition applicability matrix", sourceIds: hanfordSourceIds, title: "Hanford's matrix classifies 126 observation-to-transition applicability cells", finding: "Nine bounded observations are evaluated against fourteen lifecycle transitions, producing 126 explicit applicability cells.", denominator: "Nine observations by fourteen transitions: 126 cells.", limits: ["Stage applicability is not evidence of transfer.", "A candidate cell remains non-joinable.", "Operating outcomes remain null."], next: "Append identity and custody evidence only at the exact observation-transition cell.", registry: "phase-57k-hanford-observation-transition-applicability-matrix.json" },
  { slug: "hanford-stage-candidate-and-not-applicable-states", agency: "DOE", actionKey: "HANFORD-APPLICABILITY-STATE-DISTRIBUTION-2026-01", stage: "Observation-transition applicability matrix", sourceIds: hanfordSourceIds, title: "Hanford separates stage candidates from non-applicable observation-transition pairs", finding: "Each cell records whether an observation matches a transition's from-stage, to-stage, or neither while keeping every join ineligible.", denominator: "126 classified cells across three applicability states.", limits: ["Stage adjacency is not batch identity.", "From-stage and to-stage candidates are not custody links.", "Non-applicable does not invalidate the observation."], next: "Review only candidate cells when stable public identity and custody records become available.", registry: "phase-57k-hanford-observation-transition-applicability-matrix.json" },
  { slug: "hanford-70-transition-requirement-checks-unmet", agency: "DOE", actionKey: "HANFORD-TRANSITION-REQUIREMENT-PANEL-2026-01", stage: "Observation-transition applicability matrix", sourceIds: hanfordSourceIds, title: "All seventy Hanford transition-requirement checks remain unmet", finding: "Fourteen transitions are evaluated against five evidence requirements; none establishes stable identity, dated transfer, compatible method and units, or quality and acceptance state.", denominator: "Fourteen transitions by five requirements: seventy checks.", limits: ["An unmet check is not evidence that a transfer failed.", "Missing public identity remains null.", "All failed checks stay visible."], next: "Use the mass-balance reopening contract to evaluate a complete future evidence chain.", registry: "phase-57k-hanford-observation-transition-applicability-matrix.json" },
  { slug: "hanford-zero-custody-links-after-applicability-review", agency: "DOE", actionKey: "HANFORD-CUSTODY-ZERO-PROMOTIONS-2026-01", stage: "Observation-transition applicability matrix", sourceIds: hanfordSourceIds, title: "Hanford accepts zero custody links after the complete applicability review", finding: "No observation-transition cell clears the identity, transfer, receipt, method, quality, acceptance, and disposition contract.", denominator: "126 applicability cells; zero accepted custody links.", limits: ["Cumulative observations cannot be assigned to synthetic batches.", "Container counts do not create container lineage.", "No custody event is inferred."], next: "Keep every cell non-joinable until all contract fields align.", registry: "phase-57k-hanford-observation-transition-applicability-matrix.json" },
  { slug: "hanford-zero-complete-material-balances", agency: "DOE", actionKey: "HANFORD-MATERIAL-BALANCE-ZERO-PROMOTIONS-2026-01", stage: "Observation-transition applicability matrix", sourceIds: hanfordSourceIds, title: "Hanford's longitudinal panel produces zero complete material balances", finding: "The complete matrix and requirement panel improve auditability but do not reconcile material across every lifecycle stage.", denominator: "Nine observations, fourteen transitions, 126 cells, seventy checks, and zero complete balances.", limits: ["Matrix completeness is not mass-balance completeness.", "Measures and units remain source-bound.", "The mass-balance hold remains In Review."], next: "Reopen only with the complete stable-identity and custody evidence chain.", registry: "phase-57k-hanford-observation-transition-applicability-matrix.json" },

  { slug: "nnsa-54-object-adjacent-version-transitions", agency: "DOE", actionKey: "NNSA-OBJECT-TRANSITION-MATRIX-2026-01", stage: "Object-version transition matrix", sourceIds: nnsaSourceIds, title: "NNSA's longitudinal matrix contains 54 object-by-adjacent-version transitions", finding: "Eighteen work-breakdown objects are evaluated across three adjacent formal source-version transitions, producing fifty-four bounded transition rows.", denominator: "Eighteen objects by three adjacent transitions: fifty-four rows.", limits: ["A transition row is not an operating event.", "Source scope remains object-specific.", "Agency and independent authorities remain separate."], next: "Append later formal source versions in authority-preserving order.", registry: "phase-57k-nnsa-object-transition-dimension-matrix.json" },
  { slug: "nnsa-648-transition-dimension-classifications", agency: "DOE", actionKey: "NNSA-TRANSITION-DIMENSION-MATRIX-2026-01", stage: "Object-version transition matrix", sourceIds: nnsaSourceIds, title: "NNSA classifies 648 transition-dimension cells", finding: "Each of fifty-four object transitions receives twelve explicit dimension states covering presence through independent closure.", denominator: "Fifty-four transitions by twelve dimensions: 648 cells.", limits: ["Classification is not measurement.", "Changed source state requires exact extraction.", "No capacity or output result is inferred."], next: "Map later bounded diffs to the exact object, transition, and dimension cell.", registry: "phase-57k-nnsa-object-transition-dimension-matrix.json" },
  { slug: "nnsa-authority-boundaries-retained-across-transitions", agency: "DOE", actionKey: "NNSA-AUTHORITY-BOUNDARY-TRANSITIONS-2026-01", stage: "Object-version transition matrix", sourceIds: nnsaSourceIds, title: "NNSA transition rows preserve agency and independent authority boundaries", finding: "Transitions into GAO source versions are classified as authority changes requiring review rather than substitutions for NNSA object state.", denominator: "Fifty-four object transitions with explicit from- and to-authority fields.", limits: ["GAO assessment does not become an agency assertion.", "Agency budget language does not establish independent closure.", "Authority change is not outcome change."], next: "Keep every independent assessment and recommendation status as a separate evidence layer.", registry: "phase-57k-nnsa-object-transition-dimension-matrix.json" },
  { slug: "nnsa-ten-bounded-diffs-retained-in-transition-panel", agency: "DOE", actionKey: "NNSA-BOUNDED-DIFF-LONGITUDINAL-LINKS-2026-01", stage: "Object-version transition matrix", sourceIds: nnsaSourceIds, title: "Ten bounded NNSA source diffs remain linked to the longitudinal panel", finding: "All ten prior bounded diffs remain visible beside the 648 dimension cells without becoming generalized project or enterprise outcomes.", denominator: "Ten retained bounded diffs and 648 transition-dimension cells.", limits: ["A bounded cost or scope observation remains object-specific.", "A first unit is not recurring output.", "A plan is not accepted capacity."], next: "Attach future diffs only after exact object, version, scope, and authority review.", registry: "phase-57k-nnsa-object-transition-dimension-matrix.json" },
  { slug: "nnsa-zero-outcome-capability-implementation-closure-transitions", agency: "DOE", actionKey: "NNSA-TRANSITION-ZERO-PROMOTIONS-2026-01", stage: "Object-version transition matrix", sourceIds: nnsaSourceIds, title: "NNSA promotes zero outcome, capability, implementation, or closure transitions", finding: "No object transition or dimension classification establishes recurring output, final capacity, completed capability, implementation, or independent closure.", denominator: "Fifty-four transitions and 648 dimension cells; zero promotions.", limits: ["A source-version change is not an operating-state change.", "Completion and capability remain distinct.", "All three NNSA holds remain In Review."], next: "Evaluate the three NNSA reopening contracts only against exact official and independent evidence.", registry: "phase-57k-nnsa-object-transition-dimension-matrix.json" },
];

const heldSpecs = priorHolds.map((hold) => {
  const contract = reopeningContracts.find((item) => item.parent_hold_key === hold.action_key);
  return {
    slug: `preserved-${contract.contract_id.toLowerCase()}`,
    agency: hold.agency,
    actionKey: contract.phase57k_hold_key,
    parentHoldKey: hold.action_key,
    reopeningContractId: contract.contract_id,
    stage: "Reopening-trigger contract hold",
    sourceIds: hold.supporting_source_ids,
    title: hold.title.replace(/^([^:]+):/, "$1 reopening-contract hold:"),
    finding: `The ${contract.contract_id} contract is defined and evaluated as not fired; the inherited operating-outcome hold remains In Review.`,
    denominator: `One inherited hold, one reopening contract, ${contract.required_field_count} required evidence fields, and zero trigger events.`,
    limits: ["A trigger definition is not evidence that it fired.", "No required missing value is inferred.", "Human publication review remains mandatory."],
    next: contract.reopening_trigger,
    registry: "phase-57k-reopening-trigger-registry.json",
  };
});
const allSpecs = [...specs, ...heldSpecs];
if (specs.length !== 20 || heldSpecs.length !== 9 || allSpecs.length !== 29) throw new Error("Phase 57K specification count mismatch.");

const sourceById = new Map();
for (const id of [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const records = allSpecs.map((spec, index) => ({
  record_id: `record-57k-${spec.slug}`,
  document_id: `research-doc-57k-${spec.slug}`,
  signal_id: `signal-57k-${spec.slug}`,
  document_number: 844 + index,
  record_status: index < 20 ? "Published" : "In Review",
  agency: spec.agency,
  action_key: spec.actionKey,
  parent_hold_key: spec.parentHoldKey ?? null,
  reopening_contract_id: spec.reopeningContractId ?? null,
  evidence_stage: spec.stage,
  title: spec.title,
  finding: spec.finding,
  denominator: spec.denominator,
  evidence_limits: spec.limits,
  next_action: spec.next,
  structured_registry_file: spec.registry,
  source_id: spec.sourceIds[0],
  supporting_source_ids: [...new Set(spec.sourceIds)],
  official_url: sourceById.get(spec.sourceIds[0])?.url,
  publication_date: capturedDate,
  document_type: index < 20 ? "Data Release" : "Technical Report",
  authority_boundary: authorityBoundary,
}));
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSourceIds = [...new Set(records.flatMap((record) => record.supporting_source_ids))];
const evidenceStageCounts = countBy(records, "evidence_stage");
const priorHoldKeys = priorHolds.map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57k-cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry.json"), {
  phase: "57K",
  captured_date: capturedDate,
  goal: "Turn the complete Phase 57J decisions into bounded longitudinal transition records and explicit reopening contracts without treating a classified transition or defined trigger as evidence that an operating event occurred.",
  publication_rule: "Publish only reviewed transition controls and longitudinal panels; preserve all nine holds until their machine-readable contracts receive complete qualifying evidence and human review.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: evidenceStageCounts,
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57k-amtrak-identity-snapshot-longitudinal-matrix.json", identities: 178, snapshots: 2, cells: 356, transitions: 178 },
    { file: "phase-57k-montana-project-field-compatibility-matrix.json", projects: 32, fields: 13, cells: 416, requirement_checks: 224 },
    { file: "phase-57k-hanford-observation-transition-applicability-matrix.json", observations: 9, transitions: 14, cells: 126, requirement_checks: 70 },
    { file: "phase-57k-nnsa-object-transition-dimension-matrix.json", objects: 18, adjacent_transitions: 3, object_transitions: 54, dimensions: 12, cells: 648 },
    { file: "phase-57k-reopening-trigger-registry.json", contracts: 9, triggered: 0 },
  ],
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57j.post_batch_visible_scope,
  post_batch_visible_scope: phase57j.post_batch_visible_scope,
  post_batch_closure_counts: phase57j.post_batch_closure_counts,
  preserved_phase57j_holds: priorHoldKeys,
  reopening_contract_ids: reopeningContracts.map((contract) => contract.contract_id),
  new_visible_holds: [],
  records,
});
await writeJson(join(dataRoot, "phase-57k-publication-review.json"), {
  phase: "57K",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  exact_target_artifacts_acquired: 0,
  decision: "Twenty bounded transition and longitudinal controls publish. Nine inherited holds receive machine-readable reopening contracts and remain In Review; no contract fired and no new hold, contact, scope change, implementation change, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 843).padStart(2, "0")}-${record.record_id.replace(/^record-57k-/, "")}.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57k-${record.record_id.replace(/^record-57k-/, "")}.json`), {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status,
    publisher: firstSource?.owner ?? "U.S. public-sector authority",
    publication_date: record.publication_date,
    document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published"
      ? "The record turns complete Phase 57J decisions into explicit longitudinal controls without manufacturing an operating transition."
      : "The machine-readable contract makes the hold actionable while preventing a defined or partially matched trigger from being mistaken for a fired trigger.",
    ftfn_relevance: ["Adds denominator-aware longitudinal structure to the Phase 57J rails.", "Makes transition and reopening decisions machine-readable and auditable.", "Separates classified change, missing evidence, operating outcomes, implementation, capability, acceptance, and closure."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: sourceUrls,
    official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });
  const signal = [
    "---",
    `id: ${JSON.stringify(record.signal_id)}`,
    `title: ${JSON.stringify(record.title)}`,
    `slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}`,
    `record_status: ${JSON.stringify(record.record_status)}`,
    `summary: ${JSON.stringify(record.finding)}`,
    yamlList("source_ids", record.supporting_source_ids),
    `published_date: ${capturedDate}`,
    `captured_date: ${capturedDate}`,
    `primary_topic: ${JSON.stringify(meta.topics[0])}`,
    yamlList("framework_layers", meta.layers),
    "signal_type: \"Research Result\"",
    "maturity_level: \"Infrastructure\"",
    "time_horizon: \"Now\"",
    "evidence_quality: \"Official Data\"",
    "verification_status: \"Verified Against Primary Source\"",
    `why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}`,
    yamlList("dependencies", ["stable identity, source-version, period, and authority lineage", "explicit transition classifications and reopening requirements", "separate operating-outcome, implementation, capability, acceptance, and closure evidence"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57K cross-version transition matrices and reopening-trigger registry"]),
    yamlList("local_implications", ["Do not promote a classified transition or defined reopening trigger into an operating event."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57K longitudinal-transition control contract." : `Held under reopening contract ${record.reopening_contract_id}; trigger not fired.`)}`,
    "---",
    "",
    "## Phase 57K longitudinal panel",
    "",
    record.finding,
    "",
    "## Evidence stage and denominator",
    "",
    `**${record.evidence_stage}.** ${record.denominator}`,
    "",
    ...(record.structured_registry_file ? [`Structured rail: ${record.structured_registry_file}.`, ""] : []),
    ...(record.reopening_contract_id ? [`Reopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.`, ""] : []),
    "## Evidence boundaries",
    "",
    ...record.evidence_limits.map((limit) => `- ${limit}`),
    "",
    "Exact target artifact acquired: **No**. Trigger events recorded: **Zero**. FTFN submitted no agency contact or FOIA request.",
    "",
    `Next action: ${record.next_action}`,
    "",
    "## Authority boundary",
    "",
    record.authority_boundary,
    "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Cross-Version Transition Matrices, Longitudinal Panels, and Reopening-Trigger Registry, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57K publishes twenty bounded longitudinal and transition controls across Amtrak, Montana BEAD, Hanford DFLAW, and NNSA while attaching all nine inherited holds to machine-readable reopening contracts.",
  scope: "356 Amtrak identity-snapshot cells and 178 transition rows; 416 Montana project-field cells and 224 requirement checks; 126 Hanford applicability cells and seventy requirement checks; fifty-four NNSA object transitions and 648 dimension cells; plus nine not-fired reopening contracts.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "A transition classification is not evidence that a transition occurred, and a reopening contract is not evidence that its trigger fired. Missing official values stay null; identity, privacy, period, stage, method, unit, denominator, authority, acceptance, custody, implementation, capability, and closure remain distinct.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  `id: ${JSON.stringify(briefingId)}`,
  "title: \"Research Watch 041: Cross-Version Transition Matrices and Reopening Contracts\"",
  "slug: \"research-watch-041-cross-version-transition-matrices-longitudinal-panels\"",
  "record_status: \"Published\"",
  "summary: \"Phase 57K publishes four bounded longitudinal matrices, twenty control panels, and nine machine-readable reopening contracts while preserving every operating-outcome hold.\"",
  `published_date: ${capturedDate}`,
  `captured_date: ${capturedDate}`,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "Amtrak now has 356 identity-snapshot cells and 178 classified longitudinal rows with zero asserted structural changes.",
    "Montana now has 416 project-field cells and 224 explicit envelope checks, all blocked without a completed public project-quarter record.",
    "Hanford now has 126 observation-transition applicability cells and seventy unmet transition requirements with zero custody or material-balance joins.",
    "NNSA now has fifty-four object transitions and 648 dimension cells while all nine inherited holds are tied to not-fired reopening contracts.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["Later code-bearing Amtrak snapshots", "Privacy-safe completed broadband project quarters", "Hanford stable identity and custody chains", "NNSA exact site-period output, accepted capacity, and GAO closure evidence"]),
  "---",
  "",
  "## What Phase 57K adds",
  "",
  "Four complete longitudinal matrices now expose every bounded source transition, applicability state, requirement check, and reopening condition as auditable structured data.",
  "",
  "## What did not move",
  "",
  "No matrix row proves an operating event and no reopening contract fired. All nine inherited holds remain In Review, with no station change, completed broadband quarter, Hanford material balance, NNSA recurring output, accepted capacity, implementation, capability, or closure promotion.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57K records no trigger event, agency contact, FOIA request, directive-scope change, implementation change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-041-cross-version-transition-matrices-longitudinal-panels.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-03-phase-57k-cross-version-transition-matrices-longitudinal-panels.json"), {
  id: "update-2026-08-03-phase-57k-cross-version-transition-matrices-longitudinal-panels",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57K publishes twenty longitudinal-transition controls and nine reopening contracts",
  summary: "Thirty-six carried Tier 1 sources support four longitudinal matrices, twenty Published control panels, and nine preserved operating-outcome holds with explicit not-fired contracts.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-041-cross-version-transition-matrices-longitudinal-panels/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Transition classifications and reopening-trigger definitions remain separate from operating events, implementation, acceptance, capability, and closure.",
  work_package: "docs/work-packages/phase-57k-cross-version-transition-matrices-longitudinal-panels.md",
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
  ["finance-and-risk.json", allSourceIds, "Which Phase 57K reopening contract first receives every required official field without changing its denominator or authority?"],
  ["policy-and-standards.json", allSourceIds, "Which official source version first changes a Phase 57K transition cell or fires a reopening contract after human review?"],
  ["mobility.json", amtrakSourceIds, "Which later code-bearing Amtrak snapshot first changes one of the five unresolved identity states?"],
  ["chips-and-compute.json", broadbandSourceIds, "Which completed broadband project-quarter first clears all schema, privacy, definition, authority, and state-disposition checks?"],
  ["energy.json", energySourceIds, "Which Hanford or NNSA publication first supplies a complete identity, custody, output, accepted-capacity, or independent-closure evidence chain?"],
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
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57k-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57K cross-version transition matrices and reopening contracts");
    value.dependency_stack.push({
      stage: "Phase 57K cross-version transition matrices and reopening contracts",
      current_state: "Twenty Published transition controls, four longitudinal matrices, nine not-fired reopening contracts, and nine preserved operating-outcome holds.",
      boundary: "A classified transition or defined reopening trigger is not evidence that an operating event occurred or that the trigger fired.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57K prohibits deletion inference, schema coercion, privacy-detail exposure, cross-rail migration, synthetic custody or numeric joins, authority substitution, automatic trigger publication, rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Source-explicit records that satisfy a named Phase 57K reopening contract while preserving exact identity, cohort, denominator, definition, period, stage, method, unit, authority, privacy, acceptance, custody, object scope, and closure attribution."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57K classifies four complete longitudinal matrices and nine reopening contracts while preserving every operating-outcome hold.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57k-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57k-transition-matrices");
  value.links = value.links.filter((link) => link.from !== "node-phase57k-transition-matrices");
  value.nodes.push({ id: "node-phase57k-transition-matrices", label: "Four longitudinal matrices; twenty Published controls; nine reopening contracts; zero triggers", node_type: "Signal", note: "Transition and trigger classifications become machine-readable without manufacturing an operating event." });
  value.links.push(
    { from: "node-phase57k-transition-matrices", to: "node-phase57j-review-queue-execution", relationship: "Depends On", confidence: "Supported", note: "Phase 57K turns complete Phase 57J decisions into bounded longitudinal cells and contracts." },
    { from: "node-phase57k-transition-matrices", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Identity, schema, privacy, compatibility, custody, object-scope, period, and denominator boundaries remain explicit." },
    { from: "node-phase57k-transition-matrices", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "A classified transition or defined trigger does not establish an operating outcome or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Four Phase 57K longitudinal matrices, twenty Published transition controls, nine machine-readable reopening contracts, and nine preserved operating-outcome holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Source-explicit records that fully satisfy a named reopening contract without changing identity, denominator, object scope, authority, privacy, acceptance, capability, implementation, or closure attribution."]);
});

console.log(`Generated Phase 57K: ${published.length} Published controls, ${held.length} In Review holds, ${carriedSourceIds.length} carried Tier 1 sources, four longitudinal matrices, nine reopening contracts, and Research Watch 041.`);
