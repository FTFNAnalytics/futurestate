import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-71-longitudinal-panel-outcome-comparison-registry.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function inspectPanel(panel, fixture) {
  if (fixture.requested_action === "auto_trend") return "rejected_automatic_inference";
  if (!fixture.series) return "empty_no_admitted_series";
  if (!fixture.series.admitted) return "rejected_unadmitted_series";
  if (!fixture.series.points?.length) return "held_no_series_points";
  if (fixture.series.cohort_id !== panel.cohort_id || fixture.series.measure_id !== panel.measure_id || fixture.series.named_entity !== panel.named_entity) return "rejected_identity_or_scope";
  if (!fixture.compatible_unit || !fixture.compatible_denominator || !fixture.compatible_period) return "segment_for_incompatible_contract";
  if (fixture.unresolved_breaks > 0 || fixture.revision_lineage_complete !== true) return "held_break_or_revision";
  return "eligible_for_human_panel_review";
}

function inspectOutcome(fixture) {
  if (fixture.requested_action === "auto_publish") return "rejected_automatic_publication";
  if (fixture.requested_action === "causal_shortcut") return "rejected_causal_shortcut";
  if (!fixture.admitted_series_count) return "not_ready_no_admitted_series";
  if (!fixture.repeated_periods_sufficient) return "held_insufficient_periods";
  if (!fixture.adverse_evidence_visible) return "held_hidden_adverse_evidence";
  if (!fixture.alternative_explanations_complete) return "held_missing_alternatives";
  if (!fixture.uncertainty_complete) return "held_missing_uncertainty";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id) return "rejected_non_independent_review";
  if (fixture.propagation_status !== "complete") return "held_incomplete_propagation";
  return "eligible_for_human_claim_decision";
}

function inspectComparison(fixture) {
  if (fixture.requested_action === "rank") return "rejected_ranking_request";
  if (!fixture.common_admitted_series) return "embargoed_no_common_series";
  if (!fixture.common_measure) return "embargoed_measure_mismatch";
  if (!fixture.common_denominator) return "embargoed_denominator_mismatch";
  if (!fixture.compatible_periods) return "embargoed_period_mismatch";
  if (!fixture.compatible_method) return "embargoed_method_mismatch";
  if (!fixture.common_lifecycle) return "embargoed_lifecycle_mismatch";
  if (!fixture.breaks_and_missingness_visible) return "held_hidden_break_or_missingness";
  if (!fixture.uncertainty_comparable) return "held_incomparable_uncertainty";
  return "eligible_for_human_comparison_decision";
}

let panelCases = 0;
for (const panel of registry.longitudinal_panel_shells) {
  const series = { admitted: true, points: [{ period: "2099-Q1", value: 1 }], cohort_id: panel.cohort_id, measure_id: panel.measure_id, named_entity: panel.named_entity };
  const complete = { series, compatible_unit: true, compatible_denominator: true, compatible_period: true, unresolved_breaks: 0, revision_lineage_complete: true, requested_action: "review" };
  const cases = [
    ["no_series", { ...complete, series: null }, "empty_no_admitted_series"],
    ["unadmitted", { ...complete, series: { ...series, admitted: false } }, "rejected_unadmitted_series"],
    ["no_points", { ...complete, series: { ...series, points: [] } }, "held_no_series_points"],
    ["wrong_identity", { ...complete, series: { ...series, named_entity: "wrong" } }, "rejected_identity_or_scope"],
    ["unit_mismatch", { ...complete, compatible_unit: false }, "segment_for_incompatible_contract"],
    ["denominator_mismatch", { ...complete, compatible_denominator: false }, "segment_for_incompatible_contract"],
    ["period_mismatch", { ...complete, compatible_period: false }, "segment_for_incompatible_contract"],
    ["hidden_break", { ...complete, unresolved_breaks: 1 }, "held_break_or_revision"],
    ["automatic_trend", { ...complete, requested_action: "auto_trend" }, "rejected_automatic_inference"],
    ["complete", complete, "eligible_for_human_panel_review"]
  ];
  for (const [name, fixture, expected] of cases) {
    panelCases += 1;
    check(inspectPanel(panel, fixture) === expected, `${panel.panel_id} failed ${name}.`);
  }
}

