import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "implementation-to-outcome-evidence-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-028-implementation-to-outcome";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const path of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"].map((name) => join(contentRoot, name))) {
  await mkdir(path, { recursive: true });
}

const phase56w = JSON.parse(await readFile(join(dataRoot, "phase-56w-named-record-retrieval-cross-lane-expansion.json"), "utf8"));
if (phase56w.phase !== "56W" || phase56w.records.length !== 10) throw new Error("Phase 56X requires the complete Phase 56W ledger.");

const agencyMeta = {
  EPA: { entity: "agency-epa", topics: ["Climate", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  Interior: { entity: "agency-interior", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Resource Foundations", "Human Systems"], gaps: ["gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-56x-gao-iija-ira-agency-status-2026",
    name: "GAO-26-108434 full report: agency-specific IIJA and IRA funding status",
    url: "https://www.gao.gov/assets/gao-26-108434.pdf",
    owner: "U.S. Government Accountability Office",
    agency: "DOT",
    access: "Data Download",
    limitation: "The appendices report agency data with different as-of dates and review units. Approval, modification, cancellation, obligation, disbursement, completion, and outcome remain distinct, and GAO could not independently corroborate every agency-reported review status.",
  },
  {
    id: "source-56x-gao-em-site-infrastructure-2026",
    name: "GAO-26-107957 full report: site facility infrastructure and maintenance status",
    url: "https://www.gao.gov/assets/gao-26-107957.pdf",
    owner: "U.S. Government Accountability Office",
    agency: "DOE",
    access: "Data Download",
    limitation: "Appendix II reports site-specific facility and maintenance data as of June 2025. GAO identified inconsistent methods and unsupported validation data, so the site records are parallel denominators rather than a ranking or realized-savings series.",
  },
  {
    id: "source-56x-gao-nnsa-major-projects-2026",
    name: "GAO-26-107777: assessments of NNSA major projects",
    url: "https://www.gao.gov/assets/gao-26-107777.pdf",
    owner: "U.S. Government Accountability Office",
    agency: "DOE",
    access: "Data Download",
    limitation: "The February 2026 report assesses 28 major projects using data generally current through June 2025. Definition-phase ranges, approved baselines, current estimates, project completion, production capability, and capability-wide life-cycle cost are different evidence objects.",
  },
  {
    id: "source-56x-hanford-vitrification-100k-2026",
    name: "DOE EM: Over 100,000 Gallons of Hanford Tank Waste Turned to Glass",
    url: "https://www.energy.gov/em/articles/over-100000-gallons-hanford-tank-waste-turned-glass",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "DOE reports a cumulative commissioning output through May 2026. It does not establish steady-state throughput, independent acceptance, lifecycle cost, environmental outcome, or performance of the separate 24-million-gallon grout procurement.",
  },
  {
    id: "source-56x-hanford-first-ilaw-disposal-2026",
    name: "DOE EM: Hanford disposes first batch of vitrified low-activity waste",
    url: "https://www.energy.gov/em/articles/hanford-disposes-first-batch-vitrified-tank-waste-marking-key-progress",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "DOE reports the first onsite disposal of vitrified low-activity-waste containers. The article does not publish a verified quantity disposed, steady-state operating rate, independent environmental outcome, or the status of the distinct offsite grout procurement.",
  },
  {
    id: "source-56x-hanford-emf-concentrate-grout-2026",
    name: "DOE EM: Hanford begins transferring EMF concentrate for grouting",
    url: "https://www.energy.gov/em/articles/small-stream-big-step-hanford-begins-transferring-emf-concentrate-grouting",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Report Series",
    limitation: "The July 2026 use record covers secondary EMF concentrate sent to a local facility for grouting and later out-of-state disposal. It is not an award or operating record for the separate 22-tank, approximately 24-million-gallon low-activity-waste grouting plan.",
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
    notes: `Phase 56X implementation-to-outcome source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "epa-infrastructure-review-denominator", agency: "EPA", actionKey: "IIJA-IRA-EPA-01", stage: "Award review", publicationDate: "2026-07-22", sourceIds: ["source-56x-gao-iija-ira-agency-status-2026"],
    title: "EPA funding review: 3,768 obligated awards retain separate approval, cancellation, and litigation states",
    finding: "GAO reports that EPA reviewed 3,768 obligated awards totaling $71.7 billion, approved 3,388 awards totaling $42.5 billion, canceled 372 IRA awards totaling about $9.2 billion, and treated eight grants totaling $19.97 billion as pending because of ongoing litigation.",
    denominator: "EPA awards and dollars subject to the agency review; status data generally through February 25, 2026, with litigation status discussed through April 2026.",
    limits: ["EPA did not cancel any IIJA awards in this review; the cancellations were IRA awards.", "Pending litigation is not a final cancellation, recovery, completion, or outcome.", "The review status does not measure recipient implementation or program results."],
    next: "Track final litigation outcomes, award closeout, later obligations and disbursements, and program-specific completion and outcome measures.",
  },
  {
    slug: "interior-infrastructure-review-denominator", agency: "Interior", actionKey: "IIJA-IRA-INTERIOR-01", stage: "Award review", publicationDate: "2026-07-22", sourceIds: ["source-56x-gao-iija-ira-agency-status-2026"],
    title: "Interior funding review: award-level status cannot be collapsed into project approval",
    finding: "GAO reports $4.5 billion across 4,839 Interior awards: $2.1 billion associated with 2,787 awards approved without modification, four modified awards, 56 canceled awards, and $2.3 billion across 1,992 awards pending a final outcome.",
    denominator: "Interior review records as of September 30, 2025; Interior reviewed obligations and disbursements and continued review activity into April 2026.",
    limits: ["Interior's review unit differs from the project-level reviews used by EPA, NTIA, and DOT.", "An approved disbursement or obligation is not approval of every project outcome.", "The report does not establish completed work or realized public benefit."],
    next: "Track the final disposition of pending obligations and disbursements and link later payments to completed work using program-specific denominators.",
  },
  {
    slug: "ntia-infrastructure-review-denominator", agency: "NTIA", actionKey: "IIJA-IRA-NTIA-01", stage: "Award review", publicationDate: "2026-07-22", sourceIds: ["source-56x-gao-iija-ira-agency-status-2026"],
    title: "NTIA funding review: high obligation and low disbursement mark different lifecycle stages",
    finding: "GAO reports that NTIA reviewed 491 awards worth $45.4 billion, approved $43.8 billion across 294 awards, canceled $1.4 billion across 120 awards, and had $0.2 billion across eight awards pending as of June 30, 2025. NTIA had obligated $45.1 billion but disbursed $1.1 billion because most BEAD awards had not reached project implementation.",
    denominator: "NTIA IIJA awards and funds through June 30, 2025; the IRA did not fund NTIA.",
    limits: ["Obligation and disbursement use different denominators and lifecycle stages.", "Most BEAD funds not yet disbursed does not establish project failure or completion.", "NTIA declined to provide a complete July-September 2025 financial update at the time of GAO's work."],
    next: "Track BEAD implementation, recipient disbursements, constructed locations, service availability, adoption, and independently defined outcomes.",
  },
  {
    slug: "dot-infrastructure-review-denominator", agency: "DOT", actionKey: "IIJA-IRA-DOT-01", stage: "Award review", publicationDate: "2026-07-22", sourceIds: ["source-56x-gao-iija-ira-agency-status-2026"],
    title: "DOT funding review: mostly unobligated awards split into approval, modification, cancellation, and pending states",
    finding: "GAO reports that DOT's task force reviewed 3,879 mostly unobligated awards totaling $60.5 billion: $34.4 billion across 2,270 awards approved without modification, $5.5 billion across 841 modified awards, $7.2 billion across 248 canceled awards, and $11.1 billion across 520 awards pending as of September 30, 2025. DOT later reported 293 still under review in April 2026.",
    denominator: "DOT task-force review of mostly unobligated discretionary awards across 94 programs; formula funds were outside this review.",
    limits: ["The review excludes DOT formula funding and does not equal the entire DOT IIJA and IRA portfolio.", "Approval for obligation is not grant agreement execution, disbursement, construction, completion, or outcome.", "This record is not the unified-grants system award or operating assessment sought in DOT-05."],
    next: "Track obligation, grant agreement, disbursement, construction, completion, and program outcome by operating administration and program while preserving the formula-fund exclusion.",
  },
  {
    slug: "hanford-vitrification-commissioning-output", agency: "DOE", actionKey: "HANFORD-LAW-OUTPUT-01", stage: "Operating output", publicationDate: "2026-05-26", sourceIds: ["source-56x-hanford-vitrification-100k-2026", "source-56x-hanford-first-ilaw-disposal-2026"],
    title: "Hanford hot commissioning records more than 100,000 gallons vitrified",
    finding: "DOE reports that the Low-Activity Waste Facility had immobilized more than 100,000 gallons of tank waste in glass since hot commissioning began in October 2025. The agency says commissioning will continue while the team develops production consistency and sustained operations.",
    denominator: "Cumulative gallons of Hanford tank waste vitrified during hot commissioning through May 26, 2026.",
    limits: ["A cumulative commissioning output is not a steady-state throughput rate.", "Agency reporting is not independent acceptance or an environmental outcome evaluation.", "Vitrification output is separate from the planned 24-million-gallon grout procurement."],
    next: "Track monthly throughput, operating availability, acceptance, disposal, cost, and safety records under stable commissioning and steady-state denominators.",
  },
  {
    slug: "hanford-first-ilaw-disposal-use-record", agency: "DOE", actionKey: "HANFORD-LAW-DISPOSAL-01", stage: "Operating output", publicationDate: "2026-04-08", sourceIds: ["source-56x-hanford-first-ilaw-disposal-2026", "source-56x-hanford-vitrification-100k-2026"],
    title: "Hanford places the first vitrified low-activity-waste containers in onsite disposal",
    finding: "DOE reports that Hanford permanently disposed of the first containers of vitrified low-activity waste in the onsite Integrated Disposal Facility; about 30 containers were staged and ready to move into the disposal cell.",
    denominator: "First disposal event and container cohort reported in April 2026; no verified total disposed quantity is stated.",
    limits: ["Ready-to-move containers are not the same as containers confirmed disposed.", "A first disposal event is not sustained operations, closure, or measured environmental risk reduction.", "Onsite vitrified-waste disposal is separate from offsite disposal of grouted waste."],
    next: "Track accepted container counts, disposed volume, disposal dates, operating cadence, compliance records, and independently measured downstream outcomes.",
  },
  {
    slug: "hanford-emf-concentrate-grout-transfer", agency: "DOE", actionKey: "HANFORD-EMF-GROUT-01", stage: "Operating output", publicationDate: "2026-07-13", sourceIds: ["source-56x-hanford-emf-concentrate-grout-2026"],
    title: "Hanford begins offsite grouting of secondary EMF concentrate",
    finding: "DOE reports the first transfer of Effluent Management Facility concentrate to a local offsite grouting facility after a regulatory permit was obtained. EMF concentrate is a secondary liquid byproduct of vitrification, and the grouted material is then to be shipped out of Washington for commercial disposal.",
    denominator: "First reported EMF-concentrate transfer in July 2026; DOE states that one to three gallons of secondary material can be created per gallon vitrified but does not publish the transfer volume.",
    limits: ["EMF concentrate is not the 22-tank low-activity-waste stream in GAO-26-108878.", "A first transfer does not establish a stable operating rate, full lifecycle cost, or completed disposal.", "DOE's statement that the approach could increase treatment capacity is a projected effect, not a realized measured outcome."],
    next: "Track transferred and disposed volume, destination, acceptance, cost, schedule, operating cadence, and any verified effect on vitrification throughput.",
  },
  {
    slug: "em-hanford-maintenance-denominator", agency: "DOE", actionKey: "DOE-EM-HANFORD-INFRA-01", stage: "Site denominator", publicationDate: "2026-05-05", sourceIds: ["source-56x-gao-em-site-infrastructure-2026"],
    title: "DOE EM infrastructure: Hanford's facility and maintenance denominator",
    finding: "GAO reports that Hanford had 1,547 facilities as of June 2025, including 322 mission-critical facilities; five mission-critical facilities had poor or very poor condition indexes and five were rated inadequate. Operating facilities had $230.2 million in annual actual maintenance, $318.3 million in annual required maintenance, $100.6 million in deferred maintenance, and $466.6 million in repair needs.",
    denominator: "Hanford facilities and operating-or-standby maintenance measures as of June 2025.",
    limits: ["The four maintenance measures have distinct definitions and must not be summed as one backlog.", "Facility counts and condition ratings do not measure cleanup outcomes.", "GAO identified broader data-quality and comparability weaknesses across EM sites."],
    next: "Track corrected asset data, site-priority integration, project awards and completion, maintenance effects, and any realized cost or mission-risk change.",
  },
  {
    slug: "em-savannah-river-maintenance-denominator", agency: "DOE", actionKey: "DOE-EM-SRS-INFRA-01", stage: "Site denominator", publicationDate: "2026-05-05", sourceIds: ["source-56x-gao-em-site-infrastructure-2026"],
    title: "DOE EM infrastructure: Savannah River's facility and maintenance denominator",
    finding: "GAO reports that Savannah River had 1,842 facilities as of June 2025, including 436 mission-critical facilities; 67 mission-critical facilities had poor or very poor condition indexes. Operating facilities had $313.2 million in annual actual maintenance, $14.8 million in annual required maintenance, $285.8 million in deferred maintenance, and $527.9 million in repair needs.",
    denominator: "Savannah River facilities and operating-or-standby maintenance measures as of June 2025.",
    limits: ["The apparent relationship among actual, required, deferred, and repair measures requires the report's definitions and is not a performance score.", "The planned 2028 H-Canyon crane update is a plan, not delivered risk reduction.", "Cross-site comparisons are constrained by method and data-quality differences."],
    next: "Track the H-Canyon crane update and other prioritized projects through award, completion, acceptance, operations, and measured maintenance or mission effects.",
  },
  {
    slug: "em-idaho-maintenance-denominator", agency: "DOE", actionKey: "DOE-EM-IDAHO-INFRA-01", stage: "Site denominator", publicationDate: "2026-05-05", sourceIds: ["source-56x-gao-em-site-infrastructure-2026"],
    title: "DOE EM infrastructure: Idaho's aged-asset and maintenance denominator",
    finding: "GAO reports that Idaho had 409 facilities, 121 mission-critical facilities, and 213 assets more than 30 years old as of June 2025. Nine mission-critical facilities had poor or very poor condition indexes and five were rated inadequate; repair needs were $248.4 million and deferred maintenance was $52.1 million.",
    denominator: "Idaho Cleanup Project facilities and operating-or-standby maintenance measures as of June 2025.",
    limits: ["Aged-asset and repair-need counts are constraint measures, not completed remediation.", "Potential mission effects from component failure are risks, not observed outcomes.", "The record does not establish which projects received funding or were completed."],
    next: "Track the named high-maintenance assets and modernization work through funded scope, delivery, acceptance, operating reliability, and lifecycle-cost evidence.",
  },
  {
    slug: "nnsa-lap4-baseline-change-series", agency: "DOE", actionKey: "NNSA-LAP4-SERIES-01", stage: "Project baseline", publicationDate: "2026-02-26", sourceIds: ["source-56x-gao-nnsa-major-projects-2026", "source-56w-nnsa-fy2027-weapons-activities"],
    title: "NNSA LAP4: project phases and scope transfers require separate cost and schedule series",
    finding: "GAO reports that the LAP4 30 Base Equipment Installation and Decontamination and Decommissioning projects were replanning baselines under the 30 Diamond strategy, while the definition-phase 30 Reliable project had a 92 percent increase in scoped equipment relative to preliminary estimates. GAO's June 2025 table lists 30 Base at a $1.864 billion baseline and August 2030 completion date, while the definition-phase 30 Reliable current cost and completion date remained to be determined.",
    denominator: "Named LAP4 subprojects, project phase, approved baseline or preliminary range, and status generally as of June 2025.",
    limits: ["Scope transfers make parent-project and subproject trend lines non-equivalent without change-control history.", "An approved project baseline is not production capability or project completion.", "The series is not the complete multi-site pit-production capability life-cycle estimate."],
    next: "Track each LAP4 subproject's approved scope, baseline revision, current estimate, completion, operational acceptance, and production-capability contribution.",
  },
  {
    slug: "nnsa-srppf-subproject-baseline-series", agency: "DOE", actionKey: "NNSA-SRPPF-SERIES-01", stage: "Project baseline", publicationDate: "2026-05-01", sourceIds: ["source-56w-nnsa-fy2027-weapons-activities", "source-56x-gao-nnsa-major-projects-2026"],
    title: "NNSA SRPPF: HFTOC baseline approval remains separate from the Main Process Building placeholder",
    finding: "NNSA reports that the High-Fidelity Training and Operations Center received CD-2/3 approval on February 6, 2026, while the Main Process Building baseline package was targeted for approval in the fourth quarter of fiscal year 2026. The FY 2027 volume retains a $25 billion total-project-cost budgetary placeholder until the Main Process Building performance baseline is established; it also reports 81 gloveboxes in fabrication as of August 2025.",
    denominator: "SRPPF overall project and named subprojects, critical-decision stage, cost status, schedule range, and dated implementation evidence.",
    limits: ["The $25 billion figure is explicitly a budgetary placeholder, not an approved performance baseline.", "Gloveboxes in fabrication are implementation inputs, not installed or operating capability.", "HFTOC approval does not establish Main Process Building approval, project completion, or pit-production output."],
    next: "Track Main Process Building CD-2/3, approved scope and baseline, glovebox delivery and installation, HFTOC construction, operational acceptance, and attributable production output.",
  },
  {
    slug: "nnsa-major-project-portfolio-performance", agency: "DOE", actionKey: "NNSA-PORTFOLIO-01", stage: "Project baseline", publicationDate: "2026-02-26", sourceIds: ["source-56x-gao-nnsa-major-projects-2026"],
    title: "NNSA major projects: portfolio overruns apply only to baselined execution-phase projects",
    finding: "GAO reports that cumulative cost overruns across NNSA's execution-phase major-project portfolio increased from $2.1 billion in 2023 to $4.8 billion as of June 2025, while cumulative schedule delay increased from nine to 30 years. Two Uranium Processing Facility projects accounted for about 80 percent of the cost overrun and 40 percent of the delay; 12 definition-phase projects lacked approved baselines.",
    denominator: "Sixteen execution-phase projects with approved baselines for portfolio overrun measures; 12 definition-phase projects assessed separately.",
    limits: ["Portfolio sums are not an average project rate or an agency performance score.", "Definition-phase ranges cannot be mixed with execution-phase baseline overruns.", "Cost and schedule movement does not establish operating readiness, production output, safety, or mission outcome."],
    next: "Track project-level baseline changes, completion decisions, operational acceptance, and outputs before connecting construction performance to mission outcomes.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const existingSourceUrl = new Map();
for (const id of ["source-56w-nnsa-fy2027-weapons-activities"]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  existingSourceUrl.set(id, source.url);
}

const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-56x-${spec.slug}`,
    document_id: `research-doc-56x-${spec.slug}`,
    signal_id: `signal-56x-${spec.slug}`,
    document_number: 561 + index,
    phase: "56X",
    action_key: spec.actionKey,
    agency: spec.agency,
    entity_id: meta.entity,
    record_type: "Implementation-to-outcome expansion",
    evidence_stage: spec.stage,
    title: spec.title,
    record_status: "Published",
    source_id: spec.sourceIds[0],
    supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url ?? existingSourceUrl.get(spec.sourceIds[0]),
    publication_date: spec.publicationDate,
    document_type: spec.stage === "Operating output" ? "Program Milestone" : "Oversight Report",
    finding: spec.finding,
    denominator: spec.denominator,
    evidence_limits: spec.limits,
    next_action: spec.next,
    exact_target_artifact_acquired: false,
    directive_scope_change: false,
    implementation_change: false,
    closure_change: false,
    contact_or_foia_submitted: false,
    authority_boundary: "Plan, award, obligation, disbursement, deployment, use, output, outcome, acceptance, and closure remain separate. Agency-reported progress does not overwrite GAO authority or establish independent validation.",
    captured_date: capturedDate,
  };
});

await writeJson(join(dataRoot, "phase-56x-implementation-to-outcome-expansion.json"), {
  phase: "56X",
  captured_date: capturedDate,
  goal: "Convert aggregate and planned records into agency-, site-, waste-stream-, project-, and stage-specific evidence without waiting for dated exact-artifact milestones.",
  publication_rule: "Publish a record only when a primary source supplies a stable identity, evidence stage, observation period, method or status definition, and explicit denominator or an explicit statement that the denominator is unavailable.",
  authority_rule: "Agency assertions, GAO analysis, FTFN classification, implementation, acceptance, closure, operating output, and realized outcome remain distinct.",
  records_reviewed: records.length,
  records_published: records.length,
  evidence_stage_counts: Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length])),
  new_official_source_profiles: sources.length,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  prior_visible_scope: phase56w.post_batch_visible_scope,
  post_batch_visible_scope: phase56w.post_batch_visible_scope,
  post_batch_closure_counts: phase56w.post_batch_closure_counts,
  records,
});

