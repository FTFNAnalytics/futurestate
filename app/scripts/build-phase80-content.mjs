import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase79 = await readJson(join(dataRoot, "phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry.json"));
const upstream = phase79.intergenerational_balance_sheet_stewardship_ledgers;
const shortName = (record) => record.slug.replace(/^79-ibs-\d+-/, "");
const inactiveChecks = (gates, basis) => gates.map((gate) => ({ ...gate, decision_state: "Inactive", basis }));
const makeTaxonomy = (prefix, labels, idKey) => labels.map((label, index) => ({ [idKey]: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));

const investmentThesisGates = [
  ["80-IMT-01-STEWARD", "Verified Phase 79 asset, obligation, lifecycle, procurement-risk, distribution, stress, and audit record"],
  ["80-IMT-02-AUTHORITY", "Ordinary legal, fiscal, planning, treaty, rights, and delivery authority"],
  ["80-IMT-03-MISSION", "Public mission, service floor, beneficiaries, burdens, time horizon, and success boundary"],
  ["80-IMT-04-BASELINE", "No-action, current-policy, repair, reuse, demand-management, retirement, and public-option baselines"],
  ["80-IMT-05-NEED", "Verified need, unmet service, distribution, urgency, uncertainty, and evidence limits"],
  ["80-IMT-06-THESIS", "Causal investment thesis connecting inputs, capabilities, outputs, outcomes, and public value"],
  ["80-IMT-07-ADDITIONAL", "Public additionality, market-shaping purpose, crowding effects, and counterfactual"],
  ["80-IMT-08-OPTIONS", "Non-capital, regulatory, operational, maintenance, shared-service, and no-build options"],
  ["80-IMT-09-ASSETS", "Existing public assets, obligations, condition, lifecycle duties, and reusable capability"],
  ["80-IMT-10-DISTRIBUTE", "Place, population, rights-holder, worker, payer, host-community, and future-user distribution"],
  ["80-IMT-11-BOUNDARY", "Land, water, energy, materials, emissions, ecology, housing, and infrastructure limits"],
  ["80-IMT-12-CAPACITY", "Owner, operator, regulator, procurement, technical, fiscal, and oversight capacity"],
  ["80-IMT-13-FUNDING", "Public funding source, affordability, maintenance, renewal, closure, restoration, and contingency"],
  ["80-IMT-14-FINANCING", "Financing instrument, repayment, risk allocation, subsidy, leverage, and residual exposure"],
  ["80-IMT-15-OPTIONS", "Modularity, interoperability, reversible stages, learning value, and off-ramp preservation"],
  ["80-IMT-16-REVIEW", "Independent mission, technical, fiscal, rights, distributional, climate, and future-user review"],
  ["80-IMT-17-DECISION", "Separate admission decision without automatic priority, ranking, funding, or project selection"],
  ["80-IMT-18-RECEIPT", "Thesis, dissent, condition, correction, archive, notice, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const portfolioSequenceGates = [
  ["80-PDS-01-THESIS", "Admitted mission and public-investment thesis with bounded authority"],
  ["80-PDS-02-SCOPE", "Portfolio purpose, boundary, time horizon, decision owner, and public accountability"],
  ["80-PDS-03-MEMBER", "Named candidate identity, function, maturity, location, sponsor, and admission basis"],
  ["80-PDS-04-NONPROJECT", "Policy, maintenance, institution, workforce, data, standard, and public-option membership"],
  ["80-PDS-05-DEPEND", "Technical, institutional, fiscal, regulatory, resource, spatial, and service dependencies"],
  ["80-PDS-06-CRITICAL", "Critical path, bottleneck, common-mode failure, lead time, and predecessor record"],
  ["80-PDS-07-SEQUENCE", "Capital, operating, institutional, workforce, regulatory, and learning sequence"],
  ["80-PDS-08-STAGE", "Stage gate, entry evidence, exit evidence, owner, decision, time bound, and receipt"],
  ["80-PDS-09-OPTION", "Repair, reuse, demand reduction, shared capacity, public provision, partnership, and no-build option"],
  ["80-PDS-10-FUNDING", "Appropriation, grant, rate, tax, transfer, contribution, reserve, and earned-revenue mix"],
  ["80-PDS-11-FINANCING", "Debt, lease, guarantee, concession, equity-like, revolving, and risk-sharing instrument"],
  ["80-PDS-12-AFFORD", "Portfolio-wide lifecycle affordability, liquidity, fiscal room, and contingent exposure"],
  ["80-PDS-13-CAPACITY", "Concurrent delivery, owner staffing, procurement load, oversight, operations, and maintenance"],
  ["80-PDS-14-RESOURCE", "Land, water, energy, materials, grid, transport, housing, and ecological allocation"],
  ["80-PDS-15-DISTRIBUTE", "Place-based benefit, burden, access, displacement, leakage, concentration, and remedy"],
  ["80-PDS-16-TRANSITION", "Worker, supplier, community, rights-holder, service-user, and regional transition duties"],
  ["80-PDS-17-INTERFACE", "Cross-project, cross-agency, cross-jurisdiction, data, standard, and handoff interface"],
  ["80-PDS-18-CONFLICT", "Conflict, recusal, lobbying, related-party, vendor influence, and capture controls"],
  ["80-PDS-19-REVIEW", "Independent portfolio composition, dependency, sequence, finance, capacity, and equity review"],
  ["80-PDS-20-RECEIPT", "Membership, exclusion, sequence, funding, condition, dissent, correction, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const deliveryTransitionGates = [
  ["80-PDC-01-PORTFOLIO", "Authorized portfolio membership, dependency, sequence, finance, and stage-gate record"],
  ["80-PDC-02-OWNER", "Accountable owner, delivery institution, operator, regulator, steward, and escalation path"],
  ["80-PDC-03-BASELINE", "Current institutional, workforce, supplier, infrastructure, resource, and community baseline"],
  ["80-PDC-04-PROGRAM", "Program management, systems integration, schedule, cost, risk, change, and records capability"],
  ["80-PDC-05-PROCURE", "Procurement strategy, market capacity, competition, public option, vendor risk, and exit"],
  ["80-PDC-06-WORKFORCE", "Occupation, skill, credential, clearance, training, mobility, retention, and succession plan"],
  ["80-PDC-07-SUPPLIER", "Supplier identity, tier, geography, capacity, finance, standards, quality, and resilience"],
  ["80-PDC-08-PUBLIC", "In-house technical, operational, data, audit, maintenance, and fallback capacity"],
  ["80-PDC-09-LAND", "Land, corridor, right-of-way, permitting, tenure, treaty, cultural, and restoration conditions"],
  ["80-PDC-10-WATER", "Water source, allocation, quality, treatment, discharge, drought, cumulative effect, and remedy"],
  ["80-PDC-11-ENERGY", "Energy source, grid connection, peak demand, reliability, emissions, backup, and upgrade"],
  ["80-PDC-12-MATERIAL", "Critical material, component, logistics, inventory, recycling, substitution, and end-of-life plan"],
  ["80-PDC-13-HOUSING", "Housing, transport, care, education, health, public-realm, and service-capacity effect"],
  ["80-PDC-14-PLACE", "Local procurement, ownership, revenue, capability, access, burden, and leakage accounts"],
  ["80-PDC-15-TRANSITION", "Worker income, benefits, bargaining, retraining, placement, mobility, retirement, and remedy"],
  ["80-PDC-16-COMMUNITY", "Notice, standing, participation, consent where required, agreement, monitoring, and appeal"],
  ["80-PDC-17-READINESS", "Acceptance, commissioning, operating readiness, maintenance, safety, accessibility, and continuity"],
  ["80-PDC-18-TRIGGER", "Capacity shortfall, resource breach, delay, cost, harm, displacement, or transition-failure trigger"],
  ["80-PDC-19-REVIEW", "Independent delivery-capacity, workforce, supplier, resource, rights, and place-based review"],
  ["80-PDC-20-RECEIPT", "Baseline, readiness, safeguard, agreement, trigger, correction, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const realizationGates = [
  ["80-PRR-01-BASELINE", "Verified portfolio, delivery-capacity, transition, distribution, funding, and lifecycle baseline"],
  ["80-PRR-02-THESIS", "Frozen mission thesis, causal pathway, expected contribution, uncertainty, and failure conditions"],
  ["80-PRR-03-SCENARIO", "Demand, cost, schedule, revenue, rate, resource, climate, technology, and policy scenarios"],
  ["80-PRR-04-CONCENTRATE", "Geographic, sector, vendor, technology, fiscal, resource, and common-mode concentration"],
  ["80-PRR-05-STRESS", "Portfolio-wide stress design, thresholds, protected floors, interdependencies, and receipts"],
  ["80-PRR-06-TRIGGER", "Observed variance, threshold breach, evidence date, affected members, and review authority"],
  ["80-PRR-07-OPTIONS", "Continue, pause, repair, resequence, resize, substitute, split, merge, transfer, or close options"],
  ["80-PRR-08-OFFRAMP", "Reversible exit, sunk-cost treatment, continuity, workforce, community, data, and restoration duty"],
  ["80-PRR-09-REBALANCE", "Bounded rebalancing decision, public reason, distribution, authority, conditions, and time bound"],
  ["80-PRR-10-FINANCE", "Funding, financing, liquidity, debt, guarantee, reserve, and contingent-risk consequences"],
  ["80-PRR-11-CAPACITY", "Owner, operator, workforce, supplier, regulator, maintenance, and oversight consequences"],
  ["80-PRR-12-PLACE", "Regional, local, Indigenous, worker, host-community, service-user, and future-user consequences"],
  ["80-PRR-13-PUBLICOPTION", "Public capability, open standard, shared infrastructure, substitution, and option preservation"],
  ["80-PRR-14-OUTPUT", "Verified delivery output, acceptance, service, quality, reliability, accessibility, and receipt"],
  ["80-PRR-15-OUTCOME", "Observed outcome, contribution limits, alternative explanations, distribution, harm, and uncertainty"],
  ["80-PRR-16-VALUE", "Public-value realization across service, resilience, capability, rights, ecology, place, and time"],
  ["80-PRR-17-CORRECT", "Corrective action, remedy, restitution, maintenance, restoration, and renewed authorization"],
  ["80-PRR-18-LEARN", "Portfolio learning without survivorship bias, failure erasure, outcome inflation, or automatic transfer"],
  ["80-PRR-19-REVIEW", "Independent portfolio stress, rebalancing, realization, transition, and future-user review"],
  ["80-PRR-20-RECEIPT", "Stress, option, decision, dissent, outcome, remedy, archive, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const missionClasses = makeTaxonomy("80-MSN", ["Universal service and essential access", "Safety, health, accessibility, and rights", "State of good repair and maintenance recovery", "Climate mitigation and clean-energy transition", "Climate adaptation, resilience, and disaster continuity", "Housing, mobility, and place-based affordability", "Water, land, ecosystem, and restoration stewardship", "Industrial capability and strategic supply resilience", "Digital, data, standards, and public knowledge infrastructure", "Workforce, education, care, and institutional capability", "Regional inclusion, Indigenous partnership, and just transition", "Long-horizon option value and intergenerational duty"], "mission_class_id");
const instrumentClasses = makeTaxonomy("80-INS", ["Direct public provision", "Capital appropriation and grant", "Operating appropriation and service payment", "Intergovernmental transfer and compact contribution", "Rate, fee, tax, levy, or value capture", "Public debt and general obligation", "Revenue bond and project-linked borrowing", "Guarantee, insurance, indemnity, or credit support", "Revolving fund, public bank, or patient capital", "Public-private, concession, lease, or availability payment", "Community, cooperative, Indigenous, or shared ownership", "Procurement, standard, regulation, demand commitment, or public option"], "instrument_class_id");
const dependencyClasses = makeTaxonomy("80-DEP", ["Mission and service-floor dependency", "Legal, treaty, permit, and regulatory dependency", "Capital, operating, liquidity, and fiscal dependency", "Land, corridor, tenure, and spatial dependency", "Water, energy, material, grid, and infrastructure dependency", "Workforce, credential, clearance, and institutional dependency", "Supplier, vendor, logistics, and market-capacity dependency", "Data, digital, standard, interface, and cybersecurity dependency", "Housing, transport, care, health, and community-service dependency", "Environmental, climate, restoration, and cumulative-effect dependency", "Cross-project, cross-agency, and cross-jurisdiction dependency", "Critical-path, common-mode, timing, and successor dependency"], "dependency_class_id");
const sequenceStages = makeTaxonomy("80-SEQ", ["Mission and public-purpose authorization", "Baseline, alternatives, and no-action review", "Asset, obligation, and lifecycle admission", "Portfolio membership and dependency admission", "Capacity and resource baseline", "Concept, design, standard, and option preservation", "Funding, financing, affordability, and risk authorization", "Land, rights, permit, procurement, and agreement readiness", "Workforce, supplier, infrastructure, and operating readiness", "Delivery, commissioning, acceptance, and service entry", "Outcome, distribution, transition, and public-value review", "Renewal, adaptation, rebalancing, retirement, closure, and restoration"], "sequence_stage_id");
const capacityDimensions = makeTaxonomy("80-CAP", ["Mission owner and accountable sponsor", "Program and portfolio management", "Engineering, technical, design, and systems integration", "Commercial, procurement, contract, and market-shaping", "Fiscal, treasury, finance, accounting, and risk", "Legal, regulatory, treaty, rights, and permitting", "Data, digital, cybersecurity, records, and interoperability", "Operations, maintenance, safety, accessibility, and continuity", "Workforce planning, training, labor relations, and succession", "Supplier development, quality, logistics, and industrial capability", "Community partnership, participation, communication, and remedy", "Environmental, climate, land, water, energy, and restoration", "Independent assurance, audit, evaluation, and public reporting", "Emergency response, fallback, recovery, and institutional memory"], "capacity_dimension_id");
const readinessDimensions = makeTaxonomy("80-RDY", ["Occupation and skill inventory", "Training and education throughput", "Credential, license, clearance, and recognition", "Recruitment, retention, succession, and mobility", "Wage, benefit, bargaining, safety, and job-quality floor", "Supplier identity, ownership, tier, and geography", "Supplier capacity, finance, equipment, and lead time", "Quality, standards, certification, traceability, and acceptance", "Critical material, component, logistics, and inventory resilience", "Public procurement, technical-assistance, and market-development capacity", "Operations, maintenance, spares, repair, and fallback capacity", "Worker and supplier transition, remedy, and long-horizon capability"], "readiness_dimension_id");
const placeObligations = makeTaxonomy("80-PLC", ["Local and regional service access", "Indigenous rights, treaty, consent, and benefit agreement", "Host-community burden, compensation, remedy, and monitoring", "Local ownership, procurement, employment, revenue, and capability", "Housing, transport, care, education, health, and public services", "Land, water, energy, air, habitat, and cumulative effects", "Displacement, exclusion, affordability, and anti-speculation", "Rural, remote, northern, and underserved access", "Worker, supplier, and community transition continuity", "Cross-boundary spillover, leakage, and burden shifting", "Future-user, restoration, closure, and residual duty", "Public notice, standing, appeal, audit, and accessible receipt"], "place_obligation_id");
const transitionSafeguards = makeTaxonomy("80-JTS", ["Early worker and community standing", "Collective bargaining and worker voice", "Income, benefit, pension, and seniority continuity", "Paid training, credential portability, and recognition", "Placement, mobility, relocation, and care support", "Job quality, safety, accessibility, and anti-discrimination", "Local and diverse supplier development", "Community revenue, ownership, and public-option capacity", "Service and affordability continuity", "Environmental remediation and health remedy", "Time-bound obligations, funding, owner, and enforcement", "Independent review, appeal, correction, and completion receipt"], "transition_safeguard_id");
const stressTriggers = makeTaxonomy("80-STR", ["Mission, need, or authority change", "Demand, service, affordability, or distribution variance", "Capital, operating, maintenance, or closure cost variance", "Schedule, critical-path, permit, or acceptance failure", "Funding, financing, liquidity, rate, covenant, or guarantee event", "Owner, regulator, workforce, supplier, or operating-capacity shortfall", "Land, water, energy, material, grid, or infrastructure breach", "Vendor, standard, data, cyber, logistics, or common-mode failure", "Climate, disaster, ecological, contamination, or restoration threshold", "Rights, treaty, participation, legitimacy, displacement, or remedy failure", "Technology obsolescence, interoperability, option, or public-capacity loss", "Portfolio concentration, contagion, transition, or future-user harm"], "stress_trigger_id");
const rebalancingActions = makeTaxonomy("80-RBL", ["Continue with verified conditions", "Pause pending bounded evidence", "Repair capability or safeguard", "Resequence a predecessor or dependent member", "Resize, modularize, or phase the commitment", "Substitute design, instrument, vendor, or delivery model", "Split or merge governed membership", "Shift funding while preserving named duties", "Activate public option, shared capacity, or fallback", "Retire, close, restore, and preserve records"], "rebalancing_action_id");
const realizationTests = makeTaxonomy("80-RLT", ["Essential service and universal-access realization", "Safety, accessibility, rights, and due-process realization", "State-of-good-repair and lifecycle affordability", "Public capability and institutional learning", "Workforce, supplier, and job-quality realization", "Place-based benefit, burden, leakage, and remedy", "Indigenous rights, treaty, partnership, and continuity", "Land, water, energy, climate, ecology, and restoration", "Resilience, redundancy, substitution, and public option", "Fiscal value, liability, reserve, and residual exposure", "Distribution across current and future publics", "Mission contribution, alternatives, uncertainty, and public reason"], "realization_test_id");

const theses = upstream.map((source, index) => {
  const n = String(index + 1).padStart(3, "0");
  return {
    public_investment_mission_thesis_dossier_id: `80-IMT-${n}`, slug: `80-imt-${n}-${shortName(source)}`, record_kind: "public_investment_mission_thesis_dossier", record_status: "Published", thesis_state: "Inactive - No Verified Phase 79 Stewardship Record", admission_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, intergenerational_balance_sheet_stewardship_ledger_id: source.intergenerational_balance_sheet_stewardship_ledger_id,
    investment_thesis_checks: inactiveChecks(investmentThesisGates, "No Phase 79 record contains a verified asset-and-obligation register, authorized lifecycle plan, admitted procurement-risk record, funded maintenance and closure duties, completed distribution and future-user balance sheet, stress test, independent audit, and receipts."),
    mission_class_records: missionClasses.map((item) => ({ ...item, mission_state: "Unassigned", evidence_ids: [], authority_ids: [], decision_id: null })),
    instrument_class_records: instrumentClasses.map((item) => ({ ...item, instrument_state: "Unassessed", funding_ids: [], financing_ids: [], exposure_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    verified_phase79_stewardship_record_ids: [], mission_record: null, public_need_record: null, no_action_baseline_record: null, investment_thesis_record: null, additionality_record: null, alternative_records: [], existing_asset_capability_records: [], distribution_records: [], resource_boundary_records: [], delivery_capacity_records: [], funding_records: [], financing_records: [], option_value_records: [], first_reviewer_id: null, second_reviewer_id: null, thesis_receipt_id: null, propagation_status: "not_started",
    announcement_as_investment_thesis_allowed: false, financing_as_funding_allowed: false, urgency_as_priority_allowed: false, automatic_mission_selection_allowed: false, automatic_project_selection_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const portfolios = theses.map((thesis, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    portfolio_membership_dependency_sequence_register_id: `80-PDS-${n}`, slug: `80-pds-${n}-${shortName(source)}`, record_kind: "portfolio_membership_dependency_sequence_register", record_status: "Published", portfolio_state: "Inactive - No Admitted Investment Thesis", membership_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, public_investment_mission_thesis_dossier_id: thesis.public_investment_mission_thesis_dossier_id, intergenerational_balance_sheet_stewardship_ledger_id: thesis.intergenerational_balance_sheet_stewardship_ledger_id,
    portfolio_sequence_checks: inactiveChecks(portfolioSequenceGates, "No admitted Phase 80 mission or investment thesis exists."),
    dependency_class_records: dependencyClasses.map((item) => ({ ...item, dependency_state: "Unmapped", predecessor_ids: [], successor_ids: [], evidence_ids: [] })),
    sequence_stage_records: sequenceStages.map((item) => ({ ...item, stage_state: "Unscheduled", member_ids: [], entry_receipt_ids: [], exit_receipt_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    portfolio_charter_record: null, candidate_member_records: [], admitted_member_records: [], excluded_member_records: [], nonproject_member_records: [], dependency_records: [], critical_path_records: [], sequencing_records: [], stage_gate_records: [], option_records: [], funding_mix_records: [], financing_mix_records: [], affordability_records: [], concurrent_capacity_records: [], resource_allocation_records: [], distribution_records: [], transition_obligation_records: [], interface_records: [], conflict_and_recusal_records: [], first_reviewer_id: null, second_reviewer_id: null, portfolio_receipt_id: null, propagation_status: "not_started",
    project_list_as_portfolio_allowed: false, earliest_ready_as_priority_allowed: false, capital_only_membership_allowed: false, automatic_membership_allowed: false, automatic_sequence_allowed: false, automatic_funding_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const capacityLedgers = portfolios.map((portfolio, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    place_based_delivery_capacity_transition_ledger_id: `80-PDC-${n}`, slug: `80-pdc-${n}-${shortName(source)}`, record_kind: "place_based_delivery_capacity_transition_ledger", record_status: "Published", delivery_state: "Inactive - No Authorized Portfolio Sequence", readiness_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, portfolio_membership_dependency_sequence_register_id: portfolio.portfolio_membership_dependency_sequence_register_id, public_investment_mission_thesis_dossier_id: portfolio.public_investment_mission_thesis_dossier_id,
    delivery_transition_checks: inactiveChecks(deliveryTransitionGates, "No authorized Phase 80 portfolio membership, dependency, capital sequence, funding, financing, or stage-gate record exists."),
    delivery_capacity_dimension_records: capacityDimensions.map((item) => ({ ...item, capacity_state: "Untested", baseline_ids: [], gap_ids: [], owner_ids: [] })),
    workforce_supplier_readiness_records: readinessDimensions.map((item) => ({ ...item, readiness_state: "Unverified", workforce_ids: [], supplier_ids: [], evidence_ids: [] })),
    place_based_obligation_records: placeObligations.map((item) => ({ ...item, obligation_state: "Unassigned", place_ids: [], owner_ids: [], remedy_ids: [] })),
    just_transition_safeguard_records: transitionSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified", affected_public_ids: [], funding_ids: [], receipt_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    accountable_owner_records: [], institutional_baseline_records: [], program_management_records: [], procurement_capacity_records: [], workforce_records: [], supplier_records: [], public_option_capacity_records: [], land_and_corridor_records: [], water_records: [], energy_and_grid_records: [], material_and_logistics_records: [], housing_and_service_records: [], place_distribution_records: [], transition_plan_records: [], community_agreement_records: [], operating_readiness_records: [], capacity_trigger_records: [], first_reviewer_id: null, second_reviewer_id: null, capacity_receipt_id: null, propagation_status: "not_started",
    local_spend_as_just_transition_allowed: false, procurement_as_delivery_capacity_allowed: false, jobs_announcement_as_workforce_readiness_allowed: false, automatic_readiness_finding_allowed: false, automatic_resource_allocation_allowed: false, automatic_priority_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const realizationLedgers = capacityLedgers.map((capacity, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    portfolio_stress_rebalancing_realization_ledger_id: `80-PRR-${n}`, slug: `80-prr-${n}-${shortName(source)}`, record_kind: "portfolio_stress_rebalancing_realization_ledger", record_status: "Published", realization_state: "Inactive - No Verified Delivery Baseline", rebalancing_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, place_based_delivery_capacity_transition_ledger_id: capacity.place_based_delivery_capacity_transition_ledger_id, portfolio_membership_dependency_sequence_register_id: capacity.portfolio_membership_dependency_sequence_register_id, public_investment_mission_thesis_dossier_id: capacity.public_investment_mission_thesis_dossier_id,
    realization_checks: inactiveChecks(realizationGates, "No verified Phase 80 delivery-capacity, workforce, supplier, resource, place-based, just-transition, or operating-readiness baseline exists."),
    portfolio_stress_trigger_records: stressTriggers.map((item) => ({ ...item, trigger_state: "Dormant", event_ids: [], review_id: null, decision_id: null })),
    rebalancing_action_records: rebalancingActions.map((item) => ({ ...item, action_state: "Not Considered", member_ids: [], condition_ids: [], decision_id: null })),
    public_value_realization_test_records: realizationTests.map((item) => ({ ...item, test_state: "Not Tested", output_ids: [], outcome_ids: [], finding_id: null })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    frozen_thesis_record: null, scenario_records: [], concentration_records: [], stress_test_records: [], observed_trigger_records: [], option_records: [], off_ramp_records: [], rebalancing_records: [], finance_consequence_records: [], capacity_consequence_records: [], place_transition_consequence_records: [], public_option_records: [], verified_output_records: [], observed_outcome_records: [], public_value_findings: [], corrective_action_records: [], portfolio_learning_records: [], first_reviewer_id: null, second_reviewer_id: null, realization_receipt_id: null, propagation_status: "not_started",
    rebalancing_as_failure_erasure_allowed: false, delivered_output_as_realized_value_allowed: false, sunk_cost_as_continuation_authority_allowed: false, automatic_rebalancing_allowed: false, automatic_outcome_finding_allowed: false, automatic_priority_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0", phase: "80", registry_id: "public-investment-portfolios-transition-pathways-place-based-capacity-registry-001", title: "Public Investment Portfolios, Transition Pathways And Place-Based Capacity Registry", captured_date: "2026-08-24", as_of_date: "2026-08-24",
  scope: "Eight inactive public-investment mission-thesis dossiers, eight inactive portfolio membership-dependency-sequence registers, eight inactive place-based delivery-capacity and just-transition ledgers, and eight inactive portfolio stress-rebalancing-realization ledgers downstream of Phase 79.",
  interpretation_boundary: "A project list is not an investment portfolio. Funding is not financing capacity. Earliest-ready is not highest public priority. Procurement capacity is not delivery capacity. Local spending is not a just transition. Delivered output is not realized public value, and rebalancing cannot erase failure.",
  activation_rule: "At least one Phase 79 chain must contain a verified asset-and-obligation register, authorized lifecycle plan, admitted procurement and contingent-risk record, funded maintenance and closure duties, completed distributional and future-user balance sheet, completed stress test, independent intergenerational audit, and receipts. Every later thesis, membership, sequence, funding, financing, readiness, resource, transition, rebalancing, and realization finding requires a separate human decision and receipt.",
  investment_thesis_gates: investmentThesisGates, portfolio_sequence_gates: portfolioSequenceGates, delivery_transition_gates: deliveryTransitionGates, realization_gates: realizationGates,
  mission_classes: missionClasses, investment_instrument_classes: instrumentClasses, portfolio_dependency_classes: dependencyClasses, sequence_stages: sequenceStages, delivery_capacity_dimensions: capacityDimensions, workforce_supplier_readiness_dimensions: readinessDimensions, place_based_obligations: placeObligations, just_transition_safeguards: transitionSafeguards, portfolio_stress_triggers: stressTriggers, rebalancing_actions: rebalancingActions, public_value_realization_tests: realizationTests,
  thesis_states: ["Inactive - No Verified Phase 79 Stewardship Record", "Scoping", "Under Review", "Held", "Admitted With Conditions", "Denied", "Corrected", "Withdrawn"],
  portfolio_states: ["Inactive - No Admitted Investment Thesis", "Candidate Review", "Dependency Review", "Sequence Review", "Held", "Authorized With Conditions", "Rebalanced", "Corrected", "Closed"],
  delivery_states: ["Inactive - No Authorized Portfolio Sequence", "Baseline Review", "Capacity Review", "Transition Review", "Held", "Ready With Conditions", "Operating", "Correcting", "Closed"],
  realization_states: ["Inactive - No Verified Delivery Baseline", "Scenario Review", "Stress Review", "Option Review", "Held", "Rebalanced With Conditions", "Realization Review", "Correcting", "Restoring", "Archived"],
  metrics: {
    public_investment_mission_thesis_dossiers: theses.length, portfolio_membership_dependency_sequence_registers: portfolios.length, place_based_delivery_capacity_transition_ledgers: capacityLedgers.length, portfolio_stress_rebalancing_realization_ledgers: realizationLedgers.length,
    investment_thesis_gates: investmentThesisGates.length, portfolio_sequence_gates: portfolioSequenceGates.length, delivery_transition_gates: deliveryTransitionGates.length, realization_gates: realizationGates.length,
    mission_classes: missionClasses.length, investment_instrument_classes: instrumentClasses.length, portfolio_dependency_classes: dependencyClasses.length, sequence_stages: sequenceStages.length, delivery_capacity_dimensions: capacityDimensions.length, workforce_supplier_readiness_dimensions: readinessDimensions.length, place_based_obligations: placeObligations.length, just_transition_safeguards: transitionSafeguards.length, portfolio_stress_triggers: stressTriggers.length, rebalancing_actions: rebalancingActions.length, public_value_realization_tests: realizationTests.length,
    verified_phase79_stewardship_records_received: 0, investment_theses_admitted: 0, missions_assigned: 0, portfolio_members_admitted: 0, portfolio_sequences_authorized: 0, funding_or_financing_mixes_authorized: 0, delivery_capacity_findings_issued: 0, workforce_or_supplier_readiness_findings: 0, resource_allocations_authorized: 0, place_based_obligations_assigned: 0, just_transition_safeguards_verified: 0, stress_tests_completed: 0, rebalancing_decisions_issued: 0, off_ramps_activated: 0, outputs_verified: 0, public_value_realization_findings: 0, independent_reviews_completed: 0, receipts_created: 0, scores_created: 0, rankings_created: 0, phase64_cells_advanced: 0
  },
  public_investment_mission_thesis_dossiers: theses, portfolio_membership_dependency_sequence_registers: portfolios, place_based_delivery_capacity_transition_ledgers: capacityLedgers, portfolio_stress_rebalancing_realization_ledgers: realizationLedgers
};
await writeJson(join(dataRoot, "phase-80-public-investment-portfolios-transition-pathways-place-based-capacity-registry.json"), registry);

const guideDefinitions = [
  ["briefing-public-investment-doctrine-001", "public-investment-doctrine-001", "Public Investment Doctrine 001: Build Public Capability, Not Just Assets", "A doctrine for mission, public purpose, additionality, options, authority, lifecycle duty, distribution, and durable capability."],
  ["briefing-mission-thesis-public-purpose-001", "mission-thesis-public-purpose-001", "Mission Thesis And Public Purpose 001: Name The Change Before The Project", "A method for connecting verified public need, baselines, interventions, capabilities, outcomes, value, uncertainty, and failure conditions."],
  ["briefing-portfolio-construction-without-ranking-001", "portfolio-construction-without-ranking-001", "Portfolio Construction Without Ranking 001: Composition Is A Public Decision", "A portfolio method for projects, maintenance, institutions, standards, workforce, public options, dependencies, diversity, and bounded choice without composite scoring."],
  ["briefing-dependency-capital-sequencing-001", "dependency-capital-sequencing-001", "Dependency And Capital Sequencing 001: Fund Preconditions Before Headlines", "A sequencing method for critical paths, institutional prerequisites, resource constraints, interfaces, stage gates, learning, acceptance, and service entry."],
  ["briefing-public-funding-versus-financing-001", "public-funding-versus-financing-001", "Public Funding Versus Financing 001: Repayment Is Not A Revenue Source", "A clear separation of appropriations, grants, taxes, rates, transfers, debt, guarantees, concessions, risk, affordability, and residual public exposure."],
  ["briefing-delivery-institutions-owner-capacity-001", "delivery-institutions-owner-capacity-001", "Delivery Institutions And Owner Capacity 001: Sponsors Must Be Able To Govern", "A capability model for mission ownership, program management, systems integration, procurement, operations, regulation, records, and independent assurance."],
  ["briefing-workforce-supplier-readiness-001", "workforce-supplier-readiness-001", "Workforce And Supplier Readiness 001: Announcements Are Not Capacity", "A readiness method for occupations, training, credentials, job quality, supplier tiers, lead times, quality, finance, logistics, maintenance, and succession."],
  ["briefing-land-water-energy-infrastructure-constraints-001", "land-water-energy-infrastructure-constraints-001", "Land, Water, Energy And Infrastructure Constraints 001: Capacity Has A Place", "A cumulative constraint framework for land, corridors, water, grid, energy, materials, transport, housing, services, ecology, rights, and restoration."],
  ["briefing-place-based-value-just-transition-001", "place-based-value-just-transition-001", "Place-Based Value And Just Transition 001: Local Spend Is Not Shared Power", "A place-based method for access, ownership, revenue, capability, worker security, Indigenous rights, displacement, public services, remedy, and enforceable transition duties."],
  ["briefing-option-preservation-stage-gates-offramps-001", "option-preservation-stage-gates-offramps-001", "Option Preservation, Stage Gates And Off-Ramps 001: Keep The Ability To Change Course", "A governance method for modularity, interoperability, evidence gates, pause, repair, substitution, orderly exit, continuity, restoration, and retained public options."],
  ["briefing-portfolio-stress-rebalancing-concentration-001", "portfolio-stress-rebalancing-concentration-001", "Portfolio Stress, Rebalancing And Concentration 001: Reassessment Is Not Failure Erasure", "A stress method for correlated risk, concentration, thresholds, protected floors, bounded options, distribution, independent review, and transparent rebalancing."],
  ["briefing-public-value-realization-transition-accountability-001", "public-value-realization-transition-accountability-001", "Public-Value Realization And Transition Accountability 001: Delivery Is Not The Outcome", "A realization method for accepted outputs, observed outcomes, contribution limits, public capability, distribution, transition promises, harm, correction, and receipts."]
];
const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const yamlList = (values) => values.map((value) => `  - "${value}"`).join("\n");
const sharedBody = `
## Start with a public mission, not a shopping list

Public investment begins with a verified need, a lawful public purpose, named beneficiaries and burden bearers, a service floor, a time horizon, and a bounded theory of change. It asks what happens under no action, repair, reuse, demand management, regulation, shared service, public provision, partnership, purchase, retirement, and restoration. A project announcement is not a mission thesis, and urgency does not create priority.

The thesis connects inputs to institutional and physical capability, delivery outputs, service changes, observed outcomes, public value, distribution, uncertainty, and failure conditions. Additionality is explicit: the record states what public action changes, what private action might have occurred anyway, what could be displaced or crowded out, and which public options are preserved. Each claim cites a real dated artifact and keeps inference separate from authority.

## Construct a portfolio without hiding judgment in a score

A public portfolio may include maintenance, standards, data, workforce institutions, regulatory capacity, technical assistance, public options, restoration, and decommissioning as well as capital projects. Membership is a separate decision for each candidate. The record names its function, location, maturity, owner, lifecycle duty, dependencies, contribution to the mission, opportunity cost, distribution, uncertainty, and reason for admission or exclusion.

Composite scores and automatic rankings are prohibited. They can conceal incomparable values, distributional choices, rights, uncertainty, missing evidence, correlated risk, and political judgment. A decision may use multiple bounded tests, but it must publish the tradeoffs, dissent, conditions, and decision owner. Earliest-ready is not highest public priority; the apparently ready project may depend on unfunded maintenance, a missing institution, constrained water or power, an unavailable workforce, or an unresolved rights obligation.

Dependencies are typed and directional. A predecessor can be legal, fiscal, technical, institutional, spatial, environmental, workforce, supplier, digital, service, or democratic. The critical path distinguishes a hard prerequisite from a useful complement and a correlated vulnerability. Common-mode failure, shared vendors, common resources, cross-jurisdiction interfaces, successor capacity, and long lead times remain visible across the entire portfolio.

## Sequence institutions, capability, and capital together

Capital sequencing is not a construction schedule. It aligns mission authorization, alternatives, stewardship baselines, portfolio membership, owner capability, design, standards, funding, financing, land, rights, permits, procurement, workforce, suppliers, enabling infrastructure, commissioning, acceptance, service entry, evaluation, renewal, and closure. Each stage gate names required evidence, an accountable owner, protected duties, a decision date, conditions, an expiry, and a receipt.

Sequence can deliberately fund prerequisites before headline assets: maintenance backlogs, utility connections, training capacity, procurement teams, public data infrastructure, housing, transit, care, environmental restoration, community agreements, or shared technical services. Concurrent delivery load is tested across agencies and places. A plan that is feasible one project at a time can fail when several projects compete for the same engineers, permits, suppliers, grid capacity, water, housing, or fiscal room.

Funding and financing stay separate. Funding is the durable source used to pay capital, operation, maintenance, renewal, transition, closure, restoration, and residual duties. Financing changes timing and risk; it creates repayment, return, security, covenant, guarantee, concession, or contingent exposure. Leverage is not free capacity. Every instrument identifies its authority, payer, beneficiary, cost, subsidy, risk holder, liquidity need, time horizon, failure trigger, distribution, public control, and exit.

## Test whether the public owner can actually deliver

Delivery capacity is an evidence question. The baseline covers accountable sponsorship, program management, engineering, systems integration, commercial and procurement practice, fiscal control, legal and regulatory capability, treaty and rights obligations, data and cybersecurity, records, operations, maintenance, accessibility, safety, workforce planning, supplier development, environmental stewardship, community partnership, independent assurance, emergency fallback, and institutional memory.

Procurement capacity is only one part of delivery capacity. A contract can purchase work without giving the public owner enough knowledge to specify, integrate, inspect, accept, operate, maintain, adapt, audit, or exit. Public-option capacity preserves technical knowledge, open standards, data access, repair, switching, fallback, and the ability to provide or coordinate the service directly when markets fail.

Workforce readiness names occupations, skills, credentials, licenses, clearances, training throughput, recruitment, retention, succession, mobility, wages, benefits, bargaining, safety, accessibility, and job quality. Supplier readiness names ownership, tier, geography, finance, equipment, lead time, standards, quality, traceability, logistics, critical inputs, repair, spares, and failure response. A jobs announcement, vendor list, memorandum, or training pledge is not verified readiness.

## Put land, water, energy, infrastructure, and communities inside the portfolio

Capacity has a place. The portfolio records land, rights-of-way, tenure, permits, treaty and cultural conditions, water source and discharge, grid connection, peak load, energy source, emissions, critical materials, logistics, housing, transport, care, education, health, public realm, ecological thresholds, cumulative effects, restoration, and neighboring-system constraints. Allocation cannot be automated from project demand alone.

Place-based value distinguishes local expenditure from durable local capability and shared power. It follows service access, ownership, procurement, employment, revenue, knowledge, infrastructure, environmental effects, displacement, affordability, leakage, and remedy. It accounts for rural, remote, northern, underserved, host, upstream, downstream, Indigenous, worker, payer, and future publics rather than using a regional aggregate as proof of fair benefit.

A just transition is an enforceable set of obligations, not a positive narrative. It addresses early standing, collective voice, income and benefit continuity, pensions, paid training, credential portability, placement, mobility, care support, job quality, supplier development, community revenue, public services, environmental health, remediation, time bounds, funding, accountable owners, appeal, correction, and completion receipts. Local spending alone does not prove a just transition.

## Preserve options and govern off-ramps

Modularity, interoperability, open standards, staged commitments, data portability, shared infrastructure, repair, reuse, and public capability preserve the ability to learn and change course. Each gate defines the evidence required to continue, pause, repair, resize, resequence, substitute, split, merge, transfer, or close. Sunk cost cannot become authority to continue.

An off-ramp names service continuity, safety, rights, workforce, supplier, community, debt, guarantee, data, records, maintenance, decommissioning, land handback, environmental restoration, residual monitoring, and successor duties. Exit is a governed transition rather than silent abandonment. Reversible design reduces some costs but does not erase affected-public standing or existing obligations.

## Stress and rebalance without rewriting history

Portfolio stress tests combine demand, cost, schedule, revenue, rates, interest, liquidity, covenants, resources, climate, technology, vendors, workforce, rights, legitimacy, and common-mode scenarios. They identify concentration across places, sectors, technologies, suppliers, instruments, agencies, and dependencies. Protected service, rights, maintenance, transition, and restoration floors remain explicit under every scenario.

A threshold breach opens review; it does not choose the response. Rebalancing compares bounded options and publishes authority, evidence, distribution, opportunity cost, conditions, dissent, time bounds, and receipts. It cannot erase the original thesis, failed milestones, harms, sunk costs, excluded alternatives, or previous decisions. Reassessment is accountable learning, not retrospective success construction.

## Verify realization, transition, and public value

Delivery is not the outcome. Accepted output records establish what was built, acquired, staffed, repaired, commissioned, or placed in service and under which quality, safety, accessibility, performance, and maintenance conditions. Outcome records require observed change, a baseline, time period, affected population, alternative explanations, contribution limits, distribution, uncertainty, and independent review.

Public-value realization examines essential service, access, safety, rights, state of good repair, affordability, resilience, institutional capability, workforce and supplier development, place-based distribution, Indigenous partnership, ecology, restoration, fiscal exposure, future users, option value, and democratic control. A positive economic-impact estimate, expenditure total, construction completion, utilization rate, or portfolio average cannot substitute for these separate findings.

Transition accountability follows every promise from authorization through funding, implementation, verification, remedy, correction, and closure. Failures, delays, harms, withdrawals, and negative results stay in the record. Learning can inform a later human decision, but it cannot automatically transfer a project, priority, instrument, sequence, funding allocation, or outcome claim to another place.

## Public contract

The Phase 80 contract keeps mission, thesis, membership, dependency, sequence, funding, financing, affordability, delivery capacity, workforce, suppliers, resources, place, transition, stage gates, off-ramps, stress, rebalancing, outputs, outcomes, public value, correction, review, and receipts independent. It creates no score or ranking and cannot mutate Phase 64 or any operating record.

The current registry is deliberately empty. There is no verified Phase 79 stewardship chain, admitted investment thesis, assigned mission, portfolio member, dependency decision, sequence, funding or financing mix, capacity finding, workforce or supplier readiness finding, resource allocation, place-based obligation, just-transition safeguard, stress test, off-ramp, rebalancing decision, verified output, realized-value finding, independent review, receipt, score, rank, Phase 64 cell advance, or operating-outcome change. A future record opens only from real dated evidence and separately authorized human decisions.
`;
for (const [id, slug, title, summary] of guideDefinitions) {
  const body = `---\nid: "${id}"\ntitle: "${title}"\nslug: "${slug}"\nrecord_status: "Published"\nsummary: "${summary}"\npublished_date: 2026-08-24\ncaptured_date: 2026-08-24\nsignal_ids:\n${yamlList(signalIds)}\nevidence_gap_ids:\n${yamlList(evidenceGapIds)}\nclaim_scope: "Editorial Synthesis"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: 2026-08-24\ntop_takeaways:\n  - "Public investment requires mission, alternatives, authority, lifecycle duty, distribution, capacity, and option preservation before membership or funding."\n  - "Portfolio composition, sequencing, funding, financing, readiness, resource allocation, rebalancing, and realization remain separate human decisions."\n  - "No project, place, instrument, or outcome is scored, ranked, selected, funded, or advanced by this guide."\nconstraint_watch:\n  - "Public Trust"\n  - "Infrastructure"\n  - "Capital"\n  - "Labor"\n  - "Interpretation"\nwhat_to_watch_next:\n  - "A verified Phase 79 stewardship chain with authorized lifecycle, procurement-risk, distribution, stress, audit, and receipt records"\n  - "Separately authorized mission, membership, dependency, funding, financing, capacity, place, and transition decisions"\n  - "Independent stress, off-ramp, rebalancing, realization, correction, and propagation receipts"\n---\n\n${summary}\n\n${sharedBody}`;
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), body, "utf8");
}

const mapDefinitions = [
  ["dependency-map-project-list-is-not-investment-portfolio", "project-list-is-not-investment-portfolio", "A Project List Is Not An Investment Portfolio", "A path from mission, alternatives, assets, lifecycle duties, membership, dependencies, capacity, distribution, and review to a governed portfolio."],
  ["dependency-map-funding-is-not-financing-capacity", "funding-is-not-financing-capacity", "Funding Is Not Financing Capacity", "A path separating durable payment sources from timing instruments, repayment, leverage, guarantees, liquidity, risk, and residual public exposure."],
  ["dependency-map-earliest-ready-is-not-highest-public-priority", "earliest-ready-is-not-highest-public-priority", "Earliest-Ready Is Not Highest Public Priority", "A path through need, public purpose, dependencies, opportunity cost, distribution, resource limits, option value, and human authorization."],
  ["dependency-map-procurement-capacity-is-not-delivery-capacity", "procurement-capacity-is-not-delivery-capacity", "Procurement Capacity Is Not Delivery Capacity", "A path from specification and contracting through integration, acceptance, operations, maintenance, public knowledge, fallback, and stewardship."],
  ["dependency-map-local-expenditure-is-not-just-transition", "local-expenditure-is-not-just-transition", "Local Expenditure Is Not A Just Transition", "A path through worker standing, income, benefits, training, placement, ownership, public services, environmental remedy, enforcement, and receipts."],
  ["dependency-map-delivered-output-is-not-realized-public-value", "delivered-output-is-not-realized-public-value", "Delivered Output Is Not Realized Public Value", "A path from accepted delivery through service, outcomes, contribution limits, distribution, capability, transition, harms, correction, and independent review."]
];
for (const [id, slug, title, summary] of mapDefinitions) {
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id, title, slug, summary, map_type: "Dependency Stack", record_status: "Published", primary_topic: "Human Futures", framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"], constraint_tags: ["Public Trust", "Infrastructure", "Regulation", "Labor", "Interpretation"],
    map_question: `What records are required before ${title.toLowerCase()} can support a bounded public-investment decision?`, interpretation_boundary: "This map is a control path. It does not establish a mission, portfolio member, priority, sequence, funding, financing, capacity, transition, rebalancing, public-value result, score, rank, or receipt.",
    source_ids: [...new Set(upstream.flatMap((record) => record.source_ids))].slice(0, 8), signal_ids: signalIds, technology_ids: [], local_system_ids: [...new Set(upstream.flatMap((record) => record.local_system_ids))], evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-stewardship", label: "Verified Phase 79 stewardship chain", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 79 record exists." },
      { id: "node-thesis", label: "Mission, public need, alternatives, authority, and investment thesis", node_type: "Constraint", note: "A project announcement is not a public thesis." },
      { id: "node-portfolio", label: "Membership, dependencies, sequence, funding, financing, and stage gates", node_type: "Constraint", note: "Composition requires explicit judgment." },
      { id: "node-capacity", label: "Owner, workforce, suppliers, public options, and delivery capacity", node_type: "Constraint", note: "Contracting is not institutional capability." },
      { id: "node-place", label: "Land, water, energy, infrastructure, place, rights, and just transition", node_type: "Constraint", note: "Capacity and distribution are place-specific." },
      { id: "node-realize", label: "Stress, off-ramps, rebalancing, accepted outputs, and realized value", node_type: "Constraint", note: "Delivery and outcome remain separate." },
      { id: "node-receipt", label: "Independent review, dissent, correction, archive, and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 80 receipt exists." }
    ],
    links: [
      { from: "node-stewardship", to: "node-thesis", relationship: "Depends On", confidence: "Missing Evidence", note: "Investment must begin from verified public assets and duties." },
      { from: "node-thesis", to: "node-portfolio", relationship: "Depends On", confidence: "Missing Evidence", note: "Membership and sequence follow an admitted thesis." },
      { from: "node-portfolio", to: "node-capacity", relationship: "Depends On", confidence: "Missing Evidence", note: "Delivery tests follow a bounded portfolio." },
      { from: "node-capacity", to: "node-place", relationship: "Depends On", confidence: "Missing Evidence", note: "Readiness includes local systems and affected publics." },
      { from: "node-place", to: "node-realize", relationship: "Depends On", confidence: "Missing Evidence", note: "Stress and realization need verified baselines." },
      { from: "node-realize", to: "node-receipt", relationship: "Depends On", confidence: "Missing Evidence", note: "Every decision needs review and a receipt." }
    ],
    what_this_map_supports: ["Separate mission, membership, sequence, funding, financing, capacity, transition, rebalancing, and realization decisions.", "Explicit dependencies, protected duties, affected publics, options, off-ramps, and review.", "Public reasoning without composite project scoring or ranking."],
    what_this_map_does_not_prove: ["It does not select, prioritize, fund, finance, sequence, rebalance, or validate a project or place.", "It does not convert announcements, expenditure, procurement, delivery, or aggregate impact into public value.", "It does not create a receipt, score, rank, stage advance, or operating-outcome change."],
    next_records_needed: ["A verified Phase 79 stewardship chain with receipts.", "Separately authorized thesis, membership, dependency, funding, capacity, resource, transition, stress, and realization records.", "Independent review, dissent, correction, archive, and propagation receipts."]
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
  const records = [theses[index], portfolios[index], capacityLedgers[index], realizationLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 80 public-investment portfolio and transition boundary")) {
    const links = records.map((record) => { const value = Object.values(record).find((item) => typeof item === "string" && /^80-(IMT|PDS|PDC|PRR)-/.test(item)); return `[${value}](/evidence/investment-portfolios/${record.slug}/)`; });
    body = body.trimEnd() + `\n\n## Phase 80 public-investment portfolio and transition boundary\n\nThe [Public Investment Portfolios Registry](/evidence/investment-portfolios/) assigns ${links.join(", ")} to this named file. No mission, thesis, portfolio member, priority, dependency decision, sequence, funding, financing, capacity finding, resource allocation, just-transition safeguard, stress test, rebalancing, realization finding, receipt, score, rank, or Phase 64 cell change exists.\n`;
    await writeFile(path, body, "utf8");
  }
}

const localFileById = {
  "local-us-southwest-chip-corridor": "local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate": "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor": "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor": "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor": "local-nevada-lithium-processing-corridor.mdx"
};
for (const [localId, filename] of Object.entries(localFileById)) {
  const localRecords = theses.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 80 public-investment, capacity, and transition boundary")) {
    body = body.trimEnd() + `\n\n## Phase 80 public-investment, capacity, and transition boundary\n\nThe [Public Investment Portfolios Registry](/evidence/investment-portfolios/) connects ${localRecords.map((record) => record.named_entity).join(" and ")} to mission, portfolio, sequence, funding, financing, delivery-capacity, workforce, supplier, resource, place-based, just-transition, stress, off-ramp, rebalancing, and public-value controls. A local project list, capital announcement, procurement, jobs claim, or expenditure total does not establish portfolio priority, affordable funding, delivery readiness, just transition, or realized public value.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-implementation-commitment-ledger-001.mdx", "briefing-realized-impact-audit-001.mdx", "briefing-institutional-memory-negative-results-001.mdx", "briefing-policy-retirement-decommissioning-001.mdx", "briefing-fiscal-capacity-contribution-sharing-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx"]) {
  const path = join(contentRoot, "briefings", briefingName); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 80 portfolio, capacity, transition, and realization control")) {
    body = body.trimEnd() + "\n\n## Phase 80 portfolio, capacity, transition, and realization control\n\nThe [Public Investment Portfolios Registry](/evidence/investment-portfolios/) adds eight inactive investment-thesis dossiers, eight inactive portfolio-sequence registers, eight inactive delivery-capacity and just-transition ledgers, and eight inactive stress-rebalancing-realization ledgers. It creates zero missions, portfolio members, priorities, funding or financing mixes, capacity findings, resource allocations, transition safeguards, rebalancing decisions, realization findings, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

await writeJson(join(contentRoot, "updates", "2026-08-24-phase-80-public-investment-portfolios-transition-capacity.json"), {
  id: "update-2026-08-24-phase-80-public-investment-portfolios-transition-capacity", effective_date: "2026-08-24", entry_type: "Source Refresh", title: "Phase 80 adds public-investment portfolio, place-based capacity, and transition controls",
  summary: "Eight inactive investment-thesis dossiers, eight inactive portfolio membership and sequence registers, eight inactive place-based delivery-capacity and just-transition ledgers, and eight inactive portfolio stress, rebalancing, and realization ledgers now expose how public investment would be governed. Twelve guides and six maps deepen the content layer without selecting, prioritizing, funding, financing, or ranking a project.",
  affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"], related_paths: ["/evidence/investment-portfolios/", ...guideDefinitions.map(([, slug]) => `/briefings/${slug}/`), "/data/public-investment-portfolios-transition-capacity.json"],
  evidence_note: "This release contains empty mission, thesis, membership, dependency, sequence, funding, financing, capacity, workforce, supplier, resource, transition, stress, rebalancing, and realization contracts plus synthetic-only validation. It does not contain a verified Phase 79 stewardship record, portfolio decision, receipt, score, or ranking.", materiality: "No record-state change", publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, investment, fiscal, project, transition, and operating states unchanged.", next_check_date: "2026-09-01", work_package: "docs/work-packages/phase-80-public-investment-portfolios-transition-pathways-place-based-capacity.md"
});

console.log(`Phase 80 content built: ${theses.length} inactive theses, ${portfolios.length} inactive portfolio registers, ${capacityLedgers.length} inactive capacity ledgers, ${realizationLedgers.length} inactive realization ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 investment or transition outcomes.`);
