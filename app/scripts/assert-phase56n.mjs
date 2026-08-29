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

const ledger = await readJson(join(dataRoot, "phase-56n-verified-remediation-outcomes.json"));
const review = await readJson(join(dataRoot, "phase-56n-publication-review.json"));
const collection = await readJson(
  join(
    contentRoot,
    "research-collections",
    "verified-remediation-component-outcomes-batch-two-2026.json",
  ),
);
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) =>
  name.includes("-56n-"),
);
const documents = await Promise.all(
  documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))),
);
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) =>
  name.startsWith("signal-56n-"),
);

check(ledger.phase === "56N", "Phase 56N ledger has the wrong phase.");
check(ledger.records.length === 10, "Phase 56N must contain ten exact records.");
check(
  ledger.coverage_decisions.length === 6 &&
    new Set(ledger.coverage_decisions.map((entry) => entry.coverage_id)).size === 6,
  "Phase 56N must contain six unique agency coverage decisions.",
);
check(
  ledger.closure_changes.length === 0 &&
    ledger.post_batch_closure_counts.closed === 1 &&
    ledger.post_batch_closure_counts.partially_closed === 21 &&
    ledger.post_batch_closure_counts.open === 2,
  "Phase 56N must preserve the 1 Closed / 21 Partially Closed / 2 Open ledger.",
);
check(review.new_source_profiles === 5, "Phase 56N must add five source profiles.");
check(
  review.document_decisions.promoted.length === 9 &&
    review.document_decisions.held.length === 1,
  "Phase 56N must publish nine documents and hold one.",
);
check(
  review.signal_decisions.promoted.length === 9 && review.signal_decisions.held.length === 0,
  "Phase 56N must publish nine signals.",
);
check(collection.document_ids.length === 10, "Phase 56N collection must reference ten documents.");
check(documents.length === 10, "Phase 56N must generate ten research documents.");
check(signalFiles.length === 9, "Phase 56N must generate nine Published signal files.");
check(
  documents.filter((document) => document.record_status === "Published").length === 9 &&
    documents.filter((document) => document.record_status === "In Review").length === 1,
  "Phase 56N document publication states are incorrect.",
);
check(
  documents.every(
    (document) =>
      document.capture_status === "Official link record" &&
      document.evidence_limits.length >= 3 &&
      document.key_findings.some((item) => item.startsWith("Exact record:")) &&
      document.key_findings.some((item) => item.startsWith("Status period:")) &&
      document.key_findings.some((item) => item.startsWith("Continuation rule:")),
  ),
  "Every Phase 56N document must preserve exact identity, period, limitation, and continuation rule.",
);

const recordByExact = new Map(ledger.records.map((entry) => [entry.exact_record, entry]));
check(
  recordByExact.get("GAO-24-105980 recommendations 33 and 34")?.finding.includes("both NASA recommendations Open"),
  "NASA recommendations 33 and 34 must remain explicitly Open.",
);
check(
  recordByExact.get("GAO-24-105980 recommendations 16, 17, and 18")?.finding.includes("16 and 18 Closed-Implemented") &&
    recordByExact.get("GAO-24-105980 recommendations 16, 17, and 18")?.finding.includes("17 remains Open"),
  "DHS AI recommendation split status is missing.",
);
check(
  recordByExact.get("GAO-24-105980 recommendation 28")?.finding.includes("Closed-Implemented"),
  "VA AI inventory recommendation closure is missing.",
);
check(
  recordByExact.get("GAO-23-105576 recommendations 1-7")?.finding.includes("2 through 6 Closed-Implemented") &&
    recordByExact.get("GAO-23-105576 recommendations 1-7")?.finding.includes("1 and 7 remain Open-Partially Addressed"),
  "DOE insider-threat recommendation split is missing.",
);
check(
  recordByExact.get("VA OIG 25-02402-83 recommendations 1-8")?.finding.includes("3, 4, and 8 Closed-Implemented") &&
    recordByExact.get("VA OIG 25-02402-83 recommendations 1-8")?.finding.includes("1, 2, 5, 6, and 7 Open"),
  "VA Southern Oregon component status is missing.",
);
check(
  recordByExact.get("A-18-22-08021 actions 26-A-18-035.01 through .04 post-July 29 recheck")?.record_status === "In Review" &&
    recordByExact.get("A-18-22-08021 actions 26-A-18-035.01 through .04 post-July 29 recheck")?.status_period.includes("last updated July 22"),
  "The HHS post-date check must remain held with the tracker-update boundary.",
);

for (const { file, key, expected } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expected: 3 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expected: 3 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expected: 3 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expected: 3 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expected: 3 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expected: 3 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(
    entityLedger.phase_56n_continuation_ledger === "phase-56n-verified-remediation-outcomes.json",
    `${file} does not name the Phase 56N continuation ledger.`,
  );
  check(
    entityLedger[key].filter((entry) => entry.phase_56n_coverage_decision).length === expected,
    `${file} must integrate ${expected} Phase 56N agency decisions.`,
  );
}

await access(
  join(
    appRoot,
    "public",
    "downloads",
    "verified-remediation-component-outcomes-batch-two-2026.zip",
  ),
);

if (failures.length) {
  console.error("Phase 56N assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  "Phase 56N assertions passed: nine Published records, one held HHS dated check, exact agency and component status boundaries, and an unchanged 1 / 21 / 2 evidence ledger.",
);
