import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-07-24";
const collectionSlug = "operating-record-acquisition-closure-batch-two-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-011-operating-record-acquisition";
const publishedSignalId = "signal-56g-dalrymple-operating-record-advance";
const heldSignalId = "signal-56g-six-open-record-continuation";

const records = [
  {
    slug: "dhs-fisma-fy2025",
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
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Report Series",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Released FY 2025 enterprise FISMA result",
    finding: "The DHS OIG report index was checked on July 24, 2026. It did not expose a final FY 2025 enterprise FISMA evaluation; the existing project record remains the latest exact review identifier in the FTFN evidence stack.",
    decision: "No closure change. A current report-index check cannot be converted into an annual outcome.",
    remainingGap: "Released FY 2025 evaluation, component findings, closure dates, endpoint and cloud coverage, incidents, recovery, and service effects.",
    reopeningRule: "Reopen when DHS OIG publishes the final FY 2025 enterprise evaluation or a dated replacement outcome.",
    limitation: "A dated index check establishes the public-report boundary at capture; it does not prove that no nonpublic work exists or supply the missing annual result.",
  },
  {
    slug: "doe-fisma-fy2025",
    coverageId: "coverage-56f-doe",
    entityId: "agency-doe",
    entityName: "Department of Energy",
    portfolio: "ai_cyber",
    sourceId: "source-56g-doe-cyber-governance-2026",
    sourceName: "DOE Cybersecurity and Information Technology Governance Program Audit",
    url: "https://www.energy.gov/ig/articles/department-energys-cybersecurity-and-information-technology-governance-program",
    publisher: "Department of Energy Office of Inspector General",
    publicationDate: "2026-06-02",
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    liveAccessType: "Release Page",
    documentType: "Oversight Report",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Department-wide FY 2025 FISMA evaluation",
    finding: "DOE OIG published a department-wide cybersecurity and IT governance audit with eleven recommendations, but it is a different review from the missing FY 2025 FISMA evaluation.",
    decision: "No closure change. The governance audit is relevant current oversight, not the requested annual FISMA result.",
    remainingGap: "FY 2025 FISMA evaluation, finding-level closure, incidents, recovery, and laboratory or mission effects.",
    reopeningRule: "Reopen when DOE OIG publishes the department-wide FY 2025 FISMA evaluation or a dated official status for that review.",
    limitation: "The governance audit cannot be substituted for the annual FISMA evaluation and does not expose incident, recovery, or mission-outcome denominators.",
  },
  {
    slug: "f35-fort-worth-monthly-output",
    coverageId: "coverage-56f-f35-fort-worth",
    entityId: "manufacturer-lockheed-f35-fort-worth",
    entityName: "Lockheed Martin F-35 Fort Worth final-assembly line",
    portfolio: "manufacturing",
    sourceId: "source-56g-f35-fast-facts-april-2026",
    sourceName: "F-35 Lightning II Fast Facts — April 2026",
    url: "https://www.f35.com/content/dam/lockheed-martin/aero/f35/documents/26-00130_001A%20F-35FastFacts_4_2026.pdf?pubDate=20260430",
    publisher: "Lockheed Martin",
    publicationDate: "2026-04-01",
    sourceType: "Company Press Room",
    credibility: "Tier 2",
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    liveAccessType: "Data Download",
    documentType: "Program Milestone",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Aircraft due versus accepted by month with capability state",
    finding: "The April 2026 contractor snapshot reports 1,325-plus cumulative deliveries as of March 31, 2026, but it does not disclose monthly aircraft due, accepted aircraft, or accepted capability state.",
    decision: "No closure change. A rounded cumulative fleet total is not a month-level production-line denominator.",
    remainingGap: "Monthly aircraft due and accepted, capability state, labor, rework, yield, line inventory, and supplier constraints.",
    reopeningRule: "Reopen when the F-35 program office, DOD, GAO, or Lockheed publishes a month-level due-and-accepted series with capability state.",
    limitation: "The total is rounded, contractor-attributed, cumulative across the program, and incompatible with a monthly Fort Worth due-versus-accepted series.",
  },
  {
    slug: "manatee-interval-operation",
    coverageId: "coverage-56f-manatee",
    entityId: "eia-plant-60014",
    entityName: "Manatee Solar Energy Center",
    portfolio: "infrastructure",
    sourceId: "source-56g-manatee-fpl-site-plan-2026",
    sourceName: "Florida Power & Light 2026 Ten-Year Site Plan",
    url: "https://www.fpl.com/content/dam/fplgp/us/en/about/pdf/ten-year-site-plan.pdf",
    publisher: "Florida Power & Light Company",
    publicationDate: null,
    sourceType: "Company Press Room",
    credibility: "Tier 2",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety", "Weather"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Data Download",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Interval dispatch and availability for the named battery",
    finding: "FPL's 2026 plan lists Manatee Battery Storage as one 409 MW unit in commercial operation as of December 31, 2025. It does not publish interval dispatch, availability, cycles, state of charge, or degradation.",
    decision: "No closure change. Current capacity and in-service identity do not satisfy the interval operating-record requirement.",
    remainingGap: "Interval dispatch, availability, cycles, state of charge, degradation, revenue, curtailment, outage response, and customer cost.",
    reopeningRule: "Reopen when FPL, Florida PSC, EIA, or a balancing authority publishes asset-specific operating data with a declared interval.",
    limitation: "The utility planning record supports asset identity and capacity at a date, not observed interval operation or independently verified performance.",
  },
  {
    slug: "gateway-investigation-restoration",
    coverageId: "coverage-56f-gateway",
    entityId: "eia-plant-63834",
    entityName: "Gateway Energy Storage System",
    portfolio: "infrastructure",
    sourceId: "source-56g-gateway-caiso-queue-2026",
    sourceName: "CAISO Public Queue Report — Gateway Energy Storage Entry",
    url: "https://www.caiso.com/documents/publicqueuereport.pdf",
    publisher: "California Independent System Operator",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Data Download",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Final investigation and full contracted-capacity restoration",
    finding: "CAISO's current queue entry identifies Gateway project 1170 as completed, 250 MW, full capacity, with an executed interconnection agreement and April 22, 2025 current online date.",
    decision: "No closure change. Interconnection-queue completion is an administrative connection state, not proof of post-incident full-capacity operation or final investigation closure.",
    remainingGap: "Final investigation, full return to service, contracted-capacity restoration, availability, dispatch, duration, degradation, revenue, and reliability effects.",
    reopeningRule: "Reopen when CPUC, EPA, CAISO, SCE, or the operator publishes final findings or a full-capacity operating record.",
    limitation: "The queue report does not establish actual dispatch, availability, restored contracted capacity, safety closure, or the result of an incident investigation.",
  },
  {
    slug: "hornsdale-annual-operation",
    coverageId: "coverage-56f-hornsdale",
    entityId: "battery-hornsdale-power-reserve",
    entityName: "Hornsdale Power Reserve",
    portfolio: "infrastructure",
    sourceId: "source-56g-hornsdale-aemo-interval-data-index",
    sourceName: "AEMO Ancillary Services Causer Pays Data — Hornsdale Record Check",
    url: "https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/data-nem/ancillary-services-data/ancillary-services-market-causer-pays-data",
    publisher: "Australian Energy Market Operator",
    publicationDate: null,
    sourceType: "Government Agency",
    credibility: "Tier 1",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Manual Page Check",
    documentType: "Data Release",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Annual availability and dispatch under a declared service denominator",
    finding: "AEMO's asset-specific Hornsdale record on this rail remains the supplementary regulation-MW dataset for December 10, 2017 through January 7, 2018 under element HPRG1.",
    decision: "No closure change. The official rail exposes a short historical interval record, not a later annual availability and dispatch series.",
    remainingGap: "Annual availability, dispatch, service enablement and delivery, cycling, degradation, revenue, safety, and customer outcomes.",
    reopeningRule: "Reopen when AEMO, AER, the South Australian government, or the operator publishes an asset-specific annual operating series.",
    limitation: "A four-week historical regulation-MW extract cannot be generalized into later annual availability, dispatch, degradation, revenue, safety, or customer outcomes.",
  },
  {
    slug: "dalrymple-post-project-operation",
    coverageId: "coverage-56f-dalrymple",
    entityId: "battery-dalrymple-escri-sa",
    entityName: "Dalrymple ESCRI-SA Battery Energy Storage System",
    portfolio: "infrastructure",
    sourceId: "source-56g-dalrymple-electranet-tapr-2026",
    sourceName: "ElectraNet 2026 Transmission Annual Planning Report",
    url: "https://electranet.com.au/wp-content/uploads/2026/03/Electranet-2026-TAPR.pdf",
    publisher: "ElectraNet",
    publicationDate: "2026-03-01",
    sourceType: "Company Press Room",
    credibility: "Tier 2",
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    liveAccessType: "Data Download",
    documentType: "Technical Report",
    priorStatus: "Open",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Post-project availability, dispatch, and islanding events",
    finding: "ElectraNet's March 2026 planning report lists the Dalrymple BESS Islanding Detection Scheme as an existing control scheme and describes its current automatic islanding function for Dalrymple Substation, Dalrymple North, and SAPN load.",
    decision: "The later asset-specific operating-control record satisfies the reopening condition and moves the selected evidence state to Partially Closed; actual events and operating denominators remain open.",
    remainingGap: "Post-2021 availability, dispatch, realized islanding events, state of charge, degradation, revenue, reliability, and customer outcomes.",
    phase56FReopeningRule: "Reopen when ElectraNet, AGL, AEMO, ARENA, or the South Australian regulator publishes a later asset-specific record.",
    reopeningRule: "Reopen when ElectraNet, AGL, AEMO, ARENA, or the South Australian regulator publishes dated event counts or an asset-level operating series.",
    limitation: "The network plan documents scheme presence and intended control action, not activation counts, dispatch, availability, degradation, revenue, avoided cost, reliability, or customer outcomes.",
  },
];

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

