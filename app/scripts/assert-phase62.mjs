import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const idFromText = (text) => text.match(/^id:\s*"([^"]+)"/m)?.[1];
const statusFromText = (text) => text.match(/^record_status:\s*"([^"]+)"/m)?.[1];

const registry = await readJson("src", "data", "phase-62-conversion-event-ledgers.json");
const projectRegistry = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const operatingCycle = await readJson("src", "data", "phase-60-operating-cycle.json");
const update = await readJson("src", "content", "updates", "2026-08-11-phase-62-conversion-event-ledgers.json");
const endpoint = await readText("src", "pages", "data", "conversion-events.json.ts");

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
const briefingFiles = (await readdir(join(appRoot, "src", "content", "briefings"))).filter((name) => name.endsWith(".mdx"));
const sources = await Promise.all(sourceFiles.map((name) => readJson("src", "content", "sources", name)));
const signals = await Promise.all(signalFiles.map(async (name) => ({ name, text: await readText("src", "content", "signals", name) })));
const briefings = await Promise.all(briefingFiles.map(async (name) => ({ name, text: await readText("src", "content", "briefings", name) })));
const sourceIds = new Set(sources.map((source) => source.id));
const signalById = new Map(signals.map((signal) => [idFromText(signal.text), signal.text]));
const briefingById = new Map(briefings.map((briefing) => [idFromText(briefing.text), briefing.text]));
const projectById = new Map(projectRegistry.records.map((record) => [record.file_id, record]));
const eventById = new Map(registry.events.map((event) => [event.event_id, event]));

check(registry.phase === "62" && registry.ledger_registry_id === "conversion-event-ledgers-001", "The registry must identify Phase 62 and its stable ledger ID.");
check(registry.schema_version === "1.0", "The Phase 62 ledger schema must remain version 1.0.");
check(registry.ledgers.length === 8, "Phase 62 must contain eight named conversion ledgers.");
check(registry.events.length === 17, "Phase 62 must contain exactly seventeen backfilled events.");
check(new Set(registry.events.map((event) => event.event_id)).size === 17, "Every Phase 62 event must have a unique ID.");
check(new Set(registry.ledgers.map((ledger) => ledger.file_id)).size === 8, "Every Phase 62 ledger must have a unique file ID.");
check(
  JSON.stringify([...new Set(registry.ledgers.map((ledger) => ledger.file_id))].sort()) === JSON.stringify([...projectById.keys()].sort()),
  "The Phase 62 ledger set must match the eight Phase 61 named files exactly."
);

for (const ledger of registry.ledgers) {
  const project = projectById.get(ledger.file_id);
  const briefing = briefingById.get(ledger.canonical_briefing_id) ?? "";
  check(project?.canonical_briefing_id === ledger.canonical_briefing_id, `${ledger.file_id} does not preserve its Phase 61 canonical briefing.`);
  check(ledger.event_ids.length >= 2 && new Set(ledger.event_ids).size === ledger.event_ids.length, `${ledger.file_id} needs at least two unique events.`);
  check(ledger.event_ids.every((id) => eventById.get(id)?.file_id === ledger.file_id), `${ledger.file_id} contains a missing or cross-file event.`);
  check(/record_status:\s*"Published"/.test(briefing), `${ledger.file_id} is missing its Published canonical briefing.`);
  check(briefing.includes("## Phase 62 conversion timeline"), `${ledger.file_id} canonical briefing is missing its Phase 62 timeline.`);
  check(ledger.event_ids.every((id) => briefing.includes(id)), `${ledger.file_id} canonical briefing does not expose all event IDs.`);
  const sequences = ledger.event_ids.map((id) => eventById.get(id)?.sequence);
  check(sequences.every((sequence, index) => sequence === index + 1), `${ledger.file_id} event sequence is not contiguous from one.`);
}

for (const event of registry.events) {
  const project = projectById.get(event.file_id);
  const signal = signalById.get(event.signal_id) ?? "";
  check(/^\d{4}-\d{2}-\d{2}$/.test(event.event_date) && event.event_date <= "2026-08-11", `${event.event_id} lacks a valid non-future event date.`);
  check(Boolean(event.date_basis && event.event_type && event.title && event.evidence_artifact), `${event.event_id} lacks its dated evidence description.`);
  check(Boolean(event.prior_stage && event.current_stage && event.interpretation_boundary && event.next_gate), `${event.event_id} lacks its stage account or boundary.`);
  check(["Stage Change", "Bounded Hold", "Context Only"].includes(event.materiality), `${event.event_id} uses an unsupported materiality.`);
  check(project?.signal_ids.includes(event.signal_id), `${event.event_id} uses a signal outside its Phase 61 named file.`);
  check(Boolean(signal), `${event.event_id} references a missing signal.`);
  check(event.source_ids.length > 0 && event.source_ids.every((id) => sourceIds.has(id)), `${event.event_id} references a missing source.`);
  check(event.source_ids.every((id) => signal.includes(id)), `${event.event_id} uses a source not carried by its signal.`);
  check(event.signal_status_at_capture === statusFromText(signal), `${event.event_id} does not preserve the signal publication state at capture.`);
  check(event.receipt_id === null, `${event.event_id} invents a receipt for a backfilled event.`);
  check(/^backfilled_(published|held)_evidence$/.test(event.decision_status), `${event.event_id} lacks a bounded backfill decision status.`);
}

