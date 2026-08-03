import "./generate-phase57i-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-03";
const collectionSlug = "historical-backfill-rejection-taxonomy-review-queue-execution-2026";
const collectionId = "research-collection-" + collectionSlug;
const briefingId = "briefing-research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution";
const json = (value) => JSON.stringify(value, null, 2) + "\n";
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

const phase57i = JSON.parse(await readFile(join(dataRoot, "phase-57i-versioned-registry-change-detection-bounded-observation-ingestion.json"), "utf8"));
const phase57h = JSON.parse(await readFile(join(dataRoot, "phase-57h-registry-revision-provenance-compatible-observation-joins.json"), "utf8"));
const amtrak57i = JSON.parse(await readFile(join(dataRoot, "phase-57i-amtrak-source-diff-queue.json"), "utf8"));
const montana57i = JSON.parse(await readFile(join(dataRoot, "phase-57i-montana-schema-migration-project-quarter-intake.json"), "utf8"));
const hanford57i = JSON.parse(await readFile(join(dataRoot, "phase-57i-hanford-bounded-observation-validator.json"), "utf8"));
const hanford57h = JSON.parse(await readFile(join(dataRoot, "phase-57h-hanford-authority-observation-compatibility-matrix.json"), "utf8"));
const nnsa57i = JSON.parse(await readFile(join(dataRoot, "phase-57i-nnsa-object-level-source-diff-ledger.json"), "utf8"));
if (phase57i.phase !== "57I" || phase57i.records.length !== 29) throw new Error("Phase 57J requires the complete Phase 57I release.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const currentByHistoricalId = new Map(amtrak57i.current_name_diff_queue
  .filter((row) => row.historical_station_id)
  .map((row) => [row.historical_station_id, row]));
const amtrakHistoricalDecisions = amtrak57i.historical_identity_queue.map((row, index) => {
  const current = currentByHistoricalId.get(row.historical_station_id) ?? null;
  return {
    review_id: "AMTRAK-HISTORY-REVIEW-" + String(index + 1).padStart(3, "0"),
    historical_station_id: row.historical_station_id,
    historical_display_name: row.historical_display_name,
    historical_state: row.historical_state,
    historical_snapshot_presence: "present",
    current_bounded_cohort_observation: current ? "present" : "not_observed",
    current_queue_id: current?.queue_id ?? null,
    current_display_name: current?.current_display_name ?? null,
    identity_method: current?.match_method ?? null,
    review_disposition: current
      ? "accepted_historical_identity_with_bounded_current_observation"
      : "retained_historical_identity_without_current_deletion_inference",
    structural_change_decision: "not_asserted",
    operating_outcome: null,
  };
});
const amtrakCurrentReviewQueue = amtrak57i.current_name_diff_queue.map((row) => ({
  ...row,
  review_disposition: row.historical_station_id ? "accepted_identity_link" : "rejected_pending_official_identity_crosswalk",
  rejection_reason_codes: row.historical_station_id ? [] : ["missing_official_station_code", "missing_authoritative_crosswalk"],
  structural_change_decision: "not_asserted",
}));
const amtrakRail = {
  phase: "57J",
  captured_date: capturedDate,
  rail_type: "Historical source-snapshot backfill and identity review queue",
  source_snapshot_count: amtrak57i.source_snapshots.length,
  source_snapshot_manifest: amtrak57i.source_snapshots.map((snapshot) => ({
    ...snapshot,
    manifest_state: "retained_source_version",
    comparison_scope: "membership and bounded cohort observation only",
  })),
  historical_identity_decision_count: amtrakHistoricalDecisions.length,
  historical_presence_count: amtrakHistoricalDecisions.filter((row) => row.historical_snapshot_presence === "present").length,
  current_bounded_observation_links: amtrakHistoricalDecisions.filter((row) => row.current_bounded_cohort_observation === "present").length,
  historical_only_retentions: amtrakHistoricalDecisions.filter((row) => row.current_bounded_cohort_observation === "not_observed").length,
  current_name_queue_count: amtrakCurrentReviewQueue.length,
  accepted_exact_identity_links: amtrakCurrentReviewQueue.filter((row) => row.match_method === "exact_display_name").length,
  accepted_controlled_alias_links: amtrakCurrentReviewQueue.filter((row) => row.match_method.startsWith("controlled_alias")).length,
  rejected_unresolved_identity_links: amtrakCurrentReviewQueue.filter((row) => !row.historical_station_id).length,
  asserted_additions: 0,
  asserted_removals: 0,
  asserted_renames: 0,
  asserted_replacements: 0,
  operating_outcomes_ingested: 0,
  rejection_taxonomy: {
    missing_official_station_code: 5,
    missing_authoritative_crosswalk: 5,
    historical_nonappearance_is_not_deletion: 167,
  },
  review_rule: "Every historical identity remains present in its exact source snapshot. A later bounded cohort observation may attach only through an exact or controlled identity link; absence from that cohort does not establish deletion, renaming, replacement, or reliability.",
  historical_identity_decisions: amtrakHistoricalDecisions,
  current_name_review_queue: amtrakCurrentReviewQueue,
};
await writeJson(join(dataRoot, "phase-57j-amtrak-historical-snapshot-review-queue.json"), amtrakRail);

const migrationReason = (row) => row.migration_status === "pending_compatible_official_target_schema"
  ? "missing_compatible_official_target_schema"
  : row.migration_status === "blocked_pending_official_code_dictionary"
    ? "missing_official_code_dictionary"
    : "missing_validated_completed_project_quarter";
