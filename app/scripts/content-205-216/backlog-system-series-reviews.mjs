// Official-source research inspected September 14, 2026 (America/Edmonton).
// These checks inform an editor; they do not supply independent admission.
const exact = (id, sources, url, issuer, date, period, locator, finding, limitation, access = 'Relevant landing-page text inspected; linked full report not independently reviewed') => ({
  check_id: `207-CHECK-SYSTEM-${id}`, source_ids: sources, url, issuer,
  artifact_date: date, observation_period: period, locator, access,
  evidence_role: 'Exact bound source', access_result: 'Text inspected', finding, limitation
});
const gao = (id, source, report, date, period, locator, finding, limitation) => exact(id, [source], `https://www.gao.gov/products/${report}`, 'U.S. Government Accountability Office', date, period, locator, finding, limitation);
const eia = (id, source, article, date, period, finding, limitation) => exact(id, [source], `https://www.eia.gov/todayinenergy/detail.php?id=${article}`, 'U.S. Energy Information Administration', date, period, 'Article dateline, body, measure definitions and source captions', finding, limitation, 'Article text inspected; underlying data files and chart images not independently reproduced');
const nasaLegacy = ['source-56a-nasa-ai-use-cases-2022', 'source-56a-nasa-ai-use-cases-2023'];
const waterSources = ['source-56a-epa-water-reuse-year-two', 'source-56a-epa-water-reuse-year-three', 'source-56a-epa-water-reuse-year-four'];
const waterIndex = 'https://www.epa.gov/waterreuse/national-water-reuse-action-plan-annual-progress-updates';
const annualArchive = 'https://www.eia.gov/electricity/annual/archive/2023/';