for (const [index, record] of records.entries()) {
  const archiveName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  await writeJson(join(contentRoot, "sources", `${record.sourceId}.json`), {
    id: record.sourceId,
    name: record.sourceName,
    url: record.url,
    source_type: record.sourceType,
    credibility_level: record.credibility,
    primary_topics: record.topics,
    framework_layers: record.layers,
    country_or_region: record.entityId.startsWith("battery-") ? "Australia" : "United States",
    update_frequency: "Event-driven",
    capture_priority: "High",
    known_limitations: `${record.limitation} Phase 56G keeps the coverage ID, source identity, attribution, observation window, closure state, and reopening rule attached.`,
    last_checked_date: capturedDate,
    watch_lanes: record.watchLanes,
    live_access_type: record.liveAccessType,
    ...(record.url.toLowerCase().includes(".pdf") ? { data_download_url: record.url } : {}),
    review_cadence_days: 60,
    monitoring_status: "Active",
    coverage_role: record.sourceType === "Company Press Room"
      ? ["Primary Data", "Source Freshness", "Company Claim"]
      : ["Primary Data", "Source Freshness"],
    jurisdiction: record.entityId.startsWith("battery-") ? "South Australia" : "United States",
    source_owner: record.publisher,
    notes: `Phase 56G exact-record acquisition source. Collection: ${collectionSlug}.`,
  });

  await writeJson(
    join(contentRoot, "research-documents", `${348 + index}-56g-${record.slug}.json`),
    {
      id: `research-doc-56g-${record.slug}`,
      collection_id: collectionId,
      title: `${record.entityName}: Phase 56G Acquisition Check`,
      slug: `56g-${record.slug}`,
      record_status: record.recordStatus,
      publisher: record.publisher,
      publication_date: record.publicationDate,
      document_type: record.documentType,
      summary: `${record.finding} Phase 56G decision: ${record.decision}`,
      key_findings: [
        `Phase 56F coverage ID: ${record.coverageId}.`,
        `Highest-value missing record: ${record.priority}.`,
        `Closure state: ${record.priorStatus} to ${record.currentStatus}.`,
        `Continuation rule: ${record.reopeningRule}`,
      ],
      why_it_matters: "The acquisition check tests one named reopening rule without allowing adjacent context to stand in for the requested operating or closure record.",
      ftfn_relevance: [
        `Preserves the stable entity ID ${record.entityId}.`,
        "Records the exact official or first-party rail checked and the result at a date.",
        "Separates a useful contextual record from the narrower evidence needed to change closure state.",
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
    },
  );
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Operating-Record Acquisition and Closure Batch Two, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Seven exact-record acquisition checks test the Open Phase 56F rails. Dalrymple advances to Partially Closed; six records remain Open under dated continuation rules.",
  scope: "Two federal agency annual-review rails, one named aircraft production line, and four named battery assets.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56g-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 10-file archive contains seven official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Each record is tied to an existing Phase 56F coverage ID and reopening rule. An unavailable exact record yields a dated source check and continuation rule, not a substitute finding. Closure state measures evidence only.",
});

