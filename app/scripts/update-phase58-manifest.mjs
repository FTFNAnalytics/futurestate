import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = join(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const contentCommit = process.argv[2] ?? "pending-phase-58-content-commit";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const unique = (values) => [...new Set(values)];

manifest.generated_date = "2026-08-11";

const phase58Commands = ["npm run test:phase58", "npm run verify:phase58"];
manifest.predeploy_commands = manifest.predeploy_commands.filter(
  (command) => !phase58Commands.includes(command)
);
const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(
  releaseIndex >= 0 ? releaseIndex : manifest.predeploy_commands.length,
  0,
  ...phase58Commands
);

Object.assign(manifest.expected_build, {
  static_pages: 3867,
  signals: 1406,
  published_signals: 1120,
  in_review_signals: 286,
  published_support_sources: 501,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 65,
  published_briefings: 58,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 61,
  research_documents: 1533,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 81,
  public_json_exports: 6,
  evidence_queue_records: 10,
  research_export_records: 1326,
  pathway_export_records: 11
});

Object.assign(manifest.release_delta_from_v0_1_1, {
  static_pages_added: 3685,
  signals_added: 1388,
  published_signals_added: 1117,
  sources_added: 613,
  public_json_exports_added: 6,
  public_update_log_added: true,
  summary: "Extends the Phase 55K through Phase 57Z evidence baseline with Phase 58 dated evidence operations and reader change receipts: 715 public sources, 1,406 signals, 1,120 Published signals, five local systems, fifty-eight Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 81 public updates, sixty-one research collections, 1,533 summarized research documents, 1,326 research export records, a ten-item evidence queue, and six versioned public-data exports."
});

Object.assign(manifest.last_verified, {
  date: "2026-08-11",
  candidate_validation: "passed-150-local-only-records",
  validate_content: "passed-715-sources-1406-signals-1533-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_review_due: 0,
  source_monitor_watch_soon: 0,
  source_monitor_current: 715,
  source_coverage_strong_lanes: 14,
  source_coverage_developing_lanes: 0,
  source_coverage_weak_lanes: 0,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 3867,
  release_assertions: "passed-phase-57y-phase-57z-and-phase-58-operating-slice",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-58-visual-qa-not-requested",
  hosted_routes_checked: 0,
  preview_qa: `phase-58-local-content-commit-${contentCommit}-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified`
});

manifest.published_briefing_routes = unique([
  ...manifest.published_briefing_routes,
  "/briefings/research-watch-057-dated-evidence-operations-and-change-receipts/"
]).sort();

manifest.required_output_files = unique([
  ...manifest.required_output_files,
  "dist/briefings/research-watch-057-dated-evidence-operations-and-change-receipts/index.html",
  "dist/data/evidence-queue.json"
]);

manifest.phase_58_delta = {
  operating_slice: "dated-evidence-queue-reader-change-receipts-local-authority-foundation",
  held_signal_queue_records: 10,
  exact_next_artifacts: 10,
  review_cadences: 10,
  receipt_types_defined: 4,
  dated_source_checks_completed: 1,
  no_material_change_receipts_published: 1,
  material_record_changes: 0,
  underlying_signal_state_changes: 0,
  duplicate_hold_signals_created: 0,
  stale_queue_items_at_checkpoint: 0,
  composite_scores_created: 0,
  public_evidence_queue_records: 10,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  briefings_added_published: 1,
  generated_pages_added: 1,
  supabase_declarative_schemas: 1,
  private_authority_tables: 5,
  forced_rls_tables: 5,
  anon_authority_grants: 0,
  direct_publication_functions_triggers_or_webhooks: 0,
  deterministic_private_workflow_harness: "passed",
  external_supabase_project_created: false,
  supabase_project_linked: false,
  migration_applied: false,
  runtime_rls_tested: false,
  private_studio_connected: false,
  local_content_commit: contentCommit,
  deployment_status: "local_operating_slice_release_validated_owner_only_deployment_pending_phase-57w-version-79-remains-live"
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 58 release manifest for content commit ${contentCommit}.`);
