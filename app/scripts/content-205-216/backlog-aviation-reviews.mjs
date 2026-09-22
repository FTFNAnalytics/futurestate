// Targeted official-source reads on September 14, 2026, America/Edmonton.
// Research recommendations only; no independent admission or release approval.
const annual2024='https://www.transportation.gov/sites/dot.gov/files/2025-03/February%202025%20ATCR.pdf?mod=article_inline';
const annual2025='https://www.transportation.gov/sites/dot.gov/files/2026-03/February_2026%20ATCR.pdf';
const monthly2026='https://www.transportation.gov/sites/dot.gov/files/2026-06/July%202026%20ATCR.pdf';
const f15Assessment='https://www.gao.gov/assets/gao-25-107569.pdf';
export const aviationArtifactChecks = [
  {
    check_id:'207-CHECK-CARRIER-2024-OPERATING', source_ids:['source-56e-atcr-full-year-2024'],
    url:annual2024, issuer:'U.S. Department of Transportation, Office of Aviation Consumer Protection / BTS',
    artifact_date:'Cover: issued February 2025; not the March upload-directory date',
    observation_period:'Table 6C: January-December 2024 versus January-December 2023',
    locator:'Cover, contents and complete Table 6C, printed page 31, including headings and notes; separate marketing Table 6B',
    access:'Relevant text in 58-page PDF inspected; screenshot at index 30 returned Internal Error',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'Operating-carrier cancellation percentages for 2024/2023 are American 1.55/1.06, Alaska 1.96/0.81 and JetBlue 1.55/2.10. American 2024 records 15,252 cancellations among 984,306 scheduled operations. The marketing-network row is a different population.',
    limitation:'These are descriptive cancellation measures, not a composite service-quality ranking or causal estimate. Preserve published rounding and exact operating identities; do not replace scheduled operations with passengers or add codeshare totals.'
  },
  {
    check_id:'207-CHECK-CARRIER-2025-OPERATING', source_ids:['source-56e-atcr-full-year-2025'],
    url:annual2025, issuer:'U.S. Department of Transportation, Office of Aviation Consumer Protection / BTS',
    artifact_date:'Cover: issued February 2026; upload directory is March 2026',
    observation_period:'Table 6C: January-December 2025 versus January-December 2024; other sections use different periods',
    locator:'Cover, introduction/explanation and complete Table 6C, printed page 31, including certificate footnote',
    access:'Relevant text in 58-page PDF inspected; screenshot request at index 30 returned a reference without an inspectable image',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'The 2025 operating-carrier cancellation percentages are American 1.82, Alaska 1.21 and JetBlue 1.65. American records 17,679 cancellations among 973,653 scheduled operations. The table retains a separate Hawaiian annual row while noting the October 29, 2025 single operating certificate.',
    limitation:'Do not silently pool Alaska and Hawaiian across the certificate transition or treat the artifact as monthly-only. Exact reporting windows and carrier mappings must be reconciled before a series is admitted. No overall service improvement or production inference follows.'
  },
  {
    check_id:'207-CHECK-CARRIER-MAY-2026', source_ids:['source-56e-atcr-may-2026'],
    url:monthly2026, issuer:'U.S. Department of Transportation, Office of Aviation Consumer Protection / BTS',
    artifact_date:'Cover: issued July 2026; upload directory is June 2026',
    observation_period:'May 2026 operations and complaints; January-March 2026 oversales',
    locator:'Cover; explanation; Table 1A printed page 7; Appendix page 35; baggage/wheelchair headings; oversales page 44; complaints pages 45 and 48 with footnotes',
    access:'Relevant text in 55-page PDF inspected; index 6 screenshot returned a reference without an inspectable image',
    evidence_role:'Exact bound source', access_result:'Text inspected; visual check unavailable',
    finding:'May operating-carrier on-time arrivals are Alaska 82.4%, JetBlue 81.0% and American 75.1%, using the less-than-15-minute threshold. Complaint cases use consumer perception and primary issue, may attach to a marketing brand, and combine Hawaiian under Alaska. Baggage, wheelchairs and oversales use distinct denominators.',
    limitation:'ACERS began August 1, 2025; the reporting directive changed January 1, 2026. Do not treat missing prior-year complaint cells as zero, allegations as established violations, airport counts as flights, or May performance as an annual comparison. This review admits no series.'
  },
  {
    check_id:'207-CHECK-CARRIER-DASHBOARD-BOUND', source_ids:['source-56e-dot-airline-dashboard'],
    url:'https://www.transportation.gov/airconsumer/airline-customer-service-dashboard', issuer:'U.S. Department of Transportation',
    artifact_date:'Displayed last update December 10, 2024', observation_period:'Commitments displayed at access, not measured passenger outcomes',
    locator:'Introduction and dashboard headings; linked cancellation/delay page',
    access:'Main page text inspected; cancellation/delay row values absent from extraction',
    evidence_role:'Exact bound source', access_result:'Partial text inspected',
    finding:'The dashboard describes commitments for disruptions within carrier control, separate from statistics about flight operations.',
    limitation:'Missing extracted rows are not absent promises. Individual commitments are checked separately through the linked accessible format; neither source proves actual remedy receipt.'
  },
  {
    check_id:'207-CHECK-CARRIER-DASHBOARD-LINKED', source_ids:['source-56e-dot-airline-dashboard'],
    url:'https://www.transportation.gov/airconsumer/airline-cancellation-delay-dashboard', issuer:'U.S. Department of Transportation',
    artifact_date:'No update date recorded in inspected portion', observation_period:'Controllable cancellation/delay commitments at access',
    locator:'Introduction, table headers, commitment explanation and official alternative-text link',
    access:'Page text inspected; table row values again absent from extraction',
    evidence_role:'Official linked supporting page', access_result:'Partial text inspected',
    finding:'The page links an official alternative text format. It explains that a missing commitment does not exclude discretionary assistance.',
    limitation:'Header-only extraction does not establish any individual carrier value. Refund rights and contractual commitments have distinct scopes; no passenger-specific entitlement determination is made.'
  },
  {
    check_id:'207-CHECK-CARRIER-DASHBOARD-ACCESSIBLE', source_ids:['source-56e-dot-airline-dashboard'],
    url:'https://www.transportation.gov/resources/individuals/aviation-consumer-protection/airline-cancellation-delay-dashboard-html', issuer:'U.S. Department of Transportation',
    artifact_date:'Displayed last update December 3, 2024', observation_period:'Displayed commitments, not observed service delivery or verified September policy revision',
    locator:'Complete Alaska, American and JetBlue sections under both controllable cancellations and controllable delays; footer',
    access:'Accessible text sections and their positive/negative commitment lists inspected',
    evidence_role:'Official linked alternative text', access_result:'Text inspected',
    finding:'The three carriers have listed rebooking, qualifying meal and overnight accommodation commitments. Alaska additionally lists credits and miles; JetBlue lists credits but not miles. American lists neither credits nor miles. All three lack a listed cash-compensation commitment in these categories.',
    limitation:'The page mixes delay wording into several cancellation lists; retain that source limitation. These are displayed promises with conditions, not payout amounts, measured compliance or proof that no discretionary remedy occurs. The older footer does not establish current policy revision or consistency with unread live matrix cells.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F35-GAO-2024', source_ids:['source-56e-f35-gao-2024'],
    url:'https://www.gao.gov/products/gao-24-106909', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published and publicly released May 16, 2024', observation_period:'2023 deliveries and March 2024 production milestone',
    locator:'Report landing page, Highlights and What GAO Found', access:'Landing-page findings inspected; linked full report not independently reviewed',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'GAO reports that 100% of engines and 91% of aircraft were delivered late in 2023. It identifies March 2024 as the full-rate production decision milestone.',
    limitation:'Engine and aircraft populations differ. A decision milestone is not a measured factory throughput rate, and historical lateness does not establish September 2026 performance or a Fort Worth-specific causal effect.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F35-GAO-2025', source_ids:['source-56e-f35-gao-2025'],
    url:'https://www.gao.gov/products/gao-25-107632', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published/publicly released September 3, 2025; recommendation comments include July 2026',
    observation_period:'2024 contract delivery performance; later recommendation follow-up separately dated',
    locator:'Landing-page findings, methods summary and recommendations, especially production-capacity evaluation and incentives',
    access:'Landing-page text and recommendation comments inspected; full report not independently reviewed',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'GAO reports all 110 aircraft delivered in 2024 were late, averaging 238 days, and identifies TR-3 as the main delay driver. Its July 2026 capacity-evaluation comment says completion had not been demonstrated; a separate incentive-fee action was estimated for September.',
    limitation:'Calendar arrival is not action completion. Preserve contract due-date lateness separately from incentive eligibility, capacity evaluation and contractor production claims. GAO attribution does not isolate a quantified plant-level causal effect.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F35-COMPANY-2025', source_ids:['source-56e-f35-lockheed-deliveries-2025'],
    url:'https://www.f35.com/f35/news-and-features/F35_Breaks_Delivery_Record_Continues_Combat_Success_in_2025.html', issuer:'Lockheed Martin',
    artifact_date:'Article dateline January 7, 2026; separate sidebar news dates are not this article date', observation_period:'Company-reported calendar 2025 deliveries',
    locator:'Dateline and delivery announcement body', access:'Company announcement text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'Lockheed Martin announces 191 F-35 deliveries in 2025, compared with its prior record of 142.',
    limitation:'This is a contractor total, not independent acceptance of all operational capabilities or a newly manufactured output series. The article does not establish the composition of held-aircraft releases versus new production; do not assert a quantified backlog effect from this announcement alone.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F35-SUSTAINMENT-2026', source_ids:['source-56e-f35-gao-sustainment-2026'],
    url:'https://www.gao.gov/products/gao-26-108113', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published/publicly released June 11, 2026', observation_period:'Fiscal 2021-2025 readiness; future sustainment initiative separately described',
    locator:'Landing-page findings, metric definitions and recommendations', access:'Landing-page text inspected; linked full report not independently reviewed',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'GAO reports mission-capable rates falling from 67% to 44% and fully-mission-capable rates from 38% to 25% between fiscal 2021 and 2025. The metrics refer to ability to perform at least one versus all missions.',
    limitation:'These are fleet sustainment measures, not delivery-defect percentages or factory productivity. The planned sustainment reset is not a demonstrated recovery, and these historical figures are not live September readiness values.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-KC46-BUDGET-BOUND', source_ids:['source-56e-kc46-usaf-budget-fy2025'],
    url:'https://www.saffm.hq.af.mil/Portals/84/documents/FY25/FY25%20Air%20Force%20Aircraft%20Procurement%20Vol%20I.pdf?ver=trnnCwkcSenGdKVniZvWHQ%3D%3D', issuer:'Department of the Air Force, Financial Management',
    artifact_date:'Exact PDF issuance date not verified', observation_period:'Intended FY2025 procurement budget exhibit; not inspected',
    locator:'Exact bound Aircraft Procurement Volume I PDF', access:'Direct request and bounded retry failed with Bad Gateway / Internal Error; PDF unread',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The bound budget volume could not be read in this check.',
    limitation:'No procurement quantity, monthly output, schedule or absence claim is extracted. A budget request, even when recovered, is not an observed delivery total. Later budget vintages were not substituted.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-KC46-BUDGET-INDEX', source_ids:['source-56e-kc46-usaf-budget-fy2025'],
    url:'https://www.saffm.hq.af.mil/FM-Resources/Budget/Air-Force-Presidents-Budget-FY25/', issuer:'Department of the Air Force, indexed official budget page',
    artifact_date:'FY2025 index; exact page update not verified', observation_period:'Budget request and publication index, not delivery observations',
    locator:'Indexed procurement summary and Aircraft Procurement Volume I listing', access:'Official indexed excerpt inspected; direct page retrieval returned 502 Bad Gateway',
    evidence_role:'Indexed official supporting page', access_result:'Indexed excerpt only',
    finding:'The official index lists the intended volume and identifies KC-46A among procurement priorities.',
    limitation:'An indexed listing does not verify the unread aircraft exhibit or recover its tables. Working-capital and FY2026 results are different artifacts and were not assigned to this source.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-KC46-GAO-2026', source_ids:['source-56e-kc46-gao-2026'],
    url:'https://files.gao.gov/reports/GAO-26-109154/index.html', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published/publicly released June 10, 2026; public version of May sensitive report', observation_period:'Fiscal 2019-2025 fleet metrics; audit September 2024-May 2026',
    locator:'Highlights; metric findings; recommendations; Appendix I objectives and sample limitations',
    access:'Relevant public HTML sections inspected; no restricted material sought',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The report covers KC-135 and KC-46A, not just production. GAO finds availability and mission-capable measures do not fully represent the primary refueling mission. Fully-mission-capable status can exclude aircraft able to refuel but unable to perform another mission.',
    limitation:'Exact annual rates are omitted from this public version and are not reconstructed. Interviews with 16 units across 11 bases are nongeneralizable. Agency concurrence with four recommendations is not demonstrated implementation or evidence that later deliveries resolved sustainment problems.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-KC46-100TH', source_ids:['source-56e-kc46-100th-delivery-2025'],
    url:'https://www.afmc.af.mil/News/Article-Display/Article/4348349/100th-kc-46a-pegasus-delivered/', issuer:'Air Mobility Command Public Affairs, hosted by AFMC',
    artifact_date:'Published December 4, 2025', observation_period:'December 2, 2025 delivery/arrival event; earlier capability milestones separately described',
    locator:'Publication heading, opening delivery account and historical operational context', access:'Article text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The Air Force reports receipt of its 99th and 100th KC-46A aircraft at the December event.',
    limitation:'This is a cumulative U.S. Air Force delivery milestone, not a monthly production rate, global contractor total or finding that deficiencies were closed. Historical tasking eligibility does not establish actual mission completion or current fleet availability.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-KC46-105TH', source_ids:['source-56e-kc46-105th-delivery-2026'],
    url:'https://www.amc.af.mil/News/Article-Display/Article/4460441/kc-46-delivery-a-milestone-flight-and-a-final-farewell/', issuer:'22nd Air Refueling Wing Public Affairs, hosted by Air Mobility Command',
    artifact_date:'Published April 13, 2026', observation_period:'April 3, 2026 arrival at McConnell',
    locator:'Publication heading, fleet ordinal and final delivery paragraph', access:'Complete article text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The article identifies the same arriving aircraft as the Air Force 105th KC-46A and McConnell 25th Pegasus.',
    limitation:'These are nested fleet counts, not 130 separate aircraft. Do not infer sustained throughput from two milestone dates or operational readiness from delivery acceptance.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F15-FIRST', source_ids:['source-56e-f15ex-first-deliveries-2021'],
    url:'https://www.af.mil/News/Features/Article/2534008/air-force-receives-first-f-15ex/', issuer:'Air Force Life Cycle Management Center Public Affairs',
    artifact_date:'Published March 11, 2021', observation_period:'First acceptance March 10, 2021; subsequent schedules were forecasts',
    locator:'Publication heading, first acceptance and testing/delivery plans', access:'Complete article text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The Air Force accepted the first F-15EX on March 10, with transfer to Eglin for testing described afterward.',
    limitation:'First acceptance, arrival and operational readiness are separate events. The article 144-aircraft acquisition plan and later-lot schedules are historical plans, not verified current quantities or proof of later on-time delivery.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F15-FOUR', source_ids:['source-56e-f15ex-four-deliveries-2023'],
    url:'https://www.acc.af.mil/News/Article-Display/Article/3630056/eagles-have-landed-new-f-15exs-arrive-at-eglin/', issuer:'Air Force / Air Combat Command',
    artifact_date:'Published December 21, 2023', observation_period:'EX3 and EX4 arrival December 20, 2023',
    locator:'Opening arrival account, total inventory and test-wing ownership', access:'Complete article text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The two arrivals bring the Air Force total to four F-15EX aircraft, all at Eglin with test organizations.',
    limitation:'Four total is not four new deliveries in the event or four operational combat-unit aircraft. The article account of testing is not independent reproduction of the underlying test report or a sustained production-rate series.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F15-GAO-BOUND', source_ids:['source-56e-f15ex-gao-2025'],
    url:f15Assessment, issuer:'U.S. Government Accountability Office',
    artifact_date:'Full PDF unread; publication date verified separately on official landing page', observation_period:'Intended 2025 annual weapon assessment, not a fresh 2026 production observation',
    locator:'Exact bound GAO-25-107569 PDF', access:'Direct retrieval failed: content length too large, 46,644,590 bytes reported',
    evidence_role:'Exact bound source', access_result:'Retrieval failed',
    finding:'The full PDF could not be inspected through this retrieval.',
    limitation:'No F-15EX schedule, cost, production or denominator value is extracted from the unread PDF. Indexed excerpts and the portfolio landing page are separate, incomplete supporting evidence.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F15-GAO-INDEXED', source_ids:['source-56e-f15ex-gao-2025'],
    url:f15Assessment, issuer:'U.S. Government Accountability Office, indexed official PDF excerpt',
    artifact_date:'2025 report identity; excerpt does not independently establish update date', observation_period:'Program description in annual assessment',
    locator:'Indexed F-15EX program opening and separate EPAWSS assessment note', access:'Official indexed excerpt inspected; no full PDF or page-image verification',
    evidence_role:'Indexed official excerpt, not full report', access_result:'Indexed excerpt only',
    finding:'The excerpt describes the F-15EX program and explicitly says EPAWSS is assessed separately.',
    limitation:'Do not transfer another program assessment to F-15EX or infer complete-file absence from the excerpt. No timeline values are recovered from an unverified visual description.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F15-GAO-LANDING', source_ids:['source-56e-f15ex-gao-2025'],
    url:'https://www.gao.gov/products/gao-25-107569', issuer:'U.S. Government Accountability Office',
    artifact_date:'Published/publicly released June 11, 2025', observation_period:'2025 assessment portfolio and separately updated recommendation statuses',
    locator:'Report identity, objectives/methods and recommendation 2', access:'Landing-page text inspected; linked 233-page PDF remains unread',
    evidence_role:'Official supporting landing page', access_result:'Text inspected',
    finding:'The assessment covers 106 programs. Its Air Force recommendation is marked Closed - Implemented after a July 2025 acquisition-guidance change.',
    limitation:'A portfolio governance recommendation closure is not an F-15EX technical deficiency closure, on-time delivery determination or production recovery. Portfolio totals cannot be assigned to one aircraft line.'
  },
  {
    check_id:'207-CHECK-AIRCRAFT-F15-RESUMPTION', source_ids:['source-56e-f15ex-production-resumes-2025'],
    url:'https://www.aflcmc.af.mil/NEWS/Article/4359770/f-15ex-production-rebounds-deliveries-continue/', issuer:'F-15 System Program Office, Air Force Life Cycle Management Center',
    artifact_date:'Published December 15, 2025', observation_period:'August-November 2025 labor interruption and later delivery account',
    locator:'Complete program-office article, especially strike interval and EX14/15/16 deliveries', access:'Complete article text inspected',
    evidence_role:'Exact bound source', access_result:'Text inspected',
    finding:'The program office says the strike halted production August 4-November 17, while EX14 and EX15 deliveries occurred August 19 and November 16. It describes EX16 delivery less than three weeks later.',
    limitation:'Delivery events within a stated production stoppage show why these processes cannot be treated as identical. The account does not give a complete monthly series, prove a sustained recovery rate or quantify the strike as the sole cause of all delays.'
  }
];

