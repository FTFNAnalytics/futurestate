import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = join(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const contentCommit = process.argv[2] ?? "pending-phase-57y-57z-content-commit";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const signals = JSON.parse(await readFile(join(appRoot, "dist", "data", "signals.json"), "utf8"));
const unique = (values) => [...new Set(values)];

manifest.generated_date = "2026-08-10";
Object.assign(manifest.private_preview, {
  current_local_content_commit: "589d4d4b00b693baa07f8f62634f2e6e942c5844",
  current_source_commit: "00be8bbd39173a2f726e9cea100a803b02a398c8",
  current_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_1f33db6da5dc8191aa1f972909040cf7",
  current_version_number: 79,
  current_deployment_id: "appgdep_6a7977dd422881919873d6d165ff1f58",
  post_deploy_qa: "passed-version-79-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
});

const predeployAdditions = [
  "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug federation-remediation-witness-rotation-recusal-time-holdover-coordinated-rollout-legacy-recovery-2026",
  "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug dated-evidence-return-council-adoption-results-gates-hold-resolution-decisions-2026",
  "npm run test:phase57y",
  "npm run verify:phase57y",
  "npm run verify:phase57z",
];
const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
for (const command of predeployAdditions) {
  if (!manifest.predeploy_commands.includes(command)) manifest.predeploy_commands.splice(releaseIndex >= 0 ? releaseIndex : manifest.predeploy_commands.length, 0, command);
}

Object.assign(manifest.expected_build, {
  static_pages: 3866,
  signals: 1406,
  published_signals: 1120,
  in_review_signals: 286,
  published_support_sources: 501,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 64,
  published_briefings: 57,
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
  updates: 80,
  public_json_exports: 5,
  research_export_records: 1326,
  pathway_export_records: 11,
});

Object.assign(manifest.release_delta_from_v0_1_1, {
  static_pages_added: 3684,
  signals_added: 1388,
  published_signals_added: 1117,
  sources_added: 613,
  public_json_exports_added: 5,
  public_update_log_added: true,
  summary: "Extends the Phase 55K through Phase 57X evidence baseline with Phase 57Y long-horizon federation remediation and Phase 57Z dated-evidence return: 715 public sources, 1,406 signals, 1,120 Published signals, five local systems, fifty-seven Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 80 public updates, sixty-one research collections, 1,533 summarized research documents, 1,326 research export records, and five versioned public-data exports.",
});

Object.assign(manifest.last_verified, {
  date: "2026-08-10",
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
  static_pages_built: 3866,
  release_assertions: "passed-phase-57y-and-phase-57z",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57z-visual-qa-not-requested",
  hosted_routes_checked: 0,
  preview_qa: `phase-57y-and-phase-57z-local-content-commit-${contentCommit}-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified`,
});

manifest.published_signal_routes = signals.records.map((record) => record.path).sort();
manifest.published_briefing_routes = unique([
  ...manifest.published_briefing_routes,
  "/briefings/research-watch-055-federation-remediation-and-long-term-recovery/",
  "/briefings/research-watch-056-dated-evidence-return-and-hold-resolution/",
]).sort();
manifest.required_output_files = unique([
  ...manifest.required_output_files,
  "dist/briefings/research-watch-055-federation-remediation-and-long-term-recovery/index.html",
  "dist/briefings/research-watch-056-dated-evidence-return-and-hold-resolution/index.html",
  "dist/research/federation-remediation-witness-rotation-recusal-time-holdover-coordinated-rollout-legacy-recovery-2026/index.html",
  "dist/research/dated-evidence-return-council-adoption-results-gates-hold-resolution-decisions-2026/index.html",
  "dist/research/documents/57z-toronto-council-adoption/index.html",
  "dist/research/documents/57z-darpa-official-results-gate-recheck/index.html",
  "dist/signals/57y-amtrak-pids-health-breach-remediation-capacity-planning/index.html",
  "dist/signals/toronto-24-254930-scarborough-community-council-recommendation/index.html",
  "dist/downloads/federation-remediation-witness-rotation-recusal-time-holdover-coordinated-rollout-legacy-recovery-2026.zip",
  "dist/downloads/dated-evidence-return-council-adoption-results-gates-hold-resolution-decisions-2026.zip",
]);

manifest.phase_57y_delta = {
  federation_maintenance_records_reviewed: 63,
  records_added_published: 54,
  records_held_in_review: 9,
  contract_specific_controls_published: 54,
  controls_per_contract: 6,
  remediation_schemas: 9,
  rotation_schemas: 9,
  recusal_schemas: 9,
  holdover_schemas: 9,
  rollout_schemas: 9,
  recovery_schemas: 9,
  total_contract_specific_schemas: 54,
  remediation_cases: 270,
  rotation_cases: 270,
  recusal_cases: 270,
  holdover_cases: 243,
  rollout_cases: 288,
  recovery_cases: 288,
  total_workflow_cases: 1629,
  valid_or_preservation_routes: 423,
  rejected_routes: 1206,
  workflow_test_failures: 0,
  actual_production_events: 0,
  actual_reader_state_changes: 0,
  human_blame_assignments: 0,
  eligible_records_accepted: 0,
  reopening_triggers_fired: 0,
  automated_closures_or_publications: 0,
  operating_outcome_changes: 0,
  inherited_entity_ledger_closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  phase_57x_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  research_documents_added_published: 54,
  research_documents_added_in_review: 9,
  signals_added_published: 54,
  signals_added_in_review: 9,
  downloadable_records: 63,
  archive_file_count: 66,
  archive_bytes: 66887,
  archive_sha256: "44C545BC67C5EBF86E850DBAD21DC598468BC9561A25C3D1069A9354E15DECC7",
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 128,
  research_export_records_added: 55,
  local_content_commit: contentCommit,
  deployment_status: "local_content_commit_recorded_owner_only_deployment_pending_phase-57w-version-79-remains-live",
};

manifest.phase_57z_delta = {
  evidence_return_decisions_reviewed: 11,
  published_research_decisions: 11,
  dated_advancements: 1,
  signals_promoted: 1,
  signals_kept_in_review: 10,
  inherited_holds_reviewed: 9,
  inherited_holds_resolved: 0,
  inherited_holds_remaining: 9,
  duplicate_hold_signals_created: 0,
  official_source_profiles_added: 0,
  official_source_profiles_rechecked: 11,
  public_agency_contacts_or_foia_requests: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  research_documents_added_published: 11,
  signals_added_published: 0,
  signals_added_in_review: 0,
  existing_signals_promoted: 1,
  downloadable_records: 11,
  archive_file_count: 14,
  archive_bytes: 13992,
  archive_sha256: "6A0118B1F289C20E55FDD88EC1105807F7BEE40B0B7904772D7C69326C868C88",
  briefings_added_published: 1,
  research_collections_added: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 6,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 13,
  research_export_records_added: 12,
  local_content_commit: contentCommit,
  deployment_status: "local_content_commit_recorded_owner_only_deployment_pending_phase-57w-version-79-remains-live",
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57Y/57Z release manifest for content commit ${contentCommit}.`);
