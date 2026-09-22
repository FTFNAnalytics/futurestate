// Official artifacts inspected September 14, 2026, America/Edmonton.
// Research findings only: no independent admission, disposition or publication.
const check = (id, sources, url, issuer, date, period, locator, finding, limitation, options = {}) => ({
  check_id: `207-CHECK-PROGRAM-${id}`, source_ids: sources, url, issuer,
  artifact_date: date, observation_period: period, locator, finding, limitation,
  access: 'Relevant page text inspected; linked data files not independently reproduced',
  evidence_role: 'Exact bound source', access_result: 'Text inspected', ...options
});
const pdf = (scope, visual, role = 'Exact bound source') => ({
  access: `Extracted PDF text inspected: ${scope}. ${visual}; no visual verification claimed`,
  evidence_role: role, access_result: 'Text inspected; visual check unavailable'
});
const failed = reason => ({access: reason, access_result: 'Retrieval failed'});
const linked = {evidence_role: 'Official linked supporting artifact'};
const mep = year => `source-56a-nist-mep-impact-fy${year}`;
const niimbl = ['2021-2022','2022-2023','2023-2024'].map(year => `source-56a-niimbl-annual-${year}`);
const asm = 'source-56a-census-asm-2021';
const aies = 'source-56a-census-aies-transition-2024';
const atcr = year => `source-56a-dot-atcr-${year}`;
const av = year => `source-56a-california-av-testing-${year}`;
const faa = [2022,2023,2024].map(year => `source-56a-faa-commercial-space-operations-fy${year}`);
const faaUrl = 'https://www.faa.gov/about/office_org/headquarters_offices/afn/offices/finance/offices/financial_management/ar/fy25-faa-agency-financial-report.pdf';
const nasa = year => `source-56a-president-aerospace-fy${year}`;
const manufIds = ['MEP-2021-BOUND','MEP-2021-ALTERNATE','MEP-2022','MEP-2024','USA-2020','USA-2021','USA-2022','NIIMBL-INDEX','NIIMBL-2024','ASM-INDEX','ASM-BENCHMARK','ASM-END','AIES-INDEX','AIES-SERIES','AIES-CHANGES-INDEX','AIES-CHANGES','AIES-METHOD-INDEX','AIES-METHOD'];
const transportIds = ['ATCR-2022','ATCR-2023','ATCR-2024','ATCR-FEB23-INDEX','ATCR-FEB23-PDF','ATCR-FEB24-INDEX','ATCR-FEB24-PDF','AV-2022','AV-2023','AV-2024','AV-LINK-DRIFT','FAA-BOUND','FAA-INDEXED','NASA-INDEX','NASA-2024'];

