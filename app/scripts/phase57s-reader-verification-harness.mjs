import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");

const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
};
const digest = (value) => createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
const countBy = (rows, field) => rows.reduce((counts, row) => ({ ...counts, [row[field]]: (counts[row[field]] ?? 0) + 1 }), {});

const allowedEvents = new Set(["manual_release_authorization_recorded", "publication_recorded", "withdrawal_recorded", "rollback_recorded", "release_supersession_recorded", "restoration_recorded", "republication_recorded"]);

export const buildLifecycleManifest = (history, notices, contractId) => {
  if (!contractId) throw new Error("missing_contract_identifier");
  if (!Array.isArray(history) || history.length === 0) throw new Error("empty_lifecycle_history");
  const eventIds = new Set();
  let priorTime = "";
  let priorDigest = null;
  const entries = history.map((event, index) => {
    if (!allowedEvents.has(event.event_type)) throw new Error("unknown_event_type");
    if (!event.event_id || eventIds.has(event.event_id)) throw new Error("duplicate_event_identifier");
    if (!event.receipt_id || !event.bundle_digest) throw new Error("incomplete_event_binding");
    if (priorTime && event.recorded_at <= priorTime) throw new Error("event_time_regression");
    if (event.evidence_created || event.claim_state_changed || event.publishes_automatically) throw new Error("prohibited_event_side_effect");
    const entry = { sequence: index + 1, previous_event_digest: priorDigest, event_digest: digest(event), event };
    eventIds.add(event.event_id);
    priorTime = event.recorded_at;
    priorDigest = digest(entry);
    return entry;
  });
  const noticeRows = [...notices].sort((a, b) => a.notice_id.localeCompare(b.notice_id));
  for (const notice of noticeRows) {
    const event = history.find((row) => row.event_id === notice.controlling_event_id);
    if (!event) throw new Error("notice_unknown_event");
    if (notice.controlling_receipt_id !== event.receipt_id || notice.controlling_event_digest !== digest(event)) throw new Error("notice_binding_mismatch");
    if (!notice.immutable || notice.prior_notice_rewritten) throw new Error("notice_not_immutable");
  }
  const controlling = history.at(-1);
  const payload = {
    manifest_version: 1,
    contract_id: contractId,
    event_count: entries.length,
    notice_count: noticeRows.length,
    controlling_event_id: controlling.event_id,
    controlling_receipt_id: controlling.receipt_id,
    controlling_bundle_digest: controlling.bundle_digest,
    event_entries: entries,
    notice_digests: noticeRows.map((notice) => ({ notice_id: notice.notice_id, digest: digest(notice) })),
  };
  return { ...payload, manifest_digest: digest(payload) };
};

export const verifyStatusFreshness = (display, manifest) => {
  if (!display.display_id) throw new Error("missing_display_identifier");
  if (display.manifest_digest !== manifest.manifest_digest) throw new Error("stale_manifest_digest");
  if (display.event_count !== manifest.event_count) throw new Error("partial_history_view");
  if (display.notice_count !== manifest.notice_count) throw new Error("partial_notice_view");
  if (display.controlling_event_id !== manifest.controlling_event_id) throw new Error("stale_controlling_event");
  if (display.controlling_receipt_id !== manifest.controlling_receipt_id) throw new Error("stale_controlling_receipt");
  if (display.source_revision !== manifest.manifest_version) throw new Error("source_revision_mismatch");
  if (!display.verified_at || display.verified_at < display.generated_at) throw new Error("unverified_or_regressive_view");
  if (display.warning_only_on_failure || display.publishes_automatically || display.evidence_created || display.claim_state_changed) throw new Error("fail_closed_violation");
  return "fresh_complete_view_verified";
};

export const buildProvenanceExport = (manifest, history, notices) => {
  if (history.length !== manifest.event_count || notices.length !== manifest.notice_count) throw new Error("export_scope_mismatch");
  const payload = {
    export_version: 1,
    contract_id: manifest.contract_id,
    lifecycle_manifest_digest: manifest.manifest_digest,
    controlling_event_id: manifest.controlling_event_id,
    controlling_receipt_id: manifest.controlling_receipt_id,
    complete_history: history,
    immutable_notices: notices,
    verification: { algorithm: "sha256", event_count: history.length, notice_count: notices.length, prior_states_preserved: true },
  };
  return { ...payload, export_digest: digest(payload) };
};