let outcomeCases = 0;
for (const docket of registry.outcome_claim_dockets) {
  const complete = { admitted_series_count: 1, repeated_periods_sufficient: true, adverse_evidence_visible: true, alternative_explanations_complete: true, uncertainty_complete: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", requested_action: "review" };
  const cases = [
    ["no_series", { ...complete, admitted_series_count: 0 }, "not_ready_no_admitted_series"],
    ["insufficient_periods", { ...complete, repeated_periods_sufficient: false }, "held_insufficient_periods"],
    ["hidden_adverse", { ...complete, adverse_evidence_visible: false }, "held_hidden_adverse_evidence"],
    ["missing_alternatives", { ...complete, alternative_explanations_complete: false }, "held_missing_alternatives"],
    ["missing_uncertainty", { ...complete, uncertainty_complete: false }, "held_missing_uncertainty"],
    ["causal_shortcut", { ...complete, requested_action: "causal_shortcut" }, "rejected_causal_shortcut"],
    ["same_reviewer", { ...complete, second_reviewer_id: "reviewer-a" }, "rejected_non_independent_review"],
    ["incomplete_propagation", { ...complete, propagation_status: "partial" }, "held_incomplete_propagation"],
    ["automatic_publish", { ...complete, requested_action: "auto_publish" }, "rejected_automatic_publication"],
    ["complete", complete, "eligible_for_human_claim_decision"]
  ];
  for (const [name, fixture, expected] of cases) {
    outcomeCases += 1;
    check(inspectOutcome(fixture) === expected, `${docket.outcome_claim_docket_id} failed ${name}.`);
  }
}

let comparisonCases = 0;
for (const register of registry.comparison_embargo_registers) {
  const complete = { common_admitted_series: true, common_measure: true, common_denominator: true, compatible_periods: true, compatible_method: true, common_lifecycle: true, breaks_and_missingness_visible: true, uncertainty_comparable: true, requested_action: "review" };
  const cases = [
    ["no_common_series", { ...complete, common_admitted_series: false }, "embargoed_no_common_series"],
    ["measure_mismatch", { ...complete, common_measure: false }, "embargoed_measure_mismatch"],
    ["denominator_mismatch", { ...complete, common_denominator: false }, "embargoed_denominator_mismatch"],
    ["period_mismatch", { ...complete, compatible_periods: false }, "embargoed_period_mismatch"],
    ["method_mismatch", { ...complete, compatible_method: false }, "embargoed_method_mismatch"],
    ["lifecycle_mismatch", { ...complete, common_lifecycle: false }, "embargoed_lifecycle_mismatch"],
    ["hidden_break", { ...complete, breaks_and_missingness_visible: false }, "held_hidden_break_or_missingness"],
    ["uncertainty_mismatch", { ...complete, uncertainty_comparable: false }, "held_incomparable_uncertainty"],
    ["ranking_request", { ...complete, requested_action: "rank" }, "rejected_ranking_request"],
    ["complete", complete, "eligible_for_human_comparison_decision"]
  ];
  for (const [name, fixture, expected] of cases) {
    comparisonCases += 1;
    check(inspectComparison(fixture) === expected, `${register.comparison_register_id} failed ${name}.`);
  }
}

check(panelCases === 320, `Expected 320 panel cases, found ${panelCases}.`);
check(outcomeCases === 80, `Expected 80 outcome cases, found ${outcomeCases}.`);
check(comparisonCases === 80, `Expected 80 comparison cases, found ${comparisonCases}.`);
check(registry.metrics.admitted_series_received === 0 && registry.metrics.values_published === 0 && registry.metrics.outcome_claims_published === 0 && registry.metrics.comparisons_approved === 0 && registry.metrics.rankings_created === 0, "The synthetic harness must not mutate real state.");

if (failures.length) {
  console.error("Phase 71 synthetic harness failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 71 synthetic harness passed: 320 panel cases, 80 outcome-claim cases, and 80 comparison cases, 480 total, with no real series, points, values, trends, claims, comparisons, scores, rankings, or receipts created.");