const montanaMigrationTests = montana57i.field_migration_rows.map((row) => ({
  ...row,
  test_case_id: "57J-" + row.migration_id,
  target_schema_present: false,
  target_definition_present: false,
  cross_rail_attempted: false,
  test_result: "rejected",
  primary_rejection_reason: migrationReason(row),
  accepted_value: null,
  operating_outcome: null,
}));
const envelopeRejectionCodes = [
  "missing_reporting_period",
  "missing_source_schema",
  "missing_source_authority",
  "missing_field_definition_version",
  "incomplete_privacy_review",
  "missing_state_acceptance_or_corrective_action",
  "missing_completed_public_project_quarter",
];
const montanaEnvelopeTests = montana57i.project_quarter_envelopes.map((row) => ({
  ...row,
  test_case_id: "57J-" + row.project_id + "-PENDING",
  validation_checks: {
    project_identity: true,
    reporting_rail: true,
    reporting_period: false,
    source_schema: false,
    source_authority: false,
    field_definition_version: false,
    privacy_review_complete: false,
    state_disposition: false,
    completed_public_record: false,
  },
  test_result: "rejected",
  rejection_reason_codes: envelopeRejectionCodes,
  accepted_observation: null,
  operating_outcome: null,
}));
const montanaRail = {
  phase: "57J",
  captured_date: capturedDate,
  rail_type: "Field-migration and project-envelope rejection taxonomy",
  migration_test_count: montanaMigrationTests.length,
  migration_tests_accepted: 0,
  migration_tests_rejected: montanaMigrationTests.length,
  migration_rejection_counts: countBy(montanaMigrationTests, "primary_rejection_reason"),
  project_envelope_test_count: montanaEnvelopeTests.length,
  project_envelopes_accepted: 0,
  project_envelopes_rejected: montanaEnvelopeTests.length,
  reporting_rail_counts: countBy(montanaEnvelopeTests, "reporting_rail"),
  envelope_rejection_counts: Object.fromEntries(envelopeRejectionCodes.map((code) => [code, montanaEnvelopeTests.length])),
  privacy_gated_envelopes: montanaEnvelopeTests.length,
  completed_project_quarters_ingested: 0,
  individual_bsl_identifiers_published: 0,
  individual_cai_details_published: 0,
  automatic_cross_rail_migrations: 0,
  review_rule: "A failed migration or envelope remains an explicit rejected control record. Test execution cannot invent a schema, period, definition, authority, privacy decision, state disposition, completed report, or outcome.",
  field_migration_tests: montanaMigrationTests,
  project_envelope_tests: montanaEnvelopeTests,
};
await writeJson(join(dataRoot, "phase-57j-montana-migration-envelope-rejection-taxonomy.json"), montanaRail);

const observationRejectionCodes = [
  "missing_stable_batch_identity",
  "missing_stable_container_identity",
  "missing_method",
  "missing_quality_state",
  "missing_acceptance_state",
  "missing_disposition_state",
];
const hanfordObservationReviews = hanford57i.observation_envelopes.map((row) => ({
  ...row,
  review_id: "57J-" + row.observation_id,
  normalized_record_state: "accepted_bounded_standalone_observation",
  join_review_state: "rejected",
  join_rejection_reason_codes: observationRejectionCodes,
  accepted_join_target: null,
  material_balance_eligible: false,
  operating_outcome: null,
}));
const primaryPairReasonOrder = ["stage", "measure", "period", "threshold_operator", "unit", "authority", "identity", "method", "quality", "acceptance", "disposition"];
const hanfordPairReviews = hanford57i.pair_validation_decisions.map((row) => ({
  ...row,
  taxonomy_state: "classified_rejected_pair",
  primary_rejection_reason: primaryPairReasonOrder.find((field) => row.failed_checks.includes(field)),
  accepted_join: null,
  operating_outcome: null,
}));
const pairFailureCounts = Object.fromEntries(hanford57i.validator_fields.map((field) => [
  field,
  hanfordPairReviews.filter((row) => row.failed_checks.includes(field)).length,
]));
const hanfordTransitionReviews = hanford57h.transitions.map((row) => ({
  ...row,
  review_id: "57J-" + row.transition_id,
  evidence_check_state: "rejected_pending_transition_evidence",
  rejection_reason_codes: [
    "missing_stable_public_batch_join",
    "missing_stable_public_container_join",
    "missing_dated_transfer_and_receipt",
    "missing_compatible_units_and_method",
    "missing_explicit_quality_and_acceptance_state",
  ],
  custody_transfer_accepted: false,
  operating_outcome: null,
}));
const hanfordRail = {
  phase: "57J",
  captured_date: capturedDate,
  rail_type: "Normalized observation, pair-rejection, and transition-evidence taxonomy",
  standalone_observation_review_count: hanfordObservationReviews.length,
  bounded_standalone_observations_retained: hanfordObservationReviews.length,
  observation_join_reviews_rejected: hanfordObservationReviews.length,
  observation_join_rejection_counts: Object.fromEntries(observationRejectionCodes.map((code) => [code, hanfordObservationReviews.length])),
  pair_review_count: hanfordPairReviews.length,
  pair_reviews_accepted: 0,
  pair_reviews_rejected: hanfordPairReviews.length,
  pair_primary_rejection_counts: countBy(hanfordPairReviews, "primary_rejection_reason"),
  pair_all_failure_counts: pairFailureCounts,
  transition_review_count: hanfordTransitionReviews.length,
  transition_reviews_accepted: 0,
  transition_reviews_rejected: hanfordTransitionReviews.length,
  public_batch_ids: 0,
  public_container_ids: 0,
  accepted_custody_transfers: 0,
  complete_material_balances: 0,
  review_rule: "Standalone observations remain publishable only at their exact source, date or period, stage, measure, operator, and unit. Pair and transition reviews fail visibly until identity, method, quality, acceptance, disposition, and custody evidence align.",
  normalized_observation_reviews: hanfordObservationReviews,
  pair_rejection_reviews: hanfordPairReviews,
  transition_evidence_reviews: hanfordTransitionReviews,
};
await writeJson(join(dataRoot, "phase-57j-hanford-observation-transition-rejection-taxonomy.json"), hanfordRail);

