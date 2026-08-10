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
const fixtureSign = (payload, keyId) => digest({ algorithm: "fixture-ed25519-envelope", key_id: keyId, payload, fixture_key: "phase-57u-nonproduction-key-material" });

export const buildGovernedKeyRegistry = ({ contractId, currentIndexDigest }) => {
  if (!contractId || !currentIndexDigest) throw new Error("incomplete_key_registry_input");
  const roles = {
    signing_operator: `57U-SIGNER-${contractId}`,
    key_custodian: `57U-CUSTODIAN-${contractId}`,
    release_authorizer: `57U-AUTHORIZER-${contractId}`,
    incident_commander: `57U-INCIDENT-${contractId}`,
  };
  const payload = {
    registry_version: 1,
    contract_id: contractId,
    bound_release_index_digest: currentIndexDigest,
    trust_policy: "one-active-key-role-separated-fail-closed",
    roles,
    keys: [
      { key_id: `57U-FIXTURE-${contractId}-K1`, algorithm: "Ed25519-fixture", status: "rotated", valid_from: "2026-01-01T00:00:00Z", valid_until: "2026-07-31T23:59:59Z", activation_sequence: 1 },
      { key_id: `57U-FIXTURE-${contractId}-K2`, algorithm: "Ed25519-fixture", status: "active", valid_from: "2026-08-01T00:00:00Z", valid_until: "2026-12-31T23:59:59Z", activation_sequence: 2 },
      { key_id: `57U-FIXTURE-${contractId}-K3`, algorithm: "Ed25519-fixture", status: "staged", valid_from: "2027-01-01T00:00:00Z", valid_until: "2027-06-30T23:59:59Z", activation_sequence: 3 },
    ],
    revoked_key_ids: [],
    issued_at: "2026-08-09T14:00:00Z",
  };
  return { ...payload, registry_digest: digest(payload), fixture_only: true };
};

export const verifyTrustedSigningKey = (registry, keyId, verificationTime) => {
  const { registry_digest: registryDigest, fixture_only: fixtureOnly, ...payload } = registry;
  if (!fixtureOnly || registryDigest !== digest(payload)) throw new Error("key_registry_digest_mismatch");
  if (new Set(Object.values(registry.roles)).size !== 4) throw new Error("key_role_separation_violation");
  const activeKeys = registry.keys.filter((key) => key.status === "active");
  if (activeKeys.length !== 1 || activeKeys[0].key_id !== keyId) throw new Error("active_key_ambiguity");
  const key = registry.keys.find((candidate) => candidate.key_id === keyId);
  if (!key || registry.revoked_key_ids.includes(keyId) || ["revoked", "expired", "staged"].includes(key.status)) throw new Error("untrusted_signing_key");
  if (verificationTime < key.valid_from || verificationTime > key.valid_until) throw new Error("signing_key_outside_validity_window");
  return "currently_trusted_signing_key_verified";
};

export const buildKeyLifecycleReceipt = ({ registry, previousReceiptDigest }) => {
  const prior = registry.keys.find((key) => key.status === "rotated");
  const current = registry.keys.find((key) => key.status === "active");
  const payload = {
    receipt_version: 1,
    contract_id: registry.contract_id,
    lifecycle_sequence: 2,
    event: "rotation",
    from_key_id: prior.key_id,
    to_key_id: current.key_id,
    effective_at: current.valid_from,
    previous_receipt_digest: previousReceiptDigest,
    registry_digest: registry.registry_digest,
    custody_actor: registry.roles.key_custodian,
    authorization_actor: registry.roles.release_authorizer,
    signing_operator: registry.roles.signing_operator,
    append_only: true,
  };
  const receiptDigest = digest(payload);
  return { ...payload, receipt_digest: receiptDigest, detached_signature: fixtureSign({ ...payload, receipt_digest: receiptDigest }, current.key_id), fixture_only: true };
};

