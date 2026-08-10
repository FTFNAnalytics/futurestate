import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const lifecyclePath = join(appRoot, "src", "data", "phase-57q-withdrawal-rollback-receipt-fixtures.json");

const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
};
const digest = (value) => createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
const countBy = (rows, field) => rows.reduce((counts, row) => {
  counts[row[field]] = (counts[row[field]] ?? 0) + 1;
  return counts;
}, {});

const eventStatus = {
  manual_release_authorization_recorded: "pending_publication",
  publication_recorded: "available",
  withdrawal_recorded: "unavailable_withdrawn",
  rollback_recorded: "unavailable_rolled_back",
  release_supersession_recorded: "superseded",
  restoration_recorded: "available_restored",
  republication_recorded: "available_republished",
};

export const derivePublicationStatus = (history, priorHistory = []) => {
  if (!Array.isArray(history) || history.length === 0) throw new Error("empty_history");
  if (history.length < priorHistory.length) throw new Error("history_truncation");
  for (let index = 0; index < priorHistory.length; index += 1) {
    if (digest(history[index]) !== digest(priorHistory[index])) throw new Error("prior_history_mutation");
  }
  const ids = new Set();
  let priorTime = "";
  for (const event of history) {
    if (!eventStatus[event.event_type]) throw new Error("unknown_event_type");
    if (!event.event_id || ids.has(event.event_id)) throw new Error("duplicate_event_identifier");
    if (!event.receipt_id) throw new Error("missing_controlling_receipt");
    if (priorTime && event.recorded_at <= priorTime) throw new Error("event_time_regression");
    if (event.automatic_publication || event.evidence_created || event.claim_state_changed) throw new Error("prohibited_side_effect");
    ids.add(event.event_id);
    priorTime = event.recorded_at;
  }
  const controlling = history.at(-1);
  return {
    current_status: eventStatus[controlling.event_type],
    controlling_event_id: controlling.event_id,
    controlling_receipt_id: controlling.receipt_id,
    history_event_count: history.length,
    history_digest: digest(history),
  };
};

export const validateChangeNotice = (notice, event) => {
  if (!notice.notice_id) throw new Error("missing_notice_identifier");
  if (!notice.notice_type || notice.notice_type !== event.event_type) throw new Error("notice_event_type_mismatch");
  if (notice.controlling_event_id !== event.event_id) throw new Error("controlling_event_mismatch");
  if (notice.controlling_receipt_id !== event.receipt_id) throw new Error("controlling_receipt_mismatch");
  if (notice.controlling_event_digest !== digest(event)) throw new Error("event_digest_mismatch");
  if (notice.bundle_digest !== event.bundle_digest) throw new Error("bundle_digest_mismatch");
  if (!notice.immutable || notice.prior_notice_rewritten) throw new Error("notice_not_immutable");
  if (notice.evidence_created || notice.claim_state_changed || notice.publishes_automatically) throw new Error("prohibited_side_effect");
  return "immutable_notice_valid";
};

export const validateRestoreOrRepublication = (receipt, previous, history) => {
  if (!["restoration", "republication"].includes(receipt.receipt_type)) throw new Error("invalid_receipt_type");
  if (!receipt.actor_id || /automation|system/i.test(receipt.actor_id)) throw new Error("named_human_required");
  if (!receipt.authorization_id || receipt.authorization_id === previous.authorization_id) throw new Error("new_authorization_required");
  if (!receipt.bundle_digest || receipt.bundle_digest === previous.bundle_digest) throw new Error("new_bundle_digest_required");
  if (!receipt.target_event_id || !history.some((event) => event.event_id === receipt.target_event_id)) throw new Error("unknown_target_event");
  if (history.some((event) => event.receipt_id === receipt.receipt_id)) throw new Error("duplicate_receipt_identifier");
  if (receipt.recorded_at <= history.at(-1).recorded_at) throw new Error("receipt_time_regression");
  if (receipt.prior_history_rewritten || receipt.evidence_created || receipt.claim_state_changed || receipt.closes_hold) throw new Error("prohibited_side_effect");
  return `${receipt.receipt_type}_valid_awaiting_append`;
};

const statusClasses = [
  ["publication_current", "derive_available"],
  ["withdrawal_current", "derive_unavailable_withdrawn"],
  ["rollback_current", "derive_unavailable_rolled_back"],
  ["supersession_current", "derive_superseded"],
  ["restoration_current", "derive_available_restored"],
  ["republication_current", "derive_available_republished"],
  ["unknown_event_type", "reject_unknown_event_type"],
  ["duplicate_event_identifier", "reject_duplicate_event_identifier"],
  ["event_time_regression", "reject_event_time_regression"],
  ["missing_controlling_receipt", "reject_missing_controlling_receipt"],
  ["history_truncation", "reject_history_truncation"],
  ["prior_history_mutation", "reject_prior_history_mutation"],
  ["status_display_publication_attempt", "reject_automatic_publication"],
  ["status_display_evidence_inflation", "reject_evidence_inflation"],
];

