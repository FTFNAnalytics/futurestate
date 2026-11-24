import { createHash } from "node:crypto";

export const v1rcOwnerReceiptContractVersion = "phase-156-owner-acceptance-v1";

const validIsoDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};

const canonicalOwnerReceiptPayload = (receipt) => ({
  schema_version: receipt?.schema_version,
  owner_receipt_contract_version: receipt?.owner_receipt_contract_version,
  phase: receipt?.phase,
  candidate_effective_date: receipt?.candidate_effective_date,
  decision_date: receipt?.decision_date,
  owner_acceptance: receipt?.owner_acceptance,
  v1_promotion_authorized: receipt?.v1_promotion_authorized,
  candidate_artifact_digest: receipt?.candidate_artifact_digest,
  candidate_git_commit: String(receipt?.candidate_git_commit ?? "").toLowerCase(),
  launch_gate_snapshot: [...(receipt?.launch_gate_snapshot ?? [])]
    .map(({ gate_id, state }) => ({ gate_id, state }))
    .sort((a, b) => a.gate_id.localeCompare(b.gate_id)),
  accepted_limitations: [...(receipt?.accepted_limitations ?? [])].sort(),
  reviewer_role: receipt?.reviewer_role,
  rationale: receipt?.rationale,
  github_publication_authorized: receipt?.github_publication_authorized === true,
  hosted_deployment_authorized: receipt?.hosted_deployment_authorized === true,
  public_launch_authorized: receipt?.public_launch_authorized === true,
});

export const computeV1rcOwnerReceiptPayloadDigest = (receipt) => createHash("sha256")
  .update(JSON.stringify(canonicalOwnerReceiptPayload(receipt)))
  .digest("hex");

export const v1rcOwnerReceiptArchiveName = (receipt) => {
  const payloadDigest = computeV1rcOwnerReceiptPayloadDigest(receipt);
  return `${receipt?.decision_date}-phase-156-owner-acceptance-${payloadDigest.slice(0, 12)}.json`;
};

export const isValidV1rcOwnerReceipt = ({
  receipt,
  aggregate,
  candidateDigest,
  verifiedGitCommit,
  expectedGateSnapshot,
  requiredLimitations,
  effectiveDate,
}) => {
  const hasValidGateShape = (gate) => gate
    && typeof gate === "object"
    && !Array.isArray(gate)
    && typeof gate.gate_id === "string"
    && gate.gate_id.trim().length > 0
    && typeof gate.state === "string"
    && gate.state.trim().length > 0;
  if (!receipt
    || typeof receipt !== "object"
    || !aggregate
    || !Array.isArray(receipt.launch_gate_snapshot)
    || !Array.isArray(receipt.accepted_limitations)
    || !Array.isArray(expectedGateSnapshot)
    || !Array.isArray(requiredLimitations)
    || !receipt.launch_gate_snapshot.every(hasValidGateShape)
    || !expectedGateSnapshot.every(hasValidGateShape)
    || !receipt.accepted_limitations.every((limitation) => typeof limitation === "string")
    || !requiredLimitations.every((limitation) => typeof limitation === "string")) return false;
  const payloadDigest = computeV1rcOwnerReceiptPayloadDigest(receipt);
  const canonicalExpectedSnapshot = [...expectedGateSnapshot]
    .map(({ gate_id, state }) => ({ gate_id, state }))
    .sort((a, b) => a.gate_id.localeCompare(b.gate_id));
  const canonicalReceiptSnapshot = canonicalOwnerReceiptPayload(receipt).launch_gate_snapshot;
  const acceptedLimitations = [...(receipt.accepted_limitations ?? [])].sort();
  const expectedLimitations = [...requiredLimitations].sort();
  const snapshotIsPromotionReady = canonicalExpectedSnapshot.length === 14
    && canonicalExpectedSnapshot.every(({ gate_id, state }) => state === (gate_id === "156-GATE-14-OWNER-ACCEPTANCE" ? "Held" : "Pass"));

  return receipt.schema_version === "1.0"
    && receipt.owner_receipt_contract_version === v1rcOwnerReceiptContractVersion
    && receipt.phase === 156
    && receipt.candidate_effective_date === aggregate.effective_date
    && validIsoDate(receipt.decision_date)
    && receipt.decision_date >= aggregate.effective_date
    && receipt.decision_date <= effectiveDate
    && receipt.owner_acceptance === true
    && receipt.v1_promotion_authorized === true
    && /^[a-f0-9]{64}$/i.test(candidateDigest ?? "")
    && receipt.candidate_artifact_digest === candidateDigest
    && /^[a-f0-9]{40}$/i.test(receipt.candidate_git_commit ?? "")
    && /^[a-f0-9]{40}$/i.test(verifiedGitCommit ?? "")
    && receipt.candidate_git_commit.toLowerCase() === verifiedGitCommit.toLowerCase()
    && snapshotIsPromotionReady
    && JSON.stringify(canonicalReceiptSnapshot) === JSON.stringify(canonicalExpectedSnapshot)
    && JSON.stringify(acceptedLimitations) === JSON.stringify(expectedLimitations)
    && typeof receipt.reviewer_role === "string" && receipt.reviewer_role.trim().length > 0
    && typeof receipt.rationale === "string" && receipt.rationale.trim().length > 0
    && typeof receipt.github_publication_authorized === "boolean"
    && typeof receipt.hosted_deployment_authorized === "boolean"
    && typeof receipt.public_launch_authorized === "boolean"
    && receipt.owner_receipt_payload_digest === payloadDigest
    && receipt.receipt_id === `156-OWNER-ACCEPTANCE-${receipt.decision_date}-${payloadDigest.slice(0, 12)}`;
};
