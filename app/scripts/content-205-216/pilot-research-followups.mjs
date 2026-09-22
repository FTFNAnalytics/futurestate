// Additive research, not a replacement for the original extraction or an admission.
export const pilotResearchFollowups = [{
  review_id: '211-DALRYMPLE-DEFINITION-2026-09-15',
  pilot_id: '160-PILOT-002', entity_id: '119-PROJECT-014',
  checked_date: '2026-09-15', reviewer: 'Codex - assisted text research only',
  title: 'Dalrymple availability: the missing contractual definition and interval record',
  status: 'Bounded text-only follow-up; visual and independent review incomplete',
  finding: 'The missing method is now more precisely located: the reports refer to the Battery Operating Agreement availability guarantee and monthly calculations. Telemetry quality flags and a narrative outage list are not a reproduced eligible-time denominator. No additional observation or qualified series is established.',
  source_checks: [
    {
      title: 'ElectraNet ESCRI-SA Operational Report 1',
      url: 'https://www.arena.gov.au/assets/2016/02/escri-sa-battery-energy-storage.pdf',
      artifact_date: '2019-07', locator: 'Printed page 21, section 4.2; printed page 42, section 7.2.4',
      access: 'Official PDF text retrieved; relevant page images not inspected',
      finding: 'The method reference is Schedule 7 of the Battery Operating Agreement. A separate defect note describes over-range telemetry flags and a proposed cap on reported values. It does not establish a completed fix or how suspect intervals entered the availability calculation.'
    },
    {
      title: 'ElectraNet ESCRI-SA Operational Report 3',
      url: 'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-3.pdf',
      artifact_date: '2020-08', locator: 'Printed page 36, section 6.2',
      access: 'Official PDF text retrieved; relevant page image not inspected',
      finding: 'The parties had agreed a calculation method, with ElectraNet supplying monthly tracking to AGL. The Operating Protocol could be amended without amending the main agreement. The reviewed passage does not disclose the calculation, its version history or interval ledger.'
    },
    {
      title: 'ElectraNet ESCRI-SA Final Knowledge Sharing Report',
      url: 'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-final-report.pdf',
      artifact_date: '2021-03', locator: 'Printed pages 19-20, Table 3 and following explanation',
      access: 'Official PDF text retrieved; table image not inspected in this follow-up',
      finding: 'The final summary retains the reported aggregate and the conflicting fourth-period heading already preserved in the September 14 extraction. Neither the aggregate nor the contractual annual target supplies the underlying interval population. No replacement value or new period correction is made here.'
    }
  ],
  access_limits: [
    'A fresh open of https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-4.pdf returned a tool internal error. The September 14 report-4 amendment is preserved, not claimed as freshly reverified.',
    'Page-image requests returned cache-miss errors or no inspectable image in this session. This follow-up does not certify table layout, footnotes or visual extraction.',
    'A local download of report 1 was denied by socket permissions. It was not retried or escalated; no local PDF was obtained. This is an access limit, not a finding that a document does not exist.'
  ],
  required_artifacts: [
    'The applicable Schedule 7 availability calculation and Operating Protocol versions, including eligible time, partial derating, planned maintenance and exclusion rules.',
    'Monthly available/eligible interval records and reconciliation to each reported half-year, with timestamps, quality flags, missing-data treatment and revision history.',
    'Evidence showing whether and when the proposed telemetry change was applied; independent visual/extraction review and an authorized admission decision.'
  ],
  next_action: 'Obtain those exact artifacts through an authorized public source or separately approved contact. Reproduce the same defined measure without back-solving interval counts from rounded percentages; keep the feature unshipped until its admission conditions pass.',
  affected_record_ids: ['198-CASE-014','191-PROJECT-005','192-PLACE-002','212-REPORT-001'],
  affected_routes: [
    '/method/editorial-review/',
    '/reference/failure-casebooks/dalrymple-grid-battery/',
    '/reference/international-projects/dalrymple-grid-battery/',
    '/reference/global-places-ii/south-australia-grid-storage/',
    '/reference/field-report/2026-09-14/'
  ],
  visual_review_complete: false, independent_review_complete: false,
  admitted: false, admission_receipt: null, second_reviewer: null,
  candidate_observations_added: [],
  prior_extraction_preserved: true, issuer_correction_claimed: false,
  publication_authorized: false
}];

