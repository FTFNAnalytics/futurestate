import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "gao-custodian-exact-artifact-recovery-batch-one-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-025-exact-artifact-recovery-batch-one";
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

const phase56t = JSON.parse(await readFile(join(dataRoot, "phase-56t-official-response-acquisition-artifact-sufficiency-queue.json"), "utf8"));
const tickets = phase56t.records.filter((record) => record.decision_class === "Missing-document acquisition ticket");
if (tickets.length !== 8) throw new Error(`Phase 56U requires eight Phase 56T acquisition tickets; found ${tickets.length}.`);

const agencyMeta = {
  DOE: { topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-008", "gap-016"] },
  HHS: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
  DOT: { topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  VA: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
};

const sources = [
  {
    id: "source-56u-doe-fy2027-gao-ig-act",
    name: "DOE FY 2027 Volume 2 GAO-IG Act Required Reporting",
    url: "https://www.energy.gov/documents/doe-fy-2027-volume-2-gao-ig-act",
    owner: "U.S. Department of Energy",
    agency: "DOE",
    access: "Data Download",
    limitation: "The congressional submission records DOE's recommendation status and estimated completion dates as of October 1, 2025. It does not reproduce the underlying life-cycle estimate, disposal analyses, pause decision, or prerequisite package, and DOE's own closure label does not replace GAO's current status.",
  },
  {
    id: "source-56u-hhs-all-hazards-plan-catalog",
    name: "ASPR TRACIE Catalog Record for the 2024 HHS All-Hazards Plan",
    url: "https://asprtracie.hhs.gov/technical-resources/resource/12791/department-of-health-and-human-services-all-hazards-plan",
    owner: "U.S. Department of Health and Human Services, Administration for Strategic Preparedness and Response",
    agency: "HHS",
    access: "Report Series",
    limitation: "The live catalog confirms a department-wide emergency operations plan and links to the official plan. It is not the 2026 after-action standard operating procedures or an exercise or response after-action report; the linked PDF endpoint was unavailable during this bounded pass.",
  },
  {
    id: "source-56u-dot-fy2026-annual-performance-plan",
    name: "DOT FY 2026 Annual Performance Plan",
    url: "https://www.transportation.gov/sites/dot.gov/files/DOT_FY%202026_Annual_Performance_Plan-508.pdf",
    owner: "U.S. Department of Transportation",
    agency: "DOT",
    access: "Data Download",
    limitation: "The plan identifies the FY 2025 Enterprise Risk Profile and department-wide management challenges, but it does not publish the January 2026 ERM guidance, operating-administration risk profiles, or a grant-agreement risk method.",
  },
  {
    id: "source-56u-dot-fy2025-agency-financial-report",
    name: "DOT FY 2025 Agency Financial Report",
    url: "https://www.transportation.gov/sites/dot.gov/files/2026-01/FY2025DOTAFR_508c_0.pdf",
    owner: "U.S. Department of Transportation",
    agency: "DOT",
    access: "Data Download",
    limitation: "The report describes DOT's enterprise-risk process and selected high-level risks. It expressly limits public discussion of sensitive risks and does not expose the recommendation-specific January 2026 guidance or full grant-agreement risk profile.",
  },
  {
    id: "source-56u-dot-grants-financial-assistance-office",
    name: "DOT Office of Grants and Financial Assistance",
    url: "https://www.transportation.gov/office-grants-and-financial-assistance",
    owner: "U.S. Department of Transportation",
    agency: "DOT",
    access: "Interactive Portal",
    limitation: "The page identifies the department-wide grants policy custodian and its role. It does not publish the January 2026 ERM guidance, operating-administration profiles, or evidence that risks in signing grant agreements were comprehensively assessed and monitored.",
  },
  {
    id: "source-56u-va-category-management-training",
    name: "VA Acquisition Academy Program Management School",
    url: "https://department.va.gov/acquisition-academy/program-management-school/",
    owner: "U.S. Department of Veterans Affairs, Acquisition Academy",
    agency: "VA",
    access: "Interactive Portal",
    limitation: "The page confirms a current VA category-management course and describes demand and vendor management. It does not publish the expected 180-day letter, category-specific savings goals, baselines, methods, or tracked progress.",
  },
  {
    id: "source-56u-dod-fy2026-dhra-budget",
    name: "DOD FY 2026 Defense Human Resources Activity Budget Estimates",
    url: "https://comptroller.defense.gov/Portals/45/Documents/defbudget/FY2026/budget_justification/pdfs/01_Operation_and_Maintenance/O_M_VOL_1_PART_1/DHRA_OP-5.pdf",
    owner: "U.S. Department of Defense, Defense Human Resources Activity",
    agency: "VA",
    access: "Data Download",
    limitation: "The budget identifies transition-program governance, evaluation work, metrics, and the VA-DOD Joint Executive Committee. It does not publish the Joint Transition Task Force draft assessment, identified gaps or overlaps, or recommended changes.",
  },
];

for (const source of sources) {
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
    notes: `Phase 56U custodian-level exact-artifact recovery source. Collection: ${collectionSlug}.`,
  });
}

