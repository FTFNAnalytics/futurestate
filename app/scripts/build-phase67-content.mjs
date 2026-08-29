import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const today = "2026-08-12";

const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const unique = (values) => [...new Set(values)];
const yamlList = (values) => values.map((value) => `  - "${value}"`).join("\n");

const phase60 = await readJson(dataRoot, "phase-60-operating-cycle.json");
const phase61 = await readJson(dataRoot, "phase-61-project-conversion-registry.json");
const phase62 = await readJson(dataRoot, "phase-62-conversion-event-ledgers.json");
const phase63 = await readJson(dataRoot, "phase-63-conversion-gate-calendar.json");
const phase66 = await readJson(dataRoot, "phase-66-acceptance-repeat-operation-ledger.json");

const fileMetadata = new Map([
  ["61-PROJECT-TSMC-ARIZONA", {
    sequence: 1,
    short_name: "TSMC Arizona",
    slug: "tsmc-arizona",
    playbook_id: "briefing-qualification-playbook-001-tsmc-arizona",
    playbook_slug: "qualification-playbook-001-tsmc-arizona",
    recognized_authorities: ["City of Phoenix", "Serving electric or water utility", "Named facility inspector or regulator", "TSMC or a named customer"],
    entity_scope: "The named TSMC Arizona facility or campus component identified by the artifact; evidence from Intel, ASML, suppliers, or regional programs does not transfer.",
    geography: "Phoenix, Arizona",
    primary_topic: "Chips and Compute"
  }],
  ["61-PROJECT-TORONTO-24-254930", {
    sequence: 2,
    short_name: "Toronto 24 254930",
    slug: "toronto-24-254930",
    playbook_id: "briefing-qualification-playbook-002-toronto-24-254930",
    playbook_slug: "qualification-playbook-002-toronto-24-254930",
    recognized_authorities: ["City of Toronto clerk or planning authority", "City building or permitting authority", "Named condition-acceptance authority"],
    entity_scope: "Application 24 254930 at Victoria Park Avenue and Thora Avenue; citywide pipelines, permits, starts, completions, and occupancy totals remain context only.",
    geography: "Toronto, Ontario",
    primary_topic: "Finance and Risk"
  }],
  ["61-PROJECT-NOVA-LARGE-LOAD", {
    sequence: 3,
    short_name: "Northern Virginia large load",
    slug: "northern-virginia-large-load",
    playbook_id: "briefing-qualification-playbook-003-northern-virginia-large-load",
    playbook_slug: "qualification-playbook-003-northern-virginia-large-load",
    recognized_authorities: ["Virginia State Corporation Commission", "Dominion Energy", "Named county land-use authority", "Named GS-5 customer or receiving system"],
    entity_scope: "The Golden-Mars transmission project, Dominion GS-5 receiving class, or an explicitly joined named customer; regional forecasts and unrelated projects do not transfer.",
    geography: "Northern Virginia",
    primary_topic: "Energy"
  }],
  ["61-PROJECT-SPACE-COAST-AUTHORITY", {
    sequence: 4,
    short_name: "Space Coast authority stack",
    slug: "space-coast-authority",
    playbook_id: "briefing-qualification-playbook-004-space-coast-authority",
    playbook_slug: "qualification-playbook-004-space-coast-authority",
    recognized_authorities: ["Federal Aviation Administration", "Space Florida", "NASA or Kennedy Space Center", "Named licensed operator or accepting authority"],
    entity_scope: "The Shuttle Landing Facility, LC-39A, or SLC-40 component named by the artifact; authority for one site does not establish operation at another.",
    geography: "Florida Space Coast",
    primary_topic: "Space"
  }],
  ["61-PROJECT-NEVADA-LITHIUM", {
    sequence: 5,
    short_name: "Nevada lithium",
    slug: "nevada-lithium",
    playbook_id: "briefing-qualification-playbook-005-nevada-lithium",
    playbook_slug: "qualification-playbook-005-nevada-lithium",
    recognized_authorities: ["Bureau of Land Management", "Nevada environmental regulator", "Department of Energy or named lender", "Named operator, qualifier, or customer"],
    entity_scope: "Thacker Pass or Rhyolite Ridge as explicitly identified; a permit, financing record, reserve estimate, or result from the other project does not transfer.",
    geography: "Nevada",
    primary_topic: "Critical Minerals"
  }],
  ["61-ADOPTION-GSA-PQC", {
    sequence: 6,
    short_name: "GSA post-quantum acquisition",
    slug: "gsa-pqc",
    playbook_id: "briefing-qualification-playbook-006-gsa-pqc",
    playbook_slug: "qualification-playbook-006-gsa-pqc",
    recognized_authorities: ["General Services Administration", "Named federal procuring agency", "Named system owner or authorizing official", "Named receiving program"],
    entity_scope: "A named federal agency, system, procurement, migration, or retirement action using the GSA channel; standards and buyer guidance alone remain upstream.",
    geography: "United States federal government",
    primary_topic: "Cybersecurity"
  }],
  ["61-ADOPTION-NIST-ARIA", {
    sequence: 7,
    short_name: "NIST ARIA",
    slug: "nist-aria",
    playbook_id: "briefing-qualification-playbook-007-nist-aria",
    playbook_slug: "qualification-playbook-007-nist-aria",
    recognized_authorities: ["National Institute of Standards and Technology", "Named participating institution", "Named system authorizing or oversight authority", "Independent evaluator identified by the program"],
    entity_scope: "The NIST ARIA pilot or a named participating system explicitly tied to the evaluation; general AI inventories, frameworks, and procurement channels do not transfer.",
    geography: "United States",
    primary_topic: "AI for Science"
  }],
  ["61-ADOPTION-WAYMO-CALIFORNIA", {
    sequence: 8,
    short_name: "Waymo California",
    slug: "waymo-california",
    playbook_id: "briefing-qualification-playbook-008-waymo-california",
    playbook_slug: "qualification-playbook-008-waymo-california",
    recognized_authorities: ["California Public Utilities Commission", "California Department of Motor Vehicles", "National Highway Traffic Safety Administration", "Waymo through an authority-required operator report"],
    entity_scope: "Waymo fared driverless passenger service in California with explicit geography and service scope; other operators, testing-only mileage, and national aggregates do not transfer.",
    geography: "California",
    primary_topic: "Mobility"
  }]
]);

