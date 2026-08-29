import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56j-evidence-value-continuation.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const acquisitions = ledger.acquisitions;
const byEntity = new Map(acquisitions.map((entry) => [entry.entity_id, entry]));
const queueByEntity = new Map([
  ...ledger.original_partially_closed_continuation_queue.map((entry) => [entry.entity_id, entry]),
  ...ledger.open_rails.map((entry) => [entry.entity_id, { ...entry, queue_lane: "Open rail" }]),
]);
const collectionId = "research-collection-evidence-value-continuation-queue-batch-one-2026";
const briefingId = "briefing-research-watch-014-evidence-value-continuation";
const publishedSignalIds = [
  "signal-56j-manatee-monthly-operation",
  "signal-56j-dalrymple-march-constraint",
  "signal-56j-hornsdale-event-operation",
  "signal-56j-kc46-readiness-plan",
];
const heldSignalId = "signal-56j-doe-ferc-scope-hold";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (acquisitions.length !== 5 || byEntity.size !== 5) {
  throw new Error("Phase 56J batch one requires five unique acquisition decisions.");
}
if (ledger.original_partially_closed_continuation_queue.length !== 20 || ledger.open_rails.length !== 3) {
  throw new Error("Phase 56J requires twenty original partial continuation rules and three open rails.");
}

const entityLedgerFiles = [
  { file: "phase-56b-entity-panels.json", key: "panels" },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers" },
  { file: "phase-56d-alternative-tests.json", key: "tests" },
  { file: "phase-56e-second-cohort-panels.json", key: "panels" },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers" },
  { file: "phase-56e-second-cohort-tests.json", key: "tests" },
];

for (const { file, key } of entityLedgerFiles) {
  const path = join(dataRoot, file);
  const entityLedger = await readJson(path);
  for (const record of entityLedger[key]) {
    const queueEntry = queueByEntity.get(record.entity_id);
    if (queueEntry) {
      record.phase_56j_queue_lane = queueEntry.queue_lane ?? queueEntry.priority_band;
      record.phase_56j_acquisition_order = queueEntry.acquisition_order ?? null;
      record.phase_56j_named_next_record = queueEntry.named_next_record ?? queueEntry.selected_record;
    }
    const acquisition = byEntity.get(record.entity_id);
    if (!acquisition) continue;
    record.phase_56j_acquisition_id = acquisition.acquisition_id;
    record.phase_56j_checked_source_id = acquisition.checked_source_id;
    record.phase_56j_checked_date = acquisition.checked_date;
    record.phase_56j_prior_closure_status = acquisition.prior_closure_status;
    record.phase_56j_current_closure_status = acquisition.current_closure_status;
    record.phase_56j_acquisition_result = acquisition.acquisition_result;
    record.phase_56j_remaining_gap = acquisition.remaining_gap;
    record.phase_56j_reopening_rule = acquisition.reopening_rule;
  }
  entityLedger.phase_56j_acquisition_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwayPortfolios = {
  "ai-infrastructure-policy-to-assurance.json": ["ai_cyber"],
  "policy-standards-to-implementation.json": ["ai_cyber"],
  "advanced-manufacturing-workforce-to-operating-capacity.json": ["manufacturing"],
  "advanced-manufacturing-research-to-production.json": ["manufacturing"],
  "energy-grid-capacity-to-service.json": ["infrastructure"],
};

const portfolioSignalIds = {
  ai_cyber: [],
  infrastructure: publishedSignalIds.slice(0, 3),
  manufacturing: [publishedSignalIds[3]],
};

for (const [file, portfolios] of Object.entries(pathwayPortfolios)) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  pathway.current_state = addUnique(pathway.current_state, [
    `Phase 56J adds ${relevant.length} named continuation ${relevant.length === 1 ? "decision" : "decisions"} to this pathway under the ordered evidence-value queue.`,
    "Acquisition order describes evidence opportunity and does not rank entities, performance, safety, quality, readiness, or value.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, relevant.map((entry) => entry.checked_source_id));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.signal_ids = addUnique(
    pathway.signal_ids.filter((id) => id !== heldSignalId),
    portfolios.flatMap((portfolio) => portfolioSignalIds[portfolio] ?? []),
  );
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56J evidence-value continuation"),
    {
      stage: "Phase 56J evidence-value continuation",
      current_state:
        "Five named records are reviewed; four bounded findings publish, one scope mismatch remains held, and only Manatee changes evidence state.",
      boundary:
        "A monthly row, constraint entry, operator event, official plan, or component audit is not complete performance or a causal result.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56J acquisition order and closure states cannot be converted into rankings, scores, readiness, quality, safety, value, or causal claims.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, relevant.map((entry) => entry.reopening_rule));
  await writeJson(path, pathway);
}

const topicPortfolios = {
  "cybersecurity.json": ["ai_cyber"],
  "policy-and-standards.json": ["ai_cyber"],
  "advanced-manufacturing.json": ["manufacturing"],
  "aviation.json": ["manufacturing"],
  "energy.json": ["infrastructure"],
};

for (const [file, portfolios] of Object.entries(topicPortfolios)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  topic.featured_sources = addUnique(topic.featured_sources, relevant.map((entry) => entry.checked_source_id));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which named continuation record supplies a compatible observation rather than an adjacent plan, component result, or broad context?",
    "Which Phase 56J evidence opportunity can deepen next without becoming an entity ranking, score, readiness claim, or causal result?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary =
  "A comparison and inference protocol: 24 entities carry vertical evidence layers, coverage decisions, completed first-pass records, and an ordered continuation queue while identity, compatibility, attribution, validation status, denominator breaks, and reopening rules remain attached.";
map.source_ids = addUnique(map.source_ids, acquisitions.map((entry) => entry.checked_source_id));
map.signal_ids = addUnique(map.signal_ids, publishedSignalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56j-continuation"),
  {
    id: "node-phase56j-continuation",
    label: "Ordered continuation queue and five named decisions",
    node_type: "Signal",
    note: "Manatee moves to Partially Closed; four other records preserve bounded findings or holds.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56j-continuation" &&
      link.to !== "node-phase56j-continuation",
  ),
  {
    from: "node-phase56j-continuation",
    to: "node-phase56i-first-pass",
    relationship: "Evidenced By",
    confidence: "Supported",
    note: "Phase 56J begins from the completed 24-entity first-pass ledger and preserves every stable ID and continuation rule.",
  },
  {
    from: "node-phase56j-continuation",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Monthly, constraint, event, plan, and component scopes remain incompatible with complete interval, annual, fleet, or department-wide outcomes.",
  },
  {
    from: "node-phase56j-continuation",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "Evidence priority and disclosure do not measure entity performance and support no ranking, score, or causal inference.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A bounded evidence-value continuation order for twenty original Partially Closed records plus three active Open rails.",
  "One exact evidence-state change from Open to Partially Closed for Manatee on the named EIA plant record.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That evidence acquisition order ranks entities or that a monthly row, constraint entry, event report, intervention plan, or component audit is complete performance.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  ...ledger.open_rails.map((entry) => entry.reopening_rule),
  ...acquisitions.map((entry) => entry.reopening_rule),
]);
await writeJson(mapPath, map);

console.log(
  "Integrated Phase 56J across six entity ledgers, five reader pathways, five topics, and one comparison map.",
);
