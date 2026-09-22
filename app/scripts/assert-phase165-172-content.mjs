import { createHash } from "node:crypto";
import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  computeV1cycleDigestFromDisk,
  isValidV1cycleValidationReceipt,
  v1cyclePhases,
  v1cyclePublicationDate,
} from "./lib/v1cycle-candidate-digest.mjs";
import {
  computeV1monthDigestFromDisk,
  isValidV1monthValidationReceipt,
} from "./lib/v1month-candidate-digest.mjs";
import {
  computeV1rcDigestFromDisk,
  isValidV1rcValidationReceipt,
} from "./lib/v1rc-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const phase165ReceiptRoot = join(dataRoot, "phase-165-receipts");
const phase172ReceiptRoot = join(dataRoot, "phase-172-receipts");
const failures = [];

const phaseFiles = new Map([
  [165, "phase-165-live-evidence-operations-cycle-001.json"],
  [166, "phase-166-weekly-desk-closures-and-editions.json"],
  [167, "phase-167-authority-resolution-hearings.json"],
  [168, "phase-168-requirement-mission-adjudication.json"],
  [169, "phase-169-longitudinal-pilot-adjudication.json"],
  [170, "phase-170-fifteen-place-systems-atlas.json"],
  [171, "phase-171-frontier-systems-compendium.json"],
  [172, "phase-172-september-state-report.json"],
]);
const recordKeys = new Map([
  [165, "operation_runs"],
  [166, "weekly_cycles"],
  [167, "authority_hearings"],
  [168, "adjudication_dockets"],
  [169, "longitudinal_adjudication_packets"],
  [170, "place_system_dossiers"],
  [171, "compendium_records"],
  [172, "state_report_gates"],
]);
const idKeys = new Map([
  [165, "operation_run_id"],
  [166, "weekly_cycle_id"],
  [167, "authority_hearing_id"],
  [168, "adjudication_docket_id"],
  [169, "longitudinal_adjudication_packet_id"],
  [170, "place_system_dossier_id"],
  [171, "compendium_record_id"],
  [172, "gate_id"],
]);
const sections = new Map([
  [165, "live-operations"],
  [166, "weekly-editions"],
  [167, "authority-hearings"],
  [168, "mission-adjudication"],
  [169, "longitudinal-adjudication"],
  [170, "systems-atlas"],
  [171, "systems-compendium"],
  [172, "september-state"],
]);

const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
const array = (value) => Array.isArray(value) ? value : [];
const hasText = (value, minimum = 1) => typeof value === "string" && value.trim().length >= minimum;
const allUnique = (values) => Array.isArray(values) && new Set(values).size === values.length;
const sameJson = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const sameSet = (left, right) => Array.isArray(left)
  && Array.isArray(right)
  && left.length === right.length
  && allUnique(left)
  && allUnique(right)
  && left.every((value) => new Set(right).has(value));
const isDigest = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const isIsoDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};
const contentDigest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

const registries = new Map(await Promise.all([...phaseFiles].map(async ([phase, name]) => [phase, await readJson(name)])));
const aggregate = await readJson("v1-september-evidence-cycle.json");
const [
  p137,
  p145,
  p146,
  p147,
  p151,
  p154,
  p156,
  p158,
  p160,
  p161,
  p162,
  p164,
  v1rc,
  v1month,
] = await Promise.all([
  readJson("phase-137-place-delivery-ledgers.json"),
  readJson("phase-145-evidence-gate-operations-journal.json"),
  readJson("phase-146-authority-gap-resolution-program.json"),
  readJson("phase-147-evidence-adjudication-record.json"),
  readJson("phase-151-weekly-desk-review-ledger.json"),
  readJson("phase-154-september-edition-packets.json"),
  readJson("phase-156-v1-launch-decision.json"),
  readJson("phase-158-september-evidence-operations-desk.json"),
  readJson("phase-160-longitudinal-pilot-matrices.json"),
  readJson("phase-161-stack-watch.json"),
  readJson("phase-162-local-system-expansion.json"),
  readJson("phase-164-monthly-candidate-decision.json"),
  readJson("v1-release-candidate.json"),
  readJson("v1-monthly-operating-program.json"),
]);

check(aggregate.schema_version === "1.0", "The v1cycle aggregate must use schema_version 1.0.");
check(aggregate.program_id === "FTFN-V1-SEPTEMBER-EVIDENCE-TO-PUBLICATION-CYCLE", "The v1cycle aggregate program identity changed.");
check(aggregate.version === "v1 September evidence-to-publication cycle", "The v1cycle version changed.");
check(aggregate.effective_date === v1cyclePublicationDate && isIsoDate(aggregate.effective_date), "The v1cycle effective date must be 2026-09-01.");
check(Array.isArray(aggregate.publication_boundaries) && aggregate.publication_boundaries.length >= 4, "The v1cycle aggregate lacks its publication boundaries.");

