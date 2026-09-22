import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { classifyCarryoverRecord, projectCarryoverLedger } from "./lib/phase173-live-projection.mjs";
import {
  OperatorRefusal,
  evidenceGateContextFromCarryover,
  validateEvidenceGateCommand,
  validateWeeklyClosureCommand,
  weeklyCycleContextFromLedger,
  weeklyClosureInputDigest,
} from "./lib/phase173-operators.mjs";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(appRoot, "..");
const dataDir = path.join(appRoot, "src", "data");
const sourceDir = path.join(appRoot, "src", "content", "sources");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const digest = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

const phase173 = readJson("phase-173-september-closeout-october-opening-ledger.json");
const phase174 = readJson("phase-174-evidence-cycle-closure-intake.json");
const phase60 = readJson("phase-60-operating-cycle.json");
const phase156 = readJson("phase-156-v1-launch-decision.json");
const phase164 = readJson("phase-164-monthly-candidate-decision.json");
const phase166 = readJson("phase-166-weekly-desk-closures-and-editions.json");
const phase172 = readJson("phase-172-september-state-report.json");

assert.equal(phase173.phase, 173);
assert.equal(phase173.schema_version, "1.0");
assert.equal(phase173.build_status, "Complete locally");
assert.match(phase173.operating_status, /Open/);
assert.equal(phase173.append_events.length, 0);
assert.equal(phase173.routes.hub, "/review/v1oct/operating-foundation/");
assert.equal(
  phase173.routes.public_export,
  "/data/phase-173-september-closeout-october-opening-ledger.json",
);

const frozenByPhase = new Map(phase173.frozen_baselines.map((entry) => [entry.phase, entry]));
assert.equal(
  frozenByPhase.get(156).artifact_digest,
  "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a",
);
assert.equal(
  frozenByPhase.get(164).artifact_digest,
  "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19",
);
assert.equal(
  frozenByPhase.get(172).artifact_digest,
  "cdf822b6451e02523dbdcadfc0f21470011285033de55c919718785aaffd9b34",
);
for (const entry of phase173.frozen_baselines) assert.equal(entry.mutation_allowed, false);
assert.equal(phase156.local_validation_receipt.artifact_digest, frozenByPhase.get(156).artifact_digest);
assert.equal(phase164.local_validation_receipt.artifact_digest, frozenByPhase.get(164).artifact_digest);
assert.equal(phase172.local_validation_receipt.artifact_digest, frozenByPhase.get(172).artifact_digest);

const ids = phase173.carryover_records.map((record) => record.carryover_id);
assert.equal(new Set(ids).size, ids.length, "Phase 173 carryover IDs must be unique");
assert.equal(ids.length, 129);
assert.deepEqual(ids, phase173.carryover_records.map((record) => record.carryover_id));

for (const [index, record] of phase173.carryover_records.entries()) {
  assert.equal(record.sequence, index + 1);
  assert.equal(Object.keys(record).find((key) => key.endsWith("_id")), "carryover_id");
  assert.match(record.route, /^\/review\/v1oct\/operating-foundation\/[a-z0-9-]+\/$/);
  assert.match(record.record_digest, /^[0-9a-f]{64}$/);
  assert.equal(
    record.record_digest,
    digest({
      carryover_id: record.carryover_id,
      record_class: record.record_class,
      upstream_record_id: record.upstream_record_id,
      scheduled_date: record.scheduled_date,
      trigger_kind: record.trigger_kind,
      decision_status: record.decision_status,
      decision_date: record.decision_date,
      receipt_id: record.receipt_id,
    }),
  );
}
assert.equal(phase173.public_html_routes.length, 130);
assert.equal(new Set(phase173.public_html_routes).size, 130);
assert.deepEqual(phase173.public_json_exports, [phase173.routes.public_export]);

