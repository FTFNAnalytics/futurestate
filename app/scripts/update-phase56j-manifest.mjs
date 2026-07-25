import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "evidence-value-continuation-queue-batch-one-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1336,
  signals: 280,
  published_signals: 214,
  in_review_signals: 66,
  draft_sample_signals: 0,
  published_support_sources: 332,
  sources: 542,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 22,
  published_briefings: 15,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 19,
  research_documents: 386,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 38,
  public_json_exports: 5,
  research_export_records: 368,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1154,
  signals_added: 262,
  published_signals_added: 211,
  sources_added: 440,
  summary:
    "Extends the Phase 55K through Phase 56I evidence baseline with Phase 56J evidence-value continuation: 542 public sources, 280 signals, 214 Published signals, five local systems, fifteen Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 38 public updates, nineteen research collections, 386 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56j_delta = {
  original_partially_closed_records_ordered: 20,
  open_rails_continued: 3,
  batch_one_records_checked: 5,
  closure_changes: 1,
  manatee_prior_state: "Open",
  manatee_current_state: "Partially Closed",
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 5,
  research_documents_added: 5,
  research_documents_published: 4,
  research_documents_in_review: 1,
  signals_reviewed: 5,
  signals_added_published: 4,
  signals_added_in_review: 1,
  downloadable_official_link_records: 5,
  archive_file_count: 8,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 5,
  topics_deepened: 5,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 17,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-25",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-542-sources-280-signals-386-research-documents",
  source_health: "passed",
  source_health_manual_review: 367,
  source_health_probe_ready: 175,
  source_monitor_current: 542,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1336,
  release_assertions: "passed-phase-56j",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56j-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-014-evidence-value-continuation/index.html",
  "dist/signals/56j-manatee-monthly-operation/index.html",
  "dist/signals/56j-dalrymple-march-constraint/index.html",
  "dist/signals/56j-hornsdale-event-operation/index.html",
  "dist/signals/56j-kc46-readiness-plan/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56j-manatee-monthly-operation/",
  "/signals/56j-dalrymple-march-constraint/",
  "/signals/56j-hornsdale-event-operation/",
  "/signals/56j-kc46-readiness-plan/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-014-evidence-value-continuation/",
  "/signals/56j-manatee-monthly-operation/",
  "/signals/56j-dalrymple-march-constraint/",
  "/signals/56j-hornsdale-event-operation/",
  "/signals/56j-kc46-readiness-plan/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-014-evidence-value-continuation/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,319 generated HTML pages")) return "Confirm 1,336 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 210 Published signal URLs")) return "Confirm all 214 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all fourteen Published briefing URLs")) return "Confirm all fifteen Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 328 sources supporting Published signals")) return "Confirm all 332 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 37-entry public update log")) return "Confirm the 38-entry public update log renders";
  if (gate.startsWith("Confirm all eighteen research collections render")) return "Confirm all nineteen research collections render 386 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all twenty original Partially Closed continuation rules receive deterministic evidence-opportunity order without an entity-performance ranking",
  "Confirm DHS, Manatee, and Gateway remain active and only Manatee moves from Open to Partially Closed on the exact EIA plant record",
  "Confirm four Phase 56J evidence documents and four bounded signals publish while the DOE/FERC scope decision remains In Review",
  "Confirm the Phase 56J collection contains five official-link records and an eight-file archive",
  "Confirm EIA survey fields are not converted into an unreconciled efficiency claim",
  "Confirm KC-46 availability percentages remain plan targets and the Hornsdale report remains operator-attributed",
  "Confirm no acquisition order, closure state, or missing disclosure is rendered as performance, readiness, quality, safety, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) =>
    ![
      "Sixty-five signals, seven briefings, and one dependency map remain In Review",
      "The Phase 56I download contains",
      "Phase 56I produces no closure-state change",
    ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-six signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56J download contains five official-link records and five continuation decisions; the DOE/FERC document and signal remain In Review because the agency scope does not match.",
  "Phase 56J changes only Manatee from Open to Partially Closed. DHS and Gateway remain Open; twenty-one records are Partially Closed and one remains Closed under evidence-state rules.",
);
manifest.notes =
  "This manifest records the locally generated Phase 56J evidence-value continuation package. The twenty original Partially Closed continuation rules receive a deterministic acquisition order based on likely evidence gain, source authority, denominator fit, and current availability; the order does not rank entities. DHS, Manatee, and Gateway remain active. The exact EIA-923 plant 60014 rows move Manatee from Open to Partially Closed while interval availability remains unresolved. Later Dalrymple constraint evidence, Hornsdale event-level operator evidence, and the Air Force KC-46 plan publish with explicit unit, attribution, and target boundaries. The FERC FY 2025 result remains held because it cannot substitute for a department-wide DOE result. Research Watch 014, the five-record collection, five deepened pathways, five topics, the comparison protocol, and the eight-file archive preserve no-substitution, no-ranking, no-score, and no-causation rules. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56J manifest with archive SHA-256 ${archiveSha256}.`);
