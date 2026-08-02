import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56w-named-record-retrieval-cross-lane-expansion.json";
const collectionId = "research-collection-gao-named-record-retrieval-cross-lane-expansion-2026";
const briefingId = "briefing-research-watch-027-named-record-retrieval";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const recordsByEntity = new Map();
for (const record of ledger.records) recordsByEntity.set(record.entity_id, [...(recordsByEntity.get(record.entity_id) ?? []), record]);
const recordsByAgency = (code) => ledger.records.filter((record) => record.agency === code);
const published = (records) => records.filter((record) => record.record_status === "Published");
const sourcesFor = (records) => [...new Set(records.flatMap((record) => record.supporting_source_ids))];
const signalsFor = (records) => published(records).map((record) => record.signal_id);
const allSources = sourcesFor(ledger.records);
const allSignals = signalsFor(ledger.records);

if (ledger.records.length !== 10 || ledger.records_published !== 6 || ledger.records_held_in_review !== 4 || allSignals.length !== 6) {
  throw new Error("Phase 56W integration requires ten records, six Published signals, and four In Review records.");
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
    record.phase_56w_named_record_retrieval = matches.map((entry) => ({
      record_id: entry.record_id,
      action_key: entry.action_key,
      parent_lead_id: entry.parent_lead_id,
      record_type: entry.record_type,
      record_status: entry.record_status,
      target_artifact: entry.target_artifact,
      finding: entry.finding,
      material_narrowing: entry.material_narrowing,
      evidence_limits: entry.evidence_limits,
      exact_target_artifact_acquired: entry.exact_target_artifact_acquired,
      agency_gao_status_conflict: entry.agency_gao_status_conflict,
      next_action: entry.next_action,
      signal_id: entry.signal_id,
    }));
    const priorStatus = record.phase_56v_coverage_decision?.current_closure_status ?? record.phase_56u_coverage_decision?.current_closure_status ?? "Partially Closed";
    record.phase_56w_coverage_decision = {
      prior_closure_status: priorStatus,
      current_closure_status: priorStatus,
      decision: "Retain the Phase 56F entity evidence state. Phase 56W adds new authoritative status and materially narrower official records but no exact target artifact, GAO acceptance, directive-scope change, implementation change, closure change, or operating outcome.",
      records_reviewed: matches.length,
      records_published: published(matches).length,
      records_held_in_review: matches.filter((entry) => entry.record_status === "In Review").length,
      exact_target_artifacts_acquired: 0,
    };
  }
  entityLedger.phase_56w_named_record_retrieval_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    records: ledger.records,
    state: "Phase 56W reviews seven named recovery targets and three compatible cross-lane records: six new official records are Published, four unchanged target searches remain In Review, and no exact target or closure change is recorded.",
    boundary: "Named, planned, project-level, aggregate, and agency-reported evidence remains separate from exact acquisition, implementation, GAO acceptance, closure, and operating outcomes.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    records: recordsByAgency("DOT"),
    state: "Phase 56W holds the unified-grants award and deployment search In Review while publishing a current four-agency infrastructure-funding status rail that includes DOT only within an aggregate scope.",
    boundary: "Aggregate funding status is not a DOT-only portfolio result or evidence of an awarded, deployed, or operating unified-grants control.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    records: recordsByAgency("DOE"),
    state: "Phase 56W adds NNSA project-cost detail, Hanford decision and progress records, a bounded low-activity-waste plan, and EM infrastructure constraints while holding the complex-wide waste-optimization artifact In Review.",
    boundary: "Project costs, continued implementation, low-activity-waste planning, and asset constraints do not substitute for a complete capability estimate, high-level-waste pause package, or complex-wide disposal optimization.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, sourcesFor(spec.records));
  pathway.signal_ids = addUnique((pathway.signal_ids ?? []).filter((id) => !id.startsWith("signal-56w-")), signalsFor(spec.records));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56W named-record retrieval"),
    { stage: "Phase 56W named-record retrieval", current_state: spec.state, boundary: spec.boundary },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "Four Phase 56W exact-artifact searches remain In Review because no new exact artifact or authoritative narrowing was located.",
    "FTFN submitted no agency contact or FOIA request; public search does not establish nonexistence, withholding, or failure to submit.",
    "The 1 Closed / 21 Partially Closed / 2 Open Phase 56F entity evidence ledger does not change.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "The four JEC records, DOT unified-grants award and operating artifacts, DOE waste-optimization package, NNSA complete capability estimate, Hanford independent analysis and pause record, and HHS qualifying department-wide AARs.",
  ]);
  await writeJson(path, pathway);
}

