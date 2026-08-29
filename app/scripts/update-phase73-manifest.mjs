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
const designs = await readJson(appRoot, "src", "data", "phase-72-outcome-evidence-counterfactual-design-registry.json");
const analyses = await readJson(appRoot, "src", "data", "phase-73-analysis-execution-result-adjudication-registry.json");

const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4292,
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
  public_json_exports: 20,
  qualification_packets: qualification.packet_records.length,
  evidence_return_envelopes: returns.envelope_records.length,
  phase_67_synthetic_cases: 488,
  phase_69_synthetic_cases: 368,
  phase_70_synthetic_cases: 448,
  phase_71_synthetic_cases: 480,
  phase_72_synthetic_cases: 696,
  phase_73_synthetic_cases: 856,
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
  phase_71_comparison_embargo_registers: outcomes.comparison_embargo_registers.length,
  phase_72_outcome_evidence_packets: designs.outcome_evidence_packets.length,
  phase_72_alternative_explanation_registers: designs.alternative_explanation_registers.length,
  phase_72_counterfactual_design_dockets: designs.counterfactual_design_dockets.length,
  phase_73_analysis_execution_dockets: analyses.analysis_execution_dockets.length,
  phase_73_protocol_deviation_registers: analyses.protocol_deviation_registers.length,
  phase_73_result_adjudication_dockets: analyses.result_adjudication_dockets.length,
  phase_73_correction_withdrawal_registers: analyses.correction_withdrawal_registers.length
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4110;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release through Phase 73 registered analysis execution, deviation, result adjudication, and correction control: 715 sources, 1,406 signals, 1,121 Published signals, 131 Published and zero In Review briefings, eighteen Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 98 updates, twenty public JSON exports, thirty-two inactive execution dockets, eight empty deviation registers, eight inactive result-adjudication dockets, eight empty correction-withdrawal registers, and zero registered-design receipts, executions, deviations, unblinded results, replications, claims, corrections, withdrawals, scores, rankings, receipts, or operating-outcome changes.";

for (const command of ["npm run test:phase73", "npm run verify:phase73"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const executionRoutes = analyses.analysis_execution_dockets.map((record) => `/evidence/analysis/${record.slug}/`).sort();
const adjudicationRoutes = analyses.result_adjudication_dockets.map((record) => `/evidence/analysis/${record.slug}/`).sort();
for (const file of [
  "dist/data/analysis-execution-result-adjudication.json",
  "dist/evidence/analysis/index.html",
  `dist${executionRoutes[0]}index.html`,
  `dist${executionRoutes.at(-1)}index.html`,
  `dist${adjudicationRoutes[0]}index.html`,
  `dist${adjudicationRoutes.at(-1)}index.html`,
  "dist/briefings/registered-analysis-execution-desk-001/index.html",
  "dist/briefings/result-adjudication-desk-001/index.html",
  "dist/atlas/dependency-maps/registered-design-is-not-published-result/index.html"
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
manifest.longitudinal_panel_routes = outcomes.longitudinal_panel_shells.map((record) => `/evidence/outcomes/${record.slug}/`).sort();
manifest.outcome_claim_routes = outcomes.outcome_claim_dockets.map((record) => `/evidence/outcomes/${record.slug}/`).sort();
manifest.outcome_evidence_packet_routes = designs.outcome_evidence_packets.map((record) => `/evidence/claims/${record.slug}/`).sort();
manifest.counterfactual_design_routes = designs.counterfactual_design_dockets.map((record) => `/evidence/claims/${record.slug}/`).sort();
manifest.analysis_execution_routes = executionRoutes;
manifest.result_adjudication_routes = adjudicationRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4292;
manifest.last_verified.release_assertions = "passed-through-phase-73-analysis-execution-result-adjudication-control";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-73-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-73-analysis-execution-result-adjudication-control-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_73_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "registered-analysis-execution-deviation-result-adjudication-correction-control",
  analysis_execution_dockets: 32,
  protocol_deviation_registers: 8,
  result_adjudication_dockets: 8,
  correction_withdrawal_registers: 8,
  execution_gates_per_docket: 14,
  deviation_categories_per_register: 10,
  adjudication_gates_per_docket: 14,
  correction_classes_per_register: 8,
  synthetic_execution_cases: 544,
  synthetic_deviation_cases: 96,
  synthetic_result_adjudication_cases: 136,
  synthetic_correction_withdrawal_cases: 80,
  synthetic_cases_total: 856,
  new_briefings_added_published: 2,
  dependency_maps_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 44,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  source_check_results_created: 0,
  registered_design_receipts_received: 0,
  executions_authorized: 0,
  executions_completed: 0,
  deviations_recorded: 0,
  results_unblinded: 0,
  results_adjudicated: 0,
  independent_replications_completed: 0,
  claims_published: 0,
  causal_claims_published: 0,
  corrections_issued: 0,
  withdrawals_issued: 0,
  decision_receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-73-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 73 publishes exactly"));
const releaseGate = "Confirm Phase 73 publishes exactly 32 inactive analysis-execution dockets, 8 empty protocol-deviation registers, 8 inactive result-adjudication dockets, and 8 empty correction-withdrawal registers with 14 execution gates, 10 deviation categories, 14 adjudication gates, and 8 correction classes, while creating zero design receipts, executions, deviations, unblinded results, replications, claims, corrections, withdrawals, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 73 registered-analysis execution, deviation, result-adjudication, and correction-control layer. Phase 73 defines thirty-two inactive execution dockets, eight empty deviation registers, eight inactive adjudication dockets, and eight empty correction-withdrawal registers. Its 856 synthetic cases test execution authorization, deviation capture, result adjudication, and correction routing only. No future gate was checked, and no real registered-design receipt, input snapshot, code run, environment, execution log, output, unblinded result, deviation, robustness or falsification result, replication, effect estimate, claim, correction, withdrawal, reviewer identity, decision receipt, signal promotion, named-file stage, Phase 64 cell, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 73 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 20 public JSON exports, 40 execution and adjudication routes, and 4,292 static pages.`);
