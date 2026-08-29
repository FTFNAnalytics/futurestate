import type { APIRoute } from "astro";
import registry from "../../data/phase-70-observation-review-series-admission-registry.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => publicDatasetResponse(
  "observation_review_series_admission",
  "Thirty-two empty observation-review dockets, thirty-two empty revision-lineage registers, and eight not-ready series-admission dockets with zero real submissions, reviews, receipts, observations, or series.",
  [
    ...registry.observation_review_dockets,
    ...registry.observation_revision_lineage_registers,
    ...registry.series_admission_dockets
  ]
);
