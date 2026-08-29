import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase97 = await readJson(join(dataRoot, "phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-registry.json"));
const upstream = phase97.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers;
const labels = (value) => value.split("|").map((item) => item.trim());
const gates = (prefix, value) => labels(value).map((label, index) => ({ gate_id: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));
const taxonomy = (prefix, value, idKey) => labels(value).map((label, index) => ({ [idKey]: `${prefix}-${String(index + 1).padStart(2, "0")}`, label }));
const inactiveChecks = (items, basis) => items.map((item) => ({ ...item, decision_state: "Inactive", basis }));
const empty = (...names) => Object.fromEntries(names.map((name) => [name, []]));
const shortName = (record) => record.slug.replace(/^97-psl-\d+-/, "");
const common = (record, index, idKey, prefix, slug, kind) => ({
  [idKey]: `${prefix}-${String(index + 1).padStart(3, "0")}-${record.cohort_id}`,
  slug: `${slug}-${String(index + 1).padStart(3, "0")}-${shortName(record)}`,
  record_kind: kind, cohort_id: record.cohort_id, file_id: record.file_id, named_entity: record.named_entity,
  source_ids: record.source_ids, signal_ids: record.signal_ids, evidence_gap_ids: record.evidence_gap_ids,
  canonical_briefing_id: record.canonical_briefing_id, reader_pathway_ids: record.reader_pathway_ids, local_system_ids: record.local_system_ids,
  record_status: "Published", propagation_status: "not_started", first_reviewer_id: null, second_reviewer_id: null,
  automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
});

const justiceGates = gates("98-JG", "Verified Phase 97 environmental and planetary-stewardship record | Lawful constitutional, treaty, legislative, judicial, administrative, Indigenous and international authority | Person, community, institution, matter, right, duty, jurisdiction, venue and period identity | Applicable law, rule, treaty, precedent, standard, policy and hierarchy of authority | Standing, eligibility, limitation period, exhaustion, venue and procedural posture | Notice, language, disability, cultural, geographic, digital and physical accessibility | Counsel, legal aid, advocacy, navigation, interpretation and support capacity | Filing, evidence, disclosure, hearing, examination, participation and reasoned-decision process | Independence, impartiality, competence, conflict, recusal and anti-corruption safeguards | Timeliness, delay, backlog, cost, fee, distance and administrative-burden evidence | Civil, criminal, administrative, constitutional, Indigenous, environmental and restorative pathways | Presumption, due process, equality, nondiscrimination, privacy and dignity safeguards | Interim protection, injunction, bail, protection order, stay and emergency remedy | Judgment, order, settlement, remedy, enforcement, compliance and implementation evidence | Appeal, review, reconsideration, correction, compensation and systemic remedy | Distribution by income, race, gender, disability, age, geography, status and affected community | Indigenous jurisdiction, legal orders, title, treaty, consent and culturally grounded process | No law, right, court, portal or program as automatic access to justice | Independent rights, process, outcome, distribution and public-value review | Human justice-access decision and dated receipt");
const safetyGates = gates("98-SG", "Adopted justice-access and rights baseline | Harm, threat, incident, victim, survivor, accused person, responder, place, jurisdiction and period identity | Violence, fire, traffic, workplace, environmental, cyber, disaster, exploitation and community-harm scope | Prevention, social determinants, built environment, public health, education and community-support baseline | Police, fire, emergency medical, inspection, regulatory, correctional and community-provider role | Call, dispatch, response, contact, use-of-force, arrest, detention, charge and diversion evidence | Victim and survivor safety, consent, privacy, services, compensation and restorative options | De-escalation, crisis response, mental-health, disability and culturally safe practice | Workforce competence, staffing, fatigue, equipment, mutual aid and duty-of-care safeguards | Legality, necessity, proportionality, least-restrictive means and rights protection | Complaint, misconduct, independent investigation, disclosure, discipline and remedy | Detention, custody, bail, sentencing, corrections, rehabilitation, release and reintegration | Fire prevention, code, inspection, suppression, rescue, medical response and recovery | Community violence prevention, youth supports, gender-based violence and hate-harm response | Risk displacement, over-policing, under-protection, surveillance and technology harms | Race, gender, disability, age, income, geography, immigration and protected-status distribution | Indigenous safety, jurisdiction, community authority, cultural continuity and remedy | No police, responder, camera, patrol, arrest or incarceration count as automatic public safety | No falling reported incidents as automatic reduced harm or improved trust | Independent legality, safety, rights, survivor, community and public-value review | Human public-safety and accountability decision | Dated safety, accountability and remedy receipt");
const emergencyGates = gates("98-EG", "Verified justice, rights and public-safety baseline | Hazard, threat, vulnerability, exposure, capability, dependency, population, place, jurisdiction and period identity | Prevention, mitigation, preparedness, warning, response, continuity, recovery and transformation lifecycle | All-hazards, climate, health, fire, flood, seismic, industrial, cyber, infrastructure and conflict scope | Risk assessment, scenario, likelihood, consequence, uncertainty and compound-cascade evidence | Emergency plan, authority, role, trigger, escalation, mutual aid and incident-command design | Accessible warning, trusted communication, language, disability and last-mile reach | Evacuation, shelter, medical, food, water, energy, communications and transportation capacity | Workforce, volunteer, logistics, stockpile, supplier, facility, data and interoperability readiness | Critical-infrastructure and essential-system dependency, redundancy, backup and restoration | Cybersecurity, physical security, supply-chain security, information integrity and privacy | Exercise, drill, test, corrective action, maintenance and readiness-assurance evidence | Emergency declaration, power, duration, geographic scope, rights limits and oversight | Necessity, proportionality, nondiscrimination, least-restrictive means and sunset safeguards | Response execution, resource allocation, responder safety, coordination and public reporting | Displacement, family reunification, livelihood, housing, health, education and community continuity | Damage, loss, service interruption, ecological harm and distributional accounting | Recovery, return, reconstruction, remediation, adaptation and build-back-better evidence | Indigenous jurisdiction, treaty, consent, knowledge, territorial access and mutual aid | No emergency plan, declaration, exercise or stockpile as automatic preparedness | No restored asset or service as automatic household, community or ecosystem recovery | Independent readiness, rights, security, recovery and public-value review");
const peaceGates = gates("98-PG", "Verified justice, public-safety and emergency-resilience baseline | Threat, actor, capability, target, population, territory, jurisdiction, alliance and period identity | Constitutional, statutory, treaty, international-humanitarian, human-rights and Indigenous authority | Civilian democratic control, legislative mandate, executive authority, judicial review and public accountability | Defense, intelligence, diplomacy, development, peacebuilding, civil protection and human-security scope | Threat assessment, warning, uncertainty, deception, escalation, miscalculation and alternative hypotheses | Personnel, training, readiness, sustainment, logistics, infrastructure, industrial base and interoperability | Intelligence collection, retention, sharing, surveillance, privacy, necessity and proportionality safeguards | Cyber, space, maritime, air, land, information, nuclear, biological and critical-system risk | Deterrence, assurance, arms control, nonproliferation, confidence building and escalation management | Civilian protection, distinction, precaution, proportionality, detention and humanitarian access | Conflict prevention, diplomacy, mediation, ceasefire, monitoring, verification and dispute resolution | Peace agreement, inclusion, justice, accountability, disarmament, demobilization and reintegration | Displacement, return, restitution, reparations, recovery, reconstruction and reconciliation | Gender, youth, disability, minority, Indigenous and affected-community participation and protection | Spending, procurement, vendor, supply-chain, corruption, opportunity-cost and public-value evidence | Casualty, harm, environmental damage, service disruption and long-horizon consequence accounting | No security capability, intelligence volume or surveillance coverage as automatic reduced risk | No defense spending, force size, readiness claim or weapons delivery as automatic security | No ceasefire, agreement signature or election as automatic durable peace | No secrecy or classification as automatic exemption from independent oversight | Independent legality, rights, civilian-harm, security, peace and public-value review | Human security-defense-peace decision | Dated security, civilian-protection and peace-stewardship receipt");

const justiceClasses = taxonomy("98-JCL", "Constitutional and human rights | Civil justice | Criminal justice | Administrative justice | Environmental and climate justice | Indigenous legal orders and treaty justice | Family and child justice | Labor and employment justice | Housing, land and property justice | Migration, asylum and citizenship justice | Disability and equality rights | Consumer, financial and digital justice | Restorative and community justice | International and cross-border justice", "justice_access_class_id");
const justiceDimensions = taxonomy("98-JAD", "Rights awareness | Standing and eligibility | Accessible notice and navigation | Counsel and representation | Affordable process | Timely process | Fair hearing and evidence | Independent decision maker | Protective interim relief | Effective remedy | Enforceable outcome | Independent justice public-value review", "justice_access_dimension_id");
const justiceSafeguards = taxonomy("98-JRS", "No law on books as access to justice | No court or portal presence as usable access | Complete person, matter and jurisdiction identity | Due process and equality | Privacy and dignity | Language and disability access | Indigenous jurisdiction and legal orders | Counsel and legal-aid protection | No automated legal outcome or risk score | Independent review and appeal | Enforcement, correction and remedy | Public accountability without case-data exposure", "justice_rights_safeguard_id");
const safetyClasses = taxonomy("98-SCL", "Violence prevention | Gender-based and family violence | Youth and school safety | Community and neighborhood safety | Fire prevention and response | Emergency medical response | Road and transport safety | Workplace and industrial safety | Environmental and public-health safety | Policing and law enforcement | Detention and corrections | Cyber-enabled and financial harm | Hate, exploitation and trafficking harms | Community-led and restorative safety", "public_safety_class_id");
const safetyDimensions = taxonomy("98-SAD", "Prevention and root causes | Accessible reporting and help | Timely proportionate response | De-escalation and least force | Victim and survivor support | Responder competence and safety | Legality and due process | Equity and nondiscrimination | Transparency and data quality | Independent accountability | Rehabilitation and reintegration | Independent safety public-value review", "public_safety_dimension_id");
const safetySafeguards = taxonomy("98-SRS", "No police presence as public safety | No arrest or incarceration count as reduced harm | No falling reports as absence of victimization | Complete incident and affected-person identity | Legality, necessity and proportionality | Disability and crisis-response safeguards | Survivor consent, privacy and dignity | Anti-bias and protected-status review | Indigenous community authority | Independent complaint and misconduct review | Remedy, correction and non-retaliation | No automated threat score or enforcement decision", "safety_rights_safeguard_id");
const emergencyClasses = taxonomy("98-ECL", "Extreme weather and climate hazards | Wildfire and smoke | Flood, storm and coastal hazards | Earthquake, landslide and geologic hazards | Public-health and biological emergencies | Industrial, chemical and radiological emergencies | Cyber and communications incidents | Energy and utility failures | Transportation and supply-chain disruption | Food, water and shelter emergencies | Mass displacement and humanitarian need | Civil disorder and complex emergencies | Space and remote-area emergencies | Compound and cascading system shocks", "emergency_resilience_class_id");
const emergencyDimensions = taxonomy("98-ERD", "Risk prevention and mitigation | Warning and public communication | Evacuation and shelter | Medical and public-health capacity | Essential-service continuity | Critical-system redundancy | Logistics and mutual aid | Accessible and equitable response | Rights-protective emergency authority | Damage and loss accounting | Recovery and transformation | Independent resilience public-value review", "emergency_resilience_dimension_id");
const emergencySafeguards = taxonomy("98-ERS", "No declaration as preparedness | No plan or exercise as proven readiness | No stockpile as usable delivered capacity | No restored asset as community recovery | Complete hazard, population and dependency identity | Accessible warnings and services | Necessity, proportionality and sunset | Privacy and cybersecurity rights | Indigenous jurisdiction and mutual aid | Displacement, return and livelihood protection | Independent after-action review and correction | No automated emergency allocation or restriction", "emergency_rights_safeguard_id");
const peaceClasses = taxonomy("98-PCL", "Diplomacy and conflict prevention | Mediation and dispute resolution | Intelligence and early warning | Civil protection and human security | Defense and territorial security | Cyber and information security | Space and maritime security | Arms control and nonproliferation | Civilian protection and humanitarian access | Ceasefire monitoring and verification | Peace agreements and implementation | Transitional justice and accountability | Disarmament, demobilization and reintegration | Reconciliation and durable peace", "security_peace_class_id");
const peaceDimensions = taxonomy("98-SPD", "Lawful authority and mandate | Civilian democratic control | Threat and alternative assessment | Readiness and sustainment | Rights-protective intelligence | Escalation and arms-risk control | Civilian-harm prevention | Inclusive diplomacy and mediation | Humanitarian access and protection | Agreement implementation | Recovery, return and reconciliation | Independent security-peace public-value review", "security_peace_dimension_id");
const peaceSafeguards = taxonomy("98-SPS", "No capability as protected rights or reduced risk | No spending as security | No intelligence volume as accurate warning | No secrecy as absence of oversight | No weapons delivery as operational readiness | No deterrence claim as avoided conflict | No ceasefire as durable peace | Civilian control and legislative mandate | Human rights and humanitarian law | Privacy, necessity and proportionality | Inclusive participation and remedy | Independent civilian-harm and peace audit", "security_peace_safeguard_id");
const longHorizonTests = taxonomy("98-LHT", "Equal practical access to justice | Trusted rights-protective institutions | Prevented violence and reduced harm | Accountable least-restrictive public safety | Prepared communities and interoperable responders | Rights-protective emergency authority | Resilient critical and essential systems | Democratic civilian control of security institutions | Credible threat reduction without unchecked surveillance | Protected civilians and humanitarian access | Implemented inclusive peace and reconciliation | Durable peace under compound transboundary shocks", "long_horizon_peace_test_id");

const justiceDossiers = upstream.map((record, index) => ({
  ...common(record, index, "rights_rule_of_law_courts_legal_aid_access_to_justice_dossier_id", "98-JAD", "98-jad", "rights_rule_of_law_courts_legal_aid_access_to_justice_dossier"),
  waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledger_id: record.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledger_id,
  justice_state: "Inactive - No Verified Phase 97 Environmental And Planetary-Stewardship Record", justice_decision: "Not Open",
  justice_checks: inactiveChecks(justiceGates, "No verified Phase 97 environmental and planetary-stewardship predecessor or Phase 98 justice-access receipt exists."),
  justice_access_class_records: justiceClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  justice_access_dimension_records: justiceDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  justice_rights_safeguard_records: justiceSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("verified_phase97_planetary_stewardship_records", "right_records", "duty_records", "matter_records", "standing_records", "notice_records", "counsel_records", "filing_records", "hearing_records", "evidence_records", "decision_records", "remedy_records", "enforcement_records", "appeal_records", "distribution_records", "review_records", "correction_records"),
  justice_receipt_id: null, law_on_books_as_access_to_justice_allowed: false, automatic_justice_access_decision_allowed: false
}));
const safetyLedgers = upstream.map((record, index) => ({
  ...common(record, index, "public_safety_violence_prevention_policing_fire_corrections_accountability_ledger_id", "98-SAL", "98-sal", "public_safety_violence_prevention_policing_fire_corrections_accountability_ledger"),
  rights_rule_of_law_courts_legal_aid_access_to_justice_dossier_id: justiceDossiers[index].rights_rule_of_law_courts_legal_aid_access_to_justice_dossier_id,
  safety_state: "Inactive - No Adopted Justice-Access And Rights Baseline", safety_decision: "Not Open",
  safety_checks: inactiveChecks(safetyGates, "No adopted justice-access and rights baseline or Phase 98 public-safety accountability receipt exists."),
  public_safety_class_records: safetyClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  public_safety_dimension_records: safetyDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  safety_rights_safeguard_records: safetySafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("harm_records", "incident_records", "prevention_records", "call_records", "dispatch_records", "response_records", "force_records", "arrest_records", "detention_records", "diversion_records", "survivor_support_records", "fire_response_records", "complaint_records", "investigation_records", "discipline_records", "remedy_records", "review_records", "correction_records"),
  safety_receipt_id: null, police_presence_as_public_safety_allowed: false, automatic_public_safety_or_accountability_decision_allowed: false
}));
const emergencyRegisters = upstream.map((record, index) => ({
  ...common(record, index, "emergency_management_civil_protection_critical_system_security_resilience_register_id", "98-EMR", "98-emr", "emergency_management_civil_protection_critical_system_security_resilience_register"),
  public_safety_violence_prevention_policing_fire_corrections_accountability_ledger_id: safetyLedgers[index].public_safety_violence_prevention_policing_fire_corrections_accountability_ledger_id,
  emergency_state: "Inactive - No Verified Justice, Rights And Public-Safety Baseline", emergency_decision: "Not Open",
  emergency_checks: inactiveChecks(emergencyGates, "No verified justice, rights and public-safety baseline or Phase 98 emergency-resilience receipt exists."),
  emergency_resilience_class_records: emergencyClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  emergency_resilience_dimension_records: emergencyDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  emergency_rights_safeguard_records: emergencySafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("hazard_records", "risk_records", "plan_records", "authority_records", "warning_records", "evacuation_records", "shelter_records", "medical_records", "resource_records", "mutual_aid_records", "dependency_records", "exercise_records", "declaration_records", "response_records", "displacement_records", "damage_records", "recovery_records", "after_action_records", "correction_records"),
  emergency_receipt_id: null, emergency_declaration_as_preparedness_or_recovery_allowed: false, restored_asset_as_restored_community_allowed: false, automatic_emergency_resilience_decision_allowed: false
}));
const peaceLedgers = upstream.map((record, index) => ({
  ...common(record, index, "defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledger_id", "98-DPL", "98-dpl", "defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledger"),
  emergency_management_civil_protection_critical_system_security_resilience_register_id: emergencyRegisters[index].emergency_management_civil_protection_critical_system_security_resilience_register_id,
  rights_rule_of_law_courts_legal_aid_access_to_justice_dossier_id: justiceDossiers[index].rights_rule_of_law_courts_legal_aid_access_to_justice_dossier_id,
  peace_state: "Inactive - No Verified Justice, Safety And Emergency-Resilience Baseline", peace_decision: "Not Open",
  peace_checks: inactiveChecks(peaceGates, "No verified justice, safety and emergency-resilience baseline or Phase 98 security-peace receipt exists."),
  security_peace_class_records: peaceClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  security_peace_dimension_records: peaceDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  security_peace_safeguard_records: peaceSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  long_horizon_peace_test_records: longHorizonTests.map((item) => ({ ...item, test_state: "Not Tested" })),
  ...empty("threat_records", "authority_records", "mandate_records", "oversight_records", "readiness_records", "intelligence_records", "surveillance_records", "cyber_records", "deterrence_records", "arms_control_records", "civilian_harm_records", "humanitarian_records", "diplomacy_records", "mediation_records", "ceasefire_records", "verification_records", "agreement_records", "justice_records", "reconciliation_records", "review_records", "correction_records", "remedy_records"),
  peace_receipt_id: null, security_capability_as_reduced_risk_allowed: false, defense_spending_as_security_allowed: false, ceasefire_as_durable_peace_allowed: false, automatic_security_defense_or_peace_decision_allowed: false
}));

const registry = {
  schema_version: "1.0", phase: "98", title: "Law, Justice, Public Safety, Emergency Management, Security, Defense And Peace", effective_date: "2026-08-27", record_status: "Published", operating_state: "governed_empty_state",
  decision_boundary: "This registry does not create a right, standing, justice-access, court, legal-aid, public-safety, policing, fire, corrections, emergency, security, intelligence, defense, civilian-protection, ceasefire, peace, receipt, score, rank, Phase 64 advance, or operating-outcome decision.",
  interpretation_boundary: "A law on the books is not access to justice. Police presence is not public safety. An emergency declaration is not preparedness or recovery. Security capability is not protected rights or reduced risk. Defense spending is not security. A ceasefire is not durable peace.",
  justice_gates: justiceGates, safety_gates: safetyGates, emergency_gates: emergencyGates, peace_gates: peaceGates,
  justice_access_classes: justiceClasses, justice_access_dimensions: justiceDimensions, justice_rights_safeguards: justiceSafeguards,
  public_safety_classes: safetyClasses, public_safety_dimensions: safetyDimensions, safety_rights_safeguards: safetySafeguards,
  emergency_resilience_classes: emergencyClasses, emergency_resilience_dimensions: emergencyDimensions, emergency_rights_safeguards: emergencySafeguards,
  security_peace_classes: peaceClasses, security_peace_dimensions: peaceDimensions, security_peace_safeguards: peaceSafeguards, long_horizon_peace_tests: longHorizonTests,
  rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers: justiceDossiers,
  public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers: safetyLedgers,
  emergency_management_civil_protection_critical_system_security_resilience_registers: emergencyRegisters,
  defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers: peaceLedgers,
  metrics: { verified_phase97_environment_planetary_stewardship_records_received: 0, justice_access_decisions: 0, public_safety_accountability_decisions: 0, emergency_resilience_decisions: 0, security_defense_peace_decisions: 0, independent_reviews_completed: 0, receipts_created: 0, scores_created: 0, rankings_created: 0, phase64_cells_advanced: 0 }
};
await writeJson(join(dataRoot, "phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json"), registry);

const guideDefinitions = [
  ["law-justice-public-safety-emergency-security-defense-peace-doctrine-001", "Law, Justice, Public Safety, Emergency Management, Security, Defense And Peace Doctrine 001", "A governed doctrine from practical justice access through accountable safety, resilient emergencies, civilian protection and durable peace."],
  ["constitutional-rule-of-law-human-rights-independent-justice-001", "Constitutional Rule Of Law, Human Rights And Independent Justice 001", "Trace lawful authority, rights, duties, institutional independence, equality, oversight and remedy."],
  ["courts-legal-aid-counsel-accessible-process-effective-remedy-001", "Courts, Legal Aid, Counsel, Accessible Process And Effective Remedy 001", "Separate legal entitlement and institutional presence from usable, affordable and enforceable justice."],
  ["administrative-environmental-indigenous-restorative-justice-001", "Administrative, Environmental, Indigenous And Restorative Justice 001", "Govern standing, jurisdiction, participation, legal orders, review, repair and systemic remedy."],
  ["public-safety-violence-prevention-community-health-trust-001", "Public Safety, Violence Prevention, Community Health And Trust 001", "Trace prevention, protection, response, survivor support and trust beyond police presence or incident counts."],
  ["policing-fire-emergency-medical-corrections-accountability-001", "Policing, Fire, Emergency Medical, Corrections And Accountability 001", "Govern lawful proportionate response, custody, responder capacity, complaints, independent investigation and remedy."],
  ["victim-survivor-rights-crisis-response-restorative-safety-001", "Victim And Survivor Rights, Crisis Response And Restorative Safety 001", "Center consent, privacy, dignity, accessible support, protection, accountability and community-led repair."],
  ["emergency-management-preparedness-warning-evacuation-recovery-001", "Emergency Management, Preparedness, Warning, Evacuation And Recovery 001", "Separate plans and declarations from tested readiness, accessible delivery and recovered lives."],
  ["critical-infrastructure-cyber-physical-security-essential-continuity-001", "Critical Infrastructure, Cyber-Physical Security And Essential Continuity 001", "Trace dependencies, redundancy, rights-protective security, restoration and compound-risk resilience."],
  ["national-security-intelligence-oversight-rights-risk-reduction-001", "National Security, Intelligence, Oversight, Rights And Risk Reduction 001", "Govern threat assessment, intelligence, surveillance and oversight without substituting collection volume for security."],
  ["defense-readiness-civilian-control-human-security-public-value-001", "Defense Readiness, Civilian Control, Human Security And Public Value 001", "Trace authority, readiness, sustainment, industrial dependencies, opportunity costs and democratic control."],
  ["conflict-prevention-civilian-protection-ceasefire-peacebuilding-001", "Conflict Prevention, Civilian Protection, Ceasefire And Peacebuilding 001", "Trace diplomacy, protection, verification, agreement implementation, justice, reconciliation and durable peace."]
];
const sourceIds = [...new Set(upstream.flatMap((record) => record.source_ids))];
const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const localSystemIds = [...new Set(upstream.flatMap((record) => record.local_system_ids))];
const yamlList = (items) => items.map((item) => `  - "${item}"`).join("\n");
const sharedBody = `
## Governed justice, safety, security and peace chain

Phase 98 begins only after a verified Phase 97 environmental and planetary-stewardship record. It separates rights, courts and access to justice; prevention, public safety and accountable response; emergency management, civil protection and critical-system resilience; then democratic security, defense, civilian protection, conflict prevention and durable peace. Each transition requires authority, exact identities, baselines, rights safeguards, distribution, alternatives, stress tests, independent review, a human decision and a dated receipt.

## Rights, rule of law and access to justice

Trace standing, notice, counsel, accessible process, independent adjudication, remedy, enforcement and appeal. A law on the books is not access to justice.

## Public safety and accountability

Trace prevention, incident response, survivor support, de-escalation, custody, fire and emergency medical protection, complaints and remedy. Police presence is not public safety.

## Emergency resilience and critical-system security

Trace hazards, warnings, evacuation, essential-service continuity, exercises, lawful powers, response, loss and recovery. An emergency declaration is not preparedness or recovery, and capability is not protected rights or reduced risk.

## Defense, civilian protection and durable peace

Trace civilian control, threat assessment, readiness, rights-protective intelligence, escalation control, diplomacy, humanitarian protection, verification, justice and reconciliation. Defense spending is not security, and a ceasefire is not durable peace.

## Decision boundary

The registry is deliberately empty. It contains no verified Phase 97 predecessor, justice, safety, emergency, security, defense, civilian-protection or peace decision; no review or receipt; and no score, rank, Phase 64 advance or operating-outcome change.
`;
const guideIds = [];
for (const [slug, title, summary] of guideDefinitions) {
  const id = `briefing-${slug}`; guideIds.push(id);
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), `---\nid: "${id}"\ntitle: "${title}"\nslug: "${slug}"\nrecord_status: "Published"\nsummary: "${summary}"\npublished_date: 2026-08-27\ncaptured_date: 2026-08-27\nsignal_ids:\n${yamlList(signalIds)}\nevidence_gap_ids:\n${yamlList(evidenceGapIds)}\nclaim_scope: "Editorial Synthesis"\nlocal_evidence_level: "General Source Layer"\nlast_reviewed_date: 2026-08-27\ntop_takeaways:\n  - "Justice, safety, emergency resilience, security, defense and peace require separate governed records."\n  - "Laws, institutions, presence, declarations, capabilities, spending and ceasefires cannot substitute for verified outcomes."\n  - "No justice, safety, emergency, security, peace, score, ranking or operating-outcome decision is created by this guide."\nconstraint_watch:\n  - "Public Trust"\n  - "Infrastructure"\n  - "Capital"\n  - "Labor"\n  - "Regulation"\n  - "Interpretation"\nwhat_to_watch_next:\n  - "A verified Phase 97 environmental and planetary-stewardship record"\n  - "Separately reviewed justice, safety, emergency, security and peace decisions"\n  - "Real dated access, protection, readiness, civilian-harm, implementation and peace receipts"\n---\n\n${summary}\n${sharedBody}`, "utf8");
}

