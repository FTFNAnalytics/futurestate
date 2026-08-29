import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-02";
const collectionSlug = "fixed-cohort-completion-realized-outcomes-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingId = "briefing-research-watch-031-fixed-cohort-completion-realized-outcomes";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => `  - ${JSON.stringify(item)}`)].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];

for (const path of ["sources", "research-documents", "signals", "research-collections", "briefings", "updates"].map((name) => join(contentRoot, name))) {
  await mkdir(path, { recursive: true });
}

const phase56z = JSON.parse(await readFile(join(dataRoot, "phase-56z-repeat-measurement-accepted-operation.json"), "utf8"));
if (phase56z.phase !== "56Z" || phase56z.records.length !== 17) throw new Error("Phase 57A requires the complete Phase 56Z ledger.");

const agencyMeta = {
  DOT: { entity: "agency-dot", topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { entity: "agency-ntia", topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { entity: "agency-doe", topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};

const sources = [
  {
    id: "source-57a-dot-fy2027-performance-plan-fy2025-report",
    name: "DOT FY 2027 Annual Performance Plan and FY 2025 Annual Performance Report",
    url: "https://www.transportation.gov/sites/dot.gov/files/2026-04/DOT_FY2027_Annual_Performance_Plan_and_FY2025_Report_508.pdf",
    owner: "U.S. Department of Transportation", agency: "DOT", access: "Data Download",
    limitation: "The report combines multiple system-level performance measures with different universes, methods, targets, and lags. A target result is not a causal evaluation, and measures cannot be ranked or combined into a readiness score.",
  },
  {
    id: "source-57a-wa-ecology-hanford-overview",
    name: "Washington State Department of Ecology Hanford overview",
    url: "https://ecology.wa.gov/waste-toxics/nuclear-waste/hanford-cleanup/hanford-overview",
    owner: "Washington State Department of Ecology", agency: "DOE", access: "Report Series",
    limitation: "The regulator overview reports selected site-level operating and cumulative milestones. It does not provide a complete throughput, downtime, residual-inventory, compliance, cost, or environmental-outcome series for every facility.",
  },
  {
    id: "source-57a-nnsa-w87-1-first-production-unit",
    name: "NNSA completes and diamond-stamps first W87-1 plutonium pit",
    url: "https://www.energy.gov/nnsa/articles/nnsa-completes-and-diamond-stamps-first-plutonium-pit-w87-1-warhead",
    owner: "National Nuclear Security Administration", agency: "DOE", access: "Release Page",
    limitation: "The release establishes one fully qualified and accepted first production unit. It does not establish a recurring production rate, annual capacity, program-wide schedule, lifecycle cost, or SRPPF output.",
  },
  {
    id: "source-57a-louisiana-bead-nepa-approvals",
    name: "Louisiana and NTIA process first BEAD NEPA approvals",
    url: "https://connect.la.gov/press-releases/louisiana-and-ntia-process-first-nepa-approvals-in-the-nation-clearing-path-for-bead-funded-construction",
    owner: "Louisiana Office of Broadband Development and Connectivity", agency: "NTIA", access: "Release Page",
    limitation: "The release reports environmental approvals for nearly 5,000 locations across 12 parishes and six providers. Construction follows a 30-day notice period, so the record does not establish construction, activation, tests, subscribers, adoption, or closeout.",
  },
  {
    id: "source-57a-montana-bead-disbursement-guide",
    name: "ConnectMT BEAD Disbursement Process Guide, version 2.0",
    url: "https://doa.mt.gov/_docs/connectmt/MT-BEAD-Disbursement-Process-Guide-3.26.pdf",
    owner: "Montana Department of Administration, ConnectMT", agency: "NTIA", access: "Data Download",
    limitation: "The guide defines milestone and subscriber-test requirements; it does not report any subgrantee's completed construction, activated locations, test results, accepted milestone, adoption, or closeout.",
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
    source_owner: source.owner, notes: `Phase 57A fixed-cohort completion and realized-outcome source. Collection: ${collectionSlug}.`,
  });
}

const dotSource = "source-57a-dot-fy2027-performance-plan-fy2025-report";
const specs = [
  {
    slug: "dot-nec-state-good-repair-backlog-fy2025", agency: "DOT", actionKey: "DOT-NEC-SGR-OUTCOME-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "Northeast Corridor state-of-good-repair backlog falls to $67.13 billion in FY 2025",
    finding: "DOT reports a $67.13 billion FY 2025 Northeast Corridor state-of-good-repair backlog against a $68.39 billion target and a $71.40 billion program baseline.",
    denominator: "The defined Northeast Corridor state-of-good-repair backlog, including 16 major backlog structures plus basic infrastructure scope, measured in nominal dollars under DOT's performance method.",
    limits: ["The measure is a remaining-backlog stock, not annual construction output.", "Meeting the target does not attribute the change to one program, grant, or project.", "The value does not establish passenger service, reliability, safety, or cost outcomes."],
    next: "Add later observations under the same backlog scope, price basis, revision history, and structure inventory, then pair them with accepted-project and service outcomes.",
  },
  {
    slug: "dot-transit-revenue-vehicle-backlog-fy2025", agency: "DOT", actionKey: "DOT-TRANSIT-VEHICLE-SGR-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "Transit revenue-vehicle backlog reaches 23.1 percent in FY 2025, above target",
    finding: "DOT reports 23.1 percent of transit revenue vehicles exceeding their useful-life benchmark in FY 2025, compared with a 22.0 percent target.",
    denominator: "Dedicated revenue vehicles reported through the National Transit Database; spare and non-dedicated vehicles are excluded under the stated method.",
    limits: ["The percentage is an asset-condition proxy, not a count of riders or service failures.", "A result above target does not identify the cause or the responsible agency or operator.", "Different vehicle mixes, ages, and reporting practices can affect the system-wide share."],
    next: "Track the same NTD vehicle universe, useful-life method, fleet composition, replacements, reliability, availability, and service delivered.",
  },
  {
    slug: "dot-interstate-pavement-condition-fy2025", agency: "DOT", actionKey: "DOT-INTERSTATE-PAVEMENT-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "Interstate pavement fair-or-better share reaches 99.1 percent in FY 2025",
    finding: "DOT reports 99.1 percent of Interstate pavement in fair or better condition in FY 2025, above the 95.0 percent target.",
    denominator: "The entire Interstate System evaluated in 0.1-mile Highway Performance Monitoring System sections using IRI, faulting, cracking, and rutting measures.",
    limits: ["The national share can mask state, corridor, lane, and traffic-load variation.", "Condition classification does not establish travel time, safety, emissions, or lifecycle cost.", "Meeting the target does not identify which investments caused the result."],
    next: "Preserve the same section universe and method while adding state and corridor distributions, traffic exposure, treatment history, safety, and lifecycle cost.",
  },
  {
    slug: "dot-nhs-bridge-deck-condition-fy2025", agency: "DOT", actionKey: "DOT-NHS-BRIDGE-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "National Highway System bridge-deck area fair-or-better share reaches 96 percent",
    finding: "DOT reports 96 percent of National Highway System bridge-deck area in fair or better condition in FY 2025, above the 95 percent target.",
    denominator: "National Highway System bridge-deck area classified under the federal bridge-condition method.",
    limits: ["Deck area weights large bridges more heavily than a bridge count.", "Fair-or-better classification does not establish load restriction, resilience, safety, or lifecycle cost.", "The national measure does not attribute condition to one funding program."],
    next: "Add later deck-area observations with method continuity, condition transitions, restrictions, project acceptance, traffic exposure, and lifecycle cost.",
  },
  {
    slug: "dot-aip-runway-condition-fy2025", agency: "DOT", actionKey: "DOT-AIP-RUNWAY-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "AIP-eligible paved runways in fair-or-better condition reach 97.3 percent",
    finding: "DOT reports 97.3 percent of Airport Improvement Program-eligible paved runways in fair or better condition in FY 2025, above the 93 percent target.",
    denominator: "Airport Improvement Program-eligible paved runways evaluated under FAA's runway-condition measure.",
    limits: ["Eligibility defines the cohort and excludes other runways.", "Pavement condition does not establish airport capacity, delay, safety, or project cost performance.", "The result does not identify a causal contribution from any specific grant."],
    next: "Track the same eligible runway cohort, inspection method, accepted rehabilitation projects, closures, capacity, delay, safety, and lifecycle cost.",
  },
  {
    slug: "dot-interstate-truck-travel-time-reliability-fy2025", agency: "DOT", actionKey: "DOT-TTTR-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "Interstate truck travel-time reliability index improves to 1.36 in FY 2025",
    finding: "DOT reports a 1.36 Interstate Truck Travel Time Reliability index in FY 2025, better than the 1.40 target; lower values indicate greater reliability.",
    denominator: "Interstate travel-time segments using the 95th-to-50th percentile truck travel-time ratio from National Performance Management Research Data Set probe observations, including roughly 700,000 freight vehicles.",
    limits: ["Probe coverage and sample composition can affect the index.", "A national ratio can mask route, time-of-day, commodity, and disruption variation.", "The movement does not establish which infrastructure or operating action caused the result."],
    next: "Preserve segment and probe methods while adding distribution, coverage, revision, corridor, disruption, intervention, and independent validation records.",
  },
  {
    slug: "dot-transit-rail-station-accessibility-fy2025", agency: "DOT", actionKey: "DOT-TRANSIT-STATION-ADA-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "Transit rail stations not accessible under ADA fall to 906 in FY 2025",
    finding: "DOT reports 906 transit rail stations not accessible under ADA in FY 2025, below the 945 target and the prior reported value of 928.",
    denominator: "Individual transit rail stations reported through the National Transit Database; the reporting method changed in reporting year 2025 to reduce possible double counting.",
    limits: ["The method change prevents treating the 22-station difference as a verified completion count.", "Station-level accessibility does not establish route, entrance, elevator, or trip-level usability.", "Meeting the target does not attribute change to a specific grant or operator."],
    next: "Rebuild a comparable station-level series across the method break and add accepted projects, accessible entrances, elevator availability, route coverage, and rider experience.",
  },
  {
    slug: "dot-amtrak-station-accessibility-fy2025", agency: "DOT", actionKey: "DOT-AMTRAK-STATION-ADA-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "Amtrak reports 77 sole-responsibility stations not ADA compliant in FY 2025",
    finding: "DOT reports 77 stations for which Amtrak has sole ADA responsibility were not compliant in FY 2025, above the target of 71, while ten stations were brought into full compliance during the year.",
    denominator: "The 147 stations for which Amtrak has sole ADA responsibility, with annual compliance status and ten reported FY 2025 completions.",
    limits: ["The sole-responsibility cohort excludes stations with other responsibility structures.", "Ten completions do not reconcile the full stock without additions, reclassifications, and prior-year status detail.", "Compliance status does not establish entrance, elevator, route, or trip-level reliability."],
    next: "Track the same 147-station responsibility cohort with additions, reclassifications, accepted projects, compliant features, outages, and rider-level usability.",
  },
  {
    slug: "dot-seaway-commercial-availability-fy2025", agency: "DOT", actionKey: "DOT-SEAWAY-AVAILABILITY-01", stage: "Fixed-cohort system outcome", status: "Published", publicationDate: "2026-04-30", sourceIds: [dotSource],
    title: "U.S. St. Lawrence Seaway commercial availability reaches 99.4 percent",
    finding: "DOT reports 99.4 percent commercial availability for the U.S. portion of the St. Lawrence Seaway in FY 2025, above the 99.0 percent target.",
    denominator: "Commercially scheduled operating time for the U.S. Seaway system under DOT's availability method; the FY 2021 through FY 2025 series is 99.6, 99.6, 98.7, 99.0, and 99.4 percent.",
    limits: ["Availability is not cargo throughput, wait time, safety, revenue, or asset condition.", "The five-point series does not identify the cause of annual movement.", "U.S. system availability is not the same as end-to-end Great Lakes–Seaway performance."],
    next: "Add downtime events, cause codes, maintenance, traffic, delay, safety, and end-to-end corridor performance under the same operating-time denominator.",
  },
  {
    slug: "hanford-law-facility-regulator-confirmed-operation", agency: "DOE", actionKey: "HANFORD-LAW-OPERATION-03", stage: "Independent operating acceptance", status: "Published", publicationDate: "2026-08-02", sourceIds: ["source-57a-wa-ecology-hanford-overview", "source-56x-hanford-vitrification-100k-2026"],
    title: "Washington Ecology confirms Hanford's Low-Activity Waste Facility is operating",
    finding: "Washington Ecology says the Low-Activity Waste Facility began operation in October 2025 and is treating underground tank waste, independently corroborating the operating stage reported by DOE.",
    denominator: "The named Low-Activity Waste Facility and its direct-feed low-activity-waste operating stage beginning in October 2025.",
    limits: ["The overview does not provide period throughput, downtime, quality, or compliance observations.", "Regulator-confirmed operation is not steady-state acceptance or mission completion.", "The High-Level Waste Facility remains a separate project under construction."],
    next: "Add regulator and operator periods for throughput, downtime, quality, permit compliance, residual inventory, and steady-state acceptance.",
  },
  {
    slug: "hanford-idf-regulator-confirmed-acceptance", agency: "DOE", actionKey: "HANFORD-IDF-ACCEPTANCE-02", stage: "Independent operating acceptance", status: "Published", publicationDate: "2026-08-02", sourceIds: ["source-57a-wa-ecology-hanford-overview", "source-56x-hanford-first-ilaw-disposal-2026"],
    title: "Washington Ecology confirms IDF began accepting vitrified waste in April 2026",
    finding: "Washington Ecology reports that the Integrated Disposal Facility began accepting vitrified low-activity waste in April 2026, corroborating the first permanent-disposal stage under state oversight.",
    denominator: "The Integrated Disposal Facility's two current disposal cells and accepted vitrified low-activity-waste stream beginning in April 2026.",
    limits: ["The overview supplies no accepted-container or volume series.", "Facility acceptance does not establish steady-state disposal, cell utilization, leachate performance, or final cleanup completion.", "About one million cubic meters is facility capacity, not disposed volume."],
    next: "Track accepted containers and volume, cell utilization, rejects, downtime, leachate, permit compliance, expansion, and residual mission demand.",
  },
  {
    slug: "hanford-groundwater-cumulative-treatment", agency: "DOE", actionKey: "HANFORD-GROUNDWATER-OUTCOME-01", stage: "Independent operating acceptance", status: "Published", publicationDate: "2026-08-02", sourceIds: ["source-57a-wa-ecology-hanford-overview"],
    title: "Hanford's six pump-and-treat facilities surpass 38 billion gallons treated",
    finding: "Washington Ecology reports that six Hanford groundwater pump-and-treat facilities have treated more than 38 billion gallons; the largest system can treat up to 2,500 gallons per minute.",
    denominator: "Cumulative gallons treated across six Hanford pump-and-treat facilities since operations began in the 1990s; capacity for the largest 200 West system is a separate denominator.",
    limits: ["Cumulative treated volume is not contaminant mass removed or aquifer restoration.", "The period spans multiple facilities, methods, contaminants, and decades.", "The planned 3,750-gallon-per-minute expansion is not treated as realized capacity."],
    next: "Add annual facility-level flow, uptime, contaminant mass removed, influent and effluent concentrations, plume extent, energy and cost, compliance, and expansion acceptance.",
  },
  {
    slug: "nnsa-w87-1-qualified-first-production-unit", agency: "DOE", actionKey: "NNSA-W87-1-FPU-01", stage: "Qualified production output", status: "Published", publicationDate: "2024-10-02", sourceIds: ["source-57a-nnsa-w87-1-first-production-unit"],
    title: "NNSA verifies the first fully qualified W87-1 plutonium pit",
    finding: "NNSA verified completion on October 1, 2024 of the W87-1 First Production Unit, which met requirements, received a diamond stamp, and reached war-reserve quality after an eight-year qualification, certification, and product-acceptance effort.",
    denominator: "One W87-1 First Production Unit manufactured at Los Alamos and accepted under the named qualification, certification, and product-acceptance process.",
    limits: ["One accepted unit does not establish repeat or rate production.", "The record does not attribute the unit to one LAP4 subproject or installed glovebox.", "The FPU does not establish 30-pits-per-year LANL capacity, 50-pits-per-year SRPPF capacity, or 80-pits-per-year enterprise capability."],
    next: "Track subsequent qualified and accepted units, production period, rejects and rework, equipment attribution, CD-4, recurring rate, capacity, schedule, and lifecycle cost.",
  },
  {
    slug: "louisiana-bead-nepa-preconstruction-hold", agency: "NTIA", actionKey: "LA-BEAD-SERVICE-HOLD-01", stage: "Pre-completion hold", status: "In Review", publicationDate: "2026-04-30", sourceIds: ["source-57a-louisiana-bead-nepa-approvals"],
    title: "Louisiana BEAD hold: NEPA approval clears a gate but does not establish construction",
    finding: "Louisiana reports NTIA environmental approvals for nearly 5,000 broadband-serviceable locations across 12 parishes and six providers, with construction to follow a 30-day community notice period.",
    denominator: "The nearly 5,000 approved BSLs across 12 named parishes and six internet-service providers included in the April 30 approval cohort.",
    limits: ["Environmental approval is a pre-construction authorization stage.", "The release reports no observed construction start or completed infrastructure.", "No activated locations, operational tests, subscribers, adoption, or closeout are established."],
    next: "Reopen for the same provider, parish, and BSL cohort when construction, as-builts, activation, test samples, subscriber use, adoption, and closeout are reported.",
  },
  {
    slug: "montana-bead-test-results-hold", agency: "NTIA", actionKey: "MT-BEAD-TEST-HOLD-01", stage: "Pre-completion hold", status: "In Review", publicationDate: "2026-03-01", sourceIds: ["source-57a-montana-bead-disbursement-guide"],
    title: "Montana BEAD hold: an accepted-service test contract exists before results",
    finding: "Montana's guide reserves 10 percent of non-LEO awards for Network Activation and Program Closeout and requires location lists, subscriber tests, and a final field inspection before final approval.",
    denominator: "Each subgrantee's stable BSL cohort at 20, 40, 60, 80, and 100 percent milestones, with active-subscriber samples capped at 10 percent or 50 subscribers under the guide.",
    limits: ["The guide is a protocol, not a reported project result.", "Required 100/20 Mbps BSL service, one-gigabit symmetrical CAI service, latency, reliability, and speed-test thresholds have not been observed here.", "No milestone acceptance, disbursement, adoption, or closeout is established."],
    next: "Reopen when ConnectMT publishes subgrantee, BSL cohort, activated locations, field inspection, test sample, speed, latency, reliability, acceptance, and closeout results.",
  },
  {
    slug: "nnsa-pit-production-program-baseline-hold", agency: "DOE", actionKey: "NNSA-PIT-BASELINE-HOLD-01", stage: "Program baseline hold", status: "In Review", publicationDate: "2026-04-01", sourceIds: ["source-56q-gao-23-104661-recommendation-status", "source-57a-nnsa-w87-1-first-production-unit"],
    title: "NNSA pit-production hold: one qualified unit does not close the program baseline",
    finding: "The W87-1 first production unit is qualified and accepted, while GAO's recommendation for a comprehensive lifecycle cost estimate aligned with best practices remains open and the enterprise schedule remains incomplete.",
    denominator: "The enterprise capability to establish and sustain at least 80 pits per year across Los Alamos and Savannah River, kept separate from the single accepted W87-1 unit.",
    limits: ["A qualified FPU is not recurring output or enterprise capacity.", "An agency forecast for a later cost estimate is not a completed GAO-accepted baseline.", "The record does not support a completion rate, schedule confidence, cost outcome, or readiness score."],
    next: "Reopen when NNSA publishes a comprehensive integrated schedule and lifecycle cost estimate, GAO records its sufficiency, and recurring accepted output is reported under a stable period and site denominator.",
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
    record_id: `record-57a-${spec.slug}`, document_id: `research-doc-57a-${spec.slug}`, signal_id: `signal-57a-${spec.slug}`,
    document_number: 606 + index, phase: "57A", action_key: spec.actionKey, agency: spec.agency, entity_id: meta.entity,
    record_type: "Fixed-cohort completion and realized-outcome panel", evidence_stage: spec.stage, title: spec.title,
    record_status: spec.status, source_id: spec.sourceIds[0], supporting_source_ids: spec.sourceIds,
    official_url: sourceById.get(spec.sourceIds[0])?.url, publication_date: spec.publicationDate,
    document_type: spec.stage === "Fixed-cohort system outcome" ? "Technical Report" : spec.stage.includes("hold") ? "Technical Report" : "Program Milestone",
    finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits, next_action: spec.next,
    exact_target_artifact_acquired: false, directive_scope_change: false, implementation_change: false, closure_change: false,
    contact_or_foia_submitted: false,
    authority_boundary: "Target attainment, authorization, construction, delivery, acceptance, operation, qualified output, recurring rate, realized outcome, closeout, implementation, and closure remain separate. No record supports a cross-system ranking, composite score, readiness score, generalized savings claim, or causal attribution.",
    captured_date: capturedDate,
  };
});

const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const evidenceStageCounts = Object.fromEntries([...new Set(records.map((record) => record.evidence_stage))].map((stage) => [stage, records.filter((record) => record.evidence_stage === stage).length]));

await writeJson(join(dataRoot, "phase-57a-fixed-cohort-completion-realized-outcomes.json"), {
  phase: "57A", captured_date: capturedDate,
  goal: "Build fixed-cohort completion, independently corroborated accepted-operation, qualified-output, and explicit pre-completion panels from the Phase 56Z handoff.",
  publication_rule: "Publish only when the entity, universe, lifecycle stage, period, unit, method, and denominator support a bounded completed or observed result; retain protocols, authorizations, forecasts, and incomplete baselines as explicit In Review holds.",
  authority_rule: "Target attainment is not causal evaluation; one accepted unit is not rate production; accepted operation is not closeout; system measures remain non-rankable.",
  records_reviewed: records.length, records_published: published.length, records_held: held.length,
  evidence_stage_counts: evidenceStageCounts, new_official_source_profiles: sources.length, carried_official_source_profiles: carriedIds.length,
  exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], closure_changes: [],
  prior_visible_scope: phase56z.post_batch_visible_scope, post_batch_visible_scope: phase56z.post_batch_visible_scope,
  post_batch_closure_counts: phase56z.post_batch_closure_counts, records,
});

