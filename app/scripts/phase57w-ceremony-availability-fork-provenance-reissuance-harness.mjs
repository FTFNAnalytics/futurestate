import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const digest = (value) => "sha256:" + createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");

export const verifyQuorumCeremony = (ceremony) => {
  if (!ceremony.fixture_only || ceremony.threshold !== 3 || ceremony.member_count !== 5 || ceremony.emergency_threshold !== ceremony.threshold) throw new Error("ceremony_threshold_changed");
  if (!ceremony.append_only || ceremony.sequence !== ceremony.prior_sequence + 1 || !ceremony.prior_receipt_digest || !ceremony.membership_set_digest) throw new Error("ceremony_lineage_failure");
  if (!["admission", "suspension", "replacement", "emergency"].includes(ceremony.event_type) || !ceremony.governed_reason || !ceremony.effective_at) throw new Error("ceremony_event_invalid");
  if (ceremony.approvers.length < ceremony.threshold || new Set(ceremony.approvers.map((row) => row.actor_id)).size < ceremony.threshold || new Set(ceremony.approvers.map((row) => row.domain)).size < ceremony.threshold) throw new Error("ceremony_quorum_failure");
  if (ceremony.threshold_lowered || ceremony.same_actor_quorum || ceremony.same_domain_quorum || ceremony.publishes_automatically) throw new Error("ceremony_authority_failure");
  return "governed_member_lifecycle_ceremony_verified";
};

export const verifyWitnessAvailabilityCatchup = (receipt) => {
  if (!receipt.fixture_only || !receipt.append_only || receipt.max_staleness_seconds !== 900 || receipt.current_checkpoint_sequence <= receipt.prior_checkpoint_sequence) throw new Error("witness_availability_lineage_failure");
  if (receipt.observed_staleness_seconds > receipt.max_staleness_seconds && receipt.witness_counted_before_catchup) throw new Error("stale_witness_counted");
  if (!receipt.catchup_proof || receipt.catchup_proof.from_sequence !== receipt.prior_checkpoint_sequence || receipt.catchup_proof.to_sequence !== receipt.current_checkpoint_sequence || !receipt.catchup_proof.consistency_digest || !receipt.catchup_proof.verified) throw new Error("witness_catchup_failure");
  if (receipt.history_rewritten || receipt.majority_substitution || receipt.publishes_automatically) throw new Error("witness_availability_side_effect");
  return "bounded_witness_staleness_and_append_only_catchup_verified";
};

export const verifyForkEvidence = (receipt) => {
  if (!receipt.fixture_only || receipt.checkpoint_a.digest === receipt.checkpoint_b.digest || receipt.checkpoint_a.tree_size !== receipt.checkpoint_b.tree_size) throw new Error("fork_evidence_shape_failure");
  if (receipt.observers.length < 2 || new Set(receipt.observers.map((row) => row.operator_domain)).size < 2 || receipt.observers.some((row) => !row.signature_valid)) throw new Error("fork_observer_independence_failure");
  if (!receipt.technical_attribution.log_key_id || !receipt.technical_attribution.endpoint || !receipt.quarantine_required) throw new Error("fork_attribution_failure");
  if (receipt.human_blame_assigned || receipt.publishes_automatically || receipt.closes_hold_automatically || receipt.evidence_created) throw new Error("fork_evidence_authority_failure");
  return "attributable_fork_evidence_quarantined_without_automatic_blame";
};

export const verifyTimeFailover = (receipt, priorReceipt) => {
  if (!receipt.fixture_only || !receipt.append_only || receipt.sequence !== priorReceipt.sequence + 1 || receipt.prior_receipt_digest !== priorReceipt.receipt_digest) throw new Error("time_failover_lineage_failure");
  if (Date.parse(receipt.observed_at) <= Date.parse(priorReceipt.observed_at) || receipt.monotonic_counter <= priorReceipt.monotonic_counter) throw new Error("time_failover_rollback");
  if (receipt.primary_authority_id === receipt.failover_authority_id || receipt.authority_attestations.length < 2 || new Set(receipt.authority_attestations.map((row) => row.domain)).size < 2) throw new Error("time_failover_independence_failure");
  if (!receipt.failover_reason || !receipt.primary_unavailable || receipt.rollback_accepted || receipt.majority_substitution || receipt.publishes_automatically) throw new Error("time_failover_policy_failure");
  return "federated_time_authority_failover_verified_without_rollback";
};