// Later access success is a new receipt, not a rewrite of the earlier failure.
pilotResearchFollowups.push({
  ...structuredClone(pilotResearchFollowups[0]),
  review_id: '211-DALRYMPLE-VISUAL-2026-09-15',
  supersedes_access_limits_of: '211-DALRYMPLE-DEFINITION-2026-09-15',
  reviewer: 'Codex - assisted visual source review; not an independent second reviewer',
  title: 'Dalrymple availability: official tables visually checked after access repair',
  status: 'Selected source pages visually checked; independent review and admission held',
  finding: 'Four official PDFs were downloaded and nine relevant pages rendered and inspected. Report 4 confirms the previously preserved fourth-period interpretation; the final report retains its conflicting heading. The contractual calculation and eligible-interval population remain unobtained. This receipt resolves the earlier download and page-image access limits only; it adds no observation or admitted series.',
  source_checks: [
    {
      title: 'ElectraNet ESCRI-SA Operational Report 1',
      url: 'https://www.arena.gov.au/assets/2016/02/escri-sa-battery-energy-storage.pdf',
      artifact_date: '2019-07', locator: 'Pages 21 (Table 4-1), 40 (section 7.1), 42 (section 7.2.4)',
      access: 'Official PDF downloaded; all three named pages visually inspected',
      finding: 'The first period reports 98.01% and cites Schedule 7. The protocol may change separately from the main agreement. Suspect telemetry and a proposed cap are described, without proof here of implementation or interval treatment.',
      captured_sha256: 'fbdf1d3596780d246495eb4825e75acdccb65a413ccbd663779144bb6f0503d6',
      captured_bytes: 2801275, document_pages: 48, visually_checked_pages: [21,40,42]
    },
    {
      title: 'ElectraNet ESCRI-SA Operational Report 3',
      url: 'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-3.pdf',
      artifact_date: '2020-08', locator: 'Pages 14 (Table 3-1), 36 (section 6.2)',
      access: 'Official PDF downloaded; both named pages visually inspected',
      finding: 'The first three period columns and availability row are legible. Section 6.2 records an agreed calculation method and monthly updates, but does not reproduce the eligible-interval ledger or method version history.',
      captured_sha256: '2afdd486f367c6957acd9bf8f3f8d60da65c67a313fc967bd4ce826cc3a0b6f6',
      captured_bytes: 1865567, document_pages: 42, visually_checked_pages: [14,36]
    },
    {
      title: 'ElectraNet ESCRI-SA Operational Report 4',
      url: 'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-4.pdf',
      artifact_date: '2021-02', locator: 'Pages 14 (Table 3-1), 35 (section 6.2)',
      access: 'Official PDF downloaded; both named pages visually inspected',
      finding: 'The fourth column runs from 14 June to 14 December 2020 and reports 98.80%. The method passage again describes monthly tracking against an agreed contractual calculation. This corroborates the existing period amendment; it is not an issuer correction of the final report.',
      captured_sha256: 'f07576cf0ede7d0b8db5187a5e354efbdf4445b3dda1c70697e1b2b4df9d1679',
      captured_bytes: 2591957, document_pages: 40, visually_checked_pages: [14,35]
    },
    {
      title: 'ElectraNet ESCRI-SA Final Knowledge Sharing Report',
      url: 'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-final-report.pdf',
      artifact_date: '2021-03', locator: 'Pages 19 (Table 3), 20 (following explanation)',
      access: 'Official PDF downloaded; both named pages visually inspected',
      finding: 'Table 3 visibly labels the fourth period as beginning 14 June 2019, unlike report 4, while reporting 98.80%. Its separate two-year aggregate is 98.27%. The following explanation compares that aggregate to an annual contractual target; it does not supply the eligible-time denominator.',
      captured_sha256: 'f431e507a48bb61c27247495e8365f9bb1e2b830c5b2145d0ca6bf41aaee7b99',
      captured_bytes: 1271033, document_pages: 39, visually_checked_pages: [19,20]
    }
  ],
  access_limits: [
    'The earlier tool and socket failures remain accurate historical access receipts; all four downloads succeeded after explicit user approval of the repair and retry.',
    'Visual review covers only the nine named pages, including their table headings and footers. It is assisted review, not independent extraction acceptance or a full-document audit.',
    'No applicable Schedule 7 calculation, protocol version history, monthly interval ledger or completed telemetry-fix evidence was obtained in this bounded review. Nonexistence is not inferred.'
  ],
  visual_review_complete: true,
  visual_review_scope: 'Nine named pages of four official PDFs, locally rendered with Poppler and visually inspected on 2026-09-15',
  next_action: 'Obtain the exact contractual method and available/eligible interval records listed below, then request genuine independent review and an authorized admission decision. Retain both conflicting source headings; do not back-solve intervals or treat a successful PDF download as qualification.'
});

