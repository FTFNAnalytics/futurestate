import { createHash } from "node:crypto";

export const phase151ReviewScopeVersion = "phase-151-review-scope-v1";
export const phase154PublicationInputVersion = "phase-154-publication-input-v1";
export const phase154PublicationScopeVersion = "phase-154-publication-scope-v1";

export const phase145TerminalStates = new Set([
  "material_change",
  "no_material_change",
  "blocked_with_public_receipt",
  "rescheduled_with_watch_note",
]);
export const phase151TerminalStates = new Set([
  "Material change",
  "No material change",
  "Bounded blocker",
  "Rescheduled",
]);

const phase146TerminalStates = new Set([
  "Closed — exact artifact mapped",
  "Carried — bounded gap",
  "Excluded from v1 scope",
]);
const phase147RequirementTerminalStates = new Set(["Accepted", "Rejected", "Inadmissible", "Bounded gap"]);
const phase147MissionTerminalStates = new Set(["Answered", "Bounded conclusion", "No admissible answer", "Carried gap"]);

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isObject(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
};
export const stableDigest = (value) => createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");

const sortStrings = (values = []) => [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))].sort();
const sortRecords = (records, key) => [...records].sort((left, right) => String(left[key]).localeCompare(String(right[key])));
const visibleDate = (value, cutoff) => typeof value === "string" && value <= cutoff;
const terminalDate = (value, minimum, cutoff) => visibleDate(value, cutoff) && value >= minimum;
const text = (value) => typeof value === "string" && value.trim().length > 0;

const sourceFrom = (sources, sourceId) => sources instanceof Map
  ? sources.get(sourceId)
  : sources?.find?.((source) => source.id === sourceId);

export const canonicalSourceBindings = (sourceIds, canonicalSources) => sortStrings(sourceIds).map((sourceId) => {
  const source = sourceFrom(canonicalSources, sourceId);
  return {
    source_id: sourceId,
    semantic_digest: source ? stableDigest(source) : null,
  };
});

export const phase151DeskBaselinePayload = (desk, canonicalSources) => ({
  desk_review_id: desk.desk_review_id,
  desk_id: desk.desk_id,
  topic_id: desk.topic_id,
  baseline_packet_date: desk.baseline_packet_date,
  baseline_packet_state: desk.baseline_packet_state,
  current_read: desk.current_read,
  contested_reading: desk.contested_reading,
  mission_ids: sortStrings(desk.mission_ids),
  evidence_annotation_ids: sortStrings(desk.evidence_annotation_ids),
  signal_ids: sortStrings(desk.signal_ids),
  direct_evidence_source_ids: sortStrings(desk.direct_evidence_source_ids),
  context_source_ids: sortStrings(desk.context_source_ids),
  source_ids: sortStrings(desk.source_ids),
  project_chronicle_ids: sortStrings(desk.project_chronicle_ids),
  place_ledger_ids: sortStrings(desk.place_ledger_ids),
  comparison_passport_ids: sortStrings(desk.comparison_passport_ids),
  authority_gap_disposition_ids: sortStrings(desk.authority_gap_disposition_ids),
  alternative_candidate_ids: sortStrings(desk.alternative_candidate_ids),
  source_bindings: canonicalSourceBindings(desk.source_ids, canonicalSources),
  promotion_rule: desk.promotion_rule,
});