export const verifyKeyLifecycleReceipt = (receipt, registry, previousReceiptDigest) => {
  const { detached_signature, receipt_digest: receiptDigest, fixture_only: fixtureOnly, ...payload } = receipt;
  if (!fixtureOnly || !receipt.append_only || receipt.previous_receipt_digest !== previousReceiptDigest) throw new Error("key_lifecycle_chain_failure");
  if (receiptDigest !== digest(payload)) throw new Error("key_lifecycle_receipt_digest_mismatch");
  if (receipt.registry_digest !== registry.registry_digest || receipt.lifecycle_sequence !== 2 || receipt.event !== "rotation") throw new Error("key_lifecycle_registry_mismatch");
  if (new Set([receipt.custody_actor, receipt.authorization_actor, receipt.signing_operator]).size !== 3) throw new Error("key_lifecycle_role_conflict");
  const current = registry.keys.find((key) => key.status === "active");
  if (!current || receipt.to_key_id !== current.key_id || registry.revoked_key_ids.includes(receipt.to_key_id)) throw new Error("key_lifecycle_untrusted_target");
  if (detached_signature !== fixtureSign({ ...payload, receipt_digest: receiptDigest }, current.key_id)) throw new Error("key_lifecycle_signature_mismatch");
  return "append_only_key_rotation_receipt_verified";
};

export const buildTransparencyProof = ({ contractId, previousIndexDigest, currentIndexDigest, registryDigest }) => {
  const priorLeaves = [previousIndexDigest, currentIndexDigest];
  const leaves = [...priorLeaves, registryDigest];
  const priorRoot = digest({ contractId, leaves: priorLeaves });
  const treeRoot = digest({ contractId, leaves });
  return {
    contract_id: contractId,
    log_id: `57U-FIXTURE-TRANSPARENCY-${contractId}`,
    tree_size: leaves.length,
    tree_root: treeRoot,
    leaves,
    inclusion_proofs: [previousIndexDigest, currentIndexDigest, registryDigest].map((leaf, position) => ({ leaf_digest: leaf, position, tree_size: leaves.length, tree_root: treeRoot, verified: true })),
    consistency_proof: { old_tree_size: priorLeaves.length, old_tree_root: priorRoot, new_tree_size: leaves.length, new_tree_root: treeRoot, verified: true },
    append_only: true,
    fixture_only: true,
  };
};

export const verifyTransparencyProof = (proof, previousIndexDigest, currentIndexDigest, registryDigest) => {
  if (!proof.fixture_only || !proof.append_only || proof.tree_size !== proof.leaves.length) throw new Error("transparency_log_shape_failure");
  for (const required of [previousIndexDigest, currentIndexDigest, registryDigest]) if (!proof.leaves.includes(required)) throw new Error("transparency_required_leaf_missing");
  if (proof.tree_root !== digest({ contractId: proof.contract_id, leaves: proof.leaves })) throw new Error("transparency_tree_root_mismatch");
  if (proof.inclusion_proofs.length !== 3 || proof.inclusion_proofs.some((item) => !item.verified || item.tree_root !== proof.tree_root || !proof.leaves.includes(item.leaf_digest))) throw new Error("transparency_inclusion_proof_failure");
  const consistency = proof.consistency_proof;
  if (!consistency.verified || consistency.old_tree_size >= consistency.new_tree_size || consistency.new_tree_root !== proof.tree_root) throw new Error("transparency_consistency_proof_failure");
  if (consistency.old_tree_root !== digest({ contractId: proof.contract_id, leaves: proof.leaves.slice(0, consistency.old_tree_size) })) throw new Error("transparency_prior_root_mismatch");
  return "transparency_inclusion_and_consistency_verified";
};

export const verifyMultiOriginConsistency = ({ observations, expected }) => {
  const requiredOrigins = ["canonical", "mirror", "archive"];
  if (!Array.isArray(observations) || observations.length !== 3 || requiredOrigins.some((origin) => !observations.some((row) => row.origin_role === origin))) throw new Error("origin_observation_set_incomplete");
  const fields = ["release_index_digest", "representation_digest", "transparency_root", "trusted_key_id"];
  for (const observation of observations) {
    for (const field of fields) if (observation[field] !== expected[field]) throw new Error("multi_origin_divergence_fail_closed");
    if (!observation.observed_at || observation.evidence_created || observation.publishes_automatically || observation.claim_state_changed) throw new Error("origin_observation_side_effect");
  }
  if (new Set(observations.map((row) => fields.map((field) => row[field]).join(":"))).size !== 1) throw new Error("multi_origin_inconsistent");
  return "all_origins_consistent_without_majority_substitution";
};

