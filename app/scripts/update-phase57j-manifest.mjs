import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "historical-backfill-rejection-taxonomy-review-queue-execution-2026";
const archivePath = join(appRoot, "public", "downloads", archiveSlug + ".zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57j-historical-backfill-rejection-taxonomy-review-queue-execution.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug " + archiveSlug;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57j");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57j");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2467,
  signals: 728,
  published_signals: 576,
  in_review_signals: 152,
  draft_sample_signals: 0,
  published_support_sources: 495,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 48,
  published_briefings: 41,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 45,
  research_documents: 844,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 64,
  public_json_exports: 5,
  research_export_records: 756,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2285,
  signals_added: 710,
  published_signals_added: 573,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57I evidence baseline with Phase 57J historical backfill, rejection taxonomy, and review-queue execution: 715 public sources, 728 signals, 576 Published signals, five local systems, forty-one Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 64 public updates, forty-five research collections, 844 summarized research documents, 756 research export records, and five versioned public-data exports.",
};

manifest.phase_57j_delta = {
  historical_backfill_and_review_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_historical_backfill_panels_published: 5,
  amtrak_source_snapshots: 2,
  amtrak_historical_identity_decisions: 178,
  amtrak_historical_presence_decisions: 178,
  amtrak_current_bounded_observation_links: 11,
  amtrak_historical_only_retentions: 167,
  amtrak_current_name_review_rows: 16,
  amtrak_exact_identity_links: 10,
  amtrak_controlled_alias_links: 1,
  amtrak_rejected_unresolved_links: 5,
  amtrak_asserted_structural_changes: 0,
  montana_rejection_taxonomy_panels_published: 5,
  montana_field_migration_tests: 13,
  montana_field_migration_tests_accepted: 0,
  montana_field_migration_tests_rejected: 13,
  montana_project_envelope_tests: 32,
  montana_project_envelope_tests_accepted: 0,
  montana_project_envelope_tests_rejected: 32,
  montana_envelope_rejection_reason_assignments: 224,
  montana_terrestrial_envelopes: 30,
  montana_leo_envelopes: 2,
  montana_completed_project_quarters_ingested: 0,
  hanford_rejection_taxonomy_panels_published: 5,
  hanford_normalized_standalone_observations: 9,
  hanford_observation_join_blocker_assignments: 54,
  hanford_pair_reviews: 36,
  hanford_pair_reviews_accepted: 0,
  hanford_pair_reviews_rejected: 36,
  hanford_transition_reviews: 14,
  hanford_transition_reviews_accepted: 0,
  hanford_transition_reviews_rejected: 14,
  hanford_accepted_custody_or_material_joins: 0,
  nnsa_classification_panels_published: 5,
  nnsa_work_breakdown_objects: 18,
  nnsa_formal_source_versions: 4,
  nnsa_object_version_cells: 72,
  nnsa_classification_dimensions: 12,
  nnsa_cell_dimension_classifications: 864,
  nnsa_bounded_diff_reviews: 10,
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
  phase_57i_holds_preserved: 9,
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
  validate_content: "passed-715-sources-728-signals-844-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2467,
  release_assertions: "passed-phase-57j",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57j-visual-qa-not-requested",
  preview_qa: "pending-phase-57j-owner-only-deployment; phase-57i-owner-only-version-61-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/" + archiveSlug + "/index.html",
  "dist/downloads/" + archiveSlug + ".zip",
  "dist/briefings/research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution/index.html",
  ...publishedSignalSlugs.map((slug) => "dist/signals/" + slug + "/index.html"),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => "/signals/" + slug + "/"));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/" + archiveSlug + "/",
  "/downloads/" + archiveSlug + ".zip",
  "/briefings/research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution/",
  ...publishedSignalSlugs.map((slug) => "/signals/" + slug + "/"),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-040-historical-backfill-rejection-taxonomy-review-queue-execution/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,467 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 576 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty|40|forty-one|41) Published briefing URLs/.test(gate)) return "Confirm all forty-one Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 495 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 64-entry public update log renders";
  if (/^Confirm all (forty-four|44|forty-five|45) research collections/.test(gate)) return "Confirm all forty-five research collections render 844 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57J contains twenty-nine unique records: five Amtrak historical-backfill panels, five Montana migration-and-envelope rejection panels, five Hanford observation-and-transition rejection panels, five NNSA object-version classification panels, and nine preserved operating-outcome holds",
  "Confirm Phase 57J publishes twenty bounded control records, retains nine explicit In Review holds, preserves all nine Phase 57I holds exactly once, and adds no new hold",
  "Confirm Amtrak classifies all 178 historical identities, links eleven bounded current observations, retains 167 historical-only identities without deletion inference, executes sixteen current-name reviews with ten exact, one controlled-alias, and five rejected links, and asserts zero structural changes",
  "Confirm Montana rejects all thirteen field-migration tests and all thirty-two project-envelope tests with explicit schema, dictionary, completed-record, period, authority, definition, privacy, state-disposition, and completed-public-record reasons while accepting zero observations",
  "Confirm Hanford normalizes nine bounded observations, retains six join-blocker classes, classifies thirty-six rejected pairs and fourteen rejected transitions, and creates zero batch, container, custody, numeric, or complete material-balance joins",
  "Confirm NNSA classifies eighteen objects across four source versions and seventy-two cells through twelve dimensions and 864 bounded classifications without promoting output, capability, implementation, completion, or closure",
  "Confirm the Phase 57J collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the Phase 57J historical backfill, rejection taxonomy, and review-queue execution expansion. Thirty-six carried Tier 1 sources support twenty Published control panels, nine preserved In Review holds, four executed structured rails, Research Watch 040, one collection, one update, and a thirty-two-file archive. Amtrak historical identities, Montana migration and envelope rejections, Hanford observation, pair, and transition rejections, and NNSA object-version classifications remain auditable control records rather than operating outcomes. The release remains 0.2.0-dev and owner-only. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Updated Phase 57J manifest at " + manifestPath);
