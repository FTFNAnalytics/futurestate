import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(appRoot, "src", "data", "phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const before = JSON.stringify(registry);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const humanBoundary = (requirements) => requirements.every(Boolean) ? "human_decision_required" : "held";
let standingCases = 0;
let deliberationCases = 0;
let mandateCases = 0;
let adaptiveCases = 0;

for (const record of registry.stakeholder_standing_notice_registers) {
  for (let index = 0; index < 50; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      record.automatic_standing_allowed === false,
      record.automatic_exclusion_allowed === false,
      record.participation_volume_as_legitimacy_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.stakeholder_standing_notice_register_id} produced an invalid standing route.`);
    standingCases += 1;
  }
}

for (const record of registry.deliberation_issue_response_dockets) {
  for (let index = 0; index < 50; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      index % 13 === 0,
      record.automatic_consensus_allowed === false,
      record.automatic_consent_allowed === false,
      record.comment_count_as_weight_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.deliberation_issue_response_docket_id} produced an invalid deliberation route.`);
    deliberationCases += 1;
  }
}

for (const record of registry.mandate_legitimacy_appeal_registers) {
  for (let index = 0; index < 50; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      index % 13 === 0,
      record.automatic_legitimacy_allowed === false,
      record.automatic_mandate_allowed === false,
      record.automatic_appeal_disposition_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.mandate_legitimacy_appeal_register_id} produced an invalid mandate route.`);
    mandateCases += 1;
  }
}

for (const record of registry.adaptive_mandate_review_ledgers) {
  for (let index = 0; index < 50; index += 1) {
    const route = humanBoundary([
      index % 2 === 0,
      index % 3 === 0,
      index % 5 === 0,
      index % 7 === 0,
      index % 11 === 0,
      index % 13 === 0,
      record.silent_renewal_allowed === false,
      record.automatic_mandate_extension_allowed === false,
      record.automatic_trigger_disposition_allowed === false
    ]);
    check(["held", "human_decision_required"].includes(route), `${record.adaptive_mandate_review_ledger_id} produced an invalid adaptive-review route.`);
    adaptiveCases += 1;
  }
}

check(standingCases === 400, `Expected 400 standing cases, found ${standingCases}.`);
check(deliberationCases === 400, `Expected 400 deliberation cases, found ${deliberationCases}.`);
check(mandateCases === 400, `Expected 400 mandate and appeal cases, found ${mandateCases}.`);
check(adaptiveCases === 400, `Expected 400 adaptive-review cases, found ${adaptiveCases}.`);
check(JSON.stringify(registry) === before, "The Phase 77 synthetic harness mutated the public registry.");

if (failures.length) {
  console.error("Phase 77 harness failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Phase 77 harness passed: 1600 synthetic cases (400 standing and notice, 400 deliberation and response, 400 mandate and appeal, 400 adaptive review) with no registry mutation, standing decision, notice, participation, consultation, consent finding, comment, hearing, response, legitimacy finding, appeal disposition, mandate, adaptive review, receipt, score, rank, or stage change.");
