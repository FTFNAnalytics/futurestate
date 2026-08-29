import type { APIRoute } from "astro";
import calendar from "../../data/phase-63-conversion-gate-calendar.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => publicDatasetResponse(
  "conversion_gates",
  "Eight next-evidence gates joining each named conversion file to its latest event, exact date or source trigger, same-entity cycle binding, artifact, stop rule, receipt state, and reader surfaces.",
  calendar.gate_records
);
