import type { APIRoute } from "astro";
import registry from "../../data/phase-62-conversion-event-ledgers.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const records = registry.events.map((event) => ({
    event_id: event.event_id,
    sequence: event.sequence,
    file_id: event.file_id,
    event_date: event.event_date,
    date_basis: event.date_basis,
    event_type: event.event_type,
    title: event.title,
    prior_stage: event.prior_stage,
    current_stage: event.current_stage,
    materiality: event.materiality,
    evidence_artifact: event.evidence_artifact,
    source_ids: event.source_ids,
    signal_id: event.signal_id,
    signal_status_at_capture: event.signal_status_at_capture,
    receipt_id: event.receipt_id,
    decision_status: event.decision_status,
    interpretation_boundary: event.interpretation_boundary,
    next_gate: event.next_gate
  }));

  return publicDatasetResponse(
    "conversion_events",
    "Seventeen source-resolved events backfilled across the eight Phase 61 named conversion files. Backfilled events are not receipts; future appends require a dated decision receipt and complete propagation.",
    records
  );
};
