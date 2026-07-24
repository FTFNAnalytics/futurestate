import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "operational-evidence-receiving-systems-2024-2026.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();

const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

manifest.schema_version = "1.6";
const phase55YArchiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug operational-evidence-receiving-systems-2024-2026";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== phase55YArchiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, phase55YArchiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 698,
  signals: 136,
  published_signals: 101,
  in_review_signals: 35,
  draft_sample_signals: 0,
  published_support_sources: 150,
  sources: 327,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 11,
  published_briefings: 4,
  in_review_briefings: 7,
  evidence_gaps: 15,
  dependency_maps: 6,
  published_dependency_maps: 5,
  in_review_dependency_maps: 1,
  research_collections: 8,
  research_documents: 131,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 27,
  public_json_exports: 5,
  research_export_records: 133,
  pathway_export_records: 11
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 516,
  signals_added: 118,
  published_signals_added: 86,
  sources_added: 225,
  summary: "Extends the Phase 55K through Phase 55X evidence baseline with Phase 55Y operational evidence: 327 public sources, 136 signals, 101 Published signals, five local systems, four Published and seven In Review briefings, five Published and one In Review dependency maps, fifteen reader pathways, fifteen evidence gaps, 27 public updates, eight research collections, 131 summarized research documents, and five versioned public-data exports."
};
manifest.phase_55y_delta = {
  journeys_deepened: 4,
  sources_added: 20,
  signals_reviewed: 12,
  signals_added_published: 8,
  signals_added_in_review: 4,
  research_collections_added: 1,
  research_documents_added: 24,
  research_documents_published: 20,
  research_documents_held_in_review: 4,
  downloadable_official_link_records: 24,
  archive_file_count: 27,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  evidence_gaps_added: 2,
  evidence_gaps_deepened: 2,
  reader_pathways_deepened: 4,
  reader_pathways_promoted: 1,
  topics_deepened: 4,
  dependency_maps_deepened_and_published: 1,
  public_update_entries_added: 1,
  generated_pages_added: 60
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  validate_content: "passed-327-sources-136-signals-131-research-documents",
  source_health: "passed",
  source_health_manual_review: 212,
  source_health_probe_ready: 115,
  source_monitor_current: 327,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 698,
  release_assertions: "passed-phase-55y",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-55y-visual-qa-not-requested"
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/atlas/evidence-gaps/gap-014-ai-assurance-operating-evidence/index.html",
  "dist/atlas/evidence-gaps/gap-015-autonomous-passenger-service-outcomes/index.html",
  "dist/research/operational-evidence-receiving-systems-2024-2026/index.html",
  "dist/downloads/operational-evidence-receiving-systems-2024-2026.zip",
  "dist/briefings/research-watch-003-operational-evidence/index.html"
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/nist-aria-pilot-multilevel-evaluation/",
  "/signals/nist-ai-metrology-method-selection-layer/",
  "/signals/asml-phoenix-technical-academy-operational/",
  "/signals/drive48-graduates-operating-workforce-comparator/",
  "/signals/chandler-reclaimed-water-operating-scale/",
  "/signals/intel-arizona-water-conservation-2023/",
  "/signals/cpuc-waymo-fared-driverless-expansion-2024/",
  "/signals/california-av-testing-miles-2024/"
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/operational-evidence-receiving-systems-2024-2026/",
  "/downloads/operational-evidence-receiving-systems-2024-2026.zip",
  "/briefings/research-watch-003-operational-evidence/"
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-003-operational-evidence/"
]);
manifest.published_dependency_map_routes = addUnique(manifest.published_dependency_map_routes, [
  "/atlas/dependency-maps/autonomy-rules-are-not-service/"
]);
manifest.in_review_dependency_map_routes = manifest.in_review_dependency_map_routes.filter(
  (route) => route !== "/atlas/dependency-maps/autonomy-rules-are-not-service/"
);
manifest.phase_55q_gap_routes = manifest.phase_55q_gap_routes.filter(
  (route) => ![
    "/atlas/evidence-gaps/gap-002-arizona-industrial-water-capacity/",
    "/atlas/evidence-gaps/gap-003-chip-corridor-workforce-suppliers/"
  ].includes(route)
);
manifest.release_gates = manifest.release_gates.filter(
  (gate) => !gate.startsWith("Confirm all six Phase 55Q gap pages")
);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 591 generated HTML pages")) return "Confirm 698 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 85 Published signal URLs")) return "Confirm all 101 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all three Published briefing URLs")) return "Confirm all four Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all four Published dependency-map URLs")) return "Confirm all five Published dependency-map URLs are indexed and present in the sitemap while the one In Review map URL remains noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 134 sources supporting Published signals")) return "Confirm all 150 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the twenty-five-entry public update log")) return "Confirm the 27-entry public update log renders";
  if (gate.startsWith("Confirm all six research collections render")) return "Confirm all eight research collections render 131 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 55Y ledger contains twelve unique signal decisions: eight Published and four held In Review",
  "Confirm the Phase 55Y collection contains 24 records: twenty Published and four held In Review, all with official-link captures",
  "Confirm the AI assurance and autonomous passenger-service evidence-gap pages render",
  "Confirm the operational-evidence collection, 27-file ZIP, Published synthesis briefing, Published autonomy pathway, and Published autonomy dependency map render"
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Twenty-seven signals, six briefings, and two dependency maps remain In Review",
    "Thirty-five signals, seven briefings, and one dependency map remain In Review",
    "The Phase 55Y download contains 24 official-link records",
    "Phase 55Y adds operating comparators"
  ].some((prefix) => item.startsWith(prefix))
);
manifest.known_limitations.unshift(
  "Thirty-five signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 55Y download contains 24 official-link records. It preserves reviewed primary URLs and evidence boundaries without substituting third-party copies.",
  "Phase 55Y adds operating comparators and effective road passenger-service authority without claiming AI certification, semiconductor workforce sufficiency, Phoenix TSMC reuse operation, comparative AV safety, or service scale."
);
manifest.notes = "This manifest records the validated local Phase 55Y operational-evidence pass. Phase 55Y adds 24 official records and twelve bounded signals across AI assurance, advanced-manufacturing workforce, industrial water, and autonomous passenger service; eight signals and twenty document summaries publish while four signals and four documents retain explicit pre-operational holds. The autonomy pathway and dependency map publish because the evidence now includes effective fared passenger-service authority in named California geographies. The hosted Sites URL remains owner-only; no public access, DNS, public GitHub, custom-domain, or package change is authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 55Y manifest with archive SHA-256 ${archiveSha256}.`);
