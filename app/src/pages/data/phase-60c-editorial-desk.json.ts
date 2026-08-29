import type { APIRoute } from "astro";
import desk from "../../data/phase-60c-editorial-desk.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => publicDatasetResponse(
  "phase_60c_editorial_desk",
  "Six Wave 60C Evidence Cycle gates and two independent named-file companion rechecks with exact artifacts, admissibility thresholds, hold rules, propagation assignments, and no precreated future decisions.",
  desk.records
);
