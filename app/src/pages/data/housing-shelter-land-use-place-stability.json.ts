import registry from "../../data/phase-85-housing-shelter-land-use-place-stability-registry.json";

export function GET() {
  const records = [
    ...registry.housing_need_supply_delivery_habitability_dossiers,
    ...registry.tenure_affordability_public_social_community_housing_ledgers,
    ...registry.homelessness_shelter_supportive_housing_displacement_registers,
    ...registry.retrofit_climate_disaster_reconstruction_place_stability_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "housing_shelter_land_use_place_stability",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive housing-need, supply, delivery, habitability, tenure, affordability, public and community housing, homelessness, shelter, supportive-housing, displacement, retrofit, climate, disaster, relocation, reconstruction, right-to-return, and place-stability contracts. No approval, allocation, placement, finding, remedy, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
