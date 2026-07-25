import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const publicRoot = join(appRoot, "public");
const capturedDate = "2026-07-25";
const collectionSlug = "federal-remediation-outcomes-batch-one-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-017-federal-remediation-outcomes";

const defaults = {
  portfolio: "ai_cyber",
  topics: ["Cybersecurity", "Policy and Standards"],
  layers: ["Enabling Infrastructure", "Human Systems"],
  constraints: ["Cybersecurity", "Data Quality", "Labor"],
  watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
  country: "United States",
  jurisdiction: "United States",
};

const records = [
  {
    slug: "nasa-gao-risk-management-recommendation-status",
    documentNumber: 396,
    coverageId: "coverage-56f-nasa",
    entityId: "agency-nasa",
    entityName: "National Aeronautics and Space Administration",
    sourceId: "source-56d-nasa-gao-risk-management-2025",
    sourceName: "Cybersecurity: NASA Needs to Fully Implement Risk Management",
    url: "https://www.gao.gov/products/gao-25-108138",
    publisher: "U.S. Government Accountability Office",
    publicationDate: "2025-06-25",
    documentType: "Oversight Report",
    recordIdentity: "GAO-25-108138 recommendations 1-16",
    testedPeriod: "GAO recommendation status current through May 2026",
    finding:
      "GAO lists all 16 recommendations from GAO-25-108138 as Open. The set spans organization-wide risk assessment, system impact levels, control-baseline oversight, critical-control assessment documentation, remediation plans, authorization-package quality control, and continuous-monitoring guidance.",
    decision:
      "Retain Partially Closed. Exact recommendation identity and May 2026 status now publish as a bounded non-closure; no recommendation in this set is reported implemented or closed.",
    remainingGap:
      "GAO-verified implementation or closure for a named recommendation, FY 2026 FISMA results, tested-system coverage, incidents, recovery, service effects, and mission outcomes.",
    reopeningRule:
      "Reopen when GAO changes any GAO-25-108138 recommendation to implemented or closed, or NASA OIG publishes the FY 2026 FISMA evaluation with tested-system scope.",
    limitation:
      "The four selected systems are a nongeneralizable sample. Open status is a remediation state, not a severity, readiness, performance, incident, recovery, or mission-outcome measure.",
    signal: {
      id: "signal-56m-nasa-gao-sixteen-open-recommendations",
      slug: "56m-nasa-gao-sixteen-open-recommendations",
      title: "All 16 GAO NASA cyber-risk recommendations remain open",
      summary:
        "GAO's May 2026 status notes keep recommendations 1-16 from GAO-25-108138 open, providing exact remediation identities without establishing implementation or closure.",
      body:
        "GAO's public recommendation table identifies recommendations 1 through 16 from GAO-25-108138 as Open. The status notes are current through May 2026 and cover organization-wide risk assessment, critical-control documentation, remediation plans, authorization quality control, and continuous-monitoring guidance. This is a useful exact non-closure: it resolves which actions remain open, not whether NASA's wider program or missions perform well or poorly.",
    },
  },
  {
    slug: "hhs-large-hospital-cyber-control-test",
    documentNumber: 397,
    coverageId: "coverage-56f-hhs",
    entityId: "provider-hhs-oig-large-southeastern-hospital-a-18-22-08021",
    entityName: "Anonymous large southeastern hospital",
    sourceId: "source-56m-hhs-large-hospital-cyber-controls-2026",
    sourceName:
      "A Large Southeastern Hospital Could Improve Certain Security Controls to Enhance Its Ability to Prevent and Detect Cyberattacks",
    url:
      "https://www.oig.hhs.gov/reports/all/2026/a-large-southeastern-hospital-could-improve-certain-security-controls-to-enhance-its-ability-to-prevent-and-detect-cyberattacks/",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2026-01-30",
    documentType: "Oversight Report",
    recordIdentity: "A-18-22-08021; tracker actions 26-A-18-035.01 through .04",
    testedPeriod: "Four internet-facing web applications tested August-September 2022",
    finding:
      "HHS OIG found that the hospital had continuity, backup, incident-response, and disaster-recovery controls and prevented or detected most simulated attacks. Testing also exposed weak authentication in one account-management application and weak input validation without adequate web-application-firewall protection in another. Four associated tracker actions are Open Unimplemented, with the next update expected July 29, 2026.",
    decision:
      "Retain Partially Closed at the HHS coverage level. The component test satisfies the missing-record rule and publishes with four exact open actions; it does not establish department-wide remediation or current hospital control operation.",
    remainingGap:
      "A tracker status change for actions 26-A-18-035.01 through .04, dated remediation validation, a repeated compatible control test, incidents, recovery performance, affected services, and patient outcomes.",
    reopeningRule:
      "Reopen after the expected July 29, 2026 tracker update if any of the four actions changes status, or when HHS OIG publishes a compatible follow-up test.",
    limitation:
      "The audited hospital is anonymous, the technical testing occurred in August-September 2022, and only four internet-facing applications were selected. Results cannot be generalized to HHS, CMS, other hospitals, or current operation.",
    newSource: true,
    signal: {
      id: "signal-56m-hhs-large-hospital-open-cyber-actions",
      slug: "56m-hhs-large-hospital-open-cyber-actions",
      title: "HHS hospital control test leaves four named cyber actions open",
      summary:
        "HHS OIG found two web-application control weaknesses in a four-application test; tracker actions 26-A-18-035.01 through .04 remain Open Unimplemented.",
      body:
        "HHS OIG's audit of an anonymous large southeastern hospital found continuity and recovery controls and reported that most simulated attacks were prevented or detected. It also found weak authentication in one account-management application and weak input validation without adequate web-application-firewall protection in another. The four resulting tracker actions, 26-A-18-035.01 through .04, remain Open Unimplemented pending a July 29, 2026 update.",
    },
  },
  {
    slug: "hhs-small-hospital-effective-cyber-control-test",
    documentNumber: 398,
    coverageId: "coverage-56f-hhs",
    entityId: "provider-hhs-oig-small-southeastern-hospital-oas-25-18-033",
    entityName: "Anonymous small southeastern hospital",
    sourceId: "source-56m-hhs-small-hospital-cyber-controls-2026",
    sourceName:
      "A Small Southeastern Hospital Had Effective Cybersecurity Controls To Prevent, Detect, and Respond To Cyberattacks",
    url:
      "https://oig.hhs.gov/reports/all/2026/a-small-southeastern-hospital-had-effective-cybersecurity-controls-to-prevent-detect-and-respond-to-cyberattacks/",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2026-06-12",
    documentType: "Oversight Report",
    recordIdentity: "OAS-25-18-033; no recommendations",
    testedPeriod: "Four public-facing websites tested in June 2025",
    finding:
      "HHS OIG reported that the hospital detected and prevented simulated attacks against the selected systems. The audit also documented incident-response procedures, continuous monitoring, twice-yearly contingency-plan tests, nightly off-site replicated backups tested at least monthly, and quarterly disaster-recovery exercises. OIG made no recommendations.",
    decision:
      "Retain Partially Closed at the HHS coverage level. This is a positive component control test with an exact no-recommendation result, not evidence of department-wide effectiveness or a closed FY 2025 FISMA recommendation.",
    remainingGap:
      "Repeated compatible testing, identified-system continuity and recovery times, real incident outcomes, affected-service denominators, patient outcomes, and department-level recommendation closure.",
    reopeningRule:
      "Reopen when HHS OIG publishes a compatible repeat test, a named incident or recovery outcome, or recommendation-level department remediation.",
    limitation:
      "The audited hospital is anonymous, testing covered four selected public-facing websites in June 2025, and OIG states that testing may not have disclosed every deficiency. The result cannot be generalized to HHS, CMS, other hospitals, or later periods.",
    newSource: true,
    signal: {
      id: "signal-56m-hhs-small-hospital-effective-cyber-test",
      slug: "56m-hhs-small-hospital-effective-cyber-test",
      title: "HHS test finds effective cyber controls at one small hospital",
      summary:
        "HHS OIG's June 2025 test found that one anonymous small hospital detected and prevented simulated attacks against four selected websites; the audit made no recommendations.",
      body:
        "HHS OIG reported that an anonymous small southeastern hospital detected and prevented simulated attacks against four selected public-facing websites in June 2025. The audit documented continuous monitoring, incident-response procedures, twice-yearly contingency testing, nightly off-site replicated backups tested at least monthly, and quarterly disaster-recovery exercises. OIG made no recommendations, but the result remains specific to the anonymous entity, selected systems, and tested period.",
    },
  },
].map((record) => ({ ...defaults, ...record }));

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (path, value) => writeFile(path, json(value), "utf8");
const yamlQuote = (value) => JSON.stringify(value);
const yamlList = (items, indent = "  ") =>
  items.map((item) => `${indent}- ${yamlQuote(item)}`).join("\n");

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
      source_type: "Government Agency",
      credibility_level: "Tier 1",
      primary_topics: record.topics,
      framework_layers: record.layers,
      country_or_region: record.country,
      update_frequency: "Event-driven",
      capture_priority: "High",
      known_limitations: `${record.limitation} Phase 56M preserves audit identity, tested period, finding, recommendation state, and reopening rule.`,
      last_checked_date: capturedDate,
      watch_lanes: record.watchLanes,
      live_access_type: "Release Page",
      review_cadence_days: 30,
      monitoring_status: "Active",
      coverage_role: ["Primary Data", "Source Freshness"],
      jurisdiction: record.jurisdiction,
      source_owner: record.publisher,
      notes: `Phase 56M federal remediation and outcome continuation source. Collection: ${collectionSlug}.`,
    });
  }

  const documentId = `research-doc-56m-${record.slug}`;
  const fileName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  const localCapturePath = `/downloads/${collectionSlug}/official-links/${fileName}`;
  await writeJson(
    join(contentRoot, "research-documents", `${record.documentNumber}-56m-${record.slug}.json`),
    {
      id: documentId,
      collection_id: collectionId,
      title: `${record.entityName}: Phase 56M Remediation and Outcome Decision`,
      slug: `56m-${record.slug}`,
      record_status: "Published",
      publisher: record.publisher,
      publication_date: record.publicationDate,
      document_type: record.documentType,
      summary: `${record.finding} Phase 56M decision: ${record.decision}`,
      key_findings: [
        `Phase 56F coverage ID: ${record.coverageId}.`,
        `Exact record: ${record.recordIdentity}.`,
        `Tested or status period: ${record.testedPeriod}.`,
        `Evidence state: Partially Closed to Partially Closed.`,
        `Continuation rule: ${record.reopeningRule}`,
      ],
      why_it_matters:
        "The record advances recommendation identity or component control evidence while keeping open, implemented, closed, tested, effective, and no-recommendation states distinct.",
      ftfn_relevance: [
        `Preserves stable entity ID ${record.entityId}.`,
        "Separates agency-wide evidence from anonymous provider and selected-system evidence.",
        "Keeps source owner, audit period, recommendation identity, limitation, and continuation rule attached.",
      ],
      evidence_limits: [
        record.limitation,
        record.remainingGap,
        "No entity ranking, composite, productivity, readiness, value, or causal claim is supported.",
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
    },
  );

  await writeFile(
    join(publicRoot, localCapturePath),
    [
      "FTFN Phase 56M official link record",
      `Title: ${record.sourceName}`,
      `Publisher: ${record.publisher}`,
      `Publication date: ${record.publicationDate}`,
      `Official URL: ${record.url}`,
      `Checked: ${capturedDate}`,
      `Coverage ID: ${record.coverageId}`,
      `Entity ID: ${record.entityId}`,
      `Exact record: ${record.recordIdentity}`,
      `Tested or status period: ${record.testedPeriod}`,
      `Decision: ${record.decision}`,
      `Limitation: ${record.limitation}`,
      "",
    ].join("\r\n"),
    "utf8",
  );

  await writeFile(
    join(contentRoot, "signals", `${record.signal.id}.mdx`),
    `---
id: ${yamlQuote(record.signal.id)}
title: ${yamlQuote(record.signal.title)}
slug: ${yamlQuote(record.signal.slug)}
record_status: "Published"
summary: ${yamlQuote(record.signal.summary)}
source_ids:
  - ${yamlQuote(record.sourceId)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: "Cybersecurity"
framework_layers:
${yamlList(record.layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Audited or Verified Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The record adds exact recommendation state or bounded component control evidence without converting it into a general performance claim."
dependencies:
  - "stable audit and recommendation identity"
  - "declared test or status period"
  - "explicit entity and system scope"
constraints:
${yamlList(record.constraints)}
receiving_systems:
  - "Phase 56M federal remediation and outcome continuation"
local_implications:
  - "The record cannot be converted into an agency, provider, productivity, readiness, or value score."
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

No entity ranking, composite, productivity, readiness, value, or causal claim is supported.
`,
    "utf8",
  );
}

