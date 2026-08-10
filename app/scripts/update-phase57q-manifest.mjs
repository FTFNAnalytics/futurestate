import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "manual-release-authorization-publication-bundles-withdrawal-rollback-receipts-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57q-manual-release-authorization-publication-bundles-withdrawal-rollback-receipts.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57q", "npm run verify:phase57q"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57q", "npm run verify:phase57q");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2919,
  signals: 947,
  published_signals: 732,
  in_review_signals: 215,
  draft_sample_signals: 0,
  published_support_sources: 498,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 55,
  published_briefings: 48,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 52,
  research_documents: 1063,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 71,
  public_json_exports: 5,
  research_export_records: 919,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2737,
  signals_added: 929,
  published_signals_added: 729,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57P evidence baseline with Phase 57Q manual release authorization, immutable publication bundles, and append-only withdrawal and rollback controls: 715 public sources, 947 signals, 732 Published signals, five local systems, forty-eight Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 71 public updates, fifty-two research collections, 1,063 summarized research documents, 919 research export records, and five versioned public-data exports.",
};

manifest.phase_57q_delta = {
  release_bundle_and_lifecycle_records_reviewed: 45,
  records_added_published: 36,
  records_held_in_review: 9,
  contract_specific_controls_published: 36,
  controls_per_contract: 4,
  release_checklist_schemas: 9,
  release_checklist_items_per_contract: 12,
  publication_bundle_schemas: 9,
  release_lifecycle_state_machines: 9,
  total_contract_specific_schemas: 27,
  release_authorization_cases: 126,
  valid_manual_authorization_routes: 9,
  rejected_release_routes: 117,
  publication_bundle_cases: 126,
  valid_publication_bundle_routes: 9,
  rejected_publication_bundle_routes: 117,
  withdrawal_rollback_lifecycle_cases: 144,
  release_append_routes: 9,
  publication_append_routes: 9,
  withdrawal_append_routes: 9,
  rollback_append_routes: 9,
  supersession_append_routes: 9,
  history_preservation_routes: 9,
  rejected_lifecycle_routes: 90,
  total_workflow_cases: 396,
  workflow_test_failures: 0,
  actual_candidate_packets_evaluated: 0,
  actual_reviewer_identities: 0,
  actual_release_actors: 0,
  actual_release_authorizations: 0,
  actual_publication_bundles: 0,
  actual_publications: 0,
  actual_withdrawals: 0,
  actual_rollbacks: 0,
  actual_supersessions: 0,
  eligible_records_accepted: 0,
  reopening_triggers_fired: 0,
  automated_closures_or_publications: 0,
  operating_outcomes_ingested: 0,
  exact_target_artifacts_acquired: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  implementation_changes: 0,
  capability_changes: 0,
  closure_changes: 0,
  operating_outcome_changes: 0,
  inherited_entity_ledger_closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  phase_57p_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_release_registries_added: 1,
  structured_bundle_registries_added: 1,
  structured_lifecycle_registries_added: 1,
  research_documents_added_published: 36,
  research_documents_added_in_review: 9,
  signals_added_published: 36,
  signals_added_in_review: 9,
  downloadable_records: 45,
  archive_file_count: 48,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 92,
  deployment_status: "pending_exact_source_commit_and_owner_only_deployment_phase-57p-version-72-remains-live",
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-947-signals-1063-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2919,
  release_assertions: "passed-phase-57q",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57q-visual-qa-not-requested",
  preview_qa: "phase-57q-owner-only-deployment-pending-exact-source-commit; phase-57p-owner-only-sites-version-72-remains-live-and-verified",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-047-manual-release-publication-bundles-rollback-receipts/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-047-manual-release-publication-bundles-rollback-receipts/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, ["/briefings/research-watch-047-manual-release-publication-bundles-rollback-receipts/"]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,919 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 732 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-seven|47|forty-eight|48) Published briefing URLs/.test(gate)) return "Confirm all forty-eight Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 71-entry public update log renders";
  if (/^Confirm all (fifty-one|51|fifty-two|52) research collections/.test(gate)) return "Confirm all fifty-two research collections render 1,063 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57Q contains forty-five unique records: thirty-six contract-specific release, bundle, rollback, and zero-automation controls plus nine preserved holds",
  "Confirm Phase 57Q publishes thirty-six bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57P holds exactly once, and adds no new hold",
  "Confirm nine twelve-item manual release checklists pass 126 cases, route nine complete fixtures only to authorization awaiting separate publication, and reject 117 incomplete, role-colliding, mismatched, unresolved, premature, or automated fixtures",
  "Confirm nine immutable publication-bundle schemas pass 126 cases, bind exact packet and receipt digests, and reject 117 mutation, completeness, ordering, version, signature, identifier, or hash-algorithm attacks",
  "Confirm nine release lifecycles pass 144 cases, append release, publication, withdrawal, rollback, and supersession while preserving history, and reject ninety mutation, erasure, chronology, authority, target, automation, or state-inflation attempts",
  "Confirm Phase 57Q records zero actual actors, release authorizations, publication bundles, publications, withdrawals, rollbacks, supersessions, triggers, closures, or operating-outcome changes",
  "Confirm Phase 57Q preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, or operating-outcome promotions",
  "Confirm the Phase 57Q collection contains forty-five official-link records backed by thirty-six carried Tier 1 sources and a forty-eight-file archive",
]);

manifest.notes = "This manifest records the locally release-validated Phase 57Q manual release authorization, immutable publication-bundle, and reversible-publication expansion. Thirty-six carried Tier 1 sources support thirty-six Published contract-specific controls, nine preserved In Review holds, nine release checklists, nine bundle schemas, nine lifecycle machines, 396 executable cases, Research Watch 047, one collection, one update, and a forty-eight-file archive. Zero actual packets, reviewers, release actors, authorizations, bundles, publications, withdrawals, rollbacks, supersessions, triggers, closures, or operating-outcome changes are recorded. Synthetic actors, artifacts, receipts, and transitions remain outside the evidence and publication ledgers; release remains distinct from publication, exact artifacts remain digest-bound, and withdrawal or rollback cannot erase history or alter evidence state. The Phase 57Q package awaits exact-source commit and owner-only deployment. Sites version 72 continues to serve the exact Phase 57P package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57Q manifest at ${manifestPath}`);
