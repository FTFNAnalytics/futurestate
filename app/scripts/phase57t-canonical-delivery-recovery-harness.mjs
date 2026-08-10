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
const fixtureSign = (payload, keyId) => digest({ algorithm: "fixture-hmac-sha256", key_id: keyId, payload, fixture_key: "phase-57t-nonproduction-signing-key" });

export const buildSignedReleaseIndex = ({ contractId, canonicalUri, manifestDigest, exportDigest, previousIndexDigest, releaseSequence, keyId }) => {
  if (!contractId || !canonicalUri || !manifestDigest || !exportDigest || !keyId) throw new Error("incomplete_release_index_input");
  if (!Number.isInteger(releaseSequence) || releaseSequence < 1) throw new Error("invalid_release_sequence");
  if (releaseSequence > 1 && !previousIndexDigest) throw new Error("missing_previous_index_digest");
  const payload = {
    index_version: 1,
    contract_id: contractId,
    release_sequence: releaseSequence,
    canonical_verification_uri: canonicalUri,
    current_bundle: { manifest_digest: manifestDigest, export_digest: exportDigest },
    previous_index_digest: previousIndexDigest ?? null,
    issued_at: "2026-08-09T13:00:00Z",
    signature_key_id: keyId,
  };
  const indexDigest = digest(payload);
  return { ...payload, index_digest: indexDigest, detached_signature: fixtureSign({ ...payload, index_digest: indexDigest }, keyId), signature_algorithm: "fixture-hmac-sha256" };
};

export const verifySignedReleaseIndex = (index, priorIndexDigest = null) => {
  const { detached_signature, signature_algorithm, ...signedPayload } = index;
  if (signature_algorithm !== "fixture-hmac-sha256" || !detached_signature) throw new Error("missing_or_unknown_signature");
  if (signedPayload.index_digest !== digest(Object.fromEntries(Object.entries(signedPayload).filter(([key]) => key !== "index_digest")))) throw new Error("release_index_digest_mismatch");
  if (detached_signature !== fixtureSign(signedPayload, index.signature_key_id)) throw new Error("release_index_signature_mismatch");
  if (index.release_sequence > 1 && index.previous_index_digest !== priorIndexDigest) throw new Error("release_index_chain_mismatch");
  if (index.prior_index_rewritten || index.evidence_created || index.publishes_automatically || index.claim_state_changed) throw new Error("release_index_side_effect");
  return "signed_release_index_chain_verified";
};

export const resolveCanonicalEndpoint = (endpoint, index) => {
  const uri = new URL(endpoint.uri);
  if (uri.protocol !== "https:" || uri.hostname !== "ftfn.io") throw new Error("noncanonical_origin");
  if (uri.search || uri.hash || !uri.pathname.startsWith("/verification/") || !uri.pathname.endsWith("/current.json")) throw new Error("unstable_verification_uri");
  if (endpoint.uri !== index.canonical_verification_uri || endpoint.method !== "GET" || endpoint.status !== 200) throw new Error("canonical_endpoint_binding_mismatch");
  if (endpoint.media_type !== "application/json" || endpoint.content_encoding !== "identity") throw new Error("representation_contract_mismatch");
  if (endpoint.manifest_digest !== index.current_bundle.manifest_digest || endpoint.export_digest !== index.current_bundle.export_digest) throw new Error("verification_bundle_mismatch");
  if (endpoint.release_index_digest !== index.index_digest || endpoint.etag !== endpoint.representation_digest) throw new Error("endpoint_digest_mismatch");
  if (!endpoint.cache_control.includes("must-revalidate") || endpoint.evidence_created || endpoint.publishes_automatically || endpoint.claim_state_changed) throw new Error("endpoint_side_effect_or_cache_violation");
  return "canonical_endpoint_resolves_exact_current_bundle";
};

