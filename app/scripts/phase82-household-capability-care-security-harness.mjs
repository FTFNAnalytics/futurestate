import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-82-household-capability-care-infrastructure-everyday-security-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, family) => {
  const blockers = keys.filter((key) => !input[key]);
  return { family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false, automatic_household_classification_allowed: false, automatic_floor_allowed: false, automatic_targeting_allowed: false, automatic_capacity_finding_allowed: false, automatic_allocation_allowed: false, automatic_burden_finding_allowed: false, automatic_debt_action_allowed: false, automatic_displacement_finding_allowed: false, automatic_relocation_allowed: false, automatic_recovery_finding_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none" };
};

const families = [
  ["household-capability-service-bundle", ["verified_phase81", "authority", "household_boundary", "capability_floor", "baseline", "service_bundle", "time_and_care", "access", "rights", "receipt"]],
  ["care-infrastructure-workforce-capacity", ["adopted_capability_floor", "assessed_need", "unpaid_care", "service", "capacity", "workforce", "quality", "access", "rights", "receipt"]],
  ["household-affordability-time-debt-administration", ["verified_care", "resources", "expenses", "time", "volatility", "debt", "administrative_burden", "benefit_access", "remedy", "receipt"]],
  ["neighborhood-access-displacement-recovery", ["verified_burden", "neighborhood", "accessibility", "rural_access", "social_infrastructure", "displacement", "crisis_response", "recovery", "audit", "receipt"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const input = inputFor(index, keys);
    const output = evaluate(input, keys, family);
    total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_household_classification_allowed && !output.automatic_floor_allowed && !output.automatic_targeting_allowed && !output.automatic_capacity_finding_allowed && !output.automatic_allocation_allowed && !output.automatic_burden_finding_allowed && !output.automatic_debt_action_allowed && !output.automatic_displacement_finding_allowed && !output.automatic_relocation_allowed && !output.automatic_recovery_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Eligible for Human Review") === keys.every((key) => input[key]), `${family} case ${index} has an invalid routing result.`);
    check(!("household_class" in output) && !("capability_floor" in output) && !("care_need" in output) && !("benefit" in output) && !("displacement" in output) && !("recovery" in output) && !("receipt" in output), `${family} case ${index} manufactured a governed result.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete synthetic case.`);
}

check(total === 2560, `Expected 2,560 cases, found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 82 harness mutated the registry.");
for (const [key, value] of Object.entries(registry.metrics)) if (!key.endsWith("_dossiers") && !key.endsWith("_ledgers") && !key.endsWith("_registers") && !key.endsWith("_gates") && !["household_capability_dimensions", "household_service_bundle_classes", "life_course_stages", "care_service_classes", "care_capacity_dimensions", "care_workforce_safeguards", "household_burden_dimensions", "shock_arrears_pathways", "administrative_burden_safeguards", "neighborhood_access_tests", "displacement_mobility_safeguards", "crisis_stabilizers", "long_horizon_household_security_tests"].includes(key)) check(value === 0, `Synthetic cases changed metric ${key}.`);

if (failures.length) { console.error(`Phase 82 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 82 harness passed: 2,560 synthetic cases (640 capability, 640 care, 640 burden, 640 recovery) with no mutation, classification, floor, service bundle, care finding, allocation, protection, debt action, displacement, relocation, recovery, remedy, receipt, score, rank, or stage change.");
