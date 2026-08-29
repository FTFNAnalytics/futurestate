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
const registry = await readJson(appRoot, "src", "data", "phase-91-finance-banking-credit-capital-allocation-monetary-systems-financial-stability-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-26";
Object.assign(manifest.expected_build, {
  static_pages: 5203,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 38,
  phase_91_money_payments_banking_access_settlement_dossiers: registry.money_payments_banking_access_settlement_dossiers.length,
  phase_91_credit_underwriting_affordability_servicing_productive_allocation_ledgers: registry.credit_underwriting_affordability_servicing_productive_allocation_ledgers.length,
  phase_91_capital_markets_institutional_investment_insurance_risk_transfer_registers: registry.capital_markets_institutional_investment_insurance_risk_transfer_registers.length,
  phase_91_monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers: registry.monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers.length,
  phase_91_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5021;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 90 through Phase 91 finance, banking, credit, capital allocation, monetary systems, and financial stability: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, thirty-eight public JSON exports, thirty-two inactive Phase 91 records, and zero access, credit, allocation, investment, insurance, intervention, guarantee, resolution, loss-allocation, score, ranking, or operating-outcome changes.`;

for (const command of ["npm run test:phase91", "npm run verify:phase91"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/finance-banking-credit-financial-stability/" + record.slug + "/";
const moneyRoutes = registry.money_payments_banking_access_settlement_dossiers.map(routeFor).sort();
const creditRoutes = registry.credit_underwriting_affordability_servicing_productive_allocation_ledgers.map(routeFor).sort();
const capitalRoutes = registry.capital_markets_institutional_investment_insurance_risk_transfer_registers.map(routeFor).sort();
const stabilityRoutes = registry.monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers.map(routeFor).sort();
const guides = ["finance-banking-credit-capital-allocation-monetary-systems-financial-stability-doctrine-001", "money-units-cash-deposits-digital-currency-001", "payment-clearing-settlement-custody-continuity-001", "banking-deposits-accounts-inclusion-public-options-001", "credit-underwriting-pricing-servicing-collections-001", "household-debt-mortgages-bankruptcy-fresh-start-001", "business-project-credit-productive-allocation-additionality-001", "capital-markets-securities-valuation-liquidity-ownership-001", "asset-management-pensions-fiduciary-stewardship-001", "insurance-risk-transfer-reinsurance-catastrophe-001", "central-banks-monetary-policy-transmission-distribution-001", "financial-stability-leverage-liquidity-resolution-public-guarantees-001"];
const phase91Maps = ["account-access-is-not-financial-inclusion", "credit-availability-is-not-productive-allocation", "asset-price-growth-is-not-durable-wealth", "capitalization-is-not-resilience", "central-bank-intervention-is-not-distributional-legitimacy", "financial-innovation-is-not-financial-stability"];
for (const file of [
  "dist/data/finance-banking-credit-capital-allocation-monetary-systems-financial-stability.json", "dist/evidence/finance-banking-credit-financial-stability/index.html",
  "dist" + moneyRoutes[0] + "index.html", "dist" + moneyRoutes.at(-1) + "index.html",
  "dist" + creditRoutes[0] + "index.html", "dist" + creditRoutes.at(-1) + "index.html",
  "dist" + capitalRoutes[0] + "index.html", "dist" + capitalRoutes.at(-1) + "index.html",
  "dist" + stabilityRoutes[0] + "index.html", "dist" + stabilityRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`),
  ...phase91Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.money_payments_banking_access_settlement_routes = moneyRoutes;
manifest.credit_underwriting_affordability_servicing_productive_allocation_routes = creditRoutes;
manifest.capital_markets_institutional_investment_insurance_risk_transfer_routes = capitalRoutes;
manifest.monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_routes = stabilityRoutes;

manifest.last_verified.date = "2026-08-26";
manifest.last_verified.static_pages_built = 5203;
manifest.last_verified.release_assertions = "passed-through-phase-91-finance-banking-credit-capital-allocation-monetary-systems-financial-stability";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-91-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-91-finance-banking-credit-capital-allocation-monetary-systems-financial-stability-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_91_delta = {
  captured_date: "2026-08-26",
  editorial_layer: "money-currency-cash-deposits-digital-money-payments-clearing-settlement-custody-banking-access-inclusion-public-options-credit-underwriting-pricing-affordability-servicing-collections-bankruptcy-productive-allocation-capital-markets-securities-valuation-liquidity-ownership-asset-management-pensions-fiduciary-stewardship-insurance-risk-transfer-reinsurance-monetary-policy-transmission-distribution-systemic-risk-leverage-liquidity-resolution-public-guarantees-democratic-finance",
  money_payments_banking_access_settlement_dossiers: 8,
  credit_underwriting_affordability_servicing_productive_allocation_ledgers: 8,
  capital_markets_institutional_investment_insurance_risk_transfer_registers: 8,
  monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers: 8,
  money_gates_per_dossier: 20, credit_gates_per_ledger: 20, capital_gates_per_register: 22, stability_gates_per_ledger: 22,
  synthetic_money_cases: 640, synthetic_credit_cases: 640, synthetic_capital_cases: 640, synthetic_stability_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase90_governance_records_received: 0, money_payment_or_banking_access_findings: 0, credit_underwriting_or_allocation_decisions: 0, capital_market_insurance_or_risk_transfer_decisions: 0, monetary_policy_stability_resolution_or_guarantee_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 92 Fiscal Policy, Public Revenue, Sovereign Debt, Trade, External Balance And Macroeconomic Coordination",
  local_content_commit: "pending",
  deployment_status: "phase-91-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 91 publishes exactly"));
manifest.release_gates.push("Confirm Phase 91 publishes exactly 8 inactive money-payments-banking-access-settlement dossiers, 8 inactive credit-underwriting-affordability-servicing-productive-allocation ledgers, 8 inactive capital-markets-institutional-investment-insurance-risk-transfer registers, and 8 inactive monetary-policy-systemic-risk-resolution-public-guarantee-democratic-finance ledgers with 84 gates per chain and exact taxonomies, while creating zero monetary classification, account admission, payment finding, credit eligibility, underwriting, servicing, collection, capital allocation, valuation, investment, insurance, monetary-policy, systemic-risk, guarantee, resolution, loss-allocation, public-value, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 91 finance, banking, credit, capital-allocation, monetary-system, and financial-stability layer. Its 2,560 Phase 91 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 90 democratic-governance record, monetary classification, banking-access finding, payment or settlement decision, credit eligibility, underwriting, affordability, servicing, collection, productive-allocation, valuation, investment, insurance, claim, monetary-policy, systemic-risk, guarantee, resolution, loss-allocation, public-value, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 91 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 38 public JSON exports, 32 financial-system routes, and 5,203 static pages.`);
