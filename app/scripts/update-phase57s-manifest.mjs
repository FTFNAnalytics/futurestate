import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "reader-verifiable-lifecycle-manifests-stale-view-provenance-exports-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57s-reader-verification-freshness-provenance-exports-digest-reconciliation.json"), "utf8"));
const archiveBuffer = await readFile(archivePath);
const archiveSha256 = createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedSignalSlugs = ledger.records.filter((record) => record.record_status === "Published").map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57s", "npm run verify:phase57s"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57s", "npm run verify:phase57s");

manifest.expected_build = { ...manifest.expected_build, static_pages: 3103, signals: 1037, published_signals: 804, in_review_signals: 233, draft_sample_signals: 0,
  published_support_sources: 498, sources: 715, topics: 17, organizations: 19, technologies: 5, local_systems: 5, briefings: 57, published_briefings: 50, in_review_briefings: 7,
  evidence_gaps: 16, dependency_maps: 7, published_dependency_maps: 6, in_review_dependency_maps: 1, research_collections: 54, research_documents: 1153, reader_pathways: 15,
  published_reader_pathways: 11, reader_pathway_surfaces: 19, phase_55q_gap_decisions: 4, updates: 73, public_json_exports: 5, research_export_records: 993, pathway_export_records: 11 };

manifest.release_delta_from_v0_1_1 = { ...manifest.release_delta_from_v0_1_1, static_pages_added: 2921, signals_added: 1019, published_signals_added: 801, sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57R evidence baseline with Phase 57S reader-verifiable lifecycle manifests, fail-closed status freshness, immutable provenance exports, and append-only digest-chain reconciliation: 715 public sources, 1,037 signals, 804 Published signals, five local systems, fifty Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 73 public updates, fifty-four research collections, 1,153 summarized research documents, 993 research export records, and five versioned public-data exports." };

manifest.phase_57s_delta = {
  reader_verification_records_reviewed: 45, records_added_published: 36, records_held_in_review: 9, contract_specific_controls_published: 36, controls_per_contract: 4,
  lifecycle_manifest_schemas: 9, status_freshness_schemas: 9, provenance_export_reconciliation_schemas: 9, total_contract_specific_schemas: 27,
  lifecycle_manifest_cases: 144, valid_manifest_routes: 45, rejected_manifest_routes: 99, status_freshness_cases: 144, valid_freshness_routes: 36, rejected_stale_or_partial_routes: 108,
  provenance_export_reconciliation_cases: 162, valid_or_preservation_export_routes: 54, rejected_export_or_reconciliation_routes: 108, total_workflow_cases: 450, workflow_test_failures: 0,
  actual_lifecycle_manifests: 0, actual_status_verifications: 0, actual_provenance_exports: 0, actual_reconciliation_receipts: 0, eligible_records_accepted: 0, reopening_triggers_fired: 0,
  automated_closures_or_publications: 0, operating_outcomes_ingested: 0, exact_target_artifacts_acquired: 0, public_agency_contacts_or_foia_requests: 0, directive_scope_changes: 0,
  implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0,
  current_closure_states_closed: 1, current_closure_states_partially_closed: 21, current_closure_states_open: 2, phase_57r_holds_preserved: 9, new_visible_holds: 0,
  official_source_profiles_added: 0, official_source_profiles_reused: 36, structured_manifest_registries_added: 1, structured_freshness_registries_added: 1,
  structured_export_reconciliation_registries_added: 1, research_documents_added_published: 36, research_documents_added_in_review: 9, signals_added_published: 36, signals_added_in_review: 9,
  downloadable_records: 45, archive_file_count: 48, archive_bytes: archiveBuffer.length, archive_sha256: archiveSha256, briefings_added_published: 1, reader_pathways_deepened: 3,
  topics_deepened: 5, dependency_maps_deepened: 1, public_update_entries_added: 1, generated_pages_added: 92,
  deployment_status: "pending_exact_source_commit_and_owner_only_deployment_phase-57r-version-74-remains-live",
};

manifest.last_verified = { ...manifest.last_verified, date: capturedDate, published_support_minimum_date: "2026-07-22", validate_content: "passed-715-sources-1037-signals-1153-research-documents",
  source_health: "passed", source_health_manual_review: 494, source_health_probe_ready: 221, source_monitor_current: 715, astro_check: "passed", build: "passed", static_pages_built: 3103,
  release_assertions: "passed-phase-57s", browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57s-visual-qa-not-requested",
  preview_qa: "phase-57s-owner-only-deployment-pending-exact-source-commit; phase-57r-owner-only-sites-version-74-remains-live-and-verified" };

manifest.required_output_files = addUnique(manifest.required_output_files, [`dist/research/${archiveSlug}/index.html`, `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-049-reader-verification-status-freshness-provenance-exports/index.html", ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`)]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [`/research/${archiveSlug}/`, `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-049-reader-verification-status-freshness-provenance-exports/", ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`)]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, ["/briefings/research-watch-049-reader-verification-status-freshness-provenance-exports/"]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 3,103 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 804 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-nine|49|fifty|50) Published briefing URLs/.test(gate)) return "Confirm all fifty Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 73-entry public update log renders";
  if (/^Confirm all (fifty-three|53|fifty-four|54) research collections/.test(gate)) return "Confirm all fifty-four research collections render 1,153 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57S contains forty-five unique records: thirty-six contract-specific reader-verification, freshness, provenance-export, reconciliation, and zero-rewrite controls plus nine preserved holds",
  "Confirm Phase 57S publishes thirty-six bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57R holds exactly once, and adds no new hold",
  "Confirm nine reader-verifiable lifecycle-manifest schemas pass 144 cases, verify forty-five complete or integrity-preserving routes, and reject ninety-nine incomplete, duplicate, regressive, chain-broken, notice-drifting, rewriting, or state-inflating fixtures",
  "Confirm nine status-freshness schemas pass 144 cases, verify thirty-six complete current views, and fail 108 stale, partial, mismatched, unverified, warning-only, automated, or evidence-inflating views closed",
  "Confirm nine provenance-export and reconciliation schemas pass 162 cases, preserve fifty-four complete history, notice, manifest, chain, or mismatch-receipt routes, and reject 108 scope, digest, count, binding, rewrite, automation, evidence, or closure attacks",
  "Confirm Phase 57S records zero actual manifests, verifications, exports, reconciliation receipts, triggers, closures, or operating-outcome changes",
  "Confirm Phase 57S preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, attribution, or operating-outcome promotions",
  "Confirm the Phase 57S collection contains forty-five official-link records backed by thirty-six carried Tier 1 sources and a forty-eight-file archive",
]);

manifest.notes = "This manifest records the locally release-validated Phase 57S reader-verifiable lifecycle-manifest, fail-closed status-freshness, immutable provenance-export, and digest-chain reconciliation expansion. Thirty-six carried Tier 1 sources support thirty-six Published contract-specific controls, nine preserved In Review holds, nine manifest schemas, nine freshness schemas, nine export schemas, 450 executable cases, Research Watch 049, one collection, one update, and a forty-eight-file archive. Complete history and immutable notices remain source-of-truth; stale or partial views fail closed; exports preserve every earlier state; reconciliation appends mismatch receipts and never rewrites evidence, lifecycle history, or claim state. Zero actual manifests, verifications, exports, reconciliation receipts, triggers, closures, or operating-outcome changes are recorded. The Phase 57S package awaits exact-source commit and owner-only deployment. Sites version 74 continues to serve the exact Phase 57R package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57S manifest at ${manifestPath}; archive ${archiveBuffer.length} bytes, SHA-256 ${archiveSha256}`);
