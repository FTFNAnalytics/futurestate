import registry from "../../data/phase-83-community-institutions-social-infrastructure-collective-resilience-registry.json";

export function GET() {
  const records = [
    ...registry.community_institution_access_trust_continuity_dossiers,
    ...registry.civic_association_cooperative_mutual_aid_capacity_ledgers,
    ...registry.local_information_media_public_knowledge_integrity_registers,
    ...registry.collective_preparedness_trauma_recovery_resilience_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "community_institutions_social_infrastructure_collective_resilience",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive community-institution, civic-network, cooperative, mutual-aid, volunteer, local-information, public-knowledge, preparedness, collective-trauma, closure, restoration, and resilience contracts. No institution, network, information, activation, closure, restoration, recovery, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
