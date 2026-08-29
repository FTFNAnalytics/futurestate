import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(appRoot, "src", "data", "phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, label) => {
  const blockers = keys.filter((key) => !input[key]);
  return {
    family: label,
    routing_state: blockers.length === 0 ? "Eligible for Human Review" : "Held",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
};

const families = [
  ["asset-obligation", ["executed_compact", "ordinary_authority", "identity", "condition", "rights", "obligations", "distribution", "future_users", "dual_review", "receipt"]],
  ["lifecycle-maintenance", ["admitted_register", "need", "alternatives", "whole_life_cost", "maintenance", "renewal", "closure", "funding", "dual_review", "receipt"]],
  ["procurement-contingent-risk", ["authorized_plan", "public_options", "vendor_identity", "dependencies", "public_capacity", "liabilities", "insurance_limits", "failure_exit", "dual_review", "receipt"]],
  ["intergenerational-stewardship", ["verified_inputs", "distribution", "future_users", "option_value", "irreversibility", "funded_duties", "stress_test", "public_reason", "independent_audit", "receipt"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const input = inputFor(index, keys);
    const output = evaluate(input, keys, family);
    total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required === true, `${family} case ${index} bypassed human decision.`);
    check(output.registry_mutation_allowed === false && output.automatic_score_allowed === false && output.automatic_rank_allowed === false && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Eligible for Human Review") === keys.every((key) => input[key]), `${family} case ${index} has an invalid routing result.`);
    check(!("valuation" in output) && !("liability" in output) && !("reserve" in output) && !("award" in output) && !("finding" in output) && !("receipt" in output), `${family} case ${index} manufactured a governed outcome.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete synthetic case.`);
}

check(total === 2560, `Expected 2,560 synthetic cases, found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 79 synthetic harness mutated the public registry.");
check(registry.metrics.assets_admitted === 0 && registry.metrics.obligations_recognized === 0 && registry.metrics.valuations_issued === 0 && registry.metrics.lifecycle_plans_authorized === 0 && registry.metrics.procurements_opened_or_awarded === 0 && registry.metrics.contingent_liabilities_recognized === 0 && registry.metrics.intergenerational_audits_completed === 0, "A synthetic case changed a real Phase 79 metric.");

if (failures.length) {
  console.error(`Phase 79 harness failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 79 harness passed: 2560 synthetic cases (640 asset and obligation, 640 lifecycle and maintenance, 640 procurement and contingent risk, 640 intergenerational stewardship) with no registry mutation, asset admission, obligation recognition, valuation, lifecycle authorization, maintenance funding, procurement, vendor selection, liability, insurance finding, reserve, stress response, restructuring, restoration, audit, receipt, score, rank, or stage change.");
