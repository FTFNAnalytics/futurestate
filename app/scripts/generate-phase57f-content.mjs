import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-03";
const collectionSlug = "measured-reliability-observed-adoption-full-output-reconciliation-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const name of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57e = JSON.parse(await readFile(join(dataRoot, "phase-57e-asset-reliability-cohort-adoption-accepted-output-closure.json"), "utf8"));
if (phase57e.phase !== "57E" || phase57e.records.length !== 24) throw new Error("Phase 57F requires the complete Phase 57E ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-57f-amtrak-stations-alp-fy24-29",
    name: "Amtrak FY24-29 Stations Asset Line Plan Appendices",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/businessplanning/Amtrak-Stations-ALP-Appendices-FY24-29.pdf",
    owner: "National Railroad Passenger Corporation", agency: "DOT", frequency: "Five Year", access: "Report Series",
    limitation: "The plan supplies named historical station cohorts and April 2023 completion snapshots. It predates the June 2026 reports and does not publish current station-device uptime, outages, maintenance, use, complaints, resolution, boarding time, or rider outcomes.",
  },
  {
    id: "source-57f-montana-bead-resource-index-august-2026",
    name: "ConnectMT BEAD Forms, Guidance, Reporting, and Reimbursement Index",
    url: "https://doa.mt.gov/ConnectMT/iija/",
    owner: "Montana Department of Administration", agency: "NTIA", frequency: "Event Driven", access: "Manual Page Check",
    limitation: "The live index identifies reporting instructions, performance testing, served-location files, monitoring guides, and reimbursement materials but does not publish completed awardee outcome tables.",
  },
  {
    id: "source-57f-montana-leo-quarterly-instructions-june-2026",
    name: "ConnectMT BEAD LEO Quarterly Report Instructions, June 2026",
    url: "https://doa.mt.gov/_docs/connectmt/LEO-Quarterly-Report-Instructions-6.1.26.pdf",
    owner: "Montana Department of Administration", agency: "NTIA", frequency: "Quarterly", access: "Report Series",
    limitation: "The instructions define ten years of reporting, active-subscriber counts, CPE shipments, served BSL files, service availability, and performance testing. They contain requirements, not Starlink or other awardee results.",
  },
  {
    id: "source-57f-hanford-wtp-pmm-february-2026",
    name: "Hanford Tank Waste Operations Project Managers Meeting Minutes, February 12, 2026",
    url: "https://pdw.hanford.gov/download/v2/AR-39756",
    owner: "U.S. Department of Energy Hanford Field Office and Washington State Department of Ecology", agency: "DOE", frequency: "Monthly", access: "Report Series",
    limitation: "The minutes report nineteen vitrified-waste containers sent to IDF but do not provide stable container identities, fill and quality-release dates, exact mass, acceptance, disposal, rejects, rework, or a complete monthly material balance.",
  },
  {
    id: "source-57f-doe-hanford-100k-gallons-may-2026",
    name: "DOE EM: Over 100,000 Gallons of Hanford Tank Waste Turned to Glass",
    url: "https://www.energy.gov/em/articles/over-100000-gallons-hanford-tank-waste-turned-glass",
    owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", frequency: "Event Driven", access: "Release Page",
    limitation: "The release gives a cumulative commissioning milestone and nominal filled-container dimensions and weight, but no exact treated volume, glass mass, container count, quality yield, rejects, rework, stage reconciliation, or regulator-verified balance.",
  },
  {
    id: "source-57f-nnsa-pit-production-current",
    name: "NNSA Plutonium Pit Production Program Page",
    url: "https://www.energy.gov/nnsa/plutonium-pit-production",
    owner: "National Nuclear Security Administration", agency: "DOE", frequency: "Event Driven", access: "Manual Page Check",
    limitation: "The current page states that capability is limited to research-and-development pits unsuitable for stockpile use and describes the 80-per-year capacity goal. It publishes no produced, qualified, rejected, reworked, or accepted site-period series.",
  },
  {
    id: "source-57f-nnsa-stockpile-current",
    name: "NNSA U.S. Nuclear Weapons Stockpile Program Page",
    url: "https://www.energy.gov/nnsa/us-nuclear-weapons-stockpile",
    owner: "National Nuclear Security Administration", agency: "DOE", frequency: "Event Driven", access: "Manual Page Check",
    limitation: "The page describes enterprise production, quality, verification, acceptance, and stockpile-management functions at a broad level but does not disclose plutonium-pit output by site, period, qualification, rejection, rework, or acceptance status.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id, name: source.name, url: source.url, source_type: "Government Agency", credibility_level: "Tier 1",
    primary_topics: meta.topics, framework_layers: meta.layers, country_or_region: "United States",
    update_frequency: source.frequency, capture_priority: "High", known_limitations: source.limitation,
    last_checked_date: capturedDate, watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"],
    live_access_type: source.access, review_cadence_days: source.frequency === "Quarterly" ? 92 : source.frequency === "Five Year" ? 365 : 45,
    monitoring_status: "Active", coverage_role: ["Primary Data", "Source Freshness"], jurisdiction: "United States public-sector program",
    source_owner: source.owner, notes: `Phase 57F measured reliability, observed adoption, and full output reconciliation source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "amtrak-historical-pids-cohort-reconciliation", agency: "DOT", actionKey: "AMTRAK-PIDS-HISTORICAL-COHORT-2026-01", stage: "Measured reliability denominator reconciliation", status: "Published", publicationDate: "2023-04-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57b-amtrak-ada-progress-june-2026", "source-57e-amtrak-accessibility-progress-june-2026"],
    title: "Amtrak's historical 120-station PIDS cohort anchors 96 completed deployments before the 2026 count split",
    finding: "Amtrak's FY24-29 station plan identifies 120 stations with known or potential PIDS deficiencies and 96 completed deployments as of April 30, 2023; later June 2026 reports separately state 93 deployments and 117 installations.",
    denominator: "The named 120-station historical deficiency cohort and its 96 completed-deployment snapshot, preserved separately from the later 93-deployment and 117-installation aggregates.",
    limits: ["The three reports use different dates and labels and cannot be merged into a trend without a crosswalk.", "Completion does not establish accepted closeout or current operating availability.", "No asset-period uptime, defects, maintenance, use, complaints, resolution, or rider outcomes are disclosed."],
    next: "Publish a station-device register mapping the 120, 96, 93, and 117 inventories with revision reason, acceptance, operating status, and asset-period quality fields.",
  },
  {
    slug: "amtrak-ada-responsibility-boundary", agency: "DOT", actionKey: "AMTRAK-ADA-RESPONSIBILITY-BOUNDARY-2026-01", stage: "Measured reliability denominator reconciliation", status: "Published", publicationDate: "2023-04-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29"], title: "Amtrak's historical ADA program covers responsibility at 385 of 515 required stations",
    finding: "The station plan states that 515 Amtrak-system stations were required to be accessible under the ADA and that Amtrak had full or partial ADA responsibility at 385.",
    denominator: "The 515-station statutory system boundary and the nested 385-station Amtrak-responsibility portfolio as defined in the FY24-29 plan.",
    limits: ["Responsibility can apply to only some station components.", "The denominator is a historical program boundary, not a current station compliance count.", "It does not establish PIDS uptime, asset use, complaint resolution, boarding performance, or rider experience."],
    next: "Publish a current station-component responsibility register and connect each asset to operating, complaint, remediation, and acceptance observations.",
  },
  {
    slug: "amtrak-train-access-historical-cohort", agency: "DOT", actionKey: "AMTRAK-TRAIN-ACCESS-HISTORICAL-COHORT-2026-01", stage: "Measured reliability denominator reconciliation", status: "Published", publicationDate: "2023-04-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29"], title: "Amtrak's 30-station train-access cohort records 18 completed projects as of April 2023",
    finding: "Amtrak identified 30 stations with known or potential train-access deficiencies and reported 18 completed, five assigned to third-party projects, and seven in design through April 2023.",
    denominator: "The named 30-station historical train-access-deficiency cohort, partitioned into 18 completed, five third-party, and seven design-stage stations.",
    limits: ["Project completion is not asset-period operating reliability.", "Third-party responsibility does not establish completion or acceptance.", "No boarding-time, lift or ramp availability, failed-use, complaint, remediation, or rider-outcome series is supplied."],
    next: "Reconcile every station to current responsibility, accepted work, asset availability, boarding performance, complaints, remediation, and rider outcomes.",
  },
  {
    slug: "amtrak-amenity-historical-closure-cohort", agency: "DOT", actionKey: "AMTRAK-AMENITY-HISTORICAL-CLOSURE-2026-01", stage: "Measured reliability denominator reconciliation", status: "Published", publicationDate: "2019-09-30",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29"], title: "Amtrak reports all 47 historically identified station-access and amenity deficiencies addressed by fiscal 2019",
    finding: "The FY24-29 plan states that all 47 stations in the historically identified entrance, exit, restroom, or ticket-counter deficiency cohort had been addressed by fiscal 2019.",
    denominator: "The plan's fixed 47-station historical access-and-amenity deficiency cohort, not the full 385-station responsibility portfolio.",
    limits: ["Addressed is not a current facility-condition or reliability measure.", "Later assessments can identify additional deficiencies.", "No asset identity, downtime, maintenance, complaint, recurrence, or independent acceptance table is provided."],
    next: "Publish current post-construction assessment, recurrence, availability, maintenance, complaint, and acceptance results for the named 47-station cohort.",
  },
  {
    slug: "amtrak-pids-closeout-reliability-hold", agency: "DOT", actionKey: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-05", parentHold: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-04", stage: "Measured reliability outcome hold", status: "In Review", publicationDate: "2026-06-01",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57b-amtrak-ada-progress-june-2026", "source-57e-amtrak-accessibility-progress-june-2026"], title: "Amtrak PIDS closeout hold: historical lineage does not resolve the 2026 asset register",
    finding: "The historical 120-station and 96-completion cohort clarifies lineage but does not reconcile the June 2026 93-deployment and 117-installation counts or establish accepted closeout and operating quality.",
    denominator: "One reconciled station-device register spanning the historical 120 and 96 records and the June 2026 93 and 117 records, with stable identities and acceptance state.",
    limits: ["Historical portfolio structure cannot be assumed to match the 2026 scope.", "Aggregate completion is not accepted closeout.", "No compatible uptime, outage, use, complaint, resolution, or rider-outcome observations are public."],
    next: "Reopen only with accepted closeout, a reconciled station-device register, and compatible operating-quality observations.",
  },
  {
    slug: "amtrak-named-asset-reliability-hold", agency: "DOT", actionKey: "AMTRAK-NAMED-RELIABILITY-HOLD-2026-04", parentHold: "AMTRAK-NAMED-RELIABILITY-HOLD-2026-03", stage: "Measured reliability outcome hold", status: "In Review", publicationDate: "2026-06-01",
    sourceIds: ["source-57f-amtrak-stations-alp-fy24-29", "source-57e-amtrak-accessibility-progress-june-2026"], title: "Amtrak named-asset reliability hold: station cohorts still lack asset-period outcomes",
    finding: "Named historical station cohorts are available, but official reports still do not publish compatible asset-period reliability, actual-use, complaint, resolution, boarding-time, or rider-experience results.",
    denominator: "Each stable station and accessibility asset by reporting period, including installed, accepted, available, failed, repaired, used, complained, resolved, and rider-outcome fields.",
    limits: ["Station identity alone does not identify each device or mobility asset.", "Construction status does not establish reliability.", "Aggregate engagement and remediation statements cannot supply asset-period outcomes."],
    next: "Reopen with stable asset identifiers and compatible asset-period reliability, use, complaint, and rider-outcome tables.",
  },
  {
    slug: "montana-leo-ten-year-reporting-window", agency: "NTIA", actionKey: "MT-BEAD-LEO-TEN-YEAR-REPORTING-2026-01", stage: "Observed adoption measurement contract", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57f-montana-leo-quarterly-instructions-june-2026", "source-57f-montana-bead-resource-index-august-2026"], title: "Montana requires LEO quarterly reporting for ten years after universal project availability certification",
    finding: "ConnectMT requires LEO subgrantees to file quarterly reports from grant execution through ten years after certifying service availability to every covered location.",
    denominator: "Each LEO award's exact covered-location cohort and quarterly reporting periods through the ten-year post-availability window.",
    limits: ["A reporting duration is not retention performance.", "The public instructions contain no awardee submission or subscriber outcome.", "A universal-availability certification is not universal adoption."],
    next: "Publish privacy-safe quarterly awardee totals with cohort identity, availability certification, subscribers, retention, price, complaints, tests, remediation, and state acceptance.",
  },
  {
    slug: "montana-leo-active-subscriber-count-contract", agency: "NTIA", actionKey: "MT-BEAD-LEO-SUBSCRIBER-COUNT-CONTRACT-2026-01", stage: "Observed adoption measurement contract", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57f-montana-leo-quarterly-instructions-june-2026"], title: "Montana's LEO quarterly schema requires the total active-subscriber count each period",
    finding: "The LEO instructions require subgrantees to report the total number of active subscribers as of each quarterly reporting period.",
    denominator: "The exact awardee project and quarter, with active subscribers measured against the approved covered-location cohort.",
    limits: ["The schema does not publish a current count.", "Active subscribers alone do not establish installations, price, retention duration, complaints, or acceptance.", "Public reporting must protect subscriber privacy while retaining a stable denominator."],
    next: "Publish aggregate active-subscriber counts and rates by award and quarter with covered-location, serviceable, installed, disconnected, and retained denominators.",
  },
  {
    slug: "montana-leo-cpe-shipment-contract", agency: "NTIA", actionKey: "MT-BEAD-LEO-CPE-SHIPMENT-CONTRACT-2026-01", stage: "Observed adoption measurement contract", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57f-montana-leo-quarterly-instructions-june-2026"], title: "Montana requires quarterly customer-premises-equipment shipment counts to project locations",
    finding: "The LEO quarterly schema requires the number of customer premises equipment units shipped to project broadband serviceable locations during the reporting period.",
    denominator: "The approved project BSL cohort and quarter, separating CPE shipped from delivered, installed, activated, subscribed, tested, retained, or accepted.",
    limits: ["Shipment is not delivery or installation.", "One unit cannot be assumed to equal one active subscriber.", "The instructions provide no awardee shipment or activation result."],
    next: "Publish privacy-safe CPE shipped, delivered, installed, activated, failed, replaced, subscribed, and retained counts by project and quarter.",
  },
  {
    slug: "montana-leo-served-location-validation-contract", agency: "NTIA", actionKey: "MT-BEAD-LEO-SERVED-LOCATION-CONTRACT-2026-01", stage: "Observed adoption measurement contract", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57f-montana-leo-quarterly-instructions-june-2026", "source-57f-montana-bead-resource-index-august-2026", "source-57e-montana-project-monitoring-guide-june-2026"], title: "Montana couples served-location files with service-availability and performance-test validation",
    finding: "ConnectMT's LEO instructions require served-BSL files and service-availability reporting and allow required performance-test results to validate continued BEAD obligations.",
    denominator: "Each approved project location by quarter, with served, unavailable, subscriber, performance-test, exception, remediation, and acceptance states kept distinct.",
    limits: ["A served-location file is not an adoption or retention result.", "Performance-test requirements do not show that an awardee passed.", "No current public exception, corrective-action, or state-acceptance table exists."],
    next: "Publish project-quarter location totals, privacy-safe subscriber outcomes, performance pass-fail distributions, exceptions, corrective actions, retests, and acceptance decisions.",
  },
  {
    slug: "louisiana-nextlink-observed-adoption-hold", agency: "NTIA", actionKey: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-05", parentHold: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-04", stage: "Observed adoption outcome hold", status: "In Review", publicationDate: "2026-05-13",
    sourceIds: ["source-57b-louisiana-nextlink-first-bead-tower", "source-57f-montana-leo-quarterly-instructions-june-2026"], title: "Louisiana Nextlink adoption hold: Montana's schema identifies fields but supplies no 104-location result",
    finding: "The 104 Nextlink locations remain serviceable without public installed, subscribed, tested, retained, priced, complained, remediated, or accepted-closeout outcomes; Montana's measurement schema is not Louisiana evidence.",
    denominator: "The same 104 Bossier Parish BEAD locations followed through serviceability, installation, subscription, performance, retention, price, complaint, remediation, and accepted closeout.",
    limits: ["Cross-state requirements cannot substitute for Louisiana results.", "Provider-wide subscriber totals cannot be assigned to the 104-location cohort.", "No privacy-safe cohort adoption table is public."],
    next: "Reopen with privacy-safe counts for all 104 locations at each adoption and acceptance stage.",
  },
  {
    slug: "louisiana-starlink-observed-adoption-hold", agency: "NTIA", actionKey: "LA-BEAD-STARLINK-HOLD-2026-05", parentHold: "LA-BEAD-STARLINK-HOLD-2026-04", stage: "Observed adoption outcome hold", status: "In Review", publicationDate: "2026-07-17",
    sourceIds: ["source-57b-louisiana-starlink-bead-agreement", "source-57f-montana-leo-quarterly-instructions-june-2026"], title: "Louisiana Starlink adoption hold: a comparable LEO schema exists but the 10,635-location cohort has no result",
    finding: "Montana defines a privacy-safe LEO reporting structure, but Louisiana's 10,635 planned Starlink locations still lack public activation, subscriber, test, retention, price, complaint, remediation, or accepted-closeout results.",
    denominator: "The exact 10,635-location Louisiana agreement cohort reconciled to eligible, activated, installed, subscribed, tested, retained, complained, remediated, and accepted states.",
    limits: ["Montana's reporting contract does not govern or measure Louisiana's award.", "Availability targets are not activation or adoption.", "No stable public subscriber or retention denominator is available."],
    next: "Reopen after activated locations and privacy-safe denominators, subscribers, tests, retention, price, complaints, remediation, and closeout are public.",
  },
  {
    slug: "montana-quarterly-observed-results-hold", agency: "NTIA", actionKey: "MT-BEAD-QUARTERLY-HOLD-2026-05", parentHold: "MT-BEAD-QUARTERLY-HOLD-2026-04", stage: "Observed adoption outcome hold", status: "In Review", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-montana-bead-resource-index-august-2026", "source-57f-montana-leo-quarterly-instructions-june-2026", "source-57e-montana-quarterly-report-instructions-june-2026", "source-57e-montana-project-monitoring-guide-june-2026"], title: "Montana BEAD result hold: detailed terrestrial and LEO schemas still lack completed public awardee tables",
    finding: "ConnectMT publishes forms, instructions, served-location files, test controls, and monitoring guidance, but the public resource index does not expose completed awardee quarterly or closeout outcome tables.",
    denominator: "Each stable terrestrial or LEO award and approved location cohort by quarter, with served, subscribed, tested, retained, failed, remediated, and accepted counts.",
    limits: ["A form index is not a submitted report.", "Required fields cannot be read as zero or nonzero results.", "No project-specific complaint, affordability, retention, or state-acceptance outcome is public."],
    next: "Reopen with completed privacy-safe quarterly or closeout tables and state acceptance or corrective-action decisions.",
  },
  {
    slug: "hanford-nineteen-container-shipment-snapshot", agency: "DOE", actionKey: "HANFORD-WTP-19-CONTAINER-SHIPMENT-2026-01", stage: "Full output reconciliation", status: "Published", publicationDate: "2026-02-12",
    sourceIds: ["source-57f-hanford-wtp-pmm-february-2026"], title: "Hanford's February regulator meeting records nineteen vitrified-waste containers sent to IDF",
    finding: "The February 12, 2026 Hanford project-manager meeting minutes report that a total of 19 vitrified-waste containers had been sent to the Integrated Disposal Facility.",
    denominator: "The cumulative vitrified-container shipment-to-IDF count reported at the February meeting, kept separate from fill, quality release, receipt, acceptance, staging, and disposal.",
    limits: ["Sent to IDF is not permanent disposal.", "The minutes do not provide container IDs or exact shipment dates.", "No exact mass, reject, rework, acceptance, residual-inventory, or monthly balance is supplied."],
    next: "Publish stable container IDs and dates for fill, quality release, shipment, receipt, acceptance, staging, and disposal.",
  },
  {
    slug: "hanford-container-progression-reconciliation", agency: "DOE", actionKey: "HANFORD-WTP-CONTAINER-PROGRESSION-2026-01", stage: "Full output reconciliation", status: "Published", publicationDate: "2026-07-10",
    sourceIds: ["source-57f-hanford-wtp-pmm-february-2026", "source-57b-ecology-wtp-byproduct-response-comments", "source-57b-hanford-wtp-project-managers-may-2026", "source-56x-hanford-first-ilaw-disposal-2026"], title: "Hanford's 19 sent, 34 filled, 66 shipped, and approximately 30 staged observations form a stage ledger, not a mass balance",
    finding: "Official records separately report 19 containers sent to IDF at the February meeting, 34 filled as of a February regulator snapshot, 66 shipped by the May meeting, and about 30 staged at the first-disposal event.",
    denominator: "Four dated observations under different authorities and lifecycle labels, preserved as sent, filled, shipped, staged, and disposed states without assuming one-to-one identity.",
    limits: ["The dates, verbs, and reporting authorities differ.", "The records do not prove the same containers appear in every observation.", "No exact disposed total or container-level lineage is public."],
    next: "Publish a regulator-verifiable container register with stable IDs, stage dates, quality disposition, mass, acceptance, and disposal status.",
  },
  {
    slug: "hanford-one-hundred-thousand-gallon-milestone", agency: "DOE", actionKey: "HANFORD-WTP-100K-IMMOBILIZED-2026-01", stage: "Full output reconciliation", status: "Published", publicationDate: "2026-05-26",
    sourceIds: ["source-57f-doe-hanford-100k-gallons-may-2026", "source-57d-hanford-wtp-consent-may-2026"], title: "DOE reports more than 100,000 gallons immobilized during Hanford hot commissioning",
    finding: "DOE states that the Low-Activity Waste Facility had solidified more than 100,000 gallons of tank waste into glass since hot commissioning began in October 2025.",
    denominator: "The cumulative commissioning-period waste volume described as immobilized by May 26, 2026, kept separate from monthly feed received, glass mass, container counts, quality release, and disposal.",
    limits: ["More than 100,000 gallons is a lower bound, not an exact volume.", "The release does not define a compatible reconciliation to the monthly feed-received series.", "No exact glass mass, container count, quality yield, rejects, rework, or residual inventory is published."],
    next: "Reconcile exact monthly received, fed, immobilized, secondary-stream, glass-mass, container, quality, shipment, disposal, and ending-inventory values.",
  },
  {
    slug: "hanford-container-specification-boundary", agency: "DOE", actionKey: "HANFORD-WTP-CONTAINER-SPECIFICATION-2026-01", stage: "Full output reconciliation", status: "Published", publicationDate: "2026-05-26",
    sourceIds: ["source-57f-doe-hanford-100k-gallons-may-2026"], title: "Hanford's nominal seven-metric-ton filled-container specification is not an observed output mass",
    finding: "DOE describes each filled stainless-steel container as approximately four feet wide, seven and one-half feet tall, and about seven metric tons when filled.",
    denominator: "A nominal equipment-and-filled-container specification, not a measured mass for any named container or a production-period total.",
    limits: ["Approximate design weight cannot be multiplied by aggregate counts to claim exact glass output.", "The specification does not separate container tare, glass, or waste mass.", "No named-container weigh record, tolerance, quality disposition, or acceptance result is supplied."],
    next: "Publish measured tare, gross, glass, and waste mass by stable container ID with quality and acceptance state.",
  },
  {
    slug: "hanford-complete-material-balance-hold", agency: "DOE", actionKey: "HANFORD-WTP-MASS-BALANCE-HOLD-2026-02", parentHold: "HANFORD-WTP-MASS-BALANCE-HOLD-2026-01", stage: "Full output reconciliation hold", status: "In Review", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-hanford-wtp-pmm-february-2026", "source-57f-doe-hanford-100k-gallons-may-2026", "source-57d-hanford-wtp-consent-may-2026", "source-57d-hanford-wtp-consent-june-2026", "source-57d-hanford-wtp-consent-july-2026"], title: "Hanford mass-balance hold: new cumulative and container observations still do not reconcile every stage",
    finding: "The 19-container shipment record, the greater-than-100,000-gallon milestone, and later container snapshots deepen the ledger but do not produce a regulator-verifiable monthly batch and container mass balance.",
    denominator: "The complete DFLAW monthly material balance from TSCR feed through LAW and EMF streams, glass, stable container identities, quality disposition, shipment, acceptance, disposal, secondary waste, and ending inventory.",
    limits: ["Cumulative lower bounds cannot replace exact monthly flows.", "Nominal container weight cannot replace measured material mass.", "Separate dates, stages, and authorities cannot be assumed to describe one material cohort."],
    next: "Reopen only with a regulator-verifiable monthly balance and stable batch and container identities across all stages.",
  },
  {
    slug: "nnsa-current-r-and-d-capability-state", agency: "DOE", actionKey: "NNSA-PIT-CURRENT-RD-CAPABILITY-2026-01", stage: "Qualified output reconciliation", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-nnsa-pit-production-current"], title: "NNSA's current pit-production page characterizes U.S. capability as R&D-only and unsuitable for stockpile use",
    finding: "NNSA's current public program page states that U.S. pit-production capability is limited to research-and-development pits unsuitable for stockpile use.",
    denominator: "The agency's current public capability characterization, not a count of produced, qualified, rejected, reworked, accepted, or stockpile-entered pits.",
    limits: ["The page gives no effective date for the statement.", "A capability characterization is not a site-period output series.", "The statement does not explain how the October 2024 first production unit is classified in current recurring operations."],
    next: "Publish dated site-period production tables and a terminology crosswalk for development, first production unit, war reserve, qualified, accepted, and stockpile-use states.",
  },
  {
    slug: "nnsa-first-unit-current-capability-crosswalk", agency: "DOE", actionKey: "NNSA-PIT-FPU-CAPABILITY-CROSSWALK-2026-01", stage: "Qualified output reconciliation", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57a-nnsa-w87-1-first-production-unit", "source-57f-nnsa-pit-production-current"], title: "NNSA's qualified 2024 first production unit and current R&D-only capability statement require an explicit crosswalk",
    finding: "NNSA reported one fully qualified and diamond-stamped W87-1 first production unit in October 2024, while its current program page says capability is limited to R&D pits unsuitable for stockpile use.",
    denominator: "Two distinct official assertions: one named first production unit and one current generalized capability statement, with no inferred recurring output between them.",
    limits: ["One qualified first production unit is not a recurring production rate.", "The current page may use capability terminology differently but does not explain the distinction.", "Neither source publishes site-period produced, rejected, reworked, and accepted counts."],
    next: "Publish the effective dates, definitions, disposition, acceptance authority, and site-period output table needed to reconcile both statements.",
  },
  {
    slug: "nnsa-two-site-capacity-target-boundary", agency: "DOE", actionKey: "NNSA-PIT-TWO-SITE-CAPACITY-BOUNDARY-2026-01", stage: "Qualified output reconciliation", status: "Published", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-nnsa-pit-production-current", "source-56q-gao-23-104661-recommendation-status"], title: "NNSA's 80-pit two-site objective remains a capacity target, not qualified output",
    finding: "NNSA states a goal of no fewer than 80 pits per year as close to 2030 as possible; GAO describes the planned 30-per-year Los Alamos and 50-per-year Savannah River capacity components.",
    denominator: "The planned annual capacity objective split across two named sites, preserved separately from installed capacity, readiness authorization, produced units, qualification, rejection, rework, and acceptance.",
    limits: ["Planned capacity is not achieved capacity.", "A 30-plus-50 allocation does not establish current output.", "No site-period recurring qualified-production table is public."],
    next: "Publish installed and accepted capacity, readiness authority, and produced, qualified, rejected, reworked, and accepted counts by site and period.",
  },
  {
    slug: "nnsa-gao-baseline-status-reconciliation", agency: "DOE", actionKey: "NNSA-PIT-GAO-23-STATUS-2026-01", stage: "Qualified output reconciliation", status: "Published", publicationDate: "2026-04-30",
    sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-57f-nnsa-pit-production-current"], title: "GAO-23-104661 remains Open with a December 2026 lifecycle-cost forecast",
    finding: "GAO records Recommendation 1 Open as of April 2026, states that no GAO-aligned lifecycle cost estimate existed, and reports NNSA's forecast to establish one in December 2026 after planned SRPPF design completion by fiscal-year end.",
    denominator: "The exact GAO-23-104661 Recommendation 1 identity and April 2026 status update, including the two forecast dates but no assumed completion.",
    limits: ["A forecast is not a completed artifact.", "GAO has not recorded the recommendation sufficient or closed.", "The recommendation status does not supply recurring qualified pit output."],
    next: "Recheck after December 2026 for the completed lifecycle-cost estimate, integrated schedule, GAO best-practice assessment, and exact recommendation decision.",
  },
  {
    slug: "nnsa-recurring-qualified-output-hold", agency: "DOE", actionKey: "NNSA-PIT-RATE-HOLD-2026-05", parentHold: "NNSA-PIT-RATE-HOLD-2026-04", stage: "Qualified output outcome hold", status: "In Review", publicationDate: "2026-08-03",
    sourceIds: ["source-57f-nnsa-pit-production-current", "source-57a-nnsa-w87-1-first-production-unit", "source-57b-nnsa-sasc-testimony-may-2026"], title: "NNSA recurring-output hold: the public state conflict does not supply site-period yield",
    finding: "The first production unit, current R&D-only capability statement, and future capacity goal still do not provide compatible produced, qualified, rejected, reworked, and accepted counts by site and period.",
    denominator: "Each named production site and reporting period with stable definitions for development, produced, qualified, rejected, reworked, accepted, and acceptance-authority states.",
    limits: ["One first production unit does not establish recurrence.", "A generalized capability statement is not a count.", "A future annual capacity objective is not observed output."],
    next: "Reopen only with site-period produced, qualified, rejected, reworked, and accepted counts under stable definitions.",
  },
  {
    slug: "nnsa-final-capacity-readiness-hold", agency: "DOE", actionKey: "NNSA-PIT-PEIS-HOLD-2026-05", parentHold: "NNSA-PIT-PEIS-HOLD-2026-04", stage: "Qualified output outcome hold", status: "In Review", publicationDate: "2026-08-03",
    sourceIds: ["source-57b-nnsa-pit-production-draft-peis-2026", "source-57f-nnsa-pit-production-current"], title: "NNSA capacity hold: current two-site policy still does not establish final accepted operating capacity",
    finding: "The current two-site program description and draft PEIS alternatives do not supply a final decision, installed and accepted capacity, readiness authorization, or recurring qualified output.",
    denominator: "The final decision, installed equipment, acceptance evidence, readiness authorization, and recurring output at Los Alamos and Savannah River as separate stages.",
    limits: ["A policy approach is not a final site-specific readiness decision.", "Analyzed or planned capacity is not installed accepted capacity.", "No recurring qualified-output table is public."],
    next: "Reopen with a final decision, installed and accepted capacity, readiness authorization, and recurring qualified output.",
  },
  {
    slug: "nnsa-exact-gao-baseline-hold", agency: "DOE", actionKey: "NNSA-PIT-GAO-BASELINE-HOLD-2026-06", parentHold: "NNSA-PIT-GAO-BASELINE-HOLD-2026-05", stage: "Qualified output outcome hold", status: "In Review", publicationDate: "2026-04-30",
    sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-56x-gao-nnsa-major-projects-2026", "source-57f-nnsa-pit-production-current"], title: "NNSA enterprise-baseline hold: GAO's exact recommendation remains Open",
    finding: "GAO-23-104661 remains Open because a GAO-aligned lifecycle cost estimate is still absent; the December 2026 forecast and other portfolio-governance closures do not satisfy the exact recommendation.",
    denominator: "The complete plutonium-modernization integrated master schedule and lifecycle cost estimate evaluated against GAO best practices and the exact GAO-23-104661 recommendation identity.",
    limits: ["Forecast completion is not actual completion.", "Different GAO recommendation identities cannot be substituted.", "A public artifact must still receive the exact GAO sufficiency or closure decision."],
    next: "Reopen only when the complete integrated schedule and lifecycle-cost estimate are available and GAO records the exact recommendation sufficient or closed.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const carriedIds = [...new Set(specs.flatMap((spec) => spec.sourceIds).filter((id) => !sourceById.has(id)))];
for (const id of carriedIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}

const authorityBoundary = "Historical cohorts, current inventories, assets, requirements, serviceability, adoption, retention, feed, glass, nominal specifications, measured mass, container stages, capacity, qualified output, forecasts, completed baselines, implementation, and independent closure remain separate. Operator, regulator, state, federal, contractor, and independent evidence retain distinct attribution. No record supports a cross-system ranking, composite score, readiness score, generalized savings claim, or unsupported causal attribution.";
const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-57f-${spec.slug}`, document_id: `research-doc-57f-${spec.slug}`, signal_id: `signal-57f-${spec.slug}`,
    document_number: 703 + index, phase: "57F", action_key: spec.actionKey, parent_hold_key: spec.parentHold ?? null,
    agency: spec.agency, entity_id: meta.entity, record_type: "Measured reliability, observed adoption, and full output reconciliation panel",
    evidence_stage: spec.stage, title: spec.title, record_status: spec.status, source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url, publication_date: spec.publicationDate,
    document_type: spec.status === "In Review" ? "Technical Report" : "Program Milestone",
    finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits, next_action: spec.next,
    exact_target_artifact_acquired: false, directive_scope_change: false, implementation_change: false, closure_change: false,
    contact_or_foia_submitted: false, authority_boundary: authorityBoundary, captured_date: capturedDate,
  };
});

