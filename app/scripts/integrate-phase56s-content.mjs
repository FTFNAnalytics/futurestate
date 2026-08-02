import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56s-artifact-scope-audit-missing-document-register.json";
const collectionId = "research-collection-gao-recommendation-artifact-scope-audit-missing-document-register-2026";
const briefingId = "briefing-research-watch-023-recommendation-artifact-scope-audit";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const recordsByEntity = new Map();
for (const record of ledger.records) recordsByEntity.set(record.entity_id, [...(recordsByEntity.get(record.entity_id) ?? []), record]);
const recordsByAgency = (code) => ledger.records.filter((record) => record.parent_action_key.startsWith(`${code}-`));
const sourcesFor = (records) => [...new Set(records.flatMap((record) => [record.source_id, ...(record.supporting_source_ids ?? []), ...(record.located_source_ids ?? [])]))];
const newSourcesFor = (records) => sourcesFor(records).filter((id) => id.startsWith("source-56s-"));
const signalsFor = (records) => records.map((record) => record.signal_id);
const allSources = sourcesFor(ledger.records);
const allNewSources = newSourcesFor(ledger.records);
const allSignals = signalsFor(ledger.records);

if (ledger.records.length !== 24 || ledger.scope_elements !== 72 || allNewSources.length !== 12) {
  throw new Error("Phase 56S integration requires 24 records, 72 scope elements, and 12 new sources.");
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
    record.phase_56s_artifact_scope_audit = matches.map((entry) => ({
      action_key: entry.action_key,
      parent_action_key: entry.parent_action_key,
      official_identity: entry.official_identity,
      availability_class: entry.availability_class,
      scope_elements_total: entry.scope_elements_total,
      public_supported_elements: entry.public_supported_elements,
      public_partially_supported_elements: entry.public_partially_supported_elements,
      public_unestablished_elements: entry.public_unestablished_elements,
      scope_checklist: entry.scope_checklist,
      repositories_checked: entry.repositories_checked,
      located_source_ids: entry.located_source_ids,
      search_finding: entry.search_finding,
      ftfn_scope_finding: entry.ftfn_scope_finding,
      gao_acceptance_state: entry.gao_acceptance_state,
      signal_id: entry.signal_id,
    }));
    record.phase_56s_coverage_decision = {
      prior_closure_status: record.phase_56r_coverage_decision?.current_closure_status ?? "Partially Closed",
      current_closure_status: record.phase_56r_coverage_decision?.current_closure_status ?? "Partially Closed",
      decision: "Retain the Phase 56F entity evidence state. Public-document availability and FTFN scope findings deepen the evidence shelf but do not establish GAO acceptance, implementation, closure, or operating outcome.",
      recommendation_records: matches.length,
      scope_elements: matches.reduce((sum, entry) => sum + entry.scope_elements_total, 0),
    };
  }
  entityLedger.phase_56s_scope_audit_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    records: ledger.records,
    state: "Phase 56S audits seventy-two directive elements across twenty-four recommendations and distinguishes public candidate artifacts, scope-adjacent records, and missing public copies.",
    boundary: "Repository availability, FTFN document-scope findings, GAO acceptance, implementation, closure, entity evidence, and operating outcomes remain separate.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    records: recordsByAgency("DOT"),
    state: "Phase 56S gives all eight DOT recommendation records an element-level scope audit and a named public-document availability result.",
    boundary: "A DOT or FAA plan, report, dashboard, or budget record is not sufficient merely because it is public and adjacent to the directive.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    records: recordsByAgency("DOE"),
    state: "Phase 56S gives all five DOE recommendation records an element-level scope audit and records two adjacent public sources plus three unresolved public-document gaps.",
    boundary: "An adjacent review or assessment guide does not establish the recommendation-specific plan, analysis, oversight, pause condition, implementation, or outcome.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, sourcesFor(spec.records));
  pathway.signal_ids = addUnique((pathway.signal_ids ?? []).filter((id) => !id.startsWith("signal-56s-")), signalsFor(spec.records));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56S artifact scope audit"),
    { stage: "Phase 56S artifact scope audit", current_state: spec.state, boundary: spec.boundary },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "Not publicly located does not mean nonexistent, and a public candidate artifact is not necessarily sufficient.",
    "The 1 Closed / 21 Partially Closed / 2 Open Phase 56F entity evidence ledger does not change.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Exact agency response artifacts, official GAO sufficiency decisions, and later attributable implementation and operating-outcome evidence.",
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
    "Which missing Phase 56S response artifact becomes separately public next?",
    "Which public candidate artifact receives an official GAO sufficiency decision?",
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
map.summary = "A comparison and inference protocol: twenty-four recommendation records now carry seventy-two directive-element checks and explicit public-document availability findings, while FTFN scope, GAO acceptance, implementation, closure, entity evidence, outcome, period, denominator, and reopening boundaries remain attached.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique((map.signal_ids ?? []).filter((id) => !id.startsWith("signal-56s-")), allSignals);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56s-artifact-scope-audit"),
  { id: "node-phase56s-artifact-scope-audit", label: "Seventy-two directive-element checks", node_type: "Signal", note: "Twenty-four records distinguish public candidates, adjacent material, missing public copies, and unresolved authoritative acceptance." },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56s-artifact-scope-audit" && link.to !== "node-phase56s-artifact-scope-audit"),
  { from: "node-phase56s-artifact-scope-audit", to: "node-phase56r-artifact-milestone-ledger", relationship: "Depends On", confidence: "Supported", note: "Phase 56S audits the exact artifact and milestone records established in Phase 56R." },
  { from: "node-phase56s-artifact-scope-audit", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Availability, scope, acceptance, implementation, closure, and outcome use different evidence tests." },
  { from: "node-phase56s-artifact-scope-audit", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "The shelf does not establish performance, readiness, safety, savings, value, ranking, score, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Twenty-four recommendation-level public-document searches and seventy-two directive-element scope findings.",
  "Separate availability results for three public candidates, thirteen adjacent records, and eight missing public copies.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That public availability or an FTFN scope finding constitutes GAO acceptance, implementation, closure, agency performance, or operating outcome.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Exact missing agency response documents, official sufficiency decisions, and attributable implementation and operating-outcome evidence for the Phase 56S register.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56S across six entity ledgers, three reader pathways, six topics, two organizations, and one comparison map.");
