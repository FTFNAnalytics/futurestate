import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-07-24";
const collectionSlug = "second-entity-cohort-vertical-replication-2018-2026";
const collectionId = `research-collection-${collectionSlug}`;

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yaml = (value) => JSON.stringify(value);
const yamlArray = (items, indent = "  ") => items.map((item) => `${indent}- ${yaml(item)}`).join("\n");
const sourceId = (slug) => `source-56e-${slug}`;
const documentId = (entitySlug, sourceSlug) => `research-doc-56e-${entitySlug}-${sourceSlug}`;
const addUnique = (items) => [...new Set(items)];
const researchDocumentType = (value) => {
  if (value === "Official Budget Document") return "Budget Justification";
  if (value === "Official Data Report") return "Data Release";
  if (value.includes("Regulatory")) return "Regulatory Decision";
  if (value === "Company Press Room" || value === "Government Agency") return "Program Milestone";
  if (value === "System Operator Update") return "Agency Announcement";
  if (value === "Official Project Report" || value === "System Operator Report") return "Technical Report";
  return "Oversight Report";
};

const portfolioDefaults = {
  ai_cyber: {
    topics: ["Cybersecurity", "AI for Science", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Standards", "Data Quality", "Safety", "Public Trust"],
    watch: ["Security and Standards", "Cross-Cutting Official Rails"],
    receiving: ["Named federal agency information-security programs"],
    jurisdiction: "United States",
  },
  manufacturing: {
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Labor", "Data Quality", "Unit Economics", "Supply Chain"],
    watch: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    receiving: ["Named U.S. manufacturing facilities and production lines"],
    jurisdiction: "United States",
  },
  infrastructure: {
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety", "Weather"],
    watch: ["Power and Grid", "Cross-Cutting Official Rails"],
    receiving: ["Named grid-scale battery-storage assets"],
    jurisdiction: "Australia",
  },
  mobility: {
    topics: ["Mobility", "Aviation"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Regulation", "Safety", "Infrastructure", "Data Quality", "Public Trust"],
    watch: ["Mobility Certification", "Cross-Cutting Official Rails"],
    receiving: ["Named U.S. reporting operating air carriers"],
    jurisdiction: "United States",
  },
};

const source = (portfolio, slug, title, publisher, publicationDate, url, sourceType, summary, finding, limit) => ({
  portfolio,
  slug,
  title,
  publisher,
  publicationDate,
  url,
  sourceType,
  summary,
  finding,
  limit,
});

const sources = [
  source("ai_cyber", "va-fisma-fy2022", "VA FISMA Audit: Fiscal Year 2022", "Department of Veterans Affairs Office of Inspector General", "2023-05-09", "https://www.vaoig.gov/sites/default/files/reports/2023-05/VAOIG-22-01576-72.pdf", "Inspector General Evaluation", "The annual independent audit evaluates VA's information-security program against the FY 2022 federal metrics.", "The record establishes an agency-wide oversight baseline and identifies continuing control weaknesses and corrective actions.", "An annual program audit does not measure identical systems, incidents, mission effects, or control populations in later years."),
  source("ai_cyber", "va-fisma-fy2023", "VA FISMA Audit: Fiscal Year 2023", "Department of Veterans Affairs Office of Inspector General", "2024-05-21", "https://www.vaoig.gov/reports/audit/federal-information-security-modernization-act-audit-fiscal-year-2023", "Inspector General Evaluation", "VA OIG reported continuing significant information-security challenges after testing 45 systems at 23 facilities and cloud service providers.", "The audit issued 25 recommendations, with VA concurring with 15 and not concurring with 10.", "Recommendation counts reflect the tested scope and metric set, not a comparable risk or performance score."),
  source("ai_cyber", "va-fisma-fy2024", "VA FISMA Audit: Fiscal Year 2024", "Department of Veterans Affairs Office of Inspector General", "2025-06-05", "https://www.vaoig.gov/reports/audit/federal-information-security-modernization-act-audit-fiscal-year-2024", "Inspector General Evaluation", "VA OIG again reported significant challenges after testing 49 applications and systems at 23 facilities and cloud service providers.", "The audit issued 23 recommendations and retained system, access, configuration, and remediation concerns.", "The changed sample and annual reporting instructions prevent a simple year-over-year effectiveness trend."),
  source("ai_cyber", "va-cio-open-recommendations-2026", "Priority Open Recommendations: Department of Veterans Affairs", "U.S. Government Accountability Office", "2026-01-15", "https://www.gao.gov/products/gao-26-108706", "Government Accountability Review", "GAO reported 38 open recommendations under the VA Chief Information Officer in January 2026.", "Four recommendations were designated priority recommendations, while cybersecurity and IT acquisition and management remained on GAO's high-risk list.", "An open-recommendation inventory spans subjects and vintages and is not equivalent to an annual FISMA result."),

  source("ai_cyber", "doe-fisma-fy2023", "DOE FISMA Evaluation: Fiscal Year 2023", "Department of Energy Office of Inspector General", "2024-03-22", "https://www.energy.gov/ig/articles/evaluation-doe-oig-24-17", "Inspector General Evaluation", "DOE OIG evaluated the department's unclassified cybersecurity program under the FY 2023 FISMA metrics.", "The evaluation reported that DOE took actions to improve its program while significant weaknesses remained.", "The agency-level evaluation does not expose a common system, incident, or mission-outcome denominator."),
  source("ai_cyber", "doe-fisma-fy2024", "DOE FISMA Evaluation: Fiscal Year 2024", "Department of Energy Office of Inspector General", "2025-05-20", "https://www.energy.gov/ig/articles/evaluation-doe-oig-25-30", "Inspector General Evaluation", "DOE OIG reported that 44 of 63 prior recommendations remained open and issued 79 new recommendations.", "The FY 2024 evaluation carried 123 recommendations requiring corrective action when prior and new items were combined.", "Recommendation volume is affected by scope, testing, consolidation, and annual metric changes."),
  source("ai_cyber", "doe-management-letter-fy2025", "DOE FY 2025 Consolidated Audit Management Letter", "Department of Energy Office of Inspector General", "2026-02-17", "https://www.energy.gov/ig/articles/management-letter-doe-oig-26-22", "Inspector General Evaluation", "The management letter reported 33 cybersecurity findings, including 13 repeat findings, during the FY 2025 consolidated financial-statement audit.", "Access-control weaknesses were reported as a significant deficiency.", "A financial-audit management letter is not the same measurement system as an annual FISMA evaluation."),
  source("ai_cyber", "doe-cyber-sharing-2026", "DOE Implementation of the Cybersecurity Information Sharing Act", "Department of Energy Office of Inspector General", "2026-04-02", "https://www.energy.gov/ig/articles/evaluation-doe-oig-26-28", "Inspector General Evaluation", "DOE OIG found that the department took the actions necessary to implement the Cybersecurity Information Sharing Act requirements reviewed.", "The evaluation found sufficient policies and procedures and no identified sharing impact from the noted information-quality fatigue barrier.", "This bounded statutory review does not close separate FISMA, access-control, incident, or mission-performance findings."),

  source("ai_cyber", "dot-fisma-fy2023", "DOT Information-Security Program Review: Fiscal Year 2023", "Department of Transportation Office of Inspector General", "2023-09-27", "https://www.oig.dot.gov/library-item/39636", "Inspector General Evaluation", "The FY 2023 quality-control review examined DOT's information-security program and practices.", "DOT OIG recorded two recommendations addressing zero-trust and trusted-internet-connection work; both were resolved but open at issuance.", "Resolved recommendation status does not establish implementation, operating effectiveness, or mission effect."),
  source("ai_cyber", "dot-fisma-fy2024", "DOT Information-Security Program Review: Fiscal Year 2024", "Department of Transportation Office of Inspector General", "2024-09-30", "https://www.oig.dot.gov/library-item/46430", "Inspector General Evaluation", "The FY 2024 review identified weaknesses across plans of action, inventory, logging, training, incident response, and contingency planning.", "The review issued ten recommendations, resolved but open at issuance.", "Annual recommendation counts depend on scope and cannot be treated as an agency readiness score."),
  source("ai_cyber", "dot-fisma-fy2025", "DOT Information-Security Program Review: Fiscal Year 2025", "Department of Transportation Office of Inspector General", "2025-09-30", "https://www.oig.dot.gov/library-item/46976", "Inspector General Evaluation", "The FY 2025 review rated DOT's program at Level 2, Defined, below the federal effectiveness threshold.", "The report issued seven recommendations addressing the weaknesses reviewed.", "The maturity label is an agency-program assessment, not a direct measure of system risk, incidents, recovery, or transportation outcomes."),
  source("ai_cyber", "dot-continuous-monitoring-2024", "DOT Continuous Monitoring Tools Audit", "Department of Transportation Office of Inspector General", "2024-09-30", "https://www.oig.dot.gov/library-item/46429", "Inspector General Audit", "DOT OIG found that the department used automated monitoring tools but did not provide near-real-time monitoring on all mission-critical National Airspace System systems.", "FAA had not performed near-real-time monitoring on 62 of 85 reviewed NAS Cyber Management Systems at issuance.", "The audit covers selected continuous-monitoring controls and does not represent every DOT component or later closure state."),

  source("manufacturing", "f35-gao-2024", "F-35 Joint Strike Fighter: Program Continues to Encounter Production Issues", "U.S. Government Accountability Office", "2024-05-16", "https://www.gao.gov/products/gao-24-106909", "Government Accountability Review", "GAO reported that 91 percent of aircraft delivered in calendar year 2023 were late.", "Manufacturing, parts, and Technology Refresh 3 issues contributed to late deliveries.", "Program-wide delivery records are not a facility productivity, labor, quality, or unit-cost score."),
  source("manufacturing", "f35-gao-2025", "F-35: Actions Needed to Address Late Deliveries", "U.S. Government Accountability Office", "2025-09-03", "https://www.gao.gov/products/gao-25-107632", "Government Accountability Review", "GAO reported that all 110 aircraft due in 2024 were late and average lateness rose from 61 days in 2023 to 238 days in 2024.", "GAO identified delivery, production-capacity, parts, modernization, and incentive-design constraints.", "The record covers the program and supplier network; it does not isolate Fort Worth labor or line causation."),
  source("manufacturing", "f35-lockheed-deliveries-2025", "F-35 Breaks Delivery Record in 2025", "Lockheed Martin", "2026-01-07", "https://www.f35.com/f35/news-and-features/F35_Breaks_Delivery_Record_Continues_Combat_Success_in_2025.html", "Company Press Room", "Lockheed Martin reported delivering 191 F-35 aircraft in 2025 and completing Technology Refresh 3 delivery work.", "The company described 2025 as a program delivery record.", "The total is contractor-attributed and includes backlog effects; it is not independently normalized for due dates, rework, labor, cost, or accepted capability."),
  source("manufacturing", "f35-gao-sustainment-2026", "F-35 Sustainment: Persistent Readiness Challenges", "U.S. Government Accountability Office", "2026-06-11", "https://www.gao.gov/products/gao-26-108113", "Government Accountability Review", "GAO reported that mission-capable and full-mission-capable rates declined from FY 2021 through FY 2025 while sustainment costs increased.", "GAO identified constrained private-sector parts capacity as a risk to the updated sustainment strategy.", "Fleet sustainment outcomes do not measure Fort Worth production-line throughput or prove a production cause."),

  source("manufacturing", "kc46-usaf-budget-fy2025", "Air Force Aircraft Procurement Budget: KC-46A, FY 2025", "U.S. Department of the Air Force", "2024-03-01", "https://www.saffm.hq.af.mil/Portals/84/documents/FY25/FY25%20Air%20Force%20Aircraft%20Procurement%20Vol%20I.pdf?ver=trnnCwkcSenGdKVniZvWHQ%3D%3D", "Official Budget Document", "The budget record identifies Everett production and the stated minimum, economic, and maximum sustaining rates for the KC-46A line.", "The record supplies an official production-plan denominator rather than an observed delivery outcome.", "Budget plans can change and do not establish realized quality, schedule, cost, labor, or acceptance performance."),
  source("manufacturing", "kc46-gao-2026", "KC-46A Tanker: Program Status and Deficiencies", "U.S. Government Accountability Office", "2026-05-01", "https://files.gao.gov/reports/GAO-26-109154/index.html", "Government Accountability Review", "GAO reported 84 KC-46A aircraft fielded from FY 2019 through FY 2025 and continuing boom and remote-vision deficiencies.", "The full-rate production decision was not expected before resolution of testing and deficiency work after September 2026.", "Fielded-aircraft counts, accepted deliveries, production output, and corrected deficiencies are different measures."),
  source("manufacturing", "kc46-100th-delivery-2025", "100th KC-46A Pegasus Delivered", "U.S. Air Force Materiel Command", "2025-12-02", "https://www.afmc.af.mil/News/Article-Display/Article/4348349/100th-kc-46a-pegasus-delivered/", "Government Agency", "The Air Force recorded the 100th KC-46A delivery at the Everett Delivery Center.", "The milestone provides a dated cumulative delivery observation tied to the named facility.", "A cumulative milestone does not show period throughput, delivery lateness, rework, quality escapes, cost, or labor input."),
  source("manufacturing", "kc46-105th-delivery-2026", "105th KC-46A Delivery", "U.S. Air Mobility Command", "2026-04-03", "https://www.amc.af.mil/News/Article-Display/Article/4460441/kc-46-delivery-a-milestone-flight-and-a-final-farewell/", "Government Agency", "Air Mobility Command recorded the 105th KC-46A delivery from Everett.", "The later milestone supplies a second cumulative observation for the same line and product.", "Two cumulative milestones do not isolate sustained production rate, accepted capability, cost, quality, or causation."),

  source("manufacturing", "f15ex-first-deliveries-2021", "Air Force Receives First F-15EX Aircraft", "U.S. Air Force", "2021-03-11", "https://www.af.mil/News/Features/Article/2534008/air-force-receives-first-f-15ex/", "Government Agency", "The Air Force recorded receipt of the first F-15EX aircraft from Boeing's St. Louis production line.", "The record establishes the product and facility baseline for the delivery series.", "First-delivery timing does not establish recurring production rate, quality, cost, labor, or acceptance performance."),
  source("manufacturing", "f15ex-four-deliveries-2023", "Third and Fourth F-15EX Aircraft Arrive at Eglin", "U.S. Air Combat Command", "2023-12-21", "https://www.acc.af.mil/News/Article-Display/Article/3630056/eagles-have-landed-new-f-15exs-arrive-at-eglin/", "Government Agency", "Air Combat Command recorded the third and fourth F-15EX deliveries in December 2023.", "The record supplies a later cumulative delivery observation for the St. Louis-built aircraft.", "Cumulative delivery count is not period throughput or evidence of why schedule changed."),
  source("manufacturing", "f15ex-gao-2025", "Weapon Systems Annual Assessment: F-15EX", "U.S. Government Accountability Office", "2025-06-11", "https://www.gao.gov/assets/gao-25-107569.pdf", "Government Accountability Review", "GAO reported delivery of aircraft seven and eight in June 2024 and described production-rate and fuselage-quality constraints.", "The program planned to raise production from one to two aircraft per month by April 2026.", "A planned rate and observed quality issues do not prove the realized later production rate or one cause."),
  source("manufacturing", "f15ex-production-resumes-2025", "F-15EX Production Rebounds, Deliveries Continue", "U.S. Air Force Life Cycle Management Center", "2025-12-15", "https://www.aflcmc.af.mil/NEWS/Article/4359770/f-15ex-production-rebounds-deliveries-continue/", "Government Agency", "The Air Force reported that a St. Louis strike halted the production line from August 4 through November 17, 2025, before deliveries resumed.", "The record identified deliveries of aircraft 14, 15, and 16 around the interruption and restart.", "The Air Force account establishes sequence and attribution but not the counterfactual schedule, cost, quality, or labor effect."),

  source("infrastructure", "hornsdale-aemo-2019-preliminary", "South Australia-Victoria Separation: Preliminary Incident Report", "Australian Energy Market Operator", "2019-12-01", "https://www.aemo.com.au/-/media/Files/Electricity/NEM/Market_Notices_and_Events/Power_System_Incident_Reports/2019/Preliminary-Incident-Report---16-November-2019---SA---VIC-separation.pdf", "System Operator Report", "AEMO reported Hornsdale Power Reserve's fast response during the November 2019 South Australia-Victoria separation event.", "The asset's rapid output contributed to arresting frequency movement during the event.", "One disturbance response does not establish annual availability, revenue, degradation, or causal system benefit."),
  source("infrastructure", "hornsdale-aemo-2020-final", "Victoria and South Australia Separation Event: Final Report", "Australian Energy Market Operator", "2020-01-31", "https://www.aemo.com.au/-/media/files/electricity/nem/market_notices_and_events/power_system_incident_reports/2021/final-report-victoria-and-south-australia-separation-event.pdf?la=en", "System Operator Report", "AEMO's final report refined the account of Hornsdale's frequency-control response and documented setting adjustments.", "The asset delivered more fast lower service but less slow and delayed lower service than enabled because of settings.", "Service-specific response cannot be collapsed into a single availability or value score."),
  source("infrastructure", "hornsdale-aer-2022", "AER v Hornsdale Power Reserve Pty Ltd", "Australian Energy Regulator", "2022-06-30", "https://www.aer.gov.au/publications/reports/compliance/aer-v-hornsdale-power-reserve-pty-ltd-2022-fca-738", "Regulatory Enforcement Record", "The Federal Court found that Hornsdale could not provide all frequency-control services offered during a 2019 period and imposed a penalty.", "The enforcement record provides a regulator-verified compliance and capability boundary.", "The finding applies to specified offers and dispatch intervals, not every operating mode or later corrective state."),
  source("infrastructure", "hornsdale-sa-current", "Existing Renewable Energy Installations: Hornsdale", "Government of South Australia", null, "https://www.energymining.sa.gov.au/industry/hydrogen-and-renewable-energy/investment/existing-installations", "Government Agency", "South Australia's current installation profile identifies Hornsdale Power Reserve and its 150 MW power capacity after the 2020 expansion.", "The profile supports stable asset identity and current stated capacity.", "Installed power capacity does not measure stored energy, availability, cycling, safety, revenue, or realized grid value."),

  source("infrastructure", "vbb-esv-fire-findings-2021", "Victorian Big Battery Fire: Technical Findings", "Energy Safe Victoria", "2021-09-28", "https://www.energysafe.vic.gov.au/sites/default/files/2022-12/VBB_StatementOfFindings_FINAL_28Sep2021.pdf", "Regulatory Technical Finding", "Energy Safe Victoria documented the July 2021 commissioning fire in which two Megapacks were consumed.", "The regulator record establishes the incident sequence, isolation, investigation, and corrective-action context.", "Commissioning incident findings do not measure later availability, dispatch, degradation, or customer benefit."),
  source("infrastructure", "vbb-aemo-registration-2021", "Victorian Big Battery Registration Update", "Australian Energy Market Operator", "2021-10-01", "https://www.aemo.com.au/newsroom/news-updates/state-of-the-system-update-october-2021", "System Operator Update", "AEMO reported registration of the Victorian Big Battery at 300 MW.", "The update supplies a dated operating-registration milestone after commissioning work.", "Registration does not establish full operational availability, duration, dispatch, revenue, or safety performance."),
  source("infrastructure", "vbb-aemo-operational-2021", "Victorian Big Battery Delivering Energy Reserves", "Australian Energy Market Operator", "2021-12-08", "https://www.aemo.com.au/newsroom/media-release/victorian-battery-delivering-energy-reserves-in-summer", "System Operator Update", "AEMO reported the 300 MW / 450 MWh Victorian Big Battery fully operational in the System Integrity Protection Scheme.", "The asset could automatically discharge up to 250 MW as an emergency reserve under the scheme.", "Declared capability and scheme role do not establish realized annual dispatch, availability, revenue, degradation, or avoided outages."),
  source("infrastructure", "vbb-esv-investigations", "Electrical Incident and Technical Investigation Reports", "Energy Safe Victoria", null, "https://www.energysafe.vic.gov.au/about-us/our-organisation/reports/electrical-incident-and-technical-investigations-reports", "Regulatory Index", "Energy Safe Victoria's investigation index preserves the official incident-report context and publication boundary for the Victorian Big Battery.", "The index supports provenance and distinguishes regulator findings from operator or vendor claims.", "An investigation index is not a later operating-performance or corrective-action closure record."),

  source("infrastructure", "dalrymple-arena-operational-2020", "ESCRI-SA Battery Energy Storage: Operational Report 2", "Australian Renewable Energy Agency", "2020-08-01", "https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-2.pdf", "Official Project Report", "The report described 14 power-system events, with the battery riding through or responding to 11 and supplying local load during three.", "The project reported no planned outage and recorded frequency-control and energy-market revenue for the observation window.", "Project and market results are operator-attributed within the funded reporting framework and use specific event and revenue windows."),
  source("infrastructure", "dalrymple-aemo-minimum-demand-2020", "South Australia Minimum Operational Demand Thresholds Review", "Australian Energy Market Operator", "2020-05-01", "https://www.aemo.com.au/-/media/files/electricity/nem/planning_and_forecasting/sa_advisory/2020/minimum-operational-demand-thresholds-in-south-australia-review.pdf?rev=f5b96d9f2bae47daa77e124eed2afb55&sc_lang=en", "System Operator Report", "AEMO documented a November 2019 state-of-charge constraint that limited Dalrymple's available frequency-control response.", "The record exposes a specific operating condition that qualifies nameplate or enabled-service claims.", "One constrained interval does not establish annual availability, dispatch, revenue, degradation, or reliability effect."),
  source("infrastructure", "dalrymple-arena-final-2021", "ESCRI-SA Battery Energy Storage: Final Report", "Australian Renewable Energy Agency", "2021-04-01", "https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-final-report.pdf", "Official Project Report", "The final report documents the 30 MW / 8 MWh Dalrymple battery, commercial operation from December 2018, and its multiple service roles.", "The record consolidates technical, commercial, islanding, and market-service observations for the project.", "The final report is not an independent counterfactual estimate of reliability or customer benefit."),
  source("infrastructure", "dalrymple-arena-retrospective-2021", "Dalrymple Battery Shows the Way Forward", "Australian Renewable Energy Agency", "2021-04-30", "https://arena.gov.au/blog/electranet-south-australian-battery-shows-the-way-forward/", "Government Agency", "ARENA's retrospective summarized 29 system events from 2018 through 2020 and project-reported frequency-control revenue.", "The later account supports continuity of the asset and funded-project reporting.", "The retrospective relies on project results and does not supply a common comparator, counterfactual, or later operating audit."),

  source("mobility", "atcr-full-year-2024", "Air Travel Consumer Report: Full Year 2024", "U.S. Department of Transportation", "2025-03-14", "https://www.transportation.gov/sites/dot.gov/files/2025-03/February%202025%20ATCR.pdf?mod=article_inline", "Official Data Report", "DOT Table 6C reports 2024 and 2023 scheduled operations, cancellations, and cancellation rates for reporting operating carriers.", "The record supplies a common annual cancellation denominator for American, Alaska, and JetBlue.", "Operating-carrier rows are not marketing-network results and do not normalize route, weather, airport, or schedule mix."),
  source("mobility", "atcr-full-year-2025", "Air Travel Consumer Report: Full Year 2025", "U.S. Department of Transportation", "2026-02-01", "https://www.transportation.gov/sites/dot.gov/files/2026-03/February_2026%20ATCR.pdf", "Official Data Report", "DOT Table 6C reports 2025 and 2024 scheduled operations, cancellations, and cancellation rates for reporting operating carriers.", "The record extends the same annual cancellation rail while flagging Alaska and Hawaiian's October 2025 single operating certificate.", "The certificate change creates an identity and denominator break for Alaska; annual rates do not establish service quality or causation."),
  source("mobility", "atcr-may-2026", "Air Travel Consumer Report: May 2026 Operating Data", "U.S. Department of Transportation", "2026-07-01", "https://www.transportation.gov/sites/dot.gov/files/2026-06/July%202026%20ATCR.pdf", "Official Data Report", "DOT reports May 2026 on-time arrivals, cancellations, baggage, wheelchair and scooter handling, oversales, and complaint records.", "May operating-carrier on-time percentages were 75.1 for American, 82.4 for Alaska, and 81.0 for JetBlue.", "A single month, separate service denominators, partner operations, and brand-level complaints cannot be combined into a score."),
  source("mobility", "dot-airline-dashboard", "Airline Customer Service Dashboard", "U.S. Department of Transportation", null, "https://www.transportation.gov/airconsumer/airline-customer-service-dashboard", "Government Agency", "DOT's dashboard records airline commitments for controllable cancellations and delays.", "The dashboard provides a stated-commitment layer for American, Alaska, and JetBlue that can be kept separate from measured operating outcomes.", "A stated commitment does not verify passenger eligibility, delivery of a remedy, complaint resolution, or overall service performance."),
];

const entity = ({
  portfolio,
  slug,
  id,
  name,
  type,
  scope,
  indicator,
  unit,
  denominator,
  period,
  method,
  attribution,
  sourceSlugs,
  panelTitle,
  panelSummary,
  observations,
  reportingBreaks,
  drivers,
  constraints,
  alternatives,
  laterObservations,
  compatibility,
  testResult,
  validation,
  nextRecords,
}) => ({
  portfolio,
  slug,
  id,
  name,
  type,
  scope,
  indicator,
  unit,
  denominator,
  period,
  method,
  attribution,
  sourceSlugs,
  panelTitle,
  panelSummary,
  observations,
  reportingBreaks,
  drivers,
  constraints,
  alternatives,
  laterObservations,
  compatibility,
  testResult,
  validation,
  nextRecords,
});

const entities = [
  entity({
    portfolio: "ai_cyber", slug: "va-information-security", id: "agency-va", name: "Department of Veterans Affairs", type: "Federal agency", scope: "VA agency information-security program", indicator: "Oversight findings, recommendations, and tested-system scope", unit: "Annual oversight record", denominator: "The systems, facilities, cloud services, metrics, and recommendation inventory stated in each record", period: "Fiscal years 2022-2024 and January 2026", method: "Independent IG annual evaluations plus GAO open-recommendation status", attribution: "VA OIG and GAO", sourceSlugs: ["va-fisma-fy2022", "va-fisma-fy2023", "va-fisma-fy2024", "va-cio-open-recommendations-2026"], panelTitle: "VA's annual security audits continue to expose material corrective-action work", panelSummary: "The three annual audits and the later GAO inventory preserve continuing oversight work without turning unlike recommendation scopes into a performance trend.", observations: ["FY 2022: annual FISMA audit baseline", "FY 2023: 25 recommendations after testing 45 systems", "FY 2024: 23 recommendations after testing 49 applications and systems", "January 2026: 38 open CIO recommendations across subjects and vintages"], reportingBreaks: ["Tested systems increased from 45 to 49 between the stated FY 2023 and FY 2024 records.", "GAO's CIO inventory is not the annual FISMA recommendation denominator."], drivers: ["Agency-wide corrective-action program", "System and cloud authorization practices", "Identity, access, configuration, and remediation controls"], constraints: ["Changing samples and metrics", "Large federated healthcare environment", "Open recommendations with different age and severity"], alternatives: ["Changed audit scope", "Recommendation consolidation or reopening", "Different system populations", "Corrective work not captured by headline counts"], laterObservations: ["The FY 2024 audit still identified significant challenges across a larger stated application and system sample.", "GAO's January 2026 inventory retained 38 open CIO recommendations, including four priority items."], compatibility: "Same agency and control domain; the annual audits and GAO inventory use different scopes and must remain separate.", testResult: "Later official records sustain the corrective-action workload explanation but do not establish unchanged risk, control operation, incident rate, recovery, or veteran-service effect.", validation: "Independent official oversight; no closure or effectiveness is inferred from a recommendation count.", nextRecords: ["FY 2025 or FY 2026 FISMA results", "Recommendation-level closures and tested control operation", "Incidents, recovery, affected services, and mission effects"],
  }),
  entity({
    portfolio: "ai_cyber", slug: "doe-information-security", id: "agency-doe", name: "Department of Energy", type: "Federal agency", scope: "DOE unclassified cybersecurity program", indicator: "Annual program weaknesses, recommendations, and bounded control reviews", unit: "Oversight finding or determination", denominator: "The audit scope and metric set declared by DOE OIG", period: "Fiscal years 2023-2025 and April 2026", method: "DOE OIG evaluations and consolidated-audit management letter", attribution: "DOE OIG", sourceSlugs: ["doe-fisma-fy2023", "doe-fisma-fy2024", "doe-management-letter-fy2025", "doe-cyber-sharing-2026"], panelTitle: "DOE oversight records split broad cyber weaknesses from a successful information-sharing review", panelSummary: "DOE's later records show continuing FISMA and access-control work alongside a bounded 2026 statutory determination that the reviewed sharing requirements were implemented.", observations: ["FY 2023: continuing program weaknesses", "FY 2024: 44 prior recommendations remained and 79 new recommendations were issued", "FY 2025 management letter: 33 cyber findings, including 13 repeat findings", "April 2026: reviewed Cybersecurity Act information-sharing actions were implemented"], reportingBreaks: ["The FY 2025 management letter is a financial-audit record, not the annual FISMA metric set.", "The 2026 information-sharing review covers a narrower statutory control domain."], drivers: ["Corrective-action execution", "Access control and financial-system safeguards", "Threat-indicator policies and automated sharing"], constraints: ["Repeat findings", "Different reporting systems", "Information-quality fatigue and control scope"], alternatives: ["Scope expansion", "Changed metric design", "Repeat versus new finding classification", "Narrow statutory compliance despite broader control weaknesses"], laterObservations: ["The 2026 information-sharing review made no formal recommendations.", "That bounded result coexists with the FY 2025 management letter's access-control significant deficiency."], compatibility: "Same department but different audit objectives, tested controls, and denominators.", testResult: "The narrow information-sharing determination challenges any claim of uniform failure, while the management letter blocks any claim of enterprise-wide closure.", validation: "Independent DOE OIG records; statutory implementation and general program effectiveness remain distinct.", nextRecords: ["FY 2025 FISMA evaluation", "Finding-level closure and repeat-finding resolution", "System incidents, recovery, mission and laboratory service effects"],
  }),
  entity({
    portfolio: "ai_cyber", slug: "dot-information-security", id: "agency-dot", name: "Department of Transportation", type: "Federal agency", scope: "DOT agency information-security program and continuous monitoring", indicator: "Annual maturity, recommendations, and monitored-system coverage", unit: "Annual oversight record", denominator: "The systems, components, and metrics declared by DOT OIG", period: "Fiscal years 2023-2025 and September 2024 monitoring audit", method: "Independent annual FISMA reviews plus a control-specific audit", attribution: "DOT OIG and its independent auditor", sourceSlugs: ["dot-fisma-fy2023", "dot-fisma-fy2024", "dot-fisma-fy2025", "dot-continuous-monitoring-2024"], panelTitle: "DOT's annual reviews retain a below-effective program and a quantified monitoring gap", panelSummary: "The records preserve the annual program findings and the separate continuous-monitoring scope without making recommendation counts a readiness score.", observations: ["FY 2023: two resolved-but-open recommendations", "FY 2024: ten resolved-but-open recommendations", "FY 2025: Level 2, Defined, with seven recommendations", "September 2024: 62 of 85 reviewed NAS cyber-management systems lacked near-real-time monitoring"], reportingBreaks: ["Annual metric sets and recommendation scopes changed.", "The 62-of-85 denominator applies to reviewed NAS Cyber Management Systems, not all DOT systems."], drivers: ["Plans of action and milestones", "Asset and software inventory", "Logging, incident response, and contingency planning"], constraints: ["Safety-sensitive NAS monitoring", "Federated operating administrations", "Changing system samples and closure dates"], alternatives: ["Expanded testing", "Metric changes", "Component variation", "Safety constraints on monitoring frequency"], laterObservations: ["The FY 2025 review rated the program Level 2, Defined.", "The 2024 control-specific audit identifies where safety and monitoring coverage interact."], compatibility: "Same department and cyber domain; annual maturity, recommendation counts, and NAS monitoring coverage are not interchangeable.", testResult: "The monitoring audit supplies an observable implementation constraint but does not establish why the annual program rating remained below effective.", validation: "Independent DOT OIG records with explicit scope; later recommendation closures require their own dates.", nextRecords: ["FY 2026 annual review", "Closure evidence for the monitoring recommendations", "System incidents, recovery, affected transportation services, and mission outcomes"],
  }),
  entity({
    portfolio: "manufacturing", slug: "f35-fort-worth-line", id: "manufacturer-lockheed-f35-fort-worth", name: "Lockheed Martin F-35 Fort Worth final-assembly line", type: "Named manufacturing line", scope: "Fort Worth final assembly inside the wider F-35 production and supplier system", indicator: "Program aircraft deliveries and delivery timeliness", unit: "Aircraft delivered or lateness measure", denominator: "Aircraft due or delivered in the stated calendar year", period: "Calendar years 2023-2025 and June 2026 sustainment record", method: "GAO program reviews plus a contractor annual delivery statement", attribution: "GAO, DOD program records, and Lockheed Martin for the 2025 statement", sourceSlugs: ["f35-gao-2024", "f35-gao-2025", "f35-lockheed-deliveries-2025", "f35-gao-sustainment-2026"], panelTitle: "F-35 deliveries accelerated in 2025 after severe 2023-2024 lateness", panelSummary: "GAO's due-date records and Lockheed Martin's later delivery total are kept separate so backlog clearance does not become a normalized throughput or quality claim.", observations: ["2023: 91 percent of delivered aircraft were late", "2024: all 110 due aircraft were late; average lateness was 238 days", "2025: Lockheed Martin reported 191 deliveries"], reportingBreaks: ["The 2025 contractor total includes deliveries against prior-year obligations.", "Program results include suppliers and acceptance work beyond the named final-assembly line."], drivers: ["Technology Refresh 3 completion", "Parts and engine availability", "Acceptance and rework flow"], constraints: ["Supplier shortages", "Software and modernization maturity", "Production capacity and incentive design"], alternatives: ["Backlog release rather than new-period throughput", "Acceptance-policy changes", "Parts arrivals", "Schedule and contract incentives"], laterObservations: ["Lockheed Martin attributed a record 191 deliveries to 2025.", "GAO's June 2026 sustainment review still identified constrained private-sector parts capacity."], compatibility: "Same aircraft program; due-date timeliness, contractor deliveries, and fleet sustainment use different denominators.", testResult: "The later delivery total supports backlog movement, while independent sustainment evidence leaves parts capacity and accepted capability unresolved.", validation: "GAO independently validates program records; the 2025 production claim remains contractor-attributed.", nextRecords: ["Aircraft due versus accepted by month", "Fort Worth labor hours, rework, first-pass yield, and line inventory", "TR-3 capability acceptance and supplier shortage series"],
  }),
  entity({
    portfolio: "manufacturing", slug: "kc46-everett-line", id: "manufacturer-boeing-kc46-everett", name: "Boeing KC-46A Everett production line", type: "Named manufacturing line", scope: "Everett KC-46A production and delivery center", indicator: "Cumulative delivered aircraft and program deficiency state", unit: "Cumulative aircraft milestone", denominator: "KC-46A aircraft accepted or fielded under the cited record", period: "Fiscal years 2019-2025 through April 2026", method: "Air Force milestone records, budget plan, and GAO program review", attribution: "U.S. Air Force, Department of the Air Force, and GAO", sourceSlugs: ["kc46-usaf-budget-fy2025", "kc46-gao-2026", "kc46-100th-delivery-2025", "kc46-105th-delivery-2026"], panelTitle: "The Everett KC-46 line reached 105 cumulative deliveries while critical deficiencies remained open", panelSummary: "Cumulative delivery milestones are published with the separate fielded-aircraft, sustaining-rate, and deficiency denominators attached.", observations: ["FY 2019-2025: GAO reported 84 fielded aircraft", "December 2025: Air Force recorded the 100th delivery", "April 2026: Air Mobility Command recorded the 105th delivery"], reportingBreaks: ["Fielded and delivered are not identical states.", "Cumulative milestones do not expose monthly output or aircraft due dates."], drivers: ["Everett sustaining-rate plan", "Acceptance and modification flow", "Boom and remote-vision corrective work"], constraints: ["Critical deficiencies", "Quality issues", "Testing before a full-rate decision"], alternatives: ["Fielding lag after delivery", "Modification or rework timing", "Acceptance scheduling", "Budget plan changes"], laterObservations: ["The line moved from the 100th to the 105th delivery between December 2025 and April 2026.", "GAO still reported unresolved deficiencies and a later full-rate decision window."], compatibility: "Same product and line; fielded, delivered, planned rate, and deficiency status remain separate.", testResult: "The milestones support continued output but do not show that critical deficiencies, schedule, quality, or cost constraints were resolved.", validation: "Government milestone records plus independent GAO program review.", nextRecords: ["Monthly due and accepted deliveries", "Rework, quality escapes, labor, cost, and modification hours", "Deficiency closure and full-rate decision evidence"],
  }),
  entity({
    portfolio: "manufacturing", slug: "f15ex-st-louis-line", id: "manufacturer-boeing-f15ex-st-louis", name: "Boeing F-15EX St. Louis production line", type: "Named manufacturing line", scope: "St. Louis F-15EX production and delivery sequence", indicator: "Cumulative aircraft delivery milestones and line interruption", unit: "Cumulative delivered aircraft", denominator: "F-15EX aircraft recorded as delivered by the Air Force", period: "March 2021 through December 2025", method: "Air Force delivery records plus GAO program review", attribution: "U.S. Air Force and GAO", sourceSlugs: ["f15ex-first-deliveries-2021", "f15ex-four-deliveries-2023", "f15ex-gao-2025", "f15ex-production-resumes-2025"], panelTitle: "F-15EX deliveries reached aircraft 16 after a documented 2025 line interruption", panelSummary: "The cumulative delivery sequence is retained alongside planned rate, quality, and strike constraints without inferring one production cause.", observations: ["March 2021: first two aircraft received", "December 2023: aircraft three and four received", "June 2024: GAO recorded aircraft seven and eight delivered", "December 2025: Air Force recorded delivery through aircraft 16 around the restart"], reportingBreaks: ["The records are milestone snapshots rather than equal observation windows.", "The 2025 article's delivery dates straddle a labor interruption."], drivers: ["Production-rate increase plan", "Fuselage rework and quality control", "Acceptance and delivery scheduling"], constraints: ["St. Louis labor interruption", "Quality deficiencies", "Low-rate production ramp"], alternatives: ["Delivery timing rather than assembly completion", "Acceptance backlog", "Supplier and rework flow", "Strike-related versus pre-existing schedule effects"], laterObservations: ["The Air Force attributed a production halt from August 4 through November 17, 2025, to a strike.", "Deliveries through aircraft 16 were recorded after work resumed."], compatibility: "Same line and product; milestone counts and the strike interval establish sequence, not a counterfactual.", testResult: "The restart record supports temporal attribution for the interruption but does not isolate its total schedule, cost, quality, or labor effect.", validation: "Air Force operational account and independent GAO program context.", nextRecords: ["Monthly planned and accepted deliveries", "Line labor hours, rework, yield, supplier constraints, and cost", "Post-restart delivery cadence and quality findings"],
  }),
  entity({
    portfolio: "infrastructure", slug: "hornsdale-power-reserve", id: "battery-hornsdale-power-reserve", name: "Hornsdale Power Reserve", type: "Named battery asset", scope: "Hornsdale grid-scale battery in South Australia", indicator: "Incident response, service capability, compliance, and stated capacity", unit: "Dated operating or regulatory observation", denominator: "The specific event, service, offer interval, or installed capacity stated in the record", period: "November 2019 through current installation profile", method: "AEMO system-event reports, AER enforcement, and state asset profile", attribution: "AEMO, Australian Energy Regulator, and Government of South Australia", sourceSlugs: ["hornsdale-aemo-2019-preliminary", "hornsdale-aemo-2020-final", "hornsdale-aer-2022", "hornsdale-sa-current"], panelTitle: "Hornsdale's official record combines fast response, service-setting limits, enforcement, and expanded capacity", panelSummary: "Event response and installed capacity remain distinct from offered service capability, compliance, availability, and value.", observations: ["November 2019: rapid response supported frequency arrest during separation", "Final report: service response varied by category and settings were adjusted", "2022: court-enforced capability and offer violations for a 2019 period", "Current state profile: 150 MW after the 2020 expansion"], reportingBreaks: ["Event-specific response and multi-month offer compliance use different intervals.", "Installed power capacity does not describe energy duration or delivered service."], drivers: ["Fast inverter response", "Control settings", "Expansion from the original installation"], constraints: ["State of charge and enabled service", "Technical offer accuracy", "Service-specific response requirements"], alternatives: ["Event conditions", "Control-setting changes", "Dispatch instructions", "Expansion effects"], laterObservations: ["The enforcement record confirms a bounded service-capability mismatch during 2019 offers.", "The state profile confirms later 150 MW installed power capacity."], compatibility: "Stable asset identity; event response, compliance intervals, and installed capacity are not one performance series.", testResult: "The record supports both demonstrated fast response and a regulator-verified service boundary without converting either into an asset score.", validation: "Independent system operator, regulator, court, and state records.", nextRecords: ["Annual availability and dispatch", "Service enablement and delivery by interval", "Cycling, degradation, revenue, safety, and customer outcomes"],
  }),
  entity({
    portfolio: "infrastructure", slug: "victorian-big-battery", id: "battery-victorian-big-battery", name: "Victorian Big Battery", type: "Named battery asset", scope: "Victorian Big Battery at Moorabool", indicator: "Commissioning incident, registration, and scheme capability", unit: "Dated operating or regulatory milestone", denominator: "The incident, registered power, or reserve capability in the cited record", period: "July through December 2021 and current investigation index", method: "Energy Safe Victoria technical findings and AEMO system records", attribution: "Energy Safe Victoria and AEMO", sourceSlugs: ["vbb-esv-fire-findings-2021", "vbb-aemo-registration-2021", "vbb-aemo-operational-2021", "vbb-esv-investigations"], panelTitle: "Victorian Big Battery moved from a commissioning fire to registered and operational reserve capability", panelSummary: "The sequence supports incident, registration, and declared capability milestones while leaving realized later performance unobserved.", observations: ["July 2021: commissioning fire consumed two Megapacks", "October 2021: AEMO recorded 300 MW registration", "December 2021: AEMO reported 300 MW / 450 MWh fully operational with up to 250 MW reserve capability"], reportingBreaks: ["Incident scope, registered power, stored energy, and reserve capability are different measures.", "The regulator index does not supply a later performance observation."], drivers: ["Commissioning and isolation work", "System Integrity Protection Scheme registration", "Automatic emergency reserve controls"], constraints: ["Thermal-event risk", "Commissioning sequence", "Missing public annual operating series"], alternatives: ["Commissioning-specific conditions", "Control or isolation changes", "Registration timing", "Scheme dispatch rules"], laterObservations: ["AEMO registered the asset after the commissioning event.", "AEMO then reported the stated emergency-reserve capability operational."], compatibility: "Stable asset; the sequence supports temporal order but not causal proof that one action produced later performance.", testResult: "Official records support operational progression after the incident while leaving closure, availability, dispatch, degradation, and benefit measures open.", validation: "Independent safety regulator and system operator records.", nextRecords: ["Corrective-action closure", "Annual availability, dispatch, and cycling", "Degradation, revenue, scheme activation, safety, and customer effects"],
  }),
  entity({
    portfolio: "infrastructure", slug: "dalrymple-escri-bess", id: "battery-dalrymple-escri-sa", name: "Dalrymple ESCRI-SA Battery Energy Storage System", type: "Named battery asset", scope: "Dalrymple 30 MW / 8 MWh battery in South Australia", indicator: "System-event response, islanding, state-of-charge constraint, and project results", unit: "Dated operating observation", denominator: "The system events, reporting window, or enabled service declared in each record", period: "December 2018 through April 2021", method: "ARENA project reports and AEMO system-planning review", attribution: "ElectraNet project reporting through ARENA and independent AEMO observations", sourceSlugs: ["dalrymple-arena-operational-2020", "dalrymple-aemo-minimum-demand-2020", "dalrymple-arena-final-2021", "dalrymple-arena-retrospective-2021"], panelTitle: "Dalrymple's project record documents multi-service operation and a visible state-of-charge constraint", panelSummary: "Project-reported event response and revenue remain separated from AEMO's independent constraint observation and from any counterfactual reliability claim.", observations: ["Operational report: 14 events, including three local-load supply events", "AEMO review: a November 2019 state-of-charge limit reduced available response", "Final report: 30 MW / 8 MWh with commercial operation from December 2018", "Retrospective: project reporting summarized 29 events across 2018-2020"], reportingBreaks: ["The 14-event and 29-event counts use different windows.", "Project revenue, event response, islanding, and system reliability have separate denominators."], drivers: ["Fast frequency response", "Islanding and local supply", "Multiple market and network services"], constraints: ["Short energy duration", "State of charge", "Event and market-window selection"], alternatives: ["Network event mix", "Enabled service and dispatch rules", "State-of-charge management", "Project reporting window"], laterObservations: ["AEMO independently documented a state-of-charge constraint during one operating condition.", "The final and retrospective records preserve broader project operation without a counterfactual comparator."], compatibility: "Same asset; project and system-operator records overlap but use different windows and outcome measures.", testResult: "The mixed record supports multi-service operation and a real operating constraint while leaving net reliability and economic causation unresolved.", validation: "AEMO supplies an independent system observation; other results remain project-attributed through ARENA.", nextRecords: ["Later availability, dispatch, and islanding events", "State-of-charge and degradation series", "Revenue, avoided cost, reliability, and customer-outcome denominators"],
  }),
  entity({
    portfolio: "mobility", slug: "american-airlines", id: "carrier-american-airlines", name: "American Airlines", type: "Reporting operating air carrier", scope: "American Airlines operating-carrier domestic scheduled service", indicator: "Annual cancellation rate and later monthly on-time observation", unit: "Percentage of scheduled operations", denominator: "American Airlines reporting operating-carrier scheduled flights", period: "Calendar years 2023-2025 and May 2026", method: "DOT Air Travel Consumer Report operating-carrier tables", attribution: "Carrier-reported data compiled by DOT and BTS", sourceSlugs: ["atcr-full-year-2024", "atcr-full-year-2025", "atcr-may-2026", "dot-airline-dashboard"], panelTitle: "American's annual cancellation rate increased in 2024 and 2025", panelSummary: "The same operating-carrier annual denominator shows a higher cancellation rate in both later years; the May 2026 on-time and dashboard records remain separate.", observations: ["2023: 9,978 of 940,531 scheduled operations cancelled, 1.06 percent", "2024: 15,252 of 984,306 cancelled, 1.55 percent", "2025: 17,679 of 973,653 cancelled, 1.82 percent"], reportingBreaks: ["Annual cancellation and monthly on-time percentages are different measures.", "Brand commitments and complaints can include a different operating or marketing scope."], drivers: ["Schedule and network design", "Airport and national-system exposure", "Maintenance, crew, and late-aircraft recovery"], constraints: ["Weather and congestion", "Partner-operation attribution", "No public flight-level causal assignment in the panel"], alternatives: ["Schedule mix", "Airport exposure", "Weather", "Maintenance or staffing", "Late inbound aircraft"], laterObservations: ["May 2026 American operating flights arrived on time 75.1 percent of the time in DOT's table.", "DOT's dashboard records stated service commitments but does not verify delivery for individual disruptions."], compatibility: "Same carrier identity; annual cancellations, monthly on-time arrivals, and commitments use different denominators.", testResult: "The later month and commitment layer broaden the service record but do not explain the annual cancellation change or verify remedy delivery.", validation: "Official DOT compilation; carrier-reported cause and commitment information remains attributed.", nextRecords: ["Later full-year cancellation rate", "Flight-level cause, route, airport, weather, and schedule controls", "Eligible disruption counts and verified remedy delivery"],
  }),
  entity({
    portfolio: "mobility", slug: "alaska-airlines", id: "carrier-alaska-airlines", name: "Alaska Airlines", type: "Reporting operating air carrier", scope: "Alaska Airlines operating-carrier domestic scheduled service", indicator: "Annual cancellation rate and later monthly on-time observation", unit: "Percentage of scheduled operations", denominator: "Alaska Airlines reporting operating-carrier scheduled flights under the applicable certificate", period: "Calendar years 2023-2025 and May 2026", method: "DOT Air Travel Consumer Report operating-carrier tables", attribution: "Carrier-reported data compiled by DOT and BTS", sourceSlugs: ["atcr-full-year-2024", "atcr-full-year-2025", "atcr-may-2026", "dot-airline-dashboard"], panelTitle: "Alaska's cancellation rate rose in 2024, fell in 2025, and then crossed an operating-certificate break", panelSummary: "The annual series is published with the October 2025 Alaska-Hawaiian single-certificate break attached.", observations: ["2023: 1,977 of 245,344 scheduled operations cancelled, 0.81 percent", "2024: 4,811 of 245,819 cancelled, 1.96 percent", "2025: 2,974 of 245,588 cancelled, 1.21 percent"], reportingBreaks: ["FAA recognized Alaska and Hawaiian under a single operating certificate on October 29, 2025.", "Hawaiian-branded flights are operated by Alaska after the certificate change."], drivers: ["Schedule and network design", "Integration and certificate transition", "Airport, weather, maintenance, crew, and recovery conditions"], constraints: ["Identity break inside the 2025 annual period", "Partner and brand attribution", "No common service-quality composite"], alternatives: ["Hawaiian integration", "Schedule mix", "Weather and airport exposure", "Maintenance or staffing"], laterObservations: ["DOT reported 82.4 percent on-time arrivals for Alaska operating flights in May 2026.", "The May record operates after the certificate break and cannot silently extend the pre-integration series."], compatibility: "The carrier name continues, but the operating population changes after the single certificate.", testResult: "The later official record supports a post-integration observation while blocking a simple trend or causal reading across the certificate break.", validation: "Official DOT compilation with the identity break explicitly disclosed.", nextRecords: ["Post-integration full-year operating denominator", "Separate branded and operating flight attribution", "Route, airport, weather, cause, and verified remedy records"],
  }),
  entity({
    portfolio: "mobility", slug: "jetblue-airways", id: "carrier-jetblue-airways", name: "JetBlue Airways", type: "Reporting operating air carrier", scope: "JetBlue Airways operating-carrier domestic scheduled service", indicator: "Annual cancellation rate and later monthly on-time observation", unit: "Percentage of scheduled operations", denominator: "JetBlue Airways reporting operating-carrier scheduled flights", period: "Calendar years 2023-2025 and May 2026", method: "DOT Air Travel Consumer Report operating-carrier tables", attribution: "Carrier-reported data compiled by DOT and BTS", sourceSlugs: ["atcr-full-year-2024", "atcr-full-year-2025", "atcr-may-2026", "dot-airline-dashboard"], panelTitle: "JetBlue's cancellation rate fell in 2024 and edged higher in 2025", panelSummary: "The annual operating-carrier rail remains separate from the later monthly on-time, baggage, wheelchair, complaint, and commitment denominators.", observations: ["2023: 5,763 of 274,852 scheduled operations cancelled, 2.10 percent", "2024: 3,735 of 240,282 cancelled, 1.55 percent", "2025: 3,825 of 231,413 cancelled, 1.65 percent"], reportingBreaks: ["Scheduled operations declined across the three annual observations.", "May on-time, baggage, wheelchair, complaint, and commitment records use different denominators."], drivers: ["Schedule and network concentration", "Airport and national-system exposure", "Maintenance, crew, and late-aircraft recovery"], constraints: ["Changing flight denominator", "Northeast weather and congestion exposure", "No public matched flight-level causal model"], alternatives: ["Schedule reduction", "Route and airport mix", "Weather", "Maintenance or staffing", "Late inbound aircraft"], laterObservations: ["DOT reported 81.0 percent on-time arrivals for JetBlue in May 2026.", "DOT also reported distinct baggage and wheelchair or scooter denominators that cannot be merged with cancellation performance."], compatibility: "Stable carrier identity; annual cancellation and monthly service measures remain separate.", testResult: "The May record shows a bounded later operating observation but does not isolate why the annual cancellation rate changed.", validation: "Official DOT compilation; carrier reporting is not an independent causal determination.", nextRecords: ["Later full-year cancellation and schedule denominator", "Route, airport, weather, cause, maintenance, and crew controls", "Complaint rates and verified remedy delivery"],
  }),
];

const portfolioHolds = [
  { portfolio: "ai_cyber", slug: "agency-cross-entity-hold", title: "The second agency cohort does not support a cybersecurity ranking", summary: "VA, DOE, and DOT records use different audit scopes, metric sets, component populations, finding types, and recommendation inventories." },
  { portfolio: "manufacturing", slug: "manufacturing-cross-entity-hold", title: "The three aircraft lines do not support a production-performance ranking", summary: "Due-date lateness, cumulative deliveries, fielding, contractor totals, deficiency states, labor interruptions, and sustainment outcomes are not one denominator." },
  { portfolio: "infrastructure", slug: "battery-cross-entity-hold", title: "The three battery assets do not support an availability, safety, or value ranking", summary: "Event response, capacity, state of charge, compliance, incident progression, market revenue, islanding, and reserve capability remain separate." },
  { portfolio: "mobility", slug: "carrier-cross-entity-hold", title: "The three carriers do not support a service-quality or readiness ranking", summary: "Annual cancellations, monthly on-time arrivals, complaints, baggage, wheelchair handling, commitments, brand scope, and operating scope retain separate denominators." },
];

for (const directory of ["sources", "research-documents", "research-collections", "signals", "briefings", "updates"]) {
  await mkdir(join(contentRoot, directory), { recursive: true });
}
await mkdir(dataRoot, { recursive: true });

for (const record of sources) {
  const defaults = portfolioDefaults[record.portfolio];
  await writeFile(join(contentRoot, "sources", `${sourceId(record.slug)}.json`), json({
    id: sourceId(record.slug),
    name: record.title,
    url: record.url,
    source_type: record.sourceType === "Company Press Room" ? "Company Press Room" : "Government Agency",
    credibility_level: record.sourceType === "Company Press Room" ? "Tier 2" : "Tier 1",
    primary_topics: defaults.topics,
    framework_layers: defaults.layers,
    country_or_region: defaults.jurisdiction,
    update_frequency: record.title.includes("Air Travel Consumer Report") ? "Monthly" : "Event-driven",
    capture_priority: "High",
    known_limitations: `${record.limit} Phase 56E keeps the entity, unit, denominator, method, attribution, and observation window attached.`,
    last_checked_date: capturedDate,
    watch_lanes: defaults.watch,
    live_access_type: record.url.toLowerCase().includes(".pdf") ? "Data Download" : "Release Page",
    ...(record.url.toLowerCase().includes(".pdf") ? { data_download_url: record.url } : {}),
    review_cadence_days: 60,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: defaults.jurisdiction,
    source_owner: record.publisher,
    notes: `Phase 56E second-cohort source. Collection: ${collectionSlug}.`,
  }), "utf8");
}

const documents = entities.flatMap((item) => item.sourceSlugs.map((sourceSlug) => ({
  entity: item,
  source: sources.find((candidate) => candidate.slug === sourceSlug),
})));

for (const [index, document] of documents.entries()) {
  const defaults = portfolioDefaults[document.entity.portfolio];
  const archiveName = `${String(index + 1).padStart(2, "0")}-${document.entity.slug}-${document.source.slug}.txt`;
  await writeFile(join(contentRoot, "research-documents", `${276 + index}-56e-${document.entity.slug}-${document.source.slug}.json`), json({
    id: documentId(document.entity.slug, document.source.slug),
    collection_id: collectionId,
    title: `${document.entity.name}: ${document.source.title}`,
    slug: `56e-${document.entity.slug}-${document.source.slug}`,
    record_status: "Published",
    publisher: document.source.publisher,
    publication_date: document.source.publicationDate,
    document_type: researchDocumentType(document.source.sourceType),
    summary: `${document.source.summary} Phase 56E entity use: ${document.entity.panelSummary}`,
    key_findings: [
      document.source.finding,
      `Entity layer: ${document.entity.scope}.`,
      `Compatibility boundary: ${document.entity.compatibility}`,
    ],
    why_it_matters: "The record supports one or more layers of the second-cohort panel, driver-and-constraint dossier, and alternative-explanation test.",
    ftfn_relevance: [
      "Preserves a stable second-cohort entity identity.",
      "Keeps attribution and the observation denominator visible.",
      "Connects the same entity vertically across three evidence layers.",
    ],
    evidence_limits: [
      document.source.limit,
      document.entity.validation,
      "No causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is supported.",
    ],
    primary_topics: defaults.topics,
    framework_layers: defaults.layers,
    constraint_tags: defaults.constraints,
    source_id: sourceId(document.source.slug),
    official_url: document.source.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  }), "utf8");
}

const layerSignal = (item, layer) => {
  const defaults = portfolioDefaults[item.portfolio];
  const id = `signal-56e-${item.slug}-${layer}`;
  const sourceSlugs = layer === "panel" ? item.sourceSlugs.slice(0, 3) : layer === "dossier" ? item.sourceSlugs : item.sourceSlugs.slice(2);
  const title = layer === "panel"
    ? item.panelTitle
    : layer === "dossier"
      ? `${item.name}: named drivers and constraints remain separated`
      : `${item.name}: later records test alternatives without establishing cause`;
  const summary = layer === "panel"
    ? item.panelSummary
    : layer === "dossier"
      ? `The dossier separates ${item.drivers.join(", ")} from ${item.constraints.join(", ")} and preserves who made each claim.`
      : item.testResult;
  const sections = layer === "panel"
    ? `## Named-entity panel

${item.panelSummary}

## Observations

${item.observations.map((value, index) => `${index + 1}. ${value}`).join("\n")}

## Reporting breaks

${item.reportingBreaks.map((value) => `- ${value}`).join("\n")}`
    : layer === "dossier"
      ? `## Driver candidates

${item.drivers.map((value) => `- ${value}`).join("\n")}

## Constraints

${item.constraints.map((value) => `- ${value}`).join("\n")}

## Alternative explanations

${item.alternatives.map((value) => `- ${value}`).join("\n")}

## Attribution

${item.attribution}`
      : `## Alternative-explanation test

${item.testResult}

## Named alternatives

${item.alternatives.map((value) => `- ${value}`).join("\n")}

## Later observations

${item.laterObservations.map((value, index) => `${index + 1}. ${value}`).join("\n")}

## Compatibility

${item.compatibility}

## Validation status

${item.validation}`;
  return {
    id,
    title,
    summary,
    body: `---
id: ${yaml(id)}
title: ${yaml(title)}
slug: ${yaml(id.replace("signal-", ""))}
record_status: "Published"
summary: ${yaml(summary)}
source_ids:
${yamlArray(sourceSlugs.map(sourceId))}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${yaml(defaults.topics[0])}
framework_layers:
${yamlArray(defaults.layers)}
signal_type: "Market Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: ${yaml("The same retained entity is carried through a bounded evidence layer without changing its identity or comparison contract.")}
dependencies:
  - "stable entity identity"
  - "declared unit and denominator"
  - "source attribution"
  - "compatibility boundary"
constraints:
${yamlArray(defaults.constraints)}
receiving_systems:
${yamlArray(defaults.receiving)}
local_implications:
  - "The layer can deepen the entity record without creating a cross-entity score."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${yaml("Publish the bounded observation only. Do not infer causation or create rankings, composites, readiness scores, or silent series extensions.")}
---

${sections}

## What remains unresolved

${item.nextRecords.map((value) => `- ${value}`).join("\n")}

## Publication boundary

The evidence supports this entity layer only. It does not establish causation, comparative performance, readiness, or a common cross-entity score.
`,
  };
};

const entitySignals = entities.flatMap((item) => ["panel", "dossier", "alternative-test"].map((layer) => layerSignal(item, layer)));
const heldSignals = portfolioHolds.map((hold) => {
  const defaults = portfolioDefaults[hold.portfolio];
  const ids = entities.filter((item) => item.portfolio === hold.portfolio).flatMap((item) => item.sourceSlugs.map(sourceId));
  const id = `signal-56e-${hold.slug}`;
  return {
    id,
    title: hold.title,
    body: `---
id: ${yaml(id)}
title: ${yaml(hold.title)}
slug: ${yaml(id.replace("signal-", ""))}
record_status: "In Review"
summary: ${yaml(hold.summary)}
source_ids:
${yamlArray(addUnique(ids))}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${yaml(defaults.topics[0])}
framework_layers:
${yamlArray(defaults.layers)}
signal_type: "Market Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The explicit hold prevents different units, scopes, methods, and denominators from becoming a comparative score."
dependencies:
  - "common unit and denominator"
  - "compatible method and observation window"
  - "stable attribution"
constraints:
${yamlArray(defaults.constraints)}
receiving_systems:
${yamlArray(defaults.receiving)}
local_implications:
  - "Entity records remain useful while the portfolio interpretation stays held."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: "Hold until a common measurement contract exists. Do not rank, score, or infer causation."
---

## Why this remains held

${hold.summary}

The twelve underlying entity layers remain publishable. This portfolio-level claim does not.

## Publication boundary

No cross-entity ranking, composite, readiness score, or causal conclusion is authorized.
`,
  };
});

for (const signal of [...entitySignals, ...heldSignals]) {
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), signal.body, "utf8");
}

