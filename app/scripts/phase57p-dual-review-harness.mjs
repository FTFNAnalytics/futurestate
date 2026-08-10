import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { makeSyntheticReceipt } from "./phase57o-workflow-harness.mjs";

const clone = (value) => structuredClone(value);
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};
const digest = (value) => createHash("sha256").update(canonical(value)).digest("hex");

export const publicationReasonCodes = {
  accept: ["publication_accept_complete_evidence_receipt"],
  reject: ["publication_reject_evidence_or_scope_conflict"],
  needs_clarification: ["publication_clarification_required"],
  privacy_blocked: ["publication_privacy_boundary_unresolved"],
  authority_mismatch: ["publication_authority_mismatch"],
  period_mismatch: ["publication_period_mismatch"],
};

const publicationSignedFields = (receipt) => ({
  publication_receipt_id: receipt.publication_receipt_id,
  contract_id: receipt.contract_id,
  evidence_receipt_id: receipt.evidence_receipt_id,
  evidence_receipt_digest: receipt.evidence_receipt_digest,
  reviewer_identity: receipt.reviewer_identity,
  decision_type: receipt.decision_type,
  reason_code: receipt.reason_code,
  decision_time: receipt.decision_time,
  escalation_state: receipt.escalation_state,
  escalation_owner: receipt.escalation_owner,
  supersedes_publication_receipt_id: receipt.supersedes_publication_receipt_id,
});

export const makeSyntheticPublicationReceipt = (contractId, decisionType, evidenceReceipt, options = {}) => {
  const requiresEscalation = decisionType !== "accept";
  const receipt = {
    publication_receipt_id: options.receiptId ?? `FIXTURE-PUBLICATION-${contractId}-${decisionType}`,
    contract_id: contractId,
    evidence_receipt_id: `FIXTURE-EVIDENCE-${contractId}`,
    evidence_receipt_digest: evidenceReceipt.signed_digest,
    reviewer_identity: {
      profile_id: `FIXTURE-PUBLICATION-REVIEWER-${contractId}`,
      display_name: "Synthetic publication reviewer",
      role: "publication_reviewer",
    },
    decision_type: decisionType,
    reason_code: publicationReasonCodes[decisionType][0],
    allowed_reason_codes: publicationReasonCodes[decisionType],
    decision_time: options.decisionTime ?? "2026-08-09T12:10:00.000Z",
    escalation_state: requiresEscalation ? "escalation_required" : "not_required",
    escalation_owner: requiresEscalation ? {
      profile_id: `FIXTURE-ESCALATION-REVIEWER-${contractId}`,
      display_name: "Synthetic escalation reviewer",
      role: "escalation_reviewer",
    } : null,
    supersedes_publication_receipt_id: options.supersedes ?? null,
    fixture_only: true,
    actual_receipt: false,
    automated_release_allowed: false,
    fires_trigger: false,
    closes_hold_automatically: false,
    publishes_automatically: false,
    evidence_created: false,
  };
  receipt.signed_snapshot = clone(publicationSignedFields(receipt));
  receipt.signed_digest = digest(receipt.signed_snapshot);
  return receipt;
};

export const validatePublicationReceipt = (receipt, evidenceReceipt) => {
  const required = [
    ["publication_receipt_id", receipt.publication_receipt_id],
    ["contract_id", receipt.contract_id],
    ["evidence_receipt_id", receipt.evidence_receipt_id],
    ["evidence_receipt_digest", receipt.evidence_receipt_digest],
    ["reviewer_identity.profile_id", receipt.reviewer_identity?.profile_id],
    ["reviewer_identity.role", receipt.reviewer_identity?.role],
    ["decision_type", receipt.decision_type],
    ["reason_code", receipt.reason_code],
    ["decision_time", receipt.decision_time],
    ["escalation_state", receipt.escalation_state],
  ];
  if (receipt.decision_type !== "accept") required.push(["escalation_owner.profile_id", receipt.escalation_owner?.profile_id]);
  const missing = required.find(([, value]) => value === null || value === undefined || value === "")?.[0];
  if (missing) return { decision: "reject_publication_receipt_missing_field", reason_code: "publication_receipt_missing_required_field", field: missing };
  if (receipt.reviewer_identity.role !== "publication_reviewer") return { decision: "reject_publication_role", reason_code: "publication_reviewer_role_required" };
  if (!publicationReasonCodes[receipt.decision_type]?.includes(receipt.reason_code)) {
    return { decision: "reject_publication_reason_code", reason_code: "publication_reason_code_incompatible" };
  }
  if (receipt.evidence_receipt_digest !== evidenceReceipt.signed_digest) {
    return { decision: "reject_evidence_receipt_link_mutated", reason_code: "evidence_receipt_digest_mismatch" };
  }
  if (JSON.stringify(receipt.reviewer_identity) !== JSON.stringify(receipt.signed_snapshot?.reviewer_identity)) {
    return { decision: "reject_publication_attribution_mutated", reason_code: "publication_reviewer_attribution_changed" };
  }
  if (digest(publicationSignedFields(receipt)) !== receipt.signed_digest) {
    return { decision: "reject_publication_receipt_mutated", reason_code: "publication_receipt_digest_mismatch" };
  }
  return { decision: "publication_receipt_valid", reason_code: "publication_receipt_integrity_passed" };
};

