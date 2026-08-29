import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "repeat-measurement-accepted-operation-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-030-repeat-measurement-accepted-operation";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const path of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"].map((name) => join(contentRoot, name))) {
  await mkdir(path, { recursive: true });
}

const phase56y = JSON.parse(await readFile(join(dataRoot, "phase-56y-longitudinal-delivery-outcomes.json"), "utf8"));
if (phase56y.phase !== "56Y" || phase56y.records.length !== 15) throw new Error("Phase 56Z requires the complete Phase 56Y ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-56z-dot-iija-financial-summary-mar2025",
    name: "DOT IIJA financial summary through March 31, 2025",
    url: "https://www.transportation.gov/sites/dot.gov/files/2025-04/IIJA%20Draft%20SOF%20Report%203-31-25%20%28IIJA%20Only%29%20Combined.pdf",
    owner: "U.S. Department of Transportation", agency: "DOT", access: "Data Download",
    limitation: "The two-page statement combines formula and discretionary IIJA funding. Adjusted authority changes between snapshots, so dollar movement and percentage-point movement must be reported together and cannot be treated as a fixed-denominator completion trend.",
  },
  {
    id: "source-56z-ntia-bead-progress-dashboard-may2026",
    name: "NTIA BEAD Progress Dashboard, May 4, 2026",
    url: "https://www.ntia.gov/funding-programs/internet-all/broadband-equity-access-and-deployment-bead-program/progress-dashboard",
    owner: "National Telecommunications and Information Administration", agency: "NTIA", access: "Report Series",
    limitation: "The dashboard reports eligible-entity proposal and award-agreement milestones. It does not report construction, service activation, operational test results, subscriber adoption, disbursement, or closeout.",
  },
  {
    id: "source-56z-sc-bead-agreements-jun2026",
    name: "South Carolina BEAD scope and agreement update",
    url: "https://ors.sc.gov/news/bead-scope-reduced-50-agreements-signed",
    owner: "South Carolina Office of Regulatory Staff", agency: "NTIA", access: "Release Page",
    limitation: "The state release reports signed subrecipient agreements and planned construction. It does not establish permitting completion, construction start, service activation, performance tests, subscriber use, or BEAD closeout.",
  },
  {
    id: "source-56z-oregon-bead-community-hub-2026",
    name: "Oregon BEAD Community Hub",
    url: "https://www.oregon.gov/biz/programs/bead/community/pages/default.aspx",
    owner: "Business Oregon, Oregon Broadband Office", agency: "NTIA", access: "Report Series",
    limitation: "The page describes 313 awarded projects and 104,654 eligible locations but says most BEAD projects are not set to start until late 2026. Award geography is not construction or operating evidence.",
  },
  {
    id: "source-56z-delaware-bead-milestone-mar2026",
    name: "Delaware BEAD broadband milestone",
    url: "https://news.delaware.gov/2026/03/25/governor-matt-meyer-announces-major-broadband-milestone-for-delaware/",
    owner: "State of Delaware", agency: "NTIA", access: "Release Page",
    limitation: "The release reports an approved plan, preliminary awardees, 4,728 locations, and expected construction dates. It does not establish signed subgrants, construction start, accepted service, tests, adoption, or closeout.",
  },
  {
    id: "source-56z-hanford-tank-a102-retrieval-may2026",
    name: "DOE EM: Hanford removes waste from 23rd large underground tank",
    url: "https://www.energy.gov/em/articles/hanford-advances-cleanup-mission-removes-waste-23rd-large-underground-tank",
    owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", access: "Report Series",
    limitation: "DOE reports transferred and cumulative retrieved volume. Transfer to a double-shell tank is interim risk reduction, not final treatment, disposal, tank closure, or an independently measured environmental outcome.",
  },
  {
    id: "source-56z-srs-salt-waste-throughput-feb2024",
    name: "DOE EM: Savannah River tops 15 million gallons of salt waste processed",
    url: "https://www.energy.gov/em/articles/savannah-river-site-tops-15-million-gallons-salt-waste-processed",
    owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", access: "Report Series",
    limitation: "The 15-million-gallon total covers three facilities since 2008, while the 7.5-million-gallon subtotal covers SWPF's first three years. Neither denominator can be silently merged with a later since-2022 SWPF measure.",
  },
  {
    id: "source-56z-srs-tank3-pcwr-sep2025",
    name: "DOE EM: Savannah River Tank 3 reaches preliminary cease waste removal",
    url: "https://www.energy.gov/em/articles/and-another-one-srs-racks-fourth-tank-waste-removal-milestone-year",
    owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", access: "Report Series",
    limitation: "PCWR is regulator concurrence based on preliminary information and permits sampling and analysis to begin. It is not final residual determination, stabilization, isolation, or operational tank closure.",
  },
  {
    id: "source-56z-srs-gwsb1-double-stack-apr2024",
    name: "DOE EM: Savannah River waste canister double-stack milestone",
    url: "https://www.energy.gov/em/articles/savannah-river-site-marks-waste-canister-double-stack-milestone",
    owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", access: "Report Series",
    limitation: "Completed modifications establish interim storage capacity in GWSB 1. They do not establish use of every position, final disposal, completed liquid-waste treatment, or independently audited realized savings.",
  },
  {
    id: "source-56z-srs-liquid-waste-plan-jul2026",
    name: "DOE EM: Savannah River Liquid Waste System Plan Revision 24.1 update",
    url: "https://www.energy.gov/em/articles/savannah-river-sites-latest-liquid-waste-system-plan-calls-fewer-canisters",
    owner: "U.S. Department of Energy, Office of Environmental Management", agency: "DOE", access: "Report Series",
    limitation: "The update reports implemented process changes but states an expected 300-canister reduction. A planning-model reduction is not a realized final canister count, independently validated risk outcome, or completed cleanup mission.",
  },
  {
    id: "source-56z-nnsa-brookings-remarks-mar2024",
    name: "NNSA principal deputy administrator remarks at Brookings",
    url: "https://www.energy.gov/nnsa/articles/nnsa-principal-deputy-administrator-frank-rose-remarks-brookings-institution",
    owner: "U.S. Department of Energy, National Nuclear Security Administration", agency: "DOE", access: "Report Series",
    limitation: "The remarks report installation of LAP4's first new glovebox during 2024. An installed equipment input is not CD-4, operational acceptance, qualified production capacity, or attributable pit output.",
  },
  {
    id: "source-56z-nnsa-hudson-remarks-jan2025",
    name: "NNSA administrator remarks at the Hudson Institute",
    url: "https://www.energy.gov/nnsa/articles/nnsa-administrator-jill-hruby-remarks-hudson-institute",
    owner: "U.S. Department of Energy, National Nuclear Security Administration", agency: "DOE", access: "Report Series",
    limitation: "The remarks report completed SRPPF demolition and removal and an established training center, then distinguish those inputs from construction completion, nuclear-material introduction, manufacturing-process establishment, and rate production.",
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
    source_owner: source.owner, notes: `Phase 56Z repeat-measurement and accepted-operation source. Collection: ${collectionSlug}.`,
  });
}

