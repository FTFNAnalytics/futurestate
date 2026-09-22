// Authored from official artifacts inspected on September 14, 2026. These are
// research findings and recommendations, not human-authorized adjudications.
import {manufacturingArtifactChecks,manufacturingResearchReviews} from './backlog-manufacturing-reviews.mjs';
import {agencyArtifactChecks,agencyResearchReviews} from './backlog-agency-reviews.mjs';
import {agencyFollowupArtifactChecks,agencyFollowupResearchReviews} from './backlog-agency-followup-reviews.mjs';
import {batteryArtifactChecks,batteryResearchReviews} from './backlog-battery-reviews.mjs';
import {aviationArtifactChecks,aviationResearchReviews} from './backlog-aviation-reviews.mjs';
import {systemSeriesArtifactChecks,systemSeriesResearchReviews} from './backlog-system-series-reviews.mjs';
import {programTransportArtifactChecks,programTransportResearchReviews} from './backlog-program-transport-reviews.mjs';
import {secondCohortArtifactChecks,secondCohortResearchReviews} from './backlog-second-cohort-reviews.mjs';
import {finalCohortArtifactChecks,finalCohortResearchReviews} from './backlog-final-cohort-reviews.mjs';
export const backlogReviewDate = '2026-09-14';
const baselineArtifactChecks = [
  {
    check_id: '207-CHECK-DOE-PORTAL', source_ids: ['source-2026-transmission-needs-study'],
    url: 'https://www.energy.gov/oe/national-transmission-needs-study', issuer: 'U.S. Department of Energy',
    artifact_date: 'Draft released July 9, 2026; portal modification date not displayed',
    observation_period: 'Public comment July 9–September 8, 2026; planning assessment, not a delivered-capacity observation',
    locator: 'Opening comment-period notice; Study Overview; Draft National Transmission Needs Study and Supplemental Material',
    access: 'Official page text retrieved',
    finding: 'The portal says comments closed September 8 and still labels the linked study a draft. This differs from the inherited source-profile instruction to recheck after September 7.',
    limitation: 'This inspected page does not establish the absence of a final study elsewhere. A closed comment period is not final adoption or a completed transmission project.'
  },
  {
    check_id: '207-CHECK-DOE-DRAFT', source_ids: ['source-2026-transmission-needs-study'],
    url: 'https://www.energy.gov/documents/national-transmission-needs-study-draft-july-2026', issuer: 'U.S. Department of Energy',
    artifact_date: 'July 2026, as printed on the cover',
    observation_period: 'Mixed historical and projected planning evidence; not a single measured outcome period',
    locator: 'Cover; Executive Summary; PDF page 95, discussion of load-growth drivers',
    access: '112-page PDF retrieved; identified sections inspected',
    finding: 'The draft discusses growth in data centers, AI, manufacturing and other large loads as transmission-planning drivers.',
    limitation: 'This targeted check does not reproduce every model or establish site-level available power, project selection, permitting, cost allocation or completion.'
  },
  {
    check_id: '207-CHECK-AI-PLAN', source_ids: ['source-americas-ai-action-plan-2025'],
    url: 'https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf', issuer: 'The White House',
    artifact_date: 'July 2025', observation_period: 'Policy recommendations; no observed delivery period',
    locator: 'Printed pages 15–16, Develop a Grid to Match the Pace of AI Innovation',
    access: 'Official PDF retrieved; relevant grid section inspected',
    finding: 'The plan recommends stabilizing, optimizing and expanding grid resources to support data centers and other demand.',
    limitation: 'Recommendations are contextual policy evidence, not independently observed implementation or transmission capacity.'
  },
  {
    check_id: '207-CHECK-EIA-INDEX', source_ids: ['source-56b-eia860-2021', 'source-56b-eia860-2022', 'source-56b-eia860-2023'],
    url: 'https://www.eia.gov/electricity/data/eia860/', issuer: 'U.S. Energy Information Administration',
    artifact_date: 'Archive years 2021, 2022 and 2023; page publication date not displayed',
    observation_period: 'Annual generator inventory vintages, not interval operating availability',
    locator: 'Form description; file layout; Current Data rows for 2021, 2022 and 2023',
    access: 'Official index and schema description retrieved',
    finding: 'The index lists all three archive vintages and distinguishes generator records from an additional energy-storage file. Inventory capacity alone is not an operating-performance measure.',
    limitation: 'An accessible index does not verify plant-code rows. No assertion is made that the full EIA package lacks energy-storage fields.'
  },
  ...[2021, 2022, 2023].map(year => ({
    check_id: `207-CHECK-EIA-${year}`, source_ids: [`source-56b-eia860-${year}`],
    url: `https://www.eia.gov/electricity/data/eia860/archive/xls/eia860${year}.zip`, issuer: 'U.S. Energy Information Administration',
    artifact_date: `Archive vintage ${year}; exact revision date not verified`, observation_period: `${year} annual inventory`,
    locator: `Official EIA-860 index, ${year} ZIP link`, access: 'Retrieval tool returned Internal Error; archive contents not inspected',
    finding: 'The exact archive could not be inspected in this check.',
    limitation: 'No row reproduction, absence finding, unchanged-capacity finding or availability inference follows from this retrieval failure.'
  })),
  {
    check_id: '207-CHECK-BTS-2024', source_ids: ['source-56b-bts-atcr-full-year-2024'],
    url: 'https://www.bts.gov/newsroom/air-travel-consumer-report-december-2024-full-year-2024-numbers', issuer: 'Bureau of Transportation Statistics',
    artifact_date: '2025-03-14', observation_period: 'December 2024 and calendar year 2024',
    locator: 'Publication date; Flight Operations; December 2024 Flight Cancellations',
    access: 'Official release retrieved',
    finding: 'The release reports marketing-network statistics and warns that inputs may be revised. It is not the exact operating-carrier table required by this panel.',
    limitation: 'A marketing-network cancellation rate cannot silently substitute for an operating-carrier row. No inherited numerical panel was independently reproduced here.'
  },
  {
    check_id: '207-CHECK-ATCR-FEB-2026', source_ids: ['source-56b-dot-atcr-february-2026', 'source-56d-dot-atcr-february-2026'],
    url: 'https://www.transportation.gov/sites/dot.gov/files/2026-03/February_2026%20ATCR.pdf', issuer: 'U.S. Department of Transportation, Office of Aviation Consumer Protection',
    artifact_date: 'Issued February 2026, as printed; upload path contains March 2026',
    observation_period: 'December 2025 monthly data and January–December 2025/2024 cancellation comparisons',
    locator: 'Cover; printed pages 28–31, Tables 6, 6A, 6B and 6C',
    access: '58-page official PDF retrieved; cover and cancellation table sections inspected',
    finding: 'Table 6A is monthly operating-carrier data; Table 6C compares full-year operating-carrier cancellations with scheduled operations. Marketing-network tables are separate. The inherited description of this artifact as only one month is too narrow.',
    limitation: 'Descriptive rates do not identify a causal effect or overall service quality. Reproduce exact named rows and source revisions before admitting a series or comparison.'
  },
  {
    check_id: '207-CHECK-MEP-CURRENT', source_ids: ['source-56b-nist-mep-current-applications-lean'],
    url: 'https://www.nist.gov/mep/successstories/2024/lean-tools-provide-lead-time-reduction', issuer: 'NIST Manufacturing Extension Partnership',
    artifact_date: 'Displayed creation date 2026-01-13; URL contains 2024',
    observation_period: 'Undated before/after production intervention; no repeated observation dates supplied in the inspected narrative',
    locator: 'MEP’s Role; Results; Created footer', access: 'Official case-study text retrieved',
    finding: 'The account attributes changes to CITEC-assisted lean work. It reports 40 to 105 units/day and labels that increase 2.5x; the literal ratio is 2.625. Preserve the source wording and values separately rather than silently reconciling them.',
    limitation: 'Program/client attribution is not independent causal verification. This is physical motor production, not software fixtures; it is not a standardized cross-company productivity measure.'
  },
  {
    check_id: '207-CHECK-MEP-ISLAND', source_ids: ['source-56b-nist-mep-island-components-lean'],
    url: 'https://www.nist.gov/mep/successstories/2024/success-lean-process-implementation', issuer: 'NIST Manufacturing Extension Partnership',
    artifact_date: 'Displayed creation date 2024-07-17', observation_period: 'Undated before/after intervention at the described motor-assembly operation',
    locator: 'The Challenge; MEP’s Role; Results; Created footer', access: 'Official case-study text retrieved',
    finding: 'The account reports daily output moving from 75 to 120 and work-in-process inventory from 717 to 156, attributed to lean implementation with LIMEP.',
    limitation: 'No compatible labor-hour, quality-adjusted output or repeated-period denominator is supplied for comparison with the other manufacturers.'
  },
  {
    check_id: '207-CHECK-MEP-MONAGHAN', source_ids: ['source-56b-nist-mep-monaghan-medical-lean'],
    url: 'https://www.nist.gov/mep/successstories/2024/lean-implementation-thrives-monaghan-medical', issuer: 'NIST Manufacturing Extension Partnership',
    artifact_date: 'Displayed creation date 2025-01-14; URL contains 2024', observation_period: 'Undated intervention after pandemic-era production changes',
    locator: 'MEP’s Role; Results; Created footer', access: 'Official case-study text retrieved',
    finding: 'The account reports one line increasing from 6,000 to 9,000 units/day and one process changing from ten to seven minutes.',
    limitation: 'Line output and process cycle time are different measures. Neither establishes sustained company-wide productivity or a common denominator with the other cases.'
  },
  {
    check_id: '207-CHECK-ATCR-2025-INDEX', source_ids: ['source-56c-dot-atcr-2025-series'],
    url: 'https://www.transportation.gov/resources/individuals/aviation-consumer-protection/air-travel-consumer-reports-2025', issuer: 'U.S. Department of Transportation',
    artifact_date: 'Displayed last update 2026-05-28', observation_period: 'Report issue year 2025; underlying observation periods vary by report and section',
    locator: 'Reports; How the Report is Organized', access: 'Official series index retrieved',
    finding: 'The index separates BTS operations, OACP complaints and TSA reports and explains that oversales are quarterly. Report issue year is not a uniform outcome period.',
    limitation: 'This index-level check does not reproduce all twelve reports or establish any airline-specific intervention or delivered remedy.'
  },
  {
    check_id: '207-CHECK-AIRLINE-COMMITMENTS', source_ids: ['source-56c-dot-airline-customer-service-dashboard'],
    url: 'https://www.transportation.gov/airconsumer/airline-customer-service-dashboard', issuer: 'U.S. Department of Transportation',
    artifact_date: 'Displayed last update 2024-12-10; not the check date', observation_period: 'Commitments displayed at access; no passenger-level outcome period',
    locator: 'Introduction; Cancellation and Delay Dashboard; Airlines must keep their commitments', access: 'Official page text retrieved; cancellation/delay row values not exposed in this extraction',
    finding: 'The dashboard describes airline commitments for controllable disruptions and the accountability process.',
    limitation: 'Commitments do not document remedy receipt or explain annual cancellation movement. Empty extracted table rows are an extraction limit, not evidence that no commitment exists.'
  },
  {
    check_id: '207-CHECK-ATCR-JUL-2026', source_ids: ['source-56d-dot-atcr-july-2026'],
    url: 'https://www.transportation.gov/sites/dot.gov/files/2026-06/July%202026%20ATCR.pdf', issuer: 'U.S. Department of Transportation, Office of Aviation Consumer Protection',
    artifact_date: 'Issued July 2026, as printed; upload path contains June 2026', observation_period: 'May 2026 operations and complaints; first-quarter 2026 oversales',
    locator: 'Cover; contents; Appendix, printed page 35; complaint-table note, printed page 48', access: '55-page official PDF retrieved; identified sections inspected',
    finding: 'The report mixes monthly and quarterly sections. Its appendix cites Technical Directive 40 effective January 1, 2026; a complaint-table note combines Hawaiian with Alaska following the single operating certificate.',
    limitation: 'Period, reporting-cohort and complaint-attribution changes require explicit reconciliation. No common customer-exposure denominator, remedy delivery or causal effect is established.'
  }
];

