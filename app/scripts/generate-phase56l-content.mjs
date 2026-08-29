import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const publicRoot = join(appRoot, "public");
const capturedDate = "2026-07-25";
const collectionSlug = "realized-outcome-continuation-batch-one-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-016-realized-outcome-continuation";

const defaults = {
  portfolio: "manufacturing",
  topics: ["Advanced Manufacturing", "Human Futures"],
  layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
  constraints: ["Manufacturing", "Data Quality", "Supply Chain", "Labor"],
  watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
  country: "United States",
  jurisdiction: "United States manufacturing",
};

const records = [
  {
    slug: "current-applications-repeat-output-status",
    documentNumber: 393,
    coverageId: "coverage-56f-current-applications",
    entityId: "manufacturer-current-applications-watertown-ny",
    entityName: "Current Applications",
    sourceId: "source-56b-nist-mep-current-applications-lean",
    sourceName: "Lean Tools Provide Lead Time Reduction: Current Applications",
    url: "https://www.nist.gov/mep/successstories/2024/lean-tools-provide-lead-time-reduction",
    publisher: "National Institute of Standards and Technology",
    publicationDate: "2026-01-13",
    documentType: "Technical Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "Repeat same-line input and output under one declared period",
    finding:
      "The authoritative NIST MEP record still supplies one attributed intervention: production increased from 40 to 105 units per day, work in process fell from 105 to 5 units, and lead time fell 50 percent. The current official rail does not add a second compatible observation window.",
    decision:
      "Retain Partially Closed. The original same-line intervention remains useful, but it is not a repeat series and cannot be republished as a new realized outcome.",
    remainingGap:
      "A second dated same-line observation with compatible output, labor input, work in process, yield, scrap, downtime, cost, delivery, demand, or capital execution.",
    reopeningRule:
      "Reopen when a dated company, MEP, grant, or customer record reports repeat same-line input and output under a declared compatible window.",
    limitation:
      "The case study is company- and program-attributed, exposes one intervention rather than a repeat series, and does not report labor hours, yield, scrap, downtime, cost, demand, or an independently audited counterfactual.",
  },
  {
    slug: "island-components-certified-employment-outcome",
    documentNumber: 394,
    coverageId: "coverage-56f-island-components",
    entityId: "manufacturer-island-components-hauppauge-ny",
    entityName: "Island Components Group",
    sourceId: "source-56l-island-components-paris-fye2023",
    sourceName: "Suffolk County IDA Certified Annual Report FYE 2023: Island Components Group",
    url: "https://www.abo.ny.gov/annualreports/PARISAnnualReports/FYE2023/IDA/ARSuffolkCountyIndustrialDevelopmentAgency2023.pdf",
    publisher: "Suffolk County Industrial Development Agency via New York Authorities Budget Office",
    publicationDate: "2024-10-15",
    documentType: "Local Government Record",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Realized Hauppauge jobs, investment, or repeat operating output",
    finding:
      "The certified FYE 2023 PARIS record reports 25 FTEs before IDA status, 33 current FTEs, and a net employment change of eight for project 47052302A. It also records a $2,042,250 total project amount and $16,349 of reporting-year exemptions.",
    decision:
      "Retain Partially Closed. The record advances the rail from planned jobs to a reported realized employment denominator, but the project amount is not proof of completed spending and the report does not expose repeat production output.",
    remainingGap:
      "Completed and paid investment, repeat output, labor hours, work in process, yield, defects, downtime, delivery, demand, and independent surveillance findings.",
    reopeningRule:
      "Reopen when SCIDA, the company, a registrar, or a customer publishes completed investment or repeat operating output under a declared compatible period.",
    limitation:
      "PARIS employment and project fields are reported by the authority and are not independently verified by the Authorities Budget Office. Current FTEs do not establish job causation, and total project amount does not establish executed spending.",
    newSource: {
      sourceType: "Government Agency",
      credibility: "Tier 2",
      liveAccessType: "Data Download",
      sourceRoles: ["Primary Data", "Source Freshness"],
    },
    signal: {
      id: "signal-56l-island-components-certified-employment",
      slug: "56l-island-components-certified-employment",
      title: "Island Components' certified project record reports 33 current FTEs",
      summary:
        "Suffolk County IDA's certified FYE 2023 record reports 33 current FTEs against a 25-FTE pre-project baseline, while completed spending and repeat operating output remain unverified.",
      body:
        "The certified PARIS record for Island Components project 47052302A reports 25 FTEs before IDA status, 33 current FTEs, and a net employment change of eight. It also lists a $2.042 million total project amount and $16,349 in reporting-year exemptions. The employment row is a realized reported denominator; it does not prove that the project caused the change or that the listed project amount was fully spent.",
    },
  },
  {
    slug: "monaghan-medical-certified-project-outcome",
    documentNumber: 395,
    coverageId: "coverage-56f-monaghan-medical",
    entityId: "manufacturer-monaghan-medical-plattsburgh-ny",
    entityName: "Monaghan Medical",
    sourceId: "source-56l-monaghan-medical-ccida-fye2025",
    sourceName: "Clinton County IDA Certified Annual Report FYE 2025: Monaghan Medical",
    url: "https://www.clintoncountyida.com/media/userfiles/subsite_328/files/list-maker/ccida-annual-audit-reports/annual-audit-reports/ccida-2025-annual-audit-report.pdf",
    publisher: "Clinton County Industrial Development Agency",
    publicationDate: "2026-03-31",
    documentType: "Local Government Record",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Certified investment, realized jobs, or units under a compatible window",
    finding:
      "The certified FYE 2025 record for project 0902-18-05 lists a $10 million total project amount, notes construction complete in 2021, and reports 91 current FTEs against 68 before IDA status, a net employment change of 23.",
    decision:
      "Retain Partially Closed. The record establishes a completed earlier IDA project and a realized reported employment denominator, but it does not certify the separate 2025 ESD commitment or publish compatible production units.",
    remainingGap:
      "Execution and certification of the separate 2025 facility and machinery commitment, units distributed, same-line output, labor input, yield, scrap, downtime, delivery, and patient outcomes.",
    reopeningRule:
      "Reopen when ESD reports certification or credit issuance for the later commitment, or FDA or company records expose units distributed and a compatible production window.",
    limitation:
      "The certified report covers the 2018-approved IDA project completed in 2021, not the separate 2025 ESD commitment. Current FTEs do not establish job causation, and total project amount is not an audited cash-spend measure.",
    newSource: {
      sourceType: "Government Agency",
      credibility: "Tier 2",
      liveAccessType: "Data Download",
      sourceRoles: ["Primary Data", "Source Freshness"],
    },
    signal: {
      id: "signal-56l-monaghan-medical-certified-project",
      slug: "56l-monaghan-medical-certified-project",
      title: "Monaghan's certified IDA record pairs project completion with 91 current FTEs",
      summary:
        "Clinton County IDA's certified FYE 2025 record notes the earlier $10 million project was completed in 2021 and reports 91 current FTEs against a 68-FTE baseline.",
      body:
        "The certified annual report identifies Monaghan Medical project 0902-18-05 as a $10 million project approved in 2018 and notes construction complete in 2021. For FYE 2025 it reports 91 current FTEs against 68 before IDA status, a net change of 23. This is a realized record for the earlier IDA project, not execution evidence for the separate 2025 ESD commitment and not a compatible production-output series.",
    },
  },
].map((record) => ({ ...defaults, ...record }));

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