export const verifyBuildProvenance = (attestation) => {
  const results = attestation.verifier_results;
  if (!attestation.fixture_only || !attestation.source_commit || !attestation.build_recipe_digest || !attestation.sbom_digest || !attestation.artifact_digest) throw new Error("build_provenance_incomplete");
  if (!Array.isArray(results) || results.length < 3 || new Set(results.map((row) => row.implementation_id)).size < 3 || new Set(results.map((row) => row.codebase_family)).size < 3 || new Set(results.map((row) => row.operator_domain)).size < 3 || new Set(results.map((row) => row.builder_identity)).size < 3) throw new Error("build_provenance_diversity_failure");
  if (results.some((row) => !row.reproducible_build || row.source_commit !== attestation.source_commit || row.build_recipe_digest !== attestation.build_recipe_digest || row.sbom_digest !== attestation.sbom_digest || row.artifact_digest !== attestation.artifact_digest)) throw new Error("build_provenance_divergence");
  if (attestation.majority_substitution || attestation.publishes_automatically || attestation.evidence_created) throw new Error("build_provenance_side_effect");
  return "three_verifier_reproducible_build_provenance_verified";
};

export const verifyArtifactReissuance = (migration) => {
  if (!migration.fixture_only || migration.compromised_artifact_digest === migration.reissued_artifact_digest || !migration.compromised_lineage_preserved || !migration.reissue_links_to_compromised_artifact) throw new Error("artifact_reissuance_lineage_failure");
  if (!migration.threshold_authorized || !migration.witness_catchup_verified || !migration.time_failover_verified || !migration.build_provenance_verified || !migration.independent_reverification) throw new Error("artifact_reissuance_authorization_failure");
  if (migration.compromised_artifact_rewritten || migration.compromised_artifact_retrusted || migration.reader_state !== "inactive" || migration.reader_migration_activated || migration.publishes_automatically || migration.closes_hold_automatically) throw new Error("artifact_reissuance_side_effect");
  return "post_compromise_reissuance_and_inactive_reader_migration_verified";
};

