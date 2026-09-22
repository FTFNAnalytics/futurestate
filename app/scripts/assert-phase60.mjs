import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { projectEvidenceRecord } from "../src/lib/current-evidence.mjs";
import "./assert-current-evidence.mjs";

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
const archivedStarlinkReceipt = await readJson("src", "data", "phase-165-receipts", "receipt-60-louisiana-starlink-2026-09-01-no-material-change.json");
const update = await readJson("src", "content", "updates", "2026-08-11-phase-60-evidence-to-decision-cycle.json");
const waveUpdate = await readJson("src", "content", "updates", "2026-08-23-phase-60b-evidence-decisions.json");
const starlinkUpdate = await readJson("src", "content", "updates", "2026-09-01-phase-60c-louisiana-starlink-operating-decision.json");
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
const cycleById = new Map(cycle.records.map((record) => [record.cycle_item_id, record]));
const updateById = new Map([waveUpdate, starlinkUpdate].map((record) => [record.id, record]));

check(cycle.phase === "60" && cycle.cycle_id === "evidence-cycle-001", "The operating manifest must identify Phase 60 Evidence Cycle 001.");
check(cycle.records.length === 13, "Evidence Cycle 001 must contain thirteen scheduled gates.");
check(new Set(cycle.records.map((record) => record.cycle_item_id)).size === 13, "Every Phase 60 cycle item must have a unique ID.");
check(new Set(cycle.records.map((record) => record.underlying_signal_id)).size === 13, "Every Phase 60 cycle item must point to a distinct underlying signal.");
check(cycle.records.filter((record) => record.wave === "60B").length === 2, "Wave 60B must contain the two August gates.");
check(cycle.records.filter((record) => record.wave === "60C").length === 6, "Wave 60C must contain the six September 1-15 gates.");
check(cycle.records.filter((record) => record.wave === "60D").length === 5, "Wave 60D must contain the five September 22-October 9 gates.");
check(cycle.operating_measures.phase_58_held_gate_count === 10 && cycle.operating_measures.local_monitor_count === 3, "Phase 60 must combine ten held gates and three existing local monitors.");
check(cycle.operating_measures.completed_cycle_decisions === 3, "Evidence Cycle 001 must record the two Wave 60B decisions and the September 1 Louisiana Starlink decision.");
check(cycle.operating_measures.seed_receipts_propagated === 1, "Phase 60 must record one completed seed propagation proof.");
check(cycle.overdue_contract.silent_overdue_count_at_capture === 0, "The Phase 60 capture must start with zero silent overdue items.");
check(!Object.keys(cycle.operating_measures).some((key) => key.toLowerCase().includes("score") && cycle.operating_measures[key] !== 0), "Phase 60 must create no composite score.");