const weeklyEditionCarryovers = phase173.carryover_records.filter(
  (record) => record.record_class === "weekly_edition",
);
assert.equal(weeklyEditionCarryovers.length, phase166.weekly_cycles.length);
for (const weeklyCycle of phase166.weekly_cycles) {
  const edition = weeklyEditionCarryovers.find(
    (record) => record.upstream_record_id === weeklyCycle.weekly_cycle_id,
  );
  assert.ok(edition, `${weeklyCycle.weekly_cycle_id} has no Phase 173 edition carryover`);
  const deskWindowIds = weeklyCycle.desk_window_bindings.map((window) => window.window_id);
  assert.equal(deskWindowIds.length, 17);
  assert.deepEqual(edition.desk_window_ids, deskWindowIds);
  assert.deepEqual(edition.due_operation_ids, weeklyCycle.due_operation_ids);
  assert.equal(edition.scheduled_date, weeklyCycle.scheduled_date);
  assert.equal(edition.source_eligibility_cutoff, weeklyCycle.source_eligibility_cutoff);
  assert.equal(edition.upstream_edition_packet_id, weeklyCycle.upstream_edition_packet_id);
  assert.deepEqual(edition.affected_record_ids, [
    weeklyCycle.upstream_edition_packet_id,
    ...weeklyCycle.due_operation_ids,
    ...deskWindowIds,
  ]);
}

const expectedClasses = {
  authority_docket: 12,
  companion_recheck: 3,
  desk_window: 68,
  evidence_gate: 8,
  longitudinal_compatibility: 3,
  mission_docket: 6,
  project_file_recheck: 1,
  publication_control: 5,
  requirement_docket: 18,
  weekly_edition: 4,
  zero_series_owner_disposition: 1,
};
const effectiveProjection = projectCarryoverLedger(
  phase173.carryover_records,
  phase173.effective_date,
);
assert.deepEqual(effectiveProjection, phase173.live_projection_at_effective_date);
assert.deepEqual(effectiveProjection.by_record_class, expectedClasses);
assert.deepEqual(effectiveProjection.by_projection_state, {
  terminal: 1,
  due: 0,
  overdue: 0,
  future: 83,
  held_owner: 40,
  held_publication: 5,
});
assert.equal(effectiveProjection.calendar_records, 84);
assert.equal(effectiveProjection.owner_or_publication_records, 45);
assert.equal(effectiveProjection.silent_overdue_count, 0);
assert.equal(phase173.counts.owner_held_records, 40);
assert.equal(phase173.counts.publication_held_records, 5);
assert.equal(
  phase173.counts.calendar_records + phase173.counts.owner_held_records + phase173.counts.publication_held_records,
  phase173.counts.carryover_records,
);

for (const record of phase173.carryover_records) {
  const state = classifyCarryoverRecord(record, phase173.effective_date);
  if (state !== "terminal") {
    assert.equal(record.decision_status, null, `${record.carryover_id} has a predated decision`);
    assert.equal(record.decision_date, null, `${record.carryover_id} has a predated decision date`);
    assert.equal(record.receipt_id, null, `${record.carryover_id} has a precreated receipt`);
    assert.match(record.release_state, /Held/);
  }
}

const terminalCarryovers = phase173.carryover_records.filter(
  (record) => classifyCarryoverRecord(record, phase173.effective_date) === "terminal",
);
assert.equal(terminalCarryovers[0].upstream_record_id, "165-OPERATION-001");
assert.equal(terminalCarryovers[0].receipt_id, "receipt-60-louisiana-starlink-2026-09-01-no-material-change");

const september6Projection = projectCarryoverLedger(phase173.carryover_records, "2026-09-06");
assert.equal(september6Projection.by_projection_state.due, 18);
assert.equal(september6Projection.by_projection_state.overdue, 0);
const september7Projection = projectCarryoverLedger(phase173.carryover_records, "2026-09-07");
assert.equal(september7Projection.by_projection_state.overdue, 18);

assert.deepEqual(phase173.count_semantics, {
  authority_dockets: 12,
  requirement_dockets: 18,
  mission_dockets: 6,
  authority_requirement_mission_total: 36,
  longitudinal_compatibility_packets: 3,
  separate_zero_series_owner_dispositions: 1,
  combined_owner_controlled_backlog: 37,
  note:
    "The combined backlog count of 37 includes the separate zero-series disposition but excludes the three longitudinal compatibility packets and five publication controls.",
});

