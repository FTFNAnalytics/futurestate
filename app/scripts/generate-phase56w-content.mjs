import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "gao-named-record-retrieval-cross-lane-expansion-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-027-named-record-retrieval";
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

const phase56v = JSON.parse(await readFile(join(dataRoot, "phase-56v-second-order-recovery-leads-supporting-artifacts.json"), "utf8"));
if (phase56v.records.length !== 10 || phase56v.exact_target_artifacts_acquired !== 0) {
  throw new Error("Phase 56W requires the complete Phase 56V recovery-lead ledger.");
}
const parentByLead = new Map(phase56v.records.map((record) => [record.lead_id, record]));

const agencyMeta = {
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-008", "gap-016"] },
  HHS: { entity: "agency-hhs", topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  VA: { entity: "agency-va", topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
};

const sources = [
  {
    id: "source-56w-nnsa-fy2027-weapons-activities",
    name: "DOE FY 2027 Congressional Budget Request, Volume 1: National Nuclear Security Administration Weapons Activities",
    url: "https://www.energy.gov/documents/doe-fy-2027-volume-1-wa",
    owner: "U.S. Department of Energy, National Nuclear Security Administration",
    agency: "DOE",
    access: "Data Download",
    limitation: "The volume publishes detailed project and subproject cost tables, including the Los Alamos Plutonium Pit Production Project. It is not a complete multi-site pit-production capability life-cycle cost estimate and does not supply the recommendation-specific GAO-aligned method and uncertainty analysis.",
  },
  {
    id: "source-56w-hanford-dfhlw-amended-rod",
    name: "DOE Amended Record of Decision for Direct-Feed High-Level Waste",
    url: "https://www.energy.gov/sites/default/files/2025-10/amended-rod-eis-0391-sa-04-direct-feed-high-level-waste-2025-10.pdf",
    owner: "U.S. Department of Energy",
    agency: "DOE",
    access: "Data Download",
    limitation: "The October 2025 record selects continued Direct-Feed High-Level Waste implementation and additional storage capacity. It is a decision record but not the GAO-requested pause, independent optimization, mission-need reset, safety-prerequisite package, or GAO acceptance.",
  },
  {
    id: "source-56w-hanford-hlw-progress-july2026",
    name: "DOE EM: Partnerships Key to Progress at Hanford's High-Level Waste Facility",
    url: "https://www.energy.gov/em/articles/partnerships-key-progress-hanfords-high-level-waste-facility",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "The July 2026 article reports testing and design progress toward Direct-Feed High-Level Waste. It is agency-reported implementation status, not the independent analysis or pause-and-prerequisite decision package requested by GAO.",
  },
  {
    id: "source-56w-gao-va-health-transition-status-2025",
    name: "GAO-26-108786: DOD and VA Health Care — Actions Needed to Better Integrate the Departments' Health Care Systems",
    url: "https://www.gao.gov/assets/gao-26-108786.pdf",
    owner: "U.S. Government Accountability Office",
    agency: "VA",
    access: "Data Download",
    limitation: "The December 2025 testimony distinguishes the 2022 JEC inventory from an effectiveness assessment and reports that the recommendation remained unimplemented as of November 2025. It does not reproduce the FY 2025 guidance memo, Joint Operating Plan, TEC-HEC POAMM, or Joint Transition Task Force draft assessment.",
  },
  {
    id: "source-56w-gao-iija-ira-funding-status-2026",
    name: "GAO-26-108434: Infrastructure Investment and Jobs Act and Inflation Reduction Act — Status of Funding",
    url: "https://www.gao.gov/products/gao-26-108434",
    owner: "U.S. Government Accountability Office",
    agency: "DOT",
    access: "Report Series",
    limitation: "The July 2026 review aggregates selected funding status across four agencies, including DOT. It is not a DOT-only portfolio assessment and provides no evidence of a unified-grants award, baseline, data model, deployment, operating risk assessment, or control acceptance.",
  },
  {
    id: "source-56w-gao-hanford-law-grout-plans-2026",
    name: "GAO-26-108878: Hanford Waste Treatment — DOE's Plans for Low-Activity Waste Grouting",
    url: "https://www.gao.gov/products/gao-26-108878",
    owner: "U.S. Government Accountability Office",
    agency: "DOE",
    access: "Report Series",
    limitation: "The May 2026 report covers a planned low-activity-waste grouting procurement and cost range. Low-activity waste is distinct from the high-level-waste facility work and pause conditions addressed by GAO-24-106989.",
  },
  {
    id: "source-56w-gao-em-aging-infrastructure-2026",
    name: "GAO-26-107957: Nuclear Waste Cleanup — DOE Should Improve Infrastructure Planning and Data",
    url: "https://www.gao.gov/products/gao-26-107957",
    owner: "U.S. Government Accountability Office",
    agency: "DOE",
    access: "Report Series",
    limitation: "The May 2026 report documents Environmental Management infrastructure condition, maintenance costs, data inconsistencies, and planning gaps. It is a constraint record, not the Waste Disposal Office's April 2026 complex-wide alternatives analysis or optimal-strategy decision.",
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
    notes: `Phase 56W named-record retrieval and cross-lane expansion source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "va-jec-effectiveness-assessment-status",
    actionKey: "VA-05",
    parentLeadId: "lead-56v-10",
    agency: "VA",
    status: "Published",
    sourceId: "source-56w-gao-va-health-transition-status-2025",
    sourceIds: ["source-56w-gao-va-health-transition-status-2025", "source-56q-gao-24-106189-recommendation-status", "source-56v-va-fy2026-congressional-supplemental-appendices"],
    title: "VA-05: GAO separates the JEC inventory from the still-missing effectiveness assessment",
    recordType: "Named target retrieval",
    documentType: "Oversight Report",
    publicationDate: "2025-12-03",
    target: "FY 2025 JEC Co-Chair Priority Guidance Memorandum, Joint Operating Plan, TEC-HEC POAMM, and Joint Transition Task Force draft effectiveness assessment",
    finding: "GAO's December 2025 testimony states that the 2022 JEC work was an inventory, not the assessment of effectiveness called for by the recommendation, and that the recommendation remained unimplemented as of November 2025. The four named downstream artifacts remain publicly unacquired.",
    narrowing: "The public record now contains an authoritative inventory-versus-effectiveness distinction and a later GAO implementation status, while the exact guidance, plan, POAMM, and draft assessment remain separate retrieval targets.",
    limits: ["The testimony does not contain the four exact named records.", "The existence of a draft assessment does not establish consolidated feedback, final findings, recommended changes, joint follow-through, or GAO acceptance.", "The current GAO recommendation page later reports a December 2026 expected completion date; that dated milestone remains a bounded monitor."],
    next: "Retrieve the four named JEC records or a later GAO status update that reports their contents and remaining deficiencies.",
  },
  {
    slug: "dot-unified-grants-award-deployment-record",
    actionKey: "DOT-05",
    parentLeadId: "lead-56v-07",
    agency: "DOT",
    status: "In Review",
    sourceId: "source-56v-dot-unified-grants-lifecycle-procurement",
    sourceIds: ["source-56v-dot-unified-grants-lifecycle-procurement", "source-56q-gao-25-107166-recommendation-status"],
    title: "DOT-05: Unified-grants award, baseline, deployment, and operating assessment remain unacquired",
    recordType: "Named target retrieval",
    documentType: "Procurement Channel",
    publicationDate: null,
    target: "Authoritative unified-grants contract award, system baseline, data model, deployment record, and operating risk assessment",
    finding: "The official procurement forecast still identifies a planned $20 million to $50 million effort and states that the contract was not awarded on the displayed record. GAO's March 2026 update reports revised ERM guidance and a planned FY 2027 unified system, not an awarded or operating control.",
    narrowing: "The search remains anchored to opportunity 685586-2025-248 and its intended September 2025 to September 2030 performance window, but no exact award or deployment artifact was located.",
    limits: ["A forecast is not an award.", "Updated guidance is not a deployed common system or portfolio-wide operating assessment.", "The planned FY 2027 system date does not establish current implementation."],
    next: "Reopen on an authoritative award notice, system baseline, data model, deployment record, or operating portfolio-risk output.",
  },
  {
    slug: "doe-waste-disposal-optimal-strategy-analysis",
    actionKey: "DOE-02",
    parentLeadId: "lead-56v-02",
    agency: "DOE",
    status: "In Review",
    sourceId: "source-56q-gao-25-107109-recommendation-status",
    sourceIds: ["source-56q-gao-25-107109-recommendation-status", "source-56v-doe-em-mission-functions"],
    title: "DOE-02: Waste Disposal Office complex-wide analysis and optimal strategy remain unacquired",
    recordType: "Named target retrieval",
    documentType: "Technical Report",
    publicationDate: null,
    target: "April 2026 Waste Disposal Office complex-wide waste inventory, alternatives analysis, optimization model, and optimal-strategy basis",
    finding: "DOE's April 2026 response, as summarized by GAO, says that complex-wide analysis and an optimal strategy exist, but GAO retains the recommendation as Open. The exact analysis, model, alternatives comparison, and decision basis were not located as separate public records.",
    narrowing: "The custodian and claimed product are named, but the evidence needed to evaluate completeness, tradeoffs, and GAO's remaining concerns is still absent.",
    limits: ["An agency statement that analysis exists is not the analysis.", "GAO's Open status is not overwritten by DOE's view that the recommendation is complete.", "General EM infrastructure records do not substitute for a complex-wide waste-disposal optimization."],
    next: "Retrieve the April 2026 response attachments, complex-wide inventory, alternatives model, optimization criteria, and final decision basis.",
  },
  {
    slug: "nnsa-pit-production-project-cost-trail",
    actionKey: "DOE-01",
    parentLeadId: "lead-56v-01",
    agency: "DOE",
    status: "Published",
    sourceId: "source-56w-nnsa-fy2027-weapons-activities",
    sourceIds: ["source-56w-nnsa-fy2027-weapons-activities", "source-56q-gao-23-104661-recommendation-status"],
    title: "DOE-01: FY 2027 Weapons Activities publishes a narrower pit-production project cost trail",
    recordType: "Named target retrieval",
    documentType: "Budget Justification",
    publicationDate: "2026-05-01",
    target: "Complete multi-site pit-production capability life-cycle cost estimate using a GAO-aligned method and uncertainty analysis",
    finding: "The FY 2027 Weapons Activities volume provides detailed project and subproject cost tables for plutonium modernization, including a $5.879431 billion current total project cost for the Los Alamos Plutonium Pit Production Project. GAO still reports that a conforming complete capability estimate is expected in December 2026.",
    narrowing: "The search now has a detailed project-level cost baseline and page range inside the Weapons Activities volume, while the missing object is clearly the complete multi-site capability estimate rather than another individual project table.",
    limits: ["A project total is not the complete pit-production capability life-cycle estimate.", "The budget volume does not expose the recommendation-specific GAO-aligned method across all sites.", "Project tables do not provide the required capability-wide risk and uncertainty analysis."],
    next: "Track the December 2026 complete capability estimate and compare its scope, method, assumptions, and uncertainty treatment with the project-level FY 2027 tables.",
  },
  {
    slug: "hanford-dfhlw-decision-and-progress-record",
    actionKey: "DOE-05",
    parentLeadId: "lead-56v-03",
    agency: "DOE",
    status: "Published",
    sourceId: "source-56w-hanford-dfhlw-amended-rod",
    sourceIds: ["source-56w-hanford-dfhlw-amended-rod", "source-56w-hanford-hlw-progress-july2026", "source-56q-gao-24-106989-recommendation-status"],
    title: "DOE-05: Hanford's amended decision and July 2026 progress record confirm continued implementation",
    recordType: "Named target retrieval",
    documentType: "Regulatory Decision",
    publicationDate: "2025-10-21",
    target: "Post-recommendation pause decision, independent optimization analysis, mission-need reset, and safety-prerequisite completion package",
    finding: "DOE's October 2025 amended Record of Decision selects Direct-Feed High-Level Waste implementation and added storage, while DOE's July 2026 progress article reports testing and continued design advancement. GAO's February 2026 update still reports the pause and independent-analysis recommendations as Open.",
    narrowing: "The public decision trail now has an amended ROD and a current implementation-status record. Together they make the agency-GAO conflict explicit without supplying the distinct pause and prerequisite package.",
    limits: ["Continued implementation is not evidence of the requested pause.", "Agency progress reporting is not an independent optimization analysis.", "The amended decision does not establish GAO acceptance or closure of either recommendation."],
    next: "Retrieve the planned independent FFRDC analysis, any pause decision, mission-need reset, safety-prerequisite record, and later GAO sufficiency determination.",
  },
  {
    slug: "hhs-cross-component-after-action-report",
    actionKey: "HHS-04-R1",
    parentLeadId: "lead-56v-04",
    agency: "HHS",
    status: "In Review",
    sourceId: "source-56q-gao-24-106276-recommendation-status",
    sourceIds: ["source-56q-gao-24-106276-recommendation-status", "source-56v-hhs-aar-improvement-plan-template-catalog"],
    title: "HHS-04-R1: Completed department-wide cross-component AAR remains unacquired",
    recordType: "Named target retrieval",
    documentType: "Technical Report",
    publicationDate: null,
    target: "Completed department-wide exercise or response AAR citing the January 2026 SOP and documenting cross-component collaboration",
    finding: "GAO reports that HHS established a January 2026 SOP and was awaiting a qualifying exercise or response AAR for review. No completed department-wide AAR naming participating HHS components was located.",
    narrowing: "The missing evidence is now a completed use record, not another template or general emergency plan.",
    limits: ["An SOP is not evidence of use.", "A provider-oriented AAR template is not a department-wide cross-component AAR.", "Open—Partially Addressed remains the controlling GAO status."],
    next: "Retrieve the first completed AAR that cites the January 2026 SOP and documents participating HHS components, findings, corrective actions, and follow-through.",
  },
  {
    slug: "hhs-external-stakeholder-after-action-report",
    actionKey: "HHS-04-R2",
    parentLeadId: "lead-56v-05",
    agency: "HHS",
    status: "In Review",
    sourceId: "source-56q-gao-24-106276-recommendation-status",
    sourceIds: ["source-56q-gao-24-106276-recommendation-status", "source-56v-hhs-aar-improvement-plan-template-catalog"],
    title: "HHS-04-R2: Completed external-stakeholder participation AAR remains unacquired",
    recordType: "Named target retrieval",
    documentType: "Technical Report",
    publicationDate: null,
    target: "Completed department-wide AAR documenting relevant external-stakeholder selection, participation, challenges, solutions, and follow-through under the January 2026 SOP",
    finding: "GAO reports the January 2026 SOP as a partial response and is awaiting a qualifying use record. No completed AAR identifying external participants and the procedure used to include them was located.",
    narrowing: "The target is bounded to one completed department-wide implementation record that joins stakeholder-selection procedure to actual participation and corrective action.",
    limits: ["A generic AAR template does not define relevant stakeholder selection.", "An SOP without a completed use record does not establish implementation.", "Open—Partially Addressed remains the controlling GAO status."],
    next: "Retrieve the first qualifying AAR that identifies external participants, selection rationale, participation, findings, solutions, and accountable follow-through.",
  },
  {
    slug: "infrastructure-funding-review-status",
    actionKey: "DOT-CROSS-01",
    agency: "DOT",
    status: "Published",
    sourceId: "source-56w-gao-iija-ira-funding-status-2026",
    sourceIds: ["source-56w-gao-iija-ira-funding-status-2026"],
    title: "Cross-lane: GAO publishes a four-agency infrastructure funding-status review",
    recordType: "Compatible cross-lane expansion",
    documentType: "Oversight Report",
    publicationDate: "2026-07-22",
    target: "Current aggregate obligation, disbursement, approval, cancellation, and pending-project status for selected IIJA and IRA programs",
    finding: "GAO reports that the four selected agencies had obligated 76 percent of IIJA funding and disbursed 54 percent of obligated funds, with approximately 9,500 projects approved for $128 billion, 800 canceled for $17.8 billion, and 2,500 pending for $33.6 billion.",
    narrowing: "The report adds a current cross-agency infrastructure-funding status rail that can be compared over time without converting aggregate figures into a DOT-only portfolio result.",
    limits: ["The figures are aggregate across four selected agencies.", "The review is not evidence of DOT's unified-grants system or recommendation-specific operating control.", "Approval, obligation, disbursement, cancellation, and project completion are distinct states."],
    next: "Track later agency-specific funding updates and preserve program, agency, status, period, and denominator boundaries.",
  },
  {
    slug: "hanford-low-activity-waste-grout-plan",
    actionKey: "DOE-CROSS-01",
    agency: "DOE",
    status: "Published",
    sourceId: "source-56w-gao-hanford-law-grout-plans-2026",
    sourceIds: ["source-56w-gao-hanford-law-grout-plans-2026"],
    title: "Cross-lane: GAO bounds Hanford's low-activity-waste grouting plan and procurement",
    recordType: "Compatible cross-lane expansion",
    documentType: "Oversight Report",
    publicationDate: "2026-05-20",
    target: "Current plan, volume, cost range, procurement status, and scope boundary for off-site low-activity-waste grouting",
    finding: "GAO reports a plan to grout about 24 million gallons of low-activity waste, a $480 million to $1.1 billion estimate that excludes transportation and disposal, a December 2025 solicitation, proposals under review in April 2026, and an award planned later in 2026.",
    narrowing: "The report adds a cost-and-procurement record for a distinct Hanford waste stream while preventing low-activity-waste planning from being used as evidence about the high-level-waste recommendation target.",
    limits: ["Low-activity waste is not high-level waste.", "The estimate excludes transportation and disposal.", "A planned contract award is not an awarded, operating, or outcome-producing system."],
    next: "Track the procurement award, full lifecycle cost boundary, disposal destination, operating performance, and realized outcomes as separate records.",
  },
  {
    slug: "doe-em-aging-infrastructure-constraint",
    actionKey: "DOE-CROSS-02",
    agency: "DOE",
    status: "Published",
    sourceId: "source-56w-gao-em-aging-infrastructure-2026",
    sourceIds: ["source-56w-gao-em-aging-infrastructure-2026"],
    title: "Cross-lane: GAO quantifies DOE Environmental Management's aging-infrastructure constraint",
    recordType: "Compatible cross-lane expansion",
    documentType: "Oversight Report",
    publicationDate: "2026-05-05",
    target: "Current facility condition, repair need, maintenance cost, planning-quality, and cost-avoidance evidence for DOE Environmental Management infrastructure",
    finding: "GAO reports roughly 4,300 facilities, more than $1.5 billion in repair needs, more than $950 million planned for fiscal year 2026 maintenance, an 80 percent maintenance-cost increase since fiscal year 2020, inconsistent data and scorecards, and 19 projects that could save about $120 million.",
    narrowing: "The report establishes aging infrastructure and inconsistent asset data as measurable cleanup constraints, without substituting asset planning for waste-disposal optimization.",
    limits: ["Repair needs and maintenance plans are not the complex-wide waste inventory or optimal disposal strategy.", "Potential savings are not realized savings.", "Inconsistent data limits cross-site comparison and prioritization."],
    next: "Track DOE's corrected asset data, site-level need integration, project completion, realized savings, and any direct connection to disposal-strategy choices.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const records = specs.map((spec, index) => {
  const parent = spec.parentLeadId ? parentByLead.get(spec.parentLeadId) : null;
  if (spec.parentLeadId && !parent) throw new Error(`Missing Phase 56V parent ${spec.parentLeadId}.`);
  const meta = agencyMeta[spec.agency];
  const signalId = spec.status === "Published" ? `signal-56w-${spec.slug}` : null;
  return {
    record_id: `record-56w-${spec.slug}`,
    document_id: `research-doc-56w-${spec.slug}`,
    signal_id: signalId,
    document_number: 551 + index,
    phase: "56W",
    action_key: spec.actionKey,
    agency: spec.agency,
    entity_id: meta.entity,
    parent_lead_id: spec.parentLeadId ?? null,
    parent_record_id: parent?.record_id ?? null,
    record_relationship: parent ? "Phase 56V named recovery lead follow-through" : "Phase 56W compatible cross-lane expansion",
    record_type: spec.recordType,
    title: spec.title,
    record_status: spec.status,
    source_id: spec.sourceId,
    supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceId)?.url ?? parent?.downstream_official_urls?.[0] ?? parent?.official_url,
    publication_date: spec.publicationDate,
    document_type: spec.documentType,
    target_artifact: spec.target,
    finding: spec.finding,
    material_narrowing: spec.narrowing,
    evidence_limits: spec.limits,
    next_action: spec.next,
    exact_target_artifact_acquired: false,
    directive_scope_change: false,
    implementation_change: false,
    closure_change: false,
    current_visible_scope: { supported: 0, partial: 0, not_established: 3 },
    contact_or_foia_submitted: false,
    agency_gao_status_conflict: spec.actionKey === "DOE-05" || spec.actionKey === "DOE-02",
    authority_boundary: "A newly located decision, budget table, oversight result, procurement state, or agency progress statement does not substitute for the exact target artifact, GAO acceptance, implementation, closure, entity evidence, or operating outcome.",
    captured_date: capturedDate,
  };
});

const publishedRecords = records.filter((record) => record.record_status === "Published");
const heldRecords = records.filter((record) => record.record_status === "In Review");
const ledger = {
  phase: "56W",
  captured_date: capturedDate,
  goal: "Retrieve exact named records exposed by Phase 56V and continue compatible official-source expansion without waiting for dated milestones.",
  publication_rule: "Publish only an exact target artifact, a new authoritative status, or a materially narrower official locator. Hold unchanged exact-artifact searches in review.",
  authority_rule: "GAO retains recommendation-acceptance and closure authority; agency claims, FTFN classifications, implementation evidence, closure, and operating outcomes remain distinct.",
  parent_named_recovery_targets: 7,
  compatible_cross_lane_records: 3,
  records_reviewed: records.length,
  records_published: publishedRecords.length,
  records_held_in_review: heldRecords.length,
  new_official_source_profiles: sources.length,
  exact_target_artifacts_acquired: 0,
  new_authoritative_status_or_material_narrowing_records: publishedRecords.length,
  agency_status_conflicts: ["DOE-02", "DOE-05"],
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  prior_visible_scope: phase56v.post_batch_visible_scope,
  post_batch_visible_scope: phase56v.post_batch_visible_scope,
  post_batch_closure_counts: phase56v.post_batch_closure_counts,
  records,
};
await writeJson(join(dataRoot, "phase-56w-named-record-retrieval-cross-lane-expansion.json"), ledger);

await writeJson(join(dataRoot, "phase-56w-publication-review.json"), {
  phase: "56W",
  captured_date: capturedDate,
  publication_rule: ledger.publication_rule,
  document_decisions: { promoted: publishedRecords.map((record) => record.document_id), held: heldRecords.map((record) => record.document_id) },
  signal_decisions: { promoted: publishedRecords.map((record) => record.signal_id), held: [] },
  exact_target_artifacts_acquired: 0,
  new_authoritative_status_or_material_narrowing_records: publishedRecords.length,
  held_reason: "No exact artifact, new authoritative status, or materially narrower public locator was located for these four records in the bounded Phase 56W search.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const fileNumber = String(record.document_number).padStart(3, "0");
  const archiveIndex = String(record.document_number - 550).padStart(2, "0");
  const archiveName = `${archiveIndex}-${record.record_id.replace(/^record-56w-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${fileNumber}-56w-${record.record_id.replace(/^record-56w-/, "")}.json`), {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status,
    publisher: "Named U.S. government agencies and the U.S. Government Accountability Office",
    publication_date: record.publication_date,
    document_type: record.document_type,
    summary: `${record.finding} ${record.material_narrowing}`,
    key_findings: [
      `Record type: ${record.record_type}.`,
      `Target or measured object: ${record.target_artifact}.`,
      `Phase 56W result: ${record.finding}`,
      `Material narrowing: ${record.material_narrowing}`,
      ...record.evidence_limits.map((limit) => `Boundary: ${limit}`),
      `Next action: ${record.next_action}`,
    ],
    why_it_matters: "The record either advances a named recovery chain with new official evidence or records a bounded hold without blocking compatible content expansion.",
    ftfn_relevance: [
      `Preserves the ${record.action_key} identity and evidence boundary.`,
      "Separates exact artifact, authoritative status, implementation, closure, and operating outcome.",
      "Supports continued official-source expansion while dated checks remain bounded inserts.",
    ],
    evidence_limits: [
      "Not publicly acquired does not mean nonexistent, withheld, or never submitted.",
      "FTFN public-source research is not agency contact or a submitted FOIA request.",
      ...record.evidence_limits,
      "GAO retains recommendation-sufficiency and closure authority.",
      "Document evidence does not establish performance, readiness, safety, savings, value, ranking, composite score, or causation unless explicitly measured within the stated scope and denominator.",
    ],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: sourceUrls,
    official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  if (record.record_status !== "Published") continue;
  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: "Published"\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Audited or Verified Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(record.material_narrowing)}\n+${yamlList("dependencies", ["exact record identity", "authoritative source status", "scope and denominator boundary", "GAO acceptance where applicable"])}\n+${yamlList("constraints", ["Regulation", "Data Quality", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 56W named-record retrieval and cross-lane expansion"])}\n+${yamlList("local_implications", ["Do not convert aggregate, planned, project-level, or agency-reported evidence into an exact target, closure, or operating outcome."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+---\n+\n+## Phase 56W result\n+\n+${record.finding}\n+\n+## Material narrowing\n+\n+${record.material_narrowing}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "GAO Named-Record Retrieval and Cross-Lane Expansion, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56W tests seven named recovery targets and adds three compatible official oversight records: six results are Published and four unchanged exact-artifact searches remain In Review.",
  scope: "DOE, HHS, DOT, and VA named-record retrieval plus current infrastructure-funding, Hanford low-activity-waste, and DOE Environmental Management infrastructure records.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirteen-file archive contains ten official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "The collection publishes only exact artifacts, new authoritative status, or materially narrower official locators. Four unchanged exact-artifact searches remain In Review. Named does not mean acquired; forecast does not mean award; plan does not mean use; and agency status does not overwrite GAO acceptance or closure.",
});

const publishedSignalIds = publishedRecords.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 027: Named-Record Retrieval"\n+slug: "research-watch-027-named-record-retrieval"\n+record_status: "Published"\n+summary: "Phase 56W publishes six authoritative additions and holds four unchanged exact-artifact searches without pausing compatible content expansion."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", publishedSignalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", [
  "NNSA project-level cost tables, Hanford decision and progress records, and GAO's VA assessment distinction materially narrow three named recovery chains without yielding an exact target artifact.",
  "Three current GAO reviews add infrastructure-funding, Hanford low-activity-waste, and DOE Environmental Management infrastructure evidence with explicit scope boundaries.",
  "DOT's unified-grants records, DOE's complex-wide waste optimization, and two HHS completed AARs remain In Review because no new exact artifact or authoritative narrowing was located.",
])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["JEC draft-assessment completion and consolidated feedback", "DOT unified-grants award and operating assessment", "DOE Waste Disposal Office model and decision basis", "NNSA complete capability estimate", "Hanford independent analysis and pause decision", "HHS first qualifying department-wide AAR"])}\n+---\n+\n+## What Phase 56W adds\n+\n+The named-record search produced three materially narrower recommendation-specific records and three compatible cross-lane oversight records. Four target searches were held because the public evidence did not move beyond Phase 56V.\n+\n+## Strongest additions\n+\n+NNSA's FY 2027 Weapons Activities volume provides a detailed project-level cost trail but not the complete multi-site capability estimate. DOE's Hanford amended decision and July 2026 progress report confirm continued implementation while GAO retains the pause and independent-analysis recommendations as Open. GAO's VA testimony separates the earlier inventory from the still-missing effectiveness assessment.\n+\n+## Expansion without waiting\n+\n+Current GAO records add aggregate IIJA and IRA funding status, a bounded low-activity-waste grouting plan, and quantified DOE Environmental Management infrastructure constraints. These lanes expand immediately while dated recommendation checks remain scheduled inserts.\n+\n+## Evidence boundary\n+\n+Named does not mean acquired; forecast does not mean award; plan does not mean deployment or use; a project estimate is not a capability estimate; low-activity waste is not high-level waste; potential savings are not realized savings; and agency progress does not establish GAO acceptance or closure.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-027-named-record-retrieval.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56w-named-record-retrieval.json"), {
  id: "update-2026-08-02-phase-56w-named-record-retrieval",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56W publishes six named-record and cross-lane additions",
  summary: "Seven new official source profiles support six Published records while four unchanged exact-artifact searches remain In Review and all closure states stay unchanged.",
  affected_record_ids: [collectionId, briefingId, ...publishedSignalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-027-named-record-retrieval/", ...publishedSignalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded; agency status and GAO acceptance remain separate.",
  work_package: "docs/work-packages/phase-56w-named-record-retrieval-cross-lane-expansion.md",
});

console.log(`Generated Phase 56W: ${publishedRecords.length} Published records, ${heldRecords.length} In Review records, ${sources.length} Tier 1 sources, ${publishedSignalIds.length} signals, and zero exact target artifacts.`);
