import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const publicRoot = join(appRoot, "public");
const capturedDate = "2026-07-25";
const collectionSlug = "exact-record-continuation-batch-two-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-015-exact-record-continuation";

const portfolios = {
  cyber: {
    topics: ["Cybersecurity", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Data Quality", "Standards", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    country: "United States",
    jurisdiction: "United States federal government",
  },
  energy: {
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
    slug: "dhs-fy2025-enterprise-fisma-status",
    documentNumber: 386,
    coverageId: "coverage-56f-dhs",
    entityId: "agency-dhs",
    entityName: "Department of Homeland Security",
    portfolio: "cyber",
    sourceId: "source-56g-dhs-oig-report-index-july-2026",
    sourceName: "DHS OIG Audits, Inspections, and Evaluations Index — July 2026 Check",
    url: "https://www.oig.dhs.gov/reports/audits-inspections-and-evaluations",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: "2026-07-25",
    documentType: "Oversight Report",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Released FY 2025 enterprise FISMA evaluation",
    finding:
      "The current DHS OIG public report index does not expose a final FY 2025 enterprise FISMA evaluation. Previously captured component and vulnerability-management records remain adjacent evidence and do not replace the named enterprise result.",
    decision:
      "Retain Open. No exact enterprise-wide FY 2025 evaluation or dated replacement outcome was identified on the authoritative public rail.",
    remainingGap:
      "Final FY 2025 DHS enterprise FISMA evaluation, finding-level results, remediation status, incidents, recovery, and mission effects.",
    reopeningRule:
      "Reopen when DHS OIG publishes the final FY 2025 enterprise evaluation or a dated replacement outcome.",
    limitation:
      "A dated public-index check is a publication-boundary observation, not proof that no nonpublic work exists and not the missing annual result.",
  },
  {
    slug: "gateway-final-investigation-restoration-status",
    documentNumber: 387,
    coverageId: "coverage-56f-gateway",
    entityId: "eia-plant-63834",
    entityName: "Gateway Energy Storage System",
    portfolio: "energy",
    sourceId: "source-56h-gateway-cpuc-go167-catalog-2026",
    sourceName: "CPUC GO 167-C Compliance Audit Catalog: Gateway",
    url: "https://www.cpuc.ca.gov/about-cpuc/divisions/safety-and-enforcement-division/electric-safety-and-reliability-branch/generation-and-energy-storage-section/go-167-compliance-audits",
    publisher: "California Public Utilities Commission",
    publicationDate: "2026-07-25",
    documentType: "Regulatory Decision",
    priorStatus: "Open",
    currentStatus: "Open",
    recordStatus: "In Review",
    priority: "Final investigation and full contracted-capacity restoration",
    finding:
      "The current CPUC catalog retains Gateway's June 2025 audit and response, while Resolution E-5428 continues to describe ongoing investigations and phased future module additions. No final incident finding or full contracted-capacity operating record is published on this rail.",
    decision:
      "Retain Open. The audit-response pair and phased restoration plan are relevant but do not satisfy the selected final-finding and full-restoration record.",
    remainingGap:
      "Final investigation findings, corrective-action closure, restored contracted capacity, dispatch, availability, and customer or grid outcomes.",
    reopeningRule:
      "Reopen when CPUC, EPA, CAISO, SCE, or the operator publishes final findings or a full-capacity operating record.",
    limitation:
      "Catalog presence, an audit response, and planned module dates do not establish final incident findings or full operating restoration.",
  },
  {
    slug: "moss-landing-plant-corrective-action-status",
    documentNumber: 388,
    coverageId: "coverage-56f-moss-landing",
    entityId: "eia-plant-260",
    entityName: "Dynegy Moss Landing Power Plant Hybrid",
    portfolio: "energy",
    sourceId: "source-56k-moss-landing-go167-corrective-action-2025",
    sourceName: "Moss Landing Power Plant GO 167 Corrective Action Plan and Response",
    url: "https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/safety-and-enforcement-division/esrb/generation/audits/gao-167-audits/2025-gao-audits/20250818-ga202506-cpuc-mlpp-audit--vistra-responses-confidential--finalredacted.pdf",
    publisher: "Moss Landing Power Company response posted by the California Public Utilities Commission",
    publicationDate: "2025-08-18",
    documentType: "Regulatory Decision",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Final regulator investigation and corrective-action closure",
    finding:
      "The posted response addresses 28 conventional plant-audit findings: 13 are labeled Complete and 15 In progress. The filing is a company corrective-action response to a March 2025 GO 167 generation audit; it is not a final regulator determination and not the final investigation of the January 2025 battery fire.",
    decision:
      "Retain Partially Closed. The record adds a finding-level corrective-action denominator but does not close the selected battery-incident investigation or prove regulator acceptance of the company's status labels.",
    remainingGap:
      "Final battery-incident findings, regulator-verified corrective-action closure, restored operation, availability, safety performance, and customer or grid outcomes.",
    reopeningRule:
      "Reopen when CPUC or another competent regulator publishes final January 2025 incident findings or verifies closure of the relevant corrective actions.",
    limitation:
      "The status labels are company assertions in a regulator-posted response. The audit concerns conventional plant conditions and cannot substitute for the battery-fire investigation.",
    newSource: {
      sourceType: "Government Agency",
      credibility: "Tier 2",
      liveAccessType: "Data Download",
      sourceRoles: ["Primary Data", "Company Claim", "Source Freshness"],
    },
    signal: {
      id: "signal-56k-moss-landing-corrective-action-status",
      slug: "56k-moss-landing-corrective-action-status",
      title: "Moss Landing's plant audit separates completed and in-progress actions",
      summary:
        "A CPUC-posted company response labels 13 of 28 conventional plant-audit findings Complete and 15 In progress, without closing the January 2025 battery-fire investigation.",
      body:
        "The August 2025 response supplies a finding-level corrective-action denominator for the conventional power-plant audit. Thirteen items are labeled Complete and fifteen In progress. Those labels are the company's response positions, not final regulator closure, and the filing is not the final investigation of the January 2025 battery fire.",
      evidenceQuality: "Primary Source",
      verificationStatus: "Verified Against Primary Source",
    },
  },
  {
    slug: "va-ifams-recommendation-status",
    documentNumber: 389,
    coverageId: "coverage-56f-va",
    entityId: "agency-va",
    entityName: "Department of Veterans Affairs",
    portfolio: "cyber",
    sourceId: "source-56k-va-ifams-recommendation-status-2026",
    sourceName: "VA OIG iFAMS Access-Control Recommendation Status",
    url: "https://www.vaoig.gov/reports/audit/audit-integrated-financial-and-acquisition-management-system-access-controls",
    publisher: "Department of Veterans Affairs Office of Inspector General",
    publicationDate: "2026-02-17",
    documentType: "Oversight Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "FY 2025 FISMA result or iFAMS recommendation closure",
    finding:
      "The live VA OIG report page lists all three iFAMS access-control recommendations as Open. The page therefore supplies a current recommendation-level status but no implemented closure.",
    decision:
      "Retain Partially Closed. The selected remediation rail is now explicit and current, but none of the three recommendations is marked Closed-Implemented.",
    remainingGap:
      "Implemented closure for the three iFAMS access-control recommendations or a later department-wide FISMA result with finding-level remediation.",
    reopeningRule:
      "Reopen when VA OIG changes a recommendation to Closed-Implemented or publishes a later department-wide FISMA result.",
    limitation:
      "Recommendation status does not measure exploit occurrence, enterprise-wide control effectiveness, incident recovery, or mission outcomes.",
    newSource: {
      sourceType: "Government Agency",
      credibility: "Tier 1",
      liveAccessType: "Release Page",
      sourceRoles: ["Primary Data", "Source Freshness"],
    },
    signal: {
      id: "signal-56k-va-ifams-recommendations-open",
      slug: "56k-va-ifams-recommendations-open",
      title: "VA OIG still marks all three iFAMS access recommendations open",
      summary:
        "The live VA OIG record marks all three iFAMS access-control recommendations Open, preserving a precise remediation rail without implying closure.",
      body:
        "VA OIG's live report page shows an Open icon for each of the three recommendations: granular least-privilege access, periodic certification of all roles and accesses, and complete supervisor and information-owner visibility. This is a current recommendation-level status, not an implemented closure or enterprise-wide security result.",
      evidenceQuality: "Audited or Verified Data",
      verificationStatus: "Verified Against Primary Source",
    },
  },
  {
    slug: "f35-monthly-acceptance-capability-status",
    documentNumber: 390,
    coverageId: "coverage-56f-f35-fort-worth",
    entityId: "manufacturer-lockheed-f35-fort-worth",
    entityName: "Lockheed Martin F-35 Fort Worth final-assembly line",
    portfolio: "manufacturing",
    sourceId: "source-56e-f35-gao-sustainment-2026",
    sourceName: "F-35 Sustainment: Persistent Readiness Challenges",
    url: "https://www.gao.gov/products/gao-26-108113",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2026-04-30",
    documentType: "Oversight Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "Monthly aircraft due and accepted with capability state",
    finding:
      "GAO reports fleet readiness and notes that newly accepted aircraft could be non-mission-capable because of software delays, but it does not publish the selected Fort Worth monthly due-versus-accepted series paired with capability state.",
    decision:
      "Retain Partially Closed. The accepted-aircraft capability break is material context, but the fleet-level record cannot substitute for the named monthly production and acceptance denominator.",
    remainingGap:
      "Monthly aircraft due, delivered, accepted, held, reworked, and capability state under one compatible Fort Worth production window.",
    reopeningRule:
      "Reopen when the F-35 Joint Program Office, DOD, DCMA, GAO, or the contractor publishes a monthly due-and-accepted table with capability state.",
    limitation:
      "Fleet sustainment and accepted-aircraft readiness do not measure Fort Worth monthly production throughput or establish a production cause.",
  },
  {
    slug: "f15ex-ex16-realized-receipt",
    documentNumber: 391,
    coverageId: "coverage-56f-f15ex-st-louis",
    entityId: "manufacturer-boeing-f15ex-st-louis",
    entityName: "Boeing F-15EX St. Louis production line",
    portfolio: "manufacturing",
    sourceId: "source-56k-f15ex-ex16-portland-receipt-2026",
    sourceName: "142nd Wing: EX16 Comes to Portland",
    url: "https://www.142wg.ang.af.mil/News/Video/dvpTag/F-15EX/",
    publisher: "142nd Wing, Oregon Air National Guard",
    publicationDate: "2026-02-17",
    documentType: "Program Milestone",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "Published",
    priority: "Realized post-restart delivery and acceptance dates",
    finding:
      "The receiving unit states that Portland Air National Guard Base received F-15EX tail number 16 on December 11, 2025. This independently fixes the realized receiving-unit date after the production restart.",
    decision:
      "Retain Partially Closed. The exact receipt date advances the delivery rail, but the record does not provide the formal government acceptance date, monthly due-versus-accepted denominator, quality, rework, cost, or schedule variance.",
    remainingGap:
      "Formal acceptance date, monthly due and accepted aircraft, schedule variance, rework, quality escapes, labor input, and unit cost.",
    reopeningRule:
      "Reopen when the Air Force, DCMA, or program office publishes the formal acceptance record or a monthly due-versus-accepted series.",
    limitation:
      "A receiving-unit arrival date is realized delivery evidence but is not, by itself, the formal contractual acceptance date or a complete production-performance series.",
    newSource: {
      sourceType: "Government Agency",
      credibility: "Tier 1",
      liveAccessType: "Release Page",
      sourceRoles: ["Primary Data", "Source Freshness"],
    },
    signal: {
      id: "signal-56k-f15ex-ex16-portland-receipt",
      slug: "56k-f15ex-ex16-portland-receipt",
      title: "The 142nd Wing fixes EX16's realized Portland receipt date",
      summary:
        "The receiving unit says F-15EX tail number 16 arrived on December 11, 2025, advancing the post-restart delivery rail while formal acceptance and monthly denominators remain open.",
      body:
        "The 142nd Wing's February 2026 record states that Portland received tail number 16 on December 11, 2025. This receiving-unit confirmation fixes a realized delivery point after production resumed. It does not publish formal contractual acceptance, monthly due-versus-accepted output, schedule variance, quality, rework, cost, or labor input.",
      evidenceQuality: "Primary Source",
      verificationStatus: "Verified Against Primary Source",
    },
  },
  {
    slug: "dot-fy2026-fisma-result-status",
    documentNumber: 392,
    coverageId: "coverage-56f-dot",
    entityId: "agency-dot",
    entityName: "Department of Transportation",
    portfolio: "cyber",
    sourceId: "source-56f-dot-fisma-fy2026-audit-start",
    sourceName: "Audit Initiated of DOT's Information Security Program and Practices for Fiscal Year 2026",
    url: "https://www.oig.dot.gov/library-item/47183",
    publisher: "Department of Transportation Office of Inspector General",
    publicationDate: "2026-02-25",
    documentType: "Oversight Report",
    priorStatus: "Partially Closed",
    currentStatus: "Partially Closed",
    recordStatus: "In Review",
    priority: "FY 2026 review result or dated recommendation closure",
    finding:
      "DOT OIG's authoritative page still identifies the FY 2026 information-security review as initiated. The public rail does not yet supply the review result or a dated recommendation-closure decision.",
    decision:
      "Retain Partially Closed. Audit initiation defines the next review identity but cannot be converted into an audit result or remediation outcome.",
    remainingGap:
      "FY 2026 FISMA result, recommendation-level closure, tested-control outcome, incidents, recovery, and transportation-service effects.",
    reopeningRule:
      "Reopen when DOT OIG publishes the FY 2026 result or a dated recommendation-status change.",
    limitation:
      "Audit initiation is not an audit result, recommendation closure, control-effectiveness finding, incident measure, or service outcome.",
  },
].map((record) => ({ ...portfolios[record.portfolio], ...record }));

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
      update_frequency: "Event-driven",
      capture_priority: "High",
      known_limitations: `${record.limitation} Phase 56K keeps identity, attribution, timing, evidence state, and continuation rule attached.`,
      last_checked_date: capturedDate,
      watch_lanes: record.watchLanes,
      live_access_type: record.newSource.liveAccessType,
      data_download_url: record.url,
      review_cadence_days: 60,
      monitoring_status: "Active",
      coverage_role: record.newSource.sourceRoles,
      jurisdiction: record.jurisdiction,
      source_owner: record.publisher,
      notes: `Phase 56K exact-record continuation source. Collection: ${collectionSlug}.`,
    });
  }

  const documentId = `research-doc-56k-${record.slug}`;
  const fileName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  const localCapturePath = `/downloads/${collectionSlug}/official-links/${fileName}`;
  await writeJson(join(contentRoot, "research-documents", `${record.documentNumber}-56k-${record.slug}.json`), {
    id: documentId,
    collection_id: collectionId,
    title: `${record.entityName}: Phase 56K Exact-Record Decision`,
    slug: `56k-${record.slug}`,
    record_status: record.recordStatus,
    publisher: record.publisher,
    publication_date: record.publicationDate,
    document_type: record.documentType,
    summary: `${record.finding} Phase 56K decision: ${record.decision}`,
    key_findings: [
      `Phase 56F coverage ID: ${record.coverageId}.`,
      `Named record: ${record.priority}.`,
      `Evidence state: ${record.priorStatus} to ${record.currentStatus}.`,
      `Continuation rule: ${record.reopeningRule}`,
    ],
    why_it_matters:
      "The decision records an exact acquisition result, including a verified non-closure, without substituting an adjacent record.",
    ftfn_relevance: [
      `Preserves stable entity ID ${record.entityId}.`,
      "Separates current record status from entity performance.",
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

  const linkRecord = [
    "FTFN Phase 56K official link record",
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

  if (record.signal) {
    const signal = record.signal;
    const signalMdx = `---
id: ${yamlQuote(signal.id)}
title: ${yamlQuote(signal.title)}
slug: ${yamlQuote(signal.slug)}
record_status: "Published"
summary: ${yamlQuote(signal.summary)}
source_ids:
  - ${yamlQuote(record.sourceId)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${yamlQuote(record.topics[0])}
framework_layers:
${yamlList(record.layers)}
signal_type: "Policy Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: ${yamlQuote(signal.evidenceQuality)}
verification_status: ${yamlQuote(signal.verificationStatus)}
why_it_matters: "The record advances a named evidence rail while preserving source, denominator, attribution, and closure boundaries."
dependencies:
  - "stable entity and source identity"
  - "compatible unit and observation window"
  - "declared attribution and evidence state"
constraints:
${yamlList(record.constraints)}
receiving_systems:
  - "Phase 56K exact-record continuation"
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
---

## What changed

${signal.body}

## Boundary

${record.limitation}

No entity ranking, composite, readiness score, or causal claim is supported.
`;
    await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), signalMdx, "utf8");
  }
}

const acquisitions = records.map((record) => ({
  acquisition_id: `acquisition-56k-${record.slug}`,
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
    "Closure status describes a selected evidence state, not entity performance, safety, quality, readiness, or value.",
}));

await writeJson(join(dataRoot, "phase-56k-exact-record-continuation.json"), {
  phase: "56K",
  captured_date: capturedDate,
  batch_rule:
    "Check the exact named record; publish a bounded advancement or record a verified non-closure without substituting adjacent evidence.",
  prior_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  post_batch_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  closure_changes: [],
  acquisition_ids: acquisitions.map((entry) => entry.acquisition_id),
  acquisitions,
});

const signalRecords = records.filter((record) => record.signal);
await writeJson(join(dataRoot, "phase-56k-publication-review.json"), {
  phase: "56K",
  reviewed_date: capturedDate,
  exact_records_checked: records.length,
  new_source_profiles: records.filter((record) => record.newSource).length,
  reused_source_profiles: records.filter((record) => !record.newSource).length,
  document_decisions: {
    reviewed: records.length,
    promoted: records
      .filter((record) => record.recordStatus === "Published")
      .map((record) => `research-doc-56k-${record.slug}`),
    held: records
      .filter((record) => record.recordStatus !== "Published")
      .map((record) => `research-doc-56k-${record.slug}`),
  },
  signal_decisions: {
    reviewed: signalRecords.length,
    promoted: signalRecords.map((record) => record.signal.id),
    held: [],
  },
  closure_decision:
    "No evidence state changes. The batch advances three exact rails and records four verified non-closures.",
  substitution_rule:
    "A component report, audit initiation, fleet observation, response filing, planned restoration, or arrival date cannot be substituted for a differently scoped final result.",
  comparison_rule:
    "No acquisition result or closure state is an entity ranking, score, readiness claim, or causal result.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Exact-Record Continuation — Batch Two, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary:
    "Phase 56K checks seven named records, publishes three bounded advancements, records four verified non-closures, and preserves the 1 Closed / 21 Partially Closed / 2 Open evidence ledger.",
  scope:
    "DHS, Gateway, Moss Landing, VA, F-35, F-15EX, and DOT exact-record decisions.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56k-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note:
    "The ten-file archive contains seven official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note:
    "Each decision retains the Phase 56F coverage ID, stable entity ID, exact named record, source attribution, evidence state, limitation, and reopening rule.",
});

const briefingMdx = `---
id: ${yamlQuote(briefingId)}
title: "Research Watch 015: Exact-Record Continuation"
slug: "research-watch-015-exact-record-continuation"
record_status: "Published"
summary: "Phase 56K checks seven exact records, publishes three bounded advancements, and preserves four verified non-closures without changing the evidence-state ledger."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlList(signalRecords.map((record) => record.signal.id))}
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "The Moss Landing response labels 13 of 28 conventional plant-audit findings Complete and 15 In progress; it does not close the battery-fire investigation."
  - "VA OIG still marks all three iFAMS access-control recommendations Open."
  - "The 142nd Wing fixes EX16's realized Portland receipt date at December 11, 2025."
  - "DHS and Gateway remain Open because their exact final records are not published."
  - "F-35 and DOT remain Partially Closed because the named monthly acceptance and FY 2026 result records are still absent."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
what_to_watch_next:
  - "DHS FY 2025 enterprise FISMA publication."
  - "Gateway and Moss Landing final incident findings."
  - "VA iFAMS Closed-Implemented status changes."
  - "F-35 monthly due and accepted output with capability state."
  - "F-15EX formal acceptance and DOT FY 2026 review result."
---

## Batch-two result

Phase 56K tests seven exact named records. Three records add bounded evidence: a finding-level Moss Landing conventional-plant response, a live VA recommendation status, and a receiving-unit date for F-15EX tail number 16.

Four exact records remain unavailable. DHS has no published FY 2025 enterprise FISMA result on the current OIG rail. Gateway has no final incident finding or full contracted-capacity operating record. GAO's F-35 sustainment work does not provide the selected Fort Worth monthly due-versus-accepted series. DOT's FY 2026 page remains an audit initiation rather than a result.

## Current closure ledger

- Closed: 1
- Partially Closed: 21
- Open: 2

These are evidence states for selected records. They are not performance, safety, quality, readiness, or value measures.

## Scope controls

The Moss Landing plant audit is not the battery-fire investigation. A receiving-unit arrival is not automatically formal contractual acceptance. An audit initiation is not an audit result. Fleet sustainment is not a plant-level monthly production denominator. These distinctions remain attached to every record.
`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefingMdx, "utf8");

await writeJson(join(contentRoot, "updates", "2026-07-25-phase-56k-exact-record-continuation.json"), {
  id: "update-2026-07-25-phase-56k-exact-record-continuation",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56K checks seven exact continuation records",
  summary:
    "FTFN publishes three bounded advancements, records four verified non-closures, and preserves the existing evidence-state ledger.",
  affected_record_ids: [
    collectionId,
    briefingId,
    ...signalRecords.map((record) => record.signal.id),
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-015-exact-record-continuation/",
    ...signalRecords.map((record) => `/signals/${record.signal.slug}/`),
  ],
  evidence_note:
    "Moss Landing, VA, and F-15EX gain exact bounded observations. DHS, Gateway, F-35, and DOT retain explicit non-closure decisions. No evidence state changes.",
  work_package: "docs/work-packages/phase-56k-exact-record-continuation.md",
});

console.log(
  "Generated Phase 56K: three sources, seven exact-record documents, three signals, one collection, Research Watch 015, two ledgers, and one update.",
);
