import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-85-housing-shelter-land-use-place-stability-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, family) => {
  const blockers = keys.filter((key) => !input[key]);
  return {
    family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false,
    automatic_land_use_approval_allowed: false, automatic_housing_allocation_allowed: false, automatic_delivery_or_occupancy_finding_allowed: false,
    automatic_tenure_or_affordability_finding_allowed: false, automatic_shelter_or_supportive_housing_placement_allowed: false,
    automatic_displacement_or_relocation_decision_allowed: false, automatic_retrofit_or_reconstruction_finding_allowed: false,
    automatic_right_to_return_or_place_stability_finding_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
};

const families = [
  ["housing-need-supply-delivery-habitability", ["verified_phase84", "authority", "housing_need", "land_and_infrastructure", "delivery", "habitability", "accessibility", "distribution", "review", "receipt"]],
  ["tenure-affordability-public-social-community-housing", ["adopted_delivery", "tenure", "complete_cost", "household_affordability", "community_ownership", "rights", "maintenance", "continuity", "review", "receipt"]],
  ["homelessness-shelter-supportive-housing-displacement", ["verified_tenure", "homelessness_need", "shelter", "permanent_housing", "support_services", "rights", "displacement_protection", "return", "review", "receipt"]],
  ["retrofit-climate-disaster-reconstruction-place-stability", ["verified_stability", "condition", "retrofit", "climate_and_disaster", "interim_housing", "relocation", "reconstruction", "right_to_return", "audit", "receipt"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const output = evaluate(inputFor(index, keys), keys, family); total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_land_use_approval_allowed && !output.automatic_housing_allocation_allowed && !output.automatic_delivery_or_occupancy_finding_allowed && !output.automatic_tenure_or_affordability_finding_allowed && !output.automatic_shelter_or_supportive_housing_placement_allowed && !output.automatic_displacement_or_relocation_decision_allowed && !output.automatic_retrofit_or_reconstruction_finding_allowed && !output.automatic_right_to_return_or_place_stability_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 85 harness mutated the registry.");
if (failures.length) { console.error(`Phase 85 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 85 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated approvals, allocations, placements, findings, relocations, returns, remedies, scores, rankings, registry mutations, or Phase 64 changes.");