export const aviationResearchReviews = [
  {
    backlog_item_id:'182-BACKLOG-022', review_id:'207-BACKLOG-022-2026-09-14',
    check_ids:['207-CHECK-CARRIER-2024-OPERATING','207-CHECK-CARRIER-2025-OPERATING','207-CHECK-CARRIER-MAY-2026','207-CHECK-CARRIER-DASHBOARD-BOUND','207-CHECK-CARRIER-DASHBOARD-LINKED','207-CHECK-CARRIER-DASHBOARD-ACCESSIBLE'],
    finding:'The exact annual operating-carrier rows and May monthly table are readable, but their periods, carrier boundaries and denominators differ. An official accessible dashboard recovers displayed commitments without establishing passenger-level delivery. The Alaska/Hawaiian transition and complaint-system changes remain explicit comparison breaks.',
    recommendation:'Retain the cross-carrier composite and causal-inference holds pending authorized disposition. Narrow descriptive observations remain attributed, not admitted as an independently verified series.',
    next_action:'Reconcile annual carrier mappings and revisions; visually verify the tables and independently reproduce exact denominators. Check commitment conditions against a readable current matrix or carrier plans and obtain outcome evidence before evaluating remedy delivery. Obtain evidence editor disposition separately.',
    next_check_date:'2026-09-21'
  },
  {
    backlog_item_id:'182-BACKLOG-023', review_id:'207-BACKLOG-023-2026-09-14',
    check_ids:['207-CHECK-AIRCRAFT-F35-GAO-2024','207-CHECK-AIRCRAFT-F35-GAO-2025','207-CHECK-AIRCRAFT-F35-COMPANY-2025','207-CHECK-AIRCRAFT-F35-SUSTAINMENT-2026','207-CHECK-AIRCRAFT-KC46-BUDGET-BOUND','207-CHECK-AIRCRAFT-KC46-BUDGET-INDEX','207-CHECK-AIRCRAFT-KC46-GAO-2026','207-CHECK-AIRCRAFT-KC46-100TH','207-CHECK-AIRCRAFT-KC46-105TH','207-CHECK-AIRCRAFT-F15-FIRST','207-CHECK-AIRCRAFT-F15-FOUR','207-CHECK-AIRCRAFT-F15-GAO-BOUND','207-CHECK-AIRCRAFT-F15-GAO-INDEXED','207-CHECK-AIRCRAFT-F15-GAO-LANDING','207-CHECK-AIRCRAFT-F15-RESUMPTION'],
    finding:'The three aircraft lines have distinguishable delivery, lateness, readiness and program-governance observations, not one manufacturing-productivity denominator. Company totals and government delivery milestones retain attribution. The exact budget PDF and annual-assessment PDF remain unread, with indexed or landing-page evidence recorded separately.',
    recommendation:'Retain the cross-line productivity and causal-inference holds pending authorized disposition. Do not convert a cumulative delivery, administrative closure or future target into a verified operating outcome.',
    next_action:'Recover readable exact public budget and assessment files through supported access; reproduce program-specific observation windows and denominator definitions. Reconcile contractor totals with acceptance and production events, resolve outstanding evaluation evidence, and obtain independent validation plus evidence editor disposition.',
    next_check_date:'2026-09-21'
  }
];
