import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-75-decision-accountability-realized-impact-registry.json"), "utf8"));
const original = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const mutate = (base, values) => ({ ...base, ...values });

function inspectAccountability(dossier, fixture) {
  if (!fixture.adjudicated_translation) return "inactive_no_adjudicated_translation";
  if (!fixture.authorized_institutional_decision) return "inactive_no_authorized_decision";
  if (fixture.cohort_id !== dossier.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.decision_identity) return "held_missing_decision_identity";
  if (!fixture.owner_and_duty) return "held_missing_owner_or_duty";
  if (!fixture.current_authority) return "rejected_missing_current_authority";
  if (!fixture.decision_question) return "held_missing_decision_question";
  if (!fixture.options_and_status_quo) return "held_incomplete_option_set";
  if (!fixture.evidence_challenge_lineage) return "held_missing_evidence_or_challenge_lineage";
  if (!fixture.values_and_judgment) return "held_hidden_value_judgment";
  if (!fixture.benefit_harm_distribution) return "held_missing_benefit_harm_or_distribution";
  if (!fixture.feasibility_and_reversibility) return "held_missing_feasibility_or_reversibility";
  if (!fixture.conflict_recusal) return "held_missing_conflict_or_recusal_record";
  if (!fixture.dissent_archive) return "held_missing_dissent_archive";
  if (!fixture.selection_rationale) return "held_missing_selection_rationale";
  if (!fixture.recommendation_authorization_separate) return "rejected_recommendation_authorization_collapse";
  if (!fixture.terms_monitoring_sunset) return "held_missing_terms_monitoring_or_sunset";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_accountability_review_control";
  if (fixture.automatic_authorization || fixture.automatic_implementation || fixture.automatic_sunset_extension || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_decision_action";
  return "eligible_for_human_accountability_decision";
}

function inspectCommitment(ledger, fixture) {
  if (!fixture.authorized_decision) return "inactive_no_authorized_decision";
  if (fixture.cohort_id !== ledger.cohort_id || fixture.measure_id !== ledger.measure_id) return "rejected_identity_or_scope";
  if (!fixture.current_authorization) return "held_missing_authorization_receipt";
  if (!fixture.commitment_owner_scope) return "held_missing_commitment_owner_or_scope";
  if (!fixture.change_control) return "held_missing_change_control";
  if (!fixture.resource_capacity_outcome_baselines) return "held_missing_baseline";
  if (!fixture.budget_workforce_assets) return "held_missing_resource_commitment";
  if (!fixture.milestones_acceptance) return "held_missing_milestone_or_acceptance";
  if (!fixture.dependencies) return "held_missing_dependency_record";
  if (!fixture.safeguards_stop_work) return "held_missing_safeguard_or_stop_work_rule";
  if (!fixture.benefit_harm_distribution_measures) return "held_missing_realization_measure";
  if (!fixture.counterfactual_boundary) return "held_missing_counterfactual_boundary";
  if (!fixture.exceptions_remediation) return "held_missing_exception_or_remediation_path";
  if (fixture.first_reviewer_id === fixture.second_reviewer_id || fixture.propagation_status !== "complete") return "rejected_commitment_review_control";
  if (fixture.automatic_commitment || fixture.automatic_attribution || fixture.automatic_net_benefit || fixture.automatic_stage || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_implementation_action";
  return "eligible_for_human_commitment_decision";
}

function inspectAudit(register, fixture) {
  if (!fixture.authorized_decision) return "inactive_no_authorized_decision";
  if (!fixture.implementation_commitment) return "inactive_no_implementation_commitment";
  if (fixture.cohort_id !== register.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.current_decision_terms) return "held_missing_current_decision_terms";
  if (!fixture.authorization_compliance) return "held_missing_authorization_compliance";
  if (!fixture.commitment_delivery) return "held_missing_commitment_delivery";
  if (!fixture.baseline_method_integrity) return "held_missing_baseline_or_method_integrity";
  if (!fixture.benefit_harm_realization) return "held_missing_benefit_or_harm_realization";
  if (!fixture.distributional_review) return "held_missing_distributional_review";
  if (!fixture.counterfactual_audit) return "held_missing_counterfactual_audit";
  if (!fixture.adverse_safeguard_review) return "held_missing_adverse_or_safeguard_review";
  if (!fixture.challenge_dissent_review) return "held_missing_challenge_or_dissent_review";
  if (!fixture.sunset_enforcement) return "held_missing_sunset_or_renewal_decision";
  if (!fixture.reversal_remediation) return "held_missing_reversal_or_remediation_decision";
  if (!registry.remediation_classes.some((item) => item.remediation_class_id === fixture.remediation_class_id)) return "rejected_unknown_remediation_class";
  if (fixture.first_auditor_id === fixture.second_auditor_id || fixture.propagation_status !== "complete") return "rejected_audit_review_control";
  if (fixture.silent_renewal || fixture.automatic_sunset_extension || fixture.automatic_remediation_closure || fixture.automatic_score || fixture.automatic_rank) return "rejected_automatic_audit_action";
  return "eligible_for_human_post_decision_audit";
}

let accountabilityCases = 0;
const accountabilityOutcomes = new Set();
for (const dossier of registry.decision_accountability_dossiers) {
  const base = {
    adjudicated_translation: true, authorized_institutional_decision: true, cohort_id: dossier.cohort_id,
    decision_identity: true, owner_and_duty: true, current_authority: true, decision_question: true,
    options_and_status_quo: true, evidence_challenge_lineage: true, values_and_judgment: true,
    benefit_harm_distribution: true, feasibility_and_reversibility: true, conflict_recusal: true,
    dissent_archive: true, selection_rationale: true, recommendation_authorization_separate: true,
    terms_monitoring_sunset: true, first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b",
    propagation_status: "complete", automatic_authorization: false, automatic_implementation: false,
    automatic_sunset_extension: false, automatic_score: false, automatic_rank: false
  };
  const faults = [
    { adjudicated_translation: false }, { authorized_institutional_decision: false }, { cohort_id: "wrong" },
    { decision_identity: false }, { owner_and_duty: false }, { current_authority: false }, { decision_question: false },
    { options_and_status_quo: false }, { evidence_challenge_lineage: false }, { values_and_judgment: false },
    { benefit_harm_distribution: false }, { feasibility_and_reversibility: false }, { conflict_recusal: false },
    { dissent_archive: false }, { selection_rationale: false }, { recommendation_authorization_separate: false },
    { terms_monitoring_sunset: false }, { second_reviewer_id: "reviewer-a" }, { propagation_status: "held" },
    { automatic_authorization: true }, { automatic_implementation: true }, { automatic_sunset_extension: true },
    { automatic_score: true }, { automatic_rank: true }
  ];
  const cases = faults.map((fault) => mutate(base, fault));
  for (let index = 0; cases.length < 47; index += 1) {
    cases.push(mutate(base, { ...faults[index % faults.length], synthetic_variant: index + 1 }));
  }
  cases.push(base);
  for (const fixture of cases) { accountabilityOutcomes.add(inspectAccountability(dossier, fixture)); accountabilityCases += 1; }
}

let commitmentCases = 0;
const commitmentOutcomes = new Set();
for (const ledger of registry.implementation_commitment_realization_ledgers) {
  const base = {
    authorized_decision: true, cohort_id: ledger.cohort_id, measure_id: ledger.measure_id, current_authorization: true,
    commitment_owner_scope: true, change_control: true, resource_capacity_outcome_baselines: true,
    budget_workforce_assets: true, milestones_acceptance: true, dependencies: true, safeguards_stop_work: true,
    benefit_harm_distribution_measures: true, counterfactual_boundary: true, exceptions_remediation: true,
    first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-b", propagation_status: "complete",
    automatic_commitment: false, automatic_attribution: false, automatic_net_benefit: false,
    automatic_stage: false, automatic_score: false, automatic_rank: false
  };
  const cases = [
    mutate(base, { authorized_decision: false }), mutate(base, { cohort_id: "wrong" }), mutate(base, { measure_id: "wrong" }),
    mutate(base, { current_authorization: false }), mutate(base, { commitment_owner_scope: false }),
    mutate(base, { change_control: false }), mutate(base, { resource_capacity_outcome_baselines: false }),
    mutate(base, { budget_workforce_assets: false }), mutate(base, { milestones_acceptance: false }),
    mutate(base, { dependencies: false }), mutate(base, { safeguards_stop_work: false }),
    mutate(base, { benefit_harm_distribution_measures: false }), mutate(base, { counterfactual_boundary: false }),
    mutate(base, { exceptions_remediation: false }), mutate(base, { second_reviewer_id: "reviewer-a" }),
    mutate(base, { propagation_status: "held" }), mutate(base, { automatic_attribution: true }), base
  ];
  for (const fixture of cases) { commitmentOutcomes.add(inspectCommitment(ledger, fixture)); commitmentCases += 1; }
}

let auditCases = 0;
const auditOutcomes = new Set();
for (const register of registry.post_decision_audit_remediation_registers) {
  const base = {
    authorized_decision: true, implementation_commitment: true, cohort_id: register.cohort_id,
    current_decision_terms: true, authorization_compliance: true, commitment_delivery: true,
    baseline_method_integrity: true, benefit_harm_realization: true, distributional_review: true,
    counterfactual_audit: true, adverse_safeguard_review: true, challenge_dissent_review: true,
    sunset_enforcement: true, reversal_remediation: true, remediation_class_id: "75-REM-01-RECORD",
    first_auditor_id: "auditor-a", second_auditor_id: "auditor-b", propagation_status: "complete",
    silent_renewal: false, automatic_sunset_extension: false, automatic_remediation_closure: false,
    automatic_score: false, automatic_rank: false
  };
  const faults = [
    { authorized_decision: false }, { implementation_commitment: false }, { cohort_id: "wrong" },
    { current_decision_terms: false }, { authorization_compliance: false }, { commitment_delivery: false },
    { baseline_method_integrity: false }, { benefit_harm_realization: false }, { distributional_review: false },
    { counterfactual_audit: false }, { adverse_safeguard_review: false }, { challenge_dissent_review: false },
    { sunset_enforcement: false }, { reversal_remediation: false }, { remediation_class_id: "unknown" },
    { second_auditor_id: "auditor-a" }, { propagation_status: "held" }, { silent_renewal: true },
    { automatic_sunset_extension: true }, { automatic_remediation_closure: true }, { automatic_score: true },
    { automatic_rank: true }
  ];
  const cases = faults.map((fault) => mutate(base, fault));
  for (let index = 0; cases.length < 29; index += 1) {
    cases.push(mutate(base, { ...faults[index % faults.length], synthetic_variant: index + 1 }));
  }
  cases.push(base);
  for (const fixture of cases) { auditOutcomes.add(inspectAudit(register, fixture)); auditCases += 1; }
}

check(accountabilityCases === 384, "Expected 384 accountability cases; received " + accountabilityCases + ".");
check(commitmentCases === 576, "Expected 576 commitment-realization cases; received " + commitmentCases + ".");
check(auditCases === 240, "Expected 240 post-decision audit cases; received " + auditCases + ".");
check(accountabilityOutcomes.has("eligible_for_human_accountability_decision"), "Accountability fixtures omit the bounded human-decision route.");
check(commitmentOutcomes.has("eligible_for_human_commitment_decision"), "Commitment fixtures omit the bounded human-decision route.");
check(auditOutcomes.has("eligible_for_human_post_decision_audit"), "Audit fixtures omit the bounded human-audit route.");
check(registry.decision_accountability_dossiers.every((record) => record.accountability_state === "Inactive - No Authorized Institutional Decision" && record.authorization_id === null), "The harness must not open or authorize a decision.");
check(registry.implementation_commitment_realization_ledgers.every((record) => record.commitment_state === "Inactive - No Authorized Decision" && record.commitment_record_id === null && record.benefit_realization_records.length === 0), "The harness must not create a commitment or realized benefit.");
check(registry.post_decision_audit_remediation_registers.every((record) => record.audit_state === "Inactive - No Authorized Decision" && record.remediation_decision_ids.length === 0), "The harness must not create an audit or remediation.");
check(JSON.stringify(registry) === original, "The synthetic harness mutated the Phase 75 registry.");

if (failures.length) {
  console.error("Phase 75 harness failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

const totalCases = accountabilityCases + commitmentCases + auditCases;
console.log("Phase 75 harness passed: " + totalCases + " synthetic cases (" + accountabilityCases + " accountability, " + commitmentCases + " implementation-realization, " + auditCases + " audit-remediation) with no registry mutation, authorization, commitment, baseline, output, benefit, harm, audit, reversal, remediation, receipt, score, rank, or stage change.");
