import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const cycleRoute = "/briefings/evidence-cycle-001-operating-baseline/";
const cycleOutput = "dist/data/operating-cycle.json";
const phase60Verify = "npm run verify:phase60";

manifest.generated_date = "2026-08-11";
manifest.expected_build.static_pages = 3882;
manifest.expected_build.briefings = 78;
manifest.expected_build.published_briefings = 71;
manifest.expected_build.updates = 83;
manifest.expected_build.public_json_exports = 7;
manifest.expected_build.operating_cycle_records = 13;
manifest.release_delta_from_v0_1_1.static_pages_added = 3700;
manifest.release_delta_from_v0_1_1.public_json_exports_added = 7;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 58 evidence baseline and the Phase 59 editorial layer with the Phase 60 Evidence-to-Decision operating cycle: 715 public sources, 1,406 signals, 1,120 Published signals, seventy-one Published and seven In Review briefings, eight Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 83 public updates, sixty-one research collections, 1,533 summarized research documents, 1,326 research export records, a ten-item held evidence queue, a thirteen-gate operating cycle, and seven versioned public-data exports.";

if (!manifest.predeploy_commands.includes(phase60Verify)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, phase60Verify);
}
if (!manifest.required_output_files.includes(cycleOutput)) manifest.required_output_files.push(cycleOutput);
if (!manifest.published_briefing_routes.includes(cycleRoute)) manifest.published_briefing_routes.push(cycleRoute);
manifest.published_briefing_routes.sort();

manifest.last_verified.static_pages_built = 3882;
manifest.last_verified.release_assertions = "passed-through-phase-60-evidence-to-decision-operating-cycle";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-60-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-60-local-operating-cycle-release-validated-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_60_delta = {
  operating_layer: "evidence-to-decision-operating-cycle",
  cycle_id: "evidence-cycle-001",
  scheduled_gates: 13,
  phase_58_held_gates: 10,
  existing_local_monitors: 3,
  operating_waves: 3,
  seed_receipts_propagated: 1,
  complete_propagation_proofs: 1,
  silent_overdue_checks_at_checkpoint: 0,
  recurring_digest_contracts: 1,
  briefings_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 1,
  official_source_profiles_added: 0,
  signals_added: 0,
  underlying_signal_promotions: 0,
  evidence_gaps_resolved: 0,
  composite_scores_created: 0,
  operating_outcome_changes: 0,
  future_checks_precompleted: 0,
  local_content_commit: "pending",
  deployment_status: "local_operating_cycle_release_validated_owner_only_deployment_pending_phase-57w-version-79-remains-live"
};

const phase60Gate = "Confirm Phase 60 contains thirteen dated gates across waves 60B-60D, zero silent overdue checks, one complete DARPA propagation proof, one recurring digest contract, and no precompleted future result";
if (!manifest.release_gates.includes(phase60Gate)) manifest.release_gates.push(phase60Gate);
const limitation = "Phase 60 completes the evidence-to-decision operating system, not the future evidence events. The August 14 through October 9 checks remain scheduled and cannot be represented as completed before their source checks and human decisions occur.";
if (!manifest.known_limitations.includes(limitation)) manifest.known_limitations.push(limitation);
manifest.notes = "This manifest records the locally release-validated Phase 60 Evidence-to-Decision operating cycle. Evidence Cycle 001 combines the ten Phase 58 held result gates with the existing Space Coast licence, Arizona wastewater, and Loudoun standards monitors across thirteen exact dates from August 14 through October 9. A build-time no-silent-overdue assertion, source-to-release propagation contract, seven-section recurring digest contract, public operating-cycle export, and one full DARPA No Material Change propagation proof are complete. The phase adds one Published briefing, one public update, one JSON export, and one generated HTML page while adding zero sources, signals, promotions, gap resolutions, scores, or operating-outcome changes. All future checks remain scheduled. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package. Public access, Hostinger DNS, custom-domain attachment, public GitHub synchronization, Supabase activation, package freeze, and launch remain unchanged.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log("Phase 60 deployment manifest updated.");