await writeFile(join(contentRoot, "signals", `${publishedSignalId}.mdx`), `---
id: "${publishedSignalId}"
title: "A later network plan confirms Dalrymple's islanding control, not its operating outcomes"
slug: "56g-dalrymple-operating-record-advance"
record_status: "Published"
summary: "ElectraNet's March 2026 plan names the Dalrymple BESS Islanding Detection Scheme as an existing control, moving one bounded evidence question from Open to Partially Closed."
source_ids:
  - "source-56g-dalrymple-electranet-tapr-2026"
published_date: 2026-07-24
captured_date: 2026-07-24
primary_topic: "Energy"
framework_layers:
${yamlList(["Resource Foundations", "Enabling Infrastructure", "Human Systems"])}
signal_type: "Policy Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Primary Source"
verification_status: "Verified Against Primary Source"
why_it_matters: "The record demonstrates how a named reopening rule can advance when a later asset-specific source appears, while keeping actual operations outside the claim."
dependencies:
  - "stable Dalrymple asset identity"
  - "ElectraNet control-scheme attribution"
  - "separate event and operating denominators"
constraints:
${yamlList(["Power", "Infrastructure", "Data Quality", "Safety"])}
receiving_systems:
  - "Dalrymple Substation"
  - "Dalrymple North"
  - "SAPN load"
local_implications:
  - "A documented control path is not a measured reliability or customer outcome."
evidence_gap_ids:
  - "gap-003"
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-24
---

## What changed

ElectraNet's March 2026 planning report lists the Dalrymple BESS Islanding Detection Scheme among existing control schemes. It describes an automatic path that can island Dalrymple Substation, Dalrymple North, and SAPN load onto a microgrid when upstream islanding is detected.

## What remains open

The report does not publish activation counts, availability, dispatch, state of charge, degradation, revenue, avoided cost, reliability, or customer outcomes. Phase 56G therefore moves the bounded evidence state to Partially Closed rather than Closed.
`, "utf8");

