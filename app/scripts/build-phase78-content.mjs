import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase77 = await readJson(join(dataRoot, "phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json"));
const upstream = phase77.adaptive_mandate_review_ledgers;
const shortName = (record) => record.slug.replace(/^77-amr-\d+-/, "");
const inactiveChecks = (gates, basis) => gates.map((gate) => ({ ...gate, decision_state: "Inactive", basis }));

const authorityExternalityGates = [
  ["78-AEX-01-MANDATE", "Authorized, time-bounded Phase 77 public mandate and receipt"],
  ["78-AEX-02-QUESTION", "Real multi-authority question, geography, population, and service boundary"],
  ["78-AEX-03-AUTHORITY", "Constitutional, statutory, regulatory, municipal, contractual, and emergency authority"],
  ["78-AEX-04-INDIGENOUS", "Indigenous jurisdiction, treaty relationship, rights, consultation, and consent boundary"],
  ["78-AEX-05-COMPETENCE", "Exclusive, concurrent, delegated, retained, and contested competence"],
  ["78-AEX-06-DUTY", "Mandatory, discretionary, fiduciary, service, fiscal, and residual duties"],
  ["78-AEX-07-ASSET", "Shared asset, network, corridor, watershed, supply chain, and data boundary"],
  ["78-AEX-08-FLOW", "Cross-border people, service, resource, risk, cost, and benefit flows"],
  ["78-AEX-09-EXTERNALITY", "Exported harm, imported burden, spillover benefit, and displaced risk"],
  ["78-AEX-10-STANDING", "Affected-public and rights-holder standing across every jurisdiction"],
  ["78-AEX-11-EVIDENCE", "Common evidence record, incompatible measures, uncertainty, and missingness"],
  ["78-AEX-12-SCENARIO", "Status quo, unilateral action, joint action, no-action, and exit scenarios"],
  ["78-AEX-13-CONFLICT", "Conflict, capture, forum selection, and independent review"],
  ["78-AEX-14-TIME", "Duration, sequence, expiry, succession, and changed-authority review"],
  ["78-AEX-15-DUAL", "Independent jurisdiction and externality review"],
  ["78-AEX-16-RECEIPT", "Mapping decision, dissent, archive, public notice, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const compactContributionGates = [
  ["78-PVC-01-MAP", "Completed jurisdiction and externality map"],
  ["78-PVC-02-PARTIES", "Authorized parties, representatives, signatories, and non-parties"],
  ["78-PVC-03-PURPOSE", "Joint question, public purpose, scope, alternatives, and no-agreement option"],
  ["78-PVC-04-RIGHTS", "Treaty, rights, consultation, accommodation, and consent obligations"],
  ["78-PVC-05-VALUE", "Public-value classes, intended beneficiaries, access, and durability"],
  ["78-PVC-06-BURDEN", "Costs, harms, risks, exclusions, cumulative burdens, and residual duties"],
  ["78-PVC-07-ALLOCATION", "Benefit, burden, responsibility, liability, and remedy allocation"],
  ["78-PVC-08-FISCAL", "Cash, tax, rate, grant, guarantee, reserve, and contingent contribution"],
  ["78-PVC-09-CAPACITY", "Workforce, land, water, energy, infrastructure, data, and institutional capacity"],
  ["78-PVC-10-GOVERNANCE", "Joint body, voting, veto, quorum, delegation, recusal, and public-reason rules"],
  ["78-PVC-11-METRICS", "Baselines, denominators, indicators, allocation tests, and missingness"],
  ["78-PVC-12-TRANSPARENCY", "Budgets, transfers, performance, incidents, meetings, and public records"],
  ["78-PVC-13-SAFEGUARD", "Rights, equity, environmental, labor, accessibility, privacy, and safety safeguards"],
  ["78-PVC-14-DISPUTE", "Dispute notice, escalation, mediation, adjudication, appeal, and remedy"],
  ["78-PVC-15-CHANGE", "Amendment, accession, withdrawal, succession, termination, and continuing obligations"],
  ["78-PVC-16-REVIEW", "Independent value, burden, contribution, and legitimacy review"],
  ["78-PVC-17-DECISION", "Separate compact authorization by every required authority"],
  ["78-PVC-18-RECEIPT", "Executed terms, conditions, dissent, notice, archive, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const continuityDisputeGates = [
  ["78-MCD-01-COMPACT", "Executed compact, lawful delegation, conditions, and effective date"],
  ["78-MCD-02-SERVICE", "Critical services, minimum levels, users, access, and failure consequences"],
  ["78-MCD-03-RESOURCE", "Personnel, equipment, facility, data, supply, and finance inventories"],
  ["78-MCD-04-REQUEST", "Request, activation, acceptance, prioritization, and refusal rules"],
  ["78-MCD-05-COMMAND", "Command, coordination, professional authority, and local control"],
  ["78-MCD-06-INTEROP", "Technical, operational, credential, data, and communications interoperability"],
  ["78-MCD-07-RIGHTS", "Rights, accessibility, privacy, labor, safety, and non-discrimination safeguards"],
  ["78-MCD-08-COST", "Cost tracking, reimbursement, loss, liability, insurance, and audit"],
  ["78-MCD-09-PRIORITY", "Scarcity, triage, vulnerable populations, and cross-border priority rules"],
  ["78-MCD-10-CONTINUITY", "Continuity, redundancy, substitution, restoration, and handback obligations"],
  ["78-MCD-11-EVIDENCE", "Situation reports, provenance, uncertainty, correction, and common operating picture"],
  ["78-MCD-12-DISPUTE", "Operational dispute, breach, non-performance, changed condition, and escalation"],
  ["78-MCD-13-REMEDY", "Interim measure, stay, cure, compensation, restoration, and residual duty"],
  ["78-MCD-14-INDEPENDENCE", "Independent review, conflict disclosure, and minority rationale"],
  ["78-MCD-15-CLOSE", "Demobilization, reconciliation, after-action review, and unresolved claim"],
  ["78-MCD-16-RECEIPT", "Activation, transfer, dispute, closure, archive, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const emergencyNormalizationGates = [
  ["78-ENR-01-THRESHOLD", "Defined emergency threshold and qualifying evidence"],
  ["78-ENR-02-AUTHORITY", "Lawful authority, jurisdiction, decision maker, and non-delegable limit"],
  ["78-ENR-03-NECESSITY", "Necessity, proportionality, least-restrictive option, and alternatives"],
  ["78-ENR-04-SCOPE", "Geographic, population, service, functional, and subject-matter scope"],
  ["78-ENR-05-TIME", "Start, duration, expiry, renewal prohibition, and sunset"],
  ["78-ENR-06-RIGHTS", "Non-derogable rights, treaty duties, due process, equality, and remedy"],
  ["78-ENR-07-OVERSIGHT", "Legislative, judicial, Indigenous, regulatory, audit, and public oversight"],
  ["78-ENR-08-COMPACT", "Interjurisdictional coordination without authority laundering"],
  ["78-ENR-09-CONTINUITY", "Minimum service, mutual aid, vulnerable populations, and accessible delivery"],
  ["78-ENR-10-EVIDENCE", "Crisis evidence, uncertainty, dissent, correction, and public communication"],
  ["78-ENR-11-DATA", "Data minimization, purpose, access, retention, deletion, and surveillance limits"],
  ["78-ENR-12-RESOURCE", "Emergency procurement, spending, allocation, conflicts, and audit trail"],
  ["78-ENR-13-HARM", "Incident, rights impact, distributional burden, complaint, and remedy monitoring"],
  ["78-ENR-14-CHALLENGE", "Challenge, appeal, stay, independent review, and urgent relief"],
  ["78-ENR-15-RESTORE", "Restoration of ordinary authority, service, records, rights, and institutions"],
  ["78-ENR-16-ACCOUNT", "Public accounting, after-action review, liability, compensation, and correction"],
  ["78-ENR-17-REAUTHORIZE", "Fresh democratic mandate for any continuing extraordinary measure"],
  ["78-ENR-18-RECEIPT", "Activation, amendment, expiry, normalization, archive, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const jurisdictionClasses = [
  ["78-JUR-01-INDIGENOUS", "Indigenous nation, government, treaty partner, or rights-bearing authority"],
  ["78-JUR-02-MUNICIPAL", "Municipal, county, district, or local public authority"],
  ["78-JUR-03-REGIONAL", "Regional, metropolitan, watershed, corridor, or special-purpose authority"],
  ["78-JUR-04-STATE", "State, provincial, territorial, or subnational government"],
  ["78-JUR-05-FEDERAL", "Federal or national department, regulator, legislature, court, or public body"],
  ["78-JUR-06-CROSSBORDER", "Foreign, international, transboundary, or treaty institution"],
  ["78-JUR-07-UTILITY", "Public utility, system operator, infrastructure owner, or regulated provider"],
  ["78-JUR-08-EMERGENCY", "Emergency management, public health, safety, defense, or continuity authority"],
  ["78-JUR-09-FISCAL", "Treasury, budget, grant, rate, procurement, or public-finance authority"],
  ["78-JUR-10-ENVIRONMENT", "Land, water, air, environmental, resource, or cultural authority"],
  ["78-JUR-11-LABOR", "Labor, occupational, professional, credential, or workforce authority"],
  ["78-JUR-12-PUBLIC", "Affected-public, user, worker, payer, future-user, and independent oversight standing"]
].map(([jurisdiction_class_id, label]) => ({ jurisdiction_class_id, label }));

const externalityClasses = [
  ["78-EXT-01-SERVICE", "Service availability, reliability, quality, access, and displacement"],
  ["78-EXT-02-INFRA", "Infrastructure capacity, congestion, maintenance, and stranded asset"],
  ["78-EXT-03-LAND", "Land use, housing, displacement, cultural landscape, and community form"],
  ["78-EXT-04-WATER", "Water withdrawal, quality, reuse, watershed, and residual burden"],
  ["78-EXT-05-ENERGY", "Energy supply, grid capacity, emissions, reliability, and price"],
  ["78-EXT-06-ENVIRONMENT", "Air, climate, biodiversity, waste, contamination, and restoration"],
  ["78-EXT-07-WORKFORCE", "Workforce demand, safety, skills, migration, contractors, and labor standards"],
  ["78-EXT-08-SUPPLY", "Supply chain, logistics, materials, dependencies, and common-mode risk"],
  ["78-EXT-09-FISCAL", "Tax, rate, subsidy, debt, insurance, liability, and opportunity cost"],
  ["78-EXT-10-RIGHTS", "Rights, treaty, consent, accessibility, privacy, and distribution"],
  ["78-EXT-11-SAFETY", "Safety, security, emergency demand, incident, and continuity risk"],
  ["78-EXT-12-FUTURE", "Lock-in, irreversibility, future-user burden, option value, and residual duty"]
].map(([externality_class_id, label]) => ({ externality_class_id, label }));

const publicValueClasses = [
  "Access and universal service", "Reliability and continuity", "Safety and security", "Rights and dignity", "Affordability and fiscal stewardship", "Environmental integrity and restoration", "Distributional fairness", "Local and Indigenous self-determination", "Workforce capability and decent work", "Innovation and option value", "Resilience and redundancy", "Intergenerational durability"
].map((label, index) => ({ public_value_class_id: `78-VAL-${String(index + 1).padStart(2, "0")}`, label }));

const contributionClasses = [
  "Direct fiscal transfer", "Grant, subsidy, tax, or rate contribution", "Guarantee, reserve, insurance, or contingent liability", "Land, easement, facility, or physical asset", "Energy, water, communications, or network capacity", "Personnel, workforce, credential, or training capacity", "Equipment, inventory, logistics, or supply capacity", "Data, evidence, standards, or technical capability", "Regulatory, permitting, procurement, or administrative capacity", "Operations, maintenance, restoration, or decommissioning duty", "Public participation, oversight, audit, or dispute capacity", "Residual, exit, succession, or future-generation obligation"
].map((label, index) => ({ contribution_class_id: `78-CON-${String(index + 1).padStart(2, "0")}`, label }));

const continuityObligations = [
  "Minimum service level", "Accessible service and vulnerable-population support", "Personnel and credential mutual recognition", "Equipment and inventory availability", "Facility and network interoperability", "Data and communications continuity", "Supply-chain and logistics substitution", "Financial liquidity and reimbursement", "Safety, labor, privacy, and rights safeguards", "Cross-border command and coordination", "Restoration, handback, and demobilization", "After-action correction and residual duty"
].map((label, index) => ({ continuity_obligation_id: `78-CTY-${String(index + 1).padStart(2, "0")}`, label }));

const disputeGrounds = [
  "Authority or jurisdiction conflict", "Treaty, rights, consultation, or consent breach", "Compact interpretation or scope", "Contribution, cost, reimbursement, or fiscal breach", "Service level, performance, or interoperability failure", "Benefit, burden, priority, or allocation dispute", "Data, evidence, transparency, or correction failure", "Conflict of interest, capture, or governance failure", "Emergency necessity, proportionality, or rights challenge", "Withdrawal, termination, restoration, or residual-obligation dispute"
].map((label, index) => ({ dispute_ground_id: `78-DSP-${String(index + 1).padStart(2, "0")}`, label }));

const emergencySafeguards = [
  "Legality and published authority", "Evidence threshold and necessity", "Proportionality and least-restrictive alternative", "Geographic, population, functional, and subject limits", "Short duration, hard expiry, and no silent renewal", "Non-derogable rights and treaty duties", "Accessible notice and public reasons", "Legislative, judicial, Indigenous, and independent oversight", "Data minimization and surveillance limits", "Emergency procurement and fiscal audit", "Challenge, urgent relief, remedy, and compensation", "Restoration, deletion, normalization, and fresh reauthorization"
].map((label, index) => ({ emergency_safeguard_id: `78-SFG-${String(index + 1).padStart(2, "0")}`, label }));

const restorationTriggers = [
  "Scheduled expiry or sunset", "Emergency threshold no longer met", "Ordinary authority restored", "Critical service stabilized", "Material rights or distributional harm", "Judicial, legislative, treaty, or regulatory order", "Independent-review or audit finding", "Compact party withdrawal or authority change", "Evidence correction or material uncertainty", "Resource, capacity, or interoperability restoration", "Public challenge, appeal, or legitimacy failure", "Need for continuing measure beyond emergency scope"
].map((label, index) => ({ restoration_trigger_id: `78-RST-${String(index + 1).padStart(2, "0")}`, label }));

const authorityMaps = upstream.map((source, index) => {
  const padded = String(index + 1).padStart(3, "0");
  return {
    interjurisdictional_authority_externality_map_id: `78-JEM-${padded}`,
    slug: `78-jem-${padded}-${shortName(source)}`,
    record_kind: "interjurisdictional_authority_externality_map",
    record_status: "Published",
    mapping_state: "Inactive - No Authorized Public Mandate",
    opening_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    adaptive_mandate_review_ledger_id: source.adaptive_mandate_review_ledger_id,
    phase77_adaptive_state: source.adaptive_state,
    authority_externality_checks: inactiveChecks(authorityExternalityGates, "No real, authorized, time-bounded Phase 77 public mandate or receipt exists."),
    jurisdiction_assignment_records: jurisdictionClasses.map((item) => ({ ...item, assignment_state: "Unmapped", authority_ids: [], duty_ids: [], dispute_ids: [] })),
    externality_records: externalityClasses.map((item) => ({ ...item, assessment_state: "Unassessed", origin_ids: [], destination_ids: [], evidence_ids: [], finding_id: null })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    authorized_public_mandate_ids: [],
    joint_authority_question: null,
    geography_and_population_record: null,
    authority_inventory_records: [],
    treaty_and_rights_records: [],
    shared_asset_and_flow_records: [],
    standing_refresh_records: [],
    common_evidence_record_id: null,
    alternative_scenario_records: [],
    jurisdiction_conflict_records: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    mapping_receipt_id: null,
    propagation_status: "not_started",
    automatic_authority_assignment_allowed: false,
    automatic_externality_finding_allowed: false,
    automatic_forum_selection_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const valueCompacts = authorityMaps.map((item, index) => {
  const source = upstream[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    shared_public_value_contribution_compact_id: `78-PVC-${padded}`,
    slug: `78-pvc-${padded}-${shortName(source)}`,
    record_kind: "shared_public_value_contribution_compact",
    record_status: "Published",
    compact_state: "Inactive - No Admitted Joint-Authority Question",
    compact_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    interjurisdictional_authority_externality_map_id: item.interjurisdictional_authority_externality_map_id,
    adaptive_mandate_review_ledger_id: source.adaptive_mandate_review_ledger_id,
    compact_contribution_checks: inactiveChecks(compactContributionGates, "No completed jurisdiction map or admitted joint-authority question exists."),
    public_value_records: publicValueClasses.map((entry) => ({ ...entry, value_state: "Not Valued", beneficiary_ids: [], indicator_ids: [], allocation_finding_id: null })),
    contribution_records: contributionClasses.map((entry) => ({ ...entry, contribution_state: "Uncommitted", contributor_ids: [], amount_or_capacity_records: [], condition_ids: [] })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    authorized_party_records: [],
    non_party_and_affected_public_records: [],
    compact_purpose_record: null,
    rights_and_treaty_terms: [],
    benefit_burden_allocation_records: [],
    fiscal_commitment_records: [],
    capacity_commitment_records: [],
    joint_governance_terms: null,
    baseline_and_indicator_records: [],
    transparency_and_audit_terms: [],
    safeguard_records: [],
    dispute_resolution_terms: null,
    amendment_withdrawal_termination_terms: null,
    independent_review_record: null,
    compact_authorization_records: [],
    executed_compact_id: null,
    compact_receipt_id: null,
    propagation_status: "not_started",
    contribution_as_control_allowed: false,
    automatic_value_allocation_allowed: false,
    automatic_compact_authorization_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const continuityRegisters = valueCompacts.map((item, index) => {
  const source = upstream[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    mutual_aid_continuity_dispute_register_id: `78-MCD-${padded}`,
    slug: `78-mcd-${padded}-${shortName(source)}`,
    record_kind: "mutual_aid_continuity_dispute_register",
    record_status: "Published",
    continuity_state: "Inactive - No Executed Compact",
    operating_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    shared_public_value_contribution_compact_id: item.shared_public_value_contribution_compact_id,
    interjurisdictional_authority_externality_map_id: authorityMaps[index].interjurisdictional_authority_externality_map_id,
    continuity_dispute_checks: inactiveChecks(continuityDisputeGates, "No executed compact, lawful delegation, continuity obligation, or mutual-aid activation exists."),
    continuity_obligation_records: continuityObligations.map((entry) => ({ ...entry, obligation_state: "Dormant", owner_ids: [], resource_ids: [], activation_ids: [], closure_id: null })),
    dispute_ground_records: disputeGrounds.map((entry) => ({ ...entry, ground_state: "Unavailable", dispute_ids: [], interim_measure_ids: [], decision_ids: [], remedy_ids: [] })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    executed_compact_id: null,
    critical_service_records: [],
    resource_inventory_records: [],
    mutual_aid_request_records: [],
    command_and_coordination_records: [],
    interoperability_records: [],
    rights_and_access_safeguard_records: [],
    cost_reimbursement_liability_records: [],
    scarcity_and_priority_records: [],
    common_operating_picture_records: [],
    dispute_records: [],
    interim_measure_records: [],
    remedy_records: [],
    demobilization_and_handback_records: [],
    after_action_review_record: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    continuity_receipt_id: null,
    propagation_status: "not_started",
    automatic_mutual_aid_activation_allowed: false,
    automatic_priority_allocation_allowed: false,
    automatic_dispute_disposition_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const emergencyLedgers = continuityRegisters.map((item, index) => {
  const source = upstream[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    emergency_authority_normalization_ledger_id: `78-ENL-${padded}`,
    slug: `78-enl-${padded}-${shortName(source)}`,
    record_kind: "emergency_authority_normalization_ledger",
    record_status: "Published",
    emergency_state: "Inactive - No Lawfully Activated Emergency Authority",
    emergency_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    mutual_aid_continuity_dispute_register_id: item.mutual_aid_continuity_dispute_register_id,
    shared_public_value_contribution_compact_id: valueCompacts[index].shared_public_value_contribution_compact_id,
    emergency_normalization_checks: inactiveChecks(emergencyNormalizationGates, "No qualifying emergency evidence, lawful activation, or executed continuity compact exists."),
    emergency_safeguard_records: emergencySafeguards.map((entry) => ({ ...entry, safeguard_state: "Inactive", evidence_ids: [], breach_ids: [], remedy_ids: [] })),
    restoration_trigger_records: restorationTriggers.map((entry) => ({ ...entry, trigger_state: "Dormant", event_ids: [], review_id: null, decision_id: null })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    qualifying_emergency_evidence_records: [],
    lawful_authority_record: null,
    activation_decision_record: null,
    necessity_and_proportionality_record: null,
    emergency_scope_record: null,
    activation_date: null,
    expiry_date: null,
    rights_and_treaty_safeguard_records: [],
    oversight_records: [],
    continuity_activation_records: [],
    crisis_evidence_and_communication_records: [],
    emergency_data_records: [],
    emergency_procurement_and_fiscal_records: [],
    harm_complaint_and_remedy_records: [],
    challenge_and_appeal_records: [],
    restoration_records: [],
    after_action_accountability_record: null,
    democratic_reauthorization_record: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    normalization_receipt_id: null,
    propagation_status: "not_started",
    silent_emergency_extension_allowed: false,
    compact_authority_laundering_allowed: false,
    automatic_rights_suspension_allowed: false,
    automatic_reauthorization_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "78",
  registry_id: "interjurisdictional-compacts-shared-public-value-emergency-resilience-registry-001",
  title: "Interjurisdictional Compacts, Shared Public Value And Emergency Mandate Resilience Registry",
  captured_date: "2026-08-24",
  as_of_date: "2026-08-24",
  scope: "Eight inactive authority and externality maps, eight inactive shared-public-value contribution compacts, eight inactive mutual-aid continuity and dispute registers, and eight inactive emergency-authority normalization ledgers downstream of Phase 77.",
  interpretation_boundary: "A public mandate is not a multi-authority compact. Local benefit is not shared public value. Fiscal contribution is not governing control. Mutual aid is not authority transfer. Emergency activation is not permanent authority, rights suspension, or democratic reauthorization.",
  activation_rule: "At least one real, authorized, time-bounded Phase 77 public mandate must contain completed standing, notice, deliberation, reasoned-response, legitimacy, appeal, conditions, duration, and receipt records. Jurisdiction mapping, compact authorization, contribution commitments, continuity activation, emergency action, normalization, and reauthorization then require separate human decisions and receipts.",
  authority_externality_gates: authorityExternalityGates,
  compact_contribution_gates: compactContributionGates,
  continuity_dispute_gates: continuityDisputeGates,
  emergency_normalization_gates: emergencyNormalizationGates,
  jurisdiction_classes: jurisdictionClasses,
  externality_classes: externalityClasses,
  public_value_classes: publicValueClasses,
  contribution_classes: contributionClasses,
  continuity_obligations: continuityObligations,
  dispute_grounds: disputeGrounds,
  emergency_safeguards: emergencySafeguards,
  restoration_triggers: restorationTriggers,
  mapping_states: ["Inactive - No Authorized Public Mandate", "Under Jurisdiction Review", "Held", "Mapped With Disputes", "Mapped", "Corrected", "Withdrawn"],
  compact_states: ["Inactive - No Admitted Joint-Authority Question", "Scoping", "Negotiating", "Held", "Authorized By Some Parties", "Executed With Conditions", "Denied", "Terminated", "Corrected"],
  continuity_states: ["Inactive - No Executed Compact", "Ready", "Request Open", "Activated", "Dispute Open", "Restoring", "Closed With Residual Duties", "Corrected"],
  emergency_states: ["Inactive - No Lawfully Activated Emergency Authority", "Threshold Review", "Activated", "Under Oversight", "Challenged", "Expiring", "Normalizing", "Expired", "Reauthorized Under Ordinary Mandate", "Corrected"],
  metrics: {
    interjurisdictional_authority_externality_maps: authorityMaps.length,
    shared_public_value_contribution_compacts: valueCompacts.length,
    mutual_aid_continuity_dispute_registers: continuityRegisters.length,
    emergency_authority_normalization_ledgers: emergencyLedgers.length,
    authority_externality_gates: authorityExternalityGates.length,
    compact_contribution_gates: compactContributionGates.length,
    continuity_dispute_gates: continuityDisputeGates.length,
    emergency_normalization_gates: emergencyNormalizationGates.length,
    jurisdiction_classes: jurisdictionClasses.length,
    externality_classes: externalityClasses.length,
    public_value_classes: publicValueClasses.length,
    contribution_classes: contributionClasses.length,
    continuity_obligations: continuityObligations.length,
    dispute_grounds: disputeGrounds.length,
    emergency_safeguards: emergencySafeguards.length,
    restoration_triggers: restorationTriggers.length,
    authorized_public_mandates_received: 0,
    jurisdiction_maps_completed: 0,
    externality_findings_issued: 0,
    joint_authority_questions_admitted: 0,
    compacts_executed: 0,
    fiscal_commitments_made: 0,
    capacity_commitments_made: 0,
    public_value_allocations_issued: 0,
    mutual_aid_requests_opened: 0,
    continuity_activations_issued: 0,
    disputes_opened: 0,
    disputes_resolved: 0,
    emergency_authorities_activated: 0,
    emergency_extensions_issued: 0,
    rights_suspensions_issued: 0,
    restoration_reviews_opened: 0,
    normalization_decisions_issued: 0,
    democratic_reauthorizations_issued: 0,
    receipts_created: 0,
    scores_created: 0,
    rankings_created: 0,
    phase64_cells_advanced: 0
  },
  interjurisdictional_authority_externality_maps: authorityMaps,
  shared_public_value_contribution_compacts: valueCompacts,
  mutual_aid_continuity_dispute_registers: continuityRegisters,
  emergency_authority_normalization_ledgers: emergencyLedgers
};

await writeJson(join(dataRoot, "phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json"), registry);

const guideDefinitions = [
  ["briefing-cooperative-federalism-municipal-authority-001", "cooperative-federalism-municipal-authority-001", "Cooperative Federalism And Municipal Authority 001: Map Competence Before Coordination", "A practical method for mapping constitutional, statutory, regulatory, municipal, delegated, retained, contested, and residual authority before a joint decision.", "Coordination begins with an authority inventory, not a meeting invitation. Municipal delivery duties, regional network responsibilities, state or provincial competence, federal spending and regulation, public-utility obligations, and retained local powers can overlap without becoming interchangeable.", "A higher level of government, a larger budget, a national program, or an urgent schedule does not erase local law, service duties, procedural rights, or the need for each required authority to make its own decision."],
  ["briefing-indigenous-treaty-intergovernmental-compacts-001", "indigenous-treaty-intergovernmental-compacts-001", "Indigenous, Treaty And Intergovernmental Compacts 001: Relationship Is Not Delegation", "A treaty-aware compact method that keeps Indigenous jurisdiction, rights, consultation, accommodation, agreement, consent, and intergovernmental authority distinct.", "Indigenous nations are not stakeholder categories inside another government's consultation plan. Jurisdiction, treaty relationship, inherent rights, statutory duties, title, land, water, cultural continuity, consent standards, and nation-to-nation process require their own records.", "Participation, consultation, accommodation, funding, a memorandum, or a majority vote cannot be relabeled as consent or used to transfer Indigenous authority without a valid basis and an authorized decision."],
  ["briefing-cross-border-infrastructure-externalities-001", "cross-border-infrastructure-externalities-001", "Cross-Border Infrastructure And Externalities 001: Follow The Flows", "A method for tracing services, resources, benefits, burdens, risks, and residual duties across political and system boundaries.", "Infrastructure rarely stops at the boundary printed on a permit. Power, water, data, freight, labor, emissions, emergency demand, fiscal exposure, supply dependencies, congestion, service failures, and benefits move through networks and across communities.", "A benefit inside the project boundary does not cancel an exported burden, imported risk, displaced service cost, downstream failure, cumulative impact, or future restoration duty."],
  ["briefing-shared-public-value-allocation-001", "shared-public-value-allocation-001", "Shared Public Value Allocation 001: Benefit Needs A Distribution Record", "A framework for defining public value, intended beneficiaries, excluded groups, durability, burdens, remedies, and allocation decisions without a composite score.", "Public value is plural. Access, reliability, rights, affordability, environmental integrity, local self-determination, decent work, resilience, innovation, and intergenerational option value can reinforce one another or conflict.", "Aggregate benefit, economic activity, asset completion, service volume, or majority support cannot establish fair distribution, legitimate burden sharing, consent, or net public value."],
  ["briefing-fiscal-capacity-contribution-sharing-001", "fiscal-capacity-contribution-sharing-001", "Fiscal And Capacity Sharing 001: Contribution Is Not Control", "A ledger method for cash, assets, guarantees, workforce, infrastructure, data, regulatory capacity, operations, liabilities, and residual obligations.", "A compact needs a contribution model broader than a budget table. Land, water, energy, personnel, technical systems, permitting effort, public engagement, risk absorption, maintenance, restoration, and contingent liabilities can be as material as cash.", "Paying more does not automatically create governing control, veto power, benefit priority, liability immunity, rights waiver, or authority to redirect another party's contribution."],
  ["briefing-mutual-aid-service-continuity-001", "mutual-aid-service-continuity-001", "Mutual Aid And Service Continuity 001: Help Needs A Handback", "An operating framework for mutual-aid requests, critical-service floors, resource inventories, interoperability, safeguards, reimbursement, restoration, and handback.", "Mutual aid is a temporary operating relationship under a defined compact. It needs a valid request, acceptance, command boundary, credential recognition, resource identity, service priorities, safety rules, cost record, public communication, and exit.", "A crisis request does not silently transfer sovereignty, professional authority, ownership, labor obligations, data rights, liability, permanent control, or the duty to restore ordinary service."],
  ["briefing-intergovernmental-dispute-resolution-001", "intergovernmental-dispute-resolution-001", "Intergovernmental Dispute Resolution 001: Keep Service Running While Reasons Are Tested", "A dispute path covering notice, interim measures, mediation, adjudication, appeal, remedy, public reasons, service continuity, and residual duties.", "Disputes are part of compact design, not evidence that the design can omit them. Authority, interpretation, contribution, performance, allocation, evidence, emergency necessity, rights, withdrawal, restoration, and liability disputes need named forums and time bounds.", "An interim operating measure is not a merits decision. Continued service is not acceptance of another party's interpretation, and urgent coordination is not waiver of appeal, remedy, treaty, or rights claims."],
  ["briefing-emergency-powers-civil-safeguards-001", "emergency-powers-civil-safeguards-001", "Emergency Powers And Civil Safeguards 001: Urgency Does Not Remove Limits", "A control framework for emergency thresholds, lawful authority, necessity, proportionality, rights, oversight, hard expiry, challenge, remedy, and normalization.", "Emergency power should be treated as a short, narrow, evidenced exception. The activation record must identify the threat, evidence, authority, decision maker, alternatives, necessity, geographic and functional scope, affected people, non-derogable limits, review, and expiry.", "Urgency does not create unlimited jurisdiction, permanent authority, automatic rights suspension, indefinite surveillance, unreviewable procurement, silent renewal, or immunity from correction and remedy."],
  ["briefing-crisis-evidence-public-communication-001", "crisis-evidence-public-communication-001", "Crisis Evidence And Public Communication 001: Speed Still Needs Provenance", "A crisis-record method for uncertainty, correction, dissent, situation reports, decision thresholds, accessible notice, public reasons, and rumor-resistant updates.", "Crisis evidence changes quickly and arrives unevenly. A useful public record identifies what is observed, estimated, assumed, missing, contradicted, corrected, and decision-relevant; it separates operational secrecy from administrative convenience.", "A dashboard, briefing, alert, press conference, social post, or repeated claim is not a verified fact, a complete notice, a public reason, or authorization for a new emergency measure."],
  ["briefing-emergency-authority-normalization-001", "emergency-authority-normalization-001", "Return From Emergency Authority 001: Expiry Is A Decision Boundary", "An end-to-end normalization method for expiry, restoration, deletion, fiscal reconciliation, after-action review, remedy, residual duties, and fresh democratic reauthorization.", "The hardest emergency control is the return to ordinary authority. Systems, personnel, contracts, data, restrictions, surveillance, fiscal commitments, service priorities, intergovernmental arrangements, and public expectations can persist after the original threshold is gone.", "Elapsed time, continuing usefulness, sunk cost, institutional convenience, residual risk, or an expired emergency declaration cannot renew extraordinary power. Any continuing measure needs ordinary lawful authority and a fresh public mandate." ]
];

const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const yamlList = (values) => values.map((value) => `  - "${value}"`).join("\n");
for (const [id, slug, title, summary, focus, boundary] of guideDefinitions) {
  const body = `---
id: "${id}"
title: "${title}"
slug: "${slug}"
record_status: "Published"
summary: "${summary}"
published_date: 2026-08-24
captured_date: 2026-08-24
signal_ids:
${yamlList(signalIds)}
evidence_gap_ids:
${yamlList(evidenceGapIds)}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-08-24
top_takeaways:
  - "Joint action begins with explicit authority, affected-public, evidence, allocation, review, and receipt records."
  - "A contribution, emergency, or continuity need cannot silently transfer jurisdiction or suspend rights."
  - "Disputes, exit, restoration, residual duties, and democratic reauthorization are part of the initial design."
constraint_watch:
  - "Public Trust"
  - "Regulation"
  - "Infrastructure"
  - "Interpretation"
what_to_watch_next:
  - "A real, time-bounded Phase 77 mandate with a complete public record and receipt"
  - "An admitted multi-authority question with explicit jurisdiction and externality findings"
  - "Separately authorized compact, contribution, continuity, emergency, and normalization decisions"
---

## Why this layer exists

${focus}

Phase 78 begins only after Phase 77 produces a real, authorized, time-bounded public mandate with completed standing, accessible notice, deliberation, reasoned response, legitimacy, appeal, conditions, duration, and receipt. No such mandate exists. The [Interjurisdictional Compacts Registry](/evidence/compacts/) therefore publishes an inspectable empty contract, not a claim that coordination, agreement, readiness, emergency, or legitimacy has been achieved.

${boundary}

## Start with authority and standing

Every party needs a versioned authority record: the source of power, territorial and subject-matter scope, mandatory and discretionary duties, delegation limits, retained powers, conflicts, review routes, expiry, and residual obligations. The record must identify Indigenous jurisdiction and treaty relationships, municipal and regional delivery duties, state or provincial competence, federal roles, regulators, public utilities, courts, emergency bodies, and affected publics without flattening them into one stakeholder list.

Standing must follow exposure, rights, service dependence, fiscal burden, labor, accessibility, environmental justice, safety, future use, and practical knowledge across every relevant boundary. A body can have legal authority without representing every affected public; a community can have standing without possessing the institutional power to sign a compact. Those identities and decisions remain separate.

The authority map should show exclusive, concurrent, delegated, retained, contested, and unknown competence. Unknown is a valid state. The system must not resolve uncertainty by choosing the best-funded participant, the broadest statute, the fastest forum, or the authority that already controls the data.

## Build a common record without erasing difference

Joint action needs a common evidence record, but common does not mean homogenized. Parties may use different denominators, reporting periods, legal tests, languages, knowledge systems, privacy rules, service definitions, and thresholds. The record preserves those differences, documents any bridge, exposes missingness, and prevents a convenient aggregate from becoming an unsupported joint finding.

Externalities must be followed in both directions: who creates, receives, avoids, exports, imports, pays for, benefits from, insures, repairs, and inherits each effect. Service reliability, land, water, energy, emissions, workforce, supply chains, fiscal exposure, safety, rights, accessibility, and intergenerational lock-in belong in the same traceable structure even when different institutions own the underlying evidence.

Public communication is part of the evidence contract. Notices and situation reports distinguish observation, estimate, assumption, scenario, decision, correction, and unresolved dissent. Speed can justify shorter review intervals; it does not justify dropping provenance, accessibility, adverse evidence, uncertainty, or the correction path.

## Make allocation and contribution explicit

A compact should name its public purposes and test them across access, reliability, safety, rights, affordability, environmental integrity, distribution, self-determination, decent work, resilience, innovation, and future option value. These dimensions are not collapsed into a composite score. Tradeoffs require public reasons linked to affected people, evidence, alternatives, conditions, safeguards, and remedies.

Contribution records distinguish cash, grants, rates, guarantees, land, infrastructure, personnel, data, regulatory effort, operations, maintenance, risk absorption, restoration, and residual duties. Each entry names the contributor, beneficiary, amount or capacity, condition, duration, audit method, liability rule, withdrawal consequence, and what the contribution does not purchase.

Governance terms separately define representation, quorum, voting, veto, delegation, recusal, transparency, conflict disclosure, meeting records, public participation, Indigenous and treaty processes, amendment, accession, withdrawal, termination, succession, and continuing obligations. Financial weight cannot silently become governing weight.

## Design for continuity, dispute, and failure

Critical-service planning defines minimum levels, vulnerable populations, accessible delivery, personnel and credential rules, equipment, facilities, networks, supplies, data, communications, reimbursement, safety, privacy, labor, command, restoration, and handback. Mutual aid opens through a real request and acceptance; it is not permanently active merely because a compact exists.

The dispute path names notice, record preservation, interim service measures, mediation, adjudication, appeal, stays, cure, compensation, restoration, publication, and time bounds. Interim measures keep people safe while reasons are tested, but do not decide the merits or waive jurisdiction, rights, treaty, liability, or remedy claims.

Every compact needs failure modes: a party cannot perform, a resource becomes scarce, evidence changes, a cross-border burden grows, a right is affected, a conflict emerges, a court intervenes, an emergency exceeds the compact, or a party exits. Each route ends in a separate human decision and receipt rather than an automatic score, priority, default, or renewal.

## Bound emergency authority

Emergency activation needs a qualifying threshold, evidence, lawful authority, decision maker, necessity, proportionality, least-restrictive alternative, limited scope, start, hard expiry, non-derogable safeguards, oversight, accessible notice, public reasons, challenge, remedy, fiscal controls, data limits, and a restoration plan. Coordination under a compact cannot launder authority that no party lawfully holds.

The emergency record tracks incidents, benefits, harms, distribution, rights effects, complaints, uncertainty, corrections, procurement, spending, surveillance, data retention, service continuity, and affected-public conditions. A trigger opens review; it does not automatically extend, expand, terminate, or validate the measure.

Normalization restores ordinary authority, services, records, rights, governance, budgets, contracts, data limits, and accountability. It includes deletion where required, fiscal reconciliation, after-action review, compensation, remedies, unresolved claims, residual duties, and public receipts. If a measure must continue, it returns through ordinary law and a fresh Phase 77 public mandate.

## Public contract

The Phase 78 public record keeps authority, externality, value, burden, contribution, compact, continuity, dispute, emergency, restoration, and reauthorization decisions independent. It never treats participation as consent, agreement as legitimacy, payment as control, coordination as authority transfer, mutual aid as permanent command, crisis communication as verified evidence, or emergency operation as democratic reauthorization.

Inspect the empty state. There are no authorized Phase 77 mandates, completed jurisdiction maps, externality findings, joint questions, compact terms, contributions, mutual-aid requests, disputes, emergency activations, extensions, rights suspensions, normalization decisions, reauthorizations, receipts, scores, rankings, Phase 64 advances, or operating-outcome changes. Future records open only from real dated artifacts and separately authorized human decisions.
`;
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), body, "utf8");
}

const mapDefinitions = [
  ["dependency-map-one-public-mandate-is-not-a-multi-authority-compact", "one-public-mandate-is-not-a-multi-authority-compact", "One Public Mandate Is Not A Multi-Authority Compact", "A dependency path from one bounded public mandate through jurisdiction, treaty, standing, externality, party authorization, joint terms, and receipts."],
  ["dependency-map-local-benefit-is-not-shared-public-value", "local-benefit-is-not-shared-public-value", "Local Benefit Is Not Shared Public Value", "A dependency path from local benefit through exported burdens, distribution, rights, contribution, remedy, and joint allocation."],
  ["dependency-map-fiscal-contribution-is-not-governing-control", "fiscal-contribution-is-not-governing-control", "Fiscal Contribution Is Not Governing Control", "A dependency path separating money and capacity commitments from legal authority, representation, veto, benefit priority, liability, and consent."],
  ["dependency-map-emergency-activation-is-not-permanent-authority", "emergency-activation-is-not-permanent-authority", "Emergency Activation Is Not Permanent Authority", "A dependency path from qualifying emergency evidence through lawful activation, limits, oversight, hard expiry, normalization, and fresh reauthorization."],
  ["dependency-map-service-continuity-is-not-rights-suspension", "service-continuity-is-not-rights-suspension", "Service Continuity Is Not Rights Suspension", "A dependency path connecting mutual aid and minimum service to accessibility, labor, privacy, due process, challenge, restoration, and remedy."]
];

for (const [id, slug, title, summary] of mapDefinitions) {
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id,
    title,
    slug,
    summary,
    map_type: "Dependency Stack",
    record_status: "Published",
    primary_topic: "Human Futures",
    framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"],
    constraint_tags: ["Public Trust", "Regulation", "Infrastructure", "Interpretation"],
    map_question: `What records are required before ${title.toLowerCase()} can move from assertion to a bounded public decision?`,
    interpretation_boundary: "This map is a control path. It does not establish a mandate, jurisdiction, compact, contribution, mutual-aid activation, emergency, rights restriction, normalization, receipt, score, rank, or outcome.",
    source_ids: [...new Set(upstream.flatMap((record) => record.source_ids))].slice(0, 8),
    signal_ids: signalIds,
    technology_ids: [],
    local_system_ids: [...new Set(upstream.flatMap((record) => record.local_system_ids))],
    evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-mandate", label: "Authorized time-bounded public mandate", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 77 mandate exists." },
      { id: "node-authority", label: "Jurisdiction, treaty, rights, duty, and standing map", node_type: "Constraint", note: "Authority and affected-public identities remain separate." },
      { id: "node-externality", label: "Cross-boundary benefit, burden, risk, and residual-duty record", node_type: "Constraint", note: "Flows are traced across the full system." },
      { id: "node-terms", label: "Joint purpose, alternatives, allocation, contribution, and governance terms", node_type: "Constraint", note: "Agreement terms require independent authorization." },
      { id: "node-continuity", label: "Continuity, dispute, emergency, rights, and remedy controls", node_type: "Constraint", note: "Operating readiness does not expand authority." },
      { id: "node-normalize", label: "Expiry, restoration, accounting, and democratic reauthorization", node_type: "Constraint", note: "Extraordinary action must return to ordinary authority." },
      { id: "node-receipt", label: "Independent review, dissent, public notice, archive, and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 78 receipt exists." }
    ],
    links: [
      { from: "node-mandate", to: "node-authority", relationship: "Depends On", confidence: "Missing Evidence", note: "One public mandate cannot assign every authority." },
      { from: "node-authority", to: "node-externality", relationship: "Depends On", confidence: "Missing Evidence", note: "Scope and duty determine which flows must be tested." },
      { from: "node-externality", to: "node-terms", relationship: "Depends On", confidence: "Missing Evidence", note: "Allocation needs explicit benefit and burden evidence." },
      { from: "node-terms", to: "node-continuity", relationship: "Depends On", confidence: "Missing Evidence", note: "Operating duties must be authorized and safeguarded." },
      { from: "node-continuity", to: "node-normalize", relationship: "Depends On", confidence: "Missing Evidence", note: "Activation requires a bounded exit and restoration path." },
      { from: "node-normalize", to: "node-receipt", relationship: "Depends On", confidence: "Missing Evidence", note: "Every change and closure needs an inspectable decision receipt." }
    ],
    what_this_map_supports: ["Separate authority, public-value, contribution, continuity, emergency, and normalization decisions.", "Explicit rights, treaty, accessibility, distribution, dispute, remedy, expiry, and residual-duty controls.", "Public receipts without composite scoring or jurisdictional ranking."],
    what_this_map_does_not_prove: ["It does not establish a current compact, emergency, benefit, burden, contribution, dispute, or reauthorization.", "It does not permit silent renewal, authority laundering, contribution-as-control, or automatic rights suspension.", "It does not create a score, rank, stage advance, or operating-outcome change."],
    next_records_needed: ["A real, authorized, time-bounded Phase 77 mandate and receipt.", "Completed authority, standing, treaty, externality, public-value, burden, contribution, and dispute records.", "Separately authorized compact, activation, normalization, and reauthorization decisions with receipts."]
  });
}

const guideIds = guideDefinitions.map(([id]) => id);
const mapIds = mapDefinitions.map(([id]) => id);
const pathwayIds = [...new Set(upstream.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, ...guideIds])];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, ...mapIds])];
  await writeJson(path, pathway);
}

for (const source of upstream) {
  const index = upstream.indexOf(source);
  const records = [authorityMaps[index], valueCompacts[index], continuityRegisters[index], emergencyLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 78 interjurisdictional-compact and emergency-resilience boundary")) {
    body = body.trimEnd() + `\n\n## Phase 78 interjurisdictional-compact and emergency-resilience boundary\n\nThe [Interjurisdictional Compacts Registry](/evidence/compacts/) assigns ${records.map((record) => `[${Object.values(record).find((value) => typeof value === "string" && /^78-(JEM|PVC|MCD|ENL)-/.test(value))}](/evidence/compacts/${record.slug}/)`).join(", ")} to this named file. No jurisdiction finding, externality finding, compact, contribution, mutual-aid activation, dispute, emergency authority, rights suspension, normalization, reauthorization, receipt, score, rank, or Phase 64 cell change exists.\n`;
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
  const localRecords = authorityMaps.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 78 compact, continuity, and emergency boundary")) {
    body = body.trimEnd() + `\n\n## Phase 78 compact, continuity, and emergency boundary\n\nThe [Interjurisdictional Compacts Registry](/evidence/compacts/) connects ${localRecords.map((record) => record.named_entity).join(" and ")} to jurisdiction, treaty, externality, public-value, contribution, mutual-aid, dispute, emergency, restoration, and reauthorization controls. A project boundary, local benefit, fiscal contribution, coordination need, or emergency does not establish shared value, governing control, authority transfer, rights suspension, permanent power, or successful normalization.\n`;
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
  if (!body.includes("## Phase 78 compact, continuity, and emergency-resilience control")) {
    body = body.trimEnd() + "\n\n## Phase 78 compact, continuity, and emergency-resilience control\n\nThe [Interjurisdictional Compacts Registry](/evidence/compacts/) adds eight inactive authority and externality maps, eight inactive shared-value contribution compacts, eight inactive mutual-aid continuity and dispute registers, and eight inactive emergency-authority normalization ledgers. It preserves jurisdiction, treaties, rights, externalities, allocation, contributions, continuity, disputes, civil safeguards, expiry, restoration, and democratic reauthorization while creating zero compacts, activations, emergencies, extensions, rights suspensions, normalization decisions, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

await writeJson(join(contentRoot, "updates", "2026-08-24-phase-78-interjurisdictional-compacts-emergency-resilience.json"), {
  id: "update-2026-08-24-phase-78-interjurisdictional-compacts-emergency-resilience",
  effective_date: "2026-08-24",
  entry_type: "Source Refresh",
  title: "Phase 78 adds interjurisdictional compact and emergency-resilience controls",
  summary: "Eight inactive authority and externality maps, eight inactive shared-public-value contribution compacts, eight inactive mutual-aid continuity and dispute registers, and eight inactive emergency-authority normalization ledgers now expose how joint authority, externalities, contributions, continuity, disputes, emergencies, restoration, and democratic reauthorization would be governed. Ten guides and five maps deepen the content layer without creating a compact or emergency outcome.",
  affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"],
  related_paths: ["/evidence/compacts/", ...guideDefinitions.map(([, slug]) => `/briefings/${slug}/`), "/data/interjurisdictional-compacts-emergency-resilience.json"],
  evidence_note: "This release contains empty authority, externality, public-value, contribution, compact, continuity, dispute, emergency, restoration, and reauthorization contracts plus synthetic-only validation. It does not contain an authorized Phase 77 mandate, jurisdiction finding, compact, contribution, mutual-aid request, dispute, emergency activation, extension, rights suspension, normalization, reauthorization, receipt, score, or ranking.",
  materiality: "No record-state change",
  publication_effect: "Adds ten Published briefings, five Published dependency maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, participation, mandate, compact, emergency, stage, result, decision, impact, and operating states unchanged.",
  next_check_date: "2026-09-01",
  work_package: "docs/work-packages/phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience.md"
});

console.log(`Phase 78 content built: ${authorityMaps.length} inactive authority maps, ${valueCompacts.length} inactive value compacts, ${continuityRegisters.length} inactive continuity-dispute registers, ${emergencyLedgers.length} inactive emergency-normalization ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 compact or emergency outcomes.`);
