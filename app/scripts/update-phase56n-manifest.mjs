import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "verified-remediation-component-outcomes-batch-two-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256")
  .update(await readFile(archivePath))
  .digest("hex")
  .toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter(
  (command) => command !== archiveCommand && command !== "npm run verify:phase56n",
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run validate:content"),
  0,
  archiveCommand,
);
manifest.predeploy_commands.splice(
  manifest.predeploy_commands.indexOf("npm run verify:release"),
  0,
  "npm run verify:phase56n",
);

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1396,
  signals: 297,
  published_signals: 231,
  in_review_signals: 66,
  draft_sample_signals: 0,
  published_support_sources: 343,
  sources: 554,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 26,
  published_briefings: 19,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 23,
  research_documents: 409,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 42,
  public_json_exports: 5,
  research_export_records: 389,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1214,
  signals_added: 279,
  published_signals_added: 228,
  sources_added: 452,
  summary:
    "Extends the Phase 55K through Phase 56M evidence baseline with Phase 56N verified remediation and component outcomes: 554 public sources, 297 signals, 231 Published signals, five local systems, nineteen Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 42 public updates, twenty-three research collections, 409 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56n_delta = {
  exact_records_checked: 10,
  coverage_decisions: 6,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 5,
  records_reusing_batch_sources: 5,
  research_documents_added_published: 9,
  research_documents_added_in_review: 1,
  signals_reviewed: 9,
  signals_added_published: 9,
  signals_added_in_review: 0,
  downloadable_official_link_records: 10,
  archive_file_count: 13,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 2,
  topics_deepened: 3,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 26,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-01",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-554-sources-297-signals-409-research-documents",
  source_health: "passed",
  source_health_manual_review: 376,
  source_health_probe_ready: 178,
  source_monitor_current: 554,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1396,
  release_assertions: "passed-phase-56n",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56n-visual-qa-not-requested",
};

const signalSlugs = [
  "56n-nasa-ai-recommendations-open",
  "56n-doe-ai-inventory-recommendation-open",
  "56n-hhs-ai-recommendations-split",
  "56n-dhs-ai-recommendations-two-closed-one-open",
  "56n-dot-ai-recommendations-split",
  "56n-va-ai-inventory-recommendation-closed",
  "56n-dhs-priority-recommendation-portfolio",
  "56n-doe-insider-threat-five-closed-two-partial",
  "56n-va-southern-oregon-three-closed-five-open",
];
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-018-verified-remediation-outcomes/index.html",
  ...signalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(
  manifest.published_signal_routes,
  signalSlugs.map((slug) => `/signals/${slug}/`),
);
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-018-verified-remediation-outcomes/",
  ...signalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-018-verified-remediation-outcomes/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,370 generated HTML pages"))
    return "Confirm 1,396 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 222 Published signal URLs"))
    return "Confirm all 231 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all eighteen Published briefing URLs"))
    return "Confirm all nineteen Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 339 sources supporting Published signals"))
    return "Confirm all 343 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 41-entry public update log"))
    return "Confirm the 42-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-two research collections"))
    return "Confirm all twenty-three research collections render 409 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all ten Phase 56N records retain their Phase 56F coverage ID, stable agency or component identity, exact recommendation or report identity, status period, finding, limitation, publication decision, and reopening rule",
  "Confirm Phase 56N preserves one Closed, twenty-one Partially Closed, and two Open evidence states with no unsupported closure transition",
  "Confirm nine Phase 56N documents and signals publish while the HHS post-July 29 tracker check remains In Review",
  "Confirm NASA recommendations 33 and 34 and DOE recommendation 13 remain Open, VA recommendation 28 is Closed-Implemented, and all split-status agency records retain each individual action state",
  "Confirm DHS priority portfolio movement keeps implemented, no-longer-valid, newly added, and current-open states distinct",
  "Confirm DOE insider-threat recommendations 2 through 6 are Closed-Implemented while 1 and 7 remain Open-Partially Addressed",
  "Confirm VA Southern Oregon recommendations 3, 4, and 8 are Closed-Implemented while 1, 2, 5, 6, and 7 remain Open",
  "Confirm the HHS post-date hold does not characterize the July 29 expected-update date as a formal deadline or infer unposted remediation work",
  "Confirm the Phase 56N collection contains ten official-link records and a thirteen-file archive",
  "Confirm no recommendation, portfolio, or component status is rendered as performance, productivity, readiness, safety, quality, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) =>
    ![
      "Sixty-six signals, seven briefings, and one dependency map remain In Review",
      "The Phase 56N download contains",
      "Phase 56N changes no evidence state",
    ].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-six signals, seven briefings, one dependency map, and one Phase 56N research document remain In Review; all five local-system profiles remain evidence-bounded and do not state readiness scores.",
  "The Phase 56N download contains ten official-link records, nine Published decisions, and one held HHS post-date check. Agency, component, portfolio, recommendation, plan, inventory, and status-period identities remain distinct.",
  "Phase 56N changes no Phase 56F evidence state. Recommendation closure, portfolio movement, and component remediation are not performance or comparative outcomes; the ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes =
  "This manifest records the locally generated Phase 56N verified remediation and component outcome package. GAO-24-105980 supplies exact AI governance recommendation states across NASA, DOE, HHS, DHS, DOT, and VA. GAO-26-109077 adds current DHS priority portfolio movement; GAO-23-105576 adds DOE insider-threat remediation states; VA OIG 25-02402-83 adds a component follow-up; and the HHS A-18-22-08021 post-date check remains held because the public tracker was last updated July 22. Research Watch 018, the ten-record collection, two deepened pathways, three topics, the comparison protocol, and the thirteen-file archive preserve agency/component, identity, period, scope, denominator, no-ranking, no-score, no-readiness, no-value, and no-causation rules. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56N manifest with archive SHA-256 ${archiveSha256}.`);
