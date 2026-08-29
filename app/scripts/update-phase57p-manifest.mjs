import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capturedDate = "2026-08-09";
const archiveSlug = "dual-review-audit-chains-adjudication-publication-decision-receipts-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-57p-append-only-dual-review-audit-chains-cross-role-adjudication-publication-review-receipts.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => ![archiveCommand, "npm run test:phase57p", "npm run verify:phase57p"].includes(command));
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run test:phase57p", "npm run verify:phase57p");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 2827,
  signals: 902,
  published_signals: 696,
  in_review_signals: 206,
  draft_sample_signals: 0,
  published_support_sources: 498,
  sources: 715,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 54,
  published_briefings: 47,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 51,
  research_documents: 1018,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 70,
  public_json_exports: 5,
  research_export_records: 882,
  pathway_export_records: 11,
};

manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 2645,
  signals_added: 884,
  published_signals_added: 693,
  sources_added: 613,
  summary: "Extends the Phase 55K through Phase 57O evidence baseline with Phase 57P append-only dual-review audit chains, publication-decision receipts, and cross-role adjudication controls: 715 public sources, 902 signals, 696 Published signals, five local systems, forty-seven Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 70 public updates, fifty-one research collections, 1,018 summarized research documents, 882 research export records, and five versioned public-data exports.",
};

manifest.phase_57p_delta = {
  audit_adjudication_and_publication_receipt_records_reviewed: 29,
  records_added_published: 20,
  records_held_in_review: 9,
  amtrak_controls_published: 5,
  broadband_controls_published: 5,
  hanford_controls_published: 5,
  nnsa_controls_published: 5,
  audit_chain_schemas: 9,
  audit_chain_cases: 81,
  publication_receipt_cases: 162,
  valid_publication_receipt_cases: 54,
  incompatible_publication_reason_rejections: 54,
  mutated_publication_attribution_rejections: 54,
  adjudication_cases: 90,
  concordant_accept_manual_release_routes: 9,
  disagreement_escalation_routes: 18,
  bounded_block_escalation_routes: 27,
  role_authorization_rejections: 9,
  escalation_ownership_rejections: 9,
  nonaccept_override_rejections: 9,
  append_only_supersession_routes: 9,
  total_workflow_cases: 333,
  workflow_test_failures: 0,
  actual_reviewer_identities: 0,
  actual_evidence_receipts: 0,
  actual_publication_receipts: 0,
  actual_candidate_packets_evaluated: 0,
  actual_accept_decisions: 0,
  actual_adjudications: 0,
  actual_escalations: 0,
  actual_manual_release_authorizations: 0,
  actual_publications: 0,
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
  phase_57o_holds_preserved: 9,
  new_visible_holds: 0,
  official_source_profiles_added: 0,
  official_source_profiles_reused: 36,
  structured_audit_registries_added: 1,
  structured_publication_receipt_registries_added: 1,
  structured_adjudication_registries_added: 1,
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
  deployment_status: "not_requested_phase-57o-owner-only-version-71-remains-live",
};

manifest.last_verified = {
  ...manifest.last_verified,
  date: capturedDate,
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-715-sources-902-signals-1018-research-documents",
  source_health: "passed",
  source_health_manual_review: 494,
  source_health_probe_ready: 221,
  source_monitor_current: 715,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 2827,
  release_assertions: "passed-phase-57p",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-57p-visual-qa-not-requested",
  preview_qa: "phase-57p-deployment-not-requested; phase-57o-owner-only-sites-version-71-remains-live-and-verified",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-046-dual-review-audit-chains-adjudication-publication-receipts/index.html",
  ...publishedSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-046-dual-review-audit-chains-adjudication-publication-receipts/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, ["/briefings/research-watch-046-dual-review-audit-chains-adjudication-publication-receipts/"]);

manifest.release_gates = manifest.release_gates.map((gate) => {
  if (/^Confirm [\d,]+ generated HTML pages/.test(gate)) return "Confirm 2,827 generated HTML pages and all required outputs";
  if (/^Confirm all \d+ Published signal URLs/.test(gate)) return "Confirm all 696 Published signal URLs are present in the sitemap";
  if (/^Confirm all (forty-six|46|forty-seven|47) Published briefing URLs/.test(gate)) return "Confirm all forty-seven Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (/^Confirm all \d+ sources supporting Published signals/.test(gate)) return "Confirm all 498 sources supporting Published signals were checked on or after 2026-07-22";
  if (/^Confirm the \d+-entry public update log/.test(gate)) return "Confirm the 70-entry public update log renders";
  if (/^Confirm all (fifty|50|fifty-one|51) research collections/.test(gate)) return "Confirm all fifty-one research collections render 1,018 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 57P contains twenty-nine unique records: five Amtrak, five broadband, five Hanford, five NNSA workflow controls, and nine preserved dual-review holds",
  "Confirm Phase 57P publishes twenty bounded controls, retains nine explicit In Review holds, preserves all nine Phase 57O holds exactly once, and adds no new hold",
  "Confirm nine append-only audit chains pass all eighty-one integrity cases while rejecting prior-event mutation, replacement, chronology regression, and duplicate identifiers",
  "Confirm all 162 publication-review receipt cases enforce decision-specific reason codes, immutable reviewer attribution, and immutable evidence-receipt linkage",
  "Confirm all ninety adjudication cases keep disagreement explicit, require distinct escalation ownership, preserve superseded receipts, reject publication accept over nonaccept evidence, and route concordant accept only to manual release authorization",
  "Confirm Phase 57P records zero actual evidence receipts, publication receipts, adjudications, escalations, release authorizations, triggers, closures, or publications",
  "Confirm Phase 57P preserves the one Closed, twenty-one Partially Closed, and two Open entity ledger with zero operating-outcome, scope, implementation, capability, or closure promotions",
  "Confirm the Phase 57P collection contains twenty-nine official-link records backed by thirty-six carried Tier 1 sources and a thirty-two-file archive",
]);

manifest.notes = "This manifest records the local Phase 57P append-only dual-review audit, publication-receipt, and adjudication expansion. Thirty-six carried Tier 1 sources support twenty Published workflow controls, nine preserved In Review holds, nine audit chains, 81 audit cases, 162 publication-receipt cases, 90 adjudication cases, Research Watch 046, one collection, one update, and a thirty-two-file archive. Zero actual candidate packets, reviewer identities, evidence receipts, publication receipts, adjudications, escalations, manual release authorizations, triggers, closures, or publications are recorded. Synthetic identities, receipts, events, disagreements, and supersessions remain outside the evidence and publication ledgers; disagreement cannot collapse into accept, prior receipts remain immutable, and even concordant accept requires separate manual release authorization. The Phase 57P package is locally validated; deployment was not requested. Owner-only Sites version 71 continues to serve the exact Phase 57O runtime commit 6bd0660578fa398a8d1440a96588458999636250 in appgdep_6a793730bb54819190b33f119cbbac1b with one owner, no groups, no editors, and zero external visitors. The release remains 0.2.0-dev. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, and package freeze remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 57P manifest at ${manifestPath}`);
