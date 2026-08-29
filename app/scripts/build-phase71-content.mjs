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
const phase70 = await readJson(join(dataRoot, "phase-70-observation-review-series-admission-registry.json"));

const outcomeInferenceDimensions = [
  ["71-OUTCOME-01-SERIES", "Admitted series basis", "Every supporting panel resolves to an explicitly admitted compatible series."],
  ["71-OUTCOME-02-IDENTITY", "Stable identity and scope", "The claim preserves one named entity, operating scope, receiving authority, and lifecycle stage."],
  ["71-OUTCOME-03-PERIODS", "Repeated-period sufficiency", "Period coverage, cadence, missingness, partial periods, and any minimum sufficiency decision are explicit."],
  ["71-OUTCOME-04-DIRECTION", "Direction and magnitude", "Any direction, magnitude, or rate is calculated only from admitted points under the declared measure contract."],
  ["71-OUTCOME-05-COMPATIBILITY", "Denominator and method compatibility", "Units, denominators, exposure, methods, versions, and revisions remain compatible or visibly segmented."],
  ["71-OUTCOME-06-ADVERSE", "Breaks, revisions, and adverse evidence", "Missing periods, failures, outages, exceptions, corrections, and adverse observations remain visible."],
  ["71-OUTCOME-07-ALTERNATIVES", "Alternative explanations and counterfactuals", "Plausible alternative explanations and the limits of any counterfactual are stated before attribution."],
  ["71-OUTCOME-08-ATTRIBUTION", "Attribution and receiving authority", "The responsible actor, receiving authority, intervention boundary, and non-transfer rule are explicit."],
  ["71-OUTCOME-09-UNCERTAINTY", "Uncertainty, sensitivity, and limitations", "Coverage, uncertainty, sensitivity to definitions, and interpretation limits accompany the claim."],
  ["71-OUTCOME-10-DECISION", "Dual-control claim decision and propagation", "Two authorized reviewers issue a bounded claim decision and complete every assigned reader-surface update."],
].map(([dimension_id, label, question]) => ({ dimension_id, label, question }));

const comparisonEligibilityDimensions = [
  ["71-COMPARE-01-QUESTION", "Common entity class and question", "Compared entities answer one explicitly common operating-outcome question."],
  ["71-COMPARE-02-MEASURE", "Common measure and unit", "The numerator definition and source-declared units are compatible."],
  ["71-COMPARE-03-DENOMINATOR", "Common denominator or exposure", "The denominator, population, capacity, exposure, or not-applicable basis is compatible."],
  ["71-COMPARE-04-PERIOD", "Compatible periods and cadence", "Coverage windows, cadence, partial periods, and missingness are compatible."],
  ["71-COMPARE-05-METHOD", "Compatible method and version", "Collection, calculation, test, threshold, and method versions are compatible."],
  ["71-COMPARE-06-LIFECYCLE", "Common lifecycle and acceptance stage", "The compared records occupy a common operating and receiving-system stage."],
  ["71-COMPARE-07-BREAKS", "Visible breaks, missingness, and revisions", "Every break, exclusion, correction, restatement, and missing period remains visible."],
  ["71-COMPARE-08-UNCERTAINTY", "Comparable uncertainty and coverage", "Coverage and uncertainty permit the bounded comparison being proposed."],
  ["71-COMPARE-09-NO-RANKING", "No composite or ranking inference", "A bounded comparison cannot silently become a score, league table, composite, or rank."],
  ["71-COMPARE-10-DECISION", "Human comparison decision and propagation", "Two authorized reviewers approve the exact comparison and propagate its receipt and limitations."],
].map(([dimension_id, label, question]) => ({ dimension_id, label, question }));

const reviewBySpec = new Map(phase70.observation_review_dockets.map((record) => [record.specification_id, record]));
const admissionByCohort = new Map(phase70.series_admission_dockets.map((record) => [record.cohort_id, record]));

