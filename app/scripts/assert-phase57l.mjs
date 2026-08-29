import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const ledger = await readJson(join(dataRoot, "phase-57l-contract-field-coverage-intake-queues-exception-playbooks.json"));
const review = await readJson(join(dataRoot, "phase-57l-publication-review.json"));
const coverage = await readJson(join(dataRoot, "phase-57l-contract-field-coverage-matrix.json"));
const intake = await readJson(join(dataRoot, "phase-57l-first-eligible-record-intake-queue.json"));
const playbooks = await readJson(join(dataRoot, "phase-57l-exception-resolution-playbooks.json"));
const phase57k = await readJson(join(dataRoot, "phase-57k-cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry.json"));
const phase57kContracts = await readJson(join(dataRoot, "phase-57k-reopening-trigger-registry.json"));
const collection = await readJson(join(contentRoot, "research-collections", "contract-field-coverage-first-eligible-record-intake-exception-playbooks-2026.json"));
const documents = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^\d+-57l-.*\.json$/.test(name));
const signals = (await readdir(join(contentRoot, "signals"))).filter((name) => /^signal-57l-.*\.mdx$/.test(name));

check(ledger.phase === "57L", "Phase 57L ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((record) => record.record_id)).size === 29, "Phase 57L must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57L must publish twenty controls and preserve nine holds.");
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  check(ledger.evidence_stage_counts[`${rail} contract-field operationalization`] === 5, `Phase 57L must publish five ${rail} controls.`);
}
check(ledger.evidence_stage_counts["Contract-field coverage hold"] === 9, "Phase 57L must preserve nine field-coverage holds.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57L source-profile counts are incorrect.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0 && ledger.eligible_records_accepted === 0, "Phase 57L must record zero acquisitions, triggers, and eligible records.");
check(ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57L must record zero agency contacts and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57L must preserve directive, implementation, and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57k.post_batch_visible_scope), "Phase 57L must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57L must preserve the 1 / 21 / 2 entity ledger.");

const recordStatuses = ledger.records.reduce((counts, record) => {
  counts[record.record_status] = (counts[record.record_status] ?? 0) + 1;
  return counts;
}, {});
check(recordStatuses.Published === 20 && recordStatuses["In Review"] === 9, "Phase 57L record statuses are incorrect.");
check(documents.length === 29 && signals.length === 29 && collection.document_ids.length === 29, "Phase 57L must generate twenty-nine documents, signals, and collection members.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57L publication-review counts are incorrect.");

const expectedStates = {
  absent: 28,
  incompatible: 5,
  period_mismatched: 6,
  present: 15,
  privacy_gated: 3,
  authority_mismatched: 2,
  not_yet_evaluated: 1,
};
check(coverage.phase === "57L" && coverage.contract_count === 9 && coverage.required_field_count === 60, "Phase 57L coverage matrix must contain nine contracts and sixty fields.");
check(coverage.present_field_count === 15 && coverage.blocking_field_count === 45 && coverage.fully_covered_contracts === 0, "Phase 57L coverage totals are incorrect.");
check(JSON.stringify(coverage.coverage_state_counts) === JSON.stringify(expectedStates), "Phase 57L coverage-state distribution is incorrect.");
check(new Set(coverage.fields.map((row) => row.coverage_id)).size === 60, "Phase 57L coverage rows must be unique.");
check(coverage.fields.every((row) => coverage.allowed_states.includes(row.coverage_state)), "Phase 57L contains an unsupported coverage state.");
check(coverage.fields.every((row) => row.candidate_value === null && row.value_publication_allowed === false && row.partial_match_can_fire_trigger === false && row.human_review_required === true), "Phase 57L field controls must remain null, non-publishing, non-triggering, and human-reviewed.");
for (const contract of phase57kContracts.contracts) {
  const rows = coverage.fields.filter((row) => row.contract_id === contract.contract_id);
  check(rows.length === contract.required_field_count, `${contract.contract_id} has the wrong field count.`);
  check(new Set(rows.map((row) => row.field_name)).size === contract.required_field_count, `${contract.contract_id} has duplicate field rows.`);
  check(contract.required_fields.every((field) => rows.some((row) => row.field_name === field)), `${contract.contract_id} is missing a required field.`);
}

check(intake.phase === "57L" && intake.queue_count === 9 && intake.queues.length === 9, "Phase 57L must create nine intake queues.");
check(intake.eligible_records_accepted === 0 && intake.candidate_records_accepted === 0 && intake.triggers_fired === 0, "Phase 57L intake must accept zero candidates and fire zero triggers.");
check(new Set(intake.queues.map((queue) => queue.contract_id)).size === 9, "Phase 57L intake queues must map one-to-one to contracts.");
check(intake.queues.every((queue) => queue.sequence_is_priority_or_readiness === false && queue.candidate_record_state === "no_complete_eligible_record_accepted" && queue.partial_match_state === "retained_as_non_triggering_evidence" && queue.automated_publication_allowed === false && queue.human_review_required === true), "Phase 57L intake boundaries are incorrect.");
check(intake.queues.reduce((sum, queue) => sum + queue.present_field_count, 0) === 15 && intake.queues.reduce((sum, queue) => sum + queue.blocking_field_count, 0) === 45, "Phase 57L queue coverage totals are incorrect.");

check(playbooks.phase === "57L" && playbooks.playbook_count === 9 && playbooks.field_action_count === 60, "Phase 57L must create nine playbooks and sixty actions.");
check(playbooks.unresolved_exception_count === 45 && playbooks.automated_closure_actions === 0 && playbooks.human_review_required === true, "Phase 57L playbook totals are incorrect.");
const actions = playbooks.playbooks.flatMap((playbook) => playbook.actions);
check(new Set(actions.map((action) => action.action_id)).size === 60, "Phase 57L playbook actions must be unique.");
check(actions.every((action) => action.close_field_automatically === false && action.carry_value_from_other_record === false && action.human_review_required === true), "Phase 57L actions must prohibit automatic closure and cross-record value carry.");

const priorHoldKeys = phase57k.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57k_holds].sort()) === JSON.stringify(priorHoldKeys), "Phase 57L must preserve all Phase 57K holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57L must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9, "Phase 57L hold lineage must contain nine unique parents.");
check(new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57L hold lineage must preserve nine unique contracts.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57L") || question.includes("contract") || question.includes("field")), `${file} must include a Phase 57L watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes("research-collection-contract-field-coverage-first-eligible-record-intake-exception-playbooks-2026"), `${file} must link the Phase 57L collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57L contract-field coverage and first-eligible intake"), `${file} must include the Phase 57L dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57l-contract-field-intake"), "Dependency map must include the Phase 57L node.");
check(map.links.filter((link) => link.from === "node-phase57l-contract-field-intake").length === 3, "Dependency map must include three Phase 57L links.");

if (errors.length) {
  console.error("Phase 57L assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Phase 57L assertions passed: 20 Published controls, 9 In Review holds, 36 carried Tier 1 sources, 60 classified contract fields (15 present and 45 blocked), 9 first-eligible-record queues, 9 exception playbooks, 60 human-reviewed field actions, zero eligible records, zero triggers, all Phase 57K holds preserved, and unchanged scope and closure ledgers.");
