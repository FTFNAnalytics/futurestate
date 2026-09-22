import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1octDigestFromDisk, isValidV1octValidationReceipt, v1octPhases, v1octSourceNames } from "./lib/v1oct-candidate-digest.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const sourcesRoot = join(appRoot, "src", "content", "sources");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items) => [...new Set(items)];
const names = {
  173: "phase-173-september-closeout-october-opening-ledger.json", 174: "phase-174-evidence-cycle-closure-intake.json",
  175: "phase-175-owner-disposition-sprint-ii.json", 176: "phase-176-longitudinal-admission-and-zero-series-decision.json",
  177: "phase-177-october-stack-watch-and-source-currency-sweep.json", 178: "phase-178-systems-atlas-and-compendium-depth-expansion.json",
  179: "phase-179-october-weekly-editions-and-month-end-synthesis.json", 180: "phase-180-october-state-report-and-v1-promotion-gate.json"
};
const phases = await Promise.all(v1octPhases.map((phase) => readJson(join(dataRoot, names[phase]))));
const byPhase = new Map(phases.map((phase) => [phase.phase, phase]));
const [p173,p174,p175,p176,p177,p178,p179,p180] = v1octPhases.map((phase) => byPhase.get(phase));
const aggregate = await readJson(join(dataRoot, "v1-october-operating-program.json"));
const sources = new Map(await Promise.all(v1octSourceNames.map(async (name) => { const source = await readJson(join(sourcesRoot, name)); return [source.id, source]; })));

check(phases.every((phase, index) => phase.phase === v1octPhases[index] && phase.program_id === `FTFN-PHASE-${phase.phase}` && phase.schema_version === "1.0"), "Phase 173–180 identity or order is invalid.");
check(p173.counts.carryover_records === 129 && p173.counts.calendar_records === 84 && p173.counts.owner_held_records === 40 && p173.counts.publication_held_records === 5 && p173.public_html_routes.length === 130 && p173.live_projection_at_effective_date.silent_overdue_count === 0, "Phase 173 must expose the exact 84 calendar + 40 owner + 5 publication carryover split, 130 routes, and zero silent overdue items at cutoff.");
check(p173.darpa_september_23_reconciliation.cycle_001_identity_delta === 0 && p173.darpa_september_23_reconciliation.future_outcome === null, "The September 23 DARPA companion identity or future boundary is invalid.");
check(p174.counts.cycle_001_audit_items === 13 && p174.counts.cycle_001_terminal_at_effective_date === 3 && p174.counts.cycle_001_scheduled_at_effective_date === 10 && p174.counts.cycle_002_candidates === 10, "Phase 174 cycle counts are invalid.");
check(p174.cycle_002_intake.candidates.every((record) => record.source_checked_date === null && record.decision === null && record.receipt_id === null && record.git_backed_release_state === "Held"), "Phase 174 predated a Cycle 002 outcome or publication state.");
check(p175.owner_disposition_packets.length === 36 && p175.owner_disposition_packets.every((record) => record.owner_outcome === null && record.decision_date === null && record.decision_receipt_id === null), "Phase 175 requires thirty-six null owner outcomes.");
check(p175.counts.authority_docket_actions === 12 && p175.counts.requirement_docket_actions === 18 && p175.counts.mission_docket_actions === 6 && p175.counts.combined_owner_controlled_backlog === 37, "Phase 175 12+18+6 and 36+1 count semantics are invalid.");
check(p176.pilot_admission_packets.length === 3 && p176.pilot_admission_packets.flatMap((record) => record.compatibility_decisions).length === 18, "Phase 176 requires three pilots and eighteen compatibility cells.");
check(p176.pilot_admission_packets.every((record) => record.admission_outcome === null && record.observations_transferred === 0 && record.compatibility_decisions.every((cell) => cell.compatibility_outcome === null)), "Phase 176 admitted a future decision or observation.");
check(p176.zero_series_owner_disposition.owner_outcome === null && p176.zero_series_owner_disposition.owner_accepted_zero_series === null, "Phase 176 predated the zero-series owner disposition.");

