import type { APIRoute } from "astro";
import calendar from "../../data/phase-63-conversion-gate-calendar.json";
import {evidenceReceiptsForConversionGate, namedFileEvidenceDecisions, currentNamedFileAccount} from '../../lib/current-evidence.mjs';
import { publicDatasetResponse } from "../../lib/public-data";
import {projectChecksFor,latestProjectCheckFor} from '../../lib/current-project-checks.mjs';

export const GET: APIRoute = async () => publicDatasetResponse(
  "conversion_gates",
  "Eight next-evidence gates joining each named conversion file to its latest event, exact date or source trigger, same-entity cycle binding, artifact, stop rule, receipt state, and reader surfaces.",
  calendar.gate_records.map(record=>({...record,
    historical_current_stage:record.current_stage, historical_next_check_date:record.next_check_date,
    current_stage:currentNamedFileAccount(record.file_id)?.current_stage ?? record.current_stage,
    next_check_date:latestProjectCheckFor(record.file_id)?.next_check_date ?? namedFileEvidenceDecisions(record.file_id).at(-1)?.next_check_date ?? record.next_check_date,
    dated_project_checks:projectChecksFor(record.file_id),
    dated_review_receipts:evidenceReceiptsForConversionGate(record),
    current_site_authority_account:currentNamedFileAccount(record.file_id)}))
);
