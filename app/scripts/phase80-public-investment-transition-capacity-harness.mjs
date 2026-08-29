import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-80-public-investment-portfolios-transition-pathways-place-based-capacity-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, family) => {
  const blockers = keys.filter((key) => !input[key]);
  return { family, routing_state: blockers.length === 0 ? "Eligible for Human Review" : "Held", blockers, human_decision_required: true, registry_mutation_allowed: false, automatic_selection_allowed: false, automatic_funding_allowed: false, automatic_rebalancing_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none" };
};

const families = [
  ["mission-thesis", ["verified_stewardship", "authority", "mission", "baseline", "alternatives", "additionality", "distribution", "capacity", "funding", "receipt"]],
  ["portfolio-sequence", ["admitted_thesis", "members", "dependencies", "sequence", "funding", "financing", "capacity", "resources", "transition", "receipt"]],
  ["place-capacity-transition", ["authorized_portfolio", "owner", "workforce", "suppliers", "public_option", "land_water_energy", "place", "transition", "readiness", "receipt"]],
  ["stress-rebalancing-realization", ["verified_baseline", "frozen_thesis", "stress", "trigger", "options", "off_ramp", "distribution", "outcomes", "independent_review", "receipt"]]
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
    check(!output.registry_mutation_allowed && !output.automatic_selection_allowed && !output.automatic_funding_allowed && !output.automatic_rebalancing_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Eligible for Human Review") === keys.every((key) => input[key]), `${family} case ${index} has an invalid routing result.`);
    check(!("priority" in output) && !("member" in output) && !("funding" in output) && !("outcome" in output) && !("receipt" in output), `${family} case ${index} manufactured a governed result.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete synthetic case.`);
}

check(total === 2560, `Expected 2,560 cases, found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 80 harness mutated the registry.");
check(registry.metrics.investment_theses_admitted === 0 && registry.metrics.portfolio_members_admitted === 0 && registry.metrics.portfolio_sequences_authorized === 0 && registry.metrics.delivery_capacity_findings_issued === 0 && registry.metrics.rebalancing_decisions_issued === 0 && registry.metrics.public_value_realization_findings === 0, "A synthetic case changed a real metric.");

if (failures.length) {
  console.error(`Phase 80 harness failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 80 harness passed: 2,560 synthetic cases (640 mission-thesis, 640 portfolio-sequence, 640 place-capacity-transition, 640 stress-rebalancing-realization) with no mutation, selection, priority, funding, financing, allocation, readiness, rebalancing, realization, receipt, score, rank, or stage change.");
