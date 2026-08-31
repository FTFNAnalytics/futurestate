import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (name) => JSON.parse(await readFile(join(appRoot, "src", "data", name), "utf8"));
const [registry, acquisition, missions, methods, dossiers, operatingCycle] = await Promise.all([
  readJson("phase-124-topic-research-workbenches.json"),
  readJson("phase-120-evidence-acquisition-packets.json"),
  readJson("phase-121-priority-research-missions.json"),
  readJson("phase-122-verification-playbook-library.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-60-operating-cycle.json"),
]);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const expectedMethodCount = methods.stage_playbooks.length + methods.claim_review_protocols.length + methods.quality_audit_cards.length;
const sameOrderedArray = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
const sameSet = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item) => new Set(right).has(item));
const missionById = new Map(missions.missions.map((mission) => [mission.mission_id, mission]));
const packetById = new Map(acquisition.acquisition_packets.map((packet) => [packet.packet_id, packet]));
const sourceCoveredMissions = missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length > 0);
const sourceGapMissions = missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0);
const allWorkbenchMissionLinks = registry.workbenches.flatMap((record) => record.mission_links);
const allWorkbenchMissionIds = allWorkbenchMissionLinks.map((mission) => mission.mission_id);
let exactMissionPacketLinks = 0;

check(registry.program_id === "FTFN-PHASE-124-TOPIC-RESEARCH-WORKBENCHES" && registry.status === "Complete", "Phase 124 identity or status is invalid.");
check(registry.workbenches.length === 17 && registry.public_html_routes.length === 18, "Phase 124 must expose seventeen workbenches and one hub.");
check(new Set(registry.workbenches.map((record) => record.topic_id)).size === 17, "Phase 124 topic IDs must be unique.");
check(sourceCoveredMissions.length === 56 && sourceGapMissions.length === 12, "Phase 121 must retain the exact 56-covered/12-gap acquisition split.");
check(missions.counts.missions_with_acquisition_packets === 56 && missions.counts.missions_with_acquisition_coverage_gaps === 12, "Phase 121 acquisition coverage counts must remain 56 covered and 12 gap.");
check(allWorkbenchMissionIds.length === 68 && new Set(allWorkbenchMissionIds).size === 68 && sameSet(allWorkbenchMissionIds, missions.missions.map((mission) => mission.mission_id)), "Phase 124 must link every Phase 121 mission exactly once.");
for (const record of registry.workbenches) {
  check(record.mission_links.length === 4 && record.mission_links.every((item) => item.answer_state === "Research packet assembled — answer not adjudicated"), `${record.workbench_id} must preserve four unadjudicated missions.`);
  const expectedTopicMissionIds = missions.missions.filter((mission) => mission.topic_id === record.topic_id).map((mission) => mission.mission_id);
  check(sameSet(record.mission_links.map((mission) => mission.mission_id), expectedTopicMissionIds), `${record.workbench_id} mission inventory does not exactly match its Phase 121 topic missions.`);
  check(record.acquisition_inventory_scope?.label === "Discovery inventory" && record.acquisition_inventory_scope?.scope === "Topic-wide" && /not assigned to every mission/.test(record.acquisition_inventory_scope?.assignment_boundary ?? ""), `${record.workbench_id} must label topic-wide packets only as discovery inventory.`);
  const expectedTopicPacketIds = acquisition.acquisition_packets.filter((packet) => packet.topic_ids.includes(record.topic_id)).map((packet) => packet.packet_id);
  check(record.acquisition_links.length > 0 && sameOrderedArray(record.acquisition_links.map((item) => item.packet_id), expectedTopicPacketIds), `${record.workbench_id} topic-wide discovery inventory must exactly match its Phase 120 topic packet inventory.`);
  check(record.acquisition_links.every((item) => item.disposition === "Prepared — no exact artifact admitted" && item.inventory_role === "Discovery inventory only"), `${record.workbench_id} must preserve Candidate-only acquisition state and discovery-only inventory labels.`);
  for (const missionLink of record.mission_links) {
    const sourceMission = missionById.get(missionLink.mission_id);
    check(Boolean(sourceMission), `${record.workbench_id} references unknown mission ${missionLink.mission_id}.`);
    if (!sourceMission) continue;
    const expectedPacketIds = sourceMission.relationships.acquisition_packet_ids;
    const expectedCoverage = expectedPacketIds.length > 0 ? "Covered" : "Gap";
    check(sourceMission.topic_id === record.topic_id, `${missionLink.mission_id} is attached to the wrong topic workbench.`);
    check(sameOrderedArray(missionLink.acquisition_packet_ids, expectedPacketIds), `${missionLink.mission_id} must preserve the exact ordered Phase 121 acquisition_packet_ids array.`);
    check(missionLink.acquisition_state === sourceMission.relationships.acquisition_state, `${missionLink.mission_id} must preserve the exact Phase 121 acquisition_state.`);
    check(missionLink.acquisition_coverage === expectedCoverage, `${missionLink.mission_id} must render the derived ${expectedCoverage} acquisition label.`);
    check(missionLink.acquisition_packet_count === expectedPacketIds.length, `${missionLink.mission_id} acquisition packet count is not exact.`);
    exactMissionPacketLinks += missionLink.acquisition_packet_ids.length;
    for (const packetId of missionLink.acquisition_packet_ids) {
      const packet = packetById.get(packetId);
      check(Boolean(packet), `${missionLink.mission_id} references unknown packet ${packetId}.`);
      if (!packet) continue;
      check(packet.topic_ids.includes(record.topic_id), `${missionLink.mission_id} packet ${packetId} does not share its topic.`);
      check(packet.mission_linkage.priority_question_ids.includes(sourceMission.priority_question_id), `${missionLink.mission_id} packet ${packetId} lacks the reciprocal priority-question linkage.`);
    }
  }
  const methodIds = new Set([...record.method_links.stages, ...record.method_links.primary_claims, ...record.method_links.adjacent_claim_guardrails, ...record.method_links.quality].map((item) => item.record_id));
  check(methodIds.size === expectedMethodCount, `${record.workbench_id} must link all thirty method guides.`);
  check(record.quality_audit.length === 10 && record.quality_audit.every((item) => item.state === "Not adjudicated independently"), `${record.workbench_id} must keep ten independent quality dimensions unadjudicated.`);
  check(record.open_work.unresolved_questions.length === 4 && record.open_work.exact_next_artifacts.length === 4, `${record.workbench_id} must expose four open questions and next-artifact contracts.`);
  check(/does not establish/.test(record.interpretation_boundary) && /score or ranking/.test(record.interpretation_boundary), `${record.workbench_id} lacks its interpretation boundary.`);
}
check(registry.counts.missions_linked === missions.missions.length, "All Phase 121 missions must be linked.");
check(registry.counts.acquisition_packets_linked === acquisition.acquisition_packets.length, "All Phase 120 packets must be linked.");
check(registry.counts.topic_discovery_packets === acquisition.acquisition_packets.length, "All Phase 120 packets must remain reachable as topic-wide discovery inventory.");
check(registry.counts.missions_with_acquisition_packets === 56 && registry.counts.missions_with_acquisition_coverage_gaps === 12, "Phase 124 must expose the exact 56-covered/12-gap mission split.");
check(allWorkbenchMissionLinks.filter((mission) => mission.acquisition_coverage === "Covered").length === 56 && allWorkbenchMissionLinks.filter((mission) => mission.acquisition_coverage === "Gap").length === 12, "Phase 124 mission display labels must total exactly 56 Covered and 12 Gap.");
check(exactMissionPacketLinks === 1540 && registry.counts.mission_acquisition_packet_links === exactMissionPacketLinks, "Phase 124 must preserve all 1,540 exact Phase 121 mission-to-packet relationships.");
check(registry.counts.method_guides_linked === expectedMethodCount, "All Phase 122 method guides must be linked.");
check(registry.counts.dossiers_linked === dossiers.dossiers.length, "All Phase 123 dossiers must be linked.");
const future = operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(future.length === 11 && future.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 124 must preserve eleven future evidence gates.");

const [workbenchRoute, workbenchIndexRoute] = await Promise.all([
  readFile(join(appRoot, "src", "pages", "review", "fieldbook", "topics", "[slug].astro"), "utf8"),
  readFile(join(appRoot, "src", "pages", "review", "fieldbook", "topics", "index.astro"), "utf8"),
]);
check(workbenchRoute.includes("mission.acquisition_coverage") && workbenchRoute.includes('"Covered"') && workbenchRoute.includes("Gap means"), "Every topic workbench route must render Covered/Gap beside each mission.");
check(workbenchRoute.includes("record.acquisition_inventory_scope") && workbenchRoute.includes("topic discovery packets"), "Topic workbench routes must label topic-wide packets as discovery inventory.");
check(workbenchIndexRoute.includes("missions_with_acquisition_packets") && workbenchIndexRoute.includes("missions_with_acquisition_coverage_gaps") && workbenchIndexRoute.includes("topic discovery packets"), "The Phase 124 hub must expose the 56-covered/12-gap split and discovery-inventory boundary.");

if (failures.length) {
  console.error("Phase 124 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Phase 124 assertions passed: ${registry.workbenches.length} workbenches, ${registry.counts.missions_with_acquisition_packets} Covered missions, ${registry.counts.missions_with_acquisition_coverage_gaps} Gap missions, ${exactMissionPacketLinks} exact mission-packet links and ${registry.counts.topic_discovery_packets} topic discovery packets.`);
