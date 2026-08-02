import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-01";
const collectionSlug = "agency-priority-recommendation-action-ledger-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-020-action-level-priority-recommendations";
const archiveRoot = join(appRoot, "public", "downloads", collectionSlug);
const linkRoot = join(archiveRoot, "official-links");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yaml = (value) => JSON.stringify(value);
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

await mkdir(join(contentRoot, "sources"), { recursive: true });
await mkdir(join(contentRoot, "research-documents"), { recursive: true });
await mkdir(join(contentRoot, "signals"), { recursive: true });
await mkdir(join(contentRoot, "research-collections"), { recursive: true });
await mkdir(join(contentRoot, "briefings"), { recursive: true });
await mkdir(join(contentRoot, "updates"), { recursive: true });
await mkdir(dataRoot, { recursive: true });
await mkdir(linkRoot, { recursive: true });

const agencies = {
  DOE: {
    name: "Department of Energy",
    entityId: "agency-doe",
    coverageId: "coverage-56f-doe",
    letterId: "GAO-26-109001",
    publicationDate: "2026-07-02",
    statusPeriod: "Open priority portfolio as of June 2026; letter dated July 2, 2026",
    sourceId: "source-56p-doe-priority-letter-full-report-2026",
    sourceUrl: "https://www.gao.gov/assets/gao-26-109001.pdf",
    sourceName: "GAO-26-109001 DOE Priority Recommendations: Full Report",
    topics: ["Energy", "Policy and Standards", "Finance and Risk"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    gaps: ["gap-008", "gap-016"],
  },
  HHS: {
    name: "Department of Health and Human Services",
    entityId: "agency-hhs",
    coverageId: "coverage-56f-hhs",
    letterId: "GAO-26-108997",
    publicationDate: "2026-06-03",
    statusPeriod: "Open priority portfolio as of May 2026; letter dated June 3, 2026",
    sourceId: "source-56p-hhs-priority-letter-full-report-2026",
    sourceUrl: "https://www.gao.gov/assets/gao-26-108997.pdf",
    sourceName: "GAO-26-108997 HHS Priority Recommendations: Full Report",
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    gaps: ["gap-016"],
  },
  DOT: {
    name: "Department of Transportation",
    entityId: "agency-dot",
    coverageId: "coverage-56f-dot",
    letterId: "GAO-26-109050",
    publicationDate: "2026-06-23",
    statusPeriod: "Open priority portfolio as of June 2026; letter dated June 23, 2026",
    sourceId: "source-56p-dot-priority-letter-full-report-2026",
    sourceUrl: "https://www.gao.gov/assets/gao-26-109050.pdf",
    sourceName: "GAO-26-109050 DOT Priority Recommendations: Full Report",
    topics: ["Mobility", "Aviation", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    gaps: ["gap-015", "gap-016"],
  },
  VA: {
    name: "Department of Veterans Affairs",
    entityId: "agency-va",
    coverageId: "coverage-56f-va",
    letterId: "GAO-26-108978",
    publicationDate: "2026-05-15",
    statusPeriod: "Open priority portfolio as of May 7, 2026; letter dated May 15, 2026",
    sourceId: "source-56p-va-priority-letter-full-report-2026",
    sourceUrl: "https://www.gao.gov/assets/gao-26-108978.pdf",
    sourceName: "GAO-26-108978 VA Priority Recommendations: Full Report",
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    gaps: ["gap-016"],
  },
};

const actions = [
  {
    agency: "DOE", key: "DOE-01", slug: "doe-pit-production-lifecycle-cost-estimate", subject: "Nuclear modernization",
    action: "NNSA should develop a life-cycle cost estimate for establishing plutonium-pit production capability that aligns with GAO cost-estimating best practices.",
    title: "DOE priority letter names a life-cycle cost estimate for plutonium-pit production",
    summary: "GAO's 2026 DOE priority letter identifies a best-practice life-cycle cost estimate for plutonium-pit production capability as an open priority action.",
  },
  {
    agency: "DOE", key: "DOE-02", slug: "doe-complex-wide-waste-disposal-analysis", subject: "Environmental liabilities",
    action: "DOE should develop complex-wide analyses that identify optimal waste-disposal strategies and alternatives.",
    title: "DOE priority letter names complex-wide waste-disposal analysis",
    summary: "GAO's 2026 DOE letter identifies complex-wide analysis of waste-disposal strategies and alternatives as an open priority action.",
  },
  {
    agency: "DOE", key: "DOE-03", slug: "doe-strategic-petroleum-reserve-periodic-reviews", subject: "Energy security",
    action: "DOE should conduct periodic Strategic Petroleum Reserve reviews that give Congress timely information on the costs and benefits of different reserve sizes.",
    title: "DOE priority letter names periodic Strategic Petroleum Reserve reviews",
    summary: "GAO identifies periodic reviews of Strategic Petroleum Reserve size, costs, and benefits as a current DOE priority action.",
  },
  {
    agency: "DOE", key: "DOE-04", slug: "doe-nuclear-demonstration-project-oversight", subject: "Program management",
    action: "DOE should improve oversight of its large nuclear-energy demonstration projects and the consistent use of project-management best practices.",
    title: "DOE priority letter names stronger nuclear-demonstration project oversight",
    summary: "GAO identifies improved oversight and consistent project-management practices for large nuclear demonstrations as a current DOE priority action.",
  },
  {
    agency: "DOE", key: "DOE-05", slug: "doe-hanford-waste-treatment-pause-conditions", subject: "Environmental management",
    action: "DOE should pause work at a Hanford waste-treatment facility until it completes named prerequisites, including considering an independent analysis of high-level waste-treatment options.",
    title: "DOE priority letter preserves Hanford waste-treatment pause conditions",
    summary: "GAO's 2026 DOE letter retains a bounded pause-and-analysis action for a Hanford waste-treatment facility.",
  },
  {
    agency: "HHS", key: "HHS-01", slug: "hhs-medicaid-offsets-medicare-hospital-payments", subject: "Medicare and Medicaid program integrity",
    action: "CMS should account for Medicaid payments that offset costs for uninsured or low-income care when making Medicare payments to individual hospitals.",
    title: "HHS priority letter names Medicaid offsets in Medicare hospital payments",
    summary: "GAO identifies accounting for specified Medicaid offset payments in Medicare hospital payments as a current CMS priority action.",
  },
  {
    agency: "HHS", key: "HHS-02", slug: "hhs-medicaid-oversight-national-risk-assessment", subject: "Medicaid oversight",
    action: "CMS should complete a national risk assessment so oversight resources can be tested for adequacy and allocated to the highest-risk areas.",
    title: "HHS priority letter names a national Medicaid oversight risk assessment",
    summary: "GAO identifies a national assessment of Medicaid oversight risk and resource allocation as a current CMS priority action.",
  },
  {
    agency: "HHS", key: "HHS-03", slug: "hhs-public-health-preparedness-capability-gaps", subject: "Public-health preparedness",
    action: "CDC should collect and analyze information on jurisdictions' ability to meet preparedness capabilities and the gaps in their ability to do so.",
    title: "HHS priority letter names jurisdiction-level preparedness capability evidence",
    summary: "GAO identifies collection and analysis of jurisdiction preparedness capabilities and gaps as a current CDC priority action.",
  },
  {
    agency: "HHS", key: "HHS-04", slug: "hhs-after-action-program-fragmentation", subject: "Emergency-response coordination",
    action: "HHS should better manage fragmentation in department-wide after-action programs used to identify and resolve recurring emergency-response challenges.",
    title: "HHS priority letter names fragmentation in department-wide after-action programs",
    summary: "GAO identifies department-wide after-action fragmentation as an open HHS action for recurring emergency-response challenges.",
  },
  {
    agency: "DOT", key: "DOT-01", slug: "dot-faa-mission-critical-skill-gap-data", subject: "Workforce gaps",
    action: "FAA should collect more comprehensive information for agency-wide workforce assessments of mission-critical skill gaps.",
    title: "DOT priority letter names stronger FAA mission-critical skill-gap data",
    summary: "GAO identifies more comprehensive FAA workforce information for mission-critical skill-gap assessments as a current priority action.",
  },
  {
    agency: "DOT", key: "DOT-02", slug: "dot-air-traffic-controller-workforce-processes", subject: "Air-traffic-controller workforce",
    action: "FAA should assess its processes to further improve recruitment, hiring, and training of air traffic controllers.",
    title: "DOT priority letter names an assessment of air-traffic-controller workforce processes",
    summary: "GAO identifies FAA recruitment, hiring, and training process assessment as a current air-traffic-controller workforce action.",
  },
  {
    agency: "DOT", key: "DOT-03", slug: "dot-discretionary-grant-department-wide-directive", subject: "Grant management",
    action: "DOT should issue a department-wide directive for discretionary grant programs requiring documented key decisions and alignment between policy priorities and application evaluation and selection.",
    title: "DOT priority letter names a department-wide discretionary-grant directive",
    summary: "GAO identifies a common documentation and policy-alignment directive for DOT discretionary grants as a current priority action.",
  },
  {
    agency: "DOT", key: "DOT-04", slug: "dot-iija-grant-status-reporting", subject: "Infrastructure grant transparency",
    action: "DOT should provide complete information to Congress on the status of Infrastructure Investment and Jobs Act grant funding.",
    title: "DOT priority letter names complete IIJA grant-status reporting",
    summary: "GAO identifies complete reporting to Congress on IIJA grant-funding status as a current DOT priority action.",
  },
  {
    agency: "DOT", key: "DOT-05", slug: "dot-grant-agreement-awardee-risk-assessment", subject: "Grant delivery risk",
    action: "DOT should assess risks that awardees, including state and local governments, face when signing grant agreements.",
    title: "DOT priority letter names awardee risk in signing grant agreements",
    summary: "GAO identifies assessment of state, local, and other awardee risks in executing grant agreements as a current DOT action.",
  },
  {
    agency: "DOT", key: "DOT-06", slug: "dot-faa-drone-integration-strategy", subject: "Drone integration",
    action: "FAA should develop a comprehensive strategy for integrating drones into the national airspace system.",
    title: "DOT priority letter names a comprehensive FAA drone-integration strategy",
    summary: "GAO identifies a comprehensive FAA drone-integration strategy as a current emerging-technology priority action.",
  },
  {
    agency: "DOT", key: "DOT-07", slug: "dot-faa-information-centric-airspace-milestones", subject: "Information-centric airspace",
    action: "FAA should develop and implement specific milestones for integrating drones into a future information-centric airspace.",
    title: "DOT priority letter names milestones for information-centric drone airspace",
    summary: "GAO identifies specific FAA milestones for future information-centric drone airspace as a current priority action.",
  },
  {
    agency: "DOT", key: "DOT-08", slug: "dot-automated-vehicle-initiative-plan", subject: "Automated vehicles",
    action: "DOT should develop and implement a comprehensive plan to better manage department-wide automated-vehicle initiatives.",
    title: "DOT priority letter names a comprehensive automated-vehicle initiative plan",
    summary: "GAO identifies a department-wide plan for managing automated-vehicle initiatives as a current DOT priority action.",
  },
  {
    agency: "VA", key: "VA-01", slug: "va-health-system-enterprise-risk-practices", subject: "Health-care access and quality",
    action: "VA should take steps to fully meet leading practices for managing risk across its health-care system.",
    title: "VA priority letter names enterprise health-system risk practices",
    summary: "GAO identifies full use of leading risk-management practices across VA's health-care system as a current priority action.",
  },
  {
    agency: "VA", key: "VA-02", slug: "va-ehr-lifecycle-cost-and-master-schedule", subject: "Electronic health-record modernization",
    action: "VA should independently update the total life-cycle cost estimate and integrated master schedule for its electronic health-record modernization effort.",
    title: "VA priority letter names independent EHR cost and schedule updates",
    summary: "GAO identifies independent updates to VA's EHR life-cycle cost estimate and integrated master schedule as a current priority action.",
  },
  {
    agency: "VA", key: "VA-03", slug: "va-major-acquisition-oversight-framework-risks", subject: "Acquisition management",
    action: "VA should address challenges that pose risks to the success of its framework for overseeing major acquisition programs.",
    title: "VA priority letter names risks in the major-acquisition oversight framework",
    summary: "GAO identifies unresolved risks to VA's framework for overseeing major acquisition programs as a current priority action.",
  },
  {
    agency: "VA", key: "VA-04", slug: "va-common-spend-savings-goals-tracking", subject: "Common goods and services",
    action: "VA should establish specific goals for cost avoidance and budget savings in common spending areas and track progress toward them.",
    title: "VA priority letter names savings goals and tracking for common spending",
    summary: "GAO identifies specific cost-avoidance and budget-savings goals, plus progress tracking, as a current VA priority action.",
  },
  {
    agency: "VA", key: "VA-05", slug: "va-dod-servicemember-transition-coordination", subject: "Military-to-civilian transition",
    action: "VA should coordinate with the Department of Defense to improve the transition of specified service members to civilian life.",
    title: "VA priority letter names stronger DoD coordination for civilian transition",
    summary: "GAO identifies VA-DoD coordination for selected service-member transitions as a current fragmentation-reduction action.",
  },
];

for (const [code, agency] of Object.entries(agencies)) {
  await writeJson(join(contentRoot, "sources", `${agency.sourceId}.json`), {
    id: agency.sourceId,
    name: agency.sourceName,
    url: agency.sourceUrl,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: agency.topics,
    framework_layers: agency.layers,
    country_or_region: "United States",
    update_frequency: "Annual",
    capture_priority: "High",
    known_limitations: `The ${agency.letterId} letter names selected open priority actions but does not provide the full recommendation inventory, underlying Recommendations Database identifiers, implementation evidence, or operating outcomes. FTFN ${code} action keys are local stable references, not GAO recommendation numbers.`,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: "Release Page",
    review_cadence_days: 60,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government",
    source_owner: "U.S. Government Accountability Office",
    notes: `Phase 56P full-report source. Collection: ${collectionSlug}.`,
  });
}

const records = [];
for (const [index, action] of actions.entries()) {
  const agency = agencies[action.agency];
  const n = String(index + 1).padStart(2, "0");
  const documentNumber = 417 + index;
  const documentId = `research-doc-56p-${action.slug}`;
  const signalId = `signal-56p-${action.slug}`;
  const archiveName = `${n}-${action.slug}.txt`;
  const actionId = `action-56p-${action.key.toLowerCase()}`;
  const continuation = `Recheck the GAO Recommendations Database or the next ${action.agency} priority letter for an exact identifier or status change tied to this action.`;
  const identityBoundary = `FTFN key ${action.key} identifies the action text in ${agency.letterId}; it is not a GAO Recommendations Database number.`;

  const linkText = [
    `FTFN Phase 56P action: ${action.key}`,
    `Agency: ${agency.name}`,
    `Official letter: ${agency.letterId}`,
    `Official PDF: ${agency.sourceUrl}`,
    `Subject: ${action.subject}`,
    `Action: ${action.action}`,
    `Status period: ${agency.statusPeriod}`,
    `Identity boundary: ${identityBoundary}`,
    `Continuation rule: ${continuation}`,
    "Publication decision: Published as a letter-named open priority action.",
    "Evidence boundary: The letter does not establish implementation, closure, performance, readiness, safety, value, or causation.",
    "",
  ].join("\n");
  await writeFile(join(linkRoot, archiveName), linkText, "utf8");

  await writeJson(join(contentRoot, "research-documents", `${documentNumber}-56p-${action.slug}.json`), {
    id: documentId,
    collection_id: collectionId,
    title: `${action.key}: ${action.title}`,
    slug: `56p-${action.slug}`,
    record_status: "Published",
    publisher: "U.S. Government Accountability Office",
    publication_date: agency.publicationDate,
    document_type: "Oversight Report",
    summary: `${action.summary} Phase 56P publishes the letter-named action while preserving its local identity boundary and open-status limit.`,
    key_findings: [
      `Coverage identity: ${agency.coverageId}.`,
      `Exact letter action: ${action.key} — ${action.action}`,
      `Status period: ${agency.statusPeriod}.`,
      `Identity boundary: ${identityBoundary}`,
      `Continuation rule: ${continuation}`,
    ],
    why_it_matters: "The record converts portfolio-level visibility into an inspectable named action without claiming implementation or importing an unsupported database identifier.",
    ftfn_relevance: [
      `Preserves stable entity identity ${agency.entityId}.`,
      `Preserves letter, subject, local action key, status period, and continuation identity.`,
      "Keeps priority designation, implementation, closure, operating outcome, and realized benefit distinct.",
    ],
    evidence_limits: [
      `The letter names the action but does not provide its underlying GAO Recommendations Database number or a complete ${action.agency} portfolio inventory.`,
      "Open priority designation does not prove non-performance, implementation progress, closure, or operating outcome.",
      "The local action key is an FTFN reference and must not be presented as a GAO-assigned recommendation number.",
      "No ranking, composite, readiness score, performance rate, value estimate, or causal claim is supported.",
    ],
    primary_topics: agency.topics,
    framework_layers: agency.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: agency.sourceId,
    official_url: agency.sourceUrl,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  const body = `---\n` +
    `id: ${yaml(signalId)}\n` +
    `title: ${yaml(action.title)}\n` +
    `slug: ${yaml(`56p-${action.slug}`)}\n` +
    `record_status: "Published"\n` +
    `summary: ${yaml(action.summary)}\n` +
    `source_ids:\n  - ${yaml(agency.sourceId)}\n` +
    `published_date: ${capturedDate}\n` +
    `captured_date: ${capturedDate}\n` +
    `primary_topic: ${yaml(agency.topics[0])}\n` +
    `framework_layers:\n${agency.layers.map((item) => `  - ${yaml(item)}`).join("\n")}\n` +
    `signal_type: "Research Result"\n` +
    `maturity_level: "Infrastructure"\n` +
    `time_horizon: "Now"\n` +
    `evidence_quality: "Audited or Verified Data"\n` +
    `verification_status: "Verified Against Primary Source"\n` +
    `why_it_matters: "The official letter turns a portfolio theme into a named action that can be followed through later status changes."\n` +
    `dependencies:\n  - "stable letter and agency identity"\n  - "exact action text"\n  - "later recommendation-level status evidence"\n` +
    `constraints:\n  - "Regulation"\n  - "Data Quality"\n  - "Public Trust"\n` +
    `receiving_systems:\n  - "Phase 56P action-level priority recommendation decomposition"\n` +
    `local_implications:\n  - "The action cannot be converted into agency performance, closure, readiness, or a realized-benefit claim."\n` +
    `evidence_gap_ids:\n${agency.gaps.map((item) => `  - ${yaml(item)}`).join("\n")}\n` +
    `claim_scope: "Specific Source Update"\n` +
    `local_evidence_level: "General Source Layer"\n` +
    `last_reviewed_date: ${capturedDate}\n` +
    `---\n\n` +
    `## Letter-named action\n\n${action.action}\n\n` +
    `## Identity boundary\n\n${identityBoundary}\n\n` +
    `## Evidence boundary\n\nThe ${agency.letterId} letter identifies this as part of the open priority portfolio but does not establish implementation, closure, operating performance, readiness, safety, value, or causation.\n`;
  await writeFile(join(contentRoot, "signals", `${signalId}.mdx`), body, "utf8");

  records.push({
    action_id: actionId,
    action_key: action.key,
    coverage_id: agency.coverageId,
    entity_id: agency.entityId,
    entity_name: agency.name,
    source_id: agency.sourceId,
    source_url: agency.sourceUrl,
    letter_id: agency.letterId,
    subject: action.subject,
    action_text: action.action,
    status_period: agency.statusPeriod,
    letter_state: "Open priority action named in the 2026 agency letter",
    identity_boundary: identityBoundary,
    decision: "Publish as a letter-named action without assigning an unsupported GAO recommendation number or implementation state.",
    remaining_gap: "Underlying GAO Recommendations Database identity, agency response, implementation evidence, closure state, and operating outcome.",
    reopening_rule: continuation,
    record_status: "Published",
    document_id: documentId,
    signal_id: signalId,
  });
}

const documentIds = records.map((record) => record.document_id);
const signalIds = records.map((record) => record.signal_id);
await writeJson(join(dataRoot, "phase-56p-action-recommendation-ledger.json"), {
  phase: "56P",
  captured_date: capturedDate,
  batch_rule: "Publish only action text explicitly named in the four prioritized 2026 agency letters; use local stable keys and do not invent GAO recommendation numbers or implementation states.",
  prior_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  post_batch_closure_counts: { closed: 1, partially_closed: 21, open: 2 },
  closure_changes: [],
  coverage_decisions: Object.entries(agencies).map(([code, agency]) => ({
    coverage_id: agency.coverageId,
    entity_id: agency.entityId,
    entity_name: agency.name,
    action_count: records.filter((record) => record.action_key.startsWith(`${code}-`)).length,
    prior_closure_status: "Partially Closed",
    current_closure_status: "Partially Closed",
    decision: "Retain Partially Closed. The letter supplies named actions but not the implementation or operating evidence required to close the selected Phase 56F gap.",
    reopening_rule: `Reopen when an exact GAO database record, agency response, or later ${code} priority letter changes a named action state.`,
  })),
  contextual_records_retained: [
    "record-56o-gsa-priority-portfolio-2026",
    "record-56o-ostp-priority-portfolio-2026",
    "record-56o-ntia-priority-portfolio-2026",
    "record-56o-gao-open-recommendations-benefit-model-2026",
  ],
  inherited_hold: {
    record_id: "record-56n-hhs-large-hospital-post-date-recheck",
    status: "In Review",
    reason: "The official HHS OIG tracker remained last updated July 22 with all four actions Open Unimplemented on the August 1 check.",
  },
  records,
});

await writeJson(join(dataRoot, "phase-56p-publication-review.json"), {
  phase: "56P",
  reviewed_date: capturedDate,
  exact_actions_checked: records.length,
  coverage_decisions: 4,
  contextual_portfolios_retained: 4,
  new_source_profiles: 4,
  document_decisions: { reviewed: documentIds.length, promoted: documentIds, held: [] },
  signal_decisions: { reviewed: signalIds.length, promoted: signalIds, held: [] },
  closure_decision: "No Phase 56F evidence-state changes. Twenty-two bounded letter-named actions publish; the inherited HHS tracker record remains In Review.",
  identity_rule: "FTFN agency action keys are stable local references and are never presented as GAO Recommendations Database numbers.",
  substitution_rule: "A letter-named priority action is not implementation, closure, operating performance, readiness, safety, value, or causation.",
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Agency Priority Recommendation Action Ledger, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56P decomposes four 2026 GAO agency letters into twenty-two stable letter-named actions while preserving local-key, status, implementation, closure, and outcome boundaries.",
  scope: "Five DOE, four HHS, eight DOT, and five VA actions explicitly named in current GAO priority-recommendation letters.",
  captured_date: capturedDate,
  document_ids: documentIds,
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-five-file archive contains twenty-two action-specific official-link records, consolidated summaries, a README, and a machine-readable manifest with checksums.",
  method_note: "Each record preserves agency, letter, subject, exact action text, local action key, status period, identity boundary, limitation, remaining gap, and continuation rule. Local keys are not GAO recommendation numbers.",
});

const briefing = `---\n` +
  `id: ${yaml(briefingId)}\n` +
  `title: "Research Watch 020: Action-Level Priority Recommendations"\n` +
  `slug: "research-watch-020-action-level-priority-recommendations"\n` +
  `record_status: "Published"\n` +
  `summary: "Phase 56P turns four agency portfolio letters into twenty-two stable action records without inventing recommendation numbers or implementation states."\n` +
  `published_date: ${capturedDate}\n` +
  `captured_date: ${capturedDate}\n` +
  `signal_ids:\n${signalIds.map((id) => `  - ${yaml(id)}`).join("\n")}\n` +
  `evidence_gap_ids:\n  - "gap-008"\n  - "gap-015"\n  - "gap-016"\n` +
  `claim_scope: "Editorial Synthesis"\n` +
  `local_evidence_level: "General Source Layer"\n` +
  `last_reviewed_date: ${capturedDate}\n` +
  `top_takeaways:\n` +
  `  - "Four current agency letters name twenty-two inspectable actions across energy, health, transportation, and veterans systems."\n` +
  `  - "DOE contributes five actions, HHS four, DOT eight, and VA five."\n` +
  `  - "FTFN action keys preserve stable local identity but are not GAO Recommendations Database numbers."\n` +
  `  - "All twenty-two records remain open priority actions; none is presented as implemented or closed."\n` +
  `  - "The inherited HHS hospital tracker hold remains unchanged."\n` +
  `constraint_watch:\n  - "Data Quality"\n  - "Regulation"\n  - "Public Trust"\n` +
  `what_to_watch_next:\n` +
  `  - "Underlying GAO Recommendations Database identities and agency responses for the twenty-two actions."\n` +
  `  - "Recommendation-level implementation or closure changes in later agency letters."\n` +
  `  - "Operating outcomes that can be attributed to completed actions."\n` +
  `---\n\n` +
  `## From portfolios to actions\n\nPhase 56P extracts only actions explicitly named in the four prioritized agency letters. The result is a twenty-two-record action ledger: five DOE, four HHS, eight DOT, and five VA. It does not claim that the letters list every current priority recommendation.\n\n` +
  `## Identity boundary\n\nEach action receives a stable FTFN key tied to its agency and letter. Those keys make follow-through inspectable but are not GAO Recommendations Database identifiers. The next evidence step is to attach an official underlying recommendation record, agency response, or later status change.\n\n` +
  `## Evidence boundary\n\nPriority designation, implementation, closure, portfolio movement, operating performance, service quality, safety, readiness, savings, and causation remain separate evidence types. The Phase 56F ledger remains one Closed, twenty-one Partially Closed, and two Open.\n`;
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-01-phase-56p-action-level-priority-recommendations.json"), {
  id: "update-2026-08-01-phase-56p-action-level-priority-recommendations",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56P publishes an action-level priority recommendation ledger",
  summary: "FTFN publishes twenty-two letter-named priority actions across DOE, HHS, DOT, and VA without inventing recommendation IDs or implementation states.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-020-action-level-priority-recommendations/",
    ...actions.map((action) => `/signals/56p-${action.slug}/`),
  ],
  evidence_note: "Letter-named action, GAO database identity, implementation, closure, operating outcome, and realized benefit remain distinct.",
  work_package: "docs/work-packages/phase-56p-action-level-priority-recommendation-decomposition.md",
});

console.log("Generated Phase 56P: four full-report sources, twenty-two action documents and Published signals, one collection, Research Watch 020, two ledgers, and one update.");
