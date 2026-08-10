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
const countBy = (rows, field) => rows.reduce((counts, row) => {
  const value = row[field];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

const ledger = await readJson(join(dataRoot, "phase-57n-adapter-conformance-tests-packet-validation-harnesses-reviewer-receipt-ledgers.json"));
const review = await readJson(join(dataRoot, "phase-57n-publication-review.json"));
const conformance = await readJson(join(dataRoot, "phase-57n-adapter-conformance-tests.json"));
const fixtureResults = await readJson(join(dataRoot, "phase-57n-packet-validation-harness-results.json"));
const receipts = await readJson(join(dataRoot, "phase-57n-reviewer-receipt-ledger.json"));
const phase57m = await readJson(join(dataRoot, "phase-57m-source-schema-adapters-packet-templates-review-decision-tables.json"));
const adapters = await readJson(join(dataRoot, "phase-57m-source-schema-adapters.json"));
const packets = await readJson(join(dataRoot, "phase-57m-candidate-evidence-packet-templates.json"));
const decisions = await readJson(join(dataRoot, "phase-57m-human-review-decision-tables.json"));
const collection = await readJson(join(contentRoot, "research-collections", "adapter-conformance-packet-validation-reviewer-receipt-ledgers-2026.json"));
const documents = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^\d+-57n-.*\.json$/.test(name));
const signals = (await readdir(join(contentRoot, "signals"))).filter((name) => /^signal-57n-.*\.mdx$/.test(name));
const phase57mHolds = phase57m.records.filter((record) => record.record_status === "In Review");

check(ledger.phase === "57N", "Phase 57N ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((record) => record.record_id)).size === 29, "Phase 57N must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57N must publish twenty controls and preserve nine holds.");
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  check(ledger.evidence_stage_counts[`${rail} conformance, validation, and receipt controls`] === 5, `Phase 57N must publish five ${rail} controls.`);
}
check(ledger.evidence_stage_counts["Conformance and receipt hold"] === 9, "Phase 57N must preserve nine conformance-and-receipt holds.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57N source-profile counts are incorrect.");
check(ledger.actual_candidate_packets_evaluated === 0 && ledger.eligible_records_accepted === 0 && ledger.actual_accept_decisions === 0 && ledger.actual_reviewer_receipts === 0, "Phase 57N must record zero actual packets, accept decisions, and receipts.");
check(ledger.publication_review_handoffs === 0 && ledger.exact_target_trigger_events === 0 && ledger.exact_target_artifacts_acquired === 0, "Phase 57N must record zero handoffs, triggers, and acquisitions.");
check(ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57N must record zero agency contacts and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57N must preserve directive, implementation, and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57m.post_batch_visible_scope), "Phase 57N must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57N must preserve the 1 / 21 / 2 entity ledger.");

const recordStatuses = countBy(ledger.records, "record_status");
check(recordStatuses.Published === 20 && recordStatuses["In Review"] === 9, "Phase 57N record statuses are incorrect.");
check(documents.length === 29 && signals.length === 29 && collection.document_ids.length === 29, "Phase 57N must generate twenty-nine documents, signals, and collection members.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57N publication-review counts are incorrect.");

check(conformance.phase === "57N" && conformance.contract_count === 9 && conformance.adapter_count === 60, "Phase 57N conformance registry must cover nine contracts and sixty adapters.");
check(conformance.accepted_label_test_count === 120 && conformance.ambiguous_label_rejection_count === 60 && conformance.total_test_count === 180, "Phase 57N adapter-test totals are incorrect.");
check(conformance.passed_test_count === 180 && conformance.failed_test_count === 0, "All Phase 57N adapter tests must pass.");
check(conformance.labels_semantically_coerced === 0 && conformance.values_supplied_or_transformed === 0 && conformance.evidence_records_created === 0, "Phase 57N conformance tests must remain non-coercive, value-empty, and non-evidentiary.");
check(new Set(conformance.tests.map((row) => row.test_id)).size === 180, "Phase 57N adapter test identifiers must be unique.");
const acceptedTests = conformance.tests.filter((row) => row.test_class === "accepted_label");
const ambiguousTests = conformance.tests.filter((row) => row.test_class === "ambiguous_label_rejection");
check(acceptedTests.every((row) => row.passed && row.actual_decision === "accept_label_for_field_review" && row.source_value_supplied === false && row.value_transformed === false && row.evidence_created === false), "Every accepted-label test must pass without a value, transformation, or evidence creation.");
check(ambiguousTests.every((row) => row.passed && row.actual_decision === "return_for_clarification" && row.matched_label === null && row.reason_code === "ambiguous_synthetic_label_not_exactly_accepted"), "Every ambiguous label must return for clarification without a match.");
for (const adapter of adapters.adapters) {
  const tests = conformance.tests.filter((row) => row.adapter_id === adapter.adapter_id);
  const testedAcceptedLabels = tests.filter((row) => row.test_class === "accepted_label").map((row) => row.accepted_label_under_test).sort();
  check(tests.length === 3, `${adapter.adapter_id} must have two accepted-label tests and one ambiguity rejection.`);
  check(JSON.stringify(testedAcceptedLabels) === JSON.stringify([...adapter.accepted_source_labels].sort()), `${adapter.adapter_id} does not exercise both accepted labels exactly once.`);
  check(tests.filter((row) => row.test_class === "ambiguous_label_rejection").length === 1, `${adapter.adapter_id} must have one ambiguity rejection.`);
}

