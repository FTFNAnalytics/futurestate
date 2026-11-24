import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const v1rcPublicationDate = "2026-08-31";
export const v1rcValidatorContractVersion = "phase-156-local-validator-v2";
export const v1rcValidationScope = "Local v1 release-candidate validation only; this receipt is not evidence admission, owner acceptance, repository publication, hosted deployment, or public-launch authorization.";
export const v1rcRequiredValidationCheckIds = [
  "production-html-inventory", "public-json-inventory", "update-index-rendering", "v1rc-route-inventory", "v1rc-route-structure", "v1rc-export-inventory", "v1rc-schema-contract", "owner-authority-boundary",
  "npm-run-validate-candidates", "npm-run-validate-content", "npm-run-source-health", "npm-run-verify-phase58", "npm-run-verify-phase59", "npm-run-verify-phase60", "npm-run-verify-phase60c", "npm-run-verify-phase61", "npm-run-test-v09", "npm-run-test-v1rc", "npm-run-check", "npm-run-build", "npm-run-verify-v1rc",
];

export const computeV1rcValidationBundleDigest = ({ candidateArtifactDigest, metrics }) => createHash("sha256")
  .update(JSON.stringify({
    candidate_artifact_digest: candidateArtifactDigest,
    metrics,
    validator_contract_version: v1rcValidatorContractVersion,
    validation_scope: v1rcValidationScope,
    required_check_ids: v1rcRequiredValidationCheckIds,
    authority: {
      evidence_admission_authorized: false,
      owner_acceptance: false,
      github_publication_authorized: false,
      hosted_deployment_authorized: false,
      public_launch_authorized: false,
      v1_promotion_state: "Held",
    },
  }))
  .digest("hex");

export const isValidV1rcValidationReceipt = ({ receipt, aggregate, candidateDigest, metrics }) => {
  const hasValidCheckShape = (check) => check
    && typeof check === "object"
    && !Array.isArray(check)
    && typeof check.check_id === "string"
    && check.check_id.trim().length > 0
    && typeof check.status === "string"
    && check.status.trim().length > 0;
  if (!receipt
    || typeof receipt !== "object"
    || !aggregate
    || !Array.isArray(receipt.checks)
    || !receipt.metrics
    || typeof receipt.metrics !== "object"
    || Array.isArray(receipt.metrics)
    || !receipt.checks.every(hasValidCheckShape)
    || !/^[a-f0-9]{64}$/.test(candidateDigest ?? "")) return false;
  const bundleDigest = computeV1rcValidationBundleDigest({ candidateArtifactDigest: candidateDigest, metrics: receipt.metrics });
  const calendarTimestamp = Date.parse(`${receipt.validated_date}T00:00:00Z`);
  const validCalendarDate = /^\d{4}-\d{2}-\d{2}$/.test(receipt.validated_date ?? "")
    && Number.isFinite(calendarTimestamp)
    && new Date(calendarTimestamp).toISOString().slice(0, 10) === receipt.validated_date;
  const validatedAtTimestamp = Date.parse(receipt.validated_at ?? "");
  const validatedAtEdmontonDate = Number.isFinite(validatedAtTimestamp) ? new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(validatedAtTimestamp)) : null;
  const currentMetricsMatch = !metrics || Object.entries(metrics).every(([key, value]) => receipt.metrics?.[key] === value);
  const checkIds = receipt.checks?.map((check) => check.check_id) ?? [];
  const requiredChecksPass = new Set(checkIds).size === checkIds.length
    && v1rcRequiredValidationCheckIds.every((id) => receipt.checks?.some((check) => check.check_id === id && check.status === "Passed"));
  return receipt.schema_version === "1.0"
    && receipt.phase === 156
    && receipt.status === "Passed"
    && validCalendarDate
    && receipt.validated_date === aggregate.effective_date
    && receipt.candidate_effective_date === aggregate.effective_date
    && receipt.validator_contract_version === v1rcValidatorContractVersion
    && receipt.scope === v1rcValidationScope
    && receipt.artifact_digest === candidateDigest
    && receipt.validation_bundle_digest === bundleDigest
    && receipt.receipt_id === `156-LOCAL-VALIDATION-${receipt.validated_date}-${bundleDigest.slice(0, 12)}`
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(receipt.validated_at ?? "")
    && Number.isFinite(validatedAtTimestamp)
    && validatedAtTimestamp <= Date.now()
    && validatedAtEdmontonDate === receipt.validated_date
    && receipt.metrics?.v1rc_public_html_routes === aggregate.public_html_routes?.length
    && receipt.metrics?.v1rc_public_json_exports === aggregate.public_json_exports?.length
    && currentMetricsMatch
    && requiredChecksPass
    && receipt.evidence_admission_authorized === false
    && receipt.owner_acceptance === false
    && receipt.github_publication_authorized === false
    && receipt.hosted_deployment_authorized === false
    && receipt.public_launch_authorized === false
    && receipt.v1_promotion_state === "Held";
};

