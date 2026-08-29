import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "gao-official-response-acquisition-artifact-sufficiency-decision-queue-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-024-official-response-acquisition-queue";
const archiveRoot = join(appRoot, "public", "downloads", collectionSlug);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");

for (const path of [
  join(contentRoot, "sources"),
  join(contentRoot, "research-documents"),
  join(contentRoot, "signals"),
  join(contentRoot, "research-collections"),
  join(contentRoot, "briefings"),
  join(contentRoot, "updates"),
  dataRoot,
  join(archiveRoot, "official-links"),
]) await mkdir(path, { recursive: true });

const phase56s = JSON.parse(await readFile(join(dataRoot, "phase-56s-artifact-scope-audit-missing-document-register.json"), "utf8"));
const phase56r = JSON.parse(await readFile(join(dataRoot, "phase-56r-implementation-artifact-milestone-ledger.json"), "utf8"));
const phase56rByKey = new Map(phase56r.records.map((record) => [record.action_key, record]));

const agencyMeta = {
  DOE: {
    topics: ["Energy", "Policy and Standards", "Finance and Risk"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    gaps: ["gap-008", "gap-016"],
    custodian: "DOE program office and records-management staff named by the recommendation",
    repositorySourceIds: ["source-56t-doe-osti-repository", "source-56t-doe-nepa-document-repository"],
  },
  HHS: {
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    gaps: ["gap-016"],
    custodian: "HHS Office of the Secretary and the responsible operating division",
    repositorySourceIds: ["source-56t-hhs-foia-library", "source-56t-hhs-guidance-portal"],
  },
  DOT: {
    topics: ["Mobility", "Aviation", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    gaps: ["gap-015", "gap-016"],
    custodian: "DOT Office of the Secretary or the named operating administration",
    repositorySourceIds: ["source-56t-dot-ost-electronic-reading-room", "source-56t-dot-chief-foia-officer-report-2026"],
  },
  VA: {
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    gaps: ["gap-016"],
    custodian: "VA Office of Management and the named program office",
    repositorySourceIds: ["source-56t-va-plans-budget-finances-performance", "source-56t-va-budget-portal"],
  },
};

const newSources = [
  {
    id: "source-56t-doe-osti-repository",
    name: "DOE Office of Scientific and Technical Information Repository",
    url: "https://www.osti.gov/",
    agency: "DOE",
    owner: "U.S. Department of Energy, Office of Scientific and Technical Information",
    access: "Interactive Portal",
    limitation: "OSTI searches more than three million DOE research results, but it is not a complete repository for internal recommendation-response memoranda, cost estimates, decision records, or oversight submissions.",
  },
  {
    id: "source-56t-doe-nepa-document-repository",
    name: "DOE NEPA Document Repository",
    url: "https://www.energy.gov/nepa/nepa-documents",
    agency: "DOE",
    owner: "U.S. Department of Energy, Office of NEPA Policy and Compliance",
    access: "Report Series",
    limitation: "The repository organizes environmental reviews and decisions. It can surface project analyses but does not establish that every recommendation-specific implementation artifact is public or within NEPA scope.",
  },
  {
    id: "source-56t-hhs-foia-library",
    name: "HHS FOIA Library",
    url: "https://www.hhs.gov/foia/electronic-reading-room/index.html",
    agency: "HHS",
    owner: "U.S. Department of Health and Human Services",
    access: "Report Series",
    limitation: "The library provides already-public policies, manuals, frequently requested records, and component reading-room links; failure to find a record there does not establish that it does not exist.",
  },
  {
    id: "source-56t-hhs-guidance-portal",
    name: "HHS Guidance Portal",
    url: "https://www.hhs.gov/guidance/",
    agency: "HHS",
    owner: "U.S. Department of Health and Human Services",
    access: "Interactive Portal",
    limitation: "The portal indexes public guidance. It does not necessarily contain internal standard operating procedures, exercise after-action reports, or every recommendation-response attachment submitted to GAO.",
  },
  {
    id: "source-56t-dot-ost-electronic-reading-room",
    name: "DOT Office of the Secretary Electronic Reading Room",
    url: "https://www.transportation.gov/foia/ost-electronic-reading-room",
    agency: "DOT",
    owner: "U.S. Department of Transportation, Office of the Secretary",
    access: "Report Series",
    limitation: "The reading room publishes required FOIA categories and frequently requested records, but it does not claim to contain every internal directive, risk profile, dashboard, or GAO response package.",
  },
  {
    id: "source-56t-dot-chief-foia-officer-report-2026",
    name: "DOT 2026 Chief FOIA Officer Report",
    url: "https://www.transportation.gov/sites/dot.gov/files/2026-03/2026%20DOT%20Chief%20FOIA%20Officer%20Report-Final.pdf",
    agency: "DOT",
    owner: "U.S. Department of Transportation",
    access: "Data Download",
    limitation: "The report maps DOT component reading rooms and disclosure practices. It is a repository-routing source, not evidence that the underlying recommendation-specific artifact is sufficient or implemented.",
  },
  {
    id: "source-56t-va-plans-budget-finances-performance",
    name: "VA Plans, Budget, Finances, and Performance Portal",
    url: "https://department.va.gov/about/va-plans-budget-finances-and-performance/",
    agency: "VA",
    owner: "U.S. Department of Veterans Affairs",
    access: "Report Series",
    limitation: "The portal consolidates public plans, budget, performance, evaluation, organization, high-risk, and oversight records but does not expose every acquisition, savings, risk, or transition implementation artifact.",
  },
  {
    id: "source-56t-va-budget-portal",
    name: "VA Budget Portal",
    url: "https://department.va.gov/administrations-and-offices/management/budget/",
    agency: "VA",
    owner: "U.S. Department of Veterans Affairs, Office of Management",
    access: "Report Series",
    limitation: "The portal publishes current and archived budget submissions. Budget plans are not substitutes for full life-cycle estimates, integrated schedules, category-specific savings evidence, or accepted recommendation responses.",
  },
];

for (const source of newSources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id,
    name: source.name,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    country_or_region: "United States",
    update_frequency: "Event Driven",
    capture_priority: "High",
    known_limitations: source.limitation,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: source.access,
    ...(source.access === "Data Download" ? { data_download_url: source.url } : {}),
    review_cadence_days: 45,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government",
    source_owner: source.owner,
    notes: `Phase 56T official repository-routing source. Collection: ${collectionSlug}.`,
  });
}

