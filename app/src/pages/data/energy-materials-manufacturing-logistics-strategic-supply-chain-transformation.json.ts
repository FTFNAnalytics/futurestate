import registry from "../../data/phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation-registry.json";

export function GET() {
  const records = [
    ...registry.energy_water_industrial_utility_reliability_dossiers,
    ...registry.minerals_materials_processing_circularity_qualification_ledgers,
    ...registry.manufacturing_equipment_automation_maintenance_quality_accepted_production_registers,
    ...registry.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "energy_materials_manufacturing_logistics_strategic_supply_chain_transformation",
    generated_date: registry.effective_date,
    record_scope: "Published inactive industrial-utility, material-qualification, manufacturing, accepted-production, logistics, inventory, reserve, emergency-conversion, strategic-supply-chain, technology-sovereignty, and just-industrial-transition contracts. No allocation, reliability, qualification, production, acceptance, access, resilience, sovereignty, or transition decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
