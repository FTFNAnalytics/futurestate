import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase80 = await readJson(join(dataRoot, "phase-80-public-investment-portfolios-transition-pathways-place-based-capacity-registry.json"));
const upstream = phase80.portfolio_stress_rebalancing_realization_ledgers;
const shortName = (record) => record.slug.replace(/^80-prr-\d+-/, "");
const inactiveChecks = (gates, basis) => gates.map((gate) => ({ ...gate, decision_state: "Inactive", basis }));
const makeTaxonomy = (prefix, labels, idKey) => labels.map((label, index) => ({ [idKey]: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));

const serviceFloorGates = [
  ["81-SFD-01-UPSTREAM", "Verified Phase 80 mission, portfolio, capacity, transition, stress, realization, review, and receipt chain"],
  ["81-SFD-02-AUTHORITY", "Constitutional, statutory, treaty, regulatory, fiscal, and service-delivery authority"],
  ["81-SFD-03-ESSENTIAL", "Named essential service, public purpose, dependency, substitute, and exclusion boundary"],
  ["81-SFD-04-POPULATION", "Eligible public, resident, traveler, user, household, institution, rights-holder, and future-user scope"],
  ["81-SFD-05-FLOOR", "Minimum availability, accessibility, affordability, quality, reliability, safety, and continuity floor"],
  ["81-SFD-06-BASELINE", "Current service, unmet need, exclusion, deprivation, delay, quality, outage, and geographic baseline"],
  ["81-SFD-07-ACCESS", "Physical, digital, linguistic, cognitive, financial, administrative, and temporal access"],
  ["81-SFD-08-ELIGIBILITY", "Eligibility, enrollment, verification, portability, renewal, notice, and due-process rules"],
  ["81-SFD-09-NONDISCRIM", "Universal-design, equality, non-discrimination, accommodation, and disparate-impact duties"],
  ["81-SFD-10-CAPACITY", "Demand, peak, reserve, queue, staffing, network, facility, and operating-capacity basis"],
  ["81-SFD-11-PLACE", "Urban, rural, remote, northern, Indigenous, corridor, host-community, and cross-boundary coverage"],
  ["81-SFD-12-PROVIDER", "Public, cooperative, community, Indigenous, nonprofit, regulated, and contracted provider duties"],
  ["81-SFD-13-FUNDING", "Durable capital, operating, maintenance, renewal, accessibility, emergency, and remedy funding"],
  ["81-SFD-14-STANDARD", "Service standard, measurement method, disaggregation, threshold, audit, and revision rule"],
  ["81-SFD-15-RIGHTS", "Notice, explanation, privacy, safety, complaint, appeal, remedy, restitution, and representation"],
  ["81-SFD-16-CONTINUITY", "Essential load, redundancy, mutual aid, fallback, substitution, rationing, and restoration"],
  ["81-SFD-17-OPTIONS", "Direct provision, public option, shared service, open infrastructure, subsidy, regulation, and no-action options"],
  ["81-SFD-18-REVIEW", "Independent service-floor, rights, distribution, accessibility, fiscal, technical, and future-user review"],
  ["81-SFD-19-DECISION", "Separate human adoption decision with conditions, expiry, appeal, amendment, and no automatic expansion"],
  ["81-SFD-20-RECEIPT", "Authority, floor, dissent, condition, correction, notice, archive, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const affordabilityCoverageGates = [
  ["81-ACL-01-FLOOR", "Adopted essential-service floor, eligible public, access duties, standards, and receipts"],
  ["81-ACL-02-COST", "Capital, operating, maintenance, renewal, resilience, accessibility, remedy, and closure cost basis"],
  ["81-ACL-03-ABILITY", "Income, wealth, household size, geography, disability, usage, volatility, and ability-to-pay evidence"],
  ["81-ACL-04-BURDEN", "Bill, fare, fee, time, travel, equipment, deposit, connection, documentation, and opportunity-cost burden"],
  ["81-ACL-05-PROTECTION", "Lifeline, exemption, cap, arrears, disconnection, debt, reconnection, and emergency protection"],
  ["81-ACL-06-FUNDING", "Tax, transfer, rate, levy, contribution, appropriation, reserve, and public-option funding"],
  ["81-ACL-07-SUBSIDY", "Explicit subsidy purpose, source, recipient, duration, condition, leakage, incidence, and review"],
  ["81-ACL-08-CROSSSUB", "Named contributor and beneficiary classes, allocation rule, transparency, stability, and appeal"],
  ["81-ACL-09-COVERAGE", "Network, facility, route, service-area, address, population, capacity, and quality coverage"],
  ["81-ACL-10-CONNECT", "Connection, enrollment, device, vehicle, station, interface, literacy, and support availability"],
  ["81-ACL-11-TAKEUP", "Eligible, offered, connected, active, retained, denied, disconnected, and unmet-demand measures"],
  ["81-ACL-12-CAPACITY", "Peak demand, reserve margin, queue, congestion, oversubscription, staffing, and maintenance capacity"],
  ["81-ACL-13-DISAGG", "Place, income, race, age, disability, language, household, tenure, and service-class disaggregation"],
  ["81-ACL-14-QUALITY", "Comparable service quality, speed, frequency, reliability, safety, accessibility, and support"],
  ["81-ACL-15-PUBLICOPTION", "Public or shared fallback where coverage, affordability, quality, or provider plurality fails"],
  ["81-ACL-16-SCENARIO", "Demand, inflation, income, cost, climate, outage, migration, technology, and provider-failure scenarios"],
  ["81-ACL-17-TRIGGER", "Burden, exclusion, outage, congestion, quality, discrimination, arrears, or fiscal threshold"],
  ["81-ACL-18-REVIEW", "Independent affordability, subsidy-incidence, coverage, access, quality, and distribution review"],
  ["81-ACL-19-DECISION", "Separate human tariff, subsidy, expansion, protection, or public-option decision"],
  ["81-ACL-20-RECEIPT", "Cost, burden, subsidy, coverage, trigger, decision, correction, appeal, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const providerContinuityGates = [
  ["81-PIC-01-UPSTREAM", "Adopted service floor plus lawful affordability, cross-subsidy, coverage, and access record"],
  ["81-PIC-02-MODEL", "Provider model, ownership, mission, service area, authority, obligations, and public accountability"],
  ["81-PIC-03-PLURALITY", "Provider concentration, common ownership, substitutes, entry, exit, switching, and public-option capacity"],
  ["81-PIC-04-STANDARD", "Open technical, operational, safety, accessibility, data, identity, payment, and service standards"],
  ["81-PIC-05-INTERFACE", "Documented interfaces, conformance, versioning, compatibility, certification, and change control"],
  ["81-PIC-06-DATA", "Data access, minimization, privacy, security, portability, retention, audit, and public-interest use"],
  ["81-PIC-07-PORTABLE", "User, credential, entitlement, account, device, record, payment, and service portability"],
  ["81-PIC-08-PROCURE", "Procurement, licensing, franchise, concession, grant, rate, and service-agreement obligations"],
  ["81-PIC-09-PERFORMANCE", "Comparable provider cost, access, quality, reliability, safety, complaint, and remedy reporting"],
  ["81-PIC-10-MAINTAIN", "Asset condition, maintenance, renewal, spares, workforce, suppliers, and state-of-good-repair duty"],
  ["81-PIC-11-RESERVE", "Spare capacity, redundancy, diversity, backup, stockpile, alternate route, and recovery resource"],
  ["81-PIC-12-MUTUALAID", "Mutual-aid authority, participants, activation, command, resource sharing, reimbursement, and demobilization"],
  ["81-PIC-13-CONTINUITY", "Essential-user priority, continuity level, fallback mode, degraded service, and maximum interruption"],
  ["81-PIC-14-CYBER", "Cybersecurity, physical security, supply-chain integrity, incident disclosure, recovery, and public notice"],
  ["81-PIC-15-DEPEND", "Energy, communications, water, transport, workforce, vendor, cloud, facility, and cross-border dependencies"],
  ["81-PIC-16-COMMONMODE", "Common-mode, correlated, geographic, technology, vendor, standard, and institutional failure"],
  ["81-PIC-17-EXERCISE", "Continuity exercise, mutual-aid drill, failover test, accessible communication, and after-action review"],
  ["81-PIC-18-STEPIN", "Data, asset, license, workforce, contract, escrow, access, and operational prerequisites for step-in"],
  ["81-PIC-19-EXIT", "Orderly provider exit, successor, user migration, workforce continuity, records, assets, and restoration"],
  ["81-PIC-20-REVIEW", "Independent plurality, interoperability, continuity, security, maintenance, and public-option review"],
  ["81-PIC-21-DECISION", "Separate human provider, standard, mutual-aid, continuity, or step-in-readiness decision"],
  ["81-PIC-22-RECEIPT", "Model, standard, conformance, exercise, failure, correction, exit, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const rightsRestorationGates = [
  ["81-RQR-01-UPSTREAM", "Verified service floor, affordability, access, provider, interoperability, and continuity baseline"],
  ["81-RQR-02-RIGHTS", "User rights, responsibilities, protected classes, service terms, limits, and non-waivable floor"],
  ["81-RQR-03-NOTICE", "Accessible notice, explanation, language, channel, timing, acknowledgment, and retained record"],
  ["81-RQR-04-COMPLAINT", "Complaint intake, assistance, triage, investigation, response, escalation, and public reporting"],
  ["81-RQR-05-APPEAL", "Independent appeal, representation, evidence access, time limit, interim protection, and reasoned decision"],
  ["81-RQR-06-REMEDY", "Correction, reconnection, replacement, refund, compensation, restitution, accommodation, and systemic remedy"],
  ["81-RQR-07-QUALITY", "Availability, frequency, latency, capacity, accuracy, safety, accessibility, support, and outcome quality"],
  ["81-RQR-08-RELIABILITY", "Interruption, duration, recurrence, affected users, severity, cause, restoration, and uncertainty"],
  ["81-RQR-09-MAINTAIN", "Condition, backlog, preventive maintenance, renewal, deferred work, inspection, and acceptance"],
  ["81-RQR-10-FAILURE", "Financial, operational, safety, quality, rights, cyber, workforce, supplier, and governance failure trigger"],
  ["81-RQR-11-WARNING", "Early-warning threshold, reporting duty, cure period, independent monitor, and protected-service floor"],
  ["81-RQR-12-INTERVENE", "Assistance, direction, condition, rate action, administrator, transfer, step-in, or public-option sequence"],
  ["81-RQR-13-AUTHORITY", "Trigger-specific intervention authority, proportionality, due process, conflict control, and review"],
  ["81-RQR-14-CONTINUITY", "Service continuity, user migration, data, payment, workforce, supplier, asset, and contract transition"],
  ["81-RQR-15-EMERGENCY", "Declared emergency, scope, evidence, essential loads, protected publics, command, and time bound"],
  ["81-RQR-16-RATION", "Transparent rationing rule, necessity, proportionality, accessibility, non-discrimination, exception, and appeal"],
  ["81-RQR-17-RESTORE", "Restoration priority, damage assessment, mutual aid, repair, verification, communication, and completion"],
  ["81-RQR-18-NORMALIZE", "End condition, backlog recovery, rights restoration, bill relief, remedy, after-action, and reauthorization"],
  ["81-RQR-19-LONGTERM", "Trend, distribution, maintenance, affordability, provider health, resilience, and future-user accountability"],
  ["81-RQR-20-CORRECT", "Corrective action, owner, funding, deadline, verification, recurrence prevention, and public receipt"],
  ["81-RQR-21-REVIEW", "Independent rights, quality, provider-failure, intervention, rationing, restoration, and audit review"],
  ["81-RQR-22-RECEIPT", "Complaint, appeal, quality, failure, intervention, emergency, restoration, correction, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const serviceClasses = makeTaxonomy("81-ESC", ["Safe drinking water and wastewater", "Essential electricity, heating, cooling, and energy", "Emergency communications, broadband, and public digital access", "Essential mobility, paratransit, evacuation, and goods movement", "Emergency response, public safety, and disaster support", "Health, medicines, public health, and emergency care", "Food access, nutrition, storage, and essential supply", "Housing stability, shelter, sanitation, and habitability", "Education, libraries, knowledge, and civic information", "Care, childcare, disability support, and aging services", "Payments, identity, benefits, and essential administrative access", "Waste, environmental health, drainage, and remediation", "Postal, logistics, repair, and essential material access", "Public realm, accessibility, cooling, clean air, and community resilience"], "essential_service_class_id");
const floorDimensions = makeTaxonomy("81-FLR", ["Availability and hours", "Geographic reach and proximity", "Physical and digital accessibility", "Affordability and protection from hardship", "Capacity, frequency, and wait time", "Quality, accuracy, and fitness for purpose", "Safety, health, and environmental performance", "Reliability, continuity, and restoration", "Privacy, security, dignity, and autonomy", "Language, literacy, cultural, and administrative access", "Complaint, appeal, remedy, and due process", "Interoperability, portability, and switching", "Maintenance, renewal, and state of good repair", "Transparency, measurement, audit, and revision"], "service_floor_dimension_id");
const accessDuties = makeTaxonomy("81-ELG", ["Universal eligibility or explicit lawful limitation", "Automatic or assisted enrollment", "Identity and documentation alternatives", "Cross-boundary and portable entitlement", "Reasonable accommodation and universal design", "Language and accessible communication", "Non-discrimination and disparate-impact review", "Rural, remote, northern, and Indigenous access", "Low-income and hardship protection", "Caregiver, dependent, child, and elder access", "Temporary, emergency, traveler, and unhoused access", "Notice, renewal, appeal, remedy, and retained status"], "eligibility_access_duty_id");
const affordabilityProtections = makeTaxonomy("81-AFP", ["Income-indexed burden cap", "Lifeline rate, fare, or allowance", "Zero-cost essential minimum", "Connection, equipment, and deposit support", "Arrears management and debt protection", "Disconnection or exclusion moratorium", "Automatic benefit and subsidy enrollment", "High-need, disability, and medical protection", "Rural, remote, and high-cost-area protection", "Family, dependent, and household-size adjustment", "Emergency relief and bill stabilization", "Refund, correction, reconnection, and restitution"], "affordability_protection_id");
const subsidyMechanisms = makeTaxonomy("81-CSM", ["Progressive general revenue", "Intergovernmental equalization or transfer", "Within-class rate or fare cross-subsidy", "Across-class rate or fare cross-subsidy", "Geographic high-cost support", "Connection and infrastructure contribution", "Provider contribution or universal-service fund", "Value capture, levy, or dedicated assessment", "Public-option retained earnings", "Risk pool, reserve, or stabilization fund", "Targeted voucher or direct benefit", "In-kind public provision or shared infrastructure"], "cross_subsidy_mechanism_id");
const coverageDimensions = makeTaxonomy("81-COV", ["Network or route presence", "Address, stop, facility, or service-point reach", "Population and household reach", "Eligible-public reach", "Connection and enrollment availability", "Device, vehicle, equipment, or interface access", "Peak and reserve capacity", "Frequency, wait, latency, and congestion", "Comparable quality and accessibility", "Active use and retention", "Outage, denial, disconnection, and unmet need", "Future growth, redundancy, and restoration capacity"], "coverage_access_dimension_id");
const providerModels = makeTaxonomy("81-PRV", ["Direct municipal, regional, provincial, state, federal, or tribal provision", "Public authority, utility, corporation, or crown entity", "Indigenous government, nation, authority, or enterprise", "Consumer, worker, producer, platform, or multi-stakeholder cooperative", "Community, nonprofit, mutual, or social-purpose provider", "Regulated investor-owned utility or common carrier", "Licensed competitive provider with universal duties", "Contracted or franchised service operator", "Public-private partnership or concession", "Shared intergovernmental or compact provider", "Open-access infrastructure with multiple service providers", "Standby public option, administrator, receiver, or emergency operator"], "provider_operating_model_id");
const interoperabilityRequirements = makeTaxonomy("81-IOS", ["Open published interface", "Conformance and certification", "Versioning and backward compatibility", "Identity and credential federation", "Account and entitlement portability", "Data export and machine readability", "Payment, billing, fare, and settlement compatibility", "Physical connector, vehicle, facility, or equipment compatibility", "Safety, accessibility, and emergency interface", "Operational dispatch and mutual-aid interface", "Cybersecurity and incident exchange", "Privacy, consent, minimization, and retention", "Procurement access and vendor-neutral specification", "Change control, sunset, migration, and archival support"], "interoperability_requirement_id");
const continuityCapabilities = makeTaxonomy("81-CON", ["Essential-service dependency map", "Protected user and load register", "Reserve and surge capacity", "Redundant route, site, system, or supplier", "Manual, offline, local, or low-tech fallback", "Mutual-aid agreement and resource inventory", "Emergency workforce, credential, and access protocol", "Critical spares, fuel, water, material, and logistics", "Accessible alert, status, and support communication", "Failover, degraded-mode, and recovery exercise", "Restoration priority and verification", "After-action correction and institutional memory"], "continuity_capability_id");
const userRights = makeTaxonomy("81-URR", ["Equal and non-discriminatory service", "Accessible and reasonably accommodated service", "Affordable essential minimum", "Safe, private, secure, and dignified service", "Clear terms, prices, eligibility, and performance", "Notice before adverse action", "Explanation and evidence access", "Assisted complaint and human review", "Independent appeal and representation", "Interim continuity during dispute", "Correction, refund, reconnection, and replacement", "Compensation, restitution, and systemic remedy", "Data access, portability, deletion, and privacy remedy", "Public reporting, collective standing, and regulator enforcement"], "user_right_remedy_id");
const qualityMeasures = makeTaxonomy("81-SQM", ["Availability and scheduled service", "Coverage and connection", "Capacity and congestion", "Frequency, latency, and wait time", "Completion, accuracy, and fitness", "Safety and health", "Accessibility and accommodation", "Reliability and interruption frequency", "Restoration duration and recurrence", "Customer support and issue resolution", "Complaint, denial, and appeal outcome", "Maintenance backlog and asset condition", "Affordability and hardship", "Distribution, disparity, and protected-public performance"], "service_quality_measure_id");
const failureTriggers = makeTaxonomy("81-PFT", ["Insolvency, liquidity, covenant, or insurance failure", "Unsafe operation or material compliance breach", "Service-floor, coverage, capacity, or quality failure", "Systemic affordability, exclusion, discrimination, or rights failure", "Repeated or prolonged outage and restoration failure", "Maintenance, renewal, asset-condition, or integrity failure", "Cybersecurity, privacy, data, or critical-interface failure", "Workforce, supplier, fuel, material, or logistics failure", "Misreporting, obstruction, governance, conflict, or audit failure", "License, franchise, contract, permit, or authority failure", "Uncontrolled exit, abandonment, merger, or ownership change", "Common-mode, disaster, climate, or cross-system failure"], "provider_failure_trigger_id");
const restorationDuties = makeTaxonomy("81-ERR", ["Life safety and emergency response", "Medical, disability, care, and life-support needs", "Water, sanitation, shelter, heating, cooling, and food safety", "Emergency communications, alerts, identity, and payments", "Accessible evacuation and essential mobility", "Critical facilities and community service hubs", "Rural, remote, isolated, and infrastructure-poor communities", "Indigenous jurisdiction, treaty, and community continuity", "Prevent cascading infrastructure and environmental harm", "Transparent rationing, exceptions, and appeal", "Damage assessment, repair verification, and public status", "Normalization, backlog remedy, bill relief, audit, and reauthorization"], "emergency_restoration_duty_id");

const floors = upstream.map((source, index) => {
  const n = String(index + 1).padStart(3, "0");
  return {
    service_floor_universal_access_dossier_id: `81-SFD-${n}`, slug: `81-sfd-${n}-${shortName(source)}`, record_kind: "service_floor_universal_access_dossier", record_status: "Published", service_floor_state: "Inactive - No Verified Phase 80 Portfolio Realization Record", adoption_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, portfolio_stress_rebalancing_realization_ledger_id: source.portfolio_stress_rebalancing_realization_ledger_id,
    service_floor_checks: inactiveChecks(serviceFloorGates, "No Phase 80 chain contains an admitted thesis, authorized portfolio, funded sequence, verified capacity and transition record, completed stress and off-ramp review, realized public-value finding, independent review, and receipts."),
    essential_service_class_records: serviceClasses.map((item) => ({ ...item, classification_state: "Unassigned", authority_ids: [], evidence_ids: [], decision_id: null })),
    service_floor_dimension_records: floorDimensions.map((item) => ({ ...item, floor_state: "Not Defined", standard_ids: [], threshold_ids: [], evidence_ids: [] })),
    eligibility_access_duty_records: accessDuties.map((item) => ({ ...item, duty_state: "Unassigned", population_ids: [], owner_ids: [], remedy_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    verified_phase80_realization_record_ids: [], authority_records: [], essential_service_records: [], eligible_public_records: [], service_floor_records: [], baseline_records: [], unmet_need_records: [], access_records: [], eligibility_records: [], nondiscrimination_records: [], capacity_records: [], place_coverage_records: [], provider_duty_records: [], funding_records: [], standard_records: [], rights_records: [], continuity_records: [], option_records: [], first_reviewer_id: null, second_reviewer_id: null, service_floor_receipt_id: null, propagation_status: "not_started",
    infrastructure_as_access_allowed: false, provider_presence_as_universal_service_allowed: false, average_service_as_floor_allowed: false, automatic_service_classification_allowed: false, automatic_floor_adoption_allowed: false, automatic_eligibility_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const affordabilityLedgers = floors.map((floor, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    affordability_cross_subsidy_coverage_ledger_id: `81-ACL-${n}`, slug: `81-acl-${n}-${shortName(source)}`, record_kind: "affordability_cross_subsidy_coverage_ledger", record_status: "Published", affordability_state: "Inactive - No Adopted Essential-Service Floor", affordability_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, service_floor_universal_access_dossier_id: floor.service_floor_universal_access_dossier_id, portfolio_stress_rebalancing_realization_ledger_id: floor.portfolio_stress_rebalancing_realization_ledger_id,
    affordability_coverage_checks: inactiveChecks(affordabilityCoverageGates, "No adopted Phase 81 essential-service floor, eligible-public record, access duty, service standard, funding authority, review, or receipt exists."),
    affordability_protection_records: affordabilityProtections.map((item) => ({ ...item, protection_state: "Unassessed", authority_ids: [], funding_ids: [], beneficiary_ids: [] })),
    cross_subsidy_mechanism_records: subsidyMechanisms.map((item) => ({ ...item, mechanism_state: "Unassessed", contributor_ids: [], beneficiary_ids: [], allocation_rule_id: null })),
    coverage_access_dimension_records: coverageDimensions.map((item) => ({ ...item, measurement_state: "Not Measured", geography_ids: [], population_ids: [], observation_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    cost_records: [], ability_to_pay_records: [], burden_records: [], protection_records: [], funding_records: [], subsidy_records: [], cross_subsidy_records: [], network_coverage_records: [], connection_records: [], take_up_records: [], capacity_records: [], disaggregation_records: [], quality_parity_records: [], public_option_records: [], scenario_records: [], trigger_records: [], first_reviewer_id: null, second_reviewer_id: null, affordability_receipt_id: null, propagation_status: "not_started",
    average_price_as_affordability_allowed: false, network_presence_as_access_allowed: false, subsidy_as_service_outcome_allowed: false, automatic_tariff_allowed: false, automatic_subsidy_allowed: false, automatic_expansion_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const providerRegisters = affordabilityLedgers.map((ledger, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    provider_plurality_interoperability_continuity_register_id: `81-PIC-${n}`, slug: `81-pic-${n}-${shortName(source)}`, record_kind: "provider_plurality_interoperability_continuity_register", record_status: "Published", provider_state: "Inactive - No Verified Affordability And Coverage Record", provider_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, affordability_cross_subsidy_coverage_ledger_id: ledger.affordability_cross_subsidy_coverage_ledger_id, service_floor_universal_access_dossier_id: ledger.service_floor_universal_access_dossier_id,
    provider_continuity_checks: inactiveChecks(providerContinuityGates, "No verified Phase 81 affordability, cross-subsidy, coverage, access, capacity, quality-parity, or public-option record exists."),
    provider_operating_model_records: providerModels.map((item) => ({ ...item, model_state: "Unassessed", provider_ids: [], authority_ids: [], duty_ids: [] })),
    interoperability_requirement_records: interoperabilityRequirements.map((item) => ({ ...item, requirement_state: "Unverified", standard_ids: [], conformance_ids: [], exception_ids: [] })),
    continuity_mutual_aid_capability_records: continuityCapabilities.map((item) => ({ ...item, capability_state: "Untested", owner_ids: [], exercise_ids: [], receipt_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    provider_records: [], plurality_records: [], concentration_records: [], open_standard_records: [], interface_records: [], conformance_records: [], data_governance_records: [], portability_records: [], procurement_and_license_records: [], performance_records: [], maintenance_records: [], reserve_records: [], mutual_aid_records: [], continuity_plan_records: [], security_records: [], dependency_records: [], common_mode_records: [], exercise_records: [], step_in_readiness_records: [], orderly_exit_records: [], first_reviewer_id: null, second_reviewer_id: null, provider_receipt_id: null, propagation_status: "not_started",
    provider_count_as_plurality_allowed: false, technical_interface_as_interoperability_allowed: false, backup_plan_as_continuity_allowed: false, automatic_provider_selection_allowed: false, automatic_standard_adoption_allowed: false, automatic_mutual_aid_activation_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const restorationLedgers = providerRegisters.map((provider, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    rights_quality_step_in_restoration_ledger_id: `81-RQR-${n}`, slug: `81-rqr-${n}-${shortName(source)}`, record_kind: "rights_quality_step_in_restoration_ledger", record_status: "Published", restoration_state: "Inactive - No Verified Provider Continuity Baseline", intervention_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, provider_plurality_interoperability_continuity_register_id: provider.provider_plurality_interoperability_continuity_register_id, affordability_cross_subsidy_coverage_ledger_id: provider.affordability_cross_subsidy_coverage_ledger_id, service_floor_universal_access_dossier_id: provider.service_floor_universal_access_dossier_id,
    rights_restoration_checks: inactiveChecks(rightsRestorationGates, "No verified Phase 81 provider, interoperability, maintenance, continuity, mutual-aid, exercise, or step-in-readiness baseline exists."),
    user_right_remedy_records: userRights.map((item) => ({ ...item, right_state: "Unadopted", authority_ids: [], complaint_ids: [], remedy_ids: [] })),
    service_quality_reliability_measure_records: qualityMeasures.map((item) => ({ ...item, measure_state: "Not Measured", standard_ids: [], observation_ids: [], finding_id: null })),
    provider_failure_step_in_trigger_records: failureTriggers.map((item) => ({ ...item, trigger_state: "Dormant", event_ids: [], review_id: null, decision_id: null })),
    emergency_rationing_restoration_duty_records: restorationDuties.map((item) => ({ ...item, duty_state: "Unassigned", priority_ids: [], owner_ids: [], receipt_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    rights_charter_records: [], notice_records: [], complaint_records: [], appeal_records: [], remedy_records: [], quality_standard_records: [], reliability_observation_records: [], maintenance_performance_records: [], failure_event_records: [], early_warning_records: [], intervention_option_records: [], step_in_authority_records: [], continuity_transition_records: [], emergency_declaration_records: [], rationing_records: [], restoration_records: [], normalization_records: [], long_horizon_accountability_records: [], corrective_action_records: [], first_reviewer_id: null, second_reviewer_id: null, restoration_receipt_id: null, propagation_status: "not_started",
    average_uptime_as_universal_quality_allowed: false, emergency_as_permanent_reduction_allowed: false, provider_failure_as_automatic_step_in_allowed: false, automatic_rights_finding_allowed: false, automatic_intervention_allowed: false, automatic_rationing_allowed: false, automatic_restoration_priority_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0", phase: "81", registry_id: "universal-service-essential-systems-public-option-delivery-registry-001", title: "Universal Service, Essential Systems And Public Option Delivery Registry", captured_date: "2026-08-24", as_of_date: "2026-08-24",
  scope: "Eight inactive service-floor and universal-access dossiers, eight inactive affordability-cross-subsidy-coverage ledgers, eight inactive provider-plurality-interoperability-continuity registers, and eight inactive rights-quality-step-in-restoration ledgers downstream of Phase 80.",
  interpretation_boundary: "Infrastructure coverage is not service access. A low average price is not affordability. Provider presence is not universal service. A technical interface is not interoperability, portability, or user rights. Average uptime is not universal quality. Emergency rationing is not authority for permanent service reduction.",
  activation_rule: "At least one Phase 80 chain must contain an admitted mission thesis, authorized portfolio membership and dependency sequence, lawful funding and financing, verified owner-workforce-supplier-resource capacity, enforceable place-based and just-transition duties, completed stress and off-ramp tests, realized public-value finding, independent review, and receipts. Each Phase 81 floor, eligibility rule, tariff, subsidy, coverage finding, provider model, standard, continuity finding, right, remedy, intervention, rationing rule, restoration priority, and receipt requires a separate human decision.",
  service_floor_gates: serviceFloorGates, affordability_coverage_gates: affordabilityCoverageGates, provider_continuity_gates: providerContinuityGates, rights_restoration_gates: rightsRestorationGates,
  essential_service_classes: serviceClasses, service_floor_dimensions: floorDimensions, eligibility_access_duties: accessDuties, affordability_protections: affordabilityProtections, cross_subsidy_mechanisms: subsidyMechanisms, coverage_access_dimensions: coverageDimensions, provider_operating_models: providerModels, interoperability_requirements: interoperabilityRequirements, continuity_mutual_aid_capabilities: continuityCapabilities, user_rights_remedies: userRights, service_quality_reliability_measures: qualityMeasures, provider_failure_step_in_triggers: failureTriggers, emergency_rationing_restoration_duties: restorationDuties,
  service_floor_states: ["Inactive - No Verified Phase 80 Portfolio Realization Record", "Scoping", "Under Review", "Held", "Adopted With Conditions", "Denied", "Corrected", "Withdrawn"],
  affordability_states: ["Inactive - No Adopted Essential-Service Floor", "Cost Review", "Burden Review", "Coverage Review", "Held", "Authorized With Conditions", "Correcting", "Closed"],
  provider_states: ["Inactive - No Verified Affordability And Coverage Record", "Model Review", "Standards Review", "Continuity Review", "Held", "Authorized With Conditions", "Exercising", "Correcting", "Closed"],
  restoration_states: ["Inactive - No Verified Provider Continuity Baseline", "Rights Review", "Quality Review", "Failure Review", "Held", "Intervening With Conditions", "Restoring", "Normalizing", "Correcting", "Archived"],
  metrics: {
    service_floor_universal_access_dossiers: floors.length, affordability_cross_subsidy_coverage_ledgers: affordabilityLedgers.length, provider_plurality_interoperability_continuity_registers: providerRegisters.length, rights_quality_step_in_restoration_ledgers: restorationLedgers.length,
    service_floor_gates: serviceFloorGates.length, affordability_coverage_gates: affordabilityCoverageGates.length, provider_continuity_gates: providerContinuityGates.length, rights_restoration_gates: rightsRestorationGates.length,
    essential_service_classes: serviceClasses.length, service_floor_dimensions: floorDimensions.length, eligibility_access_duties: accessDuties.length, affordability_protections: affordabilityProtections.length, cross_subsidy_mechanisms: subsidyMechanisms.length, coverage_access_dimensions: coverageDimensions.length, provider_operating_models: providerModels.length, interoperability_requirements: interoperabilityRequirements.length, continuity_mutual_aid_capabilities: continuityCapabilities.length, user_rights_remedies: userRights.length, service_quality_reliability_measures: qualityMeasures.length, provider_failure_step_in_triggers: failureTriggers.length, emergency_rationing_restoration_duties: restorationDuties.length,
    verified_phase80_realization_records_received: 0, service_floors_adopted: 0, essential_service_classes_assigned: 0, eligibility_rules_adopted: 0, affordability_findings_issued: 0, subsidies_authorized: 0, cross_subsidies_authorized: 0, coverage_findings_issued: 0, access_findings_issued: 0, provider_models_authorized: 0, open_standards_adopted: 0, interoperability_findings_issued: 0, continuity_findings_issued: 0, mutual_aid_activations: 0, rights_charters_adopted: 0, quality_findings_issued: 0, failure_triggers_opened: 0, step_in_decisions_issued: 0, emergency_rationing_decisions: 0, restoration_priorities_authorized: 0, remedies_issued: 0, independent_reviews_completed: 0, receipts_created: 0, scores_created: 0, rankings_created: 0, phase64_cells_advanced: 0
  },
  service_floor_universal_access_dossiers: floors, affordability_cross_subsidy_coverage_ledgers: affordabilityLedgers, provider_plurality_interoperability_continuity_registers: providerRegisters, rights_quality_step_in_restoration_ledgers: restorationLedgers
};
await writeJson(join(dataRoot, "phase-81-universal-service-essential-systems-public-option-delivery-registry.json"), registry);

const guideDefinitions = [
  ["briefing-universal-service-doctrine-001", "universal-service-doctrine-001", "Universal Service Doctrine 001: Make The Floor Explicit", "A doctrine for essential services, eligible publics, enforceable floors, durable funding, provider duties, rights, continuity, and public accountability."],
  ["briefing-essential-service-floors-001", "essential-service-floors-001", "Essential-Service Floors 001: Define Minimum Service Before Expansion", "A method for availability, access, affordability, capacity, quality, reliability, safety, accessibility, maintenance, continuity, and revision floors."],
  ["briefing-eligibility-access-nondiscrimination-001", "eligibility-access-nondiscrimination-001", "Eligibility, Access And Non-Discrimination 001: An Offer Is Not Access", "A rights-centred method for eligibility, enrollment, documentation alternatives, portability, universal design, language, disparate impact, appeal, and remedy."],
  ["briefing-affordability-cross-subsidy-001", "affordability-cross-subsidy-001", "Affordability And Cross-Subsidy 001: Average Price Is Not Household Burden", "A transparent framework for ability to pay, total access cost, hardship protection, subsidy incidence, contributor-beneficiary rules, stability, and appeal."],
  ["briefing-coverage-capacity-access-001", "coverage-capacity-access-001", "Coverage, Capacity And Access 001: Infrastructure Presence Is Not Service", "A measurement framework for network reach, connection, take-up, peak capacity, congestion, quality parity, unmet demand, and future growth."],
  ["briefing-public-options-provider-plurality-001", "public-options-provider-plurality-001", "Public Options And Provider Plurality 001: Choice Requires Real Substitutes", "An operating-model guide for public, Indigenous, cooperative, community, nonprofit, regulated, contracted, open-access, and standby providers."],
  ["briefing-interoperability-open-standards-data-portability-001", "interoperability-open-standards-data-portability-001", "Interoperability, Open Standards And Data Portability 001: Interfaces Need Rights", "A guide to conformance, versioning, portability, privacy, accessibility, cybersecurity, procurement neutrality, migration, and public-interest data access."],
  ["briefing-accessibility-user-rights-remedy-001", "accessibility-user-rights-remedy-001", "Accessibility, User Rights And Remedy 001: Service Includes Due Process", "A user-rights framework for accommodation, notice, explanation, complaints, human review, appeal, interim continuity, correction, compensation, and systemic remedy."],
  ["briefing-continuity-mutual-aid-essential-systems-001", "continuity-mutual-aid-essential-systems-001", "Continuity And Mutual Aid 001: Essential Systems Need Practised Fallbacks", "An operations guide for protected loads, reserves, redundancy, mutual aid, accessible communications, degraded modes, exercises, restoration, and learning."],
  ["briefing-service-quality-reliability-state-good-repair-001", "service-quality-reliability-state-good-repair-001", "Service Quality, Reliability And State Of Good Repair 001: Averages Hide Exclusion", "A measurement guide for disaggregated availability, capacity, wait, safety, accessibility, interruptions, restoration, support, complaints, and maintenance."],
  ["briefing-provider-failure-step-in-public-option-001", "provider-failure-step-in-public-option-001", "Provider Failure, Step-In And Public Options 001: Continuity Needs An Executable Successor", "A graduated intervention guide for warning, cure, assistance, direction, administration, transfer, step-in, public provision, orderly exit, and protected continuity."],
  ["briefing-emergency-rationing-restoration-long-horizon-accountability-001", "emergency-rationing-restoration-long-horizon-accountability-001", "Emergency Rationing, Restoration And Long-Horizon Accountability 001: Scarcity Does Not Suspend Rights", "A framework for emergency authority, protected publics, proportional rationing, exceptions, restoration sequence, normalization, remedies, audits, and future readiness."]
];
const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const yamlList = (values) => values.map((value) => `  - "${value}"`).join("\n");
const sharedBody = `
## Start with an essential-service floor

Universal service is a public commitment to a defined floor, not a slogan attached to infrastructure. The record names the essential service, lawful authority, eligible public, service area, current baseline, unmet need, substitute systems, dependencies, funding source, provider duties, measurement method, review cycle, and remedies. It explains why the service is essential and which parts of availability, access, affordability, quality, reliability, safety, accessibility, privacy, continuity, and due process cannot fall below the protected minimum.

A floor must be observable without pretending that one indicator captures the whole service. Availability can coexist with an unaffordable connection, inaccessible interface, long queue, unsafe trip, unreliable schedule, poor water quality, missing language support, or no practical way to appeal. Each dimension therefore has its own unit, geography, affected public, time window, threshold, evidence source, uncertainty, owner, exception rule, correction path, and receipt. A system-wide average cannot establish that every public receives the floor.

Essential-service classification also creates duties. It identifies the infrastructure, workforce, suppliers, information, public institutions, maintenance, reserves, mutual aid, emergency resources, and long-horizon funding required to keep the service available. Classification cannot be inferred from political attention, market size, construction cost, provider identity, or technical novelty. It requires an explicit human decision that states inclusions, exclusions, tradeoffs, dissent, expiry, and revision authority.

## Separate eligibility, offer, connection, access, and sustained use

Eligibility answers who is entitled to seek the service and under which lawful conditions. An offer records that a provider made service nominally available. Connection records a physical, digital, contractual, or administrative link. Access asks whether the person can actually use the service with acceptable cost, travel, time, equipment, documentation, language, safety, accessibility, and support. Sustained use asks whether the service remains usable, reliable, affordable, and appropriate over time. These states must never be collapsed.

Universal access requires documentation alternatives, assisted enrollment, portability across provider and jurisdiction boundaries, reasonable accommodation, universal design, accessible communication, non-discrimination, and disparate-impact review. It accounts for children, elders, disabled people, caregivers, low-income households, rural and remote residents, Indigenous rights-holders, travelers, temporary residents, unhoused people, people without conventional identity documents, and those who need offline or in-person alternatives.

Administrative burden belongs in the access record. Forms, renewals, wait times, missed-work costs, deposits, equipment, data plans, transfers, travel, literacy, identity proof, and repeated eligibility checks can deny service even when the nominal price is low. The record follows denials, incomplete applications, abandonment, disconnection, churn, complaint, appeal, and remedy rather than counting only successful enrollments.

## Define affordability as a distributional condition

Affordability is the relationship between the total cost of adequate service and the resources and needs of the person or household. It includes prices, fares, fees, taxes, deposits, connection charges, devices, vehicles, travel, time, care, documentation, financing costs, arrears, penalties, and the cost of unreliable alternatives. An average price, median bill, or system revenue total does not establish affordability.

The record disaggregates burden by income, wealth, household composition, disability, health need, tenure, geography, service class, usage pattern, climate exposure, and volatility. It identifies the essential minimum before examining optional consumption. It tests lifeline rates, zero-cost minimums, burden caps, automatic subsidies, connection support, arrears plans, disconnection protections, medical protections, high-cost-area support, emergency relief, and restitution. Each protection has authority, eligibility, funding, duration, administrative burden, take-up, leakage, error, appeal, and review.

Cross-subsidy must be visible. The record names contributor and beneficiary classes, the allocation formula, expected incidence, stability, affordability effect, distribution, behavioral response, provider incentive, bypass risk, fiscal exposure, and revision rule. General revenue, equalization, rate classes, universal-service funds, provider contributions, dedicated levies, reserves, public-option earnings, vouchers, and in-kind provision are distinct instruments. A subsidy amount does not prove that the service reached the intended public or reduced hardship.

## Measure coverage, capacity, connection, and quality together

Infrastructure presence is not service access. Coverage can mean a line on a map, an address passed, a station within a radius, a route scheduled, a facility licensed, a household connectable, an eligible person offered service, an active connection, or a user receiving the protected floor. The registry keeps these denominators explicit and never substitutes one for another.

Capacity is measured under normal, peak, maintenance, emergency, and recovery conditions. The record includes reserve margin, oversubscription, queue, congestion, wait, frequency, latency, staffing, fleet, treatment, generation, storage, throughput, spares, maintenance outage, and future growth. A network can cover a place on paper while having insufficient capacity to connect or serve it reliably.

Quality parity is a universal-service question. The record compares safety, accessibility, frequency, speed, latency, accuracy, continuity, restoration, customer support, maintenance, and remedy across places and publics. It does not treat a slower, less reliable, less accessible, or more fragile tier as equivalent merely because some service exists. Disaggregation remains visible, and no composite score or ranking may erase the worst-served public.

## Govern provider plurality and the public option

Provider plurality is more than a count of legal entities. The record examines common ownership, shared infrastructure, common vendors, geographic exclusivity, switching costs, data and entitlement portability, interface compatibility, workforce concentration, supply dependencies, and whether a real substitute can serve the same public at the protected floor. Several brands on one fragile stack may still be a single point of failure.

Operating models can include direct public provision, public authorities and utilities, Indigenous governments and enterprises, cooperatives, community and nonprofit providers, regulated common carriers, licensed competitors, contracted operators, franchises, concessions, shared intergovernmental entities, open-access infrastructure, and standby public options. Each model identifies mission, ownership, authority, service area, public duties, financing, control, data, maintenance, workforce, quality, complaint, continuity, exit, and audit arrangements.

A public option can be a direct provider, shared backbone, common platform, technical team, emergency operator, receiver, open standard, data utility, procurement channel, or capacity reserve. Its value is not proven by public ownership alone. It must have lawful authority, capable people, operational knowledge, assets or access rights, durable funding, open records, measurable service duties, user rights, and the ability to enter, expand, contract, or exit without erasing obligations.

## Make interoperability operational and rights-preserving

Interoperability means independently governed systems can exchange what is necessary and safely complete a defined service without forcing the public to surrender rights or become trapped. A published interface is only the beginning. The record covers conformance, certification, versioning, backward compatibility, identity, entitlement, account, payment, billing, physical connectors, safety, accessibility, dispatch, cybersecurity, privacy, consent, minimization, retention, audit, migration, and sunset.

Open standards must be implementable on fair terms, documented, testable, maintainable, and governed against capture. Procurement specifications remain vendor-neutral where lawful and appropriate. Exceptions identify their technical or rights basis, affected users, compensating controls, expiry, and appeal. Data portability includes usable formats, semantics, provenance, permissions, timeliness, secure transfer, deletion or retention duties, and support for users who cannot manage the transfer alone.

Interoperability cannot become a pretext for unrestricted data sharing. The public-interest purpose, minimum data, lawful authority, security, privacy, and remedy remain explicit. Nor can portability substitute for service continuity: a portable account is not useful when no substitute provider has capacity, accepts the entitlement, supports the interface, or meets the service floor.

## Build continuity around practised capability

Continuity planning begins with dependencies and protected publics. It identifies essential loads, maximum tolerable interruption, degraded modes, reserve capacity, alternate sites and routes, suppliers, spares, fuel, water, power, communications, workforce, credentials, facilities, cloud and data services, payment, identity, and cross-border support. Manual, offline, local, and low-tech fallbacks remain available where high-technology paths can fail together.

Mutual aid is an operating agreement, not a contact list. It names authority, participating organizations, resources, activation criteria, command, credential recognition, liability, safety, reimbursement, information exchange, public communication, prioritization, demobilization, restoration, and after-action correction. Exercises must test real interfaces and degraded conditions, including accessible alerts, user support, constrained capacity, conflicting priorities, cyber or physical isolation, and staff absence.

Continuity metrics distinguish outage frequency, duration, affected users, severity, restoration sequence, recurrence, cause, uncertainty, and downstream harm. Aggregate uptime can hide repeated failure for one neighborhood, route, user class, facility, or accessible channel. State of good repair, preventive maintenance, renewal, spares, inspections, workforce, supplier health, and deferred work are upstream continuity controls, not separate housekeeping.

## Treat rights, complaints, appeals, and remedies as service infrastructure

The service contract includes equal treatment, accessibility, affordability, safety, privacy, security, dignity, clear terms, notice, explanation, evidence access, assisted complaints, human review, independent appeal, representation, interim protection, correction, refund, reconnection, replacement, compensation, restitution, and systemic remedy. A service without usable due process does not meet a universal floor.

Complaint statistics are interpreted with access to the complaint system in mind. Low volume can reflect good service, but it can also reflect fear, inaccessible channels, language barriers, lack of notice, digital exclusion, short deadlines, provider control, or absence of an effective remedy. The record follows intake, acknowledgment, triage, investigation, response, resolution, escalation, appeal, remedy, recurrence, and public reporting with privacy protection.

Remedies are fitted to the harm. Individual correction does not close a systemic failure; compensation does not replace restoration; reconnection does not erase unlawful disconnection; and a future policy change does not resolve past loss without a decision on restitution. Remedy records name owner, funding, affected public, deadline, verification, appeal, recurrence prevention, and completion receipt.

## Prepare a graduated response to provider failure

Provider failure can be financial, operational, technical, safety-related, rights-based, cyber, workforce, supplier, governance, maintenance, contractual, regulatory, or common-mode. A missed target opens a bounded review; it does not automatically prove failure or authorize step-in. The trigger record identifies the standard, event, date, scale, affected public, evidence, uncertainty, cure opportunity, protected floor, authority, conflicts, and review.

Intervention is graduated and proportionate: technical assistance, additional reporting, enforceable condition, independent monitor, rate or payment action, direction, temporary administrator, transfer, receivership, license action, contract termination, public-option expansion, or operational step-in. Each step separately addresses authority, necessity, capability, continuity, rights, cost, funding, workforce, suppliers, assets, data, contracts, liabilities, exit, review, and receipts.

An executable successor requires more than legal power. It needs operational knowledge, current records, access to facilities and systems, credentials, data, interfaces, workforce, suppliers, inventories, funding, insurance, safety cases, customer communications, payment flows, and mutual-aid support. Step-in readiness is tested before a crisis. Provider failure cannot itself choose the successor or erase due process.

## Bound emergency rationing and restoration

An emergency declaration names the hazard, affected system, geography, evidence, authority, start, expiry, command, protected publics, essential loads, service floor, reporting cadence, and review. Scarcity can require rationing, but the rule must be necessary, proportionate, time-bound, accessible, non-discriminatory, explainable, appealable, and connected to exceptions for life safety, disability, health, care, sanitation, shelter, heating, cooling, food, communications, evacuation, and other essential needs.

Restoration priorities are explicit public decisions. They consider life safety, medical and disability needs, water and sanitation, shelter and temperature, emergency communication, accessible mobility, critical facilities, community hubs, remote and isolated places, Indigenous jurisdiction, cascading infrastructure, environmental harm, repair feasibility, resource constraints, and fair burden. Technical ease alone does not determine priority.

Restoration records show damage assessment, isolation, temporary service, mutual aid, repair, inspection, acceptance, user communication, estimated and actual restoration, exceptions, remaining exclusions, safety, environmental effects, bill relief, and receipts. Return of aggregate capacity does not prove restoration for every public. Normalization closes emergency authority, restores ordinary rights, clears backlog, remedies harm, replenishes reserves, corrects plans, and records what must change before the next event.

## Preserve long-horizon accountability

Universal service is reviewed across operations, maintenance, renewal, affordability, demographics, technology, climate, provider health, workforce, suppliers, public finance, rights, distribution, and future users. The review keeps original baselines, standards, failures, complaints, outages, exclusions, subsidies, interventions, and remedies visible. It does not rewrite a reduced floor as success or use emergency scarcity to normalize permanent degradation.

Learning may revise a floor, eligibility rule, funding mechanism, provider model, standard, continuity plan, or restoration protocol only through a new human decision. The record publishes reasons, affected publics, alternatives, distribution, uncertainty, dissent, transition, conditions, expiry, appeal, and receipts. No comparative score or automated ranking selects which place, provider, or user receives service.

## Public contract

The Phase 81 contract keeps essential-service classification, service floors, eligibility, access, affordability, subsidy, cross-subsidy, coverage, capacity, provider model, plurality, interoperability, portability, maintenance, continuity, mutual aid, user rights, complaints, appeals, remedies, quality, reliability, provider failure, intervention, step-in, rationing, restoration, normalization, review, and receipts separate. It cannot mutate Phase 64 or any operating record.

The registry is deliberately empty. There is no verified Phase 80 realization chain, adopted service floor, assigned essential-service class, eligible-public decision, tariff, affordability finding, subsidy, cross-subsidy, coverage or access finding, provider authorization, interoperability finding, continuity exercise, rights charter, quality finding, failure trigger, step-in decision, rationing decision, restoration priority, remedy, reviewer identity, receipt, score, rank, Phase 64 advance, or operating-outcome change. Future records can open only from real dated evidence and separately authorized human decisions.
`;
for (const [id, slug, title, summary] of guideDefinitions) {
  const body = `---\nid: "${id}"\ntitle: "${title}"\nslug: "${slug}"\nrecord_status: "Published"\nsummary: "${summary}"\npublished_date: 2026-08-24\ncaptured_date: 2026-08-24\nsignal_ids:\n${yamlList(signalIds)}\nevidence_gap_ids:\n${yamlList(evidenceGapIds)}\nclaim_scope: "Editorial Synthesis"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: 2026-08-24\ntop_takeaways:\n  - "Universal service requires explicit floors, eligible publics, access, affordability, quality, rights, continuity, and remedies."\n  - "Coverage, provider identity, technical interfaces, average price, and average uptime cannot substitute for service received by every protected public."\n  - "No floor, tariff, subsidy, provider, standard, intervention, restoration priority, score, or ranking is selected by this guide."\nconstraint_watch:\n  - "Public Trust"\n  - "Infrastructure"\n  - "Capital"\n  - "Labor"\n  - "Regulation"\n  - "Interpretation"\nwhat_to_watch_next:\n  - "A verified Phase 80 chain with admitted investment, authorized delivery capacity, realized public value, independent review, and receipts"\n  - "Separately adopted service floors, access duties, affordability protections, provider obligations, open standards, user rights, and continuity plans"\n  - "Real dated quality, failure, intervention, emergency, rationing, restoration, remedy, review, and propagation receipts"\n---\n\n${summary}\n\n${sharedBody}`;
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), body, "utf8");
}

const mapDefinitions = [
  ["dependency-map-infrastructure-coverage-is-not-service-access", "infrastructure-coverage-is-not-service-access", "Infrastructure Coverage Is Not Service Access", "A path from infrastructure and address reach through connection, affordability, accessibility, capacity, quality, sustained use, and remedy."],
  ["dependency-map-low-average-price-is-not-affordability", "low-average-price-is-not-affordability", "A Low Average Price Is Not Affordability", "A path from total access cost and ability to pay through burden, hardship, protection, subsidy incidence, take-up, and correction."],
  ["dependency-map-provider-presence-is-not-universal-service", "provider-presence-is-not-universal-service", "Provider Presence Is Not Universal Service", "A path from provider authority and capacity through enforceable floors, eligible publics, public options, continuity, rights, and receipts."],
  ["dependency-map-technical-interface-is-not-interoperability-rights", "technical-interface-is-not-interoperability-rights", "A Technical Interface Is Not Interoperability Or Rights", "A path from published interfaces through conformance, versioning, accessibility, privacy, portability, switching, migration, and remedy."],
  ["dependency-map-average-uptime-is-not-universal-quality", "average-uptime-is-not-universal-quality", "Average Uptime Is Not Universal Quality", "A path from disaggregated interruptions and capacity through safety, accessibility, restoration, maintenance, complaints, and affected-public outcomes."],
  ["dependency-map-emergency-rationing-is-not-permanent-service-reduction", "emergency-rationing-is-not-permanent-service-reduction", "Emergency Rationing Is Not Permanent Service Reduction", "A path from declared necessity through protected publics, proportional rules, exceptions, appeal, restoration, normalization, remedy, and reauthorization."]
];
for (const [id, slug, title, summary] of mapDefinitions) {
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id, title, slug, summary, map_type: "Dependency Stack", record_status: "Published", primary_topic: "Human Futures", framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"], constraint_tags: ["Public Trust", "Infrastructure", "Regulation", "Labor", "Interpretation"],
    map_question: `What records are required before ${title.toLowerCase()} can support a bounded universal-service decision?`, interpretation_boundary: "This map is a control path. It does not establish a service floor, eligibility, affordability, subsidy, coverage, provider, standard, continuity finding, right, remedy, intervention, restoration priority, score, rank, or receipt.",
    source_ids: [...new Set(upstream.flatMap((record) => record.source_ids))].slice(0, 8), signal_ids: signalIds, technology_ids: [], local_system_ids: [...new Set(upstream.flatMap((record) => record.local_system_ids))], evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-investment", label: "Verified Phase 80 portfolio-realization chain", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 80 record exists." },
      { id: "node-floor", label: "Essential-service class, eligible public, enforceable floor, and authority", node_type: "Constraint", note: "Infrastructure does not define a service floor." },
      { id: "node-afford", label: "Affordability, cross-subsidy, coverage, connection, capacity, and quality parity", node_type: "Constraint", note: "Averages do not prove universal access." },
      { id: "node-provider", label: "Provider plurality, public option, open standards, and portability", node_type: "Constraint", note: "Provider presence does not prove substitutability." },
      { id: "node-continuity", label: "Maintenance, redundancy, mutual aid, exercises, and step-in readiness", node_type: "Constraint", note: "A plan is not practised capability." },
      { id: "node-rights", label: "Rights, complaints, appeals, quality, failure, rationing, restoration, and remedy", node_type: "Constraint", note: "Emergency power remains bounded." },
      { id: "node-receipt", label: "Independent review, dissent, correction, normalization, archive, and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 81 receipt exists." }
    ],
    links: [
      { from: "node-investment", to: "node-floor", relationship: "Depends On", confidence: "Missing Evidence", note: "Universal-service commitments follow verified investment realization." },
      { from: "node-floor", to: "node-afford", relationship: "Depends On", confidence: "Missing Evidence", note: "Affordability and coverage tests need an adopted floor." },
      { from: "node-afford", to: "node-provider", relationship: "Depends On", confidence: "Missing Evidence", note: "Provider models respond to verified access conditions." },
      { from: "node-provider", to: "node-continuity", relationship: "Depends On", confidence: "Missing Evidence", note: "Continuity requires executable providers and interfaces." },
      { from: "node-continuity", to: "node-rights", relationship: "Depends On", confidence: "Missing Evidence", note: "Rights and intervention need verified baselines." },
      { from: "node-rights", to: "node-receipt", relationship: "Depends On", confidence: "Missing Evidence", note: "Every public decision requires review and receipt." }
    ],
    what_this_map_supports: ["Separate floor, access, affordability, subsidy, provider, standard, continuity, rights, intervention, and restoration decisions.", "Explicit protected publics, dependencies, duties, triggers, options, appeals, remedies, and review.", "Public reasoning without composite provider or place scoring."],
    what_this_map_does_not_prove: ["It does not classify, entitle, price, subsidize, connect, select, authorize, intervene, ration, restore, or remedy.", "It does not convert infrastructure, provider presence, an average price, a technical interface, or uptime into universal service.", "It does not create a receipt, score, rank, stage advance, or operating-outcome change."],
    next_records_needed: ["A verified Phase 80 portfolio and realization chain with receipts.", "Separately adopted floors, access duties, affordability protections, provider duties, standards, rights, continuity, and step-in readiness.", "Independent quality, failure, emergency, restoration, remedy, correction, and propagation receipts."]
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
  const records = [floors[index], affordabilityLedgers[index], providerRegisters[index], restorationLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 81 universal-service and essential-systems boundary")) {
    const links = records.map((record) => { const value = Object.values(record).find((item) => typeof item === "string" && /^81-(SFD|ACL|PIC|RQR)-/.test(item)); return `[${value}](/evidence/essential-services/${record.slug}/)`; });
    body = body.trimEnd() + `\n\n## Phase 81 universal-service and essential-systems boundary\n\nThe [Universal Service And Essential Systems Registry](/evidence/essential-services/) assigns ${links.join(", ")} to this named file. No essential-service class, floor, eligibility rule, affordability finding, subsidy, coverage or access finding, provider or standard authorization, continuity finding, user-rights finding, intervention, rationing rule, restoration priority, remedy, receipt, score, rank, or Phase 64 cell change exists.\n`;
    await writeFile(path, body, "utf8");
  }
}

const localFileById = {
  "local-us-southwest-chip-corridor": "local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate": "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor": "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor": "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor": "local-nevada-lithium-processing-corridor.mdx"
};
for (const [localId, filename] of Object.entries(localFileById)) {
  const localRecords = floors.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 81 universal-service, affordability, continuity, and rights boundary")) {
    body = body.trimEnd() + `\n\n## Phase 81 universal-service, affordability, continuity, and rights boundary\n\nThe [Universal Service And Essential Systems Registry](/evidence/essential-services/) connects ${localRecords.map((record) => record.named_entity).join(" and ")} to essential-service floors, access, affordability, cross-subsidy, coverage, capacity, provider plurality, public options, interoperability, maintenance, continuity, rights, quality, step-in, rationing, restoration, and remedy controls. Infrastructure presence, a provider, average price, or average uptime does not establish universal service for this place.\n`;
    await writeFile(path, body, "utf8");
  }
}

const operatingBriefings = ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-fiscal-capacity-contribution-sharing-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-portfolio-construction-without-ranking-001.mdx", "briefing-place-based-value-just-transition-001.mdx", "briefing-public-value-realization-transition-accountability-001.mdx", "briefing-emergency-powers-civil-safeguards-001.mdx", "briefing-emergency-authority-normalization-001.mdx"];
for (const briefingName of operatingBriefings) {
  const path = join(contentRoot, "briefings", briefingName); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 81 universal-service, public-option, and restoration control")) {
    body = body.trimEnd() + "\n\n## Phase 81 universal-service, public-option, and restoration control\n\nThe [Universal Service And Essential Systems Registry](/evidence/essential-services/) adds eight inactive service-floor dossiers, eight inactive affordability-cross-subsidy-coverage ledgers, eight inactive provider-plurality-interoperability-continuity registers, and eight inactive rights-quality-step-in-restoration ledgers. It creates zero floors, eligibility rules, tariffs, subsidies, coverage or access findings, provider or standard decisions, continuity findings, rights findings, interventions, rationing rules, restoration priorities, remedies, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

await writeJson(join(contentRoot, "updates", "2026-08-24-phase-81-universal-service-essential-systems-public-options.json"), {
  id: "update-2026-08-24-phase-81-universal-service-essential-systems-public-options", effective_date: "2026-08-24", entry_type: "Source Refresh", title: "Phase 81 adds universal-service, essential-systems, and public-option delivery controls",
  summary: "Eight inactive service-floor dossiers, eight inactive affordability-cross-subsidy-coverage ledgers, eight inactive provider-plurality-interoperability-continuity registers, and eight inactive rights-quality-step-in-restoration ledgers now expose the universal-service contract. Twelve guides and six maps deepen the content without adopting a floor, tariff, subsidy, provider, standard, intervention, rationing rule, restoration priority, score, or ranking.",
  affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"], related_paths: ["/evidence/essential-services/", ...guideDefinitions.map(([, slug]) => `/briefings/${slug}/`), "/data/universal-service-essential-systems-public-options.json"],
  evidence_note: "This release contains empty universal-service, access, affordability, cross-subsidy, coverage, provider, interoperability, continuity, rights, quality, step-in, rationing, restoration, and remedy contracts plus synthetic-only validation. It does not contain a verified Phase 80 realization record or a Phase 81 decision or receipt.", materiality: "No record-state change", publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, investment, service, fiscal, project, emergency, and operating states unchanged.", next_check_date: "2026-09-01", work_package: "docs/work-packages/phase-81-universal-service-essential-systems-public-option-delivery.md"
});

console.log(`Phase 81 content built: ${floors.length} inactive floor dossiers, ${affordabilityLedgers.length} inactive affordability ledgers, ${providerRegisters.length} inactive provider registers, ${restorationLedgers.length} inactive restoration ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 universal-service decisions.`);
