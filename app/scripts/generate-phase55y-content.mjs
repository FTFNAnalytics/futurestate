import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionId = "research-collection-operational-evidence-receiving-systems-2024-2026";
const collectionSlug = "operational-evidence-receiving-systems-2024-2026";

const sources = [
  {
    id: "source-nist-aria-pilot-evaluation-2025",
    name: "NIST ARIA 0.1 Pilot Evaluation Report",
    url: "https://www.nist.gov/publications/assessing-risks-and-impacts-ai-aria-pilot-evaluation-report",
    source_type: "Standards Body",
    primary_topics: ["AI for Science", "Cybersecurity", "Policy and Standards"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "United States",
    known_limitations: "A five-organization, seven-application pilot validates an evaluation procedure, not the safety, fitness, or operating performance of AI systems generally.",
    watch_lanes: ["AI and Advanced Manufacturing", "Security and Standards"],
    live_access_type: "Report Series",
    coverage_role: ["Standards Evidence", "Research Program Evidence"],
    source_owner: "National Institute of Standards and Technology",
    notes: "Phase 55Y assurance record. NIST AI 700-2, published November 13, 2025."
  },
  {
    id: "source-nist-aria-evaluation-program",
    name: "NIST Assessing Risks and Impacts of AI Evaluation Program",
    url: "https://ai-challenges.nist.gov/aria",
    source_type: "Standards Body",
    primary_topics: ["AI for Science", "Cybersecurity", "Policy and Standards"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "United States",
    known_limitations: "The program page describes an evaluation environment and intended outputs; it is not a certification scheme or an endorsement of submitted systems.",
    watch_lanes: ["AI and Advanced Manufacturing", "Security and Standards"],
    live_access_type: "Interactive Portal",
    coverage_role: ["Standards Evidence", "Research Program Evidence"],
    source_owner: "National Institute of Standards and Technology",
    notes: "Phase 55Y assurance-program context."
  },
  {
    id: "source-nist-ai-tevv-program",
    name: "NIST AI Test, Evaluation, Validation, and Verification Program",
    url: "https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv",
    source_type: "Standards Body",
    primary_topics: ["AI for Science", "Cybersecurity", "Policy and Standards"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "United States",
    known_limitations: "The program describes measurement-science work and resources; it does not establish completed assurance for a named deployment.",
    watch_lanes: ["AI and Advanced Manufacturing", "Security and Standards"],
    live_access_type: "Manual Page Check",
    coverage_role: ["Standards Evidence", "Research Program Evidence"],
    source_owner: "National Institute of Standards and Technology",
    notes: "Phase 55Y TEVV program record."
  },
  {
    id: "source-nist-ai-tevv-zero-draft-2025",
    name: "NIST Proposed Zero Draft for an AI TEVV Standard",
    url: "https://www.nist.gov/system/files/documents/2025/07/15/Outline_%20Proposed%20Zero%20Draft%20for%20a%20Standard%20on%20AI%20TEVV-for-web.pdf",
    source_type: "Standards Body",
    primary_topics: ["AI for Science", "Cybersecurity", "Policy and Standards"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "United States",
    known_limitations: "This is an outline for a proposed zero draft, not a consensus standard, conformity-assessment program, certification, or operating-system result.",
    watch_lanes: ["AI and Advanced Manufacturing", "Security and Standards"],
    live_access_type: "Data Download",
    coverage_role: ["Standards Evidence", "Research Program Evidence"],
    source_owner: "National Institute of Standards and Technology",
    notes: "Phase 55Y dated hold until a draft, final standard, or adoption record appears."
  },
  {
    id: "source-aca-asml-technical-academy-2025",
    name: "Arizona Commerce Authority ASML Technical Academy Opening",
    url: "https://www.azcommerce.com/news-events/news/2025/11/asml-technical-academy/",
    source_type: "Government Agency",
    primary_topics: ["Advanced Manufacturing", "Chips and Compute", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Human Systems"],
    country_or_region: "Phoenix, Arizona, United States",
    known_limitations: "The record establishes an operating training facility and a projected annual capacity, but not completions, credentials, retention, placement, or productivity.",
    watch_lanes: ["Compute and Chips", "AI and Advanced Manufacturing", "Local Systems"],
    live_access_type: "Release Page",
    coverage_role: ["Local Conversion Evidence", "Source Freshness"],
    source_owner: "Arizona Commerce Authority",
    notes: "Phase 55Y operating-workforce record."
  },
  {
    id: "source-aca-future48-battery-accelerator-2025",
    name: "Arizona Commerce Authority Future48 Battery Accelerator Opening",
    url: "https://www.azcommerce.com/news-events/news/2025/4/arizona-commerce-authority-and-partners-celebrate-grand-opening-of-battery-focused-future48-workforce-accelerator-in-pinal-county/",
    source_type: "Government Agency",
    primary_topics: ["Advanced Manufacturing", "Energy", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Human Systems"],
    country_or_region: "Pinal County, Arizona, United States",
    known_limitations: "The release reports a facility opening and aggregate Drive48 graduates, but provides no cohort-level completion denominator, placement rate, retention rate, wage data, or production effect.",
    watch_lanes: ["AI and Advanced Manufacturing", "Finance and Human Futures", "Local Systems"],
    live_access_type: "Release Page",
    coverage_role: ["Primary Data", "Local Conversion Evidence"],
    source_owner: "Arizona Commerce Authority",
    notes: "Phase 55Y workforce-to-operation comparator."
  },
  {
    id: "source-aca-ua-nanofabrication-center-2026",
    name: "Arizona Commerce Authority and University of Arizona Nano Fabrication Center Opening",
    url: "https://www.azcommerce.com/news-events/news/2026/2/aca-and-u-of-a-semiconductor-nano-fabrication-center/",
    source_type: "Government Agency",
    primary_topics: ["Advanced Manufacturing", "Chips and Compute", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "Tucson, Arizona, United States",
    known_limitations: "A ribbon-cutting, installed tools, and available courses do not establish utilization, completions, placements, qualified production, or employer outcomes.",
    watch_lanes: ["Compute and Chips", "AI and Advanced Manufacturing", "Local Systems"],
    live_access_type: "Release Page",
    coverage_role: ["Research Program Evidence", "Local Conversion Evidence"],
    source_owner: "Arizona Commerce Authority and University of Arizona",
    notes: "Phase 55Y operating training and research infrastructure record."
  },
  {
    id: "source-aca-intel-apprenticeship-2024",
    name: "Arizona Commerce Authority Intel Manufacturing Technician Apprenticeship Launch",
    url: "https://www.azcommerce.com/news-events/news/2024/7/intel-launches-first-us-apprenticeship-program-for-manufacturing-facility-technicians/",
    source_type: "Government Agency",
    primary_topics: ["Advanced Manufacturing", "Chips and Compute", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Human Systems"],
    country_or_region: "Arizona, United States",
    known_limitations: "The launch record describes a one-year program and planned hiring over five years but does not report completions, credentials, retention, or later employment outcomes.",
    watch_lanes: ["Compute and Chips", "AI and Advanced Manufacturing", "Local Systems"],
    live_access_type: "Release Page",
    coverage_role: ["Local Conversion Evidence", "Source Freshness"],
    source_owner: "Arizona Commerce Authority",
    notes: "Phase 55Y employer-linked apprenticeship design record."
  },
  {
    id: "source-maricopa-semiconductor-accelerator",
    name: "Maricopa Community Colleges Semiconductor Workforce Accelerator",
    url: "https://www.maricopa.edu/industry/accelerators",
    source_type: "University",
    primary_topics: ["Advanced Manufacturing", "Chips and Compute", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Human Systems"],
    country_or_region: "Phoenix, Arizona, United States",
    known_limitations: "The page describes a semiconductor accelerator expected to open in 2027; it does not establish completed construction, installed equipment, enrollment, completions, or placement.",
    watch_lanes: ["Compute and Chips", "AI and Advanced Manufacturing", "Local Systems"],
    live_access_type: "Manual Page Check",
    coverage_role: ["Local Conversion Evidence", "Source Freshness"],
    source_owner: "Maricopa County Community College District",
    notes: "Phase 55Y dated hold for facility opening and delivered training."
  },
  {
    id: "source-chandler-reclaimed-water-system",
    name: "City of Chandler Reclaimed Water System",
    url: "https://www.chandleraz.gov/residents/water/water-conservation/reclaimed-water",
    source_type: "Government Agency",
    primary_topics: ["Water", "Advanced Manufacturing", "Climate"],
    framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    country_or_region: "Chandler, Arizona, United States",
    known_limitations: "Citywide treatment and avoided-demand totals do not disclose customer-level industrial flows, facility water balances, reliability, or compliance outcomes.",
    watch_lanes: ["Water", "Local Systems"],
    live_access_type: "Manual Page Check",
    coverage_role: ["Primary Data", "Local Conversion Evidence"],
    source_owner: "City of Chandler",
    notes: "Phase 55Y operating receiving-system comparator."
  },
  {
    id: "source-chandler-water-conservation-in-action",
    name: "City of Chandler Water Conservation in Action",
    url: "https://www.chandleraz.gov/residents/water/water-conservation-in-action",
    source_type: "Government Agency",
    primary_topics: ["Water", "Climate", "Human Futures"],
    framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    country_or_region: "Chandler, Arizona, United States",
    known_limitations: "The annual reclaimed-water figure spans urban irrigation, industrial use, recharge, and wetlands without disaggregating volumes by customer or end use.",
    watch_lanes: ["Water", "Local Systems"],
    live_access_type: "Manual Page Check",
    coverage_role: ["Primary Data", "Local Conversion Evidence"],
    source_owner: "City of Chandler",
    notes: "Phase 55Y municipal operating metric."
  },
  {
    id: "source-intel-arizona-community-investment-2024",
    name: "Intel Arizona 2024 Community Investment Report",
    url: "https://www.intel.com/content/dam/www/central-libraries/us/en/documents/2024-06/intel-arizona-2024-community-investment-report.pdf",
    source_type: "Company Press Room",
    primary_topics: ["Water", "Chips and Compute", "Advanced Manufacturing"],
    framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    country_or_region: "Arizona, United States",
    known_limitations: "The conservation and restoration totals are company-reported, combine multiple sites and project types, and do not provide a facility water balance or independent audit.",
    watch_lanes: ["Water", "Compute and Chips", "Local Systems"],
    live_access_type: "Data Download",
    coverage_role: ["Company Claim", "Local Conversion Evidence"],
    source_owner: "Intel Corporation",
    notes: "Phase 55Y measured company claim with explicit attribution."
  },
  {
    id: "source-chandler-owrf-expansion-complete-2018",
    name: "City of Chandler Ocotillo Water Reclamation Facility Expansion Completion",
    url: "https://www.chandleraz.gov/news-center/water-reclamation-facility-expansion-receives-industry-award-and-magazine-feature",
    source_type: "Government Agency",
    primary_topics: ["Water", "Advanced Manufacturing", "Climate"],
    framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    country_or_region: "Chandler, Arizona, United States",
    known_limitations: "Completed construction and rated treatment capacity do not establish current utilization, customer allocation, reliability, water quality, or facility-specific industrial reuse.",
    watch_lanes: ["Water", "Local Systems"],
    live_access_type: "Release Page",
    coverage_role: ["Local Conversion Evidence"],
    source_owner: "City of Chandler",
    notes: "Phase 55Y accepted-infrastructure comparator."
  },
  {
    id: "source-chandler-owrf-rated-capacity-2019",
    name: "City of Chandler Ocotillo Water Reclamation Facility Rated Capacity",
    url: "https://www.chandleraz.gov/blog/ocotillo-water-reclamation-facility-expansion-earns-az-water-project-year",
    source_type: "Government Agency",
    primary_topics: ["Water", "Advanced Manufacturing", "Climate"],
    framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    country_or_region: "Chandler, Arizona, United States",
    known_limitations: "An 18-million-gallon-per-day rating is design capacity, not daily delivered volume, industrial allocation, uptime, or drought performance.",
    watch_lanes: ["Water", "Local Systems"],
    live_access_type: "Release Page",
    coverage_role: ["Local Conversion Evidence"],
    source_owner: "City of Chandler",
    notes: "Phase 55Y facility-capacity record."
  },
  {
    id: "source-chandler-fy2027-proposed-budget",
    name: "City of Chandler FY 2026-27 Proposed Budget",
    url: "https://www.chandleraz.gov/sites/default/files/departments/management-services/City-of-Chandler-All-Day-Budget-Briefing-Presentation.pdf",
    source_type: "Government Agency",
    primary_topics: ["Water", "Advanced Manufacturing", "Finance and Risk"],
    framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    country_or_region: "Chandler, Arizona, United States",
    known_limitations: "A proposed capital schedule is not an adopted appropriation, executed contract, completed improvement, accepted asset, or operating result.",
    watch_lanes: ["Water", "Finance and Human Futures", "Local Systems"],
    live_access_type: "Data Download",
    coverage_role: ["Funding Evidence", "Local Conversion Evidence"],
    source_owner: "City of Chandler",
    notes: "Phase 55Y dated hold for budget adoption, procurement, construction, and acceptance."
  },
  {
    id: "source-cpuc-waymo-al2-disposition-2024",
    name: "CPUC Waymo Advice Letter 2 Disposition",
    url: "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/consumer-protection-and-enforcement-division/documents/tlab/av-programs/waymo-al-2-disposition-letter-20240301_signed.pdf",
    source_type: "Government Agency",
    primary_topics: ["Mobility", "Policy and Standards", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "Los Angeles and San Francisco Peninsula, California, United States",
    known_limitations: "Passenger-service authorization does not establish fleet size, trip volume, availability, safety superiority, cost, accessibility, or service quality.",
    watch_lanes: ["Mobility Certification", "Local Systems"],
    live_access_type: "Data Download",
    coverage_role: ["Regulatory Change", "Docket Evidence", "Local Conversion Evidence"],
    source_owner: "California Public Utilities Commission",
    notes: "Phase 55Y operating-service authorization."
  },
  {
    id: "source-cpuc-av-advice-letter-status-2026",
    name: "CPUC Driverless AV Deployment Advice Letter Status",
    url: "https://www.cpuc.ca.gov/regulatory-services/licensing/transportation-licensing-and-analysis-branch/autonomous-vehicle-programs/phase-i-driverless-autonomous-vehicle-deployment-program-advice-letter-status",
    source_type: "Government Agency",
    primary_topics: ["Mobility", "Policy and Standards", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "California, United States",
    known_limitations: "The status ledger tracks regulatory filings and dispositions, not actual trips, fleet operations, safety, cost, accessibility, or local effects.",
    watch_lanes: ["Mobility Certification", "Local Systems"],
    live_access_type: "Docket Search",
    coverage_role: ["Regulatory Change", "Docket Evidence", "Source Freshness"],
    source_owner: "California Public Utilities Commission",
    notes: "Phase 55Y current service-authorization ledger, updated May 29, 2026."
  },
  {
    id: "source-california-dmv-av-miles-2024",
    name: "California DMV 2024 Autonomous Vehicle Testing Mileage Release",
    url: "https://www.dmv.ca.gov/portal/news-and-media/over-4-million-test-miles-logged-by-autonomous-vehicle-permit-holders-in-california/",
    source_type: "Government Agency",
    primary_topics: ["Mobility", "Policy and Standards", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "California, United States",
    known_limitations: "Company-submitted testing miles exclude private roads, out-of-state activity, lower automation, and simulation, and DMV warns against cross-company comparison.",
    watch_lanes: ["Mobility Certification"],
    live_access_type: "Data Download",
    coverage_role: ["Primary Data", "Regulatory Change"],
    source_owner: "California Department of Motor Vehicles",
    notes: "Phase 55Y operating-exposure record for December 2023 through November 2024."
  },
  {
    id: "source-nhtsa-zoox-demonstration-exemption-2025",
    name: "NHTSA Zoox Automated Vehicle Demonstration Exemption",
    url: "https://www.nhtsa.gov/press-releases/nhtsa-issues-first-ever-demonstration-exemption-american-built-automated-vehicles",
    source_type: "Government Agency",
    primary_topics: ["Mobility", "Policy and Standards", "Human Futures"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "United States",
    known_limitations: "A demonstration exemption authorizes a bounded activity; it is not general commercial approval, passenger-service authorization, or evidence of safe scaled operation.",
    watch_lanes: ["Mobility Certification"],
    live_access_type: "Release Page",
    coverage_role: ["Regulatory Change", "Docket Evidence"],
    source_owner: "National Highway Traffic Safety Administration",
    notes: "Phase 55Y dated hold for operating authority and service evidence."
  },
  {
    id: "source-nhtsa-cruise-reporting-consent-order-2024",
    name: "NHTSA Cruise Crash-Reporting Consent Order",
    url: "https://www.nhtsa.gov/press-releases/consent-order-cruise-crash-reporting",
    source_type: "Government Agency",
    primary_topics: ["Mobility", "Cybersecurity", "Policy and Standards"],
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    country_or_region: "United States",
    known_limitations: "One enforcement case does not establish the safety performance of all automated-driving systems or the completeness of the wider reporting dataset.",
    watch_lanes: ["Mobility Certification", "Security and Standards"],
    live_access_type: "Release Page",
    coverage_role: ["Regulatory Change", "Docket Evidence"],
    source_owner: "National Highway Traffic Safety Administration",
    notes: "Phase 55Y reporting-quality control record."
  }
];

const docs = [
  ["nist-aria-pilot-evaluation-2025", "NIST ARIA 0.1 Pilot Evaluation Report", "National Institute of Standards and Technology", "2025-11-13", "Technical Report", "Published", "source-nist-aria-pilot-evaluation-2025", "https://www.nist.gov/publications/assessing-risks-and-impacts-ai-aria-pilot-evaluation-report", "NIST documents a pilot involving five organizations, seven AI applications, three scenarios, and model, red-team, and field-testing levels.", ["The pilot exercised three distinct evaluation levels.", "Measurement trees were used to assess application validity.", "The sample is intentionally small and exploratory."], "This is the strongest current pathway record for a completed multi-level AI evaluation procedure.", ["A pilot procedure is not a generally accepted assurance standard.", "The report does not validate AI systems outside the submitted applications."], ["AI for Science", "Cybersecurity", "Policy and Standards"], ["Compute", "Standards", "Data Quality", "Safety"]],
  ["nist-aria-evaluation-program", "NIST ARIA Evaluation Environment", "National Institute of Standards and Technology", "2025-01-31", "Standards and Testbed Record", "Published", "source-nist-aria-evaluation-program", "https://ai-challenges.nist.gov/aria", "NIST describes ARIA as a sector-agnostic evaluation environment spanning model testing, red teaming, and field testing.", ["The initial pilot focused on large language model applications.", "The program measures technical and contextual robustness.", "Future iterations may cover other AI system types."], "It places the pilot report inside an ongoing federal evaluation program rather than a one-off paper.", ["Program intent does not prove repeat use, adoption, or certification.", "The page does not establish fitness for any named operating system."], ["AI for Science", "Cybersecurity", "Policy and Standards"], ["Compute", "Standards", "Data Quality"]],
  ["nist-ai-metrology-center", "NIST AI Metrology Center", "National Institute of Standards and Technology", "2026-07-24", "Standards and Testbed Record", "Published", "source-nist-ai-metrology-center", "https://airc.nist.gov/metrology/", "NIST curates AI measurement methods and maps them to lifecycle stages and trustworthiness characteristics.", ["The resource is method-oriented rather than vendor-oriented.", "Entries preserve method provenance and intended use.", "NIST explicitly disclaims endorsement and universal fitness."], "It gives operators a practical selection layer between high-level risk management and system-specific evaluation.", ["A catalog entry is not a validated deployment control.", "Method suitability remains context dependent."], ["AI for Science", "Advanced Manufacturing", "Policy and Standards"], ["Compute", "Standards", "Data Quality", "Interpretation"]],
  ["nist-ai-tevv-program", "NIST AI TEVV Program", "National Institute of Standards and Technology", "2026-07-24", "Standards and Testbed Record", "Published", "source-nist-ai-tevv-program", "https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv", "NIST identifies test, evaluation, validation, and verification as a measurement-science program for trustworthy AI.", ["The program connects measurement science to AI risk management.", "It exposes tools, evaluations, and standards work.", "It does not certify named deployments."], "It clarifies the institutional home for turning assurance principles into repeatable methods.", ["Program activity is upstream of system authorization and operating evidence.", "No universal TEVV method is established."], ["AI for Science", "Cybersecurity", "Policy and Standards"], ["Compute", "Standards", "Data Quality", "Safety"]],
  ["nist-ai-rmf-core", "NIST AI RMF Core", "National Institute of Standards and Technology", "2023-01-26", "Technical Report", "Published", "source-nist-ai-rmf", "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/", "The AI RMF Core organizes governance, mapping, measurement, and management functions, including production monitoring expectations.", ["The Core separates governance from context mapping, measurement, and treatment.", "Measurement includes production monitoring and documented limits.", "The framework is voluntary and use-case dependent."], "It supplies the operating-control architecture into which ARIA and metrology methods can fit.", ["A framework is not implementation evidence.", "The record does not establish institutional adoption or control effectiveness."], ["AI for Science", "Cybersecurity", "Policy and Standards"], ["Compute", "Standards", "Data Quality", "Safety"]],
  ["nist-ai-tevv-zero-draft-2025", "Proposed Zero Draft Outline for an AI TEVV Standard", "National Institute of Standards and Technology", "2025-07-15", "Draft Study", "In Review", "source-nist-ai-tevv-zero-draft-2025", "https://www.nist.gov/system/files/documents/2025/07/15/Outline_%20Proposed%20Zero%20Draft%20for%20a%20Standard%20on%20AI%20TEVV-for-web.pdf", "NIST publishes an outline for a proposed zero draft of an AI TEVV standard.", ["The artifact is an outline, not a full draft.", "Consensus, conformity assessment, and adoption remain future stages.", "It provides a trackable standards-development milestone."], "It defines the next evidence gate for the assurance journey without prematurely treating it as settled guidance.", ["The outline is not a final or consensus standard.", "No certification or deployment adoption follows from publication."], ["AI for Science", "Cybersecurity", "Policy and Standards"], ["Compute", "Standards", "Data Quality", "Safety"]],

  ["asml-technical-academy-2025", "ASML Phoenix Technical Academy Becomes Fully Operational", "Arizona Commerce Authority", "2025-11-20", "Program Milestone", "Published", "source-aca-asml-technical-academy-2025", "https://www.azcommerce.com/news-events/news/2025/11/asml-technical-academy/", "Arizona records a 56,000-square-foot ASML technical training center that began training engineers in 2024 and is now fully operational.", ["The facility includes 14 classrooms and a cleanroom.", "Training covers new engineers, existing employees, and customer-specific machinery.", "More than 1,000 engineers per year is an anticipated capacity, not a measured output."], "It advances the workforce journey from coordination into an operating equipment-training facility.", ["The release does not report completions, credentials, placement, retention, or productivity.", "Projected annual throughput is not actual throughput."], ["Advanced Manufacturing", "Chips and Compute", "Human Futures"], ["Manufacturing", "Labor", "Supply Chain", "Data Quality"]],
  ["future48-battery-accelerator-2025", "Future48 Battery Accelerator Opens With Drive48 Outcome Comparator", "Arizona Commerce Authority", "2025-04-04", "Program Milestone", "Published", "source-aca-future48-battery-accelerator-2025", "https://www.azcommerce.com/news-events/news/2025/4/arizona-commerce-authority-and-partners-celebrate-grand-opening-of-battery-focused-future48-workforce-accelerator-in-pinal-county/", "Arizona records an operating battery-training facility and says more than 2,000 students have graduated from the earlier Drive48 program.", ["The new center is a 19,850-square-foot hands-on training facility.", "The release reports more than 2,000 Drive48 graduates since 2021.", "It says many graduates work at Lucid but does not give a placement denominator."], "It adds delivered training and an employment-linked comparator to a shelf dominated by plans and cohorts.", ["Aggregate graduates do not reveal completion rate, placement rate, retention, wages, or production impact.", "The battery center's future outcomes remain unreported."], ["Advanced Manufacturing", "Energy", "Human Futures"], ["Manufacturing", "Labor", "Supply Chain", "Data Quality"]],
  ["ua-nanofabrication-center-2026", "University of Arizona Nano Fabrication Center Opens", "Arizona Commerce Authority and University of Arizona", "2026-02-17", "Program Milestone", "Published", "source-aca-ua-nanofabrication-center-2026", "https://www.azcommerce.com/news-events/news/2026/2/aca-and-u-of-a-semiconductor-nano-fabrication-center/", "Arizona and the University of Arizona record an expanded semiconductor cleanroom with installed fabrication, metrology, packaging, and teaching capability.", ["The cleanroom expanded from 2,800 to 6,800 square feet.", "The facility includes metrology, planarization, photolithography, etching, and packaging capability.", "Courses and digital-twin modules are available, but learner and industry outcomes are not reported."], "It is an operating research-and-training asset that can be followed into utilization and workforce outcomes.", ["Opening and equipment lists do not establish utilization or qualified output.", "No completion, placement, or employer outcome is reported."], ["Advanced Manufacturing", "Chips and Compute", "Human Futures"], ["Manufacturing", "Labor", "Standards", "Data Quality"]],
  ["tsmc-arizona-operating-update-2026", "Phoenix TSMC Operating And Employment Update", "City of Phoenix", "2026-07-16", "Local Government Record", "Published", "source-phoenix-tsmc-july-2026-fab-update", "https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html", "Phoenix relays that Fab 1 has been in N4 volume production since late 2024, Fab 2 construction is complete, and TSMC Arizona employs more than 3,500 people.", ["The first fab is described as operating in volume production.", "Second-fab construction is described as complete with production expected in 2027.", "The release gives a current aggregate employment figure."], "It links workforce-system development to a named operating industrial receiving system.", ["The claims are City-relayed company statements, not audited output or employment data.", "The record does not disclose workforce mix, vacancies, retention, yield, or production volume."], ["Advanced Manufacturing", "Chips and Compute", "Human Futures"], ["Manufacturing", "Labor", "Supply Chain", "Data Quality"]],
  ["intel-arizona-apprenticeship-2024", "Intel Arizona Manufacturing Technician Apprenticeship Launch", "Arizona Commerce Authority", "2024-07-15", "Agency Announcement", "Published", "source-aca-intel-apprenticeship-2024", "https://www.azcommerce.com/news-events/news/2024/7/intel-launches-first-us-apprenticeship-program-for-manufacturing-facility-technicians/", "Arizona records Intel's launch of a one-year registered apprenticeship for manufacturing facility technicians.", ["Selected apprentices become full-time Intel employees on day one.", "Successful completion is intended to produce a certificate and college credit.", "The release plans dozens of apprentices over five years without reporting results."], "It provides an employer-linked training design against which completions and retention can be checked.", ["The source record used for this dossier is an official state announcement, not an outcome report.", "No completion, credential, retention, or placement result is disclosed."], ["Advanced Manufacturing", "Chips and Compute", "Human Futures"], ["Manufacturing", "Labor", "Data Quality"]],
  ["maricopa-semiconductor-accelerator", "Maricopa Semiconductor Workforce Accelerator Plan", "Maricopa County Community College District", "2026-07-24", "Agency Announcement", "In Review", "source-maricopa-semiconductor-accelerator", "https://www.maricopa.edu/industry/accelerators", "Maricopa Community Colleges describes a semiconductor workforce accelerator expected to open in 2027.", ["The facility is presented as a future training asset.", "The public page identifies a semiconductor specialization.", "Opening, equipment, enrollment, and outcomes remain future milestones."], "It creates a specific dated hold instead of counting a planned facility as operating workforce capacity.", ["Expected opening is not completion or acceptance.", "No delivered training or employment result exists in this record."], ["Advanced Manufacturing", "Chips and Compute", "Human Futures"], ["Manufacturing", "Labor", "Capital", "Infrastructure"]],

  ["chandler-reclaimed-water-system", "Chandler Reclaimed Water Operating System", "City of Chandler", "2026-07-24", "Local Government Record", "Published", "source-chandler-reclaimed-water-system", "https://www.chandleraz.gov/residents/water/water-conservation/reclaimed-water", "Chandler describes an operating reclaimed-water network that treats roughly 11 billion gallons annually and serves industrial, irrigation, recharge, and other uses.", ["The system includes three reclamation facilities and 93 miles of reclaimed-water distribution pipes.", "The City reports roughly 11 billion gallons treated each year.", "Avoided drinking-water demand is reported systemwide, not by industrial customer."], "It supplies an operating municipal comparator for the agreement-to-reuse pathway.", ["The figures do not disclose individual industrial customer flows.", "Systemwide volume is not evidence of spare capacity or TSMC service."], ["Water", "Advanced Manufacturing", "Climate"], ["Water", "Infrastructure", "Data Quality", "Climate"]],
  ["chandler-water-conservation-in-action", "Chandler Annual Reclaimed-Water Production", "City of Chandler", "2026-07-24", "Data Release", "Published", "source-chandler-water-conservation-in-action", "https://www.chandleraz.gov/residents/water/water-conservation-in-action", "Chandler reports producing about 30,000 acre-feet of reclaimed water annually for industrial uses, urban irrigation, recharge, and wetlands.", ["The figure is an annual citywide operating metric.", "The receiving uses include industrial demand.", "The page does not allocate volumes among end uses."], "It provides a second unit and operating metric for checking system-scale claims.", ["No customer or end-use disaggregation is provided.", "The metric does not prove industrial reliability or compliance."], ["Water", "Climate", "Human Futures"], ["Water", "Infrastructure", "Data Quality"]],
  ["intel-arizona-water-2024", "Intel Arizona 2024 Water Metrics", "Intel Corporation", "2024-06-01", "Technical Report", "Published", "source-intel-arizona-community-investment-2024", "https://www.intel.com/content/dam/www/central-libraries/us/en/documents/2024-06/intel-arizona-2024-community-investment-report.pdf", "Intel reports conserving 3.4 billion gallons at its Chandler and Ocotillo sites and restoring more than 1.1 billion gallons through funded projects in 2023.", ["The report identifies site-region conservation and restoration totals.", "Intel describes Arizona operations as net positive for water at the end of 2023.", "The data are company-reported and use multiple accounting categories."], "It adds a measured industrial operator claim that can be compared with municipal and permit records.", ["The figures are not independently audited in the source.", "Conservation and restoration are not the same as on-site reclaimed-water use or a complete facility water balance."], ["Water", "Chips and Compute", "Advanced Manufacturing"], ["Water", "Manufacturing", "Data Quality", "Interpretation"]],
  ["chandler-owrf-expansion-complete-2018", "Ocotillo Water Reclamation Facility Expansion Completed", "City of Chandler", "2018-10-22", "Program Milestone", "Published", "source-chandler-owrf-expansion-complete-2018", "https://www.chandleraz.gov/news-center/water-reclamation-facility-expansion-receives-industry-award-and-magazine-feature", "Chandler records completion of a $122 million expansion while the reclamation plant remained in operation.", ["Construction completed in May 2018.", "The work expanded treatment capacity from 10 to 15 million gallons per day in the release.", "The project logged 473,981 worker-hours without a lost-time accident."], "It adds completed and accepted infrastructure to the receiving-system comparator.", ["Rated capacity and completion do not establish current utilization.", "The source does not disclose industrial customer flows."], ["Water", "Advanced Manufacturing", "Climate"], ["Water", "Infrastructure", "Safety", "Data Quality"]],
  ["chandler-owrf-rated-capacity-2019", "Ocotillo Reclamation Facility Rated For 18 MGD", "City of Chandler", "2019-05-15", "Program Milestone", "Published", "source-chandler-owrf-rated-capacity-2019", "https://www.chandleraz.gov/blog/ocotillo-water-reclamation-facility-expansion-earns-az-water-project-year", "Chandler records the expanded Ocotillo facility as rated to provide 18 million gallons per day of A+ reclaimed water.", ["The facility is described as operating after the expansion.", "The 18-MGD figure is a rated capability.", "Future expansion to 30 MGD is only an option."], "It distinguishes completed treatment capability from actual delivered volume.", ["Design rating is not utilization, uptime, or customer allocation.", "The record does not prove current industrial reuse at that rate."], ["Water", "Advanced Manufacturing", "Climate"], ["Water", "Infrastructure", "Data Quality"]],
  ["chandler-fy2027-brine-improvements", "Proposed Intel Ocotillo Brine Reduction Improvements", "City of Chandler", "2026-05-01", "Budget Justification", "In Review", "source-chandler-fy2027-proposed-budget", "https://www.chandleraz.gov/sites/default/files/departments/management-services/City-of-Chandler-All-Day-Budget-Briefing-Presentation.pdf", "Chandler's proposed FY 2026-27 budget schedules Intel Ocotillo Brine Reduction Facility improvements across 2026-27 and 2027-28.", ["The proposed program lists $18.177 million in 2026-27 and $14.82 million in 2027-28.", "The funding source is identified as wastewater industrial process treatment.", "The record is a proposed budget, not project delivery."], "It creates a named, dated capital trail for an existing industrial-water asset.", ["The proposal may change before adoption.", "No procurement, construction, acceptance, or operating outcome is established."], ["Water", "Advanced Manufacturing", "Finance and Risk"], ["Water", "Capital", "Infrastructure", "Data Quality"]],

  ["cpuc-waymo-al2-disposition-2024", "CPUC Authorizes Expanded Waymo Fared Driverless Service", "California Public Utilities Commission", "2024-03-01", "Regulatory Decision", "Published", "source-cpuc-waymo-al2-disposition-2024", "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/consumer-protection-and-enforcement-division/documents/tlab/av-programs/waymo-al-2-disposition-letter-20240301_signed.pdf", "CPUC approves Waymo's updated Passenger Safety Plan and authorizes fared driverless passenger service in specified Los Angeles and San Francisco Peninsula areas.", ["The authorization became effective March 1, 2024.", "It depends on DMV deployment authorization and CPUC passenger-service requirements.", "The decision does not quantify actual trips or service performance."], "It closes the legal passenger-service gate for a named carrier and geography.", ["Authorization is not evidence of actual service scale, availability, safety superiority, or cost.", "Local concerns and broader policy questions remain outside the disposition's technical scope."], ["Mobility", "Policy and Standards", "Human Futures"], ["Regulation", "Safety", "Public Trust", "Data Quality"]],
  ["cpuc-av-advice-status-2026", "CPUC Driverless Deployment Authorization Ledger", "California Public Utilities Commission", "2026-05-29", "Data Release", "Published", "source-cpuc-av-advice-letter-status-2026", "https://www.cpuc.ca.gov/regulatory-services/licensing/transportation-licensing-and-analysis-branch/autonomous-vehicle-programs/phase-i-driverless-autonomous-vehicle-deployment-program-advice-letter-status", "CPUC maintains a current ledger of driverless passenger-service advice letters, effective dates, reviews, and suspensions.", ["Waymo's 2024 and 2025 expansion dispositions are listed as effective.", "A 2026 expansion request is suspended for further review through September 25, 2026.", "CPUC states the suspension does not affect existing operating authority."], "It lets FTFN separate active authority from pending expansion.", ["The ledger does not report actual fleet activity or outcomes.", "A suspended expansion is not a suspension of existing service."], ["Mobility", "Policy and Standards", "Human Futures"], ["Regulation", "Safety", "Public Trust", "Data Quality"]],
  ["california-dmv-av-miles-2024", "California DMV 2024 Autonomous Testing Mileage", "California Department of Motor Vehicles", "2025-01-31", "Data Release", "Published", "source-california-dmv-av-miles-2024", "https://www.dmv.ca.gov/portal/news-and-media/over-4-million-test-miles-logged-by-autonomous-vehicle-permit-holders-in-california/", "California DMV reports 4,498,066 public-road autonomous testing miles for December 2023 through November 2024.", ["The total includes 3,945,171 miles with a safety driver and 552,895 fully autonomous miles.", "Thirty-one companies held safety-driver testing permits, six held driverless testing permits, and three held deployment permits.", "DMV says the reports are not designed for cross-company comparison."], "It adds a measured exposure record while preserving the distinction between testing and passenger service.", ["The data are company-submitted and omit private-road, out-of-state, simulation, and lower-automation activity.", "Miles alone do not establish safety, service, or commercial viability."], ["Mobility", "Policy and Standards", "Human Futures"], ["Safety", "Regulation", "Data Quality", "Interpretation"]],
  ["nhtsa-sgo-crash-reporting-2026", "NHTSA Automated-Driving Crash Reporting Dashboard", "National Highway Traffic Safety Administration", "2026-06-15", "Data Release", "Published", "source-nhtsa-sgo-crash-reporting", "https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting", "NHTSA's amended Standing General Order provides current crash-reporting data for ADS and Level 2 ADAS systems through June 15, 2026.", ["The order creates timely notification requirements for specified crashes.", "NHTSA identifies duplicate, classification, exposure, and reporting limitations.", "The dashboard is an oversight input rather than a comparative safety ranking."], "It adds a current national operating-safety evidence rail to the service pathway.", ["Reports may duplicate incidents or contain corrected classifications.", "Without exposure and operating context, raw counts cannot establish comparative risk."], ["Mobility", "Cybersecurity", "Policy and Standards"], ["Safety", "Regulation", "Data Quality", "Interpretation"]],
  ["nhtsa-zoox-demonstration-exemption-2025", "NHTSA Zoox Demonstration Exemption", "National Highway Traffic Safety Administration", "2025-08-06", "Regulatory Decision", "In Review", "source-nhtsa-zoox-demonstration-exemption-2025", "https://www.nhtsa.gov/press-releases/nhtsa-issues-first-ever-demonstration-exemption-american-built-automated-vehicles", "NHTSA issues a demonstration exemption for domestically built Zoox driverless vehicles under the expanded Automated Vehicle Exemption Program.", ["The action is the first domestic demonstration exemption under the expanded program.", "It addresses vehicles that do not fully comply with all conventional equipment standards.", "The record authorizes demonstration, not general passenger service."], "It creates a precise federal approval stage without confusing demonstration with deployment.", ["The exemption is bounded to demonstration activity.", "No fared service, fleet scale, safety outcome, or commercial authorization follows from this record."], ["Mobility", "Policy and Standards", "Human Futures"], ["Regulation", "Certification", "Safety", "Public Trust"]],
  ["nhtsa-cruise-reporting-order-2024", "NHTSA Cruise Crash-Reporting Consent Order", "National Highway Traffic Safety Administration", "2024-09-30", "Regulatory Decision", "Published", "source-nhtsa-cruise-reporting-consent-order-2024", "https://www.nhtsa.gov/press-releases/consent-order-cruise-crash-reporting", "NHTSA records a consent order addressing incomplete automated-driving crash reports submitted by Cruise.", ["The action concerns incomplete reporting under the Standing General Order.", "It includes the October 2023 pedestrian crash record.", "The case demonstrates that reporting quality itself requires enforcement."], "It supplies a concrete control on the reliability of the operating-safety evidence rail.", ["One enforcement case cannot characterize all operators.", "The order does not by itself provide exposure-adjusted comparative safety evidence."], ["Mobility", "Cybersecurity", "Policy and Standards"], ["Safety", "Regulation", "Data Quality", "Public Trust"]]
];

const signals = [
  {
    id: "signal-nist-aria-pilot-multilevel-evaluation", title: "NIST completes a multi-level ARIA AI evaluation pilot", status: "Published",
    summary: "NIST's ARIA 0.1 pilot evaluates seven AI applications from five organizations through model testing, red teaming, and field testing, while remaining a pilot rather than a certification regime.",
    source_ids: ["source-nist-aria-pilot-evaluation-2025", "source-nist-aria-evaluation-program"], date: "2025-11-13",
    topic: "AI for Science", type: "Research Result", maturity: "Pilot Program", horizon: "Now", quality: "Primary Source",
    why: "The assurance pathway now contains a completed evaluation procedure spanning technical and contextual testing levels.",
    deps: ["repeat evaluations", "sector-specific methods", "institutional adoption", "authorization decisions", "operating monitoring"],
    constraints: ["Compute", "Standards", "Data Quality", "Safety"], gaps: ["gap-014"], scope: "Specific Source Update", evidence: "General Source Layer",
    note: "Publish as an evaluation-program result. Do not restate as certification or validation of AI systems generally."
  },
  {
    id: "signal-nist-ai-metrology-method-selection-layer", title: "NIST exposes an AI metrology method-selection layer", status: "Published",
    summary: "The NIST AI Metrology Center maps measurement methods to lifecycle stages and trustworthiness characteristics while explicitly withholding endorsement and universal fitness claims.",
    source_ids: ["source-nist-ai-metrology-center", "source-nist-ai-tevv-program"], date: "2026-07-24",
    topic: "AI for Science", type: "Policy Signal", maturity: "Infrastructure", horizon: "Now", quality: "Primary Source",
    why: "Operators have a concrete measurement-resource layer between risk principles and deployment-specific tests.",
    deps: ["method provenance", "context-specific validation", "organizational control adoption", "production monitoring"],
    constraints: ["Standards", "Data Quality", "Interpretation", "Safety"], gaps: ["gap-014"], scope: "System-Level Pattern", evidence: "General Source Layer",
    note: "Publish the resource and its non-endorsement boundary together."
  },
  {
    id: "signal-nist-ai-tevv-standard-remains-zero-draft", title: "NIST AI TEVV standard remains at zero-draft outline stage", status: "In Review",
    summary: "NIST has published an outline for a proposed AI TEVV zero draft, leaving consensus text, conformity assessment, adoption, and operating evidence unresolved.",
    source_ids: ["source-nist-ai-tevv-zero-draft-2025", "source-nist-ai-tevv-program"], date: "2025-07-15",
    topic: "Policy and Standards", type: "Policy Signal", maturity: "Theory", horizon: "2-5 Years", quality: "Primary Source",
    why: "The artifact creates a precise next-check gate for the assurance pathway.",
    deps: ["full draft", "public review", "consensus process", "final standard", "conformity assessment", "adoption evidence"],
    constraints: ["Standards", "Data Quality", "Interpretation"], gaps: ["gap-014"], scope: "Specific Source Update", evidence: "None",
    note: "Hold. An outline is not a draft standard, final standard, certification scheme, or adoption record."
  },
  {
    id: "signal-asml-phoenix-technical-academy-operational", title: "ASML's Phoenix technical academy is operating", status: "Published",
    summary: "Arizona records ASML's 56,000-square-foot Phoenix academy as fully operational after training began in 2024, with classrooms and cleanroom instruction for engineers and customers.",
    source_ids: ["source-aca-asml-technical-academy-2025"], date: "2025-11-20",
    topic: "Advanced Manufacturing", type: "Deployment", maturity: "Infrastructure", horizon: "Now", quality: "Primary Source",
    why: "The workforce pathway gains a real equipment-training facility rather than another coordination announcement.",
    deps: ["measured enrollment", "completions", "credentials", "retention", "placement", "production effect"],
    constraints: ["Manufacturing", "Labor", "Supply Chain", "Data Quality"], gaps: ["gap-003"], scope: "Project-Level Claim", evidence: "Project-Level Evidence",
    note: "Publish facility operation. Keep anticipated 1,000-per-year capacity separate from actual throughput."
  },
  {
    id: "signal-drive48-graduates-operating-workforce-comparator", title: "Drive48 reports more than 2,000 advanced-manufacturing graduates", status: "Published",
    summary: "Arizona reports more than 2,000 Drive48 graduates since 2021 and says many work at Lucid's Casa Grande plant, creating an employment-linked comparator with incomplete placement data.",
    source_ids: ["source-aca-future48-battery-accelerator-2025"], date: "2025-04-04",
    topic: "Advanced Manufacturing", type: "Deployment", maturity: "Scaling", horizon: "Now", quality: "Primary Source",
    why: "The record advances beyond planned capacity into delivered graduates and a named industrial receiver.",
    deps: ["cohort denominators", "credential data", "placement rate", "retention", "wages", "productivity outcomes"],
    constraints: ["Manufacturing", "Labor", "Data Quality", "Supply Chain"], gaps: ["gap-003"], scope: "System-Level Pattern", evidence: "Specific Local Record",
    note: "Publish the aggregate graduate count. Do not infer placement rate or workforce sufficiency from 'many'."
  },
  {
    id: "signal-maricopa-semiconductor-accelerator-2027-plan", title: "Maricopa semiconductor accelerator remains a 2027 plan", status: "In Review",
    summary: "Maricopa Community Colleges describes a semiconductor workforce accelerator expected to open in 2027, with construction, equipment, training, and employment outcomes still pending.",
    source_ids: ["source-maricopa-semiconductor-accelerator"], date: "2026-07-24",
    topic: "Advanced Manufacturing", type: "Policy Signal", maturity: "Infrastructure", horizon: "2-5 Years", quality: "Primary Source",
    why: "The record creates a dated facility-opening gate for the Southwest workforce system.",
    deps: ["construction completion", "facility acceptance", "equipment installation", "enrollment", "completions", "placement"],
    constraints: ["Manufacturing", "Labor", "Capital", "Infrastructure"], gaps: ["gap-003"], scope: "Project-Level Claim", evidence: "Specific Local Record",
    note: "Hold until the facility opens or delivers training. Expected opening is not operating capacity."
  },
  {
    id: "signal-chandler-reclaimed-water-operating-scale", title: "Chandler operates an 11-billion-gallon reclaimed-water system", status: "Published",
    summary: "Chandler reports treating roughly 11 billion gallons of wastewater each year through an operating network serving industrial use, irrigation, recharge, and other local demand.",
    source_ids: ["source-chandler-reclaimed-water-system", "source-chandler-water-conservation-in-action"], date: "2026-07-24",
    topic: "Water", type: "Deployment", maturity: "Infrastructure", horizon: "Now", quality: "Official Data",
    why: "The industrial-water pathway gains an operating municipal receiving-system comparator with measured system scale.",
    deps: ["customer-level flow data", "industrial allocation", "reliability data", "permit compliance", "facility water balances"],
    constraints: ["Water", "Infrastructure", "Data Quality", "Climate"], gaps: ["gap-002"], scope: "Local Constraint Map", evidence: "Specific Local Record",
    note: "Publish as Chandler system evidence. It does not establish TSMC reuse operation or spare capacity."
  },
  {
    id: "signal-intel-arizona-water-conservation-2023", title: "Intel reports 3.4 billion gallons conserved in Arizona in 2023", status: "Published",
    summary: "Intel reports conserving 3.4 billion gallons at its Chandler and Ocotillo sites and restoring more than 1.1 billion gallons through funded Arizona projects in 2023.",
    source_ids: ["source-intel-arizona-community-investment-2024"], date: "2024-06-01",
    topic: "Water", type: "Deployment", maturity: "Infrastructure", horizon: "Now", quality: "Company Claim",
    why: "The pathway gains a measured industrial-operator claim that can be tested against municipal, permit, and facility records.",
    deps: ["independent verification", "facility water balance", "reclaimed-water volume", "withdrawal and discharge data", "method disclosure"],
    constraints: ["Water", "Manufacturing", "Data Quality", "Interpretation"], gaps: ["gap-002"], scope: "Project-Level Claim", evidence: "Project-Level Evidence",
    note: "Publish with company attribution. Conservation and restoration are not identical to on-site reuse or net physical flow."
  },
  {
    id: "signal-chandler-intel-brine-improvements-proposed-budget", title: "Chandler proposes Intel Ocotillo brine-facility improvements", status: "In Review",
    summary: "Chandler's proposed FY 2026-27 budget schedules $32.997 million across two years for Intel Ocotillo Brine Reduction Facility improvements, without yet establishing adoption or delivery.",
    source_ids: ["source-chandler-fy2027-proposed-budget"], date: "2026-05-01",
    topic: "Water", type: "Funding", maturity: "Infrastructure", horizon: "2-5 Years", quality: "Primary Source",
    why: "The proposal creates a named capital trail for an existing industrial-water asset.",
    deps: ["budget adoption", "appropriation", "procurement", "construction", "acceptance", "operating results"],
    constraints: ["Water", "Capital", "Infrastructure", "Data Quality"], gaps: ["gap-002"], scope: "Project-Level Claim", evidence: "Specific Local Record",
    note: "Hold. A proposed budget is not an adopted appropriation, contract, completed project, or outcome."
  },
  {
    id: "signal-cpuc-waymo-fared-driverless-expansion-2024", title: "CPUC authorizes expanded fared Waymo driverless service", status: "Published",
    summary: "CPUC's March 2024 disposition authorizes Waymo to begin fared driverless passenger service in specified Los Angeles and San Francisco Peninsula areas.",
    source_ids: ["source-cpuc-waymo-al2-disposition-2024", "source-cpuc-av-advice-letter-status-2026"], date: "2024-03-01",
    topic: "Mobility", type: "Regulation", maturity: "Early Commercial", horizon: "Now", quality: "Regulatory Filing",
    why: "The road-autonomy pathway now reaches a named carrier, service type, geography, and effective operating authority.",
    deps: ["actual trips", "fleet and availability data", "safety exposure", "accessibility", "cost", "local response records"],
    constraints: ["Regulation", "Safety", "Public Trust", "Data Quality"], gaps: ["gap-015"], scope: "Project-Level Claim", evidence: "Project-Level Evidence",
    note: "Publish the authorization. Do not infer trip volume, safety superiority, service quality, or scale."
  },
  {
    id: "signal-california-av-testing-miles-2024", title: "California reports 4.5 million autonomous testing miles", status: "Published",
    summary: "California DMV reports 4,498,066 autonomous public-road testing miles for December 2023 through November 2024, including 552,895 fully autonomous miles.",
    source_ids: ["source-california-dmv-av-miles-2024", "source-nhtsa-sgo-crash-reporting"], date: "2025-01-31",
    topic: "Mobility", type: "Deployment", maturity: "Field Trial", horizon: "Now", quality: "Official Data",
    why: "The pathway gains measured operating exposure that can be paired with incident data while remaining separate from passenger service.",
    deps: ["operator-level exposure", "incident normalization", "operating-design-domain context", "service trip data", "consistent reporting"],
    constraints: ["Safety", "Regulation", "Data Quality", "Interpretation"], gaps: ["gap-015"], scope: "System-Level Pattern", evidence: "General Source Layer",
    note: "Publish as testing exposure only. DMV warns that the reports are not designed for cross-company comparison."
  },
  {
    id: "signal-nhtsa-zoox-demonstration-exemption-boundary", title: "Zoox receives a federal demonstration exemption, not service approval", status: "In Review",
    summary: "NHTSA's August 2025 exemption allows bounded demonstration of domestically built Zoox driverless vehicles while leaving commercial passenger-service authority and outcomes unresolved.",
    source_ids: ["source-nhtsa-zoox-demonstration-exemption-2025"], date: "2025-08-06",
    topic: "Mobility", type: "Regulation", maturity: "Field Trial", horizon: "Now", quality: "Regulatory Filing",
    why: "The record marks a specific federal approval stage without collapsing demonstration into deployment.",
    deps: ["state deployment permit", "passenger-service authority", "local operating approval", "safety outcomes", "fleet and trip data"],
    constraints: ["Regulation", "Certification", "Safety", "Public Trust"], gaps: ["gap-015"], scope: "Project-Level Claim", evidence: "Project-Level Evidence",
    note: "Hold. Demonstration exemption is not general commercial or passenger-service approval."
  }
];

function sourceRecord(source) {
  const record = {
    id: source.id,
    name: source.name,
    url: source.url,
    source_type: source.source_type,
    credibility_level: source.source_type === "Company Press Room" ? "Tier 2" : "Tier 1",
    primary_topics: source.primary_topics,
    framework_layers: source.framework_layers,
    country_or_region: source.country_or_region,
    update_frequency: "Dated record with follow-on updates",
    capture_priority: "High",
    known_limitations: source.known_limitations,
    last_checked_date: capturedDate,
    watch_lanes: source.watch_lanes,
    live_access_type: source.live_access_type,
    review_cadence_days: 90,
    monitoring_status: "Active",
    coverage_role: source.coverage_role,
    jurisdiction: source.country_or_region,
    source_owner: source.source_owner,
    automation_notes: "Track the next named downstream milestone and preserve the stated evidence boundary.",
    notes: source.notes
  };
  if (source.live_access_type === "Data Download") record.data_download_url = source.url;
  if (source.live_access_type === "Docket Search") record.docket_search_url = source.url;
  return record;
}

function researchDocument(row, index) {
  const [slug, title, publisher, publicationDate, documentType, status, sourceId, url, summary, findings, why, limits, topics, constraints] = row;
  return {
    id: `research-doc-55y-${slug}`,
    collection_id: collectionId,
    title,
    slug: `55y-${slug}`,
    record_status: status,
    publisher,
    publication_date: publicationDate,
    document_type: documentType,
    summary,
    key_findings: findings,
    why_it_matters: why,
    ftfn_relevance: [
      "Advances one named Phase 55Y reader journey.",
      "Separates the current evidence stage from downstream operation or outcome claims.",
      "Creates a specific next-record watch point."
    ],
    evidence_limits: limits,
    primary_topics: topics,
    framework_layers: topics.includes("Water")
      ? ["Resource Foundations", "Enabling Infrastructure", "Human Systems"]
      : ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraint_tags: constraints,
    source_id: sourceId,
    official_url: url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-${slug}.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-${slug}.txt`,
    capture_status: "Official link record",
    captured_date: capturedDate
  };
}

function signalText(signal) {
  const lines = [
    "---",
    `id: "${signal.id}"`,
    `title: "${signal.title.replaceAll('"', '\\"')}"`,
    `slug: "${signal.id.replace(/^signal-/, "")}"`,
    `record_status: "${signal.status}"`,
    `summary: "${signal.summary.replaceAll('"', '\\"')}"`,
    "source_ids:",
    ...signal.source_ids.map((id) => `  - "${id}"`),
    `published_date: ${signal.date}`,
    `captured_date: ${capturedDate}`,
    `primary_topic: "${signal.topic}"`,
    "framework_layers:",
    "  - \"Enabling Infrastructure\"",
    "  - \"Frontier Domains\"",
    "  - \"Human Systems\"",
    `signal_type: "${signal.type}"`,
    `maturity_level: "${signal.maturity}"`,
    `time_horizon: "${signal.horizon}"`,
    `evidence_quality: "${signal.quality}"`,
    "verification_status: \"Verified Against Primary Source\"",
    `why_it_matters: "${signal.why.replaceAll('"', '\\"')}"`,
    "dependencies:",
    ...signal.deps.map((item) => `  - "${item}"`),
    "constraints:",
    ...signal.constraints.map((item) => `  - "${item}"`),
    "receiving_systems:",
    `  - "${signal.topic === "Water" || signal.topic === "Advanced Manufacturing" ? "U.S. Southwest Chip Corridor" : signal.topic === "Mobility" ? "California automated passenger-service system" : "Institutional AI assurance systems"}"`,
    "local_implications:",
    `  - "${signal.why.replaceAll('"', '\\"')}"`,
    "evidence_gap_ids:",
    ...signal.gaps.map((id) => `  - "${id}"`),
    `claim_scope: "${signal.scope}"`,
    `local_evidence_level: "${signal.evidence}"`,
    `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: "${signal.note.replaceAll('"', '\\"')}"`,
    "---",
    "",
    "## Evidence Stage",
    "",
    signal.summary,
    "",
    "## Boundary",
    "",
    signal.note,
    "",
    "## What To Watch Next",
    "",
    `Track ${signal.deps.join(", ")}.`,
    ""
  ];
  return lines.join("\n");
}

for (const directory of ["sources", "research-documents", "signals", "research-collections"]) {
  await mkdir(join(contentRoot, directory), { recursive: true });
}

for (const source of sources) {
  await writeFile(
    join(contentRoot, "sources", `${source.id}.json`),
    `${JSON.stringify(sourceRecord(source), null, 2)}\n`,
    "utf8"
  );
}

const researchDocuments = docs.map(researchDocument);
for (let index = 0; index < researchDocuments.length; index += 1) {
  const document = researchDocuments[index];
  await writeFile(
    join(contentRoot, "research-documents", `${107 + index}-${document.slug}.json`),
    `${JSON.stringify(document, null, 2)}\n`,
    "utf8"
  );
}

for (const signal of signals) {
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), signalText(signal), "utf8");
}

const collection = {
  id: collectionId,
  title: "Operational Evidence And Receiving Systems, 2024-2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Twenty-four official records deepen four existing reader journeys: AI assurance, advanced-manufacturing workforce, industrial-water operation, and autonomous passenger service.",
  scope: "Phase 55Y adds six records per journey and twelve bounded signals. Eight signals publish operating, measured, or effective-authority evidence; four remain In Review because they are a zero-draft outline, a planned training facility, a proposed capital budget, or a demonstration-only exemption.",
  captured_date: capturedDate,
  document_ids: researchDocuments.map((document) => document.id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 27-file archive contains 24 official-link records, consolidated FTFN summaries, a README, and a SHA-256 manifest. Four records remain explicitly In Review at a pre-operational stage.",
  method_note: "A pilot is not certification; a method catalog is not control adoption; an operating training facility is not workforce sufficiency; a design rating is not delivered industrial flow; a service authorization is not service performance; and a demonstration exemption is not commercial passenger service."
};

await writeFile(
  join(contentRoot, "research-collections", `${collectionSlug}.json`),
  `${JSON.stringify(collection, null, 2)}\n`,
  "utf8"
);

const review = {
  phase: "55Y",
  reviewed_date: capturedDate,
  journey_count: 4,
  primary_record_count: 24,
  signal_decisions: {
    reviewed: 12,
    promoted: signals.filter((signal) => signal.status === "Published").map((signal) => signal.id),
    held: signals.filter((signal) => signal.status === "In Review").map((signal) => signal.id)
  },
  journey_records: {
    ai_assurance: researchDocuments.slice(0, 6).map((document) => document.id),
    manufacturing_workforce: researchDocuments.slice(6, 12).map((document) => document.id),
    industrial_water: researchDocuments.slice(12, 18).map((document) => document.id),
    autonomy_service: researchDocuments.slice(18, 24).map((document) => document.id)
  },
  publication_rule: "Each journey receives two Published signals and one In Review hold. Publication requires a completed evaluation, operating asset, measured record, or effective operating authority with explicit evidence limits."
};

await mkdir(join(appRoot, "src", "data"), { recursive: true });
await writeFile(
  join(appRoot, "src", "data", "phase-55y-publication-review.json"),
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8"
);

console.log(`Generated ${sources.length} sources, ${researchDocuments.length} research documents, ${signals.length} signals, one collection, and one review ledger.`);
