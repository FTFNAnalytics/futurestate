import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const phase68 = await readJson(join(dataRoot, "phase-68-compatible-series-outcome-cohorts.json"));
const phase69 = await readJson(join(dataRoot, "phase-69-measurement-observation-break-registry.json"));

const reviewDimensions = [
  ["70-REVIEW-01-SPEC", "Specification and cohort identity", "The packet resolves to one exact Phase 69 specification and Phase 68 cohort."],
  ["70-REVIEW-02-ENTITY", "Entity and operating scope", "The named entity, facility, project, service, geography, population, and stage remain exact."],
  ["70-REVIEW-03-AUTHORITY", "Source and issuing authority", "The public source and responsible issuing or acceptance authority are explicit."],
  ["70-REVIEW-04-ARTIFACT", "Artifact integrity and provenance", "A stable public locator, capture, version, and provenance trail resolve to the reviewed artifact."],
  ["70-REVIEW-05-PERIOD", "Observed date and period", "Observed date, period start, period end, cadence, partial periods, and missing periods are explicit."],
  ["70-REVIEW-06-NUMERATOR", "Numerator and numerator unit", "The source-declared numerator and unit match the specification without inference or silent conversion."],
  ["70-REVIEW-07-DENOMINATOR", "Denominator and denominator unit", "The denominator or explicit not-applicable basis and unit are complete and compatible."],
  ["70-REVIEW-08-METHOD", "Method and version", "The collection, calculation, test, threshold, and method version are inspectable."],
  ["70-REVIEW-09-ACCEPTANCE", "Acceptance and recurrence basis", "The receiving or acceptance authority and same-entity recurring-operation basis are explicit."],
  ["70-REVIEW-10-EXCEPTIONS", "Exceptions and adverse observations", "Failures, outages, rejections, exclusions, and adverse observations remain visible."],
  ["70-REVIEW-11-REVISION", "Revision, correction, and break review", "Corrections, supersessions, withdrawals, restatements, and prospective series breaks are adjudicated."],
  ["70-REVIEW-12-PROPAGATION", "Receipt and propagation boundary", "A bounded receipt type and complete reader-surface propagation assignment follow the human decision."],
].map(([dimension_id, label, question]) => ({ dimension_id, label, question }));

const admissionDimensions = [
  ["70-ADMIT-01-IDENTITY", "Exact cohort identity", "The admission docket preserves the same file, entity, scope, and measurement contracts."],
  ["70-ADMIT-02-REVIEWED-SET", "Independently reviewed observation set", "Every proposed series point has a completed dual-control observation decision."],
  ["70-ADMIT-03-RECURRENCE", "Accepted recurring operation", "The exact entity has accepted repeated service, output, use, shipment, monitoring, or operation."],
  ["70-ADMIT-04-MEASURE", "Compatible measure and unit", "Numerators and source-declared units are stable or publicly reconciled."],
  ["70-ADMIT-05-DENOMINATOR", "Compatible denominator or exposure", "Denominators, populations, capacity, exposure, or explicit not-applicable bases are stable or reconciled."],
  ["70-ADMIT-06-PERIOD-METHOD", "Compatible period, method, and revision history", "Cadence, missing periods, method versions, corrections, and restatements remain inspectable."],
  ["70-ADMIT-07-BREAKS", "All series breaks adjudicated", "Every identity, scope, unit, denominator, period, method, authority, revision, exception, or attribution break is visible."],
  ["70-ADMIT-08-DECISION", "Human admission and complete propagation", "Two authorized reviewers issue the bounded admission decision and complete all assigned propagation."],
].map(([dimension_id, label, question]) => ({ dimension_id, label, question }));

const envelopeBySpec = new Map(phase69.observation_intake_envelopes.map((record) => [record.specification_id, record]));
const breakByCohort = new Map(phase69.series_break_registers.map((record) => [record.cohort_id, record]));

