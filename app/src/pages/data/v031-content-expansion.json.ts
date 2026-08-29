import type { APIRoute } from "astro";
import program from "../../data/v031-content-expansion.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: "1.0",
  dataset: "v031_content_expansion",
  generated_date: program.effective_date,
  count: program.counts.public_routes,
  program,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
