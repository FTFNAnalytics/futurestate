import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "publication-status-change-notices-restore-republication-provenance-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57r-publication-status-change-notices-restore-republication-provenance.json"), "utf8"));
const archiveBuffer = await readFile(archivePath);
const archiveSha256 = createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57r", "npm run verify:phase57r"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57r", "npm run verify:phase57r");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 3011,
  signals: 992,
  published_signals: 768,
  in_review_signals: 224,
  draft_sample_signals: 0,
  published_support_sources: 498,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 56,
  published_briefings: 49,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 53,
  research_documents: 1108,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 72,
  public_json_exports: 5,
  research_export_records: 956,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2829,
  signals_added: 974,
  published_signals_added: 765,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57Q evidence baseline with Phase 57R reader-facing publication-status registries, immutable change notices, new-authority restore and republication receipts, and complete provenance timelines: 715 public sources, 992 signals, 768 Published signals, five local systems, forty-nine Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 72 public updates, fifty-three research collections, 1,108 summarized research documents, 956 research export records, and five versioned public-data exports.",
};

manifest.phase_57r_delta = {
  publication_status_and_provenance_records_reviewed: 45,
  records_added_published: 36,
  records_held_in_review: 9,
  contract_specific_controls_published: 36,
  controls_per_contract: 4,
  publication_status_registries: 9,
  immutable_change_notice_schemas: 9,
  restore_republication_schemas: 9,
  total_contract_specific_schemas: 27,
  publication_status_cases: 126,
  valid_derived_status_routes: 54,
  rejected_status_routes: 72,
  immutable_change_notice_cases: 126,
  valid_change_notice_routes: 54,
  rejected_change_notice_routes: 72,
  restore_republication_provenance_cases: 144,
  valid_or_history_preservation_restore_routes: 54,
  rejected_restore_routes: 90,
  total_workflow_cases: 396,
  workflow_test_failures: 0,
  actual_publication_statuses: 0,
  actual_change_notices: 0,
  actual_restore_actors: 0,
  actual_restore_authorizations: 0,
  actual_restorations: 0,
  actual_republications: 0,
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
  phase_57q_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_status_registries_added: 1,
  structured_notice_registries_added: 1,
  structured_restore_provenance_registries_added: 1,
  research_documents_added_published: 36,
  research_documents_added_in_review: 9,
  signals_added_published: 36,
  signals_added_in_review: 9,
  downloadable_records: 45,
  archive_file_count: 48,
  archive_bytes: archiveBuffer.length,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 92,
  deployment_status: "pending_exact_source_commit_and_owner_only_deployment_phase-57q-version-73-remains-live",
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-992-signals-1108-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 3011,
  release_assertions: "passed-phase-57r",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57r-visual-qa-not-requested",
  preview_qa: "phase-57r-owner-only-deployment-pending-exact-source-commit; phase-57q-owner-only-sites-version-73-remains-live-and-verified",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-048-publication-status-change-notices-provenance/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-048-publication-status-change-notices-provenance/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, ["/briefings/research-watch-048-publication-status-change-notices-provenance/"]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 3,011 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 768 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-eight|48|forty-nine|49) Published briefing URLs/.test(gate)) return "Confirm all forty-nine Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 72-entry public update log renders";
  if (/^Confirm all (fifty-two|52|fifty-three|53) research collections/.test(gate)) return "Confirm all fifty-three research collections render 1,108 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57R contains forty-five unique records: thirty-six contract-specific publication-status, immutable-notice, restore, republication, provenance, and zero-state-inflation controls plus nine preserved holds",
  "Confirm Phase 57R publishes thirty-six bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57Q holds exactly once, and adds no new hold",
  "Confirm nine reader-facing publication-status registries pass 126 cases, derive fifty-four valid lifecycle views only from complete append-only history, and reject seventy-two missing, duplicate, stale, truncated, mutated, premature, automated, or state-inflating fixtures",
  "Confirm nine immutable change-notice schemas pass 126 cases, bind fifty-four valid notices to controlling events, receipts, event digests, and bundle digests, and reject seventy-two mismatched, incomplete, rewritten, or state-inflating fixtures",
  "Confirm nine restore and republication schemas pass 144 cases, require new human authorization and new exact bundle digests, preserve every earlier state, and reject ninety stale-authority, stale-bundle, actor, target, identifier, chronology, history, automation, evidence, or closure attacks",
  "Confirm Phase 57R records zero actual statuses, notices, restore actors, restore authorizations, restorations, republications, triggers, closures, or operating-outcome changes",
  "Confirm Phase 57R preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, attribution, or operating-outcome promotions",
  "Confirm the Phase 57R collection contains forty-five official-link records backed by thirty-six carried Tier 1 sources and a forty-eight-file archive",
]);

manifest.notes = "This manifest records the locally release-validated Phase 57R reader-facing publication-status, immutable-change-notice, restoration, republication, and provenance expansion. Thirty-six carried Tier 1 sources support thirty-six Published contract-specific controls, nine preserved In Review holds, nine status registries, nine notice schemas, nine restore schemas, 396 executable cases, Research Watch 048, one collection, one update, and a forty-eight-file archive. Current availability derives only from complete append-only history; every notice binds its controlling event and receipt; restoration or republication requires a new named human authorization and new exact bundle digest. Zero actual statuses, notices, actors, authorizations, restorations, republications, triggers, closures, or operating-outcome changes are recorded. Synthetic displays, receipts, and transitions remain outside the evidence and publication ledgers and cannot hide prior states or alter claim state. The Phase 57R package awaits exact-source commit and owner-only deployment. Sites version 73 continues to serve the exact Phase 57Q package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57R manifest at ${manifestPath}; archive ${archiveBuffer.length} bytes, SHA-256 ${archiveSha256}`);
