import { access, readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1rcDigestFromDisk, isValidV1rcValidationReceipt, v1rcPublicationDate } from "./lib/v1rc-candidate-digest.mjs";
import { isValidV1rcOwnerReceipt, v1rcOwnerReceiptArchiveName, v1rcOwnerReceiptContractVersion } from "./lib/v1rc-owner-receipt.mjs";
import {
  buildPhase151ReviewScope,
  buildPhase154PublicationInputScope,
  buildPhase154PublicationScope,
  materialIdsResolve,
  phase151ReviewScopeVersion,
  phase154PublicationInputVersion,
  phase154PublicationScopeVersion,
} from "./lib/phase151-154-scope-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const updateRoot = join(appRoot, "src", "content", "updates");
const failures = [];

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
const sameSet = (left, right) => Array.isArray(left)
  && Array.isArray(right)
  && left.length === right.length
  && new Set(left).size === left.length
  && new Set(right).size === right.length
  && left.every((item) => new Set(right).has(item));
const allUnique = (items) => new Set(items).size === items.length;
const hasText = (value, minimum = 1) => typeof value === "string" && value.trim().length >= minimum;
const digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const isValidIsoDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
};
const terminalWithReceipt = (record, dateKey, receiptKey, reviewerKey = "reviewer_role") => (
  isValidIsoDate(record?.[dateKey])
  && record[dateKey] <= effectiveDate
  && hasText(record?.[receiptKey])
  && hasText(record?.[reviewerKey])
  && hasText(record?.rationale)
);

const phaseFiles = new Map([
  [145, "phase-145-evidence-gate-operations-journal.json"],
  [146, "phase-146-authority-gap-resolution-program.json"],
  [147, "phase-147-evidence-adjudication-record.json"],
  [148, "phase-148-atlas-changefeed.json"],
  [149, "phase-149-longitudinal-evidence-lab.json"],
  [150, "phase-150-comparison-passports-2-0.json"],
  [151, "phase-151-weekly-desk-review-ledger.json"],
  [152, "phase-152-frontier-topic-field-guides.json"],
  [153, "phase-153-future-state-report-series.json"],
  [154, "phase-154-september-edition-packets.json"],
  [155, "phase-155-public-method-corrections-library.json"],
  [156, "phase-156-v1-launch-decision.json"],
]);
const recordKeys = new Map([
  [145, "gate_operations"], [146, "gap_dispositions"], [147, "adjudication_records"],
  [148, "changefeed_reviews"], [149, "longitudinal_reviews"], [150, "comparison_passports"],
  [151, "desk_review_ledgers"], [152, "field_guides"], [153, "flagship_reports"],
  [154, "edition_packets"], [155, "method_records"], [156, "launch_gates"],
]);

const registries = new Map(await Promise.all([...phaseFiles].map(async ([phase, name]) => [phase, await readJson(name)])));
const aggregate = await readJson("v1-release-candidate.json");
const historicalAudit = await readJson("phase-144-v1-launch-candidate-audit.json");
const historicalReceipt = await readJson("phase-144-local-validation-receipt.json");
const operatingCycle = await readJson("phase-60-operating-cycle.json");
const propagationContract = await readJson("phase-60-propagation-contract.json");
const p125 = await readJson("phase-125-evidence-annotation-ledger.json");
const p135 = await readJson("phase-135-atlas-conversion-readiness-audit.json");
const p136 = await readJson("phase-136-named-project-chronicles.json");
const p137 = await readJson("phase-137-place-delivery-ledgers.json");
const p138 = await readJson("phase-138-longitudinal-evidence-eligibility.json");
const p139 = await readJson("phase-139-comparative-dossier-rereview.json");
const p143 = await readJson("phase-143-editorial-cadence-editions.json");
const canonicalSourceRecords = await Promise.all((await readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map(async (entry) => JSON.parse(await readFile(join(sourceRoot, entry.name), "utf8"))));
const canonicalSourceById = new Map(canonicalSourceRecords.map((source) => [source.id, source]));
const effectiveDate = aggregate.effective_date;

check(/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate ?? ""), "The v1-RC aggregate needs an ISO effective date.");
check(aggregate.schema_version === "1.0", "The v1-RC aggregate must use schema_version 1.0.");
check(aggregate.program_id === "FTFN-V1-RELEASE-CANDIDATE", "The v1-RC aggregate has the wrong program identity.");
check(aggregate.evidence_state?.v1_promotion === registries.get(156)?.v1_promotion_state, "The aggregate promotion state diverges from Phase 156.");
check(aggregate.status === (registries.get(156)?.owner_packet?.owner_acceptance ? "Owner accepted — promotion actions remain separate" : registries.get(156)?.local_validation_receipt ? "Complete locally — v1 promotion held" : "Candidate assembled — validation pending"), "The aggregate status diverges from the Phase 156 receipt/owner state.");
check(Array.isArray(aggregate.phases) && aggregate.phases.length === 12, "The v1-RC aggregate must inventory Phases 145–156.");
check(sameSet(aggregate.phases?.map((item) => item.phase), [...phaseFiles.keys()]), "The v1-RC phase inventory must contain exactly Phases 145–156.");