const decisions = [
  {
    coverage_id: "coverage-56f-nasa",
    entity_id: "agency-nasa",
    entity_name: "National Aeronautics and Space Administration",
    prior_closure_status: "Partially Closed",
    current_closure_status: "Partially Closed",
    result:
      "GAO-25-108138 recommendations 1-16 all remain Open under status notes current through May 2026.",
    decision:
      "Publish the exact non-closure because it resolves all sixteen action identities and statuses without implying implementation.",
    reopening_rule: records[0].reopeningRule,
  },
  {
    coverage_id: "coverage-56f-hhs",
    entity_id: "agency-hhs",
    entity_name: "Department of Health and Human Services",
    prior_closure_status: "Partially Closed",
    current_closure_status: "Partially Closed",
    result:
      "Two HHS OIG component tests now publish: one selected hospital has four Open Unimplemented actions, while another selected hospital had an effective tested result and no recommendations.",
    decision:
      "Publish both component tests, keep their anonymous entities and periods separate, and retain the department-level Partially Closed state.",
    reopening_rule:
      "Reopen when a named HHS recommendation changes status, a compatible component retest publishes, or department-level closure evidence becomes available.",
  },
];

await writeJson(join(dataRoot, "phase-56m-federal-remediation-outcomes.json"), {
  phase: "56M",
  captured_date: capturedDate,
  batch_rule:
    "Publish only exact official recommendation or tested-control records with stable audit identity, entity, scope, period, finding, status, limitation, and continuation rule.",
  prior_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  post_batch_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  closure_changes: [],
  coverage_decisions: decisions,
  records: records.map((record) => ({
    record_id: `record-56m-${record.slug}`,
    coverage_id: record.coverageId,
    entity_id: record.entityId,
    entity_name: record.entityName,
    source_id: record.sourceId,
    source_url: record.url,
    exact_record: record.recordIdentity,
    tested_or_status_period: record.testedPeriod,
    finding: record.finding,
    decision: record.decision,
    remaining_gap: record.remainingGap,
    reopening_rule: record.reopeningRule,
    record_status: "Published",
  })),
});

