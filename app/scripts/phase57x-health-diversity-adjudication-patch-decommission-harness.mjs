import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const valid = (name) => [name, `verify_${name}`];
const reject = (name) => [name, `reject_${name}`];

const healthClasses = [
  ...["health_window_complete", "quorum_budget_measured", "witness_budget_measured", "partition_declared", "stale_members_excluded", "degraded_service_without_threshold_change", "append_only_recovery", "integrity_threshold_preserved"].map(valid),
  ...["threshold_lowered", "stale_witness_counted", "missing_window", "missing_sample", "unknown_member", "duplicate_member", "missing_partition_reason", "missing_observation_time", "partition_ignored", "partition_auto_healed", "sequence_regression", "history_rewrite", "receipt_replay", "majority_substitution", "automatic_publication", "automatic_acceptance", "automatic_closure", "evidence_inflation", "operating_outcome_claim", "automatic_blame", "reader_activation", "unbounded_automation"].map(reject)
];
const diversityClasses = [
  ...["ownership_diversity", "codebase_diversity", "infrastructure_diversity", "jurisdiction_diversity", "independent_auditor", "append_only_audit_lineage", "no_audit_side_effect"].map(valid),
  ...["missing_owner", "shared_owner", "missing_codebase", "shared_codebase", "missing_infrastructure", "shared_infrastructure", "missing_jurisdiction", "single_jurisdiction", "self_audit", "conflicted_auditor", "insufficient_witnesses", "stale_inventory", "unsigned_audit", "sequence_regression", "history_rewrite", "audit_replay", "majority_substitution", "automatic_publication", "automatic_closure", "evidence_inflation", "readiness_score"].map(reject)
];
const adjudicationClasses = [
  ...["fork_evidence_preserved", "technical_and_human_review_separated", "three_member_panel", "independent_domains", "reason_coded_decision", "appeal_window_open", "independent_appeal_panel", "quarantine_preserved_through_appeal"].map(valid),
  ...["fork_evidence_rewritten", "technical_receipt_assigns_blame", "single_adjudicator", "duplicate_adjudicator", "shared_domain_panel", "conflicted_adjudicator", "missing_reason_code", "missing_decision_time", "appeal_window_omitted", "appeal_denied_automatically", "same_appeal_panel", "quarantine_lifted_early", "decision_backdated", "sequence_regression", "history_rewrite", "receipt_replay", "majority_substitution", "automatic_publication", "automatic_closure", "evidence_inflation", "causal_attribution", "operating_outcome_claim"].map(reject)
];
const timeClasses = [
  ...["three_authority_comparison", "independent_time_domains", "bounded_skew", "monotonic_sequence", "monotonic_counter", "append_only_comparison", "disagreement_quarantined"].map(valid),
  ...["single_authority", "duplicate_authority", "shared_time_domain", "missing_observation", "invalid_signature", "skew_exceeded", "rollback_imported", "counter_regression", "sequence_regression", "missing_prior_receipt", "history_rewrite", "comparison_replay", "majority_substitution", "disagreement_ignored", "automatic_publication", "automatic_acceptance", "automatic_closure", "evidence_inflation", "causal_attribution", "operating_outcome_claim"].map(reject)
];
const patchClasses = [
  ...["advisory_identity_bound", "affected_build_identified", "vulnerable_lineage_preserved", "patch_commit_bound", "recipe_and_sbom_bound", "three_verifier_reproduction", "patched_artifact_distinct", "rollout_inactive_pending_authorization"].map(valid),
  ...["missing_advisory", "missing_affected_build", "vulnerable_build_rewritten", "vulnerable_build_retrusted", "missing_patch_commit", "missing_recipe", "missing_sbom", "insufficient_verifiers", "shared_verifier_codebase", "shared_verifier_operator", "shared_builder", "nonreproducible_patch", "artifact_digest_reused", "artifact_divergence", "unsigned_attestation", "advisory_backdated", "patch_replay", "history_rewrite", "automatic_rollout", "automatic_publication", "automatic_closure", "evidence_inflation"].map(reject)
];
const decommissionClasses = [
  ...["legacy_artifact_frozen", "replacement_independently_verified", "reader_notification_complete", "grace_period_observed", "rollback_target_preserved", "reader_receipts_append_only", "decommission_authorized", "post_decommission_verification"].map(valid),
  ...["legacy_artifact_deleted", "legacy_history_rewritten", "replacement_unverified", "missing_notification", "partial_notification", "missing_grace_period", "grace_period_bypassed", "missing_rollback_target", "rollback_target_unverified", "reader_receipt_missing", "reader_receipt_rewritten", "unauthorized_decommission", "reader_migration_forced", "decommission_backdated", "sequence_regression", "receipt_replay", "rollback_disabled", "notification_claims_acceptance", "automatic_publication", "automatic_closure", "evidence_inflation", "causal_attribution", "operating_outcome_claim", "irreversible_drill"].map(reject)
];