const specs = [
  {
    slug: "dot-iija-aggregate-repeat-panel", agency: "DOT", actionKey: "DOT-IIJA-REPEAT-02", stage: "Repeat funding measurement", status: "Published", publicationDate: "2026-07-10", sourceIds: ["source-56z-dot-iija-financial-summary-mar2025", "source-56y-dot-iija-funding-status-may2026"],
    title: "DOT IIJA aggregate: obligation and outlay shares rise across a changing authority denominator",
    finding: "From March 31, 2025 to May 31, 2026, reported DOT IIJA obligations rose from $272.869 billion to $392.472 billion and outlays from $143.257 billion to $237.220 billion; the obligated share moved from 67.30 to 71.92 percent and the outlay share from 35.33 to 43.47 percent.",
    denominator: "Two DOT-wide formula-plus-discretionary IIJA financial statements; adjusted authority changed from $405.476 billion to $545.692 billion between observations.",
    limits: ["The denominator increased by about $140.216 billion, so percentage-point movement is not a fixed-cohort completion rate.", "Obligations and outlays are lifecycle measures, not accepted assets or outcomes.", "Two observations do not establish a durable trend or causal explanation."],
    next: "Add later statements under the same accounting method and separate stable program cohorts that reach accepted delivery, service, use, and outcomes.",
  },
  {
    slug: "dot-fhwa-repeat-panel", agency: "DOT", actionKey: "DOT-IIJA-FHWA-02", stage: "Repeat funding measurement", status: "Published", publicationDate: "2026-07-10", sourceIds: ["source-56z-dot-iija-financial-summary-mar2025", "source-56y-dot-iija-funding-status-may2026"],
    title: "FHWA IIJA: outlays rise from 49.3 to 55.4 percent while authority expands",
    finding: "FHWA obligations rose from $180.678 billion to $262.910 billion and outlays from $112.370 billion to $177.778 billion between the two DOT statements; obligation share rose 2.7 points and outlay share rose 6.1 points.",
    denominator: "FHWA formula-plus-discretionary IIJA funding; adjusted authority changed from $227.871 billion to $320.662 billion.",
    limits: ["The formula-plus-discretionary denominator changed materially.", "Payments do not establish completion, acceptance, road condition, safety, travel-time, or emissions outcomes.", "The panel does not support comparison with FTA or FRA performance."],
    next: "Track a stable FHWA program cohort into accepted projects, service condition, safety, and use measures.",
  },
  {
    slug: "dot-fta-repeat-panel", agency: "DOT", actionKey: "DOT-IIJA-FTA-02", stage: "Repeat funding measurement", status: "Published", publicationDate: "2026-07-10", sourceIds: ["source-56z-dot-iija-financial-summary-mar2025", "source-56y-dot-iija-funding-status-may2026"],
    title: "FTA IIJA: obligation and outlay shares rise under a larger adjusted-authority base",
    finding: "FTA obligations rose from $37.280 billion to $56.710 billion and outlays from $18.595 billion to $34.573 billion; the obligation share moved from 48.2 to 57.3 percent and the outlay share from 24.0 to 34.9 percent.",
    denominator: "FTA formula-plus-discretionary IIJA funding; adjusted authority changed from $77.356 billion to $98.931 billion.",
    limits: ["The authority base is not fixed.", "An outlay is a payment, not an accepted transit asset or operating result.", "The panel does not establish ridership, reliability, accessibility, safety, or emissions outcomes."],
    next: "Link stable FTA program cohorts to asset acceptance, service entry, use, reliability, accessibility, and defined outcomes.",
  },
  {
    slug: "dot-fra-repeat-panel", agency: "DOT", actionKey: "DOT-IIJA-FRA-02", stage: "Repeat funding measurement", status: "Published", publicationDate: "2026-07-10", sourceIds: ["source-56z-dot-iija-financial-summary-mar2025", "source-56y-dot-iija-funding-status-may2026"],
    title: "FRA IIJA: dollars obligated rise while the obligation share falls under a larger denominator",
    finding: "FRA obligations rose from $35.476 billion to $41.516 billion and outlays from $2.589 billion to $7.279 billion, but the obligation share moved from 67.2 to 63.0 percent as adjusted authority rose from $52.795 billion to $65.856 billion.",
    denominator: "FRA formula-plus-discretionary IIJA funding across two DOT statements with a changing authority base.",
    limits: ["The 4.2-point obligation-share decline is a denominator effect and is not evidence that obligations were reversed.", "The 6.2-point outlay-share increase remains a payment measure.", "No project completion, service, capacity, safety, or passenger outcome is established."],
    next: "Follow stable FRA program cohorts from obligation and payment into construction, acceptance, service, and outcomes.",
  },
  {
    slug: "ntia-bead-agreement-repeat-panel", agency: "NTIA", actionKey: "NTIA-BEAD-AGREEMENTS-02", stage: "Award progression", status: "Published", publicationDate: "2026-05-04", sourceIds: ["source-56y-ntia-bead-progress-dashboard-apr2026", "source-56z-ntia-bead-progress-dashboard-may2026"],
    title: "BEAD: signed eligible-entity award agreements rise from 44 to 50 in three weeks",
    finding: "Between April 13 and May 4, 2026, NTIA approvals rose from 53 to 54, NIST approvals from 51 to 52, and signed and returned eligible-entity award agreements from 44 to 50, while all 56 final proposals remained submitted.",
    denominator: "The same 56 BEAD eligible entities and four nested dashboard milestones at two dated observations.",
    limits: ["The counts are nested stages, not additive totals.", "An eligible-entity award agreement is not a signed provider subgrant, construction, activation, adoption, or closeout.", "The repeat observation does not supply location-level disbursement or performance results."],
    next: "Track the same entities into binding subgrants, permitting, construction, activated locations, operational tests, subscriber samples, adoption, and closeout.",
  },
  {
    slug: "sc-bead-agreement-to-construction-boundary", agency: "NTIA", actionKey: "SC-BEAD-DELIVERY-01", stage: "Award progression", status: "Published", publicationDate: "2026-06-30", sourceIds: ["source-56z-sc-bead-agreements-jun2026"],
    title: "South Carolina BEAD: four of eight remaining agreements are signed; construction remains prospective",
    finding: "South Carolina reports that eight of the original 16 BEAD projects moved to non-BEAD funding, four of the eight remaining provider agreements were signed, and the remaining BEAD scope covers 19,022 locations and $35.802 million.",
    denominator: "Eight remaining BEAD providers after the state moved eight original projects to other funding; 19,022 remaining broadband-serviceable locations.",
    limits: ["The program universe changed when half the original projects moved to non-BEAD funds.", "Construction was expected after environmental permits and had not been reported as underway.", "No accepted service, test result, subscriber use, or closeout is established."],
    next: "Record signed agreements for the remaining providers, permit completion, construction start, activated locations, test samples, adoption, and closeout under the reduced universe.",
  },
  {
    slug: "oregon-bead-construction-hold", agency: "NTIA", actionKey: "OR-BEAD-DELIVERY-HOLD-01", stage: "Award progression hold", status: "In Review", publicationDate: "2026-08-02", sourceIds: ["source-56z-oregon-bead-community-hub-2026"],
    title: "Oregon BEAD operation hold: 313 awards and 104,654 locations precede construction",
    finding: "Oregon identifies 313 awarded projects covering 104,654 eligible locations but says most BEAD projects are not set to start until late 2026.",
    denominator: "Oregon's BEAD award map and eligible-location universe as presented on the state community hub.",
    limits: ["Mapped awards are not construction progress.", "The page supplies no activated locations or performance-test observations.", "The record remains In Review until a completed delivery or operating denominator is public."],
    next: "Promote only after the state reports construction or operation with project identity, period, locations, method, tests, and acceptance status.",
  },
  {
    slug: "delaware-bead-construction-hold", agency: "NTIA", actionKey: "DE-BEAD-DELIVERY-HOLD-01", stage: "Award progression hold", status: "In Review", publicationDate: "2026-03-25", sourceIds: ["source-56z-delaware-bead-milestone-mar2026"],
    title: "Delaware BEAD operation hold: 4,728 planned connections await construction",
    finding: "Delaware reports federal approval for a plan covering more than 4,728 homes and businesses, with $27.8 million in federal infrastructure funds and construction expected to begin in fall 2026.",
    denominator: "The approved Delaware plan's 4,728-location buildout across New Castle, Kent, and Sussex counties.",
    limits: ["Approved funding and preliminary awardees do not establish signed provider agreements.", "Expected construction is not observed construction or service activation.", "No operational tests, adoption, or closeout results are public in this record."],
    next: "Track signed subgrants, construction, accepted locations, performance samples, subscriber activation, adoption, and closeout.",
  },
  {
    slug: "hanford-dflaw-accepted-operation-sequence", agency: "DOE", actionKey: "HANFORD-DFLAW-OPERATION-02", stage: "Accepted cleanup operation", status: "Published", publicationDate: "2026-05-26", sourceIds: ["source-56x-hanford-first-ilaw-disposal-2026", "source-56x-hanford-vitrification-100k-2026"],
    title: "Hanford DFLAW: first permanent disposal follows hot commissioning and precedes steady-state operation",
    finding: "Hanford began hot commissioning in October 2025, permanently disposed the first vitrified low-activity-waste containers in April 2026, and reported more than 100,000 gallons vitrified by May 26, while stating that hot commissioning would continue.",
    denominator: "The Hanford Low-Activity Waste Facility commissioning stream and Integrated Disposal Facility container sequence from October 2025 through May 26, 2026.",
    limits: ["The source reports about 30 containers ready for disposal, not a complete recurring disposal count.", "Commissioning output is not steady-state throughput or final mission performance.", "Agency-reported risk reduction is not independent environmental-outcome validation."],
    next: "Add repeat throughput periods, accepted disposal counts, downtime, quality, residual inventory, compliance, and steady-state operating acceptance.",
  },
  {
    slug: "hanford-tank-retrieval-cumulative-panel", agency: "DOE", actionKey: "HANFORD-TANK-RETRIEVAL-01", stage: "Accepted cleanup operation", status: "Published", publicationDate: "2026-05-01", sourceIds: ["source-56z-hanford-tank-a102-retrieval-may2026"],
    title: "Hanford tank retrieval: Tank A-102 becomes the 23rd completed retrieval",
    finding: "DOE reports about 41,000 gallons transferred from single-shell Tank A-102 to a double-shell tank, bringing cumulative retrieved waste across 23 tanks to about 3.4 million gallons.",
    denominator: "Completed Hanford single-shell tank retrievals through Tank A-102 and DOE's cumulative retrieved-gallon total as of May 1, 2026.",
    limits: ["Tank-specific and cumulative gallons use approximate values.", "Transfer to another tank is not treatment, permanent disposal, or operational closure.", "The 24th tank was in progress and is excluded from the completed cohort."],
    next: "Track the 24th retrieval, residual-volume determination, treatment, permanent disposal, and tank closure as separate stages.",
  },
  {
    slug: "srs-tank3-pcwr-regulatory-cohort", agency: "DOE", actionKey: "SRS-PCWR-ACCEPTANCE-01", stage: "Accepted cleanup operation", status: "Published", publicationDate: "2025-09-23", sourceIds: ["source-56z-srs-tank3-pcwr-sep2025"],
    title: "Savannah River Tank 3 joins a seven-tank preliminary waste-removal concurrence cohort",
    finding: "DOE reports regulator concurrence on preliminary cease waste removal for Tank 3, the seventh old-style tank to reach PCWR since 2024 and one of seven completed 7 to 27 months ahead of Federal Facility Agreement deadlines.",
    denominator: "Seven named old-style SRS tanks receiving PCWR concurrence since 2024 under the Federal Facility Agreement process.",
    limits: ["PCWR is preliminary reasonable assurance, not final closure.", "Sampling, analysis, and final residual-volume determination follow the concurrence.", "Schedule performance does not establish final stabilization, isolation, risk outcome, or cost performance."],
    next: "Track residual determinations, grouting, isolation, regulatory closure, and post-closure monitoring for the same seven tanks.",
  },
  {
    slug: "srs-gwsb1-accepted-storage-capacity", agency: "DOE", actionKey: "SRS-GWSB1-STORAGE-01", stage: "Accepted cleanup operation", status: "Published", publicationDate: "2024-04-16", sourceIds: ["source-56z-srs-gwsb1-double-stack-apr2024"],
    title: "Savannah River completes GWSB 1 modifications for 4,524 interim canister positions",
    finding: "DOE reports completed modifications to all 2,262 original positions in Glass Waste Storage Building 1, enabling interim storage of 4,524 vitrified high-level-waste canisters.",
    denominator: "All 2,262 original positions in GWSB 1 modified for two-canister stacking, yielding 4,524 interim positions.",
    limits: ["Completed storage modification is not use of every position.", "Interim storage is not final disposal in a federal repository.", "DOE's avoided-building savings estimate is not treated as independently audited realized savings."],
    next: "Track accepted use, canisters stored, GWSB 2 modification, remaining mission demand, capacity margin, and final disposal.",
  },
  {
    slug: "idaho-iwtu-repeat-treatment-storage-panel", agency: "DOE", actionKey: "IDAHO-IWTU-REPEAT-02", stage: "Accepted cleanup operation", status: "Published", publicationDate: "2026-06-30", sourceIds: ["source-56y-idaho-iwtu-storage-expansion-2026", "source-56y-idaho-iwtu-treatment-milestone-2026"],
    title: "Idaho IWTU: cumulative treatment advances between two approximate observations",
    finding: "DOE reported more than 279,000 gallons treated by January 27, 2026 and nearly 400,000 gallons by June 30, while the state-authorized storage system provided 84 vaults for 1,344 canisters.",
    denominator: "Cumulative IWTU sodium-bearing waste treated since radiological operations began in April 2023, paired with separately authorized interim storage capacity.",
    limits: ["More-than and nearly values do not support an exact five-month delta.", "Treatment volume and storage capacity are separate denominators.", "The approximately 900,000-gallon design mission and final tank closure remain incomplete."],
    next: "Add exact cumulative and period throughput, downtime, canisters generated and stored, residual inventory, compliance, permanent disposal, and tank closure.",
  },
  {
    slug: "lap4-first-glovebox-delivery", agency: "DOE", actionKey: "NNSA-LAP4-DELIVERY-02", stage: "Project delivery input", status: "Published", publicationDate: "2024-03-13", sourceIds: ["source-56z-nnsa-brookings-remarks-mar2024", "source-56w-nnsa-fy2027-weapons-activities"],
    title: "LAP4: first new glovebox is installed, but acceptance and attributable output remain open",
    finding: "NNSA reported in March 2024 that LAP4 was removing contaminated material and had installed its first new glovebox; later planning records continue to separate equipment installation from complete subproject baselines and production capability.",
    denominator: "The first new glovebox installed within the LAP4 modernization effort, bounded from the broader 30-pits-per-year planning objective.",
    limits: ["One installed glovebox is a delivered input, not a complete equipment cohort.", "Installation does not establish CD-4, qualification, operational acceptance, or production capability.", "Pit output cannot be attributed to this single input from the cited records."],
    next: "Track the named glovebox through qualification and acceptance, then publish only attributable operating output under a disclosed equipment and production denominator.",
  },
  {
    slug: "srppf-demolition-training-delivery", agency: "DOE", actionKey: "NNSA-SRPPF-DELIVERY-02", stage: "Project delivery input", status: "Published", publicationDate: "2025-01-16", sourceIds: ["source-56z-nnsa-hudson-remarks-jan2025", "source-56w-nnsa-fy2027-weapons-activities"],
    title: "SRPPF: demolition and training inputs are complete before construction and rate production",
    finding: "NNSA reported SRPPF demolition and removal completed in 2024 with more than 2,500 gross tons sent for recycling and the Machining Training Center established, while distinguishing those inputs from construction completion and rate production.",
    denominator: "Named SRPPF enabling inputs completed before facility construction completion, nuclear-material introduction, manufacturing-process establishment, and rate production.",
    limits: ["Recycled demolition mass is not construction percent complete.", "A training center is a workforce input, not operating acceptance.", "The cited record targets later construction and production stages but does not establish their completion."],
    next: "Track approved baselines, delivered and installed equipment, CD-4, operational acceptance, nuclear-material introduction, qualified processes, and attributable production output.",
  },
  {
    slug: "srs-throughput-denominator-hold", agency: "DOE", actionKey: "SRS-THROUGHPUT-HOLD-01", stage: "Comparison hold", status: "In Review", publicationDate: "2026-02-25", sourceIds: ["source-56z-srs-salt-waste-throughput-feb2024", "source-56y-srs-tank-waste-risk-reduction-2026"],
    title: "Savannah River throughput hold: three-facility and SWPF-only periods are not one series",
    finding: "DOE's 2024 record reports more than 15 million gallons processed since 2008 across three facilities and about 7.5 million by SWPF in its first three years; the 2026 record reports more than 10.6 million gallons processed by SWPF since 2022.",
    denominator: "Two overlapping but non-identical SRS salt-waste reporting universes and start dates.",
    limits: ["The all-facility total cannot be compared as an SWPF-only series.", "SWPF's first-three-years period and since-2022 period are not identical windows.", "The record remains In Review until compatible periodic or cumulative measures are available."],
    next: "Recover SWPF-only cumulative observations with the same start date, method, revision history, downtime, and residual-inventory denominator.",
  },
  {
    slug: "srs-canister-forecast-hold", agency: "DOE", actionKey: "SRS-CANISTER-FORECAST-HOLD-01", stage: "Comparison hold", status: "In Review", publicationDate: "2026-07-21", sourceIds: ["source-56z-srs-liquid-waste-plan-jul2026"],
    title: "Savannah River outcome hold: a 300-canister planning reduction is not a realized final count",
    finding: "DOE reports that two planning changes are expected to reduce mission demand by about 300 high-level-waste canisters, including 150 fewer from a process change that allows 5.5 percent more waste per canister.",
    denominator: "Liquid Waste System Plan Revision 24.1's forecast mission canister count and two modeled 150-canister changes.",
    limits: ["The 300-canister reduction is an expected plan result, not a final realized count.", "One component follows a process change and one follows a program decision, so attribution differs.", "No final cost, safety, environmental, or mission-completion outcome is established."],
    next: "Track actual waste loading, canisters poured, revised mission total, quality, downtime, accepted storage, cost, and final disposal before promotion.",
  },
];

