import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const qualification = await readJson("src", "data", "phase-67-qualification-admissibility-fixtures.json");
const returns = await readJson("src", "data", "phase-67-return-workflow-fixtures.json");
const failures = [];

function qualificationDecision(inputs) {
  const required = [
    "same_entity",
    "recognized_authority",
    "scope_matches",
    "date_present",
    "method_declared",
    "denominator_declared_or_na",
    "exceptions_declared",
    "correction_trail_declared",
    "stage_matches",
    "receipt_after_check",
    "propagation_complete",
    "human_review_required"
  ];
  return required.every((field) => inputs[field] === true) ? "eligible_for_human_review" : "reject";
}

function returnDecision(inputs) {
  const required = [
    "scheduled_date_present",
    "receipt_absent",
    "decision_absent",
    "source_resolves",
    "signal_resolves",
    "artifact_defined",
    "binding_matches",
    "propagation_not_started"
  ];
  return required.every((field) => inputs[field] === true) ? "scheduled" : "reject";
}

for (const fixture of qualification.fixtures) {
  const actual = qualificationDecision(fixture.inputs);
  if (actual !== fixture.expected) failures.push(`${fixture.fixture_id}: expected ${fixture.expected}, got ${actual}.`);
  if (!fixture.synthetic_only) failures.push(`${fixture.fixture_id}: a qualification fixture is not marked synthetic-only.`);
}
for (const fixture of returns.fixtures) {
  const actual = returnDecision(fixture.inputs);
  if (actual !== fixture.expected) failures.push(`${fixture.fixture_id}: expected ${fixture.expected}, got ${actual}.`);
  if (!fixture.synthetic_only) failures.push(`${fixture.fixture_id}: a return fixture is not marked synthetic-only.`);
}

if (failures.length) {
  console.error("Phase 67 admissibility harness failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 67 admissibility harness passed: ${qualification.fixtures.length} qualification cases and ${returns.fixtures.length} future-return workflow cases (${qualification.fixtures.length + returns.fixtures.length} total), with structural eligibility stopping at human review and all malformed, premature, cross-entity, cross-stage, or partially propagated fixtures rejected.`);