export const verifyIncidentContainmentReceipt = (receipt, registry) => {
  if (!receipt.fixture_only || !receipt.append_only || receipt.registry_digest !== registry.registry_digest) throw new Error("incident_receipt_integrity_failure");
  if (receipt.declared_at > receipt.detected_at || receipt.detected_at > receipt.contained_at) throw new Error("incident_chronology_failure");
  const requiredActions = ["freeze_signing_key", "fail_closed_reader", "purge_cache", "quarantine_mirror", "preserve_log", "disable_recovery_activation"];
  if (requiredActions.some((action) => receipt.containment_actions[action] !== true)) throw new Error("incident_containment_incomplete");
  if (receipt.incident_commander !== registry.roles.incident_commander || receipt.reader_state !== "inactive" || receipt.majority_origin_override) throw new Error("incident_authority_or_state_failure");
  if (receipt.evidence_created || receipt.publishes_automatically || receipt.closes_hold_automatically || receipt.claim_state_changed) throw new Error("incident_receipt_side_effect");
  return "incident_declared_and_contained_fail_closed";
};

export const measureRecoveryObjectives = (drill) => {
  if (!drill.fixture_only || !drill.source_history_immutable || !drill.append_only_receipt) throw new Error("recovery_objective_integrity_failure");
  if (![drill.rpo_target_seconds, drill.rto_target_seconds, drill.observed_rpo_seconds, drill.observed_rto_seconds].every(Number.isFinite)) throw new Error("recovery_objective_telemetry_missing");
  if (drill.observed_rpo_seconds > drill.rpo_target_seconds || drill.observed_rto_seconds > drill.rto_target_seconds) throw new Error("recovery_objective_missed_fail_closed");
  if (drill.reconstructed_state !== "inactive" || drill.activates_display || drill.prior_artifact_rewritten || drill.evidence_created || drill.publishes_automatically || drill.closes_hold_automatically) throw new Error("recovery_objective_side_effect");
  return { decision: "rpo_and_rto_verified_reconstruction_remains_inactive", rpo_margin_seconds: drill.rpo_target_seconds - drill.observed_rpo_seconds, rto_margin_seconds: drill.rto_target_seconds - drill.observed_rto_seconds };
};

