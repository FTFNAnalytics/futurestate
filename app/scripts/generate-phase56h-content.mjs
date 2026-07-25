import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-07-24";
const collectionSlug = "open-rail-acquisition-partial-closure-deepening-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-012-acquisition-and-deepening";

const records = [
  {
    slug: "dhs-fy2025-fisma-continuation",
    coverageId: "coverage-56f-dhs",
    entityId: "agency-dhs",
    entityName: "Department of Homeland Security",
    portfolio: "ai_cyber",
    sourceId: "source-56h-dhs-fy2025-financial-it-controls",
    sourceName: "DHS FY 2025 Consolidated Financial Statements and Internal-Control Report",
    url: "https://www.oig.dhs.gov/sites/default/files/assets/2026-01/OIG-26-03-Jan26.pdf",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: "2026-01-23",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Data Download",
    documentType: "Oversight Report",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Released FY 2025 enterprise FISMA result",
    finding: "DHS OIG's FY 2025 financial audit identifies information-technology control weakness in a current enterprise oversight record, but it is not the missing enterprise FISMA evaluation.",
    decision: "No closure change. The financial-control audit is retained as adjacent oversight and cannot substitute for the named annual FISMA result.",
    remainingGap: "Released FY 2025 FISMA evaluation, component findings, closure dates, endpoint and cloud coverage, incidents, recovery, and service effects.",
    reopeningRule: "Reopen when DHS OIG publishes the final FY 2025 enterprise evaluation or a dated replacement outcome.",
    limitation: "Financial-reporting IT controls and FISMA program effectiveness have different scopes, methods, and denominators.",
    country: "United States",
    jurisdiction: "United States federal government",
    createSource: true,
  },
  {
    slug: "doe-fy2025-fisma-management-letter",
    coverageId: "coverage-56f-doe",
    entityId: "agency-doe",
    entityName: "Department of Energy",
    portfolio: "ai_cyber",
    sourceId: "source-56h-doe-fy2025-cyber-management-letter",
    sourceName: "DOE-OIG-26-22: FY 2025 Unclassified Cybersecurity Management Letter",
    url: "https://www.energy.gov/ig/articles/management-letter-doe-oig-26-22",
    publisher: "Department of Energy Office of Inspector General",
    publicationDate: "2026-03-12",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Oversight Report",
    priorStatus: "Open",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Department-wide FY 2025 FISMA evaluation",
    finding: "DOE OIG's management letter reports results from its FY 2025 FISMA evaluation and related cybersecurity reviews: 33 cybersecurity findings, including 13 repeat findings, plus a significant deficiency involving access controls over financial systems.",
    decision: "The public management letter supplies a bounded department-wide FY 2025 result and moves the selected evidence state to Partially Closed; finding-level remediation and operating outcomes remain open.",
    remainingGap: "Finding-level recommendations and closure, tested-system coverage, incidents, recovery, laboratory or mission effects, and later corrective-action status.",
    phase56FReopeningRule: "Reopen when DOE OIG publishes the department-wide FY 2025 FISMA evaluation or a dated official status for that review.",
    reopeningRule: "Reopen when DOE OIG publishes finding-level recommendations, remediation status, or a later department-wide FISMA outcome.",
    limitation: "The management letter summarizes annual findings but does not expose a common system-level denominator, remediation outcome, incident rate, or mission effect.",
    country: "United States",
    jurisdiction: "United States federal government",
    createSource: true,
  },
  {
    slug: "f35-delivery-capability-denominator",
    coverageId: "coverage-56f-f35-fort-worth",
    entityId: "manufacturer-lockheed-f35-fort-worth",
    entityName: "Lockheed Martin F-35 Fort Worth final-assembly line",
    portfolio: "manufacturing",
    sourceId: "source-56h-f35-gao-late-deliveries-2025",
    sourceName: "GAO-25-107632: F-35 Actions Needed to Address Late Deliveries",
    url: "https://files.gao.gov/reports/GAO-25-107632/index.html",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2025-09-03",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Oversight Report",
    priorStatus: "Open",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Aircraft due versus accepted by month with capability state",
    finding: "GAO reports that all 110 aircraft delivered in 2024 were late; as of May 2025, 80 aircraft had been delivered during 2025, 74 were due in earlier years, 20 aircraft due in 2024 remained undelivered, and 174 TR-3 aircraft had been provisionally accepted in a non-combat-capable configuration.",
    decision: "The GAO record supplies compatible annual delivery, backlog, acceptance, and capability-state observations and moves the evidence state to Partially Closed; it does not provide a month-by-month due-versus-accepted series.",
    remainingGap: "Monthly aircraft due and accepted, capability upgrades by month, labor, rework, yield, line inventory, supplier constraints, and Fort Worth-specific output.",
    phase56FReopeningRule: "Reopen when the F-35 program office, DOD, GAO, or Lockheed publishes a month-level due-and-accepted series with capability state.",
    reopeningRule: "Reopen when an official source publishes monthly due, delivered, accepted, and capability-state observations under one production-line denominator.",
    limitation: "The annual and point-in-time observations are program-wide and do not isolate Fort Worth monthly cadence, labor, rework, yield, or supplier effects.",
    country: "United States",
    jurisdiction: "United States",
    createSource: true,
  },
  {
    slug: "manatee-interval-operation-continuation",
    coverageId: "coverage-56f-manatee",
    entityId: "eia-plant-60014",
    entityName: "Manatee Solar Energy Center",
    portfolio: "infrastructure",
    sourceId: "source-56h-manatee-fpl-rate-testimony-2025",
    sourceName: "FPL 2025 Rate Testimony on Solar and Battery Operations",
    url: "https://www.psc.state.fl.us/library/filings/2025/01178-2025/01178-2025.pdf",
    publisher: "Florida Public Service Commission / Florida Power & Light Company",
    publicationDate: "2025-02-28",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety", "Weather"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Data Download",
    documentType: "Regulatory Decision",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Interval dispatch and availability for the named battery",
    finding: "FPL's filed testimony identifies Manatee as a 409 MW, 2.2-hour battery placed in commercial operation in 2021 and describes centralized monitoring, dispatch, and control at the fleet level.",
    decision: "No closure change. Asset identity, duration, and a fleet-level operating process do not supply Manatee interval dispatch or availability.",
    remainingGap: "Interval dispatch, availability, cycles, state of charge, degradation, revenue, curtailment, outage response, and customer cost.",
    reopeningRule: "Reopen when FPL, Florida PSC, EIA, or a balancing authority publishes asset-specific operating data with a declared interval.",
    limitation: "The filing contains company testimony in a regulatory docket and does not publish an asset-level time series or independently verified operating denominator.",
    country: "United States",
    jurisdiction: "Florida",
    createSource: true,
  },
  {
    slug: "gateway-final-investigation-continuation",
    coverageId: "coverage-56f-gateway",
    entityId: "eia-plant-63834",
    entityName: "Gateway Energy Storage System",
    portfolio: "infrastructure",
    sourceId: "source-56h-gateway-cpuc-go167-catalog-2026",
    sourceName: "CPUC GO 167-C Compliance Audit Catalog: Gateway",
    url: "https://www.cpuc.ca.gov/about-cpuc/divisions/safety-and-enforcement-division/electric-safety-and-reliability-branch/generation-and-energy-storage-section/go-167-compliance-audits",
    publisher: "California Public Utilities Commission",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Final investigation and full contracted-capacity restoration",
    finding: "The current CPUC GO 167-C catalog continues to expose Gateway's June 2, 2025 audit report and facility response, but no later final incident finding or full-capacity restoration record is listed.",
    decision: "No closure change. A current catalog check confirms the available audit rail but not final investigation closure or restored operation.",
    remainingGap: "Final investigation, full return to service, contracted-capacity restoration, availability, dispatch, duration, degradation, revenue, and reliability effects.",
    reopeningRule: "Reopen when CPUC, EPA, CAISO, SCE, or the operator publishes final findings or a full-capacity operating record.",
    limitation: "Catalog presence and a prior audit-response pair do not establish final incident findings, dispatch, availability, or restored contracted capacity.",
    country: "United States",
    jurisdiction: "California",
    createSource: true,
  },
  {
    slug: "hornsdale-final-project-operation",
    coverageId: "coverage-56f-hornsdale",
    entityId: "battery-hornsdale-power-reserve",
    entityName: "Hornsdale Power Reserve",
    portfolio: "infrastructure",
    sourceId: "source-56h-hornsdale-final-project-report-2026",
    sourceName: "Hornsdale Power Reserve Expansion Final Project Report",
    url: "https://arena.gov.au/knowledge-bank/hornsdale-power-reserve-expansion-final-project-report/",
    publisher: "Australian Renewable Energy Agency",
    publicationDate: "2026-03-31",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Technical Report",
    priorStatus: "Open",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Annual availability and dispatch under a declared service denominator",
    finding: "ARENA's final project record documents the 50 MW / 64.5 MWh Hornsdale expansion, Virtual Machine Mode, enhanced frequency-control services, and System Integrity Protection Scheme upgrades, with linked operations reporting.",
    decision: "The later asset-specific final and operating record satisfies the bounded reopening condition and moves the evidence state to Partially Closed; a full annual availability and dispatch denominator remains absent.",
    remainingGap: "Annual availability, dispatch, service enablement and delivery, cycling, degradation, revenue, safety, and customer outcomes under one declared period.",
    phase56FReopeningRule: "Reopen when AEMO, AER, the South Australian government, or the operator publishes an asset-specific annual operating series.",
    reopeningRule: "Reopen when an official record supplies annual availability, dispatch, service delivery, cycling, and outage observations under a declared asset denominator.",
    limitation: "The final project and linked operations reports describe project performance and grid-service demonstrations but do not expose a complete annual operating denominator.",
    country: "Australia",
    jurisdiction: "South Australia",
    createSource: true,
  },
  {
    slug: "nasa-fy2026-recommendation-continuation",
    coverageId: "coverage-56f-nasa",
    entityId: "agency-nasa",
    entityName: "National Aeronautics and Space Administration",
    portfolio: "ai_cyber",
    sourceId: "source-56f-nasa-open-recommendations-july-2026",
    sourceName: "NASA OIG Open Recommendations Data - July 2026",
    url: "https://oig.nasa.gov/audit-open-recommendations/",
    publisher: "NASA Office of Inspector General",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Cybersecurity", "AI for Science", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Data Release",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "FY 2026 FISMA result and recommendation-level closure",
    finding: "NASA OIG's current open-recommendations rail remains available, but no FY 2026 FISMA evaluation or newly scoped cyber recommendation closure is published on the selected rail.",
    decision: "The selected evidence state remains Partially Closed. The current rail is retained as a dated continuation check rather than a repeated closure claim.",
    remainingGap: "FY 2026 FISMA result, tested-system coverage, incidents, recovery, service effects, and mission outcomes.",
    reopeningRule: "Reopen when NASA OIG publishes the FY 2026 FISMA evaluation or recommendation-level cyber closure data with tested-system scope.",
    limitation: "A live recommendation mechanism does not itself supply an annual evaluation or common tested-system and mission denominator.",
    country: "United States",
    jurisdiction: "United States federal government",
    createSource: false,
  },
  {
    slug: "hhs-fy2025-recommendation-status",
    coverageId: "coverage-56f-hhs",
    entityId: "agency-hhs",
    entityName: "Department of Health and Human Services",
    portfolio: "ai_cyber",
    sourceId: "source-56d-hhs-fisma-recommendations-tracker-2026",
    sourceName: "HHS OIG Recommendations Tracker: FY 2025 FISMA Review",
    url: "https://oig.hhs.gov/reports/recommendations/tracker/?hhs-agency=all&search=OAS-25-18-041&view-mode=report-grouped",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Cybersecurity", "AI for Science", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Data Release",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "Recommendation-level closure after the FY 2025 review",
    finding: "The current HHS OIG tracker lists all 10 recommendations associated with OAS-25-18-041 as Open and Unimplemented, with the next update expected in September 2026.",
    decision: "The selected evidence state remains Partially Closed. The exact recommendation rail is current, but no recommendation has yet changed to a closed state.",
    remainingGap: "Implemented corrective actions, closed recommendations, component control tests, incidents, recovery, affected services, and health-program outcomes.",
    reopeningRule: "Reopen when the HHS OIG tracker changes a FY 2025 recommendation status or a component control test is published.",
    limitation: "Recommendation status does not measure implementation quality, incidents, recovery, affected services, or health-program outcomes.",
    country: "United States",
    jurisdiction: "United States federal government",
    createSource: false,
  },
  {
    slug: "va-ifams-access-controls-2026",
    coverageId: "coverage-56f-va",
    entityId: "agency-va",
    entityName: "Department of Veterans Affairs",
    portfolio: "ai_cyber",
    sourceId: "source-56h-va-ifams-access-controls-2026",
    sourceName: "VA OIG Audit of iFAMS Access Controls",
    url: "https://www.oversight.gov/reports/audit/audit-integrated-financial-and-acquisition-management-system-access-controls",
    publisher: "Department of Veterans Affairs Office of Inspector General",
    publicationDate: "2026-02-17",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Oversight Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "FY 2025 FISMA result plus named-system control operation",
    finding: "VA OIG found insufficient iFAMS access limitation for all 20 Technology Acquisition Center users sampled; 91 percent of 2,818 users with TAC-data access did not work for TAC, and 78 percent held roles granting exceptionally broad access.",
    decision: "The named-system control layer deepens materially, but the selected evidence state remains Partially Closed because the new recommendations are open and the FY 2025 FISMA result remains missing.",
    remainingGap: "Recommendation closure, corrected access-state testing, FY 2025 FISMA results, incidents, recovery, service effects, and veteran outcomes.",
    reopeningRule: "Reopen when VA OIG publishes the FY 2025 FISMA audit or closes the named iFAMS recommendations.",
    limitation: "The sample and access-role findings apply to the named system and observation period; they are not a department-wide incident or service-outcome denominator.",
    country: "United States",
    jurisdiction: "United States federal government",
    createSource: true,
  },
  {
    slug: "dot-fy2025-recommendation-dashboard",
    coverageId: "coverage-56f-dot",
    entityId: "agency-dot",
    entityName: "Department of Transportation",
    portfolio: "ai_cyber",
    sourceId: "source-56h-dot-recommendation-dashboard-2026",
    sourceName: "DOT OIG Recommendation Dashboard: Information Security Review",
    url: "https://services.oig.dot.gov/recommendation-dashboard",
    publisher: "Department of Transportation Office of Inspector General",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Interactive Portal",
    documentType: "Data Release",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "FY 2026 annual review and closure evidence",
    finding: "DOT OIG's current dashboard lists zero of seven recommendations closed for the FY 2025 information-security quality-control review and provides recommendation-level text on governance, inventories, vetting, and continuous monitoring.",
    decision: "The recommendation-status denominator is now explicit, but the selected evidence state remains Partially Closed because no listed recommendation is closed and the FY 2026 annual review remains pending.",
    remainingGap: "FY 2026 review results, closed recommendations, verified implementation, incidents, recovery, affected modes, and service outcomes.",
    reopeningRule: "Reopen when DOT OIG publishes the FY 2026 quality-control review or a dated recommendation closure.",
    limitation: "A recommendation dashboard measures administrative status and does not prove control effectiveness, incident reduction, recovery, or transport-service outcomes.",
    country: "United States",
    jurisdiction: "United States federal government",
    createSource: true,
  },
  {
    slug: "moss-landing-investigation-status-2026",
    coverageId: "coverage-56f-moss-landing",
    entityId: "eia-plant-260",
    entityName: "Dynegy Moss Landing Power Plant Hybrid",
    portfolio: "infrastructure",
    sourceId: "source-56h-moss-landing-cpuc-investigation-status-2026",
    sourceName: "CPUC GESS Moss Landing Investigation Status - July 2026",
    url: "https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-generation-and-energy-storage-team-keeping-californias-electric-grid-safe-and-reliable",
    publisher: "California Public Utilities Commission",
    publicationDate: "2026-07-14",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Agency Announcement",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "Final regulator investigation and corrective-action closure",
    finding: "CPUC's July 14, 2026 update says its Generation and Energy Storage Section is conducting an ongoing investigation into the January 16, 2025 Moss Landing incident after an initial January 22, 2025 site visit.",
    decision: "The official rail is current, but the selected evidence state remains Partially Closed because the investigation and corrective-action review are not final.",
    remainingGap: "Final regulator findings, facility response, corrective-action acceptance, verified implementation, restored operation, and later safety performance.",
    reopeningRule: "Reopen when CPUC publishes the formal investigation or audit report, facility response, or closure notice.",
    limitation: "An ongoing-investigation notice establishes process status, not root cause, corrective-action closure, restored operation, or safety outcome.",
    country: "United States",
    jurisdiction: "California",
    createSource: true,
  },
  {
    slug: "kc46-current-program-denominator-2026",
    coverageId: "coverage-56f-kc46-everett",
    entityId: "manufacturer-boeing-kc46-everett",
    entityName: "Boeing KC-46A Everett production line",
    portfolio: "manufacturing",
    sourceId: "source-56h-gao-weapon-systems-2026",
    sourceName: "GAO-26-108457: Weapon Systems Annual Assessment",
    url: "https://www.gao.gov/products/gao-26-108457",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2026-07-02",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Safety"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Oversight Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Procured, due, delivered, and accepted aircraft under one current denominator",
    finding: "GAO's July 2026 profile reports 173 KC-46A aircraft procured and 101 delivered as of January 2026, while required assets and redesigned subsystems remained incomplete.",
    decision: "The current procured-and-delivered denominator deepens the program record, but the evidence state remains Partially Closed because it does not pair due and accepted aircraft by month or line.",
    remainingGap: "Monthly procured, due, delivered, and accepted aircraft under one denominator, retrofit state, labor, rework, yield, supplier constraints, and quality findings.",
    reopeningRule: "Reopen when GAO or the Air Force publishes another program profile or a monthly line delivery and acceptance table.",
    limitation: "Program-level cumulative procurement and delivery do not isolate Everett monthly due, acceptance, retrofit, rework, labor, or yield.",
    country: "United States",
    jurisdiction: "United States",
    createSource: true,
  },
  {
    slug: "dalrymple-constraint-event-2026",
    coverageId: "coverage-56f-dalrymple",
    entityId: "battery-dalrymple-escri-sa",
    entityName: "Dalrymple ESCRI-SA Battery Energy Storage System",
    portfolio: "infrastructure",
    sourceId: "source-56h-dalrymple-aemo-constraint-report-2026",
    sourceName: "AEMO February 2026 Monthly Constraint Report",
    url: "https://www.aemo.com.au/-/media/files/electricity/nem/security_and_reliability/congestion-information/statistics/2026/february-2026.pdf?rev=64beb99418f441daaa631b2995a562d2&sc_lang=en",
    publisher: "Australian Energy Market Operator",
    publicationDate: "2026-03-01",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Data Download",
    documentType: "Data Release",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Post-project availability, dispatch, and islanding events",
    finding: "AEMO's February 2026 report identifies the Dalrymple Battery islanding constraint S_DLBAT-G_ISL and records 20 dispatch intervals, or 1.66 hours, in which that constraint equation was violated.",
    decision: "The asset-specific event count deepens the later operating record, but the evidence state remains Partially Closed because a constraint violation is not an islanding activation, availability series, or dispatch history.",
    remainingGap: "Post-2021 availability, dispatch, realized islanding activations, state of charge, degradation, revenue, reliability, and customer outcomes.",
    reopeningRule: "Reopen when ElectraNet, AGL, AEMO, ARENA, or the South Australian regulator publishes dated islanding activations or an asset-level operating series.",
    limitation: "Constraint-equation violation intervals do not establish actual islanding, delivered service, full dispatch, availability, degradation, revenue, or customer outcomes.",
    country: "Australia",
    jurisdiction: "South Australia",
    createSource: true,
  },
  {
    slug: "f15ex-current-acquisition-assessment-2026",
    coverageId: "coverage-56f-f15ex-st-louis",
    entityId: "manufacturer-boeing-f15ex-st-louis",
    entityName: "Boeing F-15EX St. Louis production line",
    portfolio: "manufacturing",
    sourceId: "source-56h-gao-weapon-systems-2026",
    sourceName: "GAO-26-108457: Weapon Systems Annual Assessment",
    url: "https://www.gao.gov/products/gao-26-108457",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2026-07-02",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Oversight Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Monthly planned and accepted deliveries after the 2025 restart",
    finding: "GAO's 2026 annual assessment identifies F-15EX as a rapid-fielding program that entered with mature critical technologies and transitioned to full-rate production within five years.",
    decision: "The current acquisition milestone deepens the program record, but the evidence state remains Partially Closed because realized monthly post-restart deliveries and acceptances are not supplied.",
    remainingGap: "Monthly planned and accepted deliveries, labor, rework, yield, supplier constraints, cost, and quality findings.",
    reopeningRule: "Reopen when the Air Force, DCMA, GAO, or Boeing publishes realized post-restart delivery and acceptance dates.",
    limitation: "A program-level pathway and production milestone does not expose St. Louis monthly output, acceptance, labor, rework, yield, or supplier constraints.",
    country: "United States",
    jurisdiction: "United States",
    createSource: false,
  },
];