for (const [index, record] of records.entries()) {
  if (record.newSource) {
    await writeJson(join(contentRoot, "sources", `${record.sourceId}.json`), {
      id: record.sourceId,
      name: record.sourceName,
      url: record.url,
      source_type: record.newSource.sourceType,
      credibility_level: record.newSource.credibility,
      primary_topics: record.topics,
      framework_layers: record.layers,
      country_or_region: record.country,
      update_frequency: "Annual",
      capture_priority: "High",
      known_limitations: `${record.limitation} Phase 56L keeps identity, period, source role, evidence state, and continuation rule attached.`,
      last_checked_date: capturedDate,
      watch_lanes: record.watchLanes,
      live_access_type: record.newSource.liveAccessType,
      data_download_url: record.url,
      review_cadence_days: 365,
      monitoring_status: "Active",
      coverage_role: record.newSource.sourceRoles,
      jurisdiction: record.jurisdiction,
      source_owner: record.publisher,
      notes: `Phase 56L realized-outcome continuation source. Collection: ${collectionSlug}.`,
    });
  }

  const documentId = `research-doc-56l-${record.slug}`;
  const fileName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  const localCapturePath = `/downloads/${collectionSlug}/official-links/${fileName}`;
  await writeJson(join(contentRoot, "research-documents", `${record.documentNumber}-56l-${record.slug}.json`), {
    id: documentId,
    collection_id: collectionId,
    title: `${record.entityName}: Phase 56L Realized-Outcome Decision`,
    slug: `56l-${record.slug}`,
    record_status: record.recordStatus,
    publisher: record.publisher,
    publication_date: record.publicationDate,
    document_type: record.documentType,
    summary: `${record.finding} Phase 56L decision: ${record.decision}`,
    key_findings: [
      `Phase 56F coverage ID: ${record.coverageId}.`,
      `Named record: ${record.priority}.`,
      `Evidence state: ${record.priorStatus} to ${record.currentStatus}.`,
      `Continuation rule: ${record.reopeningRule}`,
    ],
    why_it_matters:
      "The decision separates a realized outcome, project field, commitment, and exact non-closure without converting any of them into a comparative performance claim.",
    ftfn_relevance: [
      `Preserves stable entity ID ${record.entityId}.`,
      "Separates commitments, project amounts, completions, reported employment, and operating output.",
      "Keeps denominator, attribution, limitation, and reopening rule attached.",
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
    archive_member: `official-links/${fileName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  await writeFile(
    join(publicRoot, localCapturePath),
    [
      "FTFN Phase 56L official link record",
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
    ].join("\r\n"),
    "utf8",
  );

  if (record.signal) {
    const signalMdx = `---
id: ${yamlQuote(record.signal.id)}
title: ${yamlQuote(record.signal.title)}
slug: ${yamlQuote(record.signal.slug)}
record_status: "Published"
summary: ${yamlQuote(record.signal.summary)}
source_ids:
  - ${yamlQuote(record.sourceId)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: "Advanced Manufacturing"
framework_layers:
${yamlList(record.layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Audited or Verified Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The record advances a named realized-outcome rail while preserving project, period, attribution, and causation boundaries."
dependencies:
  - "stable entity and project identity"
  - "compatible unit and observation window"
  - "declared attribution and evidence state"
constraints:
${yamlList(record.constraints)}
receiving_systems:
  - "Phase 56L realized-outcome continuation"
local_implications:
  - "The reported employment denominator cannot be converted into an entity-performance, productivity, readiness, or value score."
evidence_gap_ids:
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
---

## What changed

${record.signal.body}

## Boundary

${record.limitation}

No entity ranking, composite, readiness score, productivity claim, or causal claim is supported.
`;
    await writeFile(join(contentRoot, "signals", `${record.signal.id}.mdx`), signalMdx, "utf8");
  }
}

const acquisitions = records.map((record) => ({
  acquisition_id: `acquisition-56l-${record.slug}`,
  coverage_id: record.coverageId,
  entity_id: record.entityId,
  entity_name: record.entityName,
  portfolio: record.portfolio,
  named_record: record.priority,
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
    "A project amount, completion note, or reported employment row is not a productivity, causation, readiness, or value measure.",
}));

await writeJson(join(dataRoot, "phase-56l-realized-outcome-continuation.json"), {
  phase: "56L",
  captured_date: capturedDate,
  batch_rule:
    "Advance only named official realized-outcome records; preserve commitments, project amounts, completions, employment, and operating output as distinct evidence types.",
  prior_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  post_batch_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  closure_changes: [],
  acquisition_ids: acquisitions.map((entry) => entry.acquisition_id),
  acquisitions,
});

const signalRecords = records.filter((record) => record.signal);
await writeJson(join(dataRoot, "phase-56l-publication-review.json"), {
  phase: "56L",
  reviewed_date: capturedDate,
  exact_records_checked: records.length,
  new_source_profiles: records.filter((record) => record.newSource).length,
  reused_source_profiles: records.filter((record) => !record.newSource).length,
  document_decisions: {
    reviewed: records.length,
    promoted: records
      .filter((record) => record.recordStatus === "Published")
      .map((record) => `research-doc-56l-${record.slug}`),
    held: records
      .filter((record) => record.recordStatus !== "Published")
      .map((record) => `research-doc-56l-${record.slug}`),
  },
  signal_decisions: {
    reviewed: signalRecords.length,
    promoted: signalRecords.map((record) => record.signal.id),
    held: [],
  },
  closure_decision:
    "No evidence-state changes. Island Components and Monaghan Medical gain bounded realized-employment records; Current Applications retains an exact repeat-series non-closure.",
  substitution_rule:
    "A project amount is not executed spending, a current FTE row is not job causation, and one intervention is not a repeat operating series.",
  comparison_rule:
    "No acquisition result or closure state is an entity ranking, productivity score, readiness claim, or causal result.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Realized-Outcome Continuation — Batch One, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary:
    "Phase 56L checks three manufacturer rails, publishes two bounded realized-employment advancements, retains one exact non-closure, and preserves the 1 Closed / 21 Partially Closed / 2 Open evidence ledger.",
  scope: "Current Applications, Island Components Group, and Monaghan Medical realized-outcome decisions.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56l-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note:
    "The six-file archive contains three official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note:
    "Each decision retains the Phase 56F coverage ID, stable entity ID, exact named record, source attribution, evidence state, limitation, and reopening rule.",
});

const briefingMdx = `---
id: ${yamlQuote(briefingId)}
title: "Research Watch 016: Realized-Outcome Continuation"
slug: "research-watch-016-realized-outcome-continuation"
record_status: "Published"
summary: "Phase 56L publishes two certified realized-employment records and retains one exact repeat-series non-closure without changing the evidence-state ledger."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlList(signalRecords.map((record) => record.signal.id))}
evidence_gap_ids:
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "Island Components reports 33 current FTEs against a 25-FTE pre-project baseline in a certified FYE 2023 record."
  - "Monaghan Medical reports 91 current FTEs against a 68-FTE baseline and a 2021 construction-completion note for its earlier IDA project."
  - "Current Applications still lacks a second compatible same-line input/output observation."
  - "Project amount, reported FTEs, job causation, later commitments, and operating output remain separate."
constraint_watch:
  - "Manufacturing"
  - "Data Quality"
  - "Supply Chain"
  - "Labor"
what_to_watch_next:
  - "A second compatible Current Applications same-line observation."
  - "Island Components completed investment or repeat operating output."
  - "Monaghan's later ESD certification or compatible production-unit record."
  - "Any newly published Phase 56K exact official record."
---

## Batch-one result

Phase 56L advances two manufacturer rails with certified annual-report records. Island Components now has a reported current-employment denominator of 33 FTEs against 25 before IDA status. Monaghan Medical's earlier IDA project is recorded as construction complete in 2021, with 91 current FTEs against a 68-FTE baseline in the certified FYE 2025 report.

Current Applications remains an exact non-closure. Its NIST MEP case study provides one valuable intervention result, not the second compatible same-line observation required by the continuation rule.

## Current closure ledger

- Closed: 1
- Partially Closed: 21
- Open: 2

These are evidence states for selected records. They are not performance, productivity, readiness, quality, or value measures.

## Scope controls

A project amount is not proof of executed spending. A current FTE row is not proof of job causation. Monaghan's earlier IDA project is not the separate 2025 ESD commitment. One intervention is not a repeat operating series. These distinctions remain attached to every record.
`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefingMdx, "utf8");

await writeJson(join(contentRoot, "updates", "2026-07-25-phase-56l-realized-outcome-continuation.json"), {
  id: "update-2026-07-25-phase-56l-realized-outcome-continuation",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56L advances two manufacturer realized-outcome rails",
  summary:
    "FTFN publishes certified reported-employment outcomes for Island Components and Monaghan Medical while retaining Current Applications' exact repeat-series non-closure.",
  affected_record_ids: [collectionId, briefingId, ...signalRecords.map((record) => record.signal.id)],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-016-realized-outcome-continuation/",
    ...signalRecords.map((record) => `/signals/${record.signal.slug}/`),
  ],
  evidence_note:
    "Reported current FTEs are realized denominators, not proof of job causation; project amounts, completions, later commitments, and operating output remain separate.",
  work_package: "docs/work-packages/phase-56l-realized-outcome-continuation.md",
});

console.log(
  "Generated Phase 56L: two sources, three realized-outcome documents, two signals, one collection, Research Watch 016, two ledgers, and one update.",
);
