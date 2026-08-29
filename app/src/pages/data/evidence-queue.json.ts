import type { APIRoute } from "astro";
import queue from "../../data/phase-58-dated-evidence-queue.json";
import receiptRegistry from "../../data/phase-58-change-receipts.json";
import { publicDatasetResponse } from "../../lib/public-data";

const receiptById = new Map(
  receiptRegistry.receipts.map((receipt) => [receipt.receipt_id, receipt])
);

export const GET: APIRoute = async () => {
  const records = queue.records.map((record) => ({
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
    latest_receipt: record.latest_receipt_id
      ? receiptById.get(record.latest_receipt_id) ?? null
      : null
  }));

  return publicDatasetResponse(
    "evidence_queue",
    "Ten result and outcome gates with exact artifacts, dated checks, review cadences, bounded findings, stop rules, and public change receipts; one measured-result gate is resolved and nine outcome gates remain held.",
    records
  );
};
