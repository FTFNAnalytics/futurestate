import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const publicRoot = join(appRoot, "public");
const capturedDate = "2026-07-25";
const collectionSlug = "evidence-value-continuation-queue-batch-one-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-014-evidence-value-continuation";

const portfolioDefaults = {
  ai_cyber: {
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    country: "United States",
    jurisdiction: "United States federal government",
  },
  infrastructure: {
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    country: "United States",
    jurisdiction: "United States electric power system",
  },
  manufacturing: {
    topics: ["Advanced Manufacturing", "Aviation"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
    watchLanes: ["AI and Advanced Manufacturing", "Mobility Certification"],
    country: "United States",
    jurisdiction: "United States defense aviation acquisition",
  },
};

const records = [
  {
    slug: "manatee-eia923-plant-operation",
    documentNumber: 381,
    coverageId: "coverage-56f-manatee",
    entityId: "eia-plant-60014",
    entityName: "Manatee Solar Energy Center",
    portfolio: "infrastructure",
    sourceId: "source-56j-manatee-eia923-plant-60014",
    sourceName: "EIA-923 May 2026 Energy Storage Rows — Plant 60014",
    url: "https://www.eia.gov/electricity/data/eia923/xls/f923_2026.zip",
    publisher: "U.S. Energy Information Administration",
    publicationDate: "2026-07-23",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Data Download",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Asset-specific operating input and output under the current monthly survey",
    finding:
      "The EIA-923 energy-storage worksheet identifies plant 60014 as Manatee Solar Energy Center. Its battery row reports January-May 2026 monthly charging-energy quantities of 7,082, 7,188, 10,333, 11,364, and 9,375 MWh; gross generation of 5,755, 4,778, 9,005, 9,439, and 8,751 MWh; and reported net generation of -1,327, -2,140, -1,328, -1,924, and -624 MWh.",
    decision:
      "Move the selected evidence state from Open to Partially Closed. The named asset now has an official monthly operating record, but the record does not supply interval dispatch, availability, state of charge, cycling, degradation, revenue, or customer outcomes.",
    remainingGap:
      "Interval dispatch, availability, cycles, state of charge, degradation, revenue, curtailment, outage response, revisions, and customer cost.",
    reopeningRule:
      "Reopen when FPL, Florida PSC, EIA, or a balancing authority publishes plant 60014 interval dispatch or availability under a declared denominator.",
    limitation:
      "The EIA survey row is monthly, subject to revision, and does not expose interval dispatch or availability. Its quantity-consumed, gross-generation, and net-generation fields must not be converted into an efficiency claim without reconciling the survey definitions and reported totals.",
    evidenceQuality: "Official Data",
    verificationStatus: "Verified Against Primary Source",
    sourceRoles: ["Primary Data", "Source Freshness"],
    signal: {
      id: "signal-56j-manatee-monthly-operation",
      title: "Manatee now has a named monthly operating record",
      slug: "56j-manatee-monthly-operation",
      status: "Published",
      summary:
        "EIA-923 plant 60014 supplies January-May 2026 monthly charging and generation fields for Manatee, moving the selected record from Open to Partially Closed while interval availability remains unresolved.",
      body:
        "The official EIA-923 energy-storage worksheet identifies plant 60014 and supplies monthly battery input, gross-generation, and net-generation fields through May 2026. This is the first selected asset-specific operating observation in the rail. It does not expose interval dispatch, availability, state of charge, cycling, degradation, revenue, or customer outcomes.",
    },
  },
  {
    slug: "dalrymple-aemo-march-constraint",
    documentNumber: 382,
    coverageId: "coverage-56f-dalrymple",
    entityId: "battery-dalrymple-escri-sa",
    entityName: "Dalrymple ESCRI-SA Battery Energy Storage System",
    portfolio: "infrastructure",
    sourceId: "source-56j-dalrymple-aemo-march-2026",
    sourceName: "AEMO March 2026 Monthly Constraint Report",
    url: "https://www.aemo.com.au/-/media/files/electricity/nem/security_and_reliability/congestion-information/statistics/2026/march-2026.pdf?rev=f5a5e5845ebc43938db8dc20580bbdc2&sc_lang=en",
    publisher: "Australian Energy Market Operator",
    publicationDate: "2026-05-19",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Data Download",
    documentType: "Technical Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Later asset-specific operating constraints and actual islanding events",
    finding:
      "AEMO's March 2026 report lists constraint S_DALNTH1_LE_ZERO, described as the Dalrymple BESS bi-directional-unit energy limit at or below 0 MW, among the month's ten largest binding-impact network constraints with a reported summed marginal value of 1,015,000.",
    decision:
      "Retain Partially Closed. The later market-operator record proves that a named Dalrymple operating constraint was material in March 2026, but it does not establish an islanding activation, delivered service, full dispatch, availability, degradation, revenue, or customer outcome.",
    remainingGap:
      "Post-project availability, full dispatch, actual islanding activations, delivered network support, state of charge, degradation, revenue, reliability, and customer outcomes.",
    reopeningRule:
      "Reopen when ElectraNet, AGL, AEMO, ARENA, or the South Australian regulator publishes a later asset-specific operating series or confirmed islanding activation.",
    limitation:
      "A binding-impact constraint entry is not an islanding event or a complete asset-performance series. The reported marginal-value sum cannot be converted into revenue, avoided cost, service delivery, or customer benefit.",
    evidenceQuality: "Official Data",
    verificationStatus: "Verified Against Primary Source",
    sourceRoles: ["Primary Data", "Source Freshness"],
    country: "Australia",
    jurisdiction: "South Australia",
    signal: {
      id: "signal-56j-dalrymple-march-constraint",
      title: "AEMO records a later Dalrymple operating constraint",
      slug: "56j-dalrymple-march-constraint",
      status: "Published",
      summary:
        "AEMO's March 2026 report places a named Dalrymple BESS energy-limit equation among the month's largest binding-impact constraints without proving an islanding activation or complete operating performance.",
      body:
        "The March report lists S_DALNTH1_LE_ZERO, the Dalrymple BESS bi-directional-unit energy limit at or below 0 MW, with a reported summed marginal value of 1,015,000 in its top binding-impact table. The record is later and asset-specific, but it is a constraint observation rather than an availability, dispatch, islanding, revenue, or customer-outcome series.",
    },
  },
  {
    slug: "hornsdale-h1-2024-operation",
    documentNumber: 383,
    coverageId: "coverage-56f-hornsdale",
    entityId: "battery-hornsdale-power-reserve",
    entityName: "Hornsdale Power Reserve",
    portfolio: "infrastructure",
    sourceId: "source-56j-hornsdale-h1-2024-operations",
    sourceName: "Hornsdale Power Reserve Expansion Operations Report — H1 2024",
    url: "https://arena.gov.au/assets/2025/03/Neoen-%E2%80%93-Hornsdale-Power-Reserve-Upgrade-%E2%80%93-Operations-Report-H1-2024.pdf",
    publisher: "Neoen Australia via the Australian Renewable Energy Agency",
    publicationDate: "2025-02-21",
    sourceType: "Government Agency",
    credibility: "Tier 2",
    liveAccessType: "Data Download",
    documentType: "Technical Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Event-level operation plus annual availability and dispatch under declared service denominators",
    finding:
      "The operator-authored H1 2024 report states that Virtual Machine Mode had remained continuously in service since July 2022, records active and reactive response during the February 13, 2024 transmission event, and says the measured Raise 60-second response met the minimum requirement for that dispatch interval.",
    decision:
      "Retain Partially Closed. The government-hosted operator record supplies event-level observed response and a service-status statement, but it does not provide independent annual availability, complete dispatch, cycling, degradation, revenue, safety, or customer outcomes.",
    remainingGap:
      "Independent annual availability, full dispatch and service-delivery series, cycling, degradation, revenue, safety, revisions, and customer outcomes.",
    reopeningRule:
      "Reopen when AEMO, AER, the South Australian government, or the operator publishes a full asset-specific annual operating series with availability and dispatch denominators.",
    limitation:
      "The report is operator-authored and government-hosted, not an independent annual audit. Selected event compliance and a continuous-service statement do not establish whole-asset availability, all dispatch intervals, revenue, degradation, safety, or customer benefit.",
    evidenceQuality: "Primary Source",
    verificationStatus: "Verified Against Primary Source",
    sourceRoles: ["Primary Data", "Company Claim", "Source Freshness"],
    country: "Australia",
    jurisdiction: "South Australia",
    signal: {
      id: "signal-56j-hornsdale-event-operation",
      title: "Hornsdale's H1 2024 report adds event-level observed response",
      slug: "56j-hornsdale-event-operation",
      status: "Published",
      summary:
        "A government-hosted operator report records continuous VMM service and an interval-level FCAS response during H1 2024 while leaving independent annual availability and complete dispatch unresolved.",
      body:
        "The H1 2024 report states that Virtual Machine Mode remained continuously in service from July 2022 and documents Hornsdale's active and reactive response during the February 13 transmission event. It also says the measured Raise 60-second response met the minimum requirement for that interval. The attribution remains Neoen's, and the record is not an independent annual availability or dispatch audit.",
    },
  },
  {
    slug: "kc46-readiness-plan",
    documentNumber: 384,
    coverageId: "coverage-56f-kc46-everett",
    entityId: "manufacturer-boeing-kc46-everett",
    entityName: "Boeing KC-46A Everett production line",
    portfolio: "manufacturing",
    sourceId: "source-56j-kc46-readiness-plan-2026",
    sourceName: "Air Force and Boeing KC-46 Readiness Plan",
    url: "https://www.af.mil/News/Article-Display/Article/4484901/air-force-boeing-accelerate-kc-46-upgrades-to-target-readiness/",
    publisher: "Secretary of the Air Force Public Affairs",
    publicationDate: "2026-05-12",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Release Page",
    documentType: "Program Milestone",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Current accepted-aircraft denominator paired with observed availability and deficiency closure",
    finding:
      "The Air Force identifies three KC-46 actions: repurposing five early-build aircraft, accelerating RVS 2.0 retrofit fielding from a thirteen-year to a seven-year timeline, and pursuing a temporary five-year performance-based logistics arrangement. It describes approximately 6 percent near-term and 20 percent by 2030 availability improvements as plan targets.",
    decision:
      "Retain Partially Closed. The official record defines the intervention, timing, and target but does not report realized fleet availability, monthly due-versus-accepted aircraft, quality, rework, modification hours, cost, or deficiency closure.",
    remainingGap:
      "Observed fleet availability before and after the plan, monthly due and accepted aircraft, rework, quality escapes, modification hours, cost, and deficiency closure.",
    reopeningRule:
      "Reopen when the Air Force, GAO, or DOD publishes observed availability under a compatible baseline or another current delivery-and-acceptance denominator.",
    limitation:
      "The availability percentages are targets in an official plan, not realized outcomes. Protected implementation details, baseline definitions, monthly line data, quality, rework, cost, and deficiency closure are not public.",
    evidenceQuality: "Primary Source",
    verificationStatus: "Verified Against Primary Source",
    sourceRoles: ["Primary Data", "Source Freshness", "Company Claim"],
    signal: {
      id: "signal-56j-kc46-readiness-plan",
      title: "The Air Force defines a three-part KC-46 availability plan",
      slug: "56j-kc46-readiness-plan",
      status: "Published",
      summary:
        "The Air Force identifies early-aircraft repurposing, accelerated RVS 2.0 retrofits, and temporary performance-based logistics as a KC-46 availability plan; its percentage improvements remain targets, not observed results.",
      body:
        "The May 2026 Air Force record fixes three intervention lines and a schedule boundary. It describes an approximately 6 percent near-term availability boost and a 20 percent increase by 2030 as plan targets. No compatible baseline, observed post-intervention availability, monthly acceptance table, quality series, rework denominator, cost, or deficiency-closure result is published.",
    },
  },
  {
    slug: "doe-ferc-fisma-scope-boundary",
    documentNumber: 385,
    coverageId: "coverage-56f-doe",
    entityId: "agency-doe",
    entityName: "Department of Energy",
    portfolio: "ai_cyber",
    sourceId: "source-56j-doe-ferc-fisma-scope-2026",
    sourceName: "DOE OIG FY 2025 FERC Cybersecurity Evaluation",
    url: "https://www.energy.gov/ig/articles/evaluation-doe-oig-26-12",
    publisher: "Department of Energy Office of Inspector General",
    publicationDate: "2026-02-11",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Release Page",
    documentType: "Oversight Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "Department-wide FY 2025 FISMA evaluation or finding-level remediation",
    finding:
      "DOE OIG's FY 2025 evaluation concludes that FERC's unclassified cybersecurity program was effective and makes no recommendations, but the report explicitly concerns FERC as an independent agency within DOE.",
    decision:
      "Hold as a scope-exclusion decision and retain Partially Closed. The record is authoritative for FERC but cannot replace the selected department-wide DOE FISMA evaluation or department-level finding closure.",
    remainingGap:
      "Department-wide FY 2025 FISMA evaluation, finding-level remediation, incidents, recovery, and laboratory or mission effects.",
    reopeningRule:
      "Reopen when DOE OIG publishes the department-wide FY 2025 FISMA evaluation, a dated official status for that review, or finding-level remediation with department scope.",
    limitation:
      "FERC is an independent agency within DOE and has a distinct FISMA evaluation boundary. Its effective result cannot be generalized to the Department, laboratories, national security systems, incidents, recovery, or mission effects.",
    evidenceQuality: "Audited or Verified Data",
    verificationStatus: "Needs Follow-Up",
    sourceRoles: ["Primary Data", "Source Freshness"],
    signal: {
      id: "signal-56j-doe-ferc-scope-hold",
      title: "The FY 2025 FERC result cannot close the DOE-wide rail",
      slug: "56j-doe-ferc-scope-hold",
      status: "In Review",
      summary:
        "DOE OIG's effective FY 2025 result applies to FERC's unclassified program and is retained as a scope-exclusion decision rather than a department-wide DOE finding.",
      body:
        "The official evaluation is strong evidence for FERC, an independent agency within DOE. It does not report the department-wide DOE evaluation selected by the continuation rule. The record remains held to prevent a component or independent-agency result from being generalized to the Department, laboratories, national security systems, incidents, recovery, or mission effects.",
    },
  },
].map((record) => ({ ...portfolioDefaults[record.portfolio], ...record }));

const partialOrder = [
  ["coverage-56f-moss-landing", "eia-plant-260", "Dynegy Moss Landing Power Plant Hybrid", "infrastructure", "Final regulator investigation and corrective-action closure", "Current regulator investigation rail; exact closure artifact can materially change evidence state.", "Active now"],
  ["coverage-56f-dalrymple", "battery-dalrymple-escri-sa", "Dalrymple ESCRI-SA Battery Energy Storage System", "infrastructure", "Post-project availability, dispatch, and islanding events", "Later AEMO and ElectraNet records are live and asset-specific.", "Batch one record acquired"],
  ["coverage-56f-hornsdale", "battery-hornsdale-power-reserve", "Hornsdale Power Reserve", "infrastructure", "Annual availability and dispatch under a declared service denominator", "Operator and market-operator rails can expose event and service evidence.", "Batch one record acquired"],
  ["coverage-56f-kc46-everett", "manufacturer-boeing-kc46-everett", "Boeing KC-46A Everett production line", "manufacturing", "Observed availability plus current delivery and acceptance", "Current Air Force and GAO rails are authoritative, frequent, and denominator-aware.", "Batch one record acquired"],
  ["coverage-56f-doe", "agency-doe", "Department of Energy", "ai_cyber", "Department-wide FY 2025 FISMA evaluation or finding-level remediation", "DOE OIG is authoritative; strict agency and component scope controls are required.", "Batch one scope decision"],
  ["coverage-56f-va", "agency-va", "Department of Veterans Affairs", "ai_cyber", "FY 2025 FISMA result or iFAMS recommendation closure", "Named recommendations provide a direct remediation rail.", "Active now"],
  ["coverage-56f-f35-fort-worth", "manufacturer-lockheed-f35-fort-worth", "Lockheed Martin F-35 Fort Worth final-assembly line", "manufacturing", "Monthly aircraft due and accepted with capability state", "Program-office and GAO records can expose accepted-output and capability breaks.", "Active now"],
  ["coverage-56f-f15ex-st-louis", "manufacturer-boeing-f15ex-st-louis", "Boeing F-15EX St. Louis production line", "manufacturing", "Realized post-restart delivery and acceptance dates", "Air Force and DCMA records can convert a planned window into accepted output.", "Active now"],
  ["coverage-56f-dot", "agency-dot", "Department of Transportation", "ai_cyber", "FY 2026 review result or dated recommendation closure", "The review identity is public; the outcome and remediation rail remain exact.", "Active now"],
  ["coverage-56f-nasa", "agency-nasa", "National Aeronautics and Space Administration", "ai_cyber", "FY 2026 FISMA result or recommendation-level cyber closure", "Annual and recommendation rails are authoritative but cadence-bound.", "Periodic official rail"],
  ["coverage-56f-hhs", "agency-hhs", "Department of Health and Human Services", "ai_cyber", "FY 2025 recommendation status change or component control test", "The tracker has an explicit later update window and direct closure semantics.", "Scheduled insert"],
  ["coverage-56f-current-applications", "manufacturer-current-applications-watertown-ny", "Current Applications", "manufacturing", "Repeat same-line input and output under one declared period", "A compatible repeat would materially improve the current single-intervention record.", "Named outcome rail"],
  ["coverage-56f-island-components", "manufacturer-island-components-hauppauge-ny", "Island Components Group", "manufacturing", "Realized Hauppauge jobs, investment, or repeat operating output", "The current public record is planned input; realized outcome evidence is decisive.", "Named outcome rail"],
  ["coverage-56f-monaghan-medical", "manufacturer-monaghan-medical-plattsburgh-ny", "Monaghan Medical", "manufacturing", "Certified investment, realized jobs, or units under a compatible window", "Program certification or FDA/company output can convert commitments into realized outcomes.", "Named outcome rail"],
  ["coverage-56f-united-airlines", "dot-operating-carrier-united-airlines", "United Airlines", "mobility", "2026 full-year operating denominator and cause-controlled outcomes", "Shared full-year carrier release gate; deterministic order only.", "December 2026 tie group"],
  ["coverage-56f-southwest-airlines", "dot-operating-carrier-southwest-airlines", "Southwest Airlines", "mobility", "2026 full-year operating denominator and cause-controlled outcomes", "Shared full-year carrier release gate; deterministic order only.", "December 2026 tie group"],
  ["coverage-56f-delta-air-lines", "dot-operating-carrier-delta-air-lines", "Delta Air Lines", "mobility", "2026 full-year operating denominator and cause-controlled outcomes", "Shared full-year carrier release gate; deterministic order only.", "December 2026 tie group"],
  ["coverage-56f-american-airlines", "carrier-american-airlines", "American Airlines", "mobility", "2026 full-year cancellation rate under the operating-carrier contract", "Shared full-year carrier release gate; deterministic order only.", "December 2026 tie group"],
  ["coverage-56f-alaska-airlines", "carrier-alaska-airlines", "Alaska Airlines", "mobility", "Post-integration full-year operating and brand attribution denominator", "Shared full-year carrier release gate; deterministic order only.", "December 2026 tie group"],
  ["coverage-56f-jetblue-airways", "carrier-jetblue-airways", "JetBlue Airways", "mobility", "2026 full-year cancellation and schedule denominator", "Shared full-year carrier release gate; deterministic order only.", "December 2026 tie group"],
];

const partialQueue = partialOrder.map((row, index) => ({
  acquisition_order: index + 1,
  priority_band:
    index < 9 ? "A — current official record rails" :
    index < 11 ? "B — periodic official record rails" :
    index < 14 ? "C — named realized-outcome rails" :
    "D — shared full-year carrier release gate",
  coverage_id: row[0],
  entity_id: row[1],
  entity_name: row[2],
  portfolio: row[3],
  current_closure_status: "Partially Closed",
  named_next_record: row[4],
  evidence_value_rationale: row[5],
  current_action: row[6],
  comparison_boundary:
    "Acquisition order ranks evidence opportunity, not entity performance, safety, quality, readiness, or value.",
}));

const openRails = [
  {
    coverage_id: "coverage-56f-dhs",
    entity_id: "agency-dhs",
    entity_name: "Department of Homeland Security",
    selected_record: "Released FY 2025 enterprise FISMA evaluation",
    phase_56j_result: "No new exact result identified in batch one; remain active without substitution.",
    prior_closure_status: "Open",
    current_closure_status: "Open",
    reopening_rule: "Reopen when DHS OIG publishes the final FY 2025 enterprise evaluation or a dated replacement outcome.",
  },
  {
    coverage_id: "coverage-56f-manatee",
    entity_id: "eia-plant-60014",
    entity_name: "Manatee Solar Energy Center",
    selected_record: "Asset-specific operating data with interval dispatch and availability",
    phase_56j_result: "Named EIA-923 monthly operating rows acquired; interval availability remains open.",
    prior_closure_status: "Open",
    current_closure_status: "Partially Closed",
    reopening_rule: "Reopen when plant 60014 interval dispatch or availability is published under a declared denominator.",
  },
  {
    coverage_id: "coverage-56f-gateway",
    entity_id: "eia-plant-63834",
    entity_name: "Gateway Energy Storage System",
    selected_record: "Final investigation and full contracted-capacity restoration",
    phase_56j_result: "No new final finding or full-capacity operating record identified in batch one; remain active without substitution.",
    prior_closure_status: "Open",
    current_closure_status: "Open",
    reopening_rule: "Reopen when CPUC, EPA, CAISO, SCE, or the operator publishes final findings or a full-capacity operating record.",
  },
];

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yamlQuote = (value) => JSON.stringify(value);
const yamlList = (items, indent = "  ") => items.map((item) => `${indent}- ${yamlQuote(item)}`).join("\n");
const writeJson = (path, value) => writeFile(path, json(value), "utf8");

await Promise.all([
  mkdir(join(contentRoot, "sources"), { recursive: true }),
  mkdir(join(contentRoot, "research-documents"), { recursive: true }),
  mkdir(join(contentRoot, "research-collections"), { recursive: true }),
  mkdir(join(contentRoot, "signals"), { recursive: true }),
  mkdir(join(contentRoot, "briefings"), { recursive: true }),
  mkdir(join(contentRoot, "updates"), { recursive: true }),
  mkdir(join(publicRoot, "downloads", collectionSlug, "official-links"), { recursive: true }),
  mkdir(dataRoot, { recursive: true }),
]);

for (const record of records) {
  const source = {
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
    known_limitations: `${record.limitation} Phase 56J keeps the coverage ID, entity identity, attribution, period, evidence state, and continuation rule attached.`,
    last_checked_date: capturedDate,
    watch_lanes: record.watchLanes,
    live_access_type: record.liveAccessType,
    data_download_url: record.url,
    review_cadence_days: 60,
    monitoring_status: "Active",
    coverage_role: record.sourceRoles,
    jurisdiction: record.jurisdiction,
    source_owner: record.publisher,
    notes: `Phase 56J evidence-value continuation source. Collection: ${collectionSlug}.`,
  };
  await writeJson(join(contentRoot, "sources", `${record.sourceId}.json`), source);

  const documentId = `research-doc-56j-${record.slug}`;
  const localCapturePath = `/downloads/${collectionSlug}/official-links/${String(record.documentNumber - 380).padStart(2, "0")}-${record.slug}.txt`;
  const researchDocument = {
    id: documentId,
    collection_id: collectionId,
    title: `${record.entityName}: Phase 56J Continuation Decision`,
    slug: `56j-${record.slug}`,
    record_status: record.recordStatus,
    publisher: record.publisher,
    publication_date: record.publicationDate,
    document_type: record.documentType,
    summary: `${record.finding} Phase 56J decision: ${record.decision}`,
    key_findings: [
      `Phase 56F coverage ID: ${record.coverageId}.`,
      `Highest-value missing record: ${record.priority}.`,
      `Evidence state: ${record.priorStatus} to ${record.currentStatus}.`,
      `Continuation rule: ${record.reopeningRule}`,
    ],
    why_it_matters:
      "The continuation decision tests a named next record against the selected denominator instead of expanding broad context or inferring performance from disclosure.",
    ftfn_relevance: [
      `Preserves stable entity ID ${record.entityId}.`,
      "Separates a new operating, program, or scope observation from complete closure.",
      "Keeps evidence state separate from performance, safety, quality, readiness, value, and causation.",
    ],
    evidence_limits: [
      record.limitation,
      record.remainingGap,
      "No causal effect, entity ranking, composite score, readiness score, or unsupported cross-entity comparison is supported.",
    ],
    primary_topics: record.topics,
    framework_layers: record.layers,
    constraint_tags: record.constraints,
    source_id: record.sourceId,
    official_url: record.url,
    local_capture_path: localCapturePath,
    archive_member: localCapturePath.split("/").slice(-2).join("/"),
    capture_status: "Official link record",
    captured_date: capturedDate,
  };
  await writeJson(
    join(contentRoot, "research-documents", `${record.documentNumber}-56j-${record.slug}.json`),
    researchDocument,
  );

  const linkRecord = [
    `FTFN Phase 56J official link record`,
    `Title: ${record.sourceName}`,
    `Publisher: ${record.publisher}`,
    `Publication date: ${record.publicationDate}`,
    `Official URL: ${record.url}`,
    `Checked: ${capturedDate}`,
    `Coverage ID: ${record.coverageId}`,
    `Entity ID: ${record.entityId}`,
    `Decision: ${record.decision}`,
    `Limitation: ${record.limitation}`,
    "",
  ].join("\r\n");
  await writeFile(join(publicRoot, localCapturePath), linkRecord, "utf8");

  const signal = record.signal;
  const signalMdx = `---
id: ${yamlQuote(signal.id)}
title: ${yamlQuote(signal.title)}
slug: ${yamlQuote(signal.slug)}
record_status: ${yamlQuote(signal.status)}
summary: ${yamlQuote(signal.summary)}
source_ids:
  - ${yamlQuote(record.sourceId)}
published_date: ${signal.status === "Published" ? capturedDate : "null"}
captured_date: ${capturedDate}
primary_topic: ${yamlQuote(record.topics[0])}
framework_layers:
${yamlList(record.layers)}
signal_type: "Policy Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: ${yamlQuote(record.evidenceQuality)}
verification_status: ${yamlQuote(record.verificationStatus)}
why_it_matters: "The record improves one selected evidence question while retaining denominator, attribution, timing, and closure boundaries."
dependencies:
  - "stable entity and source identity"
  - "compatible unit and observation window"
  - "declared attribution and evidence state"
constraints:
${yamlList(record.constraints)}
receiving_systems:
  - "Phase 56J evidence-value continuation queue"
local_implications:
  - "The record cannot be converted into an entity-performance, readiness, quality, safety, or value score."
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${signal.status === "In Review" ? 'editorial_notes: "Hold because the source boundary does not match the selected entity-wide denominator."\n' : ""}---

## What changed

${signal.body}

## Boundary

${record.limitation}

No entity ranking, composite, readiness score, or causal claim is supported.
`;
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), signalMdx, "utf8");
}

