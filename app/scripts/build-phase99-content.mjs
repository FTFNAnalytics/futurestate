import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
const phase98 = await readJson(join(dataRoot, "phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json"));
const upstream = phase98.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers;
const labels = (value) => value.split("|").map((item) => item.trim());
const gates = (prefix, value) => labels(value).map((label, index) => ({ gate_id: prefix + "-" + String(index + 1).padStart(2, "0"), label }));
const taxonomy = (prefix, value, idKey) => labels(value).map((label, index) => ({ [idKey]: prefix + "-" + String(index + 1).padStart(2, "0"), label }));
const inactiveChecks = (items, basis) => items.map((item) => ({ ...item, decision_state: "Inactive", basis }));
const empty = (...names) => Object.fromEntries(names.map((name) => [name, []]));
const shortName = (record) => record.slug.replace(/^98-dpl-\d+-/, "");
const common = (record, index, idKey, prefix, slug, kind) => ({
  [idKey]: prefix + "-" + String(index + 1).padStart(3, "0") + "-" + record.cohort_id,
  slug: slug + "-" + String(index + 1).padStart(3, "0") + "-" + shortName(record),
  record_kind: kind,
  cohort_id: record.cohort_id,
  file_id: record.file_id,
  named_entity: record.named_entity,
  source_ids: record.source_ids,
  signal_ids: record.signal_ids,
  evidence_gap_ids: record.evidence_gap_ids,
  canonical_briefing_id: record.canonical_briefing_id,
  reader_pathway_ids: record.reader_pathway_ids,
  local_system_ids: record.local_system_ids,
  record_status: "Published",
  propagation_status: "not_started",
  first_reviewer_id: null,
  second_reviewer_id: null,
  automatic_score_allowed: false,
  automatic_rank_allowed: false,
  phase64_cell_change: "none"
});

