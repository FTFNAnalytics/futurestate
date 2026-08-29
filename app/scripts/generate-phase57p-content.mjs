import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { countBy, runPhase57pHarness } from "./phase57p-dual-review-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "dual-review-audit-chains-adjudication-publication-decision-receipts-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-046-dual-review-audit-chains-adjudication-publication-receipts";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const passedCount = (rows) => rows.filter((row) => row.passed).length;

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57o = JSON.parse(await readFile(join(dataRoot, "phase-57o-reviewer-role-authorization-receipt-integrity-publication-handoff-state-machines.json"), "utf8"));
const receiptLedger = JSON.parse(await readFile(join(dataRoot, "phase-57n-reviewer-receipt-ledger.json"), "utf8"));
if (phase57o.phase !== "57O" || phase57o.records.length !== 29 || receiptLedger.templates.length !== 54) {
  throw new Error("Phase 57P requires the complete Phase 57O record baseline and all fifty-four Phase 57N receipt templates.");
}
const harness = runPhase57pHarness(receiptLedger.templates);
if (harness.schemas.length !== 9 || harness.auditCases.length !== 81 || harness.publicationReceiptCases.length !== 162 || harness.adjudicationCases.length !== 90 || harness.allCases.length !== 333 || harness.failures.length) {
  throw new Error("Phase 57P requires 333 passing append-only dual-review cases across nine contracts.");
}

const authorityBoundary = "Agency assertions, independent oversight, FTFN workflow controls, evidence-review identity, publication-review identity, escalation ownership, receipt attribution, audit history, manual release authorization, acceptance, implementation, capability, closure, and operating outcomes remain separate evidence states.";
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

const auditRegistry = {
  phase: "57P",
  captured_date: capturedDate,
  registry_type: "Append-only dual-review audit-chain schemas and integrity cases",
  schema_version: "1.0",
  audit_chain_schema_count: harness.schemas.length,
  contract_count: harness.schemas.length,
  audit_case_count: harness.auditCases.length,
  passed_case_count: passedCount(harness.auditCases),
  failed_case_count: harness.auditCases.filter((row) => !row.passed).length,
  case_distribution: countBy(harness.auditCases, "test_class"),
  actual_audit_events_created: 0,
  actual_receipts_linked: 0,
  prior_events_mutated: 0,
  automated_trigger_closure_release_or_publication_allowed: false,
  audit_rule: "Each evidence, publication, adjudication, supersession, release-authorization, or withdrawal event appends a new immutable hash-linked event. No later event may update, replace, or delete an earlier receipt or audit entry.",
  schemas: harness.schemas,
  cases: harness.auditCases,
};
await writeJson(join(dataRoot, "phase-57p-append-only-dual-review-audit-chains.json"), auditRegistry);

const publicationRegistry = {
  phase: "57P",
  captured_date: capturedDate,
  registry_type: "Publication-review decision receipts and decision-specific reason-code checks",
  publication_receipt_case_count: harness.publicationReceiptCases.length,
  decision_types: ["accept", "reject", "needs_clarification", "privacy_blocked", "authority_mismatch", "period_mismatch"],
  valid_publication_receipt_cases: harness.publicationReceiptCases.filter((row) => row.test_class === "valid_publication_receipt").length,
  incompatible_reason_code_rejections: harness.publicationReceiptCases.filter((row) => row.test_class === "incompatible_publication_reason").length,
  mutated_attribution_rejections: harness.publicationReceiptCases.filter((row) => row.test_class === "mutated_publication_attribution").length,
  passed_case_count: passedCount(harness.publicationReceiptCases),
  failed_case_count: harness.publicationReceiptCases.filter((row) => !row.passed).length,
  actual_publication_receipts_created: 0,
  actual_publication_reviewers_created: 0,
  automated_release_or_publication_allowed: false,
  receipt_rule: "A publication-review receipt is separately attributed, linked to an immutable evidence-receipt digest, signed with a decision-specific reason code, and unable to replace or mutate the evidence receipt.",
  cases: harness.publicationReceiptCases,
};
await writeJson(join(dataRoot, "phase-57p-publication-review-decision-receipts.json"), publicationRegistry);

