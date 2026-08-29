import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56n-verified-remediation-outcomes.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const decisions = new Map(ledger.coverage_decisions.map((entry) => [entry.entity_id, entry]));
const recordsByCoverage = new Map();
for (const entry of ledger.records) {
  recordsByCoverage.set(entry.coverage_id, [
    ...(recordsByCoverage.get(entry.coverage_id) ?? []),
    entry,
  ]);
}

const collectionId =
  "research-collection-verified-remediation-component-outcomes-batch-two-2026";
const briefingId = "briefing-research-watch-018-verified-remediation-outcomes";
const signalIds = [
  "signal-56n-nasa-ai-recommendations-open",
  "signal-56n-doe-ai-inventory-recommendation-open",
  "signal-56n-hhs-ai-recommendations-split",
  "signal-56n-dhs-ai-recommendations-two-closed-one-open",
  "signal-56n-dot-ai-recommendations-split",
  "signal-56n-va-ai-inventory-recommendation-closed",
  "signal-56n-dhs-priority-recommendation-portfolio",
  "signal-56n-doe-insider-threat-five-closed-two-partial",
  "signal-56n-va-southern-oregon-three-closed-five-open",
];
const sourceIds = [
  "source-56n-gao-federal-ai-recommendation-status-2026",
  "source-56n-hhs-oig-recommendations-tracker-2026",
  "source-56n-dhs-gao-priority-recommendations-2026",
  "source-56n-doe-insider-threat-recommendations-2026",
  "source-56n-va-southern-oregon-followup-2026",
];

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (ledger.records.length !== 10 || decisions.size !== 6) {
  throw new Error("Phase 56N requires ten records and six coverage decisions.");
}

for (const { file, key } of [
  { file: "phase-56b-entity-panels.json", key: "panels" },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers" },
  { file: "phase-56d-alternative-tests.json", key: "tests" },
  { file: "phase-56e-second-cohort-panels.json", key: "panels" },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers" },
  { file: "phase-56e-second-cohort-tests.json", key: "tests" },
]) {
  const path = join(dataRoot, file);
  const entityLedger = await readJson(path);
  for (const record of entityLedger[key]) {
    const decision = decisions.get(record.entity_id);
    if (!decision) continue;
    const componentRecords = recordsByCoverage.get(decision.coverage_id) ?? [];
    record.phase_56n_coverage_decision = decision;
    record.phase_56n_records = componentRecords.map((entry) => ({
      record_id: entry.record_id,
      entity_id: entry.entity_id,
      exact_record: entry.exact_record,
      status_period: entry.status_period,
      finding: entry.finding,
      decision: entry.decision,
      source_id: entry.source_id,
      record_status: entry.record_status,
      reopening_rule: entry.reopening_rule,
    }));
  }
  entityLedger.phase_56n_continuation_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

for (const file of [
  "ai-infrastructure-policy-to-assurance.json",
  "policy-standards-to-implementation.json",
]) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [
    "Phase 56N adds nine exact federal remediation or component outcomes and one held dated HHS check.",
    "Closed-Implemented, Open, Open-Partially Addressed, no-longer-valid, component, portfolio, and held states remain distinct.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, sourceIds);
  pathway.signal_ids = addUnique(pathway.signal_ids, signalIds);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter(
      (item) => item.stage !== "Phase 56N verified remediation and component outcomes",
    ),
    {
      stage: "Phase 56N verified remediation and component outcomes",
      current_state:
        "Six agency AI-governance rails, a DHS priority portfolio, DOE insider-threat remediation, and a VA component follow-up now have exact current recommendation states.",
      boundary:
        "Recommendation states, portfolio movement, and component closures do not establish system performance, enterprise effectiveness, service outcomes, or readiness.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56N records cannot be converted into agency or provider rankings, readiness scores, value scores, performance rates, or causal claims.",
    "The HHS post-July 29 check remains held because a passed expected-update date is not a remediation result or formal missed-deadline finding.",
  ]);
  pathway.next_records = addUnique(
    pathway.next_records,
    ledger.coverage_decisions.map((entry) => entry.reopening_rule),
  );
  await writeJson(path, pathway);
}

for (const file of ["ai-for-science.json", "cybersecurity.json", "policy-and-standards.json"]) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  topic.featured_sources = addUnique(topic.featured_sources, sourceIds);
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which open Phase 56N recommendation next receives independently accepted implementation evidence?",
    "Which component or portfolio record next adds a compatible operating outcome without becoming an agency ranking or readiness score?",
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
  "A comparison and inference protocol: 24 entity coverage states now carry exact continuation decisions through Phase 56N, while agency, component, portfolio, recommendation, validation, period, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, sourceIds);
map.signal_ids = addUnique(map.signal_ids, signalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56n-verified-remediation"),
  {
    id: "node-phase56n-verified-remediation",
    label: "Ten verified remediation and component decisions",
    node_type: "Signal",
    note: "Nine bounded records publish and one dated HHS tracker check remains held; no Phase 56F evidence state changes.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56n-verified-remediation" &&
      link.to !== "node-phase56n-verified-remediation",
  ),
  {
    from: "node-phase56n-verified-remediation",
    to: "node-phase56m-federal-remediation",
    relationship: "Depends On",
    confidence: "Supported",
    note: "Phase 56N continues the federal recommendation rail with exact action, portfolio, and component states.",
  },
  {
    from: "node-phase56n-verified-remediation",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Plans, inventories, portfolios, programs, and facility inspections retain different identities, scopes, periods, and denominators.",
  },
  {
    from: "node-phase56n-verified-remediation",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "No recommendation or component status establishes system performance, enterprise effectiveness, service outcomes, or causation.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Ten exact federal recommendation, portfolio, and component decisions with stable identity, status period, source, limitation, and continuation rule.",
  "A visible publication hold where the expected HHS tracker date passed without a post-date public update.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That recommendation closure, inventory completeness, portfolio movement, or component remediation measures agency performance, system safety, readiness, quality, value, or causal effect.",
]);
map.next_records_needed = addUnique(
  map.next_records_needed,
  ledger.coverage_decisions.map((entry) => entry.reopening_rule),
);
await writeJson(mapPath, map);

console.log(
  "Integrated Phase 56N across six entity ledgers, two reader pathways, three topics, and one comparison map.",
);
