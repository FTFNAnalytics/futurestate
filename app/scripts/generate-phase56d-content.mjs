import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionSlug = "repeat-outcomes-alternative-explanation-tests-2010-2026";
const collectionId = `research-collection-${collectionSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yaml = (value) => JSON.stringify(value);
const yamlArray = (items, indent = "  ") => items.map((item) => `${indent}- ${yaml(item)}`).join("\n");
const sourceId = (slug) => `source-56d-${slug}`;
const documentId = (slug) => `research-doc-56d-${slug}`;

const portfolioDefaults = {
  ai_cyber: {
    topics: ["Cybersecurity", "AI for Science", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Standards", "Data Quality", "Safety", "Public Trust"],
    receiving: ["Named federal agency information-security programs"],
    watch: ["Security and Standards", "Cross-Cutting Official Rails"],
    jurisdiction: "United States federal government",
  },
  manufacturing: {
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Labor", "Data Quality", "Unit Economics", "Supply Chain"],
    receiving: ["Named U.S. manufacturing facilities and production lines"],
    watch: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    jurisdiction: "United States manufacturing",
  },
  infrastructure: {
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety", "Weather"],
    receiving: ["Named U.S. battery-storage generating plants"],
    watch: ["Power and Grid", "Cross-Cutting Official Rails"],
    jurisdiction: "United States electric power system",
  },
  mobility: {
    topics: ["Mobility", "Aviation"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Regulation", "Safety", "Infrastructure", "Data Quality", "Public Trust"],
    receiving: ["Named U.S. reporting operating air carriers"],
    watch: ["Mobility Certification", "Cross-Cutting Official Rails"],
    jurisdiction: "United States domestic aviation",
  },
};

const sources = [
  {
    slug: "nasa-gao-risk-management-2025",
    portfolio: "ai_cyber",
    title: "Cybersecurity: NASA Needs to Fully Implement Risk Management",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2025-06-25",
    url: "https://www.gao.gov/products/gao-25-108138",
    sourceType: "Government Agency",
    summary: "GAO evaluated NASA cybersecurity risk management for selected projects and systems and issued sixteen recommendations.",
    finding: "GAO's public recommendation status said in May 2026 that NASA had not yet supplied sufficient evidence to close multiple control-assessment and risk-management recommendations.",
    test: "Tests other remediation work, control scope, and tested-system differences.",
    limit: "The selected systems and recommendation statuses do not represent every NASA system, incident, recovery, service effect, or mission outcome.",
  },
  {
    slug: "nasa-cio-open-recommendations-2026",
    portfolio: "ai_cyber",
    title: "Chief Information Officer Open Recommendations: National Aeronautics and Space Administration",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2026-01-15",
    url: "https://www.gao.gov/products/gao-26-108705",
    sourceType: "Government Agency",
    summary: "GAO identified thirty open recommendations under the NASA CIO in January 2026.",
    finding: "The open set covered national cybersecurity and IT acquisition high-risk areas, including enterprise risk assessment, event logging, and spacecraft acquisition controls.",
    test: "Tests other remediation work and mission-environment differences.",
    limit: "An open-recommendation inventory is a workload and closure boundary, not a severity score or operating-performance measure.",
  },
  {
    slug: "dhs-fisma-fy2025-project",
    portfolio: "ai_cyber",
    title: "Evaluation of DHS' Information Security Program for Fiscal Year 2025: Ongoing Project",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: null,
    url: "https://www.oig.dhs.gov/reports/ongoing-projects",
    sourceType: "Government Agency",
    summary: "DHS OIG lists the FY 2025 FISMA evaluation as an ongoing mandated review.",
    finding: "The later annual outcome was not publicly available at capture, so the FY 2024 effective rating cannot be silently extended.",
    test: "Tests the annual-metric and later-outcome alternatives.",
    limit: "An ongoing-project listing verifies review activity, not the result, tested components, control operation, incidents, recovery, or service effects.",
  },
  {
    slug: "dhs-cdm-recommendations-may2026",
    portfolio: "ai_cyber",
    title: "Cybersecurity: Network Monitoring Program Recommendation Status, May 2026",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2025-06-11",
    url: "https://www.gao.gov/products/gao-25-107470",
    sourceType: "Government Agency",
    summary: "GAO's public status page retained four DHS and CISA Continuous Diagnostics and Mitigation recommendations as open in May 2026.",
    finding: "The open items covered guidance, data-quality milestones, persistent-access onboarding, and cloud-asset strategy.",
    test: "Tests controls outside CDM, component variation, endpoint coverage, data quality, and cloud-asset management.",
    limit: "Recommendation status does not measure the DHS enterprise rating or identical implementation across components and systems.",
  },
  {
    slug: "hhs-fisma-recommendations-tracker-2026",
    portfolio: "ai_cyber",
    title: "HHS OIG Recommendations Tracker: FY 2025 FISMA Review",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2026-03-24",
    url: "https://oig.hhs.gov/reports/recommendations/tracker/?hhs-agency=all&search=OAS-25-18-041&view-mode=report-grouped",
    sourceType: "Government Agency",
    summary: "The HHS OIG tracker listed all ten FY 2025 FISMA recommendations as open and unimplemented at capture.",
    finding: "The recommendations address department and division risk profiles, supply-chain risk management, roles, workforce skills, inventories, monitoring, configurations, and remediation.",
    test: "Tests federated division maturity, recommendation age and severity, and remediation scope.",
    limit: "Tracker status does not measure identical implementation, incidents, recovery, affected services, or health-program outcomes across HHS divisions.",
  },
  {
    slug: "hhs-fisma-fy2025-method",
    portfolio: "ai_cyber",
    title: "HHS FY 2025 FISMA Review and Supplemental-Metric Boundary",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2026-03-24",
    url: "https://oig.hhs.gov/reports/all/2026/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2025/",
    sourceType: "Government Agency",
    summary: "HHS OIG rated the core metrics Consistently Implemented while supplemental metrics were Ad Hoc and the overall program was Not Effective.",
    finding: "The split exposes a measurement-weighting boundary inside the same annual evaluation.",
    test: "Tests annual metric weighting and federated maturity.",
    limit: "The headline result and function-level maturity do not expose a common denominator for component risks, incidents, service effects, or patient outcomes.",
  },
  {
    slug: "current-applications-team-2026",
    portfolio: "manufacturing",
    title: "Current Applications Team and Operating-Role Profile",
    publisher: "Current Applications",
    publicationDate: null,
    url: "https://www.currentapps.com/team",
    sourceType: "Company Press Room",
    summary: "Current Applications identifies current leadership roles for manufacturing, manufacturing engineering, quality assurance, procurement, tooling, and information systems at its Watertown operation.",
    finding: "The page supports current entity and operating-role continuity but exposes no labor hours, staffing levels, output, quality, cost, delivery, demand, or observation window.",
    test: "Tests labor input, tooling and layout, and entity continuity.",
    limit: "A company team page does not independently verify staffing input, line performance, product mix, demand, or persistence of the earlier output result.",
  },
  {
    slug: "current-applications-osha-inspection-2010",
    portfolio: "manufacturing",
    title: "OSHA Inspection 314347824: Current Applications",
    publisher: "Occupational Safety and Health Administration",
    publicationDate: "2010-10-26",
    url: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=314347824",
    sourceType: "Government Agency",
    summary: "OSHA's establishment record documents a 2010 planned inspection at Current Applications' Watertown facility.",
    finding: "The record confirms an entity-address match and a historical safety-inspection denominator, but it predates the reported line intervention and does not supply a repeat production result.",
    test: "Tests entity identity and whether a public operating-condition record is temporally compatible.",
    limit: "The 2010 inspection is not a later compatible outcome and cannot be used to infer current safety, labor, quality, or production performance.",
  },
  {
    slug: "island-components-quality-clauses-2025",
    portfolio: "manufacturing",
    title: "Island Components Purchase Order Quality Clause Supplement, Revision F",
    publisher: "Island Components Group",
    publicationDate: "2025-11-01",
    url: "https://islandcomponents.com/wp-content/uploads/2025/12/ICG_QF36_Quality_Clause_Supplement_RevF.pdf",
    sourceType: "Company Press Room",
    summary: "Island Components' November 2025 supplier supplement defines traceability, inspection, change-control, nonconformance, corrective-action, and key-characteristic requirements.",
    finding: "Where key characteristics are specified, the company requires variation control and a minimum Cpk of 1.33 unless otherwise approved.",
    test: "Tests quality-control design, supplier controls, and parent-resource or capital alternatives.",
    limit: "A supplier requirement is company-attributed control design, not observed first-pass yield, defects, scrap, downtime, delivery, or output.",
  },
  {
    slug: "island-components-certifications-2026",
    portfolio: "manufacturing",
    title: "Island Components Certifications Profile",
    publisher: "Island Components Group",
    publicationDate: null,
    url: "https://islandcomponents.com/about/certifications/",
    sourceType: "Company Press Room",
    summary: "Island Components lists ISO 9001:2015 and AS9100D certifications for the Hauppauge operation.",
    finding: "The current page supports a management-system control claim and the Hauppauge identity but does not expose surveillance findings or line-level outcomes.",
    test: "Tests quality-system controls, facility identity, and parent-resource continuity.",
    limit: "A certification listing does not measure utilization, labor, throughput, quality, delivery, or the persistence of the MEP-attributed output change.",
  },
  {
    slug: "monaghan-fda-tplc-2025",
    portfolio: "manufacturing",
    title: "FDA Total Product Life Cycle: Monaghan Medical Corporation, 2025",
    publisher: "U.S. Food and Drug Administration",
    publicationDate: null,
    url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfTPLC/tplc.cfm?ID=82&manufacturer=MONAGHAN+MEDICAL+CORPORATION&min_report_year=2017&pmndecision=SUBSTANTIALLY+EQUIVALENT",
    sourceType: "Government Agency",
    summary: "FDA's product-life-cycle portal exposes manufacturer-attributed device-event records for Monaghan Medical, including 193 reports shown for 2025 at capture.",
    finding: "The portal supplies a later product-event count but no units distributed denominator and no link to the specific production line in the MEP case.",
    test: "Tests product mix and quality-control or supply-condition alternatives.",
    limit: "Medical-device reports cannot be treated as a defect rate, causal finding, facility measure, or same-line production outcome without denominator and identity reconciliation.",
  },
  {
    slug: "monaghan-iso14001-boundary-2024",
    portfolio: "manufacturing",
    title: "Monaghan Medical ISO 14001 Certification and Stated Objectives",
    publisher: "Monaghan Medical Corporation",
    publicationDate: "2024-02-27",
    url: "https://www.monaghanmed.com/iso-14001-certification/",
    sourceType: "Company Press Room",
    summary: "Monaghan Medical says its environmental-management system attained ISO 14001 certification and carries continual-improvement, waste-diversion, and emissions objectives.",
    finding: "The control record remains current enough to test whether quantified surveillance or environmental outcomes are publicly exposed; they are not supplied on the page.",
    test: "Tests management-system, equipment, layout, quality-control, and supply-condition alternatives.",
    limit: "Certification and stated objectives do not establish line output, yield, scrap, downtime, delivery, waste, emissions, or causal effect.",
  },
  {
    slug: "moss-landing-epa-response-timeline-2026",
    portfolio: "infrastructure",
    title: "Moss Landing Vistra Battery Fire Response Timeline",
    publisher: "U.S. Environmental Protection Agency",
    publicationDate: "2026-06-24",
    url: "https://www.epa.gov/ca/moss-landing-vistra-battery-fire-updates",
    sourceType: "Government Agency",
    summary: "EPA's June 2026 update said 33,943 intact batteries from the burned area had been de-energized and were ready for recycling, with about 5,000 remaining in difficult or unsafe areas.",
    finding: "The timeline records supervised removal progress and no flareups during the December 2025 removal update while the cause of the January 2025 fire remained under investigation.",
    test: "Tests incident and outage conditions, battery-unit differences, and operating-history alternatives.",
    limit: "The response applies to the 300 MW Moss Landing battery building and must not be silently assigned to every generator under the broader EIA plant identity.",
  },
  {
    slug: "moss-landing-epa-agreement-2025",
    portfolio: "infrastructure",
    title: "EPA Agreement for Moss Landing Battery Removal",
    publisher: "U.S. Environmental Protection Agency",
    publicationDate: "2025-07-23",
    url: "https://www.epa.gov/newsreleases/epa-reaches-agreement-vistra-corp-urgent-battery-cleanup-moss-landing-launches-website",
    sourceType: "Government Agency",
    summary: "EPA announced an enforceable agreement requiring Vistra to conduct and fund supervised removal of fire-affected batteries.",
    finding: "The agreement requires work plans, monitoring, emergency response, community involvement, and EPA oversight during removal.",
    test: "Tests regulator-verified corrective-action obligations and incident-response conditions.",
    limit: "An enforceable removal obligation and later progress do not establish root cause, facility return to service, availability, dispatch, revenue, or reliability effects.",
  },
  {
    slug: "manatee-fpl-data-request-2025",
    portfolio: "infrastructure",
    title: "FPL Ten-Year Site Plan Staff Data Request: Manatee Energy Storage",
    publisher: "Florida Public Service Commission",
    publicationDate: "2025-05-01",
    url: "https://www.psc.state.fl.us/library/filings/2025/03321-2025/03321-2025.pdf",
    sourceType: "Government Agency",
    summary: "An FPL response in a Florida PSC docket says Manatee was selected for potential high winter peak capacity need, existing transmission, and proximity to solar charging.",
    finding: "The filing identifies the operator's stated siting and charging logic for the 409 MW asset.",
    test: "Tests load, weather, solar availability, transmission, and dispatch-rule alternatives.",
    limit: "The statement is operator-attributed inside a regulatory docket and does not expose realized dispatch, availability, cycling, degradation, revenue, or customer savings.",
  },
  {
    slug: "manatee-fpl-site-plan-2025",
    portfolio: "infrastructure",
    title: "Florida Power & Light 2025 Ten-Year Site Plan",
    publisher: "Florida Public Service Commission",
    publicationDate: "2025-04-01",
    url: "https://www.psc.state.fl.us/library/filings/2025/02502-2025/02502-2025.pdf",
    sourceType: "Government Agency",
    summary: "FPL's filed 2025 site plan continued to list 409 MW of in-service Manatee battery storage charged from a nearby solar facility.",
    finding: "The later filing supports capacity and operating-status continuity while keeping realized energy and service outcomes unobserved.",
    test: "Tests asset identity, solar availability, and transmission or planning-condition alternatives.",
    limit: "A utility planning filing is not independently verified interval dispatch, availability, cycle count, degradation, grid-service, or customer-reliability evidence.",
  },
  {
    slug: "gateway-cpuc-resolution-e5428-2025",
    portfolio: "infrastructure",
    title: "CPUC Resolution E-5428: Gateway Thermal Event and Partial Return",
    publisher: "California Public Utilities Commission",
    publicationDate: "2025-11-24",
    url: "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M588/K329/588329444.PDF",
    sourceType: "Government Agency",
    summary: "CPUC Resolution E-5428 records a thermal event at Gateway, ongoing CPUC and EPA root-cause investigations, an EPA settlement, and a partial return to service.",
    finding: "The later regulator record directly exposes incident and partial-operation conditions that the capacity-only panel could not show.",
    test: "Tests facility operating history, maintenance, incident, and dispatch-condition alternatives.",
    limit: "The resolution does not supply a common availability denominator, full restored capacity, cycle count, degradation, revenue, or customer-reliability outcome.",
  },
  {
    slug: "gateway-epa-bess-safety-2025",
    portfolio: "infrastructure",
    title: "EPA Battery Energy Storage Safety and Incident-Response Considerations",
    publisher: "U.S. Environmental Protection Agency",
    publicationDate: "2025-09-04",
    url: "https://www.epa.gov/electronics-batteries-management/battery-energy-storage-systems-main-considerations-safe",
    sourceType: "Government Agency",
    summary: "EPA's BESS safety page records the May 2024 Gateway fire, seven days of flareups, monitoring and work-plan requirements during battery handling, and broader incident-response considerations.",
    finding: "The record supplies an independent incident boundary but does not quantify restored performance.",
    test: "Tests operating history, maintenance, safety, and outage-condition alternatives.",
    limit: "A safety and response record cannot be converted into capacity, availability, dispatch, degradation, revenue, or grid-service performance.",
  },
  {
    slug: "dot-atcr-february-2026",
    portfolio: "mobility",
    title: "February 2026 Air Travel Consumer Report: December 2025 Operating Data",
    publisher: "U.S. Department of Transportation",
    publicationDate: "2026-02-01",
    url: "https://www.transportation.gov/sites/dot.gov/files/2026-03/February_2026%20ATCR.pdf",
    sourceType: "Government Agency",
    summary: "DOT's February 2026 report supplies December 2025 operating-carrier records, on-time and cancellation percentages, and five delay-cause categories.",
    finding: "The monthly operating-carrier table provides a compatible cause-mix observation for Delta, Southwest, and United.",
    test: "Tests weather, airport and national-system exposure, maintenance or staffing, network structure, and late-aircraft recovery alternatives.",
    limit: "One month is not a full-year result, and carrier-reported cause categories do not independently prove why performance changed.",
  },
  {
    slug: "dot-atcr-july-2026",
    portfolio: "mobility",
    title: "July 2026 Air Travel Consumer Report: May 2026 Operating and Complaint Data",
    publisher: "U.S. Department of Transportation",
    publicationDate: "2026-07-01",
    url: "https://www.transportation.gov/sites/dot.gov/files/2026-06/July%202026%20ATCR.pdf",
    sourceType: "Government Agency",
    summary: "DOT's July 2026 report supplies May 2026 operating-carrier delay causes plus brand-level complaint-category counts.",
    finding: "The report provides a later compatible monthly operating denominator and a separate complaint denominator for Delta, Southwest, and United.",
    test: "Tests delay-cause mix, network or airport exposure, customer-service evidence, and partner-operation attribution.",
    limit: "Monthly operating percentages and raw brand-level complaint counts use different denominators and must not be combined into a service score.",
  },
];

const tests = [
  {
    slug: "nasa-repeat-control-test",
    portfolio: "ai_cyber",
    parentDossier: "dossier-56c-nasa-cyber-controls",
    parentPanel: "panel-56b-nasa-fisma",
    entityId: "agency-nasa",
    entityName: "National Aeronautics and Space Administration",
    status: "Published",
    title: "NASA's 2026 open-recommendation record tests the remediation and system-scope alternatives",
    sourceSlugs: ["nasa-gao-risk-management-2025", "nasa-cio-open-recommendations-2026"],
    testedAlternatives: ["Other remediation work", "Control scope and tested systems", "Legacy-system and mission-environment differences"],
    observations: [
      "GAO's May 2026 status retained multiple selected-system risk-management recommendations as open.",
      "GAO identified thirty open recommendations under the NASA CIO in January 2026.",
    ],
    compatibility: "Same agency and overlapping cybersecurity-control domain; recommendation inventories are not the annual FISMA maturity metric.",
    result: "The later records support a bounded remediation-workload and control-scope update but do not resolve control operation, incidents, recovery, or mission effects.",
    attribution: "GAO independently reports the findings and public recommendation statuses.",
    validation: "Independent official oversight; closure is not inferred where evidence remained insufficient.",
    next: "Add FY 2026 FISMA results and recommendation-level closure evidence with tested-system, incident, recovery, service, and mission denominators.",
  },
  {
    slug: "dhs-repeat-control-test",
    portfolio: "ai_cyber",
    parentDossier: "dossier-56c-dhs-cyber-controls",
    parentPanel: "panel-56b-dhs-fisma",
    entityId: "agency-dhs",
    entityName: "Department of Homeland Security",
    status: "Published",
    title: "DHS's later CDM statuses remain open while the FY 2025 enterprise result is pending",
    sourceSlugs: ["dhs-fisma-fy2025-project", "dhs-cdm-recommendations-may2026"],
    testedAlternatives: ["Controls outside CDM", "Component-level variation", "Selected component and system scope", "Annual FISMA metric changes"],
    observations: [
      "GAO retained four CDM recommendations as open in May 2026.",
      "DHS OIG listed the FY 2025 enterprise evaluation as ongoing at capture.",
    ],
    compatibility: "Same department and CDM control input; the enterprise annual result and program recommendation statuses remain separate measurement systems.",
    result: "The later records challenge any closure assumption and block extension of the FY 2024 enterprise rating into FY 2025.",
    attribution: "GAO reports CDM status; DHS OIG reports the annual review stage.",
    validation: "Independent official status records; no missing annual outcome is imputed.",
    next: "Add the released FY 2025 evaluation, component findings, recommendation closures, endpoint and cloud coverage, incidents, recovery, and service effects.",
  },
  {
    slug: "hhs-repeat-control-test",
    portfolio: "ai_cyber",
    parentDossier: "dossier-56c-hhs-cyber-controls",
    parentPanel: "panel-56b-hhs-fisma",
    entityId: "agency-hhs",
    entityName: "Department of Health and Human Services",
    status: "Published",
    title: "HHS's recommendation tracker exposes an unimplemented closure state and a metric split",
    sourceSlugs: ["hhs-fisma-recommendations-tracker-2026", "hhs-fisma-fy2025-method"],
    testedAlternatives: ["Federated operating-division maturity", "Annual metric weighting", "Recommendation age and severity", "Control areas outside the open GAO set"],
    observations: [
      "The tracker listed all ten FY 2025 report recommendations as open and unimplemented.",
      "The FY 2025 review rated core metrics Consistently Implemented and supplemental metrics Ad Hoc.",
    ],
    compatibility: "Same department and annual evaluation, but tracker status, core metrics, supplemental metrics, and the headline result use distinct fields.",
    result: "The later records support a bounded closure and weighting test while leaving division-level operation and downstream outcomes unresolved.",
    attribution: "HHS OIG reports both the annual evaluation and recommendation status.",
    validation: "Independent oversight with an explicit tracker state; no division-level equivalence is assumed.",
    next: "Add dated recommendation closures, division control tests, incidents, recovery, affected services, and health-program outcomes.",
  },
  {
    slug: "current-applications-repeat-test",
    portfolio: "manufacturing",
    parentDossier: "dossier-56c-current-applications-drivers",
    parentPanel: "panel-56b-current-applications-output",
    entityId: "manufacturer-current-applications-watertown-ny",
    entityName: "Current Applications",
    status: "In Review",
    title: "Current Applications retains entity continuity but no compatible repeat line outcome",
    sourceSlugs: ["current-applications-team-2026", "current-applications-osha-inspection-2010"],
    testedAlternatives: ["Labor input", "Tooling and layout", "Product mix", "Demand and backlog", "Unrecorded private capital investment"],
    observations: [
      "The current company page identifies manufacturing, engineering, quality, procurement, tooling, and information-system roles.",
      "The independently attributable OSHA inspection predates the line intervention and is not a later production observation.",
    ],
    compatibility: "The company identity is stable; neither record uses the same line, output unit, labor denominator, or post-intervention window.",
    result: "The test remains held because public records do not expose a compatible repeat output or input series.",
    attribution: "Operating roles are company-attributed; the historical inspection is OSHA-attributed.",
    validation: "Entity continuity is partially supported; line performance is not independently validated.",
    next: "Obtain same-line output, labor hours, WIP, yield, scrap, downtime, cost, delivery, demand, and dated capital records.",
  },
  {
    slug: "island-components-repeat-test",
    portfolio: "manufacturing",
    parentDossier: "dossier-56c-island-components-drivers",
    parentPanel: "panel-56b-island-components-output",
    entityId: "manufacturer-island-components-hauppauge-ny",
    entityName: "Island Components Group",
    status: "In Review",
    title: "Island Components exposes later quality-control design, not observed line performance",
    sourceSlugs: ["island-components-quality-clauses-2025", "island-components-certifications-2026"],
    testedAlternatives: ["Lean workflow changes", "Parent resources", "Capital equipment", "Labor and staffing", "Product mix and demand"],
    observations: [
      "The 2025 supplier clauses define nonconformance, corrective action, traceability, change control, and specified key-characteristic requirements.",
      "The current certification page lists ISO 9001:2015 and AS9100D for the Hauppauge operation.",
    ],
    compatibility: "Same company and facility identity; control design and certification are not the same output, labor, WIP, yield, defect, downtime, or delivery measures.",
    result: "The test remains held because no repeat line outcome or surveillance finding is exposed.",
    attribution: "Both records are company-published; no independent surveillance report is available in the captured set.",
    validation: "The records support stated control design, not observed operation or causal effect.",
    next: "Add certification-surveillance findings and same-line output, labor, WIP, yield, defects, downtime, delivery, demand, and parent-resource use.",
  },
  {
    slug: "monaghan-medical-repeat-test",
    portfolio: "manufacturing",
    parentDossier: "dossier-56c-monaghan-medical-drivers",
    parentPanel: "panel-56b-monaghan-medical-output",
    entityId: "manufacturer-monaghan-medical-plattsburgh-ny",
    entityName: "Monaghan Medical",
    status: "Published",
    title: "Monaghan's FDA product-event record adds a later quality boundary without a line denominator",
    sourceSlugs: ["monaghan-fda-tplc-2025", "monaghan-iso14001-boundary-2024"],
    testedAlternatives: ["Demand and product mix", "Quality-control and supply conditions", "Equipment and layout", "Lean intervention"],
    observations: [
      "FDA's portal showed 193 manufacturer-attributed device reports for 2025 at capture.",
      "The company's ISO 14001 page supplies control objectives but no quantitative surveillance or environmental outcome.",
    ],
    compatibility: "Same manufacturer; product-event counts and environmental management controls do not identify the MEP production line or units distributed.",
    result: "The bounded record can publish as a denominator warning, but it does not test persistence of the reported line-output change.",
    attribution: "FDA exposes the event-report dataset; environmental-control claims remain company-attributed.",
    validation: "The event count is independently accessible; defect rate, line identity, and causal interpretation are not validated.",
    next: "Add units distributed, product identity, same-line output, labor, yield, scrap, downtime, delivery, demand, waste, emissions, and surveillance findings.",
  },
  {
    slug: "moss-landing-repeat-test",
    portfolio: "infrastructure",
    parentDossier: "dossier-56c-moss-landing-constraints",
    parentPanel: "panel-56b-moss-landing-battery-capacity",
    entityId: "eia-plant-260",
    entityName: "Dynegy Moss Landing Power Plant Hybrid",
    status: "Published",
    title: "Moss Landing's supervised removal progress tests the incident and facility-identity alternatives",
    sourceSlugs: ["moss-landing-epa-response-timeline-2026", "moss-landing-epa-agreement-2025"],
    testedAlternatives: ["Incident and outage conditions", "Battery-unit differences", "Broader power-plant equipment", "Ownership and operating changes"],
    observations: [
      "EPA reported 33,943 intact batteries de-energized and ready for recycling by June 24, 2026, with about 5,000 remaining in difficult areas.",
      "The enforceable agreement created regulator-supervised removal, monitoring, and emergency-response obligations.",
    ],
    compatibility: "The records concern the 300 MW fire-affected battery building inside the broader Moss Landing complex; they are not a common 750 MW plant-performance observation.",
    result: "The later official record verifies corrective-action progress and an incident boundary while blocking a facility-wide availability or return-to-service claim.",
    attribution: "EPA independently reports the obligation and supervised response progress.",
    validation: "Regulator-verified work status; root cause, complete removal, return to service, and plant-wide performance remain unresolved.",
    next: "Add final removal closure, CPUC investigation findings, generator reconciliation, availability, dispatch, duration, revenue, grid service, and reliability effects.",
  },
  {
    slug: "manatee-repeat-test",
    portfolio: "infrastructure",
    parentDossier: "dossier-56c-manatee-constraints",
    parentPanel: "panel-56b-manatee-battery-capacity",
    entityId: "eia-plant-60014",
    entityName: "Manatee Solar Energy Center",
    status: "Published",
    title: "Manatee's later planning filings test siting and charging alternatives but not realized dispatch",
    sourceSlugs: ["manatee-fpl-data-request-2025", "manatee-fpl-site-plan-2025"],
    testedAlternatives: ["Load and weather", "Solar availability", "Transmission constraints", "Market and dispatch rules"],
    observations: [
      "FPL attributed the location choice to high winter peak capacity need, existing transmission, and proximity to solar charging.",
      "The 2025 site plan continued to list 409 MW of in-service storage at Manatee.",
    ],
    compatibility: "Same asset and power-capacity unit; both records are operator statements in regulatory filings rather than interval performance observations.",
    result: "The filings sharpen the stated operating logic and identity boundary but do not establish availability, cycling, dispatch, value, or customer effect.",
    attribution: "FPL makes the claims in filings maintained by the Florida PSC.",
    validation: "The docket independently validates that the statements were filed, not the realized operating outcomes.",
    next: "Add interval dispatch, availability, cycles, state of charge, degradation, revenue, curtailment, outage response, and customer-cost records.",
  },
  {
    slug: "gateway-repeat-test",
    portfolio: "infrastructure",
    parentDossier: "dossier-56c-gateway-constraints",
    parentPanel: "panel-56b-gateway-battery-capacity",
    entityId: "eia-plant-63834",
    entityName: "Gateway Energy Storage System",
    status: "Published",
    title: "Gateway's thermal-event and partial-return record tests the capacity-only panel",
    sourceSlugs: ["gateway-cpuc-resolution-e5428-2025", "gateway-epa-bess-safety-2025"],
    testedAlternatives: ["Facility operating history", "Maintenance scheduling", "Dispatch conditions", "New GO 167-C implementation timing"],
    observations: [
      "CPUC recorded ongoing root-cause investigations and a partial return to service after the thermal event.",
      "EPA recorded the May 2024 fire, seven days of flareups, and monitoring and work-plan requirements.",
    ],
    compatibility: "Same named asset and incident; the records do not expose a full-capacity availability denominator or compatible dispatch series.",
    result: "The later official record challenges any assumption that nameplate capacity represented uninterrupted operation.",
    attribution: "CPUC and EPA independently report the incident and response conditions.",
    validation: "Incident and partial-return status are independently attributable; full closure and performance remain unresolved.",
    next: "Add final investigation and closure evidence, restored capacity, availability, dispatch, duration, degradation, revenue, grid service, and reliability effects.",
  },
  {
    slug: "united-repeat-service-test",
    portfolio: "mobility",
    parentDossier: "dossier-56c-united-service-constraints",
    parentPanel: "panel-56b-united-cancellation",
    entityId: "dot-operating-carrier-united-airlines",
    entityName: "United Airlines",
    status: "Published",
    title: "United's December-to-May operating record separates carrier, weather, system, and late-aircraft causes",
    sourceSlugs: ["dot-atcr-february-2026", "dot-atcr-july-2026"],
    testedAlternatives: ["Weather and airport exposure", "Schedule and network mix", "Maintenance and staffing", "Air traffic constraints", "Recovery decisions"],
    observations: [
      "December 2025: 65,865 records, 76.76% on time, 0.39% cancelled, with 6.41% air-carrier, 0.61% extreme-weather, 9.05% national-system, and 6.53% late-aircraft delay.",
      "May 2026: 74,200 records, 79.47% on time, 0.39% cancelled, with 4.95% air-carrier, 0.39% extreme-weather, 8.64% national-system, and 5.87% late-aircraft delay; DOT separately recorded 744 brand-level complaints.",
    ],
    compatibility: "Same reporting operating carrier and monthly delay table; complaint counts are brand-level, can include partners, and use a separate denominator.",
    result: "The repeat record exposes cause mix and stable monthly cancellation percentage without proving why the distribution changed or whether service commitments were delivered.",
    attribution: "DOT publishes carrier-reported operations and separately received complaint cases.",
    validation: "Official common-table observations; causal attribution and commitment delivery remain unverified.",
    next: "Add later operating months, schedule mix, airport exposure, complaints with passenger denominators, accessibility, and verified remedy delivery.",
  },
  {
    slug: "southwest-repeat-service-test",
    portfolio: "mobility",
    parentDossier: "dossier-56c-southwest-service-constraints",
    parentPanel: "panel-56b-southwest-cancellation",
    entityId: "dot-operating-carrier-southwest-airlines",
    entityName: "Southwest Airlines",
    status: "Published",
    title: "Southwest's repeat record shows a changed monthly cause mix without explaining it",
    sourceSlugs: ["dot-atcr-february-2026", "dot-atcr-july-2026"],
    testedAlternatives: ["Weather and airport exposure", "Schedule and network structure", "Maintenance and staffing", "Air traffic constraints", "Recovery decisions"],
    observations: [
      "December 2025: 118,075 records, 74.84% on time, 0.55% cancelled, with 7.60% air-carrier, 0.18% extreme-weather, 4.48% national-system, and 12.06% late-aircraft delay.",
      "May 2026: 120,646 records, 71.88% on time, 0.39% cancelled, with 8.93% air-carrier, 0.37% extreme-weather, 4.82% national-system, and 13.25% late-aircraft delay; DOT separately recorded 224 complaints.",
    ],
    compatibility: "Same reporting operating carrier and monthly delay table; complaint counts use a separate denominator.",
    result: "The repeat record tests several alternatives simultaneously but cannot isolate schedule, staffing, weather, air-traffic, or recovery effects.",
    attribution: "DOT publishes carrier-reported operations and separately received complaint cases.",
    validation: "Official common-table observations; causal attribution and commitment delivery remain unverified.",
    next: "Add later operating months, schedule structure, airport exposure, complaints with passenger denominators, accessibility, and verified remedy delivery.",
  },
  {
    slug: "delta-repeat-service-test",
    portfolio: "mobility",
    parentDossier: "dossier-56c-delta-service-constraints",
    parentPanel: "panel-56b-delta-cancellation",
    entityId: "dot-operating-carrier-delta-air-lines",
    entityName: "Delta Air Lines",
    status: "Published",
    title: "Delta's repeat record exposes a large monthly method-sensitive movement and separate complaint boundary",
    sourceSlugs: ["dot-atcr-february-2026", "dot-atcr-july-2026"],
    testedAlternatives: ["Weather and airport exposure", "Schedule and branded-network mix", "Maintenance and staffing", "Air traffic constraints", "Recovery decisions"],
    observations: [
      "December 2025: 85,139 records, 72.27% on time, 2.75% cancelled, with 9.01% air-carrier, 0.57% extreme-weather, 7.18% national-system, and 8.00% late-aircraft delay.",
      "May 2026: 91,955 records, 80.99% on time, 1.24% cancelled, with 6.40% air-carrier, 0.39% extreme-weather, 5.66% national-system, and 5.04% late-aircraft delay; DOT separately recorded 705 brand-level complaints.",
    ],
    compatibility: "Same reporting operating carrier and monthly delay table; brand-level complaints may include partner-operated flights and use a separate denominator.",
    result: "The repeat record shows movement across several reported categories but cannot isolate one explanation or represent a full-year outcome.",
    attribution: "DOT publishes carrier-reported operations and separately received complaint cases.",
    validation: "Official common-table observations; causal attribution and commitment delivery remain unverified.",
    next: "Add later operating months, branded-network mix, airport exposure, complaints with passenger denominators, accessibility, and verified remedy delivery.",
  },
];

const portfolioHolds = [
  {
    portfolio: "ai_cyber",
    slug: "agency-alternative-explanation-hold",
    title: "Agency recommendation statuses do not identify the cause of annual maturity results",
    summary: "Open recommendations, annual metrics, tested systems, component variation, incidents, recovery, service effects, and mission outcomes remain distinct records.",
  },
  {
    portfolio: "manufacturing",
    slug: "manufacturer-alternative-explanation-hold",
    title: "Manufacturing control design still lacks compatible same-line outcome series",
    summary: "Current roles, historical inspections, certifications, supplier clauses, product-event counts, labor, product mix, demand, capital, and line outcomes cannot be collapsed.",
  },
  {
    portfolio: "infrastructure",
    slug: "battery-alternative-explanation-hold",
    title: "Battery incident and corrective-action records do not create an availability or value score",
    summary: "Capacity, incident response, removal progress, partial return, stated dispatch logic, availability, cycling, revenue, grid service, and customer outcomes remain separate.",
  },
  {
    portfolio: "mobility",
    slug: "carrier-alternative-explanation-hold",
    title: "Carrier monthly cause mix and complaint counts do not prove commitment delivery or causation",
    summary: "Operating-carrier percentages, brand-level complaints, partner flights, schedule mix, airport exposure, accessibility, and remedy delivery use different records and denominators.",
  },
];

for (const directory of ["sources", "research-documents", "research-collections", "signals", "briefings", "updates"]) {
  await mkdir(join(contentRoot, directory), { recursive: true });
}

for (const source of sources) {
  const defaults = portfolioDefaults[source.portfolio];
  await writeFile(join(contentRoot, "sources", `${sourceId(source.slug)}.json`), json({
    id: sourceId(source.slug),
    name: source.title,
    url: source.url,
    source_type: source.sourceType,
    credibility_level: source.sourceType === "Company Press Room" ? "Tier 2" : "Tier 1",
    primary_topics: defaults.topics,
    framework_layers: defaults.layers,
    country_or_region: "United States",
    update_frequency: source.title.includes("Air Travel Consumer Report") ? "Monthly" : "Event-driven",
    capture_priority: "High",
    known_limitations: `${source.limit} Phase 56D keeps compatibility, attribution, validation status, denominator breaks, and alternative explanations visible.`,
    last_checked_date: capturedDate,
    watch_lanes: defaults.watch,
    live_access_type: source.url.toLowerCase().includes(".pdf") ? "Data Download" : "Release Page",
    ...(source.url.toLowerCase().includes(".pdf") ? { data_download_url: source.url } : {}),
    review_cadence_days: 60,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: defaults.jurisdiction,
    source_owner: source.publisher,
    notes: `Phase 56D record for repeat outcomes and alternative-explanation tests. Collection: ${collectionSlug}.`,
  }), "utf8");
}

const documents = tests.flatMap((test) => test.sourceSlugs.map((sourceSlug, index) => ({
  id: documentId(`${test.slug}-${index + 1}`),
  slug: `${test.slug}-${index + 1}`,
  test,
  source: sources.find((candidate) => candidate.slug === sourceSlug),
})));

for (const [index, document] of documents.entries()) {
  const defaults = portfolioDefaults[document.test.portfolio];
  const archiveName = `${String(index + 1).padStart(2, "0")}-${document.slug}.txt`;
  await writeFile(join(contentRoot, "research-documents", `${252 + index}-56d-${document.slug}.json`), json({
    id: document.id,
    collection_id: collectionId,
    title: `${document.test.entityName}: ${document.source.title}`,
    slug: `56d-${document.slug}`,
    record_status: "Published",
    publisher: document.source.publisher,
    publication_date: document.source.publicationDate,
    document_type: document.source.url.toLowerCase().includes(".pdf") ? "Data Release" : "Oversight Report",
    summary: `${document.source.summary} Entity test: ${document.test.result}`,
    key_findings: [
      document.source.finding,
      `Alternative-explanation test: ${document.source.test}`,
      `Compatibility: ${document.test.compatibility}`,
    ],
    why_it_matters: "This record either supplies a later compatible observation or tests a named Phase 56C alternative explanation without turning association into causal proof.",
    ftfn_relevance: [
      "Preserves the Phase 56C parent dossier and stable entity identifier.",
      "Maps the record to named alternative explanations.",
      "Separates observed result, attribution, independent validation, and unresolved denominators.",
    ],
    evidence_limits: [
      document.source.limit,
      document.test.validation,
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

const entitySignals = tests.map((test) => ({
  id: `signal-56d-${test.slug}`,
  ...test,
  sourceIds: test.sourceSlugs.map(sourceId),
}));
const heldSignals = portfolioHolds.map((hold) => ({
  id: `signal-56d-${hold.slug}`,
  status: "In Review",
  ...hold,
  sourceIds: tests.filter((test) => test.portfolio === hold.portfolio).flatMap((test) => test.sourceSlugs.map(sourceId)),
}));

for (const signal of [...entitySignals, ...heldSignals]) {
  const defaults = portfolioDefaults[signal.portfolio];
  const isEntity = Boolean(signal.entityId);
  const isPublished = signal.status === "Published";
  const editorial = isPublished
    ? "The bounded observation may publish; causation, ranking, composite scoring, readiness scoring, and denominator mixing remain outside the claim."
    : "Hold interpretation until a compatible later outcome, common denominator, and sufficient alternative-explanation controls are independently observable.";
  const body = `---
