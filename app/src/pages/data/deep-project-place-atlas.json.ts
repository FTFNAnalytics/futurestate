import type { APIRoute } from "astro";
import registry from "../../data/phase-119-deep-project-place-atlas.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: "1.0",
  dataset: "deep_project_place_atlas",
  generated_date: registry.effective_date,
  counts: registry.counts,
  registry,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
