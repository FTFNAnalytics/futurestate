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

const ledger = await readJson(join(dataRoot, "phase-57o-reviewer-role-authorization-receipt-integrity-publication-handoff-state-machines.json"));
const review = await readJson(join(dataRoot, "phase-57o-publication-review.json"));
const matrices = await readJson(join(dataRoot, "phase-57o-reviewer-role-authorization-matrices.json"));
const integrity = await readJson(join(dataRoot, "phase-57o-receipt-integrity-checks.json"));
const handoffs = await readJson(join(dataRoot, "phase-57o-publication-handoff-state-machines.json"));
const harness = await readJson(join(dataRoot, "phase-57o-workflow-harness-results.json"));
const phase57n = await readJson(join(dataRoot, "phase-57n-adapter-conformance-tests-packet-validation-harnesses-reviewer-receipt-ledgers.json"));
const receipts = await readJson(join(dataRoot, "phase-57n-reviewer-receipt-ledger.json"));
const collection = await readJson(join(contentRoot, "research-collections", "reviewer-authorization-receipt-integrity-publication-handoff-state-machines-2026.json"));
const documents = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^\d+-57o-.*\.json$/.test(name));
const signals = (await readdir(join(contentRoot, "signals"))).filter((name) => /^signal-57o-.*\.mdx$/.test(name));
const phase57nHolds = phase57n.records.filter((record) => record.record_status === "In Review");

check(ledger.phase === "57O", "Phase 57O ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((record) => record.record_id)).size === 29, "Phase 57O must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57O must publish twenty controls and preserve nine holds.");
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  check(ledger.evidence_stage_counts[`${rail} reviewer authorization, receipt integrity, and publication handoff controls`] === 5, `Phase 57O must publish five ${rail} controls.`);
}
check(ledger.evidence_stage_counts["Authorization, integrity, and handoff hold"] === 9, "Phase 57O must preserve nine authorization-and-integrity holds.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57O source-profile counts are incorrect.");
check(ledger.reviewer_role_matrices === 9 && ledger.decision_authorization_rows === 54, "Phase 57O must define nine role matrices and fifty-four decision rows.");
check(ledger.role_authorization_cases === 63 && ledger.same_actor_separation_rejections === 9, "Phase 57O role-authorization totals are incorrect.");
check(ledger.receipt_templates_validated === 54 && ledger.receipt_integrity_cases === 270, "Phase 57O receipt-integrity totals are incorrect.");
check(ledger.missing_field_rejections === 54 && ledger.incompatible_reason_code_rejections === 54 && ledger.mutated_citation_rejections === 54 && ledger.mutated_timestamp_rejections === 54, "Phase 57O receipt rejection totals are incorrect.");
check(ledger.publication_handoff_state_machines === 9 && ledger.publication_handoff_cases === 90, "Phase 57O handoff totals are incorrect.");
check(ledger.complete_accept_queue_routes === 9 && ledger.complete_nonaccept_terminal_routes === 45 && ledger.invalid_accept_integrity_rejections === 36, "Phase 57O handoff routing totals are incorrect.");
check(ledger.total_workflow_cases === 423 && ledger.workflow_test_failures === 0, "All 423 Phase 57O workflow cases must pass.");
check(ledger.actual_candidate_packets_evaluated === 0 && ledger.eligible_records_accepted === 0 && ledger.actual_accept_decisions === 0, "Phase 57O must record zero actual packets and accept decisions.");
check(ledger.actual_reviewer_identities === 0 && ledger.actual_reviewer_receipts === 0 && ledger.actual_publication_review_handoffs === 0 && ledger.actual_publication_reviews === 0, "Phase 57O must record zero actual reviewers, receipts, handoffs, and publication reviews.");
check(ledger.exact_target_trigger_events === 0 && ledger.exact_target_artifacts_acquired === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57O must record zero triggers, acquisitions, agency contacts, and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57O must preserve directive, implementation, and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57n.post_batch_visible_scope), "Phase 57O must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57O must preserve the 1 / 21 / 2 entity ledger.");

