import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = dirname(appRoot);
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const archiveSlug = "gao-recommendation-implementation-artifact-milestone-ledger-2026";
const archivePath = join(appRoot, "public", "downloads", `${archiveSlug}.zip`);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const ledger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56r-implementation-artifact-milestone-ledger.json"), "utf8"));
const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex").toUpperCase();
const addUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const allSignalSlugs = ledger.records.map((record) => record.signal_id.replace(/^signal-/, ""));
const archiveCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug ${archiveSlug}`;

manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => command !== archiveCommand && command !== "npm run verify:phase56r");
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run validate:content"), 0, archiveCommand);
manifest.predeploy_commands.splice(manifest.predeploy_commands.indexOf("npm run verify:release"), 0, "npm run verify:phase56r");

manifest.expected_build = {
  ...manifest.expected_build,
  static_pages: 1594,
  signals: 373,
  published_signals: 305,
  in_review_signals: 68,
  draft_sample_signals: 0,
  published_support_sources: 381,
  sources: 592,
  topics: 17,
  organizations: 19,
  technologies: 5,
  local_systems: 5,
  briefings: 30,
  published_briefings: 23,
  in_review_briefings: 7,
  evidence_gaps: 16,
  dependency_maps: 7,
  published_dependency_maps: 6,
  in_review_dependency_maps: 1,
  research_collections: 27,
  research_documents: 485,
  reader_pathways: 15,
  published_reader_pathways: 11,
  reader_pathway_surfaces: 19,
  phase_55q_gap_decisions: 4,
  updates: 46,
  public_json_exports: 5,
  research_export_records: 467,
  pathway_export_records: 11,
};
manifest.release_delta_from_v0_1_1 = {
  ...manifest.release_delta_from_v0_1_1,
  static_pages_added: 1412,
  signals_added: 355,
  published_signals_added: 302,
  sources_added: 490,
  summary: "Extends the Phase 55K through Phase 56Q evidence baseline with Phase 56R recommendation-specific implementation artifact and milestone follow-through: 592 public sources, 373 signals, 305 Published signals, five local systems, twenty-three Published and seven In Review briefings, six Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 46 public updates, twenty-seven research collections, 485 summarized research documents, and five versioned public-data exports.",
};
manifest.phase_56r_delta = {
  recommendation_records_reviewed: 24,
  exact_phase_56q_continuations_published: 20,
  recommendation_specific_children_published: 4,
  parent_crosswalks_preserved: 2,
  official_status_open: 20,
  official_status_open_partially_addressed: 4,
  normalized_stage_promised: 11,
  normalized_stage_submitted: 4,
  normalized_stage_under_gao_review: 1,
  normalized_stage_partially_addressed: 4,
  normalized_stage_no_conforming_artifact_reported: 4,
  implemented_or_closed_claims: 0,
  named_milestone_monitors: 13,
  elapsed_milestones_without_official_acceptance: 3,
  closure_changes: 0,
  current_closure_states_closed: 1,
  current_closure_states_partially_closed: 21,
  current_closure_states_open: 2,
  source_profiles_added: 5,
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
  generated_pages_added: 55,
};
manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-02",
  published_support_minimum_date: "2026-07-22",
  validate_content: "passed-592-sources-373-signals-485-research-documents",
  source_health: "passed",
  source_health_manual_review: 414,
  source_health_probe_ready: 178,
  source_monitor_current: 592,
  astro_check: "passed",
  build: "passed",
  static_pages_built: 1594,
  release_assertions: "passed-phase-56r",
  browser_qa: "passed-local-phase-55k; phase-55l-through-phase-56r-visual-qa-not-requested",
};

manifest.required_output_files = addUnique(manifest.required_output_files, [
  `dist/research/${archiveSlug}/index.html`,
  `dist/downloads/${archiveSlug}.zip`,
  "dist/briefings/research-watch-022-recommendation-implementation-artifacts-milestones/index.html",
  ...allSignalSlugs.map((slug) => `dist/signals/${slug}/index.html`),
]);
manifest.published_signal_routes = addUnique(manifest.published_signal_routes, allSignalSlugs.map((slug) => `/signals/${slug}/`));
manifest.launch_critical_routes = addUnique(manifest.launch_critical_routes, [
  `/research/${archiveSlug}/`,
  `/downloads/${archiveSlug}.zip`,
  "/briefings/research-watch-022-recommendation-implementation-artifacts-milestones/",
  ...allSignalSlugs.map((slug) => `/signals/${slug}/`),
]);
manifest.published_briefing_routes = addUnique(manifest.published_briefing_routes, [
  "/briefings/research-watch-022-recommendation-implementation-artifacts-milestones/",
]);
manifest.release_gates = manifest.release_gates.map((gate) => {
  if (gate.startsWith("Confirm 1,539 generated HTML pages")) return "Confirm 1,594 generated HTML pages and all required outputs";
  if (gate.startsWith("Confirm all 281 Published signal URLs")) return "Confirm all 305 Published signal URLs are present in the sitemap";
  if (gate.startsWith("Confirm all twenty-two Published briefing URLs")) return "Confirm all twenty-three Published briefing URLs are indexed and the seven In Review briefing URLs remain noindex and outside the sitemap";
  if (gate.startsWith("Confirm all 374 sources supporting Published signals")) return "Confirm all 381 sources supporting Published signals were checked on or after 2026-07-22";
  if (gate.startsWith("Confirm the 45-entry public update log")) return "Confirm the 46-entry public update log renders";
  if (gate.startsWith("Confirm all twenty-six research collections")) return "Confirm all twenty-seven research collections render 485 document summaries and their downloadable archives";
  return gate;
});
manifest.release_gates = addUnique(manifest.release_gates, [
  "Confirm all twenty-four Phase 56R records preserve parent key, exact identity, status, normalized implementation stage, artifact type, availability, milestone, GAO review state, remaining gap, and continuation rule",
  "Confirm HHS-04 and VA-02 remain intact as parent crosswalks while four recommendation-specific child records publish",
  "Confirm twenty Phase 56R recommendations remain Open and four remain Open – Partially Addressed without translating either status into a Phase 56F evidence-state change",
  "Confirm eleven Promised, four Submitted, one Under GAO review, four Partially addressed, and four No conforming artifact reported records, with no Implemented or Closed claim",
  "Confirm thirteen named milestone monitors remain active and three elapsed dates have no official acceptance or closure record",
  "Confirm Phase 56R preserves one Closed, twenty-one Partially Closed, and two Open entity evidence states",
  "Confirm five separately public agency artifacts are linked without representing publication as GAO acceptance or implementation",
  "Confirm the inherited HHS tracker hold and four Phase 56O contextual records remain separate",
  "Confirm the Phase 56R collection contains twenty-four recommendation-specific official-link records and a twenty-seven-file archive",
  "Confirm no artifact or milestone is rendered as implementation, closure, agency performance, readiness, safety, savings, value, a ranking, a composite, or a causal claim",
]);
manifest.known_limitations = manifest.known_limitations.filter((item) => ![
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q",
  "HHS-04 and VA-02 each combine",
  "The Phase 56Q download contains",
  "Phase 56Q changes no",
].some((prefix) => item.startsWith(prefix)));
manifest.known_limitations.unshift(
  "Sixty-eight signals, seven briefings, one dependency map, two Phase 56Q parent documents, and one Phase 56N research document remain In Review; the inherited HHS tracker hold remains unchanged.",
  "HHS-04 and VA-02 remain In Review as parent crosswalks, while four recommendation-specific Phase 56R child records now publish without overwriting those parents.",
  "The Phase 56R download contains twenty-four recommendation-specific official-link records and links five separately public agency artifacts; response artifacts described only on GAO pages remain labeled unavailable separately.",
  "Phase 56R records no implementation or closure change. A promise is not evidence, an artifact is not implementation without sufficient scope and official support, and recommendation closure would not by itself establish operating outcome; the entity ledger remains one Closed, twenty-one Partially Closed, and two Open.",
);
manifest.notes = "This manifest records the locally generated Phase 56R recommendation-specific implementation artifact and milestone package. Twenty Phase 56Q exact identities continue and four child records resolve the HHS-04 and VA-02 one-to-many holds without overwriting either parent. Research Watch 022, the twenty-four-record collection, five public agency artifacts, three deepened pathways, six topics, two organizations, the comparison protocol, and the twenty-seven-file archive preserve parent, child, promise, artifact visibility, submission, GAO review, partial addressing, implementation, closure, Phase 56F evidence state, outcome, no-ranking, no-score, no-readiness, no-savings, no-value, and no-causation rules. Thirteen dates are bounded monitors, including three elapsed periods without official acceptance or closure. The inherited HHS tracker hold and four Phase 56O contextual records remain separate. The release remains 0.2.0-dev and owner-only. Public access, DNS, public GitHub, custom-domain, and package changes are not authorized.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 56R manifest with archive SHA-256 ${archiveSha256}.`);
