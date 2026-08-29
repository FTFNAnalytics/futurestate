import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-73-analysis-execution-result-adjudication-registry.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function inspectExecution(docket, fixture) {
  if (!fixture.registered_design) return "inactive_no_registered_design";
  if (fixture.cohort_id !== docket.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.input_snapshot) return "held_missing_frozen_input";
  if (!fixture.code_commit) return "held_missing_code_identity";
  if (!fixture.environment_digest) return "held_missing_environment_identity";
  if (!fixture.plan_matches_design) return "rejected_plan_or_estimand_mismatch";
  if (!fixture.seed_commitment) return "held_missing_randomness_commitment";
  if (!fixture.authorized_runner) return "rejected_runner_authority";
  if (!fixture.preflight_passed) return "held_preflight_failure";
  if (!fixture.blinding_complete) return "rejected_blinding_control";
  if (!fixture.immutable_log_ready) return "held_missing_execution_log";
  if (!fixture.output_manifest_ready) return "held_missing_output_manifest";
  if (!fixture.deviation_capture_ready) return "held_missing_deviation_capture";
  if (!fixture.replication_ready) return "held_missing_replication_path";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_execution_control";
  if (fixture.requested_action === "inspect_result" && !fixture.execution_authorized) return "rejected_result_inspection_before_authorization";
  return "eligible_for_human_execution_authorization";
}

function inspectDeviation(register, fixture) {
  if (!fixture.authorized_execution) return "empty_no_authorized_execution";
  if (fixture.cohort_id !== register.cohort_id) return "rejected_identity_or_scope";
  if (fixture.deviation_detected === null) return "held_missing_detection_decision";
  if (fixture.silence_as_none) return "rejected_silence_as_none";
  if (!fixture.discovery_stage) return "held_missing_discovery_stage";
  if (!fixture.materiality) return "held_missing_materiality";
  if (fixture.deviation_detected && !fixture.description) return "held_missing_deviation_description";
  if (fixture.deviation_detected && !fixture.impact_on_estimand) return "held_missing_estimand_impact";
  if (fixture.discovery_stage === "post_result" && !fixture.amendment_artifact_id) return "held_post_result_change_without_amendment";
  if (!fixture.reviewer_disposition) return "held_missing_reviewer_disposition";
  if (fixture.requested_action === "auto_waive") return "rejected_automatic_waiver";
  return "eligible_for_human_deviation_decision";
}

function inspectAdjudication(docket, fixture) {
  if (!fixture.authorized_result) return "inactive_no_blinded_result";
  if (fixture.cohort_id !== docket.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.blind_break_authorized) return "rejected_unauthorized_unblinding";
  if (!fixture.primary_matches_estimand) return "rejected_primary_estimand_mismatch";
  if (!fixture.uncertainty_complete) return "held_missing_uncertainty";
  if (!fixture.robustness_complete) return "held_incomplete_robustness";
  if (!fixture.falsification_complete) return "held_incomplete_falsification";
  if (!fixture.adverse_results_visible) return "held_hidden_adverse_or_null_results";
  if (!fixture.multiplicity_complete) return "held_missing_multiplicity_control";
  if (!fixture.deviations_complete) return "held_incomplete_deviation_review";
  if (!fixture.replication_complete) return "held_missing_independent_replication";
  if (!fixture.alternatives_complete) return "held_incomplete_alternative_review";
  if (fixture.claim_strength_exceeds_evidence) return "rejected_claim_strength";
  if (!fixture.correction_ready) return "held_missing_correction_readiness";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_adjudication_control";
  if (fixture.requested_action === "auto_publish") return "rejected_automatic_publication";
  return "eligible_for_human_result_adjudication";
}

function inspectCorrection(register, fixture) {
  if (!fixture.published_result) return "empty_no_published_result";
  if (fixture.cohort_id !== register.cohort_id) return "rejected_identity_or_scope";
  if (fixture.silent_correction) return "rejected_silent_correction";
  if (!fixture.correction_class) return "held_missing_correction_class";
  if (!fixture.lineage_complete) return "held_missing_public_lineage";
  if (!fixture.reader_notice_complete) return "held_missing_reader_notice";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id) return "rejected_non_independent_review";
  if (fixture.propagation_status !== "complete") return "held_incomplete_propagation";
  if (fixture.requested_action === "auto_withdraw") return "rejected_automatic_withdrawal";
  return "eligible_for_human_correction_or_withdrawal_decision";
}