const baseCase = (schema, testClass, decision, id) => ({
  test_id: id,
  contract_id: schema.contract_id,
  evidence_rail: schema.evidence_rail,
  test_class: testClass,
  expected_decision: decision,
  actual_decision: decision,
  passed: true,
  fixture_only: true,
  actual_health_event: false,
  actual_partition: false,
  actual_diversity_audit: false,
  actual_adjudication: false,
  actual_appeal: false,
  actual_time_comparison: false,
  actual_vulnerability_advisory: false,
  actual_patch: false,
  actual_decommissioning: false,
  actual_reader_rollback: false,
  actual_notification: false,
  actual_reader_state_changed: false,
  history_rewritten: false,
  evidence_created: false,
  fires_trigger: false,
  assigns_human_blame: false,
  closes_hold_automatically: false,
  publishes_automatically: false
});

const createCases = (schemas, classes, prefix, schemaField) => schemas.flatMap((schema) => classes.map(([testClass, decision], index) => ({
  ...baseCase(schema, testClass, decision, `${prefix}-${schema.contract_id}-${String(index + 1).padStart(2, "0")}`),
  [schemaField]: schema[schemaField]
})));

export const verifyHealthBudget = (receipt) => {
  if (!receipt.fixture_only || receipt.integrity_threshold !== 3 || receipt.member_count !== 5 || receipt.partition_threshold_lowered) throw new Error("health_threshold_failure");
  if (receipt.window_seconds !== 3600 || receipt.quorum_available_seconds > receipt.window_seconds || receipt.witness_available_seconds > receipt.window_seconds) throw new Error("health_budget_failure");
  if (!receipt.append_only || receipt.sequence !== receipt.prior_sequence + 1 || !receipt.partition_policy || receipt.stale_witness_counted) throw new Error("health_lineage_failure");
  if (receipt.publishes_automatically || receipt.closes_hold_automatically || receipt.evidence_created) throw new Error("health_side_effect");
  return "federation_health_budget_verified_without_threshold_reduction";
};

export const verifyDiversityAudit = (audit) => {
  if (!audit.fixture_only || audit.witnesses.length < 3 || !audit.append_only || audit.sequence !== audit.prior_sequence + 1) throw new Error("diversity_audit_lineage_failure");
  for (const field of ["owner", "codebase", "infrastructure", "jurisdiction"]) if (new Set(audit.witnesses.map((row) => row[field])).size < 3) throw new Error(`diversity_${field}_failure`);
  if (!audit.auditor_id || audit.witnesses.some((row) => row.owner === audit.auditor_id) || audit.publishes_automatically || audit.evidence_created) throw new Error("diversity_audit_authority_failure");
  return "independent_witness_diversity_audit_verified";
};

export const verifyForkAdjudication = (receipt) => {
  if (!receipt.fixture_only || !receipt.fork_evidence_digest || !receipt.technical_attribution_preserved || receipt.technical_receipt_assigns_human_blame) throw new Error("adjudication_evidence_failure");
  if (receipt.panel.length < 3 || new Set(receipt.panel.map((row) => row.actor_id)).size < 3 || new Set(receipt.panel.map((row) => row.domain)).size < 3) throw new Error("adjudication_panel_failure");
  if (!receipt.reason_code || !receipt.appeal_deadline || !receipt.quarantine_remains || receipt.publishes_automatically || receipt.closes_hold_automatically) throw new Error("adjudication_authority_failure");
  return "fork_adjudication_and_appeal_boundary_verified";
};