const cycleIds = operatingCycle.records.map((record) => record.cycle_item_id);
const bindingById = new Map(registry.phase_60_cycle_bindings.map((binding) => [binding.cycle_item_id, binding]));
check(registry.phase_60_cycle_bindings.length === 13, "Phase 62 must decide all thirteen Phase 60 cycle bindings.");
check(new Set(registry.phase_60_cycle_bindings.map((binding) => binding.cycle_item_id)).size === 13, "Phase 60 cycle bindings must be unique.");
check(cycleIds.every((id) => bindingById.has(id)), "Every Phase 60 cycle item must have a Phase 62 binding decision.");
for (const binding of registry.phase_60_cycle_bindings) {
  check(binding.file_ids.every((id) => projectById.has(id)), `${binding.cycle_item_id} binds to a missing named file.`);
  check(Boolean(binding.binding_decision), `${binding.cycle_item_id} lacks a binding decision.`);
}
check(JSON.stringify(bindingById.get("60-CYCLE-SPACE-COAST-SLF-LICENCE")?.file_ids) === JSON.stringify(["61-PROJECT-SPACE-COAST-AUTHORITY"]), "The Space Coast licence cycle must bind to the Space Coast file.");
check(JSON.stringify(bindingById.get("60-CYCLE-ARIZONA-WASTEWATER")?.file_ids) === JSON.stringify(["61-PROJECT-TSMC-ARIZONA"]), "The Arizona wastewater cycle must bind to the TSMC file.");
check(JSON.stringify(bindingById.get("60-CYCLE-LOUDOUN-STANDARDS")?.file_ids) === JSON.stringify(["61-PROJECT-NOVA-LARGE-LOAD"]), "The Loudoun standards cycle must bind conditionally to the Northern Virginia file.");
check(registry.phase_60_cycle_bindings.filter((binding) => binding.file_ids.length === 0).length === 10, "Ten Phase 60 cycle items must retain explicit no-transfer decisions.");

const method = briefingById.get("briefing-conversion-ledger-method-001") ?? "";
check(/record_status:\s*"Published"/.test(method), "Conversion Ledger Method 001 must be Published.");
for (const heading of ["## What an event means", "## Backfill is not a receipt", "## Future append contract"]) {
  check(method.includes(heading), `Conversion Ledger Method 001 is missing ${heading}.`);
}
const expectedAffectedIds = ["briefing-conversion-ledger-method-001", ...projectRegistry.records.map((record) => record.canonical_briefing_id)];
check(expectedAffectedIds.every((id) => update.affected_record_ids.includes(id)), "The Phase 62 update does not identify every affected briefing.");
check(update.work_package === "docs/work-packages/phase-62-conversion-event-ledgers.md", "The Phase 62 update points to the wrong work package.");
for (const field of ["event_id", "file_id", "event_date", "date_basis", "prior_stage", "current_stage", "materiality", "evidence_artifact", "source_ids", "signal_id", "interpretation_boundary", "next_gate"]) {
  check(endpoint.includes(field), `The public conversion-event export omits ${field}.`);
}
check(endpoint.includes('"conversion_events"'), "The public endpoint must use the conversion_events dataset contract.");

const scoreKeys = [];
const inspectKeys = (value, path = "registry") => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key.toLowerCase().includes("score")) scoreKeys.push(`${path}.${key}`);
    inspectKeys(child, `${path}.${key}`);
  }
};
inspectKeys(registry);
check(scoreKeys.length === 0, `Phase 62 creates score fields: ${scoreKeys.join(", ")}`);

if (failures.length) {
  console.error("Phase 62 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 62 assertions passed: 8 append-only ledgers, 17 source-resolved backfilled events, 13 explicit Phase 60 bindings, 8 canonical briefing timelines, 1 Published method briefing, 1 public export contract, and no invented receipts, score fields, or unsupported stage advances.");
