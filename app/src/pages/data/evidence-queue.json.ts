import type { APIRoute } from "astro";
import queue from "../../data/phase-58-dated-evidence-queue.json";
import receiptRegistry from "../../data/phase-58-change-receipts.json";
import { projectEvidenceRecord, currentDecisionFor, currentEvidenceLedger, evidenceReceiptsForControl, evidenceReceiptsForRoute } from '../../lib/current-evidence.mjs';
import { publicDatasetResponse } from "../../lib/public-data";

const receiptById = new Map(
  receiptRegistry.receipts.map((receipt) => [receipt.receipt_id, receipt])
);

export const GET: APIRoute = async () => {
  const records = queue.records.map((record) => ({
    snapshot_as_of: '2026-09-01', current_state_as_of: currentEvidenceLedger.as_of_date, current_state: projectEvidenceRecord(record), current_receipt: currentDecisionFor(record),
    dated_review_receipts: evidenceReceiptsForControl(record),
    queue_id: record.queue_id,
    target: record.target,
    underlying_signal_id: record.underlying_signal_id,
    underlying_signal_status: record.underlying_signal_status,
    source_id: record.source_id,
    source_url: record.source_url,
    exact_next_artifact: record.exact_next_artifact,
    last_checked_date: record.last_checked_date,
    next_check_date: record.next_check_date,
    review_cadence_days: record.review_cadence_days,
    current_decision: record.current_decision,
    bounded_finding: record.bounded_finding,
    stop_rule: record.stop_rule,
    supporting_source_ids: record.supporting_source_ids ?? [],
    latest_receipt: record.latest_receipt_id
      ? receiptById.get(record.latest_receipt_id) ?? null
      : null,
    companion_rechecks: (record.companion_rechecks ?? []).map((recheck) => ({
      ...recheck,
      receipt: receiptById.get(recheck.receipt_id) ?? null
    }))
  }));

  return publicDatasetResponse(
    "evidence_queue",
    "Ten result and outcome gates. Top-level fields preserve the September 1 baseline and companion history; current_state and current_receipt carry later dated reviews. No decision transfers between gates. related_cycle_reviews retains assigned local-monitor receipts separately; these do not add queue rows or cycle identities.",
    records,
    {related_cycle_reviews:evidenceReceiptsForRoute('/data/evidence-queue.json').filter(receipt=>!String(receipt.origin_record_id).startsWith('58-QUEUE-'))}
  );
};
