import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const phase61 = await readJson(join(dataRoot, "phase-61-project-conversion-registry.json"));
const phase63 = await readJson(join(dataRoot, "phase-63-conversion-gate-calendar.json"));
const phase64 = await readJson(join(dataRoot, "phase-64-conversion-stage-matrix.json"));
const phase67 = await readJson(join(dataRoot, "phase-67-qualification-packet-registry.json"));

const dimensions = [
  {
    dimension_id: "68-DIM-01-IDENTITY",
    label: "Stable entity identity",
    question: "Does every observation resolve to the same named entity, facility, project, service, or adoption case?"
  },
  {
    dimension_id: "68-DIM-02-SCOPE",
    label: "Stable operating scope",
    question: "Are geography, asset, service, population, receiving system, and stage boundaries explicit and compatible?"
  },
  {
    dimension_id: "68-DIM-03-ACCEPTED-RECURRENCE",
    label: "Accepted recurring operation",
    question: "Is accepted repeated service, output, use, shipment, monitoring, or operation established for the same entity?"
  },
  {
    dimension_id: "68-DIM-04-MEASURE",
    label: "Stable measure and unit",
    question: "Does the measure preserve one inspectable definition, numerator, unit, and attribution boundary across observations?"
  },
  {
    dimension_id: "68-DIM-05-DENOMINATOR",
    label: "Stable denominator or exposure",
    question: "Is the population, capacity, asset count, service exposure, output, customer, or other denominator stable or reconciled?"
  },
  {
    dimension_id: "68-DIM-06-PERIOD",
    label: "Compatible period and cadence",
    question: "Are observation periods, frequency, missing periods, and partial-period treatment explicit and compatible?"
  },
  {
    dimension_id: "68-DIM-07-METHOD",
    label: "Compatible method and revisions",
    question: "Are collection method, calculation rule, revision history, corrections, and version changes inspectable?"
  },
  {
    dimension_id: "68-DIM-08-EXCEPTIONS",
    label: "Visible exceptions and alternatives",
    question: "Are failures, outages, rejected units, breaks, scope changes, adverse observations, and alternative explanations retained?"
  }
];

