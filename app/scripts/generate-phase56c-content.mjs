import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionSlug = "entity-driver-constraint-dossiers-2021-2026";
const collectionId = `research-collection-${collectionSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yaml = (value) => JSON.stringify(value);
const yamlArray = (items, indent = "  ") => items.map((item) => `${indent}- ${yaml(item)}`).join("\n");

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
    slug: "nasa-fisma-fy2025",
    portfolio: "ai_cyber",
    title: "NASA FISMA Evaluation: Fiscal Year 2025",
    publisher: "NASA Office of Inspector General",
    publicationDate: "2025-07-29",
    url: "https://oig.nasa.gov/office-of-inspector-general-oig/audit-reports/evaluation-of-nasas-information-security-program-under-the-federal-information-security-modernization-act-for-fiscal-year-2025/",
    sourceType: "Government Agency",
    summary: "NASA OIG reported an overall Level 3, Consistently Implemented, information-security program for FY 2025.",
    finding: "The later agency observation remains below the federal effectiveness threshold because effectiveness measures were not consistently demonstrated.",
    limit: "An agency maturity rating does not measure identical control operation, incident exposure, recovery, or mission consequence across NASA systems.",
  },
  {
    slug: "nasa-zero-trust-2025",
    portfolio: "ai_cyber",
    title: "Audit of NASA's Zero Trust Architecture",
    publisher: "NASA Office of Inspector General",
    publicationDate: "2025-03-27",
    url: "https://oig.nasa.gov/office-of-inspector-general-oig/audit-of-nasas-zero-trust-architecture/",
    sourceType: "Government Agency",
    summary: "NASA OIG found progress on corporate-system zero trust work while mission and JPL implementation had not begun.",
    finding: "The audit identified phased implementation, split funding responsibility, legacy-system constraints, and an estimated corporate initiative budget of about $211 million for FY 2024-FY 2029.",
    limit: "Implementation activity and budget do not establish effective control operation, incident reduction, or mission outcomes.",
  },
  {
    slug: "dhs-fisma-fy2024",
    portfolio: "ai_cyber",
    title: "Evaluation of DHS' Information Security Program for Fiscal Year 2024",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: "2025-06-25",
    url: "https://www.oig.dhs.gov/sites/default/files/assets/2025-07/OIG-25-28-Jun25.pdf",
    sourceType: "Government Agency",
    summary: "DHS OIG rated the department information-security program effective for FY 2024.",
    finding: "Identify and Respond were rated Level 5; Protect, Detect, and Recover were rated Level 4, with selected-component and selected-system testing boundaries.",
    limit: "The department-wide result does not represent identical control maturity or operating risk across every DHS component and system.",
  },
  {
    slug: "dhs-cdm-network-monitoring-2025",
    portfolio: "ai_cyber",
    title: "Cybersecurity: Network Monitoring Program Needs Further Guidance and Actions",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2025-06-11",
    url: "https://www.gao.gov/products/gao-25-107470",
    sourceType: "Government Agency",
    summary: "GAO reported that the Continuous Diagnostics and Mitigation program met two goals but retained guidance, data-quality, endpoint, and cloud-asset gaps.",
    finding: "GAO made four recommendations to DHS and CISA; the recommendations remained open in the May 2026 status shown by GAO.",
    limit: "The cross-government CDM program is a DHS-managed control input, not a direct measure of the DHS enterprise rating or component outcomes.",
  },
  {
    slug: "hhs-fisma-fy2025",
    portfolio: "ai_cyber",
    title: "HHS FISMA Compliance Review: Fiscal Year 2025",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2026-01-15",
    url: "https://oig.hhs.gov/reports/all/2026/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2025/",
    sourceType: "Government Agency",
    summary: "HHS OIG rated the department information-security program Not Effective for the sixth consecutive year.",
    finding: "The core metrics were rated Consistently Implemented while supplemental metrics were rated Ad Hoc; the report made ten recommendations.",
    limit: "The headline rating does not represent identical component exposure, incident experience, service effect, or patient consequence.",
  },
  {
    slug: "hhs-cio-open-recommendations-2025",
    portfolio: "ai_cyber",
    title: "Chief Information Officer Open Recommendations: Department of Health and Human Services",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2025-09-03",
    url: "https://www.gao.gov/products/gao-25-108539",
    sourceType: "Government Agency",
    summary: "GAO identified 82 open recommendations under the HHS CIO, including 37 sensitive recommendations and 49 relevant to component CIOs.",
    finding: "The open set spans cybersecurity and IT acquisition and management; one recommendation was designated priority.",
    limit: "A count of open recommendations is a remediation workload, not a severity score, outcome measure, or comparison with another agency.",
  },
  {
    slug: "current-applications-capabilities",
    portfolio: "manufacturing",
    title: "Current Applications: Custom Motor Design and Manufacturing",
    publisher: "Current Applications",
    publicationDate: null,
    url: "https://www.currentapps.com/",
    sourceType: "Company Press Room",
    summary: "Current Applications describes custom design, prototyping, testing, flexible tooling, and production of electric motors in Watertown, New York.",
    finding: "The company attributes shorter setup and production lead times to flexible tooling and fixtures and states that products are built to UL requirements.",
    limit: "These are current company capability and delivery claims without an exposed audit, measurement window, product denominator, or later performance series.",
  },
  {
    slug: "current-applications-cancelled-expansion",
    portfolio: "manufacturing",
    title: "Current Application Capital",
    publisher: "New York Regional Economic Development Councils",
    publicationDate: null,
    url: "https://regionalcouncils.ny.gov/cfa/project/51146",
    sourceType: "Government Agency",
    summary: "A New York project record describes a proposed 10,200-square-foot expansion and equipment investment at Current Applications.",
    finding: "The record lists a $140,000 award, $0 disbursed, and project status Black - Cancelled/Declined.",
    limit: "The record does not establish why the project stopped, whether another expansion occurred, or what operating effects followed.",
  },
  {
    slug: "island-components-acquisition-2021",
    portfolio: "manufacturing",
    title: "G.W. Lisk Company Acquires Island Components Group",
    publisher: "Island Components Group",
    publicationDate: "2021-11-17",
    url: "https://islandcomponents.com/resource-library/g-w-lisk-company-acquires-island-components-group/",
    sourceType: "Company Press Room",
    summary: "Island Components announced its acquisition by G.W. Lisk and said it would continue to operate independently as a division.",
    finding: "The company attributed potential customer and product opportunities to complementary technology and employee capabilities.",
    limit: "The acquisition announcement is company-attributed and does not measure realized integration, investment, employment, quality, output, or customer outcomes.",
  },
  {
    slug: "island-components-capabilities",
    portfolio: "manufacturing",
    title: "Island Components Group Manufacturing and Testing Capabilities",
    publisher: "Island Components Group",
    publicationDate: null,
    url: "https://islandcomponents.com/capabilities-2/",
    sourceType: "Company Press Room",
    summary: "Island Components lists engineering, winding, machining, automated equipment, assembly, inspection, and environmental testing capabilities.",
    finding: "The company also says it can draw on manufacturing and testing capabilities through parent G.W. Lisk.",
    limit: "A capability inventory does not measure utilization, throughput, quality, downtime, labor input, delivery, or persistence of the earlier reported output change.",
  },
  {
    slug: "monaghan-iso14001-2024",
    portfolio: "manufacturing",
    title: "Monaghan Medical Attains ISO 14001 Certification",
    publisher: "Monaghan Medical Corporation",
    publicationDate: "2024-02-27",
    url: "https://www.monaghanmed.com/iso-14001-certification/",
    sourceType: "Company Press Room",
    summary: "Monaghan Medical announced ISO 14001 certification for its environmental management system.",
    finding: "The company describes risk-based management, continual improvement, waste diversion, and greenhouse-gas reduction objectives.",
    limit: "Certification and stated objectives do not establish quantified environmental, production, quality, labor, cost, or clinical outcomes.",
  },
  {
    slug: "monaghan-manufacturing-profile",
    portfolio: "manufacturing",
    title: "Monaghan Medical Company and Environmental Management Profile",
    publisher: "Monaghan Medical Corporation",
    publicationDate: null,
    url: "https://www.monaghanmed.com/about/",
    sourceType: "Company Press Room",
    summary: "Monaghan Medical describes its Plattsburgh-based respiratory-device manufacturing and environmental management system.",
    finding: "The company identifies ISO 14001-aligned management, regulatory compliance, resource conservation, and continual improvement as operating controls.",
    limit: "The profile is company-authored and does not expose a common quantitative denominator for output, quality, labor, waste, emissions, delivery, or demand.",
  },
  {
    slug: "moss-landing-audit-2025",
    portfolio: "infrastructure",
    title: "CPUC Generation Audit of Moss Landing Power Plant",
    publisher: "California Public Utilities Commission",
    publicationDate: "2025-06-19",
    url: "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/moss-landing-audit-report.pdf",
    sourceType: "Government Agency",
    summary: "CPUC staff audited Moss Landing Power Plant during March 3-7, 2025 and identified potential GO 167-B violations requiring a response.",
    finding: "The report records regulator-observed operations, equipment inspection, document review, and staff interviews at the site.",
    limit: "The site-level generation audit is not a complete performance measure for every battery generator assigned to EIA plant code 260.",
  },
  {
    slug: "moss-landing-audit-response-2025",
    portfolio: "infrastructure",
    title: "Moss Landing Power Plant Response to CPUC Audit Findings",
    publisher: "California Public Utilities Commission",
    publicationDate: "2025-08-18",
    url: "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/20250818-ga202506-cpuc-mlpp-audit--vistra-responses-confidential--finalredacted.pdf",
    sourceType: "Government Agency",
    summary: "The public CPUC file preserves the operator's responses and claimed corrective actions for the Moss Landing audit findings.",
    finding: "The response creates a dated corrective-action trail, including the plant's response to incident-reporting contact requirements.",
    limit: "Corrective-action statements are operator responses inside a regulator file; closure, durability, and battery-specific operating effect require later verification.",
  },
  {
    slug: "manatee-psc-operating-data-2025",
    portfolio: "infrastructure",
    title: "Florida PSC Staff's First Data Request: Manatee Battery Energy Storage System",
    publisher: "Florida Public Service Commission",
    publicationDate: "2025-04-21",
    url: "https://www.psc.state.fl.us/library/FILINGS/2025/03321-2025/03321-2025.pdf",
    sourceType: "Government Agency",
    summary: "A Florida PSC filing records Manatee as a 409 MW, 900 MWh battery with 0.84 conversion efficiency and December 2021 in-service date.",
    finding: "The filing describes dispatch for high load, reserves, transmission constraints, and frequency response, with charging during off-peak or solar periods.",
    limit: "Stated asset characteristics and dispatch uses do not measure realized availability, cycles, revenue, reliability contribution, degradation, or customer savings.",
  },
  {
    slug: "manatee-psc-rate-testimony-2025",
    portfolio: "infrastructure",
    title: "Florida PSC Rate Testimony on the Manatee Battery Energy Storage System",
    publisher: "Florida Public Service Commission",
    publicationDate: "2025-02-28",
    url: "https://www.psc.state.fl.us/library/filings/2025/01178-2025/01178-2025.pdf",
    sourceType: "Government Agency",
    summary: "Florida PSC testimony describes the Manatee battery entering commercial operation in 2021 at 409 MW with approximately 2.2 hours of duration.",
    finding: "The testimony places the asset inside a utility operating and rate-case record rather than treating nameplate power as the complete outcome.",
    limit: "Rate testimony is party-submitted evidence and does not by itself independently establish asset performance, cost effectiveness, or customer benefit.",
  },
  {
    slug: "gateway-cpuc-audit-2025",
    portfolio: "infrastructure",
    title: "CPUC Audit Findings of Gateway Energy Storage",
    publisher: "California Public Utilities Commission",
    publicationDate: "2025-06-05",
    url: "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/cpuc-audit-findings-of-gateway-energy-storage-june-2--5-2025.pdf",
    sourceType: "Government Agency",
    summary: "CPUC's June 2025 Gateway audit identified 16 findings requiring corrective action under GO 167-C.",
    finding: "The findings include maintenance, safety, work-management, documentation, and compliance-control issues.",
    limit: "Audit findings identify conditions requiring response; they are not a composite safety score or a measure of energy-market and customer outcomes.",
  },
  {
    slug: "gateway-cpuc-audit-response-2025",
    portfolio: "infrastructure",
    title: "Gateway Energy Storage Response to CPUC Audit Findings",
    publisher: "California Public Utilities Commission",
    publicationDate: "2025-10-01",
    url: "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/redacted--gateway-audit-response-revfinal.pdf",
    sourceType: "Government Agency",
    summary: "Gateway's public response said 14 of 16 findings were closed and the remaining two were targeted for closure by the end of October 2025.",
    finding: "The operator also stated that GO 167-C compliance became effective September 9, 2025.",
    limit: "Closure counts and risk characterizations are operator-attributed until independently verified by the regulator or later audit evidence.",
  },
  {
    slug: "dot-atcr-2025-series",
    portfolio: "mobility",
    title: "Air Travel Consumer Reports for 2025",
    publisher: "U.S. Department of Transportation",
    publicationDate: "2026-05-28",
    url: "https://www.transportation.gov/resources/individuals/aviation-consumer-protection/air-travel-consumer-reports-2025",
    sourceType: "Government Agency",
    summary: "DOT's 2025 report series organizes operating data on delays, cancellations, baggage, wheelchairs and scooters, oversales, complaints, and related service measures.",
    finding: "The series distinguishes BTS operational reporting from OACP consumer submissions and preserves separate tables and denominators.",
    limit: "The report series does not establish why one carrier's annual cancellation rate moved or make unlike service measures causally interchangeable.",
  },
  {
    slug: "dot-airline-customer-service-dashboard",
    portfolio: "mobility",
    title: "Airline Customer Service Dashboard",
    publisher: "U.S. Department of Transportation",
    publicationDate: null,
    url: "https://www.transportation.gov/airconsumer/airline-customer-service-dashboard",
    sourceType: "Government Agency",
    summary: "DOT publishes airline commitments for controllable cancellations and delays, including rebooking, meals, lodging, and other customer accommodations.",
    finding: "United, Southwest, and Delta each appear in the dashboard, but commitments vary by remedy and remain distinct from measured operating outcomes.",
    limit: "A public commitment is not evidence of occurrence, compliance, customer receipt, satisfaction, or an effect on cancellation rates.",
  },
];

const sourceId = (slug) => `source-56c-${slug}`;
const documentId = (slug) => `research-doc-56c-${slug}`;

const dossiers = [
  {
    slug: "nasa-cyber-controls",
    portfolio: "ai_cyber",
    parentPanel: "panel-56b-nasa-fisma",
    parentSignal: "signal-56b-nasa-fisma-panel",
    entityId: "agency-nasa",
    entityName: "National Aeronautics and Space Administration",
    title: "NASA's later FISMA observation sits beside a phased zero-trust implementation boundary",
    summary: "NASA's FY 2025 Level 3 rating extends the panel by one compatible annual observation. A separate 2025 audit documents corporate-system zero-trust progress and delayed mission and JPL implementation, but does not establish that zero-trust work caused the maturity result.",
    sourceSlugs: ["nasa-fisma-fy2025", "nasa-zero-trust-2025"],
    baseline: "NASA remained at FISMA Level 3 across FY 2022-FY 2024.",
    intervention: "NASA assigned zero-trust leadership, planned phased corporate implementation, and funded corporate initiatives while mission and JPL owners retained separate responsibilities.",
    constraint: "Non-corporate implementation had not begun; legacy systems, distributed ownership, and unknown non-corporate costs remained open.",
    outcome: "The later FY 2025 FISMA evaluation again reported Level 3, Consistently Implemented.",
    attribution: "NASA OIG independently reports both the implementation condition and the annual maturity result.",
    validation: "Independent oversight supplies two different official records; neither report validates a causal link between them.",
    alternatives: ["Annual metric design", "Control scope and tested systems", "Other remediation work", "Legacy-system and mission-environment differences"],
    next: "Track FY 2026 FISMA results, pillar-level implementation across corporate and non-corporate systems, tested-control operation, incidents, recovery, service effects, and mission outcomes.",
  },
  {
    slug: "dhs-cyber-controls",
    portfolio: "ai_cyber",
    parentPanel: "panel-56b-dhs-fisma",
    parentSignal: "signal-56b-dhs-fisma-panel",
    entityId: "agency-dhs",
    entityName: "Department of Homeland Security",
    title: "DHS retained an effective FISMA result while its network-monitoring program carried open execution gaps",
    summary: "DHS's FY 2024 FISMA evaluation extends the panel with an effective result. GAO's 2025 review separately identifies CDM guidance, data-quality, endpoint, and cloud-asset gaps; the two records describe coexisting control conditions, not cause and effect.",
    sourceSlugs: ["dhs-fisma-fy2024", "dhs-cdm-network-monitoring-2025"],
    baseline: "DHS moved from ineffective in FY 2021 to effective in FY 2022 and FY 2023.",
    intervention: "DHS and CISA continued operating the government-wide CDM program for asset visibility and network monitoring.",
    constraint: "GAO identified incomplete guidance, data-quality controls, endpoint onboarding, and cloud-asset management.",
    outcome: "DHS OIG rated the FY 2024 department program effective, with function ratings of Level 4 or Level 5.",
    attribution: "DHS OIG reports the department result; GAO independently reports CDM implementation constraints.",
    validation: "Two independent oversight bodies support the coexistence of the records, not a causal relationship.",
    alternatives: ["Selected component and system scope", "Annual FISMA metric changes", "Controls outside CDM", "Component-level variation"],
    next: "Track FY 2025 department and component ratings, recommendation closure evidence, CDM data quality, endpoint coverage, cloud assets, incidents, recovery, and service effects.",
  },
  {
    slug: "hhs-cyber-controls",
    portfolio: "ai_cyber",
    parentPanel: "panel-56b-hhs-fisma",
    parentSignal: "signal-56b-hhs-fisma-panel",
    entityId: "agency-hhs",
    entityName: "Department of Health and Human Services",
    title: "HHS's sixth Not Effective FISMA result sits beside a large CIO remediation workload",
    summary: "HHS's FY 2025 FISMA review extends the panel with a sixth consecutive Not Effective result. GAO's 82 open CIO recommendations identify a broad remediation workload but do not function as a severity score or explain the annual rating.",
    sourceSlugs: ["hhs-fisma-fy2025", "hhs-cio-open-recommendations-2025"],
    baseline: "HHS remained Not Effective across FY 2022-FY 2024.",
    intervention: "HHS continued department and component remediation under the CIO and FISMA programs.",
    constraint: "GAO identified 82 open CIO recommendations, while HHS OIG found supplemental metrics at Ad Hoc maturity.",
    outcome: "The FY 2025 evaluation again rated the HHS information-security program Not Effective.",
    attribution: "HHS OIG supplies the annual rating; GAO independently inventories open recommendations.",
    validation: "Independent oversight confirms both conditions, but open-recommendation counts do not validate the cause of the FISMA result.",
    alternatives: ["Federated operating-division maturity", "Annual metric weighting", "Recommendation age and severity", "Control areas outside the open GAO set"],
    next: "Track FY 2026 FISMA results, recommendation closures, component control testing, incidents, recovery, affected services, and health-program outcomes.",
  },
  {
    slug: "current-applications-drivers",
    portfolio: "manufacturing",
    parentPanel: "panel-56b-current-applications-output",
    parentSignal: "signal-56b-current-applications-output-panel",
    entityId: "manufacturer-current-applications-watertown-ny",
    entityName: "Current Applications",
    title: "Current Applications pairs flexible production claims with a cancelled public expansion record",
    summary: "The company describes flexible tooling, prototyping, and testing as current production capabilities. A separate New York record shows a proposed expansion as Cancelled/Declined with no grant disbursement, leaving the capital path and the earlier MEP output change causally unresolved.",
    sourceSlugs: ["current-applications-capabilities", "current-applications-cancelled-expansion"],
    baseline: "The Phase 56B panel records a company- and MEP-attributed line increase from 40 to 105 units per day.",
    intervention: "The company identifies custom engineering, testing, prototypes, and flexible tooling and fixtures as operating inputs.",
    constraint: "A proposed 10,200-square-foot expansion is recorded by New York as Cancelled/Declined with $0 disbursed.",
    outcome: "No later compatible output, labor, quality, cost, delivery, demand, or WIP observation is publicly exposed.",
    attribution: "Current capabilities are company claims; the project status is independently recorded by New York.",
    validation: "The state record validates only the public project's status, not the company's operating claims or the reason for the earlier output change.",
    alternatives: ["Product mix", "Demand and backlog", "Labor input", "Tooling and layout", "Unrecorded private capital investment"],
    next: "Obtain a dated repeat of the same line's output, labor hours, WIP, first-pass yield, scrap, downtime, cost, delivery, and demand.",
  },
  {
    slug: "island-components-drivers",
    portfolio: "manufacturing",
    parentPanel: "panel-56b-island-components-output",
    parentSignal: "signal-56b-island-components-output-panel",
    entityId: "manufacturer-island-components-hauppauge-ny",
    entityName: "Island Components Group",
    title: "Island Components' output case now carries its acquisition and parent-capability boundary",
    summary: "Island Components became a G.W. Lisk division in 2021 and now describes access to parent manufacturing and testing capabilities. These records clarify entity identity and inputs around the later MEP output case but do not measure integration or validate the cause or persistence of the reported change.",
    sourceSlugs: ["island-components-acquisition-2021", "island-components-capabilities"],
    baseline: "The acquisition announcement says Island Components would continue operating independently as a G.W. Lisk division.",
    intervention: "The current capability profile lists winding, machining, automated equipment, assembly, inspection, environmental testing, and access to parent capabilities.",
    constraint: "The public records do not expose utilization, labor, quality, product mix, downtime, delivery, investment, or integration measures.",
    outcome: "The later MEP case reports daily output moving from 75 to 120 units, without a repeat observation window.",
    attribution: "Acquisition and capability records are company-attributed; the output result remains company- and MEP-attributed.",
    validation: "No independent record validates the acquisition's operating effect or the persistence of the reported output change.",
    alternatives: ["Lean workflow changes", "Product mix and demand", "Parent resources", "Capital equipment", "Labor and staffing"],
    next: "Collect repeated output, labor hours, WIP, first-pass yield, defects, downtime, delivery, and parent-resource use for the same line.",
  },
  {
    slug: "monaghan-medical-drivers",
    portfolio: "manufacturing",
    parentPanel: "panel-56b-monaghan-medical-output",
    parentSignal: "signal-56b-monaghan-medical-output-panel",
    entityId: "manufacturer-monaghan-medical-plattsburgh-ny",
    entityName: "Monaghan Medical",
    title: "Monaghan Medical's output case now carries environmental-management and compliance inputs",
    summary: "Monaghan Medical's ISO 14001 announcement and company profile document management controls around its Plattsburgh manufacturing operation. They precede or accompany the later MEP output case but do not establish a production, quality, cost, or environmental causal effect.",
    sourceSlugs: ["monaghan-iso14001-2024", "monaghan-manufacturing-profile"],
    baseline: "Monaghan describes respiratory-device manufacturing under medical-device and environmental management controls.",
    intervention: "The company attained ISO 14001 certification and set continual-improvement, waste-diversion, and emissions-reduction objectives.",
    constraint: "No common quantitative series connects the management system to line output, product mix, labor, quality, cost, delivery, waste, or emissions.",
    outcome: "The later MEP case reports one line increasing from 6,000 to 9,000 units per day.",
    attribution: "Certification and environmental objectives are company-attributed; the output result is company- and MEP-attributed.",
    validation: "Certification validates a management-system standard, not the magnitude, cause, persistence, or breadth of operating outcomes.",
    alternatives: ["Lean intervention", "Demand and product mix", "Staffing and shifts", "Equipment and layout", "Quality-control and supply conditions"],
    next: "Collect same-line output, labor, yield, scrap, downtime, delivery, demand, waste, emissions, and certification-surveillance records.",
  },
  {
    slug: "moss-landing-constraints",
    portfolio: "infrastructure",
    parentPanel: "panel-56b-moss-landing-battery-capacity",
    parentSignal: "signal-56b-moss-landing-capacity-panel",
    entityId: "eia-plant-260",
    entityName: "Dynegy Moss Landing Power Plant Hybrid",
    title: "Moss Landing's capacity panel now carries a 2025 site audit and corrective-action trail",
    summary: "The three-year EIA capacity panel is followed by a 2025 CPUC site audit and operator response. The later records add safety and compliance constraints, but the plant-wide audit cannot be reduced to a performance score for every battery generator at plant code 260.",
    sourceSlugs: ["moss-landing-audit-2025", "moss-landing-audit-response-2025"],
    baseline: "EIA plant code 260 increased from 400 MW in 2021-2022 to 750 MW in 2023.",
    intervention: "CPUC conducted an on-site generation audit with equipment inspection, document review, and staff interviews.",
    constraint: "The audit identified potential GO 167 violations requiring response and corrective action.",
    outcome: "The operator filed dated responses and claimed corrective actions; later regulator closure and battery-specific performance remain unverified.",
    attribution: "CPUC attributes the findings; the operator attributes the responses and corrective actions.",
    validation: "The regulator file independently validates that findings and responses exist, not the operating effect or durable closure of each item.",
    alternatives: ["Broader power-plant equipment", "Battery-unit differences", "Ownership and operating changes", "Incident and outage conditions", "EIA vintage revisions"],
    next: "Track regulator closure, later audits, generator identity, duration, availability, incidents, dispatch, revenue, grid service, and reliability effects.",
  },
  {
    slug: "manatee-constraints",
    portfolio: "infrastructure",
    parentPanel: "panel-56b-manatee-battery-capacity",
    parentSignal: "signal-56b-manatee-capacity-panel",
    entityId: "eia-plant-60014",
    entityName: "Manatee Solar Energy Center",
    title: "Manatee's stable 409 MW panel now carries duration and stated dispatch uses",
    summary: "Florida PSC filings add a 900 MWh energy figure, approximately 2.2 hours of duration, 0.84 conversion efficiency, and stated dispatch uses to the stable 409 MW panel. They describe asset design and intended operation, not realized performance or customer benefit.",
    sourceSlugs: ["manatee-psc-operating-data-2025", "manatee-psc-rate-testimony-2025"],
    baseline: "EIA plant code 60014 remained at 409 MW across final 2021-2023 inventories.",
    intervention: "The utility placed a 409 MW, approximately 900 MWh battery in service in December 2021 near solar and transmission assets.",
    constraint: "Conversion losses, duration, system conditions, cycling, degradation, and rate recovery shape operation.",
    outcome: "PSC filings state uses for high load, reserves, transmission constraints, frequency response, and off-peak or solar charging.",
    attribution: "The utility supplies the operating descriptions inside Florida PSC proceedings.",
    validation: "The regulator docket validates the filing and asset characteristics, but not realized dispatch frequency, value, reliability effect, or cost effectiveness.",
    alternatives: ["Load and weather", "Solar availability", "Transmission constraints", "Market and dispatch rules", "Degradation and outage conditions"],
    next: "Collect interval dispatch, availability, cycles, state of charge, degradation, revenue, curtailment, outage response, and customer-cost records.",
  },
  {
    slug: "gateway-constraints",
    portfolio: "infrastructure",
    parentPanel: "panel-56b-gateway-battery-capacity",
    parentSignal: "signal-56b-gateway-capacity-panel",
    entityId: "eia-plant-63834",
    entityName: "Gateway Energy Storage System",
    title: "Gateway's stable capacity panel now carries 16 audit findings and an operator closure claim",
    summary: "The stable 250 MW EIA panel is followed by a 2025 CPUC audit with 16 corrective-action findings and an operator response claiming 14 closed. The paired records expose a control trail while preserving the regulator-versus-operator attribution boundary.",
    sourceSlugs: ["gateway-cpuc-audit-2025", "gateway-cpuc-audit-response-2025"],
    baseline: "EIA plant code 63834 remained at 250 MW across final 2021-2023 inventories.",
    intervention: "CPUC audited Gateway under GO 167-C and required responses to identified safety, maintenance, documentation, and work-management issues.",
    constraint: "The audit identified 16 findings requiring corrective action.",
    outcome: "Gateway stated that 14 findings were closed and two were targeted for closure by the end of October 2025.",
    attribution: "CPUC attributes the findings; Gateway attributes closure status and risk characterization.",
    validation: "The regulator file validates the response, not independent closure, durability, safety effect, availability, dispatch, or customer outcome.",
    alternatives: ["New GO 167-C implementation timing", "Facility operating history", "Maintenance scheduling", "Dispatch conditions", "EIA capacity-only denominator"],
    next: "Track CPUC closure evidence, later audits, availability, incidents, dispatch, duration, degradation, revenue, grid service, and reliability effects.",
  },
  {
    slug: "united-service-constraints",
    portfolio: "mobility",
    parentPanel: "panel-56b-united-cancellations",
    parentSignal: "signal-56b-united-cancellation-panel",
    entityId: "dot-operating-carrier-united-airlines",
    entityName: "United Airlines",
    title: "United's lower 2025 cancellation rate now carries service-commitment and denominator boundaries",
    summary: "United's operating-carrier cancellation rate moved from 1.64% in 2024 to 0.82% in 2025. DOT's service dashboard adds controllable-disruption commitments, but the commitments do not explain the movement or prove passenger receipt.",
    sourceSlugs: ["dot-atcr-2025-series", "dot-airline-customer-service-dashboard"],
    baseline: "United reported 12,478 cancellations among 760,451 scheduled operations in 2024.",
    intervention: "United publishes customer-service commitments for specified controllable cancellations and delays through DOT's dashboard.",
    constraint: "Schedule mix, airports, weather, maintenance, crews, network recovery, and marketing-versus-operating identity remain separate.",
    outcome: "United reported 6,527 cancellations among 795,271 scheduled operations in 2025, a 0.82% rate.",
    attribution: "Carrier-filed operational data are published by DOT; commitments are carrier representations compiled by DOT.",
    validation: "DOT validates the reporting rails, not a causal effect of commitments or universal delivery of remedies.",
    alternatives: ["Weather and airport exposure", "Schedule and network mix", "Maintenance and staffing", "Air traffic constraints", "Recovery decisions"],
    next: "Track 2026 full-year operations, delay causes, complaints, accessibility, schedule mix, airport exposure, commitment compliance, and revisions.",
  },
  {
    slug: "southwest-service-constraints",
    portfolio: "mobility",
    parentPanel: "panel-56b-southwest-cancellations",
    parentSignal: "signal-56b-southwest-cancellation-panel",
    entityId: "dot-operating-carrier-southwest-airlines",
    entityName: "Southwest Airlines",
    title: "Southwest's nearly unchanged 2025 cancellation rate now carries service-commitment boundaries",
    summary: "Southwest's operating-carrier cancellation rate moved from 0.83% in 2024 to 0.85% in 2025. DOT's dashboard documents controllable-disruption commitments, but neither the small movement nor the commitments establish a durable trend or causal relationship.",
    sourceSlugs: ["dot-atcr-2025-series", "dot-airline-customer-service-dashboard"],
    baseline: "Southwest reported 11,772 cancellations among 1,419,419 scheduled operations in 2024.",
    intervention: "Southwest publishes customer-service commitments for specified controllable cancellations and delays through DOT's dashboard.",
    constraint: "Network structure, schedule mix, weather, airport exposure, maintenance, crews, and operational recovery remain open.",
    outcome: "Southwest reported 11,799 cancellations among 1,391,885 scheduled operations in 2025, a 0.85% rate.",
    attribution: "Carrier-filed operational data are published by DOT; commitments are carrier representations compiled by DOT.",
    validation: "DOT validates the reporting rails, not the cause of the two-year movement or customer receipt of each remedy.",
    alternatives: ["Weather and airport exposure", "Schedule and network structure", "Maintenance and staffing", "Air traffic constraints", "Recovery decisions"],
    next: "Track 2026 full-year operations, delay causes, complaints, accessibility, schedule mix, airport exposure, commitment compliance, and revisions.",
  },
  {
    slug: "delta-service-constraints",
    portfolio: "mobility",
    parentPanel: "panel-56b-delta-cancellations",
    parentSignal: "signal-56b-delta-cancellation-panel",
    entityId: "dot-operating-carrier-delta-air-lines",
    entityName: "Delta Air Lines",
    title: "Delta's higher 2025 cancellation rate now carries service-commitment and network boundaries",
    summary: "Delta's operating-carrier cancellation rate moved from 0.91% in 2024 to 1.08% in 2025. DOT's service dashboard adds controllable-disruption commitments, but it does not explain the movement, measure remedy delivery, or authorize a cross-carrier comparison.",
    sourceSlugs: ["dot-atcr-2025-series", "dot-airline-customer-service-dashboard"],
    baseline: "Delta reported 9,147 cancellations among 1,009,194 scheduled operations in 2024.",
    intervention: "Delta publishes customer-service commitments for specified controllable cancellations and delays through DOT's dashboard.",
    constraint: "Schedule mix, branded network identity, airports, weather, maintenance, crews, and recovery conditions remain separate.",
    outcome: "Delta reported 11,114 cancellations among 1,026,332 scheduled operations in 2025, a 1.08% rate.",
    attribution: "Carrier-filed operational data are published by DOT; commitments are carrier representations compiled by DOT.",
    validation: "DOT validates the reporting rails, not a causal effect, a service-quality score, or universal delivery of remedies.",
    alternatives: ["Weather and airport exposure", "Schedule and branded-network mix", "Maintenance and staffing", "Air traffic constraints", "Recovery decisions"],
    next: "Track 2026 full-year operations, delay causes, complaints, accessibility, schedule mix, airport exposure, commitment compliance, and revisions.",
  },
];

const holds = [
  {
    portfolio: "ai_cyber",
    slug: "agency-causal-inference-hold",
    title: "Agency control activity does not causally explain annual FISMA results",
    summary: "The agency dossiers establish temporal order and independent oversight, but annual metrics, tested systems, component scope, and concurrent remediation prevent causal attribution.",
  },
  {
    portfolio: "manufacturing",
    slug: "manufacturer-causal-inference-hold",
    title: "Manufacturing inputs do not establish the cause or persistence of reported output changes",
    summary: "Company capability, acquisition, certification, and public-project records do not supply common labor, product, quality, cost, demand, or repeat-output denominators.",
  },
  {
    portfolio: "infrastructure",
    slug: "battery-causal-inference-hold",
    title: "Battery capacity, audit findings, and operator responses remain separate measures",
    summary: "Capacity, duration, stated dispatch, audit findings, corrective-action claims, availability, safety, and customer outcomes cannot be collapsed into a performance score.",
  },
  {
    portfolio: "mobility",
    slug: "carrier-causal-inference-hold",
    title: "Carrier service commitments do not explain annual cancellation-rate movement",
    summary: "Commitments, schedule mix, weather, airports, delay causes, complaints, accessibility, and cancellations remain distinct records and denominators.",
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
    update_frequency: source.title.includes("Fiscal Year") ? "Annual" : "One-time",
    capture_priority: "High",
    known_limitations: `${source.limit} Phase 56C preserves attribution, temporal order, alternative explanations, and the no-causation boundary.`,
    last_checked_date: capturedDate,
    watch_lanes: defaults.watch,
    live_access_type: source.url.endsWith(".pdf") ? "Report Series" : "Release Page",
    review_cadence_days: 90,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: defaults.jurisdiction,
    source_owner: source.publisher,
    notes: `Phase 56C primary record for an entity driver and constraint dossier. Collection: ${collectionSlug}.`,
  }), "utf8");
}

const documents = dossiers.flatMap((dossier) => dossier.sourceSlugs.map((sourceSlug, index) => {
  const source = sources.find((candidate) => candidate.slug === sourceSlug);
  const slug = `${dossier.slug}-${index + 1}`;
  return {
    id: documentId(slug),
    slug,
    dossier,
    source,
  };
}));

let archiveIndex = 0;
for (const [index, document] of documents.entries()) {
  archiveIndex += 1;
  const defaults = portfolioDefaults[document.dossier.portfolio];
  const archiveName = `${String(archiveIndex).padStart(2, "0")}-${document.slug}.txt`;
  const record = {
    id: document.id,
    collection_id: collectionId,
    title: `${document.dossier.entityName}: ${document.source.title}`,
    slug: `56c-${document.slug}`,
    record_status: "Published",
    publisher: document.source.publisher,
    publication_date: document.source.publicationDate,
    document_type: document.source.sourceType === "Company Press Room" ? "Technical Report" : "Oversight Report",
    summary: `${document.source.summary} Entity use: ${document.dossier.summary}`,
    key_findings: [
      document.source.finding,
      `Temporal role: ${index % 2 === 0 ? document.dossier.intervention : document.dossier.outcome}`,
      `Attribution: ${document.dossier.attribution}`,
    ],
    why_it_matters: "This entity-matched record adds a named driver, control, input, constraint, or later observation to a Phase 56B panel without treating sequence as causal proof.",
    ftfn_relevance: [
      "Preserves the parent panel's stable entity identifier.",
      "Separates baseline, intervention or constraint, and observed outcome.",
      "Records independent validation, alternative explanations, and the causal-inference boundary.",
    ],
    evidence_limits: [
      document.source.limit,
      document.dossier.validation,
      "No ranking, composite score, readiness score, or causal estimate is supported.",
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
  };
  await writeFile(join(contentRoot, "research-documents", `${228 + index}-56c-${document.slug}.json`), json(record), "utf8");
}

const publishedSignals = dossiers.map((dossier) => ({
  id: `signal-56c-${dossier.slug}`,
  status: "Published",
  ...dossier,
  sourceIds: dossier.sourceSlugs.map(sourceId),
}));
const heldSignals = holds.map((hold) => ({
  id: `signal-56c-${hold.slug}`,
  status: "In Review",
  ...hold,
  sourceIds: dossiers.filter((dossier) => dossier.portfolio === hold.portfolio).flatMap((dossier) => dossier.sourceSlugs.map(sourceId)),
}));

for (const signal of [...publishedSignals, ...heldSignals]) {
  const defaults = portfolioDefaults[signal.portfolio];
  const isPublished = signal.status === "Published";
  const editorial = isPublished
    ? "Temporal order and association may be described; causation, ranking, composite scoring, and readiness scoring remain outside the Published claim."
    : "Hold causal interpretation until compatible interventions, exposed inputs, repeated outcomes, independent validation, and alternative-explanation controls exist.";
  const body = `---