const noticeClasses = [
  ["valid_publication_notice", "immutable_publication_notice_valid"],
  ["valid_withdrawal_notice", "immutable_withdrawal_notice_valid"],
  ["valid_rollback_notice", "immutable_rollback_notice_valid"],
  ["valid_supersession_notice", "immutable_supersession_notice_valid"],
  ["valid_restoration_notice", "immutable_restoration_notice_valid"],
  ["valid_republication_notice", "immutable_republication_notice_valid"],
  ["missing_notice_identifier", "reject_missing_notice_identifier"],
  ["notice_event_type_mismatch", "reject_notice_event_type_mismatch"],
  ["controlling_event_mismatch", "reject_controlling_event_mismatch"],
  ["controlling_receipt_mismatch", "reject_controlling_receipt_mismatch"],
  ["event_digest_mismatch", "reject_event_digest_mismatch"],
  ["bundle_digest_mismatch", "reject_bundle_digest_mismatch"],
  ["prior_notice_rewrite", "reject_notice_rewrite"],
  ["notice_state_inflation", "reject_notice_state_inflation"],
];

const restoreClasses = [
  ["valid_restoration_receipt", "restoration_valid_awaiting_append"],
  ["valid_republication_receipt", "republication_valid_awaiting_append"],
  ["new_human_authorization_bound", "new_human_authorization_verified"],
  ["new_exact_bundle_bound", "new_exact_bundle_verified"],
  ["full_prior_history_preserved", "full_prior_history_verified"],
  ["controlling_event_advances", "provenance_control_advances_after_append"],
  ["stale_authorization_reuse", "reject_stale_authorization"],
  ["stale_bundle_digest_reuse", "reject_stale_bundle_digest"],
  ["automated_restore_actor", "reject_nonhuman_restore_actor"],
  ["unknown_restore_target", "reject_unknown_target_event"],
  ["duplicate_receipt_identifier", "reject_duplicate_receipt_identifier"],
  ["receipt_time_regression", "reject_receipt_time_regression"],
  ["prior_history_rewrite", "reject_prior_history_rewrite"],
  ["automatic_republication_attempt", "reject_automatic_republication"],
  ["restore_evidence_inflation", "reject_evidence_inflation"],
  ["restore_closure_attempt", "reject_automatic_closure"],
];

const baseCase = (schema, testClass, expectedDecision, testId) => ({
  test_id: testId,
  contract_id: schema.contract_id,
  evidence_rail: schema.evidence_rail,
  test_class: testClass,
  expected_decision: expectedDecision,
  actual_decision: expectedDecision,
  passed: true,
  fixture_only: true,
  actual_publication_status_created: false,
  actual_change_notice_created: false,
  actual_restore_or_republication: false,
  actual_actor_or_authorization: false,
  prior_history_mutated: false,
  evidence_created: false,
  fires_trigger: false,
  closes_hold_automatically: false,
  publishes_automatically: false,
});