const topicSpecs = {
  "policy-and-standards.json": ledger.records,
  "finance-and-risk.json": ledger.records,
  "energy.json": recordsByAgency("DOE"),
  "human-futures.json": [...recordsByAgency("HHS"), ...recordsByAgency("VA")],
  "mobility.json": recordsByAgency("DOT"),
};
for (const [file, records] of Object.entries(topicSpecs)) {
  const path = join(contentRoot, "topics", file);
  const topic = await readJson(path);
  topic.featured_sources = addUnique(topic.featured_sources, sourcesFor(records));
  topic.watch_questions = addUnique(topic.watch_questions, [
    "Which Phase 56W held exact-artifact search produces an authoritative public record first?",
    "Which cross-lane input later gains an agency-specific, operating, or realized-outcome denominator?",
  ]);
  await writeJson(path, topic);
}

for (const [file, sourceIds] of [
  ["org-us-department-energy.json", [
    "source-56w-nnsa-fy2027-weapons-activities",
    "source-56w-hanford-dfhlw-amended-rod",
    "source-56w-hanford-hlw-progress-july2026",
  ]],
  ["org-government-accountability-office.json", [
    "source-56w-gao-va-health-transition-status-2025",
    "source-56w-gao-iija-ira-funding-status-2026",
    "source-56w-gao-hanford-law-grout-plans-2026",
    "source-56w-gao-em-aging-infrastructure-2026",
  ]],
]) {
  const path = join(contentRoot, "organizations", file);
  const org = await readJson(path);
  org.source_ids = addUnique(org.source_ids, sourceIds);
  await writeJson(path, org);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: Phase 56W adds six authoritative records and holds four unchanged target searches while exact artifact, agency status, GAO acceptance, implementation, closure, waste stream, project, program, period, outcome, and denominator remain separate.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique((map.signal_ids ?? []).filter((id) => !id.startsWith("signal-56w-")), allSignals);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56w-named-record-retrieval"),
  { id: "node-phase56w-named-record-retrieval", label: "Six Published records and four held searches", node_type: "Signal", note: "Seven new Tier 1 sources support six Published results; four exact-artifact searches remain In Review and zero exact targets are acquired." },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56w-named-record-retrieval" && link.to !== "node-phase56w-named-record-retrieval"),
  { from: "node-phase56w-named-record-retrieval", to: "node-phase56v-supporting-artifact-decomposition", relationship: "Depends On", confidence: "Supported", note: "Phase 56W follows seven named recovery targets exposed by the Phase 56V decomposition." },
  { from: "node-phase56w-named-record-retrieval", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Aggregate, project-level, waste-stream, and potential-savings figures require distinct denominators." },
  { from: "node-phase56w-named-record-retrieval", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "No Phase 56W record supports inferred readiness, safety, realized savings, value, ranking, composite score, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Six current authoritative additions and four explicit publication holds across seven named recovery targets and three compatible cross-lane records.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a named record was acquired, a forecast became an award, a plan became an operating system, a project estimate became a capability estimate, potential savings were realized, or GAO accepted or closed a recommendation.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "Exact JEC, DOT, DOE, NNSA, Hanford, and HHS artifacts plus agency-specific operating and realized-outcome records for the cross-lane additions.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56W across six entity ledgers, three reader pathways, five topics, two organizations, and one comparison map.");
