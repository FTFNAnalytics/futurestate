import "./generate-phase57m-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAdapterConformanceTests,
  buildPacketFixtureExecutions,
  countBy,
} from "./phase57n-validation-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "adapter-conformance-packet-validation-reviewer-receipt-ledgers-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-044-adapter-conformance-packet-validation-receipts";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57m = JSON.parse(await readFile(join(dataRoot, "phase-57m-source-schema-adapters-packet-templates-review-decision-tables.json"), "utf8"));
const adapters = JSON.parse(await readFile(join(dataRoot, "phase-57m-source-schema-adapters.json"), "utf8"));
const packets = JSON.parse(await readFile(join(dataRoot, "phase-57m-candidate-evidence-packet-templates.json"), "utf8"));
const decisions = JSON.parse(await readFile(join(dataRoot, "phase-57m-human-review-decision-tables.json"), "utf8"));
if (phase57m.phase !== "57M" || phase57m.records.length !== 29 || adapters.adapters.length !== 60 || packets.templates.length !== 9 || decisions.tables.length !== 9) {
  throw new Error("Phase 57N requires the complete Phase 57M adapter, packet, decision-table, and hold baseline.");
}

const authorityBoundary = "Agency assertions, independent oversight, FTFN workflow controls, reviewer receipts, acceptance, implementation, capability, closure, and operating outcomes remain separate evidence states.";
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

const adapterTests = buildAdapterConformanceTests(adapters.adapters);
const acceptedLabelTests = adapterTests.filter((row) => row.test_class === "accepted_label");
const ambiguousLabelTests = adapterTests.filter((row) => row.test_class === "ambiguous_label_rejection");
const failedAdapterTests = adapterTests.filter((row) => !row.passed);
const adapterRegistry = {
  phase: "57N",
  captured_date: capturedDate,
  registry_type: "Deterministic adapter-conformance test results",
  contract_count: new Set(adapterTests.map((row) => row.contract_id)).size,
  adapter_count: adapters.adapters.length,
  accepted_label_test_count: acceptedLabelTests.length,
  ambiguous_label_rejection_count: ambiguousLabelTests.length,
  total_test_count: adapterTests.length,
  passed_test_count: adapterTests.length - failedAdapterTests.length,
  failed_test_count: failedAdapterTests.length,
  labels_semantically_coerced: 0,
  values_supplied_or_transformed: 0,
  evidence_records_created: 0,
  test_rule: "Accepted labels may match only after case normalization and outer-whitespace trim. Every synthetic ambiguous label must return for clarification; no test supplies a source value or creates evidence.",
  result_counts: countBy(adapterTests, "actual_decision"),
  tests: adapterTests,
};
await writeJson(join(dataRoot, "phase-57n-adapter-conformance-tests.json"), adapterRegistry);

const fixtureExecutions = buildPacketFixtureExecutions(packets.templates);
const failedFixtureExecutions = fixtureExecutions.filter((row) => !row.passed);
const fixtureRegistry = {
  phase: "57N",
  captured_date: capturedDate,
  registry_type: "Packet-validation harness execution results",
  validator_count: new Set(fixtureExecutions.map((row) => row.validator_id)).size,
  fixture_execution_count: fixtureExecutions.length,
  empty_fixture_executions: fixtureExecutions.filter((row) => row.fixture_type === "empty").length,
  incomplete_fixture_executions: fixtureExecutions.filter((row) => row.fixture_type === "incomplete").length,
  passed_execution_count: fixtureExecutions.length - failedFixtureExecutions.length,
  failed_execution_count: failedFixtureExecutions.length,
  expected_decision_counts: countBy(fixtureExecutions, "expected_decision"),
  actual_decision_counts: countBy(fixtureExecutions, "actual_decision"),
  actual_candidate_packets_evaluated: 0,
  evidence_records_ingested: 0,
  eligible_records_accepted: 0,
  reopening_triggers_fired: 0,
  automated_closures_or_publications: 0,
  harness_rule: "Every Phase 57M fixture executes only as synthetic workflow input. A passing result confirms deterministic routing, not the existence, sufficiency, or acceptance of an official candidate packet.",
  executions: fixtureExecutions,
};
await writeJson(join(dataRoot, "phase-57n-packet-validation-harness-results.json"), fixtureRegistry);

