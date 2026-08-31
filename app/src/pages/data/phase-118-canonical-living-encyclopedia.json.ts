import encyclopedia from "../../data/phase-118-canonical-living-encyclopedia.json";

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(encyclopedia, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