export const programTransportArtifactChecks = [
  check('MEP-2021-BOUND',[mep(2021)],'https://www.nist.gov/system/files/documents/2023/03/27/MEP%20Annual%20Report_FY21_WEB_FINAL_3_27_2023.pdf','NIST MEP',
    'Exact file publication date not verified','Intended FY2021 report; bound file unread','Exact bound PDF request',
    'The exact request returned 404 Not Found. A separately located official annual-report copy was readable.',
    'The failed endpoint does not establish report nonexistence or authorize assigning results from an unrelated case study.',failed('Exact PDF request returned 404 Not Found; no contents inspected')),
  check('MEP-2021-ALTERNATE',[mep(2021)],'https://www.nist.gov/mep/manufacturing-reports/nist-mep-publications/2021-nist-mep-annual-report','NIST MEP',
    'FY2021 edition; exact issuance date not verified','FY2021 client-reported impacts; CARES activity through 2021 separately described','Printed pages 6–7, impacts and CARES sections',
    'The report attributes $14.4 billion in new/retained sales and 125,746 created/retained jobs to client survey responses. Its 34,307 manufacturers interacted with are a broader reach count. CARES activity through 2021 includes 5,221 companies and 7,187 projects.',
    'Reach is not the survey-response denominator. Client-attributed impacts are not independently causal estimates; CARES totals have a separate window and potentially overlapping participants.',
    pdf('complete printed pages 6–7 of the 49-page official alternate copy','Page 6 screenshot returned Internal Error','Official alternate report copy')),
  check('MEP-2022',[mep(2022)],'https://www.nist.gov/system/files/documents/2024/08/15/MEP%20Annual%20Report_FY22_508.pdf','NIST MEP',
    'FY2022 edition; upload-path date is not verified issuance','FY2022 survey-attributed impacts; separate FY2021/FY2022 modeled returns and CARES totals','Cover, contents and printed pages 5–8, including impacts footnote',
    'The report separates over 33,500 manufacturers reached from survey-attributed $18.8 billion in sales and over 116,700 jobs created/retained. A footnote identifies an Inspector General inquiry into the economic metrics. The next page reports separately modeled economic returns.',
    'Do not substitute modeled jobs for survey-attributed jobs, add potentially overlapping CARES participants, or call the historical inquiry currently open without fresh disposition evidence.',
    pdf('cover, contents and complete printed pages 5–8 of 50 pages','Page 6 screenshot returned Internal Error')),
  check('MEP-2024',[mep(2023)],'https://www.nist.gov/system/files/documents/2025/03/20/NIST%20MEP-%20About%20the%20MEPNN%20508-2.pdf','NIST MEP',
    'FY2024 factsheet; exact publication date not printed in inspected text','FY2024 survey cohort, not FY2023','Both pages, FY2024 survey coverage and impact notes',
    'The factsheet says 11,734 clients were due for survey and 8,771 completed it. The inherited limitation reverses that relationship by calling 11,734 survey responses. The source identity ends fy2023 but the bound factsheet and existing display name concern FY2024.',
    'Preserve the original identity and flag the denominator error through the dated notice. The missing FY2023 observation remains missing. Rounded client-attributed impacts and satisfaction are not independently measured factory productivity.',
    pdf('both pages and all survey/rounding notes','Page 1 screenshot returned a reference without an inspectable image')),
  ...[
    ['2020','source-56a-manufacturing-usa-highlights-fy2020','manufacturing-usa-20192020-highlights-report','February 25, 2021; catalog updated November 29, 2022','2019/2020 report title; exact annual observation boundary not established','The abstract describes more than 1,900 members, but does not establish that every measure concerns FY2020 alone.','The linked Local Download request returned Internal Error without a target URL; the catalog separately displays a citation download URL. Full report not inspected.'],
    ['2021','source-56a-manufacturing-usa-highlights-fy2021','manufacturing-usa-highlights-report-2022','October 19, 2022; catalog updated November 29, 2022','FY2021 activity; report title 2022','The abstract explicitly assigns 16 institutes and more than 2,300 members to FY2021.','Linked full report not inspected.'],
    ['2022','source-56a-manufacturing-usa-annual-fy2022','manufacturing-usa-2023-annual-report','April 15, 2024; catalog updated May 6, 2024','FY2022 activity; report title 2023','The abstract explicitly assigns 17 institutes and more than 2,500 members to FY2022.','Linked full report not inspected.']
  ].map(([year,source,path,date,period,finding,access]) => check(`USA-${year}`,[source],`https://www.nist.gov/publications/${path}`,'NIST / Manufacturing USA',date,period,
    'Catalog publication date, report identity and complete abstract',finding,
    'Changing network membership is not a fixed facility cohort or a production-outcome series. Title, publication and observation years differ. NIIMBL is a member institute, so its activity must not be added without overlap controls.',
    {access:`Relevant catalog text inspected. ${access}`,access_result:year==='2020'?'Text inspected; linked file retrieval failed':'Text inspected'})),
  check('NIIMBL-INDEX',niimbl,'https://www.niimbl.org/about/','NIIMBL public-private partnership',
    'Page date not displayed; membership graphic explicitly as of June 30, 2023','Organization identity and annual-report shelf, not three recovered annual observations','Mission, funding/member identity and annual-report list',
    'NIIMBL describes a NIST-funded public-private partnership and Manufacturing USA membership. The inspected list links 2022–2023 and 2023–2024 reports; no 2021–2022 entry was present in that list. The 2022–2023 download attempt failed.',
    'NIIMBL is not itself a government agency despite the inherited source-type label. A missing shelf entry or failed download does not establish nonexistence. Three profiles sharing this URL do not supply three independently read reports.',
    {access:'Relevant page text inspected; 2022–2023 linked download returned Internal Error with no target URL; 2023–2024 PDF inspected separately',access_result:'Text inspected; linked file retrieval failed'}),
  check('NIIMBL-2024',[niimbl[2]],'https://www.niimbl.org/wp-content/uploads/2025/08/NIIMBL-2023-2024-Annual-Report-Full2.pdf','NIIMBL',
    'Report copyright 2025; exact issuance date not verified','July 1, 2023–June 30, 2024; some workforce counts concern calendar 2023','Cover, scope, program pages 5/9/10/13 and closing identity pages',
    'The report specifies its July-to-June window and 16 new member-led projects valued at $11.4 million. It separates cumulative project activity since 2017, calendar-2023 training and prospective 2025 facility plans.',
    'Training participants are not placements. New project value is not realized productivity; cumulative activity is not an annual increment. Historical facility plans do not verify present completion.',
    pdf('PDF pages 0, 2, 5, 9–10, 13 and 42–43 of 44 pages','Page 9 screenshot returned a reference without an inspectable image','Official linked annual report')),
  check('ASM-INDEX',[asm],'https://www.census.gov/programs-surveys/asm.html','U.S. Census Bureau',
    'Rolling program page; listed benchmark release April 10, 2025','2018–2021 benchmark data and later AIES collection transition','Program introduction, transition note and benchmark listing',
    'The page says AIES collection began in March 2024. Its 2022 ASM Benchmark entry describes 2018–2021 tables, not a new 2022 ASM annual observation.',
    'Benchmark title, release date and data years must remain distinct. Underlying table downloads were not inspected.'),
  check('ASM-BENCHMARK',[asm],'https://www.census.gov/data/tables/time-series/econ/asm/2022asm.html','U.S. Census Bureau',
    'Last revised April 10, 2025','2018–2021 table link under a 2022 ASM Benchmark heading','Complete main table-listing text',
    'The linked catalog confirms the table range is 2018–2021 despite the 2022 heading.',
    'No annual 2022 value or revised manufacturing estimate is extracted; data.census.gov tables were not opened.',linked),
  check('ASM-END',['source-56a-census-asm-discontinuation'],'https://www.census.gov/programs-surveys/asm/news-and-updates/updates.html','U.S. Census Bureau',
    'Last revised January 26, 2023','ASM final survey year 2021; collection ended late 2022','Entire updates body, discontinuation and historical revision notices',
    'The notice ends ASM after survey year 2021, with collection ending late 2022. It describes AIES survey year 2023 and planned early-2024 collection. A separate January 2023 revision notice concerns 2018–2021 tables.',
    'Late-2022 collection is not a 2022 ASM survey year. Historical planned collection is not an observation or a current status claim.'),
  check('AIES-INDEX',[aies],'https://www.census.gov/programs-surveys/aies.html','U.S. Census Bureau',
    'Rolling page; displayed update September 1, 2026 with separately dated September releases','2024 results and 2025 survey collection are different stages','Program summary, collection start and release/news listings',
    'AIES integrates seven annual business surveys. The page lists 2025 collection starting March 30, 2026 and links September 2026 releases concerning 2024 results and time-series data.',
    'The inherited transition-only description is now incomplete, but collection of 2025 responses does not establish released 2025 observations. Each linked release retains its own date.'),
  check('AIES-SERIES',[aies],'https://www.census.gov/newsroom/press-releases/2026/aies-time-series-data.html','U.S. Census Bureau',
    'September 10, 2026; CB26-TPS.55','2024 AIES time series incorporating legacy data','Complete release body and scope/error notes',
    'Census announces time series through its API and FRED using incorporated legacy data. Coverage is private nonfarm employer businesses in fifty states and DC across nineteen in-scope sectors; estimates are not price adjusted.',
    'Agency-described continuity does not mean every item is compatible. Sampling and other error remain. No API or FRED rows were fetched or independently reproduced.',linked),
  check('AIES-CHANGES-INDEX',[aies],'https://www.census.gov/programs-surveys/aies/newsroom/updates/2024-aies-summary-of-changes.html','U.S. Census Bureau',
    'September 3, 2026','Changes accompanying 2024 AIES release','Complete main text and summary-PDF link',
    'The landing page supplies a separately inspected summary of release changes.',
    'A release change is not a new measured performance result; apply only the changes documented for the relevant sector and item.',linked),
  check('AIES-CHANGES',[aies],'https://www2.census.gov/programs-surveys/aies/information-respondents/2024_annual_integrated_economic_survey_summary_of_changes.pdf','U.S. Census Bureau',
    'Linked by September 3, 2026 changes notice; separate PDF date not printed','2023 corrections and 2023/2024 wholesale/retail inventory linking','Entire one-page summary',
    'Wholesale and retail inventory linking changes from revenue-based to inventory-based factors. The factor uses legacy 2022 year-end inventory over AIES 2023 beginning inventory, applied to 2023/2024 year-end inventory and detail including LIFO.',
    'These sector-42 and sector-44–45 inventory changes must not be transferred to manufacturing or mistaken for physical inventory growth. The page also identifies corrections to historical 2023 estimates.',
    pdf('entire one-page summary','Page 0 screenshot returned a reference without an inspectable image','Official linked methodology note')),
  check('AIES-METHOD-INDEX',[aies],'https://www.census.gov/programs-surveys/aies/technical-documentation/methodology.html','U.S. Census Bureau',
    'Last revised September 2, 2026','2024 methodology edition','Main methodology list and 2024 link',
    'The current methodology list links the 2024 methodology PDF inspected separately.',
    'A methodology edition supplies scope and estimation rules, not independently reproduced data.',linked),
  check('AIES-METHOD',[aies],'https://www2.census.gov/programs-surveys/aies/technical-documentation/methodology/2024-aies-methodology-final.pdf','U.S. Census Bureau',
    '2024 methodology edition linked from September 2, 2026 page','2024 estimation with legacy benchmarks and historical linking','PDF pages 0–1 and 12–15: scope, units, linking, exclusions and confidentiality',
    'The method uses 2017 NAICS and distinguishes company sampling from physical establishments. Most linking uses revenue ratios, but capital-expenditure and robotics estimates are not linked to legacy estimates because their scope differs. Legacy benchmarks use the 2022 Economic Census.',
    'Territories are outside this fifty-state/DC employer scope. Preserve million-to-thousand unit conversion, item-specific exceptions and suppression: D is not zero. No confidential values are reconstructed or dataset compatibility certified.',
    pdf('complete PDF pages 0–1 and 12–15 of 16 pages; other pages not fully reviewed','Page 13 screenshot returned Internal Error','Official linked methodology report')),

  ...[
    ['2022','https://www.transportation.gov/individuals/aviation-consumer-protection/air-travel-consumer-reports-2022','June 28, 2024','The dated introduction describes January 2023 availability of October 2022 data.'],
    ['2023','https://www.transportation.gov/resources/individuals/aviation-consumer-protection/air-travel-consumer-reports-2023','May 28, 2026','The dated introduction describes January 2024 availability of October 2023 data; a later submissions link spans June 2023–December 2024.'],
    ['2024','https://www.transportation.gov/resources/individuals/aviation-consumer-protection/air-travel-consumer-reports-2024','May 28, 2026','The shelf includes monthly issues and a separate full-2024 submissions link.']
  ].map(([year,url,date,finding]) => check(`ATCR-${year}`,[atcr(year)],url,'U.S. Department of Transportation',
    `Catalog last updated ${date}`,`Publication-year ${year} shelf; individual observation periods differ`,'Complete main issue list and explanatory text',finding,
    'A publication-year shelf is not one annual outcome table. BTS operations, OACP submissions/animals and TSA data have different populations; quarterly oversales are not monthly observations. Do not average monthly percentages into an annual rate.')),
  check('ATCR-FEB23-INDEX',[atcr(2022),atcr(2023)],'https://www.transportation.gov/resources/individuals/aviation-consumer-protection/february-2023-air-travel-consumer-report','U.S. Department of Transportation',
    'Last updated April 12, 2023','December/full-year 2022; fourth-quarter/full-year oversales','Complete main report description and PDF link',
    'Linked from the 2023 shelf, the February report explicitly includes full-year 2022 observations as well as December and fourth-quarter tables.',
    'The 2023 issue year does not move the annual observations into 2023. Different sections retain different periods.',linked),
  check('ATCR-FEB23-PDF',[atcr(2022),atcr(2023)],'https://www.transportation.gov/sites/dot.gov/files/2023-04/February%202023%20ATCR_Revised.pdf','U.S. Department of Transportation',
    'Issued February 2023; revised April 12, 2023 to add complaint pages','Calendar 2022 versus 2021, operating-carrier cancellation table','Cover and printed page 31, Table 6C, including reporting threshold',
    'Table 6C reports 181,286 cancellations of 6,729,125 scheduled flights in 2022 (2.69%), versus 103,060 of 5,995,397 in 2021 (1.72%). It lists seventeen operating carriers and a domestic scheduled passenger-revenue reporting threshold.',
    'Operating carriers are not marketing networks. Preserve counts and denominators, not an unweighted mean of rates. The complaint-page revision is not a new operations year or proof that every table changed.',
    pdf('cover and complete PDF page 30, including Table 6C footnote, of 80 pages','Page 30 screenshot returned Internal Error','Official linked annual observations')),
  check('ATCR-FEB24-INDEX',[atcr(2023),atcr(2024)],'https://www.transportation.gov/resources/individuals/aviation-consumer-protection/february-2024-air-travel-consumer-report','U.S. Department of Transportation',
    'Last updated March 6, 2025','December/full-year 2023, with section-specific periods','Complete main report description and PDF link',
    'Linked from the 2024 shelf, this issue includes full-year 2023 data. Its complaints entry directs readers to the report rather than supplying a numeric observation.',
    'An update in 2025 does not make these 2025 observations. Missing complaint numbers cannot be encoded as zero.',linked),
  check('ATCR-FEB24-PDF',[atcr(2023),atcr(2024)],'https://www.transportation.gov/sites/dot.gov/files/2025-03/February%202024%20ATCR%20revised%203-06-2025.pdf','U.S. Department of Transportation',
    'Issued February 2024; animal-section revisions November 6, 2024 and March 6, 2025','Calendar 2023 versus 2022 operations; post-June 1, 2023 complaint-processing change','Cover, complete printed page 31 Table 6C and page 53 complaint notice',
    'Table 6C reports 87,943 cancellations of 6,847,899 scheduled flights in 2023 (1.28%), with fifteen operating-carrier rows; the prior table has seventeen. The complaint notice distinguishes broader submissions from complaints after a processing change.',
    'Changed reporting membership needs reconciliation, not an assumption that absent carriers ceased operating. Delayed complaints are not zero; inquiries/opinions must not be spliced into a complaints-only series. Animal-page revisions do not establish new cancellation observations.',
    pdf('cover and complete PDF pages 30 and 52 of 57 pages','Page 30 screenshot returned Internal Error','Official linked annual observations')),
  check('AV-2022',[av('2021-2022')],'https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/disengagement-reports/','California DMV',
    'Exact report date not verified','Intended December 2021–November 2022 test reporting','Exact bound archive URL request',
    'The bound archive returned 404 Not Found; no exact prior-period annual rows were recovered.',
    'A later approximate 3.3-million-mile increase cannot yield a precise prior total by subtraction. Preserve the missing baseline rather than inventing 5,768,861 miles or asserting nonexistence.',failed('Exact archive request returned 404 Not Found')),
  check('AV-2023',[av('2022-2023')],'https://www.dmv.ca.gov/portal/news-and-media/news-releases/autonomous-vehicle-permit-holders-report-a-record-9-million-test-miles-in-california-in-12-months/','California DMV',
    'February 2, 2024','December 1, 2022–November 30, 2023','Complete press-release body and reporting exclusions',
    'DMV reports 9,068,861 California test miles: 5,801,069 with a safety driver and 3,267,792 driverless. The stated prior-period increase is approximately 3.3 million miles, not an exact baseline.',
    'Excluded private/out-of-state, simulation and lower-automation activity matter. DMV explicitly cautions against company ranking from disengagement reports. These testing miles do not measure all commercial deployment or comparative safety.'),
  check('AV-2024',[av('2023-2024')],'https://www.dmv.ca.gov/portal/news-and-media/over-4-million-test-miles-logged-by-autonomous-vehicle-permit-holders-in-california/','California DMV',
    'January 31, 2025','December 1, 2023–November 30, 2024','Complete press-release body and reporting exclusions',
    'DMV reports 4,498,066 California test miles: 3,945,171 with a safety driver and 552,895 driverless. It identifies twenty holders with no testing and nine withdrawals in the report context.',
    'The changed testing mix/population is not a safety-effect estimate or proof of commercial failure. Historical permit counts are not a current September 2026 census; reporting exclusions still apply.'),
  check('AV-LINK-DRIFT',[av('2022-2023')],'https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/california-autonomous-vehicle-regulations/','California DMV',
    'Page date not verified','Current linked destination, not recovered historical test rows','Heading and regulation/proposal link list',
    'The 2024 news release annual-report link resolves to a California autonomous-vehicle regulations page, not the historical disengagement rows.',
    'This link drift does not prove that historical reports no longer exist. Regulation files were not opened or interpreted, and this destination is not a replacement annual dataset.',linked),
  check('FAA-BOUND',faa,faaUrl,'Federal Aviation Administration',
    'FY2025 report; exact issuance date not verified','Intended FY2022/FY2023/FY2024 historical operations within a later report','Exact shared PDF URL',
    'All three profiles bind one FY2025 financial report. Direct retrieval returned Internal Error, so the full PDF remains unread.',
    'One failed shared request is not three annual report reviews. No full-table or visual verification follows from a separately available search excerpt.',failed('Exact PDF retrieval returned Internal Error; full report not inspected')),
  check('FAA-INDEXED',faa,faaUrl,'DOT Office of Inspector General analysis within FAA financial report',
    'FY2025 report; exact issuance date not verified','FY2022–FY2024 actual operations; FY2025 explicitly as of December 2, 2025','Indexed printed page 106, Transportation Innovation chart and adjacent text',
    'The official indexed excerpt distinguishes actual operations (74, 113 and 148 for FY2022–FY2024) from forecast ranges. Its FY2025 count of 204 has a December 2, 2025 as-of note.',
    'This is a partial indexed excerpt, not an independently reproduced chart. Licensed operations do not establish mission success, a particular launch-site utilization rate or actual future forecast values.',
    {evidence_role:'Official indexed excerpt',access_result:'Indexed excerpt only',access:'Official search-index excerpt read after full-file retrieval failed; no full PDF or visual check claimed'}),
  check('NASA-INDEX',[nasa('2021-2022'),nasa('2023')],'https://www.nasa.gov/history/history-publications-and-resources/aeronautics-and-space-report-of-the-president/','NASA / federal agency contributors',
    'Catalog lists combined FY2021/2022 on May 3, 2023 and FY2023 on May 23, 2024','Fiscal-year editions and historical appendices with separate calendars','Report-series introduction and annual catalog entries',
    'The catalog describes fourteen contributing agencies and a combined FY2021/2022 edition. Two profile identities do not demonstrate that the underlying historical report tables were retrieved.',
    'Catalog dates are not automatically original issuance dates. The linked FY2021/2022 and FY2023 full reports were not inspected, and later catalog editions are not replacements.'),
  check('NASA-2024',[nasa('2024')],'https://www.nasa.gov/wp-content/uploads/2025/09/aeronautics-and-space-report-of-the-president-fy-2024.pdf','NASA / federal agency contributors',
    'FY2024 edition; catalog listing September 24, 2025','Narrative October 1, 2023–September 30, 2024; Appendix A calendar years','Cover/scope and complete Appendix A-1/A-2 tables and footnotes; Appendix B-1 heading',
    'The U.S. spacecraft table changes to counting launches rather than individual objects from 2018 onward. Its orbit/escape criterion is not mission success. Notes include four near-orbital Starship tests in 2024. The world table counts launches, not satellites, using its own geographic conventions.',
    'Do not plot this as a uniform spacecraft-count series or equate reaching orbit with mission success. Calendar-year appendices, fiscal-year narrative and fiscal-year launch manifests are distinct. Preserve stated exclusions and the near-orbital exception.',
    pdf('cover/scope and complete PDF pages 248–251 of 288 pages, plus the B-1 heading','Page 249 screenshot returned a reference without an inspectable image'))
];