const nnsaDimensions = ["presence", "absence", "scope", "cost", "schedule", "capacity", "qualification", "output", "completion", "capability", "implementation", "independent_closure"];
const classifyCell = (state) => state === "not_used_for_this_object_state"
  ? "not_used_for_this_object_scope"
  : state === "independent_project_assessment_source_joined"
    ? "independent_project_assessment_present"
    : state === "independent_recommendation_status_joined"
      ? "independent_recommendation_status_present"
      : "agency_source_object_state_present_bounded";
const dimensionState = (classification, dimension) => {
  if (dimension === "presence") return classification === "not_used_for_this_object_scope" ? "not_present_for_object_scope" : "present_in_bounded_source_cell";
  if (dimension === "absence") return classification === "not_used_for_this_object_scope" ? "source_not_used_no_negative_inference" : "not_applicable_presence_recorded";
  if (classification === "not_used_for_this_object_scope") return "not_classified_from_this_source_cell";
  if (classification.startsWith("independent_")) return dimension === "independent_closure"
    ? "independent_state_present_no_closure_promotion"
    : "independent_source_present_no_agency_state_substitution";
  return "agency_source_present_requires_exact_dimension_extraction";
};
const nnsaCellReviews = nnsa57i.object_version_cells.map((row) => {
  const classification = classifyCell(row.version_state);
  return {
    ...row,
    review_state: "classified_bounded_object_version_cell",
    presence_classification: classification,
    dimension_states: Object.fromEntries(nnsaDimensions.map((dimension) => [dimension, dimensionState(classification, dimension)])),
    promoted_operating_outcome: null,
    implementation_change: false,
    closure_change: false,
  };
});
const nnsaDiffReviews = nnsa57i.bounded_diff_queue.map((row) => ({
  ...row,
  phase57j_review_state: "retained_bounded_source_diff",
  classified_dimensions: nnsaDimensions,
  operating_outcome: null,
  implementation_change: false,
  closure_change: false,
}));
const nnsaRail = {
  phase: "57J",
  captured_date: capturedDate,
  rail_type: "Complete object-version classification and bounded-diff review queue",
  object_count: nnsa57i.object_count,
  source_version_count: nnsa57i.source_version_count,
  object_version_cell_count: nnsaCellReviews.length,
  classification_dimension_count: nnsaDimensions.length,
  dimension_classification_count: nnsaCellReviews.length * nnsaDimensions.length,
  presence_classification_counts: countBy(nnsaCellReviews, "presence_classification"),
  bounded_diff_review_count: nnsaDiffReviews.length,
  operating_outcomes_ingested: 0,
  implementation_changes: 0,
  capability_promotions: 0,
  closure_changes: 0,
  review_rule: "Every object-version cell receives an explicit presence or not-used classification and twelve bounded dimension states. A classification cannot substitute agency and independent authority or promote cost, schedule, capacity, qualification, output, completion, capability, implementation, or closure.",
  classification_dimensions: nnsaDimensions,
  object_version_classification_queue: nnsaCellReviews,
  bounded_diff_review_queue: nnsaDiffReviews,
};
await writeJson(join(dataRoot, "phase-57j-nnsa-object-version-classification-queue.json"), nnsaRail);

const sourcesForStage = (stage) => [...new Set(phase57i.records
  .filter((record) => record.evidence_stage === stage)
  .flatMap((record) => record.supporting_source_ids))];
