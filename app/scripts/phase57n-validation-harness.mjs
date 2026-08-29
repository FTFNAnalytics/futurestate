import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DECISION_BY_CONDITION = Object.freeze({
  explicit_disqualifier: "reject",
  missing_required_fields: "return_for_clarification",
  identity_chain_incomplete: "return_for_clarification",
  privacy_review_missing: "privacy_hold",
  acceptance_authority_mismatch: "authority_hold",
  period_not_completed: "period_hold",
  gao_status_date_missing: "period_hold",
});

export const normalizeAdapterLabel = (value) => {
  if (typeof value !== "string") return null;
  return value.trim().toLocaleLowerCase("en-US");
};

export const evaluateAdapterLabel = (adapter, providedLabel) => {
  const normalizedInput = normalizeAdapterLabel(providedLabel);
  const matches = normalizedInput === null
    ? []
    : adapter.accepted_source_labels.filter((label) => normalizeAdapterLabel(label) === normalizedInput);
  const normalizedMatches = [...new Set(matches.map(normalizeAdapterLabel))];

  if (normalizedMatches.length === 1) {
    return {
      decision: "accept_label_for_field_review",
      reason_code: "exact_label_match_after_case_and_outer_trim",
      matched_label: matches[0],
      normalized_input: normalizedInput,
      value_supplied: false,
      value_transformed: false,
      evidence_created: false,
    };
  }

  return {
    decision: "return_for_clarification",
    reason_code: normalizedMatches.length > 1 ? "ambiguous_exact_label_collision" : "unrecognized_or_ambiguous_label",
    matched_label: null,
    normalized_input: normalizedInput,
    value_supplied: false,
    value_transformed: false,
    evidence_created: false,
  };
};

const variedAcceptedInput = (label, index) => index % 2 === 0
  ? `  ${label.toLocaleUpperCase("en-US")}  `
  : ` ${label.toLocaleLowerCase("en-US")} `;

const ambiguousInputFor = (adapter) => `${adapter.accepted_source_labels[0]} / ${adapter.accepted_source_labels[1]}`;

export const buildAdapterConformanceTests = (adapters) => adapters.flatMap((adapter) => {
  const accepted = adapter.accepted_source_labels.map((acceptedLabel, index) => {
    const providedLabel = variedAcceptedInput(acceptedLabel, index);
    const result = evaluateAdapterLabel(adapter, providedLabel);
    return {
      test_id: `${adapter.adapter_id}-ACCEPTED-${String(index + 1).padStart(2, "0")}`,
      adapter_id: adapter.adapter_id,
      contract_id: adapter.contract_id,
      evidence_rail: adapter.evidence_rail,
      field_name: adapter.field_name,
      test_class: "accepted_label",
      accepted_label_under_test: acceptedLabel,
      provided_label: providedLabel,
      expected_decision: "accept_label_for_field_review",
      actual_decision: result.decision,
      reason_code: result.reason_code,
      normalized_input: result.normalized_input,
      matched_label: result.matched_label,
      passed: result.decision === "accept_label_for_field_review" && normalizeAdapterLabel(result.matched_label) === normalizeAdapterLabel(acceptedLabel),
      fixture_only: true,
      source_value_supplied: result.value_supplied,
      value_transformed: result.value_transformed,
      evidence_created: result.evidence_created,
      human_review_required: true,
    };
  });

  const providedLabel = ambiguousInputFor(adapter);
  const result = evaluateAdapterLabel(adapter, providedLabel);
  const ambiguous = {
    test_id: `${adapter.adapter_id}-AMBIGUOUS-REJECTION`,
    adapter_id: adapter.adapter_id,
    contract_id: adapter.contract_id,
    evidence_rail: adapter.evidence_rail,
    field_name: adapter.field_name,
    test_class: "ambiguous_label_rejection",
    accepted_label_under_test: null,
    provided_label: providedLabel,
    expected_decision: "return_for_clarification",
    actual_decision: result.decision,
    reason_code: "ambiguous_synthetic_label_not_exactly_accepted",
    normalized_input: result.normalized_input,
    matched_label: result.matched_label,
    passed: result.decision === "return_for_clarification" && result.matched_label === null,
    fixture_only: true,
    source_value_supplied: result.value_supplied,
    value_transformed: result.value_transformed,
    evidence_created: result.evidence_created,
    human_review_required: true,
  };

  return [...accepted, ambiguous];
});

