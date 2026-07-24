import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const capturedDate = "2026-07-24";
const collectionId = "research-collection-comparative-operating-outcomes-2023-2026";
const briefingId = "briefing-research-watch-004-comparative-operating-outcomes";
const mapId = "dependency-map-comparative-outcomes-require-common-denominators";

const readJson = async (collection, file) =>
  JSON.parse(await readFile(join(contentRoot, collection, file), "utf8"));
const writeJson = async (value, collection, file) =>
  writeFile(join(contentRoot, collection, file), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];

const source = (slug) => `source-55z-${slug}`;
const signal = (slug) => `signal-${slug}`;

const aiSources = [
  source("gao-federal-generative-ai-use-2025"),
  source("gao-federal-ai-acquisitions-2026"),
  source("gao-irs-ai-management-2026"),
  source("gao-operational-ai-use-cases-2026"),
  source("nasa-ai-use-cases-2024"),
  source("gao-cdm-network-monitoring-2025"),
  source("gao-fisma-effectiveness-metrics-2024"),
  source("gao-federal-incident-response-2023"),
];
const aiPublishedSignals = [
  signal("federal-ai-inventories-nearly-doubled-2024"),
  signal("irs-ai-inventory-most-cases-not-yet-operational"),
  signal("federal-cdm-data-quality-requires-manual-correction"),
];
const aiSignals = [...aiPublishedSignals, signal("nasa-ai-use-cases-lack-comparable-outcome-measures")];

const manufacturingSources = [
  source("nist-mep-fy2024-network-results"),
  source("nist-mep-fy2024-client-challenges"),
  source("manufacturing-usa-report-to-congress-2025"),
  source("niimbl-annual-report-2023-2024"),
  source("mxd-future-factory-project-portfolio-2025"),
  source("iacmi-composites-operating-results-2025"),
  source("niimbl-door-to-floor-training-outcomes"),
  source("nist-amphenol-arizona-mep-results-2026"),
];
const manufacturingPublishedSignals = [
  signal("mep-fy2024-client-reported-manufacturing-outcomes"),
  signal("niimbl-biomanufacturing-program-delivers-47-graduates"),
  signal("arizona-mep-amphenol-reports-932k-savings"),
];
const manufacturingSignals = [
  ...manufacturingPublishedSignals,
  signal("manufacturing-usa-engagements-need-completion-denominators"),
];

const gridSources = [
  source("nerc-state-of-reliability-2025"),
  source("eia-us-outage-duration-2024"),
  source("eia-battery-capacity-2024"),
  source("eia-battery-storage-market-trends-2026"),
];
const gridSignals = [
  signal("us-customer-outage-duration-eleven-hours-2024"),
  signal("texas-batteries-provide-frequency-response-2024"),
];
const waterSources = [
  source("epa-water-reuse-action-plan-year-five"),
  source("epa-water-reuse-monitoring-practices-2024"),
];
const waterSignal = signal("water-reuse-year-five-lacks-national-operating-volume");
const mineralSources = [
  "source-usgs-mineral-commodity-summaries",
  source("usgs-mcs-2026-data-release"),
];
const mineralSignal = signal("us-mineral-production-and-import-reliance-2025");

const roadSources = [
  source("cpuc-av-quarterly-reporting-2026"),
  source("california-dmv-av-test-miles-2025"),
  "source-nhtsa-sgo-crash-reporting",
];
const roadSignals = [
  signal("california-av-testing-exceeds-nine-million-miles-2025"),
  signal("cpuc-av-reporting-needs-public-comparable-rollup"),
];
const aviationSources = [
  source("bts-air-travel-consumer-report-2024"),
  source("bts-airline-on-time-tables-2025"),
];
const spaceSources = [
  source("faa-one-thousand-commercial-space-operations-2025"),
  source("faa-fy2024-commercial-space-operations"),
  source("nasa-space-operations-outcomes-2025"),
];
const spaceSignal = signal("faa-reaches-one-thousand-commercial-space-operations");