await writeJson(join(dataRoot, "phase-56m-publication-review.json"), {
  phase: "56M",
  reviewed_date: capturedDate,
  exact_records_checked: records.length,
  coverage_decisions: decisions.length,
  new_source_profiles: records.filter((record) => record.newSource).length,
  reused_source_profiles: records.filter((record) => !record.newSource).length,
  document_decisions: {
    reviewed: records.length,
    promoted: records.map((record) => `research-doc-56m-${record.slug}`),
    held: [],
  },
  signal_decisions: {
    reviewed: records.length,
    promoted: records.map((record) => record.signal.id),
    held: [],
  },
  closure_decision:
    "No evidence-state changes. NASA gains an exact sixteen-action non-closure; HHS gains two bounded component control tests with distinct periods and results.",
  substitution_rule:
    "Open is not implemented or closed; no recommendation is not agency closure; one provider test is not a department or sector result.",
  comparison_rule:
    "The two anonymous hospital audits use different entities, test periods, frameworks, and scopes and do not support ranking or comparative performance claims.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Federal Remediation and Outcomes - Batch One, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary:
    "Phase 56M publishes one exact NASA recommendation non-closure and two bounded HHS hospital control tests while preserving the 1 Closed / 21 Partially Closed / 2 Open evidence ledger.",
  scope:
    "NASA GAO cybersecurity recommendations and two HHS OIG anonymous-hospital component control tests.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56m-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note:
    "The six-file archive contains three official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note:
    "Each decision retains stable coverage and entity identity, exact audit or recommendation identity, tested or status period, finding, evidence state, limitation, and reopening rule. Provider tests are not generalized to HHS, CMS, or the health sector.",
});

