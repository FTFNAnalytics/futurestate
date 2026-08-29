import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const ledger = await readJson(join(dataRoot, "phase-56q-recommendation-identity-crosswalk.json"));
const review = await readJson(join(dataRoot, "phase-56q-publication-review.json"));
const collection = await readJson(join(contentRoot, "research-collections", "gao-recommendation-identity-agency-response-crosswalk-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-56q-"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56q-"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56q-gao-") && name.endsWith("-recommendation-status.json"));
const byKey = new Map(ledger.records.map((record) => [record.action_key, record]));
const exact = ledger.records.filter((record) => record.resolution_decision === "Exact one-to-one");
const held = ledger.records.filter((record) => record.resolution_decision === "Held — one-to-many");

check(ledger.phase === "56Q", "Phase 56Q ledger has the wrong phase.");
check(ledger.records.length === 22 && new Set(ledger.records.map((record) => record.action_key)).size === 22, "Phase 56Q must cover twenty-two unique Phase 56P action keys.");
check(exact.length === 20 && held.length === 2, "Phase 56Q must preserve the 20 exact / 2 held decision split.");
check(held.map((record) => record.action_key).sort().join(",") === "HHS-04,VA-02", "Only HHS-04 and VA-02 may be held.");
check(held.every((record) => record.candidate_recommendations.length === 2 && record.record_status === "In Review" && record.official_identity === null), "Each held record must preserve two candidates without assigning one official identity.");
check(exact.every((record) => record.record_status === "Published" && record.official_identity === `${record.report_id} Recommendation ${record.recommendation_number}`), "Every exact record must publish a report-plus-recommendation identity.");
check(exact.filter((record) => record.current_status === "Open").length === 18, "Phase 56Q must contain eighteen exact Open recommendations.");
check(exact.filter((record) => record.current_status === "Open – Partially Addressed").length === 2, "Phase 56Q must contain two exact Open – Partially Addressed recommendations.");
check(ledger.held_candidate_recommendations === 4, "The two holds must contain four official recommendation candidates.");
check(ledger.closure_changes.length === 0 && ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56Q must preserve the 1 / 21 / 2 evidence ledger.");
check(ledger.inherited_hold.status === "In Review" && ledger.contextual_records_retained.length === 4, "Phase 56Q must retain the HHS tracker hold and four Phase 56O contextual records.");

for (const [key, report, rec] of [
  ["DOE-01", "GAO-23-104661", 1], ["DOE-05", "GAO-24-106989", 3], ["HHS-01", "GAO-16-568", 2],
  ["HHS-03", "GAO-26-107507", 4], ["DOT-02", "GAO-26-107320", 3], ["DOT-03", "GAO-17-20", 1],
  ["DOT-04", "GAO-25-107166", 1], ["DOT-05", "GAO-25-107166", 2], ["DOT-07", "GAO-26-107648", 1],
  ["VA-01", "GAO-25-106969", 2], ["VA-03", "GAO-22-105195", 1], ["VA-04", "GAO-25-107398", 4], ["VA-05", "GAO-24-106189", 5],
]) {
  check(byKey.get(key)?.report_id === report && byKey.get(key)?.recommendation_number === rec, `${key} must resolve to ${report} Recommendation ${rec}.`);
}

check(review.new_source_profiles === 21, "Phase 56Q must add twenty-one official product-page sources.");
check(review.document_decisions.promoted.length === 20 && review.document_decisions.held.length === 2, "Phase 56Q document decisions must be 20 Published / 2 In Review.");
check(review.signal_decisions.promoted.length === 20 && review.signal_decisions.held.length === 2, "Phase 56Q signal decisions must be 20 Published / 2 In Review.");
check(collection.document_ids.length === 22, "Phase 56Q collection must reference twenty-two documents.");
check(documents.length === 22 && documents.filter((document) => document.record_status === "Published").length === 20 && documents.filter((document) => document.record_status === "In Review").length === 2, "Phase 56Q must generate twenty-two documents with a 20 / 2 status split.");
check(signalFiles.length === 22, "Phase 56Q must generate twenty-two signals.");
check(sourceFiles.length === 21, "Phase 56Q must generate twenty-one unique official source profiles.");
check(documents.every((document) => document.capture_status === "Official link record" && document.evidence_limits.length >= 4 && document.key_findings.some((item) => item.startsWith("Resolution decision:")) && document.key_findings.some((item) => item.startsWith("Agency response:")) && document.key_findings.some((item) => item.startsWith("Continuation rule:"))), "Every Phase 56Q document must preserve resolution, response, boundary, and continuation fields.");
check(ledger.records.every((record) => record.response_boundary === "Agency response does not establish implementation or closure."), "Every Phase 56Q record must preserve the agency-response boundary.");

for (const { file, key, expectedEntities, expectedActions } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expectedEntities: 1, expectedActions: 4 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expectedEntities: 1, expectedActions: 4 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expectedEntities: 1, expectedActions: 4 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expectedEntities: 3, expectedActions: 18 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expectedEntities: 3, expectedActions: 18 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expectedEntities: 3, expectedActions: 18 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56q_continuation_ledger === "phase-56q-recommendation-identity-crosswalk.json", `${file} does not name the Phase 56Q continuation ledger.`);
  check(entityLedger[key].filter((record) => record.phase_56q_coverage_decision).length === expectedEntities, `${file} must integrate ${expectedEntities} Phase 56Q agency decision(s).`);
  check(entityLedger[key].reduce((sum, record) => sum + (record.phase_56q_recommendation_identity_crosswalk?.length ?? 0), 0) === expectedActions, `${file} must integrate ${expectedActions} Phase 56Q actions.`);
}

await access(join(appRoot, "public", "downloads", "gao-recommendation-identity-agency-response-crosswalk-2026.zip"));

if (failures.length) {
  console.error("Phase 56Q assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56Q assertions passed: twenty exact one-to-one identities, two one-to-many holds, four held candidates, twenty-one official sources, and an unchanged 1 / 21 / 2 evidence ledger.");