export const buildPublicationReceiptCases = (acceptTemplates) => acceptTemplates.flatMap((template) => {
  const evidenceReceipt = makeSyntheticReceipt(template);
  return Object.keys(publicationReasonCodes).flatMap((decisionType) => {
    const valid = makeSyntheticPublicationReceipt(template.contract_id, decisionType, evidenceReceipt);
    const wrongReason = clone(valid);
    wrongReason.reason_code = "fixture_incompatible_publication_reason";
    const mutatedAttribution = clone(valid);
    mutatedAttribution.reviewer_identity.profile_id = `${mutatedAttribution.reviewer_identity.profile_id}-MUTATED`;
    const fixtures = [
      { testClass: "valid_publication_receipt", receipt: valid, expected: "publication_receipt_valid" },
      { testClass: "incompatible_publication_reason", receipt: wrongReason, expected: "reject_publication_reason_code" },
      { testClass: "mutated_publication_attribution", receipt: mutatedAttribution, expected: "reject_publication_attribution_mutated" },
    ];
    return fixtures.map((fixture) => {
      const actual = validatePublicationReceipt(fixture.receipt, evidenceReceipt);
      return {
        test_id: `57P-PUBLICATION-RECEIPT-${template.contract_id}-${decisionType}-${fixture.testClass}`,
        contract_id: template.contract_id,
        evidence_rail: template.evidence_rail,
        decision_type: decisionType,
        test_class: fixture.testClass,
        expected_decision: fixture.expected,
        actual_decision: actual.decision,
        reason_code: actual.reason_code,
        failed_field: actual.field ?? null,
        passed: actual.decision === fixture.expected,
        fixture_only: true,
        actual_publication_receipt: false,
        actual_reviewer_identity_created: false,
        fires_trigger: false,
        closes_hold_automatically: false,
        publishes_automatically: false,
        evidence_created: false,
      };
    });
  });
});

const auditSignedFields = (event) => ({
  event_id: event.event_id,
  contract_id: event.contract_id,
  event_sequence: event.event_sequence,
  event_type: event.event_type,
  event_time: event.event_time,
  prior_event_digest: event.prior_event_digest,
  payload_digest: event.payload_digest,
  supersedes_event_id: event.supersedes_event_id,
});

const makeAuditEvent = ({ contractId, sequence, type, time, previousDigest = null, payload, eventId, supersedes = null }) => {
  const event = {
    event_id: eventId ?? `FIXTURE-AUDIT-${contractId}-${sequence}-${type}`,
    contract_id: contractId,
    event_sequence: sequence,
    event_type: type,
    event_time: time,
    prior_event_digest: previousDigest,
    payload_snapshot: clone(payload),
    payload_digest: digest(payload),
    supersedes_event_id: supersedes,
    fixture_only: true,
    actual_audit_event: false,
  };
  event.signed_snapshot = clone(auditSignedFields(event));
  event.event_digest = digest(event.signed_snapshot);
  return event;
};

