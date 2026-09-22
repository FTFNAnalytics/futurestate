import crypto from "node:crypto";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const EVIDENCE_RESULTS = new Set([
  "material_change",
  "no_material_change",
  "blocked_with_public_receipt",
  "rescheduled_with_watch_note",
]);
const EDITION_RESULTS = new Set(["published", "no_publication"]);
const TERMINAL_WINDOW_RESULTS = new Set(EVIDENCE_RESULTS);
const TERMINAL_DUE_OPERATION_RESULTS = new Set(EVIDENCE_RESULTS);

export class OperatorRefusal extends Error {
  constructor(code, message) {
    super(message);
    this.name = "OperatorRefusal";
    this.code = code;
  }
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function sha256Digest(value) {
  return crypto.createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function requireDate(value, field) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) {
    throw new OperatorRefusal("INVALID_DATE", `${field} must be an ISO calendar date`);
  }
}

function requireNonempty(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new OperatorRefusal("MISSING_FIELD", `${field} is required`);
  }
}

function requireDigest(value, field) {
  if (typeof value !== "string" || !SHA256.test(value)) {
    throw new OperatorRefusal("INVALID_DIGEST", `${field} must be a lowercase SHA-256 digest`);
  }
}

function rejectFutureDate(value, today, field) {
  requireDate(value, field);
  requireDate(today, "today");
  if (value > today) {
    throw new OperatorRefusal("FUTURE_DATE", `${field} cannot be later than ${today}`);
  }
}

function rejectDuplicateReceipt(receiptId, existingReceiptIds) {
  if (new Set(existingReceiptIds).has(receiptId)) {
    throw new OperatorRefusal("DUPLICATE_RECEIPT", `${receiptId} is already archived`);
  }
}

function canonicalIdSet(values, field, { allowEmpty = false, duplicateCode = "DUPLICATE_ID" } = {}) {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0)) {
    throw new OperatorRefusal("MISSING_FIELD", `${field} must be a${allowEmpty ? "n" : " non-empty"} array`);
  }
  for (const [index, value] of values.entries()) requireNonempty(value, `${field}[${index}]`);
  const unique = new Set(values);
  if (unique.size !== values.length) {
    throw new OperatorRefusal(duplicateCode, `${field} contains a duplicate identity`);
  }
  return [...unique].sort((left, right) => left.localeCompare(right));
}

