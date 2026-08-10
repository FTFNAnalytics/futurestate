import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const countBy = (rows, field) => rows.reduce((counts, row) => { counts[row[field]] = (counts[row[field]] ?? 0) + 1; return counts; }, {});

const ledger = await readJson(join(dataRoot, "phase-57p-append-only-dual-review-audit-chains-cross-role-adjudication-publication-review-receipts.json"));
const review = await readJson(join(dataRoot, "phase-57p-publication-review.json"));
const audit = await readJson(join(dataRoot, "phase-57p-append-only-dual-review-audit-chains.json"));
const publication = await readJson(join(dataRoot, "phase-57p-publication-review-decision-receipts.json"));
const adjudication = await readJson(join(dataRoot, "phase-57p-cross-role-adjudication-fixtures.json"));
const harness = await readJson(join(dataRoot, "phase-57p-dual-review-harness-results.json"));
const phase57o = await readJson(join(dataRoot, "phase-57o-reviewer-role-authorization-receipt-integrity-publication-handoff-state-machines.json"));
const collection = await readJson(join(contentRoot, "research-collections", "dual-review-audit-chains-adjudication-publication-decision-receipts-2026.json"));
const documents = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^\d+-57p-.*\.json$/.test(name));
const signals = (await readdir(join(contentRoot, "signals"))).filter((name) => /^signal-57p-.*\.mdx$/.test(name));
const phase57oHolds = phase57o.records.filter((record) => record.record_status === "In Review");

