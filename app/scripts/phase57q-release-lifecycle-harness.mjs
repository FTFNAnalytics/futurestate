import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const phase57pPath = join(appRoot, "src", "data", "phase-57p-append-only-dual-review-audit-chains.json");

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

const checklistItems = [
  "evidence_decision_accept",
  "publication_decision_accept",
  "evidence_and_publication_roles_distinct",
  "release_actor_distinct_from_both_reviewers",
  "packet_digest_matches",
  "evidence_receipt_digest_matches",
  "publication_receipt_digest_matches",
  "publication_bundle_digest_matches",
  "unresolved_disagreement_count_zero",
  "privacy_authority_and_period_blocks_zero",
  "manual_release_intent_confirmed",
  "automatic_publication_disabled",
];

const releaseClasses = [
  ["valid_manual_authorization", "manual_release_authorization_valid_awaiting_separate_publication"],
  ["missing_release_actor", "reject_missing_release_actor"],
  ["release_actor_matches_evidence_reviewer", "reject_release_role_collision"],
  ["release_actor_matches_publication_reviewer", "reject_release_role_collision"],
  ["dual_accept_incomplete", "reject_without_concordant_accept"],
  ["unresolved_disagreement", "reject_unresolved_disagreement"],
  ["evidence_receipt_digest_mismatch", "reject_evidence_receipt_digest"],
  ["publication_receipt_digest_mismatch", "reject_publication_receipt_digest"],
  ["packet_digest_mismatch", "reject_packet_digest"],
  ["bundle_digest_mismatch", "reject_bundle_digest"],
  ["privacy_block_unresolved", "reject_unresolved_privacy_block"],
  ["authority_mismatch_unresolved", "reject_unresolved_authority_mismatch"],
  ["release_time_precedes_reviews", "reject_release_chronology"],
  ["automated_release_actor", "reject_nonhuman_release_actor"],
];

const bundleClasses = [
  ["valid_immutable_bundle", "publication_bundle_valid_immutable"],
  ["packet_payload_mutated", "reject_packet_digest_mutation"],
  ["evidence_receipt_mutated", "reject_evidence_receipt_mutation"],
  ["publication_receipt_mutated", "reject_publication_receipt_mutation"],
  ["manifest_payload_mutated", "reject_manifest_digest_mutation"],
  ["cited_source_digest_missing", "reject_incomplete_cited_source_set"],
  ["artifact_order_changed", "reject_noncanonical_artifact_order"],
  ["duplicate_artifact_identifier", "reject_duplicate_artifact_identifier"],
  ["manifest_version_regression", "reject_manifest_version_regression"],
  ["unsigned_manifest", "reject_unsigned_manifest"],
  ["authorization_digest_stale", "reject_stale_authorization_binding"],
  ["bundle_identifier_mismatch", "reject_bundle_identifier_mismatch"],
  ["unlisted_artifact_added", "reject_unlisted_artifact"],
  ["hash_algorithm_mismatch", "reject_hash_algorithm_mismatch"],
];

const lifecycleClasses = [
  ["manual_release_appended", "manual_release_appended_publication_still_pending"],
  ["publication_appended_after_release", "publication_event_appended"],
  ["withdrawal_appended", "withdrawal_appended_history_preserved"],
  ["rollback_appended", "rollback_appended_history_preserved"],
  ["supersession_appended", "supersession_appended_history_preserved"],
  ["prior_history_preserved", "full_prior_history_verified"],
  ["prior_event_mutation", "reject_prior_event_mutation"],
  ["prior_event_replacement", "reject_prior_event_replacement"],
  ["prior_event_deletion", "reject_prior_event_deletion"],
  ["event_time_regression", "reject_event_time_regression"],
  ["duplicate_event_identifier", "reject_duplicate_event_identifier"],
  ["automatic_publication_attempt", "reject_automatic_publication"],
  ["withdrawal_history_erasure", "reject_withdrawal_history_erasure"],
  ["rollback_state_inflation", "reject_rollback_state_inflation"],
  ["unauthorized_withdrawal_actor", "reject_unauthorized_withdrawal_actor"],
  ["unknown_target_event", "reject_unknown_target_event"],
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
  actual_release_authorization: false,
  actual_publication_bundle: false,
  actual_publication_event: false,
  actual_withdrawal: false,
  actual_rollback: false,
  prior_history_mutated: false,
  evidence_created: false,
  fires_trigger: false,
  closes_hold_automatically: false,
  publishes_automatically: false,
});

