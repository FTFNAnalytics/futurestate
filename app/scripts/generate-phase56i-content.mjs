import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-07-25";
const collectionSlug = "remaining-open-rails-partial-closure-first-pass-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-013-first-pass-completion";

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
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    country: "United States",
    jurisdiction: "United States manufacturing",
  },
  mobility: {
    topics: ["Mobility", "Aviation"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Regulation", "Safety", "Infrastructure", "Data Quality", "Public Trust"],
    watchLanes: ["Mobility Certification", "Cross-Cutting Official Rails"],
    country: "United States",
    jurisdiction: "United States domestic aviation",
  },
};

const withDefaults = (record) => ({ ...portfolioDefaults[record.portfolio], ...record });

const records = [
  withDefaults({
    slug: "dhs-fy2025-fisma-index-continuation",
    coverageId: "coverage-56f-dhs",
    entityId: "agency-dhs",
    entityName: "Department of Homeland Security",
    portfolio: "ai_cyber",
    sourceId: "source-56g-dhs-oig-report-index-july-2026",
    sourceName: "DHS OIG Audits, Inspections, and Evaluations Index — July 2026 Check",
    url: "https://www.oig.dhs.gov/reports/audits-inspections-and-evaluations",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Report Series",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Released FY 2025 enterprise FISMA result",
    finding: "The DHS OIG report index checked on July 25, 2026 still exposes the FY 2024 enterprise information-security evaluation but does not list the selected FY 2025 enterprise evaluation.",
    decision: "No closure change. The dated catalog check preserves the exact missing-record boundary and does not treat project, financial-control, or component context as the annual enterprise result.",
    remainingGap: "Released FY 2025 FISMA evaluation, component findings, closure dates, endpoint and cloud coverage, incidents, recovery, and service effects.",
    reopeningRule: "Reopen when DHS OIG publishes the final FY 2025 enterprise evaluation or a dated replacement outcome.",
    limitation: "A public report-index check cannot establish nonpublic work, final annual findings, implementation quality, incidents, recovery, or service effects.",
    createSource: false,
  }),
  withDefaults({
    slug: "manatee-eia923-monthly-data-rail",
    coverageId: "coverage-56f-manatee",
    entityId: "eia-plant-60014",
    entityName: "Manatee Solar Energy Center",
    portfolio: "infrastructure",
    sourceId: "source-56i-eia923-may2026-release",
    sourceName: "Form EIA-923 Detailed Data — May 2026 Monthly Release",
    url: "https://www.eia.gov/electricity/data/eia923/",
    publisher: "U.S. Energy Information Administration",
    publicationDate: "2026-07-23",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Release Page",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "Published",
    priority: "Interval dispatch and availability for the named battery",
    finding: "EIA's July 23 release extends the official EIA-923 rail through May 2026 and describes monthly and annual plant- and prime-mover-level generation data.",
    decision: "No closure change. Monthly plant operations are a stronger acquisition rail, but the release contract does not supply Manatee interval dispatch, availability, state of charge, cycling, or degradation.",
    remainingGap: "Interval dispatch, availability, cycles, state of charge, degradation, revenue, curtailment, outage response, and customer cost.",
    reopeningRule: "Reopen when FPL, Florida PSC, EIA, or a balancing authority publishes asset-specific operating data with a declared interval and availability denominator.",
    limitation: "The release page describes monthly and annual survey data; it does not itself establish a Manatee interval series, availability, state of charge, cycling, degradation, revenue, or customer outcome.",
    createSource: true,
  }),
  withDefaults({
    slug: "gateway-epa-investigation-continuation",
    coverageId: "coverage-56f-gateway",
    entityId: "eia-plant-63834",
    entityName: "Gateway Energy Storage System",
    portfolio: "infrastructure",
    sourceId: "source-56i-gateway-epa-site-profile-2026",
    sourceName: "EPA Gateway Energy Camino Lithium-Ion Battery Fire Site Profile",
    url: "https://response.epa.gov/site/site_profile.aspx?site_id=16485",
    publisher: "U.S. Environmental Protection Agency",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Release Page",
    documentType: "Regulatory Decision",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Final investigation and full contracted-capacity restoration",
    finding: "EPA's current Gateway site profile says the root cause remains under investigation and that cleanup, environmental monitoring, battery handling, and progress reporting remain under agency oversight.",
    decision: "No closure change. The current regulator rail confirms continuing investigation and cleanup but not a final cause finding, corrective-action closure, or full contracted-capacity restoration.",
    remainingGap: "Final investigation, full return to service, contracted-capacity restoration, availability, dispatch, duration, degradation, revenue, and reliability effects.",
    reopeningRule: "Reopen when CPUC, EPA, CAISO, SCE, or the operator publishes final findings or a full-capacity operating record.",
    limitation: "A cleanup and investigation status page does not establish final cause, accepted corrective action, full operation, dispatch, availability, or restored contracted capacity.",
    createSource: true,
  }),
  withDefaults({
    slug: "current-applications-first-pass-decision",
    coverageId: "coverage-56f-current-applications",
    entityId: "manufacturer-current-applications-watertown-ny",
    entityName: "Current Applications",
    portfolio: "manufacturing",
    sourceId: "source-56b-nist-mep-current-applications-lean",
    sourceName: "Lean Tools Provide Lead Time Reduction: Current Applications",
    url: "https://www.nist.gov/mep/successstories/2024/lean-tools-provide-lead-time-reduction",
    publisher: "National Institute of Standards and Technology",
    publicationDate: "2026-01-13",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Release Page",
    documentType: "Technical Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Current facility workforce denominator paired with repeat same-line output",
    finding: "The NIST MEP record pairs an approximately 60-person current workforce description with attributed results of production rising from 40 to 105 units per day, lead time falling 50 percent, and WIP falling from 105 to 5 units.",
    decision: "The first-pass record materially deepens labor-and-output context but remains Partially Closed because the workforce description and intervention results are not a compatible repeated same-line series under one declared period.",
    remainingGap: "Repeat same-line output, labor hours, yield, scrap, downtime, cost, delivery, demand, and dated capital execution under a compatible window.",
    reopeningRule: "Reopen when a dated company, MEP, grant, or customer record reports repeat same-line input and output under a declared window.",
    limitation: "The case study is company- and program-attributed and does not publish repeat dates, labor hours, yield, scrap, downtime, cost, demand, or an independently audited counterfactual.",
    createSource: false,
  }),
  withDefaults({
    slug: "island-components-first-pass-decision",
    coverageId: "coverage-56f-island-components",
    entityId: "manufacturer-island-components-hauppauge-ny",
    entityName: "Island Components Group",
    portfolio: "manufacturing",
    sourceId: "source-56f-island-components-scida-2023",
    sourceName: "Suffolk County IDA 2023 Year-End Report — Island Components",
    url: "https://suffolkida.org/wp-content/uploads/2024/04/SCIDA-2023-Year-End-Report-For-WEB.pdf",
    publisher: "Suffolk County Industrial Development Agency",
    publicationDate: "2024-04-01",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Data Download",
    documentType: "Program Milestone",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "Realized facility, capital, and employment inputs paired with repeat output",
    finding: "The selected SCIDA record defines a $2 million relocation, a 14,200-square-foot Hauppauge facility, and fourteen planned engineering and manufacturing positions.",
    decision: "The first pass remains Partially Closed. The record establishes planned facility, capital, and jobs but does not report realized employment, completed investment, or repeat production output.",
    remainingGap: "Realized jobs, completed investment, output, labor hours, WIP, yield, defects, downtime, delivery, demand, and independent surveillance findings.",
    reopeningRule: "Reopen when SCIDA, the company, a registrar, or a customer publishes a dated realized outcome for the Hauppauge operation.",
    limitation: "A project description and planned employment increment are not realized jobs, completed investment, operating output, quality, delivery, or independently validated productivity.",
    createSource: false,
  }),
  withDefaults({
    slug: "monaghan-excelsior-commitment-denominator",
    coverageId: "coverage-56f-monaghan-medical",
    entityId: "manufacturer-monaghan-medical-plattsburgh-ny",
    entityName: "Monaghan Medical",
    portfolio: "manufacturing",
    sourceId: "source-56i-monaghan-excelsior-q1-2026",
    sourceName: "Excelsior Jobs Program Quarterly Report — March 31, 2026",
    url: "https://esd.ny.gov/sites/default/files/media/document/ExcelsiorChartABusinessesAdmittedToProgram33126.pdf",
    publisher: "Empire State Development",
    publicationDate: "2026-03-31",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Data Download",
    documentType: "Data Release",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Executed facility and machinery investment paired with units distributed or line output",
    finding: "The March 2026 Excelsior report records Monaghan with a 72-job employment base, ten committed net new jobs, $9.575 million of committed investment, and up to $340,000 in tax credits.",
    decision: "The commitment denominator is now explicit, but the evidence state remains Partially Closed because program admission and commitments do not establish investment execution, tax-credit eligibility, realized jobs, or operating output.",
    remainingGap: "Investment execution, credit certification, facility and machinery operation, realized jobs, units distributed, same-line output, yield, scrap, delivery, and patient outcomes.",
    reopeningRule: "Reopen when ESD reports certification or credit issuance, or FDA/company records expose units distributed and a compatible production window.",
    limitation: "The report states that admission does not guarantee tax-credit eligibility and presents commitments rather than executed investment, realized jobs, operating output, or patient outcomes.",
    createSource: true,
  }),
];

