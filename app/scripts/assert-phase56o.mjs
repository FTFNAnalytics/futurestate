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

const ledger = await readJson(join(dataRoot, "phase-56o-cross-agency-remediation.json"));
const review = await readJson(join(dataRoot, "phase-56o-publication-review.json"));
const collection = await readJson(
  join(contentRoot, "research-collections", "cross-agency-priority-remediation-portfolios-2026.json"),
);
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) =>
  name.includes("-56o-"),
);
const documents = await Promise.all(
  documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))),
);
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) =>
  name.startsWith("signal-56o-"),
);

check(ledger.phase === "56O", "Phase 56O ledger has the wrong phase.");
check(ledger.records.length === 8, "Phase 56O must contain eight exact records.");
check(
  ledger.coverage_decisions.length === 4 && ledger.context_records.length === 4,
  "Phase 56O must contain four Phase 56F decisions and four contextual records.",
);
check(
  ledger.closure_changes.length === 0 &&
    ledger.post_batch_closure_counts.closed === 1 &&
    ledger.post_batch_closure_counts.partially_closed === 21 &&
    ledger.post_batch_closure_counts.open === 2,
  "Phase 56O must preserve the 1 Closed / 21 Partially Closed / 2 Open ledger.",
);
check(
  ledger.inherited_hold.status === "In Review" && ledger.inherited_hold.reason.includes("last updated July 22"),
  "Phase 56O must preserve the HHS tracker hold and its dated boundary.",
);
check(review.new_source_profiles === 8, "Phase 56O must add eight source profiles.");
check(
  review.document_decisions.promoted.length === 8 && review.document_decisions.held.length === 0,
  "Phase 56O must publish eight documents.",
);
check(
  review.signal_decisions.promoted.length === 8 && review.signal_decisions.held.length === 0,
  "Phase 56O must publish eight signals.",
);
check(collection.document_ids.length === 8, "Phase 56O collection must reference eight documents.");
check(documents.length === 8, "Phase 56O must generate eight research documents.");
check(signalFiles.length === 8, "Phase 56O must generate eight Published signal files.");
check(
  documents.every(
    (document) =>
      document.record_status === "Published" &&
      document.capture_status === "Official link record" &&
      document.evidence_limits.length >= 3 &&
      document.key_findings.some((item) => item.startsWith("Exact record:")) &&
      document.key_findings.some((item) => item.startsWith("Status period:")) &&
      document.key_findings.some((item) => item.startsWith("Continuation rule:")),
  ),
  "Every Phase 56O document must preserve identity, period, limitation, and continuation rule.",
);

const records = new Map(ledger.records.map((entry) => [entry.record_id, entry]));
for (const [id, fragments] of [
  ["record-56o-doe-priority-portfolio-2026", ["five of thirty", "added one", "removed priority status from two", "twenty-four"]],
  ["record-56o-hhs-priority-portfolio-2026", ["four of thirty-five", "added seven", "thirty-eight"]],
  ["record-56o-dot-priority-portfolio-2026", ["three of twenty-one", "added six", "removed priority status from two", "twenty-two"]],
  ["record-56o-va-priority-portfolio-2026", ["two of twenty-nine", "added three", "thirty"]],
  ["record-56o-gsa-priority-portfolio-2026", ["two of eight", "removed priority status from one", "added six", "eleven"]],
  ["record-56o-ostp-priority-portfolio-2026", ["three of six", "added one", "four"]],
  ["record-56o-ntia-priority-portfolio-2026", ["one of eleven", "ten priorities"]],
  ["record-56o-gao-open-recommendations-benefit-model-2026", ["$132 billion to $251 billion", "not realized savings"]],
]) {
  check(
    fragments.every((fragment) => records.get(id)?.finding.includes(fragment)),
    `${id} is missing required bounded arithmetic or model language.`,
  );
}

for (const { file, key, expected } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expected: 1 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expected: 1 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expected: 1 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expected: 3 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expected: 3 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expected: 3 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(
    entityLedger.phase_56o_continuation_ledger === "phase-56o-cross-agency-remediation.json",
    `${file} does not name the Phase 56O continuation ledger.`,
  );
  check(
    entityLedger[key].filter((entry) => entry.phase_56o_coverage_decision).length === expected,
    `${file} must integrate ${expected} Phase 56O agency decision(s).`,
  );
}

await access(join(appRoot, "public", "downloads", "cross-agency-priority-remediation-portfolios-2026.zip"));

if (failures.length) {
  console.error("Phase 56O assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  "Phase 56O assertions passed: eight Published portfolio/model records, bounded agency arithmetic, an inherited HHS hold, and an unchanged 1 / 21 / 2 evidence ledger.",
);