export const systemSeriesArtifactChecks = [
  ...[
    ['2021', 'https://www.whitehouse.gov/wp-content/uploads/2022/09/FY2021-FISMA-Report-to-Congress.pdf'],
    ['2022', 'https://www.whitehouse.gov/wp-content/uploads/2023/05/FY22-FISMA-Report.pdf'],
    ['2023', 'https://www.whitehouse.gov/wp-content/uploads/2024/06/FY23-FISMA-Report.pdf']
  ].map(([year, url]) => ({
    check_id: `207-CHECK-SYSTEM-OMB-${year}`, source_ids: [`source-56a-omb-fisma-fy${year}`], url,
    issuer: 'Office of Management and Budget / White House', artifact_date: 'Exact PDF publication date not verified',
    observation_period: `Intended fiscal ${year} report; contents not inspected`, locator: 'Exact bound FISMA PDF URL',
    access: 'Retrieval returned not safe to open (non-retryable error); stopped without retry or workaround',
    evidence_role: 'Exact bound source', access_result: 'Retrieval failed',
    finding: 'The bound report could not be inspected in this check.',
    limitation: 'No report value, methodology change, currency or nonexistence finding is extracted. Separate GAO findings do not stand in for the unread OMB report.'
  })),
  gao('CYBER-RESPONSE-2022', 'source-56a-gao-solarwinds-exchange-response-2022', 'gao-22-104746',
    'Published/publicly released January 13, 2022', 'Two historical incident responses; recommendation status as of November 2021',
    'Highlights: interagency incident coordination and recommendation context',
    'GAO describes SolarWinds and Microsoft Exchange response coordination and says about 900 of roughly 3,700 cybersecurity recommendations since 2010 were not fully implemented as of November 2021.',
    'This historical recommendation universe is not an annual incident count or the same subset as later public-only, challenge-specific reports. Do not calculate closures by subtracting differently scoped totals or infer an AI benefit.'),
  gao('CYBER-FEDERAL-2023', 'source-56a-gao-federal-systems-high-risk-2023', 'gao-23-106428',
    'Published/publicly released January 31, 2023', 'December 2022 recommendation snapshot; repeated fiscal 2020 effectiveness evidence',
    'Highlights: securing federal systems and information, public recommendations and FISMA findings',
    'The report identifies 712 public recommendations since 2010 in one cybersecurity challenge area, about 21% not implemented as of December 2022. It repeats the fiscal 2020 finding that seven of 23 civilian agencies had effective programs.',
    'One challenge area is not the later four-area universe. Publication in 2023 does not create a new effectiveness observation; the seven-of-23 result refers back to fiscal 2020.'),
  gao('CYBER-HIGH-RISK-2024', 'source-56a-gao-cyber-high-risk-2024', 'gao-24-107231',
    'Published/publicly released June 13, 2024', 'May 2024 recommendation snapshot; fiscal 2022 incident count separately reported',
    'Highlights: four challenge areas, ten actions and public recommendation counts',
    'GAO reports 1,610 public recommendations across four challenge areas, with 1,043 implemented and 567 not implemented as of May 2024. Its 30,659 reported IT security incidents concern fiscal 2022, a different measure and period.',
    'The broader recommendation universe cannot be pooled with the 712 federal-systems subset or treated as evidence of worsening incident performance. Recommendations, incidents and agency program ratings have distinct denominators.'),
  gao('FISMA-PRELIMINARY-2020', 'source-56a-gao-fisma-effectiveness-fy2020', 'gao-22-105637',
    'Published/publicly released January 11, 2022', 'Fiscal 2020 program ratings; preliminary testimony',
    'Highlights: preliminary findings, IG assessments and interviews',
    'Inspectors general rated seven of 23 civilian CFO Act agency programs effective and sixteen ineffective. Seventeen of the 23 did not fully meet separate performance targets. Interviews covered 24 agencies including Defense.',
    'The interview denominator of 24 is not the performance denominator of 23. Preliminary testimony is not an additional annual outcome observation separate from the completed March report.'),
  gao('FISMA-COMPLETE-2020', 'source-56a-gao-fisma-implementation-2022', 'gao-22-104364',
    'Published/publicly released March 31, 2022; recommendation comments include August 2026',
    'Fiscal 2020 effectiveness; later recommendation follow-up separately dated',
    'Highlights, methods summary and both recommendation status/comment blocks',
    'The completed report repeats seven of 23 effective programs for fiscal 2020. Recommendation 1 is Closed - Implemented following 2025 risk-based assessment guidance. Recommendation 2 remains Open; its August 2026 comment says no supporting update was provided on a more precise rating scale.',
    'The two 2022 publications share an observation year. Closure of one recommendation does not close the other or prove lower incident rates, and 24 interviewed agencies must not replace the 23 civilian assessment population.'),
  gao('FISMA-EFFECTIVENESS-2022', 'source-56a-gao-fisma-effectiveness-fy2022', 'gao-24-106291',
    'Published/publicly released January 9, 2024; displayed follow-up comments dated February 2025',
    'Fiscal 2022 program assessments; later recommendation comments are not new program measurements',
    'Highlights, agency coverage, metrics concerns and both recommendation blocks',
    'IGs rated eight of 23 civilian agency programs effective and fifteen ineffective for fiscal 2022. Defense performance data were excluded because classified, while 24 agencies contributed perspectives. Both listed recommendations display Open with February 2025 comments.',
    'The displayed historical comment date is not a September 2026 action date. The reported seven-to-eight difference alone does not establish a comparable improvement in security: rating methods, risks, scale and performance-target concerns require reconciliation. Restricted data are not reconstructed.'),
  exact('NASA-LEGACY-LANDING', nasaLegacy, 'https://www.nasa.gov/organizations/ocio/dt/ai/', 'NASA',
    'Exact page update not established', 'Current AI article listing, not verified 2022 or 2023 inventory rows',
    'AI page main listing and link to the 2024 use-case article',
    'The single URL shared by the two historical profiles currently serves an AI article listing. No archived 2022 or 2023 inventory rows were verified in that listing.',
    'This is one shared endpoint check, not two recovered annual inventories. It does not establish that historical inventories are unavailable elsewhere or supply counts or measured benefits.',
    'Relevant page listing inspected; no historical inventory file retrieved'),
  exact('NASA-2024-ARTICLE', ['source-56a-nasa-ai-use-cases-2024'], 'https://www.nasa.gov/organizations/ocio/dt/ai/2024-ai-use-cases/', 'NASA',
    'Published January 7, 2025', 'Description of the 2024 active AI use-case inventory',
    'Article dateline and body, including its 2024 inventory link',
    'The article describes uses such as rover autonomy and planning and links to an inventory. Statements about responsible, safe and effective use are NASA assertions, not independently quantified benefit findings.',
    'An explanatory article is not the inventory table. Do not count examples as the full population or treat agency assurance as independent outcome verification.',
    'Article text and inventory link inspected'),
  {
    check_id: '207-CHECK-SYSTEM-NASA-INVENTORY-LINK', source_ids: ['source-56a-nasa-ai-use-cases-2024'],
    url: 'https://www.nasa.gov/ai-inventory/', issuer: 'NASA',
    artifact_date: 'Listed FY26 files dated May 14, 2026 and April 2, 2026',
    observation_period: 'Current listing of 2026 individual and collective use cases; not the archived 2024 inventory',
    locator: 'All 2026 NASA AI Inventory Lists heading and two spreadsheet listings',
    access: 'Linked landing-page text inspected; spreadsheets not opened or counted',
    evidence_role: 'Official linked inventory landing page', access_result: 'Text inspected',
    finding: 'The January 2025 article inventory link now opens a listing for 2026 individual and collective use cases, demonstrating a reporting-vintage mismatch at the rolling destination.',
    limitation: 'The 2026 listing is not a recovered 2024 inventory or proof that the old file does not exist. No row-level reconciliation, inventory growth calculation or outcome attribution is made.'
  },
  eia('BATTERY-2021', 'source-56a-eia-battery-capacity-2021', '51798', 'Published March 25, 2022',
    'End-2021 preliminary power capacity; duration/application evidence from end-2020; later additions are plans',
    'The article reports 4,605 MW of battery storage at the end of 2021, but its energy-duration and application discussion uses 2020 data. The approximate three-hour duration is therefore not a measured end-2021 fleet value.',
    'MW power capacity and MWh energy capacity are not interchangeable. Multiple applications and projected installations are not measured availability, realized cycle frequency or causal reliability improvement.'),
  eia('BATTERY-2022', 'source-56a-eia-battery-capacity-2022', '54939', 'Published December 8, 2022',
    'Operating October 2022 snapshot; remaining-year and 2025 quantities are forecasts',
    'The reported 7.8 GW was operating in October 2022; another 1.4 GW was expected by year end. The 30 GW headline for 2025 was a forecast.',
    'October is not a year-end observation. Do not add expected capacity to operating capacity as a realized total, or convert the 2025 forecast into actual capacity merely because that date has passed.'),
  eia('BATTERY-2023', 'source-56a-eia-battery-capacity-2023', '62405', 'Published June 25, 2024',
    'End-2023 early EIA-860 release; later installation plans separately stated',
    'The article reports 575 batteries totaling 15,814 MW at end-2023. For the first time respondents identified a primary purpose; earlier reporting allowed multiple uses. The 10,487 MW assigned primarily to arbitrage is capacity, not earned revenue.',
    'The new primary-purpose field breaks an unqualified application-share comparison. Historical early-release totals need revision control; capacity additions do not measure energy delivered, profit, safety or avoided outages.'),
  eia('OUTAGES-2021', 'source-56a-eia-outage-duration-2021', '54639', 'Published November 14, 2022',
    'Calendar 2021 customer interruption experience',
    'EIA reports just over seven hours of interruptions for the average customer in 2021 and about two hours after excluding major events. SAIDI measures non-momentary interruption duration; SAIFI measures frequency.',
    'National customer averages are not asset availability or a battery performance measure. Weather, vegetation and utility practices affect the observations; no causal battery contribution is isolated.'),
  eia('OUTAGES-2022', 'source-56a-eia-outage-duration-2022', '61303', 'Published January 25, 2024',
    'Calendar 2022 customer interruption experience',
    'The headline reports approximately five-and-one-half hours; the body gives 5.6 hours and 1.4 interruptions per customer. Excluding major events leaves about two hours. EIA attributes the decline principally to fewer major events.',
    'Preserve rounding and event exclusions rather than treating differently rounded values as separate observations. An annual distribution-system average cannot demonstrate the effect of a named storage installation.'),
  exact('EIA-ANNUAL-BOUND', ['source-56a-eia-outage-duration-2023'], 'https://www.eia.gov/electricity/annual/', 'U.S. Energy Information Administration',
    'Release October 16, 2025; next release shown as October 2026', 'Rolling annual page currently contains data for 2024',
    'Report heading, previous-issues links and distribution reliability table catalog',
    'The URL assigned to the 2023 source now identifies data for 2024. A previous-issues link leads to a separate 2023 archive.',
    'A working rolling URL is not a fixed 2023 artifact. The current 2024 tables were not silently substituted for the assigned vintage.',
    'Heading and relevant catalog/previous-issues text inspected'),
  {
    check_id: '207-CHECK-SYSTEM-EIA-2023-ARCHIVE', source_ids: ['source-56a-eia-outage-duration-2023'], url: annualArchive,
    issuer: 'U.S. Energy Information Administration', artifact_date: 'Release October 17, 2024', observation_period: 'Data for 2023',
    locator: 'Archive heading, Table 11.1 link and Technical notes PDF link',
    access: 'Archive heading and relevant catalog inspected; linked technical-notes retrieval returned Internal Error with no target URL supplied',
    evidence_role: 'Official linked historical archive', access_result: 'Text inspected; linked file retrieval failed',
    finding: 'The linked archive explicitly identifies 2023 data and separates IEEE-based and any-method reliability tables.',
    limitation: 'The technical-notes PDF was not read and its URL is not invented. The table-specific footnotes are separately inspected; no complete underlying utility-data review is claimed.'
  },
  {
    check_id: '207-CHECK-SYSTEM-EIA-2023-TABLE', source_ids: ['source-56a-eia-outage-duration-2023'],
    url: `${annualArchive}table.php?t=epa_11_01.html`, issuer: 'U.S. Energy Information Administration',
    artifact_date: 'Archive release October 17, 2024', observation_period: '2013-2023 annual distribution-system metrics in one archive vintage',
    locator: 'Table 11.1, grouped headers, 2021-2023 rows and definitions/event-exclusion footnotes',
    access: 'HTML table text, grouped headers and footnotes inspected; independent row reproduction still pending',
    evidence_role: 'Official linked historical table', access_result: 'Text inspected',
    finding: 'For 2023, any-method SAIDI is 342 minutes with all events and 118.4 without major events; IEEE values are 366.6 and 123.9 respectively. Any-method pools utilities using IEEE and other methods. IEEE major-event days use a five-year threshold; other utilities define their own major events.',
    limitation: 'Do not mix method columns, minutes with hours, or loss-of-supply removal with major-event exclusion. The archive offers a candidate descriptive series, not an independently admitted panel, common asset denominator or causal battery comparison.'
  },
  exact('EPA-WRAP-INDEX', waterSources, waterIndex, 'U.S. Environmental Protection Agency',
    'Page last updated March 6, 2026', 'Annual WRAP publication catalog',
    'Five annual update listings and Year 2, Year 3 and Year 4 PDF links',
    'One shared index links the three distinct annual progress documents assigned to these profiles. It is not itself a measured annual water-volume series.',
    'Count this as one shared endpoint check, not three separate reports. The catalog does not establish the absence of other publications or that all proposed actions have been completed.',
    'Complete index text and target links inspected'),
  ...[
    ['TWO', waterSources[0], 'https://www.epa.gov/system/files/documents/2022-03/wrap-annual-update_2022.pdf', 'March 2022; EPA-820-F-22-001', 'Year 2 cumulative program activity since 2020', 'Two pages: overview, implementation-milestone graphic labels, output examples and footer',
      'EPA reports 116 partners, 50 actions, 267 finished milestones and five completed actions. The graphic separately gives 422 total implementation milestones; that total is not a completed-milestone count.',
      'Program actions, partners, milestones, resources and project examples have different units. They do not establish a national metered reuse-volume denominator. Funding and capacity examples must not be summed as completed output.', 'First-page screenshot returned Internal Error'],
    ['THREE', waterSources[1], 'https://www.epa.gov/system/files/documents/2023-03/WRAP-Year3-Update.pdf', 'March 2023; EPA-822-S-23-002', 'Year 3 cumulative activity; past-year completions separately identified', 'Four pages: overview, funding/output examples and completed-action list',
      'EPA describes more than 60 actions, thirteen concluded actions, over 100 outputs and over 130 collaborators. The last page separately celebrates eight actions completed during the past year.',
      'Thirteen cumulative completions and eight past-year completions are not competing annual totals. Awards, available funding and projected water savings do not establish delivered national reuse volume; unextracted chart numbers are not reconstructed.', 'First-page screenshot returned Internal Error'],
    ['FOUR', waterSources[2], 'https://www.epa.gov/system/files/documents/2024-03/13546_wrap-yr4-update_v13.pdf', 'March 2024; EPA-820-S-24-001', 'Year 4 cumulative program activity and separately described proposed investments', 'Four pages: overview, five impact areas, completed actions and future federal commitments',
      'EPA reports 157 organizations, 69 actions and more than 170 resources. The document mixes completed activities with funding availability, planned awards and future reports, each needing its own status.',
      'Resource production is not a metered water-performance series. Funding eligibility is not disbursement, proposed awards are not completed infrastructure, and named case-study examples do not establish national totals.', 'First-page screenshot returned a reference without an inspectable image']
  ].map(([id, source, url, date, period, locator, finding, limitation, visual]) => ({
    check_id: `207-CHECK-SYSTEM-EPA-WRAP-${id}`, source_ids: [source], url, issuer: 'U.S. Environmental Protection Agency',
    artifact_date: date, observation_period: period, locator,
    access: `Extracted text inspected across the document. ${visual}; no visual verification claimed`,
    evidence_role: 'Official linked annual progress PDF', access_result: 'Text inspected; visual check unavailable', finding, limitation
  })),
  ...[
    ['2023', '2022 world mineral production', 'The January 2023 catalog describes the earliest comprehensive production information for 2022, more than ninety commodity summaries and appendices defining units, terms, reserves and resources.', 'The linked View Report retrieval failed with Internal Error; no target URL was supplied.'],
    ['2024', '2023 world mineral production', 'The January 2024 catalog describes 2023 production and more than ninety commodity summaries. Its separate linked data release is labeled version 2.0, March 2024.', 'The linked View Report retrieval failed with Internal Error; no target URL was supplied.'],
    ['2025', 'Publication vintage verified; commodity observation periods not verified from the unread report', 'The January 2025 catalog identifies the edition and a separate data release labeled version 2.0, April 2025. It provides no abstract reproducing the commodity tables.', 'Both View Report and Version History retrievals failed with Internal Error and no target URL supplied; the version-history error reference also returned a non-retryable failure.']
  ].map(([year, period, finding, linked]) => ({
    ...exact(`USGS-${year}`, [`source-56a-usgs-mcs-${year}`], `https://www.usgs.gov/publications/mineral-commodity-summaries-${year}`, 'U.S. Geological Survey',
      `Published January 31, ${year}`, period, 'Publication catalog identity, summary where present, data-release/version links', finding,
      'Catalog evidence is not a full commodity-table review. Do not conflate report editions with observation years or linked data-release revisions. No quantities, mine-level performance, cross-commodity denominator or absence finding is extracted from unread files.',
      `Relevant catalog text inspected. ${linked} No CSV files or full report tables inspected.`),
    access_result: 'Text inspected; linked file retrieval failed'
  }))
];

