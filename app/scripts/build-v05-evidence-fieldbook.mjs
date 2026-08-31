import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const effectiveDate = "2026-08-30";
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const unique = (items) => [...new Set(items)];

const phase120Path = join(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json");
const phase120 = await readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json");
const phase121 = await readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json");
const phase122 = await readJson(appRoot, "src", "data", "phase-122-verification-playbook-library.json");
const phase123 = await readJson(appRoot, "src", "data", "phase-123-comparative-delivery-dossiers.json");
const phase124 = await readJson(appRoot, "src", "data", "phase-124-topic-research-workbenches.json");

const missionByQuestionId = new Map(phase121.missions.map((mission) => [mission.priority_question_id, mission]));
const missionById = new Map(phase121.missions.map((mission) => [mission.mission_id, mission]));
let backlinkCount = 0;

const resolvedPackets = phase120.acquisition_packets.map((packet) => {
  if (packet.disposition.status !== "Prepared — no exact artifact admitted" || packet.disposition.artifacts_admitted !== 0) {
    throw new Error(`${packet.packet_id} changed its Phase 120 preparation disposition before v0.5 integration.`);
  }
  const phase121MissionIds = unique(packet.mission_linkage.priority_question_ids.map((questionId) => {
    const mission = missionByQuestionId.get(questionId);
    if (!mission) throw new Error(`${packet.packet_id} references unknown Phase 121 question ${questionId}.`);
    return mission.mission_id;
  })).sort((left, right) => left.localeCompare(right));

  for (const missionId of phase121MissionIds) {
    const mission = missionById.get(missionId);
    if (!mission.relationships.acquisition_packet_ids.includes(packet.packet_id)) {
      throw new Error(`${packet.packet_id} and ${missionId} are not reciprocal exact topic-and-stage joins.`);
    }
  }
  backlinkCount += phase121MissionIds.length;

  return {
    ...packet,
    mission_linkage: {
      ...packet.mission_linkage,
      linkage_status: "Resolved — exact Phase 121 mission backlinks published",
      phase_121_mission_ids: phase121MissionIds,
      linkage_resolved_date: effectiveDate,
    },
  };
});

const resolvedPhase120 = {
  ...phase120,
  counts: {
    ...phase120.counts,
    phase_121_mission_backlinks: backlinkCount,
  },
  acquisition_packets: resolvedPackets,
};
await writeJson(phase120Path, resolvedPhase120);

const phase120NewRoutes = [resolvedPhase120.routes.hub];
const phase120EnhancedRoutes = resolvedPackets.map((packet) => packet.routes.authority_rail);
const phase121NewRoutes = phase121.public_html_routes;
const phase122NewRoutes = phase122.public_routes.filter((route) => route.startsWith("/review/"));
const phase123NewRoutes = [phase123.routes.index];
const phase123EnhancedRoutes = phase123.routes.enhanced;
const phase124NewRoutes = phase124.public_html_routes;
const aggregateHubRoute = "/review/v05/";

const newPublicHtmlRoutes = unique([
  ...phase120NewRoutes,
  ...phase121NewRoutes,
  ...phase122NewRoutes,
  ...phase123NewRoutes,
  ...phase124NewRoutes,
  aggregateHubRoute,
]);
const enhancedExistingHtmlRoutes = unique([...phase120EnhancedRoutes, ...phase123EnhancedRoutes]);
const publicHtmlRoutes = unique([...newPublicHtmlRoutes, ...enhancedExistingHtmlRoutes]);
const publicJsonExports = unique([
  resolvedPhase120.routes.data,
  ...phase121.public_json_exports,
  phase122.public_routes.find((route) => route.startsWith("/data/")),
  phase123.routes.public_export,
  phase124.routes.public_export,
  "/data/v05-evidence-fieldbook.json",
].filter(Boolean));

if (newPublicHtmlRoutes.length !== 121) throw new Error(`Expected 121 new v0.5 HTML routes, found ${newPublicHtmlRoutes.length}.`);
if (enhancedExistingHtmlRoutes.length !== 92) throw new Error(`Expected 92 enhanced v0.5 HTML routes, found ${enhancedExistingHtmlRoutes.length}.`);
if (publicHtmlRoutes.length !== 213) throw new Error(`Expected 213 substantive v0.5 surfaces, found ${publicHtmlRoutes.length}.`);
if (publicJsonExports.length !== 6) throw new Error(`Expected six v0.5 JSON exports, found ${publicJsonExports.length}.`);

const phases = [
  {
    phase: 120,
    title: resolvedPhase120.title,
    status: "Complete",
    summary: resolvedPhase120.summary,
    leaf_records: resolvedPhase120.counts.acquisition_packets,
    secondary_records: resolvedPhase120.counts.artifact_targets,
    secondary_record_label: "prepared artifact targets",
    new_html_routes: phase120NewRoutes.length,
    enhanced_existing_routes: phase120EnhancedRoutes.length,
    public_json_exports: 1,
    hub_route: resolvedPhase120.routes.hub,
    data_route: resolvedPhase120.routes.data,
  },
  {
    phase: 121,
    title: phase121.title,
    status: "Complete",
    summary: phase121.summary,
    leaf_records: phase121.counts.missions,
    secondary_records: phase121.counts.missions_with_acquisition_coverage_gaps,
    secondary_record_label: "explicit packet-coverage gaps",
    new_html_routes: phase121NewRoutes.length,
    enhanced_existing_routes: 0,
    public_json_exports: 1,
    hub_route: "/review/fieldbook/missions/",
    data_route: phase121.public_json_exports[0],
  },
  {
    phase: 122,
    title: phase122.title,
    status: "Complete",
    summary: phase122.summary,
    leaf_records: phase122.counts.leaf_records,
    secondary_records: phase122.counts.stage_playbooks + phase122.counts.claim_review_protocols + phase122.counts.quality_audit_cards,
    secondary_record_label: "stage, claim, and quality protocols",
    new_html_routes: phase122NewRoutes.length,
    enhanced_existing_routes: 0,
    public_json_exports: 1,
    hub_route: "/review/fieldbook/method/",
    data_route: phase122.public_routes.find((route) => route.startsWith("/data/")),
  },
  {
    phase: 123,
    title: phase123.title,
    status: "Complete",
    summary: phase123.summary,
    leaf_records: phase123.counts.dossiers,
    secondary_records: phase123.counts.evidence_signal_links + phase123.counts.evidence_source_links,
    secondary_record_label: "bounded evidence links",
    new_html_routes: phase123NewRoutes.length,
    enhanced_existing_routes: phase123EnhancedRoutes.length,
    public_json_exports: 1,
    hub_route: phase123.routes.index,
    data_route: phase123.routes.public_export,
  },
  {
    phase: 124,
    title: phase124.title,
    status: "Complete",
    summary: phase124.summary,
    leaf_records: phase124.counts.workbenches,
    secondary_records: phase124.counts.missions_linked,
    secondary_record_label: "mission joins",
    new_html_routes: phase124NewRoutes.length,
    enhanced_existing_routes: 0,
    public_json_exports: 1,
    hub_route: phase124.routes.index,
    data_route: phase124.routes.public_export,
  },
];

const registry = {
  schema_version: "1.0",
  dataset: "v05_evidence_fieldbook",
  program_id: "FTFN-V0.5-EVIDENCE-FIELDBOOK",
  version: "0.5",
  title: "FTFN v0.5 — The Evidence Fieldbook",
  effective_date: effectiveDate,
  record_status: "Published",
  status: "Complete locally",
  summary: "A public operating fieldbook that connects eighty authority acquisition packets, sixty-eight priority research missions, thirty verification protocols, twelve comparative delivery dossiers, and seventeen topic workbenches without turning preparation, context, or comparison into evidence decisions.",
  core_objectives: [
    "Turn the Phase 117 discovery graph into exact, bounded acquisition work without promoting a portal as an artifact.",
    "Make every Phase 116 priority question an owned research mission with explicit acceptance, rejection, stopping, and evidence-gap rules.",
    "Teach readers and reviewers how conversion stages, claim types, and quality dimensions are verified in practice.",
    "Compare delivery systems through stable identities and visible limits without scores, rankings, causal claims, or silent equivalence.",
    "Compose the complete fieldbook into seventeen topic workbenches while preserving canonical identity and evidence lineage.",
  ],
  publication_boundaries: [
    "Every Phase 120 packet remains Prepared — no exact artifact admitted; all eighty Phase 117 institutional source records remain Candidate.",
    "Phase 121 missions assemble research contracts and context but do not adjudicate answers or infer that missing evidence is externally nonexistent.",
    "Phase 122 playbooks are verification instructions, not new facts or automatic publication rules.",
    "Phase 123 dossiers retain their source-defined scopes and comparison limits; they create no score, ranking, causal finding, or project-stage advance.",
    "Phase 124 workbenches compose existing records and unresolved work; they do not create an observation, receipt, gate decision, outcome, or translation approval.",
    "All eleven Phase 60 gates scheduled after 2026-08-30 remain future, undecided, and without receipts.",
  ],
  phases,
  counts: {
    phases: phases.length,
    substantive_surfaces: publicHtmlRoutes.length,
    new_html_routes: newPublicHtmlRoutes.length,
    enhanced_existing_routes: enhancedExistingHtmlRoutes.length,
    public_json_exports: publicJsonExports.length,
    leaf_records: resolvedPhase120.counts.acquisition_packets + phase121.counts.missions + phase122.counts.leaf_records + phase123.counts.dossiers + phase124.counts.workbenches,
    acquisition_packets: resolvedPhase120.counts.acquisition_packets,
    prepared_artifact_targets: resolvedPhase120.counts.artifact_targets,
    priority_research_missions: phase121.counts.missions,
    mission_packet_coverage_gaps: phase121.counts.missions_with_acquisition_coverage_gaps,
    verification_playbooks: phase122.counts.leaf_records,
    comparative_delivery_dossiers: phase123.counts.dossiers,
    topic_workbenches: phase124.counts.workbenches,
    phase_120_phase_121_backlinks: backlinkCount,
    exact_artifacts_admitted: 0,
    source_records_added: 0,
    signal_records_added: 0,
    future_phase_60_gates_preserved: 11,
  },
  integration_contract: {
    phase_120_phase_121_linkage: "Resolved bidirectionally through exact priority-question, topic, and conversion-stage joins.",
    stable_identity_authority: "Phase 116 canonical IDs and Phase 117 rail/source IDs remain authoritative; v0.5 records are fieldbook artifacts, not competing entity identities.",
    route_accounting: "Substantive surfaces count both new v0.5 routes and existing routes materially deepened by v0.5. Enhanced routes are not counted as new routes.",
  },
  new_html_routes: newPublicHtmlRoutes,
  enhanced_existing_routes: enhancedExistingHtmlRoutes,
  public_html_routes: publicHtmlRoutes,
  public_json_exports: publicJsonExports,
};

await writeJson(join(appRoot, "src", "data", "v05-evidence-fieldbook.json"), registry);

console.log(`v0.5 Evidence Fieldbook built: ${registry.counts.substantive_surfaces} surfaces (${registry.counts.new_html_routes} new + ${registry.counts.enhanced_existing_routes} enhanced), ${registry.counts.public_json_exports} exports, ${backlinkCount} packet-to-mission backlinks.`);
