// Candidate extraction only. These records do not enter the governed observation registry.
export const pilotReviews = [
  {
    pilot_id: '160-PILOT-001', entity_id: '119-PROJECT-012', title: 'Hornsdale Power Reserve',
    reviewed_date: '2026-09-14', reviewer: 'Codex — first-pass research only',
    proposed_measure: 'Half-year availability of the same named service', unit: 'percent',
    denominator: 'All eligible service intervals in each half-year; eligibility and exclusions must be supplied',
    method: 'Compare service-available intervals with eligible intervals; do not substitute capacity, revenue or an individual frequency-response event.',
    outcome: 'Blocked — no compatible half-year availability series extracted',
    artifact_url: 'https://arena.gov.au/assets/2025/03/Neoen-%E2%80%93-Hornsdale-Power-Reserve-Upgrade-%E2%80%93-Operations-Report-H1-2024.pdf',
    retrieval: 'Direct PDF request timed out; official indexed excerpt of page 8 reviewed.',
    finding: 'The retrieved excerpt supports an interval-specific response comparison, not a half-year availability numerator and denominator. No values were read from plotted curves.',
    candidate_observations: [],
    next_action: 'Retrieve the complete report and matching periods with service-interval counts and exclusions; independently reproduce the denominator before admission.',
    admitted: false, admission_receipt: null, second_reviewer: null,
    revision_policy: 'New service definition or eligibility rule starts a new segment; retain the prior artifact and decision.'
  },
  {
    pilot_id: '160-PILOT-002', entity_id: '119-PROJECT-014', title: 'Dalrymple ESCRI-SA',
    reviewed_date: '2026-09-14', reviewer: 'Codex — first-pass research only',
    proposed_measure: 'Reported average BESS availability', unit: 'percent',
    denominator: 'Underlying available and eligible time is not reproduced by the summary table.',
    method: 'Transcribe Table 3 cells and printed periods verbatim. Treat period inconsistency and missing denominator as blocking; do not silently repair dates.',
    outcome: 'Source-backed period replacement identified — denominator and independent review still required',
    artifact_url: 'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-final-report.pdf',
    artifact_date: '2021-03', locator: 'Printed page 19, Table 3; period description on printed page 8',
    retrieval: 'Official PDF text retrieved; page 19 screenshot requested. No independent extraction review completed.',
    finding: 'The original report 4 Table 3-1 supports June 14–December 14, 2020 for the fourth value. The conflicting final-report transcription is retained; a separate source-backed replacement is recorded. This is not an issuer erratum or independent denominator reproduction.',
    amendment: {
      amendment_id:'211-DALRYMPLE-PERIOD-2026-09-14', checked_date:'2026-09-14',
      artifact_url:'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-4.pdf',
      artifact_date:'2021-02', locator:'Cover; printed page 14 Table 3-1; page 15; section 6.2 page 35',
      basis:'Report 4 explicitly identifies the fourth half-year as 14/06/2020–14/12/2020 and prints 98.80% in that column.',
      replacement_candidate:{period_start:'2020-06-14',period_end:'2020-12-14',value:98.80,unit:'percent'},
      denominator_finding:'Section 6.2 says the parties agreed the availability calculation and receive monthly updates. The reviewed passages do not provide the eligible/available interval ledger or exclusions needed for reproduction.',
      issuer_correction_claimed:false, original_transcription_preserved:true, admitted:false
    },
    candidate_observations: [
      {period_start_as_printed:'2018-12-14',period_end_as_printed:'2019-06-14',value:98.01},
      {period_start_as_printed:'2019-06-14',period_end_as_printed:'2019-12-14',value:97.35},
      {period_start_as_printed:'2019-12-14',period_end_as_printed:'2020-06-14',value:98.93},
      {period_start_as_printed:'2019-06-14',period_end_as_printed:'2020-12-14',value:98.80,period_conflict:true}
    ],
    next_action: 'Independently check the report 4 replacement, retrieve the availability definition and eligible/available interval ledger with exclusions, then obtain authorized admission. Do not chart a governed series before these checks.',
    admitted: false, admission_receipt: null, second_reviewer: null,
    revision_policy: 'Never overwrite the printed period; store any supported correction as a versioned replacement with its exact artifact.'
  },
  {
    pilot_id: '160-PILOT-003', entity_id: '119-PROJECT-006', title: 'F-15EX production and delivery',
    reviewed_date: '2026-09-14', reviewer: 'Codex — first-pass research only',
    proposed_measure: 'Aircraft formally accepted per calendar month', unit: 'aircraft/month',
    denominator: 'All F-15EX acceptance events for the specified production line and month, deduplicated by aircraft identity.',
    method: 'Count formal acceptance records by event date, not tail-number suffixes, press-release dates or receiving-unit arrivals.',
    outcome: 'Blocked — delivery narrative does not establish a monthly acceptance ledger',
    artifact_url: 'https://www.aflcmc.af.mil/NEWS/Article/4359770/f-15ex-production-rebounds-deliveries-continue/',
    artifact_date: '2025-12-15', retrieval: 'Official article retrieved in full.',
    finding: 'The release describes a production interruption and named deliveries. It does not supply the complete monthly formal-acceptance population needed for this measure. No rate is inferred from aircraft identifiers or the narrative interval.',
    candidate_observations: [],
    next_action: 'Retrieve the monthly planned-versus-formally-accepted ledger with aircraft identifiers, acceptance dates, rework and revision records; independently reconcile arrivals before admitting a series.',
    admitted: false, admission_receipt: null, second_reviewer: null,
    revision_policy: 'Keep planned, delivered, received and formally accepted events separate; corrections retain prior event identity and receipt.'
  }
];