let executionCases = 0;
for (const docket of registry.analysis_execution_dockets) {
  const complete = { registered_design: true, cohort_id: docket.cohort_id, input_snapshot: "snapshot", code_commit: "commit", environment_digest: "digest", plan_matches_design: true, seed_commitment: "seed", authorized_runner: true, preflight_passed: true, blinding_complete: true, immutable_log_ready: true, output_manifest_ready: true, deviation_capture_ready: true, replication_ready: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", requested_action: "authorize", execution_authorized: false };
  const cases = [
    ["no_design", { ...complete, registered_design: false }, "inactive_no_registered_design"],
    ["wrong_cohort", { ...complete, cohort_id: "wrong" }, "rejected_identity_or_scope"],
    ["missing_input", { ...complete, input_snapshot: null }, "held_missing_frozen_input"],
    ["missing_code", { ...complete, code_commit: null }, "held_missing_code_identity"],
    ["missing_environment", { ...complete, environment_digest: null }, "held_missing_environment_identity"],
    ["plan_mismatch", { ...complete, plan_matches_design: false }, "rejected_plan_or_estimand_mismatch"],
    ["missing_seed", { ...complete, seed_commitment: null }, "held_missing_randomness_commitment"],
    ["unauthorized_runner", { ...complete, authorized_runner: false }, "rejected_runner_authority"],
    ["preflight_failure", { ...complete, preflight_passed: false }, "held_preflight_failure"],
    ["blinding_failure", { ...complete, blinding_complete: false }, "rejected_blinding_control"],
    ["missing_log", { ...complete, immutable_log_ready: false }, "held_missing_execution_log"],
    ["missing_output_manifest", { ...complete, output_manifest_ready: false }, "held_missing_output_manifest"],
    ["missing_deviation_capture", { ...complete, deviation_capture_ready: false }, "held_missing_deviation_capture"],
    ["missing_replication", { ...complete, replication_ready: false }, "held_missing_replication_path"],
    ["same_reviewer", { ...complete, second_reviewer_id: "reviewer-a" }, "rejected_execution_control"],
    ["inspect_before_authorization", { ...complete, requested_action: "inspect_result", execution_authorized: false }, "rejected_result_inspection_before_authorization"],
    ["complete", complete, "eligible_for_human_execution_authorization"]
  ];
  for (const [name, fixture, expected] of cases) { executionCases += 1; check(inspectExecution(docket, fixture) === expected, `${docket.analysis_execution_docket_id} failed ${name}.`); }
}

let deviationCases = 0;
for (const register of registry.protocol_deviation_registers) {
  const complete = { authorized_execution: true, cohort_id: register.cohort_id, deviation_detected: true, silence_as_none: false, discovery_stage: "pre_interpretation", materiality: "bounded", description: "synthetic deviation", impact_on_estimand: "synthetic impact", amendment_artifact_id: "synthetic amendment", reviewer_disposition: "review", requested_action: "review" };
  const cases = [
    ["no_execution", { ...complete, authorized_execution: false }, "empty_no_authorized_execution"],
    ["wrong_cohort", { ...complete, cohort_id: "wrong" }, "rejected_identity_or_scope"],
    ["missing_detection", { ...complete, deviation_detected: null }, "held_missing_detection_decision"],
    ["silence_none", { ...complete, silence_as_none: true }, "rejected_silence_as_none"],
    ["missing_stage", { ...complete, discovery_stage: null }, "held_missing_discovery_stage"],
    ["missing_materiality", { ...complete, materiality: null }, "held_missing_materiality"],
    ["missing_description", { ...complete, description: null }, "held_missing_deviation_description"],
    ["missing_impact", { ...complete, impact_on_estimand: null }, "held_missing_estimand_impact"],
    ["post_result_no_amendment", { ...complete, discovery_stage: "post_result", amendment_artifact_id: null }, "held_post_result_change_without_amendment"],
    ["missing_disposition", { ...complete, reviewer_disposition: null }, "held_missing_reviewer_disposition"],
    ["automatic_waiver", { ...complete, requested_action: "auto_waive" }, "rejected_automatic_waiver"],
    ["complete", complete, "eligible_for_human_deviation_decision"]
  ];
  for (const [name, fixture, expected] of cases) { deviationCases += 1; check(inspectDeviation(register, fixture) === expected, `${register.protocol_deviation_register_id} failed ${name}.`); }
}

let adjudicationCases = 0;
for (const docket of registry.result_adjudication_dockets) {
  const complete = { authorized_result: true, cohort_id: docket.cohort_id, blind_break_authorized: true, primary_matches_estimand: true, uncertainty_complete: true, robustness_complete: true, falsification_complete: true, adverse_results_visible: true, multiplicity_complete: true, deviations_complete: true, replication_complete: true, alternatives_complete: true, claim_strength_exceeds_evidence: false, correction_ready: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", requested_action: "review" };
  const cases = [
    ["no_result", { ...complete, authorized_result: false }, "inactive_no_blinded_result"],
    ["wrong_cohort", { ...complete, cohort_id: "wrong" }, "rejected_identity_or_scope"],
    ["unauthorized_unblinding", { ...complete, blind_break_authorized: false }, "rejected_unauthorized_unblinding"],
    ["primary_mismatch", { ...complete, primary_matches_estimand: false }, "rejected_primary_estimand_mismatch"],
    ["missing_uncertainty", { ...complete, uncertainty_complete: false }, "held_missing_uncertainty"],
    ["missing_robustness", { ...complete, robustness_complete: false }, "held_incomplete_robustness"],
    ["missing_falsification", { ...complete, falsification_complete: false }, "held_incomplete_falsification"],
    ["hidden_adverse", { ...complete, adverse_results_visible: false }, "held_hidden_adverse_or_null_results"],
    ["missing_multiplicity", { ...complete, multiplicity_complete: false }, "held_missing_multiplicity_control"],
    ["missing_deviations", { ...complete, deviations_complete: false }, "held_incomplete_deviation_review"],
    ["missing_replication", { ...complete, replication_complete: false }, "held_missing_independent_replication"],
    ["missing_alternatives", { ...complete, alternatives_complete: false }, "held_incomplete_alternative_review"],
    ["claim_overreach", { ...complete, claim_strength_exceeds_evidence: true }, "rejected_claim_strength"],
    ["correction_unready", { ...complete, correction_ready: false }, "held_missing_correction_readiness"],
    ["same_reviewer", { ...complete, second_reviewer_id: "reviewer-a" }, "rejected_adjudication_control"],
    ["automatic_publish", { ...complete, requested_action: "auto_publish" }, "rejected_automatic_publication"],
    ["complete", complete, "eligible_for_human_result_adjudication"]
  ];
  for (const [name, fixture, expected] of cases) { adjudicationCases += 1; check(inspectAdjudication(docket, fixture) === expected, `${docket.result_adjudication_docket_id} failed ${name}.`); }
}

let correctionCases = 0;
for (const register of registry.correction_withdrawal_registers) {
  const complete = { published_result: true, cohort_id: register.cohort_id, silent_correction: false, correction_class: "synthetic class", lineage_complete: true, reader_notice_complete: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", requested_action: "review" };
  const cases = [
    ["no_result", { ...complete, published_result: false }, "empty_no_published_result"],
    ["wrong_cohort", { ...complete, cohort_id: "wrong" }, "rejected_identity_or_scope"],
    ["silent_correction", { ...complete, silent_correction: true }, "rejected_silent_correction"],
    ["missing_class", { ...complete, correction_class: null }, "held_missing_correction_class"],
    ["missing_lineage", { ...complete, lineage_complete: false }, "held_missing_public_lineage"],
    ["missing_notice", { ...complete, reader_notice_complete: false }, "held_missing_reader_notice"],
    ["same_reviewer", { ...complete, second_reviewer_id: "reviewer-a" }, "rejected_non_independent_review"],
    ["incomplete_propagation", { ...complete, propagation_status: "partial" }, "held_incomplete_propagation"],
    ["automatic_withdrawal", { ...complete, requested_action: "auto_withdraw" }, "rejected_automatic_withdrawal"],
    ["complete", complete, "eligible_for_human_correction_or_withdrawal_decision"]
  ];
  for (const [name, fixture, expected] of cases) { correctionCases += 1; check(inspectCorrection(register, fixture) === expected, `${register.correction_withdrawal_register_id} failed ${name}.`); }
}

check(executionCases === 544, `Expected 544 execution cases, found ${executionCases}.`);
check(deviationCases === 96, `Expected 96 deviation cases, found ${deviationCases}.`);
check(adjudicationCases === 136, `Expected 136 adjudication cases, found ${adjudicationCases}.`);
check(correctionCases === 80, `Expected 80 correction cases, found ${correctionCases}.`);
check(registry.metrics.registered_designs_received === 0 && registry.metrics.executions_authorized === 0 && registry.metrics.executions_completed === 0 && registry.metrics.deviations_recorded === 0 && registry.metrics.results_unblinded === 0 && registry.metrics.results_adjudicated === 0 && registry.metrics.independent_replications_completed === 0 && registry.metrics.claims_published === 0 && registry.metrics.corrections_issued === 0 && registry.metrics.withdrawals_issued === 0 && registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0, "The synthetic harness must not mutate real state.");

if (failures.length) {
  console.error("Phase 73 synthetic harness failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1);
}

console.log("Phase 73 synthetic harness passed: 544 execution cases, 96 deviation cases, 136 result-adjudication cases, and 80 correction-withdrawal cases, 856 total, with no real design receipt, execution, result, deviation, replication, claim, correction, withdrawal, score, or ranking created.");