export const normalizePhase145OperationAtCutoff = (operation, cutoff, canonicalSources) => {
  const terminal = phase145TerminalStates.has(operation.decision_status)
    && terminalDate(operation.decision_date, operation.lawful_date, cutoff)
    && terminalDate(operation.source_checked_date, operation.lawful_date, cutoff)
    && text(operation.receipt_id)
    && text(operation.receipt_type)
    && text(operation.propagation_proof_id)
    && text(operation.signal_decision)
    && text(operation.update_id)
    && text(operation.bounded_result);
  return {
    operation_id: operation.operation_id,
    operation_scope_digest: operation.operation_scope_digest ?? null,
    lawful_date: operation.lawful_date,
    exact_next_artifact: operation.exact_next_artifact,
    source_ids: sortStrings(operation.source_ids),
    source_bindings: canonicalSourceBindings(operation.source_ids, canonicalSources),
    underlying_signal_ids: sortStrings([...(operation.underlying_signal_ids ?? []), operation.underlying_signal_id]),
    propagation_contract_id: operation.propagation_contract_id ?? null,
    canonical_dossier_ids: sortStrings(operation.canonical_dossier_ids),
    reader_pathway_ids: sortStrings(operation.reader_pathway_ids),
    dependency_map_ids: sortStrings(operation.dependency_map_ids),
    local_system_ids: sortStrings(operation.local_system_ids),
    named_file_ids: sortStrings(operation.named_file_ids),
    propagation_targets: sortStrings(operation.propagation_targets),
    decision_status: terminal ? operation.decision_status : "due_unresolved",
    decision_date: terminal ? operation.decision_date : null,
    receipt_id: terminal ? operation.receipt_id : null,
    receipt_type: terminal ? operation.receipt_type ?? null : null,
    source_checked_date: terminal ? operation.source_checked_date : null,
    propagation_proof_id: terminal ? operation.propagation_proof_id : null,
    signal_decision: terminal ? operation.signal_decision ?? null : null,
    update_id: terminal ? operation.update_id : null,
    bounded_result: terminal ? operation.bounded_result ?? null : null,
  };
};

export const normalizePhase146DispositionAtCutoff = (record, cutoff) => {
  const terminal = phase146TerminalStates.has(record.owner_disposition)
    && visibleDate(record.disposition_date, cutoff)
    && text(record.disposition_receipt_id)
    && text(record.reviewer_role)
    && text(record.rationale);
  return {
    disposition_id: record.disposition_id,
    mission_id: record.mission_id,
    candidate_set_digest: record.candidate_set_digest,
    decision_state: terminal ? record.owner_disposition : "Pending owner disposition",
    decision_date: terminal ? record.disposition_date : null,
    decision_receipt_id: terminal ? record.disposition_receipt_id : null,
    reviewer_role: terminal ? record.reviewer_role ?? null : null,
    rationale: terminal ? record.rationale ?? null : null,
    bounded_result: record.bounded_result ?? null,
    limitation_statement: record.limitation_statement ?? null,
  };
};

export const normalizePhase147DecisionAtCutoff = (record, cutoff) => {
  const terminalStates = record.record_kind === "mission decision"
    ? phase147MissionTerminalStates
    : phase147RequirementTerminalStates;
  const terminal = terminalStates.has(record.decision_state)
    && visibleDate(record.decision_date, cutoff)
    && text(record.decision_receipt_id)
    && text(record.reviewer_role)
    && text(record.rationale);
  return {
    adjudication_record_id: record.adjudication_record_id,
    record_kind: record.record_kind,
    mission_id: record.mission_id,
    candidate_set_digest: record.candidate_set_digest,
    decision_state: terminal ? record.decision_state : "Pending owner adjudication",
    decision_date: terminal ? record.decision_date : null,
    decision_receipt_id: terminal ? record.decision_receipt_id : null,
    reviewer_role: terminal ? record.reviewer_role ?? null : null,
    rationale: terminal ? record.rationale ?? null : null,
    accepted_source_ids: terminal ? sortStrings(record.accepted_source_ids) : [],
    rejected_source_ids: terminal ? sortStrings(record.rejected_source_ids) : [],
    answer: terminal ? record.answer ?? null : null,
    bounded_conclusion: terminal ? record.bounded_conclusion ?? null : null,
    limitation_statement: terminal ? record.limitation_statement ?? null : null,
  };
};

