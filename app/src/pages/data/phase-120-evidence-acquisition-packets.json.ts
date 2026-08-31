import type { APIRoute } from "astro";
import fieldbook from "../../data/phase-120-evidence-acquisition-packets.json";

export const GET: APIRoute = () => new Response(JSON.stringify({
  schema_version: fieldbook.schema_version,
  dataset: "phase_120_evidence_acquisition_packets",
  generated_date: fieldbook.effective_date,
  count: fieldbook.counts.acquisition_packets,
  target_count: fieldbook.counts.artifact_targets,
  fieldbook,
}, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8" } });
