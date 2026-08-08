import "./generate-phase57l-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-08";
const collectionSlug = "source-schema-adapters-candidate-evidence-packet-templates-human-review-decision-tables-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-043-source-schema-adapters-packet-review-controls";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const countBy = (rows, field) => rows.reduce((counts, row) => {
  const value = typeof field === "function" ? field(row) : row[field];
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57l = JSON.parse(await readFile(join(dataRoot, "phase-57l-contract-field-coverage-intake-queues-exception-playbooks.json"), "utf8"));
const coverage = JSON.parse(await readFile(join(dataRoot, "phase-57l-contract-field-coverage-matrix.json"), "utf8"));
const intake = JSON.parse(await readFile(join(dataRoot, "phase-57l-first-eligible-record-intake-queue.json"), "utf8"));
if (phase57l.phase !== "57L" || phase57l.records.length !== 29 || coverage.fields.length !== 60 || intake.queues.length !== 9) {
  throw new Error("Phase 57M requires the complete Phase 57L field matrix and all nine intake queues.");
}

const authorityBoundary = "Agency assertions, independent oversight, FTFN workflow controls, acceptance, implementation, capability, closure, and operating outcomes remain separate evidence states.";
const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
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
const titleCase = (value) => value.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
const inferDataType = (field) => {
  if (/date|period/.test(field)) return "source_explicit_date_or_period";
  if (/numerator|denominator|units|capacity|measure/.test(field)) return "source_explicit_numeric_or_measure";
  if (/state|status|review|disposition/.test(field)) return "source_explicit_controlled_state";
  if (/id|code/.test(field)) return "source_explicit_identifier";
  return "source_explicit_text";
};
const definitionRule = (field) => {
  if (/id|code/.test(field)) return "Require the exact source identifier; a name, inferred alias, or identifier from another record is not equivalent.";
  if (/date|period/.test(field)) return "Require an explicit completed period or event date under the contract; do not substitute publication or capture dates.";
  if (/numerator|denominator|units|capacity|measure|unit|method/.test(field)) return "Preserve the source definition, unit, method, numerator, denominator, and aggregation boundary without conversion or imputation.";
  if (/authority|status|state|review|disposition/.test(field)) return "Require the named source authority and its explicit state or disposition; self-attestation cannot replace independent acceptance or closure.";
  return "Require an explicit field value inside the same source-eligible candidate record; do not infer it from narrative context.";
};
const unitRule = (field) => /numerator|denominator|units|capacity|measure|unit/.test(field)
  ? "The exact source unit and denominator must be declared and contract-compatible; automatic conversion is prohibited."
  : "No unit is assumed; retain any source-declared unit as separate metadata.";

const queueByContract = new Map(intake.queues.map((queue) => [queue.contract_id, queue]));
const phase57lHolds = phase57l.records.filter((record) => record.record_status === "In Review");
const holdByContract = new Map(phase57lHolds.map((record) => [record.reopening_contract_id, record]));
const holdKeyForContract = (contractId) => {
  const hold = holdByContract.get(contractId);
  if (!hold) throw new Error(`Missing Phase 57L hold for ${contractId}`);
  return hold.action_key;
};
const adapters = coverage.fields.map((row) => {
  const queue = queueByContract.get(row.contract_id);
  if (!queue) throw new Error(`Missing Phase 57M queue for ${row.contract_id}`);
  return {
    adapter_id: `ADAPTER-${row.contract_id}-${row.field_name.toUpperCase().replaceAll("_", "-")}`,
    contract_id: row.contract_id,
    queue_id: queue.queue_id,
    evidence_rail: row.evidence_rail,
    phase57l_hold_key: holdKeyForContract(row.contract_id),
    field_name: row.field_name,
    canonical_label: row.field_name,
    accepted_source_labels: [row.field_name, titleCase(row.field_name)],
    accepted_labels_are_observed_source_evidence: false,
    label_match_rule: "Exact case-insensitive match after outer-whitespace trim only",
    unrecognized_label_policy: "reject_and_return_for_clarification",
    data_type: inferDataType(row.field_name),
    definition_rule: definitionRule(row.field_name),
    unit_rule: unitRule(row.field_name),
    source_authority_rule: queue.eligible_source_authority,
    period_rule: queue.period_scope,
    privacy_rule: queue.privacy_boundary,
    value_transformations_allowed: [],
    source_value: null,
    adapter_is_evidence: false,
    carry_value_from_other_record: false,
    human_review_required: true,
  };
});
const adapterRegistry = {
  phase: "57M",
  captured_date: capturedDate,
  registry_type: "Non-coercive source-schema adapters",
  contract_count: intake.queues.length,
  field_mapping_count: adapters.length,
  accepted_label_count: adapters.reduce((sum, row) => sum + row.accepted_source_labels.length, 0),
  unrecognized_labels_coerced: 0,
  value_transformations_allowed: 0,
  adapter_values_populated: 0,
  review_rule: "Adapter vocabularies define exact accepted input labels; they do not establish that a source field or value exists. Unrecognized labels are returned for clarification, never coerced.",
  adapters,
};
await writeJson(join(dataRoot, "phase-57m-source-schema-adapters.json"), adapterRegistry);

const fixturePlan = {
  "REOPEN-AMTRAK-PIDS": { expected: "return_for_clarification", condition: "missing_required_fields", field: "official_station_code", value: "[fixture-only:station-code]" },
  "REOPEN-AMTRAK-RELIABILITY": { expected: "reject", condition: "explicit_disqualifier", field: "measure_definition", value: "[fixture-only:systemwide-not-asset-level]" },
  "REOPEN-LA-NEXTLINK-ADOPTION": { expected: "privacy_hold", condition: "privacy_review_missing", field: "award_id", value: "[fixture-only:award-id]" },
  "REOPEN-LA-STARLINK-ADOPTION": { expected: "privacy_hold", condition: "privacy_review_missing", field: "award_id", value: "[fixture-only:award-id]" },
  "REOPEN-MT-BEAD-QUARTER": { expected: "period_hold", condition: "period_not_completed", field: "reporting_period", value: "[fixture-only:open-period]" },
  "REOPEN-HANFORD-MASS-BALANCE": { expected: "return_for_clarification", condition: "identity_chain_incomplete", field: "stable_batch_id", value: "[fixture-only:batch-id]" },
  "REOPEN-NNSA-QUALIFIED-RATE": { expected: "authority_hold", condition: "acceptance_authority_mismatch", field: "acceptance_authority", value: "[fixture-only:self-attestation]" },
  "REOPEN-NNSA-ACCEPTED-CAPACITY": { expected: "authority_hold", condition: "acceptance_authority_mismatch", field: "acceptance_authority", value: "[fixture-only:self-attestation]" },
  "REOPEN-NNSA-GAO-BASELINE": { expected: "period_hold", condition: "gao_status_date_missing", field: "gao_status_date", value: "[fixture-only:undated-status]" },
};
const nullFields = (fields) => Object.fromEntries(fields.map((field) => [field, null]));
const packetTemplates = intake.queues.map((queue, index) => {
  const plan = fixturePlan[queue.contract_id];
  const incompleteFields = nullFields(queue.required_fields);
  incompleteFields[plan.field] = plan.value;
  return {
    template_id: `PACKET-TEMPLATE-${String(index + 1).padStart(2, "0")}-${queue.contract_id}`,
    contract_id: queue.contract_id,
    queue_id: queue.queue_id,
    evidence_rail: queue.evidence_rail,
    phase57l_hold_key: holdKeyForContract(queue.contract_id),
    candidate_record_type: queue.candidate_record_type,
    required_field_count: queue.required_fields.length,
    required_fields: queue.required_fields,
    source_metadata_fields: ["official_url", "publisher", "publication_date", "source_authority", "captured_date", "record_identifier"],
    empty_packet: {
      fixture_id: `EMPTY-${queue.contract_id}`,
      fixture_only: true,
      evidence_status: "non_evidence_empty_workflow_fixture",
      source_metadata: { official_url: null, publisher: null, publication_date: null, source_authority: null, captured_date: null, record_identifier: null },
      fields: nullFields(queue.required_fields),
      populated_field_count: 0,
      missing_required_fields: queue.required_fields,
      eligible_record: false,
      fires_trigger: false,
      automated_publication_allowed: false,
    },
    incomplete_packet: {
      fixture_id: `INCOMPLETE-${queue.contract_id}`,
      fixture_only: true,
      evidence_status: "non_evidence_deliberately_incomplete_synthetic_fixture",
      synthetic_test_condition: plan.condition,
      source_metadata: { official_url: null, publisher: null, publication_date: null, source_authority: null, captured_date: null, record_identifier: "FIXTURE-NOT-A-SOURCE" },
      fields: incompleteFields,
      populated_field_count: 1,
      missing_required_fields: queue.required_fields.filter((field) => field !== plan.field),
      expected_review_decision: plan.expected,
      eligible_record: false,
      fires_trigger: false,
      automated_publication_allowed: false,
    },
    cross_record_assembly_allowed: false,
    human_review_required: true,
  };
});
const packetRegistry = {
  phase: "57M",
  captured_date: capturedDate,
  registry_type: "Candidate-evidence packet templates and non-evidence fixtures",
  template_count: packetTemplates.length,
  empty_fixture_count: packetTemplates.length,
  incomplete_fixture_count: packetTemplates.length,
  total_fixture_count: packetTemplates.length * 2,
  populated_synthetic_test_fields: packetTemplates.length,
  candidate_records_evaluated: 0,
  eligible_records_accepted: 0,
  triggers_fired: 0,
  fixtures_are_evidence: false,
  review_rule: "Empty and incomplete fixtures test workflow behavior only. Synthetic placeholders are not source values, cannot be combined across records, and cannot enter a publication decision as evidence.",
  templates: packetTemplates,
};
await writeJson(join(dataRoot, "phase-57m-candidate-evidence-packet-templates.json"), packetRegistry);

const decisionTypes = ["accept", "reject", "return_for_clarification", "privacy_hold", "authority_hold", "period_hold"];
const decisionDefinition = {
  accept: {
    scenario: "Every required field is source-explicit in one candidate packet and all identity, schema, definition, unit, period, privacy, authority, and acceptance checks pass.",
    resulting_state: "ready_for_separate_publication_review",
  },
  reject: {
    scenario: "A named disqualifier, incompatible definition, cross-record assembly, fabricated value, or prohibited transformation is present.",
    resulting_state: "rejected_non_eligible",
  },
  return_for_clarification: {
    scenario: "A required label, value, definition, source citation, identity, unit, method, or denominator is missing or ambiguous.",
    resulting_state: "returned_without_trigger",
  },
  privacy_hold: {
    scenario: "A privacy review or suppression-safe public disposition is absent, ambiguous, or exposes prohibited detail.",
    resulting_state: "held_for_privacy_review",
  },
  authority_hold: {
    scenario: "The supplied authority cannot establish the required acceptance, disposition, or closure state.",
    resulting_state: "held_for_named_authority",
  },
  period_hold: {
    scenario: "Required fields do not share the same completed reporting period or an event date remains outside the contract boundary.",
    resulting_state: "held_for_compatible_period",
  },
};
const decisionTables = intake.queues.map((queue, tableIndex) => ({
  table_id: `DECISION-TABLE-${String(tableIndex + 1).padStart(2, "0")}-${queue.contract_id}`,
  contract_id: queue.contract_id,
  queue_id: queue.queue_id,
  evidence_rail: queue.evidence_rail,
  phase57l_hold_key: holdKeyForContract(queue.contract_id),
  actual_candidate_packets_evaluated: 0,
  actual_accept_decisions: 0,
  trigger_state: "not_fired",
  rows: decisionTypes.map((decisionType, rowIndex) => ({
    decision_id: `${queue.contract_id}-DECISION-${String(rowIndex + 1).padStart(2, "0")}-${decisionType.toUpperCase().replaceAll("_", "-")}`,
    decision_type: decisionType,
    rehearsal_only: true,
    scenario: decisionDefinition[decisionType].scenario,
    minimum_conditions: decisionType === "accept"
      ? ["all required fields present in one packet", "eligible source authority", "compatible identity, schema, definition, unit, method, denominator, and completed period", "privacy and acceptance boundaries cleared", "named human reviewer signs the separate publication review"]
      : ["route the packet to this decision when the named scenario is observed", "retain the Phase 57L hold", "record the reason without inferring an outcome"],
    resulting_state: decisionDefinition[decisionType].resulting_state,
    fires_trigger: false,
    closes_hold_automatically: false,
    automated_publication_allowed: false,
    actual_candidate_evaluated: false,
    human_review_required: true,
  })),
}));
const decisionRows = decisionTables.flatMap((table) => table.rows);
const decisionRegistry = {
  phase: "57M",
  captured_date: capturedDate,
  registry_type: "Human-review decision tables",
  table_count: decisionTables.length,
  decision_types: decisionTypes,
  decision_row_count: decisionRows.length,
  decision_type_counts: countBy(decisionRows, "decision_type"),
  actual_candidate_packets_evaluated: 0,
  actual_accept_decisions: 0,
  actual_reopening_triggers_fired: 0,
  automated_publication_allowed: false,
  review_rule: "Decision rows are workflow rehearsals, not decisions on evidence. Even an accept-path rehearsal leads only to a separate human publication review and never fires a trigger automatically.",
  tables: decisionTables,
};
await writeJson(join(dataRoot, "phase-57m-human-review-decision-tables.json"), decisionRegistry);

const contracts = intake.queues.map((queue) => queue.contract_id);
const railContractIds = {
  Amtrak: intake.queues.filter((queue) => queue.evidence_rail === "Amtrak").map((queue) => queue.contract_id),
  Broadband: intake.queues.filter((queue) => queue.evidence_rail === "Broadband").map((queue) => queue.contract_id),
  Hanford: intake.queues.filter((queue) => queue.evidence_rail === "Hanford").map((queue) => queue.contract_id),
  NNSA: intake.queues.filter((queue) => queue.evidence_rail === "NNSA").map((queue) => queue.contract_id),
};
const sourcesForRail = (rail) => [...new Set(phase57l.records.filter((record) => {
  if (rail === "Amtrak") return record.agency === "DOT";
  if (rail === "Broadband") return record.agency === "NTIA";
  if (rail === "Hanford") return /HANFORD|hanford/i.test(`${record.action_key} ${record.structured_registry_file}`);
  return /NNSA|nnsa/i.test(`${record.action_key} ${record.structured_registry_file}`);
}).flatMap((record) => record.supporting_source_ids))];
const sourceIdsByRail = {
  Amtrak: sourcesForRail("Amtrak"),
  Broadband: sourcesForRail("Broadband"),
  Hanford: sourcesForRail("Hanford"),
  NNSA: sourcesForRail("NNSA"),
};
const summaryForRail = (rail) => {
  const contractIds = railContractIds[rail];
  const railAdapters = adapters.filter((row) => row.evidence_rail === rail);
  return {
    contracts: contractIds.length,
    fields: railAdapters.length,
    acceptedLabels: railAdapters.reduce((sum, row) => sum + row.accepted_source_labels.length, 0),
    emptyFixtures: packetTemplates.filter((row) => row.evidence_rail === rail).length,
    incompleteFixtures: packetTemplates.filter((row) => row.evidence_rail === rail).length,
    decisionRows: decisionTables.filter((row) => row.evidence_rail === rail).reduce((sum, row) => sum + row.rows.length, 0),
  };
};

const specs = [];
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  const summary = summaryForRail(rail);
  const slugRail = rail.toLowerCase();
  const sources = sourceIdsByRail[rail];
  specs.push(
    {
      slug: `${slugRail}-${summary.fields}-non-coercive-field-adapters`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-SOURCE-SCHEMA-ADAPTERS-2026-01`, stage: `${rail} adapter and review-control operationalization`, sourceIds: sources,
      title: `${rail} maps ${summary.fields} required fields through non-coercive schema adapters`,
      finding: `${summary.fields} field adapters preserve exact labels, definitions, units, authority, period, and privacy boundaries without populating a source value.`,
      denominator: `${summary.contracts} contracts, ${summary.fields} adapters, and zero observed or populated adapter values.`,
      limits: ["An adapter vocabulary is not evidence that a source field exists.", "Unrecognized labels are never coerced.", "No value transformation or cross-record carry is allowed."],
      next: "Apply the adapter only to one cited candidate packet and return any ambiguous label for clarification.", registry: "phase-57m-source-schema-adapters.json",
    },
    {
      slug: `${slugRail}-${summary.acceptedLabels}-accepted-input-labels`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-ACCEPTED-INPUT-LABELS-2026-01`, stage: `${rail} adapter and review-control operationalization`, sourceIds: sources,
      title: `${rail} declares ${summary.acceptedLabels} exact accepted input labels`,
      finding: `Each ${rail} field admits one canonical label and one readable label while rejecting unrecognized or ambiguous labels without inference.`,
      denominator: `${summary.acceptedLabels} adapter-vocabulary labels across ${summary.fields} required fields.`,
      limits: ["Accepted labels are workflow vocabulary, not observed source evidence.", "Case normalization does not permit semantic aliasing.", "A label match cannot supply a value."],
      next: "Record the exact source label and citation when an actual candidate packet enters review.", registry: "phase-57m-source-schema-adapters.json",
    },
    {
      slug: `${slugRail}-${summary.emptyFixtures}-empty-${summary.incompleteFixtures}-incomplete-packet-fixtures`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-PACKET-FIXTURES-2026-01`, stage: `${rail} adapter and review-control operationalization`, sourceIds: sources,
      title: `${rail} builds empty and deliberately incomplete non-evidence packet fixtures`,
      finding: `${summary.emptyFixtures} empty canonical packets and ${summary.incompleteFixtures} incomplete synthetic packets expose missing-field, privacy, authority, period, and disqualifier handling.`,
      denominator: `${summary.emptyFixtures + summary.incompleteFixtures} fixtures and zero candidate evidence records.`,
      limits: ["Fixture placeholders are not source values.", "Fixtures cannot enter the evidence ledger.", "Incomplete packets cannot fire a trigger."],
      next: "Use the fixtures only to test intake behavior before reviewing a cited official record.", registry: "phase-57m-candidate-evidence-packet-templates.json",
    },
    {
      slug: `${slugRail}-${summary.decisionRows}-human-review-decision-rows`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-HUMAN-REVIEW-DECISION-TABLES-2026-01`, stage: `${rail} adapter and review-control operationalization`, sourceIds: sources,
      title: `${rail} defines ${summary.decisionRows} human-review rows across six outcomes`,
      finding: `Every ${rail} contract rehearses accept, reject, clarification, privacy-hold, authority-hold, and period-hold paths without evaluating a candidate record.`,
      denominator: `${summary.contracts} decision tables, ${summary.decisionRows} rehearsal rows, and zero actual accept decisions.`,
      limits: ["Decision rows are rehearsals, not evidence decisions.", "Accept routes only to separate publication review.", "No row closes a hold automatically."],
      next: "Require a named reviewer to record one bounded decision and reason for each actual packet.", registry: "phase-57m-human-review-decision-tables.json",
    },
    {
      slug: `${slugRail}-zero-evidence-packets-accepted-or-triggers-fired`,
      agency: agencyByRail[rail], actionKey: `${rail.toUpperCase()}-ZERO-PACKET-ACCEPTANCE-2026-01`, stage: `${rail} adapter and review-control operationalization`, sourceIds: sources,
      title: `${rail} accepts zero evidence packets and fires zero reopening triggers`,
      finding: "Adapters, fixtures, and decision rehearsals make the review workflow executable but do not supply, evaluate, or accept an evidence packet.",
      denominator: `${summary.contracts} contracts, ${summary.fields} fields, ${summary.emptyFixtures + summary.incompleteFixtures} fixtures, and zero accepted evidence packets.`,
      limits: ["Workflow infrastructure is not operating evidence.", "No accept-path rehearsal establishes eligibility.", "Every inherited outcome hold remains In Review."],
      next: "Keep the hold until one complete cited packet clears all checks and a separate human publication review approves it.", registry: "phase-57m-human-review-decision-tables.json",
    },
  );
}

const nextHoldKeys = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-11": "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-12",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-10": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-11",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-11": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-12",
  "LA-BEAD-STARLINK-HOLD-2026-11": "LA-BEAD-STARLINK-HOLD-2026-12",
  "MT-BEAD-QUARTERLY-HOLD-2026-11": "MT-BEAD-QUARTERLY-HOLD-2026-12",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-08": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-09",
  "NNSA-PIT-RATE-HOLD-2026-11": "NNSA-PIT-RATE-HOLD-2026-12",
  "NNSA-PIT-PEIS-HOLD-2026-11": "NNSA-PIT-PEIS-HOLD-2026-12",
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-12": "NNSA-PIT-GAO-BASELINE-HOLD-2027-01",
};
const heldSpecs = intake.queues.map((queue) => {
  const prior = holdByContract.get(queue.contract_id);
  const plan = fixturePlan[queue.contract_id];
  if (!prior || !nextHoldKeys[prior.action_key]) throw new Error(`Missing Phase 57M hold lineage for ${queue.contract_id}`);
  return {
    slug: `preserved-${queue.contract_id.toLowerCase().replace(/^reopen-/, "").replaceAll("_", "-")}`,
    agency: agencyByRail[queue.evidence_rail], actionKey: nextHoldKeys[prior.action_key], parentHoldKey: prior.action_key, reopeningContractId: queue.contract_id,
    stage: "Adapter and packet-review hold", sourceIds: prior.supporting_source_ids,
    title: `${contractLabel[queue.contract_id]} remains In Review after adapter and packet-control review`,
    finding: `${queue.required_fields.length} required fields have exact adapter mappings, but the only Phase 57M packets are non-evidence fixtures and the incomplete rehearsal routes to ${plan.expected.replaceAll("_", " ")}.`,
    denominator: `One inherited hold, one adapter, two fixtures, six decision rows, zero candidate packets, and zero trigger events.`,
    limits: ["Adapter mappings and packet fixtures are not evidence.", "A decision rehearsal cannot establish eligibility.", "Human publication review remains mandatory."],
    next: queue.candidate_record_type, registry: "phase-57m-candidate-evidence-packet-templates.json",
  };
});
const allSpecs = [...specs, ...heldSpecs];
if (specs.length !== 20 || heldSpecs.length !== 9 || allSpecs.length !== 29) throw new Error("Phase 57M must contain twenty Published controls and nine held records.");

