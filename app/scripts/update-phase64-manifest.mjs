import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

manifest.generated_date = "2026-08-11";
manifest.expected_build.static_pages = 3895;
manifest.expected_build.briefings = 90;
manifest.expected_build.published_briefings = 83;
manifest.expected_build.dependency_maps = 10;
manifest.expected_build.published_dependency_maps = 9;
manifest.expected_build.updates = 87;
manifest.expected_build.public_json_exports = 11;
manifest.expected_build.conversion_gate_records = 8;
manifest.expected_build.conversion_stage_cells = 64;
manifest.release_delta_from_v0_1_1.static_pages_added = 3713;
manifest.release_delta_from_v0_1_1.public_json_exports_added = 11;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 63 release with the Phase 64 conversion stage matrix: 715 public sources, 1,406 signals, 1,120 Published signals, eighty-three Published and seven In Review briefings, nine Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 87 public updates, sixty-one research collections, 1,533 summarized research documents, 1,326 research export records, thirteen operating-cycle gates, eight named conversion files, seventeen conversion events, eight next-evidence gates, sixty-four bounded stage cells, and eleven versioned public-data exports.";

const phase64Verify = "npm run verify:phase64";
if (!manifest.predeploy_commands.includes(phase64Verify)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, phase64Verify);
}
for (const output of ["dist/data/conversion-gates.json", "dist/data/conversion-stage-matrix.json"]) if (!manifest.required_output_files.includes(output)) manifest.required_output_files.push(output);
const briefingRoute = "/briefings/conversion-stage-matrix-001-comparable-questions-noncomparable-projects/";
if (!manifest.published_briefing_routes.includes(briefingRoute)) manifest.published_briefing_routes.push(briefingRoute);
manifest.published_briefing_routes.sort();
const mapRoute = "/atlas/dependency-maps/conversion-stage-is-not-outcome/";
if (!manifest.published_dependency_map_routes.includes(mapRoute)) manifest.published_dependency_map_routes.push(mapRoute);
manifest.published_dependency_map_routes.sort();

manifest.last_verified.static_pages_built = 3895;
manifest.last_verified.release_assertions = "passed-through-phase-64-conversion-stage-matrix";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-64-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-64-local-conversion-stage-matrix-release-validated-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_64_delta = {
  editorial_layer: "bounded-conversion-stage-matrix",
  named_file_rows: 8,
  evidence_stage_questions: 8,
  bounded_stage_cells: 64,
  evidence_present_cells: 16,
  partial_or_held_cells: 8,
  not_established_cells: 40,
  comparable_outcome_cells_open: 8,
  briefings_added_published: 1,
  dependency_maps_added_published: 1,
  reader_pathways_deepened: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 2,
  official_source_profiles_added: 0,
  signals_added: 0,
  underlying_signal_promotions: 0,
  receipts_created: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  local_content_commit: "pending",
  deployment_status: "local_conversion-stage-matrix-release-validated_owner-only-deployment-pending_phase-57w-version-79-remains-live"
};

const gate = "Confirm Phase 64 contains eight named-file rows, eight ordered evidence questions, sixty-four unique bounded cells, eight open comparable-outcome cells, one Published dependency map, one public matrix export, and no rank, score, cross-file transfer, or unsupported outcome claim";
if (!manifest.release_gates.includes(gate)) manifest.release_gates.push(gate);
manifest.notes = "This manifest records the locally release-validated Phase 64 conversion stage matrix on top of the Phase 63 gate calendar. Sixty-four cells ask eight common evidence questions of eight named files while preserving entity and event provenance. Sixteen cells carry direct evidence, eight remain partial or held, and forty are not established; every comparable-outcome cell remains open. The phase adds one Published briefing, one Published dependency map, one pathway integration, one update, one public matrix export, and two generated HTML pages, with zero new sources, signals, promotions, receipts, scores, rankings, or operating-outcome claims. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log("Phase 64 deployment manifest updated.");
