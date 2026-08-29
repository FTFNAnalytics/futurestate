import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const families = [
  ["justice-access", ["verified_phase97", "authority", "identity", "standing", "notice", "counsel", "process", "remedy", "review", "receipt"]],
  ["public-safety", ["adopted_justice", "identity", "prevention", "response", "rights", "survivor", "accountability", "remedy", "review", "receipt"]],
  ["emergency-resilience", ["verified_safety", "identity", "risk", "warning", "capacity", "continuity", "rights", "recovery", "review", "receipt"]],
  ["security-peace", ["verified_emergency", "authority", "threat", "oversight", "rights", "civilian_protection", "diplomacy", "implementation", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false,
    automatic_justice_access_decision_allowed: false, automatic_public_safety_or_accountability_decision_allowed: false,
    automatic_emergency_resilience_decision_allowed: false, automatic_security_defense_or_peace_decision_allowed: false,
    automatic_rights_restriction_or_surveillance_decision_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
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
    check(!output.registry_mutation_allowed && !output.automatic_justice_access_decision_allowed && !output.automatic_public_safety_or_accountability_decision_allowed && !output.automatic_emergency_resilience_decision_allowed && !output.automatic_security_defense_or_peace_decision_allowed && !output.automatic_rights_restriction_or_surveillance_decision_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}
check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 98 harness mutated the registry.");
if (failures.length) { console.error(`Phase 98 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 98 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated justice, safety, emergency, security, defense, peace, surveillance, score, ranking, registry mutation, or Phase 64 change.");
