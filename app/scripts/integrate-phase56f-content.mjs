import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const coveragePath = join(dataRoot, "phase-56f-cross-cohort-coverage.json");
const coverageLedger = JSON.parse(await readFile(coveragePath, "utf8"));
const coverage = coverageLedger.coverage;
const byEntity = new Map(coverage.map((entry) => [entry.entity_id, entry]));

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (coverage.length !== 24 || byEntity.size !== 24) {
  throw new Error("Phase 56F requires 24 unique entity coverage decisions.");
}

const ledgerFiles = [
  { file: "phase-56b-entity-panels.json", key: "panels" },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers" },
  { file: "phase-56d-alternative-tests.json", key: "tests" },
  { file: "phase-56e-second-cohort-panels.json", key: "panels" },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers" },
  { file: "phase-56e-second-cohort-tests.json", key: "tests" },
];

for (const { file, key } of ledgerFiles) {
  const path = join(dataRoot, file);
  const ledger = await readJson(path);
  for (const record of ledger[key]) {
    const decision = byEntity.get(record.entity_id);
    if (!decision) {
      throw new Error(`${file} contains an entity without a Phase 56F decision: ${record.entity_id}`);
    }
    record.phase_56f_coverage_id = decision.coverage_id;
    record.phase_56f_closure_status = decision.closure_status;
    record.phase_56f_record_status = decision.record_status;
    record.phase_56f_selected_source_id = decision.selected_source_id;
    record.phase_56f_highest_value_missing_record = decision.highest_value_missing_record;
    record.phase_56f_remaining_gap = decision.remaining_gap;
    record.phase_56f_reopening_rule = decision.reopening_rule;
  }
  ledger.phase_56f_coverage_ledger = "phase-56f-cross-cohort-coverage.json";
  await writeJson(path, ledger);
}

const signalForPortfolio = {
  ai_cyber: "signal-56f-ai-cyber-coverage-closure",
  manufacturing: "signal-56f-manufacturing-coverage-closure",
  infrastructure: "signal-56f-infrastructure-coverage-closure",
  mobility: "signal-56f-mobility-coverage-closure",
};
const briefingId = "briefing-research-watch-010-cross-cohort-coverage";
const collectionId = "research-collection-cross-cohort-coverage-missing-record-closure-2010-2026";
const comparisonSignalId = "signal-56f-cross-cohort-comparison-hold";
const dependencyMapId = "dependency-map-comparative-outcomes-require-common-denominators";

const pathwayPortfolio = {
  "ai-infrastructure-policy-to-assurance.json": ["ai_cyber"],
  "policy-standards-to-implementation.json": ["ai_cyber"],
  "advanced-manufacturing-workforce-to-operating-capacity.json": ["manufacturing"],
  "advanced-manufacturing-research-to-production.json": ["manufacturing"],
  "energy-grid-capacity-to-service.json": ["infrastructure"],
  "cross-corridor-authorization-to-operation.json": ["mobility"],
};

for (const [file, portfolios] of Object.entries(pathwayPortfolio)) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  const decisions = coverage.filter((entry) => portfolios.includes(entry.portfolio));
  const selectedSources = decisions.map((entry) => entry.selected_source_id);
  const portfolioSignals = portfolios.map((portfolio) => signalForPortfolio[portfolio]);
  pathway.current_state = addUnique(pathway.current_state, [
    "Phase 56F assigns every entity one highest-value missing record, one strongest compatible current record, a closure state, and an explicit reopening rule.",
    "Across all 24 entities, one bounded record is Closed, sixteen are Partially Closed, and seven remain Open; these are evidence states, not performance measures.",
  ]);
  pathway.signal_ids = addUnique(
    (pathway.signal_ids ?? []).filter((id) => id !== comparisonSignalId),
    portfolioSignals,
  );
  pathway.source_ids = addUnique(pathway.source_ids, selectedSources);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.dependency_map_ids = addUnique(pathway.dependency_map_ids, [dependencyMapId]);
  pathway.research_collection_ids = addUnique(
    (pathway.research_collection_ids ?? []).filter(
      (id) => id !== "collection-cross-cohort-coverage-missing-record-closure-2010-2026",
    ),
    [collectionId],
  );
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Cross-cohort coverage closure"),
    {
      stage: "Cross-cohort coverage closure",
      current_state: "One selected record and one reopening rule now govern each of the 24 named entities.",
      boundary: "Closed, Partially Closed, and Open describe the selected evidence question only; they do not compare entity performance.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56F closure states apply to one named missing record per entity and cannot be converted into a ranking, composite, readiness score, or causal claim.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Acquire the seven Open exact records, then revisit the sixteen Partially Closed records only when their named reopening condition is met.",
  ]);
  await writeJson(path, pathway);
}

const topicPortfolio = {
  "cybersecurity.json": ["ai_cyber"],
  "ai-for-science.json": ["ai_cyber"],
  "policy-and-standards.json": ["ai_cyber"],
  "advanced-manufacturing.json": ["manufacturing"],
  "human-futures.json": ["manufacturing"],
  "energy.json": ["infrastructure"],
  "mobility.json": ["mobility"],
  "aviation.json": ["mobility"],
};

for (const [file, portfolios] of Object.entries(topicPortfolio)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  const decisions = coverage.filter((entry) => portfolios.includes(entry.portfolio));
  topic.featured_sources = addUnique(
    topic.featured_sources,
    decisions.map((entry) => entry.selected_source_id),
  );
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which Phase 56F reopening rule has been met by a new official record, and does that record close only the named gap or a wider operating outcome?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: 24 entities now carry panels, dossiers, alternative tests, and one-record coverage decisions while stable identity, compatibility, attribution, validation status, denominator breaks, and reopening rules remain attached.";
map.source_ids = addUnique(map.source_ids, coverage.map((entry) => entry.selected_source_id));
map.signal_ids = addUnique(
  (map.signal_ids ?? []).filter((id) => id !== comparisonSignalId),
  Object.values(signalForPortfolio),
);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56f-coverage-ledger"),
  {
    id: "node-phase56f-coverage-ledger",
    label: "24-entity one-record coverage ledger",
    node_type: "Signal",
    note: "One record is Closed, sixteen are Partially Closed, and seven remain Open under named reopening rules.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56f-coverage-ledger" &&
      link.to !== "node-phase56f-coverage-ledger",
  ),
  {
    from: "node-phase56f-coverage-ledger",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Supported",
    note: "A coverage decision cannot bridge an incompatible unit, denominator, period, method, identity, or attribution break.",
  },
  {
    from: "node-phase56f-coverage-ledger",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "The cross-cohort interpretation remains In Review; closure states are evidence states, not performance or causal measures.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A one-record-per-entity acquisition queue with explicit closure states and reopening rules.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a Closed, Partially Closed, or Open coverage state measures entity performance, readiness, safety, quality, value, or relative standing.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "The seven exact records marked Open in the Phase 56F coverage ledger.",
  "New official records that satisfy a named reopening rule for one of the sixteen Partially Closed decisions.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56F across six entity ledgers, six reader pathways, eight topics, and one comparison map.");
