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
const registry = await readJson(appRoot, "src", "data", "phase-89-income-wealth-poverty-social-protection-economic-security-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-25";
Object.assign(manifest.expected_build, {
  static_pages: 5101,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 36,
  phase_89_household_income_earnings_tax_transfer_resource_dossiers: registry.household_income_earnings_tax_transfer_resource_dossiers.length,
  phase_89_wealth_assets_debt_liabilities_intergenerational_balance_ledgers: registry.wealth_assets_debt_liabilities_intergenerational_balance_ledgers.length,
  phase_89_poverty_deprivation_social_protection_benefit_access_registers: registry.poverty_deprivation_social_protection_benefit_access_registers.length,
  phase_89_economic_security_distribution_shock_mobility_long_horizon_ledgers: registry.economic_security_distribution_shock_mobility_long_horizon_ledgers.length,
  phase_89_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4919;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 88 through Phase 89 income, wealth, poverty, social protection, and economic security: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, thirty-six public JSON exports, thirty-two inactive Phase 89 records, and zero tax, transfer, wealth, poverty, benefit, distribution, mobility, score, ranking, or operating-outcome changes.`;

for (const command of ["npm run test:phase89", "npm run verify:phase89"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/income-wealth-economic-security/" + record.slug + "/";
const incomeRoutes = registry.household_income_earnings_tax_transfer_resource_dossiers.map(routeFor).sort();
const wealthRoutes = registry.wealth_assets_debt_liabilities_intergenerational_balance_ledgers.map(routeFor).sort();
const protectionRoutes = registry.poverty_deprivation_social_protection_benefit_access_registers.map(routeFor).sort();
const securityRoutes = registry.economic_security_distribution_shock_mobility_long_horizon_ledgers.map(routeFor).sort();
const guides = ["income-wealth-poverty-social-protection-economic-security-doctrine-001", "household-income-earnings-resources-001", "taxes-transfers-redistribution-fiscal-incidence-001", "wealth-assets-liabilities-balance-sheets-001", "debt-credit-insolvency-financial-resilience-001", "poverty-material-deprivation-persistent-hardship-001", "benefit-eligibility-take-up-denial-appeal-001", "unemployment-disability-care-child-family-protection-001", "pensions-retirement-survivor-late-life-security-001", "inflation-prices-costs-macroeconomic-shocks-001", "community-wealth-universal-supports-public-options-001", "intergenerational-mobility-distribution-shared-prosperity-001"];
const phase89Maps = ["income-transfer-is-not-freedom-from-poverty", "earnings-are-not-household-wealth", "benefit-eligibility-is-not-benefit-access", "aggregate-growth-is-not-shared-prosperity", "asset-ownership-is-not-economic-security", "poverty-exit-is-not-durable-mobility"];
for (const file of [
  "dist/data/income-wealth-poverty-social-protection-economic-security.json", "dist/evidence/income-wealth-economic-security/index.html",
  "dist" + incomeRoutes[0] + "index.html", "dist" + incomeRoutes.at(-1) + "index.html",
  "dist" + wealthRoutes[0] + "index.html", "dist" + wealthRoutes.at(-1) + "index.html",
  "dist" + protectionRoutes[0] + "index.html", "dist" + protectionRoutes.at(-1) + "index.html",
  "dist" + securityRoutes[0] + "index.html", "dist" + securityRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`),
  ...phase89Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.household_income_earnings_tax_transfer_resource_routes = incomeRoutes;
manifest.wealth_assets_debt_liabilities_intergenerational_balance_routes = wealthRoutes;
manifest.poverty_deprivation_social_protection_benefit_access_routes = protectionRoutes;
manifest.economic_security_distribution_shock_mobility_long_horizon_routes = securityRoutes;

manifest.last_verified.date = "2026-08-25";
manifest.last_verified.static_pages_built = 5101;
manifest.last_verified.release_assertions = "passed-through-phase-89-income-wealth-poverty-social-protection-economic-security";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-89-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-89-income-wealth-poverty-social-protection-economic-security-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_89_delta = {
  captured_date: "2026-08-25",
  editorial_layer: "household-income-earnings-taxes-transfers-fiscal-incidence-resources-wealth-assets-liabilities-debt-credit-insolvency-inheritance-poverty-material-deprivation-social-protection-benefit-access-denial-appeal-pensions-shock-response-distribution-shared-prosperity-community-wealth-intergenerational-mobility-long-horizon-economic-security",
  household_income_earnings_tax_transfer_resource_dossiers: 8,
  wealth_assets_debt_liabilities_intergenerational_balance_ledgers: 8,
  poverty_deprivation_social_protection_benefit_access_registers: 8,
  economic_security_distribution_shock_mobility_long_horizon_ledgers: 8,
  income_gates_per_dossier: 20, wealth_gates_per_ledger: 20, protection_gates_per_register: 22, security_gates_per_ledger: 22,
  synthetic_income_cases: 640, synthetic_wealth_cases: 640, synthetic_protection_cases: 640, synthetic_security_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase88_livelihood_records_received: 0, household_income_or_resource_findings: 0, wealth_or_balance_sheet_findings: 0, poverty_or_deprivation_findings: 0, benefit_access_or_protection_decisions: 0, economic_security_or_distribution_findings: 0, mobility_or_shared_prosperity_findings: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 90 Markets, Firms, Competition, Corporate Power And Democratic Economic Governance",
  local_content_commit: "pending",
  deployment_status: "phase-89-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 89 publishes exactly"));
manifest.release_gates.push("Confirm Phase 89 publishes exactly 8 inactive household-income-earnings-tax-transfer-resource dossiers, 8 inactive wealth-assets-debt-liabilities-intergenerational-balance ledgers, 8 inactive poverty-deprivation-social-protection-benefit-access registers, and 8 inactive economic-security-distribution-shock-mobility-long-horizon ledgers with 84 gates per chain and exact taxonomies, while creating zero tax, transfer, valuation, household, poverty, eligibility, denial, sanction, benefit, wealth, distribution, mobility, remedy, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 89 income, wealth, poverty, social-protection, and economic-security layer. Its 2,560 Phase 89 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 88 livelihood record, household-income or resource finding, tax or transfer decision, wealth or debt finding, poverty or deprivation classification, benefit eligibility, denial, sanction, social-protection decision, distribution or mobility finding, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 89 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 36 public JSON exports, 32 income and economic-security routes, and 5,101 static pages.`);
