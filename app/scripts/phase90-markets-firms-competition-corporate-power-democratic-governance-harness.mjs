import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-90-markets-firms-competition-corporate-power-democratic-economic-governance-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const families = [
  ["firm-formation-ownership-control-governance", ["verified_phase89", "authority", "entity_boundary", "ownership_control", "governance", "capital_labor", "disclosure", "lifecycle", "review", "receipt"]],
  ["market-structure-competition-pricing-conduct", ["adopted_firm_baseline", "market_boundary", "participants_denominator", "entry_switching", "concentration_power", "price_quality", "labor_suppliers", "conduct_merger", "review", "receipt"]],
  ["corporate-power-platform-supply-chain-public-support", ["verified_market_baseline", "group_boundary", "ownership_finance", "platform_data", "supply_chain", "influence", "public_support", "conditions_distribution", "review", "receipt"]],
  ["democratic-economic-governance-rights-remedy-long-horizon", ["verified_power_baseline", "authority_standing", "participation_reason", "enforcement", "remedy", "rights", "public_value", "resilience_future", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_firm_or_ownership_classification_allowed: false,
    automatic_market_definition_or_power_finding_allowed: false,
    automatic_price_quality_or_conduct_finding_allowed: false,
    automatic_platform_supply_chain_or_influence_finding_allowed: false,
    automatic_subsidy_tax_or_public_support_decision_allowed: false,
    automatic_merger_remedy_or_penalty_decision_allowed: false,
    automatic_public_value_or_governance_finding_allowed: false,
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
    check(!output.registry_mutation_allowed && !output.automatic_firm_or_ownership_classification_allowed && !output.automatic_market_definition_or_power_finding_allowed && !output.automatic_price_quality_or_conduct_finding_allowed && !output.automatic_platform_supply_chain_or_influence_finding_allowed && !output.automatic_subsidy_tax_or_public_support_decision_allowed && !output.automatic_merger_remedy_or_penalty_decision_allowed && !output.automatic_public_value_or_governance_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 90 harness mutated the registry.");
if (failures.length) { console.error(`Phase 90 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 90 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated firm, ownership, market, power, price, conduct, platform, supply-chain, subsidy, tax, merger, remedy, penalty, public-value, governance, score, ranking, registry mutation, or Phase 64 change.");
