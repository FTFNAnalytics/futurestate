import registry from "../../data/phase-73-analysis-execution-result-adjudication-registry.json";

export function GET() {
  const records = [
    ...registry.analysis_execution_dockets,
    ...registry.protocol_deviation_registers,
    ...registry.result_adjudication_dockets,
    ...registry.correction_withdrawal_registers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "analysis_execution_result_adjudication",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive analysis-execution and result-adjudication dockets plus empty deviation and correction-withdrawal registers. No execution, result, claim, correction, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
