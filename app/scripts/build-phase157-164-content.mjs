import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1monthDigest, isValidV1monthValidationReceipt, v1monthPhases, v1monthPublicationDate } from "./lib/v1month-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const updateRoot = join(appRoot, "src", "content", "updates");
const workPackageRoot = join(workspaceRoot, "docs", "work-packages");
const docsRoot = join(workspaceRoot, "docs");
const receiptRoot = join(dataRoot, "phase-164-receipts");
const release = "v1month";
let existingAggregate = null;
try {
  existingAggregate = JSON.parse(await readFile(join(dataRoot, "v1-monthly-operating-program.json"), "utf8"));
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
const edmontonDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Edmonton",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const preservedSnapshotDate = existingAggregate?.program_id === "FTFN-V1-SEPTEMBER-OPERATING-PROGRAM" ? existingAggregate.effective_date : null;
const effectiveDate = process.env.FTFN_EFFECTIVE_DATE ?? preservedSnapshotDate ?? edmontonDate;

if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate)) throw new Error(`FTFN_EFFECTIVE_DATE must use YYYY-MM-DD; received ${effectiveDate}.`);
const effectiveTimestamp = Date.parse(`${effectiveDate}T00:00:00Z`);
if (!Number.isFinite(effectiveTimestamp) || new Date(effectiveTimestamp).toISOString().slice(0, 10) !== effectiveDate) throw new Error(`Invalid effective date ${effectiveDate}.`);
if (effectiveDate < v1monthPublicationDate) throw new Error(`The Phase 157–164 program cannot predate ${v1monthPublicationDate}.`);
if (effectiveDate < edmontonDate && effectiveDate !== preservedSnapshotDate) throw new Error(`Refusing past mutation date ${effectiveDate}; current America/Edmonton date is ${edmontonDate}.`);
if (effectiveDate > edmontonDate && process.env.FTFN_ALLOW_FUTURE_DATE !== "1") throw new Error(`Refusing future mutation date ${effectiveDate}.`);

const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
const unique = (items) => [...new Set(items.filter(Boolean))];
const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const byId = (items, key) => new Map(items.map((item) => [item[key], item]));
const routeSlug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const array = (value) => Array.isArray(value) ? value : [];
const sourceSemantics = (source) => ({
  id: source.id,
  name: source.name,
  url: source.url,
  source_type: source.source_type,
  credibility_level: source.credibility_level,
  primary_topics: source.primary_topics,
  framework_layers: source.framework_layers,
  country_or_region: source.country_or_region,
  known_limitations: source.known_limitations,
  last_checked_date: source.last_checked_date,
  monitoring_status: source.monitoring_status,
  coverage_role: source.coverage_role,
});
const sourceSemanticDigest = (sourceIds, sourceById) => digest([...sourceIds].sort().map((id) => {
  const source = sourceById.get(id);
  if (!source) throw new Error(`Cannot bind missing source ${id}.`);
  return sourceSemantics(source);
}));

await Promise.all([
  mkdir(sourceRoot, { recursive: true }),
  mkdir(updateRoot, { recursive: true }),
  mkdir(workPackageRoot, { recursive: true }),
  mkdir(receiptRoot, { recursive: true }),
]);

const [p136, p137, p145, p146, p147, p149, p150, p151, p152, p154, p156, v1rc] = await Promise.all([
  readJson("phase-136-named-project-chronicles.json"),
  readJson("phase-137-place-delivery-ledgers.json"),
  readJson("phase-145-evidence-gate-operations-journal.json"),
  readJson("phase-146-authority-gap-resolution-program.json"),
  readJson("phase-147-evidence-adjudication-record.json"),
  readJson("phase-149-longitudinal-evidence-lab.json"),
  readJson("phase-150-comparison-passports-2-0.json"),
  readJson("phase-151-weekly-desk-review-ledger.json"),
  readJson("phase-152-frontier-topic-field-guides.json"),
  readJson("phase-154-september-edition-packets.json"),
  readJson("phase-156-v1-launch-decision.json"),
  readJson("v1-release-candidate.json"),
]);

if (!p156.local_validation_receipt || p156.local_validation_receipt.artifact_digest !== "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a") {
  throw new Error("Phase 157 requires the immutable validated Phase 156 baseline digest.");
}

const publicationBoundaries = [
  "The Phase 157–164 overlay adds operating plans and bounded content without rewriting the immutable Phase 145–156 release candidate.",
  "Future September checks, desk decisions, edition inputs, publication receipts, and month-end findings remain null until their lawful dates.",
  "Alternative official artifacts remain candidate pointers unless a dated authorized adjudication admits them; discovery is not evidence admission.",
  "No project stage, longitudinal observation, outcome, causal finding, score, rank, owner decision, repository publication, hosted deployment, or v1 promotion is inferred.",
];

const topicNameById = new Map(p152.field_guides.map((guide) => [guide.topic_id, guide.title.replace(/ field guide$/i, "")]));
const layerByLane = {
  "Power and grid": ["Resource Foundations", "Enabling Infrastructure"],
  "Chips and compute": ["Enabling Infrastructure", "Frontier Domains"],
  Water: ["Planetary Conditions", "Resource Foundations", "Enabling Infrastructure"],
  "Mobility and aviation": ["Enabling Infrastructure", "Human Systems"],
  "Climate and energy": ["Planetary Conditions", "Resource Foundations"],
  Space: ["Enabling Infrastructure", "Frontier Domains"],
  "Critical minerals and manufacturing": ["Resource Foundations", "Enabling Infrastructure", "Frontier Domains"],
  "AI, quantum, cyber and human futures": ["Frontier Domains", "Human Systems"],
};
const watchLaneByLane = {
  "Power and grid": "Power and Grid",
  "Chips and compute": "Compute and Chips",
  Water: "Water",
  "Mobility and aviation": "Mobility Certification",
  "Climate and energy": "Climate",
  Space: "Space",
  "Critical minerals and manufacturing": "Critical Minerals",
  "AI, quantum, cyber and human futures": "Security and Standards",
};

