import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const unique = (values) => [...new Set(values.filter(Boolean))];
const date = "2026-08-30";

const [coverage, acquisition, missions, methods, dossiers, encyclopedia, atlas] = await Promise.all([
  readJson("phase-116-coverage-architecture.json"),
  readJson("phase-120-evidence-acquisition-packets.json"),
  readJson("phase-121-priority-research-missions.json"),
  readJson("phase-122-verification-playbook-library.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-118-canonical-living-encyclopedia.json"),
  readJson("phase-119-deep-project-place-atlas.json"),
]);

const topicById = new Map(coverage.entity_registry.topics.map((record) => [record.canonical_id, record]));
const chapterByTopic = new Map(encyclopedia.topic_chapters.map((record) => [record.topic_id, record]));
const stageGuideByContract = new Map(methods.stage_playbooks.map((record) => [record.source_contract_id, record]));
const claimGuideByContract = new Map(methods.claim_review_protocols.map((record) => [record.source_contract_id, record]));
const projectByCanonicalId = new Map(atlas.projects.map((record) => [record.canonical_id, record]));
const placeByCanonicalId = new Map(atlas.places.map((record) => [record.canonical_id, record]));

const workbenches = coverage.coverage_matrix.map((row, index) => {
  const topic = topicById.get(row.topic_id);
  const chapter = chapterByTopic.get(row.topic_id);
  if (!topic || !chapter) throw new Error(`Phase 124 cannot resolve topic or chapter for ${row.topic_id}`);
  const topicMissions = missions.missions.filter((record) => record.topic_id === row.topic_id);
  if (topicMissions.length !== 4) throw new Error(`${row.topic_id} must resolve to four Phase 121 missions.`);
  const topicPackets = acquisition.acquisition_packets.filter((record) => record.topic_ids.includes(row.topic_id));
  if (!topicPackets.length) throw new Error(`${row.topic_id} must resolve to at least one Phase 120 packet.`);
  const stageIds = unique(topicMissions.flatMap((record) => record.target_contract.conversion_stage_ids));
  const claimIds = unique(topicMissions.flatMap((record) => record.target_contract.claim_type_ids));
  const stageGuides = stageIds.map((id) => stageGuideByContract.get(id));
  const primaryClaimGuides = claimIds.map((id) => claimGuideByContract.get(id));
  if ([...stageGuides, ...primaryClaimGuides].some((record) => !record)) throw new Error(`${row.topic_id} has an unresolved method guide.`);
  const adjacentClaimGuides = methods.claim_review_protocols.filter((record) => !claimIds.includes(record.source_contract_id));
  const topicDossiers = dossiers.dossiers.filter((record) => record.topic_ids.includes(row.topic_id));
  const projects = row.casebook_ids.map((id) => projectByCanonicalId.get(id)).filter(Boolean);
  const places = row.local_system_ids.map((id) => placeByCanonicalId.get(id)).filter(Boolean);
  const contextSignalIds = unique(topicMissions.flatMap((record) => record.relationships.context_signal_ids));
  const contextSourceIds = unique(topicMissions.flatMap((record) => record.relationships.context_source_ids));
  return {
    workbench_id: `124-WORKBENCH-${String(index + 1).padStart(3, "0")}`,
    topic_id: row.topic_id,
    slug: row.slug,
    title: `${row.label} research workbench`,
    record_status: "Published",
    workbench_state: "Operational index — evidence questions not adjudicated",
    freshness_date: date,
    canonical_context: {
      coverage_route: `/review/coverage/${row.slug}/`,
      encyclopedia_chapter_id: chapter.chapter_id,
      encyclopedia_route: `/review/encyclopedia/topics/${row.slug}/`,
      baseline_state: row.baseline_state,
      published_signals: row.current_inventory.published_signals,
      registered_sources: row.current_inventory.registered_sources,
      latest_published_signal_capture_date: row.current_inventory.latest_published_signal_capture_date,
    },
    mission_links: topicMissions.map((record) => {
      const acquisitionPacketIds = [...record.relationships.acquisition_packet_ids];
      return {
        mission_id: record.mission_id,
        horizon: record.research_horizon,
        title: record.title,
        route: record.public_route,
        answer_state: record.answer_state,
        question: record.research_contract.question,
        completion_rule: record.research_contract.completion_rule,
        acquisition_packet_ids: acquisitionPacketIds,
        acquisition_state: record.relationships.acquisition_state,
        acquisition_coverage: acquisitionPacketIds.length > 0 ? "Covered" : "Gap",
        acquisition_packet_count: acquisitionPacketIds.length,
      };
    }),
    acquisition_inventory_scope: {
      label: "Discovery inventory",
      scope: "Topic-wide",
      assignment_boundary: "These packets are topic-wide discovery inventory only. They are not assigned to every mission; each mission_link.acquisition_packet_ids array is the exact authoritative Phase 121 linkage.",
    },
    acquisition_links: topicPackets.map((record) => ({
      packet_id: record.packet_id,
      rail_id: record.rail_id,
      institution_name: record.institution_name,
      jurisdiction_name: record.jurisdiction_name,
      authority_class: record.authority_class,
      route: record.routes.authority_rail,
      disposition: record.disposition.status,
      target_count: record.artifact_targets.length,
      inventory_role: "Discovery inventory only",
    })),
    method_links: {
      stages: stageGuides.map((record) => ({ record_id: record.record_id, label: record.source_contract_label, route: record.route })),
      primary_claims: primaryClaimGuides.map((record) => ({ record_id: record.record_id, label: record.source_contract_label, route: record.route })),
      adjacent_claim_guardrails: adjacentClaimGuides.map((record) => ({ record_id: record.record_id, label: record.source_contract_label, route: record.route })),
      quality: methods.quality_audit_cards.map((record) => ({ record_id: record.record_id, label: record.source_contract_label, route: record.route })),
    },
    dossier_links: topicDossiers.map((record) => ({ dossier_id: record.dossier_id, title: record.title, route: record.route, verdict: record.comparison_passport.verdict })),
    project_links: projects.map((record) => ({ atlas_project_id: record.atlas_project_id, title: record.title, route: record.routes.atlas, coverage_tier: record.coverage.tier_id })),
    place_links: places.map((record) => ({ atlas_place_id: record.atlas_place_id, title: record.title, route: record.routes.atlas, coverage_tier: record.coverage.tier_id })),
    evidence_context: {
      signal_ids: contextSignalIds,
      source_ids: contextSourceIds,
      use_boundary: "Published context helps orient the investigation. It does not answer any mission until its exact evidence contract is adjudicated.",
    },
    quality_audit: methods.quality_audit_cards.map((record) => ({
      quality_dimension_id: record.source_contract_id,
      guide_id: record.record_id,
      state: "Not adjudicated independently",
      next_action: `Apply ${record.source_contract_label.toLowerCase()} to each proposed mission answer without combining it into a score.`,
    })),
    open_work: {
      change_since_v04: "v0.5 connects the existing coverage and encyclopedia records to exact mission, acquisition, method, Atlas and comparison IDs. It creates an operational research view without changing evidence state.",
      unresolved_questions: topicMissions.map((record) => record.research_contract.question),
      exact_next_artifacts: topicMissions.map((record) => ({ mission_id: record.mission_id, requirements: record.research_contract.required_evidence })),
      next_action: row.next_action,
      correction_path: "Correct the originating source or signal first, then regenerate the mission, dossier and workbench joins and publish a dated update after release validation.",
      owner_id: "124-OWNER-TOPIC-WORKBENCH-DESK",
    },
    route: `/review/fieldbook/topics/${row.slug}/`,
    interpretation_boundary: "The workbench organizes existing evidence and future research. It does not establish that a required artifact exists, answer a mission, advance a conversion stage, compare performance, or create an observation, outcome, score or ranking.",
  };
});

