import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const publicRoot = join(appRoot, "public");
const capturedDate = "2026-08-01";
const collectionSlug = "cross-agency-priority-remediation-portfolios-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-019-cross-agency-remediation";

const sourceProfiles = [
  {
    id: "source-56o-doe-priority-recommendations-2026",
    name: "Priority Open Recommendations: Department of Energy",
    url: "https://www.gao.gov/products/gao-26-109001",
    publisher: "U.S. Government Accountability Office",
    topics: ["Energy", "Policy and Standards", "Finance and Risk"],
    limitation: "The letter reports portfolio movement and priority areas, not the status of every recommendation or a measure of department performance, safety, readiness, or value.",
  },
  {
    id: "source-56o-hhs-priority-recommendations-2026",
    name: "Priority Open Recommendations: Department of Health and Human Services",
    url: "https://www.gao.gov/products/gao-26-108997",
    publisher: "U.S. Government Accountability Office",
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    limitation: "The letter aggregates multiple health-program recommendations. Portfolio movement is not a clinical outcome, provider result, preparedness score, or substitute for the held hospital-control tracker record.",
  },
  {
    id: "source-56o-dot-priority-recommendations-2026",
    name: "Priority Open Recommendations: Department of Transportation",
    url: "https://www.gao.gov/products/gao-26-109050",
    publisher: "U.S. Government Accountability Office",
    topics: ["Mobility", "Aviation", "Policy and Standards"],
    limitation: "The portfolio spans workforce, grants, drones, and automated vehicles. Its counts do not measure transportation safety, service quality, technology readiness, or the open DOT AI-inventory action.",
  },
  {
    id: "source-56o-va-priority-recommendations-2026",
    name: "Priority Open Recommendations: Department of Veterans Affairs",
    url: "https://www.gao.gov/products/gao-26-108978",
    publisher: "U.S. Government Accountability Office",
    topics: ["Human Futures", "Cybersecurity", "Policy and Standards"],
    limitation: "The portfolio covers health care, IT modernization, and acquisition. It does not close the separate iFAMS or Southern Oregon actions or establish veteran, clinical, or enterprise-security outcomes.",
  },
  {
    id: "source-56o-gsa-priority-recommendations-2026",
    name: "Priority Open Recommendations: General Services Administration",
    url: "https://www.gao.gov/products/gao-26-108996",
    publisher: "U.S. Government Accountability Office",
    topics: ["Policy and Standards", "Finance and Risk", "Cybersecurity"],
    limitation: "The portfolio combines real property, shared services, and federal-award oversight. Counts are not a service-quality, procurement-performance, or AI-acquisition score.",
  },
  {
    id: "source-56o-ostp-priority-recommendations-2026",
    name: "Priority Open Recommendations: Office of Science and Technology Policy",
    url: "https://www.gao.gov/products/gao-26-109139",
    publisher: "U.S. Government Accountability Office",
    topics: ["AI for Science", "Policy and Standards", "Critical Minerals"],
    limitation: "The portfolio covers national science-and-technology planning and research security. Implementation counts do not measure research output, innovation quality, security effectiveness, or national readiness.",
  },
  {
    id: "source-56o-ntia-priority-recommendations-2026",
    name: "Priority Open Recommendations: National Telecommunications and Information Administration",
    url: "https://www.gao.gov/products/gao-26-109042",
    publisher: "U.S. Government Accountability Office",
    topics: ["Cybersecurity", "Chips and Compute", "Policy and Standards"],
    limitation: "The portfolio covers spectrum, IT and cybersecurity, and broadband programs. One implemented recommendation does not establish infrastructure security, broadband sustainability, or spectrum performance.",
  },
  {
    id: "source-56o-gao-open-recommendations-benefit-model-2026",
    name: "Open GAO Recommendations: Financial Benefits Could Be Between $132 Billion and $251 Billion",
    url: "https://www.gao.gov/products/gao-26-108932",
    publisher: "U.S. Government Accountability Office",
    topics: ["Finance and Risk", "Policy and Standards"],
    limitation: "The $132 billion to $251 billion range is a modeled government-wide potential-benefit estimate as of October 2025. It is not a forecast, budget score, agency allocation, or realized saving, and actual benefits depend on whether, how, and when recommendations are implemented.",
  },
];

