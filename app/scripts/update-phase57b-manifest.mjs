import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "accepted-service-independent-outcome-validation-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57b-accepted-service-independent-outcome-validation.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57b");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57b");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2009,
  signals: 523,
  published_signals: 441,
  in_review_signals: 82,
  draft_sample_signals: 0,
  published_support_sources: 463,
  sources: 683,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 40,
  published_briefings: 33,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 37,
  research_documents: 639,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 56,
  public_json_exports: 5,
  research_export_records: 613,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1827,
  signals_added: 505,
  published_signals_added: 438,
  sources_added: 581,
  summary: "Extends the Phase 55K through Phase 57A evidence baseline with Phase 57B accepted-service and independent-outcome validation: 683 public sources, 523 signals, 441 Published signals, five local systems, thirty-three Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 56 public updates, thirty-seven research collections, 639 summarized research documents, and five versioned public-data exports.",
};

manifest.phase_57b_delta = {
  accepted_service_and_independent_outcome_records_reviewed: 17,
  records_added_published: 10,
  records_held_in_review: 7,
  accepted_service_cohorts: 5,
  observed_operating_outputs: 5,
  closeout_or_performance_holds: 4,
  rate_capacity_and_baseline_holds: 3,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  prior_holds_partially_reopened: 1,
  prior_holds_preserved: 2,
  official_source_profiles_added: 11,
  official_source_profiles_reused: 5,
  research_documents_added_published: 10,
  research_documents_added_in_review: 7,
  signals_added_published: 10,
  signals_added_in_review: 7,
  downloadable_records: 17,
  archive_file_count: 20,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 1,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 47,
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-683-sources-523-signals-639-research-documents",
  source_health: "passed",
  source_health_manual_review: 466,
  source_health_probe_ready: 217,
  source_monitor_current: 683,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2009,
  release_assertions: "passed-phase-57b",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57b-visual-qa-not-requested",
  preview_qa: "passed-owner-only-version-53-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-032-accepted-service-independent-outcome-validation/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-032-accepted-service-independent-outcome-validation/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-032-accepted-service-independent-outcome-validation/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,962 generated HTML pages") || gate.startsWith("Confirm 2,034 generated HTML pages")) return "Confirm 2,009 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 431 Published signal URLs")) return "Confirm all 441 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all thirty-two Published briefing URLs")) return "Confirm all thirty-three Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 455 sources supporting Published signals")) return "Confirm all 463 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 55-entry public update log")) return "Confirm the 56-entry public update log renders";
  if (gate.startsWith("Confirm all thirty-six research collections")) return "Confirm all thirty-seven research collections render 639 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57B contains seventeen unique records: five accepted-service cohorts, five observed operating outputs, four closeout or performance holds, and three rate, capacity, or baseline holds",
  "Confirm Phase 57B publishes ten bounded records and retains seven explicit In Review holds",
  "Confirm turnover, final completion, service availability, subscribers, test performance, accepted operation, operating output, recurring rate, analytical capacity, baseline, realized outcome, closeout, implementation, and closure remain distinct",
  "Confirm the Phase 57B collection contains seventeen official-link records backed by eleven new Tier 1 sources and a twenty-file archive",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57B manifest at ${manifestPath}`);