const stageProfiles = new Map([
  ["66-STAGE-01-VALIDATION", {
    code: "validation",
    label: "Validation",
    question: "Does a same-entity record document the named inspection, test, compliance check, qualification, result, exception, correction, or retest?",
    admissible_artifact_types: ["Named inspection report", "Test or qualification result", "Compliance measurement", "Exception and correction record", "Retest or independent verification"],
    temporal_requirement: "The artifact must state the inspection, test, measurement, or review date and the version, facility, system, or lot tested.",
    method_requirement: "The test method, acceptance criterion, observed result, exceptions, and disposition must be inspectable.",
    denominator_requirement: "The tested population, component set, lot, run, requirement set, or explicit not-applicable basis must be declared.",
    exception_requirement: "Failures, exceptions, deviations, corrections, and retests must be present or explicitly reported as none.",
    recurrence_requirement: "A validation packet may establish a bounded test result but does not establish receiving-system acceptance or recurring operation."
  }],
  ["66-STAGE-02-ACCEPTANCE", {
    code: "acceptance",
    label: "Acceptance",
    question: "Does a named receiving authority or customer accept the defined asset, service, product, cutover, occupancy, or operating condition?",
    admissible_artifact_types: ["Signed acceptance or closeout", "Occupancy or operating authorization", "Accepted cutover record", "Customer receipt or qualified-product acceptance", "Receiving-authority decision"],
    temporal_requirement: "The acceptance date, effective date, accepted configuration, and any conditions must be explicit.",
    method_requirement: "The named receiver, acceptance criterion, accepted scope, conditions, exceptions, and sign-off authority must be inspectable.",
    denominator_requirement: "The accepted asset, service scope, units, locations, configuration, or explicit not-applicable basis must be declared.",
    exception_requirement: "Conditional acceptance, punch-list items, exceptions, rollback conditions, and later corrections must be preserved.",
    recurrence_requirement: "One accepted event establishes only that bounded acceptance and does not establish persistent service or output."
  }],
  ["66-STAGE-03-REPEAT", {
    code: "recurring-operation",
    label: "Recurring operation",
    question: "Does the record establish compatible repeated service, output, use, monitoring, shipment, or operation for the same entity?",
    admissible_artifact_types: ["Compatible operating series", "Repeated service or shipment records", "Recurring monitoring series", "Repeated accepted output", "Named reliability or utilization series"],
    temporal_requirement: "Multiple named periods or observations must be present with stable entity and scope; a one-time event is insufficient.",
    method_requirement: "Definitions, collection method, frequency, revision policy, and treatment of missing periods must remain compatible.",
    denominator_requirement: "The service population, exposure, asset count, capacity, output unit, or explicit not-applicable basis must remain stable or be reconciled.",
    exception_requirement: "Outages, failed runs, rejected lots, service interruptions, revisions, and missing observations must be disclosed.",
    recurrence_requirement: "The packet must explain why the number and spacing of observations establish recurrence for this entity without applying a universal threshold."
  }],
  ["66-STAGE-04-OUTCOME", {
    code: "comparable-outcome",
    label: "Comparable outcome",
    question: "Does a repeated series preserve entity, period, definition, method, denominator, and receiving-system acceptance well enough to support an outcome claim?",
    admissible_artifact_types: ["Compatible longitudinal outcome series", "Accepted performance series", "Stable service-quality series", "Repeated compliance or reliability outcome", "Cohort outcome with explicit denominator"],
    temporal_requirement: "A compatible multi-period series must preserve period definitions, breaks, revisions, and the accepted operating state.",
    method_requirement: "Measure definition, collection method, attribution boundary, comparability test, and alternative explanations must be inspectable.",
    denominator_requirement: "Entity, cohort, exposure, capacity, asset, output, customer, or other denominator must be stable or fully reconciled across periods.",
    exception_requirement: "Breaks, missing periods, scope changes, failures, corrections, revisions, and adverse observations must remain visible.",
    recurrence_requirement: "The series must establish accepted repeated operation before supporting a bounded outcome; activity volume alone is insufficient."
  }]
]);

const registryByFile = new Map(phase61.records.map((record) => [record.file_id, record]));
const gateByFile = new Map(phase63.gate_records.map((record) => [record.file_id, record]));
const bindingByCycle = new Map(phase62.phase_60_cycle_bindings.map((record) => [record.cycle_item_id, record]));

async function briefingSignals(id) {
  const file = (await (await import("node:fs/promises")).readdir(join(contentRoot, "briefings")))
    .find((name) => name.endsWith(".mdx") && name.includes(id.replace("briefing-", "")));
  if (!file) throw new Error(`Cannot locate briefing file for ${id}`);
  const text = await readFile(join(contentRoot, "briefings", file), "utf8");
  return [...text.matchAll(/^\s+-\s+"(signal-[^"]+)"/gm)].map((match) => match[1]);
}

