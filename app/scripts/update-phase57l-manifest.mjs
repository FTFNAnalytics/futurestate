import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-08";
const archiveSlug = "contract-field-coverage-first-eligible-record-intake-exception-playbooks-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57l-contract-field-coverage-intake-queues-exception-playbooks.json"), "utf8"));
const coverage = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57l-contract-field-coverage-matrix.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase57l");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase57l");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2587,
  signals: 786,
  published_signals: 616,
  in_review_signals: 170,
  draft_sample_signals: 0,
  published_support_sources: 498,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 50,
  published_briefings: 43,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 47,
  research_documents: 902,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 66,
  public_json_exports: 5,
  research_export_records: 798,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2405,
  signals_added: 768,
  published_signals_added: 613,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57K evidence baseline with Phase 57L contract-field coverage, first-eligible-record intake queues, and exception-resolution playbooks: 715 public sources, 786 signals, 616 Published signals, five local systems, forty-three Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 66 public updates, forty-seven research collections, 902 summarized research documents, 798 research export records, and five versioned public-data exports.",
};

manifest.phase_57l_delta = {
  field_coverage_and_intake_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_controls_published: 5,
  broadband_controls_published: 5,
  hanford_controls_published: 5,
  nnsa_controls_published: 5,
  reopening_contracts_operationalized: 9,
  required_contract_fields_classified: 60,
  field_state_present: coverage.coverage_state_counts.present,
  field_state_absent: coverage.coverage_state_counts.absent,
  field_state_incompatible: coverage.coverage_state_counts.incompatible,
  field_state_authority_mismatched: coverage.coverage_state_counts.authority_mismatched,
  field_state_period_mismatched: coverage.coverage_state_counts.period_mismatched,
  field_state_privacy_gated: coverage.coverage_state_counts.privacy_gated,
  field_state_not_yet_evaluated: coverage.coverage_state_counts.not_yet_evaluated,
  blocking_fields: coverage.blocking_field_count,
  fully_covered_contracts: coverage.fully_covered_contracts,
  amtrak_contracts: 2,
  amtrak_fields: 12,
  amtrak_present_fields: 1,
  amtrak_blocking_fields: 11,
  broadband_contracts: 3,
  broadband_fields: 19,
  broadband_present_fields: 6,
  broadband_blocking_fields: 13,
  hanford_contracts: 1,
  hanford_fields: 12,
  hanford_present_fields: 3,
  hanford_blocking_fields: 9,
  nnsa_contracts: 3,
  nnsa_fields: 17,
  nnsa_present_fields: 5,
  nnsa_blocking_fields: 12,
  first_eligible_record_queues: 9,
  eligible_records_accepted: 0,
  partial_matches_retained_as_non_triggering: 9,
  exception_resolution_playbooks: 9,
  field_resolution_actions: 60,
  unresolved_field_exceptions: 45,
  automated_field_closures: 0,
  reopening_triggers_fired: 0,
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
  phase_57k_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_matrices_added: 1,
  structured_intake_registries_added: 1,
  structured_playbook_registries_added: 1,
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

manifest.private_preview = {
  ...manifest.private_preview,
  provider: "OpenAI Sites",
  url: "https://ftfn-analytics.jbumstead.chatgpt.site",
  access: "owner-only-custom-policy",
  current_local_content_commit: "886fdc7c0faa2f21e5db40441bd3169aa5deed37",
  current_source_commit: "44240958e241895323c4199a61b60be252bcf1f7",
  current_version_id: "appgprj_6a614e1092d08191bf65779fc35df959~appgver_e161ada41fe0819189c2eabfcabd0ef1",
  current_version_number: 68,
  current_deployment_id: "appgdep_6a77b85bb3c08191bda7f79917018300",
  custom_domain_attached: false,
  post_deploy_qa: "passed-version-68-deployment-status-source-provenance-runtime-archive-owner-only-access; visual-route-qa-not-requested",
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-786-signals-902-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2587,
  release_assertions: "passed-phase-57l",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57l-visual-qa-not-requested",
  preview_qa: "passed-phase-57l-version-68-owner-only-custom-access-one-owner-no-groups-no-editors-zero-external-visitors; visual-route-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-042-contract-field-coverage-intake-playbooks/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-042-contract-field-coverage-intake-playbooks/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-042-contract-field-coverage-intake-playbooks/",
]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,587 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 616 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-two|42|forty-three|43) Published briefing URLs/.test(gate)) return "Confirm all forty-three Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 66-entry public update log renders";
  if (/^Confirm all (forty-six|46|forty-seven|47) research collections/.test(gate)) return "Confirm all forty-seven research collections render 902 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57L contains twenty-nine unique records: five Amtrak, five broadband, five Hanford, five NNSA field-operationalization controls, and nine preserved contract-field holds",
  "Confirm Phase 57L publishes twenty bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57K holds exactly once, and adds no new hold",
  "Confirm all sixty required reopening-contract fields receive exactly one allowed coverage state: fifteen present, twenty-eight absent, five incompatible, two authority-mismatched, six period-mismatched, three privacy-gated, and one not yet evaluated",
  "Confirm nine first-eligible-record queues define source, identity, period, privacy, acceptance, and disqualifier envelopes while accepting zero candidate or eligible records and firing zero triggers",
  "Confirm nine exception-resolution playbooks assign sixty unique human-reviewed field actions, retain forty-five unresolved exceptions, and prohibit automated closure and cross-record value carry",
  "Confirm Phase 57L preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero operating-outcome, scope, implementation, capability, or closure promotions",
  "Confirm the Phase 57L collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the Phase 57L contract-field coverage, first-eligible-record intake, and exception-resolution expansion. Thirty-six carried Tier 1 sources support twenty Published controls, nine preserved In Review holds, sixty classified contract fields, nine source-specific intake queues, nine playbooks, sixty human-reviewed field actions, Research Watch 042, one collection, one update, and a thirty-two-file archive. Fifteen fields are present in inherited evidence positions and forty-five remain explicitly blocked; zero complete eligible records are accepted and zero triggers fire. Coverage counts are not readiness scores, values cannot be assembled across records, and human publication review remains mandatory. The release remains 0.2.0-dev and owner-only. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57L manifest at ${manifestPath}`);
