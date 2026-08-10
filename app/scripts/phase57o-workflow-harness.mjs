import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const clone = (value) => structuredClone(value);
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

const signedFields = (receipt) => ({
  receipt_template_id: receipt.receipt_template_id,
  contract_id: receipt.contract_id,
  decision_type: receipt.decision_type,
  candidate_packet_id: receipt.candidate_packet_id,
  reviewer_identity: receipt.reviewer_identity,
  reason_code: receipt.reason_code,
  cited_source: receipt.cited_source,
  decision_time: receipt.decision_time,
  escalation_state: receipt.escalation_state,
  publication_review_handoff: receipt.publication_review_handoff,
});

const digest = (value) => createHash("sha256").update(canonical(value)).digest("hex");

export const makeSyntheticReceipt = (template) => {
  const contractKey = template.contract_id.toLowerCase().replaceAll("_", "-");
  const accept = template.decision_type === "accept";
  const receipt = {
    receipt_template_id: template.receipt_template_id,
    contract_id: template.contract_id,
    decision_type: template.decision_type,
    fixture_only: true,
    actual_receipt: false,
    candidate_packet_id: `FIXTURE-PACKET-${template.contract_id}`,
    reviewer_identity: {
      profile_id: `FIXTURE-EVIDENCE-REVIEWER-${template.contract_id}`,
      display_name: "Synthetic evidence reviewer",
      role: "evidence_reviewer",
    },
    reason_code: template.allowed_reason_codes[0],
    allowed_reason_codes: template.allowed_reason_codes,
    cited_source: {
      source_id: `fixture-source-${contractKey}`,
      official_url: `https://example.invalid/fixture/${contractKey}`,
      record_identifier: `FIXTURE-RECORD-${template.contract_id}`,
    },
    decision_time: "2026-08-09T12:00:00.000Z",
    escalation_state: "not_required",
    publication_review_handoff: accept ? {
      required: true,
      status: "ready_for_separate_review",
      reviewer_identity: {
        profile_id: `FIXTURE-PUBLICATION-REVIEWER-${template.contract_id}`,
        display_name: "Synthetic publication reviewer",
        role: "publication_reviewer",
      },
      handoff_time: "2026-08-09T12:05:00.000Z",
    } : {
      required: false,
      status: "not_applicable",
      reviewer_identity: null,
      handoff_time: null,
    },
    fires_trigger: false,
    closes_hold_automatically: false,
    automated_publication_allowed: false,
    evidence_created: false,
  };
  receipt.signed_snapshot = clone(signedFields(receipt));
  receipt.signed_digest = digest(receipt.signed_snapshot);
  return receipt;
};

const requiredValueMissing = (receipt) => {
  const required = [
    ["candidate_packet_id", receipt.candidate_packet_id],
    ["reviewer_identity.profile_id", receipt.reviewer_identity?.profile_id],
    ["reviewer_identity.role", receipt.reviewer_identity?.role],
    ["reason_code", receipt.reason_code],
    ["cited_source.source_id", receipt.cited_source?.source_id],
    ["cited_source.official_url", receipt.cited_source?.official_url],
    ["cited_source.record_identifier", receipt.cited_source?.record_identifier],
    ["decision_time", receipt.decision_time],
    ["escalation_state", receipt.escalation_state],
  ];
  if (receipt.decision_type === "accept") {
    required.push(
      ["publication_review_handoff.status", receipt.publication_review_handoff?.status],
      ["publication_review_handoff.reviewer_identity.profile_id", receipt.publication_review_handoff?.reviewer_identity?.profile_id],
      ["publication_review_handoff.handoff_time", receipt.publication_review_handoff?.handoff_time],
    );
  }
  return required.find(([, value]) => value === null || value === undefined || value === "")?.[0] ?? null;
};

