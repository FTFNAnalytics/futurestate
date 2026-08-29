import registry from "../../data/phase-82-household-capability-care-infrastructure-everyday-security-registry.json";

export function GET() {
  const records = [
    ...registry.household_capability_service_bundle_dossiers,
    ...registry.care_infrastructure_workforce_capacity_ledgers,
    ...registry.household_affordability_time_debt_administrative_burden_registers,
    ...registry.neighborhood_access_displacement_crisis_recovery_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "household_capability_care_infrastructure_everyday_security",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive household-capability, service-bundle, care-infrastructure, workforce-capacity, household-burden, benefit-access, neighborhood-access, displacement, crisis-stabilization, and recovery contracts. No household classification, floor, allocation, finding, intervention, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
