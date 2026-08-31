import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));

const [phase125, phase126, phase127, phase128, phase129, missions, phase117, phase120, phase123, phase124, operatingCycle] = await Promise.all([
  readJson("phase-125-evidence-annotation-ledger.json"),
  readJson("phase-126-mission-evidence-audits.json"),
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-128-topic-state-of-evidence-reviews.json"),
  readJson("phase-129-cross-system-evidence-syntheses.json"),
  readJson("phase-121-priority-research-missions.json"),
  readJson("phase-117-global-authority-graph.json"),
  readJson("phase-120-evidence-acquisition-packets.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-124-topic-research-workbenches.json"),
  readJson("phase-60-operating-cycle.json"),
]);

const effectiveDate = "2026-08-30";
const expected = [
  [phase125, 125, "FTFN-PHASE-125-EVIDENCE-ANNOTATION-LEDGER", "/review/fieldbook/evidence-notes/", "/data/phase-125-evidence-annotation-ledger.json"],
  [phase126, 126, "FTFN-PHASE-126-MISSION-EVIDENCE-AUDITS", "/review/fieldbook/mission-audits/", "/data/phase-126-mission-evidence-audits.json"],
  [phase127, 127, "FTFN-PHASE-127-PROJECT-PLACE-CONVERSION-BIOGRAPHIES", "/review/fieldbook/delivery-biographies/", "/data/phase-127-project-place-conversion-biographies.json"],
  [phase128, 128, "FTFN-PHASE-128-TOPIC-STATE-OF-EVIDENCE-REVIEWS", "/review/fieldbook/topic-reviews/", "/data/phase-128-topic-state-of-evidence-reviews.json"],
  [phase129, 129, "FTFN-PHASE-129-CROSS-SYSTEM-EVIDENCE-SYNTHESES", "/review/fieldbook/system-reviews/", "/data/phase-129-cross-system-evidence-syntheses.json"],
];

for (const [record, phase, programId, hub, exportRoute] of expected) {
  if (record.program_id !== programId || record.phase !== phase || record.status !== "Complete") throw new Error(`Phase ${phase} is not complete or has the wrong identity.`);
  if (record.effective_date !== effectiveDate) throw new Error(`Phase ${phase} does not use the fixed v0.6 effective date.`);
  if (record.new_html_routes?.length !== 1 || record.new_html_routes[0] !== hub) throw new Error(`Phase ${phase} must own only its canonical hub route.`);
  if (record.public_json_exports?.length !== 1 || record.public_json_exports[0] !== exportRoute) throw new Error(`Phase ${phase} must own only its canonical JSON export.`);
}

const phaseNewRoutes = expected.flatMap(([record]) => record.new_html_routes);
const enhancedExistingRoutes = expected.flatMap(([record]) => record.enhanced_existing_routes);
const newHtmlRoutes = [...phaseNewRoutes, "/review/v06/"];
const publicJsonExports = [...expected.map(([, , , , exportRoute]) => exportRoute), "/data/v06-open-evidence-review.json"];
const unique = (items) => [...new Set(items)];

if (unique(newHtmlRoutes).length !== 6) throw new Error("v0.6 requires six unique new HTML routes.");
if (enhancedExistingRoutes.length !== 218 || unique(enhancedExistingRoutes).length !== 218) throw new Error("v0.6 requires 218 unique enhanced existing routes.");
if (newHtmlRoutes.some((route) => enhancedExistingRoutes.includes(route))) throw new Error("v0.6 new and enhanced route inventories overlap.");

const gapMissions = missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0);
const futureGates = operatingCycle.records.filter((record) => record.scheduled_check_date > effectiveDate);
if (gapMissions.length !== 12) throw new Error("v0.6 must preserve twelve mission acquisition gaps.");
if (futureGates.length !== 11 || futureGates.some((record) => record.decision_status !== "scheduled" || record.decision_date !== null || record.receipt_id !== null)) throw new Error("v0.6 cannot operate a post-August-30 Phase 60 gate.");
if (phase117.rails.length !== 80 || phase120.acquisition_packets.length !== 80 || phase120.counts.exact_artifacts_admitted !== 0) throw new Error("v0.6 must preserve the Candidate acquisition baseline.");
if (phase123.dossiers.length !== 12 || phase123.dossiers.some((record) => record.comparison_passport.verdict !== "Context only")) throw new Error("v0.6 must preserve Phase 123 context-only verdicts.");
if (phase124.counts.missions_with_acquisition_packets !== 56 || phase124.counts.missions_with_acquisition_coverage_gaps !== 12) throw new Error("v0.6 must preserve the Phase 124 acquisition split.");