const signalSpecs = [
  {
    id: "signal-56h-doe-fy2025-cyber-result",
    title: "DOE's FY 2025 cyber management letter supplies a bounded annual result",
    slug: "56h-doe-fy2025-cyber-result",
    topic: "Cybersecurity",
    sourceIds: ["source-56h-doe-fy2025-cyber-management-letter"],
    summary: "DOE OIG reports 33 FY 2025 cybersecurity findings, including 13 repeats, moving one annual-review evidence question from Open to Partially Closed.",
    body: "DOE OIG's March 2026 management letter explicitly reports results from the FY 2025 FISMA evaluation and related cybersecurity reviews. It supplies a bounded department-wide annual result, while finding-level remediation, incidents, recovery, and mission effects remain open.",
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
  },
  {
    id: "signal-56h-f35-delivery-capability-advance",
    title: "GAO pairs F-35 delivery backlog with accepted capability state",
    slug: "56h-f35-delivery-capability-advance",
    topic: "Advanced Manufacturing",
    sourceIds: ["source-56h-f35-gao-late-deliveries-2025"],
    summary: "GAO provides annual delivery, backlog, provisional-acceptance, and capability-state observations for the F-35 program, advancing—but not closing—the monthly line question.",
    body: "GAO reports 110 aircraft delivered late in 2024, 80 delivered during 2025 as of May, a remaining 2024 backlog of 20, and 174 provisionally accepted non-combat-capable TR-3 aircraft. The record is strong enough for a partial evidence advance but does not supply Fort Worth monthly due-versus-accepted output.",
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
  },
  {
    id: "signal-56h-hornsdale-final-operating-record",
    title: "Hornsdale's final project record confirms later asset operation",
    slug: "56h-hornsdale-final-operating-record",
    topic: "Energy",
    sourceIds: ["source-56h-hornsdale-final-project-report-2026"],
    summary: "ARENA's final project record and linked operations material advance Hornsdale to Partially Closed while a full annual availability-and-dispatch denominator remains open.",
    body: "ARENA's final record documents the 50 MW / 64.5 MWh expansion, Virtual Machine Mode, enhanced frequency-control services, and protection-scheme upgrades. It is later asset-specific operating evidence, but it does not expose a complete annual availability, dispatch, cycling, outage, or revenue series.",
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
  },
  {
    id: "signal-56h-dalrymple-constraint-event",
    title: "AEMO adds a dated Dalrymple constraint-event count",
    slug: "56h-dalrymple-constraint-event",
    topic: "Energy",
    sourceIds: ["source-56h-dalrymple-aemo-constraint-report-2026"],
    summary: "AEMO records 20 dispatch intervals involving the Dalrymple islanding constraint, deepening the asset record without equating a constraint violation with islanding or delivered service.",
    body: "The February 2026 constraint report names S_DLBAT-G_ISL and records 20 dispatch intervals, or 1.66 hours, of constraint-equation violation. This is a useful asset-specific event denominator, but it does not establish an islanding activation, full dispatch, availability, or customer outcome.",
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
  },
];

