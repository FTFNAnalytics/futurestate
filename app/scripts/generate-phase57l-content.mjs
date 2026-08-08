import "./generate-phase57k-content.mjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-08";
const collectionSlug = "contract-field-coverage-first-eligible-record-intake-exception-playbooks-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-042-contract-field-coverage-intake-playbooks";
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

const phase57k = JSON.parse(await readFile(join(dataRoot, "phase-57k-cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry.json"), "utf8"));
const reopeningRegistry = JSON.parse(await readFile(join(dataRoot, "phase-57k-reopening-trigger-registry.json"), "utf8"));
if (phase57k.phase !== "57K" || phase57k.records.length !== 29 || reopeningRegistry.contracts.length !== 9) {
  throw new Error("Phase 57L requires the complete Phase 57K release and all nine reopening contracts.");
}

const authorityBoundary = "Agency assertions, independent oversight, FTFN control classifications, acceptance, implementation, capability, closure, and operating outcomes remain separate evidence states.";
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

const classificationPlan = {
  "REOPEN-AMTRAK-PIDS": {
    present: [],
    absent: ["official_station_code", "closeout_state", "acceptance_authority"],
    incompatible: ["asset_id"],
    period_mismatched: ["reporting_period"],
  },
  "REOPEN-AMTRAK-RELIABILITY": {
    present: ["source_authority"],
    absent: ["official_station_code", "measure_definition", "numerator", "denominator"],
    incompatible: ["asset_id"],
    period_mismatched: ["reporting_period"],
  },
  "REOPEN-LA-NEXTLINK-ADOPTION": {
    present: ["award_id", "cohort_denominator"],
    absent: ["active_subscriber_measure", "state_disposition"],
    period_mismatched: ["reporting_period"],
    privacy_gated: ["privacy_review"],
  },
  "REOPEN-LA-STARLINK-ADOPTION": {
    present: ["award_id", "cohort_denominator"],
    absent: ["active_subscriber_measure", "state_disposition"],
    period_mismatched: ["reporting_period"],
    privacy_gated: ["privacy_review"],
  },
  "REOPEN-MT-BEAD-QUARTER": {
    present: ["project_id", "reporting_rail"],
    absent: ["reporting_period", "field_definition_version", "state_disposition"],
    incompatible: ["source_schema_id"],
    privacy_gated: ["privacy_review"],
  },
  "REOPEN-HANFORD-MASS-BALANCE": {
    present: ["from_stage", "to_stage", "method"],
    absent: ["stable_batch_id", "stable_container_id", "transfer_date", "receipt_date", "quality_state", "acceptance_state", "disposition_state"],
    incompatible: ["measure", "unit"],
  },
  "REOPEN-NNSA-QUALIFIED-RATE": {
    present: ["site_id"],
    absent: ["qualified_units", "accepted_units", "rate_denominator"],
    authority_mismatched: ["acceptance_authority"],
    period_mismatched: ["reporting_period"],
  },
  "REOPEN-NNSA-ACCEPTED-CAPACITY": {
    present: ["site_id"],
    absent: ["installed_capacity", "qualified_capacity", "accepted_capacity"],
    authority_mismatched: ["acceptance_authority"],
    period_mismatched: ["reporting_period"],
  },
  "REOPEN-NNSA-GAO-BASELINE": {
    present: ["recommendation_id", "gao_status", "gao_status_date"],
    absent: ["agency_evidence_date"],
    not_yet_evaluated: ["agency_evidence_scope"],
  },
};

const coverageBasis = {
  present: "The inherited official source explicitly supplies this field, but a present field cannot be carried into a different candidate record.",
  absent: "The inherited public evidence does not supply this required field in the same contract-eligible record.",
  incompatible: "A related field exists, but its identity, schema, definition, measure, unit, or join role is incompatible with this contract.",
  authority_mismatched: "A related statement exists under a different authority and cannot satisfy the named acceptance or closure authority.",
  period_mismatched: "A related value exists outside the completed reporting period required by this contract.",
  privacy_gated: "The field requires an explicit privacy-safe public disposition before it can enter the intake record.",
  not_yet_evaluated: "No contract-eligible evidence package exists against which this field can yet be evaluated.",
};
const resolutionAction = {
  present: (field) => `Revalidate ${field} inside the same candidate record and preserve its exact identity, period, definition, and authority.`,
  absent: (field) => `Require an explicit ${field} value in the same official candidate record; keep the field null until it is supplied.`,
  incompatible: (field) => `Require a contract-compatible ${field} definition and prohibit coercion, aliasing, or cross-record migration.`,
  authority_mismatched: (field) => `Obtain ${field} from the named acceptance or closure authority and retain the current source as a separate evidence layer.`,
  period_mismatched: (field) => `Obtain ${field} for the same completed reporting period as every other required field.`,
  privacy_gated: (field) => `Require a public privacy review or suppression-safe aggregate that explicitly clears ${field} for publication.`,
  not_yet_evaluated: (field) => `Evaluate ${field} only when one complete candidate evidence package enters the intake queue.`,
};

