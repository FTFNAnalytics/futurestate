import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56p-action-recommendation-ledger.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const decisions = new Map(ledger.coverage_decisions.map((entry) => [entry.entity_id, entry]));
const actionsByEntity = new Map();
for (const entry of ledger.records) {
  actionsByEntity.set(entry.entity_id, [...(actionsByEntity.get(entry.entity_id) ?? []), entry]);
}

const collectionId = "research-collection-agency-priority-recommendation-action-ledger-2026";
const briefingId = "briefing-research-watch-020-action-level-priority-recommendations";
const sourceIds = [...new Set(ledger.records.map((record) => record.source_id))];
const signalIds = ledger.records.map((record) => record.signal_id);
const sourceByAgency = new Map(ledger.records.map((record) => [record.action_key.split("-")[0], record.source_id]));
const signalsByAgency = (code) => ledger.records.filter((record) => record.action_key.startsWith(`${code}-`)).map((record) => record.signal_id);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];

if (ledger.records.length !== 22 || decisions.size !== 4) {
  throw new Error("Phase 56P requires twenty-two actions and four coverage decisions.");
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
    record.phase_56p_coverage_decision = decision;
    record.phase_56p_actions = (actionsByEntity.get(record.entity_id) ?? []).map((entry) => ({
      action_id: entry.action_id,
      action_key: entry.action_key,
      letter_id: entry.letter_id,
      subject: entry.subject,
      action_text: entry.action_text,
      status_period: entry.status_period,
      letter_state: entry.letter_state,
      identity_boundary: entry.identity_boundary,
      decision: entry.decision,
      remaining_gap: entry.remaining_gap,
      reopening_rule: entry.reopening_rule,
      source_id: entry.source_id,
      signal_id: entry.signal_id,
    }));
  }
  entityLedger.phase_56p_continuation_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    sources: sourceIds,
    signals: signalIds,
    state: "Phase 56P decomposes four federal priority portfolios into twenty-two stable letter-named actions without inventing recommendation numbers or implementation states.",
    boundary: "A local action key and open priority designation do not establish a GAO database identity, implementation, closure, operating outcome, or agency performance.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    sources: [sourceByAgency.get("DOT")],
    signals: signalsByAgency("DOT").filter((id) => id.includes("drone") || id.includes("airspace") || id.includes("automated-vehicle")),
    state: "Phase 56P adds exact FAA drone-strategy and airspace-milestone actions plus DOT's department-wide automated-vehicle planning action.",
    boundary: "Plans, strategies, and milestones do not establish authorization, safe integration, deployment, service scale, or passenger outcomes.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    sources: [sourceByAgency.get("DOE")],
    signals: signalsByAgency("DOE"),
    state: "Phase 56P adds five exact DOE actions across nuclear modernization, environmental liabilities, energy security, and program management.",
    boundary: "Cost estimates, analyses, reviews, oversight, and pause conditions do not establish project completion, cleanup savings, reserve adequacy, or service outcomes.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, spec.sources.filter(Boolean));
  pathway.signal_ids = addUnique(pathway.signal_ids, spec.signals);
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56P action-level priority recommendation decomposition"),
    {
      stage: "Phase 56P action-level priority recommendation decomposition",
      current_state: spec.state,
      boundary: spec.boundary,
    },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "FTFN Phase 56P action keys are stable local references, not official GAO Recommendations Database numbers.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Underlying GAO Recommendations Database records, agency responses, and later action-specific status changes for the Phase 56P ledger.",
  ]);
  await writeJson(path, pathway);
}

const topicSpecs = {
  "policy-and-standards.json": { sources: sourceIds, signals: signalIds },
  "finance-and-risk.json": { sources: sourceIds, signals: signalIds },
  "energy.json": { sources: [sourceByAgency.get("DOE")], signals: signalsByAgency("DOE") },
  "human-futures.json": { sources: [sourceByAgency.get("HHS"), sourceByAgency.get("VA")], signals: [...signalsByAgency("HHS"), ...signalsByAgency("VA")] },
  "mobility.json": { sources: [sourceByAgency.get("DOT")], signals: signalsByAgency("DOT") },
  "aviation.json": { sources: [sourceByAgency.get("DOT")], signals: signalsByAgency("DOT").filter((id) => id.includes("faa") || id.includes("air-traffic")) },
};
for (const [file, additions] of Object.entries(topicSpecs)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  topic.featured_sources = addUnique(topic.featured_sources, additions.sources.filter(Boolean));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which Phase 56P action next resolves to an official GAO Recommendations Database identity and agency response?",
    "Which action later gains implementation, closure, or attributable operating-outcome evidence?",
  ]);
  await writeJson(path, topic);
}

for (const [file, sources] of [
  ["org-us-department-energy.json", [sourceByAgency.get("DOE")]],
  ["org-government-accountability-office.json", sourceIds],
]) {
  const path = join(contentRoot, "organizations", file);
  const org = await readJson(path);
  org.source_ids = addUnique(org.source_ids, sources.filter(Boolean));
  await writeJson(path, org);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: 24 entity coverage states now carry exact continuation decisions through Phase 56P, while agency, letter, action text, local key, official recommendation identity, status period, response, implementation, closure, operating outcome, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, sourceIds);
map.signal_ids = addUnique(map.signal_ids, signalIds);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56p-action-ledger"),
  {
    id: "node-phase56p-action-ledger",
    label: "Twenty-two letter-named priority actions",
    node_type: "Signal",
    note: "Five DOE, four HHS, eight DOT, and five VA actions publish under local keys; no Phase 56F evidence state changes.",
  },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56p-action-ledger" && link.to !== "node-phase56p-action-ledger"),
  { from: "node-phase56p-action-ledger", to: "node-phase56o-cross-agency-remediation", relationship: "Depends On", confidence: "Supported", note: "Phase 56P decomposes four Phase 56O portfolios into action text explicitly named by the official letters." },
  { from: "node-phase56p-action-ledger", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Local action keys, underlying recommendation identities, agency responses, and implementation states are not interchangeable denominators." },
  { from: "node-phase56p-action-ledger", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "A named open priority action does not establish performance, operating outcomes, savings, readiness, safety, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Twenty-two exact letter-named actions with stable agency, letter, subject, local key, status period, identity boundary, limitation, and continuation rule.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That FTFN action keys are official GAO recommendation numbers or that a named priority action has been implemented or closed.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Official GAO Recommendations Database identities, agency responses, and later status or operating-outcome records for Phase 56P actions.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56P across four coverage rails, three reader pathways, six topics, two organizations, and one comparison map.");
