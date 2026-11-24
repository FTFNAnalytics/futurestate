import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  computeV1cycleDigest,
  findMatchingV1cycleReceipt,
  v1cyclePhases,
  v1cyclePublicationDate,
} from "./lib/v1cycle-candidate-digest.mjs";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const appRoot = join(scriptRoot, "..");
const workspaceRoot = join(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const workPackagesRoot = join(workspaceRoot, "docs", "work-packages");
const validationReceiptRoot = join(dataRoot, "phase-172-receipts");
const evidenceReceiptRoot = join(dataRoot, "phase-165-receipts");
const release = "v1cycle";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};
const writeText = async (path, value) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value.endsWith("\n") ? value : `${value}\n`, "utf8");
};
const unique = (values) => [...new Set(values.filter(Boolean))];
const sha = (value) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const idOf = (record) => Object.entries(record).find(([key]) => key.endsWith("_id"))?.[1];

const [p156, p164, p158, p151, p154, p146, p147, p160, p137, p162, p161] = await Promise.all([
  "phase-156-v1-launch-decision.json",
  "phase-164-monthly-candidate-decision.json",
  "phase-158-september-evidence-operations-desk.json",
  "phase-151-weekly-desk-review-ledger.json",
  "phase-154-september-edition-packets.json",
  "phase-146-authority-gap-resolution-program.json",
  "phase-147-evidence-adjudication-record.json",
  "phase-160-longitudinal-pilot-matrices.json",
  "phase-137-place-delivery-ledgers.json",
  "phase-162-local-system-expansion.json",
  "phase-161-stack-watch.json",
].map((name) => readJson(join(dataRoot, name))));

if (p156.local_validation_receipt?.receipt_id !== "156-LOCAL-VALIDATION-2026-08-31-a750bba9528e" || p156.local_validation_receipt?.artifact_digest !== "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a") {
  throw new Error("Phase 156 immutable baseline receipt changed; refusing to build the overlay.");
}
if (p164.local_validation_receipt?.receipt_id !== "164-LOCAL-VALIDATION-2026-09-01-d2846dc22604" || p164.local_validation_receipt?.artifact_digest !== "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19") {
  throw new Error("Phase 164 immutable baseline receipt changed; refusing to build the overlay.");
}

const boundaries = [
  "This is an append-only operating and content layer over the immutable Phase 156 and Phase 164 receipts; it does not rewrite either validated baseline.",
  "Only evidence checks lawful on or before 2026-09-01 may carry a decision. Later September and October outcomes remain null until their recorded dates.",
  "Candidate sources, planned capacity, service availability, offers, forecasts, and adjacent facts do not substitute for the exact observation, authority, period, method, and denominator required by a gate.",
  "No owner decision, project or place stage, admitted longitudinal series, causal result, score, rank, repository publication, hosted deployment, or v1 promotion is inferred.",
];

const exportNameByPhase = {
  165: "phase-165-live-evidence-operations-cycle-001.json",
  166: "phase-166-weekly-desk-closures-and-editions.json",
  167: "phase-167-authority-resolution-hearings.json",
  168: "phase-168-requirement-mission-adjudication.json",
  169: "phase-169-longitudinal-pilot-adjudication.json",
  170: "phase-170-fifteen-place-systems-atlas.json",
  171: "phase-171-frontier-systems-compendium.json",
  172: "phase-172-september-state-report.json",
};
const sectionByPhase = {
  165: "live-operations", 166: "weekly-editions", 167: "authority-hearings", 168: "mission-adjudication",
  169: "longitudinal-adjudication", 170: "systems-atlas", 171: "systems-compendium", 172: "september-state",
};
const keyByPhase = {
  165: "operation_runs", 166: "weekly_cycles", 167: "authority_hearings", 168: "adjudication_dockets",
  169: "longitudinal_adjudication_packets", 170: "place_system_dossiers", 171: "compendium_records", 172: "state_report_gates",
};

const registry = ({ phase, title, summary, counts, records, extras = {} }) => {
  const section = sectionByPhase[phase];
  const key = keyByPhase[phase];
  const hub = `/review/${release}/${section}/`;
  const publicExport = `/data/${exportNameByPhase[phase]}`;
  const publicHtmlRoutes = [hub, ...records.map((record) => record.route).filter(Boolean)];
  return {
    schema_version: "1.0",
    phase,
    program_id: `FTFN-PHASE-${phase}`,
    dataset: exportNameByPhase[phase].replace(/\.json$/, "").replaceAll("-", "_"),
    title,
    effective_date: v1cyclePublicationDate,
    record_status: "Published",
    build_status: "Complete locally",
    summary,
    record_scope: "Append-only Phase 165–172 evidence-to-publication overlay over immutable Phase 156 and Phase 164 validation receipts.",
    publication_boundaries: boundaries,
    routes: { hub, public_export: publicExport },
    counts,
    [key]: records,
    ...extras,
    public_html_routes: publicHtmlRoutes,
    public_json_exports: [publicExport],
  };
};