await writeJson(join(dataRoot, "phase-57a-publication-review.json"), {
  phase: "57A", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id), exact_target_artifacts_acquired: 0,
  decision: "Thirteen records publish as bounded system outcomes, regulator-corroborated accepted operation, or one qualified production output. Three remain In Review because they are pre-construction, protocol-only, or lack a complete program baseline.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 605).padStart(2, "0")}-${record.record_id.replace(/^record-57a-/, "")}.txt`;
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  const firstSource = sourceById.get(record.source_id);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57a-${record.record_id.replace(/^record-57a-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""),
    record_status: record.record_status, publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date,
    document_type: record.document_type, summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record advances a stable cohort into an observed outcome, independently corroborated operation, or qualified output without inflating its lifecycle stage." : "The visible hold preserves a useful authorization, protocol, or program boundary without presenting it as completion or outcome evidence.",
    ftfn_relevance: ["Preserves entity, universe, stage, period, unit, method, and denominator.", "Separates target attainment, accepted operation, qualified output, recurring rate, outcome, closeout, implementation, and closure.", "Keeps exact-artifact checks non-blocking."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "GAO acceptance, implementation, closure, and entity evidence remain separate from this content expansion.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls,
    official_url: record.official_url, local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`,
    archive_member: `official-links/${archiveName}`, capture_status: "Official link record", captured_date: capturedDate,
  });

  const signal = `---\n+id: ${JSON.stringify(record.signal_id)}\n+title: ${JSON.stringify(record.title)}\n+slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}\n+record_status: ${JSON.stringify(record.record_status)}\n+summary: ${JSON.stringify(record.finding)}\n+${yamlList("source_ids", record.supporting_source_ids)}\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+primary_topic: ${JSON.stringify(meta.topics[0])}\n+${yamlList("framework_layers", meta.layers)}\n+signal_type: "Research Result"\n+maturity_level: "Infrastructure"\n+time_horizon: "Now"\n+evidence_quality: "Official Data"\n+verification_status: "Verified Against Primary Source"\n+why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}\n+${yamlList("dependencies", ["stable entity and cohort", "compatible lifecycle stage", "explicit period, unit, method, and denominator", "later repeat, acceptance, or outcome evidence"])}\n+${yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("receiving_systems", ["Phase 57A fixed-cohort completion and realized-outcome panels"])}\n+${yamlList("local_implications", ["Do not collapse target, authorization, construction, delivery, acceptance, operation, qualified output, recurring rate, outcome, closeout, implementation, and closure into one stage."])}\n+${yamlList("evidence_gap_ids", meta.gaps)}\n+claim_scope: "Specific Source Update"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the stated fixed-cohort evidence contract." : "Held until observed completion, accepted service, reported tests, or a complete program baseline is public.")}\n+---\n+\n+## Phase 57A panel\n+\n+${record.finding}\n+\n+## Evidence stage and denominator\n+\n+**${record.evidence_stage}.** ${record.denominator}\n+\n+## Evidence boundaries\n+\n+${record.evidence_limits.map((limit) => `- ${limit}`).join("\n")}\n+\n+Exact target artifact acquired: **No**. FTFN submitted no agency contact or FOIA request.\n+\n+Next action: ${record.next_action}\n+\n+## Authority boundary\n+\n+${record.authority_boundary}\n+`;
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal.replace(/^\+/gm, ""), "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Fixed-Cohort Completion and Realized Outcomes, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57A reviews sixteen DOT, BEAD, Hanford, and NNSA panels, publishing thirteen bounded results and retaining three explicit pre-completion or baseline holds.",
  scope: "Nine fixed-cohort DOT system outcomes, three regulator-corroborated Hanford operating records, one qualified NNSA output, two BEAD pre-completion holds, and one NNSA program-baseline hold.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The nineteen-file archive contains sixteen official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Entity, cohort, lifecycle stage, period, unit, method, denominator, revision history, acceptance, and outcome remain explicit. Target attainment is not causal evaluation, protocol is not result, and one qualified unit is not rate production.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = `---\n+id: ${JSON.stringify(briefingId)}\n+title: "Research Watch 031: Fixed-Cohort Completion and Realized Outcomes"\n+slug: "research-watch-031-fixed-cohort-completion-realized-outcomes"\n+record_status: "Published"\n+summary: "Phase 57A publishes thirteen fixed-cohort outcomes, independently corroborated operating records, and one qualified production output while holding three records at pre-completion or incomplete-baseline stages."\n+published_date: ${capturedDate}\n+captured_date: ${capturedDate}\n+${yamlList("signal_ids", signalIds)}\n+${yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"])}\n+claim_scope: "Editorial Synthesis"\n+local_evidence_level: "General Source Layer"\n+last_reviewed_date: ${capturedDate}\n+${yamlList("top_takeaways", ["DOT's FY 2025 report supplies nine bounded system outcomes with explicit cohorts, methods, and target results.", "Washington Ecology independently corroborates Hanford LAW operation, IDF waste acceptance, and cumulative groundwater treatment.", "NNSA's W87-1 first production unit is qualified and accepted, but one unit does not establish rate production or a complete program baseline."])}\n+${yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"])}\n+${yamlList("what_to_watch_next", ["Compatible DOT follow-up periods, revisions, accepted projects, and service outcomes", "BEAD construction, activation, subscriber tests, acceptance, adoption, and closeout", "Hanford facility-level throughput, downtime, contaminant removal, compliance, and residual inventory", "Recurring accepted W87-1 output, equipment attribution, integrated schedule, lifecycle cost, and GAO sufficiency"])}\n+---\n+\n+## What Phase 57A adds\n+\n+The batch reviews sixteen records and publishes thirteen. Nine DOT measures disclose a stable system cohort and FY 2025 result. Three Washington Ecology records add an independent regulator vantage on Hanford operation and accepted disposal. One NNSA record reaches a qualified, accepted production unit. Louisiana, Montana, and the NNSA program baseline remain explicit holds.\n+\n+## Fixed cohorts, not rankings\n+\n+Each DOT measure retains its own universe and method: backlog dollars, dedicated transit vehicles, pavement sections, bridge-deck area, eligible runways, truck probe ratios, station cohorts, and scheduled operating time are not interchangeable. Meeting or missing a target is reported without a score or causal claim.\n+\n+## Accepted operation and qualified output\n+\n+Washington Ecology confirms that Hanford's LAW Facility is operating, IDF is accepting vitrified waste, and six pump-and-treat facilities have processed more than 38 billion gallons. NNSA confirms one W87-1 FPU at war-reserve quality. These stages do not establish steady-state throughput, final cleanup, recurring production, annual capacity, or lifecycle cost.\n+\n+## Holds\n+\n+Louisiana's NEPA approvals precede construction. Montana defines activation and test acceptance but reports no results. GAO's NNSA lifecycle-cost recommendation remains open. These records are useful evidence contracts and reopening rules, not completed outcomes.\n+\n+## Evidence boundary\n+\n+No Phase 57A record changes directive scope, implementation, closure, or the one Closed / twenty-one Partially Closed / two Open entity ledger. No ranking, composite, readiness score, generalized savings claim, or unsupported causal inference is supported.\n+`;
await writeFile(join(contentRoot, "briefings", "research-watch-031-fixed-cohort-completion-realized-outcomes.mdx"), briefing.replace(/^\+/gm, ""), "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-02-phase-57a-fixed-cohort-completion-realized-outcomes.json"), {
  id: "update-2026-08-02-phase-57a-fixed-cohort-completion-realized-outcomes", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57A publishes thirteen fixed-cohort and accepted-outcome panels",
  summary: "Five new Tier 1 source profiles and three carried official sources support thirteen Published panels and three explicit In Review holds.",
  affected_record_ids: [collectionId, briefingId, ...signalIds],
  related_paths: [`/research/${collectionSlug}/`, "/briefings/research-watch-031-fixed-cohort-completion-realized-outcomes/", ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "No exact target artifact, directive-scope change, implementation change, closure change, agency contact, or FOIA request is recorded. Target, authorization, construction, acceptance, qualified output, recurring rate, outcome, closeout, implementation, and closure remain separate.",
  work_package: "docs/work-packages/phase-57a-fixed-cohort-completion-realized-outcomes.md",
});

const updateJson = async (path, mutate) => {
  const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value);
};
const newSourceIds = sources.map((source) => source.id);
await updateJson(join(contentRoot, "organizations", "org-us-department-energy.json"), (value) => {
  value.source_ids = appendUnique(value.source_ids, ["source-57a-wa-ecology-hanford-overview", "source-57a-nnsa-w87-1-first-production-unit"]);
});

