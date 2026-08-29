import registry from "../../data/phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination-registry.json";

export function GET() {
  const records = [
    ...registry.public_revenue_tax_expenditure_distribution_compliance_dossiers,
    ...registry.budget_expenditure_stabilizer_delivery_public_value_ledgers,
    ...registry.sovereign_debt_fiscal_rule_public_balance_sheet_resilience_registers,
    ...registry.trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "fiscal_policy_public_revenue_sovereign_debt_trade_external_balance_macroeconomic_coordination",
    generated_date: registry.effective_date,
    record_scope: "Published inactive public-revenue, tax-expenditure, distribution, compliance, budget, expenditure-delivery, stabilizer, public-value, sovereign-debt, fiscal-rule, public-balance-sheet, trade, external-balance, supply-resilience, macroeconomic-coordination, and long-horizon contracts. No tax, allocation, procurement, delivery, sustainability, restructuring, customs, trade, treaty, sanction, resilience, or macroeconomic decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
