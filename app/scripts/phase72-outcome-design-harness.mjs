import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-72-outcome-evidence-counterfactual-design-registry.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function inspectPacket(packet, fixture) {
  if (fixture.requested_action === "auto_publish") return "rejected_automatic_publication";
  if (!fixture.panel?.eligible) return "empty_no_eligible_panel";
  if (fixture.panel.panel_id !== packet.panel_id || fixture.panel.cohort_id !== packet.cohort_id || fixture.panel.measure_id !== packet.measure_id) return "rejected_identity_or_scope";
  if (!fixture.outcome_question) return "held_missing_outcome_question";
  if (!registry.claim_class_taxonomy.some((item) => item.claim_class_id === fixture.claim_class_id)) return "held_unclassified_claim";
  if (fixture.verb_strength_exceeds_class) return "rejected_claim_strength";
  if (!fixture.calculation_complete || !fixture.timing_complete) return "held_incomplete_calculation_or_timing";
  if (!fixture.adverse_evidence_visible) return "held_hidden_adverse_evidence";
  if (!fixture.alternatives_complete) return "held_incomplete_alternative_assessment";
  if (!fixture.uncertainty_complete) return "held_missing_uncertainty";
  if (!fixture.reproducibility_complete) return "held_missing_reproducibility";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id) return "rejected_non_independent_review";
  if (fixture.propagation_status !== "complete") return "held_incomplete_propagation";
  return "eligible_for_human_outcome_decision";
}

function inspectAlternative(register, fixture) {
  if (fixture.requested_action === "auto_none") return "rejected_automatic_none";
  if (!fixture.eligible_packet) return "empty_no_eligible_claim_packet";
  if (fixture.cohort_id !== register.cohort_id) return "rejected_identity_or_scope";
  if (fixture.applicability === null || fixture.applicability === undefined) return "held_missing_applicability";
  if (fixture.silence_as_none) return "rejected_silence_as_none";
  if (fixture.applicability === true && !fixture.evidence_basis_present) return "held_missing_evidence_basis";
  if (fixture.applicability === false && !fixture.not_applicable_basis) return "rejected_unsupported_not_applicable";
  if (!fixture.adverse_evidence_visible) return "held_hidden_adverse_evidence";
  if (!fixture.uncertainty_complete) return "held_missing_uncertainty";
  if (!fixture.disposition_complete) return "held_missing_disposition";
  if (fixture.propagation_status !== "complete") return "held_incomplete_propagation";
  return "eligible_for_human_alternative_decision";
}

function inspectDesign(docket, fixture) {
  if (fixture.requested_action === "auto_select") return "rejected_automatic_design_selection";
  if (fixture.requested_action === "inspect_result" && !fixture.registered) return "rejected_result_inspection_before_registration";
  if (!fixture.eligible_causal_proposal) return "inactive_no_causal_claim";
  if (fixture.cohort_id !== docket.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.causal_question || !fixture.intervention_definition) return "held_missing_question_or_intervention";
  if (!fixture.treatment_unit || !fixture.eligible_population) return "held_missing_unit_or_population";
  if (!fixture.outcome_definition || !fixture.estimand) return "held_missing_outcome_or_estimand";
  if (!fixture.baseline_complete || !fixture.comparison_complete) return "held_missing_baseline_or_comparison";
  if (!fixture.identification_assumptions_complete) return "held_missing_identification_assumptions";
  if (!fixture.spillovers_complete || !fixture.confounding_complete) return "held_missing_spillover_or_confounding_plan";
  if (!fixture.missing_data_plan) return "held_missing_data_plan";
  if (!fixture.falsification_complete) return "held_missing_falsification_plan";
  if (!fixture.power_and_sensitivity_complete) return "held_missing_power_or_sensitivity";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "held_registration_control_failure";
  return "eligible_for_human_design_registration";
}

