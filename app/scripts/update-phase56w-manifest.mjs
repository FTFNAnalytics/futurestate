import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "gao-named-record-retrieval-cross-lane-expansion-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56w-named-record-retrieval-cross-lane-expansion.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const allSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56w");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56w");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1798,
  signals: 445,
  published_signals: 377,
  in_review_signals: 68,
  draft_sample_signals: 0,
  published_support_sources: 427,
  sources: 638,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 35,
  published_briefings: 28,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 32,
  research_documents: 561,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 51,
  public_json_exports: 5,
  research_export_records: 544,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1616,
  signals_added: 427,
  published_signals_added: 374,
  sources_added: 536,
  summary: "Extends the Phase 55K through Phase 56V evidence baseline with Phase 56W named-record retrieval and compatible cross-lane expansion: 638 public sources, 445 signals, 377 Published signals, five local systems, twenty-eight Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 51 public updates, thirty-two research collections, 561 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56w_delta = {
  ...(manifest.phase_56w_delta ?? {}),
  named_recovery_targets_reviewed: 7,
  compatible_cross_lane_records_reviewed: 3,
  records_added_published: 6,
  records_added_in_review: 4,
  exact_target_artifacts_acquired: 0,
  new_authoritative_status_or_material_narrowing_records: 6,
  official_source_profiles_added: 7,
  source_profiles_data_download: 3,
  source_profiles_report_series: 4,
  public_agency_contacts_or_foia_requests: 0,
  agency_gao_status_conflicts_preserved: 2,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  research_documents_added_published: 6,
  research_documents_added_in_review: 4,
  signals_added_published: 6,
  downloadable_records: 10,
  archive_file_count: 13,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 25,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-638-sources-445-signals-561-research-documents",
  source_health: "passed",
  source_health_manual_review: 436,
  source_health_probe_ready: 202,
  source_monitor_current: 638,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1798,
  release_assertions: "passed-phase-56w",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56w-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-027-named-record-retrieval/index.html",
  ...allSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, allSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-027-named-record-retrieval/",
  ...allSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-027-named-record-retrieval/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,773 generated HTML pages")) return "Confirm 1,798 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 371 Published signal URLs")) return "Confirm all 377 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty-seven Published briefing URLs")) return "Confirm all twenty-eight Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 420 sources supporting Published signals")) return "Confirm all 427 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 50-entry public update log")) return "Confirm the 51-entry public update log renders";
  if (gate.startsWith("Confirm all thirty-one research collections")) return "Confirm all thirty-two research collections render 561 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 56W reviews seven named recovery targets and three compatible cross-lane records",
  "Confirm Phase 56W publishes six new authoritative or materially narrower records and holds four unchanged exact-artifact searches In Review",
  "Confirm the NNSA project-level cost trail is not rendered as the complete multi-site capability life-cycle estimate",
  "Confirm the VA JEC inventory is not rendered as the still-missing effectiveness assessment",
  "Confirm Hanford continued implementation and progress records do not satisfy the pause, independent-analysis, or prerequisite package by inference",
  "Confirm the IIJA and IRA funding figures remain four-agency aggregates and are not rendered as DOT-only or unified-grants-system results",
  "Confirm low-activity-waste grouting is not rendered as high-level-waste recommendation evidence",
  "Confirm potential EM infrastructure savings are not rendered as realized savings or as a complex-wide waste-disposal optimization",
  "Confirm the DOT unified-grants, DOE waste-optimization, and two HHS AAR searches remain In Review",
  "Confirm Phase 56W records zero exact targets, directive-scope changes, implementation changes, closure changes, agency contacts, and FOIA submissions",
  "Confirm the Phase 56W collection contains ten official-link records and a thirteen-file archive",
]);
manifest.known_limitations = manifest.known_limitations.filter((item) => ![
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q",
  "Phase 56V adds ten materially narrower",
  "The VA FY 2026 congressional appendix",
  "DOE's Hanford implementation lineage",
  "DOT's unified-grants record",
  "Phase 56V records no directive-scope",
].some((prefix) => item.startsWith(prefix)));
manifest.known_limitations.unshift(
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q parent documents, one Phase 56N research document, and four Phase 56W research documents remain In Review; the inherited HHS tracker hold remains unchanged.",
  "Phase 56W publishes six new authoritative or materially narrower records and holds four unchanged exact-artifact searches. It acquires no exact target and changes no directive scope, implementation, closure, or entity evidence state.",
  "The FY 2027 NNSA project-cost tables are not the complete multi-site pit-production capability estimate or its GAO-aligned method and uncertainty analysis.",
  "The VA JEC inventory, named plans, and draft-assessment status do not establish a completed effectiveness assessment, consolidated feedback, findings, recommended changes, follow-through, or GAO acceptance.",
  "DOE's Hanford amended decision and July 2026 progress record confirm continued implementation but do not satisfy the pause, independent-analysis, mission-need, safety-prerequisite, or GAO-closure tests.",
  "DOT's unified-grants award and operating records, DOE's complex-wide waste-optimization package, and both HHS completed department-wide AARs remain unacquired and In Review.",
  "The cross-lane records preserve aggregate-versus-agency, low-activity-versus-high-level waste, potential-versus-realized savings, and asset-planning-versus-disposal-strategy boundaries.",
  "No FTFN agency contact or FOIA request was submitted; a bounded public search does not establish nonexistence, withholding, or failure to submit.",
);
manifest.notes = "This manifest records the locally generated Phase 56W named-record retrieval and compatible cross-lane expansion. Seven named recovery targets and three cross-lane records produce six Published additions, four In Review holds, seven Tier 1 source profiles, Research Watch 027, one collection, one update, and a thirteen-file archive. NNSA project cost, VA inventory-versus-assessment status, Hanford decision and progress, infrastructure funding, low-activity-waste grouting, and EM infrastructure constraints retain their scope and denominator boundaries. Zero exact target artifacts, directive-scope changes, implementation changes, closure changes, agency contacts, or FOIA submissions are recorded. DOE-02 and DOE-05 retain agency-GAO status conflicts; the entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Dated checks remain bounded inserts. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56W manifest with archive SHA-256 ${archiveSha256}.`);
