import type { APIRoute } from "astro";
import program from "../../data/phase-121-priority-research-missions.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: program.schema_version,
  dataset: "phase_121_priority_research_missions",
  generated_date: program.effective_date,
  count: program.counts.missions,
  program,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