// September 22 acquisition results are additive; the September 14 pilot records
// and both September 15 Dalrymple receipts remain byte-for-byte historical data.
const acquisitionBoundary={checked_date:'2026-09-22',reviewer:'Codex - assisted acquisition review; not an independent second reviewer',independent_review_complete:false,admitted:false,admission_receipt:null,second_reviewer:null,candidate_observations_added:[],prior_extraction_preserved:true,issuer_correction_claimed:false,publication_authorized:false};
pilotResearchFollowups.push({
  ...acquisitionBoundary,
  review_id:'211-HORNSDALE-ACCESS-2026-09-22',pilot_id:'160-PILOT-001',entity_id:'119-PROJECT-012',
  title:'Hornsdale H1 2024: report recovered; interval denominator still missing',
  status:'Three selected PDF pages visually checked; measurement feature held',
  finding:'The exact report was downloaded and selected pages inspected. Its cover identifies Revision 1 released February 21, 2025 for H1 2024. Table 1 prints the invalid WAPS date 31/11/2023; no silent replacement or issuer erratum is claimed. The response comparison on printed page 8 concerns a dispatch interval, not a reproduced half-year availability measure.',
  source_checks:[{
    title:'Neoen Hornsdale H1 2024 operations report, Revision 1',
    url:'https://arena.gov.au/assets/2025/03/Neoen-%E2%80%93-Hornsdale-Power-Reserve-Upgrade-%E2%80%93-Operations-Report-H1-2024.pdf',
    artifact_date:'2025-02-21',observation_period:'H1 2024',
    locator:'Cover (physical PDF page 1); Table 1, printed page 4 (physical 9); Figures 4-5 and discussion, printed page 8 (physical 13)',
    access:'Official PDF downloaded; the three named pages rendered with Poppler and visually inspected',
    finding:'The cover separates release and observation dates. Table 1 contains 31/11/2023. Figures 4-5 compare event response; the reviewed passages do not supply the half-year eligible/available interval population. No plot values were digitized.',
    captured_sha256:'e228a12b0320a0ebcaa2c81caa246081be0ca647327afe73c1764065a1b9bea5',captured_bytes:1130456,document_pages:18,
    visually_checked_pages:[1,9,13],page_number_convention:'One-based physical PDF pages; printed page locators are separately stated'
  }],
  access_limits:[
    'The earlier direct-request failure remains preserved in the September 14 pilot. This later successful download resolves access only, not independent acceptance.',
    'Visual review covers only the cover, printed pages 4 and 8. Neither a full-document audit nor a current 2026 operating review was performed.',
    'The invalid printed date differs from the November 30 date in the separately cited final-report account. Issuer clarification, the contractual availability method and interval ledger were not obtained; their nonexistence is not inferred.'
  ],
  required_artifacts:['Exact availability definition and applicable service/configuration boundary, with eligible intervals, exclusions and revision policy.','Period-compatible available/eligible interval records and missing-data treatment; independent reproduction before admission.','Issuer clarification of the printed WAPS date, without silently changing either historical artifact.'],
  next_action:'Resolve the date discrepancy and obtain the service definition plus complete interval inputs. Keep the measurement feature held; successful PDF access does not qualify a series or waive full-v1 requirements.',
  affected_record_ids:['191-PROJECT-003'],affected_routes:['/method/editorial-review/','/reference/international-projects/hornsdale-power-reserve/'],
  visual_review_complete:true,visual_review_scope:'Three named physical PDF pages (1, 9, 13) of one hash-pinned report; no independent extraction review'
},{
  ...acquisitionBoundary,
  review_id:'211-DALRYMPLE-ACQUISITION-2026-09-22',pilot_id:'160-PILOT-002',entity_id:'119-PROJECT-014',
  title:'Dalrymple availability: bounded search did not recover the calculation contract',
  status:'Bounded acquisition follow-up; measurement feature held',
  finding:'The public search returned operating-report discussion but not the applicable Schedule 7, Operating Protocol versions or interval ledger. Report 2 describes method agreement still under discussion; report 3 describes agreement and monthly tracking. That contrast identifies a versioning requirement, not a demonstrated error in a historical percentage.',
  source_checks:[
    {title:'ESCRI-SA Operational Report 2',url:'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-2.pdf',artifact_date:'2020-02',locator:'Cover and section 6.2, printed page 36',access:'Official PDF text inspected in the September 22 acquisition pass; new page-image check not performed',finding:'Calculation-method agreement was still being worked through; this passage does not reproduce the method or interval population.'},
    {title:'ESCRI-SA Operational Report 3',url:'https://arena.gov.au/assets/2021/04/escri-sa-battery-energy-storage-report-3.pdf',artifact_date:'2020-08',locator:'Section 6.2, printed page 36',access:'Official indexed text inspected in the September 22 acquisition pass; the September 15 visual receipt remains separate',finding:'An agreed calculation and monthly tracking are described; applicable protocol versions and interval records remain required.'}
  ],
  access_limits:['The exact ElectraNet-domain Schedule 7 search returned no indexed result; this does not establish that the contract is unavailable or nonexistent.','No contact, records request or fee was initiated. No new page-image review or additional candidate observation was performed.'],
  required_artifacts:structuredClone(pilotResearchFollowups[0].required_artifacts),
  next_action:'Obtain the applicable calculation contract, protocol versions and monthly available/eligible interval records. Preserve the four candidate values and the existing fourth-period amendment; independent reproduction and authorized admission remain pending.',
  affected_record_ids:['198-CASE-014','191-PROJECT-005','192-PLACE-002','212-REPORT-001'],
  affected_routes:['/method/editorial-review/','/reference/failure-casebooks/dalrymple-grid-battery/','/reference/international-projects/dalrymple-grid-battery/','/reference/global-places-ii/south-australia-grid-storage/','/reference/field-report/2026-09-14/'],
  visual_review_complete:false
},{
  ...acquisitionBoundary,
  review_id:'211-F15EX-ACCESS-2026-09-22',pilot_id:'160-PILOT-003',entity_id:'119-PROJECT-016',
  title:'F-15EX acceptance series: current article access denied; ledger still required',
  status:'Retrieval-limited follow-up; measurement feature held',
  finding:'The text reader and direct request did not recover the exact Air Force article; the direct request returned Access Denied. A focused exact-article search returned no result. The previously inspected December 15, 2025 narrative remains inherited, not freshly verified. No monthly count or zero is inferred.',
  source_checks:[{title:'Air Force: F-15EX production rebounds, deliveries continue',url:'https://www.aflcmc.af.mil/NEWS/Article/4359770/f-15ex-production-rebounds-deliveries-continue/',artifact_date:'2025-12-15 (retained prior inspection)',locator:'Exact article URL; no body recovered in this acquisition pass',access:'Text reader failed; direct request returned Access Denied; focused exact-article search returned no result',finding:'No newly verified acceptance event or complete monthly population was obtained. Earlier narrative findings remain dated September 14.'}],
  access_limits:['Retrieval denial and no indexed search result are not evidence of no production, no delivery or no formal acceptance.','No access restriction was bypassed and no unpublished or paid record was sought.'],
  required_artifacts:['Complete aircraft-identity ledger with formal acceptance dates, period coverage and production-line boundary.','Excluded, reworked and revised events, with planned, delivered, arrived and accepted milestones kept separate.','Independent reconciliation and an actual admission decision before charting a governed monthly series.'],
  next_action:'Acquire the complete formal-acceptance ledger through an authorized source. Keep the feature held; do not convert article dates, unit arrivals or aircraft identifiers into acceptance rates.',
  affected_record_ids:['198-CASE-016','212-REPORT-001'],affected_routes:['/method/editorial-review/','/reference/failure-casebooks/f15ex-production-delivery/','/reference/field-report/2026-09-14/'],
  visual_review_complete:false
});
