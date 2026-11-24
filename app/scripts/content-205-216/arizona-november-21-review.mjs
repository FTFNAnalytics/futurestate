// Actual November 21 America/Edmonton inspections, shared by two distinct decisions.
export const evidenceReviewDate='2026-11-21';
export const priorLedgerPayloadSha256='4d99f72ea2802992bd33b1e2acc6bebd749249e081d09145a573873370993302';
export const priorLedgerSnapshot=ledger=>({...ledger,as_of_date:evidenceReviewDate,receipts:ledger.receipts.slice(0,12)});
export const sharedInspectionId='arizona-official-surfaces-2026-11-21';
const check=(url,source_date,locator,finding,limitation,access_result='Official text inspected.')=>({url,source_date,locator,finding,limitation,access_result,accessed_date:evidenceReviewDate});
export const officialChecks=[
  check('https://www.phoenix.gov/content/dam/phoenix/cityclerksite/city-council-meeting-files/2026/5-20-26%20Formal%20Agenda-FINAL.pdf','2026-05-20','Physical pages 198–199; Item 73, S-52899','Authorization covers new force/gravity lines and two lift-station improvements; increased flow is conditional on completion. The initial IRWP deadline is June 30, 2028.','Agenda authorization and an earlier 2021 contract are not execution or acceptance of these improvements. Text only; no new screenshot attempt.'),
  check('https://www.phoenix.gov/content/dam/phoenix/cityclerksite/city-council-meeting-files/2026/5-20-26%20Formal%20Results-FINAL.pdf','2026-05-20','Physical page 8; Item 73','The results record adoption of the authorization.','Not a completed-project acceptance instrument. Text only; no new screenshot attempt.'),
  check('https://www.phoenix.gov/administration/departments/pdd/site-development/civil-plan-reviews.html',null,'Water and Sewer sections','The official index links acceptance requirements and an engineer certificate template.','An index does not establish a completed TSMC acceptance.'),
  check('https://www.phoenix.gov/content/dam/phoenix/pddsite/documents/trt/external/dsd_trt_pdf_00920.pdf',null,'Physical pages 1–3; revision 04/26','Requirements include as-builts, certification and City-witnessed tests; the project fields are blank.','Month-level revision only. Guidance is not a completed TSMC acceptance checklist. Text-only inspection.'),
  check('https://www.phoenix.gov/content/dam/phoenix/pddsite/documents/trt/external/dsd_trt_pdf_00208.pdf',null,'Physical page 1; revision 01/20; body heading Water/Sewage Engineer’s Certificate of Completion','The certificate is a blank template, without identified TSMC project, permit or completed engineer fields.','Use the document body, not the mismatched PDF metadata title. The screenshot request returned a reference but no inspectable image; no visual/signature verification.'),
  check('https://www.phoenix.gov/administration/departments/waterservices/development-infrastructure.html',null,'Development and Infrastructure body; infrastructure and resource links','The page provides citywide water/sewer resources and project links.','This inspected index body is not a named-project acceptance record; its subpages were not exhaustively searched.'),
  check('https://www.tsmc.com/static/abouttsmcaz/index.htm',null,'Environmental sustainability; IRWP and report link','The overview retains a 2028 IRWP expectation and future recycling capability; its current link points to the 2025 report.','An undated overview is not commissioning evidence. Its future-metrics wording does not erase Arizona’s inclusion in the newer report.'),
  check('https://esg.tsmc.com/en-US/file/public/e-APractitionerofGreenPower_2.pdf',null,'2025 report, printed pages 106–107 and 110–111 (physical pages 2–3 and 6–7)','Arizona prose describes construction starting in 2025 and planned NLD, while a diagram uses a built-plant label. Water/discharge charts pool Arizona with other subsidiaries; global/new-fab totals are not a facility water balance.','Preserve the wording tension without inferring dated commissioning. Report year is not an exact publication day. Four screenshot requests returned references without inspectable images; text reviewed, no visual verification.'),
  check('https://www.phoenix.gov/content/dam/phoenix/financesite/documents/continuing-disclosures/WASTEWATER-SYSTEM-REVENUE-BONDS-2-1-26.pdf',null,'Physical page 7 / printed A-2; revised January 2026; FY2024–25','TSMC accounts for 1.331% of wastewater rate revenue.','Revenue share is not measured flow; citywide volume cannot be allocated with that percentage. This disclosure predates the May agreement. No issuance day inferred from filename. Screenshot returned no inspectable image.'),
  check('https://azdeq.gov/records','2026-11-12','Records Center; displayed revision November 12, 2026 10:58 am','The page explains digital-record access and that some records require a request.','No records request, contact, login or fee was submitted.'),
  check('https://megasearch.azdeq.gov/megasearch/',null,'Unsubmitted facility/address search form','The search interface and category templates were retrieved.','No facility query was submitted. Template no-records wording is not a search result or evidence of absence.'),
];
export const arizonaFollowup={
  receipt_id:'receipt-60-arizona-2026-11-21-watch-note',cycle_item_id:'60-CYCLE-ARIZONA-WASTEWATER',
  prior_receipt_id:'receipt-60-arizona-2026-09-22-no-material-change',prior_receipt_artifact_digest:'418a86de667997582b9334e117818e073e4ddaf7a276b4eb3e97d7e8166140cb',
  follow_up_scheduled_date:'2026-10-09',source_checked_date:evidenceReviewDate,decision_date:evidenceReviewDate,next_check_date:'2026-12-21',
  receipt_type:'Watch Note',decision_status:'rescheduled_with_watch_note',signal_decision:'retain_published_agreement_no_downstream_admission',shared_inspection_id:sharedInspectionId,
  bounded_finding:'Retain the Published wastewater agreement without operating admission. The newly inspected corporate report adds conflicting construction/built-plant wording and pooled metrics; Phoenix’s older disclosure adds revenue context, not named-asset flow or acceptance. Neither supplies the exact project artifact required by this gate.',
  evidence_boundary:'Actual November 21 inspection catches up the October 9 follow-up while preserving the September 22 primary decision. No completed named-project acceptance, operating-series or Arizona-only water balance was retrieved in this bounded review; this is not a claim of nonexistence. PDF text and unsuccessful image-return attempts remain distinct. No ADEQ facility query or records request was submitted. The separate November 21 Phase 55Q hold shares these inspections, not a cycle identity.',
  next_action:'On December 21, seek the exact accepted conveyance/IRWP project instrument and Arizona-only dated operating water balance or measured flow/compliance record. Resolve the corporate report’s wording with an exact commissioning artifact, not pooled metrics. Save a bounded decision if unavailable. This is an editorial appointment, not an agency publication forecast; reopen earlier only for a newly discovered exact official artifact.',
  date_roles:{original_primary_schedule:'2026-09-22',followup_appointment:'2026-10-09',actual_inspection:evidenceReviewDate,separate_phase55q_appointment:evidenceReviewDate,report_year:'2025',city_disclosure_revision_month:'2026-01',agreement_authorization:'2026-05-20',irwp_contract_deadline:'2028-06-30'},
  official_surface_checks:officialChecks,
  bounded_searches:[
    'site:phoenix.gov TSMC wastewater accepted completion "2026"',
    'site:tsmc.com Arizona "water" "2026" reclamation operation',
    'site:azdeq.gov "TSMC" wastewater permit',
    'site:phoenix.gov "TSMC" "certificate" "wastewater"',
    'site:phoenix.gov "TSMC" "S-52899" "completed"',
    'site:phoenix.gov "TSMC" "lift stations" "accepted"',
    'site:azdeq.gov "TSMC Arizona" "discharge"',
  ].map(query=>({query,result:'No exact qualifying artifact retrieved in this bounded search. Unopened job, older infrastructure and unrelated waste snippets were not used as outcome evidence.'})),
  update_id:'update-2026-11-21-phase-60-arizona-followup',update_title:'Arizona water reporting adds context, not accepted operating infrastructure',
};
export const phase55qReview={
  receipt_id:'receipt-55q-gap-002-2026-11-21-dated-hold',phase:'Phase 55Q',gap_id:'gap-002',
  prior_receipt_id:'receipt-55q-gap-002-2026-09-22-dated-hold',scheduled_check_date:evidenceReviewDate,source_checked_date:evidenceReviewDate,decision_date:evidenceReviewDate,next_check_date:'2026-12-21',
  receipt_type:'No Material Change',decision:'Dated Hold',cycle_item_id:null,counts_as_cycle_decision:false,shared_inspection_id:sharedInspectionId,
  related_cycle_receipt_id:arizonaFollowup.receipt_id,
  stage_result:'Retain the authorized agreement and the Source Added gap. The inspected City records establish authorization and acceptance requirements, not completed named-project acceptance. No asset, operating or qualification admission.',
  evidence_boundary:'This is the separate November 21 Phase 55Q appointment, not a replacement for the October 9 Phase 60 follow-up. It reuses the six explicitly shared City inspections below; it does not claim a second independent fetch. No qualifying completed acceptance was retrieved; nonexistence is not established.',
  next_action:'Recheck the named Phoenix/TSMC conveyance acceptance on December 21 against completed as-builts, testing and engineer/City acceptance records. Keep the IRWP contract deadline and Phase 60 operating-evidence gate separate. Earlier reopening requires an exact newly discovered official artifact; this date is an editorial appointment, not a publication forecast.',
  official_surface_checks:officialChecks.slice(0,6),
  affected_record_ids:['source-phoenix-tsmc-2026-wastewater-development-agreement','signal-tsmc-phoenix-wastewater-infrastructure-agreement','gap-002'],
  affected_routes:['/atlas/evidence-gaps/gap-002-arizona-industrial-water-capacity/','/signals/phoenix-tsmc-wastewater-infrastructure-reclaimed-water-milestones/','/atlas/sources/source-phoenix-tsmc-2026-wastewater-development-agreement/','/updates/','/atlas/evidence-gaps/'],
  publication_authorized:false,independent_stage_admission:false,human_reviewer:null,
  content_propagation_status:'complete',git_backed_release_status:'held',production_verified:false,
  update_id:'update-2026-11-21-phase-55q-arizona-acceptance-hold',
};