id: ${yaml(signal.id)}
title: ${yaml(signal.title)}
slug: ${yaml(signal.id.replace("signal-", ""))}
record_status: ${yaml(signal.status)}
summary: ${yaml(signal.result ?? signal.summary)}
source_ids:
${yamlArray([...new Set(signal.sourceIds)])}
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
why_it_matters: ${yaml(isPublished ? "The record tests a named alternative explanation or supplies a later compatible observation while preserving the measurement boundary." : "The hold prevents unlike records or missing denominators from becoming a causal or performance claim.")}
dependencies:
  - "stable Phase 56C entity and dossier"
  - "named alternative explanation"
  - "compatible unit and denominator"
  - "explicit source attribution"
  - "independent validation boundary"
constraints:
${yamlArray(defaults.constraints)}
receiving_systems:
${yamlArray(defaults.receiving)}
local_implications:
  - "A later record deepens the entity test without making unlike entities comparable."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${yaml(editorial)}
---

${isEntity ? `## Repeat-outcome and alternative-explanation test

${signal.result}

## Tested alternatives

${signal.testedAlternatives.map((item) => `- ${item}`).join("\n")}

## Later observations

${signal.observations.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Compatibility and attribution

**Compatibility:** ${signal.compatibility}

**Attribution:** ${signal.attribution}

**Validation status:** ${signal.validation}

## What remains unresolved

${signal.next}` : `## Why this remains held

${signal.summary}

The underlying entity records remain useful, but the portfolio-level interpretation stays In Review because the observations do not isolate one explanation or share a single performance denominator.`}

