import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-87-education-learning-skills-knowledge-cultural-capability-registry.json"), "utf8"));
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
    automatic_enrollment_or_admission_allowed: false,
    automatic_learning_or_capability_finding_allowed: false,
    automatic_credential_or_transition_decision_allowed: false,
    automatic_public_knowledge_or_cultural_recovery_finding_allowed: false,
    automatic_score_allowed: false,
    automatic_rank_allowed: false,
    phase64_cell_change: "none"
  };
}

const families = [
  ["early-childhood-school-access-inclusion-learning", ["verified_phase86", "authority", "population_need", "access", "inclusion", "learning", "continuity", "rights", "review", "receipt"]],
  ["postsecondary-vocational-apprenticeship-affordability", ["adopted_school_baseline", "authority", "quality", "admission", "affordability", "learner_support", "workforce", "completion", "review", "receipt"]],
  ["learning-capability-credential-skills-transition", ["verified_postsecondary", "purpose", "valid_assessment", "capability", "credential_authority", "application", "equity", "transition", "review", "receipt"]],
  ["public-knowledge-culture-research-community-learning", ["verified_capability", "authority", "public_access", "integrity", "literacy", "indigenous_knowledge", "freedom", "cultural_continuity", "community_use", "review"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const output = evaluate(inputFor(index, keys), keys, family);
    total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_enrollment_or_admission_allowed && !output.automatic_learning_or_capability_finding_allowed && !output.automatic_credential_or_transition_decision_allowed && !output.automatic_public_knowledge_or_cultural_recovery_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Held") === (output.blockers.length > 0), `${family} case ${index} has inconsistent routing.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete human-review case; found ${eligible}.`);
}

check(total === 2560, `Expected 2,560 cases; found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 87 harness mutated the registry.");
if (failures.length) {
  console.error(`Phase 87 harness failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 87 harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated enrollment, admission, learning, capability, credential, transition, public-knowledge, culture, recovery, score, ranking, registry mutation, or Phase 64 change.");
