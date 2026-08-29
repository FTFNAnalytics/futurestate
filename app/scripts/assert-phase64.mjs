import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const matrix = await readJson("src", "data", "phase-64-conversion-stage-matrix.json");
const projects = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const ledgers = await readJson("src", "data", "phase-62-conversion-event-ledgers.json");
const gates = await readJson("src", "data", "phase-63-conversion-gate-calendar.json");
const map = await readJson("src", "content", "dependency-maps", "conversion-stage-is-not-outcome.json");
const pathway = await readJson("src", "content", "reader-pathways", "cross-corridor-authorization-to-operation.json");
const update = await readJson("src", "content", "updates", "2026-08-11-phase-64-conversion-stage-matrix.json");
const endpoint = await readText("src", "pages", "data", "conversion-stage-matrix.json.ts");
const briefingFiles = (await readdir(join(appRoot, "src", "content", "briefings"))).filter((name) => name.endsWith(".mdx"));
const briefings = await Promise.all(briefingFiles.map(async (name) => ({ name, text: await readText("src", "content", "briefings", name) })));
const idFromText = (text) => text.match(/^id:\s*"([^"]+)"/m)?.[1];
const briefingById = new Map(briefings.map((briefing) => [idFromText(briefing.text), briefing.text]));
const projectById = new Map(projects.records.map((record) => [record.file_id, record]));
const gateById = new Map(gates.gate_records.map((record) => [record.gate_id, record]));
const eventById = new Map(ledgers.events.map((event) => [event.event_id, event]));
const stageIds = matrix.stage_taxonomy.map((stage) => stage.stage_id);
const stageIdSet = new Set(stageIds);
const cells = matrix.file_rows.flatMap((row) => row.stage_cells.map((cell) => ({ ...cell, file_id: row.file_id })));

check(matrix.phase === "64" && matrix.matrix_id === "conversion-stage-matrix-001", "The matrix must identify Phase 64 and its stable ID.");
check(matrix.schema_version === "1.0", "The Phase 64 matrix schema must remain version 1.0.");
check(matrix.stage_taxonomy.length === 8 && stageIdSet.size === 8, "Phase 64 must define eight unique evidence-stage questions.");
check(matrix.stage_taxonomy.every((stage, index) => stage.sequence === index + 1 && stage.label && stage.question), "The Phase 64 stage taxonomy must be ordered and complete.");
check(JSON.stringify(matrix.cell_states) === JSON.stringify(["Evidence Present", "Partial / Held", "Not Established"]), "Phase 64 must preserve the three qualitative cell states.");
check(matrix.file_rows.length === 8, "Phase 64 must contain eight named-file rows.");
check(cells.length === 64, "Phase 64 must contain exactly sixty-four stage cells.");
check(new Set(cells.map((cell) => `${cell.file_id}|${cell.stage_id}`)).size === 64, "Every file-stage cell must be unique.");
check(
  JSON.stringify(matrix.file_rows.map((row) => row.file_id).sort()) === JSON.stringify(projects.records.map((record) => record.file_id).sort()),
  "The Phase 64 row set must match the Phase 61 named-file set exactly."
);

for (const row of matrix.file_rows) {
  const project = projectById.get(row.file_id);
  const gate = gateById.get(row.gate_id);
  check(Boolean(project && gate), `${row.file_id} references a missing named file or Phase 63 gate.`);
  check(row.kind === project?.kind && row.named_entity === project?.named_entity, `${row.file_id} changes the named-file identity.`);
  check(gate?.file_id === row.file_id, `${row.file_id} points to another file's Phase 63 gate.`);
  check(Boolean(row.current_boundary && stageIdSet.has(row.next_decisive_stage_id)), `${row.file_id} lacks its bounded next-stage account.`);
  check(row.stage_cells.length === 8, `${row.file_id} does not answer all eight stage questions.`);
  check(JSON.stringify(row.stage_cells.map((cell) => cell.stage_id)) === JSON.stringify(stageIds), `${row.file_id} changes the stage order.`);
  for (const cell of row.stage_cells) {
    check(matrix.cell_states.includes(cell.cell_state), `${row.file_id} ${cell.stage_id} uses an unsupported cell state.`);
    check(Boolean(cell.basis), `${row.file_id} ${cell.stage_id} lacks its evidence basis.`);
    check(cell.evidence_event_ids.every((id) => eventById.get(id)?.file_id === row.file_id), `${row.file_id} ${cell.stage_id} uses a missing or cross-file event.`);
    if (cell.cell_state === "Evidence Present" || cell.cell_state === "Partial / Held") check(cell.evidence_event_ids.length > 0, `${row.file_id} ${cell.stage_id} has an evidence-bearing state without an event.`);
  }
}

