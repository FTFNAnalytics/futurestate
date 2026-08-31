import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const fixedAnswerState = "Research packet assembled — answer not adjudicated";
const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sorted = (values) => [...values].sort();
const equalMembers = (left, right) => JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));

const frontmatter = (raw) => raw.split(/^---\s*$/m)[1] ?? "";
const scalar = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\r\\n]+))\\s*$`, "m"));
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
};
const list = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*\\r?\\n((?:[ \\t]+-[^\\r\\n]*(?:\\r?\\n|$))+)`, "m"));
  return [...(match?.[1] ?? "").matchAll(/^\s*-\s*(?:"([^"]*)"|'([^']*)'|([^\r\n]+))\s*$/gm)]
    .map((item) => (item[1] ?? item[2] ?? item[3] ?? "").trim());
};

const [program, coverage, acquisition, encyclopedia, atlas, authority, operatingCycle, update] = await Promise.all([
  readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json"),
  readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json"),
  readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json"),
  readJson(appRoot, "src", "data", "phase-118-canonical-living-encyclopedia.json"),
  readJson(appRoot, "src", "data", "phase-119-deep-project-place-atlas.json"),
  readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json"),
  readJson(appRoot, "src", "data", "phase-60-operating-cycle.json"),
  readJson(appRoot, "src", "content", "updates", "2026-08-30-phase-121-priority-research-missions.json"),
]);

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionById = new Map(coverage.priority_questions.map((record) => [record.question_id, record]));
const topicById = new Map(coverage.entity_registry.topics.map((record) => [record.canonical_id, record]));
const rowByTopic = new Map(coverage.coverage_matrix.map((record) => [record.topic_id, record]));
const chapterByTopic = new Map(encyclopedia.topic_chapters.map((record) => [record.topic_id, record]));
const packetById = new Map(acquisition.acquisition_packets.map((record) => [record.packet_id, record]));
const railById = new Map(authority.rails.map((record) => [record.rail_id, record]));
const projectByCanonicalId = new Map(atlas.projects.map((record) => [record.canonical_id, record]));
const placeByCanonicalId = new Map(atlas.places.map((record) => [record.canonical_id, record]));

const signalById = new Map();
for (const name of (await readdir(join(appRoot, "src", "content", "signals"))).filter((item) => item.endsWith(".mdx") || item.endsWith(".md"))) {
  const block = frontmatter(await readFile(join(appRoot, "src", "content", "signals", name), "utf8"));
  const id = scalar(block, "id");
  signalById.set(id, { status: scalar(block, "record_status"), source_ids: list(block, "source_ids") });
}
const sourceIds = new Set();
const sourceStatusById = new Map();
for (const name of (await readdir(join(appRoot, "src", "content", "sources"))).filter((item) => item.endsWith(".json"))) {
  const source = await readJson(appRoot, "src", "content", "sources", name);
  sourceIds.add(source.id);
  sourceStatusById.set(source.id, source.monitoring_status);
}

check(program.schema_version === "1.0" && program.phase === 121, "Phase 121 registry identity is invalid.");
check(program.program_id === "FTFN-PHASE-121-PRIORITY-RESEARCH-MISSIONS", "Phase 121 program ID is invalid.");
check(program.effective_date === "2026-08-30" && program.record_status === "Published" && program.status === "Complete", "Phase 121 date or publication state is invalid.");
check(program.answer_state === fixedAnswerState, "Phase 121 aggregate answer state changed.");
check(program.missions.length === 68 && program.counts.missions === 68, "Phase 121 must contain exactly 68 missions.");
check(program.topic_summaries.length === 17 && program.counts.topics === 17, "Phase 121 must cover exactly 17 topics.");
check(program.public_html_routes.length === 69 && program.counts.public_html_routes === 69 && new Set(program.public_html_routes).size === 69, "Phase 121 must contain 69 unique HTML routes.");
check(program.public_json_exports.length === 1 && program.public_json_exports[0] === "/data/phase-121-priority-research-missions.json", "Phase 121 JSON export route is invalid.");
check(program.publication_boundaries.some((item) => item.includes("not an answer")), "Phase 121 must state that a mission is not an answer.");
check(program.publication_boundaries.some((item) => item.includes("No source, signal, project, place, conversion stage, receipt, scheduled Phase 60 gate")), "Phase 121 must prohibit upstream evidence mutation.");

