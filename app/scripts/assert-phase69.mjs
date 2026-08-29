import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const registry = await readJson("src", "data", "phase-69-measurement-observation-break-registry.json");
const phase68 = await readJson("src", "data", "phase-68-compatible-series-outcome-cohorts.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-69-measurement-observation-intake.json");
const dictionary = await readText("src", "content", "briefings", "briefing-measurement-dictionary-001.mdx");
const adjudication = await readText("src", "content", "briefings", "briefing-series-break-adjudication-001.mdx");
const outcomes = await readText("src", "content", "briefings", "briefing-outcomes-watch-001-what-actually-changed.mdx");
const phase68Briefing = await readText("src", "content", "briefings", "briefing-outcome-cohort-admission-desk-001.mdx");
const map = await readJson("src", "content", "dependency-maps", "measurement-specification-is-not-evidence.json");
const endpoint = await readText("src", "pages", "data", "measurement-specifications.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");
const registryPage = await readText("src", "pages", "evidence", "measurements", "index.astro");
const detailPage = await readText("src", "pages", "evidence", "measurements", "[id].astro");
const sitemapSource = await readText("src", "pages", "sitemap.xml.ts");

check(registry.schema_version === "1.0" && registry.phase === "69", "The Phase 69 registry must identify schema 1.0 and Phase 69.");
check(registry.required_observation_fields.length === 18 && registry.series_break_taxonomy.length === 10, "Phase 69 must define eighteen observation fields and ten break types.");
check(registry.measurement_specifications.length === 32 && registry.observation_intake_envelopes.length === 32 && registry.series_break_registers.length === 8, "Phase 69 must contain 32 specifications, 32 envelopes, and 8 break registers.");
check(new Set(registry.measurement_specifications.map((record) => record.specification_id)).size === 32, "Every measurement specification ID must be unique.");
check(new Set(registry.measurement_specifications.map((record) => record.slug)).size === 32, "Every measurement specification slug must be unique.");
check(new Set(registry.observation_intake_envelopes.map((record) => record.envelope_id)).size === 32, "Every intake envelope ID must be unique.");
check(new Set(registry.series_break_registers.map((record) => record.cohort_id)).size === 8, "Every Phase 68 cohort must have one break register.");

const fieldIds = registry.required_observation_fields.map((field) => field.field_id);
const breakTypeIds = registry.series_break_taxonomy.map((item) => item.break_type_id);
const phase68Measures = phase68.cohort_records.flatMap((cohort) => cohort.candidate_measure_families.map((measure) => ({ cohort, measure })));
check(phase68Measures.length === 32, "The inherited Phase 68 registry must still expose exactly 32 measure families.");

for (const { cohort, measure } of phase68Measures) {
  const matches = registry.measurement_specifications.filter((spec) => spec.measure_id === measure.measure_id);
  check(matches.length === 1, `${measure.measure_id} must map to exactly one Phase 69 specification.`);
  const spec = matches[0];
  if (!spec) continue;
  check(spec.cohort_id === cohort.cohort_id && spec.file_id === cohort.file_id && spec.named_entity === cohort.named_entity, `${spec.specification_id} changes its Phase 68 identity.`);
  check(spec.measure_label === measure.label && spec.numerator_contract === measure.numerator_contract && spec.denominator_contract === measure.denominator_contract && spec.scope_contract === measure.scope_contract, `${spec.specification_id} changes its Phase 68 measure contract.`);
  check(JSON.stringify(spec.required_field_ids) === JSON.stringify(fieldIds), `${spec.specification_id} does not require all eighteen fields.`);
  check(JSON.stringify(spec.prospective_break_type_ids) === JSON.stringify(breakTypeIds), `${spec.specification_id} does not preserve all ten break types.`);
  check(spec.entity_specific_break_rules.length === 4, `${spec.specification_id} must preserve four entity-specific break rules.`);
  check(spec.specification_state === "Awaiting First Qualifying Observation" && spec.current_observation_count === 0 && spec.current_series_point_count === 0, `${spec.specification_id} precreates an observation or series point.`);
  check(spec.current_value === null && spec.current_period === null && spec.minimum_observations_for_series === null, `${spec.specification_id} invents a value, period, or admission threshold.`);
  check(spec.accepted_observation_ids.length === 0 && spec.receipt_ids.length === 0 && spec.auto_admission_allowed === false && spec.phase64_cell_change === "none", `${spec.specification_id} invents a receipt, admission, or Phase 64 change.`);

  const envelope = registry.observation_intake_envelopes.find((record) => record.specification_id === spec.specification_id);
  check(envelope?.cohort_id === spec.cohort_id && envelope?.measure_id === spec.measure_id && envelope?.envelope_state === "Empty", `${spec.specification_id} has no exact empty envelope.`);
  check(envelope && ["submitted_artifact", "observation_payload", "attempted_source", "access_result", "decision_date", "receipt_id", "observation_id"].every((key) => envelope[key] === null), `${spec.specification_id} envelope contains a premature attempt, decision, or receipt.`);
  check(envelope?.propagation_status === "not_started" && envelope?.auto_publication_allowed === false, `${spec.specification_id} envelope enables premature propagation.`);
}

