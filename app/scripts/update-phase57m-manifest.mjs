import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-08";
const archiveSlug = "source-schema-adapters-candidate-evidence-packet-templates-human-review-decision-tables-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57m-source-schema-adapters-packet-templates-review-decision-tables.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57m");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57m");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2647,
  signals: 815,
  published_signals: 636,
  in_review_signals: 179,
  draft_sample_signals: 0,
  published_support_sources: 498,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 51,
  published_briefings: 44,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 48,
  research_documents: 931,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 67,
  public_json_exports: 5,
  research_export_records: 819,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2465,
  signals_added: 797,
  published_signals_added: 633,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57L evidence baseline with Phase 57M non-coercive source-schema adapters, candidate-evidence packet templates, and human-review decision tables: 715 public sources, 815 signals, 636 Published signals, five local systems, forty-four Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 67 public updates, forty-eight research collections, 931 summarized research documents, 819 research export records, and five versioned public-data exports.",
};

manifest.phase_57m_delta = {
  adapter_packet_and_review_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_controls_published: 5,
  broadband_controls_published: 5,
  hanford_controls_published: 5,
  nnsa_controls_published: 5,
  source_schema_adapters: 60,
  accepted_input_labels: 120,
  unrecognized_labels_coerced: 0,
  populated_adapter_values: 0,
  empty_packet_fixtures: 9,
  incomplete_packet_fixtures: 9,
  packet_fixtures_total: 18,
  fixture_records_treated_as_evidence: 0,
  human_review_decision_tables: 9,
  decision_types_per_table: 6,
  human_review_decision_rows: 54,
  actual_candidate_packets_evaluated: 0,
  actual_accept_decisions: 0,
  eligible_records_accepted: 0,
  reopening_triggers_fired: 0,
  automated_publication_decisions: 0,
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
  phase_57l_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_adapter_registries_added: 1,
  structured_packet_registries_added: 1,
  structured_decision_registries_added: 1,
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
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-815-signals-931-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2647,
  release_assertions: "passed-phase-57m",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57m-visual-qa-not-requested",
  preview_qa: "pending-phase-57m-owner-only-deployment; phase-57l-owner-only-version-68-custom-access-one-owner-no-groups-no-editors-zero-external-visitors",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-043-source-schema-adapters-packet-review-controls/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-043-source-schema-adapters-packet-review-controls/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-043-source-schema-adapters-packet-review-controls/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,647 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 636 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-three|43|forty-four|44) Published briefing URLs/.test(gate)) return "Confirm all forty-four Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 67-entry public update log renders";
  if (/^Confirm all (forty-seven|47|forty-eight|48) research collections/.test(gate)) return "Confirm all forty-eight research collections render 931 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57M contains twenty-nine unique records: five Amtrak, five broadband, five Hanford, five NNSA workflow controls, and nine preserved packet-review holds",
  "Confirm Phase 57M publishes twenty bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57L holds exactly once, and adds no new hold",
  "Confirm all sixty Phase 57L fields map one-to-one into non-coercive adapters with 120 exact accepted labels, zero populated adapter values, zero semantic coercions, and zero value transformations",
  "Confirm nine empty and nine deliberately incomplete packet fixtures remain synthetic non-evidence records with zero candidate evaluations, eligible records, or triggers",
  "Confirm nine human-review tables contain fifty-four rehearsal rows covering accept, reject, clarification, privacy, authority, and period paths while permitting no automated acceptance, closure, trigger, or publication",
  "Confirm Phase 57M preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero operating-outcome, scope, implementation, capability, or closure promotions",
  "Confirm the Phase 57M collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the Phase 57M source-schema adapter, packet-template, and human-review decision-table expansion. Thirty-six carried Tier 1 sources support twenty Published workflow controls, nine preserved In Review holds, sixty non-coercive adapters, 120 accepted adapter labels, nine empty and nine deliberately incomplete non-evidence fixtures, nine six-outcome decision tables, fifty-four rehearsal rows, Research Watch 043, one collection, one update, and a thirty-two-file archive. Zero source values are populated in adapters, zero candidate packets are evaluated or accepted, and zero triggers fire. Fixtures and rehearsals remain outside the evidence ledger, values cannot be invented or assembled across records, and human publication review remains mandatory. The release remains 0.2.0-dev and owner-only. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57M manifest at ${manifestPath}`);
