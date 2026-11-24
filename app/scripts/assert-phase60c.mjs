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
const archivedStarlinkReceipt = await readJson("src", "data", "phase-165-receipts", "receipt-60-louisiana-starlink-2026-09-01-no-material-change.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-60c-editorial-desk.json");
const starlinkDecisionUpdate = await readJson("src", "content", "updates", "2026-09-01-phase-60c-louisiana-starlink-operating-decision.json");
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
const signalRecords = await Promise.all(signalFiles.map(async (name) => {
  const text = await readText("src", "content", "signals", name);
  return { id: text.match(/^id:\s*"([^"]+)"/m)?.[1], text };
}));
const signalIds = new Set(signalRecords.map((record) => record.id));
const signalById = new Map(signalRecords.map((record) => [record.id, record.text]));

check(desk.schema_version === "1.0" && desk.phase === "60C", "The editorial desk must identify Wave 60C under schema 1.0.");
check(desk.captured_date === "2026-08-23" && desk.as_of_date === "2026-09-01" && desk.last_operated_date === "2026-09-01", "Wave 60C must preserve its immutable August 23 capture while exposing the September 1 operating date.");
check(desk.desk_status === "operating_one_cycle_gate_complete", "Wave 60C must expose the completed September 1 gate while retaining the later operating window.");
check(desk.operating_window_start === "2026-09-01" && desk.operating_window_end === "2026-09-15", "Wave 60C has the wrong operating window.");
check(desk.records.length === 8, "Wave 60C must publish exactly eight desk records.");
check(new Set(desk.records.map((record) => record.desk_item_id)).size === 8, "Every Wave 60C desk item must have a unique ID.");
check(desk.records.filter((record) => record.item_kind === "cycle_gate").length === 6, "Wave 60C must contain six cycle gates.");
check(desk.records.filter((record) => record.item_kind === "named_file_recheck").length === 2, "Wave 60C must contain two separate named-file rechecks.");

const expectedDateDistribution = { "2026-09-01": 1, "2026-09-09": 2, "2026-09-10": 3, "2026-09-15": 2 };
for (const [date, count] of Object.entries(expectedDateDistribution)) {
  check(desk.records.filter((record) => record.scheduled_check_date === date).length === count, `Wave 60C must contain ${count} desk item(s) on ${date}.`);
}