export const normalizePhase149ReviewAtCutoff = (record, cutoff) => {
  const reviewed = visibleDate(record.review_date, cutoff);
  const receiptedDecision = reviewed
    && visibleDate(record.decision_date, cutoff)
    && text(record.decision_receipt_id)
    && text(record.reviewer_role)
    && text(record.rationale);
  return {
    lab_review_id: record.lab_review_id,
    entity_id: record.entity_id,
    review_date: reviewed ? record.review_date : null,
    series_definition_digest: record.series_definition_digest,
    compatibility_decision: receiptedDecision ? record.compatibility_decision : reviewed ? "Not admitted" : "Not yet reviewed",
    decision_date: receiptedDecision ? record.decision_date : null,
    decision_receipt_id: receiptedDecision ? record.decision_receipt_id : null,
    reviewer_role: receiptedDecision ? record.reviewer_role ?? null : null,
    rationale: receiptedDecision ? record.rationale ?? null : null,
    admitted_series_id: receiptedDecision ? record.admitted_series_id ?? null : null,
    observations_transferred: receiptedDecision ? record.observations_transferred ?? 0 : 0,
  };
};

export const normalizePhase151WindowAtCutoff = (window, desk, cutoff) => {
  const terminal = phase151TerminalStates.has(window.state)
    && terminalDate(window.decision_date, window.scheduled_date, cutoff)
    && text(window.receipt_id)
    && text(window.decision)
    && text(window.reviewer_role)
    && text(window.rationale)
    && window.review_scope_contract_version === phase151ReviewScopeVersion
    && window.review_scope_cutoff_date === window.scheduled_date
    && /^[a-f0-9]{64}$/.test(window.review_scope_digest ?? "");
  return {
    window_id: window.window_id,
    desk_review_id: desk.desk_review_id,
    desk_id: desk.desk_id,
    scheduled_date: window.scheduled_date,
    state: terminal ? window.state : "due_unresolved",
    decision: terminal ? window.decision : null,
    decision_date: terminal ? window.decision_date : null,
    receipt_id: terminal ? window.receipt_id : null,
    reviewer_role: terminal ? window.reviewer_role ?? null : null,
    rationale: terminal ? window.rationale ?? null : null,
    review_scope_digest: window.review_scope_digest ?? null,
    material_change_ids: terminal ? sortStrings(window.material_change_ids) : [],
  };
};

const idsFromPhase151Payload = (payload) => sortStrings([
  payload.window.desk_review_id,
  ...Object.values(payload.desk_baseline).flatMap((value) => Array.isArray(value) ? value.flatMap((item) => typeof item === "string" ? [item] : item?.source_id ?? []) : []),
  ...payload.phase145_operations.flatMap((record) => [record.operation_id, record.receipt_id, record.propagation_proof_id, record.update_id, ...record.source_ids, ...record.underlying_signal_ids, ...record.canonical_dossier_ids, ...record.reader_pathway_ids, ...record.dependency_map_ids, ...record.local_system_ids, ...record.named_file_ids, ...record.propagation_targets]),
  ...payload.phase146_dispositions.flatMap((record) => [record.disposition_id, record.decision_receipt_id]),
  ...payload.phase147_decisions.flatMap((record) => [record.adjudication_record_id, record.decision_receipt_id, ...record.accepted_source_ids, ...record.rejected_source_ids]),
  ...payload.phase149_reviews.flatMap((record) => [record.lab_review_id, record.entity_id, record.decision_receipt_id, record.admitted_series_id]),
  ...payload.prior_review_windows.flatMap((record) => [record.window_id, record.desk_review_id, record.desk_id, record.receipt_id, ...record.material_change_ids]),
]);

