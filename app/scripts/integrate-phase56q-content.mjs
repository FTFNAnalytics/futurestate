import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56q-recommendation-identity-crosswalk.json";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const collectionId = "research-collection-gao-recommendation-identity-agency-response-crosswalk-2026";
const briefingId = "briefing-research-watch-021-gao-recommendation-identity-agency-response";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const recordsByEntity = new Map();
for (const record of ledger.records) recordsByEntity.set(record.entity_id, [...(recordsByEntity.get(record.entity_id) ?? []), record]);
const recordsByAgency = (code) => ledger.records.filter((record) => record.action_key.startsWith(`${code}-`));
const sourcesFor = (records) => [...new Set(records.map((record) => record.source_id))];
const signalsFor = (records) => records.filter((record) => record.record_status === "Published").map((record) => record.signal_id);
const allSources = sourcesFor(ledger.records);
const allSignals = signalsFor(ledger.records);

if (ledger.records.length !== 22 || ledger.exact_matches !== 20 || ledger.held_local_actions !== 2) {
  throw new Error("Phase 56Q integration requires twenty exact-or-held action records with the 20 / 2 resolution split.");
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
    const matches = recordsByEntity.get(record.entity_id);
    if (!matches) continue;
    record.phase_56q_recommendation_identity_crosswalk = matches.map((entry) => ({
      action_key: entry.action_key,
      resolution_decision: entry.resolution_decision,
      report_id: entry.report_id,
      recommendation_number: entry.recommendation_number,
      official_identity: entry.official_identity,
      candidate_recommendations: entry.candidate_recommendations,
      affected_component: entry.affected_component,
      current_status: entry.current_status,
      agency_response_summary: entry.agency_response_summary,
      last_update_period: entry.last_update_period,
      response_boundary: entry.response_boundary,
      continuation_rule: entry.continuation_rule,
      source_id: entry.source_id,
      signal_id: entry.signal_id,
    }));
    record.phase_56q_coverage_decision = {
      prior_closure_status: record.phase_56p_coverage_decision?.current_closure_status ?? "Partially Closed",
      current_closure_status: record.phase_56p_coverage_decision?.current_closure_status ?? "Partially Closed",
      decision: "Retain the Phase 56F evidence state. Recommendation identity and agency response improve follow-through but do not establish entity-level implementation or operating outcome.",
      exact_matches: matches.filter((entry) => entry.resolution_decision === "Exact one-to-one").length,
      held_mappings: matches.filter((entry) => entry.resolution_decision !== "Exact one-to-one").length,
    };
  }
  entityLedger.phase_56q_continuation_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    records: ledger.records,
    state: "Phase 56Q resolves twenty local actions to exact official GAO report-and-recommendation identities and holds two one-to-many mappings.",
    boundary: "Official identity and agency response do not establish implementation, closure, operating outcome, or agency performance.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    records: recordsByAgency("DOT"),
    state: "Phase 56Q attaches exact official recommendation identities and current response states to all eight DOT actions, including the three emerging-technology records.",
    boundary: "An open FAA or DOT recommendation and its response history do not establish authorization, integration, deployment, safety, or service outcomes.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    records: recordsByAgency("DOE"),
    state: "Phase 56Q attaches exact official recommendation identities and response histories to all five DOE actions.",
    boundary: "Cost estimates, reviews, analyses, and pause conditions remain management evidence rather than project completion, service, savings, or outcome evidence.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, sourcesFor(spec.records));
  pathway.signal_ids = addUnique((pathway.signal_ids ?? []).filter((id) => !id.startsWith("signal-56q-")), signalsFor(spec.records));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56Q recommendation identity and agency response"),
    { stage: "Phase 56Q recommendation identity and agency response", current_state: spec.state, boundary: spec.boundary },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "The official identity is the GAO report number plus recommendation number; FTFN does not invent a separate opaque database ID.",
    "HHS-04 and VA-02 remain held because each local action maps to two official recommendations.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Recommendation-specific implementation artifacts, GAO status changes, and attributable operating outcomes for the Phase 56Q crosswalk.",
  ]);
  await writeJson(path, pathway);
}

const topicSpecs = {
  "policy-and-standards.json": ledger.records,
  "finance-and-risk.json": ledger.records,
  "energy.json": recordsByAgency("DOE"),
  "human-futures.json": [...recordsByAgency("HHS"), ...recordsByAgency("VA")],
  "mobility.json": recordsByAgency("DOT"),
  "aviation.json": recordsByAgency("DOT").filter((record) => record.affected_component.includes("Federal Aviation Administration")),
};
for (const [file, records] of Object.entries(topicSpecs)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  topic.featured_sources = addUnique(topic.featured_sources, sourcesFor(records));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which Phase 56Q exact recommendation next changes official status or gains implementation evidence?",
    "When can HHS-04 and VA-02 be decomposed into recommendation-specific child records without collapsing distinct directives?",
  ]);
  await writeJson(path, topic);
}

for (const [file, sources] of [
  ["org-us-department-energy.json", sourcesFor(recordsByAgency("DOE"))],
  ["org-government-accountability-office.json", allSources],
]) {
  const path = join(contentRoot, "organizations", file);
  const org = await readJson(path);
  org.source_ids = addUnique(org.source_ids, sources);
  await writeJson(path, org);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: 24 entity coverage states now carry exact continuation decisions through Phase 56Q, while local action key, official report-and-recommendation identity, affected component, GAO status, agency response, implementation, closure, operating outcome, period, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique((map.signal_ids ?? []).filter((id) => !id.startsWith("signal-56q-")), allSignals);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56q-recommendation-crosswalk"),
  { id: "node-phase56q-recommendation-crosswalk", label: "Twenty exact identities and two held mappings", node_type: "Signal", note: "Twenty Phase 56P actions resolve one-to-one; HHS-04 and VA-02 remain held as one-to-many mappings." },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56q-recommendation-crosswalk" && link.to !== "node-phase56q-recommendation-crosswalk"),
  { from: "node-phase56q-recommendation-crosswalk", to: "node-phase56p-action-ledger", relationship: "Depends On", confidence: "Supported", note: "Phase 56Q resolves the local action identities established in Phase 56P." },
  { from: "node-phase56q-recommendation-crosswalk", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Local actions, official recommendations, response states, closure states, and operating outcomes are distinct denominators." },
  { from: "node-phase56q-recommendation-crosswalk", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Identity and response evidence do not establish performance, value, readiness, safety, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Twenty exact one-to-one GAO report-and-recommendation identities with affected component, status, agency response, last-update period, limitation, and continuation rule.",
  "Two explicit one-to-many holds covering four candidate recommendations.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That an agency response is implementation, a recommendation status is an entity evidence state, or recommendation closure is an operating outcome.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Implementation artifacts and later GAO status changes for the twenty exact matches, plus recommendation-specific child records for HHS-04 and VA-02.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56Q across six entity ledgers, three reader pathways, six topics, two organizations, and one comparison map.");
