import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "accepted-service-independent-outcome-validation-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-032-accepted-service-independent-outcome-validation";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const path of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"].map((name) => join(contentRoot, name))) {
  await mkdir(path, { recursive: true });
}

const phase57a = JSON.parse(await readFile(join(dataRoot, "phase-57a-fixed-cohort-completion-realized-outcomes.json"), "utf8"));
if (phase57a.phase !== "57A" || phase57a.records.length !== 16) throw new Error("Phase 57B requires the complete Phase 57A ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-57b-amtrak-ada-progress-june-2026",
    name: "Amtrak ADA Progress Report, June 2026",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/foia/amtrak-ada-progress-report-june-2026.pdf",
    owner: "National Railroad Passenger Corporation (Amtrak)", agency: "DOT", access: "Data Download",
    limitation: "The report defines substantial completion as passenger-use turnover and separately lists final completion. It does not provide station-feature uptime, trip-level usability, ridership effects, or a causal outcome evaluation.",
  },
  {
    id: "source-57b-louisiana-nextlink-first-bead-tower",
    name: "ConnectLA: Nextlink activates the first BEAD-funded tower",
    url: "https://connect.la.gov/press-releases/nextlink-activates-first-bead-funded-tower-in-the-united-states-connecting-rural-louisiana",
    owner: "Louisiana Office of Broadband Development and Connectivity", agency: "NTIA", access: "Release Page",
    limitation: "The state release establishes one live tower and service availability for 104 BEAD locations. It does not disclose a location list, subscriber count, test sample, latency, uptime, adoption, affordability, or closeout result.",
  },
  {
    id: "source-57b-louisiana-starlink-bead-agreement",
    name: "ConnectLA: Louisiana signs BEAD agreement with Starlink",
    url: "https://connect.la.gov/press-releases/louisiana-signs-bead-grant-agreement-with-spacexs-starlink-continuing-push-for-statewide-broadband-access",
    owner: "Louisiana Office of Broadband Development and Connectivity", agency: "NTIA", access: "Release Page",
    limitation: "The release establishes an agreement covering 10,635 planned locations and an end-of-summer delivery statement. It does not establish activation, service availability, subscribers, tests, adoption, or closeout.",
  },
  {
    id: "source-57b-montana-bead-quarterly-report-june-2026",
    name: "ConnectMT BEAD Quarterly Report Overview, June 2026",
    url: "https://doa.mt.gov/_docs/connectmt/LEO-Quarterly-Report-Instructions-6.1.26.pdf",
    owner: "Montana Department of Administration, ConnectMT", agency: "NTIA", access: "Data Download",
    limitation: "The instructions define required construction, subscriber, served-location, service-availability, and certification fields. They contain no completed subgrantee report or accepted project result.",
  },
  {
    id: "source-57b-hanford-central-plateau-water-operational",
    name: "DOE EM: New Hanford Water Treatment Facility Operational",
    url: "https://www.energy.gov/em/articles/new-hanford-water-treatment-facility-operational",
    owner: "U.S. Department of Energy Office of Environmental Management", agency: "DOE", access: "Release Page",
    limitation: "The release establishes acceptance testing and entry into potable-water service. Stated daily volumes are capability figures, not a period throughput, uptime, quality, cost, or downstream cleanup outcome series.",
  },
  {
    id: "source-57b-hanford-etf-six-month-campaign",
    name: "DOE EM: Hanford Treats More Than 7 Million Gallons of Contaminated Wastewater",
    url: "https://www.energy.gov/em/articles/hanford-treats-more-7-million-gallons-contaminated-wastewater",
    owner: "U.S. Department of Energy Office of Environmental Management", agency: "DOE", access: "Release Page",
    limitation: "The release reports one six-month ETF campaign and basin-level reduction. It does not disclose contaminant mass removed, influent and effluent concentrations, energy, unit cost, downtime, or independent performance validation.",
  },
  {
    id: "source-57b-ecology-wtp-byproduct-response-comments",
    name: "Washington Ecology response to comments on WTP byproduct permit modification",
    url: "https://apps.ecology.wa.gov/publications/documents/2605007.pdf",
    owner: "Washington State Department of Ecology", agency: "DOE", access: "Data Download",
    limitation: "The regulator record reports a dated operating snapshot of about 50,000 gallons and 34 containers. It is not a steady-state throughput, permit-compliance, lifecycle-cost, or environmental-outcome evaluation.",
  },
  {
    id: "source-57b-hanford-wtp-project-managers-may-2026",
    name: "Hanford WTP Tri-Party Agreement project managers meeting minutes, May 2026",
    url: "https://pdw.hanford.gov/download/v2/AR-40646",
    owner: "U.S. Department of Energy Hanford Field Office", agency: "DOE", access: "Data Download",
    limitation: "The minutes report a dated shipment count and near-term operating issues. They do not establish final container acceptance, steady-state rate, quality yield, downtime, lifecycle cost, or mission completion.",
  },
  {
    id: "source-57b-hanford-groundwater-decade-fy2024",
    name: "DOE EM: Hanford Site Builds on Decade of Groundwater Treatment",
    url: "https://www.energy.gov/em/articles/hanford-site-builds-decade-groundwater-treatment",
    owner: "U.S. Department of Energy Office of Environmental Management", agency: "DOE", access: "Release Page",
    limitation: "The release reports sitewide annual and cumulative treated volume plus facility capacity. It does not supply annual contaminant mass, plume, concentration, uptime, energy, cost, or restored-aquifer outcomes under one compatible series.",
  },
  {
    id: "source-57b-nnsa-sasc-testimony-may-2026",
    name: "DOE-NNSA joint testimony to the Senate Armed Services Committee, May 2026",
    url: "https://www.energy.gov/sites/default/files/2026-05/2026.05.13%20SASC-%20DOE-NNSA%20Joint%20Final%20Testimony.pdf",
    owner: "U.S. Department of Energy and National Nuclear Security Administration", agency: "DOE", access: "Data Download",
    limitation: "The testimony states production and capacity objectives but does not disclose a count of additional qualified W87-1 pits, a recurring accepted rate, rejects, rework, or a GAO-sufficient cost and schedule baseline.",
  },
  {
    id: "source-57b-nnsa-pit-production-draft-peis-2026",
    name: "NNSA Draft Plutonium Pit Production Programmatic Environmental Impact Statement",
    url: "https://www.energy.gov/sites/default/files/2026-04/draft-eis-0573-plutonium-pit-production-vol-1-2026-04.pdf",
    owner: "National Nuclear Security Administration", agency: "DOE", access: "Data Download",
    limitation: "The draft PEIS analyzes alternative capacities and environmental effects. Analytical capacity scenarios are not actual production, an approved program baseline, recurring output, or a final agency decision.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id, name: source.name, url: source.url, source_type: "Government Agency", credibility_level: "Tier 1",
    primary_topics: meta.topics, framework_layers: meta.layers, country_or_region: "United States", update_frequency: "Event Driven",
    capture_priority: "High", known_limitations: source.limitation, last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"], live_access_type: source.access,
    ...(source.access === "Data Download" ? { data_download_url: source.url } : {}), review_cadence_days: 45,
    monitoring_status: "Active", coverage_role: ["Primary Data", "Source Freshness"], jurisdiction: "United States public-sector program",
    source_owner: source.owner, notes: `Phase 57B accepted-service and independent-outcome source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "amtrak-eleven-station-passenger-use-cohort", agency: "DOT", actionKey: "AMTRAK-ADA-SUBSTANTIAL-2026-01", stage: "Accepted-service cohort", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak turns over eleven station projects for passenger use in the six-month cohort",
    finding: "Amtrak reports that eleven named stations reached substantial completion between November 1, 2025 and April 30, 2026; its definition says primary scope was complete and the facilities were turned over for passenger use.",
    denominator: "Eleven named station projects in Amtrak's November 1, 2025 through April 30, 2026 construction cohort: Camden, Detroit Lakes, Du Quoin, Fort Morgan, Granby, Hamlet, Havre, Miami, Pomona, Rocklin, and Rugby.",
    limits: ["Substantial completion can leave punch-list or minor work outstanding.", "Passenger-use turnover does not establish station-feature uptime or trip-level accessibility.", "The report does not attribute ridership, safety, reliability, or customer outcomes to the projects."],
    next: "Track each named station through final completion, compliant features, entrance and platform availability, outages, service use, and rider experience.",
  },
  {
    slug: "amtrak-eight-station-final-completion-cohort", agency: "DOT", actionKey: "AMTRAK-ADA-FINAL-2026-01", stage: "Accepted-service cohort", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak records eight final station completions in the six-month cohort",
    finding: "Amtrak reports eight named station projects reached final completion between November 1, 2025 and April 30, 2026.",
    denominator: "Eight named final-completion projects in the reporting window: Albany, Camden, Columbus, Detroit Lakes, Devils Lake, Fort Morgan, Mount Pleasant, and Tomah.",
    limits: ["Final project completion is not a measure of feature uptime after turnover.", "The final-completion list does not state which station elements changed in each location.", "No rider, ridership, safety, reliability, or cost outcome is reported for the cohort."],
    next: "Add project-specific scope, acceptance date, compliant features, outages, maintenance, service use, and rider-level outcomes for the same eight locations.",
  },
  {
    slug: "amtrak-three-station-substantial-to-final-match", agency: "DOT", actionKey: "AMTRAK-ADA-MATCHED-2026-01", stage: "Accepted-service cohort", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Three Amtrak stations appear in both passenger-use and final-completion cohorts",
    finding: "FTFN reconciles Amtrak's two named lists and finds Camden, Detroit Lakes, and Fort Morgan in both the substantial-completion and final-completion cohorts for the same six-month reporting window.",
    denominator: "The exact intersection of the report's eleven-station substantial-completion list and eight-station final-completion list: three named stations.",
    limits: ["This is a deterministic list intersection, not an agency causal or performance evaluation.", "The report does not provide elapsed days between turnover and final completion.", "The matched cohort does not establish accessibility uptime, usage, safety, reliability, or rider outcomes."],
    next: "Add station-level acceptance dates, scope, outstanding work, feature availability, maintenance, and passenger use for the matched three-station cohort.",
  },
  {
    slug: "amtrak-thirteen-accessible-boarding-ramp-deployments", agency: "DOT", actionKey: "AMTRAK-ABT-RAMPS-2026-01", stage: "Observed operating output", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak deploys thirteen modified boarding ramps, bringing the completed-car total to 141",
    finding: "Amtrak reports thirteen modified ramp installations on Superliner sleeper cars during the six-month period, bringing the cumulative completed-car total to 141; it also reports eight bridge-plate holders installed.",
    denominator: "Thirteen ramp-equipped Superliner I and II sleeper cars completed between November 1, 2025 and April 30, 2026, with a separate cumulative total of 141 completed cars.",
    limits: ["Installed equipment is not a fleet-availability or trip-level service measure.", "The report does not disclose the total eligible-car denominator or remaining backlog.", "No ramp uptime, failure, use, boarding-time, or rider-outcome measure is reported."],
    next: "Add the eligible fleet denominator, remaining backlog, in-service availability, failures, maintenance, actual use, boarding time, and rider experience.",
  },
  {
    slug: "amtrak-pids-closeout-validation-hold", agency: "DOT", actionKey: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-01", stage: "Closeout or performance hold", status: "In Review", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak PIDS hold: performance period ended while FRA closeout review remained pending",
    finding: "Amtrak says the Passenger Information Display System program period ended March 31, 2026, while FRA closeout reporting remained in final stages and pending review with a stated May 31 target.",
    denominator: "The PIDS program closeout package associated with the completed period of performance, kept separate from station count, system acceptance, uptime, coverage, and passenger-use results.",
    limits: ["A completed period of performance is not an accepted closeout.", "The report does not confirm FRA approval by the stated target date.", "No station coverage, uptime, accessibility, use, or outcome denominator is disclosed here."],
    next: "Reopen when FRA or Amtrak publishes accepted closeout, installed-station coverage, operational acceptance, uptime, accessibility, defects, and passenger-use results.",
  },
  {
    slug: "louisiana-nextlink-104-location-live-service", agency: "NTIA", actionKey: "LA-BEAD-NEXTLINK-SERVICE-2026-01", stage: "Accepted-service cohort", status: "Published", publicationDate: "2026-05-13", sourceIds: ["source-57b-louisiana-nextlink-first-bead-tower", "source-57a-louisiana-bead-nepa-approvals"],
    title: "Louisiana reports live BEAD service available to 104 Bossier Parish locations",
    finding: "ConnectLA reports that Nextlink activated a BEAD-funded fixed-wireless tower on May 1, 2026 and made gigabit-speed service available to 104 BEAD locations in Bossier Parish.",
    denominator: "One tower in southern Bienville Parish and the 104 BEAD locations in Bossier Parish stated as receiving service availability, within a larger 7,460-location Nextlink subgrant.",
    limits: ["Service availability is not an active-subscriber count or adoption rate.", "The release provides no disclosed location list, test sample, measured speed, latency, uptime, affordability, or independent acceptance result.", "One 104-location cohort does not close the earlier nearly 5,000-location Louisiana authorization cohort."],
    next: "Track the same 104 locations through disclosed availability, requests, installations, subscribers, tests, latency, uptime, affordability, adoption, and closeout.",
  },
  {
    slug: "louisiana-nextlink-service-validation-hold", agency: "NTIA", actionKey: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-01", stage: "Closeout or performance hold", status: "In Review", publicationDate: "2026-05-13", sourceIds: ["source-57b-louisiana-nextlink-first-bead-tower"],
    title: "Louisiana BEAD hold: live availability lacks disclosed subscriber and test results",
    finding: "The Nextlink tower establishes live service availability for 104 locations, but the state release does not publish the subscriber, installation, performance-test, uptime, adoption, affordability, or closeout results needed for a validated service outcome.",
    denominator: "The same 104-location Bossier Parish availability cohort, with required outcome fields treated as missing rather than inferred.",
    limits: ["A live tower does not prove every listed location requested or received service.", "Advertised gigabit service is not a disclosed test-sample distribution.", "No adoption, affordability, reliability, customer-experience, or program-closeout result is public in this record."],
    next: "Reopen with a stable served-location list, subscriber denominator, installation count, disclosed test sample, speed, latency, uptime, price, adoption, complaints, and accepted closeout.",
  },
  {
    slug: "louisiana-starlink-10635-location-agreement-hold", agency: "NTIA", actionKey: "LA-BEAD-STARLINK-HOLD-2026-01", stage: "Closeout or performance hold", status: "In Review", publicationDate: "2026-06-11", sourceIds: ["source-57b-louisiana-starlink-bead-agreement"],
    title: "Louisiana Starlink hold: a 10,635-location agreement precedes activated service",
    finding: "Louisiana reports a signed BEAD agreement with Starlink covering 10,635 locations across more than 50 parishes, with delivery stated for the end of summer 2026.",
    denominator: "The 10,635-location agreement cohort across more than 50 parishes, kept separate from activated, serviceable, subscribed, tested, or closed-out locations.",
    limits: ["A signed agreement is not network activation or service acceptance.", "An end-of-summer statement is a forward schedule, not a reported result.", "No location list, activation count, subscribers, tests, adoption, affordability, or closeout is disclosed."],
    next: "Reopen when Louisiana publishes location-level activation, service requests, subscriber counts, tests, latency, capacity reservation, adoption, affordability, and accepted closeout.",
  },
  {
    slug: "montana-bead-quarterly-results-hold", agency: "NTIA", actionKey: "MT-BEAD-QUARTERLY-HOLD-2026-01", stage: "Closeout or performance hold", status: "In Review", publicationDate: "2026-06-01", sourceIds: ["source-57b-montana-bead-quarterly-report-june-2026", "source-57a-montana-bead-disbursement-guide"],
    title: "Montana BEAD hold: quarterly reporting fields exist before submitted results",
    finding: "ConnectMT's June 2026 instructions require construction state, completion percentage, subscribers, CPE, served BSL and CAI files, service-availability actions, and certifications, but the document contains no subgrantee result.",
    denominator: "Each future subgrantee quarterly report and its stable project, BSL, CAI, subscriber, CPE, milestone, and certification fields.",
    limits: ["Reporting instructions are not a submitted or accepted report.", "Required served-location CSVs do not establish that any location has been served.", "No project completion, activation, subscriber, test, adoption, acceptance, or closeout result is public in the instructions."],
    next: "Reopen when ConnectMT publishes a completed report with project identity, cohort, construction stage, served locations, subscribers, tests, certification, acceptance, and closeout.",
  },
  {
    slug: "hanford-central-plateau-water-accepted-service", agency: "DOE", actionKey: "HANFORD-WATER-SERVICE-2026-01", stage: "Accepted-service cohort", status: "Published", publicationDate: "2026-01-20", sourceIds: ["source-57b-hanford-central-plateau-water-operational"],
    title: "Hanford's Central Plateau water facility passes acceptance testing and enters service",
    finding: "DOE reports that the Central Plateau Water Treatment Facility passed all operational acceptance testing and now provides potable water to the site's cleanup hub and tank-waste operations.",
    denominator: "The named 10,000-square-foot water-treatment facility and its accepted potable-water service to Hanford's Central Plateau; 3.5 million gallons per day is stated capability, not observed period throughput.",
    limits: ["Accepted service does not establish period throughput or 24/7 uptime.", "The 3.5-million-gallon daily figure is capability, not a disclosed daily result.", "No water-quality distribution, failures, unit cost, or attributable cleanup outcome is reported."],
    next: "Add monthly throughput, uptime, water quality, outages, energy, cost, demand, fire-suppression availability, and downstream operating effects.",
  },
  {
    slug: "hanford-etf-725-million-gallon-campaign", agency: "DOE", actionKey: "HANFORD-ETF-CAMPAIGN-2025-01", stage: "Observed operating output", status: "Published", publicationDate: "2025-09-30", sourceIds: ["source-57b-hanford-etf-six-month-campaign"],
    title: "Hanford ETF treats 7.25 million gallons in a six-month campaign",
    finding: "DOE reports that the Effluent Treatment Facility processed more than 7.25 million gallons of contaminated wastewater over six months and lowered one storage-basin level by almost 17 feet.",
    denominator: "One six-month ETF campaign, measured as treated wastewater volume and the separate level change in one named storage basin.",
    limits: ["Treated volume is not contaminant mass removed or restored environmental condition.", "The basin-level change is not a sitewide inventory or capacity measure.", "No influent and effluent concentration, quality yield, downtime, energy, unit cost, or independent validation is disclosed."],
    next: "Add compatible ETF campaigns with feed source, influent and effluent concentrations, contaminant mass, quality, uptime, energy, unit cost, basin inventory, and regulator review.",
  },
  {
    slug: "hanford-ecology-50000-gallons-34-containers", agency: "DOE", actionKey: "HANFORD-ECOLOGY-WTP-2026-01", stage: "Observed operating output", status: "Published", publicationDate: "2026-04-26", sourceIds: ["source-57b-ecology-wtp-byproduct-response-comments", "source-57a-wa-ecology-hanford-overview"],
    title: "Washington Ecology records about 50,000 gallons treated into 34 containers",
    finding: "A Washington Ecology permit-response record states that, as of February 2026, Hanford's Direct-Feed Low-Activity Waste program had treated about 50,000 gallons and filled 34 containers.",
    denominator: "A dated regulator-published operating snapshot: approximately 50,000 gallons of tank waste treated and 34 containers filled as of February 2026.",
    limits: ["The values are approximate and do not establish a monthly or steady-state rate.", "Filled containers are not the same as shipped, accepted, or permanently disposed containers.", "The permit record does not provide quality yield, rejects, downtime, cost, residual inventory, or causal environmental outcome."],
    next: "Add later regulator snapshots with exact dates, gallons, filled, shipped, accepted and disposed containers, quality, rejects, downtime, cost, and permit compliance.",
  },
  {
    slug: "hanford-joint-minutes-66-containers-shipped", agency: "DOE", actionKey: "HANFORD-IDF-SHIPMENTS-2026-01", stage: "Observed operating output", status: "Published", publicationDate: "2026-05-14", sourceIds: ["source-57b-hanford-wtp-project-managers-may-2026", "source-57b-ecology-wtp-byproduct-response-comments"],
    title: "Hanford project minutes report 66 LAW containers shipped to IDF by May 2026",
    finding: "May 2026 WTP project-managers meeting minutes report that 66 containers had been shipped to the Integrated Disposal Facility and that acceptable-quality LAW glass processing would continue.",
    denominator: "Sixty-six containers reported shipped to IDF by the May 14, 2026 meeting, kept separate from filled, accepted, disposed, rejected, or remaining containers.",
    limits: ["Shipment to IDF is not proof that all 66 containers were accepted or permanently disposed.", "The minutes do not disclose the time distribution, quality yield, rejects, rework, or downtime.", "A cumulative shipment count does not establish steady-state production or mission completion."],
    next: "Track filled, shipped, received, accepted, disposed, rejected and reworked containers by month with quality, downtime, cost, permit, and residual-inventory records.",
  },
  {
    slug: "hanford-groundwater-fy2024-repeat-outcome", agency: "DOE", actionKey: "HANFORD-GROUNDWATER-FY2024-01", stage: "Observed operating output", status: "Published", publicationDate: "2024-10-15", sourceIds: ["source-57b-hanford-groundwater-decade-fy2024", "source-57a-wa-ecology-hanford-overview"],
    title: "Hanford treats 2.3 billion groundwater gallons in FY 2024, the tenth year above 2 billion",
    finding: "DOE reports 2.3 billion gallons treated in FY 2024 and ten consecutive fiscal years above 2 billion gallons, while Washington Ecology later reports more than 38 billion gallons cumulatively across six facilities.",
    denominator: "FY 2024 sitewide treated groundwater volume across Hanford's six treatment systems, plus a ten-year threshold series; the later regulator cumulative total is a separate denominator.",
    limits: ["A threshold series does not disclose the exact annual value for every year.", "Treated water volume is not annual contaminant mass removed, plume reduction, or aquifer restoration.", "The 200 West capacity expansion is capability and cannot be counted as realized treatment beyond the reported 2.3 billion gallons."],
    next: "Add exact annual facility-level volumes, uptime, contaminant mass, concentration, plume extent, energy, cost, regulator review, and accepted expansion performance.",
  },
  {
    slug: "nnsa-100-pits-by-2028-rate-hold", agency: "DOE", actionKey: "NNSA-PIT-RATE-HOLD-2026-01", stage: "Rate, capacity, and baseline hold", status: "In Review", publicationDate: "2026-05-13", sourceIds: ["source-57b-nnsa-sasc-testimony-may-2026", "source-57a-nnsa-w87-1-first-production-unit"],
    title: "NNSA rate hold: a 100-pit 2028 objective is not recurring accepted output",
    finding: "DOE-NNSA testimony states an objective to produce at least 100 pits by the end of calendar 2028, reach 30 pits per year, and expand LANL target capacity beyond 60 pits per year, but it does not disclose additional qualified W87-1 output.",
    denominator: "The forward LANL production and capacity objectives in May 2026 testimony, kept separate from the single qualified W87-1 First Production Unit and any observed recurring period.",
    limits: ["A target count and capacity objective are not actual qualified production.", "The testimony does not disclose accepted pits after the first production unit.", "No rejects, rework, equipment attribution, recurring rate, schedule confidence, lifecycle cost, or enterprise readiness result is reported."],
    next: "Reopen with a defined period, qualified and accepted pit count, rejects and rework, equipment attribution, rate, capacity acceptance, schedule, lifecycle cost, and independent review.",
  },
  {
    slug: "nnsa-draft-peis-capacity-scenarios-hold", agency: "DOE", actionKey: "NNSA-PIT-PEIS-HOLD-2026-01", stage: "Rate, capacity, and baseline hold", status: "In Review", publicationDate: "2026-04-01", sourceIds: ["source-57b-nnsa-pit-production-draft-peis-2026"],
    title: "NNSA capacity hold: draft PEIS scenarios are analytical cases, not production results",
    finding: "NNSA's draft PEIS analyzes multi-site capacities including 30 pits per year at LANL plus 50 at Savannah River, as well as higher maximum and lower capability-based scenarios, while acknowledging that months or years with no production may occur.",
    denominator: "Environmental-analysis scenarios spanning 10 to 80 pits per year at LANL and 50 to 125 at Savannah River, not observed qualified output or accepted rate production.",
    limits: ["A draft environmental analysis is not a final production decision or operating result.", "Analyzed capacity is not installed, accepted, sustained, or used capacity.", "The scenarios do not provide a qualified output count, schedule confidence, lifecycle cost, or GAO-accepted program baseline."],
    next: "Reopen only with final decisions plus installed and accepted capacity, recurring qualified output, period, site, rejects, rework, schedule, cost, and independent validation.",
  },
  {
    slug: "nnsa-gao-april-2026-baseline-hold", agency: "DOE", actionKey: "NNSA-PIT-GAO-BASELINE-HOLD-2026-02", stage: "Rate, capacity, and baseline hold", status: "In Review", publicationDate: "2026-04-01", sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-57b-nnsa-sasc-testimony-may-2026"],
    title: "GAO keeps the NNSA pit-production lifecycle-cost recommendation open in April 2026",
    finding: "GAO reports that, as of April 2026, NNSA had not developed a lifecycle cost estimate aligned with GAO best practices and forecast a December 2026 estimate after SRPPF design work.",
    denominator: "The enterprise program to establish and sustain pit production across Los Alamos and Savannah River, evaluated against GAO schedule and lifecycle-cost best practices.",
    limits: ["A forecast December estimate is not a completed or GAO-accepted baseline.", "The recommendation status does not measure qualified output or operating rate.", "The record does not support schedule confidence, total cost, cost outcome, capacity acceptance, or readiness."],
    next: "Reopen when NNSA publishes the integrated master schedule and lifecycle cost estimate, GAO records sufficiency, and recurring accepted output is reported under a stable site and period denominator.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const carriedIds = [...new Set(specs.flatMap((spec) => spec.sourceIds).filter((id) => !sourceById.has(id)))];
for (const id of carriedIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}

const authorityBoundary = "Authorization, construction, turnover, final completion, service availability, subscriber use, tested performance, accepted operation, observed output, recurring rate, analytical capacity, baseline, realized outcome, closeout, implementation, and closure remain separate. No record supports a cross-system ranking, composite score, readiness score, generalized savings claim, or causal attribution.";
const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-57b-${spec.slug}`, document_id: `research-doc-57b-${spec.slug}`, signal_id: `signal-57b-${spec.slug}`,
    document_number: 622 + index, phase: "57B", action_key: spec.actionKey, agency: spec.agency, entity_id: meta.entity,
    record_type: "Accepted-service and independent-outcome validation panel", evidence_stage: spec.stage, title: spec.title,
    record_status: spec.status, source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url, publication_date: spec.publicationDate,
    document_type: spec.stage.includes("hold") ? "Technical Report" : "Program Milestone",
    finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits, next_action: spec.next,
    exact_target_artifact_acquired: false, directive_scope_change: false, implementation_change: false, closure_change: false,
    contact_or_foia_submitted: false, authority_boundary: authorityBoundary, captured_date: capturedDate,
  };
});