const envelopes = {
  "REOPEN-AMTRAK-PIDS": {
    candidate_record_type: "Code-bearing official current asset register or closeout table",
    source_authority: "Amtrak or the named acceptance authority",
    identity_scope: "One official station code and one asset identifier in the same record",
    period_scope: "One explicit reporting or closeout period",
    privacy_boundary: "Public asset-level fields only",
    acceptance_boundary: "Closeout state and acceptance authority must be explicit",
    disqualifiers: ["Name-only station list", "Historical identifier without a current official crosswalk", "Closeout statement without acceptance authority"],
  },
  "REOPEN-AMTRAK-RELIABILITY": {
    candidate_record_type: "Named-asset-period reliability table",
    source_authority: "Amtrak or the official operating-data authority",
    identity_scope: "One official station code and asset identifier",
    period_scope: "One completed reporting period shared by numerator and denominator",
    privacy_boundary: "Public asset-level measure",
    acceptance_boundary: "Source authority and measure definition must be explicit",
    disqualifiers: ["Systemwide rate without named asset", "Percentage without numerator and denominator", "Mixed reporting periods"],
  },
  "REOPEN-LA-NEXTLINK-ADOPTION": {
    candidate_record_type: "Privacy-safe official completed-period adoption table",
    source_authority: "Louisiana broadband authority or accepted federal reporting rail",
    identity_scope: "Nextlink award and the fixed 104-location cohort",
    period_scope: "One completed adoption reporting period",
    privacy_boundary: "Suppression-safe cohort aggregate with explicit privacy review",
    acceptance_boundary: "State disposition must identify the record as accepted, revised, or rejected",
    disqualifiers: ["Award announcement", "Passings or availability without active subscribers", "Unsuppressed household-level data"],
  },
  "REOPEN-LA-STARLINK-ADOPTION": {
    candidate_record_type: "Privacy-safe official completed-period LEO adoption table",
    source_authority: "Louisiana broadband authority or accepted federal reporting rail",
    identity_scope: "Starlink award and the fixed 10,635-location LEO cohort",
    period_scope: "One completed adoption reporting period",
    privacy_boundary: "Suppression-safe cohort aggregate with explicit privacy review",
    acceptance_boundary: "State disposition must identify the record as accepted, revised, or rejected",
    disqualifiers: ["Award announcement", "LEO availability estimate without active subscribers", "Cross-rail terrestrial substitution"],
  },
  "REOPEN-MT-BEAD-QUARTER": {
    candidate_record_type: "Completed public project-quarter table",
    source_authority: "Montana broadband authority under the accepted reporting rail",
    identity_scope: "One project identifier and its declared terrestrial or LEO rail",
    period_scope: "One completed project quarter",
    privacy_boundary: "Public fields cleared by the named privacy review",
    acceptance_boundary: "Schema, definition version, privacy review, and state disposition must align",
    disqualifiers: ["Award schema presented as a quarterly schema", "Incomplete quarter", "Mixed terrestrial and LEO field definitions"],
  },
  "REOPEN-HANFORD-MASS-BALANCE": {
    candidate_record_type: "Stable-identity transfer, receipt, and disposition evidence chain",
    source_authority: "DOE Hanford source records with named quality and acceptance state",
    identity_scope: "One stable batch and container identity across every linked stage",
    period_scope: "Dated transfer and receipt events",
    privacy_boundary: "Public operational evidence only",
    acceptance_boundary: "Compatible method, measure, unit, quality, acceptance, and disposition are required",
    disqualifiers: ["Cumulative plant total", "Container count without lineage", "Stage adjacency without transfer and receipt evidence"],
  },
  "REOPEN-NNSA-QUALIFIED-RATE": {
    candidate_record_type: "Official site-period recurring qualified-output table",
    source_authority: "NNSA plus the named acceptance authority",
    identity_scope: "One production site",
    period_scope: "One recurring operating period",
    privacy_boundary: "Public site-period aggregate",
    acceptance_boundary: "Qualified units, accepted units, denominator, and acceptance authority must align",
    disqualifiers: ["First unit milestone", "Planned annual rate", "Enterprise aggregate without site identity"],
  },
  "REOPEN-NNSA-ACCEPTED-CAPACITY": {
    candidate_record_type: "Official site-period installed, qualified, and accepted capacity table",
    source_authority: "NNSA plus the named acceptance authority",
    identity_scope: "One production site",
    period_scope: "One explicit operating period",
    privacy_boundary: "Public site-period capacity aggregate",
    acceptance_boundary: "Installed, qualified, and accepted capacity must remain distinct",
    disqualifiers: ["Environmental planning envelope", "Installed equipment without qualification", "Planned capacity without acceptance"],
  },
  "REOPEN-NNSA-GAO-BASELINE": {
    candidate_record_type: "GAO recommendation-status record with responsive agency evidence",
    source_authority: "GAO for closure; NNSA only for responsive agency evidence",
    identity_scope: "The exact GAO-23-104661 enterprise-baseline recommendation",
    period_scope: "Dated agency evidence and dated GAO status",
    privacy_boundary: "Public recommendation and responsive evidence summary",
    acceptance_boundary: "Only GAO can establish Closed status",
    disqualifiers: ["Agency self-assessment of closure", "Different recommendation identifier", "GAO status without the responsive evidence scope"],
  },
};