const sixOpenSourceIds = records
  .filter((record) => record.currentStatus === "Open")
  .map((record) => record.sourceId);
await writeFile(join(contentRoot, "signals", `${heldSignalId}.mdx`), `---
id: "${heldSignalId}"
title: "Six current source checks do not close six missing operating records"
slug: "56g-six-open-record-continuation"
record_status: "In Review"
summary: "Current official and first-party rails sharpen record boundaries for DHS, DOE, F-35 Fort Worth, Manatee, Gateway, and Hornsdale without supplying their exact missing denominators."
source_ids:
${yamlList(sixOpenSourceIds)}
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
why_it_matters: "The hold prevents a current index, governance review, cumulative total, capacity filing, interconnection record, or historical interval extract from becoming a false closure."
dependencies:
  - "exact record identity"
  - "compatible unit and denominator"
  - "declared observation window"
  - "named reopening rule"
constraints:
${yamlList(["Data Quality", "Standards", "Infrastructure", "Public Trust"])}
receiving_systems:
  - "Six named Phase 56F entities"
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
editorial_notes: "Hold until one or more exact records satisfy the named Phase 56F reopening condition."
---

## Why the six records remain open

Each source is current and relevant, but each breaks the selected evidence contract: annual result, monthly due-versus-accepted line output, interval battery operation, final investigation and restored operation, or annual asset operation.

## Stop rule

Do not convert a dated source check or adjacent context into a closure, performance comparison, score, or causal claim.
`, "utf8");