check(fixtureResults.phase === "57N" && fixtureResults.validator_count === 9 && fixtureResults.fixture_execution_count === 18, "Phase 57N must execute eighteen fixtures through nine validators.");
check(fixtureResults.empty_fixture_executions === 9 && fixtureResults.incomplete_fixture_executions === 9, "Phase 57N fixture-type totals are incorrect.");
check(fixtureResults.passed_execution_count === 18 && fixtureResults.failed_execution_count === 0, "All Phase 57N fixture executions must pass.");
check(fixtureResults.actual_candidate_packets_evaluated === 0 && fixtureResults.evidence_records_ingested === 0 && fixtureResults.eligible_records_accepted === 0 && fixtureResults.reopening_triggers_fired === 0 && fixtureResults.automated_closures_or_publications === 0, "Fixture executions must remain non-evidence, non-triggering, and non-publishing.");
const expectedDecisionCounts = { return_for_clarification: 11, reject: 1, privacy_hold: 2, period_hold: 2, authority_hold: 2 };
check(Object.entries(expectedDecisionCounts).every(([decision, count]) => fixtureResults.actual_decision_counts[decision] === count), "Phase 57N fixture decision distribution is incorrect.");
check(fixtureResults.executions.every((row) => row.passed && row.expected_decision === row.actual_decision && row.fixture_only === true && row.candidate_packet_evaluated === false && row.evidence_ingested === false && row.fires_trigger === false && row.closes_hold_automatically === false && row.automated_publication_allowed === false), "Every Phase 57N fixture execution must remain bounded and deterministic.");
const fixtureIds = packets.templates.flatMap((template) => [template.empty_packet.fixture_id, template.incomplete_packet.fixture_id]).sort();
check(JSON.stringify(fixtureResults.executions.map((row) => row.fixture_id).sort()) === JSON.stringify(fixtureIds), "Phase 57N must execute every Phase 57M fixture exactly once.");

check(receipts.phase === "57N" && receipts.schema_version === "1.0" && receipts.contract_count === 9 && receipts.receipt_template_count === 54, "Phase 57N receipt ledger must contain fifty-four templates across nine contracts.");
check(receipts.actual_receipt_count === 0 && receipts.actual_reviewer_identities_recorded === 0 && receipts.actual_cited_sources_recorded === 0 && receipts.actual_publication_review_handoffs === 0, "Phase 57N receipt ledger must contain zero actual identities, citations, receipts, and handoffs.");
const requiredReceiptFields = ["reviewer_identity", "reason_code", "cited_source", "decision_time", "escalation_state", "publication_review_handoff"];
check(JSON.stringify(receipts.required_receipt_fields) === JSON.stringify(requiredReceiptFields), "Phase 57N receipt schema is missing required fields.");
check(new Set(receipts.templates.map((row) => row.receipt_template_id)).size === 54, "Phase 57N receipt template identifiers must be unique.");
const decisionRows = decisions.tables.flatMap((table) => table.rows);
check(JSON.stringify(receipts.templates.map((row) => row.phase57m_decision_id).sort()) === JSON.stringify(decisionRows.map((row) => row.decision_id).sort()), "Every Phase 57M decision row must have exactly one Phase 57N receipt template.");
check(receipts.templates.every((row) => row.template_only === true && row.actual_receipt === false && row.candidate_packet_id === null && row.reviewer_identity.profile_id === null && row.reviewer_identity.display_name === null && row.reason_code === null && row.cited_source.source_id === null && row.cited_source.official_url === null && row.cited_source.record_identifier === null && row.decision_time === null && row.escalation_state === "not_recorded" && row.fires_trigger === false && row.closes_hold_automatically === false && row.automated_publication_allowed === false && row.evidence_created === false), "Receipt templates must remain empty, non-evidentiary, and non-triggering.");
check(receipts.templates.filter((row) => row.decision_type === "accept").every((row) => row.publication_review_handoff.required_if_decision_is_accept === true), "Accept receipt templates must require a separate publication-review handoff.");
check(receipts.templates.filter((row) => row.decision_type !== "accept").every((row) => row.publication_review_handoff.required_if_decision_is_accept === false), "Non-accept receipt templates must not imply a publication-review handoff.");

const priorHoldKeys = phase57mHolds.map((record) => record.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57m_holds].sort()) === JSON.stringify(priorHoldKeys), "Phase 57N must preserve all Phase 57M holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57N must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9, "Phase 57N hold lineage must contain nine unique parents.");
check(new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57N hold lineage must preserve nine unique contracts.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57N") || question.includes("receipt")), `${file} must include a Phase 57N watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes("research-collection-adapter-conformance-packet-validation-reviewer-receipt-ledgers-2026"), `${file} must link the Phase 57N collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57N deterministic validation and reviewer receipts"), `${file} must include the Phase 57N dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57n-conformance-receipt-ledger"), "Dependency map must include the Phase 57N node.");
check(map.links.filter((link) => link.from === "node-phase57n-conformance-receipt-ledger").length === 3, "Dependency map must include three Phase 57N links.");

if (errors.length) {
  console.error("Phase 57N assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Phase 57N assertions passed: 20 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 120 accepted-label tests, 60 ambiguity rejections, 18 deterministic fixture executions, 54 reviewer-receipt templates, zero actual packets or receipts, zero triggers, and unchanged scope and closure ledgers.");
