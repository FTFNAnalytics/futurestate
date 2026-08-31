import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sameSet = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && new Set(left).size === left.length && new Set(right).size === right.length && left.every((item) => new Set(right).has(item));

const v05 = await readJson(appRoot, "src", "data", "v05-evidence-fieldbook.json");
const phase120 = await readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json");
const phase121 = await readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json");
const phase122 = await readJson(appRoot, "src", "data", "phase-122-verification-playbook-library.json");
const phase123 = await readJson(appRoot, "src", "data", "phase-123-comparative-delivery-dossiers.json");
const phase124 = await readJson(appRoot, "src", "data", "phase-124-topic-research-workbenches.json");
const cycle = await readJson(appRoot, "src", "data", "phase-60-operating-cycle.json");
const allSignalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));
const signalStatusById = new Map(await Promise.all(allSignalFiles.map(async (name) => {
  const text = await readFile(join(appRoot, "src", "content", "signals", name), "utf8");
  const id = text.match(/^id:\s*["']([^"']+)["']/m)?.[1];
  const status = text.match(/^record_status:\s*["']([^"']+)["']/m)?.[1];
  return [id, status];
})));
const allSourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const sourceIds = new Set((await Promise.all(allSourceFiles.map((name) => readJson(appRoot, "src", "content", "sources", name)))).map((source) => source.id));

check(v05.schema_version === "1.0" && v05.dataset === "v05_evidence_fieldbook", "v0.5 must be a schema 1.0 Evidence Fieldbook dataset.");
check(v05.program_id === "FTFN-V0.5-EVIDENCE-FIELDBOOK" && v05.version === "0.5", "v0.5 program identity is incorrect.");
check(v05.effective_date === "2026-08-30" && v05.record_status === "Published" && v05.status === "Complete locally", "v0.5 release state or effective date is incorrect.");
check(v05.phases.length === 5 && sameSet(v05.phases.map((phase) => phase.phase), [120, 121, 122, 123, 124]), "v0.5 must contain exactly Phases 120–124.");

check(v05.counts.substantive_surfaces === 213 && v05.public_html_routes.length === 213, "v0.5 requires 213 substantive surfaces.");
check(v05.counts.new_html_routes === 121 && v05.new_html_routes.length === 121, "v0.5 requires 121 new HTML routes.");
check(v05.counts.enhanced_existing_routes === 92 && v05.enhanced_existing_routes.length === 92, "v0.5 requires 92 enhanced existing routes.");
check(v05.counts.public_json_exports === 6 && v05.public_json_exports.length === 6, "v0.5 requires six public JSON exports.");
check(new Set(v05.new_html_routes).size === 121 && new Set(v05.enhanced_existing_routes).size === 92 && new Set(v05.public_html_routes).size === 213, "v0.5 route inventories must be internally unique.");
check(v05.new_html_routes.every((route) => route.startsWith("/review/") && route.endsWith("/")), "Every new v0.5 HTML route must be a canonical review route.");
check(v05.enhanced_existing_routes.every((route) => route.startsWith("/review/") && route.endsWith("/")), "Every enhanced v0.5 surface must be an existing canonical review route.");
check(v05.new_html_routes.every((route) => !v05.enhanced_existing_routes.includes(route)), "New and enhanced route accounting must not overlap.");
check(sameSet(v05.public_html_routes, [...v05.new_html_routes, ...v05.enhanced_existing_routes]), "The 213-route inventory must be the exact union of new and enhanced surfaces.");
check(v05.public_json_exports.every((route) => route.startsWith("/data/") && route.endsWith(".json")), "Every v0.5 export must be a public JSON route.");

check(v05.counts.leaf_records === 207, "v0.5 must contain 207 substantive leaf records.");
check(v05.counts.acquisition_packets === 80 && v05.counts.prepared_artifact_targets === 320, "v0.5 Phase 120 aggregate counts are incorrect.");
check(v05.counts.priority_research_missions === 68 && v05.counts.mission_packet_coverage_gaps === 12, "v0.5 Phase 121 aggregate counts are incorrect.");
check(v05.counts.verification_playbooks === 30 && v05.counts.comparative_delivery_dossiers === 12 && v05.counts.topic_workbenches === 17, "v0.5 Phase 122–124 aggregate counts are incorrect.");
check(v05.counts.exact_artifacts_admitted === 0 && v05.counts.source_records_added === 0 && v05.counts.signal_records_added === 0, "v0.5 must not claim an admitted artifact or create a source or signal.");