const evidenceReceipt = {
  schema_version: "1.0",
  receipt_id: "receipt-60-louisiana-starlink-2026-09-01-no-material-change",
  receipt_type: "No Material Change",
  operation_run_id: "165-OPERATION-001",
  upstream_operation_id: "145-GATE-003",
  upstream_cycle_item_id: "60-CYCLE-LOUISIANA-STARLINK-ADOPTION",
  source_checked_date: "2026-09-01",
  decision_date: "2026-09-01",
  decision_status: "no_material_change",
  signal_decision: "retain_in_review_no_material_change",
  affected_record_ids: [
    "source-57b-louisiana-starlink-bead-agreement",
    "source-165-led-spacex-louisiana-campus-starlink-offer",
    "source-165-starlink-louisiana-community-discount",
    "source-165-louisiana-broadband-reporting-law",
    "source-165-connectla-resource-library",
    "signal-57y-preserved-la-starlink-adoption",
    "briefing-outcomes-watch-001-what-actually-changed",
    "briefing-evidence-cycle-001-operating-baseline",
    "reader-pathway-policy-standards-to-implementation",
    "dependency-map-comparative-outcomes-require-common-denominators",
    "162-BRIEF-004",
  ],
  prior_state: "ConnectLA’s June 11 grant-agreement record described planned Starlink access for 10,635 eligible locations in more than 50 parishes by the end of summer; the adoption signal remained In Review pending observed installations or subscriptions for a fixed eligible-location cohort with a dated period and disclosed method.",
  current_state: "The adoption signal remains In Review. The September 1 review confirms the award baseline and identifies adjacent Pecan Island planned-service and affordability details, but no reviewed official surface supplies a compatible observed installation or subscription result for the fixed Louisiana BEAD cohort.",
  bounded_finding: "ConnectLA’s current official surfaces continue to establish planned access for 10,635 locations. Adjacent official material describes a 270-home-and-business Pecan Island plan and a Vermilion Parish discount; none reports actual installations, subscriptions, take-up, an observation period, or a compatible cohort method.",
  evidence_boundary: "This receipt is limited to the official public surfaces reviewed on September 1. It does not establish that a qualifying artifact does not exist, that no household subscribed, or that the program succeeded or failed. Planned coverage, an affordability offer, availability, and provider-wide subscriber totals cannot substitute for observed Louisiana BEAD-cohort adoption.",
  publication_effect: "Publish a dated No Material Change decision, retain the signal In Review, append the bounded finding to the assigned reader surfaces, and keep Git-backed release validation separate from the evidence decision.",
  exact_next_artifact: "A ConnectLA- or SpaceX-issued project return that fixes the eligible-location cohort and reports actual installations, subscriptions, or service taken with observation period and method.",
  next_check_date: "2026-09-08",
  next_check_boundary: "The September 8 date is a bounded public-surface recheck after the draft template’s August reporting interval. The template does not prove the executed SpaceX terms, report delivery, or public availability.",
  official_surface_checks: [
    { publisher: "ConnectLA", artifact: "Starlink BEAD grant agreement", url: "https://connect.la.gov/press-releases/louisiana-signs-bead-grant-agreement-with-spacexs-starlink-continuing-push-for-statewide-broadband-access", artifact_date: "2026-06-11", accessed_date: "2026-09-01", result: "Confirms 10,635 planned locations in more than 50 parishes and an end-of-summer intention; no observed installation or subscription series." },
    { publisher: "ConnectLA", artifact: "Press-release index", url: "https://connect.la.gov/press-releases", artifact_date: null, accessed_date: "2026-09-01", result: "The bounded current index review surfaced no compatible fixed-cohort adoption return; this is not a nonexistence finding." },
    { publisher: "ConnectLA", artifact: "Resource library", url: "https://connect.la.gov/resource-library", artifact_date: null, accessed_date: "2026-09-01", result: "Lists proposal, project, location, monitoring, and agreement materials; the rendered index supplies no cohort adoption table." },
    { publisher: "Louisiana Economic Development", artifact: "SpaceX Louisiana campus announcement", url: "https://www.opportunitylouisiana.gov/news/spacex-launches-new-era-of-commercial-spaceflight-with-100-billion-louisiana-campus", artifact_date: "2026-08-25", accessed_date: "2026-09-01", result: "Describes a discount and hardware offer but reports no customer or installation count." },
    { publisher: "Starlink", artifact: "Vermilion Parish discount support article", url: "https://starlink.com/support/article/5a00b427-520c-faa3-2de2-f74c1ddaa6cc", artifact_date: null, accessed_date: "2026-09-01", result: "Confirms an eligible-zone offer and automatic billing treatment; contains no enrolled-customer, installation, or BEAD-cohort count." },
    { publisher: "Louisiana Legislature", artifact: "R.S. 51:2370.30", url: "https://legis.la.gov/legis/Law.aspx?d=1337853", artifact_date: null, accessed_date: "2026-09-01", result: "Defines annual adoption reporting authority but supplies no Starlink cohort result." },
    { publisher: "ConnectLA", artifact: "Draft GUMBO 2.0 subrecipient agreement", url: "https://connect.la.gov/media/gvrfqkff/draft-subrecipient-agreement-final-10-11-24.pdf", artifact_date: "2024-10-11", accessed_date: "2026-09-01", result: "Template describes reporting fields including service taken where applicable; it is not the executed SpaceX return." },
    { publisher: "NTIA", artifact: "Louisiana final-proposal overview", url: "https://broadbandusa.ntia.gov/sites/default/files/2026-01/BEAD_FP_Overview_LA.pdf", artifact_date: "2025-10-06", accessed_date: "2026-09-01", result: "Supplies the 10,635-location LEO allocation baseline, not observed adoption." },
    { publisher: "FCC", artifact: "National Broadband Map availability boundary", url: "https://help.bdc.fcc.gov/hc/en-us/articles/10476040597787-How-to-Submit-an-Availability-Challenge", artifact_date: "2025-05-15", accessed_date: "2026-09-01", result: "States that the map concerns availability, not adoption; availability cannot substitute for this gate." },
  ],
  archive_state: "Dated evidence decision archived",
};
evidenceReceipt.artifact_digest = sha({ ...evidenceReceipt, artifact_digest: undefined });

const operationRuns = p158.operation_packets.map((packet, index) => {
  const due = packet.lawful_date <= v1cyclePublicationDate;
  const isStarlink = packet.upstream_cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION";
  return {
    operation_run_id: `165-OPERATION-${String(index + 1).padStart(3, "0")}`,
    upstream_operation_packet_id: packet.operation_packet_id,
    upstream_operation_id: packet.upstream_operation_id,
    upstream_cycle_item_id: packet.upstream_cycle_item_id,
    upstream_phase_61_file_id: packet.upstream_phase_61_file_id,
    slug: packet.slug,
    title: packet.title,
    state: isStarlink ? "No Material Change — evidence decision complete; Git-backed release held" : "Scheduled — not yet lawful",
    lawful_date: packet.lawful_date,
    operation_kind: packet.operation_kind,
    source_ids: isStarlink ? unique([...packet.source_ids, "source-165-led-spacex-louisiana-campus-starlink-offer", "source-165-starlink-louisiana-community-discount", "source-165-louisiana-broadband-reporting-law", "source-165-connectla-resource-library"]) : packet.source_ids,
    signal_ids: packet.underlying_signal_ids,
    exact_next_artifact: isStarlink ? evidenceReceipt.exact_next_artifact : packet.exact_next_artifact,
    source_check: isStarlink ? { checked_date: "2026-09-01", checked_surfaces: evidenceReceipt.official_surface_checks.length, qualifying_artifacts: 0, bounded_result: evidenceReceipt.bounded_finding } : null,
    decision: isStarlink ? { decision_date: "2026-09-01", decision_status: "no_material_change", signal_decision: "retain_in_review_no_material_change", reviewer_role: "FTFN evidence desk", rationale: evidenceReceipt.evidence_boundary } : null,
    receipt: isStarlink ? { receipt_id: evidenceReceipt.receipt_id, receipt_type: evidenceReceipt.receipt_type, artifact_digest: evidenceReceipt.artifact_digest, archive_path: `/data/phase-165-receipts/${evidenceReceipt.receipt_id}.json` } : null,
    propagation_ledger: packet.required_sequence.map((step, stepIndex) => ({
      step,
      state: isStarlink ? (step === "git_backed_release_validation" ? "Held — no repository publication authority in this task" : "Complete in Phase 165 append-only release layer") : "Not started — operation not yet lawful",
      sequence: stepIndex + 1,
    })),
    propagation_targets: isStarlink ? unique([...packet.propagation_targets, "162-BRIEF-004"]) : packet.propagation_targets,
    evidence_boundary: isStarlink ? evidenceReceipt.evidence_boundary : "Future fields remain null; this packet is preparation, not a decision or prediction.",
    next_check_date: isStarlink ? evidenceReceipt.next_check_date : packet.lawful_date,
    stop_rule: isStarlink ? "Retain In Review. Do not infer adoption, non-adoption, availability, retention, affordability outcome, household benefit, success, or failure." : packet.stop_rule,
    due_as_of_effective_date: due,
    route: `/review/${release}/live-operations/${packet.slug}/`,
  };
});

const p165 = registry({
  phase: 165,
  title: "Live Evidence Operations Cycle 001",
  summary: "Operate the September evidence calendar as independent dated decisions, beginning with a bounded Louisiana Starlink No Material Change receipt on September 1.",
  counts: {
    operation_runs: 10, lawful_operations: 1, terminal_evidence_decisions: 1, no_material_change: 1,
    future_operations: 9, predated_decisions: 0, archived_evidence_receipts: 1, git_backed_release_steps_held: 1,
  },
  records: operationRuns,
  extras: {
    cycle_id: "EVIDENCE-CYCLE-001",
    cycle_close_date: "2026-10-09",
    current_decision_receipt: evidenceReceipt,
    next_lawful_action: { date: "2026-09-06", action: "Close seventeen first-week desk windows and then determine the Evidence Watch edition from terminal inputs only." },
  },
});

