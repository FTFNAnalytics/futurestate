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
const learning = await readJson(appRoot, "src", "data", "phase-76-cross-case-learning-portfolio-policy-retirement-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4445,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 23,
  phase_76_institutional_learning_dossiers: learning.institutional_learning_dossiers.length,
  phase_76_cross_case_transfer_registers: learning.cross_case_transfer_registers.length,
  phase_76_portfolio_governance_registers: learning.portfolio_governance_registers.length,
  phase_76_policy_supersession_retirement_ledgers: learning.policy_supersession_retirement_ledgers.length,
  phase_76_synthetic_cases: 1400
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4263;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release through Phase 76 cross-case learning, portfolio governance, cumulative burden, institutional memory, policy supersession, retirement, decommissioning, and archive control: 715 sources, 1,406 signals, 1,121 Published signals, 145 Published and zero In Review briefings, twenty-four Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 101 updates, twenty-three public JSON exports, eight inactive institutional-learning dossiers, twenty-eight inactive pairwise transfer registers, six inactive portfolio-governance registers, eight inactive policy-retirement ledgers, and zero lessons, comparisons, transfer findings, portfolio conclusions, supersessions, retirements, decommissioning closures, scores, rankings, receipts, or operating-outcome changes.";

for (const command of ["npm run test:phase76", "npm run verify:phase76"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const learningRoutes = learning.institutional_learning_dossiers.map((record) => "/evidence/learning/" + record.slug + "/").sort();
const comparisonRoutes = learning.cross_case_transfer_registers.map((record) => "/evidence/learning/" + record.slug + "/").sort();
const portfolioRoutes = learning.portfolio_governance_registers.map((record) => "/evidence/learning/" + record.slug + "/").sort();
const policyRoutes = learning.policy_supersession_retirement_ledgers.map((record) => "/evidence/learning/" + record.slug + "/").sort();
for (const file of [
  "dist/data/cross-case-learning-portfolio-policy-retirement.json",
  "dist/evidence/learning/index.html",
  "dist" + learningRoutes[0] + "index.html",
  "dist" + learningRoutes.at(-1) + "index.html",
  "dist" + comparisonRoutes[0] + "index.html",
  "dist" + comparisonRoutes.at(-1) + "index.html",
  "dist" + portfolioRoutes[0] + "index.html",
  "dist" + portfolioRoutes.at(-1) + "index.html",
  "dist" + policyRoutes[0] + "index.html",
  "dist" + policyRoutes.at(-1) + "index.html",
  "dist/briefings/cross-case-infrastructure-delivery-001/index.html",
  "dist/briefings/cross-case-public-authority-001/index.html",
  "dist/briefings/cross-case-regulated-autonomy-001/index.html",
  "dist/briefings/cross-case-industrial-capacity-001/index.html",
  "dist/briefings/cross-case-digital-assurance-001/index.html",
  "dist/briefings/cross-case-local-system-burden-001/index.html",
  "dist/briefings/institutional-memory-negative-results-001/index.html",
  "dist/briefings/policy-retirement-decommissioning-001/index.html",
  "dist/atlas/dependency-maps/audited-decision-is-not-transferable-policy/index.html",
  "dist/atlas/dependency-maps/portfolio-benefit-is-not-shared-benefit/index.html",
  "dist/atlas/dependency-maps/supersession-is-not-retirement-or-erasure/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.institutional_learning_routes = learningRoutes;
manifest.cross_case_transfer_routes = comparisonRoutes;
manifest.portfolio_governance_routes = portfolioRoutes;
manifest.policy_supersession_retirement_routes = policyRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4445;
manifest.last_verified.release_assertions = "passed-through-phase-76-cross-case-learning-portfolio-governance-policy-retirement";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-76-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-76-cross-case-learning-portfolio-governance-policy-retirement-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_76_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "cross-case-learning-transfer-conditions-portfolio-governance-cumulative-burden-policy-supersession-retirement-decommissioning-archive",
  institutional_learning_dossiers: 8,
  cross_case_transfer_registers: 28,
  portfolio_governance_registers: 6,
  policy_supersession_retirement_ledgers: 8,
  learning_admission_gates_per_dossier: 14,
  transfer_comparison_gates_per_register: 16,
  portfolio_governance_gates_per_register: 14,
  policy_lifecycle_gates_per_ledger: 14,
  learning_retention_classes_per_dossier: 12,
  transfer_condition_classes_per_register: 12,
  portfolio_risk_triggers_per_register: 12,
  decommissioning_obligations_per_ledger: 10,
  synthetic_learning_cases: 320,
  synthetic_transfer_cases: 560,
  synthetic_portfolio_cases: 240,
  synthetic_policy_lifecycle_cases: 280,
  synthetic_cases_total: 1400,
  new_briefings_added_published: 8,
  dependency_maps_added_published: 3,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 62,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operating_briefings_deepened: 8,
  independently_audited_decisions_received: 0,
  learning_dossiers_admitted: 0,
  institutional_learning_memos_published: 0,
  pairwise_comparisons_opened: 0,
  transfer_findings_published: 0,
  non_transfer_findings_published: 0,
  bounded_reuse_decisions_issued: 0,
  portfolio_findings_published: 0,
  shared_dependencies_adjudicated: 0,
  cumulative_burden_findings_adjudicated: 0,
  portfolio_rebalance_decisions_issued: 0,
  policy_supersessions_issued: 0,
  policy_retirements_issued: 0,
  decommissioning_obligations_closed: 0,
  unresolved_harms_erased: 0,
  archives_deleted: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-76-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 76 publishes exactly"));
const releaseGate = "Confirm Phase 76 publishes exactly 8 inactive institutional-learning dossiers, 28 inactive pairwise transfer registers, 6 inactive portfolio-governance registers, and 8 inactive policy-retirement ledgers with 14 learning gates, 16 transfer gates, 14 portfolio gates, 14 policy-lifecycle gates, 12 retention classes, 12 transfer-condition classes, 12 portfolio-risk triggers, and 10 decommissioning obligations, while creating zero lessons, comparisons, transfer findings, portfolio conclusions, policy reuse, supersessions, retirements, decommissioning closures, archive deletions, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 76 cross-case learning, portfolio governance, institutional-memory, cumulative-burden, policy-supersession, retirement, decommissioning, and archive layer. Its 1,400 synthetic cases test future routing only. No future gate was checked, and no real independently audited decision, admitted lesson, learning memo, comparison, transfer finding, non-transfer finding, policy reuse decision, shared-dependency finding, concentration finding, cumulative-burden finding, portfolio decision, supersession, retirement, decommissioning action, residual-duty closure, archive deletion, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Phase 76 manifest updated: " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, " + updateFiles.length + " updates, 23 public JSON exports, 50 learning routes, and 4,445 static pages.");