await writeJson(join(dataRoot, "phase-56x-publication-review.json"), {
  phase: "56X",
  captured_date: capturedDate,
  promoted_document_ids: records.map((record) => record.document_id),
  promoted_signal_ids: records.map((record) => record.signal_id),
  held_document_ids: [],
  exact_target_artifacts_acquired: 0,
  decision: "All thirteen records add a new agency, site, waste-stream, project, or evidence-stage denominator. Exact-artifact lanes had no new public trigger and remain non-blocking carry-forward items.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 560).padStart(2, "0")}-${record.record_id.replace(/^record-56x-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url ?? existingSourceUrl.get(id)).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-56x-${record.record_id.replace(/^record-56x-/, "")}.json`), {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: "Published",
    publisher: record.agency === "DOE" && record.document_type === "Program Milestone" ? "U.S. Department of Energy, Office of Environmental Management" : "U.S. Government Accountability Office and named U.S. agencies",
    publication_date: record.publication_date,
    document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: "The record advances a plan or aggregate status toward a bounded implementation or operating evidence series without implying closure or a realized outcome.",
    ftfn_relevance: ["Preserves agency, program, project, site, waste stream, period, unit, and evidence-stage boundaries.", "Creates a stable follow-through record for later acceptance, operation, and outcome evidence.", "Keeps dated exact-artifact checks non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "GAO acceptance, implementation, closure, and entity evidence remain separate from this content expansion.", "No record supports a ranking, composite score, readiness score, realized-savings claim, or causal inference."],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: sourceUrls,
    official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: "Published"\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Audited or Verified Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}\n+${yamlList("dependencies", ["stable record identity", "evidence-stage boundary", "explicit period and denominator", "later acceptance or outcome evidence"])}\n+${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 56X implementation-to-outcome expansion"])}\n+${yamlList("local_implications", ["Do not collapse plan, award, obligation, disbursement, deployment, use, output, outcome, acceptance, or closure."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+---\n+\n+## Phase 56X result\n+\n+${record.finding}\n+\n+## Evidence stage and denominator\n+\n+**${record.evidence_stage}.** ${record.denominator}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Implementation-to-Outcome Evidence, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56X adds thirteen agency-, site-, waste-stream-, and project-specific records across funding review, Hanford operations, DOE Environmental Management infrastructure, and NNSA project delivery.",
  scope: "Four agency funding-review denominators, three Hanford operating-output records, three DOE EM site-maintenance denominators, and three NNSA project-baseline records.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The sixteen-file archive contains thirteen official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Plan, award, obligation, disbursement, deployment, use, output, outcome, acceptance, and closure remain separate. Program, agency, project, waste stream, site, period, unit, method, and denominator are explicit. Potential savings and agency-reported progress are not realized or independently validated outcomes.",
});

const signalIds = records.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 028: From Implementation to Outcome"\n+slug: "research-watch-028-implementation-to-outcome"\n+record_status: "Published"\n+summary: "Phase 56X decomposes aggregate and planned evidence into thirteen bounded award-review, operating-output, site-maintenance, and project-baseline records."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", signalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", ["Agency-specific IIJA and IRA records expose different review units, as-of dates, and lifecycle stages.", "Hanford now has bounded commissioning, disposal, and secondary-byproduct use records, none of which substitutes for the pending 24-million-gallon grout procurement.", "DOE EM site records and NNSA project records establish explicit denominators for later delivery and outcome follow-through."])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Funding obligations, disbursements, completions, and program outcomes", "Hanford steady-state throughput, accepted disposal, and distinct grout-procurement award", "DOE EM project delivery and realized maintenance effects", "NNSA approved baseline changes, completion, acceptance, and production output"])}\n+---\n+\n+## What Phase 56X adds\n+\n+The batch replaces four-agency aggregates with agency-specific review denominators, separates three Hanford operating records by waste stream and lifecycle stage, publishes three site-level DOE EM infrastructure records, and builds three NNSA project and subproject series.\n+\n+## Funding lifecycle\n+\n+EPA, Interior, NTIA, and DOT used different review units and supplied different as-of dates. Approval, cancellation, obligation, disbursement, completion, and outcome therefore remain separate records rather than a comparative score.\n+\n+## Hanford operating evidence\n+\n+DOE reports more than 100,000 gallons vitrified during commissioning, the first onsite disposal of vitrified low-activity-waste containers, and the first offsite grouting transfer of secondary EMF concentrate. These are distinct use and output records. They do not establish steady-state throughput, independent environmental outcomes, or the award and operation of the separate 22-tank grouting procurement.\n+\n+## Project and site denominators\n+\n+GAO's site appendices make Hanford, Savannah River, and Idaho maintenance measures explicit. GAO and NNSA records distinguish LAP4 and SRPPF subprojects, definition and execution phases, approved baselines, placeholders, fabrication inputs, completion, and production capability.\n+\n+## Evidence boundary\n+\n+No Phase 56X record changes directive scope, implementation, closure, or the one Closed / twenty-one Partially Closed / two Open entity ledger. No ranking, composite, readiness score, realized-savings claim, or causal inference is supported.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-028-implementation-to-outcome.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56x-implementation-to-outcome.json"), {
  id: "update-2026-08-02-phase-56x-implementation-to-outcome",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56X publishes thirteen implementation-to-outcome evidence records",
  summary: "Six Tier 1 official source profiles support thirteen Published records across agency funding, Hanford operations, DOE EM site infrastructure, and NNSA project delivery.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-028-implementation-to-outcome/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded. Evidence stages and denominators remain separate.",
  work_package: "docs/work-packages/phase-56x-implementation-to-outcome-expansion.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};