const airlineRows = [
  {
    slug: "united-may2026-first-pass",
    coverageId: "coverage-56f-united-airlines",
    entityId: "dot-operating-carrier-united-airlines",
    entityName: "United Airlines",
    rate: "79.5 percent across 130 reported airports",
    priority: "2026 full-year operating denominator and cause-controlled service outcomes",
    remainingGap: "2026 full-year operations, delay causes, route and airport controls, complaints, accessibility, commitment compliance, and revisions.",
  },
  {
    slug: "southwest-may2026-first-pass",
    coverageId: "coverage-56f-southwest-airlines",
    entityId: "dot-operating-carrier-southwest-airlines",
    entityName: "Southwest Airlines",
    rate: "71.9 percent across 108 reported airports",
    priority: "2026 full-year operating denominator and cause-controlled service outcomes",
    remainingGap: "2026 full-year operations, delay causes, route and airport controls, complaints, accessibility, commitment compliance, and revisions.",
  },
  {
    slug: "delta-may2026-first-pass",
    coverageId: "coverage-56f-delta-air-lines",
    entityId: "dot-operating-carrier-delta-air-lines",
    entityName: "Delta Air Lines",
    rate: "81.0 percent across 140 reported airports",
    priority: "2026 full-year operating denominator and cause-controlled service outcomes",
    remainingGap: "2026 full-year operations, delay causes, route and airport controls, complaints, accessibility, commitment compliance, and revisions.",
  },
  {
    slug: "american-may2026-first-pass",
    coverageId: "coverage-56f-american-airlines",
    entityId: "carrier-american-airlines",
    entityName: "American Airlines",
    rate: "75.1 percent across 128 reported airports",
    priority: "Later full-year cancellation rate under the 2026 operating-carrier contract",
    remainingGap: "Full-year cancellation rate, flight-level cause and network controls, eligible disruptions, and verified remedies.",
  },
  {
    slug: "alaska-may2026-first-pass",
    coverageId: "coverage-56f-alaska-airlines",
    entityId: "carrier-alaska-airlines",
    entityName: "Alaska Airlines",
    rate: "82.4 percent across 85 reported airports",
    priority: "Post-integration full-year operating denominator",
    remainingGap: "Post-integration full-year denominator, brand and operating attribution, causes, complaints, and verified remedies.",
  },
  {
    slug: "jetblue-may2026-first-pass",
    coverageId: "coverage-56f-jetblue-airways",
    entityId: "carrier-jetblue-airways",
    entityName: "JetBlue Airways",
    rate: "81.0 percent across 64 reported airports",
    priority: "Later full-year cancellation and schedule denominator",
    remainingGap: "Full-year cancellations and schedule, route and airport mix, weather, maintenance, crew controls, complaints, and verified remedies.",
  },
];