const packetRecords = [];
const dossierSignals = new Map();
for (const dossier of phase66.dossier_rows) {
  dossierSignals.set(dossier.file_id, await briefingSignals(dossier.acceptance_briefing_id));
  const file = fileMetadata.get(dossier.file_id);
  const registry = registryByFile.get(dossier.file_id);
  const gate = gateByFile.get(dossier.file_id);
  for (const [stageIndex, decision] of dossier.stage_decisions.entries()) {
    const profile = stageProfiles.get(decision.stage_id);
    const packetNumber = (file.sequence - 1) * 4 + stageIndex + 1;
    const packetId = `67-QP-${String(packetNumber).padStart(3, "0")}`;
    const packetSlug = `${packetId.toLowerCase()}-${file.slug}-${profile.code}`;
    const packetState = decision.decision_state === "Evidence Present"
      ? "Continuity Monitoring"
      : decision.decision_state === "Partial / Held"
        ? "Awaiting Completion Artifact"
        : "Awaiting Qualifying Artifact";
    packetRecords.push({
      packet_id: packetId,
      slug: packetSlug,
      record_kind: "qualification_packet",
      record_status: "Published",
      file_id: dossier.file_id,
      file_kind: dossier.kind,
      named_entity: dossier.named_entity,
      short_name: file.short_name,
      geography: file.geography,
      stage_id: decision.stage_id,
      phase64_stage_id: decision.phase64_stage_id,
      stage_label: profile.label,
      current_decision_state: decision.decision_state,
      packet_state: packetState,
      claim_question: profile.question,
      current_basis: decision.basis,
      exact_qualifying_artifact: decision.exact_qualifying_artifact,
      recognized_authorities: file.recognized_authorities,
      entity_scope: file.entity_scope,
      admissible_artifact_types: profile.admissible_artifact_types,
      temporal_requirement: profile.temporal_requirement,
      method_requirement: profile.method_requirement,
      denominator_requirement: profile.denominator_requirement,
      exception_requirement: profile.exception_requirement,
      recurrence_requirement: profile.recurrence_requirement,
      disqualifiers: [
        "A record for a different entity, facility, project, operator, geography, or receiving system.",
        "Authority, planning, commitment, construction, guidance, or availability presented as downstream proof.",
        "An observation without its date, scope, method, denominator or explicit not-applicable basis, and exception trail.",
        dossier.stop_rule
      ],
      gate_id: dossier.gate_id,
      gate_mode: dossier.gate_mode,
      next_check_date: dossier.next_check_date,
      reopening_trigger: dossier.reopening_trigger,
      gate_receipt_state: gate.receipt_state,
      source_ids: registry.source_ids,
      signal_ids: dossierSignals.get(dossier.file_id),
      evidence_gap_ids: registry.evidence_gap_ids,
      supporting_phase65_record_ids: decision.supporting_phase65_record_ids,
      canonical_briefing_id: dossier.canonical_briefing_id,
      acceptance_briefing_id: dossier.acceptance_briefing_id,
      qualification_playbook_id: file.playbook_id,
      reader_pathway_ids: registry.reader_pathway_ids,
      dependency_map_ids: unique([...registry.dependency_map_ids, "dependency-map-artifact-return-to-reader-state", "dependency-map-validation-acceptance-recurrence-outcome-compatibility"]),
      required_propagation: ["source_check", "intake_envelope", "identity_verification", "stage_test", "independent_review", "decision_receipt", "signal_decision", "conversion_event_if_same_entity", "gate_decision", "matrix_decision", "canonical_dossier", "acceptance_dossier", "reader_pathways", "dependency_maps", "outcomes_watch", "update_log", "git_backed_release_validation"],
      receipt_id: null,
      decision_date: null,
      phase64_cell_change: "none"
    });
  }
}

const qualificationRegistry = {
  schema_version: "1.0",
  phase: "67",
  registry_id: "qualification-packet-registry-001",
  title: "Qualification Packet Registry",
  captured_date: today,
  as_of_date: today,
  structural_status: "Complete",
  operational_status: "Awaiting Real Dated Checks",
  scope: "Thirty-two public qualification contracts covering validation, acceptance, recurring operation, and comparable outcome for all eight named files.",
  interpretation_boundary: "A packet defines what evidence would qualify and how it must propagate. The packet, a returned URL, or a synthetic test is not evidence that the requirement has been met.",
  state_machine: ["Awaiting Artifact", "Returned", "Identity Verified", "Evidence Tested", "Independently Reviewed", "Decision Receipt", "Propagated", "Release Verified"],
  terminal_states: ["Rejected", "Blocked", "Superseded", "No Material Change"],
  allowed_receipt_types: ["Change Note", "Watch Note", "Correction", "No Material Change", "Blocked Check"],
  metrics: {
    qualification_packets: 32,
    named_files: 8,
    stage_tests_per_file: 4,
    continuity_monitoring: packetRecords.filter((record) => record.packet_state === "Continuity Monitoring").length,
    awaiting_completion_artifact: packetRecords.filter((record) => record.packet_state === "Awaiting Completion Artifact").length,
    awaiting_qualifying_artifact: packetRecords.filter((record) => record.packet_state === "Awaiting Qualifying Artifact").length,
    receipts_created: 0,
    phase64_cells_advanced: 0,
    automatic_publications: 0
  },
  packet_records: packetRecords
};
await writeJson(join(dataRoot, "phase-67-qualification-packet-registry.json"), qualificationRegistry);

const envelopeRecords = phase60.records.map((record, index) => {
  const binding = bindingByCycle.get(record.cycle_item_id);
  const slug = `67-return-${String(index + 1).padStart(3, "0")}-${record.cycle_item_id.toLowerCase().replace(/^60-cycle-/, "").replaceAll("_", "-")}`;
  const boundPackets = packetRecords
    .filter((packet) => binding.file_ids.includes(packet.file_id))
    .map((packet) => packet.packet_id);
  return {
    envelope_id: `67-RETURN-${String(index + 1).padStart(3, "0")}`,
    slug,
    record_kind: "evidence_return_envelope",
    record_status: "Published",
    cycle_item_id: record.cycle_item_id,
    wave: record.wave,
    target: record.target,
    origin_record_id: record.origin_record_id,
    scheduled_check_date: record.scheduled_check_date,
    envelope_state: "Scheduled",
    exact_next_artifact: record.exact_next_artifact,
    source_ids: record.source_ids,
    underlying_signal_id: record.underlying_signal_id,
    named_file_ids: binding.file_ids,
    qualification_packet_ids: boundPackets,
    binding_decision: binding.binding_decision,
    canonical_dossier_ids: record.canonical_dossier_ids,
    reader_pathway_ids: record.reader_pathway_ids,
    dependency_map_ids: unique([...record.dependency_map_ids, "dependency-map-artifact-return-to-reader-state"]),
    local_system_ids: record.local_system_ids,
    attempted_surfaces: [],
    access_result: null,
    receipt_type: null,
    receipt_id: null,
    decision_date: null,
    decision_status: "scheduled",
    propagation_status: "not_started",
    next_check_date: null,
    publication_boundary: "This envelope schedules and bounds a future human-reviewed source check. It does not establish that the artifact exists or authorize publication before the real check date."
  };
});

