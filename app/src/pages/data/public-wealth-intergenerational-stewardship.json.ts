import registry from "../../data/phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry.json";

export function GET() {
  const records = [
    ...registry.public_asset_obligation_registers,
    ...registry.lifecycle_cost_maintenance_ledgers,
    ...registry.procurement_dependency_contingent_risk_registers,
    ...registry.intergenerational_balance_sheet_stewardship_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "public_wealth_long_horizon_stewardship_intergenerational_balance_sheet",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive public-asset, obligation, lifecycle-cost, maintenance, procurement, vendor-dependency, debt, guarantee, contingent-liability, insurance, reserve, distribution, future-user, fiscal-stress, restructuring, restoration, and intergenerational-audit contracts. No valuation, liability, fund, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