const mapDefinitions = [
  ["law-on-books-is-not-access-to-justice", "A Law On The Books Is Not Access To Justice", "From formal rights through standing, notice, counsel, accessible process, independent judgment, effective remedy, enforcement and appeal."],
  ["police-presence-is-not-public-safety", "Police Presence Is Not Public Safety", "From institutional presence through prevention, proportional response, survivor protection, reduced harm, trust, accountability and remedy."],
  ["emergency-declaration-is-not-preparedness-or-recovery", "An Emergency Declaration Is Not Preparedness Or Recovery", "From declared authority through warning, evacuation, usable capacity, continuity, response, rights safeguards, return and recovery."],
  ["security-capability-is-not-protected-rights-or-reduced-risk", "Security Capability Is Not Protected Rights Or Reduced Risk", "From technical or institutional capability through lawful use, threat reduction, privacy, proportionality, oversight and correction."],
  ["defense-spending-is-not-security", "Defense Spending Is Not Security", "From appropriation and procurement through lawful readiness, sustainment, deterrence risk, civilian protection, opportunity cost and public value."],
  ["ceasefire-is-not-durable-peace", "A Ceasefire Is Not Durable Peace", "From cessation of hostilities through monitoring, inclusion, implementation, justice, return, recovery, reconciliation and non-recurrence."]
];
const mapIds = [];
for (const [slug, title, summary] of mapDefinitions) {
  const id = `dependency-map-${slug}`; mapIds.push(id);
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id, title, slug, summary, map_type: "Dependency Stack", record_status: "Published", primary_topic: "Policy and Standards", framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"], constraint_tags: ["Public Trust", "Infrastructure", "Capital", "Labor", "Regulation", "Interpretation"],
    map_question: `What records are required before ${title.toLowerCase()} can support a bounded justice, safety, security or peace decision?`, interpretation_boundary: registry.interpretation_boundary, source_ids: sourceIds, signal_ids: signalIds, technology_ids: [], local_system_ids: localSystemIds, evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-stewardship", label: "Verified Phase 97 environmental and planetary-stewardship chain", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 97 record exists." },
      { id: "node-justice", label: "Practical rights and access to justice", node_type: "Constraint", note: "Formal law is not practical justice." },
      { id: "node-safety", label: "Prevented harm and accountable public safety", node_type: "Constraint", note: "Institutional presence is not safety." },
      { id: "node-emergency", label: "Tested emergency and critical-system resilience", node_type: "Constraint", note: "Declarations and plans are not readiness or recovery." },
      { id: "node-peace", label: "Democratic security, civilian protection and durable peace", node_type: "Constraint", note: "Capability, spending and ceasefire are not outcomes." },
      { id: "node-receipt", label: "Independent review, challenge, correction, remedy and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 98 receipt exists." }
    ],
    links: [["node-stewardship","node-justice"],["node-justice","node-safety"],["node-safety","node-emergency"],["node-emergency","node-peace"],["node-peace","node-receipt"]].map(([from,to]) => ({ from, to, relationship: "Depends On", confidence: "Missing Evidence", note: "The downstream decision remains closed until its predecessor is reviewed and receipted." })),
    what_this_map_supports: ["Separate justice, safety, emergency, security, defense, civilian-protection and peace decisions.", "Explicit authority, identities, rights, distribution, alternatives, stress, review, correction and remedy.", "Public reasoning without person, community, institution, jurisdiction, military or country scoring or ranking."],
    what_this_map_does_not_prove: ["It does not establish access to justice, public safety, readiness, reduced risk, security or durable peace.", "It does not convert laws, presence, declarations, capability, spending or ceasefires into outcomes.", "It does not create a receipt, score, rank, stage advance or operating-outcome change."],
    next_records_needed: ["A verified Phase 97 environmental and planetary-stewardship chain.", "Separately adopted justice, safety, emergency, security and peace decisions.", "Independent rights, access, harm, readiness, security, civilian-protection, implementation, correction and propagation receipts."]
  });
}