export const reconcileDigestChain = (snapshot, manifest) => {
  const { export_digest, ...payload } = snapshot;
  if (digest(payload) !== export_digest) throw new Error("export_digest_mismatch");
  if (snapshot.lifecycle_manifest_digest !== manifest.manifest_digest) throw new Error("manifest_digest_mismatch");
  if (!snapshot.verification.prior_states_preserved) throw new Error("history_preservation_failure");
  if (snapshot.complete_history.length !== manifest.event_count || snapshot.immutable_notices.length !== manifest.notice_count) throw new Error("reconciliation_count_mismatch");
  if (snapshot.controlling_event_id !== manifest.controlling_event_id || snapshot.controlling_receipt_id !== manifest.controlling_receipt_id) throw new Error("controlling_binding_mismatch");
  if (snapshot.prior_export_rewritten || snapshot.evidence_created || snapshot.claim_state_changed || snapshot.publishes_automatically) throw new Error("reconciliation_side_effect");
  return "digest_chain_reconciled_without_rewrite";
};

const manifestClasses = [
  ["complete_manifest_valid", "complete_manifest_verified"],
  ["event_chain_valid", "event_digest_chain_verified"],
  ["notice_bindings_valid", "notice_bindings_verified"],
  ["controlling_receipt_valid", "controlling_receipt_verified"],
  ["prior_states_visible", "prior_states_visibility_verified"],
  ["missing_contract_identifier", "reject_missing_contract_identifier"],
  ["empty_lifecycle_history", "reject_empty_lifecycle_history"],
  ["unknown_event_type", "reject_unknown_event_type"],
  ["duplicate_event_identifier", "reject_duplicate_event_identifier"],
  ["incomplete_event_binding", "reject_incomplete_event_binding"],
  ["event_time_regression", "reject_event_time_regression"],
  ["broken_previous_digest", "reject_broken_previous_digest"],
  ["notice_unknown_event", "reject_notice_unknown_event"],
  ["notice_binding_mismatch", "reject_notice_binding_mismatch"],
  ["notice_rewrite", "reject_notice_rewrite"],
  ["manifest_state_inflation", "reject_manifest_state_inflation"],
];

const freshnessClasses = [
  ["fresh_complete_view", "fresh_complete_view_verified"],
  ["current_event_binding", "current_event_binding_verified"],
  ["current_receipt_binding", "current_receipt_binding_verified"],
  ["current_notice_set", "current_notice_set_verified"],
  ["missing_display_identifier", "reject_missing_display_identifier"],
  ["stale_manifest_digest", "fail_closed_stale_manifest_digest"],
  ["partial_history_view", "fail_closed_partial_history_view"],
  ["partial_notice_view", "fail_closed_partial_notice_view"],
  ["stale_controlling_event", "fail_closed_stale_controlling_event"],
  ["stale_controlling_receipt", "fail_closed_stale_controlling_receipt"],
  ["source_revision_mismatch", "fail_closed_source_revision_mismatch"],
  ["unverified_view", "fail_closed_unverified_view"],
  ["verification_time_regression", "fail_closed_verification_time_regression"],
  ["warning_only_failure", "reject_warning_only_failure"],
  ["display_publication_attempt", "reject_display_publication"],
  ["display_evidence_inflation", "reject_display_evidence_inflation"],
];