await writeFile(
  join(contentRoot, "briefings", `${briefingId}.mdx`),
  `---
id: ${yamlQuote(briefingId)}
title: "Research Watch 017: Federal Remediation and Outcomes"
slug: "research-watch-017-federal-remediation-outcomes"
record_status: "Published"
summary: "Phase 56M publishes exact NASA recommendation statuses and two bounded HHS component control tests without changing the evidence-state ledger."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlList(records.map((record) => record.signal.id))}
evidence_gap_ids:
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "All sixteen GAO-25-108138 recommendations remain Open under status notes current through May 2026."
  - "One HHS OIG hospital test produced four Open Unimplemented actions after two web-application weaknesses."
  - "A separate HHS OIG test found effective controls against simulated attacks on four selected websites and made no recommendations."
  - "Provider tests, agency remediation, annual FISMA results, real incidents, and patient outcomes remain distinct."
constraint_watch:
  - "Cybersecurity"
  - "Data Quality"
  - "Labor"
what_to_watch_next:
  - "A GAO implementation or closure update for any GAO-25-108138 recommendation."
  - "The expected July 29, 2026 update for actions 26-A-18-035.01 through .04."
  - "A compatible HHS component retest or department-level recommendation closure."
  - "Any newly published Phase 56K or Phase 56L record that meets its exact reopening rule."
---

## Batch-one result

NASA's recommendation rail now resolves all sixteen GAO-25-108138 action identities as Open under status notes current through May 2026. This is an exact, reader-useful non-closure: it makes the remediation set inspectable without implying that open count measures performance or mission risk.

HHS gains two component control tests. The large-hospital audit found continuity and recovery controls but also two tested web-application weaknesses; four tracker actions remain Open Unimplemented. The small-hospital audit found that four selected websites detected and prevented simulated attacks in June 2025 and made no recommendations.

## Current closure ledger

- Closed: 1
- Partially Closed: 21
- Open: 2

These are evidence states for selected records. They are not performance, productivity, readiness, quality, or value measures.

## Scope controls

The two hospitals are anonymous and different. Their test periods, system scopes, control frameworks, and findings are not interchangeable. No-recommendation status for one selected provider is not HHS closure, and four open actions at another provider are not a department-wide result. Real incidents, recovery times, service effects, and patient outcomes remain outside these records.
`,
  "utf8",
);

await writeJson(
  join(contentRoot, "updates", "2026-07-25-phase-56m-federal-remediation-outcomes.json"),
  {
    id: "update-2026-07-25-phase-56m-federal-remediation-outcomes",
    effective_date: capturedDate,
    entry_type: "Research Collection",
    title: "Phase 56M publishes exact federal remediation and component outcomes",
    summary:
      "FTFN publishes all sixteen GAO NASA recommendation statuses and two bounded HHS hospital control tests without changing the evidence-state ledger.",
    affected_record_ids: [
      collectionId,
      briefingId,
      ...records.map((record) => record.signal.id),
    ],
    related_paths: [
      `/research/${collectionSlug}/`,
      "/briefings/research-watch-017-federal-remediation-outcomes/",
      ...records.map((record) => `/signals/${record.signal.slug}/`),
    ],
    evidence_note:
      "Open actions, an effective selected-system test, and a no-recommendation result remain distinct from agency closure, sector performance, real incident outcomes, and patient outcomes.",
    work_package: "docs/work-packages/phase-56m-federal-remediation-outcomes.md",
  },
);

console.log(
  "Generated Phase 56M: two source profiles, three research documents, three signals, one collection, Research Watch 017, two ledgers, and one update.",
);
