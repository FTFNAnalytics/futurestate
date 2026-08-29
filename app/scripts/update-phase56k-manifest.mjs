import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "exact-record-continuation-batch-two-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256")
  .update(await readFile(archivePath))
  .digest("hex")
  .toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter(
  (command) => command !== archiveCommand && command !== "npm run verify:phase56k",
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run validate:content"),
  0,
  archiveCommand,
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run verify:release"),
  0,
  "npm run verify:phase56k",
);

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1351,
  signals: 283,
  published_signals: 217,
  in_review_signals: 66,
  draft_sample_signals: 0,
  published_support_sources: 335,
  sources: 545,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 23,
  published_briefings: 16,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 20,
  research_documents: 393,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 39,
  public_json_exports: 5,
  research_export_records: 372,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1169,
  signals_added: 265,
  published_signals_added: 214,
  sources_added: 443,
  summary:
    "Extends the Phase 55K through Phase 56J evidence baseline with Phase 56K exact-record continuation: 545 public sources, 283 signals, 217 Published signals, five local systems, sixteen Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 39 public updates, twenty research collections, 393 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56k_delta = {
  exact_records_checked: 7,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 3,
  source_profiles_reused: 4,
  research_documents_added: 7,
  research_documents_published: 3,
  research_documents_in_review: 4,
  signals_reviewed: 3,
  signals_added_published: 3,
  signals_added_in_review: 0,
  downloadable_official_link_records: 7,
  archive_file_count: 10,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 5,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 15,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-25",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-545-sources-283-signals-393-research-documents",
  source_health: "passed",
  source_health_manual_review: 369,
  source_health_probe_ready: 176,
  source_monitor_current: 545,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1351,
  release_assertions: "passed-phase-56k",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56k-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-015-exact-record-continuation/index.html",
  "dist/signals/56k-moss-landing-corrective-action-status/index.html",
  "dist/signals/56k-va-ifams-recommendations-open/index.html",
  "dist/signals/56k-f15ex-ex16-portland-receipt/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56k-moss-landing-corrective-action-status/",
  "/signals/56k-va-ifams-recommendations-open/",
  "/signals/56k-f15ex-ex16-portland-receipt/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-015-exact-record-continuation/",
  "/signals/56k-moss-landing-corrective-action-status/",
  "/signals/56k-va-ifams-recommendations-open/",
  "/signals/56k-f15ex-ex16-portland-receipt/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-015-exact-record-continuation/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,336 generated HTML pages"))
    return "Confirm 1,351 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 214 Published signal URLs"))
    return "Confirm all 217 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all fifteen Published briefing URLs"))
    return "Confirm all sixteen Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 332 sources supporting Published signals"))
    return "Confirm all 335 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 38-entry public update log"))
    return "Confirm the 39-entry public update log renders";
  if (gate.startsWith("Confirm all nineteen research collections"))
    return "Confirm all twenty research collections render 393 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all seven Phase 56K decisions retain their Phase 56F coverage ID, stable entity ID, exact named record, dated source check, limitation, and reopening rule",
  "Confirm Phase 56K preserves one Closed, twenty-one Partially Closed, and two Open evidence states with no unsupported closure transition",
  "Confirm three Phase 56K research documents and three bounded signals publish while four exact non-closure documents remain In Review",
  "Confirm the Phase 56K collection contains seven official-link records and a ten-file archive",
  "Confirm the Moss Landing conventional plant audit is not presented as the final battery-fire investigation",
  "Confirm EX16 receiving-unit arrival is not presented as formal contractual acceptance",
  "Confirm audit initiation, report-index absence, audit catalog presence, and fleet sustainment are not substituted for differently scoped final records",
  "Confirm no acquisition result, closure state, or missing disclosure is rendered as performance, readiness, quality, safety, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) =>
    ![
      "Sixty-six signals, seven briefings, and one dependency map remain In Review",
      "The Phase 56J download contains",
      "Phase 56J changes only Manatee",
    ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-six signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56K download contains seven official-link records and seven exact-record decisions. Four documents remain In Review because the named final records are not published.",
  "Phase 56K changes no evidence state. DHS and Gateway remain Open; twenty-one records are Partially Closed and one remains Closed under evidence-state rules.",
);
manifest.notes =
  "This manifest records the locally generated Phase 56K exact-record continuation package. Seven named records are checked without substitution. The CPUC-posted Moss Landing response supplies a 28-finding conventional-plant corrective-action denominator but is not the battery-fire investigation closure. VA OIG marks all three iFAMS recommendations Open. The 142nd Wing fixes EX16's realized Portland receipt date without supplying formal contractual acceptance. DHS, Gateway, F-35, and DOT retain exact non-closure decisions. Research Watch 015, the seven-record collection, five deepened pathways, five topics, the comparison protocol, and the ten-file archive preserve scope, denominator, attribution, no-ranking, no-score, and no-causation rules. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56K manifest with archive SHA-256 ${archiveSha256}.`);
