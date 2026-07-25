import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archivePath = join(appRoot, "public", "downloads", "second-entity-cohort-vertical-replication-2018-2026.zip");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug second-entity-cohort-vertical-replication-2018-2026";
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1204,
  signals: 260,
  published_signals: 199,
  in_review_signals: 61,
  draft_sample_signals: 0,
  published_support_sources: 307,
  sources: 502,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 17,
  published_briefings: 10,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 14,
  research_documents: 324,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 33,
  public_json_exports: 5,
  research_export_records: 324,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1022,
  signals_added: 242,
  published_signals_added: 196,
  sources_added: 400,
  summary: "Extends the Phase 55K through Phase 56D evidence baseline with Phase 56E second-cohort vertical replication: 502 public sources, 260 signals, 199 Published signals, five local systems, ten Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 33 public updates, fourteen research collections, 324 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56e_delta = {
  cohort_candidates_screened: 12,
  cohort_entities_retained: 12,
  insufficient_evidence_holds: 0,
  minimum_primary_records_per_entity: 4,
  source_profiles_added: 40,
  signals_reviewed: 40,
  signals_added_published: 36,
  signals_added_in_review: 4,
  entity_panels_added: 12,
  entity_dossiers_added: 12,
  alternative_explanation_tests_added: 12,
  research_collections_added: 1,
  research_documents_added: 48,
  research_documents_published: 48,
  downloadable_official_link_records: 48,
  archive_file_count: 51,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  reader_pathways_deepened: 6,
  topics_deepened: 8,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 130,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-24",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-502-sources-260-signals-324-research-documents",
  source_health: "passed",
  source_health_manual_review: 341,
  source_health_probe_ready: 161,
  source_monitor_current: 502,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1204,
  release_assertions: "passed-phase-56e",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56e-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  "dist/research/second-entity-cohort-vertical-replication-2018-2026/index.html",
  "dist/downloads/second-entity-cohort-vertical-replication-2018-2026.zip",
  "dist/briefings/research-watch-009-second-cohort-vertical-replication/index.html",
  "dist/signals/56e-va-information-security-panel/index.html",
  "dist/signals/56e-f35-fort-worth-line-dossier/index.html",
  "dist/signals/56e-hornsdale-power-reserve-alternative-test/index.html",
  "dist/signals/56e-alaska-airlines-alternative-test/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  ...[
    "va-information-security",
    "doe-information-security",
    "dot-information-security",
    "f35-fort-worth-line",
    "kc46-everett-line",
    "f15ex-st-louis-line",
    "hornsdale-power-reserve",
    "victorian-big-battery",
    "dalrymple-escri-bess",
    "american-airlines",
    "alaska-airlines",
    "jetblue-airways",
  ].flatMap((entity) => [
    `/signals/56e-${entity}-panel/`,
    `/signals/56e-${entity}-dossier/`,
    `/signals/56e-${entity}-alternative-test/`,
  ]),
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  "/research/second-entity-cohort-vertical-replication-2018-2026/",
  "/downloads/second-entity-cohort-vertical-replication-2018-2026.zip",
  "/briefings/research-watch-009-second-cohort-vertical-replication/",
  "/signals/56e-f35-fort-worth-line-alternative-test/",
  "/signals/56e-alaska-airlines-panel/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-009-second-cohort-vertical-replication/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,074 generated HTML pages")) return "Confirm 1,204 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 163 Published signal URLs")) return "Confirm all 199 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all nine Published briefing URLs")) return "Confirm all ten Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 267 sources supporting Published signals")) return "Confirm all 307 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 32-entry public update log")) return "Confirm the 33-entry public update log renders";
  if (gate.startsWith("Confirm all thirteen research collections render")) return "Confirm all fourteen research collections render 324 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm the Phase 56E cohort screen retains twelve of twelve candidates with at least four primary or official records each",
  "Confirm twelve stable entity IDs resolve across twelve panels, twelve dossiers, and twelve alternative-explanation tests",
  "Confirm the Phase 56E publication review contains forty unique decisions: 36 Published entity layers and four held portfolio interpretations",
  "Confirm the Phase 56E collection contains 48 Published official-link records and a 51-file archive",
  "Confirm every layer preserves entity, unit, denominator, method, attribution, observation window, and reporting breaks",
  "Confirm no causal effect, ranking, composite score, readiness score, or unsupported cross-entity comparison is created",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => ![
    "Fifty-seven signals, seven briefings, and one dependency map remain In Review",
    "The Phase 56E download contains",
    "Phase 56E adds",
  ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-one signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56E download contains 48 official-link records supporting twelve vertically replicated entity records.",
  "Phase 56E preserves stable identity, attribution, compatibility, reporting breaks, and missing denominators; four portfolio interpretations remain held.",
);
manifest.notes = "This manifest records the locally generated Phase 56E second-cohort vertical-replication pass. Twelve of twelve candidates passed the four-primary-record screen. Phase 56E adds 40 source profiles, 48 summaries, twelve panels, twelve driver-and-constraint dossiers, twelve alternative-explanation tests, and four explicit cross-entity holds across VA, DOE, DOT, three named aircraft production lines, three Australian battery assets, and three reporting passenger carriers. Research Watch 009 and the deepened comparison protocol preserve stable identity, attribution, compatibility, reporting breaks, missing denominators, and the no-causation boundary. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56E manifest with archive SHA-256 ${archiveSha256}.`);
