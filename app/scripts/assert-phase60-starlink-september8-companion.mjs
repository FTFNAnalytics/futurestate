import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sameJson = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const companionId = "receipt-60-louisiana-starlink-2026-09-08-follow-up-no-material-change";
const priorId = "receipt-60-louisiana-starlink-2026-09-01-no-material-change";
const cycleId = "60-CYCLE-LOUISIANA-STARLINK-ADOPTION";
const checkedSourceIds = [
  "source-57b-louisiana-starlink-bead-agreement",
  "source-165-led-spacex-louisiana-campus-starlink-offer",
  "source-165-starlink-louisiana-community-discount",
  "source-165-connectla-resource-library",
  "source-60-connectla-spacex-pecan-island-plan-2026",
  "source-60-connectla-starlink-final-proposal-location-cohort-2026",
  "source-60-starlink-2025-progress-report",
];
const dossierNames = [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-evidence-cycle-001-operating-baseline.mdx",
  "briefing-evidence-cycle-001-wave-60c-field-guide.mdx",
  "briefing-evidence-return-control-room-001.mdx",
];

const [
  receiptRegistry,
  archiveReceipt,
  queue,
  cycle,
  propagation,
  desk,
  envelopeLedger,
  packetRegistry,
  phase61,
  update,
] = await Promise.all([
  readJson("src", "data", "phase-58-change-receipts.json"),
  readJson("src", "data", "phase-165-receipts", `${companionId}.json`),
  readJson("src", "data", "phase-58-dated-evidence-queue.json"),
  readJson("src", "data", "phase-60-operating-cycle.json"),
  readJson("src", "data", "phase-60-propagation-contract.json"),
  readJson("src", "data", "phase-60c-editorial-desk.json"),
  readJson("src", "data", "phase-67-evidence-return-envelope-ledger.json"),
  readJson("src", "data", "phase-67-qualification-packet-registry.json"),
  readJson("src", "data", "phase-61-project-conversion-registry.json"),
  readJson("src", "content", "updates", "2026-09-08-phase-60-louisiana-starlink-companion-recheck.json"),
]);