const evidenceReturnLedger = {
  schema_version: "1.0",
  phase: "67",
  ledger_id: "evidence-return-envelope-ledger-001",
  title: "Evidence Return Envelope Ledger",
  captured_date: today,
  as_of_date: today,
  structural_status: "Complete",
  operational_status: "Scheduled",
  scope: "Thirteen public-safe return envelopes preserving every Phase 60 Evidence Cycle 001 gate, exact artifact, date, source, signal, binding decision, and propagation surface.",
  interpretation_boundary: "An envelope is a scheduled intake contract. Future envelopes have no attempted surfaces, access results, receipts, decisions, or propagation claims.",
  metrics: {
    envelopes: 13,
    wave_60b: envelopeRecords.filter((record) => record.wave === "60B").length,
    wave_60c: envelopeRecords.filter((record) => record.wave === "60C").length,
    wave_60d: envelopeRecords.filter((record) => record.wave === "60D").length,
    named_file_bound: envelopeRecords.filter((record) => record.named_file_ids.length > 0).length,
    no_transfer: envelopeRecords.filter((record) => record.named_file_ids.length === 0).length,
    receipts_created: 0,
    decisions_completed: 0,
    propagation_completed: 0
  },
  envelope_records: envelopeRecords
};
await writeJson(join(dataRoot, "phase-67-evidence-return-envelope-ledger.json"), evidenceReturnLedger);

const qualificationCaseTypes = [
  ["qualifying_structure", null, "eligible_for_human_review"],
  ["wrong_entity", "same_entity", "reject"],
  ["wrong_authority", "recognized_authority", "reject"],
  ["scope_mismatch", "scope_matches", "reject"],
  ["date_missing", "date_present", "reject"],
  ["method_missing", "method_declared", "reject"],
  ["denominator_missing", "denominator_declared_or_na", "reject"],
  ["exceptions_missing", "exceptions_declared", "reject"],
  ["correction_trail_missing", "correction_trail_declared", "reject"],
  ["cross_stage_transfer", "stage_matches", "reject"],
  ["precreated_receipt", "receipt_after_check", "reject"],
  ["propagation_incomplete", "propagation_complete", "reject"]
];
const qualificationFixtures = packetRecords.flatMap((packet) => qualificationCaseTypes.map(([caseType, failedField, expected], index) => {
  const inputs = {
    same_entity: true,
    recognized_authority: true,
    scope_matches: true,
    date_present: true,
    method_declared: true,
    denominator_declared_or_na: true,
    exceptions_declared: true,
    correction_trail_declared: true,
    stage_matches: true,
    receipt_after_check: true,
    propagation_complete: true,
    human_review_required: true
  };
  if (failedField) inputs[failedField] = false;
  return {
    fixture_id: `67-QF-${packet.packet_id.slice(-3)}-${String(index + 1).padStart(2, "0")}`,
    packet_id: packet.packet_id,
    case_type: caseType,
    synthetic_only: true,
    inputs,
    expected
  };
}));
await writeJson(join(dataRoot, "phase-67-qualification-admissibility-fixtures.json"), {
  schema_version: "1.0",
  phase: "67",
  fixture_set_id: "qualification-admissibility-fixtures-001",
  interpretation_boundary: "Synthetic contract fixtures test rule behavior and are excluded from public evidence, source, signal, receipt, event, gate, matrix, and research counts.",
  expected_cases: 384,
  fixtures: qualificationFixtures
});

const returnCaseTypes = [
  ["valid_future_schedule", null, "scheduled"],
  ["precreated_receipt", "receipt_absent", "reject"],
  ["premature_decision", "decision_absent", "reject"],
  ["missing_source", "source_resolves", "reject"],
  ["missing_signal", "signal_resolves", "reject"],
  ["missing_artifact", "artifact_defined", "reject"],
  ["unauthorized_named_file_transfer", "binding_matches", "reject"],
  ["premature_propagation", "propagation_not_started", "reject"]
];
const returnFixtures = envelopeRecords.flatMap((envelope) => returnCaseTypes.map(([caseType, failedField, expected], index) => {
  const inputs = {
    scheduled_date_present: true,
    receipt_absent: true,
    decision_absent: true,
    source_resolves: true,
    signal_resolves: true,
    artifact_defined: true,
    binding_matches: true,
    propagation_not_started: true
  };
  if (failedField) inputs[failedField] = false;
  return {
    fixture_id: `67-RF-${envelope.envelope_id.slice(-3)}-${String(index + 1).padStart(2, "0")}`,
    envelope_id: envelope.envelope_id,
    case_type: caseType,
    synthetic_only: true,
    inputs,
    expected
  };
}));
await writeJson(join(dataRoot, "phase-67-return-workflow-fixtures.json"), {
  schema_version: "1.0",
  phase: "67",
  fixture_set_id: "return-workflow-fixtures-001",
  interpretation_boundary: "Synthetic workflow fixtures verify future-state integrity and are never serialized as evidence or completed checks.",
  expected_cases: 104,
  fixtures: returnFixtures
});

