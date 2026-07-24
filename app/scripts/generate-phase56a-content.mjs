import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionSlug = "longitudinal-operating-series-2020-2025";
const collectionId = `research-collection-${collectionSlug}`;

const portfolioDefaults = {
  ai_cyber: {
    label: "institutional AI and cybersecurity system performance",
    topics: ["AI for Science", "Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Cybersecurity", "Standards", "Data Quality", "Safety", "Public Trust"],
    watchLanes: ["Cross-Cutting Official Rails", "Security and Standards"],
    receiving: ["Federal agency operating systems"],
  },
  manufacturing: {
    label: "manufacturing cohort and facility production",
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Labor", "Supply Chain", "Data Quality", "Unit Economics"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    receiving: ["U.S. manufacturing establishments and workforce programs"],
  },
  infrastructure: {
    label: "asset-level grid, water, storage, and mineral performance",
    topics: ["Energy", "Water", "Critical Minerals"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Water", "Materials", "Infrastructure", "Data Quality", "Weather"],
    watchLanes: ["Power and Grid", "Water", "Critical Minerals"],
    receiving: ["U.S. infrastructure operators, customers, and industrial users"],
  },
  mobility_space: {
    label: "carrier, operator, and mission service outcomes",
    topics: ["Mobility", "Aviation", "Space"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Regulation", "Certification", "Safety", "Infrastructure", "Data Quality", "Public Trust"],
    watchLanes: ["Mobility Certification", "Space", "Cross-Cutting Official Rails"],
    receiving: ["U.S. passengers, road users, launch operators, and mission systems"],
  },
};

const series = [
  {
    portfolio: "ai_cyber",
    key: "fisma-reporting",
    title: "Federal FISMA reporting",
    publisher: "Executive Office of the President, Office of Management and Budget",
    type: "Annual Report",
    topic: "Cybersecurity",
    method: "Annual agency reporting under FISMA, compiled by OMB.",
    denominator: "Federal civilian executive-branch agencies and reported federal information systems, as defined for each fiscal year.",
    geography: "United States federal government",
    attribution: "Agency-reported and OMB-compiled",
    signalTitle: "FISMA reporting shows broader defensive-measure adoption while methods continue to evolve",
    signalSummary: "The FY 2021 through FY 2023 FISMA reports form a recurring federal cybersecurity series. The FY 2023 report says 96 percent of civilian executive-branch agencies increased their Detect-category score from FY 2022, while the reporting program continued shifting toward automated, outcome-focused measures.",
    signalBoundary: "Publish as an OMB reporting-series result. Changes in metrics, automation, agency scope, and scoring prevent a simple multi-year incident or effectiveness trend.",
    signalWatch: "Track stable measures for detection coverage, event logging, remediation time, incidents, recovery, affected people, and reporting-method changes.",
    entries: [
      {
        slug: "omb-fisma-fy2021",
        label: "Fiscal Year 2021",
        date: "2022-09-30",
        url: "https://www.whitehouse.gov/wp-content/uploads/2022/09/FY2021-FISMA-Report-to-Congress.pdf",
        metric: "OMB reported seven major incidents in FY 2021 and documented the federal response to SolarWinds and other material events.",
        context: "The report establishes the pre-automation baseline for this three-report series.",
      },
      {
        slug: "omb-fisma-fy2022",
        label: "Fiscal Year 2022",
        date: "2023-05-01",
        url: "https://www.whitehouse.gov/wp-content/uploads/2023/05/FY22-FISMA-Report.pdf",
        metric: "OMB's FY 2022 report documents a new Core and Supplemental inspector-general metric cycle and continued movement toward outcome-focused measures.",
        context: "The reporting framework changed in FY 2022, so the method break remains attached to the observation.",
      },
      {
        slug: "omb-fisma-fy2023",
        label: "Fiscal Year 2023",
        date: "2024-06-01",
        url: "https://www.whitehouse.gov/wp-content/uploads/2024/06/FY23-FISMA-Report.pdf",
        metric: "OMB reported that 96 percent of civilian executive-branch agencies increased their Detect-category score compared with FY 2022.",
        context: "The report also documents a Metrics Subcommittee and continued changes to automated measurement.",
      },
    ],
  },
  {
    portfolio: "ai_cyber",
    key: "gao-cyber-backlog",
    title: "GAO federal cybersecurity oversight",
    publisher: "U.S. Government Accountability Office",
    type: "Oversight Report",
    topic: "Cybersecurity",
    method: "GAO synthesis of federal cybersecurity oversight work and recommendation status.",
    denominator: "The recommendation universe and challenge area stated in each GAO report.",
    geography: "United States federal government",
    attribution: "Independent federal audit and oversight",
    signalTitle: "GAO continued to report a material federal cybersecurity recommendation backlog",
    signalSummary: "GAO reported about 900 open cybersecurity recommendations in November 2021, nearly 21 percent of 712 recommendations open in one federal-systems challenge area in December 2022, and 567 of 1,610 recommendations open across four challenge areas in May 2024.",
    signalBoundary: "Publish the persistence of a material backlog, not a numeric improvement rate. The recommendation universes and challenge-area scopes differ across the three reports.",
    signalWatch: "Track a stable recommendation cohort, implementation dates, verified closure, recurrence, incident exposure, and the scope of each GAO synthesis.",
    entries: [
      {
        slug: "gao-solarwinds-exchange-response-2022",
        label: "January 2022 response review",
        date: "2022-01-13",
        url: "https://www.gao.gov/products/gao-22-104746",
        metric: "GAO reported that about 900 federal cybersecurity recommendations remained open as of November 2021.",
        context: "The review focuses on the federal response to the SolarWinds and Microsoft Exchange incidents.",
      },
      {
        slug: "gao-federal-systems-high-risk-2023",
        label: "January 2023 high-risk review",
        date: "2023-01-31",
        url: "https://www.gao.gov/products/gao-23-106428",
        metric: "GAO reported that nearly 21 percent of 712 recommendations in the securing-federal-systems challenge area remained unimplemented in December 2022.",
        context: "This denominator covers one of the four major federal cybersecurity challenge areas.",
      },
      {
        slug: "gao-cyber-high-risk-2024",
        label: "June 2024 high-risk review",
        date: "2024-06-13",
        url: "https://www.gao.gov/products/gao-24-107231",
        metric: "GAO reported 567 of 1,610 recommendations across four cybersecurity challenge areas remained unimplemented as of May 2024.",
        context: "The expanded scope is not directly comparable with the narrower 2023 denominator.",
      },
    ],
  },
  {
    portfolio: "ai_cyber",
    key: "fisma-effectiveness",
    title: "Civilian-agency FISMA effectiveness",
    publisher: "U.S. Government Accountability Office",
    type: "Oversight Report",
    topic: "Cybersecurity",
    method: "GAO review of agency self-assessments, inspector-general determinations, and federal FISMA metrics.",
    denominator: "Twenty-three civilian executive-branch agencies.",
    geography: "United States federal government",
    attribution: "Inspector-general assessments synthesized by GAO",
    signalTitle: "A majority of reviewed civilian agencies remained below the FISMA effectiveness threshold",
    signalSummary: "GAO reported 16 of 23 reviewed civilian agencies ineffective for FY 2020 and 15 of 23 ineffective for FY 2022. The two compatible snapshots show persistence, but not enough evidence for a durable improvement trend.",
    signalBoundary: "Publish as two compatible inspector-general snapshots with an explicit two-point caveat. Binary effectiveness does not represent equivalent risk, exposure, or operating performance across agencies.",
    signalWatch: "Track the same 23-agency denominator, framework-version changes, function-level maturity, incidents, remediation, and verified effectiveness in later fiscal years.",
    entries: [
      {
        slug: "gao-fisma-effectiveness-fy2020",
        label: "Fiscal Year 2020",
        date: "2022-01-11",
        url: "https://www.gao.gov/products/gao-22-105637",
        metric: "Inspectors general rated 16 of 23 reviewed civilian-agency information-security programs ineffective for FY 2020.",
        context: "Seventeen of 23 agencies also did not fully meet their cybersecurity targets.",
      },
      {
        slug: "gao-fisma-implementation-2022",
        label: "Government-wide implementation review",
        date: "2022-09-29",
        url: "https://www.gao.gov/products/gao-22-104364",
        metric: "GAO's full implementation review documented inconsistent agency performance and weaknesses in government-wide initiatives.",
        context: "This report carries the FY 2020 effectiveness baseline into a completed audit.",
      },
      {
        slug: "gao-fisma-effectiveness-fy2022",
        label: "Fiscal Year 2022",
        date: "2024-01-09",
        url: "https://www.gao.gov/products/gao-24-106291",
        metric: "Inspectors general rated 15 of 23 reviewed civilian-agency information-security programs ineffective for FY 2022.",
        context: "GAO called for measures better linked to goals, risk, workforce, and agency size.",
      },
    ],
  },
  {
    portfolio: "ai_cyber",
    key: "nasa-ai-inventory",
    title: "NASA public AI-use inventory",
    publisher: "National Aeronautics and Space Administration",
    type: "Agency Inventory",
    topic: "AI for Science",
    method: "Annual agency disclosure of identified AI use cases.",
    denominator: "NASA use cases included under the federal inventory definition in each reporting year.",
    geography: "United States federal civil-space program",
    attribution: "NASA agency disclosure",
    signalTitle: "NASA maintained an annual public AI-use inventory across three reporting cycles",
    signalSummary: "NASA's 2022, 2023, and 2024 public AI-use records provide recurring visibility into agency applications and governance. They establish disclosure continuity, but the inventories do not provide one stable denominator for realized mission benefit, reliability, incidents, or cost.",
    signalBoundary: "Publish the continuity of annual disclosure. Do not describe inventory entries as deployed systems or convert named use cases into an adoption, productivity, or safety trend.",
    signalWatch: "Track stable inclusion rules, maturity, operational usage, accuracy, availability, human override, incidents, impact assessments, cost, and mission outcomes.",
    entries: [
      {
        slug: "nasa-ai-use-cases-2022",
        label: "2022 inventory",
        date: "2023-01-31",
        url: "https://www.nasa.gov/organizations/ocio/dt/ai/",
        metric: "NASA's responsible-AI program preserved the 2022 inventory cycle as part of its public governance record.",
        context: "The official program landing page is retained because older inventory routes can move.",
        hold: true,
      },
      {
        slug: "nasa-ai-use-cases-2023",
        label: "2023 inventory",
        date: "2024-01-31",
        url: "https://www.nasa.gov/organizations/ocio/dt/ai/",
        metric: "NASA continued annual public disclosure of agency AI use cases and responsible-AI governance.",
        context: "The inventory describes applications rather than a common performance result.",
      },
      {
        slug: "nasa-ai-use-cases-2024",
        label: "2024 inventory",
        date: "2025-01-07",
        url: "https://www.nasa.gov/organizations/ocio/dt/ai/2024-ai-use-cases/",
        metric: "NASA identified active uses spanning autonomous exploration, navigation, science analysis, and mission operations.",
        context: "Active-use labels do not establish comparable benefit, reliability, or safety outcomes.",
      },
    ],
  },
  {
    portfolio: "manufacturing",
    key: "mep-national-impact",
    title: "NIST MEP National Network impact",
    publisher: "National Institute of Standards and Technology",
    type: "Annual Report",
    topic: "Advanced Manufacturing",
    method: "Third-party survey of MEP clients reporting attributed sales, savings, investment, and jobs.",
    denominator: "Responding MEP client establishments in the stated fiscal year.",
    geography: "United States",
    attribution: "Client-reported outcomes attributed to MEP assistance",
    signalTitle: "MEP annual client surveys preserve a repeatable national manufacturing-outcome rail",
    signalSummary: "MEP's FY 2021 and FY 2022 reports use the same broad third-party client-survey contract and report sales, savings, investment, and jobs. FY 2022 reported $18.8 billion in sales, $2.5 billion in savings, $6.4 billion in investment, and 116,700 jobs created or retained.",
    signalBoundary: "Publish as client-reported, program-attributed annual outcomes. Do not treat year-to-year movement as audited causality or a manufacturing-sector productivity trend; response mix and follow-up timing can change.",
    signalWatch: "Track respondent counts, response rates, survey window, repeated clients, sector mix, real-dollar adjustment, jobs methodology, and independent evaluation.",
    entries: [
      {
        slug: "nist-mep-impact-fy2021",
        label: "Fiscal Year 2021",
        date: "2023-03-27",
        url: "https://www.nist.gov/system/files/documents/2023/03/27/MEP%20Annual%20Report_FY21_WEB_FINAL_3_27_2023.pdf",
        metric: "MEP reported $14.4 billion in new and retained sales, $1.5 billion in cost savings, and 125,746 jobs created or retained.",
        context: "The program interacted with 34,307 U.S. manufacturers in FY 2021.",
      },
      {
        slug: "nist-mep-impact-fy2022",
        label: "Fiscal Year 2022",
        date: "2024-08-15",
        url: "https://www.nist.gov/system/files/documents/2024/08/15/MEP%20Annual%20Report_FY22_508.pdf",
        metric: "MEP reported $18.8 billion in sales, $2.5 billion in savings, $6.4 billion in investment, and 116,700 jobs created or retained.",
        context: "The report says the network interacted with more than 33,500 U.S. manufacturers.",
      },
      {
        slug: "nist-mep-impact-fy2023",
        label: "Fiscal Year 2024",
        date: "2025-03-20",
        url: "https://www.nist.gov/system/files/documents/2025/03/20/NIST%20MEP-%20About%20the%20MEPNN%20508-2.pdf",
        metric: "MEP reported $15.0 billion in sales, $2.6 billion in cost savings, $5.0 billion in investment, and 108,300 jobs created or retained.",
        context: "The FY 2024 network fact sheet reports 8,771 clients and 11,734 survey responses; the skipped FY 2023 observation remains visible.",
      },
    ],
  },
  {
    portfolio: "manufacturing",
    key: "manufacturing-usa",
    title: "Manufacturing USA network reporting",
    publisher: "National Institute of Standards and Technology",
    type: "Program Report",
    topic: "Advanced Manufacturing",
    method: "Network reporting on institute membership, projects, technology development, and workforce activity.",
    denominator: "Manufacturing USA institutes and member organizations covered by each report.",
    geography: "United States",
    attribution: "Institute and network administrative reporting",
    signalTitle: "Manufacturing USA maintained recurring network-wide project and workforce reporting",
    signalSummary: "Manufacturing USA reports covering FY 2020 through FY 2022 provide recurring network evidence on institutes, member organizations, technology projects, and workforce activity. The series is useful for program scale but does not supply one stable completion or production denominator.",
    signalBoundary: "Publish as recurring network activity reporting. Do not convert members, projects, participants, products, or workforce engagements into a single manufacturing outcome trend.",
    signalWatch: "Track stable institute coverage, project starts and completions, technology transfer, credentials, placements, production adoption, follow-up periods, and facility results.",
    entries: [
      {
        slug: "manufacturing-usa-highlights-fy2020",
        label: "Fiscal Year 2020 activities",
        date: "2021-02-25",
        url: "https://www.nist.gov/publications/manufacturing-usa-20192020-highlights-report",
        metric: "The network reported institute responses, technology work, and workforce activity during the FY 2020 period.",
        context: "Pandemic-response activity makes this period structurally unusual.",
      },
      {
        slug: "manufacturing-usa-highlights-fy2021",
        label: "Fiscal Year 2021 activities",
        date: "2022-10-19",
        url: "https://www.nist.gov/publications/manufacturing-usa-highlights-report-2022",
        metric: "The highlights report continued network-wide reporting on technology innovation and workforce development.",
        context: "Publication title and covered fiscal year differ, so the covered period is preserved explicitly.",
      },
      {
        slug: "manufacturing-usa-annual-fy2022",
        label: "Fiscal Year 2022 activities",
        date: "2024-04-15",
        url: "https://www.nist.gov/publications/manufacturing-usa-2023-annual-report",
        metric: "The report covers projects involving 17 institutes and about 2,500 member organizations during FY 2022.",
        context: "Administrative network totals are not facility-level production outcomes.",
      },
    ],
  },
  {
    portfolio: "manufacturing",
    key: "niimbl-annual",
    title: "NIIMBL annual program reporting",
    publisher: "National Institute for Innovation in Manufacturing Biopharmaceuticals",
    type: "Annual Report",
    topic: "Advanced Manufacturing",
    method: "Institute annual reporting on projects, membership, workforce, and biomanufacturing activity.",
    denominator: "NIIMBL members, projects, and programs covered in each annual report.",
    geography: "United States",
    attribution: "Institute administrative reporting",
    signalTitle: "NIIMBL annual reports provide a repeatable biomanufacturing program record",
    signalSummary: "Three NIIMBL annual-report cycles preserve a program-level record of membership, projects, workforce activity, and technology work. The reports support institutional continuity, while project and participant definitions must be checked before measuring change.",
    signalBoundary: "Publish as an institute reporting series. Do not infer facility productivity, commercial output, workforce placement, or national biomanufacturing capacity from program totals.",
    signalWatch: "Track stable project definitions, starts, completions, products, technology transfer, training completion, placement, retention, facility adoption, and production outcomes.",
    entries: [
      {
        slug: "niimbl-annual-2021-2022",
        label: "2021-2022 report",
        date: "2022-12-31",
        url: "https://www.niimbl.org/about/",
        metric: "The institute reported its member, project, and workforce portfolio for the 2021-2022 cycle.",
        context: "A direct stable report file was not identified during capture.",
        hold: true,
      },
      {
        slug: "niimbl-annual-2022-2023",
        label: "2022-2023 report",
        date: "2023-12-31",
        url: "https://www.niimbl.org/about/",
        metric: "The institute continued annual reporting on biomanufacturing technology and workforce programs.",
        context: "Program categories require a crosswalk before year-to-year totals are compared.",
      },
      {
        slug: "niimbl-annual-2023-2024",
        label: "2023-2024 report",
        date: "2024-12-31",
        url: "https://www.niimbl.org/about/",
        metric: "The institute's latest reviewed annual cycle extends the program record through 2024.",
        context: "The report is a program portfolio, not a facility production series.",
      },
    ],
  },
  {
    portfolio: "manufacturing",
    key: "census-asm",
    title: "Census manufacturing-establishment data transition",
    publisher: "U.S. Census Bureau",
    type: "Official Statistics",
    topic: "Advanced Manufacturing",
    method: "Official Census program releases documenting the final ASM observation and the transition to the Annual Integrated Economic Survey.",
    denominator: "The manufacturing-establishment universe and program scope stated in each Census release.",
    geography: "United States",
    attribution: "Official statistical estimate",
    signalTitle: "The Annual Survey of Manufactures ends after 2021 and creates an explicit series break",
    signalSummary: "Census identifies 2021 as the final Annual Survey of Manufactures survey year, documents the program's discontinuation, and shifts the former ASM collection into the Annual Integrated Economic Survey beginning in 2024.",
    signalBoundary: "Publish the program transition as a series break. Do not manufacture 2022 or 2023 ASM observations or join AIES estimates to ASM without a Census crosswalk, compatible definitions, and revision treatment.",
    signalWatch: "Track the first AIES manufacturing release, crosswalks, revised historical tables, sampling and nonsampling error, NAICS changes, real-dollar conversion, and geographic comparability.",
    entries: [
      {
        slug: "census-asm-2021",
        label: "Final 2021 survey year",
        date: "2023-05-31",
        url: "https://www.census.gov/programs-surveys/asm.html",
        metric: "Census published the 2021 Annual Survey of Manufactures and identifies it as the final ASM survey year.",
        context: "The final observation retains ASM sampling, revision, industry, and pandemic-period context.",
      },
      {
        slug: "census-asm-discontinuation",
        label: "ASM discontinuation notice",
        date: "2023-06-14",
        url: "https://www.census.gov/programs-surveys/asm/news-and-updates/updates.html",
        metric: "Census states that ASM was discontinued after the 2021 survey year and data collection ended in late 2022.",
        context: "No 2022 ASM annual observation should be inferred from the collection end date.",
      },
      {
        slug: "census-aies-transition-2024",
        label: "AIES collection transition",
        date: "2024-03-01",
        url: "https://www.census.gov/programs-surveys/aies.html",
        metric: "Census moved the data formerly collected in ASM into the Annual Integrated Economic Survey, which began data collection in March 2024.",
        context: "AIES is a successor program, not a definitionally identical 2022 or 2023 ASM release.",
      },
    ],
  },
  {
    portfolio: "infrastructure",
    key: "eia-battery-capacity",
    title: "U.S. utility-scale battery capacity",
    publisher: "U.S. Energy Information Administration",
    type: "Official Statistics",
    topic: "Energy",
    method: "EIA survey and operating-generator data for utility-scale battery storage.",
    denominator: "Operating U.S. utility-scale battery storage capacity at the stated date.",
    geography: "United States",
    attribution: "Official statistical estimate",
    signalTitle: "U.S. utility-scale battery power capacity accelerated from 2021 through 2023",
    signalSummary: "EIA reported 4,605 MW of utility-scale battery capacity at the end of 2021, about 7.8 GW operating in October 2022, and 15,814 MW across 575 batteries at the end of 2023.",
    signalBoundary: "Publish as a power-capacity series with date and survey scope attached. Power capacity is not stored energy, duration, availability, dispatch, reliability contribution, safety, or customer service.",
    signalWatch: "Track final revised capacity, energy capacity, duration, commissioning dates, retirements, availability, dispatch, market service, failures, and regional concentration.",
    entries: [
      {
        slug: "eia-battery-capacity-2021",
        label: "End of 2021",
        date: "2022-04-12",
        url: "https://www.eia.gov/todayinenergy/detail.php?id=51798",
        metric: "EIA reported 4,605 MW of U.S. utility-scale battery storage capacity at the end of 2021.",
        context: "The measure is operating power capacity, not energy duration.",
      },
      {
        slug: "eia-battery-capacity-2022",
        label: "October 2022",
        date: "2022-10-26",
        url: "https://www.eia.gov/todayinenergy/detail.php?id=54939",
        metric: "EIA reported 7.8 GW of utility-scale battery storage operating in October 2022.",
        context: "The observation date differs from the year-end points and included an expected year-end addition.",
      },
      {
        slug: "eia-battery-capacity-2023",
        label: "End of 2023",
        date: "2024-03-25",
        url: "https://www.eia.gov/todayinenergy/detail.php?id=62405",
        metric: "EIA reported 575 operating batteries with 15,814 MW of utility-scale power capacity at the end of 2023.",
        context: "Facility count and power capacity are separate measures.",
      },
    ],
  },
  {
    portfolio: "infrastructure",
    key: "eia-outage-duration",
    title: "U.S. customer electricity interruption duration",
    publisher: "U.S. Energy Information Administration",
    type: "Official Statistics",
    topic: "Energy",
    method: "EIA-861 utility reporting summarized as average annual customer interruption duration.",
    denominator: "U.S. electricity customers represented in the EIA-861 reliability data.",
    geography: "United States",
    attribution: "Utility-reported official statistics",
    signalTitle: "Major events continue to dominate movement in national outage-duration averages",
    signalSummary: "EIA's annual reliability releases distinguish interruption duration with and without major events. The 2022 average was 5.6 hours per customer including major events, nearly two hours lower than 2021, while the excluding-major-events measure remained near two hours.",
    signalBoundary: "Publish as national customer-average duration with major-event treatment explicit. A national average does not establish one utility's performance, restoration quality, customer harm, or resilience.",
    signalWatch: "Track final EIA-861 revisions, state and utility distributions, major-event definitions, customer class, frequency, restoration time, momentary events, and weather attribution.",
    entries: [
      {
        slug: "eia-outage-duration-2021",
        label: "Calendar Year 2021",
        date: "2022-11-14",
        url: "https://www.eia.gov/todayinenergy/detail.php?id=54639",
        metric: "EIA's 2021 release records elevated national interruption duration when major events are included.",
        context: "Major-event and non-major-event values must remain separate.",
      },
      {
        slug: "eia-outage-duration-2022",
        label: "Calendar Year 2022",
        date: "2023-11-08",
        url: "https://www.eia.gov/todayinenergy/detail.php?id=61303",
        metric: "EIA reported 5.6 hours of average interruption duration per customer including major events, nearly two hours lower than 2021.",
        context: "Excluding major events, the national average remained near two hours.",
      },
      {
        slug: "eia-outage-duration-2023",
        label: "Calendar Year 2023",
        date: "2024-12-01",
        url: "https://www.eia.gov/electricity/annual/",
        metric: "EIA's annual electricity data extend the customer interruption-duration series through 2023.",
        context: "The annual table and methodology are retained where a stable Today in Energy article was not identified.",
      },
    ],
  },
  {
    portfolio: "infrastructure",
    key: "epa-water-reuse",
    title: "National Water Reuse Action Plan progress",
    publisher: "U.S. Environmental Protection Agency",
    type: "Progress Report",
    topic: "Water",
    method: "Annual federal and partner reporting on WRAP actions and milestones.",
    denominator: "Actions and partner activities included in each WRAP annual progress update.",
    geography: "United States",
    attribution: "EPA and partner administrative reporting",
    signalTitle: "EPA sustained an annual water-reuse implementation record without a national operating-volume denominator",
    signalSummary: "WRAP year-two, year-three, and year-four progress updates preserve a recurring national implementation record. They document actions and partner activity but do not supply one compatible national series for metered reuse volume, quality, uptime, or industrial delivery.",
    signalBoundary: "Publish the continuity and limits of the policy series. Do not describe action counts or milestones as growth in operating reuse capacity or delivered water.",
    signalWatch: "Track completed projects, accepted capacity, metered volumes, end uses, industrial allocation, quality, compliance, uptime, costs, drought performance, and definition changes.",
    entries: [
      {
        slug: "epa-water-reuse-year-two",
        label: "Year Two progress update",
        date: "2022-03-01",
        url: "https://www.epa.gov/waterreuse/national-water-reuse-action-plan-annual-progress-updates",
        metric: "EPA's year-two update documented WRAP actions and partner activity.",
        context: "The update does not provide one national operating-volume denominator.",
        hold: true,
      },
      {
        slug: "epa-water-reuse-year-three",
        label: "Year Three progress update",
        date: "2023-03-01",
        url: "https://www.epa.gov/waterreuse/national-water-reuse-action-plan-annual-progress-updates",
        metric: "EPA's year-three update continued annual reporting on reuse actions and milestones.",
        context: "Action status is not equivalent to project completion or delivered water.",
      },
      {
        slug: "epa-water-reuse-year-four",
        label: "Year Four progress update",
        date: "2024-03-01",
        url: "https://www.epa.gov/waterreuse/national-water-reuse-action-plan-annual-progress-updates",
        metric: "EPA's year-four update extended the national implementation record.",
        context: "The reporting rail still requires metered operating outcomes.",
      },
    ],
  },
  {
    portfolio: "infrastructure",
    key: "usgs-mineral-production",
    title: "USGS Mineral Commodity Summaries",
    publisher: "U.S. Geological Survey",
    type: "Official Statistics",
    topic: "Critical Minerals",
    method: "Annual USGS commodity surveys, estimates, trade data, and methodological notes.",
    denominator: "Nonfuel mineral commodities and U.S. production covered in each annual edition.",
    geography: "United States with international trade context",
    attribution: "Official statistical estimate",
    signalTitle: "U.S. nonfuel mineral production value rose while commodity-level import exposure persisted",
    signalSummary: "The 2023, 2024, and 2025 Mineral Commodity Summaries maintain an annual commodity-by-commodity record of production, trade, and import reliance. The 2024 edition reported $105 billion in 2023 U.S. nonfuel mineral production value.",
    signalBoundary: "Publish as annual commodity statistics. Nominal value is not physical output, refining capacity, qualified supply, price resilience, inventory, or facility availability; commodity definitions and withheld values can change.",
    signalWatch: "Track revised commodity tables, physical quantity, real value, mine and processing capacity, trade, price, import reliance, withheld data, qualification, substitution, recycling, and disruptions.",
    entries: [
      {
        slug: "usgs-mcs-2023",
        label: "2023 edition",
        date: "2023-01-31",
        url: "https://www.usgs.gov/publications/mineral-commodity-summaries-2023",
        metric: "The 2023 edition provides the annual U.S. commodity baseline for 2022 production and trade conditions.",
        context: "Commodity tables retain their original physical and value units.",
      },
      {
        slug: "usgs-mcs-2024",
        label: "2024 edition",
        date: "2024-01-31",
        url: "https://www.usgs.gov/publications/mineral-commodity-summaries-2024",
        metric: "USGS reported $105 billion in U.S. nonfuel mineral production value for 2023.",
        context: "Nominal production value cannot be read as physical supply growth.",
      },
      {
        slug: "usgs-mcs-2025",
        label: "2025 edition",
        date: "2025-01-31",
        url: "https://www.usgs.gov/publications/mineral-commodity-summaries-2025",
        metric: "The 2025 edition extends the annual commodity, trade, and import-reliance record.",
        context: "Individual commodity methods and withheld data govern comparison.",
      },
    ],
  },
  {
    portfolio: "mobility_space",
    key: "air-travel-consumer",
    title: "Air Travel Consumer Report",
    publisher: "U.S. Department of Transportation",
    type: "Official Statistics",
    topic: "Aviation",
    method: "Monthly and annual reporting-carrier service-quality data compiled by DOT and BTS.",
    denominator: "Scheduled domestic flights and other reporting-carrier service records covered by the stated release.",
    geography: "United States",
    attribution: "Carrier-reported official statistics",
    signalTitle: "DOT's air-travel reports preserve a comparable annual carrier-service rail",
    signalSummary: "The 2022, 2023, and 2024 Air Travel Consumer Report shelves preserve recurring flight cancellation, on-time, baggage, complaint, and accessibility measures. The 2024 full-year cancellation rate was 1.4 percent versus 1.3 percent in 2023.",
    signalBoundary: "Publish individual measures with the reporting-carrier denominator and revision date attached. Do not combine service reliability, complaints, baggage, accessibility, price, or safety into one carrier score.",
    signalWatch: "Track revised tables, reporting-carrier coverage, flights operated, cancellations, delay causes, complaints, accessibility, baggage, airport mix, and weather.",
    entries: [
      {
        slug: "dot-atcr-2022",
        label: "2022 report shelf",
        date: "2023-03-01",
        url: "https://www.transportation.gov/individuals/aviation-consumer-protection/air-travel-consumer-reports-2022",
        metric: "DOT's 2022 shelf provides the recurring monthly service-quality reports and underlying measure definitions.",
        context: "Monthly releases and later revisions must be aligned before annual comparison.",
      },
      {
        slug: "dot-atcr-2023",
        label: "2023 report shelf",
        date: "2024-03-01",
        url: "https://www.transportation.gov/resources/individuals/aviation-consumer-protection/air-travel-consumer-reports-2023",
        metric: "DOT's 2023 shelf continues the reporting-carrier service-quality series.",
        context: "Carrier coverage and publication lag travel with the annual measures.",
      },
      {
        slug: "dot-atcr-2024",
        label: "2024 report shelf",
        date: "2025-03-14",
        url: "https://www.transportation.gov/resources/individuals/aviation-consumer-protection/air-travel-consumer-reports-2024",
        metric: "BTS reported a 1.4 percent cancellation rate for reporting airlines in 2024, compared with 1.3 percent in 2023.",
        context: "Cancellation rate is one service measure, not a complete carrier outcome.",
      },
    ],
  },
  {
    portfolio: "mobility_space",
    key: "california-av-miles",
    title: "California autonomous-vehicle public-road testing",
    publisher: "California Department of Motor Vehicles",
    type: "Regulatory Data",
    topic: "Mobility",
    method: "Annual permit-holder reports of autonomous-mode public-road testing miles and disengagements.",
    denominator: "Reported autonomous-mode public-road testing miles in California under DMV testing permits.",
    geography: "California, United States",
    attribution: "Permit-holder regulatory reporting",
    signalTitle: "California AV public-road testing exposure rose sharply and then contracted",
    signalSummary: "DMV reported about 5.7 million autonomous-mode public-road test miles in the 2021-2022 period, 9,068,861 miles in 2022-2023, and 4,498,066 miles in 2023-2024.",
    signalBoundary: "Publish as reported testing exposure, with safety-driver and driverless modes separated where available. Testing miles are not passenger service, deployment, normalized safety, technological capability, or a company ranking.",
    signalWatch: "Track permit-holder exits and entries, mode, public versus private testing, operating domain, service miles, fleet, incidents, reporting-rule changes, and the 2025 series break.",
    entries: [
      {
        slug: "california-av-testing-2021-2022",
        label: "2021-2022 reporting period",
        date: "2023-02-01",
        url: "https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/disengagement-reports/",
        metric: "The later DMV release implies about 5.7 million miles in the 2021-2022 comparison period.",
        context: "The value is derived from DMV's stated 3.3-million-mile increase to 9,068,861 miles.",
      },
      {
        slug: "california-av-testing-2022-2023",
        label: "2022-2023 reporting period",
        date: "2024-02-02",
        url: "https://www.dmv.ca.gov/portal/news-and-media/news-releases/autonomous-vehicle-permit-holders-report-a-record-9-million-test-miles-in-california-in-12-months/",
        metric: "Permit holders reported 9,068,861 autonomous-mode public-road test miles: 5,801,069 with a safety driver and 3,267,792 driverless.",
        context: "DMV states that disengagement reports are not intended to compare companies or establish technological capability.",
      },
      {
        slug: "california-av-testing-2023-2024",
        label: "2023-2024 reporting period",
        date: "2025-01-31",
        url: "https://www.dmv.ca.gov/portal/news-and-media/over-4-million-test-miles-logged-by-autonomous-vehicle-permit-holders-in-california/",
        metric: "Permit holders reported 4,498,066 autonomous-mode public-road test miles, including 552,895 driverless miles.",
        context: "Nine reporting companies had ceased testing and withdrawn from the program.",
      },
    ],
  },
  {
    portfolio: "mobility_space",
    key: "faa-commercial-space",
    title: "FAA licensed commercial space operations",
    publisher: "Federal Aviation Administration",
    type: "Agency Performance Report",
    topic: "Space",
    method: "FAA annual count of licensed commercial launch and reentry operations.",
    denominator: "Licensed U.S. commercial space operations recorded by FAA in the stated fiscal year.",
    geography: "United States",
    attribution: "FAA administrative count",
    signalTitle: "FAA licensed commercial space operations increased across three fiscal years",
    signalSummary: "FAA's FY 2025 Agency Financial Report gives a consistent annual series of 74 licensed commercial space operations in FY 2022, 113 in FY 2023, and 148 in FY 2024.",
    signalBoundary: "Publish as national licensed-operation counts. The series does not distinguish launch from reentry, site, vehicle, mission success, anomaly, payload, cost, delay, environmental compliance, or local benefit.",
    signalWatch: "Track final revised counts, launch versus reentry, site, vehicle, license, success, anomaly, delay, mission type, payload, closure duration, and local operating outcomes.",
    entries: [
      {
        slug: "faa-commercial-space-operations-fy2022",
        label: "Fiscal Year 2022",
        date: "2022-09-30",
        url: "https://www.faa.gov/about/office_org/headquarters_offices/afn/offices/finance/offices/financial_management/ar/fy25-faa-agency-financial-report.pdf",
        metric: "FAA's historical series records 74 licensed commercial space operations in FY 2022.",
        context: "The later financial report is the reviewed source for the comparable historical series.",
      },
      {
        slug: "faa-commercial-space-operations-fy2023",
        label: "Fiscal Year 2023",
        date: "2023-09-30",
        url: "https://www.faa.gov/about/office_org/headquarters_offices/afn/offices/finance/offices/financial_management/ar/fy25-faa-agency-financial-report.pdf",
        metric: "FAA's historical series records 113 licensed commercial space operations in FY 2023.",
        context: "Operation type and mission result are not included in the headline count.",
      },
      {
        slug: "faa-commercial-space-operations-fy2024",
        label: "Fiscal Year 2024",
        date: "2024-09-30",
        url: "https://www.faa.gov/about/office_org/headquarters_offices/afn/offices/finance/offices/financial_management/ar/fy25-faa-agency-financial-report.pdf",
        metric: "FAA's historical series records 148 licensed commercial space operations in FY 2024.",
        context: "The count is national and cannot establish Space Coast-local utilization.",
      },
    ],
  },
  {
    portfolio: "mobility_space",
    key: "president-aerospace-report",
    title: "Aeronautics and Space Report of the President",
    publisher: "National Aeronautics and Space Administration",
    type: "Annual Report",
    topic: "Space",
    method: "Annual federal-department and agency reporting with historical launch and budget appendices.",
    denominator: "Federal aerospace activities and appendix measures included in the stated fiscal-year report.",
    geography: "United States",
    attribution: "Federal department and agency reporting coordinated by NASA",
    signalTitle: "The President's aerospace reports maintain an annual mission-and-activity evidence rail",
    signalSummary: "The combined FY 2021-2022, FY 2023, and FY 2024 reports provide recurring coverage of 14 federal departments and agencies and preserve historical launch and budget appendices.",
    signalBoundary: "Publish as a recurring federal activity and appendix series. Narrative accomplishments, budgets, launches, missions, and research outputs use different denominators and do not form one aerospace performance score.",
    signalWatch: "Track stable appendix tables, launch definitions, mission outcome, anomalies, payload, budget basis, agency coverage, publication lag, and revisions.",
    entries: [
      {
        slug: "president-aerospace-fy2021-2022",
        label: "Fiscal Years 2021 and 2022",
        date: "2023-05-03",
        url: "https://www.nasa.gov/history/history-publications-and-resources/aeronautics-and-space-report-of-the-president/",
        metric: "NASA published a combined report for FY 2021 and FY 2022 federal aerospace activities.",
        context: "The combined reporting period is a series break and cannot be treated as two independent annual observations.",
        hold: true,
      },
      {
        slug: "president-aerospace-fy2023",
        label: "Fiscal Year 2023",
        date: "2024-05-23",
        url: "https://www.nasa.gov/history/history-publications-and-resources/aeronautics-and-space-report-of-the-president/",
        metric: "The FY 2023 report restores a single-year federal aerospace activity record.",
        context: "Activity narratives and appendix statistics remain separate evidence types.",
      },
      {
        slug: "president-aerospace-fy2024",
        label: "Fiscal Year 2024",
        date: "2025-09-24",
        url: "https://www.nasa.gov/wp-content/uploads/2025/09/aeronautics-and-space-report-of-the-president-fy-2024.pdf",
        metric: "The FY 2024 report extends the single-year federal aerospace activity and historical appendix series.",
        context: "Publication lag and agency-specific methods must remain visible.",
      },
    ],
  },
];

const records = series.flatMap((item) =>
  item.entries.map((entry) => ({
    ...entry,
    portfolio: item.portfolio,
    seriesKey: item.key,
    seriesTitle: item.title,
    publisher: item.publisher,
    type: item.type,
    topic: item.topic,
    method: item.method,
    denominator: item.denominator,
    geography: item.geography,
    attribution: item.attribution,
  })),
);

if (series.length !== 16 || records.length !== 48) {
  throw new Error(`Phase 56A matrix must contain 16 series and 48 records; found ${series.length} and ${records.length}.`);
}

const sourceIdFor = (record) => `source-56a-${record.slug}`;
const documentIdFor = (record) => `research-doc-56a-${record.slug}`;
const documentTypeFor = (record) => ({
  "Annual Report": "Technical Report",
  "Program Report": "Technical Report",
  "Official Statistics": "Data Release",
  "Progress Report": "Action Plan",
  "Regulatory Data": "Data Release",
  "Agency Performance Report": "Technical Report",
  "Agency Inventory": "Data Release",
  "Oversight Report": "Oversight Report",
}[record.type] ?? "Technical Report");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yamlString = (value) => JSON.stringify(value);
const yamlArray = (values) => values.map((value) => `  - ${yamlString(value)}`).join("\n");

for (const directory of [
  "sources",
  "signals",
  "research-documents",
  "research-collections",
  "briefings",
  "updates",
]) {
  await mkdir(join(contentRoot, directory), { recursive: true });
}
await mkdir(join(appRoot, "src", "data"), { recursive: true });

for (const record of records) {
  const defaults = portfolioDefaults[record.portfolio];
  const source = {
    id: sourceIdFor(record),
    name: `${record.seriesTitle}: ${record.label}`,
    url: record.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: [record.topic, ...defaults.topics.filter((topic) => topic !== record.topic)],
    framework_layers: defaults.layers,
    country_or_region: "United States",
    update_frequency: "Annual",
    capture_priority: "High",
    known_limitations: `${record.context} Comparison contract: ${record.method} Denominator: ${record.denominator} Attribution: ${record.attribution}.`,
    last_checked_date: capturedDate,
    watch_lanes: defaults.watchLanes,
    live_access_type: record.type === "Official Statistics" || record.type === "Regulatory Data" ? "Data Download" : "Report Series",
    review_cadence_days: 90,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: record.geography,
    source_owner: record.publisher,
    notes: `Phase 56A annual observation for ${defaults.label}. Series key: ${record.seriesKey}.`,
  };
  if (source.live_access_type === "Data Download") source.data_download_url = record.url;
  await writeFile(join(contentRoot, "sources", `${source.id}.json`), json(source), "utf8");
}

for (const [index, record] of records.entries()) {
  const defaults = portfolioDefaults[record.portfolio];
  const number = String(163 + index).padStart(3, "0");
  const document = {
    id: documentIdFor(record),
    collection_id: collectionId,
    title: `${record.seriesTitle}: ${record.label}`,
    slug: `56a-${record.slug}`,
    record_status: record.hold ? "In Review" : "Published",
    publisher: record.publisher,
    publication_date: record.date,
    document_type: documentTypeFor(record),
    summary: `${record.metric} ${record.context}`,
    key_findings: [
      record.metric,
      `Method: ${record.method}`,
      `Denominator: ${record.denominator}`,
      `Attribution: ${record.attribution}.`,
    ],
    why_it_matters: `This observation adds one of three time points for the ${record.seriesTitle.toLowerCase()} series and keeps its unit, denominator, period, geography, method, attribution, and series-break context attached.`,
    ftfn_relevance: [
      `Adds one of twelve Phase 56A primary records for ${defaults.label}.`,
      "Supports a within-domain time series without creating a cross-domain score.",
      "Makes revision, denominator, and method limits visible before a direction is described.",
    ],
    evidence_limits: [
      record.context,
      `The observation is bounded to ${record.geography} and the stated period.`,
      `The denominator is ${record.denominator}`,
      "Two-point movement is not presented as a durable trend without an explicit caveat.",
    ],
    primary_topics: [record.topic, ...defaults.topics.filter((topic) => topic !== record.topic)],
    framework_layers: defaults.layers,
    constraint_tags: defaults.constraints,
    source_id: sourceIdFor(record),
    official_url: record.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-${record.slug}.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-${record.slug}.txt`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  };
  await writeFile(join(contentRoot, "research-documents", `${number}-56a-${record.slug}.json`), json(document), "utf8");
}

const seriesSignals = series.map((item) => {
  const defaults = portfolioDefaults[item.portfolio];
  const sourceIds = item.entries.map((entry) => `source-56a-${entry.slug}`);
  return {
    id: `signal-56a-${item.key}`,
    slug: `56a-${item.key}`,
    title: item.signalTitle,
    status: "Published",
    sourceIds,
    topic: item.topic,
    portfolio: item.portfolio,
    summary: item.signalSummary,
    boundary: item.signalBoundary,
    watch: item.signalWatch,
    constraints: defaults.constraints,
    receiving: defaults.receiving,
  };
});

const holdSignals = Object.entries(portfolioDefaults).map(([portfolio, defaults]) => {
  const portfolioSeries = series.filter((item) => item.portfolio === portfolio);
  return {
    id: `signal-56a-${portfolio.replaceAll("_", "-")}-cross-series-hold`,
    slug: `56a-${portfolio.replaceAll("_", "-")}-cross-series-hold`,
    title: `${defaults.label[0].toUpperCase()}${defaults.label.slice(1)} series cannot support one composite trend`,
    status: "In Review",
    sourceIds: portfolioSeries.flatMap((item) => item.entries.map((entry) => `source-56a-${entry.slug}`)),
    topic: portfolioSeries[0].topic,
    portfolio,
    summary: `Phase 56A establishes four recurring series for ${defaults.label}, but their units, denominators, periods, geographies, methods, and attribution remain incompatible with a composite direction or score.`,
    boundary: "Hold. Publish the four series separately; do not average, normalize, rank, or infer a common direction across incompatible outcome contracts.",
    watch: "Revisit only if a defensible within-domain question has common units, denominators, periods, geographies, methods, attribution, and revision controls.",
    constraints: defaults.constraints,
    receiving: defaults.receiving,
  };
});

const signals = [...seriesSignals, ...holdSignals];
for (const signal of signals) {
  const defaults = portfolioDefaults[signal.portfolio];
  const body = `---
id: "${signal.id}"
title: ${yamlString(signal.title)}
slug: "${signal.slug}"
record_status: "${signal.status}"
summary: ${yamlString(signal.summary)}
source_ids:
${yamlArray(signal.sourceIds)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: "${signal.topic}"
framework_layers:
${yamlArray(defaults.layers)}
signal_type: "${signal.status === "Published" ? "Market Signal" : "Policy Signal"}"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: ${yamlString(`The ${defaults.label} portfolio now has a bounded multi-period evidence trail with series breaks and comparison limits attached.`)}
dependencies:
  - "stable unit and denominator"
  - "compatible periods and geography"
  - "method and revision history"
  - "attribution and validation"
constraints:
${yamlArray(signal.constraints)}
receiving_systems:
${yamlArray(signal.receiving)}
local_implications:
  - "Direction can be described only inside the stated measurement contract."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: ${yamlString(signal.boundary)}
---

## Longitudinal read

${signal.summary}

## Comparison boundary

${signal.boundary}

## What to watch next

${signal.watch}
`;
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), body, "utf8");
}

const collection = {
  id: collectionId,
  title: "Longitudinal Operating Series, 2020-2025",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Forty-eight official annual observations form sixteen within-domain series across institutional AI and cybersecurity, manufacturing, infrastructure, and mobility, aviation, and space.",
  scope: "Phase 56A adds twelve records and five signal decisions per portfolio. Sixteen series signals publish; four cross-series composites remain In Review because their measurement contracts are incompatible.",
  captured_date: capturedDate,
  document_ids: records.map(documentIdFor),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 51-file archive contains 48 official-link records, consolidated FTFN summaries, a README, and a SHA-256 manifest. Four document observations retain explicit method or series-break review flags.",
  method_note: "A longitudinal claim requires at least two compatible time points. Every observation preserves unit, denominator, period, geography, method, attribution, revision, and series-break context. No cross-domain ranking or composite score is created.",
};
await writeFile(join(contentRoot, "research-collections", `${collectionSlug}.json`), json(collection), "utf8");

const briefing = `---
id: "briefing-research-watch-005-longitudinal-operating-series"
title: "Research Watch 005: Longitudinal Operating Series"
slug: "research-watch-005-longitudinal-operating-series"
record_status: "Published"
summary: "Sixteen official time series show where direction is measurable, where a method break interrupts the line, and why cross-domain scoring remains unsupported."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlArray(signals.map((signal) => signal.id))}
evidence_gap_ids:
  - "gap-001"
  - "gap-002"
  - "gap-003"
  - "gap-007"
  - "gap-008"
  - "gap-013"
  - "gap-014"
  - "gap-015"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "At least two compatible time points are required before direction is described."
  - "A two-point movement is not called a durable trend without an explicit caveat."
  - "Revisions, denominator changes, combined reporting years, and method changes are evidence, not footnotes."
  - "Sixteen within-domain series publish; four proposed cross-series composites remain held."
  - "No cross-domain ranking or composite score is created."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
  - "Unit Economics"
what_to_watch_next:
  - "Stable agency AI performance and cyber incident-outcome measures."
  - "Manufacturing facility and cohort results with repeat denominators and independent validation."
  - "Asset- and customer-level storage, reliability, water, and mineral measures."
  - "Carrier, AV operator, launch, reentry, mission, and anomaly data with compatible exposure."
---

## The longitudinal gate

Phase 56A requires a named series, at least two compatible observations, and a visible measurement contract. Units, denominators, periods, geographies, methods, attribution, revisions, and breaks remain attached to the record.

## AI and cybersecurity

The FISMA, GAO oversight, inspector-general effectiveness, and NASA AI-inventory series expose recurring federal measurement rails. They do not turn use-case counts, program maturity, recommendations, incidents, and system outcomes into one direction.

## Manufacturing

MEP client surveys, Manufacturing USA reports, NIIMBL reports, and Census establishment statistics provide four distinct annual rails. Program attribution, administrative activity, institute portfolios, and official sector estimates remain separate.

## Infrastructure

Battery power capacity, customer outage duration, water-reuse implementation, and mineral statistics each show a different part of operating capacity. Capacity, delivered service, policy progress, and commodity value cannot be averaged.

## Mobility, aviation, and space

Carrier service, California AV testing exposure, FAA commercial-space operations, and federal aerospace activity reports now have multi-period evidence. The series preserve exposure and activity while leaving safety, mission success, cost, accessibility, and local effects as separate outcomes.
`;
await writeFile(join(contentRoot, "briefings", "briefing-research-watch-005-longitudinal-operating-series.mdx"), briefing, "utf8");

const update = {
  id: "update-2026-07-24-phase-56a-longitudinal-operating-series",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56A adds sixteen longitudinal operating series",
  summary: "FTFN adds 48 annual observations and twenty bounded signal decisions across four operating portfolios, with sixteen Published series and four explicit cross-series holds.",
  affected_record_ids: [
    collectionId,
    "briefing-research-watch-005-longitudinal-operating-series",
    ...signals.map((signal) => signal.id),
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-005-longitudinal-operating-series/",
  ],
  evidence_note: "Every Published series has at least two compatible time points and carries unit, denominator, period, geography, method, attribution, revision, and series-break boundaries.",
  work_package: "docs/work-packages/phase-56a-longitudinal-operating-series.md",
};
await writeFile(join(contentRoot, "updates", "2026-07-24-phase-56a-longitudinal-operating-series.json"), json(update), "utf8");

const review = {
  phase: "56A",
  reviewed_date: capturedDate,
  portfolio_count: 4,
  series_count: series.length,
  primary_record_count: records.length,
  signal_decisions: {
    reviewed: signals.length,
    promoted: signals.filter((signal) => signal.status === "Published").map((signal) => signal.id),
    held: signals.filter((signal) => signal.status === "In Review").map((signal) => signal.id),
  },
  document_decisions: {
    reviewed: records.length,
    published: records.filter((record) => !record.hold).map(documentIdFor),
    held: records.filter((record) => record.hold).map(documentIdFor),
  },
  portfolio_records: Object.fromEntries(
    Object.keys(portfolioDefaults).map((portfolio) => [
      portfolio,
      records.filter((record) => record.portfolio === portfolio).map(documentIdFor),
    ]),
  ),
  series_records: Object.fromEntries(
    series.map((item) => [
      item.key,
      item.entries.map((entry) => `research-doc-56a-${entry.slug}`),
    ]),
  ),
  longitudinal_rule: "At least two compatible time points are required before direction is described; two-point movement is not a durable trend without an explicit caveat.",
  comparison_rule: "No cross-domain comparison or ranking is permitted unless unit, denominator, period, geography, method, attribution, and revision treatment are compatible.",
};
await writeFile(join(appRoot, "src", "data", "phase-56a-publication-review.json"), json(review), "utf8");

console.log(`Generated Phase 56A: ${records.length} primary records, ${signals.length} signal decisions, ${series.length} series.`);