const darpaRecheck = phase173.carryover_records.find(
  (record) => record.carryover_id === "173-CARRY-DARPA-2026-09-23",
);
assert.ok(darpaRecheck);
assert.equal(darpaRecheck.scheduled_date, "2026-09-23");
assert.equal(darpaRecheck.upstream_cycle_item_id, "60-CYCLE-DARPA-RESULTS");
assert.equal(darpaRecheck.decision_status, null);
assert.equal(darpaRecheck.receipt_id, null);
assert.equal(phase173.darpa_september_23_reconciliation.cycle_001_identity_delta, 0);
assert.equal(phase60.records.length, 13);
assert.equal(
  phase60.records.find((record) => record.cycle_item_id === "60-CYCLE-DARPA-RESULTS").next_check_date,
  "2026-09-23",
);
assert.ok(
  phase173.carryover_records.some(
    (record) => record.carryover_id === "173-CARRY-STARLINK-2026-09-08",
  ),
);

assert.equal(phase174.phase, 174);
assert.equal(phase174.schema_version, "1.0");
assert.equal(phase174.build_status, "Complete locally");
assert.match(phase174.operating_status, /Held/);
assert.equal(phase174.routes.hub, "/review/v1oct/cycle-closure-intake/");
assert.equal(
  phase174.routes.public_export,
  "/data/phase-174-evidence-cycle-closure-intake.json",
);