const packetCatalog = [
  {
    slug: "north-american-peak-demand-forecast-2025-ltra", lane: "Power and grid", source_id: "source-161-nerc-ltra-2025", source_name: "NERC 2025 Long-Term Reliability Assessment", publisher: "North American Electric Reliability Corporation", url: "https://www.nerc.com/globalassets/our-work/assessments/nerc_ltra_2025.pdf", artifact_date: "2026-02-24", data_through: "Mid-2025 planner submissions", evidence_type: "Planner forecast and adequacy assessment", source_type: "Standards Body", live_access_type: "Data Download",
    claim: "NERC reports that assessment-area summer peak demand is forecast to rise by more than 224 GW from 2025 through 2035 and winter peak demand by about 245 GW. The assessment attributes most projected growth to data centers and distinguishes 71 GW of approved summer-capacity growth from 266 GW of prospective additions.",
    boundary: "The figures are forecasts assembled from mid-2025 planner submissions. They are not observed load, proof that each data-center proposal will connect, or proof of a future capacity shortfall.",
    topic_ids: ["topic-energy", "topic-chips-and-compute", "topic-policy-and-standards"], project_ids: ["136-CHRONICLE-003"], place_ids: ["137-LEDGER-003"],
  },
  {
    slug: "us-interconnection-queue-snapshot-2026", lane: "Power and grid", source_id: "source-161-lbnl-queued-up-2026", source_name: "Queued Up 2026", publisher: "Lawrence Berkeley National Laboratory", url: "https://eta-publications.lbl.gov/publications/queued-2026-edition-characteristics", artifact_date: "2026-06", data_through: "2025-12-31", evidence_type: "Official laboratory queue dataset and report", source_type: "Research Lab", live_access_type: "Release Page",
    claim: "Berkeley Lab identifies about 8,200 active projects representing 1,312 GW of generation and 749 GW of storage at the end of 2025. About 549 GW had a draft or executed interconnection agreement without commercial operation, and the median request-to-operation time exceeded five years for projects completed in 2025.",
    boundary: "Queue records cover transmission-level requests and exclude distribution and behind-the-meter projects. A queue entry or interconnection agreement is not a completed plant, an operating observation, or a forecast.",
    topic_ids: ["topic-energy", "topic-climate"], project_ids: ["136-CHRONICLE-009", "136-CHRONICLE-010", "136-CHRONICLE-011", "136-CHRONICLE-012", "136-CHRONICLE-013", "136-CHRONICLE-014"], place_ids: ["137-LEDGER-012", "137-LEDGER-013", "137-LEDGER-014", "137-LEDGER-015"],
  },
  {
    slug: "us-battery-capacity-june-2026", lane: "Power and grid", source_id: "source-161-eia-battery-capacity-aug-2026", source_name: "Battery storage capacity averaged 70% annual growth", publisher: "U.S. Energy Information Administration", url: "https://www.eia.gov/todayinenergy/detail.php?id=67925", artifact_date: "2026-08-07", data_through: "2026-06-30", evidence_type: "Observed nameplate-capacity summary plus planned additions", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "EIA reports 43.6 GW of operational utility-scale battery nameplate capacity at year-end 2025 and another 8.3 GW added in the first half of 2026, bringing the total near 52 GW. The release identifies Manatee as 409 MW of battery capacity paired with 75 MW of solar capacity.",
    boundary: "Nameplate power does not establish energy duration, availability, dispatch, safety, or project outcome. The additional capacity reported for 2026–2028 is operator planning, not delivered operation.",
    topic_ids: ["topic-energy"], project_ids: ["136-CHRONICLE-009", "136-CHRONICLE-010", "136-CHRONICLE-011"], place_ids: ["137-LEDGER-014", "137-LEDGER-015"],
  },
  {
    slug: "tsmc-us-investment-announcement-july-2026", lane: "Chips and compute", source_id: "source-161-nist-tsmc-investment-july-2026", source_name: "Commerce announces additional TSMC U.S. investment commitment", publisher: "National Institute of Standards and Technology", url: "https://www.nist.gov/news-events/news/2026/07/trump-administration-secures-additional-100-billion-us-semiconductor", artifact_date: "2026-07-16", data_through: "2026-07-16", evidence_type: "Government announcement of company commitment", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "Commerce announced an incremental $100 billion TSMC U.S. commitment, bringing announced U.S. investment to $265 billion and twelve proposed leading-edge manufacturing and packaging facilities.",
    boundary: "This is an investment announcement, not a facility-level award, construction, qualification, production, or customer-acceptance record. It must not be merged with the existing CHIPS award or Phoenix fab-stage evidence.",
    topic_ids: ["topic-chips-and-compute", "topic-advanced-manufacturing"], project_ids: ["136-CHRONICLE-001"], place_ids: ["137-LEDGER-005"],
  },
  {
    slug: "compute-supply-chain-rd-lois-july-2026", lane: "Chips and compute", source_id: "source-161-nist-compute-supply-chain-lois-july-2026", source_name: "Commerce compute-supply-chain R&D letters of intent", publisher: "National Institute of Standards and Technology", url: "https://www.nist.gov/news-events/news/2026/07/department-commerce-announces-letters-intent-7-companies-874-million", artifact_date: "2026-07-29", data_through: "2026-07-29", evidence_type: "Non-final funding letters of intent", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "Commerce announced seven letters of intent totaling up to $874 million across photonics, memory, packaging, substrates, materials, provenance, and alternative compute, including proposed amounts of $300 million for GlobalFoundries, $245 million for Kepler, and $140 million for Multibeam.",
    boundary: "The amounts are non-final, stated as up to, and subject to diligence and approval. The letters establish neither disbursement nor technical performance.",
    topic_ids: ["topic-chips-and-compute", "topic-ai-for-science", "topic-advanced-manufacturing"], project_ids: [], place_ids: [],
  },
  {
    slug: "us-data-center-electricity-use-scenarios", lane: "Chips and compute", source_id: "source-161-lbnl-data-center-energy-usage-2024", source_name: "2024 United States Data Center Energy Usage Report", publisher: "Lawrence Berkeley National Laboratory", url: "https://seta.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report", artifact_date: "2024-12-19", data_through: "2023 observed; 2028 scenarios", evidence_type: "National estimate and scenario study", source_type: "Research Lab", live_access_type: "Report Series",
    claim: "The DOE-requested Berkeley Lab study estimates U.S. data-center electricity use at 176 TWh, or 4.4% of national consumption, in 2023. Its scenario range reaches 325–580 TWh, or 6.7%–12.0%, in 2028.",
    boundary: "The 2028 range is scenario-based and sensitive to shipments, operating power, utilization, and cooling assumptions. It is not a forecast, a Northern Virginia allocation, or a local water conclusion.",
    topic_ids: ["topic-chips-and-compute", "topic-energy", "topic-water"], project_ids: ["136-CHRONICLE-003"], place_ids: ["137-LEDGER-003"],
  },
  {
    slug: "colorado-river-2027-operations-decision", lane: "Water", source_id: "source-161-usbr-colorado-river-2027-decision", source_name: "Post-2026 Colorado River operations decision", publisher: "U.S. Bureau of Reclamation", url: "https://www.usbr.gov/newsroom/news-release/5392", artifact_date: "2026-08-21", data_through: "2026-08-21 modeled conditions", evidence_type: "Federal reservoir operating decision and modeled condition", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "Reclamation's final framework places the expected start of water year 2027 for Lake Powell between elevations 3,510 and 3,540 feet with an expected release of 6.0–7.0 million acre-feet, while reporting record-low Powell and Mead elevations in August 2026.",
    boundary: "Reservoir operating rules and modeled conditions are not a municipal allocation, industrial delivery, shortage impact, or project outcome. The Mexico treaty process remains separate.",
    topic_ids: ["topic-water", "topic-climate", "topic-policy-and-standards"], project_ids: ["136-CHRONICLE-001"], place_ids: ["137-LEDGER-005"],
  },
  {
    slug: "phoenix-ama-version-3-groundwater-projection", lane: "Water", source_id: "source-161-adwr-phoenix-ama-v3-june-2026", source_name: "Phoenix AMA Version 3 groundwater-model technical memorandum", publisher: "Arizona Department of Water Resources", url: "https://infoshare.azwater.gov/docushare/dsweb/Get/Document-132975/V3_PhxAMA_Update_Memo.pdf", artifact_date: "2026-06", data_through: "Observed inputs through 2023; model horizon 2024–2123", evidence_type: "Regional groundwater model", source_type: "Government Agency", live_access_type: "Data Download",
    claim: "The Phoenix AMA Version 3 model produces 2,514,500 acre-feet of unmet demand over its 100-year horizon, including 836,500 acre-feet in AWS, municipal, and long-term-storage-credit sectors, and models average annual storage loss of 503,800 acre-feet.",
    boundary: "This is a regional model updated with observations only through 2023. It is not a prediction for a particular well, an observed future depletion series, or a facility water balance.",
    topic_ids: ["topic-water", "topic-chips-and-compute"], project_ids: ["136-CHRONICLE-001"], place_ids: ["137-LEDGER-005"],
  },
  {
    slug: "wifia-portfolio-2025", lane: "Water", source_id: "source-161-epa-wifia-2025-annual-report", source_name: "WIFIA 2025 Annual Report", publisher: "U.S. Environmental Protection Agency", url: "https://www.epa.gov/system/files/documents/2026-03/wifia-2025-annual-report.pdf", artifact_date: "2026-03", data_through: "2025-12-31", evidence_type: "Federal financing-program annual report", source_type: "Government Agency", live_access_type: "Data Download",
    claim: "EPA reports that WIFIA closed $900 million in loans supporting $1.8 billion of projects during 2025 and made 333 disbursements totaling nearly $3.7 billion. Through December 2025 it reports 147 closed loans and $22 billion of financing associated with $49 billion of infrastructure investment.",
    boundary: "Portfolio financing, disbursements, reported jobs, and estimated borrower savings do not establish construction completion, acceptance, operation, or local water outcomes.",
    topic_ids: ["topic-water", "topic-finance-and-risk", "topic-policy-and-standards"], project_ids: [], place_ids: [],
  },
  {
    slug: "us-road-fatalities-estimate-2025", lane: "Mobility and aviation", source_id: "source-161-nhtsa-road-fatalities-2025-estimate", source_name: "Early estimate of 2025 motor-vehicle traffic fatalities", publisher: "National Highway Traffic Safety Administration", url: "https://www.nhtsa.gov/press-releases/traffic-deaths-2025-early-estimates-2024-annual", artifact_date: "2026-04-01", data_through: "2025", evidence_type: "National early estimate", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "NHTSA estimated 36,640 traffic fatalities in 2025, 6.7% below 2024, with a rate of 1.10 fatalities per 100 million vehicle-miles traveled.",
    boundary: "Early estimates remain subject to final FARS records. National movement cannot be attributed to enforcement, vehicle technology, autonomy, or an individual operator.",
    topic_ids: ["topic-mobility", "topic-human-futures"], project_ids: ["136-CHRONICLE-008"], place_ids: ["137-LEDGER-006"],
  },
  {
    slug: "faa-controller-workforce-2026-plan", lane: "Mobility and aviation", source_id: "source-56r-faa-air-traffic-controller-workforce-plan-2026-2028", source_name: "Air Traffic Controller Workforce Plan 2026–2028", publisher: "Federal Aviation Administration", url: "https://www.faa.gov/sites/faa.gov/files/Air-Traffic-Controller-Workforce-Plan-2026-2028.pdf", artifact_date: "2026-06-01", data_through: "2026-04", evidence_type: "Federal workforce plan and observed hiring account", source_type: "Government Agency", live_access_type: "Data Download",
    claim: "FAA reports 2,028 controller trainees hired in FY2025 against 1,460 total losses, a net gain of 568, and plans 2,200, 2,300, and 2,400 hires for FY2026–2028. It separately reports about 11,000 certified controllers and 4,000 in training against a 12,563-controller target.",
    boundary: "Hiring is not certification or facility deployment. Planned hiring and modernization remain appropriations-dependent, and workforce categories cannot be added interchangeably.",
    topic_ids: ["topic-aviation", "topic-human-futures"], project_ids: ["136-CHRONICLE-004"], place_ids: ["137-LEDGER-001"],
  },
  {
    slug: "amtrak-fy2025-ridership", lane: "Mobility and aviation", source_id: "source-161-amtrak-fy2025-ridership", source_name: "Amtrak FY2025 year-end ridership fact sheet", publisher: "Amtrak", url: "https://media.amtrak.com/wp-content/uploads/2025/11/FY25-Year-End-Ridership-Fact-Sheet.pdf", artifact_date: "2025-11-18", data_through: "FY2025", evidence_type: "Official operator ridership summary", source_type: "Company Press Room", live_access_type: "Data Download",
    claim: "Amtrak reports 34,467,598 trips in FY2025, 5.1% above FY2024, with Northeast Corridor trips up 8.1%, state-supported trips up 2.4%, and long-distance trips up 4.2%.",
    boundary: "Trips are not unique passengers, accessibility completion, station acceptance, punctuality, or named-asset reliability. Route totals cannot answer the station-level evidence gates.",
    topic_ids: ["topic-mobility", "topic-human-futures"], project_ids: ["136-CHRONICLE-021"], place_ids: ["137-LEDGER-010"],
  },
  {
    slug: "us-climate-conditions-2025", lane: "Climate and energy", source_id: "source-161-noaa-us-climate-2025", source_name: "Annual 2025 U.S. climate assessment", publisher: "National Oceanic and Atmospheric Administration", url: "https://www.ncei.noaa.gov/news/national-climate-202513", artifact_date: "2026-01-13", data_through: "2025", evidence_type: "Observed national climate assessment", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "NOAA reports that the contiguous United States averaged 54.6°F in 2025, 2.6°F above the twentieth-century average and fourth warmest in the 131-year record. The Climate Extremes Index was 58% above average, and the Southwest recorded its warmest year.",
    boundary: "Each statistic retains its stated baseline and geography. The observations do not establish event attribution, project causality, or infrastructure performance.",
    topic_ids: ["topic-climate", "topic-water", "topic-human-futures"], project_ids: [], place_ids: ["137-LEDGER-002", "137-LEDGER-005", "137-LEDGER-006", "137-LEDGER-015"],
  },
  {
    slug: "us-wind-solar-generation-2025", lane: "Climate and energy", source_id: "source-161-eia-wind-solar-generation-2025", source_name: "U.S. wind and solar generation in 2025", publisher: "U.S. Energy Information Administration", url: "https://www.eia.gov/todayinenergy/detail.php/detail.php?id=67367", artifact_date: "2026-03-20", data_through: "2025", evidence_type: "Observed national generation summary", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "EIA reports 760,000 GWh of wind and utility-scale solar generation in 2025, 88,000 GWh above 2024 and 17% of total generation. Wind supplied 464,000 GWh and utility-scale solar 296,000 GWh; including small-scale solar raises the joint share to 19%.",
    boundary: "Generation is not capacity, availability, reliability, avoided emissions, or project attribution. Utility-scale and estimated small-scale solar use different reporting rails.",
    topic_ids: ["topic-energy", "topic-climate"], project_ids: ["136-CHRONICLE-009", "136-CHRONICLE-010", "136-CHRONICLE-011", "136-CHRONICLE-012", "136-CHRONICLE-013", "136-CHRONICLE-014"], place_ids: ["137-LEDGER-012", "137-LEDGER-013", "137-LEDGER-014", "137-LEDGER-015"],
  },
  {
    slug: "aemo-q1-2026-renewables-storage", lane: "Climate and energy", source_id: "source-161-aemo-q1-2026-qed", source_name: "AEMO Quarterly Energy Dynamics Q1 2026", publisher: "Australian Energy Market Operator", url: "https://www.aemo.com.au/newsroom/media-release/renewables-lift-supply-share-as-batteries-re-shape-energy-markets", artifact_date: "2026-04-30", data_through: "2026 Q1", evidence_type: "Official market-operator quarterly observation", source_type: "Dataset", live_access_type: "Release Page",
    claim: "AEMO reports renewable generation at 46.5% of National Electricity Market supply in Q1 2026, a first-quarter record, with underlying demand at 25,496 MW. South Australia's renewable-and-storage contribution peaked at 98.8% during one half-hour on January 31.",
    boundary: "Regional and interval aggregates do not measure Hornsdale, Dalrymple, or Victoria Big Battery individually and do not establish a reliability or price effect caused by one asset.",
    topic_ids: ["topic-energy", "topic-climate"], project_ids: ["136-CHRONICLE-012", "136-CHRONICLE-013", "136-CHRONICLE-014"], place_ids: ["137-LEDGER-012", "137-LEDGER-013"],
  },
  {
    slug: "faa-commercial-space-operations-fy2025", lane: "Space", source_id: "source-161-faa-aerospace-forecast-2026-2046", source_name: "FAA Aerospace Forecast FY 2026–2046", publisher: "Federal Aviation Administration", url: "https://www.faa.gov/data_research/aviation/aerospace_forecasts/FY_2026-2046_Full_Forecast_Document_Tables.pdf", artifact_date: "2026", data_through: "FY2025 historical activity", evidence_type: "Federal historical activity account and forecast", source_type: "Government Agency", live_access_type: "Data Download",
    claim: "FAA records 195 licensed launches by six operators in FY2025, including 161 by SpaceX, with 76 at Cape Canaveral, 61 at Vandenberg, and 26 at Kennedy. It separately records nine licensed reentries and eight licensed operations resulting in mishaps.",
    boundary: "Licensed launches, reentries, mishaps, site activity, and payload success are separate measures. The counts cannot be merged with Eastern Range orbital-launch totals.",
    topic_ids: ["topic-space", "topic-aviation", "topic-policy-and-standards"], project_ids: ["136-CHRONICLE-004"], place_ids: ["137-LEDGER-001"],
  },
  {
    slug: "eastern-range-orbital-launches-2025", lane: "Space", source_id: "source-161-space-force-eastern-range-2025", source_name: "100 Launches and Beyond", publisher: "U.S. Space Force Space Systems Command", url: "https://www.ssc.spaceforce.mil/About-Us/Freedom-250?dvpTag=SLD&dvpmoduleid=4314", artifact_date: "2025-12-31", data_through: "2025", evidence_type: "Official range activity count", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "U.S. Space Force reports that Cape Canaveral Space Force Station and the Eastern Range hosted 109 orbital launches during 2025.",
    boundary: "A range-hosted orbital count is not a count of FAA licences, unique operators, successful payload deployments, or missions from Kennedy Space Center alone.",
    topic_ids: ["topic-space"], project_ids: ["136-CHRONICLE-004"], place_ids: ["137-LEDGER-001"],
  },
  {
    slug: "artemis-iii-hardware-integration-august-2026", lane: "Space", source_id: "source-161-nasa-artemis-iii-hardware-aug-2026", source_name: "Artemis III Orion modules and rocket hardware update", publisher: "National Aeronautics and Space Administration", url: "https://www.nasa.gov/blogs/missions/2026/08/05/nasa-joins-artemis-iii-orion-modules-rocket-hardware-update/", artifact_date: "2026-08-05", data_through: "2026-08-05", evidence_type: "Official program hardware update", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "NASA reports that all four RS-25 engines had reached Kennedy, booster stacking had begun, and more than 250 Artemis II Orion components were planned for reuse. It also reports almost four months of booster-preparation acceleration and roughly 50% shorter tower turnaround.",
    boundary: "Component delivery, reuse plans, and processing-time comparisons are not integrated-vehicle acceptance, flight readiness, launch authorization, or mission success.",
    topic_ids: ["topic-space", "topic-advanced-manufacturing"], project_ids: ["136-CHRONICLE-004"], place_ids: ["137-LEDGER-001"],
  },
  {
    slug: "us-mineral-economy-import-reliance-2025", lane: "Critical minerals and manufacturing", source_id: "source-usgs-mineral-commodity-summaries", source_name: "Mineral Commodity Summaries 2026", publisher: "U.S. Geological Survey", url: "https://pubs.usgs.gov/publication/mcs2026", artifact_date: "2026-02-06", data_through: "2025", evidence_type: "Official commodity statistics", source_type: "Government Agency", live_access_type: "Report Series",
    claim: "USGS values U.S. nonfuel mineral production at $112 billion in 2025 and mineral-reliant industries at $4.09 trillion. It reports thirteen critical minerals at 100% net-import reliance and another twenty at 50% or greater reliance.",
    boundary: "The values include estimates and withheld proprietary figures. Import reliance is not proof of shortage or disruption, and broad economic contribution is not attributable to one mine.",
    topic_ids: ["topic-critical-minerals", "topic-advanced-manufacturing", "topic-finance-and-risk"], project_ids: ["136-CHRONICLE-005"], place_ids: ["137-LEDGER-002"],
  },
  {
    slug: "thacker-pass-financing-designed-capacity", lane: "Critical minerals and manufacturing", source_id: "source-doe-thacker-pass-loan-2024", source_name: "Thacker Pass project financing record", publisher: "U.S. Department of Energy", url: "https://www.energy.gov/edf/thacker-pass", artifact_date: "2024-10", data_through: "2024 project financing", evidence_type: "Federal loan and designed-capacity record", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "DOE records a $2.26 billion loan, comprising $1.97 billion principal and $289.7 million capitalized interest, for facilities designed to produce about 40,000 tonnes annually of battery-grade lithium carbonate.",
    boundary: "Financing and designed capacity are not construction completion, accepted output, qualification, annual production, or environmental or community outcome. DOE's vehicle equivalents are modeled.",
    topic_ids: ["topic-critical-minerals", "topic-advanced-manufacturing"], project_ids: ["136-CHRONICLE-005"], place_ids: ["137-LEDGER-002"],
  },
  {
    slug: "usa-rare-earth-mine-to-magnet-award", lane: "Critical minerals and manufacturing", source_id: "source-161-nist-usa-rare-earth-june-2026", source_name: "Commerce definitive agreement with USA Rare Earth", publisher: "National Institute of Standards and Technology", url: "https://www.nist.gov/news-events/news/2026/06/department-commerces-chips-program-finalizes-definitive-agreement-usa-rare", artifact_date: "2026-06-03", data_through: "2026-06-03", evidence_type: "Definitive public financing agreement", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "Commerce describes up to $277 million in incentives and up to $1.3 billion in lending for a proposed multi-site system targeting 10,000 tons annually of rare-earth metals and alloys and 10,000 tons annually of NdFeB magnets.",
    boundary: "A definitive financing agreement and target capacity are not completed facilities, production, material qualification, or integrated mine-to-magnet operation.",
    topic_ids: ["topic-critical-minerals", "topic-advanced-manufacturing", "topic-chips-and-compute"], project_ids: ["136-CHRONICLE-005"], place_ids: ["137-LEDGER-002"],
  },
  {
    slug: "nist-aite-launch-2026", lane: "AI, quantum, cyber and human futures", source_id: "source-161-nist-aite-july-2026", source_name: "NIST Artificial Intelligence Technology Evaluation launch", publisher: "National Institute of Standards and Technology", url: "https://www.nist.gov/news-events/news/2026/07/announcing-nists-artificial-intelligence-technology-evaluation-aite", artifact_date: "2026-07-27", data_through: "2026-07-27", evidence_type: "Evaluation infrastructure announcement", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "NIST launched a blind, sequestered evaluation environment with three initial vision-language-model tasks covering quantum science, genomics, and public safety, using common data, metrics, and scoring across provider tracks.",
    boundary: "Evaluation infrastructure is not a model result, ranking, assurance finding, or evidence that a model is safe or useful. Participation is voluntary.",
    topic_ids: ["topic-ai-for-science", "topic-discovery-technologies", "topic-policy-and-standards"], project_ids: ["136-CHRONICLE-007"], place_ids: [],
  },
  {
    slug: "quantum-chips-loi-portfolio-2026", lane: "AI, quantum, cyber and human futures", source_id: "source-161-nist-quantum-lois-may-2026", source_name: "Commerce quantum letters of intent", publisher: "National Institute of Standards and Technology", url: "https://www.nist.gov/news-events/news/2026/05/department-commerce-announces-letters-intent-9-companies-2-billion", artifact_date: "2026-05-21", data_through: "2026-05-21", evidence_type: "Non-final funding letters of intent", source_type: "Government Agency", live_access_type: "Release Page",
    claim: "Commerce announced nine quantum letters of intent totaling $2.013 billion, including proposed foundry amounts of $375 million for GlobalFoundries and $1 billion for IBM alongside seven modality-specific companies.",
    boundary: "Letters of intent are non-final proposed funding, not disbursement, foundry operation, qubit performance, error correction, or utility-scale fault tolerance.",
    topic_ids: ["topic-quantum", "topic-chips-and-compute", "topic-advanced-manufacturing"], project_ids: ["136-CHRONICLE-006"], place_ids: [],
  },
  {
    slug: "ic3-cyber-harm-2025", lane: "AI, quantum, cyber and human futures", source_id: "source-161-fbi-ic3-2025-report", source_name: "FBI 2025 Internet Crime Report", publisher: "Federal Bureau of Investigation", url: "https://www.fbi.gov/file-repository/2025_ic3report.pdf", artifact_date: "2026-04-06", data_through: "2025", evidence_type: "Administrative complaint and reported-loss data", source_type: "Government Agency", live_access_type: "Data Download",
    claim: "The FBI reports 1,008,597 IC3 complaints with nearly $21 billion in reported losses during 2025. Cyber-enabled fraud accounted for 452,868 complaints and $17.697 billion, while people over 60 reported about $7.7 billion in losses.",
    boundary: "Complaint data are self-reported rather than a national-incidence estimate; categories can overlap, and reported losses are not necessarily recovered or adjudicated. The figures do not prove that AI caused the underlying fraud.",
    topic_ids: ["topic-cybersecurity", "topic-human-futures", "topic-finance-and-risk"], project_ids: [], place_ids: [],
  },
];

