import registry from "../../data/phase-84-food-systems-local-provisioning-community-resource-security-registry.json";

export function GET() {
  const records = [
    ...registry.food_production_land_water_sovereignty_dossiers,
    ...registry.processing_storage_distribution_local_provisioning_ledgers,
    ...registry.food_access_affordability_nutrition_institutional_meals_registers,
    ...registry.reserve_contamination_circularity_community_resource_security_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "food_systems_local_provisioning_community_resource_security",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive food-production, land, water, sovereignty, processing, storage, distribution, procurement, workforce, access, affordability, nutrition, institutional-meal, reserve, contamination, circular-flow, and long-horizon resource-security contracts. No allocation, finding, release, recall, remedy, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