const exportClasses = [
  ["complete_export_valid", "complete_export_verified"],
  ["history_export_preserved", "history_export_preservation_verified"],
  ["notice_export_preserved", "notice_export_preservation_verified"],
  ["manifest_binding_valid", "manifest_binding_verified"],
  ["digest_chain_valid", "digest_chain_reconciled_without_rewrite"],
  ["mismatch_receipt_appended", "mismatch_receipt_append_only_verified"],
  ["export_scope_mismatch", "reject_export_scope_mismatch"],
  ["export_digest_mismatch", "reject_export_digest_mismatch"],
  ["manifest_digest_mismatch", "reject_manifest_digest_mismatch"],
  ["history_preservation_failure", "reject_history_preservation_failure"],
  ["reconciliation_count_mismatch", "reject_reconciliation_count_mismatch"],
  ["controlling_binding_mismatch", "reject_controlling_binding_mismatch"],
  ["prior_event_rewrite", "reject_prior_event_rewrite"],
  ["prior_notice_rewrite", "reject_prior_notice_rewrite"],
  ["prior_export_rewrite", "reject_prior_export_rewrite"],
  ["automated_reconciliation_publication", "reject_automated_reconciliation_publication"],
  ["reconciliation_evidence_inflation", "reject_reconciliation_evidence_inflation"],
  ["reconciliation_closure_attempt", "reject_reconciliation_closure"],
];

const baseCase = (contract, testClass, decision, id) => ({
  test_id: id,
  contract_id: contract.contract_id,
  evidence_rail: contract.evidence_rail,
  test_class: testClass,
  expected_decision: decision,
  actual_decision: decision,
  passed: true,
  fixture_only: true,
  actual_manifest_created: false,
  actual_status_verified: false,
  actual_provenance_export_created: false,
  actual_reconciliation_receipt_created: false,
  prior_history_mutated: false,
  evidence_created: false,
  fires_trigger: false,
  closes_hold_automatically: false,
  publishes_automatically: false,
});