const heldSignalId = "signal-56h-three-open-rails-six-partial-continuations";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yamlList = (items, indent = "  ") => items.map((item) => `${indent}- "${item}"`).join("\n");
const writeJson = (path, value) => writeFile(path, json(value), "utf8");

await Promise.all([
  mkdir(join(contentRoot, "sources"), { recursive: true }),
  mkdir(join(contentRoot, "research-documents"), { recursive: true }),
  mkdir(join(contentRoot, "research-collections"), { recursive: true }),
  mkdir(join(contentRoot, "signals"), { recursive: true }),
  mkdir(join(contentRoot, "briefings"), { recursive: true }),
  mkdir(join(contentRoot, "updates"), { recursive: true }),
  mkdir(dataRoot, { recursive: true }),
]);

const createdSources = new Set();
for (const [index, record] of records.entries()) {
  const archiveName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  if (record.createSource && !createdSources.has(record.sourceId)) {
    createdSources.add(record.sourceId);
    await writeJson(join(contentRoot, "sources", `${record.sourceId}.json`), {
      id: record.sourceId,
      name: record.sourceName,
      url: record.url,
      source_type: record.sourceType,
      credibility_level: record.credibility,
      primary_topics: record.topics,
      framework_layers: record.layers,
      country_or_region: record.country,
      update_frequency: "Event-driven",
      capture_priority: "High",
      known_limitations: `${record.limitation} Phase 56H keeps the coverage ID, attribution, observation window, evidence state, and continuation rule attached.`,
      last_checked_date: capturedDate,
      watch_lanes: record.watchLanes,
      live_access_type: record.liveAccessType,
      ...(record.url.toLowerCase().includes(".pdf") ? { data_download_url: record.url } : {}),
      review_cadence_days: 60,
      monitoring_status: "Active",
      coverage_role: ["Primary Data", "Source Freshness"],
      jurisdiction: record.jurisdiction,
      source_owner: record.publisher,
      notes: `Phase 56H acquisition and partial-closure deepening source. Collection: ${collectionSlug}.`,
    });
  }

  await writeJson(join(contentRoot, "research-documents", `${355 + index}-56h-${record.slug}.json`), {
    id: `research-doc-56h-${record.slug}`,
    collection_id: collectionId,
    title: `${record.entityName}: Phase 56H Evidence Decision`,
    slug: `56h-${record.slug}`,
    record_status: record.recordStatus,
    publisher: record.publisher,
    publication_date: record.publicationDate,
    document_type: record.documentType,
    summary: `${record.finding} Phase 56H decision: ${record.decision}`,
    key_findings: [
      `Phase 56F coverage ID: ${record.coverageId}.`,
      `Highest-value missing record: ${record.priority}.`,
      `Evidence state: ${record.priorStatus} to ${record.currentStatus}.`,
      `Continuation rule: ${record.reopeningRule}`,
    ],
    why_it_matters: "The record tests a named acquisition or reopening rule while keeping adjacent context separate from exact operating, corrective-action, or closure evidence.",
    ftfn_relevance: [
      `Preserves stable entity ID ${record.entityId}.`,
      "Records the official rail, compatible observation, and decision at a date.",
      "Separates evidence-state movement from entity performance, quality, readiness, or value.",
    ],
    evidence_limits: [
      record.limitation,
      record.remainingGap,
      "No causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is supported.",
    ],
    primary_topics: record.topics,
    framework_layers: record.layers,
    constraint_tags: record.constraints,
    source_id: record.sourceId,
    official_url: record.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Open-Rail Acquisition and Partial-Closure Deepening, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Fourteen evidence decisions continue all six Open rails and deepen eight high-value Partially Closed records. DOE, F-35, and Hornsdale advance to Partially Closed; three exact rails remain Open.",
  scope: "Six continuing Open acquisitions plus eight federal, manufacturing, aviation, and grid-storage partial-closure checks.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56h-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 17-file archive contains fourteen official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Every decision retains its Phase 56F coverage ID and continuation rule. Evidence state measures one selected record, not performance. Adjacent context is never substituted for a missing denominator or final outcome.",
});

for (const signal of signalSpecs) {
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), `---
id: "${signal.id}"
title: "${signal.title}"
slug: "${signal.slug}"
record_status: "Published"
summary: "${signal.summary}"
source_ids:
${yamlList(signal.sourceIds)}
published_date: 2026-07-24
captured_date: 2026-07-24
primary_topic: "${signal.topic}"
framework_layers:
${yamlList(["Enabling Infrastructure", "Human Systems"])}
signal_type: "Policy Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The record advances one bounded evidence question while preserving the remaining denominator and outcome gaps."
dependencies:
  - "stable entity and source identity"
  - "compatible observation window"
  - "separate operating and outcome denominators"
constraints:
${yamlList(signal.constraints)}
receiving_systems:
  - "Phase 56F cross-cohort coverage ledger"
local_implications:
  - "Evidence-state movement cannot be converted into a performance, safety, readiness, quality, or value score."
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-24
---

## What changed

${signal.body}

## Boundary

The result changes only the selected evidence state. It does not support a cross-entity comparison, causal claim, ranking, composite, or readiness score.
`, "utf8");
}