const definitions = {
  "61-PROJECT-TSMC-ARIZONA": {
    cohort_id: "68-COHORT-001-TSMC-ARIZONA",
    cohort_title: "TSMC Arizona accepted facility operation cohort",
    question: "Can facility-specific accepted operation support compatible production, utility, quality, and workforce outcomes without combining different fabs or stages?",
    measures: [
      ["QUALIFIED-OUTPUT", "Accepted qualified output", "Accepted qualified units or lots", "Accepted production capacity or eligible lots", "Facility and reporting period"],
      ["UTILITY-DELIVERY", "Accepted utility delivery and use", "Metered electricity, water, reclaimed water, or wastewater service", "Accepted service capacity or produced units", "Facility, utility, and reporting period"],
      ["RELIABILITY-QUALITY", "Reliability and quality", "Accepted uptime, yield, rejects, interruptions, or corrective actions", "Operating time, starts, or inspected units", "Facility, process, and reporting period"],
      ["WORKFORCE-DELIVERY", "Operating workforce delivery", "Filled qualified roles, completions, placements, or retention", "Named vacancies, enrollment, or operating headcount", "Facility, occupation, and reporting period"]
    ],
    break_rules: ["Do not merge Fab 1, Fab 2, and Fab 3 observations.", "Do not substitute regional supplier or workforce evidence for facility results.", "Do not combine nameplate capacity with accepted output.", "Stop comparison when utility, product, process, or customer scope changes without reconciliation."]
  },
  "61-PROJECT-TORONTO-24-254930": {
    cohort_id: "68-COHORT-002-TORONTO-24-254930",
    cohort_title: "Toronto application 24 254930 delivery and occupancy cohort",
    question: "Can one enacted application support a compatible permit-to-occupancy trail without substituting citywide housing totals for project delivery?",
    measures: [
      ["APPROVED-UNITS", "Enacted and permitted units", "Units in the enacted instrument or issued permit", "Units approved for the same application scope", "Application and instrument date"],
      ["CONSTRUCTION-FLOW", "Construction delivery", "Units started or completed", "Permitted units in the same phase", "Application phase and reporting period"],
      ["OCCUPANCY", "Occupancy delivery", "Units receiving occupancy authorization", "Completed units in the same phase", "Application phase and reporting period"],
      ["CONDITION-COMPLIANCE", "Condition and servicing compliance", "Accepted conditions or servicing milestones", "Applicable named conditions", "Application, condition set, and decision date"]
    ],
    break_rules: ["Do not transfer citywide pipeline counts into the named application.", "Do not treat Council adoption as enactment or a permit.", "Do not merge residential phases with different approved scopes.", "Stop comparison when unit definitions, tenure, phase, or approval scope changes without reconciliation."]
  },
  "61-PROJECT-NOVA-LARGE-LOAD": {
    cohort_id: "68-COHORT-003-NOVA-LARGE-LOAD",
    cohort_title: "Northern Virginia named large-load service cohort",
    question: "Can a named GS-5 customer and accepted transmission path support compatible service, reliability, cost, and compliance outcomes?",
    measures: [
      ["DELIVERED-SERVICE", "Accepted delivered service", "Metered energy or demand served", "Contracted or accepted service capacity", "Named customer, service point, and billing period"],
      ["RELIABILITY", "Service reliability", "Interruptions, curtailments, or unavailable service time", "Service hours or delivered energy", "Named customer, service point, and reporting period"],
      ["COST", "Service cost", "Applicable billed cost or tariff component", "Metered energy, demand, or contracted capacity", "Named customer, tariff version, and billing period"],
      ["COMPLIANCE", "Permit and operating compliance", "Compliant measurements, exceptions, or corrective actions", "Applicable requirements or monitoring events", "Named facility, permit, and reporting period"]
    ],
    break_rules: ["Do not merge different customers or service points.", "Do not treat approved tariff terms as delivered service.", "Do not combine modeled load with metered demand.", "Stop comparison when route, tariff, customer class, capacity obligation, or permit scope changes without reconciliation."]
  },
  "61-PROJECT-SPACE-COAST-AUTHORITY": {
    cohort_id: "68-COHORT-004-SPACE-COAST",
    cohort_title: "Space Coast site-and-operator service cohort",
    question: "Can one site-and-operator authority chain support compatible mission, utilization, reliability, and safety outcomes without transferring evidence across facilities?",
    measures: [
      ["MISSION-SERVICE", "Accepted mission or facility service", "Completed accepted missions or service events", "Authorized or scheduled events for the same site and operator", "Site, operator, mission class, and reporting period"],
      ["UTILIZATION", "Facility utilization", "Occupied or active service time", "Accepted available facility time", "Site, operator, and reporting period"],
      ["RELIABILITY", "Schedule and asset reliability", "Completed events, delays, scrubs, or outages", "Scheduled events or available service time", "Site, asset, operator, and reporting period"],
      ["SAFETY-COMPLIANCE", "Safety and licence compliance", "Reportable events, compliant reviews, or corrective actions", "Authorized events or applicable requirements", "Site, operator, licence, and reporting period"]
    ],
    break_rules: ["Do not transfer evidence among the Shuttle Landing Facility, LC-39A, and SLC-40.", "Do not transfer one operator's authority or performance to another.", "Do not treat environmental review as operator authorization or mission acceptance.", "Stop comparison when licence, mission class, operator, asset, or reporting method changes without reconciliation."]
  },
  "61-PROJECT-NEVADA-LITHIUM": {
    cohort_id: "68-COHORT-005-NEVADA-LITHIUM",
    cohort_title: "Nevada named-project qualified production cohort",
    question: "Can each named project support compatible qualified output, shipment, resource, and compliance outcomes without merging Thacker Pass and Rhyolite Ridge?",
    measures: [
      ["QUALIFIED-OUTPUT", "Accepted qualified output", "Accepted product mass or qualified lots", "Accepted operating time, feed, or designed capacity", "Named project, product, and reporting period"],
      ["SHIPMENT-ACCEPTANCE", "Customer-accepted shipment", "Accepted shipments or product mass", "Produced shipments or product mass", "Named project, customer class, and reporting period"],
      ["RESOURCE-INTENSITY", "Water and energy intensity", "Metered water or energy use", "Accepted product mass", "Named project, process boundary, and reporting period"],
      ["COMPLIANCE", "Operating compliance", "Compliant measurements, exceedances, or corrective actions", "Applicable permit measurements", "Named project, permit, and reporting period"]
    ],
    break_rules: ["Do not combine Thacker Pass and Rhyolite Ridge.", "Do not treat financial close or a permit as operating output.", "Do not merge ore, intermediate, and qualified product units.", "Stop comparison when product specification, process boundary, permit, customer acceptance rule, or denominator changes without reconciliation."]
  },
  "61-ADOPTION-GSA-PQC": {
    cohort_id: "68-COHORT-006-GSA-PQC",
    cohort_title: "GSA post-quantum migration cohort",
    question: "Can named agency systems support compatible inventory, tested cutover, accepted migration, and operating-risk outcomes?",
    measures: [
      ["INVENTORY-COVERAGE", "Cryptographic inventory coverage", "In-scope assets with completed inventory", "In-scope assets", "Named agency, system boundary, and reporting period"],
      ["TESTED-MIGRATION", "Tested migration", "Components passing named interoperability or cutover tests", "Components tested", "Named system, algorithm profile, and test period"],
      ["ACCEPTED-CUTOVER", "Accepted cutover and retirement", "Accepted migrated components or retired legacy components", "Components approved for migration", "Named system and release period"],
      ["OPERATING-RISK", "Operating incidents and rollback", "Incidents, exceptions, or rollback events", "Accepted migrated components or operating time", "Named system, configuration, and reporting period"]
    ],
    break_rules: ["Do not treat the buyer's guide as an agency implementation record.", "Do not combine unlike agencies or system boundaries.", "Do not equate procurement with tested or accepted cutover.", "Stop comparison when inventory scope, algorithm profile, system configuration, or incident definition changes without reconciliation."]
  },
  "61-ADOPTION-NIST-ARIA": {
    cohort_id: "68-COHORT-007-NIST-ARIA",
    cohort_title: "NIST ARIA evaluated-system outcome cohort",
    question: "Can named evaluated systems support compatible authorization, deployment, corrective-action, and mission-effect outcome series?",
    measures: [
      ["EVALUATION-COVERAGE", "Evaluation coverage", "Completed evaluation requirements or test cases", "Applicable requirements or planned test cases", "Named system, version, and evaluation period"],
      ["AUTHORIZATION", "Authorization and deployment", "Accepted authorizations or deployed evaluated configurations", "Evaluated configurations", "Named system, authority, and release period"],
      ["CORRECTIVE-ACTION", "Corrective-action closure", "Closed validated findings", "Findings requiring action", "Named system, finding class, and reporting period"],
      ["MISSION-SERVICE", "Mission or service effect", "Stable accepted mission or service measure", "Declared service population or exposure", "Named system, deployment scope, and reporting period"]
    ],
    break_rules: ["Do not transfer a pilot method to an unevaluated production system.", "Do not combine different models, versions, missions, or authorization scopes.", "Do not treat evaluation completion as deployment or mission benefit.", "Stop comparison when test method, threshold, system version, deployment scope, or service definition changes without reconciliation."]
  },
  "61-ADOPTION-WAYMO-CALIFORNIA": {
    cohort_id: "68-COHORT-008-WAYMO-CALIFORNIA",
    cohort_title: "Waymo California passenger-service outcome cohort",
    question: "Can operator-level public reporting support compatible passenger-service, safety, accessibility, and complaint outcomes for one geography and service scope?",
    measures: [
      ["SERVICE-EXPOSURE", "Passenger-service exposure", "Completed fared driverless trips or passenger miles", "Authorized service time, vehicles, or service population", "Waymo, California geography, and reporting period"],
      ["SAFETY-INTERVENTION", "Safety and intervention", "Reportable events, interventions, recalls, or corrective actions", "Passenger miles, trips, or operating hours", "Waymo, service scope, event definition, and reporting period"],
      ["ACCESSIBILITY", "Accessibility and service completion", "Completed accessible trips or fulfilled requests", "Accessible-service requests or eligible trips", "Waymo, geography, service mode, and reporting period"],
      ["COMPLAINT-QUALITY", "Complaints and service quality", "Substantiated complaints, cancellations, or service failures", "Trips, requests, or passenger-service exposure", "Waymo, geography, complaint definition, and reporting period"]
    ],
    break_rules: ["Do not combine testing-only mileage with fared passenger service.", "Do not combine Waymo with other operators.", "Do not merge geographies or service scopes without a bridge.", "Stop comparison when event definitions, reporting obligations, vehicle fleet, operating domain, or denominator changes without reconciliation."]
  }
};

