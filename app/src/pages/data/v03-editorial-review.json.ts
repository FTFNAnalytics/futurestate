import type { APIRoute } from "astro";
import program from "../../data/v03-editorial-program.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: "1.0",
  dataset: "v03_editorial_review",
  generated_date: program.effective_date,
  count: program.counts.public_routes,
  program,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
