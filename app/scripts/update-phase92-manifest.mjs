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
const registry = await readJson(appRoot, "src", "data", "phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-26";
Object.assign(manifest.expected_build, {
  static_pages: 5254,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 39,
  phase_92_public_revenue_tax_expenditure_distribution_compliance_dossiers: registry.public_revenue_tax_expenditure_distribution_compliance_dossiers.length,
  phase_92_budget_expenditure_stabilizer_delivery_public_value_ledgers: registry.budget_expenditure_stabilizer_delivery_public_value_ledgers.length,
  phase_92_sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers: registry.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers.length,
  phase_92_trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers: registry.trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers.length,
  phase_92_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5072;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 91 through Phase 92 fiscal policy, public revenue, sovereign debt, trade, external balance, and macroeconomic coordination: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, thirty-nine public JSON exports, thirty-two inactive Phase 92 records, and zero tax, revenue, distribution, budget, expenditure-delivery, debt, restructuring, customs, trade, treaty, supply-resilience, macro-policy, score, ranking, or operating-outcome changes.`;

for (const command of ["npm run test:phase92", "npm run verify:phase92"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/fiscal-revenue-debt-trade-macro-coordination/" + record.slug + "/";
const revenueRoutes = registry.public_revenue_tax_expenditure_distribution_compliance_dossiers.map(routeFor).sort();
const budgetRoutes = registry.budget_expenditure_stabilizer_delivery_public_value_ledgers.map(routeFor).sort();
const debtRoutes = registry.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers.map(routeFor).sort();
const macroRoutes = registry.trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers.map(routeFor).sort();
const guides = ["fiscal-policy-public-revenue-sovereign-debt-trade-macroeconomic-coordination-doctrine-001", "taxation-revenue-capacity-incidence-distribution-001", "tax-administration-compliance-enforcement-taxpayer-rights-001", "tax-expenditures-subsidies-credits-public-accountability-001", "budgets-appropriations-expenditure-delivery-public-value-001", "automatic-stabilizers-social-insurance-countercyclical-capacity-001", "fiscal-federalism-local-revenue-intergovernmental-transfers-001", "sovereign-debt-issuance-service-maturity-currency-risk-001", "fiscal-rules-public-balance-sheets-contingent-liabilities-001", "debt-restructuring-default-resolution-intergenerational-fairness-001", "trade-tariffs-customs-industrial-policy-supply-resilience-001", "external-balance-capital-account-exchange-macro-coordination-001"];
const phase92Maps = ["revenue-capacity-is-not-distributive-justice", "expenditure-authorization-is-not-delivered-public-value", "deficit-size-is-not-fiscal-sustainability", "sovereign-borrowing-is-not-productive-public-investment", "export-growth-is-not-resilient-development", "aggregate-stabilization-is-not-democratic-macroeconomic-legitimacy"];
for (const file of [
  "dist/data/fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination.json", "dist/evidence/fiscal-revenue-debt-trade-macro-coordination/index.html",
  "dist" + revenueRoutes[0] + "index.html", "dist" + revenueRoutes.at(-1) + "index.html",
  "dist" + budgetRoutes[0] + "index.html", "dist" + budgetRoutes.at(-1) + "index.html",
  "dist" + debtRoutes[0] + "index.html", "dist" + debtRoutes.at(-1) + "index.html",
  "dist" + macroRoutes[0] + "index.html", "dist" + macroRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`),
  ...phase92Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.public_revenue_tax_expenditure_distribution_compliance_routes = revenueRoutes;
manifest.budget_expenditure_stabilizer_delivery_public_value_routes = budgetRoutes;
manifest.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_routes = debtRoutes;
manifest.trade_external_balance_supply_resilience_macroeconomic_coordination_routes = macroRoutes;

manifest.last_verified.date = "2026-08-26";
manifest.last_verified.static_pages_built = 5254;
manifest.last_verified.release_assertions = "passed-through-phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-92-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_92_delta = {
  captured_date: "2026-08-26",
  editorial_layer: "fiscal-policy-public-revenue-tax-incidence-compliance-enforcement-taxpayer-rights-tax-expenditures-budgets-appropriations-expenditure-delivery-public-value-automatic-stabilizers-social-insurance-fiscal-federalism-intergovernmental-transfers-sovereign-debt-issuance-service-maturity-currency-risk-fiscal-rules-public-balance-sheets-contingent-liabilities-restructuring-default-intergenerational-fairness-trade-tariffs-customs-industrial-policy-supply-resilience-external-balance-capital-account-exchange-macroeconomic-coordination",
  public_revenue_tax_expenditure_distribution_compliance_dossiers: 8,
  budget_expenditure_stabilizer_delivery_public_value_ledgers: 8,
  sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers: 8,
  trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers: 8,
  revenue_gates_per_dossier: 20, budget_gates_per_ledger: 20, debt_gates_per_register: 22, macro_gates_per_ledger: 24, total_gates_per_chain: 86,
  synthetic_revenue_cases: 640, synthetic_budget_cases: 640, synthetic_debt_cases: 640, synthetic_macro_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase91_democratic_finance_records_received: 0, revenue_tax_distribution_compliance_decisions: 0, budget_stabilizer_delivery_public_value_decisions: 0, debt_fiscal_rule_balance_sheet_resilience_decisions: 0, trade_external_balance_supply_resilience_macro_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 93 Economic Development, Industrial Strategy, Innovation Systems, Regional Convergence And Productive Transformation",
  local_content_commit: "pending",
  deployment_status: "phase-92-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 92 publishes exactly"));
manifest.release_gates.push("Confirm Phase 92 publishes exactly 8 inactive public-revenue-tax-expenditure-distribution-compliance dossiers, 8 inactive budget-expenditure-stabilizer-delivery-public-value ledgers, 8 inactive sovereign-debt-fiscal-rule-public-balance-sheet-resilience registers, and 8 inactive trade-external-balance-supply-resilience-macroeconomic-coordination ledgers with 86 gates per chain and exact taxonomies, while creating zero tax-liability, revenue-capacity, distribution, budget-priority, appropriation, procurement, expenditure-delivery, public-value, debt-sustainability, fiscal-rule, borrowing, restructuring, customs, tariff, trade-remedy, sanction, investment-screening, treaty, external-balance, supply-resilience, macro-policy, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 92 fiscal-policy, public-revenue, sovereign-debt, trade, external-balance, and macroeconomic-coordination layer. Its 2,560 Phase 92 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 91 democratic-finance record, tax assessment, liability, incidence finding, enforcement action, revenue or distribution finding, budget priority, appropriation, procurement, benefit, expenditure-delivery or public-value finding, debt-sustainability conclusion, fiscal-rule decision, borrowing, restructuring, customs, tariff, trade-remedy, sanction, investment-screening, treaty, external-balance, supply-resilience, macroeconomic-policy, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 92 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 39 public JSON exports, 32 fiscal and macro routes, and 5,254 static pages.`);
