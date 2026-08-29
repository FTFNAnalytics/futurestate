import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const phase68 = await readJson(join(dataRoot, "phase-68-compatible-series-outcome-cohorts.json"));

const requiredObservationFields = [
  ["69-FIELD-01-SPEC", "measurement_specification_id", "The exact Phase 69 measurement specification."],
  ["69-FIELD-02-COHORT", "cohort_id", "The exact Phase 68 cohort identity."],
  ["69-FIELD-03-ENTITY", "named_entity", "The same named entity, facility, project, service, or adoption case."],
  ["69-FIELD-04-SOURCE", "source_id", "A reviewed public source identity."],
  ["69-FIELD-05-AUTHORITY", "issuing_authority", "The authority responsible for the artifact and measure."],
  ["69-FIELD-06-ARTIFACT", "artifact_locator", "A stable URL, capture, filing, report, dataset, or receipt locator."],
  ["69-FIELD-07-OBSERVED", "observed_date", "The date the value or status was observed or reported."],
  ["69-FIELD-08-PERIOD-START", "period_start", "The first day or explicit start boundary of the observation period."],
  ["69-FIELD-09-PERIOD-END", "period_end", "The last day or explicit end boundary of the observation period."],
  ["69-FIELD-10-NUMERATOR", "numerator_value", "The source-declared numerator or observed quantity."],
  ["69-FIELD-11-NUMERATOR-UNIT", "numerator_unit", "The source-declared numerator unit; editorial inference is prohibited."],
  ["69-FIELD-12-DENOMINATOR", "denominator_value_or_na", "The source-declared denominator or an explicit not-applicable basis."],
  ["69-FIELD-13-DENOMINATOR-UNIT", "denominator_unit_or_na", "The denominator unit or explicit not-applicable basis."],
  ["69-FIELD-14-METHOD", "method_version", "The collection, calculation, test, or reporting method and version."],
  ["69-FIELD-15-ACCEPTANCE", "acceptance_and_recurrence_basis", "The same-entity acceptance and recurring-operation basis."],
  ["69-FIELD-16-EXCEPTIONS", "exceptions_and_adverse_observations", "Failures, outages, rejected units, exclusions, and adverse observations, including an explicit none statement when supported."],
  ["69-FIELD-17-REVISION", "revision_and_correction_status", "Revision, restatement, correction, supersession, or version status."],
  ["69-FIELD-18-PROPAGATION", "required_propagation", "The complete reader-surface propagation assignment after review."],
].map(([field_id, field_name, requirement]) => ({ field_id, field_name, requirement }));

const breakTaxonomy = [
  ["69-BREAK-01-IDENTITY", "Entity or identity change"],
  ["69-BREAK-02-SCOPE", "Facility, project, service, geography, population, customer, product, or stage change"],
  ["69-BREAK-03-UNIT", "Numerator or denominator unit change"],
  ["69-BREAK-04-DENOMINATOR", "Denominator or exposure definition change"],
  ["69-BREAK-05-PERIOD", "Period, cadence, partial-period, or missing-period change"],
  ["69-BREAK-06-METHOD", "Collection, calculation, test, threshold, or method-version change"],
  ["69-BREAK-07-AUTHORITY", "Issuing authority, acceptance authority, or reporting obligation change"],
  ["69-BREAK-08-REVISION", "Revision, correction, restatement, or supersession"],
  ["69-BREAK-09-EXCEPTION", "Failure, outage, rejection, exclusion, adverse observation, or hidden exception"],
  ["69-BREAK-10-ATTRIBUTION", "Attribution boundary or alternative-explanation change"]
].map(([break_type_id, label]) => ({ break_type_id, label }));

const specificationRecords = [];
const intakeEnvelopes = [];