const queueLedger = {
  phase: "56J",
  captured_date: capturedDate,
  queue_rule:
    "Order evidence opportunities by likely evidence gain, source authority, denominator fit, and current availability. Do not rank entities or infer performance from disclosure.",
  open_rails: openRails,
  original_partially_closed_continuation_queue: partialQueue,
  batch_one_acquisition_ids: records.map((record) => `acquisition-56j-${record.slug}`),
  closure_change: {
    coverage_id: "coverage-56f-manatee",
    prior_status: "Open",
    current_status: "Partially Closed",
    reason:
      "The exact named asset now has an official monthly operating record; interval dispatch and availability remain unresolved.",
  },
  post_batch_closure_counts: {
    closed: 1,
    partially_closed: 21,
    open: 2,
  },
  acquisitions: records.map((record) => ({
    acquisition_id: `acquisition-56j-${record.slug}`,
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
    reopening_rule: record.reopeningRule,
    comparison_boundary:
      "Acquisition order and closure status describe evidence opportunity and evidence state, not entity performance.",
  })),
};
await writeJson(join(dataRoot, "phase-56j-evidence-value-continuation.json"), queueLedger);

const publicationReview = {
  phase: "56J",
  reviewed_date: capturedDate,
  source_profiles_added: records.length,
  original_partially_closed_queue_count: partialQueue.length,
  open_rails_continued: openRails.length,
  batch_one_acquisition_count: records.length,
  document_decisions: {
    reviewed: records.length,
    promoted: records
      .filter((record) => record.recordStatus === "Published")
      .map((record) => `research-doc-56j-${record.slug}`),
    held: records
      .filter((record) => record.recordStatus !== "Published")
      .map((record) => `research-doc-56j-${record.slug}`),
  },
  signal_decisions: {
    reviewed: records.length,
    promoted: records.filter((record) => record.signal.status === "Published").map((record) => record.signal.id),
    held: records.filter((record) => record.signal.status !== "Published").map((record) => record.signal.id),
  },
  closure_decision:
    "Manatee moves from Open to Partially Closed because the exact named asset now has monthly operating data. Every other selected state remains unchanged.",
  scope_rule:
    "The FERC FY 2025 cybersecurity result is authoritative for FERC but cannot substitute for a department-wide DOE result.",
  target_rule:
    "KC-46 availability percentages are plan targets and are not described as realized outcomes.",
  attribution_rule:
    "Hornsdale event observations remain attributed to the operator-authored report hosted by ARENA.",
  comparison_rule:
    "Evidence-value order is an acquisition queue, not an entity ranking; no causal, composite, readiness, quality, safety, or value score is permitted.",
};
await writeJson(join(dataRoot, "phase-56j-publication-review.json"), publicationReview);