const longitudinalPanelShells = phase69.measurement_specifications.map((spec, index) => {
  const review = reviewBySpec.get(spec.specification_id);
  const admission = admissionByCohort.get(spec.cohort_id);
  return {
    panel_id: `71-PANEL-${String(index + 1).padStart(3, "0")}`,
    slug: spec.slug.replace(/^69-ms-/, "71-panel-"),
    record_kind: "longitudinal_panel_shell",
    record_status: "Published",
    panel_state: "Empty - No Admitted Series",
    cohort_id: spec.cohort_id,
    file_id: spec.file_id,
    file_kind: spec.file_kind,
    named_entity: spec.named_entity,
    specification_id: spec.specification_id,
    specification_slug: spec.slug,
    review_docket_id: review.review_docket_id,
    series_admission_docket_id: admission.admission_docket_id,
    series_admission_state: admission.admission_state,
    measure_id: spec.measure_id,
    measure_label: spec.measure_label,
    numerator_contract: spec.numerator_contract,
    denominator_contract: spec.denominator_contract,
    scope_contract: spec.scope_contract,
    unit_contract: spec.unit_contract,
    period_contract: spec.period_contract,
    method_contract: spec.method_contract,
    exception_contract: spec.exception_contract,
    source_ids: spec.source_ids,
    signal_ids: spec.signal_ids,
    evidence_gap_ids: spec.evidence_gap_ids,
    canonical_briefing_id: spec.canonical_briefing_id,
    reader_pathway_ids: spec.reader_pathway_ids,
    local_system_ids: spec.local_system_ids,
    dependency_map_ids: [
      "dependency-map-reviewed-observation-is-not-admitted-series",
      "dependency-map-admitted-series-is-not-causal-outcome"
    ],
    current_series_id: null,
    admitted: false,
    accepted_observation_ids: [],
    series_point_ids: [],
    period_axis: [],
    values: [],
    revisions: [],
    breaks: [],
    uncertainty_notes: [],
    first_period: null,
    last_period: null,
    minimum_periods_for_claim: null,
    current_direction: null,
    current_magnitude: null,
    current_trend: null,
    outcome_claim_ids: [],
    automatic_trend_allowed: false,
    phase64_cell_change: "none"
  };
});

const outcomeClaimDockets = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const short = cohort.cohort_id.toLowerCase().replace(/^68-cohort-\d+-/, "");
  const panels = longitudinalPanelShells.filter((record) => record.cohort_id === cohort.cohort_id);
  const admission = admissionByCohort.get(cohort.cohort_id);
  return {
    outcome_claim_docket_id: `71-OC-${padded}`,
    slug: `71-oc-${padded}-${short}`,
    record_kind: "outcome_claim_docket",
    record_status: "Published",
    docket_state: "Not Ready - No Admitted Series",
    claim_decision: "Not Published",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    file_kind: cohort.file_kind,
    named_entity: cohort.named_entity,
    series_admission_docket_id: admission.admission_docket_id,
    panel_ids: panels.map((record) => record.panel_id),
    outcome_inference_checks: outcomeInferenceDimensions.map((dimension) => ({
      dimension_id: dimension.dimension_id,
      label: dimension.label,
      decision_state: "Not Ready",
      basis: "No admitted compatible series exists."
    })),
    exact_next_artifact: cohort.exact_next_admission_artifact,
    source_ids: cohort.source_ids,
    signal_ids: cohort.signal_ids,
    evidence_gap_ids: cohort.evidence_gap_ids,
    canonical_briefing_id: cohort.canonical_briefing_id,
    reader_pathway_ids: cohort.reader_pathway_ids,
    local_system_ids: cohort.local_system_ids,
    dependency_map_ids: ["dependency-map-admitted-series-is-not-causal-outcome"],
    proposed_claim_text: null,
    proposed_claim_type: null,
    supporting_panel_ids: [],
    supporting_observation_ids: [],
    adverse_observation_ids: [],
    alternative_explanation_records: [],
    uncertainty_statement: null,
    attribution_statement: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    decision_receipt_id: null,
    propagation_status: "not_started",
    causal_claim_allowed: false,
    automatic_publication_allowed: false,
    score_created: false,
    ranking_created: false,
    phase64_cell_change: "none"
  };
});

const comparisonEmbargoRegisters = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const outcome = outcomeClaimDockets[index];
  return {
    comparison_register_id: `71-COMP-${padded}`,
    record_kind: "comparison_embargo_register",
    record_status: "Published",
    comparison_state: "Embargoed - No Common Admitted Series",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    named_entity: cohort.named_entity,
    outcome_claim_docket_id: outcome.outcome_claim_docket_id,
    panel_ids: outcome.panel_ids,
    comparison_checks: comparisonEligibilityDimensions.map((dimension) => ({
      dimension_id: dimension.dimension_id,
      label: dimension.label,
      decision_state: "Not Ready",
      basis: "No common admitted series and no approved comparison candidate exist."
    })),
    embargo_reason: "No common admitted series preserves a shared measure, denominator, period, method, lifecycle, and uncertainty contract.",
    comparison_candidate_ids: [],
    approved_peer_ids: [],
    approved_measure_ids: [],
    comparison_decision: null,
    decision_date: null,
    decision_receipt_id: null,
    propagation_status: "not_started",
    cross_entity_transfer_allowed: false,
    automatic_comparison_allowed: false,
    score_created: false,
    ranking_created: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "71",
  registry_id: "longitudinal-panel-outcome-claim-comparison-control-registry-001",
  title: "Longitudinal Panel, Outcome Claim And Comparison Control Registry",
  captured_date: "2026-08-23",
  as_of_date: "2026-08-23",
  scope: "Thirty-two empty longitudinal panel shells, eight not-ready outcome-claim dockets, and eight comparison embargo registers for the Phase 70 admission layer.",
  interpretation_boundary: "A panel shell is not a series. An admitted series is not automatically a trend or outcome. A bounded outcome claim is not causation. No cross-entity comparison, score, composite, or ranking is permitted without a separately approved common contract.",
  outcome_inference_dimensions: outcomeInferenceDimensions,
  comparison_eligibility_dimensions: comparisonEligibilityDimensions,
  panel_states: ["Empty - No Admitted Series", "Held", "Eligible For Panel Review", "Published Panel"],
  outcome_claim_states: ["Not Ready - No Admitted Series", "Held", "Eligible For Claim Review", "Published Bounded Claim", "Rejected"],
  comparison_states: ["Embargoed - No Common Admitted Series", "Held", "Eligible For Comparison Review", "Approved Bounded Comparison", "Rejected"],
  metrics: {
    longitudinal_panel_shells: longitudinalPanelShells.length,
    empty_panel_shells: longitudinalPanelShells.length,
    outcome_claim_dockets: outcomeClaimDockets.length,
    not_ready_outcome_claim_dockets: outcomeClaimDockets.length,
    comparison_embargo_registers: comparisonEmbargoRegisters.length,
    active_comparison_embargoes: comparisonEmbargoRegisters.length,
    outcome_inference_dimensions: outcomeInferenceDimensions.length,
    comparison_eligibility_dimensions: comparisonEligibilityDimensions.length,
    admitted_series_received: 0,
    panel_series_points: 0,
    values_published: 0,
    trends_created: 0,
    outcome_claims_published: 0,
    comparisons_approved: 0,
    scores_created: 0,
    rankings_created: 0,
    decision_receipts_created: 0,
    phase64_cells_advanced: 0
  },
  longitudinal_panel_shells: longitudinalPanelShells,
  outcome_claim_dockets: outcomeClaimDockets,
  comparison_embargo_registers: comparisonEmbargoRegisters
};