check(ledger.phase === "57P", "Phase 57P ledger has the wrong phase.");
check(ledger.records.length === 29 && new Set(ledger.records.map((record) => record.record_id)).size === 29, "Phase 57P must contain twenty-nine unique records.");
check(ledger.records_published === 20 && ledger.records_held === 9, "Phase 57P must publish twenty controls and preserve nine holds.");
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  check(ledger.evidence_stage_counts[`${rail} append-only audit, adjudication, and publication-receipt controls`] === 5, `Phase 57P must publish five ${rail} controls.`);
}
check(ledger.evidence_stage_counts["Dual-review audit and adjudication hold"] === 9, "Phase 57P must preserve nine dual-review holds.");
check(ledger.new_official_source_profiles === 0 && ledger.carried_official_source_profiles === 36, "Phase 57P source-profile counts are incorrect.");
check(ledger.audit_chain_schemas === 9 && ledger.audit_chain_cases === 81, "Phase 57P audit-chain totals are incorrect.");
check(ledger.publication_receipt_cases === 162 && ledger.valid_publication_receipt_cases === 54 && ledger.incompatible_publication_reason_rejections === 54 && ledger.mutated_publication_attribution_rejections === 54, "Phase 57P publication-receipt totals are incorrect.");
check(ledger.adjudication_cases === 90 && ledger.concordant_accept_manual_release_routes === 9 && ledger.disagreement_escalation_routes === 18 && ledger.bounded_block_escalation_routes === 27, "Phase 57P adjudication route totals are incorrect.");
check(ledger.role_authorization_rejections === 9 && ledger.escalation_ownership_rejections === 9 && ledger.nonaccept_override_rejections === 9 && ledger.append_only_supersession_routes === 9, "Phase 57P adjudication rejection or supersession totals are incorrect.");
check(ledger.total_workflow_cases === 333 && ledger.workflow_test_failures === 0, "All 333 Phase 57P workflow cases must pass.");
check(ledger.actual_candidate_packets_evaluated === 0 && ledger.eligible_records_accepted === 0 && ledger.actual_accept_decisions === 0, "Phase 57P must record zero actual packets and accept decisions.");
check(ledger.actual_reviewer_identities === 0 && ledger.actual_evidence_receipts === 0 && ledger.actual_publication_receipts === 0 && ledger.actual_adjudications === 0 && ledger.actual_escalations === 0 && ledger.actual_manual_release_authorizations === 0 && ledger.actual_publications === 0, "Phase 57P must record zero actual reviewers, receipts, adjudications, releases, and publications.");
check(ledger.exact_target_trigger_events === 0 && ledger.exact_target_artifacts_acquired === 0 && ledger.public_agency_contacts_or_foia_requests === 0, "Phase 57P must record zero triggers, acquisitions, agency contacts, and FOIA requests.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57P must preserve directive, implementation, and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57o.post_batch_visible_scope), "Phase 57P must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57P must preserve the 1 / 21 / 2 entity ledger.");

const statuses = countBy(ledger.records, "record_status");
check(statuses.Published === 20 && statuses["In Review"] === 9, "Phase 57P record statuses are incorrect.");
check(documents.length === 29 && signals.length === 29 && collection.document_ids.length === 29, "Phase 57P must generate twenty-nine documents, signals, and collection members.");
check(review.promoted_document_ids.length === 20 && review.promoted_signal_ids.length === 20 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57P publication-review counts are incorrect.");

check(audit.phase === "57P" && audit.audit_chain_schema_count === 9 && audit.audit_case_count === 81, "Phase 57P audit registry must contain nine schemas and eighty-one cases.");
check(audit.passed_case_count === 81 && audit.failed_case_count === 0 && audit.actual_audit_events_created === 0 && audit.actual_receipts_linked === 0 && audit.prior_events_mutated === 0, "All Phase 57P audit cases must pass without actual events or mutation.");
check(audit.schemas.every((schema) => schema.append_only_event_types.length === 6 && schema.prohibited_operations.length === 7 && schema.manual_release_required_after_concordant_accept), "Every Phase 57P audit schema must preserve append-only and manual-release rules.");
check(Object.values(audit.case_distribution).every((count) => count === 9) && Object.keys(audit.case_distribution).length === 9, "Each audit test class must execute once per contract.");
check(audit.cases.every((row) => row.passed && row.fixture_only && row.actual_audit_event === false && row.prior_event_mutated === false && row.fires_trigger === false && row.closes_hold_automatically === false && row.publishes_automatically === false && row.evidence_created === false), "Audit cases must remain passing, synthetic, immutable, and non-automating.");

check(publication.phase === "57P" && publication.publication_receipt_case_count === 162 && publication.decision_types.length === 6, "Phase 57P publication registry must cover 162 cases and six decisions.");
check(publication.valid_publication_receipt_cases === 54 && publication.incompatible_reason_code_rejections === 54 && publication.mutated_attribution_rejections === 54, "Phase 57P publication-case distribution is incorrect.");
check(publication.passed_case_count === 162 && publication.failed_case_count === 0 && publication.actual_publication_receipts_created === 0 && publication.actual_publication_reviewers_created === 0, "All Phase 57P publication receipts must pass without actual receipts or reviewers.");
check(new Set(publication.cases.map((row) => row.test_id)).size === 162, "Phase 57P publication-receipt test identifiers must be unique.");
check(publication.cases.every((row) => row.passed && row.fixture_only && row.actual_publication_receipt === false && row.actual_reviewer_identity_created === false && row.fires_trigger === false && row.closes_hold_automatically === false && row.publishes_automatically === false && row.evidence_created === false), "Publication-receipt cases must remain passing, synthetic, and non-automating.");
check(publication.cases.filter((row) => row.test_class === "valid_publication_receipt").every((row) => row.actual_decision === "publication_receipt_valid"), "Every valid publication receipt must pass.");
check(publication.cases.filter((row) => row.test_class === "incompatible_publication_reason").every((row) => row.actual_decision === "reject_publication_reason_code"), "Every incompatible publication reason must be rejected.");
check(publication.cases.filter((row) => row.test_class === "mutated_publication_attribution").every((row) => row.actual_decision === "reject_publication_attribution_mutated"), "Every mutated publication attribution must be rejected.");

check(adjudication.phase === "57P" && adjudication.adjudication_case_count === 90, "Phase 57P adjudication registry must contain ninety cases.");
check(adjudication.concordant_accept_manual_release_routes === 9 && adjudication.disagreement_escalation_routes === 18 && adjudication.bounded_block_escalation_routes === 27, "Phase 57P adjudication state distribution is incorrect.");
check(adjudication.role_authorization_rejections === 9 && adjudication.escalation_ownership_rejections === 9 && adjudication.nonaccept_override_rejections === 9 && adjudication.append_only_supersession_routes === 9, "Phase 57P adjudication rejections and supersessions are incorrect.");
check(adjudication.passed_case_count === 90 && adjudication.failed_case_count === 0 && adjudication.actual_adjudications_created === 0 && adjudication.actual_escalations_created === 0 && adjudication.disagreement_collapsed_to_accept === 0, "Adjudication cases must pass without actual adjudications, escalations, or collapsed disagreements.");
check(adjudication.cases.every((row) => row.passed && row.fixture_only && row.actual_adjudication === false && row.disagreement_collapsed_to_accept === false && row.prior_receipt_mutated === false && row.fires_trigger === false && row.closes_hold_automatically === false && row.publishes_automatically === false && row.evidence_created === false), "Adjudication cases must remain passing, synthetic, append-only, and non-automating.");
check(adjudication.cases.filter((row) => row.test_class === "concordant_accept").every((row) => row.actual_decision === "concordant_accept_awaiting_manual_release"), "Concordant accept must stop at manual release authorization.");
check(adjudication.cases.filter((row) => row.test_class === "publication_accept_over_nonaccept_rejection").every((row) => row.actual_decision === "adjudication_override_rejected"), "Publication accept may not override a nonaccept evidence decision.");
check(adjudication.cases.filter((row) => row.test_class === "append_only_supersession").every((row) => row.actual_decision === "supersession_appended_prior_preserved"), "Supersession must append while preserving prior receipts.");

check(harness.phase === "57P" && harness.total_case_count === 333 && harness.passed_case_count === 333 && harness.failed_case_count === 0, "Phase 57P aggregate harness totals are incorrect.");
check(harness.audit_chain_cases === 81 && harness.publication_receipt_cases === 162 && harness.adjudication_cases === 90, "Phase 57P aggregate case classes are incorrect.");
check(new Set(harness.test_ids).size === 333, "Phase 57P aggregate test identifiers must be unique.");
check(harness.actual_candidate_packets_evaluated === 0 && harness.actual_evidence_receipts === 0 && harness.actual_publication_receipts === 0 && harness.actual_adjudications === 0 && harness.actual_escalations === 0 && harness.actual_manual_release_authorizations === 0 && harness.eligible_records_accepted === 0 && harness.reopening_triggers_fired === 0 && harness.automated_closures_or_publications === 0 && harness.evidence_records_created === 0, "Phase 57P aggregate harness must record zero actual workflow and evidence events.");

const priorHoldKeys = phase57oHolds.map((record) => record.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57o_holds].sort()) === JSON.stringify(priorHoldKeys), "Phase 57P must preserve all Phase 57O holds exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57P must add no new visible hold.");
check(new Set(review.inherited_hold_lineage.map((row) => row.parent_hold_key)).size === 9 && new Set(review.inherited_hold_lineage.map((row) => row.reopening_contract_id)).size === 9, "Phase 57P hold lineage must preserve nine unique parents and contracts.");

for (const file of ["finance-and-risk.json", "policy-and-standards.json", "mobility.json", "chips-and-compute.json", "energy.json"]) {
  const topic = await readJson(join(contentRoot, "topics", file));
  check(topic.watch_questions.some((question) => question.includes("Phase 57P")), `${file} must include a Phase 57P watch question.`);
}
for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.research_collection_ids.includes("research-collection-dual-review-audit-chains-adjudication-publication-decision-receipts-2026"), `${file} must link the Phase 57P collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57P append-only dual review, adjudication, and publication receipts"), `${file} must include the Phase 57P dependency stage.`);
}
const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57p-dual-review-audit"), "Dependency map must include the Phase 57P node.");
check(map.links.filter((link) => link.from === "node-phase57p-dual-review-audit").length === 3, "Dependency map must include three Phase 57P links.");

if (errors.length) {
  console.error("Phase 57P assertions failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Phase 57P assertions passed: 20 Published controls, 9 preserved In Review holds, 36 carried Tier 1 sources, 9 audit chains, 81 audit cases, 162 publication-receipt cases, 90 adjudication cases, zero actual receipts or releases, zero triggers, and unchanged scope and closure ledgers.");
