import type { APIRoute } from "astro";
import desk from "../../data/phase-60c-editorial-desk.json";
import { projectEvidenceRecord, currentEvidenceAsOfDate } from '../../lib/current-evidence.mjs';
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => publicDatasetResponse(
  "phase_60c_editorial_desk",
  "Six Wave 60C gates and two separate named-file rechecks. Top-level fields preserve the September 1 baseline; current_state exposes later dated gate decisions. Companion rechecks do not inherit a gate decision.",
  desk.records.map(record => ({...record, snapshot_as_of:'2026-09-01', current_state_as_of:currentEvidenceAsOfDate, current_state:projectEvidenceRecord(record)}))
);
