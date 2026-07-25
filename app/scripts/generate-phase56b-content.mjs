import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionSlug = "entity-operating-panels-2021-2026";
const collectionId = `research-collection-${collectionSlug}`;

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const yamlArray = (items, indent = "  ") => items.map((item) => `${indent}- "${item}"`).join("\n");

const portfolioDefaults = {
  ai_cyber: {
    topics: ["Cybersecurity", "AI for Science", "Policy and Standards"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Cybersecurity", "Standards", "Data Quality", "Safety", "Public Trust"],
    watchLanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    receiving: ["Named federal agency information-security programs"],
  },
  manufacturing: {
    topics: ["Advanced Manufacturing", "Human Futures"],
    layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
    constraints: ["Manufacturing", "Labor", "Data Quality", "Unit Economics", "Supply Chain"],
    watchLanes: ["AI and Advanced Manufacturing", "Cross-Cutting Official Rails"],
    receiving: ["Named U.S. manufacturing facilities and production lines"],
  },
  infrastructure: {
    topics: ["Energy"],
    layers: ["Resource Foundations", "Enabling Infrastructure", "Human Systems"],
    constraints: ["Power", "Infrastructure", "Data Quality", "Safety", "Weather"],
    watchLanes: ["Power and Grid", "Cross-Cutting Official Rails"],
    receiving: ["Named U.S. battery-storage generating plants"],
  },
  mobility: {
    topics: ["Mobility", "Aviation"],
    layers: ["Enabling Infrastructure", "Human Systems"],
    constraints: ["Regulation", "Safety", "Infrastructure", "Data Quality", "Public Trust"],
    watchLanes: ["Mobility Certification", "Cross-Cutting Official Rails"],
    receiving: ["Named U.S. reporting operating air carriers"],
  },
};

const records = [
  {
    portfolio: "ai_cyber",
    slug: "nasa-fisma-fy2022",
    title: "NASA FISMA Evaluation: Fiscal Year 2022",
    publisher: "NASA Office of Inspector General",
    publicationDate: "2022-12-19",
    url: "https://oig.nasa.gov/wp-content/uploads/2024/02/IG-23-006.pdf",
    type: "Inspector General Evaluation",
    summary: "NASA OIG rated the agency information-security program Level 3, Consistently Implemented, below the federal effectiveness threshold.",
    finding: "NASA received an overall Level 3 rating; the evaluation said quantitative and qualitative effectiveness measures were lacking.",
    limit: "The agency-level maturity rating does not measure equivalent system risk, incident exposure, mission effect, or control performance.",
  },
  {
    portfolio: "ai_cyber",
    slug: "nasa-fisma-fy2023",
    title: "NASA FISMA Evaluation: Fiscal Year 2023",
    publisher: "NASA Office of Inspector General",
    publicationDate: "2023-08-17",
    url: "https://oig.nasa.gov/office-of-inspector-general-oig/ig-23-017/",
    type: "Inspector General Evaluation",
    summary: "NASA OIG reported that the agency maintained a consistently implemented information-security rating but remained below the federal effectiveness threshold.",
    finding: "NASA remained at Level 3, Consistently Implemented, for FY 2023.",
    limit: "The evaluation period ended May 31, 2023, and the maturity metric set can change between reporting cycles.",
  },
  {
    portfolio: "ai_cyber",
    slug: "nasa-fisma-fy2024",
    title: "NASA FISMA Evaluation: Fiscal Year 2024",
    publisher: "NASA Office of Inspector General",
    publicationDate: "2024-09-12",
    url: "https://oig.nasa.gov/office-of-inspector-general-oig/evaluation-of-nasas-information-security-program-under-the-federal-information-security-modernization-act-for-fiscal-year-2024/",
    type: "Inspector General Evaluation",
    summary: "NASA OIG again rated the agency information-security program Level 3, Consistently Implemented.",
    finding: "NASA remained at Level 3; the evaluation again identified missing quantitative and qualitative effectiveness measures.",
    limit: "A repeated maturity label does not establish unchanged risk, control coverage, incidents, recovery, or mission outcomes.",
  },
  {
    portfolio: "ai_cyber",
    slug: "dhs-fisma-fy2021",
    title: "DHS Information Security Program Evaluation: Fiscal Year 2021",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: "2022-08-01",
    url: "https://www.oig.dhs.gov/sites/default/files/assets/2022-08/OIG-22-55-Aug22.pdf",
    type: "Inspector General Evaluation",
    summary: "DHS OIG rated the department information-security program ineffective for FY 2021, with three of five functions at Level 3.",
    finding: "The FY 2021 program was rated ineffective; Coast Guard ratings were excluded from the department-wide effectiveness determination.",
    limit: "The Coast Guard scope exclusion and fiscal-year metric design must remain attached to this baseline.",
  },
  {
    portfolio: "ai_cyber",
    slug: "dhs-fisma-fy2022",
    title: "DHS Information Security Program Evaluation: Fiscal Year 2022",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: "2023-04-17",
    url: "https://www.oig.dhs.gov/sites/default/files/assets/2023-04/OIG-23-21-Apr23.pdf",
    type: "Inspector General Evaluation",
    summary: "DHS OIG rated the department program effective for FY 2022 and reported Level 4 in four functions and Level 3 in Detect.",
    finding: "DHS improved maturity in three functions from FY 2021 and crossed the reporting instruction's effectiveness threshold.",
    limit: "An overall effectiveness label does not remove the six deficiencies identified in the evaluation.",
  },
  {
    portfolio: "ai_cyber",
    slug: "dhs-fisma-fy2023",
    title: "DHS Information Security Program Evaluation: Fiscal Year 2023",
    publisher: "Department of Homeland Security Office of Inspector General",
    publicationDate: "2024-06-04",
    url: "https://www.oig.dhs.gov/sites/default/files/assets/2024-06/OIG-24-26-Jun24.pdf",
    type: "Inspector General Evaluation",
    summary: "DHS OIG rated the program effective for FY 2023, with all five cybersecurity functions at Level 4.",
    finding: "DHS received Level 4, Managed and Measurable, in Identify, Protect, Detect, Respond, and Recover.",
    limit: "The evaluation still identified department-wide execution deficiencies and tested only selected systems and components.",
  },
  {
    portfolio: "ai_cyber",
    slug: "hhs-fisma-fy2022",
    title: "HHS FISMA Compliance Review: Fiscal Year 2022",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2023-05-09",
    url: "https://oig.hhs.gov/reports/all/2023/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2022/",
    type: "Inspector General Evaluation",
    summary: "HHS OIG rated the department information-security program Not Effective for FY 2022.",
    finding: "HHS did not meet Managed and Measurable maturity for the core metrics in all five cybersecurity functions.",
    limit: "The audit tested the department and four of twelve operating divisions, so operating-division variation remains visible.",
  },
  {
    portfolio: "ai_cyber",
    slug: "hhs-fisma-fy2023",
    title: "HHS FISMA Compliance Review: Fiscal Year 2023",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2024-06-26",
    url: "https://oig.hhs.gov/reports/all/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2023/",
    type: "Inspector General Evaluation",
    summary: "HHS OIG rated the department information-security program Not Effective for FY 2023, unchanged from FY 2022.",
    finding: "The department remained below Managed and Measurable maturity across the five cybersecurity functions.",
    limit: "The department's federated operating-division model prevents the headline rating from representing identical control maturity across components.",
  },
  {
    portfolio: "ai_cyber",
    slug: "hhs-fisma-fy2024",
    title: "HHS FISMA Compliance Review: Fiscal Year 2024",
    publisher: "Department of Health and Human Services Office of Inspector General",
    publicationDate: "2024-11-15",
    url: "https://oig.hhs.gov/reports/all/2024/review-of-the-department-of-health-and-human-services-compliance-with-the-federal-information-security-modernization-act-of-2014-for-fiscal-year-2024/",
    type: "Inspector General Evaluation",
    summary: "HHS OIG again rated the department information-security program Not Effective for FY 2024.",
    finding: "HHS remained below Managed and Measurable maturity for the core and supplemental metrics across the five functions.",
    limit: "The rating is an agency-program assessment, not a measure of incident rate, affected people, service disruption, or health-program outcomes.",
  },
  {
    portfolio: "manufacturing",
    slug: "nist-mep-current-applications-lean",
    title: "Lean Tools Provide Lead Time Reduction: Current Applications",
    publisher: "National Institute of Standards and Technology",
    publicationDate: "2026-01-13",
    url: "https://www.nist.gov/mep/successstories/2024/lean-tools-provide-lead-time-reduction",
    type: "MEP Success Story",
    summary: "A NIST MEP success story reports that Current Applications increased one line from 40 to 105 units per day and reduced WIP from 105 to 5 units.",
    finding: "The reported intervention also reduced lead time by 50 percent and eliminated a 1,000-unit backlog.",
    limit: "Results are company- and program-attributed case-study outcomes, not an independently audited counterfactual or sector benchmark.",
  },
  {
    portfolio: "manufacturing",
    slug: "nist-mep-island-components-lean",
    title: "Success Lean Process Implementation: Island Components Group",
    publisher: "National Institute of Standards and Technology",
    publicationDate: "2024-07-17",
    url: "https://www.nist.gov/mep/successstories/2024/success-lean-process-implementation",
    type: "MEP Success Story",
    summary: "A NIST MEP success story reports Island Components Group output increasing from 75 to 120 units daily.",
    finding: "The case study also reports WIP falling from 717 to 156 pieces after one-piece-flow and bottleneck-management changes.",
    limit: "The before-and-after result is attributed to one facility intervention and does not establish persistence, causality, quality, labor, or customer outcomes.",
  },
  {
    portfolio: "manufacturing",
    slug: "nist-mep-monaghan-medical-lean",
    title: "Lean Implementation Thrives at Monaghan Medical",
    publisher: "National Institute of Standards and Technology",
    publicationDate: "2025-01-14",
    url: "https://www.nist.gov/mep/successstories/2024/lean-implementation-thrives-monaghan-medical",
    type: "MEP Success Story",
    summary: "A NIST MEP success story reports one Monaghan Medical line increasing from 6,000 to 9,000 units per day.",
    finding: "The same case study reports one process cycle falling from ten minutes to seven minutes.",
    limit: "The record covers one identified line and process; it does not establish company-wide or sustained productivity, quality, cost, or demand effects.",
  },
  {
    portfolio: "infrastructure",
    slug: "eia860-2021",
    title: "Form EIA-860 Final Data: 2021",
    publisher: "U.S. Energy Information Administration",
    publicationDate: null,
    url: "https://www.eia.gov/electricity/data/eia860/archive/xls/eia8602021.zip",
    type: "Official Dataset",
    summary: "The 2021 EIA-860 generator inventory provides plant- and generator-level nameplate power capacity for operating U.S. electric generators.",
    finding: "FTFN uses the operable-generator table and stable plant codes to establish the 2021 observation for three named battery plants.",
    limit: "Nameplate power capacity is not stored energy, duration, availability, dispatch, revenue, safety, or grid-service performance.",
  },
  {
    portfolio: "infrastructure",
    slug: "eia860-2022",
    title: "Form EIA-860 Final Data: 2022",
    publisher: "U.S. Energy Information Administration",
    publicationDate: null,
    url: "https://www.eia.gov/electricity/data/eia860/archive/xls/eia8602022.zip",
    type: "Official Dataset",
    summary: "The 2022 EIA-860 generator inventory extends the same plant-code and nameplate-capacity rail.",
    finding: "FTFN sums operating battery-generator nameplate capacity inside each selected plant code.",
    limit: "Annual final data can revise plant names, generator status, ownership, and capacity; the data vintage remains attached.",
  },
  {
    portfolio: "infrastructure",
    slug: "eia860-2023",
    title: "Form EIA-860 Final Data: 2023",
    publisher: "U.S. Energy Information Administration",
    publicationDate: null,
    url: "https://www.eia.gov/electricity/data/eia860/archive/xls/eia8602023.zip",
    type: "Official Dataset",
    summary: "The 2023 EIA-860 generator inventory supplies the third compatible plant-level nameplate-capacity observation.",
    finding: "The stable plant-code panel shows one capacity change and two unchanged nameplate totals across the three selected assets.",
    limit: "Unchanged or higher nameplate capacity does not establish availability, utilization, customer reliability, safety, or financial performance.",
  },
  {
    portfolio: "mobility",
    slug: "bts-atcr-full-year-2024",
    title: "Air Travel Consumer Report: Full Year 2024",
    publisher: "Bureau of Transportation Statistics",
    publicationDate: "2025-03-14",
    url: "https://www.bts.gov/newsroom/air-travel-consumer-report-december-2024-full-year-2024-numbers",
    type: "Official Data Release",
    summary: "The BTS release provides the full-year 2024 Air Travel Consumer Report context for scheduled domestic flights, delays, and cancellations.",
    finding: "The carrier reporting program is governed by 14 CFR Part 234 and covers qualifying U.S. reporting carriers.",
    limit: "Marketing networks and operating carriers are different denominators; FTFN uses only reporting operating-carrier cancellation rows.",
  },
  {
    portfolio: "mobility",
    slug: "dot-atcr-february-2026",
    title: "Air Travel Consumer Report: February 2026",
    publisher: "U.S. Department of Transportation Office of Aviation Consumer Protection",
    publicationDate: null,
    url: "https://www.transportation.gov/sites/dot.gov/files/2026-03/February_2026%20ATCR.pdf",
    type: "Official Data Report",
    summary: "Table 6C reports 2025 and 2024 scheduled operations, cancellations, and cancellation rates for U.S. reporting operating carriers.",
    finding: "FTFN retains each carrier's scheduled-flight denominator and compares only the same operating-carrier row across the two years.",
    limit: "The table is labeled as a ranking, but FTFN does not reproduce or infer a cross-carrier ranking; schedule mix and operating conditions differ.",
  },
];

const sourceId = (slug) => `source-56b-${slug}`;
const documentId = (slug) => `research-doc-56b-${slug}`;

const panels = [
  {
    id: "panel-56b-nasa-fisma",
    portfolio: "ai_cyber",
    entity_id: "agency-nasa",
    entity_name: "National Aeronautics and Space Administration",
    entity_type: "Federal agency",
    indicator: "Inspector-general FISMA program maturity",
    unit: "FISMA maturity level",
    denominator: "NASA agency information-security program under the stated fiscal-year IG metrics",
    period: "Fiscal years 2022-2024",
    geography: "United States federal civil-space agency",
    method: "Annual independent FISMA evaluation using the applicable IG metrics",
    attribution: "NASA Office of Inspector General and its independent evaluator",
    signal_slug: "nasa-fisma-panel",
    signal_title: "NASA remained at FISMA Level 3 across fiscal years 2022 through 2024",
    signal_summary: "NASA's inspector-general evaluations reported Level 3, Consistently Implemented, in FY 2022, FY 2023, and FY 2024. The repeated label shows maturity continuity while each report says the program remained below the effectiveness threshold.",
    boundary: "Publish the repeated agency-program rating only. Do not infer unchanged cyber risk, system performance, incidents, mission effect, or equivalence with another agency.",
    watch: "Track FY 2025 metrics, function-level maturity, control testing, authorization age, remediation, incidents, recovery, affected services, and mission effects.",
    source_slugs: ["nasa-fisma-fy2022", "nasa-fisma-fy2023", "nasa-fisma-fy2024"],
    observations: [
      { period: "FY 2022", value: 3, label: "Level 3 - Consistently Implemented", source_slug: "nasa-fisma-fy2022" },
      { period: "FY 2023", value: 3, label: "Level 3 - Consistently Implemented", source_slug: "nasa-fisma-fy2023" },
      { period: "FY 2024", value: 3, label: "Level 3 - Consistently Implemented", source_slug: "nasa-fisma-fy2024" },
    ],
    reporting_breaks: ["The FY 2023 evaluation period ended May 31, 2023; annual metric sets can change."],
  },
  {
    id: "panel-56b-dhs-fisma",
    portfolio: "ai_cyber",
    entity_id: "agency-dhs",
    entity_name: "Department of Homeland Security",
    entity_type: "Federal agency",
    indicator: "Inspector-general FISMA program effectiveness",
    unit: "Annual effectiveness determination",
    denominator: "DHS department information-security program under the stated fiscal-year IG metrics",
    period: "Fiscal years 2021-2023",
    geography: "United States federal homeland-security department",
    method: "Annual independent FISMA evaluation with function-level maturity testing",
    attribution: "DHS Office of Inspector General and its independent evaluator",
    signal_slug: "dhs-fisma-panel",
    signal_title: "DHS moved from an ineffective FY 2021 FISMA rating to effective ratings in FY 2022 and FY 2023",
    signal_summary: "DHS OIG rated the department program ineffective in FY 2021, effective in FY 2022, and effective in FY 2023. The FY 2023 evaluation reported Level 4 in all five functions, while continuing to identify execution deficiencies.",
    boundary: "Publish the within-agency sequence with the Coast Guard scope note and annual metric rules attached. Do not turn it into a cross-agency ranking or a claim that deficiencies or incidents ended.",
    watch: "Track later department and component ratings, metric changes, tested-system coverage, overdue corrective actions, vulnerabilities, incidents, and recovery.",
    source_slugs: ["dhs-fisma-fy2021", "dhs-fisma-fy2022", "dhs-fisma-fy2023"],
    observations: [
      { period: "FY 2021", value: 0, label: "Ineffective", source_slug: "dhs-fisma-fy2021" },
      { period: "FY 2022", value: 1, label: "Effective", source_slug: "dhs-fisma-fy2022" },
      { period: "FY 2023", value: 1, label: "Effective", source_slug: "dhs-fisma-fy2023" },
    ],
    reporting_breaks: ["The FY 2021 department-wide determination excluded Coast Guard ratings.", "Annual FISMA reporting instructions and calculated-average methods can change."],
  },
  {
    id: "panel-56b-hhs-fisma",
    portfolio: "ai_cyber",
    entity_id: "agency-hhs",
    entity_name: "Department of Health and Human Services",
    entity_type: "Federal agency",
    indicator: "Inspector-general FISMA program effectiveness",
    unit: "Annual effectiveness determination",
    denominator: "HHS department information-security program under the stated fiscal-year IG metrics",
    period: "Fiscal years 2022-2024",
    geography: "United States federal health department",
    method: "Annual independent FISMA audit using core and applicable supplemental IG metrics",
    attribution: "HHS Office of Inspector General and its independent auditor",
    signal_slug: "hhs-fisma-panel",
    signal_title: "HHS remained Not Effective under FISMA across fiscal years 2022 through 2024",
    signal_summary: "HHS OIG rated the department information-security program Not Effective in FY 2022, FY 2023, and FY 2024. The repeated rating reflects a department-level threshold and does not erase variation among operating divisions.",
    boundary: "Publish the repeated department rating only. Do not equate the headline result with identical component risk, incidents, health-service disruption, or patient harm.",
    watch: "Track operating-division maturity, tested coverage, inventory accuracy, corrective-action closure, incident exposure, service disruption, and later metric changes.",
    source_slugs: ["hhs-fisma-fy2022", "hhs-fisma-fy2023", "hhs-fisma-fy2024"],
    observations: [
      { period: "FY 2022", value: 0, label: "Not Effective", source_slug: "hhs-fisma-fy2022" },
      { period: "FY 2023", value: 0, label: "Not Effective", source_slug: "hhs-fisma-fy2023" },
      { period: "FY 2024", value: 0, label: "Not Effective", source_slug: "hhs-fisma-fy2024" },
    ],
    reporting_breaks: ["Audit sampling and the set of reviewed operating divisions can differ by year."],
  },
  {
    id: "panel-56b-current-applications-output",
    portfolio: "manufacturing",
    entity_id: "manufacturer-current-applications-watertown-ny",
    entity_name: "Current Applications",
    entity_type: "Manufacturing company",
    indicator: "Reported production output on the improved line",
    unit: "Units per day",
    denominator: "The product line described in the NIST MEP case study",
    period: "Before and after the reported lean intervention",
    geography: "Watertown, New York",
    method: "Company-attributed before-and-after result reported in a NIST MEP success story",
    attribution: "Current Applications, CITEC, New York MEP, and NIST MEP",
    signal_slug: "current-applications-output-panel",
    signal_title: "Current Applications reported production rising from 40 to 105 units per day on one line",
    signal_summary: "The NIST MEP case study reports a 2.5-fold increase from 40 to 105 units per day, a 50 percent lead-time reduction, and WIP falling from 105 to 5 units after lean changes.",
    boundary: "Publish as a company- and program-attributed intervention result. Do not infer audited causality, persistence, company-wide productivity, quality, labor intensity, or customer outcomes.",
    watch: "Track later output, product mix, labor hours, first-pass yield, scrap, downtime, delivery, demand, WIP, and independent validation.",
    source_slugs: ["nist-mep-current-applications-lean"],
    observations: [
      { period: "Pre-intervention", value: 40, label: "40 units per day", source_slug: "nist-mep-current-applications-lean" },
      { period: "Post-intervention", value: 105, label: "105 units per day", source_slug: "nist-mep-current-applications-lean" },
    ],
    reporting_breaks: ["The official case study does not state observation dates or a repeated post-intervention measurement window."],
  },
  {
    id: "panel-56b-island-components-output",
    portfolio: "manufacturing",
    entity_id: "manufacturer-island-components-hauppauge-ny",
    entity_name: "Island Components Group",
    entity_type: "Manufacturing company",
    indicator: "Reported daily motor-assembly output",
    unit: "Units per day",
    denominator: "The department and motor-assembly flow described in the NIST MEP case study",
    period: "Before and after the reported lean intervention",
    geography: "Hauppauge, New York",
    method: "Company-attributed before-and-after result reported in a NIST MEP success story",
    attribution: "Island Components Group, Long Island MEP, New York MEP, and NIST MEP",
    signal_slug: "island-components-output-panel",
    signal_title: "Island Components reported daily output increasing from 75 to 120 units",
    signal_summary: "The NIST MEP case study reports output increasing from 75 to 120 units daily and WIP declining from 717 to 156 pieces after one-piece-flow and bottleneck-management changes.",
    boundary: "Publish the facility intervention result without converting it into a benchmark, causal estimate, or statement about quality, labor, cost, delivery, or sustained demand.",
    watch: "Track the same line's output, labor hours, WIP, first-pass yield, defects, downtime, delivery, cost, and persistence.",
    source_slugs: ["nist-mep-island-components-lean"],
    observations: [
      { period: "Pre-intervention", value: 75, label: "75 units per day", source_slug: "nist-mep-island-components-lean" },
      { period: "Post-intervention", value: 120, label: "120 units per day", source_slug: "nist-mep-island-components-lean" },
    ],
    reporting_breaks: ["The case study does not expose the measurement window, product-mix adjustment, or later follow-up."],
  },
  {
    id: "panel-56b-monaghan-medical-output",
    portfolio: "manufacturing",
    entity_id: "manufacturer-monaghan-medical-plattsburgh-ny",
    entity_name: "Monaghan Medical",
    entity_type: "Manufacturing company",
    indicator: "Reported daily output on one production line",
    unit: "Units per day",
    denominator: "The production line described in the NIST MEP case study",
    period: "Before and after the reported lean intervention",
    geography: "Plattsburgh, New York",
    method: "Company-attributed before-and-after result reported in a NIST MEP success story",
    attribution: "Monaghan Medical, CITEC, New York MEP, and NIST MEP",
    signal_slug: "monaghan-medical-output-panel",
    signal_title: "Monaghan Medical reported one line increasing from 6,000 to 9,000 units per day",
    signal_summary: "The NIST MEP case study reports a 50 percent output increase on one line, from 6,000 to 9,000 units per day, and one process cycle falling from ten to seven minutes.",
    boundary: "Publish as one line's attributed result. Do not generalize it to the whole company, sector productivity, product quality, labor displacement, cost, or clinical outcomes.",
    watch: "Track line identity, output, product mix, labor hours, first-pass yield, scrap, downtime, cost, delivery, demand, and later measurements.",
    source_slugs: ["nist-mep-monaghan-medical-lean"],
    observations: [
      { period: "Pre-intervention", value: 6000, label: "6,000 units per day", source_slug: "nist-mep-monaghan-medical-lean" },
      { period: "Post-intervention", value: 9000, label: "9,000 units per day", source_slug: "nist-mep-monaghan-medical-lean" },
    ],
    reporting_breaks: ["The case study does not state a post-intervention follow-up period or company-wide denominator."],
  },
  {
    id: "panel-56b-moss-landing-battery-capacity",
    portfolio: "infrastructure",
    entity_id: "eia-plant-260",
    entity_name: "Dynegy Moss Landing Power Plant Hybrid",
    entity_type: "Battery-storage generating plant",
    indicator: "Operating battery-generator nameplate power capacity",
    unit: "Megawatts",
    denominator: "Operating battery generators assigned to EIA plant code 260 in each final EIA-860 vintage",
    period: "Calendar years 2021-2023",
    geography: "California, United States",
    method: "Sum of nameplate capacity for operating battery generators in the final annual EIA-860 generator inventory",
    attribution: "U.S. Energy Information Administration; FTFN plant-code aggregation",
    signal_slug: "moss-landing-capacity-panel",
    signal_title: "Moss Landing battery nameplate power capacity rose from 400 MW to 750 MW by 2023",
    signal_summary: "Final EIA-860 inventories list 400 MW in 2021, 400 MW in 2022, and 750 MW in 2023 for operating battery generators at stable plant code 260.",
    boundary: "Publish the nameplate power-capacity panel only. Do not infer energy duration, availability, utilization, safety, dispatch, revenue, grid service, or customer reliability.",
    watch: "Track later EIA vintages, generator additions and retirements, energy capacity, availability, incidents, dispatch, revenue, and grid-service results.",
    source_slugs: ["eia860-2021", "eia860-2022", "eia860-2023"],
    observations: [
      { period: "2021", value: 400, label: "400 MW", source_slug: "eia860-2021" },
      { period: "2022", value: 400, label: "400 MW", source_slug: "eia860-2022" },
      { period: "2023", value: 750, label: "750 MW", source_slug: "eia860-2023" },
    ],
    reporting_breaks: ["Plant name and generator records can be revised in later EIA vintages; plant code 260 is the stable identity key."],
  },
  {
    id: "panel-56b-manatee-battery-capacity",
    portfolio: "infrastructure",
    entity_id: "eia-plant-60014",
    entity_name: "Manatee Solar Energy Center",
    entity_type: "Battery-storage generating plant",
    indicator: "Operating battery-generator nameplate power capacity",
    unit: "Megawatts",
    denominator: "Operating battery generators assigned to EIA plant code 60014 in each final EIA-860 vintage",
    period: "Calendar years 2021-2023",
    geography: "Florida, United States",
    method: "Sum of nameplate capacity for operating battery generators in the final annual EIA-860 generator inventory",
    attribution: "U.S. Energy Information Administration; FTFN plant-code aggregation",
    signal_slug: "manatee-capacity-panel",
    signal_title: "Manatee Solar Energy Center retained 409 MW of battery nameplate power capacity across 2021-2023",
    signal_summary: "Final EIA-860 inventories list 409 MW in each of 2021, 2022, and 2023 for operating battery generators at stable plant code 60014.",
    boundary: "An unchanged nameplate value is not evidence of unchanged operating performance, stored energy, availability, safety, utilization, or customer benefit.",
    watch: "Track later EIA vintages, energy duration, availability, incidents, dispatch, curtailment, revenue, and grid-service performance.",
    source_slugs: ["eia860-2021", "eia860-2022", "eia860-2023"],
    observations: [
      { period: "2021", value: 409, label: "409 MW", source_slug: "eia860-2021" },
      { period: "2022", value: 409, label: "409 MW", source_slug: "eia860-2022" },
      { period: "2023", value: 409, label: "409 MW", source_slug: "eia860-2023" },
    ],
    reporting_breaks: ["Plant and generator records can be revised in later EIA vintages; plant code 60014 is the stable identity key."],
  },
  {
    id: "panel-56b-gateway-battery-capacity",
    portfolio: "infrastructure",
    entity_id: "eia-plant-63834",
    entity_name: "Gateway Energy Storage System",
    entity_type: "Battery-storage generating plant",
    indicator: "Operating battery-generator nameplate power capacity",
    unit: "Megawatts",
    denominator: "Operating battery generators assigned to EIA plant code 63834 in each final EIA-860 vintage",
    period: "Calendar years 2021-2023",
    geography: "California, United States",
    method: "Sum of nameplate capacity for operating battery generators in the final annual EIA-860 generator inventory",
    attribution: "U.S. Energy Information Administration; FTFN plant-code aggregation",
    signal_slug: "gateway-capacity-panel",
    signal_title: "Gateway Energy Storage retained 250 MW of battery nameplate power capacity across 2021-2023",
    signal_summary: "Final EIA-860 inventories list 250 MW in each of 2021, 2022, and 2023 for operating battery generators at stable plant code 63834.",
    boundary: "Publish the repeated nameplate figure without treating it as availability, utilization, safety, duration, revenue, grid service, or reliability performance.",
    watch: "Track later EIA vintages, energy duration, availability, incidents, dispatch, revenue, and grid-service performance.",
    source_slugs: ["eia860-2021", "eia860-2022", "eia860-2023"],
    observations: [
      { period: "2021", value: 250, label: "250 MW", source_slug: "eia860-2021" },
      { period: "2022", value: 250, label: "250 MW", source_slug: "eia860-2022" },
      { period: "2023", value: 250, label: "250 MW", source_slug: "eia860-2023" },
    ],
    reporting_breaks: ["Plant and generator records can be revised in later EIA vintages; plant code 63834 is the stable identity key."],
  },
  {
    id: "panel-56b-united-cancellations",
    portfolio: "mobility",
    entity_id: "dot-operating-carrier-united-airlines",
    entity_name: "United Airlines",
    entity_type: "Reporting operating air carrier",
    indicator: "Cancelled scheduled domestic flight operations",
    unit: "Percent of scheduled operations cancelled",
    denominator: "Scheduled domestic flight operations reported for United Airlines as an operating carrier",
    period: "Calendar years 2024 and 2025",
    geography: "United States domestic system",
    method: "DOT Air Travel Consumer Report Table 6C under 14 CFR Part 234",
    attribution: "Carrier-filed BTS data published by DOT OACP",
    signal_slug: "united-cancellation-panel",
    signal_title: "United Airlines' reported operating-carrier cancellation rate fell from 1.64% in 2024 to 0.82% in 2025",
    signal_summary: "DOT Table 6C reports 12,478 cancellations from 760,451 scheduled operations in 2024 and 6,527 from 795,271 in 2025 for United Airlines as an operating carrier.",
    boundary: "Publish the within-carrier change only. Do not reproduce the report's carrier ranking or infer safety, customer experience, causality, schedule quality, or network equivalence.",
    watch: "Track later full-year reports, schedule mix, weather, airport exposure, completion, delays, complaints, accessibility, and revision notices.",
    source_slugs: ["bts-atcr-full-year-2024", "dot-atcr-february-2026"],
    observations: [
      { period: "2024", value: 1.64, label: "12,478 of 760,451 scheduled operations; 1.64%", source_slug: "dot-atcr-february-2026" },
      { period: "2025", value: 0.82, label: "6,527 of 795,271 scheduled operations; 0.82%", source_slug: "dot-atcr-february-2026" },
    ],
    reporting_breaks: ["Use only the operating-carrier row; do not mix it with the United Airlines Network marketing-carrier row."],
  },
  {
    id: "panel-56b-southwest-cancellations",
    portfolio: "mobility",
    entity_id: "dot-operating-carrier-southwest-airlines",
    entity_name: "Southwest Airlines",
    entity_type: "Reporting operating air carrier",
    indicator: "Cancelled scheduled domestic flight operations",
    unit: "Percent of scheduled operations cancelled",
    denominator: "Scheduled domestic flight operations reported for Southwest Airlines as an operating carrier",
    period: "Calendar years 2024 and 2025",
    geography: "United States domestic system",
    method: "DOT Air Travel Consumer Report Table 6C under 14 CFR Part 234",
    attribution: "Carrier-filed BTS data published by DOT OACP",
    signal_slug: "southwest-cancellation-panel",
    signal_title: "Southwest Airlines' reported operating-carrier cancellation rate moved from 0.83% in 2024 to 0.85% in 2025",
    signal_summary: "DOT Table 6C reports 11,772 cancellations from 1,419,419 scheduled operations in 2024 and 11,799 from 1,391,885 in 2025 for Southwest Airlines.",
    boundary: "Describe the small two-point movement without calling it a durable trend or comparing rank. Schedule mix, weather, network structure, and operating conditions remain separate.",
    watch: "Track later full-year reports, schedule mix, weather, airport exposure, completion, delays, complaints, accessibility, and revisions.",
    source_slugs: ["bts-atcr-full-year-2024", "dot-atcr-february-2026"],
    observations: [
      { period: "2024", value: 0.83, label: "11,772 of 1,419,419 scheduled operations; 0.83%", source_slug: "dot-atcr-february-2026" },
      { period: "2025", value: 0.85, label: "11,799 of 1,391,885 scheduled operations; 0.85%", source_slug: "dot-atcr-february-2026" },
    ],
    reporting_breaks: ["Two annual observations do not establish a durable trend; future carrier structure and reporting rules can change."],
  },
  {
    id: "panel-56b-delta-cancellations",
    portfolio: "mobility",
    entity_id: "dot-operating-carrier-delta-air-lines",
    entity_name: "Delta Air Lines",
    entity_type: "Reporting operating air carrier",
    indicator: "Cancelled scheduled domestic flight operations",
    unit: "Percent of scheduled operations cancelled",
    denominator: "Scheduled domestic flight operations reported for Delta Air Lines as an operating carrier",
    period: "Calendar years 2024 and 2025",
    geography: "United States domestic system",
    method: "DOT Air Travel Consumer Report Table 6C under 14 CFR Part 234",
    attribution: "Carrier-filed BTS data published by DOT OACP",
    signal_slug: "delta-cancellation-panel",
    signal_title: "Delta Air Lines' reported operating-carrier cancellation rate rose from 0.91% in 2024 to 1.08% in 2025",
    signal_summary: "DOT Table 6C reports 9,147 cancellations from 1,009,194 scheduled operations in 2024 and 11,114 from 1,026,332 in 2025 for Delta Air Lines as an operating carrier.",
    boundary: "Publish the within-carrier movement only. Do not reproduce a rank or infer safety, service quality, causality, network equivalence, or a durable trend from two points.",
    watch: "Track later full-year reports, schedule mix, weather, airport exposure, completion, delays, complaints, accessibility, and revisions.",
    source_slugs: ["bts-atcr-full-year-2024", "dot-atcr-february-2026"],
    observations: [
      { period: "2024", value: 0.91, label: "9,147 of 1,009,194 scheduled operations; 0.91%", source_slug: "dot-atcr-february-2026" },
      { period: "2025", value: 1.08, label: "11,114 of 1,026,332 scheduled operations; 1.08%", source_slug: "dot-atcr-february-2026" },
    ],
    reporting_breaks: ["Use only the operating-carrier row; do not mix it with the Delta Air Lines Network marketing-carrier row."],
  },
];

const holdSignals = [
  {
    portfolio: "ai_cyber",
    slug: "agency-fisma-ranking-hold",
    title: "Cross-agency FISMA ranking remains held",
    summary: "NASA, DHS, and HHS now have named multi-year panels, but agency scope, component structure, sampling, annual metric design, and tested systems are not one comparable denominator.",
    boundary: "Do not rank agencies or average binary effectiveness and maturity levels. Publish only within-agency sequences with annual scope notes.",
  },
  {
    portfolio: "manufacturing",
    slug: "manufacturer-productivity-ranking-hold",
    title: "Cross-manufacturer productivity ranking remains held",
    summary: "Three named manufacturers report before-and-after output changes, but their products, lines, time windows, labor inputs, quality, demand, and attribution methods differ.",
    boundary: "Do not rank companies, calculate one productivity score, or present MEP-attributed case studies as audited causal effects.",
  },
  {
    portfolio: "infrastructure",
    slug: "battery-performance-ranking-hold",
    title: "Battery-asset performance ranking remains held",
    summary: "Three battery plants now have stable plant-code capacity panels, but nameplate megawatts alone do not measure energy duration, availability, dispatch, safety, revenue, grid service, or customer reliability.",
    boundary: "Do not rank asset performance from nameplate capacity or interpret unchanged capacity as unchanged operation.",
  },
  {
    portfolio: "mobility",
    slug: "carrier-ranking-hold",
    title: "Cross-carrier performance ranking remains held",
    summary: "Three reporting operating carriers now have two-year cancellation panels, but schedule mix, networks, weather, airports, causes, branded-code-share structures, and customer effects differ.",
    boundary: "Do not reproduce the source table's rank or combine cancellation rates with delays, complaints, safety, accessibility, or customer value.",
  },
];

for (const directory of [
  "sources",
  "research-documents",
  "research-collections",
  "signals",
  "briefings",
  "updates",
]) {
  await mkdir(join(contentRoot, directory), { recursive: true });
}

for (const [index, record] of records.entries()) {
  const defaults = portfolioDefaults[record.portfolio];
  const id = sourceId(record.slug);
  const source = {
    id,
    name: record.title,
    url: record.url,
    source_type: record.type === "Official Dataset" ? "Dataset" : "Government Agency",
    credibility_level: "Tier 1",
    primary_topics: defaults.topics,
    framework_layers: defaults.layers,
    country_or_region: "United States",
    update_frequency: record.type.includes("Evaluation") ? "Annual" : record.type.includes("Dataset") ? "Annual" : "One-time",
    capture_priority: "High",
    known_limitations: `${record.limit} Comparison contract: named-entity observations remain inside the stated unit, denominator, period, geography, method, and attribution.`,
    last_checked_date: capturedDate,
    watch_lanes: defaults.watchLanes,
    live_access_type:
      record.type === "Official Dataset"
        ? "Data Download"
        : record.type === "Official Data Release" || record.type === "MEP Success Story"
          ? "Release Page"
          : "Report Series",
    review_cadence_days: 90,
    monitoring_status: "Active",
    coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: record.portfolio === "ai_cyber" ? "United States federal government" : record.portfolio === "manufacturing" ? "United States manufacturing" : record.portfolio === "infrastructure" ? "United States electric power system" : "United States domestic aviation",
    source_owner: record.publisher,
    notes: `Phase 56B primary record for a named entity operating panel. Collection: ${collectionSlug}.`,
  };
  if (record.type === "Official Dataset") {
    source.data_download_url = record.url;
  }
  await writeFile(join(contentRoot, "sources", `${id}.json`), json(source), "utf8");

  const archiveName = `${String(index + 1).padStart(2, "0")}-${record.slug}.txt`;
  const document = {
    id: documentId(record.slug),
    collection_id: collectionId,
    title: record.title,
    slug: `56b-${record.slug}`,
    record_status: "Published",
    publisher: record.publisher,
    publication_date: record.publicationDate,
    document_type:
      record.type === "Inspector General Evaluation"
        ? "Oversight Report"
        : record.type === "MEP Success Story"
          ? "Technical Report"
          : "Data Release",
    summary: record.summary,
    key_findings: [
      record.finding,
      `Method boundary: ${record.limit}`,
      "Entity-panel use is limited to the stable identity and measurement contract declared in the Phase 56B ledger.",
    ],
    why_it_matters: "This record supplies a named entity, denominator, method, attribution, and at least one observation used by the Phase 56B operating panels.",
    ftfn_relevance: [
      "Moves the evidence base from national or program context to named operating entities.",
      "Preserves the source's unit and denominator before describing within-entity movement.",
      "Keeps rankings, composites, and causal overclaim outside the Published layer.",
    ],
    evidence_limits: [
      record.limit,
      "The observation is bounded to the stated entity, period, geography, method, and attribution.",
      "No cross-entity ranking or composite score is supported by this record.",
    ],
    primary_topics: defaults.topics,
    framework_layers: defaults.layers,
    constraint_tags: defaults.constraints,
    source_id: id,
    official_url: record.url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record",
    captured_date: capturedDate,
  };
  await writeFile(
    join(contentRoot, "research-documents", `${211 + index}-56b-${record.slug}.json`),
    json(document),
    "utf8",
  );
}

const publishedSignals = panels.map((panel) => ({
  ...panel,
  id: `signal-56b-${panel.signal_slug}`,
  status: "Published",
  source_ids: panel.source_slugs.map(sourceId),
}));

const heldSignals = holdSignals.map((signal) => {
  const portfolioPanels = panels.filter((panel) => panel.portfolio === signal.portfolio);
  return {
    ...signal,
    id: `signal-56b-${signal.slug}`,
    status: "In Review",
    source_ids: [...new Set(portfolioPanels.flatMap((panel) => panel.source_slugs.map(sourceId)))],
  };
});

for (const signal of [...publishedSignals, ...heldSignals]) {
  const defaults = portfolioDefaults[signal.portfolio];
  const panel = signal.status === "Published" ? signal : null;
  const body = `---
id: "${signal.id}"
title: "${signal.title ?? signal.signal_title}"
slug: "${signal.id.replace("signal-", "")}"
record_status: "${signal.status}"
summary: "${signal.summary ?? signal.signal_summary}"
source_ids:
${yamlArray(signal.source_ids)}
published_date: ${capturedDate}
captured_date: ${capturedDate}
primary_topic: "${defaults.topics[0]}"
framework_layers:
${yamlArray(defaults.layers)}
signal_type: "Market Signal"
maturity_level: "Infrastructure"
time_horizon: "Now"
evidence_quality: "Official Data"
verification_status: "Verified Against Primary Source"
why_it_matters: "${signal.status === "Published" ? "The national series now resolves to a stable named entity with compatible observations and an explicit operating denominator." : "The hold prevents incompatible named entities from being turned into a ranking, composite, or causal comparison."}"
dependencies:
  - "stable entity identifier"
  - "compatible unit and denominator"
  - "period, geography, and method"
  - "attribution and revision history"
constraints:
${yamlArray(defaults.constraints)}
receiving_systems:
${yamlArray(defaults.receiving)}
local_implications:
  - "Entity-level direction remains separate from national context and cross-entity performance."
evidence_gap_ids:
  - "gap-016"
claim_scope: "System-Level Pattern"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
editorial_notes: "${signal.boundary}"
---

## Entity-level read

${signal.summary ?? signal.signal_summary}

## Measurement contract

${panel ? `**Entity ID:** \`${panel.entity_id}\`

**Indicator:** ${panel.indicator}

**Unit:** ${panel.unit}

**Denominator:** ${panel.denominator}

**Period:** ${panel.period}

**Geography:** ${panel.geography}

**Method:** ${panel.method}

**Attribution:** ${panel.attribution}` : "The proposed comparison does not have a common entity, unit, denominator, period, geography, method, and attribution contract."}

## Comparison boundary

${signal.boundary}

## What to watch next

${panel ? panel.watch : "Collect compatible later observations and independent validation before reconsidering the hold."}
`;
  await writeFile(join(contentRoot, "signals", `${signal.id}.mdx`), body, "utf8");
}

const normalizedPanels = panels.map((panel) => ({
  panel_id: panel.id,
  portfolio: panel.portfolio,
  entity_id: panel.entity_id,
  entity_name: panel.entity_name,
  entity_type: panel.entity_type,
  indicator: panel.indicator,
  unit: panel.unit,
  denominator: panel.denominator,
  period: panel.period,
  geography: panel.geography,
  method: panel.method,
  attribution: panel.attribution,
  record_status: "Published",
  signal_id: `signal-56b-${panel.signal_slug}`,
  source_ids: panel.source_slugs.map(sourceId),
  national_context_signal_ids:
    panel.portfolio === "ai_cyber"
      ? ["signal-56a-fisma-reporting", "signal-56a-fisma-effectiveness"]
      : panel.portfolio === "manufacturing"
        ? ["signal-56a-mep-national-impact"]
        : panel.portfolio === "infrastructure"
          ? ["signal-56a-eia-battery-capacity"]
          : ["signal-56a-air-travel-consumer"],
  observations: panel.observations.map((observation) => ({
    ...observation,
    source_id: sourceId(observation.source_slug),
    source_slug: undefined,
  })),
  reporting_breaks: panel.reporting_breaks,
  missing_data: [panel.watch],
  merger_exit_notes: ["No entity merger or exit is applied inside this panel; later changes must create an explicit break or identity update."],
  comparison_boundary: panel.boundary,
}));

const review = {
  phase: "56B",
  reviewed_date: capturedDate,
  portfolio_count: 4,
  panel_count: normalizedPanels.length,
  primary_record_count: records.length,
  signal_decisions: {
    reviewed: publishedSignals.length + heldSignals.length,
    promoted: publishedSignals.map((signal) => signal.id),
    held: heldSignals.map((signal) => signal.id),
  },
  document_decisions: {
    reviewed: records.length,
    published: records.map((record) => documentId(record.slug)),
    held: [],
  },
  portfolio_panels: Object.fromEntries(
    Object.keys(portfolioDefaults).map((portfolio) => [
      portfolio,
      normalizedPanels.filter((panel) => panel.portfolio === portfolio).map((panel) => panel.panel_id),
    ]),
  ),
  entity_rule: "Every Published panel requires a stable entity ID and at least two compatible observations with unit, denominator, period, geography, method, attribution, and reporting breaks attached.",
  context_rule: "National context and entity performance remain separate evidence layers.",
  comparison_rule: "No cross-entity ranking, composite score, or causal claim is permitted without a common measurement contract and independent validation.",
};

await writeFile(join(appRoot, "src", "data", "phase-56b-entity-panels.json"), json({
  phase: "56B",
  captured_date: capturedDate,
  panel_count: normalizedPanels.length,
  panels: normalizedPanels,
}), "utf8");
await writeFile(join(appRoot, "src", "data", "phase-56b-publication-review.json"), json(review), "utf8");

const documentIds = records.map((record) => documentId(record.slug));
const collection = {
  id: collectionId,
  title: "Entity Operating Panels, 2021-2026",
  slug: collectionSlug,
  record_status: "Published",
  summary: "Seventeen official records support twelve named agency, manufacturer, battery-asset, and operating-carrier panels with stable identifiers and explicit measurement contracts.",
  scope: "Phase 56B publishes three named panels in each of four operating portfolios. Four cross-entity rankings remain In Review because their units, denominators, methods, operating contexts, or attribution rules are incompatible.",
  captured_date: capturedDate,
  document_ids: documentIds,
  download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The 20-file archive contains 17 official-link records, consolidated FTFN summaries, a README, and a SHA-256 manifest.",
  method_note: "A Published entity panel requires a stable entity ID and at least two compatible observations. National context remains separate from entity performance. Reporting breaks, missing data, identity changes, revisions, method, denominator, period, geography, and attribution remain attached. No ranking or composite score is created.",
};
await writeFile(join(contentRoot, "research-collections", `${collectionSlug}.json`), json(collection), "utf8");

const allSignals = [...publishedSignals, ...heldSignals];
const briefing = `---
id: "briefing-research-watch-006-entity-operating-panels"
title: "Research Watch 006: Entity Operating Panels"
slug: "research-watch-006-entity-operating-panels"
record_status: "Published"
summary: "Twelve named operating panels show what becomes visible below the national series, while four cross-entity rankings remain explicitly held."
published_date: ${capturedDate}
captured_date: ${capturedDate}
signal_ids:
${yamlArray(allSignals.map((signal) => signal.id))}
evidence_gap_ids:
  - "gap-001"
  - "gap-003"
  - "gap-008"
  - "gap-014"
  - "gap-016"
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${capturedDate}
top_takeaways:
  - "Every Published panel has a stable entity identifier and at least two compatible observations."
  - "Agency maturity, factory output, asset capacity, and carrier cancellations remain four separate measurement systems."
  - "National context is not used as a substitute for entity performance."
  - "Twelve entity panels publish; four proposed cross-entity rankings remain held."
  - "No composite score, league table, or causal effect is created."
constraint_watch:
  - "Data Quality"
  - "Standards"
  - "Infrastructure"
  - "Safety"
  - "Unit Economics"
what_to_watch_next:
  - "Later agency control, incident, remediation, recovery, and mission-outcome records."
  - "Repeated facility output, quality, labor, cost, delivery, and independent validation."
  - "Battery energy duration, availability, dispatch, safety, revenue, and grid-service outcomes."
  - "Later carrier cancellation, delay, complaint, accessibility, and operating-context records."
---

## The entity gate

Phase 56B moves below national and program series only when a named entity has a stable identifier and at least two compatible observations. Unit, denominator, period, geography, method, attribution, revisions, identity changes, and reporting breaks remain attached.

## Federal agency cyber controls

NASA, DHS, and HHS now have agency-level FISMA panels. They expose different within-agency sequences, but component structure, annual metric design, scope, and tested systems prevent a cross-agency league table.

## Manufacturing operations

Three NIST MEP success stories expose named before-and-after output observations. The records are useful facility evidence, but they remain company- and program-attributed case studies without a common product, labor, quality, cost, or follow-up denominator.

## Battery assets

Stable EIA plant codes make three annual nameplate power-capacity panels possible. Nameplate megawatts remain separate from stored energy, duration, availability, dispatch, safety, revenue, grid service, and customer reliability.

## Operating air carriers

DOT Table 6C supports two-year cancellation panels for United, Southwest, and Delta as reporting operating carriers. FTFN preserves scheduled operations and cancellations while refusing the source table's cross-carrier ranking frame.
`;
await writeFile(join(contentRoot, "briefings", "briefing-research-watch-006-entity-operating-panels.mdx"), briefing, "utf8");

const update = {
  id: "update-2026-07-24-phase-56b-entity-operating-panels",
  effective_date: capturedDate,
  entry_type: "Research Collection",
  title: "Phase 56B adds twelve named entity operating panels",
  summary: "FTFN adds 17 official records and sixteen bounded signal decisions: twelve Published agency, manufacturer, battery-asset, and operating-carrier panels plus four explicit cross-entity ranking holds.",
  affected_record_ids: [
    collectionId,
    "briefing-research-watch-006-entity-operating-panels",
    ...allSignals.map((signal) => signal.id),
  ],
  related_paths: [
    `/research/${collectionSlug}/`,
    "/briefings/research-watch-006-entity-operating-panels/",
  ],
  evidence_note: "Every Published panel has a stable entity ID, at least two compatible observations, and explicit unit, denominator, period, geography, method, attribution, and reporting-break boundaries.",
  work_package: "docs/work-packages/phase-56b-entity-operating-panels.md",
};
await writeFile(join(contentRoot, "updates", "2026-07-24-phase-56b-entity-operating-panels.json"), json(update), "utf8");

console.log(`Generated Phase 56B: ${records.length} primary records, ${normalizedPanels.length} Published panels, ${allSignals.length} signal decisions.`);
