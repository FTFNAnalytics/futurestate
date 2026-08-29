import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const routes = [
  "/briefings/project-conversion-001-tsmc-arizona/",
  "/briefings/project-conversion-002-toronto-24-254930/",
  "/briefings/project-conversion-003-northern-virginia-large-load/",
  "/briefings/project-conversion-004-space-coast-authority-to-mission/",
  "/briefings/project-conversion-005-nevada-lithium/",
  "/briefings/named-adoption-case-001-gsa-pqc/",
  "/briefings/named-adoption-case-002-nist-aria-assurance/",
  "/briefings/named-adoption-case-003-waymo-california-service/",
  "/briefings/project-conversion-watch-001-authority-to-delivery/"
];

manifest.generated_date = "2026-08-11";
manifest.expected_build.static_pages = 3891;
manifest.expected_build.briefings = 87;
manifest.expected_build.published_briefings = 80;
manifest.expected_build.updates = 84;
manifest.expected_build.public_json_exports = 8;
manifest.expected_build.project_conversion_records = 8;
manifest.expected_build.phase_55q_gap_decisions = 2;
manifest.release_delta_from_v0_1_1.static_pages_added = 3709;
manifest.release_delta_from_v0_1_1.public_json_exports_added = 8;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 60 release with Phase 61 named project conversion files: 715 public sources, 1,406 signals, 1,120 Published signals, eighty Published and seven In Review briefings, eight Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 84 public updates, sixty-one research collections, 1,533 summarized research documents, 1,326 research export records, a ten-item held evidence queue, a thirteen-gate operating cycle, eight named conversion files, and eight versioned public-data exports.";

const phase61Verify = "npm run verify:phase61";
if (!manifest.predeploy_commands.includes(phase61Verify)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, phase61Verify);
}
if (!manifest.required_output_files.includes("dist/data/project-conversion.json")) manifest.required_output_files.push("dist/data/project-conversion.json");
for (const route of routes) if (!manifest.published_briefing_routes.includes(route)) manifest.published_briefing_routes.push(route);
manifest.published_briefing_routes.sort();
manifest.phase_55q_gap_routes = manifest.phase_55q_gap_routes.filter((route) => !route.includes("gap-004-") && !route.includes("gap-005-"));

manifest.last_verified.static_pages_built = 3891;
manifest.last_verified.release_assertions = "passed-through-phase-61-named-project-conversion-files";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-61-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-61-local-project-conversion-release-validated-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_61_delta = {
  editorial_layer: "named-project-conversion-files",
  named_conversion_files: 8,
  local_project_files: 5,
  adoption_case_files: 3,
  evidence_gaps_in_operating_register: 16,
  evidence_gaps_reconciled: 2,
  briefings_added_published: 9,
  local_systems_deepened: 5,
  reader_pathways_deepened: 10,
  dependency_maps_deepened: 2,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 9,
  official_source_profiles_added: 0,
  signals_added: 0,
  underlying_signal_promotions: 0,
  composite_scores_created: 0,
  operating_outcome_changes: 0,
  local_content_commit: "pending",
  deployment_status: "local_project-conversion-release-validated_owner-only-deployment-pending_phase-57w-version-79-remains-live"
};

const gate = "Confirm Phase 61 contains eight named conversion files, sixteen gap operations, nine Published briefings, ten linked pathways, five linked local systems, one public registry export, and no score or unsupported outcome promotion";
if (!manifest.release_gates.includes(gate)) manifest.release_gates.push(gate);
manifest.notes = "This manifest records the locally release-validated Phase 61 named project conversion layer on top of the Phase 60 operating cycle. Five local project files and three adoption cases bind existing sources and signals to exact downstream artifacts, dates or reopening triggers, stop rules, and reader surfaces. Toronto application 24 254930 is reconciled to Council adoption while enactment and delivery remain open. The phase adds nine Published briefings, one update, one public registry export, and nine generated HTML pages, with zero new sources, signals, promotions, scores, or operating-outcome claims. Phase 60 future checks remain date-bound. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log("Phase 61 deployment manifest updated.");
