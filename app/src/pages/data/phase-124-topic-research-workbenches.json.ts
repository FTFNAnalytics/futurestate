import type { APIRoute } from "astro";
import registry from "../../data/phase-124-topic-research-workbenches.json";

export const GET: APIRoute = () => new Response(JSON.stringify(registry, null, 2), {
  headers: { "Content-Type": "application/json; charset=utf-8" },
});
