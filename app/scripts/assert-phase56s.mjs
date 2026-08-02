import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const ledger = await readJson(join(dataRoot, "phase-56s-artifact-scope-audit-missing-document-register.json"));
const review = await readJson(join(dataRoot, "phase-56s-publication-review.json"));
const phase56q = await readJson(join(dataRoot, "phase-56q-recommendation-identity-crosswalk.json"));
const phase56r = await readJson(join(dataRoot, "phase-56r-implementation-artifact-milestone-ledger.json"));
const collection = await readJson(join(contentRoot, "research-collections", "gao-recommendation-artifact-scope-audit-missing-document-register-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-56s-"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56s-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56s-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const byKey = new Map(ledger.records.map((record) => [record.action_key, record]));
const availability = ledger.availability_class_counts;
const scope = ledger.scope_element_counts;
const allLocatedSources = [...new Set(ledger.records.flatMap((record) => record.located_source_ids).filter((id) => id.startsWith("source-56s-")))];

check(ledger.phase === "56S", "Phase 56S ledger has the wrong phase.");
check(ledger.records.length === 24 && new Set(ledger.records.map((record) => record.action_key)).size === 24, "Phase 56S must contain twenty-four unique recommendation records.");
check(ledger.scope_elements === 72 && ledger.records.every((record) => record.scope_checklist.length === 3 && record.scope_elements_total === 3), "Phase 56S must contain exactly three scope checks per record and seventy-two total elements.");
check(scope.supported === 3 && scope.partial === 23 && scope.not_established === 46, "Phase 56S must preserve the 3 supported / 23 partial / 46 not-established scope result.");
check(availability["Public candidate artifact; GAO sufficiency unresolved"] === 3, "Phase 56S must contain three public candidate artifacts with unresolved GAO sufficiency.");
check(availability["Scope-adjacent public material located"] === 13, "Phase 56S must contain thirteen scope-adjacent public-material results.");
check(availability["No separately public response artifact located"] === 8, "Phase 56S must contain eight missing-public-response results.");
check(["DOT-06", "DOT-08", "VA-03"].every((key) => byKey.get(key)?.availability_class === "Public candidate artifact; GAO sufficiency unresolved"), "DOT-06, DOT-08, and VA-03 must remain the three public candidate artifacts.");
check(ledger.records.every((record) => typeof record.gao_acceptance_state === "string" && record.gao_acceptance_state.length > 0 && record.implementation_change === false && record.closure_change === false), "Every Phase 56S record must preserve a named GAO-acceptance state and no implementation or closure change.");
check(ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 56S must record zero implementation and closure changes.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56S must preserve the 1 / 21 / 2 entity evidence ledger.");
check(phase56r.records.length === 24 && !phase56r.records.some((record) => ["Implemented", "Closed"].includes(record.normalized_implementation_stage)), "Phase 56S must not alter the Phase 56R implementation ledger.");
check(phase56q.records.find((record) => record.action_key === "HHS-04")?.record_status === "In Review" && phase56q.records.find((record) => record.action_key === "VA-02")?.record_status === "In Review", "Phase 56S must preserve the HHS-04 and VA-02 parent holds.");
check(sourceFiles.length === 12 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56S must add twelve current Tier 1 official source profiles.");
check(allLocatedSources.length === 12 && allLocatedSources.every((id) => sources.some((source) => source.id === id)), "All twelve new sources must appear in recommendation-level located-source lists.");
check(review.new_source_profiles === 12 && review.document_decisions.promoted.length === 24 && review.document_decisions.held.length === 0, "Phase 56S publication review must promote twenty-four documents and twelve sources with no document holds.");
check(review.signal_decisions.promoted.length === 24 && review.signal_decisions.held.length === 0, "Phase 56S publication review must promote all twenty-four signals.");
check(collection.document_ids.length === 24, "Phase 56S collection must reference twenty-four documents.");
check(documents.length === 24 && documents.every((document) => document.record_status === "Published" && document.capture_status === "Official link record"), "Phase 56S must generate twenty-four Published official-link documents.");
check(signalFiles.length === 24, "Phase 56S must generate twenty-four signals.");
check(documents.every((document) => document.evidence_limits.some((item) => item.includes("does not mean")) && document.evidence_limits.some((item) => item.includes("GAO"))), "Every Phase 56S document must preserve availability and GAO-authority boundaries.");

for (const { file, key, expectedEntities, expectedRecords } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expectedEntities: 3, expectedRecords: 19 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expectedEntities: 3, expectedRecords: 19 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expectedEntities: 3, expectedRecords: 19 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56s_scope_audit_ledger === "phase-56s-artifact-scope-audit-missing-document-register.json", `${file} does not name the Phase 56S scope-audit ledger.`);
  check(entityLedger[key].filter((record) => record.phase_56s_coverage_decision).length === expectedEntities, `${file} must integrate ${expectedEntities} Phase 56S agency decision(s).`);
  check(entityLedger[key].reduce((sum, record) => sum + (record.phase_56s_artifact_scope_audit?.length ?? 0), 0) === expectedRecords, `${file} must integrate ${expectedRecords} Phase 56S recommendation records.`);
  check(entityLedger[key].filter((record) => record.phase_56s_coverage_decision).every((record) => record.phase_56s_coverage_decision.prior_closure_status === record.phase_56s_coverage_decision.current_closure_status), `${file} must preserve every prior entity closure status.`);
}

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-023-recommendation-artifact-scope-audit"), `${file} must link Research Watch 023.`);
  check(pathway.research_collection_ids.includes("research-collection-gao-recommendation-artifact-scope-audit-missing-document-register-2026"), `${file} must link the Phase 56S collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56S artifact scope audit"), `${file} must include the Phase 56S dependency stage.`);
}

await access(join(appRoot, "public", "downloads", "gao-recommendation-artifact-scope-audit-missing-document-register-2026.zip"));

if (failures.length) {
  console.error("Phase 56S assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56S assertions passed: twenty-four recommendation audits, seventy-two scope elements, twelve official sources, 3 / 13 / 8 availability classes, zero implementation or closure changes, and an unchanged 1 / 21 / 2 entity evidence ledger.");
