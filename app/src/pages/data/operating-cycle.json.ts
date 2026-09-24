import type { APIRoute } from "astro";
import cycle from "../../data/phase-60-operating-cycle.json";
import { projectEvidenceRecord, currentEvidenceLedger } from '../../lib/current-evidence.mjs';
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const records = cycle.records.map((record) => ({
    snapshot_as_of: '2026-09-01', current_state_as_of: currentEvidenceLedger.as_of_date, current_state: projectEvidenceRecord(record),
    cycle_item_id: record.cycle_item_id,
    wave: record.wave,
    target: record.target,
    origin_record_id: record.origin_record_id,
    source_ids: record.source_ids,
    supporting_source_ids: record.supporting_source_ids ?? [],
    underlying_signal_id: record.underlying_signal_id,
    exact_next_artifact: record.exact_next_artifact,
    scheduled_check_date: record.scheduled_check_date,
    decision_status: record.decision_status,
    decision_date: record.decision_date,
    receipt_id: record.receipt_id,
    receipt_type: record.receipt_type ?? null,
    source_checked_date: record.source_checked_date ?? null,
    propagation_status: record.propagation_status,
    content_propagation_status: record.content_propagation_status ?? (record.propagation_status === "complete" ? "complete" : null),
    git_backed_release_status: record.git_backed_release_status ?? (record.propagation_status === "complete" ? "verified" : null),
    next_check_date: record.next_check_date ?? null,
    canonical_dossier_ids: record.canonical_dossier_ids,
    reader_pathway_ids: record.reader_pathway_ids,
    dependency_map_ids: record.dependency_map_ids,
    local_system_ids: record.local_system_ids,
    companion_rechecks: record.companion_rechecks ?? []
  }));

  return publicDatasetResponse(
    "operating_cycle",
    "Thirteen gate identities. Top-level decision fields preserve the September 1 baseline; current_state carries later dated decisions and future appointments under current_state_as_of. The separate SLF renewal correction does not add a fourteenth gate. Repository release remains held.",
    records
  );
};