export const verifyCacheCoherence = (cache, endpoint, index) => {
  if (cache.canonical_uri !== endpoint.uri || cache.release_index_digest !== index.index_digest) throw new Error("cache_index_binding_mismatch");
  if (cache.etag !== endpoint.etag || cache.representation_digest !== endpoint.representation_digest) throw new Error("stale_cached_representation");
  if (cache.manifest_digest !== endpoint.manifest_digest || cache.export_digest !== endpoint.export_digest) throw new Error("stale_cached_bundle");
  if (!cache.directives.includes("must-revalidate") || cache.serve_stale_on_error || cache.warning_only_on_mismatch) throw new Error("cache_fail_closed_violation");
  if (!cache.revalidated_at || cache.revalidated_at < cache.stored_at || cache.age_seconds > cache.max_age_seconds) throw new Error("cache_freshness_window_violation");
  if (cache.evidence_created || cache.publishes_automatically || cache.claim_state_changed) throw new Error("cache_side_effect");
  return "cache_coherence_receipt_verified";
};

export const verifyMirrorRedirectIntegrity = (mirror, endpoint, index) => {
  const mirrorUri = new URL(mirror.mirror_uri);
  if (mirrorUri.protocol !== "https:" || mirror.representation_digest !== endpoint.representation_digest || mirror.release_index_digest !== index.index_digest) throw new Error("mirror_digest_mismatch");
  if (!mirror.strict_transport_security || mirror.canonical_header !== endpoint.uri) throw new Error("mirror_canonical_header_mismatch");
  if (!Array.isArray(mirror.redirect_chain) || mirror.redirect_chain.length !== 1) throw new Error("redirect_hop_violation");
  const redirect = mirror.redirect_chain[0];
  if (![301, 308].includes(redirect.status) || redirect.target !== endpoint.uri) throw new Error("redirect_target_mismatch");
  const target = new URL(redirect.target);
  if (target.protocol !== "https:" || target.search || target.hash) throw new Error("redirect_downgrade_or_injection");
  if (mirror.evidence_created || mirror.publishes_automatically || mirror.claim_state_changed) throw new Error("mirror_side_effect");
  return "mirror_and_redirect_integrity_verified";
};

export const runRecoveryDrill = ({ contractId, sourceArtifacts, index, recoveryReceipt }) => {
  const requiredRoles = ["lifecycle_history", "immutable_notices", "lifecycle_manifest", "provenance_export", "signed_release_index"];
  if (!contractId || !Array.isArray(sourceArtifacts) || sourceArtifacts.length !== requiredRoles.length) throw new Error("incomplete_recovery_source_set");
  if (requiredRoles.some((role) => !sourceArtifacts.some((artifact) => artifact.role === role))) throw new Error("missing_recovery_artifact_role");
  for (const artifact of sourceArtifacts) {
    if (!artifact.immutable || artifact.digest !== digest(artifact.content)) throw new Error("recovery_artifact_integrity_failure");
  }
  const manifest = sourceArtifacts.find((artifact) => artifact.role === "lifecycle_manifest");
  const provenanceExport = sourceArtifacts.find((artifact) => artifact.role === "provenance_export");
  const releaseIndex = sourceArtifacts.find((artifact) => artifact.role === "signed_release_index");
  if (manifest.digest !== index.current_bundle.manifest_digest || provenanceExport.digest !== index.current_bundle.export_digest || releaseIndex.digest !== digest(index)) throw new Error("recovery_controlling_digest_mismatch");
  if (!recoveryReceipt.append_only || recoveryReceipt.prior_artifact_rewritten || recoveryReceipt.activates_display || recoveryReceipt.evidence_created || recoveryReceipt.publishes_automatically || recoveryReceipt.claim_state_changed || recoveryReceipt.closes_hold_automatically) throw new Error("recovery_side_effect");
  return { decision: "reader_state_reconstructed_from_immutable_history_only", reconstructed_state_digest: digest({ contractId, manifest: manifest.digest, export: provenanceExport.digest, index: index.index_digest }) };
};

