import type { APIRoute } from "astro";
import program from "../../data/phase-116-coverage-architecture.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: program.schema_version,
  dataset: "phase_116_coverage_architecture",
  generated_date: program.effective_date,
  count: program.counts.canonical_entities,
  program,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
