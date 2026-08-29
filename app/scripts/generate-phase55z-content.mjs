import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionSlug = "comparative-operating-outcomes-2023-2026";
const collectionId = `research-collection-${collectionSlug}`;

const portfolioDefaults = {
  ai_cyber: {
    label: "Institutional AI and cybersecurity operation",
    topics: ["AI for Science", "Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Compute", "Cybersecurity", "Standards", "Data Quality", "Safety"],
    watchLanes: ["Cross-Cutting Official Rails", "Security and Standards", "AI and Advanced Manufacturing"],
    coverage: ["Primary Data", "Standards Evidence", "Source Freshness"],
    country: "United States",
  },
  manufacturing: {
    label: "Manufacturing workforce and production outcomes",
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Labor", "Supply Chain", "Data Quality", "Unit Economics"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    coverage: ["Primary Data", "Research Program Evidence", "Source Freshness"],
    country: "United States",
  },
  infrastructure: {
    label: "Grid, water, storage, and minerals infrastructure performance",
    topics: ["Energy", "Water", "Critical Minerals"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Water", "Materials", "Infrastructure", "Data Quality", "Weather"],
    watchLanes: ["Power and Grid", "Water", "Critical Minerals"],
    coverage: ["Primary Data", "Source Freshness"],
    country: "United States",
  },
  mobility_space: {
    label: "Mobility, aviation, and space service or mission outcomes",
    topics: ["Mobility", "Aviation", "Space"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Regulation", "Certification", "Safety", "Infrastructure", "Data Quality", "Public Trust"],
    watchLanes: ["Mobility Certification", "Space", "Cross-Cutting Official Rails"],
    coverage: ["Primary Data", "Regulatory Change", "Source Freshness"],
    country: "United States",
  },
};

const records = [
  {
    portfolio: "ai_cyber",
    slug: "gao-federal-generative-ai-use-2025",
    title: "GAO: Generative AI Use and Management at Federal Agencies",
    publisher: "U.S. Government Accountability Office",
    date: "2025-07-29",
    type: "Oversight Report",
    url: "https://www.gao.gov/products/gao-25-107653",
    summary: "GAO found that reported AI use cases across 11 selected agencies increased from 571 in 2023 to 1,110 in 2024, while reported generative-AI use cases increased from 32 to 282.",
    findings: [
      "The selected agencies' reported AI inventories nearly doubled in one year.",
      "Reported generative-AI use cases increased about nine-fold.",
      "Agencies described policy, technical-resource, budget, and appropriate-use challenges.",
    ],
    limits: [
      "Inventory growth measures disclosed use cases, not productivity, service quality, safety, or mission outcomes.",
      "The 11-agency review is not a census of all federal AI activity.",
    ],
    owner: "U.S. Government Accountability Office",
    sourceType: "Government Agency",
  },
  {
    portfolio: "ai_cyber",
    slug: "gao-federal-ai-acquisitions-2026",
    title: "GAO: Artificial Intelligence Acquisitions",
    publisher: "U.S. Government Accountability Office",
    date: "2026-04-13",
    type: "Oversight Report",
    url: "https://files.gao.gov/reports/GAO-26-107859/index.html",
    summary: "GAO reviewed 13 AI acquisitions at DOD, DHS, GSA, and VA and found that the agencies used multiple acquisition approaches but did not systematically collect and apply lessons learned.",
    findings: [
      "The review covered 13 acquisitions at four agencies through fiscal year 2025.",
      "Agencies used contracts, schedules, and other acquisition approaches with different trade-offs.",
      "GAO made four recommendations requiring systematic collection and sharing of acquisition lessons.",
    ],
    limits: [
      "Acquisition activity is not deployment success or measured mission benefit.",
      "The selected acquisitions do not represent every federal AI acquisition.",
    ],
    owner: "U.S. Government Accountability Office",
    sourceType: "Government Agency",
  },
  {
    portfolio: "ai_cyber",
    slug: "gao-irs-ai-management-2026",
    title: "GAO: IRS AI Skills, Information Quality, and Strategic Management",
    publisher: "U.S. Government Accountability Office",
    date: "2026-03-24",
    type: "Oversight Report",
    url: "https://files.gao.gov/reports/GAO-26-107522/index.html",
    summary: "GAO found 126 active IRS AI use cases in June 2025, with 77 listed as in development and more than one-quarter missing information on intended agency benefit.",
    findings: [
      "IRS listed 126 active AI use cases in June 2025.",
      "Sixty-one percent, or 77 use cases, were categorized as in development.",
      "More than one-quarter lacked information describing how the use case would benefit the agency.",
    ],
    limits: [
      "The IRS inventory label active includes use cases that remain in development.",
      "The report does not supply comparable realized benefits for the inventory.",
    ],
    owner: "U.S. Government Accountability Office",
    sourceType: "Government Agency",
  },
  {
    portfolio: "ai_cyber",
    slug: "gao-operational-ai-use-cases-2026",
    title: "GAO Artificial Intelligence Use Cases",
    publisher: "U.S. Government Accountability Office",
    date: "2026-03-01",
    type: "Data Release",
    url: "https://www.gao.gov/science-technology/artificial-intelligence-use-cases",
    summary: "GAO's March 2026 inventory identifies operational tools for audit-data exploration, topic modeling, document extraction, and internal generative-AI support, with maturity and potential-benefit fields.",
    findings: [
      "The inventory distinguishes operational use cases from earlier maturity stages.",
      "Named tools support audit-data exploration, document processing, and internal knowledge work.",
      "The page discloses intended benefits and relevant AI techniques.",
    ],
    limits: [
      "Potential benefits are not measured benefits.",
      "The inventory does not disclose comparable usage, accuracy, time saved, cost, incidents, or user-satisfaction results.",
    ],
    owner: "U.S. Government Accountability Office",
    sourceType: "Government Agency",
    liveAccess: "Interactive Portal",
  },
  {
    portfolio: "ai_cyber",
    slug: "nasa-ai-use-cases-2024",
    title: "NASA 2024 AI Use Cases",
    publisher: "National Aeronautics and Space Administration",
    date: "2025-01-07",
    type: "Agency Announcement",
    status: "In Review",
    url: "https://www.nasa.gov/organizations/ocio/dt/ai/2024-ai-use-cases/",
    summary: "NASA describes active AI uses spanning autonomous exploration, navigation, science analysis, and mission operations.",
    findings: [
      "NASA identifies active mission and operations use cases.",
      "The examples include Perseverance navigation and autonomous science collection.",
      "The agency frames the inventory as part of its responsible-AI governance.",
    ],
    limits: [
      "The public overview does not provide common performance measures for the named systems.",
      "Active use does not by itself establish accuracy, reliability, safety, cost, or mission benefit.",
    ],
    owner: "National Aeronautics and Space Administration",
    sourceType: "Government Agency",
  },
  {
    portfolio: "ai_cyber",
    slug: "gao-cdm-network-monitoring-2025",
    title: "GAO: Continuous Diagnostics and Mitigation Network Monitoring",
    publisher: "U.S. Government Accountability Office",
    date: "2025-06-11",
    type: "Oversight Report",
    url: "https://files.gao.gov/reports/GAO-25-107470/index.html",
    summary: "GAO reviewed the CISA-led Continuous Diagnostics and Mitigation program across 23 civilian agencies and found progress alongside data-quality, endpoint, and cloud-management gaps.",
    findings: [
      "Four agencies reported that CDM helped automate FISMA reporting.",
      "Seven agencies reported data-quality problems that required manual corrections.",
      "GAO made four recommendations covering guidance, data quality, endpoint implementation, and cloud assets.",
    ],
    limits: [
      "Agency survey responses do not supply a common exposure-reduction or incident-outcome metric.",
      "The review assesses program implementation rather than the security performance of individual networks.",
    ],
    owner: "U.S. Government Accountability Office",
    sourceType: "Government Agency",
  },
  {
    portfolio: "ai_cyber",
    slug: "gao-fisma-effectiveness-metrics-2024",
    title: "GAO: Information Security Performance Metrics",
    publisher: "U.S. Government Accountability Office",
    date: "2024-01-09",
    type: "Oversight Report",
    url: "https://www.gao.gov/products/gao-24-106291",
    summary: "GAO found that inspectors general rated only eight of 23 civilian agencies' information-security programs effective for fiscal year 2022 and called for metrics tied more clearly to goals, risk, workforce, and agency size.",
    findings: [
      "Eight of 23 reviewed civilian agencies had effective programs in fiscal year 2022.",
      "Fifteen were rated ineffective by their inspectors general.",
      "GAO recommended performance measures better linked to goals, risk, workforce, and scale.",
    ],
    limits: [
      "The effectiveness snapshot is based on fiscal year 2022 data.",
      "Binary effective or ineffective ratings do not reveal equivalent risk or operating performance across agencies.",
    ],
    owner: "U.S. Government Accountability Office",
    sourceType: "Government Agency",
  },
  {
    portfolio: "ai_cyber",
    slug: "gao-federal-incident-response-2023",
    title: "GAO: Federal Cybersecurity Incident Response Preparedness",
    publisher: "U.S. Government Accountability Office",
    date: "2023-12-04",
    type: "Oversight Report",
    url: "https://www.gao.gov/products/gao-24-105658",
    summary: "GAO found all 23 reviewed agencies had substantially completed incident-response preparation activities, while only three had reached the required advanced event-logging tier by August 2023.",
    findings: [
      "All 23 agencies substantially completed the preparation phase activities.",
      "Sixteen agencies reported endpoint detection and response coverage of at least 80 percent.",
      "Only three agencies had reached advanced event-logging maturity by the August 2023 deadline.",
    ],
    limits: [
      "Preparedness and coverage measures do not establish incident prevention or recovery outcomes.",
      "The principal measurement date is August 2023, although recommendation statuses were updated later.",
    ],
    owner: "U.S. Government Accountability Office",
    sourceType: "Government Agency",
  },
  {
    portfolio: "manufacturing",
    slug: "nist-mep-fy2024-network-results",
    title: "NIST MEP National Network FY 2024 Results",
    publisher: "National Institute of Standards and Technology",
    date: "2025-03-20",
    type: "Data Release",
    url: "https://www.nist.gov/system/files/documents/2025/03/20/NIST%20MEP-%20About%20the%20MEPNN%20508-2.pdf",
    summary: "NIST reports third-party follow-up survey estimates from 8,771 FY 2024 MEP clients: $15 billion in new or retained sales, $5 billion in new investment, $2.6 billion in cost savings, and more than 108,300 jobs created or retained.",
    findings: [
      "8,771 of 11,734 clients due for follow-up completed the survey.",
      "Clients attributed $15 billion in new or retained sales and $2.6 billion in savings to MEP assistance.",
      "Clients reported more than 108,300 jobs created or retained and $5 billion in new investment.",
    ],
    limits: [
      "The figures are client-reported estimates rather than audited firm accounts.",
      "Sales, savings, investment, and jobs are different outcome units and must not be collapsed into a single score.",
    ],
    owner: "NIST Manufacturing Extension Partnership",
    sourceType: "Government Agency",
  },
  {
    portfolio: "manufacturing",
    slug: "nist-mep-fy2024-client-challenges",
    title: "NIST MEP FY 2024 Client Impact and Challenge Analysis",
    publisher: "National Institute of Standards and Technology",
    date: "2025-03-25",
    type: "Technical Report",
    url: "https://www.nist.gov/blogs/manufacturing-innovation-blog/challenges-solutions-and-success-stories-across-mep-national",
    summary: "NIST describes the FY 2024 MEP client survey method and reports that 55 percent of surveyed manufacturers identified employee recruitment and retention as a major challenge.",
    findings: [
      "The FY 2024 analysis draws on more than 8,700 third-party survey responses.",
      "Nearly 95 percent of respondents were small or medium-sized manufacturers.",
      "Fifty-five percent identified employee recruitment and retention as a top challenge.",
    ],
    limits: [
      "Challenge selection is a perception measure, not a vacancy, retention, or productivity rate.",
      "Respondents are MEP clients and are not a random sample of all U.S. manufacturers.",
    ],
    owner: "NIST Manufacturing Extension Partnership",
    sourceType: "Government Agency",
  },
  {
    portfolio: "manufacturing",
    slug: "manufacturing-usa-report-to-congress-2025",
    title: "2025 Manufacturing USA Report to Congress",
    publisher: "Manufacturing USA",
    date: "2026-03-17",
    type: "Oversight Report",
    status: "In Review",
    url: "https://www.manufacturingusa.com/reports/2025-manufacturing-usa-report-congress",
    summary: "The network reports more than 900 applied R&D projects, more than 150,000 workforce-program engagements, over 2,900 member organizations, and a 2.4-to-1 co-investment ratio for the covered reporting period.",
    findings: [
      "The institutes managed more than 900 applied R&D projects.",
      "More than 150,000 workers, students, and educators were engaged in workforce programs and training.",
      "The network reports a 2.4-to-1 ratio of non-base to base federal investment.",
    ],
    limits: [
      "Engagement is not a common completion, credential, placement, retention, or productivity measure.",
      "Network totals aggregate institutes with different programs, populations, and reporting methods.",
    ],
    owner: "Manufacturing USA Advanced Manufacturing National Program Office",
    sourceType: "Government Agency",
  },
  {
    portfolio: "manufacturing",
    slug: "niimbl-annual-report-2023-2024",
    title: "NIIMBL Annual Report 2023-2024",
    publisher: "National Institute for Innovation in Manufacturing Biopharmaceuticals",
    date: "2025-08-01",
    type: "Technical Report",
    url: "https://www.niimbl.org/wp-content/uploads/2025/08/NIIMBL-2023-2024-Annual-Report-Full2.pdf",
    summary: "NIIMBL reports that supported training reached more than 3,600 professionals and 3,200 students in 2023, alongside program and project activity across biopharmaceutical manufacturing.",
    findings: [
      "Supported training reached more than 6,800 professionals and students in 2023.",
      "The institute expanded its immersion program to five locations in 2024.",
      "The report distinguishes workforce programs from technology and institute-led programs.",
    ],
    limits: [
      "Training reach does not disclose a common completion, credential, placement, retention, or wage outcome.",
      "The institute report is self-reported program evidence.",
    ],
    owner: "NIIMBL",
    sourceType: "Research Lab",
    credibility: "Tier 2",
  },
  {
    portfolio: "manufacturing",
    slug: "mxd-future-factory-project-portfolio-2025",
    title: "MxD Future Factory Project Portfolio",
    publisher: "Manufacturing USA",
    date: "2025-05-20",
    type: "Program Milestone",
    url: "https://www.manufacturingusa.com/studies/mxd-testbed-factory-future",
    summary: "Manufacturing USA reports that MxD has delivered 190 digital-manufacturing, cybersecurity, and workforce projects and operates a 22,000-square-foot testbed.",
    findings: [
      "MxD reports 190 delivered projects across technology, cybersecurity, and workforce domains.",
      "Its Chicago Future Factory provides a 22,000-square-foot testbed.",
      "The portfolio includes digital-twin and workforce-role work.",
    ],
    limits: [
      "Delivered project counts do not reveal adoption, production, cost, quality, or workforce outcomes.",
      "The projects differ in scope and should not be treated as equivalent units.",
    ],
    owner: "Manufacturing USA",
    sourceType: "Research Lab",
    credibility: "Tier 2",
  },
  {
    portfolio: "manufacturing",
    slug: "iacmi-composites-operating-results-2025",
    title: "IACMI Composites Program Operating Results",
    publisher: "Manufacturing USA",
    date: "2025-12-08",
    type: "Program Milestone",
    url: "https://www.manufacturingusa.com/studies/iacmi-blends-best-composites",
    summary: "IACMI reports more than 60 completed industry-led projects, 25 commercial products and technologies, and 23,310 workforce-program participants since launch.",
    findings: [
      "The institute reports more than 60 completed industry-led projects.",
      "It attributes 25 commercial products and technologies to the program.",
      "Its workforce programs report 23,310 participants, including more than 16,000 ACE machining trainees.",
    ],
    limits: [
      "Participant counts do not establish completion, placement, retention, or wage outcomes.",
      "Products, technologies, projects, and trainees are not comparable units.",
    ],
    owner: "Institute for Advanced Composites Manufacturing Innovation",
    sourceType: "Research Lab",
    credibility: "Tier 2",
  },
  {
    portfolio: "manufacturing",
    slug: "niimbl-door-to-floor-training-outcomes",
    title: "NIIMBL Door-to-Floor Biomanufacturing Training Outcomes",
    publisher: "National Institute for Innovation in Manufacturing Biopharmaceuticals",
    date: "2025-01-01",
    type: "Program Milestone",
    url: "https://www.niimbl.org/projects/reducing-door-to-floor-improving-readiness-of-new-hires-through-cgmp-hands-on-biopharmaceutical-training/",
    summary: "NIIMBL reports 47 graduates completed more than 100 hours of cGMP and regulatory training, exceeding the program target of 40 and producing documented employer interviews or placements.",
    findings: [
      "Forty-seven people completed the training, seven above the proposal target.",
      "The program combined online courses with two weeks of hands-on training.",
      "NIIMBL reports interviews or placements with named large and small employers.",
    ],
    limits: [
      "The page does not provide a placement denominator, retention interval, wage outcome, or comparison group.",
      "Reported employer benefit is program evidence rather than an independent labor-market evaluation.",
    ],
    owner: "NIIMBL",
    sourceType: "Research Lab",
    credibility: "Tier 2",
  },
  {
    portfolio: "manufacturing",
    slug: "nist-amphenol-arizona-mep-results-2026",
    title: "NIST Arizona MEP Amphenol Aerospace Results",
    publisher: "National Institute of Standards and Technology",
    date: "2026-01-13",
    type: "Program Milestone",
    url: "https://www.nist.gov/mep/successstories/2025/amphenol-aerospace-reduces-scrap-through-arizona-mep-lean-green-belt-course",
    summary: "NIST's MEP success record reports 24 jobs retained, $932,000 in cost savings across eight Lean Green Belt projects, and a documented 60-day quality-control project at Amphenol Aerospace.",
    findings: [
      "The program reports 24 retained jobs.",
      "Eight Lean Green Belt projects are associated with $932,000 in total cost savings.",
      "One 60-day screening-gate project documented $60,000 in savings.",
    ],
    limits: [
      "The result is a company and program attribution, not an independent counterfactual evaluation.",
      "One facility outcome cannot establish regional manufacturing productivity.",
    ],
    owner: "NIST Manufacturing Extension Partnership",
    sourceType: "Government Agency",
    country: "Mesa, Arizona, United States",
  },
  {
    portfolio: "infrastructure",
    slug: "nerc-state-of-reliability-2025",
    title: "NERC 2025 State of Reliability Overview",
    publisher: "North American Electric Reliability Corporation",
    date: "2025-06-12",
    type: "Technical Report",
    url: "https://www.nerc.com/globalassets/programs/rapa/pa/nerc_sor_2025_overview.pdf",
    summary: "NERC's review of 2024 bulk-power performance reports improving frequency response in Texas and the West, one operator-initiated load-shed event, and early evidence of substantial battery contributions to frequency services.",
    findings: [
      "NERC reports one operator-initiated load-shed event in 2024, restored in half an hour.",
      "Texas battery capacity increased from 1,307 MW in January 2022 to 10,027 MW in December 2024.",
      "Batteries supplied up to 100 percent of frequency-regulation capacity in several ERCOT instances and more than 70 percent of response in individual disturbances.",
    ],
    limits: [
      "NERC calls the battery evidence initial and continues to monitor it.",
      "Bulk-power performance does not measure distribution reliability or individual utility service.",
    ],
    owner: "North American Electric Reliability Corporation",
    sourceType: "Standards Body",
    country: "North America",
  },
  {
    portfolio: "infrastructure",
    slug: "eia-us-outage-duration-2024",
    title: "EIA U.S. Electricity Interruption Duration for 2024",
    publisher: "U.S. Energy Information Administration",
    date: "2025-12-01",
    type: "Data Release",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=66744",
    summary: "EIA reports that U.S. customers experienced an average of 11 hours of electricity interruptions in 2024 and that major events accounted for 80 percent of the interruption duration.",
    findings: [
      "Average interruption duration reached 11 hours per customer in 2024.",
      "Major events accounted for 80 percent of the total interruption duration.",
      "Interruptions excluding major events remained near two hours.",
    ],
    limits: [
      "National averages mask large differences among states and utilities.",
      "Major-event and non-major-event results must remain separated.",
    ],
    owner: "U.S. Energy Information Administration",
    sourceType: "Government Agency",
  },
  {
    portfolio: "infrastructure",
    slug: "eia-battery-capacity-2024",
    title: "EIA U.S. Utility-Scale Battery Capacity in 2024",
    publisher: "U.S. Energy Information Administration",
    date: "2025-03-12",
    type: "Data Release",
    url: "https://www.eia.gov/todayinenergy/detail.php?id=64705",
    summary: "EIA's preliminary generator inventory reports that U.S. utility-scale battery capacity increased 66 percent in 2024 and exceeded 26 GW.",
    findings: [
      "Operators added 10.4 GW of utility-scale battery capacity in 2024.",
      "Cumulative capacity exceeded 26 GW.",
      "Battery storage represented about two percent of utility-scale generating capacity.",
    ],
    limits: [
      "Installed power capacity is not energy duration, availability, dispatch, revenue, or reliability effect.",
      "The release uses preliminary generator inventory data.",
    ],
    owner: "U.S. Energy Information Administration",
    sourceType: "Government Agency",
  },
  {
    portfolio: "infrastructure",
    slug: "eia-battery-storage-market-trends-2026",
    title: "EIA Battery Storage in the United States: 2026 Market Update",
    publisher: "U.S. Energy Information Administration",
    date: "2026-03-17",
    type: "Data Release",
    url: "https://www.eia.gov/analysis/studies/electricity/batterystorage/",
    summary: "EIA's 2026 update provides 2024 operating data on large- and small-scale storage capacity, ownership, co-location, applications, and installation costs.",
    findings: [
      "The update distinguishes power capacity, energy capacity, configuration, application, and cost.",
      "It is based on EIA survey responses from operating assets.",
      "The release explicitly avoids causal economic or scenario analysis.",
    ],
    limits: [
      "The dataset does not by itself establish why deployment changed or what reliability benefit resulted.",
      "Different storage applications and durations are not interchangeable.",
    ],
    owner: "U.S. Energy Information Administration",
    sourceType: "Government Agency",
    liveAccess: "Interactive Portal",
  },
  {
    portfolio: "infrastructure",
    slug: "epa-water-reuse-action-plan-year-five",
    title: "EPA Water Reuse Action Plan Year Five Progress",
    publisher: "U.S. Environmental Protection Agency",
    date: "2025-03-01",
    type: "Action Plan",
    status: "In Review",
    url: "https://www.epa.gov/waterreuse/national-water-reuse-action-plan-annual-progress-updates",
    summary: "EPA's fifth annual progress update catalogs completed and ongoing collaborative outputs intended to advance water reuse.",
    findings: [
      "EPA has published five annual progress updates since the action plan launched.",
      "The year-five update records collaborative actions and program outputs.",
      "Detailed action status is maintained in a separate online platform.",
    ],
    limits: [
      "The update does not provide one national, metered water-reuse volume or a common reliability outcome.",
      "Action completion is not the same as completed infrastructure or delivered industrial water.",
    ],
    owner: "U.S. Environmental Protection Agency",
    sourceType: "Government Agency",
  },
  {
    portfolio: "infrastructure",
    slug: "epa-water-reuse-monitoring-practices-2024",
    title: "EPA Completed Water Reuse Action 5.2: Monitoring Practices",
    publisher: "U.S. Environmental Protection Agency",
    date: "2024-10-01",
    type: "Technical Report",
    url: "https://www.epa.gov/waterreuse/completed-wrap-action-summaries",
    summary: "EPA lists completed Action 5.2 on identifying water-quality monitoring practices for reuse applications, creating a measurement rail for later operating comparisons.",
    findings: [
      "Action 5.2 is listed as completed.",
      "The action addresses monitoring practices for reuse applications.",
      "EPA separates completed action summaries from the broader progress update.",
    ],
    limits: [
      "A monitoring-practice output does not report a facility's delivered volume, quality, uptime, or compliance.",
      "The page aggregates completed actions with different scopes and dates.",
    ],
    owner: "U.S. Environmental Protection Agency",
    sourceType: "Government Agency",
  },
  {
    portfolio: "infrastructure",
    slug: "usgs-mineral-commodity-summaries-2026",
    title: "USGS Mineral Commodity Summaries 2026",
    publisher: "U.S. Geological Survey",
    date: "2026-02-06",
    type: "Technical Report",
    url: "https://pubs.usgs.gov/publication/mcs2026",
    summary: "USGS provides 2025 production, trade, price, reserve, and import-reliance baselines for more than 90 nonfuel mineral commodities.",
    findings: [
      "The report covers more than 90 minerals and materials.",
      "It is the earliest comprehensive government source for 2025 mineral production data.",
      "The overview reports $112 billion in U.S. nonfuel mineral production and continued critical-mineral import reliance.",
    ],
    limits: [
      "National commodity data do not establish availability, price, inventory, or qualification at a named facility.",
      "Some domestic production values are withheld to protect proprietary data.",
    ],
    existingSourceId: "source-usgs-mineral-commodity-summaries",
  },
  {
    portfolio: "infrastructure",
    slug: "usgs-mcs-2026-data-release",
    title: "USGS Mineral Commodity Summaries 2026 Data Release",
    publisher: "U.S. Geological Survey",
    date: "2026-02-06",
    type: "Data Release",
    url: "https://data.usgs.gov/datacatalog/data/USGS%3A69837ec8b66b01367d7ec7d9",
    summary: "USGS publishes machine-readable 2025 U.S. salient statistics and world-production data extracted from the 2026 Mineral Commodity Summaries.",
    findings: [
      "The release exposes commodity-level U.S. salient statistics.",
      "It includes world-production tables and overview figures.",
      "The data package supports unit-specific analysis rather than a composite score.",
    ],
    limits: [
      "Commodity definitions, units, withheld values, and revision history must be preserved.",
      "World production and U.S. import reliance answer different questions.",
    ],
    owner: "U.S. Geological Survey National Minerals Information Center",
    sourceType: "Dataset",
    liveAccess: "Data Download",
  },
  {
    portfolio: "mobility_space",
    slug: "bts-air-travel-consumer-report-2024",
    title: "BTS Air Travel Consumer Report: Full Year 2024",
    publisher: "Bureau of Transportation Statistics",
    date: "2025-03-14",
    type: "Data Release",
    url: "https://www.bts.gov/newsroom/air-travel-consumer-report-december-2024-full-year-2024-numbers",
    summary: "BTS reports full-year 2024 airline operating and consumer-service data, including a 1.4 percent flight-cancellation rate.",
    findings: [
      "The full-year cancellation rate was 1.4 percent in 2024.",
      "The release covers on-time performance, baggage, wheelchairs and scooters, oversales, and complaints.",
      "BTS notes that statistics may be revised as source data are corrected.",
    ],
    limits: [
      "Airline metrics have distinct denominators and should not be collapsed into one service score.",
      "The report covers reporting carriers and specified consumer-service categories.",
    ],
    owner: "Bureau of Transportation Statistics",
    sourceType: "Government Agency",
  },
  {
    portfolio: "mobility_space",
    slug: "bts-airline-on-time-tables-2025",
    title: "BTS Annual Airline On-Time Tables Through 2025",
    publisher: "Bureau of Transportation Statistics",
    date: "2026-06-01",
    type: "Data Release",
    url: "https://www.bts.gov/topics/airline-time-tables",
    summary: "BTS publishes carrier and airport on-time tables with annual and monthly historical comparisons through 2025.",
    findings: [
      "The tables define on-time arrival as less than 15 minutes after schedule.",
      "Carrier and airport results are provided separately.",
      "Annual rankings are derived from year-to-date December tables.",
    ],
    limits: [
      "On-time performance alone does not measure accessibility, price, safety, baggage, or customer experience.",
      "Carrier and airport rankings have different units and operating contexts.",
    ],
    owner: "Bureau of Transportation Statistics",
    sourceType: "Dataset",
    liveAccess: "Interactive Portal",
  },
  {
    portfolio: "mobility_space",
    slug: "cpuc-av-quarterly-reporting-2026",
    title: "CPUC Autonomous Vehicle Quarterly Reporting Requirements",
    publisher: "California Public Utilities Commission",
    date: "2026-05-01",
    type: "Regulatory Decision",
    status: "In Review",
    url: "https://www.cpuc.ca.gov/regulatory-services/licensing/transportation-licensing-and-analysis-branch/autonomous-vehicle-programs/quarterly-reporting",
    summary: "CPUC requires autonomous passenger-service participants to report vehicle miles, passenger miles, deadhead miles, wait time, trips, accessibility, energy, and service-area data.",
    findings: [
      "The reporting framework requires quarterly per-vehicle and trip-level measures.",
      "Programs exceeding 300 passenger trips in a quarter face expanded reporting requirements.",
      "The framework distinguishes passenger service, pickup travel, dwell time, and accessibility fields.",
    ],
    limits: [
      "A reporting requirement is not a current public comparative rollup or a verified service outcome.",
      "Program, company, geography, and time-period differences must be controlled before comparison.",
    ],
    owner: "California Public Utilities Commission",
    sourceType: "Government Agency",
  },
  {
    portfolio: "mobility_space",
    slug: "california-dmv-av-test-miles-2025",
    title: "California DMV Autonomous Vehicle Test Miles for 2025",
    publisher: "California Department of Motor Vehicles",
    date: "2026-02-01",
    type: "Data Release",
    url: "https://www.dmv.ca.gov/portal/news-and-media/autonomous-vehicle-permit-holders-in-california-logged-more-than-9-million-test-miles-between-december-1-2024-and-november-30-2025/",
    summary: "California DMV reports more than nine million autonomous-vehicle test miles between December 1, 2024 and November 30, 2025.",
    findings: [
      "Permit holders reported more than nine million test miles in the 12-month period.",
      "The annual reporting rail also captures disengagements relevant to drivered testing.",
      "The record updates the prior 4.5-million-mile 2024 baseline.",
    ],
    limits: [
      "Testing miles are not passenger-service trips.",
      "Company-reported exposure and disengagement data are not designed for simple cross-company safety rankings.",
    ],
    owner: "California Department of Motor Vehicles",
    sourceType: "Government Agency",
  },
  {
    portfolio: "mobility_space",
    slug: "nhtsa-ads-crash-data-june-2026",
    title: "NHTSA ADS and Level 2 Crash Data Through June 2026",
    publisher: "National Highway Traffic Safety Administration",
    date: "2026-06-15",
    type: "Data Release",
    url: "https://www.nhtsa.gov/laws-regulations/standing-general-order-crash-reporting",
    summary: "NHTSA publishes incident data through June 15, 2026 under its third amended Standing General Order and explains duplicate, reporting, classification, exposure, and confidentiality limits.",
    findings: [
      "The current files cover incidents reported since June 16, 2025.",
      "NHTSA added same-incident and same-vehicle identifiers to improve review.",
      "The agency explicitly states that incident counts are not normalized by fleet size, miles, or operating domain.",
    ],
    limits: [
      "The files may contain duplicate, incomplete, corrected, or differently classified reports.",
      "Raw incident totals cannot support comparative safety rates without compatible exposure data.",
    ],
    existingSourceId: "source-nhtsa-sgo-crash-reporting",
  },
  {
    portfolio: "mobility_space",
    slug: "faa-one-thousand-commercial-space-operations-2025",
    title: "FAA Reaches 1,000 Licensed Commercial Space Operations",
    publisher: "Federal Aviation Administration",
    date: "2025-08-14",
    type: "Program Milestone",
    url: "https://www.faa.gov/newsroom/1000-commercial-space-operations",
    summary: "FAA reports that the 1,000th licensed or permitted commercial space operation occurred in August 2025; the first 500 took 32 years and the next 500 took four.",
    findings: [
      "FAA reached 1,000 licensed or permitted commercial space operations.",
      "The second 500 operations occurred over four years.",
      "The cumulative measure spans more than 35 years of launch and reentry activity.",
    ],
    limits: [
      "Cumulative operations combine different vehicles, missions, sites, and risk profiles.",
      "A licensed operation count does not establish mission success, cadence at one site, cost, safety rate, or local benefit.",
    ],
    owner: "Federal Aviation Administration",
    sourceType: "Government Agency",
  },
  {
    portfolio: "mobility_space",
    slug: "faa-fy2024-commercial-space-operations",
    title: "FAA Fiscal Year 2024 Commercial Space Operations",
    publisher: "Federal Aviation Administration",
    date: "2024-11-14",
    type: "Data Release",
    url: "https://www.faa.gov/newsroom/new-record-faa-licensed-commercial-space-operations-aerospace-rulemaking-committee",
    summary: "FAA reports a record 148 licensed commercial space operations in fiscal year 2024, more than 30 percent above the prior year.",
    findings: [
      "FAA recorded 148 licensed operations in fiscal year 2024.",
      "The annual count increased by more than 30 percent.",
      "FAA paired the operating result with work to update the Part 450 licensing rule.",
    ],
    limits: [
      "Licensed operation counts do not distinguish launch from reentry, mission type, success, anomaly, or site.",
      "A national count cannot establish Space Coast-specific utilization or local outcomes.",
    ],
    owner: "Federal Aviation Administration",
    sourceType: "Government Agency",
  },
  {
    portfolio: "mobility_space",
    slug: "nasa-space-operations-outcomes-2025",
    title: "NASA 2025 Space Operations Outcomes",
    publisher: "National Aeronautics and Space Administration",
    date: "2025-12-18",
    type: "Program Milestone",
    url: "https://www.nasa.gov/news-release/nasa-ignites-new-golden-age-of-exploration-innovation-in-2025/",
    summary: "NASA's 2025 operating recap reports 12 visiting spacecraft to the International Space Station, seven cargo missions delivering more than 50,000 pounds, and thousands of hours of research.",
    findings: [
      "Twelve spacecraft visited the station during 2025.",
      "Seven cargo missions delivered more than 50,000 pounds of supplies and science.",
      "Crew-9 participants completed more than 150 experiments and 900 research hours during their stay.",
    ],
    limits: [
      "Agency recap figures combine missions, crews, cargo, and research with different denominators.",
      "The record does not establish cost, comparative provider reliability, or Space Coast-local economic outcomes.",
    ],
    owner: "National Aeronautics and Space Administration",
    sourceType: "Government Agency",
  },
];

const sourceIdFor = (record) => record.existingSourceId ?? `source-55z-${record.slug}`;
const documentIdFor = (record) => `research-doc-55z-${record.slug}`;

const signals = [
  {
    portfolio: "ai_cyber",
    slug: "federal-ai-inventories-nearly-doubled-2024",
    title: "Selected federal AI inventories nearly doubled in 2024",
    status: "Published",
    records: ["gao-federal-generative-ai-use-2025"],
    date: "2025-07-29",
    topic: "AI for Science",
    type: "Market Signal",
    maturity: "Scaling",
    quality: "Audited or Verified Data",
    summary: "GAO found reported AI use cases across 11 selected agencies increased from 571 in 2023 to 1,110 in 2024, while generative-AI cases increased from 32 to 282.",
    why: "The federal AI pathway now has a measured adoption inventory and a clear boundary between disclosed use cases and realized operating outcomes.",
    dependencies: ["consistent inventory definitions", "maturity tracking", "impact assessments", "usage measures", "performance results"],
    constraints: ["Compute", "Cybersecurity", "Standards", "Data Quality", "Safety"],
    receiving: ["Federal agency operating systems"],
    implications: ["Inventory growth increases the number of systems requiring assurance, monitoring, and outcome disclosure."],
    gaps: ["gap-014", "gap-016"],
    boundary: "Publish as a disclosed-inventory trend. Do not translate use-case counts into productivity, mission benefit, or safety.",
    watch: "Track agency-level operational maturity, usage, impact assessments, incidents, corrective actions, and measured benefits.",
  },
  {
    portfolio: "ai_cyber",
    slug: "irs-ai-inventory-most-cases-not-yet-operational",
    title: "Most IRS AI inventory cases were still in development",
    status: "Published",
    records: ["gao-irs-ai-management-2026"],
    date: "2026-03-24",
    topic: "AI for Science",
    type: "Policy Signal",
    maturity: "Scaling",
    quality: "Audited or Verified Data",
    summary: "GAO found 126 active IRS AI use cases in June 2025, but 77 were categorized as in development and more than one-quarter lacked intended-benefit information.",
    why: "The record shows why inventory labels must be separated from operational maturity and realized benefit.",
    dependencies: ["inventory quality", "benefit definitions", "deployment gates", "monitoring", "lessons learned"],
    constraints: ["Compute", "Cybersecurity", "Standards", "Data Quality"],
    receiving: ["IRS operating and compliance systems"],
    implications: ["A large inventory can coexist with incomplete maturity and benefit data."],
    gaps: ["gap-014", "gap-016"],
    boundary: "Publish as an audited inventory-quality and maturity finding, not as a judgment on the effectiveness of IRS AI systems.",
    watch: "Track how many cases reach operation, disclose measured benefits, complete impact assessment, or are retired.",
  },
  {
    portfolio: "ai_cyber",
    slug: "federal-cdm-data-quality-requires-manual-correction",
    title: "Federal network-monitoring data quality still requires manual correction",
    status: "Published",
    records: ["gao-cdm-network-monitoring-2025"],
    date: "2025-06-11",
    topic: "Cybersecurity",
    type: "Security Signal",
    maturity: "Infrastructure",
    quality: "Audited or Verified Data",
    summary: "In GAO's 23-agency CDM review, four agencies said the program helped automate FISMA reporting while seven reported data-quality problems requiring manual corrections.",
    why: "The cybersecurity pathway now contains an operating-program result that distinguishes tool deployment from usable measurement.",
    dependencies: ["asset-data quality", "endpoint implementation", "cloud guidance", "common outcome metrics", "remediation tracking"],
    constraints: ["Cybersecurity", "Standards", "Data Quality", "Labor"],
    receiving: ["Federal civilian network-security programs"],
    implications: ["Measurement quality can become an operating constraint even after monitoring tools are deployed."],
    gaps: ["gap-016"],
    boundary: "Publish as a program implementation result. Do not infer equivalent security risk or exposure reduction across agencies.",
    watch: "Track data-quality remediation, endpoint coverage, cloud-asset visibility, KEV remediation time, incidents, and recovery outcomes.",
  },
  {
    portfolio: "ai_cyber",
    slug: "nasa-ai-use-cases-lack-comparable-outcome-measures",
    title: "NASA's active AI use cases lack comparable public outcome measures",
    status: "In Review",
    records: ["nasa-ai-use-cases-2024"],
    date: "2025-01-07",
    topic: "AI for Science",
    type: "Research Result",
    maturity: "Scaling",
    quality: "Primary Source",
    summary: "NASA identifies active AI uses in mission and science operations, but the reviewed overview does not disclose compatible accuracy, reliability, cost, incident, or mission-benefit measures.",
    why: "The record identifies a strong operating-use trail but not yet a comparable outcome trail.",
    dependencies: ["system-level metrics", "usage data", "mission baselines", "incident disclosure", "independent evaluation"],
    constraints: ["Compute", "Cybersecurity", "Standards", "Data Quality", "Safety"],
    receiving: ["NASA mission and science systems"],
    implications: ["Active mission use should be followed into system-specific performance and assurance records."],
    gaps: ["gap-014", "gap-016"],
    boundary: "Hold until NASA or an independent evaluator publishes system-level outcome measures with method, period, and denominator.",
    watch: "Track operational usage, accuracy, availability, human override, anomaly, mission benefit, and corrective-action records.",
  },
  {
    portfolio: "manufacturing",
    slug: "mep-fy2024-client-reported-manufacturing-outcomes",
    title: "MEP clients report FY 2024 sales, savings, investment, and job outcomes",
    status: "Published",
    records: ["nist-mep-fy2024-network-results", "nist-mep-fy2024-client-challenges"],
    date: "2025-03-20",
    topic: "Advanced Manufacturing",
    type: "Market Signal",
    maturity: "Scaling",
    quality: "Official Data",
    summary: "NIST reports third-party survey estimates from 8,771 MEP clients: $15 billion in new or retained sales, $5 billion in investment, $2.6 billion in savings, and more than 108,300 jobs created or retained.",
    why: "The manufacturing pathway now contains a large, method-described client-outcome dataset rather than only funding and training capacity.",
    dependencies: ["survey continuity", "response-rate disclosure", "firm-level validation", "sector breakdowns", "longitudinal follow-up"],
    constraints: ["Manufacturing", "Labor", "Data Quality", "Unit Economics"],
    receiving: ["Small and medium-sized U.S. manufacturers"],
    implications: ["Outcome fields can be tracked separately without combining unlike dollar and job measures."],
    gaps: ["gap-003", "gap-016"],
    boundary: "Publish with client-attribution and survey-method labels. Do not treat the figures as audited causal effects.",
    watch: "Track survey response, sector and region splits, productivity measures, repeated-client effects, and independent validation.",
  },
  {
    portfolio: "manufacturing",
    slug: "manufacturing-usa-engagements-need-completion-denominators",
    title: "Manufacturing USA engagement totals need completion denominators",
    status: "In Review",
    records: ["manufacturing-usa-report-to-congress-2025", "niimbl-annual-report-2023-2024"],
    date: "2026-03-17",
    topic: "Advanced Manufacturing",
    type: "Policy Signal",
    maturity: "Scaling",
    quality: "Primary Source",
    summary: "Manufacturing USA reports more than 150,000 workforce engagements and NIIMBL reports more than 6,800 professionals and students reached, but neither aggregate supplies one common completion, credential, placement, or retention denominator.",
    why: "The network has scale evidence, but not yet a comparable workforce-conversion outcome.",
    dependencies: ["participant definitions", "completion rates", "credential records", "placement", "retention", "wage and productivity outcomes"],
    constraints: ["Manufacturing", "Labor", "Standards", "Data Quality"],
    receiving: ["Advanced-manufacturing workforce systems"],
    implications: ["Engagement totals should remain separate from completed and durable workforce outcomes."],
    gaps: ["gap-003", "gap-016"],
    boundary: "Hold as an outcome signal until network and institute measures disclose compatible denominators and follow-up periods.",
    watch: "Track completions, credentials, placement, retention, wages, vacancy reduction, and employer productivity.",
  },
  {
    portfolio: "manufacturing",
    slug: "niimbl-biomanufacturing-program-delivers-47-graduates",
    title: "NIIMBL biomanufacturing program delivers 47 trained graduates",
    status: "Published",
    records: ["niimbl-door-to-floor-training-outcomes"],
    date: "2025-01-01",
    topic: "Advanced Manufacturing",
    type: "Research Result",
    maturity: "Pilot Program",
    quality: "Primary Source",
    summary: "NIIMBL reports 47 graduates completed more than 100 hours of cGMP and regulatory training, exceeding the program target of 40.",
    why: "The workforce pathway gains a named completion result with a defined curriculum and target.",
    dependencies: ["placement denominator", "retention follow-up", "wage outcomes", "employer performance", "replication"],
    constraints: ["Manufacturing", "Labor", "Standards", "Data Quality"],
    receiving: ["Biopharmaceutical manufacturing employers"],
    implications: ["The record advances from participation into completion but not yet durable placement or productivity."],
    gaps: ["gap-003", "gap-016"],
    boundary: "Publish as a program completion result. Do not claim a placement rate or national workforce effect.",
    watch: "Track placement, retention, wages, time-to-competency, employer onboarding costs, and replication.",
  },
  {
    portfolio: "manufacturing",
    slug: "arizona-mep-amphenol-reports-932k-savings",
    title: "Arizona MEP Amphenol projects report $932,000 in savings",
    status: "Published",
    records: ["nist-amphenol-arizona-mep-results-2026"],
    date: "2026-01-13",
    topic: "Advanced Manufacturing",
    type: "Research Result",
    maturity: "Scaling",
    quality: "Company Claim",
    summary: "NIST's success record reports $932,000 in savings across eight Lean Green Belt projects, 24 retained jobs, and a documented 60-day quality-control project at Amphenol Aerospace in Mesa.",
    why: "The Arizona manufacturing trail gains a facility-level outcome with a defined intervention and measured project window.",
    dependencies: ["method disclosure", "independent validation", "repeat measurement", "scrap-rate denominator", "production impact"],
    constraints: ["Manufacturing", "Labor", "Data Quality", "Unit Economics"],
    receiving: ["Amphenol Aerospace Mesa operations"],
    implications: ["Facility-level operating evidence can complement regional workforce-capacity records."],
    gaps: ["gap-003", "gap-016"],
    boundary: "Publish as company- and program-attributed results, not as an independent causal estimate or regional benchmark.",
    watch: "Track repeat savings, scrap rate, throughput, quality, staffing, and independent verification.",
  },
  {
    portfolio: "infrastructure",
    slug: "us-customer-outage-duration-eleven-hours-2024",
    title: "U.S. customers averaged 11 hours of power interruptions in 2024",
    status: "Published",
    records: ["eia-us-outage-duration-2024"],
    date: "2025-12-01",
    topic: "Energy",
    type: "Climate Signal",
    maturity: "Infrastructure",
    quality: "Official Data",
    summary: "EIA reports average U.S. customer interruption duration of 11 hours in 2024, with major events accounting for 80 percent of the duration.",
    why: "The grid pathway gains a delivered-service outcome that separates major-event and ordinary interruption performance.",
    dependencies: ["state and utility breakdowns", "major-event definitions", "restoration performance", "hardening measures", "customer-class impacts"],
    constraints: ["Power", "Infrastructure", "Weather", "Data Quality"],
    receiving: ["U.S. electricity customers"],
    implications: ["Capacity additions must be assessed alongside delivered reliability and restoration."],
    gaps: ["gap-001", "gap-008", "gap-016"],
    boundary: "Publish as a national average with major-event attribution. Do not apply it to a specific utility or customer.",
    watch: "Track state, utility, customer-class, major-event, restoration, and non-major-event reliability measures.",
  },
  {
    portfolio: "infrastructure",
    slug: "texas-batteries-provide-frequency-response-2024",
    title: "Texas batteries provide material frequency-response service",
    status: "Published",
    records: ["nerc-state-of-reliability-2025", "eia-battery-storage-market-trends-2026"],
    date: "2025-06-12",
    topic: "Energy",
    type: "Deployment",
    maturity: "Infrastructure",
    quality: "Audited or Verified Data",
    summary: "NERC reports Texas battery capacity reached 10,027 MW by December 2024 and that batteries supplied up to all frequency-regulation capacity in several instances and more than 70 percent of response in individual disturbances.",
    why: "The storage pathway advances from installed capacity into a measured grid service.",
    dependencies: ["continued event analysis", "duration and state-of-charge data", "availability", "market performance", "long-run reliability"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    receiving: ["Texas bulk-power system"],
    implications: ["Operating contribution can be distinguished from nameplate capacity."],
    gaps: ["gap-001", "gap-008", "gap-016"],
    boundary: "Publish as NERC's initial Texas operating evidence. Do not generalize the result to all regions or storage designs.",
    watch: "Track frequency events, availability, duration, state of charge, market concentration, failures, and regional replication.",
  },
  {
    portfolio: "infrastructure",
    slug: "us-mineral-production-and-import-reliance-2025",
    title: "U.S. mineral production rises while critical import reliance persists",
    status: "Published",
    records: ["usgs-mineral-commodity-summaries-2026", "usgs-mcs-2026-data-release"],
    date: "2026-02-06",
    topic: "Critical Minerals",
    type: "Supply Chain Shift",
    maturity: "Commodity",
    quality: "Official Data",
    summary: "USGS reports $112 billion in U.S. nonfuel mineral production in 2025, up 5.6 percent, while China remained a major source for 14 of the 33 critical minerals on which the United States was most import reliant.",
    why: "The minerals pathway gains a current production-value and import-reliance baseline without implying facility-level supply security.",
    dependencies: ["commodity-level units", "domestic processing", "trade flows", "qualified output", "customer inventory", "price and disruption data"],
    constraints: ["Materials", "Supply Chain", "Geopolitics", "Data Quality"],
    receiving: ["U.S. mineral-reliant industries"],
    implications: ["Higher production value and persistent import reliance can coexist."],
    gaps: ["gap-007", "gap-016"],
    boundary: "Publish as national commodity data. Do not convert production value into physical supply security or facility availability.",
    watch: "Track commodity-level output, refining, trade, prices, qualification, inventory, substitution, recycling, and disruption.",
  },
  {
    portfolio: "infrastructure",
    slug: "water-reuse-year-five-lacks-national-operating-volume",
    title: "Water-reuse progress still lacks a national operating-volume denominator",
    status: "In Review",
    records: ["epa-water-reuse-action-plan-year-five", "epa-water-reuse-monitoring-practices-2024"],
    date: "2025-03-01",
    topic: "Water",
    type: "Policy Signal",
    maturity: "Infrastructure",
    quality: "Primary Source",
    summary: "EPA's year-five update and completed monitoring-practices action document program outputs but do not supply a common national metered reuse volume, uptime, quality, or industrial delivery measure.",
    why: "The water pathway gains a national measurement rail while preserving the gap to operating performance.",
    dependencies: ["metered volumes", "end-use categories", "quality and compliance", "uptime", "project completion", "industrial delivery"],
    constraints: ["Water", "Infrastructure", "Standards", "Data Quality"],
    receiving: ["Municipal and industrial water-reuse systems"],
    implications: ["Completed policy actions should be followed into project and operating data."],
    gaps: ["gap-002", "gap-016"],
    boundary: "Hold until compatible national or project-level operating measures are available.",
    watch: "Track project completion, accepted capacity, metered reuse, industrial allocation, quality, compliance, uptime, and drought performance.",
  },
  {
    portfolio: "mobility_space",
    slug: "us-airline-cancellation-rate-2024",
    title: "U.S. reporting airlines cancelled 1.4 percent of flights in 2024",
    status: "Published",
    records: ["bts-air-travel-consumer-report-2024", "bts-airline-on-time-tables-2025"],
    date: "2025-03-14",
    topic: "Aviation",
    type: "Market Signal",
    maturity: "Commodity",
    quality: "Official Data",
    summary: "BTS reports a 1.4 percent cancellation rate for reporting airlines in 2024, compared with 1.3 percent in 2023.",
    why: "The aviation portfolio gains a standardized delivered-service metric with a defined denominator and revision policy.",
    dependencies: ["carrier and airport context", "weather attribution", "accessibility measures", "consumer complaints", "schedule data"],
    constraints: ["Infrastructure", "Weather", "Data Quality", "Public Trust"],
    receiving: ["U.S. airline passengers and airports"],
    implications: ["Service reliability can be tracked without conflating it with safety, price, or accessibility."],
    gaps: ["gap-016"],
    boundary: "Publish as the BTS reporting-carrier cancellation rate. Do not treat it as a complete airline-service score.",
    watch: "Track on-time performance, cancellations, accessibility handling, baggage, complaints, carrier, airport, and weather context.",
  },
  {
    portfolio: "mobility_space",
    slug: "california-av-testing-exceeds-nine-million-miles-2025",
    title: "California AV testing exceeds nine million miles in the 2025 reporting year",
    status: "Published",
    records: ["california-dmv-av-test-miles-2025", "nhtsa-ads-crash-data-june-2026"],
    date: "2026-02-01",
    topic: "Mobility",
    type: "Deployment",
    maturity: "Field Trial",
    quality: "Official Data",
    summary: "California DMV reports more than nine million autonomous-vehicle test miles from December 2024 through November 2025, while NHTSA's current crash files remain explicitly unnormalized by exposure.",
    why: "The autonomy pathway gains a newer exposure measure and a clear rule against raw incident-count comparisons.",
    dependencies: ["company and mode breakdowns", "service miles", "fleet size", "operating domain", "normalized incidents", "data quality"],
    constraints: ["Regulation", "Safety", "Data Quality", "Public Trust"],
    receiving: ["California road-testing and oversight systems"],
    implications: ["Exposure growth strengthens the need for compatible service and safety denominators."],
    gaps: ["gap-015", "gap-016"],
    boundary: "Publish as reported testing exposure. Do not restate as passenger service or comparative safety.",
    watch: "Track service trips, paid miles, deadhead, fleet, domain, incidents, duplicates, accessibility, cost, and local effects.",
  },
  {
    portfolio: "mobility_space",
    slug: "faa-reaches-one-thousand-commercial-space-operations",
    title: "FAA reaches 1,000 licensed commercial space operations",
    status: "Published",
    records: ["faa-one-thousand-commercial-space-operations-2025", "faa-fy2024-commercial-space-operations"],
    date: "2025-08-14",
    topic: "Space",
    type: "Deployment",
    maturity: "Scaling",
    quality: "Official Data",
    summary: "FAA reached 1,000 licensed or permitted commercial space operations in August 2025 after reporting a record 148 operations in fiscal year 2024.",
    why: "The space pathway gains cumulative and annual operating-cadence records beyond site plans and environmental decisions.",
    dependencies: ["operation type", "site", "mission outcome", "anomalies", "licensing cycle time", "local infrastructure and effects"],
    constraints: ["Regulation", "Certification", "Safety", "Infrastructure", "Data Quality"],
    receiving: ["U.S. commercial space launch and reentry system"],
    implications: ["National cadence can serve as an operating comparator while local site outcomes remain separate."],
    gaps: ["gap-013", "gap-016"],
    boundary: "Publish as FAA operation counts. Do not infer mission success, site-specific cadence, safety rate, cost, or local benefit.",
    watch: "Track launch versus reentry, site, vehicle, license, success, anomaly, delay, environmental compliance, and local utilization.",
  },
  {
    portfolio: "mobility_space",
    slug: "cpuc-av-reporting-needs-public-comparable-rollup",
    title: "CPUC AV reporting requires a comparable public operating rollup",
    status: "In Review",
    records: ["cpuc-av-quarterly-reporting-2026"],
    date: "2026-05-01",
    topic: "Mobility",
    type: "Policy Signal",
    maturity: "Early Commercial",
    quality: "Regulatory Filing",
    summary: "CPUC requires detailed passenger-service, mileage, dwell, accessibility, energy, and trip reporting, but the reviewed reporting page does not provide one current comparable public rollup across operators and programs.",
    why: "The regulatory rail identifies the exact service measures needed to move beyond authorization and test-mile evidence.",
    dependencies: ["public data release", "common definitions", "operator coverage", "period alignment", "quality controls", "accessible formats"],
    constraints: ["Regulation", "Safety", "Data Quality", "Public Trust"],
    receiving: ["California autonomous passenger-service oversight"],
    implications: ["The field definitions can anchor later trip, utilization, accessibility, and deadhead analysis."],
    gaps: ["gap-015", "gap-016"],
    boundary: "Hold until a current public dataset supports compatible operator- and program-level analysis.",
    watch: "Track public releases for trips, paid and deadhead miles, fleet, wait time, accessibility, energy, incidents, and service geography.",
  },
];

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yamlString = (value) => JSON.stringify(value);
const yamlArray = (values, indent = "") => values.map((value) => `${indent}  - ${yamlString(value)}`).join("\n");
const addUnique = (items) => [...new Set(items)];

for (const directory of [
  "sources",
  "signals",
  "research-documents",
  "research-collections",
  "briefings",
  "evidence-gaps",
  "dependency-maps",
  "updates",
]) {
  await mkdir(join(contentRoot, directory), { recursive: true });
}
await mkdir(join(appRoot, "src", "data"), { recursive: true });

for (const record of records) {
  if (record.existingSourceId) continue;
  const defaults = portfolioDefaults[record.portfolio];
  const source = {
    id: sourceIdFor(record),
    name: record.title,
    url: record.url,
    source_type: record.sourceType ?? "Government Agency",
    credibility_level: record.credibility ?? "Tier 1",
    primary_topics: record.topics ?? defaults.topics,
    framework_layers: record.layers ?? defaults.layers,
    country_or_region: record.country ?? defaults.country,
    update_frequency: record.frequency ?? "Annual or event-driven",
    capture_priority: "High",
    known_limitations: record.limits.join(" "),
    last_checked_date: capturedDate,
    watch_lanes: record.watchLanes ?? defaults.watchLanes,
    live_access_type: record.liveAccess ?? (record.type === "Data Release" ? "Data Download" : "Report Series"),
    review_cadence_days: 90,
    monitoring_status: "Active",
    coverage_role: record.coverage ?? defaults.coverage,
    jurisdiction: record.country ?? defaults.country,
    source_owner: record.owner ?? record.publisher,
    notes: `Phase 55Z comparative operating-outcome record for ${defaults.label}.`,
  };
  if (source.live_access_type === "Data Download") source.data_download_url = record.url;
  await writeFile(join(contentRoot, "sources", `${source.id}.json`), json(source), "utf8");
}

for (const [index, record] of records.entries()) {
  const defaults = portfolioDefaults[record.portfolio];
  const number = String(131 + index).padStart(3, "0");
  const document = {
    id: documentIdFor(record),
    collection_id: collectionId,
    title: record.title,
    slug: `55z-${record.slug}`,
    record_status: record.status ?? "Published",
    publisher: record.publisher,
    publication_date: record.date,
    document_type: record.type,
    summary: record.summary,
    key_findings: record.findings,
    why_it_matters: `This record advances ${defaults.label.toLowerCase()} from upstream activity into a named operating, measurement, or explicit comparison-boundary record.`,
    ftfn_relevance: [
      `Adds one of eight Phase 55Z records for ${defaults.label.toLowerCase()}.`,
      "Keeps unit, period, geography, and method attached to the reported result.",
      "Identifies the next record needed before any cross-system comparison.",
    ],
    evidence_limits: record.limits,
    primary_topics: record.topics ?? defaults.topics,
    framework_layers: record.layers ?? defaults.layers,
    constraint_tags: record.constraints ?? defaults.constraints,
    source_id: sourceIdFor(record),
    official_url: record.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-${record.slug}.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-${record.slug}.txt`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  };
  await writeFile(join(contentRoot, "research-documents", `${number}-55z-${record.slug}.json`), json(document), "utf8");
}

const recordBySlug = new Map(records.map((record) => [record.slug, record]));
for (const signal of signals) {
  const sourceIds = signal.records.map((slug) => sourceIdFor(recordBySlug.get(slug)));
  const body = `---
id: "signal-${signal.slug}"
title: ${yamlString(signal.title)}
slug: "${signal.slug}"
record_status: "${signal.status}"
summary: ${yamlString(signal.summary)}
source_ids:
${yamlArray(sourceIds)}
published_date: ${signal.date}
captured_date: ${capturedDate}
primary_topic: "${signal.topic}"
framework_layers:
${yamlArray(portfolioDefaults[signal.portfolio].layers)}
signal_type: "${signal.type}"
maturity_level: "${signal.maturity}"
time_horizon: "Now"
evidence_quality: "${signal.quality}"
verification_status: "Verified Against Primary Source"
why_it_matters: ${yamlString(signal.why)}
dependencies:
${yamlArray(signal.dependencies)}
constraints:
${yamlArray(signal.constraints)}
receiving_systems:
${yamlArray(signal.receiving)}
local_implications:
${yamlArray(signal.implications)}
evidence_gap_ids:
${yamlArray(signal.gaps)}
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${yamlString(signal.boundary)}
---

## Evidence Stage

${signal.summary}

## Boundary

${signal.boundary}

## What To Watch Next

${signal.watch}
`;
  await writeFile(join(contentRoot, "signals", `signal-${signal.slug}.mdx`), body, "utf8");
}

const promotedSignals = signals.filter((signal) => signal.status === "Published").map((signal) => `signal-${signal.slug}`);
const heldSignals = signals.filter((signal) => signal.status === "In Review").map((signal) => `signal-${signal.slug}`);
const publishedDocuments = records.filter((record) => (record.status ?? "Published") === "Published").map(documentIdFor);
const heldDocuments = records.filter((record) => record.status === "In Review").map(documentIdFor);

const collection = {
  id: collectionId,
  title: "Comparative Operating Outcomes, 2023-2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Thirty-two official records establish bounded operating-outcome trails across institutional AI and cybersecurity, manufacturing, infrastructure, and mobility, aviation, and space.",
  scope: "Phase 55Z adds eight records and four signals per portfolio. Twelve signals publish measured or audited outcomes with their original units and denominators; four remain In Review because they report active use, engagement, program progress, or reporting requirements without compatible operating outcomes.",
  captured_date: capturedDate,
  document_ids: records.map(documentIdFor),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 35-file archive contains 32 official-link records, consolidated FTFN summaries, a README, and a SHA-256 manifest. Four records remain explicitly In Review.",
  method_note: "No composite score or ranking is created. Counts, percentages, dollars, hours, miles, megawatts, participants, jobs, missions, and program stages retain their own units, periods, geographies, methods, and attribution.",
};
await writeFile(join(contentRoot, "research-collections", `${collectionSlug}.json`), json(collection), "utf8");

const briefing = `---
id: "briefing-research-watch-004-comparative-operating-outcomes"
title: "Research Watch 004: Comparative Operating Outcomes"
slug: "research-watch-004-comparative-operating-outcomes"
record_status: "Published"
summary: "A four-portfolio synthesis of what can be measured now, what cannot be compared yet, and which denominator closes each outcome trail."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlArray(signals.map((signal) => `signal-${signal.slug}`))}
evidence_gap_ids:
  - "gap-003"
  - "gap-007"
  - "gap-013"
  - "gap-014"
  - "gap-015"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "Operating evidence becomes useful only when the unit, denominator, period, geography, method, and attribution travel with the number."
  - "Federal AI inventories are growing faster than public disclosure of realized benefits, incidents, and corrective actions."
  - "Manufacturing records now include completions and facility outcomes, while engagement totals still lack common workforce-conversion denominators."
  - "Grid, storage, mineral, and water records answer different operating questions and cannot support one infrastructure score."
  - "Aviation, road automation, and space operations have usable exposure and service measures, but their safety and performance denominators remain system-specific."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Labor"
  - "Infrastructure"
  - "Safety"
  - "Unit Economics"
what_to_watch_next:
  - "Institution-level AI usage, performance, impact-assessment, incident, and corrective-action records."
  - "Training completion, credential, placement, retention, wage, vacancy, quality, throughput, and productivity records."
  - "Utility, storage, water, and mineral measures that preserve asset, commodity, customer, period, and unit."
  - "Passenger-service, airline, launch, reentry, mission, anomaly, accessibility, and local-outcome records with compatible exposure."
---

## The comparison gate

Phase 55Z does not create a leaderboard. It creates a stricter comparison gate: two records can be compared only when their unit, denominator, period, geography, method, and attribution are compatible.

## AI and cybersecurity

Federal AI inventories now show rapid adoption, but most public records still describe use cases, acquisition, or intended benefits rather than measured operating results. Cybersecurity audits provide stronger implementation measures, yet tool deployment and program maturity remain distinct from incident prevention, detection, recovery, and harm.

## Manufacturing

MEP, Manufacturing USA, and institute records expose multiple outcome layers: participants, completions, projects, products, sales, savings, investment, jobs, and facility-level quality improvements. Those measures are valuable when kept separate. Engagement is not completion, completion is not placement, and attributed savings are not an audited regional productivity effect.

## Infrastructure

EIA and NERC now connect storage capacity to a measured frequency-response contribution, while national outage duration shows the receiving-system result customers experience. USGS supplies commodity production and import-reliance baselines. EPA supplies a water-reuse measurement rail but not yet a national operating-volume denominator.

## Mobility, aviation, and space

BTS supplies a standardized airline service denominator; DMV supplies road-testing exposure; NHTSA explains why raw incident totals cannot be ranked; CPUC defines the passenger-service measures needed next; and FAA supplies national commercial-space operating cadence. These records belong in one outcome portfolio but not one score.
`;
await writeFile(join(contentRoot, "briefings", "briefing-research-watch-004-comparative-operating-outcomes.mdx"), briefing, "utf8");

const gap016 = {
  id: "gap-016",
  title: "Comparable operating-outcome denominators across frontier systems",
  slug: "gap-016-comparable-operating-outcome-denominators",
  status: "Source Added",
  priority: "High",
  local_system: "Cross-system",
  primary_topic: "Policy and Standards",
  framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Frontier Domains", "Human Systems"],
  constraint_tags: ["Standards", "Data Quality", "Unit Economics", "Safety", "Public Trust"],
  question: "Which records make operating outcomes comparable without erasing differences in unit, denominator, period, geography, method, or attribution?",
  why_it_matters: "Counts and rates become misleading when activities, populations, assets, or reporting regimes differ. A comparison layer must preserve the original measurement contract.",
  current_support: "Phase 55Z adds 32 official records and sixteen bounded signals covering inventories, cyber implementation, manufacturing outcomes, grid reliability, storage services, water measurement, mineral statistics, airline service, AV exposure, and commercial-space cadence.",
  missing_evidence: [
    "shared data dictionaries within each operating domain",
    "compatible denominators and follow-up periods",
    "quality, revision, and missing-data controls",
    "independent validation for attributed outcomes",
    "asset-, customer-, operator-, and geography-level breakdowns",
    "outcome measures connected to incidents, cost, accessibility, reliability, and local effects",
  ],
  likely_source_types: [
    "official statistical release",
    "regulatory operating report",
    "audited program evaluation",
    "operator performance filing",
    "machine-readable dataset with methodology",
  ],
  candidate_records: [
    "agency AI performance and impact-assessment releases",
    "workforce completion, placement, retention, and employer-result data",
    "utility, storage, water, and commodity operating datasets",
    "carrier, AV operator, launch, reentry, mission, and anomaly data",
  ],
  next_action: "Build within-domain comparison tables only after two or more records share compatible units, denominators, periods, geographies, methods, and attribution.",
  future_data_model_need: ["Dataset", "Project", "Policy or Regulation"],
  related_source_ids: addUnique(records.map(sourceIdFor)),
  related_signal_ids: signals.map((signal) => `signal-${signal.slug}`),
  related_local_system_ids: [],
  latest_review: {
    phase: "Phase 55Z",
    decision: "Source Added",
    review_date: capturedDate,
    named_records: [
      "GAO Generative AI Use and Management at Federal Agencies",
      "NIST MEP National Network FY 2024 Results",
      "NERC 2025 State of Reliability Overview",
      "BTS Air Travel Consumer Report: Full Year 2024",
    ],
    stage_result: "The corpus now has outcome records in four portfolios and a machine-readable publication ledger. Cross-portfolio ranking remains unsupported.",
    stop_rule: "Do not combine unlike units or rank systems whose denominators, periods, geographies, methods, or attribution differ.",
  },
  notes: "Phase 55Z establishes the comparison contract before any score, benchmark, or leaderboard is considered.",
};
await writeFile(join(contentRoot, "evidence-gaps", "gap-016.json"), json(gap016), "utf8");

const map = {
  id: "dependency-map-comparative-outcomes-require-common-denominators",
  title: "Comparative outcomes require common denominators",
  slug: "comparative-outcomes-require-common-denominators",
  summary: "An evidence-gap map showing how operating records become comparable only after unit, denominator, period, geography, method, and attribution align.",
  map_type: "Evidence Gap Map",
  record_status: "Published",
  primary_topic: "Policy and Standards",
  framework_layers: ["Resource Foundations", "Enabling Infrastructure", "Frontier Domains", "Human Systems"],
  constraint_tags: ["Standards", "Data Quality", "Unit Economics", "Safety", "Public Trust"],
  map_question: "When can operating records support a comparison, and when must they remain parallel evidence trails?",
  interpretation_boundary: "The map is a comparison protocol, not a score. It does not rank AI, cybersecurity, manufacturing, infrastructure, mobility, aviation, or space systems.",
  source_ids: addUnique(records.map(sourceIdFor)),
  signal_ids: signals
    .filter((signal) => signal.status === "Published")
    .map((signal) => `signal-${signal.slug}`),
  technology_ids: [],
  local_system_ids: [],
  evidence_gap_ids: ["gap-016"],
  nodes: [
    { id: "node-ai", label: "AI and cyber outcomes", node_type: "Signal", record_id: "signal-federal-ai-inventories-nearly-doubled-2024", note: "Inventory, maturity, implementation, incident, and benefit measures remain distinct." },
    { id: "node-manufacturing", label: "Manufacturing outcomes", node_type: "Signal", record_id: "signal-mep-fy2024-client-reported-manufacturing-outcomes", note: "Participation, completion, placement, sales, savings, jobs, quality, and productivity use different denominators." },
    { id: "node-infrastructure", label: "Infrastructure outcomes", node_type: "Signal", record_id: "signal-us-customer-outage-duration-eleven-hours-2024", note: "Capacity, service, reliability, commodity, and water measures answer different questions." },
    { id: "node-mobility", label: "Mobility and mission outcomes", node_type: "Signal", record_id: "signal-us-airline-cancellation-rate-2024", note: "Trips, flights, miles, incidents, operations, missions, and cargo must retain system context." },
    { id: "node-unit", label: "Unit and denominator", node_type: "Constraint", note: "The quantity and population or exposure base must match." },
    { id: "node-context", label: "Period, geography, and method", node_type: "Constraint", note: "Records must cover compatible time, place, scope, and collection rules." },
    { id: "node-attribution", label: "Attribution and validation", node_type: "Constraint", note: "Official, audited, company-attributed, and modeled results must remain labeled." },
    { id: "node-gap", label: "Comparable outcome evidence", node_type: "Evidence Gap", record_id: "gap-016", note: "Comparison begins only after the measurement contracts align." },
  ],
  links: [
    { from: "node-ai", to: "node-unit", relationship: "Constrained By", confidence: "Supported", note: "Use-case counts do not share a denominator with mission or productivity outcomes." },
    { from: "node-manufacturing", to: "node-unit", relationship: "Constrained By", confidence: "Supported", note: "Engagements, graduates, jobs, dollars, and quality measures are not interchangeable." },
    { from: "node-infrastructure", to: "node-context", relationship: "Constrained By", confidence: "Supported", note: "Grid, water, storage, and mineral results differ by asset, customer, commodity, region, and period." },
    { from: "node-mobility", to: "node-context", relationship: "Constrained By", confidence: "Supported", note: "Road, airline, and space operating systems use different reporting regimes." },
    { from: "node-unit", to: "node-gap", relationship: "Limited By", confidence: "Missing Evidence", note: "Compatible denominators are incomplete in several portfolios." },
    { from: "node-context", to: "node-gap", relationship: "Limited By", confidence: "Missing Evidence", note: "Periods, geographies, and methods are not consistently aligned." },
    { from: "node-attribution", to: "node-gap", relationship: "Limited By", confidence: "Watch", note: "Attributed results require validation before causal interpretation." },
  ],
  what_this_map_supports: [
    "FTFN can publish bounded outcome records while preserving their original measurement contracts.",
    "Within-domain comparisons may proceed when unit, denominator, period, geography, method, and attribution align.",
    "Explicit holds identify where activity or reporting structure has not become a comparable outcome.",
  ],
  what_this_map_does_not_prove: [
    "It does not create a cross-portfolio score or ranking.",
    "It does not equate activity, capacity, exposure, service, reliability, safety, cost, or local benefit.",
    "It does not convert company-attributed results into audited causal effects.",
  ],
  next_records_needed: [
    "Machine-readable data dictionaries and revision histories.",
    "Compatible within-domain denominators and follow-up periods.",
    "Independent validation and quality controls.",
    "Asset-, customer-, operator-, commodity-, and geography-level outcome records.",
  ],
};
await writeFile(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), json(map), "utf8");

const update = {
  id: "update-2026-07-24-phase-55z-comparative-operating-outcomes",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 55Z adds comparative operating-outcome portfolios",
  summary: "FTFN adds 32 official records, sixteen bounded signals, Research Watch 004, a comparison-protocol map, and an explicit evidence gap preventing incompatible rankings.",
  affected_record_ids: [
    collectionId,
    "briefing-research-watch-004-comparative-operating-outcomes",
    "dependency-map-comparative-outcomes-require-common-denominators",
    "gap-016",
    ...signals.map((signal) => `signal-${signal.slug}`),
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-004-comparative-operating-outcomes/",
    "/atlas/dependency-maps/comparative-outcomes-require-common-denominators/",
    "/atlas/evidence-gaps/gap-016-comparable-operating-outcome-denominators/",
  ],
  evidence_note: "Twelve signals publish with explicit units, periods, geography, method, and attribution. Four remain In Review because they report activity or reporting structure without a compatible operating outcome.",
  work_package: "docs/work-packages/phase-55z-comparative-operating-outcomes.md",
};
await writeFile(join(contentRoot, "updates", "2026-07-24-phase-55z-comparative-operating-outcomes.json"), json(update), "utf8");

const review = {
  phase: "55Z",
  reviewed_date: capturedDate,
  portfolio_count: 4,
  primary_record_count: records.length,
  signal_decisions: {
    reviewed: signals.length,
    promoted: promotedSignals,
    held: heldSignals,
  },
  document_decisions: {
    reviewed: records.length,
    published: publishedDocuments,
    held: heldDocuments,
  },
  portfolio_records: Object.fromEntries(
    Object.keys(portfolioDefaults).map((portfolio) => [
      portfolio,
      records.filter((record) => record.portfolio === portfolio).map(documentIdFor),
    ]),
  ),
  comparison_rule: "No comparison or ranking is permitted unless unit, denominator, period, geography, method, and attribution are compatible.",
};
await writeFile(join(appRoot, "src", "data", "phase-55z-publication-review.json"), json(review), "utf8");

console.log(`Generated Phase 55Z: ${records.length} research records, ${signals.length} signals, ${records.filter((record) => !record.existingSourceId).length} new source profiles.`);
