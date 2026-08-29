import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const desk = await readJson("src", "data", "phase-60c-editorial-desk.json");
const cycle = await readJson("src", "data", "phase-60-operating-cycle.json");
const returns = await readJson("src", "data", "phase-67-evidence-return-envelope-ledger.json");
const projects = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const calendar = await readJson("src", "data", "phase-63-conversion-gate-calendar.json");
const receipts = await readJson("src", "data", "phase-58-change-receipts.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-60c-editorial-desk.json");
const guide = await readText("src", "content", "briefings", "briefing-evidence-cycle-001-wave-60c-field-guide.mdx");
const endpoint = await readText("src", "pages", "data", "phase-60c-editorial-desk.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");

const pathwayIds = [
  "policy-standards-to-implementation.json",
  "autonomy-regulation-to-service.json",
  "advanced-manufacturing-research-to-production.json",
  "local-conversion-southwest-ontario.json",
  "cross-corridor-authorization-to-operation.json",
  "space-coast-plan-to-mission.json"
];
const pathwayRecords = await Promise.all(pathwayIds.map((name) => readJson("src", "content", "reader-pathways", name)));
const linkedSurfaceFiles = [
  ["briefings", "briefing-evidence-cycle-001-operating-baseline.mdx"],
  ["briefings", "briefing-outcomes-watch-001-what-actually-changed.mdx"],
  ["briefings", "briefing-project-conversion-002-toronto-24-254930.mdx"],
  ["briefings", "briefing-project-conversion-004-space-coast-authority.mdx"],
  ["local-systems", "local-ontario-real-estate.mdx"],
  ["local-systems", "local-florida-space-coast-launch-corridor.mdx"]
];
const linkedSurfaceTexts = await Promise.all(linkedSurfaceFiles.map(([directory, name]) => readText("src", "content", directory, name)));

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const sourceIds = new Set((await Promise.all(sourceFiles.map((name) => readJson("src", "content", "sources", name)))).map((record) => record.id));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
const signalIds = new Set(await Promise.all(signalFiles.map(async (name) => (await readText("src", "content", "signals", name)).match(/^id:\s*"([^"]+)"/m)?.[1])));

check(desk.schema_version === "1.0" && desk.phase === "60C", "The editorial desk must identify Wave 60C under schema 1.0.");
check(desk.desk_status === "preflight_ready", "Wave 60C must remain a future-safe preflight package.");
check(desk.operating_window_start === "2026-09-01" && desk.operating_window_end === "2026-09-15", "Wave 60C has the wrong operating window.");
check(desk.records.length === 8, "Wave 60C must publish exactly eight desk records.");
check(new Set(desk.records.map((record) => record.desk_item_id)).size === 8, "Every Wave 60C desk item must have a unique ID.");
check(desk.records.filter((record) => record.item_kind === "cycle_gate").length === 6, "Wave 60C must contain six cycle gates.");
check(desk.records.filter((record) => record.item_kind === "named_file_recheck").length === 2, "Wave 60C must contain two separate named-file rechecks.");

const expectedDateDistribution = { "2026-09-01": 1, "2026-09-09": 2, "2026-09-10": 3, "2026-09-15": 2 };
for (const [date, count] of Object.entries(expectedDateDistribution)) {
  check(desk.records.filter((record) => record.scheduled_check_date === date).length === count, `Wave 60C must contain ${count} desk item(s) on ${date}.`);
}

const waveCycle = cycle.records.filter((record) => record.wave === "60C");
const waveReturns = returns.envelope_records.filter((record) => record.wave === "60C");
const deskCycleIds = desk.records.filter((record) => record.item_kind === "cycle_gate").map((record) => record.cycle_item_id).sort();
const deskReturnIds = desk.records.filter((record) => record.item_kind === "cycle_gate").map((record) => record.return_envelope_id).sort();
check(JSON.stringify(deskCycleIds) === JSON.stringify(waveCycle.map((record) => record.cycle_item_id).sort()), "The desk does not preserve all six Wave 60C cycle identities.");
check(JSON.stringify(deskReturnIds) === JSON.stringify(waveReturns.map((record) => record.envelope_id).sort()), "The desk does not preserve all six Wave 60C return envelopes.");

for (const record of desk.records) {
  check(record.exact_next_artifact && record.qualifying_evidence && record.insufficient_evidence && record.potential_publication_effect, `${record.desk_item_id} lacks its evidence decision contract.`);
  check(record.source_ids.length > 0 && record.source_ids.every((id) => sourceIds.has(id)), `${record.desk_item_id} references a missing source.`);
  check(record.signal_ids.length > 0 && record.signal_ids.every((id) => signalIds.has(id)), `${record.desk_item_id} references a missing signal.`);
  check(record.required_propagation.length >= 7, `${record.desk_item_id} lacks complete propagation assignments.`);
  for (const forbiddenField of ["decision_date", "receipt_id", "receipt_type", "attempted_surfaces", "access_result", "propagation_status"]) {
    check(!(forbiddenField in record), `${record.desk_item_id} precreates future field ${forbiddenField}.`);
  }
}

for (const cycleRecord of waveCycle) {
  check(cycleRecord.decision_status === "scheduled" && cycleRecord.decision_date === null && cycleRecord.receipt_id === null, `${cycleRecord.cycle_item_id} is completed before its real date.`);
}
for (const returnRecord of waveReturns) {
  check(
    returnRecord.envelope_state === "Scheduled" && returnRecord.attempted_surfaces.length === 0 &&
    returnRecord.access_result === null && returnRecord.receipt_id === null && returnRecord.decision_date === null &&
    returnRecord.propagation_status === "not_started",
    `${returnRecord.envelope_id} is not future-safe.`
  );
}

const projectById = new Map(projects.records.map((record) => [record.file_id, record]));
const gateById = new Map(calendar.gate_records.map((record) => [record.gate_id, record]));
for (const record of desk.records.filter((item) => item.item_kind === "named_file_recheck")) {
  const project = projectById.get(record.named_file_id);
  const gate = gateById.get(record.conversion_gate_id);
  check(project?.next_check_date === record.scheduled_check_date, `${record.desk_item_id} changes its Phase 61 date.`);
  check(gate?.next_check_date === record.scheduled_check_date && gate?.file_id === record.named_file_id, `${record.desk_item_id} changes its Phase 63 identity or date.`);
}
const spaceDesk = desk.records.find((record) => record.desk_item_id === "60C-DESK-008");
check(receipts.receipts.some((record) => record.receipt_id === spaceDesk?.prior_receipt_id), "The Space Coast companion recheck must preserve its prior bounded receipt.");
check(projects.gap_operating_register.find((record) => record.gap_id === "gap-013")?.next_check_date === "2026-09-15", "The gap-013 operating register retains the stale August 15 date.");
check(gateById.get("63-GATE-SPACE-COAST-AUTHORITY")?.receipt_state === "Recheck Scheduled After Bounded No Material Change", "The Space Coast gate must expose its bounded recheck state.");

check(/record_status:\s*"Published"/.test(guide), "The Wave 60C field guide must be Published.");
for (const heading of ["The next operating window", "Six cycle gates", "Two companion rechecks", "Decision grammar", "What moves", "What stays held", "Publication sequence", "Evidence boundary"]) {
  check(guide.includes(`## ${heading}`), `The Wave 60C field guide is missing ${heading}.`);
}
check(guide.includes("/data/phase-60c-editorial-desk.json"), "The Wave 60C field guide must link its public export.");
check(pathwayRecords.every((record) => record.briefing_ids.includes("briefing-evidence-cycle-001-wave-60c-field-guide")), "Every assigned Wave 60C reader pathway must link the field guide.");
check(linkedSurfaceTexts.every((content) => content.includes("evidence-cycle-001-wave-60c-field-guide")), "An assigned dossier or local system omits the Wave 60C field guide.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Wave 60C preflight update invents a receipt or decision.");
check(update.next_check_date === "2026-09-01", "The Wave 60C update must point to the September 1 gate.");
check(endpoint.includes('"phase_60c_editorial_desk"') && endpoint.includes("desk.records"), "The Wave 60C public endpoint is incomplete.");
check(dataIndex.includes("Wave 60C Editorial Desk") && dataIndex.includes("/data/phase-60c-editorial-desk.json"), "The public data index omits the Wave 60C desk.");

const scoreKeys = [];
const inspectKeys = (value, path = "desk") => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key.toLowerCase().includes("score") || key.toLowerCase().includes("rank")) scoreKeys.push(`${path}.${key}`);
    inspectKeys(child, `${path}.${key}`);
  }
};
inspectKeys(desk);
check(scoreKeys.length === 0, `Wave 60C creates score or rank fields: ${scoreKeys.join(", ")}`);

if (failures.length) {
  console.error("Phase 60C assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 60C preflight assertions passed: 6 cycle gates, 2 separate named-file rechecks, 8 exact artifact and hold contracts, 6 integrated pathways, 1 field guide, 1 public export, 0 future receipts, 0 stage advances, and no score, ranking, or operating-outcome claim.");
