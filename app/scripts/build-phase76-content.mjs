import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");

const phase75 = await readJson(join(dataRoot, "phase-75-decision-accountability-realized-impact-registry.json"));

const learningAdmissionGates = [
  ["76-LRN-01-AUDIT", "Independent Phase 75 audit and receipt"],
  ["76-LRN-02-DECISION", "Decision identity, authority, version, and terms"],
  ["76-LRN-03-IMPLEMENTATION", "Implementation commitment and fidelity"],
  ["76-LRN-04-BASELINE", "Resource, capacity, outcome, and status-quo baselines"],
  ["76-LRN-05-OUTCOME", "Adjudicated output, benefit, and outcome records"],
  ["76-LRN-06-HARM", "Adjudicated harm, burden, and unintended effects"],
  ["76-LRN-07-DISTRIBUTION", "Affected-group and distributional findings"],
  ["76-LRN-08-COUNTERFACTUAL", "Counterfactual decision and attribution boundary"],
  ["76-LRN-09-NEGATIVE", "Negative, null, failed, and adverse-result retention"],
  ["76-LRN-10-CONTEXT", "Institutional, technical, geographic, and temporal context"],
  ["76-LRN-11-INDEPENDENCE", "Reviewer independence and conflict review"],
  ["76-LRN-12-CHALLENGE", "Challenge, dissent, correction, and reversal lineage"],
  ["76-LRN-13-MEMORY", "Institutional-memory memo scope and reuse boundary"],
  ["76-LRN-14-RECEIPT", "Dual review, admission receipt, archive, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const transferComparisonGates = [
  ["76-TRN-01-TWO-AUDITS", "Two independently audited Phase 75 decisions"],
  ["76-TRN-02-QUESTION", "Comparable decision questions and option boundaries"],
  ["76-TRN-03-CLASS", "Decision, intervention, and outcome classes"],
  ["76-TRN-04-AUTHORITY", "Authority, mandate, duty, and accountability fit"],
  ["76-TRN-05-CONTEXT", "Institutional, geographic, and operating context"],
  ["76-TRN-06-POPULATION", "Beneficiary, user, affected-group, and exposure fit"],
  ["76-TRN-07-BASELINE", "Baseline, status quo, denominator, and missingness fit"],
  ["76-TRN-08-MEASURE", "Measure identity, unit, method, and revision fit"],
  ["76-TRN-09-TIME", "Period, maturity, lag, durability, and shock alignment"],
  ["76-TRN-10-FIDELITY", "Implementation fidelity, capacity, and resource fit"],
  ["76-TRN-11-DEPENDENCY", "Supplier, infrastructure, permission, and critical-path fit"],
  ["76-TRN-12-SAFEGUARD", "Safeguard, stop-work, incident, and remedy fit"],
  ["76-TRN-13-HARM", "Harm, burden, opportunity-cost, and failure comparability"],
  ["76-TRN-14-DISTRIBUTION", "Distributional incidence and equity comparability"],
  ["76-TRN-15-EXCEPTION", "Non-transfer conditions, exceptions, and residual uncertainty"],
  ["76-TRN-16-RECEIPT", "Independent comparison, bounded finding, receipt, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const portfolioGovernanceGates = [
  ["76-PRT-01-MEMBERSHIP", "Portfolio purpose, membership, and version"],
  ["76-PRT-02-AUTHORITY", "Portfolio owner, authority, duties, and conflicts"],
  ["76-PRT-03-OBJECTIVE", "Objectives, alternatives, status quo, and tradeoffs"],
  ["76-PRT-04-DEPENDENCY", "Shared dependencies and common-mode failure"],
  ["76-PRT-05-CONCENTRATION", "Supplier, geography, technology, and authority concentration"],
  ["76-PRT-06-RESOURCE", "Capital, workforce, infrastructure, and institutional capacity"],
  ["76-PRT-07-SEQUENCE", "Sequencing, timing, interaction, and critical path"],
  ["76-PRT-08-BURDEN", "Cumulative local burden and carrying-capacity review"],
  ["76-PRT-09-DISTRIBUTION", "Cross-project distribution, access, and exclusion"],
  ["76-PRT-10-NEGATIVE", "Failure, null result, adverse evidence, and dissent retention"],
  ["76-PRT-11-SAFEGUARD", "Portfolio safeguards, pauses, stops, and escalation"],
  ["76-PRT-12-REBALANCE", "Rebalance, substitution, divestment, and exit options"],
  ["76-PRT-13-CHALLENGE", "External challenge and affected-community review"],
  ["76-PRT-14-RECEIPT", "Independent governance decision, receipt, notice, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const policyLifecycleGates = [
  ["76-POL-01-IDENTITY", "Policy identity, version, owner, and scope"],
  ["76-POL-02-AUTHORITY", "Current authority, duty, and decision rights"],
  ["76-POL-03-LINEAGE", "Decision, implementation, audit, and learning lineage"],
  ["76-POL-04-EFFECT", "Observed benefit, harm, burden, and distribution"],
  ["76-POL-05-FAILURE", "Negative results, failures, incidents, and unresolved harms"],
  ["76-POL-06-CHALLENGE", "Challenge, dissent, correction, and reversal history"],
  ["76-POL-07-REVIEW", "Scheduled review, sunset, and renewal boundary"],
  ["76-POL-08-SUCCESSOR", "Successor policy, supersession scope, and authority"],
  ["76-POL-09-TRANSITION", "Transition plan, dependencies, users, and exceptions"],
  ["76-POL-10-DECOMMISSION", "Operational, technical, contractual, and asset decommissioning"],
  ["76-POL-11-RESIDUAL", "Residual duties, liabilities, safeguards, and remedies"],
  ["76-POL-12-ARCHIVE", "Permanent evidence, rationale, dissent, and receipt archive"],
  ["76-POL-13-CONFIRM", "Independent retirement and decommissioning verification"],
  ["76-POL-14-RECEIPT", "Public notice, final receipt, discoverability, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const learningRetentionClasses = [
  ["76-RET-01-POSITIVE", "Positive and intended outcomes"],
  ["76-RET-02-NULL", "Null and indeterminate results"],
  ["76-RET-03-NEGATIVE", "Negative and adverse results"],
  ["76-RET-04-FAILURE", "Implementation and operating failures"],
  ["76-RET-05-HARM", "Harms, burdens, and unintended effects"],
  ["76-RET-06-DISTRIBUTION", "Distributional disparities and excluded groups"],
  ["76-RET-07-INCIDENT", "Incidents, complaints, safeguards, and stop-work events"],
  ["76-RET-08-DISSENT", "Dissent, challenge, and minority rationale"],
  ["76-RET-09-EXCEPTION", "Context limits, exceptions, and non-transfer findings"],
  ["76-RET-10-CORRECTION", "Corrections, withdrawals, and superseded evidence"],
  ["76-RET-11-REMEDIATION", "Remediation, compensation, and restoration"],
  ["76-RET-12-RETIREMENT", "Sunset, reversal, retirement, and decommissioning"]
].map(([retention_class_id, label]) => ({ retention_class_id, label }));

const transferConditionClasses = [
  ["76-CND-01-AUTHORITY", "Authority and mandate"],
  ["76-CND-02-INSTITUTION", "Institutional capacity and governance"],
  ["76-CND-03-TECHNOLOGY", "Technology, maturity, and configuration"],
  ["76-CND-04-DOMAIN", "Operating domain and environment"],
  ["76-CND-05-POPULATION", "Population, user, beneficiary, and exposure"],
  ["76-CND-06-BASELINE", "Baseline, status quo, and denominator"],
  ["76-CND-07-MEASURE", "Measure, method, unit, and missingness"],
  ["76-CND-08-TIME", "Time, maturity, durability, and shock"],
  ["76-CND-09-CAPACITY", "Resources, workforce, assets, and delivery capacity"],
  ["76-CND-10-DEPENDENCY", "External dependency and critical path"],
  ["76-CND-11-SAFEGUARD", "Safeguard, incident, stop, and remedy"],
  ["76-CND-12-DISTRIBUTION", "Distribution, burden, access, and equity"]
].map(([transfer_condition_id, label]) => ({ transfer_condition_id, label }));

const portfolioRiskTriggers = [
  ["76-RSK-01-SUPPLIER", "Shared supplier or vendor concentration"],
  ["76-RSK-02-INFRASTRUCTURE", "Shared grid, water, transport, compute, or facility dependency"],
  ["76-RSK-03-WORKFORCE", "Shared workforce, skill, or institutional-capacity constraint"],
  ["76-RSK-04-CAPITAL", "Shared fiscal, financing, insurance, or procurement constraint"],
  ["76-RSK-05-AUTHORITY", "Shared authority, permission, or regulatory bottleneck"],
  ["76-RSK-06-SCHEDULE", "Correlated milestone, maturity, or schedule exposure"],
  ["76-RSK-07-TECHNOLOGY", "Common-mode technical, safety, cyber, or quality failure"],
  ["76-RSK-08-GEOGRAPHY", "Geographic concentration or hazard exposure"],
  ["76-RSK-09-BURDEN", "Cumulative environmental, service, housing, or infrastructure burden"],
  ["76-RSK-10-DISTRIBUTION", "Concentrated harm, exclusion, or benefit capture"],
  ["76-RSK-11-POLICY", "Conflicting, duplicated, or obsolete policy obligations"],
  ["76-RSK-12-EXIT", "Missing substitution, rollback, divestment, or exit capacity"]
].map(([trigger_id, label]) => ({ trigger_id, label }));

const retirementObligations = [
  ["76-DEC-01-NOTICE", "Notify affected users, institutions, and communities"],
  ["76-DEC-02-ACCESS", "Preserve required service and accessibility during transition"],
  ["76-DEC-03-OPERATIONS", "Terminate or migrate operating processes safely"],
  ["76-DEC-04-DATA", "Retain, migrate, protect, or lawfully dispose of data"],
  ["76-DEC-05-CONTRACT", "Close contracts, permissions, licences, and financial duties"],
  ["76-DEC-06-ASSET", "Retire, transfer, restore, or dispose of physical and digital assets"],
  ["76-DEC-07-WORKFORCE", "Address workforce, training, role, and labor obligations"],
  ["76-DEC-08-REMEDY", "Preserve unresolved remedy, compensation, and restoration duties"],
  ["76-DEC-09-ARCHIVE", "Keep evidence, rationale, dissent, failure, and receipt history discoverable"],
  ["76-DEC-10-CONFIRM", "Independently confirm retirement and residual obligations"]
].map(([obligation_id, label]) => ({ obligation_id, label }));

const decisions = phase75.decision_accountability_dossiers;
const auditByDecision = new Map(phase75.post_decision_audit_remediation_registers.map((record) => [record.decision_accountability_dossier_id, record]));
const shortName = (record) => record.slug.replace(/^75-dad-\d+-/, "");

const institutionalLearningDossiers = decisions.map((decision, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const audit = auditByDecision.get(decision.decision_accountability_dossier_id);
  return {
    institutional_learning_dossier_id: "76-ILD-" + padded,
    slug: "76-ild-" + padded + "-" + shortName(decision),
    record_kind: "institutional_learning_dossier",
    record_status: "Published",
    learning_state: "Inactive - No Independently Audited Decision",
    admission_decision: "Not Open",
    cohort_id: decision.cohort_id,
    file_id: decision.file_id,
    named_entity: decision.named_entity,
    decision_accountability_dossier_id: decision.decision_accountability_dossier_id,
    decision_accountability_dossier_slug: decision.slug,
    post_decision_audit_remediation_register_id: audit.post_decision_audit_remediation_register_id,
    phase75_accountability_state: decision.accountability_state,
    phase75_audit_state: audit.audit_state,
    learning_admission_checks: learningAdmissionGates.map((gate) => ({ ...gate, decision_state: "Inactive", basis: "No independently audited Phase 75 decision exists." })),
    retention_records: learningRetentionClasses.map((item) => ({ ...item, retention_state: "Empty", record_ids: [] })),
    source_ids: decision.source_ids,
    signal_ids: decision.signal_ids,
    evidence_gap_ids: decision.evidence_gap_ids,
    canonical_briefing_id: decision.canonical_briefing_id,
    reader_pathway_ids: decision.reader_pathway_ids,
    local_system_ids: decision.local_system_ids,
    cross_case_transfer_register_ids: [],
    portfolio_governance_register_ids: [],
    policy_supersession_retirement_ledger_id: "76-PRL-" + padded,
    audit_receipt_ids: [],
    admitted_decision_version_id: null,
    learning_question: null,
    learning_memo_id: null,
    bounded_lesson_records: [],
    non_transfer_finding_records: [],
    failure_and_negative_result_records: [],
    institutional_memory_records: [],
    challenge_records: [],
    correction_records: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    admission_receipt_id: null,
    propagation_status: "not_started",
    automatic_learning_allowed: false,
    automatic_transfer_allowed: false,
    automatic_policy_reuse_allowed: false,
    automatic_scoring_allowed: false,
    automatic_ranking_allowed: false,
    phase64_cell_change: "none"
  };
});

const learningByCohort = new Map(institutionalLearningDossiers.map((record) => [record.cohort_id, record]));
const crossCaseTransferRegisters = [];
for (let leftIndex = 0; leftIndex < institutionalLearningDossiers.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < institutionalLearningDossiers.length; rightIndex += 1) {
    const left = institutionalLearningDossiers[leftIndex];
    const right = institutionalLearningDossiers[rightIndex];
    const padded = String(crossCaseTransferRegisters.length + 1).padStart(3, "0");
    const record = {
      cross_case_transfer_register_id: "76-CTR-" + padded,
      slug: "76-ctr-" + padded + "-" + shortName(decisions[leftIndex]) + "-vs-" + shortName(decisions[rightIndex]),
      record_kind: "cross_case_transfer_register",
      record_status: "Published",
      comparison_state: "Inactive - Fewer Than Two Independently Audited Decisions",
      transfer_decision: "Not Open",
      left_institutional_learning_dossier_id: left.institutional_learning_dossier_id,
      right_institutional_learning_dossier_id: right.institutional_learning_dossier_id,
      left_cohort_id: left.cohort_id,
      right_cohort_id: right.cohort_id,
      left_named_entity: left.named_entity,
      right_named_entity: right.named_entity,
      comparison_checks: transferComparisonGates.map((gate) => ({ ...gate, decision_state: "Inactive", basis: "Neither side contains an independently audited and admitted Phase 75 decision." })),
      transfer_condition_records: transferConditionClasses.map((item) => ({ ...item, condition_state: "Not Assessable", finding_ids: [] })),
      source_ids: [...new Set([...left.source_ids, ...right.source_ids])],
      signal_ids: [...new Set([...left.signal_ids, ...right.signal_ids])],
      evidence_gap_ids: [...new Set([...left.evidence_gap_ids, ...right.evidence_gap_ids])],
      canonical_briefing_ids: [left.canonical_briefing_id, right.canonical_briefing_id],
      reader_pathway_ids: [...new Set([...left.reader_pathway_ids, ...right.reader_pathway_ids])],
      local_system_ids: [...new Set([...left.local_system_ids, ...right.local_system_ids])],
      comparison_question: null,
      eligible_decision_version_ids: [],
      common_feature_records: [],
      material_difference_records: [],
      transfer_condition_findings: [],
      non_transfer_findings: [],
      bounded_reuse_decision: null,
      exception_records: [],
      challenge_records: [],
      first_reviewer_id: null,
      second_reviewer_id: null,
      comparison_receipt_id: null,
      propagation_status: "not_started",
      automatic_comparability_allowed: false,
      automatic_transfer_allowed: false,
      automatic_policy_reuse_allowed: false,
      automatic_score_allowed: false,
      automatic_rank_allowed: false,
      phase64_cell_change: "none"
    };
    left.cross_case_transfer_register_ids.push(record.cross_case_transfer_register_id);
    right.cross_case_transfer_register_ids.push(record.cross_case_transfer_register_id);
    crossCaseTransferRegisters.push(record);
  }
}

const portfolioDefinitions = [
  ["infrastructure-delivery", "Infrastructure Delivery", [0, 1, 2, 3, 4]],
  ["public-authority", "Public Authority", [1, 3, 4, 5, 6, 7]],
  ["regulated-autonomy", "Regulated Autonomy", [3, 7]],
  ["industrial-capacity", "Industrial Capacity", [0, 2, 4]],
  ["digital-assurance", "Digital Assurance", [5, 6]],
  ["local-system-burden", "Local-System Burden", [0, 1, 2, 3, 4, 7]]
];

const portfolioGovernanceRegisters = portfolioDefinitions.map(([slug, label, indexes], index) => {
  const members = indexes.map((item) => institutionalLearningDossiers[item]);
  const padded = String(index + 1).padStart(3, "0");
  const memberIds = new Set(members.map((item) => item.institutional_learning_dossier_id));
  const pairIds = crossCaseTransferRegisters.filter((item) => memberIds.has(item.left_institutional_learning_dossier_id) && memberIds.has(item.right_institutional_learning_dossier_id)).map((item) => item.cross_case_transfer_register_id);
  const record = {
    portfolio_governance_register_id: "76-PGR-" + padded,
    slug: "76-pgr-" + padded + "-" + slug,
    record_kind: "portfolio_governance_register",
    record_status: "Published",
    portfolio_state: "Inactive - No Admitted Cross-Case Evidence",
    governance_decision: "Not Open",
    portfolio_key: slug,
    portfolio_label: label,
    institutional_learning_dossier_ids: members.map((item) => item.institutional_learning_dossier_id),
    cross_case_transfer_register_ids: pairIds,
    named_entities: members.map((item) => item.named_entity),
    portfolio_checks: portfolioGovernanceGates.map((gate) => ({ ...gate, decision_state: "Inactive", basis: "No independently audited decisions or admitted cross-case findings exist." })),
    portfolio_risk_trigger_records: portfolioRiskTriggers.map((item) => ({ ...item, trigger_state: "Dormant", event_ids: [] })),
    source_ids: [...new Set(members.flatMap((item) => item.source_ids))],
    signal_ids: [...new Set(members.flatMap((item) => item.signal_ids))],
    evidence_gap_ids: [...new Set(members.flatMap((item) => item.evidence_gap_ids))],
    reader_pathway_ids: [...new Set(members.flatMap((item) => item.reader_pathway_ids))],
    local_system_ids: [...new Set(members.flatMap((item) => item.local_system_ids))],
    portfolio_owner_id: null,
    portfolio_authority_record: null,
    portfolio_objective: null,
    membership_decision_records: [],
    shared_dependency_records: [],
    concentration_findings: [],
    cumulative_burden_findings: [],
    distributional_findings: [],
    interaction_and_sequence_findings: [],
    portfolio_safeguard_records: [],
    rebalance_or_exit_options: [],
    governance_decision_record: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    governance_receipt_id: null,
    propagation_status: "not_started",
    automatic_portfolio_membership_allowed: false,
    automatic_resource_reallocation_allowed: false,
    automatic_rebalance_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
  for (const member of members) member.portfolio_governance_register_ids.push(record.portfolio_governance_register_id);
  return record;
});

const policySupersessionRetirementLedgers = decisions.map((decision, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const learning = learningByCohort.get(decision.cohort_id);
  return {
    policy_supersession_retirement_ledger_id: "76-PRL-" + padded,
    slug: "76-prl-" + padded + "-" + shortName(decision),
    record_kind: "policy_supersession_retirement_ledger",
    record_status: "Published",
    lifecycle_state: "Inactive - No Authorized Policy Or Retirement Decision",
    retirement_decision: "Not Open",
    cohort_id: decision.cohort_id,
    file_id: decision.file_id,
    named_entity: decision.named_entity,
    institutional_learning_dossier_id: learning.institutional_learning_dossier_id,
    decision_accountability_dossier_id: decision.decision_accountability_dossier_id,
    lifecycle_checks: policyLifecycleGates.map((gate) => ({ ...gate, decision_state: "Inactive", basis: "No authorized policy, admitted learning record, supersession, or retirement decision exists." })),
    decommissioning_obligation_records: retirementObligations.map((item) => ({ ...item, obligation_state: "Unavailable", evidence_ids: [], receipt_id: null })),
    source_ids: decision.source_ids,
    signal_ids: decision.signal_ids,
    evidence_gap_ids: decision.evidence_gap_ids,
    canonical_briefing_id: decision.canonical_briefing_id,
    reader_pathway_ids: decision.reader_pathway_ids,
    local_system_ids: decision.local_system_ids,
    policy_record_id: null,
    policy_version: null,
    policy_owner_id: null,
    authority_record: null,
    authorized_decision_id: null,
    learning_memo_ids: [],
    scheduled_review_date: null,
    sunset_date: null,
    successor_policy_id: null,
    supersession_decision_id: null,
    supersession_scope: null,
    transition_plan_id: null,
    decommissioning_plan_id: null,
    residual_obligation_records: [],
    unresolved_harm_records: [],
    permanent_archive_id: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    retirement_receipt_id: null,
    propagation_status: "not_started",
    silent_renewal_allowed: false,
    automatic_supersession_allowed: false,
    automatic_retirement_allowed: false,
    automatic_archive_deletion_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "76",
  registry_id: "cross-case-learning-portfolio-governance-policy-retirement-registry-001",
  title: "Cross-Case Learning, Portfolio Governance And Policy Retirement Registry",
  captured_date: "2026-08-24",
  as_of_date: "2026-08-24",
  scope: "Eight inactive institutional-learning dossiers, all twenty-eight pairwise cross-case transfer registers, six inactive portfolio-governance registers, and eight inactive policy-supersession and retirement ledgers downstream of Phase 75.",
  interpretation_boundary: "One audited decision is not a transferable lesson. Two audited decisions are not automatically comparable. A collection of projects is not a governed portfolio. Supersession is not retirement, decommissioning, remedy, or permission to erase evidence.",
  activation_rule: "At least two independently audited Phase 75 decisions must each pass institutional-learning admission and then pass a separate pairwise comparability review before any transfer finding, portfolio conclusion, or bounded reuse decision can open.",
  learning_admission_gates: learningAdmissionGates,
  transfer_comparison_gates: transferComparisonGates,
  portfolio_governance_gates: portfolioGovernanceGates,
  policy_lifecycle_gates: policyLifecycleGates,
  learning_retention_classes: learningRetentionClasses,
  transfer_condition_classes: transferConditionClasses,
  portfolio_risk_triggers: portfolioRiskTriggers,
  retirement_obligations: retirementObligations,
  learning_states: ["Inactive - No Independently Audited Decision", "Under Admission Review", "Held", "Admitted For Bounded Learning", "Corrected", "Withdrawn"],
  comparison_states: ["Inactive - Fewer Than Two Independently Audited Decisions", "Under Comparability Review", "Held", "Comparable With Conditions", "Not Comparable", "Corrected", "Withdrawn"],
  portfolio_states: ["Inactive - No Admitted Cross-Case Evidence", "Under Portfolio Review", "Held", "Governance Decision Pending", "Governed With Conditions", "Rebalanced", "Exited", "Closed"],
  lifecycle_states: ["Inactive - No Authorized Policy Or Retirement Decision", "Active Policy", "Under Review", "Held", "Supersession Proposed", "Superseded", "Retirement In Progress", "Retired With Residual Duties", "Decommissioned With Receipt"],
  metrics: {
    institutional_learning_dossiers: institutionalLearningDossiers.length,
    inactive_institutional_learning_dossiers: institutionalLearningDossiers.length,
    cross_case_transfer_registers: crossCaseTransferRegisters.length,
    inactive_cross_case_transfer_registers: crossCaseTransferRegisters.length,
    portfolio_governance_registers: portfolioGovernanceRegisters.length,
    inactive_portfolio_governance_registers: portfolioGovernanceRegisters.length,
    policy_supersession_retirement_ledgers: policySupersessionRetirementLedgers.length,
    inactive_policy_supersession_retirement_ledgers: policySupersessionRetirementLedgers.length,
    learning_admission_gates: learningAdmissionGates.length,
    transfer_comparison_gates: transferComparisonGates.length,
    portfolio_governance_gates: portfolioGovernanceGates.length,
    policy_lifecycle_gates: policyLifecycleGates.length,
    learning_retention_classes: learningRetentionClasses.length,
    transfer_condition_classes: transferConditionClasses.length,
    portfolio_risk_triggers: portfolioRiskTriggers.length,
    retirement_obligations: retirementObligations.length,
    independently_audited_decisions_received: 0,
    learning_dossiers_admitted: 0,
    institutional_learning_memos_published: 0,
    negative_or_failure_records_admitted: 0,
    pairwise_comparisons_opened: 0,
    comparable_pairs_adjudicated: 0,
    transfer_findings_published: 0,
    non_transfer_findings_published: 0,
    bounded_reuse_decisions_issued: 0,
    portfolio_findings_published: 0,
    shared_dependencies_adjudicated: 0,
    concentration_findings_adjudicated: 0,
    cumulative_burden_findings_adjudicated: 0,
    portfolio_rebalance_decisions_issued: 0,
    policy_supersessions_issued: 0,
    policy_retirements_issued: 0,
    decommissioning_plans_activated: 0,
    decommissioning_obligations_closed: 0,
    unresolved_harms_erased: 0,
    archives_deleted: 0,
    receipts_created: 0,
    scores_created: 0,
    rankings_created: 0,
    phase64_cells_advanced: 0
  },
  institutional_learning_dossiers: institutionalLearningDossiers,
  cross_case_transfer_registers: crossCaseTransferRegisters,
  portfolio_governance_registers: portfolioGovernanceRegisters,
  policy_supersession_retirement_ledgers: policySupersessionRetirementLedgers
};

await writeJson(join(dataRoot, "phase-76-cross-case-learning-portfolio-policy-retirement-registry.json"), registry);

const guideIds = [
  "briefing-cross-case-infrastructure-delivery-001",
  "briefing-cross-case-public-authority-001",
  "briefing-cross-case-regulated-autonomy-001",
  "briefing-cross-case-industrial-capacity-001",
  "briefing-cross-case-digital-assurance-001",
  "briefing-cross-case-local-system-burden-001",
  "briefing-institutional-memory-negative-results-001",
  "briefing-policy-retirement-decommissioning-001"
];
const mapIds = [
  "dependency-map-audited-decision-is-not-transferable-policy",
  "dependency-map-portfolio-benefit-is-not-shared-benefit",
  "dependency-map-supersession-is-not-retirement-or-erasure"
];
const pathwayIds = [...new Set(institutionalLearningDossiers.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, ...guideIds])];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, ...mapIds])];
  await writeJson(path, pathway);
}

for (const learning of institutionalLearningDossiers) {
  const retirement = policySupersessionRetirementLedgers.find((record) => record.cohort_id === learning.cohort_id);
  const path = join(contentRoot, "briefings", learning.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 76 institutional learning and policy-retirement boundary")) {
    body = body.trimEnd() + "\n\n## Phase 76 institutional learning and policy-retirement boundary\n\n[Cross-Case Learning](/evidence/learning/) assigns [" + learning.institutional_learning_dossier_id + "](/evidence/learning/" + learning.slug + "/), " + learning.cross_case_transfer_register_ids.length + " inactive pairwise transfer reviews, and [" + retirement.policy_supersession_retirement_ledger_id + "](/evidence/learning/" + retirement.slug + "/) to this named file. No independently audited decision, admitted lesson, comparison, transfer finding, portfolio conclusion, supersession, retirement, decommissioning, receipt, score, rank, or Phase 64 cell change exists.\n";
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
  const localLearning = institutionalLearningDossiers.filter((record) => record.local_system_ids.includes(localId));
  const localPortfolios = portfolioGovernanceRegisters.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 76 cross-case and cumulative-burden boundary")) {
    body = body.trimEnd() + "\n\n## Phase 76 cross-case and cumulative-burden boundary\n\nThe [Cross-Case Learning And Portfolio Registry](/evidence/learning/) connects " + localLearning.map((record) => record.named_entity).join(" and ") + " to " + localPortfolios.length + " inactive portfolio views. Shared dependencies, concentration, cumulative burden, transferability, policy reuse, supersession, and retirement require independent review; none is inferred from co-location or thematic similarity.\n";
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-decision-accountability-desk-001.mdx",
  "briefing-implementation-commitment-ledger-001.mdx",
  "briefing-realized-impact-audit-001.mdx",
  "briefing-reversal-remediation-desk-001.mdx",
  "briefing-evidence-synthesis-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx",
  "briefing-conversion-stage-matrix-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 76 cross-case learning, portfolio, and retirement control")) {
    body = body.trimEnd() + "\n\n## Phase 76 cross-case learning, portfolio, and retirement control\n\nThe [Cross-Case Learning And Portfolio Registry](/evidence/learning/) adds eight inactive learning dossiers, all twenty-eight pairwise transfer reviews, six inactive portfolio-governance registers, and eight inactive policy-retirement ledgers. It retains negative results, failures, harms, distribution, dissent, exceptions, shared dependencies, cumulative burden, residual duties, and permanent archives while creating zero comparisons, lessons, transfer findings, portfolio conclusions, supersessions, retirements, decommissioning closures, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

console.log("Phase 76 content built: " + institutionalLearningDossiers.length + " inactive learning dossiers, " + crossCaseTransferRegisters.length + " inactive pairwise transfer registers, " + portfolioGovernanceRegisters.length + " inactive portfolio registers, " + policySupersessionRetirementLedgers.length + " inactive policy-retirement ledgers, " + pathwayIds.length + " pathways, and 0 comparisons, lessons, portfolio conclusions, supersessions, retirements, or decommissioning closures.");
