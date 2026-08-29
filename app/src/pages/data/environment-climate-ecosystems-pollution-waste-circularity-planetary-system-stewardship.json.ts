import registry from "../../data/phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-registry.json";

export function GET() {
  const records = [
    ...registry.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers,
    ...registry.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers,
    ...registry.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers,
    ...registry.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "environment_climate_ecosystems_pollution_waste_circularity_planetary_system_stewardship",
    generated_date: registry.effective_date,
    record_scope: "Published inactive climate-mitigation, pollution-exposure, ecosystem-restoration, circularity, adaptation, disaster-risk, and planetary-stewardship contracts. No decarbonization, healthy-exposure, recovery, circularity, vulnerability, or public-value decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
