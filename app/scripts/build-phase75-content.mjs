import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");

const phase74 = await readJson(join(dataRoot, "phase-74-evidence-synthesis-challenge-decision-translation-registry.json"));

const accountabilityGates = [
  ["75-ACC-01-IDENTITY", "Decision identity and version"],
  ["75-ACC-02-OWNER", "Named decision owner and duty"],
  ["75-ACC-03-AUTHORITY", "Legal, policy, fiscal, and operational authority"],
  ["75-ACC-04-QUESTION", "Exact decision question and boundary"],
  ["75-ACC-05-OPTIONS", "Complete option set and status quo"],
  ["75-ACC-06-EVIDENCE", "Current synthesis, grade, and challenge lineage"],
  ["75-ACC-07-VALUES", "Values, preferences, and judgment"],
  ["75-ACC-08-BENEFIT-HARM", "Expected benefits, harms, and burden"],
  ["75-ACC-09-DISTRIBUTION", "Affected groups and distribution"],
  ["75-ACC-10-FEASIBILITY", "Cost, capacity, dependencies, and reversibility"],
  ["75-ACC-11-CONFLICT", "Conflicts, funding, and recusal"],
  ["75-ACC-12-DISSENT", "Dissent and minority rationale archive"],
  ["75-ACC-13-RATIONALE", "Option-selection rationale and proportionality"],
  ["75-ACC-14-SEPARATION", "Recommendation and authorization separation"],
  ["75-ACC-15-TERMS", "Conditions, monitoring, sunset, and review terms"],
  ["75-ACC-16-RECEIPT", "Independent review, receipt, notice, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const implementationRealizationGates = [
  ["75-IMP-01-AUTHORIZATION", "Current authorization and accountability receipt"],
  ["75-IMP-02-COMMITMENT", "Commitment identity, owner, scope, and beneficiary"],
  ["75-IMP-03-CHANGE", "Version, amendment, and change-control boundary"],
  ["75-IMP-04-BASELINE", "Pre-decision resource, capacity, and outcome baseline"],
  ["75-IMP-05-RESOURCE", "Budget, funding, procurement, and asset commitment"],
  ["75-IMP-06-CAPACITY", "Workforce, institutional, technical, and delivery capacity"],
  ["75-IMP-07-MILESTONE", "Milestones, dates, acceptance, and completion criteria"],
  ["75-IMP-08-DEPENDENCY", "External dependencies, permissions, and critical path"],
  ["75-IMP-09-SAFEGUARD", "Safeguard, threshold, pause, and stop-work rules"],
  ["75-IMP-10-OUTPUT", "Delivered output and acceptance verification"],
  ["75-IMP-11-BENEFIT-HARM", "Benefit, harm, burden, and unintended-effect measures"],
  ["75-IMP-12-DISTRIBUTION", "Distributional and affected-group measures"],
  ["75-IMP-13-ATTRIBUTION", "Counterfactual, contribution, and attribution boundary"],
  ["75-IMP-14-EXCEPTION", "Deviation, exception, incident, and complaint lineage"],
  ["75-IMP-15-REMEDIATION", "Remediation, reversal, compensation, and restoration"],
  ["75-IMP-16-RECEIPT", "Dual review, realization receipt, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const postDecisionAuditGates = [
  ["75-AUD-01-DECISION", "Current decision, authority, version, and terms"],
  ["75-AUD-02-COMPLIANCE", "Condition, safeguard, and authorization compliance"],
  ["75-AUD-03-COMMITMENT", "Commitment delivery and milestone integrity"],
  ["75-AUD-04-BASELINE", "Baseline, denominator, method, and revision integrity"],
  ["75-AUD-05-REALIZATION", "Benefit, harm, burden, and unintended-effect realization"],
  ["75-AUD-06-DISTRIBUTION", "Distributional incidence and affected-group review"],
  ["75-AUD-07-COUNTERFACTUAL", "Counterfactual decision and contribution audit"],
  ["75-AUD-08-ADVERSE", "Adverse event, safeguard, pause, and stop-work review"],
  ["75-AUD-09-CHALLENGE", "Post-decision challenge, complaint, and dissent review"],
  ["75-AUD-10-SUNSET", "Sunset, renewal, termination, and reevaluation enforcement"],
  ["75-AUD-11-REMEDIATION", "Reversal, remediation, compensation, and restoration"],
  ["75-AUD-12-RECEIPT", "Independent audit, receipt, notice, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const safeguardTriggers = [
  ["75-TRG-01-DEADLINE", "Milestone or delivery deadline missed"],
  ["75-TRG-02-BUDGET", "Budget, funding, or cost variance"],
  ["75-TRG-03-CAPACITY", "Workforce, asset, or institutional capacity shortfall"],
  ["75-TRG-04-SCOPE", "Material scope, beneficiary, or implementation deviation"],
  ["75-TRG-05-OUTPUT", "Output acceptance, quality, or reliability failure"],
  ["75-TRG-06-HARM", "Harm, safety, environmental, or burden threshold crossed"],
  ["75-TRG-07-DISTRIBUTION", "Material distributional disparity detected"],
  ["75-TRG-08-STOP", "Safeguard, pause, or stop-work condition activated"],
  ["75-TRG-09-CHALLENGE", "Material challenge, complaint, or contradiction upheld"],
  ["75-TRG-10-AUTHORITY", "Legal, fiscal, policy, or operating authority changed"],
  ["75-TRG-11-EVIDENCE", "Supporting evidence corrected, superseded, or withdrawn"],
  ["75-TRG-12-SUNSET", "Scheduled review, sunset, renewal, or termination date reached"]
].map(([trigger_id, label]) => ({ trigger_id, label }));

const remediationClasses = [
  ["75-REM-01-RECORD", "Correct or supersede the public record"],
  ["75-REM-02-AMEND", "Amend the implementation commitment"],
  ["75-REM-03-RESOURCE", "Adjust resources, capacity, or dependencies"],
  ["75-REM-04-SAFEGUARD", "Escalate a safeguard or monitoring condition"],
  ["75-REM-05-PAUSE", "Pause new activity or expansion"],
  ["75-REM-06-STOP", "Issue stop-work or service restriction"],
  ["75-REM-07-ROLLBACK", "Rollback or reverse the decision"],
  ["75-REM-08-REMEDY", "Provide remedy, compensation, or restoration"],
  ["75-REM-09-REAUTHORIZE", "Require a new authorization decision"],
  ["75-REM-10-TERMINATE", "Terminate or enforce sunset"]
].map(([remediation_class_id, label]) => ({ remediation_class_id, label }));

const translations = phase74.decision_translation_reevaluation_registers;
const synthesisByCohort = new Map(phase74.synthesis_contradiction_dossiers.map((record) => [record.cohort_id, record]));

const decisionAccountabilityDossiers = translations.map((translation, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const synthesis = synthesisByCohort.get(translation.cohort_id);
  const short = synthesis.slug.replace(/^74-syn-\d+-/, "");
  return {
    decision_accountability_dossier_id: "75-DAD-" + padded,
    slug: "75-dad-" + padded + "-" + short,
    record_kind: "decision_accountability_dossier",
    record_status: "Published",
    accountability_state: "Inactive - No Authorized Institutional Decision",
    accountability_decision: "Not Open",
    cohort_id: translation.cohort_id,
    file_id: translation.file_id,
    named_entity: translation.named_entity,
    synthesis_contradiction_dossier_id: synthesis.synthesis_contradiction_dossier_id,
    synthesis_contradiction_dossier_slug: synthesis.slug,
    decision_translation_reevaluation_register_id: translation.decision_translation_reevaluation_register_id,
    phase74_translation_state: translation.translation_state,
    phase74_translation_decision: translation.translation_decision,
    accountability_checks: accountabilityGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No adjudicated Phase 74 translation or authorized institutional decision exists." })),
    implementation_commitment_realization_ledger_ids: [],
    post_decision_audit_remediation_register_id: "75-PAR-" + padded,
    source_ids: synthesis.source_ids,
    signal_ids: synthesis.signal_ids,
    evidence_gap_ids: synthesis.evidence_gap_ids,
    canonical_briefing_id: synthesis.canonical_briefing_id,
    reader_pathway_ids: synthesis.reader_pathway_ids,
    local_system_ids: synthesis.local_system_ids,
    dependency_map_ids: ["dependency-map-adjudicated-result-is-not-decision-recommendation", "dependency-map-recommendation-is-not-authorization-or-implementation", "dependency-map-delivered-output-is-not-realized-benefit"],
    decision_record_id: null,
    decision_version: null,
    decision_owner_records: [],
    authority_record: null,
    exact_decision_question: null,
    selected_option_id: null,
    status_quo_option_id: null,
    option_selection_rationale: null,
    evidence_and_challenge_lineage_ids: [],
    value_judgment_records: [],
    expected_benefit_records: [],
    expected_harm_records: [],
    distributional_assessment_records: [],
    feasibility_assessment_records: [],
    conflict_disclosure_records: [],
    recusal_records: [],
    dissent_archive_ids: [],
    recommendation_id: null,
    authorization_id: null,
    authorization_date: null,
    authorization_terms: [],
    monitoring_plan_id: null,
    sunset_date: null,
    next_review_date: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    accountability_receipt_id: null,
    propagation_status: "not_started",
    automatic_authorization_allowed: false,
    automatic_implementation_allowed: false,
    automatic_sunset_extension_allowed: false,
    automatic_scoring_allowed: false,
    automatic_ranking_allowed: false,
    phase64_cell_change: "none"
  };
});

const decisionByCohort = new Map(decisionAccountabilityDossiers.map((record) => [record.cohort_id, record]));
const implementationCommitmentRealizationLedgers = phase74.result_synthesis_input_dockets.map((input, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const decision = decisionByCohort.get(input.cohort_id);
  const slug = input.slug.replace(/^74-sin-/, "75-icl-");
  const record = {
    implementation_commitment_realization_ledger_id: "75-ICL-" + padded,
    slug,
    record_kind: "implementation_commitment_realization_ledger",
    record_status: "Published",
    commitment_state: "Inactive - No Authorized Decision",
    realization_state: "Inactive - No Implementation Commitment",
    cohort_id: input.cohort_id,
    file_id: input.file_id,
    file_kind: input.file_kind,
    named_entity: input.named_entity,
    measure_id: input.measure_id,
    measure_label: input.measure_label,
    decision_accountability_dossier_id: decision.decision_accountability_dossier_id,
    decision_accountability_dossier_slug: decision.slug,
    result_synthesis_input_docket_id: input.result_synthesis_input_docket_id,
    result_synthesis_input_docket_slug: input.slug,
    implementation_realization_checks: implementationRealizationGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No authorized decision or implementation commitment exists." })),
    safeguard_trigger_records: safeguardTriggers.map((trigger) => ({ trigger_id: trigger.trigger_id, label: trigger.label, trigger_state: "Dormant", event_ids: [] })),
    source_ids: input.source_ids,
    signal_ids: input.signal_ids,
    evidence_gap_ids: input.evidence_gap_ids,
    canonical_briefing_id: input.canonical_briefing_id,
    reader_pathway_ids: input.reader_pathway_ids,
    local_system_ids: input.local_system_ids,
    dependency_map_ids: ["dependency-map-recommendation-is-not-authorization-or-implementation", "dependency-map-delivered-output-is-not-realized-benefit"],
    authorization_id: null,
    commitment_record_id: null,
    commitment_owner_id: null,
    commitment_scope: null,
    beneficiary_records: [],
    amendment_records: [],
    resource_baseline: null,
    capacity_baseline: null,
    outcome_baseline: null,
    budget_commitment_records: [],
    workforce_commitment_records: [],
    asset_commitment_records: [],
    milestone_records: [],
    dependency_records: [],
    safeguard_records: [],
    stop_work_rule_ids: [],
    delivered_output_records: [],
    acceptance_records: [],
    benefit_realization_records: [],
    harm_realization_records: [],
    burden_records: [],
    distributional_monitoring_records: [],
    counterfactual_decision_audit_id: null,
    deviation_records: [],
    incident_records: [],
    complaint_records: [],
    remediation_records: [],
    reversal_record: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    realization_receipt_ids: [],
    propagation_status: "not_started",
    automatic_commitment_creation_allowed: false,
    automatic_benefit_attribution_allowed: false,
    automatic_net_benefit_claim_allowed: false,
    automatic_stage_advance_allowed: false,
    automatic_scoring_allowed: false,
    automatic_ranking_allowed: false,
    phase64_cell_change: "none"
  };
  decision.implementation_commitment_realization_ledger_ids.push(record.implementation_commitment_realization_ledger_id);
  return record;
});

const postDecisionAuditRemediationRegisters = translations.map((translation, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const decision = decisionByCohort.get(translation.cohort_id);
  return {
    post_decision_audit_remediation_register_id: "75-PAR-" + padded,
    record_kind: "post_decision_audit_remediation_register",
    record_status: "Published",
    audit_state: "Inactive - No Authorized Decision",
    audit_decision: "Not Scheduled",
    cohort_id: translation.cohort_id,
    file_id: translation.file_id,
    named_entity: translation.named_entity,
    decision_accountability_dossier_id: decision.decision_accountability_dossier_id,
    implementation_commitment_realization_ledger_ids: decision.implementation_commitment_realization_ledger_ids,
    audit_checks: postDecisionAuditGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No authorized decision exists to audit." })),
    remediation_class_records: remediationClasses.map((item) => ({ ...item, action_state: "Unavailable", event_ids: [], decision_receipt_id: null })),
    audit_plan_id: null,
    audit_period: null,
    compliance_records: [],
    milestone_audit_records: [],
    realization_audit_records: [],
    distributional_audit_records: [],
    counterfactual_decision_audit_records: [],
    safeguard_event_ids: [],
    post_decision_challenge_ids: [],
    sunset_enforcement_record: null,
    reversal_decision_id: null,
    remediation_decision_ids: [],
    compensation_or_restoration_records: [],
    first_auditor_id: null,
    second_auditor_id: null,
    audit_receipt_ids: [],
    propagation_status: "not_started",
    silent_renewal_allowed: false,
    automatic_sunset_extension_allowed: false,
    automatic_remediation_closure_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "75",
  registry_id: "decision-accountability-implementation-realized-impact-audit-registry-001",
  title: "Decision Accountability, Implementation Commitment, Realized Impact And Remediation Registry",
  captured_date: "2026-08-24",
  as_of_date: "2026-08-24",
  scope: "Eight inactive decision-accountability dossiers, thirty-two inactive implementation-commitment and realization ledgers, and eight inactive post-decision audit and remediation registers downstream of Phase 74.",
  interpretation_boundary: "A recommendation is not authorization. Authorization is not implementation. Delivered output is not realized benefit. A benefit claim cannot erase harms, burdens, distribution, dissent, counterfactual uncertainty, safeguards, sunset, reversal, or remediation duties.",
  accountability_gates: accountabilityGates,
  implementation_realization_gates: implementationRealizationGates,
  post_decision_audit_gates: postDecisionAuditGates,
  safeguard_triggers: safeguardTriggers,
  remediation_classes: remediationClasses,
  accountability_states: ["Inactive - No Authorized Institutional Decision", "Under Accountability Review", "Held", "Authorized With Conditions", "Authorized", "Rejected", "Sunset", "Reversed", "Superseded"],
  commitment_states: ["Inactive - No Authorized Decision", "Commitment Drafted", "Commitment Authorized", "In Delivery", "Held", "Paused", "Stopped", "Completed", "Superseded"],
  realization_states: ["Inactive - No Implementation Commitment", "Baseline Registered", "Monitoring Active", "Under Audit", "Benefit And Harm Decision Pending", "Bounded Realization Published", "Held", "Corrected", "Withdrawn"],
  audit_states: ["Inactive - No Authorized Decision", "Audit Scheduled", "Under Audit", "Held", "Remediation Required", "Reauthorization Required", "Sunset Enforced", "Closed With Receipt"],
  metrics: {
    decision_accountability_dossiers: decisionAccountabilityDossiers.length,
    inactive_decision_accountability_dossiers: decisionAccountabilityDossiers.length,
    implementation_commitment_realization_ledgers: implementationCommitmentRealizationLedgers.length,
    inactive_implementation_commitment_realization_ledgers: implementationCommitmentRealizationLedgers.length,
    post_decision_audit_remediation_registers: postDecisionAuditRemediationRegisters.length,
    inactive_post_decision_audit_remediation_registers: postDecisionAuditRemediationRegisters.length,
    accountability_gates: accountabilityGates.length,
    implementation_realization_gates: implementationRealizationGates.length,
    post_decision_audit_gates: postDecisionAuditGates.length,
    safeguard_triggers: safeguardTriggers.length,
    remediation_classes: remediationClasses.length,
    authorized_decisions_received: 0,
    decision_owners_recorded: 0,
    option_rationales_recorded: 0,
    conflicts_or_recusals_recorded: 0,
    dissents_archived: 0,
    implementation_commitments_recorded: 0,
    baselines_registered: 0,
    milestones_recorded: 0,
    safeguard_events_recorded: 0,
    stop_work_events_recorded: 0,
    delivered_outputs_recorded: 0,
    benefits_adjudicated: 0,
    harms_adjudicated: 0,
    distributional_findings_adjudicated: 0,
    counterfactual_decision_audits_completed: 0,
    post_decision_challenges_received: 0,
    sunsets_enforced: 0,
    reversals_issued: 0,
    remediations_issued: 0,
    corrections_issued: 0,
    withdrawals_issued: 0,
    receipts_created: 0,
    scores_created: 0,
    rankings_created: 0,
    phase64_cells_advanced: 0
  },
  decision_accountability_dossiers: decisionAccountabilityDossiers,
  implementation_commitment_realization_ledgers: implementationCommitmentRealizationLedgers,
  post_decision_audit_remediation_registers: postDecisionAuditRemediationRegisters
};

await writeJson(join(dataRoot, "phase-75-decision-accountability-realized-impact-registry.json"), registry);

const guideIds = [
  "briefing-decision-accountability-desk-001",
  "briefing-implementation-commitment-ledger-001",
  "briefing-realized-impact-audit-001",
  "briefing-reversal-remediation-desk-001"
];
const mapIds = [
  "dependency-map-recommendation-is-not-authorization-or-implementation",
  "dependency-map-delivered-output-is-not-realized-benefit"
];
const pathwayIds = [...new Set(implementationCommitmentRealizationLedgers.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, ...guideIds])];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, ...mapIds])];
  await writeJson(path, pathway);
}

