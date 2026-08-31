import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const expectedDisposition = "Prepared — no exact artifact admitted";

const registry = await readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json");
const authorityGraph = await readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json");
const coverage = await readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json");
const cycle = await readJson(appRoot, "src", "data", "phase-60-operating-cycle.json");
const update = await readJson(appRoot, "src", "content", "updates", "2026-08-30-phase-120-evidence-acquisition-packets.json");

check(registry.schema_version === "1.0" && registry.phase === 120, "Phase 120 must be a schema 1.0 phase registry.");
check(registry.program_id === "FTFN-V0.5-PHASE-120-EVIDENCE-ACQUISITION-PACKETS", "Phase 120 program ID is incorrect.");
check(registry.effective_date === "2026-08-30" && registry.record_status === "Published", "Phase 120 must retain the actual preparation date and Published registry state.");
check(registry.preparation_state === expectedDisposition, "Phase 120 preparation state is incorrect.");
check(Array.isArray(registry.acquisition_packets) && registry.acquisition_packets.length === 80, "Phase 120 requires exactly eighty acquisition packets.");
check(registry.counts.acquisition_packets === 80 && registry.counts.artifact_targets === 320 && registry.counts.targets_per_packet === 4, "Phase 120 count contract must be 80 packets and 320 targets.");
check(registry.counts.jurisdictions === 20 && registry.counts.authority_classes === 4 && registry.counts.topics_linked === 17 && registry.counts.conversion_stages_linked === 8, "Phase 120 must retain complete Phase 117 and Phase 116 coverage.");
check(registry.counts.candidate_source_records_preserved === 80 && registry.counts.source_records_added === 0 && registry.counts.signal_records_added === 0 && registry.counts.exact_artifacts_admitted === 0, "Phase 120 must add no source, signal, or admitted artifact.");
check(registry.counts.enhanced_existing_authority_routes === 80 && registry.counts.new_html_routes === 1 && registry.counts.public_json_exports === 1, "Phase 120 route and export counts are incorrect.");

const packetIds = new Set();
const targetIds = new Set();
const seenRailIds = new Set();
const seenSourceIds = new Set();
const validQuestionIds = new Set(coverage.priority_questions.map((question) => question.question_id));
const validTopicIds = new Set(coverage.coverage_matrix.map((row) => row.topic_id));
const validStageIds = new Set(coverage.conversion_stages.map((stage) => stage.stage_id));
const graphByRail = new Map(authorityGraph.rails.map((rail) => [rail.rail_id, rail]));

for (const packet of registry.acquisition_packets) {
  check(!packetIds.has(packet.packet_id), `Duplicate Phase 120 packet ID: ${packet.packet_id}.`);
  packetIds.add(packet.packet_id);
  check(!seenRailIds.has(packet.rail_id), `Phase 117 rail appears in more than one packet: ${packet.rail_id}.`);
  check(!seenSourceIds.has(packet.source_id), `Phase 117 source appears in more than one packet: ${packet.source_id}.`);
  seenRailIds.add(packet.rail_id);
  seenSourceIds.add(packet.source_id);

  const rail = graphByRail.get(packet.rail_id);
  check(Boolean(rail), `${packet.packet_id} references an unknown Phase 117 rail.`);
  if (rail) {
    check(packet.source_id === rail.source_id, `${packet.packet_id} does not preserve the Phase 117 source identity.`);
    check(packet.official_entry_path?.url === rail.official_url, `${packet.packet_id} does not preserve the official Phase 117 entry path.`);
    check(packet.routes?.authority_rail === `/review/authority/rails/${rail.slug}/`, `${packet.packet_id} has the wrong authority route.`);
    check(JSON.stringify(packet.topic_ids) === JSON.stringify(rail.topic_ids), `${packet.packet_id} topic IDs drift from Phase 117.`);
  }

  check(packet.topic_ids.length > 0 && packet.topic_ids.every((id) => validTopicIds.has(id)), `${packet.packet_id} has invalid canonical topic IDs.`);
  check(packet.conversion_stage_ids.length > 0 && packet.conversion_stage_ids.every((id) => validStageIds.has(id)), `${packet.packet_id} has invalid canonical conversion-stage IDs.`);
  check(packet.required_capture_metadata.length === 12, `${packet.packet_id} must expose all twelve capture fields.`);
  check(packet.admissibility_tests.length === 5, `${packet.packet_id} must expose all five common admissibility tests.`);
  check(packet.invalid_substitutions.length === 6, `${packet.packet_id} must expose all six invalid-substitution controls.`);
  check(packet.disposition?.status === expectedDisposition && packet.disposition?.disposition_date === "2026-08-30", `${packet.packet_id} must carry the dated prepared disposition.`);
  check(packet.disposition?.artifacts_admitted === 0 && packet.disposition?.source_records_created === 0 && packet.disposition?.signal_records_created === 0, `${packet.packet_id} must admit no artifact and create no evidence record.`);
  check(packet.stop_rule?.includes("Do not treat the portal"), `${packet.packet_id} lacks the portal-is-not-evidence stop rule.`);
  check(packet.next_trigger?.includes("dated human review"), `${packet.packet_id} lacks a bounded next trigger.`);
  check(packet.owner?.owner_id === "120-OWNER-AUTHORITY-ACQUISITION-DESK" && packet.owner?.responsibility, `${packet.packet_id} lacks the common acquisition owner.`);

  check(Array.isArray(packet.artifact_targets) && packet.artifact_targets.length === 4, `${packet.packet_id} must carry exactly four artifact targets.`);
  check(new Set(packet.artifact_targets.map((target) => target.target_kind)).size === 4, `${packet.packet_id} target kinds must be distinct.`);
  for (const target of packet.artifact_targets) {
    check(!targetIds.has(target.target_id), `Duplicate Phase 120 target ID: ${target.target_id}.`);
    targetIds.add(target.target_id);
    check(target.review_state === "Prepared target — exact artifact not reviewed", `${target.target_id} must remain an unreviewed prepared target.`);
    check(target.exact_artifact_title === null && target.exact_artifact_url === null && target.exact_artifact_source_id === null, `${target.target_id} must not contain an invented exact artifact identity.`);
    check(target.purpose && target.admissibility_test && target.invalid_substitution, `${target.target_id} lacks a purpose or boundary test.`);
    check(target.applicable_conversion_stage_ids.every((id) => packet.conversion_stage_ids.includes(id)), `${target.target_id} references a stage outside its packet.`);
  }

  const linkage = packet.mission_linkage;
  const placeholderLinkage = linkage?.linkage_status === "Placeholder — Phase 121 mission registry not yet published";
  const resolvedLinkage = linkage?.linkage_status === "Resolved — exact Phase 121 mission backlinks published";
  check(linkage?.phase === 121 && (placeholderLinkage || resolvedLinkage), `${packet.packet_id} must retain a valid Phase 121 placeholder or resolved backlink state.`);
  if (placeholderLinkage) check(Array.isArray(linkage?.phase_121_mission_ids) && linkage.phase_121_mission_ids.length === 0, `${packet.packet_id} cannot pre-create a Phase 121 mission assignment.`);
  if (resolvedLinkage) check(linkage.phase_121_mission_ids.length > 0 && linkage.phase_121_mission_ids.every((id) => /^121-MISSION-\d{3}$/.test(id)) && linkage.linkage_resolved_date === "2026-08-30", `${packet.packet_id} has an invalid resolved Phase 121 backlink set.`);
  check(linkage?.priority_question_ids?.length > 0 && linkage.priority_question_ids.every((id) => validQuestionIds.has(id)), `${packet.packet_id} has an invalid Phase 116 question linkage.`);
}

