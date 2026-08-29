import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "gao-recommendation-artifact-scope-audit-missing-document-register-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56s-artifact-scope-audit-missing-document-register.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const allSignalSlugs = ledger.records.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56s");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56s");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1656,
  signals: 397,
  published_signals: 329,
  in_review_signals: 68,
  draft_sample_signals: 0,
  published_support_sources: 393,
  sources: 604,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 31,
  published_briefings: 24,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 28,
  research_documents: 509,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 47,
  public_json_exports: 5,
  research_export_records: 492,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1474,
  signals_added: 379,
  published_signals_added: 326,
  sources_added: 502,
  summary: "Extends the Phase 55K through Phase 56R evidence baseline with Phase 56S recommendation artifact scope audits: 604 public sources, 397 signals, 329 Published signals, five local systems, twenty-four Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 47 public updates, twenty-eight research collections, 509 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56s_delta = {
  recommendation_records_audited: 24,
  directive_elements_checked: 72,
  scope_elements_supported: 3,
  scope_elements_partially_supported: 23,
  scope_elements_not_established: 46,
  public_candidate_artifacts_gao_sufficiency_unresolved: 3,
  scope_adjacent_public_material_results: 13,
  no_separately_public_response_artifact_results: 8,
  implementation_changes: 0,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 12,
  research_documents_added_published: 24,
  signals_added_published: 24,
  downloadable_official_link_records: 24,
  archive_file_count: 27,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 3,
  topics_deepened: 6,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 62,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-604-sources-397-signals-509-research-documents",
  source_health: "passed",
  source_health_manual_review: 418,
  source_health_probe_ready: 186,
  source_monitor_current: 604,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1656,
  release_assertions: "passed-phase-56s",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56s-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-023-recommendation-artifact-scope-audit/index.html",
  ...allSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, allSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-023-recommendation-artifact-scope-audit/",
  ...allSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-023-recommendation-artifact-scope-audit/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,594 generated HTML pages")) return "Confirm 1,656 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 305 Published signal URLs")) return "Confirm all 329 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty-three Published briefing URLs")) return "Confirm all twenty-four Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 381 sources supporting Published signals")) return "Confirm all 393 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 46-entry public update log")) return "Confirm the 47-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-seven research collections")) return "Confirm all twenty-eight research collections render 509 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all twenty-four Phase 56S records contain exactly three directive-element checks and a named official-repository search trail",
  "Confirm the Phase 56S ledger contains three supported, twenty-three partially supported, and forty-six not-established public-scope elements",
  "Confirm three public candidate artifacts remain explicitly subject to unresolved GAO sufficiency",
  "Confirm thirteen records are labeled scope-adjacent and eight are labeled no separately public response artifact located",
  "Confirm not publicly located never renders as nonexistent and public availability never renders as sufficient, implemented, or closed",
  "Confirm Phase 56S records zero implementation and closure changes and preserves one Closed, twenty-one Partially Closed, and two Open entity evidence states",
  "Confirm HHS-04 and VA-02 remain intact as In Review parent crosswalks while their four recommendation-specific children remain Published",
  "Confirm twelve official source profiles are current and all declared download endpoints are populated",
  "Confirm the Phase 56S collection contains twenty-four official-link records and a twenty-seven-file archive",
  "Confirm no document-scope finding is rendered as agency performance, readiness, safety, savings, value, ranking, composite score, or causation",
]);
manifest.known_limitations = manifest.known_limitations.filter((item) => ![
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q",
  "HHS-04 and VA-02 remain In Review as parent crosswalks",
  "The Phase 56R download contains",
  "Phase 56R records no implementation or closure change",
].some((prefix) => item.startsWith(prefix)));
manifest.known_limitations.unshift(
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q parent documents, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "HHS-04 and VA-02 remain In Review as parent crosswalks, while their four recommendation-specific children remain Published without overwriting either parent.",
  "Phase 56S found three public candidate artifacts with unresolved GAO sufficiency, thirteen scope-adjacent public records, and eight cases where no separately public response artifact was located; absence from the bounded search does not establish nonexistence.",
  "Phase 56S records no implementation or closure change. A public artifact is not necessarily sufficient, an FTFN scope finding is not a GAO acceptance decision, and recommendation closure would not by itself establish operating outcome; the entity ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes = "This manifest records the locally generated Phase 56S recommendation artifact scope-audit package. Twenty-four exact recommendation records now carry seventy-two directive-element checks, named repository trails, twelve new official sources, visible-scope findings, public-document availability classes, and separate GAO-acceptance states. Three public candidates, thirteen adjacent records, and eight missing-public-copy results preserve the distinction between availability, visible scope, authoritative sufficiency, implementation, closure, Phase 56F evidence state, and operating outcome. Research Watch 023, the twenty-four-record collection, six entity ledgers, three pathways, six topics, two organizations, the comparison protocol, and the twenty-seven-file archive retain no-ranking, no-score, no-readiness, no-savings, no-value, and no-causation rules. Dated checks remain bounded inserts. The inherited HHS tracker hold remains separate. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56S manifest with archive SHA-256 ${archiveSha256}.`);