const specs = {
  "DOE-01": {
    title: "DOE-01: Congressional status found; exact life-cycle estimate not acquired",
    resultClass: "Recommendation-specific agency status located; exact target artifact not acquired",
    sourceIds: ["source-56u-doe-fy2027-gao-ig-act"],
    finding: "DOE's FY 2027 congressional submission lists Recommendation 1 as open, corrective actions ongoing, and an estimated completion date of September 2026 as of October 1, 2025. GAO's newer April 2026 update instead records a December 2026 estimate. Neither surface publishes the life-cycle cost estimate.",
    nearMatches: [
      { source_id: "source-56u-doe-fy2027-gao-ig-act", locator: "Appendix 1, page 9", relation: "Recommendation-specific DOE status and estimated completion date", why_not_exact: "The table does not contain the life-cycle estimate, its GAO-aligned method, or uncertainty analysis." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "DOE FY 2027 GAO-IG Act congressional submission", "DOE OSTI", "DOE NEPA repository", "NNSA program and budget records", "DOE and NNSA public reading-room surfaces"],
    nextAction: "Recheck after the current GAO-recorded December 2026 estimate milestone or when NNSA publishes a recommendation-specific estimate or attachment.",
  },
  "DOE-02": {
    title: "DOE-02: Response substance is public; exact 180-day letter and analyses are not",
    resultClass: "Recommendation-specific agency status located; exact target artifact not acquired",
    sourceIds: ["source-56u-doe-fy2027-gao-ig-act"],
    finding: "GAO's current page describes DOE's April 2026 180-day response, including partial concurrence and DOE's assertion that site-level analyses make the recommendation complete. DOE's congressional status table records the recommendation as open and corrective actions ongoing. The exact letter and cited analyses remain absent from the bounded public surfaces.",
    nearMatches: [
      { source_id: "source-56u-doe-fy2027-gao-ig-act", locator: "Appendix 1, page 15", relation: "Recommendation-specific DOE status and April 2026 estimated completion date", why_not_exact: "The table does not reproduce the 180-day letter, complex-wide analysis, alternatives model, or optimal-strategy basis." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "DOE FY 2027 GAO-IG Act congressional submission", "DOE Environmental Management reports", "DOE OSTI", "DOE NEPA repository", "DOE public reading-room surfaces"],
    nextAction: "Monitor DOE Environmental Management and GAO for a public copy or attachment containing the April 2026 letter and its cited analyses.",
  },
  "DOE-05": {
    title: "DOE-05: DOE self-reported completion conflicts with GAO's open status",
    resultClass: "Recommendation-specific agency status located; exact target artifact not acquired",
    sourceIds: ["source-56u-doe-fy2027-gao-ig-act"],
    finding: "DOE's FY 2027 congressional submission labels Recommendation 3 closed and says corrective actions were completed in January 2025. GAO's current page says the recommendation remains open and DOE had taken no action as of February 2026. The underlying pause decision and prerequisite analysis were not acquired, so FTFN retains GAO's status and records the agency-GAO conflict without resolving it.",
    nearMatches: [
      { source_id: "source-56u-doe-fy2027-gao-ig-act", locator: "Appendix 1, page 13", relation: "Recommendation-specific DOE closure assertion", why_not_exact: "The table does not provide a pause decision, prerequisite package, independent analysis, or GAO acceptance." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "DOE FY 2027 GAO-IG Act congressional submission", "Hanford project records", "DOE Environmental Management reports", "DOE NEPA repository", "DOE public reading-room surfaces"],
    nextAction: "Reopen on a public pause decision, prerequisite package, independent analysis, or explicit GAO status change; retain the agency-GAO disagreement meanwhile.",
    agencyStatusConflict: true,
  },
  "HHS-04-R1": {
    title: "HHS-04-R1: All-Hazards Plan is a near-match; the 2026 SOP remains unavailable",
    resultClass: "Current official near-match reviewed; exact target artifact not acquired",
    sourceIds: ["source-56u-hhs-all-hazards-plan-catalog"],
    finding: "ASPR TRACIE's current catalog confirms the 2024 HHS All-Hazards Plan and department-wide response coordination. The cataloged plan predates the SOPs described by GAO in January 2026, and the linked PDF endpoint was unavailable during this pass. Neither the exact SOP nor an implementation after-action report was acquired.",
    nearMatches: [
      { source_id: "source-56u-hhs-all-hazards-plan-catalog", locator: "Resource description and official plan link", relation: "Department-wide emergency coordination plan", why_not_exact: "It is not the 2026 after-action SOP and does not demonstrate the SOP in use through a qualifying AAR." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "HHS FOIA Library", "HHS Guidance Portal", "ASPR TRACIE resource catalog", "ASPR legal publications", "HHS component reading rooms"],
    nextAction: "Monitor the HHS FOIA Library, Guidance Portal, ASPR TRACIE, and GAO for the exact SOP or a response or exercise AAR that demonstrates component collaboration.",
  },
  "HHS-04-R2": {
    title: "HHS-04-R2: Public plan catalog does not expose the stakeholder-participation SOP",
    resultClass: "Current official near-match reviewed; exact target artifact not acquired",
    sourceIds: ["source-56u-hhs-all-hazards-plan-catalog"],
    finding: "The current ASPR TRACIE catalog provides a live official record for HHS's 2024 All-Hazards Plan, but it does not expose the later external-stakeholder after-action SOP described by GAO. No public exercise or response AAR was found that shows how relevant external stakeholders were selected and included.",
    nearMatches: [
      { source_id: "source-56u-hhs-all-hazards-plan-catalog", locator: "Resource description and official plan link", relation: "Broad coordinated emergency-response framework", why_not_exact: "The catalog does not provide the 2026 stakeholder-participation SOP, participant-selection process, or an implementation AAR." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "HHS FOIA Library", "HHS Guidance Portal", "ASPR TRACIE resource catalog", "ASPR legal publications", "HHS component reading rooms"],
    nextAction: "Monitor the named HHS and ASPR repositories for the exact stakeholder SOP or a qualifying AAR; do not infer participation from a broad emergency plan.",
  },
  "DOT-05": {
    title: "DOT-05: Three public ERM records do not expose the January 2026 guidance",
    resultClass: "Current official near-match reviewed; exact target artifact not acquired",
    sourceIds: ["source-56u-dot-fy2026-annual-performance-plan", "source-56u-dot-fy2025-agency-financial-report", "source-56u-dot-grants-financial-assistance-office"],
    finding: "DOT's FY 2026 performance plan names grant stewardship and grantee capacity among department-wide challenges, its FY 2025 financial report describes the enterprise-risk cycle, and the grants office page identifies the policy custodian. None publishes the January 2026 ERM guidance, operating-administration risk profiles, or the full grant-agreement risk identification, rating, monitoring, and response method.",
    nearMatches: [
      { source_id: "source-56u-dot-fy2026-annual-performance-plan", locator: "Major Management Priorities and Challenges, page 10", relation: "Enterprise Risk Profile informs FY 2026 management challenges", why_not_exact: "It does not contain the January guidance or grant-agreement risk method." },
      { source_id: "source-56u-dot-fy2025-agency-financial-report", locator: "Enterprise Risk Management section", relation: "Department-wide ERM cycle and selected public risks", why_not_exact: "It omits the recommendation-specific guidance and full risk profiles." },
      { source_id: "source-56u-dot-grants-financial-assistance-office", locator: "Office overview", relation: "Named department-wide grants policy custodian", why_not_exact: "The page describes authority, not the January 2026 guidance or implementation evidence." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "OST Electronic Reading Room", "DOT FY 2026 Annual Performance Plan", "DOT FY 2025 Agency Financial Report", "DOT grants policy pages", "DOT component policy libraries"],
    nextAction: "Monitor OST, the grants office, and GAO for the January 2026 guidance, an OA risk-profile attachment, or a public enterprise assessment covering grant-agreement risks.",
  },
  "VA-04": {
    title: "VA-04: Current category-management training does not contain the expected response letter",
    resultClass: "Current official near-match reviewed; exact target artifact not acquired",
    sourceIds: ["source-56u-va-category-management-training"],
    finding: "VA's Acquisition Academy now publicly describes category-management training, including demand and vendor management. The current GAO page still says it will update after VA provides its expected spring 2026 180-day letter. No letter, category-specific savings goals, baselines, method, or progress register was acquired.",
    nearMatches: [
      { source_id: "source-56u-va-category-management-training", locator: "FCL-VA 0302, VA Category Management", relation: "Current role-oriented category-management training", why_not_exact: "The course description does not contain the 180-day response, savings goals, baselines, methods, or tracked progress." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "VA Publications", "VA plans and performance portal", "VA budget portal", "VA Acquisition Academy", "VA acquisition and logistics policy pages"],
    nextAction: "Monitor GAO and VA acquisition surfaces for the 180-day letter or a goal register with baselines, methods, ownership, and progress reporting.",
  },
  "VA-05": {
    title: "VA-05: Transition-program budget detail does not publish the Joint Task Force assessment",
    resultClass: "Current official near-match reviewed; exact target artifact not acquired",
    sourceIds: ["source-56u-dod-fy2026-dhra-budget"],
    finding: "DOD's FY 2026 Defense Human Resources Activity budget identifies transition-program governance, evaluation, assessment, metrics, and VA-DOD Joint Executive Committee coordination. It does not publish the Joint Transition Task Force draft assessment, its identified gaps or overlap, or recommended changes. GAO continues to record planned completion in December 2026.",
    nearMatches: [
      { source_id: "source-56u-dod-fy2026-dhra-budget", locator: "Military-Civilian Transition Office, pages 20-21 and 70-73", relation: "Current transition governance, evaluation, and performance architecture", why_not_exact: "It does not contain the task force draft, gap or overlap findings, or recommended changes." },
    ],
    searchSurfaces: ["Current GAO recommendation page", "VA plans and performance portal", "VA publications", "DOD Comptroller budget materials", "DOD transition-program records", "VA-DOD Joint Executive Committee public records"],
    nextAction: "Recheck at the December 2026 milestone or when the Joint Executive Committee, DOD, VA, or GAO publishes the assessment or an explicit status update.",
  },
};

const records = tickets.map((ticket, index) => {
  const spec = specs[ticket.action_key];
  if (!spec) throw new Error(`Missing Phase 56U specification for ${ticket.action_key}.`);
  const agency = ticket.parent_action_key.split("-")[0];
  const slug = ticket.signal_id.replace(/^signal-56t-/, "");
  const newSourceUrls = spec.sourceIds.map((id) => sources.find((source) => source.id === id)?.url).filter(Boolean);
  return {
    ...ticket,
    record_id: `record-56u-${slug}`,
    phase: "56U",
    phase_56t_record_id: ticket.record_id,
    record_relationship: "Phase 56T missing-document acquisition ticket recovery result",
    document_id: `research-doc-56u-${slug}`,
    signal_id: `signal-56u-${slug}`,
    document_number: 533 + index,
    title: spec.title,
    result_class: spec.resultClass,
    exact_target_artifact_acquired: false,
    target_artifact_public_copy_status: "Not acquired in bounded public pass",
    current_official_near_matches: spec.nearMatches,
    near_match_count: spec.nearMatches.length,
    new_recovery_source_ids: spec.sourceIds,
    search_surfaces: spec.searchSurfaces,
    exact_title_and_custodian_queries: [...new Set([...ticket.search_terms, ticket.target_artifact, ticket.likely_custodian])],
    official_repository_result: spec.finding,
    directive_scope_change: false,
    directive_matrix: ticket.directive_matrix,
    current_visible_scope: {
      supported: ticket.public_supported_elements,
      partial: ticket.public_partially_supported_elements,
      not_established: ticket.public_unestablished_elements,
    },
    agency_status_conflict: spec.agencyStatusConflict ?? false,
    implementation_change: false,
    closure_change: false,
    contact_or_foia_submitted: false,
    search_completion_state: "Bounded public pass complete; reopen on named trigger",
    stop_rule: "Stop this public pass after the current GAO page, named custodian surfaces, congressional or budget records, agency reading rooms, and relevant program repositories have been checked. A failed public search is not a nonexistence finding.",
    reopening_trigger: ticket.reopening_trigger,
    next_action: spec.nextAction,
    authority_boundary: "Agency status, a near-match, or an FTFN recovery record is not GAO acceptance, implementation, closure, entity evidence, or an operating outcome.",
    located_source_ids: [...new Set([...ticket.located_source_ids, ...spec.sourceIds])],
    located_official_urls: [...new Set([...ticket.located_official_urls, ...newSourceUrls])],
    captured_date: capturedDate,
    agency,
  };
});

const resultCounts = records.reduce((counts, record) => ({ ...counts, [record.result_class]: (counts[record.result_class] ?? 0) + 1 }), {});
const ledger = {
  phase: "56U",
  captured_date: capturedDate,
  goal: "Run a custodian-level exact-title recovery pass for all eight Phase 56T acquisition tickets and publish exact artifacts or bounded public-repository results.",
  public_search_rule: "No FTFN agency contact or FOIA request was submitted. Public repository searches and routing notes are not agency requests, responses, or evidence of nonexistence.",
  authority_rule: "GAO retains recommendation-acceptance and closure authority on the cited product pages. Agency self-assessments and FTFN recovery records remain separately labeled.",
  ticket_count: records.length,
  exact_target_artifacts_acquired: records.filter((record) => record.exact_target_artifact_acquired).length,
  near_matches_reviewed: records.reduce((sum, record) => sum + record.near_match_count, 0),
  result_class_counts: resultCounts,
  agency_status_conflicts: records.filter((record) => record.agency_status_conflict).map((record) => record.action_key),
  directive_scope_changes: records.filter((record) => record.directive_scope_change).map((record) => record.action_key),
  implementation_changes: records.filter((record) => record.implementation_change).map((record) => record.action_key),
  closure_changes: records.filter((record) => record.closure_change).map((record) => record.action_key),
  post_batch_closure_counts: phase56t.post_batch_closure_counts,
  prior_visible_scope: phase56t.scope_element_counts,
  post_batch_visible_scope: phase56t.scope_element_counts,
  records,
};
await writeJson(join(dataRoot, "phase-56u-custodian-exact-artifact-recovery-batch-one.json"), ledger);

const review = {
  phase: "56U",
  captured_date: capturedDate,
  decision_rule: "Publish a recovery result only when it names the searched public surfaces, exact-target outcome, near-match reason, stop rule, reopening trigger, and authority boundary.",
  new_source_profiles: sources.length,
  exact_target_artifacts_acquired: 0,
  near_matches_reviewed: ledger.near_matches_reviewed,
  document_decisions: { promoted: records.map((record) => record.document_id), held: [] },
  signal_decisions: { promoted: records.map((record) => record.signal_id), held: [] },
  boundary_checks: [
    "No failed search is described as proof that an artifact does not exist, was withheld, or was never submitted.",
    "No search term, custodian route, or repository pass is described as an agency contact or submitted FOIA request.",
    "No agency self-assessment or FTFN recovery result overrides GAO's current recommendation status.",
    "No result establishes performance, readiness, safety, savings, value, ranking, score, or causation.",
  ],
};
await writeJson(join(dataRoot, "phase-56u-publication-review.json"), review);

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const sourceUrls = record.new_recovery_source_ids.map((id) => sources.find((source) => source.id === id)?.url).filter(Boolean);
  const doc = {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: "Published",
    publisher: "Named U.S. government agencies and the U.S. Government Accountability Office",
    publication_date: null,
    document_type: "Oversight Report",
    summary: `${record.official_identity} received a custodian-level exact-title public recovery pass. The target artifact was not acquired; ${record.near_match_count} current official near-match${record.near_match_count === 1 ? " was" : "es were"} reviewed without changing directive scope, implementation, or closure.`,
    key_findings: [
      `Result class: ${record.result_class}.`,
      `Target artifact: ${record.target_artifact}.`,
      `Likely custodian: ${record.likely_custodian}.`,
      `Official repository result: ${record.official_repository_result}`,
      ...record.current_official_near_matches.map((item) => `Near-match: ${item.relation}. Locator: ${item.locator}. Why not exact: ${item.why_not_exact}`),
      `Visible scope remains ${record.current_visible_scope.supported} supported, ${record.current_visible_scope.partial} partial, and ${record.current_visible_scope.not_established} not established.`,
      `Next action: ${record.next_action}`,
    ],
    why_it_matters: "The recovery batch shows which official records were actually located, why each is or is not the target artifact, and exactly when the ticket should reopen.",
    ftfn_relevance: [
      `Preserves ${record.action_key} and its exact recommendation identity.`,
      "Turns a custodian search into a reproducible public record without implying an agency request.",
      "Keeps agency statements, FTFN scope, GAO acceptance, implementation, closure, and outcomes separate.",
    ],
    evidence_limits: [
      "Not publicly acquired does not mean nonexistent, withheld, or never submitted.",
      "A public near-match does not establish the missing directive elements or substitute for the target artifact.",
      "FTFN's recovery result does not substitute for GAO's recommendation-sufficiency or closure decision.",
      "Document evidence does not establish performance, readiness, safety, savings, value, ranking, composite score, or causation.",
    ],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: [...new Set([...record.repository_source_ids, ...record.new_recovery_source_ids])],
    supporting_official_urls: sourceUrls,
    official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${String(record.document_number - 532).padStart(2, "0")}-${record.document_id.replace(/^research-doc-56u-/, "")}.txt`,
    archive_member: `official-links/${String(record.document_number - 532).padStart(2, "0")}-${record.document_id.replace(/^research-doc-56u-/, "")}.txt`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  };
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-${record.document_id.replace(/^research-doc-/, "")}.json`), doc);

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: "Published"\n+summary: ${JSON.stringify(`Custodian-level recovery for ${record.official_identity} found ${record.near_match_count} official near-match${record.near_match_count === 1 ? "" : "es"}, but not the exact target artifact.`)}\n+${yamlList("source_ids", [...new Set([record.source_id, ...record.repository_source_ids, ...record.new_recovery_source_ids])])}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Audited or Verified Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: "The record distinguishes an exact artifact from a recommendation-specific status table, plan, budget, training page, or other near-match."\n+${yamlList("dependencies", ["exact recommendation identity", "named custodian", "public repository result", "GAO acceptance"])}\n+${yamlList("constraints", ["Regulation", "Data Quality", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 56U custodian-level exact-artifact recovery batch one"])}\n+${yamlList("local_implications", ["Do not convert a failed search, agency status, or near-match into nonexistence, implementation, closure, performance, or outcome."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+---\n+\n+## Recovery result\n+\n+${record.official_repository_result}\n+\n+Exact target artifact acquired: **No**. No agency contact or FOIA request was submitted by FTFN.\n+\n+## Official near-matches reviewed\n+\n+${record.current_official_near_matches.map((item) => `- **${item.relation}:** ${item.locator}. ${item.why_not_exact}`).join("\n")}\n+\n+## Search boundary\n+\n+Searched surfaces: ${record.search_surfaces.join("; ")}.\n+\n+${record.stop_rule}\n+\n+Reopen when: ${record.reopening_trigger}\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary} Visible directive scope remains ${record.current_visible_scope.supported} supported, ${record.current_visible_scope.partial} partial, and ${record.current_visible_scope.not_established} not established.\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/\n\+/g, "\n"), "utf8");

  const linkRecord = [
    record.title,
    "",
    `Action key: ${record.action_key}`,
    `Official identity: ${record.official_identity}`,
    `GAO page: ${record.official_url}`,
    `Target artifact: ${record.target_artifact}`,
    `Likely custodian: ${record.likely_custodian}`,
    `Exact artifact acquired: no`,
    `Result class: ${record.result_class}`,
    "",
    "Public surfaces checked:",
    ...record.search_surfaces.map((item) => `- ${item}`),
    "",
    "Exact-title and custodian queries:",
    ...record.exact_title_and_custodian_queries.map((item) => `- ${item}`),
    "",
    "Official near-matches:",
    ...record.current_official_near_matches.flatMap((item) => [`- ${item.relation}`, `  Source: ${item.source_id}`, `  Locator: ${item.locator}`, `  Why not exact: ${item.why_not_exact}`]),
    "",
    `Finding: ${record.official_repository_result}`,
    `Stop rule: ${record.stop_rule}`,
    `Reopening trigger: ${record.reopening_trigger}`,
    `Next action: ${record.next_action}`,
    `Authority boundary: ${record.authority_boundary}`,
    "FTFN submitted no agency contact or FOIA request in this pass.",
    "",
  ].join("\n");
  await writeFile(join(archiveRoot, doc.archive_member), linkRecord, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "GAO Custodian-Level Exact-Artifact Recovery Batch One, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56U publishes eight bounded custodian-level recovery results, seven new official source profiles, ten reviewed near-matches, and one explicit agency-GAO status conflict.",
  scope: "DOE, HHS, DOT, and VA exact-title and custodian searches across congressional submissions, reading rooms, plans, budgets, policy pages, and current GAO recommendation records.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The eleven-file archive contains eight recovery records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "No exact target artifact was acquired. A public near-match or agency status is not GAO acceptance, implementation, closure, performance, or outcome, and no FTFN agency contact or FOIA request was submitted.",
});

const allSignalIds = records.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 025: Exact-Artifact Recovery Batch One"\n+slug: "research-watch-025-exact-artifact-recovery-batch-one"\n+record_status: "Published"\n+summary: "Phase 56U completes the first custodian-level public recovery pass for all eight Phase 56T acquisition tickets."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", allSignalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", [
  "All eight tickets received exact-title and custodian-level searches across named public repositories.",
  "No exact target artifact was acquired; ten current official near-matches were recorded with a specific reason each is not the target.",
  "DOE's congressional submission says DOE-05 is closed, while GAO says it remains open; FTFN retains GAO's authoritative status.",
  "No directive scope, implementation, closure, or entity evidence state changed, and no FTFN agency contact or FOIA request was submitted.",
])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Exact artifacts or attachments released by named custodians", "GAO status changes or explicit remaining-deficiency language", "December 2026 DOE and VA-DOD milestones"])}\n+---\n+\n+## What Phase 56U adds\n+\n+The eight Phase 56T acquisition tickets now have a first custodian-level recovery result. Each record identifies the exact target, searched public surfaces, near-matches, why those near-matches are not exact, a stop rule, a reopening trigger, and the next public check.\n+\n+## Recovery outcome\n+\n+No exact target artifact was acquired. Three DOE tickets gained recommendation-specific congressional status context; five tickets gained current official near-match reviews. One DOE self-reported closure conflicts with GAO's current open status and remains explicitly unresolved.\n+\n+## Evidence boundary\n+\n+A failed public search does not prove nonexistence, withholding, or a failure to submit. A search is not an agency contact or FOIA request. Agency status, FTFN scope, GAO acceptance, implementation, closure, entity evidence, and operating outcomes remain separate.\n+`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefing.replace(/\n\+/g, "\n"), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56u-custodian-exact-artifact-recovery.json"), {
  id: "update-2026-08-02-phase-56u-custodian-exact-artifact-recovery",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56U completes exact-artifact recovery batch one",
  summary: "FTFN completes eight bounded custodian-level public searches, records ten official near-matches and one agency-GAO status conflict, and retains every implementation, closure, and outcome boundary.",
  affected_record_ids: [collectionId, briefingId, ...allSignalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-025-exact-artifact-recovery-batch-one/", ...allSignalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact was acquired, no FTFN agency contact or FOIA request was submitted, and no search or near-match establishes nonexistence, GAO acceptance, implementation, closure, or outcome.",
  work_package: "docs/work-packages/phase-56u-custodian-exact-artifact-recovery-batch-one.md",
});

await writeFile(join(archiveRoot, "README.md"), `# Phase 56U exact-artifact recovery batch one\n\nThis archive contains eight public-repository recovery records plus consolidated summaries. No FTFN agency contact or FOIA request was submitted. No exact target artifact was acquired in this bounded pass. A failed search does not establish nonexistence, and an agency statement or FTFN record does not replace GAO acceptance or closure.\n`, "utf8");

console.log(`Generated Phase 56U: ${records.length} recovery records, ${ledger.near_matches_reviewed} official near-matches, ${sources.length} source profiles, zero exact target artifacts, and an eleven-file archive tree.`);
