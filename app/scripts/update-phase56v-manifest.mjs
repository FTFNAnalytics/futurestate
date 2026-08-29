import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "gao-second-order-recovery-leads-supporting-artifacts-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56v-second-order-recovery-leads-supporting-artifacts.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const allSignalSlugs = ledger.records.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56v");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56v");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1773,
  signals: 439,
  published_signals: 371,
  in_review_signals: 68,
  draft_sample_signals: 0,
  published_support_sources: 420,
  sources: 631,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 34,
  published_briefings: 27,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 31,
  research_documents: 551,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 50,
  public_json_exports: 5,
  research_export_records: 537,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1591,
  signals_added: 421,
  published_signals_added: 368,
  sources_added: 529,
  summary: "Extends the Phase 55K through Phase 56U evidence baseline with Phase 56V second-order recovery and supporting-artifact decomposition: 631 public sources, 439 signals, 371 Published signals, five local systems, twenty-seven Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 50 public updates, thirty-one research collections, 551 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56v_delta = {
  ...(manifest.phase_56v_delta ?? {}),
  parent_acquisition_tickets: 8,
  parent_near_matches_decomposed: 10,
  second_order_lead_chains_added: 10,
  official_supporting_artifacts_profiled: 12,
  recommendation_specific_supporting_artifacts_located: 1,
  exact_target_artifacts_acquired: 0,
  material_downstream_locators_added: 10,
  agency_gao_status_conflicts_preserved: 1,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  official_source_profiles_added: 12,
  research_documents_added_published: 10,
  signals_added_published: 10,
  downloadable_lead_records: 10,
  archive_file_count: 13,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 34,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-631-sources-439-signals-551-research-documents",
  source_health: "passed",
  source_health_manual_review: 432,
  source_health_probe_ready: 199,
  source_monitor_current: 631,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1773,
  release_assertions: "passed-phase-56v",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56v-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-026-second-order-recovery-leads/index.html",
  ...allSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, allSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-026-second-order-recovery-leads/",
  ...allSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-026-second-order-recovery-leads/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,739 generated HTML pages")) return "Confirm 1,773 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 361 Published signal URLs")) return "Confirm all 371 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty-six Published briefing URLs")) return "Confirm all twenty-seven Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 408 sources supporting Published signals")) return "Confirm all 420 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 49-entry public update log")) return "Confirm the 50-entry public update log renders";
  if (gate.startsWith("Confirm all thirty research collections")) return "Confirm all thirty-one research collections render 551 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 56V decomposes all ten Phase 56U official near-matches exactly once",
  "Confirm every Phase 56V record names its parent near-match, lead type, downstream source, locator, artifact function, rejection reason, material narrowing, directive tests, stop rule, reopening trigger, next action, and authority boundary",
  "Confirm Phase 56V adds twelve official supporting sources, ten materially narrower locators, one recommendation-specific VA supporting artifact, and zero exact target artifacts",
  "Confirm the VA congressional appendix is not rendered as the Joint Transition Task Force draft assessment or as completed implementation",
  "Confirm the DOT procurement forecast is not rendered as an awarded, deployed, or operating grants-risk system",
  "Confirm the Hanford 2023 AoA lineage does not overwrite GAO's current Open status or satisfy the post-recommendation pause package by inference",
  "Confirm no public source decomposition is rendered as an agency contact, submitted FOIA request, nonexistence, withholding, or failure to submit",
  "Confirm Phase 56V records zero directive-scope, implementation, and closure changes and preserves one Closed, twenty-one Partially Closed, and two Open entity evidence states",
  "Confirm twelve official source profiles are current and all eight declared download endpoints are populated",
  "Confirm the Phase 56V collection contains ten lead records and a thirteen-file archive",
  "Confirm no supporting-artifact record is rendered as agency performance, readiness, safety, savings, value, ranking, composite score, or causation",
]);
manifest.known_limitations = manifest.known_limitations.filter((item) => ![
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q",
  "HHS-04 and VA-02 remain In Review as parent crosswalks",
  "Phase 56U acquired no exact target artifact",
  "DOE's FY 2027 congressional submission labels DOE-05",
  "Phase 56U records no directive-scope",
].some((prefix) => item.startsWith(prefix)));
manifest.known_limitations.unshift(
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q parent documents, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "HHS-04 and VA-02 remain In Review as parent crosswalks, while their four recommendation-specific children remain Published without overwriting either parent.",
  "Phase 56V adds ten materially narrower downstream locators across twelve supporting sources but acquires no exact target artifact; all eight acquisition tickets remain open to their named triggers.",
  "The VA FY 2026 congressional appendix is recommendation-specific supporting correspondence, not the Joint Transition Task Force draft assessment, completed findings, recommended changes, or GAO acceptance.",
  "DOE's Hanford implementation lineage and self-reported closure do not overwrite GAO's current Open status or establish the recommendation-specific pause and prerequisite package.",
  "DOT's unified-grants record is a procurement forecast, not an award, deployed system, operating risk assessment, or portfolio-wide control.",
  "Phase 56V records no directive-scope, implementation, or closure change. No FTFN agency contact or FOIA request was submitted, and supporting artifacts do not establish exact-target acquisition.",
);
manifest.notes = "This manifest records the locally generated Phase 56V second-order recovery leads and supporting-artifact decomposition. All ten Phase 56U official near-matches now resolve to named downstream offices, plans, analyses, templates, systems, authority records, or correspondence across twelve official source profiles. One VA congressional record is recommendation-specific supporting correspondence, but no exact target artifact was acquired. DOE-05 preserves the agency-GAO conflict. Research Watch 026, the ten-record collection, six entity ledgers, three pathways, five topics, two organizations, the comparison protocol, and the thirteen-file archive retain exact-target, GAO-authority, no-ranking, no-score, no-readiness, no-savings, no-value, and no-causation rules. Dated checks remain bounded inserts. The inherited HHS tracker hold remains separate. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56V manifest with archive SHA-256 ${archiveSha256}.`);
