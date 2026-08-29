import registry from "../../data/phase-87-education-learning-skills-knowledge-cultural-capability-registry.json";

export function GET() {
  const records = [
    ...registry.early_childhood_school_access_inclusion_learning_dossiers,
    ...registry.postsecondary_vocational_apprenticeship_affordability_ledgers,
    ...registry.learning_capability_credential_skills_transition_registers,
    ...registry.public_knowledge_culture_research_community_learning_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "education_learning_skills_knowledge_cultural_capability",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive education-access, inclusion, postsecondary, vocational, apprenticeship, affordability, learning, assessment, credential, capability, work-transition, public-knowledge, information-literacy, culture, recovery, and human-development contracts. No enrollment, admission, credential, classification, finding, remedy, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
