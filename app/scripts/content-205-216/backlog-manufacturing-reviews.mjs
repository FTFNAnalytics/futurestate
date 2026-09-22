// Official issuer/authority material actually inspected on September 14, 2026.
// These bounded research checks are not evidence admission or source-profile
// timestamp changes. Alternative queries and failed rendering remain explicit.
export const manufacturingArtifactChecks = [
  {
    check_id:'207-CHECK-CURRENT-CAPABILITIES', source_ids:['source-56c-current-applications-capabilities'],
    url:'https://www.currentapps.com/', issuer:'Current Applications',
    artifact_date:'No publication or revision date displayed; copyright year is not a source-check date',
    observation_period:'Undated capability and delivery claims, not repeated line observations',
    locator:'Custom Motor Design and Manufacturing; Why Choose Current Applications; contact address',
    access:'Company page text retrieved', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The company describes motor design, testing and physical tooling, with asserted lead-time and delivery benefits. It identifies the Watertown address.',
    limitation:'This is issuer attribution, not an independent measurement of throughput, labor, quality or delivery. Physical fixtures are not FTFN software test data.'
  },
  {
    check_id:'207-CHECK-CURRENT-CFA-19418', source_ids:['source-56c-current-applications-cancelled-expansion'],
    url:'https://regionalcouncils.ny.gov/cfa/project/51146', issuer:'New York Regional Economic Development Councils',
    artifact_date:'No record revision or status-effective date displayed',
    observation_period:'Historical CFA Round 2 application; status as displayed in the retrieved record',
    locator:'Applicant; CFA Number 19418; Award; Grant Money Disbursed to Date; Project Status',
    access:'Official project record text retrieved', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The page identifies Current Applications, a $140,000 award, $0 disbursed and status Black - Cancelled/Declined. Its expansion description remains a proposed project, not a completion account.',
    limitation:'The record does not identify the cancellation date or reason, all private investment, or any resulting production effect. Zero grant disbursement is not zero investment.'
  },
  {
    check_id:'207-CHECK-ISLAND-ACQUISITION', source_ids:['source-56c-island-components-acquisition-2021'],
    url:'https://islandcomponents.com/resource-library/g-w-lisk-company-acquires-island-components-group/', issuer:'Island Components Group / G.W. Lisk',
    artifact_date:'2021-11-17, announcement dateline', observation_period:'Acquisition announcement and intended post-acquisition organization',
    locator:'Announcement dateline; planned independent divisional operation; site footer',
    access:'Company announcement text retrieved', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The announcement describes the acquisition and intended divisional operation. Its narrative identifies Holbrook, while the current footer gives Hauppauge.',
    limitation:'Neither the announcement nor a changed footer establishes a relocation date, same-line continuity, realized synergies or production improvement.'
  },
  {
    check_id:'207-CHECK-ISLAND-CAPABILITIES', source_ids:['source-56c-island-components-capabilities'],
    url:'https://islandcomponents.com/capabilities-2/', issuer:'Island Components Group',
    artifact_date:'No publication or revision date displayed', observation_period:'Undated capability inventory, not a utilization or throughput interval',
    locator:'Engineering; Manufacturing; Testing; parent-company capability link',
    access:'Company page text retrieved', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The page lists winding, machining, automated equipment and environmental testing, and says parent-company capabilities may be used.',
    limitation:'Available equipment and potential parent support do not quantify actual usage, staffing, product mix, capital deployment or persistence of an earlier output change.'
  },
  {
    check_id:'207-CHECK-MONAGHAN-ISO14001', source_ids:['source-56c-monaghan-iso14001-2024','source-56d-monaghan-iso14001-boundary-2024'],
    url:'https://www.monaghanmed.com/iso-14001-certification/', issuer:'Monaghan Medical Corporation',
    artifact_date:'2024-02-27, announcement dateline', observation_period:'Certification announcement and stated environmental objectives',
    locator:'Dateline; certification statement; waste diversion and greenhouse-gas objectives',
    access:'Company announcement text retrieved', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'Monaghan announces ISO 14001 certification and describes waste-diversion and emissions objectives.',
    limitation:'This company announcement is not the certificate, a surveillance audit, or measured environmental or manufacturing performance. No clinical outcome is assessed.'
  },
  {
    check_id:'207-CHECK-MONAGHAN-PROFILE', source_ids:['source-56c-monaghan-manufacturing-profile'],
    url:'https://www.monaghanmed.com/about/', issuer:'Monaghan Medical Corporation',
    artifact_date:'No publication or revision date displayed; relative wording this year has no verified calendar anchor',
    observation_period:'Undated company profile and environmental-management commitments',
    locator:'Company description; Environmental Management System; EMS Policy and supplier-letter links',
    access:'Company profile text retrieved; linked policy files not included in this check', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The profile describes respiratory-device activities and an environmental-management program. Its relative timing cannot date implementation.',
    limitation:'Promotional quality, value and outcome statements do not supply a same-line production series or a common denominator. Linked documents were not silently treated as inspected.'
  },
  {
    check_id:'207-CHECK-CURRENT-TEAM', source_ids:['source-56d-current-applications-team-2026'],
    url:'https://www.currentapps.com/team', issuer:'Current Applications',
    artifact_date:'No publication or revision date displayed', observation_period:'Roles and address displayed at access; no dated staffing or labor-hour series',
    locator:'Our Team; manufacturing, engineering, tooling, information-systems, procurement and quality roles; contact address',
    access:'Company team-page text retrieved', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The page identifies operating functions and the Watertown address shared with the historical inspection record.',
    limitation:'Matching name/address supports a bounded identity cross-check, not unchanged ownership, continuous staffing, same-line identity or independently measured labor input.'
  },
  {
    check_id:'207-CHECK-CURRENT-OSHA-314347824', source_ids:['source-56d-current-applications-osha-inspection-2010'],
    url:'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=314347824', issuer:'Occupational Safety and Health Administration',
    artifact_date:'Inspection opened 2010-10-26; case closed 2011-01-24; page revision date not displayed',
    observation_period:'Historical inspection and enforcement record, 2010-2011',
    locator:'Inspection number 314347824; site address; Date Opened; Case Closed',
    access:'Official inspection detail retrieved', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'OSHA identifies Current Applications at 275 Bellew Avenue South, Watertown, and dates the inspection and closure to 2010-2011.',
    limitation:'This is not a current safety assessment, a later production observation or proof that a manufacturing intervention caused any outcome. No comparison of enforcement penalties is made.'
  },
  {
    check_id:'207-CHECK-ISLAND-QF36-REVF', source_ids:['source-56d-island-components-quality-clauses-2025'],
    url:'https://islandcomponents.com/wp-content/uploads/2025/12/ICG_QF36_Quality_Clause_Supplement_RevF.pdf', issuer:'Island Components Group',
    artifact_date:'Extracted footer identifies QF36, Rev. F, 11/25; URL upload folder is 2025/12',
    observation_period:'Supplier-control requirements; no actual production observation period',
    locator:'PDF page indices 2-4 and 6: Q1-Q3, Q19, Q24, Q29-Q30 and Q39-Q42; repeated revision footer',
    access:'Ten-page PDF text retrieved; complete relevant page text inspected. Page-image requests at indices 2, 4 and 6 returned Internal Error; visual verification unavailable.',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'The clauses specify traceability, change approval, nonconformance handling and conditional quality requirements. They describe required controls, not observed compliance or measured line results.',
    limitation:'Do not treat a required capability threshold as an achieved value. Extracted page numbering differs from the PDF page count; no visually verified layout, signed supplier acceptance or completed surveillance audit is claimed.'
  },
  {
    check_id:'207-CHECK-ISLAND-CERTIFICATION-PAGE', source_ids:['source-56d-island-components-certifications-2026'],
    url:'https://islandcomponents.com/about/certifications/', issuer:'Island Components Group',
    artifact_date:'No revision date displayed; tool labels the retrieved page with an older crawl',
    observation_period:'Certification listings and links at retrieval; no verified certificate-validity or surveillance period',
    locator:'USA Certifications; group-level LISK and Ireland sections; Hauppauge footer and ISO 9001:2015/AS9100D link',
    access:'Company page text retrieved from tool cache', evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The page mixes group-level certification descriptions with an Island Components footer and certificate link. Those descriptions cannot all be assigned to the Hauppauge facility.',
    limitation:'A footer and link are not independent proof of a facility-specific current certificate, surveillance findings, or output performance. Do not infer every listed group certification applies to Island Components.'
  },
  {
    check_id:'207-CHECK-ISLAND-CERTIFICATE-IMAGE', source_ids:['source-56d-island-components-certifications-2026'],
    url:'https://islandcomponents.com/wp-content/uploads/2024/10/AS9100-ISO9001-Certification-2024-2027.pdf', issuer:'File linked by Island Components Group; certificate issuer not independently inspected',
    artifact_date:'Printed issue and expiry dates unverified; filename is not proof of either',
    observation_period:'Certificate scope and validity interval unverified',
    locator:'Certificate link in the inspected company-page footer; one-page PDF',
    access:'PDF returned zero extracted text lines; page-image request returned Internal Error', evidence_role:'Linked exact certificate; incomplete inspection', access_result:'Unreadable artifact',
    finding:'The linked certificate could not be read in this tool session.',
    limitation:'No issuer, facility scope, current validity, approval or surveillance result is inferred from the filename or the rendering failure.'
  },
  {
    check_id:'207-CHECK-MONAGHAN-TPLC-BOUND-QUERY', source_ids:['source-56d-monaghan-fda-tplc-2025'],
    url:'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfTPLC/tplc.cfm?ID=82&manufacturer=MONAGHAN+MEDICAL+CORPORATION&min_report_year=2017&pmndecision=SUBSTANTIALLY+EQUIVALENT', issuer:'U.S. Food and Drug Administration',
    artifact_date:'Original query response not retrieved; inherited 2025 label is not verified here', observation_period:'Original query specifies min_report_year=2017; actual returned cohort not inspected',
    locator:'Exact URL bound in the inherited source profile', access:'Retrieval returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The exact inherited FDA query could not be inspected.',
    limitation:'No event count, zero-event finding, manufacturer attribution, completeness, defect rate or same-line outcome follows from this failure.'
  },
  {
    check_id:'207-CHECK-MONAGHAN-TPLC-ALTERNATE-2011', source_ids:['source-56d-monaghan-fda-tplc-2025'],
    url:'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfTPLC/tplc.cfm?ID=82&manufacturer=MONAGHAN+MEDICAL+CORPORATION&min_report_year=2011&pmndecision=SUBSTANTIALLY+EQUIVALENT', issuer:'U.S. Food and Drug Administration',
    artifact_date:'Dynamic query; search and opened cached representations differed, so a stable response vintage is not established',
    observation_period:'Different lower-year query; product-code CAF display with premarket and MDR sections',
    locator:'Device/product-code heading; multiple-manufacturer premarket table; separate MDR year table',
    access:'Alternative official query retrieved; not substituted for the failed 2017 query', evidence_role:'Different query - contextual only', access_result:'Text inspected',
    finding:'The alternate response includes multiple manufacturers and separate premarket and MDR sections. A manufacturer parameter in its URL is not sufficient to assign every displayed count to that manufacturer.',
    limitation:'Different query parameters and cached representations are not compatible repeats. No numerical series is copied, reconciled or admitted from this alternative.'
  },
  {
    check_id:'207-CHECK-MONAGHAN-TPLC-ALTERNATE-2019', source_ids:['source-56d-monaghan-fda-tplc-2025'],
    url:'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfTPLC/tplc.cfm?ID=82&manufacturer=MONAGHAN+MEDICAL+CORPORATION&min_report_year=2019&pmndecision=SUBSTANTIALLY+EQUIVALENT', issuer:'U.S. Food and Drug Administration',
    artifact_date:'Search representation available; exact opened response unavailable', observation_period:'Different lower-year query; not the inherited 2017 query',
    locator:'Official search result; attempted direct open', access:'Direct open returned Internal Error / Cache miss; search representation not used as a numerical observation',
    evidence_role:'Different query - contextual only', access_result:'Retrieval failed',
    finding:'The second alternative query was not successfully opened.', limitation:'A search snippet does not reproduce the exact query or establish a usable manufacturing or safety measure.'
  },
  {
    check_id:'207-CHECK-FDA-MDR-METHOD', source_ids:['source-56d-monaghan-fda-tplc-2025'],
    url:'https://www.fda.gov/medical-devices/mandatory-reporting-requirements-manufacturers-importers-and-device-user-facilities/about-manufacturer-and-user-facility-device-experience-maude-database', issuer:'U.S. Food and Drug Administration',
    artifact_date:'Methodology page inspected on 2026-09-14; publication date not established from the inspected section',
    observation_period:'Reporting-system methodology, not a company or product observation', locator:'Limitations of Medical Device Reports (MDRs)',
    access:'Official methodology text retrieved', evidence_role:'Authority methodology - contextual only', access_result:'Text inspected',
    finding:'FDA explains that MDR reports alone cannot establish incidence, comparative event rates or causation because reporting, verification and use-exposure information are limited.',
    limitation:'This methodology is not a finding about Monaghan, its products or a particular event. It does not resolve the failed bound query or a manufacturer-specific denominator.'
  }
];

