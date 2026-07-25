import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "repeat-outcomes-alternative-explanation-tests-2010-2026.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

manifest.schema_version = "2.0";
const archiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug repeat-outcomes-alternative-explanation-tests-2010-2026";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1074,
  signals: 220,
  published_signals: 163,
  in_review_signals: 57,
  draft_sample_signals: 0,
  published_support_sources: 267,
  sources: 462,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 16,
  published_briefings: 9,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 13,
  research_documents: 276,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 32,
  public_json_exports: 5,
  research_export_records: 275,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 892,
  signals_added: 202,
  published_signals_added: 160,
  sources_added: 360,
  summary: "Extends the Phase 55K through Phase 56C evidence baseline with Phase 56D repeat outcomes and alternative-explanation tests: 462 public sources, 220 signals, 163 Published signals, five local systems, nine Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 32 public updates, thirteen research collections, 276 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56d_delta = {
  outcome_portfolios: 4,
  entity_tests: 12,
  stable_entity_ids: 12,
  source_profiles_added: 20,
  signals_reviewed: 16,
  signals_added_published: 10,
  signals_added_in_review: 6,
  research_collections_added: 1,
  research_documents_added: 24,
  research_documents_published: 24,
  downloadable_official_link_records: 24,
  archive_file_count: 27,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  parent_dossiers_deepened: 12,
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
  validate_content: "passed-462-sources-220-signals-276-research-documents",
  source_health: "passed",
  source_health_manual_review: 313,
  source_health_probe_ready: 149,
  source_monitor_current: 462,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1074,
  release_assertions: "passed-phase-56d",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56d-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/repeat-outcomes-alternative-explanation-tests-2010-2026/index.html",
  "dist/downloads/repeat-outcomes-alternative-explanation-tests-2010-2026.zip",
  "dist/briefings/research-watch-008-repeat-outcomes-alternative-tests/index.html",
  "dist/signals/56d-nasa-repeat-control-test/index.html",
  "dist/signals/56d-monaghan-medical-repeat-test/index.html",
  "dist/signals/56d-gateway-repeat-test/index.html",
  "dist/signals/56d-united-repeat-service-test/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56d-nasa-repeat-control-test/",
  "/signals/56d-dhs-repeat-control-test/",
  "/signals/56d-hhs-repeat-control-test/",
  "/signals/56d-monaghan-medical-repeat-test/",
  "/signals/56d-moss-landing-repeat-test/",
  "/signals/56d-manatee-repeat-test/",
  "/signals/56d-gateway-repeat-test/",
  "/signals/56d-united-repeat-service-test/",
  "/signals/56d-southwest-repeat-service-test/",
  "/signals/56d-delta-repeat-service-test/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/repeat-outcomes-alternative-explanation-tests-2010-2026/",
  "/downloads/repeat-outcomes-alternative-explanation-tests-2010-2026.zip",
  "/briefings/research-watch-008-repeat-outcomes-alternative-tests/",
  "/signals/56d-gateway-repeat-test/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-008-repeat-outcomes-alternative-tests/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,012 generated HTML pages")) return "Confirm 1,074 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 153 Published signal URLs")) return "Confirm all 163 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all eight Published briefing URLs")) return "Confirm all nine Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 251 sources supporting Published signals")) return "Confirm all 267 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 31-entry public update log")) return "Confirm the 32-entry public update log renders";
  if (gate.startsWith("Confirm all twelve research collections render")) return "Confirm all thirteen research collections render 276 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 56D ledger contains twelve entity tests with stable Phase 56B panel and Phase 56C dossier IDs",
  "Confirm the Phase 56D publication review contains sixteen unique decisions: ten Published and six held In Review",
  "Confirm the Phase 56D collection contains 24 Published official-link records and a 27-file archive",
  "Confirm every record maps to named alternative explanations or a later observation and declares compatibility",
  "Confirm regulator-verified closure remains distinct from operator or company claims, partial progress, and open investigations",
  "Confirm no causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is created",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Fifty-one signals, seven briefings, and one dependency map remain In Review",
    "Fifty-seven signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56D download contains 24 official-link records",
    "Phase 56D adds twelve repeat-outcome and alternative-explanation tests",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Fifty-seven signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56D download contains 24 official-link records supporting twelve repeat-outcome and alternative-explanation tests.",
  "Phase 56D preserves compatibility, attribution, validation status, missing denominators, and series breaks; two manufacturer entity tests and four portfolio interpretations remain held.",
);
manifest.notes = "This manifest records the locally generated Phase 56D repeat-outcome and alternative-explanation pass. Phase 56D adds 20 source profiles, 24 summaries, and sixteen bounded signal decisions across the same named agencies, manufacturers, battery assets, and operating carriers; ten entity tests publish while two manufacturer tests and four portfolio interpretations remain held. Research Watch 008 and the deepened comparison protocol preserve stable entity identity, compatibility, attribution, validation status, missing denominators, alternative explanations, and the no-causation boundary. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56D manifest with archive SHA-256 ${archiveSha256}.`);
