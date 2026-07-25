import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "entity-operating-panels-2021-2026.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

manifest.schema_version = "1.9";
const phase56BArchiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug entity-operating-panels-2021-2026";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== phase56BArchiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, phase56BArchiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 950,
  signals: 188,
  published_signals: 141,
  in_review_signals: 47,
  draft_sample_signals: 0,
  published_support_sources: 231,
  sources: 422,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 14,
  published_briefings: 7,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 11,
  research_documents: 228,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 30,
  public_json_exports: 5,
  research_export_records: 225,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 768,
  signals_added: 170,
  published_signals_added: 138,
  sources_added: 320,
  summary: "Extends the Phase 55K through Phase 56A evidence baseline with Phase 56B entity operating panels: 422 public sources, 188 signals, 141 Published signals, five local systems, seven Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 30 public updates, eleven research collections, 228 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56b_delta = {
  outcome_portfolios: 4,
  named_entity_panels: 12,
  stable_entity_ids: 12,
  sources_added: 17,
  signals_reviewed: 16,
  signals_added_published: 12,
  signals_added_in_review: 4,
  research_collections_added: 1,
  research_documents_added: 17,
  research_documents_published: 17,
  research_documents_held_in_review: 0,
  downloadable_official_link_records: 17,
  archive_file_count: 20,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 6,
  topics_deepened: 8,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 52,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-422-sources-188-signals-228-research-documents",
  source_health: "passed",
  source_health_manual_review: 279,
  source_health_probe_ready: 143,
  source_monitor_current: 422,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 950,
  release_assertions: "passed-phase-56b",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56b-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/entity-operating-panels-2021-2026/index.html",
  "dist/downloads/entity-operating-panels-2021-2026.zip",
  "dist/briefings/research-watch-006-entity-operating-panels/index.html",
  "dist/signals/56b-nasa-fisma-panel/index.html",
  "dist/signals/56b-current-applications-output-panel/index.html",
  "dist/signals/56b-moss-landing-capacity-panel/index.html",
  "dist/signals/56b-united-cancellation-panel/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56b-nasa-fisma-panel/",
  "/signals/56b-dhs-fisma-panel/",
  "/signals/56b-hhs-fisma-panel/",
  "/signals/56b-current-applications-output-panel/",
  "/signals/56b-island-components-output-panel/",
  "/signals/56b-monaghan-medical-output-panel/",
  "/signals/56b-moss-landing-capacity-panel/",
  "/signals/56b-manatee-capacity-panel/",
  "/signals/56b-gateway-capacity-panel/",
  "/signals/56b-united-cancellation-panel/",
  "/signals/56b-southwest-cancellation-panel/",
  "/signals/56b-delta-cancellation-panel/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/entity-operating-panels-2021-2026/",
  "/downloads/entity-operating-panels-2021-2026.zip",
  "/briefings/research-watch-006-entity-operating-panels/",
  "/signals/56b-moss-landing-capacity-panel/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-006-entity-operating-panels/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 898 generated HTML pages")) return "Confirm 950 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 129 Published signal URLs")) return "Confirm all 141 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all six Published briefing URLs")) return "Confirm all seven Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 214 sources supporting Published signals")) return "Confirm all 231 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 29-entry public update log")) return "Confirm the 30-entry public update log renders";
  if (gate.startsWith("Confirm all ten research collections render")) return "Confirm all eleven research collections render 228 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 56B ledger contains sixteen unique signal decisions: twelve Published and four held In Review",
  "Confirm the Phase 56B collection contains seventeen Published official-link records and a 20-file archive",
  "Confirm all twelve Published panels have a unique stable entity ID and at least two compatible observations",
  "Confirm unit, denominator, period, geography, method, attribution, missing data, identity handling, revisions, and reporting breaks remain attached",
  "Confirm national context remains separate from entity performance and all four cross-entity rankings remain held",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Forty-three signals, seven briefings, and one dependency map remain In Review",
    "Forty-seven signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56B download contains 17 official-link records",
    "Phase 56B adds twelve named entity operating panels",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Forty-seven signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56B download contains 17 official-link records supporting twelve Published named entity panels.",
  "Phase 56B adds twelve named entity operating panels without creating a cross-agency, cross-manufacturer, cross-asset, or cross-carrier ranking. National context and entity performance remain separate.",
);
manifest.notes = "This manifest records the validated and owner-only deployed Phase 56B entity operating-panel pass. Phase 56B adds 17 official records and sixteen bounded signal decisions across named federal agencies, manufacturers, battery assets, and reporting operating carriers; twelve panels publish while four cross-entity rankings remain held. Research Watch 006 and the deepened comparison protocol preserve stable entity identity, unit, denominator, period, geography, method, attribution, missing evidence, revisions, and reporting breaks. The current release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56B manifest with archive SHA-256 ${archiveSha256}.`);
