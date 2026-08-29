import registry from "../../data/phase-91-finance-banking-credit-capital-allocation-monetary-systems-financial-stability-registry.json";

export function GET() {
  const records = [
    ...registry.money_payments_banking_access_settlement_dossiers,
    ...registry.credit_underwriting_affordability_servicing_productive_allocation_ledgers,
    ...registry.capital_markets_institutional_investment_insurance_risk_transfer_registers,
    ...registry.monetary_policy_systemic_risk_resolution_public_guarantee_democratic_finance_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "finance_banking_credit_capital_allocation_monetary_systems_financial_stability",
    generated_date: registry.effective_date,
    record_scope: "Published inactive money, payment, banking-access, custody, settlement, credit, underwriting, affordability, servicing, productive-allocation, capital-market, institutional-investment, insurance, risk-transfer, monetary-policy, systemic-risk, public-guarantee, resolution, democratic-finance, and long-horizon contracts. No admission, eligibility, allocation, valuation, investment, claim, intervention, guarantee, resolution, loss allocation, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
