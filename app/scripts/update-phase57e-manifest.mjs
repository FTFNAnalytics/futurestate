import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "asset-reliability-cohort-adoption-accepted-output-closure-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57e-asset-reliability-cohort-adoption-accepted-output-closure.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57e");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57e");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2159,
  signals: 587,
  published_signals: 480,
  in_review_signals: 107,
  draft_sample_signals: 0,
  published_support_sources: 479,
  sources: 699,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 43,
  published_briefings: 36,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 40,
  research_documents: 703,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 59,
  public_json_exports: 5,
  research_export_records: 655,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1977,
  signals_added: 569,
  published_signals_added: 477,
  sources_added: 597,
  summary: "Extends the Phase 55K through Phase 57D evidence baseline with Phase 57E named-asset quality, adoption and retention acceptance controls, accepted-output closure, and independent program-governance closure: 699 public sources, 587 signals, 480 Published signals, five local systems, thirty-six Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 59 public updates, forty research collections, 703 summarized research documents, and five versioned public-data exports.",
};

manifest.phase_57e_delta = {
  asset_reliability_cohort_adoption_and_accepted_output_records_reviewed: 24,
  records_added_published: 15,
  records_held_in_review: 9,
  asset_quality_reconciliations: 3,
  asset_reliability_holds: 2,
  adoption_and_retention_acceptance_controls: 4,
  adoption_and_retention_result_holds: 3,
  accepted_output_closures: 4,
  accepted_output_mass_balance_holds: 1,
  independent_program_governance_closures: 4,
  recurring_output_and_baseline_holds: 3,
  exact_target_artifacts_acquired: 0,
  exact_target_trigger_events: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  independent_implementation_changes: 4,
  independent_closure_changes: 4,
  inherited_entity_ledger_closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  phase_57d_holds_preserved: 8,
  new_visible_holds: 1,
  official_source_profiles_added: 7,
  official_source_profiles_reused: 14,
  research_documents_added_published: 15,
  research_documents_added_in_review: 9,
  signals_added_published: 15,
  signals_added_in_review: 9,
  downloadable_records: 24,
  archive_file_count: 27,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 57,
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-03",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-699-sources-587-signals-703-research-documents",
  source_health: "passed",
  source_health_manual_review: 482,
  source_health_probe_ready: 217,
  source_monitor_current: 699,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2159,
  release_assertions: "passed-phase-57e",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57e-visual-qa-not-requested",
  preview_qa: "pending-phase-57e-owner-only-deployment; phase-57d-owner-only-version-56-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,159 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 480 Published signal URLs are present in the sitemap";
  if (/^Confirm all (thirty-five|36|thirty-six) Published briefing URLs/.test(gate)) return "Confirm all thirty-six Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 479 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 59-entry public update log renders";
  if (/^Confirm all (thirty-nine|40|forty) research collections/.test(gate)) return "Confirm all forty research collections render 703 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57E contains twenty-four unique records: three asset-quality reconciliations, two asset-reliability holds, four adoption and retention acceptance controls, three result holds, four accepted-output closures, one material-balance hold, four independent governance closures, and three recurring-output or baseline holds",
  "Confirm Phase 57E publishes fifteen bounded records, retains nine explicit In Review holds, preserves all eight Phase 57D holds, and adds only the complete Hanford mass-balance hold",
  "Confirm GAO-24-106342 Recommendations 1 through 4 are recorded as independent Closed-Implemented decisions without changing the inherited entity ledger or substituting for GAO-23-104661",
  "Confirm asset inventory, reliability, serviceability, adoption, retention, performance acceptance, feed, glass, container filling, shipment, disposal, capacity, governance, qualified output, implementation, and closure remain distinct",
  "Confirm the Phase 57E collection contains twenty-four official-link records backed by seven new and fourteen carried Tier 1 sources and a twenty-seven-file archive",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57E manifest at ${manifestPath}`);