const recordStatuses = countBy(ledger.records, "record_status");
check(recordStatuses.Published === 20 && recordStatuses["In Review"] === 9, "Phase 57O record statuses are incorrect.");
check(documents.length === 29 && signals.length === 29 && collection.document_ids.length === 29, "Phase 57O must generate twenty-nine documents, signals, and collection members.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57O publication-review counts are incorrect.");

check(matrices.phase === "57O" && matrices.matrix_count === 9 && matrices.decision_authorization_rows === 54, "Phase 57O role registry must contain nine matrices and fifty-four rows.");
check(matrices.role_authorization_case_count === 63 && matrices.same_actor_separation_rejections === 9 && matrices.passed_case_count === 63 && matrices.failed_case_count === 0, "All Phase 57O role cases must pass.");
check(matrices.actual_reviewer_identities_created === 0 && matrices.actual_authorizations_recorded === 0 && matrices.automated_trigger_closure_or_publication_allowed === false, "Role matrices must remain unassigned and non-automating.");
check(new Set(matrices.matrices.map((matrix) => matrix.contract_id)).size === 9, "Role matrices must cover nine unique contracts.");
check(matrices.matrices.every((matrix) => matrix.role_classes.length === 3 && matrix.decision_authorizations.length === 6), "Every role matrix must contain three roles and six decision rows.");
check(matrices.matrices.flatMap((matrix) => matrix.decision_authorizations).filter((row) => row.decision_type === "accept").every((row) => row.publication_reviewer_required && row.separation_of_duties_required && row.publication_queue_entry_allowed && row.automated_publication_allowed === false), "Every accept authorization must require a distinct publication reviewer without automation.");
check(matrices.test_cases.every((row) => row.passed && row.fixture_only && row.actual_reviewer_identity_created === false && row.fires_trigger === false && row.closes_hold_automatically === false && row.automated_publication_allowed === false && row.evidence_created === false), "Role cases must remain passing, synthetic, and non-automating.");
check(matrices.test_cases.filter((row) => row.test_class === "same_actor_separation_rejection").every((row) => row.reason_code === "evidence_and_publication_reviewers_must_differ"), "All nine same-actor accept cases must be rejected explicitly.");

check(integrity.phase === "57O" && integrity.receipt_templates_validated === 54 && integrity.integrity_case_count === 270, "Phase 57O integrity registry must validate fifty-four templates in 270 cases.");
check(integrity.complete_synthetic_receipt_cases === 54 && integrity.missing_required_field_rejections === 54 && integrity.incompatible_reason_code_rejections === 54 && integrity.mutated_citation_rejections === 54 && integrity.mutated_decision_time_rejections === 54, "Phase 57O integrity-case distribution is incorrect.");
check(integrity.passed_case_count === 270 && integrity.failed_case_count === 0 && integrity.actual_receipts_created === 0 && integrity.actual_citations_recorded === 0, "All Phase 57O integrity cases must pass without actual receipts or citations.");
check(new Set(integrity.cases.map((row) => row.test_id)).size === 270, "Phase 57O integrity test identifiers must be unique.");
check(integrity.cases.every((row) => row.passed && row.fixture_only && row.actual_receipt === false && row.fires_trigger === false && row.closes_hold_automatically === false && row.automated_publication_allowed === false && row.evidence_created === false), "Integrity cases must remain passing, synthetic, and non-automating.");
const expectedIntegrityDecisions = {
  complete_synthetic_receipt: "integrity_valid",
  missing_required_field: "reject_missing_required_field",
  incompatible_reason_code: "reject_reason_code_incompatible",
  mutated_citation: "reject_citation_mutated",
  mutated_decision_time: "reject_decision_time_mutated",
};
check(integrity.cases.every((row) => row.actual_decision === expectedIntegrityDecisions[row.test_class]), "Every integrity case must reach its decision-specific route.");

