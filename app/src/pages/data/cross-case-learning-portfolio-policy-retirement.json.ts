import registry from "../../data/phase-76-cross-case-learning-portfolio-policy-retirement-registry.json";

export function GET() {
  const records = [
    ...registry.institutional_learning_dossiers,
    ...registry.cross_case_transfer_registers,
    ...registry.portfolio_governance_registers,
    ...registry.policy_supersession_retirement_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "cross_case_learning_portfolio_policy_retirement",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive institutional-learning, pairwise transfer, portfolio-governance, policy-supersession, retirement, decommissioning, and archive contracts. No lesson, comparison, reuse decision, portfolio finding, retirement, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
