import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const effectiveDate = "2026-08-30";
const fixedAnswerState = "Research packet assembled — answer not adjudicated";
const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sameMembers = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);

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

async function loadSignalIndex() {
  const directory = join(appRoot, "src", "content", "signals");
  const records = new Map();
  for (const name of (await readdir(directory)).filter((item) => item.endsWith(".mdx") || item.endsWith(".md"))) {
    const block = frontmatter(await readFile(join(directory, name), "utf8"));
    const id = scalar(block, "id");
    records.set(id, {
      id,
      title: scalar(block, "title"),
      record_status: scalar(block, "record_status"),
      primary_topic: scalar(block, "primary_topic"),
      source_ids: list(block, "source_ids"),
    });
  }
  return records;
}

const researchDesignByHorizon = {
  Baseline: {
    method: "Descriptive baseline review using named entities or populations, source-defined measures, explicit coverage boundaries, and dated observations. Preserve revisions and incompatible definitions rather than merging them.",
    period: "State one reference date or observation period for every measure and retain the source's publication, capture, and revision dates separately.",
    denominator: "Name the complete population, inventory, capacity base, geography, asset set, service cohort, or other source-defined denominator. A total without its eligible universe is not admissible.",
  },
  Conversion: {
    method: "Named-file event and gate review. Resolve authority, commitment, implementation, and validation through separately dated artifacts without inferring one stage from another.",
    period: "Use an ordered chronology from the earliest relevant authority or commitment through the latest reviewed implementation or validation artifact, with every stage carrying its own date.",
    denominator: "Keep one stable project, program, facility, asset, procurement, or eligible cohort identity and state the full scope to which each milestone applies.",
  },
  Operation: {
    method: "Repeated-operation or adoption review using stable identities, compatible observations, acceptance boundaries, and explicit treatment of outages, exclusions, attrition, and partial coverage.",
    period: "Require more than a one-time milestone: use compatible repeated operating periods or a source-defined recurring reporting series, and identify any series break.",
    denominator: "Name the complete accepted asset, service population, customer cohort, production base, or eligible location set for every rate, count, share, or reliability statement.",
  },
  Outcome: {
    method: "Longitudinal outcome review with stable identities, repeat measurements, uncertainty, alternative explanations, and an explicit attribution boundary. Observation and causation remain separate decisions.",
    period: "Use compatible repeated periods long enough to distinguish a one-time event from persistence, and preserve baseline, intervention, comparison, and follow-up dates where applicable.",
    denominator: "State the affected population, service cohort, facility base, geographic universe, exposure measure, or other outcome denominator and keep it compatible across periods and comparisons.",
  },
};

const [coverage, acquisition, encyclopedia, atlas, authority] = await Promise.all([
  readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json"),
  readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json"),
  readJson(appRoot, "src", "data", "phase-118-canonical-living-encyclopedia.json"),
  readJson(appRoot, "src", "data", "phase-119-deep-project-place-atlas.json"),
  readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json"),
]);
const signalById = await loadSignalIndex();
const sourceIds = new Set();
for (const name of (await readdir(join(appRoot, "src", "content", "sources"))).filter((item) => item.endsWith(".json"))) {
  sourceIds.add((await readJson(appRoot, "src", "content", "sources", name)).id);
}

if (coverage.priority_questions.length !== 68) throw new Error("Phase 121 requires the exact 68-question Phase 116 registry.");
if (acquisition.acquisition_packets?.length !== 80) throw new Error("Phase 121 requires all 80 Phase 120 acquisition packets.");

const topicEntityById = new Map(coverage.entity_registry.topics.map((record) => [record.canonical_id, record]));
const coverageByTopic = new Map(coverage.coverage_matrix.map((record) => [record.topic_id, record]));
const chapterByTopic = new Map(encyclopedia.topic_chapters.map((record) => [record.topic_id, record]));
const railById = new Map(authority.rails.map((record) => [record.rail_id, record]));
const packetById = new Map(acquisition.acquisition_packets.map((record) => [record.packet_id, record]));

for (const packet of acquisition.acquisition_packets) {
  if (!packet.packet_id || !packet.rail_id || !Array.isArray(packet.topic_ids) || !Array.isArray(packet.conversion_stage_ids)) {
    throw new Error(`Phase 120 packet ${packet.packet_id ?? "without ID"} lacks an exact rail/topic/stage join.`);
  }
  if (!railById.has(packet.rail_id)) throw new Error(`${packet.packet_id} references unknown authority rail ${packet.rail_id}.`);
}

