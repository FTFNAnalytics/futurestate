import registry from "../../data/phase-72-outcome-evidence-counterfactual-design-registry.json";

export function GET() {
  const records = [
    ...registry.outcome_evidence_packets,
    ...registry.alternative_explanation_registers,
    ...registry.counterfactual_design_dockets
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "outcome_evidence_counterfactual_designs",
    generated_date: registry.as_of_date,
    record_scope: "Published empty outcome-evidence packets, alternative-explanation registers, and inactive counterfactual-design dockets. No claim, assessment, design, result, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
