import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-03";
const archiveSlug = "cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57k-cross-version-transition-matrices-longitudinal-panels-reopening-trigger-registry.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57k");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57k");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2527,
  signals: 757,
  published_signals: 596,
  in_review_signals: 161,
  draft_sample_signals: 0,
  published_support_sources: 495,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 49,
  published_briefings: 42,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 46,
  research_documents: 873,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 65,
  public_json_exports: 5,
  research_export_records: 777,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2345,
  signals_added: 739,
  published_signals_added: 593,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57J evidence baseline with Phase 57K cross-version transition matrices, longitudinal panels, and a machine-readable reopening-trigger registry: 715 public sources, 757 signals, 596 Published signals, five local systems, forty-two Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 65 public updates, forty-six research collections, 873 summarized research documents, 777 research export records, and five versioned public-data exports.",
};

manifest.phase_57k_delta = {
  transition_and_reopening_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_longitudinal_panels_published: 5,
  amtrak_identity_count: 178,
  amtrak_snapshot_count: 2,
  amtrak_identity_snapshot_cells: 356,
  amtrak_longitudinal_transitions: 178,
  amtrak_bounded_current_observation_transitions: 11,
  amtrak_nonobservation_no_deletion_transitions: 167,
  amtrak_unresolved_identity_rows: 5,
  amtrak_asserted_structural_changes: 0,
  montana_compatibility_panels_published: 5,
  montana_project_count: 32,
  montana_field_count: 13,
  montana_project_field_cells: 416,
  montana_schema_blocked_cells: 352,
  montana_dictionary_blocked_cells: 32,
  montana_completed_quarter_blocked_cells: 32,
  montana_envelope_requirement_checks: 224,
  montana_requirements_met: 0,
  montana_completed_project_quarters_ingested: 0,
  hanford_applicability_panels_published: 5,
  hanford_observations: 9,
  hanford_transitions: 14,
  hanford_observation_transition_cells: 126,
  hanford_from_stage_candidates: 8,
  hanford_to_stage_candidates: 12,
  hanford_not_applicable_cells: 106,
  hanford_transition_requirement_checks: 70,
  hanford_requirements_met: 0,
  hanford_accepted_custody_or_material_joins: 0,
  nnsa_transition_panels_published: 5,
  nnsa_work_breakdown_objects: 18,
  nnsa_formal_source_versions: 4,
  nnsa_adjacent_source_transitions: 3,
  nnsa_object_transitions: 54,
  nnsa_classification_dimensions: 12,
  nnsa_transition_dimension_cells: 648,
  nnsa_authority_boundary_transitions: 18,
  nnsa_bounded_diff_events_retained: 10,
  reopening_contracts_created: 9,
  reopening_contracts_triggered: 0,
  automated_publication_contracts: 0,
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
  phase_57j_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_matrices_added: 4,
  structured_trigger_registries_added: 1,
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
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-757-signals-873-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2527,
  release_assertions: "passed-phase-57k",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57k-visual-qa-not-requested",
  preview_qa: "pending-phase-57k-owner-only-deployment; phase-57j-owner-only-version-62-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-041-cross-version-transition-matrices-longitudinal-panels/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-041-cross-version-transition-matrices-longitudinal-panels/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-041-cross-version-transition-matrices-longitudinal-panels/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,527 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 596 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-one|41|forty-two|42) Published briefing URLs/.test(gate)) return "Confirm all forty-two Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 495 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 65-entry public update log renders";
  if (/^Confirm all (forty-five|45|forty-six|46) research collections/.test(gate)) return "Confirm all forty-six research collections render 873 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57K contains twenty-nine unique records: five Amtrak longitudinal panels, five Montana compatibility panels, five Hanford applicability panels, five NNSA transition panels, and nine preserved reopening-contract holds",
  "Confirm Phase 57K publishes twenty bounded transition controls, retains nine explicit In Review holds, preserves all nine Phase 57J holds exactly once, creates nine machine-readable reopening contracts, and adds no new hold",
  "Confirm Amtrak classifies 178 identities across two snapshots and 356 cells plus 178 longitudinal transition rows with eleven bounded observations, 167 nonobservations, five unresolved identities, and zero asserted structural changes",
  "Confirm Montana classifies thirty-two projects across thirteen fields and 416 blocked cells plus 224 unmet envelope requirements while preserving thirty terrestrial, two LEO, privacy, schema, definition, and state-disposition boundaries",
  "Confirm Hanford classifies nine observations across fourteen transitions and 126 applicability cells plus seventy unmet requirements while creating zero batch, container, custody, numeric, or complete material-balance joins",
  "Confirm NNSA classifies eighteen objects across three adjacent source transitions, fifty-four object transitions, twelve dimensions, and 648 cells without promoting output, capability, implementation, completion, or closure",
  "Confirm all nine reopening contracts retain complete required-field lists, record zero trigger events, prohibit automated publication, and preserve human review",
  "Confirm the Phase 57K collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the Phase 57K cross-version transition matrices, longitudinal panels, and reopening-trigger registry expansion. Thirty-six carried Tier 1 sources support twenty Published transition controls, nine preserved In Review holds, four longitudinal matrices, nine machine-readable reopening contracts, Research Watch 041, one collection, one update, and a thirty-two-file archive. Amtrak source-presence transitions, Montana project-field compatibility, Hanford observation-transition applicability, NNSA object-version dimension changes, and defined reopening triggers remain auditable control records rather than operating events. The release remains 0.2.0-dev and owner-only. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57K manifest at ${manifestPath}`);