for (const decision of decisionAccountabilityDossiers) {
  const ledgers = implementationCommitmentRealizationLedgers.filter((record) => record.cohort_id === decision.cohort_id);
  const path = join(contentRoot, "briefings", decision.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 75 decision accountability and realized-impact boundary")) {
    body = body.trimEnd() + "\n\n## Phase 75 decision accountability and realized-impact boundary\n\n[Decision Accountability Desk 001](/briefings/decision-accountability-desk-001/) assigns [" + decision.decision_accountability_dossier_id + "](/evidence/accountability/" + decision.slug + "/) and four inactive implementation-and-realization ledgers to this named file: " + ledgers.map((record) => "[" + record.implementation_commitment_realization_ledger_id + "](/evidence/accountability/" + record.slug + "/)").join(", ") + ". No decision owner, authority, option rationale, implementation commitment, resource or capacity baseline, safeguard event, output, benefit, harm, distributional finding, audit, reversal, remediation, reviewer, receipt, score, rank, or Phase 64 cell change exists.\n";
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
  const decisions = decisionAccountabilityDossiers.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 75 accountability and impact boundary")) {
    body = body.trimEnd() + "\n\n## Phase 75 accountability and impact boundary\n\nThe [Decision Accountability And Realized Impact Registry](/evidence/accountability/) publishes inactive decision-owner, authority, commitment, baseline, safeguard, distributional-monitoring, realization, sunset, audit, reversal, and remediation contracts for " + decisions.map((record) => record.named_entity).join(" and ") + ". A recommendation, authorization, delivered output, or reported benefit cannot cross those boundaries automatically.\n";
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-evidence-synthesis-desk-001.mdx",
  "briefing-challenge-decision-translation-desk-001.mdx",
  "briefing-result-adjudication-desk-001.mdx",
  "briefing-outcome-evidence-packet-desk-001.mdx",
  "briefing-counterfactual-design-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx",
  "briefing-conversion-stage-matrix-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 75 accountability, implementation, and impact audit")) {
    body = body.trimEnd() + "\n\n## Phase 75 accountability, implementation, and impact audit\n\nThe [Decision Accountability Desk](/briefings/decision-accountability-desk-001/), [Implementation Commitment Ledger](/briefings/implementation-commitment-ledger-001/), [Realized Impact Audit](/briefings/realized-impact-audit-001/), and [Reversal And Remediation Desk](/briefings/reversal-remediation-desk-001/) add eight inactive accountability dossiers, thirty-two inactive commitment-and-realization ledgers, and eight inactive audit/remediation registers. They create zero authorized decisions, owners, rationales, commitments, baselines, safeguards, outputs, benefits, harms, distributional findings, audits, reversals, remediations, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

console.log("Phase 75 content built: " + decisionAccountabilityDossiers.length + " inactive accountability dossiers, " + implementationCommitmentRealizationLedgers.length + " inactive commitment-realization ledgers, " + postDecisionAuditRemediationRegisters.length + " inactive audit-remediation registers, " + accountabilityGates.length + " accountability gates, " + implementationRealizationGates.length + " implementation-realization gates, " + postDecisionAuditGates.length + " audit gates, " + safeguardTriggers.length + " safeguard triggers, " + remediationClasses.length + " remediation classes, " + pathwayIds.length + " pathways, and 0 authorized decisions or realized impacts.");
