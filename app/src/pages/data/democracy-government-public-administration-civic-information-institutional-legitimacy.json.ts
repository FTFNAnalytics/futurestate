import registry from "../../data/phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-registry.json";

export function GET() {
  const records = [
    ...registry.elections_representation_participation_inclusion_democratic_integrity_dossiers,
    ...registry.constitutional_legislative_executive_public_administration_capability_ledgers,
    ...registry.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers,
    ...registry.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "democracy_government_public_administration_civic_information_institutional_legitimacy",
    generated_date: registry.effective_date,
    record_scope: "Published inactive democracy, government-capability, public-accountability, civic-information, institutional-legitimacy, and democratic-resilience contracts. No representation, capacity, delivery, transparency, legitimacy, resilience, or public-value decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