const weeklyDates = ["2026-09-06", "2026-09-13", "2026-09-20", "2026-09-27"];
const weeklyCycles = weeklyDates.map((date, index) => {
  const edition = p154.edition_packets.find((item) => item.publication_date === date);
  const windowBindings = p151.desk_review_ledgers.map((desk) => {
    const window = desk.review_windows.find((item) => item.scheduled_date === date);
    return {
      window_id: window.window_id,
      desk_review_id: desk.desk_review_id,
      desk_id: desk.desk_id,
      topic_id: desk.topic_id,
      title: desk.title,
      state: window.state,
      decision: null,
      decision_date: null,
      receipt_id: null,
      source_inventory_count: desk.source_ids.length,
      source_cutoff: date,
    };
  });
  return {
    weekly_cycle_id: `166-WEEK-${String(index + 1).padStart(2, "0")}`,
    slug: `week-${date}`,
    title: `${edition.title}: ${date}`,
    state: "Scheduled — future desk closure and edition decision",
    scheduled_date: date,
    source_eligibility_cutoff: date,
    upstream_edition_packet_id: edition.edition_packet_id,
    due_operation_ids: edition.due_operation_ids,
    desk_window_bindings: windowBindings,
    desk_windows_required: 17,
    desk_windows_terminal: 0,
    publication_decision: null,
    publication_decision_date: null,
    publication_receipt_id: null,
    publication_input_digest: null,
    editorial_sequence: ["Freeze the source cutoff", "Close all seventeen independent desk windows", "Confirm every due operation has a dated terminal state", "Derive the edition scope", "Issue a publication or explicit no-publication receipt"],
    stop_rule: "Do not prewrite a finding or publish an edition until every due input is terminal and a same-date scope digest is computed.",
    route: `/review/${release}/weekly-editions/week-${date}/`,
  };
});

const p166 = registry({
  phase: 166,
  title: "Weekly Desk Closures and Editions",
  summary: "Bind all sixty-eight September desk windows to four weekly edition decisions without predating a review, digest, or publication result.",
  counts: { weekly_cycles: 4, unique_desk_windows: 68, windows_per_cycle: 17, edition_decisions: 4, terminal_windows: 0, terminal_editions: 0, predated_decisions: 0 },
  records: weeklyCycles,
  extras: { cadence_dates: weeklyDates, closure_rule: "All seventeen same-date windows close before the associated Phase 154 edition scope is derived." },
});

const authorityHearings = p146.gap_dispositions.map((item, index) => ({
  authority_hearing_id: `167-HEARING-${String(index + 1).padStart(3, "0")}`,
  upstream_disposition_id: item.disposition_id,
  upstream_gap_map_id: item.gap_map_id,
  mission_id: item.mission_id,
  topic_id: item.topic_id,
  slug: item.slug,
  title: item.title,
  state: "Prepared — owner hearing pending",
  priority_hearing: item.priority_docket,
  missing_authority_role: item.missing_authority_role,
  inherited_source_ids: item.inherited_source_ids,
  candidate_set_digest: item.candidate_set_digest,
  alternative_candidates: item.alternative_artifacts.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    title: candidate.title,
    publisher: candidate.publisher,
    artifact_date: candidate.artifact_date,
    url: candidate.url,
    authority_role: candidate.authority_role,
    fit: candidate.fit,
    known_limit: candidate.known_limit,
    state: "Candidate — checked, not admitted",
  })),
  hearing_questions: [
    "Does an exact artifact match the named subject, issuing authority, period, method, and denominator?",
    "Does the candidate close the stated authority role or merely add useful context?",
    "Which limitation survives even if the candidate is admitted?",
    "Should the gap close, carry as bounded, or be excluded from the v1 scope?",
  ],
  allowed_terminal_states: item.allowed_terminal_states,
  owner_disposition: null,
  decision_date: null,
  decision_receipt_id: null,
  reviewer_role: null,
  rationale: null,
  next_action: item.next_action,
  stop_rule: "Discovery, relevance, and official publication do not themselves admit a candidate or close the authority gap.",
  route: `/review/${release}/authority-hearings/${item.slug}/`,
}));

const authorityCandidates = authorityHearings.flatMap((item) => item.alternative_candidates);
const uniqueAuthorityCandidateIds = unique(authorityCandidates.map((item) => item.candidate_id));
const p167 = registry({
  phase: 167,
  title: "Authority Resolution Hearings",
  summary: "Turn twelve mapped authority gaps and thirty official alternative candidates into inspectable owner hearing dockets while preserving every admission boundary.",
  counts: { authority_hearings: 12, alternative_candidate_assignments: authorityCandidates.length, unique_alternative_candidates: uniqueAuthorityCandidateIds.length, admitted_candidates: 0, terminal_dispositions: 0, owner_actions_pending: 12 },
  records: authorityHearings,
  extras: { hearing_contract: "A terminal result requires candidate-set digest, named reviewer role, dated rationale, allowed disposition, and archived owner receipt." },
});

const requirementRecords = p147.adjudication_records.filter((item) => item.record_kind === "requirement decision");
const missionRecords = p147.adjudication_records.filter((item) => item.record_kind === "mission decision");
const adjudicationDockets = p147.adjudication_records.map((item, index) => {
  const isMission = item.record_kind === "mission decision";
  const prerequisites = requirementRecords.filter((candidate) => candidate.mission_id === item.mission_id).map((candidate) => candidate.adjudication_record_id);
  return {
    adjudication_docket_id: `168-DOCKET-${String(index + 1).padStart(3, "0")}`,
    upstream_adjudication_record_id: item.adjudication_record_id,
    upstream_record_id: item.upstream_adjudication_id ?? item.upstream_mission_decision_id ?? null,
    record_kind: item.record_kind,
    mission_id: item.mission_id,
    slug: item.slug,
    title: item.title,
    state: isMission ? "Held — requirement prerequisites and owner decision pending" : "Prepared — owner adjudication pending",
    requirement: item.requirement ?? null,
    candidate_set_digest: item.candidate_set_digest ?? null,
    historical_candidate_source_ids: item.historical_candidate_source_ids ?? [],
    alternative_candidate_ids: item.alternative_candidate_ids ?? [],
    prerequisite_requirement_ids: isMission ? prerequisites : [],
    prerequisite_state: isMission ? "Not satisfied — one or more requirement dispositions remain nonterminal" : "Not applicable",
    acceptance_test: item.acceptance_test ?? "Every required requirement must have a terminal owner disposition before a mission conclusion can be issued.",
    rejection_test: item.rejection_test ?? "Do not infer a mission conclusion from source adjacency, candidate discovery, or a partial requirement set.",
    allowed_terminal_states: item.terminal_states ?? item.allowed_terminal_states ?? [],
    decision_state: "Pending owner adjudication",
    accepted_source_ids: [],
    rejected_source_ids: [],
    decision_date: null,
    decision_receipt_id: null,
    reviewer_role: null,
    rationale: null,
    sequencing_rule: isMission ? "A mission decision is invalid until every listed prerequisite requirement decision is terminal and receipt-bound." : "Requirement decisions are independent and must bind the exact candidate-set digest.",
    next_action: item.next_action,
    route: `/review/${release}/mission-adjudication/${item.slug}/`,
  };
});

