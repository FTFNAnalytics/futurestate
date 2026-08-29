import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "adapter-conformance-packet-validation-reviewer-receipt-ledgers-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57n-adapter-conformance-tests-packet-validation-harnesses-reviewer-receipt-ledgers.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57n", "npm run verify:phase57n"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57n", "npm run verify:phase57n");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2707,
  signals: 844,
  published_signals: 656,
  in_review_signals: 188,
  draft_sample_signals: 0,
  published_support_sources: 498,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 52,
  published_briefings: 45,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 49,
  research_documents: 960,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 68,
  public_json_exports: 5,
  research_export_records: 840,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2525,
  signals_added: 826,
  published_signals_added: 653,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57M evidence baseline with Phase 57N deterministic adapter conformance, packet validation, and reviewer-receipt controls: 715 public sources, 844 signals, 656 Published signals, five local systems, forty-five Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 68 public updates, forty-nine research collections, 960 summarized research documents, 840 research export records, and five versioned public-data exports.",
};

manifest.phase_57n_delta = {
  conformance_validation_and_receipt_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_controls_published: 5,
  broadband_controls_published: 5,
  hanford_controls_published: 5,
  nnsa_controls_published: 5,
  adapter_conformance_tests: 180,
  accepted_label_tests: 120,
  ambiguous_label_rejections: 60,
  adapter_test_failures: 0,
  packet_fixture_executions: 18,
  empty_fixture_executions: 9,
  incomplete_fixture_executions: 9,
  packet_fixture_failures: 0,
  reviewer_receipt_templates: 54,
  actual_reviewer_receipts: 0,
  actual_reviewer_identities: 0,
  actual_cited_sources_in_receipts: 0,
  actual_candidate_packets_evaluated: 0,
  actual_accept_decisions: 0,
  publication_review_handoffs: 0,
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
  phase_57m_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_conformance_registries_added: 1,
  structured_validation_registries_added: 1,
  structured_receipt_registries_added: 1,
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
  deployment_status: "not_requested_phase-57m-owner-only-version-69-remains-live",
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-844-signals-960-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2707,
  release_assertions: "passed-phase-57n",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57n-visual-qa-not-requested",
  preview_qa: "phase-57n-deployment-not-requested; phase-57m-owner-only-sites-version-69-remains-live-and-verified",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-044-adapter-conformance-packet-validation-receipts/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-044-adapter-conformance-packet-validation-receipts/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-044-adapter-conformance-packet-validation-receipts/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,707 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 656 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-four|44|forty-five|45) Published briefing URLs/.test(gate)) return "Confirm all forty-five Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 68-entry public update log renders";
  if (/^Confirm all (forty-eight|48|forty-nine|49) research collections/.test(gate)) return "Confirm all forty-nine research collections render 960 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57N contains twenty-nine unique records: five Amtrak, five broadband, five Hanford, five NNSA workflow controls, and nine preserved receipt-stage holds",
  "Confirm Phase 57N publishes twenty bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57M holds exactly once, and adds no new hold",
  "Confirm all 120 accepted adapter labels pass exact case-normalized and outer-trim matching and sixty explicit ambiguous-label tests return for clarification with zero coercion, values, or evidence creation",
  "Confirm all nine empty and nine incomplete packet fixtures execute through nine validators and reach their expected bounded decisions with zero candidate evidence ingestion, acceptance, trigger, closure, or publication",
  "Confirm all fifty-four Phase 57M decision rows have a machine-readable receipt template covering reviewer identity, reason code, cited source, decision time, escalation state, and publication-review handoff while recording zero actual receipts",
  "Confirm Phase 57N preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero operating-outcome, scope, implementation, capability, or closure promotions",
  "Confirm the Phase 57N collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the local Phase 57N adapter-conformance, packet-validation, and reviewer-receipt expansion. Thirty-six carried Tier 1 sources support twenty Published workflow controls, nine preserved In Review holds, 120 accepted-label tests, sixty ambiguity rejections, eighteen deterministic fixture executions, fifty-four receipt templates, Research Watch 044, one collection, one update, and a thirty-two-file archive. Zero actual candidate packets, reviewer identities, cited-source decisions, receipts, accept decisions, handoffs, triggers, closures, or publications are recorded. Synthetic tests remain outside the evidence ledger, and human publication review remains mandatory. The Phase 57N package is locally validated; deployment was not requested. Owner-only Sites version 69 continues to serve the prior exact Phase 57M runtime commit ab6e14d05ca55daf4f92655218d307d247547a3e in appgdep_6a77c388da3c8191816d4e0c85636594 with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57N manifest at ${manifestPath}`);
