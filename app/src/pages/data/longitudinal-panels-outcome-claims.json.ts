import registry from "../../data/phase-71-longitudinal-panel-outcome-comparison-registry.json";

export function GET() {
  const records = [
    ...registry.longitudinal_panel_shells,
    ...registry.outcome_claim_dockets,
    ...registry.comparison_embargo_registers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "longitudinal_panels_outcome_claims",
    generated_date: registry.as_of_date,
    record_scope: "Published longitudinal panel shells, outcome-claim dockets, and comparison embargo registers. Empty workflow state is explicit; no values, trends, claims, scores, or rankings are inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