export const buildPhase151ReviewScope = ({
  windowId,
  scheduledDate,
  desk,
  phase145Operations,
  phase146Dispositions,
  phase147Records,
  phase149Reviews,
  priorWindows,
  canonicalSources,
}) => {
  const missionIds = new Set(desk.mission_ids ?? []);
  const dispositionIds = new Set(desk.authority_gap_disposition_ids ?? []);
  const deskBaseline = phase151DeskBaselinePayload(desk, canonicalSources);
  const phase145OperationSnapshots = sortRecords(
    phase145Operations.filter((record) => record.lawful_date <= scheduledDate).map((record) => normalizePhase145OperationAtCutoff(record, scheduledDate, canonicalSources)),
    "operation_id",
  );
  const payload = {
    contract_version: phase151ReviewScopeVersion,
    window: {
      window_id: windowId,
      scheduled_date: scheduledDate,
      desk_review_id: desk.desk_review_id,
    },
    desk_baseline: deskBaseline,
    desk_baseline_digest: stableDigest(deskBaseline),
    phase145_operations: phase145OperationSnapshots,
    phase146_dispositions: sortRecords(
      phase146Dispositions.filter((record) => dispositionIds.has(record.disposition_id) || missionIds.has(record.mission_id)).map((record) => normalizePhase146DispositionAtCutoff(record, scheduledDate)),
      "disposition_id",
    ),
    phase147_decisions: sortRecords(
      phase147Records.filter((record) => missionIds.has(record.mission_id)).map((record) => normalizePhase147DecisionAtCutoff(record, scheduledDate)),
      "adjudication_record_id",
    ),
    phase149_reviews: sortRecords(
      phase149Reviews.filter((record) => !record.review_date || record.review_date <= scheduledDate).map((record) => normalizePhase149ReviewAtCutoff(record, scheduledDate)),
      "lab_review_id",
    ),
    prior_review_windows: sortRecords(
      priorWindows.filter((window) => window.scheduled_date < scheduledDate).map((window) => normalizePhase151WindowAtCutoff(window, desk, scheduledDate)),
      "window_id",
    ),
  };
  return {
    payload,
    digest: stableDigest(payload),
    material_ids: idsFromPhase151Payload(payload),
    missing_source_ids: sortStrings([
      ...deskBaseline.source_bindings.filter((binding) => binding.semantic_digest === null).map((binding) => binding.source_id),
      ...phase145OperationSnapshots.flatMap((operation) => operation.source_bindings.filter((binding) => binding.semantic_digest === null).map((binding) => binding.source_id)),
    ]),
  };
};

const idsFromPhase154Input = (payload) => sortStrings([
  ...payload.phase145_operations.flatMap((record) => [record.operation_id, record.receipt_id, record.propagation_proof_id, record.update_id, ...record.source_ids, ...record.underlying_signal_ids, ...record.canonical_dossier_ids, ...record.reader_pathway_ids, ...record.dependency_map_ids, ...record.local_system_ids, ...record.named_file_ids, ...record.propagation_targets]),
  ...payload.phase151_review_windows.flatMap((record) => [record.window_id, record.desk_review_id, record.desk_id, record.receipt_id, ...record.material_change_ids]),
  ...payload.phase146_decisions.flatMap((record) => [record.disposition_id, record.decision_receipt_id]),
  ...payload.phase147_decisions.flatMap((record) => [record.adjudication_record_id, record.decision_receipt_id, ...record.accepted_source_ids, ...record.rejected_source_ids]),
  ...payload.phase149_decisions.flatMap((record) => [record.lab_review_id, record.entity_id, record.decision_receipt_id, record.admitted_series_id]),
]);

