// Bounded official-source research performed September 14, 2026. Historical
// report findings, live recommendation labels and failed retrievals stay separate.
export const agencyArtifactChecks = [
  {
    check_id:'207-CHECK-NASA-FISMA-2022', source_ids:['source-56b-nasa-fisma-fy2022'],
    url:'https://oig.nasa.gov/wp-content/uploads/2024/02/IG-23-006.pdf', issuer:'NASA Office of Inspector General; evaluation by RMA Associates',
    artifact_date:'2022-12-19, OIG transmittal; enclosed evaluator letter dated 2022-12-15',
    observation_period:'2021-10-01 through 2022-09-30; FY 2022 evaluation, not the 2024 upload directory',
    locator:'IG-23-006: transmittal; evaluator letter; printed pages 1, 4-7 and 15-16, including Table 3 and its non-operational-system note',
    access:'Relevant PDF text inspected. Page-image request at PDF index 19 returned Internal Error; no visual verification.',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'RMA assessed 20 core metrics and selected five systems, three operational. NASA received Level 3 and was judged not effective under the stated FISMA method; domain and function scores used a simple-majority approach.',
    limitation:'This is a historical program assessment, not a census of working systems, current incident exposure or an agency performance rank. Printed pagination differs from the retrieved PDF page count; missing pages or current remediation are not inferred.'
  },
  {
    check_id:'207-CHECK-NASA-FISMA-2023-PAGE', source_ids:['source-56b-nasa-fisma-fy2023'],
    url:'https://oig.nasa.gov/office-of-inspector-general-oig/ig-23-017/', issuer:'NASA Office of Inspector General',
    artifact_date:'2023-08-17, article dateline; displayed page update 2025-06-17',
    observation_period:'FY 2023 report summary; article date and page update do not establish the audit cutoff',
    locator:'IG-23-017 article title, dateline, summary and report identification',
    access:'Exact official landing-page text inspected; the exposed thumbnail link is an image, not the report PDF',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The summary attributes a repeated Consistently Implemented rating below the effectiveness benchmark to NASA. It identifies report IG-23-017.',
    limitation:'The landing page does not expose the scoring rationale or full scope. Its page update is not a new audit or a check of every recommendation.'
  },
  {
    check_id:'207-CHECK-NASA-FISMA-2023-PDF-ATTEMPT', source_ids:['source-56b-nasa-fisma-fy2023'],
    url:'https://oig.nasa.gov/wp-content/uploads/2024/02/ig-23-017.pdf', issuer:'NASA Office of Inspector General',
    artifact_date:'Not verified from this failed retrieval; report date independently checked in the official alternate copy',
    observation_period:'Intended FY 2023 report; no text returned from this URL',
    locator:'Exact report URL referenced by an official NASA publication',
    access:'Direct PDF retrieval returned Internal Error', evidence_role:'Issuer report URL - retrieval attempt', access_result:'Retrieval failed',
    finding:'This endpoint did not return readable report content in the research tool.',
    limitation:'Failure does not establish nonexistence, withdrawal or a changed finding. The separately recorded Oversight.gov copy is not proof of byte identity with the failed endpoint.'
  },
  {
    check_id:'207-CHECK-NASA-FISMA-2023-OFFICIAL-COPY', source_ids:['source-56b-nasa-fisma-fy2023'],
    url:'https://www.oversight.gov/sites/default/files/documents/reports/2023-09/IG-23-017.pdf', issuer:'NASA Office of Inspector General; RMA report hosted by CIGIE Oversight.gov',
    artifact_date:'2023-08-17, printed OIG transmittal and evaluator letter',
    observation_period:'2022-10-01 through 2023-05-31; not all twelve months of FY 2023',
    locator:'IG-23-017: transmittal and evaluator letter; printed pages 4-7, Tables 2-3 and footnote 12',
    access:'Relevant official-copy PDF text inspected; PDF index 3 image request failed with Internal Error / Cache miss',
    evidence_role:'Official alternate copy of identified report', access_result:'Text inspected; visual check unavailable',
    finding:'The evaluation used 20 core plus 20 supplemental metrics and a calculated-average method. Its 2.67 calculated value is distinct from the risk-based Level 3 assessment; footnote 12 says averages were not rounded to determine maturity. The overall label repeats while the Recover function changes.',
    limitation:'Do not round 2.67 into Level 3, average agency labels or treat the repeated overall label as unchanged controls. The rating remains a historical audit judgment, not a measured incident or service-outcome series. Byte identity with the unavailable NASA endpoint is not established.'
  },
  {
    check_id:'207-CHECK-NASA-FISMA-2024-PAGE', source_ids:['source-56b-nasa-fisma-fy2024'],
    url:'https://oig.nasa.gov/office-of-inspector-general-oig/evaluation-of-nasas-information-security-program-under-the-federal-information-security-modernization-act-for-fiscal-year-2024/', issuer:'NASA Office of Inspector General',
    artifact_date:'2024-09-12, article dateline; displayed page update 2025-06-17',
    observation_period:'FY 2024 evaluation summary, not a 2026 security assessment',
    locator:'Article summary and IG-24-019 identification', access:'Exact official landing-page text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The OIG summary attributes Level 3 to NASA and describes missing quantitative and qualitative effectiveness measures.',
    limitation:'The summary is not all underlying system evidence. Neither the article update nor the current research date renews the historical rating.'
  },
  {
    check_id:'207-CHECK-NASA-FISMA-2024-MEMORANDUM', source_ids:['source-56b-nasa-fisma-fy2024'],
    url:'https://oig.nasa.gov/wp-content/uploads/2024/09/ig-24-019.pdf', issuer:'NASA Office of Inspector General',
    artifact_date:'2024-09-12, printed memorandum date',
    observation_period:'FY 2024 assessment; results submitted to CyberScope 2024-07-31. Submission is not an independently established full-year observation window.',
    locator:'IG-24-019, all four PDF pages; assessment and sample on page 1; recurring concerns on page 2; explanatory enclosures',
    access:'All four pages of extracted text inspected; page-image request at index 0 returned Internal Error',
    evidence_role:'Issuer memorandum for identified report', access_result:'Text inspected; visual check unavailable',
    finding:'The memorandum describes 65 metrics and four judgmentally selected systems. It retains Level 3 below the effectiveness benchmark and identifies recurring documentation and enterprise-risk concerns.',
    limitation:'Four judgmentally selected systems are not a representative census, and 65 metrics are not directly interchangeable with FY 2022 core-only or FY 2023 core/supplemental assessments. No current remediation, risk reduction or incident rate is established.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2021-BOUND', source_ids:['source-56b-dhs-fisma-fy2021'],
    url:'https://www.oig.dhs.gov/sites/default/files/assets/2022-08/OIG-22-55-Aug22.pdf', issuer:'Department of Homeland Security Office of Inspector General',
    artifact_date:'Not verified at failed endpoint; alternate official record identifies 2022-08-01',
    observation_period:'Intended FY 2021 evaluation; failed endpoint supplies no observation',
    locator:'Bound OIG-22-55 PDF URL', access:'Direct retrieval returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The original bound PDF could not be read at this endpoint.',
    limitation:'No nonexistence, withdrawal or current recommendation disposition is inferred; the official alternate copy is recorded separately.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2021-OFFICIAL-COPY', source_ids:['source-56b-dhs-fisma-fy2021'],
    url:'https://www.oversight.gov/sites/default/files/documents/reports/2022-08/OIG-22-55-Aug22.pdf', issuer:'Department of Homeland Security Office of Inspector General; copy hosted by CIGIE Oversight.gov',
    artifact_date:'2022-08-01, printed cover and highlights; OIG-22-55, distinct from FY 2021',
    observation_period:'FY 2021 evaluation; Appendix A describes review work July 2021 through March 2022',
    locator:'Cover; printed pages 5-6 including footnote 19; Appendix A, printed pages 26-27; component results separately in Table 5',
    access:'Relevant official-copy text inspected; PDF index 10 image request returned Internal Error',
    evidence_role:'Official alternate copy of identified report', access_result:'Text inspected; visual check unavailable',
    finding:'DHS was judged not effective under FY 2021 instructions. Coast Guard work is included as a component assessment but excluded from the department-wide rating; Appendix A also excludes OIG compliance from the review.',
    limitation:'Coast Guard exclusion is not absence of all Coast Guard work. Component results cannot be silently included in the overall denominator or transferred to later cohorts. Alternate-copy byte identity and present recommendation closure are unverified.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2022-BOUND', source_ids:['source-56b-dhs-fisma-fy2022'],
    url:'https://www.oig.dhs.gov/sites/default/files/assets/2023-04/OIG-23-21-Apr23.pdf', issuer:'Department of Homeland Security Office of Inspector General',
    artifact_date:'Not verified from returned report text; alternate catalog dates OIG-23-21 to 2023-04-17',
    observation_period:'Intended FY 2022 evaluation; exact full-report scope remains unread',
    locator:'Bound OIG-23-21 PDF URL', access:'Initial retrieval returned Internal Error; later search-result open returned 403 Forbidden. No further access attempt.',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The exact bound report remains inaccessible through this tool; its six-deficiency claim was not independently reproduced from the report body.',
    limitation:'Do not replace full-report evidence with the accessible catalog summary or interpret denied access as no report. No permission workaround was attempted.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2022-CATALOG', source_ids:['source-56b-dhs-fisma-fy2022'],
    url:'https://www.oversight.gov/reports/audit/evaluation-dhs-information-security-program-fiscal-year-2022', issuer:'Department of Homeland Security OIG submission to CIGIE Oversight.gov',
    artifact_date:'2023-04-17, catalog Date Issued', observation_period:'FY 2022 program evaluation; exact fieldwork dates not supplied by this summary',
    locator:'Report Number OIG-23-21; Report Description; Number of Recommendations', access:'Official catalog description inspected',
    evidence_role:'Official catalog summary - not the full report', access_result:'Text inspected',
    finding:'The catalog reports an effective overall rating, four functions at Level 4 and Detect at Level 3 under that year\'s instructions. It lists one recommendation.',
    limitation:'The catalog neither reproduces all deficiencies nor proves their remediation. An effective aggregate is not a finding that every function or system was effective, or that the program is currently secure.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2023-BOUND', source_ids:['source-56b-dhs-fisma-fy2023'],
    url:'https://www.oig.dhs.gov/sites/default/files/assets/2024-06/OIG-24-26-Jun24.pdf', issuer:'Department of Homeland Security Office of Inspector General',
    artifact_date:'Not verified at failed endpoint; alternate catalog dates OIG-24-26 to 2024-06-04',
    observation_period:'Intended FY 2023 evaluation; original full report not inspected',
    locator:'Bound OIG-24-26 PDF URL', access:'Direct retrieval returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The exact bound PDF did not return readable content.',
    limitation:'This does not show that the report or a later recommendation disposition does not exist. Full component/system sampling remains unverified in this check.'
  },
  {
    check_id:'207-CHECK-DHS-FISMA-2023-CATALOG', source_ids:['source-56b-dhs-fisma-fy2023'],
    url:'https://www.oversight.gov/reports/audit/evaluation-ohs-information-security-program-fiscal-year-2023-0', issuer:'Department of Homeland Security OIG submission to CIGIE Oversight.gov',
    artifact_date:'2024-06-04, catalog Date Issued; displayed recommendation-state effective dates not supplied',
    observation_period:'FY 2023 evaluation summary; retrieved recommendation labels are separate catalog state, not the audit period',
    locator:'OIG-24-26 report number and DHS submitting/reviewed agency; description and Open Recommendations section',
    access:'Official catalog text inspected; heading spells OHS while report number, submitting agency and description identify DHS; cached representation has no verified current revision date',
    evidence_role:'Official catalog summary - not the full report', access_result:'Text inspected',
    finding:'The description reports an effective rating with five Level 4 functions using a calculated-average approach. The retrieved catalog separately displays two open recommendations.',
    limitation:'The heading typo is not evidence of another agency. Displayed open status lacks an effective date and is not certified current closure status. The summary cannot reproduce full sampling or justify cross-agency rankings.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2022-PAGE', source_ids:['source-56b-hhs-fisma-fy2022'],
    url:'https://oig.hhs.gov/reports/all/2023/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2022/', issuer:'HHS Office of Inspector General; evaluation by Ernst & Young',
    artifact_date:'Landing-page extraction lacks a report dateline; linked brief prints 2023-03-31',
    observation_period:'Assessment as of 2022-09-30; displayed recommendation states have separate later dates',
    locator:'Why We Did This Audit; How We Did This Audit; What We Found; recommendation 23-A-18-069.01',
    access:'Exact official page text inspected; full underlying audit report not included', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The summary covers the department and four of twelve operating divisions and reports Not Effective. Recommendation 23-A-18-069.01 is displayed as Closed Unimplemented, dated 2024-04-08.',
    limitation:'A closed recommendation can be unimplemented. This selected label is not a complete current recommendation inventory, demonstrated control effectiveness or an incident-outcome series.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2022-BRIEF', source_ids:['source-56b-hhs-fisma-fy2022'],
    url:'https://oig.hhs.gov/documents/audit/6083/A-18-22-11200-Report%20in%20Brief.pdf', issuer:'HHS Office of Inspector General',
    artifact_date:'2023-03-31, printed Report in Brief date; A-18-22-11200', observation_period:'Assessment as of 2022-09-30',
    locator:'One-page Report in Brief: date, scope, findings, recommendations and management response',
    access:'Entire one-page text inspected; image request failed with Internal Error / Cache miss', evidence_role:'Linked official report brief - not the full audit', access_result:'Text inspected; visual check unavailable',
    finding:'The brief confirms the cutoff, four-of-twelve operating-division scope and program-level Not Effective finding. It preserves disagreement about oversight responsibilities.',
    limitation:'The brief is not an audit of every operating division, and the historical response does not establish implementation. No complete table reproduction or full-report review is claimed.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2023-BOUND', source_ids:['source-56b-hhs-fisma-fy2023'],
    url:'https://oig.hhs.gov/reports/all/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2023/', issuer:'HHS Office of Inspector General',
    artifact_date:'Not verified at failed landing-page endpoint; alternate brief prints June 2024',
    observation_period:'Intended FY 2023 audit; exact landing page not read', locator:'Bound FY 2023 landing-page URL',
    access:'Direct retrieval returned Internal Error', evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'This landing-page URL did not return readable content in the research tool.',
    limitation:'The failed page is not evidence that the audit or current recommendations do not exist. The separately recorded official brief supports only its own stated findings.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2023-BRIEF', source_ids:['source-56b-hhs-fisma-fy2023'],
    url:'https://oig.hhs.gov/documents/audit/9927/A-18-23-11200RIB.pdf', issuer:'HHS Office of Inspector General; evaluation by Ernst & Young',
    artifact_date:'June 2024, printed month; A-18-23-11200. Exact publication day not established by this brief.',
    observation_period:'Assessment as of 2023-07-31', locator:'Entire one-page Report in Brief, including operating/staff-division scope and management-response qualifications',
    access:'Entire one-page text inspected; PDF index 0 image request returned Internal Error', evidence_role:'Official report brief - not the full audit', access_result:'Text inspected; visual check unavailable',
    finding:'The brief covers four of twelve operating divisions and one staff division. HHS remains Not Effective overall while the text identifies differing component trajectories and changes in recommendations.',
    limitation:'Identical overall labels do not imply identical component results or unchanged controls. The July cutoff differs from FY 2022\'s September cutoff. No complete full-report or recommendation-closure review was performed.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2024-PAGE', source_ids:['source-56b-hhs-fisma-fy2024'],
    url:'https://oig.hhs.gov/reports/all/2024/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2024/', issuer:'HHS Office of Inspector General; evaluation by Ernst & Young',
    artifact_date:'Landing-page extraction lacks report dateline; linked highlights print November 2024; individual closure dates are recorded separately',
    observation_period:'Assessment as of 2024-07-31; recommendation labels as displayed in the page retrieved 2026-09-14, not a new FISMA audit',
    locator:'Why OIG Did This Audit; What OIG Found; all six Recommendation Details (25-A-18-014.01 through .06)',
    access:'Exact official page text inspected; no full underlying audit or follow-up implementation evidence inspected', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The historical audit summary reports Not Effective. Recommendation .01 is Closed Superseded (2026-08-24), .02 Closed Implemented (2025-05-27), .03 Open Unimplemented, .04 Closed Superseded (2026-05-29), .05 Open Unimplemented, and .06 Closed Implemented (2025-06-17).',
    limitation:'Closed Superseded is not Closed Implemented. The two open entries show an expected update of 2025-11-27, not completion evidence. Displayed labels are not independent testing of current controls, a revised audit rating, or proof of zero incidents.'
  },
  {
    check_id:'207-CHECK-HHS-FISMA-2024-HIGHLIGHTS', source_ids:['source-56b-hhs-fisma-fy2024'],
    url:'https://oig.hhs.gov/documents/audit/10060/A-18-24-11200-highlights.pdf', issuer:'HHS Office of Inspector General',
    artifact_date:'November 2024, printed month; A-18-24-11200. Exact publication day not supplied.',
    observation_period:'Assessment as of 2024-07-31', locator:'Entire one-page Report Highlights: date, why, findings and recommendations',
    access:'Entire one-page text inspected. Image request produced a reference without an inspectable image in this tool output; visual review not completed.',
    evidence_role:'Linked official report highlights - not the full audit', access_result:'Text inspected; visual check unavailable',
    finding:'The highlights confirm the historical audit identity and cutoff, a Not Effective rating under core and supplemental metrics, and six recommendations with partial management disagreement.',
    limitation:'These 2024 highlights do not contain the later recommendation states shown on the live landing page. They do not expose the complete system/division sample or establish current cybersecurity performance.'
  }
];