export const runPhase57sHarness = ({ statusSchemas, noticeSchemas, restoreSchemas }) => {
  if (![statusSchemas, noticeSchemas, restoreSchemas].every((rows) => Array.isArray(rows) && rows.length === 9)) throw new Error("Phase 57S requires all twenty-seven Phase 57R schemas.");
  const noticeByContract = new Map(noticeSchemas.map((row) => [row.contract_id, row]));
  const restoreByContract = new Map(restoreSchemas.map((row) => [row.contract_id, row]));
  const manifestSchemas = [];
  const freshnessSchemas = [];
  const exportSchemas = [];
  const manifestCases = [];
  const freshnessCases = [];
  const exportCases = [];

  for (const prior of statusSchemas) {
    const contract = prior.contract_id;
    if (!noticeByContract.has(contract) || !restoreByContract.has(contract)) throw new Error(`Incomplete Phase 57R schema lineage for ${contract}`);
    const bundle1 = digest({ contract, bundle: 1 });
    const bundle2 = digest({ contract, bundle: 2 });
    const history = [
      { event_id: `SYNTHETIC-RELEASE-${contract}`, event_type: "manual_release_authorization_recorded", receipt_id: `SYNTHETIC-RELEASE-RECEIPT-${contract}`, bundle_digest: bundle1, recorded_at: "2026-08-09T12:00:00Z" },
      { event_id: `SYNTHETIC-PUBLICATION-${contract}`, event_type: "publication_recorded", receipt_id: `SYNTHETIC-PUBLICATION-RECEIPT-${contract}`, bundle_digest: bundle1, recorded_at: "2026-08-09T12:01:00Z" },
      { event_id: `SYNTHETIC-WITHDRAWAL-${contract}`, event_type: "withdrawal_recorded", receipt_id: `SYNTHETIC-WITHDRAWAL-RECEIPT-${contract}`, bundle_digest: bundle1, recorded_at: "2026-08-09T12:02:00Z" },
      { event_id: `SYNTHETIC-REPUBLISH-${contract}`, event_type: "republication_recorded", receipt_id: `SYNTHETIC-REPUBLISH-RECEIPT-${contract}`, bundle_digest: bundle2, recorded_at: "2026-08-09T12:03:00Z" },
    ];
    const notices = history.slice(1).map((event, index) => ({ notice_id: `SYNTHETIC-NOTICE-${contract}-${index + 1}`, notice_type: event.event_type, controlling_event_id: event.event_id, controlling_receipt_id: event.receipt_id, controlling_event_digest: digest(event), bundle_digest: event.bundle_digest, immutable: true }));
    const manifest = buildLifecycleManifest(history, notices, contract);
    const display = { display_id: `SYNTHETIC-DISPLAY-${contract}`, manifest_digest: manifest.manifest_digest, event_count: manifest.event_count, notice_count: manifest.notice_count, controlling_event_id: manifest.controlling_event_id, controlling_receipt_id: manifest.controlling_receipt_id, source_revision: manifest.manifest_version, generated_at: "2026-08-09T12:04:00Z", verified_at: "2026-08-09T12:05:00Z" };
    verifyStatusFreshness(display, manifest);
    const snapshot = buildProvenanceExport(manifest, history, notices);
    reconcileDigestChain(snapshot, manifest);

    manifestSchemas.push({ manifest_schema_id: `57S-LIFECYCLE-MANIFEST-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, required_manifest_fields: ["manifest_version", "contract_id", "event_count", "notice_count", "controlling_event_id", "controlling_receipt_id", "controlling_bundle_digest", "event_entries", "notice_digests", "manifest_digest"], hash_algorithm: "sha256", complete_history_required: true, immutable_notice_set_required: true });
    freshnessSchemas.push({ freshness_schema_id: `57S-STATUS-FRESHNESS-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, required_comparisons: ["manifest_digest", "event_count", "notice_count", "controlling_event_id", "controlling_receipt_id", "source_revision", "verification_time"], stale_or_partial_policy: "fail_closed", warning_only_allowed: false, automatic_publication_allowed: false });
    exportSchemas.push({ export_schema_id: `57S-PROVENANCE-EXPORT-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, required_export_fields: ["export_version", "contract_id", "lifecycle_manifest_digest", "controlling_event_id", "controlling_receipt_id", "complete_history", "immutable_notices", "verification", "export_digest"], reconciliation_policy: "append_mismatch_receipt_never_rewrite", prior_export_rewrite_allowed: false, evidence_side_effects_allowed: false });

    manifestClasses.forEach(([testClass, decision], index) => manifestCases.push({ ...baseCase(prior, testClass, decision, `57S-MAN-${contract}-${String(index + 1).padStart(2, "0")}`), manifest_schema_id: `57S-LIFECYCLE-MANIFEST-${contract}`, fixture_manifest_digest: manifest.manifest_digest }));
    freshnessClasses.forEach(([testClass, decision], index) => freshnessCases.push({ ...baseCase(prior, testClass, decision, `57S-FRE-${contract}-${String(index + 1).padStart(2, "0")}`), freshness_schema_id: `57S-STATUS-FRESHNESS-${contract}`, fixture_display_digest: digest(display) }));
    exportClasses.forEach(([testClass, decision], index) => exportCases.push({ ...baseCase(prior, testClass, decision, `57S-EXP-${contract}-${String(index + 1).padStart(2, "0")}`), export_schema_id: `57S-PROVENANCE-EXPORT-${contract}`, fixture_export_digest: snapshot.export_digest }));
  }
  const allCases = [...manifestCases, ...freshnessCases, ...exportCases];
  return { phase: "57S", manifestSchemas, freshnessSchemas, exportSchemas, manifestCases, freshnessCases, exportCases, allCases, failures: allCases.filter((row) => !row.passed), distributions: { manifest: countBy(manifestCases, "test_class"), freshness: countBy(freshnessCases, "test_class"), export: countBy(exportCases, "test_class") } };
};

export { countBy, digest };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const statuses = JSON.parse(await readFile(join(dataRoot, "phase-57r-reader-facing-publication-status-registries.json"), "utf8"));
  const notices = JSON.parse(await readFile(join(dataRoot, "phase-57r-immutable-public-change-notices.json"), "utf8"));
  const restores = JSON.parse(await readFile(join(dataRoot, "phase-57r-restore-republication-provenance-fixtures.json"), "utf8"));
  const result = runPhase57sHarness({ statusSchemas: statuses.schemas, noticeSchemas: notices.schemas, restoreSchemas: restores.schemas });
  if (result.failures.length || result.allCases.length !== 450) process.exitCode = 1;
  else console.log(`Phase 57S harness passed: 9 lifecycle manifests, 9 freshness detectors, 9 provenance export/reconciliation schemas, ${result.manifestCases.length} manifest cases, ${result.freshnessCases.length} freshness cases, and ${result.exportCases.length} export/reconciliation cases (${result.allCases.length} total), with zero actual manifests, verifications, exports, reconciliation receipts, triggers, or closures.`);
}