const publicHtmlRoutes = ["/review/fieldbook/topics/", ...workbenches.map((record) => record.route)];
const registry = {
  schema_version: "1.0",
  program_id: "FTFN-PHASE-124-TOPIC-RESEARCH-WORKBENCHES",
  phase: 124,
  title: "Integrated topic research workbenches",
  effective_date: date,
  record_status: "Published",
  status: "Complete",
  summary: "Seventeen operational topic workbenches compose coverage, narrative context, topic-wide discovery inventory, research missions, verification playbooks, named projects and places, and comparison dossiers without deciding the underlying questions. Exact Phase 121 linkage leaves fifty-six missions covered and twelve with acquisition gaps.",
  publication_boundary: "Phase 124 is an index and stewardship layer. It creates no artifact admission, source fact, signal, evidence decision, project promotion, observation, outcome, score or ranking.",
  counts: {
    workbenches: workbenches.length,
    missions_linked: new Set(workbenches.flatMap((record) => record.mission_links.map((item) => item.mission_id))).size,
    acquisition_packets_linked: new Set(workbenches.flatMap((record) => record.acquisition_links.map((item) => item.packet_id))).size,
    topic_discovery_packets: new Set(workbenches.flatMap((record) => record.acquisition_links.map((item) => item.packet_id))).size,
    mission_acquisition_packet_links: workbenches.reduce((total, record) => total + record.mission_links.reduce((subtotal, mission) => subtotal + mission.acquisition_packet_ids.length, 0), 0),
    missions_with_acquisition_packets: workbenches.flatMap((record) => record.mission_links).filter((mission) => mission.acquisition_packet_ids.length > 0).length,
    missions_with_acquisition_coverage_gaps: workbenches.flatMap((record) => record.mission_links).filter((mission) => mission.acquisition_packet_ids.length === 0).length,
    method_guides_linked: new Set(workbenches.flatMap((record) => [...record.method_links.stages, ...record.method_links.primary_claims, ...record.method_links.adjacent_claim_guardrails, ...record.method_links.quality].map((item) => item.record_id))).size,
    dossiers_linked: new Set(workbenches.flatMap((record) => record.dossier_links.map((item) => item.dossier_id))).size,
    atlas_projects_linked: new Set(workbenches.flatMap((record) => record.project_links.map((item) => item.atlas_project_id))).size,
    atlas_places_linked: new Set(workbenches.flatMap((record) => record.place_links.map((item) => item.atlas_place_id))).size,
    context_signals_linked: new Set(workbenches.flatMap((record) => record.evidence_context.signal_ids)).size,
    context_sources_linked: new Set(workbenches.flatMap((record) => record.evidence_context.source_ids)).size,
    public_html_routes: publicHtmlRoutes.length,
    public_json_exports: 1,
  },
  count_definitions: {
    acquisition_packets_linked: "Unique Phase 120 packets reachable as topic-wide discovery inventory; this count is not a mission-assignment claim.",
    mission_acquisition_packet_links: "Exact Phase 121 mission-to-packet relationships, counted with each mission relationship preserved independently.",
    missions_with_acquisition_packets: "Missions whose exact Phase 121 acquisition_packet_ids array contains at least one packet.",
    missions_with_acquisition_coverage_gaps: "Missions whose exact Phase 121 acquisition_packet_ids array is empty.",
  },
  routes: { index: publicHtmlRoutes[0], public_export: "/data/phase-124-topic-research-workbenches.json" },
  public_html_routes: publicHtmlRoutes,
  workbenches,
};