const missingSpecs = {
  "DOE-01": { custodian: "NNSA Office of Plutonium Modernization", terms: ["plutonium pit production life-cycle cost estimate", "GAO-23-104661 recommendation 1", "December 2026 estimate", "pit production cost uncertainty"], repos: ["NNSA program and budget records", "DOE OSTI", "DOE and NNSA FOIA libraries", "GAO recommendation correspondence"] },
  "DOE-02": { custodian: "DOE Office of Environmental Management", terms: ["complex-wide waste disposal analysis", "GAO-25-107109 recommendation 3", "April 2026 disposal analysis", "optimal disposal strategy"], repos: ["DOE Environmental Management reports", "DOE OSTI", "DOE NEPA records", "GAO recommendation correspondence"] },
  "DOE-05": { custodian: "DOE Office of Environmental Management, Hanford Site", terms: ["Hanford facility pause prerequisites", "GAO-24-106989 recommendation 3", "high-level waste alternatives analysis", "Hanford independent analysis decision"], repos: ["Hanford project records", "DOE Environmental Management reports", "DOE NEPA records", "GAO recommendation correspondence"] },
  "HHS-04-R1": { custodian: "HHS Administration for Strategic Preparedness and Response and Office of the Secretary", terms: ["department-wide after-action standard operating procedures", "GAO-24-106276 recommendation 1", "HHS component collaboration after action", "exercise after-action report"], repos: ["HHS FOIA Library", "HHS Guidance Portal", "ASPR TRACIE", "GAO recommendation correspondence"] },
  "HHS-04-R2": { custodian: "HHS Administration for Strategic Preparedness and Response and Office of the Secretary", terms: ["external stakeholder after-action standard operating procedures", "GAO-24-106276 recommendation 2", "public health emergency stakeholder after action", "exercise after-action report"], repos: ["HHS FOIA Library", "HHS Guidance Portal", "ASPR TRACIE", "GAO recommendation correspondence"] },
  "DOT-05": { custodian: "DOT Office of the Secretary, Office of Grants and Financial Assistance", terms: ["January 2026 enterprise risk management guidance grants", "GAO-25-107166 recommendation 2", "grant agreement risk assessment guidance", "operating administration risk profile"], repos: ["OST Electronic Reading Room", "DOT grants resources", "DOT component policy libraries", "GAO recommendation correspondence"] },
  "VA-04": { custodian: "VA Office of Acquisition, Logistics, and Construction", terms: ["category management savings goals baselines tracking", "GAO-25-107398 recommendation 4", "VA category-specific savings goals", "category management performance dashboard"], repos: ["VA Publications", "VA budget and performance portal", "VA acquisition policy library", "GAO recommendation correspondence"] },
  "VA-05": { custodian: "VA-DOD Joint Executive Committee and VA Office of Enterprise Integration", terms: ["VA DOD transition assistance joint assessment", "GAO-24-106189 recommendation 5", "transition gaps recommendations assessment", "Joint Executive Committee transition report"], repos: ["VA plans and performance portal", "VA publications", "DOD and VA joint committee records", "GAO recommendation correspondence"] },
};

