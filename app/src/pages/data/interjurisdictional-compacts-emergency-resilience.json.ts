import registry from "../../data/phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json";

export function GET() {
  const records = [
    ...registry.interjurisdictional_authority_externality_maps,
    ...registry.shared_public_value_contribution_compacts,
    ...registry.mutual_aid_continuity_dispute_registers,
    ...registry.emergency_authority_normalization_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "interjurisdictional_compacts_shared_public_value_emergency_resilience",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive authority, externality, public-value, contribution, compact, mutual-aid, continuity, dispute, emergency, civil-safeguard, restoration, and democratic-reauthorization contracts. No authority, compact, emergency, rights restriction, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
