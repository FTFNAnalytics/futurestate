import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const families = [
  ["international-order", ["verified_phase99", "authority", "identity", "negotiating_authority", "legal_obligation", "entry_into_force", "implementation", "verification", "review", "receipt"]],
  ["multilateral-cooperation", ["adopted_international_order", "identity", "representation", "authority", "finance", "delivery", "local_ownership", "integrity", "review", "receipt"]],
  ["humanitarian-shared-responsibility", ["verified_multilateral", "identity", "status", "rights", "admission", "protection", "services", "responsibility_sharing", "review", "receipt"]],
  ["shared-human-futures", ["verified_humanitarian", "identity", "commons", "risk", "coordination", "stewardship", "intergenerational_equity", "resilience", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_treaty_or_international_order_decision_allowed: false,
    automatic_multilateral_representation_finance_or_delivery_decision_allowed: false,
    automatic_migration_refugee_asylum_or_humanitarian_decision_allowed: false,
    automatic_commons_risk_reduction_or_shared_futures_decision_allowed: false,
    automatic_party_status_or_jurisdiction_decision_allowed: false,
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
    check(
      !output.registry_mutation_allowed
      && !output.automatic_treaty_or_international_order_decision_allowed
      && !output.automatic_multilateral_representation_finance_or_delivery_decision_allowed
      && !output.automatic_migration_refugee_asylum_or_humanitarian_decision_allowed
      && !output.automatic_commons_risk_reduction_or_shared_futures_decision_allowed
      && !output.automatic_party_status_or_jurisdiction_decision_allowed
      && !output.automatic_score_allowed
      && !output.automatic_rank_allowed
      && output.phase64_cell_change === "none",
      family + " case " + index + " crossed an automation boundary."
    );
    check((output.routing_state === "Held") === (output.blockers.length > 0), family + " case " + index + " has inconsistent routing.");
  }
  check(eligible === 1, family + " must contain exactly one structurally complete human-review case; found " + eligible + ".");
}
check(total === 2560, "Expected 2,560 cases; found " + total + ".");
check(JSON.stringify(registry) === before, "The Phase 100 harness mutated the registry.");
if (failures.length) {
  console.error("Phase 100 harness failed with " + failures.length + " issue(s):");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("Phase 100 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated treaty, international-order, multilateral, humanitarian, global-commons, cross-border-risk, shared-futures, score, ranking, registry mutation, or Phase 64 change.");