function sameStrings(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function requireExactIdSet(actual, expected, field, code) {
  const actualIds = canonicalIdSet(actual, field);
  const expectedIds = canonicalIdSet(expected, `canonical ${field}`);
  if (!sameStrings(actualIds, expectedIds)) {
    throw new OperatorRefusal(code, `${field} does not match the canonical context`);
  }
  return actualIds;
}

/**
 * Convert one immutable Phase 173 evidence-gate carryover into the trusted packet
 * expected by validateEvidenceGateCommand. The packet is context, never command input.
 */
export function evidenceGateContextFromCarryover(record) {
  if (record?.record_class !== "evidence_gate") {
    throw new OperatorRefusal("INVALID_CONTEXT", "the carryover is not an evidence gate");
  }
  requireNonempty(record.upstream_record_id, "upstream_record_id");
  requireNonempty(record.upstream_cycle_item_id, "upstream_cycle_item_id");
  requireDate(record.scheduled_date, "scheduled_date");
  requireDigest(record.record_digest, "record_digest");
  return {
    operation_id: record.upstream_record_id,
    cycle_item_id: record.upstream_cycle_item_id,
    lawful_date: record.scheduled_date,
    expected_source_ids: canonicalIdSet(record.source_ids, "source_ids"),
    affected_record_ids: canonicalIdSet(record.affected_record_ids, "affected_record_ids"),
    candidate_digest: record.record_digest,
  };
}

/** Convert one immutable Phase 166 weekly-cycle record into trusted closure context. */
export function weeklyCycleContextFromLedger(cycle) {
  requireNonempty(cycle?.weekly_cycle_id, "weekly_cycle_id");
  requireDate(cycle?.scheduled_date, "scheduled_date");
  if (!Array.isArray(cycle?.desk_window_bindings) || cycle.desk_window_bindings.length !== 17) {
    throw new OperatorRefusal("INVALID_CONTEXT", "the canonical weekly cycle must contain seventeen desks");
  }
  const expectedDesks = cycle.desk_window_bindings.map((window) => {
    requireNonempty(window.window_id, "window_id");
    requireNonempty(window.desk_id, `${window.window_id}.desk_id`);
    return { window_id: window.window_id, desk_id: window.desk_id };
  });
  canonicalIdSet(expectedDesks.map((desk) => desk.window_id), "canonical window_ids", {
    duplicateCode: "INVALID_CONTEXT",
  });
  canonicalIdSet(expectedDesks.map((desk) => desk.desk_id), "canonical desk_ids", {
    duplicateCode: "INVALID_CONTEXT",
  });
  return {
    weekly_cycle_id: cycle.weekly_cycle_id,
    scheduled_date: cycle.scheduled_date,
    expected_desks: expectedDesks.sort((left, right) => left.window_id.localeCompare(right.window_id)),
    due_operation_ids: canonicalIdSet(cycle.due_operation_ids, "due_operation_ids", {
      duplicateCode: "INVALID_CONTEXT",
    }),
  };
}

function resolveCanonicalRecord(ledger, idField, id, label) {
  if (!Array.isArray(ledger) || ledger.length === 0) {
    throw new OperatorRefusal("MISSING_CONTEXT", `a canonical ${label} ledger is required`);
  }
  const matches = ledger.filter((entry) => entry?.[idField] === id);
  if (matches.length === 0) {
    throw new OperatorRefusal("UNKNOWN_OPERATION", `${id} is not present in the canonical ${label} ledger`);
  }
  if (matches.length !== 1) {
    throw new OperatorRefusal("INVALID_CONTEXT", `${id} is ambiguous in the canonical ${label} ledger`);
  }
  return matches[0];
}

function canonicalEvidenceCommand(command, packet) {
  return {
    cycle_item_id: packet.cycle_item_id,
    operation_id: packet.operation_id,
    lawful_date: packet.lawful_date,
    source_checked_date: command.source_checked_date,
    decision_date: command.decision_date,
    decision_status: command.decision_status,
    receipt_id: command.receipt_id,
    candidate_digest: packet.candidate_digest,
    checked_source_ids: canonicalIdSet(command.checked_source_ids, "checked_source_ids"),
    propagation_target_ids: canonicalIdSet(command.propagation_target_ids, "propagation_target_ids"),
    git_backed_release_state: command.git_backed_release_state,
  };
}

export function evidenceGateIdempotencyKey(command, canonicalPacket) {
  if (!canonicalPacket) {
    throw new OperatorRefusal("MISSING_CONTEXT", "canonical evidence-gate context is required");
  }
  return sha256Digest({
    operator: "phase173-evidence-gate-v2",
    command: canonicalEvidenceCommand(command, canonicalPacket),
    canonical_context_digest: sha256Digest(canonicalPacket),
  });
}

export function validateEvidenceGateCommand(command, context) {
  const today = context?.today;
  const existingReceiptIds = context?.existing_receipt_ids ?? [];
  requireNonempty(command?.cycle_item_id, "cycle_item_id");
  requireNonempty(command?.operation_id, "operation_id");
  requireNonempty(command?.receipt_id, "receipt_id");
  requireDigest(command?.candidate_digest, "candidate_digest");

  const packet = resolveCanonicalRecord(
    context?.canonical_evidence_gate_ledger,
    "operation_id",
    command.operation_id,
    "evidence-gate",
  );
  requireNonempty(packet.cycle_item_id, "canonical cycle_item_id");
  requireDate(packet.lawful_date, "canonical lawful_date");
  requireDigest(packet.candidate_digest, "canonical candidate_digest");
  if (command.cycle_item_id !== packet.cycle_item_id) {
    throw new OperatorRefusal("MIXED_IDENTITY", "cycle_item_id is not paired with operation_id in canonical context");
  }
  if (command.lawful_date !== packet.lawful_date) {
    throw new OperatorRefusal("MOVED_DATE", "lawful_date differs from the canonical operation date");
  }
  if (command.candidate_digest !== packet.candidate_digest) {
    throw new OperatorRefusal("MISMATCHED_DIGEST", "candidate_digest differs from canonical context");
  }
  requireExactIdSet(
    command.checked_source_ids,
    packet.expected_source_ids,
    "checked_source_ids",
    "MISMATCHED_SOURCE_SET",
  );
  requireExactIdSet(
    command.propagation_target_ids,
    packet.affected_record_ids,
    "propagation_target_ids",
    "MISMATCHED_AFFECTED_SET",
  );

  rejectFutureDate(command.lawful_date, today, "lawful_date");
  rejectFutureDate(command.source_checked_date, today, "source_checked_date");
  rejectFutureDate(command.decision_date, today, "decision_date");
  if (command.source_checked_date !== command.decision_date) {
    throw new OperatorRefusal(
      "MIXED_DECISION_DATE",
      "source_checked_date and decision_date must describe the same operating decision",
    );
  }
  if (command.decision_date < packet.lawful_date) {
    throw new OperatorRefusal("PREDATED_DECISION", "decision_date precedes the canonical lawful gate date");
  }
  if (!EVIDENCE_RESULTS.has(command.decision_status)) {
    throw new OperatorRefusal("INVALID_DECISION", "decision_status is not an allowed evidence result");
  }
  if (command.receipt_cycle_item_id !== packet.cycle_item_id) {
    throw new OperatorRefusal("MIXED_IDENTITY", "receipt and canonical cycle identities differ");
  }
  if (command.git_backed_release_state !== "held" && command.git_backed_release_state !== "verified") {
    throw new OperatorRefusal("INVALID_GIT_STATE", "Git-backed release state must be held or verified");
  }
  rejectDuplicateReceipt(command.receipt_id, existingReceiptIds);

  return {
    accepted: true,
    idempotency_key: evidenceGateIdempotencyKey(command, packet),
    canonical_context_digest: sha256Digest(packet),
    cycle_item_id: packet.cycle_item_id,
    operation_id: packet.operation_id,
    receipt_id: command.receipt_id,
  };
}

function canonicalWindowInput(window) {
  return {
    window_id: window.window_id,
    desk_id: window.desk_id,
    decision: window.decision,
    decision_date: window.decision_date,
    receipt_id: window.receipt_id,
    receipt_window_id: window.receipt_window_id,
    source_cutoff: window.source_cutoff,
  };
}

function canonicalDueOperationInput(operation) {
  return {
    operation_id: operation.operation_id,
    decision_status: operation.decision_status,
    decision_date: operation.decision_date,
    receipt_id: operation.receipt_id,
    receipt_operation_id: operation.receipt_operation_id,
  };
}

export function weeklyClosureInputDigest(windows, dueOperations) {
  if (!Array.isArray(windows) || !Array.isArray(dueOperations)) {
    throw new OperatorRefusal(
      "MISSING_FIELD",
      "weekly closure digest requires both desk windows and due operations",
    );
  }
  return sha256Digest({
    windows: windows
      .map(canonicalWindowInput)
      .sort((left, right) => left.window_id.localeCompare(right.window_id)),
    due_operations: dueOperations
      .map(canonicalDueOperationInput)
      .sort((left, right) => left.operation_id.localeCompare(right.operation_id)),
  });
}

export function weeklyClosureIdempotencyKey(command, canonicalCycle) {
  if (!canonicalCycle) {
    throw new OperatorRefusal("MISSING_CONTEXT", "canonical weekly-cycle context is required");
  }
  return sha256Digest({
    operator: "phase173-weekly-closure-v2",
    weekly_cycle_id: canonicalCycle.weekly_cycle_id,
    scheduled_date: canonicalCycle.scheduled_date,
    publication_decision: command.publication_decision,
    publication_decision_date: command.publication_decision_date,
    publication_receipt_id: command.publication_receipt_id,
    publication_input_digest: command.publication_input_digest,
    canonical_context_digest: sha256Digest(canonicalCycle),
    windows: command.windows
      .map(canonicalWindowInput)
      .sort((left, right) => left.window_id.localeCompare(right.window_id)),
    due_operations: command.due_operations
      .map(canonicalDueOperationInput)
      .sort((left, right) => left.operation_id.localeCompare(right.operation_id)),
  });
}

export function validateWeeklyClosureCommand(command, context) {
  const today = context?.today;
  const existingReceiptIds = context?.existing_receipt_ids ?? [];
  requireNonempty(command?.weekly_cycle_id, "weekly_cycle_id");
  requireNonempty(command?.publication_receipt_id, "publication_receipt_id");
  requireDigest(command?.publication_input_digest, "publication_input_digest");

  const canonicalCycle = resolveCanonicalRecord(
    context?.canonical_weekly_cycle_ledger,
    "weekly_cycle_id",
    command.weekly_cycle_id,
    "weekly-cycle",
  );
  requireDate(canonicalCycle.scheduled_date, "canonical scheduled_date");
  if (command.scheduled_date !== canonicalCycle.scheduled_date) {
    throw new OperatorRefusal("MOVED_DATE", "scheduled_date differs from the canonical weekly close date");
  }
  rejectFutureDate(command.scheduled_date, today, "scheduled_date");
  rejectFutureDate(command.publication_decision_date, today, "publication_decision_date");
  if (command.publication_decision_date < canonicalCycle.scheduled_date) {
    throw new OperatorRefusal("PREDATED_DECISION", "publication decision precedes the weekly close date");
  }
  if (command.receipt_weekly_cycle_id !== canonicalCycle.weekly_cycle_id) {
    throw new OperatorRefusal("MIXED_IDENTITY", "publication receipt and canonical weekly-cycle identities differ");
  }
  if (!EDITION_RESULTS.has(command.publication_decision)) {
    throw new OperatorRefusal("INVALID_PUBLICATION_DECISION", "publication decision must be published or no_publication");
  }

  if (!Array.isArray(canonicalCycle.expected_desks) || canonicalCycle.expected_desks.length !== 17) {
    throw new OperatorRefusal("INVALID_CONTEXT", "canonical weekly context must bind exactly seventeen desks");
  }
  if (!Array.isArray(command.windows) || command.windows.length !== 17) {
    throw new OperatorRefusal("INCOMPLETE_DESK_SET", "a weekly closure requires exactly seventeen desk windows");
  }
  const expectedWindowIds = canonicalIdSet(
    canonicalCycle.expected_desks.map((desk) => desk.window_id),
    "canonical window_ids",
    { duplicateCode: "INVALID_CONTEXT" },
  );
  const actualWindowIds = canonicalIdSet(
    command.windows.map((window) => window.window_id),
    "window_ids",
    { duplicateCode: "DUPLICATE_WINDOW" },
  );
  if (!sameStrings(actualWindowIds, expectedWindowIds)) {
    throw new OperatorRefusal("MISMATCHED_DESK_SET", "window_ids differ from the canonical seventeen-desk set");
  }
  const expectedDeskByWindow = new Map(
    canonicalCycle.expected_desks.map((desk) => [desk.window_id, desk.desk_id]),
  );

  if (!Array.isArray(command.due_operations)) {
    throw new OperatorRefusal("MISSING_DUE_OPERATIONS", "the canonical due-operation set is required");
  }
  const expectedDueOperationIds = canonicalIdSet(
    canonicalCycle.due_operation_ids,
    "canonical due_operation_ids",
    { duplicateCode: "INVALID_CONTEXT" },
  );
  const actualDueOperationIds = canonicalIdSet(
    command.due_operations.map((operation) => operation.operation_id),
    "due_operation_ids",
    { duplicateCode: "DUPLICATE_OPERATION" },
  );
  if (!sameStrings(actualDueOperationIds, expectedDueOperationIds)) {
    throw new OperatorRefusal(
      "MISMATCHED_DUE_OPERATION_SET",
      "due_operation_ids differ from the canonical weekly-cycle set",
    );
  }

  const usedReceiptIds = new Set();
  let latestWindowDecisionDate = canonicalCycle.scheduled_date;
  for (const window of command.windows) {
    requireNonempty(window.window_id, "window_id");
    requireNonempty(window.desk_id, `${window.window_id}.desk_id`);
    if (window.desk_id !== expectedDeskByWindow.get(window.window_id)) {
      throw new OperatorRefusal("MIXED_IDENTITY", `${window.window_id} is paired with the wrong desk_id`);
    }
    if (window.receipt_window_id !== window.window_id) {
      throw new OperatorRefusal("MIXED_IDENTITY", `${window.window_id} is paired with another window receipt`);
    }
    if (!TERMINAL_WINDOW_RESULTS.has(window.decision)) {
      throw new OperatorRefusal("NONTERMINAL_WINDOW", `${window.window_id} is not terminal`);
    }
    requireNonempty(window.receipt_id, `${window.window_id}.receipt_id`);
    rejectFutureDate(window.decision_date, today, `${window.window_id}.decision_date`);
    if (window.decision_date < canonicalCycle.scheduled_date) {
      throw new OperatorRefusal("PREDATED_DECISION", `${window.window_id} precedes the weekly close date`);
    }
    if (usedReceiptIds.has(window.receipt_id)) {
      throw new OperatorRefusal("DUPLICATE_RECEIPT", `${window.receipt_id} is reused across closure inputs`);
    }
    usedReceiptIds.add(window.receipt_id);
    if (window.decision_date > latestWindowDecisionDate) latestWindowDecisionDate = window.decision_date;
    requireDate(window.source_cutoff, `${window.window_id}.source_cutoff`);
    if (window.source_cutoff !== canonicalCycle.scheduled_date) {
      throw new OperatorRefusal("MIXED_CUTOFF", `${window.window_id} does not share the frozen weekly cutoff`);
    }
  }

  for (const operation of command.due_operations) {
    requireNonempty(operation.operation_id, "operation_id");
    if (operation.receipt_operation_id !== operation.operation_id) {
      throw new OperatorRefusal("MIXED_IDENTITY", `${operation.operation_id} is paired with another operation receipt`);
    }
    if (!TERMINAL_DUE_OPERATION_RESULTS.has(operation.decision_status)) {
      throw new OperatorRefusal("NONTERMINAL_OPERATION", `${operation.operation_id} is not terminal`);
    }
    requireNonempty(operation.receipt_id, `${operation.operation_id}.receipt_id`);
    rejectFutureDate(operation.decision_date, today, `${operation.operation_id}.decision_date`);
    if (operation.decision_date > canonicalCycle.scheduled_date) {
      throw new OperatorRefusal(
        "OPERATION_AFTER_CUTOFF",
        `${operation.operation_id} became terminal after the weekly cutoff`,
      );
    }
    if (usedReceiptIds.has(operation.receipt_id)) {
      throw new OperatorRefusal("DUPLICATE_RECEIPT", `${operation.receipt_id} is reused across closure inputs`);
    }
    usedReceiptIds.add(operation.receipt_id);
  }

  if (command.publication_decision_date < latestWindowDecisionDate) {
    throw new OperatorRefusal(
      "PREDATED_DECISION",
      "publication decision precedes at least one terminal desk decision",
    );
  }
  if (usedReceiptIds.has(command.publication_receipt_id)) {
    throw new OperatorRefusal(
      "DUPLICATE_RECEIPT",
      "publication receipt must be distinct from every desk and due-operation receipt",
    );
  }

  const computedDigest = weeklyClosureInputDigest(command.windows, command.due_operations);
  if (computedDigest !== command.publication_input_digest) {
    throw new OperatorRefusal(
      "MISMATCHED_DIGEST",
      "publication_input_digest does not match terminal desk and due-operation inputs",
    );
  }
  rejectDuplicateReceipt(command.publication_receipt_id, existingReceiptIds);

  return {
    accepted: true,
    idempotency_key: weeklyClosureIdempotencyKey(command, canonicalCycle),
    canonical_context_digest: sha256Digest(canonicalCycle),
    publication_input_digest: computedDigest,
    publication_receipt_id: command.publication_receipt_id,
  };
}