for (const cohort of phase68.cohort_records) {
  const register = registry.series_break_registers.find((record) => record.cohort_id === cohort.cohort_id);
  check(register?.file_id === cohort.file_id && register?.named_entity === cohort.named_entity, `${cohort.cohort_id} has no exact break register.`);
  check(register?.register_state === "No Admitted Series" && register?.prospective_break_type_ids.length === 10 && register?.entity_specific_break_rules.length === 4, `${cohort.cohort_id} break register is incomplete.`);
  check(register && register.actual_break_events.length === 0 && register.bridge_decisions.length === 0 && register.admitted_series_ids.length === 0 && register.observation_count === 0 && register.unresolved_break_count === 0, `${cohort.cohort_id} invents a break, bridge, observation, or admitted series.`);
  check(register?.phase64_cell_change === "none", `${cohort.cohort_id} changes Phase 64 state.`);
}

const pathwayIds = [...new Set(registry.measurement_specifications.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 69 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", `${id.replace("reader-pathway-", "")}.json`);
  check(pathway.briefing_ids.includes("briefing-measurement-dictionary-001") && pathway.briefing_ids.includes("briefing-series-break-adjudication-001"), `${id} omits a Phase 69 briefing.`);
  check(pathway.dependency_map_ids.includes("dependency-map-measurement-specification-is-not-evidence"), `${id} omits the Phase 69 map.`);
}

const canonicalIds = [...new Set(registry.measurement_specifications.map((record) => record.canonical_briefing_id))];
check(canonicalIds.length === 8, "Phase 69 must deepen eight canonical named files.");
for (const id of canonicalIds) check((await readText("src", "content", "briefings", `${id}.mdx`)).includes("## Phase 69 measurement and observation intake"), `${id} omits Phase 69.`);

const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
check(localFiles.length === 5 && (await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)))).every((text) => text.includes("## Phase 69 observation-intake boundary")), "All five local systems must expose the Phase 69 boundary.");

for (const [text, headings] of [[dictionary, ["The measurement layer", "Eighteen required fields", "Unit and denominator boundary", "Observation workflow", "Reject conditions", "Publication boundary"]], [adjudication, ["Ten break types", "Four possible decisions", "Minimum bridge record", "Entity-specific boundaries", "Publication boundary"]]]) {
  check(/record_status:\s*"Published"/.test(text), "Both Phase 69 briefings must be Published.");
  headings.forEach((heading) => check(text.includes(`## ${heading}`), `A Phase 69 briefing is missing ${heading}.`));
}
check(outcomes.includes("## Phase 69 measurement intake") && phase68Briefing.includes("## Phase 69 measurement intake"), "Outcomes Watch or the cohort desk omits the Phase 69 intake layer.");
check(map.record_status === "Published" && map.nodes.length === 7 && map.links.length === 6, "The Phase 69 dependency map is incomplete.");
check(map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("outcome")), "The Phase 69 map must reject outcome inference.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 69 update invents a receipt or decision.");
check(endpoint.includes('"measurement_specifications"') && endpoint.includes("registry.observation_intake_envelopes") && endpoint.includes("registry.series_break_registers"), "The Phase 69 public endpoint is incomplete.");
check(dataIndex.includes("Measurement Specifications") && dataIndex.includes("/data/measurement-specifications.json"), "The public data index omits the Phase 69 registry.");
check(registryPage.includes("Search the measurement specifications") && registryPage.includes("data-measurement-registry") && registryPage.includes("name=\"cohort\""), "The searchable Phase 69 registry page is incomplete.");
check(detailPage.includes("Eighteen fields before human review") && detailPage.includes("A specification is not an observation"), "The Phase 69 detail template omits its intake boundary.");
check(sitemapSource.includes("measurementRegistry.measurement_specifications") && sitemapSource.includes('"/evidence/measurements/"'), "The sitemap source omits Phase 69 measurement routes.");
check(phase68.metrics.acquisition_cohorts === 8 && phase68.metrics.observation_values_created === 0 && phase68.metrics.series_points_created === 0 && phase68.cohort_records.every((record) => record.admission_state === "Acquisition"), "Phase 69 changes the Phase 68 evidence baseline.");
check(registry.metrics.observations_created === 0 && registry.metrics.values_created === 0 && registry.metrics.series_points_created === 0 && registry.metrics.actual_break_events_created === 0 && registry.metrics.admitted_series_created === 0, "Phase 69 must create no real evidence state.");
check(registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0 && registry.metrics.outcome_claims_created === 0, "Phase 69 must not score, rank, or claim outcomes.");

if (failures.length) {
  console.error("Phase 69 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 69 assertions passed: 32 measurement specifications, 32 empty intake envelopes, 8 break registers, 18 required fields, 10 break types, 10 pathways, 5 local systems, and 0 observations, values, actual breaks, series points, scores, rankings, or outcome claims.");
