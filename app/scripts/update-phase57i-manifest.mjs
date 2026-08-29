import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "versioned-registry-change-detection-bounded-observation-ingestion-2026";
const archivePath = join(appRoot, "public", "downloads", archiveSlug + ".zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57i-versioned-registry-change-detection-bounded-observation-ingestion.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug " + archiveSlug;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57i");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57i");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2407,
  signals: 699,
  published_signals: 556,
  in_review_signals: 143,
  draft_sample_signals: 0,
  published_support_sources: 495,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 47,
  published_briefings: 40,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 44,
  research_documents: 815,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 63,
  public_json_exports: 5,
  research_export_records: 735,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2225,
  signals_added: 681,
  published_signals_added: 553,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57H evidence baseline with Phase 57I versioned registry change detection and bounded-observation ingestion: 715 public sources, 699 signals, 556 Published signals, five local systems, forty Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 63 public updates, forty-four research collections, 815 summarized research documents, 735 research export records, and five versioned public-data exports.",
};

manifest.phase_57i_delta = {
  change_detection_and_ingestion_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_change_detection_panels_published: 5,
  amtrak_current_name_diff_rows: 16,
  amtrak_historical_identity_rows: 178,
  amtrak_accepted_identity_joins: 11,
  amtrak_unresolved_identity_joins: 5,
  amtrak_source_explicit_station_codes: 0,
  amtrak_asserted_structural_changes: 0,
  montana_schema_and_intake_panels_published: 5,
  montana_field_migration_decisions: 13,
  montana_project_quarter_envelopes: 32,
  montana_terrestrial_envelopes: 30,
  montana_leo_envelopes: 2,
  montana_completed_project_quarters_ingested: 0,
  hanford_validator_panels_published: 5,
  hanford_bounded_standalone_observations: 9,
  hanford_validator_fields: 11,
  hanford_observation_pair_decisions: 36,
  hanford_accepted_direct_numeric_joins: 0,
  nnsa_object_diff_panels_published: 5,
  nnsa_work_breakdown_objects: 18,
  nnsa_formal_source_versions: 4,
  nnsa_object_version_cells: 72,
  nnsa_bounded_diff_events: 10,
  operating_outcomes_ingested: 0,
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
  phase_57h_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_rails_added: 4,
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
  validate_content: "passed-715-sources-699-signals-815-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2407,
  release_assertions: "passed-phase-57i",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57i-visual-qa-not-requested",
  preview_qa: "pending-phase-57i-owner-only-deployment; phase-57h-owner-only-version-60-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = manifest.required_output_files.filter((path) => path !== "dist/briefings/research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion/index.html");
manifest.launch_critical_routes = manifest.launch_critical_routes.filter((path) => path !== "/briefings/research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion/");
manifest.published_briefing_routes = manifest.published_briefing_routes.filter((path) => path !== "/briefings/research-watch-039-versioned-registry-change-detection-bounded-observation-ingestion/");
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/" + archiveSlug + "/index.html",
  "dist/downloads/" + archiveSlug + ".zip",
  "dist/briefings/research-watch-039-versioned-change-detection-bounded-observation-ingestion/index.html",
  ...publishedSignalSlugs.map((slug) => "dist/signals/" + slug + "/index.html"),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => "/signals/" + slug + "/"));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/" + archiveSlug + "/",
  "/downloads/" + archiveSlug + ".zip",
  "/briefings/research-watch-039-versioned-change-detection-bounded-observation-ingestion/",
  ...publishedSignalSlugs.map((slug) => "/signals/" + slug + "/"),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-039-versioned-change-detection-bounded-observation-ingestion/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,407 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 556 Published signal URLs are present in the sitemap";
  if (/^Confirm all (thirty-nine|39|forty|40) Published briefing URLs/.test(gate)) return "Confirm all forty Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 495 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 63-entry public update log renders";
  if (/^Confirm all (forty-three|43|forty-four|44) research collections/.test(gate)) return "Confirm all forty-four research collections render 815 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57I contains twenty-nine unique records: five Amtrak change-detection panels, five Montana schema-and-intake panels, five Hanford validator panels, five NNSA object-diff panels, and nine preserved operating-outcome holds",
  "Confirm Phase 57I publishes twenty bounded control records, retains nine explicit In Review holds, preserves all nine Phase 57H holds exactly once, and adds no new hold",
  "Confirm Amtrak retains sixteen current-name diff rows and 178 historical identities, accepts eleven reviewed identity joins, blocks five unresolved identities, records zero source-explicit station codes, and asserts zero additions, removals, renames, or replacements",
  "Confirm Montana contains thirteen field-migration decisions and thirty-two privacy-gated project-quarter envelopes split across thirty terrestrial and two LEO rails, with zero completed project-quarter results ingested",
  "Confirm Hanford ingests nine bounded standalone observations, applies eleven validator fields to thirty-six pair decisions, accepts zero direct numeric joins, and creates zero batch, container, or complete material-balance identities",
  "Confirm NNSA contains eighteen work-breakdown objects, four source versions, seventy-two object-version cells, and ten bounded diff events without promoting operating outcomes, implementation, capability, or closure",
  "Confirm the Phase 57I collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the Phase 57I versioned registry change-detection and bounded-observation ingestion expansion. Thirty-six carried Tier 1 sources support twenty Published control panels, nine preserved In Review holds, four structured rails, Research Watch 039, one collection, one update, and a thirty-two-file archive. Amtrak identity diffs, Montana field migrations and project-quarter envelopes, Hanford standalone observations and pair-validator decisions, and NNSA object-level source diffs remain control records rather than operating outcomes. The release remains 0.2.0-dev and owner-only. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Updated Phase 57I manifest at " + manifestPath);
