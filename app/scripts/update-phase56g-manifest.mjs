import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "operating-record-acquisition-closure-batch-two-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1267,
  signals: 267,
  published_signals: 204,
  in_review_signals: 63,
  draft_sample_signals: 0,
  published_support_sources: 322,
  sources: 523,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 19,
  published_briefings: 12,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 16,
  research_documents: 355,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 35,
  public_json_exports: 5,
  research_export_records: 344,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1085,
  signals_added: 249,
  published_signals_added: 201,
  sources_added: 421,
  summary: "Extends the Phase 55K through Phase 56F evidence baseline with Phase 56G operating-record acquisition and closure batch two: 523 public sources, 267 signals, 204 Published signals, five local systems, twelve Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 35 public updates, sixteen research collections, 355 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56g_delta = {
  phase_56f_open_records_checked: 7,
  closure_changes_open_to_partially_closed: 1,
  unchanged_open_records: 6,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 17,
  current_closure_states_open: 6,
  source_profiles_added: 7,
  research_documents_added: 7,
  research_documents_published: 1,
  research_documents_in_review: 6,
  signals_reviewed: 2,
  signals_added_published: 1,
  signals_added_in_review: 1,
  downloadable_official_link_records: 7,
  archive_file_count: 10,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 5,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 18,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-523-sources-267-signals-355-research-documents",
  source_health: "passed",
  source_health_manual_review: 355,
  source_health_probe_ready: 168,
  source_monitor_current: 523,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1267,
  release_assertions: "passed-phase-56g",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56g-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-011-operating-record-acquisition/index.html",
  "dist/signals/56g-dalrymple-operating-record-advance/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56g-dalrymple-operating-record-advance/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-011-operating-record-acquisition/",
  "/signals/56g-dalrymple-operating-record-advance/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-011-operating-record-acquisition/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,249 generated HTML pages")) return "Confirm 1,267 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 203 Published signal URLs")) return "Confirm all 204 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all eleven Published briefing URLs")) return "Confirm all twelve Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 321 sources supporting Published signals")) return "Confirm all 322 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 34-entry public update log")) return "Confirm the 35-entry public update log renders";
  if (gate.startsWith("Confirm all fifteen research collections render")) return "Confirm all sixteen research collections render 355 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all seven Phase 56F Open records receive one Phase 56G acquisition check tied to the existing coverage ID and reopening rule",
  "Confirm Dalrymple moves from Open to Partially Closed while the other six selected records remain Open",
  "Confirm one Phase 56G acquisition document and one bounded signal publish while six documents and one synthesis remain In Review",
  "Confirm the Phase 56G collection contains seven official-link records and a 10-file archive",
  "Confirm unavailable exact records retain dated continuation rules and are not replaced by adjacent context",
  "Confirm acquisition and closure status is never rendered as performance, readiness, quality, safety, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Sixty-two signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56G download contains",
    "Phase 56G checks",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-three signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56G download contains seven official-link records and seven acquisition decisions; six exact-record decisions remain In Review.",
  "Phase 56G checks all seven Open rails but changes only Dalrymple to Partially Closed. Current adjacent records do not close the six remaining exact gaps.",
);
manifest.notes = "This manifest records the locally generated Phase 56G operating-record acquisition and closure batch two. All seven Open Phase 56F rails receive a dated named-source check tied to the existing coverage ID and reopening rule. Dalrymple advances to Partially Closed because ElectraNet's March 2026 plan supplies a later asset-specific control-scheme record; DHS, DOE, F-35 Fort Worth, Manatee, Gateway, and Hornsdale remain Open because the exact annual, monthly, interval, investigation, restoration, or annual-operation record is still unavailable. Research Watch 011, one Published bounded signal, one held synthesis, five deepened pathways, five topics, the comparison protocol, and the ten-file archive preserve the no-substitution, no-ranking, no-score, and no-causation boundary. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56G manifest with archive SHA-256 ${archiveSha256}.`);