const playbookIds = [];
for (const dossier of phase66.dossier_rows) {
  const file = fileMetadata.get(dossier.file_id);
  const registry = registryByFile.get(dossier.file_id);
  const packets = packetRecords.filter((packet) => packet.file_id === dossier.file_id);
  const signals = dossierSignals.get(dossier.file_id);
  playbookIds.push(file.playbook_id);
  const body = `---
id: "${file.playbook_id}"
title: "Qualification Playbook ${String(file.sequence).padStart(3, "0")}: ${file.short_name}"
slug: "${file.playbook_slug}"
record_status: "Published"
summary: "Four executable qualification packets define the exact validation, acceptance, recurring-operation, and comparable-outcome evidence required for ${file.short_name}, while preserving its current Phase 64 decisions and no-transfer boundary."
published_date: ${today}
captured_date: ${today}
signal_ids:
${yamlList(signals)}
evidence_gap_ids:
${yamlList(registry.evidence_gap_ids)}
claim_scope: "Editorial Synthesis"
local_evidence_level: "Project-Level Evidence"
last_reviewed_date: ${today}
top_takeaways:
  - "Four packet contracts turn the Phase 66 exact-next-artifact rules into an inspectable evidence-return workflow."
  - "The current downstream decisions remain ${packets.map((packet) => packet.current_decision_state).join(", ")}; no matrix cell changes."
  - "A packet or returned URL cannot change state before same-entity verification, independent review, a decision receipt, and complete propagation."
constraint_watch:
  - "Data Quality"
  - "Interpretation"
  - "Regulation"
what_to_watch_next:
  - "${dossier.exact_next_artifact}"
  - "A real artifact from a recognized authority that satisfies entity, scope, date, method, denominator, exception, and correction requirements"
  - "A human-reviewed receipt propagated through every assigned reader surface"
---

## Qualification packet register

| Packet | Test | Current state | Packet state |
| --- | --- | --- | --- |
${packets.map((packet) => `| [${packet.packet_id}](/evidence/qualification/${packet.slug}/) | ${packet.stage_label} | ${packet.current_decision_state} | ${packet.packet_state} |`).join("\n")}

## Recognized authority

${file.recognized_authorities.map((authority) => `- ${authority}`).join("\n")}

The entity boundary is exact: ${file.entity_scope}

## Admission requirements

Every return must preserve the named entity, recognized authority, exact scope, date or period, method, denominator or explicit not-applicable basis, exceptions, correction trail, stage identity, receipt timing, and full propagation contract.

## Current evidence boundary

${dossier.interpretation_boundary}

The Phase 63 gate remains **${dossier.gate_mode}**${dossier.next_check_date ? ` for **${dossier.next_check_date}**` : ` with reopening trigger: ${dossier.reopening_trigger}`}. ${dossier.stop_rule}

## Reviewer workflow

1. Attach the returned artifact to the correct packet without changing its evidence state.
2. Verify entity, authority, scope, date, method, denominator, exceptions, and correction history.
3. Apply only the packet's named stage test.
4. Require independent review and adjudicate disagreement before a receipt.
5. Propagate an approved decision through the source, signal, event where same-entity, gate, matrix, dossiers, pathways, maps, Outcomes Watch, update log, and release validation.

## Publication boundary

This playbook and its four packets are public acquisition contracts. They do not establish that an artifact exists, precreate a future receipt, authorize direct publication, or change a source, signal, event, gate, matrix cell, score, ranking, or outcome.
`;
  await writeFile(join(contentRoot, "briefings", `${file.playbook_id}.mdx`), body, "utf8");
}

const allPublishedSignals = unique([...dossierSignals.values()].flat());
const methodBriefings = [
  {
    sequence: 1,
    id: "briefing-qualification-method-001-validation-evidence",
    slug: "qualification-method-001-validation-evidence",
    title: "Qualification Method 001: Validation Evidence",
    stageId: "66-STAGE-01-VALIDATION",
    summary: "A field method for distinguishing a named inspection, test, compliance check, qualification, exception, correction, or retest from upstream implementation context."
  },
  {
    sequence: 2,
    id: "briefing-qualification-method-002-receiving-system-acceptance",
    slug: "qualification-method-002-receiving-system-acceptance",
    title: "Qualification Method 002: Receiving-System Acceptance",
    stageId: "66-STAGE-02-ACCEPTANCE",
    summary: "A field method for proving that a named receiver accepted a defined asset, service, product, cutover, occupancy, or operating condition."
  },
  {
    sequence: 3,
    id: "briefing-qualification-method-003-compatible-recurring-operation",
    slug: "qualification-method-003-compatible-recurring-operation",
    title: "Qualification Method 003: Compatible Recurring Operation",
    stageId: "66-STAGE-03-REPEAT",
    summary: "A field method for separating repeated compatible operation from one-time availability, authority, acceptance, activity, or output observations."
  },
  {
    sequence: 4,
    id: "briefing-qualification-method-004-comparable-outcome-series",
    slug: "qualification-method-004-comparable-outcome-series",
    title: "Qualification Method 004: Comparable Outcome Series",
    stageId: "66-STAGE-04-OUTCOME",
    summary: "A field method for testing stable entity, period, definition, method, denominator, accepted operation, revisions, and alternative explanations before an outcome claim."
  }
];

for (const briefing of methodBriefings) {
  const profile = stageProfiles.get(briefing.stageId);
  const packets = packetRecords.filter((packet) => packet.stage_id === briefing.stageId);
  const body = `---
id: "${briefing.id}"
title: "${briefing.title}"
slug: "${briefing.slug}"
record_status: "Published"
summary: "${briefing.summary}"
published_date: ${today}
captured_date: ${today}
signal_ids:
${yamlList(allPublishedSignals.slice(0, 8))}
evidence_gap_ids:
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${today}
top_takeaways:
  - "The test applies only to the same named entity and stage."
  - "Method, denominator or not-applicable basis, exceptions, and corrections are required fields rather than optional narrative."
  - "A passing packet becomes eligible for human review; it never publishes or advances state automatically."
constraint_watch:
  - "Data Quality"
  - "Interpretation"
  - "Standards"
what_to_watch_next:
  - "A real same-entity artifact satisfying the complete packet contract"
  - "An independent review decision and bounded receipt"
  - "Complete propagation or an explicit no-change, watch, correction, or blocker trail"
---

## Question

${profile.question}

## Minimum admissible fields

- **Artifact types:** ${profile.admissible_artifact_types.join("; ")}.
- **Time:** ${profile.temporal_requirement}
- **Method:** ${profile.method_requirement}
- **Denominator:** ${profile.denominator_requirement}
- **Exceptions:** ${profile.exception_requirement}
- **Recurrence boundary:** ${profile.recurrence_requirement}

## Eight-file packet set

${packets.map((packet) => `- [${packet.packet_id}: ${packet.short_name}](/evidence/qualification/${packet.slug}/) — **${packet.current_decision_state} / ${packet.packet_state}.** ${packet.exact_qualifying_artifact}`).join("\n")}

## Reject conditions

Reject or hold a return when entity, authority, scope, date, method, denominator, exception history, correction trail, stage identity, receipt timing, or propagation is incomplete. A rejected synthetic fixture or returned document is not evidence that the underlying condition does not exist.

## Decision outputs

The only reader-visible outputs are a Change Note, Watch Note, Correction, No Material Change receipt, or Blocked Check. Every output requires human review and the existing Phase 60 propagation contract.

## Publication boundary

This method describes admissibility. It assigns no readiness score, probability, rank, maturity value, or automatic publication state.
`;
  await writeFile(join(contentRoot, "briefings", `${briefing.id}.mdx`), body, "utf8");
}