const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const evidenceStageCounts = Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length]));
const priorHoldKeys = phase57e.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57f-measured-reliability-observed-adoption-full-output-reconciliation.json"), {
  phase: "57F", captured_date: capturedDate,
  goal: "Advance the exact Phase 57E cohorts into measured-reliability denominators, privacy-safe adoption measurement, full material-flow reconciliation, and exact qualified-output and baseline decisions without treating controls, forecasts, or specifications as outcomes.",
  publication_rule: "Publish only exact historical cohorts, reporting contracts, dated stage observations, official state reconciliations, and recommendation status; retain every operating-outcome hold until its exact reopening condition is met.",
  authority_rule: "Historical cohort is not current reliability, reporting schema is not adoption, a cumulative lower bound or nominal specification is not a mass balance, and a first unit or future capacity target is not recurring qualified output.",
  records_reviewed: records.length, records_published: published.length, records_held: held.length, evidence_stage_counts: evidenceStageCounts,
  new_official_source_profiles: sources.length, carried_official_source_profiles: carriedIds.length,
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [], inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57e.post_batch_visible_scope, post_batch_visible_scope: phase57e.post_batch_visible_scope,
  post_batch_closure_counts: phase57e.post_batch_closure_counts, preserved_phase57e_holds: priorHoldKeys, new_visible_holds: [], records,
});

