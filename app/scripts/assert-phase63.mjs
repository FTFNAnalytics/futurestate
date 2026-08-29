import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const calendar = await readJson("src", "data", "phase-63-conversion-gate-calendar.json");
const projects = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const ledgers = await readJson("src", "data", "phase-62-conversion-event-ledgers.json");
const cycle = await readJson("src", "data", "phase-60-operating-cycle.json");
const update = await readJson("src", "content", "updates", "2026-08-11-phase-63-conversion-gate-calendar.json");
const endpoint = await readText("src", "pages", "data", "conversion-gates.json.ts");
const briefingFiles = (await readdir(join(appRoot, "src", "content", "briefings"))).filter((name) => name.endsWith(".mdx"));
const briefings = await Promise.all(briefingFiles.map(async (name) => ({ name, text: await readText("src", "content", "briefings", name) })));
const idFromText = (text) => text.match(/^id:\s*"([^"]+)"/m)?.[1];
const briefingById = new Map(briefings.map((briefing) => [idFromText(briefing.text), briefing.text]));
const projectById = new Map(projects.records.map((record) => [record.file_id, record]));
const ledgerByFile = new Map(ledgers.ledgers.map((ledger) => [ledger.file_id, ledger]));
const eventIds = new Set(ledgers.events.map((event) => event.event_id));
const cycleIds = new Set(cycle.records.map((record) => record.cycle_item_id));
const bindingsByFile = new Map(projects.records.map((project) => [
  project.file_id,
  ledgers.phase_60_cycle_bindings.filter((binding) => binding.file_ids.includes(project.file_id)).map((binding) => binding.cycle_item_id).sort()
]));

check(calendar.phase === "63" && calendar.calendar_id === "named-conversion-gate-calendar-001", "The calendar must identify Phase 63 and its stable ID.");
check(calendar.schema_version === "1.0", "The Phase 63 calendar schema must remain version 1.0.");
check(calendar.as_of_date === "2026-08-23", "The Phase 63 schedule bands must preserve the Wave 60C preflight as-of date.");
check(calendar.gate_records.length === 8, "Phase 63 must publish exactly eight named-file gates.");
check(new Set(calendar.gate_records.map((record) => record.gate_id)).size === 8, "Every Phase 63 gate must have a unique ID.");
check(
  JSON.stringify(calendar.gate_records.map((record) => record.file_id).sort()) === JSON.stringify(projects.records.map((record) => record.file_id).sort()),
  "The Phase 63 gate set must match the Phase 61 named-file set exactly."
);
check(
  JSON.stringify(calendar.calendar_contract.allowed_decision_types) === JSON.stringify(["Change Note", "Watch Note", "Correction", "No Material Change"]),
  "Phase 63 must preserve the four allowed receipt types."
);

for (const gate of calendar.gate_records) {
  const project = projectById.get(gate.file_id);
  const ledger = ledgerByFile.get(gate.file_id);
  const expectedCycleIds = bindingsByFile.get(gate.file_id) ?? [];
  check(Boolean(project && ledger), `${gate.gate_id} references a missing project or ledger.`);
  check(gate.kind === project?.kind && gate.named_entity === project?.named_entity, `${gate.gate_id} changes the named-file identity.`);
  check(gate.current_stage === project?.current_stage, `${gate.gate_id} changes the Phase 61 current stage.`);
  check(gate.latest_event_id === ledger?.event_ids.at(-1) && eventIds.has(gate.latest_event_id), `${gate.gate_id} does not point to the latest Phase 62 event.`);
  check(gate.exact_next_artifact === project?.exact_next_artifact && gate.stop_rule === project?.stop_rule, `${gate.gate_id} changes the exact artifact or stop rule.`);
  check(gate.canonical_briefing_id === project?.canonical_briefing_id, `${gate.gate_id} changes the canonical briefing.`);
  check(JSON.stringify([...gate.phase_60_cycle_ids].sort()) === JSON.stringify(expectedCycleIds), `${gate.gate_id} does not preserve its Phase 62 cycle bindings.`);
  check(gate.phase_60_cycle_ids.every((id) => cycleIds.has(id)), `${gate.gate_id} references a missing Phase 60 cycle item.`);
  if (project?.next_check_date) {
    check(gate.gate_mode === "Dated Check" && gate.next_check_date === project.next_check_date && gate.reopening_trigger === null, `${gate.gate_id} does not preserve its dated gate.`);
    const expectedReceiptState = gate.file_id === "61-PROJECT-SPACE-COAST-AUTHORITY"
      ? "Recheck Scheduled After Bounded No Material Change"
      : "Awaiting Dated Check";
    check(gate.receipt_state === expectedReceiptState, `${gate.gate_id} misstates its dated receipt or recheck state.`);
    check(gate.schedule_band === "Dated Later", `${gate.gate_id} has the wrong August 23 schedule band.`);
  } else {
    check(gate.gate_mode === "Source Trigger" && gate.next_check_date === null && gate.reopening_trigger === project?.reopening_trigger, `${gate.gate_id} invents or changes its reopening date or trigger.`);
    check(gate.schedule_band === "Trigger Based" && gate.receipt_state === "Awaiting Source-Explicit Trigger", `${gate.gate_id} misstates its trigger-based receipt state.`);
  }
  check(gate.reader_pathway_ids.length > 0 && gate.dependency_map_ids.length > 0, `${gate.gate_id} lacks propagation surfaces.`);
}

