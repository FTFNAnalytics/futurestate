import type { APIRoute } from "astro";
import registry from "../../data/phase-68-compatible-series-outcome-cohorts.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => publicDatasetResponse(
  "compatible_series_outcome_cohorts",
  "Eight named-file cohort admission contracts with sixty-four compatibility checks, thirty-two empty candidate measure families, and zero admitted cohorts or outcome claims.",
  registry.cohort_records
);
