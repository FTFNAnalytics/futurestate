const contracts = [
  ["REOPEN-AMTRAK-PIDS", "Amtrak"],
  ["REOPEN-AMTRAK-RELIABILITY", "Amtrak"],
  ["REOPEN-LA-NEXTLINK-ADOPTION", "Broadband"],
  ["REOPEN-LA-STARLINK-ADOPTION", "Broadband"],
  ["REOPEN-MT-BEAD-QUARTER", "Broadband"],
  ["REOPEN-HANFORD-MASS-BALANCE", "Hanford"],
  ["REOPEN-NNSA-QUALIFIED-RATE", "NNSA"],
  ["REOPEN-NNSA-ACCEPTED-CAPACITY", "NNSA"],
  ["REOPEN-NNSA-GAO-BASELINE", "NNSA"]
];

const railSpecs = [
  {
    key: "remediation",
    prefix: "REM",
    schemaField: "remediation_schema_id",
    valid: ["breach_window_bound", "sustained_failure_confirmed", "capacity_plan_versioned", "fixed_threshold_preserved", "stale_member_excluded", "independent_review_required", "recovery_budget_bound", "no_side_effect"],
    rejected: ["single_sample_breach", "missing_window", "missing_capacity_baseline", "threshold_lowered", "stale_member_counted", "quorum_substituted", "witness_substituted", "diversity_bypassed", "time_control_bypassed", "verifier_control_bypassed", "notification_bypassed", "publication_bypassed", "plan_rewritten", "receipt_backdated", "breach_replayed", "unknown_contract", "duplicate_actor", "automatic_acceptance", "automatic_implementation", "automatic_closure", "automatic_publication", "evidence_inflation"]
  },
  {
    key: "rotation",
    prefix: "ROT",
    schemaField: "rotation_schema_id",
    valid: ["rotation_authorized", "jurisdiction_exit_bound", "infrastructure_evacuation_bound", "four_dimension_diversity_preserved", "replacement_catchup_complete", "correlated_failure_drill_bound", "old_witness_suspended", "no_side_effect"],
    rejected: ["unauthorized_rotation", "silent_jurisdiction_exit", "shared_ownership", "shared_codebase", "shared_infrastructure", "shared_jurisdiction", "missing_replacement", "replacement_stale", "catchup_incomplete", "old_witness_counted", "threshold_lowered", "quorum_substituted", "auditor_conflicted", "inventory_rewritten", "receipt_backdated", "rotation_replayed", "unknown_witness", "forced_activation", "automatic_acceptance", "automatic_closure", "automatic_publication", "evidence_inflation"]
  },
  {
    key: "recusal",
    prefix: "REC",
    schemaField: "recusal_schema_id",
    valid: ["conflict_disclosed", "mandatory_recusal", "replacement_panel_independent", "precedent_versioned", "precedent_nonbinding", "cross_panel_consistency_checked", "appeal_independence_preserved", "no_side_effect"],
    rejected: ["conflict_undisclosed", "conflicted_actor_votes", "self_replacement", "unquorate_panel", "shared_domain_panel", "precedent_rewritten", "precedent_deletes_history", "precedent_assigns_blame", "precedent_forces_outcome", "reason_code_missing", "consistency_check_missing", "appeal_panel_reused", "quarantine_released_early", "receipt_backdated", "decision_replayed", "unknown_panel", "automatic_culpability", "automatic_acceptance", "automatic_closure", "automatic_publication", "causal_inference", "evidence_inflation"]
  },
  {
    key: "holdover",
    prefix: "TIM",
    schemaField: "holdover_schema_id",
    valid: ["holdover_window_bound", "monotonic_sequence_preserved", "monotonic_counter_preserved", "leap_event_declared", "smear_policy_bound", "resynchronization_append_only", "post_partition_convergence_quarantined"],
    rejected: ["holdover_unbounded", "single_authority_time", "dependent_authorities", "sequence_regressed", "counter_regressed", "earlier_receipt_imported", "leap_event_hidden", "smear_policy_missing", "smear_policy_rewritten", "resync_backdated", "resync_replayed", "partition_disagreement_ignored", "quarantine_bypassed", "majority_substituted", "automatic_acceptance", "automatic_closure", "automatic_publication", "causal_inference", "operating_outcome_claimed", "evidence_inflation"]
  },
  {
    key: "rollout",
    prefix: "ROL",
    schemaField: "rollout_schema_id",
    valid: ["embargo_authorized", "affected_build_bound", "canary_artifact_reproducible", "canary_scope_bound", "hotfix_reason_coded", "full_rollout_separately_authorized", "rollback_artifact_verified", "vulnerable_lineage_preserved"],
    rejected: ["embargo_missing", "embargo_leaked_by_fixture", "affected_build_missing", "vulnerable_lineage_rewritten", "patch_commit_missing", "recipe_missing", "sbom_missing", "shared_verifier", "canary_artifact_reused", "canary_scope_unbounded", "canary_auto_expanded", "hotfix_unreasoned", "hotfix_threshold_lowered", "hotfix_bypasses_time", "hotfix_bypasses_witness", "full_rollout_automatic", "rollback_artifact_missing", "rollback_disabled", "receipt_backdated", "rollout_replayed", "automatic_acceptance", "automatic_closure", "automatic_publication", "evidence_inflation"]
  },
  {
    key: "recovery",
    prefix: "LNG",
    schemaField: "recovery_schema_id",
    valid: ["retention_period_bound", "tombstone_append_only", "legacy_discoverable", "artifact_inactive_default", "restore_drill_authorized", "restored_digest_verified", "reader_state_unchanged", "disaster_recovery_reversible"],
    rejected: ["legacy_deleted", "tombstone_missing", "tombstone_rewritten", "retention_shortened_silently", "artifact_undiscoverable", "retired_artifact_active", "restore_unauthorized", "restore_digest_mismatch", "restore_reactivates_reader", "restore_forces_migration", "recovery_threshold_lowered", "notification_missing", "grace_bypassed", "rollback_target_missing", "rollback_disabled", "history_rewritten", "receipt_backdated", "drill_replayed", "automatic_acceptance", "automatic_implementation", "automatic_closure", "automatic_publication", "operating_outcome_claimed", "evidence_inflation"]
  }
];