for (const [phase, registry] of registries) {
  const records = registry[recordKeys.get(phase)];
  check(registry.schema_version === "1.0", `Phase ${phase} must use schema_version 1.0.`);
  check(registry.phase === phase && registry.program_id === `FTFN-PHASE-${phase}`, `Phase ${phase} has an invalid identity.`);
  check(registry.effective_date === effectiveDate, `Phase ${phase} does not share the aggregate effective date.`);
  check(Array.isArray(records) && records.length > 0, `Phase ${phase} has no inspectable records.`);
  check(Array.isArray(registry.publication_boundaries) && registry.publication_boundaries.length >= 4, `Phase ${phase} is missing publication boundaries.`);
  check(registry.routes?.hub === `/review/v1rc/${registry.routes?.hub?.split("/").filter(Boolean).at(-1)}/`, `Phase ${phase} has an invalid v1-RC hub route.`);
  check(registry.routes?.public_export === `/data/${phaseFiles.get(phase)}`, `Phase ${phase} does not bind its canonical public export.`);
  check(registry.public_html_routes?.[0] === registry.routes?.hub, `Phase ${phase} does not lead its route inventory with the hub.`);
  check(sameSet(registry.public_json_exports, [registry.routes?.public_export]), `Phase ${phase} must expose exactly its own JSON export.`);
  if ([148, 150, 151, 152, 153, 155].includes(phase)) {
    check(registry.publication_snapshot_version === "v1rc-initial-publication-2026-08-31-v2" && /^[a-f0-9]{64}$/.test(registry.publication_snapshot_digest ?? ""), `Phase ${phase} lacks its immutable publication-snapshot contract.`);
  }
}

const expectedRoutes = ["/review/v1rc/", ...[...registries.values()].flatMap((registry) => registry.public_html_routes)];
const expectedExports = [...[...registries.values()].map((registry) => registry.routes.public_export), "/data/v1-release-candidate.json"];
check(expectedRoutes.length >= 58 && allUnique(expectedRoutes), "The v1-RC source contract must contain at least the 58 initial unique HTML routes.");
check(expectedExports.length === 13 && allUnique(expectedExports), "The v1-RC source contract must contain 13 unique JSON exports.");
check(sameSet(aggregate.public_html_routes, expectedRoutes), "The aggregate route inventory does not equal the twelve phase inventories plus the release hub.");
check(sameSet(aggregate.public_json_exports, expectedExports), "The aggregate export inventory does not equal the twelve phase exports plus the aggregate.");
check(aggregate.counts?.public_html_routes === expectedRoutes.length && aggregate.counts?.public_json_exports === expectedExports.length, "The aggregate route/export counts are stale.");

const p145 = registries.get(145);
check(p145.gate_operations.length >= 15 && allUnique(p145.gate_operations.map((item) => item.operation_id)), "Phase 145 must retain the fifteen initial operations plus any append-only completed rechecks.");
const operationTerminalStates = new Set(["material_change", "no_material_change", "blocked_with_public_receipt", "rescheduled_with_watch_note"]);
const cycleById = new Map(operatingCycle.records.map((item) => [item.cycle_item_id, item]));
const proofByCycleId = new Map((propagationContract.cycle_decision_proofs ?? []).map((item) => [item.cycle_item_id, item]));
for (const operation of p145.gate_operations) {
  check(hasText(operation.lawful_date) && hasText(operation.exact_next_artifact), `Phase 145 operation ${operation.operation_id} lacks its date or exact artifact.`);
  if (operation.lawful_date > effectiveDate) {
    check(operation.time_gated === true, `Future operation ${operation.operation_id} is not marked time-gated.`);
    check(operation.decision_status === "scheduled" && operation.decision_date === null && operation.receipt_id === null && operation.source_checked_date === null && operation.receipt_type === null && operation.propagation_proof_id === null && operation.signal_decision === null && operation.update_id === null && operation.bounded_result === null, `Future operation ${operation.operation_id} has been predated, prereceipted, or prepropagated.`);
  } else {
    check(operationTerminalStates.has(operation.decision_status), `Due operation ${operation.operation_id} lacks an allowed terminal decision state.`);
    check(operation.decision_date >= operation.lawful_date && operation.decision_date <= effectiveDate && operation.source_checked_date >= operation.lawful_date && operation.source_checked_date <= effectiveDate && hasText(operation.receipt_id) && hasText(operation.receipt_type), `Due operation ${operation.operation_id} lacks a lawful source check and receipt.`);
    check(hasText(operation.propagation_proof_id) && hasText(operation.signal_decision) && hasText(operation.update_id) && hasText(operation.bounded_result) && operation.propagation_targets?.includes(operation.update_id), `Due operation ${operation.operation_id} lacks its complete propagation result.`);
    const expectedTargets = [...new Set([...operation.canonical_dossier_ids, ...operation.reader_pathway_ids, ...operation.dependency_map_ids, ...operation.local_system_ids, ...operation.named_file_ids, operation.update_id])];
    check(sameSet(operation.propagation_targets, expectedTargets), `Due operation ${operation.operation_id} propagation target union is incomplete or overbroad.`);
  }
  if (operation.cycle_item_id) {
    const upstream = cycleById.get(operation.cycle_item_id);
    const proof = proofByCycleId.get(operation.cycle_item_id);
    check(Boolean(upstream), `Phase 145 operation ${operation.operation_id} points to an unknown Phase 60 cycle item.`);
    check(operation.lawful_date === upstream?.scheduled_check_date, `Phase 145 operation ${operation.operation_id} diverges from its stable Phase 60 gate date identity.`);
    const upstreamDecisionWasAvailableAtCutoff = Boolean(upstream?.decision_date && upstream.decision_date <= effectiveDate);
    if (upstreamDecisionWasAvailableAtCutoff) {
      check(operation.exact_next_artifact === upstream?.exact_next_artifact, `Phase 145 operation ${operation.operation_id} diverges from the Phase 60 next-artifact contract available at its publication cutoff.`);
      check(operation.decision_status === upstream?.decision_status && operation.decision_date === upstream?.decision_date && operation.receipt_id === upstream?.receipt_id, `Phase 145 operation ${operation.operation_id} diverges from the Phase 60 decision available at its publication cutoff.`);
      check(Boolean(proof), `Completed Phase 145 operation ${operation.operation_id} lacks its Phase 60 propagation proof.`);
      check(operation.propagation_proof_id === proof?.proof_id && operation.signal_decision === proof?.signal_decision && operation.update_id === proof?.update_id && operation.bounded_result === proof?.bounded_result && operation.next_check_date === proof?.next_check_date, `Completed Phase 145 operation ${operation.operation_id} diverges from the Phase 60 proof payload.`);
      check(sameSet(operation.canonical_dossier_ids, proof?.canonical_dossier_ids) && sameSet(operation.reader_pathway_ids, proof?.reader_pathway_ids) && sameSet(operation.dependency_map_ids, proof?.dependency_map_ids) && sameSet(operation.local_system_ids, proof?.local_system_ids) && sameSet(operation.named_file_ids, proof?.named_file_ids), `Completed Phase 145 operation ${operation.operation_id} has incomplete typed propagation targets.`);
    } else if (operation.lawful_date > effectiveDate) {
      check(operation.decision_status === "scheduled" && operation.decision_date === null && operation.receipt_id === null && operation.propagation_proof_id === null, `Phase 145 operation ${operation.operation_id} must remain an immutable future-safe snapshot even after the live Phase 60 gate advances.`);
    }
  } else {
    check(/^[a-f0-9]{64}$/.test(operation.operation_scope_digest ?? ""), `Phase 61 recheck ${operation.operation_id} lacks its bound operation-scope digest.`);
    if (operation.decision_date) check(hasText(operation.reviewer_role) && hasText(operation.rationale), `Completed Phase 61 recheck ${operation.operation_id} lacks reviewer and rationale fields.`);
  }
}
const derivedPredatedOperations = p145.gate_operations.filter((operation) => (operation.decision_date && operation.decision_date < operation.lawful_date) || (operation.source_checked_date && operation.source_checked_date < operation.lawful_date) || (operation.lawful_date > effectiveDate && operation.decision_date)).length;
check(p145.counts?.predated_operations === derivedPredatedOperations && derivedPredatedOperations === 0 && p145.counts?.due_operations_pending === 0 && p145.counts?.future_operation_integrity_failures === 0, "Phase 145 calendar-integrity counts are stale or nonzero.");

