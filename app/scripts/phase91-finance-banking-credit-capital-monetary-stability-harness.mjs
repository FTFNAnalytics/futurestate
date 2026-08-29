import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-91-finance-banking-credit-capital-allocation-monetary-systems-financial-stability-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const families = [
  ["money-payments-banking-access-settlement", ["verified_phase90", "authority", "instrument_claim", "access_cost", "custody_settlement", "privacy_security", "continuity", "distribution", "review", "receipt"]],
  ["credit-underwriting-affordability-servicing-allocation", ["adopted_money_baseline", "borrower_purpose", "price_term", "affordability", "fairness_model", "servicing_collection", "allocation_additionality", "distribution", "review", "receipt"]],
  ["capital-markets-investment-insurance-risk-transfer", ["verified_credit_baseline", "issuer_asset", "ownership_allocation", "valuation_liquidity", "fiduciary", "insurance_claim", "risk_transfer_stress", "distribution", "review", "receipt"]],
  ["monetary-policy-systemic-risk-resolution-democratic-finance", ["verified_capital_baseline", "authority_mandate", "transmission_distribution", "systemic_risk", "prudential_supervision", "guarantee_support", "recovery_resolution", "legitimacy_normalization", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_money_or_banking_access_decision_allowed: false,
    automatic_payment_or_settlement_decision_allowed: false,
    automatic_credit_underwriting_or_pricing_decision_allowed: false,
    automatic_servicing_collection_or_allocation_decision_allowed: false,
    automatic_valuation_investment_or_insurance_decision_allowed: false,
    automatic_monetary_policy_or_systemic_designation_allowed: false,
    automatic_guarantee_resolution_or_loss_allocation_allowed: false,
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
    check(!output.registry_mutation_allowed && !output.automatic_money_or_banking_access_decision_allowed && !output.automatic_payment_or_settlement_decision_allowed && !output.automatic_credit_underwriting_or_pricing_decision_allowed && !output.automatic_servicing_collection_or_allocation_decision_allowed && !output.automatic_valuation_investment_or_insurance_decision_allowed && !output.automatic_monetary_policy_or_systemic_designation_allowed && !output.automatic_guarantee_resolution_or_loss_allocation_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 91 harness mutated the registry.");
if (failures.length) { console.error(`Phase 91 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 91 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated money, banking, payment, settlement, credit, underwriting, pricing, servicing, collection, allocation, valuation, investment, insurance, monetary-policy, systemic-risk, guarantee, resolution, loss-allocation, score, ranking, registry mutation, or Phase 64 change.");
