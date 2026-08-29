import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { countBy, runPhase57oHarness } from "./phase57o-workflow-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "reviewer-authorization-receipt-integrity-publication-handoff-state-machines-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-045-reviewer-authorization-receipt-integrity-publication-handoffs";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57n = JSON.parse(await readFile(join(dataRoot, "phase-57n-adapter-conformance-tests-packet-validation-harnesses-reviewer-receipt-ledgers.json"), "utf8"));
const receiptLedger = JSON.parse(await readFile(join(dataRoot, "phase-57n-reviewer-receipt-ledger.json"), "utf8"));
if (phase57n.phase !== "57N" || phase57n.records.length !== 29 || receiptLedger.templates.length !== 54) {
  throw new Error("Phase 57O requires the complete Phase 57N record and reviewer-receipt baseline.");
}

const harness = runPhase57oHarness(receiptLedger.templates);
if (
  harness.matrices.length !== 9 ||
  harness.integrityCases.length !== 270 ||
  harness.roleCases.length !== 63 ||
  harness.stateMachines.length !== 9 ||
  harness.handoffCases.length !== 90 ||
  harness.allCases.length !== 423 ||
  harness.failures.length !== 0
) {
  throw new Error("Phase 57O requires 423 passing workflow cases across nine contracts.");
}

