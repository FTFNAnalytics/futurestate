import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase78 = await readJson(join(dataRoot, "phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json"));
const upstream = phase78.emergency_authority_normalization_ledgers;
const shortName = (record) => record.slug.replace(/^78-enl-\d+-/, "");
const inactiveChecks = (gates, basis) => gates.map((gate) => ({ ...gate, decision_state: "Inactive", basis }));

const assetObligationGates = [
  ["79-AOR-01-COMPACT", "Executed Phase 78 compact with authorized value, burden, contribution, continuity, exit, restoration, and receipts"],
  ["79-AOR-02-AUTHORITY", "Capital, operating, fiscal, ownership, custodial, and stewardship authority"],
  ["79-AOR-03-IDENTITY", "Asset, system, right, capability, inventory, data, land, and service identity"],
  ["79-AOR-04-BOUNDARY", "Physical, legal, functional, geographic, population, and time boundary"],
  ["79-AOR-05-OWNERSHIP", "Legal title, beneficial ownership, public interest, custody, and retained rights"],
  ["79-AOR-06-CONTROL", "Use, access, pricing, transfer, security, modification, and disposition rights"],
  ["79-AOR-07-CONDITION", "Condition, capacity, capability, utilization, reliability, and state of good repair"],
  ["79-AOR-08-VALUE", "Service, option, resilience, distributional, natural, cultural, and non-market value"],
  ["79-AOR-09-RESTRICTION", "Treaty, rights, environmental, accessibility, labor, privacy, and safety restrictions"],
  ["79-AOR-10-ENCUMBRANCE", "Lien, lease, concession, license, easement, exclusivity, covenant, and lock-in"],
  ["79-AOR-11-OBLIGATION", "Operating, maintenance, renewal, restoration, decommissioning, and residual duty"],
  ["79-AOR-12-COUNTERPARTY", "Vendor, lender, guarantor, insurer, operator, beneficiary, and affected-public identity"],
  ["79-AOR-13-MEASURE", "Measurement, recognition, valuation, uncertainty, scenario, and missingness method"],
  ["79-AOR-14-DISTRIBUTION", "Current benefit, burden, access, exclusion, subsidy, and liability distribution"],
  ["79-AOR-15-FUTURE", "Future-user option value, lock-in, irreversibility, residual risk, and inherited duty"],
  ["79-AOR-16-REVIEW", "Independent technical, fiscal, rights, distributional, and stewardship review"],
  ["79-AOR-17-DECISION", "Separate admission decision for every asset, obligation, value, and restriction"],
  ["79-AOR-18-RECEIPT", "Decision, dissent, correction, archive, public notice, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const lifecycleMaintenanceGates = [
  ["79-LCM-01-REGISTER", "Admitted public asset and obligation register"],
  ["79-LCM-02-NEED", "Public need, service floor, beneficiaries, demand range, and no-build baseline"],
  ["79-LCM-03-OPTIONS", "Repair, reuse, demand management, shared service, public option, procurement, and retirement alternatives"],
  ["79-LCM-04-DESIGN", "Design life, standards, modularity, interoperability, adaptability, and resilience"],
  ["79-LCM-05-ACQUIRE", "Land, rights, design, procurement, permitting, construction, commissioning, and acceptance"],
  ["79-LCM-06-CAPITAL", "Capital cost, escalation, contingency, financing, grant, rate, and tax treatment"],
  ["79-LCM-07-OPERATE", "Staffing, energy, water, materials, data, security, insurance, and administration"],
  ["79-LCM-08-MAINTAIN", "Preventive, predictive, corrective, accessibility, safety, cyber, and environmental maintenance"],
  ["79-LCM-09-RENEW", "Component life, rehabilitation, replacement, upgrade, obsolescence, and capacity renewal"],
  ["79-LCM-10-CONTINUITY", "Redundancy, mutual aid, outage, climate, supply, cyber, and recovery costs"],
  ["79-LCM-11-EXTERNALITY", "Unpriced burden, cumulative effect, compensation, remedy, and restoration cost"],
  ["79-LCM-12-DECOMMISSION", "Closure, decontamination, dismantling, data disposition, workforce transition, and handback"],
  ["79-LCM-13-RESTORE", "Land, water, habitat, cultural, community, service, and institutional restoration"],
  ["79-LCM-14-SCENARIO", "Useful-life, demand, price, failure, technology, climate, policy, and discount-rate scenarios"],
  ["79-LCM-15-AFFORD", "Whole-life affordability, funding source, reserve adequacy, and service-rate burden"],
  ["79-LCM-16-TRIGGER", "Condition, cost, performance, risk, equity, and funding variance triggers"],
  ["79-LCM-17-REVIEW", "Independent lifecycle, engineering, fiscal, service-user, and future-user review"],
  ["79-LCM-18-RECEIPT", "Baseline, plan, variance, maintenance, renewal, closure, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const procurementRiskGates = [
  ["79-PCR-01-PLAN", "Authorized lifecycle plan, funding envelope, and public-purpose boundary"],
  ["79-PCR-02-OPTIONS", "Public provision, shared service, repair, reuse, open standard, multi-vendor, and no-award alternatives"],
  ["79-PCR-03-MARKET", "Market capacity, competition, concentration, entry barrier, and conflict record"],
  ["79-PCR-04-SPEC", "Outcome, performance, safety, accessibility, rights, interoperability, and exit specifications"],
  ["79-PCR-05-VENDOR", "Vendor, parent, affiliate, controller, beneficial owner, and key-person identity"],
  ["79-PCR-06-SUPPLY", "Subcontractor, material, logistics, cloud, data, workforce, jurisdiction, and common-mode dependency"],
  ["79-PCR-07-LOCKIN", "Switching cost, exclusivity, proprietary interface, data gravity, licensing, and stranded capability"],
  ["79-PCR-08-IPDATA", "Public data, records, intellectual property, source, escrow, portability, retention, and deletion"],
  ["79-PCR-09-CAPACITY", "Public workforce, technical, operational, audit, procurement, and fallback capacity"],
  ["79-PCR-10-PRICE", "Price basis, indexation, escalation, volume, change order, open-book, and benchmark rules"],
  ["79-PCR-11-DEBT", "Borrowing authority, principal, rate, term, security, covenant, refinancing, and acceleration"],
  ["79-PCR-12-GUARANTEE", "Guarantee, indemnity, minimum revenue, take-or-pay, termination, and residual exposure"],
  ["79-PCR-13-CONTINGENT", "Probability, trigger, exposure range, correlated risk, recognition, and disclosure"],
  ["79-PCR-14-INSURANCE", "Coverage, insurer, limit, retention, exclusion, counterparty strength, and claims path"],
  ["79-PCR-15-UNINSURABLE", "Self-retained, systemic, catastrophic, sovereign, climate, cyber, and rights risk"],
  ["79-PCR-16-PERFORM", "Milestone, acceptance, service level, security, audit, remedy, step-in, and termination"],
  ["79-PCR-17-INTEGRITY", "Lobbying, gifts, revolving door, related party, recusal, protest, and public-record controls"],
  ["79-PCR-18-FAILURE", "Vendor failure, insolvency, breach, supply interruption, data loss, and continuity response"],
  ["79-PCR-19-REVIEW", "Independent procurement, technical, fiscal-risk, competition, rights, and public-option review"],
  ["79-PCR-20-RECEIPT", "Option, award, obligation, risk, performance, correction, closure, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const intergenerationalGates = [
  ["79-IBS-01-INPUT", "Verified asset, obligation, lifecycle, procurement, liability, insurance, and reserve inputs"],
  ["79-IBS-02-BASIS", "Recognition basis, units, price date, horizon, scenario, uncertainty, and missingness"],
  ["79-IBS-03-STANDING", "Current users, non-users, rights holders, workers, payers, communities, and future users"],
  ["79-IBS-04-BASELINE", "No-action, current-policy, repair, replace, retire, restore, and public-option baselines"],
  ["79-IBS-05-FLOWS", "Capital, operating, service, environmental, social, risk, and non-market flows over time"],
  ["79-IBS-06-DISTRIBUTION", "Benefit, burden, access, exclusion, liability, subsidy, compensation, and remedy accounts"],
  ["79-IBS-07-NATURAL", "Natural, cultural, community, treaty, public-realm, knowledge, and institutional assets"],
  ["79-IBS-08-MAINTENANCE", "Deferred maintenance, renewal backlog, service impairment, safety exposure, and cost growth"],
  ["79-IBS-09-RESERVE", "Operating reserve, stabilization, contingency, insurance retention, and liquidity floor"],
  ["79-IBS-10-SINKING", "Renewal, decommissioning, restoration, remediation, closure, and residual-duty funding"],
  ["79-IBS-11-OPTION", "Future-user option value, flexibility, reversibility, substitution, and knowledge preservation"],
  ["79-IBS-12-IRREVERSIBLE", "Lock-in, depletion, extinction, contamination, displacement, data loss, and stranded obligation"],
  ["79-IBS-13-STRESS", "Revenue, rate, demand, cost, hazard, market, vendor, legal, and confidence stress tests"],
  ["79-IBS-14-TRIGGER", "Reserve breach, covenant risk, service failure, maintenance acceleration, harm, and authority change"],
  ["79-IBS-15-RESTRUCTURE", "Prioritization, burden sharing, creditor, worker, user, rights-holder, and continuity safeguards"],
  ["79-IBS-16-RESTORE", "Fiscal, service, environmental, community, institutional, and democratic restoration plan"],
  ["79-IBS-17-COMPACT", "Interjurisdictional allocation without fiscal, emergency, or contribution-based authority laundering"],
  ["79-IBS-18-REASON", "Accessible public reasons, alternatives, dissent, uncertainty, and distributional explanation"],
  ["79-IBS-19-AUDIT", "Independent intergenerational, fiscal, engineering, rights, natural-asset, and performance audit"],
  ["79-IBS-20-RECEIPT", "Balance-sheet, stress, restructuring, restoration, correction, archive, and propagation receipts"]
].map(([gate_id, label]) => ({ gate_id, label }));

const makeTaxonomy = (prefix, labels, idKey) => labels.map((label, index) => ({ [idKey]: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));
const assetClasses = makeTaxonomy("79-AST", ["Land, easement, corridor, and public realm", "Building, facility, and site", "Network, utility, and enabling infrastructure", "Vehicle, equipment, and operating fleet", "Inventory, material, and strategic stock", "Water, mineral, energy, and natural resource", "Habitat, ecosystem, climate, and restoration asset", "Cultural landscape, heritage, language, and community asset", "Data, record, model, software, and digital infrastructure", "Intellectual property, license, standard, and public knowledge", "Workforce, institutional capability, and operating know-how", "Service right, access right, franchise, and regulated entitlement", "Reserve, receivable, investment, and financial asset", "Resilience, redundancy, option value, and future-use capacity"], "asset_class_id");
const obligationClasses = makeTaxonomy("79-OBL", ["Capital completion and acceptance", "Operation and minimum service", "Preventive and corrective maintenance", "Renewal, rehabilitation, and replacement", "Accessibility, rights, treaty, and accommodation", "Safety, security, privacy, and due process", "Environmental mitigation, monitoring, and restoration", "Workforce, pension, transition, and labor standard", "Debt service, covenant, guarantee, and indemnity", "Insurance retention, claim, and uninsurable loss", "Vendor, license, cloud, supply, and interoperability", "Decommissioning, closure, dismantling, and data disposition", "Compensation, remedy, litigation, and residual liability", "Future-user, successor, archive, and knowledge-preservation duty"], "obligation_class_id");
const lifecycleStages = makeTaxonomy("79-LFS", ["Need and no-action baseline", "Alternatives and public option", "Design and approval", "Acquisition and construction", "Commissioning and acceptance", "Routine operation", "Maintenance and inspection", "Rehabilitation and renewal", "Adaptation and resilience", "Service transition and substitution", "Decommissioning and closure", "Restoration, handback, and residual duty"], "lifecycle_stage_id");
const maintenanceDuties = makeTaxonomy("79-MNT", ["Condition inspection and asset inventory", "Preventive and predictive maintenance", "Corrective maintenance and defect closure", "Safety-critical and regulatory compliance", "Accessibility and universal-service upkeep", "Cybersecurity, software, data, and control-system upkeep", "Climate adaptation and hazard hardening", "Environmental monitoring and mitigation", "Workforce, tools, spares, and supplier readiness", "Backlog, deferral, service impairment, and cost escalation", "Renewal, rehabilitation, and replacement planning", "Public reporting, independent audit, and residual-duty handoff"], "maintenance_duty_id");
const dependencyClasses = makeTaxonomy("79-DEP", ["Single vendor or concentrated market", "Proprietary interface or closed standard", "Data, cloud, model, or platform gravity", "License, subscription, support, or update dependency", "Critical material, component, or equipment dependency", "Subcontractor, logistics, or geographic concentration", "Specialized workforce, clearance, credential, or key person", "Intellectual property, source, escrow, and documentation", "Public technical, procurement, and operating capacity", "Switching, migration, termination, and stranded cost", "Security, privacy, rights, and jurisdiction exposure", "Common-mode, correlated, systemic, and cascading failure"], "dependency_class_id");
const liabilityClasses = makeTaxonomy("79-LIA", ["Direct debt and accrued interest", "Lease, concession, service, and purchase commitment", "Guarantee, indemnity, and minimum-revenue support", "Take-or-pay, volume, price, and termination obligation", "Pension, workforce, transition, and benefit obligation", "Maintenance backlog and renewal deficit", "Environmental remediation and restoration", "Decommissioning, closure, and residual stewardship", "Litigation, rights, treaty, compensation, and remedy", "Insurance retention, exclusion, and claim exposure", "Vendor failure, supply interruption, and step-in cost", "Cyber, privacy, data-loss, and technology-obsolescence exposure", "Emergency, mutual-aid, and service-continuity exposure", "Climate, disaster, systemic, and intergenerational exposure"], "liability_class_id");
const insuranceLimits = makeTaxonomy("79-INS", ["Coverage not bound or verified", "Limit below plausible exposure", "Material deductible or self-insured retention", "Exclusion, sublimit, waiting period, or aggregation rule", "Counterparty credit, concentration, or claims-paying risk", "Occurrence, claims-made, discovery, or tail mismatch", "Jurisdiction, sovereign, treaty, rights, or public-policy limit", "Cyber, climate, catastrophe, or systemic-risk limit", "Service interruption, restoration, or replacement-cost gap", "Uninsurable or deliberately self-retained public obligation"], "insurance_limit_id");
const distributionAccounts = makeTaxonomy("79-DST", ["Current service users", "Current non-users and excluded publics", "Low-income, vulnerable, and accessibility-reliant publics", "Indigenous nations, treaty partners, and rights holders", "Workers, contractors, and supply-chain communities", "Ratepayers, taxpayers, debt holders, and guarantors", "Host communities and neighboring jurisdictions", "Upstream and downstream environmental communities", "Owners, operators, vendors, and institutional beneficiaries", "Future service users and successor governments", "Future affected communities and rights holders", "Natural systems, cultural continuity, and common inheritance"], "distribution_account_id");
const futureUserTests = makeTaxonomy("79-FUT", ["Service availability and universal access", "Affordability and fiscal room", "Reliability, safety, and state of good repair", "Reversibility and feasible exit", "Substitution and public-option capacity", "Natural-resource sufficiency and restoration", "Cultural continuity, treaty rights, and community stability", "Knowledge, data, standards, and institutional memory", "Technology adaptability and interoperability", "Residual liability and decommissioning funding", "Climate, hazard, and systemic resilience", "Democratic choice and uncommitted option value"], "future_user_test_id");
const stressTriggers = makeTaxonomy("79-STR", ["Revenue, rate, tax, grant, or transfer shortfall", "Capital, operating, maintenance, or restoration cost overrun", "Demand, utilization, service, or affordability shock", "Interest-rate, refinancing, covenant, or credit event", "Vendor, insurer, guarantor, or critical-supply failure", "Asset-condition, safety, accessibility, or reliability breach", "Cyber, privacy, data, or technology-obsolescence event", "Climate, disaster, contamination, or ecosystem threshold", "Rights, treaty, litigation, compensation, or legitimacy event", "Interjurisdictional withdrawal, dispute, or burden-shift event", "Reserve, liquidity, sinking-fund, or insurance-retention breach", "Closure, decommissioning, restoration, or successor-capacity failure"], "stress_trigger_id");
const stewardshipDuties = makeTaxonomy("79-STW", ["Preserve verified asset and obligation identity", "Maintain service and rights floors", "Fund inspection, maintenance, and renewal", "Protect natural, cultural, and community assets", "Preserve public capacity, data, knowledge, and options", "Disclose debt, guarantee, insurance, and contingent risk", "Prevent vendor lock-in and authority laundering", "Maintain reserves, sinking funds, and liquidity", "Fund decommissioning, closure, and restoration", "Test distribution across current and future publics", "Trigger stress review, correction, and restructuring", "Publish independent audit, dissent, archive, and handoff receipts"], "stewardship_duty_id");

const assetRegisters = upstream.map((source, index) => {
  const padded = String(index + 1).padStart(3, "0");
  return {
    public_asset_obligation_register_id: `79-AOR-${padded}`,
    slug: `79-aor-${padded}-${shortName(source)}`,
    record_kind: "public_asset_obligation_register",
    record_status: "Published",
    register_state: "Inactive - No Executed Phase 78 Compact",
    admission_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    emergency_authority_normalization_ledger_id: source.emergency_authority_normalization_ledger_id,
    shared_public_value_contribution_compact_id: source.shared_public_value_contribution_compact_id,
    asset_obligation_checks: inactiveChecks(assetObligationGates, "No real executed Phase 78 compact with complete ordinary-authority, contribution, continuity, exit, restoration, and receipt terms exists."),
    asset_class_records: assetClasses.map((item) => ({ ...item, asset_state: "Unregistered", asset_ids: [], value_records: [], restriction_ids: [] })),
    obligation_class_records: obligationClasses.map((item) => ({ ...item, obligation_state: "Unregistered", obligation_ids: [], owner_ids: [], funding_records: [] })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    executed_phase78_compact_ids: [],
    authority_records: [],
    asset_records: [],
    beneficial_ownership_records: [],
    control_right_records: [],
    condition_and_capability_records: [],
    nonmarket_value_records: [],
    restriction_and_encumbrance_records: [],
    obligation_records: [],
    counterparty_records: [],
    valuation_method_record: null,
    distribution_records: [],
    future_user_records: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    register_receipt_id: null,
    propagation_status: "not_started",
    market_value_as_public_value_allowed: false,
    asset_as_authority_allowed: false,
    automatic_valuation_allowed: false,
    automatic_obligation_recognition_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const lifecycleLedgers = assetRegisters.map((item, index) => {
  const source = upstream[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    lifecycle_cost_maintenance_ledger_id: `79-LCM-${padded}`,
    slug: `79-lcm-${padded}-${shortName(source)}`,
    record_kind: "lifecycle_cost_maintenance_ledger",
    record_status: "Published",
    lifecycle_state: "Inactive - No Admitted Public Asset Or Obligation",
    planning_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    public_asset_obligation_register_id: item.public_asset_obligation_register_id,
    lifecycle_maintenance_checks: inactiveChecks(lifecycleMaintenanceGates, "No admitted Phase 79 asset, obligation, condition, service, or valuation-method record exists."),
    lifecycle_stage_records: lifecycleStages.map((entry) => ({ ...entry, stage_state: "Unplanned", cost_records: [], evidence_ids: [], decision_id: null })),
    maintenance_duty_records: maintenanceDuties.map((entry) => ({ ...entry, duty_state: "Unfunded", owner_ids: [], schedule_records: [], backlog_records: [] })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    public_need_record: null,
    no_action_baseline_record: null,
    alternative_records: [],
    design_life_record: null,
    capital_cost_records: [],
    operating_cost_records: [],
    maintenance_plan_records: [],
    renewal_plan_records: [],
    resilience_cost_records: [],
    externality_cost_records: [],
    decommissioning_cost_records: [],
    restoration_cost_records: [],
    scenario_records: [],
    affordability_and_funding_record: null,
    variance_trigger_records: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    lifecycle_receipt_id: null,
    propagation_status: "not_started",
    capital_cost_as_lifecycle_cost_allowed: false,
    deferred_maintenance_as_savings_allowed: false,
    automatic_discount_rate_allowed: false,
    automatic_affordability_finding_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const procurementRiskRegisters = lifecycleLedgers.map((item, index) => {
  const source = upstream[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    procurement_dependency_contingent_risk_register_id: `79-PCR-${padded}`,
    slug: `79-pcr-${padded}-${shortName(source)}`,
    record_kind: "procurement_dependency_contingent_risk_register",
    record_status: "Published",
    procurement_risk_state: "Inactive - No Authorized Lifecycle Plan",
    commitment_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    lifecycle_cost_maintenance_ledger_id: item.lifecycle_cost_maintenance_ledger_id,
    public_asset_obligation_register_id: item.public_asset_obligation_register_id,
    procurement_risk_checks: inactiveChecks(procurementRiskGates, "No authorized lifecycle plan, funding envelope, procurement need, or public-option comparison exists."),
    dependency_class_records: dependencyClasses.map((entry) => ({ ...entry, dependency_state: "Unassessed", vendor_ids: [], exposure_records: [], mitigation_ids: [] })),
    liability_class_records: liabilityClasses.map((entry) => ({ ...entry, liability_state: "Unrecognized", obligation_ids: [], exposure_records: [], funding_ids: [] })),
    insurance_limit_records: insuranceLimits.map((entry) => ({ ...entry, limit_state: "Unassessed", policy_ids: [], exposure_ids: [], gap_finding_id: null })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    authorized_procurement_need_record: null,
    public_option_and_alternative_records: [],
    market_capacity_records: [],
    vendor_identity_records: [],
    supply_dependency_records: [],
    lock_in_and_exit_records: [],
    public_data_ip_records: [],
    public_capacity_records: [],
    pricing_records: [],
    debt_records: [],
    guarantee_and_indemnity_records: [],
    contingent_liability_records: [],
    insurance_records: [],
    uninsurable_risk_records: [],
    performance_and_remedy_records: [],
    integrity_and_conflict_records: [],
    failure_and_continuity_records: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    procurement_risk_receipt_id: null,
    propagation_status: "not_started",
    procurement_as_public_value_allowed: false,
    insurance_as_risk_elimination_allowed: false,
    contribution_as_control_allowed: false,
    automatic_vendor_selection_allowed: false,
    automatic_liability_recognition_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const intergenerationalLedgers = procurementRiskRegisters.map((item, index) => {
  const source = upstream[index];
  const padded = String(index + 1).padStart(3, "0");
  return {
    intergenerational_balance_sheet_stewardship_ledger_id: `79-IBS-${padded}`,
    slug: `79-ibs-${padded}-${shortName(source)}`,
    record_kind: "intergenerational_balance_sheet_stewardship_ledger",
    record_status: "Published",
    balance_sheet_state: "Inactive - No Verified Public Wealth Inputs",
    stewardship_decision: "Not Open",
    cohort_id: source.cohort_id,
    file_id: source.file_id,
    named_entity: source.named_entity,
    procurement_dependency_contingent_risk_register_id: item.procurement_dependency_contingent_risk_register_id,
    lifecycle_cost_maintenance_ledger_id: item.lifecycle_cost_maintenance_ledger_id,
    public_asset_obligation_register_id: item.public_asset_obligation_register_id,
    intergenerational_stewardship_checks: inactiveChecks(intergenerationalGates, "No verified asset, obligation, lifecycle, procurement, liability, insurance, reserve, or distribution input exists."),
    distribution_account_records: distributionAccounts.map((entry) => ({ ...entry, account_state: "Unmeasured", benefit_records: [], burden_records: [], remedy_ids: [] })),
    future_user_test_records: futureUserTests.map((entry) => ({ ...entry, test_state: "Not Tested", evidence_ids: [], finding_id: null, condition_ids: [] })),
    fiscal_stress_trigger_records: stressTriggers.map((entry) => ({ ...entry, trigger_state: "Dormant", event_ids: [], review_id: null, decision_id: null })),
    stewardship_duty_records: stewardshipDuties.map((entry) => ({ ...entry, duty_state: "Unassigned", owner_ids: [], funding_ids: [], receipt_ids: [] })),
    source_ids: source.source_ids,
    signal_ids: source.signal_ids,
    evidence_gap_ids: source.evidence_gap_ids,
    canonical_briefing_id: source.canonical_briefing_id,
    reader_pathway_ids: source.reader_pathway_ids,
    local_system_ids: source.local_system_ids,
    recognition_basis_record: null,
    time_horizon_record: null,
    current_and_future_standing_records: [],
    baseline_and_scenario_records: [],
    temporal_flow_records: [],
    distributional_balance_records: [],
    natural_cultural_community_asset_records: [],
    deferred_maintenance_liability_records: [],
    reserve_records: [],
    sinking_fund_records: [],
    decommissioning_and_restoration_fund_records: [],
    future_option_value_records: [],
    irreversible_loss_records: [],
    stress_test_records: [],
    restructuring_records: [],
    restoration_plan_records: [],
    public_reason_record: null,
    intergenerational_audit_record: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    stewardship_receipt_id: null,
    propagation_status: "not_started",
    present_value_as_intergenerational_fairness_allowed: false,
    reserve_as_funded_obligation_allowed: false,
    emergency_authority_as_fiscal_authority_allowed: false,
    automatic_discount_rate_allowed: false,
    automatic_restructuring_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "79",
  registry_id: "public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry-001",
  title: "Public Wealth, Long-Horizon Stewardship And Intergenerational Balance Sheet Registry",
  captured_date: "2026-08-24",
  as_of_date: "2026-08-24",
  scope: "Eight inactive public-asset and obligation registers, eight inactive lifecycle-cost and maintenance ledgers, eight inactive procurement-dependency and contingent-risk registers, and eight inactive intergenerational balance-sheet stewardship ledgers downstream of Phase 78.",
  interpretation_boundary: "An asset register is not a market valuation. Capital authorization is not lifecycle affordability. Procurement is not public capacity. Insurance is not risk elimination. A reserve balance is not a funded restoration duty. Present value is not intergenerational fairness.",
  activation_rule: "At least one real executed Phase 78 compact must contain separately authorized public-value, burden, contribution, continuity, dispute, exit, restoration, and receipt terms under ordinary authority, with no unresolved emergency power treated as fiscal authority. Asset admission, valuation, lifecycle planning, procurement, liability recognition, reserve adequacy, stress response, and intergenerational findings then require separate human decisions and receipts.",
  asset_obligation_gates: assetObligationGates,
  lifecycle_maintenance_gates: lifecycleMaintenanceGates,
  procurement_risk_gates: procurementRiskGates,
  intergenerational_stewardship_gates: intergenerationalGates,
  asset_classes: assetClasses,
  obligation_classes: obligationClasses,
  lifecycle_stages: lifecycleStages,
  maintenance_duties: maintenanceDuties,
  dependency_classes: dependencyClasses,
  liability_classes: liabilityClasses,
  insurance_limits: insuranceLimits,
  distribution_accounts: distributionAccounts,
  future_user_tests: futureUserTests,
  fiscal_stress_triggers: stressTriggers,
  stewardship_duties: stewardshipDuties,
  register_states: ["Inactive - No Executed Phase 78 Compact", "Scoping", "Under Review", "Held", "Admitted With Conditions", "Denied", "Corrected", "Withdrawn"],
  lifecycle_states: ["Inactive - No Admitted Public Asset Or Obligation", "Baseline Review", "Options Review", "Plan Drafted", "Held", "Authorized With Conditions", "Corrected", "Closed"],
  procurement_risk_states: ["Inactive - No Authorized Lifecycle Plan", "Market Review", "Option Review", "Solicitation", "Evaluation", "Held", "Awarded With Conditions", "Operating", "Terminated", "Corrected"],
  balance_sheet_states: ["Inactive - No Verified Public Wealth Inputs", "Input Review", "Scenario Review", "Stress Review", "Held", "Published With Limits", "Restructuring", "Restoring", "Corrected", "Archived"],
  metrics: {
    public_asset_obligation_registers: assetRegisters.length,
    lifecycle_cost_maintenance_ledgers: lifecycleLedgers.length,
    procurement_dependency_contingent_risk_registers: procurementRiskRegisters.length,
    intergenerational_balance_sheet_stewardship_ledgers: intergenerationalLedgers.length,
    asset_obligation_gates: assetObligationGates.length,
    lifecycle_maintenance_gates: lifecycleMaintenanceGates.length,
    procurement_risk_gates: procurementRiskGates.length,
    intergenerational_stewardship_gates: intergenerationalGates.length,
    asset_classes: assetClasses.length,
    obligation_classes: obligationClasses.length,
    lifecycle_stages: lifecycleStages.length,
    maintenance_duties: maintenanceDuties.length,
    dependency_classes: dependencyClasses.length,
    liability_classes: liabilityClasses.length,
    insurance_limits: insuranceLimits.length,
    distribution_accounts: distributionAccounts.length,
    future_user_tests: futureUserTests.length,
    fiscal_stress_triggers: stressTriggers.length,
    stewardship_duties: stewardshipDuties.length,
    executed_phase78_compacts_received: 0,
    assets_admitted: 0,
    obligations_recognized: 0,
    valuations_issued: 0,
    lifecycle_plans_authorized: 0,
    maintenance_duties_funded: 0,
    procurements_opened_or_awarded: 0,
    vendors_selected: 0,
    debts_or_guarantees_recognized: 0,
    contingent_liabilities_recognized: 0,
    insurance_coverage_findings_issued: 0,
    reserves_or_sinking_funds_verified: 0,
    decommissioning_or_restoration_funds_verified: 0,
    distributional_findings_issued: 0,
    future_user_findings_issued: 0,
    stress_tests_completed: 0,
    restructuring_or_restoration_decisions: 0,
    intergenerational_audits_completed: 0,
    receipts_created: 0,
    scores_created: 0,
    rankings_created: 0,
    phase64_cells_advanced: 0
  },
  public_asset_obligation_registers: assetRegisters,
  lifecycle_cost_maintenance_ledgers: lifecycleLedgers,
  procurement_dependency_contingent_risk_registers: procurementRiskRegisters,
  intergenerational_balance_sheet_stewardship_ledgers: intergenerationalLedgers
};

await writeJson(join(dataRoot, "phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry.json"), registry);

const guideDefinitions = [
  ["briefing-public-wealth-balance-sheet-001", "public-wealth-balance-sheet-001", "Public Wealth Balance Sheet 001: Count Capability And Duty Together", "A public-wealth method that records assets, service capability, restrictions, obligations, distribution, uncertainty, and stewardship without collapsing them into market value.", "Public wealth is the durable capacity to meet public purposes under lawful, fair, and maintainable conditions. Land, facilities, networks, natural systems, cultural continuity, data, knowledge, workforce, institutional capability, reserves, and option value matter alongside debt and cash.", "Market price, construction cost, book value, revenue, or economic impact cannot establish public value, beneficial ownership, usable capacity, fair distribution, or an adequately funded obligation."],
  ["briefing-lifecycle-costing-whole-life-affordability-001", "lifecycle-costing-whole-life-affordability-001", "Lifecycle Costing 001: Capital Approval Is Not Whole-Life Affordability", "A whole-life framework for acquisition, operation, maintenance, renewal, resilience, closure, restoration, uncertainty, and funding.", "The cheapest acquisition can become the most expensive public obligation. A credible plan follows costs and capabilities from the no-action baseline through design, delivery, operation, maintenance, renewal, adaptation, service transition, decommissioning, and restoration.", "An approved capital budget, grant, low bid, financing package, or completed asset does not prove affordable operation, state of good repair, renewal capacity, funded closure, or durable public benefit."],
  ["briefing-procurement-vendor-lockin-public-options-001", "procurement-vendor-lockin-public-options-001", "Procurement, Vendor Lock-In And Public Options 001: Buying Is A Governance Choice", "A procurement method for public options, competition, vendor identity, supply dependencies, interoperability, data rights, public capacity, failure, and exit.", "Procurement allocates technical control, knowledge, risk, employment, data, switching power, and future choice. The public record must compare repair, reuse, shared service, in-house provision, open standards, multiple suppliers, partnership, purchase, and no-award options.", "A competitive process, contract signature, vendor reputation, proprietary advantage, or lower bid does not establish public capacity, acceptable lock-in, resilient supply, fair risk allocation, or a workable exit."],
  ["briefing-debt-guarantees-contingent-liabilities-001", "debt-guarantees-contingent-liabilities-001", "Debt, Guarantees And Contingent Liabilities 001: Exposure Needs A Trigger Record", "A ledger for direct borrowing, leases, guarantees, indemnities, minimum revenue, termination exposure, correlated risks, disclosure, and funding.", "Public exposure extends beyond recognized debt. Guarantees, indemnities, take-or-pay terms, concessions, availability payments, pensions, maintenance backlog, remediation, litigation, vendor failure, emergency continuity, and restoration can move costs into later years or off the visible budget.", "A low probability, private counterparty, future trigger, accounting treatment, insurance policy, or non-cash commitment does not make an obligation immaterial or transfer it away from the public."],
  ["briefing-insurance-uninsurable-public-risk-001", "insurance-uninsurable-public-risk-001", "Insurance And Uninsurable Public Risk 001: Coverage Is Not Elimination", "A framework for policy scope, limits, retentions, exclusions, claims timing, counterparty strength, correlated loss, self-insurance, and public residual duty.", "Insurance can finance a bounded share of loss; it cannot erase the service, rights, environmental, continuity, or democratic duties attached to a public system. Coverage must be matched to plausible events, time horizons, aggregation rules, replacement costs, and restoration needs.", "A certificate, policy limit, insurer rating, risk-transfer contract, or reserve does not prove coverage will respond, that the limit is adequate, or that excluded and systemic harms have disappeared."],
  ["briefing-natural-cultural-community-assets-001", "natural-cultural-community-assets-001", "Natural, Cultural And Community Assets 001: Stewardship Beyond A Price", "A recognition method for ecosystems, water, land, cultural landscapes, treaty relationships, heritage, public realm, community networks, and institutional trust.", "Some public assets are living systems, relationships, collective capabilities, or conditions of future choice. Their value can be material even when ownership is shared, market exchange is inappropriate, measurement is incomplete, or loss cannot be reversed.", "A monetized estimate, parcel title, mitigation payment, consultation record, or replacement project cannot fully substitute for ecological function, treaty duty, cultural continuity, community connection, or irreversible loss."],
  ["briefing-maintenance-state-good-repair-deferred-liability-001", "maintenance-state-good-repair-deferred-liability-001", "Maintenance And State Of Good Repair 001: Deferral Is A Liability Decision", "A maintenance-control method for condition, service floors, inspection, preventive work, backlog, risk, cost escalation, renewal, and public reporting.", "Maintenance is an operating promise, not an optional afterthought. Deferral can reduce current spending while increasing failure probability, service inequity, accessibility barriers, safety exposure, energy use, emergency cost, workforce pressure, and future replacement needs.", "A balanced annual budget, functioning asset, low complaint count, or delayed failure does not prove state of good repair, eliminate backlog, or convert deferred work into savings."],
  ["briefing-reserves-sinking-funds-liquidity-001", "reserves-sinking-funds-liquidity-001", "Reserves, Sinking Funds And Liquidity 001: A Balance Needs A Duty", "A control framework for operating reserves, stabilization, contingencies, insurance retention, renewal, closure, restoration, restrictions, stress, and replenishment.", "A reserve should name the obligation it protects, its legal restrictions, target method, risk horizon, eligible uses, custodian, liquidity, investment limits, replenishment rule, draw authority, reporting, and consequences of falling below the floor.", "Cash on hand, an accounting designation, borrowing capacity, an unfunded target, or a general contingency does not prove that maintenance, renewal, insurance retention, decommissioning, or restoration is funded."],
  ["briefing-decommissioning-restoration-funding-001", "decommissioning-restoration-funding-001", "Decommissioning And Restoration Funding 001: Closure Starts At Authorization", "A cradle-to-closure method for dismantling, contamination, data disposition, workforce transition, service replacement, land handback, monitoring, and residual duty.", "Closure obligations are created when a system is authorized, not when the final operating year arrives. Design choices, materials, land arrangements, data systems, contracts, hazardous inventories, workforce models, service dependencies, and restoration standards determine future cost and feasibility.", "A closure plan without segregated funding, a contractor estimate, salvage value, insurance, an emergency appropriation, or a future successor does not establish funded decommissioning or completed restoration."],
  ["briefing-distributional-public-balance-sheets-001", "distributional-public-balance-sheets-001", "Distributional Public Balance Sheets 001: Aggregate Value Hides Who Carries It", "A public accounting method that keeps benefits, burdens, access, exclusion, subsidy, liability, remedy, and uncertainty visible across affected groups.", "A public balance sheet should show who receives service, who cannot access it, who pays taxes or rates, who supplies labor, who hosts infrastructure, who bears environmental and safety effects, who gains control, who receives compensation, and who inherits residual duties.", "Positive aggregate value, average affordability, regional growth, majority benefit, or a net-present-value result cannot establish fair distribution, consent, remedy, or legitimacy."],
  ["briefing-future-users-option-value-irreversibility-001", "future-users-option-value-irreversibility-001", "Future Users, Option Value And Irreversibility 001: Preserve Choices That Cannot Vote Yet", "A method for testing future access, fiscal room, resilience, reversibility, substitution, natural systems, knowledge, residual liabilities, and democratic option value.", "Future users cannot participate directly in today's authorization, yet they inherit infrastructure, service standards, debt, maintenance condition, environmental change, technical dependencies, archives, rights effects, restoration duties, and the remaining ability to choose differently.", "A discounted future value, long asset life, growth forecast, current mandate, sunk cost, or claimed inevitability does not establish intergenerational fairness or justify irreversible loss."],
  ["briefing-fiscal-stress-restructuring-restoration-001", "fiscal-stress-restructuring-restoration-001", "Fiscal Stress, Restructuring And Restoration 001: Protect Service And Rights Through The Shock", "A stress-response framework for triggers, liquidity, covenants, maintenance, vendors, insurers, burden sharing, continuity, public reason, correction, and restoration.", "Fiscal stress can expose hidden dependencies and shift burdens quickly. A governed response identifies the trigger, evidence, authority, liquidity, essential-service floors, affected publics, rights, maintenance risks, creditors, vendors, workers, interjurisdictional duties, options, distribution, review, and exit.", "A crisis declaration, covenant, creditor preference, emergency procurement, across-the-board cut, asset sale, or temporary contribution cannot automatically outrank rights, service continuity, treaty duties, maintenance, restoration, or democratic authorization."]
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
  - "Public wealth requires assets, capabilities, restrictions, obligations, funding, distribution, uncertainty, and future users in one inspectable record."
  - "Capital cost, market value, procurement, insurance, reserves, and present value each answer narrower questions than public stewardship."
  - "Valuation, recognition, funding, stress response, restructuring, and intergenerational findings remain separate human decisions with receipts."
constraint_watch:
  - "Public Trust"
  - "Regulation"
  - "Infrastructure"
  - "Interpretation"
what_to_watch_next:
  - "A real executed Phase 78 compact with ordinary-authority value, burden, contribution, continuity, exit, restoration, and receipt terms"
  - "A verified asset and obligation register with condition, rights, restriction, distribution, and future-user records"
  - "Separately authorized lifecycle, procurement, liability, reserve, stress, restoration, and intergenerational decisions"
---

## Why this layer exists

${focus}

Phase 79 begins only after Phase 78 produces a real executed compact with separately authorized public-value, burden, contribution, continuity, dispute, exit, restoration, and receipt terms under ordinary authority. No such compact exists. The [Public Wealth And Stewardship Registry](/evidence/stewardship/) therefore publishes an inspectable empty contract, not a valuation, budget, procurement, liability, solvency, resilience, or fairness claim.

${boundary}

## Build the public register before valuing anything

Every asset and obligation needs a stable identity, legal and functional boundary, authority, owner or custodian, beneficial public interest, control rights, restrictions, counterparties, condition, service capability, users, affected publics, evidence date, uncertainty, and change history. Land, facilities, networks, equipment, natural systems, cultural relationships, data, knowledge, workforce capability, reserves, contractual rights, and public options do not share one measurement method.

The matching obligation record names operation, maintenance, renewal, accessibility, safety, security, environmental mitigation, workforce, debt, guarantee, insurance retention, vendor dependency, decommissioning, restoration, compensation, remedy, and successor duties. An asset cannot be presented as public wealth while the duties needed to keep it usable, lawful, safe, accessible, resilient, and restorable remain outside the frame.

Recognition is a decision boundary. The register preserves disputed ownership, incomplete inventory, unavailable condition evidence, non-market value, incompatible measures, contingent events, and missing future costs rather than assigning a convenient number. Market value can be one input; it cannot decide whether the public can use the asset, who benefits, who bears restrictions, or what obligations travel with it.

## Follow the whole lifecycle

Lifecycle planning begins with the public need and no-action baseline. It compares repair, reuse, demand management, shared service, a public option, open standards, multi-vendor delivery, new construction, phased delivery, substitution, and retirement. Each alternative identifies service performance, rights, distribution, environmental effects, resilience, uncertainty, institutional capacity, and exit—not only capital price.

Whole-life cost follows design, acquisition, land, permitting, construction, commissioning, finance, staffing, energy, water, materials, security, data, insurance, administration, maintenance, inspection, rehabilitation, replacement, adaptation, outages, externalities, service transition, decommissioning, restoration, monitoring, and residual duty. Time horizon and discount rate are explicit scenario choices. A low discounted cost cannot hide an irreversible burden or an unfunded duty.

Maintenance has its own plan, owner, schedule, workforce, spares, inspection standard, service floor, backlog, risk consequence, escalation assumption, renewal trigger, funding source, and public report. Deferral is recorded as a change in condition, service, risk, or future cost. It is not silently booked as an efficiency.

## Treat procurement as long-term governance

Procurement analysis includes public provision and no-award options before vendor evaluation. It identifies market concentration, beneficial ownership, affiliates, subcontractors, critical materials, cloud and data dependencies, proprietary interfaces, licensing, intellectual property, source access, escrow, documentation, workforce, jurisdictions, switching costs, migration, continuity, and stranded public capability.

Specifications cover performance, service, accessibility, rights, labor, safety, security, privacy, interoperability, records, audit, correction, acceptance, remedies, step-in, termination, handback, and deletion. Price terms expose escalation, indexation, minimum volumes, change orders, open-book rights, benchmarks, guarantees, indemnities, and termination exposure. Contributions or urgency cannot become undisclosed governing control.

The public-capacity record asks whether public institutions can specify, procure, inspect, operate, challenge, migrate, substitute, and exit. A vendor can be capable while the public remains dependent. A contract can perform while future choices narrow. Those are separate findings.

## Make debt, guarantees, insurance, and residual risk visible

Direct borrowing is only one liability class. Leases, concessions, service commitments, guarantees, indemnities, minimum revenue, take-or-pay terms, pensions, maintenance backlog, remediation, decommissioning, litigation, compensation, vendor failure, emergency continuity, and climate exposure can create material claims on future service and fiscal room.

Each contingent exposure names the triggering event, probability range, loss range, timing, correlation, counterparty, legal basis, accounting treatment, disclosure, mitigation, reserve, insurance, funding authority, and decision owner. Unknown probability is preserved as unknown. Lack of recognition in a financial statement does not prove lack of public exposure.

Insurance records match policy language, occurrence basis, limit, deductible, self-insured retention, sublimit, exclusion, aggregation, waiting period, claims process, insurer strength, time horizon, and plausible replacement or restoration need. Uninsurable and deliberately retained risks stay visible with an owner and response plan. Insurance can finance loss; it cannot discharge rights, continuity, restoration, or democratic duties.

## Fund stewardship, closure, and restoration

Reserves and sinking funds are tied to named obligations. The record states legal restriction, target method, risk horizon, eligible use, liquidity, investment limits, custodian, draw authority, replenishment, disclosure, stress threshold, and shortfall response. General cash, borrowing headroom, or an accounting label cannot be assigned twice or treated as proof that every obligation is funded.

Decommissioning begins at authorization. Design and procurement choices determine dismantling, hazardous-material handling, contamination, data disposition, workforce transition, service replacement, land handback, ecological restoration, cultural obligations, long-term monitoring, and residual liability. Funding needs a verified cost basis, escalation, uncertainty, segregated resources or enforceable security, governance, review, and successor plan.

Natural, cultural, community, and institutional assets require stewardship measures that do not depend on forced market exchange. Ecological function, water, biodiversity, cultural landscape, treaty relationship, public realm, trust, knowledge, language, and community networks may need condition thresholds, rights-based safeguards, qualitative evidence, restoration standards, and irreversible-loss limits alongside any monetary estimate.

## Publish the distribution across time

The intergenerational balance sheet separates current users, excluded publics, vulnerable and accessibility-reliant people, Indigenous nations and rights holders, workers, payers, host communities, downstream communities, counterparties, future users, future affected communities, natural systems, and common inheritance. For each account it shows service, benefit, burden, access, subsidy, liability, risk, remedy, uncertainty, and timing.

Future-user tests examine service availability, affordability, fiscal room, condition, safety, reversibility, substitution, public capacity, natural sufficiency, cultural continuity, knowledge, interoperability, residual liability, climate resilience, and democratic option value. Future publics are not a single discounted number. Different generations can inherit different assets, risks, rights, and ability to change course.

Aggregate net value is never the final decision rule. Distribution, irreversible loss, non-substitutable rights, service floors, uncertainty, and restoration duties remain visible. A positive total cannot cancel a severe burden imposed on a distinct public or move an obligation beyond the horizon until it disappears.

## Prepare for fiscal stress without normalizing emergency power

Stress tests cover revenue, rates, grants, cost escalation, demand, interest, refinancing, covenants, vendors, insurers, asset condition, safety, cyber, climate, contamination, litigation, treaty duties, interjurisdictional disputes, reserves, liquidity, closure, and restoration. The scenario states what changes, what remains protected, which evidence is missing, and which trigger opens human review.

Restructuring preserves lawful authority, essential services, rights, treaty duties, accessibility, worker protections, maintenance, records, transparency, challenge, and restoration. Options can include reprioritization, staged work, negotiated terms, revenue measures, procurement changes, public-capacity rebuilding, asset reuse, service redesign, or orderly closure. Asset sales, emergency powers, creditor terms, or across-the-board cuts do not automatically outrank these duties.

Restoration is not merely fiscal stabilization. It addresses service quality, deferred maintenance, rights, workforce capacity, vendor dependence, environmental harm, community burden, institutional trust, public records, and democratic choice. Every change has a time bound, review, public reason, dissent record, correction path, and receipt.

## Public contract

The Phase 79 record keeps asset identity, obligation recognition, valuation, lifecycle planning, maintenance funding, procurement, vendor dependence, debt, guarantees, contingent liabilities, insurance, reserves, distribution, future-user tests, stress, restructuring, restoration, and audit decisions independent. It never treats market value as public value, a capital appropriation as whole-life affordability, a contract as public capacity, insurance as risk elimination, a reserve label as funded duty, or present value as intergenerational fairness.

Inspect the empty state. There are no executed Phase 78 compacts, admitted assets, recognized obligations, valuations, lifecycle plans, maintenance funds, procurements, vendor selections, debts, guarantees, contingent liabilities, insurance findings, reserves, sinking funds, decommissioning funds, distributional findings, future-user findings, stress decisions, restructurings, restorations, audits, receipts, scores, rankings, Phase 64 advances, or operating-outcome changes. Future records open only from real dated artifacts and separately authorized human decisions.
`;
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), body, "utf8");
}

const mapDefinitions = [
  ["dependency-map-public-asset-register-is-not-market-valuation", "public-asset-register-is-not-market-valuation", "A Public Asset Register Is Not A Market Valuation", "A dependency path from identity, authority, condition, capability, restrictions, duties, distribution, and uncertainty to any bounded valuation."],
  ["dependency-map-capital-authorization-is-not-lifecycle-affordability", "capital-authorization-is-not-lifecycle-affordability", "Capital Authorization Is Not Lifecycle Affordability", "A dependency path from public need and alternatives through operation, maintenance, renewal, resilience, closure, restoration, and funding."],
  ["dependency-map-procurement-contract-is-not-public-capacity", "procurement-contract-is-not-public-capacity", "A Procurement Contract Is Not Public Capacity", "A dependency path separating award and vendor performance from public knowledge, interoperability, fallback, switching, control, and exit."],
  ["dependency-map-insurance-coverage-is-not-risk-elimination", "insurance-coverage-is-not-risk-elimination", "Insurance Coverage Is Not Risk Elimination", "A dependency path from plausible exposure through policy limits, exclusions, retention, counterparty strength, uninsurable loss, continuity, and remedy."],
  ["dependency-map-reserve-balance-is-not-funded-restoration", "reserve-balance-is-not-funded-restoration", "A Reserve Balance Is Not Funded Restoration", "A dependency path from named duties and verified cost bases through restricted resources, liquidity, stress, replenishment, governance, and closure receipts."],
  ["dependency-map-present-value-is-not-intergenerational-fairness", "present-value-is-not-intergenerational-fairness", "Present Value Is Not Intergenerational Fairness", "A dependency path from time horizons and scenarios through distribution, rights, irreversibility, option value, future users, restoration, and public reason."]
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
    map_question: `What records are required before ${title.toLowerCase()} can move from assertion to a bounded stewardship decision?`,
    interpretation_boundary: "This map is a control path. It does not establish an asset value, obligation, lifecycle plan, procurement, liability, coverage finding, reserve, intergenerational result, receipt, score, rank, or outcome.",
    source_ids: [...new Set(upstream.flatMap((record) => record.source_ids))].slice(0, 8),
    signal_ids: signalIds,
    technology_ids: [],
    local_system_ids: [...new Set(upstream.flatMap((record) => record.local_system_ids))],
    evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-compact", label: "Executed ordinary-authority Phase 78 compact", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 78 compact exists." },
      { id: "node-register", label: "Public asset, obligation, authority, condition, restriction, and counterparty register", node_type: "Constraint", note: "Identity and duty precede valuation." },
      { id: "node-lifecycle", label: "Need, alternatives, whole-life cost, maintenance, renewal, closure, and restoration", node_type: "Constraint", note: "Capital approval is only one lifecycle decision." },
      { id: "node-risk", label: "Procurement, public capacity, debt, guarantee, liability, insurance, and residual risk", node_type: "Constraint", note: "Transfer instruments do not erase public exposure." },
      { id: "node-funding", label: "Reserves, sinking funds, decommissioning, restoration, and stress capacity", node_type: "Constraint", note: "Named duties need dedicated evidence and funding." },
      { id: "node-future", label: "Distribution, future users, option value, irreversibility, and public reason", node_type: "Constraint", note: "Aggregate value does not decide fairness." },
      { id: "node-receipt", label: "Independent audit, dissent, correction, archive, and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 79 receipt exists." }
    ],
    links: [
      { from: "node-compact", to: "node-register", relationship: "Depends On", confidence: "Missing Evidence", note: "A public-wealth register needs authorized scope and duties." },
      { from: "node-register", to: "node-lifecycle", relationship: "Depends On", confidence: "Missing Evidence", note: "Whole-life planning needs admitted assets and obligations." },
      { from: "node-lifecycle", to: "node-risk", relationship: "Depends On", confidence: "Missing Evidence", note: "Procurement and finance must follow an authorized plan." },
      { from: "node-risk", to: "node-funding", relationship: "Depends On", confidence: "Missing Evidence", note: "Recognized exposure determines reserve and funding tests." },
      { from: "node-funding", to: "node-future", relationship: "Depends On", confidence: "Missing Evidence", note: "Distribution requires funded duties and credible scenarios." },
      { from: "node-future", to: "node-receipt", relationship: "Depends On", confidence: "Missing Evidence", note: "Every stewardship finding needs independent review and receipt." }
    ],
    what_this_map_supports: ["Separate asset, obligation, valuation, lifecycle, procurement, liability, funding, distribution, and audit decisions.", "Explicit maintenance, vendor, insurance, reserve, restoration, future-user, and fiscal-stress controls.", "Public receipts without composite public-wealth scoring or project ranking."],
    what_this_map_does_not_prove: ["It does not establish a current asset value, obligation, procurement, liability, reserve, or intergenerational conclusion.", "It does not permit emergency authority, market value, insurance, or present value to replace democratic stewardship decisions.", "It does not create a score, rank, stage advance, or operating-outcome change."],
    next_records_needed: ["A real executed Phase 78 compact with ordinary-authority receipts.", "Verified asset, obligation, condition, lifecycle, vendor, liability, insurance, reserve, distribution, and future-user records.", "Separately authorized stress, restructuring, restoration, audit, and publication decisions with receipts."]
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
  const records = [assetRegisters[index], lifecycleLedgers[index], procurementRiskRegisters[index], intergenerationalLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 79 public-wealth and intergenerational-stewardship boundary")) {
    body = body.trimEnd() + `\n\n## Phase 79 public-wealth and intergenerational-stewardship boundary\n\nThe [Public Wealth And Stewardship Registry](/evidence/stewardship/) assigns ${records.map((record) => `[${Object.values(record).find((value) => typeof value === "string" && /^79-(AOR|LCM|PCR|IBS)-/.test(value))}](/evidence/stewardship/${record.slug}/)`).join(", ")} to this named file. No asset admission, obligation recognition, valuation, lifecycle plan, maintenance funding, procurement, vendor selection, debt, guarantee, contingent liability, insurance finding, reserve, sinking fund, distributional or future-user finding, stress response, restructuring, restoration, audit, receipt, score, rank, or Phase 64 cell change exists.\n`;
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
  const localRecords = assetRegisters.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 79 public-wealth and long-horizon stewardship boundary")) {
    body = body.trimEnd() + `\n\n## Phase 79 public-wealth and long-horizon stewardship boundary\n\nThe [Public Wealth And Stewardship Registry](/evidence/stewardship/) connects ${localRecords.map((record) => record.named_entity).join(" and ")} to asset, obligation, lifecycle-cost, maintenance, procurement, vendor-dependency, liability, insurance, reserve, closure, distribution, future-user, stress, and restoration controls. A local asset, capital budget, contract, insurance policy, or reserve label does not establish public value, whole-life affordability, public capacity, eliminated risk, funded restoration, or intergenerational fairness.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-decision-accountability-desk-001.mdx",
  "briefing-implementation-commitment-ledger-001.mdx",
  "briefing-realized-impact-audit-001.mdx",
  "briefing-institutional-memory-negative-results-001.mdx",
  "briefing-policy-retirement-decommissioning-001.mdx",
  "briefing-fiscal-capacity-contribution-sharing-001.mdx",
  "briefing-emergency-authority-normalization-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 79 public-wealth, lifecycle, and intergenerational control")) {
    body = body.trimEnd() + "\n\n## Phase 79 public-wealth, lifecycle, and intergenerational control\n\nThe [Public Wealth And Stewardship Registry](/evidence/stewardship/) adds eight inactive asset-obligation registers, eight inactive lifecycle-maintenance ledgers, eight inactive procurement and contingent-risk registers, and eight inactive intergenerational balance-sheet ledgers. It preserves asset identity, duties, non-market value, whole-life cost, public options, vendor dependence, debt, guarantees, insurance limits, maintenance, reserves, closure, distribution, future users, fiscal stress, and restoration while creating zero valuations, commitments, liabilities, funds, findings, restructurings, audits, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

await writeJson(join(contentRoot, "updates", "2026-08-24-phase-79-public-wealth-intergenerational-stewardship.json"), {
  id: "update-2026-08-24-phase-79-public-wealth-intergenerational-stewardship",
  effective_date: "2026-08-24",
  entry_type: "Source Refresh",
  title: "Phase 79 adds public-wealth and intergenerational-stewardship controls",
  summary: "Eight inactive asset-obligation registers, eight inactive lifecycle-maintenance ledgers, eight inactive procurement and contingent-risk registers, and eight inactive intergenerational balance-sheet ledgers now expose how public assets, obligations, whole-life cost, vendor dependence, liabilities, insurance, reserves, distribution, future users, fiscal stress, closure, and restoration would be governed. Twelve guides and six maps deepen the content layer without creating a valuation or fiscal finding.",
  affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"],
  related_paths: ["/evidence/stewardship/", ...guideDefinitions.map(([, slug]) => `/briefings/${slug}/`), "/data/public-wealth-intergenerational-stewardship.json"],
  evidence_note: "This release contains empty asset, obligation, lifecycle, maintenance, procurement, dependency, liability, insurance, reserve, distribution, future-user, stress, restructuring, restoration, and audit contracts plus synthetic-only validation. It does not contain an executed Phase 78 compact, valuation, procurement, liability, reserve, intergenerational finding, receipt, score, or ranking.",
  materiality: "No record-state change",
  publication_effect: "Adds twelve Published briefings, six Published dependency maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, compact, emergency, fiscal, asset, obligation, outcome, and operating states unchanged.",
  next_check_date: "2026-09-01",
  work_package: "docs/work-packages/phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet.md"
});

console.log(`Phase 79 content built: ${assetRegisters.length} inactive asset-obligation registers, ${lifecycleLedgers.length} inactive lifecycle-maintenance ledgers, ${procurementRiskRegisters.length} inactive procurement-risk registers, ${intergenerationalLedgers.length} inactive intergenerational ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 public-wealth or fiscal outcomes.`);
