import type { APIRoute } from "astro";
import ledger from "../../data/phase-67-evidence-return-envelope-ledger.json";
import { projectEvidenceRecord, currentEvidenceLedger, evidenceReceiptsForControl } from '../../lib/current-evidence.mjs';
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const records = ledger.envelope_records.map((record) => ({
    snapshot_as_of: '2026-09-01', current_state_as_of: currentEvidenceLedger.as_of_date, current_state: projectEvidenceRecord(record),
    dated_review_receipts: evidenceReceiptsForControl(record),
    envelope_id: record.envelope_id,
    path: `/evidence/qualification/${record.slug}/`,
    record_kind: record.record_kind,
    record_status: record.record_status,
    cycle_item_id: record.cycle_item_id,
    wave: record.wave,
    target: record.target,
    origin_record_id: record.origin_record_id,
    scheduled_check_date: record.scheduled_check_date,
    envelope_state: record.envelope_state,
    exact_next_artifact: record.exact_next_artifact,
    source_ids: record.source_ids,
    checked_source_ids: record.checked_source_ids ?? [],
    underlying_signal_id: record.underlying_signal_id,
    named_file_ids: record.named_file_ids,
    qualification_packet_ids: record.qualification_packet_ids,
    binding_decision: record.binding_decision,
    canonical_dossier_ids: record.canonical_dossier_ids,
    reader_pathway_ids: record.reader_pathway_ids,
    dependency_map_ids: record.dependency_map_ids,
    local_system_ids: record.local_system_ids,
    attempted_surfaces: record.attempted_surfaces,
    access_result: record.access_result,
    receipt_type: record.receipt_type,
    receipt_id: record.receipt_id,
    decision_date: record.decision_date,
    decision_status: record.decision_status,
    propagation_status: record.propagation_status,
    content_propagation_status: record.content_propagation_status ?? (record.propagation_status === "complete" ? "complete" : null),
    git_backed_release_status: record.git_backed_release_status ?? (record.envelope_state === "Release Verified" ? "verified" : null),
    next_check_date: record.next_check_date,
    publication_boundary: record.publication_boundary,
    companion_rechecks: record.companion_rechecks ?? []
  }));

  return publicDatasetResponse(
    "evidence_return_envelopes",
    "Thirteen public-safe return envelopes. Top-level fields preserve the September 1 baseline; current_state carries later dated decisions and future appointments under current_state_as_of. SLF renewal is a separate companion correction, not a qualification or operating outcome.",
    records
  );
};