export const validateAuditChain = (events) => {
  const ids = new Set();
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (ids.has(event.event_id)) return { decision: "reject_duplicate_audit_event_id", reason_code: "audit_event_id_must_be_unique" };
    ids.add(event.event_id);
    if (event.event_sequence !== index + 1) return { decision: "reject_audit_sequence_gap", reason_code: "audit_sequence_must_be_contiguous" };
    const previous = events[index - 1];
    if ((event.prior_event_digest ?? null) !== (previous?.event_digest ?? null)) return { decision: "reject_audit_link_mismatch", reason_code: "prior_event_digest_mismatch" };
    if (previous && Date.parse(event.event_time) <= Date.parse(previous.event_time)) return { decision: "reject_audit_time_regression", reason_code: "audit_event_time_must_increase" };
    if (digest(event.payload_snapshot) !== event.payload_digest) return { decision: "reject_audit_payload_mutated", reason_code: "audit_payload_digest_mismatch" };
    if (JSON.stringify(auditSignedFields(event)) !== JSON.stringify(event.signed_snapshot) || digest(auditSignedFields(event)) !== event.event_digest) {
      return { decision: "reject_audit_event_mutated", reason_code: "audit_event_digest_mismatch" };
    }
    if (event.supersedes_event_id && !events.slice(0, index).some((prior) => prior.event_id === event.supersedes_event_id)) {
      return { decision: "reject_unknown_superseded_event", reason_code: "superseded_event_must_preexist" };
    }
  }
  return { decision: "audit_chain_valid", reason_code: "append_only_chain_integrity_passed" };
};

export const buildAuditChainSchemas = (acceptTemplates) => acceptTemplates.map((template) => ({
  audit_chain_id: `57P-DUAL-REVIEW-CHAIN-${template.contract_id}`,
  contract_id: template.contract_id,
  queue_id: template.queue_id,
  evidence_rail: template.evidence_rail,
  append_only_event_types: ["evidence_receipt_recorded", "publication_receipt_recorded", "adjudication_recorded", "receipt_supersession_recorded", "manual_release_authorization_recorded", "withdrawal_recorded"],
  immutable_link_fields: ["event_id", "event_sequence", "event_time", "prior_event_digest", "payload_digest", "event_digest"],
  required_role_separation: ["evidence_reviewer", "publication_reviewer", "escalation_reviewer"],
  prohibited_operations: ["update_prior_event", "replace_prior_receipt", "delete_audit_event", "collapse_disagreement_to_accept", "automatic_trigger", "automatic_closure", "automatic_publication"],
  manual_release_required_after_concordant_accept: true,
}));

export const buildAuditChainCases = (acceptTemplates) => acceptTemplates.flatMap((template) => {
  const evidenceReceipt = makeSyntheticReceipt(template);
  const publicationReceipt = makeSyntheticPublicationReceipt(template.contract_id, "accept", evidenceReceipt);
  const evidencePayload = { receipt_id: `FIXTURE-EVIDENCE-${template.contract_id}`, receipt_digest: evidenceReceipt.signed_digest, reviewer_profile_id: evidenceReceipt.reviewer_identity.profile_id };
  const publicationPayload = { receipt_id: publicationReceipt.publication_receipt_id, receipt_digest: publicationReceipt.signed_digest, reviewer_profile_id: publicationReceipt.reviewer_identity.profile_id };
  const first = makeAuditEvent({ contractId: template.contract_id, sequence: 1, type: "evidence_receipt_recorded", time: "2026-08-09T12:00:00.000Z", payload: evidencePayload });
  const second = makeAuditEvent({ contractId: template.contract_id, sequence: 2, type: "publication_receipt_recorded", time: "2026-08-09T12:10:00.000Z", previousDigest: first.event_digest, payload: publicationPayload });
  const supersedingReceipt = makeSyntheticPublicationReceipt(template.contract_id, "needs_clarification", evidenceReceipt, { receiptId: `FIXTURE-PUBLICATION-${template.contract_id}-SUPERSEDING`, decisionTime: "2026-08-09T12:20:00.000Z", supersedes: publicationReceipt.publication_receipt_id });
  const third = makeAuditEvent({ contractId: template.contract_id, sequence: 3, type: "receipt_supersession_recorded", time: "2026-08-09T12:20:00.000Z", previousDigest: second.event_digest, payload: { receipt_id: supersedingReceipt.publication_receipt_id, receipt_digest: supersedingReceipt.signed_digest, supersedes_receipt_id: publicationReceipt.publication_receipt_id }, supersedes: second.event_id });
  const mutatedPayload = clone([first, second]);
  mutatedPayload[0].payload_snapshot.receipt_digest = "mutated";
  const mutatedEvent = clone([first, second]);
  mutatedEvent[0].event_type = "replacement_attempt";
  const chronologyEvent = makeAuditEvent({ contractId: template.contract_id, sequence: 3, type: "adjudication_recorded", time: "2026-08-09T12:05:00.000Z", previousDigest: second.event_digest, payload: { state: "fixture" } });
  const duplicateEvent = makeAuditEvent({ contractId: template.contract_id, sequence: 3, type: "adjudication_recorded", time: "2026-08-09T12:20:00.000Z", previousDigest: second.event_digest, payload: { state: "fixture" }, eventId: second.event_id });
  const fixtures = [
    { testClass: "append_evidence_receipt", actual: validateAuditChain([first]).decision, expected: "audit_chain_valid" },
    { testClass: "append_publication_receipt", actual: validateAuditChain([first, second]).decision, expected: "audit_chain_valid" },
    { testClass: "verify_hash_linkage", actual: validateAuditChain([first, second]).decision, expected: "audit_chain_valid" },
    { testClass: "preserve_evidence_receipt_after_publication", actual: JSON.stringify(first) === JSON.stringify([first, second][0]) ? "prior_event_preserved" : "prior_event_mutated", expected: "prior_event_preserved" },
    { testClass: "append_supersession_without_mutation", actual: validateAuditChain([first, second, third]).decision, expected: "audit_chain_valid" },
    { testClass: "reject_prior_payload_mutation", actual: validateAuditChain(mutatedPayload).decision, expected: "reject_audit_payload_mutated" },
    { testClass: "reject_prior_event_replacement", actual: validateAuditChain(mutatedEvent).decision, expected: "reject_audit_event_mutated" },
    { testClass: "reject_chronology_regression", actual: validateAuditChain([first, second, chronologyEvent]).decision, expected: "reject_audit_time_regression" },
    { testClass: "reject_duplicate_event_id", actual: validateAuditChain([first, second, duplicateEvent]).decision, expected: "reject_duplicate_audit_event_id" },
  ];
  return fixtures.map((fixture) => ({
    test_id: `57P-AUDIT-${template.contract_id}-${fixture.testClass}`,
    contract_id: template.contract_id,
    evidence_rail: template.evidence_rail,
    test_class: fixture.testClass,
    expected_decision: fixture.expected,
    actual_decision: fixture.actual,
    passed: fixture.actual === fixture.expected,
    fixture_only: true,
    actual_audit_event: false,
    prior_event_mutated: false,
    fires_trigger: false,
    closes_hold_automatically: false,
    publishes_automatically: false,
    evidence_created: false,
  }));
});