const contracts = reopeningRegistry.contracts;
const contractById = new Map(contracts.map((contract) => [contract.contract_id, contract]));
const coverageRows = [];
for (const contract of contracts) {
  const plan = classificationPlan[contract.contract_id];
  if (!plan) throw new Error(`Missing Phase 57L classification plan for ${contract.contract_id}`);
  const fieldToState = new Map();
  for (const [state, fields] of Object.entries(plan)) {
    for (const field of fields) {
      if (fieldToState.has(field)) throw new Error(`Duplicate field classification for ${contract.contract_id}|${field}`);
      fieldToState.set(field, state);
    }
  }
  for (const field of contract.required_fields) {
    const state = fieldToState.get(field);
    if (!state) throw new Error(`Unclassified field ${contract.contract_id}|${field}`);
    coverageRows.push({
      coverage_id: `${contract.contract_id}|${field}`,
      contract_id: contract.contract_id,
      evidence_rail: contract.evidence_rail,
      phase57k_hold_key: contract.phase57k_hold_key,
      field_name: field,
      coverage_state: state,
      coverage_basis: coverageBasis[state],
      candidate_value: null,
      value_publication_allowed: false,
      partial_match_can_fire_trigger: false,
      human_review_required: true,
    });
  }
  if (fieldToState.size !== contract.required_fields.length) {
    throw new Error(`Phase 57L classification plan has extra fields for ${contract.contract_id}`);
  }
}
if (coverageRows.length !== 60 || new Set(coverageRows.map((row) => row.coverage_id)).size !== 60) {
  throw new Error("Phase 57L must classify sixty unique contract fields.");
}

const coverageByContract = contracts.map((contract) => {
  const rows = coverageRows.filter((row) => row.contract_id === contract.contract_id);
  const counts = countBy(rows, "coverage_state");
  return {
    contract_id: contract.contract_id,
    evidence_rail: contract.evidence_rail,
    phase57k_hold_key: contract.phase57k_hold_key,
    required_field_count: contract.required_field_count,
    coverage_counts: counts,
    present_field_count: counts.present ?? 0,
    blocking_field_count: rows.filter((row) => row.coverage_state !== "present").length,
    complete_contract_coverage: rows.every((row) => row.coverage_state === "present"),
    trigger_state: "not_fired",
  };
});
const coverageMatrix = {
  phase: "57L",
  captured_date: capturedDate,
  matrix_type: "Contract-field coverage matrix",
  contract_count: contracts.length,
  required_field_count: coverageRows.length,
  coverage_state_counts: countBy(coverageRows, "coverage_state"),
  present_field_count: coverageRows.filter((row) => row.coverage_state === "present").length,
  blocking_field_count: coverageRows.filter((row) => row.coverage_state !== "present").length,
  fully_covered_contracts: coverageByContract.filter((row) => row.complete_contract_coverage).length,
  allowed_states: ["present", "absent", "incompatible", "authority_mismatched", "period_mismatched", "privacy_gated", "not_yet_evaluated"],
  scoring_prohibited: true,
  review_rule: "Coverage states describe whether one inherited evidence position satisfies one named field. Counts are not a readiness score, partial coverage cannot fire a trigger, and present fields cannot be carried into a different candidate record.",
  contracts: coverageByContract,
  fields: coverageRows,
};
await writeJson(join(dataRoot, "phase-57l-contract-field-coverage-matrix.json"), coverageMatrix);

