import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const collectionId = "research-collection-entity-driver-constraint-dossiers-2021-2026";
const briefingId = "briefing-research-watch-007-entity-driver-constraint-dossiers";
const mapId = "dependency-map-comparative-outcomes-require-common-denominators";
const dossierLedgerPath = join(appRoot, "src", "data", "phase-56c-entity-dossiers.json");
const panelLedgerPath = join(appRoot, "src", "data", "phase-56b-entity-panels.json");
const dossierLedger = JSON.parse(await readFile(dossierLedgerPath, "utf8"));
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (collection, file) => JSON.parse(await readFile(join(contentRoot, collection, file), "utf8"));
const writeJson = async (value, collection, file) =>
  writeFile(join(contentRoot, collection, file), `${JSON.stringify(value, null, 2)}\n`, "utf8");

const dossierByPortfolio = Object.fromEntries(
  ["ai_cyber", "manufacturing", "infrastructure", "mobility"].map((portfolio) => [
    portfolio,
    dossierLedger.dossiers.filter((dossier) => dossier.portfolio === portfolio),
  ]),
);
const portfolioRecords = (portfolio) => ({
  sources: [...new Set(dossierByPortfolio[portfolio].flatMap((dossier) => dossier.source_ids))],
  signals: dossierByPortfolio[portfolio].map((dossier) => dossier.signal_id),
});
const portfolios = Object.fromEntries(
  Object.keys(dossierByPortfolio).map((portfolio) => [portfolio, portfolioRecords(portfolio)]),
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
    "Phase 56C adds entity-matched controls, inputs, constraints, later observations, attribution, independent-validation limits, and alternative explanations.",
    "Temporal order is preserved without converting association into causation, ranking, composite scoring, or readiness scoring.",
  ]);
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "A named intervention, control, input, or response does not by itself explain an observed outcome.",
    "Company and operator claims remain attributed until independently validated.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Repeated outcomes using the same entity, unit, denominator, method, and observation window.",
    "Independent validation of implementation, control operation, corrective-action closure, and downstream effects.",
  ]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []),
    ...((pathway.dependency_stack ?? []).some((stage) => stage.stage === "Entity driver and constraint dossier")
      ? []
      : [{
          stage: "Entity driver and constraint dossier",
          current_state: "Twelve dossiers order baseline, intervention or input, constraint, and later observation.",
          boundary: "Temporal sequence and attribution do not establish causal effect.",
        }]),
  ];
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
    "Which entity-matched intervention, control, input, or constraint is temporally ordered before the observed outcome?",
    "Who attributes the association, what has been independently validated, and which alternative explanations remain open?",
    "Which later compatible observation can test persistence without creating a ranking or causal claim?",
  ]);
  await writeJson(topic, "topics", file);
}

const map = await readJson("dependency-maps", "comparative-outcomes-require-common-denominators.json");
const allSources = [...new Set(Object.values(portfolios).flatMap((portfolio) => portfolio.sources))];
const allSignals = Object.values(portfolios).flatMap((portfolio) => portfolio.signals);
map.summary = "A comparison and causal-inference protocol: named entity panels can deepen into driver and constraint dossiers only when identity, temporal order, attribution, independent validation, alternative explanations, and measurement boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique(map.signal_ids, allSignals);
if (!map.nodes.some((node) => node.id === "node-entity-dossier")) {
  map.nodes.push(
    {
      id: "node-entity-dossier",
      label: "Entity driver and constraint dossier",
      node_type: "Signal",
      record_id: "signal-56c-gateway-constraints",
      note: "Baseline, intervention or input, constraint, and later observation are ordered inside one stable entity.",
    },
    {
      id: "node-causal-hold",
      label: "Causal-inference hold",
      node_type: "Constraint",
      note: "Attribution and temporal sequence do not establish an independently validated causal effect.",
    },
  );
  map.links.push(
    {
      from: "node-entity-dossier",
      to: "node-entity-panel",
      relationship: "Depends On",
      confidence: "Supported",
      note: "Every dossier inherits the parent panel's stable entity and measurement contract.",
    },
    {
      from: "node-entity-dossier",
      to: "node-causal-hold",
      relationship: "Constrained By",
      confidence: "Supported",
      note: "Alternative explanations and validation limits remain attached to every association.",
    },
    {
      from: "node-causal-hold",
      to: "node-gap",
      relationship: "Limited By",
      confidence: "Missing Evidence",
      note: "Repeated compatible outcomes and independent validation are incomplete.",
    },
  );
}
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A stable entity panel may deepen into a temporally ordered driver and constraint dossier.",
  "Attribution, independent validation, and alternative explanations can be published without claiming causation.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "It does not prove that a named intervention, control, input, commitment, or corrective action caused an observed outcome.",
  "It does not authorize a readiness score, composite score, or entity ranking.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Repeated outcomes after the named intervention using unchanged denominators and methods.",
  "Independent verification of control operation, implementation, corrective-action closure, and downstream results.",
  "Records capable of testing the named alternative explanations.",
]);
await writeJson(map, "dependency-maps", "comparative-outcomes-require-common-denominators.json");

const panelLedger = JSON.parse(await readFile(panelLedgerPath, "utf8"));
for (const panel of panelLedger.panels) {
  const dossier = dossierLedger.dossiers.find((candidate) => candidate.parent_panel_id === panel.panel_id);
  if (!dossier) continue;
  panel.phase_56c_dossier_id = dossier.dossier_id;
  panel.phase_56c_signal_id = dossier.signal_id;
  panel.driver_constraint_source_ids = dossier.source_ids;
  panel.temporal_order = dossier.temporal_order;
  panel.driver_constraint_attribution = dossier.attribution;
  panel.independent_validation = dossier.independent_validation;
  panel.alternative_explanations = dossier.alternative_explanations;
  panel.causal_boundary = dossier.causal_boundary;
  panel.next_records = dossier.next_records;
}
panelLedger.phase_56c_deepened_date = "2026-07-24";
panelLedger.phase_56c_dossier_count = dossierLedger.dossier_count;
await writeFile(panelLedgerPath, `${JSON.stringify(panelLedger, null, 2)}\n`, "utf8");

const watch006Path = join(contentRoot, "briefings", "briefing-research-watch-006-entity-operating-panels.mdx");
let watch006 = await readFile(watch006Path, "utf8");
if (!watch006.includes("## Phase 56C handoff")) {
  watch006 += `

## Phase 56C handoff

The twelve panels now deepen into entity driver and constraint dossiers. Each dossier preserves temporal order, claim attribution, independent-validation limits, alternative explanations, and an explicit no-causation boundary. Research Watch 007 carries the full synthesis.
`;
  await writeFile(watch006Path, watch006, "utf8");
}

console.log("Integrated Phase 56C into the Phase 56B ledger, six pathways, eight topics, the comparison protocol, and Research Watch 006.");