const missions = coverage.priority_questions.map((question, index) => {
  const topic = topicEntityById.get(question.topic_id);
  const row = coverageByTopic.get(question.topic_id);
  const chapter = chapterByTopic.get(question.topic_id);
  const design = researchDesignByHorizon[question.research_horizon];
  if (!topic || !row || !chapter || !design) throw new Error(`${question.question_id} cannot resolve its exact topic, coverage row, chapter, or horizon design.`);

  const contextSignalIds = [...chapter.evidence_signal_ids];
  const contextSourceIds = [...new Set(contextSignalIds.flatMap((id) => {
    const signal = signalById.get(id);
    if (!signal) throw new Error(`${question.question_id} references missing context signal ${id}.`);
    if (signal.record_status !== "Published") throw new Error(`${question.question_id} context signal ${id} is not Published.`);
    return signal.source_ids;
  }))].sort();
  for (const id of contextSourceIds) if (!sourceIds.has(id)) throw new Error(`${question.question_id} context source ${id} does not resolve.`);

  const atlasProjectIds = atlas.projects
    .filter((record) => row.casebook_ids.includes(record.canonical_id))
    .map((record) => record.atlas_project_id)
    .sort();
  const atlasPlaceIds = atlas.places
    .filter((record) => row.local_system_ids.includes(record.canonical_id))
    .map((record) => record.atlas_place_id)
    .sort();
  const acquisitionPacketIds = acquisition.acquisition_packets
    .filter((packet) => packet.topic_ids.includes(question.topic_id)
      && packet.conversion_stage_ids.some((stageId) => question.target_stage_ids.includes(stageId)))
    .map((packet) => packet.packet_id)
    .sort();

  for (const id of acquisitionPacketIds) if (!packetById.has(id)) throw new Error(`${question.question_id} references unknown acquisition packet ${id}.`);

  const acquisitionState = acquisitionPacketIds.length
    ? "Exact topic-and-stage packet joins available — artifacts remain unreviewed"
    : "No exact Phase 120 topic-and-stage packet join — acquisition coverage gap";
  const missingDecisiveEvidence = [
    ...question.required_evidence.map((requirement) => `Not yet adjudicated: whether the reviewed record satisfies ${requirement}`),
    ...(acquisitionPacketIds.length ? [] : ["Not yet mapped: a Phase 120 Candidate acquisition packet covering both this topic and at least one target conversion stage."]),
  ];

  return {
    mission_id: `121-MISSION-${String(index + 1).padStart(3, "0")}`,
    priority_question_id: question.question_id,
    slug: `${topic.slug}-${slugify(question.research_horizon)}`,
    title: `${topic.label}: ${question.research_horizon.toLowerCase()} research mission`,
    topic_id: question.topic_id,
    topic_slug: topic.slug,
    topic_label: topic.label,
    research_horizon: question.research_horizon,
    answer_state: fixedAnswerState,
    research_contract: {
      question: question.question,
      why_priority: question.why_priority,
      required_evidence: [...question.required_evidence],
      completion_rule: question.completion_rule,
      upstream_state: question.current_state,
    },
    target_contract: {
      conversion_stage_ids: [...question.target_stage_ids],
      claim_type_ids: [...question.claim_type_ids],
      geography: question.geographic_target,
    },
    research_design: { ...design },
    relationships: {
      acquisition_packet_ids: acquisitionPacketIds,
      acquisition_state: acquisitionState,
      atlas_project_ids: atlasProjectIds,
      atlas_place_ids: atlasPlaceIds,
      canonical_casebook_ids: [...row.casebook_ids],
      canonical_local_system_ids: [...row.local_system_ids],
      encyclopedia_chapter_id: chapter.chapter_id,
      context_signal_ids: contextSignalIds,
      context_source_ids: contextSourceIds,
    },
    missing_decisive_evidence: missingDecisiveEvidence,
    acceptance_rules: [
      "Every required evidence item is resolved to an exact artifact and reviewed against the named entity, geography, method, period, and denominator.",
      "Every target conversion stage is decided independently; an earlier stage is never used as proof of a later stage.",
      "All supporting signal and source IDs resolve, all material conflicts and revisions are retained, and the conclusion stays within the source-defined scope.",
      "The dated review records a bounded answer, an explicit evidence gap, or an inadmissibility decision without converting contextual evidence into an outcome claim.",
    ],
    rejection_rules: [
      "Reject a portal, search page, institution identity, announcement, or other discovery rail when no exact artifact has been reviewed.",
      "Reject entity, facility, asset, cohort, geography, method, period, or denominator mismatches and any silent series splice.",
      "Reject any inference that authority proves implementation, implementation proves acceptance, acceptance proves repeated operation, or operation proves an outcome.",
      "Reject a conclusion assembled from contextual topic evidence when the mission-specific completion contract has not been adjudicated.",
    ],
    stop_rule: "Stop at an assembled research packet. Do not publish an answer, advance a conversion stage, create an observation or outcome, or infer that evidence is absent until a dated human review applies every acceptance and rejection rule.",
    stewardship: {
      owner_id: "121-OWNER-RESEARCH-MISSION-DESK",
      owner_role: "FTFN research mission desk",
      next_action: "Review the contextual shelf and exact acquisition packets against every required evidence item, then record a later dated bounded answer, explicit gap, or inadmissibility decision.",
    },
    interpretation_boundary: question.interpretation_boundary,
    public_route: `/review/fieldbook/missions/${topic.slug}-${slugify(question.research_horizon)}/`,
  };
});