## Publication boundary

${editorial}
`;
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), body, "utf8");
}

const normalizedTests = tests.map((test) => ({
  test_id: `test-56d-${test.slug}`,
  portfolio: test.portfolio,
  parent_dossier_id: test.parentDossier,
  parent_panel_id: test.parentPanel,
  entity_id: test.entityId,
  entity_name: test.entityName,
  record_status: test.status,
  signal_id: `signal-56d-${test.slug}`,
  source_ids: test.sourceSlugs.map(sourceId),
  tested_alternative_explanations: test.testedAlternatives,
  later_observations: test.observations,
  compatibility: test.compatibility,
  result: test.result,
  attribution: test.attribution,
  validation_status: test.validation,
  causal_boundary: "The record tests alternatives or adds a later observation; it does not establish causation.",
  next_records: [test.next],
}));

await writeFile(join(appRoot, "src", "data", "phase-56d-alternative-tests.json"), json({
  phase: "56D",
  captured_date: capturedDate,
  test_count: normalizedTests.length,
  tests: normalizedTests,
}), "utf8");

await writeFile(join(appRoot, "src", "data", "phase-56d-publication-review.json"), json({
  phase: "56D",
  reviewed_date: capturedDate,
  source_count: sources.length,
  document_count: documents.length,
  entity_test_count: normalizedTests.length,
  signal_decisions: {
    reviewed: entitySignals.length + heldSignals.length,
    promoted: entitySignals.filter((signal) => signal.status === "Published").map((signal) => signal.id),
    held: [
      ...entitySignals.filter((signal) => signal.status === "In Review").map((signal) => signal.id),
      ...heldSignals.map((signal) => signal.id),
    ],
  },
  compatibility_rule: "Every later observation declares whether entity, unit, denominator, method, and observation window are compatible.",
  alternative_rule: "Every record maps to one or more named Phase 56C alternative explanations.",
  closure_rule: "Regulator-verified closure remains distinct from company or operator claims, partial progress, and an open investigation.",
  comparison_rule: "No causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is permitted.",
}), "utf8");

await writeFile(join(contentRoot, "research-collections", `${collectionSlug}.json`), json({
  id: collectionId,
  title: "Repeat Outcomes and Alternative-Explanation Tests, 2010-2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Twenty source profiles and 24 entity-specific summaries test named Phase 56C alternative explanations across the same twelve agencies, manufacturers, battery assets, and carriers.",
  scope: "Phase 56D publishes nine bounded entity tests, holds three manufacturer tests, and holds four portfolio interpretations. Different units, denominators, methods, attribution levels, and observation windows remain visible.",
  captured_date: capturedDate,
  document_ids: documents.map((document) => document.id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 27-file archive contains 24 official-link records, consolidated FTFN summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Every record either tests a named Phase 56C alternative explanation or supplies a later observation. Compatibility, attribution, validation status, open denominators, and series breaks remain attached. No causal effect, ranking, composite score, or readiness score is created.",
}), "utf8");

const allSignals = [...entitySignals, ...heldSignals];
const briefing = `---
id: "briefing-research-watch-008-repeat-outcomes-alternative-tests"
title: "Research Watch 008: Repeat Outcomes and Alternative Tests"
slug: "research-watch-008-repeat-outcomes-alternative-tests"
record_status: "Published"
summary: "The same twelve entities receive later records that test named competing explanations; nine bounded tests publish and seven interpretations remain held."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlArray(allSignals.map((signal) => signal.id))}
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
  - "Later records are added only when they test a named alternative explanation or supply a compatible observation."
  - "Agency recommendation status, annual maturity, and system operation remain separate."
  - "Manufacturing control design does not substitute for same-line output, labor, quality, or delivery."
  - "Battery incidents and partial corrective-action progress remain separate from availability and value."
  - "Carrier cause mix and complaint counts retain their own denominators."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
  - "Unit Economics"