const laneCounts = Object.groupBy(p177.packets, (record) => record.stack_lane);
check(p177.packets.length === 32 && Object.keys(laneCounts).length === 8 && Object.values(laneCounts).every((records) => records.length === 4), "Phase 177 requires four packets in each of eight lanes.");
const referencedClaims = p177.packets.flatMap((record) => record.referenced_claim_block_ids ?? record.claim_blocks?.map((claim) => claim.claim_block_id) ?? []);
check(referencedClaims.length === 96 && unique(referencedClaims).length === 96 && p177.counts.total_claim_block_references === 96, "Phase 177 requires ninety-six unique bounded claim references.");
const newPackets = p177.packets.filter((record) => record.packet_kind === "New prepared official-source packet");
check(newPackets.length === 8 && newPackets.every((record) => record.checked_date === "2026-09-01" && /^2026-10-\d{2}$/.test(record.scheduled_october_recheck_date) && record.october_recheck_date === null && record.october_finding === null), "Phase 177 source checks, scheduled October reviews, or actual-result null boundaries are invalid.");
check(newPackets.every((record) => { const source = sources.get(record.source_ids[0]); return source?.factual_nucleus && record.claim_blocks?.[0]?.text === source.factual_nucleus; }), "Every new Phase 177 observation must equal its source-bound factual nucleus.");

check(p178.place_system_dossiers.length === 10 && p178.comparison_overlays.length === 8 && p178.interpretive_essays.length === 4, "Phase 178 content inventory is invalid.");
check(!Object.hasOwn(p178, "depth_records") && p178.coverage_matrix?.length === 10 && p178.coverage_matrix.every((record) => record.selection_score === null), "Phase 178 must expose one unranked coverage row per dossier without a duplicated depth array.");
check(p178.place_system_dossiers.every((record) => record.source_entry_binding?.source_id === record.source_ids[0] && record.source_entry_binding?.factual_nucleus === record.source_factual_nucleus && record.linkage_contract?.absent_direct_backlinks?.length === 3), "Phase 178 source-entry or backlink contracts are incomplete.");
check(p178.place_system_dossiers.flatMap((record) => record.system_layers).length === 60 && p178.place_system_dossiers.flatMap((record) => record.timeline).length === 40 && p178.place_system_dossiers.flatMap((record) => record.dependency_edges).length === 50, "Phase 178 layer, timeline, or dependency count is invalid.");
check(p178.place_system_dossiers.every((record) => record.dependency_edges.every((edge) => edge.relation === "Noncausal evidence dependency")) && p178.comparison_overlays.every((record) => record.verdict.includes("Context only")), "Phase 178 overstates causal or comparison authority.");

const weekly = p179.editorial_cycles.filter((record) => record.record_type === "Weekly edition decision");
check(weekly.length === 4 && weekly.flatMap((record) => record.desk_closure_bindings).length === 68 && p179.editorial_cycles.length === 5, "Phase 179 requires four weekly cycles, sixty-eight closures, and one month-end cycle.");
check(weekly.every((record) => record.publication_decision === null && record.publication_receipt_id === null && record.terminal_input_digest === null) && p179.editorial_cycles.at(-1).synthesis_decision === null, "Phase 179 predated an October editorial decision.");
check(JSON.stringify(weekly.map((record) => record.due_evidence_operation_ids)) === JSON.stringify([["60-CYCLE-LOUDOUN-STANDARDS"], ["60-CYCLE-AMTRAK-NAMED-ASSET-RELIABILITY", "60-CYCLE-NNSA-RECURRING-QUALIFIED-RATE"], [], []]), "Phase 179 weekly editions do not preserve the exact due evidence-operation identities.");

