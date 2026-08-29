import registry from "../../data/phase-74-evidence-synthesis-challenge-decision-translation-registry.json";

export function GET() {
  const records = [
    ...registry.result_synthesis_input_dockets,
    ...registry.synthesis_contradiction_dossiers,
    ...registry.external_challenge_response_dockets,
    ...registry.decision_translation_reevaluation_registers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "evidence_synthesis_challenge_decision_translation",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive result-input, synthesis-contradiction, external-challenge, decision-translation, and reevaluation contracts. No result, synthesis, evidence grade, recommendation, authorization, score, or ranking is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
