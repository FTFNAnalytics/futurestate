import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "gao-second-order-recovery-leads-supporting-artifacts-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-026-second-order-recovery-leads";
const archiveRoot = join(appRoot, "public", "downloads", collectionSlug);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");

for (const path of [
  join(contentRoot, "sources"),
  join(contentRoot, "research-documents"),
  join(contentRoot, "signals"),
  join(contentRoot, "research-collections"),
  join(contentRoot, "briefings"),
  join(contentRoot, "updates"),
  dataRoot,
  join(archiveRoot, "official-links"),
]) await mkdir(path, { recursive: true });

const phase56u = JSON.parse(await readFile(join(dataRoot, "phase-56u-custodian-exact-artifact-recovery-batch-one.json"), "utf8"));
if (phase56u.records.length !== 8 || phase56u.near_matches_reviewed !== 10) {
  throw new Error("Phase 56V requires the eight Phase 56U tickets and ten official near-matches.");
}
const parentByAction = new Map(phase56u.records.map((record) => [record.action_key, record]));

const agencyMeta = {
  DOE: { topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-008", "gap-016"] },
  HHS: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
  DOT: { topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  VA: { topics: ["Human Futures", "Policy and Standards", "Finance and Risk"], layers: ["Human Systems", "Enabling Infrastructure"], gaps: ["gap-016"] },
};

const sources = [
  {
    id: "source-56v-nnsa-fy2027-overview",
    name: "NNSA FY 2027 Congressional Justification Overview",
    url: "https://www.energy.gov/documents/doe-fy-2027-volume-1-nnsa-overview",
    owner: "U.S. Department of Energy, National Nuclear Security Administration",
    agency: "DOE",
    access: "Data Download",
    limitation: "The overview supplies current program, production-capability, and budget lineage for plutonium modernization. It is not the complete pit-production life-cycle cost estimate requested by GAO and does not expose a recommendation-specific GAO-aligned method or uncertainty analysis.",
  },
  {
    id: "source-56v-doe-em-mission-functions",
    name: "DOE Environmental Management Mission and Functions Statement",
    url: "https://www.energy.gov/em/downloads/mission-functions-statement-office-environmental-management",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Data Download",
    limitation: "The 2016 statement identifies the Waste Disposal Office and its complex-wide planning and analysis functions. It predates the recommendation and is not DOE's April 2026 response, cited analysis, alternatives comparison, or optimal-strategy decision.",
  },
  {
    id: "source-56v-hanford-dfhlw-2025-supplement-analysis",
    name: "Hanford Direct-Feed High-Level Waste 2025 Supplement Analysis",
    url: "https://www.energy.gov/sites/default/files/2025-10/sa-eis-0391-sa-04-direct-feed-high-level-waste-2025-10.pdf",
    owner: "U.S. Department of Energy",
    agency: "DOE",
    access: "Data Download",
    limitation: "The supplement traces DOE's Direct-Feed High-Level Waste implementation decision to the 2023 analysis of alternatives. It does not document the pause, mission-need reset, independent optimization analysis, or safety-prerequisite package required by the open GAO recommendation.",
  },
  {
    id: "source-56v-hanford-hlw-aoa-final-2023",
    name: "Hanford High-Level Waste Treatment Analysis of Alternatives, Final Report",
    url: "https://www.hanford.gov/files.cfm/2023-01-12_-_WTP_HLW_AoA_Final_Report_Rev0.pdf",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Data Download",
    limitation: "The 2023 report compares treatment configurations, costs, schedules, and risks and documents its estimating references. It predates GAO-24-106989 and is not the recommendation-specific independent analysis or pause-condition package.",
  },
  {
    id: "source-56v-hanford-hlw-aoa-addendum-2023",
    name: "Hanford High-Level Waste Treatment Analysis of Alternatives, Addendum 1",
    url: "https://www.hanford.gov/files.cfm/2023-01-12_-_WTP_HLW_AoA_Addendum_1_Rev01.pdf",
    owner: "U.S. Department of Energy, Office of Environmental Management",
    agency: "DOE",
    access: "Data Download",
    limitation: "The addendum analyzes Alternative 18 and its phased treatment configuration. It predates the recommendation and does not establish a covered-work pause, completion of the named prerequisites, or GAO acceptance.",
  },
  {
    id: "source-56v-hhs-aar-improvement-plan-template-catalog",
    name: "ASPR TRACIE Health Care Provider After Action Report and Improvement Plan Template",
    url: "https://asprtracie.hhs.gov/technical-resources/resource/185/health-care-provider-after-action-report-improvement-plan-aar-ip",
    owner: "U.S. Department of Health and Human Services, Administration for Strategic Preparedness and Response",
    agency: "HHS",
    access: "Report Series",
    limitation: "The catalog exposes a provider-oriented AAR and improvement-plan template. It is not HHS's January 2026 department-wide SOP, does not establish cross-component use, and does not define or demonstrate relevant external-stakeholder participation.",
  },
  {
    id: "source-56v-dot-oig-fy2026-top-management-challenges",
    name: "DOT OIG Fiscal Year 2026 Top Management Challenges",
    url: "https://www.oig.dot.gov/library-item/47031",
    owner: "U.S. Department of Transportation, Office of Inspector General",
    agency: "DOT",
    access: "Report Series",
    limitation: "The report identifies financial stewardship, grants, contracts, and fraud controls as department-wide challenges. It does not publish the January 2026 ERM guidance, operating-administration risk profiles, or the recommendation-specific portfolio assessment.",
  },
  {
    id: "source-56v-dot-unified-grants-lifecycle-procurement",
    name: "DOT Unified Grants Lifecycle Management System Procurement Forecast",
    url: "https://www.transportation.gov/procurement-forecast-opportunity/procurement-forecast-opportunity-685586-2025-248",
    owner: "U.S. Department of Transportation",
    agency: "DOT",
    access: "Interactive Portal",
    limitation: "The forecast describes planned common grants systems, analytics, decision tools, and a transparency dashboard and states that the contract was not awarded on the displayed record. A procurement forecast is not an operating risk assessment, monitoring method, or portfolio-wide implementation result.",
  },
  {
    id: "source-56v-dot-federal-grant-regulations-guidance",
    name: "DOT Federal Grant Regulations and Guidance",
    url: "https://www.transportation.gov/mission/administrations/office-grants-and-financial-assistance/federal-grant-regulations-and",
    owner: "U.S. Department of Transportation, Office of Grants and Financial Assistance",
    agency: "DOT",
    access: "Interactive Portal",
    limitation: "The January 2026 page identifies adopted government-wide grant rules and says future DOT-specific guidance will be added as available. It is not the January 2026 ERM guidance or evidence that grant-agreement risks were assessed and monitored across operating administrations.",
  },
  {
    id: "source-56v-va-category-management-authority-delegation",
    name: "VA Delegation of Authority to Execute Category Management Operations and Governance",
    url: "https://www.va.gov/vapubs/viewPublication.asp?Pub_ID=1731",
    owner: "U.S. Department of Veterans Affairs",
    agency: "VA",
    access: "Data Download",
    limitation: "The June 2026 memorandum delegates category-management execution and governance while retaining senior accountability. It does not contain the expected 180-day response, category-specific savings goals, baselines, calculation methods, or tracked progress.",
  },
  {
    id: "source-56v-va-fy2024-annual-performance-report",
    name: "VA Fiscal Year 2024 Annual Performance Report",
    url: "https://department.va.gov/wp-content/uploads/2025/01/va-annual-performance-report-2024.pdf",
    owner: "U.S. Department of Veterans Affairs",
    agency: "VA",
    access: "Data Download",
    limitation: "The report publishes spend-under-management and best-in-class targets and results. These portfolio measures are not the recommendation-specific category-level cost-avoidance and budget-savings goals, baselines, methods, and progress register requested by GAO.",
  },
  {
    id: "source-56v-va-fy2026-congressional-supplemental-appendices",
    name: "VA FY 2026 Congressional Submission, Supplemental Information and Appendices",
    url: "https://department.va.gov/wp-content/uploads/2025/06/2026-Volume-1-Supplemental-Information-Appendices.pdf",
    owner: "U.S. Department of Veterans Affairs",
    agency: "VA",
    access: "Data Download",
    limitation: "The submission provides a recommendation-specific VA response, responsible office, JEC governance, planned POAMM, named Joint Operating Plan, and then-current target. It does not include the Joint Transition Task Force draft assessment, completed gap findings, recommendations, or GAO acceptance.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id,
    name: source.name,
    url: source.url,
    source_type: "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    country_or_region: "United States",
    update_frequency: "Event Driven",
    capture_priority: "High",
    known_limitations: source.limitation,
    last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: source.access,
    ...(source.access === "Data Download" ? { data_download_url: source.url } : {}),
    review_cadence_days: 45,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States federal government",
    source_owner: source.owner,
    notes: `Phase 56V second-order recovery and supporting-artifact source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    leadId: "lead-56v-01",
    actionKey: "DOE-01",
    nearMatchIndex: 0,
    slug: "doe-pit-production-budget-lineage",
    title: "DOE-01: FY 2027 plutonium-modernization budget lineage narrows the cost-estimate search",
    leadType: "Program budget and office lineage",
    downstream: [
      { source_id: "source-56v-nnsa-fy2027-overview", locator: "Overview pages 5-8, Production Modernization and plutonium-pit capability discussion", artifact_function: "Names the current program, production objective, program structure, and budget series most likely to carry the estimate.", why_not_target: "The overview does not contain the complete capability life-cycle estimate, GAO-aligned assumptions, or uncertainty analysis." },
    ],
    finding: "NNSA's FY 2027 overview places the missing estimate inside the Production Modernization and plutonium-modernization budget lineage and describes the current capability objective. That is a new, reproducible downstream locator, but it is not the complete recommendation-specific life-cycle cost estimate.",
    materialNarrowing: "The search can now target the Production Modernization budget series and its supporting cost-estimate attachments instead of treating the NNSA budget portal as one undifferentiated repository.",
    directiveTests: [
      "The overview names the program and capability objective but does not publish a full capability life-cycle estimate.",
      "Budget narrative and control totals do not expose the recommendation-specific GAO-aligned estimating method and assumptions.",
      "No capability-wide risk and uncertainty analysis is published in the overview.",
    ],
    nextAction: "Search later Production Modernization supporting books, cost-estimate attachments, and GAO correspondence for a complete capability estimate; retain the December 2026 monitor as a bounded insert.",
  },
  {
    leadId: "lead-56v-02",
    actionKey: "DOE-02",
    nearMatchIndex: 0,
    slug: "doe-waste-disposal-custodian-function",
    title: "DOE-02: The Waste Disposal Office is the named complex-wide analysis custodian",
    leadType: "Custodian and function decomposition",
    downstream: [
      { source_id: "source-56v-doe-em-mission-functions", locator: "Pages 41-42, Waste Disposal Office mission and functions", artifact_function: "Identifies the EM office charged with integrating, planning, and analyzing waste streams for complex-wide disposal operations.", why_not_target: "The organizational statement predates the recommendation and does not reproduce the April 2026 letter, alternatives analysis, or optimal-strategy basis." },
    ],
    finding: "DOE's mission-and-functions statement identifies the Waste Disposal Office as the sub-office responsible for complex-wide disposal planning and analysis. This materially narrows the named custodian and likely record series while leaving the April 2026 response and optimization analysis unacquired.",
    materialNarrowing: "The ticket now points to Waste Disposal Office planning products, forecasts, and correspondence rather than the Office of Environmental Management generally.",
    directiveTests: [
      "The office's complex-wide inventory and disposal function is named, but no recommendation-specific inventory and pathway analysis is published.",
      "The authority to plan and analyze does not provide the required cross-site alternatives comparison.",
      "No optimal strategy, decision rule, or basis is contained in the organizational statement.",
    ],
    nextAction: "Search Waste Disposal Office planning products, complex-wide forecasts, correspondence-center packages, and April 2026 attachments for the exact analysis and decision basis.",
  },
  {
    leadId: "lead-56v-03",
    actionKey: "DOE-05",
    nearMatchIndex: 0,
    slug: "doe-hanford-alternatives-lineage",
    title: "DOE-05: Hanford's 2025 decision trail resolves to the 2023 AoA and Addendum 1",
    leadType: "Cited analysis and implementation-instrument lineage",
    downstream: [
      { source_id: "source-56v-hanford-dfhlw-2025-supplement-analysis", locator: "Pages 10-12 and references to the January 2023 HLW AoA", artifact_function: "Shows the post-recommendation implementation analysis and the cited decision lineage for Direct-Feed High-Level Waste.", why_not_target: "It supports continued implementation and does not document the GAO-requested pause or prerequisite package." },
      { source_id: "source-56v-hanford-hlw-aoa-final-2023", locator: "Final report, alternatives, cost, schedule, risk, and estimating appendices", artifact_function: "Provides the underlying 2023 treatment-configuration alternatives analysis cited by the later supplement.", why_not_target: "It predates GAO-24-106989 and is not an independent recommendation-specific optimization or pause decision." },
      { source_id: "source-56v-hanford-hlw-aoa-addendum-2023", locator: "Addendum 1, Alternative 18 approach, assumptions, scoring, cost, and risk sections", artifact_function: "Documents the phased Alternative 18 configuration selected in the later decision trail.", why_not_target: "It predates the recommendation and does not establish pause, prerequisite completion, or GAO acceptance." },
    ],
    finding: "The 2025 supplement explicitly resolves the current Hanford implementation lineage to the January 2023 HLW analysis of alternatives and Addendum 1. Those exact cited records are now profiled, but they predate the recommendation and do not supply the pause, mission-need reset, independent optimization, or safety-prerequisite package GAO requested.",
    materialNarrowing: "The agency-GAO conflict now has a document lineage: 2023 AoA, 2023 Addendum 1, and 2025 supplement. The missing object is no longer a generic Hanford analysis; it is the distinct post-recommendation pause and prerequisite decision package.",
    directiveTests: [
      "The located records describe continued implementation, not a pause in covered facility work.",
      "They do not document completion of the recommendation's named mission-need, independent-analysis, and safety prerequisites.",
      "The 2023 AoA is a treatment-configuration analysis that predates the recommendation; it is not the required post-recommendation independent decision record.",
    ],
    nextAction: "Search Hanford decision memoranda, project-direction correspondence, independent-review attachments, and GAO correspondence for the distinct pause and prerequisite package; preserve the DOE-GAO status conflict.",
  },
  {
    leadId: "lead-56v-04",
    actionKey: "HHS-04-R1",
    nearMatchIndex: 0,
    slug: "hhs-component-after-action-evaluation-instrument",
    title: "HHS-04-R1: ASPR's AAR instrument narrows the implementation-record format",
    leadType: "Referenced implementation instrument",
    downstream: [
      { source_id: "source-56v-hhs-aar-improvement-plan-template-catalog", locator: "Resource description and linked AAR/IP template", artifact_function: "Identifies a public HHS-hosted format for documenting exercise or event performance and improvement actions.", why_not_target: "The provider template is not the January 2026 department-wide SOP and does not demonstrate collaboration across HHS components." },
    ],
    finding: "ASPR TRACIE exposes an AAR and improvement-plan instrument that clarifies the form an implementation record may take. It is provider-oriented and does not supply HHS's department-wide SOP or a qualifying cross-component AAR.",
    materialNarrowing: "The search can now distinguish SOP text from the separate AAR/IP implementation record GAO is waiting to review.",
    directiveTests: [
      "A generic AAR/IP instrument does not establish HHS's department-wide coordination procedures.",
      "The catalog does not show use across HHS component agencies.",
      "No qualifying exercise or response AAR documenting component collaboration is attached.",
    ],
    nextAction: "Search HHS and ASPR exercise repositories for a completed AAR/IP that names participating components and cites the January 2026 SOP.",
  },
  {
    leadId: "lead-56v-05",
    actionKey: "HHS-04-R2",
    nearMatchIndex: 0,
    slug: "hhs-stakeholder-after-action-template",
    title: "HHS-04-R2: The public AAR template does not expose stakeholder-selection rules",
    leadType: "Template-to-procedure gap decomposition",
    downstream: [
      { source_id: "source-56v-hhs-aar-improvement-plan-template-catalog", locator: "Resource description and linked AAR/IP template", artifact_function: "Provides a public after-action documentation instrument against which the stakeholder-specific SOP and completed AAR can be distinguished.", why_not_target: "The resource does not define relevant external stakeholders, selection criteria, participation steps, or a completed qualifying AAR." },
    ],
    finding: "The AAR/IP template is a real implementation instrument but contains no evidence of HHS's later stakeholder-participation SOP or its use. Phase 56V therefore separates the generic report format from the still-missing stakeholder-selection and participation record.",
    materialNarrowing: "The downstream search is now for the SOP's stakeholder-selection procedure plus a completed AAR/IP naming participating external organizations, not for another broad emergency plan.",
    directiveTests: [
      "The generic template does not establish a procedure for relevant external-stakeholder participation.",
      "It does not identify which stakeholders were selected or included in a department-wide exercise or response review.",
      "No completed AAR documents stakeholder participation and resulting solutions.",
    ],
    nextAction: "Search for a completed HHS exercise or response AAR/IP that identifies external participants, selection rationale, challenges, solutions, and the governing January 2026 SOP.",
  },
  {
    leadId: "lead-56v-06",
    actionKey: "DOT-05",
    nearMatchIndex: 0,
    slug: "dot-financial-stewardship-oversight-lineage",
    title: "DOT-05A: OIG's FY 2026 financial-stewardship challenge is the oversight branch",
    leadType: "Independent oversight lineage",
    downstream: [
      { source_id: "source-56v-dot-oig-fy2026-top-management-challenges", locator: "Financial Stewardship and Curbing Fraud, Waste, and Abuse challenge sections", artifact_function: "Names current department-wide grant-process and stewardship vulnerabilities from DOT's independent inspector general.", why_not_target: "It does not publish the January 2026 ERM guidance, full risk profiles, or a recommendation-specific portfolio assessment." },
    ],
    finding: "DOT OIG's FY 2026 challenge report provides the independent oversight branch behind the performance-plan near-match: financial stewardship, streamlined grant processes, and grant-fund controls remain department-wide management concerns. The report does not expose DOT's recommendation-specific risk assessment.",
    materialNarrowing: "The performance-plan lead now resolves to a named independent oversight series that can be checked for later audits of the January 2026 ERM cycle.",
    directiveTests: [
      "The challenge statement is department-wide context, not a portfolio-wide identification of grant-agreement risks.",
      "It does not publish a likelihood, severity, monitoring, and response method for awardee challenges.",
      "It does not demonstrate full operating-administration coverage of the recommendation-specific assessment.",
    ],
    nextAction: "Monitor DOT OIG audits and the FY 2026 ERM record for a portfolio assessment that identifies, rates, monitors, and assigns responses to grant-agreement risks.",
  },
  {
    leadId: "lead-56v-07",
    actionKey: "DOT-05",
    nearMatchIndex: 1,
    slug: "dot-unified-grants-system-lineage",
    title: "DOT-05B: The unified grants system is a planned implementation instrument, not a live control",
    leadType: "Planned system and procurement lineage",
    downstream: [
      { source_id: "source-56v-dot-unified-grants-lifecycle-procurement", locator: "Opportunity 685586-2025-248, description, award state, and period of performance", artifact_function: "Names the planned common system, analytics, decision tools, and Grants Transparency Dashboard later referenced by DOT and GAO.", why_not_target: "The displayed forecast says the contract was not awarded and does not establish an operating assessment, monitoring method, or risk response." },
    ],
    finding: "The financial-report branch resolves to a named procurement forecast for a unified grants lifecycle system and transparency dashboard. This is a concrete implementation-instrument locator, but the displayed record is a planning forecast rather than evidence of an awarded, deployed, or operating control.",
    materialNarrowing: "The ticket now has a procurement identifier, system title, forecast value band, and expected performance window for later award and deployment checks.",
    directiveTests: [
      "A planned data system does not itself comprehensively identify grant-agreement risks across the portfolio.",
      "The forecast describes analytics and decision tools but no operating likelihood, severity, monitoring, or response method.",
      "Common-system intent does not demonstrate actual coverage across operating administrations.",
    ],
    nextAction: "Track the named procurement to an authoritative award, system baseline, data model, deployment record, and operating risk-assessment output before changing scope or implementation status.",
  },
  {
    leadId: "lead-56v-08",
    actionKey: "DOT-05",
    nearMatchIndex: 2,
    slug: "dot-grants-guidance-lineage",
    title: "DOT-05C: The January 2026 grants page promises future guidance but does not publish ERM guidance",
    leadType: "Policy-page and missing-attachment decomposition",
    downstream: [
      { source_id: "source-56v-dot-federal-grant-regulations-guidance", locator: "January 28, 2026 page text and linked federal rules", artifact_function: "Identifies the grants-policy surface where DOT-specific guidance is expected to appear and separates 2 CFR adoption from ERM guidance.", why_not_target: "The page says additional DOT-specific resources will be provided as available and does not contain the January 2026 ERM guidance or risk profiles." },
    ],
    finding: "DOT's current grants-guidance page is a precise missing-attachment locator: it publishes adopted government-wide rules and says future DOT-specific guidance will be added, but it does not expose the January 2026 ERM guidance described to GAO.",
    materialNarrowing: "The grants-office branch is now bounded to a specific policy page and missing future resource, rather than the grants office generally.",
    directiveTests: [
      "Government-wide grant rules are not the recommendation-specific portfolio risk identification required by GAO.",
      "The page does not publish DOT's risk-rating, monitoring, or response method.",
      "No operating-administration risk profiles or implementation evidence are linked.",
    ],
    nextAction: "Reopen when this page adds DOT-specific ERM guidance, an operating-administration profile, or a portfolio assessment addressing grant-agreement risks.",
  },
  {
    leadId: "lead-56v-09",
    actionKey: "VA-04",
    nearMatchIndex: 0,
    slug: "va-category-management-governance-metrics",
    title: "VA-04: Current governance and portfolio metrics stop short of category-specific savings goals",
    leadType: "Authority and measurement lineage",
    downstream: [
      { source_id: "source-56v-va-category-management-authority-delegation", locator: "June 23, 2026 memorandum, sections 1-7", artifact_function: "Names current execution authority, governance accountability, reporting responsibility, and the objective of reducing unaligned spending.", why_not_target: "The memorandum contains no category-specific cost-avoidance or budget-savings goals, baselines, methods, or progress register." },
      { source_id: "source-56v-va-fy2024-annual-performance-report", locator: "OALC category-management performance measures and FY 2024 results", artifact_function: "Provides the existing spend-under-management and best-in-class measurement lineage and portfolio targets.", why_not_target: "Portfolio spend measures are not the recommendation-specific category-level savings goals and calculation methods requested by GAO." },
    ],
    finding: "VA's June 2026 delegation names the responsible category-management authority and reporting chain, while the FY 2024 performance report identifies portfolio spend-under-management and best-in-class measures. Together they materially narrow governance and measurement lineage but do not supply the expected 180-day response or category-specific savings-goal register.",
    materialNarrowing: "The missing artifact can now be tested against two concrete supporting rails: the current OALC governance delegation and the established OALC performance-measure series.",
    directiveTests: [
      "The performance report provides portfolio category-management measures, not category-specific cost-avoidance and budget-savings goals.",
      "Neither record supplies baselines and calculation methods for each requested category-level goal.",
      "The delegation establishes accountability and reporting authority, but no recommendation-specific tracked progress register is published.",
    ],
    nextAction: "Search the OALC performance series, governance reports, and GAO correspondence for the 180-day letter plus category-level goals, baselines, methods, owners, and progress.",
  },
  {
    leadId: "lead-56v-10",
    actionKey: "VA-05",
    nearMatchIndex: 0,
    slug: "va-dod-transition-plan-of-action-lineage",
    title: "VA-05: The congressional appendix names the JEC plan, POAMM, offices, and target lineage",
    leadType: "Recommendation-specific supporting correspondence",
    downstream: [
      { source_id: "source-56v-va-fy2026-congressional-supplemental-appendices", locator: "Pages 53-54, GAO-24-106189 Recommendation 5 response", artifact_function: "Names the Office of Enterprise Integration, JEC, TEC and HEC, FY 2025 priority guidance, Joint Operating Plan, planned POAMM, gaps-or-redundancies analysis, and then-current target.", why_not_target: "The appendix describes planned work but does not include the Joint Transition Task Force draft assessment, completed findings, recommended changes, or GAO acceptance." },
    ],
    finding: "VA's FY 2026 congressional appendix is a recommendation-specific supporting artifact. It identifies the responsible office, governance bodies, Joint Operating Plan, POAMM, intended gap-or-redundancy analysis, and the then-current completion target. The actual draft effectiveness assessment and its recommendations remain unacquired.",
    materialNarrowing: "The ticket now has four named downstream objects to recover: the FY 2025 JEC Co-Chair Priority Guidance Memorandum, Joint Operating Plan, TEC-HEC POAMM, and Joint Transition Task Force draft assessment.",
    directiveTests: [
      "The appendix describes a planned joint assessment structure but does not publish the completed assessment.",
      "It says the planned work will identify gaps or redundancies but does not contain the resulting findings.",
      "It anticipates analysis and recommendations but does not publish recommended changes or completed joint follow-through.",
    ],
    nextAction: "Search JEC, OEI, TEC, HEC, VA, DOD, and GAO records for the named priority guidance, Joint Operating Plan, POAMM, draft assessment, findings, and recommendations.",
    recommendationSpecificSupportingArtifact: true,
  },
];

const records = specs.map((spec, index) => {
  const parent = parentByAction.get(spec.actionKey);
  if (!parent) throw new Error(`Missing Phase 56U parent for ${spec.actionKey}.`);
  const nearMatch = parent.current_official_near_matches[spec.nearMatchIndex];
  if (!nearMatch) throw new Error(`Missing Phase 56U near-match ${spec.nearMatchIndex} for ${spec.actionKey}.`);
  const agency = spec.actionKey.split("-")[0];
  const sourceRecords = spec.downstream.map((item) => sources.find((source) => source.id === item.source_id));
  if (sourceRecords.some((source) => !source)) throw new Error(`Missing downstream source for ${spec.leadId}.`);
  return {
    ...parent,
    record_id: `record-56v-${spec.slug}`,
    lead_id: spec.leadId,
    action_key: spec.actionKey,
    phase: "56V",
    phase_56u_record_id: parent.record_id,
    phase_56u_near_match: nearMatch,
    phase_56u_near_match_index: spec.nearMatchIndex,
    record_relationship: "Phase 56U official near-match second-order recovery lead",
    document_id: `research-doc-56v-${spec.slug}`,
    signal_id: `signal-56v-${spec.slug}`,
    document_number: 541 + index,
    title: spec.title,
    result_class: "New downstream locator; exact target artifact remains unacquired",
    lead_type: spec.leadType,
    exact_target_artifact_acquired: false,
    recommendation_specific_supporting_artifact_located: spec.recommendationSpecificSupportingArtifact === true,
    official_supporting_artifacts_profiled: spec.downstream.length,
    downstream_source_ids: spec.downstream.map((item) => item.source_id),
    downstream_official_urls: sourceRecords.map((source) => source.url),
    decomposition_path: spec.downstream,
    second_order_finding: spec.finding,
    material_narrowing: spec.materialNarrowing,
    directive_element_tests: parent.directive_matrix.map((item, testIndex) => ({
      directive_element: item.directive_element,
      requirement: item.requirement,
      prior_decision: item.matrix_decision,
      phase_56v_decision: "Not established by located public record",
      downstream_test: spec.directiveTests[testIndex],
      authority_boundary: "A supporting locator or planned instrument cannot fill the directive element by inference; GAO retains recommendation-sufficiency and closure authority.",
    })),
    directive_scope_change: false,
    implementation_change: false,
    closure_change: false,
    current_visible_scope: { supported: 0, partial: 0, not_established: 3 },
    stop_rule: parent.stop_rule,
    reopening_trigger: parent.reopening_trigger,
    next_action: spec.nextAction,
    contact_or_foia_submitted: false,
    search_completion_state: "Second-order public lead decomposed; exact target remains open to named trigger",
    authority_boundary: "A second-order lead, cited plan, budget line, template, authority memorandum, forecast, or supporting correspondence is not the target artifact, GAO acceptance, implementation, closure, entity evidence, or an operating outcome.",
    captured_date: capturedDate,
    agency,
  };
});

const parentPairs = phase56u.records.flatMap((record) => record.current_official_near_matches.map((item) => `${record.action_key}|${item.source_id}|${item.locator}`));
const decomposedPairs = records.map((record) => `${record.action_key}|${record.phase_56u_near_match.source_id}|${record.phase_56u_near_match.locator}`);
if (parentPairs.length !== decomposedPairs.length || parentPairs.some((pair) => !decomposedPairs.includes(pair))) {
  throw new Error("Phase 56V does not decompose every Phase 56U official near-match exactly once.");
}

const ledger = {
  phase: "56V",
  captured_date: capturedDate,
  goal: "Convert all ten Phase 56U official near-matches into named second-order recovery leads and supporting-artifact chains without waiting for dated milestones.",
  public_search_rule: "No FTFN agency contact or FOIA request was submitted. Public source decomposition is not an agency request, response, or evidence of nonexistence.",
  authority_rule: "GAO retains recommendation-acceptance and closure authority. A cited or supporting artifact remains separate from the target artifact and from implementation or operating outcomes.",
  parent_ticket_count: 8,
  parent_near_matches_decomposed: 10,
  lead_chain_count: records.length,
  new_official_source_profiles: sources.length,
  official_supporting_artifacts_profiled: new Set(records.flatMap((record) => record.downstream_source_ids)).size,
  lead_source_assignments: records.reduce((sum, record) => sum + record.official_supporting_artifacts_profiled, 0),
  recommendation_specific_supporting_artifacts_located: records.filter((record) => record.recommendation_specific_supporting_artifact_located).length,
  exact_target_artifacts_acquired: 0,
  material_downstream_locators_added: records.length,
  agency_status_conflicts: ["DOE-05"],
  directive_scope_changes: [],
  implementation_changes: [],
  closure_changes: [],
  prior_visible_scope: phase56u.post_batch_visible_scope,
  post_batch_visible_scope: phase56u.post_batch_visible_scope,
  post_batch_closure_counts: phase56u.post_batch_closure_counts,
  records,
};
await writeJson(join(dataRoot, "phase-56v-second-order-recovery-leads-supporting-artifacts.json"), ledger);

const review = {
  phase: "56V",
  captured_date: capturedDate,
  parent_near_matches_decomposed: 10,
  new_source_profiles: sources.length,
  exact_target_artifacts_acquired: 0,
  recommendation_specific_supporting_artifacts_located: 1,
  directive_scope_changes: 0,
  implementation_changes: 0,
  closure_changes: 0,
  document_decisions: { promoted: records.map((record) => record.document_id), held: [] },
  signal_decisions: { promoted: records.map((record) => record.signal_id), held: [] },
  publication_rule: "Promote only a record that adds a new official locator or materially narrows the recovery chain; preserve the exact-target, directive-scope, GAO-authority, implementation, closure, and outcome boundaries.",
};
await writeJson(join(dataRoot, "phase-56v-publication-review.json"), review);

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const fileNumber = String(record.document_number).padStart(3, "0");
  const archiveName = `${String(record.document_number - 540).padStart(2, "0")}-${record.record_id.replace(/^record-56v-/, "")}.txt`;
  const parentSourceIds = [record.source_id, ...(record.repository_source_ids ?? []), ...(record.new_recovery_source_ids ?? [])];
  await writeJson(join(contentRoot, "research-documents", `${fileNumber}-56v-${record.record_id.replace(/^record-56v-/, "")}.json`), {
    id: record.document_id,
    collection_id: collectionId,
    title: record.title,
    slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: "Published",
    publisher: "Named U.S. government agencies and the U.S. Government Accountability Office",
    publication_date: null,
    document_type: "Oversight Report",
    summary: `${record.official_identity} now has a second-order recovery chain for one Phase 56U near-match. ${record.material_narrowing}`,
    key_findings: [
      `Lead type: ${record.lead_type}.`,
      `Phase 56U near-match: ${record.phase_56u_near_match.relation}.`,
      `Target artifact: ${record.target_artifact}.`,
      `Second-order result: ${record.second_order_finding}`,
      ...record.decomposition_path.map((item) => `Downstream locator: ${item.locator}. Function: ${item.artifact_function} Boundary: ${item.why_not_target}`),
      "Visible directive scope remains 0 supported, 0 partial, and 3 not established.",
      `Next action: ${record.next_action}`,
    ],
    why_it_matters: "The record converts a broad near-match into named offices, documents, attachments, systems, or implementation instruments while retaining the exact evidence gap.",
    ftfn_relevance: [
      `Preserves ${record.action_key} and its exact recommendation identity.`,
      "Adds a reproducible downstream locator without treating the supporting record as the target artifact.",
      "Keeps agency statements, FTFN scope, GAO acceptance, implementation, closure, and outcomes separate.",
    ],
    evidence_limits: [
      "Not publicly acquired does not mean nonexistent, withheld, or never submitted.",
      "A second-order lead or supporting artifact does not establish the missing directive elements or substitute for the target artifact.",
      "FTFN's decomposition does not substitute for GAO's recommendation-sufficiency or closure decision.",
      "Document evidence does not establish performance, readiness, safety, savings, value, ranking, composite score, or causation.",
    ],
    primary_topics: meta.topics,
    framework_layers: meta.layers,
    constraint_tags: ["Regulation", "Data Quality", "Public Trust"],
    source_id: record.downstream_source_ids[0],
    supporting_source_ids: [...new Set([...parentSourceIds, ...record.downstream_source_ids])],
    supporting_official_urls: record.downstream_official_urls,
    official_url: record.downstream_official_urls[0],
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: "Published"\n+summary: ${JSON.stringify(`Second-order recovery for ${record.official_identity} adds ${record.official_supporting_artifacts_profiled} official supporting locator${record.official_supporting_artifacts_profiled === 1 ? "" : "s"}; the exact target remains unacquired.`)}\n+${yamlList("source_ids", [...new Set([record.source_id, ...record.downstream_source_ids])])}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Audited or Verified Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: "The record turns a broad official near-match into named downstream artifacts and a precise remaining target."\n+${yamlList("dependencies", ["exact recommendation identity", "Phase 56U near-match", "named supporting artifact", "GAO acceptance"])}\n+${yamlList("constraints", ["Regulation", "Data Quality", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 56V second-order recovery leads and supporting-artifact decomposition"])}\n+${yamlList("local_implications", ["Do not convert a plan, budget, template, forecast, governance record, or supporting correspondence into target-artifact acquisition, implementation, closure, or outcome."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+---\n+\n+## Second-order result\n+\n+${record.second_order_finding}\n+\n+Exact target artifact acquired: **No**. No agency contact or FOIA request was submitted by FTFN.\n+\n+## Decomposition path\n+\n+${record.decomposition_path.map((item) => `- **${item.locator}:** ${item.artifact_function} ${item.why_not_target}`).join("\n")}\n+\n+## Directive tests\n+\n+${record.directive_element_tests.map((item) => `- **${item.requirement}:** ${item.downstream_test}`).join("\n")}\n+\n+Material narrowing: ${record.material_narrowing}\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary} Visible directive scope remains 0 supported, 0 partial, and 3 not established.\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId,
  title: "GAO Second-Order Recovery Leads and Supporting Artifacts, 2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 56V decomposes all ten Phase 56U official near-matches into named downstream offices, plans, analyses, templates, systems, governance records, and correspondence.",
  scope: "DOE, HHS, DOT, and VA second-order recovery chains for eight recommendation-specific acquisition tickets and ten official near-matches.",
  captured_date: capturedDate,
  document_ids: records.map((record) => record.document_id),
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The thirteen-file archive contains ten second-order recovery records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "The collection adds downstream locators, not target-artifact acquisition. Supporting artifacts, plans, forecasts, templates, and governance records remain separate from GAO acceptance, implementation, closure, entity evidence, and operating outcomes.",
});

const allSignalIds = records.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 026: Second-Order Recovery Leads"\n+slug: "research-watch-026-second-order-recovery-leads"\n+record_status: "Published"\n+summary: "Phase 56V converts ten official near-matches into named supporting-artifact chains while retaining all eight exact-target gaps."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", allSignalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", [
  "All ten Phase 56U official near-matches now resolve to named downstream offices, documents, systems, templates, or correspondence.",
  "Twelve new official source profiles add ten materially narrower locators, including one recommendation-specific VA supporting artifact.",
  "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded.",
])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["The four named VA-DOD JEC transition records", "DOT unified-grants award and deployment records", "DOE Waste Disposal Office analysis attachments", "NNSA and Hanford recommendation-specific decision packages", "HHS completed department-wide AARs"])}\n+---\n+\n+## What Phase 56V adds\n+\n+The ten Phase 56U near-matches are no longer terminal search notes. Each now has a named second-order chain: the office, cited analysis, supporting correspondence, template, planned system, authority memorandum, or policy page that should lead to the next exact record.\n+\n+## Strongest narrowing\n+\n+VA's FY 2026 congressional appendix directly names the Office of Enterprise Integration, Joint Executive Committee, Transition and Health Executive Committees, Joint Operating Plan, planned POAMM, gap-or-redundancy analysis, and then-current target. It is recommendation-specific supporting correspondence, but the draft assessment and its recommendations remain absent.\n+\n+DOE's Hanford chain now resolves from the 2025 supplement analysis to the 2023 HLW analysis of alternatives and Addendum 1. Those records explain the agency's implementation lineage but do not provide the distinct pause and prerequisite package GAO requested.\n+\n+## Evidence boundary\n+\n+A downstream locator is not the target artifact. A plan to assess is not a completed assessment; a procurement forecast is not an operating system; a generic AAR template is not HHS's department-wide SOP or its use; and governance authority or portfolio metrics are not category-specific savings goals. GAO acceptance, implementation, closure, entity evidence, and operating outcomes remain separate.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-026-second-order-recovery-leads.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56v-second-order-recovery-leads.json"), {
  id: "update-2026-08-02-phase-56v-second-order-recovery-leads",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56V decomposes all ten second-order recovery leads",
  summary: "Twelve official sources now resolve the Phase 56U near-matches into ten named downstream chains without changing target-artifact, directive-scope, implementation, closure, or entity-evidence status.",
  affected_record_ids: [collectionId, briefingId, ...allSignalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-026-second-order-recovery-leads/", ...allSignalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "The collection adds downstream locators and one recommendation-specific supporting artifact, not an exact target, GAO acceptance, implementation, closure, or operating outcome; no FTFN agency contact or FOIA request was submitted.",
  work_package: "docs/work-packages/phase-56v-second-order-recovery-leads-supporting-artifacts.md",
});

await writeFile(join(archiveRoot, "README.md"), "# Phase 56V second-order recovery leads\n\nThis archive contains ten official-link recovery records plus consolidated summaries. Supporting artifacts and downstream locators are not the exact target artifacts, and no FTFN agency contact or FOIA request was submitted.\n", "utf8");

console.log(`Generated Phase 56V: ${records.length} lead chains, ${sources.length} source profiles, one recommendation-specific supporting artifact, zero exact target artifacts, and a thirteen-file archive tree.`);