const controlRoomId = "briefing-evidence-return-control-room-001";
const controlRoom = `---
id: "${controlRoomId}"
title: "Evidence Return Control Room 001: Forty-Five Governed Returns"
slug: "evidence-return-control-room-001-forty-five-governed-returns"
record_status: "Published"
summary: "A public operating view of thirty-two named-file qualification packets and thirteen Evidence Cycle 001 return envelopes, with future checks, bindings, no-transfer decisions, receipts, and propagation status kept distinct."
published_date: ${today}
captured_date: ${today}
signal_ids:
${yamlList(allPublishedSignals.slice(0, 8))}
evidence_gap_ids:
  - "gap-013"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "Project-Level Evidence"
last_reviewed_date: ${today}
top_takeaways:
  - "Thirty-two qualification packets define what would answer the four downstream tests for eight named files."
  - "Thirteen return envelopes preserve Evidence Cycle 001 dates and the three approved named-file bindings without precreating a receipt."
  - "The structural system is complete; operational review remains scheduled for the real source-check dates."
constraint_watch:
  - "Data Quality"
  - "Interpretation"
  - "Public Trust"
what_to_watch_next:
  - "The August 14 DARPA result check without transfer into the Waymo file"
  - "The August 15 Shuttle Landing Facility licence check bound to the Space Coast file"
  - "A complete receipt and propagation trail for every reviewed return"
---

## Structural inventory

| Record family | Count | Current state |
| --- | ---: | --- |
| [Named-file qualification packets](/evidence/qualification/) | 32 | 1 continuity monitor, 4 completion-artifact holds, 27 qualifying-artifact waits |
| [Evidence Cycle return envelopes](/evidence/qualification/) | 13 | Scheduled; zero receipts and zero completed decisions |
| Synthetic admissibility cases | 488 | Contract-only; excluded from evidence and publication counts |

## Immediate operating window

- **2026-08-14 — DARPA Lift Challenge results.** The return remains outside the Waymo named file. A result can update its assigned signal and reader products but cannot transfer into a different operator file.
- **2026-08-15 — Shuttle Landing Facility licence disposition.** The return is bound to the Space Coast authority file only after a real receipt and same-entity propagation decision.

## Decision path

Discovery is followed by envelope intake, entity and authority verification, the exact stage test, independent review, a bounded receipt, complete propagation, and Git-backed release validation. At every step, a failure produces an explicit hold, no-change, watch, correction, or blocker trail rather than silent state drift.

## What is complete

The packet schemas, public registry, return envelopes, binding decisions, reader products, export contracts, and deterministic synthetic tests are complete at the structural gate.

## What remains scheduled

No August 14 or August 15 source check is represented as complete. Attempted surfaces, access results, decision dates, receipt IDs, and propagation states remain empty until the real review occurs.

## Publication boundary

The control room reports governed work state. It does not predict that an artifact will exist, treat a returned link as qualifying evidence, or authorize automated publication.
`;
await writeFile(join(contentRoot, "briefings", `${controlRoomId}.mdx`), controlRoom, "utf8");

const mapSignals = allPublishedSignals.slice(0, 8);
const mapSources = unique(phase61.records.flatMap((record) => record.source_ids));
const mapLocalSystems = unique(phase61.records.flatMap((record) => record.local_system_ids));
const mapGaps = unique(phase61.records.flatMap((record) => record.evidence_gap_ids));

