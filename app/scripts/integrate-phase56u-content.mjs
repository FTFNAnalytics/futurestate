import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const ledgerFile = "phase-56u-custodian-exact-artifact-recovery-batch-one.json";
const collectionId = "research-collection-gao-custodian-exact-artifact-recovery-batch-one-2026";
const briefingId = "briefing-research-watch-025-exact-artifact-recovery-batch-one";
const ledger = JSON.parse(await readFile(join(dataRoot, ledgerFile), "utf8"));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const addUnique = (items = [], additions = []) => [...new Set([...items, ...additions])];
const recordsByEntity = new Map();
for (const record of ledger.records) recordsByEntity.set(record.entity_id, [...(recordsByEntity.get(record.entity_id) ?? []), record]);
const recordsByAgency = (code) => ledger.records.filter((record) => record.parent_action_key.startsWith(`${code}-`));
const sourcesFor = (records) => [...new Set(records.flatMap((record) => [record.source_id, ...(record.repository_source_ids ?? []), ...(record.new_recovery_source_ids ?? [])]))];
const newSourcesFor = (records) => sourcesFor(records).filter((id) => id.startsWith("source-56u-"));
const signalsFor = (records) => records.map((record) => record.signal_id);
const allSources = sourcesFor(ledger.records);
const allSignals = signalsFor(ledger.records);

if (ledger.records.length !== 8 || newSourcesFor(ledger.records).length !== 7 || ledger.near_matches_reviewed !== 10) {
  throw new Error("Phase 56U integration requires eight records, seven new sources, and ten reviewed near-matches.");
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
    record.phase_56u_exact_artifact_recovery = matches.map((entry) => ({
      action_key: entry.action_key,
      official_identity: entry.official_identity,
      target_artifact: entry.target_artifact,
      likely_custodian: entry.likely_custodian,
      result_class: entry.result_class,
      exact_target_artifact_acquired: entry.exact_target_artifact_acquired,
      near_matches: entry.current_official_near_matches,
      search_surfaces: entry.search_surfaces,
      official_repository_result: entry.official_repository_result,
      stop_rule: entry.stop_rule,
      reopening_trigger: entry.reopening_trigger,
      next_action: entry.next_action,
      agency_status_conflict: entry.agency_status_conflict,
      gao_acceptance_state: entry.gao_acceptance_state,
      signal_id: entry.signal_id,
    }));
    const priorStatus = record.phase_56t_coverage_decision?.current_closure_status ?? record.phase_56s_coverage_decision?.current_closure_status ?? "Partially Closed";
    record.phase_56u_coverage_decision = {
      prior_closure_status: priorStatus,
      current_closure_status: priorStatus,
      decision: "Retain the Phase 56F entity evidence state. Phase 56U records public recovery results and near-match boundaries but no exact target artifact, GAO acceptance, implementation, closure, or operating outcome.",
      acquisition_tickets_checked: matches.length,
      exact_target_artifacts_acquired: matches.filter((entry) => entry.exact_target_artifact_acquired).length,
      near_matches_reviewed: matches.reduce((sum, entry) => sum + entry.near_match_count, 0),
      agency_status_conflicts: matches.filter((entry) => entry.agency_status_conflict).length,
    };
  }
  entityLedger.phase_56u_exact_artifact_recovery_ledger = ledgerFile;
  await writeJson(path, entityLedger);
}

