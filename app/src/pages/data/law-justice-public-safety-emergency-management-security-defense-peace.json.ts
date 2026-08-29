import registry from "../../data/phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json";

export function GET() {
  const records = [
    ...registry.rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers,
    ...registry.public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers,
    ...registry.emergency_management_civil_protection_critical_system_security_resilience_registers,
    ...registry.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "law_justice_public_safety_emergency_management_security_defense_peace",
    generated_date: registry.effective_date,
    record_scope: "Published inactive justice-access, public-safety accountability, emergency-resilience, security, defense, civilian-protection, and peace-stewardship contracts. No access, safety, preparedness, security, defense, civilian-protection, durable-peace, or public-value decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
