import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "open-rail-acquisition-partial-closure-deepening-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1299,
  signals: 272,
  published_signals: 208,
  in_review_signals: 64,
  draft_sample_signals: 0,
  published_support_sources: 326,
  sources: 534,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 20,
  published_briefings: 13,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 17,
  research_documents: 369,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 36,
  public_json_exports: 5,
  research_export_records: 353,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1117,
  signals_added: 254,
  published_signals_added: 205,
  sources_added: 432,
  summary: "Extends the Phase 55K through Phase 56G evidence baseline with Phase 56H open-rail acquisition and partial-closure deepening: 534 public sources, 272 signals, 208 Published signals, five local systems, thirteen Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 36 public updates, seventeen research collections, 369 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56h_delta = {
  phase_56g_open_records_checked: 6,
  phase_56g_partially_closed_records_checked: 8,
  closure_changes_open_to_partially_closed: 3,
  unchanged_open_records: 3,
  unchanged_partially_closed_records: 8,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 20,
  current_closure_states_open: 3,
  source_profiles_added: 11,
  research_documents_added: 14,
  research_documents_published: 8,
  research_documents_in_review: 6,
  signals_reviewed: 5,
  signals_added_published: 4,
  signals_added_in_review: 1,
  downloadable_official_link_records: 14,
  archive_file_count: 17,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 5,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 32,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-534-sources-272-signals-369-research-documents",
  source_health: "passed",
  source_health_manual_review: 363,
  source_health_probe_ready: 171,
  source_monitor_current: 534,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1299,
  release_assertions: "passed-phase-56h",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56h-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-012-acquisition-and-deepening/index.html",
  "dist/signals/56h-doe-fy2025-cyber-result/index.html",
  "dist/signals/56h-f35-delivery-capability-advance/index.html",
  "dist/signals/56h-hornsdale-final-operating-record/index.html",
  "dist/signals/56h-dalrymple-constraint-event/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56h-doe-fy2025-cyber-result/",
  "/signals/56h-f35-delivery-capability-advance/",
  "/signals/56h-hornsdale-final-operating-record/",
  "/signals/56h-dalrymple-constraint-event/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-012-acquisition-and-deepening/",
  "/signals/56h-doe-fy2025-cyber-result/",
  "/signals/56h-f35-delivery-capability-advance/",
  "/signals/56h-hornsdale-final-operating-record/",
  "/signals/56h-dalrymple-constraint-event/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-012-acquisition-and-deepening/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,267 generated HTML pages")) return "Confirm 1,299 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 204 Published signal URLs")) return "Confirm all 208 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twelve Published briefing URLs")) return "Confirm all thirteen Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 322 sources supporting Published signals")) return "Confirm all 326 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 35-entry public update log")) return "Confirm the 36-entry public update log renders";
  if (gate.startsWith("Confirm all sixteen research collections render")) return "Confirm all seventeen research collections render 369 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all six Phase 56G Open records receive one Phase 56H acquisition check and eight Partially Closed records receive a bounded deepening decision",
  "Confirm DOE, F-35 Fort Worth, and Hornsdale move from Open to Partially Closed while DHS, Manatee, and Gateway remain Open",
  "Confirm eight Phase 56H evidence documents and four bounded signals publish while six documents and one synthesis remain In Review",
  "Confirm the Phase 56H collection contains fourteen official-link records and a 17-file archive",
  "Confirm unavailable exact records retain dated continuation rules and adjacent context is not treated as closure",
  "Confirm acquisition and evidence state is never rendered as performance, readiness, quality, safety, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Sixty-three signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56H download contains",
    "Phase 56H advances",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-four signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56H download contains fourteen official-link records and fourteen evidence decisions; six document decisions and one synthesis remain In Review.",
  "Phase 56H advances DOE, F-35 Fort Worth, and Hornsdale only to Partially Closed. DHS, Manatee, and Gateway remain Open, and all eight deepened partial records retain explicit denominator or outcome gaps.",
);
manifest.notes = "This manifest records the locally generated Phase 56H open-rail acquisition and partial-closure deepening package. All six Phase 56G Open rails receive a new named-source check and eight Partially Closed records receive an evidence-value decision. DOE advances on its FY 2025 unclassified cybersecurity management letter, F-35 Fort Worth advances on GAO delivery, backlog, acceptance, and capability-state observations, and Hornsdale advances on ARENA's final asset-specific project record. DHS, Manatee, and Gateway remain Open. NASA, HHS, VA, DOT, Moss Landing, KC-46A, Dalrymple, and F-15EX remain Partially Closed with explicit next records. Research Watch 012, four Published bounded signals, one held synthesis, five deepened pathways, five topics, the comparison protocol, and the seventeen-file archive preserve the no-substitution, no-ranking, no-score, and no-causation boundary. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56H manifest with archive SHA-256 ${archiveSha256}.`);
