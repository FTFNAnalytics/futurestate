import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56k-exact-record-continuation.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const acquisitions = ledger.acquisitions;
const byEntity = new Map(acquisitions.map((entry) => [entry.entity_id, entry]));
const collectionId = "research-collection-exact-record-continuation-batch-two-2026";
const briefingId = "briefing-research-watch-015-exact-record-continuation";
const signalIds = [
  "signal-56k-moss-landing-corrective-action-status",
  "signal-56k-va-ifams-recommendations-open",
  "signal-56k-f15ex-ex16-portland-receipt",
];
const signalByEntity = new Map([
  ["eia-plant-260", signalIds[0]],
  ["agency-va", signalIds[1]],
  ["manufacturer-boeing-f15ex-st-louis", signalIds[2]],
]);

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (acquisitions.length !== 7 || byEntity.size !== 7) {
  throw new Error("Phase 56K requires seven unique exact-record decisions.");
}
if (
  ledger.post_batch_closure_counts.closed !== 1 ||
  ledger.post_batch_closure_counts.partially_closed !== 21 ||
  ledger.post_batch_closure_counts.open !== 2
) {
  throw new Error("Phase 56K must preserve the 1 / 21 / 2 evidence-state ledger.");
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
    const acquisition = byEntity.get(record.entity_id);
    if (!acquisition) continue;
    record.phase_56k_acquisition_id = acquisition.acquisition_id;
    record.phase_56k_named_record = acquisition.named_record;
    record.phase_56k_checked_source_id = acquisition.checked_source_id;
    record.phase_56k_checked_date = acquisition.checked_date;
    record.phase_56k_prior_closure_status = acquisition.prior_closure_status;
    record.phase_56k_current_closure_status = acquisition.current_closure_status;
    record.phase_56k_acquisition_result = acquisition.acquisition_result;
    record.phase_56k_decision = acquisition.decision;
    record.phase_56k_remaining_gap = acquisition.remaining_gap;
    record.phase_56k_reopening_rule = acquisition.reopening_rule;
  }
  entityLedger.phase_56k_acquisition_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwayPortfolios = {
  "ai-infrastructure-policy-to-assurance.json": ["cyber"],
  "policy-standards-to-implementation.json": ["cyber"],
  "advanced-manufacturing-workforce-to-operating-capacity.json": ["manufacturing"],
  "advanced-manufacturing-research-to-production.json": ["manufacturing"],
  "energy-grid-capacity-to-service.json": ["energy"],
};

for (const [file, portfolios] of Object.entries(pathwayPortfolios)) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  pathway.current_state = addUnique(pathway.current_state, [
    `Phase 56K checks ${relevant.length} exact named ${relevant.length === 1 ? "record" : "records"} in this pathway and preserves explicit non-closures.`,
    "An exact-record check can improve the evidence rail without changing the selected closure state.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, relevant.map((entry) => entry.checked_source_id));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.signal_ids = addUnique(
    pathway.signal_ids,
    relevant.map((entry) => signalByEntity.get(entry.entity_id)).filter(Boolean),
  );
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56K exact-record continuation"),
    {
      stage: "Phase 56K exact-record continuation",
      current_state:
        "Seven named records are checked; three bounded observations publish, four exact non-closures are recorded, and no evidence state changes.",
      boundary:
        "A response filing, recommendation icon, arrival date, index check, audit catalog, fleet report, or audit initiation is not a differently scoped final result.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56K exact-record decisions cannot be converted into rankings, scores, readiness, quality, safety, value, or causal claims.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, relevant.map((entry) => entry.reopening_rule));
  await writeJson(path, pathway);
}

const topicPortfolios = {
  "cybersecurity.json": ["cyber"],
  "policy-and-standards.json": ["cyber"],
  "advanced-manufacturing.json": ["manufacturing"],
  "aviation.json": ["manufacturing"],
  "energy.json": ["energy"],
};

for (const [file, portfolios] of Object.entries(topicPortfolios)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  topic.featured_sources = addUnique(topic.featured_sources, relevant.map((entry) => entry.checked_source_id));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Does the latest official record match the exact entity, denominator, period, and closure condition?",
    "Which current non-closure can advance next without substituting an adjacent report, plan, or status marker?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary =
  "A comparison and inference protocol: 24 entities carry vertical evidence layers, coverage decisions, completed first-pass records, an ordered continuation queue, and seven exact-record checks while identity, compatibility, attribution, validation status, denominator breaks, and reopening rules remain attached.";
map.source_ids = addUnique(map.source_ids, acquisitions.map((entry) => entry.checked_source_id));
map.signal_ids = addUnique(map.signal_ids, signalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56k-exact-records"),
  {
    id: "node-phase56k-exact-records",
    label: "Seven exact-record decisions",
    node_type: "Signal",
    note: "Three bounded observations publish; four verified non-closures remain explicit; no evidence state changes.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56k-exact-records" &&
      link.to !== "node-phase56k-exact-records",
  ),
  {
    from: "node-phase56k-exact-records",
    to: "node-phase56j-continuation",
    relationship: "Depends On",
    confidence: "Supported",
    note: "Phase 56K executes the next seven named continuation rules without replacing stable IDs or evidence states.",
  },
  {
    from: "node-phase56k-exact-records",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Each current observation remains bounded to its actual entity, period, source role, and denominator.",
  },
  {
    from: "node-phase56k-exact-records",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "Publication, non-publication, recommendation status, and delivery timing do not establish comparative performance or causation.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Seven exact-record decisions with current source identity, evidence state, limitation, and reopening rule.",
  "Three bounded advancements for Moss Landing, VA iFAMS, and F-15EX EX16 without a closure-state change.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a company response is regulator closure, an arrival is formal contractual acceptance, or an audit initiation is an audit result.",
]);
map.next_records_needed = addUnique(map.next_records_needed, acquisitions.map((entry) => entry.reopening_rule));
await writeJson(mapPath, map);

console.log(
  "Integrated Phase 56K across six entity ledgers, five reader pathways, five topics, and one comparison map.",
);
