import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { projectCarryoverLedger } from "./lib/phase173-live-projection.mjs";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(appRoot, "src", "data");
const updatesDir = path.join(appRoot, "src", "content", "updates");
const effectiveDate = "2026-09-01";

const readJson = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const writeJson = (name, value) => {
  fs.writeFileSync(path.join(dataDir, name), `${JSON.stringify(value, null, 2)}\n`);
};
const digest = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const slugifyId = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const phase60 = readJson("phase-60-operating-cycle.json");
const phase60Propagation = readJson("phase-60-propagation-contract.json");
const phase67Envelopes = readJson("phase-67-evidence-return-envelope-ledger.json");
const phase165 = readJson("phase-165-live-evidence-operations-cycle-001.json");
const phase166 = readJson("phase-166-weekly-desk-closures-and-editions.json");
const phase167 = readJson("phase-167-authority-resolution-hearings.json");
const phase168 = readJson("phase-168-requirement-mission-adjudication.json");
const phase169 = readJson("phase-169-longitudinal-pilot-adjudication.json");

const makeRecord = (record) => ({
  ...record,
  source_snapshot_date: effectiveDate,
  decision_status: record.decision_status ?? null,
  decision_date: record.decision_date ?? null,
  receipt_id: record.receipt_id ?? null,
  release_state: record.release_state ?? "Held",
  record_digest: digest({
    carryover_id: record.carryover_id,
    record_class: record.record_class,
    upstream_record_id: record.upstream_record_id,
    scheduled_date: record.scheduled_date,
    trigger_kind: record.trigger_kind,
    decision_status: record.decision_status ?? null,
    decision_date: record.decision_date ?? null,
    receipt_id: record.receipt_id ?? null,
  }),
});

const operationRecords = phase165.operation_runs.map((operation) => {
  let recordClass = "evidence_gate";
  if (operation.operation_run_id === "165-OPERATION-009") recordClass = "project_file_recheck";
  if (operation.operation_run_id === "165-OPERATION-010") recordClass = "companion_recheck";

  return makeRecord({
    carryover_id: `173-CARRY-${operation.operation_run_id}`,
    record_class: recordClass,
    trigger_kind: "calendar",
    upstream_record_id: operation.operation_run_id,
    upstream_cycle_item_id: operation.upstream_cycle_item_id,
    upstream_phase_61_file_id: operation.upstream_phase_61_file_id,
    title: operation.title,
    scheduled_date: operation.lawful_date,
    source_ids: operation.source_ids,
    affected_record_ids: operation.propagation_targets,
    exact_next_artifact: operation.exact_next_artifact,
    exact_next_action:
      operation.receipt?.receipt_id
        ? `Preserve ${operation.receipt.receipt_id}; perform only the separately scheduled bounded recheck.`
        : `On ${operation.lawful_date}, inspect current official primary sources for the exact artifact and issue one dated receipt.`,
    decision_status: operation.decision?.decision_status,
    decision_date: operation.decision?.decision_date,
    receipt_id: operation.receipt?.receipt_id,
    release_state: operation.receipt?.receipt_id
      ? operation.propagation_ledger?.at(-1)?.state.includes("Held")
        ? "Held — content complete, Git not authorized"
        : "Verified"
      : "Held — future operation",
    evidence_boundary: operation.evidence_boundary,
    source_path: "app/src/data/phase-165-live-evidence-operations-cycle-001.json",
  });
});

