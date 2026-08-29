import type { APIRoute } from "astro";
import registry from "../../data/phase-69-measurement-observation-break-registry.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => publicDatasetResponse(
  "measurement_specifications",
  "Thirty-two measurement specifications, thirty-two empty observation-intake envelopes, and eight prospective series-break registers with zero real observations or values.",
  [
    ...registry.measurement_specifications,
    ...registry.observation_intake_envelopes,
    ...registry.series_break_registers
  ]
);
