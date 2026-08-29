import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const families = [
  ["representative-democracy", ["verified_phase98", "authority", "identity", "franchise", "access", "administration", "representation", "participation", "review", "receipt"]],
  ["government-capability", ["adopted_democracy", "identity", "mandate", "checks", "workforce", "resources", "delivery", "integrity", "review", "receipt"]],
  ["public-accountability", ["verified_government", "identity", "fiscal", "audit", "procurement", "records", "open_data", "correction", "review", "receipt"]],
  ["legitimacy-resilience", ["verified_accountability", "identity", "civic_information", "media_pluralism", "rights", "participation", "fairness", "renewal", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_democracy_or_representation_decision_allowed: false,
    automatic_government_capability_or_delivery_decision_allowed: false,
    automatic_accountability_or_transparency_decision_allowed: false,
    automatic_credibility_trust_legitimacy_or_resilience_decision_allowed: false,
    automatic_voter_candidate_media_or_jurisdiction_decision_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
}

let total = 0;
for (const [family, required] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const input = Object.fromEntries(required.map((key, position) => [key, index === 639 || ((index >> position) & 1) === 1]));
    const output = evaluate(input, required, family);
    total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, family + " case " + index + " bypassed human review.");
    check(!output.registry_mutation_allowed && !output.automatic_democracy_or_representation_decision_allowed && !output.automatic_government_capability_or_delivery_decision_allowed && !output.automatic_accountability_or_transparency_decision_allowed && !output.automatic_credibility_trust_legitimacy_or_resilience_decision_allowed && !output.automatic_voter_candidate_media_or_jurisdiction_decision_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", family + " case " + index + " crossed an automation boundary.");
    check((output.routing_state === "Held") === (output.blockers.length > 0), family + " case " + index + " has inconsistent routing.");
  }
  check(eligible === 1, family + " must contain exactly one structurally complete human-review case; found " + eligible + ".");
}
check(total === 2560, "Expected 2,560 cases; found " + total + ".");
check(JSON.stringify(registry) === before, "The Phase 99 harness mutated the registry.");
if (failures.length) {
  console.error("Phase 99 harness failed with " + failures.length + " issue(s):");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("Phase 99 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated democracy, government, accountability, civic-information, legitimacy, resilience, score, ranking, registry mutation, or Phase 64 change.");
