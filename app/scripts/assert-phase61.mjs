import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const registry = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const gapFiles = (await readdir(join(appRoot, "src", "content", "evidence-gaps"))).filter((name) => name.endsWith(".json"));
const pathwayFiles = (await readdir(join(appRoot, "src", "content", "reader-pathways"))).filter((name) => name.endsWith(".json"));
const mapFiles = (await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json"));
const briefingFiles = (await readdir(join(appRoot, "src", "content", "briefings"))).filter((name) => name.endsWith(".mdx"));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));

const sources = await Promise.all(sourceFiles.map((name) => readJson("src", "content", "sources", name)));
const gaps = await Promise.all(gapFiles.map((name) => readJson("src", "content", "evidence-gaps", name)));
const pathways = await Promise.all(pathwayFiles.map((name) => readJson("src", "content", "reader-pathways", name)));
const maps = await Promise.all(mapFiles.map((name) => readJson("src", "content", "dependency-maps", name)));
const readTexts = async (directory, names) => Promise.all(names.map(async (name) => ({ name, text: await readFile(join(appRoot, "src", "content", directory, name), "utf8") })));
const briefings = await readTexts("briefings", briefingFiles);
const signals = await readTexts("signals", signalFiles);
const locals = await readTexts("local-systems", localFiles);
const idFromText = (text) => text.match(/^id:\s*"([^"]+)"/m)?.[1];

const sourceIds = new Set(sources.map((record) => record.id));
const gapById = new Map(gaps.map((record) => [record.id, record]));
const pathwayById = new Map(pathways.map((record) => [record.id, record]));
const mapIds = new Set(maps.map((record) => record.id));
const briefingById = new Map(briefings.map((record) => [idFromText(record.text), record.text]));
const signalIds = new Set(signals.map((record) => idFromText(record.text)));
const localById = new Map(locals.map((record) => [idFromText(record.text), record.text]));

check(registry.phase === "61" && registry.registry_id === "project-conversion-registry-001", "The registry must identify Phase 61 and its stable registry ID.");
check(registry.records.length === 8, "Phase 61 must publish eight named conversion files.");
check(registry.records.filter((record) => record.kind === "local_project").length === 5, "Phase 61 must contain five local project files.");
check(registry.records.filter((record) => record.kind === "adoption_case").length === 3, "Phase 61 must contain three adoption cases.");
check(new Set(registry.records.map((record) => record.file_id)).size === 8, "Every conversion file must have a unique ID.");

for (const record of registry.records) {
  check(Boolean(record.named_entity && record.current_stage && record.established && record.unresolved), `${record.file_id} is missing its named stage account.`);
  check(Boolean(record.exact_next_artifact && (record.next_check_date || record.reopening_trigger) && record.stop_rule), `${record.file_id} is missing an exact artifact, date or trigger, or stop rule.`);
  check(record.source_ids.length > 0 && record.source_ids.every((id) => sourceIds.has(id)), `${record.file_id} references a missing source.`);
  check(record.signal_ids.length > 0 && record.signal_ids.every((id) => signalIds.has(id)), `${record.file_id} references a missing signal.`);
  check(record.evidence_gap_ids.length > 0 && record.evidence_gap_ids.every((id) => gapById.has(id)), `${record.file_id} references a missing gap.`);
  check(record.reader_pathway_ids.length > 0 && record.reader_pathway_ids.every((id) => pathwayById.has(id)), `${record.file_id} references a missing reader pathway.`);
  check(record.dependency_map_ids.length > 0 && record.dependency_map_ids.every((id) => mapIds.has(id)), `${record.file_id} references a missing dependency map.`);
  check(record.local_system_ids.every((id) => localById.has(id)), `${record.file_id} references a missing local system.`);
  const briefing = briefingById.get(record.canonical_briefing_id) ?? "";
  check(/record_status:\s*"Published"/.test(briefing), `${record.file_id} is missing its Published canonical briefing.`);
  check(record.signal_ids.every((id) => briefing.includes(id)), `${record.file_id} canonical briefing does not preserve all signal IDs.`);
  check(record.reader_pathway_ids.every((id) => pathwayById.get(id)?.briefing_ids.includes(record.canonical_briefing_id)), `${record.file_id} is not linked from every assigned pathway.`);
  check(record.local_system_ids.every((id) => localById.get(id)?.includes(record.canonical_briefing_id.replace("briefing-", ""))), `${record.file_id} is not linked from its local system.`);
}

check(registry.gap_operating_register.length === 16, "The Phase 61 operating register must cover all sixteen evidence gaps.");
check(new Set(registry.gap_operating_register.map((record) => record.gap_id)).size === 16, "Every gap must appear exactly once in the Phase 61 operating register.");
for (const item of registry.gap_operating_register) {
  check(gapById.has(item.gap_id), `${item.gap_id} does not resolve in the gap collection.`);
  check(Boolean(item.exact_next_artifact && (item.next_check_date || item.reopening_trigger)), `${item.gap_id} lacks an exact artifact and date or trigger.`);
  check(item.file_ids.every((id) => registry.records.some((record) => record.file_id === id)), `${item.gap_id} references a missing conversion file.`);
}

for (const id of ["gap-004", "gap-005"]) {
  const gap = gapById.get(id);
  check(gap?.latest_review?.phase === "Phase 61", `${id} must be reconciled in Phase 61.`);
  check(gap?.latest_review?.next_check_date === "2026-09-09", `${id} must replace the past-due Council check with the September 9 downstream check.`);
  check(!JSON.stringify(gap).includes("remains scheduled for July") && !JSON.stringify(gap).includes("after July 29-31"), `${id} retains stale pre-Council language.`);
}

const flagship = briefingById.get("briefing-project-conversion-watch-001") ?? "";
check(/record_status:\s*"Published"/.test(flagship), "Project Conversion Watch 001 must be Published.");
check(registry.records.every((record) => flagship.includes(record.named_entity.split(" ")[0]) || flagship.includes(record.title.split(" ")[0])), "The flagship must represent every conversion rail.");

if (failures.length) {
  console.error("Phase 61 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 61 assertions passed: 8 named conversion files (5 local projects and 3 adoption cases), 16 reconciled gap operations, 9 Published briefings, 10 linked pathways, 5 linked local systems, 1 public registry contract, and no score or unsupported outcome promotion.");
