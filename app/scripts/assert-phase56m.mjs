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

const ledger = await readJson(join(dataRoot, "phase-56m-federal-remediation-outcomes.json"));
const review = await readJson(join(dataRoot, "phase-56m-publication-review.json"));
const collection = await readJson(
  join(contentRoot, "research-collections", "federal-remediation-outcomes-batch-one-2026.json"),
);
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) =>
  name.includes("-56m-"),
);
const documents = await Promise.all(
  documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))),
);

check(ledger.phase === "56M", "Phase 56M ledger has the wrong phase.");
check(ledger.records.length === 3, "Phase 56M must contain three exact records.");
check(
  ledger.coverage_decisions.length === 2 &&
    new Set(ledger.coverage_decisions.map((entry) => entry.coverage_id)).size === 2,
  "Phase 56M must contain unique NASA and HHS coverage decisions.",
);
check(
  ledger.records.filter((entry) => entry.coverage_id === "coverage-56f-hhs").length === 2,
  "Phase 56M must retain two distinct HHS component records.",
);
check(
  ledger.closure_changes.length === 0 &&
    ledger.post_batch_closure_counts.closed === 1 &&
    ledger.post_batch_closure_counts.partially_closed === 21 &&
    ledger.post_batch_closure_counts.open === 2,
  "Phase 56M must preserve the 1 Closed / 21 Partially Closed / 2 Open ledger.",
);
check(
  review.new_source_profiles === 2 && review.reused_source_profiles === 1,
  "Phase 56M must record two new and one reused source profile.",
);
check(
  review.document_decisions.promoted.length === 3 &&
    review.document_decisions.held.length === 0,
  "Phase 56M must publish three research documents.",
);
check(
  review.signal_decisions.promoted.length === 3 && review.signal_decisions.held.length === 0,
  "Phase 56M must publish three signals.",
);
check(collection.document_ids.length === 3, "Phase 56M collection must reference three documents.");
check(documents.length === 3, "Phase 56M must generate three research documents.");
check(
  documents.every(
    (document) =>
      document.record_status === "Published" &&
      document.capture_status === "Official link record" &&
      document.evidence_limits.length >= 3 &&
      document.key_findings.some((item) => item.startsWith("Exact record:")) &&
      document.key_findings.some((item) => item.startsWith("Tested or status period:")) &&
      document.key_findings.some((item) => item.startsWith("Continuation rule:")),
  ),
  "Every Phase 56M document must preserve exact identity, period, limitation, and continuation rule.",
);
check(
  ledger.records.some(
    (entry) =>
      entry.exact_record === "GAO-25-108138 recommendations 1-16" &&
      entry.finding.includes("all 16") &&
      entry.finding.includes("Open"),
  ),
  "The NASA exact sixteen-recommendation non-closure is missing.",
);
check(
  ledger.records.some(
    (entry) =>
      entry.exact_record.includes("26-A-18-035.01") &&
      entry.finding.includes("Open Unimplemented"),
  ),
  "The HHS four-action open result is missing.",
);
check(
  ledger.records.some(
    (entry) =>
      entry.exact_record === "OAS-25-18-033; no recommendations" &&
      entry.finding.includes("made no recommendations"),
  ),
  "The HHS no-recommendation component result is missing.",
);

await access(
  join(appRoot, "public", "downloads", "federal-remediation-outcomes-batch-one-2026.zip"),
);

if (failures.length) {
  console.error("Phase 56M assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  "Phase 56M assertions passed: three Published records, exact NASA and HHS status boundaries, and an unchanged 1 / 21 / 2 evidence ledger.",
);