await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), `---
id: "${briefingId}"
title: "Research Watch 011: Operating-Record Acquisition and Closure Batch Two"
slug: "research-watch-011-operating-record-acquisition"
record_status: "Published"
summary: "Seven Open evidence rails were checked against current named sources: Dalrymple advances to Partially Closed and six remain Open under explicit continuation rules."
published_date: 2026-07-24
captured_date: 2026-07-24
signal_ids:
  - "${publishedSignalId}"
  - "${heldSignalId}"
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: 2026-07-24
top_takeaways:
  - "All seven checks retain their existing Phase 56F coverage IDs and reopening rules."
  - "Dalrymple moves from Open to Partially Closed because a 2026 network plan supplies a later asset-specific control record."
  - "DHS, DOE, F-35 Fort Worth, Manatee, Gateway, and Hornsdale remain Open because the exact operating or closure record is still unavailable."
  - "The 24-entity ledger now stands at one Closed, seventeen Partially Closed, and six Open evidence states."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
what_to_watch_next:
  - "DHS and DOE annual FISMA results."
  - "F-35 monthly due, accepted, and capability-state output."
  - "Manatee and Hornsdale interval or annual asset operation."
  - "Gateway final investigation and verified full-capacity operation."
  - "Dalrymple activation counts and operating denominators."
---

## Acquisition result

Phase 56G checked all seven records that Phase 56F left Open. One named reopening condition was met: ElectraNet's March 2026 report adds a later Dalrymple control-scheme record. It supports Partially Closed, not Closed.

The other six checks produced current source-boundary records. Those records are retained as acquisition evidence, but they do not satisfy the selected denominator or outcome.

## Current closure ledger

- Closed: 1
- Partially Closed: 17
- Open: 6

These are evidence states for one selected record per entity. They are not performance, safety, quality, readiness, or value measures.

## Next acquisition queue

Phase 56H should deepen the six remaining Open rails in parallel with a bounded first pass through the seventeen Partially Closed reopening rules. Scheduled checks remain inserts rather than pauses.
`, "utf8");

const acquisitions = records.map((record) => ({
  acquisition_id: `acquisition-56g-${record.slug}`,
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

await writeJson(join(dataRoot, "phase-56g-operating-record-acquisition.json"), {
  phase: "56G",
  captured_date: capturedDate,
  acquisition_count: records.length,
  phase_56f_open_queue_count: records.length,
  status_changes: {
    open_to_partially_closed: 1,
    unchanged_open: 6,
  },
  current_cross_cohort_closure_counts: {
    closed: 1,
    partially_closed: 17,
    open: 6,
  },
  acquisitions,
});

await writeJson(join(dataRoot, "phase-56g-publication-review.json"), {
  phase: "56G",
  reviewed_date: capturedDate,
  source_profiles_added: records.length,
  acquisition_count: records.length,
  document_decisions: {
    reviewed: records.length,
    promoted: records
      .filter((record) => record.recordStatus === "Published")
      .map((record) => `research-doc-56g-${record.slug}`),
    held: records
      .filter((record) => record.recordStatus === "In Review")
      .map((record) => `research-doc-56g-${record.slug}`),
  },
  signal_decisions: {
    reviewed: 2,
    promoted: [publishedSignalId],
    held: [heldSignalId],
  },
  acquisition_rule: "Every check must retain its Phase 56F coverage ID and named reopening rule.",
  unavailable_record_rule: "An unavailable exact record produces a dated source check and continuation rule, not generic replacement context.",
  closure_rule: "Only Dalrymple changes closure state; the other six selected records remain Open.",
  comparison_rule: "No causal effect, ranking, completeness score, composite score, readiness score, or inference from missing disclosure is permitted.",
});

await writeJson(join(contentRoot, "updates", "2026-07-24-phase-56g-operating-record-acquisition.json"), {
  id: "update-2026-07-24-phase-56g-operating-record-acquisition",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56G checks all seven Open operating-record rails",
  summary: "FTFN adds seven named source checks, seven acquisition decisions, one Published bounded finding, one held synthesis, Research Watch 011, and a ten-file archive.",
  affected_record_ids: [
    collectionId,
    briefingId,
    publishedSignalId,
    heldSignalId,
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-011-operating-record-acquisition/",
    "/signals/56g-dalrymple-operating-record-advance/",
  ],
  evidence_note: "Dalrymple advances from Open to Partially Closed. Six exact records remain Open; no adjacent record is treated as a substitute.",
  work_package: "docs/work-packages/phase-56g-operating-record-acquisition-closure-batch-two.md",
});

console.log("Generated Phase 56G: seven sources, seven acquisition documents, two signals, one collection, Research Watch 011, two ledgers, and one update.");
