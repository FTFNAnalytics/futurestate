import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "governed-keys-transparency-multi-origin-incidents-recovery-objectives-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57u-governed-keys-transparency-origins-incidents-recovery.json"), "utf8"));
const archiveBuffer = await readFile(archivePath);
const archiveSha256 = createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedSignalSlugs = ledger.records.filter((record) => record.record_status === "Published").map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57u", "npm run verify:phase57u"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57u", "npm run verify:phase57u");

manifest.expected_build = { ...manifest.expected_build, static_pages: 3341, signals: 1154, published_signals: 903, in_review_signals: 251, draft_sample_signals: 0,
  published_support_sources: 498, sources: 715, topics: 17, organizations: 19, technologies: 5, local_systems: 5, briefings: 59, published_briefings: 52, in_review_briefings: 7,
  evidence_gaps: 16, dependency_maps: 7, published_dependency_maps: 6, in_review_dependency_maps: 1, research_collections: 56, research_documents: 1270, reader_pathways: 15,
  published_reader_pathways: 11, reader_pathway_surfaces: 19, phase_55q_gap_decisions: 4, updates: 75, public_json_exports: 5, research_export_records: 1094, pathway_export_records: 11 };

manifest.release_delta_from_v0_1_1 = { ...manifest.release_delta_from_v0_1_1, static_pages_added: 3159, signals_added: 1136, published_signals_added: 900, sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57T evidence baseline with Phase 57U governed verification keys, append-only activation, rotation, expiry, and revocation receipts, transparency-log inclusion and consistency proofs, exact multi-origin consistency, incident containment, and measured recovery objectives: 715 public sources, 1,154 signals, 903 Published signals, five local systems, fifty-two Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 75 public updates, fifty-six research collections, 1,270 summarized research documents, 1,094 research export records, and five versioned public-data exports." };

manifest.phase_57u_delta = {
  governed_trust_records_reviewed: 63, records_added_published: 54, records_held_in_review: 9, contract_specific_controls_published: 54, controls_per_contract: 6,
  key_registry_schemas: 9, key_lifecycle_schemas: 9, transparency_schemas: 9, multi_origin_schemas: 9, incident_schemas: 9, recovery_objective_schemas: 9, total_contract_specific_schemas: 54,
  key_registry_cases: 180, valid_key_routes: 54, rejected_key_routes: 126, key_lifecycle_cases: 198, valid_lifecycle_routes: 63, rejected_lifecycle_routes: 135,
  transparency_cases: 198, valid_transparency_routes: 63, rejected_transparency_routes: 135, multi_origin_cases: 180, valid_origin_routes: 45, rejected_origin_routes: 135,
  incident_cases: 198, valid_incident_routes: 54, rejected_incident_routes: 144, recovery_objective_cases: 216, valid_recovery_objective_routes: 63, rejected_recovery_objective_routes: 153,
  total_workflow_cases: 1170, valid_or_preservation_routes: 342, rejected_routes: 828, workflow_test_failures: 0,
  actual_key_events: 0, actual_signatures: 0, actual_log_entries: 0, actual_origin_observations: 0, actual_incidents: 0, actual_receipts: 0, actual_replays: 0, actual_recovery_drills: 0,
  actual_reader_state_changes: 0, eligible_records_accepted: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, operating_outcomes_ingested: 0,
  exact_target_artifacts_acquired: 0, public_agency_contacts_or_foia_requests: 0, directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0,
  attribution_changes: 0, operating_outcome_changes: 0, inherited_entity_ledger_closure_changes: 0, current_closure_states_closed: 1, current_closure_states_partially_closed: 21,
  current_closure_states_open: 2, phase_57t_holds_preserved: 9, new_visible_holds: 0, official_source_profiles_added: 0, official_source_profiles_reused: 36,
  structured_key_registries_added: 1, structured_lifecycle_registries_added: 1, structured_transparency_registries_added: 1, structured_origin_registries_added: 1, structured_incident_registries_added: 1, structured_recovery_objective_registries_added: 1,
  research_documents_added_published: 54, research_documents_added_in_review: 9, signals_added_published: 54, signals_added_in_review: 9, downloadable_records: 63,
  archive_file_count: 66, archive_bytes: archiveBuffer.length, archive_sha256: archiveSha256, briefings_added_published: 1, reader_pathways_deepened: 3, topics_deepened: 5,
  dependency_maps_deepened: 1, public_update_entries_added: 1, generated_pages_added: 128,
  deployment_status: "pending_exact_source_commit_and_owner_only_deployment_phase-57t-version-76-remains-live",
};

manifest.last_verified = { ...manifest.last_verified, date: capturedDate, published_support_minimum_date: "2026-07-22", validate_content: "passed-715-sources-1154-signals-1270-research-documents",
  source_health: "passed", source_health_manual_review: 494, source_health_probe_ready: 221, source_monitor_current: 715, astro_check: "passed", build: "passed", static_pages_built: 3341,
  release_assertions: "passed-phase-57u", browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57u-visual-qa-not-requested",
  preview_qa: "phase-57u-owner-only-deployment-pending-exact-source-commit; phase-57t-owner-only-sites-version-76-remains-live-and-verified" };

manifest.required_output_files = addUnique(manifest.required_output_files, [`dist/research/${archiveSlug}/index.html`, `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-051-governed-keys-transparency-and-incident-recovery/index.html", ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`)]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [`/research/${archiveSlug}/`, `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-051-governed-keys-transparency-and-incident-recovery/", ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`)]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, ["/briefings/research-watch-051-governed-keys-transparency-and-incident-recovery/"]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 3,341 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 903 Published signal URLs are present in the sitemap";
  if (/^Confirm all (fifty-one|51|fifty-two|52) Published briefing URLs/.test(gate)) return "Confirm all fifty-two Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 75-entry public update log renders";
  if (/^Confirm all (fifty-five|55|fifty-six|56) research collections/.test(gate)) return "Confirm all fifty-six research collections render 1,270 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57U contains sixty-three unique records: fifty-four contract-specific governed-key, lifecycle, transparency, multi-origin, incident, recovery-objective, and zero-state-inflation controls plus nine preserved holds",
  "Confirm Phase 57U publishes fifty-four bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57T holds exactly once, and adds no new hold",
  "Confirm nine governed key registries pass 180 cases, verify fifty-four active-key, role-separation, validity, staging, and history routes, and reject 126 unknown, expired, revoked, ambiguous, conflicting, downgraded, rewriting, publication, or evidence-inflation fixtures",
  "Confirm nine key-lifecycle schemas pass 198 cases, preserve sixty-three activation, rotation, expiry, revocation, lineage, registry, and authority routes, and reject 135 sequence, lineage, signature, authority, overlap, erasure, publication, closure, or evidence fixtures",
  "Confirm nine transparency schemas pass 198 cases, preserve sixty-three inclusion, root, consistency, growth, and prior-tree routes, and reject 135 missing, mismatched, regressive, truncated, replaced, reordered, split-view, publication, rewrite, or evidence fixtures",
  "Confirm nine multi-origin schemas pass 180 cases, verify forty-five exact canonical, mirror, archive, and observation-time routes, and fail 135 missing, stale, divergent, majority-substituting, promoting, publication, closure, or evidence routes closed",
  "Confirm nine incident schemas pass 198 cases, verify fifty-four declaration, containment, chronology, command, log-preservation, and inactive-reader routes, and reject 144 incomplete, regressive, unauthorized, mutable, undeclared, overriding, publication, closure, or evidence fixtures",
  "Confirm nine recovery-objective schemas pass 216 cases, preserve sixty-three RPO, RTO, immutable-history, telemetry, receipt, inactive-state, and margin routes, and reject 153 missing, negative, missed, mutable, rewriting, activating, backdated, substituted, publication, or evidence fixtures",
  "Confirm Phase 57U records zero production keys, signatures, log entries, origin observations, incidents, receipts, replays, recovery drills, reader-state changes, triggers, publications, closures, or operating-outcome changes",
  "Confirm Phase 57U preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, attribution, or operating-outcome promotions",
  "Confirm the Phase 57U collection contains sixty-three official-link records backed by thirty-six carried Tier 1 sources and a sixty-six-file archive",
]);

manifest.notes = "This manifest records the locally release-validated Phase 57U governed verification-key, append-only key-lifecycle, transparency-proof, exact multi-origin, incident-containment, and recovery-objective expansion. Thirty-six carried Tier 1 sources support fifty-four Published contract-specific controls, nine preserved In Review holds, fifty-four schemas, 1,170 executable cases, Research Watch 051, one collection, one update, and a sixty-six-file archive. Unknown, expired, revoked, staged, ambiguous, or role-conflicted keys fail closed; current and prior indexes remain in append-only transparency trees; canonical, mirror, and archive observations must agree without voting; incomplete incident containment and missed RPO or RTO objectives fail closed; reconstructed state remains inactive. Zero production keys, signatures, logs, observations, incidents, receipts, recoveries, reader-state changes, triggers, publications, closures, or operating-outcome changes are recorded. The Phase 57U package awaits exact-source commit and owner-only deployment. Sites version 76 continues to serve the exact Phase 57T package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57U manifest at ${manifestPath}; archive ${archiveBuffer.length} bytes, SHA-256 ${archiveSha256}`);
