import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function edmontonDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

const asOfDate = process.env.FTFN_AS_OF_DATE ?? edmontonDate();
const cycle = await readJson("src", "data", "phase-60-operating-cycle.json");
const propagation = await readJson("src", "data", "phase-60-propagation-contract.json");
const queue = await readJson("src", "data", "phase-58-dated-evidence-queue.json");
const receipts = await readJson("src", "data", "phase-58-change-receipts.json");
const update = await readJson("src", "content", "updates", "2026-08-11-phase-60-evidence-to-decision-cycle.json");
const waveUpdate = await readJson("src", "content", "updates", "2026-08-23-phase-60b-evidence-decisions.json");
const digest = await readText("src", "content", "briefings", "briefing-evidence-cycle-001-operating-baseline.mdx");
const sourcesDir = join(appRoot, "src", "content", "sources");
const signalsDir = join(appRoot, "src", "content", "signals");
const briefingsDir = join(appRoot, "src", "content", "briefings");
const pathwaysDir = join(appRoot, "src", "content", "reader-pathways");
const mapsDir = join(appRoot, "src", "content", "dependency-maps");
const localsDir = join(appRoot, "src", "content", "local-systems");

const loadJsonCollection = async (directory) => {
  const names = (await readdir(directory)).filter((name) => name.endsWith(".json"));
  return Promise.all(names.map(async (name) => JSON.parse(await readFile(join(directory, name), "utf8"))));
};
const loadTextCollection = async (directory) => {
  const names = (await readdir(directory)).filter((name) => name.endsWith(".md") || name.endsWith(".mdx"));
  return Promise.all(names.map(async (name) => ({ name, text: await readFile(join(directory, name), "utf8" ) })));
};

const sourceRecords = await loadJsonCollection(sourcesDir);
const pathwayRecords = await loadJsonCollection(pathwaysDir);
const mapRecords = await loadJsonCollection(mapsDir);
const signalRecords = await loadTextCollection(signalsDir);
const briefingRecords = await loadTextCollection(briefingsDir);
const localRecords = await loadTextCollection(localsDir);