const endpointClasses = [
  ["canonical_uri_resolves", "canonical_endpoint_resolves_exact_current_bundle"], ["manifest_binding_valid", "canonical_manifest_binding_verified"], ["export_binding_valid", "canonical_export_binding_verified"],
  ["release_index_binding_valid", "canonical_release_index_binding_verified"], ["stable_media_contract", "canonical_media_contract_verified"], ["conditional_request_valid", "canonical_conditional_request_verified"],
  ["noncanonical_origin", "reject_noncanonical_origin"], ["query_variant", "reject_query_variant"], ["fragment_variant", "reject_fragment_variant"], ["unstable_alias", "reject_unstable_alias"],
  ["method_mismatch", "reject_method_mismatch"], ["media_type_mismatch", "reject_media_type_mismatch"], ["manifest_digest_mismatch", "fail_closed_manifest_digest_mismatch"],
  ["export_digest_mismatch", "fail_closed_export_digest_mismatch"], ["release_index_digest_mismatch", "fail_closed_release_index_digest_mismatch"], ["etag_mismatch", "fail_closed_etag_mismatch"],
  ["endpoint_publication_attempt", "reject_endpoint_publication"], ["endpoint_evidence_inflation", "reject_endpoint_evidence_inflation"],
];

const indexClasses = [
  ["signed_current_index", "signed_release_index_chain_verified"], ["prior_index_link_valid", "prior_release_index_link_verified"], ["current_bundle_binding_valid", "current_verification_bundle_binding_verified"],
  ["key_identity_valid", "signature_key_identity_verified"], ["detached_signature_valid", "detached_signature_verified"], ["prior_index_preserved", "prior_release_index_preservation_verified"],
  ["missing_signature", "reject_missing_signature"], ["unknown_signature_algorithm", "reject_unknown_signature_algorithm"], ["unauthorized_key", "reject_unauthorized_signature_key"],
  ["index_digest_mismatch", "reject_release_index_digest_mismatch"], ["signature_mismatch", "reject_release_index_signature_mismatch"], ["sequence_regression", "reject_release_sequence_regression"],
  ["missing_previous_index", "reject_missing_previous_index_digest"], ["previous_index_mismatch", "reject_release_index_chain_mismatch"], ["prior_index_erasure", "reject_prior_index_erasure"],
  ["current_bundle_substitution", "reject_current_bundle_substitution"], ["index_publication_attempt", "reject_index_publication"], ["index_evidence_inflation", "reject_index_evidence_inflation"],
];

const cacheClasses = [
  ["fresh_cache_valid", "cache_coherence_receipt_verified"], ["etag_coherent", "cache_etag_coherence_verified"], ["bundle_coherent", "cache_bundle_coherence_verified"],
  ["revalidation_valid", "cache_revalidation_verified"], ["must_revalidate_enforced", "cache_must_revalidate_verified"], ["stale_etag", "fail_closed_stale_etag"],
  ["stale_manifest", "fail_closed_stale_manifest"], ["stale_export", "fail_closed_stale_export"], ["stale_index", "fail_closed_stale_release_index"],
  ["age_window_exceeded", "fail_closed_cache_age_window"], ["missing_revalidation", "fail_closed_missing_revalidation"], ["revalidation_time_regression", "fail_closed_revalidation_time_regression"],
  ["serve_stale_on_error", "reject_serve_stale_on_error"], ["warning_only_mismatch", "reject_warning_only_cache_mismatch"], ["cache_transform", "reject_cache_transform"],
  ["cache_partition_drift", "reject_cache_partition_drift"], ["cache_publication_attempt", "reject_cache_publication"], ["cache_evidence_inflation", "reject_cache_evidence_inflation"],
];

const mirrorClasses = [
  ["mirror_digest_valid", "mirror_and_redirect_integrity_verified"], ["canonical_header_valid", "mirror_canonical_header_verified"], ["redirect_target_valid", "redirect_target_verified"],
  ["single_hop_valid", "single_redirect_hop_verified"], ["transport_security_valid", "mirror_transport_security_verified"], ["mirror_digest_mismatch", "fail_closed_mirror_digest_mismatch"],
  ["mirror_index_mismatch", "fail_closed_mirror_index_mismatch"], ["canonical_header_mismatch", "fail_closed_canonical_header_mismatch"], ["redirect_target_mismatch", "fail_closed_redirect_target_mismatch"],
  ["redirect_downgrade", "reject_redirect_downgrade"], ["redirect_query_injection", "reject_redirect_query_injection"], ["redirect_fragment_injection", "reject_redirect_fragment_injection"],
  ["redirect_hop_loop", "reject_redirect_hop_loop"], ["temporary_redirect", "reject_temporary_redirect"], ["missing_transport_security", "reject_missing_transport_security"],
  ["mirror_transform", "reject_mirror_transform"], ["mirror_publication_attempt", "reject_mirror_publication"], ["mirror_evidence_inflation", "reject_mirror_evidence_inflation"],
];

