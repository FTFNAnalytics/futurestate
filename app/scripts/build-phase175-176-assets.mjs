import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const appRoot = join(scriptRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");

const sourceFiles = {
  146: "phase-146-authority-gap-resolution-program.json",
  147: "phase-147-evidence-adjudication-record.json",
  159: "phase-159-owner-decision-sprint.json",
  160: "phase-160-longitudinal-pilot-matrices.json",
  167: "phase-167-authority-resolution-hearings.json",
  168: "phase-168-requirement-mission-adjudication.json",
  169: "phase-169-longitudinal-pilot-adjudication.json",
};

const expectedSourceFileDigests = {
  146: "507ce309124c0f70fb5d2b581baf999fed0a257a40c60c5b39c5695fb7a4bad4",
  147: "eeee03f1b7d22038d424430238e728740f4cac4d2f618c7823566a0c6d3021df",
  159: "fb9fc090003a3b5e788b78a4506b3642389a64507af119d4d36b6d4a69155f18",
  160: "2ab2f4528b82e222e88d307e6885e73f40ebf84304a247995dcbe928f0166dc5",
  167: "5325e4add3700ebd51a0caae56476921b5e9f0ac004a5660f2ca74d8e39aaa4f",
  168: "8eb7b382dadea59809935b7a23fa291186adb147e8e3ab4dcd177f0f10828d20",
  169: "988dcca30d8ae8ccabf533d2a25864f025aefcbfde6a91875f30de84137aaf16",
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
};
const recordDigest = (value) => sha256(JSON.stringify(stable(value)));
const pad = (value, width = 3) => String(value).padStart(width, "0");
const writeJson = (name, value) => writeFile(join(dataRoot, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const writeUpdate = (name, value) => writeFile(join(updatesRoot, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const indexBy = (records, key) => new Map(records.map((record) => [record[key], record]));
const requireRecord = (map, key, label) => {
  const record = map.get(key);
  if (!record) throw new Error(`Missing ${label} ${key}.`);
  return record;
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const phase175Hub = "/review/v1oct/owner-dispositions/";
const phase175PublicExport = "/data/phase-175-owner-disposition-sprint-ii.json";
const phase176Hub = "/review/v1oct/longitudinal-decisions/";
const phase176PublicExport = "/data/phase-176-longitudinal-admission-and-zero-series-decision.json";

const sources = {};
const sourceFileBindings = {};
for (const [phaseText, fileName] of Object.entries(sourceFiles)) {
  const phase = Number(phaseText);
  const path = join(dataRoot, fileName);
  const bytes = await readFile(path);
  const digest = sha256(bytes);
  assert(digest === expectedSourceFileDigests[phase], `Phase ${phase} upstream file digest changed: ${digest}.`);
  const value = JSON.parse(bytes.toString("utf8"));
  sources[phase] = value;
  sourceFileBindings[phase] = {
    phase,
    program_id: value.program_id,
    dataset: value.dataset,
    path: `app/src/data/${fileName}`,
    sha256: digest,
  };
}

const immutableBaselineBindings = [
  {
    phase: 156,
    receipt_id: "156-LOCAL-VALIDATION-2026-08-31-a750bba9528e",
    artifact_digest: "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a",
  },
  {
    phase: 164,
    receipt_id: "164-LOCAL-VALIDATION-2026-09-01-d2846dc22604",
    artifact_digest: "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19",
  },
  {
    phase: 172,
    receipt_id: "172-LOCAL-VALIDATION-2026-09-01-65326aad9d30",
    artifact_digest: "cdf822b6451e02523dbdcadfc0f21470011285033de55c919718785aaffd9b34",
  },
];

const phase146ById = indexBy(sources[146].gap_dispositions, "disposition_id");
const phase159Actions = sources[159].authority_mission_boards.flatMap((board) =>
  board.owner_actions.map((action) => ({ board, action })),
);
const phase159ByUpstreamId = new Map(phase159Actions.map((item) => [item.action.upstream_record_id, item]));
const phase168ByUpstreamId = indexBy(sources[168].adjudication_dockets, "upstream_adjudication_record_id");

assert(sources[146].gap_dispositions.length === 12, "Phase 175 requires exactly twelve Phase 146 authority dispositions.");
assert(phase159Actions.length === 36, "Phase 175 requires exactly thirty-six Phase 159 owner actions.");
assert(sources[167].authority_hearings.length === 12, "Phase 175 requires exactly twelve Phase 167 hearings.");
assert(sources[168].adjudication_dockets.length === 24, "Phase 175 requires exactly twenty-four Phase 168 dockets.");

const receiptTemplate = (allowedOutcomes) => ({
  required_fields: [
    "receipt_id",
    "owner_disposition_packet_id",
    "candidate_set_digest",
    "owner_outcome",
    "decision_date",
    "reviewer_role",
    "rationale",
    "bounded_search_scope",
    "limitation_statement",
    "next_action",
  ],
  allowed_owner_outcomes: allowedOutcomes,
  receipt_id: null,
  owner_outcome: null,
  decision_date: null,
  reviewer_role: null,
  rationale: null,
  bounded_search_scope: null,
  limitation_statement: null,
});

const authorityPackets = sources[167].authority_hearings.map((hearing, index) => {
  const disposition = requireRecord(phase146ById, hearing.upstream_disposition_id, "Phase 146 disposition");
  const actionItem = requireRecord(phase159ByUpstreamId, hearing.upstream_disposition_id, "Phase 159 authority action");
  const { board, action } = actionItem;
  assert(action.action_kind === "authority disposition", `${action.action_id} is not an authority disposition.`);
  assert(disposition.candidate_set_digest === hearing.candidate_set_digest, `${hearing.authority_hearing_id} changed the Phase 146 candidate-set digest.`);
  assert(action.candidate_set_digest === hearing.candidate_set_digest, `${action.action_id} changed the authority candidate-set digest.`);
  const packetId = `175-AUTHORITY-${pad(index + 1)}`;
  const dependentDockets = sources[168].adjudication_dockets.filter((item) => item.mission_id === hearing.mission_id);
  return {
    owner_disposition_packet_id: packetId,
    docket_action_number: index + 1,
    action_kind: "authority disposition",
    decision_sequence: 1,
    mission_id: hearing.mission_id,
    topic_id: hearing.topic_id,
    slug: hearing.slug,
    title: hearing.title,
    packet_state: "Prepared — owner disposition pending",
    candidate_set_digest: hearing.candidate_set_digest,
    upstream_records: [
      { phase: 146, record_id: disposition.disposition_id, record_sha256: recordDigest(disposition) },
      { phase: 159, record_id: board.mission_board_id, record_sha256: recordDigest(board) },
      { phase: 159, parent_record_id: board.mission_board_id, record_id: action.action_id, record_sha256: recordDigest(action) },
      { phase: 167, record_id: hearing.authority_hearing_id, record_sha256: recordDigest(hearing) },
    ],
    missing_authority_role: hearing.missing_authority_role,
    historical_source_ids: hearing.inherited_source_ids,
    alternative_candidate_ids: hearing.alternative_candidates.map((item) => item.candidate_id),
    alternative_candidates: hearing.alternative_candidates,
    candidates_admitted: 0,
    hearing_questions: hearing.hearing_questions,
    allowed_owner_outcomes: hearing.allowed_terminal_states,
    owner_outcome: null,
    decision_date: null,
    decision_receipt_id: null,
    reviewer_role: null,
    rationale: null,
    receipt_template: receiptTemplate(hearing.allowed_terminal_states),
    propagation_targets: {
      authority_record_ids: [disposition.disposition_id, action.action_id, hearing.authority_hearing_id],
      mission_board_id: board.mission_board_id,
      dependent_docket_ids: dependentDockets.map((item) => item.adjudication_docket_id),
    },
    propagation_state: "Not started — no owner outcome",
    next_action: hearing.next_action,
    stop_rule: hearing.stop_rule,
    route: `${phase175Hub}${hearing.slug}/`,
  };
});

const requirementRecords = sources[147].adjudication_records.filter((item) => item.record_kind === "requirement decision");
const authorityPacketNumbersByRequirementIndex = [1, 1, 1, 3, 3, 3, 4, 4, 4, 6, 6, 6, 9, 9, 9, 11, 11, 11];
const requirementPackets = requirementRecords.map((record, index) => {
  const actionItem = requireRecord(phase159ByUpstreamId, record.adjudication_record_id, "Phase 159 requirement action");
  const docket = requireRecord(phase168ByUpstreamId, record.adjudication_record_id, "Phase 168 requirement docket");
  const { board, action } = actionItem;
  assert(action.action_kind === "requirement decision", `${action.action_id} is not a requirement decision.`);
  assert(record.candidate_set_digest === action.candidate_set_digest, `${action.action_id} changed the Phase 147 candidate-set digest.`);
  assert(record.candidate_set_digest === docket.candidate_set_digest, `${docket.adjudication_docket_id} changed the Phase 147 candidate-set digest.`);
  const dependentMissionDocket = sources[168].adjudication_dockets.find(
    (item) => item.record_kind === "mission decision" && item.prerequisite_requirement_ids.includes(record.adjudication_record_id),
  );
  const prerequisiteAuthorityPacket = authorityPackets[authorityPacketNumbersByRequirementIndex[index] - 1];
  assert(prerequisiteAuthorityPacket, `${record.adjudication_record_id} lacks its authority prerequisite packet.`);
  const requirementReceiptTemplate = receiptTemplate(record.terminal_states);
  requirementReceiptTemplate.required_fields.push("prerequisite_authority_receipt_id");
  requirementReceiptTemplate.prerequisite_authority_receipt_id = null;
  return {
    owner_disposition_packet_id: `175-REQUIREMENT-${pad(index + 1)}`,
    docket_action_number: authorityPackets.length + index + 1,
    action_kind: "requirement decision",
    decision_sequence: 2,
    mission_id: record.mission_id,
    slug: record.slug,
    title: record.title,
    requirement: record.requirement,
    packet_state: "Held — authority prerequisite and owner adjudication pending",
    prerequisite_authority_packet_id: prerequisiteAuthorityPacket.owner_disposition_packet_id,
    prerequisite_authority_state: "Not satisfied — authority outcome and receipt remain null",
    prerequisite_authority_receipt_id: null,
    candidate_set_digest: record.candidate_set_digest,
    upstream_records: [
      { phase: 147, record_id: record.adjudication_record_id, record_sha256: recordDigest(record) },
      { phase: 159, record_id: board.mission_board_id, record_sha256: recordDigest(board) },
      { phase: 159, parent_record_id: board.mission_board_id, record_id: action.action_id, record_sha256: recordDigest(action) },
      { phase: 168, record_id: docket.adjudication_docket_id, record_sha256: recordDigest(docket) },
    ],
    historical_candidate_source_ids: record.historical_candidate_source_ids,
    alternative_candidate_ids: record.alternative_candidate_ids,
    accepted_source_ids: [],
    rejected_source_ids: [],
    acceptance_test: record.acceptance_test,
    rejection_test: record.rejection_test,
    allowed_owner_outcomes: record.terminal_states,
    owner_outcome: null,
    decision_date: null,
    decision_receipt_id: null,
    reviewer_role: null,
    rationale: null,
    receipt_template: requirementReceiptTemplate,
    propagation_targets: {
      requirement_record_ids: [record.adjudication_record_id, action.action_id, docket.adjudication_docket_id],
      mission_board_id: board.mission_board_id,
      dependent_mission_docket_id: dependentMissionDocket?.adjudication_docket_id ?? null,
    },
    propagation_state: "Not started — no owner outcome",
    next_action: record.next_action,
    stop_rule: "Candidate discovery or relevance does not satisfy the requirement. Refuse a terminal requirement result until the exact prerequisite authority packet is terminal, dated, receipt-bound, and digest-matched; the requirement receipt must also bind this exact candidate-set digest.",
    route: `${phase175Hub}${record.slug}/`,
  };
});

const requirementPacketByUpstreamId = new Map(requirementPackets.map((packet) => [packet.upstream_records[0].record_id, packet]));
const missionRecords = sources[147].adjudication_records.filter((item) => item.record_kind === "mission decision");
const missionPackets = missionRecords.map((record, index) => {
  const actionItem = requireRecord(phase159ByUpstreamId, record.adjudication_record_id, "Phase 159 mission action");
  const docket = requireRecord(phase168ByUpstreamId, record.adjudication_record_id, "Phase 168 mission docket");
  const { board, action } = actionItem;
  assert(action.action_kind === "mission decision", `${action.action_id} is not a mission decision.`);
  assert(record.candidate_set_digest === action.candidate_set_digest, `${action.action_id} changed the Phase 147 mission candidate-set digest.`);
  assert(record.candidate_set_digest === docket.candidate_set_digest, `${docket.adjudication_docket_id} changed the Phase 147 mission candidate-set digest.`);
  const prerequisitePackets = docket.prerequisite_requirement_ids.map((id) => requireRecord(requirementPacketByUpstreamId, id, "Phase 175 prerequisite packet"));
  assert(prerequisitePackets.length === 3, `${docket.adjudication_docket_id} must bind exactly three requirement packets.`);
  const prerequisiteAuthorityPacketIds = [...new Set(prerequisitePackets.map((item) => item.prerequisite_authority_packet_id))];
  assert(prerequisiteAuthorityPacketIds.length === 1, `${docket.adjudication_docket_id} must inherit one exact authority prerequisite through its three requirements.`);
  const missionReceiptTemplate = receiptTemplate(record.terminal_states);
  missionReceiptTemplate.required_fields.push("prerequisite_requirement_receipt_ids", "prerequisite_authority_receipt_ids");
  missionReceiptTemplate.prerequisite_requirement_receipt_ids = [];
  missionReceiptTemplate.prerequisite_authority_receipt_ids = [];
  return {
    owner_disposition_packet_id: `175-MISSION-${pad(index + 1)}`,
    docket_action_number: authorityPackets.length + requirementPackets.length + index + 1,
    action_kind: "mission decision",
    decision_sequence: 3,
    mission_id: record.mission_id,
    slug: record.slug,
    title: record.title,
    question: record.question,
    packet_state: "Held — requirement prerequisites and owner decision pending",
    candidate_set_digest: record.candidate_set_digest,
    upstream_records: [
      { phase: 147, record_id: record.adjudication_record_id, record_sha256: recordDigest(record) },
      { phase: 159, record_id: board.mission_board_id, record_sha256: recordDigest(board) },
      { phase: 159, parent_record_id: board.mission_board_id, record_id: action.action_id, record_sha256: recordDigest(action) },
      { phase: 168, record_id: docket.adjudication_docket_id, record_sha256: recordDigest(docket) },
    ],
    alternative_candidate_ids: record.alternative_candidate_ids,
    prerequisite_requirement_record_ids: docket.prerequisite_requirement_ids,
    prerequisite_packet_ids: prerequisitePackets.map((item) => item.owner_disposition_packet_id),
    prerequisite_authority_packet_ids: prerequisiteAuthorityPacketIds,
    prerequisite_requirement_receipt_ids: [],
    prerequisite_authority_receipt_ids: [],
    prerequisite_state: "Not satisfied — the authority and all three requirement outcomes and receipts remain null",
    allowed_owner_outcomes: record.terminal_states,
    owner_outcome: null,
    decision_date: null,
    decision_receipt_id: null,
    reviewer_role: null,
    rationale: null,
    answer: null,
    bounded_conclusion: null,
    receipt_template: missionReceiptTemplate,
    propagation_targets: {
      mission_record_ids: [record.adjudication_record_id, action.action_id, docket.adjudication_docket_id],
      mission_board_id: board.mission_board_id,
    },
    propagation_state: "Not started — prerequisites and owner outcome are absent",
    next_action: record.next_action,
    stop_rule: "No mission conclusion may be issued until the inherited authority packet and all three bound requirement packets are terminal, dated, receipt-bound, and digest-matched.",
    route: `${phase175Hub}${record.slug}/`,
  };
});

const ownerDispositionPackets = [...authorityPackets, ...requirementPackets, ...missionPackets];
assert(authorityPackets.length === 12, "Phase 175 authority packet count must be twelve.");
assert(requirementPackets.length === 18, "Phase 175 requirement packet count must be eighteen.");
assert(missionPackets.length === 6, "Phase 175 mission packet count must be six.");
assert(ownerDispositionPackets.length === 36, "Phase 175 owner packet count must be thirty-six.");
assert(new Set(ownerDispositionPackets.map((item) => item.owner_disposition_packet_id)).size === 36, "Phase 175 packet IDs must be unique.");
assert(new Set(ownerDispositionPackets.map((item) => item.route)).size === 36, "Phase 175 detail routes must be unique.");
assert(ownerDispositionPackets.every((item) => item.owner_outcome === null && item.decision_receipt_id === null), "Phase 175 owner outcomes must remain null.");

const phase175PublicHtmlRoutes = [phase175Hub, ...ownerDispositionPackets.map((item) => item.route)];

const phase175 = {
  schema_version: "1.0",
  phase: 175,
  program_id: "FTFN-PHASE-175",
  dataset: "phase_175_owner_disposition_sprint_ii",
  title: "Owner Disposition Sprint II",
  effective_date: "2026-09-01",
  prepared_date: "2026-09-01",
  target_window: { start: "2026-10-05", end: "2026-10-16", calendar_gate: false },
  record_status: "Prepared",
  build_status: "Complete locally — thirty-six owner outcomes held",
  summary: "Prepare twelve authority, eighteen requirement, and six mission decision packets with exact lineage, digest bindings, receipt templates, sequencing, and propagation plans while recording no owner outcome.",
  record_scope: "Append-only Phase 175 decision preparation over immutable Phase 156, Phase 164, and Phase 172 validation receipts.",
  interpretation_boundary: "A prepared packet is not a decision. Candidate discovery is not admission, a carry must retain a bounded next action, and no mission result can precede its three terminal requirement receipts.",
  publication_boundaries: [
    "A prepared packet is not a decision. Candidate discovery is not admission, a carry must retain a bounded next action, and no mission result can precede its three terminal requirement receipts.",
    "The thirty-six Phase 175 docket actions and separate Phase 176 zero-series disposition are counted as 36 + 1; compatibility and pilot-admission reviews are reported separately.",
    "No owner outcome, evidence admission, repository publication, hosted deployment, public launch, or v1 promotion is inferred."
  ],
  immutable_baseline_bindings: immutableBaselineBindings,
  digest_contract: {
    upstream_file_sha256: "SHA-256 over exact source-file bytes.",
    upstream_record_sha256: "SHA-256 over recursively key-sorted JSON encoded as UTF-8.",
    candidate_set_digest: "Inherited without recomputation from the bound Phase 146/147/159/167/168 records; equality is asserted before generation.",
  },
  upstream_file_bindings: [146, 147, 159, 167, 168].map((phase) => sourceFileBindings[phase]),
  routes: { hub: phase175Hub, public_export: phase175PublicExport },
  counts: {
    owner_disposition_packets: 36,
    authority_docket_actions: 12,
    requirement_docket_actions: 18,
    mission_docket_actions: 6,
    terminal_owner_actions: 0,
    pending_owner_actions: 36,
    admitted_alternative_candidates: 0,
    phase_176_zero_series_owner_action: 1,
    combined_owner_controlled_backlog: 37,
    phase_176_compatibility_test_decisions_excluded_from_owner_action_total: 18,
    phase_176_pilot_admission_decisions_excluded_from_owner_action_total: 3,
    public_html_routes: 37,
    detail_routes: 36,
    public_json_exports: 1,
  },
  counting_contract: {
    phase_175_owner_controlled_actions: "12 authority + 18 requirement + 6 mission = 36.",
    phase_176_separate_owner_action: "The zero-series public-boundary disposition is one separate owner action and is not one of the 36 Phase 175 dockets.",
    combined_owner_controlled_backlog: "36 + 1 = 37 only when explicitly describing the combined Phase 175 docket backlog and Phase 176 zero-series owner disposition.",
    excluded_governed_evidence_decisions: "The 18 compatibility-test decisions and three pilot-admission decisions are evidence-review actions, not additional items in the 37 owner-controlled backlog.",
  },
  disposition_waves: [
    {
      wave_id: "175-WAVE-AUTHORITY",
      sequence: 1,
      action_kind: "authority disposition",
      packet_ids: authorityPackets.map((item) => item.owner_disposition_packet_id),
      packet_count: authorityPackets.length,
      terminal_count: 0,
      state: "Prepared — owner outcomes pending",
    },
    {
      wave_id: "175-WAVE-REQUIREMENT",
      sequence: 2,
      action_kind: "requirement decision",
      packet_ids: requirementPackets.map((item) => item.owner_disposition_packet_id),
      packet_count: requirementPackets.length,
      terminal_count: 0,
      state: "Prepared — owner outcomes pending",
    },
    {
      wave_id: "175-WAVE-MISSION",
      sequence: 3,
      action_kind: "mission decision",
      packet_ids: missionPackets.map((item) => item.owner_disposition_packet_id),
      packet_count: missionPackets.length,
      terminal_count: 0,
      state: "Held — requirement prerequisites and owner outcomes pending",
    },
  ],
  owner_disposition_packets: ownerDispositionPackets,
  receipt_contract: {
    terminal_receipt_required: true,
    carry_is_terminal_for_meeting_only: true,
    carry_requires_exact_next_action: true,
    candidate_set_digest_required: true,
    reviewer_role_required: true,
    dated_rationale_required: true,
  },
  propagation_contract: {
    material_outcome: "Update every bound upstream identity, dependent docket, reader-facing derivative, and release ledger only after a valid owner receipt exists.",
    non_material_outcome: "Issue an explicit no-change receipt; do not silently leave a packet looking unresolved.",
    current_state: "Not started — all owner outcomes are null.",
  },
  public_html_routes: phase175PublicHtmlRoutes,
  public_json_exports: [phase175PublicExport],
  publication_state: "Prepared for local review routing — owner outcomes remain unpublished",
  next_action: "Convene authorized reviewers. Record authority and requirement receipts first; issue each mission receipt only after all three bound requirement packets are terminal.",
};

const phase160ById = indexBy(sources[160].pilot_matrices, "pilot_matrix_id");
const phase169ByUpstreamId = indexBy(sources[169].longitudinal_adjudication_packets, "upstream_pilot_matrix_id");
const pilotMatrices = sources[160].pilot_matrices.filter((item) => item.matrix_kind === "compatibility pilot");
assert(pilotMatrices.length === 3, "Phase 176 requires exactly three compatibility pilots.");

const provenanceRow = ({ rowId, dimension, sourcePointer, inheritedState, knownValue, evidenceRequired, boundary }) => ({
  provenance_row_id: rowId,
  dimension,
  source_pointer: sourcePointer,
  inherited_state: inheritedState,
  known_value: knownValue,
  evidence_required: evidenceRequired,
  compatibility_outcome: null,
  decision_date: null,
  decision_receipt_id: null,
  boundary,
});

let compatibilityDecisionCounter = 0;
const pilotAdmissionPackets = pilotMatrices.map((matrix, pilotIndex) => {
  const packet = requireRecord(phase169ByUpstreamId, matrix.pilot_matrix_id, "Phase 169 longitudinal packet");
  assert(matrix.series_definition_digest === packet.series_definition_digest, `${packet.longitudinal_adjudication_packet_id} changed the series-definition digest.`);
  assert(packet.compatibility_tests.length === 6, `${packet.longitudinal_adjudication_packet_id} must contain six compatibility tests.`);
  const testsByDimension = new Map(packet.compatibility_tests.map((test) => [test.dimension, test]));
  for (const dimension of ["identity", "period", "measure", "denominator", "revision lineage", "dual review"]) {
    assert(testsByDimension.has(dimension), `${packet.longitudinal_adjudication_packet_id} is missing ${dimension}.`);
  }
  const decisionCells = packet.compatibility_tests.map((test) => {
    compatibilityDecisionCounter += 1;
    return {
      compatibility_decision_id: `176-COMPAT-${pad(compatibilityDecisionCounter)}`,
      pilot_packet_id: `176-PILOT-${pad(pilotIndex + 1)}`,
      dimension: test.dimension,
      inherited_state: test.state,
      inherited_reason: test.reason,
      upstream_admitted_flag: test.admitted,
      allowed_decisions: ["Compatible", "Incompatible", "Insufficient evidence", "Carried"],
      compatibility_outcome: null,
      decision_date: null,
      decision_receipt_id: null,
      primary_reviewer_role: null,
      independent_reviewer_role: null,
      rationale: null,
      next_action: test.dimension === "dual review"
        ? "Obtain two independent reviewer receipts binding the same series definition and observation set."
        : `Test ${test.dimension} against the original artifacts and the Phase 69–70 contract; record a dated result without transferring a value.`,
    };
  });
  const identity = testsByDimension.get("identity");
  const period = testsByDimension.get("period");
  const measure = testsByDimension.get("measure");
  const denominator = testsByDimension.get("denominator");
  const revision = testsByDimension.get("revision lineage");
  const provenanceTable = [
    provenanceRow({
      rowId: `176-PROVENANCE-${pad(pilotIndex + 1)}-IDENTITY`,
      dimension: "identity",
      sourcePointer: `${packet.longitudinal_adjudication_packet_id}/compatibility_tests/identity`,
      inheritedState: identity.state,
      knownValue: { entity_id: packet.entity_id, legacy_panel_id: packet.legacy_panel_id },
      evidenceRequired: "Exact stable entity identity across every candidate observation and every revision.",
      boundary: identity.reason,
    }),
    provenanceRow({
      rowId: `176-PROVENANCE-${pad(pilotIndex + 1)}-DENOMINATOR`,
      dimension: "denominator",
      sourcePointer: `${packet.longitudinal_adjudication_packet_id}/compatibility_tests/denominator`,
      inheritedState: denominator.state,
      knownValue: null,
      evidenceRequired: "A source-defined denominator that remains compatible across every proposed period, or an explicit break declaration.",
      boundary: denominator.reason,
    }),
    provenanceRow({
      rowId: `176-PROVENANCE-${pad(pilotIndex + 1)}-PERIOD`,
      dimension: "period",
      sourcePointer: `${packet.longitudinal_adjudication_packet_id}/compatibility_tests/period`,
      inheritedState: period.state,
      knownValue: null,
      evidenceRequired: "Exact start, end, frequency, cutoff, and comparability treatment for every proposed observation period.",
      boundary: period.reason,
    }),
    provenanceRow({
      rowId: `176-PROVENANCE-${pad(pilotIndex + 1)}-METHOD`,
      dimension: "method",
      sourcePointer: `${packet.longitudinal_adjudication_packet_id}/compatibility_tests/measure`,
      inheritedState: measure.state,
      knownValue: null,
      evidenceRequired: "Exact measure name, unit, collection method, acceptance rule, and method-change treatment.",
      boundary: `${measure.reason} The bound packet does not yet establish a compatible method bridge.`,
    }),
    provenanceRow({
      rowId: `176-PROVENANCE-${pad(pilotIndex + 1)}-REVISION`,
      dimension: "revision policy",
      sourcePointer: `${packet.longitudinal_adjudication_packet_id}/compatibility_tests/revision lineage`,
      inheritedState: revision.state,
      knownValue: null,
      evidenceRequired: "Complete correction, supersession, vintage, restatement, and series-break lineage.",
      boundary: revision.reason,
    }),
    provenanceRow({
      rowId: `176-PROVENANCE-${pad(pilotIndex + 1)}-MISSINGNESS`,
      dimension: "missingness",
      sourcePointer: `${packet.longitudinal_adjudication_packet_id}/compatibility_tests`,
      inheritedState: "Not specified in the bound Phase 160/169 packet",
      knownValue: null,
      evidenceRequired: "A declared missingness taxonomy distinguishing missing, unavailable, not applicable, suppressed, revised, and incompatible values.",
      boundary: "No governed missingness policy is present in the bound packet. Missing, unavailable, and incompatible observations must not be converted to zero.",
    }),
  ];
  return {
    pilot_admission_packet_id: `176-PILOT-${pad(pilotIndex + 1)}`,
    slug: packet.slug,
    title: packet.title,
    packet_state: "Prepared — six-test compatibility adjudication pending",
    entity_id: packet.entity_id,
    legacy_panel_id: packet.legacy_panel_id,
    legacy_observation_inventory: {
      declared_upstream_count: packet.legacy_observation_count,
      values_copied_into_phase_176: 0,
      observation_values: [],
      boundary: "The count describes upstream inventory only; it is not an admitted observation count.",
    },
    series_definition_digest: packet.series_definition_digest,
    upstream_records: [
      { phase: 160, record_id: matrix.pilot_matrix_id, record_sha256: recordDigest(matrix) },
      { phase: 169, record_id: packet.longitudinal_adjudication_packet_id, record_sha256: recordDigest(packet) },
    ],
    eligibility_id: matrix.eligibility_id,
    upstream_lab_review_id: matrix.upstream_lab_review_id,
    compatibility_decisions: decisionCells,
    provenance_table: provenanceTable,
    tests_required: 6,
    tests_terminal: 0,
    tests_compatible: 0,
    admission_outcome: null,
    admitted_series_id: null,
    observations_transferred: 0,
    decision_date: null,
    decision_receipt_id: null,
    primary_reviewer_role: null,
    independent_reviewer_role: null,
    rationale: null,
    admission_receipt_required_fields: [
      "decision_receipt_id",
      "pilot_admission_packet_id",
      "series_definition_digest",
      "six_terminal_compatibility_decision_ids",
      "admission_outcome",
      "decision_date",
      "primary_reviewer_role",
      "independent_reviewer_role",
      "rationale",
      "revision_and_missingness_boundary",
    ],
    decisive_next_action: packet.decisive_next_action,
    stop_rule: packet.stop_rule,
    route: `${phase176Hub}${packet.slug}/`,
  };
});

const compatibilityDecisionIds = pilotAdmissionPackets.flatMap((item) => item.compatibility_decisions.map((decision) => decision.compatibility_decision_id));
assert(compatibilityDecisionIds.length === 18, "Phase 176 requires exactly eighteen compatibility decisions.");
assert(new Set(compatibilityDecisionIds).size === 18, "Phase 176 compatibility decision IDs must be unique.");

const boundaryMatrix = requireRecord(phase160ById, "160-BOUNDARY-001", "Phase 160 zero-series boundary");
const boundaryPacket = requireRecord(phase169ByUpstreamId, "160-BOUNDARY-001", "Phase 169 zero-series packet");
assert(boundaryMatrix.boundary_scope_digest === boundaryPacket.series_definition_digest, "The Phase 160/169 zero-series boundary digest changed.");

const zeroSeriesDisposition = {
  zero_series_disposition_id: "176-ZERO-SERIES-001",
  slug: "zero-series-launch-boundary",
  packet_kind: "separate owner-controlled zero-series public-boundary disposition",
  title: boundaryPacket.title,
  packet_state: "Held — pilot decisions and owner disposition pending",
  upstream_records: [
    { phase: 160, record_id: boundaryMatrix.pilot_matrix_id, record_sha256: recordDigest(boundaryMatrix) },
    { phase: 169, record_id: boundaryPacket.longitudinal_adjudication_packet_id, record_sha256: recordDigest(boundaryPacket) },
  ],
  boundary_scope_digest: boundaryMatrix.boundary_scope_digest,
  reviewed_eligibility_ids: boundaryMatrix.reviewed_eligibility_ids,
  proposed_scope: boundaryMatrix.proposed_scope,
  prerequisite_compatibility_decision_ids: compatibilityDecisionIds,
  prerequisite_pilot_admission_packet_ids: pilotAdmissionPackets.map((item) => item.pilot_admission_packet_id),
  prerequisite_state: "Not satisfied — eighteen compatibility outcomes and three pilot admission outcomes remain null",
  allowed_owner_outcomes: [
    "Accept zero-series public boundary",
    "Decline zero-series public boundary",
    "Carry pending pilot adjudication",
  ],
  owner_outcome: null,
  owner_accepted_zero_series: null,
  decision_date: null,
  decision_receipt_id: null,
  reviewer_role: null,
  rationale: null,
  admitted_series_id: null,
  observations_transferred: 0,
  receipt_required_fields: [
    "decision_receipt_id",
    "zero_series_disposition_id",
    "boundary_scope_digest",
    "owner_outcome",
    "decision_date",
    "reviewer_role",
    "rationale",
    "public_boundary_text",
    "next_action",
  ],
  decisive_next_action: boundaryPacket.decisive_next_action,
  stop_rule: boundaryPacket.stop_rule,
  route: `${phase176Hub}${boundaryPacket.slug}/`,
};

assert(pilotAdmissionPackets.every((item) => item.admission_outcome === null && item.observations_transferred === 0), "Phase 176 pilot outcomes must remain null with zero transfers.");
assert(zeroSeriesDisposition.owner_outcome === null && zeroSeriesDisposition.owner_accepted_zero_series === null, "The Phase 176 zero-series owner outcome must remain null.");

const phase176PublicHtmlRoutes = [
  phase176Hub,
  ...pilotAdmissionPackets.map((item) => item.route),
  zeroSeriesDisposition.route,
];
assert(new Set(phase176PublicHtmlRoutes).size === 5, "Phase 176 requires five unique public HTML routes.");

const phase176 = {
  schema_version: "1.0",
  phase: 176,
  program_id: "FTFN-PHASE-176",
  dataset: "phase_176_longitudinal_admission_and_zero_series_decision",
  title: "Longitudinal Admission and Zero-Series Decision",
  effective_date: "2026-09-01",
  prepared_date: "2026-09-01",
  target_window: { start: "2026-10-12", end: "2026-10-18", calendar_gate: false },
  record_status: "Prepared",
  build_status: "Complete locally — evidence and owner outcomes held",
  summary: "Prepare three six-test longitudinal admission packets, six-row provenance tables, and one separate zero-series owner disposition while transferring no observation and recording no decision.",
  record_scope: "Append-only Phase 176 decision preparation over immutable Phase 156, Phase 164, and Phase 172 validation receipts.",
  interpretation_boundary: "Upstream legacy observations remain inventory only. No value, series, trend, outcome, rank, comparison, or zero substitute enters Phase 176 before six terminal compatibility receipts and a pilot admission receipt bind the exact series-definition digest.",
  publication_boundaries: [
    "Upstream legacy observations remain inventory only. No value, series, trend, outcome, rank, comparison, or zero substitute enters Phase 176 before six terminal compatibility receipts and a pilot admission receipt bind the exact series-definition digest.",
    "Missing, unavailable, suppressed, revised, and incompatible observations remain distinct and are never converted to zero.",
    "The zero-series public boundary requires one separate dated owner receipt after the three pilot decisions are terminal."
  ],
  immutable_baseline_bindings: immutableBaselineBindings,
  digest_contract: {
    upstream_file_sha256: "SHA-256 over exact source-file bytes.",
    upstream_record_sha256: "SHA-256 over recursively key-sorted JSON encoded as UTF-8.",
    series_definition_digest: "Inherited without recomputation from the bound Phase 160 and Phase 169 records; equality is asserted before generation.",
  },
  upstream_file_bindings: [160, 169].map((phase) => sourceFileBindings[phase]),
  routes: { hub: phase176Hub, public_export: phase176PublicExport },
  counts: {
    complete_prepared_packets: 4,
    compatibility_pilots: 3,
    provenance_tables: 3,
    provenance_rows: 18,
    compatibility_test_decisions: 18,
    terminal_compatibility_test_decisions: 0,
    pending_compatibility_test_decisions: 18,
    pilot_admission_decisions: 3,
    terminal_pilot_admission_decisions: 0,
    admitted_series: 0,
    observations_transferred: 0,
    zero_series_owner_dispositions: 1,
    terminal_zero_series_owner_dispositions: 0,
    pending_zero_series_owner_dispositions: 1,
    phase_175_owner_controlled_actions: 36,
    combined_owner_controlled_backlog: 37,
    public_html_routes: 5,
    detail_routes: 4,
    public_json_exports: 1,
  },
  counting_contract: {
    governed_evidence_decisions: "18 compatibility-test decisions + 3 pilot-admission decisions = 21 governed evidence-review decisions.",
    phase_176_owner_controlled_actions: "Only the separate zero-series public-boundary disposition is counted as a Phase 176 owner action.",
    combined_owner_controlled_backlog: "The 36 Phase 175 docket actions plus the one Phase 176 zero-series owner disposition equal 37 owner-controlled actions. The 21 governed evidence-review decisions are reported separately.",
  },
  compatibility_dimension_contract: ["identity", "period", "measure", "denominator", "revision lineage", "dual review"],
  provenance_dimension_contract: ["identity", "denominator", "period", "method", "revision policy", "missingness"],
  pilot_admission_packets: pilotAdmissionPackets,
  zero_series_owner_disposition: zeroSeriesDisposition,
  public_method_note: {
    state: "Prepared — publication decision absent",
    title: "Why incompatible observations are not pooled",
    principles: [
      "A shared entity label does not prove a stable series identity.",
      "Periods, measures, methods, and denominators must be compatible or carry a visible series break.",
      "Revision lineage and dual review must bind the exact proposed observation set.",
      "Missing, unavailable, suppressed, revised, and incompatible observations are not zero.",
      "If no pilot qualifies, the public product may state zero admitted series only after the separate owner receipt accepts that boundary.",
    ],
    publication_outcome: null,
    publication_date: null,
    publication_receipt_id: null,
  },
  public_html_routes: phase176PublicHtmlRoutes,
  public_json_exports: [phase176PublicExport],
  publication_state: "Prepared for local review routing — compatibility, admission, and zero-series outcomes remain unpublished",
  next_action: "Run the eighteen compatibility reviews against original artifacts under dual control; issue a pilot admission, rejection, or carry receipt only after all six cells are terminal, then seek the separate zero-series owner disposition if no pilot qualifies.",
};

await Promise.all([
  writeJson("phase-175-owner-disposition-sprint-ii.json", phase175),
  writeJson("phase-176-longitudinal-admission-and-zero-series-decision.json", phase176),
  writeUpdate("2026-09-01-phase-175.json", {
    id: "update-2026-09-01-phase-175",
    effective_date: "2026-09-01",
    entry_type: "Publication Promotion",
    title: "Phase 175 prepares thirty-six owner disposition packets",
    summary: "Binds twelve authority, eighteen requirement, and six mission dockets to exact upstream records, receipt templates, sequencing, and propagation plans while retaining every owner outcome as null.",
    affected_record_ids: ownerDispositionPackets.map((record) => record.owner_disposition_packet_id),
    related_paths: [phase175.routes.hub, ...ownerDispositionPackets.map((record) => record.route)],
    evidence_note: phase175.publication_boundaries[0],
    materiality: "Material record change",
    publication_effect: "Adds thirty-seven local review routes and one schema-1.0 JSON export; it records no owner decision.",
    work_package: "docs/work-packages/phase-175-owner-disposition-sprint-ii.md"
  }),
  writeUpdate("2026-09-01-phase-176.json", {
    id: "update-2026-09-01-phase-176",
    effective_date: "2026-09-01",
    entry_type: "Publication Promotion",
    title: "Phase 176 prepares longitudinal admission and zero-series decisions",
    summary: "Adds three six-test longitudinal packets, eighteen provenance rows, and one separate zero-series disposition while transferring zero observations and retaining all outcomes as null.",
    affected_record_ids: [...pilotAdmissionPackets.map((record) => record.pilot_admission_packet_id), zeroSeriesDisposition.zero_series_disposition_id],
    related_paths: [phase176.routes.hub, ...pilotAdmissionPackets.map((record) => record.route), zeroSeriesDisposition.route],
    evidence_note: phase176.publication_boundaries[0],
    materiality: "Material record change",
    publication_effect: "Adds five local review routes and one schema-1.0 JSON export; it admits no series and records no owner decision.",
    work_package: "docs/work-packages/phase-176-longitudinal-admission-and-zero-series-decision.md"
  }),
]);

console.log("Built Phase 175: 36 prepared owner packets (12 authority + 18 requirement + 6 mission), 0 owner outcomes.");
console.log("Built Phase 176: 3 pilot packets, 18 compatibility decisions, 18 provenance rows, 1 separate zero-series owner packet, 0 observations transferred.");
console.log("Owner-count contract: 36 Phase 175 docket actions + 1 Phase 176 zero-series action = 37 combined; 21 governed evidence-review decisions reported separately.");
