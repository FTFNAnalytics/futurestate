import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "realized-outcome-continuation-batch-one-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256")
  .update(await readFile(archivePath))
  .digest("hex")
  .toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter(
  (command) => command !== archiveCommand && command !== "npm run verify:phase56l",
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run validate:content"),
  0,
  archiveCommand,
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run verify:release"),
  0,
  "npm run verify:phase56l",
);

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1360,
  signals: 285,
  published_signals: 219,
  in_review_signals: 66,
  draft_sample_signals: 0,
  published_support_sources: 337,
  sources: 547,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 24,
  published_briefings: 17,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 21,
  research_documents: 396,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 40,
  public_json_exports: 5,
  research_export_records: 375,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1178,
  signals_added: 267,
  published_signals_added: 216,
  sources_added: 445,
  summary:
    "Extends the Phase 55K through Phase 56K evidence baseline with Phase 56L realized-outcome continuation: 547 public sources, 285 signals, 219 Published signals, five local systems, seventeen Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 40 public updates, twenty-one research collections, 396 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56l_delta = {
  exact_records_checked: 3,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 2,
  source_profiles_reused: 1,
  research_documents_added: 3,
  research_documents_published: 2,
  research_documents_in_review: 1,
  signals_reviewed: 2,
  signals_added_published: 2,
  signals_added_in_review: 0,
  downloadable_official_link_records: 3,
  archive_file_count: 6,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 3,
  reader_pathways_deepened: 2,
  topics_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 9,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-25",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-547-sources-285-signals-396-research-documents",
  source_health: "passed",
  source_health_manual_review: 369,
  source_health_probe_ready: 178,
  source_monitor_current: 547,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1360,
  release_assertions: "passed-phase-56l",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56l-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-016-realized-outcome-continuation/index.html",
  "dist/signals/56l-island-components-certified-employment/index.html",
  "dist/signals/56l-monaghan-medical-certified-project/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56l-island-components-certified-employment/",
  "/signals/56l-monaghan-medical-certified-project/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-016-realized-outcome-continuation/",
  "/signals/56l-island-components-certified-employment/",
  "/signals/56l-monaghan-medical-certified-project/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-016-realized-outcome-continuation/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,351 generated HTML pages"))
    return "Confirm 1,360 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 217 Published signal URLs"))
    return "Confirm all 219 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all sixteen Published briefing URLs"))
    return "Confirm all seventeen Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 335 sources supporting Published signals"))
    return "Confirm all 337 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 39-entry public update log"))
    return "Confirm the 40-entry public update log renders";
  if (gate.startsWith("Confirm all twenty research collections"))
    return "Confirm all twenty-one research collections render 396 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all three Phase 56L decisions retain their Phase 56F coverage ID, stable entity ID, exact named record, dated source check, limitation, and reopening rule",
  "Confirm Phase 56L preserves one Closed, twenty-one Partially Closed, and two Open evidence states with no unsupported closure transition",
  "Confirm two Phase 56L research documents and two bounded signals publish while the Current Applications repeat-series non-closure remains In Review",
  "Confirm the Phase 56L collection contains three official-link records and a six-file archive",
  "Confirm Island Components current FTEs are not presented as job causation or proof that the listed project amount was fully spent",
  "Confirm Monaghan's earlier IDA project is not conflated with the separate 2025 ESD commitment",
  "Confirm one Current Applications intervention is not presented as a repeat operating series",
  "Confirm no acquisition result, closure state, or missing disclosure is rendered as performance, productivity, readiness, quality, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) =>
    ![
      "Sixty-six signals, seven briefings, and one dependency map remain In Review",
      "The Phase 56K download contains",
      "Phase 56K changes no evidence state",
    ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-six signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56L download contains three official-link records and three realized-outcome decisions. The Current Applications decision remains In Review because the required repeat series is not published.",
  "Phase 56L changes no evidence state. Reported employment is not job causation, project amount is not executed spending, and the ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes =
  "This manifest records the locally generated Phase 56L realized-outcome continuation package. Three named manufacturer rails are checked without substituting project fields for differently scoped outcomes. Suffolk County IDA reports 33 current Island Components FTEs against 25 before IDA status. Clinton County IDA records Monaghan's earlier $10 million project as construction complete in 2021 and reports 91 current FTEs against 68 before IDA status. Current Applications retains an exact non-closure because its NIST MEP case study is one intervention, not a repeat series. Research Watch 016, the three-record collection, two deepened pathways, two topics, the comparison protocol, and the six-file archive preserve scope, denominator, attribution, no-ranking, no-score, no-productivity, and no-causation rules. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56L manifest with archive SHA-256 ${archiveSha256}.`);