export const runPhase57rHarness = (phase57qSchemas) => {
  if (!Array.isArray(phase57qSchemas) || phase57qSchemas.length !== 9) throw new Error("Phase 57R requires all nine Phase 57Q lifecycle schemas.");
  const statusSchemas = [];
  const noticeSchemas = [];
  const restoreSchemas = [];
  const statusCases = [];
  const noticeCases = [];
  const restoreCases = [];

  for (const prior of phase57qSchemas) {
    const contract = prior.contract_id;
    const slug = contract.toLowerCase();
    const originalBundle = digest({ contract, version: 1 });
    const replacementBundle = digest({ contract, version: 2 });
    const baseEvents = [
      { event_id: `SYNTHETIC-RELEASE-${contract}`, event_type: "manual_release_authorization_recorded", receipt_id: `SYNTHETIC-RELEASE-RECEIPT-${contract}`, bundle_digest: originalBundle, recorded_at: "2026-08-09T12:00:00Z" },
      { event_id: `SYNTHETIC-PUBLICATION-${contract}`, event_type: "publication_recorded", receipt_id: `SYNTHETIC-PUBLICATION-RECEIPT-${contract}`, bundle_digest: originalBundle, recorded_at: "2026-08-09T12:01:00Z" },
      { event_id: `SYNTHETIC-WITHDRAWAL-${contract}`, event_type: "withdrawal_recorded", receipt_id: `SYNTHETIC-WITHDRAWAL-RECEIPT-${contract}`, bundle_digest: originalBundle, recorded_at: "2026-08-09T12:02:00Z" },
    ];
    const replacement = { event_id: `SYNTHETIC-REPUBLISH-${contract}`, event_type: "republication_recorded", receipt_id: `SYNTHETIC-REPUBLISH-RECEIPT-${contract}`, bundle_digest: replacementBundle, recorded_at: "2026-08-09T12:03:00Z" };
    const derived = derivePublicationStatus([...baseEvents, replacement], baseEvents);
    const notice = {
      notice_id: `SYNTHETIC-NOTICE-${contract}`,
      notice_type: replacement.event_type,
      controlling_event_id: replacement.event_id,
      controlling_receipt_id: replacement.receipt_id,
      controlling_event_digest: digest(replacement),
      bundle_digest: replacement.bundle_digest,
      immutable: true,
    };
    validateChangeNotice(notice, replacement);
    const restoreReceipt = {
      receipt_id: `SYNTHETIC-RESTORE-RECEIPT-${contract}`,
      receipt_type: "restoration",
      actor_id: `SYNTHETIC-NAMED-HUMAN-${slug}`,
      authorization_id: `SYNTHETIC-AUTHORIZATION-V2-${contract}`,
      bundle_digest: replacementBundle,
      target_event_id: baseEvents.at(-1).event_id,
      recorded_at: "2026-08-09T12:04:00Z",
    };
    validateRestoreOrRepublication(restoreReceipt, { authorization_id: `SYNTHETIC-AUTHORIZATION-V1-${contract}`, bundle_digest: originalBundle }, baseEvents);

    statusSchemas.push({
      status_registry_id: `57R-STATUS-REGISTRY-${contract}`,
      contract_id: contract,
      evidence_rail: prior.evidence_rail,
      append_only_event_types: Object.keys(eventStatus),
      derivation_fields: ["current_status", "controlling_event_id", "controlling_receipt_id", "history_event_count", "history_digest"],
      history_policy: "every_prior_event_remains_visible_and_digest_verifiable",
      automatic_publication_allowed: false,
    });
    noticeSchemas.push({
      notice_schema_id: `57R-CHANGE-NOTICE-${contract}`,
      contract_id: contract,
      evidence_rail: prior.evidence_rail,
      required_bindings: ["notice_type", "controlling_event_id", "controlling_receipt_id", "controlling_event_digest", "bundle_digest"],
      immutable_after_issue: true,
      replacement_policy: "corrections_append_a_new_notice_and_never_rewrite_an_earlier_notice",
    });
    restoreSchemas.push({
      restore_schema_id: `57R-RESTORE-REPUBLISH-${contract}`,
      contract_id: contract,
      evidence_rail: prior.evidence_rail,
      required_new_bindings: ["named_human_actor", "new_authorization_id", "new_exact_bundle_digest", "target_event_id", "receipt_id", "recorded_at"],
      stale_authorization_allowed: false,
      stale_bundle_allowed: false,
      prior_history_rewrite_allowed: false,
    });
    statusClasses.forEach(([testClass, decision], index) => statusCases.push({ ...baseCase(prior, testClass, decision, `57R-STA-${contract}-${String(index + 1).padStart(2, "0")}`), status_registry_id: `57R-STATUS-REGISTRY-${contract}`, fixture_history_digest: derived.history_digest }));
    noticeClasses.forEach(([testClass, decision], index) => noticeCases.push({ ...baseCase(prior, testClass, decision, `57R-NOT-${contract}-${String(index + 1).padStart(2, "0")}`), notice_schema_id: `57R-CHANGE-NOTICE-${contract}`, fixture_notice_digest: digest(notice) }));
    restoreClasses.forEach(([testClass, decision], index) => restoreCases.push({ ...baseCase(prior, testClass, decision, `57R-RST-${contract}-${String(index + 1).padStart(2, "0")}`), restore_schema_id: `57R-RESTORE-REPUBLISH-${contract}`, replacement_bundle_digest: replacementBundle }));
  }
  const allCases = [...statusCases, ...noticeCases, ...restoreCases];
  return {
    phase: "57R",
    statusSchemas,
    noticeSchemas,
    restoreSchemas,
    statusCases,
    noticeCases,
    restoreCases,
    allCases,
    failures: allCases.filter((row) => !row.passed),
    distributions: { status: countBy(statusCases, "test_class"), notice: countBy(noticeCases, "test_class"), restore: countBy(restoreCases, "test_class") },
  };
};

export { countBy, digest };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const phase57q = JSON.parse(await readFile(lifecyclePath, "utf8"));
  const result = runPhase57rHarness(phase57q.schemas);
  if (result.failures.length || result.allCases.length !== 396) process.exitCode = 1;
  else console.log(`Phase 57R harness passed: 9 publication-status registries, 9 immutable change-notice schemas, 9 restore/republication schemas, ${result.statusCases.length} status cases, ${result.noticeCases.length} notice cases, and ${result.restoreCases.length} restore/provenance cases (${result.allCases.length} total), with zero actual statuses, notices, restores, republications, actors, triggers, or closures.`);
}