const panels = entities.map((item) => ({
  panel_id: `panel-56e-${item.slug}`,
  portfolio: item.portfolio,
  entity_id: item.id,
  entity_name: item.name,
  entity_type: item.type,
  scope: item.scope,
  indicator: item.indicator,
  unit: item.unit,
  denominator: item.denominator,
  period: item.period,
  method: item.method,
  attribution: item.attribution,
  source_ids: item.sourceSlugs.slice(0, 3).map(sourceId),
  observations: item.observations,
  reporting_breaks: item.reportingBreaks,
  signal_id: `signal-56e-${item.slug}-panel`,
  record_status: "Published",
  comparison_boundary: "Within-entity observations only; no cross-entity ranking, composite, or readiness score.",
  next_records: item.nextRecords,
}));

const dossiers = entities.map((item) => ({
  dossier_id: `dossier-56e-${item.slug}`,
  portfolio: item.portfolio,
  parent_panel_id: `panel-56e-${item.slug}`,
  entity_id: item.id,
  entity_name: item.name,
  source_ids: item.sourceSlugs.map(sourceId),
  driver_candidates: item.drivers,
  constraints: item.constraints,
  alternative_explanations: item.alternatives,
  attribution: item.attribution,
  temporal_boundary: "Sequence is preserved without converting temporal order into causal proof.",
  signal_id: `signal-56e-${item.slug}-dossier`,
  record_status: "Published",
  next_records: item.nextRecords,
}));

