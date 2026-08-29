import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "longitudinal-delivery-outcomes-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-029-longitudinal-delivery-outcomes";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const path of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"].map((name) => join(contentRoot, name))) {
  await mkdir(path, { recursive: true });
}

const phase56x = JSON.parse(await readFile(join(dataRoot, "phase-56x-implementation-to-outcome-expansion.json"), "utf8"));
if (phase56x.phase !== "56X" || phase56x.records.length !== 13) throw new Error("Phase 56Y requires the complete Phase 56X ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-56y-dot-iija-funding-status-may2026",
    name: "DOT IIJA funding status through May 31, 2026",
    url: "https://www.transportation.gov/mission/budget/infrastructure-investment-and-jobs-act-iija-funding-status",
    owner: "U.S. Department of Transportation",
    agency: "DOT",
    access: "Data Download",
    limitation: "The report combines formula and discretionary funding and reports budget authority, grants announced, obligations, and outlays in separate lifecycle columns. It does not measure completed projects or transportation outcomes and is not comparable to GAO's mostly unobligated discretionary-award review without an explicit series break.",
  },
  {
    id: "source-56y-ntia-bead-progress-dashboard-apr2026",
    name: "NTIA Initial Proposal Progress Dashboard",
    url: "https://www.ntia.gov/page/initial-proposal-progress-dashboard",
    owner: "National Telecommunications and Information Administration",
    agency: "NTIA",
    access: "Report Series",
    limitation: "The dashboard reports jurisdiction-level proposal and award-agreement milestones, not construction, service activation, adoption, disbursement, or broadband outcomes.",
  },
  {
    id: "source-56y-ntia-bead-performance-measures-2025",
    name: "NTIA BEAD Performance Measures Policy Notice",
    url: "https://broadbandusa.ntia.gov/sites/default/files/2025-09/Performance_Measures_Policy_Notice.pdf",
    owner: "National Telecommunications and Information Administration",
    agency: "NTIA",
    access: "Data Download",
    limitation: "The notice defines testing and reporting requirements for operational BEAD-funded networks. Requirements and test denominators are not observed performance results, construction validation, or evidence that every funded location is in service.",
  },
  {
    id: "source-56y-hanford-fire-piping-inspections-2026",
    name: "DOE EM: Hanford contractor completes major safety inspections ahead of schedule",
    url: "https://www.energy.gov/em/articles/hanford-contractor-completes-major-safety-inspections-ahead-schedule",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "DOE reports inspection completion and observed pipe condition. The article does not measure fire-event performance, all-site asset condition, independent audit results, or realized savings.",
  },
  {
    id: "source-56y-hanford-preventive-maintenance-2026",
    name: "DOE EM: Hanford Tank Farms maintain zero preventive-maintenance delinquencies",
    url: "https://www.energy.gov/em/articles/hanford-tank-farms-maintain-zero-delinquencies-preventive-maintenance",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "The zero-delinquency result covers preventive-maintenance tasks across Hanford Tank Farms for two months. It is not a zero-failure, safety-outcome, sitewide, or lifecycle-cost measure.",
  },
  {
    id: "source-56y-hanford-222s-lab-turnaround-2026",
    name: "DOE EM: Hanford 222-S Laboratory cuts turnaround times in half",
    url: "https://www.energy.gov/em/articles/modernization-efforts-lead-hanfords-222-s-lab-cut-turnaround-times-half",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "DOE reports a five-year operating-process improvement and associated instrumentation. The article is not an independent evaluation of cleanup outcomes, mission completion, or causal attribution to any single intervention.",
  },
  {
    id: "source-56y-srs-tank-waste-risk-reduction-2026",
    name: "DOE EM: Savannah River tank-waste cleanup marks record risk reduction",
    url: "https://www.energy.gov/em/articles/savannah-river-tank-waste-cleanup-marks-record-risk-reduction-four-years",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "DOE distinguishes processed radioactivity from natural decay and reports gallons and curies under different denominators. The agency attribution is not an independent causal evaluation, and forecast savings are separate from realized treatment output.",
  },
  {
    id: "source-56y-srs-drone-inspections-2026",
    name: "DOE EM: Savannah River partnership strengthens drone inspection capabilities",
    url: "https://www.energy.gov/em/articles/savannah-river-site-partnership-strengthens-drone-inspection-capabilities",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "The article reports flight counts and separate savings examples for distinct use cases. One inspection saving and an annual vegetation-management saving cannot be added or generalized to all drone work or safety outcomes.",
  },
  {
    id: "source-56y-idaho-iwtu-storage-expansion-2026",
    name: "DOE EM: Idaho project expands treated-waste storage",
    url: "https://www.energy.gov/em/articles/idaho-project-advances-cleanup-expanded-treated-waste-storage",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "Construction completion and state authorization establish added usable storage capacity, not additional waste treatment, permanent disposal, mission completion, or realized risk reduction.",
  },
  {
    id: "source-56y-idaho-iwtu-treatment-milestone-2026",
    name: "DOE EM: Idaho liquid-waste treatment surpasses state milestone",
    url: "https://www.energy.gov/em/articles/idaho-liquid-waste-treatment-surpasses-state-milestone",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "Current-run, cumulative, design-total, and rolling three-year treatment measures are different denominators. Surpassing an annual milestone does not establish completion of the remaining treatment mission.",
  },
  {
    id: "source-56y-srppf-contract-qa-2026",
    name: "NNSA SRS management-and-operating RFP questions and answers, Amendment 0001",
    url: "https://www.energy.gov/nnsa/articles/questions-and-answers-89233224rna000008-amendment-0001-4926",
    owner: "U.S. Department of Energy, National Nuclear Security Administration",
    agency: "DOE",
    access: "Data Download",
    limitation: "The answers support offeror understanding and are subordinate to the final RFP and amendments. Anticipated design, subcontract, delivery, baseline, and transition dates are forecasts rather than completed work or operational capability.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id, name: source.name, url: source.url, source_type: "Government Agency", credibility_level: "Tier 1",
    primary_topics: meta.topics, framework_layers: meta.layers, country_or_region: "United States", update_frequency: "Event Driven",
    capture_priority: "High", known_limitations: source.limitation, last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"], live_access_type: source.access,
    ...(source.access === "Data Download" ? { data_download_url: source.url } : {}), review_cadence_days: 45,
    monitoring_status: "Active", coverage_role: ["Primary Data", "Source Freshness"], jurisdiction: "United States federal government",
    source_owner: source.owner, notes: `Phase 56Y longitudinal delivery-and-outcome source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "dot-iija-aggregate-execution", agency: "DOT", actionKey: "DOT-IIJA-EXECUTION-01", stage: "Funding execution", publicationDate: "2026-07-10", sourceIds: ["source-56y-dot-iija-funding-status-may2026"],
    title: "DOT IIJA: aggregate authority, obligation, and outlay require an explicit series break",
    finding: "DOT reports $545.692 billion in adjusted IIJA budget authority, $392.472 billion obligated, and $237.220 billion outlayed through May 31, 2026, equal to 71.92 percent obligated and 43.47 percent outlayed.",
    denominator: "DOT IIJA formula and discretionary funding through May 31, 2026; dollar values are converted from the report's thousands-of-dollars table.",
    limits: ["This universe includes formula and discretionary funding and is not directly comparable to Phase 56X's mostly unobligated discretionary-award review.", "An obligation is a binding agreement; an outlay is a payment. Neither establishes completed work or outcomes.", "Grants announced can include formula funding and competitive selections and is not used as a completion measure."],
    next: "Track operating-administration and program cohorts from obligation and payment into completed assets, service use, and measured outcomes without merging formula and discretionary series.",
  },
  {
    slug: "dot-fhwa-iija-execution", agency: "DOT", actionKey: "DOT-IIJA-FHWA-01", stage: "Funding execution", publicationDate: "2026-07-10", sourceIds: ["source-56y-dot-iija-funding-status-may2026"],
    title: "FHWA IIJA: obligations reach 82 percent while outlays remain a separate 55.4-percent payment series",
    finding: "DOT reports $320.662 billion in adjusted FHWA IIJA authority, $262.910 billion obligated, and $177.778 billion outlayed through May 31, 2026.",
    denominator: "Federal Highway Administration IIJA formula and discretionary funding; obligations are 82.0 percent and outlays are 55.4 percent of adjusted authority.",
    limits: ["FHWA formula and discretionary funds remain combined in this table.", "The grants-announced column is non-additive and can exceed adjusted authority because of contract-authority treatment.", "Payments do not establish project completion, road condition, safety, travel-time, or emissions outcomes."],
    next: "Follow stable FHWA program cohorts into completed projects and program-specific operating outcomes using the same funding universe.",
  },
  {
    slug: "dot-fta-iija-execution", agency: "DOT", actionKey: "DOT-IIJA-FTA-01", stage: "Funding execution", publicationDate: "2026-07-10", sourceIds: ["source-56y-dot-iija-funding-status-may2026"],
    title: "FTA IIJA: $56.710 billion obligated and $34.573 billion outlayed remain pre-outcome measures",
    finding: "DOT reports $98.931 billion in adjusted FTA IIJA authority, $56.710 billion obligated, and $34.573 billion outlayed through May 31, 2026.",
    denominator: "Federal Transit Administration IIJA formula and discretionary funding; obligations are 57.3 percent and outlays are 34.9 percent of adjusted authority.",
    limits: ["The series combines formula and discretionary funding.", "An outlay records payment, not delivery or acceptance of a transit asset.", "The record does not establish ridership, reliability, accessibility, safety, or emissions outcomes."],
    next: "Link FTA payment cohorts to accepted assets, service entry, operating reliability, use, and program-defined outcomes.",
  },
  {
    slug: "dot-fra-iija-execution", agency: "DOT", actionKey: "DOT-IIJA-FRA-01", stage: "Funding execution", publicationDate: "2026-07-10", sourceIds: ["source-56y-dot-iija-funding-status-may2026"],
    title: "FRA IIJA: obligation and outlay diverge sharply before project delivery",
    finding: "DOT reports $65.856 billion in adjusted FRA IIJA authority, $41.516 billion obligated, and $7.279 billion outlayed through May 31, 2026.",
    denominator: "Federal Railroad Administration IIJA formula and discretionary funding; obligations are 63.0 percent and outlays are 11.1 percent of adjusted authority.",
    limits: ["The difference between obligations and outlays is a lifecycle gap, not evidence of failure or completion.", "The series combines formula and discretionary funding.", "The record does not measure completed rail work, service, safety, capacity, or passenger outcomes."],
    next: "Track FRA programs from agreement execution and payment into construction completion, acceptance, service, and outcome evidence.",
  },
  {
    slug: "ntia-bead-award-agreement-funnel", agency: "NTIA", actionKey: "NTIA-BEAD-AGREEMENTS-01", stage: "Award-to-service contract", publicationDate: "2026-04-13", sourceIds: ["source-56y-ntia-bead-progress-dashboard-apr2026"],
    title: "BEAD: 56 submitted plans narrow to 44 signed award agreements",
    finding: "NTIA reports that all 56 eligible entities submitted final proposals, 53 received NTIA approval, 51 received NIST approval making grant funds available, and 44 had signed and returned award agreements as of April 13, 2026.",
    denominator: "Fifty-six eligible entities and four sequential final-proposal or agreement milestones on the April 2026 dashboard.",
    limits: ["The four counts are nested lifecycle stages, not independent program totals.", "A signed award agreement is not construction, service activation, or adoption.", "The dashboard does not report location-level disbursement or outcome measures."],
    next: "Track signed entities through subgrant agreements, construction, service availability, subscriber activation, performance testing, and closeout.",
  },
  {
    slug: "ntia-bead-operational-test-contract", agency: "NTIA", actionKey: "NTIA-BEAD-PERFORMANCE-01", stage: "Award-to-service contract", publicationDate: "2025-09-01", sourceIds: ["source-56y-ntia-bead-performance-measures-2025"],
    title: "BEAD performance testing: operational networks must preserve technology, speed-tier, and subscriber-sample denominators",
    finding: "NTIA requires annual testing during the period of performance and before closeout, with at least 100/20 Mbps for funded broadband locations, 1 Gbps symmetric for community anchor institutions, at least 95 percent of latency tests at or below 100 milliseconds, and average outages no greater than 48 hours over 365 days excluding force majeure.",
    denominator: "Operational BEAD-funded service by eligible entity, technology, speed tier, and random active-subscriber sample; sample floors are five locations at 50 or fewer subscribers, 10 percent at 51-500, and 50 at 500 or more.",
    limits: ["These are required measures, not observed results.", "Testing applies to operational service and is not construction validation.", "A passing sample does not establish universal adoption, affordability, or economic outcomes."],
    next: "Publish eligible-entity results only when the tested cohort, technology, speed tier, sample, period, exclusions, and closeout status are disclosed.",
  },
  {
    slug: "hanford-fire-piping-inspection-delivery", agency: "DOE", actionKey: "HANFORD-FIRE-PIPING-01", stage: "Sustained site operations", publicationDate: "2026-05-05", sourceIds: ["source-56y-hanford-fire-piping-inspections-2026"],
    title: "Hanford completes 176 internal fire-water piping inspections two years early",
    finding: "DOE reports completion of 176 internal water-piping inspections two years ahead of a five-year schedule and says the inspected systems were in good condition.",
    denominator: "The named internal piping inspection cohort completed by Hanford Mission Integration Solutions under the five-year inspection schedule.",
    limits: ["Inspection completion and observed condition do not measure fire-event performance.", "The cohort is not every water or fire-suppression asset at Hanford.", "The article does not provide an independent audit or realized-savings measure."],
    next: "Track corrective actions, repeat inspection results, system availability, failures, and fire-protection performance under the same asset cohort.",
  },
  {
    slug: "hanford-tank-farms-preventive-maintenance", agency: "DOE", actionKey: "HANFORD-TANK-PM-01", stage: "Sustained site operations", publicationDate: "2026-06-02", sourceIds: ["source-56y-hanford-preventive-maintenance-2026"],
    title: "Hanford Tank Farms sustains zero preventive-maintenance delinquencies for two months",
    finding: "DOE reports that Hanford Tank Farms maintained zero preventive-maintenance delinquencies for two consecutive months across scheduled calibrations, inspections, parts replacement, and cleaning.",
    denominator: "Preventive-maintenance tasks due across Hanford Tank Farms during the two reported months.",
    limits: ["Zero delinquent tasks is not zero equipment failure or zero corrective maintenance.", "The period is two months and is not a long-term reliability trend.", "The measure does not establish a sitewide safety or cleanup outcome."],
    next: "Extend the same task denominator across longer periods and link it cautiously to asset availability, corrective work, failures, and mission delays.",
  },
  {
    slug: "hanford-222s-lab-turnaround", agency: "DOE", actionKey: "HANFORD-222S-TURNAROUND-01", stage: "Sustained site operations", publicationDate: "2026-05-19", sourceIds: ["source-56y-hanford-222s-lab-turnaround-2026"],
    title: "Hanford 222-S Laboratory halves sample turnaround while handling a fourfold 2025 workload",
    finding: "DOE reports that the 222-S Laboratory reduced average sample-to-result time from about 180 days to less than 90 days over five years, added or modernized 29 instruments, and kept pace when workload increased fourfold in 2025.",
    denominator: "Average sample-to-result turnaround over the five-year modernization period; the 2025 workload comparison and a separate two-to-three-day-to-three-hour separation method are distinct measures.",
    limits: ["The article does not publish the sample count, distribution, or case mix behind the average.", "Instrument modernization and workflow changes are multiple interventions, so the record does not isolate causation.", "Laboratory turnaround is an enabling-process result, not cleanup completion or an environmental outcome."],
    next: "Track sample volumes, medians and tails, quality controls, backlog, mission decisions enabled, and sustained turnaround under comparable case mix.",
  },
  {
    slug: "srs-tank-waste-processed-risk-reduction", agency: "DOE", actionKey: "DOE-EM-SRS-RISK-01", stage: "Cleanup delivery and outcome", publicationDate: "2026-02-25", sourceIds: ["source-56y-srs-tank-waste-risk-reduction-2026"],
    title: "Savannah River: processed radioactivity and natural decay remain separate risk-reduction components",
    finding: "DOE reports 46 million fewer curies in Savannah River tank waste since 2022, attributing 36 million curies to processing facilities and the balance in part to natural decay; it also reports more than 10.6 million gallons processed through the Salt Waste Processing Facility since 2022.",
    denominator: "Tank-waste curies reduced since 2022, split by DOE-attributed processing and other change, plus a separate cumulative processed-gallons series.",
    limits: ["Curies and gallons are different units and cannot be combined.", "DOE's 36-million-curie processing attribution is agency-reported rather than an independent causal evaluation.", "The article's projected time and cost efficiencies are not realized output in this record."],
    next: "Track processed gallons, curies removed, natural decay, residual inventory, disposal, downtime, cost, and independent validation as separate longitudinal series.",
  },
  {
    slug: "srs-drone-inspection-delivery", agency: "DOE", actionKey: "DOE-EM-SRS-DRONE-01", stage: "Cleanup delivery and outcome", publicationDate: "2026-06-23", sourceIds: ["source-56y-srs-drone-inspections-2026"],
    title: "Savannah River: more than 50 drone flights support distinct infrastructure inspection use cases",
    finding: "DOE reports more than 50 drone flights since 2023 for infrastructure inspections, one inspection case saving more than $43,000, and a separate vegetation-management use case previously saving more than $170,000 per year across two closed reactor buildings.",
    denominator: "More than 50 flights since 2023; one case-specific inspection saving and one separate two-building annual vegetation-management estimate.",
    limits: ["The two savings figures cover different use cases and must not be added.", "One case saving does not establish portfolio-wide return on investment.", "Flight counts and cost estimates do not establish improved safety, asset condition, or mission outcomes."],
    next: "Track inspection cohorts, avoided work methods, verified cost baselines, findings, corrective actions, and safety or availability effects by use case.",
  },
  {
    slug: "idaho-iwtu-storage-accepted-capacity", agency: "DOE", actionKey: "DOE-EM-IDAHO-STORAGE-01", stage: "Cleanup delivery and outcome", publicationDate: "2026-01-27", sourceIds: ["source-56y-idaho-iwtu-storage-expansion-2026"],
    title: "Idaho IWTU: completed and state-authorized storage adds 48 vaults",
    finding: "DOE reports that a 20,000-square-foot storage building was completed in September 2025 and authorized by Idaho in December 2025, adding 48 concrete vaults for a total of 84 vaults and 1,344 treated-waste canisters.",
    denominator: "Authorized onsite storage capacity after the addition: 84 vaults and 1,344 canisters; the project had an estimated cost of $23 million.",
    limits: ["Added storage capacity is not additional waste treated.", "Onsite storage is not permanent disposal and awaits a future repository pathway.", "Estimated project cost is not a verified final lifecycle cost or realized saving."],
    next: "Track vault use, canisters placed, authorization compliance, final project cost, storage performance, and the permanent disposal pathway separately.",
  },
  {
    slug: "idaho-iwtu-treatment-throughput", agency: "DOE", actionKey: "DOE-EM-IDAHO-TREATMENT-01", stage: "Cleanup delivery and outcome", publicationDate: "2026-06-30", sourceIds: ["source-56y-idaho-iwtu-treatment-milestone-2026"],
    title: "Idaho IWTU: current-run and cumulative treatment volumes preserve separate denominators",
    finding: "DOE reports more than 130,000 gallons treated in the current processing run and nearly 400,000 gallons treated since operations began in 2023, against an approximately 900,000-gallon total mission.",
    denominator: "Current-run gallons, cumulative gallons since 2023, and approximately 900,000 gallons of original inventory; the state plan separately requires at least 15 percent annually on a rolling three-year average.",
    limits: ["Current-run, cumulative, total-inventory, and rolling-average percentages are different measures.", "Surpassing a state milestone does not establish full treatment or permanent disposal.", "DOE estimates five to seven years to complete treatment including maintenance, which is a forecast."],
    next: "Track accepted treated volume, downtime, maintenance, canister storage, rolling-plan compliance, residual inventory, and final disposal under stable denominators.",
  },
  {
    slug: "nnsa-lap4-fy2027-delivery-plan", agency: "DOE", actionKey: "NNSA-LAP4-DELIVERY-01", stage: "Project implementation", publicationDate: "2026-05-01", sourceIds: ["source-56w-nnsa-fy2027-weapons-activities"],
    title: "LAP4 FY 2027: approved 30 Diamond changes update the planning basis but do not establish production capability",
    finding: "NNSA requests $812.1 million for LAP4 in FY 2027 and reports an approved current planning basis of $5.865353 billion with CD-4 in the fourth quarter of FY 2032; approved 30 Diamond baseline changes are reflected while two remaining subprojects were anticipated for baselining in FY 2026.",
    denominator: "The five-subproject LAP4 construction project and its current planning basis; the FY 2027 request comprises $762.029 million TEC and $50.071 million OPC.",
    limits: ["The overall project estimate has not been updated since CD-1 and full TPC awaits baselining of every subproject.", "An annual request and approved baseline changes are not completed installation, CD-4, operational acceptance, or 30-pit-per-year capability.", "This project planning basis is not the complete multi-site pit-production capability lifecycle estimate."],
    next: "Track each subproject's CD-2/3, approved scope, construction, equipment installation, CD-4, operational acceptance, and attributable production contribution.",
  },
  {
    slug: "nnsa-srppf-transition-delivery-inputs", agency: "DOE", actionKey: "NNSA-SRPPF-DELIVERY-01", stage: "Project implementation", publicationDate: "2026-04-09", sourceIds: ["source-56y-srppf-contract-qa-2026", "source-56w-nnsa-fy2027-weapons-activities"],
    title: "SRPPF transition: leased warehouse and design forecasts remain delivery inputs",
    finding: "NNSA's SRS procurement answers report a leased offsite warehouse of about 225,000 square feet plus an approximately 4.25-acre laydown yard, while anticipating 90-percent drawings by September 30, 2026 and design of all then-anticipated Main Processing Building gloveboxes before contract transition.",
    denominator: "Named transition facilities and forecast deliverables in Amendment 0001 procurement answers; the FY 2027 volume separately reports approved HFTOC CD-2/3 and MPB site-preparation decisions.",
    limits: ["Procurement answers are subordinate to the final RFP and amendments.", "Anticipated drawings, designs, subcontracts, and delivery dates are forecasts, not accepted deliverables.", "Warehouse capacity and design progress do not establish installed equipment, CD-4, operational acceptance, or pit output."],
    next: "Track final contract terms, approved MPB baseline, delivered and installed gloveboxes, completed HFTOC construction, operational acceptance, and attributable production output.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const existingSourceUrl = new Map();
for (const id of ["source-56w-nnsa-fy2027-weapons-activities"]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  existingSourceUrl.set(id, source.url);
}

const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-56y-${spec.slug}`, document_id: `research-doc-56y-${spec.slug}`, signal_id: `signal-56y-${spec.slug}`,
    document_number: 574 + index, phase: "56Y", action_key: spec.actionKey, agency: spec.agency, entity_id: meta.entity,
    record_type: "Longitudinal delivery-and-outcome follow-through", evidence_stage: spec.stage, title: spec.title,
    record_status: "Published", source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url ?? existingSourceUrl.get(spec.sourceIds[0]),
    publication_date: spec.publicationDate,
    document_type: spec.stage === "Funding execution" ? "Data Release" : spec.stage === "Award-to-service contract" ? "Standards and Testbed Record" : spec.stage === "Project implementation" ? "Budget Justification" : "Program Milestone",
    finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits, next_action: spec.next,
    exact_target_artifact_acquired: false, directive_scope_change: false, implementation_change: false, closure_change: false,
    contact_or_foia_submitted: false,
    authority_boundary: "Funding authority, selection, agreement, obligation, payment, construction, delivery, acceptance, operation, output, realized outcome, and closure remain separate. Agency reporting does not establish independent causal attribution or GAO acceptance.",
    captured_date: capturedDate,
  };
});

