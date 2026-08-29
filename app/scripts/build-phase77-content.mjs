import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");

const phase76 = await readJson(join(dataRoot, "phase-76-cross-case-learning-portfolio-policy-retirement-registry.json"));
const learning = phase76.institutional_learning_dossiers;

const standingNoticeGates = [
  ["77-STN-01-TRIGGER", "Admitted Phase 76 finding and real public decision question"],
  ["77-STN-02-AUTHORITY", "Convening authority, legal duty, and decision scope"],
  ["77-STN-03-DECISION", "Proposed decision, alternatives, status quo, and reversible boundary"],
  ["77-STN-04-AFFECTED", "Directly affected people, users, workers, and institutions"],
  ["77-STN-05-RIGHTS", "Rights holders, Indigenous nations, treaty duties, and consent boundary"],
  ["77-STN-06-BURDEN", "Environmental-justice, cumulative-burden, and distribution review"],
  ["77-STN-07-FUTURE", "Future users, youth, and intergenerational interests"],
  ["77-STN-08-EXPERT", "Technical, scientific, operational, and local-knowledge standing"],
  ["77-STN-09-DISSENT", "Dissenting, minority, excluded, and hard-to-reach groups"],
  ["77-STN-10-NOTICE", "Notice content, timing, channels, languages, and reach"],
  ["77-STN-11-ACCESS", "Disability access, interpretation, format, location, time, and technology"],
  ["77-STN-12-SUPPORT", "Participation support, compensation, childcare, travel, and connectivity"],
  ["77-STN-13-DATA", "Privacy, safety, attribution, retention, and public-record boundaries"],
  ["77-STN-14-CHALLENGE", "Standing challenge, correction, escalation, and independent review"],
  ["77-STN-15-DUAL", "Independent second review and conflict disclosure"],
  ["77-STN-16-RECEIPT", "Standing decision, notice receipt, archive, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const deliberationGates = [
  ["77-DEL-01-AUTHORIZATION", "Authorized process, decision owner, scope, and calendar"],
  ["77-DEL-02-NOTICE", "Completed notice, access, language, and outreach obligations"],
  ["77-DEL-03-STANDING", "Versioned standing decisions and unresolved challenges"],
  ["77-DEL-04-RECORD", "Common evidence record, provenance, limits, and corrections"],
  ["77-DEL-05-ALTERNATIVES", "Real alternatives, status quo, deferral, and no-action option"],
  ["77-DEL-06-CONSULTATION", "Consultation method, duration, facilitation, and response channel"],
  ["77-DEL-07-CONSENT", "Consultation, accommodation, consent, and authority kept distinct"],
  ["77-DEL-08-COMMENT", "Public-comment intake, identity protection, deduplication, and version"],
  ["77-DEL-09-HEARING", "Community, workforce, service-user, and technical hearing record"],
  ["77-DEL-10-EVIDENCE", "Supporting, contrary, local, technical, and experiential evidence"],
  ["77-DEL-11-HARM", "Harm, burden, safety, exclusion, and distributional issue coverage"],
  ["77-DEL-12-FUTURE", "Intergenerational, future-user, resilience, and option-value review"],
  ["77-DEL-13-ISSUES", "Normalized issue matrix without collapsing distinct positions"],
  ["77-DEL-14-REASON", "Reasoned response to every material issue and alternative"],
  ["77-DEL-15-DISSENT", "Minority rationale, unresolved disagreement, and non-consensus record"],
  ["77-DEL-16-QUALITY", "Participation-quality assessment without volume-as-legitimacy scoring"],
  ["77-DEL-17-DUAL", "Independent response review and conflict disclosure"],
  ["77-DEL-18-RECEIPT", "Process closure receipt, archive, notice, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const mandateAppealGates = [
  ["77-MAN-01-RECORD", "Complete participation and reasoned-response record"],
  ["77-MAN-02-AUTHORITY", "Decision authority, jurisdiction, duty, and limit"],
  ["77-MAN-03-PROCEDURE", "Required notice, consultation, hearing, and consent procedure"],
  ["77-MAN-04-STANDING", "Standing coverage, exclusions, and unresolved challenges"],
  ["77-MAN-05-ACCESS", "Accessibility, language, support, safety, and data protections"],
  ["77-MAN-06-EVIDENCE", "Evidence quality, uncertainty, corrections, and adverse record"],
  ["77-MAN-07-REASONS", "Public reasons linked to material issues and alternatives"],
  ["77-MAN-08-RIGHTS", "Rights, treaty, consent, accommodation, and remedy boundaries"],
  ["77-MAN-09-DISTRIBUTION", "Benefit, harm, burden, exclusion, and distribution assessment"],
  ["77-MAN-10-DISSENT", "Dissent, minority rationale, non-consensus, and unresolved dispute"],
  ["77-MAN-11-PROPORTION", "Proportionality, least-harmful option, safeguards, and conditions"],
  ["77-MAN-12-APPEAL", "Appeal, reconsideration, stay, escalation, and remedy path"],
  ["77-MAN-13-DURATION", "Mandate duration, sunset, review date, and reopening obligation"],
  ["77-MAN-14-INDEPENDENCE", "Independent legitimacy audit and conflict disclosure"],
  ["77-MAN-15-DECISION", "Separate mandate decision with explicit limits and residual dissent"],
  ["77-MAN-16-RECEIPT", "Decision receipt, public notice, archive, and propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const adaptiveReviewGates = [
  ["77-ADP-01-MANDATE", "Authorized public mandate, version, owner, and conditions"],
  ["77-ADP-02-BASELINE", "Decision, outcome, harm, burden, access, and distribution baselines"],
  ["77-ADP-03-INDICATOR", "Review indicators, denominators, thresholds, and missingness"],
  ["77-ADP-04-MONITOR", "Observation, complaint, incident, challenge, and evidence intake"],
  ["77-ADP-05-TRIGGER", "Time, performance, harm, context, authority, and appeal triggers"],
  ["77-ADP-06-NOTICE", "Reopening notice, standing refresh, access, and record update"],
  ["77-ADP-07-CHANGE", "Material-change, new-evidence, and changed-population assessment"],
  ["77-ADP-08-IMPACT", "Updated benefit, harm, burden, distribution, and future-user review"],
  ["77-ADP-09-OPTIONS", "Continue, condition, pause, amend, reverse, sunset, and retire options"],
  ["77-ADP-10-REASON", "Reasoned response to new evidence, dissent, and appeal"],
  ["77-ADP-11-REMEDY", "Safeguard, remedy, compensation, restoration, and residual duties"],
  ["77-ADP-12-INDEPENDENCE", "Independent review, conflict disclosure, and minority rationale"],
  ["77-ADP-13-DECISION", "Separate adaptive-mandate decision and effective date"],
  ["77-ADP-14-RECEIPT", "Receipt, notice, permanent archive, and downstream propagation"]
].map(([gate_id, label]) => ({ gate_id, label }));

const constituencyClasses = [
  ["77-CST-01-RESIDENT", "Directly affected residents and communities"],
  ["77-CST-02-INDIGENOUS", "Indigenous nations, treaty partners, and rights holders"],
  ["77-CST-03-WORKER", "Workers, labor organizations, and occupational groups"],
  ["77-CST-04-USER", "Service users, disabled people, caregivers, and accessibility advocates"],
  ["77-CST-05-JUSTICE", "Environmental-justice and cumulative-burden communities"],
  ["77-CST-06-AUTHORITY", "Local, regional, regulatory, and public-service authorities"],
  ["77-CST-07-SUPPLY", "Suppliers, contractors, small businesses, and supply-chain participants"],
  ["77-CST-08-EXPERT", "Technical, scientific, professional, and local-knowledge experts"],
  ["77-CST-09-SAFETY", "Safety, emergency, health, and incident-response actors"],
  ["77-CST-10-PAYER", "Taxpayers, ratepayers, customers, and public-asset owners"],
  ["77-CST-11-FUTURE", "Youth, future users, and intergenerational interests"],
  ["77-CST-12-DISSENT", "Dissenting, minority, excluded, and hard-to-reach groups"]
].map(([constituency_class_id, label]) => ({ constituency_class_id, label }));

const issueClasses = [
  ["77-ISS-01-SCOPE", "Decision scope, authority, timing, and jurisdiction"],
  ["77-ISS-02-ALTERNATIVE", "Alternatives, status quo, deferral, and no action"],
  ["77-ISS-03-EVIDENCE", "Evidence, uncertainty, methods, corrections, and missingness"],
  ["77-ISS-04-BENEFIT", "Intended outputs, benefits, access, and durability"],
  ["77-ISS-05-HARM", "Safety, harm, failure, burden, and unintended effect"],
  ["77-ISS-06-DISTRIBUTION", "Distribution, exclusion, affordability, and cumulative burden"],
  ["77-ISS-07-ACCESS", "Notice, accessibility, language, participation support, and privacy"],
  ["77-ISS-08-RIGHTS", "Rights, treaty duties, consultation, accommodation, and consent"],
  ["77-ISS-09-WORKFORCE", "Workforce, labor, skills, displacement, and supply chain"],
  ["77-ISS-10-ENVIRONMENT", "Land, water, climate, restoration, and environmental justice"],
  ["77-ISS-11-IMPLEMENT", "Resources, dependencies, safeguards, implementation, and remedy"],
  ["77-ISS-12-REVIEW", "Appeal, monitoring, adaptive review, sunset, reversal, and retirement"]
].map(([issue_class_id, label]) => ({ issue_class_id, label }));

const participationQualityDimensions = [
  ["77-QLT-01-REACH", "Reach to identified constituencies"],
  ["77-QLT-02-ACCESS", "Accessibility, language, format, time, and location"],
  ["77-QLT-03-SUPPORT", "Material support and barriers to participation"],
  ["77-QLT-04-SAFETY", "Privacy, safety, non-retaliation, and data protection"],
  ["77-QLT-05-RECORD", "Evidence access, provenance, correction, and intelligibility"],
  ["77-QLT-06-ALTERNATIVE", "Real choice among alternatives including no action"],
  ["77-QLT-07-VOICE", "Opportunity to submit, question, deliberate, and dissent"],
  ["77-QLT-08-INFLUENCE", "Traceable influence on issues, reasons, conditions, or decision"],
  ["77-QLT-09-RESPONSE", "Completeness and specificity of reasoned responses"],
  ["77-QLT-10-POWER", "Power imbalance, conflict, capture, and exclusion review"],
  ["77-QLT-11-REMEDY", "Challenge, appeal, reconsideration, and remedy availability"],
  ["77-QLT-12-LEARNING", "Feedback, process correction, and future participation improvement"]
].map(([quality_dimension_id, label]) => ({ quality_dimension_id, label }));

const appealGrounds = [
  ["77-APL-01-STANDING", "Standing denial, exclusion, or constituency omission"],
  ["77-APL-02-NOTICE", "Insufficient notice, accessibility, language, or support"],
  ["77-APL-03-RECORD", "Material record omission, correction, or provenance failure"],
  ["77-APL-04-EVIDENCE", "Unsupported inference, uncertainty, or adverse-evidence omission"],
  ["77-APL-05-REASON", "Missing or inadequate reasoned response"],
  ["77-APL-06-RIGHTS", "Rights, treaty, consultation, accommodation, or consent breach"],
  ["77-APL-07-CONFLICT", "Conflict of interest, capture, bias, or reviewer independence"],
  ["77-APL-08-PROCEDURE", "Procedural departure, unequal treatment, or record integrity"],
  ["77-APL-09-BURDEN", "Disproportionate harm, burden, exclusion, or inadequate remedy"],
  ["77-APL-10-CHANGE", "New evidence, changed conditions, incident, or implementation failure"]
].map(([appeal_ground_id, label]) => ({ appeal_ground_id, label }));

const adaptiveTriggers = [
  ["77-TRG-01-TIME", "Scheduled review, sunset, expiry, or elapsed-time trigger"],
  ["77-TRG-02-PERFORMANCE", "Output, outcome, service, reliability, or quality threshold"],
  ["77-TRG-03-HARM", "Harm, burden, exclusion, complaint, or remedy threshold"],
  ["77-TRG-04-DISTRIBUTION", "Distributional disparity or cumulative-burden change"],
  ["77-TRG-05-INCIDENT", "Safety, security, environmental, operational, or rights incident"],
  ["77-TRG-06-CONTEXT", "Material population, geography, market, or operating change"],
  ["77-TRG-07-TECHNOLOGY", "Technology, version, threat, maturity, or obsolescence change"],
  ["77-TRG-08-AUTHORITY", "Legal, regulatory, treaty, jurisdiction, or authority change"],
  ["77-TRG-09-CAPACITY", "Fiscal, workforce, infrastructure, institutional, or service-capacity change"],
  ["77-TRG-10-DEPENDENCY", "Supplier, resource, permission, or common-mode dependency change"],
  ["77-TRG-11-CHALLENGE", "Material public challenge, appeal, dissent, or new evidence"],
  ["77-TRG-12-FUTURE", "Intergenerational, resilience, option-value, or irreversible-impact change"]
].map(([trigger_id, label]) => ({ trigger_id, label }));

const shortName = (record) => record.slug.replace(/^76-ild-\d+-/, "");
const inactiveChecks = (gates, basis) => gates.map((gate) => ({ ...gate, decision_state: "Inactive", basis }));

const stakeholderStandingNoticeRegisters = learning.map((item, index) => {
  const padded = String(index + 1).padStart(3, "0");
  return {
    stakeholder_standing_notice_register_id: "77-SSR-" + padded,
    slug: "77-ssr-" + padded + "-" + shortName(item),
    record_kind: "stakeholder_standing_notice_register",
    record_status: "Published",
    standing_state: "Inactive - No Admitted Cross-Case Finding",
    opening_decision: "Not Open",
    cohort_id: item.cohort_id,
    file_id: item.file_id,
    named_entity: item.named_entity,
    institutional_learning_dossier_id: item.institutional_learning_dossier_id,
    phase76_learning_state: item.learning_state,
    phase76_portfolio_governance_register_ids: item.portfolio_governance_register_ids,
    phase76_policy_retirement_ledger_id: item.policy_supersession_retirement_ledger_id,
    standing_notice_checks: inactiveChecks(standingNoticeGates, "No admitted Phase 76 transfer or non-transfer finding is connected to a real public decision question."),
    constituency_standing_records: constituencyClasses.map((entry) => ({ ...entry, standing_state: "Unassessed", claimant_ids: [], evidence_ids: [], challenge_ids: [] })),
    source_ids: item.source_ids,
    signal_ids: item.signal_ids,
    evidence_gap_ids: item.evidence_gap_ids,
    canonical_briefing_id: item.canonical_briefing_id,
    reader_pathway_ids: item.reader_pathway_ids,
    local_system_ids: item.local_system_ids,
    admitted_cross_case_finding_ids: [],
    public_decision_question: null,
    convening_authority_id: null,
    decision_scope_record: null,
    stakeholder_inventory_records: [],
    rights_and_treaty_records: [],
    standing_decision_records: [],
    notice_plan_id: null,
    accessibility_plan_id: null,
    participation_support_plan_id: null,
    privacy_and_safety_plan_id: null,
    standing_challenge_records: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    standing_notice_receipt_id: null,
    propagation_status: "not_started",
    automatic_standing_allowed: false,
    automatic_exclusion_allowed: false,
    participation_volume_as_legitimacy_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const deliberationIssueResponseDockets = stakeholderStandingNoticeRegisters.map((item, index) => {
  const source = learning[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    deliberation_issue_response_docket_id: "77-DIR-" + padded,
    slug: "77-dir-" + padded + "-" + shortName(source),
    record_kind: "deliberation_issue_response_docket",
    record_status: "Published",
    deliberation_state: "Inactive - No Authorized Participation Process",
    process_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    stakeholder_standing_notice_register_id: item.stakeholder_standing_notice_register_id,
    institutional_learning_dossier_id: source.institutional_learning_dossier_id,
    deliberation_checks: inactiveChecks(deliberationGates, "No admitted cross-case finding, completed standing decision, notice receipt, or authorized participation process exists."),
    issue_matrix_records: issueClasses.map((entry) => ({ ...entry, issue_state: "Unopened", submission_ids: [], evidence_ids: [], response_record_id: null, dissent_record_ids: [] })),
    participation_quality_records: participationQualityDimensions.map((entry) => ({ ...entry, measurement_state: "Not Measured", evidence_ids: [], finding_id: null })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    process_authorization_id: null,
    process_calendar: null,
    common_record_version_id: null,
    consultation_records: [],
    consent_boundary_records: [],
    public_comment_records: [],
    affected_community_hearing_records: [],
    workforce_hearing_records: [],
    service_user_accessibility_hearing_records: [],
    technical_expert_hearing_records: [],
    intergenerational_review_records: [],
    material_issue_records: [],
    reasoned_response_records: [],
    dissent_and_non_consensus_records: [],
    quality_assessment_record: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    deliberation_receipt_id: null,
    propagation_status: "not_started",
    automatic_consensus_allowed: false,
    automatic_consent_allowed: false,
    comment_count_as_weight_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const mandateLegitimacyAppealRegisters = deliberationIssueResponseDockets.map((item, index) => {
  const source = learning[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    mandate_legitimacy_appeal_register_id: "77-MLA-" + padded,
    slug: "77-mla-" + padded + "-" + shortName(source),
    record_kind: "mandate_legitimacy_appeal_register",
    record_status: "Published",
    mandate_state: "Inactive - No Completed Reasoned-Response Record",
    mandate_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    deliberation_issue_response_docket_id: item.deliberation_issue_response_docket_id,
    stakeholder_standing_notice_register_id: stakeholderStandingNoticeRegisters[index].stakeholder_standing_notice_register_id,
    mandate_legitimacy_checks: inactiveChecks(mandateAppealGates, "No completed participation record, reasoned-response docket, or appeal-ready mandate question exists."),
    appeal_ground_records: appealGrounds.map((entry) => ({ ...entry, ground_state: "Unavailable", appeal_ids: [], decision_ids: [], remedy_ids: [] })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    completed_reasoned_response_ids: [],
    authority_record: null,
    procedure_compliance_record: null,
    standing_coverage_record: null,
    accessibility_finding_record: null,
    rights_and_consent_finding_record: null,
    distributional_finding_record: null,
    proportionality_record: null,
    dissent_record_ids: [],
    appeal_records: [],
    reconsideration_records: [],
    stay_records: [],
    remedy_records: [],
    legitimacy_audit_record: null,
    mandate_terms: null,
    mandate_conditions: [],
    mandate_start_date: null,
    mandate_end_or_review_date: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    mandate_receipt_id: null,
    propagation_status: "not_started",
    automatic_legitimacy_allowed: false,
    automatic_mandate_allowed: false,
    automatic_appeal_disposition_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const adaptiveMandateReviewLedgers = mandateLegitimacyAppealRegisters.map((item, index) => {
  const source = learning[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    adaptive_mandate_review_ledger_id: "77-AMR-" + padded,
    slug: "77-amr-" + padded + "-" + shortName(source),
    record_kind: "adaptive_mandate_review_ledger",
    record_status: "Published",
    adaptive_state: "Inactive - No Authorized Public Mandate",
    review_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    mandate_legitimacy_appeal_register_id: item.mandate_legitimacy_appeal_register_id,
    deliberation_issue_response_docket_id: deliberationIssueResponseDockets[index].deliberation_issue_response_docket_id,
    adaptive_review_checks: inactiveChecks(adaptiveReviewGates, "No authorized public mandate, conditions, baseline, indicator, or review date exists."),
    adaptive_trigger_records: adaptiveTriggers.map((entry) => ({ ...entry, trigger_state: "Dormant", event_ids: [], review_id: null })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    authorized_mandate_id: null,
    mandate_version: null,
    mandate_owner_id: null,
    mandate_condition_records: [],
    baseline_records: [],
    review_indicator_records: [],
    scheduled_review_date: null,
    sunset_date: null,
    monitoring_records: [],
    trigger_event_records: [],
    reopened_standing_records: [],
    updated_notice_records: [],
    changed_condition_records: [],
    updated_impact_records: [],
    adaptive_option_records: [],
    reasoned_response_records: [],
    safeguard_and_remedy_records: [],
    adaptive_decision_record: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    adaptive_review_receipt_id: null,
    propagation_status: "not_started",
    silent_renewal_allowed: false,
    automatic_mandate_extension_allowed: false,
    automatic_trigger_disposition_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "77",
  registry_id: "public-deliberation-participatory-governance-adaptive-mandate-registry-001",
  title: "Public Deliberation, Participatory Governance And Adaptive Mandate Registry",
  captured_date: "2026-08-24",
  as_of_date: "2026-08-24",
  scope: "Eight inactive stakeholder-standing and notice registers, eight inactive deliberation and reasoned-response dockets, eight inactive mandate-legitimacy and appeal registers, and eight inactive adaptive-mandate review ledgers downstream of Phase 76.",
  interpretation_boundary: "Notice is not accessible participation. Consultation is not consent. Comment volume is not evidence weight. Participation is not consensus, legitimacy, authorization, or a permanent mandate. Every standing, response, appeal, mandate, and adaptive-review decision remains separate and reviewable.",
  activation_rule: "At least one admitted Phase 76 transfer or non-transfer finding must be connected to a real portfolio or policy question before standing can be opened. Standing, notice, participation, reasoned response, legitimacy audit, appeal, mandate, and adaptive review then require separate human decisions and receipts.",
  standing_notice_gates: standingNoticeGates,
  deliberation_gates: deliberationGates,
  mandate_appeal_gates: mandateAppealGates,
  adaptive_review_gates: adaptiveReviewGates,
  constituency_classes: constituencyClasses,
  issue_classes: issueClasses,
  participation_quality_dimensions: participationQualityDimensions,
  appeal_grounds: appealGrounds,
  adaptive_triggers: adaptiveTriggers,
  standing_states: ["Inactive - No Admitted Cross-Case Finding", "Under Standing Review", "Held", "Standing Determined", "Corrected", "Withdrawn"],
  deliberation_states: ["Inactive - No Authorized Participation Process", "Notice Open", "Consultation Open", "Hearing Open", "Response Drafted", "Under Independent Review", "Closed With Receipt", "Corrected"],
  mandate_states: ["Inactive - No Completed Reasoned-Response Record", "Under Legitimacy Audit", "Appeal Open", "Held", "Mandate Proposed", "Mandate Authorized With Conditions", "Mandate Denied", "Reconsideration Ordered", "Corrected"],
  adaptive_states: ["Inactive - No Authorized Public Mandate", "Monitoring", "Trigger Under Review", "Reopened", "Continued With Conditions", "Amended", "Paused", "Reversed", "Sunset", "Retired"],
  metrics: {
    stakeholder_standing_notice_registers: stakeholderStandingNoticeRegisters.length,
    deliberation_issue_response_dockets: deliberationIssueResponseDockets.length,
    mandate_legitimacy_appeal_registers: mandateLegitimacyAppealRegisters.length,
    adaptive_mandate_review_ledgers: adaptiveMandateReviewLedgers.length,
    standing_notice_gates: standingNoticeGates.length,
    deliberation_gates: deliberationGates.length,
    mandate_appeal_gates: mandateAppealGates.length,
    adaptive_review_gates: adaptiveReviewGates.length,
    constituency_classes: constituencyClasses.length,
    issue_classes: issueClasses.length,
    participation_quality_dimensions: participationQualityDimensions.length,
    appeal_grounds: appealGrounds.length,
    adaptive_triggers: adaptiveTriggers.length,
    admitted_cross_case_findings_received: 0,
    standing_decisions_issued: 0,
    notice_plans_activated: 0,
    authorized_participation_processes: 0,
    comments_received: 0,
    hearings_completed: 0,
    consultation_records_created: 0,
    consent_findings_issued: 0,
    material_issues_opened: 0,
    reasoned_responses_issued: 0,
    participation_quality_findings: 0,
    legitimacy_audits_completed: 0,
    appeals_received: 0,
    mandates_authorized: 0,
    adaptive_reviews_opened: 0,
    mandate_changes_issued: 0,
    receipts_created: 0,
    scores_created: 0,
    rankings_created: 0,
    phase64_cells_advanced: 0
  },
  stakeholder_standing_notice_registers: stakeholderStandingNoticeRegisters,
  deliberation_issue_response_dockets: deliberationIssueResponseDockets,
  mandate_legitimacy_appeal_registers: mandateLegitimacyAppealRegisters,
  adaptive_mandate_review_ledgers: adaptiveMandateReviewLedgers
};

await writeJson(join(dataRoot, "phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json"), registry);

const guideIds = [
  "briefing-community-standing-affected-publics-001",
  "briefing-indigenous-treaty-consultation-boundaries-001",
  "briefing-worker-supply-chain-voice-001",
  "briefing-accessibility-service-user-participation-001",
  "briefing-environmental-justice-cumulative-burden-deliberation-001",
  "briefing-technical-expert-public-knowledge-001",
  "briefing-public-reason-issue-response-001",
  "briefing-dissent-appeal-reconsideration-001",
  "briefing-intergenerational-future-user-review-001",
  "briefing-adaptive-democratic-mandate-001"
];
const mapIds = [
  "dependency-map-notice-is-not-accessible-participation",
  "dependency-map-participation-volume-is-not-consent-or-legitimacy",
  "dependency-map-comment-count-is-not-reasoned-response",
  "dependency-map-mandate-is-not-permanent-authorization"
];
const pathwayIds = [...new Set(learning.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, ...guideIds])];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, ...mapIds])];
  await writeJson(path, pathway);
}

for (const item of learning) {
  const standing = stakeholderStandingNoticeRegisters.find((record) => record.cohort_id === item.cohort_id);
  const deliberation = deliberationIssueResponseDockets.find((record) => record.cohort_id === item.cohort_id);
  const mandate = mandateLegitimacyAppealRegisters.find((record) => record.cohort_id === item.cohort_id);
  const adaptive = adaptiveMandateReviewLedgers.find((record) => record.cohort_id === item.cohort_id);
  const path = join(contentRoot, "briefings", item.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 77 public-deliberation and adaptive-mandate boundary")) {
    body = body.trimEnd() + "\n\n## Phase 77 public-deliberation and adaptive-mandate boundary\n\nThe [Public Deliberation Registry](/evidence/deliberation/) assigns [" + standing.stakeholder_standing_notice_register_id + "](/evidence/deliberation/" + standing.slug + "/), [" + deliberation.deliberation_issue_response_docket_id + "](/evidence/deliberation/" + deliberation.slug + "/), [" + mandate.mandate_legitimacy_appeal_register_id + "](/evidence/deliberation/" + mandate.slug + "/), and [" + adaptive.adaptive_mandate_review_ledger_id + "](/evidence/deliberation/" + adaptive.slug + "/) to this named file. No standing, notice, consultation, consent, comment, hearing, reasoned response, legitimacy, appeal, mandate, adaptive review, receipt, score, rank, or Phase 64 cell change exists.\n";
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
  const localRecords = stakeholderStandingNoticeRegisters.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 77 affected-public and adaptive-mandate boundary")) {
    body = body.trimEnd() + "\n\n## Phase 77 affected-public and adaptive-mandate boundary\n\nThe [Public Deliberation Registry](/evidence/deliberation/) connects " + localRecords.map((record) => record.named_entity).join(" and ") + " to standing, notice, accessibility, consultation, workforce, service-user, environmental-justice, future-user, dissent, appeal, and adaptive-review controls. Proximity, comment volume, or process completion does not establish consent, legitimacy, benefit, authority, or a durable mandate.\n";
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
  "briefing-institutional-memory-negative-results-001.mdx",
  "briefing-policy-retirement-decommissioning-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 77 participation, public reason, and adaptive mandate control")) {
    body = body.trimEnd() + "\n\n## Phase 77 participation, public reason, and adaptive mandate control\n\nThe [Public Deliberation Registry](/evidence/deliberation/) adds eight inactive standing and notice registers, eight inactive deliberation and response dockets, eight inactive mandate and appeal registers, and eight inactive adaptive-review ledgers. It preserves rights, access, consultation, consent boundaries, comments, hearings, dissent, appeals, future-user interests, and reopening duties while creating zero standing decisions, participation records, reasoned responses, legitimacy findings, mandates, adaptive reviews, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

console.log("Phase 77 content built: " + stakeholderStandingNoticeRegisters.length + " inactive standing registers, " + deliberationIssueResponseDockets.length + " inactive deliberation dockets, " + mandateLegitimacyAppealRegisters.length + " inactive mandate-appeal registers, " + adaptiveMandateReviewLedgers.length + " inactive adaptive-review ledgers, " + pathwayIds.length + " pathways, and 0 participation, legitimacy, mandate, appeal, or adaptive-review outcomes.");
