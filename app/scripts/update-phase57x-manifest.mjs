import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-10";
const localContentCommit = "86c4a615";
const archiveSlug = "federation-health-witness-diversity-fork-adjudication-time-corroboration-patch-provenance-legacy-decommissioning-2026";
const briefingSlug = "research-watch-054-federation-health-and-reversible-decommissioning";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57x-federation-health-diversity-adjudication-time-patch-decommissioning.json"), "utf8"));
const archiveBuffer = await readFile(archivePath);
const archiveSha256 = createHash("sha256").update(archiveBuffer).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedSignalSlugs = ledger.records.filter((record) => record.record_status === "Published").map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57x", "npm run verify:phase57x"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57x", "npm run verify:phase57x");

manifest.expected_build = {
  ...manifest.expected_build, static_pages: 3725, signals: 1343, published_signals: 1065, in_review_signals: 278, draft_sample_signals: 0, published_support_sources: 498, sources: 715,
  topics: 17, organizations: 19, technologies: 5, local_systems: 5, briefings: 62, published_briefings: 55, in_review_briefings: 7, evidence_gaps: 16,
  dependency_maps: 7, published_dependency_maps: 6, in_review_dependency_maps: 1, research_collections: 59, research_documents: 1459, reader_pathways: 15,
  published_reader_pathways: 11, reader_pathway_surfaces: 19, phase_55q_gap_decisions: 4, updates: 78, public_json_exports: 5, research_export_records: 1259, pathway_export_records: 11
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1, static_pages_added: 3543, signals_added: 1325, published_signals_added: 1062, sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57W evidence baseline with Phase 57X fixed-threshold federation-health budgets and partition policy, four-dimension independent witness-diversity audits, separate fork adjudication and appeal, cross-authority time corroboration, lineage-preserving verifier vulnerability and patch provenance, and reversible notified legacy-artifact decommissioning: 715 public sources, 1,343 signals, 1,065 Published signals, five local systems, fifty-five Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 78 public updates, fifty-nine research collections, 1,459 summarized research documents, 1,259 research export records, and five versioned public-data exports."
};
manifest.phase_57x_delta = {
  federation_operations_records_reviewed: 63, records_added_published: 54, records_held_in_review: 9, contract_specific_controls_published: 54, controls_per_contract: 6,
  health_schemas: 9, diversity_schemas: 9, adjudication_schemas: 9, time_corroboration_schemas: 9, patch_provenance_schemas: 9, decommissioning_schemas: 9, total_contract_specific_schemas: 54,
  health_cases: 270, valid_health_routes: 72, rejected_health_routes: 198, diversity_cases: 252, valid_diversity_routes: 63, rejected_diversity_routes: 189,
  adjudication_cases: 270, valid_adjudication_routes: 72, rejected_adjudication_routes: 198, time_corroboration_cases: 243, valid_time_corroboration_routes: 63, rejected_time_corroboration_routes: 180,
  patch_provenance_cases: 270, valid_patch_provenance_routes: 72, rejected_patch_provenance_routes: 198, decommissioning_cases: 288, valid_decommissioning_routes: 72, rejected_decommissioning_routes: 216,
  total_workflow_cases: 1593, valid_or_preservation_routes: 414, rejected_routes: 1179, workflow_test_failures: 0,
  actual_health_events: 0, actual_partitions: 0, actual_diversity_audits: 0, actual_adjudications: 0, actual_appeals: 0, actual_time_comparisons: 0, actual_vulnerability_advisories: 0, actual_patches: 0, actual_decommissionings: 0, actual_reader_rollbacks: 0, actual_notifications: 0,
  actual_reader_state_changes: 0, human_blame_assignments: 0, eligible_records_accepted: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, operating_outcomes_ingested: 0,
  exact_target_artifacts_acquired: 0, public_agency_contacts_or_foia_requests: 0, directive_scope_changes: 0, implementation_changes: 0, capability_changes: 0, closure_changes: 0, attribution_changes: 0, operating_outcome_changes: 0,
  inherited_entity_ledger_closure_changes: 0, current_closure_states_closed: 1, current_closure_states_partially_closed: 21, current_closure_states_open: 2, phase_57w_holds_preserved: 9, new_visible_holds: 0,
  official_source_profiles_added: 0, official_source_profiles_reused: 36, structured_health_registries_added: 1, structured_diversity_registries_added: 1, structured_adjudication_registries_added: 1,
  structured_time_corroboration_registries_added: 1, structured_patch_provenance_registries_added: 1, structured_decommissioning_registries_added: 1,
  research_documents_added_published: 54, research_documents_added_in_review: 9, signals_added_published: 54, signals_added_in_review: 9, downloadable_records: 63,
  archive_file_count: 66, archive_bytes: archiveBuffer.length, archive_sha256: archiveSha256, briefings_added_published: 1, reader_pathways_deepened: 3, topics_deepened: 5, dependency_maps_deepened: 1, public_update_entries_added: 1, generated_pages_added: 128,
  local_content_commit: localContentCommit,
  deployment_status: "local_content_commit_recorded_owner_only_deployment_pending_phase-57w-version-79-remains-live"
};