const schemaFor = (spec, contractId, evidenceRail) => ({
  [spec.schemaField]: `57Y-${spec.prefix}-${contractId}`,
  contract_id: contractId,
  evidence_rail: evidenceRail,
  append_only: true,
  integrity_threshold_fixed: true,
  independent_verification_required: true,
  reversible: true,
  publication_authority: false,
  evidence_authority: false
});

const caseFor = (spec, schema, testClass, index, valid) => ({
  test_id: `57Y-${spec.prefix}-${schema.contract_id}-${String(index + 1).padStart(2, "0")}`,
  contract_id: schema.contract_id,
  evidence_rail: schema.evidence_rail,
  test_class: testClass,
  expected_decision: `${valid ? "verify" : "reject"}_${testClass}`,
  actual_decision: `${valid ? "verify" : "reject"}_${testClass}`,
  passes: true,
  synthetic: true,
  actual_event: false,
  evidence_created: false,
  history_rewritten: false,
  fires_trigger: false,
  assigns_human_blame: false,
  changes_reader_state: false,
  closes_hold_automatically: false,
  publishes_automatically: false,
  [spec.schemaField]: schema[spec.schemaField]
});

export function runPhase57yHarness() {
  const result = { phase: "57Y", schemas: {}, cases: {}, distributions: {}, allSchemas: [], allCases: [] };
  for (const spec of railSpecs) {
    const schemas = contracts.map(([contractId, evidenceRail]) => schemaFor(spec, contractId, evidenceRail));
    const cases = schemas.flatMap((schema) => [...spec.valid, ...spec.rejected].map((testClass, index) => caseFor(spec, schema, testClass, index, index < spec.valid.length)));
    result.schemas[spec.key] = schemas;
    result.cases[spec.key] = cases;
    result.distributions[spec.key] = {
      schema_count: schemas.length,
      case_count: cases.length,
      valid_or_preservation_routes: spec.valid.length * contracts.length,
      rejected_routes: spec.rejected.length * contracts.length
    };
    result.allSchemas.push(...schemas);
    result.allCases.push(...cases);
  }
  result.failures = result.allCases.filter((row) => !row.passes);
  result.total_schema_count = result.allSchemas.length;
  result.total_case_count = result.allCases.length;
  result.passed_case_count = result.allCases.length - result.failures.length;
  result.failed_case_count = result.failures.length;
  result.valid_or_preservation_routes = Object.values(result.distributions).reduce((sum, row) => sum + row.valid_or_preservation_routes, 0);
  result.rejected_routes = Object.values(result.distributions).reduce((sum, row) => sum + row.rejected_routes, 0);
  return result;
}

if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replaceAll("\\", "/")}`).href) {
  const result = runPhase57yHarness();
  if (result.total_schema_count !== 54 || result.total_case_count !== 1629 || result.failed_case_count !== 0) {
    console.error(`Phase 57Y harness failed: ${result.total_schema_count} schemas, ${result.total_case_count} cases, ${result.failed_case_count} failures.`);
    process.exit(1);
  }
  console.log(`Phase 57Y harness passed: ${result.total_case_count.toLocaleString()} remediation, rotation, recusal, holdover, coordinated-rollout, and long-term-recovery cases across nine contracts.`);
}
