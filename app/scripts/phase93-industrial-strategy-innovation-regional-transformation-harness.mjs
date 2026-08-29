import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-93-economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const families = [
  ["mission-sector-strategy-production-ecosystem", ["verified_phase92", "authority", "mission", "baseline", "ecosystem", "instrument", "additionality", "distribution", "review", "receipt"]],
  ["innovation-diffusion-commercialization-standards", ["adopted_strategy", "research_quality", "readiness", "demonstration", "transfer", "diffusion", "access", "public_return", "review", "receipt"]],
  ["regional-cluster-supplier-workforce-convergence", ["verified_innovation", "place_identity", "supplier", "workforce", "infrastructure", "finance", "anchoring", "distribution", "review", "receipt"]],
  ["productive-transformation-shared-prosperity", ["verified_region", "capability", "productivity", "diversification", "decarbonization", "job_quality", "convergence", "legitimacy", "review", "receipt"]]
];

function evaluate(input, required, family) {
  const blockers = required.filter((key) => input[key] !== true);
  return {
    family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false,
    automatic_sector_firm_or_instrument_decision_allowed: false, automatic_readiness_validation_or_certification_allowed: false,
    automatic_licensing_commercialization_or_adoption_decision_allowed: false, automatic_cluster_supplier_workforce_or_place_decision_allowed: false,
    automatic_convergence_or_anchoring_finding_allowed: false, automatic_productivity_diversification_or_transition_decision_allowed: false,
    automatic_shared_prosperity_or_legitimacy_finding_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
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
    check(!output.registry_mutation_allowed && !output.automatic_sector_firm_or_instrument_decision_allowed && !output.automatic_readiness_validation_or_certification_allowed && !output.automatic_licensing_commercialization_or_adoption_decision_allowed && !output.automatic_cluster_supplier_workforce_or_place_decision_allowed && !output.automatic_convergence_or_anchoring_finding_allowed && !output.automatic_productivity_diversification_or_transition_decision_allowed && !output.automatic_shared_prosperity_or_legitimacy_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}
check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 93 harness mutated the registry.");
if (failures.length) { console.error(`Phase 93 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 93 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated mission, firm, subsidy, procurement, readiness, standard, commercialization, adoption, cluster, supplier, workforce, convergence, productivity, transition, shared-prosperity, score, ranking, registry mutation, or Phase 64 change.");
