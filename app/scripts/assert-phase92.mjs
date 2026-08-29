import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination-registry.json");
const phase91 = await readJson(appRoot, "src", "data", "phase-91-finance-banking-credit-capital-allocation-monetary-systems-financial-stability-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const revenue = registry.public_revenue_tax_expenditure_distribution_compliance_dossiers;
const budgets = registry.budget_expenditure_stabilizer_delivery_public_value_ledgers;
const debt = registry.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers;
const macro = registry.trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers;

check(registry.phase === "92" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 92 registry metadata is invalid.");
check(revenue.length === 8 && budgets.length === 8 && debt.length === 8 && macro.length === 8, "Phase 92 must preserve four eight-record families.");
check(registry.revenue_gates.length === 20 && registry.budget_gates.length === 20 && registry.debt_gates.length === 22 && registry.macro_gates.length === 24, "Phase 92 must preserve an 86-gate chain.");
check(registry.public_revenue_tax_instrument_classes.length === 14 && registry.revenue_incidence_compliance_administration_dimensions.length === 12 && registry.taxpayer_rights_transparency_distribution_safeguards.length === 12, "Phase 92 revenue taxonomies are incomplete.");
check(registry.budget_expenditure_delivery_classes.length === 14 && registry.budget_stabilizer_delivery_dimensions.length === 12 && registry.budget_public_value_safeguards.length === 12, "Phase 92 budget taxonomies are incomplete.");
check(registry.sovereign_obligation_financing_classes.length === 14 && registry.debt_fiscal_rule_balance_sheet_dimensions.length === 12 && registry.debt_resilience_restructuring_intergenerational_safeguards.length === 12, "Phase 92 debt taxonomies are incomplete.");
check(registry.trade_external_account_instrument_classes.length === 14 && registry.trade_supply_external_balance_macro_dimensions.length === 12 && registry.trade_adjustment_distribution_due_process_safeguards.length === 12 && registry.long_horizon_macroeconomic_capacity_tests.length === 12, "Phase 92 trade and macro taxonomies are incomplete.");

const cohorts = phase91.monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["revenue", revenue, "public_revenue_tax_expenditure_distribution_compliance_dossier_id", "revenue_state", "revenue_decision", "revenue_checks", 20],
  ["budget", budgets, "budget_expenditure_stabilizer_delivery_public_value_ledger_id", "budget_state", "budget_decision", "budget_checks", 20],
  ["debt", debt, "sovereign_debt_fiscal_rule_public_balance_sheet_resilience_register_id", "debt_state", "debt_decision", "debt_checks", 22],
  ["macro", macro, "trade_external_balance_supply_resilience_macroeconomic_coordination_ledger_id", "macro_state", "macro_decision", "macro_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), `Phase 92 ${name} cohorts do not preserve Phase 91 identity.`);
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, `Phase 92 ${name} identities are not unique.`);
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", `${record[idKey]} is not a Published inactive contract.`);
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), `${record[idKey]} has an invalid gate set.`);
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", `${record[idKey]} crosses a review, automation, propagation, or stage boundary.`);
    for (const [key, value] of Object.entries(record)) if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records")) check(Array.isArray(value) && value.length === 0, `${record[idKey]} ${key} must remain empty.`);
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, `Phase 92 metric ${key} must remain zero.`);

