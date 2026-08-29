import type { APIRoute } from "astro";
import registry from "../../data/phase-61-project-conversion-registry.json";
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const records = registry.records.map((record) => ({
    file_id: record.file_id,
    kind: record.kind,
    title: record.title,
    named_entity: record.named_entity,
    current_stage: record.current_stage,
    established: record.established,
    unresolved: record.unresolved,
    exact_next_artifact: record.exact_next_artifact,
    next_check_date: record.next_check_date,
    reopening_trigger: record.reopening_trigger,
    stop_rule: record.stop_rule,
    source_ids: record.source_ids,
    signal_ids: record.signal_ids,
    evidence_gap_ids: record.evidence_gap_ids,
    local_system_ids: record.local_system_ids,
    canonical_briefing_id: record.canonical_briefing_id,
    reader_pathway_ids: record.reader_pathway_ids,
    dependency_map_ids: record.dependency_map_ids
  }));

  return publicDatasetResponse(
    "project_conversion",
    "Eight named project and adoption files with current stage, exact downstream artifact, date or reopening trigger, stop rule, and assigned reader surfaces.",
    records
  );
};
