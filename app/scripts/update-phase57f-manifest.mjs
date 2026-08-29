import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "measured-reliability-observed-adoption-full-output-reconciliation-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57f-measured-reliability-observed-adoption-full-output-reconciliation.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57f");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57f");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2218,
  signals: 612,
  published_signals: 496,
  in_review_signals: 116,
  draft_sample_signals: 0,
  published_support_sources: 485,
  sources: 706,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 44,
  published_briefings: 37,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 41,
  research_documents: 728,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 60,
  public_json_exports: 5,
  research_export_records: 672,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2036,
  signals_added: 594,
  published_signals_added: 493,
  sources_added: 604,
  summary: "Extends the Phase 55K through Phase 57E evidence baseline with Phase 57F measured-reliability denominators, privacy-safe adoption measurement contracts, full material-stage reconciliation, and exact qualified-output and GAO baseline-state reconciliation: 706 public sources, 612 signals, 496 Published signals, five local systems, thirty-seven Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 60 public updates, forty-one research collections, 728 summarized research documents, 672 research export records, and five versioned public-data exports.",
};

manifest.phase_57f_delta = {
  measured_reliability_observed_adoption_and_full_output_records_reviewed: 25,
  records_added_published: 16,
  records_held_in_review: 9,
  measured_reliability_denominator_reconciliations: 4,
  measured_reliability_outcome_holds: 2,
  observed_adoption_measurement_contracts: 4,
  observed_adoption_outcome_holds: 3,
  full_output_reconciliations: 4,
  full_output_reconciliation_holds: 1,
  qualified_output_reconciliations: 4,
  qualified_output_outcome_holds: 3,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  inherited_entity_ledger_closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  phase_57e_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 7,
  official_source_profiles_reused: 17,
  research_documents_added_published: 16,
  research_documents_added_in_review: 9,
  signals_added_published: 16,
  signals_added_in_review: 9,
  downloadable_records: 25,
  archive_file_count: 28,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 59,
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-03",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-706-sources-612-signals-728-research-documents",
  source_health: "passed",
  source_health_manual_review: 489,
  source_health_probe_ready: 217,
  source_monitor_current: 706,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2218,
  release_assertions: "passed-phase-57f",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57f-visual-qa-not-requested",
  preview_qa: "pending-phase-57f-owner-only-deployment; phase-57e-owner-only-version-57-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,218 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 496 Published signal URLs are present in the sitemap";
  if (/^Confirm all (thirty-six|36|thirty-seven|37) Published briefing URLs/.test(gate)) return "Confirm all thirty-seven Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 485 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 60-entry public update log renders";
  if (/^Confirm all (forty|40|forty-one|41) research collections/.test(gate)) return "Confirm all forty-one research collections render 728 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57F contains twenty-five unique records: four measured-reliability denominator reconciliations, two reliability holds, four observed-adoption measurement contracts, three adoption holds, four full-output reconciliations, one mass-balance hold, four qualified-output reconciliations, and three qualified-output or baseline holds",
  "Confirm Phase 57F publishes sixteen bounded records, retains nine explicit In Review holds, preserves all nine Phase 57E holds exactly once, and adds no new hold",
  "Confirm Amtrak's 120, 96, 93, and 117 inventories remain dated and non-interchangeable; Montana reporting fields remain controls rather than awardee outcomes",
  "Confirm Hanford's 19 sent, 34 filled, 66 shipped, approximately 30 staged, greater-than-100,000-gallon, and nominal seven-metric-ton observations remain separate stages and units without synthetic multiplication",
  "Confirm NNSA's first production unit, current R&D-only capability statement, 80-per-year capacity objective, and exact GAO-23-104661 Open status remain distinct from recurring qualified output and baseline closure",
  "Confirm the Phase 57F collection contains twenty-five official-link records backed by seven new and seventeen carried Tier 1 sources and a twenty-eight-file archive",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57F manifest at ${manifestPath}`);