let packetCases = 0;
for (const packet of registry.outcome_evidence_packets) {
  const panel = { eligible: true, panel_id: packet.panel_id, cohort_id: packet.cohort_id, measure_id: packet.measure_id };
  const complete = { panel, outcome_question: "synthetic bounded question", claim_class_id: "72-CLASS-03-CHANGE", verb_strength_exceeds_class: false, calculation_complete: true, timing_complete: true, adverse_evidence_visible: true, alternatives_complete: true, uncertainty_complete: true, reproducibility_complete: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", requested_action: "review" };
  const cases = [
    ["no_panel", { ...complete, panel: null }, "empty_no_eligible_panel"],
    ["wrong_panel", { ...complete, panel: { ...panel, panel_id: "wrong" } }, "rejected_identity_or_scope"],
    ["missing_question", { ...complete, outcome_question: null }, "held_missing_outcome_question"],
    ["unknown_class", { ...complete, claim_class_id: "wrong" }, "held_unclassified_claim"],
    ["strong_verb", { ...complete, verb_strength_exceeds_class: true }, "rejected_claim_strength"],
    ["missing_calculation", { ...complete, calculation_complete: false }, "held_incomplete_calculation_or_timing"],
    ["missing_timing", { ...complete, timing_complete: false }, "held_incomplete_calculation_or_timing"],
    ["hidden_adverse", { ...complete, adverse_evidence_visible: false }, "held_hidden_adverse_evidence"],
    ["missing_alternatives", { ...complete, alternatives_complete: false }, "held_incomplete_alternative_assessment"],
    ["missing_uncertainty", { ...complete, uncertainty_complete: false }, "held_missing_uncertainty"],
    ["missing_reproducibility", { ...complete, reproducibility_complete: false }, "held_missing_reproducibility"],
    ["same_reviewer", { ...complete, second_reviewer_id: "reviewer-a" }, "rejected_non_independent_review"],
    ["incomplete_propagation", { ...complete, propagation_status: "partial" }, "held_incomplete_propagation"],
    ["automatic_publish", { ...complete, requested_action: "auto_publish" }, "rejected_automatic_publication"]
  ];
  cases.push(["complete", complete, "eligible_for_human_outcome_decision"]);
  for (const [name, fixture, expected] of cases) {
    packetCases += 1;
    check(inspectPacket(packet, fixture) === expected, `${packet.evidence_packet_id} failed ${name}.`);
  }
}

let alternativeCases = 0;
for (const register of registry.alternative_explanation_registers) {
  const complete = { eligible_packet: true, cohort_id: register.cohort_id, applicability: true, silence_as_none: false, evidence_basis_present: true, not_applicable_basis: null, adverse_evidence_visible: true, uncertainty_complete: true, disposition_complete: true, propagation_status: "complete", requested_action: "review" };
  const cases = [
    ["no_packet", { ...complete, eligible_packet: false }, "empty_no_eligible_claim_packet"],
    ["wrong_cohort", { ...complete, cohort_id: "wrong" }, "rejected_identity_or_scope"],
    ["missing_applicability", { ...complete, applicability: null }, "held_missing_applicability"],
    ["silence_as_none", { ...complete, silence_as_none: true }, "rejected_silence_as_none"],
    ["missing_basis", { ...complete, evidence_basis_present: false }, "held_missing_evidence_basis"],
    ["unsupported_na", { ...complete, applicability: false, not_applicable_basis: null }, "rejected_unsupported_not_applicable"],
    ["hidden_adverse", { ...complete, adverse_evidence_visible: false }, "held_hidden_adverse_evidence"],
    ["missing_uncertainty", { ...complete, uncertainty_complete: false }, "held_missing_uncertainty"],
    ["missing_disposition", { ...complete, disposition_complete: false }, "held_missing_disposition"],
    ["incomplete_propagation", { ...complete, propagation_status: "partial" }, "held_incomplete_propagation"],
    ["automatic_none", { ...complete, requested_action: "auto_none" }, "rejected_automatic_none"],
    ["complete", complete, "eligible_for_human_alternative_decision"]
  ];
  for (const [name, fixture, expected] of cases) {
    alternativeCases += 1;
    check(inspectAlternative(register, fixture) === expected, `${register.alternative_register_id} failed ${name}.`);
  }
}

let designCases = 0;
for (const docket of registry.counterfactual_design_dockets) {
  const complete = { eligible_causal_proposal: true, cohort_id: docket.cohort_id, causal_question: "synthetic causal question", intervention_definition: "synthetic intervention", treatment_unit: "synthetic unit", eligible_population: "synthetic population", outcome_definition: "synthetic outcome", estimand: "synthetic estimand", baseline_complete: true, comparison_complete: true, identification_assumptions_complete: true, spillovers_complete: true, confounding_complete: true, missing_data_plan: "synthetic plan", falsification_complete: true, power_and_sensitivity_complete: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", requested_action: "review", registered: false };
  const cases = [
    ["no_proposal", { ...complete, eligible_causal_proposal: false }, "inactive_no_causal_claim"],
    ["wrong_cohort", { ...complete, cohort_id: "wrong" }, "rejected_identity_or_scope"],
    ["missing_question", { ...complete, causal_question: null }, "held_missing_question_or_intervention"],
    ["missing_unit", { ...complete, treatment_unit: null }, "held_missing_unit_or_population"],
    ["missing_estimand", { ...complete, estimand: null }, "held_missing_outcome_or_estimand"],
    ["missing_baseline", { ...complete, baseline_complete: false }, "held_missing_baseline_or_comparison"],
    ["missing_identification", { ...complete, identification_assumptions_complete: false }, "held_missing_identification_assumptions"],
    ["missing_spillover", { ...complete, spillovers_complete: false }, "held_missing_spillover_or_confounding_plan"],
    ["missing_data", { ...complete, missing_data_plan: null }, "held_missing_data_plan"],
    ["missing_falsification", { ...complete, falsification_complete: false }, "held_missing_falsification_plan"],
    ["missing_power", { ...complete, power_and_sensitivity_complete: false }, "held_missing_power_or_sensitivity"],
    ["same_reviewer", { ...complete, second_reviewer_id: "reviewer-a" }, "held_registration_control_failure"],
    ["inspect_before_registration", { ...complete, requested_action: "inspect_result", registered: false }, "rejected_result_inspection_before_registration"],
    ["automatic_selection", { ...complete, requested_action: "auto_select" }, "rejected_automatic_design_selection"],
    ["complete", complete, "eligible_for_human_design_registration"]
  ];
  for (const [name, fixture, expected] of cases) {
    designCases += 1;
    check(inspectDesign(docket, fixture) === expected, `${docket.counterfactual_docket_id} failed ${name}.`);
  }
}

check(packetCases === 480, `Expected 480 packet cases, found ${packetCases}.`);
check(alternativeCases === 96, `Expected 96 alternative cases, found ${alternativeCases}.`);
check(designCases === 120, `Expected 120 design cases, found ${designCases}.`);
check(registry.metrics.eligible_panels_received === 0 && registry.metrics.submitted_outcome_packets === 0 && registry.metrics.assessed_alternative_explanations === 0 && registry.metrics.registered_counterfactual_designs === 0 && registry.metrics.inspected_results === 0 && registry.metrics.published_claims === 0 && registry.metrics.causal_claims_published === 0 && registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0, "The synthetic harness must not mutate real state.");

if (failures.length) {
  console.error("Phase 72 synthetic harness failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1);
}

console.log("Phase 72 synthetic harness passed: 480 outcome-packet cases, 96 alternative-explanation cases, and 120 counterfactual-design cases, 696 total, with no real panel eligibility, claim, assessment, design, result, receipt, score, or ranking created.");
