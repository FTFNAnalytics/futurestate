import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const ledger = await readJson(join(dataRoot, "phase-56r-implementation-artifact-milestone-ledger.json"));
const review = await readJson(join(dataRoot, "phase-56r-publication-review.json"));
const phase56q = await readJson(join(dataRoot, "phase-56q-recommendation-identity-crosswalk.json"));
const collection = await readJson(join(contentRoot, "research-collections", "gao-recommendation-implementation-artifact-milestone-ledger-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-56r-"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56r-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56r-") && name.endsWith(".json"));
const byKey = new Map(ledger.records.map((record) => [record.action_key, record]));
const children = ledger.records.filter((record) => record.record_relationship === "Recommendation-specific child");

check(ledger.phase === "56R", "Phase 56R ledger has the wrong phase.");
check(ledger.records.length === 24 && new Set(ledger.records.map((record) => record.action_key)).size === 24, "Phase 56R must contain twenty-four unique recommendation records.");
check(ledger.continued_exact_records === 20 && ledger.recommendation_specific_children === 4, "Phase 56R must preserve the 20 continuation / 4 child split.");
check(children.map((record) => record.action_key).sort().join(",") === "HHS-04-R1,HHS-04-R2,VA-02-R1,VA-02-R2", "Phase 56R must publish the four named child identities.");
check(children.filter((record) => record.parent_action_key === "HHS-04").length === 2 && children.filter((record) => record.parent_action_key === "VA-02").length === 2, "Each held parent must receive two child records.");
check(phase56q.records.find((record) => record.action_key === "HHS-04")?.record_status === "In Review" && phase56q.records.find((record) => record.action_key === "VA-02")?.record_status === "In Review", "Phase 56R must not overwrite either Phase 56Q parent hold.");
check(ledger.records.every((record) => record.record_status === "Published" && record.official_identity === `${record.report_id} Recommendation ${record.recommendation_number}`), "Every Phase 56R record must publish with an exact official identity.");
check(ledger.official_status_counts.Open === 20 && ledger.official_status_counts["Open – Partially Addressed"] === 4, "Phase 56R must contain twenty Open and four Open – Partially Addressed recommendations.");
check(ledger.normalized_stage_counts.Promised === 11, "Phase 56R must contain eleven Promised records.");
check(ledger.normalized_stage_counts.Submitted === 4, "Phase 56R must contain four Submitted records.");
check(ledger.normalized_stage_counts["Under GAO review"] === 1, "Phase 56R must contain one record Under GAO review.");
check(ledger.normalized_stage_counts["Partially addressed"] === 4, "Phase 56R must contain four Partially addressed records.");
check(ledger.normalized_stage_counts["No conforming artifact reported"] === 4, "Phase 56R must contain four records with no conforming artifact reported.");
check(!ledger.records.some((record) => ["Implemented", "Closed"].includes(record.normalized_implementation_stage)), "Phase 56R must not claim implementation or closure.");
check(ledger.named_milestones === 13 && ledger.elapsed_milestones_without_official_acceptance === 3, "Phase 56R must preserve thirteen named milestones and three elapsed monitors.");
check(ledger.public_artifact_sources_added === 5 && sourceFiles.length === 5, "Phase 56R must add five public agency artifact sources.");
check(ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 56R must record no implementation or closure changes.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56R must preserve the 1 / 21 / 2 entity evidence ledger.");
check(byKey.get("DOT-02")?.gao_review_state === "Artifact under GAO review", "DOT-02 must preserve the explicit GAO review state.");
check(byKey.get("DOT-06")?.supporting_source_ids.includes("source-56r-faa-drone-normalization-strategy-update-2026"), "DOT-06 must link the public FAA drone strategy.");
check(byKey.get("DOT-08")?.supporting_source_ids.includes("source-56r-dot-automated-vehicle-framework-2025"), "DOT-08 must link the public DOT automated-vehicle framework.");
check(byKey.get("VA-03")?.supporting_source_ids.includes("source-56r-va-notice-24-08-acquisition-lifecycle-framework"), "VA-03 must link VA Notice 24-08.");

check(review.new_source_profiles === 5, "Phase 56R publication review must record five new source profiles.");
check(review.document_decisions.promoted.length === 24 && review.document_decisions.held.length === 0, "Phase 56R must promote all twenty-four documents.");
check(review.signal_decisions.promoted.length === 24 && review.signal_decisions.held.length === 0, "Phase 56R must promote all twenty-four signals.");
check(collection.document_ids.length === 24, "Phase 56R collection must reference twenty-four documents.");
check(documents.length === 24 && documents.every((document) => document.record_status === "Published"), "Phase 56R must generate twenty-four Published documents.");
check(signalFiles.length === 24, "Phase 56R must generate twenty-four signals.");
check(documents.every((document) => document.capture_status === "Official link record" && document.evidence_limits.length >= 4 && document.key_findings.some((item) => item.startsWith("Normalized implementation stage:")) && document.key_findings.some((item) => item.startsWith("Artifact availability:")) && document.key_findings.some((item) => item.startsWith("Remaining gap:"))), "Every Phase 56R document must preserve stage, visibility, gap, and evidence boundaries.");

for (const { file, key, expectedEntities, expectedRecords } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expectedEntities: 1, expectedRecords: 5 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expectedEntities: 3, expectedRecords: 19 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expectedEntities: 3, expectedRecords: 19 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expectedEntities: 3, expectedRecords: 19 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56r_continuation_ledger === "phase-56r-implementation-artifact-milestone-ledger.json", `${file} does not name the Phase 56R continuation ledger.`);
  check(entityLedger[key].filter((record) => record.phase_56r_coverage_decision).length === expectedEntities, `${file} must integrate ${expectedEntities} Phase 56R agency decision(s).`);
  check(entityLedger[key].reduce((sum, record) => sum + (record.phase_56r_implementation_artifact_milestone_follow_through?.length ?? 0), 0) === expectedRecords, `${file} must integrate ${expectedRecords} Phase 56R recommendation records.`);
}

await access(join(appRoot, "public", "downloads", "gao-recommendation-implementation-artifact-milestone-ledger-2026.zip"));

if (failures.length) {
  console.error("Phase 56R assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56R assertions passed: twenty continuations, four child identities, five public artifact sources, thirteen named milestones, twenty Open plus four Open – Partially Addressed recommendations, and an unchanged 1 / 21 / 2 entity evidence ledger.");
