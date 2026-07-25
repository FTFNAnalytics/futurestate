import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const collectionId = "research-collection-entity-operating-panels-2021-2026";
const briefingId = "briefing-research-watch-006-entity-operating-panels";
const mapId = "dependency-map-comparative-outcomes-require-common-denominators";

const readJson = async (collection, file) =>
  JSON.parse(await readFile(join(contentRoot, collection, file), "utf8"));
const writeJson = async (value, collection, file) =>
  writeFile(join(contentRoot, collection, file), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];

const source = (slug) => `source-56b-${slug}`;
const signal = (slug) => `signal-56b-${slug}`;

const portfolios = {
  ai: {
    sources: [
      source("nasa-fisma-fy2022"),
      source("nasa-fisma-fy2023"),
      source("nasa-fisma-fy2024"),
      source("dhs-fisma-fy2021"),
      source("dhs-fisma-fy2022"),
      source("dhs-fisma-fy2023"),
      source("hhs-fisma-fy2022"),
      source("hhs-fisma-fy2023"),
      source("hhs-fisma-fy2024"),
    ],
    signals: [
      signal("nasa-fisma-panel"),
      signal("dhs-fisma-panel"),
      signal("hhs-fisma-panel"),
    ],
  },
  manufacturing: {
    sources: [
      source("nist-mep-current-applications-lean"),
      source("nist-mep-island-components-lean"),
      source("nist-mep-monaghan-medical-lean"),
    ],
    signals: [
      signal("current-applications-output-panel"),
      signal("island-components-output-panel"),
      signal("monaghan-medical-output-panel"),
    ],
  },
  infrastructure: {
    sources: [source("eia860-2021"), source("eia860-2022"), source("eia860-2023")],
    signals: [
      signal("moss-landing-capacity-panel"),
      signal("manatee-capacity-panel"),
      signal("gateway-capacity-panel"),
    ],
  },
  mobility: {
    sources: [source("bts-atcr-full-year-2024"), source("dot-atcr-february-2026")],
    signals: [
      signal("united-cancellation-panel"),
      signal("southwest-cancellation-panel"),
      signal("delta-cancellation-panel"),
    ],
  },
};

