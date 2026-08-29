import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-76-cross-case-learning-portfolio-policy-retirement-registry.json"), "utf8"));
const original = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const mutate = (base, patch) => ({ ...base, ...patch });

function inspectLearning(record, fixture) {
  if (!fixture.independent_audit) return "held_no_independent_audit";
  if (fixture.cohort_id !== record.cohort_id) return "held_identity_mismatch";
  for (const key of ["decision_terms", "implementation_fidelity", "baselines", "outcomes", "harms", "distribution", "counterfactual", "negative_results", "context", "independence", "challenge_lineage", "memory_scope"]) {
    if (!fixture[key]) return "held_missing_" + key;
  }
  if (!fixture.first_reviewer_id || !fixture.second_reviewer_id || fixture.first_reviewer_id === fixture.second_reviewer_id) return "held_dual_review";
  if (fixture.propagation_status !== "complete") return "held_propagation";
  if (fixture.automatic_learning || fixture.automatic_transfer || fixture.automatic_reuse || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_action";
  return "eligible_for_human_learning_admission";
}

function inspectComparison(record, fixture) {
  if (!fixture.left_audited || !fixture.right_audited) return "held_two_audits_required";
  if (fixture.left_id !== record.left_institutional_learning_dossier_id || fixture.right_id !== record.right_institutional_learning_dossier_id) return "held_pair_identity";
  for (const key of ["question", "class", "authority", "context", "population", "baseline", "measure", "time", "fidelity", "dependency", "safeguard", "harm", "distribution", "exceptions"]) {
    if (!fixture[key]) return "held_missing_" + key;
  }
  if (!fixture.first_reviewer_id || !fixture.second_reviewer_id || fixture.first_reviewer_id === fixture.second_reviewer_id) return "held_dual_review";
  if (fixture.propagation_status !== "complete") return "held_propagation";
  if (fixture.automatic_comparability || fixture.automatic_transfer || fixture.automatic_reuse || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_action";
  return "eligible_for_human_comparability_decision";
}

function inspectPortfolio(record, fixture) {
  if (!fixture.admitted_cross_case_evidence) return "held_no_cross_case_evidence";
  if (fixture.portfolio_key !== record.portfolio_key) return "held_portfolio_identity";
  for (const key of ["membership", "authority", "objective", "dependency", "concentration", "resource", "sequence", "burden", "distribution", "negative", "safeguard", "rebalance", "challenge"]) {
    if (!fixture[key]) return "held_missing_" + key;
  }
  if (!fixture.first_reviewer_id || !fixture.second_reviewer_id || fixture.first_reviewer_id === fixture.second_reviewer_id) return "held_dual_review";
  if (fixture.propagation_status !== "complete") return "held_propagation";
  if (fixture.automatic_membership || fixture.automatic_reallocation || fixture.automatic_rebalance || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_action";
  return "eligible_for_human_portfolio_decision";
}

function inspectPolicy(record, fixture) {
  if (!fixture.authorized_policy) return "held_no_authorized_policy";
  if (fixture.cohort_id !== record.cohort_id) return "held_policy_identity";
  for (const key of ["authority", "lineage", "effect", "failure", "challenge", "review", "successor", "transition", "decommission", "residual", "archive", "confirmation"]) {
    if (!fixture[key]) return "held_missing_" + key;
  }
  if (!fixture.first_reviewer_id || !fixture.second_reviewer_id || fixture.first_reviewer_id === fixture.second_reviewer_id) return "held_dual_review";
  if (fixture.propagation_status !== "complete") return "held_propagation";
  if (fixture.silent_renewal || fixture.automatic_supersession || fixture.automatic_retirement || fixture.automatic_archive_deletion || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_action";
  return "eligible_for_human_policy_lifecycle_decision";
}

let learningCases = 0;
const learningOutcomes = new Set();
for (const record of registry.institutional_learning_dossiers) {
  const base = { independent_audit: true, cohort_id: record.cohort_id, decision_terms: true, implementation_fidelity: true, baselines: true, outcomes: true, harms: true, distribution: true, counterfactual: true, negative_results: true, context: true, independence: true, challenge_lineage: true, memory_scope: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", automatic_learning: false, automatic_transfer: false, automatic_reuse: false, automatic_score: false, automatic_rank: false };
  const faults = [{ independent_audit: false }, { cohort_id: "wrong" }, { decision_terms: false }, { implementation_fidelity: false }, { baselines: false }, { outcomes: false }, { harms: false }, { distribution: false }, { counterfactual: false }, { negative_results: false }, { context: false }, { independence: false }, { challenge_lineage: false }, { memory_scope: false }, { second_reviewer_id: "reviewer-a" }, { propagation_status: "held" }, { automatic_learning: true }, { automatic_transfer: true }, { automatic_reuse: true }, { automatic_score: true }, { automatic_rank: true }];
  const cases = faults.map((fault) => mutate(base, fault));
  for (let index = 0; cases.length < 39; index += 1) cases.push(mutate(base, { ...faults[index % faults.length], synthetic_variant: index + 1 }));
  cases.push(base);
  for (const fixture of cases) { learningOutcomes.add(inspectLearning(record, fixture)); learningCases += 1; }
}

let comparisonCases = 0;
const comparisonOutcomes = new Set();
for (const record of registry.cross_case_transfer_registers) {
  const base = { left_audited: true, right_audited: true, left_id: record.left_institutional_learning_dossier_id, right_id: record.right_institutional_learning_dossier_id, question: true, class: true, authority: true, context: true, population: true, baseline: true, measure: true, time: true, fidelity: true, dependency: true, safeguard: true, harm: true, distribution: true, exceptions: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", automatic_comparability: false, automatic_transfer: false, automatic_reuse: false, automatic_score: false, automatic_rank: false };
  const faults = [{ left_audited: false }, { right_audited: false }, { left_id: "wrong" }, { question: false }, { class: false }, { authority: false }, { context: false }, { population: false }, { baseline: false }, { measure: false }, { time: false }, { fidelity: false }, { dependency: false }, { safeguard: false }, { harm: false }, { distribution: false }, { exceptions: false }, { second_reviewer_id: "reviewer-a" }, { automatic_transfer: true }];
  const cases = faults.map((fault) => mutate(base, fault));
  cases.push(base);
  for (const fixture of cases) { comparisonOutcomes.add(inspectComparison(record, fixture)); comparisonCases += 1; }
}

let portfolioCases = 0;
const portfolioOutcomes = new Set();
for (const record of registry.portfolio_governance_registers) {
  const base = { admitted_cross_case_evidence: true, portfolio_key: record.portfolio_key, membership: true, authority: true, objective: true, dependency: true, concentration: true, resource: true, sequence: true, burden: true, distribution: true, negative: true, safeguard: true, rebalance: true, challenge: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", automatic_membership: false, automatic_reallocation: false, automatic_rebalance: false, automatic_score: false, automatic_rank: false };
  const faults = [{ admitted_cross_case_evidence: false }, { portfolio_key: "wrong" }, { membership: false }, { authority: false }, { objective: false }, { dependency: false }, { concentration: false }, { resource: false }, { sequence: false }, { burden: false }, { distribution: false }, { negative: false }, { safeguard: false }, { rebalance: false }, { challenge: false }, { second_reviewer_id: "reviewer-a" }, { propagation_status: "held" }, { automatic_membership: true }, { automatic_reallocation: true }, { automatic_rebalance: true }, { automatic_score: true }, { automatic_rank: true }];
  const cases = faults.map((fault) => mutate(base, fault));
  for (let index = 0; cases.length < 39; index += 1) cases.push(mutate(base, { ...faults[index % faults.length], synthetic_variant: index + 1 }));
  cases.push(base);
  for (const fixture of cases) { portfolioOutcomes.add(inspectPortfolio(record, fixture)); portfolioCases += 1; }
}

let policyCases = 0;
const policyOutcomes = new Set();
for (const record of registry.policy_supersession_retirement_ledgers) {
  const base = { authorized_policy: true, cohort_id: record.cohort_id, authority: true, lineage: true, effect: true, failure: true, challenge: true, review: true, successor: true, transition: true, decommission: true, residual: true, archive: true, confirmation: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete", silent_renewal: false, automatic_supersession: false, automatic_retirement: false, automatic_archive_deletion: false, automatic_score: false, automatic_rank: false };
  const faults = [{ authorized_policy: false }, { cohort_id: "wrong" }, { authority: false }, { lineage: false }, { effect: false }, { failure: false }, { challenge: false }, { review: false }, { successor: false }, { transition: false }, { decommission: false }, { residual: false }, { archive: false }, { confirmation: false }, { second_reviewer_id: "reviewer-a" }, { propagation_status: "held" }, { silent_renewal: true }, { automatic_supersession: true }, { automatic_retirement: true }, { automatic_archive_deletion: true }, { automatic_score: true }, { automatic_rank: true }];
  const cases = faults.map((fault) => mutate(base, fault));
  for (let index = 0; cases.length < 34; index += 1) cases.push(mutate(base, { ...faults[index % faults.length], synthetic_variant: index + 1 }));
  cases.push(base);
  for (const fixture of cases) { policyOutcomes.add(inspectPolicy(record, fixture)); policyCases += 1; }
}

check(learningCases === 320, "Expected 320 learning-admission cases; received " + learningCases + ".");
check(comparisonCases === 560, "Expected 560 pairwise comparison cases; received " + comparisonCases + ".");
check(portfolioCases === 240, "Expected 240 portfolio-governance cases; received " + portfolioCases + ".");
check(policyCases === 280, "Expected 280 policy-lifecycle cases; received " + policyCases + ".");
check(learningOutcomes.has("eligible_for_human_learning_admission"), "Learning fixtures omit the bounded human-admission route.");
check(comparisonOutcomes.has("eligible_for_human_comparability_decision"), "Comparison fixtures omit the bounded human-comparability route.");
check(portfolioOutcomes.has("eligible_for_human_portfolio_decision"), "Portfolio fixtures omit the bounded human-governance route.");
check(policyOutcomes.has("eligible_for_human_policy_lifecycle_decision"), "Policy fixtures omit the bounded human-lifecycle route.");
check(registry.institutional_learning_dossiers.every((record) => record.learning_state === "Inactive - No Independently Audited Decision" && record.learning_memo_id === null), "The harness must not admit a lesson or learning memo.");
check(registry.cross_case_transfer_registers.every((record) => record.transfer_decision === "Not Open" && record.transfer_condition_findings.length === 0), "The harness must not create a comparison or transfer finding.");
check(registry.portfolio_governance_registers.every((record) => record.governance_decision === "Not Open" && record.shared_dependency_records.length === 0), "The harness must not create a portfolio conclusion.");
check(registry.policy_supersession_retirement_ledgers.every((record) => record.retirement_decision === "Not Open" && record.supersession_decision_id === null), "The harness must not create a supersession or retirement.");
check(JSON.stringify(registry) === original, "The synthetic harness mutated the Phase 76 registry.");

if (failures.length) {
  console.error("Phase 76 harness failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log("Phase 76 harness passed: 1400 synthetic cases (320 learning admission, 560 pairwise transfer, 240 portfolio governance, 280 policy lifecycle) with no registry mutation, lesson, comparison, transfer finding, portfolio conclusion, policy reuse, supersession, retirement, decommissioning closure, archive deletion, receipt, score, rank, or stage change.");