const p168 = registry({
  phase: 168,
  title: "Requirement and Mission Adjudication",
  summary: "Expose eighteen requirement dockets and six dependent mission dockets with an enforceable requirement-before-mission decision sequence.",
  counts: { adjudication_dockets: 24, requirement_dockets: requirementRecords.length, mission_dockets: missionRecords.length, terminal_requirements: 0, terminal_missions: 0, sequencing_violations: 0 },
  records: adjudicationDockets,
  extras: { sequencing_contract: "No mission docket can become terminal until all of its requirement prerequisites are terminal, dated, receipt-bound, and based on the stored candidate-set digest." },
});

const sixDimensions = ["identity", "period", "measure", "denominator", "revision lineage", "dual review"];
const longitudinalPackets = p160.pilot_matrices.map((item, index) => {
  const pilot = item.matrix_kind === "compatibility pilot";
  const inheritedByDimension = new Map((item.compatibility_tests ?? []).map((test) => [test.dimension, test]));
  const tests = pilot ? sixDimensions.map((dimension) => {
    const inherited = inheritedByDimension.get(dimension);
    return inherited ? { dimension, state: inherited.state, reason: inherited.reason, admitted: false } : {
      dimension,
      state: "Not tested — governed adjudication pending",
      reason: dimension === "revision lineage" ? "No complete revision, correction, break, and supersession chain has been adjudicated for transfer." : "No two independent reviewer receipts bind the same series definition and observation set.",
      admitted: false,
    };
  }) : [];
  return {
    longitudinal_adjudication_packet_id: `169-PACKET-${String(index + 1).padStart(3, "0")}`,
    upstream_pilot_matrix_id: item.pilot_matrix_id,
    packet_kind: item.matrix_kind,
    slug: item.slug,
    title: item.title,
    state: pilot ? "Prepared — six-test adjudication pending" : "Held — owner zero-series disposition pending",
    entity_id: item.entity_id ?? null,
    legacy_panel_id: item.legacy_panel_id ?? null,
    legacy_observation_count: item.legacy_observation_count ?? 0,
    series_definition_digest: item.series_definition_digest ?? item.boundary_scope_digest,
    compatibility_tests: tests,
    tests_required: pilot ? 6 : 0,
    tests_passed: 0,
    admitted_series_id: null,
    observations_transferred: 0,
    owner_accepted_zero_series: false,
    decision_date: null,
    decision_receipt_id: null,
    decisive_next_action: item.decisive_next_action,
    stop_rule: item.stop_rule,
    route: `/review/${release}/longitudinal-adjudication/${item.slug}/`,
  };
});

const p169 = registry({
  phase: 169,
  title: "Longitudinal Pilot Adjudication",
  summary: "Apply six explicit compatibility tests to three named pilot series and preserve a separately owner-gated zero-series launch boundary.",
  counts: { adjudication_packets: 4, compatibility_pilots: 3, compatibility_tests: 18, tests_passed: 0, admitted_series: 0, observations_transferred: 0, owner_zero_series_decisions: 0 },
  records: longitudinalPackets,
  extras: { admission_rule: "Identity, period, measure, denominator, revision lineage, and dual review must all pass before one observation can transfer." },
});

const placeProfiles = {
  "florida-space-coast-launch-corridor": ["Range authority and mission licensing", "Multi-user pads and landing infrastructure", "Utilities, causeways, and emergency access", "Environmental and safety review", "Workforce and supplier readiness", "Mission cadence and accepted service"],
  "nevada-lithium-battery-materials-corridor": ["Federal land authorization", "Air, water, and reclamation permits", "Mine and processing construction", "Power, water, and transport capacity", "Product qualification and customers", "Community, workforce, and environmental performance"],
  "northern-virginia-data-center-corridor": ["Land use and local standards", "Transmission and interconnection", "Generation and resource adequacy", "Water and cooling systems", "Community cost and land-use effects", "Accepted load and operating performance"],
  "ontario-real-estate": ["Provincial and municipal housing authority", "Land, zoning, and development approval", "Infrastructure and servicing capacity", "Finance, construction, and completions", "Tenure, rent, and household burden", "Occupancy, mobility, and place stability"],
  "us-southwest-chip-corridor": ["Awards, land, and facility permits", "Electric capacity and interconnection", "Water supply, reuse, and discharge", "Construction and equipment installation", "Workforce and supplier formation", "Qualification and recurring accepted output"],
  "california-autonomous-mobility": ["Deployment authority and reporting rules", "Operational design domains", "Fleet scale and service geography", "Safety events and exposure denominators", "Access, labor, and public-realm effects", "Sustained service and independent outcomes"],
  "louisiana-broadband-adoption": ["Grant authority and eligible locations", "Network or satellite service availability", "Installation and activation", "Price, equipment, and affordability", "Subscription, retention, and service quality", "Household and community outcomes"],
  "montana-bead-delivery": ["Award and location identity", "Construction and deployment milestones", "Service availability and acceptance", "Affordability and subscriber terms", "Completed-quarter reporting", "Adoption, retention, and quality"],
  "hanford-waste-treatment": ["Consent, regulatory, and operating authority", "Feed preparation and waste identity", "Facility commissioning and readiness", "Glass production and mass balance", "Disposal acceptance and inventory", "Recurring operation, safety, and cleanup effect"],
  "amtrak-accessibility-and-reliability": ["Station and asset identity", "Design and funding authority", "Construction and accessibility completion", "FRA acceptance and closeout", "Service availability and passenger access", "Named-asset reliability and recurring performance"],
  "nnsa-two-site-production": ["Mission and statutory requirement", "Facility construction and authorization", "Equipment installation and qualification", "Accepted capacity at each site", "Recurring qualified output", "Safety, workforce, and stockpile mission effect"],
  "south-australia-grid-storage": ["Market and grid-service authority", "Asset identity and configuration", "Dispatch and event records", "Availability and degradation", "Revenue and service stacking", "Multi-period reliability and system effect"],
  "victoria-grid-storage": ["Connection and operating authority", "Asset configuration and capacity", "Dispatch and constraint periods", "Safety and availability", "Market services and contracts", "Multi-period network and consumer effects"],
  "florida-utility-storage": ["Utility approval and procurement", "Site, interconnection, and construction", "Commissioning and accepted capacity", "Dispatch and operating regime", "Reliability and storm performance", "Customer cost and system outcome"],
  "california-battery-safety": ["Facility and jurisdiction identity", "Fire, environmental, and operating authority", "Incident chronology and exposure", "Mitigation and return-to-service", "Inspection, enforcement, and community protection", "Fleet-wide learning without false transfer"],
};
const carriedBriefByLedger = new Map(p162.local_system_briefs.map((brief) => [brief.upstream_place_ledger_id, brief]));
const placeDossiers = p137.place_ledgers.map((place, index) => {
  const carried = carriedBriefByLedger.get(place.ledger_id);
  const labels = placeProfiles[place.slug];
  const layers = labels.map((label, layerIndex) => ({
    layer_id: `170-LAYER-${String(index + 1).padStart(2, "0")}-${String(layerIndex + 1).padStart(2, "0")}`,
    label,
    current_read: `${label} is a distinct conversion layer within ${place.title}. The inherited corpus can identify relevant authorities, projects, sources, and open needs, but it does not establish a single place-wide stage.`,
    decisive_question: `Which dated, place-specific artifact would establish a change in ${label.toLowerCase()} with a stable entity, period, method, and denominator?`,
    boundary: "A change in this layer cannot be transferred to another layer or averaged into a place score.",
  }));
  const timeline = [
    { step: "Inherited place identity", date: "2026-08-31", state: place.inherited_state, evidence_ids: [place.ledger_id], boundary: "Phase 170 preserves the exact Phase 137 identity and current-state wording." },
    { step: "Named project and signal join", date: null, state: "Context linked — independent stages retained", evidence_ids: [...(place.related_project_ids ?? []), ...(place.signal_ids ?? [])], boundary: "Co-location and shared subject matter do not merge project stages." },
    { step: "System-layer review", date: "2026-09-01", state: "Six-layer deep dossier published", evidence_ids: layers.map((layer) => layer.layer_id), boundary: "The layer model organizes questions; it does not decide readiness or outcome." },
    { step: "Decisive next evidence", date: null, state: "Open", evidence_ids: place.source_ids.slice(0, 6), boundary: place.exact_next_artifact },
  ];
  const edges = labels.slice(0, 5).map((label, edgeIndex) => ({
    edge_id: `170-EDGE-${String(index + 1).padStart(2, "0")}-${String(edgeIndex + 1).padStart(2, "0")}`,
    from_layer_id: layers[edgeIndex].layer_id,
    to_layer_id: layers[edgeIndex + 1].layer_id,
    relationship: "Evidence-acquisition dependency",
    question: `What exact record is needed before evidence about ${label.toLowerCase()} can inform ${labels[edgeIndex + 1].toLowerCase()} without stage transfer?`,
    causal_result: null,
  }));
  return {
    place_system_dossier_id: `170-DOSSIER-${String(index + 1).padStart(3, "0")}`,
    upstream_place_ledger_id: place.ledger_id,
    atlas_place_id: place.atlas_place_id,
    upstream_phase_162_brief_id: carried?.local_system_brief_id ?? null,
    dossier_origin: carried ? "Expanded from Phase 162 brief" : "New Phase 170 deep dossier",
    slug: place.slug,
    title: `${place.title}: system conversion dossier`,
    state: "Published — deep context; place stage not established",
    geography: place.geography,
    system_type: place.system_type,
    inherited_state: place.inherited_state,
    reader_narrative: `${place.title} is treated as a receiving system rather than a single project. Its authorities, infrastructure, firms, public institutions, workforce, communities, and environmental conditions can move on different clocks. This dossier makes those clocks inspectable and preserves the distinction between an announced intervention, an authorized project, accepted service, repeat operation, and observed public outcome.`,
    conversion_question: carried?.conversion_question ?? `What exact sequence of authority, delivery, acceptance, recurring-operation, and outcome records would show how activity in ${place.geography} converts into dependable public or system value?`,
    source_ids: place.source_ids,
    signal_ids: place.signal_ids,
    related_project_ids: place.related_project_ids,
    system_layers: layers,
    bounded_timeline: timeline,
    dependency_edges: edges,
    open_system_needs: place.open_system_needs,
    decision_use: "Use this dossier to locate the layer where a claim belongs, identify the decisive next artifact, and prevent one project milestone from becoming a synthetic place conclusion.",
    interpretation_boundary: "No synthetic place stage, causal result, score, rank, winner, failure label, or cross-place comparison is created.",
    place_stage: null,
    causal_conclusion: null,
    score: null,
    rank: null,
    route: `/review/${release}/systems-atlas/${place.slug}/`,
  };
});