export const systemSeriesResearchReviews = [
  {
    backlog_item_id: '182-BACKLOG-002', review_id: '207-BACKLOG-002-2026-09-14',
    check_ids: ['OMB-2021','OMB-2022','OMB-2023','CYBER-RESPONSE-2022','CYBER-FEDERAL-2023','CYBER-HIGH-RISK-2024','FISMA-PRELIMINARY-2020','FISMA-COMPLETE-2020','FISMA-EFFECTIVENESS-2022','NASA-LEGACY-LANDING','NASA-2024-ARTICLE','NASA-INVENTORY-LINK'].map(id => `207-CHECK-SYSTEM-${id}`),
    finding: 'The AI/cyber composite combines different recommendation populations, repeated fiscal-year ratings and changing inventory destinations. Two 2022 FISMA publications describe the same fiscal 2020 result; later agency ratings are not incident outcomes. Three exact OMB PDFs remain unread, and NASA historical inventory rows were not recovered.',
    recommendation: 'Retain the cross-series and causal holds pending authorized disposition. Preserve narrow GAO findings and NASA self-attribution without inventing annual points or replacing inaccessible artifacts.',
    next_action: 'Obtain readable authorized copies of the exact OMB reports and fixed NASA inventory vintages. Reconcile recommendation scope and rating-method changes, reproduce comparable observations independently, and obtain evidence editor disposition separately.',
    next_check_date: '2026-09-21'
  },
  {
    backlog_item_id: '182-BACKLOG-003', review_id: '207-BACKLOG-003-2026-09-14',
    check_ids: ['BATTERY-2021','BATTERY-2022','BATTERY-2023','OUTAGES-2021','OUTAGES-2022','EIA-ANNUAL-BOUND','EIA-2023-ARCHIVE','EIA-2023-TABLE','EPA-WRAP-INDEX','EPA-WRAP-TWO','EPA-WRAP-THREE','EPA-WRAP-FOUR','USGS-2023','USGS-2024','USGS-2025'].map(id => `207-CHECK-SYSTEM-${id}`),
    finding: 'Battery capacity snapshots, national customer interruptions, reuse-program activities and mineral catalogs do not share an asset-level performance denominator. A fixed EIA 2023 table supplies a candidate descriptive reliability series with explicit method/event columns; it is not a storage-effect estimate. WRAP cumulative totals and unread mineral tables retain their limits.',
    recommendation: 'Retain the cross-domain performance and causal holds pending authorized disposition. Allow only separately attributed descriptive findings; no governed series is admitted by this research pass.',
    next_action: 'Independently reproduce a fixed EIA table and its customer/method coverage, reconcile capacity vintages and purpose-field changes, obtain readable exact mineral reports and revision histories, and seek observed water output with system boundaries. Obtain the required editor and independent series reviews.',
    next_check_date: '2026-09-21'
  }
];
