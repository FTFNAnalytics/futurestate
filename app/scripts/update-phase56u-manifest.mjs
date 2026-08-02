import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "gao-custodian-exact-artifact-recovery-batch-one-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56u-custodian-exact-artifact-recovery-batch-one.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const allSignalSlugs = ledger.records.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56u");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56u");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1739,
  signals: 429,
  published_signals: 361,
  in_review_signals: 68,
  draft_sample_signals: 0,
  published_support_sources: 408,
  sources: 619,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 33,
  published_briefings: 26,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 30,
  research_documents: 541,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 49,
  public_json_exports: 5,
  research_export_records: 526,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1557,
  signals_added: 411,
  published_signals_added: 358,
  sources_added: 517,
  summary: "Extends the Phase 55K through Phase 56T evidence baseline with Phase 56U custodian-level exact-artifact recovery: 619 public sources, 429 signals, 361 Published signals, five local systems, twenty-six Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 49 public updates, thirty research collections, 541 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56u_delta = {
  ...(manifest.phase_56u_delta ?? {}),
  acquisition_tickets_checked: 8,
  exact_target_artifacts_acquired: 0,
  official_near_matches_reviewed: 10,
  recommendation_specific_agency_status_results: 3,
  current_official_near_match_results: 5,
  agency_gao_status_conflicts: 1,
  public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  official_source_profiles_added: 7,
  research_documents_added_published: 8,
  signals_added_published: 8,
  downloadable_recovery_records: 8,
  archive_file_count: 11,
  archive_sha256: archiveSha256,
  briefings_added_published: 1,
  entity_ledgers_deepened: 6,
  reader_pathways_deepened: 3,
  topics_deepened: 5,
  organizations_deepened: 2,
  dependency_maps_deepened: 1,
  public_update_entries_added: 1,
  generated_pages_added: 25,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-619-sources-429-signals-541-research-documents",
  source_health: "passed",
  source_health_manual_review: 428,
  source_health_probe_ready: 191,
  source_monitor_current: 619,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1739,
  release_assertions: "passed-phase-56u",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56u-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-025-exact-artifact-recovery-batch-one/index.html",
  ...allSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, allSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-025-exact-artifact-recovery-batch-one/",
  ...allSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-025-exact-artifact-recovery-batch-one/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,714 generated HTML pages")) return "Confirm 1,739 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 353 Published signal URLs")) return "Confirm all 361 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty-five Published briefing URLs")) return "Confirm all twenty-six Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 401 sources supporting Published signals")) return "Confirm all 408 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 48-entry public update log")) return "Confirm the 49-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-nine research collections")) return "Confirm all thirty research collections render 541 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm Phase 56U contains exactly eight custodian-level recovery results for the eight Phase 56T acquisition tickets",
  "Confirm every Phase 56U record names the exact target, likely custodian, searched public surfaces, exact-title queries, near-match rejection, stop rule, reopening trigger, next action, and GAO authority boundary",
  "Confirm Phase 56U records zero exact target artifacts, ten reviewed official near-matches, and one DOE-05 agency-GAO status conflict",
  "Confirm no public repository search is rendered as an agency contact, submitted FOIA request, nonexistence, withholding, or failure to submit",
  "Confirm DOE's self-reported closure for DOE-05 does not overwrite GAO's current Open status",
  "Confirm Phase 56U records zero directive-scope, implementation, and closure changes and preserves one Closed, twenty-one Partially Closed, and two Open entity evidence states",
  "Confirm seven official source profiles are current and all four declared download endpoints are populated",
  "Confirm the Phase 56U collection contains eight recovery records and an eleven-file archive",
  "Confirm no recovery result is rendered as agency performance, readiness, safety, savings, value, ranking, composite score, or causation",
]);
manifest.known_limitations = manifest.known_limitations.filter((item) => ![
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q",
  "HHS-04 and VA-02 remain In Review as parent crosswalks",
  "Phase 56T converts eight missing-public-copy results",
  "Phase 56T records no implementation or closure change",
].some((prefix) => item.startsWith(prefix)));
manifest.known_limitations.unshift(
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q parent documents, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "HHS-04 and VA-02 remain In Review as parent crosswalks, while their four recommendation-specific children remain Published without overwriting either parent.",
  "Phase 56U acquired no exact target artifact. Ten official near-matches improve routing and context but do not establish the missing directive elements; the eight acquisition tickets remain open to their named reopening triggers.",
  "DOE's FY 2027 congressional submission labels DOE-05 closed while GAO's current page records it Open. FTFN preserves the conflict and retains GAO's authoritative status.",
  "Phase 56U records no directive-scope, implementation, or closure change. No FTFN agency contact or FOIA request was submitted, and a failed public search does not establish nonexistence, withholding, or a failure to submit.",
);
manifest.notes = "This manifest records the locally generated Phase 56U custodian-level exact-artifact recovery batch one. Eight Phase 56T acquisition tickets now carry public surfaces checked, exact-title and custodian queries, ten official near-matches with exact rejection reasons, stop rules, reopening triggers, next actions, and separate GAO-authority states. No exact target artifact was acquired and no FTFN agency contact or FOIA request was submitted. DOE-05 preserves an agency-GAO status conflict without overwriting GAO's Open status. Research Watch 025, the eight-record collection, six entity ledgers, three pathways, five topics, two organizations, the comparison protocol, and the eleven-file archive retain nonexistence, no-ranking, no-score, no-readiness, no-savings, no-value, and no-causation rules. Dated checks remain bounded inserts. The inherited HHS tracker hold remains separate. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56U manifest with archive SHA-256 ${archiveSha256}.`);
