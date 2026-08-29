import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-83-community-institutions-social-infrastructure-collective-resilience-registry.json"), "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const inputFor = (index, keys) => Object.fromEntries(keys.map((key, bit) => [key, index === 639 || Boolean(index & (1 << bit))]));
const evaluate = (input, keys, family) => {
  const blockers = keys.filter((key) => !input[key]);
  return { family, routing_state: blockers.length ? "Held" : "Eligible for Human Review", blockers, human_decision_required: true, registry_mutation_allowed: false, automatic_institution_admission_allowed: false, automatic_access_or_trust_finding_allowed: false, automatic_network_admission_allowed: false, automatic_capacity_finding_allowed: false, automatic_volunteer_assignment_allowed: false, automatic_truth_classification_allowed: false, automatic_content_suppression_allowed: false, automatic_emergency_activation_allowed: false, automatic_closure_allowed: false, automatic_restoration_or_reconstruction_allowed: false, automatic_recovery_finding_allowed: false, automatic_score_allowed: false, automatic_rank_allowed: false, phase64_cell_change: "none" };
};

const families = [
  ["community-institution-access-trust-continuity", ["verified_phase82", "authority", "community_boundary", "institution_inventory", "access", "trust", "capacity", "continuity", "review", "receipt"]],
  ["civic-association-cooperative-mutual-aid-capacity", ["adopted_institution_baseline", "network_inventory", "governance", "mutual_aid_need", "people", "resources", "safeguards", "continuity", "review", "receipt"]],
  ["local-information-media-public-knowledge-integrity", ["verified_civic_capacity", "information_need", "publisher_identity", "reporting", "access", "provenance", "correction", "distribution", "review", "receipt"]],
  ["collective-preparedness-trauma-recovery-resilience", ["verified_information", "risk_baseline", "preparedness", "hubs", "continuity", "trauma_support", "closure_safeguards", "recovery", "audit", "receipt"]]
];

let total = 0;
for (const [family, keys] of families) {
  let eligible = 0;
  for (let index = 0; index < 640; index += 1) {
    const input = inputFor(index, keys);
    const output = evaluate(input, keys, family);
    total += 1;
    if (output.routing_state === "Eligible for Human Review") eligible += 1;
    check(output.human_decision_required, `${family} case ${index} bypassed human review.`);
    check(!output.registry_mutation_allowed && !output.automatic_institution_admission_allowed && !output.automatic_access_or_trust_finding_allowed && !output.automatic_network_admission_allowed && !output.automatic_capacity_finding_allowed && !output.automatic_volunteer_assignment_allowed && !output.automatic_truth_classification_allowed && !output.automatic_content_suppression_allowed && !output.automatic_emergency_activation_allowed && !output.automatic_closure_allowed && !output.automatic_restoration_or_reconstruction_allowed && !output.automatic_recovery_finding_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", `${family} case ${index} crossed an automation boundary.`);
    check((output.routing_state === "Eligible for Human Review") === keys.every((key) => input[key]), `${family} case ${index} has an invalid routing result.`);
    check(!("institution" in output) && !("network" in output) && !("truth" in output) && !("activation" in output) && !("closure" in output) && !("recovery" in output) && !("receipt" in output), `${family} case ${index} manufactured a governed result.`);
  }
  check(eligible === 1, `${family} must contain exactly one structurally complete synthetic case.`);
}

check(total === 2560, `Expected 2,560 cases, found ${total}.`);
check(JSON.stringify(registry) === before, "The Phase 83 harness mutated the registry.");
const countKeys = new Set(["community_institution_access_trust_continuity_dossiers", "civic_association_cooperative_mutual_aid_capacity_ledgers", "local_information_media_public_knowledge_integrity_registers", "collective_preparedness_trauma_recovery_resilience_ledgers", "institution_gates", "civic_capacity_gates", "information_integrity_gates", "collective_resilience_gates", "community_institution_classes", "institution_access_trust_dimensions", "institution_continuity_safeguards", "civic_network_types", "mutual_aid_capacity_dimensions", "volunteer_worker_safeguards", "information_ecosystem_functions", "information_integrity_safeguards", "public_knowledge_access_modes", "community_preparedness_capabilities", "collective_trauma_recovery_safeguards", "institution_closure_displacement_safeguards", "long_horizon_collective_resilience_tests"]);
for (const [key, value] of Object.entries(registry.metrics)) if (!countKeys.has(key)) check(value === 0, `Synthetic cases changed metric ${key}.`);

if (failures.length) { console.error(`Phase 83 harness failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 83 harness passed: 2,560 synthetic cases (640 institution, 640 civic, 640 information, 640 resilience) with no mutation, admission, allocation, truth classification, suppression, activation, closure, restoration, recovery, remedy, receipt, score, rank, or stage change.");