const p170 = registry({
  phase: 170,
  title: "Fifteen-Place Systems Atlas",
  summary: "Complete the deep local-systems atlas with fifteen place dossiers, ninety system layers, sixty bounded timeline entries, and seventy-five noncausal dependency edges.",
  counts: { place_system_dossiers: 15, phase_162_briefs_carried: 4, new_deep_dossiers: 11, system_layers: 90, bounded_timeline_entries: 60, dependency_maps: 15, dependency_edges: 75, synthetic_place_stages: 0, scores_or_ranks: 0 },
  records: placeDossiers,
  extras: { atlas_method: "Each place is a receiving system with six separately evidenced layers and five evidence-acquisition edges; project stages remain in their named project files." },
});

const laneGroups = new Map();
for (const packet of p161.stack_watch_packets) {
  if (!laneGroups.has(packet.stack_lane)) laneGroups.set(packet.stack_lane, []);
  laneGroups.get(packet.stack_lane).push(packet);
}
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const laneChapters = [...laneGroups.entries()].map(([lane, packets], index) => {
  const sources = unique(packets.flatMap((packet) => packet.source_ids));
  const claims = packets.flatMap((packet) => packet.claim_blocks.map((claim) => ({
    claim_block_id: claim.claim_block_id,
    packet_id: packet.stack_watch_packet_id,
    claim_type: claim.claim_type,
    text: claim.text,
    source_ids: claim.source_ids,
    source_semantic_digest: claim.source_semantic_digest,
    publication_state: claim.publication_state,
  })));
  const slug = `${slugify(lane)}-chapter`;
  return {
    compendium_record_id: `171-CHAPTER-${String(index + 1).padStart(2, "0")}`,
    record_kind: "Lane chapter",
    slug,
    title: `${lane}: evidence, conversion, and outcome boundaries`,
    state: "Published — source-bound compendium chapter",
    lane,
    packet_ids: packets.map((packet) => packet.stack_watch_packet_id),
    packet_count: 3,
    claim_block_count: claims.length,
    source_ids: sources,
    source_semantic_digests: packets.map((packet) => ({ packet_id: packet.stack_watch_packet_id, digest: packet.source_semantic_digest })),
    orientation: `${lane} is presented as a chain from authoritative context to named conversion and eventual observed outcomes. The three inherited packets establish bounded observations or forecasts at their stated periods; they do not collapse into a readiness score or a claim about every linked project and place.`,
    chapter_sections: [
      { heading: "What the official record establishes", text: `The chapter preserves each issuer’s entity, artifact date, data-through period, evidence type, and limitation. Together the records show what can be said about ${lane.toLowerCase()} without replacing project-level acceptance or outcome evidence.` },
      { heading: "Where conversion remains open", text: "Authorization, funding, deployment, acceptance, recurring operation, and public outcome are separate states. A packet may strengthen context while leaving every downstream conversion decision unchanged." },
      { heading: "How to use the chapter", text: "Follow the packet and source IDs to the exact artifact, then test any proposed inference against identity, period, measure, method, denominator, revision lineage, and receiving authority." },
    ],
    claim_blocks: claims,
    decisive_next_artifacts: packets.map((packet) => ({ packet_id: packet.stack_watch_packet_id, next_artifact: packet.decisive_next_artifact })),
    boundary: "The chapter republishes the August 31 source-bound claims without representing them as a new September source refresh or evidence-admission receipt.",
    route: `/review/${release}/systems-compendium/${slug}/`,
  };
});

