// Actual September 24 administrative-source review; never run by current:generate.
export const evidenceReviewDate='2026-09-24';
export const priorLedgerAsOf='2026-09-22';
export const priorLedgerSha256='77ccf23adda98078c9129fa743018b576e554cf4716842d5e5f0c5280d3ebbe9';
export function priorLedgerSnapshot(ledger){return JSON.stringify({...ledger,as_of_date:priorLedgerAsOf,receipts:ledger.receipts.filter(r=>r.decision_date<=priorLedgerAsOf)},null,2)+'\n';}
const check=(url,source_date,access_result,finding,limitation,locator)=>({url,source_date,access_result,finding,limitation,locator,accessed_date:evidenceReviewDate});
export const nnsaReview={
  receipt_id:'receipt-60-nnsa-capacity-2026-09-24-no-material-change',
  cycle_item_id:'60-CYCLE-NNSA-ACCEPTED-CAPACITY',origin_record_id:'58-QUEUE-NNSA-ACCEPTED-CAPACITY',desk_item_id:null,envelope_id:'67-RETURN-010',
  scheduled_check_date:evidenceReviewDate,source_checked_date:evidenceReviewDate,decision_date:evidenceReviewDate,
  receipt_type:'No Material Change',decision_status:'no_material_change',counts_as_cycle_decision:true,
  signal_decision:'retain_in_review_no_material_change',underlying_signal_id:'signal-57y-preserved-nnsa-accepted-capacity',underlying_signal_status:'In Review',
  checked_source_ids:['source-57b-nnsa-pit-production-draft-peis-2026','source-57f-nnsa-pit-production-current'],
  bounded_finding:'The September 24 review retrieved the April 2026 draft environmental assessment and a dated NNSA announcement of a first qualified unit, but not the exact final accepted operating-capacity artifact required by this gate. The undated program overview still uses older capability wording; it must not override the dated unit announcement. The accepted-capacity signal remains In Review, without capacity or recurring-output admission.',
  evidence_boundary:'This is a bounded public administrative-record review, not a finding that an acceptance record or capability does not exist. A draft environmental review, a planned final environmental decision and a first-unit qualification are different evidence objects. The October 2, 2024 announcement reports an October 1 event; neither date is a September 2026 event. No technical production methods were assessed or extracted. PDF cover-sheet and poster text were inspected, but image rendering was unavailable; visual or signature verification is not claimed. No login, records request, external contact, independent approval or publication occurred. The NNSA GAO-baseline and recurring-qualified-rate gates remain separate.',
  exact_next_artifact:'A final accepted operating-capacity artifact linked to operating configuration, acceptance criteria, and observed qualified output.',
  next_check_date:'2026-10-09',
  next_action:'At the existing October 9 cycle audit, recheck the exact public acceptance record and its authority, scope and date, or reopen earlier for a newly discovered exact official artifact. Keep the first-unit announcement, environmental-review timetable, GAO-baseline decision and recurring-rate decision distinct. The October 9 date is a bounded review appointment, not a forecast of artifact availability.',
  watch_note:{receipt_type:'Watch Note',dated:evidenceReviewDate,prior_scheduled_date:evidenceReviewDate,next_check_date:'2026-10-09',reason:'No exact accepted-capacity artifact retrieved in the bounded review. Preserve the authority and artifact target and revisit at the existing final cycle audit; do not infer an agency delivery date.'},
  canonical_dossier_ids:['briefing-adoption-004-advanced-manufacturing','briefing-outcomes-watch-001-what-actually-changed','briefing-evidence-cycle-001-operating-baseline','briefing-evidence-return-control-room-001'],
  reader_pathway_ids:['reader-pathway-advanced-manufacturing-research-to-production'],
  dependency_map_ids:['dependency-map-technology-adoption-is-not-operating-outcome','dependency-map-artifact-return-to-reader-state'],
  local_system_ids:[],named_file_ids:[],qualification_packet_ids:[],evidence_gap_ids:['gap-016'],
  binding_decision:'No Phase 61 named file covers the NNSA accepted-capacity object. No named-file stage, qualification packet or measured series is created or advanced.',
  gate_route:'/review/evidence-cycle/nnsa-accepted-capacity/',
  official_surface_checks:[
    check('https://www.energy.gov/nepa/doeeis-0573-plutonium-pit-production-multiple-locations',null,'Official project-index HTML inspected.','The inspected index describes a programmatic environmental review and lists draft/hearing material.','An index is not a comprehensive absence search or a formal operating acceptance record.','Project description and listed documents'),
    check('https://www.energy.gov/nepa/articles/doeeis-0573-draft-environmental-impact-statement-april-2026','2026-04-10','Official draft-publication HTML inspected.','DOE identifies the document as a draft and the public comment deadline as July 16, 2026.','A comment deadline does not establish final agency action or accepted operating capacity.','Dated publication heading and draft-document links'),
    check('https://www.energy.gov/sites/default/files/2026-04/draft-eis-0573-plutonium-pit-production-vol-1-2026-04.pdf','2026-04','Cover and full cover-sheet text inspected; image request failed.','The cover identifies DOE/EIS-0573 Volume 1 as Draft, April 2026; the abstract describes environmental assessment of proposed activity.','Read-only status review of PDF pages 1–2, not all 259 pages. No visual verification or technical-process extraction.','PDF pages 1–2: cover and cover sheet'),
    check('https://www.energy.gov/documents/doeeis-0573-public-hearing-timeline-poster-may-2026','2026-05','Single-page poster text retrieved; screenshot cache miss and local download unavailable.','The hearing poster describes a draft-review period and a future final-PEIS/decision timetable.','Timeline alignment was not visually verified, so no exact forecast date is adopted. Environmental decision timing is not operating acceptance.','One-page public-hearing timeline poster'),
    check('https://www.energy.gov/nnsa/plutonium-pit-production',null,'Official program-overview HTML inspected.','The undated overview still describes capability using research-and-development-only wording.','Do not present that undated wording as a current finding: the dated October 2024 NNSA release documents a first qualified unit. Neither source supplies this gate\'s final accepted-capacity artifact.','Current and future needs section; read with the dated announcement'),
    check('https://www.energy.gov/nnsa/articles/nnsa-completes-and-diamond-stamps-first-plutonium-pit-w87-1-warhead','2024-10-02','Official dated announcement inspected.','NNSA reports verifying a first qualified unit on October 1, 2024 and separately describes continuing work toward target capacity.','A unit-level qualification announcement is not a final accepted operating-capacity instrument or recurring-rate series. The reported event predates this September 24 retrieval.','Opening, qualification and continuing-capacity paragraphs'),
  ],
  bounded_searches:[
    {query:'site:energy.gov/nnsa "2026" "pit" "accepted" "capacity"',result:'Environmental/planning and unrelated records returned; no exact accepted operating-capacity instrument retrieved.'},
    {query:'site:lanl.gov "2026" "pit" "acceptance"',result:'No exact qualifying artifact retrieved in this bounded indexed search; not proof of nonexistence.'},
    {query:'site:energy.gov/nnsa "first plutonium pit" "2024"',result:'Retrieved the dated NNSA first-unit announcement; retained as distinct evidence, not capacity acceptance.'},
    {query:'site:lanl.gov "2026" "pit production" milestone',result:'Older publications with forward-looking dates surfaced; indexing/upload dates are not a current operating acceptance.'},
  ],
  update_id:'update-2026-09-24-phase-60-nnsa-capacity-decision',
};
