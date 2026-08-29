import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionId = "research-collection-longitudinal-operating-series-2020-2025";
const briefingId = "briefing-research-watch-005-longitudinal-operating-series";
const mapId = "dependency-map-comparative-outcomes-require-common-denominators";

const readJson = async (collection, file) =>
  JSON.parse(await readFile(join(contentRoot, collection, file), "utf8"));
const writeJson = async (value, collection, file) =>
  writeFile(join(contentRoot, collection, file), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];

const source = (slug) => `source-56a-${slug}`;
const signal = (slug) => `signal-56a-${slug}`;
const obsoleteSourceIds = new Set([
  source("census-asm-2022"),
  source("census-asm-2023"),
]);
const removeObsoleteSources = (items = []) => items.filter((id) => !obsoleteSourceIds.has(id));

const portfolios = {
  ai: {
    sources: [
      source("omb-fisma-fy2021"),
      source("omb-fisma-fy2022"),
      source("omb-fisma-fy2023"),
      source("gao-solarwinds-exchange-response-2022"),
      source("gao-federal-systems-high-risk-2023"),
      source("gao-cyber-high-risk-2024"),
      source("gao-fisma-effectiveness-fy2020"),
      source("gao-fisma-implementation-2022"),
      source("gao-fisma-effectiveness-fy2022"),
      source("nasa-ai-use-cases-2022"),
      source("nasa-ai-use-cases-2023"),
      source("nasa-ai-use-cases-2024"),
    ],
    signals: [
      signal("fisma-reporting"),
      signal("gao-cyber-backlog"),
      signal("fisma-effectiveness"),
      signal("nasa-ai-inventory"),
      signal("ai-cyber-cross-series-hold"),
    ],
    publishedSignals: [
      signal("fisma-reporting"),
      signal("gao-cyber-backlog"),
      signal("fisma-effectiveness"),
      signal("nasa-ai-inventory"),
    ],
  },
  manufacturing: {
    sources: [
      source("nist-mep-impact-fy2021"),
      source("nist-mep-impact-fy2022"),
      source("nist-mep-impact-fy2023"),
      source("manufacturing-usa-highlights-fy2020"),
      source("manufacturing-usa-highlights-fy2021"),
      source("manufacturing-usa-annual-fy2022"),
      source("niimbl-annual-2021-2022"),
      source("niimbl-annual-2022-2023"),
      source("niimbl-annual-2023-2024"),
      source("census-asm-2021"),
      source("census-asm-discontinuation"),
      source("census-aies-transition-2024"),
    ],
    signals: [
      signal("mep-national-impact"),
      signal("manufacturing-usa"),
      signal("niimbl-annual"),
      signal("census-asm"),
      signal("manufacturing-cross-series-hold"),
    ],
    publishedSignals: [
      signal("mep-national-impact"),
      signal("manufacturing-usa"),
      signal("niimbl-annual"),
      signal("census-asm"),
    ],
  },
  infrastructure: {
    sources: [
      source("eia-battery-capacity-2021"),
      source("eia-battery-capacity-2022"),
      source("eia-battery-capacity-2023"),
      source("eia-outage-duration-2021"),
      source("eia-outage-duration-2022"),
      source("eia-outage-duration-2023"),
      source("epa-water-reuse-year-two"),
      source("epa-water-reuse-year-three"),
      source("epa-water-reuse-year-four"),
      source("usgs-mcs-2023"),
      source("usgs-mcs-2024"),
      source("usgs-mcs-2025"),
    ],
    signals: [
      signal("eia-battery-capacity"),
      signal("eia-outage-duration"),
      signal("epa-water-reuse"),
      signal("usgs-mineral-production"),
      signal("infrastructure-cross-series-hold"),
    ],
    publishedSignals: [
      signal("eia-battery-capacity"),
      signal("eia-outage-duration"),
      signal("epa-water-reuse"),
      signal("usgs-mineral-production"),
    ],
  },
  mobility: {
    sources: [
      source("dot-atcr-2022"),
      source("dot-atcr-2023"),
      source("dot-atcr-2024"),
      source("california-av-testing-2021-2022"),
      source("california-av-testing-2022-2023"),
      source("california-av-testing-2023-2024"),
      source("faa-commercial-space-operations-fy2022"),
      source("faa-commercial-space-operations-fy2023"),
      source("faa-commercial-space-operations-fy2024"),
      source("president-aerospace-fy2021-2022"),
      source("president-aerospace-fy2023"),
      source("president-aerospace-fy2024"),
    ],
    signals: [
      signal("air-travel-consumer"),
      signal("california-av-miles"),
      signal("faa-commercial-space"),
      signal("president-aerospace-report"),
      signal("mobility-space-cross-series-hold"),
    ],
    publishedSignals: [
      signal("air-travel-consumer"),
      signal("california-av-miles"),
      signal("faa-commercial-space"),
      signal("president-aerospace-report"),
    ],
  },
};