const adjacentLocators = {
  "DOE-03": "DOE 2016 Long-Term Strategic Review release and linked review; no later periodic successor identified.",
  "DOE-04": "OCED Independent Assessments Guidance, assessment-planning and independent-review sections plus its nonbinding and internal-report limitations.",
  "HHS-01": "CMS FY 2026 IPPS final-rule page, Uncompensated Care Payments section and hospital payment files.",
  "HHS-02": "CMS Comprehensive Medicaid Integrity Plan FY 2024–2028, vulnerability-management and risk-prioritization sections; no national capacity-allocation table.",
  "HHS-03": "CDC Public Health Response Readiness Framework 2024–2028, priorities on local support and data modernization; no jurisdiction-level national gap dataset.",
  "DOT-01": "FAA Aviation Safety Workforce Plan 2026, workforce forecasting and competency sections; coverage is limited to aviation-safety occupations.",
  "DOT-02": "FAA Flight Plan 2026 goals and Air Traffic Controller Workforce Plan 2026–2028 recruiting, hiring, and training sections; no integrated operating dashboard.",
  "DOT-03": "DOT FY 2026 OST Budget Estimates, Discretionary Grants Systems Centralization section; describes a planned rather than completed enterprise process.",
  "DOT-04": "DOT IIJA Funding Status page, monthly obligation and outlay tables; formula and discretionary totals are not fully separated.",
  "DOT-07": "FAA Drone Normalization Strategy Report Update 2026, PDF pages 2–6; phased milestones are visible but full roles and estimated costs are not.",
  "VA-01": "VHA Enterprise Risk Management page, program mission and high-level functions; no complete leading-practice operating record.",
  "VA-02-R1": "VA FY 2026 Congressional Submission Volume V, EHR appropriation and program-plan sections; no complete full-life-cycle estimate.",
  "VA-02-R2": "VA FY 2026 Congressional Submission Volume V and Federal EHR Deployment Schedule 2026–2031; public milestones do not expose a full integrated master schedule.",
};

const candidateLocators = {
  "DOT-06": [
    "FAA Drone Normalization Strategy Report Update 2026, PDF pages 1–2: normalization purpose, operating context, mission, goals, and objectives.",
    "PDF pages 3–6: 2025–2030+ timeline, activities, milestones, and resource-shift discussion.",
    "GAO-23-105189 Recommendation 1, current status text: Open; GAO has not recorded acceptance of the revised strategy.",
  ],
  "DOT-08": [
    "DOT April 2025 Automated Vehicle Framework release: three principles and initial initiatives, but not one department-wide comprehensive plan.",
    "GAO-18-132 Recommendation 1: as of March 2026 DOT still lacks priorities, milestones, and other leading planning principles.",
    "No page or section in the release establishes a complete milestone and performance-measure system for departmental AV initiatives.",
  ],
  "VA-03": [
    "VA Notice 24-08, PDF page 1: Acquisition Lifecycle Framework stages, decision gates, and review-board structure.",
    "VA Notice 24-08, PDF pages 1–2: roles and tools are outlined, but the full cost, workforce, alignment, and compliance challenge set is not resolved.",
    "VA inactive-publications index and GAO-22-105195 Recommendation 1: Notice 24-08 expired November 14, 2025 and GAO still requires finalization and implementation of the management structure.",
  ],
};

