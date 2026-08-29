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
const measurements = await readJson(appRoot, "src", "data", "phase-69-measurement-observation-break-registry.json");
const reviews = await readJson(appRoot, "src", "data", "phase-70-observation-review-series-admission-registry.json");
const outcomes = await readJson(appRoot, "src", "data", "phase-71-longitudinal-panel-outcome-comparison-registry.json");

const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-23";
Object.assign(manifest.expected_build, {
  static_pages: 4204,
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
  public_json_exports: 18,
  qualification_packets: qualification.packet_records.length,
  evidence_return_envelopes: returns.envelope_records.length,
  phase_67_synthetic_cases: 488,
  phase_69_synthetic_cases: 368,
  phase_70_synthetic_cases: 448,
  phase_71_synthetic_cases: 480,
  phase_60c_desk_records: 8,
  phase_68_cohort_records: cohorts.cohort_records.length,
  phase_68_compatibility_checks: cohorts.metrics.compatibility_checks,
  phase_68_candidate_measure_families: cohorts.metrics.candidate_measure_families,
  phase_69_measurement_specifications: measurements.measurement_specifications.length,
  phase_69_intake_envelopes: measurements.observation_intake_envelopes.length,
  phase_69_series_break_registers: measurements.series_break_registers.length,
  phase_70_observation_review_dockets: reviews.observation_review_dockets.length,
  phase_70_revision_lineage_registers: reviews.observation_revision_lineage_registers.length,
  phase_70_series_admission_dockets: reviews.series_admission_dockets.length,
  phase_71_longitudinal_panel_shells: outcomes.longitudinal_panel_shells.length,
  phase_71_outcome_claim_dockets: outcomes.outcome_claim_dockets.length,
  phase_71_comparison_embargo_registers: outcomes.comparison_embargo_registers.length
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4022;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release through Phase 71 longitudinal panel, outcome-claim, and comparison control: 715 sources, 1,406 signals, 1,121 Published signals, 127 Published and zero In Review briefings, sixteen Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 96 updates, eighteen public JSON exports, thirty-two empty panel shells, eight not-ready outcome-claim dockets, eight active comparison embargoes, and zero admitted series, points, values, trends, outcome claims, comparisons, scores, rankings, receipts, or operating-outcome changes.";

for (const command of ["npm run test:phase71", "npm run verify:phase71"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const panelRoutes = outcomes.longitudinal_panel_shells.map((record) => `/evidence/outcomes/${record.slug}/`).sort();
const outcomeRoutes = outcomes.outcome_claim_dockets.map((record) => `/evidence/outcomes/${record.slug}/`).sort();
for (const file of [
  "dist/data/longitudinal-panels-outcome-claims.json",
  "dist/evidence/outcomes/index.html",
  `dist${panelRoutes[0]}index.html`,
  `dist${panelRoutes.at(-1)}index.html`,
  `dist${outcomeRoutes[0]}index.html`,
  `dist${outcomeRoutes.at(-1)}index.html`,
  "dist/briefings/longitudinal-panel-desk-001/index.html",
  "dist/briefings/outcome-claim-comparison-protocol-001/index.html",
  "dist/atlas/dependency-maps/admitted-series-is-not-causal-outcome/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => `/briefings/${record.slug}/`).sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => `/briefings/${record.slug}/`).sort();
manifest.published_signal_routes = publishedSignals.map((record) => `/signals/${record.slug}/`).sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => `/signals/${record.slug}/`).sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => `/atlas/dependency-maps/${record.slug}/`).sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => `/atlas/dependency-maps/${record.slug}/`).sort();
manifest.qualification_packet_routes = qualification.packet_records.map((record) => `/evidence/qualification/${record.slug}/`).sort();
manifest.evidence_return_envelope_routes = returns.envelope_records.map((record) => `/evidence/qualification/${record.slug}/`).sort();
manifest.measurement_specification_routes = measurements.measurement_specifications.map((record) => `/evidence/measurements/${record.slug}/`).sort();
manifest.observation_review_routes = reviews.observation_review_dockets.map((record) => `/evidence/review/${record.slug}/`).sort();
manifest.series_admission_routes = reviews.series_admission_dockets.map((record) => `/evidence/review/${record.slug}/`).sort();
manifest.longitudinal_panel_routes = panelRoutes;
manifest.outcome_claim_routes = outcomeRoutes;

manifest.last_verified.date = "2026-08-23";
manifest.last_verified.static_pages_built = 4204;
manifest.last_verified.release_assertions = "passed-through-phase-71-longitudinal-panel-outcome-claim-comparison-control";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-71-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-71-longitudinal-panel-outcome-claim-comparison-control-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_71_delta = {
  captured_date: "2026-08-23",
  editorial_layer: "longitudinal-panel-outcome-claim-comparison-control",
  longitudinal_panel_shells: 32,
  outcome_claim_dockets: 8,
  comparison_embargo_registers: 8,
  outcome_inference_dimensions_per_docket: 10,
  comparison_eligibility_dimensions_per_register: 10,
  synthetic_panel_cases: 320,
  synthetic_outcome_claim_cases: 80,
  synthetic_comparison_cases: 80,
  synthetic_cases_total: 480,
  new_briefings_added_published: 2,
  dependency_maps_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 44,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  source_check_results_created: 0,
  admitted_series_received: 0,
  panel_series_points_created: 0,
  values_published: 0,
  trends_created: 0,
  outcome_claims_published: 0,
  comparisons_approved: 0,
  decision_receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-71-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 71 publishes exactly"));
const releaseGate = "Confirm Phase 71 publishes exactly 32 empty longitudinal panel shells, 8 not-ready outcome-claim dockets, and 8 active comparison embargo registers with 10 outcome and 10 comparison dimensions, while creating zero admitted series, points, values, trends, outcome claims, comparisons, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 71 longitudinal-panel, outcome-claim, and comparison-control layer. Phase 71 defines thirty-two empty panel shells, eight not-ready outcome-claim dockets, and eight active comparison embargoes. Its 480 synthetic cases test panel, claim, and comparison routing only. No future gate was checked, and no real admitted series, point, value, period result, direction, magnitude, trend, adverse-evidence decision, attribution, counterfactual, outcome claim, peer comparison, composite, score, rank, reviewer identity, decision receipt, signal promotion, named-file stage, Phase 64 cell, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 71 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 18 public JSON exports, 40 panel and outcome routes, and 4,204 static pages.`);