export const programTransportResearchReviews = [
  {
    backlog_item_id:'182-BACKLOG-004',review_id:'207-BACKLOG-004-2026-09-14',check_ids:manufIds.map(id=>`207-CHECK-PROGRAM-${id}`),
    finding:'Manufacturing survey impacts, institute activity and establishment statistics remain incompatible as one outcome trend. The MEP FY2024 survey-response description is inverted; FY2023 is still missing. Newly released AIES time-series material offers a bounded research path, with explicit item-level linking exceptions and no independent data reproduction yet.',
    recommendation:'Retain the composite and causal holds pending authorized disposition. Correct the denominator explanation in the dated research notice; preserve raw identities, original dates and the distinction between program activity and measured production.',
    next_action:'Obtain readable missing report vintages, reconcile membership overlap and survey populations, reproduce selected manufacturing AIES observations with units and item-specific linking rules, and obtain authorized editor disposition and independent series review.',
    next_check_date:'2026-09-21'
  },
  {
    backlog_item_id:'182-BACKLOG-005',review_id:'207-BACKLOG-005-2026-09-14',check_ids:transportIds.map(id=>`207-CHECK-PROGRAM-${id}`),
    finding:'Annual operating-carrier tables provide bounded descriptive evidence, but reporting membership and complaint categories change. California testing miles exclude other activity and have an unrecovered exact baseline. FAA operations are only partially indexed here, and NASA appendices change counting units and calendars. No common mobility/space outcome measure follows.',
    recommendation:'Retain cross-series, safety and causal holds pending authorized disposition. Keep counts, denominators, editions, observation periods and access limitations explicit; admit no governed series from this research pass.',
    next_action:'Independently reconcile annual carrier tables and membership, recover fixed California and aerospace historical files and a readable FAA report, validate unit/calendar exceptions, then obtain the required editor and independent reviews.',
    next_check_date:'2026-09-21'
  }
];