id: ${yaml(signal.id)}
title: ${yaml(signal.title)}
slug: ${yaml(signal.id.replace("signal-", ""))}
record_status: ${yaml(signal.status)}
summary: ${yaml(signal.summary)}
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
why_it_matters: ${yaml(isPublished ? "The parent entity panel now carries explicit driver, constraint, attribution, validation, and alternative-explanation records." : "The hold prevents temporal sequence and attributed implementation from being converted into a causal claim.")}
dependencies:
  - "stable parent entity and panel"
  - "temporal order"
  - "explicit source attribution"
  - "independent validation boundary"
  - "alternative explanations"
constraints:
${yamlArray(defaults.constraints)}
receiving_systems:
${yamlArray(defaults.receiving)}
local_implications:
  - "A dossier deepens an entity record without making unlike entities comparable."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${yaml(editorial)}
---

## Entity dossier read

${signal.summary}

${isPublished ? `## Temporal order

1. **Baseline:** ${signal.baseline}
2. **Named intervention or input:** ${signal.intervention}
3. **Constraint:** ${signal.constraint}
4. **Observed outcome or later boundary:** ${signal.outcome}

## Attribution and validation

**Attribution:** ${signal.attribution}

**Independent validation:** ${signal.validation}

## Alternative explanations

${signal.alternatives.map((item) => `- ${item}`).join("\n")}

## What to watch next

${signal.next}` : `## Why this remains held

${signal.summary}

Later compatible records must expose inputs, implementation, operating conditions, repeated outcomes, attribution, independent validation, and plausible alternative explanations before causal interpretation can be reconsidered.`}