for (const row of airlineRows) {
  records.push(withDefaults({
    ...row,
    portfolio: "mobility",
    sourceId: "source-56e-atcr-may-2026",
    sourceName: "Air Travel Consumer Report: May 2026 Operating Data",
    url: "https://www.transportation.gov/sites/dot.gov/files/2026-06/July%202026%20ATCR.pdf",
    publisher: "U.S. Department of Transportation",
    publicationDate: "2026-06-30",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    liveAccessType: "Data Download",
    documentType: "Data Release",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    finding: `DOT's May 2026 operating-carrier table records ${row.entityName} on-time arrivals at ${row.rate}.`,
    decision: "The first pass preserves a compatible monthly operating-carrier observation but remains Partially Closed because the 2026 full-year denominator, cause controls, complaints, accessibility, and verified remedy delivery are incomplete.",
    reopeningRule: "Reopen after BTS publishes December 2026 data and DOT issues the full-year 2026 reporting tables.",
    limitation: "One monthly on-time percentage cannot be combined with cancellations, complaints, baggage, accessibility, network, weather, schedule, cause, or remedy measures and does not authorize a cross-carrier ranking.",
    createSource: false,
  }));
}

const signalSpecs = [
  {
    id: "signal-56i-eia923-monthly-operating-rail",
    title: "EIA-923 extends the operating-data rail only to monthly resolution",
    slug: "56i-eia923-monthly-operating-rail",
    topic: "Energy",
    sourceIds: ["source-56i-eia923-may2026-release"],
    summary: "EIA's July 23 release reaches May 2026 with monthly and annual plant-level data, but it does not satisfy the Manatee interval-dispatch and availability question.",
    body: "The EIA-923 release page describes plant- and prime-mover-level generation data through May 2026. That improves the official acquisition rail, while interval dispatch, availability, state of charge, cycling, degradation, and customer outcomes remain outside the release contract.",
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
  },
  {
    id: "signal-56i-monaghan-program-commitment",
    title: "Monaghan's 2026 program record fixes the commitment denominator",
    slug: "56i-monaghan-program-commitment",
    topic: "Advanced Manufacturing",
    sourceIds: ["source-56i-monaghan-excelsior-q1-2026"],
    summary: "Empire State Development records a 72-job base, ten committed new jobs, $9.575 million of committed investment, and a $340,000 maximum credit without proving execution or output.",
    body: "The March 2026 Excelsior report supplies a precise program commitment. Its own note says admission does not guarantee tax-credit eligibility, so the record does not establish credit issuance, executed investment, realized jobs, machinery operation, units distributed, or patient outcomes.",
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
  },
];