const tests = entities.map((item) => ({
  test_id: `test-56e-${item.slug}`,
  portfolio: item.portfolio,
  parent_dossier_id: `dossier-56e-${item.slug}`,
  parent_panel_id: `panel-56e-${item.slug}`,
  entity_id: item.id,
  entity_name: item.name,
  source_ids: item.sourceSlugs.slice(2).map(sourceId),
  tested_alternative_explanations: item.alternatives,
  later_observations: item.laterObservations,
  compatibility: item.compatibility,
  result: item.testResult,
  attribution: item.attribution,
  validation_status: item.validation,
  causal_boundary: "The later records test alternatives and deepen the entity record; they do not establish causation.",
  signal_id: `signal-56e-${item.slug}-alternative-test`,
  record_status: "Published",
  next_records: item.nextRecords,
}));

await writeFile(join(dataRoot, "phase-56e-second-cohort-panels.json"), json({
  phase: "56E",
  captured_date: capturedDate,
  cohort_screen: {
    screened: 12,
    retained: 12,
    held_for_insufficient_evidence: 0,
    minimum_primary_records_per_entity: 4,
  },
  panel_count: panels.length,
  panels,
}), "utf8");

await writeFile(join(dataRoot, "phase-56e-second-cohort-dossiers.json"), json({
  phase: "56E",
  captured_date: capturedDate,
  dossier_count: dossiers.length,
  dossiers,
}), "utf8");

