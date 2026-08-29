import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const acquisitionLedgerFile = "phase-56h-acquisition-and-deepening.json";
const acquisitionLedger = JSON.parse(await readFile(join(dataRoot, acquisitionLedgerFile), "utf8"));
const acquisitions = acquisitionLedger.acquisitions;
const byEntity = new Map(acquisitions.map((entry) => [entry.entity_id, entry]));
const collectionId = "research-collection-open-rail-acquisition-partial-closure-deepening-2026";
const briefingId = "briefing-research-watch-012-acquisition-and-deepening";
const publishedSignalIds = [
  "signal-56h-doe-fy2025-cyber-result",
  "signal-56h-f35-delivery-capability-advance",
  "signal-56h-hornsdale-final-operating-record",
  "signal-56h-dalrymple-constraint-event",
];

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");

if (acquisitions.length !== 14 || byEntity.size !== 14) {
  throw new Error("Phase 56H requires fourteen unique entity decisions.");
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
    record.phase_56h_acquisition_id = acquisition.acquisition_id;
    record.phase_56h_checked_source_id = acquisition.checked_source_id;
    record.phase_56h_checked_date = acquisition.checked_date;
    record.phase_56h_prior_closure_status = acquisition.prior_closure_status;
    record.phase_56h_current_closure_status = acquisition.current_closure_status;
    record.phase_56h_acquisition_result = acquisition.acquisition_result;
    record.phase_56h_remaining_gap = acquisition.remaining_gap;
    record.phase_56h_reopening_rule = acquisition.reopening_rule;
  }
  ledger.phase_56h_acquisition_ledger = acquisitionLedgerFile;
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
    `Phase 56H checked ${relevant.length} named ${relevant.length === 1 ? "record" : "records"} in this pathway against existing coverage IDs and continuation rules.`,
    advances.length > 0
      ? `${advances.length} selected evidence ${advances.length === 1 ? "state advances" : "states advance"} from Open to Partially Closed; the remaining denominators stay explicit.`
      : "The selected records deepen or continue without a closure-state change.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, relevant.map((entry) => entry.checked_source_id));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.signal_ids = addUnique(
    pathway.signal_ids,
    portfolios.includes("ai_cyber")
      ? [publishedSignalIds[0]]
      : portfolios.includes("manufacturing")
        ? [publishedSignalIds[1]]
        : [publishedSignalIds[2], publishedSignalIds[3]],
  );
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56H acquisition and deepening"),
    {
      stage: "Phase 56H acquisition and deepening",
      current_state: advances.length > 0
        ? "Compatible bounded records advance selected evidence states while full operating and outcome denominators remain open."
        : "Current official checks deepen the evidence trail without changing the selected closure state.",
      boundary: "Evidence movement is not entity performance; adjacent context cannot replace a missing annual, monthly, interval, closure, restoration, or outcome denominator.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56H closure and deepening states cannot be converted into rankings, scores, readiness, quality, safety, value, or causal claims.",
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
    "Which Phase 56H continuation rule has been met by a compatible operating, corrective-action, or closure record?",
    "Which Partially Closed record can add a verified denominator without being presented as a performance score?",
  ]);
  await writeJson(path, topic);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: 24 entities now carry vertical evidence layers, one-record coverage decisions, repeated acquisition results, and bounded partial-closure deepening while identity, compatibility, attribution, validation status, denominator breaks, and continuation rules remain attached.";
map.source_ids = addUnique(map.source_ids, acquisitions.map((entry) => entry.checked_source_id));
map.signal_ids = addUnique(map.signal_ids, publishedSignalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56h-acquisition"),
  {
    id: "node-phase56h-acquisition",
    label: "Fourteen acquisition and deepening decisions",
    node_type: "Signal",
    note: "DOE, F-35, and Hornsdale advance to Partially Closed; three exact rails remain Open and eight partial records deepen.",
  },
];
map.links = [
  ...map.links.filter(
    (link) =>
      link.from !== "node-phase56h-acquisition" &&
      link.to !== "node-phase56h-acquisition",
  ),
  {
    from: "node-phase56h-acquisition",
    to: "node-phase56g-acquisition",
    relationship: "Evidenced By",
    confidence: "Supported",
    note: "All six Phase 56G Open rails receive another named-source check and three advance on compatible records.",
  },
  {
    from: "node-phase56h-acquisition",
    to: "node-denominator-break",
    relationship: "Constrained By",
    confidence: "Partial",
    note: "Annual summaries, cumulative totals, recommendation status, and event counts remain bounded by missing monthly, interval, closure, restoration, or outcome denominators.",
  },
  {
    from: "node-phase56h-acquisition",
    to: "node-causal-hold",
    relationship: "Limited By",
    confidence: "Missing Evidence",
    note: "Acquisition and evidence-state movement do not measure performance and support no causal inference, ranking, or score.",
  },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "A dated trail showing three bounded Open-to-Partially-Closed advances and eight partial-record deepenings.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a management letter, annual total, cumulative fleet count, recommendation state, ongoing investigation, or constraint event is a complete operating or outcome record.",
]);
map.next_records_needed = addUnique(map.next_records_needed, acquisitions.map((entry) => entry.reopening_rule));
await writeJson(mapPath, map);

console.log("Integrated Phase 56H across six entity ledgers, five reader pathways, five topics, and one comparison map.");