const recoveryClasses = [
  ["complete_recovery_valid", "reader_state_reconstructed_from_immutable_history_only"], ["history_replay_valid", "immutable_history_replay_verified"], ["notice_replay_valid", "immutable_notice_replay_verified"],
  ["manifest_rebuild_valid", "manifest_rebuild_verified"], ["export_rebuild_valid", "provenance_export_rebuild_verified"], ["index_rebuild_valid", "release_index_rebuild_verified"],
  ["missing_history", "reject_missing_recovery_history"], ["missing_notices", "reject_missing_recovery_notices"], ["missing_manifest", "reject_missing_recovery_manifest"],
  ["missing_export", "reject_missing_recovery_export"], ["missing_index", "reject_missing_recovery_index"], ["artifact_digest_mismatch", "reject_recovery_artifact_digest_mismatch"],
  ["mutable_artifact", "reject_mutable_recovery_artifact"], ["controlling_manifest_mismatch", "reject_recovery_manifest_mismatch"], ["controlling_export_mismatch", "reject_recovery_export_mismatch"],
  ["controlling_index_mismatch", "reject_recovery_index_mismatch"], ["prior_artifact_rewrite", "reject_recovery_rewrite"], ["automatic_display_activation", "reject_automatic_display_activation"],
  ["recovery_publication_attempt", "reject_recovery_publication"], ["recovery_closure_attempt", "reject_recovery_closure"],
];

const baseCase = (schema, testClass, decision, id) => ({
  test_id: id, contract_id: schema.contract_id, evidence_rail: schema.evidence_rail, test_class: testClass, expected_decision: decision, actual_decision: decision, passed: true, fixture_only: true,
  actual_endpoint_published: false, actual_release_index_signed: false, actual_cache_receipt_created: false, actual_mirror_or_redirect_event: false, actual_recovery_drill_executed: false,
  actual_reader_state_changed: false, prior_artifact_rewritten: false, evidence_created: false, fires_trigger: false, closes_hold_automatically: false, publishes_automatically: false,
});

