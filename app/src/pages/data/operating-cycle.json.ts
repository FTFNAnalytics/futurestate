import type { APIRoute } from "astro";
import cycle from "../../data/phase-60-operating-cycle.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const records = cycle.records.map((record) => ({
    cycle_item_id: record.cycle_item_id,
    wave: record.wave,
    target: record.target,
    origin_record_id: record.origin_record_id,
    source_ids: record.source_ids,
    underlying_signal_id: record.underlying_signal_id,
    exact_next_artifact: record.exact_next_artifact,
    scheduled_check_date: record.scheduled_check_date,
    decision_status: record.decision_status,
    decision_date: record.decision_date,
    receipt_id: record.receipt_id,
    canonical_dossier_ids: record.canonical_dossier_ids,
    reader_pathway_ids: record.reader_pathway_ids,
    dependency_map_ids: record.dependency_map_ids,
    local_system_ids: record.local_system_ids
  }));

  return publicDatasetResponse(
    "operating_cycle",
    "Thirteen evidence gates in Evidence Cycle 001 with exact artifacts, dates, decision state, and assigned propagation surfaces; two Wave 60B decisions are complete and eleven future gates remain scheduled.",
    records
  );
};
