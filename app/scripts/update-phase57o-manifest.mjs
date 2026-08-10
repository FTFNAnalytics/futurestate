import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "reviewer-authorization-receipt-integrity-publication-handoff-state-machines-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57o-reviewer-role-authorization-receipt-integrity-publication-handoff-state-machines.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57o", "npm run verify:phase57o"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57o", "npm run verify:phase57o");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2767,
  signals: 873,
  published_signals: 676,
  in_review_signals: 197,
  draft_sample_signals: 0,
  published_support_sources: 498,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 53,
  published_briefings: 46,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 50,
  research_documents: 989,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 69,
  public_json_exports: 5,
  research_export_records: 861,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2585,
  signals_added: 855,
  published_signals_added: 673,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57N evidence baseline with Phase 57O reviewer-role authorization, immutable receipt-integrity, and publication-handoff controls: 715 public sources, 873 signals, 676 Published signals, five local systems, forty-six Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 69 public updates, fifty research collections, 989 summarized research documents, 861 research export records, and five versioned public-data exports.",
};

manifest.phase_57o_delta = {
  authorization_integrity_and_handoff_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_controls_published: 5,
  broadband_controls_published: 5,
  hanford_controls_published: 5,
  nnsa_controls_published: 5,
  reviewer_role_matrices: 9,
  decision_authorization_rows: 54,
  role_authorization_cases: 63,
  same_actor_separation_rejections: 9,
  receipt_templates_validated: 54,
  receipt_integrity_cases: 270,
  complete_synthetic_receipt_cases: 54,
  missing_required_field_rejections: 54,
  incompatible_reason_code_rejections: 54,
  mutated_citation_rejections: 54,
  mutated_decision_time_rejections: 54,
  publication_handoff_state_machines: 9,
  publication_handoff_cases: 90,
  complete_accept_queue_routes: 9,
  complete_nonaccept_terminal_routes: 45,
  invalid_accept_integrity_rejections: 36,
  total_workflow_cases: 423,
  workflow_test_failures: 0,
  actual_reviewer_identities: 0,
  actual_reviewer_receipts: 0,
  actual_cited_sources_in_receipts: 0,
  actual_candidate_packets_evaluated: 0,
  actual_accept_decisions: 0,
  actual_publication_review_handoffs: 0,
  actual_publication_reviews: 0,
  eligible_records_accepted: 0,
  reopening_triggers_fired: 0,
  automated_closures_or_publications: 0,
  operating_outcomes_ingested: 0,
  exact_target_artifacts_acquired: 0,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  inherited_entity_ledger_closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  phase_57n_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_authorization_registries_added: 1,
  structured_integrity_registries_added: 1,
  structured_handoff_registries_added: 1,
  research_documents_added_published: 20,
  research_documents_added_in_review: 9,
  signals_added_published: 20,
  signals_added_in_review: 9,
  downloadable_records: 29,
  archive_file_count: 32,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 60,
  deployment_status: "not_requested_phase-57n-owner-only-version-70-remains-live",
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-873-signals-989-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2767,
  release_assertions: "passed-phase-57o",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57o-visual-qa-not-requested",
  preview_qa: "phase-57o-deployment-not-requested; phase-57n-owner-only-sites-version-70-remains-live-and-verified",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-045-reviewer-authorization-receipt-integrity-publication-handoffs/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-045-reviewer-authorization-receipt-integrity-publication-handoffs/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-045-reviewer-authorization-receipt-integrity-publication-handoffs/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,767 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 676 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-five|45|forty-six|46) Published briefing URLs/.test(gate)) return "Confirm all forty-six Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 69-entry public update log renders";
  if (/^Confirm all (forty-nine|49|fifty|50) research collections/.test(gate)) return "Confirm all fifty research collections render 989 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57O contains twenty-nine unique records: five Amtrak, five broadband, five Hanford, five NNSA workflow controls, and nine preserved authorization-stage holds",
  "Confirm Phase 57O publishes twenty bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57N holds exactly once, and adds no new hold",
  "Confirm nine reviewer-role matrices cover all fifty-four decision rows and reject every same-person evidence-review and publication-review accept configuration",
  "Confirm all 270 receipt-integrity cases validate completeness and decision-specific reason codes and reject every missing field, incompatible reason code, mutated signed citation, and mutated decision time",
  "Confirm all ninety publication-handoff cases allow only nine complete accept fixtures into a separate review queue, terminate forty-five non-accept fixtures, reject thirty-six invalid accept fixtures, and record zero actual handoffs or publications",
  "Confirm Phase 57O preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero operating-outcome, scope, implementation, capability, or closure promotions",
  "Confirm the Phase 57O collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the local Phase 57O reviewer-authorization, receipt-integrity, and publication-handoff expansion. Thirty-six carried Tier 1 sources support twenty Published workflow controls, nine preserved In Review holds, nine role matrices, 270 integrity cases, 63 authorization cases, ninety handoff cases, Research Watch 045, one collection, one update, and a thirty-two-file archive. Zero actual candidate packets, reviewer identities, cited-source decisions, receipts, accept decisions, handoffs, triggers, closures, or publications are recorded. Synthetic roles, receipts, and transitions remain outside the evidence and publication ledgers, and separate human publication review remains mandatory. The Phase 57O package is locally validated; deployment was not requested. Owner-only Sites version 70 continues to serve the prior exact Phase 57N runtime commit 77654203b4ce005620138de766966e5f3e2236c6 in appgdep_6a792e9a01fc819192dabb660ae9bcd3 with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57O manifest at ${manifestPath}`);