const maps = [
  {
    id: "dependency-map-artifact-return-to-reader-state",
    title: "Artifact Return To Reader State",
    slug: "artifact-return-to-reader-state",
    summary: "A governed return path from exact evidence requirement through intake, identity, stage testing, independent review, decision receipt, propagation, and release verification.",
    map_type: "Evidence Gap Map",
    record_status: "Published",
    primary_topic: "Policy and Standards",
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraint_tags: ["Data Quality", "Interpretation", "Regulation", "Public Trust"],
    map_question: "How can a returned artifact change reader state without bypassing identity, stage, review, receipt, and propagation controls?",
    interpretation_boundary: "The map describes a required review path. It does not establish that a returned artifact qualifies, and no node publishes directly.",
    source_ids: mapSources,
    signal_ids: mapSignals,
    technology_ids: [],
    local_system_ids: mapLocalSystems,
    evidence_gap_ids: mapGaps,
    nodes: [
      { id: "node-requirement", label: "Exact evidence requirement", node_type: "Constraint", note: "The packet names the entity, stage, artifact, authority, scope, period, method, denominator, exceptions, and correction trail." },
      { id: "node-return", label: "Returned artifact envelope", node_type: "Constraint", note: "The envelope records the scheduled or triggered check without changing evidence state." },
      { id: "node-identity", label: "Entity and authority lock", node_type: "Constraint", note: "The returned record must match the named entity, receiving system, authority, and scope." },
      { id: "node-test", label: "Stage-specific test", node_type: "Constraint", note: "Only validation, acceptance, recurring operation, or comparable outcome named by the packet may be answered." },
      { id: "node-review", label: "Independent human review", node_type: "Constraint", note: "A structurally complete artifact is eligible for review, not automatic publication." },
      { id: "node-receipt", label: "Bounded decision receipt", node_type: "Constraint", note: "Change, watch, correction, no-change, or blocker outcomes preserve the review date and basis." },
      { id: "node-propagation", label: "Complete reader propagation", node_type: "Constraint", note: "The signal, same-entity event, gate, matrix, dossiers, pathways, maps, update, and release contract move together." },
      { id: "node-gap", label: "Silent or partial propagation", node_type: "Evidence Gap", record_id: "gap-016", note: "A receipt or signal-only change without complete propagation is rejected." }
    ],
    links: [
      { from: "node-requirement", to: "node-return", relationship: "Depends On", confidence: "Supported", note: "A return envelope must begin with an exact evidence requirement." },
      { from: "node-return", to: "node-identity", relationship: "Depends On", confidence: "Supported", note: "A discovered artifact must pass same-entity and authority checks." },
      { from: "node-identity", to: "node-test", relationship: "Depends On", confidence: "Supported", note: "Identity alone does not answer the named stage question." },
      { from: "node-test", to: "node-review", relationship: "Depends On", confidence: "Supported", note: "A complete test result remains subject to independent review." },
      { from: "node-review", to: "node-receipt", relationship: "Depends On", confidence: "Supported", note: "A reader-visible decision requires an explicit receipt." },
      { from: "node-receipt", to: "node-propagation", relationship: "Depends On", confidence: "Supported", note: "The receipt must move every affected surface together." },
      { from: "node-gap", to: "node-propagation", relationship: "Limited By", confidence: "Missing Evidence", note: "Partial propagation fails the release contract." }
    ],
    what_this_map_supports: ["One inspectable path from exact requirement to reader state.", "Explicit no-change, watch, correction, and blocker outcomes.", "Same-entity event and matrix updates only after a real qualifying receipt."],
    what_this_map_does_not_prove: ["It does not establish that a scheduled artifact exists.", "It does not turn structural completeness into evidence sufficiency.", "It does not automate publication, rank files, or score readiness."],
    next_records_needed: ["Real artifacts returned on or after their scheduled or triggered review date.", "Independent decision receipts.", "Complete propagation and release-validation records."]
  },
  {
    id: "dependency-map-validation-acceptance-recurrence-outcome-compatibility",
    title: "Validation, Acceptance, Recurrence And Outcome Compatibility",
    slug: "validation-acceptance-recurrence-outcome-compatibility",
    summary: "A compatibility map showing why a valid test, accepted event, repeated operation, and comparable outcome remain separate evidence questions with distinct fields and failure modes.",
    map_type: "Evidence Gap Map",
    record_status: "Published",
    primary_topic: "Policy and Standards",
    framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraint_tags: ["Data Quality", "Interpretation", "Standards", "Public Trust"],
    map_question: "Which fields must remain compatible before evidence can move from validation to acceptance, recurrence, or a bounded outcome?",
    interpretation_boundary: "The nodes are distinct questions rather than a universal maturity ladder. Evidence does not flow forward automatically.",
    source_ids: mapSources,
    signal_ids: mapSignals,
    technology_ids: [],
    local_system_ids: mapLocalSystems,
    evidence_gap_ids: mapGaps,
    nodes: [
      { id: "node-validation", label: "Validation result", node_type: "Constraint", note: "Method, criterion, tested population, exceptions, corrections, and retests match the named scope." },
      { id: "node-acceptance", label: "Receiving-system acceptance", node_type: "Constraint", note: "A named authority accepts the defined configuration, service, product, occupancy, or condition." },
      { id: "node-repeat", label: "Compatible recurrence", node_type: "Constraint", note: "Multiple observations preserve entity, scope, period, method, denominator, failures, and revision policy." },
      { id: "node-outcome", label: "Comparable outcome", node_type: "Evidence Gap", record_id: "gap-016", note: "Accepted repeated operation supports only a bounded measure with stable definitions and alternative explanations." },
      { id: "node-breaks", label: "Compatibility breaks", node_type: "Constraint", note: "Entity, authority, geography, method, denominator, period, or revision changes stop automatic comparison." },
      { id: "node-no-transfer", label: "No stage transfer", node_type: "Constraint", note: "A record remains useful at its own stage without proving a later one." }
    ],
    links: [
      { from: "node-validation", to: "node-acceptance", relationship: "Depends On", confidence: "Partial", note: "A valid test can be necessary but does not itself establish acceptance." },
      { from: "node-acceptance", to: "node-repeat", relationship: "Depends On", confidence: "Partial", note: "One accepted event does not establish persistent operation." },
      { from: "node-repeat", to: "node-outcome", relationship: "Depends On", confidence: "Partial", note: "Repeated activity still requires a stable measure, denominator, and attribution boundary." },
      { from: "node-breaks", to: "node-outcome", relationship: "Limited By", confidence: "Missing Evidence", note: "Unreconciled compatibility breaks prevent a comparable series." },
      { from: "node-no-transfer", to: "node-outcome", relationship: "Limited By", confidence: "Supported", note: "The no-transfer rule keeps upstream evidence from becoming an outcome claim." }
    ],
    what_this_map_supports: ["Four separate evidence tests with explicit compatibility fields.", "Bounded use of valid upstream evidence without stage inflation.", "A repeatable rejection and reconciliation method for broken series."],
    what_this_map_does_not_prove: ["It does not impose one universal sequence on every system.", "It does not establish causation or comparative performance.", "It does not rank entities or create a maturity score."],
    next_records_needed: ["Named validation records with exception and correction trails.", "Receiving-authority acceptance artifacts.", "Compatible recurring-operation and outcome series with reconciled denominators."]
  }
];
for (const map of maps) await writeJson(join(contentRoot, "dependency-maps", `${map.slug}.json`), map);

const allPathwayFiles = (await (await import("node:fs/promises")).readdir(join(contentRoot, "reader-pathways"))).filter((name) => name.endsWith(".json"));
const playbooksByPathway = new Map();
for (const record of phase61.records) {
  const file = fileMetadata.get(record.file_id);
  for (const pathwayId of record.reader_pathway_ids) {
    const values = playbooksByPathway.get(pathwayId) ?? [];
    values.push(file.playbook_id);
    playbooksByPathway.set(pathwayId, values);
  }
}
for (const file of allPathwayFiles) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(contentRoot, "reader-pathways", file);
  const stageMethod = pathway.primary_topics.includes("Mobility")
    ? methodBriefings[2].id
    : pathway.primary_topics.includes("Policy and Standards")
      ? methodBriefings[1].id
      : pathway.primary_topics.includes("AI for Science")
        ? methodBriefings[0].id
        : methodBriefings[3].id;
  pathway.briefing_ids = unique([
    ...pathway.briefing_ids,
    ...(playbooksByPathway.get(pathway.id) ?? []),
    stageMethod,
    controlRoomId
  ]);
  pathway.dependency_map_ids = unique([...pathway.dependency_map_ids, ...maps.map((map) => map.id)]);
  pathway.next_records = unique([...pathway.next_records, "A real same-entity artifact returned through its Phase 67 qualification packet with authority, scope, date, method, denominator or not-applicable basis, exceptions, correction trail, decision receipt, and complete propagation."]);
  await writeJson(path, pathway);
}

