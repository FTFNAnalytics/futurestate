import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56o-cross-agency-remediation.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const decisions = new Map(ledger.coverage_decisions.map((entry) => [entry.entity_id, entry]));
const recordsByCoverage = new Map();
for (const entry of ledger.records) {
  recordsByCoverage.set(entry.coverage_id, [...(recordsByCoverage.get(entry.coverage_id) ?? []), entry]);
}

const collectionId = "research-collection-cross-agency-priority-remediation-portfolios-2026";
const briefingId = "briefing-research-watch-019-cross-agency-remediation";
const signalIds = [
  "signal-56o-doe-priority-portfolio-five-implemented-24-current",
  "signal-56o-hhs-priority-portfolio-four-implemented-38-current",
  "signal-56o-dot-priority-portfolio-three-implemented-22-current",
  "signal-56o-va-priority-portfolio-two-implemented-30-current",
  "signal-56o-gsa-priority-portfolio-two-implemented-11-current",
  "signal-56o-ostp-priority-portfolio-three-implemented-four-current",
  "signal-56o-ntia-priority-portfolio-one-implemented-10-current",
  "signal-56o-gao-open-recommendations-132-251b-modeled-benefit",
];
const sourceIds = ledger.records.map((record) => record.source_id);
const policySignalIds = signalIds;
const autonomySourceId = "source-56o-dot-priority-recommendations-2026";
const autonomySignalId = "signal-56o-dot-priority-portfolio-three-implemented-22-current";

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];

if (ledger.records.length !== 8 || decisions.size !== 4 || ledger.context_records.length !== 4) {
  throw new Error("Phase 56O requires eight records, four Phase 56F decisions, and four contextual records.");
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
    record.phase_56o_coverage_decision = decision;
    record.phase_56o_records = (recordsByCoverage.get(decision.coverage_id) ?? []).map((entry) => ({
      record_id: entry.record_id, exact_record: entry.exact_record,
      status_period: entry.status_period, finding: entry.finding,
      decision: entry.decision, source_id: entry.source_id,
      record_status: entry.record_status, reopening_rule: entry.reopening_rule,
    }));
  }
  entityLedger.phase_56o_continuation_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

for (const file of ["ai-infrastructure-policy-to-assurance.json", "policy-standards-to-implementation.json"]) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [
    "Phase 56O adds seven exact agency priority portfolios and one bounded government-wide potential-benefit model.",
    "Implemented, added, de-prioritized, current, modeled, and realized states remain distinct.",
  ]);
  pathway.source_ids = addUnique(pathway.source_ids, sourceIds);
  pathway.signal_ids = addUnique(pathway.signal_ids, policySignalIds);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56O cross-agency remediation follow-through"),
    {
      stage: "Phase 56O cross-agency remediation follow-through",
      current_state: "Seven agency portfolios now expose annual implementation throughput, additions, designation changes, and current workload; GAO also supplies a bounded government-wide benefit model.",
      boundary: "Portfolio arithmetic and modeled potential benefit do not establish agency performance, realized savings, safety, quality, readiness, or causation.",
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    "Phase 56O portfolio counts use different agency inventories and subject mixes and cannot support agency rankings or comparable rates.",
    "The $132 billion to $251 billion range is modeled potential benefit, not a forecast, appropriation, agency allocation, or realized saving.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, ledger.records.map((entry) => entry.reopening_rule));
  await writeJson(path, pathway);
}

const autonomyPath = join(contentRoot, "reader-pathways", "autonomy-regulation-to-service.json");
const autonomy = await readJson(autonomyPath);
autonomy.current_state = addUnique(autonomy.current_state, [
  "DOT's 2026 priority portfolio adds exact implementation and current-workload context for emerging-technology integration without changing the service evidence gate.",
]);
autonomy.source_ids = addUnique(autonomy.source_ids, [autonomySourceId]);
autonomy.signal_ids = addUnique(autonomy.signal_ids, [autonomySignalId]);
autonomy.briefing_ids = addUnique(autonomy.briefing_ids, [briefingId]);
autonomy.research_collection_ids = addUnique(autonomy.research_collection_ids, [collectionId]);
autonomy.evidence_limits = addUnique(autonomy.evidence_limits, [
  "DOT priority-recommendation movement does not establish drone or automated-vehicle safety, authorization, deployment, or passenger-service outcomes.",
]);
autonomy.next_records = addUnique(autonomy.next_records, [
  "Action-level implementation evidence for DOT's emerging-technology priorities and the open AI-inventory action.",
]);
await writeJson(autonomyPath, autonomy);

const topicSources = {
  "policy-and-standards.json": sourceIds,
  "finance-and-risk.json": [sourceIds[0], sourceIds[1], sourceIds[4], sourceIds[7]],
  "cybersecurity.json": [sourceIds[3], sourceIds[4], sourceIds[6]],
  "mobility.json": [sourceIds[2]],
  "energy.json": [sourceIds[0]],
  "human-futures.json": [sourceIds[1], sourceIds[3]],
  "ai-for-science.json": [sourceIds[5]],
  "chips-and-compute.json": [sourceIds[6]],
};
for (const [file, additions] of Object.entries(topicSources)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  topic.featured_sources = addUnique(topic.featured_sources, additions);
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which Phase 56O priority portfolio next supplies action-level implementation evidence rather than aggregate movement?",
    "Which modeled or stated benefit later becomes independently attributed and realized without becoming an agency ranking?",
  ]);
  await writeJson(path, topic);
}

for (const [file, sourceId] of [
  ["org-general-services-administration.json", sourceIds[4]],
  ["org-executive-office-president.json", sourceIds[5]],
]) {
  const path = join(contentRoot, "organizations", file);
  const org = await readJson(path);
  org.source_ids = addUnique(org.source_ids, [sourceId]);
  await writeJson(path, org);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: 24 entity coverage states now carry exact continuation decisions through Phase 56O, while portfolio arithmetic, agency scope, subject mix, recommendation identity, model assumptions, benefit realization, period, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, sourceIds);
map.signal_ids = addUnique(map.signal_ids, signalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56o-cross-agency-remediation"),
  {
    id: "node-phase56o-cross-agency-remediation",
    label: "Eight cross-agency remediation follow-through records",
    node_type: "Signal",
    note: "Seven agency portfolios and one government-wide model publish; no Phase 56F evidence state changes.",
  },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56o-cross-agency-remediation" && link.to !== "node-phase56o-cross-agency-remediation"),
  { from: "node-phase56o-cross-agency-remediation", to: "node-phase56n-verified-remediation", relationship: "Depends On", confidence: "Supported", note: "Phase 56O continues the exact remediation rail from action and component status into annual agency portfolio movement." },
  { from: "node-phase56o-cross-agency-remediation", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Agency inventories, subject mixes, additions, removals, implementation counts, and model assumptions are not shared denominators." },
  { from: "node-phase56o-cross-agency-remediation", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Portfolio movement and modeled potential benefits do not establish performance, realized savings, service outcomes, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Eight exact portfolio or model records with stable agency, arithmetic, state, period, scope, limitation, and continuation identity.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That portfolio implementation counts are comparable agency rates or that modeled potential benefits are realized savings.",
]);
map.next_records_needed = addUnique(map.next_records_needed, ledger.records.map((entry) => entry.reopening_rule));
await writeJson(mapPath, map);

console.log("Integrated Phase 56O across four coverage rails, three reader pathways, eight topics, two organizations, and one comparison map.");