const continuationSourceIds = records
  .filter((record) => record.currentStatus === record.priorStatus)
  .map((record) => record.sourceId);
await writeFile(join(contentRoot, "signals", `${heldSignalId}.mdx`), `---
id: "${heldSignalId}"
title: "Nine 56H checks preserve their continuation rules"
slug: "56h-three-open-rails-six-partial-continuations"
record_status: "In Review"
summary: "Three Open records and six Partially Closed records receive current bounded checks without a false closure or repeated publication claim."
source_ids:
${yamlList([...new Set(continuationSourceIds)])}
published_date: null
captured_date: 2026-07-24
primary_topic: "Policy and Standards"
framework_layers:
${yamlList(["Resource Foundations", "Enabling Infrastructure", "Human Systems"])}
signal_type: "Market Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Needs Follow-Up"
why_it_matters: "The hold keeps current oversight and planning context from becoming a substitute for exact annual, monthly, interval, investigation, corrective-action, or restoration evidence."
dependencies:
  - "exact record identity"
  - "compatible unit and denominator"
  - "declared observation window"
  - "named continuation rule"
constraints:
${yamlList(["Data Quality", "Standards", "Infrastructure", "Public Trust"])}
receiving_systems:
  - "Nine named Phase 56H entities"
local_implications:
  - "Continue acquisition on the named rails; do not infer performance from missing disclosure."
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-24
editorial_notes: "Hold until an exact record changes one or more named continuation conditions."
---

## Why the records continue

Each current source contributes a dated boundary or partial operating observation, but none supplies every missing unit, denominator, attribution, and outcome needed for full closure.

## Stop rule

Do not convert a dated source check, open recommendation, ongoing investigation, cumulative total, fleet-level description, or acquisition milestone into a performance comparison, score, or causal claim.
`, "utf8");

