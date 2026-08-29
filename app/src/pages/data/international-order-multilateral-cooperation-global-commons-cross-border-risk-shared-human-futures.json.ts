import registry from "../../data/phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures-registry.json";

export function GET() {
  const records = [
    ...registry.international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers,
    ...registry.multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers,
    ...registry.migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers,
    ...registry.global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "international_order_multilateral_cooperation_global_commons_cross_border_risk_shared_human_futures",
    generated_date: registry.effective_date,
    record_scope: "Published inactive international-order, multilateral-delivery, humanitarian-protection, global-commons, cross-border-risk, and shared-futures contracts. No treaty, representation, delivery, protection, stewardship, risk-reduction, secured-future, or public-value decision is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