const democracyGates = gates("99-DG", "Verified Phase 98 security, civilian-protection and peace-stewardship record | Constitutional, treaty, legislative, electoral, Indigenous and human-rights authority | Voter, resident, citizen, candidate, party, constituency, community, jurisdiction and period identity | Franchise, registration, candidacy, nomination, ballot access and equal-participation rules | Electoral boundaries, district magnitude, representation formula and malapportionment evidence | Accessible voter information, language, disability, geographic, digital and physical access | Campaign finance, political advertising, lobbying, donations, expenditure and beneficial-ownership transparency | Media access, debate access, platform rules, information integrity and freedom of expression | Electoral administration, staffing, facilities, technology, cybersecurity, chain of custody and auditability | Voting, counting, tabulation, recount, certification, observation and dispute-resolution evidence | Representation by population, geography, gender, race, disability, age, income, status and affected community | Indigenous self-government, treaty rights, jurisdiction, consent and political representation | Political participation between elections, petition, assembly, association, consultation and deliberation | Intimidation, violence, coercion, corruption, foreign interference and abuse-of-power safeguards | Peaceful transfer, continuity, succession, concession, challenge and constitutional-order evidence | No election event or turnout rate as automatic inclusive representative democracy | No formal franchise as automatic practical participation | Independent electoral, rights, inclusion, integrity and public-value review | Human democracy and representation decision | Dated democracy, participation and integrity receipt");
const governmentGates = gates("99-GG", "Adopted democracy, representation and participation baseline | Constitution, institution, branch, office, mandate, official, workforce, jurisdiction and period identity | Separation of powers, checks, balances, federalism, subsidiarity and Indigenous jurisdiction | Legislative agenda, committee, debate, amendment, vote, enactment, implementation and post-legislative review | Executive mandate, cabinet, agency, delegation, direction, coordination and emergency-power controls | Judicial, legislative, audit, ethics, ombuds, integrity and public-accountability oversight | Public-service mandate, merit, neutrality, diversity, competence, staffing, retention and succession | Administrative process, rulemaking, consultation, notice, reasons, service standard and appeal | Strategy, plan, budget, program, project, delivery chain, milestone, output and outcome baseline | Procurement, grants, contracting, digital systems, data, facilities and operational capability | Intergovernmental, cross-agency, local, Indigenous, community and international coordination | Fiscal, workforce, technology, legal, supply-chain and infrastructure constraint evidence | Integrity, conflicts, lobbying, gifts, revolving door, whistleblower and anti-corruption safeguards | Accessibility, language, disability, geographic, digital and in-person service delivery | Distributional, regional, Indigenous, gender, racial, disability and intergenerational effects | Continuity, records, institutional memory, incident response and recovery capability | No public institution as automatic administrative capacity | No published plan, budget or dashboard as automatic accountable delivery | No compliance activity as automatic institutional effectiveness | Independent legality, capability, delivery, integrity and public-value review | Human government-capability and delivery decision | Dated government-capability, accountability and remedy receipt");
const accountabilityGates = gates("99-AG", "Verified representative-democracy and government-capability baseline | Revenue, budget, expenditure, asset, liability, procurement, grant, program, institution, jurisdiction and period identity | Budget authority, appropriation, commitment, obligation, payment, accrual and outcome linkage | Fiscal transparency, comprehensiveness, timeliness, comparability, reconciliation and public accessibility | Accounting policy, controls, materiality, consolidation, valuation, contingent liability and off-budget activity | Internal audit, supreme audit, legislative scrutiny, follow-up, correction and recovery | Procurement need, option appraisal, competition, award, contract, change order, performance and closeout | Vendor identity, beneficial ownership, conflicts, sanctions, lobbying, integrity and concentration risk | Grants, transfers, tax expenditures, guarantees, subsidies and public-support additionality | Open meetings, agendas, minutes, votes, registers, reasons and decision traceability | Records creation, retention, classification, access request, disclosure, appeal and proactive publication | Open data definition, provenance, metadata, accessibility, usability, licensing and update continuity | Complaint, whistleblower, ombuds, inspector, ethics, anti-corruption and enforcement pathways | Privacy, confidentiality, security, Indigenous data governance and protected-information safeguards | Public participation, civic monitoring, journalism, research and affected-community usability | Distributional, territorial, service, equity, climate and intergenerational accountability | No budget publication as automatic fiscal transparency | No audit finding count as automatic correction or recovered public value | No open-data portal as automatic usable civic information | No procurement compliance as automatic integrity, competition or value | Independent fiscal, procurement, openness, remedy and public-value review | Dated accountability, transparency and correction receipt");
const legitimacyGates = gates("99-LG", "Verified democracy, government-capability and public-accountability baseline | Institution, information provider, media outlet, platform, audience, community, jurisdiction and period identity | Civic-information need, public-interest question, language, format, channel, accessibility and reach | Media freedom, pluralism, ownership, concentration, independence, local news and journalist safety | Public broadcasting, community media, libraries, archives, schools and civic-knowledge infrastructure | Source provenance, evidence, correction, verification, uncertainty, context and information-integrity safeguards | Platform governance, ranking, moderation, advertising, recommender, bot and synthetic-media transparency | Freedom of expression, privacy, association, press, access-to-information and due-process protections | Rumor, propaganda, harassment, intimidation, hate, incitement and coordinated manipulation risk | Public consultation, deliberation, petition, assembly, participation, response and demonstrated influence | Institutional competence, reliability, responsiveness, fairness, impartiality and rights protection | Trust measurement, nonresponse, subgroup distribution, experience, expectation and causal interpretation | Legitimacy through lawful authority, procedural justice, performance, inclusion, accountability and remedy | Approval, confidence, satisfaction, compliance and trust distinguished from legitimacy | Government continuity, succession, service continuity and constitutional continuity distinguished from resilience | Democratic backsliding, capture, corruption, polarization, exclusion and violence early warning | Civic space, opposition, minority, Indigenous, gender, youth, disability and affected-community safeguards | Institutional learning, correction, renewal, reform, peaceful contestation and non-recurrence | No open data, communication volume or public consultation count as automatic usable civic information | No approval, compliance or trust score as automatic institutional legitimacy | No government continuity as automatic democratic resilience | No automated credibility, citizen, institution, media or jurisdiction score or rank | Independent information, rights, trust, legitimacy, resilience and public-value review | Human legitimacy-resilience decision and dated receipt");

