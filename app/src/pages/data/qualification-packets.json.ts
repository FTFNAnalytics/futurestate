import type { APIRoute } from "astro";
import registry from "../../data/phase-67-qualification-packet-registry.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const records = registry.packet_records.map((record) => ({
    packet_id: record.packet_id,
    path: `/evidence/qualification/${record.slug}/`,
    record_kind: record.record_kind,
    record_status: record.record_status,
    file_id: record.file_id,
    file_kind: record.file_kind,
    named_entity: record.named_entity,
    geography: record.geography,
    stage_id: record.stage_id,
    phase64_stage_id: record.phase64_stage_id,
    stage_label: record.stage_label,
    current_decision_state: record.current_decision_state,
    packet_state: record.packet_state,
    claim_question: record.claim_question,
    current_basis: record.current_basis,
    exact_qualifying_artifact: record.exact_qualifying_artifact,
    recognized_authorities: record.recognized_authorities,
    entity_scope: record.entity_scope,
    admissible_artifact_types: record.admissible_artifact_types,
    temporal_requirement: record.temporal_requirement,
    method_requirement: record.method_requirement,
    denominator_requirement: record.denominator_requirement,
    exception_requirement: record.exception_requirement,
    recurrence_requirement: record.recurrence_requirement,
    disqualifiers: record.disqualifiers,
    gate_id: record.gate_id,
    gate_mode: record.gate_mode,
    next_check_date: record.next_check_date,
    reopening_trigger: record.reopening_trigger,
    gate_receipt_state: record.gate_receipt_state,
    source_ids: record.source_ids,
    signal_ids: record.signal_ids,
    evidence_gap_ids: record.evidence_gap_ids,
    canonical_briefing_id: record.canonical_briefing_id,
    acceptance_briefing_id: record.acceptance_briefing_id,
    qualification_playbook_id: record.qualification_playbook_id,
    reader_pathway_ids: record.reader_pathway_ids,
    dependency_map_ids: record.dependency_map_ids,
    required_propagation: record.required_propagation,
    receipt_id: record.receipt_id,
    decision_date: record.decision_date,
    phase64_cell_change: record.phase64_cell_change
  }));

  return publicDatasetResponse(
    "qualification_packets",
    "Thirty-two public qualification contracts defining exact validation, acceptance, recurring-operation, and comparable-outcome evidence for eight named files. A packet is an acquisition and review contract, not evidence that its requirement has been met.",
    records
  );
};