const classFor = (record) => record.availability_class.startsWith("No separately")
  ? "Missing-document acquisition ticket"
  : record.availability_class.startsWith("Scope-adjacent")
    ? "Adjacent-source directive matrix"
    : "Public-candidate sufficiency matrix";

const classCounts = {};
const records = phase56s.records.map((base) => {
  const agency = base.parent_action_key.split("-")[0];
  const meta = agencyMeta[agency];
  const decisionClass = classFor(base);
  classCounts[decisionClass] = (classCounts[decisionClass] ?? 0) + 1;
  const missing = missingSpecs[base.action_key];
  const candidate = candidateLocators[base.action_key];
  const slug = base.signal_id.replace("signal-56s-", "");
  const prior = phase56rByKey.get(base.action_key) ?? phase56r.records.find((record) => record.action_key === base.parent_action_key);
  const repositorySourceIds = meta.repositorySourceIds;
  const locatedSourceIds = [...new Set([...base.located_source_ids, ...repositorySourceIds])];
  const elementLocators = candidate ?? base.scope_checklist.map(() => adjacentLocators[base.action_key] ?? "No separately public exact artifact acquired as of 2026-08-02.");
  const directiveMatrix = base.scope_checklist.map((entry, itemIndex) => ({
    directive_element: itemIndex + 1,
    requirement: entry.requirement,
    phase_56s_scope_status: entry.status,
    matrix_decision: entry.status,
    evidence: entry.evidence,
    locator: missing ? "No separately public exact artifact acquired as of 2026-08-02." : elementLocators[itemIndex],
    authority_boundary: "FTFN records visible public coverage only; GAO retains recommendation-sufficiency and closure authority.",
  }));
  const acquisitionStatus = missing
    ? "Exact artifact not acquired from a public repository"
    : candidate
      ? "Public candidate matrix complete; authoritative sufficiency unresolved"
      : "Adjacent record retained; exact implementation artifact acquisition remains open";
  const stopRule = missing
    ? "Stop the bounded public-search pass after the named program, publication, reading-room, budget, and current GAO surfaces have been checked; reopen on a new exact-title, correspondence, attachment, or custodian lead."
    : candidate
      ? "Stop FTFN sufficiency review at the page-and-section matrix; do not convert the matrix into GAO acceptance."
      : "Stop treating the adjacent source as a substitute once its visible scope and missing directive elements are recorded; reopen on a more exact artifact or GAO update.";
  const nextAction = missing
    ? `Route the exact-title query to ${missing.custodian}; monitor the named repositories and GAO page for a public attachment. No request has been submitted by FTFN.`
    : candidate
      ? "Monitor the GAO recommendation page for an explicit acceptance decision or named remaining deficiency; retain the public candidate and locator matrix meanwhile."
      : "Seek the exact directive, dashboard, assessment, schedule, or implementation record named by the unresolved matrix elements; keep the adjacent source as context only.";
  return {
    ...base,
    record_id: `record-56t-${slug}`,
    phase: "56T",
    phase_56s_record_id: base.record_id,
    record_relationship: "Phase 56S acquisition-or-sufficiency continuation",
    document_id: `research-doc-56t-${slug}`,
    signal_id: `signal-56t-${slug}`,
    decision_class: decisionClass,
    target_artifact: prior?.response_artifact_type ?? base.action_text,
    likely_custodian: missing?.custodian ?? meta.custodian,
    priority_repositories: missing?.repos ?? ["Current GAO recommendation page", "Named agency publication portal", "Agency electronic reading room", "Program budget, policy, and report library"],
    repository_source_ids: repositorySourceIds,
    search_terms: missing?.terms ?? [base.official_identity, prior?.response_artifact_type ?? "recommendation response artifact", base.affected_component, base.action_key],
    acquisition_status: acquisitionStatus,
    official_search_result: `${acquisitionStatus}. The 2026-08-02 repository recheck did not produce an authoritative status or closure change.`,
    stop_rule: stopRule,
    reopening_trigger: "A new agency attachment, public exact-title match, successor directive, GAO page update, or named custodian release.",
    next_action: nextAction,
    directive_matrix: directiveMatrix,
    located_source_ids: locatedSourceIds,
    located_official_urls: [...new Set([...base.located_official_urls, ...newSources.filter((source) => repositorySourceIds.includes(source.id)).map((source) => source.url)])],
    gao_acceptance_state: base.gao_acceptance_state,
    implementation_change: false,
    closure_change: false,
  };
});