if (packetCatalog.length !== 24) throw new Error(`Phase 161 requires 24 packet specifications; received ${packetCatalog.length}.`);

const existingSourceFiles = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json"));
const existingSources = await Promise.all(existingSourceFiles.map((entry) => readFile(join(sourceRoot, entry.name), "utf8").then(JSON.parse)));
const sourceById = byId(existingSources, "id");
const sourceByUrl = new Map(existingSources.map((source) => [source.url, source]));
const generatedSourceWrites = [];

for (const spec of packetCatalog) {
  const existingByUrl = sourceByUrl.get(spec.url);
  if (existingByUrl) spec.source_id = existingByUrl.id;
  if (sourceById.has(spec.source_id) && !spec.source_id.startsWith("source-161-")) continue;
  const source = {
    id: spec.source_id,
    name: spec.source_name,
    url: spec.url,
    source_type: spec.source_type,
    credibility_level: "Tier 1",
    primary_topics: unique(spec.topic_ids.map((id) => topicNameById.get(id)).filter(Boolean)),
    framework_layers: layerByLane[spec.lane],
    country_or_region: spec.publisher === "Australian Energy Market Operator" ? "Australia" : "United States",
    update_frequency: "Artifact family dependent; inspect the exact dated release and its revision history before reuse.",
    capture_priority: "High",
    known_limitations: spec.boundary,
    last_checked_date: effectiveDate,
    watch_lanes: [watchLaneByLane[spec.lane]],
    live_access_type: spec.live_access_type,
    ...(spec.live_access_type === "Data Download" ? { data_download_url: spec.url } : {}),
    review_cadence_days: 30,
    monitoring_status: "Active",
    coverage_role: [spec.evidence_type.includes("fund") || spec.evidence_type.includes("financ") ? "Funding Evidence" : "Primary Data"],
    jurisdiction: spec.publisher === "Australian Energy Market Operator" ? "Australia" : "United States",
    source_owner: spec.publisher,
    automation_notes: "Phase 161 exact-artifact rail. Preserve artifact date, data-through period, evidence type, and excluded inference in every downstream use.",
    notes: `Phase 161 Stack Watch exact artifact checked ${effectiveDate}. Inclusion as a source profile is not evidence admission or an outcome decision.`,
  };
  generatedSourceWrites.push([join(sourceRoot, `${source.id}.json`), source]);
  sourceById.set(source.id, source);
  sourceByUrl.set(source.url, source);
}