export const validateReceiptIntegrity = (receipt) => {
  const missing = requiredValueMissing(receipt);
  if (missing) return { decision: "reject_missing_required_field", reason_code: "missing_required_field", field: missing };
  if (!receipt.allowed_reason_codes.includes(receipt.reason_code)) {
    return { decision: "reject_reason_code_incompatible", reason_code: "decision_reason_code_incompatible" };
  }
  if (JSON.stringify(receipt.cited_source) !== JSON.stringify(receipt.signed_snapshot?.cited_source)) {
    return { decision: "reject_citation_mutated", reason_code: "signed_citation_changed" };
  }
  if (receipt.decision_time !== receipt.signed_snapshot?.decision_time) {
    return { decision: "reject_decision_time_mutated", reason_code: "signed_decision_time_changed" };
  }
  if (digest(signedFields(receipt)) !== receipt.signed_digest) {
    return { decision: "reject_signed_receipt_mutated", reason_code: "signed_receipt_digest_mismatch" };
  }
  if (receipt.decision_type === "accept" && receipt.publication_review_handoff.status !== "ready_for_separate_review") {
    return { decision: "reject_accept_handoff_incomplete", reason_code: "accept_handoff_not_ready" };
  }
  if (receipt.decision_type !== "accept" && receipt.publication_review_handoff.status !== "not_applicable") {
    return { decision: "reject_nonaccept_handoff", reason_code: "nonaccept_cannot_enter_publication_review" };
  }
  return { decision: "integrity_valid", reason_code: "all_receipt_integrity_checks_passed" };
};

const mutationCases = (template) => {
  const complete = makeSyntheticReceipt(template);
  const missing = clone(complete);
  missing.cited_source.record_identifier = null;
  const wrongReason = clone(complete);
  wrongReason.reason_code = "fixture_incompatible_reason_code";
  const mutatedCitation = clone(complete);
  mutatedCitation.cited_source.official_url = `${mutatedCitation.cited_source.official_url}/mutated`;
  const mutatedTime = clone(complete);
  mutatedTime.decision_time = "2026-08-09T12:01:00.000Z";
  return [
    { test_class: "complete_synthetic_receipt", input: complete, expected_decision: "integrity_valid" },
    { test_class: "missing_required_field", input: missing, expected_decision: "reject_missing_required_field" },
    { test_class: "incompatible_reason_code", input: wrongReason, expected_decision: "reject_reason_code_incompatible" },
    { test_class: "mutated_citation", input: mutatedCitation, expected_decision: "reject_citation_mutated" },
    { test_class: "mutated_decision_time", input: mutatedTime, expected_decision: "reject_decision_time_mutated" },
  ];
};

export const buildReceiptIntegrityCases = (templates) => templates.flatMap((template) =>
  mutationCases(template).map((test) => {
    const actual = validateReceiptIntegrity(test.input);
    return {
      test_id: `57O-INTEGRITY-${template.receipt_template_id}-${test.test_class}`,
      receipt_template_id: template.receipt_template_id,
      contract_id: template.contract_id,
      evidence_rail: template.evidence_rail,
      decision_type: template.decision_type,
      test_class: test.test_class,
      fixture_only: true,
      actual_receipt: false,
      expected_decision: test.expected_decision,
      actual_decision: actual.decision,
      reason_code: actual.reason_code,
      failed_field: actual.field ?? null,
      passed: actual.decision === test.expected_decision,
      fires_trigger: false,
      closes_hold_automatically: false,
      automated_publication_allowed: false,
      evidence_created: false,
    };
  })
);

export const buildRoleAuthorizationMatrices = (templates) => {
  const byContract = Map.groupBy(templates, (template) => template.contract_id);
  return [...byContract.entries()].map(([contractId, rows]) => ({
    matrix_id: `57O-ROLE-MATRIX-${contractId}`,
    contract_id: contractId,
    queue_id: rows[0].queue_id,
    evidence_rail: rows[0].evidence_rail,
    role_classes: [
      {
        role: "evidence_reviewer",
        may: ["review_candidate_packet", "select_bounded_decision", "sign_evidence_receipt"],
        may_not: ["perform_publication_review", "mutate_signed_receipt", "fire_reopening_trigger", "close_hold", "publish"],
      },
      {
        role: "publication_reviewer",
        may: ["verify_complete_accept_receipt", "record_separate_publication_review_outcome"],
        may_not: ["act_as_evidence_reviewer_for_same_packet", "mutate_signed_receipt", "fire_reopening_trigger", "close_hold_automatically", "publish_automatically"],
      },
      {
        role: "escalation_reviewer",
        may: ["resolve_role_authorization_escalation", "resolve_receipt_integrity_escalation"],
        may_not: ["supply_missing_evidence", "mutate_signed_receipt", "fire_reopening_trigger", "close_hold", "publish"],
      },
    ],
    decision_authorizations: rows.map((row) => ({
      receipt_template_id: row.receipt_template_id,
      decision_type: row.decision_type,
      evidence_reviewer_required: true,
      publication_reviewer_required: row.decision_type === "accept",
      separation_of_duties_required: row.decision_type === "accept",
      publication_queue_entry_allowed: row.decision_type === "accept",
      automated_publication_allowed: false,
    })),
  }));
};

