import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
const registry = await readJson(appRoot, "src", "data", "phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4591,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 26,
  phase_79_public_asset_obligation_registers: registry.public_asset_obligation_registers.length,
  phase_79_lifecycle_cost_maintenance_ledgers: registry.lifecycle_cost_maintenance_ledgers.length,
  phase_79_procurement_dependency_contingent_risk_registers: registry.procurement_dependency_contingent_risk_registers.length,
  phase_79_intergenerational_balance_sheet_stewardship_ledgers: registry.intergenerational_balance_sheet_stewardship_ledgers.length,
  phase_79_synthetic_cases: 2560
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4409;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 78 compact and emergency-resilience layer through Phase 79 public assets, obligations, lifecycle cost, maintenance, procurement, vendor dependence, public options, debt, guarantees, contingent liabilities, insurance limits, reserves, sinking funds, closure, restoration, distribution, future users, fiscal stress, restructuring, and independent intergenerational audit: 715 sources, 1,406 signals, 1,121 Published signals, 177 Published and zero In Review briefings, thirty-nine Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 104 updates, twenty-six public JSON exports, eight inactive asset-obligation registers, eight inactive lifecycle-maintenance ledgers, eight inactive procurement-risk registers, eight inactive intergenerational balance sheets, and zero valuation, fiscal, liability, funding, audit, score, ranking, receipt, or operating-outcome changes.";

for (const command of ["npm run test:phase79", "npm run verify:phase79"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const assetRoutes = registry.public_asset_obligation_registers.map((record) => "/evidence/stewardship/" + record.slug + "/").sort();
const lifecycleRoutes = registry.lifecycle_cost_maintenance_ledgers.map((record) => "/evidence/stewardship/" + record.slug + "/").sort();
const procurementRoutes = registry.procurement_dependency_contingent_risk_registers.map((record) => "/evidence/stewardship/" + record.slug + "/").sort();
const balanceRoutes = registry.intergenerational_balance_sheet_stewardship_ledgers.map((record) => "/evidence/stewardship/" + record.slug + "/").sort();
for (const file of [
  "dist/data/public-wealth-intergenerational-stewardship.json",
  "dist/evidence/stewardship/index.html",
  "dist" + assetRoutes[0] + "index.html",
  "dist" + assetRoutes.at(-1) + "index.html",
  "dist" + lifecycleRoutes[0] + "index.html",
  "dist" + lifecycleRoutes.at(-1) + "index.html",
  "dist" + procurementRoutes[0] + "index.html",
  "dist" + procurementRoutes.at(-1) + "index.html",
  "dist" + balanceRoutes[0] + "index.html",
  "dist" + balanceRoutes.at(-1) + "index.html",
  "dist/briefings/public-wealth-balance-sheet-001/index.html",
  "dist/briefings/lifecycle-costing-whole-life-affordability-001/index.html",
  "dist/briefings/procurement-vendor-lockin-public-options-001/index.html",
  "dist/briefings/debt-guarantees-contingent-liabilities-001/index.html",
  "dist/briefings/insurance-uninsurable-public-risk-001/index.html",
  "dist/briefings/natural-cultural-community-assets-001/index.html",
  "dist/briefings/maintenance-state-good-repair-deferred-liability-001/index.html",
  "dist/briefings/reserves-sinking-funds-liquidity-001/index.html",
  "dist/briefings/decommissioning-restoration-funding-001/index.html",
  "dist/briefings/distributional-public-balance-sheets-001/index.html",
  "dist/briefings/future-users-option-value-irreversibility-001/index.html",
  "dist/briefings/fiscal-stress-restructuring-restoration-001/index.html",
  "dist/atlas/dependency-maps/public-asset-register-is-not-market-valuation/index.html",
  "dist/atlas/dependency-maps/capital-authorization-is-not-lifecycle-affordability/index.html",
  "dist/atlas/dependency-maps/procurement-contract-is-not-public-capacity/index.html",
  "dist/atlas/dependency-maps/insurance-coverage-is-not-risk-elimination/index.html",
  "dist/atlas/dependency-maps/reserve-balance-is-not-funded-restoration/index.html",
  "dist/atlas/dependency-maps/present-value-is-not-intergenerational-fairness/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.public_asset_obligation_routes = assetRoutes;
manifest.lifecycle_cost_maintenance_routes = lifecycleRoutes;
manifest.procurement_dependency_contingent_risk_routes = procurementRoutes;
manifest.intergenerational_balance_sheet_stewardship_routes = balanceRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4591;
manifest.last_verified.release_assertions = "passed-through-phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-79-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_79_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "public-assets-obligations-lifecycle-cost-maintenance-procurement-vendor-dependency-debt-guarantees-contingent-liabilities-insurance-reserves-closure-restoration-distribution-future-users-fiscal-stress-intergenerational-audit",
  public_asset_obligation_registers: 8,
  lifecycle_cost_maintenance_ledgers: 8,
  procurement_dependency_contingent_risk_registers: 8,
  intergenerational_balance_sheet_stewardship_ledgers: 8,
  asset_obligation_gates_per_register: 18,
  lifecycle_maintenance_gates_per_ledger: 18,
  procurement_risk_gates_per_register: 20,
  intergenerational_stewardship_gates_per_ledger: 20,
  asset_classes_per_register: 14,
  obligation_classes_per_register: 14,
  lifecycle_stages_per_ledger: 12,
  maintenance_duties_per_ledger: 12,
  dependency_classes_per_register: 12,
  liability_classes_per_register: 14,
  insurance_limits_per_register: 10,
  distribution_accounts_per_ledger: 12,
  future_user_tests_per_ledger: 12,
  fiscal_stress_triggers_per_ledger: 12,
  stewardship_duties_per_ledger: 12,
  synthetic_asset_cases: 640,
  synthetic_lifecycle_cases: 640,
  synthetic_procurement_cases: 640,
  synthetic_stewardship_cases: 640,
  synthetic_cases_total: 2560,
  new_briefings_added_published: 12,
  dependency_maps_added_published: 6,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 51,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operating_briefings_deepened: 8,
  executed_phase78_compacts_received: 0,
  assets_admitted: 0,
  obligations_or_valuations_recognized: 0,
  lifecycle_plans_or_maintenance_funding_authorized: 0,
  procurements_or_vendor_selections: 0,
  debts_guarantees_or_contingent_liabilities_recognized: 0,
  insurance_findings_issued: 0,
  reserves_sinking_or_restoration_funds_verified: 0,
  distributional_or_future_user_findings: 0,
  stress_restructuring_or_restoration_decisions: 0,
  intergenerational_audits_completed: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-79-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 79 publishes exactly"));
const releaseGate = "Confirm Phase 79 publishes exactly 8 inactive public-asset and obligation registers, 8 inactive lifecycle-cost and maintenance ledgers, 8 inactive procurement-dependency and contingent-risk registers, and 8 inactive intergenerational balance-sheet stewardship ledgers with 18 asset gates, 18 lifecycle gates, 20 procurement gates, 20 stewardship gates, 14 asset classes, 14 obligation classes, 12 lifecycle stages, 12 maintenance duties, 12 dependency classes, 14 liability classes, 10 insurance limits, 12 distribution accounts, 12 future-user tests, 12 stress triggers, and 12 stewardship duties, while creating zero valuations, commitments, liabilities, funds, intergenerational findings, audits, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 79 public-wealth and intergenerational-stewardship layer. Its 2,560 synthetic cases test future routing only. No future gate was checked, and no real executed Phase 78 compact, public asset, obligation, valuation, lifecycle plan, maintenance funding, procurement, vendor selection, debt, guarantee, contingent liability, insurance coverage finding, reserve, sinking fund, decommissioning or restoration fund, distributional finding, future-user finding, stress response, restructuring, restoration, audit, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 79 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 26 public JSON exports, 32 stewardship routes, and 4,591 static pages.`);