const auditItems = phase174.cycle_001_closeout.audit_items;
assert.equal(auditItems.length, 13);
assert.equal(new Set(auditItems.map((item) => item.cycle_item_id)).size, 13);
for (const item of auditItems) {
  assert.equal(Object.keys(item).find((key) => key.endsWith("_id")), "audit_item_id");
  assert.match(item.route, /^\/review\/v1oct\/cycle-closure-intake\/[a-z0-9-]+\/$/);
}
assert.deepEqual(
  auditItems.map((item) => item.cycle_item_id),
  phase60.records.map((record) => record.cycle_item_id),
);
const terminalAuditItems = auditItems.filter((item) => item.decision_status !== null);
const futureAuditItems = auditItems.filter((item) => item.decision_status === null);
assert.equal(terminalAuditItems.length, 3);
assert.equal(futureAuditItems.length, 10);
for (const item of terminalAuditItems) {
  assert.ok(item.decision_date);
  assert.ok(item.receipt_id);
  assert.ok(item.propagation_proof_id);
}
for (const item of futureAuditItems) {
  assert.equal(item.decision_date, null);
  assert.equal(item.receipt_id, null);
  assert.equal(item.propagation_proof_id, null);
  assert.match(item.git_backed_release_state, /Held/);
}
assert.equal(phase174.cycle_001_closeout.closure_decision, null);
assert.equal(phase174.cycle_001_closeout.closure_date, null);
assert.equal(phase174.cycle_001_closeout.closure_receipt_id, null);
assert.deepEqual(phase174.cycle_001_closeout.final_three_gate_ids, [
  "60-CYCLE-LOUDOUN-STANDARDS",
  "60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY",
  "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE",
]);
assert.equal(
  auditItems.find((item) => item.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION")
    .git_backed_release_state,
  "Held",
);

const cycleTwo = phase174.cycle_002_intake;
assert.equal(cycleTwo.candidate_count, 10);
assert.equal(cycleTwo.candidates.length, 10);
assert.equal(new Set(cycleTwo.candidates.map((candidate) => candidate.candidate_id)).size, 10);
assert.equal(new Set(cycleTwo.candidates.map((candidate) => candidate.lane)).size, 8);
assert.equal(cycleTwo.intake_decision, null);
assert.equal(cycleTwo.intake_decision_date, null);
assert.equal(cycleTwo.intake_receipt_id, null);

const sourceIds = new Set(
  fs
    .readdirSync(sourceDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(fs.readFileSync(path.join(sourceDir, name), "utf8")).id)
    .filter(Boolean),
);
for (const candidate of cycleTwo.candidates) {
  assert.equal(Object.keys(candidate).find((key) => key.endsWith("_id")), "candidate_id");
  assert.match(candidate.route, /^\/review\/v1oct\/cycle-closure-intake\/[a-z0-9-]+\/$/);
  assert.equal(candidate.candidate_state, "Prepared — intake only");
  assert.equal(candidate.lawful_date, null);
  assert.equal(candidate.source_checked_date, null);
  assert.equal(candidate.decision, null);
  assert.equal(candidate.decision_date, null);
  assert.equal(candidate.receipt_id, null);
  assert.equal(candidate.propagation_proof_id, null);
  assert.equal(candidate.git_backed_release_state, "Held");
  assert.ok(candidate.event_trigger.length > 30);
  assert.ok(candidate.exact_artifact.length > 30);
  assert.ok(candidate.method_requirement.length > 30);
  assert.ok(candidate.denominator_requirement.length > 30);
  assert.ok(candidate.affected_record_ids.length > 0);
  assert.ok(candidate.stop_rule.length > 30);
  for (const sourceId of candidate.primary_authority_source_ids) {
    assert.ok(sourceIds.has(sourceId), `${candidate.candidate_id} references missing ${sourceId}`);
  }
}
assert.equal(phase174.public_html_routes.length, 24);
assert.equal(new Set(phase174.public_html_routes).size, 24);
assert.deepEqual(phase174.public_json_exports, [phase174.routes.public_export]);

const refusesWith = (run, code) =>
  assert.throws(run, (error) => error instanceof OperatorRefusal && error.code === code);

const canonicalEvidenceLedger = phase173.carryover_records
  .filter((record) => record.record_class === "evidence_gate")
  .map(evidenceGateContextFromCarryover);
const starlinkPacket = canonicalEvidenceLedger.find(
  (packet) => packet.operation_id === "165-OPERATION-001",
);
assert.ok(starlinkPacket);
const evidenceContext = {
  today: "2026-09-01",
  existing_receipt_ids: [],
  canonical_evidence_gate_ledger: canonicalEvidenceLedger,
};
const evidenceCommand = {
  cycle_item_id: starlinkPacket.cycle_item_id,
  operation_id: starlinkPacket.operation_id,
  lawful_date: starlinkPacket.lawful_date,
  source_checked_date: "2026-09-01",
  decision_date: "2026-09-01",
  decision_status: "no_material_change",
  receipt_id: "receipt-173-operator-test",
  receipt_cycle_item_id: starlinkPacket.cycle_item_id,
  candidate_digest: starlinkPacket.candidate_digest,
  checked_source_ids: [...starlinkPacket.expected_source_ids],
  propagation_target_ids: [...starlinkPacket.affected_record_ids],
  git_backed_release_state: "held",
};
const evidenceAcceptance = validateEvidenceGateCommand(evidenceCommand, evidenceContext);
assert.equal(evidenceAcceptance.accepted, true);
assert.match(evidenceAcceptance.idempotency_key, /^[0-9a-f]{64}$/);
assert.equal(
  evidenceAcceptance.idempotency_key,
  validateEvidenceGateCommand(
    {
      ...evidenceCommand,
      checked_source_ids: [...evidenceCommand.checked_source_ids].reverse(),
      propagation_target_ids: [...evidenceCommand.propagation_target_ids].reverse(),
    },
    evidenceContext,
  ).idempotency_key,
  "evidence idempotency must use canonical ID-set ordering",
);
assert.notEqual(
  validateEvidenceGateCommand(
    { ...evidenceCommand, receipt_id: "receipt-173-operator-test-second" },
    evidenceContext,
  ).idempotency_key,
  evidenceAcceptance.idempotency_key,
  "a different evidence receipt must produce a different idempotency key",
);

refusesWith(
  () => validateEvidenceGateCommand(evidenceCommand, { today: "2026-09-01" }),
  "MISSING_CONTEXT",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(
      { ...evidenceCommand, operation_id: "165-OPERATION-ARBITRARY" },
      evidenceContext,
    ),
  "UNKNOWN_OPERATION",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(
      { ...evidenceCommand, cycle_item_id: "60-CYCLE-LOUISIANA-NEXTLINK-ADOPTION" },
      evidenceContext,
    ),
  "MIXED_IDENTITY",
);
refusesWith(
  () => validateEvidenceGateCommand({ ...evidenceCommand, lawful_date: "2026-08-31" }, evidenceContext),
  "MOVED_DATE",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(
      { ...evidenceCommand, candidate_digest: "0".repeat(64) },
      evidenceContext,
    ),
  "MISMATCHED_DIGEST",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(
      { ...evidenceCommand, checked_source_ids: evidenceCommand.checked_source_ids.slice(1) },
      evidenceContext,
    ),
  "MISMATCHED_SOURCE_SET",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(
      { ...evidenceCommand, checked_source_ids: [...evidenceCommand.checked_source_ids, "source-arbitrary"] },
      evidenceContext,
    ),
  "MISMATCHED_SOURCE_SET",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(
      { ...evidenceCommand, propagation_target_ids: evidenceCommand.propagation_target_ids.slice(1) },
      evidenceContext,
    ),
  "MISMATCHED_AFFECTED_SET",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(
      { ...evidenceCommand, receipt_cycle_item_id: "60-CYCLE-LOUISIANA-NEXTLINK-ADOPTION" },
      evidenceContext,
    ),
  "MIXED_IDENTITY",
);
refusesWith(
  () =>
    validateEvidenceGateCommand(evidenceCommand, {
      ...evidenceContext,
      existing_receipt_ids: [evidenceCommand.receipt_id],
    }),
  "DUPLICATE_RECEIPT",
);

const canonicalWeeklyLedger = phase166.weekly_cycles.map(weeklyCycleContextFromLedger);
const weekOneContext = canonicalWeeklyLedger.find((cycle) => cycle.weekly_cycle_id === "166-WEEK-01");
assert.ok(weekOneContext);
const terminalWindows = weekOneContext.expected_desks.map(({ window_id, desk_id }, index) => ({
  window_id,
  desk_id,
  decision: "no_material_change",
  decision_date: "2026-09-06",
  receipt_id: `receipt-test-window-${String(index + 1).padStart(2, "0")}`,
  receipt_window_id: window_id,
  source_cutoff: "2026-09-06",
}));
const dueOperationDates = new Map([
  ["145-GATE-001", "2026-08-23"],
  ["145-GATE-002", "2026-08-15"],
  ["145-GATE-003", "2026-09-01"],
]);
const terminalDueOperations = weekOneContext.due_operation_ids.map((operation_id, index) => ({
  operation_id,
  decision_status: "no_material_change",
  decision_date: dueOperationDates.get(operation_id),
  receipt_id: `receipt-test-due-operation-${String(index + 1).padStart(2, "0")}`,
  receipt_operation_id: operation_id,
}));
const weeklyCommand = {
  weekly_cycle_id: weekOneContext.weekly_cycle_id,
  receipt_weekly_cycle_id: weekOneContext.weekly_cycle_id,
  scheduled_date: weekOneContext.scheduled_date,
  publication_decision: "no_publication",
  publication_decision_date: "2026-09-06",
  publication_receipt_id: "receipt-test-edition",
  publication_input_digest: weeklyClosureInputDigest(terminalWindows, terminalDueOperations),
  windows: terminalWindows,
  due_operations: terminalDueOperations,
};
const weeklyContext = {
  today: "2026-09-06",
  existing_receipt_ids: [],
  canonical_weekly_cycle_ledger: canonicalWeeklyLedger,
};
const weeklyAcceptance = validateWeeklyClosureCommand(weeklyCommand, weeklyContext);
assert.equal(weeklyAcceptance.accepted, true);
assert.match(weeklyAcceptance.idempotency_key, /^[0-9a-f]{64}$/);

const reversedWindows = [...terminalWindows].reverse();
const reversedDueOperations = [...terminalDueOperations].reverse();
const reorderedWeeklyCommand = {
  ...weeklyCommand,
  windows: reversedWindows,
  due_operations: reversedDueOperations,
  publication_input_digest: weeklyClosureInputDigest(reversedWindows, reversedDueOperations),
};
assert.equal(
  validateWeeklyClosureCommand(reorderedWeeklyCommand, weeklyContext).idempotency_key,
  weeklyAcceptance.idempotency_key,
  "weekly idempotency must canonically bind all desk and due-operation inputs",
);

refusesWith(
  () => validateWeeklyClosureCommand(weeklyCommand, { today: "2026-09-06" }),
  "MISSING_CONTEXT",
);
refusesWith(
  () => validateWeeklyClosureCommand({ ...weeklyCommand, scheduled_date: "2026-09-07" }, weeklyContext),
  "MOVED_DATE",
);
refusesWith(
  () => validateWeeklyClosureCommand({ ...weeklyCommand, windows: terminalWindows.slice(1) }, weeklyContext),
  "INCOMPLETE_DESK_SET",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      { ...weeklyCommand, windows: [...terminalWindows, { ...terminalWindows[0], window_id: "151-WINDOW-EXTRA" }] },
      weeklyContext,
    ),
  "INCOMPLETE_DESK_SET",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      {
        ...weeklyCommand,
        windows: terminalWindows.map((window, index) =>
          index === 0 ? { ...window, decision: "scheduled" } : window,
        ),
      },
      weeklyContext,
    ),
  "NONTERMINAL_WINDOW",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      {
        ...weeklyCommand,
        windows: terminalWindows.map((window, index) =>
          index === 0 ? { ...window, receipt_window_id: terminalWindows[1].window_id } : window,
        ),
      },
      weeklyContext,
    ),
  "MIXED_IDENTITY",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      { ...weeklyCommand, due_operations: terminalDueOperations.slice(1) },
      weeklyContext,
    ),
  "MISMATCHED_DUE_OPERATION_SET",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      {
        ...weeklyCommand,
        due_operations: [
          ...terminalDueOperations,
          {
            operation_id: "145-GATE-ARBITRARY",
            decision_status: "no_material_change",
            decision_date: "2026-09-01",
            receipt_id: "receipt-arbitrary",
            receipt_operation_id: "145-GATE-ARBITRARY",
          },
        ],
      },
      weeklyContext,
    ),
  "MISMATCHED_DUE_OPERATION_SET",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      {
        ...weeklyCommand,
        due_operations: terminalDueOperations.map((operation, index) =>
          index === 0 ? { ...operation, decision_status: "scheduled" } : operation,
        ),
      },
      weeklyContext,
    ),
  "NONTERMINAL_OPERATION",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      {
        ...weeklyCommand,
        due_operations: terminalDueOperations.map((operation, index) =>
          index === 0
            ? { ...operation, receipt_operation_id: terminalDueOperations[1].operation_id }
            : operation,
        ),
      },
      weeklyContext,
    ),
  "MIXED_IDENTITY",
);
refusesWith(
  () =>
    validateWeeklyClosureCommand(
      { ...weeklyCommand, publication_input_digest: "0".repeat(64) },
      weeklyContext,
    ),
  "MISMATCHED_DIGEST",
);
refusesWith(
  () => validateWeeklyClosureCommand(weeklyCommand, { ...weeklyContext, today: "2026-09-05" }),
  "FUTURE_DATE",
);