## Publication boundary

${editorial}
`;
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), body, "utf8");
}

const normalizedDossiers = dossiers.map((dossier) => ({
  dossier_id: `dossier-56c-${dossier.slug}`,
  portfolio: dossier.portfolio,
  parent_panel_id: dossier.parentPanel,
  parent_signal_id: dossier.parentSignal,
  entity_id: dossier.entityId,
  entity_name: dossier.entityName,
  record_status: "Published",
  signal_id: `signal-56c-${dossier.slug}`,
  source_ids: dossier.sourceSlugs.map(sourceId),
  temporal_order: [
    { stage: "Baseline condition", statement: dossier.baseline },
    { stage: "Named intervention or input", statement: dossier.intervention },
    { stage: "Constraint", statement: dossier.constraint },
    { stage: "Observed outcome or later boundary", statement: dossier.outcome },
  ],
  attribution: dossier.attribution,
  independent_validation: dossier.validation,
  alternative_explanations: dossier.alternatives,
  causal_boundary: "Temporal order and association may be described; the record does not establish causation.",
  next_records: [dossier.next],
}));

await writeFile(join(appRoot, "src", "data", "phase-56c-entity-dossiers.json"), json({
  phase: "56C",
  captured_date: capturedDate,
  dossier_count: normalizedDossiers.length,
  dossiers: normalizedDossiers,
}), "utf8");

await writeFile(join(appRoot, "src", "data", "phase-56c-publication-review.json"), json({
  phase: "56C",
  reviewed_date: capturedDate,
  source_count: sources.length,
  document_count: documents.length,
  dossier_count: normalizedDossiers.length,
  signal_decisions: {
    reviewed: publishedSignals.length + heldSignals.length,
    promoted: publishedSignals.map((signal) => signal.id),
    held: heldSignals.map((signal) => signal.id),
  },
  attribution_rule: "Every association identifies who made the claim and whether a separate official record independently validates it.",
  temporal_rule: "Every dossier orders baseline, intervention or input, constraint, and later observation without converting sequence into proof.",
  comparison_rule: "No ranking, composite score, readiness score, or unsupported cross-entity comparison is permitted.",
}), "utf8");

const collection = {
  id: collectionId,
  title: "Entity Driver and Constraint Dossiers, 2021-2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Twenty primary-source profiles and 24 entity-specific summaries deepen twelve operating panels with controls, inputs, constraints, later observations, attribution, independent-validation boundaries, and alternative explanations.",
  scope: "Phase 56C publishes twelve entity dossiers and holds four portfolio-level causal interpretations. Agency, manufacturer, battery, and carrier records remain separate measurement systems.",
  captured_date: capturedDate,
  document_ids: documents.map((document) => document.id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 27-file archive contains 24 official-link records, consolidated FTFN summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Every dossier retains the Phase 56B stable entity identifier and orders baseline, intervention or input, constraint, and observed outcome. Attribution, independent validation, missing evidence, and alternative explanations remain attached. Temporal order is not causal proof; no ranking or composite score is created.",
};
await writeFile(join(contentRoot, "research-collections", `${collectionSlug}.json`), json(collection), "utf8");

const allSignals = [...publishedSignals, ...heldSignals];
const briefing = `---
id: "briefing-research-watch-007-entity-driver-constraint-dossiers"
title: "Research Watch 007: Entity Drivers and Constraints"
slug: "research-watch-007-entity-driver-constraint-dossiers"
record_status: "Published"
summary: "Twelve entity dossiers add controls, inputs, constraints, later observations, and attribution boundaries while four causal interpretations remain explicitly held."
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
  - "Every dossier preserves the parent panel's stable entity identifier."
  - "Every association discloses attribution, independent validation, and alternative explanations."
  - "Later compatible observations are added before unrelated indicators."
  - "Twelve dossiers publish; four causal interpretations remain held."
  - "No ranking, composite score, readiness score, or causal estimate is created."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
  - "Unit Economics"