const missionIds = new Set();
const questionIds = new Set();
const slugs = new Set();
for (const mission of program.missions) {
  const question = questionById.get(mission.priority_question_id);
  const topic = topicById.get(mission.topic_id);
  const row = rowByTopic.get(mission.topic_id);
  const chapter = chapterByTopic.get(mission.topic_id);
  check(Boolean(question && topic && row && chapter), `${mission.mission_id} has an unresolved Phase 116/118 topic join.`);
  if (!question || !topic || !row || !chapter) continue;

  check(!missionIds.has(mission.mission_id), `Duplicate mission ID ${mission.mission_id}.`); missionIds.add(mission.mission_id);
  check(!questionIds.has(mission.priority_question_id), `Duplicate priority-question membership ${mission.priority_question_id}.`); questionIds.add(mission.priority_question_id);
  check(!slugs.has(mission.slug), `Duplicate mission slug ${mission.slug}.`); slugs.add(mission.slug);
  check(mission.slug === `${topic.slug}-${slugify(question.research_horizon)}`, `${mission.mission_id} does not use the stable topic-horizon slug.`);
  check(mission.public_route === `/review/fieldbook/missions/${mission.slug}/`, `${mission.mission_id} has the wrong public route.`);
  check(mission.answer_state === fixedAnswerState, `${mission.mission_id} advanced beyond the fixed answer state.`);
  check(mission.topic_id === question.topic_id && mission.research_horizon === question.research_horizon, `${mission.mission_id} changed its topic or horizon.`);
  check(mission.research_contract.question === question.question, `${mission.mission_id} changed the Phase 116 question.`);
  check(mission.research_contract.why_priority === question.why_priority, `${mission.mission_id} changed the Phase 116 priority rationale.`);
  check(equalMembers(mission.research_contract.required_evidence, question.required_evidence), `${mission.mission_id} changed the required-evidence contract.`);
  check(mission.research_contract.completion_rule === question.completion_rule, `${mission.mission_id} changed the completion rule.`);
  check(mission.research_contract.upstream_state === question.current_state, `${mission.mission_id} changed the upstream question state.`);
  check(equalMembers(mission.target_contract.conversion_stage_ids, question.target_stage_ids), `${mission.mission_id} changed its target stages.`);
  check(equalMembers(mission.target_contract.claim_type_ids, question.claim_type_ids), `${mission.mission_id} changed its target claim types.`);
  check(mission.target_contract.geography === question.geographic_target, `${mission.mission_id} changed its geography contract.`);
  check(Boolean(mission.research_design.method && mission.research_design.period && mission.research_design.denominator), `${mission.mission_id} lacks method, period, or denominator controls.`);

  const expectedProjectIds = row.casebook_ids.map((id) => projectByCanonicalId.get(id)?.atlas_project_id).filter(Boolean);
  const expectedPlaceIds = row.local_system_ids.map((id) => placeByCanonicalId.get(id)?.atlas_place_id).filter(Boolean);
  check(equalMembers(mission.relationships.atlas_project_ids, expectedProjectIds), `${mission.mission_id} project membership is not an exact Phase 116/119 join.`);
  check(equalMembers(mission.relationships.atlas_place_ids, expectedPlaceIds), `${mission.mission_id} place membership is not an exact Phase 116/119 join.`);
  check(equalMembers(mission.relationships.canonical_casebook_ids, row.casebook_ids), `${mission.mission_id} changed canonical casebook membership.`);
  check(equalMembers(mission.relationships.canonical_local_system_ids, row.local_system_ids), `${mission.mission_id} changed canonical place membership.`);
  check(mission.relationships.encyclopedia_chapter_id === chapter.chapter_id, `${mission.mission_id} has the wrong encyclopedia chapter.`);
  check(equalMembers(mission.relationships.context_signal_ids, chapter.evidence_signal_ids), `${mission.mission_id} context shelf differs from Phase 118.`);

  const expectedPacketIds = acquisition.acquisition_packets
    .filter((packet) => packet.topic_ids.includes(question.topic_id)
      && packet.conversion_stage_ids.some((stageId) => question.target_stage_ids.includes(stageId)))
    .map((packet) => packet.packet_id);
  check(equalMembers(mission.relationships.acquisition_packet_ids, expectedPacketIds), `${mission.mission_id} acquisition packet membership is not an exact topic/stage join.`);
  check(mission.relationships.acquisition_state === (expectedPacketIds.length
    ? "Exact topic-and-stage packet joins available — artifacts remain unreviewed"
    : "No exact Phase 120 topic-and-stage packet join — acquisition coverage gap"), `${mission.mission_id} does not expose its acquisition coverage state.`);
  for (const packetId of mission.relationships.acquisition_packet_ids) {
    const packet = packetById.get(packetId);
    const rail = packet && railById.get(packet.rail_id);
    check(Boolean(packet && rail), `${mission.mission_id} references unresolved packet ${packetId}.`);
    if (rail) check(sourceStatusById.get(rail.source_id) === "Candidate", `${mission.mission_id} acquisition rail ${rail.rail_id} advanced beyond Candidate.`);
  }

  const expectedContextSourceIds = new Set();
  for (const signalId of mission.relationships.context_signal_ids) {
    const signal = signalById.get(signalId);
    check(Boolean(signal), `${mission.mission_id} references missing context signal ${signalId}.`);
    check(signal?.status === "Published", `${mission.mission_id} context signal ${signalId} is not Published.`);
    for (const sourceId of signal?.source_ids ?? []) {
      check(sourceIds.has(sourceId), `${mission.mission_id} context signal ${signalId} references missing source ${sourceId}.`);
      expectedContextSourceIds.add(sourceId);
    }
  }
  check(equalMembers(mission.relationships.context_source_ids, [...expectedContextSourceIds]), `${mission.mission_id} source shelf is not inherited exactly from its context signals.`);
  check(mission.missing_decisive_evidence.length === question.required_evidence.length + (expectedPacketIds.length ? 0 : 1), `${mission.mission_id} does not expose every unadjudicated decisive-evidence requirement or packet-coverage gap.`);
  check(mission.missing_decisive_evidence.slice(0, question.required_evidence.length).every((item) => item.startsWith("Not yet adjudicated:")), `${mission.mission_id} overstates a decisive-evidence requirement.`);
  check(mission.acceptance_rules.length >= 4 && mission.rejection_rules.length >= 4, `${mission.mission_id} lacks acceptance or rejection rules.`);
  check(mission.stop_rule.includes("Stop at an assembled research packet") && mission.stop_rule.includes("dated human review"), `${mission.mission_id} lacks the required stop rule.`);
  check(mission.stewardship.owner_id === "121-OWNER-RESEARCH-MISSION-DESK" && Boolean(mission.stewardship.next_action), `${mission.mission_id} lacks an owner or next action.`);
  check(mission.interpretation_boundary === question.interpretation_boundary, `${mission.mission_id} changed the Phase 116 interpretation boundary.`);
}

