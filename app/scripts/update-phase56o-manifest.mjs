import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "cross-agency-priority-remediation-portfolios-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;
manifest.predeploy_commands = manifest.predeploy_commands.filter(
  (command) => command !== archiveCommand && command !== "npm run verify:phase56o",
);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56o");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1422,
  signals: 305,
  published_signals: 239,
  in_review_signals: 66,
  draft_sample_signals: 0,
  published_support_sources: 351,
  sources: 562,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 27,
  published_briefings: 20,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 24,
  research_documents: 417,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 43,
  public_json_exports: 5,
  research_export_records: 398,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1240,
  signals_added: 287,
  published_signals_added: 236,
  sources_added: 460,
  summary: "Extends the Phase 55K through Phase 56N evidence baseline with Phase 56O cross-agency priority-remediation portfolios: 562 public sources, 305 signals, 239 Published signals, five local systems, twenty Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 43 public updates, twenty-four research collections, 417 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56o_delta = {
  exact_records_checked: 8,
  phase_56f_coverage_decisions: 4,
  contextual_records: 4,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 8,
  research_documents_added_published: 8,
  signals_added_published: 8,
  downloadable_official_link_records: 8,
  archive_file_count: 11,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 3,
  topics_deepened: 8,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 26,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-01",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-562-sources-305-signals-417-research-documents",
  source_health: "passed",
  source_health_manual_review: 384,
  source_health_probe_ready: 178,
  source_monitor_current: 562,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1422,
  release_assertions: "passed-phase-56o",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56o-visual-qa-not-requested",
};

const signalSlugs = [
  "56o-doe-priority-portfolio-five-implemented-24-current",
  "56o-hhs-priority-portfolio-four-implemented-38-current",
  "56o-dot-priority-portfolio-three-implemented-22-current",
  "56o-va-priority-portfolio-two-implemented-30-current",
  "56o-gsa-priority-portfolio-two-implemented-11-current",
  "56o-ostp-priority-portfolio-three-implemented-four-current",
  "56o-ntia-priority-portfolio-one-implemented-10-current",
  "56o-gao-open-recommendations-132-251b-modeled-benefit",
];
manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-019-cross-agency-remediation/index.html",
  ...signalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, signalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-019-cross-agency-remediation/",
  ...signalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-019-cross-agency-remediation/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,396 generated HTML pages")) return "Confirm 1,422 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 231 Published signal URLs")) return "Confirm all 239 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all nineteen Published briefing URLs")) return "Confirm all twenty Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 343 sources supporting Published signals")) return "Confirm all 351 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 42-entry public update log")) return "Confirm the 43-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-three research collections")) return "Confirm all twenty-four research collections render 417 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all eight Phase 56O records retain stable agency or government-wide identity, exact portfolio or model identity, status period, arithmetic, limitation, publication decision, and reopening rule",
  "Confirm Phase 56O preserves one Closed, twenty-one Partially Closed, and two Open evidence states with no unsupported closure transition",
  "Confirm seven agency priority portfolios keep implemented, added, de-prioritized, and current states distinct and are not rendered as comparable agency rates",
  "Confirm the GAO $132 billion to $251 billion range remains labeled modeled potential financial benefit, not a forecast, budget score, agency allocation, or realized savings",
  "Confirm the inherited HHS post-date check remains In Review while the public tracker remains last updated July 22",
  "Confirm the Phase 56O collection contains eight official-link records and an eleven-file archive",
  "Confirm no recommendation or portfolio status is rendered as performance, productivity, readiness, safety, quality, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter(
  (item) => !["Sixty-six signals, seven briefings, one dependency map, and one Phase 56N", "The Phase 56O download contains", "Phase 56O changes no"].some((prefix) => item.startsWith(prefix)),
);
manifest.known_limitations.unshift(
  "Sixty-six signals, seven briefings, one dependency map, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "The Phase 56O download contains eight Published official-link records spanning seven agency portfolios and one government-wide model. Agency scope, subject mix, arithmetic, period, and benefit-realization identities remain distinct.",
  "Phase 56O changes no Phase 56F evidence state. Portfolio movement and modeled potential benefit are not agency performance, comparable rates, or realized savings; the ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes = "This manifest records the locally generated Phase 56O cross-agency priority-remediation package. Seven GAO agency letters preserve exact baseline, implemented, added, de-prioritized, and current counts for DOE, HHS, DOT, VA, GSA, OSTP, and NTIA. GAO-26-108932 adds a bounded $132 billion to $251 billion model of potential future measurable financial benefits, not realized savings. Research Watch 019, the eight-record collection, three deepened pathways, eight topics, two organizations, the comparison protocol, and the eleven-file archive preserve agency, portfolio, arithmetic, period, scope, denominator, model, no-ranking, no-score, no-readiness, no-value, and no-causation rules. The inherited HHS tracker record remains held. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56O manifest with archive SHA-256 ${archiveSha256}.`);