export const authorizeReceiptRoles = (receipt) => {
  if (receipt.reviewer_identity?.role !== "evidence_reviewer") {
    return { decision: "authorization_rejected", reason_code: "evidence_reviewer_role_required" };
  }
  if (receipt.decision_type !== "accept") {
    if (receipt.publication_review_handoff?.reviewer_identity) {
      return { decision: "authorization_rejected", reason_code: "nonaccept_publication_reviewer_not_allowed" };
    }
    return { decision: "authorized_for_fixture_review", reason_code: "bounded_nonaccept_role_authorized" };
  }
  const publicationReviewer = receipt.publication_review_handoff?.reviewer_identity;
  if (publicationReviewer?.role !== "publication_reviewer") {
    return { decision: "authorization_rejected", reason_code: "publication_reviewer_role_required" };
  }
  if (publicationReviewer.profile_id === receipt.reviewer_identity.profile_id) {
    return { decision: "authorization_rejected", reason_code: "evidence_and_publication_reviewers_must_differ" };
  }
  return { decision: "authorized_for_fixture_review", reason_code: "separate_reviewers_authorized" };
};

export const buildRoleAuthorizationCases = (templates) => templates.flatMap((template) => {
  const receipt = makeSyntheticReceipt(template);
  const valid = authorizeReceiptRoles(receipt);
  const cases = [{
    test_id: `57O-ROLE-${template.receipt_template_id}-authorized`,
    receipt_template_id: template.receipt_template_id,
    contract_id: template.contract_id,
    evidence_rail: template.evidence_rail,
    decision_type: template.decision_type,
    test_class: "authorized_role_configuration",
    expected_decision: "authorized_for_fixture_review",
    actual_decision: valid.decision,
    reason_code: valid.reason_code,
    passed: valid.decision === "authorized_for_fixture_review",
    fixture_only: true,
  }];
  if (template.decision_type === "accept") {
    const sameActor = clone(receipt);
    sameActor.publication_review_handoff.reviewer_identity.profile_id = sameActor.reviewer_identity.profile_id;
    const rejected = authorizeReceiptRoles(sameActor);
    cases.push({
      test_id: `57O-ROLE-${template.receipt_template_id}-same-actor-rejected`,
      receipt_template_id: template.receipt_template_id,
      contract_id: template.contract_id,
      evidence_rail: template.evidence_rail,
      decision_type: template.decision_type,
      test_class: "same_actor_separation_rejection",
      expected_decision: "authorization_rejected",
      actual_decision: rejected.decision,
      reason_code: rejected.reason_code,
      passed: rejected.decision === "authorization_rejected" && rejected.reason_code === "evidence_and_publication_reviewers_must_differ",
      fixture_only: true,
    });
  }
  return cases.map((row) => ({
    ...row,
    actual_reviewer_identity_created: false,
    fires_trigger: false,
    closes_hold_automatically: false,
    automated_publication_allowed: false,
    evidence_created: false,
  }));
});

export const buildPublicationHandoffStateMachines = (templates) => {
  const byContract = Map.groupBy(templates, (template) => template.contract_id);
  return [...byContract.entries()].map(([contractId, rows]) => ({
    state_machine_id: `57O-HANDOFF-MACHINE-${contractId}`,
    contract_id: contractId,
    queue_id: rows[0].queue_id,
    evidence_rail: rows[0].evidence_rail,
    decision_types: rows.map((row) => row.decision_type),
    initial_state: "draft_receipt",
    terminal_states: ["integrity_rejected", "authorization_rejected", "decision_terminal_no_handoff", "publication_review_recorded"],
    transitions: [
      { from: "draft_receipt", to: "evidence_review_complete", condition: "named evidence reviewer signs a fixture receipt" },
      { from: "evidence_review_complete", to: "integrity_rejected", condition: "required field, reason code, citation, timestamp, or digest fails" },
      { from: "evidence_review_complete", to: "decision_terminal_no_handoff", condition: "decision is not accept" },
      { from: "evidence_review_complete", to: "authorization_rejected", condition: "publication reviewer is missing, unauthorized, or identical to evidence reviewer" },
      { from: "evidence_review_complete", to: "awaiting_separate_publication_review", condition: "complete accept receipt and distinct authorized publication reviewer" },
      { from: "awaiting_separate_publication_review", to: "publication_review_recorded", condition: "separate human publication reviewer records a later decision" },
    ],
    prohibited_transitions: [
      "draft_receipt_to_publication_review",
      "nonaccept_to_publication_review",
      "integrity_rejected_to_publication_review",
      "awaiting_separate_publication_review_to_automatic_trigger",
      "awaiting_separate_publication_review_to_automatic_closure",
      "awaiting_separate_publication_review_to_automatic_publication",
    ],
  }));
};

