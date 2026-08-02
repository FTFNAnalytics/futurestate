import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "service-reliability-adoption-recurring-output-validation-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-033-service-reliability-adoption-recurring-output-validation";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const path of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"].map((name) => join(contentRoot, name))) {
  await mkdir(path, { recursive: true });
}

const phase57b = JSON.parse(await readFile(join(dataRoot, "phase-57b-accepted-service-independent-outcome-validation.json"), "utf8"));
if (phase57b.phase !== "57B" || phase57b.records.length !== 17) throw new Error("Phase 57C requires the complete Phase 57B ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-57c-hanford-20-containers-2025",
    name: "DOE EM: Hanford Plant Completes 20 Containers of Immobilized Waste",
    url: "https://www.energy.gov/em/articles/hanford-plant-completes-20-containers-immobilized-waste",
    owner: "U.S. Department of Energy Office of Environmental Management", agency: "DOE", access: "Release Page",
    limitation: "The release reports more than 20 containers during extended hot commissioning. It does not provide exact filled, shipped, accepted, disposed, reject, rework, downtime, quality, cost, or steady-state rate fields.",
  },
  {
    id: "source-57c-hanford-tbi-2000-gallons-2025",
    name: "DOE EM: 2,000 Gallons of Hanford Tank Waste Treated, Grouted and Disposed",
    url: "https://www.energy.gov/em/articles/2000-gallons-hanford-tank-waste-treated-grouted-and-disposed",
    owner: "U.S. Department of Energy Office of Environmental Management", agency: "DOE", access: "Release Page",
    limitation: "The release reports one Test Bed Initiative demonstration cohort, a greater-than-99-percent radioactivity reduction, and permanent disposal. It is not a LAW Facility production-rate, full-tank-inventory, lifecycle-cost, or comparative environmental-outcome series.",
  },
];

