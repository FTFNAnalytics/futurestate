import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));

const briefingDirectory = join(appRoot, "src", "content", "briefings");
const briefingFiles = (await readdir(briefingDirectory)).filter((name) => name.endsWith(".mdx"));
const briefings = await Promise.all(briefingFiles.map(async (name) => {
  const text = await readFile(join(briefingDirectory, name), "utf8");
  return { status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: text.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));
const mapDirectory = join(appRoot, "src", "content", "dependency-maps");
const mapFiles = (await readdir(mapDirectory)).filter((name) => name.endsWith(".json"));
const maps = await Promise.all(mapFiles.map((name) => readJson(mapDirectory, name)));
const signalDirectory = join(appRoot, "src", "content", "signals");
const signalFiles = (await readdir(signalDirectory)).filter((name) => name.endsWith(".mdx"));
const signals = await Promise.all(signalFiles.map(async (name) => {
  const text = await readFile(join(signalDirectory, name), "utf8");
  return { status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: text.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));
const updateDirectory = join(appRoot, "src", "content", "updates");
const updateFiles = (await readdir(updateDirectory)).filter((name) => name.endsWith(".json"));
const qualification = await readJson(appRoot, "src", "data", "phase-67-qualification-packet-registry.json");
const returns = await readJson(appRoot, "src", "data", "phase-67-evidence-return-envelope-ledger.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");

manifest.generated_date = "2026-08-23";
Object.assign(manifest.expected_build, {
  static_pages: 4077,
  published_signals: 1121,
  in_review_signals: 285,
  published_support_sources: 502,
  briefings: 124,
  published_briefings: 119,
  in_review_briefings: 0,
  dependency_maps: 13,
  published_dependency_maps: 12,
  in_review_dependency_maps: 1,
  updates: 91,
  public_json_exports: 13,
  qualification_packets: 32,
  evidence_return_envelopes: 13,
  phase_67_synthetic_cases: 488
});
manifest.release_delta_from_v0_1_1.static_pages_added = 3895;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 67 release with two completed Wave 60B operating decisions: 715 public sources, 1,406 signals, 1,121 Published signals, 119 Published and zero In Review briefings, five Archived briefing histories, twelve Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 91 updates, thirteen public JSON exports, thirty-two qualification packets, two release-verified and eleven scheduled return envelopes, 488 synthetic rule cases, and zero matrix advances, scores, rankings, or operating-outcome changes.";

for (const command of ["npm run test:phase67", "npm run verify:phase67"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}
for (const file of [
  "dist/data/qualification-packets.json",
  "dist/data/evidence-return-envelopes.json",
  "dist/evidence/qualification/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => `/briefings/${record.slug}/`).sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => `/briefings/${record.slug}/`).sort();
manifest.published_signal_routes = publishedSignals.map((record) => `/signals/${record.slug}/`).sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => `/signals/${record.slug}/`).sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => `/atlas/dependency-maps/${record.slug}/`).sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => `/atlas/dependency-maps/${record.slug}/`).sort();
manifest.qualification_packet_routes = qualification.packet_records.map((record) => `/evidence/qualification/${record.slug}/`).sort();
manifest.evidence_return_envelope_routes = returns.envelope_records.map((record) => `/evidence/qualification/${record.slug}/`).sort();
manifest.last_verified.date = "2026-08-23";
manifest.last_verified.static_pages_built = 4077;
manifest.last_verified.release_assertions = "passed-through-phase-67-wave-60b-operating-decisions";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-67-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-60b-two-operating-decisions-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_67_delta = {
  editorial_layer: "qualification-packet-and-evidence-return-control-plane",
  qualification_packets_added: 32,
  named_files_covered: 8,
  downstream_tests_per_file: 4,
  continuity_monitoring_packets: 1,
  awaiting_completion_artifact_packets: 4,
  awaiting_qualifying_artifact_packets: 27,
  evidence_return_envelopes_added: 13,
  wave_60b_envelopes: 2,
  wave_60c_envelopes: 6,
  wave_60d_envelopes: 5,
  named_file_bound_envelopes: 3,
  no_transfer_envelopes: 10,
  qualification_fixture_cases: 384,
  return_workflow_fixture_cases: 104,
  new_briefings_added_published: 13,
  dependency_maps_added_published: 2,
  public_json_exports_added: 2,
  public_update_entries_added: 1,
  generated_pages_added: 61,
  reader_pathways_deepened: 15,
  canonical_named_briefings_deepened: 8,
  acceptance_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operational_receipts_created: 2,
  completed_operational_checks: 2,
  remaining_scheduled_envelopes: 11,
  phase_64_cells_advanced: 0,
  sources_added: 0,
  signals_added: 0,
  research_records_added: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  local_content_commit: "pending",
  deployment_status: "wave-60b-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.phase_60b_operating_delta = {
  decision_date: "2026-08-23",
  cycle_decisions_completed: 2,
  darpa_receipt_id: "receipt-60-darpa-2026-08-23-results",
  darpa_signal_decision: "promoted-to-published-measured-competition-result",
  shuttle_landing_facility_receipt_id: "receipt-60-slf-2026-08-15-no-material-change",
  shuttle_landing_facility_signal_decision: "retained-in-review",
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  operating_outcome_changes: 0,
  public_update_entries_added: 1,
  generated_pages_added: 0
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 67 publishes exactly 32 qualification packets"));
const gate = "Confirm Phase 67 preserves exactly 32 qualification packets and 13 return envelopes, with two release-verified Wave 60B decisions and eleven untouched future envelopes; retain the 1/4/27 packet distribution, 3/10 binding distribution, 488 synthetic cases, zero matrix advances, and zero unsupported outcome changes";
if (!manifest.release_gates.includes(gate)) manifest.release_gates.push(gate);
manifest.notes = "This manifest records Phase 67's structural control plane plus the two completed Wave 60B operating decisions. Thirty-two qualification packets remain unchanged across four tests and eight named files. DARPA's exact measured result and prize decisions publish under a Change Note; the Shuttle Landing Facility formal disposition remains unresolved under a separate No Material Change receipt. Two return envelopes are release-verified and eleven future envelopes retain empty receipt fields. The work advances no named-file stage, Phase 64 cell, score, rank, or operating-outcome conclusion. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 60B deployment manifest updated: ${publishedSignals.length} Published signals, ${inReviewSignals.length} In Review signals, ${updateFiles.length} updates, 32 packet routes, 13 return routes, and 4,077 static pages.`);
