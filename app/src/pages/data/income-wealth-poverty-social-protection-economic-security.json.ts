import registry from "../../data/phase-89-income-wealth-poverty-social-protection-economic-security-registry.json";

export function GET() {
  const records = [
    ...registry.household_income_earnings_tax_transfer_resource_dossiers,
    ...registry.wealth_assets_debt_liabilities_intergenerational_balance_ledgers,
    ...registry.poverty_deprivation_social_protection_benefit_access_registers,
    ...registry.economic_security_distribution_shock_mobility_long_horizon_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "income_wealth_poverty_social_protection_economic_security",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive household-income, earnings, tax, transfer, resources, wealth, assets, liabilities, debt, inheritance, poverty, deprivation, benefit-access, social-protection, distribution, shock-response, mobility, shared-prosperity, and long-horizon economic-security contracts. No classification, eligibility, denial, valuation, finding, allocation, remedy, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