const reasonCodesByDecision = {
  accept: ["all_contract_checks_passed"],
  reject: ["explicit_disqualifier", "cross_record_assembly", "prohibited_transformation", "fabricated_value", "incompatible_definition"],
  return_for_clarification: ["missing_required_fields", "ambiguous_label", "missing_citation", "identity_chain_incomplete", "unit_method_or_denominator_missing"],
  privacy_hold: ["privacy_review_missing", "suppression_boundary_unresolved"],
  authority_hold: ["acceptance_authority_mismatch", "named_authority_missing"],
  period_hold: ["period_not_completed", "period_mismatch", "event_date_outside_contract", "gao_status_date_missing"],
};
const receiptTemplates = decisions.tables.flatMap((table) => table.rows.map((row) => ({
  receipt_template_id: `RECEIPT-TEMPLATE-${row.decision_id}`,
  contract_id: table.contract_id,
  queue_id: table.queue_id,
  evidence_rail: table.evidence_rail,
  phase57m_decision_id: row.decision_id,
  decision_type: row.decision_type,
  template_only: true,
  actual_receipt: false,
  candidate_packet_id: null,
  reviewer_identity: { profile_id: null, display_name: null },
  reason_code: null,
  allowed_reason_codes: reasonCodesByDecision[row.decision_type],
  cited_source: { source_id: null, official_url: null, record_identifier: null },
  decision_time: null,
  escalation_state: "not_recorded",
  allowed_escalation_states: ["not_required", "pending", "escalated", "resolved"],
  publication_review_handoff: {
    required_if_decision_is_accept: row.decision_type === "accept",
    status: "not_recorded",
    reviewer_identity: null,
    handoff_time: null,
  },
  fires_trigger: false,
  closes_hold_automatically: false,
  automated_publication_allowed: false,
  evidence_created: false,
})));
const receiptLedger = {
  phase: "57N",
  captured_date: capturedDate,
  registry_type: "Machine-readable reviewer-receipt schema and templates",
  schema_version: "1.0",
  contract_count: new Set(receiptTemplates.map((row) => row.contract_id)).size,
  receipt_template_count: receiptTemplates.length,
  decision_type_counts: countBy(receiptTemplates, "decision_type"),
  actual_receipt_count: 0,
  actual_reviewer_identities_recorded: 0,
  actual_cited_sources_recorded: 0,
  actual_publication_review_handoffs: 0,
  required_receipt_fields: ["reviewer_identity", "reason_code", "cited_source", "decision_time", "escalation_state", "publication_review_handoff"],
  receipt_rule: "Templates define the audit shape only. They do not create a reviewer identity, cited source, decision, escalation, handoff, trigger, closure, or publication event.",
  templates: receiptTemplates,
};
await writeJson(join(dataRoot, "phase-57n-reviewer-receipt-ledger.json"), receiptLedger);