const amtrakSourceIds = sourcesForStage("Versioned station change detection");
const montanaSourceIds = sourcesForStage("Schema migration and bounded intake");
const hanfordSourceIds = sourcesForStage("Compatible-observation validation");
const nnsaSourceIds = appendUnique(
  sourcesForStage("Object-level source diff"),
  phase57h.records.filter((record) => record.evidence_stage === "Work-breakdown version history").flatMap((record) => record.supporting_source_ids),
);
const specs = [
  {
    slug: "amtrak-178-identity-source-snapshot-manifest",
    agency: "DOT",
    actionKey: "AMTRAK-HISTORICAL-SNAPSHOT-MANIFEST-2026-01",
    stage: "Historical identity backfill",
    sourceIds: amtrakSourceIds,
    title: "Amtrak's 178 historical identities now have explicit source-snapshot decisions",
    finding: "All 178 identities remain present in the FY2024-2029 source snapshot and carry a review disposition rather than an inferred current registry state.",
    denominator: "Two source snapshots and 178 historical identity decisions.",
    limits: ["Historical source presence is not current asset presence.", "A snapshot is not a complete station-code registry.", "Operating outcomes remain null."],
    next: "Attach later source versions only through the same identity and effective-period contract.",
    registry: "phase-57j-amtrak-historical-snapshot-review-queue.json",
  },
  {
    slug: "amtrak-11-current-links-167-historical-retentions",
    agency: "DOT",
    actionKey: "AMTRAK-HISTORICAL-PRESENCE-DISPOSITIONS-2026-01",
    stage: "Historical identity backfill",
    sourceIds: amtrakSourceIds,
    title: "Eleven Amtrak identities receive bounded current links while 167 remain historical-only",
    finding: "Eleven historical identities link to June 2026 cohort observations; the other 167 remain retained historical identities with no deletion inference.",
    denominator: "178 historical identities: eleven bounded current observations and 167 historical-only retentions.",
    limits: ["Current cohort nonappearance is not deletion.", "A cohort link is not an asset inventory.", "No reliability state is inferred."],
    next: "Review later current sources for exact or controlled identity links.",
    registry: "phase-57j-amtrak-historical-snapshot-review-queue.json",
  },
  {
    slug: "amtrak-16-name-review-queue-executed",
    agency: "DOT",
    actionKey: "AMTRAK-CURRENT-IDENTITY-QUEUE-EXECUTION-2026-01",
    stage: "Historical identity backfill",
    sourceIds: amtrakSourceIds,
    title: "The sixteen-name Amtrak identity queue records ten exact, one alias, and five rejected links",
    finding: "Ten exact links and one controlled alias pass review; five names remain rejected pending a code-bearing registry or authoritative crosswalk.",
    denominator: "Sixteen current names: ten exact links, one controlled alias, and five rejected unresolved links.",
    limits: ["Controlled alias is not an official rename.", "Rejected links remain visible.", "No station code is guessed."],
    next: "Reopen the five rejected links only with official station codes or an authoritative crosswalk.",
    registry: "phase-57j-amtrak-historical-snapshot-review-queue.json",
  },
  {
    slug: "amtrak-five-identity-rejections-remain-visible",
    agency: "DOT",
    actionKey: "AMTRAK-IDENTITY-REJECTION-TAXONOMY-2026-01",
    stage: "Historical identity backfill",
    sourceIds: amtrakSourceIds,
    title: "Five unresolved Amtrak identities remain visible under two rejection reasons",
    finding: "Each unresolved name records both a missing official station code and a missing authoritative crosswalk instead of disappearing from the queue.",
    denominator: "Five rejected links and ten recorded rejection-reason assignments.",
    limits: ["A rejection reason is not evidence the station is new.", "Missing public evidence is not evidence of absence.", "The queue cannot establish replacement."],
    next: "Preserve the rejected rows until an official identity artifact resolves them.",
    registry: "phase-57j-amtrak-historical-snapshot-review-queue.json",
  },
  {
    slug: "amtrak-zero-structural-or-outcome-promotions-after-backfill",
    agency: "DOT",
    actionKey: "AMTRAK-BACKFILL-ZERO-PROMOTIONS-2026-01",
    stage: "Historical identity backfill",
    sourceIds: amtrakSourceIds,
    title: "Amtrak historical backfill promotes zero structural changes or operating outcomes",
    finding: "The completed reviewer queue asserts zero additions, removals, renames, replacements, asset identities, closeouts, or reliability outcomes.",
    denominator: "178 historical decisions, sixteen current-name reviews, and zero promoted structural or outcome states.",
    limits: ["Backfill is a control operation.", "Historical completeness is not current completeness.", "Publication requires separate operating evidence."],
    next: "Keep structural and operating promotion behind exact source-version review.",
    registry: "phase-57j-amtrak-historical-snapshot-review-queue.json",
  },
  {
    slug: "montana-13-field-migration-tests-rejected",
    agency: "NTIA",
    actionKey: "MT-FIELD-MIGRATION-TEST-EXECUTION-2026-01",
    stage: "Migration and envelope rejection taxonomy",
    sourceIds: montanaSourceIds,
    title: "All thirteen Montana field-migration test cases reject absent target contracts",
    finding: "Every field test remains rejected because the compatible official target schema, code dictionary, or validated completed project-quarter record is absent.",
    denominator: "Thirteen migration test cases: zero accepted and thirteen rejected.",
    limits: ["Test execution cannot create a target field.", "A baseline definition cannot silently migrate.", "No outcome value is accepted."],
    next: "Rerun each field against an exact official target-schema version.",
    registry: "phase-57j-montana-migration-envelope-rejection-taxonomy.json",
  },
  {
    slug: "montana-11-missing-target-schema-rejections",
    agency: "NTIA",
    actionKey: "MT-MISSING-TARGET-SCHEMA-TAXONOMY-2026-01",
    stage: "Migration and envelope rejection taxonomy",
    sourceIds: montanaSourceIds,
    title: "Eleven Montana fields reject migration for a missing compatible target schema",
    finding: "Eleven baseline fields remain definition-bounded and cannot enter later terrestrial or LEO tables until an official target schema exists.",
    denominator: "Eleven of thirteen field-migration tests.",
    limits: ["Similar labels are not compatible definitions.", "Terrestrial and LEO contracts remain separate.", "No schema is inferred from prose."],
    next: "Capture and version the next official field dictionary before mapping values.",
    registry: "phase-57j-montana-migration-envelope-rejection-taxonomy.json",
  },
  {
    slug: "montana-code-dictionary-and-completed-record-blockers",
    agency: "NTIA",
    actionKey: "MT-SPECIAL-MIGRATION-BLOCKERS-2026-01",
    stage: "Migration and envelope rejection taxonomy",
    sourceIds: montanaSourceIds,
    title: "Montana's remaining migration blockers separate raw codes from completed outcomes",
    finding: "Raw technology codes reject for a missing official dictionary, while outcome state rejects for a missing validated completed project-quarter record.",
    denominator: "Two specialized migration tests with two distinct primary rejection reasons.",
    limits: ["Raw codes are not translated by assumption.", "Outcome slots cannot be filled from award baselines.", "A reserved field is not a result."],
    next: "Acquire the exact dictionary and completed-record schema as separate artifacts.",
    registry: "phase-57j-montana-migration-envelope-rejection-taxonomy.json",
  },
  {
    slug: "montana-32-project-envelope-rejections-classified",
    agency: "NTIA",
    actionKey: "MT-PROJECT-ENVELOPE-REJECTION-TAXONOMY-2026-01",
    stage: "Migration and envelope rejection taxonomy",
    sourceIds: montanaSourceIds,
    title: "Thirty-two Montana project envelopes now carry explicit rejection taxonomies",
    finding: "Every project envelope records missing period, schema, authority, definition version, completed privacy review, state disposition, and completed public record.",
    denominator: "Thirty-two project envelopes and 224 rejection-reason assignments across seven required classes.",
    limits: ["A rejected envelope is not a failed project.", "Privacy review remains mandatory.", "Missing state disposition cannot default to accepted."],
    next: "Reopen an envelope only when each required field is source-explicit.",
    registry: "phase-57j-montana-migration-envelope-rejection-taxonomy.json",
  },
  {
    slug: "montana-30-terrestrial-two-leo-zero-accepted-envelopes",
    agency: "NTIA",
    actionKey: "MT-REPORTING-RAIL-QUEUE-EXECUTION-2026-01",
    stage: "Migration and envelope rejection taxonomy",
    sourceIds: montanaSourceIds,
    title: "Thirty terrestrial and two LEO envelopes remain separate with zero accepted quarters",
    finding: "The full project queue executes without cross-rail migration, individual-location disclosure, or completed-quarter promotion.",
    denominator: "Thirty terrestrial envelopes, two LEO envelopes, zero accepted observations, and zero completed quarters.",
    limits: ["Rail membership is not performance.", "No individual BSL or CAI detail is published.", "Award scope is not observed adoption."],
    next: "Validate later public tables within their exact rail and privacy contract.",
    registry: "phase-57j-montana-migration-envelope-rejection-taxonomy.json",
  },
  {
    slug: "hanford-nine-observations-normalized-for-review",
    agency: "DOE",
    actionKey: "HANFORD-OBSERVATION-BACKFILL-2026-01",
    stage: "Observation and transition rejection taxonomy",
    sourceIds: hanfordSourceIds,
    title: "Nine Hanford observations are normalized without becoming joinable material records",
    finding: "Each observation retains its exact source, period or date, stage, measure, operator, value, unit, and authority as a bounded standalone record.",
    denominator: "Nine normalized observations and zero accepted numeric joins.",
    limits: ["Normalization does not create batch identity.", "Null method and disposition fields remain null.", "Standalone acceptance is not material-balance acceptance."],
    next: "Attach later fields only through exact source-attributed observation versions.",
    registry: "phase-57j-hanford-observation-transition-rejection-taxonomy.json",
  },
  {
    slug: "hanford-six-observation-join-blocker-classes",
    agency: "DOE",
    actionKey: "HANFORD-OBSERVATION-JOIN-REJECTION-TAXONOMY-2026-01",
    stage: "Observation and transition rejection taxonomy",
    sourceIds: hanfordSourceIds,
    title: "Six explicit blocker classes keep every Hanford observation non-joinable",
    finding: "All nine observation reviews record missing batch identity, container identity, method, quality, acceptance, and disposition.",
    denominator: "Nine observations and 54 blocker assignments across six classes.",
    limits: ["Missing fields do not become wildcards.", "Shared authority does not establish shared material.", "A numeric value alone is not join evidence."],
    next: "Require all six blocker classes to clear before pair evaluation can advance.",
    registry: "phase-57j-hanford-observation-transition-rejection-taxonomy.json",
  },
  {
    slug: "hanford-36-pair-rejections-classified",
    agency: "DOE",
    actionKey: "HANFORD-PAIR-REJECTION-QUEUE-EXECUTION-2026-01",
    stage: "Observation and transition rejection taxonomy",
    sourceIds: hanfordSourceIds,
    title: "All thirty-six Hanford pair rejections now carry primary and complete reason sets",
    finding: "Thirty-two pairs reject first on stage and four on measure; every pair also retains its full failed-check list across the eleven-field validator.",
    denominator: "Thirty-six pair reviews: thirty-two stage-primary rejections, four measure-primary rejections, and zero accepted joins.",
    limits: ["Primary reason does not erase other failed checks.", "Compatible units alone do not permit a join.", "Pair review is not yield calculation."],
    next: "Recompute only from revised source records with all eleven fields explicit.",
    registry: "phase-57j-hanford-observation-transition-rejection-taxonomy.json",
  },
  {
    slug: "hanford-14-transition-requirements-rejected",
    agency: "DOE",
    actionKey: "HANFORD-TRANSITION-EVIDENCE-QUEUE-2026-01",
    stage: "Observation and transition rejection taxonomy",
    sourceIds: hanfordSourceIds,
    title: "Fourteen Hanford lifecycle transitions remain rejected pending custody evidence",
    finding: "Every transition requires stable batch and container joins, dated transfer and receipt, compatible units and method, and explicit quality and acceptance state.",
    denominator: "Fourteen transition reviews, seventy rejection-reason assignments, and zero accepted custody transfers.",
    limits: ["Lifecycle adjacency is not custody evidence.", "Shared custodian names are not stable identities.", "A process animation is not a transfer ledger."],
    next: "Reopen a transition only with source-explicit transfer, receipt, identity, method, and acceptance evidence.",
    registry: "phase-57j-hanford-observation-transition-rejection-taxonomy.json",
  },
  {
    slug: "hanford-zero-material-balance-or-custody-promotions",
    agency: "DOE",
    actionKey: "HANFORD-BACKFILL-ZERO-PROMOTIONS-2026-01",
    stage: "Observation and transition rejection taxonomy",
    sourceIds: hanfordSourceIds,
    title: "Hanford backfill promotes zero custody transfers or complete material balances",
    finding: "The observation, pair, and transition queues finish with zero public batch IDs, container IDs, accepted custody transfers, direct numeric joins, or complete material balances.",
    denominator: "Nine observations, thirty-six pairs, fourteen transitions, and zero promoted material joins.",
    limits: ["Cumulative volume is not a reconciled balance.", "Container counts do not imply identified lineage.", "No yield or loss rate is computed."],
    next: "Keep the complete material-balance hold open until all stages reconcile.",
    registry: "phase-57j-hanford-observation-transition-rejection-taxonomy.json",
  },
  {
    slug: "nnsa-72-cells-864-dimension-classifications",
    agency: "DOE",
    actionKey: "NNSA-COMPLETE-CELL-CLASSIFICATION-2026-01",
    stage: "Object-version classification queue",
    sourceIds: nnsaSourceIds,
    title: "NNSA's seventy-two object-version cells now carry 864 bounded dimension classifications",
    finding: "Every cell is classified across presence, absence, scope, cost, schedule, capacity, qualification, output, completion, capability, implementation, and independent closure.",
    denominator: "Eighteen objects, four source versions, seventy-two cells, twelve dimensions, and 864 classifications.",
    limits: ["Classification is not value extraction.", "A source-specific state cannot cross object scope.", "No operating state is promoted."],
    next: "Replace a bounded dimension state only with exact object-level evidence.",
    registry: "phase-57j-nnsa-object-version-classification-queue.json",
  },
  {
    slug: "nnsa-30-agency-present-30-not-used-cells",
    agency: "DOE",
    actionKey: "NNSA-AGENCY-PRESENCE-ABSENCE-TAXONOMY-2026-01",
    stage: "Object-version classification queue",
    sourceIds: nnsaSourceIds,
    title: "Thirty NNSA cells carry bounded agency states and thirty are explicitly not used",
    finding: "Agency-source presence and not-used-for-object-scope decisions remain distinct; a not-used cell creates no negative factual inference.",
    denominator: "Sixty agency-source cell classifications: thirty present bounded and thirty not used for object scope.",
    limits: ["Not used is not absent in the real world.", "Presence is not implementation.", "Source versions retain their effective periods."],
    next: "Review future agency versions against the same object and dimension keys.",
    registry: "phase-57j-nnsa-object-version-classification-queue.json",
  },
  {
    slug: "nnsa-12-independent-source-cells-separated",
    agency: "DOE",
    actionKey: "NNSA-INDEPENDENT-AUTHORITY-CELL-TAXONOMY-2026-01",
    stage: "Object-version classification queue",
    sourceIds: nnsaSourceIds,
    title: "Twelve independent-source NNSA cells remain separate from agency operating states",
    finding: "Eleven cells retain independent project-assessment state and one retains independent recommendation status without substituting agency evidence or promoting closure.",
    denominator: "Eleven GAO project-assessment cells and one GAO recommendation-status cell.",
    limits: ["Independent assessment is not agency acceptance.", "Recommendation status is not enterprise capacity.", "No closure is inferred from publication."],
    next: "Join later GAO states only to the exact project or recommendation object.",
    registry: "phase-57j-nnsa-object-version-classification-queue.json",
  },
  {
    slug: "nnsa-10-bounded-diffs-linked-to-classification-queue",
    agency: "DOE",
    actionKey: "NNSA-BOUNDED-DIFF-QUEUE-EXECUTION-2026-01",
    stage: "Object-version classification queue",
    sourceIds: nnsaSourceIds,
    title: "Ten NNSA bounded source diffs now link to the complete classification queue",
    finding: "Each retained diff carries the twelve review dimensions while preserving object identity, source version, scope, cost concept, and authority.",
    denominator: "Ten bounded diff events linked to seventy-two classified cells.",
    limits: ["A budget change is not recurring output.", "A schedule statement is not project completion.", "A source diff is not a closure change."],
    next: "Review later diffs against exact object-version cells before publication.",
    registry: "phase-57j-nnsa-object-version-classification-queue.json",
  },
  {
    slug: "nnsa-zero-outcome-capability-implementation-closure-promotions",
    agency: "DOE",
    actionKey: "NNSA-CLASSIFICATION-ZERO-PROMOTIONS-2026-01",
    stage: "Object-version classification queue",
    sourceIds: nnsaSourceIds,
    title: "NNSA classification promotes zero outcomes, capability, implementation, or closure states",
    finding: "Completing all seventy-two cells changes no recurring output, accepted capacity, capability, implementation, project completion, or independent recommendation closure.",
    denominator: "Seventy-two classified cells, ten bounded diffs, and zero promoted operating or closure states.",
    limits: ["Taxonomy completion is not program completion.", "Capacity plans are not accepted operating capacity.", "The exact GAO enterprise baseline remains separate and Open."],
    next: "Preserve the three NNSA outcome holds until their exact reopening conditions are met.",
    registry: "phase-57j-nnsa-object-version-classification-queue.json",
  },
];