const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const evidenceStageCounts = Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length]));

await writeJson(join(dataRoot, "phase-57b-accepted-service-independent-outcome-validation.json"), {
  phase: "57B", captured_date: capturedDate,
  goal: "Build named accepted-service cohorts, observed operating outputs, independent validation, and explicit closeout, performance, rate, capacity, and baseline holds from the Phase 57A handoff.",
  publication_rule: "Publish only when the named entity and cohort have an observed turnover, accepted service, or operating output with explicit stage, period, unit, method, denominator, and attribution; retain forward schedules, reporting contracts, undisclosed performance, analytical capacity, and incomplete baselines as In Review.",
  authority_rule: "Service availability is not adoption; turnover is not final outcome; analytical capacity is not recurring output; independent reporting is not causal validation.",
  records_reviewed: records.length, records_published: published.length, records_held: held.length,
  evidence_stage_counts: evidenceStageCounts, new_official_source_profiles: sources.length, carried_official_source_profiles: carriedIds.length,
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [],
  prior_visible_scope: phase57a.post_batch_visible_scope, post_batch_visible_scope: phase57a.post_batch_visible_scope,
  post_batch_closure_counts: phase57a.post_batch_closure_counts,
  reopened_holds: [{ action_key: "LA-BEAD-SERVICE-HOLD-01", result: "Partially reopened for one 104-location Nextlink service-availability cohort; the broader nearly 5,000-location authorization cohort remains open." }],
  preserved_holds: ["MT-BEAD-TEST-HOLD-01", "NNSA-PIT-BASELINE-HOLD-01"],
  records,
});