const sourceById = new Map();
for (const id of [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const records = allSpecs.map((spec, index) => ({
  record_id: `record-57m-${spec.slug}`,
  document_id: `research-doc-57m-${spec.slug}`,
  signal_id: `signal-57m-${spec.slug}`,
  document_number: 902 + index,
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

const phase57mLedger = {
  phase: "57M",
  captured_date: capturedDate,
  goal: "Make all nine Phase 57L intake queues executable against future cited records without inventing evidence, coercing source labels, or automating a publication decision.",
  publication_rule: "Publish only adapter, fixture, and human-review control records; preserve all nine outcome holds and treat every fixture and rehearsal as non-evidence.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: countBy(records, "evidence_stage"),
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57m-source-schema-adapters.json", contracts: 9, fields: 60, accepted_labels: 120, coerced_labels: 0 },
    { file: "phase-57m-candidate-evidence-packet-templates.json", templates: 9, empty_fixtures: 9, incomplete_fixtures: 9, evidence_packets: 0 },
    { file: "phase-57m-human-review-decision-tables.json", tables: 9, decision_rows: 54, actual_accept_decisions: 0 },
  ],
  source_schema_adapters: 60,
  accepted_input_labels: 120,
  empty_packet_fixtures: 9,
  incomplete_packet_fixtures: 9,
  human_review_decision_tables: 9,
  human_review_decision_rows: 54,
  decision_types: decisionTypes,
  candidate_packets_evaluated: 0,
  eligible_records_accepted: 0,
  actual_accept_decisions: 0,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57l.post_batch_visible_scope,
  post_batch_visible_scope: phase57l.post_batch_visible_scope,
  post_batch_closure_counts: phase57l.post_batch_closure_counts,
  preserved_phase57l_holds: phase57lHolds.map((record) => record.action_key),
  reopening_contract_ids: contracts,
  new_visible_holds: [],
  records,
};
await writeJson(join(dataRoot, "phase-57m-source-schema-adapters-packet-templates-review-decision-tables.json"), phase57mLedger);
await writeJson(join(dataRoot, "phase-57m-publication-review.json"), {
  phase: "57M",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  candidate_packets_evaluated: 0,
  eligible_records_accepted: 0,
  actual_accept_decisions: 0,
  decision: "Twenty adapter, packet-fixture, and reviewer-decision controls publish. Nine inherited holds remain In Review; every fixture and rehearsal is non-evidence, no candidate packet is evaluated or accepted, and no trigger, scope, implementation, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 901).padStart(2, "0")}-${record.record_id.replace(/^record-57m-/, "")}.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57m-${record.record_id.replace(/^record-57m-/, "")}.json`), {
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
      ? "The record makes a future evidence-review workflow executable while keeping adapter vocabulary, fixtures, and rehearsals outside the evidence ledger."
      : "The hold remains actionable while workflow infrastructure stays separate from a complete cited packet and an actual publication decision.",
    ftfn_relevance: ["Maps all sixty Phase 57L fields without coercion.", "Provides empty and deliberately incomplete non-evidence packet fixtures for all nine queues.", "Defines six bounded human-review outcomes without automatic acceptance, trigger, closure, or publication."],
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
    yamlList("dependencies", ["one complete cited candidate evidence packet", "exact field-label, definition, unit, period, privacy, and authority compatibility", "named human review followed by separate publication review"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57M adapters, packet templates, and human-review decision tables"]),
    yamlList("local_implications", ["Do not convert an adapter match, fixture result, or rehearsal decision into evidence, readiness, eligibility, or a fired trigger."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57M workflow-control contract." : `Held under ${record.reopening_contract_id}; every Phase 57M packet remains non-evidence.`)}`,
    "---",
    "",
    "## Phase 57M workflow control",
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
    "Candidate packets evaluated: **Zero**. Eligible records accepted: **Zero**. Trigger events recorded: **Zero**. FTFN submitted no agency contact or FOIA request.",
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
  title: "Source-Schema Adapters, Candidate-Evidence Packet Templates, and Human-Review Decision Tables, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57M maps all sixty required fields through non-coercive adapters, builds eighteen non-evidence packet fixtures, and rehearses fifty-four human-review decisions while preserving every inherited outcome hold.",
  scope: "Sixty exact field adapters and 120 accepted adapter labels; nine empty and nine incomplete fixtures; nine six-outcome decision tables; zero evaluated candidate packets, zero accepted eligible records, and zero fired triggers.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Adapters, templates, fixtures, and decision rehearsals are workflow infrastructure, not evidence. Labels cannot be coerced, values cannot be invented or assembled across records, fixtures cannot enter the evidence ledger, and every actual decision remains human-reviewed and separate from publication.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  `id: ${JSON.stringify(briefingId)}`,
  "title: \"Research Watch 043: Source-Schema Adapters and Human Review Controls\"",
  "slug: \"research-watch-043-source-schema-adapters-packet-review-controls\"",
  "record_status: \"Published\"",
  "summary: \"Phase 57M maps sixty fields, builds eighteen non-evidence packet fixtures, and rehearses fifty-four human-review decisions without evaluating a candidate packet or firing a trigger.\"",
  `published_date: ${capturedDate}`,
  `captured_date: ${capturedDate}`,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "All sixty required fields map to two exact adapter-vocabulary labels with no semantic coercion or populated source value.",
    "Nine empty and nine deliberately incomplete fixtures exercise workflow paths while remaining explicitly non-evidentiary.",
    "Nine review tables cover accept, reject, clarification, privacy, authority, and period outcomes across fifty-four rehearsal rows.",
    "Zero candidate packets are evaluated or accepted, zero triggers fire, and all nine inherited holds remain In Review.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["One cited Amtrak asset-period packet", "Privacy-safe completed broadband packets", "Stable Hanford identity and custody packet", "Exact NNSA site-period output, capacity, and GAO closure packets"]),
  "---",
  "",
  "## What Phase 57M adds",
  "",
  "Every Phase 57L queue now has an exact source-schema adapter, an empty canonical packet, a deliberately incomplete synthetic fixture, and a six-outcome human-review table. The controls reject ambiguity rather than coercing labels or values.",
  "",
  "## What did not move",
  "",
  "No fixture is evidence. Zero actual candidate packets are evaluated, zero eligible records are accepted, zero triggers fire, and every inherited hold remains In Review.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57M records no agency contact, FOIA request, directive-scope change, implementation change, capability change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-043-source-schema-adapters-packet-review-controls.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-08-phase-57m-source-schema-adapters-packet-review-controls.json"), {
  id: "update-2026-08-08-phase-57m-source-schema-adapters-packet-review-controls",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57M makes nine intake queues executable without turning fixtures into evidence",
  summary: "Thirty-six carried Tier 1 sources support twenty Published workflow controls, nine preserved holds, sixty non-coercive adapters, eighteen packet fixtures, and fifty-four human-review rehearsal rows.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-043-source-schema-adapters-packet-review-controls/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Adapter vocabulary, packet fixtures, and review rehearsals remain separate from source evidence, eligibility, readiness, operating outcomes, and fired triggers.",
  work_package: "docs/work-packages/phase-57m-source-schema-adapters-packet-templates-review-decision-tables.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};
const allSourceIds = carriedSourceIds;
for (const [file, selected, question] of [
  ["finance-and-risk.json", allSourceIds, "Which Phase 57M packet first arrives with every source label, field value, citation, period, unit, and authority boundary explicit?"],
  ["policy-and-standards.json", allSourceIds, "Which actual packet first passes a Phase 57M human review without coercion, cross-record assembly, or automatic publication?"],
  ["mobility.json", sourceIdsByRail.Amtrak, "Which official Amtrak packet first passes the exact schema adapter and all six bounded review paths?"],
  ["chips-and-compute.json", sourceIdsByRail.Broadband, "Which privacy-safe broadband packet first clears schema, period, privacy, disposition, and source-authority review?"],
  ["energy.json", [...new Set([...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA])], "Which cited Hanford or NNSA packet first clears identity, unit, method, period, authority, acceptance, and closure review?"],
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
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57m-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57M source-schema adapters and packet review");
    value.dependency_stack.push({
      stage: "Phase 57M source-schema adapters and packet review",
      current_state: "Sixty adapters, eighteen non-evidence fixtures, nine six-outcome decision tables, zero evaluated packets, zero accepted records, and nine preserved holds.",
      boundary: "Adapter vocabularies and rehearsal fixtures are workflow infrastructure, not evidence or a publication decision.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57M prohibits semantic label coercion, invented or transformed values, cross-record packet assembly, fixture promotion, automatic acceptance, trigger firing, closure, publication, ranking, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["One cited source-explicit candidate packet that satisfies a Phase 57M adapter and receives a bounded named human-review decision."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57M makes nine evidence-intake workflows executable through non-coercive adapters, non-evidence fixtures, and bounded human-review tables while preserving every operating-outcome hold.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57m-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57m-adapter-packet-review");
  value.links = value.links.filter((link) => link.from !== "node-phase57m-adapter-packet-review");
  value.nodes.push({ id: "node-phase57m-adapter-packet-review", label: "Sixty adapters; eighteen fixtures; fifty-four review rows; zero accepted packets", node_type: "Signal", note: "Workflow controls become executable without treating labels, fixtures, or rehearsals as evidence." });
  value.links.push(
    { from: "node-phase57m-adapter-packet-review", to: "node-phase57l-contract-field-intake", relationship: "Depends On", confidence: "Supported", note: "Phase 57M implements the sixty fields and nine queues defined in Phase 57L." },
    { from: "node-phase57m-adapter-packet-review", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "One cited packet must preserve exact identity, schema, definition, unit, period, privacy, and authority boundaries." },
    { from: "node-phase57m-adapter-packet-review", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Adapters and rehearsals do not establish operating outcomes, eligibility, closure, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Sixty Phase 57M schema adapters, eighteen packet fixtures, nine six-outcome human-review tables, fifty-four rehearsal rows, and nine preserved holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["One complete cited packet that passes exact adapter matching and receives a named human-review decision without changing identity, period, denominator, privacy, authority, acceptance, capability, implementation, or closure attribution."]);
});

console.log(`Generated Phase 57M: ${published.length} Published controls, ${held.length} In Review holds, ${carriedSourceIds.length} carried Tier 1 sources, sixty adapters, eighteen fixtures, nine decision tables, and Research Watch 043.`);
