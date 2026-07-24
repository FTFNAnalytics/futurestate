import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "comparative-operating-outcomes-2023-2026.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

manifest.schema_version = "1.7";
const phase55ZArchiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug comparative-operating-outcomes-2023-2026";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== phase55ZArchiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, phase55ZArchiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 780,
  signals: 152,
  published_signals: 113,
  in_review_signals: 39,
  draft_sample_signals: 0,
  published_support_sources: 166,
  sources: 357,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 12,
  published_briefings: 5,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 9,
  research_documents: 163,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 28,
  public_json_exports: 5,
  research_export_records: 162,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 598,
  signals_added: 134,
  published_signals_added: 98,
  sources_added: 255,
  summary: "Extends the Phase 55K through Phase 55Y evidence baseline with Phase 55Z comparative operating outcomes: 357 public sources, 152 signals, 113 Published signals, five local systems, five Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 28 public updates, nine research collections, 163 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_55z_delta = {
  outcome_portfolios: 4,
  sources_added: 30,
  signals_reviewed: 16,
  signals_added_published: 12,
  signals_added_in_review: 4,
  research_collections_added: 1,
  research_documents_added: 32,
  research_documents_published: 28,
  research_documents_held_in_review: 4,
  downloadable_official_link_records: 32,
  archive_file_count: 35,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  evidence_gaps_added: 1,
  evidence_gaps_deepened: 7,
  reader_pathways_deepened: 8,
  topics_deepened: 11,
  dependency_maps_added_published: 1,
  public_update_entries_added: 1,
  generated_pages_added: 82,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  validate_content: "passed-357-sources-152-signals-163-research-documents",
  source_health: "passed",
  source_health_manual_review: 235,
  source_health_probe_ready: 122,
  source_monitor_current: 357,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 780,
    release_assertions: "passed-phase-55z",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-55z-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/atlas/evidence-gaps/gap-016-comparable-operating-outcome-denominators/index.html",
  "dist/atlas/dependency-maps/comparative-outcomes-require-common-denominators/index.html",
  "dist/research/comparative-operating-outcomes-2023-2026/index.html",
  "dist/downloads/comparative-operating-outcomes-2023-2026.zip",
  "dist/briefings/research-watch-004-comparative-operating-outcomes/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/federal-ai-inventories-nearly-doubled-2024/",
  "/signals/irs-ai-inventory-most-cases-not-yet-operational/",
  "/signals/federal-cdm-data-quality-requires-manual-correction/",
  "/signals/mep-fy2024-client-reported-manufacturing-outcomes/",
  "/signals/niimbl-biomanufacturing-program-delivers-47-graduates/",
  "/signals/arizona-mep-amphenol-reports-932k-savings/",
  "/signals/us-customer-outage-duration-eleven-hours-2024/",
  "/signals/texas-batteries-provide-frequency-response-2024/",
  "/signals/us-mineral-production-and-import-reliance-2025/",
  "/signals/us-airline-cancellation-rate-2024/",
  "/signals/california-av-testing-exceeds-nine-million-miles-2025/",
  "/signals/faa-reaches-one-thousand-commercial-space-operations/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/comparative-operating-outcomes-2023-2026/",
  "/downloads/comparative-operating-outcomes-2023-2026.zip",
  "/briefings/research-watch-004-comparative-operating-outcomes/",
  "/atlas/dependency-maps/comparative-outcomes-require-common-denominators/",
  "/atlas/evidence-gaps/gap-016-comparable-operating-outcome-denominators/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-004-comparative-operating-outcomes/",
]);
manifest.published_dependency_map_routes = addUnique(manifest.published_dependency_map_routes, [
  "/atlas/dependency-maps/comparative-outcomes-require-common-denominators/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 698 generated HTML pages")) return "Confirm 780 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 101 Published signal URLs")) return "Confirm all 113 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all four Published briefing URLs")) return "Confirm all five Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all five Published dependency-map URLs")) return "Confirm all six Published dependency-map URLs are indexed and present in the sitemap while the one In Review map URL remains noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 150 sources supporting Published signals")) return "Confirm all 166 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 27-entry public update log")) return "Confirm the 28-entry public update log renders";
  if (gate.startsWith("Confirm all eight research collections render")) return "Confirm all nine research collections render 163 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 55Z ledger contains sixteen unique signal decisions: twelve Published and four held In Review",
  "Confirm the Phase 55Z collection contains 32 records: 28 Published and four held In Review, all with official-link captures",
  "Confirm the comparison protocol preserves unit, denominator, period, geography, method, and attribution boundaries",
  "Confirm the comparative-operating-outcomes collection, 35-file ZIP, Published synthesis briefing, Published comparison map, and gap page render",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Thirty-five signals, seven briefings, and one dependency map remain In Review",
    "Thirty-nine signals, seven briefings, and one dependency map remain In Review",
    "The Phase 55Z download contains 32 official-link records",
    "Phase 55Z adds operating-outcome records",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Thirty-nine signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 55Z download contains 32 official-link records. It preserves reviewed primary URLs and evidence boundaries without substituting third-party copies.",
  "Phase 55Z adds operating-outcome records without creating a composite score or ranking. Units, denominators, periods, geographies, methods, and attribution remain attached to every result.",
);
manifest.notes = "This manifest records the validated local Phase 55Z comparative operating-outcomes pass. Phase 55Z adds 32 official records and sixteen bounded signals across institutional AI and cybersecurity, manufacturing, infrastructure, and mobility, aviation, and space; twelve signals and 28 document summaries publish while four signals and four documents retain explicit comparability holds. Research Watch 004, the comparison-protocol map, and gap-016 prevent incompatible rankings. The next owner-only Sites release will combine the pending Phase 55Y checkpoint with Phase 55Z. No public access, DNS, public GitHub, custom-domain, or package change is authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 55Z manifest with archive SHA-256 ${archiveSha256}.`);
