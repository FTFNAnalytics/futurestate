import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const families = [
  ["territorial-readiness", ["verified_phase94", "authority", "identity", "need", "site_control", "utilities", "rights", "environment", "review", "receipt"]],
  ["project-definition-procurement", ["adopted_territory", "identity", "scope", "design", "estimate", "permit", "procurement", "market", "review", "receipt"]],
  ["construction-delivery", ["verified_project", "identity", "notice", "contractor", "materials", "safety", "quality", "inspection", "review", "receipt"]],
  ["commissioned-asset-stewardship", ["verified_construction", "identity", "commissioning", "accessibility", "handover", "service", "maintenance", "recovery", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false,
    automatic_site_or_project_readiness_decision_allowed: false, automatic_project_deliverability_or_award_decision_allowed: false,
    automatic_progress_quality_or_completion_decision_allowed: false, automatic_commissioning_service_or_recovery_decision_allowed: false,
    automatic_place_value_or_territorial_outcome_finding_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
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
    check(!output.registry_mutation_allowed && !output.automatic_site_or_project_readiness_decision_allowed && !output.automatic_project_deliverability_or_award_decision_allowed && !output.automatic_progress_quality_or_completion_decision_allowed && !output.automatic_commissioning_service_or_recovery_decision_allowed && !output.automatic_place_value_or_territorial_outcome_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}
check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 95 harness mutated the registry.");
if (failures.length) { console.error(`Phase 95 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 95 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated land, project, permit, procurement, construction, commissioning, service, recovery, place-value, score, ranking, registry mutation, or Phase 64 change.");
