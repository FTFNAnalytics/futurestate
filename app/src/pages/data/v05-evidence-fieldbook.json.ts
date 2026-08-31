import type { APIRoute } from "astro";
import fieldbook from "../../data/v05-evidence-fieldbook.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: fieldbook.schema_version,
  dataset: fieldbook.dataset,
  version: fieldbook.version,
  generated_date: fieldbook.effective_date,
  substantive_surface_count: fieldbook.counts.substantive_surfaces,
  new_route_count: fieldbook.counts.new_html_routes,
  enhanced_route_count: fieldbook.counts.enhanced_existing_routes,
  fieldbook,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