export const adjudicate = (evidenceDecision, publicationReceipt, evidenceReceipt, options = {}) => {
  const integrity = validatePublicationReceipt(publicationReceipt, evidenceReceipt);
  if (integrity.decision !== "publication_receipt_valid") return { decision: "adjudication_rejected", reason_code: integrity.reason_code };
  if (publicationReceipt.reviewer_identity.profile_id === evidenceReceipt.reviewer_identity.profile_id) {
    return { decision: "adjudication_authorization_rejected", reason_code: "evidence_and_publication_reviewers_must_differ" };
  }
  if (evidenceDecision !== "accept" && publicationReceipt.decision_type === "accept") {
    return { decision: "adjudication_override_rejected", reason_code: "publication_accept_cannot_override_nonaccept_evidence" };
  }
  if (options.supersession) return { decision: "supersession_appended_prior_preserved", reason_code: "later_receipt_appended_without_mutation" };
  if (publicationReceipt.decision_type === "accept") return { decision: "concordant_accept_awaiting_manual_release", reason_code: "dual_accept_requires_manual_release_authorization" };
  const owner = publicationReceipt.escalation_owner;
  if (!owner || owner.role !== "escalation_reviewer" || [evidenceReceipt.reviewer_identity.profile_id, publicationReceipt.reviewer_identity.profile_id].includes(owner.profile_id)) {
    return { decision: "adjudication_escalation_rejected", reason_code: "distinct_escalation_owner_required" };
  }
  if (["reject", "needs_clarification"].includes(publicationReceipt.decision_type)) return { decision: "disagreement_escalated", reason_code: "evidence_publication_disagreement_requires_resolution" };
  return { decision: "bounded_block_escalated", reason_code: `${publicationReceipt.decision_type}_requires_resolution` };
};