const registryReceipt = receiptRegistry.receipts.find((receipt) => receipt.receipt_id === companionId);
const receiptPayload = structuredClone(archiveReceipt);
delete receiptPayload.artifact_digest;
check(Boolean(registryReceipt) && sameJson(registryReceipt, archiveReceipt), "The canonical registry and append-only companion archive differ.");
check(createHash("sha256").update(JSON.stringify(receiptPayload)).digest("hex") === archiveReceipt.artifact_digest, "The companion receipt artifact digest is invalid.");
check(archiveReceipt.receipt_scope === "bounded_companion_recheck" && archiveReceipt.counts_as_cycle_decision === false, "The receipt must remain a non-gate companion recheck.");
check(archiveReceipt.prior_receipt_id === priorId && archiveReceipt.source_checked_date === "2026-09-08" && archiveReceipt.decision_date === "2026-09-08", "The companion receipt lineage or date is stale.");
check(archiveReceipt.decision_status === "no_material_change" && archiveReceipt.signal_decision === "retain_in_review_no_material_change", "The companion decision must retain the Starlink signal In Review.");
check(archiveReceipt.official_surface_checks?.length === 17 && archiveReceipt.official_surface_checks.every((surface) => surface.accessed_date === "2026-09-08" && /^https:\/\//.test(surface.url)), "The companion receipt must preserve seventeen real dated official-surface checks.");
check(sameJson(archiveReceipt.checked_source_ids, checkedSourceIds), "The companion receipt checked-source inventory changed.");
check(archiveReceipt.next_check_date === "2026-10-09" && /not a new or fourteenth gate/i.test(archiveReceipt.next_check_boundary), "The next action must remain the existing October 9 audit rather than a new gate.");
check(/does not establish that a qualifying artifact does not exist/i.test(archiveReceipt.evidence_boundary) && /does not establish.*no eligible location/i.test(archiveReceipt.evidence_boundary), "The receipt must not infer nonexistence or zero adoption.");

const sourceNames = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const sources = await Promise.all(sourceNames.map((name) => readJson("src", "content", "sources", name)));
const sourceById = new Map(sources.map((source) => [source.id, source]));
check(checkedSourceIds.every((id) => sourceById.has(id)), "At least one companion checked source does not resolve.");
check(checkedSourceIds.slice(4).every((id) => sourceById.get(id)?.last_checked_date === "2026-09-08"), "Every newly captured companion source must carry the September 8 freshness date.");

const queueRecord = queue.records.find((record) => record.queue_id === "58-QUEUE-LOUISIANA-STARLINK-ADOPTION");
const cycleRecord = cycle.records.find((record) => record.cycle_item_id === cycleId);
const proof = propagation.companion_recheck_proofs?.find((record) => record.receipt_id === companionId);
const deskRecord = desk.records.find((record) => record.cycle_item_id === cycleId);
const envelope = envelopeLedger.envelope_records.find((record) => record.cycle_item_id === cycleId);
check(cycle.records.length === 13 && cycle.operating_measures.completed_cycle_decisions === 3, "The companion recheck must preserve thirteen cycle gates and three completed cycle decisions.");
check(cycleRecord?.receipt_id === priorId && cycleRecord?.decision_date === "2026-09-01", "The September 1 canonical cycle decision was replaced.");
check(cycleRecord?.companion_rechecks?.length === 1 && cycleRecord.companion_rechecks[0].receipt_id === companionId && cycleRecord.companion_rechecks[0].counts_as_cycle_decision === false, "The cycle record lacks its append-only companion history.");
check(queueRecord?.latest_receipt_id === priorId && queueRecord?.last_checked_date === "2026-09-01", "The canonical Phase 58 queue decision history was rewritten.");
check(queueRecord?.companion_rechecks?.length === 1 && queueRecord.companion_rechecks[0].receipt_id === companionId, "The queue lacks its September 8 companion history.");
check(proof?.proof_id === "60-PROP-LOUISIANA-STARLINK-FOLLOW-UP-2026-09-08" && proof?.counts_as_cycle_decision === false, "The companion propagation proof is missing or incorrectly counted.");
check(proof?.content_propagation_status === "complete" && proof?.git_backed_release_status === "held", "Content propagation and Git-backed release must remain separate.");
check(sameJson(proof?.checked_source_ids, checkedSourceIds), "The propagation proof has stale checked sources.");
check(desk.current_operating_result?.receipt_id === priorId && deskRecord?.companion_rechecks?.[0]?.receipt_id === companionId, "The Phase 60C desk must preserve the canonical result and append the companion.");
check(desk.latest_companion_recheck?.receipt_id === companionId && desk.latest_companion_recheck?.counts_as_cycle_decision === false, "The Phase 60C latest companion control is stale.");
check(envelope?.receipt_id === priorId && envelope?.companion_rechecks?.[0]?.receipt_id === companionId, "The Phase 67 envelope must preserve its canonical receipt and companion history.");
check(envelope?.named_file_ids?.length === 0 && envelope?.qualification_packet_ids?.length === 0 && envelope.companion_rechecks[0].named_file_transfer === "none_no_matching_phase61_identity", "The companion recheck must not transfer to a named file or packet.");
check(packetRegistry.latest_no_transfer_companion_recheck?.receipt_id === companionId && packetRegistry.latest_no_transfer_companion_recheck?.phase64_cell_change === "none", "The qualification registry must expose the no-transfer result.");
check(!JSON.stringify(phase61).toLowerCase().includes("starlink"), "A Louisiana Starlink Phase 61 file was invented.");

const signalText = await readText("src", "content", "signals", "signal-57y-preserved-la-starlink-adoption.mdx");
check(/record_status:\s*"In Review"/.test(signalText) && /last_reviewed_date:\s*2026-09-08/.test(signalText) && signalText.includes(companionId), "The Starlink signal must remain In Review and expose the September 8 companion receipt.");
for (const name of dossierNames) {
  const text = await readText("src", "content", "briefings", name);
  check(text.includes(companionId), `${name} does not expose the companion receipt.`);
}
const [pathway, commonDenominatorMap, returnMap] = await Promise.all([
  readJson("src", "content", "reader-pathways", "policy-standards-to-implementation.json"),
  readJson("src", "content", "dependency-maps", "comparative-outcomes-require-common-denominators.json"),
  readJson("src", "content", "dependency-maps", "artifact-return-to-reader-state.json"),
]);
for (const [name, surface] of [["policy pathway", pathway], ["common-denominator map", commonDenominatorMap], ["artifact-return map", returnMap]]) {
  check(JSON.stringify(surface).includes(companionId), `The ${name} lacks the companion receipt.`);
  check(checkedSourceIds.every((id) => surface.source_ids?.includes(id)), `The ${name} lacks a companion checked source.`);
}

check(update.id === "update-2026-09-08-phase-60-louisiana-starlink-companion-recheck" && update.receipt_id === companionId, "The September 8 public update identity is stale.");
check(update.counts_as_cycle_decision === false && update.source_checked_date === "2026-09-08" && update.next_check_date === "2026-10-09", "The September 8 public update has stale scope or dates.");
check(checkedSourceIds.every((id) => update.affected_record_ids.includes(id)), "The public update omits a checked source.");

for (const path of [
  ["src", "pages", "data", "evidence-queue.json.ts"],
  ["src", "pages", "data", "operating-cycle.json.ts"],
  ["src", "pages", "data", "evidence-return-envelopes.json.ts"],
  ["src", "pages", "review", "evidence-cycle", "[slug].astro"],
  ["src", "pages", "evidence", "qualification", "[id].astro"],
]) {
  check((await readText(...path)).includes("companion_rechecks"), `${path.join("/")} does not expose companion history.`);
}

if (failures.length > 0) {
  console.error("September 8 Louisiana Starlink companion assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("September 8 Louisiana Starlink companion assertions passed: 17 dated official surfaces, 7 current source records, a bounded No Material Change receipt, 13/3 cycle integrity, no Phase 61 transfer, complete local propagation, and Git-backed release held.");