export const buildPhase154PublicationInputScope = ({
  editionPacketId,
  upstreamEditionId,
  publicationDate,
  focus,
  boundary,
  requiredSections,
  phase145Operations,
  phase146Dispositions,
  phase147Records,
  phase149Reviews,
  phase151Desks,
  canonicalSources,
}) => {
  const missingReviewScopeSourceIds = [];
  const phase145OperationSnapshots = sortRecords(
    phase145Operations.filter((record) => record.lawful_date <= publicationDate).map((record) => normalizePhase145OperationAtCutoff(record, publicationDate, canonicalSources)),
    "operation_id",
  );
  const reviewWindows = phase151Desks.flatMap((desk) => (desk.review_windows ?? [])
    .filter((window) => window.scheduled_date <= publicationDate)
    .map((window) => {
      const expectedScope = buildPhase151ReviewScope({
        windowId: window.window_id,
        scheduledDate: window.scheduled_date,
        desk,
        phase145Operations,
        phase146Dispositions,
        phase147Records,
        phase149Reviews,
        priorWindows: desk.review_windows,
        canonicalSources,
      });
      missingReviewScopeSourceIds.push(...expectedScope.missing_source_ids);
      const materialStateValid = new Set(window.material_change_ids ?? []).size === (window.material_change_ids ?? []).length
        && (window.state !== "Material change" || (window.material_change_ids ?? []).length > 0)
        && (window.state !== "No material change" || (window.material_change_ids ?? []).length === 0);
      return {
        ...normalizePhase151WindowAtCutoff(window, desk, publicationDate),
        review_scope_digest_verified: window.review_scope_digest === expectedScope.digest,
        review_scope_source_bindings_complete: expectedScope.missing_source_ids.length === 0,
        material_ids_resolve: materialIdsResolve(window.material_change_ids ?? [], expectedScope.material_ids),
        material_state_valid: materialStateValid,
      };
    }));
  const payload = {
    contract_version: phase154PublicationInputVersion,
    edition: {
      edition_packet_id: editionPacketId,
      upstream_edition_id: upstreamEditionId,
      publication_date: publicationDate,
      focus,
      boundary,
      required_sections: sortStrings(requiredSections),
    },
    phase145_operations: phase145OperationSnapshots,
    phase151_review_windows: sortRecords(reviewWindows, "window_id"),
    phase146_decisions: sortRecords(
      phase146Dispositions.map((record) => normalizePhase146DispositionAtCutoff(record, publicationDate)),
      "disposition_id",
    ),
    phase147_decisions: sortRecords(
      phase147Records.map((record) => normalizePhase147DecisionAtCutoff(record, publicationDate)),
      "adjudication_record_id",
    ),
    phase149_decisions: sortRecords(
      phase149Reviews.filter((record) => !record.review_date || record.review_date <= publicationDate).map((record) => normalizePhase149ReviewAtCutoff(record, publicationDate)),
      "lab_review_id",
    ),
  };
  const unresolvedDueInputIds = sortStrings([
    ...payload.phase145_operations.filter((record) => !phase145TerminalStates.has(record.decision_status)).map((record) => record.operation_id),
    ...payload.phase151_review_windows.filter((record) => !phase151TerminalStates.has(record.state) || !record.review_scope_digest_verified || !record.review_scope_source_bindings_complete || !record.material_ids_resolve || !record.material_state_valid).map((record) => record.window_id),
  ]);
  return {
    payload,
    digest: stableDigest(payload),
    material_ids: idsFromPhase154Input(payload),
    due_inputs_terminal: unresolvedDueInputIds.length === 0,
    unresolved_due_input_ids: unresolvedDueInputIds,
    missing_source_ids: sortStrings([
      ...missingReviewScopeSourceIds,
      ...phase145OperationSnapshots.flatMap((operation) => operation.source_bindings.filter((binding) => binding.semantic_digest === null).map((binding) => binding.source_id)),
    ]),
  };
};

export const buildPhase154PublicationScope = ({ publicationInputDigest, packet, canonicalSources }) => {
  const includedSourceBindings = canonicalSourceBindings(packet.included_source_ids, canonicalSources);
  const payload = {
    contract_version: phase154PublicationScopeVersion,
    publication_input_digest: publicationInputDigest,
    draft_content: packet.draft_content,
    included_desk_ids: sortStrings(packet.included_desk_ids),
    included_source_bindings: includedSourceBindings,
    material_change_ids: sortStrings(packet.material_change_ids),
    publication_state: packet.state,
    publication_decision_date: packet.publication_decision_date,
    reviewer_role: packet.reviewer_role,
    rationale: packet.rationale,
  };
  return {
    payload,
    digest: stableDigest(payload),
    missing_source_ids: includedSourceBindings.filter((binding) => binding.semantic_digest === null).map((binding) => binding.source_id),
  };
};

export const materialIdsResolve = (materialIds, allowedMaterialIds) => {
  const allowed = new Set(allowedMaterialIds);
  return Array.isArray(materialIds) && materialIds.every((materialId) => allowed.has(materialId));
};