await writeJson(join(dataRoot, "phase-57b-publication-review.json"), {
  phase: "57B", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), exact_target_artifacts_acquired: 0,
  decision: "Ten records publish as named accepted-service cohorts or observed operating outputs. Seven remain In Review because closeout, subscriber and performance results, activation, recurring rate, installed capacity, or complete cost and schedule baselines are absent.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 621).padStart(2, "0")}-${record.record_id.replace(/^record-57b-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57b-${record.record_id.replace(/^record-57b-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date,
    document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record advances a named cohort into accepted service or observed operating output without inflating use, performance, closeout, rate, or outcome." : "The visible hold preserves a useful reporting, schedule, capacity, performance, or baseline boundary without presenting it as an accepted result.",
    ftfn_relevance: ["Preserves entity, cohort, lifecycle stage, period, unit, method, denominator, revision history, and attribution.", "Separates turnover, service availability, subscribers, tests, accepted operation, recurring rate, capacity, baseline, outcome, closeout, implementation, and closure.", "Keeps dated checks and exact-artifact retrieval non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "GAO acceptance, implementation, closure, and entity evidence remain separate from this content expansion.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls,
    official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`, capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: ${JSON.stringify(record.record_status)}\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Official Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}\n+${yamlList("dependencies", ["stable named entity and cohort", "compatible lifecycle stage and period", "explicit unit, method, denominator, and attribution", "later use, performance, closeout, rate, or outcome evidence"])}\n+${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 57B accepted-service and independent-outcome validation panels"])}\n+${yamlList("local_implications", ["Do not collapse turnover, service availability, subscribers, tests, accepted operation, recurring rate, capacity, baseline, outcome, closeout, implementation, and closure into one stage."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57B named-cohort evidence contract." : "Held until accepted closeout, observed use and performance, recurring qualified output, installed capacity, or a complete baseline is public.")}\n+---\n+\n+## Phase 57B panel\n+\n+${record.finding}\n+\n+## Evidence stage and denominator\n+\n+**${record.evidence_stage}.** ${record.denominator}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Accepted Service and Independent Outcome Validation, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57B reviews seventeen Amtrak, BEAD, Hanford, and NNSA panels, publishing ten named accepted-service or observed-output records and retaining seven explicit closeout, performance, rate, capacity, or baseline holds.",
  scope: "Four Amtrak accepted-service or output records and one closeout hold; one Louisiana live-service cohort and three BEAD performance or activation holds; five Hanford accepted-service and operating-output records; and three NNSA rate, capacity, and baseline holds.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-file archive contains seventeen official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Named entity, cohort, lifecycle stage, period, unit, method, denominator, revision history, and attribution remain explicit. Turnover is not final outcome, service availability is not adoption, and analytical capacity is not recurring accepted output.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 032: Accepted Service and Independent Outcome Validation"\n+slug: "research-watch-032-accepted-service-independent-outcome-validation"\n+record_status: "Published"\n+summary: "Phase 57B publishes ten named accepted-service and operating-output records while holding seven closeout, performance, rate, capacity, and baseline claims at their actual evidence stage."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", signalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", ["Amtrak supplies named passenger-use and final-completion cohorts plus a matched three-station reconciliation and thirteen railcar ramp deployments.", "Louisiana partially reopens the BEAD service hold with one live 104-location cohort while subscriber, performance, adoption, and broader-cohort results remain absent.", "Hanford adds accepted utility service, facility throughput, regulator and project-manager output snapshots, and a repeat groundwater period; NNSA remains held at forward rate, analytical capacity, and incomplete-baseline stages."])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Station feature uptime, passenger use, accepted closeout, and rider outcomes", "BEAD location lists, subscribers, test samples, latency, uptime, adoption, affordability, and closeout", "Hanford monthly facility throughput, quality, rejects, downtime, contaminant mass, cost, and regulator review", "Qualified W87-1 output by period, rejects, rework, accepted rate, integrated schedule, lifecycle cost, and GAO sufficiency"])}\n+---\n+\n+## What Phase 57B adds\n+\n+The batch reviews seventeen records and publishes ten. Amtrak's June report produces named turnover and final-completion cohorts. Louisiana supplies the first bounded live BEAD service cohort. Hanford adds accepted utility service and compatible operating outputs from DOE, Washington Ecology, and project-management records. Seven visible holds prevent closeout, performance, activation, rate, capacity, or baseline claims from outrunning public evidence.\n+\n+## Accepted service is a stage, not an outcome bundle\n+\n+Passenger-use turnover can retain punch-list work. Final station completion does not establish feature uptime or rider outcomes. A live broadband tower does not establish subscribers, tested performance, adoption, affordability, or closeout. Accepted utility service does not establish throughput, quality, cost, or downstream cleanup effects.\n+\n+## Independent and cross-authority records\n+\n+Washington Ecology records approximately 50,000 gallons treated into 34 containers. Hanford project minutes later report 66 containers shipped to IDF. These are useful dated operating observations with distinct filled, shipped, accepted, and disposed stages; they are not interchangeable denominators.\n+\n+## Rate and baseline holds\n+\n+NNSA's 2028 count and capacity objectives and the draft PEIS scenarios are forward or analytical states. GAO still reports no best-practice lifecycle cost estimate as of April 2026. None establishes recurring accepted output or enterprise readiness.\n+\n+## Evidence boundary\n+\n+No Phase 57B record changes directive scope, implementation, closure, or the one Closed / twenty-one Partially Closed / two Open entity ledger. No ranking, composite, readiness score, generalized savings claim, or unsupported causal inference is supported.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-032-accepted-service-independent-outcome-validation.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-57b-accepted-service-independent-outcome-validation.json"), {
  id: "update-2026-08-02-phase-57b-accepted-service-independent-outcome-validation", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57B publishes ten accepted-service and observed-output panels",
  summary: "Eleven new Tier 1 source profiles and carried official sources support ten Published panels and seven explicit In Review holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-032-accepted-service-independent-outcome-validation/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded. Turnover, service, use, tests, operation, output, rate, capacity, baseline, outcome, closeout, implementation, and closure remain separate.",
  work_package: "docs/work-packages/phase-57b-accepted-service-independent-outcome-validation.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
const doeSourceIds = sources.filter((source) => source.agency === "DOE").map((source) => source.id);
const mobilitySourceIds = ["source-57b-amtrak-ada-progress-june-2026"];
const beadSourceIds = sources.filter((source) => source.agency === "NTIA").map((source) => source.id);

await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => {
  value.source_ids = appendUnique(value.source_ids, doeSourceIds);
});

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 57B accepted-service cohort next reports a compatible cost, use, reliability, closeout, or realized outcome?"],
  ["policy-and-standards.json", newSourceIds, "Which Phase 57B hold next closes with accepted closeout, disclosed performance, recurring output, or a complete baseline?"],
  ["mobility.json", mobilitySourceIds, "Which named Amtrak cohort next adds feature uptime, passenger use, final acceptance, and rider outcomes?"],
  ["chips-and-compute.json", beadSourceIds, "Which BEAD cohort next publishes served-location, subscriber, test, adoption, affordability, and closeout results?"],
  ["energy.json", doeSourceIds, "Which Hanford or NNSA cohort next gains compatible quality, downtime, contaminant-removal, recurring-output, cost, schedule, or independent-validation evidence?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, newSourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...mobilitySourceIds, ...beadSourceIds]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), doeSourceIds],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-57b-"));
    value.signal_ids = appendUnique(value.signal_ids, selectedSignals); value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]); value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57B accepted-service and independent-outcome validation panels");
    value.dependency_stack.push({ stage: "Phase 57B accepted-service and independent-outcome validation panels", current_state: "Ten Published panels and seven In Review holds distinguish named accepted service, observed output, closeout, performance, rate, capacity, and baseline evidence.", boundary: "Turnover, service availability, subscribers, tests, accepted operation, recurring rate, capacity, baseline, outcome, closeout, implementation, and closure remain separate." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57B prohibits denominator-free comparison, turnover-based outcome claims, capacity-to-output inflation, cross-system rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Compatible service use, disclosed tests, quality, downtime, independent review, accepted closeout, recurring qualified output, complete baselines, and realized outcomes under the same named-cohort contract."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57B adds ten Published named accepted-service or observed-output panels and seven explicit holds while turnover, use, performance, rate, capacity, baseline, closeout, and outcome remain separate.";
  value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-57b-"));
  value.source_ids = appendUnique(value.source_ids, newSourceIds); value.signal_ids = appendUnique(value.signal_ids, publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57b-accepted-service-independent-outcomes");
  value.links = value.links.filter((link) => link.from !== "node-phase57b-accepted-service-independent-outcomes");
  value.nodes.push({ id: "node-phase57b-accepted-service-independent-outcomes", label: "Ten accepted-service or observed-output panels; seven holds", node_type: "Signal", note: "Named cohorts advance only when stage, period, unit, method, denominator, revision history, and authority remain explicit." });
  value.links.push(
    { from: "node-phase57b-accepted-service-independent-outcomes", to: "node-phase57a-fixed-cohort-completion-realized-outcomes", relationship: "Depends On", confidence: "Supported", note: "Phase 57B extends fixed cohorts into named accepted service, observed operating output, and explicit validation holds." },
    { from: "node-phase57b-accepted-service-independent-outcomes", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Stations, railcars, broadband locations, gallons, containers, pits, capacity, and cost baselines are non-interchangeable denominators." },
    { from: "node-phase57b-accepted-service-independent-outcomes", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Turnover, live service, regulator snapshots, analytical capacity, and targets do not establish generalized causation, ranking, or readiness." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Ten bounded named accepted-service or observed-output panels plus seven visible closeout, performance, rate, capacity, or baseline holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Compatible service use, test samples, quality, uptime, contaminant removal, recurring qualified output, complete cost and schedule baselines, accepted closeout, and realized-outcome evidence."]);
});

console.log(`Generated Phase 57B: ${published.length} Published records, ${held.length} In Review holds, ${sources.length} new Tier 1 sources, and Research Watch 032.`);