const projectByChronicleId = byId(p136.project_chronicles, "chronicle_id");
const placeByLedgerId = byId(p137.place_ledgers, "ledger_id");

const phaseMeta = {
  157: ["v1 candidate preservation ledger", "Bind the September overlay to the exact immutable Phase 156 receipt and candidate digest without rewriting that baseline."],
  158: ["September evidence operations desk", "Prepare the ten September evidence gates and project rechecks as exact, independent, date-bound operations."],
  159: ["Owner decision sprint", "Present twelve mission boards covering twelve authority dispositions, eighteen requirement decisions, and six mission decisions without fabricating owner action."],
  160: ["Longitudinal pilot matrices", "Prepare three full compatibility matrices and the explicit zero-series boundary while transferring no values and admitting no series."],
  161: ["Stack Watch", "Publish twenty-four current official-source packets with source-bound supported claims, system implications, and excluded inferences."],
  162: ["Local-system and dependency expansion", "Publish four place-bound constraint briefs and four evidence-bound dependency maps without inferring a new project stage or causal result."],
  163: ["September editorial runbooks", "Bind all sixty-eight desk windows, four edition packets, guide currency checks, comparison reviews, and the month-end synthesis template without predating content."],
  164: ["Monthly candidate decision", "Derive a fourteen-gate audit for the September operating overlay and preserve the owner-controlled v1 promotion boundary."],
};
const sectionByPhase = {
  157: "candidate-preservation",
  158: "september-operations",
  159: "owner-sprint",
  160: "longitudinal-pilots",
  161: "stack-watch",
  162: "local-systems",
  163: "editorial-runbooks",
  164: "monthly-decision",
};
const exportNameByPhase = {
  157: "phase-157-v1-candidate-preservation-ledger.json",
  158: "phase-158-september-evidence-operations-desk.json",
  159: "phase-159-owner-decision-sprint.json",
  160: "phase-160-longitudinal-pilot-matrices.json",
  161: "phase-161-stack-watch.json",
  162: "phase-162-local-system-expansion.json",
  163: "phase-163-september-editorial-runbooks.json",
  164: "phase-164-monthly-candidate-decision.json",
};
const keyByPhase = {
  157: "preservation_records",
  158: "operation_packets",
  159: "authority_mission_boards",
  160: "pilot_matrices",
  161: "stack_watch_packets",
  162: "local_system_briefs",
  163: "editorial_runbooks",
  164: "readiness_gates",
};
const idKeyByPhase = {
  157: "preservation_id",
  158: "operation_packet_id",
  159: "mission_board_id",
  160: "pilot_matrix_id",
  161: "stack_watch_packet_id",
  162: "local_system_brief_id",
  163: "editorial_runbook_id",
  164: "gate_id",
};

const makeRegistry = ({ phase, records, counts, detailRoutes = true, extra = {} }) => {
  const [title, objective] = phaseMeta[phase];
  const section = sectionByPhase[phase];
  const exportName = exportNameByPhase[phase];
  const idKey = idKeyByPhase[phase];
  const routedRecords = records.map((record) => detailRoutes ? {
    ...record,
    route: `/review/${release}/${section}/${record.slug ?? routeSlug(record[idKey])}/`,
  } : record);
  const publicHtmlRoutes = [`/review/${release}/${section}/`, ...routedRecords.map((record) => record.route).filter(Boolean)];
  return {
    schema_version: "1.0",
    phase,
    program_id: `FTFN-PHASE-${phase}`,
    dataset: exportName.replace(/\.json$/, "").replaceAll("-", "_"),
    title,
    effective_date: effectiveDate,
    record_status: "Published",
    build_status: "Complete locally",
    summary: objective,
    record_scope: `Append-only Phase ${phase} record over the immutable Phase 145–156 v1-RC baseline.`,
    publication_boundaries: publicationBoundaries,
    routes: {
      hub: `/review/${release}/${section}/`,
      public_export: `/data/${exportName}`,
    },
    counts,
    [keyByPhase[phase]]: routedRecords,
    ...extra,
    public_html_routes: publicHtmlRoutes,
    public_json_exports: [`/data/${exportName}`],
  };
};

const preservationRecords = [{
  preservation_id: "157-PRESERVATION-001",
  slug: "immutable-v1rc-baseline",
  title: "Immutable Phase 145–156 v1-RC baseline",
  preservation_state: "Passed — exact receipt and digest bound",
  baseline_program_id: v1rc.program_id,
  baseline_effective_date: v1rc.effective_date,
  baseline_receipt_id: p156.local_validation_receipt.receipt_id,
  baseline_artifact_digest: p156.local_validation_receipt.artifact_digest,
  baseline_public_html_routes: v1rc.public_html_routes.length,
  baseline_public_json_exports: v1rc.public_json_exports.length,
  baseline_update_records: v1rc.publication_update_files.length,
  overlay_rule: "Phases 157–164 are hashed and validated independently. Whole-site growth cannot stale the exact Phase 156 route, export, update, or candidate digest contract.",
  repository_boundary: "This record is a content-level preservation control, not a Git commit, push, deployment, or owner acceptance receipt.",
  next_action: "Keep the Phase 156 receipt immutable and bind any later v1 promotion to a verified commit and an explicit owner receipt.",
}];
const p157 = makeRegistry({
  phase: 157,
  records: preservationRecords,
  detailRoutes: false,
  counts: {
    preservation_records: 1,
    baseline_phases: v1rc.phases.length,
    baseline_public_html_routes: v1rc.public_html_routes.length,
    baseline_public_json_exports: v1rc.public_json_exports.length,
    baseline_update_records: v1rc.publication_update_files.length,
    matching_phase156_digests: 1,
  },
});

const septemberOperations = p145.gate_operations.filter((operation) => operation.lawful_date >= "2026-09-01" && operation.lawful_date <= "2026-09-30");
const operationPackets = septemberOperations.map((operation, index) => ({
  operation_packet_id: `158-OPERATION-${String(index + 1).padStart(3, "0")}`,
  upstream_operation_id: operation.operation_id,
  upstream_cycle_item_id: operation.cycle_item_id,
  upstream_phase_61_file_id: operation.phase_61_file_id ?? null,
  slug: operation.slug,
  title: operation.title,
  operation_kind: operation.operation_kind,
  lawful_date: operation.lawful_date,
  operation_state: operation.decision_status,
  decision_date: operation.decision_date,
  receipt_id: operation.receipt_id,
  source_checked_date: operation.source_checked_date,
  reviewer_role: operation.reviewer_role ?? null,
  rationale: operation.rationale ?? null,
  bounded_result: operation.bounded_result,
  exact_next_artifact: operation.exact_next_artifact,
  source_ids: operation.source_ids,
  underlying_signal_ids: unique([operation.underlying_signal_id, ...array(operation.underlying_signal_ids)]),
  propagation_contract_id: operation.propagation_contract_id,
  propagation_targets: operation.propagation_targets,
  required_sequence: operation.required_sequence,
  alternative_source_ladder: [
    "Exact issuing-agency artifact or named program record",
    "Official regulator, auditor, inspector general, or legislative oversight record",
    "Official docket, permit, procurement, grant, recipient, or public-data record",
    "State, provincial, municipal, or public-operator record with the same entity and period",
    "Interested-party material clearly labeled as such and never substituted for missing authority",
  ],
  preflight_state: operation.lawful_date > effectiveDate ? "Prepared — operation not yet lawful" : operation.decision_status === "scheduled" ? "Due — upstream receipt required" : "Terminal upstream decision mirrored",
  stop_rule: operation.stop_rule,
}));
const p158 = makeRegistry({
  phase: 158,
  records: operationPackets,
  counts: {
    september_operation_packets: operationPackets.length,
    evidence_gates: operationPackets.filter((record) => record.operation_kind === "Phase 60 evidence gate").length,
    project_file_rechecks: operationPackets.filter((record) => record.operation_kind !== "Phase 60 evidence gate").length,
    completed_operations: operationPackets.filter((record) => record.receipt_id).length,
    due_operations_pending: operationPackets.filter((record) => record.lawful_date <= effectiveDate && !record.receipt_id).length,
    future_operations: operationPackets.filter((record) => record.lawful_date > effectiveDate).length,
    predated_decisions: operationPackets.filter((record) => record.decision_date && record.decision_date < record.lawful_date).length,
    october_operations_deferred: p145.gate_operations.filter((operation) => operation.lawful_date.startsWith("2026-10")).length,
  },
  extra: {
    operating_date: effectiveDate,
    october_deferred_operation_ids: p145.gate_operations.filter((operation) => operation.lawful_date.startsWith("2026-10")).map((operation) => operation.operation_id),
  },
});

