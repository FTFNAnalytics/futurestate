import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "persistent-service-quality-compatible-time-series-replication-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-034-persistent-service-quality-compatible-time-series-replication";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const path of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"].map((name) => join(contentRoot, name))) {
  await mkdir(path, { recursive: true });
}

const phase57c = JSON.parse(await readFile(join(dataRoot, "phase-57c-service-reliability-adoption-recurring-output-validation.json"), "utf8"));
if (phase57c.phase !== "57C" || phase57c.records.length !== 20) throw new Error("Phase 57D requires the complete Phase 57C ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-57d-amtrak-ada-progress-december-2024", name: "Amtrak ADA Progress Report, December 2024",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/foia/amtrak-ada-progress-report-december-2024.pdf",
    owner: "National Railroad Passenger Corporation", agency: "DOT", frequency: "Semiannual", access: "Report Series",
    limitation: "The report contains internal denominator and count conflicts, including 381 versus 385 stations and 91 versus 90 PIDS deployments, plus a ramp narrative that differs from the corrected car-count table. Phase 57D retains those revision breaks rather than silently choosing a value.",
  },
  {
    id: "source-57d-amtrak-ada-progress-june-2025", name: "Amtrak ADA Progress Report, June 2025",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/foia/amtrak-ada-progress-report-june-2025.pdf",
    owner: "National Railroad Passenger Corporation", agency: "DOT", frequency: "Semiannual", access: "Report Series",
    limitation: "The report supplies portfolio and project inventories but not feature uptime, outage, maintenance, actual-use, complaint, boarding-time, or rider-experience measures.",
  },
  {
    id: "source-57d-amtrak-ada-progress-december-2025", name: "Amtrak ADA Progress Report, December 2025",
    url: "https://www.amtrak.com/content/dam/projects/dotcom/english/public/documents/corporate/foia/amtrak-ada-progress-report-december-2025.pdf",
    owner: "National Railroad Passenger Corporation", agency: "DOT", frequency: "Semiannual", access: "Report Series",
    limitation: "The report contains a 381-versus-382 station-denominator conflict and schedules PIDS closeout for March 2026 without reporting accepted closeout or operating reliability.",
  },
  {
    id: "source-57d-hanford-wtp-consent-may-2026", name: "Hanford Field Office Consent Decree Monthly Report, May 2026 Meeting",
    url: "https://pdw.hanford.gov/download/v2/AR-40184",
    owner: "U.S. Department of Energy Hanford Field Office", agency: "DOE", frequency: "Monthly", access: "Report Series",
    limitation: "The report provides a prior-month feed observation and cumulative effluent threshold but not a complete monthly table for containers, quality yield, rejects, rework, downtime, acceptance, disposal, contaminant mass, compliance, or unit cost.",
  },
  {
    id: "source-57d-hanford-wtp-consent-june-2026", name: "Hanford Field Office Consent Decree Monthly Report, June 2026 Meeting",
    url: "https://pdw.hanford.gov/download/v2/AR-40547",
    owner: "U.S. Department of Energy Hanford Field Office", agency: "DOE", frequency: "Monthly", access: "Report Series",
    limitation: "The report gives April 2026 and cumulative waste-feed quantities and an effluent threshold, while container shipment, disposal, and acceptable-glass statements remain qualitative rather than exact stage counts or yield rates.",
  },
  {
    id: "source-57d-hanford-wtp-consent-july-2026", name: "Hanford Field Office Consent Decree Monthly Report, July 2026 Meeting",
    url: "https://pdw.hanford.gov/download/v2/AR-40938",
    owner: "U.S. Department of Energy Hanford Field Office", agency: "DOE", frequency: "Monthly", access: "Report Series",
    limitation: "The report gives May 2026 and cumulative waste-feed quantities, cumulative effluent, and qualitative quality and shipment status. It does not quantify filled, quality-released, rejected, reworked, accepted, disposed, downtime, compliance, or cost fields.",
  },
  {
    id: "source-57d-hanford-tpa-june-2026", name: "Hanford Field Office Tri-Party Agreement Monthly Report, June 2026 Meeting",
    url: "https://pdw.hanford.gov/download/v2/AR-40549",
    owner: "U.S. Department of Energy Hanford Field Office", agency: "DOE", frequency: "Monthly", access: "Report Series",
    limitation: "The report records completion of DFLAW Campaign 2 Batch 2, a subsequent TSCR pause, and 100,000 gallons of space created in Tank 241-AP-106, but not a completed next batch or an uninterrupted feed cadence.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id, name: source.name, url: source.url, source_type: "Government Agency", credibility_level: "Tier 1",
    primary_topics: meta.topics, framework_layers: meta.layers, country_or_region: "United States", update_frequency: source.frequency,
    capture_priority: "High", known_limitations: source.limitation, last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"], live_access_type: source.access,
    review_cadence_days: source.frequency === "Monthly" ? 31 : 183, monitoring_status: "Active", coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States public-sector program", source_owner: source.owner,
    notes: `Phase 57D persistent-service-quality and compatible-time-series source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "amtrak-portfolio-denominator-series", agency: "DOT", actionKey: "AMTRAK-ADA-DENOMINATOR-SERIES-2026-01", stage: "Compatible service time series", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2024", "source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak's station portfolio advances while its reported denominator changes across periods",
    finding: "Amtrak reports 192 stations with at least partial responsibility addressed in October 2024, 198 in April 2025, 199 in October 2025, and 205 in April 2026, while the associated responsibility denominator moves among 381 or 385, 378, 381 or 382, and 385.",
    denominator: "Four biannual Amtrak ADA observations under the same program, preserving each report's stated station denominator and the internal 2024 and 2025 conflicts rather than calculating a false fixed-denominator rate.",
    limits: ["The changing and internally conflicting denominator prevents a simple longitudinal completion percentage.", "Partially addressed stations include platform-excluded responsibility and are not full-scope completions.", "The series measures portfolio status, not feature uptime, use, complaints, rider experience, or causal impact."],
    next: "Reconcile the station master list and publish station-level additions, removals, responsibility changes, full and partial completion, operational availability, use, complaints, and rider experience by period.",
  },
  {
    slug: "amtrak-construction-project-series", agency: "DOT", actionKey: "AMTRAK-CONSTRUCTION-SERIES-2026-01", stage: "Compatible service time series", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2024", "source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak's completed construction-project inventory progresses from 210 to 240",
    finding: "The biannual reports list 210 completed construction projects in October 2024, 219 in April 2025, 229 in October 2025, and 240 in April 2026.",
    denominator: "Four compatible completed-project inventory observations under the ADA Stations Program; project counts remain separate from unique stations and the changing station-responsibility denominator.",
    limits: ["Projects are not unique stations and may cover different scopes.", "Inventory increases do not establish final acceptance, availability, uptime, or passenger use.", "The series does not support a project-to-station conversion rate without a stable crosswalk."],
    next: "Link every project observation to a stable station identifier, scope, turnover, final completion, feature availability, maintenance, use, and rider outcome.",
  },
  {
    slug: "amtrak-design-project-series", agency: "DOT", actionKey: "AMTRAK-DESIGN-SERIES-2026-01", stage: "Compatible service time series", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2024", "source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak's completed station-design inventory progresses from 260 to 302",
    finding: "The biannual reports list 260 completed station designs in October 2024, 273 in April 2025, 287 in October 2025, and 302 in April 2026.",
    denominator: "Four compatible completed-design inventory observations, kept distinct from procurement, construction, turnover, final acceptance, operating availability, and use.",
    limits: ["Completed designs are not completed construction or available passenger service.", "Design projects are not established as one-to-one unique stations.", "No design-to-operation conversion, cost, reliability, or rider-outcome series is reported."],
    next: "Maintain project identifiers from design through award, construction, turnover, acceptance, service availability, use, and outcome.",
  },
  {
    slug: "amtrak-pids-revision-series", agency: "DOT", actionKey: "AMTRAK-PIDS-REVISION-SERIES-2026-01", stage: "Compatible service time series", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2024", "source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak's PIDS series reaches 93 deployments but retains a documented revision break",
    finding: "The December 2024 report contains both 91 and 90 completed-deployment observations, followed by 91 in April 2025 and 93 in October 2025 and April 2026.",
    denominator: "The PIDS deployment inventory across four reports, with the December 2024 same-document 90-versus-91 conflict retained and later 93-deployment plateau kept separate from accepted closeout and uptime.",
    limits: ["The 2024 conflict prevents a silent single-value baseline.", "Deployment entries are not established as unique operating stations with accepted federal closeout.", "No uptime, defects, maintenance, accessibility performance, use, complaint, or rider-experience series is disclosed."],
    next: "Publish a revision log and stable station crosswalk, then add accepted closeout, uptime, outages, defects, maintenance, use, complaints, and rider experience.",
  },
  {
    slug: "amtrak-bridge-plate-series", agency: "DOT", actionKey: "AMTRAK-BRIDGE-PLATE-SERIES-2026-01", stage: "Compatible service time series", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2024", "source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak's bridge-plate deployment inventory progresses from 345 to 364",
    finding: "The reports list 345 bridge-plate deployments in October 2024, 354 in April 2025, 354 in October 2025, and 364 in April 2026.",
    denominator: "Four compatible deployment-inventory observations, including one unchanged interval, without treating equipment counts as a stable eligible fleet or trip-level availability measure.",
    limits: ["Deployed equipment is not the eligible vehicle, station, or trip denominator.", "A flat six-month inventory does not establish whether work paused, records were revised, or the eligible cohort changed.", "Failure, maintenance, actual use, boarding time, complaint, and rider-experience data remain absent."],
    next: "Add stable equipment and eligible-fleet identifiers, assignment, in-service availability, failures, maintenance, uses, boarding time, complaints, and rider experience by period.",
  },
  {
    slug: "amtrak-ramp-method-series", agency: "DOT", actionKey: "AMTRAK-RAMP-METHOD-SERIES-2026-01", stage: "Compatible service time series", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2024", "source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak's corrected car-count ramp series progresses from 110 to 141",
    finding: "Using the reports' corrected number-of-cars table, ramp installations progress from 110 in October 2024 to 120 in April 2025, 129 in October 2025, and 141 in April 2026; the December 2024 narrative's total of 149 remains a documented conflict.",
    denominator: "Four corrected unique-car observations under Amtrak's stated methodology, with the conflicting 149-ramp narrative excluded from the numeric series but preserved in the revision record.",
    limits: ["The 2024 narrative conflict requires explicit version control.", "The series does not disclose the stable eligible or in-service fleet.", "Installation counts do not measure trip availability, actual use, boarding time, failures, maintenance, complaints, or rider experience."],
    next: "Publish the eligible fleet and revision history, then link each car to in-service status, assignment, failures, maintenance, uses, boarding time, complaints, and rider experience.",
  },
  {
    slug: "hanford-monthly-waste-feed-series", agency: "DOE", actionKey: "HANFORD-WTP-MONTHLY-FEED-SERIES-2026-01", stage: "Monthly material-flow series", status: "Published", publicationDate: "2026-07-01",
    sourceIds: ["source-57d-hanford-wtp-consent-june-2026", "source-57d-hanford-wtp-consent-july-2026"],
    title: "Hanford reports compatible April and May WTP waste-feed observations",
    finding: "The consent-decree reports state that the LAW Facility processed more than 18,550 gallons of waste feed in April 2026 and 29,757 gallons in May 2026.",
    denominator: "Two named calendar-month feed observations for the same LAW Facility and reporting authority; April is a lower-bound value and May is reported as an exact value.",
    limits: ["A two-month series is not steady-state performance.", "The April greater-than threshold prevents an exact month-over-month percentage calculation.", "Feed gallons are not glass mass, filled containers, accepted output, disposed output, quality yield, uptime, or cost."],
    next: "Append each monthly report using the same feed field and add glass mass, containers by stage, quality yield, rejects, rework, downtime, acceptance, disposal, compliance, and cost.",
  },
  {
    slug: "hanford-cumulative-feed-reconciliation", agency: "DOE", actionKey: "HANFORD-WTP-CUMULATIVE-FEED-SERIES-2026-01", stage: "Monthly material-flow series", status: "Published", publicationDate: "2026-07-01",
    sourceIds: ["source-57d-hanford-wtp-consent-june-2026", "source-57d-hanford-wtp-consent-july-2026"],
    title: "Hanford's cumulative waste-feed ledger reconciles April 28 to May 26",
    finding: "The cumulative feed total moves from more than 85,604 gallons through April 28, 2026, to 115,361 gallons through May 26, while the July report separately states 29,757 gallons processed during May.",
    denominator: "Two cumulative cutoffs and one reported monthly May observation for the same LAW Facility; the May value equals the difference between the stated numerical thresholds but the earlier cumulative value remains a lower bound.",
    limits: ["The earlier greater-than threshold prevents treating the arithmetic difference as an independently exact reconciliation.", "Cutoff dates are not full calendar-month endpoints.", "Cumulative feed does not disclose quality-released glass, accepted containers, disposal, downtime, compliance, or cost."],
    next: "Retain cutoff dates and threshold operators in every row and reconcile feed to glass, containers, laboratory release, shipment, acceptance, disposal, rejects, rework, and residual inventory.",
  },
  {
    slug: "hanford-effluent-transfer-series", agency: "DOE", actionKey: "HANFORD-WTP-EFFLUENT-SERIES-2026-01", stage: "Monthly material-flow series", status: "Published", publicationDate: "2026-07-01",
    sourceIds: ["source-57d-hanford-wtp-consent-may-2026", "source-57d-hanford-wtp-consent-june-2026", "source-57d-hanford-wtp-consent-july-2026"],
    title: "Hanford's cumulative liquid-effluent transfer series progresses past 2.26 million gallons",
    finding: "The monthly reports raise the cumulative Effluent Management Facility transfer threshold from more than 1.55 million gallons to more than 1.846 million and then more than 2.26 million gallons transferred to the Liquid Effluent Retention Facility.",
    denominator: "Three cumulative liquid-effluent transfer thresholds for the same origin and destination facilities under the same monthly reporting series.",
    limits: ["Threshold observations do not support exact monthly transfer volumes.", "Transferred effluent is not grouted, accepted, shipped, or disposed material.", "The series does not disclose constituent mass, concentration, compliance, rejects, rework, downtime, or cost."],
    next: "Add exact monthly transfer volume, EMF ending inventory, constituent mass and concentration, treatment, grout acceptance, shipment, disposal, compliance, downtime, and cost.",
  },
  {
    slug: "hanford-tscr-feed-space-dependency", agency: "DOE", actionKey: "HANFORD-TSCR-FEED-SPACE-SERIES-2026-01", stage: "Monthly material-flow series", status: "Published", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-hanford-tpa-june-2026"],
    title: "Hanford identifies tank-space availability as a documented feed constraint",
    finding: "The June TPA report records DFLAW Campaign 2 Batch 2 completion on February 25, a subsequent TSCR pause caused by limited space in Tank 241-AP-106, and creation of 100,000 gallons of space by transferring waste to WTP.",
    denominator: "One named campaign and batch, one named receiving tank, one documented pause condition, and one 100,000-gallon space-creation action; the next processing batch remains planned rather than complete.",
    limits: ["Created tank space is not a completed TSCR batch or delivered feed quantity.", "The report does not quantify pause duration, lost output, cost, or recovery rate.", "A single constraint episode does not establish recurring availability or causal attribution across the full system."],
    next: "Track every TSCR batch, tank-space start and end inventory, pause start and end, feed delivery, recovery action, output effect, cost, and acceptance under stable identifiers.",
  },
  {
    slug: "hanford-material-flow-stage-ledger", agency: "DOE", actionKey: "HANFORD-WTP-STAGE-LEDGER-2026-01", stage: "Monthly material-flow series", status: "Published", publicationDate: "2026-07-01",
    sourceIds: ["source-57d-hanford-wtp-consent-may-2026", "source-57d-hanford-wtp-consent-june-2026", "source-57d-hanford-wtp-consent-july-2026"],
    title: "Hanford's monthly reports expose the material-flow stages without collapsing them",
    finding: "Across the May through July reports, DOE separately records waste feed, acceptable-quality glass operations, immobilized LAW container shipment, first permanent disposal, EMF effluent transfer, glass-former deliveries, and laboratory analytical support.",
    denominator: "A stage ledger for the same DFLAW system and reporting series; only feed and effluent contain recurring quantities, while quality, shipment, disposal, reagent, and laboratory stages remain qualitative or event-level.",
    limits: ["Qualitative stage presence is not an exact mass balance.", "Shipped containers are not automatically accepted or disposed containers.", "The reports do not provide exact glass mass, container counts by stage, rejects, rework, downtime, constituent mass, compliance, cost, or residual inventory together."],
    next: "Populate one monthly mass-balance table spanning feed, glass, containers, quality release, rejects, rework, downtime, shipment, acceptance, disposal, secondary streams, contaminant mass, compliance, cost, and residual inventory.",
  },
  {
    slug: "hanford-may-production-record", agency: "DOE", actionKey: "HANFORD-WTP-MAY-RECORD-2026-01", stage: "Monthly material-flow series", status: "Published", publicationDate: "2026-07-01",
    sourceIds: ["source-57d-hanford-wtp-consent-july-2026"],
    title: "Hanford bounds May 2026 as its highest production month to date",
    finding: "DOE reports that May 2026 achieved the highest production since operations began for tank-waste gallons processed, metric tons of glass vitrified, and containers filled, while quantifying only the 29,757-gallon feed measure in the public report.",
    denominator: "The operating period from the October 2025 start through May 2026, with a quantified May feed value but no disclosed May glass-mass or filled-container value.",
    limits: ["A highest-to-date statement is not a sustained rate or steady-state claim.", "Glass mass and container counts are not public in the cited report.", "The record does not disclose quality yield, rejects, rework, downtime, accepted or disposed output, compliance, or unit cost."],
    next: "Publish the underlying monthly table for gallons, glass mass, filled and quality-released containers, rejects, rework, downtime, acceptance, disposal, compliance, and cost.",
  },
  {
    slug: "amtrak-pids-closeout-quality-hold", agency: "DOT", actionKey: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-03", stage: "Service quality hold", status: "In Review", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak PIDS hold: the 93-deployment plateau still lacks accepted closeout and service quality",
    finding: "The December 2025 report scheduled program closeout for March 2026, while the June 2026 report still described FRA closeout review as pending and supplied no operating reliability or rider outcome series.",
    denominator: "The same 93-deployment inventory, the scheduled March 2026 closeout, and the later pending-review status; none establishes accepted closeout or service quality.",
    limits: ["A scheduled closeout date is not accepted closeout.", "Ninety-three deployment entries are not a verified unique-station uptime denominator.", "Uptime, outages, defects, maintenance, accessibility performance, use, complaints, and rider experience remain absent."],
    next: "Reopen only with accepted FRA closeout, a stable station crosswalk, uptime, outages, defects, maintenance, accessibility performance, use, complaints, and rider experience.",
  },
  {
    slug: "amtrak-named-cohort-quality-hold", agency: "DOT", actionKey: "AMTRAK-NAMED-RELIABILITY-HOLD-2026-02", stage: "Service quality hold", status: "In Review", publicationDate: "2026-06-01",
    sourceIds: ["source-57d-amtrak-ada-progress-december-2024", "source-57d-amtrak-ada-progress-june-2025", "source-57d-amtrak-ada-progress-december-2025", "source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak named-cohort hold: repeat inventories still do not measure service reliability",
    finding: "Four biannual reports support repeated portfolio inventories but do not supply compatible operating-quality observations for the same station features, PIDS units, bridge plates, or modified railcars.",
    denominator: "Stable named station, feature, equipment, or railcar cohorts observed across compatible service periods with availability, outage, maintenance, actual-use, boarding-time, complaint, and rider-experience fields.",
    limits: ["Aggregate inventory repetition is not asset-level reliability.", "Installed or turned-over equipment is not trip-level availability or actual use.", "No stable named-cohort outage, maintenance, boarding-time, complaint, or rider-experience series is public."],
    next: "Reopen with stable named asset identifiers and at least two compatible service-period observations for availability, outages, maintenance, use, boarding time, complaints, and rider experience.",
  },
  {
    slug: "louisiana-nextlink-adoption-hold", agency: "NTIA", actionKey: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-03", stage: "Adoption and activation hold", status: "In Review", publicationDate: "2026-05-13",
    sourceIds: ["source-57b-louisiana-nextlink-first-bead-tower"],
    title: "Louisiana Nextlink hold: the 104-location cohort still lacks adoption and retention fields",
    finding: "The current official record keeps the tower live and 104 locations serviceable but does not publish the stable location list, installations, subscribers, tests, retained users, price, affordability, complaints, or accepted closeout.",
    denominator: "The same 104 BEAD locations, followed through eligible, serviceable, installed, subscribed, tested, retained, priced, complained, and accepted-closeout states.",
    limits: ["Serviceable locations are not installed or subscribed locations.", "No take-rate denominator, retention window, affordability measure, or complaint series is disclosed.", "A live tower is not accepted cohort closeout or demonstrated adoption."],
    next: "Reopen with the stable 104-location roster and periodized installations, subscribers, tests, latency, uptime, price, affordability, retention, complaints, and accepted closeout.",
  },
  {
    slug: "louisiana-starlink-activation-hold", agency: "NTIA", actionKey: "LA-BEAD-STARLINK-HOLD-2026-03", stage: "Adoption and activation hold", status: "In Review", publicationDate: "2026-06-11",
    sourceIds: ["source-57b-louisiana-starlink-bead-agreement"],
    title: "Louisiana Starlink hold: 10,635 planned locations remain future coverage rather than accepted service",
    finding: "ConnectLA's agreement describes service for 10,635 locations by the end of summer but still does not provide an activated-location roster, subscriber adoption, tests, price, complaints, retention, or accepted closeout.",
    denominator: "The 10,635-location agreement cohort, preserved as planned coverage until location-level activation and operating evidence are published.",
    limits: ["An agreement and future coverage date are not activated service.", "Planned locations are not subscribers or retained users.", "No activation, test, latency, uptime, price, affordability, complaint, retention, or closeout series is public."],
    next: "Reopen with location-level activation, installation, subscriber, test, latency, uptime, price, affordability, complaint, retention, and accepted-closeout records.",
  },
  {
    slug: "montana-quarterly-results-hold", agency: "NTIA", actionKey: "MT-BEAD-QUARTERLY-HOLD-2026-03", stage: "Adoption and activation hold", status: "In Review", publicationDate: "2026-06-01",
    sourceIds: ["source-57b-montana-bead-quarterly-report-june-2026"],
    title: "Montana BEAD hold: reporting instructions still do not supply completed quarterly results",
    finding: "The available artifact remains a reporting framework rather than a completed period report with stable eligible, serviceable, installed, subscribed, tested, retained, priced, complained, and accepted-closeout fields.",
    denominator: "One completed Montana BEAD reporting period under the issued reporting schema, with provider and location denominators preserved.",
    limits: ["Instructions are not submitted results.", "A reporting field definition is not a measured value.", "No completed quarterly cohort, adoption, operating-quality, complaint, or accepted-closeout table is public."],
    next: "Reopen with a completed quarterly report and reconcile provider, location, installation, subscriber, test, retention, price, complaint, and closeout fields.",
  },
  {
    slug: "nnsa-recurring-qualified-output-hold", agency: "DOE", actionKey: "NNSA-PIT-RATE-HOLD-2026-03", stage: "Recurring output and baseline hold", status: "In Review", publicationDate: "2026-05-20",
    sourceIds: ["source-57b-nnsa-sasc-testimony-may-2026"],
    title: "NNSA output hold: no recurring qualified site-period series is public",
    finding: "Current NNSA testimony and official material continue to describe objectives, capacity, infrastructure, and milestones without publishing qualified war-reserve output by named site and compatible period.",
    denominator: "Qualified war-reserve pit output by Los Alamos and Savannah River site and month or quarter, with produced, qualified, rejected, reworked, and accepted counts separated.",
    limits: ["A target count or capacity objective is not recurring accepted output.", "Construction, equipment, staffing, or analytical capability is not qualified production.", "No compatible site-period output, reject, rework, acceptance-authority, or sustained-rate series is public."],
    next: "Reopen with qualified output by named site and period, rejected and reworked units, acceptance authority, recurring rate, and revision history.",
  },
  {
    slug: "nnsa-peis-capacity-hold", agency: "DOE", actionKey: "NNSA-PIT-PEIS-HOLD-2026-03", stage: "Recurring output and baseline hold", status: "In Review", publicationDate: "2026-04-01",
    sourceIds: ["source-57b-nnsa-pit-production-draft-peis-2026"],
    title: "NNSA capacity hold: draft PEIS scenarios remain analytical rather than operational",
    finding: "The draft PEIS evaluates capacity alternatives and environmental effects but does not establish final decision, installed accepted capacity, qualified output, rejects, rework, or recurring rate.",
    denominator: "The draft analytical capacity scenarios, kept separate from final decision, installed equipment, readiness authorization, qualified output, rejects, rework, and accepted rate.",
    limits: ["Analyzed capacity is not installed or accepted capacity.", "A draft environmental analysis is not a final agency decision.", "No recurring site-period qualified output or operating-performance series is supplied."],
    next: "Reopen with a final decision, installed and accepted capacity, readiness authorization, qualified output by period, rejects, rework, and accepted recurring rate.",
  },
  {
    slug: "nnsa-program-baseline-hold", agency: "DOE", actionKey: "NNSA-PIT-GAO-BASELINE-HOLD-2026-04", stage: "Recurring output and baseline hold", status: "In Review", publicationDate: "2026-04-01",
    sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-56x-gao-nnsa-major-projects-2026"],
    title: "NNSA baseline hold: the enterprise schedule and lifecycle-cost recommendation remains open",
    finding: "GAO still records the lifecycle-cost recommendation as open as of April 2026 and states that NNSA forecast a December 2026 estimate after Savannah River design work, so component project data do not yet form a sufficient enterprise baseline.",
    denominator: "The complete plutonium-modernization program across production and support sites, evaluated against GAO integrated-master-schedule and lifecycle-cost best practices.",
    limits: ["Component project estimates do not sum to a validated enterprise lifecycle cost.", "A December 2026 forecast is not a completed or GAO-sufficient artifact.", "The open recommendation does not establish qualified output, accepted rate, schedule confidence, total cost, or readiness."],
    next: "Reopen only when NNSA publishes the complete integrated master schedule and lifecycle cost estimate, GAO records sufficiency, and recurring qualified output is reported under stable site-period denominators.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const carriedIds = [...new Set(specs.flatMap((spec) => spec.sourceIds).filter((id) => !sourceById.has(id)))];
for (const id of carriedIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}

const authorityBoundary = "Planning, design, construction, turnover, service inventory, operating availability, use, adoption, test performance, accepted operation, repeat output, recurring rate, capacity, project baseline, program baseline, realized outcome, closeout, implementation, and closure remain separate. Operator, regulator, agency, contractor, and independent evidence retain distinct attribution. No record supports a cross-system ranking, composite score, readiness score, generalized savings claim, or causal attribution.";
const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-57d-${spec.slug}`, document_id: `research-doc-57d-${spec.slug}`, signal_id: `signal-57d-${spec.slug}`,
    document_number: 659 + index, phase: "57D", action_key: spec.actionKey, agency: spec.agency, entity_id: meta.entity,
    record_type: "Persistent service quality and compatible time-series replication panel", evidence_stage: spec.stage, title: spec.title,
    record_status: spec.status, source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
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
const phase57cHolds = phase57c.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57d-persistent-service-quality-compatible-time-series-replication.json"), {
  phase: "57D", captured_date: capturedDate,
  goal: "Replicate the exact Phase 57C cohorts across compatible periods and build a monthly Hanford material-flow ledger without converting inventory repetition, planned activation, capacity, or missing fields into operating outcomes.",
  publication_rule: "Publish only same-entity, same-stage observations with explicit period, unit, threshold operator, denominator, revision break, and attribution; keep every current hold visible until its exact reopening condition is met.",
  authority_rule: "A repeated inventory is not reliability, serviceability is not adoption, feed is not accepted output, and capacity is not qualified production; all material-flow stages and evidence authorities remain separate.",
  records_reviewed: records.length, records_published: published.length, records_held: held.length,
  evidence_stage_counts: evidenceStageCounts, new_official_source_profiles: sources.length, carried_official_source_profiles: carriedIds.length,
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [],
  prior_visible_scope: phase57c.post_batch_visible_scope, post_batch_visible_scope: phase57c.post_batch_visible_scope,
  post_batch_closure_counts: phase57c.post_batch_closure_counts,
  preserved_phase57c_holds: phase57cHolds,
  new_visible_holds: [],
  records,
});