const intakeQueue = contracts.map((contract, index) => {
  const coverage = coverageByContract.find((row) => row.contract_id === contract.contract_id);
  const envelope = envelopes[contract.contract_id];
  return {
    queue_id: `INTAKE-${String(index + 1).padStart(2, "0")}-${contract.contract_id}`,
    intake_sequence: index + 1,
    sequence_is_priority_or_readiness: false,
    contract_id: contract.contract_id,
    evidence_rail: contract.evidence_rail,
    phase57k_hold_key: contract.phase57k_hold_key,
    candidate_record_type: envelope.candidate_record_type,
    eligible_source_authority: envelope.source_authority,
    identity_scope: envelope.identity_scope,
    period_scope: envelope.period_scope,
    privacy_boundary: envelope.privacy_boundary,
    acceptance_boundary: envelope.acceptance_boundary,
    disqualifiers: envelope.disqualifiers,
    required_fields: contract.required_fields,
    present_field_count: coverage.present_field_count,
    blocking_field_count: coverage.blocking_field_count,
    first_eligible_condition: "One official candidate record or source-explicit evidence package supplies every required field under the same identity, period, definition, privacy, and authority boundaries.",
    candidate_record_state: "no_complete_eligible_record_accepted",
    partial_match_state: "retained_as_non_triggering_evidence",
    trigger_state: "not_fired",
    automated_publication_allowed: false,
    human_review_required: true,
  };
});
const intakeRegistry = {
  phase: "57L",
  captured_date: capturedDate,
  queue_type: "First-eligible-record intake queue",
  queue_count: intakeQueue.length,
  candidate_records_accepted: 0,
  eligible_records_accepted: 0,
  partial_matches_retained: intakeQueue.length,
  triggers_fired: 0,
  automated_publication_allowed: false,
  ordering_rule: "Sequence preserves the inherited contract order for auditability; it is not a priority, score, likelihood, or readiness ranking.",
  queues: intakeQueue,
};
await writeJson(join(dataRoot, "phase-57l-first-eligible-record-intake-queue.json"), intakeRegistry);

const playbooks = contracts.map((contract) => {
  const actions = coverageRows.filter((row) => row.contract_id === contract.contract_id).map((row, index) => ({
    action_id: `${contract.contract_id}-ACTION-${String(index + 1).padStart(2, "0")}`,
    field_name: row.field_name,
    current_coverage_state: row.coverage_state,
    reviewer_action: resolutionAction[row.coverage_state](row.field_name),
    evidence_needed: envelopes[contract.contract_id].candidate_record_type,
    close_field_automatically: false,
    carry_value_from_other_record: false,
    human_review_required: true,
  }));
  return {
    playbook_id: `PLAYBOOK-${contract.contract_id}`,
    contract_id: contract.contract_id,
    evidence_rail: contract.evidence_rail,
    phase57k_hold_key: contract.phase57k_hold_key,
    exception_count: actions.filter((action) => action.current_coverage_state !== "present").length,
    field_action_count: actions.length,
    candidate_record_type: envelopes[contract.contract_id].candidate_record_type,
    intake_decision: "keep_hold_in_review",
    trigger_state: "not_fired",
    escalation_rule: "Escalate to human publication review only after one candidate package clears every field; retain agency and independent authority as separate evidence layers.",
    actions,
  };
});
const playbookRegistry = {
  phase: "57L",
  captured_date: capturedDate,
  registry_type: "Contract exception-resolution playbooks",
  playbook_count: playbooks.length,
  field_action_count: playbooks.reduce((sum, playbook) => sum + playbook.field_action_count, 0),
  unresolved_exception_count: playbooks.reduce((sum, playbook) => sum + playbook.exception_count, 0),
  automated_closure_actions: 0,
  human_review_required: true,
  playbooks,
};
await writeJson(join(dataRoot, "phase-57l-exception-resolution-playbooks.json"), playbookRegistry);

const railContractIds = {
  Amtrak: contracts.filter((contract) => contract.evidence_rail === "Amtrak").map((contract) => contract.contract_id),
  Broadband: contracts.filter((contract) => contract.evidence_rail === "Broadband").map((contract) => contract.contract_id),
  Hanford: contracts.filter((contract) => contract.evidence_rail === "Hanford").map((contract) => contract.contract_id),
  NNSA: contracts.filter((contract) => contract.evidence_rail === "NNSA").map((contract) => contract.contract_id),
};
const rowsForRail = (rail) => coverageRows.filter((row) => row.evidence_rail === rail);
const railSummary = (rail) => {
  const rows = rowsForRail(rail);
  return {
    contracts: railContractIds[rail].length,
    fields: rows.length,
    counts: countBy(rows, "coverage_state"),
    present: rows.filter((row) => row.coverage_state === "present").length,
    blockers: rows.filter((row) => row.coverage_state !== "present").length,
    queues: intakeQueue.filter((entry) => entry.evidence_rail === rail).length,
    actions: playbooks.filter((entry) => entry.evidence_rail === rail).reduce((sum, entry) => sum + entry.field_action_count, 0),
  };
};
const summaries = Object.fromEntries(Object.keys(railContractIds).map((rail) => [rail, railSummary(rail)]));

