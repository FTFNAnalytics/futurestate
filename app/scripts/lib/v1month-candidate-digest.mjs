import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const v1monthPublicationDate = "2026-08-31";
export const v1monthPhases = Object.freeze([157, 158, 159, 160, 161, 162, 163, 164]);
export const v1monthValidatorContractVersion = "phase-164-local-validator-v1";
export const v1monthValidationScope = "Local validation of the append-only Phase 157–164 September operating overlay. The receipt does not admit evidence, supply an owner decision, authorize repository publication, authorize hosting, or promote v1.";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const isHexDigest = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const isIsoDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};
const unique = (items) => [...new Set(items)];

const normalizedPhase164Counts = (gates) => ({
  readiness_gates: gates.length,
  passed: gates.filter((gate) => gate.state === "Pass").length,
  held: gates.filter((gate) => gate.state === "Held").length,
  pending_build: gates.filter((gate) => gate.state === "Pending build").length,
  false_passes: 0,
});

export const normalizeV1monthReceiptDerivedState = (name, value) => {
  const copy = structuredClone(value);

  if (name === "phase-164-monthly-candidate-decision.json") {
    copy.local_validation_receipt = null;
    copy.local_validation_state = "Pending build";
    copy.build_status = "Complete locally — validation pending";
    copy.v1_promotion_state = "Held";
    copy.readiness_gates = (copy.readiness_gates ?? []).map((gate) => gate.gate_id === "164-GATE-13-LOCAL-VALIDATION"
      ? {
          ...gate,
          state: "Pending build",
          evidence: "A content-addressed Phase 164 validation receipt has not yet been embedded.",
          receipt_id: null,
        }
      : gate);
    copy.counts = normalizedPhase164Counts(copy.readiness_gates);
  }

  if (name === "v1-monthly-operating-program.json") {
    copy.status = "Complete locally — validation pending; v1 promotion held";
    copy.local_validation_receipt_id = null;
    copy.local_validation_artifact_digest = null;
    copy.v1_promotion_state = "Held";
    const phase164 = copy.phases?.find((phase) => phase.phase === 164);
    if (phase164) {
      phase164.status = "Complete locally — validation pending";
      phase164.counts = {
        readiness_gates: 14,
        passed: 9,
        held: 4,
        pending_build: 1,
        false_passes: 0,
      };
    }
  }

  return copy;
};

export const serializeV1monthUpdate = (update) => `${JSON.stringify(update, null, 2)}\n`;