export const agencyResearchReviews = [{
  backlog_item_id:'182-BACKLOG-006', review_id:'207-BACKLOG-006-2026-09-14',
  check_ids:[
    '207-CHECK-NASA-FISMA-2022',
    '207-CHECK-NASA-FISMA-2023-PAGE',
    '207-CHECK-NASA-FISMA-2023-PDF-ATTEMPT',
    '207-CHECK-NASA-FISMA-2023-OFFICIAL-COPY',
    '207-CHECK-NASA-FISMA-2024-PAGE',
    '207-CHECK-NASA-FISMA-2024-MEMORANDUM',
    '207-CHECK-DHS-FISMA-2021-BOUND',
    '207-CHECK-DHS-FISMA-2021-OFFICIAL-COPY',
    '207-CHECK-DHS-FISMA-2022-BOUND',
    '207-CHECK-DHS-FISMA-2022-CATALOG',
    '207-CHECK-DHS-FISMA-2023-BOUND',
    '207-CHECK-DHS-FISMA-2023-CATALOG',
    '207-CHECK-HHS-FISMA-2022-PAGE',
    '207-CHECK-HHS-FISMA-2022-BRIEF',
    '207-CHECK-HHS-FISMA-2023-BOUND',
    '207-CHECK-HHS-FISMA-2023-BRIEF',
    '207-CHECK-HHS-FISMA-2024-PAGE',
    '207-CHECK-HHS-FISMA-2024-HIGHLIGHTS'
  ],
  finding:'The inspected NASA, DHS and HHS artifacts support bounded historical audit attribution, not a common agency ranking. NASA scoring and metric coverage change, DHS separates Coast Guard component work from its FY 2021 aggregate, and HHS separates sampled-division audit findings from later recommendation labels. Several exact endpoints and PDF visual checks remain unavailable.',
  recommendation:'Retain the cross-agency ranking hold and In Review state. Preserve calculated values, risk-based judgments, audit cutoffs and recommendation dispositions separately; do not interpret a repeated label or a closed/superseded recommendation as measured security improvement.',
  next_action:'Obtain authorized review of this bounded attribution. Complete accessible exact full-report scope checks for DHS FY 2022/2023 and HHS, inspect PDF images, and verify recommendation-state dates and supporting closure evidence before any current-control claim. Continue later agency cohorts separately.',
  next_check_date:'2026-09-21'
}];