const guides = ["fiscal-policy-public-revenue-sovereign-debt-trade-macroeconomic-coordination-doctrine-001", "taxation-revenue-capacity-incidence-distribution-001", "tax-administration-compliance-enforcement-taxpayer-rights-001", "tax-expenditures-subsidies-credits-public-accountability-001", "budgets-appropriations-expenditure-delivery-public-value-001", "automatic-stabilizers-social-insurance-countercyclical-capacity-001", "fiscal-federalism-local-revenue-intergovernmental-transfers-001", "sovereign-debt-issuance-service-maturity-currency-risk-001", "fiscal-rules-public-balance-sheets-contingent-liabilities-001", "debt-restructuring-default-resolution-intergenerational-fairness-001", "trade-tariffs-customs-industrial-policy-supply-resilience-001", "external-balance-capital-account-exchange-macro-coordination-001"];
const maps = ["revenue-capacity-is-not-distributive-justice", "expenditure-authorization-is-not-delivered-public-value", "deficit-size-is-not-fiscal-sustainability", "sovereign-borrowing-is-not-productive-public-investment", "export-growth-is-not-resilient-development", "aggregate-stabilization-is-not-democratic-macroeconomic-legitimacy"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", `briefing-${slug}.mdx`), `Phase 92 guide ${slug} is missing.`);
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", `${slug}.json`), `Phase 92 map ${slug} is missing.`);
const guideIds = guides.map((slug) => `briefing-${slug}`), mapIds = maps.map((slug) => `dependency-map-${slug}`);
for (const pathwayId of new Set(revenue.flatMap((record) => record.reader_pathway_ids))) {
  const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 92 content.`);
}
for (const id of new Set(revenue.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", `${id}.mdx`)).includes("## Phase 92 fiscal policy, public revenue, sovereign debt, trade, external balance, and macroeconomic coordination boundary"), `${id} omits Phase 92.`);
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 92 fiscal policy, public revenue, sovereign debt, trade, external balance, and macroeconomic coordination boundary"), `${file} omits Phase 92.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 92 fiscal policy, public revenue, sovereign debt, trade, external balance, and macroeconomic coordination control"), `${file} omits Phase 92 control.`);

check(await exists(appRoot, "src", "pages", "evidence", "fiscal-revenue-debt-trade-macro-coordination", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "fiscal-revenue-debt-trade-macro-coordination", "[id].astro") && await exists(appRoot, "src", "pages", "data", "fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination.json.ts"), "Phase 92 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Fiscal Policy, Public Revenue, Sovereign Debt, Trade, External Balance And Macroeconomic Coordination") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 92.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("fiscalRevenueDebtMacroRegistry") && sitemap.includes("/evidence/fiscal-revenue-debt-trade-macro-coordination/"), "The sitemap omits Phase 92.");
const phase91Detail = await readText(appRoot, "src", "pages", "evidence", "finance-banking-credit-financial-stability", "[id].astro");
check(phase91Detail.includes("Phase 92 Destination") && phase91Detail.includes("/evidence/fiscal-revenue-debt-trade-macro-coordination/"), "Phase 91 detail routes omit the Phase 92 handoff.");
check(manifest.expected_build.static_pages >= 5254 && manifest.expected_build.public_json_exports >= 39 && manifest.expected_build.phase_92_public_revenue_tax_expenditure_distribution_compliance_dossiers === 8 && manifest.expected_build.phase_92_budget_expenditure_stabilizer_delivery_public_value_ledgers === 8 && manifest.expected_build.phase_92_sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers === 8 && manifest.expected_build.phase_92_trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers === 8 && manifest.expected_build.phase_92_synthetic_cases === 2560, "The release manifest omits Phase 92 counts.");
check(manifest.public_revenue_tax_expenditure_distribution_compliance_routes?.length === 8 && manifest.budget_expenditure_stabilizer_delivery_public_value_routes?.length === 8 && manifest.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_routes?.length === 8 && manifest.trade_external_balance_supply_resilience_macroeconomic_coordination_routes?.length === 8, "The release manifest omits Phase 92 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination.md"), "The Phase 92 work package is missing.");

if (failures.length) { console.error(`Phase 92 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 92 assertions passed: 8 inactive revenue dossiers, 8 inactive budget ledgers, 8 inactive debt registers, 8 inactive macro ledgers, 86 gates per chain, exact taxonomies, 10 pathways, and 0 tax, budget, debt, trade, treaty, supply-resilience, macro-policy, score, ranking, or Phase 64 decisions.");
