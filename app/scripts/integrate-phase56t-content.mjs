import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56t-official-response-acquisition-artifact-sufficiency-queue.json";
const collectionId = "research-collection-gao-official-response-acquisition-artifact-sufficiency-decision-queue-2026";
const briefingId = "briefing-research-watch-024-official-response-acquisition-queue";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const recordsByEntity = new Map();
for (const record of ledger.records) recordsByEntity.set(record.entity_id, [...(recordsByEntity.get(record.entity_id) ?? []), record]);
const recordsByAgency = (code) => ledger.records.filter((record) => record.parent_action_key.startsWith(`${code}-`));
const sourcesFor = (records) => [...new Set(records.flatMap((record) => [record.source_id, ...(record.supporting_source_ids ?? []), ...(record.located_source_ids ?? []), ...(record.repository_source_ids ?? [])]))];
const newSourcesFor = (records) => sourcesFor(records).filter((id) => id.startsWith("source-56t-"));
const signalsFor = (records) => records.map((record) => record.signal_id);
const allSources = sourcesFor(ledger.records);
const allSignals = signalsFor(ledger.records);

if (ledger.records.length !== 24 || ledger.directive_elements !== 72 || newSourcesFor(ledger.records).length !== 8) {
  throw new Error("Phase 56T integration requires 24 records, 72 directive elements, and 8 new repository sources.");
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
    record.phase_56t_acquisition_sufficiency_queue = matches.map((entry) => ({
      action_key: entry.action_key,
      official_identity: entry.official_identity,
      decision_class: entry.decision_class,
      target_artifact: entry.target_artifact,
      likely_custodian: entry.likely_custodian,
      acquisition_status: entry.acquisition_status,
      directive_matrix: entry.directive_matrix,
      priority_repositories: entry.priority_repositories,
      search_terms: entry.search_terms,
      stop_rule: entry.stop_rule,
      reopening_trigger: entry.reopening_trigger,
      next_action: entry.next_action,
      gao_acceptance_state: entry.gao_acceptance_state,
      signal_id: entry.signal_id,
    }));
    const priorStatus = record.phase_56s_coverage_decision?.current_closure_status ?? record.phase_56r_coverage_decision?.current_closure_status ?? "Partially Closed";
    record.phase_56t_coverage_decision = {
      prior_closure_status: priorStatus,
      current_closure_status: priorStatus,
      decision: "Retain the Phase 56F entity evidence state. Phase 56T creates retrieval and sufficiency controls but does not establish GAO acceptance, implementation, closure, or operating outcome.",
      recommendation_records: matches.length,
      acquisition_tickets: matches.filter((entry) => entry.decision_class === "Missing-document acquisition ticket").length,
      adjacent_matrices: matches.filter((entry) => entry.decision_class === "Adjacent-source directive matrix").length,
      candidate_matrices: matches.filter((entry) => entry.decision_class === "Public-candidate sufficiency matrix").length,
    };
  }
  entityLedger.phase_56t_acquisition_sufficiency_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    records: ledger.records,
    state: "Phase 56T converts all twenty-four artifact-availability results into controlled acquisition tickets or directive-element sufficiency matrices.",
    boundary: "A repository route, source locator, or FTFN sufficiency matrix is not GAO acceptance, implementation, closure, or outcome evidence.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    records: recordsByAgency("DOT"),
    state: "Phase 56T routes DOT and FAA response artifacts through official reading-room and disclosure surfaces and gives all eight records explicit directive locators.",
    boundary: "The drone strategy, AV framework, and adjacent public plans remain subject to exact directive coverage and GAO's authoritative status decisions.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    records: recordsByAgency("DOE"),
    state: "Phase 56T assigns DOE missing artifacts to named custodians and repositories while preserving two adjacent-source matrices.",
    boundary: "OSTI and NEPA repositories are retrieval rails; they are not substitutes for recommendation-specific estimates, analyses, reviews, or decisions.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, sourcesFor(spec.records));
  pathway.signal_ids = addUnique((pathway.signal_ids ?? []).filter((id) => !id.startsWith("signal-56t-")), signalsFor(spec.records));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56T acquisition and sufficiency queue"),
    { stage: "Phase 56T acquisition and sufficiency queue", current_state: spec.state, boundary: spec.boundary },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "Not publicly acquired does not establish nonexistence, withholding, or a failure to submit.",
    "The 1 Closed / 21 Partially Closed / 2 Open Phase 56F entity evidence ledger does not change.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Exact artifacts released by named custodians, successor directives, and explicit GAO acceptance or remaining-deficiency decisions.",
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
    "Which Phase 56T acquisition ticket yields an exact public response artifact first?",
    "Which public-candidate matrix receives an explicit GAO acceptance or remaining-deficiency decision?",
  ]);
  await writeJson(path, topic);
}

for (const [file, sources] of [
  ["org-us-department-energy.json", newSourcesFor(recordsByAgency("DOE"))],
  ["org-government-accountability-office.json", allSources],
]) {
  const path = join(contentRoot, "organizations", file);
  const org = await readJson(path);
  org.source_ids = addUnique(org.source_ids, sources);
  await writeJson(path, org);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: twenty-four recommendation records now carry controlled retrieval routes and directive-element matrices while source location, visible scope, GAO acceptance, implementation, closure, entity evidence, outcome, period, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique((map.signal_ids ?? []).filter((id) => !id.startsWith("signal-56t-")), allSignals);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56t-acquisition-sufficiency-queue"),
  { id: "node-phase56t-acquisition-sufficiency-queue", label: "Twenty-four controlled acquisition or sufficiency decisions", node_type: "Signal", note: "Eight tickets, thirteen adjacent matrices, and three candidate matrices name retrieval and authority boundaries." },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56t-acquisition-sufficiency-queue" && link.to !== "node-phase56t-acquisition-sufficiency-queue"),
  { from: "node-phase56t-acquisition-sufficiency-queue", to: "node-phase56s-artifact-scope-audit", relationship: "Depends On", confidence: "Supported", note: "Phase 56T operationalizes the Phase 56S availability and scope results." },
  { from: "node-phase56t-acquisition-sufficiency-queue", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Retrieval, scope, acceptance, implementation, closure, and outcome use different evidence tests." },
  { from: "node-phase56t-acquisition-sufficiency-queue", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "The queue does not establish performance, readiness, safety, savings, value, ranking, score, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Eight named missing-document acquisition tickets, thirteen adjacent-source directive matrices, and three public-candidate sufficiency matrices.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a failed public search proves nonexistence or that an FTFN matrix constitutes GAO acceptance, implementation, closure, or operating outcome.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Exact artifacts from named custodians, successor directives, and authoritative GAO sufficiency decisions for the Phase 56T queue.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56T across six entity ledgers, three reader pathways, six topics, two organizations, and one comparison map.");