for (const [file, selected, question] of [
  ["finance-and-risk.json", newSourceIds, "Which Phase 57A cohort next reports a compatible realized cost, service, reliability, or cleanup outcome?"],
  ["policy-and-standards.json", newSourceIds, "Which Phase 57A hold next closes with accepted construction, tests, recurring output, or a complete baseline?"],
  ["mobility.json", [dotSource], "Which DOT fixed cohort next adds a compatible period, revision trail, accepted project, and service outcome?"],
  ["chips-and-compute.json", ["source-57a-louisiana-bead-nepa-approvals", "source-57a-montana-bead-disbursement-guide"], "Which BEAD cohort next publishes construction, activation, subscriber tests, acceptance, adoption, and closeout?"],
  ["energy.json", ["source-57a-wa-ecology-hanford-overview", "source-57a-nnsa-w87-1-first-production-unit"], "Which Hanford or NNSA cohort next gains compatible throughput, acceptance, recurring output, cost, schedule, or closure evidence?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected); value.watch_questions = appendUnique(value.watch_questions, [question]);
  });
}

for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, newSourceIds],
  ["autonomy-regulation-to-service.json", publishedSignalIds.slice(0, 9), [dotSource]],
  ["energy-grid-capacity-to-service.json", publishedSignalIds.slice(9), ["source-57a-wa-ecology-hanford-overview", "source-57a-nnsa-w87-1-first-production-unit"]],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-57a-"));
    value.signal_ids = appendUnique(value.signal_ids, selectedSignals); value.source_ids = appendUnique(value.source_ids, selectedSources);
    value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]); value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57A fixed-cohort completion and realized-outcome panels");
    value.dependency_stack.push({ stage: "Phase 57A fixed-cohort completion and realized-outcome panels", current_state: "Thirteen Published panels and three In Review holds distinguish system outcomes, regulator-corroborated operation, qualified output, pre-completion gates, and incomplete baselines.", boundary: "Target attainment, authorization, construction, accepted operation, qualified output, recurring rate, realized outcome, closeout, implementation, and closure remain separate." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57A prohibits denominator-free comparison, target-based causal claims, stage inflation, cross-system rankings, composite scores, readiness scores, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["Compatible later periods, accepted projects and service, reported tests, recurring output, complete baselines, closeout, and realized outcomes under the same cohort contract."]);
  });
}