const adjudicationsByMission = new Map();
for (const record of p147.adjudication_records) {
  if (!adjudicationsByMission.has(record.mission_id)) adjudicationsByMission.set(record.mission_id, []);
  adjudicationsByMission.get(record.mission_id).push(record);
}
const authorityMissionBoards = p146.gap_dispositions.map((gap, index) => {
  const adjudications = adjudicationsByMission.get(gap.mission_id) ?? [];
  const requirements = adjudications.filter((record) => record.record_kind === "requirement decision");
  const mission = adjudications.find((record) => record.record_kind === "mission decision") ?? null;
  const ownerActions = [{
    action_id: `159-AUTHORITY-${String(index + 1).padStart(3, "0")}`,
    action_kind: "authority disposition",
    upstream_record_id: gap.disposition_id,
    sequence: 1,
    decision_state: gap.owner_disposition ? gap.disposition_state : "Pending owner disposition",
    decision_date: gap.disposition_date,
    receipt_id: gap.disposition_receipt_id,
    candidate_set_digest: gap.candidate_set_digest,
    allowed_terminal_states: gap.allowed_terminal_states,
  }, ...requirements.map((record, requirementIndex) => ({
    action_id: `159-REQUIREMENT-${record.adjudication_record_id.replace(/^147-REQUIREMENT-/, "")}`,
    action_kind: "requirement decision",
    upstream_record_id: record.adjudication_record_id,
    sequence: 2 + requirementIndex,
    decision_state: record.decision_state,
    decision_date: record.decision_date,
    receipt_id: record.decision_receipt_id,
    candidate_set_digest: record.candidate_set_digest,
    allowed_terminal_states: record.terminal_states,
  })), ...(mission ? [{
    action_id: `159-MISSION-${mission.adjudication_record_id.replace(/^147-MISSION-/, "")}`,
    action_kind: "mission decision",
    upstream_record_id: mission.adjudication_record_id,
    sequence: 2 + requirements.length,
    decision_state: mission.decision_state,
    decision_date: mission.decision_date,
    receipt_id: mission.decision_receipt_id,
    candidate_set_digest: mission.candidate_set_digest,
    allowed_terminal_states: mission.terminal_states,
  }] : [])];
  return {
    mission_board_id: `159-BOARD-${String(index + 1).padStart(3, "0")}`,
    mission_id: gap.mission_id,
    gap_disposition_id: gap.disposition_id,
    topic_id: gap.topic_id,
    slug: gap.slug,
    title: gap.title,
    priority_board: gap.priority_docket,
    board_state: ownerActions.every((action) => action.receipt_id) ? "Terminal — all owner actions receipted" : "Prepared — owner decisions pending",
    missing_authority_role: gap.missing_authority_role,
    historical_source_ids: gap.inherited_source_ids,
    alternative_candidate_ids: gap.alternative_candidate_ids,
    alternative_candidates_are_evidence: false,
    board_scope_digest: digest(ownerActions.map((action) => ({ action_id: action.action_id, upstream_record_id: action.upstream_record_id, candidate_set_digest: action.candidate_set_digest }))),
    owner_actions: ownerActions,
    sequencing_rule: "Authority and requirement decisions must be independent, dated, and receipted. A mission decision may close only after every required requirement decision is terminal.",
    next_action: "Present this board to an authorized reviewer; preserve any unresolved action as pending rather than inferring a decision.",
  };
});
const allOwnerActions = authorityMissionBoards.flatMap((board) => board.owner_actions);
const p159 = makeRegistry({
  phase: 159,
  records: authorityMissionBoards,
  counts: {
    mission_boards: authorityMissionBoards.length,
    authority_actions: allOwnerActions.filter((action) => action.action_kind === "authority disposition").length,
    requirement_actions: allOwnerActions.filter((action) => action.action_kind === "requirement decision").length,
    mission_actions: allOwnerActions.filter((action) => action.action_kind === "mission decision").length,
    total_owner_actions: allOwnerActions.length,
    terminal_owner_actions: allOwnerActions.filter((action) => action.receipt_id).length,
    pending_owner_actions: allOwnerActions.filter((action) => !action.receipt_id).length,
    fabricated_owner_actions: 0,
  },
});

const priorityPilotReviews = p149.longitudinal_reviews.filter((review) => review.pilot_priority);
const pilotMatrices = priorityPilotReviews.map((review, index) => ({
  pilot_matrix_id: `160-PILOT-${String(index + 1).padStart(3, "0")}`,
  matrix_kind: "compatibility pilot",
  upstream_lab_review_id: review.lab_review_id,
  eligibility_id: review.eligibility_id,
  entity_kind: review.entity_kind,
  entity_id: review.entity_id,
  slug: review.slug,
  title: `${review.title} compatibility pilot`,
  review_date: effectiveDate,
  legacy_panel_id: review.legacy_panel_id,
  legacy_observation_count: review.legacy_observation_count,
  series_definition_digest: review.series_definition_digest,
  compatibility_tests: review.tests,
  matrix_state: "Prepared — governed Phase 69–70 audit required",
  compatibility_decision: review.compatibility_decision,
  admitted_series_id: review.admitted_series_id,
  observations_transferred: review.observations_transferred,
  decision_date: review.decision_date,
  decision_receipt_id: review.decision_receipt_id,
  decisive_next_action: review.next_action,
  stop_rule: "Do not transfer a legacy value unless identity, period, measure, denominator, revision lineage, and dual-review admission all pass under the governed contract.",
}));
pilotMatrices.push({
  pilot_matrix_id: "160-BOUNDARY-001",
  matrix_kind: "zero-series launch boundary",
  slug: "zero-series-launch-boundary",
  title: "Explicit zero-series launch boundary",
  review_date: effectiveDate,
  reviewed_eligibility_ids: p149.no_series_launch_boundary.reviewed_eligibility_ids,
  boundary_scope_digest: p149.no_series_launch_boundary.boundary_scope_digest,
  matrix_state: p149.no_series_launch_boundary.state,
  proposed_scope: p149.no_series_launch_boundary.proposed_scope,
  owner_accepted: p149.no_series_launch_boundary.owner_accepted,
  decision_date: p149.no_series_launch_boundary.decision_date,
  decision_receipt_id: p149.no_series_launch_boundary.decision_receipt_id,
  admitted_series_id: null,
  observations_transferred: 0,
  decisive_next_action: "Obtain one dated owner disposition: admit only a Phase 69–70-compatible pilot or explicitly accept the disclosed zero-series boundary.",
  stop_rule: "The absence of an admitted series forbids trends, outcome claims, rankings, scores, and causal comparisons.",
});
const p160 = makeRegistry({
  phase: 160,
  records: pilotMatrices,
  counts: {
    pilot_matrices: pilotMatrices.length,
    compatibility_pilots: priorityPilotReviews.length,
    compatibility_tests: priorityPilotReviews.flatMap((review) => review.tests).length,
    zero_series_boundary_records: 1,
    admitted_series: priorityPilotReviews.filter((review) => review.admitted_series_id).length,
    observations_transferred: priorityPilotReviews.reduce((sum, review) => sum + review.observations_transferred, 0),
    owner_dispositions_pending: p149.no_series_launch_boundary.owner_accepted ? 0 : 1,
  },
});

const gapAlternativesByTopic = new Map();
for (const gap of p146.gap_dispositions) {
  if (!gapAlternativesByTopic.has(gap.topic_id)) gapAlternativesByTopic.set(gap.topic_id, []);
  gapAlternativesByTopic.get(gap.topic_id).push(...gap.alternative_candidate_ids);
}
const stackWatchPackets = packetCatalog.map((spec, index) => {
  const source = sourceById.get(spec.source_id);
  if (!source) throw new Error(`Phase 161 packet ${spec.slug} cannot resolve source ${spec.source_id}.`);
  const sourceDigest = sourceSemanticDigest([source.id], sourceById);
  const topicNames = spec.topic_ids.map((id) => topicNameById.get(id)).filter(Boolean);
  const projectTitles = spec.project_ids.map((id) => projectByChronicleId.get(id)?.title).filter(Boolean);
  const placeTitles = spec.place_ids.map((id) => placeByLedgerId.get(id)?.title).filter(Boolean);
  const packetId = `161-PACKET-${String(index + 1).padStart(3, "0")}`;
  return {
    stack_watch_packet_id: packetId,
    slug: spec.slug,
    title: spec.source_name,
    stack_lane: spec.lane,
    packet_state: "Published — bounded official-source synthesis",
    checked_date: effectiveDate,
    artifact_date: spec.artifact_date,
    data_through: spec.data_through,
    evidence_type: spec.evidence_type,
    publisher: spec.publisher,
    official_url: spec.url,
    source_ids: [source.id],
    source_semantic_digest: sourceDigest,
    topic_ids: spec.topic_ids,
    project_chronicle_ids: spec.project_ids,
    place_ledger_ids: spec.place_ids,
    alternative_candidate_ids: unique(spec.topic_ids.flatMap((topicId) => gapAlternativesByTopic.get(topicId) ?? [])),
    alternative_candidates_support_claims: false,
    reader_brief: `${spec.claim} This record sits in the ${spec.lane} watch lane and is linked to ${topicNames.join(", ")}. ${projectTitles.length ? `Named project context includes ${projectTitles.join(", ")}.` : "No current named project is treated as the subject of this system-level record."} ${placeTitles.length ? `Receiving-place context includes ${placeTitles.join(", ")}.` : "No place-level outcome is inferred."}`,
    claim_blocks: [
      {
        claim_block_id: `${packetId}-CLAIM-01`,
        claim_type: "Supported observation",
        text: spec.claim,
        source_ids: [source.id],
        source_semantic_digest: sourceDigest,
        publication_state: "Published context — not an evidence-admission decision",
      },
      {
        claim_block_id: `${packetId}-CLAIM-02`,
        claim_type: "System implication",
        text: `The artifact supplies a bounded ${spec.evidence_type.toLowerCase()} for the ${spec.lane} evidence chain. It can orient the named topics and linked project or place files only at the entity, period, measure, and authority scope stated by the issuer.`,
        source_ids: [source.id],
        source_semantic_digest: sourceDigest,
        publication_state: "Published interpretation with explicit scope",
      },
      {
        claim_block_id: `${packetId}-CLAIM-03`,
        claim_type: "Excluded inference",
        text: spec.boundary,
        source_ids: [source.id],
        source_semantic_digest: sourceDigest,
        publication_state: "Binding exclusion",
      },
    ],
    decisive_next_artifact: `A later accepted operating or outcome record matching the named entity, observation period, measure, method, denominator, and receiving authority; do not substitute this ${spec.evidence_type.toLowerCase()}.`,
  };
});
const p161 = makeRegistry({
  phase: 161,
  records: stackWatchPackets,
  counts: {
    stack_watch_packets: stackWatchPackets.length,
    stack_lanes: new Set(stackWatchPackets.map((packet) => packet.stack_lane)).size,
    topic_links: stackWatchPackets.reduce((sum, packet) => sum + packet.topic_ids.length, 0),
    project_links: stackWatchPackets.reduce((sum, packet) => sum + packet.project_chronicle_ids.length, 0),
    place_links: stackWatchPackets.reduce((sum, packet) => sum + packet.place_ledger_ids.length, 0),
    claim_blocks: stackWatchPackets.flatMap((packet) => packet.claim_blocks).length,
    publication_ready_bounded_syntheses: stackWatchPackets.filter((packet) => packet.packet_state.startsWith("Published")).length,
    alternative_candidates_used_as_claim_support: 0,
  },
  extra: {
    source_profile_ids_added_or_reused: stackWatchPackets.map((packet) => packet.source_ids[0]),
  },
});

