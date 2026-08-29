import registry from "../../data/phase-93-economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation-registry.json";

export function GET() {
  const records = [
    ...registry.economic_development_mission_sector_strategy_production_ecosystem_dossiers,
    ...registry.innovation_research_diffusion_commercialization_standards_ledgers,
    ...registry.regional_cluster_corridor_supplier_workforce_convergence_registers,
    ...registry.productive_transformation_diversification_decarbonization_shared_prosperity_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "economic_development_industrial_strategy_innovation_systems_regional_convergence_productive_transformation",
    generated_date: registry.effective_date,
    record_scope: "Published inactive mission, sector-strategy, production-ecosystem, innovation, diffusion, commercialization, standards, cluster, corridor, supplier, workforce, regional-convergence, diversification, decarbonization, resilience, shared-prosperity, and productive-transformation contracts. No mission, firm, subsidy, procurement, readiness, adoption, place, convergence, transition, or public-value decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
