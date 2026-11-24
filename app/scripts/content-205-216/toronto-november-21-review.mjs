// Actual November 21 official-source review; generation is not a new inspection.
export const torontoReviewDate='2026-11-21';
export const priorOperationsPayloadSha256='4e2b9a87302dd22c776cc405d10ca73f3bf23551b2e49c15c4f5d8b05029f8ae';
export const priorOperationsSnapshot=operations=>({...operations,as_of_date:'2026-09-28',receipts:operations.receipts.filter(r=>r.checked_date<torontoReviewDate)});
export const cycleLedgerPayloadSha256='4d99f72ea2802992bd33b1e2acc6bebd749249e081d09145a573873370993302';
// A later independent cycle review may append history; this project review did not.
export const cycleLedgerSnapshot=ledger=>({...ledger,as_of_date:torontoReviewDate,receipts:ledger.receipts.slice(0,12)});
const check=(url,access,artifact_date,finding,locator)=>({url,access,artifact_date,finding,locator,checked_date:torontoReviewDate});
export const torontoNovember21Review={
 receipt_id:'207-TORONTO-2026-11-21-BOUNDED-BLOCKER',
 file_id:'61-PROJECT-TORONTO-24-254930',
 prior_receipt_id:'207-TORONTO-2026-09-28-BOUNDED-BLOCKER',
 prior_receipt_sha256:'6ee2497ae735dbe731d8d8aae1af7f2a6ca61b1dea5fd157b9186ee6b288e386',
 original_scheduled_date:'2026-09-09',
 scheduled_date:'2026-10-05',
 checked_date:torontoReviewDate,
 decision:'Bounded access blocker; preserve adoption with conditions and distinguish an older investigatory licence',
 decision_status:'blocked',
 receipt_type:'Watch Note',
 source_checks:[
  check('https://secure.toronto.ca/council/agenda-item.do?item=2026.SC33.9','Official Council item text inspected November 21','2026-07-29/2026-07-30 Council meeting','The July adoption and condition 8 remain in the retrieved decision text. This historical record does not determine whether its wind, land-exchange or laneway conditions were subsequently satisfied.','Tracking status; City Council decision, condition 8'),
  check('https://secure.toronto.ca/nm/api/individual/notice/7606.do','Official notice text inspected November 21','2026-06-18 notice; 2026-07-09 meeting','Confirms application 24 254930 ESC 20 OZ and its eight named addresses, not a later enactment or permit.','Application number; meeting date; affected locations; signed notice date'),
  check('https://www.toronto.ca/city-government/planning-development/application-details/?id=5562023&pid=7609&title=507,-511,513-VICTORIA-PARK-AVE-AND-4,6,7,11,14-THORA-AVE&WT.rd_id=%2F507VictoriaParkAve','Text-reader retrieval unavailable November 21',null,'The tool reported that the exact application URL was not accessible. No current milestones, document listings or document bodies were inspected. September portal observations remain historical.','Exact application URL; tool access result'),
  check('https://secure.toronto.ca/ApplicationStatus/setup.do?action=init','Unsubmitted official permit form retrieved November 21',null,'No address query was submitted. Form fields and placeholders are not search results. No September permit result is reused as a current finding.','Application-number and address fields; Search control'),
  check('https://www.toronto.ca/legdocs/bylaws/lawlists.htm','Official by-law lookup shell retrieved November 21',null,'The text reader exposed the year/number controls and a JavaScript notice, not a year-filtered by-law inventory. Indexed search text was not treated as a complete list or proof of absence.','By-law year and number controls; JavaScript notice'),
  check('https://open.toronto.ca/dataset/building-permits-active-permits/','Official dataset page shell retrieved November 21',null,'The retrieved page did not expose resource records or usable refresh metadata. No address filter, API query or permit-row inspection was performed.','Resources and refresh headings without data; separate third-party gallery'),
  check('https://open.toronto.ca/dataset/building-permits-cleared-permits/','Official dataset page shell retrieved November 21',null,'The retrieved page did not expose resource records or usable refresh metadata. No cleared-permit query or row inspection was performed; gallery descriptions do not establish a project permit.','Resources and refresh headings without data'),
  check('https://www.toronto.ca/wp-content/uploads/2025/10/867c-2025-3146-Thora-Ave.pdf','Official PDF text inspected November 21; page-image requests failed with Cache miss','Prepared 2025-09-26; specified licence term 2025-10-01 through 2026-01-31','DAF 2025-314 concerns authority for investigatory boreholes and monitoring wells at part of 6 Thora Avenue while land-exchange negotiations were ongoing. It is older scope context, not proof of later exchange completion, enacted amendments, accepted conditions or a building permit.','Page 1 Purpose, Comments and preparation date; page 4 Appendix A term/use. No signature, map or visual verification'),
  check('https://www.toronto.ca/business-economy/doing-business-with-the-city/real-estate-services-delegated-approval-forms/other-real-estate-transactions/','Official index targeted text search November 21','Page modified 2026-10-28; returned Thora entry under 2018','The returned Thora match concerns 2 Thora Avenue in an older index section. It was excluded as a different property and instrument, not transferred into this project.','Thora text match; 2018 section; page modification date'),
 ],
 permit_address_checks:[],
 open_data_permit_queries:[],
 bounded_searches:[
  {query:'site:toronto.ca "24 254930" bylaw',result:'Exact application notice and Council records; no later qualifying enactment retrieved.'},
  {query:'site:toronto.ca "SC33.9" "2026" enacted',result:'Historical Council material and unrelated reuse of the item number; no cross-year identity transfer.'},
  {query:'site:toronto.ca/legdocs/bylaws/2026/ "Thora"',result:'No exact amendment instrument retrieved in this bounded search; not evidence of nonexistence.'},
  {query:'site:secure.toronto.ca/council "2026" "Thora" "surplus"',result:'Council conditions and older investigatory-licence context; no accepted completion instrument retrieved.'},
  {query:'site:toronto.ca "24 254930" "permit"',result:'Planning application language, not an identified building-permit result.'},
  {query:'site:open.toronto.ca dataset building permits active permits Toronto API',result:'Official active/cleared dataset pages located; direct text reads exposed no resource records.'},
 ],
 dated_artifact_context:{
  artifact_id:'DAF-2025-314',url:'https://www.toronto.ca/wp-content/uploads/2025/10/867c-2025-3146-Thora-Ave.pdf',
  preparation_date:'2025-09-26',specified_effective_date:'2025-10-01',specified_term_end:'2026-01-31',retrieved_date:torontoReviewDate,
  matched_property:'6 Thora Avenue',whole_project_scope:false,visual_review_complete:false,signature_verified:false,
  permitted_activity_scope:'Investigatory boreholes, monitoring wells and ancillary works on a limited licensed area',
  does_not_establish:['Completed land exchange','Laneway acquisition','Accepted pre-enactment conditions','Enacted project amendments','Project building permit','Investigations actually performed'],
 },
 search_scope:'November 21 text review of the exact Council item and notice, attempted exact application portal, unsubmitted permit form, by-law lookup shell, two official open-data permit catalog pages, targeted real-estate index search and DAF 2025-314 text. PDF page-image requests failed with Cache miss. No permit address/API query, filtered permit dataset, complete year-by-law inventory, current portal documents, signature/map review or browser automation was performed. Search results were used as discovery, not as complete negative coverage. The aggregate development-pipeline source was not refreshed.',
 bounded_finding:'November 21 review retains the established adoption-with-conditions stage. No later qualifying enactment, condition-acceptance instrument or exact-project permit was retrieved within the stated scope. Current portal and permit-record verification remains access-limited. The older 6 Thora investigatory-licence record does not satisfy those later requirements. These limits do not prove that a qualifying instrument or permit does not exist.',
 next_check_date:'2026-11-29',
 next_action:'On November 29, retry the exact official project and clerk/building records, or reopen earlier for a newly discovered same-file instrument. Seek amendment numbers, dated authority acceptance of the wind/land-exchange/laneway conditions, or an exact permit identifier and scope. Use an accessible official permit resource if available, with its coverage and query recorded. Do not reuse September searches, substitute an investigatory licence or nearby property, or resume stopped browser automation without explicit permission. This is an editorial appointment, not an agency publication forecast.',
 update_id:'update-2026-11-21-toronto-bounded-project-check',
 update_title:'Toronto 24 254930: dated follow-up retains the project stage and records access limits',
};