await writeJson(join(dataRoot, "phase-57f-publication-review.json"), {
  phase: "57F", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key })),
  exact_target_artifacts_acquired: 0,
  decision: "Sixteen bounded reconciliation or measurement-contract records publish. All nine Phase 57E operating-outcome holds remain visible with unchanged reopening conditions; no new hold, trigger, contact, scope change, implementation change, or closure change is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 702).padStart(2, "0")}-${record.record_id.replace(/^record-57f-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57f-${record.record_id.replace(/^record-57f-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date,
    document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record adds a bounded denominator, measurement contract, stage observation, or official state reconciliation without promoting it into an unsupported outcome." : "The visible hold keeps missing reliability, adoption, mass-balance, recurring-output, capacity, or enterprise-baseline evidence outside the Published outcome layer.",
    ftfn_relevance: ["Preserves exact entity, cohort, asset or material stage, period, unit, denominator, method, revision, and authority.", "Separates historical cohorts, controls, observations, operating results, acceptance, forecasts, implementation, and closure.", "Keeps dated checks and exact-artifact retrieval non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls, official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`, archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = [
    "---", `id: ${JSON.stringify(record.signal_id)}`, `title: ${JSON.stringify(record.title)}`, `slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}`,
    `record_status: ${JSON.stringify(record.record_status)}`, `summary: ${JSON.stringify(record.finding)}`, yamlList("source_ids", record.supporting_source_ids),
    `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, `primary_topic: ${JSON.stringify(meta.topics[0])}`, yamlList("framework_layers", meta.layers),
    'signal_type: "Research Result"', 'maturity_level: "Infrastructure"', 'time_horizon: "Now"', 'evidence_quality: "Official Data"',
    'verification_status: "Verified Against Primary Source"', `why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}`,
    yamlList("dependencies", ["stable named entity and cohort", "explicit lifecycle stage and acceptance authority", "compatible period, unit, denominator, and method", "separate observation, outcome, forecast, implementation, and closure evidence"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]), yamlList("receiving_systems", ["Phase 57F measured reliability, observed adoption, and full output reconciliation panels"]),
    yamlList("local_implications", ["Do not collapse historical cohorts, current inventories, reporting controls, reliability, adoption, retention, feed, glass, nominal specifications, measured mass, container stages, capacity, qualified output, forecasts, implementation, or closure."]),
    yamlList("evidence_gap_ids", meta.gaps), 'claim_scope: "Specific Source Update"', 'local_evidence_level: "General Source Layer"',
    `last_reviewed_date: ${capturedDate}`, `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57F bounded reconciliation and measurement contract." : "Held until the exact inherited operating-outcome reopening condition is public.")}`,
    "---", "", "## Phase 57F panel", "", record.finding, "", "## Evidence stage and denominator", "", `**${record.evidence_stage}.** ${record.denominator}`, "", "## Evidence boundaries", "",
    ...record.evidence_limits.map((limit) => `- ${limit}`), "", "Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.", "", `Next action: ${record.next_action}`, "", "## Authority boundary", "", record.authority_boundary, "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Measured Reliability, Observed Adoption, and Full Output Reconciliation, 2026", slug: collectionSlug,
  record_status: "Published",
  summary: "Phase 57F reviews twenty-five Amtrak, broadband, Hanford, and NNSA records, publishing sixteen bounded denominator, measurement-contract, stage, and official-state reconciliations while preserving nine operating-outcome holds.",
  scope: "Four historical Amtrak cohort reconciliations; four Montana adoption measurement contracts; four Hanford material and container-stage reconciliations; four NNSA output and baseline-state reconciliations; and all nine inherited reliability, adoption, mass-balance, recurring-output, capacity, and exact-baseline holds.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-eight-file archive contains twenty-five official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Historical cohorts, reporting controls, observed results, material stages, nominal specifications, measured mass, qualified output, forecasts, and exact independent closure remain distinct.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---", `id: ${JSON.stringify(briefingId)}`, 'title: "Research Watch 036: Measured Reliability, Observed Adoption, and Full Output Reconciliation"',
  'slug: "research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation"', 'record_status: "Published"',
  'summary: "Phase 57F publishes sixteen bounded historical-denominator, adoption-measurement, material-stage, and qualified-output reconciliations while preserving all nine operating-outcome holds."',
  `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, yamlList("signal_ids", signalIds), yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  'claim_scope: "Editorial Synthesis"', 'local_evidence_level: "General Source Layer"', `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "Amtrak's historical 120-station and 96-completion PIDS cohort gives the 2026 93-versus-117 count conflict a lineage anchor but still does not provide current asset reliability.",
    "Montana defines ten years of LEO reporting with active subscribers, CPE shipments, served locations, availability, and performance tests, but no completed public awardee table.",
    "Hanford's 19 sent, 34 filled, 66 shipped, approximately 30 staged, and greater-than-100,000-gallon observations deepen the stage ledger without creating a mass balance.",
    "NNSA's qualified first production unit and current R&D-only capability statement need a terminology and output crosswalk; GAO-23-104661 remains Open with a December 2026 estimate forecast.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["Current Amtrak station-device register and asset-period service quality", "Privacy-safe completed BEAD awardee outcome tables", "Regulator-verifiable Hanford monthly batch and container balance", "NNSA site-period qualified output and the exact GAO-23 baseline decision"]),
  "---", "", "## What Phase 57F adds", "",
  "The batch builds the strongest measurement layer available from current primary sources: stable historical Amtrak cohorts, a privacy-safe Montana reporting contract, dated Hanford stage observations, and an exact NNSA output-and-baseline state reconciliation.",
  "", "## What did not move", "",
  "The evidence does not meet the reopening conditions for any of the nine Phase 57E holds. Controls are not observations, historical completion is not current reliability, container specifications are not measured mass, and forecasts are not completed or independently accepted baselines.",
  "", "## Evidence boundary", "",
  "All nine inherited holds remain visible. The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57F records no trigger, agency contact, FOIA request, directive-scope change, implementation change, or closure change.", "",
].join("\n");
await writeFile(join(contentRoot, "briefings", "research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation.mdx"), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-03-phase-57f-measured-reliability-observed-adoption-full-output-reconciliation.json"), {
  id: "update-2026-08-03-phase-57f-measured-reliability-observed-adoption-full-output-reconciliation", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57F publishes sixteen measured-reliability, adoption-measurement, material-stage, and output-state reconciliations",
  summary: "Seven new Tier 1 sources and carried official records support sixteen Published panels while preserving all nine Phase 57E operating-outcome holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Historical cohort, reporting contract, stage observation, nominal specification, qualified first unit, capacity target, forecast, and exact GAO recommendation status remain distinct.",
  work_package: "docs/work-packages/phase-57f-measured-reliability-observed-adoption-full-output-reconciliation.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
const amtrakSourceIds = sources.filter((source) => source.agency === "DOT").map((source) => source.id);
const broadbandSourceIds = sources.filter((source) => source.agency === "NTIA").map((source) => source.id);
const energySourceIds = sources.filter((source) => source.agency === "DOE").map((source) => source.id);

await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => { value.source_ids = appendUnique(value.source_ids, energySourceIds); });
await updateJson(join(contentRoot, "organizations", "org-government-accountability-office.json"), (value) => { value.source_ids = appendUnique(value.source_ids, ["source-56q-gao-23-104661-recommendation-status"]); });

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 57F cohort next produces an accepted reliability, adoption, retention, material-balance, yield, or recurring-output result under a stable denominator?"],
  ["policy-and-standards.json", newSourceIds, "Which Phase 57F reporting contract next produces a completed public result and independent acceptance decision?"],
  ["mobility.json", amtrakSourceIds, "Which named Amtrak station-device cohort next publishes current uptime, use, complaint, remediation, boarding, and rider outcomes?"],
  ["chips-and-compute.json", broadbandSourceIds, "Which BEAD award next publishes privacy-safe subscriber, CPE, test, retention, price, complaint, remediation, and closeout results?"],
  ["energy.json", energySourceIds, "Which Hanford or NNSA record next supplies a complete material balance, recurring qualified output, or exact baseline closure?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => { value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]); });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, newSourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...amtrakSourceIds, ...broadbandSourceIds]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), energySourceIds],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57f-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources); value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]);
    value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57F measured reliability, observed adoption, and full output reconciliation panels");
    value.dependency_stack.push({
      stage: "Phase 57F measured reliability, observed adoption, and full output reconciliation panels",
      current_state: "Sixteen Published historical-denominator, measurement-contract, material-stage, or official-state reconciliations and nine preserved operating-outcome holds.",
      boundary: "Historical completion is not current reliability, reporting schema is not adoption, cumulative or nominal values are not a mass balance, and a first unit, target, or forecast is not recurring accepted output or closure.",
    });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57F prohibits historical-to-current inflation, control-to-outcome promotion, cross-stage material multiplication, forecast-to-completion promotion, recommendation substitution, rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Current asset-period reliability, privacy-safe cohort adoption and retention, complete monthly material balances, site-period qualified output, and exact independent baseline sufficiency."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57F adds sixteen bounded denominator, measurement-contract, material-stage, or official-state reconciliations while preserving nine operating-outcome holds.";
  value.source_ids = appendUnique(value.source_ids, newSourceIds);
  value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57f-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57f-measured-adoption-output");
  value.links = value.links.filter((link) => link.from !== "node-phase57f-measured-adoption-output");
  value.nodes.push({
    id: "node-phase57f-measured-adoption-output", label: "Sixteen denominator, measurement, material-stage, or output-state records; nine holds", node_type: "Signal",
    note: "Outcomes advance only under stable entity, cohort, asset or material stage, period, unit, denominator, method, and authority identities.",
  });
  value.links.push(
    { from: "node-phase57f-measured-adoption-output", to: "node-phase57e-asset-adoption-accepted-output", relationship: "Depends On", confidence: "Supported", note: "Phase 57F preserves all nine Phase 57E holds and their exact reopening conditions." },
    { from: "node-phase57f-measured-adoption-output", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Historical and current station inventories, project cohorts, material stages, and production states remain non-interchangeable." },
    { from: "node-phase57f-measured-adoption-output", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Controls, cumulative lower bounds, nominal specifications, one first unit, targets, and forecasts do not establish sustained outcomes or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Sixteen bounded Phase 57F denominator, measurement-contract, material-stage, or output-state records plus nine preserved operating-outcome holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Current asset reliability, privacy-safe adoption and retention, complete material balances, site-period qualified output, and exact enterprise-baseline sufficiency."]);
});

console.log(`Generated Phase 57F: ${published.length} Published records, ${held.length} In Review holds, ${sources.length} new Tier 1 sources, and Research Watch 036.`);