const phase57kHolds = phase57k.records.filter((record) => record.record_status === "In Review");
const holdByContract = new Map(phase57kHolds.map((record) => [record.reopening_contract_id, record]));
const sourcesForRail = (rail) => [...new Set(phase57k.records.filter((record) => {
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

const formatCounts = (counts) => Object.entries(counts).map(([state, count]) => `${count} ${state.replaceAll("_", " ")}`).join(", ");
const specs = [];
for (const rail of ["Amtrak", "Broadband", "Hanford", "NNSA"]) {
  const summary = summaries[rail];
  const slugRail = rail.toLowerCase();
  const registryPrefix = rail === "Broadband" ? "broadband" : slugRail;
  const sources = sourceIdsByRail[rail];
  specs.push(
    {
      slug: `${registryPrefix}-${summary.fields}-contract-fields-classified`,
      agency: agencyByRail[rail],
      actionKey: `${rail.toUpperCase()}-CONTRACT-FIELD-COVERAGE-2026-01`,
      stage: `${rail} contract-field operationalization`,
      sourceIds: sources,
      title: `${rail} classifies all ${summary.fields} required reopening-contract fields`,
      finding: `${summary.contracts} ${rail} contract${summary.contracts === 1 ? "" : "s"} contain ${summary.fields} required fields, each assigned exactly one explicit coverage state.`,
      denominator: `${summary.contracts} contracts and ${summary.fields} required fields.`,
      limits: ["Coverage is not readiness.", "A present field cannot be carried into another record.", "Partial coverage cannot fire a trigger."],
      next: "Evaluate only one complete source-explicit candidate package against the same field matrix.",
      registry: "phase-57l-contract-field-coverage-matrix.json",
    },
    {
      slug: `${registryPrefix}-coverage-state-distribution`,
      agency: agencyByRail[rail],
      actionKey: `${rail.toUpperCase()}-COVERAGE-STATE-DISTRIBUTION-2026-01`,
      stage: `${rail} contract-field operationalization`,
      sourceIds: sources,
      title: `${rail} retains ${summary.present} present fields and ${summary.blockers} explicit blockers`,
      finding: `The ${rail} matrix contains ${formatCounts(summary.counts)}; none of the counts is a readiness or likelihood score.`,
      denominator: `${summary.fields} required field classifications.`,
      limits: ["Missing does not mean nonexistent or withheld.", "Blocker counts are not performance measures.", "Authority and period mismatches remain separate."],
      next: "Resolve each field through its named playbook action without changing the denominator.",
      registry: "phase-57l-contract-field-coverage-matrix.json",
    },
    {
      slug: `${registryPrefix}-${summary.queues}-first-eligible-record-queues`,
      agency: agencyByRail[rail],
      actionKey: `${rail.toUpperCase()}-FIRST-ELIGIBLE-INTAKE-QUEUES-2026-01`,
      stage: `${rail} contract-field operationalization`,
      sourceIds: sources,
      title: `${rail} defines ${summary.queues} first-eligible-record intake queue${summary.queues === 1 ? "" : "s"}`,
      finding: `Each ${rail} contract now names its candidate record type, source authority, identity, period, privacy, acceptance boundaries, and disqualifiers.`,
      denominator: `${summary.queues} intake queues and zero accepted eligible records.`,
      limits: ["A queue definition is not evidence that a candidate exists.", "Sequence is not priority or readiness.", "Partial matches remain non-triggering."],
      next: "Admit only a source-explicit package that supplies every contract field under one compatible envelope.",
      registry: "phase-57l-first-eligible-record-intake-queue.json",
    },
    {
      slug: `${registryPrefix}-${summary.actions}-field-resolution-actions`,
      agency: agencyByRail[rail],
      actionKey: `${rail.toUpperCase()}-EXCEPTION-RESOLUTION-PLAYBOOKS-2026-01`,
      stage: `${rail} contract-field operationalization`,
      sourceIds: sources,
      title: `${rail} assigns one human-reviewed resolution action to every required field`,
      finding: `${summary.actions} field actions distinguish absent, incompatible, authority-mismatched, period-mismatched, privacy-gated, not-yet-evaluated, and present states without automated closure.`,
      denominator: `${summary.actions} field actions across ${summary.contracts} playbook${summary.contracts === 1 ? "" : "s"}.`,
      limits: ["No action closes a field automatically.", "Values cannot migrate across records.", "Human publication review remains mandatory."],
      next: "Apply the exact action only when a candidate record enters the corresponding queue.",
      registry: "phase-57l-exception-resolution-playbooks.json",
    },
    {
      slug: `${registryPrefix}-zero-eligible-records-or-trigger-events`,
      agency: agencyByRail[rail],
      actionKey: `${rail.toUpperCase()}-ZERO-ELIGIBLE-OR-TRIGGER-EVENTS-2026-01`,
      stage: `${rail} contract-field operationalization`,
      sourceIds: sources,
      title: `${rail} accepts zero eligible records and fires zero reopening triggers`,
      finding: `Field classification, queue construction, and exception playbooks improve auditability but do not supply a complete eligible record or change any held outcome.`,
      denominator: `${summary.contracts} contracts, ${summary.fields} fields, ${summary.queues} queues, and zero trigger events.`,
      limits: ["Operationalizing a contract is not satisfying it.", "No operating outcome is inferred.", "All inherited holds remain In Review."],
      next: "Keep every hold closed until all fields clear in one evidence package and human review approves publication.",
      registry: "phase-57l-first-eligible-record-intake-queue.json",
    },
  );
}

const nextHoldKeys = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-10": "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-11",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2026-09": "AMTRAK-NAMED-RELIABILITY-HOLD-2026-10",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-10": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-11",
  "LA-BEAD-STARLINK-HOLD-2026-10": "LA-BEAD-STARLINK-HOLD-2026-11",
  "MT-BEAD-QUARTERLY-HOLD-2026-10": "MT-BEAD-QUARTERLY-HOLD-2026-11",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-07": "HANFORD-WTP-MASS-BALANCE-HOLD-2026-08",
  "NNSA-PIT-RATE-HOLD-2026-10": "NNSA-PIT-RATE-HOLD-2026-11",
  "NNSA-PIT-PEIS-HOLD-2026-10": "NNSA-PIT-PEIS-HOLD-2026-11",
  "NNSA-PIT-GAO-BASELINE-HOLD-2026-11": "NNSA-PIT-GAO-BASELINE-HOLD-2026-12",
};
const heldSpecs = contracts.map((contract) => {
  const prior = holdByContract.get(contract.contract_id);
  const coverage = coverageByContract.find((row) => row.contract_id === contract.contract_id);
  if (!prior || !nextHoldKeys[contract.phase57k_hold_key]) throw new Error(`Missing Phase 57L hold lineage for ${contract.contract_id}`);
  return {
    slug: `preserved-${contract.contract_id.toLowerCase().replace(/^reopen-/, "").replaceAll("_", "-")}`,
    agency: agencyByRail[contract.evidence_rail],
    actionKey: nextHoldKeys[contract.phase57k_hold_key],
    parentHoldKey: contract.phase57k_hold_key,
    reopeningContractId: contract.contract_id,
    stage: "Contract-field coverage hold",
    sourceIds: prior.supporting_source_ids,
    title: `${contractLabel[contract.contract_id]} remains In Review after field-level intake review`,
    finding: `${coverage.present_field_count} of ${coverage.required_field_count} required fields are present in inherited evidence positions; ${coverage.blocking_field_count} fields remain blocked and no complete candidate record is accepted.`,
    denominator: `One inherited hold, one reopening contract, ${coverage.required_field_count} fields, ${coverage.blocking_field_count} blockers, and zero trigger events.`,
    limits: ["Partial field coverage is non-triggering.", "Present fields cannot be assembled across incompatible records.", "Human publication review remains mandatory."],
    next: envelopes[contract.contract_id].candidate_record_type,
    registry: "phase-57l-contract-field-coverage-matrix.json",
  };
});

const allSpecs = [...specs, ...heldSpecs];
if (specs.length !== 20 || heldSpecs.length !== 9 || allSpecs.length !== 29) {
  throw new Error("Phase 57L must contain twenty Published controls and nine held records.");
}

const sourceById = new Map();
for (const id of [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const records = allSpecs.map((spec, index) => ({
  record_id: `record-57l-${spec.slug}`,
  document_id: `research-doc-57l-${spec.slug}`,
  signal_id: `signal-57l-${spec.slug}`,
  document_number: 873 + index,
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

const phase57lLedger = {
  phase: "57L",
  captured_date: capturedDate,
  goal: "Operationalize all nine reopening contracts at field level without scoring readiness, assuming a source exists, or treating partial coverage as evidence that a trigger fired.",
  publication_rule: "Publish only field-coverage, intake-control, and exception-resolution records; preserve all nine outcome holds until one complete eligible evidence package clears every field and human review approves publication.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length,
  records_published: published.length,
  records_held: held.length,
  evidence_stage_counts: countBy(records, "evidence_stage"),
  new_official_source_profiles: 0,
  carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57l-contract-field-coverage-matrix.json", contracts: 9, fields: 60, present: 15, blockers: 45 },
    { file: "phase-57l-first-eligible-record-intake-queue.json", queues: 9, eligible_records: 0, triggers_fired: 0 },
    { file: "phase-57l-exception-resolution-playbooks.json", playbooks: 9, field_actions: 60, automated_closures: 0 },
  ],
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  eligible_records_accepted: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57k.post_batch_visible_scope,
  post_batch_visible_scope: phase57k.post_batch_visible_scope,
  post_batch_closure_counts: phase57k.post_batch_closure_counts,
  preserved_phase57k_holds: phase57kHolds.map((record) => record.action_key),
  reopening_contract_ids: contracts.map((contract) => contract.contract_id),
  new_visible_holds: [],
  records,
};
await writeJson(join(dataRoot, "phase-57l-contract-field-coverage-intake-queues-exception-playbooks.json"), phase57lLedger);
await writeJson(join(dataRoot, "phase-57l-publication-review.json"), {
  phase: "57L",
  captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id),
  promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id),
  held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  exact_target_artifacts_acquired: 0,
  eligible_records_accepted: 0,
  decision: "Twenty field-coverage, intake-queue, and exception-resolution controls publish. Nine inherited holds remain In Review; partial coverage is non-triggering, no complete eligible record is accepted, and no contact, scope, implementation, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 872).padStart(2, "0")}-${record.record_id.replace(/^record-57l-/, "")}.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57l-${record.record_id.replace(/^record-57l-/, "")}.json`), {
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
      ? "The record turns a reopening contract into a field-explicit intake control without creating a readiness score or implying that a candidate record exists."
      : "The hold remains actionable while partial matches, present fields, and queue definitions stay separate from a fired trigger.",
    ftfn_relevance: ["Classifies all sixty Phase 57K contract fields.", "Defines the first record eligible for human review on every held rail.", "Assigns one explicit resolution action to each field while preventing cross-record value assembly."],
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
    yamlList("dependencies", ["one complete source-explicit candidate evidence package", "field-compatible identity, period, definition, privacy, and authority", "human publication review after every contract field clears"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]),
    yamlList("receiving_systems", ["Phase 57L contract-field matrices, intake queues, and exception playbooks"]),
    yamlList("local_implications", ["Do not convert field coverage, a queue position, or a resolution action into readiness or a fired trigger."]),
    yamlList("evidence_gap_ids", meta.gaps),
    "claim_scope: \"Specific Source Update\"",
    "local_evidence_level: \"General Source Layer\"",
    `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57L field-coverage control contract." : `Held under ${record.reopening_contract_id}; partial coverage is non-triggering.`)}`,
    "---",
    "",
    "## Phase 57L contract operationalization",
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
    "Eligible records accepted: **Zero**. Trigger events recorded: **Zero**. FTFN submitted no agency contact or FOIA request.",
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
  title: "Contract-Field Coverage, First-Eligible-Record Intake, and Exception Playbooks, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57L classifies all sixty required fields across nine reopening contracts, defines nine first-eligible-record queues, and assigns sixty human-reviewed resolution actions while preserving every inherited outcome hold.",
  scope: "Twelve Amtrak fields, nineteen broadband fields, twelve Hanford fields, and seventeen NNSA fields; nine source-specific intake queues; nine playbooks and sixty field actions; zero accepted eligible records and zero fired triggers.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirty-two-file archive contains twenty-nine official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Coverage states are not readiness scores. A present field cannot be carried across records, a first-eligible-record definition is not evidence that a candidate exists, and partial coverage cannot fire a trigger. Identity, period, schema, definition, privacy, method, unit, authority, acceptance, custody, implementation, capability, and closure remain distinct.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---",
  `id: ${JSON.stringify(briefingId)}`,
  "title: \"Research Watch 042: Contract-Field Coverage and First-Eligible Intake\"",
  "slug: \"research-watch-042-contract-field-coverage-intake-playbooks\"",
  "record_status: \"Published\"",
  "summary: \"Phase 57L classifies sixty contract fields, builds nine first-eligible-record queues, and assigns sixty exception-resolution actions without scoring readiness or firing a trigger.\"",
  `published_date: ${capturedDate}`,
  `captured_date: ${capturedDate}`,
  yamlList("signal_ids", signalIds),
  yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"",
  "local_evidence_level: \"General Source Layer\"",
  `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "All sixty required fields receive exactly one explicit coverage state: fifteen present and forty-five blocked.",
    "Nine source-specific intake queues define the first record eligible for full human review, while accepting zero candidate records.",
    "Nine exception playbooks assign sixty field actions and prohibit automated closure or cross-record value assembly.",
    "All nine inherited holds remain In Review; no reopening trigger, operating outcome, implementation, capability, or closure state changes.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["One complete Amtrak asset-period record", "Privacy-safe completed broadband reporting tables", "Stable Hanford identity and custody evidence", "Exact NNSA site-period output, accepted capacity, and GAO closure packages"]),
  "---",
  "",
  "## What Phase 57L adds",
  "",
  "Every reopening contract is now operational at field level. The matrices distinguish present evidence from absent, incompatible, authority-mismatched, period-mismatched, privacy-gated, and not-yet-evaluated fields; the queues and playbooks name the first complete record and exact reviewer action needed next.",
  "",
  "## What did not move",
  "",
  "Zero complete eligible records are accepted and zero reopening triggers fire. Every partial match remains non-triggering, every hold remains In Review, and no operating outcome or closure state changes.",
  "",
  "## Evidence boundary",
  "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57L records no agency contact, FOIA request, directive-scope change, implementation change, or closure change.",
  "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-042-contract-field-coverage-intake-playbooks.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-08-phase-57l-contract-field-coverage-intake-playbooks.json"), {
  id: "update-2026-08-08-phase-57l-contract-field-coverage-intake-playbooks",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 57L classifies sixty reopening-contract fields and builds nine intake queues",
  summary: "Thirty-six carried Tier 1 sources support twenty Published field-coverage controls, nine preserved holds, nine first-eligible-record queues, and sixty human-reviewed resolution actions.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-042-contract-field-coverage-intake-playbooks/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Field coverage, intake sequence, and exception resolution remain separate from readiness, operating outcomes, and fired triggers.",
  work_package: "docs/work-packages/phase-57l-contract-field-coverage-intake-queues-exception-playbooks.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8"));
  mutate(value);
  await writeJson(path, value);
};
const allSourceIds = carriedSourceIds;
for (const [file, selected, question] of [
  ["finance-and-risk.json", allSourceIds, "Which Phase 57L queue first receives one complete evidence package with all required fields under one denominator and authority?"],
  ["policy-and-standards.json", allSourceIds, "Which field-level exception first clears without cross-record assembly or authority substitution?"],
  ["mobility.json", sourceIdsByRail.Amtrak, "Which official Amtrak record first clears every Phase 57L asset, period, measure, closeout, and acceptance field?"],
  ["chips-and-compute.json", sourceIdsByRail.Broadband, "Which privacy-safe completed broadband table first clears every project, cohort, period, schema, definition, and disposition field?"],
  ["energy.json", [...new Set([...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA])], "Which Hanford or NNSA evidence package first clears every identity, period, method, unit, acceptance, output, capacity, or closure field?"],
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
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57l-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57L contract-field coverage and first-eligible intake");
    value.dependency_stack.push({
      stage: "Phase 57L contract-field coverage and first-eligible intake",
      current_state: "Sixty classified fields, nine intake queues, nine playbooks, sixty actions, zero accepted eligible records, and nine preserved holds.",
      boundary: "Coverage is not readiness, a queue definition is not a candidate record, and partial matches cannot fire a trigger.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57L prohibits cross-record field assembly, readiness scoring, priority inference, schema coercion, privacy-detail exposure, authority substitution, automatic closure or publication, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["One source-explicit candidate package that satisfies every field in a named Phase 57L intake envelope and passes human publication review."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57L operationalizes all nine reopening contracts at field level while accepting zero complete eligible records and preserving every operating-outcome hold.";
  value.source_ids = appendUnique(value.source_ids, allSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57l-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57l-contract-field-intake");
  value.links = value.links.filter((link) => link.from !== "node-phase57l-contract-field-intake");
  value.nodes.push({ id: "node-phase57l-contract-field-intake", label: "Sixty fields; nine intake queues; sixty playbook actions; zero eligible records", node_type: "Signal", note: "Contracts become field-operational without creating readiness scores or firing triggers." });
  value.links.push(
    { from: "node-phase57l-contract-field-intake", to: "node-phase57k-transition-matrices", relationship: "Depends On", confidence: "Supported", note: "Phase 57L operationalizes the nine Phase 57K reopening contracts." },
    { from: "node-phase57l-contract-field-intake", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "All fields must align inside one identity, period, schema, privacy, and authority envelope." },
    { from: "node-phase57l-contract-field-intake", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Partial coverage and queue definitions do not establish operating outcomes or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Sixty Phase 57L field classifications, nine first-eligible-record queues, nine exception playbooks, sixty field actions, and nine preserved holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["One complete contract-eligible evidence package that clears every field without changing identity, period, denominator, privacy, authority, acceptance, capability, implementation, or closure attribution."]);
});

console.log(`Generated Phase 57L: ${published.length} Published controls, ${held.length} In Review holds, ${carriedSourceIds.length} carried Tier 1 sources, sixty field classifications, nine intake queues, nine playbooks, and Research Watch 042.`);