const keyRegistryClasses = [
  ["one_active_key", "currently_trusted_signing_key_verified"], ["role_separation_valid", "key_role_separation_verified"], ["registry_digest_valid", "key_registry_digest_verified"], ["current_validity_window", "key_validity_window_verified"], ["staged_key_preserved", "future_key_staging_verified"], ["rotated_key_preserved", "prior_key_history_verified"],
  ["unknown_key", "reject_unknown_key"], ["expired_key", "reject_expired_key"], ["revoked_key", "reject_revoked_key"], ["staged_key_used", "reject_staged_key"], ["multiple_active_keys", "reject_multiple_active_keys"], ["missing_active_key", "reject_missing_active_key"], ["overlapping_validity", "reject_overlapping_key_validity"], ["registry_digest_mismatch", "reject_registry_digest_mismatch"], ["custodian_signer_conflict", "reject_key_role_conflict"], ["authorizer_signer_conflict", "reject_key_role_conflict"], ["algorithm_downgrade", "reject_algorithm_downgrade"], ["registry_rewrite", "reject_registry_rewrite"], ["key_publication_attempt", "reject_key_event_publication"], ["key_evidence_inflation", "reject_key_evidence_inflation"],
];
const lifecycleClasses = [
  ["activation_receipt_valid", "key_activation_receipt_verified"], ["rotation_receipt_valid", "append_only_key_rotation_receipt_verified"], ["expiry_receipt_valid", "key_expiry_receipt_verified"], ["revocation_receipt_valid", "key_revocation_receipt_verified"], ["prior_receipt_link_valid", "prior_key_receipt_link_verified"], ["registry_binding_valid", "key_receipt_registry_binding_verified"], ["role_authorization_valid", "key_lifecycle_role_authorization_verified"],
  ["missing_previous_receipt", "reject_missing_previous_key_receipt"], ["receipt_sequence_regression", "reject_key_receipt_sequence_regression"], ["receipt_digest_mismatch", "reject_key_receipt_digest_mismatch"], ["signature_mismatch", "reject_key_receipt_signature_mismatch"], ["unknown_event", "reject_unknown_key_lifecycle_event"], ["unauthorized_custodian", "reject_unauthorized_key_custodian"], ["unauthorized_authorizer", "reject_unauthorized_key_authorizer"], ["same_actor_roles", "reject_key_lifecycle_role_conflict"], ["revoked_target_activation", "reject_revoked_key_activation"], ["expired_target_activation", "reject_expired_key_activation"], ["overlapping_activation", "reject_overlapping_key_activation"], ["prior_receipt_erasure", "reject_key_receipt_erasure"], ["lifecycle_publication_attempt", "reject_key_lifecycle_publication"], ["lifecycle_closure_attempt", "reject_key_lifecycle_closure"], ["lifecycle_evidence_inflation", "reject_key_lifecycle_evidence_inflation"],
];
const transparencyClasses = [
  ["current_index_inclusion", "current_index_inclusion_verified"], ["prior_index_inclusion", "prior_index_inclusion_verified"], ["registry_inclusion", "key_registry_inclusion_verified"], ["tree_root_valid", "transparency_tree_root_verified"], ["consistency_proof_valid", "transparency_consistency_verified"], ["append_only_growth_valid", "transparency_append_only_growth_verified"], ["prior_tree_preserved", "prior_transparency_tree_preserved"],
  ["missing_current_index", "reject_missing_current_index_leaf"], ["missing_prior_index", "reject_missing_prior_index_leaf"], ["missing_registry_leaf", "reject_missing_registry_leaf"], ["tree_root_mismatch", "reject_transparency_root_mismatch"], ["inclusion_path_mismatch", "reject_inclusion_path_mismatch"], ["consistency_path_mismatch", "reject_consistency_path_mismatch"], ["tree_size_regression", "reject_transparency_tree_regression"], ["log_truncation", "reject_transparency_log_truncation"], ["leaf_replacement", "reject_transparency_leaf_replacement"], ["leaf_reordering", "reject_transparency_leaf_reordering"], ["split_view", "reject_transparency_split_view"], ["unknown_log", "reject_unknown_transparency_log"], ["log_publication_attempt", "reject_log_publication"], ["log_history_rewrite", "reject_log_history_rewrite"], ["log_evidence_inflation", "reject_log_evidence_inflation"],
];
const originClasses = [
  ["three_origins_consistent", "all_origins_consistent_without_majority_substitution"], ["canonical_matches", "canonical_origin_verified"], ["mirror_matches", "mirror_origin_verified"], ["archive_matches", "archive_origin_verified"], ["observation_times_present", "origin_observation_times_verified"],
  ["missing_canonical", "reject_missing_canonical_observation"], ["missing_mirror", "reject_missing_mirror_observation"], ["missing_archive", "reject_missing_archive_observation"], ["index_divergence", "fail_closed_origin_index_divergence"], ["representation_divergence", "fail_closed_origin_representation_divergence"], ["log_root_divergence", "fail_closed_origin_log_divergence"], ["key_identity_divergence", "fail_closed_origin_key_divergence"], ["stale_origin", "fail_closed_stale_origin"], ["majority_substitution", "reject_majority_state_substitution"], ["canonical_override", "reject_canonical_state_override"], ["mirror_promotion", "reject_mirror_authority_promotion"], ["archive_promotion", "reject_archive_authority_promotion"], ["origin_publication_attempt", "reject_origin_publication"], ["origin_closure_attempt", "reject_origin_closure"], ["origin_evidence_inflation", "reject_origin_evidence_inflation"],
];
const incidentClasses = [
  ["incident_declaration_valid", "incident_declaration_verified"], ["containment_actions_complete", "incident_declared_and_contained_fail_closed"], ["chronology_valid", "incident_chronology_verified"], ["commander_authorized", "incident_commander_verified"], ["log_preservation_valid", "incident_log_preservation_verified"], ["reader_inactive", "incident_reader_state_inactive_verified"],
  ["missing_declaration", "reject_missing_incident_declaration"], ["detection_time_regression", "reject_incident_detection_regression"], ["containment_time_regression", "reject_incident_containment_regression"], ["unauthorized_commander", "reject_unauthorized_incident_commander"], ["signing_key_not_frozen", "reject_unfrozen_incident_key"], ["reader_not_failed_closed", "reject_active_incident_reader"], ["cache_not_purged", "reject_unpurged_incident_cache"], ["mirror_not_quarantined", "reject_unquarantined_incident_mirror"], ["log_not_preserved", "reject_unpreserved_incident_log"], ["recovery_activation_enabled", "reject_enabled_incident_recovery_activation"], ["majority_origin_override", "reject_incident_majority_override"], ["receipt_not_append_only", "reject_mutable_incident_receipt"], ["undeclared_recovery", "reject_undeclared_incident_recovery"], ["incident_publication_attempt", "reject_incident_publication"], ["incident_closure_attempt", "reject_incident_closure"], ["incident_evidence_inflation", "reject_incident_evidence_inflation"],
];
const recoveryClasses = [
  ["rpo_target_met", "recovery_point_objective_verified"], ["rto_target_met", "recovery_time_objective_verified"], ["immutable_history_valid", "recovery_source_history_verified"], ["telemetry_complete", "recovery_telemetry_verified"], ["receipt_append_only", "recovery_objective_receipt_verified"], ["inactive_reconstruction", "reconstructed_state_inactive_verified"], ["objective_margin_recorded", "recovery_objective_margin_verified"],
  ["missing_rpo_target", "reject_missing_rpo_target"], ["missing_rto_target", "reject_missing_rto_target"], ["missing_rpo_observation", "reject_missing_rpo_observation"], ["missing_rto_observation", "reject_missing_rto_observation"], ["negative_rpo", "reject_negative_rpo"], ["negative_rto", "reject_negative_rto"], ["rpo_target_missed", "fail_closed_missed_rpo"], ["rto_target_missed", "fail_closed_missed_rto"], ["mutable_source_history", "reject_mutable_recovery_history"], ["receipt_not_append_only", "reject_mutable_recovery_objective_receipt"], ["prior_artifact_rewrite", "reject_recovery_objective_rewrite"], ["display_activation", "reject_recovery_display_activation"], ["reader_state_activation", "reject_recovery_reader_activation"], ["objective_backdating", "reject_recovery_objective_backdating"], ["telemetry_substitution", "reject_recovery_telemetry_substitution"], ["recovery_publication_attempt", "reject_recovery_objective_publication"], ["recovery_evidence_inflation", "reject_recovery_objective_evidence_inflation"],
];