const questionToMission = new Map(phase121.missions.map((mission) => [mission.priority_question_id, mission.mission_id]));
const missionById = new Map(phase121.missions.map((mission) => [mission.mission_id, mission]));
let backlinkCount = 0;
for (const packet of phase120.acquisition_packets) {
  const expected = [...new Set(packet.mission_linkage.priority_question_ids.map((questionId) => questionToMission.get(questionId)).filter(Boolean))];
  const actual = packet.mission_linkage.phase_121_mission_ids;
  check(packet.mission_linkage.linkage_status === "Resolved — exact Phase 121 mission backlinks published", `${packet.packet_id} does not expose its resolved Phase 121 backlink state.`);
  check(packet.mission_linkage.linkage_resolved_date === "2026-08-30", `${packet.packet_id} does not expose the v0.5 linkage date.`);
  check(sameSet(actual, expected), `${packet.packet_id} Phase 121 mission backlinks do not match its exact priority-question IDs.`);
  check(actual.every((missionId) => missionById.get(missionId)?.relationships.acquisition_packet_ids.includes(packet.packet_id)), `${packet.packet_id} has a non-reciprocal Phase 121 mission backlink.`);
  check(packet.disposition.status === "Prepared — no exact artifact admitted" && packet.disposition.artifacts_admitted === 0, `${packet.packet_id} changed its Phase 120 disposition during integration.`);
  check(packet.artifact_targets.every((target) => target.exact_artifact_title === null && target.exact_artifact_url === null && target.exact_artifact_source_id === null), `${packet.packet_id} contains an invented admitted artifact.`);
  backlinkCount += actual.length;
}
check(backlinkCount === 1540 && v05.counts.phase_120_phase_121_backlinks === backlinkCount && phase120.counts.phase_121_mission_backlinks === backlinkCount, "The aggregate packet-to-mission backlink count must be 1,540.");

check(phase120.counts.acquisition_packets === 80 && phase121.counts.missions === 68, "Phase 120 or Phase 121 stable item counts changed.");
check(phase122.counts.stage_playbooks === 8 && phase122.counts.claim_review_protocols === 12 && phase122.counts.quality_audit_cards === 10, "Phase 122 must retain its 8/12/10 taxonomy.");
check(phase123.counts.dossiers === 12 && phase123.dossiers.every((dossier) => dossier.comparison_passport.verdict === "Context only"), "Phase 123 must retain twelve context-only dossiers.");
check(phase124.counts.workbenches === 17 && phase124.workbenches.every((workbench) => workbench.workbench_state === "Operational index — evidence questions not adjudicated"), "Phase 124 must retain seventeen non-adjudicating topic workbenches.");

for (const dossier of phase123.dossiers) {
  check(Array.isArray(dossier.evidence_signal_ids) && dossier.evidence_signal_ids.length > 0, `${dossier.dossier_id} must declare at least one evidence signal.`);
  check(Array.isArray(dossier.evidence_source_ids) && dossier.evidence_source_ids.length > 0, `${dossier.dossier_id} must declare at least one evidence source.`);
  check(new Set(dossier.evidence_signal_ids ?? []).size === (dossier.evidence_signal_ids ?? []).length, `${dossier.dossier_id} contains duplicate evidence-signal declarations.`);
  check(new Set(dossier.evidence_source_ids ?? []).size === (dossier.evidence_source_ids ?? []).length, `${dossier.dossier_id} contains duplicate evidence-source declarations.`);
  for (const signalId of dossier.evidence_signal_ids ?? []) {
    check(signalStatusById.get(signalId) === "Published", `${dossier.dossier_id} references ${signalId}, which is missing or is not a Published signal.`);
  }
  for (const sourceId of dossier.evidence_source_ids ?? []) {
    check(sourceIds.has(sourceId), `${dossier.dossier_id} references missing source ${sourceId}.`);
  }
}