await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), `---
id: "${briefingId}"
title: "Research Watch 012: Open-Rail Acquisition and Partial-Closure Deepening"
slug: "research-watch-012-acquisition-and-deepening"
record_status: "Published"
summary: "Fourteen Phase 56H decisions continue all six Open rails and deepen eight Partially Closed records; DOE, F-35, and Hornsdale advance to Partially Closed."
published_date: 2026-07-24
captured_date: 2026-07-24
signal_ids:
${yamlList([...signalSpecs.map((signal) => signal.id), heldSignalId])}
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-24
top_takeaways:
  - "All six Open rails received another named-source acquisition check."
  - "DOE, F-35, and Hornsdale move from Open to Partially Closed on compatible bounded records."
  - "Eight Partially Closed entities received evidence-value deepening without being presented as fully closed."
  - "The 24-entity ledger now stands at one Closed, twenty Partially Closed, and three Open evidence states."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
what_to_watch_next:
  - "DHS FY 2025 enterprise FISMA publication."
  - "Manatee asset-level interval dispatch and availability."
  - "Gateway final investigation and full-capacity operating record."
  - "Finding and recommendation closure for DOE, NASA, HHS, VA, and DOT."
  - "Monthly production and acceptance denominators for F-35, KC-46A, and F-15EX."
  - "Annual and event-level operating records for Hornsdale and Dalrymple."
---

## Acquisition result

Phase 56H continued every Open rail and began the Partially Closed queue in evidence-value order. Three exact records were strong enough for bounded movement: DOE's FY 2025 cyber management letter, GAO's F-35 delivery and capability-state record, and ARENA's Hornsdale final project record.

The remaining checks either preserve an Open state or deepen a Partially Closed state. No adjacent record is treated as a replacement for a missing annual, monthly, interval, corrective-action, investigation, restoration, or outcome denominator.

## Current closure ledger

- Closed: 1
- Partially Closed: 20
- Open: 3

These are evidence states for one selected record per entity. They are not performance, safety, quality, readiness, or value measures.

## Next acquisition queue

Phase 56I should continue DHS, Manatee, and Gateway while deepening the remaining Partially Closed queue and revisiting the strongest 56H continuation rules. Scheduled checks remain bounded inserts rather than pauses.
`, "utf8");

