// Official artifacts inspected September 14, 2026 (America/Edmonton).
// Retrieval, report cutoff, recommendation status and authorized disposition differ.
export const agencyFollowupArtifactChecks = [
  {
    check_id:'207-CHECK-NASA-FISMA-2025-PAGE', source_ids:['source-56c-nasa-fisma-fy2025'],
    url:'https://oig.nasa.gov/office-of-inspector-general-oig/audit-reports/evaluation-of-nasas-information-security-program-under-the-federal-information-security-modernization-act-for-fiscal-year-2025/',
    issuer:'NASA Office of Inspector General', artifact_date:'2025-07-29 article; displayed page update 2026-08-18',
    observation_period:'FY 2025 evaluation summary; not an August 2026 evaluation',
    locator:'IG-25-007 title, dateline and summary',
    access:'Exact bound URL redirected to the corresponding /audits/ article; text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The summary identifies IG-25-007 and attributes a Level 3 assessment, below the effectiveness benchmark, to NASA.',
    limitation:'A page-update date is not a new audit. The separate memorandum check supplies scope; the source profile URL and historical checked date are preserved.'
  },
  {
    check_id:'207-CHECK-NASA-FISMA-2025-MEMORANDUM', source_ids:['source-56c-nasa-fisma-fy2025'],
    url:'https://oig.nasa.gov/wp-content/uploads/2025/07/final-memorandum-ig-25-007-evaluation-of-nasas-information-security-program-under-the-federal-information-security-modernization-act-for-fy-2025.pdf?emrc=688e67a2165d6',
    issuer:'NASA Office of Inspector General', artifact_date:'2025-07-29, printed memorandum',
    observation_period:'FY 2025; Enclosure III recommendation snapshot as of July 2025',
    locator:'All seven PDF pages: assessment and footnote 1; recurring concerns; prior actions; Enclosures I-III',
    access:'All extracted pages inspected; page-image request at index 0 returned Internal Error / Cache miss',
    evidence_role:'Issuer memorandum for identified report', access_result:'Text inspected; visual check unavailable',
    finding:'The method uses 25 metrics across six functions including new Govern, with four judgmentally selected systems. NASA reports corrective actions for 22 of 27 open recommendations during FY 2024-2025 while retaining Level 3 and recurring issues. No formal new recommendation does not mean no issue; five earlier recommendations remain in its July snapshot.',
    limitation:'Corrective actions and repeated ratings do not measure causal risk reduction. July statuses and revised completion dates are not current closures. The August 1 reporting deadline is not an independently established observation cutoff; the sample is not a system census.'
  },
  {
    check_id:'207-CHECK-NASA-ZERO-TRUST-2025-PAGE', source_ids:['source-56c-nasa-zero-trust-2025'],
    url:'https://oig.nasa.gov/office-of-inspector-general-oig/audit-of-nasas-zero-trust-architecture/',
    issuer:'NASA Office of Inspector General', artifact_date:'2025-03-27, article dateline; IG-25-004',
    observation_period:'Historical Zero Trust Architecture audit summary; complete audit window not established from this page',
    locator:'Article title, dateline and corporate/non-corporate system distinction',
    access:'Exact bound URL redirected to /audits/audit-of-nasas-zero-trust-architecture/; article text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The OIG distinguishes progress in OCIO-managed corporate systems from delayed implementation in non-corporate mission and Jet Propulsion Laboratory systems.',
    limitation:'The full audit PDF was not inspected. Corporate progress cannot be assigned to every NASA system or used as the common intervention explaining a later agency-wide rating.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2024-BOUND', source_ids:['source-56c-dhs-fisma-fy2024'],
    url:'https://www.oig.dhs.gov/sites/default/files/assets/2025-07/OIG-25-28-Jun25.pdf',
    issuer:'Department of Homeland Security Office of Inspector General', artifact_date:'Not verified at this denied endpoint; alternate catalog is separately dated',
    observation_period:'Intended FY 2024 report; no readable report content returned',
    locator:'Exact bound OIG-25-28 PDF', access:'403 Forbidden; no further attempt at the denied endpoint',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The full report could not be inspected through this endpoint.',
    limitation:'Denied retrieval proves neither nonexistence nor an unchanged finding. The filename is not a verified issuance date, and a catalog summary cannot replace the unread full methodology.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2024-CATALOG', source_ids:['source-56c-dhs-fisma-fy2024'],
    url:'https://www.oversight.gov/reports/audit/evaluation-dhs-information-security-program-fiscal-year-2024',
    issuer:'DHS OIG submission hosted by CIGIE Oversight.gov', artifact_date:'Catalog Date Issued: 2025-07-01; OIG-25-28',
    observation_period:'FY 2024 assessment summarized in the catalog; recommendation label has no verified effective date',
    locator:'Title, report number, issuance field, summary and recommendation entry',
    access:'Official catalog text inspected, including link identifying the bound DHS PDF',
    evidence_role:'Official catalog summary, not full report', access_result:'Text inspected',
    finding:'The catalog describes an Effective assessment, Identify and Respond at Level 5 and the other three functions at Level 4. It displays one open recommendation concerning oversight of timely weakness remediation.',
    limitation:'This is not a current control test or proof of causation. Complete report scope remains unread; the undated open label is not certified current closure status or evidence of zero remediation activity.'
  },
  {
    check_id:'207-CHECK-GAO-CDM-2025-FOLLOWUP', source_ids:['source-56c-dhs-cdm-network-monitoring-2025','source-56d-dhs-cdm-recommendations-may2026'],
    url:'https://www.gao.gov/products/gao-25-107470', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published and publicly released 2025-06-11; recommendation comments as of May 2026',
    observation_period:'CDM program assessment of 23 civilian CFO Act agencies; later recommendation comments retain their own dates',
    locator:'Highlights, methods summary and all four recommendation/status entries',
    access:'Exact bound product-page text inspected; linked full report not inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'Twenty-two of 23 agencies reported CDM helpful; 21 reported incomplete network/data-protection implementation. These are agency reports, not measured exposure reductions. All four recommendations display Open with May 2026 comments; planned late-2026 actions are not completed results.',
    limitation:'This cross-agency program assessment is not DHS enterprise FISMA performance. Current retrieval does not update the May status date, independently validate reported benefits, or establish a causal outcome series.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2025-PAGE', source_ids:['source-56c-hhs-fisma-fy2025','source-56d-hhs-fisma-fy2025-method'],
    url:'https://oig.hhs.gov/reports/all/2026/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2025/',
    issuer:'HHS Office of Inspector General; evaluation by Ernst & Young',
    artifact_date:'Report identified as FY 2025; linked tracker separately supplies 2026-03-24 issuance',
    observation_period:'Landing-page audit cutoff 2025-07-31; five divisions and six cybersecurity functions',
    locator:'Audit scope, findings, concurrence summary and ten recommendation entries',
    access:'Exact bound landing-page text inspected', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The summary rates HHS Not Effective for a sixth year, distinguishing Core Consistently Implemented from Supplemental Ad Hoc. HHS concurred with seven of ten recommendations and not three.',
    limitation:'Repeated overall labels are not unchanged controls or a comparative rank. The linked PDF has a different Appendix A cutoff; do not silently harmonize it. Concurrence is not implementation, acceptance or evidence of service outcomes.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2025-METHOD-PDF', source_ids:['source-56c-hhs-fisma-fy2025','source-56d-hhs-fisma-fy2025-method'],
    url:'https://oig.hhs.gov/documents/audit/11558/OAS-25-18-041.pdf',
    issuer:'HHS Office of Inspector General; Ernst & Young performance audit',
    artifact_date:'March 2026 cover; evaluator letter 2026-03-02',
    observation_period:'Letter/highlights/objective: 2025-07-31; Appendix A: 2025-08-01. Internal cutoff discrepancy unresolved.',
    locator:'Cover, evaluator letter and highlights; printed pages 1-4 and 13-15, including complete Appendix A',
    access:'Relevant extracted text inspected in the 38-page PDF; index 23 screenshot returned Internal Error; not a whole-report or visual review',
    evidence_role:'Issuer report, relevant method sections', access_result:'Text inspected; visual check unavailable',
    finding:'Testing covered 25 systems in five divisions; only two divisions overlapped FY 2024. Appendix A identifies an ACL-specific audit-plan adjustment. The letter attributes difficulty demonstrating selected Govern, Identify and Detect activities to workforce changes, not a measured causal deterioration in all controls.',
    limitation:'Preserve the July 31/August 1 discrepancy. The changed sample and audit plan prevent a simple before/after inference. N/A metric cells are not zero performance. This bounded method review does not independently reproduce the audit or establish incident, recovery or mission outcomes.'
  },
  {
    check_id:'207-CHECK-HHS-CIO-2025-INVENTORY', source_ids:['source-56c-hhs-cio-open-recommendations-2025'],
    url:'https://www.gao.gov/products/gao-25-108539', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published 2025-09-03; publicly released 2025-09-10',
    observation_period:'September 2025 inventory of prior IT/security recommendations under the HHS CIO',
    locator:'Highlights: inventory scope and component/sensitive recommendation attributes',
    access:'Exact bound product-page text inspected; underlying individual recommendations not all rechecked',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The snapshot lists 82 open recommendations, with 37 sensitive and 49 relevant to component CIOs. These are overlapping attributes, not additive categories.',
    limitation:'This is not a September 2026 live inventory, severity measure or comparable agency score. Different scope and snapshot dates prevent comparison with NASA January 2026 totals. No sensitive report content was sought.'
  },
  {
    check_id:'207-CHECK-NASA-GAO-RISK-2025-FOLLOWUP', source_ids:['source-56d-nasa-gao-risk-management-2025'],
    url:'https://www.gao.gov/products/gao-25-108138', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published/public 2025-06-25; public version of March 2025 sensitive report; later status comments May/June 2026',
    observation_period:'Historical risk-management review of a nongeneralizable selection of two projects and four systems; later recommendation follow-up separately dated',
    locator:'Highlights, risk-step table and footnote; recommendation entries 1-16',
    access:'Exact bound public product-page text inspected; full report and omitted sensitive material not inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The Prepare step is organizational, not another system-level cell. Recommendation 1 remains Open with May 2026 comments; recommendation 2 is Closed Implemented based on June 2026 evidence supporting documented risk levels. This is a specific implementation finding.',
    limitation:'Do not suppress a genuine closure, transfer it to every recommendation, or equate it with measured risk reduction. Its later date cannot retroactively change a January 2026 inventory. Four selected systems do not establish an agency rank.'
  },
  {
    check_id:'207-CHECK-NASA-CIO-2026-INVENTORY', source_ids:['source-56d-nasa-cio-open-recommendations-2026'],
    url:'https://www.gao.gov/products/gao-26-108705', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published 2026-01-15; publicly released 2026-01-22',
    observation_period:'January 2026 inventory of prior IT/security recommendations under the NASA CIO',
    locator:'Highlights and inventory scope', access:'Exact bound product-page text inspected; linked report not inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The January snapshot lists 30 open recommendations under the NASA CIO across security and IT acquisition-management work.',
    limitation:'Thirty is not a live September inventory or incident count. This review does not revalidate every underlying recommendation; HHS totals from another date and scope cannot support an agency comparison.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2025-PROJECT-BOUND', source_ids:['source-56d-dhs-fisma-fy2025-project'],
    url:'https://www.oig.dhs.gov/reports/ongoing-projects', issuer:'Department of Homeland Security Office of Inspector General',
    artifact_date:'Not verified; denied endpoint returned no current project record',
    observation_period:'Intended FY 2025 FISMA project check; present project state unknown',
    locator:'Exact bound ongoing-projects endpoint', access:'403 Forbidden; no further attempt or alternate query to bypass denial',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The current project listing could not be read. Bounded official-source search did not supply a verified final FY 2025 enterprise FISMA artifact in this pass.',
    limitation:'This does not establish nonexistence, continued ongoing status or a final outcome. Old indexed project objectives, financial-statement audits and intelligence-system reports are not substitutes for the exact artifact.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2025-TRACKER', source_ids:['source-56d-hhs-fisma-recommendations-tracker-2026'],
    url:'https://oig.hhs.gov/reports/recommendations/tracker/?hhs-agency=all&search=OAS-25-18-041&view-mode=report-grouped',
    issuer:'HHS Office of Inspector General', artifact_date:'Filtered report issued 2026-03-24; global summary last updated 2026-08-14, not a row-specific status date',
    observation_period:'Displayed recommendation states retrieved 2026-09-14; next expected update 2026-09-23',
    locator:'Filtered OAS-25-18-041 group and all ten 26-A-18-055.01 through .10 entries',
    access:'Exact bound filtered tracker text inspected; identity also confirmed through the report-page link',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The filter returns one report with ten Open Unimplemented recommendations, zero implemented and zero closed. Each is Response Not Yet Due with September 23 expected; the report ID and recommendation prefix are different identifiers for this linked record.',
    limitation:'Global summary counts are not the filtered report counts. A dash for last response does not prove no activity; September 23 is not overdue on September 14. Displayed administrative states do not independently test controls or demonstrate outcomes.'
  }
];

