import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const registry = await readJson("src", "data", "phase-68-compatible-series-outcome-cohorts.json");
const projects = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const calendar = await readJson("src", "data", "phase-63-conversion-gate-calendar.json");
const matrix = await readJson("src", "data", "phase-64-conversion-stage-matrix.json");
const packets = await readJson("src", "data", "phase-67-qualification-packet-registry.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-68-compatible-series-outcome-cohorts.json");
const briefing = await readText("src", "content", "briefings", "briefing-outcome-cohort-admission-desk-001.mdx");
const outcomes = await readText("src", "content", "briefings", "briefing-outcomes-watch-001-what-actually-changed.mdx");
const map = await readJson("src", "content", "dependency-maps", "series-admission-is-not-an-outcome.json");
const endpoint = await readText("src", "pages", "data", "compatible-series-outcome-cohorts.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");

check(registry.schema_version === "1.0" && registry.phase === "68", "The cohort registry must identify Phase 68 under schema 1.0.");
check(registry.cohort_records.length === 8, "Phase 68 must contain exactly eight named-file cohorts.");
check(new Set(registry.cohort_records.map((record) => record.cohort_id)).size === 8, "Every Phase 68 cohort must have a unique ID.");
check(registry.compatibility_dimensions.length === 8, "Phase 68 must define exactly eight compatibility dimensions.");
check(registry.metrics.compatibility_checks === 64, "Phase 68 must publish sixty-four compatibility checks.");
check(registry.metrics.evidence_present_checks === 16, "Phase 68 must preserve sixteen identity and scope checks as Evidence Present.");
check(registry.metrics.partial_or_held_checks === 2, "Phase 68 must preserve exactly two recurrence checks as Partial / Held.");
check(registry.metrics.not_established_checks === 46, "Phase 68 must preserve forty-six checks as Not Established.");
check(registry.metrics.candidate_measure_families === 32, "Phase 68 must define thirty-two candidate measure families.");
check(registry.metrics.admitted_cohorts === 0 && registry.metrics.provisional_or_held_cohorts === 0 && registry.metrics.acquisition_cohorts === 8, "Every Phase 68 cohort must remain in Acquisition.");
check(registry.metrics.observation_values_created === 0 && registry.metrics.series_points_created === 0, "Phase 68 must not create observation values or series points.");
check(registry.metrics.phase64_cells_advanced === 0 && registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0 && registry.metrics.outcome_claims_created === 0, "Phase 68 must not advance cells, score, rank, or claim outcomes.");

