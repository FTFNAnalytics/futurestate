import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56v-second-order-recovery-leads-supporting-artifacts.json";
const collectionId = "research-collection-gao-second-order-recovery-leads-supporting-artifacts-2026";
const briefingId = "briefing-research-watch-026-second-order-recovery-leads";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const recordsByEntity = new Map();
for (const record of ledger.records) recordsByEntity.set(record.entity_id, [...(recordsByEntity.get(record.entity_id) ?? []), record]);
const recordsByAgency = (code) => ledger.records.filter((record) => record.action_key.startsWith(`${code}-`));
const sourcesFor = (records) => [...new Set(records.flatMap((record) => [record.source_id, ...(record.downstream_source_ids ?? [])]))];
const newSourcesFor = (records) => sourcesFor(records).filter((id) => id.startsWith("source-56v-"));
const signalsFor = (records) => records.map((record) => record.signal_id);
const allSources = sourcesFor(ledger.records);
const allSignals = signalsFor(ledger.records);

if (ledger.records.length !== 10 || newSourcesFor(ledger.records).length !== 12 || ledger.parent_near_matches_decomposed !== 10) {
  throw new Error("Phase 56V integration requires ten lead chains, twelve new sources, and ten decomposed near-matches.");
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
    record.phase_56v_supporting_artifact_decomposition = matches.map((entry) => ({
      lead_id: entry.lead_id,
      action_key: entry.action_key,
      official_identity: entry.official_identity,
      target_artifact: entry.target_artifact,
      lead_type: entry.lead_type,
      phase_56u_near_match: entry.phase_56u_near_match,
      decomposition_path: entry.decomposition_path,
      material_narrowing: entry.material_narrowing,
      exact_target_artifact_acquired: entry.exact_target_artifact_acquired,
      recommendation_specific_supporting_artifact_located: entry.recommendation_specific_supporting_artifact_located,
      directive_element_tests: entry.directive_element_tests,
      stop_rule: entry.stop_rule,
      reopening_trigger: entry.reopening_trigger,
      next_action: entry.next_action,
      signal_id: entry.signal_id,
    }));
    const priorStatus = record.phase_56u_coverage_decision?.current_closure_status ?? record.phase_56t_coverage_decision?.current_closure_status ?? "Partially Closed";
    record.phase_56v_coverage_decision = {
      prior_closure_status: priorStatus,
      current_closure_status: priorStatus,
      decision: "Retain the Phase 56F entity evidence state. Phase 56V adds downstream locators and supporting-artifact chains but no exact target artifact, GAO acceptance, directive-scope change, implementation, closure, or operating outcome.",
      parent_near_matches_decomposed: matches.length,
      official_supporting_artifacts_profiled: matches.reduce((sum, entry) => sum + entry.official_supporting_artifacts_profiled, 0),
      recommendation_specific_supporting_artifacts_located: matches.filter((entry) => entry.recommendation_specific_supporting_artifact_located).length,
      exact_target_artifacts_acquired: 0,
    };
  }
  entityLedger.phase_56v_supporting_artifact_decomposition_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    records: ledger.records,
    state: "Phase 56V converts all ten Phase 56U near-matches into named second-order chains across twelve official supporting sources; no exact target artifact or directive-scope change is recorded.",
    boundary: "A supporting artifact, plan, template, budget line, forecast, authority memorandum, or correspondence record is not the target artifact or authoritative implementation evidence.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    records: recordsByAgency("DOT"),
    state: "Phase 56V decomposes DOT's three near-matches into the OIG financial-stewardship branch, the unified-grants procurement branch, and the January 2026 grants-guidance branch.",
    boundary: "Oversight context, a procurement forecast, and general grant rules do not establish a portfolio-wide operating risk assessment across DOT administrations.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    records: recordsByAgency("DOE"),
    state: "Phase 56V names NNSA's Production Modernization budget lineage, EM's Waste Disposal Office, and Hanford's 2023 AoA-to-2025-supplement chain while retaining all three DOE target artifacts as unacquired.",
    boundary: "Program lineage and cited analyses cannot substitute for the recommendation-specific estimate, complex-wide optimization, or Hanford pause and prerequisite package.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, sourcesFor(spec.records));
  pathway.signal_ids = addUnique((pathway.signal_ids ?? []).filter((id) => !id.startsWith("signal-56v-")), signalsFor(spec.records));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56V second-order recovery leads"),
    { stage: "Phase 56V second-order recovery leads", current_state: spec.state, boundary: spec.boundary },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "FTFN submitted no agency contact or FOIA request in this public-record decomposition.",
    "The 1 Closed / 21 Partially Closed / 2 Open Phase 56F entity evidence ledger does not change.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "The exact target artifacts, newly named attachments and plans, or explicit GAO acceptance and remaining-deficiency decisions for the eight acquisition tickets.",
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
    "Which Phase 56V supporting-artifact chain yields an exact target or authoritative remaining-deficiency decision first?",
    "Which named plan, attachment, system award, or completed AAR becomes separately public next?",
  ]);
  await writeJson(path, topic);
}

for (const [file, sourceIds] of [
  ["org-us-department-energy.json", newSourcesFor(recordsByAgency("DOE"))],
  ["org-government-accountability-office.json", allSources],
]) {
  const path = join(contentRoot, "organizations", file);
  const org = await readJson(path);
  org.source_ids = addUnique(org.source_ids, sourceIds);
  await writeJson(path, org);
}

const mapPath = join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json");
const map = await readJson(mapPath);
map.summary = "A comparison and inference protocol: ten Phase 56U near-matches now resolve to named second-order artifacts while target, supporting record, agency status, GAO acceptance, directive scope, implementation, closure, entity evidence, outcome, period, denominator, and reopening boundaries remain separate.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique((map.signal_ids ?? []).filter((id) => !id.startsWith("signal-56v-")), allSignals);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56v-supporting-artifact-decomposition"),
  { id: "node-phase56v-supporting-artifact-decomposition", label: "Ten second-order supporting-artifact chains", node_type: "Signal", note: "Twelve official sources add ten materially narrower locators and one recommendation-specific supporting artifact; exact targets remain unacquired." },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56v-supporting-artifact-decomposition" && link.to !== "node-phase56v-supporting-artifact-decomposition"),
  { from: "node-phase56v-supporting-artifact-decomposition", to: "node-phase56u-exact-artifact-recovery", relationship: "Depends On", confidence: "Supported", note: "Phase 56V decomposes all ten Phase 56U official near-matches exactly once." },
  { from: "node-phase56v-supporting-artifact-decomposition", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "A supporting locator and the target artifact use different evidence tests." },
  { from: "node-phase56v-supporting-artifact-decomposition", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "The supporting records do not establish performance, readiness, safety, savings, value, ranking, score, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Ten bounded second-order chains across twelve official sources, including one recommendation-specific VA supporting artifact.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That a supporting artifact is the exact target, that a planned action occurred, or that GAO accepted, implemented, or closed any recommendation.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "The eight exact target artifacts plus the newly named JEC, DOT system, DOE analysis, NNSA estimate, Hanford decision, and HHS AAR records.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56V across six entity ledgers, three reader pathways, five topics, two organizations, and one comparison map.");