check(calendar.gate_records.filter((gate) => gate.gate_mode === "Dated Check").length === 4, "Phase 63 must contain four dated gates.");
check(calendar.gate_records.filter((gate) => gate.gate_mode === "Source Trigger").length === 4, "Phase 63 must contain four source-trigger gates.");
check(calendar.gate_records.filter((gate) => gate.schedule_band === "Due This Week").length === 0, "No named-file gate should remain due this week on August 23.");
check(calendar.gate_records.filter((gate) => gate.phase_60_cycle_ids.length > 0).length === 3, "Exactly three named files must carry Phase 60 cycle bindings.");
check(calendar.gate_records.filter((gate) => gate.phase_60_binding_state === "Conditional Bound").length === 1, "Exactly one Phase 60 binding must remain conditional.");

const briefing = briefingById.get("briefing-conversion-gate-calendar-001") ?? "";
check(/record_status:\s*"Published"/.test(briefing), "Conversion Gate Calendar 001 must be Published.");
for (const heading of ["## The dated queue", "## The trigger queue", "## What can append"]) check(briefing.includes(heading), `Conversion Gate Calendar 001 is missing ${heading}.`);
check(briefing.includes("/data/conversion-gates.json"), "Conversion Gate Calendar 001 must link the public export.");
check(update.work_package === "docs/work-packages/phase-63-named-conversion-gate-calendar.md", "The Phase 63 update points to the wrong work package.");
check(update.affected_record_ids.includes("briefing-conversion-gate-calendar-001"), "The Phase 63 update omits its canonical briefing.");
for (const field of ["gate_id", "file_id", "latest_event_id", "gate_mode", "next_check_date", "reopening_trigger", "schedule_band", "exact_next_artifact", "stop_rule", "phase_60_cycle_ids", "receipt_state"]) check(endpoint.includes(field) || endpoint.includes("calendar.gate_records"), `The Phase 63 public endpoint omits ${field}.`);
check(endpoint.includes('"conversion_gates"'), "The Phase 63 endpoint must use the conversion_gates dataset contract.");

const scoreKeys = [];
const inspectKeys = (value, path = "calendar") => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key.toLowerCase().includes("score")) scoreKeys.push(`${path}.${key}`);
    inspectKeys(child, `${path}.${key}`);
  }
};
inspectKeys(calendar);
check(scoreKeys.length === 0, `Phase 63 creates score fields: ${scoreKeys.join(", ")}`);

if (failures.length) {
  console.error("Phase 63 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 63 assertions passed: 8 named-file gates, 4 dated checks, 4 source-explicit triggers, 3 same-entity Phase 60 bindings, 1 bounded Space Coast recheck, 0 due-this-week files, 1 public calendar contract, and no invented date, cross-entity transfer, or score.");
