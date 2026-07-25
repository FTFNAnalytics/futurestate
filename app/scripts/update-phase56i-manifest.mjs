import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "remaining-open-rails-partial-closure-first-pass-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1319,
  signals: 275,
  published_signals: 210,
  in_review_signals: 65,
  draft_sample_signals: 0,
  published_support_sources: 328,
  sources: 537,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 21,
  published_briefings: 14,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 18,
  research_documents: 381,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 37,
  public_json_exports: 5,
    research_export_records: 363,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1137,
  signals_added: 257,
  published_signals_added: 207,
  sources_added: 435,
  summary: "Extends the Phase 55K through Phase 56H evidence baseline with Phase 56I remaining-rail continuation and partial-closure first-pass completion: 537 public sources, 275 signals, 210 Published signals, five local systems, fourteen Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 37 public updates, eighteen research collections, 381 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56i_delta = {
  open_records_checked: 3,
  remaining_partially_closed_records_checked: 9,
  closure_changes: 0,
  unchanged_open_records: 3,
  unchanged_partially_closed_records: 9,
  first_pass_complete: true,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 20,
  current_closure_states_open: 3,
  source_profiles_added: 3,
  research_documents_added: 12,
  research_documents_published: 9,
  research_documents_in_review: 3,
  signals_reviewed: 3,
  signals_added_published: 2,
  signals_added_in_review: 1,
  downloadable_official_link_records: 12,
  archive_file_count: 15,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 6,
  topics_deepened: 7,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 20,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-25",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-537-sources-275-signals-381-research-documents",
  source_health: "passed",
  source_health_manual_review: 365,
  source_health_probe_ready: 172,
  source_monitor_current: 537,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1319,
  release_assertions: "passed-phase-56i",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56i-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-013-first-pass-completion/index.html",
  "dist/signals/56i-eia923-monthly-operating-rail/index.html",
  "dist/signals/56i-monaghan-program-commitment/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56i-eia923-monthly-operating-rail/",
  "/signals/56i-monaghan-program-commitment/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-013-first-pass-completion/",
  "/signals/56i-eia923-monthly-operating-rail/",
  "/signals/56i-monaghan-program-commitment/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-013-first-pass-completion/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,299 generated HTML pages")) return "Confirm 1,319 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 208 Published signal URLs")) return "Confirm all 210 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all thirteen Published briefing URLs")) return "Confirm all fourteen Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 326 sources supporting Published signals")) return "Confirm all 328 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 36-entry public update log")) return "Confirm the 37-entry public update log renders";
  if (gate.startsWith("Confirm all seventeen research collections render")) return "Confirm all eighteen research collections render 381 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm DHS, Manatee, and Gateway receive dated Phase 56I continuation decisions and remain Open",
  "Confirm Current Applications, Island Components, Monaghan, United, Southwest, Delta, American, Alaska, and JetBlue complete their first-pass decisions and remain Partially Closed",
  "Confirm nine Phase 56I evidence documents and two genuinely new bounded signals publish while three documents and one synthesis remain In Review",
  "Confirm the Phase 56I collection contains twelve official-link records and a 15-file archive",
  "Confirm existing findings are referenced without being relabeled as new publication claims",
  "Confirm first-pass and closure state is never rendered as performance, readiness, quality, safety, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Sixty-four signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56H download contains",
    "Phase 56H advances",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-five signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56I download contains twelve official-link records and twelve first-pass decisions; three document decisions and one synthesis remain In Review.",
  "Phase 56I produces no closure-state change. DHS, Manatee, and Gateway remain Open; twenty records remain Partially Closed and one remains Closed under evidence-state rules.",
);
manifest.notes = "This manifest records the locally generated Phase 56I remaining-rail continuation and partial-closure first-pass package. DHS, Manatee, and Gateway receive dated continuation decisions and remain Open. Current Applications, Island Components, Monaghan Medical, United, Southwest, Delta, American, Alaska, and JetBlue complete their first-pass decisions and remain Partially Closed. Only genuinely new bounded evidence produces new Published signals: EIA's July 23 monthly operating-data release and Empire State Development's March Monaghan commitment denominator. Existing manufacturer and carrier findings are referenced without being relabeled as new discoveries. Research Watch 013, the completed first-pass ledger, six deepened pathways, seven topics, the comparison protocol, and the fifteen-file archive preserve the no-substitution, no-duplication, no-ranking, no-score, and no-causation boundary. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56I manifest with archive SHA-256 ${archiveSha256}.`);
