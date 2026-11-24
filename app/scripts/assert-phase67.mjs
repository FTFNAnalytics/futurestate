import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const phase60 = await readJson("src", "data", "phase-60-operating-cycle.json");
const phase61 = await readJson("src", "data", "phase-61-project-conversion-registry.json");
const phase62 = await readJson("src", "data", "phase-62-conversion-event-ledgers.json");
const phase64 = await readJson("src", "data", "phase-64-conversion-stage-matrix.json");
const phase66 = await readJson("src", "data", "phase-66-acceptance-repeat-operation-ledger.json");
const receiptRegistry = await readJson("src", "data", "phase-58-change-receipts.json");
const archivedStarlinkReceipt = await readJson("src", "data", "phase-165-receipts", "receipt-60-louisiana-starlink-2026-09-01-no-material-change.json");
const packets = await readJson("src", "data", "phase-67-qualification-packet-registry.json");
const returns = await readJson("src", "data", "phase-67-evidence-return-envelope-ledger.json");
const qualificationFixtures = await readJson("src", "data", "phase-67-qualification-admissibility-fixtures.json");
const returnFixtures = await readJson("src", "data", "phase-67-return-workflow-fixtures.json");
const releaseManifest = await readJson("..", "deployment", "ftfn-v0.2-build.json");

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const sourceIds = new Set((await Promise.all(sourceFiles.map((name) => readJson("src", "content", "sources", name)))).map((record) => record.id));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".mdx"));
const signals = await Promise.all(signalFiles.map(async (name) => {
  const text = await readText("src", "content", "signals", name);
  return { id: text.match(/^id:\s*"([^"]+)"/m)?.[1], status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1] };
}));
const signalById = new Map(signals.map((record) => [record.id, record]));
const briefingFiles = (await readdir(join(appRoot, "src", "content", "briefings"))).filter((name) => name.endsWith(".mdx"));
const briefings = await Promise.all(briefingFiles.map(async (name) => {
  const text = await readText("src", "content", "briefings", name);
  return { name, id: text.match(/^id:\s*"([^"]+)"/m)?.[1], status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1], text };
}));
const briefingById = new Map(briefings.map((record) => [record.id, record]));
const mapFiles = (await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json"));
const maps = await Promise.all(mapFiles.map((name) => readJson("src", "content", "dependency-maps", name)));
const mapById = new Map(maps.map((record) => [record.id, record]));
const pathwayFiles = (await readdir(join(appRoot, "src", "content", "reader-pathways"))).filter((name) => name.endsWith(".json"));
const pathways = await Promise.all(pathwayFiles.map((name) => readJson("src", "content", "reader-pathways", name)));
const pathwayById = new Map(pathways.map((record) => [record.id, record]));

check(packets.phase === "67" && packets.schema_version === "1.0", "The qualification registry must preserve its Phase 67 identity and schema.");
check(packets.structural_status === "Complete" && packets.operational_status === "Three Cycle Receipts Recorded; Qualification Packets Awaiting File Evidence", "The qualification registry must separate three completed cycle receipts from still-open file qualification.");
check(packets.packet_records.length === 32 && packets.metrics.qualification_packets === 32, "Phase 67 must contain thirty-two qualification packets.");
check(new Set(packets.packet_records.map((record) => record.packet_id)).size === 32, "Qualification packet IDs must be unique.");
check(new Set(packets.packet_records.map((record) => record.slug)).size === 32, "Qualification packet slugs must be unique.");
check(new Set(packets.packet_records.map((record) => record.file_id)).size === 8, "Qualification packets must cover eight named files.");

const phase66Decisions = new Map(phase66.dossier_rows.flatMap((row) => row.stage_decisions.map((decision) => [`${row.file_id}|${decision.stage_id}`, decision])));
for (const packet of packets.packet_records) {
  const inherited = phase66Decisions.get(`${packet.file_id}|${packet.stage_id}`);
  check(Boolean(inherited), `${packet.packet_id} lacks a Phase 66 file-stage decision.`);
  check(packet.current_decision_state === inherited?.decision_state, `${packet.packet_id} changes its inherited Phase 66 decision.`);
  check(packet.phase64_stage_id === inherited?.phase64_stage_id, `${packet.packet_id} changes its inherited Phase 64 stage identity.`);
  check(packet.exact_qualifying_artifact === inherited?.exact_qualifying_artifact, `${packet.packet_id} changes its exact qualifying artifact.`);
  check(packet.recognized_authorities.length > 0 && packet.admissible_artifact_types.length > 0, `${packet.packet_id} lacks authority or admissible artifact rules.`);
  check(packet.temporal_requirement && packet.method_requirement && packet.denominator_requirement && packet.exception_requirement && packet.recurrence_requirement, `${packet.packet_id} lacks a complete admission contract.`);
  check(packet.disqualifiers.length === 4, `${packet.packet_id} must contain four explicit disqualifiers.`);
  check(packet.receipt_id === null && packet.decision_date === null && packet.phase64_cell_change === "none", `${packet.packet_id} invents a receipt, decision, or matrix change.`);
  check(packet.source_ids.every((id) => sourceIds.has(id)), `${packet.packet_id} references a missing source.`);
  check(packet.signal_ids.every((id) => signalById.get(id)?.status === "Published"), `${packet.packet_id} must reference only Published signals.`);
  check(packet.reader_pathway_ids.every((id) => pathwayById.has(id)), `${packet.packet_id} references a missing pathway.`);
  check(packet.dependency_map_ids.every((id) => mapById.has(id)), `${packet.packet_id} references a missing map.`);
  check(briefingById.has(packet.canonical_briefing_id) && briefingById.has(packet.acceptance_briefing_id) && briefingById.has(packet.qualification_playbook_id), `${packet.packet_id} lacks a connected briefing.`);
}

const packetStateCounts = Object.fromEntries(["Continuity Monitoring", "Awaiting Completion Artifact", "Awaiting Qualifying Artifact"].map((state) => [state, packets.packet_records.filter((record) => record.packet_state === state).length]));
check(packetStateCounts["Continuity Monitoring"] === 1 && packetStateCounts["Awaiting Completion Artifact"] === 4 && packetStateCounts["Awaiting Qualifying Artifact"] === 27, "Qualification packets must preserve the 1/4/27 downstream distribution.");
for (const fileId of phase61.records.map((record) => record.file_id)) {
  const rows = packets.packet_records.filter((record) => record.file_id === fileId);
  check(rows.length === 4 && new Set(rows.map((record) => record.stage_id)).size === 4, `${fileId} must have four unique stage packets.`);
}

check(returns.phase === "67" && returns.schema_version === "1.0", "The evidence-return ledger must preserve its Phase 67 identity and schema.");
check(returns.as_of_date === "2026-09-01" && returns.operational_status === "Wave 60B Complete; Wave 60C In Progress — September 1 Decision Propagated; Git Held", "The evidence-return ledger must expose the exact September 1 operating state without overstating Git-backed release.");
check(returns.envelope_records.length === 13 && returns.metrics.envelopes === 13, "Phase 67 must contain thirteen return envelopes.");
check(new Set(returns.envelope_records.map((record) => record.envelope_id)).size === 13, "Return-envelope IDs must be unique.");
check(new Set(returns.envelope_records.map((record) => record.cycle_item_id)).size === 13, "Return envelopes must cover thirteen unique cycle items.");
const phase60ById = new Map(phase60.records.map((record) => [record.cycle_item_id, record]));
const phase62Bindings = new Map(phase62.phase_60_cycle_bindings.map((record) => [record.cycle_item_id, record]));
for (const envelope of returns.envelope_records) {
  const cycle = phase60ById.get(envelope.cycle_item_id);
  const binding = phase62Bindings.get(envelope.cycle_item_id);
  check(Boolean(cycle) && Boolean(binding), `${envelope.envelope_id} lacks its inherited cycle or binding.`);
  check(envelope.scheduled_check_date === cycle?.scheduled_check_date && envelope.exact_next_artifact === cycle?.exact_next_artifact, `${envelope.envelope_id} changes its scheduled date or exact artifact.`);
  check(JSON.stringify(envelope.source_ids) === JSON.stringify(cycle?.source_ids), `${envelope.envelope_id} changes its source assignment.`);
  check(envelope.underlying_signal_id === cycle?.underlying_signal_id, `${envelope.envelope_id} changes its signal assignment.`);
  check(JSON.stringify(envelope.named_file_ids) === JSON.stringify(binding?.file_ids), `${envelope.envelope_id} changes its named-file binding.`);
  check(envelope.binding_decision === binding?.binding_decision, `${envelope.envelope_id} changes its no-transfer or binding decision.`);
  const completed = ["Release Verified", "Propagation Complete — Git Held"].includes(envelope.envelope_state);
  if (completed) {
    check(envelope.attempted_surfaces.length > 0 && envelope.access_result && envelope.receipt_type && envelope.receipt_id && envelope.decision_date && envelope.next_check_date, `${envelope.envelope_id} lacks its completed return record.`);
    check(envelope.receipt_id === cycle?.receipt_id && envelope.decision_date === cycle?.decision_date, `${envelope.envelope_id} does not match its completed cycle decision.`);
    if (envelope.envelope_state === "Propagation Complete — Git Held") {
      check(envelope.propagation_status === "complete_locally_git_held", `${envelope.envelope_id} must preserve the local-complete, Git-held propagation state.`);
      check(envelope.content_propagation_status === "complete" && envelope.git_backed_release_status === "held", `${envelope.envelope_id} must separate complete content propagation from held Git-backed release.`);
    } else {
      check(envelope.propagation_status === "complete", `${envelope.envelope_id} must preserve its Git-backed release-verified propagation state.`);
      check(!("content_propagation_status" in envelope) && !("git_backed_release_status" in envelope), `${envelope.envelope_id} must not inherit the September 1 Git-held split.`);
    }
    check(receiptRegistry.receipts.some((record) => record.receipt_id === envelope.receipt_id), `${envelope.envelope_id} has a missing receipt.`);
    check((envelope.checked_source_ids ?? envelope.source_ids).every((id) => sourceIds.has(id)), `${envelope.envelope_id} references a missing checked source.`);
  } else {
    check(envelope.envelope_state === "Scheduled" && envelope.decision_status === "scheduled" && envelope.propagation_status === "not_started", `${envelope.envelope_id} precompletes a future workflow state.`);
    check(envelope.attempted_surfaces.length === 0 && envelope.access_result === null && envelope.receipt_type === null && envelope.receipt_id === null && envelope.decision_date === null && envelope.next_check_date === null, `${envelope.envelope_id} precreates a future check result or receipt.`);
    check(!("content_propagation_status" in envelope) && !("git_backed_release_status" in envelope), `${envelope.envelope_id} precreates the September 1 Git split on a future envelope.`);
    check(envelope.scheduled_check_date > returns.as_of_date, `${envelope.envelope_id} is not future-dated relative to the current operational capture.`);
  }
  check(envelope.source_ids.every((id) => sourceIds.has(id)) && signalById.has(envelope.underlying_signal_id), `${envelope.envelope_id} references a missing source or signal.`);
}
check(returns.metrics.wave_60b === 2 && returns.metrics.wave_60c === 6 && returns.metrics.wave_60d === 5, "Return envelopes must preserve the 2/6/5 wave distribution.");
check(returns.metrics.named_file_bound === 3 && returns.metrics.no_transfer === 10, "Return envelopes must preserve three named-file bindings and ten no-transfer decisions.");
check(returns.metrics.receipts_created === 3 && returns.metrics.decisions_completed === 3 && returns.metrics.propagation_completed === 3, "Evidence Cycle 001 must contain three completed receipts, decisions, and propagation proofs.");
check(returns.metrics.content_propagation_completed === 3 && returns.metrics.git_backed_release_verified === 2 && returns.metrics.git_backed_release_held === 1, "The return ledger must separate three locally complete propagations from two verified and one held Git-backed releases.");
check(returns.envelope_records.filter((record) => record.envelope_state === "Release Verified").length === 2, "The return ledger must preserve the two Git-backed Wave 60B release-verified envelopes.");
check(returns.envelope_records.filter((record) => record.envelope_state === "Propagation Complete — Git Held").length === 1, "The return ledger must preserve one September 1 propagation-complete Git-held envelope.");
check(returns.envelope_records.filter((record) => record.envelope_state === "Scheduled").length === 10, "The return ledger must preserve ten scheduled future envelopes.");

const starlinkReceiptId = "receipt-60-louisiana-starlink-2026-09-01-no-material-change";
const starlinkEnvelope = returns.envelope_records.find((record) => record.envelope_id === "67-RETURN-003");
const starlinkCycle = phase60ById.get("60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
const expectedCheckedSourceIds = [
  "source-57b-louisiana-starlink-bead-agreement",
  "source-165-led-spacex-louisiana-campus-starlink-offer",
  "source-165-starlink-louisiana-community-discount",
  "source-165-louisiana-broadband-reporting-law",
  "source-165-connectla-resource-library",
];
check(starlinkEnvelope?.cycle_item_id === starlinkCycle?.cycle_item_id && starlinkEnvelope?.scheduled_check_date === "2026-09-01", "The Louisiana Starlink envelope must preserve its exact cycle identity and scheduled date.");
check(starlinkEnvelope?.exact_next_artifact === archivedStarlinkReceipt.exact_next_artifact, "The Louisiana Starlink return envelope must inherit the immutable receipt's exact next artifact verbatim.");
check(starlinkEnvelope?.envelope_state === "Propagation Complete — Git Held", "The Louisiana Starlink envelope must not claim Git-backed release before commit and publication.");
check(starlinkEnvelope?.receipt_type === "No Material Change" && starlinkEnvelope?.receipt_id === starlinkReceiptId, "The Louisiana Starlink envelope must preserve its exact bounded receipt.");
check(starlinkEnvelope?.decision_date === "2026-09-01" && starlinkEnvelope?.decision_status === "no_material_change", "The Louisiana Starlink envelope must preserve its completed September 1 evidence decision.");
check(starlinkEnvelope?.propagation_status === "complete_locally_git_held" && starlinkEnvelope?.content_propagation_status === "complete" && starlinkEnvelope?.git_backed_release_status === "held", "The Louisiana Starlink envelope must distinguish complete local content propagation from held Git-backed release.");
check(starlinkEnvelope?.next_check_date === "2026-09-08" && starlinkEnvelope?.attempted_surfaces?.length === 9, "The Louisiana Starlink envelope must preserve nine official surfaces and its bounded September 8 recheck.");
check(JSON.stringify(starlinkEnvelope?.checked_source_ids) === JSON.stringify(expectedCheckedSourceIds) && expectedCheckedSourceIds.every((id) => sourceIds.has(id)), "The Louisiana Starlink envelope must preserve five resolvable checked sources.");
check(starlinkEnvelope?.named_file_ids?.length === 0 && starlinkEnvelope?.qualification_packet_ids?.length === 0, "The Louisiana Starlink envelope must not transfer to a Phase 61 named file or qualification packet.");
check(starlinkEnvelope?.binding_decision === "No Phase 61 named file shares the Louisiana provider identity.", "The Louisiana Starlink envelope must preserve its exact no-transfer boundary.");
check(starlinkCycle?.decision_status === "no_material_change" && starlinkCycle?.receipt_id === starlinkReceiptId && starlinkCycle?.next_check_date === "2026-09-08", "The Louisiana Starlink return must match its completed Phase 60 cycle decision.");
check(signalById.get("signal-57y-preserved-la-starlink-adoption")?.status === "In Review", "The Louisiana Starlink return must retain the underlying signal In Review.");

check(qualificationFixtures.fixtures.length === 384 && new Set(qualificationFixtures.fixtures.map((record) => record.fixture_id)).size === 384, "Phase 67 must contain 384 unique qualification fixtures.");
check(returnFixtures.fixtures.length === 104 && new Set(returnFixtures.fixtures.map((record) => record.fixture_id)).size === 104, "Phase 67 must contain 104 unique return-workflow fixtures.");
check([...qualificationFixtures.fixtures, ...returnFixtures.fixtures].every((record) => record.synthetic_only === true), "Every Phase 67 fixture must be synthetic-only.");

const playbookIds = packets.packet_records.filter((record) => record.stage_id === "66-STAGE-01-VALIDATION").map((record) => record.qualification_playbook_id);
const methodIds = [
  "briefing-qualification-method-001-validation-evidence",
  "briefing-qualification-method-002-receiving-system-acceptance",
  "briefing-qualification-method-003-compatible-recurring-operation",
  "briefing-qualification-method-004-comparable-outcome-series"
];
const phase67BriefingIds = [...playbookIds, ...methodIds, "briefing-evidence-return-control-room-001"];
check(new Set(phase67BriefingIds).size === 13, "Phase 67 must define thirteen unique briefing IDs.");
for (const id of phase67BriefingIds) {
  const briefing = briefingById.get(id);
  check(briefing?.status === "Published", `${id} must exist and be Published.`);
  check((briefing?.text ?? "").includes("## Publication boundary"), `${id} lacks its publication boundary.`);
}
for (const id of ["dependency-map-artifact-return-to-reader-state", "dependency-map-validation-acceptance-recurrence-outcome-compatibility"]) {
  const map = mapById.get(id);
  check(map?.record_status === "Published", `${id} must exist and be Published.`);
  check(map?.nodes.length >= 6 && map?.links.length >= 5, `${id} lacks its complete relationship structure.`);
}

for (const pathway of pathways) {
  check(pathway.briefing_ids.includes("briefing-evidence-return-control-room-001"), `${pathway.id} lacks the Phase 67 control-room guide.`);
  check(pathway.dependency_map_ids.includes("dependency-map-artifact-return-to-reader-state") && pathway.dependency_map_ids.includes("dependency-map-validation-acceptance-recurrence-outcome-compatibility"), `${pathway.id} lacks both Phase 67 dependency maps.`);
  check(pathway.next_records.some((record) => record.includes("Phase 67 qualification packet")), `${pathway.id} lacks the Phase 67 exact-return rule.`);
}

for (const dossier of phase66.dossier_rows) {
  check(briefingById.get(dossier.canonical_briefing_id)?.text.includes("## Phase 67 qualification and return control"), `${dossier.canonical_briefing_id} lacks its Phase 67 section.`);
  check(briefingById.get(dossier.acceptance_briefing_id)?.text.includes("## Phase 67 qualification and return control"), `${dossier.acceptance_briefing_id} lacks its Phase 67 section.`);
}
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
for (const file of localFiles) check((await readText("src", "content", "local-systems", file)).includes("## Phase 67 qualification packets"), `${file} lacks its Phase 67 qualification section.`);

const allCells = phase64.file_rows.flatMap((row) => row.stage_cells);
check(allCells.filter((cell) => cell.cell_state === "Evidence Present").length === 16 && allCells.filter((cell) => cell.cell_state === "Partial / Held").length === 8 && allCells.filter((cell) => cell.cell_state === "Not Established").length === 40, "Phase 67 must preserve the full 16/8/40 matrix distribution.");
check(allCells.filter((cell) => cell.stage_id === "64-STAGE-08-OUTCOME").every((cell) => cell.cell_state === "Not Established"), "All eight comparable-outcome cells must remain Not Established.");
check(releaseManifest.phase_67_delta.sources_added === 0 && releaseManifest.phase_67_delta.signals_added === 0, "The Phase 67 release delta must record zero source and signal additions.");
check(sourceFiles.length >= 715 && signalFiles.length >= 1406, "The live corpus must preserve the Phase 67 source and signal baselines while allowing later governed expansion.");

const phase67Payload = JSON.stringify({ packets, returns });
check(!/"[^"\n]*(score|rank)[^"\n]*"\s*:/i.test(phase67Payload), "Phase 67 ledgers must not introduce score or rank fields.");
check(await readText("src", "pages", "evidence", "qualification", "index.astro"), "The qualification index route is missing.");
check(await readText("src", "pages", "evidence", "qualification", "[id].astro"), "The qualification detail route is missing.");
check(await readText("src", "pages", "data", "qualification-packets.json.ts"), "The qualification packet export route is missing.");
check(await readText("src", "pages", "data", "evidence-return-envelopes.json.ts"), "The evidence-return export route is missing.");

if (failures.length) {
  console.error("Phase 67 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 67 assertions passed: 32 qualification packets remain bounded across 8 named files and 4 downstream tests; 2 Wave 60B envelopes are release-verified, 1 September 1 Louisiana Starlink envelope is propagation-complete and Git-held, 10 future envelopes remain empty and scheduled, 3 exact named-file bindings and 10 no-transfer decisions persist, all 488 synthetic cases and reader integrations remain intact, and no qualification packet, matrix cell, score, rank, or operating outcome advances.");