await writeFile(join(dataRoot, "phase-56e-second-cohort-tests.json"), json({
  phase: "56E",
  captured_date: capturedDate,
  test_count: tests.length,
  tests,
}), "utf8");

await writeFile(join(dataRoot, "phase-56e-publication-review.json"), json({
  phase: "56E",
  reviewed_date: capturedDate,
  source_count: sources.length,
  document_count: documents.length,
  entity_count: entities.length,
  vertical_layer_count: entitySignals.length,
  cohort_screen: {
    screened: 12,
    retained: 12,
    held_for_insufficient_evidence: 0,
  },
  signal_decisions: {
    reviewed: entitySignals.length + heldSignals.length,
    promoted: entitySignals.map((signal) => signal.id),
    held: heldSignals.map((signal) => signal.id),
  },
  vertical_rule: "Every retained entity must publish a panel, driver-and-constraint dossier, and alternative-explanation test under one stable entity ID.",
  attribution_rule: "Every layer preserves who made the claim and separates independent oversight from operator or company attribution.",
  compatibility_rule: "Entity, unit, denominator, method, attribution, and observation window remain visible before any interpretation.",
  comparison_rule: "No causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is permitted.",
}), "utf8");

await writeFile(join(contentRoot, "research-collections", `${collectionSlug}.json`), json({
  id: collectionId,
  title: "Second Entity Cohort: Vertical Replication, 2018-2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Forty official source profiles and 48 entity-specific summaries carry a second twelve-entity cohort through panels, driver-and-constraint dossiers, and alternative-explanation tests.",
  scope: "Three federal agencies, three named aircraft production lines, three Australian battery assets, and three U.S. passenger carriers. All twelve entities passed the four-record source-sufficiency screen.",
  captured_date: capturedDate,
  document_ids: documents.map((document) => documentId(document.entity.slug, document.source.slug)),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 51-file archive contains 48 official-link records, consolidated FTFN summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Each retained entity has one stable ID and three vertical layers. Attribution, compatibility, reporting breaks, missing denominators, and alternative explanations stay attached. No causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is created.",
}), "utf8");