const baselineResearchReviews = [
  {
    backlog_item_id: '182-BACKLOG-001', review_id: '207-BACKLOG-001-2026-09-14',
    check_ids: ['207-CHECK-DOE-PORTAL', '207-CHECK-DOE-DRAFT', '207-CHECK-AI-PLAN'],
    finding: 'Draft-study attribution is supported within the inspected sections. Correct the current comment-deadline note to September 8 while retaining the historical September 7 text in provenance.',
    recommendation: 'Retain In Review pending authorized disposition; do not promote a draft assessment to final policy or delivered infrastructure.',
    next_action: 'Have the evidence editor disposition the narrow draft-study claim and deadline correction; obtain an exact final study or later project artifact before describing advancement.',
    next_check_date: '2026-09-21'
  },
  {
    backlog_item_id: '182-BACKLOG-007', review_id: '207-BACKLOG-007-2026-09-14',
    check_ids: ['207-CHECK-EIA-INDEX', '207-CHECK-EIA-2021', '207-CHECK-EIA-2022', '207-CHECK-EIA-2023'],
    finding: 'The archive index and schema are accessible, but the three exact ZIP retrievals failed in the tool. Plant-row reproduction remains incomplete.',
    recommendation: 'Retain the performance-ranking hold and record the bounded retrieval blocker; do not equate inventory power with availability.',
    next_action: 'Retrieve each exact archive through an ordinary supported download, retain its vintage/hash, and reproduce the named plant-code rows. Specify an operating measure and denominator before reconsidering comparison.',
    next_check_date: '2026-09-21'
  },
  {
    backlog_item_id: '182-BACKLOG-008', review_id: '207-BACKLOG-008-2026-09-14',
    check_ids: ['207-CHECK-BTS-2024', '207-CHECK-ATCR-FEB-2026'],
    finding: 'An exact operating-carrier annual table is identifiable in the February PDF; the accompanying BTS release instead summarizes marketing networks. These are not interchangeable source bindings.',
    recommendation: 'Retain the ranking hold. A descriptive cancellation comparison is narrower than an overall carrier-performance judgment.',
    next_action: 'Reproduce the named 2024/2025 operating-carrier rows from Table 6C, pin the revision and denominator, and document exposure and reporting changes for authorized review.',
    next_check_date: '2026-09-21'
  },
  {
    backlog_item_id: '182-BACKLOG-009', review_id: '207-BACKLOG-009-2026-09-14',
    check_ids: ['207-CHECK-MEP-CURRENT', '207-CHECK-MEP-ISLAND', '207-CHECK-MEP-MONAGHAN'],
    finding: 'All three exact case studies are accessible and attributed to program/client accounts. Displayed dates differ across them; unlike output units and intervention windows still prevent a common productivity comparison.',
    recommendation: 'Retain the cross-manufacturer ranking and causal-inference hold; preserve the Current Applications multiplier discrepancy as a source inconsistency.',
    next_action: 'Seek dated repeated line-level observations, labor/quality denominators and independent validation; resolve the multiplier wording before reusing it. Obtain the authorized disposition.',
    next_check_date: '2026-09-21'
  },
  {
    backlog_item_id: '182-BACKLOG-012', review_id: '207-BACKLOG-012-2026-09-14',
    check_ids: ['207-CHECK-ATCR-2025-INDEX', '207-CHECK-AIRLINE-COMMITMENTS'],
    finding: 'The inspected materials separate statistical reports from commitments. The dashboard extraction does not expose the cancellation/delay commitment rows, so individual carrier promises were not reverified.',
    recommendation: 'Retain the causal-inference hold. This bounded check supports neither commitment delivery nor a measured effect on annual cancellation rates.',
    next_action: 'Inspect exact carrier commitments in a supported official view and match dated interventions to compatible observed outcomes; obtain independent validation and authorized disposition.',
    next_check_date: '2026-09-21'
  },
  {
    backlog_item_id: '182-BACKLOG-016', review_id: '207-BACKLOG-016-2026-09-14',
    check_ids: ['207-CHECK-ATCR-FEB-2026', '207-CHECK-ATCR-JUL-2026'],
    finding: 'The February artifact includes annual as well as monthly tables. July covers May operations and a different oversales quarter; its reporting and complaint-attribution notes matter to compatibility.',
    recommendation: 'Retain the alternative-explanation hold and flag the inherited one-month-only description for correction; no service-delivery or causal inference follows.',
    next_action: 'Reconcile the exact table, period, carrier identity, reporting directive and complaint denominator before comparing records. Keep annual and monthly claims separate for authorized review.',
    next_check_date: '2026-09-21'
  }
];

export const backlogArtifactChecks = [...baselineArtifactChecks,...manufacturingArtifactChecks,...agencyArtifactChecks,...agencyFollowupArtifactChecks,...batteryArtifactChecks,...aviationArtifactChecks,...systemSeriesArtifactChecks,...programTransportArtifactChecks,...secondCohortArtifactChecks,...finalCohortArtifactChecks];
export const backlogResearchReviews = [...baselineResearchReviews,...manufacturingResearchReviews,...agencyResearchReviews,...agencyFollowupResearchReviews,...batteryResearchReviews,...aviationResearchReviews,...systemSeriesResearchReviews,...programTransportResearchReviews,...secondCohortResearchReviews,...finalCohortResearchReviews];
