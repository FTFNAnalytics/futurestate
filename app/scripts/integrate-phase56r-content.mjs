import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56r-implementation-artifact-milestone-ledger.json";
const collectionId = "research-collection-gao-recommendation-implementation-artifact-milestone-ledger-2026";
const briefingId = "briefing-research-watch-022-recommendation-implementation-artifacts-milestones";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const recordsByEntity = new Map();
for (const record of ledger.records) recordsByEntity.set(record.entity_id, [...(recordsByEntity.get(record.entity_id) ?? []), record]);
const recordsByAgency = (code) => ledger.records.filter((record) => record.parent_action_key.startsWith(`${code}-`));
const sourcesFor = (records) => [...new Set(records.flatMap((record) => [record.source_id, ...(record.supporting_source_ids ?? [])]))];
const signalsFor = (records) => records.map((record) => record.signal_id);
const allSources = sourcesFor(ledger.records);
const allSignals = signalsFor(ledger.records);

if (ledger.records.length !== 24 || ledger.recommendation_specific_children !== 4) {
  throw new Error("Phase 56R integration requires twenty-four recommendation records and four children.");
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
    record.phase_56r_implementation_artifact_milestone_follow_through = matches.map((entry) => ({
      action_key: entry.action_key,
      parent_action_key: entry.parent_action_key,
      record_relationship: entry.record_relationship,
      official_identity: entry.official_identity,
      current_status: entry.current_status,
      normalized_implementation_stage: entry.normalized_implementation_stage,
      response_artifact_type: entry.response_artifact_type,
      artifact_availability: entry.artifact_availability,
      named_milestone: entry.named_milestone,
      milestone_state: entry.milestone_state,
      gao_review_state: entry.gao_review_state,
      remaining_gap: entry.remaining_gap,
      continuation_rule: entry.continuation_rule,
      source_ids: [entry.source_id, ...(entry.supporting_source_ids ?? [])],
      signal_id: entry.signal_id,
    }));
    record.phase_56r_coverage_decision = {
      prior_closure_status: record.phase_56q_coverage_decision?.current_closure_status ?? "Partially Closed",
      current_closure_status: record.phase_56q_coverage_decision?.current_closure_status ?? "Partially Closed",
      decision: "Retain the Phase 56F entity evidence state. Recommendation-specific artifacts and milestones deepen follow-through but do not establish implementation, closure, or operating outcome.",
      recommendation_records: matches.length,
      child_records: matches.filter((entry) => entry.record_relationship === "Recommendation-specific child").length,
    };
  }
  entityLedger.phase_56r_continuation_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    records: ledger.records,
    state: "Phase 56R publishes twenty-four recommendation-specific artifact and milestone records, including four children that resolve the two held parent mappings.",
    boundary: "Promise, artifact availability, submission, GAO review, partial addressing, implementation, closure, entity evidence state, and operating outcome remain distinct.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    records: recordsByAgency("DOT"),
    state: "Phase 56R connects eight DOT recommendations to current artifacts, milestone periods, GAO review states, and exact remaining gaps.",
    boundary: "A public FAA or DOT plan does not establish implementation, authorization, integration, deployment, safety, or service outcome.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    records: recordsByAgency("DOE"),
    state: "Phase 56R connects all five DOE recommendations to the current artifact state, milestone, official review state, and remaining gap.",
    boundary: "A cost estimate, review, analysis, policy, or pause decision remains management evidence rather than project completion, service, savings, or outcome evidence.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, sourcesFor(spec.records));
  pathway.signal_ids = addUnique((pathway.signal_ids ?? []).filter((id) => !id.startsWith("signal-56r-")), signalsFor(spec.records));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56R implementation artifacts and milestones"),
    { stage: "Phase 56R implementation artifacts and milestones", current_state: spec.state, boundary: spec.boundary },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "HHS-04 and VA-02 remain parent crosswalks; their recommendation-specific children do not overwrite them.",
    "Named dates are bounded monitors and do not pause content expansion.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Later GAO decisions on submitted artifacts, late-2026 milestone deliverables, exact implementation evidence, and attributable operating outcomes.",
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
    "Which Phase 56R artifact next receives an official GAO sufficiency decision?",
    "Which late-2026 milestone produces an attributable implementation artifact rather than another promise?",
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
map.summary = "A comparison and inference protocol: 24 entity coverage states now carry exact continuation decisions through Phase 56R, while parent action, child recommendation, artifact state, milestone, official review, closure, operating outcome, period, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique((map.signal_ids ?? []).filter((id) => !id.startsWith("signal-56r-")), allSignals);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56r-artifact-milestone-ledger"),
  { id: "node-phase56r-artifact-milestone-ledger", label: "Twenty-four recommendation artifact and milestone records", node_type: "Signal", note: "Twenty exact continuations plus four recommendation-specific children preserve the implementation-state boundary." },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56r-artifact-milestone-ledger" && link.to !== "node-phase56r-artifact-milestone-ledger"),
  { from: "node-phase56r-artifact-milestone-ledger", to: "node-phase56q-recommendation-crosswalk", relationship: "Depends On", confidence: "Supported", note: "Phase 56R follows the official identities and two held parents established in Phase 56Q." },
  { from: "node-phase56r-artifact-milestone-ledger", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Parent action, child recommendation, artifact, milestone, review, closure, and outcome use different denominators." },
  { from: "node-phase56r-artifact-milestone-ledger", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Artifacts and milestones do not establish performance, value, readiness, safety, savings, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Twenty-four recommendation-specific records with artifact visibility, normalized implementation stage, named milestone, GAO review state, remaining gap, and continuation rule.",
  "Four child records resolving the HHS-04 and VA-02 holds while preserving both parents.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a public artifact, agency submission, milestone, or partial addressing constitutes implementation, closure, agency performance, or operating outcome.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Official GAO sufficiency decisions, late-2026 milestone artifacts, exact implementation evidence, and attributable operating outcomes for the Phase 56R ledger.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56R across six entity ledgers, three reader pathways, six topics, two organizations, and one comparison map.");