const acquisitions = records.map((record) => ({
  acquisition_id: `acquisition-56h-${record.slug}`,
  coverage_id: record.coverageId,
  entity_id: record.entityId,
  entity_name: record.entityName,
  portfolio: record.portfolio,
  highest_value_missing_record: record.priority,
  checked_source_id: record.sourceId,
  checked_source_url: record.url,
  checked_date: capturedDate,
  prior_closure_status: record.priorStatus,
  current_closure_status: record.currentStatus,
  record_status: record.recordStatus,
  acquisition_result: record.finding,
  decision: record.decision,
  remaining_gap: record.remainingGap,
  phase_56f_reopening_rule: record.phase56FReopeningRule ?? record.reopeningRule,
  reopening_rule: record.reopeningRule,
  comparison_boundary: "Closure status is evidence state, not entity performance; no ranking, score, or causal claim is authorized.",
}));

await writeJson(join(dataRoot, "phase-56h-acquisition-and-deepening.json"), {
  phase: "56H",
  captured_date: capturedDate,
  acquisition_count: records.length,
  phase_56g_open_queue_checked: 6,
  phase_56g_partially_closed_queue_checked: 8,
  status_changes: {
    open_to_partially_closed: 3,
    unchanged_open: 3,
    unchanged_partially_closed: 8,
  },
  current_cross_cohort_closure_counts: {
    closed: 1,
    partially_closed: 20,
    open: 3,
  },
  acquisitions,
});