function measureRecord(cohortId, item, index) {
  const [suffix, label, numerator, denominator, scope] = item;
  return {
    measure_id: `${cohortId}-${String(index + 1).padStart(2, "0")}-${suffix}`,
    label,
    numerator_contract: numerator,
    denominator_contract: denominator,
    scope_contract: scope,
    current_value: null,
    current_period: null,
    series_points: 0,
    admission_state: "Acquisition"
  };
}

const cohortRecords = phase61.records.map((file) => {
  const definition = definitions[file.file_id];
  if (!definition) throw new Error(`Missing Phase 68 definition for ${file.file_id}`);

  const gate = phase63.gate_records.find((record) => record.file_id === file.file_id);
  const matrix = phase64.file_rows.find((record) => record.file_id === file.file_id);
  const packets = phase67.packet_records.filter((record) => record.file_id === file.file_id);
  const recurrencePacket = packets.find((record) => record.stage_id === "66-STAGE-03-REPEAT");
  const outcomePacket = packets.find((record) => record.stage_id === "66-STAGE-04-OUTCOME");
  const recurrenceCell = matrix.stage_cells.find((cell) => cell.stage_id === "64-STAGE-07-REPEAT");
  const outcomeCell = matrix.stage_cells.find((cell) => cell.stage_id === "64-STAGE-08-OUTCOME");

  const compatibilityChecks = dimensions.map((dimension) => {
    if (dimension.dimension_id === "68-DIM-01-IDENTITY") {
      return { ...dimension, decision_state: "Evidence Present", basis: `Phase 61 preserves the exact named identity: ${file.named_entity}.` };
    }
    if (dimension.dimension_id === "68-DIM-02-SCOPE") {
      return { ...dimension, decision_state: "Evidence Present", basis: `The named-file contract preserves project, service, geography, and no-transfer boundaries for ${file.title}.` };
    }
    if (dimension.dimension_id === "68-DIM-03-ACCEPTED-RECURRENCE") {
      return {
        ...dimension,
        decision_state: recurrenceCell.cell_state,
        basis: recurrencePacket.current_basis
      };
    }
    const bases = {
      "68-DIM-04-MEASURE": "No accepted multi-period series preserves one measure definition, numerator, unit, and attribution boundary.",
      "68-DIM-05-DENOMINATOR": "No accepted multi-period series supplies a stable or fully reconciled denominator or exposure basis.",
      "68-DIM-06-PERIOD": "No accepted multi-period series supplies compatible periods, cadence, and missing-period treatment.",
      "68-DIM-07-METHOD": "No accepted multi-period series supplies compatible collection methods, revisions, and corrections.",
      "68-DIM-08-EXCEPTIONS": "No accepted multi-period series preserves failures, adverse observations, breaks, and alternative explanations."
    };
    return { ...dimension, decision_state: "Not Established", basis: bases[dimension.dimension_id] };
  });

  return {
    cohort_id: definition.cohort_id,
    record_kind: "outcome_cohort_admission",
    record_status: "Published",
    cohort_title: definition.cohort_title,
    file_id: file.file_id,
    file_kind: file.kind,
    named_entity: file.named_entity,
    admission_state: "Acquisition",
    admission_decision: "Not Admitted",
    admission_reason: outcomePacket.current_basis,
    candidate_series_question: definition.question,
    gate_id: gate.gate_id,
    recurrence_packet_id: recurrencePacket.packet_id,
    outcome_packet_id: outcomePacket.packet_id,
    phase64_recurrence_state: recurrenceCell.cell_state,
    phase64_outcome_state: outcomeCell.cell_state,
    compatibility_checks: compatibilityChecks,
    candidate_measure_families: definition.measures.map((measure, index) => measureRecord(definition.cohort_id, measure, index)),
    series_break_rules: definition.break_rules,
    exact_next_admission_artifact: outcomePacket.exact_qualifying_artifact,
    source_ids: [...new Set(packets.flatMap((packet) => packet.source_ids))],
    signal_ids: [...new Set(packets.flatMap((packet) => packet.signal_ids))],
    evidence_gap_ids: [...new Set(packets.flatMap((packet) => packet.evidence_gap_ids))],
    canonical_briefing_id: file.canonical_briefing_id,
    qualification_playbook_id: outcomePacket.qualification_playbook_id,
    local_system_ids: file.local_system_ids,
    reader_pathway_ids: file.reader_pathway_ids,
    dependency_map_ids: [
      "dependency-map-validation-acceptance-recurrence-outcome-compatibility",
      "dependency-map-series-admission-is-not-an-outcome"
    ],
    observation_values_created: 0,
    outcome_claim_created: false,
    phase64_cell_change: "none"
  };
});

