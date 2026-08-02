import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "gao-recommendation-implementation-artifact-milestone-ledger-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-022-recommendation-implementation-artifacts-milestones";
const archiveRoot = join(appRoot, "public", "downloads", collectionSlug);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [
  `${name}:`,
  ...items.map((item) => `  - ${JSON.stringify(item)}`),
].join("\n");
const cleanText = (value) => typeof value === "string"
  ? value.replaceAll("â€“", "–").replaceAll("â€”", "—").replaceAll("â€™", "’")
  : value;

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

const agencyMeta = {
  DOE: { topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-008", "gap-016"] },
  HHS: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
  DOT: { topics: ["Mobility", "Aviation", "Policy and Standards"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  VA: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
};

const artifactSources = [
  {
    id: "source-56r-faa-flight-plan-2026",
    name: "FAA Flight Plan 2026",
    url: "https://www.faa.gov/newsroom/flight-plan2026.pdf",
    topics: ["Aviation", "Mobility", "Policy and Standards"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    owner: "Federal Aviation Administration",
    limitation: "This public strategy names activities and goals, but it is not the controller-process performance dashboard that GAO is reviewing and does not establish implementation of GAO-26-107320 Recommendation 3.",
  },
  {
    id: "source-56r-faa-air-traffic-controller-workforce-plan-2026-2028",
    name: "FAA Air Traffic Controller Workforce Plan 2026–2028",
    url: "https://www.faa.gov/sites/faa.gov/files/Air-Traffic-Controller-Workforce-Plan-2026-2028.pdf",
    topics: ["Aviation", "Mobility", "Policy and Standards"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    owner: "Federal Aviation Administration",
    limitation: "The workforce plan is a public operating artifact, not GAO acceptance of the separate performance-dashboard evidence or proof that recruiting, hiring, and training processes have been fully assessed.",
  },
  {
    id: "source-56r-faa-drone-normalization-strategy-update-2026",
    name: "FAA Drone Normalization Strategy Report Update 2026",
    url: "https://www.faa.gov/uas/resources/Drone_Normalization_Strategy_Report_Update_2026.pdf",
    topics: ["Aviation", "Mobility", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    owner: "Federal Aviation Administration",
    limitation: "The public strategy is relevant to GAO-23-105189 and GAO-26-107648, but the current GAO pages do not record it as sufficient implementation evidence for either recommendation.",
  },
  {
    id: "source-56r-dot-automated-vehicle-framework-2025",
    name: "DOT Automated Vehicle Framework, 2025",
    url: "https://www.transportation.gov/briefing-room/trumps-transportation-secretary-sean-duffy-unveils-new-automated-vehicle-framework",
    topics: ["Mobility", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    owner: "U.S. Department of Transportation",
    limitation: "GAO reviewed DOT's framework and related initiatives but still reported that DOT lacked the comprehensive department-wide plan required by GAO-18-132 Recommendation 1.",
  },
  {
    id: "source-56r-va-notice-24-08-acquisition-lifecycle-framework",
    name: "VA Notice 24-08: Establishment of the Veterans Affairs Acquisition Lifecycle Framework",
    url: "https://www.va.gov/VAPUBS/viewPublication.asp?FType=2&Pub_ID=1494",
    topics: ["Human Futures", "Policy and Standards", "Finance and Risk"],
    layers: ["Human Systems", "Enabling Infrastructure"],
    owner: "U.S. Department of Veterans Affairs",
    limitation: "The notice establishes the framework but does not show that VA finalized and implemented every governance, workforce, cost, alignment, and compliance action GAO said remained open.",
  },
];

for (const source of artifactSources) {
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id,
    name: source.name,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: source.topics,
    framework_layers: source.layers,
    country_or_region: "United States",
    update_frequency: "Event Driven",
    capture_priority: "High",
    known_limitations: source.limitation,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: source.url.endsWith(".pdf") ? "Data Download" : "Release Page",
    review_cadence_days: 45,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government",
    source_owner: source.owner,
    notes: `Phase 56R public implementation-artifact source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  { key: "DOE-01", stage: "Promised", artifact: "Life-cycle cost estimate", detail: "NNSA had not completed a conforming estimate; GAO reports a revised expected date of December 2026.", availability: "Not yet completed or publicly linked on the GAO page", milestone: "December 2026", milestoneState: "Future monitor", review: "Not submitted", gap: "A complete estimate aligned with GAO cost-estimating best practices.", next: "Recheck the official GAO page after the December 2026 estimate milestone." },
  { key: "DOE-02", stage: "Submitted", artifact: "April 2026 180-day letter and cited analyses", detail: "DOE partially concurred and considered its action complete; GAO said the required complex-wide optimization analysis was still missing.", availability: "Described on the GAO page; no separate public response artifact linked", milestone: null, milestoneState: "No named date", review: "GAO says submitted material is incomplete", gap: "A complex-wide analysis that compares waste-disposal alternatives and identifies an optimal strategy.", next: "Recheck for a complex-wide analysis or a GAO status change." },
  { key: "DOE-03", stage: "No conforming artifact reported", artifact: "Strategic Petroleum Reserve Long-Term Strategic Review", detail: "DOE said it would conduct the review on a five-year cycle, but GAO reported in February 2026 that the review was not finalized.", availability: "No completed review linked on the GAO page", milestone: "Fiscal year 2021", milestoneState: "Elapsed without conforming artifact", review: "No completed artifact reported", gap: "A finalized periodic review with timely cost-and-benefit information for Congress.", next: "Recheck when DOE finalizes a periodic review or GAO changes the recommendation status." },
  { key: "DOE-04", stage: "Submitted", artifact: "OCED compliance-oversight framework and independent-assessment policy", detail: "DOE reported a framework and policy, but GAO said the policy did not require the specified external independent assessments outside OCED.", availability: "Described on the GAO page; no separate public artifact located", milestone: null, milestoneState: "No named date", review: "GAO says artifact scope is incomplete", gap: "A requirement for external independent reviews across all covered large nuclear demonstration projects and decision points.", next: "Recheck for a revised cross-office policy or GAO status change." },
  { key: "DOE-05", stage: "No conforming artifact reported", artifact: "Pause decision and prerequisite analysis", detail: "DOE did not concur and GAO reported that DOE had not implemented the recommended pause.", availability: "No implementation artifact reported", milestone: null, milestoneState: "No named date", review: "Agency nonconcurrence; no conforming action", gap: "The specified pause until prerequisites and consideration of an independent alternatives analysis are complete.", next: "Recheck only for an exact pause decision, prerequisite analysis, or GAO status change." },
  { key: "HHS-01", stage: "No conforming artifact reported", artifact: "Revised Medicare uncompensated-care payment methodology", detail: "HHS repeatedly reconsidered implementation; GAO reported no executive action through December 2025.", availability: "No implementation artifact reported", milestone: null, milestoneState: "No named date", review: "No conforming action reported", gap: "A methodology that accounts for Medicaid payments offsetting uncompensated-care costs.", next: "Recheck for an exact methodology change or GAO status change." },
  { key: "HHS-02", stage: "Partially addressed", artifact: "National risk tool, reorganization, and staffing actions", detail: "CMS created then suspended a risk and staffing-capacity tool and later changed organization and staffing; GAO still requires a national risk assessment.", availability: "Actions described on the GAO page; underlying tool is not linked", milestone: null, milestoneState: "No named date", review: "GAO classifies the recommendation Open – Partially Addressed", gap: "A current national Medicaid program-integrity risk assessment tied to oversight-resource allocation.", next: "Recheck for a completed national assessment and evidence that it informs resource allocation." },
  { key: "HHS-03", stage: "Promised", artifact: "HHS 180-day response letter", detail: "The current GAO page says the response letter is expected in summer 2026 and contains no later implementation update.", availability: "Not yet reflected on the GAO page", milestone: "Summer 2026", milestoneState: "Current seasonal monitor", review: "Response pending", gap: "A response and later evidence that CDC collects, analyzes, and uses jurisdiction capability information.", next: "Recheck after the summer 2026 response appears on the official GAO page." },
  { parent: "HHS-04", child: "HHS-04-R1", rec: 1, slug: "hhs-after-action-component-coordination", stage: "Partially addressed", artifact: "Department-wide after-action program standard operating procedures", detail: "HHS developed procedures for coordinating after-action work across component agencies; GAO is waiting for evidence from an exercise or response showing the procedures in use.", availability: "Described on the GAO page; no separate public SOP located", milestone: null, milestoneState: "No named date", review: "GAO classifies Recommendation 1 Open – Partially Addressed", gap: "An exercise or response after-action report demonstrating cross-component coordination under the procedures.", next: "Recheck for an after-action report that demonstrates Recommendation 1 in operation." },
  { parent: "HHS-04", child: "HHS-04-R2", rec: 2, slug: "hhs-after-action-external-stakeholder-participation", stage: "Partially addressed", artifact: "External-stakeholder after-action participation standard operating procedures", detail: "HHS developed procedures for including external stakeholders; GAO is waiting for evidence from an exercise or response showing the procedures in use.", availability: "Described on the GAO page; no separate public SOP located", milestone: null, milestoneState: "No named date", review: "GAO classifies Recommendation 2 Open – Partially Addressed", gap: "An exercise or response after-action report demonstrating relevant external-stakeholder participation.", next: "Recheck for an after-action report that demonstrates Recommendation 2 in operation." },
  { key: "DOT-01", stage: "No conforming artifact reported", artifact: "Quantitative mission-critical skill-gap assessment", detail: "FAA reported that the assessment was on hold because of reorganization and provided no completion schedule.", availability: "No completed assessment reported", milestone: null, milestoneState: "No scheduled completion", review: "No conforming artifact reported", gap: "A quantitative assessment covering all critical skills and mission-critical occupations.", next: "Recheck when FAA resumes and completes the assessment or GAO changes status." },
  { key: "DOT-02", stage: "Under GAO review", artifact: "Controller hiring and training performance dashboard plus 180-day response", detail: "DOT said it had developed an integrated performance dashboard; GAO is reviewing the dashboard documentation. FAA's public Flight Plan and workforce plan are supporting artifacts, not the dashboard acceptance record.", availability: "Two related public FAA plans located; dashboard documentation remains described on the GAO page", sources: ["source-56r-faa-flight-plan-2026", "source-56r-faa-air-traffic-controller-workforce-plan-2026-2028"], milestone: null, milestoneState: "No named GAO review date", review: "Artifact under GAO review", gap: "GAO confirmation that FAA uses integrated data to assess processes and inform improvements.", next: "Recheck the official GAO page for its dashboard-review decision." },
  { key: "DOT-03", stage: "Promised", artifact: "Discretionary Grants Lifecycle Management System and department-wide guidance", detail: "DOT planned a system and guidance to standardize reviews and document key decisions across grant programs.", availability: "Planned artifacts described on the GAO page; no completed system or guidance located", milestone: "October 2026", milestoneState: "Future monitor", review: "Implementation not yet submitted", gap: "A completed department-wide directive or equivalent system-and-guidance package satisfying all three directive elements.", next: "Recheck after the October 2026 completion target." },
  { key: "DOT-04", stage: "Promised", artifact: "Grants Transparency Dashboard and grant lifecycle system", detail: "DOT described systems targeted for the second quarter of fiscal year 2027; GAO said they do not replace the complete information Congress needs now.", availability: "Planned artifacts described on the GAO page", milestone: "Second quarter of fiscal year 2027", milestoneState: "Future monitor", review: "Recommendation remains unaddressed", gap: "Complete formula-versus-discretionary obligation and outlay information provided to Congress.", next: "Recheck for a congressional reporting artifact before or alongside the planned dashboard." },
  { key: "DOT-05", stage: "Submitted", artifact: "January 2026 enterprise-risk guidance and planned fiscal-year 2026 risk emphasis", detail: "DOT described risk guidance and planned operating-administration coverage, but GAO still reported that the recommendation was not addressed.", availability: "Described on the GAO page; separate guidance not linked", milestone: "Fiscal year 2026 cycle", milestoneState: "Active cycle", review: "GAO says submitted actions are incomplete", gap: "A portfolio-wide assessment identifying, rating, monitoring, and responding to grant-agreement risks.", next: "Recheck for the fiscal-year 2026 enterprise risk profile and GAO's scope assessment." },
  { key: "DOT-06", stage: "Promised", artifact: "FAA Drone Normalization Strategy Report Update 2026", detail: "A public updated strategy is available, but the current GAO page still records only FAA's plan to submit a revised strategy and does not record GAO acceptance.", availability: "Public official artifact located", sources: ["source-56r-faa-drone-normalization-strategy-update-2026"], milestone: "June 30, 2026", milestoneState: "Elapsed; GAO page has no review update", review: "GAO acceptance not recorded", gap: "GAO confirmation that the revised strategy contains all seven elements of a comprehensive strategy.", next: "Recheck the official GAO page for its review of the public updated strategy." },
  { key: "DOT-07", stage: "Promised", artifact: "BVLOS rulemaking, industry standards, phased deployment, and long-term research initiatives", detail: "FAA described near- and long-term actions; its public drone strategy provides context but GAO has not recorded implementation of the recommendation.", availability: "Public official strategy located; other actions remain described on the GAO page", sources: ["source-56r-faa-drone-normalization-strategy-update-2026"], milestone: "March 30, 2027", milestoneState: "Future monitor", review: "Initial actions not yet complete", gap: "Implemented actions with clear roles, estimated costs, and technical milestones for communication and detect-and-avoid capability.", next: "Recheck at material rule, standards, or March 2027 milestone changes." },
  { key: "DOT-08", stage: "Submitted", artifact: "DOT Automated Vehicle Framework and related initiatives", detail: "DOT publicly released a framework and pursued related actions; GAO said they still do not constitute the comprehensive plan required by the recommendation.", availability: "Public official artifact located", sources: ["source-56r-dot-automated-vehicle-framework-2025"], milestone: null, milestoneState: "No named date", review: "GAO says artifact scope is incomplete", gap: "One department-wide plan with goals, priorities, steps, milestones, and performance measures.", next: "Recheck for a comprehensive plan or GAO status change." },
  { key: "VA-01", stage: "Promised", artifact: "Revised VHA enterprise risk-management function", detail: "VA said restructuring would change oversight and planned a multi-year implementation; GAO still requires incorporation of all leading practices.", availability: "Planned actions described on the GAO page", milestone: "September 2028", milestoneState: "Future monitor", review: "Implementation not yet demonstrated", gap: "A risk-management function that fully incorporates all GAO leading practices.", next: "Recheck for interim policies and evidence before the September 2028 target." },
  { parent: "VA-02", child: "VA-02-R1", rec: 1, slug: "va-ehr-full-lifecycle-cost-estimate", stage: "Promised", artifact: "Independent total life-cycle cost estimate", detail: "VA planned an estimate only through the current Oracle Health contract ending May 2028; GAO said that does not cover the full modernization life cycle.", availability: "Planned artifact described on the GAO page; no full-life-cycle estimate located", milestone: "May 2028 contract horizon", milestoneState: "Future but scope-limited", review: "GAO says planned scope is insufficient", gap: "An updated independent estimate covering the full modernization life cycle and following GAO best practices.", next: "Recheck for a full-life-cycle estimate, not only a current-contract estimate." },
  { parent: "VA-02", child: "VA-02-R2", rec: 2, slug: "va-ehr-full-integrated-master-schedule", stage: "Promised", artifact: "Full-program integrated master schedule", detail: "VA planned a schedule only through the current Oracle Health contract ending May 2028; GAO said that does not cover the full modernization effort.", availability: "Planned artifact described on the GAO page; no full-program schedule located", milestone: "May 2028 contract horizon", milestoneState: "Future but scope-limited", review: "GAO says planned scope is insufficient", gap: "A reliable integrated master schedule covering the full modernization effort and following GAO best practices.", next: "Recheck for a full-program schedule, not only a current-contract deployment schedule." },
  { key: "VA-03", stage: "Partially addressed", artifact: "VA Notice 24-08 establishing the Acquisition Lifecycle Framework", detail: "The public notice establishes the framework, but GAO said VA still needed to finalize and implement its management structure and address the identified risks.", availability: "Public official artifact located; notice later expired without proving full implementation", sources: ["source-56r-va-notice-24-08-acquisition-lifecycle-framework"], milestone: null, milestoneState: "No current completion date", review: "GAO classifies the recommendation Open – Partially Addressed", gap: "A finalized and operating governance structure that addresses cost data, workforce, process alignment, and compliance.", next: "Recheck for the successor directive and evidence that the framework's governance mechanisms operate." },
  { key: "VA-04", stage: "Promised", artifact: "VA 180-day response letter", detail: "The current GAO page still says the letter was expected in spring 2026 and contains no later response or implementation artifact.", availability: "Not reflected on the current GAO page", milestone: "Spring 2026", milestoneState: "Elapsed; no response reflected", review: "Response pending on official record", gap: "Category-specific savings and cost-avoidance goals with tracked progress.", next: "Recheck when the official GAO page posts the response or implementation evidence." },
  { key: "VA-05", stage: "Promised", artifact: "Joint Transition Task Force draft effectiveness assessment", detail: "The task force developed a draft assessment and was consolidating feedback; planned completion remained December 2026.", availability: "Draft described on the GAO page; no separate public assessment located", milestone: "December 2026", milestoneState: "Future monitor", review: "Draft not accepted as implementation", gap: "A completed cross-department assessment and recommended changes addressing gaps, overlap, or duplication.", next: "Recheck after the December 2026 completion target or an earlier public assessment." },
];

const phase56q = JSON.parse(await readFile(join(dataRoot, "phase-56q-recommendation-identity-crosswalk.json"), "utf8"));
const qByKey = new Map(phase56q.records.map((record) => [record.action_key, record]));
const qExact = phase56q.records.filter((record) => record.resolution_decision === "Exact one-to-one");
if (qExact.length !== 20 || specs.length !== 24) throw new Error("Phase 56R requires twenty exact records plus four recommendation-specific children.");

const records = [];
for (const [index, spec] of specs.entries()) {
  const parentKey = spec.parent ?? spec.key;
  const parent = qByKey.get(parentKey);
  if (!parent) throw new Error(`Missing Phase 56Q parent ${parentKey}.`);
  const isChild = Boolean(spec.child);
  const actionKey = spec.child ?? spec.key;
  const rec = spec.rec ?? parent.recommendation_number;
  const identity = `${parent.report_id} Recommendation ${rec}`;
  const agency = parentKey.split("-")[0];
  const meta = agencyMeta[agency];
  const baseSlug = spec.slug ?? parent.signal_id.replace("signal-56q-", "");
  const slug = `56r-${baseSlug}`;
  const documentId = `research-doc-${slug}`;
  const signalId = `signal-${slug}`;
  const number = String(index + 1).padStart(2, "0");
  const supportingSourceIds = spec.sources ?? [];
  const supportingUrls = supportingSourceIds.map((id) => artifactSources.find((source) => source.id === id)?.url).filter(Boolean);
  const currentStatus = cleanText(parent.current_status);
  const lastUpdate = isChild ? "January 2026" : parent.last_update_period;
  const entityId = parent.entity_id;
  const entityName = parent.entity_name;
  const actionText = cleanText(isChild
    ? parent.candidate_recommendations.find((candidate) => candidate.recommendation_number === rec)?.summary ?? parent.letter_action_text
    : parent.letter_action_text);
  const continuation = `${spec.next} Preserve ${parentKey} as the parent crosswalk; do not translate an artifact, promise, submission, or GAO review into implementation, closure, or operating outcome.`;
  const archiveMember = `official-links/${number}-${baseSlug}.txt`;

  const record = {
    record_id: `record-56r-${baseSlug}`,
    action_key: actionKey,
    parent_action_key: parentKey,
    parent_phase_56q_record_status: parent.record_status,
    record_relationship: isChild ? "Recommendation-specific child" : "Recommendation-level continuation",
    entity_id: entityId,
    entity_name: entityName,
    coverage_id: parent.coverage_id,
    report_id: parent.report_id,
    recommendation_number: rec,
    official_identity: identity,
    official_url: parent.official_url,
    source_id: parent.source_id,
    supporting_source_ids: supportingSourceIds,
    supporting_official_urls: supportingUrls,
    affected_component: cleanText(parent.affected_component),
    action_text: actionText,
    current_status: currentStatus,
    last_update_period: lastUpdate,
    normalized_implementation_stage: spec.stage,
    response_artifact_type: spec.artifact,
    response_artifact_summary: spec.detail,
    artifact_availability: spec.availability,
    named_milestone: spec.milestone,
    milestone_state: spec.milestoneState,
    gao_review_state: spec.review,
    remaining_gap: spec.gap,
    continuation_rule: continuation,
    record_status: "Published",
    document_id: documentId,
    signal_id: signalId,
  };
  records.push(record);

  await writeJson(join(contentRoot, "research-documents", `${461 + index}-${slug}.json`), {
    id: documentId,
    collection_id: collectionId,
    title: `${actionKey}: ${identity} implementation artifact and milestone record`,
    slug,
    record_status: "Published",
    publisher: "U.S. Government Accountability Office",
    publication_date: capturedDate,
    document_type: "Oversight Report",
    summary: `${identity} remains ${currentStatus}. Its normalized follow-through state is ${spec.stage}; the record separates the named artifact, visibility, milestone, GAO review state, and remaining gap.`,
    key_findings: [
      `Parent crosswalk: ${parentKey}${isChild ? `; child record: ${actionKey}` : ""}.`,
      `Official identity: ${identity}.`,
      `Current GAO status: ${currentStatus}; status period: ${lastUpdate}.`,
      `Normalized implementation stage: ${spec.stage}.`,
      `Response artifact: ${spec.artifact}. ${spec.detail}`,
      `Artifact availability: ${spec.availability}.`,
      `Named milestone: ${spec.milestone ?? "None stated"}; milestone state: ${spec.milestoneState}.`,
      `GAO review state: ${spec.review}.`,
      `Remaining gap: ${spec.gap}`,
      `Continuation rule: ${continuation}`,
      ...supportingUrls.map((url) => `Public supporting artifact: ${url}`),
    ],
    why_it_matters: "Recommendation-specific follow-through makes it possible to distinguish a promise, an available artifact, a submission, GAO review, partial addressing, implementation, closure, and later operating outcomes.",
    ftfn_relevance: [
      `Preserves ${parentKey} as the parent crosswalk${isChild ? ` while publishing ${actionKey} as a recommendation-specific child` : ""}.`,
      "Records public artifact availability without treating availability as sufficiency or implementation.",
      "Keeps named dates as monitors that do not pause the active content queue.",
    ],
    evidence_limits: [
      "A promised milestone is a monitor, not implementation evidence.",
      "An agency artifact or submission is not implementation unless its scope satisfies the recommendation and the official record supports that conclusion.",
      "Open – Partially Addressed is an official recommendation status, not the Phase 56F Partially Closed entity evidence state.",
      "Recommendation closure would not by itself establish operating performance, readiness, safety, savings, value, or causation.",
    ],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: parent.source_id,
    supporting_source_ids: supportingSourceIds,
    supporting_official_urls: supportingUrls,
    official_url: parent.official_url,
    local_capture_path: `/downloads/${collectionSlug}/${archiveMember}`,
    archive_member: archiveMember,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  const signal = [
    "---",
    `id: ${JSON.stringify(signalId)}`,
    `title: ${JSON.stringify(`${actionKey}: ${spec.stage} for ${identity}`)}`,
    `slug: ${JSON.stringify(slug)}`,
    `record_status: "Published"`,
    `summary: ${JSON.stringify(`${identity} remains ${currentStatus}; ${spec.stage.toLowerCase()} evidence is bounded by the named artifact, GAO review state, and remaining gap.`)}`,
    yamlList("source_ids", [parent.source_id, ...supportingSourceIds]),
    `published_date: ${capturedDate}`,
    `captured_date: ${capturedDate}`,
    `primary_topic: ${JSON.stringify(meta.topics[0])}`,
    yamlList("framework_layers", meta.layers),
    `signal_type: "Research Result"`,
    `maturity_level: "Infrastructure"`,
    `time_horizon: "Now"`,
    `evidence_quality: "Audited or Verified Data"`,
    `verification_status: "Verified Against Primary Source"`,
    `why_it_matters: ${JSON.stringify("The record identifies exactly what exists, what GAO says about it, and what evidence is still missing.")}`,
    yamlList("dependencies", ["exact recommendation identity", "artifact scope", "GAO status history", "later implementation and outcome evidence"]),
    yamlList("constraints", ["Regulation", "Data Quality", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 56R recommendation implementation-artifact and milestone ledger"]),
    yamlList("local_implications", ["Do not convert a promise, public artifact, submission, or GAO review into implementation, closure, agency performance, or outcome."]),
    yamlList("evidence_gap_ids", meta.gaps),
    `claim_scope: "Specific Source Update"`,
    `local_evidence_level: "General Source Layer"`,
    `last_reviewed_date: ${capturedDate}`,
    "---",
    "",
    "## Implementation state",
    "",
    `${spec.stage}. ${spec.detail}`,
    "",
    "## Artifact and milestone",
    "",
    `**Artifact:** ${spec.artifact}. **Availability:** ${spec.availability}. **Milestone:** ${spec.milestone ?? "None stated"} (${spec.milestoneState}).`,
    "",
    "## Official review and remaining gap",
    "",
    `${spec.review}. Remaining gap: ${spec.gap}`,
    "",
    "## Evidence boundary",
    "",
    "A promise is a monitor, not evidence. An artifact is not implementation until its scope satisfies the recommendation and the official record supports that conclusion. Recommendation status, Phase 56F entity evidence state, closure, and operating outcome remain separate.",
    "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", `${signalId}.mdx`), signal, "utf8");
}

// Recover the original report publication dates from the Phase 56Q research documents.
for (const record of records) {
  const parent = qByKey.get(record.parent_action_key);
  const sourceDocumentFiles = await readdir(join(contentRoot, "research-documents"));
  const sourceFile = sourceDocumentFiles.find((name) => name.includes(parent.document_id.replace("research-doc-", "")));
  if (!sourceFile) continue;
  const sourceDocument = JSON.parse(await readFile(join(contentRoot, "research-documents", sourceFile), "utf8"));
  const targetFile = sourceDocumentFiles.find((name) => name.includes(record.document_id.replace("research-doc-", "")));
  const targetDocument = JSON.parse(await readFile(join(contentRoot, "research-documents", targetFile), "utf8"));
  targetDocument.publication_date = sourceDocument.publication_date;
  await writeJson(join(contentRoot, "research-documents", targetFile), targetDocument);
}

const countBy = (items, key) => items.reduce((counts, item) => ({ ...counts, [item[key]]: (counts[item[key]] ?? 0) + 1 }), {});
const ledger = {
  phase: "56R",
  captured_date: capturedDate,
  goal: "Decompose the two held parents and attach recommendation-specific response artifacts, visibility, named milestones, GAO review states, and remaining gaps to all twenty-four recommendation-level records.",
  state_rule: "Promised, submitted, under GAO review, partially addressed, implemented, closed, Phase 56F entity evidence state, and operating outcome are separate states.",
  parent_rule: "HHS-04 and VA-02 remain Phase 56P and Phase 56Q parent crosswalks; their four recommendation-specific children do not overwrite the parents.",
  artifact_rule: "A public or submitted artifact is not implementation until its scope satisfies the recommendation and the official record supports that conclusion.",
  milestone_rule: "A named date is a bounded monitor and never a reason to pause the active content queue.",
  recommendation_records: records.length,
  continued_exact_records: records.filter((record) => record.record_relationship === "Recommendation-level continuation").length,
  recommendation_specific_children: records.filter((record) => record.record_relationship === "Recommendation-specific child").length,
  public_artifact_sources_added: artifactSources.length,
  official_status_counts: countBy(records, "current_status"),
  normalized_stage_counts: countBy(records, "normalized_implementation_stage"),
  named_milestones: records.filter((record) => record.named_milestone).length,
  elapsed_milestones_without_official_acceptance: records.filter((record) => record.milestone_state.startsWith("Elapsed")).length,
  implementation_changes: [],
  closure_changes: [],
  prior_closure_counts: phase56q.post_batch_closure_counts,
  post_batch_closure_counts: phase56q.post_batch_closure_counts,
  inherited_hold: phase56q.inherited_hold,
  contextual_records_retained: phase56q.contextual_records_retained,
  records,
};
await writeJson(join(dataRoot, "phase-56r-implementation-artifact-milestone-ledger.json"), ledger);

const documentIds = records.map((record) => record.document_id);
const signalIds = records.map((record) => record.signal_id);
await writeJson(join(dataRoot, "phase-56r-publication-review.json"), {
  phase: "56R",
  reviewed_date: capturedDate,
  recommendation_records_reviewed: records.length,
  parent_records_preserved: ["HHS-04", "VA-02"],
  recommendation_specific_children_published: ["HHS-04-R1", "HHS-04-R2", "VA-02-R1", "VA-02-R2"],
  new_source_profiles: artifactSources.length,
  document_decisions: { reviewed: records.length, promoted: documentIds, held: [] },
  signal_decisions: { reviewed: records.length, promoted: signalIds, held: [] },
  implementation_decision: "No recommendation is represented as implemented or closed. Every record publishes as bounded status-and-artifact evidence.",
  closure_decision: "No Phase 56F entity evidence-state changes; the ledger remains one Closed, twenty-one Partially Closed, and two Open.",
  inherited_hold: phase56q.inherited_hold,
});

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "GAO Recommendation Implementation Artifact and Milestone Ledger, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56R publishes twenty-four recommendation-level follow-through records: twenty exact continuations and four children resolving the HHS-04 and VA-02 parent holds.",
  scope: "DOE, HHS, DOT, and VA recommendation-specific artifacts, public availability, milestones, GAO review states, remaining gaps, and continuation rules.",
  captured_date: capturedDate,
  document_ids: documentIds,
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-seven-file archive contains twenty-four recommendation-specific official-link records, consolidated summaries, a README, and a machine-readable checksum manifest.",
  method_note: "A promise is a monitor, not evidence. A public or submitted artifact is not implementation until its scope satisfies the recommendation and the official record supports that conclusion. Parent crosswalk, child identity, official status, Phase 56F evidence state, closure, and operating outcome remain distinct.",
});

const briefing = [
  "---",
  `id: ${JSON.stringify(briefingId)}`,
  `title: "Research Watch 022: Recommendation Implementation Artifacts and Milestones"`,
  `slug: "research-watch-022-recommendation-implementation-artifacts-milestones"`,
  `record_status: "Published"`,
  `summary: "Phase 56R resolves four recommendation-specific children and publishes a 24-record artifact, milestone, GAO-review, and remaining-gap ledger."`,
  `published_date: ${capturedDate}`,
  `captured_date: ${capturedDate}`,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  `claim_scope: "Editorial Synthesis"`,
  `local_evidence_level: "General Source Layer"`,
  `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "HHS-04 and VA-02 remain parent crosswalks while four recommendation-specific child records now publish.",
    "All twenty-four official recommendations remain Open or Open – Partially Addressed; none is represented as implemented or closed.",
    "Five separate public agency artifacts are now linked where official versions were available.",
    "Thirteen named milestones are tracked as monitors; three are elapsed without an official acceptance or closure record.",
    "The Phase 56F evidence ledger remains one Closed, twenty-one Partially Closed, and two Open.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", [
    "GAO review of FAA's controller-process dashboard documentation.",
    "Late-2026 DOE, DOT, HHS, and VA artifacts and official status changes.",
    "Recommendation implementation and operating-outcome evidence that is attributable and scoped to the exact directive.",
  ]),
  "---",
  "",
  "## Recommendation-specific resolution",
  "",
  "HHS-04 now has separate children for component coordination and external-stakeholder participation. VA-02 now has separate children for the full life-cycle cost estimate and the integrated master schedule. The Phase 56P and Phase 56Q parents remain intact as crosswalks.",
  "",
  "## Artifact and milestone ledger",
  "",
  "The ledger records what artifact is promised, described, public, submitted, or under GAO review; whether a milestone is future, active, or elapsed; and the remaining evidence gap. Five public agency artifacts are linked, while response materials that are merely described to GAO remain labeled as unavailable separately.",
  "",
  "## Evidence boundary",
  "",
  "No record is promoted to implemented or closed. A promise is not evidence, an artifact is not implementation without scope and official support, Open – Partially Addressed is not the Phase 56F Partially Closed state, and closure would not establish performance, readiness, safety, savings, value, or causation.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", `${briefingId}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56r-recommendation-implementation-artifacts-milestones.json"), {
  id: "update-2026-08-02-phase-56r-recommendation-implementation-artifacts-milestones",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56R publishes recommendation-specific implementation artifact and milestone follow-through",
  summary: "FTFN resolves four child recommendations and adds twenty-four bounded artifact, milestone, GAO-review, and remaining-gap records.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-022-recommendation-implementation-artifacts-milestones/",
    ...records.map((record) => `/signals/${record.signal_id.replace("signal-", "")}/`),
  ],
  evidence_note: "Promise, artifact availability, submission, GAO review, partial addressing, implementation, closure, Phase 56F entity evidence state, and operating outcome remain distinct.",
  work_package: "docs/work-packages/phase-56r-recommendation-implementation-artifact-milestone-follow-through.md",
});

console.log("Generated Phase 56R: 24 recommendation records, four child identities, five public artifact sources, one collection, Research Watch 022, and one update.");