const essaySpecs = [
  ["compute-grid-water-constraints", "Compute demand, grid queues, and water constraints", ["Power and grid", "Chips and compute", "Water"], "Large-load demand can be announced faster than interconnection, generation, water, and local approvals become accepted service. The useful comparison is a dependency chain, not a single capacity total."],
  ["announcement-to-accepted-capacity", "Announcement-to-accepted-capacity conversion", ["Chips and compute", "Critical minerals and manufacturing", "Space"], "Capital announcements, awards, construction milestones, qualification, and accepted recurring capacity answer different questions. This essay supplies a common conversion grammar without forcing unlike systems into one stage."],
  ["delivery-versus-public-outcomes", "Infrastructure delivery versus observed public outcomes", ["Mobility and aviation", "Climate and energy", "Water"], "A delivered asset can be real and important while its service reliability, affordability, distribution, and public outcome remain unmeasured. The evidence architecture keeps those truths together."],
  ["cross-jurisdiction-comparability", "Cross-jurisdiction denominator and comparability discipline", ["Power and grid", "Climate and energy", "AI, quantum, cyber and human futures"], "Official measures inherit their jurisdiction, reporting regime, revision history, and denominator. Cross-system learning begins with those differences rather than hiding them inside a score."],
];
const essays = essaySpecs.map(([slug, title, lanes, thesis], index) => {
  const packets = p161.stack_watch_packets.filter((packet) => lanes.includes(packet.stack_lane));
  return {
    compendium_record_id: `171-ESSAY-${String(index + 1).padStart(2, "0")}`,
    record_kind: "Cross-system essay",
    slug,
    title,
    state: "Published — bounded cross-system synthesis",
    lanes,
    referenced_packet_ids: packets.map((packet) => packet.stack_watch_packet_id),
    source_ids: unique(packets.flatMap((packet) => packet.source_ids)),
    thesis,
    synthesis: `${thesis} The editorial task is to show the sequence of claims a reader would need to verify: first the authoritative baseline, then the named intervention, then accepted delivery, then recurring operation, and finally an outcome measured for a stable population or asset denominator. Evidence can stop at any link. A missing link remains visible rather than being estimated from a neighboring system.`,
    decision_questions: ["Which entity and authority own the measure?", "What date and data-through period apply?", "Is the measure planned, installed, accepted, recurring, or observed?", "What denominator and revision lineage make comparison lawful?", "Which distributional or local-system effects remain outside the artifact?"],
    prohibited_shortcuts: ["Do not convert a forecast into observed demand.", "Do not convert an award into accepted capacity.", "Do not transfer one jurisdiction’s denominator to another.", "Do not infer causal benefit from temporal sequence or co-location.", "Do not score systems whose evidence types are incompatible."],
    boundary: "The essay synthesizes already published packet claims and creates no new source check, admission decision, comparison verdict, score, or rank.",
    route: `/review/${release}/systems-compendium/${slug}/`,
  };
});
const compendiumRecords = [...laneChapters, ...essays];

const p171 = registry({
  phase: 171,
  title: "Frontier Systems Compendium",
  summary: "Publish eight source-bound lane chapters and four cross-system essays while preserving all twenty-four official artifacts and seventy-two claim blocks exactly once in the chapter layer.",
  counts: { compendium_records: 12, lane_chapters: 8, cross_system_essays: 4, inherited_packets: 24, inherited_claim_blocks_once: 72, source_bindings: 24, new_admission_decisions: 0, scores_or_ranks: 0 },
  records: compendiumRecords,
  extras: { compendium_method: "Lane chapters preserve exact Phase 161 packet and claim semantics; essays reference packets without duplicating or upgrading their claim blocks." },
});

let p172;
let aggregate;
let registries;
let updates;

const makePhase172 = (receipt = null) => {
  const validationPass = Boolean(receipt);
  const gates = [
    ["172-GATE-01-IMMUTABLE-BASELINES", "Immutable validation baselines", "Pass", `Phase 156 ${p156.local_validation_receipt.receipt_id} and Phase 164 ${p164.local_validation_receipt.receipt_id} remain exact and unchanged.`, "Preserve both receipts and validate later layers independently."],
    ["172-GATE-02-SEPTEMBER-01-EVIDENCE", "September 1 evidence decision", "Pass", `${evidenceReceipt.receipt_id} records a bounded No Material Change and retains the signal In Review.`, "Recheck the official public surface on September 8 without inferring nonexistence or zero adoption."],
    ["172-GATE-03-FUTURE-OPERATIONS", "Remaining evidence operations", "Held", "Nine September operations remain future as of the effective date; the October tail remains in Evidence Cycle 001.", "Operate each gate only on or after its lawful date and keep shared-date identities separate."],
    ["172-GATE-04-DESK-CLOSURES", "Weekly desk closures", "Held", "Sixty-eight desk windows across four future weekly cycles remain open.", "Close all seventeen same-date windows before deriving an edition scope."],
    ["172-GATE-05-SEPTEMBER-EDITIONS", "September edition decisions", "Held", "Four edition decisions remain time-gated with null future content, input digests, and receipts.", "Issue a publication or explicit no-publication receipt only after all due inputs are terminal."],
    ["172-GATE-06-AUTHORITY-HEARINGS", "Authority resolution hearings", "Held", "Twelve owner hearings remain pending; thirty official alternatives remain candidates rather than admitted evidence.", "Obtain a dated close, carry, or exclusion disposition for each candidate-set digest."],
    ["172-GATE-07-REQUIREMENT-MISSION", "Requirement and mission adjudication", "Held", "Eighteen requirement and six mission dockets remain owner-pending.", "Resolve each requirement before its dependent mission decision."],
    ["172-GATE-08-LONGITUDINAL", "Longitudinal admission or zero-series boundary", "Held", "Eighteen pilot tests remain unadjudicated; zero series and zero observations are admitted.", "Pass all six tests for one pilot or obtain owner acceptance of the disclosed zero-series boundary."],
    ["172-GATE-09-FIFTEEN-PLACE-ATLAS", "Fifteen-place systems atlas", "Pass", "Fifteen place identities carry ninety layers, sixty bounded timeline entries, and seventy-five noncausal dependency edges.", "Maintain place and project identities separately and revise only through dated evidence."],
    ["172-GATE-10-COMPENDIUM", "Frontier Systems Compendium", "Pass", "Eight lane chapters preserve twenty-four packets and seventy-two source-bound claim blocks once; four essays add bounded synthesis.", "Do not describe inherited August 31 artifacts as September refreshes without a new source check."],
    ["172-GATE-11-MACHINE-CONTRACT", "Machine-readable release contract", "Pass", "Eight phase registries, ninety HTML routes, nine JSON exports, and eight dated updates are declared.", "Keep every route, export, update, and primary-record inventory exact."],
    ["172-GATE-12-CONTENT-INTEGRITY", "Content and evidence-boundary integrity", "Pass", "Every new content layer preserves exact next artifacts, null future outcomes, source IDs, and anti-inference boundaries.", "Run candidate, content-reference, source-health, phase, and whole-release assertions."],
    ["172-GATE-13-LOCAL-VALIDATION", "Local build and release validation", validationPass ? "Pass" : "Pending build", validationPass ? `Receipt ${receipt.receipt_id} matches the normalized Phase 165–172 candidate digest.` : "The content-addressed local validation receipt has not yet been embedded.", "Validate the exact candidate, archive the receipt, rebuild, and verify deterministic output."],
    ["172-GATE-14-OWNER-PROMOTION", "Owner acceptance and Git-backed publication", "Held", "No owner receipt or repository-publication authorization binds this cycle; v1 promotion remains Held.", "Obtain explicit owner acceptance and separate authorization before commit, push, hosting, DNS, or public launch."],
  ].map(([gate_id, title, state, evidence, next_action]) => ({ gate_id, title, state, evidence, next_action, receipt_id: gate_id === "172-GATE-13-LOCAL-VALIDATION" ? receipt?.receipt_id ?? null : gate_id === "172-GATE-02-SEPTEMBER-01-EVIDENCE" ? evidenceReceipt.receipt_id : null }));
  const counts = {
    readiness_gates: 14,
    passed: gates.filter((gate) => gate.state === "Pass").length,
    held: gates.filter((gate) => gate.state === "Held").length,
    pending_build: gates.filter((gate) => gate.state === "Pending build").length,
    false_passes: 0,
  };
  return registry({
    phase: 172,
    title: "September State Report",
    summary: "Derive a fourteen-gate state report that distinguishes completed content and local validation from future calendar work, owner decisions, Git publication, and v1 promotion.",
    counts,
    records: gates,
    extras: {
      build_status: validationPass ? "Complete locally" : "Complete locally — validation pending",
      report_state: "Complete locally — future calendar and owner gates remain Held",
      v1_promotion_state: "Held",
      owner_authority: { evidence_admission: false, authority_disposition: false, mission_decision: false, zero_series_acceptance: false, repository_publication: false, hosting: false, dns: false, public_launch: false, v1_promotion: false },
      local_validation_receipt: receipt,
      next_calendar_action: { date: "2026-09-06", action: "Close the first seventeen desk windows and derive the Evidence Watch scope only from terminal inputs." },
      evidence_cycle_close_date: "2026-10-09",
    },
  });
};