const checks = cohortRecords.flatMap((record) => record.compatibility_checks);
const phase68 = {
  schema_version: "1.0",
  phase: "68",
  registry_id: "compatible-series-outcome-cohort-registry-001",
  title: "Compatible Series And Outcome Cohort Admission Registry",
  captured_date: "2026-08-23",
  as_of_date: "2026-08-23",
  scope: "Eight named-file cohort admission decisions and thirty-two candidate measure families tested against sixty-four compatibility checks.",
  interpretation_boundary: "A cohort record is an acquisition contract, not a trend, score, benchmark, forecast, causal claim, or statement that qualifying observations exist. Only a human-reviewed same-entity return can add values or admit a cohort.",
  admission_states: ["Admitted", "Provisional / Held", "Acquisition"],
  decision_states: ["Evidence Present", "Partial / Held", "Not Established"],
  compatibility_dimensions: dimensions,
  metrics: {
    named_file_cohorts: cohortRecords.length,
    admitted_cohorts: cohortRecords.filter((record) => record.admission_state === "Admitted").length,
    provisional_or_held_cohorts: cohortRecords.filter((record) => record.admission_state === "Provisional / Held").length,
    acquisition_cohorts: cohortRecords.filter((record) => record.admission_state === "Acquisition").length,
    compatibility_checks: checks.length,
    evidence_present_checks: checks.filter((check) => check.decision_state === "Evidence Present").length,
    partial_or_held_checks: checks.filter((check) => check.decision_state === "Partial / Held").length,
    not_established_checks: checks.filter((check) => check.decision_state === "Not Established").length,
    candidate_measure_families: cohortRecords.reduce((sum, record) => sum + record.candidate_measure_families.length, 0),
    observation_values_created: 0,
    series_points_created: 0,
    phase64_cells_advanced: 0,
    scores_created: 0,
    rankings_created: 0,
    outcome_claims_created: 0
  },
  cohort_records: cohortRecords
};

