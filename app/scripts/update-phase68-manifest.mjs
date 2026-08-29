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
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));
const signalDirectory = join(appRoot, "src", "content", "signals");
const signals = await Promise.all((await readdir(signalDirectory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(signalDirectory, name), "utf8");
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));
const mapDirectory = join(appRoot, "src", "content", "dependency-maps");
const maps = await Promise.all((await readdir(mapDirectory)).filter((name) => name.endsWith(".json")).map((name) => readJson(mapDirectory, name)));
const updateDirectory = join(appRoot, "src", "content", "updates");
const updateFiles = (await readdir(updateDirectory)).filter((name) => name.endsWith(".json"));
const qualification = await readJson(appRoot, "src", "data", "phase-67-qualification-packet-registry.json");
const returns = await readJson(appRoot, "src", "data", "phase-67-evidence-return-envelope-ledger.json");
const cohorts = await readJson(appRoot, "src", "data", "phase-68-compatible-series-outcome-cohorts.json");

const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-23";
Object.assign(manifest.expected_build, {
  static_pages: 4080,
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
  public_json_exports: 15,
  qualification_packets: qualification.packet_records.length,
  evidence_return_envelopes: returns.envelope_records.length,
  phase_67_synthetic_cases: 488,
  phase_60c_desk_records: 8,
  phase_68_cohort_records: cohorts.cohort_records.length,
  phase_68_compatibility_checks: cohorts.metrics.compatibility_checks,
  phase_68_candidate_measure_families: cohorts.metrics.candidate_measure_families
});

manifest.release_delta_from_v0_1_1.static_pages_added = 3898;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release with Phase 68 compatible-series admission: 715 sources, 1,406 signals, 1,121 Published signals, 121 Published and zero In Review briefings, thirteen Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 93 updates, fifteen public JSON exports, eight acquisition cohorts, sixty-four compatibility checks, thirty-two empty measure families, zero admitted cohorts, and zero observation values, series points, scores, rankings, or operating-outcome changes.";

if (!manifest.predeploy_commands.includes("npm run verify:phase68")) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, "npm run verify:phase68");
}
for (const file of [
  "dist/data/compatible-series-outcome-cohorts.json",
  "dist/briefings/outcome-cohort-admission-desk-001/index.html",
  "dist/atlas/dependency-maps/series-admission-is-not-an-outcome/index.html"
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
manifest.last_verified.static_pages_built = 4080;
manifest.last_verified.release_assertions = "passed-through-phase-68-compatible-series-admission";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-68-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-68-compatible-series-admission-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_68_delta = {
  captured_date: "2026-08-23",
  editorial_layer: "compatible-series-and-outcome-cohort-admission",
  named_file_cohorts: 8,
  compatibility_dimensions_per_cohort: 8,
  compatibility_checks: 64,
  evidence_present_checks: 16,
  partial_or_held_checks: 2,
  not_established_checks: 46,
  candidate_measure_families: 32,
  acquisition_cohorts: 8,
  admitted_cohorts: 0,
  observation_values_created: 0,
  series_points_created: 0,
  briefings_added_published: 1,
  dependency_maps_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  source_check_results_created: 0,
  underlying_signal_promotions: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-68-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 68 publishes exactly"));
const releaseGate = "Confirm Phase 68 publishes exactly 8 acquisition cohorts, 64 compatibility checks, and 32 empty candidate measure families across 10 pathways and 5 local systems, with zero admitted cohorts, observation values, series points, Phase 64 advances, scores, rankings, or operating-outcome claims";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C plus the Phase 68 compatible-series admission layer. Phase 68 defines eight named-file cohort contracts, sixty-four compatibility checks, and thirty-two empty measure families while keeping all eight cohorts in Acquisition. No future gate was checked, and no value, series point, signal promotion, named-file stage, Phase 64 cell, score, rank, comparison, causal claim, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 68 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 15 public JSON exports, 8 cohort records, and 4,080 static pages.`);
