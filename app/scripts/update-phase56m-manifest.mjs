import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "federal-remediation-outcomes-batch-one-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256")
  .update(await readFile(archivePath))
  .digest("hex")
  .toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter(
  (command) => command !== archiveCommand && command !== "npm run verify:phase56m",
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run validate:content"),
  0,
  archiveCommand,
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run verify:release"),
  0,
  "npm run verify:phase56m",
);

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1370,
  signals: 288,
  published_signals: 222,
  in_review_signals: 66,
  draft_sample_signals: 0,
  published_support_sources: 339,
  sources: 549,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 25,
  published_briefings: 18,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 22,
  research_documents: 399,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 41,
  public_json_exports: 5,
  research_export_records: 379,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1188,
  signals_added: 270,
  published_signals_added: 219,
  sources_added: 447,
  summary:
    "Extends the Phase 55K through Phase 56L evidence baseline with Phase 56M federal remediation and outcome continuation: 549 public sources, 288 signals, 222 Published signals, five local systems, eighteen Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 41 public updates, twenty-two research collections, 399 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56m_delta = {
  exact_records_checked: 3,
  coverage_decisions: 2,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 2,
  source_profiles_reused: 1,
  research_documents_added_published: 3,
  signals_reviewed: 3,
  signals_added_published: 3,
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
  generated_pages_added: 10,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-07-25",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-549-sources-288-signals-399-research-documents",
  source_health: "passed",
  source_health_manual_review: 371,
  source_health_probe_ready: 178,
  source_monitor_current: 549,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1370,
  release_assertions: "passed-phase-56m",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56m-visual-qa-not-requested",
};
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-017-federal-remediation-outcomes/index.html",
  "dist/signals/56m-nasa-gao-sixteen-open-recommendations/index.html",
  "dist/signals/56m-hhs-large-hospital-open-cyber-actions/index.html",
  "dist/signals/56m-hhs-small-hospital-effective-cyber-test/index.html",
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, [
  "/signals/56m-nasa-gao-sixteen-open-recommendations/",
  "/signals/56m-hhs-large-hospital-open-cyber-actions/",
  "/signals/56m-hhs-small-hospital-effective-cyber-test/",
]);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-017-federal-remediation-outcomes/",
  "/signals/56m-nasa-gao-sixteen-open-recommendations/",
  "/signals/56m-hhs-large-hospital-open-cyber-actions/",
  "/signals/56m-hhs-small-hospital-effective-cyber-test/",
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-017-federal-remediation-outcomes/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,360 generated HTML pages"))
    return "Confirm 1,370 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 219 Published signal URLs"))
    return "Confirm all 222 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all seventeen Published briefing URLs"))
    return "Confirm all eighteen Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (
    gate.startsWith("Confirm all 337 sources supporting Published signals") ||
    gate.startsWith("Confirm all 340 sources supporting Published signals")
  )
    return "Confirm all 339 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 40-entry public update log"))
    return "Confirm the 41-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-one research collections"))
    return "Confirm all twenty-two research collections render 399 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all three Phase 56M records retain their Phase 56F coverage ID, stable agency or provider identity, exact audit or recommendation identity, tested or status period, finding, limitation, and reopening rule",
  "Confirm Phase 56M preserves one Closed, twenty-one Partially Closed, and two Open evidence states with no unsupported closure transition",
  "Confirm all sixteen GAO-25-108138 recommendations publish as Open under the May 2026 status notes and none is presented as implemented or closed",
  "Confirm the large-hospital record keeps report A-18-22-08021 distinct from tracker actions 26-A-18-035.01 through .04 and labels all four actions Open Unimplemented",
  "Confirm the small-hospital no-recommendation result remains limited to four selected public-facing websites tested in June 2025",
  "Confirm neither anonymous provider test is generalized to HHS, CMS, the health sector, or later operations",
  "Confirm the Phase 56M collection contains three official-link records and a six-file archive",
  "Confirm no remediation status or selected-system test is rendered as performance, productivity, readiness, quality, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) =>
    ![
      "Sixty-six signals, seven briefings, and one dependency map remain In Review",
      "The Phase 56L download contains",
      "Phase 56L changes no evidence state",
      "The Phase 56M download contains",
      "Phase 56M changes no evidence state",
    ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-six signals, seven briefings, and one dependency map remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56M download contains three official-link records and three Published decisions. NASA supplies an exact non-closure; the two HHS component tests retain different anonymous entities, periods, frameworks, and findings.",
  "Phase 56M changes no evidence state. Open recommendations, an effective selected-system test, and a no-recommendation result are not agency closure or comparative performance; the ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes =
  "This manifest records the locally generated Phase 56M federal remediation and outcome continuation package. GAO-25-108138 recommendations 1-16 remain Open under status notes current through May 2026. HHS OIG report A-18-22-08021 supplies a bounded anonymous-provider test with four Open Unimplemented tracker actions; OAS-25-18-033 supplies a separate June 2025 selected-system test with no recommendations. Research Watch 017, the three-record collection, two deepened pathways, two topics, the comparison protocol, and the six-file archive preserve agency/provider, identity, period, scope, denominator, no-ranking, no-score, no-readiness, no-value, and no-causation rules. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56M manifest with archive SHA-256 ${archiveSha256}.`);
