import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "persistent-service-quality-compatible-time-series-replication-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57d-persistent-service-quality-compatible-time-series-replication.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57d");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57d");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2102,
  signals: 563,
  published_signals: 465,
  in_review_signals: 98,
  draft_sample_signals: 0,
  published_support_sources: 472,
  sources: 692,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 42,
  published_briefings: 35,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 39,
  research_documents: 679,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 58,
  public_json_exports: 5,
  research_export_records: 639,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1920,
  signals_added: 545,
  published_signals_added: 462,
  sources_added: 590,
  summary: "Extends the Phase 55K through Phase 57C evidence baseline with Phase 57D persistent service-quality and compatible time-series replication: 692 public sources, 563 signals, 465 Published signals, five local systems, thirty-five Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 58 public updates, thirty-nine research collections, 679 summarized research documents, and five versioned public-data exports.",
};

manifest.phase_57d_delta = {
  persistent_service_quality_and_compatible_time_series_records_reviewed: 20,
  records_added_published: 12,
  records_held_in_review: 8,
  compatible_service_time_series: 6,
  monthly_material_flow_series: 6,
  service_quality_holds: 2,
  adoption_and_activation_holds: 3,
  recurring_output_and_baseline_holds: 3,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  phase_57c_holds_preserved: 8,
  new_visible_holds: 0,
  official_source_profiles_added: 7,
  official_source_profiles_reused: 8,
  research_documents_added_published: 12,
  research_documents_added_in_review: 8,
  signals_added_published: 12,
  signals_added_in_review: 8,
  downloadable_records: 20,
  archive_file_count: 23,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 1,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 49,
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-692-sources-563-signals-679-research-documents",
  source_health: "passed",
  source_health_manual_review: 475,
  source_health_probe_ready: 217,
  source_monitor_current: 692,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2102,
  release_assertions: "passed-phase-57d",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57d-visual-qa-not-requested",
  preview_qa: "passed-owner-only-version-55-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-034-persistent-service-quality-compatible-time-series-replication/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-034-persistent-service-quality-compatible-time-series-replication/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-034-persistent-service-quality-compatible-time-series-replication/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,102 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 465 Published signal URLs are present in the sitemap";
  if (/^Confirm all (thirty-four|35|thirty-five) Published briefing URLs/.test(gate)) return "Confirm all thirty-five Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 472 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 58-entry public update log renders";
  if (/^Confirm all (thirty-eight|39|thirty-nine) research collections/.test(gate)) return "Confirm all thirty-nine research collections render 679 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57D contains twenty unique records: six compatible service series, six monthly material-flow series, two service-quality holds, three adoption or activation holds, and three recurring-output or baseline holds",
  "Confirm Phase 57D publishes twelve bounded records, retains eight explicit In Review holds, and preserves all eight Phase 57C holds",
  "Confirm entity, cohort, stage, period, unit, threshold operator, denominator, method, revision history, and authority attribution remain explicit",
  "Confirm inventory, reliability, adoption, feed, glass, containers, quality, shipment, acceptance, disposal, capacity, baseline, outcome, closeout, implementation, and closure remain distinct",
  "Confirm the Phase 57D collection contains twenty official-link records backed by seven new and eight carried Tier 1 sources and a twenty-three-file archive",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57D manifest at ${manifestPath}`);