what_to_watch_next:
  - "Repeated control-operation, incident, recovery, service, and mission records."
  - "Repeated facility labor, quality, cost, delivery, demand, and output records."
  - "Battery availability, dispatch, safety, degradation, revenue, grid-service, and customer records."
  - "Carrier delay causes, complaints, accessibility, schedule mix, airport exposure, and later annual operations."
---

## The dossier gate

Phase 56C does not ask which entity is best. It asks what named intervention, control, input, or constraint can be placed before or beside an observed outcome without overstating the evidence. Every dossier preserves stable identity, temporal order, attribution, independent validation, alternative explanations, and a causal-inference hold.

## Federal agency controls

Later FISMA observations now sit beside NASA zero-trust implementation, DHS network-monitoring constraints, and the HHS CIO remediation workload. Independent oversight supports the records, but annual metric design, component scope, tested systems, and concurrent remediation prevent causal attribution.

## Manufacturing inputs

Current Applications, Island Components, and Monaghan Medical now carry public records on capabilities, capital status, acquisition, parent resources, and management-system controls. Company-attributed records remain labeled, and no repeat labor, quality, cost, demand, or independent output series is invented.

## Battery constraints

Moss Landing and Gateway now carry regulator findings and operator response trails. Manatee adds energy duration and stated dispatch uses. Capacity, audit findings, corrective-action claims, availability, safety, dispatch, revenue, and customer outcomes remain distinct measures.