const ledger = {
  phase: "56T",
  captured_date: capturedDate,
  goal: "Convert every Phase 56S availability result into a bounded official-response acquisition ticket or artifact-sufficiency matrix.",
  authority_rule: "FTFN can route, locate, and describe public evidence; GAO alone records recommendation acceptance and closure on the cited product pages.",
  nonexistence_rule: "A failed bounded public search does not establish that an artifact does not exist, was withheld, or was never submitted.",
  recommendation_records: records.length,
  decision_class_counts: classCounts,
  directive_elements: records.reduce((sum, record) => sum + record.directive_matrix.length, 0),
  scope_element_counts: phase56s.scope_element_counts,
  new_repository_source_profiles: newSources.length,
  implementation_changes: [],
  closure_changes: [],
  prior_closure_counts: phase56s.post_batch_closure_counts,
  post_batch_closure_counts: phase56s.post_batch_closure_counts,
  inherited_hold: phase56s.inherited_hold,
  records,
};
await writeJson(join(dataRoot, "phase-56t-official-response-acquisition-artifact-sufficiency-queue.json"), ledger);

await writeJson(join(dataRoot, "phase-56t-publication-review.json"), {
  phase: "56T",
  captured_date: capturedDate,
  reviewed_records: records.length,
  new_source_profiles: newSources.length,
  document_decisions: { promoted: records.map((record) => record.document_id), held: [] },
  signal_decisions: { promoted: records.map((record) => record.signal_id), held: [] },
  decision_class_counts: classCounts,
  publication_rule: "Publish the bounded acquisition and sufficiency decision while preserving nonexistence, GAO-authority, implementation, closure, and outcome boundaries.",
});

