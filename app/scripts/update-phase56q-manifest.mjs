import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "gao-recommendation-identity-agency-response-crosswalk-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56q-recommendation-identity-crosswalk.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const allSignalSlugs = ledger.records.map((record) => record.signal_id.replace(/^signal-/, ""));
const publishedSignalSlugs = publishedRecords.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56q");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56q");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1539,
  signals: 349,
  published_signals: 281,
  in_review_signals: 68,
  draft_sample_signals: 0,
  published_support_sources: 374,
  sources: 587,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 29,
  published_briefings: 22,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 26,
  research_documents: 461,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 45,
  public_json_exports: 5,
  research_export_records: 442,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1357,
  signals_added: 331,
  published_signals_added: 278,
  sources_added: 485,
  summary: "Extends the Phase 55K through Phase 56P evidence baseline with Phase 56Q recommendation identity and agency-response resolution: 587 public sources, 349 signals, 281 Published signals, five local systems, twenty-two Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 45 public updates, twenty-six research collections, 461 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56q_delta = {
  local_actions_checked: 22,
  exact_one_to_one_matches_published: 20,
  one_to_many_local_actions_held: 2,
  official_recommendation_candidates_inside_holds: 4,
  exact_status_open: 18,
  exact_status_open_partially_addressed: 2,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 21,
  research_documents_added_published: 20,
  research_documents_added_in_review: 2,
  signals_added_published: 20,
  signals_added_in_review: 2,
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
  generated_pages_added: 67,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-01",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-587-sources-349-signals-461-research-documents",
  source_health: "passed",
  source_health_manual_review: 409,
  source_health_probe_ready: 178,
  source_monitor_current: 587,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1539,
  release_assertions: "passed-phase-56q",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56q-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-021-gao-recommendation-identity-agency-response/index.html",
  ...allSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, publishedSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-021-gao-recommendation-identity-agency-response/",
  ...publishedSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-021-gao-recommendation-identity-agency-response/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,472 generated HTML pages")) return "Confirm 1,539 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 261 Published signal URLs")) return "Confirm all 281 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty-one Published briefing URLs")) return "Confirm all twenty-two Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 355 sources supporting Published signals")) return "Confirm all 374 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 44-entry public update log")) return "Confirm the 45-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-five research collections")) return "Confirm all twenty-six research collections render 461 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all twenty-two Phase 56Q records preserve local action key, official report, recommendation number or hold, affected component, status, response, update period, limitation, publication decision, and continuation rule",
  "Confirm exactly twenty Phase 56Q records publish as one-to-one matches and HHS-04 plus VA-02 remain In Review as one-to-many mappings",
  "Confirm the two held local actions preserve four distinct official recommendation candidates and receive no single official identity",
  "Confirm eighteen exact matches are Open and two are Open – Partially Addressed without translating either status into a Phase 56F evidence-state change",
  "Confirm Phase 56Q preserves one Closed, twenty-one Partially Closed, and two Open entity evidence states",
  "Confirm every official identity uses the GAO report number plus recommendation number and no opaque database ID is invented",
  "Confirm the inherited HHS tracker hold and four Phase 56O contextual records remain separate",
  "Confirm the Phase 56Q collection contains twenty-two official-link records and a twenty-five-file archive",
  "Confirm no agency response is rendered as implementation, closure, agency performance, readiness, safety, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter((item) => ![
  "Sixty-six signals, seven briefings, one dependency map, and one Phase 56N",
  "The Phase 56P download contains",
  "Phase 56P changes no",
].some((prefix) => item.startsWith(prefix)));
manifest.known_limitations.unshift(
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q research documents, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "HHS-04 and VA-02 each combine two official recommendations. Their Phase 56Q records remain held until recommendation-specific child records preserve the split.",
  "The Phase 56Q download contains twenty-two action-specific official-link records from twenty-one GAO product pages; twenty exact identities publish and two one-to-many mappings remain In Review.",
  "Phase 56Q changes no Phase 56F evidence state. Agency response is not implementation, recommendation status is not the entity evidence ledger, and recommendation closure would not by itself establish operating outcome; the ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes = "This manifest records the locally generated Phase 56Q GAO recommendation identity and agency-response package. Twenty of twenty-two Phase 56P action keys resolve one-to-one to official report-and-recommendation identities. HHS-04 and VA-02 each aggregate two separately numbered recommendations and remain In Review without a single official identity. Research Watch 021, the twenty-two-record collection, three deepened pathways, six topics, two organizations, the comparison protocol, and the twenty-five-file archive preserve local action, report, recommendation, affected component, status, response, update period, implementation, closure, Phase 56F evidence state, outcome, no-ranking, no-score, no-readiness, no-value, and no-causation rules. The inherited HHS tracker hold and four Phase 56O contextual records remain separate. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56Q manifest with archive SHA-256 ${archiveSha256}.`);
