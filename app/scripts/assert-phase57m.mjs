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

const ledger = await readJson(join(dataRoot, "phase-57m-source-schema-adapters-packet-templates-review-decision-tables.json"));
const review = await readJson(join(dataRoot, "phase-57m-publication-review.json"));
const adapters = await readJson(join(dataRoot, "phase-57m-source-schema-adapters.json"));
const packets = await readJson(join(dataRoot, "phase-57m-candidate-evidence-packet-templates.json"));
const decisions = await readJson(join(dataRoot, "phase-57m-human-review-decision-tables.json"));
const phase57l = await readJson(join(dataRoot, "phase-57l-contract-field-coverage-intake-queues-exception-playbooks.json"));
const coverage = await readJson(join(dataRoot, "phase-57l-contract-field-coverage-matrix.json"));
const intake = await readJson(join(dataRoot, "phase-57l-first-eligible-record-intake-queue.json"));
const collection = await readJson(join(contentRoot, "research-collections", "source-schema-adapters-candidate-evidence-packet-templates-human-review-decision-tables-2026.json"));
const documents = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^\d+-57m-.*\.json$/.test(name));
const signals = (await readdir(join(contentRoot, "signals"))).filter((name) => /^signal-57m-.*\.mdx$/.test(name));
const phase57lHolds = phase57l.records.filter((record) => record.record_status === "In Review");
const phase57lHoldByContract = new Map(phase57lHolds.map((record) => [record.reopening_contract_id, record.action_key]));