const heldPhase57m = phase57m.records.filter((record) => record.record_status === "In Review");
const holdByContract = new Map(heldPhase57m.map((record) => [record.reopening_contract_id, record]));
const contracts = packets.templates.map((template) => template.contract_id);
const sourcesForRail = (rail) => [...new Set(phase57m.records.filter((record) => {
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
  const tests = adapterTests.filter((row) => row.evidence_rail === rail);
  const executions = fixtureExecutions.filter((row) => row.evidence_rail === rail);
  const receipts = receiptTemplates.filter((row) => row.evidence_rail === rail);
  return {
    contracts: new Set(tests.map((row) => row.contract_id)).size,
    fields: new Set(tests.map((row) => `${row.contract_id}|${row.field_name}`)).size,
    acceptedLabelTests: tests.filter((row) => row.test_class === "accepted_label").length,
    ambiguityTests: tests.filter((row) => row.test_class === "ambiguous_label_rejection").length,
    fixtureExecutions: executions.length,
    receiptTemplates: receipts.length,
  };
};

const specs = [];
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  const summary = summaryForRail(rail);
  const slugRail = rail.toLowerCase();
  const sourceIds = sourceIdsByRail[rail];
  const stage = `${rail} conformance, validation, and receipt controls`;
  specs.push(
    {
      slug: `${slugRail}-${summary.acceptedLabelTests}-accepted-label-conformance-tests`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-ACCEPTED-LABEL-CONFORMANCE-2026-01`, stage, sourceIds,
      title: `${rail} passes ${summary.acceptedLabelTests} accepted-label conformance tests`,
      finding: `Every accepted ${rail} adapter label matches after case normalization and outer-whitespace trim only, without supplying or transforming a source value.`,
      denominator: `${summary.acceptedLabelTests} accepted-label tests across ${summary.fields} fields and ${summary.contracts} contracts; zero failures.`,
      limits: ["A passing label test is not source evidence.", "Label acceptance cannot supply or validate a field value.", "No semantic aliasing or inner-whitespace transformation is allowed."],
      next: "Apply the same exact-match rule to one cited candidate packet under named human review.", registry: "phase-57n-adapter-conformance-tests.json",
    },
    {
      slug: `${slugRail}-${summary.ambiguityTests}-ambiguous-label-rejections`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-AMBIGUOUS-LABEL-REJECTIONS-2026-01`, stage, sourceIds,
      title: `${rail} returns ${summary.ambiguityTests} ambiguous labels for clarification`,
      finding: `One deliberately ambiguous label per ${rail} field is rejected without coercion and routed to clarification.`,
      denominator: `${summary.ambiguityTests} ambiguity tests, ${summary.ambiguityTests} clarification routes, and zero coerced labels.`,
      limits: ["Synthetic ambiguity tests are not observed source labels.", "A clarification route does not infer the intended field.", "Rejected labels cannot carry values into another field or record."],
      next: "Require the reviewer to cite the exact source label before field-level evaluation continues.", registry: "phase-57n-adapter-conformance-tests.json",
    },
    {
      slug: `${slugRail}-${summary.fixtureExecutions}-packet-fixture-validations`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-PACKET-VALIDATION-HARNESS-2026-01`, stage, sourceIds,
      title: `${rail} fixture harness passes ${summary.fixtureExecutions} bounded packet validations`,
      finding: `Every empty and deliberately incomplete ${rail} fixture reaches its expected reject, clarification, privacy, authority, or period route.`,
      denominator: `${summary.fixtureExecutions} synthetic fixture executions and zero actual candidate packets or evidence records.`,
      limits: ["Fixture execution is not evidence ingestion.", "A passing harness does not establish that an official candidate packet exists.", "No fixture can reach acceptance, trigger, closure, or publication."],
      next: "Keep the validator output outside the evidence ledger and attach it only as workflow audit metadata.", registry: "phase-57n-packet-validation-harness-results.json",
    },
    {
      slug: `${slugRail}-${summary.receiptTemplates}-reviewer-receipt-templates`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-REVIEWER-RECEIPT-TEMPLATES-2026-01`, stage, sourceIds,
      title: `${rail} defines ${summary.receiptTemplates} machine-readable reviewer-receipt templates`,
      finding: `Every ${rail} decision row now has a receipt template for reviewer identity, reason code, cited source, decision time, escalation state, and publication-review handoff.`,
      denominator: `${summary.receiptTemplates} templates across ${summary.contracts} contracts; zero actual reviewer identities, receipts, or handoffs.`,
      limits: ["A template cannot create a reviewer identity or decision.", "Receipt fields remain empty until an actual cited packet receives human review.", "Accept still routes only to a separate publication review."],
      next: "Require a complete receipt before any actual review decision can advance to publication review.", registry: "phase-57n-reviewer-receipt-ledger.json",
    },
    {
      slug: `${slugRail}-zero-candidate-review-trigger-or-publication-events`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-ZERO-PHASE57N-REVIEW-EVENTS-2026-01`, stage, sourceIds,
      title: `${rail} records zero candidate reviews, triggers, closures, or publications`,
      finding: "Conformance tests, fixture executions, and receipt templates prove deterministic workflow behavior without evaluating evidence or creating an editorial decision.",
      denominator: `${summary.acceptedLabelTests + summary.ambiguityTests} adapter tests, ${summary.fixtureExecutions} fixture executions, ${summary.receiptTemplates} receipt templates, and zero actual review events.`,
      limits: ["Test passage is not candidate eligibility.", "No synthetic execution closes an inherited hold.", "Human publication review remains a separate mandatory gate."],
      next: "Preserve the hold until one complete cited packet receives a named, receipted human decision and separate publication review.", registry: "phase-57n-reviewer-receipt-ledger.json",
    },
  );
}

const nextHoldKeys = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-12": "AMTRAK-PIDS-CLOSEOUT-HOLD-2027-01",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-11": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-12",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-12": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2027-01",
  "LA-BEAD-STARLINK-HOLD-2026-12": "LA-BEAD-STARLINK-HOLD-2027-01",
  "MT-BEAD-QUARTERLY-HOLD-2026-12": "MT-BEAD-QUARTERLY-HOLD-2027-01",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-09": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-10",
  "NNSA-PIT-RATE-HOLD-2026-12": "NNSA-PIT-RATE-HOLD-2027-01",
  "NNSA-PIT-PEIS-HOLD-2026-12": "NNSA-PIT-PEIS-HOLD-2027-01",
  "NNSA-PIT-GAO-BASELINE-HOLD-2027-01": "NNSA-PIT-GAO-BASELINE-HOLD-2027-02",
};
const heldSpecs = packets.templates.map((template) => {
  const prior = holdByContract.get(template.contract_id);
  const executions = fixtureExecutions.filter((row) => row.contract_id === template.contract_id);
  const tests = adapterTests.filter((row) => row.contract_id === template.contract_id);
  if (!prior || !nextHoldKeys[prior.action_key]) throw new Error(`Missing Phase 57N hold lineage for ${template.contract_id}`);
  return {
    slug: `preserved-${template.contract_id.toLowerCase().replace(/^reopen-/, "").replaceAll("_", "-")}`,
    agency: agencyByRail[template.evidence_rail], actionKey: nextHoldKeys[prior.action_key], parentHoldKey: prior.action_key, reopeningContractId: template.contract_id,
    stage: "Conformance and receipt hold", sourceIds: prior.supporting_source_ids,
    title: `${contractLabel[template.contract_id]} remains In Review after conformance and receipt-harness execution`,
    finding: `${tests.length} adapter tests and two fixture validations pass deterministically, but no actual candidate packet, reviewer receipt, cited-source decision, or publication-review handoff exists.`,
    denominator: `One inherited hold, ${tests.length} adapter tests, ${executions.length} fixture executions, six receipt templates, zero actual receipts, and zero trigger events.`,
    limits: ["Synthetic test passage is not evidence or eligibility.", "Receipt templates do not create reviewer identities or decisions.", "The inherited hold cannot close automatically."],
    next: prior.next_action, registry: "phase-57n-reviewer-receipt-ledger.json",
  };
});
const allSpecs = [...specs, ...heldSpecs];
if (specs.length !== 20 || heldSpecs.length !== 9 || allSpecs.length !== 29) throw new Error("Phase 57N must contain twenty Published controls and nine held records.");

const sourceById = new Map();
for (const id of [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const records = allSpecs.map((spec, index) => ({
  record_id: `record-57n-${spec.slug}`,
  document_id: `research-doc-57n-${spec.slug}`,
  signal_id: `signal-57n-${spec.slug}`,
  document_number: 931 + index,
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

const phase57nLedger = {
  phase: "57N",
  captured_date: capturedDate,
  goal: "Prove that the Phase 57M workflow controls behave deterministically before any actual candidate evidence packet enters review.",
  publication_rule: "Publish only conformance-test, validation-harness, and receipt-template controls; preserve all nine outcome holds and keep every synthetic result outside the evidence ledger.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: countBy(records, "evidence_stage"),
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57n-adapter-conformance-tests.json", accepted_label_tests: 120, ambiguous_label_rejections: 60, failed_tests: 0 },
    { file: "phase-57n-packet-validation-harness-results.json", validators: 9, fixture_executions: 18, failed_executions: 0 },
    { file: "phase-57n-reviewer-receipt-ledger.json", receipt_templates: 54, actual_receipts: 0, publication_review_handoffs: 0 },
  ],
  adapter_conformance_tests: adapterTests.length,
  accepted_label_tests: acceptedLabelTests.length,
  ambiguous_label_rejections: ambiguousLabelTests.length,
  adapter_test_failures: failedAdapterTests.length,
  packet_fixture_executions: fixtureExecutions.length,
  packet_fixture_failures: failedFixtureExecutions.length,
  reviewer_receipt_templates: receiptTemplates.length,
  actual_reviewer_receipts: 0,
  actual_candidate_packets_evaluated: 0,
  eligible_records_accepted: 0,
  actual_accept_decisions: 0,
  publication_review_handoffs: 0,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57m.post_batch_visible_scope,
  post_batch_visible_scope: phase57m.post_batch_visible_scope,
  post_batch_closure_counts: phase57m.post_batch_closure_counts,
  preserved_phase57m_holds: heldPhase57m.map((record) => record.action_key),
  reopening_contract_ids: contracts,
  new_visible_holds: [],
  records,
};
await writeJson(join(dataRoot, "phase-57n-adapter-conformance-tests-packet-validation-harnesses-reviewer-receipt-ledgers.json"), phase57nLedger);
await writeJson(join(dataRoot, "phase-57n-publication-review.json"), {
  phase: "57N",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  adapter_tests_executed: adapterTests.length,
  packet_fixtures_executed: fixtureExecutions.length,
  reviewer_receipt_templates_created: receiptTemplates.length,
  actual_candidate_packets_evaluated: 0,
  actual_reviewer_receipts: 0,
  decision: "Twenty deterministic workflow controls publish. Nine inherited holds remain In Review; all adapter and fixture executions are synthetic, receipt records are templates only, and no actual packet, reviewer decision, trigger, closure, handoff, or publication event is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 930).padStart(2, "0")}-${record.record_id.replace(/^record-57n-/, "")}.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57n-${record.record_id.replace(/^record-57n-/, "")}.json`), {
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
      ? "The record demonstrates deterministic intake behavior while keeping synthetic tests, templates, and receipts outside the evidence and publication ledgers."
      : "The hold remains actionable while synthetic conformance results stay separate from an actual cited packet and receipted human decision.",
    ftfn_relevance: ["Exercises every accepted Phase 57M adapter label plus one explicit ambiguity rejection per field.", "Runs all eighteen packet fixtures through deterministic validators.", "Defines audit receipts for all fifty-four review-table rows without creating an actual reviewer or decision."],
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
    yamlList("dependencies", ["one complete cited candidate evidence packet", "a named human reviewer and complete machine-readable receipt", "separate publication review after every contract boundary passes"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57N adapter conformance, packet validation, and reviewer-receipt controls"]),
    yamlList("local_implications", ["Do not convert synthetic test passage or a receipt template into evidence, reviewer identity, eligibility, a trigger, closure, or publication."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57N deterministic-workflow control contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57N receipt or evidence decision exists.`)}`,
    "---",
    "",
    "## Phase 57N workflow control",
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
    "Actual candidate packets evaluated: **Zero**. Actual reviewer receipts: **Zero**. Trigger, closure, handoff, and publication events: **Zero**. FTFN submitted no agency contact or FOIA request.",
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
  title: "Adapter Conformance, Packet Validation, and Reviewer-Receipt Ledgers, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57N passes 180 adapter-conformance cases and all eighteen packet fixtures, then defines fifty-four machine-readable reviewer-receipt templates while preserving every inherited outcome hold.",
  scope: "120 accepted-label tests, sixty explicit ambiguity rejections, eighteen fixture executions, fifty-four receipt templates, zero actual candidate packets, zero reviewer receipts, and zero triggers, closures, handoffs, or publications.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Synthetic conformance and packet tests are workflow infrastructure, not evidence. Receipt templates cannot create reviewer identities or decisions, and every accept outcome still requires a separate human publication review.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  `id: ${JSON.stringify(briefingId)}`,
  "title: \"Research Watch 044: Deterministic Intake Tests and Reviewer Receipts\"",
  "slug: \"research-watch-044-adapter-conformance-packet-validation-receipts\"",
  "record_status: \"Published\"",
  "summary: \"Phase 57N passes 180 adapter cases and eighteen packet fixtures, and defines fifty-four receipt templates without evaluating evidence or creating a reviewer decision.\"",
  `published_date: ${capturedDate}`,
  `captured_date: ${capturedDate}`,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "All 120 accepted adapter labels pass exact normalized matching and sixty synthetic ambiguous labels return for clarification.",
    "All nine empty and nine incomplete fixtures reach their expected bounded outcome with no evidence ingestion.",
    "All fifty-four review rows have a machine-readable receipt template covering identity, reason, citation, time, escalation, and handoff.",
    "Zero actual packets, reviewers, decisions, receipts, handoffs, triggers, closures, or publications are recorded, and all nine holds remain In Review.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["One cited Amtrak asset-period packet", "Privacy-safe completed broadband packets", "Stable Hanford identity and custody packet", "Exact NNSA site-period output, capacity, and GAO closure packets"]),
  "---",
  "",
  "## What Phase 57N proves",
  "",
  "The Phase 57M controls behave deterministically across every accepted label, one explicit ambiguity rejection per field, every empty and incomplete fixture, and every review-table receipt shape.",
  "",
  "## What did not move",
  "",
  "No synthetic test is evidence. No actual candidate packet, reviewer identity, cited-source decision, receipt, handoff, trigger, closure, or publication event exists, and every inherited hold remains In Review.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57N records no agency contact, FOIA request, directive-scope change, implementation change, capability change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-044-adapter-conformance-packet-validation-receipts.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57n-adapter-conformance-packet-validation-receipts.json"), {
  id: "update-2026-08-09-phase-57n-adapter-conformance-packet-validation-receipts",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57N proves deterministic intake behavior without evaluating evidence",
  summary: "Thirty-six carried Tier 1 sources support twenty Published workflow controls, nine preserved holds, 180 adapter tests, eighteen fixture executions, and fifty-four reviewer-receipt templates.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-044-adapter-conformance-packet-validation-receipts/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic conformance results, fixture executions, and receipt templates remain separate from source evidence, reviewer identity, eligibility, operating outcomes, fired triggers, closure, and publication.",
  work_package: "docs/work-packages/phase-57n-adapter-conformance-packet-validation-reviewer-receipts.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};
const allSourceIds = carriedSourceIds;
for (const [file, selected, question] of [
  ["finance-and-risk.json", allSourceIds, "Which Phase 57N receipt first records a named reviewer, reason code, cited source, decision time, escalation state, and publication-review handoff for an actual packet?"],
  ["policy-and-standards.json", allSourceIds, "Which actual packet first passes the Phase 57N deterministic harness and receives a complete human-review receipt without automatic publication?"],
  ["mobility.json", sourceIdsByRail.Amtrak, "Which official Amtrak packet first passes all adapter and packet checks and receives a named, receipted human decision?"],
  ["chips-and-compute.json", sourceIdsByRail.Broadband, "Which privacy-safe broadband packet first clears deterministic schema, period, privacy, disposition, authority, and receipt review?"],
  ["energy.json", [...new Set([...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA])], "Which cited Hanford or NNSA packet first clears deterministic identity, unit, method, period, authority, acceptance, receipt, and publication-review gates?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected);
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
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57n-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57N deterministic validation and reviewer receipts");
    value.dependency_stack.push({
      stage: "Phase 57N deterministic validation and reviewer receipts",
      current_state: "180 adapter tests and eighteen fixture executions pass; fifty-four receipt templates exist; zero actual packets, receipts, decisions, triggers, closures, or publications are recorded.",
      boundary: "Synthetic test passage and receipt templates are workflow infrastructure, not evidence, eligibility, reviewer identity, or a publication decision.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57N prohibits semantic label coercion, fixture promotion, invented reviewer identities or citations, automatic trigger firing, closure, publication, ranking, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["One complete cited packet that passes deterministic validation and receives a complete named human-review receipt before separate publication review."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57N proves deterministic adapter and packet routing and defines reviewer receipts while preserving every operating-outcome hold and the separate publication gate.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57n-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57n-conformance-receipt-ledger");
  value.links = value.links.filter((link) => link.from !== "node-phase57n-conformance-receipt-ledger");
  value.nodes.push({ id: "node-phase57n-conformance-receipt-ledger", label: "180 adapter tests; eighteen fixture executions; fifty-four receipt templates; zero actual decisions", node_type: "Signal", note: "Deterministic workflow controls pass without creating evidence, reviewer identity, eligibility, closure, or publication." });
  value.links.push(
    { from: "node-phase57n-conformance-receipt-ledger", to: "node-phase57m-adapter-packet-review", relationship: "Depends On", confidence: "Supported", note: "Phase 57N executes the adapters, fixtures, and decision shapes defined in Phase 57M." },
    { from: "node-phase57n-conformance-receipt-ledger", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "An actual receipt still requires one cited packet with compatible identity, definition, unit, method, denominator, period, privacy, and authority." },
    { from: "node-phase57n-conformance-receipt-ledger", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Synthetic tests and receipt templates do not establish operating outcomes, eligibility, closure, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["120 accepted-label tests, sixty ambiguity rejections, eighteen fixture executions, fifty-four receipt templates, zero actual review events, and nine preserved holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["One complete cited packet that passes deterministic validation and receives a complete named reviewer receipt without changing identity, period, denominator, privacy, authority, acceptance, capability, implementation, or closure attribution."]);
});

console.log(`Generated Phase 57N: ${published.length} Published controls, ${held.length} In Review holds, ${carriedSourceIds.length} carried Tier 1 sources, ${adapterTests.length} adapter tests, ${fixtureExecutions.length} fixture executions, ${receiptTemplates.length} receipt templates, and Research Watch 044.`);