for (const record of cycle.records) {
  check(record.exact_next_artifact && record.scheduled_check_date, `${record.cycle_item_id} must name an exact artifact and date.`);
  const completed = Boolean(record.decision_date && record.receipt_id);
  if (completed) {
    const decisionReceipt = receipts.receipts.find((item) => item.receipt_id === record.receipt_id);
    check(Boolean(decisionReceipt), `${record.cycle_item_id} has a missing decision receipt.`);
    if (record.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION") {
      check(record.propagation_status === "complete_locally_git_held", `${record.cycle_item_id} must preserve the local-complete, Git-held propagation state.`);
      check(record.content_propagation_status === "complete" && record.git_backed_release_status === "held", `${record.cycle_item_id} must separate complete content propagation from held Git-backed release.`);
    } else {
      check(record.propagation_status === "complete", `${record.cycle_item_id} must complete propagation with its receipt.`);
      check(!("content_propagation_status" in record) && !("git_backed_release_status" in record), `${record.cycle_item_id} must not retrofit the September 1 Git split onto an earlier Wave 60B decision.`);
    }
    check(["material_change", "no_material_change", "blocked_with_public_receipt", "rescheduled_with_watch_note"].includes(record.decision_status), `${record.cycle_item_id} has an invalid completed decision state.`);
  } else {
    check(record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null, `${record.cycle_item_id} must remain scheduled without a precreated future receipt.`);
    check(!("content_propagation_status" in record) && !("git_backed_release_status" in record), `${record.cycle_item_id} must not precreate the September 1 Git split on a future gate.`);
  }
  check(record.source_ids.length > 0 && [...record.source_ids, ...(record.supporting_source_ids ?? [])].every((id) => sourceIds.has(id)), `${record.cycle_item_id} references a missing primary or supporting source.`);
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
check(cycle.records.filter((record) => record.decision_date && record.receipt_id).length === 3, "Evidence Cycle 001 must contain exactly three completed decisions.");
check(cycle.records.filter((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null).length === 10, "Evidence Cycle 001 must retain exactly ten scheduled future gates.");

const silentOverdue = cycle.records.map(record => projectEvidenceRecord(record, asOfDate)).filter((record) =>
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
check(propagation.cycle_decision_proofs.length === 3, "The propagation contract must publish three complete decision proofs in addition to the seed proof.");
for (const decisionProof of propagation.cycle_decision_proofs) {
  const decisionReceipt = receipts.receipts.find((record) => record.receipt_id === decisionProof.receipt_id);
  const decisionUpdate = updateById.get(decisionProof.update_id);
  const updateReceiptIds = decisionUpdate?.receipt_ids ?? (decisionUpdate?.receipt_id ? [decisionUpdate.receipt_id] : []);
  const assignedSurfaceIds = [
    decisionProof.source_id,
    ...(decisionProof.supporting_source_ids ?? []),
    decisionProof.signal_id,
    ...decisionProof.canonical_dossier_ids,
    ...decisionProof.reader_pathway_ids,
    ...decisionProof.dependency_map_ids,
    ...decisionProof.local_system_ids,
  ];
  check(Boolean(decisionReceipt), `${decisionProof.proof_id} has no receipt.`);
  if (decisionProof.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION") {
    check(decisionProof.propagation_status === "complete_locally_git_held", `${decisionProof.proof_id} must preserve the local-complete, Git-held propagation state.`);
    check(decisionProof.content_propagation_status === "complete" && decisionProof.git_backed_release_status === "held", `${decisionProof.proof_id} must separate complete content propagation from held Git-backed release.`);
  } else {
    check(decisionProof.propagation_status === "complete", `${decisionProof.proof_id} must remain fully propagated and Git-backed.`);
    check(!("content_propagation_status" in decisionProof) && !("git_backed_release_status" in decisionProof), `${decisionProof.proof_id} must not inherit the September 1 Git-held split.`);
  }
  check([decisionProof.source_id, ...(decisionProof.supporting_source_ids ?? [])].every((id) => sourceIds.has(id)) && signalById.has(decisionProof.signal_id), `${decisionProof.proof_id} has a missing primary source, supporting source, or signal.`);
  check(decisionProof.canonical_dossier_ids.every((id) => (briefingById.get(id) ?? "").includes(decisionProof.receipt_id)), `${decisionProof.proof_id} is missing from an assigned dossier.`);
  check(decisionProof.reader_pathway_ids.every((id) => JSON.stringify(pathwayById.get(id)).includes(decisionProof.receipt_id)), `${decisionProof.proof_id} is missing from an assigned pathway.`);
  check(decisionProof.dependency_map_ids.every((id) => JSON.stringify(mapById.get(id)).includes(decisionProof.receipt_id)), `${decisionProof.proof_id} is missing from an assigned map.`);
  check(Boolean(decisionUpdate), `${decisionProof.proof_id} references a missing public update.`);
  check(assignedSurfaceIds.every((id) => decisionUpdate?.affected_record_ids.includes(id)), `${decisionProof.proof_id} is not completely named by its assigned public update.`);
  check(updateReceiptIds.includes(decisionProof.receipt_id), `${decisionProof.proof_id} receipt is not named by its assigned public update.`);
}

const starlinkReceiptId = "receipt-60-louisiana-starlink-2026-09-01-no-material-change";
const starlinkCycle = cycleById.get("60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
const starlinkQueue = queueById.get("58-QUEUE-LOUISIANA-STARLINK-ADOPTION");
const starlinkReceipt = receipts.receipts.find((record) => record.receipt_id === starlinkReceiptId);
const starlinkProof = propagation.cycle_decision_proofs.find((record) => record.proof_id === "60-PROP-LOUISIANA-STARLINK-2026-09-01");
const { artifact_digest: archivedArtifactDigest, ...archivedReceiptPayload } = archivedStarlinkReceipt;
const recomputedArtifactDigest = createHash("sha256").update(JSON.stringify(archivedReceiptPayload)).digest("hex");
const expectedStarlinkSupportingSources = [
  "source-165-led-spacex-louisiana-campus-starlink-offer",
  "source-165-starlink-louisiana-community-discount",
  "source-165-louisiana-broadband-reporting-law",
  "source-165-connectla-resource-library",
];
const expectedStarlinkSourceIds = ["source-57b-louisiana-starlink-bead-agreement", ...expectedStarlinkSupportingSources];
const expectedStarlinkDossierIds = [
  "briefing-outcomes-watch-001-what-actually-changed",
  "briefing-evidence-cycle-001-operating-baseline",
  "briefing-evidence-cycle-001-wave-60c-field-guide",
  "briefing-evidence-return-control-room-001",
];
const expectedStarlinkAffectedIds = [
  "165-OPERATION-001",
  ...expectedStarlinkSourceIds,
  "signal-57y-preserved-la-starlink-adoption",
  ...expectedStarlinkDossierIds,
  "reader-pathway-policy-standards-to-implementation",
  "dependency-map-comparative-outcomes-require-common-denominators",
  "dependency-map-artifact-return-to-reader-state",
  "162-BRIEF-004",
];
const expectedStarlinkControlIds = [
  "58-QUEUE-LOUISIANA-STARLINK-ADOPTION",
  "60-CYCLE-LOUISIANA-STARLINK-ADOPTION",
  "60-PROP-LOUISIANA-STARLINK-2026-09-01",
  "60C-DESK-001",
  "67-RETURN-003",
  "qualification-packet-registry-001",
];
check(archivedArtifactDigest === "00c3779079b4d23153d7ee72da9d72060b53548b1d84eb05c9252f972582decb", "The immutable Louisiana Starlink receipt must preserve its canonical artifact digest.");
check(recomputedArtifactDigest === archivedArtifactDigest, "The immutable Louisiana Starlink receipt digest does not match its canonical payload.");
check(JSON.stringify(starlinkReceipt) === JSON.stringify(archivedStarlinkReceipt), "The Phase 58 receipt registry must preserve an exact copy of the immutable Louisiana Starlink archive.");
check(starlinkCycle?.decision_status === "no_material_change" && starlinkCycle?.decision_date === "2026-09-01" && starlinkCycle?.receipt_id === starlinkReceiptId, "The Louisiana Starlink cycle gate must preserve its exact September 1 No Material Change decision.");
check(starlinkCycle?.source_checked_date === "2026-09-01" && starlinkCycle?.official_surface_count === 9 && starlinkCycle?.next_check_date === "2026-09-08", "The Louisiana Starlink cycle gate must preserve nine official surfaces and its bounded September 8 recheck.");
check(starlinkCycle?.propagation_status === "complete_locally_git_held" && starlinkCycle?.content_propagation_status === "complete" && starlinkCycle?.git_backed_release_status === "held", "The Louisiana Starlink cycle gate must distinguish complete local content propagation from held Git-backed release.");
check(starlinkCycle?.exact_next_artifact === archivedStarlinkReceipt.exact_next_artifact, "The Louisiana Starlink cycle gate must inherit the immutable receipt's exact next artifact verbatim.");
check(JSON.stringify(starlinkCycle?.supporting_source_ids) === JSON.stringify(expectedStarlinkSupportingSources), "The Louisiana Starlink cycle gate must preserve its four official supporting sources.");
check(starlinkQueue?.underlying_signal_status === "In Review" && starlinkQueue?.current_decision === "no_material_change" && starlinkQueue?.latest_receipt_id === starlinkReceiptId, "The Louisiana Starlink queue must retain the signal In Review under the September 1 receipt.");
check(starlinkQueue?.last_checked_date === "2026-09-01" && starlinkQueue?.next_check_date === "2026-09-08", "The Louisiana Starlink queue must advance only to the bounded September 8 recheck.");
check(starlinkQueue?.exact_next_artifact === archivedStarlinkReceipt.exact_next_artifact, "The Louisiana Starlink queue must inherit the immutable receipt's exact next artifact verbatim.");
check(starlinkReceipt?.receipt_type === "No Material Change" && starlinkReceipt?.official_surface_checks?.length === 9, "The Louisiana Starlink receipt must be a nine-surface No Material Change return.");
check(starlinkReceipt?.source_checked_date === "2026-09-01" && starlinkReceipt?.decision_date === "2026-09-01" && starlinkReceipt?.next_check_date === "2026-09-08", "The Louisiana Starlink receipt has a stale date or next action.");
check(starlinkProof?.cycle_item_id === starlinkCycle?.cycle_item_id && starlinkProof?.receipt_id === starlinkReceiptId && starlinkProof?.signal_decision === "retain_in_review_no_material_change", "The Louisiana Starlink propagation proof must preserve its exact cycle, receipt, and held-signal decision.");
check(starlinkProof?.source_id === "source-57b-louisiana-starlink-bead-agreement" && JSON.stringify(starlinkProof?.supporting_source_ids) === JSON.stringify(expectedStarlinkSupportingSources), "The Louisiana Starlink proof must preserve its primary and four supporting sources.");
check(expectedStarlinkSourceIds.every((id) => sourceIds.has(id)), "Every Louisiana Starlink primary and supporting source must resolve in the source corpus.");
check(JSON.stringify(starlinkProof?.canonical_dossier_ids) === JSON.stringify(expectedStarlinkDossierIds), "The Louisiana Starlink proof must preserve its four exact canonical dossiers.");
check(JSON.stringify(starlinkProof?.reader_pathway_ids) === JSON.stringify(["reader-pathway-policy-standards-to-implementation"]) && JSON.stringify(starlinkProof?.dependency_map_ids) === JSON.stringify(["dependency-map-comparative-outcomes-require-common-denominators", "dependency-map-artifact-return-to-reader-state"]), "The Louisiana Starlink proof must preserve its exact pathway and dependency maps.");
check(starlinkProof?.local_system_ids?.length === 0 && starlinkProof?.named_file_ids?.length === 0, "The Louisiana Starlink decision must not transfer to a local system or Phase 61 named file.");
check(JSON.stringify(starlinkProof?.referenced_place_context_ids) === JSON.stringify(["162-BRIEF-004"]) && starlinkProof?.referenced_operation_overlay_id === "165-OPERATION-001", "The Louisiana Starlink proof must preserve only the exact referenced place context and operation overlay.");
check(!("place_overlay_ids" in (starlinkProof ?? {})) && !("operation_overlay_id" in (starlinkProof ?? {})), "The Louisiana Starlink proof must not retain overbroad overlay claims.");
check(starlinkProof?.update_id === starlinkUpdate.id && starlinkProof?.next_check_date === "2026-09-08", "The Louisiana Starlink proof must resolve through the September 1 public update and bounded next action.");
check(starlinkProof?.propagation_status === "complete_locally_git_held" && starlinkProof?.content_propagation_status === "complete" && starlinkProof?.git_backed_release_status === "held", "The Louisiana Starlink proof must distinguish complete local content propagation from held Git-backed release.");
check(/record_status:\s*"In Review"/.test(signalById.get("signal-57y-preserved-la-starlink-adoption") ?? ""), "The Louisiana Starlink signal must remain In Review.");
check(starlinkUpdate.receipt_id === starlinkReceiptId && starlinkUpdate.source_checked_date === "2026-09-01" && starlinkUpdate.decision_date === "2026-09-01" && starlinkUpdate.next_check_date === "2026-09-08", "The September 1 public update must expose the exact Louisiana Starlink receipt and dates.");
check(new Set(starlinkUpdate.affected_record_ids).size === starlinkUpdate.affected_record_ids.length, "The September 1 public update must not duplicate an affected record identity.");
check(JSON.stringify([...starlinkUpdate.affected_record_ids].sort()) === JSON.stringify([...expectedStarlinkAffectedIds].sort()), "The September 1 public update must name exactly its public propagation surfaces and no overbroad context.");
check(JSON.stringify([...(starlinkUpdate.operating_control_ids ?? [])].sort()) === JSON.stringify([...expectedStarlinkControlIds].sort()), "The September 1 public update must name exactly its six canonical operating-control records.");
check(starlinkUpdate.receipt_id === starlinkReceiptId, "The September 1 public update must name its immutable receipt through the receipt field.");
check(cycle.digest_contract.required_sections.length === 7, "The recurring digest contract must define seven required sections.");
for (const heading of ["Operating baseline", "Decision waves", "Propagation contract", "First complete proof", "No silent overdue work", "Evidence boundary"]) {
  check(digest.includes(`## ${heading}`), `Evidence Cycle 001 is missing the ${heading} section.`);
}

if (failures.length) {
  console.error("Phase 60 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 60 historical assertions passed; current projection verified as of ${asOfDate}: 13 gate identities, 0 silent overdue checks, no score or operating-outcome claim. September 1 baseline: 3 complete / 10 scheduled; later decisions are separately receipted.`);