// The new layer is invalid if either receipt-backed baseline changes.
const phase156ReceiptId = "156-LOCAL-VALIDATION-2026-08-31-a750bba9528e";
const phase156Digest = "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a";
const phase164ReceiptId = "164-LOCAL-VALIDATION-2026-09-01-d2846dc22604";
const phase164Digest = "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19";
const currentV1rcDigest = await computeV1rcDigestFromDisk({ aggregate: v1rc, dataRoot, updateRoot });
const currentV1monthDigest = await computeV1monthDigestFromDisk({ aggregate: v1month, dataRoot, updateRoot });
check(currentV1rcDigest === phase156Digest, "The immutable Phase 156 candidate digest changed.");
check(p156.local_validation_receipt?.receipt_id === phase156ReceiptId && p156.local_validation_receipt?.artifact_digest === phase156Digest, "The embedded Phase 156 receipt changed.");
check(isValidV1rcValidationReceipt({ receipt: p156.local_validation_receipt, aggregate: v1rc, candidateDigest: currentV1rcDigest }), "The immutable Phase 156 receipt no longer validates its candidate.");
check(currentV1monthDigest === phase164Digest, "The immutable Phase 164 overlay digest changed.");
check(p164.local_validation_receipt?.receipt_id === phase164ReceiptId && p164.local_validation_receipt?.artifact_digest === phase164Digest, "The embedded Phase 164 receipt changed.");
check(isValidV1monthValidationReceipt({ receipt: p164.local_validation_receipt, aggregate: v1month, candidateDigest: currentV1monthDigest }), "The immutable Phase 164 receipt no longer validates its candidate.");
check(aggregate.baseline_v1rc?.receipt_id === phase156ReceiptId && aggregate.baseline_v1rc?.artifact_digest === phase156Digest, "The new aggregate does not bind the exact Phase 156 baseline.");
check(aggregate.baseline_v1month?.receipt_id === phase164ReceiptId && aggregate.baseline_v1month?.artifact_digest === phase164Digest, "The new aggregate does not bind the exact Phase 164 baseline.");
for (const [phase, receiptId, receipt] of [[156, phase156ReceiptId, p156.local_validation_receipt], [164, phase164ReceiptId, p164.local_validation_receipt]]) {
  const path = join(dataRoot, `phase-${phase}-receipts`, `${receiptId}.json`);
  check(await exists(path), `The immutable Phase ${phase} archive receipt is missing.`);
  if (await exists(path)) check(sameJson(await readFile(path, "utf8").then(JSON.parse), receipt), `The embedded and archived Phase ${phase} receipts differ.`);
}

// Common schema, identity, route, export, and aggregate contract.
const expectedRoutes = ["/review/v1cycle/"];
const expectedExports = [];
let primaryRecords = 0;
for (const phase of v1cyclePhases) {
  const registry = registries.get(phase);
  const records = array(registry?.[recordKeys.get(phase)]);
  const ids = records.map((record) => record[idKeys.get(phase)]);
  const hub = `/review/v1cycle/${sections.get(phase)}/`;
  const publicExport = `/data/${phaseFiles.get(phase)}`;
  const detailRoutes = phase === 172 ? [] : records.map((record) => record.route);
  check(registry?.schema_version === "1.0", `Phase ${phase} must use schema_version 1.0.`);
  check(registry?.phase === phase && registry?.program_id === `FTFN-PHASE-${phase}`, `Phase ${phase} has an invalid identity.`);
  check(registry?.effective_date === aggregate.effective_date, `Phase ${phase} does not share the aggregate effective date.`);
  check(registry?.record_status === "Published" && String(registry?.build_status).startsWith("Complete locally"), `Phase ${phase} overstates or omits its local build state.`);
  check(Array.isArray(registry?.publication_boundaries) && registry.publication_boundaries.length >= 4, `Phase ${phase} lacks publication boundaries.`);
  check(records.length > 0 && allUnique(ids), `Phase ${phase} lacks unique primary record IDs.`);
  check(ids.every((id) => typeof id === "string" && id.startsWith(`${phase}-`)), `Phase ${phase} contains an invalid primary record ID prefix.`);
  check(registry?.routes?.hub === hub && registry?.routes?.public_export === publicExport, `Phase ${phase} has a stale hub or export route.`);
  check(sameJson(registry?.public_html_routes, [hub, ...detailRoutes]), `Phase ${phase} has an inexact HTML route inventory.`);
  check(sameJson(registry?.public_json_exports, [publicExport]), `Phase ${phase} must expose exactly one JSON export.`);
  check(allUnique(detailRoutes) && detailRoutes.every((route) => typeof route === "string" && route.startsWith(hub) && route.endsWith("/")), `Phase ${phase} has malformed or duplicate detail routes.`);
  expectedRoutes.push(...registry.public_html_routes);
  expectedExports.push(publicExport);
  primaryRecords += records.length;
}
expectedExports.push("/data/v1-september-evidence-cycle.json");
check(expectedRoutes.length === 90 && allUnique(expectedRoutes), "The v1cycle contract must derive exactly 90 unique HTML routes.");
check(expectedExports.length === 9 && allUnique(expectedExports), "The v1cycle contract must derive exactly nine unique JSON exports.");
check(sameJson(aggregate.public_html_routes, expectedRoutes), "The aggregate HTML inventory is not the release hub plus every phase route in order.");
check(sameJson(aggregate.public_json_exports, expectedExports), "The aggregate JSON inventory is not the eight phase exports plus aggregate export in order.");
check(aggregate.counts?.phases === 8 && aggregate.counts?.primary_records === 95 && primaryRecords === 95 && aggregate.counts?.public_html_routes === 90 && aggregate.counts?.detail_routes === 81 && aggregate.counts?.public_json_exports === 9 && aggregate.counts?.publication_updates === 8, "The aggregate 8/95/90/81/9/8 inventory is stale.");
check(Array.isArray(aggregate.phases) && sameJson(aggregate.phases.map((item) => item.phase), v1cyclePhases), "The aggregate must inventory Phases 165–172 in order.");
for (const phaseEntry of array(aggregate.phases)) {
  const registry = registries.get(phaseEntry.phase);
  check(phaseEntry.title === registry?.title && phaseEntry.summary === registry?.summary && phaseEntry.status === registry?.build_status && phaseEntry.hub === registry?.routes?.hub && phaseEntry.public_export === registry?.routes?.public_export && sameJson(phaseEntry.counts, registry?.counts), `Aggregate metadata diverges from Phase ${phaseEntry.phase}.`);
}