const localBriefSpecs = [
  {
    ledger_id: "137-LEDGER-005",
    slug: "southwest-chip-water-power-workforce",
    title: "Southwest chip corridor: power, water, workforce, and acceptance",
    system_stack: ["Land and permits", "Electric service", "Potable, wastewater, and reclaimed-water systems", "Skilled trades and technician pipeline", "Equipment installation and qualification", "Customer-accepted recurring output"],
    conversion_question: "Which separately accepted utility, facility, workforce, qualification, and recurring-output records establish that announced semiconductor capacity has become dependable local operation?",
    affected_parties: ["Water and electric utility customers", "Tribal and basin water interests", "Workers and training institutions", "Nearby communities", "Manufacturers and downstream customers"],
    extra_operation_ids: ["145-GATE-009"],
  },
  {
    ledger_id: "137-LEDGER-003",
    slug: "northern-virginia-compute-grid-standards",
    title: "Northern Virginia compute corridor: grid capacity, permits, and standards",
    system_stack: ["Large-load requests", "Transmission and distribution planning", "Generation and storage adequacy", "Local land-use and air permits", "Rate and cost allocation", "Operating reliability and community effects"],
    conversion_question: "Which accepted service, construction, permit, rate, and operating records establish delivered capacity and allocate the resulting costs and risks?",
    affected_parties: ["Residential and commercial ratepayers", "Utilities and grid operators", "County residents", "Data-center operators", "Air-quality and water authorities"],
    extra_operation_ids: [],
  },
  {
    ledger_id: "137-LEDGER-001",
    slug: "space-coast-authorization-infrastructure-cadence",
    title: "Space Coast: authorization, infrastructure, mission, and cadence",
    system_stack: ["Environmental review", "Site and operator licensing", "Range availability", "Capital-asset acceptance", "Vehicle and mission authorization", "Repeated service and local-system effects"],
    conversion_question: "Which operator-, vehicle-, site-, and mission-specific records distinguish permission and infrastructure readiness from completed missions and dependable corridor cadence?",
    affected_parties: ["Launch and reentry operators", "NASA and Space Force users", "Range and safety personnel", "Local residents", "Environmental and emergency authorities"],
    extra_operation_ids: ["145-RECHECK-PROJECT-SPACE-COAST-AUTHORITY-2026-09-15"],
  },
  {
    ledger_id: "137-LEDGER-007",
    slug: "louisiana-broadband-build-service-adoption",
    title: "Louisiana broadband: award, build, service, adoption, and affordability",
    system_stack: ["Award and enforceable obligation", "Permits and construction", "Service availability", "Eligible-location denominator", "Subscription and installation", "Affordability, reliability, and household benefit"],
    conversion_question: "Which location-bound service and subscriber records demonstrate adoption after availability without substituting awards, towers, or coverage claims for household use?",
    affected_parties: ["Eligible households and businesses", "State broadband administrators", "Providers", "Local governments", "Affordability and digital-inclusion programs"],
    extra_operation_ids: ["145-GATE-003", "145-GATE-004"],
  },
];
const operationById = byId(p145.gate_operations, "operation_id");
const localSystemBriefs = localBriefSpecs.map((spec, index) => {
  const ledger = placeByLedgerId.get(spec.ledger_id);
  if (!ledger) throw new Error(`Phase 162 cannot resolve place ledger ${spec.ledger_id}.`);
  const relatedChronicles = ledger.related_project_ids.map((atlasProjectId) => p136.project_chronicles.find((chronicle) => chronicle.atlas_project_id === atlasProjectId)).filter(Boolean);
  const operations = spec.extra_operation_ids.map((id) => operationById.get(id)).filter(Boolean);
  const sourceIds = unique([...ledger.source_ids, ...operations.flatMap((operation) => operation.source_ids)]).filter((id) => sourceById.has(id));
  const semanticDigest = sourceSemanticDigest(sourceIds, sourceById);
  const timelineEntries = [
    {
      step: "Inherited baseline",
      date: effectiveDate,
      state: ledger.inherited_state,
      evidence_ids: [ledger.ledger_id],
      boundary: "The inherited state is copied without advancing it.",
    },
    {
      step: "Named project and operation files",
      date: null,
      state: relatedChronicles.length || operations.length ? "Linked — independent records retained" : "No governed project file linked",
      evidence_ids: unique([...relatedChronicles.map((chronicle) => chronicle.chronicle_id), ...operations.map((operation) => operation.operation_id)]),
      boundary: "Adjacency and shared geography do not merge project identities or stages.",
    },
    {
      step: "Decisive next evidence",
      date: null,
      state: "Open",
      evidence_ids: sourceIds,
      boundary: ledger.exact_next_artifact,
    },
  ];
  const dependencyNodes = spec.system_stack.map((label, nodeIndex) => ({ node_id: `162-${String(index + 1).padStart(2, "0")}-NODE-${String(nodeIndex + 1).padStart(2, "0")}`, label }));
  const dependencyEdges = dependencyNodes.slice(1).map((node, edgeIndex) => ({
    edge_id: `162-${String(index + 1).padStart(2, "0")}-EDGE-${String(edgeIndex + 1).padStart(2, "0")}`,
    from_node_id: dependencyNodes[edgeIndex].node_id,
    to_node_id: node.node_id,
    relationship: "Must be independently evidenced before conversion is claimed",
    evidence_ids: sourceIds,
    source_semantic_digest: semanticDigest,
    inference_boundary: "The edge is an evidence-acquisition dependency, not a causal estimate or proof that the downstream state has occurred.",
  }));
  return {
    local_system_brief_id: `162-BRIEF-${String(index + 1).padStart(3, "0")}`,
    upstream_place_ledger_id: ledger.ledger_id,
    atlas_place_id: ledger.atlas_place_id,
    slug: spec.slug,
    title: spec.title,
    brief_state: "Published — bounded local-system synthesis",
    geography: ledger.geography,
    inherited_state: ledger.inherited_state,
    conversion_question: spec.conversion_question,
    receiving_system_read: ledger.receiving_system_read,
    system_stack: spec.system_stack,
    affected_parties: spec.affected_parties,
    project_chronicle_ids: relatedChronicles.map((chronicle) => chronicle.chronicle_id),
    operation_packet_ids: operations.map((operation) => `158-OPERATION-${String(septemberOperations.findIndex((candidate) => candidate.operation_id === operation.operation_id) + 1).padStart(3, "0")}`),
    source_ids: sourceIds,
    source_semantic_digest: semanticDigest,
    timeline_entries: timelineEntries,
    dependency_map: {
      dependency_map_id: `162-MAP-${String(index + 1).padStart(3, "0")}`,
      title: `${spec.title} dependency map`,
      nodes: dependencyNodes,
      edges: dependencyEdges,
      causal_findings_created: 0,
      stage_changes_created: 0,
    },
    open_system_needs: ledger.open_system_needs,
    exact_next_artifact: ledger.exact_next_artifact,
    stop_rule: "Keep authorization, financing, construction, acceptance, operation, adoption, reliability, affordability, and public outcome as separate evidentiary states.",
  };
});
const p162 = makeRegistry({
  phase: 162,
  records: localSystemBriefs,
  counts: {
    local_system_briefs: localSystemBriefs.length,
    system_layers: localSystemBriefs.reduce((sum, brief) => sum + brief.system_stack.length, 0),
    timeline_entries: localSystemBriefs.reduce((sum, brief) => sum + brief.timeline_entries.length, 0),
    dependency_maps: localSystemBriefs.filter((brief) => brief.dependency_map).length,
    dependency_edges: localSystemBriefs.reduce((sum, brief) => sum + brief.dependency_map.edges.length, 0),
    inferred_stage_changes: 0,
    causal_findings_created: 0,
  },
});

const allDeskWindows = p151.desk_review_ledgers.flatMap((desk) => desk.review_windows.map((window) => ({
  ...window,
  desk_review_id: desk.desk_review_id,
  desk_id: desk.desk_id,
  topic_id: desk.topic_id,
  guide_id: p152.field_guides.find((guide) => guide.topic_id === desk.topic_id)?.field_guide_id ?? null,
})));
const guideCurrencyPasses = p152.field_guides.map((guide, index) => ({
  currency_pass_id: `163-GUIDE-PASS-${String(index + 1).padStart(3, "0")}`,
  field_guide_id: guide.field_guide_id,
  topic_id: guide.topic_id,
  baseline_date: guide.publication_date,
  source_binding_digest: sourceSemanticDigest(guide.direct_evidence_source_ids.filter((id) => sourceById.has(id)), sourceById),
  pass_state: "Baseline bound — substantive revision requires a dated review receipt",
  material_change_ids: [],
}));
const passportRechecks = p150.comparison_passports.map((passport, index) => ({
  passport_recheck_id: `163-PASSPORT-RECHECK-${String(index + 1).padStart(3, "0")}`,
  passport_id: passport.passport_id,
  dossier_id: passport.dossier_id,
  verdict: passport.verdict,
  verdict_changed: false,
  score: null,
  rank: null,
  compatibility_dimensions: passport.compatibility_dimensions,
  decisive_next_evidence: passport.decisive_next_evidence,
  recheck_state: "Prepared for September window — Context only retained",
}));
const editorialRunbooks = p154.edition_packets.map((packet, index) => {
  const windows = allDeskWindows.filter((window) => window.scheduled_date === packet.publication_date);
  const assignedPassportRechecks = passportRechecks.filter((_, passportIndex) => passportIndex % p154.edition_packets.length === index);
  return {
    editorial_runbook_id: `163-RUNBOOK-${String(index + 1).padStart(3, "0")}`,
    upstream_edition_packet_id: packet.edition_packet_id,
    slug: packet.slug,
    title: packet.title,
    scheduled_date: packet.publication_date,
    runbook_state: packet.state,
    focus: packet.focus,
    source_eligibility_cutoff: packet.source_eligibility_cutoff,
    required_sections: packet.required_sections,
    due_operation_ids: packet.due_operation_ids,
    desk_windows: windows,
    guide_currency_pass_ids: guideCurrencyPasses.map((pass) => pass.currency_pass_id),
    comparison_passport_rechecks: assignedPassportRechecks,
    required_sequence: [
      "Close every due Phase 145 operation with an independent lawful receipt",
      "Close all seventeen same-date desk windows",
      "Re-evaluate affected guides and comparison passports without forcing change",
      "Only then compute the edition input and publication-scope digests",
      "Publish or record an explicit immaterial week with reviewer, rationale, and receipt",
    ],
    draft_content: packet.draft_content,
    included_source_ids: packet.included_source_ids,
    material_change_ids: packet.material_change_ids,
    publication_decision_date: packet.publication_decision_date,
    publication_receipt_id: packet.publication_receipt_id,
    publication_input_digest: packet.publication_input_digest,
    publication_scope_digest: packet.publication_scope_digest,
    month_end_report_template: index === 3 ? {
      title: "September State of Frontier Systems",
      publication_date: "2026-09-30",
      state: "Prepared — findings and claim blocks remain empty until month close",
      minimum_authored_words: 1500,
      minimum_source_bound_claim_blocks: 8,
      required_sections: ["What materially changed", "What did not change", "Evidence and authority decisions", "Conversion and local-system watch", "Longitudinal and comparison boundaries", "October evidence calendar", "Methods and corrections"],
      authored_content: null,
      claim_blocks: [],
      publication_decision_date: null,
      publication_receipt_id: null,
    } : null,
    publication_rule: packet.publication_rule,
    boundary: packet.boundary,
  };
});
const p163 = makeRegistry({
  phase: 163,
  records: editorialRunbooks,
  counts: {
    editorial_runbooks: editorialRunbooks.length,
    desk_window_bindings: editorialRunbooks.reduce((sum, runbook) => sum + runbook.desk_windows.length, 0),
    unique_desk_windows: new Set(editorialRunbooks.flatMap((runbook) => runbook.desk_windows.map((window) => window.window_id))).size,
    guide_currency_passes: guideCurrencyPasses.length,
    comparison_passport_rechecks: passportRechecks.length,
    edition_packet_bindings: editorialRunbooks.length,
    month_end_report_templates: 1,
    predated_editorial_decisions: editorialRunbooks.flatMap((runbook) => runbook.desk_windows).filter((window) => window.decision_date && window.decision_date < window.scheduled_date).length,
    future_publications_predated: editorialRunbooks.filter((runbook) => runbook.scheduled_date > effectiveDate && runbook.publication_receipt_id).length,
  },
  extra: {
    guide_currency_passes: guideCurrencyPasses,
    comparison_passport_rechecks: passportRechecks,
  },
});