const sourceById = new Map(sources.map((source) => [source.id, source]));
const carriedIds = [...new Set(specs.flatMap((spec) => spec.sourceIds).filter((id) => !sourceById.has(id)))];
for (const id of carriedIds) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}

const records = specs.map((spec, index) => {
  const meta = agencyMeta[spec.agency];
  return {
    record_id: `record-56z-${spec.slug}`, document_id: `research-doc-56z-${spec.slug}`, signal_id: `signal-56z-${spec.slug}`,
    document_number: 589 + index, phase: "56Z", action_key: spec.actionKey, agency: spec.agency, entity_id: meta.entity,
    record_type: "Repeat-measurement and accepted-operation panel", evidence_stage: spec.stage, title: spec.title,
    record_status: spec.status, source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url, publication_date: spec.publicationDate,
    document_type: spec.stage === "Repeat funding measurement" ? "Data Release" : spec.stage.includes("Award") ? "Program Milestone" : spec.stage === "Project delivery input" ? "Program Milestone" : spec.stage === "Comparison hold" ? "Technical Report" : "Program Milestone",
    finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits, next_action: spec.next,
    exact_target_artifact_acquired: false, directive_scope_change: false, implementation_change: false, closure_change: false,
    contact_or_foia_submitted: false,
    authority_boundary: "Selection, agreement, obligation, payment, construction, delivery, acceptance, operation, output, realized outcome, closeout, implementation, and closure remain separate. Repeated agency reporting does not establish independent causal attribution or a cross-entity ranking.",
    captured_date: capturedDate,
  };
});