const cycleById = new Map(phase60.records.map((record) => [record.cycle_item_id, record]));
const starlink = cycleById.get("60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
const darpa = cycleById.get("60-CYCLE-DARPA-RESULTS");

const companionRecords = [
  makeRecord({
    carryover_id: "173-CARRY-STARLINK-2026-09-08",
    record_class: "companion_recheck",
    trigger_kind: "calendar",
    upstream_record_id: "60-CYCLE-LOUISIANA-STARLINK-ADOPTION",
    upstream_cycle_item_id: "60-CYCLE-LOUISIANA-STARLINK-ADOPTION",
    upstream_phase_61_file_id: null,
    title: "Louisiana Starlink bounded adoption recheck",
    scheduled_date: "2026-09-08",
    source_ids: phase165.operation_runs[0].source_ids,
    affected_record_ids: phase165.operation_runs[0].propagation_targets,
    exact_next_artifact: starlink.exact_next_artifact,
    exact_next_action:
      "On September 8, recheck current ConnectLA and SpaceX primary surfaces for a fixed-cohort observed installation, subscription, or service-taken return; issue a dated receipt even when unchanged.",
    release_state: "Held — future companion recheck",
    evidence_boundary:
      "This is a companion recheck of an already completed Cycle 001 gate, not a fourteenth cycle item and not evidence of adoption or non-adoption.",
    source_path: "app/src/data/phase-60-operating-cycle.json",
  }),
  makeRecord({
    carryover_id: "173-CARRY-DARPA-2026-09-23",
    record_class: "companion_recheck",
    trigger_kind: "calendar",
    upstream_record_id: "60-CYCLE-DARPA-RESULTS",
    upstream_cycle_item_id: "60-CYCLE-DARPA-RESULTS",
    upstream_phase_61_file_id: null,
    title: "DARPA Lift Challenge measured-results reconciliation",
    scheduled_date: "2026-09-23",
    source_ids: darpa.source_ids,
    affected_record_ids: [
      ...darpa.canonical_dossier_ids,
      ...darpa.reader_pathway_ids,
      ...darpa.dependency_map_ids,
      "briefing-outcomes-watch-001-what-actually-changed",
      "briefing-evidence-cycle-001-operating-baseline",
    ],
    exact_next_artifact: darpa.exact_next_artifact,
    exact_next_action:
      "On September 23, reconcile the official results artifact and any correction or later final-results record; issue a separate dated companion receipt only if the check is performed.",
    release_state: "Held — future companion recheck",
    evidence_boundary:
      "The August 23 result remains terminal. This recheck can append a correction or No Material Change receipt but cannot silently replace that decision and does not add a Cycle 001 identity.",
    source_path: "app/src/data/phase-60-operating-cycle.json",
  }),
];

const deskWindowRecords = phase166.weekly_cycles.flatMap((weeklyCycle) =>
  weeklyCycle.desk_window_bindings.map((window) =>
    makeRecord({
      carryover_id: `173-CARRY-${window.window_id}`,
      record_class: "desk_window",
      trigger_kind: "calendar",
      upstream_record_id: window.window_id,
      weekly_cycle_id: weeklyCycle.weekly_cycle_id,
      title: window.title,
      topic_id: window.topic_id,
      scheduled_date: window.source_cutoff,
      source_ids: [],
      affected_record_ids: [window.desk_review_id, window.desk_id, weeklyCycle.weekly_cycle_id],
      exact_next_artifact: `A terminal ${window.topic_id} desk review bound to the ${window.source_cutoff} source cutoff, with a dated receipt.`,
      exact_next_action: `Freeze the ${window.source_cutoff} source inventory and record a terminal desk decision before the weekly edition is derived.`,
      decision_status: window.decision,
      decision_date: window.decision_date,
      receipt_id: window.receipt_id,
      release_state: "Held — future desk closure",
      evidence_boundary:
        "A scheduled desk window contains no editorial result and cannot be counted as a publication decision.",
      source_path: "app/src/data/phase-166-weekly-desk-closures-and-editions.json",
    }),
  ),
);

const editionRecords = phase166.weekly_cycles.map((weeklyCycle) =>
  makeRecord({
    carryover_id: `173-CARRY-${weeklyCycle.weekly_cycle_id}-EDITION`,
    record_class: "weekly_edition",
    trigger_kind: "calendar",
    upstream_record_id: weeklyCycle.weekly_cycle_id,
    title: weeklyCycle.title,
    scheduled_date: weeklyCycle.scheduled_date,
    source_eligibility_cutoff: weeklyCycle.source_eligibility_cutoff,
    upstream_edition_packet_id: weeklyCycle.upstream_edition_packet_id,
    due_operation_ids: weeklyCycle.due_operation_ids,
    desk_window_ids: weeklyCycle.desk_window_bindings.map((window) => window.window_id),
    source_ids: [],
    affected_record_ids: [
      weeklyCycle.upstream_edition_packet_id,
      ...weeklyCycle.due_operation_ids,
      ...weeklyCycle.desk_window_bindings.map((window) => window.window_id),
    ],
    exact_next_artifact:
      "Seventeen terminal same-cutoff desk receipts, their canonical input digest, and one publication or no-publication receipt.",
    exact_next_action:
      `After all seventeen ${weeklyCycle.scheduled_date} desk windows are terminal, derive scope from those inputs and issue exactly one edition decision.`,
    decision_status: weeklyCycle.publication_decision,
    decision_date: weeklyCycle.publication_decision_date,
    receipt_id: weeklyCycle.publication_receipt_id,
    release_state: "Held — future weekly decision",
    evidence_boundary:
      "No draft, scheduled edition, or partial desk set is a publication; no-publication is a valid receipted result.",
    source_path: "app/src/data/phase-166-weekly-desk-closures-and-editions.json",
  }),
);

const authorityRecords = phase167.authority_hearings.map((hearing) =>
  makeRecord({
    carryover_id: `173-CARRY-${hearing.authority_hearing_id}`,
    record_class: "authority_docket",
    trigger_kind: "owner",
    upstream_record_id: hearing.authority_hearing_id,
    title: hearing.title,
    scheduled_date: null,
    owner_trigger: "Named owner reviews the frozen candidate-set digest and archives an allowed dated disposition.",
    source_ids: hearing.inherited_source_ids,
    affected_record_ids: [hearing.upstream_disposition_id, hearing.upstream_gap_map_id, hearing.mission_id],
    exact_next_artifact: `An owner disposition bound to candidate-set digest ${hearing.candidate_set_digest}.`,
    exact_next_action: hearing.next_action,
    decision_status: hearing.owner_disposition,
    decision_date: hearing.decision_date,
    receipt_id: hearing.decision_receipt_id,
    release_state: "Held — owner authority required",
    evidence_boundary: hearing.stop_rule,
    source_path: "app/src/data/phase-167-authority-resolution-hearings.json",
  }),
);

const adjudicationRecords = phase168.adjudication_dockets.map((docket) =>
  makeRecord({
    carryover_id: `173-CARRY-${docket.adjudication_docket_id}`,
    record_class:
      docket.record_kind === "requirement decision" ? "requirement_docket" : "mission_docket",
    trigger_kind: "owner",
    upstream_record_id: docket.adjudication_docket_id,
    title: docket.title,
    scheduled_date: null,
    owner_trigger:
      docket.record_kind === "requirement decision"
        ? "Named owner applies the acceptance and rejection tests to the frozen candidate set."
        : "Named owner acts only after every prerequisite requirement is terminal and receipt-bound.",
    source_ids: docket.historical_candidate_source_ids,
    affected_record_ids: [docket.upstream_adjudication_record_id, docket.upstream_record_id, docket.mission_id].filter(Boolean),
    exact_next_artifact: docket.requirement,
    exact_next_action: docket.next_action,
    upstream_state: docket.decision_state,
    decision_status: null,
    decision_date: docket.decision_date,
    receipt_id: docket.decision_receipt_id,
    release_state: "Held — owner authority required",
    evidence_boundary: docket.sequencing_rule,
    source_path: "app/src/data/phase-168-requirement-mission-adjudication.json",
  }),
);

const longitudinalRecords = phase169.longitudinal_adjudication_packets.map((packet) =>
  makeRecord({
    carryover_id: `173-CARRY-${packet.longitudinal_adjudication_packet_id}`,
    record_class:
      packet.packet_kind === "zero-series launch boundary"
        ? "zero_series_owner_disposition"
        : "longitudinal_compatibility",
    trigger_kind: "owner",
    upstream_record_id: packet.longitudinal_adjudication_packet_id,
    title: packet.title,
    scheduled_date: null,
    owner_trigger:
      packet.packet_kind === "zero-series launch boundary"
        ? "Owner issues an explicit zero-series or compatible-series admission disposition."
        : "Two reviewers complete all six compatibility tests against the original artifacts.",
    source_ids: [],
    affected_record_ids: [packet.upstream_pilot_matrix_id, packet.entity_id, packet.legacy_panel_id].filter(Boolean),
    exact_next_artifact: packet.decisive_next_action,
    exact_next_action: packet.decisive_next_action,
    decision_status: null,
    decision_date: packet.decision_date,
    receipt_id: packet.decision_receipt_id,
    release_state: "Held — owner adjudication required",
    evidence_boundary: packet.stop_rule,
    source_path: "app/src/data/phase-169-longitudinal-pilot-adjudication.json",
  }),
);

const publicationControls = [
  ["REPOSITORY", "Repository publication", "Explicit authorization to commit and push the exact validated candidate."],
  ["HOSTING", "Hosted deployment", "Explicit authorization to publish the exact Git-backed candidate to the production host."],
  ["DNS", "DNS cutover", "Explicit authorization identifying the hostname and exact deployed release."],
  ["PUBLIC-LAUNCH", "Public launch", "Explicit launch authorization bound to the verified hosted release."],
  ["V1-PROMOTION", "v1 promotion", "Explicit owner acceptance of the exact candidate digest after all required gates pass."],
].map(([id, title, artifact]) =>
  makeRecord({
    carryover_id: `173-CARRY-PUBLICATION-${id}`,
    record_class: "publication_control",
    trigger_kind: "publication_authority",
    upstream_record_id: `172-OWNER-${id}`,
    title,
    scheduled_date: null,
    owner_trigger: artifact,
    source_ids: [],
    affected_record_ids: ["172-GATE-14-OWNER-PROMOTION"],
    exact_next_artifact: artifact,
    exact_next_action: `Keep ${title} Held until the owner supplies the exact authorization receipt.`,
    release_state: "Held — explicit authorization absent",
    evidence_boundary: `Local validation does not authorize ${title.toLowerCase()}.`,
    source_path: "app/src/data/phase-172-september-state-report.json",
  }),
);

const carryoverRecords = [
  ...operationRecords,
  ...companionRecords,
  ...deskWindowRecords,
  ...editionRecords,
  ...authorityRecords,
  ...adjudicationRecords,
  ...longitudinalRecords,
  ...publicationControls,
].map((record, index) => {
  const slug = slugifyId(record.carryover_id);
  return {
    carryover_id: record.carryover_id,
    sequence: index + 1,
    ...record,
    slug,
    route: `/review/v1oct/operating-foundation/${slug}/`,
  };
});

const phase173 = {
  schema_version: "1.0",
  phase: 173,
  program_id: "FTFN-PHASE-173",
  dataset: "phase_173_september_closeout_october_opening_ledger",
  title: "September Closeout and October Opening Ledger",
  effective_date: effectiveDate,
  build_status: "Complete locally",
  operating_status: "Open — future calendar and owner outcomes held",
  summary:
    "A cutoff-aware, append-only ledger that reconciles every September calendar, owner, longitudinal, and publication control while preserving immutable release snapshots.",
  publication_boundaries: [
    "This control plane preserves the immutable Phase 156, 164, and 172 snapshots and projects live state only from append-only dated receipts.",
    "A future calendar item remains future, an owner item remains Held, and an unsuccessful source search never establishes nonexistence.",
    "The September 23 DARPA companion recheck retains the original Cycle 001 identity and adds zero cycle gates.",
    "No future result, owner disposition, repository publication, hosted deployment, public launch, or v1 promotion is inferred."
  ],
  frozen_baselines: [
    {
      phase: 156,
      artifact_digest: "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a",
      mutation_allowed: false,
    },
    {
      phase: 164,
      artifact_digest: "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19",
      mutation_allowed: false,
    },
    {
      phase: 172,
      artifact_digest: "cdf822b6451e02523dbdcadfc0f21470011285033de55c919718785aaffd9b34",
      mutation_allowed: false,
    },
  ],
  cutoff_projection_contract: {
    timezone: "America/Edmonton",
    terminal_rule:
      "A record is terminal only when an allowed decision status, decision date, and receipt identity are all present and the decision date is not later than the projection cutoff.",
    due_rule: "An unresolved calendar record is Due on its scheduled date, not silently overdue.",
    overdue_rule: "An unresolved calendar record is Overdue only after its scheduled date passes.",
    owner_rule: "Owner and publication controls remain Held without a calendar-overdue inference.",
    append_only_rule:
      "Later source checks append receipt events and projections; they do not rewrite Phase 156, 164, or 172 or delete prior terminal events.",
    implementation: "app/scripts/lib/phase173-live-projection.mjs",
  },
  operator_contracts: {
    evidence_gate: {
      implementation: "app/scripts/lib/phase173-operators.mjs#validateEvidenceGateCommand",
      required_sequence: [
        "identity_lock",
        "lawful_date_check",
        "official_source_check",
        "dated_decision",
        "receipt_archive",
        "affected_record_propagation",
        "content_validation",
        "git_state_decision",
      ],
      refusal_codes: [
        "FUTURE_DATE",
        "PREDATED_DECISION",
        "DUPLICATE_RECEIPT",
        "MIXED_IDENTITY",
        "MIXED_DECISION_DATE",
        "MISMATCHED_DIGEST",
        "NO_SOURCE_CHECK",
        "NO_PROPAGATION_TARGETS",
      ],
    },
    weekly_closure: {
      implementation: "app/scripts/lib/phase173-operators.mjs#validateWeeklyClosureCommand",
      required_inputs: 17,
      allowed_results: ["published", "no_publication"],
      required_sequence: [
        "freeze_source_cutoff",
        "close_seventeen_desk_windows",
        "verify_terminal_receipts",
        "compute_input_digest",
        "derive_scope",
        "issue_publication_or_no_publication_receipt",
      ],
      refusal_codes: [
        "FUTURE_DATE",
        "INCOMPLETE_DESK_SET",
        "DUPLICATE_WINDOW",
        "NONTERMINAL_WINDOW",
        "MIXED_CUTOFF",
        "MISMATCHED_DIGEST",
        "DUPLICATE_RECEIPT",
      ],
    },
  },
  darpa_september_23_reconciliation: {
    reconciliation_state: "Reconciled — scheduled companion recheck, not a new cycle gate",
    companion_record_id: "173-CARRY-DARPA-2026-09-23",
    upstream_cycle_item_id: "60-CYCLE-DARPA-RESULTS",
    retained_terminal_receipt_id: darpa.receipt_id,
    scheduled_recheck_date: darpa.next_check_date,
    future_outcome: null,
    future_receipt_id: null,
    cycle_001_identity_delta: 0,
  },
  count_semantics: {
    authority_dockets: 12,
    requirement_dockets: 18,
    mission_dockets: 6,
    authority_requirement_mission_total: 36,
    longitudinal_compatibility_packets: 3,
    separate_zero_series_owner_dispositions: 1,
    combined_owner_controlled_backlog: 37,
    note:
      "The combined backlog count of 37 includes the separate zero-series disposition but excludes the three longitudinal compatibility packets and five publication controls.",
  },
  live_projection_at_effective_date: projectCarryoverLedger(carryoverRecords, effectiveDate),
  counts: {
    carryover_records: carryoverRecords.length,
    calendar_records: carryoverRecords.filter((record) => record.trigger_kind === "calendar").length,
    owner_held_records: carryoverRecords.filter((record) => record.trigger_kind === "owner").length,
    publication_held_records: carryoverRecords.filter((record) => record.record_class === "publication_control").length,
    terminal_at_effective_date: projectCarryoverLedger(carryoverRecords, effectiveDate).by_projection_state.terminal,
    future_at_effective_date: projectCarryoverLedger(carryoverRecords, effectiveDate).by_projection_state.future,
    silent_overdue_count: projectCarryoverLedger(carryoverRecords, effectiveDate).silent_overdue_count
  },
  append_events: [],
  carryover_records: carryoverRecords,
  routes: {
    hub: "/review/v1oct/operating-foundation/",
    public_export: "/data/phase-173-september-closeout-october-opening-ledger.json",
  },
  public_html_routes: [
    "/review/v1oct/operating-foundation/",
    ...carryoverRecords.map((record) => record.route),
  ],
  public_json_exports: [
    "/data/phase-173-september-closeout-october-opening-ledger.json",
  ],
};

const proofByCycleItem = new Map(
  phase60Propagation.cycle_decision_proofs.map((proof) => [proof.cycle_item_id, proof]),
);
const envelopeByCycleItem = new Map(
  phase67Envelopes.envelope_records.map((envelope) => [envelope.cycle_item_id, envelope]),
);

const cycleOneAuditItems = phase60.records.map((record, index) => {
  const proof = proofByCycleItem.get(record.cycle_item_id);
  const envelope = envelopeByCycleItem.get(record.cycle_item_id);
  const terminal = record.decision_status !== "scheduled";
  return {
    audit_item_id: `174-CYCLE1-AUDIT-${String(index + 1).padStart(2, "0")}`,
    cycle_item_id: record.cycle_item_id,
    target: record.target,
    scheduled_check_date: record.scheduled_check_date,
    exact_next_artifact: record.exact_next_artifact,
    source_ids: record.source_ids,
    affected_record_ids: [
      record.underlying_signal_id,
      ...record.canonical_dossier_ids,
      ...record.reader_pathway_ids,
      ...record.dependency_map_ids,
      ...record.local_system_ids,
      ...(envelope?.named_file_ids ?? []),
    ].filter(Boolean),
    audit_state: terminal ? "Terminal at September 1 cutoff" : "Held — scheduled gate not yet operated",
    decision_status: terminal ? record.decision_status : null,
    decision_date: terminal ? record.decision_date : null,
    receipt_id: terminal ? record.receipt_id : null,
    propagation_proof_id: terminal ? proof?.proof_id ?? null : null,
    propagation_status: terminal ? record.propagation_status : "not_started",
    git_backed_release_state:
      envelope?.envelope_state === "Release Verified"
        ? "Verified"
        : envelope?.git_backed_release_status === "held"
          ? "Held"
          : "Held — no lawful decision",
    next_action:
      terminal && record.next_check_date
        ? `Preserve the terminal receipt and perform the bounded companion recheck on ${record.next_check_date}.`
        : `On ${record.scheduled_check_date}, inspect the exact official artifact and issue one dated decision receipt.`,
    slug: `cycle-001-${slugifyId(record.cycle_item_id)}`,
    route: `/review/v1oct/cycle-closure-intake/cycle-001-${slugifyId(record.cycle_item_id)}/`,
  };
});

const cycleTwoCandidates = [
  {
    candidate_id: "174-CYCLE2-CANDIDATE-001",
    title: "NERC 2026 Long-Term Reliability Assessment",
    lane: "Power and grid",
    upstream_packet_id: "161-PACKET-001",
    primary_authority: "North American Electric Reliability Corporation",
    primary_authority_source_ids: ["source-161-nerc-ltra-2025"],
    exact_artifact: "The final NERC 2026 Long-Term Reliability Assessment and its region-level demand, resource, and risk tables.",
    event_trigger: "NERC publishes the final 2026 LTRA on its official reliability-assessment surface.",
    method_requirement: "Preserve each assessment area's demand forecast, planning-reserve method, scenario, and season.",
    denominator_requirement: "Use the named assessment-area peak-demand and resource-capacity denominators; do not aggregate unlike regions.",
    affected_record_ids: ["161-PACKET-001", "171-CHAPTER-01"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-002",
    title: "Queued Up next annual interconnection inventory",
    lane: "Power and grid",
    upstream_packet_id: "161-PACKET-002",
    primary_authority: "Lawrence Berkeley National Laboratory",
    primary_authority_source_ids: ["source-161-lbnl-queued-up-2026"],
    exact_artifact: "The next final Queued Up report and downloadable project-level workbook with a stated data cutoff.",
    event_trigger: "Berkeley Lab publishes the next Queued Up annual report and workbook on its official Electricity Markets & Policy surface.",
    method_requirement: "Retain project-status taxonomy, queue vintage, technology grouping, and treatment of hybrid projects.",
    denominator_requirement: "Report projects and nameplate capacity separately; never convert queued capacity into completed capacity.",
    affected_record_ids: ["161-PACKET-002", "171-CHAPTER-01", "171-ESSAY-01"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-003",
    title: "United States data-center electricity-use update",
    lane: "Chips and compute",
    upstream_packet_id: "161-PACKET-006",
    primary_authority: "United States Department of Energy and Lawrence Berkeley National Laboratory",
    primary_authority_source_ids: ["source-161-lbnl-data-center-energy-usage-2024"],
    exact_artifact: "A final DOE or Berkeley Lab update with observed national data-center electricity use, analysis year, model version, and scenario bounds.",
    event_trigger: "DOE or Berkeley Lab publishes a successor national data-center energy-use report or official data release.",
    method_requirement: "Separate observed baseline, model estimate, and forecast scenario and retain model-version lineage.",
    denominator_requirement: "Use national electricity consumption for the same year and method when reporting a share.",
    affected_record_ids: ["161-PACKET-006", "171-CHAPTER-02", "171-ESSAY-01"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-004",
    title: "Post-2026 Colorado River operations final decision",
    lane: "Water",
    upstream_packet_id: "161-PACKET-007",
    primary_authority: "United States Bureau of Reclamation",
    primary_authority_source_ids: ["source-161-usbr-colorado-river-2027-decision"],
    exact_artifact: "The signed Post-2026 Colorado River Operations Record of Decision and final operating alternative tables.",
    event_trigger: "The Bureau of Reclamation publishes the signed Record of Decision on its official Post-2026 operations surface.",
    method_requirement: "Bind every operating claim to the selected alternative, hydrologic condition, rule, and effective period.",
    denominator_requirement: "Retain acre-feet, reservoir elevation, basin, water year, and allocation identity exactly.",
    affected_record_ids: ["161-PACKET-007", "171-CHAPTER-03", "171-ESSAY-04"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-005",
    title: "WIFIA fiscal-year 2026 portfolio outcomes",
    lane: "Water",
    upstream_packet_id: "161-PACKET-009",
    primary_authority: "United States Environmental Protection Agency",
    primary_authority_source_ids: ["source-161-epa-wifia-2025-annual-report"],
    exact_artifact: "EPA's final WIFIA fiscal-year 2026 annual report with project, financing, construction, and population-benefit fields.",
    event_trigger: "EPA publishes the final fiscal-year 2026 WIFIA annual report on its official program-results surface.",
    method_requirement: "Separate closed loans, financed projects, construction progress, and reported outcomes by report vintage.",
    denominator_requirement: "Use EPA's stated project and population denominators without treating financing value as delivered infrastructure.",
    affected_record_ids: ["161-PACKET-009", "171-CHAPTER-03", "171-ESSAY-03"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-006",
    title: "Final 2025 United States traffic-fatality result",
    lane: "Mobility and aviation",
    upstream_packet_id: "161-PACKET-010",
    primary_authority: "National Highway Traffic Safety Administration",
    primary_authority_source_ids: ["source-161-nhtsa-road-fatalities-2025-estimate"],
    exact_artifact: "The final 2025 FARS fatality file and NHTSA final summary with vehicle-miles-traveled rate denominator.",
    event_trigger: "NHTSA releases final 2025 FARS data or a final 2025 traffic-fatality report.",
    method_requirement: "Distinguish early estimate, revised estimate, and final FARS result and retain revision lineage.",
    denominator_requirement: "Use fatalities and fatality rate per 100 million vehicle miles traveled for the same final period.",
    affected_record_ids: ["161-PACKET-010", "171-CHAPTER-04", "171-ESSAY-03"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-007",
    title: "AEMO next quarterly renewable and storage operations",
    lane: "Climate and energy",
    upstream_packet_id: "161-PACKET-015",
    primary_authority: "Australian Energy Market Operator",
    primary_authority_source_ids: ["source-161-aemo-q1-2026-qed"],
    exact_artifact: "The next final Quarterly Energy Dynamics report and workbook with interval, region, generation, price, and storage-operation tables.",
    event_trigger: "AEMO publishes the next final Quarterly Energy Dynamics report and data workbook.",
    method_requirement: "Preserve quarter, region, dispatch interval, technology category, and revision status.",
    denominator_requirement: "Use regional operational demand and generation denominators from the same quarter and data revision.",
    affected_record_ids: ["161-PACKET-015", "171-CHAPTER-05", "171-ESSAY-04"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-008",
    title: "FAA fiscal-year 2026 commercial space operations result",
    lane: "Space",
    upstream_packet_id: "161-PACKET-016",
    primary_authority: "Federal Aviation Administration Office of Commercial Space Transportation",
    primary_authority_source_ids: ["source-161-faa-aerospace-forecast-2026-2046"],
    exact_artifact: "An FAA final fiscal-year 2026 commercial launch and reentry operations table with completed-operation counts and definitions.",
    event_trigger: "FAA publishes a final fiscal-year 2026 commercial space operations result on an official AST surface.",
    method_requirement: "Separate forecast from completed licensed or permitted operation and retain launch/reentry classification.",
    denominator_requirement: "Use completed operations in the stated fiscal year; do not count licences, payloads, or planned missions as operations.",
    affected_record_ids: ["161-PACKET-016", "171-CHAPTER-06", "171-ESSAY-02"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-009",
    title: "Mineral Commodity Summaries 2027 import-reliance update",
    lane: "Critical minerals and manufacturing",
    upstream_packet_id: "161-PACKET-019",
    primary_authority: "United States Geological Survey",
    primary_authority_source_ids: ["source-usgs-mineral-commodity-summaries"],
    exact_artifact: "The final USGS Mineral Commodity Summaries 2027 publication and commodity tables with 2026 production and net-import-reliance estimates.",
    event_trigger: "USGS publishes Mineral Commodity Summaries 2027 on its official publications surface.",
    method_requirement: "Preserve commodity definition, estimate marker, revision status, and domestic-production method.",
    denominator_requirement: "Use apparent consumption and net-import-reliance definitions from the same commodity table and edition.",
    affected_record_ids: ["161-PACKET-019", "171-CHAPTER-07", "171-ESSAY-02"],
  },
  {
    candidate_id: "174-CYCLE2-CANDIDATE-010",
    title: "FBI 2026 Internet Crime Report",
    lane: "AI, quantum, cyber and human futures",
    upstream_packet_id: "161-PACKET-024",
    primary_authority: "Federal Bureau of Investigation Internet Crime Complaint Center",
    primary_authority_source_ids: ["source-161-fbi-ic3-2025-report"],
    exact_artifact: "The final FBI IC3 2026 Internet Crime Report with complaint, loss, category, age, and jurisdiction tables.",
    event_trigger: "The FBI publishes the final 2026 Internet Crime Report on its official IC3 surface.",
    method_requirement: "Retain complaint-based reporting scope, category definitions, reporting year, and revision status.",
    denominator_requirement: "Use submitted complaints and reported losses as defined by IC3; do not infer incident prevalence or population risk.",
    affected_record_ids: ["161-PACKET-024", "171-CHAPTER-08", "171-ESSAY-04"],
  },
].map((candidate) => ({
  ...candidate,
  slug: `cycle-002-${slugifyId(candidate.candidate_id)}`,
  route: `/review/v1oct/cycle-closure-intake/cycle-002-${slugifyId(candidate.candidate_id)}/`,
  candidate_state: "Prepared — intake only",
  lawful_date: null,
  source_checked_date: null,
  decision: null,
  decision_date: null,
  receipt_id: null,
  propagation_proof_id: null,
  git_backed_release_state: "Held",
  stop_rule:
    "Stop if the exact official artifact is absent, preliminary, method-incompatible, denominator-incompatible, or cannot be bound to the named identity; issue no outcome claim from an adjacent artifact.",
}));

const terminalCycleOneItems = cycleOneAuditItems.filter((item) => item.decision_status !== null);
const phase174 = {
  schema_version: "1.0",
  phase: 174,
  program_id: "FTFN-PHASE-174",
  dataset: "phase_174_evidence_cycle_001_closure_cycle_002_intake",
  title: "Evidence Cycle 001 Closure and Cycle 002 Intake",
  effective_date: effectiveDate,
  build_status: "Complete locally",
  operating_status: "Prepared — closure and all future evidence outcomes Held",
  summary:
    "A thirteen-identity closeout shell for Evidence Cycle 001 and a ten-candidate, official-authority intake for Cycle 002 without predated checks or outcomes.",
  cycle_001_closeout: {
    cycle_id: "evidence-cycle-001",
    earliest_lawful_close_date: "2026-10-09",
    current_state: "Held — ten cycle decisions remain scheduled",
    required_audit_items: 13,
    terminal_items_at_effective_date: terminalCycleOneItems.length,
    unresolved_items_at_effective_date: cycleOneAuditItems.length - terminalCycleOneItems.length,
    final_three_gate_ids: [
      "60-CYCLE-LOUDOUN-STANDARDS",
      "60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY",
      "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE",
    ],
    closure_rule:
      "Close only when all thirteen identities carry real dated decisions and receipts or contract-compliant bounded blocker/reschedule states, every propagation proof resolves, and Git state is reported separately.",
    closure_decision: null,
    closure_date: null,
    closure_receipt_id: null,
    next_action:
      "Operate each remaining gate on its lawful date, preserve shared-date identities separately, then run the thirteen-item audit after both October 9 decisions are terminal.",
    audit_items: cycleOneAuditItems,
  },
  cycle_002_intake: {
    cycle_id: "evidence-cycle-002-candidate-intake",
    intake_state: "Prepared — candidates are not admitted evidence gates",
    candidate_count: cycleTwoCandidates.length,
    candidate_range_contract: "Eight to twelve candidates",
    admission_rule:
      "A candidate becomes a scheduled gate only after human review confirms the exact artifact, official authority, lawful date or observable event trigger, method and denominator contract, affected-record set, capacity, and stop rule.",
    intake_decision: null,
    intake_decision_date: null,
    intake_receipt_id: null,
    candidates: cycleTwoCandidates,
  },
  counts: {
    cycle_001_audit_items: cycleOneAuditItems.length,
    cycle_001_terminal_at_effective_date: terminalCycleOneItems.length,
    cycle_001_scheduled_at_effective_date: cycleOneAuditItems.length - terminalCycleOneItems.length,
    cycle_001_final_october_gates: 3,
    cycle_002_candidates: cycleTwoCandidates.length,
    cycle_002_candidate_lanes: new Set(cycleTwoCandidates.map((candidate) => candidate.lane)).size,
    predated_cycle_001_decisions: 0,
    cycle_002_source_checks: 0,
    cycle_002_decisions: 0,
    cycle_002_receipts: 0,
  },
  publication_boundaries: [
    "The closeout shell is not a Cycle 001 closure receipt.",
    "A Cycle 002 candidate is not a source check, scheduled gate, evidence decision, or publication outcome.",
    "Future dates, source checks, decisions, receipts, propagation proofs, Git publication, deployment, and v1 promotion remain null or Held.",
    "Candidate intake reuses official source identities but does not claim that a successor artifact exists.",
  ],
  routes: {
    hub: "/review/v1oct/cycle-closure-intake/",
    public_export: "/data/phase-174-evidence-cycle-closure-intake.json",
  },
  public_html_routes: [
    "/review/v1oct/cycle-closure-intake/",
    ...cycleOneAuditItems.map((item) => item.route),
    ...cycleTwoCandidates.map((candidate) => candidate.route),
  ],
  public_json_exports: [
    "/data/phase-174-evidence-cycle-closure-intake.json",
  ],
};

writeJson("phase-173-september-closeout-october-opening-ledger.json", phase173);
writeJson("phase-174-evidence-cycle-closure-intake.json", phase174);
fs.writeFileSync(path.join(updatesDir, "2026-09-01-phase-173.json"), `${JSON.stringify({
  id: "update-2026-09-01-phase-173",
  effective_date: effectiveDate,
  entry_type: "Publication Promotion",
  title: "Phase 173 publishes the September closeout and October opening ledger",
  summary: "Adds a cutoff-aware 129-record carryover ledger, reconciles the September 23 DARPA companion recheck, and installs generalized evidence-gate and weekly-closure operators without predating a result.",
  affected_record_ids: phase173.carryover_records.map((record) => record.carryover_id),
  related_paths: [phase173.routes.hub],
  evidence_note: phase173.publication_boundaries[0],
  materiality: "Material record change",
  publication_effect: `Adds ${phase173.public_html_routes.length} local review routes and one schema-1.0 JSON export.`,
  work_package: "docs/work-packages/phase-173-september-closeout-and-october-opening-ledger.md"
}, null, 2)}\n`);
fs.writeFileSync(path.join(updatesDir, "2026-09-01-phase-174.json"), `${JSON.stringify({
  id: "update-2026-09-01-phase-174",
  effective_date: effectiveDate,
  entry_type: "Publication Promotion",
  title: "Phase 174 binds Cycle 001 closeout and Cycle 002 intake",
  summary: "Adds thirteen stable Cycle 001 audit identities and ten governed Cycle 002 candidate contracts across eight lanes, with all future source checks, outcomes, receipts, and Git states held.",
  affected_record_ids: [...phase174.cycle_001_closeout.audit_items.map((record) => record.audit_item_id), ...phase174.cycle_002_intake.candidates.map((record) => record.candidate_id)],
  related_paths: [phase174.routes.hub],
  evidence_note: phase174.publication_boundaries[0],
  materiality: "Material record change",
  publication_effect: `Adds ${phase174.public_html_routes.length} local review routes and one schema-1.0 JSON export.`,
  work_package: "docs/work-packages/phase-174-evidence-cycle-001-closure-and-cycle-002-intake.md"
}, null, 2)}\n`);

console.log(
  `Built Phase 173 (${phase173.carryover_records.length} carryover records) and Phase 174 (${cycleOneAuditItems.length} audit items, ${cycleTwoCandidates.length} Cycle 002 candidates).`,
);