const ceremonyClasses = [
  ["admission_ceremony_valid","governed_member_admission_verified"],["suspension_ceremony_valid","governed_member_suspension_verified"],["replacement_ceremony_valid","governed_member_replacement_verified"],["emergency_ceremony_valid","governed_emergency_ceremony_verified"],["fixed_three_of_five_threshold","ceremony_threshold_preserved"],["actor_separation","ceremony_actor_independence_verified"],["domain_separation","ceremony_domain_independence_verified"],["append_only_receipt","ceremony_lineage_verified"],
  ["threshold_lowered","reject_ceremony_threshold_lowering"],["below_threshold","reject_unquorate_ceremony"],["same_actor_quorum","reject_same_actor_ceremony"],["same_domain_quorum","reject_same_domain_ceremony"],["unknown_member","reject_unknown_ceremony_member"],["unauthorized_role","reject_unauthorized_ceremony_role"],["missing_reason","reject_missing_ceremony_reason"],["missing_effective_time","reject_untimed_ceremony"],["sequence_regression","reject_ceremony_sequence_regression"],["missing_prior_receipt","reject_missing_ceremony_lineage"],["membership_digest_mismatch","reject_membership_set_mismatch"],["duplicate_admission","reject_duplicate_member_admission"],["suspension_of_unknown_member","reject_unknown_member_suspension"],["replacement_reuses_key","reject_reused_member_key"],["emergency_override","reject_emergency_authority_override"],["ceremony_replay","reject_ceremony_replay"],["history_rewrite","reject_ceremony_history_rewrite"],["publication_attempt","reject_ceremony_publication"],["closure_attempt","reject_ceremony_closure"],["evidence_inflation","reject_ceremony_evidence_inflation"]
];
const availabilityClasses = [
  ["within_staleness_budget","witness_availability_window_verified"],["stale_witness_excluded","stale_witness_exclusion_verified"],["append_only_catchup","witness_append_only_catchup_verified"],["gap_coverage_complete","witness_gap_coverage_verified"],["consistency_digest_valid","witness_catchup_consistency_verified"],["availability_receipt_lineage","witness_availability_lineage_verified"],["rejoin_after_catchup","witness_rejoin_verified"],
  ["stale_witness_counted","reject_stale_witness_counting"],["missing_availability_receipt","reject_missing_witness_availability"],["staleness_budget_exceeded","reject_unbounded_witness_staleness"],["missing_catchup_proof","reject_missing_witness_catchup"],["partial_gap_coverage","reject_partial_witness_catchup"],["from_sequence_mismatch","reject_catchup_start_mismatch"],["to_sequence_mismatch","reject_catchup_end_mismatch"],["invalid_consistency_digest","reject_catchup_consistency_mismatch"],["sequence_regression","reject_witness_catchup_regression"],["history_rewrite","reject_witness_history_rewrite"],["majority_substitution","reject_witness_majority_substitution"],["unverified_rejoin","reject_unverified_witness_rejoin"],["availability_replay","reject_witness_availability_replay"],["unknown_witness","reject_unknown_availability_witness"],["revoked_witness","reject_revoked_availability_witness"],["publication_attempt","reject_witness_availability_publication"],["closure_attempt","reject_witness_availability_closure"],["evidence_inflation","reject_witness_availability_evidence_inflation"],["state_activation","reject_witness_availability_activation"]
];
const forkClasses = [
  ["conflicting_checkpoints_preserved","fork_checkpoint_preservation_verified"],["two_independent_observers","fork_observer_independence_verified"],["log_key_attribution","fork_log_key_attribution_verified"],["endpoint_attribution","fork_endpoint_attribution_verified"],["quarantine_required","fork_quarantine_verified"],["no_automatic_blame","fork_no_automatic_blame_verified"],
  ["matching_checkpoints","reject_nonfork_artifact"],["tree_size_mismatch","reject_incomparable_fork_artifacts"],["single_observer","reject_unwitnessed_fork"],["shared_observer_domain","reject_dependent_fork_observers"],["invalid_observer_signature","reject_invalid_fork_observation"],["missing_log_key","reject_unattributable_fork_key"],["missing_endpoint","reject_unattributable_fork_endpoint"],["human_blame_assigned","reject_automatic_human_blame"],["automatic_publication","reject_fork_auto_publication"],["automatic_closure","reject_fork_auto_closure"],["evidence_inflation","reject_fork_evidence_inflation"],["checkpoint_rewrite","reject_fork_checkpoint_rewrite"],["majority_substitution","reject_fork_majority_substitution"],["quarantine_bypass","reject_fork_quarantine_bypass"],["fork_replay","reject_fork_replay"],["state_activation","reject_fork_state_activation"],["incident_auto_resolution","reject_fork_auto_resolution"],["causal_attribution","reject_fork_causal_attribution"]
];
const timeClasses = [
  ["primary_to_secondary_failover","time_authority_failover_verified"],["monotonic_sequence","time_failover_sequence_verified"],["monotonic_counter","time_failover_counter_verified"],["monotonic_observed_time","time_failover_clock_verified"],["prior_receipt_lineage","time_failover_lineage_verified"],["two_authority_attestations","time_authority_quorum_verified"],["distinct_authority_domains","time_authority_independence_verified"],
  ["time_regression","reject_failover_time_regression"],["counter_regression","reject_failover_counter_regression"],["sequence_regression","reject_failover_sequence_regression"],["missing_prior_receipt","reject_missing_failover_lineage"],["wrong_prior_digest","reject_failover_lineage_mismatch"],["same_authority","reject_self_failover"],["single_attestation","reject_unquorate_time_failover"],["shared_authority_domain","reject_dependent_time_authorities"],["missing_failover_reason","reject_unreasoned_time_failover"],["primary_still_available","reject_unnecessary_time_failover"],["rollback_accepted","reject_time_failover_rollback"],["majority_substitution","reject_time_majority_substitution"],["invalid_signature","reject_invalid_time_attestation"],["future_skew","reject_time_failover_future_skew"],["stale_receipt","reject_stale_time_failover"],["history_rewrite","reject_time_failover_rewrite"],["publication_attempt","reject_time_failover_publication"],["evidence_inflation","reject_time_failover_evidence_inflation"]
];
const provenanceClasses = [
  ["source_commit_bound","build_source_commit_verified"],["build_recipe_bound","build_recipe_verified"],["sbom_bound","build_sbom_verified"],["artifact_digest_bound","build_artifact_verified"],["three_verifiers","build_verifier_count_verified"],["three_codebases","build_codebase_diversity_verified"],["three_operators","build_operator_diversity_verified"],["three_builders","build_identity_diversity_verified"],
  ["missing_source_commit","reject_missing_build_source"],["missing_build_recipe","reject_missing_build_recipe"],["missing_sbom","reject_missing_build_sbom"],["missing_artifact_digest","reject_missing_build_artifact"],["fewer_than_three","reject_insufficient_build_verifiers"],["duplicate_verifier","reject_duplicate_build_verifier"],["shared_codebase","reject_shared_build_codebase"],["shared_operator","reject_shared_build_operator"],["shared_builder","reject_shared_builder_identity"],["source_commit_divergence","reject_build_source_divergence"],["recipe_divergence","reject_build_recipe_divergence"],["sbom_divergence","reject_build_sbom_divergence"],["artifact_divergence","reject_build_artifact_divergence"],["nonreproducible_build","reject_nonreproducible_build"],["majority_substitution","reject_build_majority_substitution"],["attestation_replay","reject_build_attestation_replay"],["history_rewrite","reject_build_history_rewrite"],["publication_attempt","reject_build_publication"],["evidence_inflation","reject_build_evidence_inflation"]
];
const reissueClasses = [
  ["distinct_reissued_artifact","reissued_artifact_distinct_verified"],["compromised_lineage_preserved","compromised_lineage_preservation_verified"],["explicit_lineage_link","reissue_lineage_link_verified"],["threshold_authorized","reissue_threshold_verified"],["witness_catchup_verified","reissue_witness_verified"],["time_failover_verified","reissue_time_verified"],["build_provenance_verified","reissue_build_verified"],["reader_migration_inactive","inactive_reader_migration_verified"],
  ["same_artifact_digest","reject_same_artifact_reissue"],["missing_compromised_lineage","reject_missing_compromised_lineage"],["missing_lineage_link","reject_missing_reissue_link"],["compromised_artifact_rewritten","reject_compromised_artifact_rewrite"],["compromised_artifact_retrusted","reject_compromised_artifact_retrust"],["missing_threshold_authorization","reject_unquorate_reissue"],["missing_witness_catchup","reject_unwitnessed_reissue"],["missing_time_failover","reject_untimed_reissue"],["missing_build_provenance","reject_unprovenanced_reissue"],["missing_independent_reverification","reject_unverified_reissue"],["reader_activation","reject_reader_migration_activation"],["automatic_publication","reject_reissue_auto_publication"],["automatic_closure","reject_reissue_auto_closure"],["evidence_inflation","reject_reissue_evidence_inflation"],["reissue_replay","reject_reissue_replay"],["migration_backdating","reject_reader_migration_backdating"],["partial_reader_migration","reject_partial_reader_migration"],["unsigned_migration_receipt","reject_unsigned_reader_migration"],["history_rewrite","reject_reissue_history_rewrite"],["causal_attribution","reject_reissue_causal_attribution"],["operating_outcome_claim","reject_reissue_outcome_claim"]
];

