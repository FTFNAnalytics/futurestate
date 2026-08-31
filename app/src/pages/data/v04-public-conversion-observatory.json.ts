import type { APIRoute } from "astro";
import program from "../../data/v04-public-conversion-observatory.json";

export const GET: APIRoute = () => new Response(JSON.stringify(program, null, 2), {
  headers: { "Content-Type": "application/json; charset=utf-8" },
});
