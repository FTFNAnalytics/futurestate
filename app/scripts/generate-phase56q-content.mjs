import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-01";
const collectionSlug = "gao-recommendation-identity-agency-response-crosswalk-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-021-gao-recommendation-identity-agency-response";
const archiveRoot = join(appRoot, "public", "downloads", collectionSlug);
const linkRoot = join(archiveRoot, "official-links");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yaml = (value) => JSON.stringify(value);
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

for (const path of [
  join(contentRoot, "sources"),
  join(contentRoot, "research-documents"),
  join(contentRoot, "signals"),
  join(contentRoot, "research-collections"),
  join(contentRoot, "briefings"),
  join(contentRoot, "updates"),
  dataRoot,
  linkRoot,
]) await mkdir(path, { recursive: true });

const agencyMeta = {
  DOE: { topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-008", "gap-016"] },
  HHS: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
  DOT: { topics: ["Mobility", "Aviation", "Policy and Standards"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  VA: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
};

const matches = [
  { key: "DOE-01", report: "GAO-23-104661", date: "2023-01-12", rec: 1, affected: "National Nuclear Security Administration; Plutonium Modernization program", status: "Open", asOf: "April 2026", recommendation: "Develop a life-cycle cost estimate for establishing plutonium-pit production capability that follows cost-estimating best practices.", response: "NNSA concurred. GAO reported in April 2026 that a conforming estimate was still unavailable; NNSA expected one in December 2026." },
  { key: "DOE-02", report: "GAO-25-107109", date: "2025-05-29", rec: 3, affected: "Department of Energy; Senior Advisor for Environmental Management", status: "Open", asOf: "April 2026", recommendation: "Develop complex-wide analyses of waste-disposal alternatives and strategies.", response: "DOE partially concurred in its 180-day letter and considered its action complete. GAO said the required complex-wide analysis was still missing." },
  { key: "DOE-03", report: "GAO-18-477", date: "2018-05-30", rec: 2, affected: "Department of Energy; Secretary of Energy", status: "Open", asOf: "February 2026", recommendation: "Conduct periodic Strategic Petroleum Reserve reviews that provide Congress timely cost-and-benefit information about alternative reserve sizes.", response: "DOE agreed in May 2018. GAO reported in February 2026 that DOE had not finalized the periodic review." },
  { key: "DOE-04", report: "GAO-22-105394", date: "2022-09-08", rec: 1, affected: "Department of Energy; Office of Nuclear Energy and Office of Clean Energy Demonstrations", status: "Open", asOf: "January 2025", recommendation: "Require external independent reviews of large nuclear-energy demonstration projects at selection and later decision points.", response: "DOE agreed. GAO found that the January 2025 framework and assessment policy still did not require the specified external independent reviews." },
  { key: "DOE-05", report: "GAO-24-106989", date: "2024-09-26", rec: 3, affected: "Department of Energy; Senior Advisor for Environmental Management", status: "Open", asOf: "February 2026", recommendation: "Pause specified Hanford waste-treatment design and construction until named prerequisites, including consideration of an independent alternatives analysis, are complete.", response: "DOE did not concur. GAO reported in February 2026 that DOE had not acted to implement the pause." },
  { key: "HHS-01", report: "GAO-16-568", date: "2016-06-30", rec: 2, affected: "Centers for Medicare & Medicaid Services; Administrator", status: "Open", asOf: "December 2025", recommendation: "Account for Medicaid payments that offset uncompensated-care costs when calculating Medicare uncompensated-care payments to individual hospitals.", response: "HHS initially concurred but repeatedly reconsidered implementation, including through December 2025. GAO continues to maintain that the action is needed." },
  { key: "HHS-02", report: "GAO-18-564", date: "2018-08-06", rec: 1, affected: "Centers for Medicare & Medicaid Services; Administrator", status: "Open – Partially Addressed", asOf: "February 2026", recommendation: "Complete a national Medicaid program-integrity risk assessment and use it to evaluate and allocate oversight resources.", response: "HHS concurred. GAO reported no further information in February 2026 and said a national risk assessment was still required." },
  { key: "HHS-03", report: "GAO-26-107507", date: "2026-02-23", rec: 4, affected: "Centers for Disease Control and Prevention; Director", status: "Open", asOf: "Summer 2026 response pending", recommendation: "Collect and analyze information on jurisdictions' ability to meet public-health preparedness capabilities and identify related gaps with jurisdictions.", response: "HHS concurred. GAO said it would update the status after receiving HHS's 180-day letter, expected in summer 2026." },
  { key: "HHS-04", report: "GAO-24-106276", date: "2024-04-18", hold: true, affected: "Department of Health and Human Services; Secretary", status: "Open – Partially Addressed", asOf: "January 2026", recommendation: "The local action combines two distinct recommendations for a coordinated department-wide after-action program: component collaboration and external-stakeholder participation.", response: "HHS developed standard operating procedures. GAO is awaiting evidence from an exercise or response after-action report before determining whether either recommendation is implemented.", candidates: [
    { rec: 1, summary: "Coordinate after-action work across HHS component agencies and integrate existing component programs." },
    { rec: 2, summary: "Include relevant external stakeholders in each emergency-response after-action process." },
  ] },
  { key: "DOT-01", report: "GAO-21-310", date: "2021-05-13", rec: 1, affected: "Federal Aviation Administration; Assistant Administrator for Human Resource Management", status: "Open", asOf: "April 2026", recommendation: "Collect more comprehensive information for agency-wide assessments of mission-critical skill gaps.", response: "FAA reported in April 2026 that its skill-gap assessment was on hold during reorganization and did not provide a completion schedule." },
  { key: "DOT-02", report: "GAO-26-107320", date: "2025-12-17", rec: 3, affected: "Federal Aviation Administration; Administrator", status: "Open", asOf: "May 2026", recommendation: "Assess controller recruitment, hiring, and training processes and use the results to improve them.", response: "DOT concurred in its May 28, 2026, 180-day letter and supplied performance-dashboard information that remained under GAO review." },
  { key: "DOT-03", report: "GAO-17-20", date: "2016-12-14", rec: 1, affected: "Department of Transportation; Secretary", status: "Open", asOf: "April 2026", recommendation: "Issue a department-wide directive for discretionary grants requiring documented key decisions and alignment between policy priorities and evaluation and selection.", response: "DOT concurred. In April 2026 it planned a new grant system and departmental guidance, with completion targeted for October 2026." },
  { key: "DOT-04", report: "GAO-25-107166", date: "2025-07-24", rec: 1, affected: "Department of Transportation; Secretary", status: "Open", asOf: "March 2026", recommendation: "Provide Congress complete information on the status of Infrastructure Investment and Jobs Act grant funding.", response: "DOT had not completed the action by March 2026. It described public reporting and a planned Grants Transparency Dashboard targeted for the second quarter of fiscal year 2027." },
  { key: "DOT-05", report: "GAO-25-107166", date: "2025-07-24", rec: 2, affected: "Department of Transportation; Secretary", status: "Open", asOf: "March 2026", recommendation: "Assess risks that state, local, and other awardees face when executing grant agreements.", response: "DOT concurred and described enterprise-risk guidance and future operating-administration risk emphasis, but GAO reported the action was not yet addressed." },
  { key: "DOT-06", report: "GAO-23-105189", date: "2023-01-26", rec: 1, affected: "Federal Aviation Administration; Administrator", status: "Open", asOf: "March 2026", recommendation: "Develop a comprehensive strategy for integrating drones into the national airspace system.", response: "FAA reported a revised strategy under Office of the Secretary review and planned submission by June 30, 2026; GAO had not recorded completion." },
  { key: "DOT-07", report: "GAO-26-107648", date: "2026-02-04", rec: 1, affected: "Federal Aviation Administration; Administrator", status: "Open", asOf: "June 2026", recommendation: "Develop and implement specific milestones for integrating drones into a future information-centric national airspace.", response: "FAA cited BVLOS rulemaking, industry standards, and research; its June 2026 update scheduled initial actions through March 30, 2027." },
  { key: "DOT-08", report: "GAO-18-132", date: "2017-11-30", rec: 1, affected: "Department of Transportation; Secretary", status: "Open", asOf: "March 2026", recommendation: "Develop a comprehensive plan for department-wide automated-vehicle initiatives.", response: "DOT described a framework and initiatives, but GAO reported in March 2026 that the department still lacked the comprehensive overall plan." },
  { key: "VA-01", report: "GAO-25-106969", date: "2024-11-07", rec: 2, affected: "Veterans Health Administration; Under Secretary for Health", status: "Open", asOf: "February 2026", recommendation: "Fully incorporate GAO leading practices as VHA implements its enterprise risk-management function.", response: "VA agreed. It said restructuring would change oversight and targeted September 2028; GAO said the leading practices still must be incorporated." },
  { key: "VA-02", report: "GAO-25-106874", date: "2025-03-12", hold: true, affected: "Department of Veterans Affairs; Electronic Health Record Modernization Integration Office", status: "Open", asOf: "Current GAO product page", recommendation: "The local action combines two distinct program-management recommendations: a life-cycle cost estimate and an integrated master schedule.", response: "VA concurred in principle but limited its planned artifacts to the current Oracle contract. GAO said that scope was insufficient for either full life-cycle recommendation.", candidates: [
    { rec: 1, summary: "Develop a reliable life-cycle cost estimate for the full electronic health record modernization program." },
    { rec: 2, summary: "Develop an integrated master schedule for the full electronic health record modernization program." },
  ] },
  { key: "VA-03", report: "GAO-22-105195", date: "2022-08-11", rec: 1, affected: "Department of Veterans Affairs; Secretary and Chief Acquisition Officer", status: "Open – Partially Addressed", asOf: "February 2025", recommendation: "Establish a comprehensive governance and oversight framework for major acquisitions, including clear roles and risk-management responsibilities.", response: "VA concurred. GAO reported that the management structure and supporting tasks remained incomplete after a new framework notice replaced the prior framework." },
  { key: "VA-04", report: "GAO-25-107398", date: "2025-09-02", rec: 4, affected: "Department of Veterans Affairs; Secretary, Deputy Secretary, and category managers", status: "Open", asOf: "Spring 2026 update pending", recommendation: "Set goals and track common-spend cost avoidance and budget savings so category-management results can be assessed.", response: "VA concurred with all six report recommendations. The product page still said a recommendation-status update was expected in spring 2026." },
  { key: "VA-05", report: "GAO-24-106189", date: "2024-07-15", rec: 5, affected: "Department of Defense–Department of Veterans Affairs Joint Executive Committee", status: "Open", asOf: "January 2026", recommendation: "Assess the effectiveness of joint efforts to facilitate mental-health-service access during military-to-civilian transition and recommend changes as appropriate.", response: "VA concurred. In January 2026 the Joint Transition Task Force's draft assessment was under review, with completion expected in December 2026." },
];

const priorLedger = JSON.parse(await readFile(join(dataRoot, "phase-56p-action-recommendation-ledger.json"), "utf8"));
const priorByKey = new Map(priorLedger.records.map((record) => [record.action_key, record]));
if (matches.length !== 22 || matches.some((match) => !priorByKey.has(match.key))) throw new Error("Phase 56Q requires all twenty-two Phase 56P action keys.");

const sourceByReport = new Map();
for (const match of matches) {
  const agency = match.key.split("-")[0];
  if (!sourceByReport.has(match.report)) sourceByReport.set(match.report, {
    id: `source-56q-${match.report.toLowerCase()}-recommendation-status`,
    report: match.report,
    date: match.date,
    agency,
    url: `https://www.gao.gov/products/${match.report.toLowerCase()}`,
  });
}

for (const source of sourceByReport.values()) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id,
    name: `${source.report}: Recommendation Status and Agency Response`,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    country_or_region: "United States",
    update_frequency: "Event Driven",
    capture_priority: "High",
    known_limitations: "The official GAO product page reports recommendation text, affected entity, status, and agency-response history. An agency response does not prove implementation; an open or partially addressed recommendation does not prove operating performance or outcome. GAO exposes report and recommendation numbers on the page, not a separate opaque database identifier.",
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: "Release Page",
    review_cadence_days: 45,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government",
    source_owner: "U.S. Government Accountability Office",
    notes: `Phase 56Q official product-page source for ${source.report}. Collection: ${collectionSlug}.`,
  });
}

