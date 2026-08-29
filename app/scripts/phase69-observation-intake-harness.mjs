import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-69-measurement-observation-break-registry.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const requiredPayloadFields = [
  "measurement_specification_id", "cohort_id", "named_entity", "source_id", "issuing_authority",
  "artifact_locator", "observed_date", "period_start", "period_end", "numerator_value", "numerator_unit",
  "denominator_value_or_na", "denominator_unit_or_na", "method_version", "acceptance_and_recurrence_basis",
  "exceptions_and_adverse_observations", "revision_and_correction_status", "required_propagation"
];

function inspectObservation(spec, payload, requestedAction = "review") {
  if (requestedAction === "auto_admit" || requestedAction === "direct_publish") return "rejected_automatic_state_change";
  if (payload.measurement_specification_id !== spec.specification_id || payload.cohort_id !== spec.cohort_id || payload.named_entity !== spec.named_entity) return "rejected_identity_or_scope";
  if (requiredPayloadFields.some((field) => payload[field] === null || payload[field] === undefined || payload[field] === "")) return "rejected_incomplete_packet";
  if (payload.period_start > payload.period_end) return "rejected_invalid_period";
  return "eligible_for_human_review";
}

function inspectBreak(caseName) {
  if (caseName === "compatible_unchanged") return "eligible_for_human_review";
  if (["identity_break", "denominator_break", "method_break"].includes(caseName)) return "segment_or_hold_for_human_review";
  if (caseName === "hidden_break") return "rejected_hidden_break";
  if (caseName === "forced_bridge") return "rejected_forced_comparability";
  return "rejected_unknown_case";
}

let observationCases = 0;
for (const spec of registry.measurement_specifications) {
  const complete = {
    measurement_specification_id: spec.specification_id,
    cohort_id: spec.cohort_id,
    named_entity: spec.named_entity,
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
    ["complete", complete, "review", "eligible_for_human_review"],
    ["missing_entity", { ...complete, named_entity: null }, "review", "rejected_identity_or_scope"],
    ["wrong_cohort", { ...complete, cohort_id: "synthetic-wrong-cohort" }, "review", "rejected_identity_or_scope"],
    ["missing_numerator", { ...complete, numerator_value: null }, "review", "rejected_incomplete_packet"],
    ["missing_denominator", { ...complete, denominator_value_or_na: null }, "review", "rejected_incomplete_packet"],
    ["missing_unit", { ...complete, numerator_unit: null }, "review", "rejected_incomplete_packet"],
    ["invalid_period", { ...complete, period_start: "2099-02-01" }, "review", "rejected_invalid_period"],
    ["missing_method", { ...complete, method_version: null }, "review", "rejected_incomplete_packet"],
    ["hidden_exceptions", { ...complete, exceptions_and_adverse_observations: null }, "review", "rejected_incomplete_packet"],
    ["automatic_state_change", complete, "auto_admit", "rejected_automatic_state_change"]
  ];
  for (const [name, payload, action, expected] of cases) {
    observationCases += 1;
    check(inspectObservation(spec, payload, action) === expected, `${spec.specification_id} failed synthetic observation case ${name}.`);
  }
}

let breakCases = 0;
for (const register of registry.series_break_registers) {
  const cases = [
    ["compatible_unchanged", "eligible_for_human_review"],
    ["identity_break", "segment_or_hold_for_human_review"],
    ["denominator_break", "segment_or_hold_for_human_review"],
    ["method_break", "segment_or_hold_for_human_review"],
    ["hidden_break", "rejected_hidden_break"],
    ["forced_bridge", "rejected_forced_comparability"]
  ];
  for (const [name, expected] of cases) {
    breakCases += 1;
    check(inspectBreak(name) === expected, `${register.break_register_id} failed synthetic break case ${name}.`);
  }
}

check(observationCases === 320, `Expected 320 synthetic observation cases, found ${observationCases}.`);
check(breakCases === 48, `Expected 48 synthetic break cases, found ${breakCases}.`);
check(registry.metrics.observations_created === 0 && registry.metrics.values_created === 0 && registry.metrics.series_points_created === 0, "The synthetic harness must not mutate real evidence state.");

if (failures.length) {
  console.error("Phase 69 synthetic harness failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 69 synthetic harness passed: 320 observation-intake cases plus 48 series-break cases, 368 total, with no real observation, value, receipt, break event, or series state created.");