export const computeV1monthDigest = ({ aggregate, exportsByName, updatesByName }) => {
  const exportNames = aggregate.public_json_exports.map((route) => route.replace(/^\/data\//, "")).sort();
  if (exportNames.length !== 9 || unique(exportNames).length !== 9) {
    throw new Error(`The v1month digest requires exactly nine unique exports; received ${exportNames.length}/${unique(exportNames).length}.`);
  }

  const normalized = new Map();
  for (const name of exportNames) {
    const value = exportsByName.get(name);
    if (!value) throw new Error(`Missing v1month source export ${name} while computing the candidate digest.`);
    normalized.set(name, normalizeV1monthReceiptDerivedState(name, value));
  }
  const aggregateName = "v1-monthly-operating-program.json";
  const phase164Name = "phase-164-monthly-candidate-decision.json";
  const normalizedAggregate = normalized.get(aggregateName);
  const normalizedPhase164 = normalized.get(phase164Name);
  const aggregatePhase164 = normalizedAggregate?.phases?.find((phase) => phase.phase === 164);
  if (aggregatePhase164 && normalizedPhase164) {
    aggregatePhase164.status = normalizedPhase164.build_status;
    aggregatePhase164.counts = structuredClone(normalizedPhase164.counts);
  }

  const hash = createHash("sha256");
  for (const name of exportNames) {
    hash.update(name);
    hash.update("\0");
    hash.update(JSON.stringify(normalized.get(name)));
    hash.update("\0");
  }

  const routes = [...(aggregate.public_html_routes ?? [])].sort();
  if (routes.length === 0 || unique(routes).length !== routes.length) {
    throw new Error("The v1month route inventory is empty or duplicated.");
  }
  for (const route of routes) {
    hash.update(route);
    hash.update("\0");
  }

  const expectedUpdateNames = v1monthPhases.map((phase) => `${v1monthPublicationDate}-phase-${phase}.json`);
  const updateNames = aggregate.publication_update_files ?? expectedUpdateNames;
  if (updateNames.length !== expectedUpdateNames.length || unique(updateNames).length !== updateNames.length || !expectedUpdateNames.every((name) => updateNames.includes(name))) {
    throw new Error("The v1month update inventory must contain the eight immutable Phase 157–164 publication updates exactly once.");
  }
  for (const name of [...updateNames].sort()) {
    const value = updatesByName.get(name);
    if (value === undefined) throw new Error(`Missing v1month publication update ${name} while computing the candidate digest.`);
    hash.update(name);
    hash.update("\0");
    hash.update(typeof value === "string" || Buffer.isBuffer(value) ? value : serializeV1monthUpdate(value));
    hash.update("\0");
  }

  return hash.digest("hex");
};

export const computeV1monthDigestFromDisk = async ({ aggregate, dataRoot, updateRoot }) => {
  const exportsByName = new Map();
  for (const route of aggregate.public_json_exports) {
    const name = route.replace(/^\/data\//, "");
    exportsByName.set(name, JSON.parse(await readFile(join(dataRoot, name), "utf8")));
  }
  const updatesByName = new Map();
  for (const name of aggregate.publication_update_files ?? v1monthPhases.map((phase) => `${v1monthPublicationDate}-phase-${phase}.json`)) {
    updatesByName.set(name, await readFile(join(updateRoot, name)));
  }
  return computeV1monthDigest({ aggregate, exportsByName, updatesByName });
};

const receiptMetricSubset = (metrics) => ({
  overlay_public_html_routes: metrics.overlay_public_html_routes,
  overlay_public_json_exports: metrics.overlay_public_json_exports,
  schema_1_0_overlay_exports: metrics.schema_1_0_overlay_exports,
  structurally_audited_overlay_routes: metrics.structurally_audited_overlay_routes,
  overlay_update_records: metrics.overlay_update_records,
  baseline_phase156_artifact_digest: metrics.baseline_phase156_artifact_digest,
});

export const computeV1monthValidationBundleDigest = ({ candidateArtifactDigest, metrics }) => sha256(JSON.stringify({
  validator_contract_version: v1monthValidatorContractVersion,
  candidate_artifact_digest: candidateArtifactDigest,
  metrics: receiptMetricSubset(metrics),
}));

export const isValidV1monthValidationReceipt = ({ receipt, aggregate, candidateDigest, metrics = null }) => {
  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) return false;
  if (!aggregate || typeof aggregate !== "object" || Array.isArray(aggregate)) return false;
  if (!isHexDigest(candidateDigest)) return false;
  const baselineDigest = aggregate.baseline_v1rc?.artifact_digest;
  const expectedMetrics = {
    overlay_public_html_routes: aggregate.public_html_routes?.length,
    overlay_public_json_exports: aggregate.public_json_exports?.length,
    schema_1_0_overlay_exports: aggregate.public_json_exports?.length,
    structurally_audited_overlay_routes: aggregate.public_html_routes?.length,
    overlay_update_records: aggregate.publication_update_files?.length,
    baseline_phase156_artifact_digest: baselineDigest,
  };
  if (!isHexDigest(baselineDigest)) return false;
  if (JSON.stringify(receiptMetricSubset(receipt.metrics ?? {})) !== JSON.stringify(expectedMetrics)) return false;
  if (metrics && JSON.stringify(receiptMetricSubset(metrics)) !== JSON.stringify(expectedMetrics)) return false;
  const bundleDigest = computeV1monthValidationBundleDigest({ candidateArtifactDigest: candidateDigest, metrics: expectedMetrics });
  const expectedId = `164-LOCAL-VALIDATION-${receipt.validated_date}-${bundleDigest.slice(0, 12)}`;
  const wholeSiteSnapshot = receipt.metrics?.whole_site_snapshot ?? {};
  return receipt.schema_version === "1.0"
    && receipt.phase === 164
    && receipt.receipt_id === expectedId
    && receipt.candidate_effective_date === aggregate.effective_date
    && isIsoDate(receipt.validated_date)
    && receipt.validated_date >= aggregate.effective_date
    && typeof receipt.validated_at === "string"
    && Number.isFinite(Date.parse(receipt.validated_at))
    && receipt.status === "Passed"
    && receipt.validator_contract_version === v1monthValidatorContractVersion
    && receipt.scope === v1monthValidationScope
    && receipt.artifact_digest_algorithm === "sha256"
    && receipt.artifact_digest === candidateDigest
    && receipt.validation_bundle_digest === bundleDigest
    && receipt.historical_whole_site_inventory_snapshot === true
    && Number.isInteger(wholeSiteSnapshot.html_pages_excluding_downloads)
    && Number.isInteger(wholeSiteSnapshot.top_level_data_json_exports)
    && Number.isInteger(wholeSiteSnapshot.update_entries_rendered)
    && Array.isArray(receipt.checks)
    && receipt.checks.length > 0
    && receipt.checks.every((check) => check && check.status === "Passed")
    && receipt.evidence_admission_authorized === false
    && receipt.owner_acceptance === false
    && receipt.github_publication_authorized === false
    && receipt.hosted_deployment_authorized === false
    && receipt.public_launch_authorized === false
    && receipt.v1_promotion_state === "Held";
};
