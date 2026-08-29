import registry from "../../data/phase-88-work-labor-livelihoods-economic-democracy-registry.json";

export function GET() {
  const records = [
    ...registry.job_access_matching_hiring_nondiscrimination_dossiers,
    ...registry.job_quality_wages_benefits_hours_safety_ledgers,
    ...registry.worker_voice_organizing_collective_bargaining_economic_democracy_registers,
    ...registry.livelihood_security_displacement_just_transition_long_horizon_ledgers
  ];
  return new Response(JSON.stringify({
    schema_version: registry.schema_version,
    dataset: "work_labor_livelihoods_economic_democracy",
    generated_date: registry.as_of_date,
    record_scope: "Published inactive job-access, matching, hiring, nondiscrimination, job-quality, wages, benefits, hours, safety, dignity, worker-voice, organizing, collective-bargaining, ownership, livelihood-security, displacement, just-transition, and economic-agency contracts. No job, hiring, classification, finding, allocation, remedy, or outcome is inferred.",
    count: records.length,
    records
  }, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