const adjudicationRegistry = {
  phase: "57P",
  captured_date: capturedDate,
  registry_type: "Cross-role disagreement, escalation-ownership, and supersession fixtures",
  adjudication_case_count: harness.adjudicationCases.length,
  concordant_accept_manual_release_routes: harness.adjudicationCases.filter((row) => row.actual_decision === "concordant_accept_awaiting_manual_release").length,
  disagreement_escalation_routes: harness.adjudicationCases.filter((row) => row.actual_decision === "disagreement_escalated").length,
  bounded_block_escalation_routes: harness.adjudicationCases.filter((row) => row.actual_decision === "bounded_block_escalated").length,
  role_authorization_rejections: harness.adjudicationCases.filter((row) => row.actual_decision === "adjudication_authorization_rejected").length,
  escalation_ownership_rejections: harness.adjudicationCases.filter((row) => ["adjudication_rejected", "adjudication_escalation_rejected"].includes(row.actual_decision)).length,
  nonaccept_override_rejections: harness.adjudicationCases.filter((row) => row.actual_decision === "adjudication_override_rejected").length,
  append_only_supersession_routes: harness.adjudicationCases.filter((row) => row.actual_decision === "supersession_appended_prior_preserved").length,
  passed_case_count: passedCount(harness.adjudicationCases),
  failed_case_count: harness.adjudicationCases.filter((row) => !row.passed).length,
  actual_adjudications_created: 0,
  actual_escalations_created: 0,
  disagreement_collapsed_to_accept: 0,
  automated_trigger_closure_release_or_publication_allowed: false,
  adjudication_rule: "Evidence/publication disagreement must remain explicit and owned by a distinct escalation reviewer. It cannot collapse into accept; supersession appends a later receipt while preserving all earlier attribution and content.",
  cases: harness.adjudicationCases,
};
await writeJson(join(dataRoot, "phase-57p-cross-role-adjudication-fixtures.json"), adjudicationRegistry);

const workflowRegistry = {
  phase: "57P",
  captured_date: capturedDate,
  registry_type: "Executable append-only dual-review, publication-receipt, and adjudication harness results",
  total_case_count: harness.allCases.length,
  passed_case_count: passedCount(harness.allCases),
  failed_case_count: harness.failures.length,
  audit_chain_cases: harness.auditCases.length,
  publication_receipt_cases: harness.publicationReceiptCases.length,
  adjudication_cases: harness.adjudicationCases.length,
  result_counts: countBy(harness.allCases, "actual_decision"),
  actual_candidate_packets_evaluated: 0,
  actual_evidence_receipts: 0,
  actual_publication_receipts: 0,
  actual_adjudications: 0,
  actual_escalations: 0,
  actual_manual_release_authorizations: 0,
  eligible_records_accepted: 0,
  reopening_triggers_fired: 0,
  automated_closures_or_publications: 0,
  evidence_records_created: 0,
  test_ids: harness.allCases.map((row) => row.test_id),
};
await writeJson(join(dataRoot, "phase-57p-dual-review-harness-results.json"), workflowRegistry);

const heldPhase57o = phase57o.records.filter((record) => record.record_status === "In Review");
const acceptTemplates = receiptLedger.templates.filter((template) => template.decision_type === "accept");
const sourcesForRail = (rail) => [...new Set(phase57o.records.filter((record) => {
  if (rail === "Amtrak") return record.agency === "DOT";
  if (rail === "Broadband") return record.agency === "NTIA";
  if (rail === "Hanford") return /^Hanford|HANFORD/.test(`${record.title} ${record.action_key}`);
  return /^NNSA/.test(`${record.title} ${record.action_key}`);
}).flatMap((record) => record.supporting_source_ids))];
const sourceIdsByRail = { Amtrak: sourcesForRail("Amtrak"), Broadband: sourcesForRail("Broadband"), Hanford: sourcesForRail("Hanford"), NNSA: sourcesForRail("NNSA") };
const summaryForRail = (rail) => ({
  contracts: harness.schemas.filter((row) => row.evidence_rail === rail).length,
  audit: harness.auditCases.filter((row) => row.evidence_rail === rail).length,
  publication: harness.publicationReceiptCases.filter((row) => row.evidence_rail === rail).length,
  adjudication: harness.adjudicationCases.filter((row) => row.evidence_rail === rail).length,
  validPublication: harness.publicationReceiptCases.filter((row) => row.evidence_rail === rail && row.test_class === "valid_publication_receipt").length,
  publicationRejections: harness.publicationReceiptCases.filter((row) => row.evidence_rail === rail && row.test_class !== "valid_publication_receipt").length,
  concordantAccepts: harness.adjudicationCases.filter((row) => row.evidence_rail === rail && row.actual_decision === "concordant_accept_awaiting_manual_release").length,
  disagreements: harness.adjudicationCases.filter((row) => row.evidence_rail === rail && ["disagreement_escalated", "bounded_block_escalated"].includes(row.actual_decision)).length,
  supersessions: harness.adjudicationCases.filter((row) => row.evidence_rail === rail && row.actual_decision === "supersession_appended_prior_preserved").length,
});

