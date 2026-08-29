import registry from "../../data/phase-80-public-investment-portfolios-transition-pathways-place-based-capacity-registry.json";

export function GET() {
  const records = [
    ...registry.public_investment_mission_thesis_dossiers,
    ...registry.portfolio_membership_dependency_sequence_registers,
    ...registry.place_based_delivery_capacity_transition_ledgers,
    ...registry.portfolio_stress_rebalancing_realization_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "public_investment_portfolios_transition_pathways_place_based_capacity",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive mission-thesis, portfolio-membership, dependency, sequence, funding, financing, delivery-capacity, workforce, supplier, resource, place-based, just-transition, stress, rebalancing, and public-value realization contracts. No selection, priority, allocation, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