const holdKeyMap = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-08": "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-09",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-07": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-08",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-08": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-09",
  "LA-BEAD-STARLINK-HOLD-2026-08": "LA-BEAD-STARLINK-HOLD-2026-09",
  "MT-BEAD-QUARTERLY-HOLD-2026-08": "MT-BEAD-QUARTERLY-HOLD-2026-09",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-05": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-06",
  "NNSA-PIT-RATE-HOLD-2026-08": "NNSA-PIT-RATE-HOLD-2026-09",
  "NNSA-PIT-PEIS-HOLD-2026-08": "NNSA-PIT-PEIS-HOLD-2026-09",
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-09": "NNSA-PIT-GAO-BASELINE-HOLD-2026-10",
};
const inheritedHolds = phase57i.records.filter((record) => record.record_status === "In Review").map((record) => ({
  slug: "preserved-" + record.record_id.replace(/^record-57i-preserved-/, ""),
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
  throw new Error("Phase 57J requires twenty control panels and nine preserved holds.");
}
const allSpecs = [...specs.map((spec) => ({ ...spec, status: "Published", publicationDate: capturedDate })), ...inheritedHolds];
const carriedSourceIds = [...new Set(phase57h.records.flatMap((record) => record.supporting_source_ids))];
const sourceById = new Map();
for (const id of carriedSourceIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", id + ".json"), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const authorityBoundary = "A completed backfill row, rejection classification, test execution, reviewer disposition, or object-version classification is not an operating outcome. Rejected records remain visible; missing official values remain null; identity, schema, privacy, period, stage, method, unit, authority, acceptance, custody, work-breakdown scope, implementation, capability, and closure stay separate. No record supports rankings, composite scores, readiness scores, generalized savings, or unsupported causal attribution.";
const records = allSpecs.map((spec, index) => ({
  record_id: "record-57j-" + spec.slug,
  document_id: "research-doc-57j-" + spec.slug,
  signal_id: "signal-57j-" + spec.slug,
  document_number: 815 + index,
  phase: "57J",
  action_key: spec.actionKey,
  parent_hold_key: spec.parentHold ?? null,
  agency: spec.agency,
  entity_id: agencyMeta[spec.agency].entity,
  record_type: "Historical backfill, rejection taxonomy, and review-queue panel",
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
const priorHoldKeys = phase57i.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution.json"), {
  phase: "57J",
  captured_date: capturedDate,
  goal: "Execute the four Phase 57I rails across the complete carried historical state without waiting for new operating publications.",
  publication_rule: "Publish only reviewed backfill, rejection-taxonomy, and queue-execution controls; preserve all rejected rows and nine operating-outcome holds.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: evidenceStageCounts,
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57j-amtrak-historical-snapshot-review-queue.json", historical_identities: 178, current_observation_links: 11, historical_only_retentions: 167, rejected_unresolved_links: 5 },
    { file: "phase-57j-montana-migration-envelope-rejection-taxonomy.json", migration_tests: 13, project_envelopes: 32, accepted_records: 0 },
    { file: "phase-57j-hanford-observation-transition-rejection-taxonomy.json", observations: 9, pairs: 36, transitions: 14, accepted_joins: 0 },
    { file: "phase-57j-nnsa-object-version-classification-queue.json", objects: 18, cells: 72, dimensions: 12, classifications: 864 },
  ],
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57i.post_batch_visible_scope,
  post_batch_visible_scope: phase57i.post_batch_visible_scope,
  post_batch_closure_counts: phase57i.post_batch_closure_counts,
  preserved_phase57i_holds: priorHoldKeys,
  new_visible_holds: [],
  records,
});
await writeJson(join(dataRoot, "phase-57j-publication-review.json"), {
  phase: "57J",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key })),
  exact_target_artifacts_acquired: 0,
  decision: "Twenty bounded backfill, rejection-taxonomy, and queue-execution panels publish. All nine Phase 57I operating-outcome holds remain visible; no new hold, trigger, contact, scope change, implementation change, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = String(record.document_number - 814).padStart(2, "0") + "-" + record.record_id.replace(/^record-57j-/, "") + ".txt";
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", record.document_number + "-57j-" + record.record_id.replace(/^record-57j-/, "") + ".json"), {
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
      ? "The record turns a carried queue into explicit reviewed decisions while keeping rejections and missing values visible."
      : "The visible hold prevents completed control work from being mistaken for current reliability, adoption, material balance, qualified output, capacity, or independent closure.",
    ftfn_relevance: ["Executes the Phase 57I review rails across their full carried state.", "Turns rejected records into auditable taxonomy rather than silent omissions.", "Separates historical and control evidence from operating outcomes, implementation, capability, and closure."],
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
    yamlList("dependencies", ["versioned source snapshots and stable identity lineage", "explicit rejection reasons and reviewer dispositions", "separate outcome, implementation, capability, acceptance, and closure evidence"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57J historical-backfill and rejection-taxonomy rails"]),
    yamlList("local_implications", ["Do not promote a completed review queue or rejected test into an operating outcome."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    "last_reviewed_date: " + capturedDate,
    "editorial_notes: " + JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57J historical-backfill and rejection-taxonomy contract." : "Held under the exact inherited Phase 57I operating-outcome reopening condition."),
    "---",
    "",
    "## Phase 57J review panel",
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
  title: "Historical Backfill, Rejection Taxonomy, and Review-Queue Execution, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57J publishes twenty reviewed historical-backfill, rejection-taxonomy, and queue-execution panels across Amtrak, Montana BEAD, Hanford DFLAW, and NNSA while preserving all nine operating-outcome holds.",
  scope: "178 Amtrak historical identities and sixteen current-name reviews; thirteen Montana migration tests and thirty-two rejected project envelopes; nine Hanford observations, thirty-six rejected pairs, and fourteen rejected transition reviews; seventy-two NNSA cells with 864 dimension classifications and ten retained bounded diffs; plus nine preserved holds.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: "/downloads/" + collectionSlug + ".zip",
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "A completed backfill, rejected test, queue disposition, or object-version classification is not an operating outcome. Rejections stay visible, missing official values stay null, and identity, privacy, period, stage, method, unit, authority, acceptance, custody, implementation, capability, and closure remain distinct.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  "id: " + JSON.stringify(briefingId),
  "title: \"Research Watch 040: Historical Backfill and Rejection-Taxonomy Execution\"",
  "slug: \"research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution\"",
  "record_status: \"Published\"",
  "summary: \"Phase 57J executes four complete historical and review queues, publishes twenty bounded control panels, and preserves all nine operating-outcome holds.\"",
  "published_date: " + capturedDate,
  "captured_date: " + capturedDate,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  "last_reviewed_date: " + capturedDate,
  yamlList("top_takeaways", [
    "Amtrak now has 178 historical identity decisions, eleven bounded current links, 167 historical-only retentions, and five visible rejected unresolved links.",
    "Montana executes thirteen migration tests and thirty-two project-envelope tests, accepting zero records and retaining every rejection reason.",
    "Hanford normalizes nine observations and classifies thirty-six pair and fourteen transition rejections without creating a custody or material-balance join.",
    "NNSA classifies seventy-two object-version cells across twelve dimensions without promoting output, capability, implementation, or closure.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["Official code-bearing Amtrak station registry", "Montana completed public project-quarter schemas and accepted tables", "Hanford source-explicit identity and custody records", "NNSA later exact object-level operating and independent-closure states"]),
  "---",
  "",
  "## What Phase 57J adds",
  "",
  "Four carried review rails now contain complete historical decisions, rejected test cases, reason taxonomies, and object-version classifications rather than empty execution plans.",
  "",
  "## What did not move",
  "",
  "No backfill or classification is an operating outcome. None of the nine inherited holds clears, and no record establishes a station change, completed broadband quarter, Hanford material balance, NNSA recurring output, accepted capacity, implementation, capability, or closure.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57J records no trigger, agency contact, FOIA request, directive-scope change, implementation change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-03-phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution.json"), {
  id: "update-2026-08-03-phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57J publishes twenty historical-backfill and rejection-taxonomy controls",
  summary: "Thirty-six carried Tier 1 sources support four executed review rails, twenty Published control panels, and nine preserved operating-outcome holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: ["/research/" + collectionSlug + "/", "/briefings/research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution/", ...signalIds.map((id) => "/signals/" + id.replace(/^signal-/, "") + "/")],
  evidence_note: "Historical decisions, rejected test cases, rejection taxonomies, and object-version classifications remain separate from operating outcomes, implementation, acceptance, capability, and closure.",
  work_package: "docs/work-packages/phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution.md",
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
  ["finance-and-risk.json", allSourceIds, "Which Phase 57J rejection class first clears with a compatible accepted operating observation and unchanged denominator?"],
  ["policy-and-standards.json", allSourceIds, "Which official artifact first changes a Phase 57J rejected queue decision without weakening its identity, schema, privacy, or authority contract?"],
  ["mobility.json", amtrakSourceIds, "Which official code-bearing Amtrak snapshot first resolves one of the five visible identity rejections?"],
  ["chips-and-compute.json", broadbandSourceIds, "Which Montana publication first clears all seven project-envelope rejection classes at privacy-safe project granularity?"],
  ["energy.json", energySourceIds, "Which Hanford or NNSA source first clears a complete transition, material-balance, operating-output, capability, or closure evidence chain?"],
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
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57j-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57J historical backfill and rejection taxonomy");
    value.dependency_stack.push({
      stage: "Phase 57J historical backfill and rejection taxonomy",
      current_state: "Twenty Published control panels, four executed review rails, complete rejection taxonomies, and nine preserved operating-outcome holds.",
      boundary: "A completed queue, rejected test, reviewer disposition, or object-version classification is not an operating outcome, implementation, acceptance, capability, or closure.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57J prohibits silent rejection, deletion inference, guessed codes or schemas, privacy-detail exposure, cross-rail migration, coerced missing fields, synthetic custody or numeric joins, work-breakdown substitution, rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Source-explicit records that clear named Phase 57J rejection classes while preserving exact identity, definition, period, stage, method, unit, authority, privacy, acceptance, custody, object scope, and closure attribution."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57J executes four historical and review queues with visible rejection taxonomies while preserving nine operating-outcome holds.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57j-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57j-review-queue-execution");
  value.links = value.links.filter((link) => link.from !== "node-phase57j-review-queue-execution");
  value.nodes.push({ id: "node-phase57j-review-queue-execution", label: "Four executed review queues; twenty Published controls; visible rejection taxonomies; nine holds", node_type: "Signal", note: "Historical decisions and rejected records become auditable without manufacturing missing values or operating states." });
  value.links.push(
    { from: "node-phase57j-review-queue-execution", to: "node-phase57i-ingestion-rails", relationship: "Depends On", confidence: "Supported", note: "Phase 57J executes the four Phase 57I change-detection and bounded-ingestion rails." },
    { from: "node-phase57j-review-queue-execution", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Rejected identity, schema, privacy, compatibility, custody, and object-scope decisions remain explicit." },
    { from: "node-phase57j-review-queue-execution", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Backfill and taxonomy completion do not establish operating outcomes or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Four Phase 57J executed review rails, twenty Published control panels, explicit rejection taxonomies, and nine preserved operating-outcome holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Source-explicit records that clear named rejection classes without changing identity, denominator, object scope, authority, privacy, acceptance, capability, implementation, or closure attribution."]);
});

console.log("Generated Phase 57J: " + published.length + " Published controls, " + held.length + " In Review holds, " + carriedSourceIds.length + " carried Tier 1 sources, four executed review rails, and Research Watch 040.");