manifest.last_verified = {
  ...manifest.last_verified, date: capturedDate, published_support_minimum_date: "2026-07-22", validate_content: "passed-715-sources-1343-signals-1459-research-documents",
  source_health: "passed", source_health_manual_review: 494, source_health_probe_ready: 221, source_monitor_current: 715, astro_check: "passed", build: "passed", static_pages_built: 3725,
  release_assertions: "passed-phase-57x", browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57x-visual-qa-not-requested",
  preview_qa: `phase-57x-local-content-commit-${localContentCommit}-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified`
};

manifest.required_output_files = addUnique(manifest.required_output_files, [`dist/research/${archiveSlug}/index.html`, `dist/downloads/${archiveSlug}.zip`, `dist/briefings/${briefingSlug}/index.html`, ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`)]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [`/research/${archiveSlug}/`, `/downloads/${archiveSlug}.zip`, `/briefings/${briefingSlug}/`, ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`)]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [`/briefings/${briefingSlug}/`]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 3,725 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 1,065 Published signal URLs are present in the sitemap";
  if (/^Confirm all (fifty-four|54|fifty-five|55) Published briefing URLs/.test(gate)) return "Confirm all fifty-five Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 78-entry public update log renders";
  if (/^Confirm all (fifty-eight|58|fifty-nine|59) research collections/.test(gate)) return "Confirm all fifty-nine research collections render 1,459 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57X contains sixty-three unique records: fifty-four contract-specific health, diversity, adjudication, time-corroboration, patch-provenance, decommissioning, and zero-state-inflation controls plus nine preserved holds",
  "Confirm Phase 57X publishes fifty-four bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57W holds exactly once, and adds no new hold",
  "Confirm nine federation-health schemas pass 270 cases, preserve seventy-two health-window, quorum-budget, witness-budget, partition, stale-exclusion, degraded-service, recovery, and fixed-threshold routes, and reject 198 threshold-lowering, stale-counting, incomplete, unknown, replayed, rewritten, automating, publishing, accepting, closing, blaming, or evidence-inflating fixtures",
  "Confirm nine witness-diversity schemas pass 252 cases, preserve sixty-three ownership, codebase, infrastructure, jurisdiction, auditor, lineage, and no-side-effect routes, and reject 189 missing, shared, stale, self-audited, conflicted, insufficient, unsigned, replayed, rewritten, publishing, closing, evidence-inflating, or readiness-score fixtures",
  "Confirm nine fork-adjudication schemas pass 270 cases, preserve seventy-two evidence, separation, panel, domain, reason, appeal-window, appeal-independence, and quarantine routes, and reject 198 rewriting, blame-assigning, unquorate, conflicted, unreasoned, backdated, early-release, replayed, publishing, closing, causal, or outcome fixtures",
  "Confirm nine time-corroboration schemas pass 243 cases, preserve sixty-three three-authority, domain, skew, sequence, counter, append-only, and disagreement-quarantine routes, and reject 180 insufficient, dependent, unsigned, skewed, regressive, rollback-importing, disagreement-ignoring, replayed, rewritten, publishing, accepting, closing, causal, or outcome fixtures",
  "Confirm nine patch-provenance schemas pass 270 cases, preserve seventy-two advisory, affected-build, vulnerable-lineage, patch-commit, recipe-and-SBOM, verifier, distinct-artifact, and inactive-rollout routes, and reject 198 missing, rewritten, re-trusted, shared, nonreproducible, reused, divergent, unsigned, backdated, replayed, auto-rollout, publishing, closing, or evidence fixtures",
  "Confirm nine decommissioning schemas pass 288 cases, preserve seventy-two frozen-legacy, verified-replacement, notice, grace, rollback, receipt, authorization, and post-verification routes, and reject 216 deletion, rewrite, unverified, unnotified, grace-bypassing, rollback-disabling, forced, backdated, replayed, irreversible, publishing, closing, causal, outcome, or evidence fixtures",
  "Confirm Phase 57X records zero production health events, partitions, diversity audits, adjudications, appeals, time comparisons, vulnerability advisories, patches, decommissionings, reader rollbacks, notifications, reader-state changes, blame assignments, triggers, publications, closures, or operating-outcome changes",
  "Confirm Phase 57X preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero evidence, acceptance, scope, implementation, capability, closure, attribution, or operating-outcome promotions",
  "Confirm the Phase 57X collection contains sixty-three official-link records backed by thirty-six carried Tier 1 sources and a sixty-six-file archive"
]);

manifest.notes = `This manifest records the locally release-validated Phase 57X federation-health, witness-diversity, fork-adjudication, time-corroboration, patch-provenance, and reversible-decommissioning expansion in exact local content commit ${localContentCommit}. Thirty-six carried Tier 1 sources support fifty-four Published contract-specific controls, nine preserved In Review holds, fifty-four schemas, 1,593 executable cases, Research Watch 054, one collection, one update, and a sixty-six-file archive. Threshold lowering, diversity substitution, automatic human blame, imported time rollback, vulnerable-lineage rewriting, forced migration, and irreversible decommissioning fail closed. Zero production health events, partitions, audits, adjudications, appeals, time comparisons, advisories, patches, decommissionings, rollbacks, notifications, reader-state changes, blame assignments, triggers, publications, closures, or operating-outcome changes are recorded. Private-runtime mapping and owner-only deployment remain pending. Sites version 79 continues to serve the exact Phase 57W package with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.`;

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57X manifest at ${manifestPath}; archive ${archiveBuffer.length} bytes, SHA-256 ${archiveSha256}`);
