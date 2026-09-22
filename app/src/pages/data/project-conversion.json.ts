import type { APIRoute } from "astro";
import registry from "../../data/phase-61-project-conversion-registry.json";
import {projectChecksFor} from '../../lib/current-project-checks.mjs';
import {evidenceReceiptsForRecord, currentNamedFileAccount, projectNamedFile} from '../../lib/current-evidence.mjs';
import { publicDatasetResponse } from "../../lib/public-data";

export const GET: APIRoute = async () => {
  const records = registry.records.map((record) => ({
    file_id: record.file_id,
    dated_project_checks: projectChecksFor(record.file_id),
    dated_review_receipts: evidenceReceiptsForRecord(record.file_id),
    current_site_authority_account: currentNamedFileAccount(record.file_id),
    historical_current_stage: record.current_stage,
    kind: record.kind,
    title: record.title,
    named_entity: record.named_entity,
    current_stage: projectNamedFile(record).current_stage,
    established: currentNamedFileAccount(record.file_id)?.established ?? record.established,
    unresolved: currentNamedFileAccount(record.file_id)?.unresolved ?? record.unresolved,
    exact_next_artifact: projectNamedFile(record).exact_next_artifact,
    historical_next_check_date: record.next_check_date,
    next_check_date: projectNamedFile(record).next_check_date,
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
