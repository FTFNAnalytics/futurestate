import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const collectionId = "research-collection-second-entity-cohort-vertical-replication-2018-2026";
const briefingId = "briefing-research-watch-009-second-cohort-vertical-replication";
const mapId = "dependency-map-comparative-outcomes-require-common-denominators";
const panelLedger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56e-second-cohort-panels.json"), "utf8"));
const dossierLedger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56e-second-cohort-dossiers.json"), "utf8"));
const testLedger = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-56e-second-cohort-tests.json"), "utf8"));

const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (collection, file) => JSON.parse(await readFile(join(contentRoot, collection, file), "utf8"));
const writeJson = async (value, collection, file) =>
  writeFile(join(contentRoot, collection, file), `${JSON.stringify(value, null, 2)}\n`, "utf8");

const portfolios = Object.fromEntries(
  ["ai_cyber", "manufacturing", "infrastructure", "mobility"].map((portfolio) => {
    const panels = panelLedger.panels.filter((item) => item.portfolio === portfolio);
    const dossiers = dossierLedger.dossiers.filter((item) => item.portfolio === portfolio);
    const tests = testLedger.tests.filter((item) => item.portfolio === portfolio);
    return [portfolio, {
      sources: [...new Set([
        ...panels.flatMap((item) => item.source_ids),
        ...dossiers.flatMap((item) => item.source_ids),
        ...tests.flatMap((item) => item.source_ids),
      ])],
      signals: [
        ...panels.map((item) => item.signal_id),
        ...dossiers.map((item) => item.signal_id),
        ...tests.map((item) => item.signal_id),
      ],
      entities: panels.map((item) => item.entity_name),
    }];
  }),
);

const pathwayUpdates = {
  "ai-infrastructure-policy-to-assurance.json": "ai_cyber",
  "policy-standards-to-implementation.json": "ai_cyber",
  "advanced-manufacturing-workforce-to-operating-capacity.json": "manufacturing",
  "advanced-manufacturing-research-to-production.json": "manufacturing",
  "energy-grid-capacity-to-service.json": "infrastructure",
  "cross-corridor-authorization-to-operation.json": "mobility",
};

for (const [file, portfolio] of Object.entries(pathwayUpdates)) {
  const pathway = await readJson("reader-pathways", file);
  const records = portfolios[portfolio];
  pathway.source_ids = addUnique(pathway.source_ids, records.sources);
  pathway.signal_ids = addUnique(pathway.signal_ids, records.signals);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.dependency_map_ids = addUnique(pathway.dependency_map_ids, [mapId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.current_state = addUnique(pathway.current_state, [
    `Phase 56E adds a second vertically replicated cohort: ${records.entities.join(", ")}.`,
    "Every retained entity carries a panel, a driver-and-constraint dossier, and an alternative-explanation test under one stable identity.",
  ]);
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "The second cohort preserves attribution, unit, denominator, method, observation window, reporting breaks, and identity changes.",
    "A vertical entity record does not authorize cross-entity ranking, composite scoring, readiness scoring, or causal inference.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Later observations using the same entity, unit, denominator, method, attribution, and observation window.",
    "Independent closure and outcome records for the named controls, production lines, battery assets, or carrier services.",
  ]);
  if (!(pathway.dependency_stack ?? []).some((stage) => stage.stage === "Second-cohort vertical replication")) {
    pathway.dependency_stack = [
      ...(pathway.dependency_stack ?? []),
      {
        stage: "Second-cohort vertical replication",
        current_state: "Twelve additional entities passed a four-primary-record screen and received all three evidence layers.",
        boundary: "Entity depth can increase without making different entities comparable.",
      },
    ];
  }
  await writeJson(pathway, "reader-pathways", file);
}