const democracyClasses = taxonomy("99-DCL", "Franchise and voter registration | Candidacy and ballot access | Electoral administration | Districts and representation systems | Campaign finance and political advertising | Parties and political organization | Voting, counting and certification | Observation, audit and dispute resolution | Peaceful transfer and succession | Direct, participatory and deliberative democracy | Civil society, assembly and association | Indigenous self-government and representation | Inclusion of underrepresented communities | Democratic integrity and anti-corruption", "democracy_class_id");
const democracyDimensions = taxonomy("99-DRM", "Universal equal franchise | Practical ballot access | Competitive candidate access | Independent administration | Accessible trustworthy information | Secure auditable voting | Fair representation | Inclusive participation | Protected civic space | Peaceful constitutional transfer | Effective challenge and remedy | Independent democracy public-value review", "democracy_dimension_id");
const democracySafeguards = taxonomy("99-DRS", "No election held as representative democracy | No turnout rate as equal participation | Complete voter, candidate and constituency identity | Equal rights and nondiscrimination | Accessible language and disability support | Ballot secrecy and privacy | Campaign-finance and influence transparency | No automated voter eligibility or political risk score | Electoral independence and chain of custody | Indigenous jurisdiction and political rights | Independent observation, appeal and remedy | No ranking of voters, candidates, communities or jurisdictions", "democracy_safeguard_id");
const governmentClasses = taxonomy("99-GCL", "Constitutional governance | Legislative institutions | Executive government | Public administration | Local and regional government | Indigenous government and treaty administration | Regulatory administration | Public-service workforce | Digital government and public data systems | Public procurement and grants administration | Intergovernmental coordination | Emergency and continuity administration | Integrity, ethics and anti-corruption | Administrative justice and remedy", "government_capability_class_id");
const governmentDimensions = taxonomy("99-GDM", "Lawful clear mandate | Checks and balances | Capable legislature | Coordinated executive | Skilled impartial public service | Adequate operating resources | Accessible service delivery | Reliable administrative data | Transparent reasoned decisions | Accountable implementation | Learning and correction | Independent government public-value review", "government_capability_dimension_id");
const governmentSafeguards = taxonomy("99-GRS", "No institution as administrative capacity | No plan as delivered outcome | No budget as implementation | Complete mandate, office and workforce identity | Separation of powers and lawful delegation | Merit, neutrality and whistleblower protection | Accessibility and nondiscrimination | Indigenous jurisdiction and consent | Privacy, security and records integrity | No automated public-service eligibility or performance decision | Independent oversight, appeal and correction | No institution, official, worker or jurisdiction ranking", "government_safeguard_id");
const accountabilityClasses = taxonomy("99-ACL", "Budget transparency | Revenue and tax transparency | Expenditure and performance | Public assets and liabilities | Internal control and internal audit | Supreme audit and legislative scrutiny | Procurement and contracting | Grants, transfers and subsidies | Ethics, lobbying and beneficial ownership | Anti-corruption and enforcement | Open meetings and decision records | Access to information | Open data and public-use infrastructure | Complaint, whistleblower and remedy systems", "accountability_class_id");
const accountabilityDimensions = taxonomy("99-ADM", "Complete fiscal perimeter | Timely comparable reporting | Traceable authority and expenditure | Auditable procurement lifecycle | Disclosed ownership and influence | Accessible records and meetings | Usable open public data | Protected reporting and complaints | Independent audit and scrutiny | Corrective action and recovery | Public participation and monitoring | Independent accountability public-value review", "accountability_dimension_id");
const accountabilitySafeguards = taxonomy("99-ARS", "No published budget as fiscal transparency | No audit count as correction | No portal as usable open data | No compliance as procurement integrity | Complete transaction, vendor and authority identity | Privacy and protected-information boundaries | Indigenous data governance | Accessibility and machine readability | Conflict, lobbying and ownership disclosure | Whistleblower protection and non-retaliation | Independent appeal, enforcement and remedy | No automated corruption, vendor or jurisdiction score", "accountability_safeguard_id");
const legitimacyClasses = taxonomy("99-LCL", "Civic information access | Media freedom and journalist safety | Media pluralism and ownership | Local and community news | Public broadcasting and civic institutions | Digital platforms and recommender systems | Information integrity and verification | Public consultation and deliberation | Petition, assembly and civic participation | Public trust and institutional experience | Procedural justice and fair treatment | Institutional legitimacy | Democratic renewal and reform | Democratic resilience and non-recurrence", "legitimacy_class_id");
const legitimacyDimensions = taxonomy("99-LDM", "Accessible civic information | Independent plural media | Safe civic and journalistic space | Verifiable contextual evidence | Transparent platform governance | Meaningful public participation | Demonstrated institutional responsiveness | Competent reliable delivery | Fair rights-protective process | Accountable correction and remedy | Democratic learning and renewal | Independent legitimacy-resilience public-value review", "legitimacy_dimension_id");
const legitimacySafeguards = taxonomy("99-LRS", "No open data as usable civic information | No communication volume as informed public | No consultation count as public influence | No approval or compliance as legitimacy | No continuity as democratic resilience | Complete institution, audience and information identity | Expression, press, privacy and association rights | Media ownership and platform transparency | Subgroup and nonresponse-aware trust evidence | No automated credibility or legitimacy score | Independent challenge, correction and remedy | No ranking of people, media, institutions or jurisdictions", "legitimacy_safeguard_id");
const longHorizonTests = taxonomy("99-LHT", "Inclusive representative democracy | Equal meaningful political participation | Peaceful constitutional transfer | Capable rights-protective public administration | Accountable delivered government commitments | Transparent recoverable public value | Usable plural civic information | Safe independent civic and media space | Fair responsive public institutions | Earned institutional trust and legitimacy | Democratic renewal after failure or capture | Democratic resilience under compound internal and external shocks", "long_horizon_democratic_resilience_test_id");