const allSources = Object.values(portfolios).flatMap((portfolio) => portfolio.sources);
const allSignals = Object.values(portfolios).flatMap((portfolio) => portfolio.signals);
const allPublishedSignals = Object.values(portfolios).flatMap((portfolio) => portfolio.publishedSignals);

if (new Set(allSources).size !== 48 || new Set(allSignals).size !== 20 || new Set(allPublishedSignals).size !== 16) {
  throw new Error("Phase 56A integration matrix must resolve to 48 sources, 20 signals, and 16 Published signals.");
}

async function deepenPathway(file, update) {
  const pathway = await readJson("reader-pathways", file);
  pathway.summary = update.summary;
  pathway.current_state_summary = update.currentStateSummary;
  pathway.current_state = addUnique(pathway.current_state, update.currentState);
  pathway.source_ids = addUnique(removeObsoleteSources(pathway.source_ids), update.sources);
  pathway.signal_ids = addUnique(pathway.signal_ids, update.signals);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.dependency_map_ids = addUnique(pathway.dependency_map_ids, [mapId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.evidence_gap_ids = addUnique(pathway.evidence_gap_ids, ["gap-016", ...(update.gaps ?? [])]);
  pathway.dependency_stack = addUnique(
    pathway.dependency_stack.map((stage) => JSON.stringify(stage)),
    [JSON.stringify({
      stage: "Longitudinal operating series",
      current_state: update.stageState,
      boundary: update.stageBoundary,
    })],
  ).map((stage) => JSON.parse(stage));
  pathway.evidence_limits = addUnique(pathway.evidence_limits, update.limits);
  pathway.next_records = addUnique(pathway.next_records, update.nextRecords);
  await writeJson(pathway, "reader-pathways", file);
}

await deepenPathway("ai-infrastructure-policy-to-assurance.json", {
  summary: "Follow federal AI and cybersecurity policy into recurring inventories, control measurement, inspector-general effectiveness, incidents, remediation, and measured mission outcomes.",
  currentStateSummary: "Four new multi-period federal series distinguish FISMA reporting, GAO recommendation backlogs, inspector-general effectiveness, and NASA AI-use disclosure while keeping each measurement contract separate.",
  currentState: [
    "The FY 2021 through FY 2023 FISMA reports show recurring federal measurement with changing automation and scoring methods.",
    "Two compatible 23-agency inspector-general snapshots show that a majority of reviewed civilian programs remained below the effectiveness threshold in FY 2020 and FY 2022.",
    "NASA maintained annual public AI-use disclosure, but the inventories still lack stable mission-benefit and incident denominators.",
  ],
  sources: portfolios.ai.sources,
  signals: portfolios.ai.publishedSignals,
  gaps: ["gap-014"],
  stageState: "Sixteen AI and cybersecurity observations now form four recurring institutional series.",
  stageBoundary: "Recommendation inventories, effectiveness ratings, security measures, incidents, AI use cases, and mission outcomes are not interchangeable.",
  limits: [
    "Federal cyber metrics and automation rules changed across the reviewed reporting cycles.",
    "AI inventory continuity does not establish operational maturity, usage, reliability, safety, cost, or mission benefit.",
  ],
  nextRecords: [
    "Stable agency-level performance, incident, remediation, recovery, affected-person, and harm measures.",
    "System-level AI usage, accuracy, availability, override, impact-assessment, incident, cost, and mission-outcome records.",
  ],
});

await deepenPathway("policy-standards-to-implementation.json", {
  summary: "Follow policy and standards into repeat agency reporting, measured implementation, inspector-general assessment, operating outcomes, and revision-controlled evidence.",
  currentStateSummary: "Phase 56A adds recurring FISMA and federal AI reporting cycles and makes method changes, denominator changes, and series breaks visible implementation evidence.",
  currentState: [
    "Annual federal reports can be followed as series only when the covered agency set, metric definition, method, and revision history remain explicit.",
  ],
  sources: portfolios.ai.sources,
  signals: portfolios.ai.publishedSignals,
  gaps: ["gap-014"],
  stageState: "Recurring federal reporting now supplies multiple observations beyond one policy or one audit.",
  stageBoundary: "Reporting continuity is not equivalent to implementation effectiveness or operating benefit.",
  limits: [
    "Administrative reporting can change scope, metric design, maturity scale, automation, and publication location.",
  ],
  nextRecords: [
    "Stable implementation measures tied to system authorization, monitored operation, incidents, corrective actions, and verified outcomes.",
  ],
});

for (const file of [
  "advanced-manufacturing-workforce-to-operating-capacity.json",
  "advanced-manufacturing-research-to-production.json",
]) {
  await deepenPathway(file, {
    summary: "Follow manufacturing programs and establishments through recurring surveys, projects, workforce activity, production adoption, quality, throughput, productivity, and customer delivery.",
    currentStateSummary: "MEP client surveys, Manufacturing USA reports, NIIMBL reports, and Census establishment statistics now create four repeat measurement rails without equating program activity and sector outcomes.",
    currentState: [
      "MEP's FY 2021 and FY 2022 client surveys retain sales, savings, investment, and job measures with program attribution.",
      "Manufacturing USA and NIIMBL preserve recurring institute activity, while Census ASM provides an official establishment-level statistical rail.",
    ],
    sources: portfolios.manufacturing.sources,
    signals: portfolios.manufacturing.publishedSignals,
    gaps: ["gap-003"],
    stageState: "Twelve new observations form four recurring manufacturing series spanning client, institute, and establishment evidence.",
    stageBoundary: "Client attribution, institute activity, workforce engagement, facility output, and sector estimates retain separate units and denominators.",
    limits: [
      "Program respondent mix, follow-up periods, institute coverage, and activity definitions can change between reports.",
      "Nominal dollars, participant counts, project counts, jobs, quality, and productivity cannot be combined without a shared method.",
    ],
    nextRecords: [
      "Repeated facility quality, scrap, throughput, downtime, delivery, labor, customer, and productivity measures.",
      "Cohort completion, credential, placement, retention, wage, vacancy, and employer-result data with stable denominators.",
    ],
  });
}

await deepenPathway("energy-grid-capacity-to-service.json", {
  summary: "Follow capacity through commissioning, storage duration, dispatch, grid service, customer interruption, restoration, cost, and revision-controlled operating outcomes.",
  currentStateSummary: "EIA battery-capacity and outage-duration observations create separate multi-period capacity and customer-service rails, with major-event treatment preserved.",
  currentState: [
    "EIA reports utility-scale battery power capacity rising from 4,605 MW at the end of 2021 to 15,814 MW at the end of 2023.",
    "EIA's outage-duration series shows why major-event and non-major-event customer experience must remain separate.",
  ],
  sources: portfolios.infrastructure.sources.slice(0, 6),
  signals: [signal("eia-battery-capacity"), signal("eia-outage-duration")],
  gaps: ["gap-001", "gap-008"],
  stageState: "Two infrastructure series now separate installed storage power capacity from delivered customer reliability.",
  stageBoundary: "Power capacity is not energy duration, availability, dispatch, reliability contribution, restoration performance, or customer outcome.",
  limits: [
    "Observation dates, major-event treatment, survey revisions, and utility reporting coverage govern comparison.",
  ],
  nextRecords: [
    "Asset-level energy duration, availability, dispatch, failures, safety, revenue, and grid-service records.",
    "Utility- and customer-level interruption frequency, duration, restoration, cost, and weather-attribution records.",
  ],
});

await deepenPathway("industrial-water-agreement-to-reuse-operation.json", {
  summary: "Follow water governance into recurring project reporting, accepted capacity, metered reuse, quality, uptime, industrial delivery, compliance, and drought performance.",
  currentStateSummary: "EPA's year-two through year-four WRAP updates preserve a recurring implementation record while confirming the absence of a national operating-volume series.",
  currentState: [
    "Annual WRAP action reporting is now a visible policy series, but it cannot substitute for project acceptance, metered delivery, quality, or uptime.",
  ],
  sources: portfolios.infrastructure.sources.slice(6, 9),
  signals: [signal("epa-water-reuse")],
  gaps: ["gap-002"],
  stageState: "Three annual national reuse-progress observations are now linked to the operating evidence gap.",
  stageBoundary: "Action counts and milestones do not measure delivered reuse capacity or industrial water service.",
  limits: [
    "The national progress series lacks one stable metered-volume, end-use, quality, uptime, or industrial-delivery denominator.",
  ],
  nextRecords: [
    "Project-level accepted capacity, metered volume, end use, industrial allocation, quality, compliance, uptime, cost, and drought outcomes.",
  ],
});

await deepenPathway("critical-minerals-to-industrial-capacity.json", {
  summary: "Follow annual commodity statistics into mine output, processing, qualification, customers, inventory, recycling, price, disruption, and sustained industrial supply.",
  currentStateSummary: "The 2023 through 2025 USGS Mineral Commodity Summaries create a recurring official commodity rail while preserving physical quantity, nominal value, trade, and import-reliance differences.",
  currentState: [
    "USGS annual editions now support commodity-specific longitudinal reads without treating production value as physical or qualified supply.",
  ],
  sources: portfolios.infrastructure.sources.slice(9, 12),
  signals: [signal("usgs-mineral-production")],
  gaps: ["gap-007"],
  stageState: "Three annual commodity editions extend production, trade, and import-reliance evidence.",
  stageBoundary: "Nominal value is not physical output, refining capacity, qualified material, inventory, price resilience, or facility availability.",
  limits: [
    "Commodity definition changes, revisions, withheld data, price movement, and unit differences constrain trend claims.",
  ],
  nextRecords: [
    "Commodity- and facility-level mine, processing, refining, qualification, inventory, price, recycling, substitution, and disruption records.",
  ],
});

await deepenPathway("autonomy-regulation-to-service.json", {
  summary: "Follow AV authorization into recurring public-road exposure, passenger service, fleet utilization, accessibility, incidents, normalized safety, cost, and local outcomes.",
  currentStateSummary: "California DMV reporting now forms a three-period testing-exposure series that rises to 9.1 million miles and then contracts to 4.5 million, with permit-holder exits and mode mix attached.",
  currentState: [
    "The DMV series separates safety-driver and driverless public-road testing and retains the rule against cross-company capability rankings.",
  ],
  sources: portfolios.mobility.sources.slice(3, 6),
  signals: [signal("california-av-miles")],
  gaps: ["gap-015"],
  stageState: "Three reporting periods now show public-road test exposure before the 2025 reporting-rule break.",
  stageBoundary: "Testing miles are not passenger service, deployment scale, normalized safety, technological capability, or public value.",
  limits: [
    "Permit-holder entry and exit, private and out-of-state testing exclusions, mode mix, and reporting-rule changes alter the series.",
  ],
  nextRecords: [
    "Operator service trips, paid and deadhead miles, fleet, domain, wait time, accessibility, incidents, normalized safety, cost, and geography.",
  ],
});

await deepenPathway("space-coast-plan-to-mission.json", {
  summary: "Follow space plans through licensing, construction, annual operations, launch and reentry, mission result, anomalies, payload, closure duration, and local outcomes.",
  currentStateSummary: "FAA licensed-operation counts and annual federal aerospace reports now create separate national cadence and mission-activity rails.",
  currentState: [
    "FAA's consistent historical series rises from 74 licensed commercial space operations in FY 2022 to 148 in FY 2024.",
    "The President's aerospace reports retain agency activity and historical appendices but include a combined FY 2021-2022 series break.",
  ],
  sources: portfolios.mobility.sources.slice(6, 12),
  signals: [signal("faa-commercial-space"), signal("president-aerospace-report")],
  gaps: ["gap-013"],
  stageState: "National commercial-operation cadence and annual federal aerospace activity now have multi-period records.",
  stageBoundary: "National operations and narrative activities do not establish Space Coast utilization, mission success, safety, cost, or local benefit.",
  limits: [
    "Launch versus reentry, site, vehicle, mission outcome, anomaly, and local effects are absent from the headline operation count.",
    "A combined FY 2021-2022 report interrupts a simple annual aerospace activity line.",
  ],
  nextRecords: [
    "Operation-level launch, reentry, site, vehicle, license, mission result, anomaly, payload, closure, environmental, and local-utilization data.",
  ],
});

await deepenPathway("cross-corridor-authorization-to-operation.json", {
  summary: "Compare local authorization and operating transitions with national carrier, road-testing, launch, and mission-service series while keeping every system denominator separate.",
  currentStateSummary: "Carrier service, AV testing, commercial-space operations, and federal aerospace reports now provide national longitudinal context for bounded local corridors.",
  currentState: [
    "Four mobility and mission series supply context without converting national activity into local readiness or outcome claims.",
  ],
  sources: portfolios.mobility.sources,
  signals: portfolios.mobility.publishedSignals,
  gaps: ["gap-013", "gap-015"],
  stageState: "Twelve national mobility and mission observations provide separate service, exposure, operation, and activity rails.",
  stageBoundary: "Flights, cancellations, test miles, licensed operations, missions, and local utilization use different denominators.",
  limits: [
    "National series cannot establish a named corridor's readiness, service, safety, accessibility, cost, or local benefit.",
  ],
  nextRecords: [
    "Carrier-, operator-, site-, mission-, and local-system records with compatible exposure and outcome denominators.",
  ],
});

const topicSources = {
  "ai-for-science.json": portfolios.ai.sources.slice(9, 12),
  "cybersecurity.json": portfolios.ai.sources.slice(0, 9),
  "policy-and-standards.json": [...portfolios.ai.sources, ...portfolios.infrastructure.sources.slice(6, 9)],
  "advanced-manufacturing.json": portfolios.manufacturing.sources,
  "human-futures.json": portfolios.manufacturing.sources.slice(0, 9),
  "energy.json": portfolios.infrastructure.sources.slice(0, 6),
  "water.json": portfolios.infrastructure.sources.slice(6, 9),
  "critical-minerals.json": portfolios.infrastructure.sources.slice(9, 12),
  "aviation.json": portfolios.mobility.sources.slice(0, 3),
  "mobility.json": portfolios.mobility.sources.slice(3, 6),
  "space.json": portfolios.mobility.sources.slice(6, 12),
};

for (const [file, sources] of Object.entries(topicSources)) {
  const topic = await readJson("topics", file);
  topic.featured_sources = addUnique(removeObsoleteSources(topic.featured_sources), sources);
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which recurring measures retain a compatible unit, denominator, period, geography, method, attribution, and revision history?",
    "Where does a method change or series break require the longitudinal claim to stop?",
  ]);
  await writeJson(topic, "topics", file);
}

