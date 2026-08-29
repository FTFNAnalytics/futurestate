import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));

const readFrontmatterRecords = async (directory) => Promise.all((await readdir(directory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(directory, name), "utf8");
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));

const briefings = await readFrontmatterRecords(join(appRoot, "src", "content", "briefings"));
const signals = await readFrontmatterRecords(join(appRoot, "src", "content", "signals"));
const maps = await Promise.all((await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json")).map((name) => readJson(appRoot, "src", "content", "dependency-maps", name)));
const updateFiles = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const synthesis = await readJson(appRoot, "src", "data", "phase-74-evidence-synthesis-challenge-decision-translation-registry.json");

const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4336,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 21,
  phase_74_result_synthesis_input_dockets: synthesis.result_synthesis_input_dockets.length,
  phase_74_synthesis_contradiction_dossiers: synthesis.synthesis_contradiction_dossiers.length,
  phase_74_external_challenge_response_dockets: synthesis.external_challenge_response_dockets.length,
  phase_74_decision_translation_reevaluation_registers: synthesis.decision_translation_reevaluation_registers.length,
  phase_74_synthetic_cases: 1000
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4154;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release through Phase 74 evidence synthesis, contradiction, external challenge, decision translation, and reevaluation control: 715 sources, 1,406 signals, 1,121 Published signals, 133 Published and zero In Review briefings, nineteen Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 99 updates, twenty-one public JSON exports, thirty-two inactive synthesis inputs, eight inactive synthesis-contradiction dossiers, eight inactive challenge dockets, eight inactive translation registers, and zero adjudicated inputs, syntheses, grades, challenges, recommendations, authorizations, reevaluations, scores, rankings, receipts, or operating-outcome changes.";

for (const command of ["npm run test:phase74", "npm run verify:phase74"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const inputRoutes = synthesis.result_synthesis_input_dockets.map((record) => `/evidence/synthesis/${record.slug}/`).sort();
const synthesisRoutes = synthesis.synthesis_contradiction_dossiers.map((record) => `/evidence/synthesis/${record.slug}/`).sort();
for (const file of [
  "dist/data/evidence-synthesis-challenge-decision-translation.json",
  "dist/evidence/synthesis/index.html",
  `dist${inputRoutes[0]}index.html`,
  `dist${inputRoutes.at(-1)}index.html`,
  `dist${synthesisRoutes[0]}index.html`,
  `dist${synthesisRoutes.at(-1)}index.html`,
  "dist/briefings/evidence-synthesis-desk-001/index.html",
  "dist/briefings/challenge-decision-translation-desk-001/index.html",
  "dist/atlas/dependency-maps/adjudicated-result-is-not-decision-recommendation/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => `/briefings/${record.slug}/`).sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => `/briefings/${record.slug}/`).sort();
manifest.published_signal_routes = publishedSignals.map((record) => `/signals/${record.slug}/`).sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => `/signals/${record.slug}/`).sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => `/atlas/dependency-maps/${record.slug}/`).sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => `/atlas/dependency-maps/${record.slug}/`).sort();
manifest.result_synthesis_input_routes = inputRoutes;
manifest.synthesis_contradiction_routes = synthesisRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4336;
manifest.last_verified.release_assertions = "passed-through-phase-74-evidence-synthesis-challenge-decision-translation-control";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-74-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-74-evidence-synthesis-challenge-decision-translation-control-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_74_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "evidence-synthesis-contradiction-external-challenge-decision-translation-reevaluation-control",
  result_synthesis_input_dockets: 32,
  synthesis_contradiction_dossiers: 8,
  external_challenge_response_dockets: 8,
  decision_translation_reevaluation_registers: 8,
  synthesis_eligibility_gates_per_input: 14,
  synthesis_gates_per_dossier: 14,
  evidence_grade_classes: 7,
  contradiction_categories_per_dossier: 10,
  challenge_review_gates_per_docket: 12,
  decision_translation_gates_per_register: 14,
  reevaluation_triggers_per_register: 10,
  synthetic_input_cases: 576,
  synthetic_synthesis_cases: 160,
  synthetic_challenge_cases: 120,
  synthetic_translation_cases: 144,
  synthetic_cases_total: 1000,
  new_briefings_added_published: 2,
  dependency_maps_added_published: 1,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 44,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  adjudicated_results_received: 0,
  synthesis_inputs_admitted: 0,
  syntheses_adjudicated: 0,
  evidence_grades_assigned: 0,
  contradictions_recorded: 0,
  challenges_received: 0,
  recommendations_published: 0,
  decision_authorizations_issued: 0,
  reevaluations_scheduled: 0,
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
  deployment_status: "phase-74-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 74 publishes exactly"));
const releaseGate = "Confirm Phase 74 publishes exactly 32 inactive result-synthesis input dockets and 8 each of synthesis-contradiction, external-challenge, and decision-translation/reevaluation controls with 14 input gates, 14 synthesis gates, 7 evidence grades, 10 contradiction categories, 12 challenge gates, 14 translation gates, and 10 reevaluation triggers, while creating zero results, syntheses, grades, challenges, recommendations, authorizations, reevaluations, corrections, withdrawals, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 74 evidence-synthesis, contradiction, external-challenge, decision-translation, and reevaluation layer. Phase 74 defines thirty-two inactive result-input dockets and eight each of inactive synthesis, challenge, and translation controls. Its 1,000 synthetic cases test future routing only. No future gate was checked, and no real adjudicated result, synthesis input, compatible body, contradiction decision, evidence grade, synthesis claim, challenge, response, option, benefit, harm, recommendation, authorization, monitoring plan, sunset, reevaluation, correction, withdrawal, reviewer identity, decision receipt, signal promotion, named-file stage, Phase 64 cell, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 74 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 21 public JSON exports, 40 synthesis routes, and 4,336 static pages.`);