const democracyDossiers = upstream.map((record, index) => ({
  ...common(record, index, "elections_representation_participation_inclusion_democratic_integrity_dossier_id", "99-DRD", "99-drd", "elections_representation_participation_inclusion_democratic_integrity_dossier"),
  defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledger_id: record.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledger_id,
  democracy_state: "Inactive - No Verified Phase 98 Security And Peace-Stewardship Record",
  democracy_decision: "Not Open",
  democracy_checks: inactiveChecks(democracyGates, "No verified Phase 98 security and peace-stewardship predecessor or Phase 99 democracy receipt exists."),
  democracy_class_records: democracyClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  democracy_dimension_records: democracyDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  democracy_safeguard_records: democracySafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("verified_phase98_security_peace_records", "voter_records", "candidate_records", "party_records", "constituency_records", "franchise_records", "registration_records", "campaign_finance_records", "voting_records", "counting_records", "certification_records", "representation_records", "participation_records", "transfer_records", "challenge_records", "review_records", "remedy_records"),
  democracy_receipt_id: null,
  election_held_as_representative_democracy_allowed: false,
  automatic_democracy_or_representation_decision_allowed: false
}));
const governmentLedgers = upstream.map((record, index) => ({
  ...common(record, index, "constitutional_legislative_executive_public_administration_capability_ledger_id", "99-GCL", "99-gcl", "constitutional_legislative_executive_public_administration_capability_ledger"),
  elections_representation_participation_inclusion_democratic_integrity_dossier_id: democracyDossiers[index].elections_representation_participation_inclusion_democratic_integrity_dossier_id,
  government_capacity_state: "Inactive - No Adopted Democracy And Representation Baseline",
  government_capacity_decision: "Not Open",
  government_checks: inactiveChecks(governmentGates, "No adopted democracy and representation baseline or Phase 99 government-capability receipt exists."),
  government_capability_class_records: governmentClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  government_capability_dimension_records: governmentDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  government_safeguard_records: governmentSafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("institution_records", "mandate_records", "legislative_records", "executive_records", "delegation_records", "public_service_records", "workforce_records", "administrative_process_records", "plan_records", "budget_records", "program_records", "delivery_records", "service_records", "coordination_records", "integrity_records", "continuity_records", "review_records", "correction_records"),
  government_capacity_receipt_id: null,
  public_institution_as_administrative_capacity_allowed: false,
  published_plan_as_accountable_delivery_allowed: false,
  automatic_government_capability_or_delivery_decision_allowed: false
}));
const accountabilityRegisters = upstream.map((record, index) => ({
  ...common(record, index, "public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_register_id", "99-AGR", "99-agr", "public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_register"),
  constitutional_legislative_executive_public_administration_capability_ledger_id: governmentLedgers[index].constitutional_legislative_executive_public_administration_capability_ledger_id,
  accountability_state: "Inactive - No Verified Democracy And Government-Capability Baseline",
  accountability_decision: "Not Open",
  accountability_checks: inactiveChecks(accountabilityGates, "No verified democracy and government-capability baseline or Phase 99 accountability receipt exists."),
  accountability_class_records: accountabilityClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  accountability_dimension_records: accountabilityDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  accountability_safeguard_records: accountabilitySafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  ...empty("revenue_records", "budget_records", "expenditure_records", "asset_records", "liability_records", "accounting_records", "control_records", "audit_records", "procurement_records", "vendor_records", "contract_records", "grant_records", "meeting_records", "records_access_records", "open_data_records", "complaint_records", "enforcement_records", "correction_records", "recovery_records", "review_records"),
  accountability_receipt_id: null,
  open_data_as_usable_civic_information_allowed: false,
  compliance_as_integrity_or_public_value_allowed: false,
  automatic_accountability_or_transparency_decision_allowed: false
}));
const legitimacyLedgers = upstream.map((record, index) => ({
  ...common(record, index, "civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledger_id", "99-LRL", "99-lrl", "civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledger"),
  public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_register_id: accountabilityRegisters[index].public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_register_id,
  elections_representation_participation_inclusion_democratic_integrity_dossier_id: democracyDossiers[index].elections_representation_participation_inclusion_democratic_integrity_dossier_id,
  legitimacy_state: "Inactive - No Verified Democracy, Government And Accountability Baseline",
  legitimacy_decision: "Not Open",
  legitimacy_checks: inactiveChecks(legitimacyGates, "No verified democracy, government and accountability baseline or Phase 99 legitimacy-resilience receipt exists."),
  legitimacy_class_records: legitimacyClasses.map((item) => ({ ...item, class_state: "Unassessed" })),
  legitimacy_dimension_records: legitimacyDimensions.map((item) => ({ ...item, dimension_state: "Not Measured" })),
  legitimacy_safeguard_records: legitimacySafeguards.map((item) => ({ ...item, safeguard_state: "Unverified" })),
  long_horizon_democratic_resilience_test_records: longHorizonTests.map((item) => ({ ...item, test_state: "Not Tested" })),
  ...empty("civic_information_records", "media_records", "ownership_records", "journalist_safety_records", "platform_records", "provenance_records", "correction_records", "consultation_records", "participation_records", "response_records", "trust_records", "fairness_records", "legitimacy_records", "backsliding_records", "renewal_records", "resilience_records", "review_records", "remedy_records"),
  legitimacy_receipt_id: null,
  approval_or_compliance_as_legitimacy_allowed: false,
  government_continuity_as_democratic_resilience_allowed: false,
  automatic_credibility_trust_legitimacy_or_resilience_decision_allowed: false
}));