// Phase 165: one lawful, archived evidence decision and nine untouched future operations.
const p165 = registries.get(165);
const p158ById = new Map(p158.operation_packets.map((record) => [record.operation_packet_id, record]));
check(p165.operation_runs.length === 10 && p165.counts?.operation_runs === 10, "Phase 165 must contain the ten September operation runs.");
check(sameSet(p165.operation_runs.map((record) => record.upstream_operation_packet_id), p158.operation_packets.map((record) => record.operation_packet_id)), "Phase 165 does not cover the ten Phase 158 packets exactly once.");
const dueOperations = p165.operation_runs.filter((record) => record.lawful_date <= aggregate.effective_date);
const futureOperations = p165.operation_runs.filter((record) => record.lawful_date > aggregate.effective_date);
const terminalOperations = p165.operation_runs.filter((record) => record.receipt?.receipt_id);
check(dueOperations.length === 1 && dueOperations[0]?.operation_run_id === "165-OPERATION-001", "Only Louisiana Starlink may be lawful in the September 1 snapshot.");
check(futureOperations.length === 9 && terminalOperations.length === 1, "Phase 165 must preserve one terminal decision and nine future operations.");
for (const record of p165.operation_runs) {
  const upstream = p158ById.get(record.upstream_operation_packet_id);
  check(Boolean(upstream), `${record.operation_run_id} points to a missing Phase 158 packet.`);
  check(upstream?.upstream_operation_id === record.upstream_operation_id && upstream?.lawful_date === record.lawful_date && upstream?.slug === record.slug, `${record.operation_run_id} changed its upstream operation identity, date, or slug.`);
  check(isIsoDate(record.lawful_date) && hasText(record.exact_next_artifact) && hasText(record.evidence_boundary) && hasText(record.stop_rule), `${record.operation_run_id} lacks a valid date or evidence boundary.`);
  check(record.due_as_of_effective_date === (record.lawful_date <= aggregate.effective_date), `${record.operation_run_id} has a stale due-state flag.`);
  check(array(record.propagation_ledger).length === 9 && sameJson(record.propagation_ledger.map((step) => step.sequence), [1, 2, 3, 4, 5, 6, 7, 8, 9]), `${record.operation_run_id} lacks the nine-step ordered propagation ledger.`);
  if (record.lawful_date > aggregate.effective_date) {
    check(record.source_check === null && record.decision === null && record.receipt === null, `${record.operation_run_id} predates a future source check, decision, or receipt.`);
    check(record.propagation_ledger.every((step) => String(step.state).startsWith("Not started")), `${record.operation_run_id} advances a future propagation step.`);
  } else {
    check(record.source_check?.checked_date >= record.lawful_date && record.source_check?.checked_date <= aggregate.effective_date, `${record.operation_run_id} has an invalid source-check date.`);
    check(record.decision?.decision_date >= record.lawful_date && record.decision?.decision_date <= aggregate.effective_date, `${record.operation_run_id} has an invalid decision date.`);
    check(record.decision?.decision_status === "no_material_change" && record.decision?.signal_decision === "retain_in_review_no_material_change", `${record.operation_run_id} must retain the bounded No Material Change signal decision.`);
    check(record.propagation_ledger.slice(0, 8).every((step) => String(step.state).startsWith("Complete")) && String(record.propagation_ledger[8]?.state).startsWith("Held"), `${record.operation_run_id} has an invalid propagation completion/hold split.`);
  }
}
check(p165.counts?.lawful_operations === 1 && p165.counts?.terminal_evidence_decisions === 1 && p165.counts?.no_material_change === 1 && p165.counts?.future_operations === 9 && p165.counts?.predated_decisions === 0 && p165.counts?.archived_evidence_receipts === 1 && p165.counts?.git_backed_release_steps_held === 1, "Phase 165 count fields are stale.");
const phase165ReceiptFiles = (await readdir(phase165ReceiptRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json"));
check(phase165ReceiptFiles.length === 2, "Phase 165 receipt storage must preserve the immutable September 1 snapshot receipt plus the append-only September 8 companion archive.");
const canonicalPhase165ReceiptName = "receipt-60-louisiana-starlink-2026-09-01-no-material-change.json";
const companionPhase165ReceiptName = "receipt-60-louisiana-starlink-2026-09-08-follow-up-no-material-change.json";
check(phase165ReceiptFiles.some((entry) => entry.name === canonicalPhase165ReceiptName) && phase165ReceiptFiles.some((entry) => entry.name === companionPhase165ReceiptName), "Phase 165 receipt storage is missing a canonical or companion receipt.");
const phase165Receipt = await readFile(join(phase165ReceiptRoot, canonicalPhase165ReceiptName), "utf8").then(JSON.parse).catch(() => null);
const phase165CompanionReceipt = await readFile(join(phase165ReceiptRoot, companionPhase165ReceiptName), "utf8").then(JSON.parse).catch(() => null);
check(Boolean(phase165Receipt) && sameJson(phase165Receipt, p165.current_decision_receipt), "The Phase 165 embedded decision receipt differs from its archive.");
if (phase165Receipt) {
  const receiptWithoutDigest = structuredClone(phase165Receipt);
  delete receiptWithoutDigest.artifact_digest;
  check(contentDigest(receiptWithoutDigest) === phase165Receipt.artifact_digest && isDigest(phase165Receipt.artifact_digest), "The Phase 165 receipt artifact digest is invalid.");
  check(phase165Receipt.receipt_id === terminalOperations[0]?.receipt?.receipt_id && phase165Receipt.artifact_digest === terminalOperations[0]?.receipt?.artifact_digest, "The Phase 165 operation does not bind its exact archived receipt.");
  check(phase165Receipt.source_checked_date === "2026-09-01" && phase165Receipt.decision_date === "2026-09-01" && phase165Receipt.decision_status === "no_material_change", "The Phase 165 receipt date or bounded decision changed.");
  check(array(phase165Receipt.official_surface_checks).length === terminalOperations[0]?.source_check?.checked_surfaces && phase165Receipt.official_surface_checks.every((item) => item.accessed_date === "2026-09-01" && /^https:\/\//.test(item.url)), "The Phase 165 official-surface receipt inventory is incomplete.");
  check(hasText(phase165Receipt.evidence_boundary, 100) && hasText(phase165Receipt.exact_next_artifact, 50) && phase165Receipt.next_check_date === "2026-09-08", "The Phase 165 receipt lacks its bounded finding or exact next check.");
}
if (phase165CompanionReceipt) {
  const companionWithoutDigest = structuredClone(phase165CompanionReceipt);
  delete companionWithoutDigest.artifact_digest;
  check(contentDigest(companionWithoutDigest) === phase165CompanionReceipt.artifact_digest && isDigest(phase165CompanionReceipt.artifact_digest), "The Phase 165 companion receipt artifact digest is invalid.");
  check(phase165CompanionReceipt.receipt_scope === "bounded_companion_recheck" && phase165CompanionReceipt.counts_as_cycle_decision === false, "The September 8 archive must remain an append-only companion rather than a snapshot cycle decision.");
  check(phase165CompanionReceipt.prior_receipt_id === phase165Receipt?.receipt_id && phase165CompanionReceipt.source_checked_date === "2026-09-08" && phase165CompanionReceipt.next_check_date === "2026-10-09", "The September 8 companion archive has a stale lineage or date.");
  check(array(phase165CompanionReceipt.official_surface_checks).length === 17 && phase165CompanionReceipt.official_surface_checks.every((item) => item.accessed_date === "2026-09-08" && /^https:\/\//.test(item.url)), "The September 8 companion official-surface inventory is incomplete.");
}

// Phase 166: four future weekly cycles and all 68 source-cutoff-specific desk windows.
const p166 = registries.get(166);
const expectedCadence = ["2026-09-06", "2026-09-13", "2026-09-20", "2026-09-27"];
const upstreamWindows = p151.desk_review_ledgers.flatMap((desk) => desk.review_windows.map((window) => ({
  ...window,
  desk_review_id: desk.desk_review_id,
  desk_id: desk.desk_id,
  topic_id: desk.topic_id,
})));
const upstreamWindowById = new Map(upstreamWindows.map((window) => [window.window_id, window]));
const upstreamEditionById = new Map(p154.edition_packets.map((packet) => [packet.edition_packet_id, packet]));
const allWindowBindings = p166.weekly_cycles.flatMap((cycle) => cycle.desk_window_bindings);
check(p166.weekly_cycles.length === 4 && sameJson(p166.weekly_cycles.map((cycle) => cycle.scheduled_date), expectedCadence) && sameJson(p166.cadence_dates, expectedCadence), "Phase 166 must expose the four September cadence dates in order.");
check(allWindowBindings.length === 68 && allUnique(allWindowBindings.map((window) => window.window_id)) && sameSet(allWindowBindings.map((window) => window.window_id), upstreamWindows.map((window) => window.window_id)), "Phase 166 must bind all 68 Phase 151 windows exactly once.");
for (const cycle of p166.weekly_cycles) {
  const edition = upstreamEditionById.get(cycle.upstream_edition_packet_id);
  check(cycle.scheduled_date > aggregate.effective_date && cycle.source_eligibility_cutoff === cycle.scheduled_date, `${cycle.weekly_cycle_id} has an invalid future cutoff.`);
  check(array(cycle.desk_window_bindings).length === 17 && cycle.desk_windows_required === 17 && cycle.desk_windows_terminal === 0, `${cycle.weekly_cycle_id} must carry 17 unclosed desk windows.`);
  check(edition?.publication_date === cycle.scheduled_date, `${cycle.weekly_cycle_id} does not bind the matching Phase 154 edition date.`);
  check(cycle.publication_decision === null && cycle.publication_decision_date === null && cycle.publication_receipt_id === null && cycle.publication_input_digest === null, `${cycle.weekly_cycle_id} predates an edition decision, receipt, or digest.`);
  check(cycle.due_operation_ids.every((id) => p145.gate_operations.some((operation) => operation.operation_id === id && operation.lawful_date <= cycle.scheduled_date)), `${cycle.weekly_cycle_id} binds an operation after its cutoff or a missing operation.`);
  for (const window of cycle.desk_window_bindings) {
    const upstream = upstreamWindowById.get(window.window_id);
    check(Boolean(upstream) && upstream.scheduled_date === cycle.scheduled_date && upstream.topic_id === window.topic_id, `${window.window_id} changed its Phase 151 date or topic identity.`);
    check(window.source_cutoff === cycle.scheduled_date && window.decision === null && window.decision_date === null && window.receipt_id === null, `${window.window_id} predates a review decision or uses the wrong cutoff.`);
  }
}
check(p166.counts?.weekly_cycles === 4 && p166.counts?.unique_desk_windows === 68 && p166.counts?.windows_per_cycle === 17 && p166.counts?.edition_decisions === 4 && p166.counts?.terminal_windows === 0 && p166.counts?.terminal_editions === 0 && p166.counts?.predated_decisions === 0, "Phase 166 count fields are stale.");

// Phase 167: twelve owner hearings, thirty unique official candidates, and no admission.
const p167 = registries.get(167);
const upstreamDispositionById = new Map(p146.gap_dispositions.map((record) => [record.disposition_id, record]));
const upstreamAlternativeById = new Map(p146.alternative_artifact_registry.map((record) => [record.candidate_id, record]));
const assignedAlternatives = p167.authority_hearings.flatMap((hearing) => hearing.alternative_candidates);
const uniqueAssignedAlternativeIds = [...new Set(assignedAlternatives.map((candidate) => candidate.candidate_id))];
check(p167.authority_hearings.length === 12 && sameSet(p167.authority_hearings.map((hearing) => hearing.upstream_disposition_id), p146.gap_dispositions.map((record) => record.disposition_id)), "Phase 167 must cover all twelve Phase 146 dispositions exactly once.");
check(uniqueAssignedAlternativeIds.length === 30 && sameSet(uniqueAssignedAlternativeIds, p146.alternative_artifact_registry.map((candidate) => candidate.candidate_id)), "Phase 167 must expose all thirty unique Phase 146 alternatives.");
for (const hearing of p167.authority_hearings) {
  const upstream = upstreamDispositionById.get(hearing.upstream_disposition_id);
  check(Boolean(upstream) && upstream.candidate_set_digest === hearing.candidate_set_digest && upstream.mission_id === hearing.mission_id, `${hearing.authority_hearing_id} changed its upstream mission or candidate-set digest.`);
  check(sameSet(hearing.alternative_candidates.map((candidate) => candidate.candidate_id), upstream?.alternative_candidate_ids ?? []), `${hearing.authority_hearing_id} changed its assigned candidate set.`);
  check(hearing.owner_disposition === null && hearing.decision_date === null && hearing.decision_receipt_id === null && hearing.reviewer_role === null && hearing.rationale === null, `${hearing.authority_hearing_id} fabricates an owner disposition.`);
  for (const candidate of hearing.alternative_candidates) {
    const source = upstreamAlternativeById.get(candidate.candidate_id);
    check(Boolean(source) && candidate.title === source.title && candidate.url === source.url && candidate.publisher === source.publisher, `${candidate.candidate_id} changed its official alternative identity.`);
    check(candidate.state === "Candidate — checked, not admitted", `${candidate.candidate_id} is represented as admitted evidence.`);
  }
}
check(p167.counts?.authority_hearings === 12 && p167.counts?.alternative_candidate_assignments === 37 && p167.counts?.unique_alternative_candidates === 30 && p167.counts?.admitted_candidates === 0 && p167.counts?.terminal_dispositions === 0 && p167.counts?.owner_actions_pending === 12, "Phase 167 must report 12 hearings, 37 candidate assignments, 30 unique candidates, zero admissions, and 12 pending owner actions.");

// Phase 168: eighteen requirement dockets must precede six mission dockets.
const p168 = registries.get(168);
const upstreamAdjudicationById = new Map(p147.adjudication_records.map((record) => [record.adjudication_record_id, record]));
const requirements = p168.adjudication_dockets.filter((record) => record.record_kind === "requirement decision");
const missions = p168.adjudication_dockets.filter((record) => record.record_kind === "mission decision");
const requirementByUpstreamId = new Map(requirements.map((record) => [record.upstream_adjudication_record_id, record]));
check(p168.adjudication_dockets.length === 24 && requirements.length === 18 && missions.length === 6, "Phase 168 must contain eighteen requirement and six mission dockets.");
check(sameSet(p168.adjudication_dockets.map((record) => record.upstream_adjudication_record_id), p147.adjudication_records.map((record) => record.adjudication_record_id)), "Phase 168 must cover every Phase 147 adjudication record once.");
for (const docket of p168.adjudication_dockets) {
  const upstream = upstreamAdjudicationById.get(docket.upstream_adjudication_record_id);
  check(Boolean(upstream) && upstream.record_kind === docket.record_kind && upstream.mission_id === docket.mission_id && upstream.candidate_set_digest === docket.candidate_set_digest, `${docket.adjudication_docket_id} changed its upstream kind, mission, or digest.`);
  check(docket.decision_state === "Pending owner adjudication" && docket.decision_date === null && docket.decision_receipt_id === null && docket.reviewer_role === null && docket.rationale === null, `${docket.adjudication_docket_id} fabricates an owner adjudication.`);
  check(array(docket.accepted_source_ids).length === 0 && array(docket.rejected_source_ids).length === 0, `${docket.adjudication_docket_id} fabricates accepted or rejected sources.`);
  if (docket.record_kind === "requirement decision") {
    check(array(docket.prerequisite_requirement_ids).length === 0 && docket.prerequisite_state === "Not applicable", `${docket.adjudication_docket_id} has an invalid requirement prerequisite.`);
  } else {
    const prerequisites = array(docket.prerequisite_requirement_ids);
    check(prerequisites.length > 0 && prerequisites.every((id) => requirementByUpstreamId.get(id)?.mission_id === docket.mission_id), `${docket.adjudication_docket_id} lacks valid same-mission requirement prerequisites.`);
    const prerequisitesTerminal = prerequisites.every((id) => requirementByUpstreamId.get(id)?.decision_receipt_id);
    check(!prerequisitesTerminal && String(docket.prerequisite_state).startsWith("Not satisfied") && String(docket.state).startsWith("Held"), `${docket.adjudication_docket_id} violates requirement-before-mission sequencing.`);
  }
}
check(p168.counts?.adjudication_dockets === 24 && p168.counts?.requirement_dockets === 18 && p168.counts?.mission_dockets === 6 && p168.counts?.terminal_requirements === 0 && p168.counts?.terminal_missions === 0 && p168.counts?.sequencing_violations === 0, "Phase 168 count fields or sequencing state are stale.");

// Phase 169: three six-test pilots plus one separately owner-gated zero-series boundary.
const p169 = registries.get(169);
const upstreamPilotById = new Map(p160.pilot_matrices.map((record) => [record.pilot_matrix_id, record]));
const compatibilityPilots = p169.longitudinal_adjudication_packets.filter((record) => record.packet_kind === "compatibility pilot");
const zeroSeriesPackets = p169.longitudinal_adjudication_packets.filter((record) => record.packet_kind === "zero-series launch boundary");
const expectedDimensions = ["identity", "period", "measure", "denominator", "revision lineage", "dual review"];
check(p169.longitudinal_adjudication_packets.length === 4 && compatibilityPilots.length === 3 && zeroSeriesPackets.length === 1, "Phase 169 must contain three pilots and one zero-series boundary.");
check(sameSet(p169.longitudinal_adjudication_packets.map((record) => record.upstream_pilot_matrix_id), p160.pilot_matrices.map((record) => record.pilot_matrix_id)), "Phase 169 must cover every Phase 160 pilot matrix once.");
for (const packet of compatibilityPilots) {
  const upstream = upstreamPilotById.get(packet.upstream_pilot_matrix_id);
  check(Boolean(upstream) && upstream.series_definition_digest === packet.series_definition_digest, `${packet.longitudinal_adjudication_packet_id} changed its upstream series definition.`);
  check(packet.tests_required === 6 && packet.compatibility_tests.length === 6 && sameSet(packet.compatibility_tests.map((test) => test.dimension), expectedDimensions), `${packet.longitudinal_adjudication_packet_id} lacks the six compatibility dimensions.`);
  check(packet.tests_passed === 0 && packet.compatibility_tests.every((test) => test.admitted === false), `${packet.longitudinal_adjudication_packet_id} fabricates a passing compatibility test.`);
}
for (const packet of p169.longitudinal_adjudication_packets) {
  check(packet.admitted_series_id === null && packet.observations_transferred === 0 && packet.owner_accepted_zero_series === false && packet.decision_date === null && packet.decision_receipt_id === null, `${packet.longitudinal_adjudication_packet_id} fabricates admission, transfer, or owner acceptance.`);
  check(hasText(packet.decisive_next_action) && hasText(packet.stop_rule), `${packet.longitudinal_adjudication_packet_id} lacks a decisive next action or stop rule.`);
}
check(p169.counts?.adjudication_packets === 4 && p169.counts?.compatibility_pilots === 3 && p169.counts?.compatibility_tests === 18 && p169.counts?.tests_passed === 0 && p169.counts?.admitted_series === 0 && p169.counts?.observations_transferred === 0 && p169.counts?.owner_zero_series_decisions === 0, "Phase 169 must retain 18 unpassed tests and zero transfers or admissions.");

// Phase 170: complete fifteen-place identity coverage without synthetic stages or comparisons.
const p170 = registries.get(170);
const upstreamPlaceById = new Map(p137.place_ledgers.map((record) => [record.ledger_id, record]));
const upstreamBriefIds = new Set(p162.local_system_briefs.map((record) => record.local_system_brief_id));
const allLayers = p170.place_system_dossiers.flatMap((record) => record.system_layers);
const allTimelineEntries = p170.place_system_dossiers.flatMap((record) => record.bounded_timeline);
const allEdges = p170.place_system_dossiers.flatMap((record) => record.dependency_edges);
check(p170.place_system_dossiers.length === 15 && sameSet(p170.place_system_dossiers.map((record) => record.upstream_place_ledger_id), p137.place_ledgers.map((record) => record.ledger_id)), "Phase 170 must cover all fifteen Phase 137 place ledgers exactly once.");
check(p170.place_system_dossiers.filter((record) => record.dossier_origin === "Expanded from Phase 162 brief").length === 4 && p170.place_system_dossiers.filter((record) => record.dossier_origin === "New Phase 170 deep dossier").length === 11, "Phase 170 must distinguish four carried briefs and eleven new dossiers.");
for (const dossier of p170.place_system_dossiers) {
  const upstream = upstreamPlaceById.get(dossier.upstream_place_ledger_id);
  check(Boolean(upstream) && upstream.atlas_place_id === dossier.atlas_place_id && upstream.slug === dossier.slug && String(dossier.title).startsWith(upstream.title) && upstream.geography === dossier.geography && upstream.inherited_state === dossier.inherited_state, `${dossier.place_system_dossier_id} changed its place identity or inherited state.`);
  check(sameSet(dossier.source_ids, upstream?.source_ids ?? []) && sameSet(dossier.signal_ids, upstream?.signal_ids ?? []) && sameSet(dossier.related_project_ids, upstream?.related_project_ids ?? []), `${dossier.place_system_dossier_id} changed its inherited source, signal, or project joins.`);
  check(dossier.system_layers.length === 6 && dossier.bounded_timeline.length === 4 && dossier.dependency_edges.length === 5, `${dossier.place_system_dossier_id} must expose 6 layers, 4 timeline entries, and 5 edges.`);
  check(hasText(dossier.reader_narrative, 200) && hasText(dossier.conversion_question, 40) && hasText(dossier.decision_use, 50) && hasText(dossier.interpretation_boundary, 50), `${dossier.place_system_dossier_id} lacks substantive reader or decision guidance.`);
  check(dossier.place_stage === null && dossier.causal_conclusion === null && dossier.score === null && dossier.rank === null, `${dossier.place_system_dossier_id} creates a synthetic stage, causal conclusion, score, or rank.`);
  check(dossier.dependency_edges.every((edge) => edge.causal_result === null && edge.relationship === "Evidence-acquisition dependency"), `${dossier.place_system_dossier_id} overstates a causal dependency result.`);
  if (dossier.upstream_phase_162_brief_id) check(upstreamBriefIds.has(dossier.upstream_phase_162_brief_id), `${dossier.place_system_dossier_id} points to a missing Phase 162 brief.`);
}
check(allLayers.length === 90 && allUnique(allLayers.map((record) => record.layer_id)), "Phase 170 must publish ninety unique system layers.");
check(allTimelineEntries.length === 60, "Phase 170 must publish sixty bounded timeline entries.");
check(allEdges.length === 75 && allUnique(allEdges.map((record) => record.edge_id)), "Phase 170 must publish seventy-five unique dependency edges.");
check(p170.counts?.place_system_dossiers === 15 && p170.counts?.phase_162_briefs_carried === 4 && p170.counts?.new_deep_dossiers === 11 && p170.counts?.system_layers === 90 && p170.counts?.bounded_timeline_entries === 60 && p170.counts?.dependency_maps === 15 && p170.counts?.dependency_edges === 75 && p170.counts?.synthetic_place_stages === 0 && p170.counts?.scores_or_ranks === 0, "Phase 170 count fields are stale.");

// Phase 171: eight lanes preserve every packet and claim once; essays add no new evidence decision.
const p171 = registries.get(171);
const laneChapters = p171.compendium_records.filter((record) => record.record_kind === "Lane chapter");
const essays = p171.compendium_records.filter((record) => record.record_kind === "Cross-system essay");
const upstreamPacketById = new Map(p161.stack_watch_packets.map((record) => [record.stack_watch_packet_id, record]));
const chapterPacketIds = laneChapters.flatMap((record) => record.packet_ids);
const chapterClaimBlocks = laneChapters.flatMap((record) => record.claim_blocks);
const upstreamClaimBlocks = p161.stack_watch_packets.flatMap((packet) => packet.claim_blocks.map((claim) => ({ ...claim, packet_id: packet.stack_watch_packet_id })));
const upstreamClaimById = new Map(upstreamClaimBlocks.map((claim) => [claim.claim_block_id, claim]));
check(p171.compendium_records.length === 12 && laneChapters.length === 8 && essays.length === 4, "Phase 171 must publish eight lane chapters and four cross-system essays.");
check(allUnique(laneChapters.map((record) => record.lane)) && sameSet(chapterPacketIds, p161.stack_watch_packets.map((packet) => packet.stack_watch_packet_id)), "Phase 171 must bind each of the 24 Phase 161 packets exactly once across eight lanes.");
check(chapterClaimBlocks.length === 72 && allUnique(chapterClaimBlocks.map((claim) => claim.claim_block_id)) && sameSet(chapterClaimBlocks.map((claim) => claim.claim_block_id), upstreamClaimBlocks.map((claim) => claim.claim_block_id)), "Phase 171 must preserve all seventy-two claim blocks exactly once.");
for (const chapter of laneChapters) {
  check(chapter.packet_count === 3 && chapter.packet_ids.length === 3 && chapter.claim_block_count === 9 && chapter.claim_blocks.length === 9, `${chapter.compendium_record_id} must bind three packets and nine claims.`);
  check(hasText(chapter.orientation, 150) && array(chapter.chapter_sections).length === 3 && hasText(chapter.boundary, 80), `${chapter.compendium_record_id} lacks bounded chapter synthesis.`);
  for (const binding of chapter.source_semantic_digests) {
    const upstream = upstreamPacketById.get(binding.packet_id);
    check(upstream?.source_semantic_digest === binding.digest && isDigest(binding.digest), `${chapter.compendium_record_id} changed the semantic digest for ${binding.packet_id}.`);
  }
  for (const claim of chapter.claim_blocks) {
    const upstream = upstreamClaimById.get(claim.claim_block_id);
    check(Boolean(upstream) && claim.packet_id === upstream.packet_id && claim.claim_type === upstream.claim_type && claim.text === upstream.text && sameJson(claim.source_ids, upstream.source_ids) && claim.source_semantic_digest === upstream.source_semantic_digest && claim.publication_state === upstream.publication_state, `${chapter.compendium_record_id} changed inherited claim ${claim.claim_block_id}.`);
  }
}
for (const essay of essays) {
  check(array(essay.referenced_packet_ids).length > 0 && essay.referenced_packet_ids.every((id) => upstreamPacketById.has(id)), `${essay.compendium_record_id} cites a missing Phase 161 packet.`);
  const expectedSources = [...new Set(essay.referenced_packet_ids.flatMap((id) => upstreamPacketById.get(id).source_ids))];
  check(sameSet(essay.source_ids, expectedSources), `${essay.compendium_record_id} has a stale source set.`);
  check(hasText(essay.thesis, 80) && hasText(essay.synthesis, 250) && array(essay.decision_questions).length >= 5 && array(essay.prohibited_shortcuts).length >= 5 && hasText(essay.boundary, 80), `${essay.compendium_record_id} lacks substantive bounded synthesis.`);
}
check(p171.counts?.compendium_records === 12 && p171.counts?.lane_chapters === 8 && p171.counts?.cross_system_essays === 4 && p171.counts?.inherited_packets === 24 && p171.counts?.inherited_claim_blocks_once === 72 && p171.counts?.source_bindings === 24 && p171.counts?.new_admission_decisions === 0 && p171.counts?.scores_or_ranks === 0, "Phase 171 count fields are stale.");

// Phase 172: derived gate state and content-addressed local validation only.
const p172 = registries.get(172);
const expectedGateStates = new Map([
  ["172-GATE-01-IMMUTABLE-BASELINES", "Pass"],
  ["172-GATE-02-SEPTEMBER-01-EVIDENCE", "Pass"],
  ["172-GATE-03-FUTURE-OPERATIONS", "Held"],
  ["172-GATE-04-DESK-CLOSURES", "Held"],
  ["172-GATE-05-SEPTEMBER-EDITIONS", "Held"],
  ["172-GATE-06-AUTHORITY-HEARINGS", "Held"],
  ["172-GATE-07-REQUIREMENT-MISSION", "Held"],
  ["172-GATE-08-LONGITUDINAL", "Held"],
  ["172-GATE-09-FIFTEEN-PLACE-ATLAS", "Pass"],
  ["172-GATE-10-COMPENDIUM", "Pass"],
  ["172-GATE-11-MACHINE-CONTRACT", "Pass"],
  ["172-GATE-12-CONTENT-INTEGRITY", "Pass"],
  ["172-GATE-13-LOCAL-VALIDATION", p172.local_validation_receipt ? "Pass" : "Pending build"],
  ["172-GATE-14-OWNER-PROMOTION", "Held"],
]);
const gateById = new Map(p172.state_report_gates.map((gate) => [gate.gate_id, gate]));
check(p172.state_report_gates.length === 14 && allUnique(p172.state_report_gates.map((gate) => gate.gate_id)), "Phase 172 must contain fourteen unique readiness gates.");
for (const [gateId, state] of expectedGateStates) {
  const gate = gateById.get(gateId);
  check(Boolean(gate) && gate.state === state && hasText(gate.evidence, 20) && hasText(gate.next_action, 20), `${gateId} is missing or has a stale derived state.`);
}
check(gateById.get("172-GATE-02-SEPTEMBER-01-EVIDENCE")?.receipt_id === phase165Receipt?.receipt_id, "Phase 172 does not bind the Phase 165 evidence receipt.");
const gateCounts = {
  passed: p172.state_report_gates.filter((gate) => gate.state === "Pass").length,
  held: p172.state_report_gates.filter((gate) => gate.state === "Held").length,
  pending: p172.state_report_gates.filter((gate) => gate.state === "Pending build").length,
};
const expectedGateCounts = p172.local_validation_receipt ? { passed: 7, held: 7, pending: 0 } : { passed: 6, held: 7, pending: 1 };
check(sameJson(gateCounts, expectedGateCounts), `Phase 172 must derive ${expectedGateCounts.passed}/${expectedGateCounts.held}/${expectedGateCounts.pending}.`);
check(p172.counts?.readiness_gates === 14 && p172.counts?.passed === gateCounts.passed && p172.counts?.held === gateCounts.held && p172.counts?.pending_build === gateCounts.pending && p172.counts?.false_passes === 0, "Phase 172 count fields diverge from its gates.");
check(p172.v1_promotion_state === "Held" && aggregate.v1_promotion_state === "Held", "Phase 172 or the aggregate overstates v1 promotion.");
check(Object.values(p172.owner_authority ?? {}).every((value) => value === false), "Phase 172 overstates evidence, owner, repository, hosting, DNS, launch, or promotion authority.");
check(p172.evidence_cycle_close_date === "2026-10-09" && p172.next_calendar_action?.date === "2026-09-06", "Phase 172 has a stale calendar tail or next action.");
check(aggregate.operating_state?.evidence_decisions_complete === 1 && aggregate.operating_state?.future_operations === 9 && aggregate.operating_state?.future_desk_windows === 68 && aggregate.operating_state?.future_editions === 4 && aggregate.operating_state?.owner_actions_pending === 36 && aggregate.operating_state?.admitted_longitudinal_series === 0 && aggregate.operating_state?.place_dossiers_published === 15 && aggregate.operating_state?.compendium_records_published === 12, "The aggregate operating state diverges from Phases 165–171.");

const currentV1cycleDigest = await computeV1cycleDigestFromDisk({ dataRoot, updatesRoot: updateRoot });
check(isDigest(currentV1cycleDigest), "The normalized v1cycle artifact digest is invalid.");
if (p172.local_validation_receipt) {
  check(isValidV1cycleValidationReceipt({ receipt: p172.local_validation_receipt, aggregate, candidateDigest: currentV1cycleDigest }), "The Phase 172 validation receipt is malformed or stale.");
  check(sameJson(aggregate.local_validation_receipt, p172.local_validation_receipt) && aggregate.local_validation_state === "Passed", "The aggregate does not embed the exact Phase 172 validation receipt.");
  const archivePath = join(phase172ReceiptRoot, `${p172.local_validation_receipt.receipt_id}.json`);
  check(await exists(archivePath), "The embedded Phase 172 receipt has no immutable archive copy.");
  if (await exists(archivePath)) check(sameJson(await readFile(archivePath, "utf8").then(JSON.parse), p172.local_validation_receipt), "The embedded and archived Phase 172 receipts differ.");
} else {
  check(aggregate.local_validation_receipt === null && aggregate.local_validation_state === "Pending build" && gateById.get("172-GATE-13-LOCAL-VALIDATION")?.receipt_id === null, "A receipt-free Phase 172 candidate must remain Pending build everywhere.");
}

// Immutable publication updates, work packages, roadmap, and handoff.
const expectedUpdateNames = v1cyclePhases.map((phase) => `${v1cyclePublicationDate}-phase-${phase}.json`);
check(sameJson(aggregate.publication_update_files, expectedUpdateNames), "The aggregate must inventory exactly the eight Phase 165–172 updates.");
for (const phase of v1cyclePhases) {
  const registry = registries.get(phase);
  const updateName = `${v1cyclePublicationDate}-phase-${phase}.json`;
  const updatePath = join(updateRoot, updateName);
  check(await exists(updatePath), `Missing publication update ${updateName}.`);
  if (!(await exists(updatePath))) continue;
  const update = await readFile(updatePath, "utf8").then(JSON.parse);
  const records = registry[recordKeys.get(phase)];
  const ids = records.map((record) => record[idKeys.get(phase)]);
  check(update.id === `update-${v1cyclePublicationDate}-phase-${phase}` && update.effective_date === v1cyclePublicationDate && hasText(update.entry_type) && hasText(update.title) && hasText(update.summary), `Phase ${phase} update has an invalid immutable identity or description.`);
  const expectedAffectedIds = phase === 165 ? [...ids, ...array(phase165Receipt?.affected_record_ids)] : ids;
  check(sameJson(update.affected_record_ids, expectedAffectedIds), `Phase ${phase} update has stale affected-record IDs.`);
  check(sameJson(update.related_paths, registry.public_html_routes), `Phase ${phase} update has stale related paths.`);
  check(update.work_package === `docs/work-packages/${phaseFiles.get(phase).replace(/\.json$/, ".md")}`, `Phase ${phase} update points to the wrong work package.`);
  check(await exists(join(workspaceRoot, update.work_package)), `Phase ${phase} work package is missing.`);
  if (phase === 165) check(update.receipt_id === phase165Receipt?.receipt_id && update.receipt_type === "No Material Change" && update.source_checked_date === "2026-09-01" && update.decision_date === "2026-09-01", "The Phase 165 update does not carry the exact evidence-decision receipt identity.");
}
check(await exists(join(workspaceRoot, "docs", "roadmap-v1-september-evidence-to-publication-cycle.md")), "The Phase 165–172 roadmap is missing.");
check(await exists(join(workspaceRoot, "docs", "session-handoff-v1-september-evidence-to-publication-cycle.md")), "The Phase 165–172 handoff is missing.");

if (failures.length) {
  console.error(`Phase 165–172 content assertion failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 165–172 content assertion passed: 90 routes, 9 exports, 8 updates, 1 dated evidence receipt, 68 desk windows, 12 authority hearings, 30 unique alternatives, 24 adjudication dockets, 18 compatibility tests, 15 place dossiers, 72 inherited claims, and Phase 172 ${gateCounts.passed}/${gateCounts.held}/${gateCounts.pending}.`);