const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");

await writeJson(join(dataRoot, "phase-56z-repeat-measurement-accepted-operation.json"), {
  phase: "56Z", captured_date: capturedDate,
  goal: "Turn stable Phase 56Y identities into compatible repeat-measurement, accepted-operation, delivered-input, and explicit hold panels.",
  publication_rule: "Publish only when the entity, universe, stage, observation period, unit, method, and denominator are compatible; otherwise retain an explicit In Review hold.",
  authority_rule: "Two points are not automatically a durable trend, agency reporting is not independent validation, and construction, accepted operation, output, outcome, closeout, implementation, and closure remain distinct.",
  records_reviewed: records.length, records_published: published.length, records_held: held.length,
  evidence_stage_counts: Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length])),
  new_official_source_profiles: sources.length, carried_official_source_profiles: carriedIds.length,
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [],
  prior_visible_scope: phase56y.post_batch_visible_scope, post_batch_visible_scope: phase56y.post_batch_visible_scope,
  post_batch_closure_counts: phase56y.post_batch_closure_counts, records,
});

await writeJson(join(dataRoot, "phase-56z-publication-review.json"), {
  phase: "56Z", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id),
  exact_target_artifacts_acquired: 0,
  decision: "Thirteen records publish under compatible or completed-stage contracts. Four records remain In Review because construction has not started, operating evidence is absent, reporting universes differ, or the result remains forecast rather than realized.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 588).padStart(2, "0")}-${record.record_id.replace(/^record-56z-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-56z-${record.record_id.replace(/^record-56z-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority",
    publication_date: record.publication_date, document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record adds a compatible repeat observation or completed-stage input without inflating it into an outcome." : "The hold keeps a planned, incompatible, or forecast record out of the Published evidence layer until its measurement contract closes.",
    ftfn_relevance: ["Preserves entity, universe, stage, period, unit, method, and denominator.", "Separates repeated measurement from trend and delivered input from accepted operation.", "Keeps exact-artifact checks non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "GAO acceptance, implementation, closure, and entity evidence remain separate from this content expansion.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls,
    official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`, capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: ${JSON.stringify(record.record_status)}\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Official Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}\n+${yamlList("dependencies", ["stable entity and universe", "compatible lifecycle stage", "explicit period, unit, method, and denominator", "later acceptance or outcome evidence"])}\n+${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 56Z repeat-measurement and accepted-operation panels"])}\n+${yamlList("local_implications", ["Do not collapse repeat measurement into trend or delivery, acceptance, operation, output, outcome, closeout, implementation, and closure into one stage."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the stated measurement contract." : "Held until compatible completed-stage or observed operating evidence is public.")}\n+---\n+\n+## Phase 56Z panel\n+\n+${record.finding}\n+\n+## Evidence stage and denominator\n+\n+**${record.evidence_stage}.** ${record.denominator}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Repeat Measurement and Accepted Operation, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 56Z reviews seventeen panels across DOT, BEAD, Hanford, Savannah River, Idaho, LAP4, and SRPPF, publishing thirteen and retaining four explicit holds.",
  scope: "Four repeat funding panels, four BEAD progression records, five accepted cleanup-operation records, two project-delivery inputs, and two comparison holds.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The twenty-file archive contains seventeen official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Entity, universe, lifecycle stage, period, unit, method, denominator, acceptance, and outcome remain explicit. Two observations are not automatically a trend; planned, forecast, installed, operating, accepted, closed, and realized stages are not interchangeable.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 030: Repeat Measurement and Accepted Operation"\n+slug: "research-watch-030-repeat-measurement-accepted-operation"\n+record_status: "Published"\n+summary: "Phase 56Z publishes thirteen compatible repeat or completed-stage panels and holds four records that lack construction, operating evidence, a common denominator, or a realized result."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", signalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", ["DOT now has two comparable statements, but changing authority denominators prevent fixed-cohort completion claims.", "BEAD agreement execution is advancing while state construction and operating evidence remain uneven and explicitly bounded.", "Hanford, Savannah River, Idaho, LAP4, and SRPPF add accepted or delivered stages without converting inputs into final outcomes."])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Stable DOT program cohorts that reach accepted assets and outcomes", "BEAD construction, activation, tests, subscribers, adoption, and closeout", "Repeat cleanup throughput, downtime, residual inventory, disposal, compliance, and closure", "LAP4 and SRPPF qualification, CD-4, acceptance, and attributable output"])}\n+---\n+\n+## What Phase 56Z adds\n+\n+The batch reviews seventeen records and publishes thirteen. Four DOT panels add a second financial observation, two BEAD records publish agreement progression, five cleanup panels add accepted or repeat operating stages, and two NNSA panels add delivered inputs. Four records remain In Review because operation has not begun, denominators conflict, or a result remains forecast.\n+\n+## Repeat measurement\n+\n+DOT's reported obligation and outlay dollars rise across the aggregate, FHWA, FTA, and FRA observations, but adjusted authority also changes. The percentage series therefore remains informative only with the changing denominator attached. Two points do not establish a durable trend.\n+\n+## Accepted operation and delivered inputs\n+\n+Hanford's sequence reaches first permanent disposal during continuing hot commissioning. Savannah River adds preliminary regulatory concurrence and completed interim-storage modifications. Idaho adds a second approximate cumulative-treatment observation. LAP4 and SRPPF add installed or completed enabling inputs without implying operational acceptance or production output.\n+\n+## Holds\n+\n+Oregon and Delaware remain pre-construction. Savannah River throughput sources use incompatible facility and period universes, and the updated canister count remains a forecast. The hold layer is part of the evidence product, not missing content.\n+\n+## Evidence boundary\n+\n+No Phase 56Z record changes directive scope, implementation, closure, or the one Closed / twenty-one Partially Closed / two Open entity ledger. No ranking, composite, readiness score, generalized savings claim, or unsupported causal inference is supported.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-030-repeat-measurement-accepted-operation.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-56z-repeat-measurement-accepted-operation.json"), {
  id: "update-2026-08-02-phase-56z-repeat-measurement-accepted-operation", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 56Z publishes thirteen repeat-measurement and accepted-operation panels",
  summary: "Twelve new Tier 1 source profiles and seven carried sources support thirteen Published panels and four explicit In Review holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-030-repeat-measurement-accepted-operation/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded. Repeat measurement, trend, delivery, acceptance, operation, output, outcome, and closeout remain separate.",
  work_package: "docs/work-packages/phase-56z-repeat-measurement-accepted-operation.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => {
  value.source_ids = appendUnique(value.source_ids, newSourceIds.filter((id) => id.includes("hanford") || id.includes("srs") || id.includes("nnsa")));
});

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 56Z repeat or accepted-stage record next reaches a realized outcome under the same denominator?"],
  ["policy-and-standards.json", newSourceIds, "Which Phase 56Z hold next closes with compatible construction, operating, acceptance, or outcome evidence?"],
  ["mobility.json", newSourceIds.slice(0, 1), "Which stable DOT program cohort next reaches accepted delivery, service, use, and outcomes?"],
  ["chips-and-compute.json", newSourceIds.slice(1, 5), "Which BEAD entities next report construction, activated locations, operational tests, subscriber use, adoption, and closeout?"],
  ["energy.json", newSourceIds.slice(5), "Which Hanford, Savannah River, Idaho, LAP4, or SRPPF panel next gains a compatible repeat period, operational acceptance, closure, or realized outcome?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, newSourceIds],
  ["autonomy-regulation-to-service.json", publishedSignalIds.slice(0, 6), newSourceIds.slice(0, 5)],
  ["energy-grid-capacity-to-service.json", publishedSignalIds.slice(6), newSourceIds.slice(5)],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-56z-"));
    value.signal_ids = appendUnique(value.signal_ids, selectedSignals); value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]); value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 56Z repeat-measurement and accepted-operation panels");
    value.dependency_stack.push({ stage: "Phase 56Z repeat-measurement and accepted-operation panels", current_state: "Thirteen Published panels and four In Review holds separate repeat funding, award progression, accepted cleanup operation, delivered project inputs, and unresolved comparison contracts.", boundary: "Two points are not automatically a trend; changing denominators, planned construction, installed inputs, accepted operation, output, outcome, closeout, implementation, and closure remain separate." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 56Z prohibits denominator-free trends, stage inflation, cross-entity rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Compatible later observations, completed delivery, operational acceptance, sustained performance, closeout, and realized outcomes under the same measurement contract."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 56Z adds thirteen Published repeat or completed-stage panels and four explicit holds while entity, universe, stage, period, unit, method, denominator, acceptance, closeout, and outcome remain separate.";
  value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-56z-"));
  value.source_ids = appendUnique(value.source_ids, newSourceIds); value.signal_ids = appendUnique(value.signal_ids, publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase56z-repeat-measurement-accepted-operation");
  value.links = value.links.filter((link) => link.from !== "node-phase56z-repeat-measurement-accepted-operation");
  value.nodes.push({ id: "node-phase56z-repeat-measurement-accepted-operation", label: "Thirteen repeat or accepted-stage panels; four holds", node_type: "Signal", note: "Stable identities advance only when period, unit, method, denominator, and lifecycle stage remain explicit." });
  value.links.push(
    { from: "node-phase56z-repeat-measurement-accepted-operation", to: "node-phase56y-longitudinal-delivery-outcomes", relationship: "Depends On", confidence: "Supported", note: "Phase 56Z extends Phase 56Y identities into repeat observations, accepted operation, delivered inputs, and explicit holds." },
    { from: "node-phase56z-repeat-measurement-accepted-operation", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Authority bases, facility universes, periods, and stages can change between observations." },
    { from: "node-phase56z-repeat-measurement-accepted-operation", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Two points and agency assertions do not establish durable trend, ranking, generalized savings, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Thirteen bounded repeat or completed-stage panels plus four visible holds under explicit comparison contracts."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Later compatible periods, accepted service, sustained operation, closeout, and realized-outcome evidence under the same entity and denominator."]);
});

console.log(`Generated Phase 56Z: ${published.length} Published records, ${held.length} In Review holds, ${sources.length} new Tier 1 sources, and Research Watch 030.`);