export const validatePacketFixture = (template, fixtureType) => {
  const fixture = fixtureType === "empty" ? template.empty_packet : template.incomplete_packet;
  if (!fixture || !["empty", "incomplete"].includes(fixtureType)) {
    throw new Error(`Unknown fixture type ${fixtureType} for ${template.contract_id}`);
  }

  const boundaryFailures = [
    fixture.fixture_only !== true && "fixture_only",
    fixture.eligible_record !== false && "eligible_record",
    fixture.fires_trigger !== false && "fires_trigger",
    fixture.automated_publication_allowed !== false && "automated_publication_allowed",
    template.cross_record_assembly_allowed !== false && "cross_record_assembly_allowed",
    template.human_review_required !== true && "human_review_required",
  ].filter(Boolean);

  const computedMissingFields = template.required_fields.filter((field) => fixture.fields?.[field] === null || fixture.fields?.[field] === undefined);
  const populatedFieldCount = template.required_fields.length - computedMissingFields.length;
  const expectedDecision = fixtureType === "empty"
    ? "return_for_clarification"
    : fixture.expected_review_decision;
  const actualDecision = boundaryFailures.length
    ? "reject"
    : fixtureType === "empty"
      ? "return_for_clarification"
      : DECISION_BY_CONDITION[fixture.synthetic_test_condition] ?? "return_for_clarification";
  const reasonCode = boundaryFailures.length
    ? "fixture_boundary_violation"
    : fixtureType === "empty"
      ? "all_required_fields_missing"
      : fixture.synthetic_test_condition;

  return {
    execution_id: `VALIDATION-${fixture.fixture_id}`,
    validator_id: `PACKET-VALIDATOR-${template.contract_id}`,
    contract_id: template.contract_id,
    queue_id: template.queue_id,
    evidence_rail: template.evidence_rail,
    fixture_id: fixture.fixture_id,
    fixture_type: fixtureType,
    fixture_only: true,
    evidence_status: fixture.evidence_status,
    expected_decision: expectedDecision,
    actual_decision: actualDecision,
    reason_code: reasonCode,
    boundary_failures: boundaryFailures,
    required_field_count: template.required_field_count,
    populated_field_count: populatedFieldCount,
    missing_required_fields: computedMissingFields,
    passed: actualDecision === expectedDecision
      && boundaryFailures.length === 0
      && populatedFieldCount === fixture.populated_field_count
      && JSON.stringify(computedMissingFields) === JSON.stringify(fixture.missing_required_fields),
    candidate_packet_evaluated: false,
    evidence_ingested: false,
    eligible_record: false,
    fires_trigger: false,
    closes_hold_automatically: false,
    automated_publication_allowed: false,
    human_review_required: true,
  };
};

export const buildPacketFixtureExecutions = (templates) => templates.flatMap((template) => [
  validatePacketFixture(template, "empty"),
  validatePacketFixture(template, "incomplete"),
]);

export const countBy = (rows, field) => rows.reduce((counts, row) => {
  const value = typeof field === "function" ? field(row) : row[field];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const appRoot = fileURLToPath(new URL("..", import.meta.url));
  const adapters = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57m-source-schema-adapters.json"), "utf8"));
  const packets = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57m-candidate-evidence-packet-templates.json"), "utf8"));
  const adapterTests = buildAdapterConformanceTests(adapters.adapters);
  const fixtureExecutions = buildPacketFixtureExecutions(packets.templates);
  const failures = [...adapterTests, ...fixtureExecutions].filter((row) => !row.passed);
  if (failures.length) {
    console.error(`Phase 57N harness failed ${failures.length} cases.`);
    for (const failure of failures) console.error(`- ${failure.test_id ?? failure.execution_id}`);
    process.exit(1);
  }
  console.log(`Phase 57N harness passed: ${adapterTests.length} adapter cases (${adapterTests.filter((row) => row.test_class === "accepted_label").length} accepted labels and ${adapterTests.filter((row) => row.test_class === "ambiguous_label_rejection").length} ambiguity rejections) plus ${fixtureExecutions.length} non-evidence fixture executions.`);
}
