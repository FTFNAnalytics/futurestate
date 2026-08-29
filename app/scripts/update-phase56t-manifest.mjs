import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "gao-official-response-acquisition-artifact-sufficiency-decision-queue-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56t-official-response-acquisition-artifact-sufficiency-queue.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const allSignalSlugs = ledger.records.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56t");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56t");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1714,
  signals: 421,
  published_signals: 353,
  in_review_signals: 68,
  draft_sample_signals: 0,
  published_support_sources: 401,
  sources: 612,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 32,
  published_briefings: 25,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 29,
  research_documents: 533,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 48,
  public_json_exports: 5,
  research_export_records: 517,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1532,
  signals_added: 403,
  published_signals_added: 350,
  sources_added: 510,
  summary: "Extends the Phase 55K through Phase 56S evidence baseline with Phase 56T official-response acquisition and artifact-sufficiency controls: 612 public sources, 421 signals, 353 Published signals, five local systems, twenty-five Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 48 public updates, twenty-nine research collections, 533 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56t_delta = {
  ...(manifest.phase_56t_delta ?? {}),
  recommendation_records_controlled: 24,
  directive_element_decisions: 72,
  missing_document_acquisition_tickets: 8,
  adjacent_source_directive_matrices: 13,
  public_candidate_sufficiency_matrices: 3,
  repository_source_profiles_added: 8,
  implementation_changes: 0,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  research_documents_added_published: 24,
  signals_added_published: 24,
  downloadable_decision_records: 24,
  archive_file_count: 27,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 3,
  topics_deepened: 6,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 58,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-612-sources-421-signals-533-research-documents",
  source_health: "passed",
  source_health_manual_review: 425,
  source_health_probe_ready: 187,
  source_monitor_current: 612,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1714,
  release_assertions: "passed-phase-56t",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56t-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-024-official-response-acquisition-queue/index.html",
  ...allSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, allSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-024-official-response-acquisition-queue/",
  ...allSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-024-official-response-acquisition-queue/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,656 generated HTML pages")) return "Confirm 1,714 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 329 Published signal URLs")) return "Confirm all 353 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty-four Published briefing URLs")) return "Confirm all twenty-five Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 393 sources supporting Published signals")) return "Confirm all 401 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 47-entry public update log")) return "Confirm the 48-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-eight research collections")) return "Confirm all twenty-nine research collections render 533 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 56T contains exactly eight missing-document acquisition tickets, thirteen adjacent-source directive matrices, and three public-candidate sufficiency matrices",
  "Confirm all twenty-four Phase 56T records name the target artifact, likely custodian, priority repositories, search terms, stop rule, reopening trigger, next action, and GAO acceptance state",
  "Confirm all seventy-two directive decisions include an evidence locator and an explicit GAO-authority boundary",
  "Confirm a failed bounded public search never renders as nonexistence, withholding, or failure to submit",
  "Confirm the FAA 2026 Drone Normalization Strategy uses its verified official PDF download endpoint",
  "Confirm Phase 56T records zero implementation and closure changes and preserves one Closed, twenty-one Partially Closed, and two Open entity evidence states",
  "Confirm eight official repository-routing source profiles are current and all declared download endpoints are populated",
  "Confirm the Phase 56T collection contains twenty-four decision records and a twenty-seven-file archive",
  "Confirm no retrieval or sufficiency result is rendered as agency performance, readiness, safety, savings, value, ranking, composite score, or causation",
]);
manifest.known_limitations = manifest.known_limitations.filter((item) => ![
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q",
  "HHS-04 and VA-02 remain In Review as parent crosswalks",
  "Phase 56S found three public candidate artifacts",
  "Phase 56S records no implementation or closure change",
].some((prefix) => item.startsWith(prefix)));
manifest.known_limitations.unshift(
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q parent documents, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "HHS-04 and VA-02 remain In Review as parent crosswalks, while their four recommendation-specific children remain Published without overwriting either parent.",
  "Phase 56T converts eight missing-public-copy results into acquisition tickets, thirteen adjacent records into directive matrices, and three public candidates into page- or section-level matrices; none establishes that an unavailable artifact does not exist.",
  "Phase 56T records no implementation or closure change. A repository route or FTFN matrix is not GAO acceptance, implementation, closure, or operating outcome evidence; the entity ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes = "This manifest records the locally generated Phase 56T official-response acquisition and artifact-sufficiency package. Twenty-four exact recommendation records now carry eight acquisition tickets, thirteen adjacent-source directive matrices, three public-candidate matrices, seventy-two directive locators, eight official repository-routing sources, named custodians, search terms, stop rules, reopening triggers, next actions, and separate GAO-acceptance states. Research Watch 024, the twenty-four-record collection, six entity ledgers, three pathways, six topics, two organizations, the comparison protocol, and the twenty-seven-file archive retain nonexistence, no-ranking, no-score, no-readiness, no-savings, no-value, and no-causation rules. Dated checks remain bounded inserts. The inherited HHS tracker hold remains separate. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56T manifest with archive SHA-256 ${archiveSha256}.`);
