import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const acquisitionLedgerFile = "phase-56g-operating-record-acquisition.json";
const acquisitionLedger = JSON.parse(await readFile(join(dataRoot, acquisitionLedgerFile), "utf8"));
const acquisitions = acquisitionLedger.acquisitions;
const byEntity = new Map(acquisitions.map((entry) => [entry.entity_id, entry]));
const collectionId = "research-collection-operating-record-acquisition-closure-batch-two-2026";
const briefingId = "briefing-research-watch-011-operating-record-acquisition";
const publishedSignalId = "signal-56g-dalrymple-operating-record-advance";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (acquisitions.length !== 7 || byEntity.size !== 7) {
  throw new Error("Phase 56G requires seven unique acquisition decisions.");
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
    const acquisition = byEntity.get(record.entity_id);
    if (!acquisition) continue;
    record.phase_56g_acquisition_id = acquisition.acquisition_id;
    record.phase_56g_checked_source_id = acquisition.checked_source_id;
    record.phase_56g_checked_date = acquisition.checked_date;
    record.phase_56g_prior_closure_status = acquisition.prior_closure_status;
    record.phase_56g_current_closure_status = acquisition.current_closure_status;
    record.phase_56g_acquisition_result = acquisition.acquisition_result;
    record.phase_56g_remaining_gap = acquisition.remaining_gap;
    record.phase_56g_reopening_rule = acquisition.reopening_rule;
  }
  ledger.phase_56g_acquisition_ledger = acquisitionLedgerFile;
  await writeJson(path, ledger);
}

const pathwayPortfolios = {
  "ai-infrastructure-policy-to-assurance.json": ["ai_cyber"],
  "policy-standards-to-implementation.json": ["ai_cyber"],
  "advanced-manufacturing-workforce-to-operating-capacity.json": ["manufacturing"],
  "advanced-manufacturing-research-to-production.json": ["manufacturing"],
  "energy-grid-capacity-to-service.json": ["infrastructure"],
};

for (const [file, portfolios] of Object.entries(pathwayPortfolios)) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  const advances = relevant.filter((entry) => entry.current_closure_status !== entry.prior_closure_status);
  pathway.current_state = addUnique(pathway.current_state, [
    `Phase 56G checked ${relevant.length} exact record ${relevant.length === 1 ? "rail" : "rails"} in this pathway and retained the Phase 56F reopening rules.`,
    advances.length > 0
      ? "Dalrymple now has a later asset-specific control-scheme record; actual events and operating denominators remain open."
      : "The selected exact records remain Open; current adjacent records are preserved as dated checks rather than closures.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, relevant.map((entry) => entry.checked_source_id));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  if (portfolios.includes("infrastructure")) {
    pathway.signal_ids = addUnique(pathway.signal_ids, [publishedSignalId]);
  }
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56G exact-record acquisition"),
    {
      stage: "Phase 56G exact-record acquisition",
      current_state: advances.length > 0
        ? "One named reopening condition advances to Partially Closed; the remaining exact records continue under dated source checks."
        : "The exact records remain Open after current named-source checks.",
      boundary: "A current source is not a closure unless it supplies the selected record, compatible denominator, attribution, and observation window.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56G acquisition outcomes measure evidence closure only and cannot be converted into entity performance, a comparison, or a score.",
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
};

for (const [file, portfolios] of Object.entries(topicPortfolios)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  const relevant = acquisitions.filter((entry) => portfolios.includes(entry.portfolio));
  topic.featured_sources = addUnique(topic.featured_sources, relevant.map((entry) => entry.checked_source_id));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which Phase 56G continuation rule has been met by an exact operating or closure record rather than adjacent context?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: 24 entities now carry vertical evidence layers, one-record coverage decisions, and a second acquisition result while stable identity, compatibility, attribution, validation status, denominator breaks, and reopening rules remain attached.";
map.source_ids = addUnique(map.source_ids, acquisitions.map((entry) => entry.checked_source_id));
map.signal_ids = addUnique(map.signal_ids, [publishedSignalId]);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56g-acquisition"),
  {
    id: "node-phase56g-acquisition",
    label: "Seven exact-record acquisition checks",
    node_type: "Signal",
    note: "Dalrymple advances to Partially Closed; six selected records remain Open under dated continuation rules.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56g-acquisition" &&
      link.to !== "node-phase56g-acquisition",
  ),
  {
    from: "node-phase56g-acquisition",
    to: "node-phase56f-coverage-ledger",
    relationship: "Evidenced By",
    confidence: "Supported",
    note: "Every acquisition retains its Phase 56F coverage ID and reopening rule.",
  },
  {
    from: "node-phase56g-acquisition",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Six checked sources remain incompatible with the selected annual, monthly, interval, investigation, or restoration record.",
  },
  {
    from: "node-phase56g-acquisition",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "Acquisition and closure states do not measure performance and support no causal inference or ranking.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A dated acquisition trail showing which named reopening conditions did and did not change evidence state.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a current index, governance audit, cumulative total, capacity record, queue entry, or historical extract closes a different operating question.",
]);
map.next_records_needed = addUnique(map.next_records_needed, acquisitions.map((entry) => entry.reopening_rule));
await writeJson(mapPath, map);

console.log("Integrated Phase 56G across six entity ledgers, five reader pathways, five topics, and one comparison map.");
