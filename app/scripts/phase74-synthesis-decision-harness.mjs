import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-74-evidence-synthesis-challenge-decision-translation-registry.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const mutate = (base, values) => ({ ...base, ...values });

function inspectInput(docket, fixture) {
  if (!fixture.adjudicated_result) return "inactive_no_adjudicated_result";
  if (fixture.cohort_id !== docket.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.current_lineage) return "held_missing_current_result_lineage";
  if (!fixture.question_population_setting) return "held_missing_question_population_setting";
  if (!fixture.measure_estimand_scale) return "rejected_measure_or_estimand_mismatch";
  if (!fixture.intervention_comparison) return "held_missing_intervention_or_comparison";
  if (!fixture.period_followup) return "held_missing_time_basis";
  if (!fixture.design_identification) return "held_missing_design_or_identification";
  if (!fixture.provenance_independence) return "held_unresolved_shared_provenance";
  if (!fixture.uncertainty_magnitude) return "held_missing_uncertainty";
  if (!fixture.deviation_lineage) return "held_missing_deviation_lineage";
  if (!fixture.robustness_falsification) return "held_missing_robustness_or_falsification";
  if (!fixture.adverse_null_complete) return "held_missing_adverse_or_null_evidence";
  if (!fixture.replication_record) return "held_missing_replication_record";
  if (!fixture.claim_correction_ready) return "held_missing_claim_or_correction_lineage";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_input_review_control";
  if (fixture.automatic_grade || fixture.automatic_pooling || fixture.automatic_upgrade) return "rejected_automatic_synthesis_action";
  return "eligible_for_human_synthesis_input_decision";
}

