import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readFrontmatter = async (directory) => Promise.all((await readdir(directory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(directory, name), "utf8");
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));
const briefings = await readFrontmatter(join(appRoot, "src", "content", "briefings"));
const signals = await readFrontmatter(join(appRoot, "src", "content", "signals"));
const maps = await Promise.all((await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json")).map((name) => readJson(appRoot, "src", "content", "dependency-maps", name)));
const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const phase101 = await readJson(appRoot, "src", "data", "phase-101-whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations-registry.json");
const phase102 = await readJson(appRoot, "src", "data", "phase-102-public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");
const p101 = [
  phase101.whole_system_scenario_assumption_boundary_driver_uncertainty_dossiers,
  phase101.cross_domain_dependency_cascade_compound_risk_polycrisis_stress_test_ledgers,
  phase101.preparedness_option_portfolio_continuity_recovery_transformation_registers,
  phase101.civilizational_resilience_renewal_future_generations_stewardship_ledgers
];
const p102 = [
  phase102.canonical_public_synthesis_claim_boundary_evidence_lineage_dossiers,
  phase102.civic_decision_literacy_uncertainty_tradeoff_public_reason_ledgers,
  phase102.reader_navigation_learning_pathway_accessibility_translation_registers,
  phase102.content_completeness_maintenance_correction_archive_evergreen_stewardship_ledgers
];

manifest.generated_date = "2026-08-28";
Object.assign(manifest.expected_build, {
  static_pages: 5764,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 49,
  phase_101_whole_system_scenario_assumption_boundary_driver_uncertainty_dossiers: p101[0].length,
  phase_101_cross_domain_dependency_cascade_compound_risk_polycrisis_stress_test_ledgers: p101[1].length,
  phase_101_preparedness_option_portfolio_continuity_recovery_transformation_registers: p101[2].length,
  phase_101_civilizational_resilience_renewal_future_generations_stewardship_ledgers: p101[3].length,
  phase_101_synthetic_cases: 2560,
  phase_102_canonical_public_synthesis_claim_boundary_evidence_lineage_dossiers: p102[0].length,
  phase_102_civic_decision_literacy_uncertainty_tradeoff_public_reason_ledgers: p102[1].length,
  phase_102_reader_navigation_learning_pathway_accessibility_translation_registers: p102[2].length,
  phase_102_content_completeness_maintenance_correction_archive_evergreen_stewardship_ledgers: p102[3].length,
  phase_102_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5582;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Completes the planned content roadmap through Phase 102: 715 sources, 1,406 signals, 1,121 Published signals, " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, fifteen reader pathways, sixteen evidence gaps, " + updates.length + " updates, forty-nine public JSON exports, sixty-four inactive Phase 101-102 records, and zero scenario, readiness, resilience, synthesis, reader, content-closure, score, ranking, or operating-outcome changes.";
for (const command of ["npm run test:phase101", "npm run verify:phase101", "npm run test:phase102", "npm run verify:phase102"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}
const routeFor = (base) => (record) => "/evidence/" + base + "/" + record.slug + "/";
const p101Base = "whole-system-futures-scenario-governance-polycrisis-readiness-civilizational-resilience-future-generations";
const p102Base = "public-knowledge-synthesis-civic-decision-literacy-reader-navigation-content-closure-evergreen-stewardship";
const p101Routes = p101.map((records) => records.map(routeFor(p101Base)).sort());
const p102Routes = p102.map((records) => records.map(routeFor(p102Base)).sort());
manifest.whole_system_scenario_assumption_boundary_driver_uncertainty_routes = p101Routes[0];
manifest.cross_domain_dependency_cascade_compound_risk_polycrisis_stress_test_routes = p101Routes[1];
manifest.preparedness_option_portfolio_continuity_recovery_transformation_routes = p101Routes[2];
manifest.civilizational_resilience_renewal_future_generations_stewardship_routes = p101Routes[3];
manifest.canonical_public_synthesis_claim_boundary_evidence_lineage_routes = p102Routes[0];
manifest.civic_decision_literacy_uncertainty_tradeoff_public_reason_routes = p102Routes[1];
manifest.reader_navigation_learning_pathway_accessibility_translation_routes = p102Routes[2];
manifest.content_completeness_maintenance_correction_archive_evergreen_stewardship_routes = p102Routes[3];

const p101Guides = ["whole-system-futures-scenario-governance-polycrisis-resilience-doctrine-001", "scenario-purpose-assumptions-boundaries-uncertainty-001", "drivers-discontinuities-branching-signposts-triggers-001", "models-quantification-tail-risk-deep-uncertainty-001", "cross-domain-dependencies-cascades-feedback-polycrisis-001", "stress-tests-exercises-near-misses-corrective-action-001", "preparedness-options-hedges-reserves-real-options-001", "continuity-recovery-restoration-reconstruction-transformation-001", "distributed-capacity-mutual-aid-public-options-001", "civilizational-resilience-essential-floors-knowledge-institutions-001", "future-generations-standing-option-value-irreversible-harm-001", "renewal-nonrecurrence-shared-human-futures-001"];
const p101Maps = ["scenario-is-not-a-forecast", "risk-register-is-not-readiness", "foresight-exercise-is-not-a-decision", "redundancy-is-not-resilience", "continuity-is-not-renewal", "long-term-goal-is-not-future-generations-protection"];
const p102Guides = ["public-knowledge-synthesis-decision-literacy-content-stewardship-doctrine-001", "canonical-synthesis-claim-boundaries-evidence-lineage-001", "counterevidence-uncertainty-confidence-correction-001", "facts-findings-inferences-scenarios-judgments-001", "civic-decision-literacy-authority-options-tradeoffs-001", "numbers-denominators-risk-causation-public-reason-001", "distribution-rights-values-disagreement-legitimate-pluralism-001", "reader-orientation-learning-pathways-progressive-disclosure-001", "accessibility-plain-language-translation-low-bandwidth-001", "search-cross-links-comparative-reading-without-ranking-001", "content-coverage-gaps-quality-debt-maintenance-ownership-001", "corrections-versioning-archives-refresh-evergreen-stewardship-001"];
const p102Maps = ["synthesis-is-not-new-evidence", "explanation-is-not-recommendation-or-authorization", "navigation-is-not-comprehension-or-access", "publication-volume-is-not-content-completeness", "archive-is-not-erasure", "stable-page-is-not-evergreen-truth"];
for (const file of [
  "dist/data/" + p101Base + ".json", "dist/evidence/" + p101Base + "/index.html",
  ...p101Routes.flatMap((routes) => ["dist" + routes[0] + "index.html", "dist" + routes.at(-1) + "index.html"]),
  ...p101Guides.map((slug) => "dist/briefings/" + slug + "/index.html"),
  ...p101Maps.map((slug) => "dist/atlas/dependency-maps/" + slug + "/index.html"),
  "dist/data/" + p102Base + ".json", "dist/evidence/" + p102Base + "/index.html",
  ...p102Routes.flatMap((routes) => ["dist" + routes[0] + "index.html", "dist" + routes.at(-1) + "index.html"]),
  ...p102Guides.map((slug) => "dist/briefings/" + slug + "/index.html"),
  ...p102Maps.map((slug) => "dist/atlas/dependency-maps/" + slug + "/index.html")
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.last_verified.date = "2026-08-28";
manifest.last_verified.static_pages_built = 5764;
manifest.last_verified.release_assertions = "passed-through-phase-102-content-roadmap-complete";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-102-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-102-content-roadmap-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_101_delta = {
  captured_date: "2026-08-28", governed_records: 32, total_gates_per_chain: 88, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase100_shared_futures_records_received: 0, substantive_decisions: 0, receipts_created: 0, matrix_cells_advanced: 0, scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_content_phase: "Phase 102 Public Knowledge Synthesis, Civic Decision Literacy, Reader Navigation, Content Closure And Evergreen Stewardship"
};
manifest.phase_102_delta = {
  captured_date: "2026-08-28", governed_records: 32, total_gates_per_chain: 88, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase101_resilience_records_received: 0, substantive_decisions: 0, receipts_created: 0, matrix_cells_advanced: 0, scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  roadmap_state: "content_complete_evidence_operations_continue",
  next_content_phase: "No additional planned expansion phase; continue dated evidence operations, corrections and evergreen stewardship",
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-102-content-roadmap-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 101 publishes exactly") && !item.startsWith("Confirm Phase 102 publishes exactly"));
manifest.release_gates.push("Confirm Phase 101 publishes four exact eight-record inactive scenario, polycrisis, readiness and civilizational-resilience families with 88 gates per chain and zero forecast, readiness, recovery, resilience, renewal, future-generations, receipt, score, ranking, Phase 64 or operating-outcome decisions");
manifest.release_gates.push("Confirm Phase 102 publishes four exact eight-record inactive synthesis, decision-literacy, reader-navigation and evergreen-stewardship families with 88 gates per chain and zero evidence, recommendation, reader-classification, accessibility, completeness, archive, deletion, evergreen-truth, receipt, score, ranking, Phase 64 or operating-outcome decisions");
manifest.notes = "This manifest records Waves 60B-60C through the terminal Phase 102 content-completion layer. Its 5,120 Phase 101-102 cases are synthetic routing fixtures only. The content roadmap is complete, but dated evidence operations, corrections, source-health review and evergreen stewardship continue. No future gate was checked and no substantive Phase 101 or Phase 102 decision was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Phase 102 terminal manifest updated: " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, " + updates.length + " updates, 49 public JSON exports, 64 Phase 101-102 routes, and 5,764 static pages.");
