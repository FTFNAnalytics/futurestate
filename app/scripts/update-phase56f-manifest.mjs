import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "cross-cohort-coverage-missing-record-closure-2010-2026.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug cross-cohort-coverage-missing-record-closure-2010-2026";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1249,
  signals: 265,
  published_signals: 203,
  in_review_signals: 62,
  draft_sample_signals: 0,
  published_support_sources: 321,
  sources: 516,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 18,
  published_briefings: 11,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 15,
  research_documents: 348,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 34,
  public_json_exports: 5,
  research_export_records: 342,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1067,
  signals_added: 247,
  published_signals_added: 200,
  sources_added: 414,
  summary: "Extends the Phase 55K through Phase 56E evidence baseline with Phase 56F cross-cohort coverage and missing-record closure: 516 public sources, 265 signals, 203 Published signals, five local systems, eleven Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 34 public updates, fifteen research collections, 348 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56f_delta = {
  entity_coverage_decisions: 24,
  phase_56b_entities: 12,
  phase_56e_entities: 12,
  closure_states_closed: 1,
  closure_states_partially_closed: 16,
  closure_states_open: 7,
  source_profiles_added: 14,
  research_documents_added: 24,
  research_documents_published: 17,
  research_documents_in_review: 7,
  signals_reviewed: 5,
  signals_added_published: 4,
  signals_added_in_review: 1,
  downloadable_official_link_records: 24,
  archive_file_count: 27,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 6,
  topics_deepened: 8,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 45,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-516-sources-265-signals-348-research-documents",
  source_health: "passed",
  source_health_manual_review: 352,
  source_health_probe_ready: 164,
  source_monitor_current: 516,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1249,
  release_assertions: "passed-phase-56f",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56f-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/cross-cohort-coverage-missing-record-closure-2010-2026/index.html",
  "dist/downloads/cross-cohort-coverage-missing-record-closure-2010-2026.zip",
  "dist/briefings/research-watch-010-cross-cohort-coverage/index.html",
  "dist/signals/56f-ai-cyber-coverage-closure/index.html",
  "dist/signals/56f-manufacturing-coverage-closure/index.html",
  "dist/signals/56f-infrastructure-coverage-closure/index.html",
  "dist/signals/56f-mobility-coverage-closure/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56f-ai-cyber-coverage-closure/",
  "/signals/56f-manufacturing-coverage-closure/",
  "/signals/56f-infrastructure-coverage-closure/",
  "/signals/56f-mobility-coverage-closure/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/cross-cohort-coverage-missing-record-closure-2010-2026/",
  "/downloads/cross-cohort-coverage-missing-record-closure-2010-2026.zip",
  "/briefings/research-watch-010-cross-cohort-coverage/",
  "/signals/56f-ai-cyber-coverage-closure/",
  "/signals/56f-mobility-coverage-closure/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-010-cross-cohort-coverage/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,204 generated HTML pages")) return "Confirm 1,249 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 199 Published signal URLs")) return "Confirm all 203 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all ten Published briefing URLs")) return "Confirm all eleven Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 307 sources supporting Published signals")) return "Confirm all 321 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 33-entry public update log")) return "Confirm the 34-entry public update log renders";
  if (gate.startsWith("Confirm all fourteen research collections render")) return "Confirm all fifteen research collections render 348 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 56F ledger contains 24 unique entities split twelve and twelve across the Phase 56B and Phase 56E cohorts",
  "Confirm exactly one record is Closed, sixteen are Partially Closed, and seven remain Open",
  "Confirm every entity has exactly one highest-value missing record, one selected source, a remaining gap, and a reopening rule",
  "Confirm seventeen coverage documents and four portfolio findings publish while seven exact-record decisions and one cross-cohort comparison remain In Review",
  "Confirm the Phase 56F collection contains 24 official-link records and a 27-file archive",
  "Confirm closure status is never rendered as performance, readiness, quality, safety, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Sixty-one signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56F download contains",
    "Phase 56F assigns",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-two signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56F download contains 24 official-link records and 24 entity-specific coverage decisions; seven exact-record decisions remain In Review.",
  "Phase 56F assigns one selected record and reopening rule per entity. Closed, Partially Closed, and Open are evidence states, not entity performance.",
);
manifest.notes = "This manifest records the locally generated Phase 56F cross-cohort coverage and missing-record closure pass. All 24 entities from the Phase 56B and Phase 56E cohorts now have one highest-value missing record, one strongest current official record, a closure state, a remaining gap, and a reopening rule. The result is one Closed record, sixteen Partially Closed records, and seven Open records; seventeen entity documents and four portfolio coverage findings publish while seven exact-record decisions and the cross-cohort comparison remain In Review. Research Watch 010, six deepened pathways, eight deepened topics, the comparison protocol, and the 27-file archive preserve the no-ranking, no-score, and no-causation boundary. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56F manifest with archive SHA-256 ${archiveSha256}.`);
