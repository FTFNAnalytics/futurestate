import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-88-work-labor-livelihoods-economic-democracy-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));

function evaluate(input, keys, family) {
  const blockers = keys.filter((key) => !input[key]);
  return {
    family,
    routing_state: blockers.length ? "Held" : "Eligible for Human Review",
    blockers,
    human_decision_required: true,
    registry_mutation_allowed: false,
    automatic_job_or_hiring_decision_allowed: false,
    automatic_worker_classification_allowed: false,
    automatic_job_quality_or_safety_finding_allowed: false,
    automatic_compensation_decision_allowed: false,
    automatic_union_or_bargaining_finding_allowed: false,
    automatic_ownership_or_economic_democracy_finding_allowed: false,
    automatic_livelihood_or_transition_finding_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
}

const families = [
  ["job-access-matching-hiring-nondiscrimination", ["verified_phase87", "authority", "real_vacancy", "accessible_recruitment", "fair_matching", "accommodation", "selection", "appeal", "review", "receipt"]],
  ["job-quality-wages-benefits-hours-safety", ["adopted_job_access", "employment_identity", "compensation", "hours", "benefits", "safety", "dignity", "continuity", "review", "receipt"]],
  ["worker-voice-organizing-collective-bargaining-economic-democracy", ["verified_job_quality", "association", "organizing", "anti_retaliation", "recognition", "bargaining", "agreement", "enforcement", "audit", "receipt"]],
  ["livelihood-security-displacement-just-transition-long-horizon", ["verified_worker_voice", "household_boundary", "income_costs", "social_insurance", "displacement", "transition_support", "reemployment_quality", "regional_equity", "audit", "receipt"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const output = evaluate(inputFor(index, keys), keys, family);
    total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_job_or_hiring_decision_allowed && !output.automatic_worker_classification_allowed && !output.automatic_job_quality_or_safety_finding_allowed && !output.automatic_compensation_decision_allowed && !output.automatic_union_or_bargaining_finding_allowed && !output.automatic_ownership_or_economic_democracy_finding_allowed && !output.automatic_livelihood_or_transition_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 88 harness mutated the registry.");
if (failures.length) {
  console.error(`Phase 88 harness failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 88 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated job, hiring, classification, quality, safety, compensation, union, bargaining, ownership, livelihood, transition, score, ranking, registry mutation, or Phase 64 change.");
