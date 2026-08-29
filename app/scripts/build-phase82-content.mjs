import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase81 = await readJson(join(dataRoot, "phase-81-universal-service-essential-systems-public-option-delivery-registry.json"));
const upstream = phase81.rights_quality_step_in_restoration_ledgers;
const shortName = (record) => record.slug.replace(/^81-rqr-\d+-/, "");
const inactiveChecks = (gates, basis) => gates.map((gate) => ({ ...gate, decision_state: "Inactive", basis }));
const makeTaxonomy = (prefix, labels, idKey) => labels.map((label, index) => ({ [idKey]: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));

const capabilityGates = [
  ["82-HCD-01-UPSTREAM", "Verified Phase 81 service-floor, affordability, provider, continuity, rights, quality, restoration, review, and receipt chain"],
  ["82-HCD-02-AUTHORITY", "Lawful household-support, care, housing, health, education, mobility, income, and service authority"],
  ["82-HCD-03-HOUSEHOLD", "Household, family, individual, dependent, caregiver, kinship, and shared-living identity boundary"],
  ["82-HCD-04-CAPABILITY", "Named capability, essential function, protected minimum, affected public, and success boundary"],
  ["82-HCD-05-BASELINE", "Current resources, services, health, housing, time, care, mobility, digital, and administrative baseline"],
  ["82-HCD-06-BUNDLE", "Housing, food, energy, water, transport, health, care, education, digital, identity, and income bundle"],
  ["82-HCD-07-QUALITY", "Adequacy, safety, accessibility, dignity, reliability, cultural fit, privacy, and continuity"],
  ["82-HCD-08-TIME", "Paid work, care, travel, waiting, administration, recovery, sleep, learning, and discretionary time"],
  ["82-HCD-09-CARE", "Child, elder, disability, health, kinship, respite, palliative, and emergency care need"],
  ["82-HCD-10-INCOME", "Income, benefits, wealth, savings, volatility, taxes, debt, arrears, and essential expenditure"],
  ["82-HCD-11-ACCESS", "Distance, schedule, transport, language, disability, documentation, equipment, trust, and support"],
  ["82-HCD-12-HOME", "Housing security, habitability, accessibility, tenure, crowding, location, displacement, and utilities"],
  ["82-HCD-13-LIFECOURSE", "Birth, childhood, education, work, parenthood, disability, aging, bereavement, and migration transitions"],
  ["82-HCD-14-DISTRIBUTE", "Income, race, gender, disability, age, place, tenure, family form, and intergenerational distribution"],
  ["82-HCD-15-OPTIONS", "Direct service, cash, in-kind, public option, cooperative, community, workplace, and informal-support options"],
  ["82-HCD-16-FUNDING", "Durable capital, operating, workforce, access, emergency, transition, maintenance, and remedy funding"],
  ["82-HCD-17-RIGHTS", "Eligibility, privacy, autonomy, family integrity, accessibility, notice, appeal, remedy, and representation"],
  ["82-HCD-18-REVIEW", "Independent capability, care, rights, distribution, fiscal, accessibility, and future-household review"],
  ["82-HCD-19-DECISION", "Separate human floor decision with conditions, expiry, appeal, amendment, and no automatic targeting"],
  ["82-HCD-20-RECEIPT", "Baseline, floor, dissent, condition, correction, notice, archive, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const careGates = [
  ["82-CWL-01-FLOOR", "Adopted household-capability floor, service bundle, affected public, funding, review, and receipts"],
  ["82-CWL-02-NEED", "Care need by function, intensity, schedule, duration, location, continuity, and preferred setting"],
  ["82-CWL-03-UNPAID", "Unpaid and informal care volume, time, opportunity cost, health, income, and continuity"],
  ["82-CWL-04-SERVICE", "Home, community, school, workplace, clinic, residential, respite, and emergency care service"],
  ["82-CWL-05-FACILITY", "Facility, home modification, transport, digital, equipment, food, energy, and public-realm infrastructure"],
  ["82-CWL-06-CAPACITY", "Licensed places, staffed hours, caseload, wait list, reserve, surge, geography, and accessible capacity"],
  ["82-CWL-07-WORKFORCE", "Occupation, skill, credential, language, schedule, wage, benefit, safety, retention, and progression"],
  ["82-CWL-08-PROVIDER", "Public, Indigenous, cooperative, community, nonprofit, regulated, private, and informal provider roles"],
  ["82-CWL-09-QUALITY", "Relationship continuity, safeguarding, autonomy, outcomes, complaints, inspection, and improvement"],
  ["82-CWL-10-ACCESS", "Eligibility, assessment, navigation, matching, wait, schedule, transport, language, and accommodation"],
  ["82-CWL-11-AFFORD", "Fees, copayments, lost income, travel, equipment, administration, debt, and hardship protection"],
  ["82-CWL-12-COORDINATE", "Care plan, lead worker, consent, records, referrals, handoffs, family voice, and conflict resolution"],
  ["82-CWL-13-RESPITE", "Planned respite, emergency replacement, caregiver health, leave, income, training, and peer support"],
  ["82-CWL-14-CONTINUITY", "Provider exit, worker absence, disaster, migration, transition, substitute, and restoration"],
  ["82-CWL-15-RIGHTS", "Supported decision-making, dignity, privacy, family integrity, safeguarding, complaint, appeal, and remedy"],
  ["82-CWL-16-FUNDING", "Capital, operating, wage, training, respite, access, continuity, quality, and long-term funding"],
  ["82-CWL-17-TRIGGER", "Wait, vacancy, turnover, unsafe care, exclusion, burnout, closure, or continuity-failure threshold"],
  ["82-CWL-18-REVIEW", "Independent need, capacity, workforce, provider, quality, rights, distribution, and funding review"],
  ["82-CWL-19-DECISION", "Separate human capacity, workforce, provider, funding, or safeguard decision"],
  ["82-CWL-20-RECEIPT", "Need, capacity, workforce, quality, continuity, correction, appeal, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const burdenGates = [
  ["82-HBR-01-UPSTREAM", "Adopted capability floor plus verified care need, capacity, workforce, continuity, and receipts"],
  ["82-HBR-02-RESOURCE", "Income, benefits, wealth, savings, credit, insurance, informal support, and in-kind resources"],
  ["82-HBR-03-EXPENSE", "Housing, food, utilities, transport, care, health, education, digital, tax, fee, and debt expense"],
  ["82-HBR-04-TIME", "Paid work, care, travel, queue, administration, coordination, recovery, and sleep time"],
  ["82-HBR-05-VOLATILITY", "Income, hours, prices, rates, rent, health, care, climate, household, and service volatility"],
  ["82-HBR-06-DEBT", "Principal, interest, fee, security, collection, credit reporting, refinancing, and residual exposure"],
  ["82-HBR-07-ARREARS", "Missed payment, grace, penalty, disconnection, eviction, repossession, cure, and reinstatement"],
  ["82-HBR-08-ADMIN", "Discovery, eligibility, documents, forms, appointments, verification, renewal, error, and appeal burden"],
  ["82-HBR-09-ACCESS", "Language, disability, literacy, digital, identity, bank, transport, schedule, and trust barrier"],
  ["82-HBR-10-TAKEUP", "Eligible, aware, applied, completed, approved, received, retained, denied, abandoned, and corrected"],
  ["82-HBR-11-SHOCK", "Job loss, illness, disability, death, separation, migration, disaster, outage, price, and care shock"],
  ["82-HBR-12-STABILIZE", "Cash, benefit, bill relief, debt pause, housing protection, food, care, transport, and legal support"],
  ["82-HBR-13-AUTOMATE", "Automated eligibility, matching, payment, risk, fraud, error, explanation, human review, and audit"],
  ["82-HBR-14-INTERACT", "Benefit cliff, tax, subsidy, debt, employment, care, housing, and service interaction"],
  ["82-HBR-15-DISAGG", "Income, wealth, race, gender, disability, age, place, household form, and tenure distribution"],
  ["82-HBR-16-SCENARIO", "Price, income, interest, rent, care, climate, service, policy, and household-change scenarios"],
  ["82-HBR-17-TRIGGER", "Material hardship, time poverty, arrears, debt spiral, exclusion, displacement, or health threshold"],
  ["82-HBR-18-REMEDY", "Correction, expedited payment, reconnection, debt repair, refund, compensation, and restitution"],
  ["82-HBR-19-PRIVACY", "Data minimization, consent, purpose, sharing, retention, security, explanation, and contestability"],
  ["82-HBR-20-REVIEW", "Independent resource, burden, shock, take-up, automation, distribution, and rights review"],
  ["82-HBR-21-DECISION", "Separate human protection, relief, debt, access, automation, or remedy decision"],
  ["82-HBR-22-RECEIPT", "Resource, burden, shock, decision, error, correction, appeal, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const recoveryGates = [
  ["82-NCR-01-UPSTREAM", "Verified capability, care, household-resource, time, debt, burden, access, and remedy baseline"],
  ["82-NCR-02-NEIGHBOR", "Home, destination, service, route, schedule, terrain, safety, accessibility, and social context"],
  ["82-NCR-03-PROXIMITY", "Travel time, distance, transfer, cost, wait, frequency, opening hours, and seasonal reach"],
  ["82-NCR-04-RURAL", "Rural, remote, northern, island, Indigenous, dispersed, mobile, and cross-border service model"],
  ["82-NCR-05-ACCESS", "Mobility, disability, caregiver, child, elder, language, digital, weather, and safety access"],
  ["82-NCR-06-SOCIAL", "Isolation, belonging, support network, public realm, library, school, care, faith, and civic infrastructure"],
  ["82-NCR-07-DISPLACE", "Eviction, foreclosure, rent pressure, redevelopment, disaster, conflict, contamination, and service loss"],
  ["82-NCR-08-MOBILITY", "Choice, coercion, moving cost, accessible housing, employment, care, school, benefits, and records continuity"],
  ["82-NCR-09-STAY", "Right-to-return, anti-displacement, repair, retrofit, rent, tax, utility, legal, and community stabilization"],
  ["82-NCR-10-CRISIS", "Household crisis, hazard, service failure, violence, health, care, income, housing, and safety trigger"],
  ["82-NCR-11-RESPONSE", "Accessible intake, immediate safety, shelter, cash, food, care, transport, health, legal, and navigation"],
  ["82-NCR-12-CONTINUITY", "Medication, equipment, caregiver, school, work, benefits, identity, communication, and companion continuity"],
  ["82-NCR-13-RECOVERY", "Stable housing, income, debt, care, health, education, mobility, social connection, and service restoration"],
  ["82-NCR-14-DURATION", "Immediate, short, medium, long, recurring, chronic, and intergenerational recovery horizon"],
  ["82-NCR-15-DISTRIBUTE", "Place, income, race, gender, disability, age, tenure, family form, and future-household effect"],
  ["82-NCR-16-OPTIONS", "Repair in place, temporary support, relocation, return, public acquisition, community ownership, and no-action"],
  ["82-NCR-17-TRIGGER", "Service desert, isolation, displacement, repeated crisis, failed recovery, or intergenerational-harm threshold"],
  ["82-NCR-18-CORRECT", "Case remedy, systemic correction, restitution, infrastructure repair, capacity addition, and policy revision"],
  ["82-NCR-19-LEARN", "Longitudinal learning without surveillance, deficit labeling, survivor bias, or automatic targeting"],
  ["82-NCR-20-AUDIT", "Independent access, displacement, crisis, recovery, distribution, privacy, and future-household audit"],
  ["82-NCR-21-DECISION", "Separate human stabilization, relocation, return, recovery, correction, or renewal decision"],
  ["82-NCR-22-RECEIPT", "Access, displacement, response, recovery, remedy, correction, archive, and propagation receipt"]
].map(([gate_id, label]) => ({ gate_id, label }));

const capabilityDimensions = makeTaxonomy("82-CAP", ["Safe and stable housing", "Food and nutrition", "Water, sanitation, and environmental health", "Energy, heating, cooling, and household utilities", "Mobility and reachable destinations", "Physical and mental health", "Childcare, eldercare, disability, and family support", "Education, learning, and information", "Digital, communications, identity, and administrative access", "Income, savings, credit, insurance, and material security", "Personal safety, autonomy, privacy, and due process", "Time, rest, care balance, and participation", "Social connection, community, culture, and belonging", "Resilience, recovery, life-course transition, and future opportunity"], "household_capability_dimension_id");
const bundleClasses = makeTaxonomy("82-BND", ["Housing and household utilities", "Food and essential goods", "Health, medicines, and public health", "Childcare, education, and youth support", "Eldercare, disability support, and home care", "Mobility, paratransit, and essential travel", "Digital, phone, device, and public information", "Income, benefits, tax, identity, and payments", "Legal, navigation, complaint, appeal, and remedy", "Safety, shelter, crisis, and emergency support", "Community, culture, recreation, library, and public realm", "Repair, maintenance, adaptation, relocation, and recovery"], "household_service_bundle_class_id");
const lifeCourseStages = makeTaxonomy("82-LCS", ["Pregnancy, birth, and early childhood", "School age and dependent care", "Youth transition and postsecondary entry", "Entry to work and independent living", "Partnership, household formation, and parenthood", "Caregiving onset and sandwich-care years", "Job loss, income shock, and retraining", "Illness, injury, disability, and recovery", "Migration, settlement, displacement, and return", "Separation, family change, and bereavement", "Retirement, aging, and increasing support", "End of life, survivor transition, and intergenerational transfer"], "life_course_stage_id");
const careClasses = makeTaxonomy("82-CRS", ["Prenatal, birth, and postpartum support", "Infant and early-childhood care", "School-age and out-of-school care", "Youth, transition, and family support", "Disability personal assistance and independent living", "Home care and community health support", "Eldercare, dementia, and aging-in-place support", "Respite and caregiver replacement", "Mental-health, substance-use, and peer support", "Palliative, hospice, and end-of-life care", "Emergency, disaster, evacuation, and shelter care", "Kinship, foster, reunification, and family preservation", "Culturally grounded and Indigenous care", "Integrated navigation, coordination, and supported decision-making"], "care_service_class_id");
const careCapacityDimensions = makeTaxonomy("82-CCD", ["Assessed need and eligible population", "Licensed and accessible places", "Staffed service hours and schedules", "Workforce supply, skill mix, and supervision", "Wait list, queue, matching, and unmet need", "Geographic and transport reach", "Home, facility, equipment, and digital infrastructure", "Provider plurality and public-option capacity", "Quality, safeguarding, complaint, and remedy", "Respite, reserve, surge, and emergency continuity", "Capital, operating, wage, and training funding", "Data, coordination, learning, and long-horizon renewal"], "care_capacity_dimension_id");
const workforceSafeguards = makeTaxonomy("82-CWS", ["Living wage and predictable income", "Benefits, leave, pension, and income continuity", "Safe staffing, workload, and caseload", "Health, safety, violence prevention, and injury support", "Stable schedule and work-time control", "Training, credential, recognition, and progression", "Collective voice, bargaining, and worker representation", "Accessibility, accommodation, and anti-discrimination", "Immigration, status, recruitment-fee, and coercion protection", "Continuity, retention, succession, and emergency reserve", "Relationship-based care and worker-recipient matching", "Correction, whistleblowing, complaint, remedy, and public reporting"], "care_workforce_safeguard_id");
const burdenDimensions = makeTaxonomy("82-HBD", ["Housing cost and tenure risk", "Food cost and nutritional adequacy", "Energy, water, communications, and utility cost", "Transport and essential-trip cost", "Care fees and unpaid-care time", "Health, medicine, equipment, and disability cost", "Education, device, and learning cost", "Tax, fee, benefit, and administrative cost", "Debt service, interest, penalty, and collection", "Income volatility and work-hour uncertainty", "Travel, waiting, coordination, and form-filling time", "Sleep, recovery, health, and opportunity cost", "Digital, language, identity, and accessibility burden", "Cumulative burden, benefit cliffs, and distribution"], "household_burden_dimension_id");
const shockPathways = makeTaxonomy("82-SAP", ["Income loss and work-hour reduction", "Rent, mortgage, tax, or housing-cost shock", "Food, energy, transport, or utility price shock", "Interest-rate, debt, fee, or credit shock", "Illness, injury, disability, or medicine shock", "Care need, provider loss, or caregiver burnout", "Separation, death, household change, or family violence", "Eviction, foreclosure, displacement, or homelessness", "Disaster, climate, outage, contamination, or evacuation", "Benefit interruption, administrative error, or identity loss", "Migration, legal-status, or cross-jurisdiction transition", "Repeated, overlapping, chronic, or intergenerational shock"], "shock_arrears_pathway_id");
const adminSafeguards = makeTaxonomy("82-ABS", ["Proactive notice and plain-language eligibility", "Automatic or assisted enrollment", "Once-only data and document alternatives", "Accessible, multilingual, in-person, phone, and offline channels", "Reasonable deadlines, grace, and good-cause extensions", "Presumption, continuity, and interim support", "Error detection, correction, and back payment", "Human review and explainable automated action", "Independent appeal and representation", "Privacy, minimization, security, and purpose limitation", "No-retaliation complaint and systemic remedy", "Burden, take-up, denial, error, appeal, and distribution audit"], "administrative_burden_safeguard_id");
const proximityTests = makeTaxonomy("82-NAT", ["Door-to-service travel time", "Accessible route and vehicle", "Transfer, wait, and schedule compatibility", "Opening hours and care-work coordination", "Trip cost and payment access", "Weather, terrain, lighting, and personal safety", "Language, literacy, information, and navigation", "Digital and non-digital service choice", "Rural, remote, mobile, and seasonal reach", "Caregiver, child, elder, and companion travel", "Service quality and capacity at destination", "Return trip, follow-up, continuity, and fallback"], "neighborhood_access_test_id");
const displacementSafeguards = makeTaxonomy("82-DMS", ["Early warning, notice, standing, and legal support", "Eviction, foreclosure, rent, tax, and utility protection", "Repair, accessibility, habitability, and right to remain", "Temporary accommodation and service continuity", "Moving, storage, transport, and transition support", "Accessible and affordable replacement housing", "School, care, health, work, benefit, and community continuity", "Tenant, Indigenous, cultural, and collective rights", "Right to return and non-discriminatory allocation", "Anti-speculation, community ownership, and public acquisition", "Compensation, restitution, remedy, and appeal", "Longitudinal displacement, return, recovery, and distribution audit"], "displacement_mobility_safeguard_id");
const crisisStabilizers = makeTaxonomy("82-CST", ["Accessible single-entry crisis intake", "Immediate personal safety and safeguarding", "Emergency shelter and housing stabilization", "Cash, income, benefit, and payment continuity", "Food, water, energy, communications, and essential goods", "Health, medicines, disability equipment, and mental-health support", "Child, elder, disability, caregiver, and companion continuity", "Accessible transport, evacuation, and return", "Identity, records, phone, digital, banking, and legal support", "Debt, arrears, eviction, disconnection, and collection pause", "Named navigator, case coordination, consent, and handoffs", "Recovery plan, follow-up, remedy, closure, and recurrence prevention"], "crisis_stabilizer_id");
const securityTests = makeTaxonomy("82-LHS", ["Stable adequate housing", "Reliable essential-service bundle", "Adequate income and material buffer", "Manageable debt and arrears", "Balanced paid work, care, travel, and rest time", "Accessible quality care and caregiver continuity", "Reachable health, education, work, food, and community destinations", "Rights, privacy, autonomy, appeal, and remedy", "Social connection, belonging, safety, and civic participation", "Shock absorption, crisis stabilization, and recovery", "Life-course mobility without coerced displacement", "Fair distribution across current and future households"], "long_horizon_household_security_test_id");

const capabilityDossiers = upstream.map((source, index) => {
  const n = String(index + 1).padStart(3, "0");
  return {
    household_capability_service_bundle_dossier_id: `82-HCD-${n}`, slug: `82-hcd-${n}-${shortName(source)}`, record_kind: "household_capability_service_bundle_dossier", record_status: "Published", capability_state: "Inactive - No Verified Phase 81 Universal-Service Record", adoption_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, rights_quality_step_in_restoration_ledger_id: source.rights_quality_step_in_restoration_ledger_id,
    capability_checks: inactiveChecks(capabilityGates, "No Phase 81 chain contains an adopted service floor, verified affordability and access findings, executable provider and public-option model, tested continuity, adopted rights, measured quality, bounded intervention and restoration rules, independent review, and receipts."),
    household_capability_dimension_records: capabilityDimensions.map((item) => ({ ...item, capability_state: "Not Assessed", baseline_ids: [], threshold_ids: [], finding_id: null })),
    household_service_bundle_class_records: bundleClasses.map((item) => ({ ...item, bundle_state: "Unassigned", service_ids: [], owner_ids: [], funding_ids: [] })),
    life_course_stage_records: lifeCourseStages.map((item) => ({ ...item, stage_state: "Unassessed", population_ids: [], transition_ids: [], evidence_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    verified_phase81_service_records: [], authority_records: [], household_identity_records: [], capability_floor_records: [], baseline_records: [], service_bundle_records: [], quality_records: [], time_use_records: [], care_need_records: [], resource_records: [], access_records: [], housing_records: [], life_course_transition_records: [], distribution_records: [], option_records: [], funding_records: [], rights_records: [], first_reviewer_id: null, second_reviewer_id: null, capability_receipt_id: null, propagation_status: "not_started",
    household_type_as_need_allowed: false, service_eligibility_as_capability_allowed: false, aggregate_income_as_security_allowed: false, automatic_household_classification_allowed: false, automatic_floor_adoption_allowed: false, automatic_targeting_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const careLedgers = capabilityDossiers.map((dossier, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    care_infrastructure_workforce_capacity_ledger_id: `82-CWL-${n}`, slug: `82-cwl-${n}-${shortName(source)}`, record_kind: "care_infrastructure_workforce_capacity_ledger", record_status: "Published", care_state: "Inactive - No Adopted Household-Capability Floor", capacity_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, household_capability_service_bundle_dossier_id: dossier.household_capability_service_bundle_dossier_id, rights_quality_step_in_restoration_ledger_id: dossier.rights_quality_step_in_restoration_ledger_id,
    care_capacity_checks: inactiveChecks(careGates, "No adopted Phase 82 household-capability floor, service bundle, care-need baseline, affected-public record, funding authority, review, or receipt exists."),
    care_service_class_records: careClasses.map((item) => ({ ...item, service_state: "Unassessed", need_ids: [], provider_ids: [], capacity_ids: [] })),
    care_capacity_dimension_records: careCapacityDimensions.map((item) => ({ ...item, capacity_state: "Not Measured", baseline_ids: [], gap_ids: [], finding_id: null })),
    care_workforce_safeguard_records: workforceSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified", workforce_ids: [], owner_ids: [], receipt_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    assessed_need_records: [], unpaid_care_records: [], service_records: [], facility_and_home_records: [], capacity_records: [], workforce_records: [], provider_records: [], quality_records: [], access_records: [], affordability_records: [], coordination_records: [], respite_records: [], continuity_records: [], rights_records: [], funding_records: [], trigger_records: [], first_reviewer_id: null, second_reviewer_id: null, care_capacity_receipt_id: null, propagation_status: "not_started",
    unpaid_care_as_free_capacity_allowed: false, licensed_place_as_available_care_allowed: false, vacancy_rate_as_workforce_capacity_allowed: false, automatic_capacity_finding_allowed: false, automatic_provider_selection_allowed: false, automatic_workforce_allocation_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const burdenRegisters = careLedgers.map((ledger, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    household_affordability_time_debt_administrative_burden_register_id: `82-HBR-${n}`, slug: `82-hbr-${n}-${shortName(source)}`, record_kind: "household_affordability_time_debt_administrative_burden_register", record_status: "Published", burden_state: "Inactive - No Verified Care-Capacity Record", protection_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, care_infrastructure_workforce_capacity_ledger_id: ledger.care_infrastructure_workforce_capacity_ledger_id, household_capability_service_bundle_dossier_id: ledger.household_capability_service_bundle_dossier_id,
    household_burden_checks: inactiveChecks(burdenGates, "No verified Phase 82 care-need, capacity, workforce, provider, quality, access, affordability, continuity, rights, or funding record exists."),
    household_burden_dimension_records: burdenDimensions.map((item) => ({ ...item, burden_state: "Not Measured", resource_ids: [], expense_ids: [], observation_ids: [] })),
    shock_arrears_pathway_records: shockPathways.map((item) => ({ ...item, pathway_state: "Dormant", event_ids: [], protection_ids: [], remedy_ids: [] })),
    administrative_burden_safeguard_records: adminSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified", program_ids: [], owner_ids: [], evidence_ids: [] })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    resource_records: [], expense_records: [], time_burden_records: [], volatility_records: [], debt_records: [], arrears_records: [], administrative_burden_records: [], access_barrier_records: [], take_up_records: [], shock_records: [], stabilization_records: [], automated_decision_records: [], interaction_records: [], distribution_records: [], scenario_records: [], trigger_records: [], remedy_records: [], privacy_records: [], first_reviewer_id: null, second_reviewer_id: null, burden_receipt_id: null, propagation_status: "not_started",
    low_monthly_bill_as_affordability_allowed: false, program_eligibility_as_benefit_access_allowed: false, informal_support_as_household_resilience_allowed: false, automatic_risk_score_allowed: false, automatic_benefit_denial_allowed: false, automatic_debt_action_allowed: false, automatic_targeting_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const recoveryLedgers = burdenRegisters.map((register, index) => {
  const source = upstream[index]; const n = String(index + 1).padStart(3, "0");
  return {
    neighborhood_access_displacement_crisis_recovery_ledger_id: `82-NCR-${n}`, slug: `82-ncr-${n}-${shortName(source)}`, record_kind: "neighborhood_access_displacement_crisis_recovery_ledger", record_status: "Published", recovery_state: "Inactive - No Verified Household-Burden Baseline", recovery_decision: "Not Open",
    cohort_id: source.cohort_id, file_id: source.file_id, named_entity: source.named_entity, household_affordability_time_debt_administrative_burden_register_id: register.household_affordability_time_debt_administrative_burden_register_id, care_infrastructure_workforce_capacity_ledger_id: register.care_infrastructure_workforce_capacity_ledger_id, household_capability_service_bundle_dossier_id: register.household_capability_service_bundle_dossier_id,
    neighborhood_recovery_checks: inactiveChecks(recoveryGates, "No verified Phase 82 household-resource, time-use, debt, arrears, administrative-burden, shock, stabilization, distribution, privacy, or remedy baseline exists."),
    neighborhood_access_test_records: proximityTests.map((item) => ({ ...item, test_state: "Not Tested", origin_ids: [], destination_ids: [], finding_id: null })),
    displacement_mobility_safeguard_records: displacementSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified", affected_household_ids: [], owner_ids: [], remedy_ids: [] })),
    crisis_stabilizer_records: crisisStabilizers.map((item) => ({ ...item, stabilizer_state: "Unassigned", trigger_ids: [], capacity_ids: [], receipt_ids: [] })),
    long_horizon_household_security_test_records: securityTests.map((item) => ({ ...item, test_state: "Not Tested", baseline_ids: [], outcome_ids: [], finding_id: null })),
    source_ids: source.source_ids, signal_ids: source.signal_ids, evidence_gap_ids: source.evidence_gap_ids, canonical_briefing_id: source.canonical_briefing_id, reader_pathway_ids: source.reader_pathway_ids, local_system_ids: source.local_system_ids,
    neighborhood_records: [], proximity_records: [], rural_access_records: [], accessibility_records: [], social_infrastructure_records: [], displacement_records: [], household_mobility_records: [], right_to_remain_records: [], crisis_event_records: [], response_records: [], continuity_records: [], recovery_records: [], duration_records: [], distribution_records: [], option_records: [], trigger_records: [], corrective_action_records: [], learning_records: [], independent_audit_records: [], first_reviewer_id: null, second_reviewer_id: null, recovery_receipt_id: null, propagation_status: "not_started",
    proximity_as_access_allowed: false, temporary_relief_as_recovery_allowed: false, relocation_as_remedy_allowed: false, automatic_displacement_finding_allowed: false, automatic_relocation_allowed: false, automatic_recovery_finding_allowed: false, automatic_targeting_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0", phase: "82", registry_id: "household-capability-care-infrastructure-everyday-security-registry-001", title: "Household Capability, Care Infrastructure And Everyday Security Registry", captured_date: "2026-08-24", as_of_date: "2026-08-24",
  scope: "Eight inactive household-capability and service-bundle dossiers, eight inactive care-infrastructure and workforce ledgers, eight inactive affordability-time-debt-administrative-burden registers, and eight inactive neighborhood-access-displacement-crisis-recovery ledgers downstream of Phase 81.",
  interpretation_boundary: "Service availability is not household capability. Unpaid care is not free capacity. Program eligibility is not benefit access. A low monthly bill is not household affordability. Neighborhood proximity is not accessibility. Temporary relief is not household recovery.",
  activation_rule: "At least one Phase 81 chain must contain an adopted essential-service floor, lawful eligibility and access duties, verified affordability and coverage, authorized subsidies, an executable provider and public-option model, verified interoperability and continuity, adopted rights and remedies, measured quality, tested provider-failure and step-in readiness, bounded rationing and restoration rules, independent review, and receipts. Every Phase 82 floor, care-capacity finding, workforce safeguard, household-burden finding, stabilization, displacement finding, recovery finding, and receipt requires a separate human decision.",
  capability_gates: capabilityGates, care_capacity_gates: careGates, household_burden_gates: burdenGates, neighborhood_recovery_gates: recoveryGates,
  household_capability_dimensions: capabilityDimensions, household_service_bundle_classes: bundleClasses, life_course_stages: lifeCourseStages, care_service_classes: careClasses, care_capacity_dimensions: careCapacityDimensions, care_workforce_safeguards: workforceSafeguards, household_burden_dimensions: burdenDimensions, shock_arrears_pathways: shockPathways, administrative_burden_safeguards: adminSafeguards, neighborhood_access_tests: proximityTests, displacement_mobility_safeguards: displacementSafeguards, crisis_stabilizers: crisisStabilizers, long_horizon_household_security_tests: securityTests,
  capability_states: ["Inactive - No Verified Phase 81 Universal-Service Record", "Scoping", "Under Review", "Held", "Adopted With Conditions", "Denied", "Corrected", "Withdrawn"],
  care_states: ["Inactive - No Adopted Household-Capability Floor", "Need Review", "Capacity Review", "Workforce Review", "Held", "Authorized With Conditions", "Correcting", "Closed"],
  burden_states: ["Inactive - No Verified Care-Capacity Record", "Resource Review", "Burden Review", "Shock Review", "Held", "Protected With Conditions", "Correcting", "Closed"],
  recovery_states: ["Inactive - No Verified Household-Burden Baseline", "Access Review", "Displacement Review", "Crisis Review", "Held", "Stabilizing With Conditions", "Recovering", "Correcting", "Archived"],
  metrics: {
    household_capability_service_bundle_dossiers: capabilityDossiers.length, care_infrastructure_workforce_capacity_ledgers: careLedgers.length, household_affordability_time_debt_administrative_burden_registers: burdenRegisters.length, neighborhood_access_displacement_crisis_recovery_ledgers: recoveryLedgers.length,
    capability_gates: capabilityGates.length, care_capacity_gates: careGates.length, household_burden_gates: burdenGates.length, neighborhood_recovery_gates: recoveryGates.length,
    household_capability_dimensions: capabilityDimensions.length, household_service_bundle_classes: bundleClasses.length, life_course_stages: lifeCourseStages.length, care_service_classes: careClasses.length, care_capacity_dimensions: careCapacityDimensions.length, care_workforce_safeguards: workforceSafeguards.length, household_burden_dimensions: burdenDimensions.length, shock_arrears_pathways: shockPathways.length, administrative_burden_safeguards: adminSafeguards.length, neighborhood_access_tests: proximityTests.length, displacement_mobility_safeguards: displacementSafeguards.length, crisis_stabilizers: crisisStabilizers.length, long_horizon_household_security_tests: securityTests.length,
    verified_phase81_service_records_received: 0, household_capability_floors_adopted: 0, service_bundles_assigned: 0, care_needs_assessed: 0, care_capacity_findings_issued: 0, workforce_safeguards_verified: 0, provider_decisions_issued: 0, household_burden_findings_issued: 0, debt_or_arrears_protections_authorized: 0, administrative_burden_findings_issued: 0, stabilization_decisions_issued: 0, neighborhood_access_findings_issued: 0, displacement_findings_issued: 0, relocation_or_return_decisions: 0, crisis_responses_authorized: 0, recovery_findings_issued: 0, remedies_issued: 0, independent_reviews_completed: 0, receipts_created: 0, scores_created: 0, rankings_created: 0, phase64_cells_advanced: 0
  },
  household_capability_service_bundle_dossiers: capabilityDossiers, care_infrastructure_workforce_capacity_ledgers: careLedgers, household_affordability_time_debt_administrative_burden_registers: burdenRegisters, neighborhood_access_displacement_crisis_recovery_ledgers: recoveryLedgers
};
await writeJson(join(dataRoot, "phase-82-household-capability-care-infrastructure-everyday-security-registry.json"), registry);

const guideDefinitions = [
  ["briefing-household-capability-doctrine-001", "household-capability-doctrine-001", "Household Capability Doctrine 001: Measure What People Can Reliably Do", "A doctrine for household capability floors, essential service bundles, autonomy, time, care, resources, access, rights, transitions, and durable security."],
  ["briefing-time-poverty-unpaid-care-001", "time-poverty-unpaid-care-001", "Time Poverty And Unpaid Care 001: Informal Support Is Not Free Capacity", "A method for paid work, care, travel, waiting, administration, rest, opportunity cost, caregiver health, replacement capacity, and distribution."],
  ["briefing-care-infrastructure-workforce-001", "care-infrastructure-workforce-001", "Care Infrastructure And Workforce 001: Places Are Not Staffed Care", "A capacity framework for need, accessible places, staffed hours, occupations, job quality, providers, coordination, respite, continuity, quality, and funding."],
  ["briefing-essential-service-bundles-households-001", "essential-service-bundles-households-001", "Essential-Service Bundles For Households 001: Services Interact", "A household-level guide to housing, utilities, food, mobility, health, care, education, digital access, income, administration, safety, and recovery."],
  ["briefing-neighborhood-proximity-rural-access-001", "neighborhood-proximity-rural-access-001", "Neighborhood Proximity And Rural Access 001: Nearby Is Not Reachable", "An access method for door-to-service time, schedules, transfers, cost, disability, safety, care trips, rural models, destination capacity, and fallback."],
  ["briefing-household-affordability-arrears-debt-001", "household-affordability-arrears-debt-001", "Household Affordability, Arrears And Debt 001: A Low Bill Can Still Produce Hardship", "A framework for resources, essential expenses, time, volatility, debt, penalties, disconnection, eviction, benefit cliffs, shocks, protections, and restitution."],
  ["briefing-administrative-burden-benefit-access-001", "administrative-burden-benefit-access-001", "Administrative Burden And Benefit Access 001: Eligibility Is Not Receipt", "A method for discovery, forms, documents, appointments, verification, renewal, error, automated decisions, human review, take-up, appeal, and back payment."],
  ["briefing-disability-universal-design-home-community-001", "disability-universal-design-home-community-001", "Disability, Universal Design And Home-Community Access 001: Accommodation Is Infrastructure", "A guide to accessible housing, mobility, care, communication, equipment, personal assistance, supported decisions, service continuity, and remedy."],
  ["briefing-life-course-transitions-household-security-001", "life-course-transitions-household-security-001", "Life-Course Transitions And Household Security 001: Needs Change Before Systems Do", "A transition framework from birth and education through work, caregiving, disability, migration, family change, aging, bereavement, and survivor continuity."],
  ["briefing-displacement-household-mobility-001", "displacement-household-mobility-001", "Displacement And Household Mobility 001: Relocation Is Not Remedy", "A rights framework for notice, prevention, repair, temporary support, replacement housing, service continuity, right to return, community ownership, and restitution."],
  ["briefing-crisis-stabilization-recovery-001", "crisis-stabilization-recovery-001", "Crisis Stabilization And Recovery 001: Temporary Relief Is Not Recovery", "An operating guide for accessible intake, immediate safety, shelter, cash, food, health, care, mobility, identity, debt protection, navigation, follow-up, and recurrence prevention."],
  ["briefing-long-horizon-household-security-001", "long-horizon-household-security-001", "Long-Horizon Household Security 001: Recovery Must Survive The Next Shock", "A review framework for housing, services, income buffers, debt, time, care, access, rights, belonging, resilience, mobility, and intergenerational distribution."]
];
const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const yamlList = (values) => values.map((value) => `  - "${value}"`).join("\n");
const sharedBody = `
## Start with capability, not household type

Household capability asks what people can reliably be and do with dignity, autonomy, safety, accessibility, and real choice. It begins with named functions: remaining safely housed, eating adequately, maintaining health, reaching essential destinations, giving and receiving care, learning, communicating, completing public administration, sustaining relationships, recovering from shocks, and planning a future. A demographic label, income bracket, program category, or service offer does not establish capability.

The record defines the household boundary without assuming one form. It can include individuals living alone, multigenerational families, kinship households, shared and cooperative living, people moving between homes, separated families, caregivers and dependents in different places, institutional or supported settings, and people without stable housing. Individual rights remain visible within a household record; household aggregation cannot erase disability, gender, age, income control, safety, or unequal care burdens.

A capability floor names the protected minimum, affected public, time horizon, evidence, uncertainty, authority, funding, owner, standard, exception, appeal, remedy, and review. It records the no-action baseline and the interaction among services. No composite score ranks households or places, and no automated profile chooses eligibility, targeting, intervention, relocation, or recovery.

## Treat essential services as an interacting household bundle

Households experience housing, food, water, energy, mobility, health, care, education, communications, income, identity, payments, legal support, safety, and public space together. A failure in one system can disable several others: a power outage affects medical equipment and refrigeration; lost transport affects work, school, food, and care; unstable housing disrupts benefits, education, health, and social support; loss of digital access can block employment, payments, appointments, and appeals.

The bundle record therefore tracks availability, actual receipt, adequacy, accessibility, affordability, reliability, safety, privacy, coordination, and continuity for each service. It identifies dependencies, conflicting schedules, duplicated forms, travel chains, payment timing, data exchange, and fallback. A household does not meet the floor because each provider reports a separate average. The combined burden and the weakest essential link remain visible.

Quality includes cultural fit, dignity, relationship continuity, language, supported decision-making, user control, and remedy. A technically available service may be unusable if it arrives at the wrong time, requires inaccessible travel, demands documents a person cannot obtain, relies on unsafe informal help, or exposes the household to surveillance, stigma, family separation, or debt.

## Count time poverty and unpaid care as real constraints

Time is a household resource. The account separates paid work, commuting, school travel, childcare, eldercare, disability support, household work, appointments, queues, forms, coordination, recovery, sleep, learning, community participation, and discretionary time. It records timing, predictability, fragmentation, simultaneity, overnight duty, on-call responsibility, and the ability to hand care to a trusted substitute.

Unpaid care is not free capacity. The record identifies the care function, recipient, caregiver, intensity, duration, schedule, training, equipment, health and safety, income effect, career effect, benefit and pension effect, relationship, consent, preference, backup, respite, and transition. It does not assume that a family member is available, capable, willing, safe, or legally responsible.

Time poverty can exist alongside adequate income, and income poverty can be worsened by time scarcity. Long travel, service fragmentation, short opening hours, repeated verification, unreliable care, unpredictable work, and waiting can consume the time needed to earn income, rest, learn, manage health, or participate in public life. Distribution by gender, disability, age, household form, income, place, and migration status remains explicit.

## Build care as infrastructure and relational work

Care infrastructure includes people, relationships, homes, facilities, transport, equipment, digital tools, food, energy, public space, referral systems, records, training institutions, regulators, funding, quality assurance, and emergency capacity. A licensed place is not staffed, accessible, affordable, appropriate, available at the needed time, or matched to the person.

Capacity measures assessed need, eligible population, places, staffed hours, caseload, wait lists, vacancies, turnover, geography, schedules, language, accessibility, transport, respite, reserve, surge, continuity, and unmet need. It distinguishes public, Indigenous, cooperative, community, nonprofit, regulated, private, family, and peer roles without treating informal support as a substitute for funded public duty.

Workforce readiness includes occupations, skills, credentials, recognition, wages, benefits, leave, pensions, schedules, workload, safety, violence prevention, health, accommodation, immigration conditions, recruitment fees, collective voice, supervision, progression, retention, succession, and emergency reserve. Vacancy counts alone do not prove capability. Job quality and relationship continuity are service-quality conditions.

Care quality protects autonomy, supported decisions, privacy, dignity, safeguarding, family integrity, cultural grounding, continuity, complaints, appeals, remedy, and improvement. Coordination requires consent, a lead person, clear handoffs, minimum necessary data, family and recipient voice, conflict resolution, and a plan that remains usable during provider exit, worker absence, migration, disaster, or changing need.

## Measure affordability across money, time, debt, and risk

Household affordability compares reliable resources with the full cost of the capability floor. Resources include income, benefits, savings, wealth, credit, insurance, family support, and in-kind service, but they are not assumed to be equally controlled or available. Costs include housing, food, utilities, transport, care, health, education, digital access, taxes, fees, devices, deposits, travel, waiting, administration, debt service, penalties, and the cost of unreliable substitutes.

A low monthly bill can still produce hardship when income is volatile, several essential bills arrive together, a deposit or repair is due, the household loses paid hours to care, service failures cause replacement costs, or debt and arrears add fees. The record follows cash flow and timing as well as annual totals. It protects an essential minimum before considering discretionary use.

Debt records identify principal, interest, fees, security, guarantee, creditor, collection, credit reporting, refinancing, limitation, and residual exposure. Arrears pathways track grace, notice, penalty, disconnection, eviction, repossession, cure, reinstatement, appeal, and restitution. Missed payment is not automatically unwillingness, fraud, or risk. Debt action, benefit denial, and targeting remain separate human decisions.

Shock scenarios cover job loss, reduced hours, illness, disability, death, separation, violence, migration, disaster, outage, price increases, interest rates, rent, care need, provider failure, and administrative interruption. Stabilizers can include cash, benefits, food, bill relief, debt pause, housing protection, care, mobility, health, legal support, and expedited correction, each with authority, capacity, funding, duration, exit, and receipt.

## Make administrative burden visible

Program eligibility is not benefit access. The pathway separates awareness, discovery, eligibility, application, documentation, appointment, verification, decision, payment or service receipt, renewal, retention, denial, abandonment, error, correction, appeal, and back payment. It measures time, travel, data, fees, missed work, care arrangements, stress, stigma, privacy, and repeated proof.

Access requires plain language, proactive notice, assisted enrollment, document alternatives, multilingual and accessible channels, in-person, phone, mail, and offline options, reasonable deadlines, grace, good-cause extensions, interim continuity, human review, representation, and independent appeal. Once-only data can reduce burden only with lawful authority, purpose limitation, accuracy, security, correction, and a usable alternative.

Automated eligibility, matching, payment, fraud, or risk tools cannot issue a governed finding in this layer. The record names the decision, data, model, threshold, error modes, affected publics, explanation, contestability, human authority, audit, and remedy. Efficiency does not excuse wrongful denial, delay, surveillance, inaccessible process, or burden shifted onto households and frontline workers.

Take-up is interpreted cautiously. Low participation can reflect lack of need, but it can also reflect missing notice, inaccessible systems, fear, stigma, documentation barriers, provider shortage, unsuitable service, or absence of remedy. Denial and abandonment are disaggregated and investigated rather than counted as proof that the program is unnecessary.

## Test proximity as a complete trip

Nearby is not necessarily reachable. Neighborhood access measures the whole door-to-service-to-home chain: walking or rolling route, crossings, terrain, lighting, safety, weather, vehicle accessibility, schedule, transfer, wait, fare, payment, companion needs, opening hours, appointment compatibility, destination capacity, service quality, and return trip. It accounts for carrying goods, accompanying children, supporting an elder, using equipment, fatigue, pain, and unpredictable delays.

Urban proximity concepts do not transfer automatically to rural, remote, northern, island, Indigenous, dispersed, mobile, or seasonal communities. The service model may combine local hubs, mobile service, scheduled transport, remote support, visiting specialists, community workforce, shared infrastructure, overnight accommodation, travel support, and emergency evacuation. Remote delivery is not equivalent when connectivity, privacy, language, equipment, clinical suitability, or in-person fallback is missing.

The access record includes social infrastructure: libraries, schools, parks, recreation, community and cultural spaces, faith organizations, markets, care hubs, public realm, and informal networks. Social isolation and belonging are not reduced to distance. Hours, welcome, safety, accessibility, affordability, cultural fit, programming, trust, and the ability to participate matter.

## Prevent displacement and govern household mobility

Mobility can be chosen, constrained, or coerced. The record distinguishes a voluntary move from eviction, foreclosure, redevelopment pressure, disaster displacement, contamination, conflict, service loss, family violence, institutional discharge, or inability to find accessible housing. Relocation does not itself remedy the loss of home, community, school, care, work, culture, land, or support.

Prevention includes early warning, standing, legal support, rent and tax protection, utility continuity, repair, accessibility retrofit, habitability enforcement, income support, community ownership, public acquisition, and anti-speculation tools. Temporary accommodation must protect privacy, accessibility, safety, family unity, companions, animals, equipment, food, medication, education, work, benefits, identity, and communications.

When a move occurs, the record covers choice, information, moving and storage costs, accessible replacement housing, tenure and affordability, service continuity, transport, school, care, health, work, records, benefits, community connection, right to return, compensation, restitution, appeal, and long-term outcomes. A housing unit offered is not a successful transition.

## Stabilize crises and follow recovery to durable security

Crisis intake must be reachable before a household can produce a complete file. It offers accessible routes for immediate safety, shelter, cash, food, water, energy, communications, health, medication, disability equipment, care, transport, identity, banking, legal help, and protection from debt, eviction, disconnection, or collection. A named navigator coordinates handoffs with consent and minimum necessary data.

Temporary relief is not recovery. Recovery is observed across stable housing, adequate income, manageable debt, care continuity, health, education, mobility, restored services, safety, social connection, rights, and the capacity to withstand the next shock. The record distinguishes immediate, short, medium, long, recurring, chronic, and intergenerational horizons. Closure of a crisis case does not establish recovery.

Correction fits the failure: expedite a payment, restore a service, repair credit, cancel an unlawful debt, provide accessible housing, add care capacity, compensate loss, restore records, change a rule, retrain staff, replace a system, fund prevention, or provide restitution. Individual relief cannot close a systemic finding, and systemic reform does not erase past harm.

## Follow life-course transitions and distribution

Needs change across birth, childhood, education, entry to work, household formation, parenthood, caregiving, job loss, illness, disability, migration, separation, bereavement, retirement, aging, and end of life. Systems often react after a transition creates crisis. The record identifies foreseeable changes, advance notice, continuity, portable eligibility, accessible information, warm handoffs, bridge funding, care replacement, housing and transport needs, and the point at which a new review is required.

Distribution remains visible within and across households. Income, wealth, gender, race, disability, age, language, place, tenure, family form, caregiving role, migration status, and future-household effects are not collapsed into a single average. Benefits controlled by one household member do not automatically benefit all members; harms and time burdens may fall on different people than cash costs.

Long-horizon security tests stable housing, reliable essential services, material buffers, manageable debt, balanced time, accessible care, reachable destinations, rights and remedies, social connection, shock absorption, life-course mobility, and fair distribution across current and future households. Improvement in one dimension does not authorize a conclusion about the others.

## Public contract

The Phase 82 contract keeps household identity, capability floors, service bundles, time use, unpaid care, care need, infrastructure, workforce, provider capacity, quality, resources, expenses, debt, arrears, administrative burden, take-up, automation, shocks, stabilization, neighborhood access, social infrastructure, displacement, mobility, crisis response, recovery, life-course transition, distribution, correction, audit, and receipts separate. It cannot mutate Phase 64 or any operating record.

The registry is deliberately empty. There is no verified Phase 81 service chain, household classification, capability floor, service bundle, care-need assessment, care-capacity finding, workforce safeguard, provider decision, household-burden finding, debt or arrears protection, administrative-burden finding, automated decision, stabilization decision, neighborhood-access finding, displacement finding, relocation or return decision, crisis response, recovery finding, remedy, independent review, receipt, score, rank, Phase 64 advance, or operating-outcome change. Future records can open only from real dated evidence and separately authorized human decisions.
`;
for (const [id, slug, title, summary] of guideDefinitions) {
  const body = `---\nid: "${id}"\ntitle: "${title}"\nslug: "${slug}"\nrecord_status: "Published"\nsummary: "${summary}"\npublished_date: 2026-08-24\ncaptured_date: 2026-08-24\nsignal_ids:\n${yamlList(signalIds)}\nevidence_gap_ids:\n${yamlList(evidenceGapIds)}\nclaim_scope: "Editorial Synthesis"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: 2026-08-24\ntop_takeaways:\n  - "Household capability depends on interacting services, time, care, resources, access, rights, continuity, and recovery rather than one income or proximity measure."\n  - "Unpaid care, program eligibility, a low bill, a nearby service, temporary relief, and aggregate improvement cannot substitute for verified household security."\n  - "No household, benefit, provider, debt, displacement, recovery, score, or ranking decision is created by this guide."\nconstraint_watch:\n  - "Public Trust"\n  - "Infrastructure"\n  - "Capital"\n  - "Labor"\n  - "Regulation"\n  - "Interpretation"\nwhat_to_watch_next:\n  - "A verified Phase 81 universal-service chain with adopted floors, rights, continuity, restoration, independent review, and receipts"\n  - "Separately adopted household-capability floors, care-capacity and workforce findings, burden protections, access safeguards, and recovery duties"\n  - "Real dated household, care, debt, displacement, crisis, remedy, audit, and propagation receipts"\n---\n\n${summary}\n\n${sharedBody}`;
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), body, "utf8");
}

const mapDefinitions = [
  ["dependency-map-service-availability-is-not-household-capability", "service-availability-is-not-household-capability", "Service Availability Is Not Household Capability", "A path from eligible household and service receipt through adequacy, access, time, care, resources, rights, continuity, and real function."],
  ["dependency-map-unpaid-care-is-not-free-capacity", "unpaid-care-is-not-free-capacity", "Unpaid Care Is Not Free Capacity", "A path from care need through caregiver identity, time, health, income, skill, consent, respite, replacement, continuity, and funded duty."],
  ["dependency-map-program-eligibility-is-not-benefit-access", "program-eligibility-is-not-benefit-access", "Program Eligibility Is Not Benefit Access", "A path from awareness and application through documentation, decision, receipt, retention, error, correction, appeal, and back payment."],
  ["dependency-map-low-monthly-bill-is-not-household-affordability", "low-monthly-bill-is-not-household-affordability", "A Low Monthly Bill Is Not Household Affordability", "A path from reliable resources and essential expenses through time, volatility, debt, arrears, shocks, hardship, protection, and remedy."],
  ["dependency-map-neighborhood-proximity-is-not-accessibility", "neighborhood-proximity-is-not-accessibility", "Neighborhood Proximity Is Not Accessibility", "A path from a complete accessible trip through schedule, cost, safety, caregiver needs, destination capacity, quality, return, and fallback."],
  ["dependency-map-temporary-relief-is-not-household-recovery", "temporary-relief-is-not-household-recovery", "Temporary Relief Is Not Household Recovery", "A path from crisis stabilization through housing, income, debt, care, health, education, mobility, services, connection, resilience, and recurrence prevention."]
];
for (const [id, slug, title, summary] of mapDefinitions) {
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id, title, slug, summary, map_type: "Dependency Stack", record_status: "Published", primary_topic: "Human Futures", framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"], constraint_tags: ["Public Trust", "Infrastructure", "Regulation", "Labor", "Interpretation"],
    map_question: `What records are required before ${title.toLowerCase()} can support a bounded household-capability decision?`, interpretation_boundary: "This map is a control path. It does not establish a household capability, care capacity, affordability finding, benefit access, displacement finding, recovery, remedy, score, rank, or receipt.",
    source_ids: [...new Set(upstream.flatMap((record) => record.source_ids))].slice(0, 8), signal_ids: signalIds, technology_ids: [], local_system_ids: [...new Set(upstream.flatMap((record) => record.local_system_ids))], evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-service", label: "Verified Phase 81 universal-service chain", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 81 record exists." },
      { id: "node-capability", label: "Household identity, capability floor, service bundle, rights, and life course", node_type: "Constraint", note: "A service offer does not prove capability." },
      { id: "node-care", label: "Care need, unpaid care, infrastructure, workforce, providers, quality, and continuity", node_type: "Constraint", note: "Informal care is not free public capacity." },
      { id: "node-burden", label: "Resources, time, expenses, debt, arrears, administration, shocks, and protection", node_type: "Constraint", note: "Eligibility and low bills do not prove access or affordability." },
      { id: "node-place", label: "Complete trips, rural reach, social infrastructure, displacement, mobility, and return", node_type: "Constraint", note: "Proximity is not accessibility." },
      { id: "node-recovery", label: "Crisis response, continuity, recovery, remedy, long-horizon security, and audit", node_type: "Constraint", note: "Temporary relief is not recovery." },
      { id: "node-receipt", label: "Independent review, dissent, correction, archive, and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 82 receipt exists." }
    ],
    links: [
      { from: "node-service", to: "node-capability", relationship: "Depends On", confidence: "Missing Evidence", note: "Household floors follow verified universal service." },
      { from: "node-capability", to: "node-care", relationship: "Depends On", confidence: "Missing Evidence", note: "Care capacity responds to adopted capability floors." },
      { from: "node-care", to: "node-burden", relationship: "Depends On", confidence: "Missing Evidence", note: "Burden includes verified care needs and constraints." },
      { from: "node-burden", to: "node-place", relationship: "Depends On", confidence: "Missing Evidence", note: "Access and displacement require household baselines." },
      { from: "node-place", to: "node-recovery", relationship: "Depends On", confidence: "Missing Evidence", note: "Recovery follows verified access, crisis, and mobility conditions." },
      { from: "node-recovery", to: "node-receipt", relationship: "Depends On", confidence: "Missing Evidence", note: "Every household decision requires review and receipt." }
    ],
    what_this_map_supports: ["Separate capability, care, burden, access, displacement, crisis, recovery, and remedy decisions.", "Explicit household members, caregivers, dependencies, duties, shocks, options, appeals, and review.", "Public reasoning without household or place scoring."],
    what_this_map_does_not_prove: ["It does not classify, target, entitle, deny, allocate care, collect debt, displace, relocate, close recovery, or remedy.", "It does not convert availability, unpaid care, eligibility, a low bill, proximity, or temporary relief into household security.", "It does not create a receipt, score, rank, stage advance, or operating-outcome change."],
    next_records_needed: ["A verified Phase 81 service and restoration chain with receipts.", "Separately adopted capability floors, care capacity, workforce safeguards, burden protections, neighborhood access, displacement safeguards, and recovery duties.", "Independent household, care, debt, access, crisis, recovery, remedy, correction, and propagation receipts."]
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
  const records = [capabilityDossiers[index], careLedgers[index], burdenRegisters[index], recoveryLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 82 household-capability and everyday-security boundary")) {
    const links = records.map((record) => { const value = Object.values(record).find((item) => typeof item === "string" && /^82-(HCD|CWL|HBR|NCR)-/.test(item)); return `[${value}](/evidence/household-capability/${record.slug}/)`; });
    body = body.trimEnd() + `\n\n## Phase 82 household-capability and everyday-security boundary\n\nThe [Household Capability And Everyday Security Registry](/evidence/household-capability/) assigns ${links.join(", ")} to this named file. No household classification, capability floor, service bundle, care-capacity or workforce finding, burden protection, debt action, access or displacement finding, crisis response, recovery finding, remedy, receipt, score, rank, or Phase 64 cell change exists.\n`;
    await writeFile(path, body, "utf8");
  }
}

const localFileById = {
  "local-us-southwest-chip-corridor": "local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate": "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor": "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor": "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor": "local-nevada-lithium-processing-corridor.mdx"
};
for (const [localId, filename] of Object.entries(localFileById)) {
  const localRecords = capabilityDossiers.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 82 household capability, care, access, and recovery boundary")) {
    body = body.trimEnd() + `\n\n## Phase 82 household capability, care, access, and recovery boundary\n\nThe [Household Capability And Everyday Security Registry](/evidence/household-capability/) connects ${localRecords.map((record) => record.named_entity).join(" and ")} to service-bundle, time, unpaid-care, workforce, household-cost, debt, administrative-burden, neighborhood-access, displacement, crisis, recovery, and remedy controls. Local service availability, informal care, program eligibility, a low bill, proximity, or temporary assistance does not establish durable household capability in this place.\n`;
    await writeFile(path, body, "utf8");
  }
}

const operatingBriefings = ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-universal-service-doctrine-001.mdx", "briefing-essential-service-floors-001.mdx", "briefing-affordability-cross-subsidy-001.mdx", "briefing-coverage-capacity-access-001.mdx", "briefing-accessibility-user-rights-remedy-001.mdx", "briefing-continuity-mutual-aid-essential-systems-001.mdx", "briefing-emergency-rationing-restoration-long-horizon-accountability-001.mdx"];
for (const briefingName of operatingBriefings) {
  const path = join(contentRoot, "briefings", briefingName); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 82 household capability, care, burden, and recovery control")) {
    body = body.trimEnd() + "\n\n## Phase 82 household capability, care, burden, and recovery control\n\nThe [Household Capability And Everyday Security Registry](/evidence/household-capability/) adds eight inactive capability-floor dossiers, eight inactive care-capacity ledgers, eight inactive household-burden registers, and eight inactive neighborhood-access and recovery ledgers. It creates zero household classifications, floors, bundles, care findings, workforce safeguards, burden or debt findings, access or displacement findings, crisis or recovery decisions, remedies, receipts, scores, rankings, or stage changes.\n";
    await writeFile(path, body, "utf8");
  }
}

await writeJson(join(contentRoot, "updates", "2026-08-24-phase-82-household-capability-care-everyday-security.json"), {
  id: "update-2026-08-24-phase-82-household-capability-care-everyday-security", effective_date: "2026-08-24", entry_type: "Source Refresh", title: "Phase 82 adds household-capability, care-infrastructure, and everyday-security controls",
  summary: "Eight inactive capability-floor dossiers, eight inactive care-infrastructure and workforce ledgers, eight inactive affordability-time-debt-administrative-burden registers, and eight inactive neighborhood-access-displacement-crisis-recovery ledgers now expose the household-security contract. Twelve guides and six maps deepen the content without classifying, targeting, scoring, ranking, or deciding for a household.",
  affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"], related_paths: ["/evidence/household-capability/", ...guideDefinitions.map(([, slug]) => `/briefings/${slug}/`), "/data/household-capability-care-everyday-security.json"],
  evidence_note: "This release contains empty household-capability, care-capacity, workforce, affordability, time, debt, administrative-burden, neighborhood-access, displacement, crisis, recovery, and remedy contracts plus synthetic-only validation. It does not contain a verified Phase 81 service record or a Phase 82 decision or receipt.", materiality: "No record-state change", publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, household, care, fiscal, service, emergency, and operating states unchanged.", next_check_date: "2026-09-01", work_package: "docs/work-packages/phase-82-household-capability-care-infrastructure-everyday-security.md"
});

console.log(`Phase 82 content built: ${capabilityDossiers.length} inactive capability dossiers, ${careLedgers.length} inactive care ledgers, ${burdenRegisters.length} inactive burden registers, ${recoveryLedgers.length} inactive recovery ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 household-capability decisions.`);