const allSignalIds = [...entitySignals, ...heldSignals].map((signal) => signal.id);
await writeFile(join(contentRoot, "briefings", "briefing-research-watch-009-second-cohort-vertical-replication.mdx"), `---
id: "briefing-research-watch-009-second-cohort-vertical-replication"
title: "Research Watch 009: Second-Cohort Vertical Replication"
slug: "research-watch-009-second-cohort-vertical-replication"
record_status: "Published"
summary: "A second twelve-entity cohort passes the source screen and is carried vertically through 36 publishable entity layers while four cross-entity interpretations remain held."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlArray(allSignalIds)}
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-014"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "All twelve candidates passed the four-primary-record source screen."
  - "Every retained entity has a panel, dossier, and alternative-explanation test under one stable ID."
  - "Agency, production-line, battery, and carrier attribution rules remain distinct."
  - "Four portfolio comparisons remain held because their units and denominators are incompatible."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
  - "Unit Economics"
what_to_watch_next:
  - "Agency control operation, closure, incidents, recovery, service, and mission outcomes."
  - "Production-line due dates, labor, rework, yield, quality, cost, and accepted capability."
  - "Battery availability, dispatch, cycling, degradation, closure, revenue, and customer outcomes."
  - "Carrier later annual denominators, cause controls, identity breaks, and verified remedy delivery."
---

## The second-cohort gate

Phase 56E screens twelve candidates before drafting. Each retained entity has at least four primary or official records, a stable identity, a named observation boundary, and enough later evidence to build all three layers.

## Federal agencies

VA, Energy, and Transportation deepen the agency rail. Annual program reviews, management letters, recommendation inventories, control-specific audits, and narrow statutory determinations remain distinct.

## Named production lines

The F-35 Fort Worth, KC-46 Everett, and F-15EX St. Louis records expose delivery, lateness, line interruption, production planning, deficiencies, and sustainment constraints. Cumulative milestones and contractor totals do not become normalized productivity measures.

## Battery assets

Hornsdale, Victorian Big Battery, and Dalrymple add event response, state-of-charge, compliance, incident, registration, reserve, islanding, and project-reporting records. No common availability, safety, or value denominator exists.

## Passenger carriers

American, Alaska, and JetBlue extend the operating-carrier rail. Annual cancellation rates stay separate from monthly on-time, baggage, wheelchair, complaint, and commitment records. Alaska's October 2025 operating-certificate break remains attached.

## Publication boundary

The 36 entity layers publish. Four portfolio interpretations remain In Review. No ranking, composite, readiness score, or causal conclusion is supported.
`, "utf8");

await writeFile(join(contentRoot, "updates", "2026-07-24-phase-56e-second-cohort-vertical-replication.json"), json({
  id: "update-2026-07-24-phase-56e-second-cohort-vertical-replication",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56E adds a second vertically replicated entity cohort",
  summary: "FTFN adds 40 source profiles, 48 summaries, 36 Published entity layers, and four explicit cross-entity holds across twelve retained entities.",
  affected_record_ids: [
    collectionId,
    "briefing-research-watch-009-second-cohort-vertical-replication",
    ...allSignalIds,
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-009-second-cohort-vertical-replication/",
  ],
  evidence_note: "All twelve candidates passed the four-record screen and preserve stable identity, attribution, compatibility, reporting breaks, and the no-ranking and no-causation contract.",
  work_package: "docs/work-packages/phase-56e-second-entity-cohort-vertical-replication.md",
}), "utf8");

console.log(`Generated Phase 56E: ${sources.length} source profiles, ${documents.length} summaries, ${entities.length} retained entities, ${entitySignals.length} Published entity layers, and ${heldSignals.length} held portfolio signals.`);
