import registry from "../../data/phase-75-decision-accountability-realized-impact-registry.json";

export function GET() {
  const records = [
    ...registry.decision_accountability_dossiers,
    ...registry.implementation_commitment_realization_ledgers,
    ...registry.post_decision_audit_remediation_registers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "decision_accountability_realized_impact",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive decision-accountability, implementation-commitment, realized-impact, audit, sunset, reversal, and remediation contracts. No authorization, implementation, benefit, harm, remedy, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
