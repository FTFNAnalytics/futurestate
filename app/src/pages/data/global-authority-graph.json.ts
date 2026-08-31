import type { APIRoute } from "astro";
import graph from "../../data/phase-117-global-authority-graph.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: graph.schema_version,
  dataset: "global_authority_graph",
  generated_date: graph.effective_date,
  count: graph.counts.authority_rails,
  graph,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