const phases = expected.map(([record, phase, programId, hub, exportRoute]) => ({
  phase,
  program_id: programId,
  title: record.title,
  summary: record.summary,
  hub_route: hub,
  public_export: exportRoute,
  new_html_routes: record.new_html_routes.length,
  enhanced_existing_routes: record.enhanced_existing_routes.length,
}));

const registry = {
  schema_version: "1.0",
  dataset: "v06_open_evidence_review",
  program_id: "FTFN-V0.6-OPEN-EVIDENCE-REVIEW",
  version: "0.6",
  title: "FTFN v0.6 — Open Evidence Review",
  effective_date: effectiveDate,
  status: "Complete locally",
  summary: "A record-by-record open review of the Evidence Fieldbook: source-linked annotations, mission audits, project and place biographies, topic state-of-evidence reviews, and cross-system compatibility syntheses over the existing Published corpus.",
  counts: {
    phases: 5,
    substantive_surfaces: 224,
    new_html_routes: 6,
    enhanced_existing_routes: 218,
    public_json_exports: 6,
    evidence_annotations: 82,
    mission_signal_joins: 340,
    source_records_resolved: 114,
    mission_audits: 68,
    mission_requirement_tests: 204,
    project_biographies: 24,
    place_biographies: 15,
    project_stage_cells: 192,
    place_system_assessments: 90,
    topic_reviews: 17,
    topic_horizon_reviews: 68,
    cross_system_syntheses: 12,
    compatibility_determinations: 60,
    acquisition_gaps_preserved: 12,
    future_phase_60_gates_preserved: 11,
    exact_artifacts_admitted: 0,
    source_records_added: 0,
    signal_records_added: 0,
  },
  phases,
  evidence_posture: {
    inherited_mission_state: "Research packet assembled — answer not adjudicated",
    acquisition_coverage: "56 missions covered / 12 missions with explicit gaps",
    dossier_verdict: "Context only",
    interpretation_state: "Open review complete — no evidence decision created",
    next_dated_gate: "60-CYCLE-LOUISIANA-STARLINK-ADOPTION on 2026-09-01 America/Edmonton",
  },
  gap_mission_ids: gapMissions.map((mission) => mission.mission_id),
  publication_boundaries: [
    "The edition annotates and synthesizes only existing records; it does not admit an exact artifact or create a source or signal.",
    "Mission audits test the current corpus but leave every Phase 121 answer state unadjudicated.",
    "Project and place biographies expose evidence chains without changing a Phase 119 tier or conversion stage.",
    "Topic work sequencing is ordered by research value only and is not a topic, project, place or performance ranking.",
    "Cross-system syntheses retain Context only and create no common metric, score, winner or causal conclusion.",
    "All eleven Phase 60 gates after 2026-08-30 remain future, scheduled, undecided and without receipts.",
  ],
  new_html_routes: newHtmlRoutes,
  enhanced_existing_routes: enhancedExistingRoutes,
  public_html_routes: [...newHtmlRoutes, ...enhancedExistingRoutes],
  public_json_exports: publicJsonExports,
};

await writeFile(join(dataRoot, "v06-open-evidence-review.json"), `${JSON.stringify(registry, null, 2)}\n`, "utf8");
console.log(`FTFN v0.6 aggregate built: ${registry.counts.substantive_surfaces} surfaces (${registry.counts.new_html_routes} new + ${registry.counts.enhanced_existing_routes} enhanced), ${registry.counts.public_json_exports} exports, and ${registry.counts.future_phase_60_gates_preserved} future gates preserved.`);