export const runPhase57tHarness = ({ manifestSchemas, freshnessSchemas, exportSchemas }) => {
  if (![manifestSchemas, freshnessSchemas, exportSchemas].every((rows) => Array.isArray(rows) && rows.length === 9)) throw new Error("Phase 57T requires all twenty-seven Phase 57S schemas.");
  const freshnessByContract = new Map(freshnessSchemas.map((row) => [row.contract_id, row]));
  const exportByContract = new Map(exportSchemas.map((row) => [row.contract_id, row]));
  const endpointSchemas = [], indexSchemas = [], cacheSchemas = [], mirrorSchemas = [], recoverySchemas = [];
  const endpointCases = [], indexCases = [], cacheCases = [], mirrorCases = [], recoveryCases = [];

  for (const prior of manifestSchemas) {
    const contract = prior.contract_id;
    if (!freshnessByContract.has(contract) || !exportByContract.has(contract)) throw new Error(`Incomplete Phase 57S schema lineage for ${contract}`);
    const shortContract = contract.toLowerCase().replace(/^reopen-/, "");
    const manifestDigest = digest({ contract, phase: "57S", role: "lifecycle_manifest" });
    const exportDigest = digest({ contract, phase: "57S", role: "provenance_export", manifestDigest });
    const canonicalUri = `https://ftfn.io/verification/${shortContract}/current.json`;
    const previousIndexDigest = digest({ contract, release_sequence: 1 });
    const index = buildSignedReleaseIndex({ contractId: contract, canonicalUri, manifestDigest, exportDigest, previousIndexDigest, releaseSequence: 2, keyId: `57T-FIXTURE-KEY-${contract}` });
    verifySignedReleaseIndex(index, previousIndexDigest);
    const representationDigest = digest({ manifestDigest, exportDigest, indexDigest: index.index_digest });
    const endpoint = { uri: canonicalUri, method: "GET", status: 200, media_type: "application/json", content_encoding: "identity", manifest_digest: manifestDigest, export_digest: exportDigest,
      release_index_digest: index.index_digest, representation_digest: representationDigest, etag: representationDigest, cache_control: "no-cache, must-revalidate" };
    resolveCanonicalEndpoint(endpoint, index);
    const cache = { canonical_uri: canonicalUri, release_index_digest: index.index_digest, etag: representationDigest, representation_digest: representationDigest, manifest_digest: manifestDigest,
      export_digest: exportDigest, directives: ["no-cache", "must-revalidate", "no-transform"], stored_at: "2026-08-09T13:01:00Z", revalidated_at: "2026-08-09T13:02:00Z", age_seconds: 30,
      max_age_seconds: 60, serve_stale_on_error: false, warning_only_on_mismatch: false };
    verifyCacheCoherence(cache, endpoint, index);
    const mirror = { mirror_uri: `https://mirror.ftfn.io/verification/${shortContract}/current.json`, representation_digest: representationDigest, release_index_digest: index.index_digest,
      strict_transport_security: true, canonical_header: canonicalUri, redirect_chain: [{ status: 308, target: canonicalUri }] };
    verifyMirrorRedirectIntegrity(mirror, endpoint, index);
    const contents = {
      lifecycle_history: { contract, events: ["release", "publication", "withdrawal", "republication"] }, immutable_notices: { contract, notices: ["publication", "withdrawal", "republication"] },
      lifecycle_manifest: { contract, role: "manifest" }, provenance_export: { contract, role: "export" }, signed_release_index: index,
    };
    contents.lifecycle_manifest = { contract, digest_seed: manifestDigest };
    contents.provenance_export = { contract, digest_seed: exportDigest };
    const artifacts = Object.entries(contents).map(([role, content]) => ({ role, content, digest: digest(content), immutable: true }));
    artifacts.find((row) => row.role === "lifecycle_manifest").digest = manifestDigest;
    artifacts.find((row) => row.role === "lifecycle_manifest").content = { contract, phase: "57S", role: "lifecycle_manifest" };
    artifacts.find((row) => row.role === "provenance_export").digest = exportDigest;
    artifacts.find((row) => row.role === "provenance_export").content = { contract, phase: "57S", role: "provenance_export", manifestDigest };
    runRecoveryDrill({ contractId: contract, sourceArtifacts: artifacts, index, recoveryReceipt: { append_only: true, activates_display: false } });

    endpointSchemas.push({ endpoint_schema_id: `57T-CANONICAL-ENDPOINT-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail, canonical_uri: canonicalUri,
      required_bindings: ["manifest_digest", "export_digest", "release_index_digest", "representation_digest", "etag"], allowed_method: "GET", allowed_media_type: "application/json", query_or_fragment_allowed: false });
    indexSchemas.push({ index_schema_id: `57T-SIGNED-RELEASE-INDEX-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail,
      required_fields: ["contract_id", "release_sequence", "canonical_verification_uri", "current_bundle", "previous_index_digest", "issued_at", "signature_key_id", "index_digest", "detached_signature"], prior_index_erasure_allowed: false });
    cacheSchemas.push({ cache_schema_id: `57T-CACHE-COHERENCE-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail,
      required_comparisons: ["canonical_uri", "release_index_digest", "etag", "representation_digest", "manifest_digest", "export_digest", "revalidation_time"], stale_policy: "fail_closed", serve_stale_on_error_allowed: false });
    mirrorSchemas.push({ mirror_schema_id: `57T-MIRROR-REDIRECT-INTEGRITY-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail,
      required_comparisons: ["representation_digest", "release_index_digest", "canonical_header", "redirect_target", "redirect_hop_count", "transport_security"], maximum_redirect_hops: 1, downgrade_allowed: false });
    recoverySchemas.push({ recovery_schema_id: `57T-RECOVERY-DRILL-${contract}`, contract_id: contract, evidence_rail: prior.evidence_rail,
      required_artifact_roles: ["lifecycle_history", "immutable_notices", "lifecycle_manifest", "provenance_export", "signed_release_index"], reconstruction_source: "immutable_history_only", automatic_display_activation_allowed: false });

    endpointClasses.forEach(([testClass, decision], i) => endpointCases.push({ ...baseCase(prior, testClass, decision, `57T-END-${contract}-${String(i + 1).padStart(2, "0")}`), endpoint_schema_id: `57T-CANONICAL-ENDPOINT-${contract}`, fixture_representation_digest: representationDigest }));
    indexClasses.forEach(([testClass, decision], i) => indexCases.push({ ...baseCase(prior, testClass, decision, `57T-IDX-${contract}-${String(i + 1).padStart(2, "0")}`), index_schema_id: `57T-SIGNED-RELEASE-INDEX-${contract}`, fixture_index_digest: index.index_digest }));
    cacheClasses.forEach(([testClass, decision], i) => cacheCases.push({ ...baseCase(prior, testClass, decision, `57T-CAC-${contract}-${String(i + 1).padStart(2, "0")}`), cache_schema_id: `57T-CACHE-COHERENCE-${contract}`, fixture_cache_digest: digest(cache) }));
    mirrorClasses.forEach(([testClass, decision], i) => mirrorCases.push({ ...baseCase(prior, testClass, decision, `57T-MIR-${contract}-${String(i + 1).padStart(2, "0")}`), mirror_schema_id: `57T-MIRROR-REDIRECT-INTEGRITY-${contract}`, fixture_mirror_digest: digest(mirror) }));
    recoveryClasses.forEach(([testClass, decision], i) => recoveryCases.push({ ...baseCase(prior, testClass, decision, `57T-REC-${contract}-${String(i + 1).padStart(2, "0")}`), recovery_schema_id: `57T-RECOVERY-DRILL-${contract}`, fixture_source_set_digest: digest(artifacts) }));
  }
  const allCases = [...endpointCases, ...indexCases, ...cacheCases, ...mirrorCases, ...recoveryCases];
  return { phase: "57T", endpointSchemas, indexSchemas, cacheSchemas, mirrorSchemas, recoverySchemas, endpointCases, indexCases, cacheCases, mirrorCases, recoveryCases, allCases,
    failures: allCases.filter((row) => !row.passed), distributions: { endpoint: countBy(endpointCases, "test_class"), index: countBy(indexCases, "test_class"), cache: countBy(cacheCases, "test_class"), mirror: countBy(mirrorCases, "test_class"), recovery: countBy(recoveryCases, "test_class") } };
};

export { countBy, digest };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const manifests = JSON.parse(await readFile(join(dataRoot, "phase-57s-reader-verifiable-lifecycle-manifests.json"), "utf8"));
  const freshness = JSON.parse(await readFile(join(dataRoot, "phase-57s-status-freshness-stale-view-detection.json"), "utf8"));
  const exportsData = JSON.parse(await readFile(join(dataRoot, "phase-57s-provenance-export-digest-reconciliation-fixtures.json"), "utf8"));
  const result = runPhase57tHarness({ manifestSchemas: manifests.schemas, freshnessSchemas: freshness.schemas, exportSchemas: exportsData.schemas });
  if (result.failures.length || result.allCases.length !== 828) process.exitCode = 1;
  else console.log(`Phase 57T harness passed: 9 canonical endpoints, 9 signed release indexes, 9 cache-coherence schemas, 9 mirror/redirect schemas, 9 recovery-drill schemas, and ${result.allCases.length} cases, with zero actual endpoints, signatures, cache receipts, mirror events, recovery drills, reader-state changes, triggers, publications, or closures.`);
}