const pathwayIds = [...new Set(justiceDossiers.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...(pathway.briefing_ids ?? []), ...guideIds])];
  pathway.dependency_map_ids = [...new Set([...(pathway.dependency_map_ids ?? []), ...mapIds])];
  pathway.last_reviewed_date = "2026-08-27";
  await writeJson(path, pathway);
}
for (let index = 0; index < upstream.length; index += 1) {
  const source = upstream[index];
  const records = [justiceDossiers[index], safetyLedgers[index], emergencyRegisters[index], peaceLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 98 law, justice, public safety, emergency management, security, defense, and peace boundary")) {
    const links = records.map((record) => { const value = Object.values(record).find((item) => typeof item === "string" && /^98-(JAD|SAL|EMR|DPL)-/.test(item)); return `[${value}](/evidence/law-justice-public-safety-emergency-security-defense-peace/${record.slug}/)`; });
    body = body.trimEnd() + `\n\n## Phase 98 law, justice, public safety, emergency management, security, defense, and peace boundary\n\nThe [Law, Justice, Public Safety, Emergency Management, Security, Defense And Peace Registry](/evidence/law-justice-public-safety-emergency-security-defense-peace/) assigns ${links.join(", ")} to this named file. No justice, safety, emergency, security, defense, civilian-protection, peace, receipt, score, rank, or Phase 64 cell change exists.\n`;
    await writeFile(path, body, "utf8");
  }
}
const localFiles = ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"];
for (const filename of localFiles) {
  const path = join(contentRoot, "local-systems", filename); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 98 law, justice, public safety, emergency management, security, defense, and peace boundary")) {
    body = body.trimEnd() + "\n\n## Phase 98 law, justice, public safety, emergency management, security, defense, and peace boundary\n\nThe [Law, Justice, Public Safety, Emergency Management, Security, Defense And Peace Registry](/evidence/law-justice-public-safety-emergency-security-defense-peace/) connects this place to rights, justice access, violence prevention, accountable response, emergency resilience, critical-system security, civilian protection and peace. Laws, police presence, declarations, capabilities, spending and ceasefires do not establish outcomes.\n";
    await writeFile(path, body, "utf8");
  }
}
const operatingBriefings = ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"];
for (const name of operatingBriefings) {
  const path = join(contentRoot, "briefings", name); let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 98 law, justice, public safety, emergency management, security, defense, and peace control")) {
    body = body.trimEnd() + "\n\n## Phase 98 law, justice, public safety, emergency management, security, defense, and peace control\n\nThe [Law, Justice, Public Safety, Emergency Management, Security, Defense And Peace Registry](/evidence/law-justice-public-safety-emergency-security-defense-peace/) adds eight inactive justice-access dossiers, eight inactive public-safety ledgers, eight inactive emergency-resilience registers, and eight inactive security-peace ledgers. It creates zero justice, safety, emergency, security, defense, civilian-protection, peace, receipt, score, ranking, or stage decisions.\n";
    await writeFile(path, body, "utf8");
  }
}
await writeJson(join(contentRoot, "updates", "2026-08-27-phase-98-law-justice-public-safety-emergency-management-security-defense-peace.json"), {
  id: "update-2026-08-27-phase-98-law-justice-public-safety-emergency-management-security-defense-peace", effective_date: "2026-08-27", entry_type: "Source Refresh", title: "Phase 98 adds law, justice, public-safety, emergency, security, defense, and peace controls", summary: "Eight inactive justice-access dossiers, eight public-safety accountability ledgers, eight emergency-resilience registers, and eight security-peace ledgers expose the governance contract without deciding justice access, safety, preparedness, reduced risk, security, civilian protection, durable peace, score, rank, or outcome for a person, community, institution, place, jurisdiction, military, alliance, or country.", affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"], related_paths: ["/evidence/law-justice-public-safety-emergency-security-defense-peace/", ...guideDefinitions.map(([slug]) => `/briefings/${slug}/`), "/data/law-justice-public-safety-emergency-management-security-defense-peace.json"], evidence_note: "This release contains empty justice, safety, emergency, security and peace contracts plus synthetic-only validation. It contains no verified Phase 97 predecessor or Phase 98 decision or receipt.", materiality: "No record-state change", publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, environmental, justice, security and operating states unchanged.", next_check_date: "2026-09-01", work_package: "docs/work-packages/phase-98-law-justice-public-safety-emergency-management-security-defense-peace.md"
});

console.log(`Phase 98 content built: ${justiceDossiers.length} inactive justice dossiers, ${safetyLedgers.length} inactive safety ledgers, ${emergencyRegisters.length} inactive emergency registers, ${peaceLedgers.length} inactive peace ledgers, ${guideIds.length} guides, ${mapIds.length} maps, ${pathwayIds.length} pathways, and 0 justice, safety, security, or peace decisions.`);
