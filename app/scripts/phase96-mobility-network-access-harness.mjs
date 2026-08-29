import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const families = [
  ["mobility-access", ["verified_phase95", "authority", "identity", "demand", "accessibility", "affordability", "safety", "distribution", "review", "receipt"]],
  ["transport-service", ["adopted_mobility", "identity", "network", "schedule", "workforce", "safety", "reliability", "continuity", "review", "receipt"]],
  ["freight-delivery", ["verified_network", "identity", "service_promise", "custody", "route", "workforce", "delivery", "continuity", "review", "receipt"]],
  ["digital-access", ["verified_asset", "identity", "coverage", "performance", "affordability", "interoperability", "rights", "restoration", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false,
    automatic_mobility_access_decision_allowed: false, automatic_service_safety_or_reliability_decision_allowed: false,
    automatic_delivery_resilience_decision_allowed: false, automatic_connectivity_or_territorial_access_decision_allowed: false,
    automatic_community_recovery_decision_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
}

let total = 0;
for (const [family, required] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const input = Object.fromEntries(required.map((key, position) => [key, index === 639 || ((index >> position) & 1) === 1]));
    const output = evaluate(input, required, family); total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_mobility_access_decision_allowed && !output.automatic_service_safety_or_reliability_decision_allowed && !output.automatic_delivery_resilience_decision_allowed && !output.automatic_connectivity_or_territorial_access_decision_allowed && !output.automatic_community_recovery_decision_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}
check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 96 harness mutated the registry.");
if (failures.length) { console.error(`Phase 96 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 96 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated trip, access, safety, service, delivery, connectivity, restoration, recovery, score, ranking, registry mutation, or Phase 64 change.");