const heldSignalId = "signal-56i-first-pass-continuation-hold";
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
const refreshedSources = new Set();
for (const [index, record] of records.entries()) {
  const archiveName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  const sourcePath = join(contentRoot, "sources", `${record.sourceId}.json`);
  if (record.createSource && !createdSources.has(record.sourceId)) {
    createdSources.add(record.sourceId);
    await writeJson(sourcePath, {
      id: record.sourceId,
      name: record.sourceName,
      url: record.url,
      source_type: record.sourceType,
      credibility_level: record.credibility,
      primary_topics: record.topics,
      framework_layers: record.layers,
      country_or_region: record.country,
      update_frequency: record.sourceId.includes("eia923") ? "Monthly" : "Event-driven",
      capture_priority: "High",
      known_limitations: `${record.limitation} Phase 56I keeps the coverage ID, attribution, observation window, evidence state, and continuation rule attached.`,
      last_checked_date: capturedDate,
      watch_lanes: record.watchLanes,
      live_access_type: record.liveAccessType,
      ...(record.liveAccessType === "Data Download" ? { data_download_url: record.url } : {}),
      review_cadence_days: 60,
      monitoring_status: "Active",
      coverage_role: ["Primary Data", "Source Freshness"],
      jurisdiction: record.jurisdiction,
      source_owner: record.publisher,
      notes: `Phase 56I remaining-rail and partial-closure first-pass source. Collection: ${collectionSlug}.`,
    });
  } else if (!record.createSource && !refreshedSources.has(record.sourceId)) {
    refreshedSources.add(record.sourceId);
    const source = JSON.parse(await readFile(sourcePath, "utf8"));
    source.last_checked_date = capturedDate;
    await writeJson(sourcePath, source);
  }

  await writeJson(join(contentRoot, "research-documents", `${369 + index}-56i-${record.slug}.json`), {
    id: `research-doc-56i-${record.slug}`,
    collection_id: collectionId,
    title: `${record.entityName}: Phase 56I First-Pass Decision`,
    slug: `56i-${record.slug}`,
    record_status: record.recordStatus,
    publisher: record.publisher,
    publication_date: record.publicationDate,
    document_type: record.documentType,
    summary: `${record.finding} Phase 56I decision: ${record.decision}`,
    key_findings: [
      `Phase 56F coverage ID: ${record.coverageId}.`,
      `Highest-value missing record: ${record.priority}.`,
      `Evidence state: ${record.priorStatus} to ${record.currentStatus}.`,
      `Continuation rule: ${record.reopeningRule}`,
    ],
    why_it_matters: "The first-pass decision records whether a named official rail supplies the required denominator without converting adjacent or partial evidence into false closure.",
    ftfn_relevance: [
      `Preserves stable entity ID ${record.entityId}.`,
      "Completes the Phase 56I first-pass queue under a dated source check.",
      "Keeps evidence state separate from performance, safety, quality, readiness, and value.",
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
  title: "Remaining Open Rails and Partial-Closure First Pass, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Twelve Phase 56I decisions continue the three Open rails and complete the first pass through the nine remaining Partially Closed records without a false closure or duplicate finding.",
  scope: "DHS, Manatee, Gateway, three manufacturing entities, and six reporting operating carriers.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56i-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 15-file archive contains twelve official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Every decision retains its Phase 56F coverage ID and continuation rule. Existing evidence is referenced rather than republished as a new finding. No missing record is replaced by adjacent context.",
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
published_date: 2026-07-25
captured_date: 2026-07-25
primary_topic: "${signal.topic}"
framework_layers:
${yamlList(["Enabling Infrastructure", "Human Systems"])}
signal_type: "Policy Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The record adds one bounded denominator while preserving the remaining operating and outcome gaps."
dependencies:
  - "stable entity and source identity"
  - "compatible unit and observation window"
  - "separate operating and outcome denominators"
constraints:
${yamlList(signal.constraints)}
receiving_systems:
  - "Phase 56F cross-cohort coverage ledger"
local_implications:
  - "The new denominator cannot be converted into a performance, readiness, quality, safety, or value score."
evidence_gap_ids:
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-25
---

## What changed

${signal.body}

## Boundary

The result deepens one selected evidence question. It does not support a cross-entity comparison, causal claim, ranking, composite, or readiness score.
`, "utf8");
}

const heldSourceIds = records
  .filter((record) => record.currentStatus === "Open" || record.recordStatus === "In Review")
  .map((record) => record.sourceId);
await writeFile(join(contentRoot, "signals", `${heldSignalId}.mdx`), `---
id: "${heldSignalId}"
title: "The 56I first pass preserves every unresolved continuation rule"
slug: "56i-first-pass-continuation-hold"
record_status: "In Review"
summary: "The three Open rails remain Open and the nine remaining partial records retain explicit annual, interval, execution, investigation, full-year, attribution, or outcome gaps."
source_ids:
${yamlList([...new Set(heldSourceIds)])}
published_date: null
captured_date: 2026-07-25
primary_topic: "Policy and Standards"
framework_layers:
${yamlList(["Resource Foundations", "Enabling Infrastructure", "Human Systems"])}
signal_type: "Market Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Needs Follow-Up"
why_it_matters: "The hold prevents a current source check, monthly observation, project commitment, or planned outcome from becoming false full closure."
dependencies:
  - "exact record identity"
  - "compatible unit and denominator"
  - "declared observation window"
  - "named continuation rule"
constraints:
${yamlList(["Data Quality", "Standards", "Infrastructure", "Public Trust"])}
receiving_systems:
  - "Twelve named Phase 56I entities"
local_implications:
  - "Continue only on the named rails; do not infer performance from missing disclosure."
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-25
editorial_notes: "Hold until an exact record changes one or more named continuation conditions."
---

## Why the records continue

Phase 56I completes the first-pass queue without claiming that a report index, monthly release, program commitment, project plan, single-month carrier observation, or ongoing investigation is a complete operating or outcome record.

## Stop rule

Do not convert evidence availability or closure state into a performance comparison, quality judgment, safety claim, ranking, composite, or causal conclusion.
`, "utf8");

await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), `---
id: "${briefingId}"
title: "Research Watch 013: Remaining Rails and First-Pass Completion"
slug: "research-watch-013-first-pass-completion"
record_status: "Published"
summary: "Phase 56I continues the three Open rails and completes the first pass through the nine remaining Partially Closed records while publishing only two genuinely new bounded findings."
published_date: 2026-07-25
captured_date: 2026-07-25
signal_ids:
${yamlList([...signalSpecs.map((signal) => signal.id), heldSignalId])}
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-25
top_takeaways:
  - "DHS, Manatee, and Gateway remain Open under their exact continuation rules."
  - "The nine remaining Partially Closed records now have a completed first-pass decision."
  - "EIA's July release and Monaghan's March program record add bounded new denominators."
  - "Existing manufacturer and airline findings are referenced without being republished as new discoveries."
  - "The 24-entity ledger remains one Closed, twenty Partially Closed, and three Open evidence states."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
what_to_watch_next:
  - "DHS FY 2025 enterprise FISMA publication."
  - "Manatee interval dispatch and availability."
  - "Gateway final investigation and full contracted-capacity restoration."
  - "Realized facility, investment, job, and repeat-output records for the three manufacturers."
  - "December 2026 and full-year 2026 reporting for the six carriers."
---

## First-pass result

Phase 56I completes every remaining first-pass decision. It does not produce a closure-state change: DHS, Manatee, and Gateway remain Open, and the nine selected manufacturer and carrier records remain Partially Closed.

Two source developments justify new bounded publication. EIA's July 23 release extends its monthly operating-data rail through May 2026 without supplying Manatee interval availability. Empire State Development's March report fixes Monaghan's employment, job, investment, and maximum-credit commitments while explicitly stopping short of eligibility or realized outcomes.

## Current closure ledger

- Closed: 1
- Partially Closed: 20
- Open: 3

These are evidence states for one selected record per entity. They are not performance, safety, quality, readiness, or value measures.

## Next acquisition queue

Phase 56J should return to the strongest evidence-value continuation rules across all twenty Partially Closed records while keeping the three Open rails active. Scheduled checks remain bounded inserts rather than pauses.
`, "utf8");

const acquisitions = records.map((record) => ({
  acquisition_id: `acquisition-56i-${record.slug}`,
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
  comparison_boundary: "Closure status is evidence state, not entity performance; no ranking, score, or causal claim is authorized.",
}));

await writeJson(join(dataRoot, "phase-56i-remaining-rails-first-pass.json"), {
  phase: "56I",
  captured_date: capturedDate,
  acquisition_count: records.length,
  open_queue_checked: 3,
  remaining_partially_closed_queue_checked: 9,
  first_pass_complete: true,
  status_changes: {
    open_to_partially_closed: 0,
    partially_closed_to_closed: 0,
    unchanged_open: 3,
    unchanged_partially_closed: 9,
  },
  current_cross_cohort_closure_counts: {
    closed: 1,
    partially_closed: 20,
    open: 3,
  },
  acquisitions,
});

await writeJson(join(dataRoot, "phase-56i-publication-review.json"), {
  phase: "56I",
  reviewed_date: capturedDate,
  source_profiles_added: createdSources.size,
  acquisition_count: records.length,
  document_decisions: {
    reviewed: records.length,
    promoted: records
      .filter((record) => record.recordStatus === "Published")
      .map((record) => `research-doc-56i-${record.slug}`),
    held: records
      .filter((record) => record.recordStatus === "In Review")
      .map((record) => `research-doc-56i-${record.slug}`),
  },
  signal_decisions: {
    reviewed: signalSpecs.length + 1,
    promoted: signalSpecs.map((signal) => signal.id),
    held: [heldSignalId],
  },
  acquisition_rule: "Every check retains its Phase 56F coverage ID and named continuation rule.",
  first_pass_rule: "Existing findings are referenced rather than republished as new findings; only genuinely new bounded records produce new signals.",
  unavailable_record_rule: "An unavailable exact record produces a dated source check and continuation rule, not generic replacement context.",
  closure_rule: "DHS, Manatee, and Gateway remain Open; all nine selected partial records remain Partially Closed.",
  comparison_rule: "No causal effect, ranking, completeness score, composite score, readiness score, or inference from missing disclosure is permitted.",
});

await writeJson(join(contentRoot, "updates", "2026-07-25-phase-56i-first-pass-completion.json"), {
  id: "update-2026-07-25-phase-56i-first-pass-completion",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56I completes the remaining first-pass queue",
  summary: "FTFN adds twelve evidence decisions, two Published bounded signals, one held synthesis, Research Watch 013, and a fifteen-file archive.",
  affected_record_ids: [
    collectionId,
    briefingId,
    ...signalSpecs.map((signal) => signal.id),
    heldSignalId,
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-013-first-pass-completion/",
    ...signalSpecs.map((signal) => `/signals/${signal.slug}/`),
  ],
  evidence_note: "The three Open rails remain Open and all nine selected partial records remain Partially Closed. New publication is limited to the EIA monthly-data rail and Monaghan commitment denominator.",
  work_package: "docs/work-packages/phase-56i-remaining-open-rails-partial-first-pass.md",
});

console.log(`Generated Phase 56I: ${createdSources.size} sources, twelve evidence documents, three signals, one collection, Research Watch 013, two ledgers, and one update.`);