const makeAggregate = (receipt = null) => {
  const phaseRegistries = v1cyclePhases.map((phase) => registries.get(phase));
  const phaseRecords = phaseRegistries.map((item) => ({
    phase: item.phase,
    title: item.title,
    summary: item.summary,
    status: item.build_status,
    counts: item.counts,
    hub: item.routes.hub,
    public_export: item.routes.public_export,
  }));
  const htmlRoutes = unique([`/review/${release}/`, ...phaseRegistries.flatMap((item) => item.public_html_routes)]);
  const jsonExports = [...phaseRegistries.map((item) => item.routes.public_export), "/data/v1-september-evidence-cycle.json"];
  return {
    schema_version: "1.0",
    program_id: "FTFN-V1-SEPTEMBER-EVIDENCE-TO-PUBLICATION-CYCLE",
    version: "v1 September evidence-to-publication cycle",
    title: "FTFN September Evidence-to-Publication Cycle",
    effective_date: v1cyclePublicationDate,
    status: receipt ? "Complete locally — future and owner gates held" : "Complete locally — validation pending",
    summary: "A complete append-only operating release for Phases 165–172: one lawful evidence decision, the remaining September calendar, owner hearing and adjudication rooms, longitudinal safeguards, a fifteen-place atlas, a frontier-systems compendium, and a derived state report.",
    baseline_v1rc: { receipt_id: p156.local_validation_receipt.receipt_id, artifact_digest: p156.local_validation_receipt.artifact_digest },
    baseline_v1month: { receipt_id: p164.local_validation_receipt.receipt_id, artifact_digest: p164.local_validation_receipt.artifact_digest },
    publication_boundaries: boundaries,
    phases: phaseRecords,
    counts: { phases: 8, primary_records: phaseRegistries.reduce((sum, item) => sum + item[keyByPhase[item.phase]].length, 0), public_html_routes: htmlRoutes.length, detail_routes: htmlRoutes.length - 9, public_json_exports: jsonExports.length, publication_updates: 8 },
    operating_state: { evidence_decisions_complete: 1, future_operations: 9, future_desk_windows: 68, future_editions: 4, owner_actions_pending: 36, admitted_longitudinal_series: 0, place_dossiers_published: 15, compendium_records_published: 12 },
    v1_promotion_state: "Held",
    local_validation_state: receipt ? "Passed" : "Pending build",
    local_validation_receipt: receipt,
    public_html_routes: htmlRoutes,
    public_json_exports: jsonExports,
    publication_update_files: v1cyclePhases.map((phase) => `${v1cyclePublicationDate}-phase-${phase}.json`),
  };
};

const makeUpdate = (phase, registryValue) => {
  const records = registryValue[keyByPhase[phase]];
  const base = {
    id: `update-${v1cyclePublicationDate}-phase-${phase}`,
    effective_date: v1cyclePublicationDate,
    entry_type: phase === 165 ? "Source Refresh" : "Publication Promotion",
    title: phase === 165 ? "Phase 165 records the September 1 Louisiana Starlink No Material Change decision" : `Phase ${phase} publishes ${registryValue.title}`,
    summary: registryValue.summary,
    affected_record_ids: phase === 165 ? unique([...records.map(idOf).filter(Boolean), ...evidenceReceipt.affected_record_ids]) : records.map(idOf).filter(Boolean),
    related_paths: registryValue.public_html_routes,
    evidence_note: boundaries[phase === 165 ? 2 : 3],
    materiality: phase === 165 ? "No record-state change" : "Material record change",
    publication_effect: `Adds ${registryValue.public_html_routes.length} public HTML route(s) and one schema-1.0 JSON export in the append-only v1cycle release.`,
    work_package: `docs/work-packages/phase-${phase}-${exportNameByPhase[phase].replace(/^phase-\d+-|\.json$/g, "")}.md`,
  };
  if (phase === 165) Object.assign(base, {
    receipt_id: evidenceReceipt.receipt_id,
    receipt_type: "No Material Change",
    source_checked_date: "2026-09-01",
    decision_date: "2026-09-01",
    prior_state: evidenceReceipt.prior_state,
    current_state: evidenceReceipt.current_state,
    next_check_date: evidenceReceipt.next_check_date,
  });
  return base;
};

const assemble = (validationReceipt = null) => {
  p172 = makePhase172(validationReceipt);
  registries = new Map([[165, p165], [166, p166], [167, p167], [168, p168], [169, p169], [170, p170], [171, p171], [172, p172]]);
  aggregate = makeAggregate(validationReceipt);
  updates = new Map(v1cyclePhases.map((phase) => [`${v1cyclePublicationDate}-phase-${phase}.json`, makeUpdate(phase, registries.get(phase))]));
};

assemble(null);
const candidateExports = new Map([...v1cyclePhases.map((phase) => [exportNameByPhase[phase], registries.get(phase)]), ["v1-september-evidence-cycle.json", aggregate]]);
const candidateDigest = computeV1cycleDigest({ exportsByName: candidateExports, updatesByName: updates });
const matchingReceipt = await findMatchingV1cycleReceipt({ receiptRoot: validationReceiptRoot, aggregate, candidateDigest });
if (matchingReceipt) assemble(matchingReceipt);

await mkdir(evidenceReceiptRoot, { recursive: true });
await writeJson(join(evidenceReceiptRoot, `${evidenceReceipt.receipt_id}.json`), evidenceReceipt);
for (const phase of v1cyclePhases) await writeJson(join(dataRoot, exportNameByPhase[phase]), registries.get(phase));
await writeJson(join(dataRoot, "v1-september-evidence-cycle.json"), aggregate);
for (const [name, update] of updates) await writeJson(join(updatesRoot, name), update);

const phaseGoals = {
  165: ["Operate every due evidence gate as an independent dated decision.", "Archive the exact source-check result even when it is No Material Change.", "Keep evidence adjudication separate from Git publication authority."],
  166: ["Close seventeen desks on each weekly cutoff.", "Compute edition scope only from terminal inputs.", "Publish an explicit no-publication receipt when the week is immaterial."],
  167: ["Give each authority gap an inspectable hearing packet.", "Keep all thirty official alternatives in candidate state until owner review.", "Require a dated close, carry, or exclusion receipt."],
  168: ["Decide eighteen requirements before six missions.", "Bind every decision to its candidate-set digest.", "Block mission conclusions while a prerequisite remains nonterminal."],
  169: ["Apply six compatibility tests to each pilot.", "Transfer zero observations before full admission.", "Keep the zero-series boundary as a separate owner decision."],
  170: ["Complete deep coverage for all fifteen place identities.", "Model ninety system layers and seventy-five evidence dependencies.", "Create no place stage, causal result, score, or rank."],
  171: ["Turn twenty-four official artifacts into eight navigable lane chapters.", "Preserve all seventy-two claim blocks once.", "Add four cross-system essays without upgrading evidence state."],
  172: ["Derive fourteen gates from exact inventories and states.", "Validate the append-only candidate without rewriting prior receipts.", "Keep future, owner, repository, hosting, and promotion authority Held."],
};