const gateCounts = { passed: p180.state_report_gates.filter((gate) => gate.state === "Pass").length, held: p180.state_report_gates.filter((gate) => gate.state === "Held").length, pending: p180.state_report_gates.filter((gate) => gate.state === "Pending build").length };
const derivedAuditGates = ["180-GATE-10-STACK-WATCH", "180-GATE-11-ATLAS-DEPTH", "180-GATE-14-CONTENT-INTEGRITY"].map((id) => p180.state_report_gates.find((gate) => gate.gate_id === id));
check(derivedAuditGates.every((gate) => gate && gate.audit_proof && Object.values(gate.audit_proof).every(Boolean) === gate.derived_pass && gate.state === (gate.derived_pass ? "Pass" : "Held")), "Phase 180 Stack Watch, Atlas, or content-integrity gate is not derived from its embedded audit proof.");
const falsePasses = p180.state_report_gates.filter((gate) => gate.state === "Pass" && gate.derived_pass === false).length;
check(p180.state_report_gates.length === 16 && gateCounts.held === 8 && ((gateCounts.passed === 7 && gateCounts.pending === 1) || (gateCounts.passed === 8 && gateCounts.pending === 0)), "Phase 180 must be either 7/8/1 pending or 8/8/0 locally validated.");
check(p180.counts.readiness_gates === p180.state_report_gates.length && p180.counts.passed === gateCounts.passed && p180.counts.held === gateCounts.held && p180.counts.pending_build === gateCounts.pending && p180.counts.false_passes === falsePasses && falsePasses === 0, "Phase 180 gate counts or false-pass accounting are not derived from current gate state.");
check(p180.v1_promotion_state === "Held" && Object.values(p180.owner_authority).every((value) => value === false), "Phase 180 overstates owner or promotion authority.");
check(aggregate.program_id === "FTFN-V1-OCTOBER-OPERATING-PROGRAM" && aggregate.counts.primary_records === 267 && aggregate.counts.public_html_routes === 260 && aggregate.counts.detail_routes === 251 && aggregate.counts.public_json_exports === 9 && aggregate.counts.publication_updates === 8, "The v1oct aggregate inventory must be 267 records / 260 routes / 251 details / 9 exports / 8 updates.");
check(aggregate.public_html_routes.length === 260 && unique(aggregate.public_html_routes).length === 260 && aggregate.public_json_exports.length === 9 && unique(aggregate.public_json_exports).length === 9, "The aggregate route or export inventory is not unique and exact.");
check(aggregate.baseline_v1rc.artifact_digest === "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a" && aggregate.baseline_v1month.artifact_digest === "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19" && aggregate.baseline_v1cycle.artifact_digest === "cdf822b6451e02523dbdcadfc0f21470011285033de55c919718785aaffd9b34", "An immutable aggregate baseline binding changed.");

const recordsByPhase = {
  173: p173.carryover_records, 174: [...p174.cycle_001_closeout.audit_items, ...p174.cycle_002_intake.candidates], 175: p175.owner_disposition_packets,
  176: [...p176.pilot_admission_packets, p176.zero_series_owner_disposition], 177: p177.packets,
  178: [...p178.place_system_dossiers, ...p178.comparison_overlays, ...p178.interpretive_essays], 179: p179.editorial_cycles, 180: p180.state_report_gates
};
const recordIds = new Map();
for (const [phase, records] of Object.entries(recordsByPhase)) for (const record of records) {
  const id = Object.entries(record).find(([key]) => key.endsWith("_id"))?.[1];
  check(Boolean(id), `Phase ${phase} record lacks a *_id identity.`);
  check(!recordIds.has(id), `Duplicate v1oct record ID ${id}.`);
  recordIds.set(id, record);
}
check(recordIds.size === 267, `Expected 267 unique primary IDs; found ${recordIds.size}.`);
for (const phase of v1octPhases) {
  const update = await readJson(join(updatesRoot, `2026-09-01-phase-${phase}.json`));
  const expected = recordsByPhase[phase].map((record) => Object.entries(record).find(([key]) => key.endsWith("_id"))?.[1]);
  check(update.id === `update-2026-09-01-phase-${phase}` && update.effective_date === "2026-09-01", `Phase ${phase} update identity is invalid.`);
  check(update.affected_record_ids.length === expected.length && new Set(update.affected_record_ids).size === expected.length && expected.every((id) => update.affected_record_ids.includes(id)), `Phase ${phase} update affected-record inventory is not exact.`);
}
const candidateDigest = await computeV1octDigestFromDisk({ dataRoot, updatesRoot, sourcesRoot });
if (p180.local_validation_receipt) check(isValidV1octValidationReceipt({ receipt: p180.local_validation_receipt, aggregate, candidateDigest }), "The embedded Phase 180 receipt does not match the current candidate digest.");
else check(gateCounts.pending === 1 && aggregate.local_validation_state === "Pending build", "Receipt-free Phase 180 must remain validation pending.");

if (failures.length) throw new Error(`Phase 173–180 assertions failed:\n- ${failures.join("\n- ")}`);
console.log(`Phase 173–180 assertions passed: 267 primary records, 260 unique routes, 9 exports, 8 updates, 10 source profiles, ${gateCounts.passed} Pass / 8 Held / ${gateCounts.pending} Pending, and v1 Held.`);