const routeHandoff = (receipt) => {
  const integrity = validateReceiptIntegrity(receipt);
  if (integrity.decision !== "integrity_valid") return { state: "integrity_rejected", reason_code: integrity.reason_code };
  if (receipt.decision_type !== "accept") return { state: "decision_terminal_no_handoff", reason_code: "nonaccept_decision_does_not_enter_publication_review" };
  const authorization = authorizeReceiptRoles(receipt);
  if (authorization.decision !== "authorized_for_fixture_review") return { state: "authorization_rejected", reason_code: authorization.reason_code };
  return { state: "awaiting_separate_publication_review", reason_code: "complete_accept_receipt_ready_for_separate_review" };
};

export const buildPublicationHandoffCases = (templates) => templates.flatMap((template) => {
  const complete = makeSyntheticReceipt(template);
  const expected = template.decision_type === "accept" ? "awaiting_separate_publication_review" : "decision_terminal_no_handoff";
  const routed = routeHandoff(complete);
  const cases = [{
    test_id: `57O-HANDOFF-${template.receipt_template_id}-complete`,
    receipt_template_id: template.receipt_template_id,
    contract_id: template.contract_id,
    evidence_rail: template.evidence_rail,
    decision_type: template.decision_type,
    test_class: "complete_receipt_state_route",
    expected_state: expected,
    actual_state: routed.state,
    reason_code: routed.reason_code,
    passed: routed.state === expected,
  }];
  if (template.decision_type === "accept") {
    for (const mutation of mutationCases(template).filter((row) => row.test_class !== "complete_synthetic_receipt")) {
      const result = routeHandoff(mutation.input);
      cases.push({
        test_id: `57O-HANDOFF-${template.receipt_template_id}-${mutation.test_class}`,
        receipt_template_id: template.receipt_template_id,
        contract_id: template.contract_id,
        evidence_rail: template.evidence_rail,
        decision_type: template.decision_type,
        test_class: `invalid_accept_${mutation.test_class}`,
        expected_state: "integrity_rejected",
        actual_state: result.state,
        reason_code: result.reason_code,
        passed: result.state === "integrity_rejected",
      });
    }
  }
  return cases.map((row) => ({
    ...row,
    fixture_only: true,
    actual_publication_review_handoff: false,
    fires_trigger: false,
    closes_hold_automatically: false,
    automated_publication_allowed: false,
    evidence_created: false,
  }));
});

export const countBy = (rows, field) => rows.reduce((counts, row) => {
  const value = row[field];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

export const runPhase57oHarness = (templates) => {
  const matrices = buildRoleAuthorizationMatrices(templates);
  const integrityCases = buildReceiptIntegrityCases(templates);
  const roleCases = buildRoleAuthorizationCases(templates);
  const stateMachines = buildPublicationHandoffStateMachines(templates);
  const handoffCases = buildPublicationHandoffCases(templates);
  const allCases = [...integrityCases, ...roleCases, ...handoffCases];
  return {
    matrices,
    integrityCases,
    roleCases,
    stateMachines,
    handoffCases,
    allCases,
    failures: allCases.filter((row) => !row.passed),
  };
};

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) {
  const appRoot = fileURLToPath(new URL("..", import.meta.url));
  const receipts = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57n-reviewer-receipt-ledger.json"), "utf8"));
  const result = runPhase57oHarness(receipts.templates);
  const expected = { matrices: 9, integrity: 270, roles: 63, machines: 9, handoffs: 90, total: 423 };
  if (
    result.matrices.length !== expected.matrices ||
    result.integrityCases.length !== expected.integrity ||
    result.roleCases.length !== expected.roles ||
    result.stateMachines.length !== expected.machines ||
    result.handoffCases.length !== expected.handoffs ||
    result.allCases.length !== expected.total ||
    result.failures.length
  ) {
    console.error(`Phase 57O harness failed: ${result.failures.length} failing cases across ${result.allCases.length} executions.`);
    for (const failure of result.failures.slice(0, 20)) console.error(`- ${failure.test_id}`);
    process.exit(1);
  }
  console.log("Phase 57O harness passed: 9 role matrices, 270 receipt-integrity cases, 63 role-authorization cases, and 90 publication-handoff cases (423 total), with zero actual receipts, reviewers, handoffs, triggers, closures, or publications.");
}
