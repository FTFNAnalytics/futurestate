import { createHash } from "node:crypto";
import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { august31SourceSemantics } from './lib/historical-source-semantics.mjs';
import {
  computeV1monthDigestFromDisk,
  isValidV1monthValidationReceipt,
  v1monthPhases,
  v1monthPublicationDate,
} from "./lib/v1month-candidate-digest.mjs";
import {
  computeV1rcDigestFromDisk,
  isValidV1rcValidationReceipt,
} from "./lib/v1rc-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const updateRoot = join(appRoot, "src", "content", "updates");
const receiptRoot = join(dataRoot, "phase-164-receipts");
const failures = [];

const phaseFiles = new Map([
  [157, "phase-157-v1-candidate-preservation-ledger.json"],
  [158, "phase-158-september-evidence-operations-desk.json"],
  [159, "phase-159-owner-decision-sprint.json"],
  [160, "phase-160-longitudinal-pilot-matrices.json"],
  [161, "phase-161-stack-watch.json"],
  [162, "phase-162-local-system-expansion.json"],
  [163, "phase-163-september-editorial-runbooks.json"],
  [164, "phase-164-monthly-candidate-decision.json"],
]);
const recordKeys = new Map([
  [157, "preservation_records"], [158, "operation_packets"], [159, "authority_mission_boards"],
  [160, "pilot_matrices"], [161, "stack_watch_packets"], [162, "local_system_briefs"],
  [163, "editorial_runbooks"], [164, "readiness_gates"],
]);
const idKeys = new Map([
  [157, "preservation_id"], [158, "operation_packet_id"], [159, "mission_board_id"],
  [160, "pilot_matrix_id"], [161, "stack_watch_packet_id"], [162, "local_system_brief_id"],
  [163, "editorial_runbook_id"], [164, "gate_id"],
]);
const sections = new Map([
  [157, "candidate-preservation"], [158, "september-operations"], [159, "owner-sprint"],
  [160, "longitudinal-pilots"], [161, "stack-watch"], [162, "local-systems"],
  [163, "editorial-runbooks"], [164, "monthly-decision"],
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
const hasText = (value, minimum = 1) => typeof value === "string" && value.trim().length >= minimum;
const isDigest = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const isIsoDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};
const allUnique = (items) => Array.isArray(items) && new Set(items).size === items.length;
const sameSet = (left, right) => Array.isArray(left)
  && Array.isArray(right)
  && left.length === right.length
  && allUnique(left)
  && allUnique(right)
  && left.every((value) => new Set(right).has(value));
const sameJson = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const arizonaRefresh=JSON.parse(await readFile(join(updateRoot,'2026-09-22-phase-55q-arizona-wastewater-recheck.json'),'utf8'));
const loudounNote=await readFile(join(workspaceRoot,'docs/operational-checks/2026-10-01-loudoun-phase2-standards-recheck.md'),'utf8');
const sourceSemantics = (source) => august31SourceSemantics({
  id: source.id,
  name: source.name,
  url: source.url,
  source_type: source.source_type,
  credibility_level: source.credibility_level,
  primary_topics: source.primary_topics,
  framework_layers: source.framework_layers,
  country_or_region: source.country_or_region,
  known_limitations: source.known_limitations,
  last_checked_date: source.last_checked_date,
  monitoring_status: source.monitoring_status,
  coverage_role: source.coverage_role,
},arizonaRefresh,loudounNote);
const semanticDigest = (sourceIds, sourceById) => {
  const sources = [...sourceIds].sort().map((id) => sourceById.get(id)).filter(Boolean);
  return sources.length === sourceIds.length ? digest(sources.map(sourceSemantics)) : null;
};

const registries = new Map(await Promise.all([...phaseFiles].map(async ([phase, name]) => [phase, await readJson(name)])));
const aggregate = await readJson("v1-monthly-operating-program.json");
const [p145, p146, p147, p149, p150, p151, p152, p154, p156, v1rc, p136, p137] = await Promise.all([
  readJson("phase-145-evidence-gate-operations-journal.json"),
  readJson("phase-146-authority-gap-resolution-program.json"),
  readJson("phase-147-evidence-adjudication-record.json"),
  readJson("phase-149-longitudinal-evidence-lab.json"),
  readJson("phase-150-comparison-passports-2-0.json"),
  readJson("phase-151-weekly-desk-review-ledger.json"),
  readJson("phase-152-frontier-topic-field-guides.json"),
  readJson("phase-154-september-edition-packets.json"),
  readJson("phase-156-v1-launch-decision.json"),
  readJson("v1-release-candidate.json"),
  readJson("phase-136-named-project-chronicles.json"),
  readJson("phase-137-place-delivery-ledgers.json"),
]);
const sourceRecords = await Promise.all((await readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => readFile(join(sourceRoot, entry.name), "utf8").then(JSON.parse)));
const sourceById = new Map(sourceRecords.map((source) => [source.id, source]));
const effectiveDate = aggregate.effective_date;

check(isIsoDate(effectiveDate), "The v1month aggregate needs a valid ISO effective date.");
check(effectiveDate >= v1monthPublicationDate, `The overlay cannot predate ${v1monthPublicationDate}.`);
check(aggregate.schema_version === "1.0" && aggregate.program_id === "FTFN-V1-SEPTEMBER-OPERATING-PROGRAM", "The v1month aggregate identity or schema version is invalid.");
check(aggregate.version === "v1 September operating overlay", "The v1month aggregate version changed.");
check(Array.isArray(aggregate.publication_boundaries) && aggregate.publication_boundaries.length >= 4, "The v1month aggregate lacks its publication boundaries.");

const expectedRoutes = ["/review/v1month/"];
const expectedExports = [];
for (const phase of v1monthPhases) {
  const registry = registries.get(phase);
  const records = registry?.[recordKeys.get(phase)];
  const ids = records?.map((record) => record[idKeys.get(phase)]);
  const hub = `/review/v1month/${sections.get(phase)}/`;
  const publicExport = `/data/${phaseFiles.get(phase)}`;
  const detailRoutes = phase === 157 || phase === 164 ? [] : records?.map((record) => record.route) ?? [];
  check(registry?.schema_version === "1.0", `Phase ${phase} must use schema_version 1.0.`);
  check(registry?.phase === phase && registry?.program_id === `FTFN-PHASE-${phase}`, `Phase ${phase} has an invalid phase or program identity.`);
  check(registry?.effective_date === effectiveDate, `Phase ${phase} does not share the aggregate effective date.`);
  check(registry?.record_status === "Published" && String(registry?.build_status).startsWith("Complete locally"), `Phase ${phase} has an invalid local publication/build state.`);
  check(Array.isArray(records) && records.length > 0 && allUnique(ids), `Phase ${phase} lacks unique inspectable record identities.`);
  check(ids?.every((id) => typeof id === "string" && id.startsWith(`${phase}-`)), `Phase ${phase} contains an invalid record ID prefix.`);
  check(Array.isArray(registry?.publication_boundaries) && registry.publication_boundaries.length >= 4, `Phase ${phase} lacks its publication boundaries.`);
  check(registry?.routes?.hub === hub && registry?.routes?.public_export === publicExport, `Phase ${phase} has a stale route or export binding.`);
  check(sameJson(registry?.public_html_routes, [hub, ...detailRoutes]), `Phase ${phase} has an inexact public HTML inventory.`);
  check(sameJson(registry?.public_json_exports, [publicExport]), `Phase ${phase} must expose exactly its own export.`);
  check(allUnique(detailRoutes) && detailRoutes.every((route) => route.startsWith(hub) && route.endsWith("/")), `Phase ${phase} has a duplicated or malformed detail route.`);
  expectedRoutes.push(...registry.public_html_routes);
  expectedExports.push(publicExport);
}
expectedExports.push("/data/v1-monthly-operating-program.json");
check(expectedRoutes.length === 67 && allUnique(expectedRoutes), "The overlay must declare exactly 67 unique HTML routes.");
check(expectedExports.length === 9 && allUnique(expectedExports), "The overlay must declare exactly nine unique JSON exports.");
check(sameJson(aggregate.public_html_routes, expectedRoutes), "The aggregate HTML inventory is not the release hub plus all eight phase inventories in order.");
check(sameJson(aggregate.public_json_exports, expectedExports), "The aggregate JSON inventory is not the eight phase exports plus its own export.");
check(aggregate.counts?.phases === 8 && aggregate.counts?.public_html_routes === 67 && aggregate.counts?.detail_routes === 58 && aggregate.counts?.public_json_exports === 9 && aggregate.counts?.update_records === 8, "The aggregate route, export, or phase counts are stale.");
check(Array.isArray(aggregate.phases) && aggregate.phases.length === 8 && sameJson(aggregate.phases.map((item) => item.phase), v1monthPhases), "The aggregate phase inventory must contain Phases 157–164 in order.");
for (const phaseEntry of aggregate.phases ?? []) {
  const registry = registries.get(phaseEntry.phase);
  check(phaseEntry.title === registry?.title && phaseEntry.status === registry?.build_status && phaseEntry.hub_route === registry?.routes?.hub && phaseEntry.public_export === registry?.routes?.public_export && sameJson(phaseEntry.counts, registry?.counts), `Aggregate Phase ${phaseEntry.phase} metadata diverges from its registry.`);
}

const baselineDigest = "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a";
const baselineReceiptId = "156-LOCAL-VALIDATION-2026-08-31-a750bba9528e";
const currentV1rcDigest = await computeV1rcDigestFromDisk({ aggregate: v1rc, dataRoot, updateRoot });
check(currentV1rcDigest === baselineDigest, "The immutable Phase 145–156 candidate digest changed.");
check(p156.local_validation_receipt?.receipt_id === baselineReceiptId && p156.local_validation_receipt?.artifact_digest === baselineDigest, "The immutable Phase 156 receipt identity or digest changed.");
check(isValidV1rcValidationReceipt({ receipt: p156.local_validation_receipt, aggregate: v1rc, candidateDigest: currentV1rcDigest }), "The immutable Phase 156 validation receipt is no longer contract-valid.");
check(v1rc.public_html_routes?.length === 58 && v1rc.public_json_exports?.length === 13 && v1rc.publication_update_files?.length === 12, "The immutable Phase 156 route/export/update snapshot changed.");

const p157 = registries.get(157);
const preservation = p157.preservation_records[0];
check(p157.preservation_records.length === 1 && p157.counts?.preservation_records === 1 && p157.counts?.matching_phase156_digests === 1, "Phase 157 must contain exactly one passing preservation control.");
check(preservation.preservation_id === "157-PRESERVATION-001" && preservation.preservation_state === "Passed — exact receipt and digest bound", "Phase 157 preservation identity or state changed.");
check(preservation.baseline_program_id === v1rc.program_id && preservation.baseline_effective_date === v1rc.effective_date && preservation.baseline_receipt_id === baselineReceiptId && preservation.baseline_artifact_digest === baselineDigest, "Phase 157 does not bind the exact immutable v1-RC candidate and receipt.");
check(preservation.baseline_public_html_routes === 58 && preservation.baseline_public_json_exports === 13 && preservation.baseline_update_records === 12, "Phase 157 baseline inventory is stale.");
check(aggregate.baseline_v1rc?.program_id === v1rc.program_id && aggregate.baseline_v1rc?.receipt_id === baselineReceiptId && aggregate.baseline_v1rc?.artifact_digest === baselineDigest && aggregate.baseline_v1rc?.rewritten === false, "The aggregate does not preserve the exact immutable v1-RC binding.");

const p158 = registries.get(158);
const septemberOperations = p145.gate_operations.filter((operation) => operation.lawful_date >= "2026-09-01" && operation.lawful_date <= "2026-09-30");
const upstreamOperationById = new Map(p145.gate_operations.map((operation) => [operation.operation_id, operation]));
check(septemberOperations.length === 10 && p158.operation_packets.length === 10, "Phase 158 must contain the ten September operations exactly.");
check(sameSet(p158.operation_packets.map((packet) => packet.upstream_operation_id), septemberOperations.map((operation) => operation.operation_id)), "Phase 158 omits or duplicates a September operation identity.");
for (const packet of p158.operation_packets) {
  const upstream = upstreamOperationById.get(packet.upstream_operation_id);
  check(Boolean(upstream), `Phase 158 packet ${packet.operation_packet_id} has an unknown upstream operation.`);
  check(packet.upstream_cycle_item_id === upstream?.cycle_item_id && packet.upstream_phase_61_file_id === (upstream?.phase_61_file_id ?? null) && packet.lawful_date === upstream?.lawful_date && packet.operation_kind === upstream?.operation_kind, `Phase 158 packet ${packet.operation_packet_id} changes upstream identity, type, or lawful date.`);
  check(packet.operation_state === upstream?.decision_status && packet.decision_date === upstream?.decision_date && packet.receipt_id === upstream?.receipt_id && packet.source_checked_date === upstream?.source_checked_date && packet.bounded_result === upstream?.bounded_result, `Phase 158 packet ${packet.operation_packet_id} diverges from the upstream decision fields.`);
  check(sameSet(packet.source_ids, upstream?.source_ids) && sameSet(packet.propagation_targets, upstream?.propagation_targets), `Phase 158 packet ${packet.operation_packet_id} changes source or propagation targets.`);
  check(Array.isArray(packet.alternative_source_ladder) && packet.alternative_source_ladder.length === 5 && hasText(packet.exact_next_artifact), `Phase 158 packet ${packet.operation_packet_id} lacks its alternate-source ladder or exact next artifact.`);
  if (packet.lawful_date > effectiveDate) {
    check(packet.operation_state === "scheduled" && packet.decision_date === null && packet.receipt_id === null && packet.source_checked_date === null && packet.reviewer_role === null && packet.rationale === null && packet.bounded_result === null && packet.preflight_state === "Prepared — operation not yet lawful", `Future Phase 158 packet ${packet.operation_packet_id} is predated, prereceipted, or predecided.`);
  } else if (!packet.receipt_id) {
    check(packet.operation_state === "scheduled" && packet.decision_date === null && packet.source_checked_date === null && packet.bounded_result === null && packet.preflight_state === "Due — upstream receipt required", `Due Phase 158 packet ${packet.operation_packet_id} contains a partial or misleading decision.`);
  } else {
    check(isIsoDate(packet.decision_date) && isIsoDate(packet.source_checked_date) && packet.decision_date >= packet.lawful_date && packet.decision_date <= effectiveDate && packet.source_checked_date >= packet.lawful_date && packet.source_checked_date <= effectiveDate && hasText(packet.reviewer_role) && hasText(packet.rationale) && hasText(packet.bounded_result), `Completed Phase 158 packet ${packet.operation_packet_id} lacks a lawful, bounded receipt.`);
  }
}
const completedOperations = p158.operation_packets.filter((packet) => packet.receipt_id).length;
const duePendingOperations = p158.operation_packets.filter((packet) => packet.lawful_date <= effectiveDate && !packet.receipt_id).length;
const futureOperations = p158.operation_packets.filter((packet) => packet.lawful_date > effectiveDate).length;
const predatedOperations = p158.operation_packets.filter((packet) => packet.decision_date && packet.decision_date < packet.lawful_date).length;
check(p158.counts?.evidence_gates === 8 && p158.counts?.project_file_rechecks === 2 && p158.counts?.completed_operations === completedOperations && p158.counts?.due_operations_pending === duePendingOperations && p158.counts?.future_operations === futureOperations && p158.counts?.predated_decisions === predatedOperations && predatedOperations === 0, "Phase 158 operation-state counts are stale or calendar-invalid.");
const expectedOctoberIds = p145.gate_operations.filter((operation) => operation.lawful_date.startsWith("2026-10")).map((operation) => operation.operation_id);
check(expectedOctoberIds.length === 3 && sameSet(p158.october_deferred_operation_ids, expectedOctoberIds) && p158.counts?.october_operations_deferred === 3, "Phase 158 must defer the three October operations without operating them.");

const p159 = registries.get(159);
const alternatives = p146.alternative_artifact_registry ?? [];
const alternativeIds = new Set(alternatives.map((candidate) => candidate.candidate_id));
const adjudicationById = new Map(p147.adjudication_records.map((record) => [record.adjudication_record_id, record]));
const gapById = new Map(p146.gap_dispositions.map((gap) => [gap.disposition_id, gap]));
const allOwnerActions = p159.authority_mission_boards.flatMap((board) => board.owner_actions);
check(p159.authority_mission_boards.length === 12 && p159.counts?.mission_boards === 12, "Phase 159 must publish twelve mission boards.");
check(allOwnerActions.length === 36 && allUnique(allOwnerActions.map((action) => action.action_id)), "Phase 159 must contain thirty-six unique owner actions.");
for (const board of p159.authority_mission_boards) {
  const gap = gapById.get(board.gap_disposition_id);
  check(Boolean(gap) && board.mission_id === gap?.mission_id && board.topic_id === gap?.topic_id, `Phase 159 board ${board.mission_board_id} has an invalid authority-gap join.`);
  check(board.alternative_candidates_are_evidence === false && sameSet(board.alternative_candidate_ids, gap?.alternative_candidate_ids) && board.alternative_candidate_ids.every((id) => alternativeIds.has(id)), `Phase 159 board ${board.mission_board_id} promotes or loses an alternative candidate.`);
  const missionActions = board.owner_actions.filter((action) => action.action_kind === "mission decision");
  const requirementActions = board.owner_actions.filter((action) => action.action_kind === "requirement decision");
  check(board.owner_actions?.[0]?.action_kind === "authority disposition"
    && board.owner_actions?.[0]?.sequence === 1
    && missionActions.length <= 1
    && (missionActions.length === 0 || board.owner_actions.at(-1) === missionActions[0])
    && board.owner_actions.every((action, index) => action.sequence === index + 1)
    && requirementActions.every((action) => action.sequence > 1 && (!missionActions.length || action.sequence < missionActions[0].sequence)), `Phase 159 board ${board.mission_board_id} violates authority/requirement/mission sequencing.`);
  check(isDigest(board.board_scope_digest) && board.board_scope_digest === digest(board.owner_actions.map((action) => ({ action_id: action.action_id, upstream_record_id: action.upstream_record_id, candidate_set_digest: action.candidate_set_digest }))), `Phase 159 board ${board.mission_board_id} has a stale scope digest.`);
  for (const action of board.owner_actions) {
    const upstream = action.action_kind === "authority disposition" ? gap : adjudicationById.get(action.upstream_record_id);
    const expectedDigest = upstream?.candidate_set_digest;
    const expectedDate = action.action_kind === "authority disposition" ? upstream?.disposition_date : upstream?.decision_date;
    const expectedReceipt = action.action_kind === "authority disposition" ? upstream?.disposition_receipt_id : upstream?.decision_receipt_id;
    check(Boolean(upstream) && action.candidate_set_digest === expectedDigest && action.decision_date === expectedDate && action.receipt_id === expectedReceipt, `Phase 159 action ${action.action_id} breaks its upstream decision/digest binding.`);
    check(isDigest(action.candidate_set_digest), `Phase 159 action ${action.action_id} lacks a candidate-set digest.`);
    if (!action.receipt_id) check(action.decision_date === null && String(action.decision_state).startsWith("Pending"), `Pending Phase 159 action ${action.action_id} carries a date or terminal claim.`);
    else check(isIsoDate(action.decision_date) && action.decision_date <= effectiveDate && action.allowed_terminal_states?.includes(action.decision_state), `Terminal Phase 159 action ${action.action_id} lacks a lawful date or allowed state.`);
  }
}
const ownerKindCounts = Object.fromEntries(["authority disposition", "requirement decision", "mission decision"].map((kind) => [kind, allOwnerActions.filter((action) => action.action_kind === kind).length]));
const terminalOwnerActions = allOwnerActions.filter((action) => action.receipt_id).length;
check(ownerKindCounts["authority disposition"] === 12 && ownerKindCounts["requirement decision"] === 18 && ownerKindCounts["mission decision"] === 6, "Phase 159 owner-action kind counts must remain 12/18/6.");
check(p159.counts?.authority_actions === 12 && p159.counts?.requirement_actions === 18 && p159.counts?.mission_actions === 6 && p159.counts?.total_owner_actions === 36 && p159.counts?.terminal_owner_actions === terminalOwnerActions && p159.counts?.pending_owner_actions === 36 - terminalOwnerActions && p159.counts?.fabricated_owner_actions === 0, "Phase 159 derived owner-action counts are stale.");

const p160 = registries.get(160);
const priorityPilots = p149.longitudinal_reviews.filter((review) => review.pilot_priority);
const pilotByReview = new Map(priorityPilots.map((review) => [review.lab_review_id, review]));
const compatibilityMatrices = p160.pilot_matrices.filter((matrix) => matrix.matrix_kind === "compatibility pilot");
const zeroBoundary = p160.pilot_matrices.find((matrix) => matrix.matrix_kind === "zero-series launch boundary");
check(p160.pilot_matrices.length === 4 && compatibilityMatrices.length === 3 && Boolean(zeroBoundary), "Phase 160 must retain three compatibility pilots and one zero-series boundary.");
for (const matrix of compatibilityMatrices) {
  const upstream = pilotByReview.get(matrix.upstream_lab_review_id);
  check(Boolean(upstream) && matrix.eligibility_id === upstream?.eligibility_id && matrix.series_definition_digest === upstream?.series_definition_digest && sameJson(matrix.compatibility_tests, upstream?.tests), `Phase 160 matrix ${matrix.pilot_matrix_id} breaks its Phase 149 compatibility lineage.`);
  check(isDigest(matrix.series_definition_digest) && matrix.compatibility_tests?.length === 4, `Phase 160 matrix ${matrix.pilot_matrix_id} lacks four tests or a definition digest.`);
  check(matrix.compatibility_decision === "Not admitted" && matrix.admitted_series_id === null && matrix.observations_transferred === 0 && matrix.decision_date === null && matrix.decision_receipt_id === null, `Phase 160 matrix ${matrix.pilot_matrix_id} transfers or admits an unreceipted series.`);
}
check(zeroBoundary?.boundary_scope_digest === p149.no_series_launch_boundary?.boundary_scope_digest && sameSet(zeroBoundary?.reviewed_eligibility_ids, p149.no_series_launch_boundary?.reviewed_eligibility_ids), "The Phase 160 zero-series boundary diverges from Phase 149.");
check(isDigest(zeroBoundary?.boundary_scope_digest) && zeroBoundary?.owner_accepted === false && zeroBoundary?.decision_date === null && zeroBoundary?.decision_receipt_id === null && zeroBoundary?.admitted_series_id === null && zeroBoundary?.observations_transferred === 0, "The Phase 160 zero-series boundary contains an unreceipted owner decision or observation.");
check(p160.counts?.pilot_matrices === 4 && p160.counts?.compatibility_pilots === 3 && p160.counts?.compatibility_tests === 12 && p160.counts?.zero_series_boundary_records === 1 && p160.counts?.admitted_series === 0 && p160.counts?.observations_transferred === 0 && p160.counts?.owner_dispositions_pending === 1, "Phase 160 counts must disclose zero admitted series, zero observations, and one pending owner disposition.");

const p161 = registries.get(161);
const packetIds = p161.stack_watch_packets.map((packet) => packet.stack_watch_packet_id);
const claimBlocks = p161.stack_watch_packets.flatMap((packet) => packet.claim_blocks);
const claimIds = claimBlocks.map((claim) => claim.claim_block_id);
check(p161.stack_watch_packets.length === 24 && allUnique(packetIds), "Phase 161 must publish twenty-four uniquely identified Stack Watch packets.");
check(claimBlocks.length === 72 && allUnique(claimIds), "Phase 161 must publish exactly seventy-two unique claim blocks.");
check(new Set(p161.stack_watch_packets.map((packet) => packet.stack_lane)).size === 8, "Phase 161 must cover exactly eight Stack Watch lanes.");
for (const packet of p161.stack_watch_packets) {
  const sources = packet.source_ids.map((id) => sourceById.get(id));
  const expectedSemanticDigest = semanticDigest(packet.source_ids, sourceById);
  check(packet.packet_state === "Published — bounded official-source synthesis" && isIsoDate(packet.checked_date) && packet.checked_date <= effectiveDate, `Phase 161 packet ${packet.stack_watch_packet_id} lacks a lawful published state or check date.`);
  check(packet.source_ids.length === 1 && sources.every(Boolean) && allUnique(packet.source_ids), `Phase 161 packet ${packet.stack_watch_packet_id} must resolve one canonical source.`);
  check(isDigest(packet.source_semantic_digest) && packet.source_semantic_digest === expectedSemanticDigest, `Phase 161 packet ${packet.stack_watch_packet_id} has a stale source-semantic digest.`);
  check(sources[0]?.url === packet.official_url && /^https:\/\//.test(packet.official_url ?? "") && hasText(packet.publisher) && hasText(packet.artifact_date) && hasText(packet.data_through) && hasText(packet.evidence_type), `Phase 161 packet ${packet.stack_watch_packet_id} lacks exact-artifact source metadata.`);
  check(hasText(packet.reader_brief, 250) && hasText(packet.decisive_next_artifact, 120), `Phase 161 packet ${packet.stack_watch_packet_id} lacks substantive reader or next-artifact content.`);
  check(packet.alternative_candidates_support_claims === false && allUnique(packet.alternative_candidate_ids) && packet.alternative_candidate_ids.every((id) => alternativeIds.has(id)) && packet.source_ids.every((id) => !alternativeIds.has(id)), `Phase 161 packet ${packet.stack_watch_packet_id} uses an alternative candidate as claim support.`);
  check(packet.claim_blocks.length === 3 && sameSet(packet.claim_blocks.map((claim) => claim.claim_type), ["Supported observation", "System implication", "Excluded inference"]), `Phase 161 packet ${packet.stack_watch_packet_id} lacks its three distinct bounded claim types.`);
  for (const claim of packet.claim_blocks) {
    check(claim.claim_block_id.startsWith(`${packet.stack_watch_packet_id}-CLAIM-`) && hasText(claim.text, 100) && sameSet(claim.source_ids, packet.source_ids) && claim.source_semantic_digest === expectedSemanticDigest && hasText(claim.publication_state), `Phase 161 claim ${claim.claim_block_id} lacks text, provenance, semantic binding, or publication boundary.`);
  }
}
check(sameSet(p161.source_profile_ids_added_or_reused, p161.stack_watch_packets.flatMap((packet) => packet.source_ids)) && p161.source_profile_ids_added_or_reused.length === 24, "Phase 161 source-profile inventory must bind the twenty-four packet sources exactly once.");
check(p161.counts?.stack_watch_packets === 24 && p161.counts?.stack_lanes === 8 && p161.counts?.claim_blocks === 72 && p161.counts?.publication_ready_bounded_syntheses === 24 && p161.counts?.alternative_candidates_used_as_claim_support === 0, "Phase 161 content-depth or source-boundary counts are stale.");

const p162 = registries.get(162);
const placeById = new Map(p137.place_ledgers.map((place) => [place.ledger_id, place]));
const chronicleIds = new Set(p136.project_chronicles.map((chronicle) => chronicle.chronicle_id));
const operationPacketIds = new Set(p158.operation_packets.map((packet) => packet.operation_packet_id));
const dependencyMapIds = [];
check(p162.local_system_briefs.length === 4, "Phase 162 must publish four local-system briefs.");
for (const brief of p162.local_system_briefs) {
  const place = placeById.get(brief.upstream_place_ledger_id);
  const expectedSemanticDigest = semanticDigest(brief.source_ids, sourceById);
  dependencyMapIds.push(brief.dependency_map?.dependency_map_id);
  check(Boolean(place) && brief.atlas_place_id === place?.atlas_place_id && brief.geography === place?.geography && brief.inherited_state === place?.inherited_state, `Phase 162 brief ${brief.local_system_brief_id} breaks its place-ledger identity.`);
  check(brief.brief_state === "Published — bounded local-system synthesis" && hasText(brief.conversion_question, 100) && hasText(brief.receiving_system_read, 100) && brief.system_stack?.length === 6 && brief.affected_parties?.length >= 5, `Phase 162 brief ${brief.local_system_brief_id} lacks substantive system content.`);
  check(brief.project_chronicle_ids.every((id) => chronicleIds.has(id)) && brief.operation_packet_ids.every((id) => operationPacketIds.has(id)), `Phase 162 brief ${brief.local_system_brief_id} has an unresolved project or operation join.`);
  check(brief.source_ids.length > 0 && allUnique(brief.source_ids) && brief.source_ids.every((id) => sourceById.has(id)) && brief.source_semantic_digest === expectedSemanticDigest, `Phase 162 brief ${brief.local_system_brief_id} has missing sources or a stale semantic digest.`);
  check(brief.timeline_entries?.length === 3 && brief.timeline_entries[0]?.date === effectiveDate && brief.timeline_entries.slice(1).every((entry) => entry.date === null), `Phase 162 brief ${brief.local_system_brief_id} must retain three bounded, non-predated timeline entries.`);
  const map = brief.dependency_map;
  check(map?.nodes?.length === 6 && map?.edges?.length === 5 && map?.causal_findings_created === 0 && map?.stage_changes_created === 0, `Phase 162 map ${map?.dependency_map_id} has the wrong topology or infers a result.`);
  const nodeIds = new Set(map?.nodes?.map((node) => node.node_id));
  check(nodeIds.size === 6 && allUnique(map?.edges?.map((edge) => edge.edge_id)), `Phase 162 map ${map?.dependency_map_id} has duplicate node or edge identities.`);
  for (const edge of map?.edges ?? []) {
    check(nodeIds.has(edge.from_node_id) && nodeIds.has(edge.to_node_id) && sameSet(edge.evidence_ids, brief.source_ids) && edge.source_semantic_digest === expectedSemanticDigest && hasText(edge.inference_boundary, 80), `Phase 162 edge ${edge.edge_id} has a broken graph, provenance, or inference boundary.`);
  }
}
check(allUnique(dependencyMapIds) && p162.counts?.local_system_briefs === 4 && p162.counts?.system_layers === 24 && p162.counts?.timeline_entries === 12 && p162.counts?.dependency_maps === 4 && p162.counts?.dependency_edges === 20 && p162.counts?.inferred_stage_changes === 0 && p162.counts?.causal_findings_created === 0, "Phase 162 must retain four briefs, twelve timeline entries, four maps, and zero inferred results.");

const p163 = registries.get(163);
const upstreamWindows = p151.desk_review_ledgers.flatMap((desk) => desk.review_windows.map((window) => ({ ...window, desk_review_id: desk.desk_review_id, desk_id: desk.desk_id, topic_id: desk.topic_id })));
const upstreamWindowById = new Map(upstreamWindows.map((window) => [window.window_id, window]));
const upstreamEditionById = new Map(p154.edition_packets.map((packet) => [packet.edition_packet_id, packet]));
const guideById = new Map(p152.field_guides.map((guide) => [guide.field_guide_id, guide]));
const passportById = new Map(p150.comparison_passports.map((passport) => [passport.passport_id, passport]));
const runbookWindows = p163.editorial_runbooks.flatMap((runbook) => runbook.desk_windows);
check(p163.editorial_runbooks.length === 4 && runbookWindows.length === 68 && allUnique(runbookWindows.map((window) => window.window_id)), "Phase 163 must bind four runbooks to all sixty-eight unique desk windows.");
for (const runbook of p163.editorial_runbooks) {
  const edition = upstreamEditionById.get(runbook.upstream_edition_packet_id);
  check(Boolean(edition) && runbook.scheduled_date === edition?.publication_date && runbook.runbook_state === edition?.state && sameSet(runbook.required_sections, edition?.required_sections) && sameSet(runbook.due_operation_ids, edition?.due_operation_ids), `Phase 163 runbook ${runbook.editorial_runbook_id} breaks its edition identity or required inputs.`);
  check(runbook.desk_windows.length === 17 && runbook.desk_windows.every((window) => window.scheduled_date === runbook.scheduled_date), `Phase 163 runbook ${runbook.editorial_runbook_id} must bind seventeen same-date desk windows.`);
  for (const window of runbook.desk_windows) {
    const upstream = upstreamWindowById.get(window.window_id);
    check(Boolean(upstream) && window.scheduled_date === upstream?.scheduled_date && window.state === upstream?.state && window.decision_date === upstream?.decision_date && window.receipt_id === upstream?.receipt_id, `Phase 163 window ${window.window_id} diverges from Phase 151.`);
    if (window.scheduled_date > effectiveDate) check(window.decision_date === null && window.receipt_id === null && window.material_change_ids?.length === 0, `Future Phase 163 window ${window.window_id} is predated or predecided.`);
  }
  check(Array.isArray(runbook.required_sequence) && runbook.required_sequence.length === 5, `Phase 163 runbook ${runbook.editorial_runbook_id} lacks its operating sequence.`);
  if (runbook.scheduled_date > effectiveDate) check(runbook.draft_content === null && runbook.included_source_ids.length === 0 && runbook.material_change_ids.length === 0 && runbook.publication_decision_date === null && runbook.publication_receipt_id === null && runbook.publication_input_digest === null && runbook.publication_scope_digest === null, `Future Phase 163 runbook ${runbook.editorial_runbook_id} is prepublished or precomputed.`);
}
check(p163.guide_currency_passes.length === 17 && allUnique(p163.guide_currency_passes.map((pass) => pass.currency_pass_id)), "Phase 163 must contain seventeen unique guide currency passes.");
for (const pass of p163.guide_currency_passes) {
  const guide = guideById.get(pass.field_guide_id);
  const directSources = guide?.direct_evidence_source_ids ?? [];
  check(Boolean(guide) && pass.topic_id === guide?.topic_id && pass.baseline_date === guide?.publication_date && pass.source_binding_digest === semanticDigest(directSources, sourceById), `Phase 163 guide pass ${pass.currency_pass_id} has a broken guide or source-digest binding.`);
  check(isDigest(pass.source_binding_digest) && pass.material_change_ids?.length === 0 && String(pass.pass_state).startsWith("Baseline bound"), `Phase 163 guide pass ${pass.currency_pass_id} silently asserts a change.`);
}
check(p163.comparison_passport_rechecks.length === 12 && allUnique(p163.comparison_passport_rechecks.map((record) => record.passport_recheck_id)), "Phase 163 must retain twelve comparison-passport rechecks.");
for (const record of p163.comparison_passport_rechecks) {
  const passport = passportById.get(record.passport_id);
  check(Boolean(passport) && record.dossier_id === passport?.dossier_id && record.verdict === passport?.verdict && sameJson(record.compatibility_dimensions, passport?.compatibility_dimensions), `Phase 163 passport recheck ${record.passport_recheck_id} breaks its Phase 150 lineage.`);
  check(record.verdict === "Context only" && record.verdict_changed === false && record.score === null && record.rank === null, `Phase 163 passport recheck ${record.passport_recheck_id} creates an unsupported verdict, score, or rank.`);
}
const monthEndTemplates = p163.editorial_runbooks.map((runbook) => runbook.month_end_report_template).filter(Boolean);
check(monthEndTemplates.length === 1 && monthEndTemplates[0].publication_date === "2026-09-30" && monthEndTemplates[0].authored_content === null && monthEndTemplates[0].claim_blocks.length === 0 && monthEndTemplates[0].publication_decision_date === null && monthEndTemplates[0].publication_receipt_id === null, "Phase 163 must retain one empty, unpredated month-end report template.");
const predatedEditorialDecisions = runbookWindows.filter((window) => window.decision_date && window.decision_date < window.scheduled_date).length;
const futurePublicationsPredated = p163.editorial_runbooks.filter((runbook) => runbook.scheduled_date > effectiveDate && runbook.publication_receipt_id).length;
check(p163.counts?.editorial_runbooks === 4 && p163.counts?.desk_window_bindings === 68 && p163.counts?.unique_desk_windows === 68 && p163.counts?.guide_currency_passes === 17 && p163.counts?.comparison_passport_rechecks === 12 && p163.counts?.edition_packet_bindings === 4 && p163.counts?.month_end_report_templates === 1 && p163.counts?.predated_editorial_decisions === predatedEditorialDecisions && predatedEditorialDecisions === 0 && p163.counts?.future_publications_predated === futurePublicationsPredated && futurePublicationsPredated === 0, "Phase 163 editorial counts or calendar integrity are stale.");

const p164 = registries.get(164);
const gateById = new Map(p164.readiness_gates.map((gate) => [gate.gate_id, gate]));
const expectedGateStates = new Map([
  ["164-GATE-01-BASELINE-PRESERVATION", "Pass"],
  ["164-GATE-02-SEPTEMBER-OPERATIONS-READINESS", "Pass"],
  ["164-GATE-03-EVIDENCE-ADJUDICATION", "Held"],
  ["164-GATE-04-AUTHORITY-COVERAGE", "Held"],
  ["164-GATE-05-LONGITUDINAL-BOUNDARY", "Held"],
  ["164-GATE-06-STACK-WATCH", "Pass"],
  ["164-GATE-07-LOCAL-SYSTEMS", "Pass"],
  ["164-GATE-08-DEPENDENCY-MAPS", "Pass"],
  ["164-GATE-09-GUIDE-CURRENCY", "Pass"],
  ["164-GATE-10-COMPARATIVE-INTEGRITY", "Pass"],
  ["164-GATE-11-EDITORIAL-INTEGRITY", "Pass"],
  ["164-GATE-12-MACHINE-READABLE-CONTRACT", "Pass"],
  ["164-GATE-13-LOCAL-VALIDATION", p164.local_validation_receipt ? "Pass" : "Pending build"],
  ["164-GATE-14-OWNER-ACCEPTANCE", "Held"],
]);
check(p164.readiness_gates.length === 14 && allUnique(p164.readiness_gates.map((gate) => gate.gate_id)), "Phase 164 must derive fourteen unique readiness gates.");
for (const [gateId, state] of expectedGateStates) {
  const gate = gateById.get(gateId);
  check(Boolean(gate) && gate.state === state && hasText(gate.evidence) && hasText(gate.next_action), `Phase 164 gate ${gateId} is missing or has the wrong derived state.`);
}
const phase164States = {
  passed: p164.readiness_gates.filter((gate) => gate.state === "Pass").length,
  held: p164.readiness_gates.filter((gate) => gate.state === "Held").length,
  pending: p164.readiness_gates.filter((gate) => gate.state === "Pending build").length,
};
const expectedPhase164Counts = p164.local_validation_receipt ? { passed: 10, held: 4, pending: 0 } : { passed: 9, held: 4, pending: 1 };
check(phase164States.passed === expectedPhase164Counts.passed && phase164States.held === expectedPhase164Counts.held && phase164States.pending === expectedPhase164Counts.pending, "Phase 164 must derive 9/4/1 before validation or 10/4/0 after validation.");
check(p164.counts?.readiness_gates === 14 && p164.counts?.passed === phase164States.passed && p164.counts?.held === phase164States.held && p164.counts?.pending_build === phase164States.pending && p164.counts?.false_passes === 0, "Phase 164 count fields diverge from its gates.");
check(p164.v1_promotion_state === "Held" && aggregate.v1_promotion_state === "Held" && aggregate.operating_state?.v1_promotion === "Held", "Phase 164 or the aggregate overstates v1 promotion readiness.");
check(p164.owner_authority?.evidence_admission_authorized === false && p164.owner_authority?.owner_acceptance === false && p164.owner_authority?.github_publication_authorized === false && p164.owner_authority?.hosted_deployment_authorized === false && p164.owner_authority?.public_launch_authorized === false, "Phase 164 overstates owner, evidence, repository, hosting, or launch authority.");

const candidateDigest = await computeV1monthDigestFromDisk({ aggregate, dataRoot, updateRoot });
check(isDigest(candidateDigest), "The normalized v1month candidate digest is invalid.");
if (p164.local_validation_receipt) {
  check(isValidV1monthValidationReceipt({ receipt: p164.local_validation_receipt, aggregate, candidateDigest }), "The embedded Phase 164 receipt is malformed, stale, or bound to another candidate.");
  check(p164.local_validation_state === "Passed" && gateById.get("164-GATE-13-LOCAL-VALIDATION")?.receipt_id === p164.local_validation_receipt.receipt_id && aggregate.local_validation_receipt_id === p164.local_validation_receipt.receipt_id && aggregate.local_validation_artifact_digest === candidateDigest, "The valid Phase 164 receipt is not propagated through the gate and aggregate.");
  const receiptFiles = await readdir(receiptRoot, { withFileTypes: true });
  const archives = await Promise.all(receiptFiles.filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => readFile(join(receiptRoot, entry.name), "utf8").then(JSON.parse)));
  check(archives.some((receipt) => sameJson(receipt, p164.local_validation_receipt)), "The embedded Phase 164 receipt has no exact immutable archive copy.");
} else {
  check(p164.local_validation_state === "Pending build" && gateById.get("164-GATE-13-LOCAL-VALIDATION")?.receipt_id === null && aggregate.local_validation_receipt_id === null && aggregate.local_validation_artifact_digest === null, "A receipt-free Phase 164 candidate must remain pending local validation everywhere.");
}

check(aggregate.counts?.stack_watch_packets === 24 && aggregate.counts?.claim_blocks === 72 && aggregate.counts?.local_system_briefs === 4 && aggregate.counts?.dependency_maps === 4, "The aggregate content counts diverge from Phases 161–162.");
check(aggregate.operating_state?.september_operations === 10 && aggregate.operating_state?.future_operations === futureOperations && aggregate.operating_state?.due_operations_pending === duePendingOperations && aggregate.operating_state?.owner_actions_pending === p159.counts.pending_owner_actions && aggregate.operating_state?.admitted_longitudinal_series === 0 && aggregate.operating_state?.desk_window_bindings === 68, "The aggregate operating state diverges from Phases 158–163.");
check(aggregate.local_validation_receipt_id === (p164.local_validation_receipt?.receipt_id ?? null) && aggregate.local_validation_artifact_digest === (p164.local_validation_receipt?.artifact_digest ?? null), "The aggregate local-validation identity diverges from Phase 164.");

const expectedUpdateNames = v1monthPhases.map((phase) => `${v1monthPublicationDate}-phase-${phase}.json`);
check(sameJson(aggregate.publication_update_files, expectedUpdateNames), "The aggregate must inventory exactly the eight Phase 157–164 publication updates.");
for (const phase of v1monthPhases) {
  const name = `${v1monthPublicationDate}-phase-${phase}.json`;
  const updatePath = join(updateRoot, name);
  check(await exists(updatePath), `Missing publication update ${name}.`);
  if (!(await exists(updatePath))) continue;
  const update = JSON.parse(await readFile(updatePath, "utf8"));
  const registry = registries.get(phase);
  const ids = registry[recordKeys.get(phase)].map((record) => record[idKeys.get(phase)]);
  check(update.id === `update-${v1monthPublicationDate}-phase-${phase}` && update.effective_date === v1monthPublicationDate && update.entry_type === "Publication Promotion", `Phase ${phase} publication update has an invalid immutable identity.`);
  check(sameJson(update.affected_record_ids, [`FTFN-PHASE-${phase}`, ...ids]) && sameJson(update.related_paths, [registry.routes.hub, registry.routes.public_export]), `Phase ${phase} publication update has stale affected records or paths.`);
  check(await exists(join(workspaceRoot, update.work_package)), `Phase ${phase} work package is missing.`);
}
check(await exists(join(workspaceRoot, "docs", "roadmap-v1-september-operating-program.md")), "The v1month roadmap is missing.");
check(await exists(join(workspaceRoot, "docs", "session-handoff-v1-september-operating-program.md")), "The v1month handoff is missing.");

if (failures.length) {
  console.error(`Phase 157–164 content assertion failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Phase 157–164 content assertion passed: 67 routes, 9 exports, 10 September operations, 36 owner actions, 0 longitudinal observations, 24 Stack Watch packets, 72 claim blocks, 4 local briefs, 12 timeline entries, 4 runbooks, 68 desk-window bindings, and Phase 164 ${phase164States.passed}/${phase164States.held}/${phase164States.pending}.`);