await writeJson(join(dataRoot, "phase-57d-publication-review.json"), {
  phase: "57D", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), exact_target_artifacts_acquired: 0,
  decision: "Twelve records publish as bounded compatible Amtrak or Hanford time series. All eight Phase 57C reliability, adoption, activation, recurring-output, capacity, or enterprise-baseline holds remain In Review.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 658).padStart(2, "0")}-${record.record_id.replace(/^record-57d-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57d-${record.record_id.replace(/^record-57d-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date,
    document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record replaces isolated snapshots with bounded compatible observations while retaining denominator, threshold, method, and revision breaks." : "The visible hold prevents repeated inventories, plans, serviceability, capacity, or component data from being presented as reliability, adoption, accepted output, recurring rate, or a complete program baseline.",
    ftfn_relevance: ["Preserves entity, cohort, lifecycle stage, period, unit, threshold operator, denominator, revision history, and attribution.", "Separates inventory, reliability, adoption, feed, glass, containers, quality, shipment, acceptance, disposal, capacity, baseline, outcome, closeout, implementation, and closure.", "Keeps dated checks and exact-artifact retrieval non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "GAO acceptance, implementation, closure, and entity evidence remain separate from this content expansion.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls,
    official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`, capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: ${JSON.stringify(record.record_status)}\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Official Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}\n+${yamlList("dependencies", ["stable named entity and cohort", "compatible stage, period, unit, threshold operator, denominator, and method", "explicit revision history and authority attribution", "later reliability, adoption, accepted-output, baseline, or outcome evidence"])}\n+${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 57D persistent service quality and compatible time-series panels"])}\n+${yamlList("local_implications", ["Do not collapse inventory, reliability, adoption, feed, glass, containers, quality, shipment, acceptance, disposal, capacity, baseline, outcome, closeout, implementation, and closure into one stage."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57D compatible-series contract." : "Held until the exact Phase 57D reliability, adoption, activation, recurring-output, capacity, or baseline reopening condition is public.")}\n+---\n+\n+## Phase 57D panel\n+\n+${record.finding}\n+\n+## Evidence stage and denominator\n+\n+**${record.evidence_stage}.** ${record.denominator}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Persistent Service Quality and Compatible Time-Series Replication, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57D reviews twenty Amtrak, BEAD, Hanford, and NNSA panels, publishing twelve bounded compatible time-series records and retaining all eight Phase 57C holds.",
  scope: "Six Amtrak portfolio, construction, design, PIDS, bridge-plate, and ramp series; six Hanford monthly feed, effluent, dependency, stage, and production records; two Amtrak service-quality holds; three BEAD adoption or activation holds; and three NNSA recurring-output, capacity, or baseline holds.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-three-file archive contains twenty official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Entity, cohort, stage, period, unit, threshold operator, denominator, method, revision history, and attribution remain explicit. A repeated inventory is not reliability, serviceability is not adoption, and feed is not accepted output.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 034: Persistent Service Quality and Compatible Time-Series Replication"\n+slug: "research-watch-034-persistent-service-quality-compatible-time-series-replication"\n+record_status: "Published"\n+summary: "Phase 57D publishes twelve bounded compatible Amtrak and Hanford time-series panels and preserves all eight reliability, adoption, activation, recurring-output, capacity, or baseline holds."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", signalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", ["Amtrak now has four-period portfolio, construction, design, PIDS, bridge-plate, and corrected ramp inventories, with denominator and revision breaks left visible.", "Hanford now has compatible April and May waste-feed observations plus a three-report cumulative effluent series and explicit material-flow stage ledger.", "The Nextlink 104-location cohort still lacks installations, subscribers, tests, retention, price, complaints, and accepted closeout.", "NNSA still lacks recurring qualified site-period output and a GAO-sufficient enterprise schedule and lifecycle-cost baseline."])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Named Amtrak station, PIDS, bridge-plate, and railcar service-quality observations", "The same Louisiana cohorts through installation, subscription, testing, retention, price, complaint, and accepted closeout", "A complete Hanford monthly material balance with exact container stages, quality, downtime, compliance, cost, and residual inventory", "Qualified NNSA output by site and period plus complete integrated schedule, lifecycle cost, and GAO sufficiency"])}\n+---\n+\n+## What Phase 57D adds\n+\n+The batch replaces isolated Amtrak inventory snapshots with four-period series and starts a recurring Hanford operating ledger. It records internal denominator and revision conflicts instead of erasing them, and it preserves threshold operators so lower-bound observations are not converted into exact rates.\n+\n+## Amtrak persistence remains an inventory result\n+\n+Construction projects progress from 210 to 240 and designs from 260 to 302. PIDS reaches a 93-deployment plateau, bridge plates progress from 345 to 364, and the corrected unique-car ramp series progresses from 110 to 141. These are useful repeated inventories, not uptime, actual use, boarding-time, complaint, or rider-experience results.\n+\n+## Hanford begins a compatible monthly ledger\n+\n+The WTP reports more than 18,550 feed gallons in April and 29,757 in May, with cumulative feed reaching 115,361 gallons through May 26. Cumulative liquid-effluent transfers progress from more than 1.55 million to more than 2.26 million gallons. Feed, glass, containers, quality, shipment, disposal, effluent, laboratory support, and residual inventory remain distinct stages.\n+\n+## Evidence boundary\n+\n+All eight Phase 57C holds remain visible. No Phase 57D record changes directive scope, implementation, closure, or the one Closed / twenty-one Partially Closed / two Open entity ledger. No ranking, composite, readiness score, generalized savings claim, or unsupported causal inference is supported.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-034-persistent-service-quality-compatible-time-series-replication.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-57d-persistent-service-quality-compatible-time-series-replication.json"), {
  id: "update-2026-08-02-phase-57d-persistent-service-quality-compatible-time-series-replication", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57D publishes twelve compatible service and material-flow series",
  summary: "Seven new Tier 1 source profiles and carried official sources support twelve Published panels while all eight prior holds remain explicit.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-034-persistent-service-quality-compatible-time-series-replication/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded. Inventory, reliability, adoption, feed, glass, containers, quality, shipment, acceptance, disposal, capacity, baseline, outcome, closeout, implementation, and closure remain separate.",
  work_package: "docs/work-packages/phase-57d-persistent-service-quality-compatible-time-series-replication.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
const amtrakSourceIds = sources.filter((source) => source.agency === "DOT").map((source) => source.id);
const hanfordSourceIds = sources.filter((source) => source.agency === "DOE").map((source) => source.id);
const beadSourceIds = ["source-57b-louisiana-nextlink-first-bead-tower", "source-57b-louisiana-starlink-bead-agreement", "source-57b-montana-bead-quarterly-report-june-2026"];

await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => {
  value.source_ids = appendUnique(value.source_ids, hanfordSourceIds);
});

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 57D series next publishes compatible cost, downtime, maintenance, acceptance, or retained-use fields?"],
  ["policy-and-standards.json", [...newSourceIds, ...beadSourceIds], "Which Phase 57D hold next meets its exact reliability, adoption, recurring-output, accepted-capacity, or complete-baseline reopening condition?"],
  ["mobility.json", amtrakSourceIds, "Which named Amtrak asset cohort next adds compatible uptime, outages, maintenance, actual use, boarding time, complaints, and rider experience?"],
  ["chips-and-compute.json", beadSourceIds, "Which BEAD cohort next publishes stable installed, subscribed, tested, retained, priced, complained, and accepted-closeout observations?"],
  ["energy.json", hanfordSourceIds, "Which Hanford monthly report next completes feed, glass, containers, quality, rejects, rework, downtime, acceptance, disposal, compliance, cost, and residual inventory fields?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, [...newSourceIds, ...beadSourceIds]],
  ["cross-corridor-authorization-to-operation.json", publishedByAgency("DOT"), amtrakSourceIds],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), hanfordSourceIds],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-57d-"));
    value.signal_ids = appendUnique(value.signal_ids, selectedSignals); value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]); value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57D persistent service quality and compatible time-series replication panels");
    value.dependency_stack.push({ stage: "Phase 57D persistent service quality and compatible time-series replication panels", current_state: "Twelve Published compatible Amtrak or Hanford time-series panels and eight preserved In Review holds.", boundary: "Repeated inventory is not reliability, serviceability is not adoption, feed is not accepted output, and capacity is not qualified production." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57D prohibits denominator-free persistence, silent revision repair, threshold-to-exact conversion, inventory-to-reliability inflation, feed-to-accepted-output collapse, cross-system rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Named-asset service quality, cohort adoption and retention, complete monthly material balances, qualified site-period output, GAO-sufficient program baselines, and independently accepted outcomes."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57D adds twelve compatible service or material-flow series while preserving eight reliability, adoption, activation, recurring-output, capacity, or baseline holds.";
  value.source_ids = appendUnique(value.source_ids, newSourceIds); value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57d-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57d-persistent-service-quality-time-series");
  value.links = value.links.filter((link) => link.from !== "node-phase57d-persistent-service-quality-time-series");
  value.nodes.push({ id: "node-phase57d-persistent-service-quality-time-series", label: "Twelve compatible service or material-flow series; eight holds", node_type: "Signal", note: "Repeated observations advance only when entity, cohort, stage, period, unit, threshold operator, denominator, method, revision history, and authority remain explicit." });
  value.links.push(
    { from: "node-phase57d-persistent-service-quality-time-series", to: "node-phase57c-service-reliability-adoption-recurring-output", relationship: "Depends On", confidence: "Supported", note: "Phase 57D replicates Phase 57C cohorts across compatible periods and preserves every hold." },
    { from: "node-phase57d-persistent-service-quality-time-series", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Changing station portfolios, projects, assets, locations, gallons, containers, and qualified units remain non-interchangeable denominators." },
    { from: "node-phase57d-persistent-service-quality-time-series", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Repeated inventories and material-flow thresholds do not establish reliability, adoption, accepted output, steady-state rate, readiness, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Twelve bounded compatible service or material-flow series plus eight visible reliability, adoption, activation, recurring-output, capacity, or baseline holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Named-asset service quality, cohort adoption and retention, complete monthly material balances, qualified site-period output, GAO-sufficient program baselines, and independently accepted outcomes."]);
});

console.log(`Generated Phase 57D: ${published.length} Published records, ${held.length} In Review holds, ${sources.length} new Tier 1 sources, and Research Watch 034.`);