const sourceIds = sources.map((source) => source.id);
await updateJson(join(contentRoot, "organizations", "org-government-accountability-office.json"), (value) => { value.source_ids = appendUnique(value.source_ids, sourceIds.slice(0, 3)); });
await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => { value.source_ids = appendUnique(value.source_ids, sourceIds.slice(1)); });

for (const [file, selected, question] of [
  ["finance-and-risk.json", sourceIds, "Which Phase 56X award, project, or site record next reaches accepted operation or a realized outcome under the same denominator?"],
  ["policy-and-standards.json", sourceIds, "Which implementation-stage boundary next gains authoritative acceptance, closure, or outcome evidence?"],
  ["mobility.json", [sourceIds[0]], "Which DOT awards progress from approval through obligation, disbursement, completion, and measured transportation outcomes?"],
  ["energy.json", sourceIds.slice(1), "Which Hanford, DOE EM, or NNSA record next gains stable operating or realized-outcome evidence?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected);
    value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", signalIds, sourceIds],
  ["autonomy-regulation-to-service.json", signalIds.slice(0, 4), sourceIds.slice(0, 1)],
  ["energy-grid-capacity-to-service.json", signalIds.slice(4), sourceIds.slice(1)],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids, selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 56X implementation-to-outcome expansion");
    value.dependency_stack.push({ stage: "Phase 56X implementation-to-outcome expansion", current_state: "Thirteen Published records separate four award-review denominators, three operating outputs, three site-maintenance denominators, and three project-baseline series.", boundary: "Agency, project, site, waste stream, evidence stage, period, unit, method, and denominator remain explicit; an implementation input or output is not acceptance, closure, realized outcome, ranking, or causation." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 56X funding, Hanford, DOE EM, and NNSA records use distinct evidence stages and denominators; they cannot support agency rankings, composite scores, readiness scores, realized-savings claims, or causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Later award, obligation, disbursement, deployment, use, output, acceptance, closure, and realized-outcome records using the same Phase 56X identity and denominator."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 56X adds thirteen agency-, site-, waste-stream-, and project-specific records while evidence stage, period, unit, method, denominator, acceptance, closure, and outcome remain separate.";
  value.source_ids = appendUnique(value.source_ids, sourceIds);
  value.signal_ids = appendUnique(value.signal_ids, signalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase56x-implementation-to-outcome");
  value.links = value.links.filter((link) => link.from !== "node-phase56x-implementation-to-outcome");
  value.nodes.push({ id: "node-phase56x-implementation-to-outcome", label: "Thirteen bounded implementation-to-outcome records", node_type: "Signal", note: "Four award-review, three operating-output, three site-denominator, and three project-baseline records add stable follow-through identities without changing closure." });
  value.links.push(
    { from: "node-phase56x-implementation-to-outcome", to: "node-phase56w-named-record-retrieval", relationship: "Depends On", confidence: "Supported", note: "Phase 56X decomposes the aggregate and planned evidence exposed in Phase 56W." },
    { from: "node-phase56x-implementation-to-outcome", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Agencies, projects, sites, waste streams, evidence stages, periods, units, and methods differ." },
    { from: "node-phase56x-implementation-to-outcome", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "The records do not establish rankings, composite scores, readiness, realized savings, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Thirteen bounded agency, site, waste-stream, and project follow-through records with explicit evidence stages and denominators."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Later accepted operation and realized-outcome evidence using the same Phase 56X identities, periods, units, methods, and denominators."]);
});

console.log(`Generated Phase 56X: ${records.length} Published records, ${sources.length} Tier 1 sources, Research Watch 028, and zero exact target artifacts.`);
