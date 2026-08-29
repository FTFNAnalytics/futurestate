import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

manifest.generated_date = "2026-08-11";
manifest.expected_build.static_pages = 3893;
manifest.expected_build.briefings = 89;
manifest.expected_build.published_briefings = 82;
manifest.expected_build.updates = 86;
manifest.expected_build.public_json_exports = 10;
manifest.expected_build.conversion_gate_records = 8;
manifest.release_delta_from_v0_1_1.static_pages_added = 3711;
manifest.release_delta_from_v0_1_1.public_json_exports_added = 10;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 62 release with the Phase 63 named conversion gate calendar: 715 public sources, 1,406 signals, 1,120 Published signals, eighty-two Published and seven In Review briefings, eight Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 86 public updates, sixty-one research collections, 1,533 summarized research documents, 1,326 research export records, thirteen operating-cycle gates, eight named conversion files, seventeen conversion events, eight next-evidence gate records, and ten versioned public-data exports.";

const phase63Verify = "npm run verify:phase63";
if (!manifest.predeploy_commands.includes(phase63Verify)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, phase63Verify);
}
if (!manifest.required_output_files.includes("dist/data/conversion-gates.json")) manifest.required_output_files.push("dist/data/conversion-gates.json");
const briefingRoute = "/briefings/conversion-gate-calendar-001-what-can-move-next/";
if (!manifest.published_briefing_routes.includes(briefingRoute)) manifest.published_briefing_routes.push(briefingRoute);
manifest.published_briefing_routes.sort();

manifest.last_verified.static_pages_built = 3893;
manifest.last_verified.release_assertions = "passed-through-phase-63-named-conversion-gate-calendar";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-63-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-63-local-conversion-gate-release-validated-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_63_delta = {
  editorial_layer: "named-conversion-gate-calendar",
  named_file_gates: 8,
  dated_check_gates: 4,
  source_trigger_gates: 4,
  due_this_week_gates: 1,
  same_entity_cycle_bindings: 3,
  conditional_cycle_bindings: 1,
  briefings_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 1,
  official_source_profiles_added: 0,
  signals_added: 0,
  underlying_signal_promotions: 0,
  receipts_created: 0,
  composite_scores_created: 0,
  operating_outcome_changes: 0,
  local_content_commit: "pending",
  deployment_status: "local_conversion-gate-release-validated_owner-only-deployment-pending_phase-57w-version-79-remains-live"
};

const gate = "Confirm Phase 63 contains eight named-file gates, four dated checks, four source-explicit triggers, three same-entity Phase 60 bindings, one public calendar export, and no precompleted receipt, invented date, cross-entity transfer, or score";
if (!manifest.release_gates.includes(gate)) manifest.release_gates.push(gate);
manifest.notes = "This manifest records the locally release-validated Phase 63 named conversion gate calendar on top of the Phase 62 event ledgers. Eight records join every named file to its latest event, exact dated check or source-explicit trigger, Phase 60 binding state, artifact, stop rule, receipt state, and propagation surfaces. The phase adds one Published briefing, one update, one public gate export, and one generated HTML page, with zero new sources, signals, promotions, receipts, scores, or operating-outcome claims. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log("Phase 63 deployment manifest updated.");
