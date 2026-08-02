import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const ledger = await readJson(join(dataRoot, "phase-56p-action-recommendation-ledger.json"));
const review = await readJson(join(dataRoot, "phase-56p-publication-review.json"));
const collection = await readJson(
  join(contentRoot, "research-collections", "agency-priority-recommendation-action-ledger-2026.json"),
);
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-56p-"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56p-"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56p-") && name.includes("priority-letter-full-report"));

check(ledger.phase === "56P", "Phase 56P ledger has the wrong phase.");
check(ledger.records.length === 22, "Phase 56P must contain twenty-two letter-named actions.");
check(ledger.coverage_decisions.length === 4, "Phase 56P must contain four coverage decisions.");
check(ledger.contextual_records_retained.length === 4, "Phase 56P must retain four contextual Phase 56O records.");
check(
  ledger.closure_changes.length === 0 &&
    ledger.post_batch_closure_counts.closed === 1 &&
    ledger.post_batch_closure_counts.partially_closed === 21 &&
    ledger.post_batch_closure_counts.open === 2,
  "Phase 56P must preserve the 1 Closed / 21 Partially Closed / 2 Open ledger.",
);
check(
  ledger.inherited_hold.status === "In Review" && ledger.inherited_hold.reason.includes("last updated July 22"),
  "Phase 56P must preserve the HHS tracker hold and dated boundary.",
);

const counts = Object.fromEntries(["DOE", "HHS", "DOT", "VA"].map((code) => [code, ledger.records.filter((record) => record.action_key.startsWith(`${code}-`)).length]));
check(counts.DOE === 5 && counts.HHS === 4 && counts.DOT === 8 && counts.VA === 5, "Phase 56P agency action counts must be 5 / 4 / 8 / 5.");
check(new Set(ledger.records.map((record) => record.action_id)).size === 22, "Phase 56P action IDs must be unique.");
check(new Set(ledger.records.map((record) => record.action_key)).size === 22, "Phase 56P action keys must be unique.");
check(
  ledger.records.every(
    (record) =>
      record.record_status === "Published" &&
      record.letter_state.startsWith("Open priority action") &&
      record.identity_boundary.includes("not a GAO Recommendations Database number") &&
      record.reopening_rule.includes("GAO Recommendations Database"),
  ),
  "Every Phase 56P action must preserve open state, local-key identity, and a named continuation rule.",
);

check(review.new_source_profiles === 4, "Phase 56P must add four full-report source profiles.");
check(review.document_decisions.promoted.length === 22 && review.document_decisions.held.length === 0, "Phase 56P must publish twenty-two documents.");
check(review.signal_decisions.promoted.length === 22 && review.signal_decisions.held.length === 0, "Phase 56P must publish twenty-two signals.");
check(collection.document_ids.length === 22, "Phase 56P collection must reference twenty-two documents.");
check(documents.length === 22, "Phase 56P must generate twenty-two research documents.");
check(signalFiles.length === 22, "Phase 56P must generate twenty-two Published signal files.");
check(sourceFiles.length === 4, "Phase 56P must generate four full-report source files.");
check(
  documents.every(
    (document) =>
      document.record_status === "Published" &&
      document.capture_status === "Official link record" &&
      document.evidence_limits.length >= 4 &&
      document.key_findings.some((item) => item.startsWith("Exact letter action:")) &&
      document.key_findings.some((item) => item.startsWith("Identity boundary:")) &&
      document.key_findings.some((item) => item.startsWith("Continuation rule:")),
  ),
  "Every Phase 56P document must preserve action, identity, limitation, and continuation fields.",
);

const recordByKey = new Map(ledger.records.map((record) => [record.action_key, record]));
for (const [key, fragment] of [
  ["DOE-01", "life-cycle cost estimate"],
  ["DOE-05", "pause work at a Hanford"],
  ["HHS-02", "national risk assessment"],
  ["HHS-03", "preparedness capabilities"],
  ["DOT-03", "department-wide directive"],
  ["DOT-06", "comprehensive strategy for integrating drones"],
  ["DOT-08", "automated-vehicle initiatives"],
  ["VA-02", "life-cycle cost estimate and integrated master schedule"],
  ["VA-04", "cost avoidance and budget savings"],
]) {
  check(recordByKey.get(key)?.action_text.includes(fragment), `${key} is missing its required official action text.`);
}

for (const { file, key, expected, actions } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expected: 1, actions: 4 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expected: 1, actions: 4 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expected: 1, actions: 4 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expected: 3, actions: 18 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expected: 3, actions: 18 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expected: 3, actions: 18 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56p_continuation_ledger === "phase-56p-action-recommendation-ledger.json", `${file} does not name the Phase 56P continuation ledger.`);
  check(entityLedger[key].filter((entry) => entry.phase_56p_coverage_decision).length === expected, `${file} must integrate ${expected} Phase 56P agency decision(s).`);
  check(entityLedger[key].reduce((sum, entry) => sum + (entry.phase_56p_actions?.length ?? 0), 0) === actions, `${file} must integrate ${actions} Phase 56P actions.`);
}

await access(join(appRoot, "public", "downloads", "agency-priority-recommendation-action-ledger-2026.zip"));

if (failures.length) {
  console.error("Phase 56P assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 56P assertions passed: twenty-two letter-named actions, four local-key boundaries, an inherited HHS hold, and an unchanged 1 / 21 / 2 evidence ledger.");
