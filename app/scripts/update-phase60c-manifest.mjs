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
const briefings = await Promise.all((await readdir(briefingDirectory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(briefingDirectory, name), "utf8");
  return {
    status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1],
    slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1]
  };
}));
const signalDirectory = join(appRoot, "src", "content", "signals");
const signals = await Promise.all((await readdir(signalDirectory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(signalDirectory, name), "utf8");
  return {
    status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1],
    slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1]
  };
}));
const mapDirectory = join(appRoot, "src", "content", "dependency-maps");
const maps = await Promise.all((await readdir(mapDirectory)).filter((name) => name.endsWith(".json")).map((name) => readJson(mapDirectory, name)));
const updateDirectory = join(appRoot, "src", "content", "updates");
const updateFiles = (await readdir(updateDirectory)).filter((name) => name.endsWith(".json"));
const qualification = await readJson(appRoot, "src", "data", "phase-67-qualification-packet-registry.json");
const returns = await readJson(appRoot, "src", "data", "phase-67-evidence-return-envelope-ledger.json");

const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-23";
Object.assign(manifest.expected_build, {
  static_pages: 4078,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  published_support_sources: 502,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 14,
  qualification_packets: qualification.packet_records.length,
  evidence_return_envelopes: returns.envelope_records.length,
  phase_67_synthetic_cases: 488,
  phase_60c_desk_records: 8
});

manifest.release_delta_from_v0_1_1.static_pages_added = 3896;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60B release with a future-safe Wave 60C editorial desk: 715 sources, 1,406 signals, 1,121 Published signals, 120 Published and zero In Review briefings, twelve Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 92 updates, fourteen public JSON exports, eight desk records, six untouched Wave 60C envelopes, two separate named-file rechecks, and zero future receipts, stage advances, scores, rankings, or operating-outcome changes.";

for (const command of ["npm run verify:phase60c"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}
for (const file of [
  "dist/data/phase-60c-editorial-desk.json",
  "dist/briefings/evidence-cycle-001-wave-60c-field-guide/index.html"
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
manifest.last_verified.static_pages_built = 4078;
manifest.last_verified.release_assertions = "passed-through-phase-60c-editorial-desk-preflight";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-60c-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-60c-editorial-desk-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_60c_preflight_delta = {
  captured_date: "2026-08-23",
  editorial_layer: "wave-60c-evidence-return-publication-desk",
  cycle_gate_contracts: 6,
  named_file_companion_rechecks: 2,
  field_guides_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  reader_pathways_deepened: 6,
  canonical_dossiers_deepened: 4,
  local_systems_deepened: 2,
  future_receipts_created: 0,
  source_check_results_created: 0,
  underlying_signal_promotions: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-60c-preflight-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Wave 60C publishes exactly"));
const releaseGate = "Confirm Wave 60C publishes exactly 8 future-safe desk contracts—6 cycle gates and 2 independent named-file rechecks—with qualifying-evidence and mandatory-hold rules, 6 integrated pathways, 1 field guide, 1 public export, zero future receipts, zero stage advances, and zero unsupported outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records the two completed Wave 60B decisions plus the future-safe Wave 60C editorial desk. The desk defines six September cycle gates and separate Toronto and Shuttle Landing Facility rechecks without attempting the sources early or precreating receipts. All six Wave 60C envelopes remain scheduled with empty future fields. The work advances no underlying signal, named-file stage, Phase 64 cell, score, rank, or operating-outcome conclusion. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 60C manifest updated: ${publishedBriefings.length} Published briefings, ${updateFiles.length} updates, 14 public JSON exports, 8 desk records, and 4,078 static pages.`);
