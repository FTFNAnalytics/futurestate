import type { APIRoute } from "astro";
import registry from "../../data/phase-129-cross-system-evidence-syntheses.json";

export const GET: APIRoute = () => new Response(JSON.stringify(registry, null, 2), {
  headers: { "Content-Type": "application/json; charset=utf-8" },
});
