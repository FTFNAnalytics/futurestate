import registry from "../../data/phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json";

export function GET() {
  const records = [
    ...registry.passenger_mobility_demand_accessibility_affordability_inclusion_dossiers,
    ...registry.multimodal_transportation_service_planning_operations_safety_reliability_ledgers,
    ...registry.freight_goods_movement_intermodal_logistics_delivery_resilience_registers,
    ...registry.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "mobility_transportation_freight_communications_digital_networks_territorial_access",
    generated_date: registry.effective_date,
    record_scope: "Published inactive mobility-demand, transportation-service, freight-delivery, communications, digital-public-infrastructure, interoperability, and territorial-access contracts. No trip, safety, delivery, connectivity, restoration, recovery, or public-value decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
