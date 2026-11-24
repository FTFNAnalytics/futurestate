import type { APIRoute } from "astro";
import matrix from "../../data/phase-64-conversion-stage-matrix.json";
import {evidenceReceiptsForRecord, currentNamedFileAccount} from '../../lib/current-evidence.mjs';
import { publicDatasetResponse } from "../../lib/public-data";
import {projectChecksFor} from '../../lib/current-project-checks.mjs';

export const GET: APIRoute = async () => {
  const records = matrix.file_rows.flatMap((row) => row.stage_cells.map((cell) => ({
    file_id: row.file_id,
    dated_project_checks: projectChecksFor(row.file_id),
    dated_review_receipts: evidenceReceiptsForRecord(row.file_id),
    current_site_authority_account: currentNamedFileAccount(row.file_id),
    cell_history_boundary: 'Stage cells are retained historical qualification decisions; dated site-authority context does not automatically admit a cell.',
    kind: row.kind,
    named_entity: row.named_entity,
    gate_id: row.gate_id,
    current_boundary: row.current_boundary,
    next_decisive_stage_id: row.next_decisive_stage_id,
    stage_id: cell.stage_id,
    cell_state: cell.cell_state,
    evidence_event_ids: cell.evidence_event_ids,
    basis: cell.basis
  })));

  return publicDatasetResponse(
    "conversion_stage_matrix",
    "Sixty-four bounded cells asking eight common evidence-stage questions of eight named project and adoption files without ranking them or treating unlike stages as equivalent.",
    records
  );
};
