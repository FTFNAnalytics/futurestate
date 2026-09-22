import { pathToFileURL } from "node:url";
import fs from "node:fs";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const TERMINAL_DECISION_STATUSES = new Set([
  "material_change",
  "no_material_change",
  "blocked_with_public_receipt",
  "rescheduled_with_watch_note",
  "published",
  "no_publication",
  "accepted",
  "rejected",
  "superseded",
]);

export const NON_CALENDAR_TRIGGER_KINDS = new Set([
  "owner",
  "publication_authority",
]);

function assertIsoDate(value, label) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) {
    throw new Error(`${label} must be an ISO calendar date`);
  }
}

function hasTerminalReceipt(record) {
  const hasDecision = TERMINAL_DECISION_STATUSES.has(record.decision_status);
  const hasReceipt = typeof record.receipt_id === "string" && record.receipt_id.length > 0;
  const hasDate = typeof record.decision_date === "string" && ISO_DATE.test(record.decision_date);

  if ([hasDecision, hasReceipt, hasDate].some(Boolean) && ![hasDecision, hasReceipt, hasDate].every(Boolean)) {
    throw new Error(
      `${record.carryover_id}: terminal status, decision date, and receipt must be present together`,
    );
  }

  return hasDecision && hasReceipt && hasDate;
}

export function classifyCarryoverRecord(record, asOfDate) {
  assertIsoDate(asOfDate, "asOfDate");
  if (!record || typeof record !== "object") throw new Error("carryover record must be an object");
  if (!record.carryover_id) throw new Error("carryover record must have carryover_id");

  if (hasTerminalReceipt(record)) {
    if (record.decision_date > asOfDate) {
      throw new Error(`${record.carryover_id}: decision date is later than the projection cutoff`);
    }
    return "terminal";
  }

  if (NON_CALENDAR_TRIGGER_KINDS.has(record.trigger_kind)) {
    if (record.scheduled_date !== null) {
      throw new Error(`${record.carryover_id}: owner/publication records cannot carry a calendar date`);
    }
    return record.trigger_kind === "owner" ? "held_owner" : "held_publication";
  }

  if (record.trigger_kind !== "calendar") {
    throw new Error(`${record.carryover_id}: unsupported trigger_kind ${record.trigger_kind}`);
  }

  assertIsoDate(record.scheduled_date, `${record.carryover_id}.scheduled_date`);
  if (record.scheduled_date < asOfDate) return "overdue";
  if (record.scheduled_date === asOfDate) return "due";
  return "future";
}

export function projectCarryoverLedger(records, asOfDate) {
  assertIsoDate(asOfDate, "asOfDate");
  if (!Array.isArray(records)) throw new Error("records must be an array");

  const identities = new Set();
  const byProjectionState = {
    terminal: 0,
    due: 0,
    overdue: 0,
    future: 0,
    held_owner: 0,
    held_publication: 0,
  };
  const byRecordClass = {};
  const dueIds = [];
  const overdueIds = [];

  for (const record of records) {
    if (identities.has(record.carryover_id)) {
      throw new Error(`duplicate carryover identity ${record.carryover_id}`);
    }
    identities.add(record.carryover_id);

    const projectionState = classifyCarryoverRecord(record, asOfDate);
    byProjectionState[projectionState] += 1;
    byRecordClass[record.record_class] = (byRecordClass[record.record_class] ?? 0) + 1;
    if (projectionState === "due") dueIds.push(record.carryover_id);
    if (projectionState === "overdue") overdueIds.push(record.carryover_id);
  }

  return {
    as_of_date: asOfDate,
    total_records: records.length,
    calendar_records:
      byProjectionState.terminal +
      byProjectionState.due +
      byProjectionState.overdue +
      byProjectionState.future,
    owner_or_publication_records:
      byProjectionState.held_owner + byProjectionState.held_publication,
    by_projection_state: byProjectionState,
    by_record_class: Object.fromEntries(
      Object.entries(byRecordClass).sort(([left], [right]) => left.localeCompare(right)),
    ),
    due_ids: dueIds,
    overdue_ids: overdueIds,
    silent_overdue_count: overdueIds.length,
  };
}

async function runCli() {
  const [ledgerPath, asOfDate] = process.argv.slice(2);
  if (!ledgerPath || !asOfDate) {
    throw new Error("Usage: node phase173-live-projection.mjs <ledger.json> <YYYY-MM-DD>");
  }
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
  process.stdout.write(`${JSON.stringify(projectCarryoverLedger(ledger.carryover_records, asOfDate), null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runCli();
}