export const agencyFollowupResearchReviews = [
  {
    backlog_item_id:'182-BACKLOG-010', review_id:'207-BACKLOG-010-2026-09-14',
    check_ids:['207-CHECK-NASA-FISMA-2025-PAGE','207-CHECK-NASA-FISMA-2025-MEMORANDUM','207-CHECK-NASA-ZERO-TRUST-2025-PAGE','207-CHECK-DHS-FISMA-2024-BOUND','207-CHECK-DHS-FISMA-2024-CATALOG','207-CHECK-GAO-CDM-2025-FOLLOWUP','207-CHECK-HHS-FISMA-2025-PAGE','207-CHECK-HHS-FISMA-2025-METHOD-PDF','207-CHECK-HHS-CIO-2025-INVENTORY'],
    finding:'Official records support attributed audit and program findings, but changes in sample, metric framework, intervention scope and report cutoff prevent a simple causal claim. The denied DHS full report remains a bounded access limit; the HHS internal cutoff discrepancy is retained.',
    recommendation:'Retain the causal-inference hold pending authorized disposition. Audit labels, reported benefits, implemented recommendations and observed service outcomes remain separate.',
    next_action:'Resolve the HHS cutoff discrepancy with the issuer and obtain readable exact NASA Zero Trust and DHS FY 2024 reports through supported access. Match dated interventions to compatible repeated outcomes and independent validation before proposing causation; obtain the evidence editor disposition.',
    next_check_date:'2026-09-21'
  },
  {
    backlog_item_id:'182-BACKLOG-014', review_id:'207-BACKLOG-014-2026-09-14',
    check_ids:['207-CHECK-NASA-GAO-RISK-2025-FOLLOWUP','207-CHECK-NASA-CIO-2026-INVENTORY','207-CHECK-DHS-FISMA-2025-PROJECT-BOUND','207-CHECK-GAO-CDM-2025-FOLLOWUP','207-CHECK-HHS-FISMA-2025-TRACKER','207-CHECK-HHS-FISMA-2025-PAGE','207-CHECK-HHS-FISMA-2025-METHOD-PDF'],
    finding:'A specific NASA recommendation has an implementation closure, while other dated recommendation comments and the HHS tracker retain separate states. These observations do not establish common agency performance; the inaccessible DHS project state remains unknown.',
    recommendation:'Retain the alternative-explanation hold pending authorized disposition. Preserve genuine implementation evidence without converting it into causal risk reduction or an agency-wide result.',
    next_action:'Recheck exact recommendation identities and dates, obtain the DHS FY 2025 enterprise artifact through supported access, and reconcile samples and the HHS cutoff discrepancy. Keep the HHS September 23 expected update as a future check, not a result, and obtain the evidence editor disposition.',
    next_check_date:'2026-09-21'
  }
];
