import registry from "../../data/phase-81-universal-service-essential-systems-public-option-delivery-registry.json";

export function GET() {
  const records = [
    ...registry.service_floor_universal_access_dossiers,
    ...registry.affordability_cross_subsidy_coverage_ledgers,
    ...registry.provider_plurality_interoperability_continuity_registers,
    ...registry.rights_quality_step_in_restoration_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "universal_service_essential_systems_public_option_delivery",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive essential-service floor, universal-access, affordability, cross-subsidy, coverage, provider-plurality, interoperability, continuity, user-rights, quality, step-in, rationing, restoration, and remedy contracts. No service, fiscal, provider, emergency, or outcome decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
