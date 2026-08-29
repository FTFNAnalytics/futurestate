import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-70-observation-review-series-admission-registry.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function inspectReview(docket, fixture) {
  if (fixture.requested_action === "direct_accept" || fixture.requested_action === "direct_publish") return "rejected_automatic_state_change";
  if (!fixture.payload) return "rejected_missing_submission";
  if (fixture.payload.specification_id !== docket.specification_id || fixture.payload.cohort_id !== docket.cohort_id || fixture.payload.named_entity !== docket.named_entity) return "rejected_identity_or_scope";
  const required = ["source_id", "issuing_authority", "artifact_locator", "observed_date", "period_start", "period_end", "numerator_value", "numerator_unit", "denominator_value_or_na", "denominator_unit_or_na", "method_version", "acceptance_and_recurrence_basis", "exceptions_and_adverse_observations", "revision_and_correction_status", "required_propagation"];
  if (required.some((field) => fixture.payload[field] === null || fixture.payload[field] === undefined || fixture.payload[field] === "")) return "rejected_incomplete_packet";
  if (fixture.payload.period_start > fixture.payload.period_end) return "rejected_invalid_period";
  if (fixture.requested_action === "second_review" && fixture.first_reviewer_id === fixture.second_reviewer_id) return "rejected_non_independent_review";
  return fixture.requested_action === "second_review" ? "eligible_for_adjudication" : "eligible_for_first_review";
}

function inspectAdmission(docket, fixture) {
  if (fixture.requested_action === "auto_admit") return "rejected_automatic_admission";
  if (fixture.cohort_id !== docket.cohort_id) return "rejected_identity_or_scope";
  if (!fixture.observations?.length) return "not_ready_no_reviewed_observations";
  if (fixture.observations.some((item) => item.review_state !== "Accepted Observation")) return "not_ready_incomplete_dual_review";
  if (fixture.unresolved_breaks > 0) return "held_unresolved_break";
  if (fixture.compatibility_state === "incompatible") return "segment_or_hold_for_compatibility";
  if (fixture.propagation_status !== "complete") return "held_incomplete_propagation";
  return "eligible_for_human_admission_decision";
}

let reviewCases = 0;
for (const docket of registry.observation_review_dockets) {
  const payload = {
    specification_id: docket.specification_id,
    cohort_id: docket.cohort_id,
    named_entity: docket.named_entity,
    source_id: "synthetic-source",
    issuing_authority: "synthetic-authority",
    artifact_locator: "synthetic://fixture",
    observed_date: "2099-01-31",
    period_start: "2099-01-01",
    period_end: "2099-01-31",
    numerator_value: 1,
    numerator_unit: "synthetic-unit",
    denominator_value_or_na: 1,
    denominator_unit_or_na: "synthetic-unit",
    method_version: "synthetic-v1",
    acceptance_and_recurrence_basis: "synthetic-review-only",
    exceptions_and_adverse_observations: "synthetic-none-assertion",
    revision_and_correction_status: "synthetic-original",
    required_propagation: ["synthetic-review-surface"]
  };
  const cases = [
    ["complete", { payload, requested_action: "first_review" }, "eligible_for_first_review"],
    ["missing_submission", { payload: null, requested_action: "first_review" }, "rejected_missing_submission"],
    ["wrong_spec", { payload: { ...payload, specification_id: "wrong" }, requested_action: "first_review" }, "rejected_identity_or_scope"],
    ["wrong_entity", { payload: { ...payload, named_entity: "wrong" }, requested_action: "first_review" }, "rejected_identity_or_scope"],
    ["missing_authority", { payload: { ...payload, issuing_authority: null }, requested_action: "first_review" }, "rejected_incomplete_packet"],
    ["invalid_period", { payload: { ...payload, period_start: "2099-02-01" }, requested_action: "first_review" }, "rejected_invalid_period"],
    ["missing_numerator_unit", { payload: { ...payload, numerator_unit: null }, requested_action: "first_review" }, "rejected_incomplete_packet"],
    ["missing_denominator_unit", { payload: { ...payload, denominator_unit_or_na: null }, requested_action: "first_review" }, "rejected_incomplete_packet"],
    ["missing_method", { payload: { ...payload, method_version: null }, requested_action: "first_review" }, "rejected_incomplete_packet"],
    ["hidden_revision", { payload: { ...payload, revision_and_correction_status: null }, requested_action: "first_review" }, "rejected_incomplete_packet"],
    ["same_reviewer", { payload, requested_action: "second_review", first_reviewer_id: "reviewer-a", second_reviewer_id: "reviewer-a" }, "rejected_non_independent_review"],
    ["direct_accept", { payload, requested_action: "direct_accept" }, "rejected_automatic_state_change"]
  ];
  for (const [name, fixture, expected] of cases) {
    reviewCases += 1;
    check(inspectReview(docket, fixture) === expected, `${docket.review_docket_id} failed ${name}.`);
  }
}

let admissionCases = 0;
for (const docket of registry.series_admission_dockets) {
  const accepted = [{ observation_id: "synthetic-observation", review_state: "Accepted Observation" }];
  const cases = [
    ["no_observations", { cohort_id: docket.cohort_id, observations: [], requested_action: "review" }, "not_ready_no_reviewed_observations"],
    ["first_review_only", { cohort_id: docket.cohort_id, observations: [{ review_state: "Eligible For Second Review" }], requested_action: "review" }, "not_ready_incomplete_dual_review"],
    ["human_decision_only", { cohort_id: docket.cohort_id, observations: accepted, unresolved_breaks: 0, compatibility_state: "compatible", propagation_status: "complete", requested_action: "review" }, "eligible_for_human_admission_decision"],
    ["wrong_cohort", { cohort_id: "wrong", observations: accepted, requested_action: "review" }, "rejected_identity_or_scope"],
    ["unresolved_break", { cohort_id: docket.cohort_id, observations: accepted, unresolved_breaks: 1, requested_action: "review" }, "held_unresolved_break"],
    ["incompatible_method", { cohort_id: docket.cohort_id, observations: accepted, unresolved_breaks: 0, compatibility_state: "incompatible", requested_action: "review" }, "segment_or_hold_for_compatibility"],
    ["incomplete_propagation", { cohort_id: docket.cohort_id, observations: accepted, unresolved_breaks: 0, compatibility_state: "compatible", propagation_status: "partial", requested_action: "review" }, "held_incomplete_propagation"],
    ["automatic_admission", { cohort_id: docket.cohort_id, observations: accepted, requested_action: "auto_admit" }, "rejected_automatic_admission"]
  ];
  for (const [name, fixture, expected] of cases) {
    admissionCases += 1;
    check(inspectAdmission(docket, fixture) === expected, `${docket.admission_docket_id} failed ${name}.`);
  }
}

check(reviewCases === 384, `Expected 384 review cases, found ${reviewCases}.`);
check(admissionCases === 64, `Expected 64 admission cases, found ${admissionCases}.`);
check(registry.metrics.submitted_observations === 0 && registry.metrics.accepted_observations === 0 && registry.metrics.admitted_series_created === 0, "The synthetic harness must not mutate real state.");

if (failures.length) {
  console.error("Phase 70 synthetic harness failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 70 synthetic harness passed: 384 observation-review cases plus 64 series-admission cases, 448 total, with no real submission, review, receipt, observation, revision, or series state created.");