for (const gapFile of [
  "gap-001.json",
  "gap-002.json",
  "gap-003.json",
  "gap-007.json",
  "gap-008.json",
  "gap-013.json",
  "gap-014.json",
  "gap-015.json",
]) {
  const gap = await readJson("evidence-gaps", gapFile);
  gap.related_source_ids = addUnique(removeObsoleteSources(gap.related_source_ids), allSources);
  gap.related_signal_ids = addUnique(gap.related_signal_ids, allSignals);
  gap.candidate_records = addUnique(gap.candidate_records, [
    "next annual observation with unchanged method and denominator",
    "machine-readable revision history and data dictionary",
    "asset-, facility-, agency-, carrier-, operator-, or mission-level outcomes",
  ]);
  const phase56ANote = "Phase 56A adds multi-period official series; only domain-relevant observations should be used in a specific gap analysis.";
  if (!(gap.notes ?? "").includes(phase56ANote)) {
    gap.notes = `${gap.notes ?? ""} ${phase56ANote}`.trim();
  }
  await writeJson(gap, "evidence-gaps", gapFile);
}

const gap016 = await readJson("evidence-gaps", "gap-016.json");
gap016.current_support = "Phase 55Z established the comparison contract. Phase 56A adds 48 annual observations, sixteen Published within-domain series, and four held cross-series composites with revision and series-break treatment.";
gap016.missing_evidence = addUnique(gap016.missing_evidence, [
  "stable revision histories and vintage identifiers",
  "explicit series-break crosswalks",
  "three or more compatible observations for durable trend assessment",
]);
gap016.next_action = "Extend the sixteen named series with revised and later observations; stop any line when unit, denominator, period, geography, method, attribution, or series definition changes.";
gap016.related_source_ids = addUnique(removeObsoleteSources(gap016.related_source_ids), allSources);
gap016.related_signal_ids = addUnique(gap016.related_signal_ids, allSignals);
gap016.latest_review = {
  phase: "Phase 56A",
  decision: "Source Added",
  review_date: capturedDate,
  named_records: [
    "FISMA FY 2021 through FY 2023 reports",
    "NIST MEP FY 2021 through FY 2023 impact records",
    "EIA utility-scale battery capacity, 2021 through 2023",
    "FAA licensed commercial space operations, FY 2022 through FY 2024",
  ],
  stage_result: "Sixteen within-domain series now support bounded direction or reporting-continuity claims. Four cross-series composites remain held.",
  stop_rule: "Stop the longitudinal line at a unit, denominator, period, geography, method, attribution, revision, or series-definition break.",
};
gap016.notes = "Phase 56A operationalizes the comparison contract as sixteen named series; it still forbids cross-domain scores and rankings.";
await writeJson(gap016, "evidence-gaps", "gap-016.json");