async function deepenPathway(file, update) {
  const pathway = await readJson("reader-pathways", file);
  pathway.summary = update.summary;
  pathway.current_state_summary = update.currentStateSummary;
  pathway.current_state = addUnique(pathway.current_state, update.currentState);
  pathway.source_ids = addUnique(pathway.source_ids, update.sources);
  pathway.signal_ids = addUnique(pathway.signal_ids, update.signals);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.dependency_map_ids = addUnique(pathway.dependency_map_ids, [mapId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.evidence_gap_ids = addUnique(pathway.evidence_gap_ids, ["gap-016", ...(update.gaps ?? [])]);
  pathway.dependency_stack = addUnique(
    pathway.dependency_stack.map((stage) => JSON.stringify(stage)),
    [JSON.stringify({
      stage: "Named entity operating panel",
      current_state: update.stageState,
      boundary: update.stageBoundary,
    })],
  ).map((stage) => JSON.parse(stage));
  pathway.evidence_limits = addUnique(pathway.evidence_limits, update.limits);
  pathway.next_records = addUnique(pathway.next_records, update.nextRecords);
  await writeJson(pathway, "reader-pathways", file);
}

for (const file of ["ai-infrastructure-policy-to-assurance.json", "policy-standards-to-implementation.json"]) {
  await deepenPathway(file, {
    summary: "Follow federal policy into recurring agency control measurement, named FISMA panels, tested systems, incidents, corrective actions, recovery, and mission outcomes.",
    currentStateSummary: "NASA, DHS, and HHS now have named multi-year FISMA panels, with annual metric, scope, sampling, and component boundaries kept visible.",
    currentState: [
      "NASA remained at Level 3 across FY 2022-FY 2024, DHS moved from ineffective in FY 2021 to effective in FY 2022 and FY 2023, and HHS remained Not Effective across FY 2022-FY 2024.",
      "The three agency sequences remain separate and do not support a cross-agency rank.",
    ],
    sources: portfolios.ai.sources,
    signals: portfolios.ai.signals,
    gaps: ["gap-014"],
    stageState: "Nine inspector-general records support three stable agency-level control panels.",
    stageBoundary: "Agency maturity and effectiveness labels do not share identical scope, sampling, metric design, system risk, incident exposure, or mission consequence.",
    limits: [
      "Annual FISMA metrics, tested systems, evaluator scope, component coverage, and calculated-rating methods can change.",
      "An agency-level rating does not establish system-level control operation, incident reduction, service continuity, or mission benefit.",
    ],
    nextRecords: [
      "Later agency and component ratings with explicit metric changes and tested-system coverage.",
      "Control operation, authorization age, remediation, incidents, recovery, affected services, and mission-outcome records.",
    ],
  });
}

for (const file of [
  "advanced-manufacturing-workforce-to-operating-capacity.json",
  "advanced-manufacturing-research-to-production.json",
]) {
  await deepenPathway(file, {
    summary: "Follow manufacturing programs into named facility interventions, repeat output, labor, quality, cost, delivery, demand, and independently validated production outcomes.",
    currentStateSummary: "Current Applications, Island Components, and Monaghan Medical now have named before-and-after output panels, with company and MEP attribution kept explicit.",
    currentState: [
      "Three NIST MEP case studies expose compatible before-and-after units within each named line or facility.",
      "Product, labor, quality, cost, demand, follow-up, and attribution differences stop any cross-manufacturer ranking.",
    ],
    sources: portfolios.manufacturing.sources,
    signals: portfolios.manufacturing.signals,
    gaps: ["gap-003"],
    stageState: "Three named manufacturers now have explicit baseline and post-intervention output observations.",
    stageBoundary: "Company- and program-attributed case studies are not audited causal effects, sector benchmarks, or durable productivity trends.",
    limits: [
      "The case studies do not expose a common observation window, product mix, labor input, quality, cost, demand, or follow-up denominator.",
    ],
    nextRecords: [
      "Repeat facility output, labor hours, first-pass yield, scrap, downtime, cost, delivery, demand, and WIP observations.",
      "Independent validation and later measurements using the same line and denominator.",
    ],
  });
}

await deepenPathway("energy-grid-capacity-to-service.json", {
  summary: "Follow national storage growth into named plant-code panels, energy duration, availability, dispatch, safety, revenue, grid service, and customer reliability.",
  currentStateSummary: "Moss Landing, Manatee, and Gateway now have three-year EIA-860 nameplate power-capacity panels keyed to stable plant codes.",
  currentState: [
    "Plant code 260 rises from 400 MW to 750 MW by 2023; plant codes 60014 and 63834 retain 409 MW and 250 MW, respectively, across the three final vintages.",
    "The panels measure nameplate power only and do not rank asset performance.",
  ],
  sources: portfolios.infrastructure.sources,
  signals: portfolios.infrastructure.signals,
  gaps: ["gap-001", "gap-008"],
  stageState: "Three named battery plants now have stable 2021-2023 plant-code capacity panels.",
  stageBoundary: "Nameplate megawatts are not stored energy, duration, availability, utilization, dispatch, safety, revenue, grid service, or customer reliability.",
  limits: [
    "EIA can revise plant names, generator status, ownership, and capacity in later annual vintages.",
  ],
  nextRecords: [
    "Later EIA vintages plus asset energy duration, availability, incidents, dispatch, revenue, and grid-service records.",
  ],
});

await deepenPathway("cross-corridor-authorization-to-operation.json", {
  summary: "Compare authorization and operating transitions with named carrier service panels while keeping networks, schedules, causes, safety, accessibility, and local outcomes separate.",
  currentStateSummary: "United, Southwest, and Delta now have two-year operating-carrier cancellation panels with scheduled-flight denominators preserved.",
  currentState: [
    "DOT Table 6C supports within-carrier 2024-2025 cancellation reads without authorizing its cross-carrier ranking frame.",
  ],
  sources: portfolios.mobility.sources,
  signals: portfolios.mobility.signals,
  gaps: ["gap-015"],
  stageState: "Three reporting operating carriers now have named two-year cancellation panels.",
  stageBoundary: "Cancellation rates do not share network, schedule mix, airport, weather, cause, customer, safety, accessibility, or local-effect context.",
  limits: [
    "Operating-carrier rows must remain separate from marketing-carrier networks and branded code-share partners.",
    "Two observations do not establish a durable trend.",
  ],
  nextRecords: [
    "Later carrier full-year reports, revision notices, causes, delays, complaints, accessibility, schedule mix, and airport exposure.",
  ],
});

const topicUpdates = {
  "cybersecurity.json": portfolios.ai,
  "ai-for-science.json": portfolios.ai,
  "policy-and-standards.json": portfolios.ai,
  "advanced-manufacturing.json": portfolios.manufacturing,
  "human-futures.json": portfolios.manufacturing,
  "energy.json": portfolios.infrastructure,
  "mobility.json": portfolios.mobility,
  "aviation.json": portfolios.mobility,
};

for (const [file, portfolio] of Object.entries(topicUpdates)) {
  const topic = await readJson("topics", file);
  topic.featured_sources = addUnique(topic.featured_sources, portfolio.sources);
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which named entities now have a stable identifier and at least two compatible observations?",
    "Which reporting break, identity change, revision, missing denominator, or attribution limit stops the entity-level line?",
    "Which later records can validate performance without creating a ranking or composite score?",
  ]);
  await writeJson(topic, "topics", file);
}

