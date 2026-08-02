import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "service-reliability-adoption-recurring-output-validation-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57c-service-reliability-adoption-recurring-output-validation.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57c");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57c");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2053,
  signals: 543,
  published_signals: 453,
  in_review_signals: 90,
  draft_sample_signals: 0,
  published_support_sources: 465,
  sources: 685,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 41,
  published_briefings: 34,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 38,
  research_documents: 659,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 57,
  public_json_exports: 5,
  research_export_records: 626,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1871,
  signals_added: 525,
  published_signals_added: 450,
  sources_added: 583,
  summary: "Extends the Phase 55K through Phase 57B evidence baseline with Phase 57C service-reliability, adoption, and recurring-output validation: 685 public sources, 543 signals, 453 Published signals, five local systems, thirty-four Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 57 public updates, thirty-eight research collections, 659 summarized research documents, and five versioned public-data exports.",
};

manifest.phase_57c_delta = {
  service_reliability_adoption_and_recurring_output_records_reviewed: 20,
  records_added_published: 12,
  records_held_in_review: 8,
  service_inventory_and_reliability_boundary_records: 5,
  repeat_operating_output_records: 4,
  accepted_disposal_and_closed_loop_outcomes: 2,
  cross_system_validation_boundaries: 1,
  service_reliability_holds: 2,
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
  phase_57b_holds_preserved: 7,
  new_visible_holds: 1,
  official_source_profiles_added: 2,
  official_source_profiles_reused: 14,
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
  generated_pages_added: 44,
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-685-sources-543-signals-659-research-documents",
  source_health: "passed",
  source_health_manual_review: 468,
  source_health_probe_ready: 217,
  source_monitor_current: 685,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2053,
  release_assertions: "passed-phase-57c",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57c-visual-qa-not-requested",
  preview_qa: "passed-owner-only-version-54-deployment-status-source-provenance-runtime-archive; custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-033-service-reliability-adoption-recurring-output-validation/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-033-service-reliability-adoption-recurring-output-validation/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-033-service-reliability-adoption-recurring-output-validation/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,053 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 453 Published signal URLs are present in the sitemap";
  if (/^Confirm all (thirty-three|34|thirty-four) Published briefing URLs/.test(gate)) return "Confirm all thirty-four Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 465 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 57-entry public update log renders";
  if (/^Confirm all (thirty-seven|38|thirty-eight) research collections/.test(gate)) return "Confirm all thirty-eight research collections render 659 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57C contains twenty unique records: five service-inventory boundaries, four repeat outputs, two accepted-disposal or closed-loop outcomes, one cross-system baseline boundary, two reliability holds, three adoption or activation holds, and three recurring-output or baseline holds",
  "Confirm Phase 57C publishes twelve bounded records, retains eight explicit In Review holds, and preserves all seven Phase 57B holds",
  "Confirm deployment, serviceability, availability, use, adoption, tests, accepted operation, repeat output, recurring rate, analytical capacity, project baseline, program baseline, realized outcome, closeout, implementation, and closure remain distinct",
  "Confirm the Phase 57C collection contains twenty official-link records backed by two new and fourteen carried Tier 1 sources and a twenty-three-file archive",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57C manifest at ${manifestPath}`);
