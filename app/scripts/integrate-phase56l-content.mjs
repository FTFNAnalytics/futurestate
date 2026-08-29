import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56l-realized-outcome-continuation.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const acquisitions = ledger.acquisitions;
const byEntity = new Map(acquisitions.map((entry) => [entry.entity_id, entry]));
const collectionId = "research-collection-realized-outcome-continuation-batch-one-2026";
const briefingId = "briefing-research-watch-016-realized-outcome-continuation";
const signalIds = [
  "signal-56l-island-components-certified-employment",
  "signal-56l-monaghan-medical-certified-project",
];
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (acquisitions.length !== 3 || byEntity.size !== 3) {
  throw new Error("Phase 56L requires three unique manufacturer realized-outcome decisions.");
}

for (const { file, key } of [
  { file: "phase-56b-entity-panels.json", key: "panels" },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers" },
  { file: "phase-56d-alternative-tests.json", key: "tests" },
]) {
  const path = join(dataRoot, file);
  const entityLedger = await readJson(path);
  for (const record of entityLedger[key]) {
    const acquisition = byEntity.get(record.entity_id);
    if (!acquisition) continue;
    record.phase_56l_acquisition_id = acquisition.acquisition_id;
    record.phase_56l_named_record = acquisition.named_record;
    record.phase_56l_checked_source_id = acquisition.checked_source_id;
    record.phase_56l_checked_date = acquisition.checked_date;
    record.phase_56l_prior_closure_status = acquisition.prior_closure_status;
    record.phase_56l_current_closure_status = acquisition.current_closure_status;
    record.phase_56l_acquisition_result = acquisition.acquisition_result;
    record.phase_56l_decision = acquisition.decision;
    record.phase_56l_remaining_gap = acquisition.remaining_gap;
    record.phase_56l_reopening_rule = acquisition.reopening_rule;
  }
  entityLedger.phase_56l_acquisition_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

for (const file of [
  "advanced-manufacturing-workforce-to-operating-capacity.json",
  "advanced-manufacturing-research-to-production.json",
]) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [
    "Phase 56L adds two certified realized-employment denominators and retains one exact repeat-series non-closure across three manufacturer rails.",
    "Project amount, project completion, current employment, later commitments, and operating output remain distinct evidence types.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, acquisitions.map((entry) => entry.checked_source_id));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.signal_ids = addUnique(pathway.signal_ids, signalIds);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter(
      (item) => item.stage !== "Phase 56L realized-outcome continuation",
    ),
    {
      stage: "Phase 56L realized-outcome continuation",
      current_state:
        "Island Components and Monaghan Medical gain certified reported-employment outcomes; Current Applications retains an exact repeat-series non-closure.",
      boundary:
        "Reported FTEs do not prove causation, project amounts do not prove executed spending, and one intervention is not a repeat series.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56L realized-outcome records cannot be converted into productivity, ranking, readiness, value, or causal claims.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, acquisitions.map((entry) => entry.reopening_rule));
  await writeJson(path, pathway);
}

for (const file of ["advanced-manufacturing.json", "human-futures.json"]) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  topic.featured_sources = addUnique(topic.featured_sources, acquisitions.map((entry) => entry.checked_source_id));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which manufacturer rail next gains compatible completed investment, repeat output, or another realized outcome without collapsing project and causation boundaries?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary =
  "A comparison and inference protocol: 24 entities carry vertical evidence layers, coverage decisions, a continuation queue, exact-record checks, and three manufacturer realized-outcome decisions while identity, compatibility, attribution, validation status, denominator breaks, and reopening rules remain attached.";
map.source_ids = addUnique(map.source_ids, acquisitions.map((entry) => entry.checked_source_id));
map.signal_ids = addUnique(map.signal_ids, signalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56l-realized-outcomes"),
  {
    id: "node-phase56l-realized-outcomes",
    label: "Three manufacturer realized-outcome decisions",
    node_type: "Signal",
    note: "Two certified reported-employment records publish; one repeat-series non-closure remains explicit; no evidence state changes.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56l-realized-outcomes" &&
      link.to !== "node-phase56l-realized-outcomes",
  ),
  {
    from: "node-phase56l-realized-outcomes",
    to: "node-phase56j-continuation",
    relationship: "Depends On",
    confidence: "Supported",
    note: "Phase 56L executes the next three named manufacturer continuation rules without replacing stable IDs or evidence states.",
  },
  {
    from: "node-phase56l-realized-outcomes",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Employment, project amount, completion, and operating output retain their actual entity, project, period, and source role.",
  },
  {
    from: "node-phase56l-realized-outcomes",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "Reported current employment and project completion do not establish project causation or comparative performance.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Three manufacturer realized-outcome decisions with stable identity, current source, evidence state, limitation, and reopening rule.",
  "Certified reported-employment advancements for Island Components and Monaghan Medical without a closure-state change.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That reported current FTEs were caused by an incentive project, a project amount was fully spent, or one intervention is a repeat operating series.",
]);
map.next_records_needed = addUnique(map.next_records_needed, acquisitions.map((entry) => entry.reopening_rule));
await writeJson(mapPath, map);

console.log(
  "Integrated Phase 56L across three entity ledgers, two reader pathways, two topics, and one comparison map.",
);
