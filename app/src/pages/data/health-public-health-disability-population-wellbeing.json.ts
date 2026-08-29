import registry from "../../data/phase-86-health-public-health-disability-population-wellbeing-registry.json";

export function GET() {
  const records = [
    ...registry.primary_preventive_community_care_access_dossiers,
    ...registry.acute_emergency_specialty_behavioral_health_care_ledgers,
    ...registry.public_health_surveillance_prevention_environmental_exposure_registers,
    ...registry.disability_equity_preparedness_population_wellbeing_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "health_public_health_disability_population_wellbeing",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive health-access, preventive, clinical-care, public-health, surveillance, exposure, disability-rights, preparedness, recovery, equity, and population-wellbeing contracts. No eligibility, diagnosis, triage, restriction, classification, finding, remedy, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