const records = [
  {
    slug: "doe-priority-portfolio-2026", documentNumber: 409,
    coverageId: "coverage-56f-doe", entityId: "agency-doe", entityName: "Department of Energy",
    sourceId: sourceProfiles[0].id, publicationDate: "2026-07-02", primaryTopic: "Energy",
    constraints: ["Regulation", "Capital", "Data Quality", "Public Trust"],
    recordIdentity: "GAO-26-109001 DOE priority recommendation portfolio",
    statusPeriod: "April 2025 baseline through July 2026",
    finding: "GAO reports that DOE implemented five of thirty prior priority recommendations, added one priority recommendation, removed priority status from two, and now has twenty-four priority recommendations.",
    decision: "Publish the exact portfolio movement while keeping implemented, newly added, de-prioritized, and currently prioritized states distinct.",
    remainingGap: "Action-level identities and closure evidence for the current twenty-four, including DOE insider-threat recommendations 1 and 7 and the separate AI-inventory action.",
    reopeningRule: "Reopen when GAO publishes the next DOE priority letter or changes a named current recommendation status.",
    signal: { slug: "56o-doe-priority-portfolio-five-implemented-24-current", title: "DOE implements five priority recommendations while twenty-four remain prioritized", summary: "GAO's July 2026 letter records five implemented DOE priorities, one addition, two de-prioritized actions, and twenty-four current priority recommendations.", body: "DOE implemented five of the thirty priority recommendations identified in April 2025. GAO added one priority recommendation and removed the priority designation from two, leaving twenty-four current priorities across nuclear modernization, environmental liabilities, and energy security." },
  },
  {
    slug: "hhs-priority-portfolio-2026", documentNumber: 410,
    coverageId: "coverage-56f-hhs", entityId: "agency-hhs", entityName: "Department of Health and Human Services",
    sourceId: sourceProfiles[1].id, publicationDate: "2026-06-03", primaryTopic: "Human Futures",
    constraints: ["Regulation", "Capital", "Data Quality", "Public Trust"],
    recordIdentity: "GAO-26-108997 HHS priority recommendation portfolio",
    statusPeriod: "May 2025 baseline through May 2026",
    finding: "GAO reports that HHS implemented four of thirty-five prior priority recommendations, added seven, and now has thirty-eight priority recommendations focused on program integrity and public-health oversight.",
    decision: "Publish the exact portfolio movement without treating it as clinical, provider, or preparedness performance.",
    remainingGap: "Action-level closure evidence for the thirty-eight priorities, the open AI-inventory action, and a post-July 29 public update for the four held hospital-control recommendations.",
    reopeningRule: "Reopen when GAO publishes the next HHS priority letter, changes a named priority status, or HHS OIG posts the held hospital-control update.",
    signal: { slug: "56o-hhs-priority-portfolio-four-implemented-38-current", title: "HHS implements four priority recommendations while adding seven new priorities", summary: "GAO's 2026 HHS letter records four implemented priorities, seven additions, and thirty-eight current priority recommendations.", body: "HHS implemented four of the thirty-five priorities identified in May 2025. GAO added seven recommendations, bringing the current portfolio to thirty-eight across Medicare and Medicaid program integrity and public-health oversight and coordination." },
  },
  {
    slug: "dot-priority-portfolio-2026", documentNumber: 411,
    coverageId: "coverage-56f-dot", entityId: "agency-dot", entityName: "Department of Transportation",
    sourceId: sourceProfiles[2].id, publicationDate: "2026-06-23", primaryTopic: "Mobility",
    constraints: ["Regulation", "Labor", "Data Quality", "Safety"],
    recordIdentity: "GAO-26-109050 DOT priority recommendation portfolio",
    statusPeriod: "June 2025 baseline through June 2026",
    finding: "GAO reports that DOT implemented three of twenty-one prior priority recommendations, added six, removed priority status from two, and now has twenty-two priority recommendations.",
    decision: "Publish the exact portfolio movement while preserving workforce, grants, drones, automated-vehicle, and AI-inventory scopes.",
    remainingGap: "Action-level closure evidence for the current twenty-two, the open AI-inventory action, and the FY 2026 information-security review result.",
    reopeningRule: "Reopen when GAO publishes the next DOT priority letter, changes a named recommendation status, or DOT OIG publishes the FY 2026 review result.",
    signal: { slug: "56o-dot-priority-portfolio-three-implemented-22-current", title: "DOT implements three priority recommendations as emerging-technology actions expand", summary: "GAO's June 2026 letter records three implemented DOT priorities, six additions, two de-prioritized actions, and twenty-two current priorities.", body: "DOT implemented three of the twenty-one priorities identified in June 2025. GAO added six and removed the priority designation from two, leaving twenty-two current priorities across workforce, grants management, drones, and automated-vehicle integration." },
  },
  {
    slug: "va-priority-portfolio-2026", documentNumber: 412,
    coverageId: "coverage-56f-va", entityId: "agency-va", entityName: "Department of Veterans Affairs",
    sourceId: sourceProfiles[3].id, publicationDate: "2026-05-15", primaryTopic: "Human Futures",
    constraints: ["Cybersecurity", "Capital", "Data Quality", "Public Trust"],
    recordIdentity: "GAO-26-108978 VA priority recommendation portfolio",
    statusPeriod: "May 2025 baseline through May 2026",
    finding: "GAO reports that VA implemented two of twenty-nine prior priority recommendations, added three, and now has thirty priority recommendations across health-care access, IT modernization, and acquisition management.",
    decision: "Publish the exact portfolio movement without substituting it for iFAMS, Southern Oregon, enterprise FISMA, or veteran-outcome evidence.",
    remainingGap: "Action-level closure evidence for the thirty priorities, the open iFAMS recommendations, and Southern Oregon recommendations 1, 2, 5, 6, and 7.",
    reopeningRule: "Reopen when GAO publishes the next VA priority letter or VA OIG changes the named iFAMS or Southern Oregon recommendation states.",
    signal: { slug: "56o-va-priority-portfolio-two-implemented-30-current", title: "VA implements two priority recommendations while its portfolio rises to thirty", summary: "GAO's May 2026 letter records two implemented VA priorities, three additions, and thirty current priorities.", body: "VA implemented two of the twenty-nine priorities identified in May 2025. GAO added three recommendations, leaving thirty current priorities across timely health-care access, information-technology modernization, and acquisition management." },
  },
  {
    slug: "gsa-priority-portfolio-2026", documentNumber: 413,
    coverageId: "context-56o-gsa-priority-portfolio", entityId: "org-general-services-administration", entityName: "U.S. General Services Administration",
    sourceId: sourceProfiles[4].id, publicationDate: "2026-07-06", primaryTopic: "Policy and Standards",
    constraints: ["Regulation", "Capital", "Data Quality", "Public Trust"],
    recordIdentity: "GAO-26-108996 GSA priority recommendation portfolio",
    statusPeriod: "May 2025 baseline through June 2026",
    finding: "GAO reports that GSA implemented two of eight prior priority recommendations, removed priority status from one, added six, and now has eleven priority recommendations.",
    decision: "Publish the exact portfolio movement as federal shared-services and award-oversight context.",
    remainingGap: "Action-level identities and closure evidence for the eleven current priorities and operating outcomes for real property, shared services, awards, and procurement channels.",
    reopeningRule: "Reopen when GAO publishes the next GSA priority letter or a named current recommendation changes status.",
    signal: { slug: "56o-gsa-priority-portfolio-two-implemented-11-current", title: "GSA implements two priorities while shared-services and award oversight expand", summary: "GAO records two implemented GSA priorities, one de-prioritized action, six additions, and eleven current priorities.", body: "GSA implemented two of the eight priorities identified in May 2025. GAO removed priority status from one recommendation and added six, leaving eleven current priorities across federal real property, shared services, and federal-award oversight." },
  },
  {
    slug: "ostp-priority-portfolio-2026", documentNumber: 414,
    coverageId: "context-56o-ostp-priority-portfolio", entityId: "org-executive-office-president", entityName: "Office of Science and Technology Policy",
    sourceId: sourceProfiles[5].id, publicationDate: "2026-06-16", primaryTopic: "AI for Science",
    constraints: ["Geopolitics", "Standards", "Data Quality", "Public Trust"],
    recordIdentity: "GAO-26-109139 OSTP priority recommendation portfolio",
    statusPeriod: "June 2025 baseline through June 2026",
    finding: "GAO reports that OSTP implemented three of six prior priority recommendations, added one, and now has four priority recommendations focused on national science-and-technology goals and research security.",
    decision: "Publish the exact portfolio movement while keeping national-goal tracking and research-security information sharing separate.",
    remainingGap: "Action-level closure evidence for the four current priorities and measured outcomes from national-goal tracking or research-security coordination.",
    reopeningRule: "Reopen when GAO publishes the next OSTP priority letter or a named current recommendation changes status.",
    signal: { slug: "56o-ostp-priority-portfolio-three-implemented-four-current", title: "OSTP implements three priorities with four science-policy actions still prioritized", summary: "GAO records three implemented OSTP priorities, one addition, and four current actions covering national goals and research security.", body: "OSTP implemented three of the six priority recommendations identified in June 2025. GAO added one recommendation, leaving four current priorities focused on planning and tracking national science-and-technology goals and sharing research-security risk information." },
  },
  {
    slug: "ntia-priority-portfolio-2026", documentNumber: 415,
    coverageId: "context-56o-ntia-priority-portfolio", entityId: "agency-ntia", entityName: "National Telecommunications and Information Administration",
    sourceId: sourceProfiles[6].id, publicationDate: "2026-06-22", primaryTopic: "Cybersecurity",
    constraints: ["Cybersecurity", "Infrastructure", "Capital", "Data Quality"],
    recordIdentity: "GAO-26-109042 NTIA priority recommendation portfolio",
    statusPeriod: "July 2025 baseline through June 2026",
    finding: "GAO reports that NTIA implemented one of eleven prior priority recommendations and now has ten priorities across spectrum, IT and cybersecurity, and broadband programs.",
    decision: "Publish the exact portfolio movement without converting one implementation into an infrastructure-security or broadband-performance conclusion.",
    remainingGap: "Action-level closure evidence for the ten priorities and operating measures for spectrum coordination, infrastructure security, and broadband-program sustainability.",
    reopeningRule: "Reopen when GAO publishes the next NTIA priority letter or a named current recommendation changes status.",
    signal: { slug: "56o-ntia-priority-portfolio-one-implemented-10-current", title: "NTIA implements one priority while ten spectrum and broadband actions remain", summary: "GAO's June 2026 letter records one implemented NTIA priority and ten current priorities.", body: "NTIA implemented one of the eleven priority recommendations identified in July 2025. Ten remain across radio-frequency spectrum management, IT and cybersecurity risks to spectrum infrastructure, and the financial sustainability of federal broadband programs." },
  },
  {
    slug: "gao-open-recommendations-benefit-model-2026", documentNumber: 416,
    coverageId: "context-56o-gao-open-recommendations-benefit-model", entityId: "oversight-gao-governmentwide", entityName: "United States federal government",
    sourceId: sourceProfiles[7].id, publicationDate: "2026-05-12", primaryTopic: "Finance and Risk",
    constraints: ["Capital", "Data Quality", "Interpretation", "Public Trust"],
    recordIdentity: "GAO-26-108932 government-wide open-recommendation benefit model",
    statusPeriod: "Open recommendations as of October 2025; report published May 2026",
    finding: "GAO estimates that implementing open recommendations could produce $132 billion to $251 billion in measurable future financial benefits; the range is model-based, excludes many nonquantifiable benefits, and is not realized savings.",
    decision: "Publish the modeled range as bounded government-wide context with the method and realization limits attached.",
    remainingGap: "Recommendation-level implementation, attribution, timing, realized savings, nonfinancial outcomes, and agency-specific allocation of any benefit.",
    reopeningRule: "Reopen when GAO updates the model, publishes realized benefit attribution, or materially revises the open-recommendation inventory.",
    signal: { slug: "56o-gao-open-recommendations-132-251b-modeled-benefit", title: "GAO models $132 billion to $251 billion in potential benefits from open recommendations", summary: "GAO estimates a $132 billion to $251 billion range of measurable future financial benefits, subject to implementation and modeling limits.", body: "GAO's model estimates that implementing open recommendations could yield $132 billion to $251 billion in measurable future financial benefits. The estimate uses historical implementation and benefit data, excludes many benefits that cannot be credibly quantified, and depends on whether, how, and when actions are implemented." },
  },
];

