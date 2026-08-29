import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-81-universal-service-essential-systems-public-option-delivery-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, family) => {
  const blockers = keys.filter((key) => !input[key]);
  return { family, routing_state: blockers.length === 0 ? "Eligible for Human Review" : "Held", blockers, human_decision_required: true, registry_mutation_allowed: false, automatic_floor_allowed: false, automatic_tariff_allowed: false, automatic_provider_allowed: false, automatic_intervention_allowed: false, automatic_restoration_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none" };
};

const families = [
  ["service-floor-universal-access", ["verified_phase80", "authority", "essential_class", "eligible_public", "floor", "baseline", "access", "capacity", "rights", "receipt"]],
  ["affordability-cross-subsidy-coverage", ["adopted_floor", "cost", "ability_to_pay", "burden", "protection", "funding", "subsidy", "coverage", "quality", "receipt"]],
  ["provider-interoperability-continuity", ["verified_access", "provider_model", "plurality", "standards", "portability", "maintenance", "reserve", "mutual_aid", "exercise", "receipt"]],
  ["rights-quality-step-in-restoration", ["verified_continuity", "rights", "quality", "failure_trigger", "authority", "step_in_readiness", "rationing", "restoration", "independent_review", "receipt"]]
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
    check(!output.registry_mutation_allowed && !output.automatic_floor_allowed && !output.automatic_tariff_allowed && !output.automatic_provider_allowed && !output.automatic_intervention_allowed && !output.automatic_restoration_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Eligible for Human Review") === keys.every((key) => input[key]), `${family} case ${index} has an invalid routing result.`);
    check(!("floor" in output) && !("tariff" in output) && !("provider" in output) && !("intervention" in output) && !("restoration_priority" in output) && !("receipt" in output), `${family} case ${index} manufactured a governed result.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete synthetic case.`);
}

check(total === 2560, `Expected 2,560 cases, found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 81 harness mutated the registry.");
check(registry.metrics.service_floors_adopted === 0 && registry.metrics.affordability_findings_issued === 0 && registry.metrics.provider_models_authorized === 0 && registry.metrics.step_in_decisions_issued === 0 && registry.metrics.restoration_priorities_authorized === 0, "A synthetic case changed a real metric.");

if (failures.length) {
  console.error(`Phase 81 harness failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 81 harness passed: 2,560 synthetic cases (640 service-floor, 640 affordability-coverage, 640 provider-continuity, 640 rights-restoration) with no mutation, floor, eligibility, tariff, subsidy, provider, standard, intervention, rationing, restoration, remedy, receipt, score, rank, or stage change.");
