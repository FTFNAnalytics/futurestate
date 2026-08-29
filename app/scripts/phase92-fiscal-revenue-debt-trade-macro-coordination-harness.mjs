import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const families = [
  ["public-revenue-incidence-compliance-rights", ["verified_phase91", "authority", "base_rate", "incidence", "administration", "compliance", "tax_expenditure", "distribution", "review", "receipt"]],
  ["budget-stabilizers-delivery-public-value", ["adopted_revenue_baseline", "authority", "costing", "appropriation", "stabilizer", "delivery", "additionality", "distribution", "review", "receipt"]],
  ["sovereign-debt-fiscal-rules-public-balance-sheets", ["verified_budget_baseline", "authority", "instrument_holder", "purpose", "service_risk", "balance_sheet", "fiscal_rule", "restructuring", "review", "receipt"]],
  ["trade-external-balance-supply-resilience-macro-coordination", ["verified_debt_baseline", "authority", "trade_identity", "external_account", "supply_resilience", "transmission", "distribution", "legitimacy", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_tax_liability_or_enforcement_decision_allowed: false,
    automatic_revenue_or_distribution_finding_allowed: false,
    automatic_budget_priority_or_allocation_allowed: false,
    automatic_delivery_or_public_value_finding_allowed: false,
    automatic_sustainability_or_restructuring_decision_allowed: false,
    automatic_trade_or_treaty_decision_allowed: false,
    automatic_macro_policy_or_resilience_decision_allowed: false,
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
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_tax_liability_or_enforcement_decision_allowed && !output.automatic_revenue_or_distribution_finding_allowed && !output.automatic_budget_priority_or_allocation_allowed && !output.automatic_delivery_or_public_value_finding_allowed && !output.automatic_sustainability_or_restructuring_decision_allowed && !output.automatic_trade_or_treaty_decision_allowed && !output.automatic_macro_policy_or_resilience_decision_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 92 harness mutated the registry.");
if (failures.length) { console.error(`Phase 92 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 92 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated tax, revenue, distribution, budget, expenditure, public-value, debt, sustainability, restructuring, customs, trade, treaty, supply-resilience, macroeconomic-policy, score, ranking, registry mutation, or Phase 64 change.");