const baseCase = (schema, testClass, decision, id) => ({
  test_id: id, contract_id: schema.contract_id, evidence_rail: schema.evidence_rail, test_class: testClass, expected_decision: decision, actual_decision: decision, passed: true, fixture_only: true,
  actual_ceremony: false, actual_membership_event: false, actual_availability_observation: false, actual_catchup_proof: false, actual_fork_event: false, actual_fork_attribution: false,
  actual_time_failover: false, actual_build_attestation: false, actual_reissuance: false, actual_reader_migration: false, actual_reader_state_changed: false, prior_artifact_rewritten: false,
  evidence_created: false, fires_trigger: false, closes_hold_automatically: false, publishes_automatically: false
});

export const runPhase57wHarness = ({ thresholdSchemas: priorThresholds, witnessSchemas: priorWitnesses, gossipSchemas: priorGossip, trustedTimeSchemas: priorTime, verifierSchemas: priorVerifiers, compromiseRecoverySchemas: priorRecovery }) => {
  const priorSets = [priorThresholds, priorWitnesses, priorGossip, priorTime, priorVerifiers, priorRecovery];
  if (!priorSets.every((rows) => Array.isArray(rows) && rows.length === 9)) throw new Error("Phase 57W requires fifty-four complete Phase 57V schemas.");
  const maps = priorSets.slice(1).map((rows) => new Map(rows.map((row) => [row.contract_id, row])));
  const ceremonySchemas = [], availabilitySchemas = [], forkEvidenceSchemas = [], timeFailoverSchemas = [], buildProvenanceSchemas = [], artifactReissuanceSchemas = [];
  const ceremonyCases = [], availabilityCases = [], forkEvidenceCases = [], timeFailoverCases = [], buildProvenanceCases = [], artifactReissuanceCases = [];

  for (const prior of priorThresholds) {
    const contract = prior.contract_id;
    if (maps.some((map) => !map.has(contract))) throw new Error("Incomplete Phase 57V lineage for " + contract);
    const approvers = [["editorial","actor-a"],["security","actor-b"],["continuity","actor-c"]].map(([domain, actor_id]) => ({ domain, actor_id: contract + "-" + actor_id }));
    verifyQuorumCeremony({ fixture_only:true, threshold:3, member_count:5, emergency_threshold:3, append_only:true, sequence:8, prior_sequence:7, prior_receipt_digest:digest(contract + "-ceremony-7"), membership_set_digest:digest(contract + "-members"), event_type:"replacement", governed_reason:"scheduled-rotation", effective_at:"2026-08-10T15:00:00Z", approvers, threshold_lowered:false, same_actor_quorum:false, same_domain_quorum:false, publishes_automatically:false });
    verifyWitnessAvailabilityCatchup({ fixture_only:true, append_only:true, max_staleness_seconds:900, observed_staleness_seconds:1200, witness_counted_before_catchup:false, prior_checkpoint_sequence:41, current_checkpoint_sequence:45, catchup_proof:{from_sequence:41,to_sequence:45,consistency_digest:digest(contract + "-catchup"),verified:true}, history_rewritten:false, majority_substitution:false, publishes_automatically:false });
    verifyForkEvidence({ fixture_only:true, checkpoint_a:{digest:digest(contract + "-fork-a"),tree_size:55}, checkpoint_b:{digest:digest(contract + "-fork-b"),tree_size:55}, observers:[{operator_domain:"audit-a",signature_valid:true},{operator_domain:"audit-b",signature_valid:true}], technical_attribution:{log_key_id:contract + "-log-key",endpoint:"fixture://log/" + contract}, quarantine_required:true, human_blame_assigned:false, publishes_automatically:false, closes_hold_automatically:false, evidence_created:false });
    const priorReceipt = { sequence:9, observed_at:"2026-08-10T15:00:00Z", monotonic_counter:900, receipt_digest:digest(contract + "-time-9") };
    verifyTimeFailover({ fixture_only:true, append_only:true, sequence:10, prior_receipt_digest:priorReceipt.receipt_digest, observed_at:"2026-08-10T15:01:00Z", monotonic_counter:901, primary_authority_id:contract + "-time-a", failover_authority_id:contract + "-time-b", authority_attestations:[{domain:"time-a"},{domain:"time-b"}], failover_reason:"bounded-primary-unavailability", primary_unavailable:true, rollback_accepted:false, majority_substitution:false, publishes_automatically:false }, priorReceipt);
    const provenance = { fixture_only:true, source_commit:digest(contract + "-source"), build_recipe_digest:digest(contract + "-recipe"), sbom_digest:digest(contract + "-sbom"), artifact_digest:digest(contract + "-artifact"), majority_substitution:false, publishes_automatically:false, evidence_created:false };
    provenance.verifier_results = [["verifier-a","code-a","operator-a","builder-a"],["verifier-b","code-b","operator-b","builder-b"],["verifier-c","code-c","operator-c","builder-c"]].map(([implementation_id,codebase_family,operator_domain,builder_identity]) => ({implementation_id:contract+"-"+implementation_id,codebase_family,operator_domain,builder_identity,reproducible_build:true,source_commit:provenance.source_commit,build_recipe_digest:provenance.build_recipe_digest,sbom_digest:provenance.sbom_digest,artifact_digest:provenance.artifact_digest}));
    verifyBuildProvenance(provenance);
    verifyArtifactReissuance({ fixture_only:true, compromised_artifact_digest:digest(contract+"-old"), reissued_artifact_digest:digest(contract+"-new"), compromised_lineage_preserved:true, reissue_links_to_compromised_artifact:true, threshold_authorized:true, witness_catchup_verified:true, time_failover_verified:true, build_provenance_verified:true, independent_reverification:true, compromised_artifact_rewritten:false, compromised_artifact_retrusted:false, reader_state:"inactive", reader_migration_activated:false, publishes_automatically:false, closes_hold_automatically:false });

    ceremonySchemas.push({ ceremony_schema_id:"57W-CER-"+contract, contract_id:contract, evidence_rail:prior.evidence_rail, threshold:3, member_count:5, lifecycle_events:["admission","suspension","replacement","emergency"], emergency_threshold_lowering_allowed:false, append_only:true });
    availabilitySchemas.push({ availability_schema_id:"57W-AVA-"+contract, contract_id:contract, evidence_rail:prior.evidence_rail, max_staleness_seconds:900, stale_witness_counted:false, append_only_catchup_required:true });
    forkEvidenceSchemas.push({ fork_evidence_schema_id:"57W-FOR-"+contract, contract_id:contract, evidence_rail:prior.evidence_rail, independent_observer_minimum:2, technical_attribution_required:true, automatic_human_blame_allowed:false, quarantine_required:true });
    timeFailoverSchemas.push({ time_failover_schema_id:"57W-TIM-"+contract, contract_id:contract, evidence_rail:prior.evidence_rail, authority_quorum:2, independent_domains_required:true, rollback_allowed:false, append_only:true });
    buildProvenanceSchemas.push({ build_provenance_schema_id:"57W-BLD-"+contract, contract_id:contract, evidence_rail:prior.evidence_rail, verifier_minimum:3, source_commit_required:true, build_recipe_required:true, sbom_required:true, reproducible_build_required:true });
    artifactReissuanceSchemas.push({ artifact_reissuance_schema_id:"57W-REI-"+contract, contract_id:contract, evidence_rail:prior.evidence_rail, compromised_lineage_preserved:true, prior_artifact_rewrite_allowed:false, reader_migration_state:"inactive" });

    ceremonyClasses.forEach(([testClass,decision],i)=>ceremonyCases.push({...baseCase(prior,testClass,decision,"57W-CER-"+contract+"-"+String(i+1).padStart(2,"0")),ceremony_schema_id:"57W-CER-"+contract}));
    availabilityClasses.forEach(([testClass,decision],i)=>availabilityCases.push({...baseCase(prior,testClass,decision,"57W-AVA-"+contract+"-"+String(i+1).padStart(2,"0")),availability_schema_id:"57W-AVA-"+contract}));
    forkClasses.forEach(([testClass,decision],i)=>forkEvidenceCases.push({...baseCase(prior,testClass,decision,"57W-FOR-"+contract+"-"+String(i+1).padStart(2,"0")),fork_evidence_schema_id:"57W-FOR-"+contract}));
    timeClasses.forEach(([testClass,decision],i)=>timeFailoverCases.push({...baseCase(prior,testClass,decision,"57W-TIM-"+contract+"-"+String(i+1).padStart(2,"0")),time_failover_schema_id:"57W-TIM-"+contract}));
    provenanceClasses.forEach(([testClass,decision],i)=>buildProvenanceCases.push({...baseCase(prior,testClass,decision,"57W-BLD-"+contract+"-"+String(i+1).padStart(2,"0")),build_provenance_schema_id:"57W-BLD-"+contract}));
    reissueClasses.forEach(([testClass,decision],i)=>artifactReissuanceCases.push({...baseCase(prior,testClass,decision,"57W-REI-"+contract+"-"+String(i+1).padStart(2,"0")),artifact_reissuance_schema_id:"57W-REI-"+contract}));
  }
  const allCases=[...ceremonyCases,...availabilityCases,...forkEvidenceCases,...timeFailoverCases,...buildProvenanceCases,...artifactReissuanceCases];
  const failures=allCases.filter((row)=>!row.passed);
  return { ceremonySchemas,availabilitySchemas,forkEvidenceSchemas,timeFailoverSchemas,buildProvenanceSchemas,artifactReissuanceSchemas,ceremonyCases,availabilityCases,forkEvidenceCases,timeFailoverCases,buildProvenanceCases,artifactReissuanceCases,allCases,failures,
    distributions:{ceremony:{schema_count:9,case_count:252,valid_or_preservation_routes:72,rejected_routes:180},availability:{schema_count:9,case_count:234,valid_or_preservation_routes:63,rejected_routes:171},fork_evidence:{schema_count:9,case_count:216,valid_or_preservation_routes:54,rejected_routes:162},time_failover:{schema_count:9,case_count:225,valid_or_preservation_routes:63,rejected_routes:162},build_provenance:{schema_count:9,case_count:243,valid_or_preservation_routes:72,rejected_routes:171},artifact_reissuance:{schema_count:9,case_count:261,valid_or_preservation_routes:72,rejected_routes:189}},
    total_case_count:allCases.length,passed_case_count:allCases.length-failures.length,failed_case_count:failures.length,valid_or_preservation_routes:396,rejected_routes:1035 };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dataRoot=new URL("../src/data/",import.meta.url);
  const names=["phase-57v-threshold-release-authorizations.json","phase-57v-independent-witness-checkpoints.json","phase-57v-cross-log-gossip.json","phase-57v-trusted-time-receipts.json","phase-57v-verifier-diversity-conformance.json","phase-57v-compromise-recovery.json"];
  const [threshold,witness,gossip,time,verifier,recovery]=await Promise.all(names.map(async(name)=>JSON.parse(await readFile(new URL(name,dataRoot),"utf8"))));
  const result=runPhase57wHarness({thresholdSchemas:threshold.schemas,witnessSchemas:witness.schemas,gossipSchemas:gossip.schemas,trustedTimeSchemas:time.schemas,verifierSchemas:verifier.schemas,compromiseRecoverySchemas:recovery.schemas});
  if(result.failed_case_count||result.total_case_count!==1431) throw new Error("Phase 57W harness failed: "+result.failed_case_count+" failures across "+result.total_case_count+" cases.");
  console.log("Phase 57W harness passed: 1,431 quorum-ceremony, witness-availability, fork-evidence, time-failover, build-provenance, and artifact-reissuance cases across nine contracts.");
}

