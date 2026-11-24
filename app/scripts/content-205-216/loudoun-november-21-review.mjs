// Actual November 21, 2026 America/Edmonton inspection. Not a generated finding.
export const evidenceReviewDate='2026-11-21';
export const priorLedgerPayloadSha256='7b84b9b4e99e5223feda48ad724aac7c9b73ea443e19dae0660a28c6824d02d8';
export const priorLedgerSnapshot=ledger=>({...ledger,as_of_date:'2026-10-28',receipts:ledger.receipts.filter(r=>r.decision_date<evidenceReviewDate)});
const check=(url,source_date,finding,limitation,locator,access_result='Official HTML text inspected.')=>({url,source_date,access_result,finding,limitation,locator,accessed_date:evidenceReviewDate});
export const loudounFollowup={
  receipt_id:'receipt-60-loudoun-2026-11-21-watch-note',
  cycle_item_id:'60-CYCLE-LOUDOUN-STANDARDS',
  prior_receipt_id:'receipt-60-loudoun-2026-10-28-watch-note',
  prior_receipt_artifact_digest:'f1c5d0c503e552b948015a4951086371375e416eef291ffbad073a57a4c29819',
  follow_up_scheduled_date:'2026-11-18',
  source_checked_date:evidenceReviewDate,
  decision_date:evidenceReviewDate,
  next_check_date:'2026-12-02',
  receipt_type:'Watch Note',
  decision_status:'rescheduled_with_watch_note',
  signal_decision:'retain_in_review_watch_note',
  bounded_finding:'The county now reports a November 17 Board decision to pause certain legislative data-center and substation applications, with a stated September 15 effective date. That changes the earlier proposed-pause account, not the Phase 2 standards signal. The project page still labels its amendments proposed and identifies a December 1 Board packet. Retain In Review: a limited application pause is not adopted Phase 2 standards or a named-project approval.',
  evidence_boundary:'Actual inspection November 21 catches up the November 18 follow-up; the primary schedule remains October 1 and the October 28 receipt remains history. The November 18 county announcement supports the reported Board action, not independent verification of the resolution text. Its exact staff-report link returned 403. The September proposal-summary PDF was checked as text, not visually or as an enacted instrument. No exact ZOC disposition, adopted Phase 2 instrument, named-project permit or qualification result was retrieved; this bounded review does not establish nonexistence. Publication, event, reported effective and inspection dates remain separate.',
  next_action:'On December 2, check the announced December 1 Phase 2 Board packet and actual disposition, and seek the exact pause resolution through its official public route if available. Keep proposed amendments, the limited application pause, and Golden-Mars/GS-5 project requirements separate. Save a bounded receipt if the exact instrument remains unavailable. This editorial appointment is not an agency publication forecast; reopen earlier only for a newly discovered exact official artifact.',
  date_roles:{original_primary_schedule:'2026-10-01',followup_appointment:'2026-11-18',actual_inspection:'2026-11-21',county_announcement_published:'2026-11-18',reported_board_action:'2026-11-17',reported_pause_effective:'2026-09-15',announced_board_packet_meeting:'2026-12-01'},
  policy_scope:{reported_action:'Limited pause in Board consideration of legislative data-center and substation applications',reported_limits:'The county describes a maximum one-year decision period, continued submissions/staff review, exclusions for Route 28 Tax District and administrative applications, and possible grid-reliability or statutory-deadline exceptions.',formal_resolution_retrieved:false,phase2_adoption_established:false,named_project_compliance_established:false},
  official_surface_checks:[
    check('https://www.loudoun.gov/6222/Phase-2-Data-Center-Standards-Locations',null,'The current page labels the amendment texts proposed and links comments received by November 5 to a December 1 Board meeting packet.','A forward meeting reference does not establish that the meeting occurred or standards were adopted.','Proposed Amendments; Public Comment; Anticipated Project Timeline'),
    check('https://www.loudoun.gov/m/NewsFlash/home/detail/10993','2026-11-18','The county reports the November 17 limited-pause decision and its September 15 effective date.','An official announcement is not direct inspection of the adopted resolution or a finding about a named project.','Publication date; opening action; scope/exceptions; staff-report link'),
    check('https://pub-loudoun.escribemeetings.com/Meeting.aspx?Agenda=Agenda&Id=84e92081-0b3f-47be-bd67-8c11aa49730c&Item=2873&Tab=attachments&lang=English',null,'No staff-report or resolution body was retrieved.','403 access failure is not proof that the instrument does not exist. No alternate browser, access bypass or permission change was attempted.','Exact November 17 staff-report link in the county announcement','Failed to fetch: 403 Forbidden.'),
    check('https://www.loudoun.gov/DocumentCenter/View/222461/Draft-Data-Center-Standards-Project-Narrative-and-Amendment-Summary',null,'The first-page text identifies September 2026 proposed amendments, CPAM-2025-0001 and ZOAM-2025-0002.','Month precision only; no exact publication day inferred. Header/introductory text inspection, not a complete technical review or visual verification.','PDF page 1, heading and Notes to Reader','Official PDF text inspected; no visual or signature verification.'),
  ],
  bounded_searches:[
    {query:'site:loudoun.gov "November 17, 2026" "data center"',result:'Located the dated county announcement of the pause and its exact staff-report link.'},
    {query:'site:loudoun.gov "Phase 2" "November" "2026" standards',result:'Located the project page and proposed-amendment materials; no exact adopted Phase 2 instrument retrieved in this bounded search.'},
    {query:'site:loudoun.gov "October 7, 2026" "Data Center" "Zoning Ordinance Committee"',result:'No exact ZOC disposition was retrieved. Calendar/index results are not evidence of a completed committee decision.'},
  ],
  update_id:'update-2026-11-21-phase-60-loudoun-followup',
  update_title:'Loudoun reports a limited application pause; Phase 2 standards stay under review',
};
