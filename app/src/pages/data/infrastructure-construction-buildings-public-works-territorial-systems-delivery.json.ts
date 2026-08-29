import registry from "../../data/phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-registry.json";

export function GET() {
  const records = [
    ...registry.spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers,
    ...registry.project_design_engineering_cost_estimation_permitting_procurement_ledgers,
    ...registry.construction_contractors_trades_materials_safety_inspection_registers,
    ...registry.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "infrastructure_construction_buildings_public_works_territorial_systems_delivery",
    generated_date: registry.effective_date,
    record_scope: "Published inactive territorial-readiness, project-definition, design, engineering, estimating, permitting, procurement, construction, safety, quality, inspection, commissioning, accessibility, handover, operations, maintenance, adaptation, reconstruction, community-recovery, and territorial-value contracts. No project, construction, service, recovery, or place-value decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