check(handoffs.phase === "57O" && handoffs.state_machine_count === 9 && handoffs.handoff_case_count === 90, "Phase 57O must define nine handoff machines and ninety cases.");
check(handoffs.complete_accept_queue_routes === 9 && handoffs.complete_nonaccept_terminal_routes === 45 && handoffs.invalid_accept_integrity_rejections === 36, "Phase 57O handoff state distribution is incorrect.");
check(handoffs.passed_case_count === 90 && handoffs.failed_case_count === 0 && handoffs.actual_publication_review_handoffs === 0 && handoffs.actual_publication_reviews === 0 && handoffs.reopening_triggers_fired === 0 && handoffs.automated_closures_or_publications === 0, "Handoff cases must pass without actual handoffs, reviews, triggers, closures, or publications.");
check(handoffs.state_machines.every((machine) => machine.decision_types.length === 6 && machine.prohibited_transitions.length === 6), "Every handoff machine must cover six decisions and six prohibited transitions.");
check(handoffs.cases.every((row) => row.passed && row.fixture_only && row.actual_publication_review_handoff === false && row.fires_trigger === false && row.closes_hold_automatically === false && row.automated_publication_allowed === false && row.evidence_created === false), "Handoff cases must remain passing, synthetic, and non-automating.");
check(handoffs.cases.filter((row) => row.test_class === "complete_receipt_state_route" && row.decision_type === "accept").every((row) => row.actual_state === "awaiting_separate_publication_review"), "Only complete accept fixtures may await separate publication review.");
check(handoffs.cases.filter((row) => row.test_class === "complete_receipt_state_route" && row.decision_type !== "accept").every((row) => row.actual_state === "decision_terminal_no_handoff"), "Every non-accept fixture must terminate without publication handoff.");
check(handoffs.cases.filter((row) => row.test_class.startsWith("invalid_accept_")).every((row) => row.actual_state === "integrity_rejected"), "Every invalid accept fixture must be rejected before publication review.");

check(harness.phase === "57O" && harness.total_case_count === 423 && harness.passed_case_count === 423 && harness.failed_case_count === 0, "Phase 57O aggregate harness totals are incorrect.");
check(harness.role_authorization_cases === 63 && harness.receipt_integrity_cases === 270 && harness.publication_handoff_cases === 90, "Phase 57O aggregate case classes are incorrect.");
check(new Set(harness.test_ids).size === 423, "Phase 57O aggregate test identifiers must be unique.");
check(harness.actual_candidate_packets_evaluated === 0 && harness.actual_reviewer_identities_created === 0 && harness.actual_reviewer_receipts === 0 && harness.actual_publication_review_handoffs === 0 && harness.actual_publication_reviews === 0 && harness.eligible_records_accepted === 0 && harness.reopening_triggers_fired === 0 && harness.automated_closures_or_publications === 0 && harness.evidence_records_created === 0, "Phase 57O aggregate harness must record zero actual workflow and evidence events.");

check(receipts.templates.length === 54, "Phase 57O must cover every Phase 57N receipt template.");
const receiptTemplateIds = receipts.templates.map((row) => row.receipt_template_id).sort();
check(JSON.stringify([...new Set(integrity.cases.map((row) => row.receipt_template_id))].sort()) === JSON.stringify(receiptTemplateIds), "Integrity cases must cover every receipt template.");
const priorHoldKeys = phase57nHolds.map((record) => record.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57n_holds].sort()) === JSON.stringify(priorHoldKeys), "Phase 57O must preserve all Phase 57N holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57O must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9, "Phase 57O hold lineage must contain nine unique parents.");
check(new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57O hold lineage must preserve nine unique contracts.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57O") || question.includes("publication reviewer")), `${file} must include a Phase 57O watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes("research-collection-reviewer-authorization-receipt-integrity-publication-handoff-state-machines-2026"), `${file} must link the Phase 57O collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57O reviewer authorization, receipt integrity, and publication handoffs"), `${file} must include the Phase 57O dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57o-role-integrity-handoff"), "Dependency map must include the Phase 57O node.");
check(map.links.filter((link) => link.from === "node-phase57o-role-integrity-handoff").length === 3, "Dependency map must include three Phase 57O links.");

if (errors.length) {
  console.error("Phase 57O assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Phase 57O assertions passed: 20 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 9 role matrices, 270 integrity cases, 63 authorization cases, 90 handoff cases, zero actual packets or receipts, zero triggers, and unchanged scope and closure ledgers.");