const topicUpdates = {
  "cybersecurity.json": "ai_cyber",
  "ai-for-science.json": "ai_cyber",
  "policy-and-standards.json": "ai_cyber",
  "advanced-manufacturing.json": "manufacturing",
  "human-futures.json": "manufacturing",
  "energy.json": "infrastructure",
  "mobility.json": "mobility",
  "aviation.json": "mobility",
};

for (const [file, portfolio] of Object.entries(topicUpdates)) {
  const topic = await readJson("topics", file);
  topic.featured_sources = addUnique(topic.featured_sources, portfolios[portfolio].sources);
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Does the next record preserve the second-cohort entity, unit, denominator, method, attribution, and observation window?",
    "Which named driver, constraint, or alternative explanation does the later observation actually test?",
    "Which reporting, identity, or denominator break prevents a ranking, score, or causal conclusion?",
  ]);
  await writeJson(topic, "topics", file);
}

const map = await readJson("dependency-maps", "comparative-outcomes-require-common-denominators.json");
const allSources = [...new Set(Object.values(portfolios).flatMap((portfolio) => portfolio.sources))];
const allSignals = Object.values(portfolios).flatMap((portfolio) => portfolio.signals);
map.summary = "A comparison and inference protocol: two twelve-entity cohorts now carry panels, dossiers, and alternative tests while stable identity, compatibility, attribution, validation status, and denominator breaks remain attached.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique(map.signal_ids, allSignals);
if (!map.nodes.some((node) => node.id === "node-second-cohort-vertical")) {
  map.nodes.push(
    {
      id: "node-second-cohort-screen",
      label: "Four-record entity sufficiency screen",
      node_type: "Constraint",
      note: "A candidate enters only when stable identity and at least four primary or official records support all three layers.",
    },
    {
      id: "node-second-cohort-vertical",
      label: "Second-cohort panel, dossier, and test",
      node_type: "Signal",
      record_id: "signal-56e-f35-fort-worth-line-alternative-test",
      note: "All twelve retained entities carry the same three-layer publication contract.",
    },
  );
  map.links.push(
    {
      from: "node-second-cohort-vertical",
      to: "node-second-cohort-screen",
      relationship: "Depends On",
      confidence: "Supported",
      note: "Twelve of twelve candidates passed the four-record screen.",
    },
    {
      from: "node-second-cohort-vertical",
      to: "node-denominator-break",
      relationship: "Constrained By",
      confidence: "Supported",
      note: "The vertical contract preserves method, attribution, identity, and denominator breaks.",
    },
    {
      from: "node-second-cohort-vertical",
      to: "node-causal-hold",
      relationship: "Limited By",
      confidence: "Missing Evidence",
      note: "Four portfolio interpretations remain held even though all 36 entity layers publish.",
    },
  );
}
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A second cohort can be screened once and then built vertically through the same three evidence layers.",
  "Independent, regulator, operator, company, and carrier-attributed records can remain visibly distinct inside one entity dossier.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "It does not make the two cohorts or their entities rankable.",
  "It does not convert vertical evidence depth into a causal effect, composite, or readiness score.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Closure and repeat-outcome records with stable units, denominators, methods, identities, and observation windows.",
  "Matched agency controls, line inputs and outputs, battery operating series, and carrier service-delivery denominators.",
]);
await writeJson(map, "dependency-maps", "comparative-outcomes-require-common-denominators.json");

const watch008Path = join(contentRoot, "briefings", "briefing-research-watch-008-repeat-outcomes-alternative-tests.mdx");
let watch008 = await readFile(watch008Path, "utf8");
if (!watch008.includes("## Phase 56E handoff")) {
  watch008 += `

## Phase 56E handoff

A second twelve-entity cohort now carries the panel, driver-and-constraint dossier, and alternative-explanation test vertically. All twelve candidates passed the four-primary-record screen. Research Watch 009 carries the full synthesis and the four cross-entity holds.
`;
  await writeFile(watch008Path, watch008, "utf8");
}

console.log("Integrated Phase 56E into six pathways, eight topics, the comparison protocol, and Research Watch 008.");