const layers = ["Enabling Infrastructure", "Human Systems"];
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (path, value) => writeFile(path, json(value), "utf8");
const yamlQuote = (value) => JSON.stringify(value);
const yamlList = (items, indent = "  ") => items.map((item) => `${indent}- ${yamlQuote(item)}`).join("\n");

await Promise.all([
  "sources", "research-documents", "research-collections", "signals", "briefings", "updates",
].map((dir) => mkdir(join(contentRoot, dir), { recursive: true })));
await mkdir(join(publicRoot, "downloads", collectionSlug, "official-links"), { recursive: true });
await mkdir(dataRoot, { recursive: true });

for (const source of sourceProfiles) {
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id, name: source.name, url: source.url,
    source_type: "Government Agency", credibility_level: "Tier 1",
    primary_topics: source.topics, framework_layers: layers,
    country_or_region: "United States", update_frequency: "Annual",
    capture_priority: "High",
    known_limitations: `${source.limitation} Phase 56O preserves portfolio arithmetic, scope, status period, method, and continuation boundaries.`,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: "Release Page", review_cadence_days: 60,
    monitoring_status: "Active", coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government", source_owner: source.publisher,
    notes: `Phase 56O cross-agency remediation source. Collection: ${collectionSlug}.`,
  });
}

for (const [index, record] of records.entries()) {
  const source = sourceProfiles.find((item) => item.id === record.sourceId);
  const documentId = `research-doc-56o-${record.slug}`;
  const fileName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  await writeJson(join(contentRoot, "research-documents", `${record.documentNumber}-56o-${record.slug}.json`), {
    id: documentId, collection_id: collectionId,
    title: `${record.entityName}: Phase 56O Remediation Follow-Through`,
    slug: `56o-${record.slug}`, record_status: "Published",
    publisher: source.publisher, publication_date: record.publicationDate,
    document_type: "Oversight Report",
    summary: `${record.finding} Phase 56O decision: ${record.decision}`,
    key_findings: [
      `Coverage identity: ${record.coverageId}.`, `Exact record: ${record.recordIdentity}.`,
      `Status period: ${record.statusPeriod}.`, `Continuation rule: ${record.reopeningRule}`,
    ],
    why_it_matters: "The record exposes implementation throughput and remaining remediation workload without converting a portfolio into a performance rate.",
    ftfn_relevance: [
      `Preserves stable entity identity ${record.entityId}.`,
      "Keeps implemented, added, de-prioritized, current, modeled, and realized states distinct.",
      "Attaches source, period, scope, limitation, remaining gap, and continuation rule.",
    ],
    evidence_limits: [source.limitation, record.remainingGap, "No ranking, composite, readiness score, performance rate, or causal claim is supported."],
    primary_topics: source.topics, framework_layers: layers, constraint_tags: record.constraints,
    source_id: source.id, official_url: source.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${fileName}`,
    archive_member: `official-links/${fileName}`, capture_status: "Official link record", captured_date: capturedDate,
  });
  await writeFile(join(publicRoot, "downloads", collectionSlug, "official-links", fileName), [
    "FTFN Phase 56O official link record", `Title: ${source.name}`, `Publisher: ${source.publisher}`,
    `Publication date: ${record.publicationDate}`, `Official URL: ${source.url}`, `Checked: ${capturedDate}`,
    `Coverage identity: ${record.coverageId}`, `Entity ID: ${record.entityId}`, `Exact record: ${record.recordIdentity}`,
    `Status period: ${record.statusPeriod}`, "Publication decision: Published", `Decision: ${record.decision}`,
    `Limitation: ${source.limitation}`, "",
  ].join("\r\n"), "utf8");

  const signalId = `signal-${record.signal.slug}`;
  await writeFile(join(contentRoot, "signals", `${signalId}.mdx`), `---
id: ${yamlQuote(signalId)}
title: ${yamlQuote(record.signal.title)}
slug: ${yamlQuote(record.signal.slug)}
record_status: "Published"
summary: ${yamlQuote(record.signal.summary)}
source_ids:
  - ${yamlQuote(record.sourceId)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${yamlQuote(record.primaryTopic)}
framework_layers:
${yamlList(layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Audited or Verified Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The exact portfolio or model record makes remediation follow-through inspectable without turning it into agency performance."
dependencies:
  - "stable portfolio or model identity"
  - "declared status period"
  - "explicit arithmetic and state definitions"
constraints:
${yamlList(record.constraints)}
receiving_systems:
  - "Phase 56O cross-agency remediation follow-through"
local_implications:
  - "The record cannot be converted into an agency ranking, readiness score, or realized-benefit claim."
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

${source.limitation}

No ranking, composite, readiness score, performance rate, or causal claim is supported.
`, "utf8");
}

const phase56fIds = new Set(["coverage-56f-doe", "coverage-56f-hhs", "coverage-56f-dot", "coverage-56f-va"]);
const coverageDecisions = records.filter((record) => phase56fIds.has(record.coverageId)).map((record) => ({
  coverage_id: record.coverageId, entity_id: record.entityId, entity_name: record.entityName,
  prior_closure_status: "Partially Closed", current_closure_status: "Partially Closed",
  result: `${record.recordIdentity}: ${record.finding}`,
  decision: "Retain Partially Closed. Portfolio movement improves remediation visibility but does not close the selected Phase 56F evidence question.",
  reopening_rule: record.reopeningRule,
}));
const contextRecords = records.filter((record) => !phase56fIds.has(record.coverageId));

await writeJson(join(dataRoot, "phase-56o-cross-agency-remediation.json"), {
  phase: "56O", captured_date: capturedDate,
  batch_rule: "Publish exact official priority-portfolio and government-wide model records with stable agency, arithmetic, state, period, limitation, and continuation identities.",
  prior_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  post_batch_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  closure_changes: [], coverage_decisions: coverageDecisions,
  context_records: contextRecords.map((record) => `record-56o-${record.slug}`),
  inherited_hold: {
    record_id: "record-56n-hhs-large-hospital-post-date-recheck",
    status: "In Review",
    reason: "The public HHS tracker remained last updated July 22 with no post-July 29 response or status change on the August 1 check.",
  },
  records: records.map((record) => ({
    record_id: `record-56o-${record.slug}`, coverage_id: record.coverageId,
    entity_id: record.entityId, entity_name: record.entityName, source_id: record.sourceId,
    source_url: sourceProfiles.find((item) => item.id === record.sourceId).url,
    exact_record: record.recordIdentity, status_period: record.statusPeriod,
    finding: record.finding, decision: record.decision,
    remaining_gap: record.remainingGap, reopening_rule: record.reopeningRule,
    record_status: "Published",
  })),
});

const signalIds = records.map((record) => `signal-${record.signal.slug}`);
await writeJson(join(dataRoot, "phase-56o-publication-review.json"), {
  phase: "56O", reviewed_date: capturedDate, exact_records_checked: records.length,
  coverage_decisions: coverageDecisions.length, contextual_records: contextRecords.length,
  new_source_profiles: sourceProfiles.length,
  document_decisions: { reviewed: records.length, promoted: records.map((record) => `research-doc-56o-${record.slug}`), held: [] },
  signal_decisions: { reviewed: records.length, promoted: signalIds, held: [] },
  closure_decision: "No Phase 56F evidence-state changes. Eight bounded portfolio or model records publish; the inherited HHS tracker record remains In Review.",
  substitution_rule: "Portfolio movement is not agency performance, and a modeled potential benefit is not realized savings.",
  comparison_rule: "Agency, portfolio, recommendation, subject area, period, arithmetic, model, and benefit-realization identities remain distinct.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Cross-Agency Priority Remediation Portfolios, 2026", slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56O publishes seven agency priority-recommendation portfolios and one bounded government-wide benefit model while preserving the 1 Closed / 21 Partially Closed / 2 Open evidence ledger.",
  scope: "DOE, HHS, DOT, VA, GSA, OSTP, and NTIA priority-recommendation movement plus GAO's modeled potential financial benefits from open recommendations.",
  captured_date: capturedDate,
  document_ids: records.map((record) => `research-doc-56o-${record.slug}`),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The eleven-file archive contains eight official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Each record keeps agency, portfolio arithmetic, state definitions, status period, subject scope, limitation, remaining gap, and continuation rule attached. Implemented, added, de-prioritized, current, modeled, and realized states remain distinct.",
});

await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), `---
id: ${yamlQuote(briefingId)}
title: "Research Watch 019: Cross-Agency Remediation Follow-Through"
slug: "research-watch-019-cross-agency-remediation"
record_status: "Published"
summary: "Phase 56O compares exact portfolio movement across seven agencies and adds one bounded government-wide benefit model without creating a performance ranking."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlList(signalIds)}
evidence_gap_ids:
  - "gap-003"
  - "gap-008"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "Seven agency letters expose implemented, added, de-prioritized, and current priority-recommendation states."
  - "DOE, HHS, DOT, and VA retain their existing Phase 56F evidence states despite new portfolio visibility."
  - "GSA, OSTP, and NTIA add federal shared-service, science-policy, research-security, spectrum, cybersecurity, and broadband context."
  - "GAO's $132 billion to $251 billion range is modeled potential benefit, not realized savings."
  - "The inherited HHS hospital tracker record remains In Review."
constraint_watch:
  - "Data Quality"
  - "Regulation"
  - "Public Trust"
what_to_watch_next:
  - "Action-level changes inside the seven current priority portfolios."
  - "DOE insider-threat recommendations 1 and 7 and the open agency AI-governance actions."
  - "VA iFAMS and Southern Oregon recommendation changes."
  - "A post-July 29 HHS hospital-control tracker update."
---

## Portfolio movement

Phase 56O adds exact annual portfolio movement for DOE, HHS, DOT, VA, GSA, OSTP, and NTIA. The letters use different starting inventories, implementation counts, additions, and priority-designation changes. Those movements make remediation follow-through visible but do not create comparable agency rates.

## Government-wide context

GAO models $132 billion to $251 billion in measurable future financial benefits from implementing open recommendations. The range depends on historical modeling and future implementation, excludes many benefits that cannot be credibly quantified, and is not realized savings or an agency allocation.

## Evidence boundary

The selected evidence ledger remains one Closed, twenty-one Partially Closed, and two Open. Portfolio throughput, action closure, modeled benefits, operating performance, service quality, safety, readiness, and causation remain separate evidence types.
`, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-01-phase-56o-cross-agency-remediation.json"), {
  id: "update-2026-08-01-phase-56o-cross-agency-remediation", effective_date: capturedDate,
  entry_type: "Research Collection", title: "Phase 56O publishes cross-agency remediation follow-through",
  summary: "FTFN publishes seven exact agency priority portfolios and one bounded government-wide benefit model without changing the selected evidence-state ledger.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-019-cross-agency-remediation/", ...records.map((record) => `/signals/${record.signal.slug}/`)],
  evidence_note: "Implemented, added, de-prioritized, current, modeled, and realized states remain distinct from performance, readiness, rankings, and causation.",
  work_package: "docs/work-packages/phase-56o-cross-agency-remediation-follow-through.md",
});

console.log("Generated Phase 56O: eight source profiles, eight research documents, eight Published signals, one collection, Research Watch 019, two ledgers, and one update.");