const records = [];
for (const [index, match] of matches.entries()) {
  const prior = priorByKey.get(match.key);
  const agency = match.key.split("-")[0];
  const meta = agencyMeta[agency];
  const source = sourceByReport.get(match.report);
  const baseSlug = prior.document_id.replace("research-doc-56p-", "");
  const slug = `56q-${baseSlug}`;
  const documentId = `research-doc-${slug}`;
  const signalId = `signal-${slug}`;
  const recordStatus = match.hold ? "In Review" : "Published";
  const identity = match.hold ? null : `${match.report} Recommendation ${match.rec}`;
  const decision = match.hold ? "Held — one-to-many" : "Exact one-to-one";
  const number = String(index + 1).padStart(2, "0");
  const archiveName = `${number}-${baseSlug}.txt`;
  const candidateText = match.hold ? match.candidates.map((candidate) => `${match.report} Recommendation ${candidate.rec}: ${candidate.summary}`).join(" | ") : "Not applicable";
  const continuation = match.hold
    ? `Preserve ${match.key} as the parent local action and create recommendation-specific child records before publication; do not collapse Recommendations ${match.candidates.map((item) => item.rec).join(" and ")}.`
    : `Recheck ${match.report} Recommendation ${match.rec} when GAO changes the status or adds agency-response evidence after ${match.asOf}.`;
  await writeFile(join(linkRoot, archiveName), [
    `FTFN action key: ${match.key}`,
    `Resolution decision: ${decision}`,
    `Official report: ${match.report}`,
    `Official recommendation: ${identity ?? "Not assigned — one local action maps to multiple recommendations"}`,
    `Candidates: ${candidateText}`,
    `Affected component: ${match.affected}`,
    `Current GAO status: ${match.status}`,
    `Status period: ${match.asOf}`,
    `Official URL: ${source.url}`,
    `Agency-response summary: ${match.response}`,
    `Continuation rule: ${continuation}`,
    "Boundary: Agency response is not implementation; recommendation status is not the Phase 56F evidence ledger or an operating outcome.",
    "",
  ].join("\n"), "utf8");

  await writeJson(join(contentRoot, "research-documents", `${439 + index}-${slug}.json`), {
    id: documentId,
    collection_id: collectionId,
    title: match.hold ? `${match.key}: recommendation identity held for one-to-many mapping` : `${match.key}: ${identity} identity and agency response`,
    slug,
    record_status: recordStatus,
    publisher: "U.S. Government Accountability Office",
    publication_date: match.date,
    document_type: "Oversight Report",
    summary: match.hold
      ? `${match.key} remains In Review because the Phase 56P local action combines ${match.candidates.length} distinct official recommendations in ${match.report}.`
      : `${match.key} resolves one-to-one to ${identity}; the record preserves the affected component, current GAO status, agency response, and last visible update period.`,
    key_findings: [
      `Phase 56P action: ${prior.action_text}`,
      `Resolution decision: ${decision}.`,
      `Official identity: ${identity ?? "held; no single official recommendation identity assigned"}.`,
      `Affected component: ${match.affected}.`,
      `Current GAO status: ${match.status}; status period: ${match.asOf}.`,
      `Agency response: ${match.response}`,
      `Continuation rule: ${continuation}`,
    ],
    why_it_matters: "The crosswalk replaces a letter-level local reference with an inspectable official report-and-recommendation identity where the evidence supports exactly one match.",
    ftfn_relevance: [
      `Preserves local action key ${match.key} as a crosswalk rather than an official identifier.`,
      "Separates official recommendation identity, affected entity, GAO status, agency response, implementation evidence, closure, and outcome.",
      match.hold ? `Preserves both candidates: ${candidateText}` : `Supports direct follow-through on ${identity}.`,
    ],
    evidence_limits: [
      "An agency response, concurrence, planned date, submission, or artifact under review does not by itself establish implementation or closure.",
      "GAO recommendation status is not interchangeable with the Phase 56F entity evidence state.",
      "Recommendation closure would not by itself establish operating performance, readiness, safety, value, or causation.",
      match.hold ? "A one-to-many local-action mapping cannot be published as one official recommendation identity." : "The official identity is the report number plus recommendation number shown on the GAO product page; FTFN does not invent a separate opaque database identifier.",
    ],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: source.id,
    official_url: source.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  const signalTitle = match.hold ? `${match.key} identity remains held across two GAO recommendations` : `${match.key} resolves to ${identity}`;
  const signalSummary = match.hold
    ? `${match.key} remains In Review because one Phase 56P action aggregates two official ${match.report} recommendations.`
    : `${match.key} resolves one-to-one to ${identity}, currently ${match.status}; the agency response remains distinct from implementation.`;
  const body = `---\n` +
    `id: ${yaml(signalId)}\n` +
    `title: ${yaml(signalTitle)}\n` +
    `slug: ${yaml(slug)}\n` +
    `record_status: ${yaml(recordStatus)}\n` +
    `summary: ${yaml(signalSummary)}\n` +
    `source_ids:\n  - ${yaml(source.id)}\n` +
    `published_date: ${capturedDate}\n` +
    `captured_date: ${capturedDate}\n` +
    `primary_topic: ${yaml(meta.topics[0])}\n` +
    `framework_layers:\n${meta.layers.map((item) => `  - ${yaml(item)}`).join("\n")}\n` +
    `signal_type: "Research Result"\n` +
    `maturity_level: "Infrastructure"\n` +
    `time_horizon: "Now"\n` +
    `evidence_quality: "Audited or Verified Data"\n` +
    `verification_status: "Verified Against Primary Source"\n` +
    `why_it_matters: "A report-and-recommendation crosswalk creates a stable follow-through rail for current GAO status and agency response."\n` +
    `dependencies:\n  - "exact report and recommendation identity"\n  - "affected component"\n  - "later GAO status evidence"\n` +
    `constraints:\n  - "Regulation"\n  - "Data Quality"\n  - "Public Trust"\n` +
    `receiving_systems:\n  - "Phase 56Q recommendation identity and agency-response crosswalk"\n` +
    `local_implications:\n  - "Agency response cannot be converted into implementation, closure, performance, readiness, safety, value, or causation."\n` +
    `evidence_gap_ids:\n${meta.gaps.map((item) => `  - ${yaml(item)}`).join("\n")}\n` +
    `claim_scope: "Specific Source Update"\n` +
    `local_evidence_level: "General Source Layer"\n` +
    `last_reviewed_date: ${capturedDate}\n` +
    `---\n\n` +
    `## Resolution\n\n${decision}. ${identity ? `The official identity is ${identity}.` : `The candidates are ${candidateText}.`}\n\n` +
    `## Agency response\n\n${match.response}\n\n` +
    `## Evidence boundary\n\nAn agency response is not implementation. GAO recommendation status is not the Phase 56F evidence state, and recommendation closure would not by itself establish operating performance or outcome.\n`;
  await writeFile(join(contentRoot, "signals", `${signalId}.mdx`), body, "utf8");

  records.push({
    action_key: match.key,
    phase_56p_action_id: prior.action_id,
    entity_id: prior.entity_id,
    entity_name: prior.entity_name,
    coverage_id: prior.coverage_id,
    letter_id: prior.letter_id,
    letter_action_text: prior.action_text,
    resolution_decision: decision,
    report_id: match.report,
    recommendation_number: match.hold ? null : match.rec,
    official_identity: identity,
    candidate_recommendations: match.hold ? match.candidates.map((candidate) => ({ report_id: match.report, recommendation_number: candidate.rec, official_identity: `${match.report} Recommendation ${candidate.rec}`, summary: candidate.summary, current_status: match.status })) : [],
    official_url: source.url,
    source_id: source.id,
    affected_component: match.affected,
    recommendation_summary: match.recommendation,
    current_status: match.status,
    agency_response_summary: match.response,
    last_update_period: match.asOf,
    identity_basis: match.hold ? "The local action text spans two separately numbered recommendations on the official GAO product page." : "The local action text and the official recommendation directive are a one-to-one substantive match.",
    response_boundary: "Agency response does not establish implementation or closure.",
    continuation_rule: continuation,
    record_status: recordStatus,
    document_id: documentId,
    signal_id: signalId,
  });
}

const exactRecords = records.filter((record) => record.resolution_decision === "Exact one-to-one");
const heldRecords = records.filter((record) => record.resolution_decision === "Held — one-to-many");
const sourceIds = [...sourceByReport.values()].map((source) => source.id);
const documentIds = records.map((record) => record.document_id);
const signalIds = records.map((record) => record.signal_id);

await writeJson(join(dataRoot, "phase-56q-recommendation-identity-crosswalk.json"), {
  phase: "56Q",
  captured_date: capturedDate,
  matching_rule: "Publish only exact one-to-one matches between a Phase 56P local action and an official GAO report-and-recommendation number. Hold one-to-many mappings.",
  official_identity_rule: "The official identity is the GAO report number plus the recommendation number displayed on the official product page. FTFN does not invent a separate opaque database identifier.",
  response_rule: "Agency response, concurrence, planned work, submission, or an artifact under review is not implementation or closure.",
  prior_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  post_batch_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  closure_changes: [],
  exact_matches: exactRecords.length,
  held_local_actions: heldRecords.length,
  held_candidate_recommendations: heldRecords.reduce((sum, record) => sum + record.candidate_recommendations.length, 0),
  official_status_counts_for_exact_matches: {
    Open: exactRecords.filter((record) => record.current_status === "Open").length,
    "Open – Partially Addressed": exactRecords.filter((record) => record.current_status === "Open – Partially Addressed").length,
  },
  inherited_hold: priorLedger.inherited_hold,
  contextual_records_retained: priorLedger.contextual_records_retained,
  records,
});

await writeJson(join(dataRoot, "phase-56q-publication-review.json"), {
  phase: "56Q",
  reviewed_date: capturedDate,
  local_actions_checked: records.length,
  exact_one_to_one_matches: exactRecords.length,
  one_to_many_holds: heldRecords.map((record) => record.action_key),
  candidate_recommendations_inside_holds: heldRecords.reduce((sum, record) => sum + record.candidate_recommendations.length, 0),
  new_source_profiles: sourceIds.length,
  document_decisions: { reviewed: documentIds.length, promoted: exactRecords.map((record) => record.document_id), held: heldRecords.map((record) => record.document_id) },
  signal_decisions: { reviewed: signalIds.length, promoted: exactRecords.map((record) => record.signal_id), held: heldRecords.map((record) => record.signal_id) },
  closure_decision: "No Phase 56F evidence-state changes. Recommendation identity and response evidence deepen follow-through but do not close entity-level evidence gaps.",
  inherited_hold: priorLedger.inherited_hold,
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "GAO Recommendation Identity and Agency-Response Crosswalk, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56Q resolves twenty Phase 56P action keys to exact official GAO report-and-recommendation identities and holds two one-to-many mappings for decomposition.",
  scope: "Twenty-two DOE, HHS, DOT, and VA action keys: twenty exact one-to-one identities, two held local actions, and four recommendation candidates inside those holds.",
  captured_date: capturedDate,
  document_ids: documentIds,
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-five-file archive contains twenty-two action-specific official-link records, consolidated summaries, a README, and a machine-readable checksum manifest.",
  method_note: "Each record preserves the local action key, official report, recommendation number or hold, affected component, current GAO status, agency response, last visible update period, limitation, and continuation rule. Agency response is not implementation; recommendation status is not the Phase 56F entity evidence ledger or an operating outcome.",
});

const briefing = `---\n` +
  `id: ${yaml(briefingId)}\n` +
  `title: "Research Watch 021: GAO Recommendation Identity and Agency Response"\n` +
  `slug: "research-watch-021-gao-recommendation-identity-agency-response"\n` +
  `record_status: "Published"\n` +
  `summary: "Phase 56Q resolves twenty local action keys to exact GAO report-and-recommendation identities and holds two one-to-many mappings."\n` +
  `published_date: ${capturedDate}\n` +
  `captured_date: ${capturedDate}\n` +
  `signal_ids:\n${signalIds.map((id) => `  - ${yaml(id)}`).join("\n")}\n` +
  `evidence_gap_ids:\n  - "gap-008"\n  - "gap-015"\n  - "gap-016"\n` +
  `claim_scope: "Editorial Synthesis"\n` +
  `local_evidence_level: "General Source Layer"\n` +
  `last_reviewed_date: ${capturedDate}\n` +
  `top_takeaways:\n` +
  `  - "Twenty of twenty-two local actions resolve one-to-one to an official GAO report and recommendation number."\n` +
  `  - "HHS-04 and VA-02 remain In Review because each local action combines two official recommendations."\n` +
  `  - "Eighteen exact matches are Open and two are Open – Partially Addressed on their official product pages."\n` +
  `  - "Agency responses and promised dates do not establish implementation or closure."\n` +
  `  - "The Phase 56F evidence ledger remains one Closed, twenty-one Partially Closed, and two Open."\n` +
  `constraint_watch:\n  - "Data Quality"\n  - "Regulation"\n  - "Public Trust"\n` +
  `what_to_watch_next:\n` +
  `  - "Status changes and implementation artifacts for the twenty exact recommendations."\n` +
  `  - "Recommendation-specific child records for HHS-04 and VA-02."\n` +
  `  - "Operating outcomes attributable to implemented recommendations rather than planned agency responses."\n` +
  `---\n\n` +
  `## Exact identity resolution\n\nTwenty action keys now have a direct official identity: a GAO report number and recommendation number shown together on the current product page. FTFN does not invent a separate opaque database ID.\n\n` +
  `## Held mappings\n\nHHS-04 combines ${matches.find((item) => item.key === "HHS-04").report} Recommendations 1 and 2. VA-02 combines ${matches.find((item) => item.key === "VA-02").report} Recommendations 1 and 2. Both stay In Review until recommendation-specific child records preserve the split.\n\n` +
  `## Response and outcome boundary\n\nEighteen exact recommendations are Open and two are Open – Partially Addressed. Those statuses and the associated agency responses support follow-through, not implementation, closure, agency performance, operating outcome, value, or causation. The Phase 56F ledger therefore remains unchanged.\n`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-01-phase-56q-gao-recommendation-identity-agency-response.json"), {
  id: "update-2026-08-01-phase-56q-gao-recommendation-identity-agency-response",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56Q publishes a GAO recommendation identity and agency-response crosswalk",
  summary: "FTFN resolves twenty action keys to exact official recommendation identities and holds HHS-04 and VA-02 as one-to-many mappings.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-021-gao-recommendation-identity-agency-response/",
    ...records.map((record) => `/signals/${record.signal_id.replace(/^signal-/, "")}/`),
  ],
  evidence_note: "Official identity, agency response, implementation, recommendation closure, Phase 56F evidence state, and operating outcome remain distinct.",
  work_package: "docs/work-packages/phase-56q-gao-recommendation-identity-agency-response-resolution.md",
});

console.log(`Generated Phase 56Q: ${sourceIds.length} official sources, ${exactRecords.length} exact matches, ${heldRecords.length} held mappings, twenty-two documents and signals, one collection, Research Watch 021, two ledgers, and one update.`);
