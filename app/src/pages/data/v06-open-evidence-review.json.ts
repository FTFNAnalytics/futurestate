import type { APIRoute } from "astro";
import registry from "../../data/v06-open-evidence-review.json";

export const GET: APIRoute = () => new Response(JSON.stringify(registry, null, 2), {
  headers: { "Content-Type": "application/json; charset=utf-8" },
});