for (const source of sources) {
  const meta = agencyMeta[source.agency];
  await writeJson(join(contentRoot, "sources", `${source.id}.json`), {
    id: source.id, name: source.name, url: source.url, source_type: "Government Agency", credibility_level: "Tier 1",
    primary_topics: meta.topics, framework_layers: meta.layers, country_or_region: "United States", update_frequency: "Event Driven",
    capture_priority: "High", known_limitations: source.limitation, last_checked_date: capturedDate,
    watch_lanes: ["Security and Standards", "Cross-Cutting Official Rails"], live_access_type: source.access,
    review_cadence_days: 45, monitoring_status: "Active", coverage_role: ["Primary Data", "Source Freshness"],
    jurisdiction: "United States public-sector program", source_owner: source.owner,
    notes: `Phase 57C service-reliability, adoption, and recurring-output source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "amtrak-station-portfolio-coverage", agency: "DOT", actionKey: "AMTRAK-ADA-PORTFOLIO-2026-01", stage: "Service inventory and reliability boundary", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak records 205 of 385 active stations at substantial completion",
    finding: "Amtrak reports 205 of 385 active stations reached substantial completion: 159 with full Amtrak responsibility met and 46 complete except for platforms outside Amtrak's responsibility.",
    denominator: "Amtrak's 385 active-station ADA program denominator, split into 159 full-responsibility completions, 46 platform-excluded completions, and 180 stations not represented as substantially complete.",
    limits: ["Portfolio completion status does not measure feature uptime after turnover.", "The 46 platform-excluded stations are not equivalent to full-scope completion.", "No station-level use, outage, maintenance, rider-experience, or causal outcome series is disclosed."],
    next: "Maintain the 385-station denominator and add station-level features, outages, maintenance, passenger use, and rider experience under compatible periods.",
  },
  {
    slug: "amtrak-construction-pipeline", agency: "DOT", actionKey: "AMTRAK-ADA-CONSTRUCTION-2026-01", stage: "Service inventory and reliability boundary", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak separates 240 completed, 74 active, and 132 upcoming construction projects",
    finding: "Amtrak reports 240 station construction projects completed, 74 in progress, and 132 upcoming in the June 2026 program inventory.",
    denominator: "The report's 446 construction-project status entries, preserved as 240 completed, 74 in progress, and 132 upcoming rather than collapsed into a completion rate for stations.",
    limits: ["Projects are not unique stations and can represent different scopes.", "Upcoming work is a pipeline state rather than accepted service.", "The inventory does not establish feature availability, reliability, use, cost outcome, or rider experience."],
    next: "Link projects to unique stations, scope, turnover, final acceptance, feature availability, outages, maintenance, use, and rider outcomes.",
  },
  {
    slug: "amtrak-design-pipeline", agency: "DOT", actionKey: "AMTRAK-ADA-DESIGN-2026-01", stage: "Service inventory and reliability boundary", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak separates 302 completed and 126 active station designs",
    finding: "Amtrak reports 302 station designs completed and 126 design projects in progress in the June 2026 program inventory.",
    denominator: "The report's 428 design-status entries, kept separate from construction, turnover, final completion, operating availability, and passenger use.",
    limits: ["A completed design is not constructed or available service.", "Design entries are not established as one-to-one unique stations.", "No operating reliability, adoption, rider outcome, or realized-cost series is reported."],
    next: "Track design entries into procurement, construction, turnover, final acceptance, feature availability, use, and outcomes without assuming one-to-one station conversion.",
  },
  {
    slug: "amtrak-boarding-ramp-backlog", agency: "DOT", actionKey: "AMTRAK-ABT-BACKLOG-2026-01", stage: "Service inventory and reliability boundary", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak reports 141 completed, one active, and 89 upcoming boarding-ramp installations",
    finding: "Amtrak's accessible-boarding inventory reports 141 modified Superliner sleeper cars completed, one installation in progress, and 89 upcoming.",
    denominator: "The report's 231 railcar installation-status entries: 141 completed, one in progress, and 89 upcoming; this is an installation inventory, not an eligible-fleet or in-service denominator.",
    limits: ["The inventory does not establish the total eligible fleet or unique in-service cars.", "Installed equipment is not trip-level availability or actual use.", "Failure, maintenance, boarding-time, complaint, and rider-experience data are not disclosed."],
    next: "Add the stable eligible fleet, in-service cars, trip availability, failures, maintenance, uses, boarding time, complaints, and rider experience.",
  },
  {
    slug: "amtrak-pids-deployment-inventory", agency: "DOT", actionKey: "AMTRAK-PIDS-INVENTORY-2026-01", stage: "Service inventory and reliability boundary", status: "Published", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak records 93 completed PIDS deployments while closeout remains separate",
    finding: "Amtrak reports 93 Passenger Information Display System deployments complete and none in progress at the end of the program period.",
    denominator: "Ninety-three completed deployment entries in the reported PIDS program inventory, kept separate from unique stations, operational acceptance, uptime, accessibility, defects, passenger use, and FRA closeout.",
    limits: ["Deployment completion is not accepted federal closeout.", "The report does not establish unique station coverage or system uptime.", "Accessibility performance, defects, maintenance, passenger use, and rider outcomes are absent."],
    next: "Reconcile the 93 deployments to unique stations and publish accepted closeout, operational acceptance, uptime, defects, accessibility performance, use, and rider outcomes.",
  },
  {
    slug: "hanford-wtp-gallon-progression", agency: "DOE", actionKey: "HANFORD-WTP-GALLON-SERIES-2026-01", stage: "Repeat operating output", status: "Published", publicationDate: "2026-05-26", sourceIds: ["source-57b-ecology-wtp-byproduct-response-comments", "source-56x-hanford-vitrification-100k-2026"],
    title: "Hanford's public WTP record progresses from about 50,000 to more than 100,000 gallons",
    finding: "Washington Ecology reported about 50,000 gallons vitrified as of February 2026, and DOE later reported more than 100,000 gallons since hot commissioning began in October 2025.",
    denominator: "Two cumulative Low-Activity Waste Facility snapshots with different publication authorities and approximate thresholds: about 50,000 gallons by February and more than 100,000 gallons by May 2026.",
    limits: ["Approximate cumulative snapshots do not support an inferred monthly production rate.", "Neither source supplies a compatible monthly feed, glass, reject, rework, downtime, or acceptance table.", "DOE operator reporting and Washington regulator reporting remain distinct authorities."],
    next: "Add compatible monthly feed, vitrified output, containers, rejects, rework, downtime, acceptance, disposal, cost, and regulator-review fields.",
  },
  {
    slug: "hanford-container-stage-progression", agency: "DOE", actionKey: "HANFORD-WTP-CONTAINER-SERIES-2026-01", stage: "Repeat operating output", status: "Published", publicationDate: "2026-05-14", sourceIds: ["source-57c-hanford-20-containers-2025", "source-57b-ecology-wtp-byproduct-response-comments", "source-57b-hanford-wtp-project-managers-may-2026"],
    title: "Hanford's container record progresses from more than 20 produced to 66 shipped",
    finding: "DOE reported more than 20 immobilized-waste containers in December 2025, Washington Ecology reported 34 by February 2026, and May project minutes reported 66 shipped to the Integrated Disposal Facility.",
    denominator: "Three dated container observations under distinct produced, regulator-observed, and shipped stages; the counts are not treated as one accepted or disposed series.",
    limits: ["Produced, filled, shipped, accepted, and disposed containers are distinct stages.", "The more-than-20 and approximately-34 observations are not exact compatible counts.", "Rejects, rework, quality, acceptance, downtime, cost, and final disposal counts are not reported together."],
    next: "Publish a monthly stage ledger for produced, filled, quality-released, shipped, accepted, disposed, rejected, and reworked containers.",
  },
  {
    slug: "hanford-groundwater-volume-mass-outcome", agency: "DOE", actionKey: "HANFORD-GROUNDWATER-MASS-2026-01", stage: "Repeat operating output", status: "Published", publicationDate: "2026-04-07", sourceIds: ["source-57b-hanford-groundwater-decade-fy2024"],
    title: "Hanford pairs nearly 35 billion treated gallons with nearly 700 tons removed cumulatively",
    finding: "DOE reports nearly 35 billion gallons of groundwater treated and nearly 700 tons of contaminants removed over the program's life, alongside FY 2024's 2.3-billion-gallon annual result.",
    denominator: "A sitewide lifetime cumulative volume and contaminant-mass pair, with the FY 2024 volume kept separate because the source does not provide an FY 2024 contaminant-mass value.",
    limits: ["Lifetime contaminant mass cannot be assigned to FY 2024.", "The source does not disclose compatible annual contaminant, concentration, plume, energy, downtime, or cost series.", "Treatment volume and aquifer restoration are not equivalent outcomes."],
    next: "Add annual contaminant mass by constituent, influent and effluent concentration, plume condition, uptime, energy, cost, and restored-aquifer measures.",
  },
  {
    slug: "hanford-emf-first-transfer-boundary", agency: "DOE", actionKey: "HANFORD-EMF-TRANSFER-VALIDATION-2026-01", stage: "Repeat operating output", status: "Published", publicationDate: "2026-07-13", sourceIds: ["source-56x-hanford-emf-concentrate-grout-2026"],
    title: "Hanford begins the first EMF concentrate transfer while the 20-percent benefit remains projected",
    finding: "DOE reports the first transfer of Effluent Management Facility concentrate for offsite grouting and says the approach could enable up to 20 percent more waste treatment.",
    denominator: "One first-transfer event for a secondary liquid stream estimated at one to three gallons per gallon vitrified; the up-to-20-percent statement remains a projected capability rather than observed output.",
    limits: ["A first transfer is not a recurring monthly transfer series.", "The one-to-three ratio is a process estimate rather than a measured period distribution.", "The up-to-20-percent statement does not establish realized throughput, cost, downtime, compliance, or disposal benefit."],
    next: "Add transfer volumes by period, grout acceptance, shipment and disposal, measured ratio, facility downtime, cost, compliance, and realized vitrification throughput.",
  },
  {
    slug: "hanford-first-ilaw-disposal-boundary", agency: "DOE", actionKey: "HANFORD-ILAW-DISPOSAL-VALIDATION-2026-01", stage: "Accepted disposal and closed-loop outcome", status: "Published", publicationDate: "2026-04-08", sourceIds: ["source-56x-hanford-first-ilaw-disposal-2026", "source-57b-hanford-wtp-project-managers-may-2026"],
    title: "Hanford establishes first ILAW disposal while exact accepted and disposed counts remain separate",
    finding: "DOE reports permanent disposal of the first vitrified low-activity-waste containers and about 30 containers staged for movement; later project minutes report 66 shipped to the disposal facility.",
    denominator: "One first-disposal event, an approximately-30-container ready cohort, and a later 66-container shipped count; readiness, shipment, acceptance, and disposal are preserved as distinct stages.",
    limits: ["The release does not state an exact disposed-container count.", "Containers staged or shipped are not proof of acceptance or disposal.", "No quality rejects, rework, disposal cadence, downtime, unit cost, or regulator acceptance series is provided."],
    next: "Add exact monthly ready, shipped, accepted, disposed, rejected, and reworked counts plus downtime, cost, and regulator acceptance.",
  },
  {
    slug: "hanford-tbi-closed-loop-cohort", agency: "DOE", actionKey: "HANFORD-TBI-CLOSED-LOOP-2025-01", stage: "Accepted disposal and closed-loop outcome", status: "Published", publicationDate: "2025-07-08", sourceIds: ["source-57c-hanford-tbi-2000-gallons-2025"],
    title: "Hanford completes a 2,000-gallon treatment-to-disposal Test Bed Initiative cohort",
    finding: "DOE reports approximately 2,000 gallons of Hanford tank waste treated, radioactivity reduced by more than 99 percent, transported, grouted, and permanently disposed at licensed facilities.",
    denominator: "One approximately-2,000-gallon Test Bed Initiative demonstration cohort completed across treatment, transport, grouting, and licensed permanent disposal.",
    limits: ["The demonstration cohort is not the LAW Facility production stream.", "A greater-than-99-percent reduction does not disclose constituent-level influent and effluent measurements.", "The source does not provide lifecycle cost, downtime, waste-form comparison, or full-inventory scalability evidence."],
    next: "Add constituent-level measurements, waste-form acceptance, transport and disposal records, cost, downtime, replication, and a separately justified scale-up denominator.",
  },
  {
    slug: "nnsa-project-program-baseline-boundary", agency: "DOE", actionKey: "NNSA-PIT-PROJECT-BASELINE-BOUNDARY-2026-01", stage: "Cross-system validation boundary", status: "Published", publicationDate: "2026-02-26", sourceIds: ["source-56x-gao-nnsa-major-projects-2026", "source-56q-gao-23-104661-recommendation-status"],
    title: "GAO project baselines do not substitute for an NNSA pit-production program baseline",
    finding: "GAO reports project-level cost and schedule information for LAP4 components while separately keeping the recommendation for a comprehensive pit-production lifecycle cost estimate open as of April 2026.",
    denominator: "Named LAP4 projects and their project-level cost or schedule states, kept separate from the enterprise program spanning Los Alamos, Savannah River, support sites, recurring qualified output, integrated schedule, and lifecycle cost.",
    limits: ["A project baseline is not a complete program integrated master schedule.", "Project cost and completion dates do not establish qualified pit output, rejects, rework, or accepted rate.", "GAO's open program recommendation prevents treating component data as a sufficient enterprise baseline."],
    next: "Reopen at program level only with recurring qualified output and a complete integrated master schedule and lifecycle cost estimate that GAO finds sufficient.",
  },
  {
    slug: "amtrak-pids-closeout-reliability-hold", agency: "DOT", actionKey: "AMTRAK-PIDS-CLOSEOUT-HOLD-2026-02", stage: "Service reliability hold", status: "In Review", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak PIDS hold: deployment inventory still lacks accepted closeout and reliability results",
    finding: "The June report records 93 completed PIDS deployments but does not establish FRA acceptance, unique station coverage, uptime, defects, accessibility performance, use, or rider outcomes.",
    denominator: "The same 93-deployment PIDS inventory and pending closeout boundary carried from Phase 57B.",
    limits: ["Zero deployments in progress is not accepted closeout.", "Deployment entries are not established as 93 unique operational stations.", "Uptime, defects, maintenance, accessibility performance, passenger use, and rider outcomes remain undisclosed."],
    next: "Reopen with FRA-accepted closeout, unique station coverage, operational acceptance, uptime, defects, maintenance, accessibility performance, use, and rider outcomes.",
  },
  {
    slug: "amtrak-named-cohort-uptime-use-hold", agency: "DOT", actionKey: "AMTRAK-NAMED-RELIABILITY-HOLD-2026-01", stage: "Service reliability hold", status: "In Review", publicationDate: "2026-06-01", sourceIds: ["source-57b-amtrak-ada-progress-june-2026"],
    title: "Amtrak reliability hold: named station and railcar cohorts lack uptime and use results",
    finding: "Amtrak's named station completions and railcar ramp installations establish delivery cohorts, but the report does not publish compatible feature availability, outages, maintenance, actual use, complaints, or rider experience for those same cohorts.",
    denominator: "The eleven substantial-completion stations, eight final-completion stations, three matched stations, and 141 completed ramp-equipped cars already fixed in Phase 57B.",
    limits: ["Completion is not feature availability over time.", "Installed ramps are not trip-level service or use.", "No compatible outage, maintenance, use, complaint, boarding-time, or rider-experience series is public."],
    next: "Reopen with the same named station and railcar identifiers, compatible periods, feature uptime, outages, maintenance, actual use, complaints, boarding time, and rider experience.",
  },
  {
    slug: "louisiana-nextlink-adoption-hold", agency: "NTIA", actionKey: "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-02", stage: "Adoption and activation hold", status: "In Review", publicationDate: "2026-05-13", sourceIds: ["source-57b-louisiana-nextlink-first-bead-tower"],
    title: "Louisiana adoption hold: the 104-location cohort still lacks subscribers and tests",
    finding: "ConnectLA's 104-location Bossier Parish service-availability cohort remains public without a stable location list, installations, subscribers, test distribution, latency, uptime, affordability, adoption, complaints, or accepted closeout.",
    denominator: "The same 104 BEAD locations reported as serviceable, with eligible, serviceable, installed, subscribed, tested, and retained denominators kept separate.",
    limits: ["Serviceable locations are not subscribers.", "Advertised gigabit capability is not a measured test distribution.", "Adoption, affordability, reliability, complaints, and closeout cannot be inferred from tower activation."],
    next: "Reopen with a stable location list and disclosed eligible, serviceable, installed, subscribed, tested, retained, price, latency, uptime, complaint, and closeout fields.",
  },
  {
    slug: "louisiana-starlink-activation-hold", agency: "NTIA", actionKey: "LA-BEAD-STARLINK-HOLD-2026-02", stage: "Adoption and activation hold", status: "In Review", publicationDate: "2026-06-11", sourceIds: ["source-57b-louisiana-starlink-bead-agreement"],
    title: "Louisiana Starlink hold: the 10,635-location agreement still precedes activation",
    finding: "The signed Starlink BEAD agreement covers 10,635 locations, but no compatible activation, installation, subscriber, capacity-reservation, test, affordability, adoption, complaint, or closeout result is public in the reviewed record.",
    denominator: "The same 10,635-location agreement cohort across more than 50 parishes, kept separate from activated, installed, subscribed, tested, retained, or closed-out locations.",
    limits: ["Agreement execution is not service activation.", "A delivery schedule is not an accepted result.", "No subscriber, capacity, performance, affordability, adoption, complaint, or closeout denominator is disclosed."],
    next: "Reopen with location-level activation, installation, subscribers, capacity reservation, tests, latency, uptime, price, adoption, complaints, and accepted closeout.",
  },
  {
    slug: "montana-quarterly-results-hold", agency: "NTIA", actionKey: "MT-BEAD-QUARTERLY-HOLD-2026-02", stage: "Adoption and activation hold", status: "In Review", publicationDate: "2026-06-01", sourceIds: ["source-57b-montana-bead-quarterly-report-june-2026"],
    title: "Montana BEAD hold: reporting instructions still do not supply submitted results",
    finding: "ConnectMT's quarterly instructions define construction, subscriber, served-location, availability, and certification fields, but the reviewed artifact is not a completed or accepted subgrantee report.",
    denominator: "The reporting-field contract carried from Phase 57B, with zero completed subgrantee result rows represented by the instructions themselves.",
    limits: ["Instructions are not submitted observations.", "Required subscriber and served-location fields do not establish reported values.", "No accepted test, adoption, affordability, complaint, or closeout result is supplied."],
    next: "Reopen with completed subgrantee reports, stable location and subscriber denominators, performance tests, certifications, adoption, affordability, complaints, and accepted closeout.",
  },
  {
    slug: "nnsa-recurring-qualified-output-hold", agency: "DOE", actionKey: "NNSA-PIT-RATE-HOLD-2026-02", stage: "Recurring output and baseline hold", status: "In Review", publicationDate: "2026-05-13", sourceIds: ["source-57b-nnsa-sasc-testimony-may-2026", "source-56x-gao-nnsa-major-projects-2026"],
    title: "NNSA recurring-output hold: objectives and project progress do not establish accepted pit rate",
    finding: "NNSA's objectives and GAO's project records do not disclose additional qualified W87-1 pits by site and period, rejects, rework, accepted rate, or sustained recurring output.",
    denominator: "Qualified war-reserve pit output by named site and compatible month or quarter, with produced, qualified, rejected, reworked, and accepted counts kept separate.",
    limits: ["A target count or capacity objective is not recurring accepted output.", "Construction and equipment progress are not qualified production.", "No compatible site-period output, reject, rework, acceptance, or sustained-rate series is public."],
    next: "Reopen with qualified output by site and period, rejected and reworked units, acceptance authority, recurring rate, and revision history.",
  },
  {
    slug: "nnsa-peis-capacity-hold", agency: "DOE", actionKey: "NNSA-PIT-PEIS-HOLD-2026-02", stage: "Recurring output and baseline hold", status: "In Review", publicationDate: "2026-04-01", sourceIds: ["source-57b-nnsa-pit-production-draft-peis-2026"],
    title: "NNSA capacity hold: draft PEIS scenarios remain analytical rather than operational",
    finding: "The draft PEIS evaluates production-capacity alternatives and environmental effects but does not establish an approved final decision, installed accepted capacity, or recurring qualified output.",
    denominator: "The analytical capacity scenarios in the draft PEIS, kept separate from final decision, installed equipment, readiness authorization, qualified output, rejects, rework, and accepted rate.",
    limits: ["Analyzed capacity is not installed or accepted capacity.", "A draft environmental analysis is not a final agency decision.", "No recurring site-period qualified output or operating-performance series is supplied."],
    next: "Reopen with a final decision, installed and accepted capacity, readiness authorization, qualified output by period, rejects, rework, and accepted recurring rate.",
  },
  {
    slug: "nnsa-program-baseline-hold", agency: "DOE", actionKey: "NNSA-PIT-GAO-BASELINE-HOLD-2026-03", stage: "Recurring output and baseline hold", status: "In Review", publicationDate: "2026-04-01", sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-56x-gao-nnsa-major-projects-2026"],
    title: "NNSA baseline hold: project data still do not close the comprehensive program recommendation",
    finding: "GAO reports that NNSA still lacked a lifecycle cost estimate aligned with best practices as of April 2026 and separately reported project-level baselines and preliminary estimates, leaving the enterprise recommendation open.",
    denominator: "The complete plutonium-modernization program across sites and supporting activities, evaluated against GAO integrated-master-schedule and lifecycle-cost best practices.",
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

const authorityBoundary = "Planning, design, construction, turnover, service inventory, operating availability, use, adoption, test performance, accepted operation, repeat output, recurring rate, analytical capacity, project baseline, program baseline, realized outcome, closeout, implementation, and closure remain separate. No record supports a cross-system ranking, composite score, readiness score, generalized savings claim, or causal attribution.";
const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-57c-${spec.slug}`, document_id: `research-doc-57c-${spec.slug}`, signal_id: `signal-57c-${spec.slug}`,
    document_number: 639 + index, phase: "57C", action_key: spec.actionKey, agency: spec.agency, entity_id: meta.entity,
    record_type: "Service reliability, adoption, and recurring-output validation panel", evidence_stage: spec.stage, title: spec.title,
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
const phase57bHolds = phase57b.records.filter((record) => record.record_status === "In Review").map((record) => record.action_key);

await writeJson(join(dataRoot, "phase-57c-service-reliability-adoption-recurring-output-validation.json"), {
  phase: "57C", captured_date: capturedDate,
  goal: "Extend the exact Phase 57B cohorts into service-inventory, reliability, adoption, repeat-output, accepted-disposal, closed-loop, and complete-baseline validation without turning missing evidence into a claim.",
  publication_rule: "Publish only a bounded inventory, repeat output, cross-authority progression, accepted-disposal event, or completed closed-loop cohort with explicit entity, cohort, stage, period, unit, method, denominator, revision history, and attribution; retain reliability, adoption, activation, recurring-rate, analytical-capacity, and incomplete-baseline claims as In Review.",
  authority_rule: "A single turnover, deployment, shipment, transfer, or snapshot is not persistence; serviceability is not adoption; project data are not a program baseline; operator, regulator, agency, contractor, and independent evidence remain separate.",
  records_reviewed: records.length, records_published: published.length, records_held: held.length,
  evidence_stage_counts: evidenceStageCounts, new_official_source_profiles: sources.length, carried_official_source_profiles: carriedIds.length,
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [],
  prior_visible_scope: phase57b.post_batch_visible_scope, post_batch_visible_scope: phase57b.post_batch_visible_scope,
  post_batch_closure_counts: phase57b.post_batch_closure_counts,
  preserved_phase57b_holds: phase57bHolds,
  new_visible_holds: ["AMTRAK-NAMED-RELIABILITY-HOLD-2026-01"],
  records,
});

await writeJson(join(dataRoot, "phase-57c-publication-review.json"), {
  phase: "57C", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), exact_target_artifacts_acquired: 0,
  decision: "Twelve records publish as bounded service inventories, repeat outputs, accepted-disposal or closed-loop outcomes, or a project-to-program baseline boundary. Eight remain In Review because reliability, use, adoption, activation, recurring qualified output, accepted capacity, or complete program baselines are absent.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 638).padStart(2, "0")}-${record.record_id.replace(/^record-57c-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57c-${record.record_id.replace(/^record-57c-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date,
    document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record advances a fixed cohort into a bounded inventory, repeat output, accepted disposal, closed loop, or baseline boundary without inflating persistence, adoption, rate, or outcome." : "The visible hold prevents delivery, serviceability, planning, or component records from being presented as reliability, adoption, recurring output, accepted capacity, or a complete program baseline.",
    ftfn_relevance: ["Preserves entity, cohort, lifecycle stage, period, unit, method, denominator, revision history, and attribution.", "Separates inventory, availability, use, adoption, tests, accepted operation, repeat output, recurring rate, capacity, baseline, outcome, closeout, implementation, and closure.", "Keeps dated checks and exact-artifact retrieval non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "GAO acceptance, implementation, closure, and entity evidence remain separate from this content expansion.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls,
    official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`, capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: ${JSON.stringify(record.record_status)}\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Official Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}\n+${yamlList("dependencies", ["stable named entity and cohort", "compatible lifecycle stage and period", "explicit unit, method, denominator, revision history, and attribution", "later reliability, adoption, recurring-output, closeout, or outcome evidence"])}\n+${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 57C service reliability, adoption, and recurring-output validation panels"])}\n+${yamlList("local_implications", ["Do not collapse deployment, serviceability, availability, use, adoption, tests, accepted operation, repeat output, recurring rate, capacity, baseline, outcome, closeout, implementation, and closure into one stage."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57C fixed-cohort validation contract." : "Held until compatible reliability, use, adoption, activation, recurring qualified output, accepted capacity, or a complete program baseline is public.")}\n+---\n+\n+## Phase 57C panel\n+\n+${record.finding}\n+\n+## Evidence stage and denominator\n+\n+**${record.evidence_stage}.** ${record.denominator}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Service Reliability, Adoption, and Recurring-Output Validation, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57C reviews twenty Amtrak, BEAD, Hanford, and NNSA panels, publishing twelve bounded inventory, repeat-output, accepted-disposal, closed-loop, or baseline-boundary records and retaining eight explicit reliability, adoption, activation, recurring-output, capacity, or baseline holds.",
  scope: "Five Amtrak inventory panels and two reliability holds; three BEAD adoption or activation holds; six Hanford repeat-output, disposal, and closed-loop panels; and one NNSA baseline-boundary panel plus three recurring-output, capacity, or baseline holds.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-three-file archive contains twenty official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Entity, cohort, lifecycle stage, period, unit, method, denominator, revision history, and attribution remain explicit. A snapshot is not persistence, serviceability is not adoption, and component project data are not a complete program baseline.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 033: Service Reliability, Adoption, and Recurring-Output Validation"\n+slug: "research-watch-033-service-reliability-adoption-recurring-output-validation"\n+record_status: "Published"\n+summary: "Phase 57C publishes twelve bounded inventory, repeat-output, accepted-disposal, closed-loop, or baseline-boundary records and holds eight reliability, adoption, activation, recurring-output, capacity, or baseline claims."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", signalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", ["Amtrak's aggregate station, construction, design, ramp, and PIDS inventories are now explicit while uptime, maintenance, use, and rider experience remain held.", "The 104-location Louisiana cohort still lacks the stable eligible, serviceable, subscriber, test, affordability, adoption, complaint, and closeout fields required for an adoption result.", "Hanford now has bounded cumulative, stage-progression, first-disposal, secondary-stream, and completed treatment-to-disposal cohorts; none is inflated into a steady-state rate.", "NNSA project data remain useful but do not supply recurring qualified output or a complete GAO-sufficient integrated schedule and lifecycle cost baseline."])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Station and railcar uptime, outages, maintenance, use, complaints, and rider experience", "Stable broadband location, installation, subscriber, test, latency, uptime, price, adoption, complaint, and closeout data", "Monthly Hanford feed, output, quality, reject, rework, downtime, acceptance, disposal, compliance, cost, and contaminant fields", "Qualified NNSA output by site and period plus complete integrated schedule, lifecycle cost, and GAO sufficiency"])}\n+---\n+\n+## What Phase 57C adds\n+\n+The batch reviews twenty records and publishes twelve. Amtrak gains explicit portfolio and deployment inventories. Hanford gains compatible cumulative and stage-progression panels, the first vitrified-waste disposal boundary, and a completed 2,000-gallon treatment-to-disposal cohort. A project-to-program baseline panel preserves the value and limits of NNSA component data.\n+\n+## Reliability and adoption remain measured outcomes\n+\n+Completion and deployment do not establish uptime. Serviceable broadband locations do not establish subscribers or adoption. Reliability requires the same asset cohort over compatible periods; adoption requires a stable eligible or serviceable denominator and disclosed users.\n+\n+## Repeat output without a fabricated rate\n+\n+Hanford's approximately 50,000- and more-than-100,000-gallon snapshots and its more-than-20, 34, and 66-container observations demonstrate progression. Approximate cumulative snapshots and distinct production, shipment, acceptance, and disposal stages do not support an inferred monthly rate.\n+\n+## Closed-loop evidence\n+\n+The Test Bed Initiative provides one bounded treatment-to-disposal cohort: approximately 2,000 gallons, more than 99 percent radioactivity reduction, grouting, and licensed permanent disposal. It remains separate from LAW Facility operations and broader scale-up claims.\n+\n+## Evidence boundary\n+\n+No Phase 57C record changes directive scope, implementation, closure, or the one Closed / twenty-one Partially Closed / two Open entity ledger. No ranking, composite, readiness score, generalized savings claim, or unsupported causal inference is supported.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-033-service-reliability-adoption-recurring-output-validation.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-57c-service-reliability-adoption-recurring-output-validation.json"), {
  id: "update-2026-08-02-phase-57c-service-reliability-adoption-recurring-output-validation", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57C publishes twelve service and recurring-output validation panels",
  summary: "Two new Tier 1 source profiles and carried official sources support twelve Published panels and eight explicit In Review holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-033-service-reliability-adoption-recurring-output-validation/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded. Inventory, availability, use, adoption, tests, repeat output, recurring rate, capacity, baseline, outcome, closeout, implementation, and closure remain separate.",
  work_package: "docs/work-packages/phase-57c-service-reliability-adoption-recurring-output-validation.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
const doeSourceIds = newSourceIds;
const mobilitySourceIds = ["source-57b-amtrak-ada-progress-june-2026"];
const beadSourceIds = ["source-57b-louisiana-nextlink-first-bead-tower", "source-57b-louisiana-starlink-bead-agreement", "source-57b-montana-bead-quarterly-report-june-2026"];

await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => {
  value.source_ids = appendUnique(value.source_ids, doeSourceIds);
});

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 57C cohort next reports compatible recurring cost, reliability, adoption, accepted closeout, or realized outcome?"],
  ["policy-and-standards.json", [...newSourceIds, ...beadSourceIds], "Which Phase 57C hold next closes with compatible reliability, adoption, recurring output, accepted capacity, or a complete program baseline?"],
  ["mobility.json", mobilitySourceIds, "Which named Amtrak station or railcar cohort next adds uptime, outages, maintenance, actual use, complaints, and rider experience?"],
  ["chips-and-compute.json", beadSourceIds, "Which BEAD cohort next publishes stable eligible, serviceable, installed, subscriber, test, price, adoption, complaint, and closeout data?"],
  ["energy.json", newSourceIds, "Which Hanford or NNSA cohort next gains compatible monthly quality, rejects, rework, downtime, acceptance, disposal, cost, compliance, qualified output, or complete-baseline evidence?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, [...newSourceIds, ...mobilitySourceIds, ...beadSourceIds]],
  ["cross-corridor-authorization-to-operation.json", publishedByAgency("DOT"), [...mobilitySourceIds, ...beadSourceIds]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), newSourceIds],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-57c-"));
    value.signal_ids = appendUnique(value.signal_ids, selectedSignals); value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]); value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57C service reliability, adoption, and recurring-output validation panels");
    value.dependency_stack.push({ stage: "Phase 57C service reliability, adoption, and recurring-output validation panels", current_state: "Twelve Published panels and eight In Review holds distinguish inventory, reliability, adoption, repeat output, recurring rate, accepted disposal, closed-loop outcomes, project baselines, and program baselines.", boundary: "A snapshot is not persistence, serviceability is not adoption, and project data are not a complete program baseline." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57C prohibits denominator-free reliability or adoption claims, snapshot-to-rate inference, project-to-program inflation, cross-system rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Compatible uptime, use, adoption, monthly quality, rejects, rework, downtime, acceptance, disposal, compliance, recurring qualified output, complete program baselines, and realized outcomes under the same fixed-cohort contract."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57C adds twelve Published inventory, repeat-output, accepted-disposal, closed-loop, or baseline-boundary panels and eight explicit reliability, adoption, activation, recurring-output, capacity, or baseline holds.";
  value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-57c-"));
  value.source_ids = appendUnique(value.source_ids, newSourceIds); value.signal_ids = appendUnique(value.signal_ids, publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57c-service-reliability-adoption-recurring-output");
  value.links = value.links.filter((link) => link.from !== "node-phase57c-service-reliability-adoption-recurring-output");
  value.nodes.push({ id: "node-phase57c-service-reliability-adoption-recurring-output", label: "Twelve service or recurring-output panels; eight holds", node_type: "Signal", note: "Fixed cohorts advance only when stage, period, unit, method, denominator, revision history, and authority remain explicit." });
  value.links.push(
    { from: "node-phase57c-service-reliability-adoption-recurring-output", to: "node-phase57b-accepted-service-independent-outcomes", relationship: "Depends On", confidence: "Supported", note: "Phase 57C extends accepted-service cohorts into inventory, reliability, adoption, repeat-output, accepted-disposal, closed-loop, and baseline checks." },
    { from: "node-phase57c-service-reliability-adoption-recurring-output", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Projects, stations, railcars, locations, subscribers, tests, gallons, containers, contaminant mass, pits, capacity, and cost baselines are non-interchangeable denominators." },
    { from: "node-phase57c-service-reliability-adoption-recurring-output", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Deployment, serviceability, cumulative snapshots, first transfers, analytical capacity, and component baselines do not establish generalized causation, ranking, adoption, recurring rate, or readiness." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Twelve bounded inventory, repeat-output, accepted-disposal, closed-loop, or baseline-boundary panels plus eight visible reliability, adoption, activation, recurring-output, capacity, or baseline holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Compatible uptime, maintenance, use, adoption, monthly quality, rejects, rework, downtime, acceptance, disposal, compliance, recurring qualified output, complete program baselines, and realized-outcome evidence."]);
});

console.log(`Generated Phase 57C: ${published.length} Published records, ${held.length} In Review holds, ${sources.length} new Tier 1 sources, and Research Watch 033.`);