for (const cohort of phase68.cohort_records) {
  for (const measure of cohort.candidate_measure_families) {
    const sequence = specificationRecords.length + 1;
    const padded = String(sequence).padStart(3, "0");
    const specificationId = `69-MS-${padded}`;
    const slug = `69-ms-${padded}-${cohort.cohort_id.toLowerCase().replace(/^68-cohort-\d+-/, "").replaceAll("_", "-")}-${measure.label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    const envelopeId = `69-INTAKE-${padded}`;

    specificationRecords.push({
      specification_id: specificationId,
      slug,
      record_kind: "measurement_specification",
      record_status: "Published",
      specification_state: "Awaiting First Qualifying Observation",
      cohort_id: cohort.cohort_id,
      file_id: cohort.file_id,
      file_kind: cohort.file_kind,
      named_entity: cohort.named_entity,
      measure_id: measure.measure_id,
      measure_label: measure.label,
      numerator_contract: measure.numerator_contract,
      denominator_contract: measure.denominator_contract,
      scope_contract: measure.scope_contract,
      unit_contract: "Use only source-declared numerator and denominator units. Do not infer a unit, convert a unit, normalize a rate, or join unlike units without a documented public bridge and independent review.",
      period_contract: "The artifact must declare observation and coverage dates, cadence, partial periods, missing periods, and any revision to the period basis.",
      method_contract: "The artifact must declare the collection, calculation, test, or reporting method and its version, including corrections and restatements.",
      exception_contract: "Failures, outages, rejected units, exclusions, adverse observations, and alternative explanations must remain visible; silence cannot be converted into an explicit none statement.",
      acceptance_and_recurrence_contract: "A value may enter intake only for the same named entity. Cohort admission still requires accepted recurring operation and the complete Phase 68 compatibility decision.",
      required_field_ids: requiredObservationFields.map((field) => field.field_id),
      prospective_break_type_ids: breakTaxonomy.map((item) => item.break_type_id),
      entity_specific_break_rules: cohort.series_break_rules,
      exact_next_artifact: cohort.exact_next_admission_artifact,
      source_ids: cohort.source_ids,
      signal_ids: cohort.signal_ids,
      evidence_gap_ids: cohort.evidence_gap_ids,
      canonical_briefing_id: cohort.canonical_briefing_id,
      qualification_playbook_id: cohort.qualification_playbook_id,
      reader_pathway_ids: cohort.reader_pathway_ids,
      local_system_ids: cohort.local_system_ids,
      dependency_map_ids: [
        "dependency-map-series-admission-is-not-an-outcome",
        "dependency-map-measurement-specification-is-not-evidence"
      ],
      current_observation_count: 0,
      current_series_point_count: 0,
      accepted_observation_ids: [],
      receipt_ids: [],
      current_value: null,
      current_period: null,
      minimum_observations_for_series: null,
      auto_admission_allowed: false,
      phase64_cell_change: "none"
    });

    intakeEnvelopes.push({
      envelope_id: envelopeId,
      slug: `69-intake-${padded}-${cohort.cohort_id.toLowerCase().replace(/^68-cohort-\d+-/, "")}`,
      record_kind: "observation_intake_envelope",
      record_status: "Published",
      envelope_state: "Empty",
      specification_id: specificationId,
      cohort_id: cohort.cohort_id,
      file_id: cohort.file_id,
      measure_id: measure.measure_id,
      required_field_ids: requiredObservationFields.map((field) => field.field_id),
      reject_if: [
        "The entity, cohort, specification, source, authority, artifact, observed date, or period is missing or inconsistent.",
        "The numerator, denominator or explicit not-applicable basis, or source-declared units are missing.",
        "The method, acceptance and recurrence basis, exception trail, revision status, or propagation assignment is incomplete.",
        "The payload attempts unit inference, silent conversion, cross-entity transfer, missing-period imputation, automatic cohort admission, or direct publication."
      ],
      submitted_artifact: null,
      observation_payload: null,
      attempted_source: null,
      access_result: null,
      decision_date: null,
      receipt_id: null,
      observation_id: null,
      propagation_status: "not_started",
      auto_publication_allowed: false
    });
  }
}

const breakRegisters = phase68.cohort_records.map((cohort, index) => ({
  break_register_id: `69-BREAK-REGISTER-${String(index + 1).padStart(3, "0")}`,
  record_kind: "series_break_register",
  record_status: "Published",
  register_state: "No Admitted Series",
  cohort_id: cohort.cohort_id,
  file_id: cohort.file_id,
  named_entity: cohort.named_entity,
  prospective_break_type_ids: breakTaxonomy.map((item) => item.break_type_id),
  entity_specific_break_rules: cohort.series_break_rules,
  bridge_requirement: "A public bridge must name both series segments, the exact changed field, the transformation or non-comparability decision, uncertainty, affected periods, authority, reviewer, receipt, and propagation. A bridge can preserve two segments without making them comparable.",
  actual_break_events: [],
  bridge_decisions: [],
  admitted_series_ids: [],
  unresolved_break_count: 0,
  observation_count: 0,
  next_action: cohort.exact_next_admission_artifact,
  phase64_cell_change: "none"
}));

const registry = {
  schema_version: "1.0",
  phase: "69",
  registry_id: "measurement-specification-observation-intake-registry-001",
  title: "Measurement Specification, Observation Intake And Series Break Registry",
  captured_date: "2026-08-23",
  as_of_date: "2026-08-23",
  scope: "Thirty-two measurement specifications, thirty-two empty observation-intake envelopes, and eight prospective series-break registers for the eight Phase 68 acquisition cohorts.",
  interpretation_boundary: "A specification defines a future evidence contract. An empty envelope is not an attempted check. A prospective break rule is not an observed break. No object in this registry is an observation, value, trend, admitted series, score, comparison, causal claim, or outcome.",
  required_observation_fields: requiredObservationFields,
  series_break_taxonomy: breakTaxonomy,
  metrics: {
    measurement_specifications: specificationRecords.length,
    intake_envelopes: intakeEnvelopes.length,
    series_break_registers: breakRegisters.length,
    required_fields_per_observation: requiredObservationFields.length,
    prospective_break_types: breakTaxonomy.length,
    empty_envelopes: intakeEnvelopes.filter((record) => record.envelope_state === "Empty").length,
    observations_created: 0,
    values_created: 0,
    series_points_created: 0,
    actual_break_events_created: 0,
    admitted_series_created: 0,
    phase64_cells_advanced: 0,
    scores_created: 0,
    rankings_created: 0,
    outcome_claims_created: 0
  },
  measurement_specifications: specificationRecords,
  observation_intake_envelopes: intakeEnvelopes,
  series_break_registers: breakRegisters
};

await writeJson(join(dataRoot, "phase-69-measurement-observation-break-registry.json"), registry);

const pathwayIds = [...new Set(phase68.cohort_records.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", `${pathwayId.replace("reader-pathway-", "")}.json`);
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, "briefing-measurement-dictionary-001", "briefing-series-break-adjudication-001"] )];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, "dependency-map-measurement-specification-is-not-evidence"] )];
  await writeJson(path, pathway);
}

for (const cohort of phase68.cohort_records) {
  const specs = specificationRecords.filter((record) => record.cohort_id === cohort.cohort_id);
  const path = join(contentRoot, "briefings", `${cohort.canonical_briefing_id}.mdx`);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 69 measurement and observation intake")) {
    body = `${body.trimEnd()}\n\n## Phase 69 measurement and observation intake\n\n[Measurement Dictionary 001](/briefings/measurement-dictionary-001/) assigns four Published specifications to this file: ${specs.map((record) => `[${record.specification_id}](/evidence/measurements/${record.slug}/)`).join(", ")}. Each specification has an empty intake envelope, eighteen required observation fields, ten prospective break types, null value and period fields, and zero observations or series points.\n\n[Series Break Adjudication 001](/briefings/series-break-adjudication-001/) preserves the file's four entity-specific stop rules. No admitted series or actual break event exists in the registry, so no bridge, trend, comparison, or outcome can be published.\n`;
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
  const cohort = phase68.cohort_records.find((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 69 observation-intake boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 69 observation-intake boundary\n\nThe [Measurement Dictionary](/evidence/measurements/) exposes four empty specifications for ${cohort.named_entity}. Every intake envelope remains empty and every current value, period, observation count, and series-point count remains null or zero. The local system cannot supply, infer, normalize, or bridge a project-level observation.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-outcome-cohort-admission-desk-001.mdx"]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 69 measurement intake")) {
    body = `${body.trimEnd()}\n\n## Phase 69 measurement intake\n\n[Measurement Dictionary 001](/briefings/measurement-dictionary-001/) and [Series Break Adjudication 001](/briefings/series-break-adjudication-001/) turn the thirty-two Phase 68 candidate measures into executable specifications, empty intake envelopes, and prospective break registers. They create zero observations, values, series points, actual break events, admitted series, or outcomes.\n`;
    await writeFile(path, body, "utf8");
  }
}

console.log(`Phase 69 content built: ${specificationRecords.length} measurement specifications, ${intakeEnvelopes.length} empty intake envelopes, ${breakRegisters.length} break registers, ${requiredObservationFields.length} required fields, ${breakTaxonomy.length} break types, ${pathwayIds.length} pathways, and 0 observations.`);