const buildPhase164 = (receipt = null) => {
  const ownerActionsPending = p159.counts.pending_owner_actions;
  const authorityPending = allOwnerActions.filter((action) => action.action_kind === "authority disposition" && !action.receipt_id).length;
  const evidencePending = allOwnerActions.filter((action) => action.action_kind !== "authority disposition" && !action.receipt_id).length;
  const longitudinalResolved = p160.counts.admitted_series > 0 || p160.counts.owner_dispositions_pending === 0;
  const gate = (number, slug, title, state, evidence, nextAction) => ({
    gate_id: `164-GATE-${String(number).padStart(2, "0")}-${slug}`,
    title,
    state,
    evidence,
    next_action: nextAction,
    receipt_id: number === 13 ? receipt?.receipt_id ?? null : null,
  });
  const gates = [
    gate(1, "BASELINE-PRESERVATION", "Immutable v1-RC baseline", "Pass", `Phase 157 binds receipt ${p156.local_validation_receipt.receipt_id} and digest ${p156.local_validation_receipt.artifact_digest}.`, "Never rewrite the Phase 156 receipt; validate later layers independently."),
    gate(2, "SEPTEMBER-OPERATIONS-READINESS", "September evidence operations readiness", p158.counts.predated_decisions === 0 && p158.counts.september_operation_packets === 10 ? "Pass" : "Held", `${p158.counts.september_operation_packets} independent packets; ${p158.counts.predated_decisions} predated decisions.`, "Operate only on or after each lawful date and preserve shared-date identities."),
    gate(3, "EVIDENCE-ADJUDICATION", "Evidence adjudication", evidencePending === 0 ? "Pass" : "Held", `${evidencePending} requirement or mission owner action(s) remain without terminal receipts.`, "Complete requirement decisions before their mission conclusion."),
    gate(4, "AUTHORITY-COVERAGE", "Authority coverage", authorityPending === 0 ? "Pass" : "Held", `${authorityPending} authority disposition(s) remain without a terminal close, carry, or exclusion receipt.`, "Use the alternative shelves as candidates only; obtain dated owner dispositions."),
    gate(5, "LONGITUDINAL-BOUNDARY", "Longitudinal evidence or accepted zero-series boundary", longitudinalResolved ? "Pass" : "Held", `${p160.counts.admitted_series} series admitted; zero-series owner disposition pending: ${p160.counts.owner_dispositions_pending}.`, "Complete a governed pilot or accept the disclosed zero-series boundary."),
    gate(6, "STACK-WATCH", "Stack Watch content depth", p161.counts.stack_watch_packets === 24 && p161.counts.claim_blocks >= 72 ? "Pass" : "Held", `${p161.counts.stack_watch_packets} packets and ${p161.counts.claim_blocks} source-bound claim blocks.`, "Maintain exact artifact dates, data-through periods, evidence types, and exclusions."),
    gate(7, "LOCAL-SYSTEMS", "Local-system coverage", p162.counts.local_system_briefs === 4 ? "Pass" : "Held", `${p162.counts.local_system_briefs} source-bound local-system briefs.`, "Update only through source-bound dated revisions."),
    gate(8, "DEPENDENCY-MAPS", "Dependency-map coverage", p162.counts.dependency_maps === 4 && p162.counts.causal_findings_created === 0 ? "Pass" : "Held", `${p162.counts.dependency_maps} maps, ${p162.counts.dependency_edges} bounded edges, and zero causal findings.`, "Keep evidence-acquisition dependencies separate from causal results."),
    gate(9, "GUIDE-CURRENCY", "Field-guide currency", p163.counts.guide_currency_passes === 17 ? "Pass" : "Held", `${p163.counts.guide_currency_passes} source-digest-bound guide currency passes.`, "Revise a guide only through a later dated review receipt."),
    gate(10, "COMPARATIVE-INTEGRITY", "Comparison integrity", p163.counts.comparison_passport_rechecks === 12 && passportRechecks.every((record) => record.verdict === "Context only" && record.score === null && record.rank === null) ? "Pass" : "Held", `${p163.counts.comparison_passport_rechecks} Context only rechecks with zero scores or ranks.`, "Change a verdict only after every compatibility dimension passes."),
    gate(11, "EDITORIAL-INTEGRITY", "September editorial integrity", p163.counts.desk_window_bindings === 68 && p163.counts.predated_editorial_decisions === 0 && p163.counts.future_publications_predated === 0 ? "Pass" : "Held", `${p163.counts.desk_window_bindings} window bindings, four runbooks, and zero predated decisions or publications.`, "Close same-day desk windows before computing an edition scope."),
    gate(12, "MACHINE-READABLE-CONTRACT", "Machine-readable overlay contract", "Pass", "Eight phase exports and one aggregate are declared as schema 1.0.", "Keep all route, export, and update inventories exact."),
    gate(13, "LOCAL-VALIDATION", "Local build and release validation", receipt ? "Pass" : "Pending build", receipt ? `Receipt ${receipt.receipt_id} matches the normalized overlay digest.` : "A content-addressed Phase 164 validation receipt has not yet been embedded.", "Validate the exact overlay, archive the receipt, rebuild, and verify determinism."),
    gate(14, "OWNER-ACCEPTANCE", "Owner acceptance and v1 promotion", p156.owner_packet?.owner_acceptance ? "Pass" : "Held", p156.owner_packet?.owner_acceptance ? "A valid Phase 156 owner receipt is present." : `No owner receipt binds the candidate digest, verified commit, limitations, and fourteen-gate snapshot; ${ownerActionsPending} Phase 159 actions also remain pending.`, "Obtain an explicit owner receipt; GitHub publication, hosting, DNS, and public launch remain separate authorizations."),
  ];
  const counts = {
    readiness_gates: gates.length,
    passed: gates.filter((item) => item.state === "Pass").length,
    held: gates.filter((item) => item.state === "Held").length,
    pending_build: gates.filter((item) => item.state === "Pending build").length,
    false_passes: 0,
  };
  return makeRegistry({
    phase: 164,
    records: gates,
    detailRoutes: false,
    counts,
    extra: {
      local_validation_state: receipt ? "Passed" : "Pending build",
      local_validation_receipt: receipt,
      v1_promotion_state: gates.every((item) => item.state === "Pass") ? "Ready for promotion" : "Held",
      audit_result: gates.every((item) => item.state === "Pass") ? "All overlay readiness gates pass." : `v1 remains Held: ${gates.filter((item) => item.state === "Held").map((item) => item.title.toLowerCase()).join(", ")}.`,
      owner_authority: {
        evidence_admission_authorized: false,
        owner_acceptance: Boolean(p156.owner_packet?.owner_acceptance),
        github_publication_authorized: false,
        hosted_deployment_authorized: false,
        public_launch_authorized: false,
      },
    },
  });
};

let p164 = buildPhase164(null);
const registries = new Map([[157, p157], [158, p158], [159, p159], [160, p160], [161, p161], [162, p162], [163, p163], [164, p164]]);

const buildAggregate = () => {
  const phaseRecords = v1monthPhases.map((phase) => {
    const registry = registries.get(phase);
    return {
      phase,
      title: registry.title,
      status: registry.build_status,
      hub_route: registry.routes.hub,
      public_export: registry.routes.public_export,
      counts: registry.counts,
    };
  });
  const htmlRoutes = unique([`/review/${release}/`, ...v1monthPhases.flatMap((phase) => registries.get(phase).public_html_routes)]);
  const jsonExports = [...v1monthPhases.map((phase) => registries.get(phase).routes.public_export), "/data/v1-monthly-operating-program.json"];
  return {
    schema_version: "1.0",
    program_id: "FTFN-V1-SEPTEMBER-OPERATING-PROGRAM",
    version: "v1 September operating overlay",
    title: "FTFN v1 September Operating Program",
    effective_date: effectiveDate,
    status: p164.local_validation_receipt ? "Complete locally — validated; v1 promotion held" : "Complete locally — validation pending; v1 promotion held",
    summary: "An append-only operating and content overlay covering candidate preservation, September evidence operations, owner decision boards, longitudinal pilots, twenty-four Stack Watch packets, local-system and dependency briefs, editorial runbooks, and a derived monthly promotion audit.",
    publication_boundaries: publicationBoundaries,
    baseline_v1rc: {
      program_id: v1rc.program_id,
      effective_date: v1rc.effective_date,
      receipt_id: p156.local_validation_receipt.receipt_id,
      artifact_digest: p156.local_validation_receipt.artifact_digest,
      public_html_routes: v1rc.public_html_routes.length,
      public_json_exports: v1rc.public_json_exports.length,
      rewritten: false,
    },
    counts: {
      phases: 8,
      public_html_routes: htmlRoutes.length,
      detail_routes: htmlRoutes.length - 9,
      public_json_exports: jsonExports.length,
      update_records: 8,
      stack_watch_packets: p161.counts.stack_watch_packets,
      claim_blocks: p161.counts.claim_blocks,
      local_system_briefs: p162.counts.local_system_briefs,
      dependency_maps: p162.counts.dependency_maps,
    },
    operating_state: {
      september_operations: p158.counts.september_operation_packets,
      future_operations: p158.counts.future_operations,
      due_operations_pending: p158.counts.due_operations_pending,
      owner_actions_pending: p159.counts.pending_owner_actions,
      admitted_longitudinal_series: p160.counts.admitted_series,
      desk_window_bindings: p163.counts.desk_window_bindings,
      v1_promotion: p164.v1_promotion_state,
    },
    phases: phaseRecords,
    local_validation_receipt_id: p164.local_validation_receipt?.receipt_id ?? null,
    local_validation_artifact_digest: p164.local_validation_receipt?.artifact_digest ?? null,
    v1_promotion_state: p164.v1_promotion_state,
    public_html_routes: htmlRoutes,
    public_json_exports: jsonExports,
    publication_update_files: v1monthPhases.map((phase) => `${v1monthPublicationDate}-phase-${phase}.json`),
  };
};