export const manufacturingResearchReviews = [
  {
    backlog_item_id:'182-BACKLOG-013', review_id:'207-BACKLOG-013-2026-09-14',
    check_ids:['207-CHECK-CURRENT-CAPABILITIES','207-CHECK-CURRENT-CFA-19418','207-CHECK-ISLAND-ACQUISITION','207-CHECK-ISLAND-CAPABILITIES','207-CHECK-MONAGHAN-ISO14001','207-CHECK-MONAGHAN-PROFILE'],
    finding:'The six bound pages support separately attributed capability, grant-status, acquisition and certification statements. They do not isolate the cause or persistence of a production change. The acquisition narrative and current footer also refer to different locations; continuity needs explicit evidence.',
    recommendation:'Retain the causal-inference hold. Narrow any absence statement to the inspected artifacts; do not equate cancelled grant funding, a capability list or a certification announcement with all investment or operating outcomes.',
    next_action:'Have the evidence editor disposition the bounded claim; seek dated same-line outputs and inputs, locate any actual grant-status decision date, and reconcile facility/line continuity before causal analysis.',
    next_check_date:'2026-09-21'
  },
  {
    backlog_item_id:'182-BACKLOG-017', review_id:'207-BACKLOG-017-2026-09-14',
    check_ids:['207-CHECK-CURRENT-TEAM','207-CHECK-CURRENT-OSHA-314347824'],
    finding:'The issuer team page and OSHA inspection agree on a company name/address, but the inspection opened in 2010 and closed in 2011. This is a bounded identity cross-check, not a compatible later line-output or labor observation.',
    recommendation:'Retain the repeat-outcome hold and narrow entity continuity to the actual matching identifiers. Neither a current team page nor a historical inspection establishes persistent line performance or current safety.',
    next_action:'Obtain dated observations for the exact production line and labor, quality, demand and capital inputs; independently reconcile identity and timing before the authorized disposition.',
    next_check_date:'2026-09-21'
  },
  {
    backlog_item_id:'182-BACKLOG-018', review_id:'207-BACKLOG-018-2026-09-14',
    check_ids:['207-CHECK-ISLAND-QF36-REVF','207-CHECK-ISLAND-CERTIFICATION-PAGE','207-CHECK-ISLAND-CERTIFICATE-IMAGE'],
    finding:'Readable supplier clauses describe control requirements, not achieved production results. The certificate itself could not be inspected, and the listing mixes group and facility context; exact current certificate scope and validity remain unverified.',
    recommendation:'Retain the repeat-outcome hold. Do not turn required supplier controls into compliance findings or a certificate filename into verified issue/expiry dates.',
    next_action:'Inspect the actual certificate and relevant clause pages in a supported readable view, resolve its issuer/facility/scope/validity, obtain surveillance and dated same-line outcome evidence, then seek authorized disposition.',
    next_check_date:'2026-09-21'
  },
  {
    backlog_item_id:'182-BACKLOG-019', review_id:'207-BACKLOG-019-2026-09-14',
    check_ids:['207-CHECK-CURRENT-TEAM','207-CHECK-CURRENT-OSHA-314347824','207-CHECK-ISLAND-QF36-REVF','207-CHECK-ISLAND-CERTIFICATION-PAGE','207-CHECK-ISLAND-CERTIFICATE-IMAGE','207-CHECK-MONAGHAN-TPLC-BOUND-QUERY','207-CHECK-MONAGHAN-TPLC-ALTERNATE-2011','207-CHECK-MONAGHAN-TPLC-ALTERNATE-2019','207-CHECK-FDA-MDR-METHOD','207-CHECK-MONAGHAN-ISO14001'],
    finding:'Roles, historical enforcement, supplier requirements and certification announcements remain unlike measures. The bound FDA query failed; alternate query scopes and cached representations are not replacements, and no displayed MDR count is admitted as a manufacturer defect rate or line result.',
    recommendation:'Retain the alternative-explanation hold with explicit query and rendering blockers. Limit negative claims to this checked set; no inference of nonexistent records, safety, defect rate or causal effect is authorized.',
    next_action:'Recover the exact original query and readable certificate; reconcile product/manufacturer/facility identity, observation and reporting periods, stable response provenance, and exposed production/use denominators before independent review and authorized disposition.',
    next_check_date:'2026-09-21'
  }
];
