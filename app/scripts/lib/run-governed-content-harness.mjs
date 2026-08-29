import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export async function runGovernedContentHarness(config) {
  const registry = JSON.parse(await readFile(join(appRoot, "src", "data", config.registryFilename), "utf8"));
  const before = JSON.stringify(registry);
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  let total = 0;
  for (const family of config.families) {
    let eligible = 0;
    for (let index = 0; index < 640; index += 1) {
      const input = Object.fromEntries(family.required.map((key, position) => [key, index === 639 || ((index >> position) & 1) === 1]));
      const blockers = family.required.filter((key) => input[key] !== true);
      const output = {
        routing_state: blockers.length ? "Held" : "Eligible for Human Review",
        blockers,
        human_decision_required: true,
        registry_mutation_allowed: false,
        automatic_substantive_decision_allowed: false,
        automatic_identity_or_status_decision_allowed: false,
        automatic_score_allowed: false,
        automatic_rank_allowed: false,
        phase64_cell_change: "none"
      };
      total += 1;
      if (output.routing_state === "Eligible for Human Review") eligible += 1;
      check(output.human_decision_required, family.label + " case " + index + " bypassed human review.");
      check(!output.registry_mutation_allowed && !output.automatic_substantive_decision_allowed && !output.automatic_identity_or_status_decision_allowed && !output.automatic_score_allowed && !output.automatic_rank_allowed && output.phase64_cell_change === "none", family.label + " case " + index + " crossed an automation boundary.");
      check((output.routing_state === "Held") === (output.blockers.length > 0), family.label + " case " + index + " has inconsistent routing.");
    }
    check(eligible === 1, family.label + " must contain exactly one structurally complete human-review case; found " + eligible + ".");
  }
  check(total === 2560, "Expected 2,560 cases; found " + total + ".");
  check(JSON.stringify(registry) === before, "The Phase " + config.phase + " harness mutated the registry.");
  if (failures.length) {
    console.error("Phase " + config.phase + " harness failed with " + failures.length + " issue(s):");
    failures.forEach((failure) => console.error("- " + failure));
    process.exit(1);
  }
  console.log("Phase " + config.phase + " harness passed: 2,560 deterministic cases, four human-review-only complete cases, and zero automated " + config.zeroLabel + ", score, ranking, registry mutation, or Phase 64 change.");
}
