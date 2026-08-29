import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-07-24";
const collectionSlug = "cross-cohort-coverage-missing-record-closure-2010-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-010-cross-cohort-coverage";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yaml = (value) => JSON.stringify(value);
const yamlArray = (items, indent = "  ") => items.map((item) => `${indent}- ${yaml(item)}`).join("\n");
const addUnique = (items) => [...new Set(items)];

const portfolioDefaults = {
  ai_cyber: {
    label: "Federal agency control operation and closure",
    topics: ["Cybersecurity", "AI for Science", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Standards", "Data Quality", "Safety", "Public Trust"],
    watch: ["Security and Standards", "Cross-Cutting Official Rails"],
    receiving: ["Named federal agency information-security programs"],
    jurisdiction: "United States",
  },
  manufacturing: {
    label: "Production-line inputs and accepted output",
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Labor", "Data Quality", "Unit Economics", "Supply Chain"],
    watch: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    receiving: ["Named U.S. manufacturing facilities and production lines"],
    jurisdiction: "United States",
  },
  infrastructure: {
    label: "Battery availability, dispatch, and corrective-action closure",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety", "Weather"],
    watch: ["Power and Grid", "Cross-Cutting Official Rails"],
    receiving: ["Named grid-scale battery-storage assets"],
    jurisdiction: "United States and Australia",
  },
  mobility: {
    label: "Carrier service-delivery denominators",
    topics: ["Mobility", "Aviation"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Regulation", "Safety", "Infrastructure", "Data Quality", "Public Trust"],
    watch: ["Mobility Certification", "Cross-Cutting Official Rails"],
    receiving: ["Named U.S. reporting operating air carriers"],
    jurisdiction: "United States",
  },
};

const newSources = [
  {
    id: "source-56f-nasa-open-recommendations-july-2026",
    title: "NASA OIG Open Recommendations Data - July 2026",
    publisher: "NASA Office of Inspector General",
    publicationDate: "2026-07-17",
    url: "https://oig.nasa.gov/audit-open-recommendations/",
    documentType: "Data Release",
    summary: "NASA OIG publishes monthly open-recommendation data and states that it closes a recommendation only after corrective actions are fully implemented and verified.",
    finding: "The July 2026 release supplies a current recommendation-level closure rail without converting an open or closed recommendation into a system-performance or mission-outcome measure.",
    limit: "The public landing page does not create a common FISMA, tested-system, incident, recovery, service, or mission denominator.",
    portfolio: "ai_cyber",
  },
  {
    id: "source-56f-va-ifams-access-controls-2026",
    title: "Audit of Integrated Financial and Acquisition Management System Access Controls",
    publisher: "Department of Veterans Affairs Office of Inspector General",
    publicationDate: "2026-02-17",
    url: "https://vaoig.gov/reports/audit/audit-integrated-financial-and-acquisition-management-system-access-controls",
    documentType: "Oversight Report",
    summary: "VA OIG evaluated whether iFAMS access controls sufficiently limited account privileges and protected sensitive acquisition information.",
    finding: "The audit reported that 91 percent of 2,818 users with access to Technology Acquisition Center data did not work for that center and issued three recommendations.",
    limit: "One named-system access-control audit does not substitute for the unreleased FY 2025 department-wide FISMA result or measure incidents, recovery, service, or veteran outcomes.",
    portfolio: "ai_cyber",
  },
  {
    id: "source-56f-doe-semiannual-march-2026",
    title: "DOE OIG Semiannual Report to Congress for the Period Ending March 31, 2026",
    publisher: "Department of Energy Office of Inspector General",
    publicationDate: "2026-05-29",
    url: "https://www.energy.gov/ig/articles/semiannual-report-congress-period-ending-march-31-2026",
    documentType: "Oversight Report",
    summary: "DOE OIG published its current semiannual inventory of oversight work through March 31, 2026.",
    finding: "The current oversight window does not supply the missing department-wide FY 2025 FISMA evaluation, so the exact annual outcome remains open.",
    limit: "A semiannual oversight inventory cannot be treated as proof that a specific annual evaluation, finding, or corrective action was completed.",
    portfolio: "ai_cyber",
  },
  {
    id: "source-56f-dot-fisma-fy2026-audit-start",
    title: "Audit Initiated of DOT's Information Security Program and Practices for Fiscal Year 2026",
    publisher: "Department of Transportation Office of Inspector General",
    publicationDate: "2026-03-09",
    url: "https://www.oig.dot.gov/library-item/47183",
    documentType: "Program Milestone",
    summary: "DOT OIG initiated the FY 2026 independent information-security review and named the annual effectiveness objective and selected-metric method.",
    finding: "The official initiation record closes the next-review identity, scope, and method question while leaving the FY 2026 result unavailable.",
    limit: "Audit initiation is not an audit result, recommendation closure, tested-control outcome, incident measure, or transportation-service effect.",
    portfolio: "ai_cyber",
  },
  {
    id: "source-56f-current-applications-workforce",
    title: "Jefferson County Largest Employers - Current Applications",
    publisher: "Jefferson County Economic Development",
    publicationDate: null,
    url: "https://jcida.com/strategic-advantages/largest-employers/",
    documentType: "Data Release",
    summary: "Jefferson County Economic Development lists Current Applications at its Watertown address with 60 manufacturing employees.",
    finding: "The current facility-level workforce count supplies one dated input denominator for the named manufacturer.",
    limit: "An employer count does not expose line-level labor hours, output, work in process, yield, scrap, downtime, delivery, demand, or causal effect.",
    portfolio: "manufacturing",
  },
  {
    id: "source-56f-island-components-scida-2023",
    title: "Suffolk County IDA 2023 Year-End Summary - Island Components Group",
    publisher: "Suffolk County Industrial Development Agency",
    publicationDate: "2024-04-01",
    url: "https://suffolkida.org/wp-content/uploads/2024/04/SCIDA-2023-Year-End-Report-For-WEB.pdf",
    documentType: "Program Milestone",
    summary: "The county IDA recorded Island Components' relocation from 7,500 to 14,200 square feet, a $2 million project, and 14 planned engineering and manufacturing positions.",
    finding: "The public record supplies facility, capital, space, and planned-job inputs for the Hauppauge operation.",
    limit: "The record does not expose repeated line output, labor hours, yield, defects, downtime, delivery, demand, realized job count, or independent productivity validation.",
    portfolio: "manufacturing",
  },
  {
    id: "source-56f-monaghan-esd-capital-2025",
    title: "Monaghan Medical Capital - Empire State Development Public Notice",
    publisher: "New York State Urban Development Corporation",
    publicationDate: "2025-10-29",
    url: "https://esd.ny.gov/sites/default/files/media/document/MonaghanMedicalLEGALNOTICE.pdf",
    documentType: "Regulatory Decision",
    summary: "Empire State Development proposed a $250,000 grant toward a $10 million larger-facility and machinery project with ten planned jobs.",
    finding: "The notice supplies a named capital, facility, machinery, and planned-workforce input for Monaghan Medical.",
    limit: "A proposed grant and project plan do not establish execution, expenditure, operating output, units distributed, yield, scrap, delivery, environmental performance, or patient outcome.",
    portfolio: "manufacturing",
  },
  {
    id: "source-56f-gao-weapon-systems-2026",
    title: "Weapon Systems Annual Assessment 2026",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2026-07-02",
    url: "https://www.gao.gov/products/gao-26-108457",
    documentType: "Oversight Report",
    summary: "GAO's 2026 annual assessment reviewed 104 major weapon programs and supplied a current KC-46A program profile.",
    finding: "For KC-46A, GAO reported 173 aircraft procured and 101 delivered as of January 2026 while required assets and subsystem deficiencies remained unresolved.",
    limit: "Program-level procurement, delivery, deficiency, and schedule records do not expose Everett monthly due dates, labor, rework, yield, quality escapes, or causal effects.",
    portfolio: "manufacturing",
  },
  {
    id: "source-56f-air-force-fy2027-aircraft-budget",
    title: "Department of the Air Force President's Budget Request FY 2027",
    publisher: "Department of the Air Force",
    publicationDate: "2026-04-01",
    url: "https://www.saffm.hq.af.mil/FM-Resources/Budget/Air-Force-Presidents-Budget-FY27/",
    documentType: "Budget Justification",
    summary: "The FY 2027 budget materials request 24 F-15EX fighters, 15 KC-46A tankers, and 38 F-35 fighters and preserve program-specific procurement exhibits.",
    finding: "The F-15EX procurement exhibit supplies planned quantities and delivery windows while keeping future budget requests separate from accepted aircraft.",
    limit: "Budget quantities and planned delivery dates are not monthly accepted output, line throughput, labor, rework, yield, cost performance, or realized schedule.",
    portfolio: "manufacturing",
  },
  {
    id: "source-56f-cpuc-gess-july-2026",
    title: "CPUC Generation and Energy Storage Team: Keeping California's Electric Grid Safe and Reliable",
    publisher: "California Public Utilities Commission",
    publicationDate: "2026-07-17",
    url: "https://www.cpuc.ca.gov/news-and-updates/all-news/cpuc-generation-and-energy-storage-team-keeping-californias-electric-grid-safe-and-reliable",
    documentType: "Program Milestone",
    summary: "CPUC described its current generation and storage audit process and confirmed that the January 2025 Vistra Moss Landing investigation remained ongoing.",
    finding: "The current regulator record verifies investigation status and the audit-to-corrective-action process without claiming final root cause or closure.",
    limit: "The team overview does not provide final investigation findings, generator-level availability, return to service, dispatch, duration, revenue, or customer outcomes.",
    portfolio: "infrastructure",
  },
  {
    id: "source-56f-vbb-esv-annual-closure-2022",
    title: "Energy Safe Victoria Annual Report 2021-22 - Victorian Big Battery Investigation",
    publisher: "Energy Safe Victoria",
    publicationDate: "2022-10-01",
    url: "https://www.energysafe.vic.gov.au/sites/default/files/2023-10/ESV-Annual-Report-2021-22_1.pdf",
    documentType: "Oversight Report",
    summary: "Energy Safe Victoria reported that required changes were made and that it was satisfied commissioning could safely recommence on September 29, 2021.",
    finding: "The regulator record closes the bounded recommissioning-action question and identifies further engineering work on fire-spread mitigation.",
    limit: "Permission to recommence commissioning does not establish later availability, dispatch, cycling, degradation, revenue, safety performance, or customer benefit.",
    portfolio: "infrastructure",
  },
  {
    id: "source-56f-dalrymple-arena-status-2026",
    title: "ARENA ESCRI Phase 2 Project Status",
    publisher: "Australian Renewable Energy Agency",
    publicationDate: "2026-04-16",
    url: "https://arena.gov.au/projects/energy-storage-for-commercial-renewable-integration-escri-phase-2/",
    documentType: "Program Milestone",
    summary: "ARENA's updated project page confirms the 30 MW / 8 MWh Dalrymple project ended on October 29, 2021 and links the four operational reports and final report.",
    finding: "The current official page fixes project identity, completion date, report inventory, ownership, and operating-party attribution.",
    limit: "The updated project page does not add post-2021 availability, dispatch, islanding, degradation, revenue, avoided-cost, reliability, or customer-outcome observations.",
    portfolio: "infrastructure",
  },
  {
    id: "source-56f-bts-technical-directive-40",
    title: "BTS Technical Reporting Directive 40 - On-Time Performance 2026",
    publisher: "Bureau of Transportation Statistics",
    publicationDate: "2026-01-12",
    url: "https://www.bts.gov/explore-topics-and-geography/modes/aviation/number-40-technical-directive-reporting-time",
    documentType: "Regulatory Decision",
    summary: "BTS Technical Directive 40 defines the 2026 reporting-carrier threshold, reportable airports, data requirements, and the operating carriers required to file on-time performance data.",
    finding: "The directive names Alaska, American, Delta, JetBlue, Southwest, and United as 2026 reporting carriers and closes the reporting-contract denominator for the six-carrier rail.",
    limit: "A reporting obligation does not provide a full-year outcome, explain causes, verify remedies, or make carriers comparable across network and identity breaks.",
    portfolio: "mobility",
  },
  {
    id: "source-56f-bts-may-2026-data",
    title: "Airline Service Quality Performance Data - May 2026",
    publisher: "Bureau of Transportation Statistics",
    publicationDate: "2026-06-30",
    url: "https://www.bts.gov/newsroom/airline-service-quality-performance-data-may-2026",
    documentType: "Data Release",
    summary: "BTS released May 2026 on-time, baggage, wheelchair, and scooter data and linked the reporting- and marketing-carrier TranStats datasets.",
    finding: "The release establishes the current monthly data window and the flight-level data rail for all six carriers.",
    limit: "The May release is not a 2026 full-year denominator, independent causal assessment, complaint-resolution record, or verified remedy-delivery measure.",
    portfolio: "mobility",
  },
];

const coverage = [
  {
    portfolio: "ai_cyber", cohort: "56B", slug: "nasa", entityId: "agency-nasa", entityName: "National Aeronautics and Space Administration",
    sourceId: "source-56f-nasa-open-recommendations-july-2026", priority: "FY 2026 FISMA result and recommendation-level closure",
    strongestEvidence: "NASA OIG's July 2026 open-recommendation data provides a current, verifier-controlled closure rail.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The recommendation-status mechanism and current month are closed; the FY 2026 annual result and downstream operating outcomes remain open.",
    remainingGap: "FY 2026 FISMA result, tested-system coverage, incidents, recovery, service effects, and mission outcomes.",
    reopeningRule: "Reopen when NASA OIG publishes the FY 2026 FISMA evaluation or recommendation-level cyber closure data with tested-system scope.",
  },
  {
    portfolio: "ai_cyber", cohort: "56B", slug: "dhs", entityId: "agency-dhs", entityName: "Department of Homeland Security",
    sourceId: "source-56d-dhs-fisma-fy2025-project", priority: "Released FY 2025 enterprise FISMA result",
    strongestEvidence: "DHS OIG's official project record identifies the FY 2025 enterprise review but does not expose the completed annual result.",
    closureStatus: "Open", recordStatus: "In Review",
    decision: "The review identity is known, but the required annual outcome cannot be closed from a project-status record.",
    remainingGap: "Released FY 2025 evaluation, component findings, closure dates, endpoint and cloud coverage, incidents, recovery, and service effects.",
    reopeningRule: "Reopen when DHS OIG publishes the final FY 2025 enterprise evaluation or a dated replacement outcome.",
  },
  {
    portfolio: "ai_cyber", cohort: "56B", slug: "hhs", entityId: "agency-hhs", entityName: "Department of Health and Human Services",
    sourceId: "source-56d-hhs-fisma-recommendations-tracker-2026", priority: "Recommendation-level closure after the FY 2025 review",
    strongestEvidence: "HHS OIG's tracker records all ten FY 2025 report recommendations as open and unimplemented at capture.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The recommendation-level closure state is visible; operating-division control operation and downstream outcomes remain unresolved.",
    remainingGap: "Dated closures, component control tests, incidents, recovery, affected services, and health-program outcomes.",
    reopeningRule: "Reopen when the HHS OIG tracker changes a FY 2025 recommendation status or a component control test is published.",
  },
  {
    portfolio: "manufacturing", cohort: "56B", slug: "current-applications", entityId: "manufacturer-current-applications-watertown-ny", entityName: "Current Applications",
    sourceId: "source-56f-current-applications-workforce", priority: "Current facility workforce denominator paired with repeat same-line output",
    strongestEvidence: "Jefferson County Economic Development lists 60 manufacturing employees at the Watertown facility.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "One current facility labor denominator is now public, but it cannot be paired with compatible same-line output.",
    remainingGap: "Line output, labor hours, WIP, yield, scrap, downtime, cost, delivery, demand, and dated capital execution.",
    reopeningRule: "Reopen when a dated company, MEP, grant, or customer record reports same-line input and output under a declared window.",
  },
  {
    portfolio: "manufacturing", cohort: "56B", slug: "island-components", entityId: "manufacturer-island-components-hauppauge-ny", entityName: "Island Components Group",
    sourceId: "source-56f-island-components-scida-2023", priority: "Realized facility, capital, and employment inputs paired with repeat output",
    strongestEvidence: "Suffolk County IDA records the larger Hauppauge facility, project cost, and planned job increment.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "Facility-space, capital, and planned-workforce inputs are bounded; repeat production and realized job outcomes remain unavailable.",
    remainingGap: "Realized jobs, output, labor hours, WIP, yield, defects, downtime, delivery, demand, and independent surveillance findings.",
    reopeningRule: "Reopen when SCIDA, the company, a registrar, or a customer publishes a dated realized outcome for the Hauppauge operation.",
  },
  {
    portfolio: "manufacturing", cohort: "56B", slug: "monaghan-medical", entityId: "manufacturer-monaghan-medical-plattsburgh-ny", entityName: "Monaghan Medical",
    sourceId: "source-56f-monaghan-esd-capital-2025", priority: "Executed facility and machinery investment paired with units distributed or line output",
    strongestEvidence: "Empire State Development records a proposed $10 million facility and machinery project with ten planned jobs.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The named investment input is public, while execution and output denominators remain unverified.",
    remainingGap: "Grant execution, facility operation, machinery in service, realized jobs, units distributed, same-line output, yield, scrap, delivery, and patient outcomes.",
    reopeningRule: "Reopen when ESD records disbursement or completion, or FDA/company records expose units distributed and a compatible production window.",
  },
  {
    portfolio: "infrastructure", cohort: "56B", slug: "moss-landing", entityId: "eia-plant-260", entityName: "Dynegy Moss Landing Power Plant Hybrid",
    sourceId: "source-56f-cpuc-gess-july-2026", priority: "Final regulator investigation and corrective-action closure",
    strongestEvidence: "CPUC confirms that its Vistra Moss Landing investigation remains ongoing and explains the audit-to-corrective-action process.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "Current regulator status is closed as ongoing; root cause, complete corrective action, and operating restoration are not.",
    remainingGap: "Final investigation, corrective-action closure, generator identity, return to service, availability, dispatch, duration, revenue, and reliability effects.",
    reopeningRule: "Reopen when CPUC publishes the formal investigation or audit report, facility response, or closure notice.",
  },
  {
    portfolio: "infrastructure", cohort: "56B", slug: "manatee", entityId: "eia-plant-60014", entityName: "Manatee Solar Energy Center",
    sourceId: "source-56d-manatee-fpl-data-request-2025", priority: "Interval dispatch and availability for the named battery",
    strongestEvidence: "FPL's filed response preserves the named asset and operator-stated siting logic but does not expose interval operation.",
    closureStatus: "Open", recordStatus: "In Review",
    decision: "No compatible public interval dispatch or availability series was identified; another planning or capacity record would not close the gap.",
    remainingGap: "Interval dispatch, availability, cycles, state of charge, degradation, revenue, curtailment, outage response, and customer cost.",
    reopeningRule: "Reopen when FPL, Florida PSC, EIA, or a balancing authority publishes asset-specific operating data with a declared interval.",
  },
  {
    portfolio: "infrastructure", cohort: "56B", slug: "gateway", entityId: "eia-plant-63834", entityName: "Gateway Energy Storage System",
    sourceId: "source-56d-gateway-cpuc-resolution-e5428-2025", priority: "Final investigation and full contracted-capacity restoration",
    strongestEvidence: "CPUC Resolution E-5428 records ongoing investigations, partial return to service, and a later contractual delivery window.",
    closureStatus: "Open", recordStatus: "In Review",
    decision: "The partial operating state is known, but final root cause, full restoration, and operating performance remain open.",
    remainingGap: "Final investigation, full return to service, contracted-capacity restoration, availability, dispatch, duration, degradation, revenue, and reliability effects.",
    reopeningRule: "Reopen when CPUC, EPA, CAISO, SCE, or the operator publishes final findings or a full-capacity operating record.",
  },
  {
    portfolio: "mobility", cohort: "56B", slug: "united-airlines", entityId: "dot-operating-carrier-united-airlines", entityName: "United Airlines",
    sourceId: "source-56f-bts-may-2026-data", priority: "2026 full-year operating denominator and cause-controlled service outcomes",
    strongestEvidence: "BTS exposes the current May 2026 flight-level data rail under the 2026 reporting contract.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The reporting contract and current monthly data window are closed; the full-year denominator and remedy verification are not.",
    remainingGap: "2026 full-year operations, delay causes, route and airport controls, complaints, accessibility, commitment compliance, and revisions.",
    reopeningRule: "Reopen after BTS publishes December 2026 data and DOT issues the full-year 2026 reporting tables.",
  },
  {
    portfolio: "mobility", cohort: "56B", slug: "southwest-airlines", entityId: "dot-operating-carrier-southwest-airlines", entityName: "Southwest Airlines",
    sourceId: "source-56f-bts-may-2026-data", priority: "2026 full-year operating denominator and cause-controlled service outcomes",
    strongestEvidence: "BTS exposes the current May 2026 flight-level data rail under the 2026 reporting contract.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The reporting contract and current monthly data window are closed; the full-year denominator and remedy verification are not.",
    remainingGap: "2026 full-year operations, delay causes, route and airport controls, complaints, accessibility, commitment compliance, and revisions.",
    reopeningRule: "Reopen after BTS publishes December 2026 data and DOT issues the full-year 2026 reporting tables.",
  },
  {
    portfolio: "mobility", cohort: "56B", slug: "delta-air-lines", entityId: "dot-operating-carrier-delta-air-lines", entityName: "Delta Air Lines",
    sourceId: "source-56f-bts-may-2026-data", priority: "2026 full-year operating denominator and cause-controlled service outcomes",
    strongestEvidence: "BTS exposes the current May 2026 flight-level data rail under the 2026 reporting contract.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The reporting contract and current monthly data window are closed; the full-year denominator and remedy verification are not.",
    remainingGap: "2026 full-year operations, delay causes, route and airport controls, complaints, accessibility, commitment compliance, and revisions.",
    reopeningRule: "Reopen after BTS publishes December 2026 data and DOT issues the full-year 2026 reporting tables.",
  },
  {
    portfolio: "ai_cyber", cohort: "56E", slug: "va", entityId: "agency-va", entityName: "Department of Veterans Affairs",
    sourceId: "source-56f-va-ifams-access-controls-2026", priority: "FY 2025 FISMA result plus named-system control operation",
    strongestEvidence: "VA OIG's iFAMS audit supplies a named-system access population and three corrective recommendations.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "A specific access-control operation record is now public; the department-wide FY 2025 result and downstream effects remain open.",
    remainingGap: "FY 2025 FISMA result, recommendation closure, incidents, recovery, affected services, and veteran outcomes.",
    reopeningRule: "Reopen when VA OIG publishes the FY 2025 FISMA audit or closes the named iFAMS recommendations.",
  },
  {
    portfolio: "ai_cyber", cohort: "56E", slug: "doe", entityId: "agency-doe", entityName: "Department of Energy",
    sourceId: "source-56f-doe-semiannual-march-2026", priority: "Department-wide FY 2025 FISMA evaluation",
    strongestEvidence: "DOE OIG's current semiannual window lists oversight through March 2026 without supplying the missing department-wide annual result.",
    closureStatus: "Open", recordStatus: "In Review",
    decision: "The current oversight window is known, but absence from a summary page cannot be converted into a completed annual finding.",
    remainingGap: "FY 2025 FISMA evaluation, finding-level closure, incidents, recovery, and laboratory or mission effects.",
    reopeningRule: "Reopen when DOE OIG publishes the department-wide FY 2025 FISMA evaluation or a dated official status for that review.",
  },
  {
    portfolio: "ai_cyber", cohort: "56E", slug: "dot", entityId: "agency-dot", entityName: "Department of Transportation",
    sourceId: "source-56f-dot-fisma-fy2026-audit-start", priority: "FY 2026 annual review and closure evidence",
    strongestEvidence: "DOT OIG identifies the FY 2026 annual review, selected-metric method, and effectiveness objective.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The next review's identity, scope, and method are closed; the annual result and recommendation closures are not.",
    remainingGap: "FY 2026 result, monitoring-recommendation closure, incidents, recovery, affected transportation services, and mission outcomes.",
    reopeningRule: "Reopen when DOT OIG publishes the FY 2026 quality-control review or a dated recommendation closure.",
  },
  {
    portfolio: "manufacturing", cohort: "56E", slug: "f35-fort-worth", entityId: "manufacturer-lockheed-f35-fort-worth", entityName: "Lockheed Martin F-35 Fort Worth final-assembly line",
    sourceId: "source-56e-f35-gao-2025", priority: "Aircraft due versus accepted by month with capability state",
    strongestEvidence: "GAO reports annual lateness and accepted non-combat-capable TR-3 aircraft but not a public monthly due-versus-accepted line series.",
    closureStatus: "Open", recordStatus: "In Review",
    decision: "The exact monthly production-line denominator remains unavailable; a budget quantity or fleet sustainment metric would not close it.",
    remainingGap: "Monthly aircraft due and accepted, capability state, labor, rework, yield, line inventory, and supplier constraints.",
    reopeningRule: "Reopen when the F-35 program office, DOD, GAO, or Lockheed publishes a month-level due-and-accepted series with capability state.",
  },
  {
    portfolio: "manufacturing", cohort: "56E", slug: "kc46-everett", entityId: "manufacturer-boeing-kc46-everett", entityName: "Boeing KC-46A Everett production line",
    sourceId: "source-56f-gao-weapon-systems-2026", priority: "Procured, due, delivered, and accepted aircraft under one current denominator",
    strongestEvidence: "GAO reports 173 procured and 101 delivered aircraft as of January 2026 and identifies still-missing required assets.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "A current procured-versus-delivered program denominator is closed; Everett monthly due dates, quality, and rework remain unavailable.",
    remainingGap: "Monthly due and accepted aircraft, rework, quality escapes, labor, modification hours, cost, and deficiency closure.",
    reopeningRule: "Reopen when GAO or the Air Force publishes another program profile or a monthly line delivery and acceptance table.",
  },
  {
    portfolio: "manufacturing", cohort: "56E", slug: "f15ex-st-louis", entityId: "manufacturer-boeing-f15ex-st-louis", entityName: "Boeing F-15EX St. Louis production line",
    sourceId: "source-56f-air-force-fy2027-aircraft-budget", priority: "Monthly planned and accepted deliveries after the 2025 restart",
    strongestEvidence: "The FY 2027 procurement exhibits supply planned quantities and delivery windows for later lots.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The official planned-input and delivery-window record is closed; realized post-restart monthly acceptance and line performance are not.",
    remainingGap: "Monthly planned and accepted deliveries, labor, rework, yield, supplier constraints, cost, and quality findings.",
    reopeningRule: "Reopen when the Air Force, DCMA, GAO, or Boeing publishes realized post-restart delivery and acceptance dates.",
  },
  {
    portfolio: "infrastructure", cohort: "56E", slug: "hornsdale", entityId: "battery-hornsdale-power-reserve", entityName: "Hornsdale Power Reserve",
    sourceId: "source-56e-hornsdale-sa-current", priority: "Annual availability and dispatch under a declared service denominator",
    strongestEvidence: "The state profile fixes current 150 MW installed power and service descriptions but not annual availability or dispatch.",
    closureStatus: "Open", recordStatus: "In Review",
    decision: "No public asset-specific annual availability and dispatch series was identified; installed capacity is not a substitute.",
    remainingGap: "Annual availability, dispatch, service enablement and delivery, cycling, degradation, revenue, safety, and customer outcomes.",
    reopeningRule: "Reopen when AEMO, AER, the South Australian government, or the operator publishes an asset-specific annual operating series.",
  },
  {
    portfolio: "infrastructure", cohort: "56E", slug: "victorian-big-battery", entityId: "battery-victorian-big-battery", entityName: "Victorian Big Battery",
    sourceId: "source-56f-vbb-esv-annual-closure-2022", priority: "Corrective-action closure after the commissioning fire",
    strongestEvidence: "Energy Safe Victoria states that required changes were made and it was satisfied commissioning could safely recommence on September 29, 2021.",
    closureStatus: "Closed", recordStatus: "Published",
    decision: "The bounded recommissioning-action question is closed; later operating and safety outcomes remain separate.",
    remainingGap: "Annual availability, dispatch, cycling, degradation, later incidents, revenue, scheme activation, and customer effects.",
    reopeningRule: "Reopen if ESV publishes a later enforcement or incident record, or AEMO publishes an asset-specific operating series.",
  },
  {
    portfolio: "infrastructure", cohort: "56E", slug: "dalrymple", entityId: "battery-dalrymple-escri-sa", entityName: "Dalrymple ESCRI-SA Battery Energy Storage System",
    sourceId: "source-56f-dalrymple-arena-status-2026", priority: "Post-project availability, dispatch, and islanding events",
    strongestEvidence: "ARENA's April 2026 update confirms project completion and the final public report inventory but supplies no post-2021 observation.",
    closureStatus: "Open", recordStatus: "In Review",
    decision: "The project-status and report-boundary questions are closed; the requested later operating series remains absent.",
    remainingGap: "Post-2021 availability, dispatch, islanding, state of charge, degradation, revenue, reliability, and customer outcomes.",
    reopeningRule: "Reopen when ElectraNet, AGL, AEMO, ARENA, or the South Australian regulator publishes a later asset-specific record.",
  },
  {
    portfolio: "mobility", cohort: "56E", slug: "american-airlines", entityId: "carrier-american-airlines", entityName: "American Airlines",
    sourceId: "source-56f-bts-technical-directive-40", priority: "Later full-year cancellation rate under the 2026 operating-carrier contract",
    strongestEvidence: "BTS Technical Directive 40 names American as a 2026 reporting carrier and fixes the on-time reporting contract.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The reporting denominator is closed; the 2026 full-year outcome and verified remedy delivery are not yet available.",
    remainingGap: "Full-year cancellation rate, flight-level cause and network controls, eligible disruptions, and verified remedies.",
    reopeningRule: "Reopen after BTS publishes December 2026 data and DOT issues the full-year 2026 tables.",
  },
  {
    portfolio: "mobility", cohort: "56E", slug: "alaska-airlines", entityId: "carrier-alaska-airlines", entityName: "Alaska Airlines",
    sourceId: "source-56f-bts-technical-directive-40", priority: "Post-integration full-year operating denominator",
    strongestEvidence: "BTS Technical Directive 40 names Alaska and Hawaiian separately in the reporting list while the operating-certificate break remains disclosed in the entity record.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The 2026 reporting contract is closed; a full-year post-certificate operating and brand attribution denominator is not.",
    remainingGap: "Post-integration full-year denominator, brand and operating attribution, causes, complaints, and verified remedies.",
    reopeningRule: "Reopen after BTS publishes full-year 2026 tables with the Alaska-Hawaiian reporting treatment and any revisions.",
  },
  {
    portfolio: "mobility", cohort: "56E", slug: "jetblue-airways", entityId: "carrier-jetblue-airways", entityName: "JetBlue Airways",
    sourceId: "source-56f-bts-technical-directive-40", priority: "Later full-year cancellation and schedule denominator",
    strongestEvidence: "BTS Technical Directive 40 names JetBlue as a 2026 reporting carrier and fixes the reporting threshold and airport scope.",
    closureStatus: "Partially Closed", recordStatus: "Published",
    decision: "The reporting denominator is closed; the full-year outcome and cause-controlled interpretation remain unavailable.",
    remainingGap: "Full-year cancellations and schedule, route and airport mix, weather, maintenance, crew controls, complaints, and verified remedies.",
    reopeningRule: "Reopen after BTS publishes December 2026 data and DOT issues the full-year 2026 tables.",
  },
];

for (const directory of ["sources", "research-documents", "signals", "briefings", "research-collections", "updates"]) {
  await mkdir(join(contentRoot, directory), { recursive: true });
}
await mkdir(dataRoot, { recursive: true });

for (const source of newSources) {
  const defaults = portfolioDefaults[source.portfolio];
  await writeFile(join(contentRoot, "sources", `${source.id}.json`), json({
    id: source.id,
    name: source.title,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: defaults.topics,
    framework_layers: defaults.layers,
    country_or_region: defaults.jurisdiction,
    update_frequency: source.id.includes("bts-") ? "Monthly" : "Event-driven",
    capture_priority: "High",
    known_limitations: `${source.limit} Phase 56F keeps entity, scope, unit, denominator, method, attribution, observation window, and reopening rule attached.`,
    last_checked_date: capturedDate,
    watch_lanes: defaults.watch,
    live_access_type: source.url.toLowerCase().includes(".pdf") ? "Data Download" : "Release Page",
    ...(source.url.toLowerCase().includes(".pdf") ? { data_download_url: source.url } : {}),
    review_cadence_days: 60,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: defaults.jurisdiction,
    source_owner: source.publisher,
    notes: `Phase 56F cross-cohort closure source. Collection: ${collectionSlug}.`,
  }), "utf8");
}

const sourceById = new Map(newSources.map((source) => [source.id, source]));
const existingSourceFiles = await Promise.all(
  coverage
    .filter((entry) => !sourceById.has(entry.sourceId))
    .map(async (entry) => {
      const source = JSON.parse(await readFile(join(contentRoot, "sources", `${entry.sourceId}.json`), "utf8"));
      return [entry.sourceId, {
        id: entry.sourceId,
        title: source.name,
        publisher: source.source_owner ?? source.name,
        publicationDate: source.last_checked_date ?? capturedDate,
        url: source.url,
        documentType: "Data Release",
        summary: entry.strongestEvidence,
        finding: entry.decision,
        limit: entry.remainingGap,
        portfolio: entry.portfolio,
      }];
    }),
);
for (const [id, source] of existingSourceFiles) sourceById.set(id, source);

for (const [index, entry] of coverage.entries()) {
  const defaults = portfolioDefaults[entry.portfolio];
  const source = sourceById.get(entry.sourceId);
  const archiveName = `${String(index + 1).padStart(2, "0")}-${entry.slug}-coverage-decision.txt`;
  await writeFile(join(contentRoot, "research-documents", `${324 + index}-56f-${entry.slug}-coverage-decision.json`), json({
    id: `research-doc-56f-${entry.slug}-coverage-decision`,
    collection_id: collectionId,
    title: `${entry.entityName}: Phase 56F Coverage Decision`,
    slug: `56f-${entry.slug}-coverage-decision`,
    record_status: entry.recordStatus,
    publisher: source.publisher,
    publication_date: source.publicationDate,
    document_type: source.documentType,
    summary: `${entry.strongestEvidence} Phase 56F decision: ${entry.decision}`,
    key_findings: [
      `Highest-value missing record: ${entry.priority}.`,
      `Closure status: ${entry.closureStatus}.`,
      `Remaining gap: ${entry.remainingGap}`,
    ],
    why_it_matters: "The coverage decision prevents broad context from displacing the one operating or closure record that would materially deepen the named entity.",
    ftfn_relevance: [
      `Preserves the stable entity ID ${entry.entityId}.`,
      "Separates current evidence from the missing record.",
      "Names the exact condition that can reopen the decision.",
    ],
    evidence_limits: [
      source.limit,
      entry.remainingGap,
      "No causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is supported.",
    ],
    primary_topics: defaults.topics,
    framework_layers: defaults.layers,
    constraint_tags: defaults.constraints,
    source_id: entry.sourceId,
    official_url: source.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  }), "utf8");
}

const portfolioSignalIds = [];
for (const [portfolio, defaults] of Object.entries(portfolioDefaults)) {
  const records = coverage.filter((entry) => entry.portfolio === portfolio);
  const closed = records.filter((entry) => entry.closureStatus === "Closed").length;
  const partial = records.filter((entry) => entry.closureStatus === "Partially Closed").length;
  const open = records.filter((entry) => entry.closureStatus === "Open").length;
  const signalId = `signal-56f-${portfolio.replace("_", "-")}-coverage-closure`;
  portfolioSignalIds.push(signalId);
  await writeFile(join(contentRoot, "signals", `${signalId}.mdx`), `---
id: ${yaml(signalId)}
title: ${yaml(`${defaults.label}: the coverage ledger separates closed, partial, and open records`)}
slug: ${yaml(signalId.replace("signal-", ""))}
record_status: "Published"
summary: ${yaml(`Across six named entities, ${closed} record is closed, ${partial} are partially closed, and ${open} remain open under explicit reopening rules.`)}
source_ids:
${yamlArray(addUnique(records.map((entry) => entry.sourceId)))}
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
why_it_matters: "The portfolio can direct research toward exact missing operating records without pretending that all entities or measures are comparable."
dependencies:
  - "stable entity identity"
  - "one named highest-value missing record"
  - "record-level closure status"
  - "explicit reopening rule"
constraints:
${yamlArray(defaults.constraints)}
receiving_systems:
${yamlArray(defaults.receiving)}
local_implications:
  - "Research effort can move to the next exact closure record without adding generic context."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: "Publish the coverage state and bounded closure only. Do not rank entities or treat open records as negative performance."
---

## Coverage result

- Closed: ${closed}
- Partially closed: ${partial}
- Open: ${open}

${records.map((entry) => `### ${entry.entityName}

**Highest-value record:** ${entry.priority}

**Status:** ${entry.closureStatus}

${entry.decision}

**Reopen when:** ${entry.reopeningRule}`).join("\n\n")}

## Publication boundary

An open record is an evidence state, not an entity score. Different units, methods, scopes, and observation windows remain non-comparable.
`, "utf8");
}

const holdSignalId = "signal-56f-cross-cohort-comparison-hold";
await writeFile(join(contentRoot, "signals", `${holdSignalId}.mdx`), `---
id: "${holdSignalId}"
title: "Twenty-four coverage decisions do not create a cross-cohort ranking"
slug: "56f-cross-cohort-comparison-hold"
record_status: "In Review"
summary: "Closed, partially closed, and open evidence states describe record availability and compatibility, not entity performance."
source_ids:
${yamlArray(newSources.map((source) => source.id))}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: "Policy and Standards"
framework_layers:
  - "Enabling Infrastructure"
  - "Human Systems"
signal_type: "Market Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The explicit hold prevents research completeness from becoming a league table or readiness score."
dependencies:
  - "common unit and denominator"
  - "compatible method and observation window"
  - "stable attribution"
  - "matched closure definition"
constraints:
  - "Data Quality"
  - "Standards"
  - "Public Trust"
receiving_systems:
  - "Twenty-four named entities across two cohorts"
local_implications:
  - "Coverage completeness remains an editorial control rather than a performance measure."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: "Hold unless entities share a genuinely common measurement and closure contract. Do not score evidence availability."
---

## Why this remains held

Phase 56F records whether the single highest-value missing record for each entity is closed, partially closed, or open. Those states depend on public disclosure, record timing, source architecture, and the selected research question.

They do not measure entity performance.

## Publication boundary

No cross-cohort ranking, completeness score, readiness score, causal conclusion, or inference from missing disclosure is authorized.
`, "utf8");

const documentIds = coverage.map((entry) => `research-doc-56f-${entry.slug}-coverage-decision`);
await writeFile(join(contentRoot, "research-collections", `${collectionSlug}.json`), json({
  id: collectionId,
  title: "Cross-Cohort Coverage and Missing-Record Closure, 2010-2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Twenty-four entity-specific coverage decisions identify the strongest current operating evidence, one highest-value missing record, a closure state, and an exact reopening rule.",
  scope: "Six federal agencies, six named manufacturers or production lines, six battery assets, and six reporting operating carriers across the Phase 56B and Phase 56E cohorts.",
  captured_date: capturedDate,
  document_ids: documentIds,
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 27-file archive contains 24 official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Coverage status measures evidence closure, not entity performance. Exact closures, partial closures, and open records preserve identity, attribution, unit, denominator, method, observation window, and reopening rule. No ranking, composite score, readiness score, causal effect, or inference from missing disclosure is supported.",
}), "utf8");

await writeFile(join(dataRoot, "phase-56f-cross-cohort-coverage.json"), json({
  phase: "56F",
  captured_date: capturedDate,
  entity_count: coverage.length,
  cohort_counts: {
    phase_56b: coverage.filter((entry) => entry.cohort === "56B").length,
    phase_56e: coverage.filter((entry) => entry.cohort === "56E").length,
  },
  closure_counts: {
    closed: coverage.filter((entry) => entry.closureStatus === "Closed").length,
    partially_closed: coverage.filter((entry) => entry.closureStatus === "Partially Closed").length,
    open: coverage.filter((entry) => entry.closureStatus === "Open").length,
  },
  publication_counts: {
    published: coverage.filter((entry) => entry.recordStatus === "Published").length,
    in_review: coverage.filter((entry) => entry.recordStatus === "In Review").length,
  },
  coverage: coverage.map((entry) => ({
    coverage_id: `coverage-56f-${entry.slug}`,
    portfolio: entry.portfolio,
    cohort: entry.cohort,
    entity_id: entry.entityId,
    entity_name: entry.entityName,
    highest_value_missing_record: entry.priority,
    strongest_current_evidence: entry.strongestEvidence,
    selected_source_id: entry.sourceId,
    closure_status: entry.closureStatus,
    record_status: entry.recordStatus,
    decision: entry.decision,
    remaining_gap: entry.remainingGap,
    reopening_rule: entry.reopeningRule,
    comparison_boundary: "Coverage status is not entity performance and cannot be ranked or scored.",
  })),
}), "utf8");

await writeFile(join(dataRoot, "phase-56f-publication-review.json"), json({
  phase: "56F",
  reviewed_date: capturedDate,
  source_profiles_added: newSources.length,
  entity_count: coverage.length,
  document_decisions: {
    reviewed: coverage.length,
    promoted: coverage.filter((entry) => entry.recordStatus === "Published").map((entry) => `research-doc-56f-${entry.slug}-coverage-decision`),
    held: coverage.filter((entry) => entry.recordStatus === "In Review").map((entry) => `research-doc-56f-${entry.slug}-coverage-decision`),
  },
  signal_decisions: {
    reviewed: portfolioSignalIds.length + 1,
    promoted: portfolioSignalIds,
    held: [holdSignalId],
  },
  priority_rule: "Every entity has exactly one highest-value missing operating or closure record.",
  closure_rule: "Closed, Partially Closed, and Open describe evidence state only; unavailable records retain a named source and reopening rule.",
  publication_rule: "Publish only independently useful record-level or portfolio coverage findings; hold unresolved exact-record claims and all cross-cohort comparisons.",
  comparison_rule: "No causal effect, ranking, completeness score, composite score, readiness score, or unsupported cross-entity comparison is permitted.",
}), "utf8");

await writeFile(join(contentRoot, "briefings", "briefing-research-watch-010-cross-cohort-coverage.mdx"), `---
id: "${briefingId}"
title: "Research Watch 010: Cross-Cohort Coverage and Missing-Record Closure"
slug: "research-watch-010-cross-cohort-coverage"
record_status: "Published"
summary: "One coverage ledger now governs all 24 named entities: one record is closed, sixteen are partially closed, and seven remain open under named reopening rules."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlArray([...portfolioSignalIds, holdSignalId])}
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
  - "All 24 entities have exactly one highest-value missing record and an explicit reopening rule."
  - "One bounded corrective-action record is closed, sixteen are partially closed, and seven remain open."
  - "Seventeen entity coverage documents publish and seven exact-record claims remain In Review."
  - "Coverage status measures evidence state, not entity performance."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
  - "Unit Economics"
what_to_watch_next:
  - "Annual agency results and recommendation-level closure."
  - "Same-line inputs, accepted output, quality, and cost."
  - "Battery availability, dispatch, restoration, and final investigation records."
  - "Full-year carrier denominators, identity treatment, causes, and verified remedies."
---

## The 24-entity ledger

Phase 56F converts two vertical cohorts into one closure program. Each entity now has a strongest current record, one highest-value missing record, a closure state, and a reopening rule.

## Closure result

- Closed: 1
- Partially closed: 16
- Open: 7

The closed record is the Victorian Big Battery's bounded recommissioning-action question. It does not close later operating or safety outcomes.

## Publication result

Seventeen entity coverage documents and all four portfolio coverage findings publish. Seven exact-record claims and the cross-cohort comparison remain In Review.

## Publication boundary

Coverage state depends on disclosure, timing, source architecture, and the selected research question. It is not a measure of performance, readiness, quality, safety, or value.
`, "utf8");

await writeFile(join(contentRoot, "updates", "2026-07-24-phase-56f-cross-cohort-coverage.json"), json({
  id: "update-2026-07-24-phase-56f-cross-cohort-coverage",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56F creates a 24-entity coverage and closure ledger",
  summary: "FTFN adds 14 official source profiles, 24 entity coverage decisions, four Published portfolio findings, one held cross-cohort comparison, Research Watch 010, and explicit reopening rules.",
  affected_record_ids: [
    collectionId,
    briefingId,
    ...portfolioSignalIds,
    holdSignalId,
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-010-cross-cohort-coverage/",
  ],
  evidence_note: "One bounded record is closed, sixteen are partially closed, and seven remain open. Coverage status is not entity performance and cannot be ranked or scored.",
  work_package: "docs/work-packages/phase-56f-cross-cohort-coverage-missing-record-closure.md",
}), "utf8");

console.log(`Generated Phase 56F: ${newSources.length} source profiles, ${coverage.length} coverage documents, ${portfolioSignalIds.length} Published portfolio signals, and one held comparison signal.`);