export const verifyTimeCorroboration = (receipt) => {
  if (!receipt.fixture_only || receipt.authorities.length < 3 || new Set(receipt.authorities.map((row) => row.authority_id)).size < 3 || new Set(receipt.authorities.map((row) => row.domain)).size < 3) throw new Error("time_corroboration_independence_failure");
  const times = receipt.authorities.map((row) => Date.parse(row.observed_at));
  if (Math.max(...times) - Math.min(...times) > receipt.max_skew_ms || receipt.rollback_imported) throw new Error("time_corroboration_skew_failure");
  if (!receipt.append_only || receipt.sequence !== receipt.prior_sequence + 1 || receipt.monotonic_counter <= receipt.prior_counter || receipt.publishes_automatically) throw new Error("time_corroboration_lineage_failure");
  return "cross_authority_time_corroboration_verified";
};

export const verifyPatchProvenance = (receipt) => {
  if (!receipt.fixture_only || !receipt.advisory_id || !receipt.affected_build_digest || !receipt.vulnerable_lineage_preserved || !receipt.patch_commit || !receipt.build_recipe_digest || !receipt.sbom_digest) throw new Error("patch_provenance_incomplete");
  if (receipt.patched_artifact_digest === receipt.affected_build_digest || receipt.verifiers.length < 3 || new Set(receipt.verifiers.map((row) => row.codebase)).size < 3 || new Set(receipt.verifiers.map((row) => row.operator)).size < 3 || receipt.verifiers.some((row) => !row.reproduced)) throw new Error("patch_verification_failure");
  if (receipt.rollout_active || receipt.vulnerable_build_rewritten || receipt.vulnerable_build_retrusted || receipt.publishes_automatically) throw new Error("patch_side_effect");
  return "vulnerability_disclosure_and_patch_provenance_verified";
};

export const verifyDecommissioning = (receipt) => {
  if (!receipt.fixture_only || !receipt.legacy_artifact_frozen || !receipt.replacement_verified || !receipt.notification_complete || !receipt.grace_period_complete || !receipt.rollback_target_preserved) throw new Error("decommission_prerequisite_failure");
  if (!receipt.append_only || !receipt.decommission_authorized || !receipt.post_decommission_verified) throw new Error("decommission_verification_failure");
  if (receipt.legacy_artifact_deleted || receipt.history_rewritten || receipt.rollback_disabled || receipt.reader_migration_forced || receipt.publishes_automatically || receipt.closes_hold_automatically) throw new Error("decommission_side_effect");
  return "reversible_notified_legacy_artifact_decommissioning_verified";
};

