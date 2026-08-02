import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const ledger = await readJson(join(dataRoot, "phase-56t-official-response-acquisition-artifact-sufficiency-queue.json"));
const review = await readJson(join(dataRoot, "phase-56t-publication-review.json"));
const phase56s = await readJson(join(dataRoot, "phase-56s-artifact-scope-audit-missing-document-register.json"));
const phase56r = await readJson(join(dataRoot, "phase-56r-implementation-artifact-milestone-ledger.json"));
const collection = await readJson(join(contentRoot, "research-collections", "gao-official-response-acquisition-artifact-sufficiency-decision-queue-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-56t-"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56t-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56t-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const byKey = new Map(ledger.records.map((record) => [record.action_key, record]));
const classes = ledger.decision_class_counts;

check(ledger.phase === "56T", "Phase 56T ledger has the wrong phase.");
check(ledger.records.length === 24 && new Set(ledger.records.map((record) => record.action_key)).size === 24, "Phase 56T must contain twenty-four unique recommendation records.");
check(ledger.directive_elements === 72 && ledger.records.every((record) => record.directive_matrix.length === 3), "Phase 56T must contain exactly three directive decisions per record and seventy-two total elements.");
check(classes["Missing-document acquisition ticket"] === 8, "Phase 56T must contain eight missing-document acquisition tickets.");
check(classes["Adjacent-source directive matrix"] === 13, "Phase 56T must contain thirteen adjacent-source directive matrices.");
check(classes["Public-candidate sufficiency matrix"] === 3, "Phase 56T must contain three public-candidate sufficiency matrices.");
check(["DOT-06", "DOT-08", "VA-03"].every((key) => byKey.get(key)?.decision_class === "Public-candidate sufficiency matrix"), "DOT-06, DOT-08, and VA-03 must remain the three public-candidate matrices.");
check(["DOE-01", "DOE-02", "DOE-05", "HHS-04-R1", "HHS-04-R2", "DOT-05", "VA-04", "VA-05"].every((key) => byKey.get(key)?.decision_class === "Missing-document acquisition ticket"), "The exact eight Phase 56S missing-public-copy records must receive acquisition tickets.");
check(ledger.records.every((record) => record.target_artifact && record.likely_custodian && record.priority_repositories.length >= 4 && record.search_terms.length >= 4), "Every Phase 56T record must name an artifact, custodian, at least four repositories, and at least four search terms.");
check(ledger.records.every((record) => record.stop_rule && record.reopening_trigger && record.next_action && record.gao_acceptance_state), "Every Phase 56T record must include retrieval controls and a GAO-acceptance state.");
check(ledger.records.every((record) => record.directive_matrix.every((entry) => entry.locator && entry.authority_boundary)), "Every directive decision must contain a locator and authority boundary.");
check(ledger.records.every((record) => record.implementation_change === false && record.closure_change === false), "Every Phase 56T record must preserve no implementation or closure change.");
check(ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 56T must record zero implementation and closure changes.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56T must preserve the 1 / 21 / 2 entity evidence ledger.");
check(JSON.stringify(ledger.scope_element_counts) === JSON.stringify(phase56s.scope_element_counts), "Phase 56T must preserve the Phase 56S 3 / 23 / 46 visible-scope result.");
check(phase56r.records.length === 24 && !phase56r.records.some((record) => ["Implemented", "Closed"].includes(record.normalized_implementation_stage)), "Phase 56T must not alter the Phase 56R implementation ledger.");
check(sourceFiles.length === 8 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56T must add eight current Tier 1 repository-routing sources.");
check(ledger.records.every((record) => record.repository_source_ids.length === 2 && record.repository_source_ids.every((id) => sources.some((source) => source.id === id))), "Every record must link its agency's two Phase 56T repository sources.");
check(review.new_source_profiles === 8 && review.document_decisions.promoted.length === 24 && review.document_decisions.held.length === 0, "Phase 56T publication review must promote twenty-four documents and eight sources with no document holds.");
check(review.signal_decisions.promoted.length === 24 && review.signal_decisions.held.length === 0, "Phase 56T publication review must promote all twenty-four signals.");
check(collection.document_ids.length === 24, "Phase 56T collection must reference twenty-four documents.");
check(documents.length === 24 && documents.every((document) => document.record_status === "Published" && document.capture_status === "Official link record"), "Phase 56T must generate twenty-four Published official-link documents.");
check(signalFiles.length === 24, "Phase 56T must generate twenty-four Published signals.");
check(documents.every((document) => document.evidence_limits.some((item) => item.includes("does not mean")) && document.evidence_limits.some((item) => item.includes("GAO"))), "Every Phase 56T document must preserve nonexistence and GAO-authority boundaries.");

for (const { file, key, expectedEntities, expectedRecords } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expectedEntities: 3, expectedRecords: 19 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expectedEntities: 3, expectedRecords: 19 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expectedEntities: 3, expectedRecords: 19 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56t_acquisition_sufficiency_ledger === "phase-56t-official-response-acquisition-artifact-sufficiency-queue.json", `${file} does not name the Phase 56T queue ledger.`);
  check(entityLedger[key].filter((record) => record.phase_56t_coverage_decision).length === expectedEntities, `${file} must integrate ${expectedEntities} Phase 56T agency decision(s).`);
  check(entityLedger[key].reduce((sum, record) => sum + (record.phase_56t_acquisition_sufficiency_queue?.length ?? 0), 0) === expectedRecords, `${file} must integrate ${expectedRecords} Phase 56T recommendation records.`);
  check(entityLedger[key].filter((record) => record.phase_56t_coverage_decision).every((record) => record.phase_56t_coverage_decision.prior_closure_status === record.phase_56t_coverage_decision.current_closure_status), `${file} must preserve every prior entity closure status.`);
}

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-024-official-response-acquisition-queue"), `${file} must link Research Watch 024.`);
  check(pathway.research_collection_ids.includes("research-collection-gao-official-response-acquisition-artifact-sufficiency-decision-queue-2026"), `${file} must link the Phase 56T collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56T acquisition and sufficiency queue"), `${file} must include the Phase 56T dependency stage.`);
}

await access(join(appRoot, "public", "downloads", "gao-official-response-acquisition-artifact-sufficiency-decision-queue-2026.zip"));

if (failures.length) {
  console.error("Phase 56T assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56T assertions passed: 8 acquisition tickets, 13 adjacent matrices, 3 public-candidate matrices, 72 directive decisions, 8 repository sources, zero implementation or closure changes, and an unchanged 1 / 21 / 2 entity evidence ledger.");
