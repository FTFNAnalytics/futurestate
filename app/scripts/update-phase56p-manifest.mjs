import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "agency-priority-recommendation-action-ledger-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56p-action-recommendation-ledger.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const signalSlugs = ledger.records.map((record) => record.signal_id.replace(/^signal-/, ""));

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56p");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56p");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1472,
  signals: 327,
  published_signals: 261,
  in_review_signals: 66,
  draft_sample_signals: 0,
  published_support_sources: 355,
  sources: 566,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 28,
  published_briefings: 21,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 25,
  research_documents: 439,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 44,
  public_json_exports: 5,
  research_export_records: 421,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1290,
  signals_added: 309,
  published_signals_added: 258,
  sources_added: 464,
  summary: "Extends the Phase 55K through Phase 56O evidence baseline with Phase 56P action-level priority recommendations: 566 public sources, 327 signals, 261 Published signals, five local systems, twenty-one Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 44 public updates, twenty-five research collections, 439 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56p_delta = {
  letter_named_actions_checked: 22,
  doe_actions: 5,
  hhs_actions: 4,
  dot_actions: 8,
  va_actions: 5,
  coverage_decisions: 4,
  contextual_phase_56o_records_retained: 4,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 4,
  research_documents_added_published: 22,
  signals_added_published: 22,
  downloadable_official_link_records: 22,
  archive_file_count: 25,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 3,
  topics_deepened: 6,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 50,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-01",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-566-sources-327-signals-439-research-documents",
  source_health: "passed",
  source_health_manual_review: 388,
  source_health_probe_ready: 178,
  source_monitor_current: 566,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1472,
  release_assertions: "passed-phase-56p",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56p-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-020-action-level-priority-recommendations/index.html",
  ...signalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, signalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-020-action-level-priority-recommendations/",
  ...signalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-020-action-level-priority-recommendations/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,422 generated HTML pages")) return "Confirm 1,472 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 239 Published signal URLs")) return "Confirm all 261 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty Published briefing URLs")) return "Confirm all twenty-one Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 351 sources supporting Published signals")) return "Confirm all 355 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 43-entry public update log")) return "Confirm the 44-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-four research collections")) return "Confirm all twenty-five research collections render 439 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all twenty-two Phase 56P records retain stable agency, letter, subject, exact action text, local key, status period, identity boundary, limitation, publication decision, and reopening rule",
  "Confirm Phase 56P preserves one Closed, twenty-one Partially Closed, and two Open evidence states with no unsupported closure transition",
  "Confirm the Phase 56P action split remains five DOE, four HHS, eight DOT, and five VA records",
  "Confirm every Phase 56P local action key is labeled as an FTFN reference and never rendered as a GAO Recommendations Database number",
  "Confirm all twenty-two actions remain letter-named open priorities and none is presented as implemented, closed, or a complete agency portfolio inventory",
  "Confirm GSA, OSTP, NTIA, and the government-wide model remain contextual Phase 56O records and the inherited HHS tracker record remains In Review",
  "Confirm the Phase 56P collection contains twenty-two action-specific official-link records and a twenty-five-file archive",
  "Confirm no priority action is rendered as agency performance, productivity, readiness, safety, quality, value, a ranking, a composite, realized savings, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => !["Sixty-six signals, seven briefings, one dependency map, and one Phase 56N", "The Phase 56P download contains", "Phase 56P changes no"].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-six signals, seven briefings, one dependency map, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "The Phase 56P download contains twenty-two Published action-specific official-link records from four full-report sources. Local action keys are stable FTFN references, not GAO Recommendations Database numbers.",
  "Phase 56P changes no Phase 56F evidence state. A letter-named open priority action is not implementation, closure, agency performance, operating outcome, or realized benefit; the ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes = "This manifest records the locally generated Phase 56P action-level priority-recommendation package. Four current GAO agency letters supply twenty-two explicitly named actions: five DOE, four HHS, eight DOT, and five VA. Each action receives a stable local FTFN key tied to its agency and letter; those keys are not GAO Recommendations Database numbers. Research Watch 020, the twenty-two-record collection, three deepened pathways, six topics, two organizations, the comparison protocol, and the twenty-five-file archive preserve agency, letter, subject, action text, local key, official identity, response, implementation, closure, outcome, no-ranking, no-score, no-readiness, no-value, and no-causation rules. GSA, OSTP, NTIA, and the government-wide model remain contextual Phase 56O records, and the inherited HHS tracker record remains held. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56P manifest with archive SHA-256 ${archiveSha256}.`);