const map = await readJson("dependency-maps", "comparative-outcomes-require-common-denominators.json");
map.summary = "A comparison protocol showing how operating observations become longitudinal series only after unit, denominator, period, geography, method, attribution, revisions, and series breaks align.";
map.interpretation_boundary = "The map governs within-domain longitudinal claims. It is not a score, ranking, forecast, or claim that different operating systems share one outcome direction.";
map.source_ids = addUnique(removeObsoleteSources(map.source_ids), allSources);
map.signal_ids = addUnique(map.signal_ids, allPublishedSignals);
map.nodes = addUnique(
  map.nodes.map((node) => JSON.stringify(node)),
  [
    JSON.stringify({ id: "node-timepoints", label: "Compatible time points", node_type: "Constraint", note: "At least two observations must share the measurement contract before direction is described." }),
    JSON.stringify({ id: "node-revisions", label: "Revisions and series breaks", node_type: "Constraint", note: "Vintages, method changes, combined years, and discontinued definitions remain first-class evidence." }),
    JSON.stringify({ id: "node-longitudinal", label: "Bounded longitudinal read", node_type: "Signal", record_id: signal("eia-battery-capacity"), note: "Direction is published inside one defined series without becoming a composite score." }),
  ],
).map((node) => JSON.parse(node));
map.links = addUnique(
  map.links.map((link) => JSON.stringify(link)),
  [
    JSON.stringify({ from: "node-longitudinal", to: "node-timepoints", relationship: "Depends On", confidence: "Supported", note: "Compatible observations permit a bounded direction statement." }),
    JSON.stringify({ from: "node-revisions", to: "node-longitudinal", relationship: "Constrained By", confidence: "Supported", note: "A material series break stops or restates the line." }),
    JSON.stringify({ from: "node-longitudinal", to: "node-gap", relationship: "Limited By", confidence: "Watch", note: "Longitudinal evidence remains within-domain and does not close cross-system comparability." }),
  ],
).map((link) => JSON.parse(link));
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A direction statement may publish after at least two compatible observations, with a two-point caveat.",
  "Revisions and method breaks can stop, split, or restate a longitudinal series.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "It does not turn a two-point movement into a durable trend.",
  "It does not authorize normalization across incompatible domains.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Later observations using unchanged definitions and denominators.",
  "Vintage, revision, and series-break metadata.",
]);
await writeJson(map, "dependency-maps", "comparative-outcomes-require-common-denominators.json");

const briefingPath = join(contentRoot, "briefings", "briefing-research-watch-004-comparative-operating-outcomes.mdx");
let briefing = await readFile(briefingPath, "utf8");
const marker = "## Phase 56A longitudinal extension";
if (!briefing.includes(marker)) {
  briefing = `${briefing.trim()}\n\n${marker}\n\nForty-eight annual observations now extend the comparison gate into sixteen named series. Direction is described only inside a compatible measurement contract, every two-point movement carries a caveat, and revisions or series breaks stop the line. Research Watch 005 contains the full longitudinal review; four cross-series composites remain held.\n`;
  await writeFile(briefingPath, briefing, "utf8");
}

console.log("Integrated Phase 56A across pathways, topics, gaps, the comparison map, and Research Watch 004.");