check(packetIds.size === 80 && targetIds.size === 320, "Phase 120 packet or target IDs are not globally unique.");
check(seenRailIds.size === authorityGraph.rails.length && authorityGraph.rails.every((rail) => seenRailIds.has(rail.rail_id)), "Every Phase 117 rail must resolve to exactly one Phase 120 packet.");
check(update.materiality === "No record-state change" && update.affected_record_ids.length === 80 && update.affected_record_ids.every((id) => seenSourceIds.has(id)), "The Phase 120 update must reference the eighty existing Candidate source records without changing their state.");

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.startsWith("source-117-global-") && name.endsWith(".json"));
check(sourceFiles.length === 80, `Expected eighty Phase 117 source records, found ${sourceFiles.length}.`);
for (const filename of sourceFiles) {
  const source = await readJson(appRoot, "src", "content", "sources", filename);
  check(source.monitoring_status === "Candidate", `${source.id} must remain Candidate after Phase 120.`);
  check(seenSourceIds.has(source.id), `${source.id} has no exact Phase 120 packet join.`);
}

const futureCycleRecords = cycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(futureCycleRecords.length === 11, `Expected eleven future Phase 60 gates, found ${futureCycleRecords.length}.`);
check(futureCycleRecords.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 120 must not operate, predate, or receipt a future Phase 60 gate.");

for (const path of [
  "src/pages/review/fieldbook/acquisition/index.astro",
  "src/pages/review/authority/rails/[slug].astro",
  "src/pages/data/phase-120-evidence-acquisition-packets.json.ts",
  "src/content/updates/2026-08-30-phase-120-evidence-acquisition-packets.json",
]) {
  try { await access(join(appRoot, path)); } catch { failures.push(`Missing Phase 120 artifact: ${path}`); }
}
try { await access(join(workspaceRoot, "docs", "work-packages", "phase-120-v05-evidence-acquisition-packets.md")); } catch { failures.push("Missing Phase 120 work package."); }

const railTemplate = await readFile(join(appRoot, "src", "pages", "review", "authority", "rails", "[slug].astro"), "utf8");
check(railTemplate.includes("phase-120-evidence-acquisition-packets.json") && railTemplate.includes("Authority-to-artifact packet") && railTemplate.includes("artifact_targets"), "The authority-rail route is not materially connected to its Phase 120 packet.");

if (failures.length) {
  console.error("Phase 120 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 120 assertions passed: 80 packets, 320 prepared targets, 80 Candidate sources preserved, and eleven future gates untouched.");