## Carrier service boundaries

United, Southwest, and Delta retain their 2024-2025 operating-carrier cancellation denominators. DOT service commitments add a response layer, not an explanation of annual movement or proof that every eligible passenger received a remedy.
`;
await writeFile(join(contentRoot, "briefings", "briefing-research-watch-007-entity-driver-constraint-dossiers.mdx"), briefing, "utf8");

await writeFile(join(contentRoot, "updates", "2026-07-24-phase-56c-entity-driver-constraint-dossiers.json"), json({
  id: "update-2026-07-24-phase-56c-entity-driver-constraint-dossiers",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56C adds twelve entity driver and constraint dossiers",
  summary: "FTFN adds 20 primary-source profiles, 24 entity-specific summaries, twelve Published dossiers, and four causal-inference holds across agencies, manufacturers, battery assets, and operating carriers.",
  affected_record_ids: [
    collectionId,
    "briefing-research-watch-007-entity-driver-constraint-dossiers",
    ...allSignals.map((signal) => signal.id),
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-007-entity-driver-constraint-dossiers/",
  ],
  evidence_note: "Every dossier preserves entity identity, temporal order, attribution, independent-validation limits, alternative explanations, and a no-causation boundary.",
  work_package: "docs/work-packages/phase-56c-entity-driver-constraint-dossiers.md",
}), "utf8");

console.log(`Generated Phase 56C: ${sources.length} source profiles, ${documents.length} summaries, ${normalizedDossiers.length} Published dossiers, and ${heldSignals.length} holds.`);