const update = {
  id: "update-2026-08-30-phase-124-topic-research-workbenches",
  effective_date: date,
  entry_type: "Source Refresh",
  title: "Phase 124 opens seventeen integrated research workbenches",
  summary: "Every canonical topic now has one action-oriented surface preserving each mission's exact acquisition state and packet IDs: 56 missions are Covered and 12 remain Gap. Topic-wide packets are labelled only as discovery inventory.",
  affected_record_ids: workbenches.map((record) => record.topic_id),
  related_paths: [registry.routes.index, registry.routes.public_export, ...workbenches.map((record) => record.route)],
  evidence_note: registry.publication_boundary,
  materiality: "No record-state change",
  publication_effect: "Adds eighteen Fieldbook routes and one public JSON export; exposes the exact 56-covered/12-gap acquisition split while preserving every upstream evidence and project state.",
  next_check_date: null,
  work_package: "docs/work-packages/phase-124-v05-topic-research-workbenches.md",
};

const workPackage = `# Phase 124 — Integrated Topic Research Workbenches\n\n**Status:** Complete  \n**Effective date:** ${date}  \n**Program:** FTFN v0.5 — The Evidence Fieldbook\n\n## Purpose\n\nGive each canonical topic one operational research surface. The workbench composes existing architecture and evidence into visible next work; it does not replace the coverage file or encyclopedia chapter.\n\n## Delivered\n\n- ${registry.counts.workbenches} topic workbenches with exactly four missions each.\n- All ${registry.counts.missions_linked} Phase 121 missions preserve their exact acquisition state and ordered packet IDs: ${registry.counts.missions_with_acquisition_packets} are Covered and ${registry.counts.missions_with_acquisition_coverage_gaps} remain Gap.\n- All ${registry.counts.topic_discovery_packets} Phase 120 packets are reachable as topic-wide discovery inventory only; that inventory is not an assignment to every mission.\n- ${registry.counts.mission_acquisition_packet_links} exact mission-to-packet relationships, ${registry.counts.method_guides_linked} Phase 122 playbooks and ${registry.counts.dossiers_linked} Phase 123 dossiers are linked by stable ID.\n- ${registry.counts.atlas_projects_linked} project and ${registry.counts.atlas_places_linked} place joins.\n- Independent quality states, exact next-artifact requirements, owners, freshness and correction paths.\n- Eighteen routes and one public JSON export.\n\n## Boundary\n\nA workbench is an index, not an adjudication. All mission answers and quality dimensions remain unadjudicated. Topic-wide Candidate packet lists are discovery inventory only; exact mission coverage comes exclusively from each copied Phase 121 acquisition_packet_ids array. Comparison dossiers remain context-only.\n\n## Completion standard\n\nPhase 124 is complete when all seventeen topics resolve one-to-one, every workbench has four missions, every mission preserves its exact Phase 121 acquisition state and packet IDs, the 56-covered/12-gap split is unchanged, every Phase 120–123 object is reachable from at least one workbench where applicable, canonical project/place identity is preserved, and no evidence or future-gate state changes.\n`;

await Promise.all([
  writeFile(join(dataRoot, "phase-124-topic-research-workbenches.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8"),
  writeFile(join(appRoot, "src", "content", "updates", "2026-08-30-phase-124-topic-research-workbenches.json"), `${JSON.stringify(update, null, 2)}\n`, "utf8"),
  writeFile(join(workspaceRoot, "docs", "work-packages", "phase-124-v05-topic-research-workbenches.md"), workPackage, "utf8"),
]);

console.log(`Phase 124 built: ${registry.counts.workbenches} workbenches, ${registry.counts.missions_linked} missions (${registry.counts.missions_with_acquisition_packets} covered / ${registry.counts.missions_with_acquisition_coverage_gaps} gap), ${registry.counts.topic_discovery_packets} topic discovery packets and ${registry.counts.method_guides_linked} method guides.`);