async function deepenPathway(file, update) {
  const pathway = await readJson("reader-pathways", file);
  pathway.summary = update.summary;
  pathway.current_state_summary = update.currentStateSummary;
  pathway.current_state = addUnique(pathway.current_state, update.currentState);
  pathway.source_ids = addUnique(pathway.source_ids, update.sources);
  pathway.signal_ids = addUnique(pathway.signal_ids, update.publishedSignals);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.dependency_map_ids = addUnique(pathway.dependency_map_ids, [mapId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.evidence_gap_ids = addUnique(pathway.evidence_gap_ids, ["gap-016", ...(update.gaps ?? [])]);
  pathway.dependency_stack = [
    ...pathway.dependency_stack,
    {
      stage: update.stage,
      current_state: update.stageState,
      boundary: update.stageBoundary,
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, update.limits);
  pathway.next_records = addUnique(pathway.next_records, update.nextRecords);
  await writeJson(pathway, "reader-pathways", file);
}

await deepenPathway("ai-infrastructure-policy-to-assurance.json", {
  summary: "Follow federal AI policy, inventories, acquisitions, evaluation, agency operation, cybersecurity controls, measured benefits, incidents, and corrective actions.",
  currentStateSummary: "The pathway now connects NIST assurance methods to audited federal inventory growth, IRS maturity and data-quality findings, GAO operational examples, and federal cyber-monitoring results while preserving the gap to system-level benefits and incidents.",
  currentState: [
    "GAO found selected-agency AI inventories nearly doubled from 2023 to 2024, while the IRS inventory shows why active labels must remain separate from operational maturity.",
    "Federal cybersecurity audits add endpoint, event-logging, network-monitoring, and data-quality measures, but not a common security-outcome denominator.",
  ],
  sources: aiSources,
  publishedSignals: aiPublishedSignals,
  gaps: ["gap-014"],
  stage: "Institutional operation and outcomes",
  stageState: "GAO records disclose inventory growth, operational examples, maturity gaps, acquisition lessons, and cyber-program implementation results.",
  stageBoundary: "Use-case counts, tool deployment, and program maturity do not prove productivity, mission benefit, security effect, safety, or public value.",
  limits: [
    "Agency inventories use disclosure and maturity fields that do not replace usage, performance, incident, or benefit measures.",
    "Cybersecurity implementation measures cannot be ranked as equivalent risk or incident outcomes.",
  ],
  nextRecords: [
    "Agency- and system-level usage, accuracy, availability, human-override, cost, mission-benefit, impact-assessment, incident, and corrective-action records.",
    "Compatible KEV remediation, event-logging, detection, response, recovery, and harm measures with agency-size and risk context.",
  ],
});

await deepenPathway("advanced-manufacturing-workforce-to-operating-capacity.json", {
  summary: "Follow workforce programs and manufacturing interventions from engagement into completion, placement, retention, quality, throughput, productivity, savings, and customer delivery.",
  currentStateSummary: "The pathway now contains a large MEP client-outcome survey, institute activity and training records, one 47-graduate program, and a Mesa facility-level quality and savings result.",
  currentState: [
    "MEP's FY 2024 survey supplies client-attributed sales, savings, investment, and job outcomes with a disclosed response base.",
    "A NIIMBL program reaches completion for 47 trainees, and an Arizona MEP record reaches a defined facility intervention and attributed savings.",
    "Manufacturing USA engagement totals remain held because participation, completion, placement, and productivity lack common denominators.",
  ],
  sources: manufacturingSources,
  publishedSignals: manufacturingPublishedSignals,
  gaps: ["gap-003"],
  stage: "Completion and operating outcome",
  stageState: "Named records now include training completion, a defined facility quality intervention, and client-attributed economic outcomes.",
  stageBoundary: "Client attribution is not audited causality; engagement is not completion; completion is not placement; one facility is not regional capacity.",
  limits: [
    "Jobs, dollars, participants, graduates, projects, products, quality, and productivity remain separate outcome units.",
    "Institute and MEP records require explicit self-reporting, survey, cohort, and follow-up labels.",
  ],
  nextRecords: [
    "Program-level completion, credential, placement, retention, wage, vacancy, and employer-performance records with denominators.",
    "Facility quality, scrap, throughput, downtime, delivery, customer, and productivity measures with repeat periods and independent validation.",
  ],
});

await deepenPathway("energy-grid-capacity-to-service.json", {
  summary: "Follow forecasts, capacity, tariffs, interconnection, construction, energization, storage services, delivered reliability, and customer outcomes.",
  currentStateSummary: "The pathway now joins project and customer-service evidence to national outage duration and NERC's initial operating evidence that Texas batteries provide material frequency-response service.",
  currentState: [
    "EIA reports 11 hours of average customer interruption in 2024, with major events responsible for 80 percent of the duration.",
    "NERC reports Texas batteries supplied up to all frequency-regulation capacity in several 2024 instances and more than 70 percent of response in individual disturbances.",
  ],
  sources: gridSources,
  publishedSignals: gridSignals,
  gaps: ["gap-001", "gap-008"],
  stage: "Delivered service and reliability",
  stageState: "The pathway now contains customer interruption duration and measured battery frequency-response contributions in addition to capacity and project records.",
  stageBoundary: "National outage averages and Texas bulk-power results cannot establish another utility's customer reliability or spare capacity.",
  limits: [
    "Battery power capacity, energy duration, dispatch, availability, frequency response, and customer reliability are different measures.",
    "Bulk-power performance and distribution customer outcomes remain separate system layers.",
  ],
  nextRecords: [
    "Utility- and customer-specific reliability, restoration, interconnection, consumption, curtailment, cost, and service-quality records.",
    "Storage duration, availability, state-of-charge, dispatch, market, failure, safety, and long-run reliability records by asset and region.",
  ],
});

await deepenPathway("critical-minerals-to-industrial-capacity.json", {
  summary: "Follow commodity production, trade, import reliance, awards, construction, processing, qualification, customers, recycling, and sustained industrial output.",
  currentStateSummary: "The pathway now includes the machine-readable 2025 commodity baseline and separates increased U.S. production value from persistent critical-mineral import reliance.",
  currentState: [
    "USGS reports $112 billion in U.S. nonfuel mineral production in 2025 while China remained a major source for 14 of the 33 critical minerals on which the United States was most import reliant.",
    "The data release enables commodity-specific analysis but does not disclose facility availability or customer qualification.",
  ],
  sources: mineralSources,
  publishedSignals: [mineralSignal],
  gaps: ["gap-007"],
  stage: "Commodity operating baseline",
  stageState: "USGS now supplies current production-value, trade, and import-reliance data with commodity-level files and definitions.",
  stageBoundary: "Production value is not physical output, refining capacity, qualified material, inventory, price resilience, or facility-level supply security.",
  limits: [
    "Commodity values, physical quantities, trade shares, prices, reserves, and import reliance must retain their original units.",
    "Withheld production data and changing commodity definitions limit some comparisons.",
  ],
  nextRecords: [
    "Commodity- and facility-level mine, processing, refining, qualification, customer, inventory, price, recycling, substitution, and disruption records.",
  ],
});

await deepenPathway("industrial-water-agreement-to-reuse-operation.json", {
  summary: "Follow water governance, agreements, construction, acceptance, monitoring, metered reuse, quality, uptime, industrial allocation, compliance, and drought performance.",
  currentStateSummary: "The pathway combines Phoenix and Chandler project evidence with EPA's national reuse progress and completed monitoring-practices rail, while a comparable national operating-volume denominator remains absent.",
  currentState: [
    "EPA's year-five progress and completed monitoring-practices records create a national measurement rail without reporting one compatible metered reuse volume or industrial-delivery outcome.",
  ],
  sources: waterSources,
  publishedSignals: [],
  gaps: ["gap-002"],
  stage: "Comparable water-reuse outcomes",
  stageState: "National program outputs now identify monitoring practices and completed actions, while Phoenix and Chandler retain project- and system-specific evidence.",
  stageBoundary: "Action completion and monitoring guidance are not completed infrastructure, metered reuse, delivered industrial allocation, or sustained compliance.",
  limits: [
    "National progress outputs, municipal system volumes, design capacity, and facility water balances cannot be treated as equivalent.",
  ],
  nextRecords: [
    "Compatible project-level accepted capacity, metered reuse, quality, uptime, industrial allocation, compliance, discharge, and drought-performance records.",
  ],
});

await deepenPathway("autonomy-regulation-to-service.json", {
  summary: "Follow road and aviation autonomy from rules and testing into paid service, exposure-normalized safety, accessibility, cost, reliability, and operating outcomes.",
  currentStateSummary: "The road pathway now includes more than nine million California test miles for the 2025 reporting year, NHTSA's current incident-data boundary, and CPUC's detailed passenger-service reporting fields.",
  currentState: [
    "California DMV reports more than nine million test miles for December 2024 through November 2025.",
    "NHTSA's current files explain why incident totals cannot be compared without fleet, mileage, operating-domain, and reporting context.",
    "CPUC defines the trip, passenger-mile, deadhead, wait, accessibility, energy, and geography fields needed for the next operating-outcome pass.",
  ],
  sources: roadSources,
  publishedSignals: [roadSignals[0]],
  gaps: ["gap-015"],
  stage: "Comparable passenger-service outcomes",
  stageState: "Testing exposure and reporting definitions are available, but a current comparable public passenger-service rollup remains incomplete.",
  stageBoundary: "Testing miles are not trips; raw incident counts are not safety rates; reporting requirements are not reported outcomes.",
  limits: [
    "Operator, program, geography, fleet, service, testing, incident, and time-period differences block simple rankings.",
  ],
  nextRecords: [
    "Public CPUC operator-level trips, paid and deadhead miles, fleet, wait time, accessibility, energy, incident, cost, and service-geography data.",
    "Compatible exposure-normalized NHTSA, DMV, local, and carrier safety and service measures.",
  ],
});

await deepenPathway("space-coast-plan-to-mission.json", {
  summary: "Follow Space Coast plans, site and operator licenses, construction, acceptance, national operating cadence, missions, anomalies, utilization, resilience, and local outcomes.",
  currentStateSummary: "The pathway now adds national FAA operating cadence and NASA station-logistics outcomes as comparators while keeping Space Coast site, mission, utilization, and local-result gates separate.",
  currentState: [
    "FAA reached 1,000 licensed or permitted commercial space operations in August 2025 after a record 148 operations in fiscal year 2024.",
    "NASA reports 12 visiting spacecraft and seven cargo missions delivering more than 50,000 pounds to the station in 2025.",
  ],
  sources: spaceSources,
  publishedSignals: [spaceSignal],
  gaps: ["gap-013"],
  stage: "National operating comparator",
  stageState: "FAA cadence and NASA mission-logistics records show real operation beyond plans and site decisions.",
  stageBoundary: "National operation and station-logistics totals do not establish a named Space Coast site's license, utilization, mission success, safety rate, cost, or local benefit.",
  limits: [
    "Launch, reentry, mission, spacecraft, cargo, research, anomaly, and local-outcome measures remain distinct.",
  ],
  nextRecords: [
    "Space Coast site- and operator-level launch, reentry, mission, anomaly, delay, utilization, infrastructure, environmental, workforce, and local-outcome records.",
  ],
});

const crossCorridor = await readJson("reader-pathways", "cross-corridor-authorization-to-operation.json");
crossCorridor.current_state_summary = "The corridor dossiers now sit beside national mineral and commercial-space operating baselines, making the remaining Nevada qualification and Florida site-utilization gaps more explicit.";
crossCorridor.current_state = addUnique(crossCorridor.current_state, [
  "USGS 2025 commodity data and FAA national operation counts provide operating comparators without resolving named Nevada or Florida project outcomes.",
]);
crossCorridor.source_ids = addUnique(crossCorridor.source_ids, [...mineralSources, ...spaceSources]);
crossCorridor.signal_ids = addUnique(crossCorridor.signal_ids, [mineralSignal, spaceSignal]);
crossCorridor.briefing_ids = addUnique(crossCorridor.briefing_ids, [briefingId]);
crossCorridor.dependency_map_ids = addUnique(crossCorridor.dependency_map_ids, [mapId]);
crossCorridor.research_collection_ids = addUnique(crossCorridor.research_collection_ids, [collectionId]);
crossCorridor.evidence_gap_ids = addUnique(crossCorridor.evidence_gap_ids, ["gap-016"]);
crossCorridor.evidence_limits = addUnique(crossCorridor.evidence_limits, [
  "National commodity and commercial-space operating baselines do not close project-level construction, qualification, mission, utilization, or local-outcome gates.",
]);
await writeJson(crossCorridor, "reader-pathways", "cross-corridor-authorization-to-operation.json");

const topicUpdates = [
  ["ai-for-science.json", aiSources, "Which operational AI systems disclose usage, accuracy, availability, cost, incident, human-override, corrective-action, and mission-benefit measures?"],
  ["cybersecurity.json", aiSources, "Which agencies disclose compatible remediation, detection, response, recovery, incident, and harm measures with risk and scale context?"],
  ["advanced-manufacturing.json", manufacturingSources, "Which programs connect engagement to completion, credential, placement, retention, quality, throughput, productivity, and customer delivery?"],
  ["human-futures.json", manufacturingSources, "Which workforce records include denominators, follow-up periods, placement, retention, wages, accessibility, and employer outcomes?"],
  ["energy.json", gridSources, "Which assets connect installed capacity to availability, dispatch, frequency response, customer reliability, restoration, and cost?"],
  ["water.json", waterSources, "Which reuse systems report accepted capacity, metered volume, quality, uptime, industrial allocation, compliance, and drought performance?"],
  ["critical-minerals.json", mineralSources, "Which commodity and facility records connect production, trade, refining, qualification, inventory, price, recycling, and disruption?"],
  ["mobility.json", roadSources, "Which public datasets align trips, paid and deadhead miles, fleet, domain, incidents, accessibility, wait, cost, and service geography?"],
  ["aviation.json", aviationSources, "Which carrier and airport measures preserve flight, passenger, accessibility, weather, schedule, and service denominators?"],
  ["space.json", spaceSources, "Which launch and reentry records align operation type, site, vehicle, mission result, anomaly, delay, cargo, utilization, and local outcomes?"],
  ["policy-and-standards.json", [...aiSources, ...manufacturingSources, ...gridSources, ...waterSources, ...mineralSources, ...roadSources, ...aviationSources, ...spaceSources], "Where do reporting definitions permit a defensible comparison, and where do unit, denominator, period, geography, method, or attribution block it?"],
];
for (const [file, sources, watchQuestion] of topicUpdates) {
  const topic = await readJson("topics", file);
  topic.featured_sources = addUnique(topic.featured_sources, sources);
  topic.watch_questions = addUnique(topic.watch_questions, [watchQuestion]);
  await writeJson(topic, "topics", file);
}

const gap014 = await readJson("evidence-gaps", "gap-014.json");
gap014.current_support = "FTFN now combines NIST assurance methods with GAO's 11-agency inventory analysis, IRS maturity and data-quality findings, GAO operational use cases, federal AI acquisition oversight, NASA active-use examples, and federal cyber-program implementation results.";
gap014.related_source_ids = addUnique(gap014.related_source_ids, aiSources);
gap014.related_signal_ids = addUnique(gap014.related_signal_ids, aiSignals);
gap014.next_action = "Follow agency inventories and audits into named system usage, impact assessment, authorization, performance, incident, corrective-action, cost, mission-benefit, and retirement records.";
gap014.latest_review = {
  phase: "Phase 55Z",
  decision: "Source Added",
  review_date: capturedDate,
  named_records: [
    "GAO Generative AI Use and Management at Federal Agencies",
    "GAO IRS AI Skills, Information Quality, and Strategic Management",
    "GAO Continuous Diagnostics and Mitigation Network Monitoring",
    "NASA 2024 AI Use Cases",
  ],
  stage_result: "The evidence now reaches inventory growth, operational examples, maturity gaps, acquisition oversight, and cyber-program implementation. Comparable system-level benefits and incidents remain incomplete.",
  stop_rule: "Do not treat inventory growth, active-use labels, acquisition, or cybersecurity-tool deployment as measured mission benefit or assurance.",
};
await writeJson(gap014, "evidence-gaps", "gap-014.json");

const gap003 = await readJson("evidence-gaps", "gap-003.json");
gap003.current_support = "FTFN now has operating training assets, MEP client-outcome survey data, Manufacturing USA and institute portfolios, one 47-graduate biomanufacturing program, and a Mesa facility quality and savings result.";
gap003.related_source_ids = addUnique(gap003.related_source_ids, manufacturingSources);
gap003.related_signal_ids = addUnique(gap003.related_signal_ids, manufacturingSignals);
gap003.next_action = "Follow engagement and completion records into credential, placement, retention, wage, vacancy, quality, throughput, customer-delivery, and productivity outcomes with compatible denominators.";
gap003.latest_review = {
  phase: "Phase 55Z",
  decision: "Source Added",
  review_date: capturedDate,
  named_records: [
    "NIST MEP National Network FY 2024 Results",
    "2025 Manufacturing USA Report to Congress",
    "NIIMBL Door-to-Floor Biomanufacturing Training Outcomes",
    "NIST Arizona MEP Amphenol Aerospace Results",
  ],
  stage_result: "The workforce trail now includes survey-attributed outcomes, a named completion result, and a facility intervention. Common placement, retention, wage, vacancy, and productivity denominators remain incomplete.",
  stop_rule: "Do not equate engagement with completion, completion with placement, attributed savings with audited causality, or one facility with regional workforce sufficiency.",
};
await writeJson(gap003, "evidence-gaps", "gap-003.json");

for (const [file, sources, signals, support, note] of [
  [
    "gap-001.json",
    gridSources,
    gridSignals,
    "FTFN now adds national customer interruption duration and NERC operating evidence for battery frequency-response service to the existing Southwest capacity and service trail.",
    "Phase 55Z deepens operating comparators without resolving customer-specific Southwest capacity, energization, consumption, reliability, or price.",
  ],
  [
    "gap-002.json",
    waterSources,
    [waterSignal],
    "FTFN now adds EPA's year-five national reuse progress and completed monitoring-practices rail to the Phoenix and Chandler project evidence.",
    "Phase 55Z preserves the September 22 dated project check and does not substitute national action outputs for Phoenix or TSMC operating reuse.",
  ],
  [
    "gap-007.json",
    mineralSources,
    [mineralSignal],
    "FTFN now has the USGS 2026 report and machine-readable 2025 production, trade, and import-reliance baseline alongside named award and project trails.",
    "Phase 55Z adds current commodity outcomes without claiming facility-level supply security or qualified output.",
  ],
  [
    "gap-013.json",
    spaceSources,
    [spaceSignal],
    "FTFN now adds FAA cumulative and annual commercial-space operations plus NASA 2025 station logistics as national operating comparators.",
    "Phase 55Z preserves the dated Space Coast license check and does not convert national cadence into site-specific authorization, utilization, or local outcomes.",
  ],
  [
    "gap-015.json",
    roadSources,
    roadSignals,
    "FTFN now has more than nine million California test miles for the 2025 reporting year, NHTSA's current incident-data limits, and CPUC's detailed passenger-service reporting fields.",
    "Phase 55Z advances exposure and measurement rails while keeping comparative safety and public passenger-service outcomes open.",
  ],
]) {
  const gap = await readJson("evidence-gaps", file);
  gap.current_support = support;
  gap.related_source_ids = addUnique(gap.related_source_ids, sources);
  gap.related_signal_ids = addUnique(gap.related_signal_ids, signals);
  gap.notes = note;
  await writeJson(gap, "evidence-gaps", file);
}

console.log("Integrated Phase 55Z across eight pathways, eleven topics, seven existing evidence gaps, and the cross-portfolio comparison layer.");