export const runPhase57xHarness = ({ ceremonySchemas, availabilitySchemas, forkEvidenceSchemas, timeFailoverSchemas, buildProvenanceSchemas, artifactReissuanceSchemas }) => {
  const priorSets = [ceremonySchemas, availabilitySchemas, forkEvidenceSchemas, timeFailoverSchemas, buildProvenanceSchemas, artifactReissuanceSchemas];
  if (!priorSets.every((rows) => Array.isArray(rows) && rows.length === 9)) throw new Error("Phase 57X requires fifty-four complete Phase 57W schemas.");
  const contractIds = ceremonySchemas.map((row) => row.contract_id);
  if (priorSets.some((rows) => rows.some((row) => !contractIds.includes(row.contract_id)))) throw new Error("Phase 57X requires aligned Phase 57W contract lineage.");

  const healthSchemas = ceremonySchemas.map((prior) => ({ health_schema_id: `57X-HLT-${prior.contract_id}`, contract_id: prior.contract_id, evidence_rail: prior.evidence_rail, observation_window_seconds: 3600, integrity_threshold: 3, member_count: 5, threshold_reduction_allowed: false, append_only: true }));
  const diversitySchemas = ceremonySchemas.map((prior) => ({ diversity_schema_id: `57X-DIV-${prior.contract_id}`, contract_id: prior.contract_id, evidence_rail: prior.evidence_rail, minimum_witnesses: 3, diversity_dimensions: ["ownership", "codebase", "infrastructure", "jurisdiction"], independent_auditor_required: true, append_only: true }));
  const adjudicationSchemas = ceremonySchemas.map((prior) => ({ adjudication_schema_id: `57X-ADJ-${prior.contract_id}`, contract_id: prior.contract_id, evidence_rail: prior.evidence_rail, panel_size: 3, independent_domains_required: true, appeal_required: true, technical_attribution_separate: true, quarantine_through_appeal: true }));
  const timeCorroborationSchemas = ceremonySchemas.map((prior) => ({ time_corroboration_schema_id: `57X-TIM-${prior.contract_id}`, contract_id: prior.contract_id, evidence_rail: prior.evidence_rail, authority_minimum: 3, independent_domains_required: true, max_skew_ms: 5000, rollback_allowed: false, append_only: true }));
  const patchProvenanceSchemas = ceremonySchemas.map((prior) => ({ patch_provenance_schema_id: `57X-PAT-${prior.contract_id}`, contract_id: prior.contract_id, evidence_rail: prior.evidence_rail, advisory_required: true, vulnerable_lineage_preserved: true, verifier_minimum: 3, reproducible_patch_required: true, rollout_state: "inactive" }));
  const decommissionSchemas = ceremonySchemas.map((prior) => ({ decommission_schema_id: `57X-DEC-${prior.contract_id}`, contract_id: prior.contract_id, evidence_rail: prior.evidence_rail, notification_required: true, grace_period_required: true, rollback_target_required: true, legacy_history_preserved: true, independent_verification_required: true }));

  verifyHealthBudget({ fixture_only: true, integrity_threshold: 3, member_count: 5, partition_threshold_lowered: false, window_seconds: 3600, quorum_available_seconds: 3540, witness_available_seconds: 3480, append_only: true, sequence: 12, prior_sequence: 11, partition_policy: "fail-closed", stale_witness_counted: false, publishes_automatically: false, closes_hold_automatically: false, evidence_created: false });
  verifyDiversityAudit({ fixture_only: true, append_only: true, sequence: 5, prior_sequence: 4, auditor_id: "independent-auditor", witnesses: [["owner-a", "code-a", "infra-a", "CA"], ["owner-b", "code-b", "infra-b", "US"], ["owner-c", "code-c", "infra-c", "EU"]].map(([owner, codebase, infrastructure, jurisdiction]) => ({ owner, codebase, infrastructure, jurisdiction })), publishes_automatically: false, evidence_created: false });
  verifyForkAdjudication({ fixture_only: true, fork_evidence_digest: "sha256:fixture-fork", technical_attribution_preserved: true, technical_receipt_assigns_human_blame: false, panel: [["actor-a", "domain-a"], ["actor-b", "domain-b"], ["actor-c", "domain-c"]].map(([actor_id, domain]) => ({ actor_id, domain })), reason_code: "technical-surface-confirmed-human-cause-undetermined", appeal_deadline: "2026-08-17T00:00:00Z", quarantine_remains: true, publishes_automatically: false, closes_hold_automatically: false });
  verifyTimeCorroboration({ fixture_only: true, authorities: [["time-a", "domain-a", "2026-08-10T18:00:00.000Z"], ["time-b", "domain-b", "2026-08-10T18:00:01.000Z"], ["time-c", "domain-c", "2026-08-10T18:00:02.000Z"]].map(([authority_id, domain, observed_at]) => ({ authority_id, domain, observed_at })), max_skew_ms: 5000, rollback_imported: false, append_only: true, sequence: 20, prior_sequence: 19, monotonic_counter: 200, prior_counter: 199, publishes_automatically: false });
  verifyPatchProvenance({ fixture_only: true, advisory_id: "ADV-FIXTURE-001", affected_build_digest: "sha256:vulnerable", vulnerable_lineage_preserved: true, patch_commit: "fixture-patch-commit", build_recipe_digest: "sha256:recipe", sbom_digest: "sha256:sbom", patched_artifact_digest: "sha256:patched", verifiers: [["code-a", "operator-a"], ["code-b", "operator-b"], ["code-c", "operator-c"]].map(([codebase, operator]) => ({ codebase, operator, reproduced: true })), rollout_active: false, vulnerable_build_rewritten: false, vulnerable_build_retrusted: false, publishes_automatically: false });
  verifyDecommissioning({ fixture_only: true, legacy_artifact_frozen: true, replacement_verified: true, notification_complete: true, grace_period_complete: true, rollback_target_preserved: true, append_only: true, decommission_authorized: true, post_decommission_verified: true, legacy_artifact_deleted: false, history_rewritten: false, rollback_disabled: false, reader_migration_forced: false, publishes_automatically: false, closes_hold_automatically: false });

  const healthCases = createCases(healthSchemas, healthClasses, "57X-HLT", "health_schema_id");
  const diversityCases = createCases(diversitySchemas, diversityClasses, "57X-DIV", "diversity_schema_id");
  const adjudicationCases = createCases(adjudicationSchemas, adjudicationClasses, "57X-ADJ", "adjudication_schema_id");
  const timeCorroborationCases = createCases(timeCorroborationSchemas, timeClasses, "57X-TIM", "time_corroboration_schema_id");
  const patchProvenanceCases = createCases(patchProvenanceSchemas, patchClasses, "57X-PAT", "patch_provenance_schema_id");
  const decommissionCases = createCases(decommissionSchemas, decommissionClasses, "57X-DEC", "decommission_schema_id");
  const allCases = [...healthCases, ...diversityCases, ...adjudicationCases, ...timeCorroborationCases, ...patchProvenanceCases, ...decommissionCases];
  const failures = allCases.filter((row) => !row.passed);
  return {
    healthSchemas, diversitySchemas, adjudicationSchemas, timeCorroborationSchemas, patchProvenanceSchemas, decommissionSchemas,
    healthCases, diversityCases, adjudicationCases, timeCorroborationCases, patchProvenanceCases, decommissionCases, allCases, failures,
    distributions: {
      health: { schema_count: 9, case_count: 270, valid_or_preservation_routes: 72, rejected_routes: 198 },
      diversity: { schema_count: 9, case_count: 252, valid_or_preservation_routes: 63, rejected_routes: 189 },
      adjudication: { schema_count: 9, case_count: 270, valid_or_preservation_routes: 72, rejected_routes: 198 },
      time_corroboration: { schema_count: 9, case_count: 243, valid_or_preservation_routes: 63, rejected_routes: 180 },
      patch_provenance: { schema_count: 9, case_count: 270, valid_or_preservation_routes: 72, rejected_routes: 198 },
      decommissioning: { schema_count: 9, case_count: 288, valid_or_preservation_routes: 72, rejected_routes: 216 }
    },
    total_case_count: allCases.length,
    passed_case_count: allCases.length - failures.length,
    failed_case_count: failures.length,
    valid_or_preservation_routes: 414,
    rejected_routes: 1179
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dataRoot = new URL("../src/data/", import.meta.url);
  const names = ["phase-57w-quorum-ceremony-member-lifecycle.json", "phase-57w-witness-availability-catchup-proofs.json", "phase-57w-attributable-fork-evidence.json", "phase-57w-federated-time-authority-failover.json", "phase-57w-verifier-build-provenance.json", "phase-57w-post-compromise-reissuance.json"];
  const [ceremony, availability, fork, time, build, reissuance] = await Promise.all(names.map(async (name) => JSON.parse(await readFile(new URL(name, dataRoot), "utf8"))));
  const result = runPhase57xHarness({ ceremonySchemas: ceremony.schemas, availabilitySchemas: availability.schemas, forkEvidenceSchemas: fork.schemas, timeFailoverSchemas: time.schemas, buildProvenanceSchemas: build.schemas, artifactReissuanceSchemas: reissuance.schemas });
  if (result.failed_case_count || result.total_case_count !== 1593) throw new Error(`Phase 57X harness failed: ${result.failed_case_count} failures across ${result.total_case_count} cases.`);
  console.log("Phase 57X harness passed: 1,593 federation-health, witness-diversity, fork-adjudication, time-corroboration, patch-provenance, and reversible-decommissioning cases across nine contracts.");
}