await writeJson(join(dataRoot, "phase-68-compatible-series-outcome-cohorts.json"), phase68);

const pathwayIds = [...new Set(cohortRecords.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", `${pathwayId.replace("reader-pathway-", "")}.json`);
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, "briefing-outcome-cohort-admission-desk-001"] )];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, "dependency-map-series-admission-is-not-an-outcome"] )];
  await writeJson(path, pathway);
}

const canonicalSection = (record) => `\n## Phase 68 compatible-series admission\n\n[Outcome Cohort Admission Desk 001](/briefings/outcome-cohort-admission-desk-001/) keeps this file in **Acquisition**. Its identity and named scope are established, but its comparable-outcome packet remains **${record.phase64_outcome_state}** and no value or series point has been created.\n\nFour candidate measure families are defined only as future intake contracts: ${record.candidate_measure_families.map((measure) => measure.label).join(", ")}. Admission requires the exact same-entity return, accepted recurring operation, stable measure and denominator, compatible periods and method, and a visible exception and revision trail.\n`;

for (const record of cohortRecords) {
  const path = join(contentRoot, "briefings", `${record.canonical_briefing_id}.mdx`);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 68 compatible-series admission")) {
    body = `${body.trimEnd()}${canonicalSection(record)}`;
    await writeFile(path, body, "utf8");
  }
}