const publicationDates = new Map(phase56r.records.map((record) => [record.action_key, record.publication_date]));
for (const [index, record] of records.entries()) {
  const agency = record.parent_action_key.split("-")[0];
  const meta = agencyMeta[agency];
  const title = `${record.action_key}: ${record.decision_class}`;
  const document = {
    id: record.document_id,
    collection_id: collectionId,
    title,
    slug: `56t-${record.signal_id.replace("signal-56t-", "")}`,
    record_status: "Published",
    publisher: "U.S. Government Accountability Office and named implementing agency",
    publication_date: publicationDates.get(record.action_key) ?? publicationDates.get(record.parent_action_key) ?? null,
    document_type: "Oversight Report",
    summary: `${record.official_identity} receives a ${record.decision_class.toLowerCase()} with an exact target, custodian, repository route, three directive-element decisions, stop rule, and reopening trigger.`,
    key_findings: [
      `Decision class: ${record.decision_class}.`,
      `Target artifact: ${record.target_artifact}.`,
      `Likely custodian: ${record.likely_custodian}.`,
      `Acquisition status: ${record.acquisition_status}.`,
      ...record.directive_matrix.map((entry) => `Directive element ${entry.directive_element}: ${entry.requirement} — ${entry.matrix_decision}. Locator: ${entry.locator}`),
      `Stop rule: ${record.stop_rule}`,
      `Reopening trigger: ${record.reopening_trigger}`,
      `Next action: ${record.next_action}`,
      `GAO acceptance state: ${record.gao_acceptance_state}.`,
    ],
    why_it_matters: "The queue turns a generic missing-or-adjacent evidence gap into a reproducible retrieval route or a bounded page-level sufficiency record without claiming authority FTFN does not have.",
    ftfn_relevance: [
      `Preserves ${record.action_key} and its exact recommendation identity.`,
      "Names the artifact, likely custodian, repositories, search terms, stop rule, and reopening trigger.",
      "Separates source location and visible scope from GAO acceptance, implementation, closure, and operating outcomes.",
    ],
    evidence_limits: [
      "Not publicly acquired does not mean nonexistent, withheld, or never submitted.",
      "A repository portal is a retrieval route, not the recommendation-specific implementation artifact.",
      "FTFN's directive matrix does not substitute for GAO's recommendation-sufficiency or closure decision.",
      "Document evidence does not establish performance, readiness, safety, savings, value, ranking, composite score, or causation.",
    ],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: [...new Set([...record.supporting_source_ids, ...record.located_source_ids])],
    supporting_official_urls: record.located_official_urls,
    official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(index + 1).padStart(2, "0")}-${record.signal_id.replace("signal-56t-", "")}.txt`,
    archive_member: `official-links/${String(index + 1).padStart(2, "0")}-${record.signal_id.replace("signal-56t-", "")}.txt`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  };
  await writeJson(join(contentRoot, "research-documents", `${String(509 + index).padStart(3, "0")}-56t-${record.signal_id.replace("signal-56t-", "")}.json`), document);

  const signal = `---
id: ${JSON.stringify(record.signal_id)}
title: ${JSON.stringify(title)}
slug: ${JSON.stringify(`56t-${record.signal_id.replace("signal-56t-", "")}`)}
record_status: "Published"
summary: ${JSON.stringify(`${record.official_identity} now has a bounded acquisition or public-candidate sufficiency decision.`)}
${yamlList("source_ids", [...new Set([record.source_id, ...record.supporting_source_ids, ...record.located_source_ids])])}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: ${JSON.stringify(meta.topics[0])}
${yamlList("framework_layers", meta.layers)}
signal_type: "Research Result"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Audited or Verified Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "The queue names a retrieval route or exact sufficiency matrix while retaining authoritative boundaries."
${yamlList("dependencies", ["exact recommendation identity", "official repository route", "directive-element locator", "GAO acceptance"])}
${yamlList("constraints", ["Regulation", "Data Quality", "Public Trust"])}
${yamlList("receiving_systems", ["Phase 56T official-response acquisition and artifact-sufficiency queue"])}
${yamlList("local_implications", ["Do not convert a search result or FTFN matrix into nonexistence, implementation, closure, performance, or outcome."])}
${yamlList("evidence_gap_ids", meta.gaps)}
claim_scope: "Specific Source Update"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
---

## Decision

${record.acquisition_status}. Target artifact: ${record.target_artifact}. Likely custodian: ${record.likely_custodian}.

## Directive matrix

${record.directive_matrix.map((entry) => `- **${entry.requirement}:** ${entry.matrix_decision}. ${entry.evidence} Locator: ${entry.locator}`).join("\n")}

## Retrieval control

${record.next_action}

Stop rule: ${record.stop_rule}

Reopen when: ${record.reopening_trigger}

## Authority boundary

GAO acceptance remains ${record.gao_acceptance_state}. A failed public search does not establish nonexistence, and FTFN's matrix is not an implementation or closure decision.
`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");

  const linkRecord = [
    `FTFN Phase 56T decision record ${String(index + 1).padStart(2, "0")}`,
    `Action key: ${record.action_key}`,
    `Official identity: ${record.official_identity}`,
    `Official URL: ${record.official_url}`,
    `Decision class: ${record.decision_class}`,
    `Target artifact: ${record.target_artifact}`,
    `Likely custodian: ${record.likely_custodian}`,
    `Acquisition status: ${record.acquisition_status}`,
    "Priority repositories:",
    ...record.priority_repositories.map((item) => `- ${item}`),
    "Search terms:",
    ...record.search_terms.map((item) => `- ${item}`),
    "Directive matrix:",
    ...record.directive_matrix.map((entry) => `- ${entry.requirement}: ${entry.matrix_decision}; locator: ${entry.locator}`),
    `Stop rule: ${record.stop_rule}`,
    `Reopening trigger: ${record.reopening_trigger}`,
    `Next action: ${record.next_action}`,
    `GAO acceptance state: ${record.gao_acceptance_state}`,
    "Boundary: not publicly acquired does not mean nonexistent; FTFN review does not substitute for GAO acceptance.",
  ].join("\n");
  await writeFile(join(archiveRoot, document.archive_member), `${linkRecord}\n`, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "GAO Official-Response Acquisition and Artifact-Sufficiency Decision Queue, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56T publishes eight missing-document acquisition tickets, thirteen adjacent-source directive matrices, three public-candidate sufficiency matrices, and eight official repository-routing sources.",
  scope: "DOE, HHS, DOT, and VA recommendation-response retrieval routes, page- and section-level directive matrices, stop rules, reopening triggers, and GAO-authority boundaries.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-seven-file archive contains twenty-four decision records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Not publicly acquired does not establish nonexistence. Repository routes and FTFN matrices do not establish GAO acceptance, implementation, closure, performance, or outcome.",
});

const allSignalIds = records.map((record) => record.signal_id);
const briefing = `---
id: ${JSON.stringify(briefingId)}
title: "Research Watch 024: Official-Response Acquisition Queue"
slug: "research-watch-024-official-response-acquisition-queue"
record_status: "Published"
summary: "Phase 56T converts the 3 / 13 / 8 availability split into 24 controlled retrieval and artifact-sufficiency decisions."
published_date: ${capturedDate}
captured_date: ${capturedDate}
${yamlList("signal_ids", allSignalIds)}
${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
${yamlList("top_takeaways", [
  "Eight exact artifacts now have acquisition tickets with a named custodian, repositories, search terms, stop rule, reopening trigger, and next action.",
  "Thirteen adjacent records now have directive-element locators that show why useful public evidence is still not the exact implementation artifact.",
  "Three public candidates now have page- or section-level sufficiency matrices; GAO acceptance remains unresolved for each.",
  "Eight official repository-routing sources deepen retrieval coverage without changing any implementation, closure, or entity evidence state.",
])}
${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}
${yamlList("what_to_watch_next", ["Exact response artifacts released by named custodians", "Successor directives and public attachments", "Explicit GAO acceptance or remaining-deficiency language"])}
---

## What Phase 56T adds

Every Phase 56S availability result is now actionable. Missing documents have acquisition tickets, adjacent sources have directive matrices, and public candidates have page- or section-level sufficiency matrices.

## Current decisions

The queue contains eight missing-document tickets, thirteen adjacent-source matrices, and three public-candidate matrices. The official repository recheck added eight routing sources and found no basis for an implementation or closure change.

## Evidence boundary

A failed bounded search does not prove nonexistence. A public record is not necessarily the exact implementation artifact. FTFN can describe visible scope, but GAO retains recommendation-acceptance and closure authority. The records do not establish performance, readiness, safety, savings, value, ranking, score, or causation.
`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56t-official-response-acquisition-queue.json"), {
  id: "update-2026-08-02-phase-56t-official-response-acquisition-queue",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56T publishes the official-response acquisition and artifact-sufficiency queue",
  summary: "FTFN converts twenty-four availability results into eight missing-document tickets, thirteen adjacent-source matrices, and three public-candidate matrices while preserving every authority and outcome boundary.",
  affected_record_ids: [collectionId, briefingId, ...allSignalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-024-official-response-acquisition-queue/", ...records.map((record) => `/signals/${record.signal_id.replace("signal-", "")}/`)],
  evidence_note: "A failed public search does not establish nonexistence, and FTFN retrieval or sufficiency decisions do not establish GAO acceptance, implementation, closure, or outcome.",
  work_package: "docs/work-packages/phase-56t-official-response-acquisition-artifact-sufficiency-queue.md",
});

console.log(`Generated Phase 56T: ${records.length} records, ${newSources.length} repository sources, decision classes ${JSON.stringify(classCounts)}.`);