const reviewDockets = phase69.measurement_specifications.map((spec, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const envelope = envelopeBySpec.get(spec.specification_id);
  return {
    review_docket_id: `70-OR-${padded}`,
    slug: spec.slug.replace(/^69-ms-/, "70-or-"),
    record_kind: "observation_review_docket",
    record_status: "Published",
    docket_state: "Awaiting Submission",
    specification_id: spec.specification_id,
    intake_envelope_id: envelope.envelope_id,
    cohort_id: spec.cohort_id,
    file_id: spec.file_id,
    file_kind: spec.file_kind,
    named_entity: spec.named_entity,
    measure_id: spec.measure_id,
    measure_label: spec.measure_label,
    required_observation_field_ids: spec.required_field_ids,
    review_checks: reviewDimensions.map((dimension) => ({
      dimension_id: dimension.dimension_id,
      label: dimension.label,
      decision_state: "Not Reviewed",
      basis: "No observation has been submitted."
    })),
    source_ids: spec.source_ids,
    signal_ids: spec.signal_ids,
    evidence_gap_ids: spec.evidence_gap_ids,
    canonical_briefing_id: spec.canonical_briefing_id,
    reader_pathway_ids: spec.reader_pathway_ids,
    local_system_ids: spec.local_system_ids,
    dependency_map_ids: [
      "dependency-map-measurement-specification-is-not-evidence",
      "dependency-map-reviewed-observation-is-not-admitted-series"
    ],
    submitted_observation_id: null,
    submitted_payload_hash: null,
    first_reviewer_id: null,
    first_review_date: null,
    first_review_decision: null,
    second_reviewer_id: null,
    second_review_date: null,
    second_review_decision: null,
    conflict_or_recusal_state: null,
    adjudication_decision: null,
    decision_date: null,
    receipt_type: null,
    receipt_id: null,
    break_decision_id: null,
    propagation_status: "not_started",
    accepted_observation_ids: [],
    rejected_observation_ids: [],
    revision_lineage_ids: [],
    auto_acceptance_allowed: false,
    direct_publication_allowed: false,
    phase64_cell_change: "none"
  };
});

const lineageRegisters = reviewDockets.map((docket, index) => ({
  lineage_register_id: `70-LINEAGE-${String(index + 1).padStart(3, "0")}`,
  record_kind: "observation_revision_lineage_register",
  record_status: "Published",
  register_state: "Empty",
  review_docket_id: docket.review_docket_id,
  specification_id: docket.specification_id,
  cohort_id: docket.cohort_id,
  file_id: docket.file_id,
  current_observation_version_id: null,
  observation_versions: [],
  correction_events: [],
  supersession_events: [],
  withdrawal_events: [],
  published_observation_ids: [],
  unresolved_revision_count: 0,
  phase64_cell_change: "none"
}));

const seriesAdmissionDockets = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const short = cohort.cohort_id.toLowerCase().replace(/^68-cohort-\d+-/, "");
  const cohortReviews = reviewDockets.filter((record) => record.cohort_id === cohort.cohort_id);
  return {
    admission_docket_id: `70-SA-${padded}`,
    slug: `70-sa-${padded}-${short}`,
    record_kind: "series_admission_docket",
    record_status: "Published",
    admission_state: "Not Ready - No Reviewed Observations",
    admission_decision: "Not Admitted",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    file_kind: cohort.file_kind,
    named_entity: cohort.named_entity,
    measurement_specification_ids: cohortReviews.map((record) => record.specification_id),
    review_docket_ids: cohortReviews.map((record) => record.review_docket_id),
    break_register_id: breakByCohort.get(cohort.cohort_id).break_register_id,
    admission_checks: admissionDimensions.map((dimension, dimensionIndex) => ({
      dimension_id: dimension.dimension_id,
      label: dimension.label,
      decision_state: dimensionIndex === 0 ? "Contract Present" : "Not Ready",
      basis: dimensionIndex === 0 ? `The Phase 61 file and Phase 68 cohort preserve the exact identity for ${cohort.named_entity}.` : "No independently reviewed observation set exists."
    })),
    exact_next_artifact: cohort.exact_next_admission_artifact,
    source_ids: cohort.source_ids,
    signal_ids: cohort.signal_ids,
    evidence_gap_ids: cohort.evidence_gap_ids,
    canonical_briefing_id: cohort.canonical_briefing_id,
    reader_pathway_ids: cohort.reader_pathway_ids,
    local_system_ids: cohort.local_system_ids,
    candidate_observation_ids: [],
    eligible_observation_ids: [],
    admitted_series_ids: [],
    series_receipt_ids: [],
    proposed_series_definition: null,
    minimum_qualifying_observations: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    decision_receipt_id: null,
    propagation_status: "not_started",
    auto_admission_allowed: false,
    phase64_cell_change: "none",
    outcome_claim_created: false
  };
});