let aggregate = buildAggregate();
const makeUpdate = (phase) => {
  const registry = registries.get(phase);
  const records = registry[keyByPhase[phase]];
  return {
    id: `update-${v1monthPublicationDate}-phase-${phase}`,
    effective_date: v1monthPublicationDate,
    entry_type: "Publication Promotion",
    title: `Phase ${phase} publishes ${registry.title}`,
    summary: registry.summary,
    affected_record_ids: [`FTFN-PHASE-${phase}`, ...records.map((record) => record[idKeyByPhase[phase]])],
    related_paths: [registry.routes.hub, registry.routes.public_export],
    evidence_note: publicationBoundaries[phase === 161 || phase === 162 ? 2 : 1],
    materiality: "Material record change",
    publication_effect: `Adds or updates ${registry.public_html_routes.length} public HTML route(s) and one schema-1.0 JSON export.`,
    next_check_date: phase === 158 ? "2026-09-01" : phase === 163 ? "2026-09-06" : null,
    work_package: `docs/work-packages/${exportNameByPhase[phase].replace(/\.json$/, ".md")}`,
  };
};
let updates = new Map(v1monthPhases.map((phase) => [`${v1monthPublicationDate}-phase-${phase}.json`, makeUpdate(phase)]));

const exportsMap = () => new Map([
  ...v1monthPhases.map((phase) => [exportNameByPhase[phase], registries.get(phase)]),
  ["v1-monthly-operating-program.json", aggregate],
]);
let candidateDigest = computeV1monthDigest({ aggregate, exportsByName: exportsMap(), updatesByName: updates });

const receiptCandidates = [];
if (await exists(receiptRoot)) {
  for (const entry of await readdir(receiptRoot, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".json")) receiptCandidates.push(JSON.parse(await readFile(join(receiptRoot, entry.name), "utf8")));
  }
}
const matchingReceipt = receiptCandidates.find((receipt) => isValidV1monthValidationReceipt({ receipt, aggregate, candidateDigest }));
if (effectiveDate < edmontonDate && !matchingReceipt) {
  throw new Error(`Refusing to rewrite historical Phase 157–164 snapshot ${effectiveDate} without its current digest-matching immutable Phase 164 receipt.`);
}
if (matchingReceipt) {
  p164 = buildPhase164(matchingReceipt);
  registries.set(164, p164);
  aggregate = buildAggregate();
  updates = new Map(v1monthPhases.map((phase) => [`${v1monthPublicationDate}-phase-${phase}.json`, makeUpdate(phase)]));
  const embeddedDigest = computeV1monthDigest({ aggregate, exportsByName: exportsMap(), updatesByName: updates });
  if (embeddedDigest !== candidateDigest) throw new Error(`Embedding the Phase 164 receipt changed the normalized digest: ${candidateDigest} -> ${embeddedDigest}.`);
}

for (const [path, source] of generatedSourceWrites) await writeJson(path, source);
for (const phase of v1monthPhases) await writeJson(join(dataRoot, exportNameByPhase[phase]), registries.get(phase));
await writeJson(join(dataRoot, "v1-monthly-operating-program.json"), aggregate);
for (const [name, update] of updates) await writeJson(join(updateRoot, name), update);

const metricRows = (counts) => Object.entries(counts).map(([key, value]) => `| ${key.replaceAll("_", " ")} | ${value} |`).join("\n");
const nextActionByPhase = {
  157: "Keep the Phase 156 baseline immutable; create a repository commit or publish only under separate authorization.",
  158: "Operate only the next lawful September packet, issue its independent receipt, and complete every typed propagation target.",
  159: "Present authority and requirement decisions first; record a mission decision only after its required evidence decisions are terminal.",
  160: "Run the three pilots under the Phase 69–70 contract or obtain a dated owner acceptance of the zero-series boundary.",
  161: "Maintain every packet at exact-artifact and claim-block level; revise through a dated source refresh rather than silently overwriting claims.",
  162: "Update place briefs and dependency maps only from source-bound project, utility, authority, and receiving-system records.",
  163: "On each scheduled date, close all seventeen desk windows before computing and publishing that week's edition scope.",
  164: "Retain v1 Held until evidence adjudication, authority coverage, longitudinal disposition, and owner acceptance all pass with valid receipts.",
};
for (const phase of v1monthPhases) {
  const registry = registries.get(phase);
  const [title, objective] = phaseMeta[phase];
  const workPackage = `# Phase ${phase} — ${title}\n\n**Release:** v1 September operating overlay  \n**Effective date:** ${effectiveDate}  \n**Status:** ${registry.build_status}\n\n## Objective\n\n${objective}\n\n## Delivered contract\n\n- Program: \`${registry.program_id}\`\n- Dataset: \`${registry.dataset}\`\n- Hub: \`${registry.routes.hub}\`\n- JSON: \`${registry.routes.public_export}\`\n- Inspectable primary records: ${registry[keyByPhase[phase]].length}\n- Public routes: ${registry.public_html_routes.length}\n\n| Measure | Value |\n| --- | ---: |\n${metricRows(registry.counts)}\n\n## Acceptance rules\n\n- Every displayed ID resolves to its named upstream record or exact official source.\n- Future dates, owner decisions, evidence admissions, longitudinal values, edition findings, and publication receipts remain null until lawfully supplied.\n- Alternative candidate IDs remain separate from canonical evidence source IDs.\n- Every public route and schema-1.0 export is inventoried in the aggregate.\n\n## Publication boundaries\n\n${publicationBoundaries.map((boundary) => `- ${boundary}`).join("\n")}\n\n## Next action\n\n${nextActionByPhase[phase]}\n`;
  await writeFile(join(workPackageRoot, exportNameByPhase[phase].replace(/\.json$/, ".md")), workPackage, "utf8");
}

const roadmap = `# FTFN v1 September operating roadmap\n\n**Effective date:** ${effectiveDate}  \n**Scope:** Phases 157–164  \n**Baseline:** ${p156.local_validation_receipt.receipt_id}\n\n## Outcome\n\nThe September operating overlay is fully assembled without rewriting the validated Phase 145–156 candidate. All non-time-gated content, source, route, export, decision-board, compatibility, editorial-runbook, and audit work is complete. Calendar and owner outcomes remain explicit.\n\n## Phase inventory\n\n| Phase | Program | Primary records | Routes | State |\n| ---: | --- | ---: | ---: | --- |\n${v1monthPhases.map((phase) => { const registry = registries.get(phase); return `| ${phase} | ${registry.title} | ${registry[keyByPhase[phase]].length} | ${registry.public_html_routes.length} | ${registry.build_status} |`; }).join("\n")}\n\n## Content delivered now\n\n- ${p161.counts.stack_watch_packets} official-source Stack Watch packets across ${p161.counts.stack_lanes} lanes with ${p161.counts.claim_blocks} claim blocks.\n- ${p162.counts.local_system_briefs} local-system briefs, ${p162.counts.dependency_maps} dependency maps, and ${p162.counts.timeline_entries} bounded timeline entries.\n- ${p163.counts.guide_currency_passes} field-guide currency bindings and ${p163.counts.comparison_passport_rechecks} comparison-passport rechecks.\n- Four source-bound editorial runbooks binding all ${p163.counts.desk_window_bindings} September windows and a month-end synthesis template.\n- ${p159.counts.total_owner_actions} owner actions prepared without manufacturing a decision.\n\n## September calendar\n\n${p158.operation_packets.map((operation) => `- ${operation.lawful_date}: ${operation.upstream_operation_id} — ${operation.title} (${operation.operation_state}; do not operate early)`).join("\n")}\n${p163.editorial_runbooks.map((runbook) => `- ${runbook.scheduled_date}: close ${runbook.desk_windows.length} desk windows, then operate ${runbook.upstream_edition_packet_id}.`).join("\n")}\n\n## October tail retained\n\n${p158.october_deferred_operation_ids.map((id) => `- ${id}`).join("\n")}\n\n## Promotion boundary\n\nPhase 164 currently derives ${p164.counts.passed} Pass, ${p164.counts.held} Held, and ${p164.counts.pending_build} Pending build state(s). v1 remains ${p164.v1_promotion_state}. Repository publication, hosting, DNS, and public launch require separate explicit authorization.\n`;
await writeFile(join(docsRoot, "roadmap-v1-september-operating-program.md"), roadmap, "utf8");

const handoff = `# FTFN v1 September operating-program handoff\n\n**Effective date:** ${effectiveDate}  \n**Current state:** ${aggregate.status}\n\n## Read first\n\n1. \`docs/roadmap-v1-september-operating-program.md\`\n2. \`app/src/data/v1-monthly-operating-program.json\`\n3. \`app/src/data/phase-158-september-evidence-operations-desk.json\`\n4. \`app/src/data/phase-159-owner-decision-sprint.json\`\n5. \`app/src/data/phase-161-stack-watch.json\`\n6. \`app/src/data/phase-164-monthly-candidate-decision.json\`\n\n## Immutable baseline\n\nDo not modify or re-finalize Phase 156 merely because this overlay increases whole-site page, export, source, or update counts. The Phase 156 receipt remains bound to digest \`${p156.local_validation_receipt.artifact_digest}\`.\n\n## Do not automate\n\n- Future-dated September or October evidence decisions.\n- Authority, requirement, mission, longitudinal-boundary, or owner adjudication.\n- GitHub publication, hosting, custom domain, DNS, or public launch.\n\n## Validation sequence\n\nRun from \`app/\`:\n\n\`\`\`text\nnpm run build:v1month-content\nnpm run validate:candidates\nnpm run validate:content\nnpm run source:health\nnpm run test:v1rc\nnpm run test:v1month\nnpm run check\nnpm run build\nnpm run verify:v1rc\nnpm run verify:v1month\nnpm run finalize:v1month-validation\nnpm run build:v1month-content\nnpm run build\nnpm run verify:v1month\nnpm run update:v1month-manifest\nnpm run verify:release\n\`\`\`\n\n## Current truth\n\n- Stack Watch, local-system, dependency, guide, comparison, runbook, route, export, and local audit surfaces are complete.\n- ${p159.counts.pending_owner_actions} Phase 159 owner actions remain pending.\n- The Phase 160 zero-series boundary remains owner-gated and zero observations were transferred.\n- Future operation and editorial fields remain unpredated.\n- v1 promotion remains ${p164.v1_promotion_state}.\n`;
await writeFile(join(docsRoot, "session-handoff-v1-september-operating-program.md"), handoff, "utf8");

console.log(`Built Phases 157–164: ${aggregate.public_html_routes.length} overlay routes, ${aggregate.public_json_exports.length} exports, ${p161.counts.stack_watch_packets} Stack Watch packets, ${p161.counts.claim_blocks} claim blocks, ${p162.counts.local_system_briefs} local briefs, ${p163.counts.desk_window_bindings} editorial-window bindings, and Phase 164 ${p164.v1_promotion_state}.`);