check(ledger.phase === "57M", "Phase 57M ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((record) => record.record_id)).size === 29, "Phase 57M must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57M must publish twenty controls and preserve nine holds.");
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  check(ledger.evidence_stage_counts[`${rail} adapter and review-control operationalization`] === 5, `Phase 57M must publish five ${rail} controls.`);
}
check(ledger.evidence_stage_counts["Adapter and packet-review hold"] === 9, "Phase 57M must preserve nine adapter-and-packet-review holds.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57M source-profile counts are incorrect.");
check(ledger.candidate_packets_evaluated === 0 && ledger.eligible_records_accepted === 0 && ledger.actual_accept_decisions === 0, "Phase 57M must evaluate and accept zero actual candidate packets.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57M must record zero acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57M must record zero agency contacts and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57M must preserve directive, implementation, and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57l.post_batch_visible_scope), "Phase 57M must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57M must preserve the 1 / 21 / 2 entity ledger.");

const recordStatuses = ledger.records.reduce((counts, record) => {
  counts[record.record_status] = (counts[record.record_status] ?? 0) + 1;
  return counts;
}, {});
check(recordStatuses.Published === 20 && recordStatuses["In Review"] === 9, "Phase 57M record statuses are incorrect.");
check(documents.length === 29 && signals.length === 29 && collection.document_ids.length === 29, "Phase 57M must generate twenty-nine documents, signals, and collection members.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57M publication-review counts are incorrect.");

check(adapters.phase === "57M" && adapters.contract_count === 9 && adapters.field_mapping_count === 60, "Phase 57M must contain nine contracts and sixty field adapters.");
check(adapters.accepted_label_count === 120 && adapters.unrecognized_labels_coerced === 0 && adapters.value_transformations_allowed === 0 && adapters.adapter_values_populated === 0, "Phase 57M adapter label or value totals are incorrect.");
check(new Set(adapters.adapters.map((row) => row.adapter_id)).size === 60, "Phase 57M adapter identifiers must be unique.");
check(new Set(adapters.adapters.map((row) => `${row.contract_id}|${row.field_name}`)).size === 60, "Phase 57M contract-field mappings must be unique.");
for (const row of coverage.fields) {
  const adapter = adapters.adapters.find((candidate) => candidate.contract_id === row.contract_id && candidate.field_name === row.field_name);
  check(Boolean(adapter), `Missing adapter for ${row.contract_id}|${row.field_name}.`);
  check(adapter?.phase57l_hold_key === phase57lHoldByContract.get(row.contract_id), `${row.contract_id}|${row.field_name} must point to its Phase 57L hold.`);
}
check(adapters.adapters.every((row) => row.accepted_source_labels.length === 2 && new Set(row.accepted_source_labels).size === 2), "Every Phase 57M adapter must declare two unique accepted labels.");
check(adapters.adapters.every((row) => row.accepted_labels_are_observed_source_evidence === false && row.unrecognized_label_policy === "reject_and_return_for_clarification"), "Adapter labels must remain vocabulary-only and non-coercive.");
check(adapters.adapters.every((row) => row.value_transformations_allowed.length === 0 && row.source_value === null && row.adapter_is_evidence === false && row.carry_value_from_other_record === false && row.human_review_required === true), "Phase 57M adapters must remain value-empty, non-evidentiary, non-transforming, and human-reviewed.");

check(packets.phase === "57M" && packets.template_count === 9 && packets.empty_fixture_count === 9 && packets.incomplete_fixture_count === 9 && packets.total_fixture_count === 18, "Phase 57M must contain nine templates and eighteen fixtures.");
check(packets.candidate_records_evaluated === 0 && packets.eligible_records_accepted === 0 && packets.triggers_fired === 0 && packets.fixtures_are_evidence === false, "Phase 57M packet fixtures must remain non-evidence and non-triggering.");
check(new Set(packets.templates.map((row) => row.contract_id)).size === 9 && new Set(packets.templates.map((row) => row.template_id)).size === 9, "Phase 57M packet templates must map one-to-one to contracts.");
for (const template of packets.templates) {
  const queue = intake.queues.find((row) => row.contract_id === template.contract_id);
  check(Boolean(queue), `${template.contract_id} has no Phase 57L intake queue.`);
  check(template.phase57l_hold_key === phase57lHoldByContract.get(template.contract_id), `${template.contract_id} packet template must point to its Phase 57L hold.`);
  check(template.required_field_count === queue.required_fields.length && JSON.stringify(template.required_fields) === JSON.stringify(queue.required_fields), `${template.contract_id} packet fields do not match Phase 57L.`);
  check(Object.values(template.empty_packet.fields).every((value) => value === null) && template.empty_packet.populated_field_count === 0, `${template.contract_id} empty fixture must remain empty.`);
  check(template.empty_packet.fixture_only === true && template.empty_packet.eligible_record === false && template.empty_packet.fires_trigger === false && template.empty_packet.automated_publication_allowed === false, `${template.contract_id} empty fixture boundaries are incorrect.`);
  check(template.incomplete_packet.fixture_only === true && template.incomplete_packet.populated_field_count === 1 && template.incomplete_packet.missing_required_fields.length === template.required_field_count - 1, `${template.contract_id} incomplete fixture must contain one synthetic field and remain incomplete.`);
  check(template.incomplete_packet.eligible_record === false && template.incomplete_packet.fires_trigger === false && template.incomplete_packet.automated_publication_allowed === false && template.cross_record_assembly_allowed === false && template.human_review_required === true, `${template.contract_id} incomplete fixture boundaries are incorrect.`);
}
const expectedFixtureDecisions = { reject: 1, return_for_clarification: 2, privacy_hold: 2, authority_hold: 2, period_hold: 2 };
const fixtureDecisions = packets.templates.reduce((counts, template) => {
  const value = template.incomplete_packet.expected_review_decision;
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});
check(Object.entries(expectedFixtureDecisions).every(([decision, count]) => fixtureDecisions[decision] === count) && Object.keys(fixtureDecisions).length === Object.keys(expectedFixtureDecisions).length, "Phase 57M incomplete-fixture decision distribution is incorrect.");

const decisionTypes = ["accept", "reject", "return_for_clarification", "privacy_hold", "authority_hold", "period_hold"];
check(decisions.phase === "57M" && decisions.table_count === 9 && decisions.decision_row_count === 54, "Phase 57M must contain nine decision tables and fifty-four rows.");
check(JSON.stringify(decisions.decision_types) === JSON.stringify(decisionTypes), "Phase 57M decision types are incorrect.");
check(decisions.actual_candidate_packets_evaluated === 0 && decisions.actual_accept_decisions === 0 && decisions.actual_reopening_triggers_fired === 0 && decisions.automated_publication_allowed === false, "Phase 57M decision registry must record zero actual decisions and triggers.");
for (const table of decisions.tables) {
  check(table.phase57l_hold_key === phase57lHoldByContract.get(table.contract_id), `${table.contract_id} decision table must point to its Phase 57L hold.`);
  check(table.rows.length === 6 && new Set(table.rows.map((row) => row.decision_type)).size === 6, `${table.contract_id} must rehearse all six decisions exactly once.`);
}
const decisionRows = decisions.tables.flatMap((table) => table.rows);
check(new Set(decisionRows.map((row) => row.decision_id)).size === 54, "Phase 57M decision identifiers must be unique.");
check(decisionRows.every((row) => row.rehearsal_only === true && row.fires_trigger === false && row.closes_hold_automatically === false && row.automated_publication_allowed === false && row.actual_candidate_evaluated === false && row.human_review_required === true), "Every Phase 57M decision row must remain a non-triggering human-review rehearsal.");
check(decisionRows.filter((row) => row.decision_type === "accept").every((row) => row.resulting_state === "ready_for_separate_publication_review"), "Accept rehearsals may route only to separate publication review.");

const priorHoldKeys = phase57lHolds.map((record) => record.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57l_holds].sort()) === JSON.stringify(priorHoldKeys), "Phase 57M must preserve all Phase 57L holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57M must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9, "Phase 57M hold lineage must contain nine unique parents.");
check(new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57M hold lineage must preserve nine unique contracts.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57M") || question.includes("packet") || question.includes("adapter")), `${file} must include a Phase 57M watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes("research-collection-source-schema-adapters-candidate-evidence-packet-templates-human-review-decision-tables-2026"), `${file} must link the Phase 57M collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57M source-schema adapters and packet review"), `${file} must include the Phase 57M dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57m-adapter-packet-review"), "Dependency map must include the Phase 57M node.");
check(map.links.filter((link) => link.from === "node-phase57m-adapter-packet-review").length === 3, "Dependency map must include three Phase 57M links.");

if (errors.length) {
  console.error("Phase 57M assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Phase 57M assertions passed: 20 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 60 non-coercive field adapters, 120 accepted adapter labels, 9 empty and 9 incomplete non-evidence fixtures, 9 six-outcome human-review tables, 54 rehearsal rows, zero evaluated or accepted candidate packets, zero triggers, and unchanged scope and closure ledgers.");