await writeJson(join(dataRoot, "phase-56h-publication-review.json"), {
  phase: "56H",
  reviewed_date: capturedDate,
  source_profiles_added: createdSources.size,
  acquisition_count: records.length,
  document_decisions: {
    reviewed: records.length,
    promoted: records
      .filter((record) => record.recordStatus === "Published")
      .map((record) => `research-doc-56h-${record.slug}`),
    held: records
      .filter((record) => record.recordStatus === "In Review")
      .map((record) => `research-doc-56h-${record.slug}`),
  },
  signal_decisions: {
    reviewed: signalSpecs.length + 1,
    promoted: signalSpecs.map((signal) => signal.id),
    held: [heldSignalId],
  },
  acquisition_rule: "Every check retains its Phase 56F coverage ID and named continuation rule.",
  partial_deepening_rule: "A Partially Closed record may deepen without becoming Closed; the exact remaining denominator stays visible.",
  unavailable_record_rule: "An unavailable exact record produces a dated source check and continuation rule, not generic replacement context.",
  closure_rule: "DOE, F-35 Fort Worth, and Hornsdale move from Open to Partially Closed; DHS, Manatee, and Gateway remain Open.",
  comparison_rule: "No causal effect, ranking, completeness score, composite score, readiness score, or inference from missing disclosure is permitted.",
});

await writeJson(join(contentRoot, "updates", "2026-07-24-phase-56h-acquisition-and-deepening.json"), {
  id: "update-2026-07-24-phase-56h-acquisition-and-deepening",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56H advances three Open rails and deepens eight partial records",
  summary: "FTFN adds fourteen evidence decisions, four Published bounded signals, one held synthesis, Research Watch 012, and a seventeen-file archive.",
  affected_record_ids: [
    collectionId,
    briefingId,
    ...signalSpecs.map((signal) => signal.id),
    heldSignalId,
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-012-acquisition-and-deepening/",
    ...signalSpecs.map((signal) => `/signals/${signal.slug}/`),
  ],
  evidence_note: "DOE, F-35 Fort Worth, and Hornsdale advance to Partially Closed. DHS, Manatee, and Gateway remain Open. Eight partial records deepen without a false full closure.",
  work_package: "docs/work-packages/phase-56h-open-rail-acquisition-partial-closure-deepening.md",
});

console.log(`Generated Phase 56H: ${createdSources.size} sources, fourteen evidence documents, five signals, one collection, Research Watch 012, two ledgers, and one update.`);