export const buildAdjudicationCases = (acceptTemplates) => acceptTemplates.flatMap((template) => {
  const evidenceReceipt = makeSyntheticReceipt(template);
  const publication = (decision) => makeSyntheticPublicationReceipt(template.contract_id, decision, evidenceReceipt);
  const fixtures = [
    { testClass: "concordant_accept", evidenceDecision: "accept", receipt: publication("accept"), expected: "concordant_accept_awaiting_manual_release" },
    { testClass: "disagreement_reject", evidenceDecision: "accept", receipt: publication("reject"), expected: "disagreement_escalated" },
    { testClass: "disagreement_needs_clarification", evidenceDecision: "accept", receipt: publication("needs_clarification"), expected: "disagreement_escalated" },
    { testClass: "privacy_blocked_escalation", evidenceDecision: "accept", receipt: publication("privacy_blocked"), expected: "bounded_block_escalated" },
    { testClass: "authority_mismatch_escalation", evidenceDecision: "accept", receipt: publication("authority_mismatch"), expected: "bounded_block_escalated" },
    { testClass: "period_mismatch_escalation", evidenceDecision: "accept", receipt: publication("period_mismatch"), expected: "bounded_block_escalated" },
    { testClass: "same_actor_rejection", evidenceDecision: "accept", receipt: publication("accept"), mutate: (receipt) => { receipt.reviewer_identity.profile_id = evidenceReceipt.reviewer_identity.profile_id; receipt.signed_snapshot = clone(publicationSignedFields(receipt)); receipt.signed_digest = digest(receipt.signed_snapshot); }, expected: "adjudication_authorization_rejected" },
    { testClass: "missing_escalation_owner_rejection", evidenceDecision: "accept", receipt: publication("reject"), mutate: (receipt) => { receipt.escalation_owner = null; receipt.signed_snapshot = clone(publicationSignedFields(receipt)); receipt.signed_digest = digest(receipt.signed_snapshot); }, expected: "adjudication_rejected" },
    { testClass: "publication_accept_over_nonaccept_rejection", evidenceDecision: "reject", receipt: publication("accept"), expected: "adjudication_override_rejected" },
    { testClass: "append_only_supersession", evidenceDecision: "accept", receipt: publication("needs_clarification"), options: { supersession: true }, expected: "supersession_appended_prior_preserved" },
  ];
  return fixtures.map((fixture) => {
    const receipt = clone(fixture.receipt);
    fixture.mutate?.(receipt);
    const actual = adjudicate(fixture.evidenceDecision, receipt, evidenceReceipt, fixture.options);
    return {
      test_id: `57P-ADJUDICATION-${template.contract_id}-${fixture.testClass}`,
      contract_id: template.contract_id,
      evidence_rail: template.evidence_rail,
      test_class: fixture.testClass,
      evidence_decision: fixture.evidenceDecision,
      publication_decision: receipt.decision_type,
      expected_decision: fixture.expected,
      actual_decision: actual.decision,
      reason_code: actual.reason_code,
      passed: actual.decision === fixture.expected,
      fixture_only: true,
      actual_adjudication: false,
      disagreement_collapsed_to_accept: false,
      prior_receipt_mutated: false,
      fires_trigger: false,
      closes_hold_automatically: false,
      publishes_automatically: false,
      evidence_created: false,
    };
  });
});

export const countBy = (rows, field) => rows.reduce((counts, row) => {
  const value = row[field];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

export const runPhase57pHarness = (templates) => {
  const acceptTemplates = templates.filter((template) => template.decision_type === "accept");
  const schemas = buildAuditChainSchemas(acceptTemplates);
  const auditCases = buildAuditChainCases(acceptTemplates);
  const publicationReceiptCases = buildPublicationReceiptCases(acceptTemplates);
  const adjudicationCases = buildAdjudicationCases(acceptTemplates);
  const allCases = [...auditCases, ...publicationReceiptCases, ...adjudicationCases];
  return { schemas, auditCases, publicationReceiptCases, adjudicationCases, allCases, failures: allCases.filter((row) => !row.passed) };
};

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isDirectRun) {
  const appRoot = fileURLToPath(new URL("..", import.meta.url));
  const receipts = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57n-reviewer-receipt-ledger.json"), "utf8"));
  const result = runPhase57pHarness(receipts.templates);
  const expected = { schemas: 9, audit: 81, publication: 162, adjudication: 90, total: 333 };
  if (result.schemas.length !== expected.schemas || result.auditCases.length !== expected.audit || result.publicationReceiptCases.length !== expected.publication || result.adjudicationCases.length !== expected.adjudication || result.allCases.length !== expected.total || result.failures.length) {
    console.error(`Phase 57P harness failed: ${result.failures.length} failing cases across ${result.allCases.length} executions.`);
    for (const failure of result.failures.slice(0, 30)) console.error(`- ${failure.test_id}: expected ${failure.expected_decision}, got ${failure.actual_decision}`);
    process.exit(1);
  }
  console.log("Phase 57P harness passed: 9 append-only audit-chain schemas, 81 audit-integrity cases, 162 publication-receipt cases, and 90 cross-role adjudication cases (333 total), with zero actual receipts, adjudications, triggers, closures, releases, or publications.");
}