const documentIds = records.map((record) => `research-doc-56j-${record.slug}`);
await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Evidence-Value Continuation Queue — Batch One, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary:
    "Phase 56J orders all twenty original Partially Closed continuation rules, keeps the three Open rails active, acquires five named records, and moves only Manatee from Open to Partially Closed.",
  scope:
    "Twenty-record continuation order plus Manatee, Dalrymple, Hornsdale, KC-46, and DOE scope decisions.",
  captured_date: capturedDate,
  document_ids: documentIds,
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note:
    "The eight-file archive contains five official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note:
    "Acquisition order ranks evidence opportunity, not entities. Each decision retains its Phase 56F coverage ID, stable entity ID, selected denominator, attribution, limitation, and reopening rule.",
});

const briefingMdx = `---
id: ${yamlQuote(briefingId)}
title: "Research Watch 014: Evidence-Value Continuation"
slug: "research-watch-014-evidence-value-continuation"
record_status: "Published"
summary: "Phase 56J orders the twenty original Partially Closed continuation rules, acquires five named records, and moves only Manatee from Open to Partially Closed."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlList(records.map((record) => record.signal.id))}
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "Manatee gains an official plant-specific monthly operating record and moves from Open to Partially Closed."
  - "Dalrymple gains a later named AEMO constraint observation."
  - "Hornsdale gains an operator-attributed H1 2024 event and service-status record."
  - "The KC-46 plan is published as a plan with targets, not realized availability."
  - "The FERC result remains held and cannot substitute for department-wide DOE evidence."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
what_to_watch_next:
  - "DHS FY 2025 enterprise FISMA publication."
  - "Gateway final investigation and full contracted-capacity restoration."
  - "Moss Landing final investigation and corrective-action closure."
  - "Observed KC-46 availability and current accepted-aircraft denominators."
  - "Full-year 2026 carrier records at the shared release gate."
---

## Batch-one result

Phase 56J converts the first-pass corpus into an explicit continuation queue. The queue orders evidence opportunities by likely evidence gain, source authority, denominator fit, and current availability. It does not rank entity performance.

The EIA-923 workbook supplies the first selected plant-specific operating record for Manatee. That exact evidence improvement moves the rail from Open to Partially Closed. DHS and Gateway remain Open.

Four other decisions deepen existing Partially Closed rails. AEMO records a later Dalrymple constraint; the Hornsdale operator report supplies event-level response; the Air Force defines a KC-46 intervention plan; and the FERC evaluation is retained as a DOE scope-exclusion decision.

## Current closure ledger

- Closed: 1
- Partially Closed: 21
- Open: 2

These are evidence states for selected records. They are not performance, safety, quality, readiness, or value measures.

## Continuation order

The twenty original Partially Closed records are grouped into current official rails, periodic official rails, named realized-outcome rails, and a tied full-year carrier gate. The six carrier positions are deterministic only; they do not imply a comparative assessment.
`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefingMdx, "utf8");

await writeJson(join(contentRoot, "updates", "2026-07-25-phase-56j-evidence-value-continuation.json"), {
  id: "update-2026-07-25-phase-56j-evidence-value-continuation",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56J starts the evidence-value continuation queue",
  summary:
    "FTFN orders the twenty original partial-closure rules, acquires five named records, publishes four bounded signals, and moves Manatee from Open to Partially Closed.",
  affected_record_ids: [
    collectionId,
    briefingId,
    ...records.map((record) => record.signal.id),
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-014-evidence-value-continuation/",
    ...records
      .filter((record) => record.signal.status === "Published")
      .map((record) => `/signals/${record.signal.slug}/`),
  ],
  evidence_note:
    "Manatee changes evidence state on the exact EIA plant record. Dalrymple, Hornsdale, KC-46, and DOE retain their prior states; the DOE/FERC mismatch remains held.",
  work_package: "docs/work-packages/phase-56j-evidence-value-continuation-queue.md",
});

console.log(
  "Generated Phase 56J: five sources, five evidence documents, five signals, one collection, Research Watch 014, two ledgers, and one update.",
);