const localFileById = {
  "local-us-southwest-chip-corridor": "local-us-southwest-chip-corridor.mdx",
  "local-ontario-real-estate": "local-ontario-real-estate.mdx",
  "local-northern-virginia-data-center-corridor": "local-northern-virginia-data-center-corridor.mdx",
  "local-florida-space-coast-launch-corridor": "local-florida-space-coast-launch-corridor.mdx",
  "local-nevada-lithium-processing-corridor": "local-nevada-lithium-processing-corridor.mdx"
};

for (const [localId, filename] of Object.entries(localFileById)) {
  const record = cohortRecords.find((candidate) => candidate.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 68 cohort-admission boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 68 cohort-admission boundary\n\n[Outcome Cohort Admission Desk 001](/briefings/outcome-cohort-admission-desk-001/) assigns ${record.cohort_title} to **Acquisition**. The local system has a stable named-file identity, but no admitted comparable-outcome series. Candidate measures remain empty until accepted recurring operation and all eight compatibility dimensions are satisfied by a same-entity artifact and reviewed receipt.\n`;
    await writeFile(path, body, "utf8");
  }
}

const outcomesPath = join(contentRoot, "briefings", "briefing-outcomes-watch-001-what-actually-changed.mdx");
let outcomes = await readFile(outcomesPath, "utf8");
if (!outcomes.includes("## Phase 68 cohort admission")) {
  outcomes = `${outcomes.trimEnd()}\n\n## Phase 68 cohort admission\n\n[Outcome Cohort Admission Desk 001](/briefings/outcome-cohort-admission-desk-001/) tests eight named files against identity, scope, accepted recurrence, measure, denominator, period, method, and exception compatibility. All eight remain in Acquisition, with zero values, series points, scores, rankings, or outcome claims. This makes the absence of a qualified trend visible without converting it into a negative result.\n`;
  await writeFile(outcomesPath, outcomes, "utf8");
}

console.log(`Phase 68 content built: ${cohortRecords.length} cohorts, ${checks.length} compatibility checks, ${phase68.metrics.candidate_measure_families} candidate measure families, ${pathwayIds.length} pathways, 5 local systems, and 0 admitted cohorts.`);