check(questionIds.size === 68 && equalMembers([...questionIds], coverage.priority_questions.map((record) => record.question_id)), "Phase 121 is not one-to-one with all 68 Phase 116 questions.");
check(program.counts.missions_with_acquisition_packets === program.missions.filter((record) => record.relationships.acquisition_packet_ids.length > 0).length, "Phase 121 packet-covered mission count is wrong.");
check(program.counts.missions_with_acquisition_coverage_gaps === program.missions.filter((record) => record.relationships.acquisition_packet_ids.length === 0).length, "Phase 121 acquisition-gap mission count is wrong.");
for (const topic of coverage.entity_registry.topics) {
  const topicMissions = program.missions.filter((record) => record.topic_id === topic.canonical_id);
  check(topicMissions.length === 4, `${topic.canonical_id} does not have exactly four missions.`);
  check(equalMembers(topicMissions.map((record) => record.research_horizon), ["Baseline", "Conversion", "Operation", "Outcome"]), `${topic.canonical_id} does not cover all four horizons.`);
}

const futureGates = operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(futureGates.length === 11, "Phase 121 must preserve the eleven future Phase 60 gates.");
check(futureGates.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 121 mutated a future Phase 60 gate.");

const hubSource = await readFile(join(appRoot, "src", "pages", "review", "fieldbook", "missions", "index.astro"), "utf8");
const detailSource = await readFile(join(appRoot, "src", "pages", "review", "fieldbook", "missions", "[slug].astro"), "utf8");
const endpointSource = await readFile(join(appRoot, "src", "pages", "data", "phase-121-priority-research-missions.json.ts"), "utf8");
const workPackage = await readFile(join(workspaceRoot, "docs", "work-packages", "phase-121-v05-priority-research-missions.md"), "utf8");
check(hubSource.includes("Priority research missions") && hubSource.includes("No answer inferred"), "Phase 121 hub lacks its mission identity or answer boundary.");
for (const marker of ["Method, period and denominator", "Candidate rails for exact-artifact review", "Published background, not an adjudicated answer", "Acceptance rules", "Rejection rules"]) {
  check(detailSource.includes(marker), `Phase 121 mission template lacks ${marker}.`);
}
check(endpointSource.includes("phase_121_priority_research_missions"), "Phase 121 JSON endpoint identity is missing.");
check(workPackage.includes("68") && workPackage.includes("answer not adjudicated"), "Phase 121 work package is incomplete.");
check(update.affected_record_ids.length === 17 && equalMembers(update.affected_record_ids, coverage.entity_registry.topics.map((record) => record.canonical_id)), "Phase 121 update does not name all 17 affected canonical topics.");
check(update.materiality === "No record-state change" && update.publication_effect.includes("69"), "Phase 121 update overstates materiality or has the wrong route count.");

if (failures.length) {
  console.error("Phase 121 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 121 assertions passed: ${program.missions.length} exact question missions, ${program.counts.contextual_published_signals} contextual Published signals, ${program.counts.acquisition_packets_linked} Candidate packets, 69 HTML routes, and eleven untouched future gates.`);
