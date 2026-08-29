import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "registry-revision-provenance-compatible-observation-joins-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57h-registry-revision-provenance-compatible-observation-joins.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57h");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57h");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2347,
  signals: 670,
  published_signals: 536,
  in_review_signals: 134,
  draft_sample_signals: 0,
  published_support_sources: 495,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 46,
  published_briefings: 39,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 43,
  research_documents: 786,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 62,
  public_json_exports: 5,
  research_export_records: 714,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2165,
  signals_added: 652,
  published_signals_added: 533,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57G evidence baseline with Phase 57H registry revision, provenance, and compatible-observation matrices: 715 public sources, 670 signals, 536 Published signals, five local systems, thirty-nine Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 62 public updates, forty-three research collections, 786 summarized research documents, 714 research export records, and five versioned public-data exports.",
};

manifest.phase_57h_delta = {
  registry_revision_provenance_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_provenance_panels_published: 5,
  amtrak_historical_station_keys: 178,
  amtrak_current_distinct_names: 16,
  amtrak_current_completion_memberships: 19,
  amtrak_exact_name_matches: 10,
  amtrak_controlled_alias_matches: 1,
  amtrak_unresolved_current_names: 5,
  montana_provenance_panels_published: 5,
  montana_public_field_definitions: 13,
  montana_versioned_projects: 32,
  montana_untranslated_technology_codes: 5,
  hanford_compatibility_panels_published: 5,
  hanford_source_authorities: 9,
  hanford_custody_transitions: 14,
  hanford_observation_pairs: 36,
  hanford_direct_numeric_joins_allowed: 0,
  nnsa_version_history_panels_published: 5,
  nnsa_work_breakdown_objects: 18,
  nnsa_formal_source_versions: 4,
  nnsa_bounded_change_events: 10,
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
  phase_57g_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_matrices_added: 4,
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
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 60,
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-03",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-670-signals-786-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2347,
  release_assertions: "passed-phase-57h",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57h-visual-qa-not-requested",
  preview_qa: "pending-phase-57h-owner-only-deployment; phase-57g-owner-only-version-59-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-038-registry-revision-provenance-compatible-observation-joins/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-038-registry-revision-provenance-compatible-observation-joins/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-038-registry-revision-provenance-compatible-observation-joins/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,347 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 536 Published signal URLs are present in the sitemap";
  if (/^Confirm all (thirty-eight|38|thirty-nine|39) Published briefing URLs/.test(gate)) return "Confirm all thirty-nine Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 495 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 62-entry public update log renders";
  if (/^Confirm all (forty-two|42|forty-three|43) research collections/.test(gate)) return "Confirm all forty-three research collections render 786 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57H contains twenty-nine unique records: five Amtrak alias-and-revision panels, five Montana field-provenance panels, five Hanford authority-and-compatibility panels, five NNSA version-history panels, and nine preserved operating-outcome holds",
  "Confirm Phase 57H publishes twenty bounded provenance records, retains nine explicit In Review holds, preserves all nine Phase 57G holds exactly once, and adds no new hold",
  "Confirm Amtrak contains 178 historical station keys, sixteen distinct June 2026 completion names, nineteen completion memberships, ten exact matches, one controlled alias, and five unresolved current names without asserting additions or removals",
  "Confirm Montana contains thirteen classified public fields and thirty-two versioned projects, excludes individual BSL and CAI details, and leaves five raw technology-code values untranslated pending an official schema",
  "Confirm Hanford contains nine source authorities, fourteen custody transitions, thirty-six observation-pair decisions, zero direct numeric joins, zero public batch IDs, and zero public container IDs",
  "Confirm NNSA contains eighteen work-breakdown objects, four formal source versions, and ten bounded change events without substituting cost, capacity, qualification, output, project completion, capability, or independent recommendation closure",
  "Confirm the Phase 57H collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57H manifest at ${manifestPath}`);
