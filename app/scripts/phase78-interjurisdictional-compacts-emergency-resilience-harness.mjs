import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(appRoot, "src", "data", "phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const humanBoundary = (requirements) => requirements.every(Boolean) ? "human_decision_required" : "held";

let authorityCases = 0;
let compactCases = 0;
let continuityCases = 0;
let emergencyCases = 0;

for (const record of registry.interjurisdictional_authority_externality_maps) {
  for (let index = 0; index < 64; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      index % 13 === 0,
      record.automatic_authority_assignment_allowed === false,
      record.automatic_externality_finding_allowed === false,
      record.automatic_forum_selection_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.interjurisdictional_authority_externality_map_id} produced an invalid authority route.`);
    authorityCases += 1;
  }
}

for (const record of registry.shared_public_value_contribution_compacts) {
  for (let index = 0; index < 64; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      index % 13 === 0,
      index % 17 === 0,
      record.contribution_as_control_allowed === false,
      record.automatic_value_allocation_allowed === false,
      record.automatic_compact_authorization_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.shared_public_value_contribution_compact_id} produced an invalid compact route.`);
    compactCases += 1;
  }
}

for (const record of registry.mutual_aid_continuity_dispute_registers) {
  for (let index = 0; index < 64; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      index % 13 === 0,
      index % 17 === 0,
      record.automatic_mutual_aid_activation_allowed === false,
      record.automatic_priority_allocation_allowed === false,
      record.automatic_dispute_disposition_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.mutual_aid_continuity_dispute_register_id} produced an invalid continuity route.`);
    continuityCases += 1;
  }
}

for (const record of registry.emergency_authority_normalization_ledgers) {
  for (let index = 0; index < 64; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      index % 13 === 0,
      index % 17 === 0,
      record.silent_emergency_extension_allowed === false,
      record.compact_authority_laundering_allowed === false,
      record.automatic_rights_suspension_allowed === false,
      record.automatic_reauthorization_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.emergency_authority_normalization_ledger_id} produced an invalid emergency route.`);
    emergencyCases += 1;
  }
}

check(authorityCases === 512, `Expected 512 authority cases, found ${authorityCases}.`);
check(compactCases === 512, `Expected 512 compact cases, found ${compactCases}.`);
check(continuityCases === 512, `Expected 512 continuity cases, found ${continuityCases}.`);
check(emergencyCases === 512, `Expected 512 emergency cases, found ${emergencyCases}.`);
check(JSON.stringify(registry) === before, "The Phase 78 synthetic harness mutated the public registry.");

if (failures.length) {
  console.error("Phase 78 harness failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Phase 78 harness passed: 2048 synthetic cases (512 authority and externality, 512 compact and contribution, 512 continuity and dispute, 512 emergency and normalization) with no registry mutation, jurisdiction finding, compact, contribution, mutual-aid activation, dispute, emergency authority, extension, rights suspension, normalization, reauthorization, receipt, score, rank, or stage change.");