await writeJson(join(dataRoot, "phase-56y-longitudinal-delivery-outcomes.json"), {
  phase: "56Y", captured_date: capturedDate,
  goal: "Extend stable Phase 56X identities into compatible funding execution, award agreement, operating performance, cleanup delivery, and project-implementation records.",
  publication_rule: "Publish only when an authoritative primary source supplies a stable entity, lifecycle stage, observation period, unit or method, and denominator; record explicit series breaks where universes differ.",
  authority_rule: "Agency assertions, requirements, forecasts, delivered inputs, accepted operation, realized outcomes, GAO acceptance, implementation, and closure remain distinct.",
  records_reviewed: records.length, records_published: records.length,
  evidence_stage_counts: Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length])),
  new_official_source_profiles: sources.length, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0, directive_scope_changes: [], implementation_changes: [], closure_changes: [],
  prior_visible_scope: phase56x.post_batch_visible_scope, post_batch_visible_scope: phase56x.post_batch_visible_scope,
  post_batch_closure_counts: phase56x.post_batch_closure_counts, records,
});

await writeJson(join(dataRoot, "phase-56y-publication-review.json"), {
  phase: "56Y", captured_date: capturedDate, promoted_document_ids: records.map((record) => record.document_id),
  promoted_signal_ids: records.map((record) => record.signal_id), held_document_ids: [], exact_target_artifacts_acquired: 0,
  decision: "All fifteen records preserve stable entity, stage, period, unit, method, and denominator boundaries. Exact-artifact lanes had no new public trigger and remain non-blocking carry-forward items.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 573).padStart(2, "0")}-${record.record_id.replace(/^record-56y-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url ?? existingSourceUrl.get(id)).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-56y-${record.record_id.replace(/^record-56y-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: "Published", publisher: firstSource?.owner ?? "U.S. Department of Energy, National Nuclear Security Administration",
    publication_date: record.publication_date, document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: "The record carries a stable prior identity into a later lifecycle stage while preserving the boundary between delivered inputs, accepted operation, and realized outcomes.",
    ftfn_relevance: ["Preserves entity, stage, period, unit, method, and denominator.", "Creates a compatible longitudinal follow-through record.", "Keeps exact-artifact checks non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "GAO acceptance, implementation, closure, and entity evidence remain separate from this content expansion.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls,
    official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`, capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: "Published"\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Official Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}\n+${yamlList("dependencies", ["stable prior identity", "compatible lifecycle stage", "explicit period, unit, method, and denominator", "later acceptance or outcome evidence"])}\n+${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 56Y longitudinal delivery-and-outcome follow-through"])}\n+${yamlList("local_implications", ["Do not collapse funding, agreement, payment, delivery, acceptance, operation, output, outcome, or closure."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+---\n+\n+## Phase 56Y result\n+\n+${record.finding}\n+\n+## Evidence stage and denominator\n+\n+**${record.evidence_stage}.** ${record.denominator}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Longitudinal Delivery and Outcomes, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 56Y publishes fifteen bounded follow-through records across DOT funding execution, BEAD agreements and performance tests, Hanford sustained operations, DOE EM cleanup delivery, and NNSA project implementation.",
  scope: "Four funding-execution records, two award-to-service records, three sustained-site-operation records, four cleanup-delivery-and-outcome records, and two project-implementation records.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The eighteen-file archive contains fifteen official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Entity, funding universe, lifecycle stage, observation period, unit, method, denominator, acceptance, and outcome remain explicit. First events, requirements, forecasts, obligations, payments, construction, delivered inputs, operating outputs, and realized outcomes are not interchangeable.",
});

const signalIds = records.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 029: Longitudinal Delivery and Outcomes"\n+slug: "research-watch-029-longitudinal-delivery-outcomes"\n+record_status: "Published"\n+summary: "Phase 56Y follows fifteen stable identities into compatible funding, agreement, operating, cleanup, and project-delivery evidence."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", signalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", ["DOT obligations and outlays now have current operating-administration denominators, with a hard break from the Phase 56X discretionary-review universe.", "BEAD has a current award-agreement funnel and an explicit operational testing contract, but no implied construction or outcome result.", "Hanford, Savannah River, Idaho, LAP4, and SRPPF records advance into bounded operating, accepted-capacity, treatment, and project-input evidence."])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Completed assets, service entry, use, and outcomes tied to the same DOT funding cohorts", "BEAD construction, activation, tested service, adoption, and closeout", "Sustained site performance, accepted disposal, independent outcome validation, and final project acceptance", "LAP4 and SRPPF delivery, installation, CD-4, operational acceptance, and attributable output"])}\n+---\n+\n+## What Phase 56Y adds\n+\n+The batch carries stable Phase 56X identities into fifteen later-stage records while preserving every series break needed for honest longitudinal analysis.\n+\n+## Funding and service delivery\n+\n+DOT's May 2026 statement separates authority, obligation, and outlay for the full formula-plus-discretionary IIJA universe. NTIA's dashboard narrows 56 submitted BEAD proposals to 44 signed award agreements, while the performance notice defines how operational service must later be tested. None of these stages is a completed-project or outcome measure.\n+\n+## Sustained operations and cleanup delivery\n+\n+Hanford reports a completed inspection cohort, two months of on-time preventive maintenance, and a five-year laboratory turnaround improvement. Savannah River and Idaho add processed risk, inspection use cases, authorized storage capacity, and treated volume, with units and attribution boundaries intact.\n+\n+## Project implementation\n+\n+LAP4's current planning basis reflects approved 30 Diamond changes but awaits complete subproject baselining and acceptance. SRPPF procurement records add a leased warehouse and forecast design inputs without converting those inputs into delivered equipment or operating capability.\n+\n+## Evidence boundary\n+\n+No Phase 56Y record changes directive scope, implementation, closure, or the one Closed / twenty-one Partially Closed / two Open entity ledger. No ranking, composite, readiness score, generalized savings claim, or unsupported causal inference is supported.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-029-longitudinal-delivery-outcomes.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56y-longitudinal-delivery-outcomes.json"), {
  id: "update-2026-08-02-phase-56y-longitudinal-delivery-outcomes", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 56Y publishes fifteen longitudinal delivery-and-outcome records",
  summary: "Eleven new Tier 1 source profiles and one carried-forward NNSA budget source support fifteen Published follow-through records.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-029-longitudinal-delivery-outcomes/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded. Funding, agreement, delivery, acceptance, operation, and outcome stages remain separate.",
  work_package: "docs/work-packages/phase-56y-longitudinal-delivery-outcomes.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const sourceIds = sources.map((source) => source.id);
await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => { value.source_ids = appendUnique(value.source_ids, sourceIds.filter((id) => id.includes("hanford") || id.includes("srs") || id.includes("idaho") || id.includes("srppf"))); });

for (const [file, selected, question] of [
  ["finance-and-risk.json", sourceIds, "Which Phase 56Y obligation, payment, accepted capacity, or project input next reaches completed delivery or a realized outcome under the same denominator?"],
  ["policy-and-standards.json", sourceIds, "Which required test, accepted asset, or operating record next gains authoritative outcome evidence?"],
  ["mobility.json", sourceIds.slice(0, 1), "Which DOT IIJA cohorts progress from obligation and outlay into accepted assets, service, use, and measured outcomes?"],
  ["energy.json", sourceIds.slice(3), "Which Hanford, DOE EM, LAP4, or SRPPF series next gains accepted delivery, sustained operation, or independently validated outcome evidence?"],
  ["chips-and-compute.json", sourceIds.slice(1, 3), "Which BEAD entities progress from signed agreements into constructed, tested, adopted, and closed-out service?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", signalIds, sourceIds],
  ["autonomy-regulation-to-service.json", signalIds.slice(0, 6), sourceIds.slice(0, 3)],
  ["energy-grid-capacity-to-service.json", signalIds.slice(6), sourceIds.slice(3)],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids, selectedSignals); value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]); value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 56Y longitudinal delivery-and-outcome follow-through");
    value.dependency_stack.push({ stage: "Phase 56Y longitudinal delivery-and-outcome follow-through", current_state: "Fifteen Published records separate four funding-execution, two award-to-service, three sustained-operation, four cleanup-delivery, and two project-implementation records.", boundary: "Entity, funding universe, stage, period, unit, method, and denominator remain explicit; a requirement, forecast, payment, delivered input, or output is not acceptance, closure, generalized savings, or causation." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 56Y records preserve formula/discretionary, construction/operation, forecast/actual, and output/outcome series breaks; they cannot support rankings, composite scores, readiness scores, generalized savings, or unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Later completed delivery, operational acceptance, sustained performance, closeout, and realized-outcome records using the same Phase 56Y identities and denominators."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 56Y adds fifteen longitudinal funding, agreement, operating, cleanup, and project records while entity, universe, stage, period, unit, method, denominator, acceptance, closure, and outcome remain separate.";
  value.source_ids = appendUnique(value.source_ids, sourceIds); value.signal_ids = appendUnique(value.signal_ids, signalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase56y-longitudinal-delivery-outcomes");
  value.links = value.links.filter((link) => link.from !== "node-phase56y-longitudinal-delivery-outcomes");
  value.nodes.push({ id: "node-phase56y-longitudinal-delivery-outcomes", label: "Fifteen longitudinal delivery-and-outcome records", node_type: "Signal", note: "Funding execution, award agreements, sustained operations, cleanup delivery, and project inputs advance stable identities without changing closure." });
  value.links.push(
    { from: "node-phase56y-longitudinal-delivery-outcomes", to: "node-phase56x-implementation-to-outcome", relationship: "Depends On", confidence: "Supported", note: "Phase 56Y follows the stable identities and denominators established in Phase 56X." },
    { from: "node-phase56y-longitudinal-delivery-outcomes", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Funding universes, entities, stages, periods, units, methods, and denominators differ." },
    { from: "node-phase56y-longitudinal-delivery-outcomes", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "The records do not establish rankings, composite readiness, generalized savings, or unsupported causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Fifteen bounded longitudinal follow-through records with explicit entity, universe, stage, period, unit, method, and denominator."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Later completed delivery, accepted operation, sustained performance, closeout, and realized-outcome evidence using the same Phase 56Y identities and denominators."]);
});

console.log(`Generated Phase 56Y: ${records.length} Published records, ${sources.length} new Tier 1 sources, Research Watch 029, and zero exact target artifacts.`);
