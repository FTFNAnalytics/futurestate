import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56m-federal-remediation-outcomes.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const decisions = new Map(ledger.coverage_decisions.map((entry) => [entry.entity_id, entry]));
const recordsByCoverage = new Map();
for (const entry of ledger.records) {
  recordsByCoverage.set(entry.coverage_id, [
    ...(recordsByCoverage.get(entry.coverage_id) ?? []),
    entry,
  ]);
}
const collectionId = "research-collection-federal-remediation-outcomes-batch-one-2026";
const briefingId = "briefing-research-watch-017-federal-remediation-outcomes";
const signalIds = [
  "signal-56m-nasa-gao-sixteen-open-recommendations",
  "signal-56m-hhs-large-hospital-open-cyber-actions",
  "signal-56m-hhs-small-hospital-effective-cyber-test",
];
const sourceIds = [
  "source-56d-nasa-gao-risk-management-2025",
  "source-56m-hhs-large-hospital-cyber-controls-2026",
  "source-56m-hhs-small-hospital-cyber-controls-2026",
];
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (ledger.records.length !== 3 || decisions.size !== 2) {
  throw new Error("Phase 56M requires three records and two coverage decisions.");
}

for (const { file, key } of [
  { file: "phase-56b-entity-panels.json", key: "panels" },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers" },
  { file: "phase-56d-alternative-tests.json", key: "tests" },
]) {
  const path = join(dataRoot, file);
  const entityLedger = await readJson(path);
  for (const record of entityLedger[key]) {
    const decision = decisions.get(record.entity_id);
    if (!decision) continue;
    const componentRecords = recordsByCoverage.get(decision.coverage_id) ?? [];
    record.phase_56m_coverage_decision = decision;
    record.phase_56m_records = componentRecords.map((entry) => ({
      record_id: entry.record_id,
      entity_id: entry.entity_id,
      exact_record: entry.exact_record,
      tested_or_status_period: entry.tested_or_status_period,
      finding: entry.finding,
      decision: entry.decision,
      source_id: entry.source_id,
      reopening_rule: entry.reopening_rule,
    }));
  }
  entityLedger.phase_56m_continuation_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

for (const file of [
  "ai-infrastructure-policy-to-assurance.json",
  "policy-standards-to-implementation.json",
]) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [
    "Phase 56M adds an exact sixteen-action NASA non-closure and two bounded HHS provider control tests.",
    "Open, implemented, closed, tested-effective, and no-recommendation states remain distinct.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, sourceIds);
  pathway.signal_ids = addUnique(pathway.signal_ids, signalIds);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter(
      (item) => item.stage !== "Phase 56M federal remediation and outcomes",
    ),
    {
      stage: "Phase 56M federal remediation and outcomes",
      current_state:
        "NASA has sixteen exact open GAO actions; two anonymous HHS provider tests publish with distinct findings, scopes, and periods.",
      boundary:
        "Selected provider tests do not establish department or sector performance, and open status does not establish severity or operational failure.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56M records cannot be converted into agency or provider rankings, readiness scores, value scores, or causal claims.",
  ]);
  pathway.next_records = addUnique(
    pathway.next_records,
    ledger.coverage_decisions.map((entry) => entry.reopening_rule),
  );
  await writeJson(path, pathway);
}

for (const file of ["cybersecurity.json", "policy-and-standards.json"]) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  topic.featured_sources = addUnique(topic.featured_sources, sourceIds);
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which exact NASA or HHS recommendation next gains independently verified implementation or closure?",
    "Which compatible component control retest adds a repeated operating observation without generalizing one provider to an agency or sector?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(
  contentRoot,
  "dependency-maps",
  "comparative-outcomes-require-common-denominators.json",
);
const map = await readJson(mapPath);
map.summary =
  "A comparison and inference protocol: 24 entity coverage states now carry exact continuation decisions through Phase 56M, while agency, provider, audit, period, recommendation, validation, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, sourceIds);
map.signal_ids = addUnique(map.signal_ids, signalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56m-federal-remediation"),
  {
    id: "node-phase56m-federal-remediation",
    label: "Three federal remediation and component outcome records",
    node_type: "Signal",
    note: "One NASA exact non-closure and two HHS provider control tests publish; no evidence state changes.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56m-federal-remediation" &&
      link.to !== "node-phase56m-federal-remediation",
  ),
  {
    from: "node-phase56m-federal-remediation",
    to: "node-phase56j-continuation",
    relationship: "Depends On",
    confidence: "Supported",
    note: "Phase 56M executes two named federal continuation rules with exact recommendation and component-test records.",
  },
  {
    from: "node-phase56m-federal-remediation",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Agency recommendations and anonymous provider tests retain different identities, scopes, periods, frameworks, and denominators.",
  },
  {
    from: "node-phase56m-federal-remediation",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "No record establishes department-wide effectiveness, sector performance, real-incident outcomes, or patient causation.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "One exact NASA recommendation non-closure and two bounded HHS component control tests with stable identity, period, source, limitation, and continuation rule.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That open recommendation count measures NASA performance, or that either anonymous hospital test represents HHS, CMS, the health sector, or later operations.",
]);
map.next_records_needed = addUnique(
  map.next_records_needed,
  ledger.coverage_decisions.map((entry) => entry.reopening_rule),
);
await writeJson(mapPath, map);

console.log(
  "Integrated Phase 56M across three entity ledgers, two reader pathways, two topics, and one comparison map.",
);