await writeJson(join(dataRoot, "phase-71-longitudinal-panel-outcome-comparison-registry.json"), registry);

const pathwayIds = [...new Set(longitudinalPanelShells.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", `${pathwayId.replace("reader-pathway-", "")}.json`);
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, "briefing-longitudinal-panel-desk-001", "briefing-outcome-claim-comparison-protocol-001"] )];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, "dependency-map-admitted-series-is-not-causal-outcome"] )];
  await writeJson(path, pathway);
}

for (const cohort of phase68.cohort_records) {
  const panels = longitudinalPanelShells.filter((record) => record.cohort_id === cohort.cohort_id);
  const outcome = outcomeClaimDockets.find((record) => record.cohort_id === cohort.cohort_id);
  const comparison = comparisonEmbargoRegisters.find((record) => record.cohort_id === cohort.cohort_id);
  const path = join(contentRoot, "briefings", `${cohort.canonical_briefing_id}.mdx`);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 71 longitudinal outcome boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 71 longitudinal outcome boundary\n\n[Longitudinal Panel Desk 001](/briefings/longitudinal-panel-desk-001/) assigns four empty panels to this named file: ${panels.map((record) => `[${record.panel_id}](/evidence/outcomes/${record.slug}/)`).join(", ")}. [${outcome.outcome_claim_docket_id}](/evidence/outcomes/${outcome.slug}/) remains Not Ready, and ${comparison.comparison_register_id} keeps cross-file comparison embargoed. No admitted series, point, value, direction, magnitude, trend, outcome claim, comparison, score, rank, receipt, or Phase 64 cell change exists.\n`;
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
  const cohorts = phase68.cohort_records.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 71 outcome and comparison boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 71 outcome and comparison boundary\n\nThe [Longitudinal Panel Registry](/evidence/outcomes/) exposes empty panel and outcome-claim contracts for ${cohorts.map((record) => record.named_entity).join(" and ")}. The local system cannot manufacture a panel, trend, outcome, peer comparison, score, or rank from an upstream authorization, acceptance statement, measurement specification, or empty workflow contract.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-observation-review-desk-001.mdx",
  "briefing-series-admission-protocol-001.mdx",
  "briefing-outcome-cohort-admission-desk-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 71 panel, claim, and comparison control")) {
    body = `${body.trimEnd()}\n\n## Phase 71 panel, claim, and comparison control\n\n[Longitudinal Panel Desk 001](/briefings/longitudinal-panel-desk-001/) and the [Outcome And Comparison Protocol](/briefings/outcome-claim-comparison-protocol-001/) add thirty-two empty panel shells, eight not-ready claim dockets, and eight active comparison embargoes. They create zero values, trends, claims, comparisons, scores, rankings, receipts, or stage changes.\n`;
    await writeFile(path, body, "utf8");
  }
}

console.log(`Phase 71 content built: ${longitudinalPanelShells.length} empty panels, ${outcomeClaimDockets.length} not-ready claim dockets, ${comparisonEmbargoRegisters.length} comparison embargo registers, ${outcomeInferenceDimensions.length} outcome gates, ${comparisonEligibilityDimensions.length} comparison gates, ${pathwayIds.length} pathways, and 0 values or claims.`);
