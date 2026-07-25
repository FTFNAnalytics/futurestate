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

const ledger = await readJson(join(dataRoot, "phase-56l-realized-outcome-continuation.json"));
const review = await readJson(join(dataRoot, "phase-56l-publication-review.json"));
const collection = await readJson(
  join(contentRoot, "research-collections", "realized-outcome-continuation-batch-one-2026.json"),
);
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) =>
  name.includes("-56l-"),
);
const documents = await Promise.all(
  documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))),
);

check(ledger.phase === "56L", "Phase 56L ledger has the wrong phase.");
check(ledger.acquisitions.length === 3, "Phase 56L must contain three acquisitions.");
check(
  new Set(ledger.acquisitions.map((entry) => entry.coverage_id)).size === 3,
  "Phase 56L coverage IDs must be unique.",
);
check(
  new Set(ledger.acquisitions.map((entry) => entry.entity_id)).size === 3,
  "Phase 56L entity IDs must be unique.",
);
check(
  ledger.closure_changes.length === 0 &&
    ledger.post_batch_closure_counts.closed === 1 &&
    ledger.post_batch_closure_counts.partially_closed === 21 &&
    ledger.post_batch_closure_counts.open === 2,
  "Phase 56L must preserve the 1 Closed / 21 Partially Closed / 2 Open ledger.",
);
check(
  review.new_source_profiles === 2 && review.reused_source_profiles === 1,
  "Phase 56L must record two new and one reused source profile.",
);
check(
  review.document_decisions.promoted.length === 2 &&
    review.document_decisions.held.length === 1,
  "Phase 56L must contain two Published and one In Review document.",
);
check(
  review.signal_decisions.promoted.length === 2 && review.signal_decisions.held.length === 0,
  "Phase 56L must contain two Published signals and no held signal.",
);
check(collection.document_ids.length === 3, "Phase 56L collection must reference three documents.");
check(documents.length === 3, "Phase 56L must generate three research documents.");
check(
  documents.filter((document) => document.record_status === "Published").length === 2 &&
    documents.filter((document) => document.record_status === "In Review").length === 1,
  "Phase 56L document statuses do not match the publication review.",
);
check(
  documents.every(
    (document) =>
      document.capture_status === "Official link record" &&
      document.evidence_limits.length >= 3 &&
      document.key_findings.some((item) => item.startsWith("Continuation rule:")),
  ),
  "Every Phase 56L document must preserve the official-link, limitation, and reopening-rule contract.",
);
for (const acquisition of ledger.acquisitions) {
  check(
    acquisition.checked_date === "2026-07-25" &&
      acquisition.checked_source_id &&
      acquisition.acquisition_result &&
      acquisition.remaining_gap &&
      acquisition.reopening_rule,
    `Phase 56L acquisition ${acquisition.acquisition_id} is incomplete.`,
  );
}

await access(join(appRoot, "public", "downloads", "realized-outcome-continuation-batch-one-2026.zip"));

if (failures.length) {
  console.error("Phase 56L assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  "Phase 56L assertions passed: three checks, two Published realized-employment advancements, one exact non-closure, and an unchanged 1 / 21 / 2 evidence ledger.",
);