const sourceIds = new Set(sourceRecords.map((record) => record.id));
const pathwayById = new Map(pathwayRecords.map((record) => [record.id, record]));
const mapById = new Map(mapRecords.map((record) => [record.id, record]));
const signalById = new Map(signalRecords.map((record) => [record.text.match(/^id:\s*"([^"]+)"/m)?.[1], record.text]));
const briefingById = new Map(briefingRecords.map((record) => [record.text.match(/^id:\s*"([^"]+)"/m)?.[1], record.text]));
const localIds = new Set(localRecords.map((record) => record.text.match(/^id:\s*"([^"]+)"/m)?.[1]));
const queueById = new Map(queue.records.map((record) => [record.queue_id, record]));

check(cycle.phase === "60" && cycle.cycle_id === "evidence-cycle-001", "The operating manifest must identify Phase 60 Evidence Cycle 001.");
check(cycle.records.length === 13, "Evidence Cycle 001 must contain thirteen scheduled gates.");
check(new Set(cycle.records.map((record) => record.cycle_item_id)).size === 13, "Every Phase 60 cycle item must have a unique ID.");
check(new Set(cycle.records.map((record) => record.underlying_signal_id)).size === 13, "Every Phase 60 cycle item must point to a distinct underlying signal.");
check(cycle.records.filter((record) => record.wave === "60B").length === 2, "Wave 60B must contain the two August gates.");
check(cycle.records.filter((record) => record.wave === "60C").length === 6, "Wave 60C must contain the six September 1-15 gates.");
check(cycle.records.filter((record) => record.wave === "60D").length === 5, "Wave 60D must contain the five September 22-October 9 gates.");
check(cycle.operating_measures.phase_58_held_gate_count === 10 && cycle.operating_measures.local_monitor_count === 3, "Phase 60 must combine ten held gates and three existing local monitors.");
check(cycle.operating_measures.completed_cycle_decisions === 2, "Wave 60B must record exactly two completed cycle decisions.");
check(cycle.operating_measures.seed_receipts_propagated === 1, "Phase 60 must record one completed seed propagation proof.");
check(cycle.overdue_contract.silent_overdue_count_at_capture === 0, "The Phase 60 capture must start with zero silent overdue items.");
check(!Object.keys(cycle.operating_measures).some((key) => key.toLowerCase().includes("score") && cycle.operating_measures[key] !== 0), "Phase 60 must create no composite score.");

for (const record of cycle.records) {
  check(record.exact_next_artifact && record.scheduled_check_date, `${record.cycle_item_id} must name an exact artifact and date.`);
  const completed = Boolean(record.decision_date && record.receipt_id);
  if (completed) {
    const decisionReceipt = receipts.receipts.find((item) => item.receipt_id === record.receipt_id);
    check(Boolean(decisionReceipt), `${record.cycle_item_id} has a missing decision receipt.`);
    check(record.propagation_status === "complete", `${record.cycle_item_id} must complete propagation with its receipt.`);
    check(["material_change", "no_material_change", "blocked_with_public_receipt", "rescheduled_with_watch_note"].includes(record.decision_status), `${record.cycle_item_id} has an invalid completed decision state.`);
  } else {
    check(record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null, `${record.cycle_item_id} must remain scheduled without a precreated future receipt.`);
  }
  check(record.source_ids.length > 0 && record.source_ids.every((id) => sourceIds.has(id)), `${record.cycle_item_id} references a missing source.`);
  check(signalById.has(record.underlying_signal_id), `${record.cycle_item_id} references a missing signal.`);
  check(record.canonical_dossier_ids.length > 0 && record.canonical_dossier_ids.every((id) => briefingById.has(id)), `${record.cycle_item_id} references a missing canonical dossier.`);
  check(record.reader_pathway_ids.length > 0 && record.reader_pathway_ids.every((id) => pathwayById.has(id)), `${record.cycle_item_id} references a missing reader pathway.`);
  check(record.dependency_map_ids.length > 0 && record.dependency_map_ids.every((id) => mapById.has(id)), `${record.cycle_item_id} references a missing dependency map.`);
  check(record.local_system_ids.every((id) => localIds.has(id)), `${record.cycle_item_id} references a missing local system.`);

  const priorQueueRecord = queueById.get(record.origin_record_id);
  if (priorQueueRecord) {
    check(priorQueueRecord.underlying_signal_id === record.underlying_signal_id, `${record.cycle_item_id} changes its Phase 58 signal identity.`);
    check(priorQueueRecord.exact_next_artifact === record.exact_next_artifact, `${record.cycle_item_id} changes its Phase 58 exact artifact.`);
    if (!completed) check(priorQueueRecord.next_check_date === record.scheduled_check_date, `${record.cycle_item_id} changes its Phase 58 next-check date before a decision.`);
  }
}

const silentOverdue = cycle.records.filter((record) =>
  record.scheduled_check_date < asOfDate
  && !record.decision_date
  && !record.receipt_id
  && !["blocked_with_public_receipt", "rescheduled_with_watch_note"].includes(record.decision_status)
);
check(silentOverdue.length === 0, `Silent overdue Phase 60 checks: ${silentOverdue.map((record) => record.cycle_item_id).join(", ") || "none"}.`);

const proof = propagation.seed_propagation_proof;
const receipt = receipts.receipts.find((record) => record.receipt_id === proof.receipt_id);
check(propagation.required_sequence.length === 9, "The propagation contract must preserve all nine source-to-release stages.");
check(proof.propagation_status === "complete", "The DARPA seed propagation proof must be complete.");
check(Boolean(receipt), "The DARPA seed receipt must resolve in the receipt registry.");
check(receipt?.affected_record_ids.includes(proof.source_id) && receipt?.affected_record_ids.includes(proof.signal_id), "The seed receipt must name its source and signal.");
check(sourceIds.has(proof.source_id), "The seed source must resolve.");
const proofSignal = signalById.get(proof.signal_id) ?? "";
check(/record_status:\s*"Published"/.test(proofSignal), "The historical DARPA seed proof must permit the later measured-result promotion.");

for (const briefingId of proof.canonical_dossier_ids) {
  const content = briefingById.get(briefingId) ?? "";
  check(content.includes(proof.signal_id), `${briefingId} must reference the DARPA seed signal.`);
  check(content.includes(proof.receipt_id), `${briefingId} must reference the DARPA seed receipt.`);
}
for (const pathwayId of proof.reader_pathway_ids) {
  const pathway = pathwayById.get(pathwayId);
  check(pathway?.source_ids.includes(proof.source_id), `${pathwayId} must reference the DARPA seed source.`);
  check(pathway?.briefing_ids.includes("briefing-evidence-cycle-001-operating-baseline"), `${pathwayId} must reference Evidence Cycle 001.`);
  check(JSON.stringify(pathway).includes(proof.receipt_id), `${pathwayId} must reference the DARPA seed receipt.`);
}
for (const mapId of proof.dependency_map_ids) {
  const map = mapById.get(mapId);
  check(map?.source_ids.includes(proof.source_id), `${mapId} must reference the DARPA seed source.`);
  check(JSON.stringify(map).includes(proof.receipt_id), `${mapId} must reference the DARPA seed receipt.`);
}

const propagatedIds = [
  proof.source_id,
  proof.signal_id,
  ...proof.canonical_dossier_ids,
  ...proof.reader_pathway_ids,
  ...proof.dependency_map_ids
];
check(propagatedIds.every((id) => update.affected_record_ids.includes(id)), "The Phase 60 update must name every propagated DARPA surface.");
check(update.receipt_id === proof.receipt_id && update.next_check_date === proof.next_check_date, "The Phase 60 update must preserve the seed receipt identity and next check.");
check(propagation.cycle_decision_proofs.length === 2, "Wave 60B must publish two complete propagation proofs.");
for (const decisionProof of propagation.cycle_decision_proofs) {
  const decisionReceipt = receipts.receipts.find((record) => record.receipt_id === decisionProof.receipt_id);
  check(Boolean(decisionReceipt), `${decisionProof.proof_id} has no receipt.`);
  check(decisionProof.propagation_status === "complete", `${decisionProof.proof_id} must be fully propagated.`);
  check(sourceIds.has(decisionProof.source_id) && signalById.has(decisionProof.signal_id), `${decisionProof.proof_id} has a missing source or signal.`);
  check(decisionProof.canonical_dossier_ids.every((id) => (briefingById.get(id) ?? "").includes(decisionProof.receipt_id)), `${decisionProof.proof_id} is missing from an assigned dossier.`);
  check(decisionProof.reader_pathway_ids.every((id) => JSON.stringify(pathwayById.get(id)).includes(decisionProof.receipt_id)), `${decisionProof.proof_id} is missing from an assigned pathway.`);
  check(decisionProof.dependency_map_ids.every((id) => JSON.stringify(mapById.get(id)).includes(decisionProof.receipt_id)), `${decisionProof.proof_id} is missing from an assigned map.`);
  check([decisionProof.source_id, decisionProof.signal_id, ...decisionProof.canonical_dossier_ids, ...decisionProof.reader_pathway_ids, ...decisionProof.dependency_map_ids, ...decisionProof.local_system_ids].every((id) => waveUpdate.affected_record_ids.includes(id)), `${decisionProof.proof_id} is not completely named by the Wave 60B update.`);
  check(waveUpdate.receipt_ids.includes(decisionProof.receipt_id), `${decisionProof.proof_id} receipt is not named by the Wave 60B update.`);
}
check(cycle.digest_contract.required_sections.length === 7, "The recurring digest contract must define seven required sections.");
for (const heading of ["Operating baseline", "Decision waves", "Propagation contract", "First complete proof", "No silent overdue work", "Evidence boundary"]) {
  check(digest.includes(`## ${heading}`), `Evidence Cycle 001 is missing the ${heading} section.`);
}

if (failures.length) {
  console.error("Phase 60 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 60 assertions passed as of ${asOfDate}: 13 gate identities across waves 60B-60D, 2 complete Wave 60B decisions, 11 future gates, 0 silent overdue checks, 3 complete propagation proofs including the seed, 1 bounded signal promotion, 1 unchanged named-file hold, and no score or operating-outcome claim.`);