const starlinkReceiptId = "receipt-60-louisiana-starlink-2026-09-01-no-material-change";
const starlinkCycleId = "60-CYCLE-LOUISIANA-STARLINK-ADOPTION";
const starlinkEnvelopeId = "67-RETURN-003";
const expectedCheckedSourceIds = [
  "source-57b-louisiana-starlink-bead-agreement",
  "source-165-led-spacex-louisiana-campus-starlink-offer",
  "source-165-starlink-louisiana-community-discount",
  "source-165-louisiana-broadband-reporting-law",
  "source-165-connectla-resource-library",
];
const starlinkReceipt = receipts.receipts.find((record) => record.receipt_id === starlinkReceiptId);
check(desk.current_operating_result?.completed_cycle_gate_id === starlinkCycleId && desk.current_operating_result?.receipt_id === starlinkReceiptId, "The Wave 60C current result must identify the September 1 Louisiana Starlink gate and receipt.");
check(desk.current_operating_result?.decision_status === "no_material_change" && desk.current_operating_result?.completed_date === "2026-09-01", "The Wave 60C current result must preserve the real No Material Change decision date.");
check(desk.current_operating_result?.remaining_cycle_gates === 5 && desk.current_operating_result?.remaining_companion_rechecks === 2, "The Wave 60C current result must retain five cycle gates and two companion rechecks.");
check(desk.current_operating_result?.next_public_surface_recheck === "2026-09-08" && desk.current_operating_result?.next_scheduled_desk_date === "2026-09-09", "The Wave 60C current result must distinguish the September 8 bounded recheck from the September 9 scheduled desk date.");

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
  if (record.desk_item_id === "60C-DESK-001") {
    check(record.cycle_item_id === starlinkCycleId && record.return_envelope_id === starlinkEnvelopeId, "The completed Louisiana Starlink desk item changes its cycle or envelope identity.");
    check(record.exact_next_artifact === archivedStarlinkReceipt.exact_next_artifact, "The Louisiana Starlink desk item must inherit the immutable receipt's exact next artifact verbatim.");
    check(record.named_file_id === null && record.conversion_gate_id === null, "The Louisiana Starlink desk decision must not transfer to a Phase 61 named file or conversion gate.");
    check(JSON.stringify(record.checked_source_ids) === JSON.stringify(expectedCheckedSourceIds) && record.checked_source_ids.every((id) => sourceIds.has(id)), "The Louisiana Starlink desk decision must preserve five resolvable checked source identities.");
    check(record.source_checked_date === "2026-09-01" && record.decision_date === "2026-09-01", "The Louisiana Starlink desk decision must preserve its real September 1 dates.");
    check(record.attempted_surfaces?.length === 9 && new Set(record.attempted_surfaces).size === 9, "The Louisiana Starlink desk decision must preserve nine distinct official surfaces.");
    check(record.receipt_type === "No Material Change" && record.receipt_id === starlinkReceiptId && record.decision_status === "no_material_change", "The Louisiana Starlink desk decision must resolve to its bounded receipt.");
    check(record.propagation_status === "complete_locally_git_held" && record.content_propagation_status === "complete" && record.git_backed_release_status === "held", "The Louisiana Starlink desk decision must separate complete local content propagation from held Git-backed release.");
    check(record.next_check_date === "2026-09-08", "The Louisiana Starlink desk decision must retain the bounded September 8 recheck.");
  } else {
    for (const forbiddenField of ["checked_source_ids", "source_checked_date", "decision_date", "decision_status", "receipt_id", "receipt_type", "attempted_surfaces", "access_result", "propagation_status", "content_propagation_status", "git_backed_release_status", "next_check_date"]) {
      check(!(forbiddenField in record), `${record.desk_item_id} precreates future field ${forbiddenField}.`);
    }
  }
}

