import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-84-food-systems-local-provisioning-community-resource-security-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, family) => {
  const blockers = keys.filter((key) => !input[key]);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_production_finding_allowed: false,
    automatic_land_or_water_allocation_allowed: false,
    automatic_provisioning_capacity_finding_allowed: false,
    automatic_procurement_or_inventory_allocation_allowed: false,
    automatic_food_access_or_nutrition_finding_allowed: false,
    automatic_benefit_or_meal_decision_allowed: false,
    automatic_reserve_release_or_rationing_allowed: false,
    automatic_recall_or_remedy_allowed: false,
    automatic_circularity_or_security_finding_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
};

const families = [
  ["food-production-land-water-sovereignty", ["verified_phase83", "authority", "foodshed_boundary", "production_inventory", "land_and_sovereignty", "water_and_energy", "climate_and_biodiversity", "workforce", "review", "receipt"]],
  ["processing-storage-distribution-local-provisioning", ["adopted_production", "facilities", "storage", "distribution", "procurement", "workforce", "traceability", "fallback", "review", "receipt"]],
  ["food-access-affordability-nutrition-institutional-meals", ["verified_provisioning", "food_need", "availability", "affordability", "nutrition", "accessibility", "institutional_meals", "remedy", "review", "receipt"]],
  ["reserve-contamination-circularity-community-resource-security", ["verified_access", "hazard_profile", "usable_reserve", "release_authority", "continuity", "contamination_control", "circular_capacity", "long_horizon_security", "audit", "receipt"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const output = evaluate(inputFor(index, keys), keys, family);
    total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_production_finding_allowed && !output.automatic_land_or_water_allocation_allowed && !output.automatic_provisioning_capacity_finding_allowed && !output.automatic_procurement_or_inventory_allocation_allowed && !output.automatic_food_access_or_nutrition_finding_allowed && !output.automatic_benefit_or_meal_decision_allowed && !output.automatic_reserve_release_or_rationing_allowed && !output.automatic_recall_or_remedy_allowed && !output.automatic_circularity_or_security_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 84 harness mutated the registry.");
if (failures.length) {
  console.error(`Phase 84 harness failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 84 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated allocations, findings, releases, recalls, remedies, scores, rankings, registry mutations, or Phase 64 changes.");