function inspectSynthesis(dossier, fixture) {
  if (fixture.eligible_result_ids.length < 2) return "inactive_fewer_than_two_eligible_results";
  if (fixture.cohort_id !== dossier.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.protocol_registered) return "held_unregistered_synthesis_protocol";
  if (!fixture.complete_result_set) return "held_incomplete_result_set";
  if (!fixture.independence_mapped) return "held_unresolved_independence";
  if (!fixture.compatibility_resolved) return "held_incompatible_measures_or_estimands";
  if (!fixture.design_limits) return "held_missing_design_limits";
  if (!fixture.direction_consistency) return "held_missing_direction_assessment";
  if (!fixture.magnitude_importance) return "held_missing_magnitude_assessment";
  if (!fixture.uncertainty_complete) return "held_missing_body_uncertainty";
  if (!fixture.heterogeneity_transfer) return "held_missing_heterogeneity_or_transfer";
  if (!fixture.adverse_omitted_complete) return "held_missing_adverse_or_omitted_evidence";
  if (!fixture.bias_correction_complete) return "held_missing_bias_or_correction_review";
  if (!fixture.triangulation_replication) return "held_missing_triangulation_or_replication";
  if (!registry.evidence_grade_classes.some((grade) => grade.evidence_grade_id === fixture.evidence_grade_id)) return "rejected_unknown_evidence_grade";
  if (!fixture.language_bounded) return "rejected_synthesis_language_overreach";
  if (!fixture.contradictions_resolved_or_visible) return "held_hidden_or_unresolved_contradiction";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_synthesis_review_control";
  if (fixture.automatic_pooling || fixture.automatic_grade || fixture.automatic_publication || fixture.automatic_recommendation || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_synthesis_action";
  return "eligible_for_human_synthesis_adjudication";
}

function inspectChallenge(docket, fixture) {
  if (!fixture.synthesis_claim) return "inactive_no_synthesis_claim";
  if (fixture.cohort_id !== docket.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.identity_disclosure) return "held_missing_identity_or_disclosure";
  if (!fixture.exact_claim_version) return "held_missing_claim_version";
  if (!fixture.scope_bounded) return "held_unbounded_challenge_scope";
  if (!fixture.cited_evidence) return "held_missing_evidence_provenance";
  if (!fixture.reproducible_critique) return "held_nonreproducible_critique";
  if (!fixture.method_assumption_review) return "held_missing_method_or_assumption_review";
  if (!fixture.omitted_adverse_review) return "held_missing_omission_review";
  if (!fixture.point_response) return "held_missing_public_response";
  if (!fixture.independent_adjudication) return "held_missing_independent_adjudication";
  if (!fixture.revision_decision_notice) return "held_missing_revision_or_notice";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_challenge_review_control";
  if (fixture.anonymous_as_evidence || fixture.automatic_reversal || fixture.automatic_publication || fixture.silent_disposition) return "rejected_automatic_or_silent_challenge_action";
  return "eligible_for_human_challenge_disposition";
}

function inspectTranslation(register, fixture) {
  if (!fixture.adjudicated_synthesis) return "inactive_no_adjudicated_synthesis";
  if (fixture.cohort_id !== register.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.audience_authority) return "held_missing_audience_or_authority";
  if (!fixture.decision_question) return "held_missing_decision_question";
  if (!fixture.current_synthesis_grade) return "held_missing_current_synthesis_or_grade";
  if (!fixture.options_and_status_quo) return "held_missing_options_or_status_quo";
  if (!fixture.benefits) return "held_missing_benefit_record";
  if (!fixture.harms) return "held_missing_harm_record";
  if (!fixture.distribution_equity) return "held_missing_distribution_or_equity";
  if (!fixture.feasibility_capacity_cost) return "held_missing_feasibility_or_capacity";
  if (!fixture.uncertainty_scenarios) return "held_missing_uncertainty_scenarios";
  if (!fixture.reversibility_safeguards) return "held_missing_reversibility_or_safeguards";
  if (!fixture.legal_policy_authority) return "held_missing_legal_or_policy_authority";
  if (!fixture.conflicts_dissent) return "held_missing_conflict_or_dissent_record";
  if (!fixture.monitoring_sunset_reevaluation) return "held_missing_monitoring_sunset_or_reevaluation";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_translation_review_control";
  if (fixture.automatic_recommendation || fixture.automatic_adoption || fixture.automatic_sunset_extension || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_decision_action";
  return "eligible_for_human_decision_translation";
}

const inputOutcomes = new Set();
let inputCases = 0;
for (const docket of registry.result_synthesis_input_dockets) {
  const base = {
    adjudicated_result: true, cohort_id: docket.cohort_id, current_lineage: true, question_population_setting: true,
    measure_estimand_scale: true, intervention_comparison: true, period_followup: true, design_identification: true,
    provenance_independence: true, uncertainty_magnitude: true, deviation_lineage: true, robustness_falsification: true,
    adverse_null_complete: true, replication_record: true, claim_correction_ready: true,
    first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete",
    automatic_grade: false, automatic_pooling: false, automatic_upgrade: false
  };
  const cases = [
    mutate(base, { adjudicated_result: false }), mutate(base, { cohort_id: "wrong" }), mutate(base, { current_lineage: false }),
    mutate(base, { question_population_setting: false }), mutate(base, { measure_estimand_scale: false }), mutate(base, { intervention_comparison: false }),
    mutate(base, { period_followup: false }), mutate(base, { design_identification: false }), mutate(base, { provenance_independence: false }),
    mutate(base, { uncertainty_magnitude: false }), mutate(base, { deviation_lineage: false }), mutate(base, { robustness_falsification: false }),
    mutate(base, { adverse_null_complete: false }), mutate(base, { replication_record: false }), mutate(base, { claim_correction_ready: false }),
    mutate(base, { second_reviewer_id: "reviewer-a" }), mutate(base, { automatic_grade: true }), base
  ];
  for (const fixture of cases) { inputOutcomes.add(inspectInput(docket, fixture)); inputCases += 1; }
}

const synthesisOutcomes = new Set();
let synthesisCases = 0;
for (const dossier of registry.synthesis_contradiction_dossiers) {
  const base = {
    eligible_result_ids: ["result-a", "result-b"], cohort_id: dossier.cohort_id, protocol_registered: true, complete_result_set: true,
    independence_mapped: true, compatibility_resolved: true, design_limits: true, direction_consistency: true,
    magnitude_importance: true, uncertainty_complete: true, heterogeneity_transfer: true, adverse_omitted_complete: true,
    bias_correction_complete: true, triangulation_replication: true, evidence_grade_id: "74-GRADE-02-MIXED", language_bounded: true,
    contradictions_resolved_or_visible: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete",
    automatic_pooling: false, automatic_grade: false, automatic_publication: false, automatic_recommendation: false, automatic_score: false, automatic_rank: false
  };
  const cases = [
    mutate(base, { eligible_result_ids: ["result-a"] }), mutate(base, { cohort_id: "wrong" }), mutate(base, { protocol_registered: false }),
    mutate(base, { complete_result_set: false }), mutate(base, { independence_mapped: false }), mutate(base, { compatibility_resolved: false }),
    mutate(base, { design_limits: false }), mutate(base, { direction_consistency: false }), mutate(base, { magnitude_importance: false }),
    mutate(base, { uncertainty_complete: false }), mutate(base, { heterogeneity_transfer: false }), mutate(base, { adverse_omitted_complete: false }),
    mutate(base, { bias_correction_complete: false }), mutate(base, { triangulation_replication: false }), mutate(base, { evidence_grade_id: "unknown" }),
    mutate(base, { language_bounded: false }), mutate(base, { contradictions_resolved_or_visible: false }), mutate(base, { second_reviewer_id: "reviewer-a" }),
    mutate(base, { automatic_recommendation: true }), base
  ];
  for (const fixture of cases) { synthesisOutcomes.add(inspectSynthesis(dossier, fixture)); synthesisCases += 1; }
}

const challengeOutcomes = new Set();
let challengeCases = 0;
for (const docket of registry.external_challenge_response_dockets) {
  const base = {
    synthesis_claim: true, cohort_id: docket.cohort_id, identity_disclosure: true, exact_claim_version: true, scope_bounded: true,
    cited_evidence: true, reproducible_critique: true, method_assumption_review: true, omitted_adverse_review: true,
    point_response: true, independent_adjudication: true, revision_decision_notice: true,
    first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete",
    anonymous_as_evidence: false, automatic_reversal: false, automatic_publication: false, silent_disposition: false
  };
  const cases = [
    mutate(base, { synthesis_claim: false }), mutate(base, { cohort_id: "wrong" }), mutate(base, { identity_disclosure: false }),
    mutate(base, { exact_claim_version: false }), mutate(base, { scope_bounded: false }), mutate(base, { cited_evidence: false }),
    mutate(base, { reproducible_critique: false }), mutate(base, { method_assumption_review: false }), mutate(base, { omitted_adverse_review: false }),
    mutate(base, { point_response: false }), mutate(base, { independent_adjudication: false }), mutate(base, { revision_decision_notice: false }),
    mutate(base, { second_reviewer_id: "reviewer-a" }), mutate(base, { silent_disposition: true }), base
  ];
  for (const fixture of cases) { challengeOutcomes.add(inspectChallenge(docket, fixture)); challengeCases += 1; }
}

const translationOutcomes = new Set();
let translationCases = 0;
for (const register of registry.decision_translation_reevaluation_registers) {
  const base = {
    adjudicated_synthesis: true, cohort_id: register.cohort_id, audience_authority: true, decision_question: true,
    current_synthesis_grade: true, options_and_status_quo: true, benefits: true, harms: true, distribution_equity: true,
    feasibility_capacity_cost: true, uncertainty_scenarios: true, reversibility_safeguards: true, legal_policy_authority: true,
    conflicts_dissent: true, monitoring_sunset_reevaluation: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b",
    propagation_status: "complete", automatic_recommendation: false, automatic_adoption: false, automatic_sunset_extension: false,
    automatic_score: false, automatic_rank: false
  };
  const cases = [
    mutate(base, { adjudicated_synthesis: false }), mutate(base, { cohort_id: "wrong" }), mutate(base, { audience_authority: false }),
    mutate(base, { decision_question: false }), mutate(base, { current_synthesis_grade: false }), mutate(base, { options_and_status_quo: false }),
    mutate(base, { benefits: false }), mutate(base, { harms: false }), mutate(base, { distribution_equity: false }),
    mutate(base, { feasibility_capacity_cost: false }), mutate(base, { uncertainty_scenarios: false }), mutate(base, { reversibility_safeguards: false }),
    mutate(base, { legal_policy_authority: false }), mutate(base, { conflicts_dissent: false }), mutate(base, { monitoring_sunset_reevaluation: false }),
    mutate(base, { second_reviewer_id: "reviewer-a" }), mutate(base, { automatic_adoption: true }), base
  ];
  for (const fixture of cases) { translationOutcomes.add(inspectTranslation(register, fixture)); translationCases += 1; }
}

check(inputCases === 576 && inputOutcomes.size === 18, `Expected 576 input cases and 18 outcomes; received ${inputCases} and ${inputOutcomes.size}.`);
check(synthesisCases === 160 && synthesisOutcomes.size === 20, `Expected 160 synthesis cases and 20 outcomes; received ${synthesisCases} and ${synthesisOutcomes.size}.`);
check(challengeCases === 120 && challengeOutcomes.size === 15, `Expected 120 challenge cases and 15 outcomes; received ${challengeCases} and ${challengeOutcomes.size}.`);
check(translationCases === 144 && translationOutcomes.size === 18, `Expected 144 translation cases and 18 outcomes; received ${translationCases} and ${translationOutcomes.size}.`);

check(registry.result_synthesis_input_dockets.every((record) => record.input_state === "Inactive - No Adjudicated Result" && record.eligible_for_synthesis === false), "The harness must not mutate inactive input state.");
check(registry.synthesis_contradiction_dossiers.every((record) => record.synthesis_state === "Inactive - No Eligible Results" && record.selected_evidence_grade_id === null), "The harness must not mutate synthesis state or grades.");
check(registry.external_challenge_response_dockets.every((record) => record.challenge_state === "Inactive - No Synthesis Claim"), "The harness must not open a challenge.");
check(registry.decision_translation_reevaluation_registers.every((record) => record.translation_state === "Inactive - No Adjudicated Synthesis" && record.proposed_recommendation === null), "The harness must not create a recommendation.");

if (failures.length) {
  console.error("Phase 74 harness failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1);
}

const totalCases = inputCases + synthesisCases + challengeCases + translationCases;
console.log(`Phase 74 harness passed: ${totalCases} synthetic cases (${inputCases} input, ${synthesisCases} synthesis, ${challengeCases} challenge, ${translationCases} translation) with no registry mutation, synthesis, grade, recommendation, authorization, score, rank, receipt, or stage change.`);
