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

const ledger = await readJson(join(dataRoot, "phase-56k-exact-record-continuation.json"));
const review = await readJson(join(dataRoot, "phase-56k-publication-review.json"));
const collection = await readJson(
  join(contentRoot, "research-collections", "exact-record-continuation-batch-two-2026.json"),
);
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) =>
  name.includes("-56k-"),
);
const documents = await Promise.all(
  documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))),
);

check(ledger.phase === "56K", "Phase 56K ledger has the wrong phase.");
check(ledger.acquisitions.length === 7, "Phase 56K must contain seven acquisitions.");
check(
  new Set(ledger.acquisitions.map((entry) => entry.coverage_id)).size === 7,
  "Phase 56K coverage IDs must be unique.",
);
check(
  new Set(ledger.acquisitions.map((entry) => entry.entity_id)).size === 7,
  "Phase 56K entity IDs must be unique.",
);
check(
  ledger.closure_changes.length === 0 &&
    ledger.post_batch_closure_counts.closed === 1 &&
    ledger.post_batch_closure_counts.partially_closed === 21 &&
    ledger.post_batch_closure_counts.open === 2,
  "Phase 56K must preserve the 1 Closed / 21 Partially Closed / 2 Open ledger.",
);
check(review.exact_records_checked === 7, "Phase 56K review must record seven exact checks.");
check(
  review.new_source_profiles === 3 && review.reused_source_profiles === 4,
  "Phase 56K must record three new and four reused source profiles.",
);
check(
  review.document_decisions.promoted.length === 3 &&
    review.document_decisions.held.length === 4,
  "Phase 56K must contain three Published and four In Review documents.",
);
check(
  review.signal_decisions.promoted.length === 3 &&
    review.signal_decisions.held.length === 0,
  "Phase 56K must contain three Published signals and no held signal.",
);
check(collection.document_ids.length === 7, "Phase 56K collection must reference seven documents.");
check(documents.length === 7, "Phase 56K must generate seven research documents.");
check(
  documents.filter((document) => document.record_status === "Published").length === 3 &&
    documents.filter((document) => document.record_status === "In Review").length === 4,
  "Phase 56K document statuses do not match the publication review.",
);
check(
  documents.every(
    (document) =>
      document.capture_status === "Official link record" &&
      document.evidence_limits.length >= 3 &&
      document.key_findings.some((item) => item.startsWith("Continuation rule:")),
  ),
  "Every Phase 56K document must preserve the official-link, limitation, and reopening-rule contract.",
);
for (const acquisition of ledger.acquisitions) {
  check(
    acquisition.checked_date === "2026-07-25" &&
      acquisition.checked_source_id &&
      acquisition.acquisition_result &&
      acquisition.remaining_gap &&
      acquisition.reopening_rule,
    `Phase 56K acquisition ${acquisition.acquisition_id} is incomplete.`,
  );
}

await access(join(appRoot, "public", "downloads", "exact-record-continuation-batch-two-2026.zip"));

if (failures.length) {
  console.error("Phase 56K assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  "Phase 56K assertions passed: seven exact checks, three Published advancements, four verified non-closures, and an unchanged 1 / 21 / 2 evidence ledger.",
);
