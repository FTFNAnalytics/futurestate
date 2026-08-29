import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "named-asset-project-cohort-registry-expansion-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57g-named-asset-project-cohort-registry-expansion.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57g");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57g");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2287,
  signals: 641,
  published_signals: 516,
  in_review_signals: 125,
  draft_sample_signals: 0,
  published_support_sources: 495,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 45,
  published_briefings: 38,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 42,
  research_documents: 757,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 61,
  public_json_exports: 5,
  research_export_records: 693,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2105,
  signals_added: 623,
  published_signals_added: 513,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57F evidence baseline with Phase 57G named-asset and project-cohort registries: 715 public sources, 641 signals, 516 Published signals, five local systems, thirty-eight Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 61 public updates, forty-two research collections, 757 summarized research documents, 693 research export records, and five versioned public-data exports.",
};

manifest.phase_57g_delta = {
  named_asset_and_project_cohort_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_registry_panels_published: 5,
  amtrak_appendix_b_memberships: 197,
  amtrak_unique_normalized_station_keys: 178,
  montana_registry_panels_published: 5,
  montana_subgrantees: 19,
  montana_projects: 32,
  montana_bsl_rows: 68315,
  montana_cai_rows: 183,
  hanford_registry_panels_published: 5,
  hanford_lifecycle_stages: 14,
  hanford_bounded_observations: 9,
  public_hanford_batch_ids: 0,
  public_hanford_container_ids: 0,
  nnsa_registry_panels_published: 5,
  nnsa_work_breakdown_entries: 18,
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
  phase_57f_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 9,
  official_source_profiles_reused: 27,
  structured_registries_added: 4,
  research_documents_added_published: 20,
  research_documents_added_in_review: 9,
  signals_added_published: 20,
  signals_added_in_review: 9,
  downloadable_records: 29,
  archive_file_count: 32,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 1,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 69,
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-03",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-641-signals-757-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2287,
  release_assertions: "passed-phase-57g",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57g-visual-qa-not-requested",
  preview_qa: "pending-phase-57g-owner-only-deployment; phase-57f-owner-only-version-58-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-037-named-asset-project-cohort-registry-expansion/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-037-named-asset-project-cohort-registry-expansion/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-037-named-asset-project-cohort-registry-expansion/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,287 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 516 Published signal URLs are present in the sitemap";
  if (/^Confirm all (thirty-seven|37|thirty-eight|38) Published briefing URLs/.test(gate)) return "Confirm all thirty-eight Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 495 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 61-entry public update log renders";
  if (/^Confirm all (forty-one|41|forty-two|42) research collections/.test(gate)) return "Confirm all forty-two research collections render 757 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57G contains twenty-nine unique records: five named-Amtrak registry panels, five Montana project-cohort panels, five Hanford batch-container-stage panels, five NNSA work-breakdown panels, and nine preserved operating-outcome holds",
  "Confirm Phase 57G publishes twenty bounded identity-and-lineage records, retains nine explicit In Review holds, preserves all nine Phase 57F holds exactly once, and adds no new hold",
  "Confirm Amtrak contains 197 Appendix B memberships, 178 normalized station keys, and exact 30 / 120 / 47 cohort counts while historical state remains separate from current reliability",
  "Confirm Montana contains nineteen subgrantees, thirty-two projects, 68,315 BSL rows, 183 CAI rows, exact funding totals, no individual location details, and no translated raw codes without an official schema",
  "Confirm Hanford contains fourteen lifecycle stages and nine bounded observations while public batch and container IDs remain zero and no synthetic mass or stage conversion occurs",
  "Confirm NNSA contains eighteen distinct site, facility, project, subproject, strategy, capacity, qualification, and GAO-baseline objects without work-breakdown substitution or readiness inflation",
  "Confirm the Phase 57G collection contains twenty-nine official-link records backed by nine new and twenty-seven carried Tier 1 sources and a thirty-two-file archive",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57G manifest at ${manifestPath}`);