const appendSection = async (path, marker, section) => {
  let text = await readFile(path, "utf8");
  text = text.replace(new RegExp(`\\n## ${marker}[\\s\\S]*$`), "");
  await writeFile(path, `${text.trimEnd()}\n\n${section}\n`, "utf8");
};

for (const dossier of phase66.dossier_rows) {
  const file = fileMetadata.get(dossier.file_id);
  const packets = packetRecords.filter((packet) => packet.file_id === dossier.file_id);
  const section = `## Phase 67 qualification and return control\n\n[Qualification Playbook ${String(file.sequence).padStart(3, "0")}](/briefings/${file.playbook_slug}/) turns the four downstream questions into executable packet contracts:\n\n${packets.map((packet) => `- [${packet.packet_id}: ${packet.stage_label}](/evidence/qualification/${packet.slug}/) — **${packet.current_decision_state} / ${packet.packet_state}.**`).join("\n")}\n\nNo packet changes evidence state. A real same-entity return, independent review, bounded receipt, and complete propagation remain mandatory.`;
  const canonicalPath = join(contentRoot, "briefings", `${dossier.canonical_briefing_id}.mdx`);
  const acceptancePath = join(contentRoot, "briefings", `${dossier.acceptance_briefing_id}.mdx`);
  await appendSection(canonicalPath, "Phase 67 qualification and return control", section);
  await appendSection(acceptancePath, "Phase 67 qualification and return control", section);
}

const localBindings = new Map();
for (const record of phase61.records) {
  const file = fileMetadata.get(record.file_id);
  for (const localId of record.local_system_ids) {
    const values = localBindings.get(localId) ?? [];
    values.push(file);
    localBindings.set(localId, values);
  }
}
for (const [localId, files] of localBindings) {
  const names = await (await import("node:fs/promises")).readdir(join(contentRoot, "local-systems"));
  for (const name of names) {
    const path = join(contentRoot, "local-systems", name);
    const text = await readFile(path, "utf8");
    if (text.match(/^id:\s*"?([^"\n]+)"?/m)?.[1]?.trim() !== localId) continue;
    const section = `## Phase 67 qualification packets\n\n${files.map((file) => `- [Qualification Playbook ${String(file.sequence).padStart(3, "0")}: ${file.short_name}](/briefings/${file.playbook_slug}/)`).join("\n")}\n\nThe local system exposes the exact evidence-return contract without treating a scheduled check, returned URL, adjacent entity, or synthetic fixture as accepted operation or outcome.`;
    await appendSection(path, "Phase 67 qualification packets", section);
  }
}

const crossBriefings = [
  "briefing-evidence-cycle-001-operating-baseline.mdx",
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-conversion-gate-calendar-001.mdx",
  "briefing-conversion-stage-matrix-001.mdx",
  "briefing-acceptance-watch-002-eight-files-four-tests.mdx",
  "briefing-repeat-operation-watch-001-after-acceptance.mdx"
];
for (const file of crossBriefings) {
  const path = join(contentRoot, "briefings", file);
  const section = `## Phase 67 qualification control plane\n\n[Evidence Return Control Room 001](/briefings/evidence-return-control-room-001-forty-five-governed-returns/) joins thirty-two named-file qualification packets to thirteen Evidence Cycle return envelopes. The structural system is complete with zero new receipts, zero completed future checks, and zero Phase 64 cell advances. The first real operating reviews remain scheduled for August 14 and August 15.`;
  await appendSection(path, "Phase 67 qualification control plane", section);
}

const update = {
  id: "update-2026-08-12-phase-67-qualification-control-plane",
  effective_date: today,
  entry_type: "Signal Repair",
  title: "Phase 67 publishes the qualification and evidence-return control plane",
  summary: "Thirty-two named-file qualification packets, thirteen Evidence Cycle return envelopes, thirteen Published briefings, two Published dependency maps, and two public JSON contracts make downstream evidence acquisition inspectable without precreating a receipt or changing an evidence state.",
  affected_record_ids: [...playbookIds, ...methodBriefings.map((briefing) => briefing.id), controlRoomId, ...maps.map((map) => map.id)],
  related_paths: ["/evidence/qualification/", "/briefings/", "/atlas/dependency-maps/", "/data/"],
  evidence_note: "Phase 67 serializes existing Phase 60-66 requirements into public-safe packet and envelope contracts. Synthetic fixtures test control behavior and are excluded from evidence counts.",
  receipt_type: "No Material Change",
  materiality: "No record-state change",
  source_checked_date: today,
  decision_date: today,
  prior_state: "Phase 66 named exact downstream artifacts but did not expose one executable packet and return-envelope contract for every open question and cycle gate.",
  current_state: "Every downstream question and Evidence Cycle gate now has an inspectable public contract, exact propagation requirements, and deterministic rule tests; all future receipts remain empty.",
  publication_effect: "Adds 45 public contract records, 46 qualification routes, 13 Published briefings, two Published dependency maps, two public JSON exports, one update, and no source, signal, research, receipt, event, gate, matrix, score, ranking, or operating-outcome change.",
  work_package: "docs/work-packages/phase-67-qualification-packet-evidence-return-control-plane.md"
};
await writeJson(join(contentRoot, "updates", "2026-08-12-phase-67-qualification-control-plane.json"), update);

console.log(`Phase 67 structural content built: ${packetRecords.length} qualification packets, ${envelopeRecords.length} return envelopes, ${qualificationFixtures.length + returnFixtures.length} synthetic cases, 13 briefings, 2 maps, 15 pathway integrations, and 0 future receipts or matrix advances.`);
