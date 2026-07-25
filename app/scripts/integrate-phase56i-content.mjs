import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56i-remaining-rails-first-pass.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const acquisitions = ledger.acquisitions;
const byEntity = new Map(acquisitions.map((entry) => [entry.entity_id, entry]));
const collectionId = "research-collection-remaining-open-rails-partial-closure-first-pass-2026";
const briefingId = "briefing-research-watch-013-first-pass-completion";
const publishedSignalIds = [
  "signal-56i-eia923-monthly-operating-rail",
  "signal-56i-monaghan-program-commitment",
];
const heldSignalId = "signal-56i-first-pass-continuation-hold";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (acquisitions.length !== 12 || byEntity.size !== 12) {
  throw new Error("Phase 56I requires twelve unique entity decisions.");
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
  const entityLedger = await readJson(path);
  for (const record of entityLedger[key]) {
    const acquisition = byEntity.get(record.entity_id);
    if (!acquisition) continue;
    record.phase_56i_acquisition_id = acquisition.acquisition_id;
    record.phase_56i_checked_source_id = acquisition.checked_source_id;
    record.phase_56i_checked_date = acquisition.checked_date;
    record.phase_56i_prior_closure_status = acquisition.prior_closure_status;
    record.phase_56i_current_closure_status = acquisition.current_closure_status;
    record.phase_56i_acquisition_result = acquisition.acquisition_result;
    record.phase_56i_remaining_gap = acquisition.remaining_gap;
    record.phase_56i_reopening_rule = acquisition.reopening_rule;
  }
  entityLedger.phase_56i_acquisition_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwayPortfolios = {
  "ai-infrastructure-policy-to-assurance.json": ["ai_cyber"],
  "policy-standards-to-implementation.json": ["ai_cyber"],
  "advanced-manufacturing-workforce-to-operating-capacity.json": ["manufacturing"],
  "advanced-manufacturing-research-to-production.json": ["manufacturing"],
  "energy-grid-capacity-to-service.json": ["infrastructure"],
  "cross-corridor-authorization-to-operation.json": ["mobility"],
};

const portfolioSignals = {
  ai_cyber: [],
  infrastructure: [publishedSignalIds[0]],
  manufacturing: [publishedSignalIds[1]],
  mobility: [],
};

for (const [file, portfolios] of Object.entries(pathwayPortfolios)) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  pathway.current_state = addUnique(pathway.current_state, [
    `Phase 56I completes ${relevant.length} first-pass ${relevant.length === 1 ? "decision" : "decisions"} in this pathway while retaining each coverage ID and continuation rule.`,
    "No selected closure state changes; genuinely new denominators publish and repeated evidence remains referenced rather than relabeled as a new finding.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, relevant.map((entry) => entry.checked_source_id));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.signal_ids = (pathway.signal_ids ?? []).filter((id) => id !== heldSignalId);
  pathway.signal_ids = addUnique(
    pathway.signal_ids,
    portfolios.flatMap((portfolio) => portfolioSignals[portfolio] ?? []),
  );
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56I first-pass completion"),
    {
      stage: "Phase 56I first-pass completion",
      current_state: "Every remaining Open and Partially Closed queue item has a dated decision; two genuinely new bounded denominators publish.",
      boundary: "A first-pass decision, monthly record, program commitment, or current source check is not full closure or entity performance.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56I first-pass and closure states cannot be converted into rankings, scores, readiness, quality, safety, value, or causal claims.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, relevant.map((entry) => entry.reopening_rule));
  await writeJson(path, pathway);
}

const topicPortfolios = {
  "cybersecurity.json": ["ai_cyber"],
  "policy-and-standards.json": ["ai_cyber"],
  "advanced-manufacturing.json": ["manufacturing"],
  "human-futures.json": ["manufacturing"],
  "energy.json": ["infrastructure"],
  "aviation.json": ["mobility"],
  "mobility.json": ["mobility"],
};

for (const [file, portfolios] of Object.entries(topicPortfolios)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  topic.featured_sources = addUnique(topic.featured_sources, relevant.map((entry) => entry.checked_source_id));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which Phase 56I continuation rule receives a genuinely new compatible denominator rather than repeated context?",
    "Which first-pass record can deepen next without being presented as a ranking, score, causal result, or full closure?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: 24 entities now carry vertical evidence layers, coverage decisions, repeated acquisition results, and a completed first pass through every remaining closure state while identity, compatibility, attribution, validation status, denominator breaks, and continuation rules remain attached.";
map.source_ids = addUnique(map.source_ids, acquisitions.map((entry) => entry.checked_source_id));
map.signal_ids = addUnique(map.signal_ids, publishedSignalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56i-first-pass"),
  {
    id: "node-phase56i-first-pass",
    label: "Twelve remaining first-pass decisions",
    node_type: "Signal",
    note: "Three Open and nine Partially Closed records retain their states; two genuinely new bounded denominators publish.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56i-first-pass" &&
      link.to !== "node-phase56i-first-pass",
  ),
  {
    from: "node-phase56i-first-pass",
    to: "node-phase56h-acquisition",
    relationship: "Evidenced By",
    confidence: "Supported",
    note: "Phase 56I continues the three remaining Open rails and completes the nine-record partial first pass.",
  },
  {
    from: "node-phase56i-first-pass",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Monthly releases, program commitments, project descriptions, and current source checks retain annual, interval, execution, restoration, and outcome gaps.",
  },
  {
    from: "node-phase56i-first-pass",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "First-pass completion and evidence availability do not measure performance and support no causal inference, ranking, or score.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A dated first-pass decision for all three remaining Open rails and all nine previously unreviewed Partially Closed records.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That first-pass completion, a monthly table, a program commitment, a project plan, or a current catalog check is a complete operating or outcome record.",
]);
map.next_records_needed = addUnique(map.next_records_needed, acquisitions.map((entry) => entry.reopening_rule));
await writeJson(mapPath, map);

console.log("Integrated Phase 56I across six entity ledgers, six reader pathways, seven topics, and one comparison map.");