const p146 = registries.get(146);
const alternatives = p146.alternative_artifact_registry;
const alternativeIds = new Set(alternatives.map((item) => item.candidate_id));
check(p146.gap_dispositions.length === 12, "Phase 146 must retain all twelve mission gaps.");
check(alternatives.length === p146.counts?.unique_alternative_artifacts_checked && alternatives.length >= 12, "Phase 146's alternative-artifact count is stale or under-covers the mission set.");
check(allUnique([...alternativeIds]) && alternatives.every((item) => /^https:\/\//.test(item.url) && hasText(item.publisher) && hasText(item.fit) && hasText(item.known_limit) && /^\d{4}-\d{2}-\d{2}$/.test(item.checked_date ?? "") && item.checked_date <= effectiveDate && item.candidate_state === "Candidate — checked, not admitted" && item.access_result === "Official artifact or landing page accessed in the bounded research pass" && item.access_check_reference_id === `146-CANDIDATE-CHECK-${item.checked_date}-${item.candidate_id}` && item.access_check_receipt_id === undefined), "Every Phase 146 artifact must be a unique, dated, self-contained check record for a bounded HTTPS official-source candidate.");
for (const gap of p146.gap_dispositions) {
  check(gap.alternative_candidate_ids.length > 0 && gap.alternative_candidate_ids.every((id) => alternativeIds.has(id)), `Phase 146 gap ${gap.disposition_id} has a missing or unresolved alternative shelf.`);
  check(/^[a-f0-9]{64}$/.test(gap.candidate_set_digest ?? ""), `Phase 146 gap ${gap.disposition_id} lacks its candidate-set digest.`);
  if (gap.owner_disposition === null) {
    check(gap.disposition_date === null && gap.disposition_receipt_id === null, `Pending authority gap ${gap.disposition_id} carries a decision date or receipt.`);
  } else {
    check(terminalWithReceipt(gap, "disposition_date", "disposition_receipt_id"), `Terminal authority gap ${gap.disposition_id} lacks a complete owner receipt.`);
  }
  check(gap.prior_terminal_state_not_preserved === false, `Phase 146 gap ${gap.disposition_id} has a stale terminal decision requiring revalidation.`);
}

const p147 = registries.get(147);
const requirementStates = new Set(["Accepted", "Rejected", "Inadmissible", "Bounded gap"]);
const missionStates = new Set(["Answered", "Bounded conclusion", "No admissible answer", "Carried gap"]);
check(p147.adjudication_records.filter((item) => item.record_kind === "requirement decision").length === 18, "Phase 147 must contain eighteen requirement packets.");
check(p147.adjudication_records.filter((item) => item.record_kind === "mission decision").length === 6, "Phase 147 must contain six mission packets.");
for (const record of p147.adjudication_records) {
  check(/^[a-f0-9]{64}$/.test(record.candidate_set_digest ?? ""), `Phase 147 record ${record.adjudication_record_id} lacks a candidate-set digest.`);
  check(record.alternative_candidate_ids.every((id) => alternativeIds.has(id)), `Phase 147 record ${record.adjudication_record_id} points to an unknown alternative candidate.`);
  const terminal = record.record_kind === "requirement decision" ? requirementStates.has(record.decision_state) : missionStates.has(record.decision_state);
  if (terminal) check(terminalWithReceipt(record, "decision_date", "decision_receipt_id"), `Terminal Phase 147 record ${record.adjudication_record_id} lacks a complete receipt.`);
  else check(record.decision_receipt_id === null && (record.accepted_source_ids?.length ?? 0) === 0, `Pending Phase 147 record ${record.adjudication_record_id} claims a receipt or accepted source.`);
  check(record.prior_terminal_state_not_preserved === false, `Phase 147 record ${record.adjudication_record_id} has a stale terminal decision requiring revalidation.`);
}

const p148 = registries.get(148);
check(p148.changefeed_reviews.length === 39 && p148.changefeed_reviews.every((item) => item.material_change === false && item.stage_change === null), "Phase 148 must publish thirty-nine zero-synthetic-change baseline reviews.");
check(p148.counts?.synthetic_stage_changes === 0 && allUnique(p148.changefeed_reviews.map((item) => item.entity_id)), "Phase 148 contains a duplicate identity or synthetic stage change.");
const readinessById = new Map(p135.readiness_records.map((item) => [item.readiness_id, item]));
for (const record of p148.changefeed_reviews) {
  const upstream = readinessById.get(record.readiness_id);
  check(Boolean(upstream), `Phase 148 review ${record.changefeed_id} has an unknown readiness record.`);
  check(sameSet(record.signal_ids, upstream?.signal_ids) && sameSet(record.source_ids, upstream?.source_ids), `Phase 148 review ${record.changefeed_id} does not preserve its exact signal/source lineage.`);
}

const p149 = registries.get(149);
check(p149.longitudinal_reviews.length === 39 && p149.counts?.pilot_reviews_ready === 3, "Phase 149 must retain thirty-nine reviews and three explicit pilots.");
const eligibilityById = new Map(p138.eligibility_records.map((item) => [item.eligibility_id, item]));
for (const record of p149.longitudinal_reviews) {
  const upstream = eligibilityById.get(record.eligibility_id);
  check(Boolean(upstream), `Phase 149 review ${record.lab_review_id} has an unknown eligibility record.`);
  check(sameSet(record.measurement_specification_ids, upstream?.measurement_specification_ids) && record.series_admission_docket_id === upstream?.series_admission_docket_id, `Phase 149 review ${record.lab_review_id} does not preserve its exact measurement/docket lineage.`);
  check(record.tests?.length === 4 && /^[a-f0-9]{64}$/.test(record.series_definition_digest ?? ""), `Phase 149 review ${record.lab_review_id} lacks four compatibility tests or a definition digest.`);
  if (record.compatibility_decision === "Admitted") {
    check(record.observations_transferred > 0 && hasText(record.admitted_series_id) && terminalWithReceipt(record, "decision_date", "decision_receipt_id"), `Admitted Phase 149 series ${record.lab_review_id} lacks a complete governed receipt.`);
  } else {
    check(record.observations_transferred === 0 && record.admitted_series_id === null, `Unadmitted Phase 149 review ${record.lab_review_id} transfers observations.`);
  }
  check(record.prior_admission_not_preserved === false, `Phase 149 review ${record.lab_review_id} has a stale admission requiring revalidation.`);
}
check(p149.counts?.admitted_series === p149.longitudinal_reviews.filter((item) => item.compatibility_decision === "Admitted").length, "Phase 149 admitted-series count is stale.");
const expectedNoSeriesDigest = digest(p149.longitudinal_reviews.map((record) => ({ eligibility_id: record.eligibility_id, series_definition_digest: record.series_definition_digest, compatibility_decision: record.compatibility_decision, admitted_series_id: record.admitted_series_id, observations_transferred: record.observations_transferred })));
check(p149.no_series_launch_boundary?.boundary_scope_digest === expectedNoSeriesDigest && sameSet(p149.no_series_launch_boundary?.reviewed_eligibility_ids, p149.longitudinal_reviews.map((record) => record.eligibility_id)), "The Phase 149 no-series boundary is not bound to the full reviewed series state.");
if (p149.no_series_launch_boundary?.owner_accepted) check(terminalWithReceipt(p149.no_series_launch_boundary, "decision_date", "decision_receipt_id") && p149.no_series_launch_boundary.decision_date >= v1rcPublicationDate && p149.longitudinal_reviews.every((record) => record.compatibility_decision !== "Admitted"), "The accepted Phase 149 no-series boundary lacks a complete receipt or conflicts with an admitted series.");

const p150 = registries.get(150);
check(p150.comparison_passports.length === 12 && p150.comparison_passports.every((item) => item.verdict === "Context only" && item.score === null && item.rank === null), "Phase 150 must retain twelve Context-only, unscored, unranked passports.");
check(p150.comparison_passports.every((item) => Object.keys(item.compatibility_dimensions ?? {}).length === 5 && hasText(item.prohibited_comparison)), "Every Phase 150 passport needs five compatibility dimensions and a prohibited comparison.");
const rereviewById = new Map(p139.comparison_reviews.map((item) => [item.rereview_id, item]));
for (const passport of p150.comparison_passports) {
  const upstream = rereviewById.get(passport.upstream_rereview_id);
  check(Boolean(upstream), `Phase 150 passport ${passport.passport_id} has an unknown rereview.`);
  check(passport.upstream_route === upstream?.route && sameSet(passport.project_chronicle_ids, upstream?.project_chronicle_ids) && sameSet(passport.place_ledger_ids, upstream?.place_ledger_ids) && sameSet(passport.longitudinal_eligibility_ids, upstream?.longitudinal_eligibility_ids), `Phase 150 passport ${passport.passport_id} does not preserve exact comparison lineage.`);
}

const passportIds = new Set(p150.comparison_passports.map((item) => item.passport_id));
const p151 = registries.get(151);
const deskWindowTerminalStates = new Set(["Material change", "No material change", "Bounded blocker", "Rescheduled"]);
const deskWindows = p151.desk_review_ledgers.flatMap((item) => item.review_windows);
check(p151.desk_review_ledgers.length === 17 && deskWindows.length === 68, "Phase 151 must contain seventeen desks and sixty-eight windows.");
const annotationsById = new Map(p125.evidence_annotations.map((item) => [item.note_id, item]));
const chroniclesById = new Map(p136.project_chronicles.map((item) => [item.chronicle_id, item]));
const ledgersById = new Map(p137.place_ledgers.map((item) => [item.ledger_id, item]));
for (const desk of p151.desk_review_ledgers) {
  const expectedAnnotations = p125.evidence_annotations.filter((annotation) => annotation.mission_ids.some((missionId) => desk.mission_ids.includes(missionId)));
  const expectedDirectSources = [...new Set(expectedAnnotations.flatMap((annotation) => annotation.source_ids))];
  const expectedContextSources = [...new Set([
    ...desk.project_chronicle_ids.flatMap((id) => chroniclesById.get(id)?.source_ids ?? []),
    ...desk.place_ledger_ids.flatMap((id) => ledgersById.get(id)?.source_ids ?? []),
  ])];
  check(sameSet(desk.evidence_annotation_ids, expectedAnnotations.map((item) => item.note_id)) && desk.evidence_annotation_ids.every((id) => annotationsById.has(id)), `Phase 151 desk ${desk.desk_review_id} has incomplete annotation lineage.`);
  check(sameSet(desk.direct_evidence_source_ids, expectedDirectSources) && sameSet(desk.context_source_ids, expectedContextSources) && sameSet(desk.source_ids, [...new Set([...expectedDirectSources, ...expectedContextSources])]), `Phase 151 desk ${desk.desk_review_id} has incomplete source lineage.`);
  check(desk.comparison_passport_ids.every((id) => passportIds.has(id)), `Phase 151 desk ${desk.desk_review_id} has an unresolved comparison passport.`);
  check(hasText(desk.current_read, 800) && hasText(desk.contested_reading, 700) && !desk.current_read.trim().endsWith("…") && !desk.contested_reading.trim().endsWith("…"), `Phase 151 desk ${desk.desk_review_id} contains a truncated or undersized baseline narrative.`);
}
for (const desk of p151.desk_review_ledgers) {
  for (const window of desk.review_windows) {
    const expectedScope = window.scheduled_date <= effectiveDate ? buildPhase151ReviewScope({
      windowId: window.window_id,
      scheduledDate: window.scheduled_date,
      desk,
      phase145Operations: p145.gate_operations,
      phase146Dispositions: p146.gap_dispositions,
      phase147Records: p147.adjudication_records,
      phase149Reviews: p149.longitudinal_reviews,
      priorWindows: desk.review_windows,
      canonicalSources: canonicalSourceById,
    }) : null;
    if (window.decision === null) {
      check(window.decision_date === null && window.receipt_id === null && window.reviewer_role === null && window.rationale === null && window.material_change_ids.length === 0, `Pending Phase 151 window ${window.window_id} claims a decision field or material change.`);
      check(window.state === (window.scheduled_date <= effectiveDate ? "Due — receipt pending" : "Scheduled — no future editorial decision"), `Pending Phase 151 window ${window.window_id} has a misleading calendar state.`);
    } else {
      check(deskWindowTerminalStates.has(window.state) && window.decision_date >= window.scheduled_date && terminalWithReceipt(window, "decision_date", "receipt_id"), `Completed Phase 151 window ${window.window_id} is predated, has an invalid state, or lacks a receipt.`);
      check(allUnique(window.material_change_ids) && materialIdsResolve(window.material_change_ids, expectedScope?.material_ids ?? []), `Completed Phase 151 window ${window.window_id} cites a duplicate or out-of-scope material ID.`);
      check(window.state !== "Material change" || window.material_change_ids.length > 0, `Material-change Phase 151 window ${window.window_id} cites no affected input.`);
      check(window.state !== "No material change" || window.material_change_ids.length === 0, `No-material-change Phase 151 window ${window.window_id} cites an affected input.`);
    }
    if (window.scheduled_date > effectiveDate) {
      check(window.review_scope_contract_version === null && window.review_scope_cutoff_date === null && window.review_scope_digest === null, `Future Phase 151 window ${window.window_id} has a precomputed decision-scope digest.`);
    } else {
      check(expectedScope.missing_source_ids.length === 0 && window.review_scope_contract_version === phase151ReviewScopeVersion && window.review_scope_cutoff_date === window.scheduled_date && window.review_scope_digest === expectedScope.digest, `Due Phase 151 window ${window.window_id} has a missing source binding or stale cutoff-specific review-scope digest.`);
    }
    check(window.prior_terminal_state_not_preserved === false, `Phase 151 window ${window.window_id} has a stale decision requiring revalidation.`);
  }
}
const dueDeskWindowsPending = deskWindows.filter((window) => window.scheduled_date <= effectiveDate && !deskWindowTerminalStates.has(window.state));
const staleDeskWindowDecisions = deskWindows.filter((window) => window.prior_terminal_state_not_preserved).length;
check(p151.counts?.predated_editorial_decisions === 0 && p151.counts?.due_review_windows_pending === dueDeskWindowsPending.length && p151.counts?.stale_window_decisions_requiring_revalidation === staleDeskWindowDecisions && staleDeskWindowDecisions === 0, "Phase 151 editorial-calendar or stale-scope counts are incorrect.");

const p152 = registries.get(152);
check(p152.field_guides.length === 17 && p152.counts?.horizon_questions === 68, "Phase 152 must publish seventeen guides and sixty-eight horizon questions.");
check(p152.field_guides.every((item) => hasText(item.orientation, 600) && hasText(item.strongest_current_evidence, 600) && hasText(item.contested_reading, 500) && item.horizon_questions?.length === 4 && item.beneficiaries?.length >= 3 && item.cost_bearers?.length >= 3), "A Phase 152 field guide is not substantively complete.");
for (const guide of p152.field_guides) {
  const annotations = guide.evidence_annotation_ids.map((id) => annotationsById.get(id)).filter(Boolean);
  const directSources = [...new Set(annotations.flatMap((annotation) => annotation.source_ids))];
  check(annotations.length === guide.evidence_annotation_ids.length && annotations.length > 0, `Phase 152 guide ${guide.field_guide_id} has unresolved annotation lineage.`);
  check(sameSet(guide.direct_evidence_source_ids, directSources) && sameSet(guide.source_ids, [...new Set([...directSources, ...guide.context_source_ids])]), `Phase 152 guide ${guide.field_guide_id} has an incomplete source union.`);
}

const p153 = registries.get(153);
const guideIds = new Set(p152.field_guides.map((item) => item.field_guide_id));
check(p153.flagship_reports.length === 4 && p153.counts?.scores_created === 0 && p153.counts?.recommendations_created === 0, "Phase 153 must publish four bounded reports without scores or recommendations.");
check(p153.flagship_reports.every((item) => hasText(item.thesis, 180) && hasText(item.current_read, 250) && item.evidence_chain?.length >= 5 && item.field_guide_ids.every((id) => guideIds.has(id)) && item.comparison_passport_ids.every((id) => passportIds.has(id))), "A Phase 153 report lacks depth or a valid field-guide/passport join.");
check(p153.counts?.claim_blocks === 16 && p153.counts?.authored_words >= 3000 && p153.counts?.minimum_report_words >= 700, "Phase 153 content-depth totals are below contract.");
for (const report of p153.flagship_reports) {
  const claimSources = [...new Set(report.claim_blocks.flatMap((claim) => claim.source_ids))];
  check(report.claim_blocks.length >= 4 && report.authored_word_count >= 700 && report.claim_blocks.every((claim) => hasText(claim.heading) && hasText(claim.narrative, 500) && claim.source_ids.length > 0 && claim.source_ids.length <= 6), `Phase 153 report ${report.report_id} lacks four substantive claim blocks with bounded source provenance.`);
  check(sameSet(report.source_ids, claimSources), `Phase 153 report ${report.report_id} source shelf exceeds or omits its claim-level provenance.`);
}

const p154 = registries.get(154);
const operationIds = new Set(p145.gate_operations.map((item) => item.operation_id));
const eligibleEditionDeskIds = new Set(p151.desk_review_ledgers.map((item) => item.desk_id));
const eligibleEditionSourceIds = new Set([...p151.desk_review_ledgers.flatMap((item) => item.source_ids), ...p145.gate_operations.flatMap((item) => item.source_ids)]);
const upstreamEditionById = new Map(p143.editions.map((edition) => [edition.edition_id, edition]));
const editionRequiredSections = ["Material changes", "Bounded no-change decisions", "Blocked or rescheduled checks", "Affected projects, places, pathways, and desks", "Decisive next evidence", "Methods and publication boundaries"];
check(p154.edition_packets.length === 4, "Phase 154 must retain four edition packets.");
for (const packet of p154.edition_packets) {
  const upstreamEdition = upstreamEditionById.get(packet.upstream_edition_id);
  check(Boolean(upstreamEdition) && packet.publication_date === upstreamEdition?.publication_date && packet.focus === upstreamEdition?.focus && packet.boundary === upstreamEdition?.boundary && sameSet(packet.required_sections, editionRequiredSections), `Phase 154 packet ${packet.edition_packet_id} diverges from its governed edition identity or required sections.`);
  check(packet.due_operation_ids.every((id) => operationIds.has(id)), `Phase 154 packet ${packet.edition_packet_id} points to an unknown operation.`);
  const expectedDueOperationIds = p145.gate_operations.filter((operation) => operation.lawful_date <= packet.publication_date).map((operation) => operation.operation_id);
  const expectedDueWindowIds = p151.desk_review_ledgers.flatMap((desk) => desk.review_windows).filter((window) => window.scheduled_date <= packet.publication_date).map((window) => window.window_id);
  check(sameSet(packet.due_operation_ids, expectedDueOperationIds) && sameSet(packet.due_review_window_ids, expectedDueWindowIds), `Phase 154 packet ${packet.edition_packet_id} has a stale due-operation or desk-window inventory.`);
  const expectedInput = packet.publication_date <= effectiveDate ? buildPhase154PublicationInputScope({
    editionPacketId: packet.edition_packet_id,
    upstreamEditionId: packet.upstream_edition_id,
    publicationDate: packet.publication_date,
    focus: upstreamEdition.focus,
    boundary: upstreamEdition.boundary,
    requiredSections: editionRequiredSections,
    phase145Operations: p145.gate_operations,
    phase146Dispositions: p146.gap_dispositions,
    phase147Records: p147.adjudication_records,
    phase149Reviews: p149.longitudinal_reviews,
    phase151Desks: p151.desk_review_ledgers,
    canonicalSources: canonicalSourceById,
  }) : null;
  if (packet.publication_date > effectiveDate) {
    check(packet.draft_content === null && packet.included_desk_ids.length === 0 && packet.included_source_ids.length === 0 && packet.material_change_ids.length === 0 && packet.publication_decision_date === null && packet.publication_receipt_id === null, `Future Phase 154 packet ${packet.edition_packet_id} is prepublished.`);
    check(packet.publication_input_contract_version === null && packet.publication_input_digest === null && packet.due_inputs_terminal === null && packet.unresolved_due_input_ids.length === 0 && packet.publication_scope_contract_version === null && packet.publication_scope_digest === null, `Future Phase 154 packet ${packet.edition_packet_id} has a precomputed publication decision or input digest.`);
  } else {
    check(expectedInput.missing_source_ids.length === 0 && packet.publication_input_contract_version === phase154PublicationInputVersion && packet.publication_input_digest === expectedInput.digest && packet.due_inputs_terminal === expectedInput.due_inputs_terminal && sameSet(packet.unresolved_due_input_ids, expectedInput.unresolved_due_input_ids), `Due Phase 154 packet ${packet.edition_packet_id} has a missing source binding or stale transitive publication-input digest.`);
  }
  if (String(packet.state).startsWith("Published")) {
    const publicationScope = buildPhase154PublicationScope({ publicationInputDigest: expectedInput.digest, packet, canonicalSources: canonicalSourceById });
    check(packet.publication_date <= effectiveDate && packet.publication_decision_date >= packet.publication_date && hasText(packet.draft_content) && terminalWithReceipt(packet, "publication_decision_date", "publication_receipt_id") && expectedInput.due_inputs_terminal && packet.included_desk_ids.length > 0 && packet.included_source_ids.length > 0 && allUnique(packet.included_desk_ids) && allUnique(packet.included_source_ids) && allUnique(packet.material_change_ids) && packet.included_desk_ids.every((id) => eligibleEditionDeskIds.has(id)) && packet.included_source_ids.every((id) => eligibleEditionSourceIds.has(id) && canonicalSourceById.has(id)) && publicationScope.missing_source_ids.length === 0 && materialIdsResolve(packet.material_change_ids, expectedInput.material_ids) && packet.publication_scope_contract_version === phase154PublicationScopeVersion && packet.publication_scope_digest === publicationScope.digest, `Published Phase 154 packet ${packet.edition_packet_id} lacks a lawful, transitive, source-semantic-bound receipt.`);
  }
  if (packet.publication_date <= effectiveDate && !String(packet.state).startsWith("Published")) check(packet.state === "Due — publication receipt pending" && packet.draft_content === null && packet.included_desk_ids.length === 0 && packet.included_source_ids.length === 0 && packet.material_change_ids.length === 0 && packet.publication_decision_date === null && packet.publication_receipt_id === null && packet.reviewer_role === null && packet.rationale === null && packet.publication_scope_contract_version === null && packet.publication_scope_digest === null, `Due Phase 154 packet ${packet.edition_packet_id} has a misleading or partial state.`);
  check(packet.prior_publication_not_preserved === false, `Phase 154 packet ${packet.edition_packet_id} has a stale publication requiring revalidation.`);
}
const dueEditionsPending = p154.edition_packets.filter((packet) => packet.publication_date <= effectiveDate && !String(packet.state).startsWith("Published"));
const staleEditionPublications = p154.edition_packets.filter((packet) => packet.prior_publication_not_preserved).length;
check(p154.counts?.future_content_prepublished === 0 && p154.counts?.due_editions_pending === dueEditionsPending.length && p154.counts?.stale_publications_requiring_revalidation === staleEditionPublications && staleEditionPublications === 0, "Phase 154 editorial-calendar or stale-publication counts are incorrect.");

const p155 = registries.get(155);
check(p155.method_records.length === 8 && p155.counts?.silent_revision_paths === 0 && p155.counts?.owner_only_authorizations_automated === 0, "Phase 155 must publish eight methods with no silent revisions or automated owner authority.");
check(p155.method_records.every((item) => item.rules?.length >= 5 && item.minimum_receipt_fields?.length >= 8 && hasText(item.correction_trigger)), "A Phase 155 method lacks its operating or correction contract.");

const p156 = registries.get(156);
const gateStates = {
  passed: p156.launch_gates.filter((item) => item.state === "Pass").length,
  held: p156.launch_gates.filter((item) => item.state === "Held").length,
  pending: p156.launch_gates.filter((item) => item.state === "Pending build").length,
};
check(p156.launch_gates.length === 14 && allUnique(p156.launch_gates.map((item) => item.gate_id)), "Phase 156 must contain fourteen unique derived gates.");
check(p156.counts?.passed === gateStates.passed && p156.counts?.held === gateStates.held && p156.counts?.pending_build === gateStates.pending && p156.counts?.false_passes === 0, "Phase 156 count fields do not match its gate states.");
const everyGatePasses = p156.launch_gates.every((gate) => gate.state === "Pass");
check(p156.v1_promotion_state === (everyGatePasses ? "Ready for promotion" : "Held"), "Phase 156 promotion state does not equal its fourteen derived gates.");
check(p156.owner_packet?.public_launch_authorized === (p156.owner_packet?.owner_acceptance && p156.owner_acceptance_receipt?.public_launch_authorized === true), "Phase 156 public-launch authority is not bound to a valid owner receipt.");
check(!p156.owner_packet?.hosted_deployment_authorized || p156.owner_packet?.owner_acceptance, "Phase 156 overstates hosted-deployment authority.");
check(p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-08-CONTENT-DEPTH")?.state === "Pass", "Phase 156 content-depth gate does not reflect the substantive guide/report contract.");
check(p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-09-EDITORIAL-CADENCE")?.state === (dueDeskWindowsPending.length === 0 && dueEditionsPending.length === 0 ? "Pass" : "Held"), "Phase 156 editorial-cadence gate does not reflect due work.");
check(p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-10-FUTURE-GATE-INTEGRITY")?.state === (p145.counts.due_operations_pending === 0 && p145.counts.future_operation_integrity_failures === 0 ? "Pass" : "Held"), "Phase 156 calendar gate does not reflect the Phase 145 journal.");
const currentDigest = await computeV1rcDigestFromDisk({ aggregate, dataRoot, updateRoot });
if (p156.local_validation_receipt) {
  const receipt = p156.local_validation_receipt;
  check(isValidV1rcValidationReceipt({ receipt, aggregate, candidateDigest: currentDigest }), "The embedded Phase 156 validation receipt is stale, malformed, future-dated, or bound to a different candidate.");
  check(p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-12-ACCESSIBLE-STRUCTURE")?.state === "Pass" && p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-13-RELEASE-VALIDATION")?.state === "Pass", "A valid embedded receipt must pass both local-validation gates.");
} else {
  check(p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-12-ACCESSIBLE-STRUCTURE")?.state === "Pending build" && p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-13-RELEASE-VALIDATION")?.state === "Pending build", "Missing local receipt must leave both validation gates pending.");
}

const ownerReceipt = p156.owner_acceptance_receipt;
const expectedOwnerGateSnapshot = p156.launch_gates.map((gate) => ({
  gate_id: gate.gate_id,
  state: gate.gate_id === "156-GATE-14-OWNER-ACCEPTANCE" ? "Held" : gate.state,
}));
const ownerReceiptValid = Boolean(ownerReceipt) && isValidV1rcOwnerReceipt({
  receipt: ownerReceipt,
  aggregate,
  candidateDigest: currentDigest,
  verifiedGitCommit: process.env.FTFN_VERIFIED_GIT_COMMIT,
  expectedGateSnapshot: expectedOwnerGateSnapshot,
  requiredLimitations: p156.owner_packet?.boundaries_requiring_acceptance ?? [],
  effectiveDate,
});
check(p156.owner_packet?.owner_receipt_contract_version === v1rcOwnerReceiptContractVersion, "Phase 156 does not advertise the current owner-receipt contract.");
check(p156.owner_packet?.owner_acceptance === ownerReceiptValid, "Phase 156 owner acceptance is not backed by a shared-contract-valid receipt and exact verified candidate commit.");
if (ownerReceipt) {
  check(ownerReceiptValid && p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-14-OWNER-ACCEPTANCE")?.state === "Pass", "The Phase 156 owner gate passes without a valid shared-contract receipt.");
  const archiveName = v1rcOwnerReceiptArchiveName(ownerReceipt);
  const archivePath = join(dataRoot, "phase-156-owner-receipts", archiveName);
  check(p156.owner_packet.owner_receipt_archive === `phase-156-owner-receipts/${archiveName}` && await exists(archivePath), "The Phase 156 owner receipt is not bound to an immutable content-addressed archive.");
  if (await exists(archivePath)) check(JSON.stringify(ownerReceipt) === JSON.stringify(JSON.parse(await readFile(archivePath, "utf8"))), "The embedded Phase 156 owner receipt differs from its immutable archive.");
  check(p156.owner_packet.github_publication_authorized === ownerReceipt.github_publication_authorized && p156.owner_packet.hosted_deployment_authorized === ownerReceipt.hosted_deployment_authorized && p156.owner_packet.public_launch_authorized === ownerReceipt.public_launch_authorized, "Phase 156 owner-authorized actions differ from the valid receipt.");
} else {
  check(p156.launch_gates.find((gate) => gate.gate_id === "156-GATE-14-OWNER-ACCEPTANCE")?.state === "Held" && p156.owner_packet?.owner_receipt_archive === null && p156.owner_packet?.owner_acceptance === false && p156.owner_packet?.github_publication_authorized === false && p156.owner_packet?.hosted_deployment_authorized === false && p156.owner_packet?.public_launch_authorized === false, "A receipt-free Phase 156 candidate must remain Held with every owner-authorized action false.");
}

check(historicalAudit.counts?.passed === 10 && historicalAudit.counts?.held === 4 && historicalAudit.counts?.pending_build === 0 && historicalAudit.v1_promotion_state === "Held", "The immutable Phase 144 audit changed.");
check(historicalReceipt.receipt_id === "144-LOCAL-VALIDATION-2026-08-30" && historicalReceipt.metrics?.html_pages_excluding_downloads === 6504 && historicalReceipt.metrics?.top_level_data_json_exports === 86 && historicalReceipt.metrics?.update_entries_rendered === 169, "The immutable Phase 144 receipt or historical inventory changed.");

const initialUpdateNames = [];
for (const phase of phaseFiles.keys()) {
  initialUpdateNames.push(`${v1rcPublicationDate}-phase-${phase}.json`);
  const update = JSON.parse(await readFile(join(updateRoot, `${v1rcPublicationDate}-phase-${phase}.json`), "utf8"));
  check(update.id === `update-${v1rcPublicationDate}-phase-${phase}` && update.effective_date === v1rcPublicationDate && update.affected_record_ids?.includes(`FTFN-PHASE-${phase}`), `Phase ${phase} update record is missing, mutable, or malformed.`);
  check(await exists(join(workspaceRoot, update.work_package)), `Phase ${phase} work package does not exist.`);
}
check(Array.isArray(aggregate.publication_update_files) && allUnique(aggregate.publication_update_files) && initialUpdateNames.every((name) => aggregate.publication_update_files.includes(name)) && aggregate.counts?.v1rc_update_records === aggregate.publication_update_files.length, "The aggregate v1-RC update inventory is incomplete, duplicated, or stale.");
for (const name of aggregate.publication_update_files ?? []) {
  check(await exists(join(updateRoot, name)), `Inventoried v1-RC update ${name} is missing.`);
  if (name.includes("-lifecycle-")) {
    const update = JSON.parse(await readFile(join(updateRoot, name), "utf8"));
    check(name.startsWith(`${update.effective_date}-`) && update.id.includes(`update-${update.effective_date}-phase-`) && update.entry_type === "Evidence Decision", `Lifecycle update ${name} does not bind its actual date and transition identity.`);
  }
}
check(await exists(join(workspaceRoot, "docs", "roadmap-v1-release-candidate.md")), "The v1-RC roadmap is missing.");
check(await exists(join(workspaceRoot, "docs", "session-handoff-v1-release-candidate.md")), "The v1-RC session handoff is missing.");

if (failures.length) {
  console.error(`Phase 145–156 content assertion failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Phase 145–156 content assertion passed: ${expectedRoutes.length} routes, ${expectedExports.length} exports, ${alternatives.length} alternative official artifacts, ${p152.field_guides.length} field guides, ${p153.flagship_reports.length} reports, and v1 Held.`);
