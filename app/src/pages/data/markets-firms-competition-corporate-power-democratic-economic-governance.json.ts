import registry from "../../data/phase-90-markets-firms-competition-corporate-power-democratic-economic-governance-registry.json";

export function GET() {
  const records = [
    ...registry.firm_formation_ownership_control_governance_dossiers,
    ...registry.market_structure_competition_pricing_conduct_ledgers,
    ...registry.corporate_power_platform_supply_chain_public_support_registers,
    ...registry.democratic_economic_governance_rights_remedy_long_horizon_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "markets_firms_competition_corporate_power_democratic_economic_governance",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive firm identity, ownership, control, corporate governance, market structure, competition, pricing, conduct, platform, supply-chain, financialization, public-support, rights, remedy, public-value, resilience, and democratic-economic-governance contracts. No classification, market definition, power finding, abuse finding, merger decision, subsidy allocation, remedy, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