const expectedQuestionIds = [...coverage.priority_questions.map((record) => record.question_id)].sort();
const actualQuestionIds = [...missions.map((record) => record.priority_question_id)].sort();
if (!sameMembers(expectedQuestionIds, actualQuestionIds)) throw new Error("Phase 121 mission membership differs from Phase 116 priority-question membership.");

const topic_summaries = coverage.entity_registry.topics.map((topic) => ({
  topic_id: topic.canonical_id,
  topic_slug: topic.slug,
  topic_label: topic.label,
  mission_ids: missions.filter((record) => record.topic_id === topic.canonical_id).map((record) => record.mission_id),
}));
const publicHtmlRoutes = ["/review/fieldbook/missions/", ...missions.map((record) => record.public_route)];

const program = {
  schema_version: "1.0",
  phase: 121,
  program_id: "FTFN-PHASE-121-PRIORITY-RESEARCH-MISSIONS",
  title: "FTFN Priority Research Missions",
  effective_date: effectiveDate,
  record_status: "Published",
  status: "Complete",
  answer_state: fixedAnswerState,
  summary: "Sixty-eight public research missions that preserve the exact Phase 116 question contracts and connect them through stable IDs to contextual Published evidence, named projects and places, and Candidate-only acquisition packets.",
  publication_boundaries: [
    "A research mission is an assembled investigation contract, not an answer, finding, evidence decision, score, ranking, recommendation, observation, outcome, or claim that an artifact exists or does not exist.",
    "Phase 118 signals are contextual background. Their presence never satisfies a mission-specific evidence requirement without a later dated review.",
    "Phase 120 packets remain Candidate discovery infrastructure. A portal, artifact family, or acquisition instruction is not an admitted artifact.",
    "No source, signal, project, place, conversion stage, receipt, scheduled Phase 60 gate, or upstream evidence state is changed by this registry.",
  ],
  counts: {
    missions: missions.length,
    topics: topic_summaries.length,
    missions_per_topic: 4,
    public_html_routes: publicHtmlRoutes.length,
    public_json_exports: 1,
    contextual_published_signals: new Set(missions.flatMap((record) => record.relationships.context_signal_ids)).size,
    contextual_sources: new Set(missions.flatMap((record) => record.relationships.context_source_ids)).size,
    acquisition_packets_linked: new Set(missions.flatMap((record) => record.relationships.acquisition_packet_ids)).size,
    missions_with_acquisition_packets: missions.filter((record) => record.relationships.acquisition_packet_ids.length > 0).length,
    missions_with_acquisition_coverage_gaps: missions.filter((record) => record.relationships.acquisition_packet_ids.length === 0).length,
    atlas_projects_linked: new Set(missions.flatMap((record) => record.relationships.atlas_project_ids)).size,
    atlas_places_linked: new Set(missions.flatMap((record) => record.relationships.atlas_place_ids)).size,
  },
  owners: [{ owner_id: "121-OWNER-RESEARCH-MISSION-DESK", role: "FTFN research mission desk" }],
  topic_summaries,
  missions,
  public_html_routes: publicHtmlRoutes,
  public_json_exports: ["/data/phase-121-priority-research-missions.json"],
};

await writeJson(join(appRoot, "src", "data", "phase-121-priority-research-missions.json"), program);
console.log(`Phase 121 built: ${program.counts.missions} exact research missions across ${program.counts.topics} topics and ${program.counts.public_html_routes} HTML routes.`);