export const normalizeV1rcReceiptDerivedState = (name, value) => {
  const copy = structuredClone(value);

  if (name === "phase-156-v1-launch-decision.json") {
    copy.build_status = "Candidate assembled — validation pending";
    copy.local_validation_receipt = null;
    copy.owner_acceptance_receipt = null;

    const accessible = copy.launch_gates?.find((gate) => gate.gate_id === "156-GATE-12-ACCESSIBLE-STRUCTURE");
    const validation = copy.launch_gates?.find((gate) => gate.gate_id === "156-GATE-13-RELEASE-VALIDATION");
    const owner = copy.launch_gates?.find((gate) => gate.gate_id === "156-GATE-14-OWNER-ACCEPTANCE");

    if (accessible) {
      accessible.state = "Pending build";
      accessible.reason = "The generated routes await a fresh production accessibility-structure audit.";
    }
    if (validation) {
      validation.state = "Pending build";
      validation.reason = "The expanded build requires a new Phase 156 validation receipt; the Phase 144 receipt is historical.";
    }
    if (owner) {
      owner.state = "Held";
      owner.reason = "No owner receipt accepts the exact expanded-build digest and authorizes v1 promotion.";
    }

    copy.counts.passed = copy.launch_gates.filter((gate) => gate.state === "Pass").length;
    copy.counts.held = copy.launch_gates.filter((gate) => gate.state === "Held").length;
    copy.counts.pending_build = copy.launch_gates.filter((gate) => gate.state === "Pending build").length;
    copy.v1_promotion_state = "Held";
    copy.audit_result = `v1 remains Held: ${copy.launch_gates.filter((gate) => gate.state === "Held").map((gate) => gate.label).join(", ")}; local build validation pending.`;
    copy.owner_packet.state = "Awaiting fresh local validation receipt";
    copy.owner_packet.candidate_git_commit = null;
    copy.owner_packet.candidate_git_commit_verification_state = "Not supplied";
    copy.owner_packet.candidate_artifact_digest = null;
    copy.owner_packet.launch_gate_snapshot = copy.launch_gates.map((gate) => ({ gate_id: gate.gate_id, state: gate.state }));
    copy.owner_packet.owner_receipt_archive = null;
    copy.owner_packet.owner_acceptance = false;
    copy.owner_packet.github_publication_authorized = false;
    copy.owner_packet.public_launch_authorized = false;
    copy.owner_packet.hosted_deployment_authorized = false;
    copy.owner_packet.owner_receipt_validation_state = "Not supplied";
  }

  if (name === "v1-release-candidate.json") {
    copy.status = "Candidate assembled — validation pending";
    copy.evidence_state.v1_promotion = "Held";
  }

  return copy;
};

export const serializeV1rcUpdate = (update) => `${JSON.stringify(update, null, 2)}\n`;

export const computeV1rcDigest = ({ aggregate, exportsByName, updatesByName }) => {
  const hash = createHash("sha256");
  const exportNames = aggregate.public_json_exports.map((route) => route.replace(/^\/data\//, "")).sort();
  const normalizedExports = new Map(exportNames.map((name) => [name, normalizeV1rcReceiptDerivedState(name, exportsByName.get(name))]));
  const normalizedPhase156 = normalizedExports.get("phase-156-v1-launch-decision.json");
  const normalizedAggregate = normalizedExports.get("v1-release-candidate.json");
  const aggregatePhase156 = normalizedAggregate?.phases?.find((phase) => phase.phase === 156);
  if (normalizedPhase156 && aggregatePhase156) {
    aggregatePhase156.status = normalizedPhase156.build_status;
    aggregatePhase156.counts = structuredClone(normalizedPhase156.counts);
  }

  for (const name of exportNames) {
    const value = normalizedExports.get(name);
    if (!value) throw new Error(`Missing v1-RC source export ${name} while computing the candidate digest.`);
    hash.update(name);
    hash.update("\0");
    hash.update(JSON.stringify(normalizeV1rcReceiptDerivedState(name, value)));
    hash.update("\0");
  }

  for (const route of [...aggregate.public_html_routes].sort()) {
    hash.update(route);
    hash.update("\0");
  }

  const initialUpdateNames = Array.from({ length: 12 }, (_, index) => `${v1rcPublicationDate}-phase-${145 + index}.json`);
  const updateNames = aggregate.publication_update_files ?? initialUpdateNames;
  if (!initialUpdateNames.every((name) => updateNames.includes(name)) || new Set(updateNames).size !== updateNames.length) {
    throw new Error("The v1-RC update inventory must include every immutable initial update exactly once.");
  }
  for (const name of [...updateNames].sort()) {
    const value = updatesByName.get(name);
    if (value === undefined) throw new Error(`Missing v1-RC publication update ${name} while computing the candidate digest.`);
    hash.update(name);
    hash.update("\0");
    hash.update(typeof value === "string" || Buffer.isBuffer(value) ? value : serializeV1rcUpdate(value));
    hash.update("\0");
  }

  return hash.digest("hex");
};

export const computeV1rcDigestFromDisk = async ({ aggregate, dataRoot, updateRoot }) => {
  const exportsByName = new Map();
  for (const route of aggregate.public_json_exports) {
    const name = route.replace(/^\/data\//, "");
    exportsByName.set(name, JSON.parse(await readFile(join(dataRoot, name), "utf8")));
  }

  const updatesByName = new Map();
  const updateNames = aggregate.publication_update_files ?? Array.from({ length: 12 }, (_, index) => `${v1rcPublicationDate}-phase-${145 + index}.json`);
  for (const name of updateNames) {
    updatesByName.set(name, await readFile(join(updateRoot, name)));
  }

  return computeV1rcDigest({ aggregate, exportsByName, updatesByName });
};
