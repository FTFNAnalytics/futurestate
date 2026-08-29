import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const workspaceRoot = join(appRoot, "..");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const queue = await readJson(join(appRoot, "src", "data", "phase-58-dated-evidence-queue.json"));
const contract = await readJson(join(appRoot, "src", "data", "phase-58-change-receipts.json"));
const priorReview = await readJson(join(appRoot, "src", "data", "phase-57z-publication-review.json"));
const update = await readJson(join(appRoot, "src", "content", "updates", "2026-08-11-phase-58-dated-evidence-operations.json"));
const source = await readJson(join(appRoot, "src", "content", "sources", "source-darpa-lift-challenge-2026.json"));
const signal = await readFile(join(appRoot, "src", "content", "signals", "signal-darpa-lift-challenge-2026-scheduled-field-trial.mdx"), "utf8");
const briefing = await readFile(join(appRoot, "src", "content", "briefings", "research-watch-057-dated-evidence-operations-and-change-receipts.mdx"), "utf8");
const schema = await readFile(join(workspaceRoot, "supabase", "schemas", "phase58_private_authority_loop.sql"), "utf8");

check(queue.phase === "58" && queue.records.length === 10, "Phase 58 must define exactly ten bounded queue records.");
check(new Set(queue.records.map((record) => record.queue_id)).size === 10, "Every queue record must have a unique identity.");
check(new Set(queue.records.map((record) => record.underlying_signal_id)).size === 10, "Every queue record must point to a different held signal.");
check(
  JSON.stringify(queue.records.map((record) => record.underlying_signal_id).sort()) === JSON.stringify([...priorReview.held_signal_ids].sort()),
  "The Phase 58 queue must cover exactly the ten signals held by Phase 57Z."
);
check(queue.records.filter((record) => record.underlying_signal_status === "Published").length === 1, "Exactly one Phase 58 queue gate must now resolve to a Published signal.");
check(queue.records.filter((record) => record.underlying_signal_status === "In Review").length === 9, "Nine Phase 58 queue gates must remain In Review.");
check(queue.records.every((record) => record.exact_next_artifact && record.stop_rule), "Every queue item must name an exact artifact and stop rule.");
check(queue.records.every((record) => record.review_cadence_days > 0 && record.last_checked_date <= record.next_check_date), "Every queue item must have a positive cadence and ordered check dates.");
check(queue.records.every((record) => record.next_check_date >= queue.captured_date), "No queue record may already be stale at the Phase 58 checkpoint.");
check(queue.operating_measures.stale_source_exposure_count === 0, "Phase 58 must report zero stale queue items at the captured checkpoint.");
check(!Object.keys(queue.operating_measures).some((key) => key.toLowerCase().includes("score")), "Phase 58 operating measures must not create a composite score field.");

check(contract.receipt_types.length === 4, "The receipt contract must define four reader-facing receipt types.");
check(
  JSON.stringify(contract.receipt_types.map((item) => item.name)) === JSON.stringify(["Change Note", "Watch Note", "Correction", "No Material Change"]),
  "Receipt types must preserve the Phase 58 contract order and names."
);
check(contract.receipts.length === 3, "The receipt registry must preserve the seed receipt and the two Wave 60B decisions.");
const receipt = contract.receipts.find((record) => record.receipt_id === "receipt-58-darpa-2026-08-11-no-material-change");
check(Boolean(receipt), "The August 11 DARPA seed receipt must remain present.");
check(receipt.receipt_type === "No Material Change" && receipt.source_checked_date === "2026-08-11", "The first receipt must be the August 11 DARPA no-material-change decision.");
check(/does not establish that results do not exist/.test(receipt.evidence_boundary), "The DARPA receipt must bound the negative check without claiming nonexistence.");
check(/do not promote/.test(receipt.publication_effect), "The DARPA receipt must preserve the held signal state.");

check(update.receipt_id === receipt.receipt_id && update.receipt_type === receipt.receipt_type, "The public update must render the canonical Phase 58 receipt.");
check(update.next_check_date === "2026-08-14" && update.materiality === "No record-state change", "The public update must expose the next check and unchanged state.");
check(source.last_checked_date === "2026-08-23" && source.review_cadence_days === 30, "The DARPA source must carry the latest bounded check date and follow-up cadence.");
check(/record_status: "Published"/.test(signal) && /last_reviewed_date: 2026-08-23/.test(signal), "The DARPA signal must reflect the later Wave 60B measured-result decision.");
check(/Research Watch 057/.test(briefing) && /No Material Change/.test(briefing), "Research Watch 057 must explain the receipt product and first bounded decision.");

for (const table of ["source_candidates", "review_queue", "update_candidates", "review_receipts", "export_batches"]) {
  check(schema.includes(`create table if not exists authority.${table}`), `The authority schema is missing ${table}.`);
  check(schema.includes(`alter table authority.${table} force row level security;`), `${table} must force RLS.`);
}
check(/app_metadata' ->> 'ftfn_role'/.test(schema) && !/user_metadata/.test(schema), "Authorization must use app metadata and never user-editable metadata.");
check(/security_invoker = true/.test(schema), "The reviewed export projection must honor underlying RLS.");
check(!/security definer/i.test(schema) && !/create\s+trigger/i.test(schema) && !/create\s+(or\s+replace\s+)?function/i.test(schema), "The local authority foundation must contain no security-definer function or trigger.");

if (failures.length) {
  console.error("Phase 58 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 58 assertions passed: 10 gate identities preserved, 1 measured-result gate resolved, 9 outcome gates held, 4 receipt types, 3 dated receipts, no score, and a 5-table forced-RLS authority foundation with no direct-publication path.");
