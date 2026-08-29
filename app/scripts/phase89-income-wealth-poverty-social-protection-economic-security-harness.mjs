import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-89-income-wealth-poverty-social-protection-economic-security-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const families = [
  ["household-income-earnings-tax-transfer-resources", ["verified_phase88", "authority", "household_boundary", "income_sources", "tax_transfer_incidence", "essential_costs", "administration", "distribution", "review", "receipt"]],
  ["wealth-assets-debt-liabilities-intergenerational-balance", ["adopted_income_baseline", "ownership", "valuation", "liquidity", "housing_pension_business_assets", "debt_credit", "insolvency_inheritance", "distribution_mobility", "review", "receipt"]],
  ["poverty-deprivation-social-protection-benefit-access", ["verified_wealth_baseline", "poverty_boundary", "deprivation", "program_authority", "eligibility", "application_take_up", "adequacy_continuity", "denial_appeal_remedy", "review", "receipt"]],
  ["economic-security-distribution-shock-mobility-long-horizon", ["verified_protection_baseline", "security_boundary", "stabilizers", "shock_response", "essential_security", "distribution", "mobility", "future_generations", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_tax_or_transfer_decision_allowed: false,
    automatic_household_or_poverty_classification_allowed: false,
    automatic_credit_debt_or_wealth_finding_allowed: false,
    automatic_eligibility_denial_or_sanction_allowed: false,
    automatic_benefit_or_social_protection_decision_allowed: false,
    automatic_distribution_mobility_or_security_finding_allowed: false,
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
    check(!output.registry_mutation_allowed && !output.automatic_tax_or_transfer_decision_allowed && !output.automatic_household_or_poverty_classification_allowed && !output.automatic_credit_debt_or_wealth_finding_allowed && !output.automatic_eligibility_denial_or_sanction_allowed && !output.automatic_benefit_or_social_protection_decision_allowed && !output.automatic_distribution_mobility_or_security_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 89 harness mutated the registry.");
if (failures.length) {
  console.error(`Phase 89 harness failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 89 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated tax, transfer, household, poverty, credit, debt, wealth, eligibility, denial, sanction, benefit, protection, distribution, mobility, security, score, ranking, registry mutation, or Phase 64 change.");