const changedDueReceipt = terminalDueOperations.map((operation, index) =>
  index === 0 ? { ...operation, receipt_id: "receipt-changed-due-operation" } : operation,
);
assert.notEqual(
  weeklyClosureInputDigest(terminalWindows, terminalDueOperations),
  weeklyClosureInputDigest(terminalWindows, changedDueReceipt),
  "due-operation receipts must participate in the weekly input digest",
);
const changedDueReceiptCommand = {
  ...weeklyCommand,
  due_operations: changedDueReceipt,
  publication_input_digest: weeklyClosureInputDigest(terminalWindows, changedDueReceipt),
};
assert.notEqual(
  validateWeeklyClosureCommand(changedDueReceiptCommand, weeklyContext).idempotency_key,
  weeklyAcceptance.idempotency_key,
  "due-operation receipt changes must produce a different weekly idempotency key",
);

for (const workPackage of [
  "docs/work-packages/phase-173-september-closeout-and-october-opening-ledger.md",
  "docs/work-packages/phase-174-evidence-cycle-001-closure-and-cycle-002-intake.md",
]) {
  assert.ok(fs.existsSync(path.join(workspaceRoot, workPackage)), `${workPackage} is missing`);
}

console.log(
  "Phase 173–174 control-plane assertions passed: 129 carryovers, 13 Cycle 001 audit items, 10 held Cycle 002 candidates, and both generalized operators verified.",
);