const acquisitionCoveredState = "Exact topic-and-stage packet joins available — artifacts remain unreviewed";
const acquisitionGapState = "No exact Phase 120 topic-and-stage packet join — acquisition coverage gap";
const workbenchMissionLinks = phase124.workbenches.flatMap((workbench) => (workbench.mission_links ?? []).map((link) => ({ ...link, workbench_topic_id: workbench.topic_id })));
check(workbenchMissionLinks.length === 68, `Phase 124 must expose exactly 68 mission links, found ${workbenchMissionLinks.length}.`);
check(new Set(workbenchMissionLinks.map((link) => link.mission_id)).size === 68, "Phase 124 must expose each Phase 121 mission exactly once.");
for (const mission of phase121.missions) {
  const links = workbenchMissionLinks.filter((link) => link.mission_id === mission.mission_id);
  check(links.length === 1, `${mission.mission_id} must resolve to exactly one Phase 124 workbench mission link.`);
  const link = links[0];
  if (!link) continue;
  check(link.workbench_topic_id === mission.topic_id, `${mission.mission_id} is linked from the wrong Phase 124 topic workbench.`);
  check(link.acquisition_state === mission.relationships.acquisition_state, `${mission.mission_id} Phase 124 acquisition state differs from Phase 121.`);
  check(sameSet(link.acquisition_packet_ids, mission.relationships.acquisition_packet_ids), `${mission.mission_id} Phase 124 acquisition packet IDs differ from Phase 121.`);
}
const phase121Covered = phase121.missions.filter((mission) => mission.relationships.acquisition_state === acquisitionCoveredState && mission.relationships.acquisition_packet_ids.length > 0);
const phase121Gaps = phase121.missions.filter((mission) => mission.relationships.acquisition_state === acquisitionGapState && mission.relationships.acquisition_packet_ids.length === 0);
const phase124Covered = workbenchMissionLinks.filter((link) => link.acquisition_state === acquisitionCoveredState && Array.isArray(link.acquisition_packet_ids) && link.acquisition_packet_ids.length > 0);
const phase124Gaps = workbenchMissionLinks.filter((link) => link.acquisition_state === acquisitionGapState && Array.isArray(link.acquisition_packet_ids) && link.acquisition_packet_ids.length === 0);
check(phase121Covered.length === 56 && phase121Gaps.length === 12, "Phase 121 must retain the exact 56 covered / 12 acquisition-gap mission split.");
check(phase121.counts.missions_with_acquisition_packets === 56 && phase121.counts.missions_with_acquisition_coverage_gaps === 12, "Phase 121 published coverage counts must remain 56 covered / 12 gap.");
check(phase124Covered.length === 56 && phase124Gaps.length === 12, "Phase 124 mission links must preserve the exact Phase 121 split of 56 covered / 12 gap.");
check(phase124.counts.missions_with_acquisition_packets === 56 && phase124.counts.missions_with_acquisition_coverage_gaps === 12, "Phase 124 published coverage counts must report 56 covered / 12 gap.");

const sourceFiles = allSourceFiles.filter((name) => name.startsWith("source-117-global-"));
check(sourceFiles.length === 80, `Expected eighty Phase 117 Candidate source records, found ${sourceFiles.length}.`);
for (const filename of sourceFiles) {
  const source = await readJson(appRoot, "src", "content", "sources", filename);
  check(source.monitoring_status === "Candidate", `${source.id} must remain Candidate after v0.5 integration.`);
}

const futureCycleRecords = cycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(futureCycleRecords.length === 11 && v05.counts.future_phase_60_gates_preserved === 11, "v0.5 must preserve eleven future Phase 60 gates.");
check(futureCycleRecords.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "v0.5 must not operate, predate, reschedule, or receipt a future Phase 60 gate.");

for (const path of [
  "src/pages/review/v05/index.astro",
  "src/pages/data/v05-evidence-fieldbook.json.ts",
  "src/data/v05-evidence-fieldbook.json",
]) {
  try { await access(join(appRoot, path)); } catch { failures.push(`Missing aggregate v0.5 artifact: ${path}`); }
}
const hub = await readFile(join(appRoot, "src", "pages", "review", "v05", "index.astro"), "utf8");
check(hub.includes("v05-evidence-fieldbook.json") && hub.includes("121 new") && hub.includes("92 enhanced"), "The v0.5 hub must expose the aggregate registry and route accounting.");

if (failures.length) {
  console.error("v0.5 Evidence Fieldbook assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.5 assertions passed: 213 surfaces (121 new + 92 enhanced), six exports, 207 leaf records, 1,540 exact packet-mission backlinks, and eleven future gates untouched.");
