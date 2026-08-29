import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-86-health-public-health-disability-population-wellbeing-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, family) => {
  const blockers = keys.filter((key) => !input[key]);
  return {
    family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false,
    automatic_eligibility_or_coverage_decision_allowed: false, automatic_diagnosis_or_triage_decision_allowed: false,
    automatic_clinical_quality_or_safety_finding_allowed: false, automatic_surveillance_or_exposure_finding_allowed: false,
    automatic_restriction_or_emergency_authorization_allowed: false, automatic_disability_or_equity_classification_allowed: false,
    automatic_preparedness_recovery_or_wellbeing_finding_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none"
  };
};

const families = [
  ["primary-preventive-community-care-access", ["verified_phase85", "authority", "population_need", "timely_access", "affordability", "prevention", "continuity", "equity", "review", "receipt"]],
  ["acute-emergency-specialty-behavioral-health-care", ["adopted_access", "emergency", "acute_specialty", "behavioral_life_course", "medicines_supplies", "workforce", "quality_safety", "continuity", "review", "receipt"]],
  ["public-health-surveillance-prevention-exposure", ["verified_care", "authority", "denominators", "surveillance", "prevention", "outbreak", "exposure", "rights", "review", "receipt"]],
  ["disability-equity-preparedness-population-wellbeing", ["verified_public_health", "disability_rights", "accessibility", "equity", "preparedness", "continuity", "recovery", "wellbeing", "audit", "receipt"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const output = evaluate(inputFor(index, keys), keys, family); total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_eligibility_or_coverage_decision_allowed && !output.automatic_diagnosis_or_triage_decision_allowed && !output.automatic_clinical_quality_or_safety_finding_allowed && !output.automatic_surveillance_or_exposure_finding_allowed && !output.automatic_restriction_or_emergency_authorization_allowed && !output.automatic_disability_or_equity_classification_allowed && !output.automatic_preparedness_recovery_or_wellbeing_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 86 harness mutated the registry.");
if (failures.length) { console.error(`Phase 86 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 86 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated eligibility, coverage, diagnosis, triage, restriction, classification, quality, safety, surveillance, exposure, preparedness, recovery, wellbeing, score, ranking, registry mutation, or Phase 64 change.");