const map = await readJson("dependency-maps", "comparative-outcomes-require-common-denominators.json");
const allSources = Object.values(portfolios).flatMap((portfolio) => portfolio.sources);
const allSignals = Object.values(portfolios).flatMap((portfolio) => portfolio.signals);
map.summary = "A comparison protocol showing how national context becomes a named entity panel only after identity, unit, denominator, period, geography, method, attribution, revisions, and reporting breaks align.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique(map.signal_ids, allSignals);
map.nodes = addUnique(
  map.nodes.map((node) => JSON.stringify(node)),
  [
    JSON.stringify({
      id: "node-entity-identity",
      label: "Stable entity identity",
      node_type: "Constraint",
      note: "Agency, facility, plant code, or operating-carrier identity must persist across observations.",
    }),
    JSON.stringify({
      id: "node-entity-panel",
      label: "Bounded entity operating panel",
      node_type: "Signal",
      record_id: signal("moss-landing-capacity-panel"),
      note: "At least two compatible observations can publish inside one named entity without becoming a rank.",
    }),
  ],
).map((node) => JSON.parse(node));
map.links = addUnique(
  map.links.map((link) => JSON.stringify(link)),
  [
    JSON.stringify({
      from: "node-entity-panel",
      to: "node-entity-identity",
      relationship: "Depends On",
      confidence: "Supported",
      note: "A stable entity ID prevents name changes, mergers, exits, and denominator drift from silently rewriting the line.",
    }),
    JSON.stringify({
      from: "node-entity-panel",
      to: "node-gap",
      relationship: "Limited By",
      confidence: "Watch",
      note: "Entity panels remain bounded and do not close cross-entity comparability.",
    }),
  ],
).map((link) => JSON.parse(link));
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A named entity panel may publish after stable identity and at least two compatible observations are verified.",
  "National context and entity performance remain separate layers.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "It does not authorize a cross-agency, cross-manufacturer, cross-asset, or cross-carrier ranking.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Later entity observations with unchanged identity, unit, denominator, method, and attribution.",
  "Explicit merger, exit, permit, revision, and reporting-break records.",
]);
await writeJson(map, "dependency-maps", "comparative-outcomes-require-common-denominators.json");

const watch005Path = join(contentRoot, "briefings", "briefing-research-watch-005-longitudinal-operating-series.mdx");
let watch005 = await readFile(watch005Path, "utf8");
if (!watch005.includes("## Phase 56B handoff")) {
  watch005 += `

## Phase 56B handoff

The strongest national series now resolve into twelve named entity panels: three federal agencies, three manufacturers, three battery plants, and three reporting operating air carriers. The entity layer preserves stable identifiers, observation contracts, reporting breaks, and explicit cross-entity ranking holds.
`;
  await writeFile(watch005Path, watch005, "utf8");
}

console.log("Integrated Phase 56B into six pathways, eight topics, the comparison protocol, and Research Watch 005.");