const registry = {
  schema_version: "1.0",
  phase: "99",
  title: "Democracy, Government, Public Administration, Civic Information And Institutional Legitimacy",
  effective_date: "2026-08-27",
  record_status: "Published",
  operating_state: "governed_empty_state",
  decision_boundary: "This registry does not create a voter, candidate, party, election, representation, participation, government-capability, public-service, budget, audit, procurement, open-government, civic-information, media, trust, legitimacy, resilience, receipt, score, rank, Phase 64 advance, or operating-outcome decision.",
  interpretation_boundary: "An election held is not inclusive representative democracy. A public institution is not administrative capacity. A published plan is not accountable government delivery. Open data is not usable civic information. Approval or compliance is not institutional legitimacy. Government continuity is not democratic resilience.",
  democracy_gates: democracyGates,
  government_gates: governmentGates,
  accountability_gates: accountabilityGates,
  legitimacy_gates: legitimacyGates,
  democracy_classes: democracyClasses,
  democracy_dimensions: democracyDimensions,
  democracy_safeguards: democracySafeguards,
  government_capability_classes: governmentClasses,
  government_capability_dimensions: governmentDimensions,
  government_safeguards: governmentSafeguards,
  accountability_classes: accountabilityClasses,
  accountability_dimensions: accountabilityDimensions,
  accountability_safeguards: accountabilitySafeguards,
  legitimacy_classes: legitimacyClasses,
  legitimacy_dimensions: legitimacyDimensions,
  legitimacy_safeguards: legitimacySafeguards,
  long_horizon_democratic_resilience_tests: longHorizonTests,
  elections_representation_participation_inclusion_democratic_integrity_dossiers: democracyDossiers,
  constitutional_legislative_executive_public_administration_capability_ledgers: governmentLedgers,
  public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers: accountabilityRegisters,
  civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers: legitimacyLedgers,
  metrics: {
    verified_phase98_security_peace_records_received: 0,
    democracy_representation_decisions: 0,
    government_capability_delivery_decisions: 0,
    public_accountability_transparency_decisions: 0,
    civic_information_legitimacy_resilience_decisions: 0,
    independent_reviews_completed: 0,
    receipts_created: 0,
    scores_created: 0,
    rankings_created: 0,
    phase64_cells_advanced: 0
  }
};
await writeJson(join(dataRoot, "phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-registry.json"), registry);

