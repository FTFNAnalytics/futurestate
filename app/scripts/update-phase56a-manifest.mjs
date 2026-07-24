import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "longitudinal-operating-series-2020-2025.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

manifest.schema_version = "1.8";
const phase56AArchiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug longitudinal-operating-series-2020-2025";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== phase56AArchiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, phase56AArchiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 898,
  signals: 172,
  published_signals: 129,
  in_review_signals: 43,
  draft_sample_signals: 0,
  published_support_sources: 214,
  sources: 405,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 13,
  published_briefings: 6,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 10,
  research_documents: 211,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 29,
  public_json_exports: 5,
  research_export_records: 207,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 716,
  signals_added: 154,
  published_signals_added: 114,
  sources_added: 303,
  summary: "Extends the Phase 55K through Phase 55Z evidence baseline with Phase 56A longitudinal operating series: 405 public sources, 172 signals, 129 Published signals, five local systems, six Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 29 public updates, ten research collections, 211 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56a_delta = {
  outcome_portfolios: 4,
  longitudinal_series: 16,
  sources_added: 48,
  signals_reviewed: 20,
  signals_added_published: 16,
  signals_added_in_review: 4,
  research_collections_added: 1,
  research_documents_added: 48,
  research_documents_published: 44,
  research_documents_held_in_review: 4,
  downloadable_official_link_records: 48,
  archive_file_count: 51,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  evidence_gaps_deepened: 9,
  reader_pathways_deepened: 9,
  topics_deepened: 11,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 118,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-405-sources-172-signals-211-research-documents",
  source_health: "passed",
  source_health_manual_review: 265,
  source_health_probe_ready: 140,
  source_monitor_current: 405,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 898,
  release_assertions: "passed-phase-56a",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56a-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/longitudinal-operating-series-2020-2025/index.html",
  "dist/downloads/longitudinal-operating-series-2020-2025.zip",
  "dist/briefings/research-watch-005-longitudinal-operating-series/index.html",
  "dist/signals/56a-fisma-reporting/index.html",
  "dist/signals/56a-mep-national-impact/index.html",
  "dist/signals/56a-eia-battery-capacity/index.html",
  "dist/signals/56a-faa-commercial-space/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56a-fisma-reporting/",
  "/signals/56a-gao-cyber-backlog/",
  "/signals/56a-fisma-effectiveness/",
  "/signals/56a-nasa-ai-inventory/",
  "/signals/56a-mep-national-impact/",
  "/signals/56a-manufacturing-usa/",
  "/signals/56a-niimbl-annual/",
  "/signals/56a-census-asm/",
  "/signals/56a-eia-battery-capacity/",
  "/signals/56a-eia-outage-duration/",
  "/signals/56a-epa-water-reuse/",
  "/signals/56a-usgs-mineral-production/",
  "/signals/56a-air-travel-consumer/",
  "/signals/56a-california-av-miles/",
  "/signals/56a-faa-commercial-space/",
  "/signals/56a-president-aerospace-report/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/longitudinal-operating-series-2020-2025/",
  "/downloads/longitudinal-operating-series-2020-2025.zip",
  "/briefings/research-watch-005-longitudinal-operating-series/",
  "/signals/56a-eia-battery-capacity/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-005-longitudinal-operating-series/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 780 generated HTML pages")) return "Confirm 898 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 113 Published signal URLs")) return "Confirm all 129 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all five Published briefing URLs")) return "Confirm all six Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 166 sources supporting Published signals")) return "Confirm all 214 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 28-entry public update log")) return "Confirm the 29-entry public update log renders";
  if (gate.startsWith("Confirm all nine research collections render")) return "Confirm all ten research collections render 211 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 56A ledger contains twenty unique signal decisions: sixteen Published and four held In Review",
  "Confirm the Phase 56A collection contains 48 records: 44 Published and four held In Review, all with official-link captures",
  "Confirm all sixteen longitudinal series contain three named observations and every Published series has at least two compatible time points",
  "Confirm revision, denominator, combined-period, method, attribution, and series-break limits remain visible",
  "Confirm the longitudinal-operating-series collection, 51-file ZIP, and Published Research Watch 005 briefing render",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Thirty-nine signals, seven briefings, and one dependency map remain In Review",
    "Forty-three signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56A download contains 48 official-link records",
    "Phase 56A adds sixteen within-domain longitudinal series",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Forty-three signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56A download contains 48 official-link records. Four document observations retain explicit route, method, or combined-period review flags.",
  "Phase 56A adds sixteen within-domain longitudinal series without creating a composite score or ranking. Two-point movement is not presented as a durable trend without a caveat, and material series breaks stop the line.",
);
manifest.notes = "This manifest records the validated Phase 55Z deployment and the locally completed Phase 56A longitudinal operating-series pass. Phase 56A adds 48 official annual observations and twenty bounded signal decisions across institutional AI and cybersecurity, manufacturing, infrastructure, and mobility, aviation, and space; sixteen series and 44 document summaries publish while four cross-series composites and four document observations retain explicit holds. Research Watch 005 and the deepened comparison protocol preserve unit, denominator, period, geography, method, attribution, revision, and series-break boundaries. The current release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56A manifest with archive SHA-256 ${archiveSha256}.`);