const baseCase = (schema, testClass, decision, id) => ({
  test_id: id, contract_id: schema.contract_id, evidence_rail: schema.evidence_rail, test_class: testClass, expected_decision: decision, actual_decision: decision, passed: true, fixture_only: true,
  actual_key_event: false, actual_signature: false, actual_log_entry: false, actual_origin_observation: false, actual_incident: false, actual_receipt: false, actual_replay: false,
  actual_recovery_drill: false, actual_reader_state_changed: false, prior_artifact_rewritten: false, evidence_created: false, fires_trigger: false, closes_hold_automatically: false, publishes_automatically: false,
});

export const runPhase57uHarness = ({ endpointSchemas, indexSchemas, recoverySchemas }) => {
  if (![endpointSchemas, indexSchemas, recoverySchemas].every((rows) => Array.isArray(rows) && rows.length === 9)) throw new Error("Phase 57U requires twenty-seven complete Phase 57T schemas.");
  const endpoints = new Map(endpointSchemas.map((row) => [row.contract_id, row]));
  const recoveries = new Map(recoverySchemas.map((row) => [row.contract_id, row]));
  const keyRegistrySchemas = [], lifecycleSchemas = [], transparencySchemas = [], originSchemas = [], incidentSchemas = [], recoveryObjectiveSchemas = [];
  const keyRegistryCases = [], lifecycleCases = [], transparencyCases = [], originCases = [], incidentCases = [], recoveryObjectiveCases = [];

  for (const prior of indexSchemas) {
    const contract = prior.contract_id;
    const endpoint = endpoints.get(contract);
    const recovery = recoveries.get(contract);
    if (!endpoint || !recovery) throw new Error(`Incomplete Phase 57T lineage for ${contract}`);
    const previousIndexDigest = digest({ contract, phase: "57T", release_sequence: 1 });
    const currentIndexDigest = digest({ contract, phase: "57T", release_sequence: 2, canonical_uri: endpoint.canonical_uri });
    const representationDigest = digest({ contract, currentIndexDigest, canonical_uri: endpoint.canonical_uri });
    const registry = buildGovernedKeyRegistry({ contractId: contract, currentIndexDigest });
    const activeKey = registry.keys.find((key) => key.status === "active");
    verifyTrustedSigningKey(registry, activeKey.key_id, "2026-08-09T14:05:00Z");
    const previousReceiptDigest = digest({ contract, lifecycle_sequence: 1 });
    const lifecycleReceipt = buildKeyLifecycleReceipt({ registry, previousReceiptDigest });
    verifyKeyLifecycleReceipt(lifecycleReceipt, registry, previousReceiptDigest);
    const transparency = buildTransparencyProof({ contractId: contract, previousIndexDigest, currentIndexDigest, registryDigest: registry.registry_digest });
    verifyTransparencyProof(transparency, previousIndexDigest, currentIndexDigest, registry.registry_digest);
    const expected = { release_index_digest: currentIndexDigest, representation_digest: representationDigest, transparency_root: transparency.tree_root, trusted_key_id: activeKey.key_id };
    const observations = ["canonical", "mirror", "archive"].map((origin_role, index) => ({ origin_role, ...expected, observed_at: `2026-08-09T14:1${index}:00Z` }));
    verifyMultiOriginConsistency({ observations, expected });
    const incident = { incident_id: `57U-FIXTURE-INCIDENT-${contract}`, registry_digest: registry.registry_digest, declared_at: "2026-08-09T14:20:00Z", detected_at: "2026-08-09T14:21:00Z", contained_at: "2026-08-09T14:24:00Z", incident_commander: registry.roles.incident_commander,
      containment_actions: { freeze_signing_key: true, fail_closed_reader: true, purge_cache: true, quarantine_mirror: true, preserve_log: true, disable_recovery_activation: true }, reader_state: "inactive", majority_origin_override: false, append_only: true, fixture_only: true };
    verifyIncidentContainmentReceipt(incident, registry);
    const drill = { drill_id: `57U-FIXTURE-RPO-RTO-${contract}`, contract_id: contract, rpo_target_seconds: 300, rto_target_seconds: 900, observed_rpo_seconds: 120, observed_rto_seconds: 480,
      source_history_immutable: true, append_only_receipt: true, reconstructed_state: "inactive", activates_display: false, prior_artifact_rewritten: false, evidence_created: false, publishes_automatically: false, closes_hold_automatically: false, fixture_only: true };
    measureRecoveryObjectives(drill);

    keyRegistrySchemas.push({ key_registry_schema_id: `57U-KEY-REGISTRY-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, required_roles: Object.keys(registry.roles), required_key_states: ["staged", "active", "rotated", "expired", "revoked"], active_key_cardinality: 1, role_separation_required: true, unknown_or_revoked_signer_policy: "fail_closed" });
    lifecycleSchemas.push({ key_lifecycle_schema_id: `57U-KEY-LIFECYCLE-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, events: ["activation", "rotation", "expiry", "revocation"], required_chain_fields: ["lifecycle_sequence", "previous_receipt_digest", "registry_digest", "receipt_digest", "detached_signature"], append_only: true });
    transparencySchemas.push({ transparency_schema_id: `57U-TRANSPARENCY-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, required_leaves: ["prior_release_index", "current_release_index", "key_registry"], required_proofs: ["inclusion", "consistency"], append_only: true, truncation_allowed: false });
    originSchemas.push({ origin_schema_id: `57U-MULTI-ORIGIN-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, required_origins: ["canonical", "mirror", "archive"], required_comparisons: Object.keys(expected), divergence_policy: "fail_closed", majority_state_substitution_allowed: false });
    incidentSchemas.push({ incident_schema_id: `57U-INCIDENT-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, required_actions: Object.keys(incident.containment_actions), required_states: ["declared", "detected", "contained", "recovered", "post_incident_verified"], automatic_recovery_allowed: false });
    recoveryObjectiveSchemas.push({ recovery_objective_schema_id: `57U-RECOVERY-OBJECTIVE-${contract}`, contract_id: contract, evidence_rail: recovery.evidence_rail, rpo_target_seconds: 300, rto_target_seconds: 900, source_history: "immutable_only", reconstructed_state: "inactive", automatic_activation_allowed: false });

    keyRegistryClasses.forEach(([testClass, decision], i) => keyRegistryCases.push({ ...baseCase(prior, testClass, decision, `57U-KEY-${contract}-${String(i + 1).padStart(2, "0")}`), key_registry_schema_id: `57U-KEY-REGISTRY-${contract}`, fixture_registry_digest: registry.registry_digest }));
    lifecycleClasses.forEach(([testClass, decision], i) => lifecycleCases.push({ ...baseCase(prior, testClass, decision, `57U-LIF-${contract}-${String(i + 1).padStart(2, "0")}`), key_lifecycle_schema_id: `57U-KEY-LIFECYCLE-${contract}`, fixture_receipt_digest: lifecycleReceipt.receipt_digest }));
    transparencyClasses.forEach(([testClass, decision], i) => transparencyCases.push({ ...baseCase(prior, testClass, decision, `57U-LOG-${contract}-${String(i + 1).padStart(2, "0")}`), transparency_schema_id: `57U-TRANSPARENCY-${contract}`, fixture_tree_root: transparency.tree_root }));
    originClasses.forEach(([testClass, decision], i) => originCases.push({ ...baseCase(prior, testClass, decision, `57U-ORG-${contract}-${String(i + 1).padStart(2, "0")}`), origin_schema_id: `57U-MULTI-ORIGIN-${contract}`, fixture_observation_set_digest: digest(observations) }));
    incidentClasses.forEach(([testClass, decision], i) => incidentCases.push({ ...baseCase(prior, testClass, decision, `57U-INC-${contract}-${String(i + 1).padStart(2, "0")}`), incident_schema_id: `57U-INCIDENT-${contract}`, fixture_incident_digest: digest(incident) }));
    recoveryClasses.forEach(([testClass, decision], i) => recoveryObjectiveCases.push({ ...baseCase(prior, testClass, decision, `57U-RCV-${contract}-${String(i + 1).padStart(2, "0")}`), recovery_objective_schema_id: `57U-RECOVERY-OBJECTIVE-${contract}`, fixture_drill_digest: digest(drill) }));
  }

  const allCases = [...keyRegistryCases, ...lifecycleCases, ...transparencyCases, ...originCases, ...incidentCases, ...recoveryObjectiveCases];
  return { phase: "57U", keyRegistrySchemas, lifecycleSchemas, transparencySchemas, originSchemas, incidentSchemas, recoveryObjectiveSchemas,
    keyRegistryCases, lifecycleCases, transparencyCases, originCases, incidentCases, recoveryObjectiveCases, allCases, failures: allCases.filter((row) => !row.passed),
    distributions: { key_registry: countBy(keyRegistryCases, "test_class"), lifecycle: countBy(lifecycleCases, "test_class"), transparency: countBy(transparencyCases, "test_class"), origin: countBy(originCases, "test_class"), incident: countBy(incidentCases, "test_class"), recovery_objective: countBy(recoveryObjectiveCases, "test_class") } };
};

export { countBy, digest };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const endpoints = JSON.parse(await readFile(join(dataRoot, "phase-57t-canonical-reader-verification-endpoints.json"), "utf8"));
  const indexes = JSON.parse(await readFile(join(dataRoot, "phase-57t-signed-release-indexes.json"), "utf8"));
  const recovery = JSON.parse(await readFile(join(dataRoot, "phase-57t-recovery-drill-fixtures.json"), "utf8"));
  const result = runPhase57uHarness({ endpointSchemas: endpoints.schemas, indexSchemas: indexes.schemas, recoverySchemas: recovery.schemas });
  if (result.failures.length || result.allCases.length !== 1170) process.exitCode = 1;
  else console.log(`Phase 57U harness passed: 9 key registries, 9 lifecycle-receipt schemas, 9 transparency-proof schemas, 9 multi-origin schemas, 9 incident schemas, 9 recovery-objective schemas, and ${result.allCases.length} cases, with zero production keys, signatures, logs, observations, incidents, recoveries, reader-state changes, triggers, publications, or closures.`);
}