const projectById = new Map(projects.records.map((record) => [record.file_id, record]));
const gateById = new Map(calendar.gate_records.map((record) => [record.gate_id, record]));
const matrixById = new Map(matrix.file_rows.map((record) => [record.file_id, record]));
const packetById = new Map(packets.packet_records.map((record) => [record.packet_id, record]));

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const sourceIds = new Set((await Promise.all(sourceFiles.map((name) => readJson("src", "content", "sources", name)))).map((record) => record.id));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
const signalIds = new Set(await Promise.all(signalFiles.map(async (name) => (await readText("src", "content", "signals", name)).match(/^id:\s*"([^"]+)"/m)?.[1])));

for (const record of registry.cohort_records) {
  const project = projectById.get(record.file_id);
  const gate = gateById.get(record.gate_id);
  const row = matrixById.get(record.file_id);
  const recurrencePacket = packetById.get(record.recurrence_packet_id);
  const outcomePacket = packetById.get(record.outcome_packet_id);
  const recurrenceCell = row?.stage_cells.find((cell) => cell.stage_id === "64-STAGE-07-REPEAT");
  const outcomeCell = row?.stage_cells.find((cell) => cell.stage_id === "64-STAGE-08-OUTCOME");

  check(project && project.named_entity === record.named_entity, `${record.cohort_id} changes its Phase 61 identity.`);
  check(gate?.file_id === record.file_id, `${record.cohort_id} changes its Phase 63 gate binding.`);
  check(recurrencePacket?.file_id === record.file_id && recurrencePacket.stage_id === "66-STAGE-03-REPEAT", `${record.cohort_id} has the wrong recurrence packet.`);
  check(outcomePacket?.file_id === record.file_id && outcomePacket.stage_id === "66-STAGE-04-OUTCOME", `${record.cohort_id} has the wrong outcome packet.`);
  check(record.phase64_recurrence_state === recurrenceCell?.cell_state, `${record.cohort_id} changes its Phase 64 recurrence state.`);
  check(record.phase64_outcome_state === outcomeCell?.cell_state && outcomeCell?.cell_state === "Not Established", `${record.cohort_id} changes its Phase 64 outcome state.`);
  check(record.admission_state === "Acquisition" && record.admission_decision === "Not Admitted", `${record.cohort_id} is admitted without qualifying evidence.`);
  check(record.compatibility_checks.length === 8, `${record.cohort_id} must contain eight compatibility checks.`);
  check(record.compatibility_checks[0].decision_state === "Evidence Present" && record.compatibility_checks[1].decision_state === "Evidence Present", `${record.cohort_id} must preserve identity and scope separately.`);
  check(record.compatibility_checks[2].decision_state === recurrenceCell?.cell_state, `${record.cohort_id} does not preserve its recurrence decision.`);
  check(record.compatibility_checks.slice(3).every((item) => item.decision_state === "Not Established"), `${record.cohort_id} invents downstream compatibility.`);
  check(record.candidate_measure_families.length === 4, `${record.cohort_id} must define four candidate measure families.`);
  check(record.candidate_measure_families.every((measure) => measure.current_value === null && measure.current_period === null && measure.series_points === 0 && measure.admission_state === "Acquisition"), `${record.cohort_id} precreates a value or series point.`);
  check(record.series_break_rules.length === 4, `${record.cohort_id} must define four entity-specific break rules.`);
  check(record.source_ids.length > 0 && record.source_ids.every((id) => sourceIds.has(id)), `${record.cohort_id} references a missing source.`);
  check(record.signal_ids.length > 0 && record.signal_ids.every((id) => signalIds.has(id)), `${record.cohort_id} references a missing signal.`);
  check(record.observation_values_created === 0 && record.outcome_claim_created === false && record.phase64_cell_change === "none", `${record.cohort_id} changes evidence state.`);

  const canonical = await readText("src", "content", "briefings", `${record.canonical_briefing_id}.mdx`);
  check(canonical.includes("## Phase 68 compatible-series admission") && canonical.includes("outcome-cohort-admission-desk-001"), `${record.cohort_id} is missing from its canonical dossier.`);
}

const pathwayIds = [...new Set(registry.cohort_records.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 68 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", `${id.replace("reader-pathway-", "")}.json`);
  check(pathway.briefing_ids.includes("briefing-outcome-cohort-admission-desk-001"), `${id} omits the Phase 68 briefing.`);
  check(pathway.dependency_map_ids.includes("dependency-map-series-admission-is-not-an-outcome"), `${id} omits the Phase 68 map.`);
}

const localFiles = [
  "local-us-southwest-chip-corridor.mdx",
  "local-ontario-real-estate.mdx",
  "local-northern-virginia-data-center-corridor.mdx",
  "local-florida-space-coast-launch-corridor.mdx",
  "local-nevada-lithium-processing-corridor.mdx"
];
const localTexts = await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)));
check(localTexts.every((text) => text.includes("## Phase 68 cohort-admission boundary")), "All five local systems must expose the Phase 68 acquisition boundary.");

check(/record_status:\s*"Published"/.test(briefing), "The Phase 68 admission desk must be Published.");
for (const heading of ["Why this desk exists", "Admission result", "Eight compatibility tests", "Thirty-two candidate measure families", "What breaks a series", "Admission workflow", "Publication boundary"]) {
  check(briefing.includes(`## ${heading}`), `The Phase 68 briefing is missing ${heading}.`);
}
check(briefing.includes("/data/compatible-series-outcome-cohorts.json"), "The Phase 68 briefing must link its public export.");
check(outcomes.includes("## Phase 68 cohort admission"), "Outcomes Watch must expose the Phase 68 admission result.");
check(map.record_status === "Published" && map.nodes.length === 7 && map.links.length === 6, "The Phase 68 dependency map is incomplete.");
check(map.what_this_map_does_not_prove.some((item) => item.includes("score")), "The Phase 68 map must reject scoring and ranking.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 68 update invents a receipt or decision.");
check(endpoint.includes('"compatible_series_outcome_cohorts"') && endpoint.includes("registry.cohort_records"), "The Phase 68 public endpoint is incomplete.");
check(dataIndex.includes("Compatible Series And Outcome Cohorts") && dataIndex.includes("/data/compatible-series-outcome-cohorts.json"), "The public data index omits the Phase 68 registry.");

if (failures.length) {
  console.error("Phase 68 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 68 assertions passed: 8 acquisition cohorts, 64 compatibility checks (16 Evidence Present / 2 Partial or Held / 46 Not Established), 32 empty measure families, 10 pathways, 5 local systems, 0 admitted cohorts, 0 values, 0 series points, 0 cell advances, and no score, ranking, or outcome claim.");