const authorityBoundary = "Agency assertions, independent oversight, FTFN workflow controls, evidence-review identity, publication-review identity, receipt integrity, acceptance, implementation, capability, closure, and operating outcomes remain separate evidence states.";
const agencyMeta = {
  DOT: { topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};
const agencyByRail = { Amtrak: "DOT", Broadband: "NTIA", Hanford: "DOE", NNSA: "DOE" };
const contractLabel = {
  "REOPEN-AMTRAK-PIDS": "Amtrak PIDS closeout",
  "REOPEN-AMTRAK-RELIABILITY": "Amtrak named-asset reliability",
  "REOPEN-LA-NEXTLINK-ADOPTION": "Louisiana Nextlink adoption",
  "REOPEN-LA-STARLINK-ADOPTION": "Louisiana Starlink adoption",
  "REOPEN-MT-BEAD-QUARTER": "Montana BEAD completed quarter",
  "REOPEN-HANFORD-MASS-BALANCE": "Hanford complete material balance",
  "REOPEN-NNSA-QUALIFIED-RATE": "NNSA recurring qualified rate",
  "REOPEN-NNSA-ACCEPTED-CAPACITY": "NNSA accepted operating capacity",
  "REOPEN-NNSA-GAO-BASELINE": "NNSA GAO enterprise baseline",
};

const passedCount = (rows) => rows.filter((row) => row.passed).length;
const matricesRegistry = {
  phase: "57O",
  captured_date: capturedDate,
  registry_type: "Reviewer-role authorization matrices and separation-of-duties tests",
  matrix_count: harness.matrices.length,
  contract_count: harness.matrices.length,
  role_classes_per_matrix: 3,
  decision_authorization_rows: harness.matrices.reduce((sum, matrix) => sum + matrix.decision_authorizations.length, 0),
  role_authorization_case_count: harness.roleCases.length,
  same_actor_separation_rejections: harness.roleCases.filter((row) => row.test_class === "same_actor_separation_rejection").length,
  passed_case_count: passedCount(harness.roleCases),
  failed_case_count: harness.roleCases.filter((row) => !row.passed).length,
  actual_reviewer_identities_created: 0,
  actual_authorizations_recorded: 0,
  automated_trigger_closure_or_publication_allowed: false,
  authorization_rule: "An evidence reviewer may sign the bounded evidence decision receipt but may not perform publication review for the same packet. Only a distinct publication reviewer may inspect a complete accept receipt, and neither role may trigger, close, or publish automatically.",
  matrices: harness.matrices,
  test_cases: harness.roleCases,
};
await writeJson(join(dataRoot, "phase-57o-reviewer-role-authorization-matrices.json"), matricesRegistry);

const integrityRegistry = {
  phase: "57O",
  captured_date: capturedDate,
  registry_type: "Receipt completeness, reason-code compatibility, and signed-field integrity checks",
  schema_version: "1.0",
  receipt_templates_validated: receiptLedger.templates.length,
  integrity_case_count: harness.integrityCases.length,
  complete_synthetic_receipt_cases: harness.integrityCases.filter((row) => row.test_class === "complete_synthetic_receipt").length,
  missing_required_field_rejections: harness.integrityCases.filter((row) => row.test_class === "missing_required_field").length,
  incompatible_reason_code_rejections: harness.integrityCases.filter((row) => row.test_class === "incompatible_reason_code").length,
  mutated_citation_rejections: harness.integrityCases.filter((row) => row.test_class === "mutated_citation").length,
  mutated_decision_time_rejections: harness.integrityCases.filter((row) => row.test_class === "mutated_decision_time").length,
  passed_case_count: passedCount(harness.integrityCases),
  failed_case_count: harness.integrityCases.filter((row) => !row.passed).length,
  actual_receipts_created: 0,
  actual_citations_recorded: 0,
  immutable_signed_fields: ["receipt_template_id", "contract_id", "decision_type", "candidate_packet_id", "reviewer_identity", "reason_code", "cited_source", "decision_time", "escalation_state", "publication_review_handoff"],
  integrity_rule: "A receipt is valid only when all required fields exist, its reason code is allowed for the bounded decision, its cited source and decision time match the signed snapshot, and the complete signed-field digest remains unchanged.",
  cases: harness.integrityCases,
};
await writeJson(join(dataRoot, "phase-57o-receipt-integrity-checks.json"), integrityRegistry);

const handoffRegistry = {
  phase: "57O",
  captured_date: capturedDate,
  registry_type: "Publication-review handoff state machines and deterministic route checks",
  state_machine_count: harness.stateMachines.length,
  contract_count: harness.stateMachines.length,
  handoff_case_count: harness.handoffCases.length,
  complete_accept_queue_routes: harness.handoffCases.filter((row) => row.test_class === "complete_receipt_state_route" && row.decision_type === "accept" && row.actual_state === "awaiting_separate_publication_review").length,
  complete_nonaccept_terminal_routes: harness.handoffCases.filter((row) => row.test_class === "complete_receipt_state_route" && row.decision_type !== "accept" && row.actual_state === "decision_terminal_no_handoff").length,
  invalid_accept_integrity_rejections: harness.handoffCases.filter((row) => row.test_class.startsWith("invalid_accept_") && row.actual_state === "integrity_rejected").length,
  passed_case_count: passedCount(harness.handoffCases),
  failed_case_count: harness.handoffCases.filter((row) => !row.passed).length,
  actual_publication_review_handoffs: 0,
  actual_publication_reviews: 0,
  reopening_triggers_fired: 0,
  automated_closures_or_publications: 0,
  handoff_rule: "Only a complete, integrity-valid accept receipt with an authorized publication reviewer distinct from the evidence reviewer may enter the separate publication-review queue. Queue entry is not publication and cannot fire a trigger or close a hold.",
  state_machines: harness.stateMachines,
  cases: harness.handoffCases,
};
await writeJson(join(dataRoot, "phase-57o-publication-handoff-state-machines.json"), handoffRegistry);

const workflowRegistry = {
  phase: "57O",
  captured_date: capturedDate,
  registry_type: "Executable reviewer authorization, receipt-integrity, and publication-handoff harness results",
  total_case_count: harness.allCases.length,
  passed_case_count: passedCount(harness.allCases),
  failed_case_count: harness.failures.length,
  role_authorization_cases: harness.roleCases.length,
  receipt_integrity_cases: harness.integrityCases.length,
  publication_handoff_cases: harness.handoffCases.length,
  result_counts: countBy(harness.allCases.map((row) => ({ result: row.actual_decision ?? row.actual_state })), "result"),
  actual_candidate_packets_evaluated: 0,
  actual_reviewer_identities_created: 0,
  actual_reviewer_receipts: 0,
  actual_publication_review_handoffs: 0,
  actual_publication_reviews: 0,
  eligible_records_accepted: 0,
  reopening_triggers_fired: 0,
  automated_closures_or_publications: 0,
  evidence_records_created: 0,
  test_ids: harness.allCases.map((row) => row.test_id),
};
await writeJson(join(dataRoot, "phase-57o-workflow-harness-results.json"), workflowRegistry);

const heldPhase57n = phase57n.records.filter((record) => record.record_status === "In Review");
const templatesByContract = Map.groupBy(receiptLedger.templates, (template) => template.contract_id);
const sourcesForRail = (rail) => [...new Set(phase57n.records.filter((record) => {
  if (rail === "Amtrak") return record.agency === "DOT";
  if (rail === "Broadband") return record.agency === "NTIA";
  if (rail === "Hanford") return /^Hanford|HANFORD/.test(`${record.title} ${record.action_key}`);
  return /^NNSA|NNSA/.test(`${record.title} ${record.action_key}`);
}).flatMap((record) => record.supporting_source_ids))];
const sourceIdsByRail = {
  Amtrak: sourcesForRail("Amtrak"),
  Broadband: sourcesForRail("Broadband"),
  Hanford: sourcesForRail("Hanford"),
  NNSA: sourcesForRail("NNSA"),
};

const summaryForRail = (rail) => {
  const matrices = harness.matrices.filter((row) => row.evidence_rail === rail);
  const integrity = harness.integrityCases.filter((row) => row.evidence_rail === rail);
  const roles = harness.roleCases.filter((row) => row.evidence_rail === rail);
  const handoffs = harness.handoffCases.filter((row) => row.evidence_rail === rail);
  return {
    contracts: matrices.length,
    templates: matrices.reduce((sum, matrix) => sum + matrix.decision_authorizations.length, 0),
    integrity: integrity.length,
    roleCases: roles.length,
    sameActorRejections: roles.filter((row) => row.test_class === "same_actor_separation_rejection").length,
    mutationRejections: integrity.filter((row) => ["mutated_citation", "mutated_decision_time"].includes(row.test_class)).length,
    handoffs: handoffs.length,
    acceptRoutes: handoffs.filter((row) => row.test_class === "complete_receipt_state_route" && row.decision_type === "accept").length,
    nonacceptRoutes: handoffs.filter((row) => row.test_class === "complete_receipt_state_route" && row.decision_type !== "accept").length,
    invalidAcceptRejections: handoffs.filter((row) => row.test_class.startsWith("invalid_accept_")).length,
  };
};

const specs = [];
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  const summary = summaryForRail(rail);
  const slugRail = rail.toLowerCase();
  const sourceIds = sourceIdsByRail[rail];
  const stage = `${rail} reviewer authorization, receipt integrity, and publication handoff controls`;
  specs.push(
    {
      slug: `${slugRail}-${summary.contracts}-reviewer-role-authorization-matrices`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-REVIEWER-ROLE-AUTHORIZATION-2026-01`, stage, sourceIds,
      title: `${rail} separates evidence and publication review across ${summary.contracts} contracts`,
      finding: `${summary.contracts} role matrices authorize evidence, publication, and escalation review separately, and reject ${summary.sameActorRejections} same-actor accept configurations.`,
      denominator: `${summary.contracts} matrices, ${summary.templates} decision rows, ${summary.roleCases} authorization cases, and zero actual reviewer identities.`,
      limits: ["Role classes are workflow definitions, not assigned people.", "An evidence reviewer cannot perform publication review for the same packet.", "Authorization cannot supply evidence, fire a trigger, close a hold, or publish."],
      next: "Assign distinct named reviewers only when one complete cited packet enters actual review.", registry: "phase-57o-reviewer-role-authorization-matrices.json",
    },
    {
      slug: `${slugRail}-${summary.integrity}-receipt-completeness-reason-code-checks`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-RECEIPT-INTEGRITY-CHECKS-2026-01`, stage, sourceIds,
      title: `${rail} passes ${summary.integrity} receipt completeness and reason-code checks`,
      finding: `Every ${rail} receipt template passes a complete synthetic case and rejects missing required fields or decision-incompatible reason codes.`,
      denominator: `${summary.integrity} fixture-only integrity cases across ${summary.templates} templates; zero failures and zero actual receipts.`,
      limits: ["A complete synthetic receipt is not an actual review receipt.", "Reason-code compatibility does not validate the underlying evidence.", "Missing fields cannot be inferred or backfilled across records."],
      next: "Require every actual receipt field and decision-specific reason code before signing.", registry: "phase-57o-receipt-integrity-checks.json",
    },
    {
      slug: `${slugRail}-${summary.mutationRejections}-citation-timestamp-mutation-rejections`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-SIGNED-RECEIPT-MUTATION-REJECTIONS-2026-01`, stage, sourceIds,
      title: `${rail} rejects ${summary.mutationRejections} signed citation and timestamp mutations`,
      finding: `Every post-signature ${rail} citation and decision-time mutation is detected against the immutable signed snapshot and rejected.`,
      denominator: `${summary.mutationRejections} mutation cases across ${summary.templates} templates; all rejected and zero source records altered.`,
      limits: ["Synthetic mutation cases do not alter public source records.", "Integrity rejection does not determine the substantive review outcome.", "A rejected receipt cannot enter publication review."],
      next: "Preserve signed citation, timestamp, and digest values as immutable audit fields.", registry: "phase-57o-receipt-integrity-checks.json",
    },
    {
      slug: `${slugRail}-${summary.handoffs}-publication-handoff-state-routes`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-PUBLICATION-HANDOFF-STATE-MACHINES-2026-01`, stage, sourceIds,
      title: `${rail} routes ${summary.handoffs} publication-handoff cases without automatic publication`,
      finding: `${summary.acceptRoutes} complete accept fixtures reach a separate publication-review queue, ${summary.nonacceptRoutes} non-accept fixtures terminate without handoff, and ${summary.invalidAcceptRejections} invalid accept fixtures are rejected.`,
      denominator: `${summary.handoffs} state-machine cases across ${summary.contracts} contracts; zero actual handoffs, triggers, closures, or publications.`,
      limits: ["Queue entry is not a publication decision.", "Only complete accept receipts may reach separate publication review.", "No state transition fires a trigger, closes a hold, or publishes automatically."],
      next: "Keep the publication queue empty until one actual complete accept receipt has a distinct authorized reviewer.", registry: "phase-57o-publication-handoff-state-machines.json",
    },
    {
      slug: `${slugRail}-zero-actual-review-handoff-trigger-or-publication-events`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-ZERO-PHASE57O-WORKFLOW-EVENTS-2026-01`, stage, sourceIds,
      title: `${rail} records zero actual reviews, handoffs, triggers, closures, or publications`,
      finding: "Authorization, integrity, and handoff fixtures prove bounded workflow behavior without evaluating evidence, assigning reviewers, or creating an editorial decision.",
      denominator: `${summary.integrity + summary.roleCases + summary.handoffs} executable cases, ${summary.templates} receipt templates, and zero actual workflow events.`,
      limits: ["Passing fixture tests are not candidate eligibility.", "Synthetic roles and receipts do not create reviewer identity or evidence.", "Human evidence review and separate publication review remain mandatory."],
      next: "Preserve the hold until a complete cited packet receives a named evidence decision and separate publication review.", registry: "phase-57o-workflow-harness-results.json",
    },
  );
}

const nextHoldKeys = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2027-01": "AMTRAK-PIDS-CLOSEOUT-HOLD-2027-02",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-12": "AMTRAK-NAMED-RELIABILITY-HOLD-2027-01",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2027-01": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2027-02",
  "LA-BEAD-STARLINK-HOLD-2027-01": "LA-BEAD-STARLINK-HOLD-2027-02",
  "MT-BEAD-QUARTERLY-HOLD-2027-01": "MT-BEAD-QUARTERLY-HOLD-2027-02",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-10": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-11",
  "NNSA-PIT-RATE-HOLD-2027-01": "NNSA-PIT-RATE-HOLD-2027-02",
  "NNSA-PIT-PEIS-HOLD-2027-01": "NNSA-PIT-PEIS-HOLD-2027-02",
  "NNSA-PIT-GAO-BASELINE-HOLD-2027-02": "NNSA-PIT-GAO-BASELINE-HOLD-2027-03",
};
const heldSpecs = heldPhase57n.map((prior) => {
  const templates = templatesByContract.get(prior.reopening_contract_id) ?? [];
  const integrity = harness.integrityCases.filter((row) => row.contract_id === prior.reopening_contract_id);
  const roles = harness.roleCases.filter((row) => row.contract_id === prior.reopening_contract_id);
  const handoffs = harness.handoffCases.filter((row) => row.contract_id === prior.reopening_contract_id);
  if (templates.length !== 6 || !nextHoldKeys[prior.action_key]) throw new Error(`Missing Phase 57O hold lineage for ${prior.reopening_contract_id}`);
  return {
    slug: `preserved-${prior.reopening_contract_id.toLowerCase().replace(/^reopen-/, "").replaceAll("_", "-")}`,
    agency: prior.agency,
    actionKey: nextHoldKeys[prior.action_key],
    parentHoldKey: prior.action_key,
    reopeningContractId: prior.reopening_contract_id,
    stage: "Authorization, integrity, and handoff hold",
    sourceIds: prior.supporting_source_ids,
    title: `${contractLabel[prior.reopening_contract_id]} remains In Review after authorization and receipt-integrity execution`,
    finding: `${integrity.length + roles.length + handoffs.length} fixture-only workflow cases pass, but no actual packet, reviewer identity, signed receipt, or publication-review handoff exists.`,
    denominator: `One inherited hold, one role matrix, ${integrity.length} integrity cases, ${roles.length} authorization cases, ${handoffs.length} handoff cases, zero actual receipts, and zero trigger events.`,
    limits: ["Synthetic authorization and integrity passage is not evidence or eligibility.", "No fixture creates a reviewer identity, signed receipt, or publication decision.", "The inherited hold cannot close automatically."],
    next: prior.next_action,
    registry: "phase-57o-workflow-harness-results.json",
  };
});
const allSpecs = [...specs, ...heldSpecs];
if (specs.length !== 20 || heldSpecs.length !== 9 || allSpecs.length !== 29) throw new Error("Phase 57O must contain twenty Published controls and nine held records.");

const sourceById = new Map();
for (const id of [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}

const records = allSpecs.map((spec, index) => ({
  record_id: `record-57o-${spec.slug}`,
  document_id: `research-doc-57o-${spec.slug}`,
  signal_id: `signal-57o-${spec.slug}`,
  document_number: 960 + index,
  record_status: index < 20 ? "Published" : "In Review",
  agency: spec.agency,
  action_key: spec.actionKey,
  parent_hold_key: spec.parentHoldKey ?? null,
  reopening_contract_id: spec.reopeningContractId ?? null,
  evidence_stage: spec.stage,
  title: spec.title,
  finding: spec.finding,
  denominator: spec.denominator,
  evidence_limits: spec.limits,
  next_action: spec.next,
  structured_registry_file: spec.registry,
  source_id: spec.sourceIds[0],
  supporting_source_ids: [...new Set(spec.sourceIds)],
  official_url: sourceById.get(spec.sourceIds[0])?.url,
  publication_date: capturedDate,
  document_type: index < 20 ? "Data Release" : "Technical Report",
  authority_boundary: authorityBoundary,
}));
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSourceIds = [...new Set(records.flatMap((record) => record.supporting_source_ids))];

const phase57oLedger = {
  phase: "57O",
  captured_date: capturedDate,
  goal: "Require reviewer-role separation, immutable complete receipts, and explicit publication-handoff state control before any actual evidence decision can advance.",
  publication_rule: "Publish only authorization, integrity, and handoff workflow controls; preserve all nine outcome holds and keep every synthetic identity, receipt, and transition outside the evidence and publication ledgers.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: countBy(records, "evidence_stage"),
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57o-reviewer-role-authorization-matrices.json", matrices: 9, decision_rows: 54, authorization_cases: 63, failed_cases: 0 },
    { file: "phase-57o-receipt-integrity-checks.json", receipt_templates: 54, integrity_cases: 270, failed_cases: 0 },
    { file: "phase-57o-publication-handoff-state-machines.json", state_machines: 9, handoff_cases: 90, failed_cases: 0 },
  ],
  reviewer_role_matrices: 9,
  decision_authorization_rows: 54,
  role_authorization_cases: 63,
  same_actor_separation_rejections: 9,
  receipt_templates_validated: 54,
  receipt_integrity_cases: 270,
  missing_field_rejections: 54,
  incompatible_reason_code_rejections: 54,
  mutated_citation_rejections: 54,
  mutated_timestamp_rejections: 54,
  publication_handoff_state_machines: 9,
  publication_handoff_cases: 90,
  complete_accept_queue_routes: 9,
  complete_nonaccept_terminal_routes: 45,
  invalid_accept_integrity_rejections: 36,
  total_workflow_cases: 423,
  workflow_test_failures: 0,
  actual_reviewer_identities: 0,
  actual_reviewer_receipts: 0,
  actual_candidate_packets_evaluated: 0,
  eligible_records_accepted: 0,
  actual_accept_decisions: 0,
  actual_publication_review_handoffs: 0,
  actual_publication_reviews: 0,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57n.post_batch_visible_scope,
  post_batch_visible_scope: phase57n.post_batch_visible_scope,
  post_batch_closure_counts: phase57n.post_batch_closure_counts,
  preserved_phase57n_holds: heldPhase57n.map((record) => record.action_key),
  reopening_contract_ids: [...templatesByContract.keys()],
  new_visible_holds: [],
  records,
};
await writeJson(join(dataRoot, "phase-57o-reviewer-role-authorization-receipt-integrity-publication-handoff-state-machines.json"), phase57oLedger);
await writeJson(join(dataRoot, "phase-57o-publication-review.json"), {
  phase: "57O",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  reviewer_role_matrices_created: 9,
  receipt_integrity_cases_executed: 270,
  publication_handoff_cases_executed: 90,
  total_workflow_cases_executed: 423,
  actual_candidate_packets_evaluated: 0,
  actual_reviewer_receipts: 0,
  actual_publication_review_handoffs: 0,
  decision: "Twenty reviewer-authorization, receipt-integrity, and publication-handoff controls publish. Nine inherited holds remain In Review; every execution is synthetic, only complete accept fixtures reach a separate publication-review queue, and no actual packet, reviewer identity, receipt, handoff, trigger, closure, or publication event is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 959).padStart(2, "0")}-${record.record_id.replace(/^record-57o-/, "")}.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57o-${record.record_id.replace(/^record-57o-/, "")}.json`), {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status,
    publisher: firstSource?.owner ?? "U.S. public-sector authority",
    publication_date: record.publication_date,
    document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published"
      ? "The record makes reviewer separation, signed-receipt integrity, and publication-handoff boundaries executable without creating an actual editorial event."
      : "The hold remains actionable while synthetic authorization and integrity results stay separate from an actual cited packet and named human decision.",
    ftfn_relevance: ["Defines separate evidence-review, publication-review, and escalation roles across all nine contracts.", "Tests every receipt template for completeness, reason-code compatibility, and signed citation and timestamp integrity.", "Proves that only a complete accept receipt may enter a separate publication-review queue without automatic publication."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id,
    supporting_source_ids: record.supporting_source_ids,
    supporting_official_urls: sourceUrls,
    official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });
  const signal = [
    "---",
    `id: ${JSON.stringify(record.signal_id)}`,
    `title: ${JSON.stringify(record.title)}`,
    `slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}`,
    `record_status: ${JSON.stringify(record.record_status)}`,
    `summary: ${JSON.stringify(record.finding)}`,
    yamlList("source_ids", record.supporting_source_ids),
    `published_date: ${capturedDate}`,
    `captured_date: ${capturedDate}`,
    `primary_topic: ${JSON.stringify(meta.topics[0])}`,
    yamlList("framework_layers", meta.layers),
    "signal_type: \"Research Result\"",
    "maturity_level: \"Infrastructure\"",
    "time_horizon: \"Now\"",
    "evidence_quality: \"Official Data\"",
    "verification_status: \"Verified Against Primary Source\"",
    `why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}`,
    yamlList("dependencies", ["one complete cited candidate evidence packet", "a named evidence reviewer and immutable complete receipt", "a distinct authorized publication reviewer and separate publication decision"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57O reviewer authorization, receipt integrity, and publication-handoff controls"]),
    yamlList("local_implications", ["Do not convert a synthetic role, receipt, integrity result, or queue transition into evidence, reviewer identity, eligibility, a trigger, closure, or publication."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57O reviewer-separation and receipt-integrity control contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57O reviewer, receipt, or handoff exists.`)}`,
    "---",
    "",
    "## Phase 57O workflow control",
    "",
    record.finding,
    "",
    "## Evidence stage and denominator",
    "",
    `**${record.evidence_stage}.** ${record.denominator}`,
    "",
    `Structured registry: ${record.structured_registry_file}.`,
    "",
    ...(record.reopening_contract_id ? [`Reopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.`, ""] : []),
    "## Evidence boundaries",
    "",
    ...record.evidence_limits.map((limit) => `- ${limit}`),
    "",
    "Actual candidate packets evaluated: **Zero**. Actual reviewer identities, signed receipts, publication-review handoffs, and publication decisions: **Zero**. Trigger and closure events: **Zero**. FTFN submitted no agency contact or FOIA request.",
    "",
    `Next action: ${record.next_action}`,
    "",
    "## Authority boundary",
    "",
    record.authority_boundary,
    "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "Reviewer Authorization, Receipt Integrity, and Publication-Handoff State Machines, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57O executes 423 synthetic workflow cases across nine reviewer-role matrices, fifty-four receipt templates, and nine publication-handoff state machines while preserving every inherited outcome hold.",
  scope: "Nine role matrices, 270 receipt-integrity cases, 63 authorization cases, 90 handoff cases, nine complete accept queue routes, forty-five non-accept terminal routes, zero actual reviewer identities or receipts, and zero triggers, closures, or publications.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every identity, receipt, citation, timestamp, and transition used in testing is synthetic. Only a complete accept fixture may enter a separate publication-review queue, and queue entry never publishes automatically.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  `id: ${JSON.stringify(briefingId)}`,
  "title: \"Research Watch 045: Reviewer Separation, Receipt Integrity, and Publication Handoffs\"",
  "slug: \"research-watch-045-reviewer-authorization-receipt-integrity-publication-handoffs\"",
  "record_status: \"Published\"",
  "summary: \"Phase 57O passes 423 synthetic authorization, receipt-integrity, and handoff cases while keeping every actual reviewer, receipt, decision, trigger, closure, and publication count at zero.\"",
  `published_date: ${capturedDate}`,
  `captured_date: ${capturedDate}`,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "Nine role matrices separate evidence review, publication review, and escalation review across all fifty-four decision rows.",
    "All 270 receipt-integrity cases pass, including complete fixtures and explicit missing-field, reason-code, citation-mutation, and timestamp-mutation rejections.",
    "Nine complete accept fixtures reach a separate publication-review queue; forty-five non-accept fixtures terminate and thirty-six invalid accept fixtures are rejected.",
    "Zero actual packets, reviewers, receipts, handoffs, decisions, triggers, closures, or publications are recorded, and all nine holds remain In Review.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["One cited Amtrak asset-period packet", "Privacy-safe completed broadband packets", "Stable Hanford identity and custody packet", "Exact NNSA site-period output, capacity, and GAO closure packets"]),
  "---",
  "",
  "## What Phase 57O proves",
  "",
  "Reviewer-role separation, immutable signed-receipt fields, decision-specific reason codes, and publication-handoff routing behave deterministically across all nine contracts.",
  "",
  "## What did not move",
  "",
  "No synthetic identity or receipt is an actual review event. No packet, reviewer assignment, signed receipt, publication-review handoff, trigger, closure, or publication event exists, and every inherited hold remains In Review.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57O records no agency contact, FOIA request, directive-scope change, implementation change, capability change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-045-reviewer-authorization-receipt-integrity-publication-handoffs.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57o-reviewer-authorization-receipt-integrity-publication-handoffs.json"), {
  id: "update-2026-08-09-phase-57o-reviewer-authorization-receipt-integrity-publication-handoffs",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57O enforces reviewer separation and immutable receipt handoffs",
  summary: "Thirty-six carried Tier 1 sources support twenty Published workflow controls, nine preserved holds, nine role matrices, 423 executable cases, and nine publication-handoff state machines.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-045-reviewer-authorization-receipt-integrity-publication-handoffs/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic roles, receipts, integrity results, and state transitions remain separate from source evidence, reviewer identity, eligibility, operating outcomes, fired triggers, closure, and publication.",
  work_package: "docs/work-packages/phase-57o-reviewer-authorization-receipt-integrity-publication-handoffs.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};
const allSourceIds = carriedSourceIds;
for (const [file, selected, question] of [
  ["finance-and-risk.json", allSourceIds, "Which Phase 57O accept receipt first proves distinct evidence and publication reviewers, immutable citations and decision time, and a separately recorded publication outcome?"],
  ["policy-and-standards.json", allSourceIds, "Which actual packet first passes every Phase 57O authorization, completeness, reason-code, signed-field, and publication-handoff gate?"],
  ["mobility.json", sourceIdsByRail.Amtrak, "Which official Amtrak packet first receives a complete immutable receipt from a named evidence reviewer and a separate publication reviewer?"],
  ["chips-and-compute.json", sourceIdsByRail.Broadband, "Which privacy-safe broadband packet first clears Phase 57O role separation, signed citation, decision-time, and handoff integrity?"],
  ["energy.json", [...new Set([...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA])], "Which cited Hanford or NNSA packet first clears Phase 57O distinct reviewer roles, immutable receipt integrity, and separate publication review?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected);
    value.watch_questions = (value.watch_questions ?? []).filter((item) => item !== "Which cited Hanford or NNSA packet first clears distinct reviewer roles, immutable receipt integrity, and separate publication review?");
    value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, allSourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...sourceIdsByRail.Amtrak, ...sourceIdsByRail.Broadband]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), [...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA]],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57o-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57O reviewer authorization, receipt integrity, and publication handoffs");
    value.dependency_stack.push({
      stage: "Phase 57O reviewer authorization, receipt integrity, and publication handoffs",
      current_state: "Nine role matrices, 270 receipt-integrity cases, 63 authorization cases, and 90 handoff cases pass; zero actual packets, reviewers, receipts, decisions, triggers, closures, or publications are recorded.",
      boundary: "Synthetic identities, receipts, signatures, and queue transitions are workflow infrastructure, not evidence, reviewer assignments, eligibility, closure, or publication.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57O prohibits same-person evidence and publication review, missing or incompatible receipt fields, mutated signed citations or times, non-accept handoffs, automatic trigger firing, closure, publication, ranking, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["One complete cited accept packet with an immutable signed receipt, distinct authorized evidence and publication reviewers, and a separately recorded publication decision."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57O separates reviewer roles, rejects incomplete or mutated receipts, and gates publication handoff while preserving every operating-outcome hold.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57o-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57o-role-integrity-handoff");
  value.links = value.links.filter((link) => link.from !== "node-phase57o-role-integrity-handoff");
  value.nodes.push({ id: "node-phase57o-role-integrity-handoff", label: "Nine role matrices; 423 integrity and handoff cases; zero actual review events", node_type: "Signal", note: "Only a complete accept receipt with distinct authorized reviewers may reach separate publication review, and queue entry never publishes automatically." });
  value.links.push(
    { from: "node-phase57o-role-integrity-handoff", to: "node-phase57n-conformance-receipt-ledger", relationship: "Depends On", confidence: "Supported", note: "Phase 57O authorizes and integrity-checks the receipt shapes and deterministic controls proved in Phase 57N." },
    { from: "node-phase57o-role-integrity-handoff", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "An actual receipt still requires one cited packet with compatible identity, definition, unit, method, denominator, period, privacy, authority, and acceptance." },
    { from: "node-phase57o-role-integrity-handoff", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Authorization and receipt integrity do not establish operating outcomes, eligibility, closure, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Nine role matrices, 270 receipt-integrity cases, 63 authorization cases, 90 handoff cases, zero actual review events, and nine preserved holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["One complete cited accept packet with distinct named evidence and publication reviewers, immutable receipt fields, and a separately recorded publication decision without changing identity, period, denominator, privacy, authority, acceptance, capability, implementation, or closure attribution."]);
});

console.log(`Generated Phase 57O: ${published.length} Published controls, ${held.length} In Review holds, ${carriedSourceIds.length} carried Tier 1 sources, ${harness.allCases.length} workflow cases, and Research Watch 045.`);