what_to_watch_next:
  - "Agency control operation, recommendation closure, incidents, recovery, service, and mission outcomes."
  - "Manufacturer same-line labor, output, yield, scrap, downtime, cost, delivery, and demand."
  - "Battery closure, restored capacity, availability, dispatch, cycling, degradation, value, and customer outcomes."
  - "Carrier later months, schedule and airport exposure, accessibility, complaint rates, and verified remedy delivery."
---

## The alternative-explanation gate

Phase 56D revisits the same twelve Phase 56C dossiers. A record enters only when it tests a named competing explanation or supplies a later observation. Compatibility, attribution, validation status, and denominator breaks stay attached.

## Agencies

NASA and HHS gain later recommendation inventories; DHS gains later CDM statuses while its FY 2025 annual result remains pending. These records sharpen remediation and metric boundaries without converting recommendation counts into effectiveness scores.

## Manufacturers

Current Applications, Island Components, and Monaghan Medical gain current identity, quality-control, inspection, certification, and product-event records. Only Monaghan's FDA event record supports a bounded published update, and even that record has no units-distributed or line denominator. The three same-line persistence tests remain unresolved.

## Battery assets

EPA and CPUC records expose incident response, supervised battery removal, partial return to service, and continuing investigations at Moss Landing and Gateway. Manatee gains clearer stated siting and charging logic. None of those records supplies a common availability, cycling, dispatch, degradation, value, or customer-outcome score.

