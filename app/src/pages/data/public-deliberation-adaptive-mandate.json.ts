import registry from "../../data/phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json";

export function GET() {
  const records = [
    ...registry.stakeholder_standing_notice_registers,
    ...registry.deliberation_issue_response_dockets,
    ...registry.mandate_legitimacy_appeal_registers,
    ...registry.adaptive_mandate_review_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "public_deliberation_participatory_governance_adaptive_mandate",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive standing, notice, accessibility, participation, issue-response, legitimacy, appeal, public-mandate, monitoring, reopening, and adaptive-review contracts. No participation, consent, legitimacy, authorization, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