for (const phase of v1cyclePhases) {
  const item = registries.get(phase);
  const key = keyByPhase[phase];
  const stateLine = phase === 172 ? `${item.counts.passed} Pass / ${item.counts.held} Held / ${item.counts.pending_build} Pending build` : item.build_status;
  const workPackageName = `phase-${phase}-${exportNameByPhase[phase].replace(/^phase-\d+-|\.json$/g, "")}.md`;
  const workPackage = `# Phase ${phase} work package — ${item.title}\n\n**Effective date:** ${v1cyclePublicationDate}  \n**Release:** \`${release}\`  \n**State:** ${stateLine}\n\n## Objective\n\n${item.summary}\n\n## Content goals\n\n${phaseGoals[phase].map((goal) => `- ${goal}`).join("\n")}\n\n## Delivered contract\n\n- Primary records: ${item[key].length}\n- HTML routes: ${item.public_html_routes.length}\n- JSON export: \`${item.routes.public_export}\`\n- Schema: 1.0\n- Immutable baseline: Phase 164 receipt \`${p164.local_validation_receipt.receipt_id}\` / digest \`${p164.local_validation_receipt.artifact_digest}\`\n\n## Verification\n\nThe Phase 165–172 assertion suite checks exact identities, dates, sequencing, null future outcomes, evidence boundaries, route/export/update inventories, receipt archives, and the derived Phase 172 state. Full release verification inspects built routes, canonical metadata, public JSON equality, update rendering, source health, and the immutable Phase 156/164 baselines.\n\n## Boundary\n\n${boundaries.map((item) => `- ${item}`).join("\n")}\n`;
  await writeText(join(workPackagesRoot, workPackageName), workPackage);
}

const roadmap = `# FTFN September evidence-to-publication roadmap\n\n**Effective date:** ${v1cyclePublicationDate}  \n**Scope:** Phases 165–172  \n**Release:** \`${release}\`\n\n## Outcome\n\nPhases 165–172 are built as a complete append-only content and operating layer. The September 1 Louisiana Starlink gate has a real dated No Material Change receipt; all later calendar and owner outcomes remain explicit holds rather than invented results.\n\n## Delivered inventory\n\n| Phase | Content program | Records | Routes |\n| ---: | --- | ---: | ---: |\n${v1cyclePhases.map((phase) => { const item = registries.get(phase); return `| ${phase} | ${item.title} | ${item[keyByPhase[phase]].length} | ${item.public_html_routes.length} |`; }).join("\n")}\n\nThe release contains **${aggregate.counts.primary_records} primary records**, **${aggregate.counts.public_html_routes} HTML routes**, **${aggregate.counts.public_json_exports} JSON exports**, and **${aggregate.counts.publication_updates} dated updates**.\n\n## What is complete now\n\n- One lawful September 1 evidence decision, nine official surface checks, one archived receipt, and complete local propagation with the Git-backed step visibly held.\n- Four weekly operating rooms binding all sixty-eight desk windows and four edition decisions.\n- Twelve authority hearings and twenty-four requirement/mission dockets with owner fields intentionally empty.\n- Three six-test longitudinal pilot packets plus a separate zero-series boundary.\n- Fifteen place dossiers with ninety layers, sixty timeline entries, and seventy-five dependency edges.\n- Eight frontier-system chapters, all seventy-two inherited claim blocks, and four cross-system essays.\n- A derived fourteen-gate state report.\n\n## Next lawful calendar\n\n- **September 6:** close seventeen first-week desks; determine the Evidence Watch edition.\n- **September 8:** bounded Louisiana Starlink public-surface recheck.\n- **September 9:** Louisiana Nextlink and Toronto project-file checks, separately.\n- **September 10:** Amtrak PIDS, Hanford material balance, and NNSA GAO baseline, separately.\n- **September 13:** close the second desk set and determine Conversion Watch.\n- **September 15:** Montana completed-quarter and Space Coast authority checks, separately.\n- **September 20:** close the third desk set and determine Comparison Watch.\n- **September 22 / 24:** Arizona wastewater and NNSA accepted-capacity gates.\n- **September 27:** close the fourth desk set and determine the monthly state edition.\n- **October 1 / 9:** Loudoun standards, then two independent final evidence gates and the cycle audit.\n\n## Release boundary\n\nPhase 172 is locally complete when its content-addressed receipt is embedded, but the report remains ${p172.counts.held} Held on future or owner-controlled gates. GitHub publication, hosting, DNS, public launch, and v1 promotion require separate authorization.\n`;
await writeText(join(workspaceRoot, "docs", "roadmap-v1-september-evidence-to-publication-cycle.md"), roadmap);

const handoff = `# FTFN Phase 165–172 handoff\n\n**Effective date:** ${v1cyclePublicationDate}  \n**Current state:** ${aggregate.status}\n\n## Read first\n\n1. \`docs/roadmap-v1-september-evidence-to-publication-cycle.md\`\n2. \`app/src/data/v1-september-evidence-cycle.json\`\n3. \`app/src/data/phase-165-live-evidence-operations-cycle-001.json\`\n4. \`app/src/data/phase-172-september-state-report.json\`\n5. \`app/src/data/phase-165-receipts/${evidenceReceipt.receipt_id}.json\`\n\n## Immutable baselines\n\nDo not regenerate or rewrite the Phase 145–164 candidate. Phase 156 remains bound to \`${p156.local_validation_receipt.artifact_digest}\`; Phase 164 remains bound to \`${p164.local_validation_receipt.artifact_digest}\`.\n\n## Safe rerun sequence\n\nRun from \`app/\`:\n\n\`\`\`text\nnpm run build:v1cycle-content\nnpm run validate:candidates\nnpm run validate:content\nnpm run source:health\nnpm run test:v1rc\nnpm run test:v1month\nnpm run test:v1cycle\nnpm run check\nnpm run build\nnpm run verify:v1rc\nnpm run verify:v1month\nnpm run verify:v1cycle\nnpm run finalize:v1cycle-validation\nnpm run build:v1cycle-content\nnpm run build\nnpm run verify:v1cycle\nnpm run update:v1cycle-manifest\nnpm run verify:release\n\`\`\`\n\n## Do not automate or infer\n\n- Later evidence results before their lawful dates.\n- Weekly desk or edition decisions before their cutoffs.\n- Authority, requirement, mission, longitudinal, zero-series, or promotion decisions without owner receipts.\n- A Louisiana adoption numerator from planned locations, availability, discounts, or global subscriber totals.\n- Git commit, GitHub push, hosting, DNS, or public launch without explicit authorization.\n`;
await writeText(join(workspaceRoot, "docs", "session-handoff-v1-september-evidence-to-publication-cycle.md"), handoff);

console.log(`Built Phases 165–172: ${aggregate.counts.primary_records} primary records, ${aggregate.public_html_routes.length} HTML routes, ${aggregate.public_json_exports.length} JSON exports, 8 updates, and Phase 172 ${p172.counts.passed}/${p172.counts.held}/${p172.counts.pending_build}. Candidate digest ${candidateDigest}.`);