## Carriers

December 2025 and May 2026 operating-carrier tables expose cause mix for United, Southwest, and Delta. Brand-level complaint counts remain separate, can include partner-operated flights, and do not verify whether service commitments were delivered.
`;
await writeFile(join(contentRoot, "briefings", "briefing-research-watch-008-repeat-outcomes-alternative-tests.mdx"), briefing, "utf8");

await writeFile(join(contentRoot, "updates", "2026-07-24-phase-56d-repeat-outcomes-alternative-tests.json"), json({
  id: "update-2026-07-24-phase-56d-repeat-outcomes-alternative-tests",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56D adds repeat outcomes and alternative-explanation tests",
  summary: "FTFN adds 20 source profiles, 24 summaries, twelve entity tests, and four portfolio holds while keeping incompatible measures and missing denominators visible.",
  affected_record_ids: [
    collectionId,
    "briefing-research-watch-008-repeat-outcomes-alternative-tests",
    ...allSignals.map((signal) => signal.id),
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-008-repeat-outcomes-alternative-tests/",
  ],
  evidence_note: "Every added record maps to a Phase 56C alternative explanation or later observation; causation, rankings, composites, readiness scores, and denominator mixing remain prohibited.",
  work_package: "docs/work-packages/phase-56d-repeat-outcomes-alternative-explanation-tests.md",
}), "utf8");

console.log(`Generated Phase 56D: ${sources.length} source profiles, ${documents.length} summaries, ${entitySignals.filter((signal) => signal.status === "Published").length} Published entity tests, and ${entitySignals.filter((signal) => signal.status === "In Review").length + heldSignals.length} held signals.`);