const guideDefinitions = [
  ["democracy-government-public-administration-civic-information-legitimacy-doctrine-001", "Democracy, Government, Public Administration, Civic Information And Legitimacy Doctrine 001", "A governed doctrine from inclusive representation through capable government, public accountability, civic information and democratic resilience."],
  ["elections-franchise-representation-participation-integrity-001", "Elections, Franchise, Representation, Participation And Integrity 001", "Separate an election event from equal franchise, practical participation, fair representation and democratic integrity."],
  ["electoral-administration-campaign-finance-boundaries-transition-001", "Electoral Administration, Campaign Finance, Boundaries And Peaceful Transition 001", "Trace administration, influence, districting, auditability, challenge and constitutional transfer."],
  ["legislatures-constitutional-accountability-law-making-oversight-001", "Legislatures, Constitutional Accountability, Lawmaking And Oversight 001", "Govern representative lawmaking, debate, scrutiny, checks, implementation and review."],
  ["executive-government-delivery-public-administration-capability-001", "Executive Government, Delivery And Public-Administration Capability 001", "Separate institutions and plans from mandate, coordination, operating capacity and accountable results."],
  ["public-service-merit-integrity-capability-continuity-001", "Public Service Merit, Integrity, Capability And Continuity 001", "Trace a skilled impartial workforce, lawful administration, protected reporting, learning and succession."],
  ["fiscal-transparency-budget-audit-procurement-integrity-001", "Fiscal Transparency, Budget, Audit And Procurement Integrity 001", "Connect authority and public money to traceable delivery, independent scrutiny, correction and recovered value."],
  ["open-government-records-access-public-reasoning-accountability-001", "Open Government, Records Access, Public Reasoning And Accountability 001", "Separate publication from accessible records, reasoned decisions, usable data, challenge and remedy."],
  ["civic-information-media-pluralism-local-news-information-integrity-001", "Civic Information, Media Pluralism, Local News And Information Integrity 001", "Trace accessible public-interest information, independent plural media, provenance, correction and safe journalism."],
  ["public-consultation-petition-participatory-deliberative-democracy-001", "Public Consultation, Petition, Participatory And Deliberative Democracy 001", "Require accessible participation, institutional response and demonstrated influence beyond consultation counts."],
  ["public-trust-institutional-legitimacy-rights-performance-fairness-001", "Public Trust, Institutional Legitimacy, Rights, Performance And Fairness 001", "Separate approval and compliance from lawful authority, fair treatment, performance, inclusion, accountability and remedy."],
  ["democratic-resilience-continuity-renewal-nonrecurrence-001", "Democratic Resilience, Continuity, Renewal And Non-Recurrence 001", "Trace constitutional continuity, resistance to capture, civic space, correction, reform and democratic renewal."]
];
const sourceIds = [...new Set(upstream.flatMap((record) => record.source_ids))];
const signalIds = [...new Set(upstream.flatMap((record) => record.signal_ids))];
const evidenceGapIds = [...new Set(upstream.flatMap((record) => record.evidence_gap_ids))];
const localSystemIds = [...new Set(upstream.flatMap((record) => record.local_system_ids))];
const yamlList = (items) => items.map((item) => "  - \"" + item + "\"").join("\n");
const sharedBody = [
  "",
  "## Governed democracy, government and legitimacy chain",
  "",
  "Phase 99 begins only after a verified Phase 98 security and peace-stewardship record. It separates representative democracy; constitutional government and public-administration capability; fiscal, audit, procurement and open-government accountability; then civic information, media pluralism, public trust, institutional legitimacy and democratic resilience.",
  "",
  "## Representative democracy",
  "",
  "Trace franchise, access, candidacy, administration, counting, representation, participation, integrity, challenge and peaceful transfer. An election held is not inclusive representative democracy.",
  "",
  "## Government capability and delivery",
  "",
  "Trace mandate, checks and balances, legislative and executive process, public-service capability, coordination, delivery, continuity and correction. A public institution is not administrative capacity, and a published plan is not accountable government delivery.",
  "",
  "## Public accountability and open government",
  "",
  "Trace public money, audit, procurement, influence, records, meetings, open data, complaints, enforcement and remedy. Publication and compliance are not usable transparency, integrity or recovered public value.",
  "",
  "## Civic information, legitimacy and resilience",
  "",
  "Trace accessible civic information, media pluralism, platform governance, participation, responsiveness, fair treatment, trust, legitimacy, renewal and resilience. Open data is not usable civic information; approval is not legitimacy; continuity is not resilience.",
  "",
  "## Decision boundary",
  "",
  "The registry is deliberately empty. It contains no verified Phase 98 predecessor, democracy, government, accountability, civic-information, legitimacy or resilience decision; no review or receipt; and no score, rank, Phase 64 advance or operating-outcome change.",
  ""
].join("\n");
const guideIds = [];
for (const [slug, title, summary] of guideDefinitions) {
  const id = "briefing-" + slug;
  guideIds.push(id);
  const frontmatter = [
    "---",
    "id: \"" + id + "\"",
    "title: \"" + title + "\"",
    "slug: \"" + slug + "\"",
    "record_status: \"Published\"",
    "summary: \"" + summary + "\"",
    "published_date: 2026-08-27",
    "captured_date: 2026-08-27",
    "signal_ids:",
    yamlList(signalIds),
    "evidence_gap_ids:",
    yamlList(evidenceGapIds),
    "claim_scope: \"Editorial Synthesis\"",
    "local_evidence_level: \"General Source Layer\"",
    "last_reviewed_date: 2026-08-27",
    "top_takeaways:",
    "  - \"Democracy, government capability, accountability, civic information, legitimacy and resilience require separate governed records.\"",
    "  - \"Elections, institutions, plans, publications, compliance, approval and continuity cannot substitute for verified outcomes.\"",
    "  - \"No democratic, governmental, informational, legitimacy, score, ranking or operating-outcome decision is created by this guide.\"",
    "constraint_watch:",
    "  - \"Public Trust\"",
    "  - \"Infrastructure\"",
    "  - \"Capital\"",
    "  - \"Labor\"",
    "  - \"Regulation\"",
    "  - \"Interpretation\"",
    "what_to_watch_next:",
    "  - \"A verified Phase 98 security and peace-stewardship record\"",
    "  - \"Separately reviewed democracy, government, accountability and legitimacy decisions\"",
    "  - \"Real dated participation, delivery, transparency, correction, legitimacy and resilience receipts\"",
    "---",
    "",
    summary,
    sharedBody
  ].join("\n");
  await writeFile(join(contentRoot, "briefings", id + ".mdx"), frontmatter, "utf8");
}

