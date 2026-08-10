
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-10";
const archiveSlug = "threshold-authorization-witness-gossip-trusted-time-verifier-diversity-compromise-recovery-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57v-threshold-witness-gossip-time-verifiers-compromise-recovery.json"), "utf8"));
const archiveBuffer = await readFile(archivePath);
const archiveSha256 = createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedSignalSlugs = ledger.records.filter((record) => record.record_status === "Published").map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57v", "npm run verify:phase57v"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57v", "npm run verify:phase57v");

manifest.expected_build = { ...manifest.expected_build, static_pages: 3469, signals: 1217, published_signals: 957, in_review_signals: 260, draft_sample_signals: 0,
  published_support_sources: 498, sources: 715, topics: 17, organizations: 19, technologies: 5, local_systems: 5, briefings: 60, published_briefings: 53, in_review_briefings: 7,
  evidence_gaps: 16, dependency_maps: 7, published_dependency_maps: 6, in_review_dependency_maps: 1, research_collections: 57, research_documents: 1333, reader_pathways: 15,
  published_reader_pathways: 11, reader_pathway_surfaces: 19, phase_55q_gap_decisions: 4, updates: 76, public_json_exports: 5, research_export_records: 1149, pathway_export_records: 11 };

manifest.release_delta_from_v0_1_1 = { ...manifest.release_delta_from_v0_1_1, static_pages_added: 3287, signals_added: 1199, published_signals_added: 954, sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57U evidence baseline with Phase 57V threshold release authorization, independent witness checkpoints, cross-log gossip, monotonic trusted time, three-implementation verifier conformance, and algorithm and key-compromise recovery: 715 public sources, 1,217 signals, 957 Published signals, five local systems, fifty-three Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 76 public updates, fifty-seven research collections, 1,333 summarized research documents, 1,149 research export records, and five versioned public-data exports." };

manifest.phase_57v_delta = {
  federated_trust_records_reviewed: 63, records_added_published: 54, records_held_in_review: 9, contract_specific_controls_published: 54, controls_per_contract: 6,
  threshold_schemas: 9, witness_schemas: 9, gossip_schemas: 9, trusted_time_schemas: 9, verifier_schemas: 9, compromise_recovery_schemas: 9, total_contract_specific_schemas: 54,
  threshold_cases: 225, valid_threshold_routes: 63, rejected_threshold_routes: 162, witness_cases: 216, valid_witness_routes: 63, rejected_witness_routes: 153,
  gossip_cases: 198, valid_gossip_routes: 54, rejected_gossip_routes: 144, trusted_time_cases: 207, valid_trusted_time_routes: 54, rejected_trusted_time_routes: 153,
  verifier_cases: 216, valid_verifier_routes: 63, rejected_verifier_routes: 153, compromise_recovery_cases: 234, valid_compromise_recovery_routes: 63, rejected_compromise_recovery_routes: 171,
  total_workflow_cases: 1296, valid_or_preservation_routes: 360, rejected_routes: 936, workflow_test_failures: 0,
  actual_threshold_shares: 0, actual_witness_signatures: 0, actual_checkpoints: 0, actual_gossip_messages: 0, actual_time_receipts: 0, actual_verifier_runs: 0, actual_compromise_events: 0, actual_recovery_actions: 0, actual_algorithm_migrations: 0,
  actual_reader_state_changes: 0, eligible_records_accepted: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, operating_outcomes_ingested: 0,
  exact_target_artifacts_acquired: 0, public_agency_contacts_or_foia_requests: 0, directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0,
  attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0, current_closure_states_closed: 1, current_closure_states_partially_closed: 21,
  current_closure_states_open: 2, phase_57u_holds_preserved: 9, new_visible_holds: 0, official_source_profiles_added: 0, official_source_profiles_reused: 36,
  structured_threshold_registries_added: 1, structured_witness_registries_added: 1, structured_gossip_registries_added: 1, structured_trusted_time_registries_added: 1, structured_verifier_registries_added: 1, structured_compromise_recovery_registries_added: 1,
  research_documents_added_published: 54, research_documents_added_in_review: 9, signals_added_published: 54, signals_added_in_review: 9, downloadable_records: 63,
  archive_file_count: 66, archive_bytes: archiveBuffer.length, archive_sha256: archiveSha256, briefings_added_published: 1, reader_pathways_deepened: 3, topics_deepened: 5,
  dependency_maps_deepened: 1, public_update_entries_added: 1, generated_pages_added: 128,
  deployment_status: "pending_exact_source_commit_and_owner_only_deployment_phase-57u-version-77-remains-live",
};

manifest.last_verified = { ...manifest.last_verified, date: capturedDate, published_support_minimum_date: "2026-07-22", validate_content: "passed-715-sources-1217-signals-1333-research-documents",
  source_health: "passed", source_health_manual_review: 494, source_health_probe_ready: 221, source_monitor_current: 715, astro_check: "passed", build: "passed", static_pages_built: 3469,
  release_assertions: "passed-phase-57v", browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57v-visual-qa-not-requested",
  preview_qa: "phase-57v-owner-only-deployment-pending-exact-source-commit; phase-57u-owner-only-sites-version-77-remains-live-and-verified" };

manifest.required_output_files = addUnique(manifest.required_output_files, [`dist/research/${archiveSlug}/index.html`, `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-052-threshold-trust-and-compromise-recovery/index.html", ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`)]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [`/research/${archiveSlug}/`, `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-052-threshold-trust-and-compromise-recovery/", ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`)]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, ["/briefings/research-watch-052-threshold-trust-and-compromise-recovery/"]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 3,469 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 957 Published signal URLs are present in the sitemap";
  if (/^Confirm all (fifty-one|51|fifty-two|52|fifty-three|53) Published briefing URLs/.test(gate)) return "Confirm all fifty-three Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 76-entry public update log renders";
  if (/^Confirm all (fifty-five|55|fifty-six|56|fifty-seven|57) research collections/.test(gate)) return "Confirm all fifty-seven research collections render 1,333 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57V contains sixty-three unique records: fifty-four contract-specific threshold, witness, gossip, trusted-time, verifier-diversity, compromise-recovery, and zero-state-inflation controls plus nine preserved holds",
  "Confirm Phase 57V publishes fifty-four bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57U holds exactly once, and adds no new hold",
  "Confirm nine threshold schemas pass 225 cases, verify sixty-three three-of-five, actor-separated, domain-separated, digest-bound, role-bound, surplus-share, and nonpublishing routes, and reject 162 deficient, duplicated, unknown, invalid, replayed, rewritten, publication, closure, or evidence fixtures",
  "Confirm nine witness schemas pass 216 cases, preserve sixty-three independent-threshold, operator, domain, digest, lineage, tree, and release routes, and reject 153 insufficient, duplicated, conflicted, invalid, regressive, unknown, revoked, rewritten, activation, publication, closure, or evidence fixtures",
  "Confirm nine gossip schemas pass 198 cases, verify fifty-four three-log, checkpoint, tree-root, tree-size, peer-exchange, and split-view-detection routes, and reject 144 missing, stale, divergent, unknown, replayed, majority-substituting, overriding, rewriting, activation, publication, closure, or evidence fixtures",
  "Confirm nine trusted-time schemas pass 207 cases, verify fifty-four monotonic-time, counter, lineage, independent-authority, release, and checkpoint routes, and reject 153 regressive, reused, missing, mismatched, conflicted, invalid, skewed, stale, rewritten, publication, closure, or evidence fixtures",
  "Confirm nine verifier schemas pass 216 cases, preserve sixty-three implementation, codebase, operator, artifact, decision, result, and replay routes, and reject 153 insufficient, duplicated, shared, divergent, nonconforming, unknown, revoked, nondeterministic, majority-substituting, rewriting, activation, publication, closure, or evidence fixtures",
  "Confirm nine compromise-recovery schemas pass 234 cases, preserve sixty-three declaration, freeze, revocation, migration, replacement, independent-reverification, and inactive-state routes, and reject 171 incomplete, reused, unauthorized, unwitnessed, untimed, retroactively trusting, rewriting, activating, replayed, backdated, publication, closure, or evidence fixtures",
  "Confirm Phase 57V records zero production threshold shares, witness signatures, checkpoints, gossip messages, time receipts, verifier runs, compromise events, recovery actions, algorithm migrations, reader-state changes, triggers, publications, closures, or operating-outcome changes",
  "Confirm Phase 57V preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, attribution, or operating-outcome promotions",
  "Confirm the Phase 57V collection contains sixty-three official-link records backed by thirty-six carried Tier 1 sources and a sixty-six-file archive",
]);

manifest.notes = "This manifest records the locally release-validated Phase 57V threshold-authorization, independent-witness, cross-log-gossip, trusted-time, verifier-diversity, and compromise-recovery expansion. Thirty-six carried Tier 1 sources support fifty-four Published contract-specific controls, nine preserved In Review holds, fifty-four schemas, 1,296 executable cases, Research Watch 052, one collection, one update, and a sixty-six-file archive. Same-actor or same-domain quorum, unwitnessed checkpoints, split views, time rollback, verifier divergence, and retroactive trust in compromised-key artifacts fail closed; reconstructed state remains inactive. Zero production threshold shares, witness signatures, checkpoints, gossip messages, time receipts, verifier runs, compromise events, recovery actions, algorithm migrations, reader-state changes, triggers, publications, closures, or operating-outcome changes are recorded. The Phase 57V package awaits exact-source commit and owner-only deployment. Sites version 77 continues to serve the exact Phase 57U package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57V manifest at ${manifestPath}; archive ${archiveBuffer.length} bytes, SHA-256 ${archiveSha256}`);
