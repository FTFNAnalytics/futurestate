import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "entity-driver-constraint-dossiers-2021-2026.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

manifest.schema_version = "2.0";
const archiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug entity-driver-constraint-dossiers-2021-2026";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1012,
  signals: 204,
  published_signals: 153,
  in_review_signals: 51,
  draft_sample_signals: 0,
  published_support_sources: 251,
  sources: 442,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 15,
  published_briefings: 8,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 12,
  research_documents: 252,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 31,
  public_json_exports: 5,
  research_export_records: 250,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 830,
  signals_added: 186,
  published_signals_added: 150,
  sources_added: 340,
  summary: "Extends the Phase 55K through Phase 56B evidence baseline with Phase 56C entity driver and constraint dossiers: 442 public sources, 204 signals, 153 Published signals, five local systems, eight Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 31 public updates, twelve research collections, 252 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56c_delta = {
  outcome_portfolios: 4,
  entity_dossiers: 12,
  stable_entity_ids: 12,
  source_profiles_added: 20,
  signals_reviewed: 16,
  signals_added_published: 12,
  signals_added_in_review: 4,
  research_collections_added: 1,
  research_documents_added: 24,
  research_documents_published: 24,
  downloadable_official_link_records: 24,
  archive_file_count: 27,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  parent_panels_deepened: 12,
  reader_pathways_deepened: 6,
  topics_deepened: 8,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 62,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-442-sources-204-signals-252-research-documents",
  source_health: "passed",
  source_health_manual_review: 299,
  source_health_probe_ready: 143,
  source_monitor_current: 442,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1012,
  release_assertions: "passed-phase-56c",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56c-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/entity-driver-constraint-dossiers-2021-2026/index.html",
  "dist/downloads/entity-driver-constraint-dossiers-2021-2026.zip",
  "dist/briefings/research-watch-007-entity-driver-constraint-dossiers/index.html",
  "dist/signals/56c-nasa-cyber-controls/index.html",
  "dist/signals/56c-current-applications-drivers/index.html",
  "dist/signals/56c-gateway-constraints/index.html",
  "dist/signals/56c-united-service-constraints/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56c-nasa-cyber-controls/",
  "/signals/56c-dhs-cyber-controls/",
  "/signals/56c-hhs-cyber-controls/",
  "/signals/56c-current-applications-drivers/",
  "/signals/56c-island-components-drivers/",
  "/signals/56c-monaghan-medical-drivers/",
  "/signals/56c-moss-landing-constraints/",
  "/signals/56c-manatee-constraints/",
  "/signals/56c-gateway-constraints/",
  "/signals/56c-united-service-constraints/",
  "/signals/56c-southwest-service-constraints/",
  "/signals/56c-delta-service-constraints/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/entity-driver-constraint-dossiers-2021-2026/",
  "/downloads/entity-driver-constraint-dossiers-2021-2026.zip",
  "/briefings/research-watch-007-entity-driver-constraint-dossiers/",
  "/signals/56c-gateway-constraints/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-007-entity-driver-constraint-dossiers/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 950 generated HTML pages")) return "Confirm 1,012 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 141 Published signal URLs")) return "Confirm all 153 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all seven Published briefing URLs")) return "Confirm all eight Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 231 sources supporting Published signals")) return "Confirm all 251 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 30-entry public update log")) return "Confirm the 31-entry public update log renders";
  if (gate.startsWith("Confirm all eleven research collections render")) return "Confirm all twelve research collections render 252 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 56C ledger contains twelve Published entity dossiers with stable parent panel and entity IDs",
  "Confirm the Phase 56C publication review contains sixteen unique decisions: twelve Published and four held In Review",
  "Confirm the Phase 56C collection contains 24 Published official-link records and a 27-file archive",
  "Confirm every dossier orders baseline, named intervention or input, constraint, and observed outcome or later boundary",
  "Confirm attribution, independent validation, alternative explanations, and next compatible records remain attached",
  "Confirm no temporal sequence becomes a causal claim, ranking, composite score, or readiness score",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Forty-seven signals, seven briefings, and one dependency map remain In Review",
    "Fifty-one signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56C download contains 24 official-link records",
    "Phase 56C adds twelve entity driver and constraint dossiers",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Fifty-one signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56C download contains 24 official-link records supporting twelve Published entity driver and constraint dossiers.",
  "Phase 56C preserves temporal order, attribution, independent-validation limits, and alternative explanations without claiming that controls, inputs, corrective actions, or commitments caused observed outcomes.",
);
manifest.notes = "This manifest records the validated Phase 56C entity driver and constraint dossier pass for owner-only deployment. Phase 56C adds 20 source profiles, 24 summaries, and sixteen bounded signal decisions across named agencies, manufacturers, battery assets, and operating carriers; twelve dossiers publish while four causal interpretations remain held. Research Watch 007 and the deepened comparison protocol preserve stable entity identity, temporal order, attribution, independent-validation limits, alternative explanations, and the no-causation boundary. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56C manifest with archive SHA-256 ${archiveSha256}.`);