const mapDefinitions = [
  ["election-held-is-not-inclusive-representative-democracy", "An Election Held Is Not Inclusive Representative Democracy", "From an electoral event through equal franchise, practical access, fair administration, representation, participation, challenge and peaceful transfer."],
  ["public-institution-is-not-administrative-capacity", "A Public Institution Is Not Administrative Capacity", "From formal institutional existence through lawful mandate, skilled people, operating resources, coordination, service and correction."],
  ["published-plan-is-not-accountable-government-delivery", "A Published Plan Is Not Accountable Government Delivery", "From stated intent through authority, resources, milestones, implementation, outcomes, distribution, scrutiny and remedy."],
  ["open-data-is-not-usable-civic-information", "Open Data Is Not Usable Civic Information", "From publication through provenance, context, accessibility, machine readability, continuity, public-interest use and correction."],
  ["approval-or-compliance-is-not-institutional-legitimacy", "Approval Or Compliance Is Not Institutional Legitimacy", "From measured confidence or rule-following through lawful authority, fair process, rights protection, performance, inclusion, accountability and remedy."],
  ["government-continuity-is-not-democratic-resilience", "Government Continuity Is Not Democratic Resilience", "From uninterrupted offices or services through constitutional order, civic space, plural contestation, resistance to capture, renewal and non-recurrence."]
];
const mapIds = [];
for (const [slug, title, summary] of mapDefinitions) {
  const id = "dependency-map-" + slug;
  mapIds.push(id);
  await writeJson(join(contentRoot, "dependency-maps", slug + ".json"), {
    id,
    title,
    slug,
    summary,
    map_type: "Dependency Stack",
    record_status: "Published",
    primary_topic: "Policy and Standards",
    framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"],
    constraint_tags: ["Public Trust", "Infrastructure", "Capital", "Labor", "Regulation", "Interpretation"],
    map_question: "What records are required before " + title.toLowerCase() + " can support a bounded democracy, government, accountability or legitimacy decision?",
    interpretation_boundary: registry.interpretation_boundary,
    source_ids: sourceIds,
    signal_ids: signalIds,
    technology_ids: [],
    local_system_ids: localSystemIds,
    evidence_gap_ids: evidenceGapIds,
    nodes: [
      { id: "node-peace", label: "Verified Phase 98 security and peace-stewardship chain", node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying Phase 98 record exists." },
      { id: "node-democracy", label: "Inclusive representative democracy", node_type: "Constraint", note: "An election event is not representative democracy." },
      { id: "node-government", label: "Capable accountable government delivery", node_type: "Constraint", note: "Institutions and plans are not operating capacity or delivery." },
      { id: "node-accountability", label: "Fiscal, audit, procurement and open-government accountability", node_type: "Constraint", note: "Publication and compliance are not usable transparency or integrity." },
      { id: "node-legitimacy", label: "Civic information, legitimacy and democratic resilience", node_type: "Constraint", note: "Approval and continuity are not legitimacy or resilience." },
      { id: "node-receipt", label: "Independent review, challenge, correction, remedy and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase 99 receipt exists." }
    ],
    links: [["node-peace", "node-democracy"], ["node-democracy", "node-government"], ["node-government", "node-accountability"], ["node-accountability", "node-legitimacy"], ["node-legitimacy", "node-receipt"]].map(([from, to]) => ({ from, to, relationship: "Depends On", confidence: "Missing Evidence", note: "The downstream decision remains closed until its predecessor is reviewed and receipted." })),
    what_this_map_supports: ["Separate democracy, government-capability, accountability, civic-information, legitimacy and resilience decisions.", "Explicit authority, identities, rights, inclusion, distribution, alternatives, review, correction and remedy.", "Public reasoning without voter, candidate, institution, media, community or jurisdiction scoring or ranking."],
    what_this_map_does_not_prove: ["It does not establish representative democracy, administrative capacity, accountable delivery, usable civic information, legitimacy or resilience.", "It does not convert elections, institutions, plans, portals, approval, compliance or continuity into outcomes.", "It does not create a receipt, score, rank, stage advance or operating-outcome change."],
    next_records_needed: ["A verified Phase 98 security and peace-stewardship chain.", "Separately adopted democracy, government, accountability and legitimacy decisions.", "Independent participation, delivery, fiscal, information, trust, correction and propagation receipts."]
  });
}

const pathwayIds = [...new Set(democracyDossiers.flatMap((record) => record.reader_pathway_ids))];
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
  const records = [democracyDossiers[index], governmentLedgers[index], accountabilityRegisters[index], legitimacyLedgers[index]];
  const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy boundary")) {
    const links = records.map((record) => {
      const value = Object.values(record).find((item) => typeof item === "string" && /^99-(DRD|GCL|AGR|LRL)-/.test(item));
      return "[" + value + "](/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/" + record.slug + "/)";
    });
    body = body.trimEnd() + "\n\n## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy boundary\n\nThe [Democracy, Government, Public Administration, Civic Information And Institutional Legitimacy Registry](/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/) assigns " + links.join(", ") + " to this named file. No democracy, government-capability, accountability, civic-information, legitimacy, resilience, receipt, score, rank, or Phase 64 cell change exists.\n";
    await writeFile(path, body, "utf8");
  }
}
const localFiles = ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"];
for (const filename of localFiles) {
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy boundary")) {
    body = body.trimEnd() + "\n\n## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy boundary\n\nThe [Democracy, Government, Public Administration, Civic Information And Institutional Legitimacy Registry](/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/) connects this place to representation, government capability, public accountability, civic information, institutional legitimacy and democratic resilience. Elections, institutions, plans, portals, approval, compliance and continuity do not establish outcomes.\n";
    await writeFile(path, body, "utf8");
  }
}
const operatingBriefings = ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"];
for (const name of operatingBriefings) {
  const path = join(contentRoot, "briefings", name);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy control")) {
    body = body.trimEnd() + "\n\n## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy control\n\nThe [Democracy, Government, Public Administration, Civic Information And Institutional Legitimacy Registry](/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/) adds eight inactive democracy dossiers, eight inactive government-capability ledgers, eight inactive accountability registers, and eight inactive legitimacy-resilience ledgers. It creates zero democracy, representation, government-delivery, accountability, civic-information, legitimacy, resilience, receipt, score, ranking, or stage decisions.\n";
    await writeFile(path, body, "utf8");
  }
}
await writeJson(join(contentRoot, "updates", "2026-08-27-phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy.json"), {
  id: "update-2026-08-27-phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy",
  effective_date: "2026-08-27",
  entry_type: "Source Refresh",
  title: "Phase 99 adds democracy, government, civic-information, legitimacy, and resilience controls",
  summary: "Eight inactive democracy dossiers, eight government-capability ledgers, eight accountability registers, and eight legitimacy-resilience ledgers expose the governance contract without deciding representation, administrative capacity, delivery, transparency, civic information, legitimacy, resilience, score, rank, or outcome for any person, candidate, party, institution, media organization, community, government, or jurisdiction.",
  affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"],
  related_paths: ["/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/", ...guideDefinitions.map(([slug]) => "/briefings/" + slug + "/"), "/data/democracy-government-public-administration-civic-information-institutional-legitimacy.json"],
  evidence_note: "This release contains empty democracy, government, accountability, civic-information, legitimacy and resilience contracts plus synthetic-only validation. It contains no verified Phase 98 predecessor or Phase 99 decision or receipt.",
  materiality: "No record-state change",
  publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence, justice, security, democracy and operating states unchanged.",
  next_check_date: "2026-09-01",
  work_package: "docs/work-packages/phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy.md"
});

console.log("Phase 99 content built: " + democracyDossiers.length + " inactive democracy dossiers, " + governmentLedgers.length + " inactive government ledgers, " + accountabilityRegisters.length + " inactive accountability registers, " + legitimacyLedgers.length + " inactive legitimacy ledgers, " + guideIds.length + " guides, " + mapIds.length + " maps, " + pathwayIds.length + " pathways, and 0 democracy, government, accountability, legitimacy, or resilience decisions.");