for (const cycleRecord of waveCycle) {
  if (cycleRecord.cycle_item_id === starlinkCycleId) {
    check(cycleRecord.decision_status === "no_material_change" && cycleRecord.decision_date === "2026-09-01" && cycleRecord.receipt_id === starlinkReceiptId, "The Louisiana Starlink Wave 60C cycle record must preserve its exact decision.");
    check(cycleRecord.source_checked_date === "2026-09-01" && cycleRecord.next_check_date === "2026-09-08", "The Louisiana Starlink cycle record must preserve its check and next-action state.");
    check(cycleRecord.propagation_status === "complete_locally_git_held" && cycleRecord.content_propagation_status === "complete" && cycleRecord.git_backed_release_status === "held", "The Louisiana Starlink cycle record must separate complete local content propagation from held Git-backed release.");
    check(cycleRecord.official_surface_count === 9, "The Louisiana Starlink cycle record must preserve nine official surfaces.");
  } else {
    check(cycleRecord.decision_status === "scheduled" && cycleRecord.decision_date === null && cycleRecord.receipt_id === null, `${cycleRecord.cycle_item_id} is completed before its real date.`);
    check(!("content_propagation_status" in cycleRecord) && !("git_backed_release_status" in cycleRecord), `${cycleRecord.cycle_item_id} precreates the September 1 Git split.`);
  }
}
for (const returnRecord of waveReturns) {
  if (returnRecord.envelope_id === starlinkEnvelopeId) {
    check(returnRecord.envelope_state === "Propagation Complete — Git Held" && returnRecord.receipt_id === starlinkReceiptId, "The Louisiana Starlink return envelope must preserve completed propagation while Git-backed release remains held.");
    check(JSON.stringify(returnRecord.checked_source_ids) === JSON.stringify(expectedCheckedSourceIds) && returnRecord.attempted_surfaces?.length === 9, "The Louisiana Starlink return envelope must preserve all checked sources and nine official surfaces.");
    check(returnRecord.decision_date === "2026-09-01" && returnRecord.decision_status === "no_material_change" && returnRecord.next_check_date === "2026-09-08", "The Louisiana Starlink return envelope has a stale bounded decision state.");
    check(returnRecord.propagation_status === "complete_locally_git_held" && returnRecord.content_propagation_status === "complete" && returnRecord.git_backed_release_status === "held", "The Louisiana Starlink return envelope must separate complete local content propagation from held Git-backed release.");
    check(returnRecord.named_file_ids.length === 0 && returnRecord.qualification_packet_ids.length === 0, "The Louisiana Starlink return envelope must not transfer to a Phase 61 file or qualification packet.");
  } else {
    check(
      returnRecord.envelope_state === "Scheduled" && returnRecord.attempted_surfaces.length === 0 &&
      returnRecord.access_result === null && returnRecord.receipt_id === null && returnRecord.decision_date === null &&
      returnRecord.propagation_status === "not_started",
      `${returnRecord.envelope_id} is not future-safe.`
    );
    check(!("content_propagation_status" in returnRecord) && !("git_backed_release_status" in returnRecord), `${returnRecord.envelope_id} precreates the September 1 Git split.`);
  }
}
check(waveCycle.filter((record) => record.decision_status === "no_material_change").length === 1 && waveCycle.filter((record) => record.decision_status === "scheduled").length === 5, "Wave 60C must contain one completed cycle decision and five scheduled cycle gates.");
check(waveReturns.filter((record) => record.envelope_state === "Propagation Complete — Git Held").length === 1 && waveReturns.filter((record) => record.envelope_state === "Scheduled").length === 5, "Wave 60C must contain one propagation-complete Git-held envelope and five scheduled envelopes.");
check(starlinkReceipt?.receipt_type === "No Material Change" && starlinkReceipt?.source_checked_date === "2026-09-01" && starlinkReceipt?.decision_date === "2026-09-01", "The Louisiana Starlink canonical receipt must preserve its type and real dates.");
check(starlinkReceipt?.official_surface_checks?.length === 9 && starlinkReceipt?.next_check_date === "2026-09-08", "The Louisiana Starlink canonical receipt must preserve nine official checks and its bounded next action.");
check(/record_status:\s*"In Review"/.test(signalById.get("signal-57y-preserved-la-starlink-adoption") ?? ""), "The Louisiana Starlink signal must remain In Review.");

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
check(starlinkDecisionUpdate.receipt_id === starlinkReceiptId && starlinkDecisionUpdate.receipt_type === "No Material Change", "The September 1 public update must expose the canonical Louisiana Starlink receipt.");
check(starlinkDecisionUpdate.source_checked_date === "2026-09-01" && starlinkDecisionUpdate.decision_date === "2026-09-01" && starlinkDecisionUpdate.next_check_date === "2026-09-08", "The September 1 public update must preserve the exact check, decision, and next-action dates.");
check(starlinkDecisionUpdate.materiality === "No record-state change" && /retaining the signal In Review/i.test(starlinkDecisionUpdate.publication_effect), "The September 1 public update must preserve the bounded held-signal effect.");
check(expectedCheckedSourceIds.every((id) => starlinkDecisionUpdate.affected_record_ids.includes(id)), "The September 1 public update must name every checked source identity.");
check(guide.includes("## September 1 operating result") && guide.includes(starlinkReceiptId), "The Wave 60C field guide must publish the September 1 bounded operating result.");
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

console.log("Phase 60C operating assertions passed: 1 due Louisiana Starlink decision is fully propagated and Git-held across 9 official surfaces with no Phase 61 transfer, 5 future cycle gates and 2 companion rechecks remain empty, 6 pathways and the public desk remain integrated, and no score, ranking, stage, or operating-outcome claim advances.");