const specs = [];
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  const summary = summaryForRail(rail);
  const slugRail = rail.toLowerCase();
  const sourceIds = sourceIdsByRail[rail];
  const stage = `${rail} append-only audit, adjudication, and publication-receipt controls`;
  specs.push(
    {
      slug: `${slugRail}-${summary.contracts}-append-only-dual-review-audit-chain-schemas`, agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-DUAL-REVIEW-AUDIT-CHAINS-2026-01`, stage, sourceIds,
      title: `${rail} defines ${summary.contracts} append-only dual-review audit chains`,
      finding: `${summary.contracts} contract-specific chains link evidence, publication, adjudication, supersession, release-authorization, and withdrawal events without permitting prior-event mutation.`,
      denominator: `${summary.contracts} immutable schemas, six append-only event types per schema, and zero actual audit events.`,
      limits: ["Audit schemas are workflow controls, not actual review history.", "A later event may reference but never update, replace, or delete a prior receipt.", "Audit-chain completion cannot trigger, close, release, or publish automatically."],
      next: "Create the first actual chain only after one complete cited packet receives a named evidence-review receipt.", registry: "phase-57p-append-only-dual-review-audit-chains.json",
    },
    {
      slug: `${slugRail}-${summary.audit}-audit-chain-integrity-cases`, agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-AUDIT-CHAIN-INTEGRITY-2026-01`, stage, sourceIds,
      title: `${rail} passes ${summary.audit} append-only audit-chain integrity cases`,
      finding: `Every ${rail} chain accepts ordered appends and rejects payload mutation, event replacement, time regression, and duplicate identifiers while preserving superseded receipts.`,
      denominator: `${summary.audit} fixture-only audit cases across ${summary.contracts} contracts; zero failures and zero actual audit events.`,
      limits: ["Passing fixtures do not create evidence or reviewer history.", "A valid hash link does not validate the underlying claim.", "Supersession preserves rather than rewrites the earlier decision."],
      next: "Require contiguous sequence, increasing time, prior-event digest, payload digest, and immutable event digest for every actual append.", registry: "phase-57p-append-only-dual-review-audit-chains.json",
    },
    {
      slug: `${slugRail}-${summary.publication}-publication-review-decision-receipt-cases`, agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-PUBLICATION-DECISION-RECEIPTS-2026-01`, stage, sourceIds,
      title: `${rail} passes ${summary.publication} publication-review receipt cases`,
      finding: `${summary.validPublication} decision-specific receipt fixtures validate, while ${summary.publicationRejections} incompatible-reason or mutated-attribution fixtures are rejected.`,
      denominator: `${summary.publication} cases across six publication decisions and ${summary.contracts} contracts; zero actual publication receipts.`,
      limits: ["A valid synthetic publication receipt is not a publication decision.", "Publication attribution must remain distinct from evidence-review attribution.", "A publication receipt cannot replace the linked evidence receipt."],
      next: "Require a separate signed publication receipt with a decision-specific reason code and immutable evidence-receipt digest.", registry: "phase-57p-publication-review-decision-receipts.json",
    },
    {
      slug: `${slugRail}-${summary.adjudication}-cross-role-adjudication-cases`, agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-CROSS-ROLE-ADJUDICATION-2026-01`, stage, sourceIds,
      title: `${rail} routes ${summary.adjudication} cross-role adjudication cases without automatic release`,
      finding: `${summary.concordantAccepts} concordant accept fixtures await manual release, ${summary.disagreements} disagreements or bounded blocks escalate explicitly, and ${summary.supersessions} later decisions append without mutation.`,
      denominator: `${summary.adjudication} adjudication fixtures across ${summary.contracts} contracts; zero actual escalations, releases, triggers, closures, or publications.`,
      limits: ["Disagreement cannot collapse into accept.", "Escalation requires a third role distinct from both reviewers.", "Even dual accept requires separate manual release authorization."],
      next: "Keep all disagreement states unresolved until a distinct human escalation owner records an append-only outcome.", registry: "phase-57p-cross-role-adjudication-fixtures.json",
    },
    {
      slug: `${slugRail}-zero-actual-audit-adjudication-release-or-publication-events`, agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-ZERO-PHASE57P-WORKFLOW-EVENTS-2026-01`, stage, sourceIds,
      title: `${rail} records zero actual audit, adjudication, release, or publication events`,
      finding: "Append-only chains, publication receipts, and adjudication fixtures prove bounded workflow behavior without assigning a person, evaluating evidence, authorizing release, or publishing.",
      denominator: `${summary.audit + summary.publication + summary.adjudication} executable cases across ${summary.contracts} contracts and zero actual workflow events.`,
      limits: ["Synthetic identities and receipts remain outside the evidence ledger.", "Manual release authorization remains absent.", "No fixture changes eligibility, trigger, closure, publication, or operating-outcome state."],
      next: "Preserve the hold until separately attributable evidence and publication receipts are followed by an explicit manual release decision.", registry: "phase-57p-dual-review-harness-results.json",
    },
  );
}

const nextHoldKeys = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2027-02": "AMTRAK-PIDS-CLOSEOUT-HOLD-2027-03",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2027-01": "AMTRAK-NAMED-RELIABILITY-HOLD-2027-02",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2027-02": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2027-03",
  "LA-BEAD-STARLINK-HOLD-2027-02": "LA-BEAD-STARLINK-HOLD-2027-03",
  "MT-BEAD-QUARTERLY-HOLD-2027-02": "MT-BEAD-QUARTERLY-HOLD-2027-03",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-11": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-12",
  "NNSA-PIT-RATE-HOLD-2027-02": "NNSA-PIT-RATE-HOLD-2027-03",
  "NNSA-PIT-PEIS-HOLD-2027-02": "NNSA-PIT-PEIS-HOLD-2027-03",
  "NNSA-PIT-GAO-BASELINE-HOLD-2027-03": "NNSA-PIT-GAO-BASELINE-HOLD-2027-04",
};
const heldSpecs = heldPhase57o.map((prior) => {
  const audit = harness.auditCases.filter((row) => row.contract_id === prior.reopening_contract_id);
  const publication = harness.publicationReceiptCases.filter((row) => row.contract_id === prior.reopening_contract_id);
  const adjudication = harness.adjudicationCases.filter((row) => row.contract_id === prior.reopening_contract_id);
  if (!nextHoldKeys[prior.action_key] || audit.length !== 9 || publication.length !== 18 || adjudication.length !== 10) throw new Error(`Missing Phase 57P hold lineage for ${prior.reopening_contract_id}`);
  return {
    slug: `preserved-${prior.reopening_contract_id.toLowerCase().replace(/^reopen-/, "").replaceAll("_", "-")}`,
    agency: prior.agency, actionKey: nextHoldKeys[prior.action_key], parentHoldKey: prior.action_key, reopeningContractId: prior.reopening_contract_id,
    stage: "Dual-review audit and adjudication hold", sourceIds: prior.supporting_source_ids,
    title: `${contractLabel[prior.reopening_contract_id]} remains In Review after dual-review audit and adjudication execution`,
    finding: `${audit.length + publication.length + adjudication.length} fixture-only cases pass, but no actual evidence receipt, publication receipt, adjudication, escalation, or manual release authorization exists.`,
    denominator: `One inherited hold, one append-only chain, ${audit.length} audit cases, ${publication.length} publication-receipt cases, ${adjudication.length} adjudication cases, and zero actual workflow events.`,
    limits: ["Synthetic dual-review chains are not actual audit history.", "No fixture creates a reviewer identity, adjudication, or release decision.", "The inherited hold cannot close or publish automatically."],
    next: prior.next_action,
    registry: "phase-57p-dual-review-harness-results.json",
  };
});
const allSpecs = [...specs, ...heldSpecs];
if (specs.length !== 20 || heldSpecs.length !== 9 || allSpecs.length !== 29) throw new Error("Phase 57P must contain twenty Published controls and nine held records.");

const sourceById = new Map();
for (const id of [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const records = allSpecs.map((spec, index) => ({
  record_id: `record-57p-${spec.slug}`,
  document_id: `research-doc-57p-${spec.slug}`,
  signal_id: `signal-57p-${spec.slug}`,
  document_number: 989 + index,
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

const phase57pLedger = {
  phase: "57P",
  captured_date: capturedDate,
  goal: "Keep evidence review, publication review, disagreement adjudication, supersession, and release authorization separately attributable and append-only without creating an automated publication path.",
  publication_rule: "Publish only append-only audit, publication-receipt, and adjudication controls; preserve all nine outcome holds and keep every synthetic identity, receipt, event, and transition outside the evidence and publication ledgers.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: countBy(records, "evidence_stage"),
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57p-append-only-dual-review-audit-chains.json", schemas: 9, cases: 81, failed_cases: 0 },
    { file: "phase-57p-publication-review-decision-receipts.json", cases: 162, failed_cases: 0 },
    { file: "phase-57p-cross-role-adjudication-fixtures.json", cases: 90, failed_cases: 0 },
  ],
  audit_chain_schemas: 9,
  audit_chain_cases: 81,
  publication_receipt_cases: 162,
  valid_publication_receipt_cases: 54,
  incompatible_publication_reason_rejections: 54,
  mutated_publication_attribution_rejections: 54,
  adjudication_cases: 90,
  concordant_accept_manual_release_routes: 9,
  disagreement_escalation_routes: 18,
  bounded_block_escalation_routes: 27,
  role_authorization_rejections: 9,
  escalation_ownership_rejections: 9,
  nonaccept_override_rejections: 9,
  append_only_supersession_routes: 9,
  total_workflow_cases: 333,
  workflow_test_failures: 0,
  actual_reviewer_identities: 0,
  actual_evidence_receipts: 0,
  actual_publication_receipts: 0,
  actual_candidate_packets_evaluated: 0,
  eligible_records_accepted: 0,
  actual_accept_decisions: 0,
  actual_adjudications: 0,
  actual_escalations: 0,
  actual_manual_release_authorizations: 0,
  actual_publications: 0,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57o.post_batch_visible_scope,
  post_batch_visible_scope: phase57o.post_batch_visible_scope,
  post_batch_closure_counts: phase57o.post_batch_closure_counts,
  preserved_phase57o_holds: heldPhase57o.map((record) => record.action_key),
  reopening_contract_ids: acceptTemplates.map((template) => template.contract_id),
  new_visible_holds: [],
  records,
};
await writeJson(join(dataRoot, "phase-57p-append-only-dual-review-audit-chains-cross-role-adjudication-publication-review-receipts.json"), phase57pLedger);
await writeJson(join(dataRoot, "phase-57p-publication-review.json"), {
  phase: "57P",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  audit_chain_schemas_created: 9,
  audit_chain_cases_executed: 81,
  publication_receipt_cases_executed: 162,
  adjudication_cases_executed: 90,
  total_workflow_cases_executed: 333,
  actual_evidence_receipts: 0,
  actual_publication_receipts: 0,
  actual_adjudications: 0,
  actual_manual_release_authorizations: 0,
  decision: "Twenty append-only audit, publication-receipt, and adjudication controls publish. Nine inherited holds remain In Review; every execution is synthetic, disagreement remains explicit, supersession preserves prior receipts, concordant accept still awaits manual release authorization, and no trigger, closure, release, or publication event is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 988).padStart(2, "0")}-${record.record_id.replace(/^record-57p-/, "")}.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57p-${record.record_id.replace(/^record-57p-/, "")}.json`), {
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
    why_it_matters: record.record_status === "Published" ? "The record makes dual-review attribution, disagreement escalation, and supersession append-only without creating an actual editorial or release event." : "The hold remains actionable while synthetic audit and adjudication results stay separate from an actual cited packet and named human decisions.",
    ftfn_relevance: ["Links but never merges evidence-review and publication-review receipts across all nine contracts.", "Tests publication reason-code compatibility, immutable attribution, disagreement ownership, and append-only supersession.", "Proves that even concordant accept requires separate manual release authorization and cannot publish automatically."],
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
    yamlList("dependencies", ["one complete cited candidate evidence packet", "separately attributable evidence and publication receipts", "a distinct escalation owner for disagreement", "manual release authorization after concordant accept"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57P append-only dual-review audit and adjudication controls"]),
    yamlList("local_implications", ["Do not convert a synthetic audit event, receipt, disagreement, supersession, or release state into evidence, reviewer identity, eligibility, a trigger, closure, or publication."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57P append-only dual-review control contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57P receipt, adjudication, or release event exists.`)}`,
    "---",
    "",
    "## Phase 57P workflow control",
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
    "Actual evidence receipts, publication receipts, adjudications, escalations, and manual release authorizations: **Zero**. Trigger, closure, and publication events: **Zero**. FTFN submitted no agency contact or FOIA request.",
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
  title: "Dual-Review Audit Chains, Adjudication, and Publication-Decision Receipts, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57P executes 333 synthetic append-only dual-review cases across nine audit chains while preserving every inherited outcome hold and requiring manual release after concordant accept.",
  scope: "Nine audit-chain schemas, 81 audit-integrity cases, 162 publication-receipt cases, 90 adjudication cases, nine concordant accepts awaiting manual release, forty-five disagreement or bounded-block escalations, zero actual receipts or adjudications, and zero triggers, closures, releases, or publications.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every identity, receipt, event, disagreement, escalation, and supersession is synthetic. Evidence and publication receipts remain separately attributable, earlier receipts remain immutable, and even concordant accept requires a separate manual release authorization.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  `id: ${JSON.stringify(briefingId)}`,
  "title: \"Research Watch 046: Append-Only Dual Review and Adjudication\"",
  `slug: ${JSON.stringify(briefingSlug)}`,
  "record_status: \"Published\"",
  "summary: \"Phase 57P passes 333 synthetic audit, publication-receipt, and adjudication cases while keeping every actual receipt, escalation, release, trigger, closure, and publication count at zero.\"",
  `published_date: ${capturedDate}`,
  `captured_date: ${capturedDate}`,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "Nine append-only chains link but never merge evidence, publication, adjudication, supersession, release, and withdrawal events.",
    "All 162 publication-receipt cases enforce decision-specific reason codes, immutable attribution, and immutable evidence-receipt linkage.",
    "All 90 adjudication cases keep disagreement explicit, require distinct escalation ownership, and preserve earlier receipts during supersession.",
    "Nine concordant accept fixtures still await manual release authorization; zero actual receipts, releases, triggers, closures, or publications are recorded.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["One cited Amtrak asset-period packet", "Privacy-safe completed broadband packets", "Stable Hanford identity and custody packet", "Exact NNSA site-period output, capacity, and GAO closure packets"]),
  "---",
  "",
  "## What Phase 57P proves",
  "",
  "Dual-review attribution, publication reason-code compatibility, disagreement escalation, and receipt supersession remain append-only and deterministic across all nine contracts.",
  "",
  "## What did not move",
  "",
  "No synthetic identity, receipt, event, adjudication, or release state is an actual review event. No packet, trigger, closure, manual release authorization, or publication exists, and every inherited hold remains In Review.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57P records no agency contact, FOIA request, directive-scope change, implementation change, capability change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57p-dual-review-audit-adjudication-publication-receipts.json"), {
  id: "update-2026-08-09-phase-57p-dual-review-audit-adjudication-publication-receipts",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57P makes dual review and adjudication append-only",
  summary: "Thirty-six carried Tier 1 sources support twenty Published controls, nine preserved holds, nine audit chains, 333 executable cases, and explicit manual-release gating after concordant accept.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic identities, receipts, audit events, disagreements, escalations, and supersessions remain separate from source evidence, actual reviewer identity, eligibility, operating outcomes, fired triggers, closure, release, and publication.",
  work_package: "docs/work-packages/phase-57p-dual-review-audit-chains-adjudication-publication-receipts.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};
const allSourceIds = carriedSourceIds;
for (const [file, selected, question] of [
  ["finance-and-risk.json", allSourceIds, "Which Phase 57P chain first records separately attributable evidence and publication receipts, explicit adjudication, and a later manual release decision without mutating prior history?"],
  ["policy-and-standards.json", allSourceIds, "Which actual packet first clears every Phase 57P append-only receipt, disagreement, escalation-owner, supersession, and manual-release gate?"],
  ["mobility.json", sourceIdsByRail.Amtrak, "Which official Amtrak packet first clears Phase 57P with immutable evidence and publication receipts plus a separately signed manual release authorization?"],
  ["chips-and-compute.json", sourceIdsByRail.Broadband, "Which privacy-safe broadband packet first clears Phase 57P dual-review attribution, disagreement adjudication, and append-only release control?"],
  ["energy.json", [...new Set([...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA])], "Which cited Hanford or NNSA packet first clears Phase 57P append-only dual review, escalation ownership, and separate manual release authorization?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected);
    value.watch_questions = (value.watch_questions ?? []).filter((item) => item !== "Which official Amtrak packet first receives immutable evidence and publication receipts plus a separately signed manual release authorization?");
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
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57p-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57P append-only dual review, adjudication, and publication receipts");
    value.dependency_stack.push({
      stage: "Phase 57P append-only dual review, adjudication, and publication receipts",
      current_state: "Nine audit chains, 81 audit-integrity cases, 162 publication-receipt cases, and 90 adjudication cases pass; zero actual receipts, escalations, releases, triggers, closures, or publications are recorded.",
      boundary: "Synthetic identities, receipts, events, disagreements, and supersessions are workflow infrastructure, not evidence, reviewer assignments, eligibility, release, closure, or publication.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57P prohibits prior-event mutation, reviewer-role collapse, decision-incompatible publication reason codes, disagreement collapse into accept, unowned escalation, automatic release, trigger firing, closure, publication, ranking, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["One complete cited packet with separately attributable evidence and publication receipts, explicit adjudication when needed, and a later manual release authorization recorded as a new immutable event."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57P keeps dual-review receipts, disagreement adjudication, supersession, and release authorization append-only while preserving every operating-outcome hold.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57p-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57p-dual-review-audit");
  value.links = value.links.filter((link) => link.from !== "node-phase57p-dual-review-audit");
  value.nodes.push({ id: "node-phase57p-dual-review-audit", label: "Nine append-only chains; 333 receipt and adjudication cases; zero release events", node_type: "Signal", note: "Evidence and publication receipts remain separately attributable, disagreement cannot collapse into accept, and even concordant accept awaits manual release authorization." });
  value.links.push(
    { from: "node-phase57p-dual-review-audit", to: "node-phase57o-role-integrity-handoff", relationship: "Depends On", confidence: "Supported", note: "Phase 57P appends publication decisions and adjudication to the separated reviewer roles and immutable handoff controls proved in Phase 57O." },
    { from: "node-phase57p-dual-review-audit", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "An actual chain still requires one cited packet with compatible identity, definition, unit, method, denominator, period, privacy, authority, and acceptance." },
    { from: "node-phase57p-dual-review-audit", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Append-only review history does not establish operating outcomes, eligibility, implementation, closure, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Nine append-only chains, 81 audit cases, 162 publication-receipt cases, 90 adjudication cases, zero actual release events, and nine preserved holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["One complete cited packet with immutable evidence and publication receipts, explicit adjudication and escalation ownership when needed, and a separately attributable manual release authorization without changing identity, period, denominator, privacy, authority, acceptance, capability, implementation, or closure attribution."]);
});

console.log(`Generated Phase 57P: ${published.length} Published controls, ${held.length} In Review holds, ${carriedSourceIds.length} carried Tier 1 sources, ${harness.allCases.length} workflow cases, and Research Watch 046.`);
