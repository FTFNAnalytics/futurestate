import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

manifest.generated_date = "2026-08-11";
manifest.expected_build.static_pages = 3892;
manifest.expected_build.briefings = 88;
manifest.expected_build.published_briefings = 81;
manifest.expected_build.updates = 85;
manifest.expected_build.public_json_exports = 9;
manifest.expected_build.project_conversion_records = 8;
manifest.expected_build.conversion_event_records = 17;
manifest.release_delta_from_v0_1_1.static_pages_added = 3710;
manifest.release_delta_from_v0_1_1.public_json_exports_added = 9;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 61 release with Phase 62 conversion event ledgers: 715 public sources, 1,406 signals, 1,120 Published signals, eighty-one Published and seven In Review briefings, eight Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 85 public updates, sixty-one research collections, 1,533 summarized research documents, 1,326 research export records, a ten-item held evidence queue, a thirteen-gate operating cycle, eight named conversion files, seventeen source-resolved conversion events, and nine versioned public-data exports.";

const phase62Verify = "npm run verify:phase62";
if (!manifest.predeploy_commands.includes(phase62Verify)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, phase62Verify);
}
if (!manifest.required_output_files.includes("dist/data/conversion-events.json")) manifest.required_output_files.push("dist/data/conversion-events.json");
const methodRoute = "/briefings/conversion-ledger-method-001-snapshot-to-evidence-history/";
if (!manifest.published_briefing_routes.includes(methodRoute)) manifest.published_briefing_routes.push(methodRoute);
manifest.published_briefing_routes.sort();

manifest.last_verified.static_pages_built = 3892;
manifest.last_verified.release_assertions = "passed-through-phase-62-conversion-event-ledgers";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-62-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-62-local-conversion-ledger-release-validated-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_62_delta = {
  editorial_layer: "named-conversion-event-ledgers",
  append_only_ledgers: 8,
  source_resolved_backfilled_events: 17,
  phase_60_cycle_binding_decisions: 13,
  phase_60_bound_cycle_items: 3,
  phase_60_no_transfer_decisions: 10,
  canonical_briefing_timelines_added: 8,
  briefings_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 1,
  official_source_profiles_added: 0,
  signals_added: 0,
  underlying_signal_promotions: 0,
  historical_receipts_created: 0,
  composite_scores_created: 0,
  operating_outcome_changes: 0,
  local_content_commit: "pending",
  deployment_status: "local_conversion-ledger-release-validated_owner-only-deployment-pending_phase-57w-version-79-remains-live"
};

const gate = "Confirm Phase 62 contains eight append-only ledgers, seventeen source-resolved backfilled events, thirteen explicit Phase 60 binding decisions, eight canonical briefing timelines, one method briefing, one public event export, and no invented receipt, score, or unsupported stage advance";
if (!manifest.release_gates.includes(gate)) manifest.release_gates.push(gate);
manifest.notes = "This manifest records the locally release-validated Phase 62 conversion-event layer on top of the Phase 61 named-file registry and Phase 60 operating cycle. Seventeen reviewed evidence events preserve stable file and event identities, explicit date bases, prior and current stages, artifacts, sources, signals, materiality, boundaries, and next gates. All thirteen Phase 60 cycle items carry an explicit same-entity binding or no-transfer decision. The phase adds one Published method briefing, eight canonical timeline sections, one update, one public event export, and one generated HTML page, with zero new sources, signals, promotions, historical receipts, scores, or operating-outcome claims. Future appends require a real dated receipt and complete propagation. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log("Phase 62 deployment manifest updated.");