const registry = {
  schema_version: "1.0",
  phase: "70",
  registry_id: "observation-review-series-admission-control-registry-001",
  title: "Observation Review, Revision Lineage And Series Admission Control Registry",
  captured_date: "2026-08-23",
  as_of_date: "2026-08-23",
  scope: "Thirty-two empty observation-review dockets, thirty-two empty revision-lineage registers, and eight not-ready series-admission dockets for the Phase 69 measurement layer.",
  interpretation_boundary: "A review docket is not a submitted observation. A contract-present identity check is not an accepted value. A complete first review is not dual control. A reviewed observation is not automatically a series point, an admitted cohort, a comparison, a causal claim, or an outcome.",
  review_dimensions: reviewDimensions,
  admission_dimensions: admissionDimensions,
  review_decision_states: ["Not Reviewed", "Eligible For Second Review", "Held", "Rejected", "Accepted Observation"],
  series_admission_states: ["Not Ready - No Reviewed Observations", "Held For Compatibility", "Eligible For Admission Decision", "Admitted", "Rejected"],
  metrics: {
    observation_review_dockets: reviewDockets.length,
    revision_lineage_registers: lineageRegisters.length,
    series_admission_dockets: seriesAdmissionDockets.length,
    review_dimensions: reviewDimensions.length,
    admission_dimensions: admissionDimensions.length,
    empty_review_dockets: reviewDockets.filter((record) => record.docket_state === "Awaiting Submission").length,
    empty_lineage_registers: lineageRegisters.filter((record) => record.register_state === "Empty").length,
    not_ready_admission_dockets: seriesAdmissionDockets.filter((record) => record.admission_decision === "Not Admitted").length,
    submitted_observations: 0,
    completed_first_reviews: 0,
    completed_second_reviews: 0,
    accepted_observations: 0,
    rejected_observations: 0,
    revision_events: 0,
    decision_receipts_created: 0,
    admitted_series_created: 0,
    phase64_cells_advanced: 0,
    scores_created: 0,
    rankings_created: 0,
    outcome_claims_created: 0
  },
  observation_review_dockets: reviewDockets,
  observation_revision_lineage_registers: lineageRegisters,
  series_admission_dockets: seriesAdmissionDockets
};

await writeJson(join(dataRoot, "phase-70-observation-review-series-admission-registry.json"), registry);

const pathwayIds = [...new Set(reviewDockets.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", `${pathwayId.replace("reader-pathway-", "")}.json`);
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, "briefing-observation-review-desk-001", "briefing-series-admission-protocol-001"] )];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, "dependency-map-reviewed-observation-is-not-admitted-series"] )];
  await writeJson(path, pathway);
}

for (const cohort of phase68.cohort_records) {
  const docket = seriesAdmissionDockets.find((record) => record.cohort_id === cohort.cohort_id);
  const reviews = reviewDockets.filter((record) => record.cohort_id === cohort.cohort_id);
  const path = join(contentRoot, "briefings", `${cohort.canonical_briefing_id}.mdx`);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 70 observation review and series admission")) {
    body = `${body.trimEnd()}\n\n## Phase 70 observation review and series admission\n\n[Observation Review Desk 001](/briefings/observation-review-desk-001/) assigns four empty review dockets to this named file: ${reviews.map((record) => `[${record.review_docket_id}](/evidence/review/${record.slug}/)`).join(", ")}. Each docket requires twelve review decisions, independent second review, conflict handling, receipt binding, break adjudication, and complete propagation.\n\n[${docket.admission_docket_id}](/evidence/review/${docket.slug}/) remains Not Admitted with seven of eight admission gates Not Ready. No observation, review, receipt, revision event, series, stage advance, score, comparison, or outcome exists.\n`;
    await writeFile(path, body, "utf8");
  }
}

const localFileById = {
  "local-us-southwest-chip-corridor": "local-us-southwest-chip-corridor.mdx",
  "local-ontario-real-estate": "local-ontario-real-estate.mdx",
  "local-northern-virginia-data-center-corridor": "local-northern-virginia-data-center-corridor.mdx",
  "local-florida-space-coast-launch-corridor": "local-florida-space-coast-launch-corridor.mdx",
  "local-nevada-lithium-processing-corridor": "local-nevada-lithium-processing-corridor.mdx"
};
for (const [localId, filename] of Object.entries(localFileById)) {
  const cohort = phase68.cohort_records.find((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 70 human-review boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 70 human-review boundary\n\nThe [Observation Review Registry](/evidence/review/) contains four empty review dockets and one not-ready admission docket for ${cohort.named_entity}. The local system cannot submit, review, accept, revise, bind a receipt to, or admit an observation on behalf of the named file.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-outcome-cohort-admission-desk-001.mdx",
  "briefing-measurement-dictionary-001.mdx",
  "briefing-series-break-adjudication-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 70 review and admission control")) {
    body = `${body.trimEnd()}\n\n## Phase 70 review and admission control\n\n[Observation Review Desk 001](/briefings/observation-review-desk-001/) and the [Series Admission Protocol](/briefings/series-admission-protocol-001/) add empty review, revision-lineage, and admission dockets after Phase 69 intake. They create zero submissions, reviews, accepted observations, receipts, revision events, series, or outcomes.\n`;
    await writeFile(path, body, "utf8");
  }
}

console.log(`Phase 70 content built: ${reviewDockets.length} empty review dockets, ${lineageRegisters.length} empty lineage registers, ${seriesAdmissionDockets.length} not-ready admission dockets, ${reviewDimensions.length} review dimensions, ${admissionDimensions.length} admission dimensions, ${pathwayIds.length} pathways, and 0 observations.`);