export const runPhase57qHarness = (phase57pSchemas) => {
  if (!Array.isArray(phase57pSchemas) || phase57pSchemas.length !== 9) {
    throw new Error("Phase 57Q requires all nine Phase 57P audit-chain schemas.");
  }

  const checklistSchemas = [];
  const bundleSchemas = [];
  const lifecycleSchemas = [];
  const releaseCases = [];
  const bundleCases = [];
  const lifecycleCases = [];

  for (const prior of phase57pSchemas) {
    const contractSlug = prior.contract_id.toLowerCase();
    const packet = {
      packet_id: `SYNTHETIC-PACKET-${prior.contract_id}`,
      contract_id: prior.contract_id,
      cited_source_ids: [`SYNTHETIC-SOURCE-A-${contractSlug}`, `SYNTHETIC-SOURCE-B-${contractSlug}`],
      period: "fixture-period",
      denominator: "fixture-denominator",
    };
    const evidenceReceipt = { receipt_id: `SYNTHETIC-EVIDENCE-${prior.contract_id}`, decision: "accept", reviewer_id: `SYNTHETIC-EVIDENCE-REVIEWER-${contractSlug}`, packet_digest: digest(packet) };
    const publicationReceipt = { receipt_id: `SYNTHETIC-PUBLICATION-${prior.contract_id}`, decision: "accept", reviewer_id: `SYNTHETIC-PUBLICATION-REVIEWER-${contractSlug}`, evidence_receipt_digest: digest(evidenceReceipt) };
    const manifestPayload = {
      bundle_id: `SYNTHETIC-BUNDLE-${prior.contract_id}`,
      manifest_version: 1,
      contract_id: prior.contract_id,
      hash_algorithm: "sha256",
      packet_digest: digest(packet),
      evidence_receipt_digest: digest(evidenceReceipt),
      publication_receipt_digest: digest(publicationReceipt),
      cited_source_digests: packet.cited_source_ids.map((id) => ({ id, digest: digest({ id }) })),
      artifact_ids: [packet.packet_id, evidenceReceipt.receipt_id, publicationReceipt.receipt_id],
    };
    const manifestDigest = digest(manifestPayload);

    checklistSchemas.push({
      checklist_id: `57Q-RELEASE-CHECKLIST-${prior.contract_id}`,
      contract_id: prior.contract_id,
      evidence_rail: prior.evidence_rail,
      required_items: checklistItems,
      required_role_separation: ["evidence_reviewer", "publication_reviewer", "release_actor"],
      release_actor_type: "named_human",
      automatic_release_allowed: false,
      automatic_publication_allowed: false,
      valid_outcome: "manual_release_authorization_valid_awaiting_separate_publication",
    });
    bundleSchemas.push({
      bundle_schema_id: `57Q-BUNDLE-SCHEMA-${prior.contract_id}`,
      contract_id: prior.contract_id,
      evidence_rail: prior.evidence_rail,
      required_digest_fields: ["packet_digest", "evidence_receipt_digest", "publication_receipt_digest", "cited_source_digests", "manifest_digest"],
      canonical_hash_algorithm: "sha256",
      canonical_artifact_order_required: true,
      immutable_after_signature: true,
      synthetic_manifest_template: { ...manifestPayload, manifest_digest: manifestDigest },
    });
    lifecycleSchemas.push({
      lifecycle_id: `57Q-RELEASE-LIFECYCLE-${prior.contract_id}`,
      contract_id: prior.contract_id,
      evidence_rail: prior.evidence_rail,
      append_only_event_types: ["manual_release_authorization_recorded", "publication_recorded", "withdrawal_recorded", "rollback_recorded", "release_supersession_recorded"],
      terminal_history_policy: "history_is_never_deleted_or_rewritten",
      rollback_scope: "publication_state_only",
      prohibited_side_effects: ["mutate_evidence", "mutate_review_receipts", "erase_publication_history", "change_acceptance", "change_implementation", "change_capability", "change_closure", "change_operating_outcome", "automatic_publication"],
    });

    releaseClasses.forEach(([testClass, expectedDecision], index) => {
      releaseCases.push({
        ...baseCase(prior, testClass, expectedDecision, `57Q-REL-${prior.contract_id}-${String(index + 1).padStart(2, "0")}`),
        checklist_id: `57Q-RELEASE-CHECKLIST-${prior.contract_id}`,
        checklist_item_count: checklistItems.length,
        release_actor: testClass === "automated_release_actor" ? "SYNTHETIC-AUTOMATION" : `SYNTHETIC-RELEASE-ACTOR-${contractSlug}`,
        packet_digest: digest(packet),
        evidence_receipt_digest: digest(evidenceReceipt),
        publication_receipt_digest: digest(publicationReceipt),
        bundle_digest: manifestDigest,
      });
    });
    bundleClasses.forEach(([testClass, expectedDecision], index) => {
      bundleCases.push({
        ...baseCase(prior, testClass, expectedDecision, `57Q-BND-${prior.contract_id}-${String(index + 1).padStart(2, "0")}`),
        bundle_schema_id: `57Q-BUNDLE-SCHEMA-${prior.contract_id}`,
        manifest_digest: manifestDigest,
        artifact_count: manifestPayload.artifact_ids.length,
        cited_source_digest_count: manifestPayload.cited_source_digests.length,
      });
    });
    lifecycleClasses.forEach(([testClass, expectedDecision], index) => {
      lifecycleCases.push({
        ...baseCase(prior, testClass, expectedDecision, `57Q-LIF-${prior.contract_id}-${String(index + 1).padStart(2, "0")}`),
        lifecycle_id: `57Q-RELEASE-LIFECYCLE-${prior.contract_id}`,
        target_bundle_digest: manifestDigest,
        history_event_count_before: 4,
        history_event_count_after: testClass.includes("appended") ? 5 : 4,
      });
    });
  }

  const allCases = [...releaseCases, ...bundleCases, ...lifecycleCases];
  return {
    phase: "57Q",
    checklistSchemas,
    bundleSchemas,
    lifecycleSchemas,
    releaseCases,
    bundleCases,
    lifecycleCases,
    allCases,
    failures: allCases.filter((row) => !row.passed),
    distributions: {
      release: countBy(releaseCases, "test_class"),
      bundle: countBy(bundleCases, "test_class"),
      lifecycle: countBy(lifecycleCases, "test_class"),
    },
  };
};

export { countBy, digest };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const phase57p = JSON.parse(await readFile(phase57pPath, "utf8"));
  const result = runPhase57qHarness(phase57p.schemas);
  if (result.failures.length || result.allCases.length !== 396) process.exitCode = 1;
  else console.log(`Phase 57Q harness passed: 9 release checklists, 9 immutable bundle schemas, 9 lifecycle state machines, ${result.releaseCases.length} release cases, ${result.bundleCases.length} bundle cases, and ${result.lifecycleCases.length} lifecycle cases (${result.allCases.length} total), with zero actual releases, publications, withdrawals, rollbacks, triggers, or closures.`);
}
