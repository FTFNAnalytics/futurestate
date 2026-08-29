import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "canonical-verification-endpoints-signed-release-indexes-cache-mirror-recovery-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57t-canonical-endpoints-signed-indexes-cache-mirror-recovery.json"), "utf8"));
const archiveBuffer = await readFile(archivePath);
const archiveSha256 = createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedSignalSlugs = ledger.records.filter((record) => record.record_status === "Published").map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57t", "npm run verify:phase57t"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57t", "npm run verify:phase57t");

manifest.expected_build = { ...manifest.expected_build, static_pages: 3213, signals: 1091, published_signals: 849, in_review_signals: 242, draft_sample_signals: 0,
  published_support_sources: 498, sources: 715, topics: 17, organizations: 19, technologies: 5, local_systems: 5, briefings: 58, published_briefings: 51, in_review_briefings: 7,
  evidence_gaps: 16, dependency_maps: 7, published_dependency_maps: 6, in_review_dependency_maps: 1, research_collections: 55, research_documents: 1207, reader_pathways: 15,
  published_reader_pathways: 11, reader_pathway_surfaces: 19, phase_55q_gap_decisions: 4, updates: 74, public_json_exports: 5, research_export_records: 1039, pathway_export_records: 11 };

manifest.release_delta_from_v0_1_1 = { ...manifest.release_delta_from_v0_1_1, static_pages_added: 3031, signals_added: 1073, published_signals_added: 846, sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57S evidence baseline with Phase 57T canonical reader-verification endpoints, signed append-only release indexes, fail-closed cache coherence, mirror and redirect integrity, and immutable-source recovery drills: 715 public sources, 1,091 signals, 849 Published signals, five local systems, fifty-one Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 74 public updates, fifty-five research collections, 1,207 summarized research documents, 1,039 research export records, and five versioned public-data exports." };

manifest.phase_57t_delta = {
  canonical_delivery_records_reviewed: 54, records_added_published: 45, records_held_in_review: 9, contract_specific_controls_published: 45, controls_per_contract: 5,
  canonical_endpoint_schemas: 9, signed_release_index_schemas: 9, cache_coherence_schemas: 9, mirror_redirect_integrity_schemas: 9, recovery_drill_schemas: 9, total_contract_specific_schemas: 45,
  canonical_endpoint_cases: 162, valid_endpoint_routes: 54, rejected_endpoint_routes: 108, signed_release_index_cases: 162, valid_index_routes: 54, rejected_index_routes: 108,
  cache_coherence_cases: 162, valid_cache_routes: 45, rejected_cache_routes: 117, mirror_redirect_cases: 162, valid_mirror_routes: 45, rejected_mirror_routes: 117,
  recovery_drill_cases: 180, valid_recovery_routes: 54, rejected_recovery_routes: 126, total_workflow_cases: 828, workflow_test_failures: 0,
  actual_endpoints_published: 0, actual_release_indexes_signed: 0, actual_cache_receipts_created: 0, actual_mirror_or_redirect_events: 0, actual_recovery_drills_executed: 0,
  actual_reader_state_changes: 0, eligible_records_accepted: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, operating_outcomes_ingested: 0,
  exact_target_artifacts_acquired: 0, public_agency_contacts_or_foia_requests: 0, directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0,
  attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0, current_closure_states_closed: 1, current_closure_states_partially_closed: 21,
  current_closure_states_open: 2, phase_57s_holds_preserved: 9, new_visible_holds: 0, official_source_profiles_added: 0, official_source_profiles_reused: 36,
  structured_endpoint_registries_added: 1, structured_signed_index_registries_added: 1, structured_cache_registries_added: 1, structured_mirror_registries_added: 1, structured_recovery_registries_added: 1,
  research_documents_added_published: 45, research_documents_added_in_review: 9, signals_added_published: 45, signals_added_in_review: 9, downloadable_records: 54,
  archive_file_count: 57, archive_bytes: archiveBuffer.length, archive_sha256: archiveSha256, briefings_added_published: 1, reader_pathways_deepened: 3, topics_deepened: 5,
  dependency_maps_deepened: 1, public_update_entries_added: 1, generated_pages_added: 110,
  deployment_status: "pending_exact_source_commit_and_owner_only_deployment_phase-57s-version-75-remains-live",
};

manifest.last_verified = { ...manifest.last_verified, date: capturedDate, published_support_minimum_date: "2026-07-22", validate_content: "passed-715-sources-1091-signals-1207-research-documents",
  source_health: "passed", source_health_manual_review: 494, source_health_probe_ready: 221, source_monitor_current: 715, astro_check: "passed", build: "passed", static_pages_built: 3213,
  release_assertions: "passed-phase-57t", browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57t-visual-qa-not-requested",
  preview_qa: "phase-57t-owner-only-deployment-pending-exact-source-commit; phase-57s-owner-only-sites-version-75-remains-live-and-verified" };

manifest.required_output_files = addUnique(manifest.required_output_files, [`dist/research/${archiveSlug}/index.html`, `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-050-canonical-verification-delivery-and-recovery/index.html", ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`)]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [`/research/${archiveSlug}/`, `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-050-canonical-verification-delivery-and-recovery/", ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`)]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, ["/briefings/research-watch-050-canonical-verification-delivery-and-recovery/"]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 3,213 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 849 Published signal URLs are present in the sitemap";
  if (/^Confirm all (fifty|50|fifty-one|51) Published briefing URLs/.test(gate)) return "Confirm all fifty-one Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 74-entry public update log renders";
  if (/^Confirm all (fifty-four|54|fifty-five|55) research collections/.test(gate)) return "Confirm all fifty-five research collections render 1,207 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57T contains fifty-four unique records: forty-five contract-specific canonical-endpoint, signed-index, cache, mirror, redirect, recovery, and zero-state-inflation controls plus nine preserved holds",
  "Confirm Phase 57T publishes forty-five bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57S holds exactly once, and adds no new hold",
  "Confirm nine canonical endpoint schemas pass 162 cases, verify fifty-four exact current-bundle routes, and reject 108 origin, URI, method, representation, digest, publication, or evidence-inflation fixtures",
  "Confirm nine signed release-index schemas pass 162 cases, preserve fifty-four signature, bundle, key, and prior-index routes, and reject 108 signature, sequence, chain, substitution, erasure, publication, or evidence-inflation fixtures",
  "Confirm nine cache-coherence schemas pass 162 cases, verify forty-five coherent routes, and fail 117 stale entity-tag, manifest, export, index, time, revalidation, partition, transform, automation, or evidence routes closed",
  "Confirm nine mirror and redirect schemas pass 162 cases, verify forty-five exact representation, canonical, redirect, hop, and transport routes, and reject 117 drift, downgrade, injection, loop, temporary, transform, publication, or evidence routes",
  "Confirm nine immutable-source recovery schemas pass 180 cases, preserve fifty-four complete reconstruction routes, and reject 126 missing, mutable, mismatched, rewriting, activating, publishing, or closing fixtures",
  "Confirm Phase 57T records zero actual endpoints, signatures, cache receipts, mirror or redirect events, recovery drills, reader-state changes, triggers, publications, closures, or operating-outcome changes",
  "Confirm Phase 57T preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, attribution, or operating-outcome promotions",
  "Confirm the Phase 57T collection contains fifty-four official-link records backed by thirty-six carried Tier 1 sources and a fifty-seven-file archive",
]);

manifest.notes = "This manifest records the locally release-validated Phase 57T canonical reader-verification endpoint, signed release-index, fail-closed cache-coherence, mirror and redirect integrity, and immutable-source recovery expansion. Thirty-six carried Tier 1 sources support forty-five Published contract-specific controls, nine preserved In Review holds, forty-five schemas, 828 executable cases, Research Watch 050, one collection, one update, and a fifty-seven-file archive. Stable URIs bind exact current manifest, export, signed-index, representation, and entity-tag digests; stale delivery fails closed; mirrors and redirects cannot drift or downgrade; recovery reconstructs inactive reader state only from immutable source history. Zero actual endpoints, signatures, cache receipts, mirror or redirect events, recovery drills, reader-state changes, triggers, publications, closures, or operating-outcome changes are recorded. The Phase 57T package awaits exact-source commit and owner-only deployment. Sites version 75 continues to serve the exact Phase 57S package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57T manifest at ${manifestPath}; archive ${archiveBuffer.length} bytes, SHA-256 ${archiveSha256}`);