const pathwaySpecs = [
  {
    file: "policy-standards-to-implementation.json",
    records: ledger.records,
    state: "Phase 56U completes eight custodian-level public recovery passes: no exact target artifact was acquired, ten official near-matches were bounded, and one agency-GAO status conflict was preserved.",
    boundary: "A failed public search, near-match, or agency self-assessment is not nonexistence, GAO acceptance, implementation, closure, or outcome evidence.",
  },
  {
    file: "autonomy-regulation-to-service.json",
    records: recordsByAgency("DOT"),
    state: "Phase 56U checks the DOT grants-risk custodian trail against the public performance plan, financial report, grants office, reading room, and current GAO page; the January 2026 guidance remains unavailable.",
    boundary: "Broad ERM descriptions and office authority do not establish the recommendation-specific grant-agreement risk method or GAO acceptance.",
  },
  {
    file: "energy-grid-capacity-to-service.json",
    records: recordsByAgency("DOE"),
    state: "Phase 56U adds recommendation-specific DOE congressional status for three tickets while retaining the exact life-cycle estimate, disposal analyses, and Hanford pause package as unacquired.",
    boundary: "DOE's status table is a first-party agency statement; where it conflicts with GAO, FTFN retains GAO's current recommendation status.",
  },
];
for (const spec of pathwaySpecs) {
  const path = join(contentRoot, "reader-pathways", spec.file);
  const pathway = await readJson(path);
  pathway.current_state = addUnique(pathway.current_state, [spec.state]);
  pathway.source_ids = addUnique(pathway.source_ids, sourcesFor(spec.records));
  pathway.signal_ids = addUnique((pathway.signal_ids ?? []).filter((id) => !id.startsWith("signal-56u-")), signalsFor(spec.records));
  pathway.briefing_ids = addUnique(pathway.briefing_ids, [briefingId]);
  pathway.research_collection_ids = addUnique(pathway.research_collection_ids, [collectionId]);
  pathway.dependency_stack = [
    ...(pathway.dependency_stack ?? []).filter((item) => item.stage !== "Phase 56U exact-artifact recovery batch one"),
    { stage: "Phase 56U exact-artifact recovery batch one", current_state: spec.state, boundary: spec.boundary },
  ];
  pathway.evidence_limits = addUnique(pathway.evidence_limits, [
    spec.boundary,
    "FTFN submitted no agency contact or FOIA request in this public-repository pass.",
    "The 1 Closed / 21 Partially Closed / 2 Open Phase 56F entity evidence ledger does not change.",
  ]);
  pathway.next_records = addUnique(pathway.next_records, [
    "Exact public artifacts, recommendation correspondence attachments, or explicit GAO acceptance and remaining-deficiency decisions for the eight Phase 56U tickets.",
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
    "Which Phase 56U ticket receives a separately public exact target artifact first?",
    "Which current agency status or near-match receives an explicit GAO acceptance or remaining-deficiency decision?",
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
map.summary = "A comparison and inference protocol: the eight Phase 56T acquisition tickets now carry custodian-level public recovery results while exact target, near-match, agency status, GAO acceptance, implementation, closure, entity evidence, outcome, period, denominator, and reopening boundaries remain separate.";
map.source_ids = addUnique(map.source_ids, allSources);
map.signal_ids = addUnique((map.signal_ids ?? []).filter((id) => !id.startsWith("signal-56u-")), allSignals);
map.nodes = [
  ...map.nodes.filter((node) => node.id !== "node-phase56u-exact-artifact-recovery"),
  { id: "node-phase56u-exact-artifact-recovery", label: "Eight custodian-level public recovery results", node_type: "Signal", note: "Zero exact target artifacts acquired, ten official near-matches bounded, and one agency-GAO status conflict preserved." },
];
map.links = [
  ...map.links.filter((link) => link.from !== "node-phase56u-exact-artifact-recovery" && link.to !== "node-phase56u-exact-artifact-recovery"),
  { from: "node-phase56u-exact-artifact-recovery", to: "node-phase56t-acquisition-sufficiency-queue", relationship: "Depends On", confidence: "Supported", note: "Phase 56U executes the eight Phase 56T missing-document acquisition tickets." },
  { from: "node-phase56u-exact-artifact-recovery", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "Exact artifact, near-match, agency status, acceptance, implementation, closure, and outcome use different evidence tests." },
  { from: "node-phase56u-exact-artifact-recovery", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "The recovery batch does not establish performance, readiness, safety, savings, value, ranking, score, or causation." },
];
map.what_this_map_supports = addUnique(map.what_this_map_supports, [
  "Eight bounded custodian-level public searches, ten reviewed official near-matches, and one explicitly unresolved agency-GAO status conflict.",
]);
map.what_this_map_does_not_prove = addUnique(map.what_this_map_does_not_prove, [
  "That an unacquired public copy is nonexistent, that FTFN submitted an agency request, or that an agency statement or near-match constitutes GAO acceptance, implementation, closure, or outcome.",
]);
map.next_records_needed = addUnique(map.next_records_needed, [
  "The eight exact target artifacts, their public attachments, or authoritative GAO sufficiency decisions triggered by later agency submissions.",
]);
await writeJson(mapPath, map);

console.log("Integrated Phase 56U across six entity ledgers, three reader pathways, five topics, two organizations, and one comparison map.");