await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57A adds thirteen Published fixed-cohort, independently corroborated operating, or qualified-output panels and three explicit holds while cohort, method, denominator, acceptance, rate, closeout, and outcome remain separate.";
  value.signal_ids = value.signal_ids.filter((id) => !id.startsWith("signal-57a-"));
  value.source_ids = appendUnique(value.source_ids, newSourceIds); value.signal_ids = appendUnique(value.signal_ids, publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57a-fixed-cohort-completion-realized-outcomes");
  value.links = value.links.filter((link) => link.from !== "node-phase57a-fixed-cohort-completion-realized-outcomes");
  value.nodes.push({ id: "node-phase57a-fixed-cohort-completion-realized-outcomes", label: "Thirteen fixed-cohort or accepted-result panels; three holds", node_type: "Signal", note: "Stable cohorts advance only when stage, period, unit, method, denominator, and authority remain explicit." });
  value.links.push(
    { from: "node-phase57a-fixed-cohort-completion-realized-outcomes", to: "node-phase56z-repeat-measurement-accepted-operation", relationship: "Depends On", confidence: "Supported", note: "Phase 57A extends Phase 56Z panels into fixed system outcomes, regulator-corroborated operation, qualified output, and explicit holds." },
    { from: "node-phase57a-fixed-cohort-completion-realized-outcomes", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Backlog dollars, asset shares, deck area, probe ratios, station cohorts, operating time, treatment volume, and accepted units are non-interchangeable denominators." },
    { from: "node-phase57a-fixed-cohort-completion-realized-outcomes", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Target attainment, regulator corroboration, and a first production unit do not establish generalized causation, ranking, or enterprise readiness." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Thirteen bounded fixed-cohort, independently corroborated operating, or qualified-output panels plus three visible holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["Compatible later periods, accepted service and tests, facility-level operating series, recurring qualified output, complete cost and schedule baselines, closeout, and realized-outcome evidence."]);
});

console.log(`Generated Phase 57A: ${published.length} Published records, ${held.length} In Review holds, ${sources.length} new Tier 1 sources, and Research Watch 031.`);