const stateCounts = Object.fromEntries(matrix.cell_states.map((state) => [state, cells.filter((cell) => cell.cell_state === state).length]));
check(stateCounts["Evidence Present"] === 16, `Phase 64 must contain sixteen Evidence Present cells, found ${stateCounts["Evidence Present"]}.`);
check(stateCounts["Partial / Held"] === 8, `Phase 64 must contain eight Partial / Held cells, found ${stateCounts["Partial / Held"]}.`);
check(stateCounts["Not Established"] === 40, `Phase 64 must contain forty Not Established cells, found ${stateCounts["Not Established"]}.`);
check(cells.filter((cell) => cell.stage_id === "64-STAGE-08-OUTCOME").every((cell) => cell.cell_state === "Not Established"), "Every Phase 64 comparable-outcome cell must remain Not Established.");

const briefing = briefingById.get("briefing-conversion-stage-matrix-001") ?? "";
check(/record_status:\s*"Published"/.test(briefing), "Conversion Stage Matrix 001 must be Published.");
for (const heading of ["## One matrix, eight different systems", "## What the cells say", "## How to use the matrix"]) check(briefing.includes(heading), `Conversion Stage Matrix 001 is missing ${heading}.`);
check(briefing.includes("sixty-four") && briefing.includes("sixteen") && briefing.includes("eight") && briefing.includes("forty"), "The Phase 64 briefing does not state the verified cell distribution.");
check(map.id === "dependency-map-conversion-stage-is-not-outcome" && map.record_status === "Published", "Conversion Stage Is Not Outcome must be a Published dependency map.");
check(map.nodes.length === 9 && map.links.length === 8, "The Phase 64 dependency map must expose eight stages and the no-transfer boundary.");
check(map.what_this_map_does_not_prove.some((item) => item.includes("rank")), "The Phase 64 map must preserve its no-ranking boundary.");
check(pathway.briefing_ids.includes("briefing-conversion-gate-calendar-001") && pathway.briefing_ids.includes("briefing-conversion-stage-matrix-001"), "The cross-corridor pathway must link both new briefings.");
check(pathway.dependency_map_ids.includes("dependency-map-conversion-stage-is-not-outcome"), "The cross-corridor pathway must link the Phase 64 map.");
check(update.work_package === "docs/work-packages/phase-64-conversion-stage-matrix.md", "The Phase 64 update points to the wrong work package.");
check(endpoint.includes('"conversion_stage_matrix"') && endpoint.includes("flatMap"), "The Phase 64 public endpoint must expose the flattened matrix contract.");

const scoreKeys = [];
const inspectKeys = (value, path = "matrix") => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key.toLowerCase().includes("score")) scoreKeys.push(`${path}.${key}`);
    inspectKeys(child, `${path}.${key}`);
  }
};
inspectKeys(matrix);
check(scoreKeys.length === 0, `Phase 64 creates score fields: ${scoreKeys.join(", ")}`);

if (failures.length) {
  console.error("Phase 64 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 64 assertions passed: 8 named-file rows, 8 ordered evidence questions, 64 unique cells (16 Evidence Present, 8 Partial / Held, 40 Not Established), 8 open outcome cells, 1 Published map, 1 public matrix contract, and no rank, score, cross-file transfer, or unsupported outcome claim.");
