import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const dataRoot = join(scriptRoot, "..", "src", "data");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
};
const recordDigest = (value) => sha256(JSON.stringify(stable(value)));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const unique = (values) => new Set(values).size === values.length;

const upstreamNames = new Map([
  [146, "phase-146-authority-gap-resolution-program.json"],
  [147, "phase-147-evidence-adjudication-record.json"],
  [159, "phase-159-owner-decision-sprint.json"],
  [160, "phase-160-longitudinal-pilot-matrices.json"],
  [167, "phase-167-authority-resolution-hearings.json"],
  [168, "phase-168-requirement-mission-adjudication.json"],
  [169, "phase-169-longitudinal-pilot-adjudication.json"],
]);

const upstream = new Map();
const upstreamFileDigests = new Map();
for (const [phase, name] of upstreamNames) {
  const bytes = await readFile(join(dataRoot, name));
  upstream.set(phase, JSON.parse(bytes.toString("utf8")));
  upstreamFileDigests.set(phase, sha256(bytes));
}

const p175 = JSON.parse(await readFile(join(dataRoot, "phase-175-owner-disposition-sprint-ii.json"), "utf8"));
const p176 = JSON.parse(await readFile(join(dataRoot, "phase-176-longitudinal-admission-and-zero-series-decision.json"), "utf8"));

const recordMaps = new Map();
const addRecords = (phase, records, idKey) => {
  const map = recordMaps.get(phase) ?? new Map();
  for (const record of records) map.set(record[idKey], record);
  recordMaps.set(phase, map);
};
addRecords(146, upstream.get(146).gap_dispositions, "disposition_id");
addRecords(147, upstream.get(147).adjudication_records, "adjudication_record_id");
addRecords(159, upstream.get(159).authority_mission_boards, "mission_board_id");
addRecords(159, upstream.get(159).authority_mission_boards.flatMap((board) => board.owner_actions), "action_id");
addRecords(160, upstream.get(160).pilot_matrices, "pilot_matrix_id");
addRecords(167, upstream.get(167).authority_hearings, "authority_hearing_id");
addRecords(168, upstream.get(168).adjudication_dockets, "adjudication_docket_id");
addRecords(169, upstream.get(169).longitudinal_adjudication_packets, "longitudinal_adjudication_packet_id");

const assertFileBindings = (registry, phases) => {
  assert(registry.upstream_file_bindings.length === phases.length, `Phase ${registry.phase} upstream binding count changed.`);
  for (const phase of phases) {
    const binding = registry.upstream_file_bindings.find((item) => item.phase === phase);
    assert(binding, `Phase ${registry.phase} is missing its Phase ${phase} file binding.`);
    assert(binding.sha256 === upstreamFileDigests.get(phase), `Phase ${registry.phase} has a stale Phase ${phase} file digest.`);
  }
};

const assertRecordBinding = (binding, ownerId) => {
  const record = recordMaps.get(binding.phase)?.get(binding.record_id);
  assert(record, `${ownerId} references missing Phase ${binding.phase} record ${binding.record_id}.`);
  assert(recordDigest(record) === binding.record_sha256, `${ownerId} has a stale digest for ${binding.record_id}.`);
  return record;
};

assert(p175.schema_version === "1.0" && p175.phase === 175, "Phase 175 schema identity changed.");
assertFileBindings(p175, [146, 147, 159, 167, 168]);
assert(p175.routes.hub === "/review/v1oct/owner-dispositions/", "Phase 175 hub route changed.");
assert(p175.routes.public_export === "/data/phase-175-owner-disposition-sprint-ii.json", "Phase 175 public export changed.");
assert(p175.owner_disposition_packets.length === 36, "Phase 175 must contain thirty-six packets.");
assert(p175.counts.authority_docket_actions === 12, "Phase 175 authority count changed.");
assert(p175.counts.requirement_docket_actions === 18, "Phase 175 requirement count changed.");
assert(p175.counts.mission_docket_actions === 6, "Phase 175 mission count changed.");
assert(p175.counts.terminal_owner_actions === 0 && p175.counts.pending_owner_actions === 36, "Phase 175 owner-state counts changed.");
assert(p175.counts.public_html_routes === 37 && p175.counts.detail_routes === 36 && p175.counts.public_json_exports === 1, "Phase 175 route/export counts changed.");
const p175Ids = p175.owner_disposition_packets.map((packet) => packet.owner_disposition_packet_id);
const p175Routes = p175.owner_disposition_packets.map((packet) => packet.route);
assert(unique(p175Ids), "Phase 175 packet IDs are not unique.");
assert(unique(p175Routes), "Phase 175 detail routes are not unique.");
assert(p175.public_html_routes.length === 37 && unique(p175.public_html_routes), "Phase 175 public HTML route inventory changed.");
assert(p175.public_html_routes[0] === p175.routes.hub, "Phase 175 hub must be first in its route inventory.");
assert(p175Routes.every((route) => p175.public_html_routes.includes(route)), "Phase 175 is missing a detail route from its route inventory.");
assert(JSON.stringify(p175.public_json_exports) === JSON.stringify([p175.routes.public_export]), "Phase 175 public export inventory changed.");

for (const packet of p175.owner_disposition_packets) {
  const id = packet.owner_disposition_packet_id;
  assert(Object.keys(packet).find((key) => key.endsWith("_id")) === "owner_disposition_packet_id", `${id} does not expose the expected primary ID first.`);
  assert(packet.owner_outcome === null && packet.decision_date === null && packet.decision_receipt_id === null, `${id} fabricates an owner outcome.`);
  assert(packet.reviewer_role === null && packet.rationale === null, `${id} fabricates owner-review metadata.`);
  assert(packet.receipt_template.required_fields.includes("owner_disposition_packet_id"), `${id} receipt template does not bind the packet identity.`);
  assert(packet.receipt_template.owner_outcome === null && packet.receipt_template.receipt_id === null, `${id} receipt template is not empty.`);
  assert(packet.route.startsWith(p175.routes.hub) && packet.route.endsWith("/"), `${id} has an invalid detail route.`);
  const boundRecords = packet.upstream_records.map((binding) => assertRecordBinding(binding, id));
  for (const record of boundRecords.filter((item) => item.candidate_set_digest)) {
    assert(record.candidate_set_digest === packet.candidate_set_digest, `${id} changed a bound candidate-set digest.`);
  }
}

const packetById = new Map(p175.owner_disposition_packets.map((packet) => [packet.owner_disposition_packet_id, packet]));
const isTerminalOwnerPacket = (packet) => Boolean(packet?.owner_outcome && packet?.decision_date && packet?.decision_receipt_id);
const prerequisitesSatisfied = (packet, records = packetById) => {
  if (packet.action_kind === "authority disposition") return true;
  if (packet.action_kind === "requirement decision") {
    return isTerminalOwnerPacket(records.get(packet.prerequisite_authority_packet_id))
      && packet.prerequisite_authority_receipt_id === records.get(packet.prerequisite_authority_packet_id)?.decision_receipt_id;
  }
  if (packet.action_kind === "mission decision") {
    const requirements = packet.prerequisite_packet_ids.map((id) => records.get(id));
    const authorities = packet.prerequisite_authority_packet_ids.map((id) => records.get(id));
    return requirements.every(isTerminalOwnerPacket)
      && authorities.every(isTerminalOwnerPacket)
      && JSON.stringify(packet.prerequisite_requirement_receipt_ids) === JSON.stringify(requirements.map((item) => item.decision_receipt_id))
      && JSON.stringify(packet.prerequisite_authority_receipt_ids) === JSON.stringify(authorities.map((item) => item.decision_receipt_id));
  }
  return false;
};

for (const packet of p175.owner_disposition_packets) {
  if (isTerminalOwnerPacket(packet) && packet.action_kind !== "authority disposition") {
    assert(prerequisitesSatisfied(packet), `${packet.owner_disposition_packet_id} is terminal without every prerequisite terminal receipt.`);
  }
}

const requirementPackets = p175.owner_disposition_packets.filter((packet) => packet.action_kind === "requirement decision");
const expectedAuthorityNumbers = [1, 1, 1, 3, 3, 3, 4, 4, 4, 6, 6, 6, 9, 9, 9, 11, 11, 11];
assert(JSON.stringify(requirementPackets.map((packet) => Number(packet.prerequisite_authority_packet_id.split("-").at(-1)))) === JSON.stringify(expectedAuthorityNumbers), "Phase 175 requirement-to-authority prerequisite mapping changed.");
assert(requirementPackets.every((packet) => packet.prerequisite_authority_state.includes("remain null") && packet.prerequisite_authority_receipt_id === null), "A requirement hides or fabricates its authority prerequisite state.");
assert(requirementPackets.every((packet) => packet.receipt_template.required_fields.includes("prerequisite_authority_receipt_id")), "A requirement receipt template omits its authority prerequisite receipt.");
const prematureRequirement = { ...requirementPackets[0], owner_outcome: "carried", decision_date: "2026-09-01", decision_receipt_id: "fixture-receipt", prerequisite_authority_receipt_id: null };
assert(!prerequisitesSatisfied(prematureRequirement), "A requirement can terminate before its authority prerequisite.");

const missionPackets = p175.owner_disposition_packets.filter((packet) => packet.action_kind === "mission decision");
for (const packet of missionPackets) {
  assert(packet.prerequisite_packet_ids.length === 3, `${packet.owner_disposition_packet_id} must bind three requirement packets.`);
  assert(packet.prerequisite_packet_ids.every((id) => p175Ids.includes(id)), `${packet.owner_disposition_packet_id} has a missing prerequisite packet.`);
  assert(packet.prerequisite_authority_packet_ids.length === 1 && packet.prerequisite_authority_packet_ids.every((id) => p175Ids.includes(id)), `${packet.owner_disposition_packet_id} lacks its inherited authority prerequisite.`);
  assert(packet.prerequisite_requirement_receipt_ids.length === 0 && packet.prerequisite_authority_receipt_ids.length === 0, `${packet.owner_disposition_packet_id} fabricates prerequisite receipts.`);
  assert(packet.receipt_template.required_fields.includes("prerequisite_requirement_receipt_ids") && packet.receipt_template.required_fields.includes("prerequisite_authority_receipt_ids"), `${packet.owner_disposition_packet_id} receipt template omits prerequisite receipts.`);
  assert(packet.prerequisite_state.includes("remain null"), `${packet.owner_disposition_packet_id} hides its prerequisite hold.`);
}
const prematureMission = { ...missionPackets[0], owner_outcome: "carried", decision_date: "2026-09-01", decision_receipt_id: "fixture-mission-receipt" };
assert(!prerequisitesSatisfied(prematureMission), "A mission can terminate before its authority and requirement prerequisites.");

assert(p176.schema_version === "1.0" && p176.phase === 176, "Phase 176 schema identity changed.");
assertFileBindings(p176, [160, 169]);
assert(p176.routes.hub === "/review/v1oct/longitudinal-decisions/", "Phase 176 hub route changed.");
assert(p176.routes.public_export === "/data/phase-176-longitudinal-admission-and-zero-series-decision.json", "Phase 176 public export changed.");
assert(p176.pilot_admission_packets.length === 3, "Phase 176 must contain three pilot packets.");
assert(p176.counts.compatibility_test_decisions === 18 && p176.counts.pending_compatibility_test_decisions === 18, "Phase 176 compatibility counts changed.");
assert(p176.counts.admitted_series === 0 && p176.counts.observations_transferred === 0, "Phase 176 fabricates an admitted series or transferred observation.");
assert(p176.counts.public_html_routes === 5 && p176.counts.detail_routes === 4 && p176.counts.public_json_exports === 1, "Phase 176 route/export counts changed.");
const expectedCompatibilityDimensions = ["identity", "period", "measure", "denominator", "revision lineage", "dual review"];
const expectedProvenanceDimensions = ["identity", "denominator", "period", "method", "revision policy", "missingness"];
const compatibilityIds = [];
for (const packet of p176.pilot_admission_packets) {
  const id = packet.pilot_admission_packet_id;
  assert(Object.keys(packet).find((key) => key.endsWith("_id")) === "pilot_admission_packet_id", `${id} does not expose the expected primary ID first.`);
  assert(packet.compatibility_decisions.length === 6, `${id} must carry six compatibility decisions.`);
  assert(packet.provenance_table.length === 6, `${id} must carry six provenance rows.`);
  assert(JSON.stringify(packet.compatibility_decisions.map((item) => item.dimension)) === JSON.stringify(expectedCompatibilityDimensions), `${id} compatibility dimensions changed.`);
  assert(JSON.stringify(packet.provenance_table.map((item) => item.dimension)) === JSON.stringify(expectedProvenanceDimensions), `${id} provenance dimensions changed.`);
  assert(packet.compatibility_decisions.every((item) => item.compatibility_outcome === null && item.decision_receipt_id === null), `${id} fabricates a compatibility outcome.`);
  assert(packet.provenance_table.every((item) => item.compatibility_outcome === null && item.decision_receipt_id === null), `${id} fabricates a provenance outcome.`);
  assert(packet.admission_outcome === null && packet.admitted_series_id === null && packet.observations_transferred === 0, `${id} fabricates an admission.`);
  assert(packet.legacy_observation_inventory.values_copied_into_phase_176 === 0 && packet.legacy_observation_inventory.observation_values.length === 0, `${id} transfers an observation.`);
  assert(packet.route.startsWith(p176.routes.hub) && packet.route.endsWith("/"), `${id} has an invalid detail route.`);
  const boundRecords = packet.upstream_records.map((binding) => assertRecordBinding(binding, id));
  assert(boundRecords.every((record) => record.series_definition_digest === packet.series_definition_digest), `${id} changed its series-definition digest.`);
  compatibilityIds.push(...packet.compatibility_decisions.map((item) => item.compatibility_decision_id));
}
assert(compatibilityIds.length === 18 && unique(compatibilityIds), "Phase 176 compatibility IDs changed.");

const zero = p176.zero_series_owner_disposition;
assert(Object.keys(zero).find((key) => key.endsWith("_id")) === "zero_series_disposition_id", "The zero-series packet does not expose the expected primary ID first.");
assert(zero.owner_outcome === null && zero.owner_accepted_zero_series === null && zero.decision_receipt_id === null, "Phase 176 fabricates a zero-series owner outcome.");
assert(zero.admitted_series_id === null && zero.observations_transferred === 0, "The zero-series packet fabricates an admission or observation.");
const zeroRecords = zero.upstream_records.map((binding) => assertRecordBinding(binding, zero.zero_series_disposition_id));
assert(zeroRecords[0].boundary_scope_digest === zero.boundary_scope_digest, "The Phase 160 zero-series digest changed.");
assert(zeroRecords[1].series_definition_digest === zero.boundary_scope_digest, "The Phase 169 zero-series digest changed.");
assert(zero.route === `${p176.routes.hub}zero-series-launch-boundary/`, "The zero-series detail route changed.");

const p176Routes = [...p176.pilot_admission_packets.map((packet) => packet.route), zero.route];
assert(p176.public_html_routes.length === 5 && unique(p176.public_html_routes), "Phase 176 public HTML route inventory changed.");
assert(p176.public_html_routes[0] === p176.routes.hub, "Phase 176 hub must be first in its route inventory.");
assert(p176Routes.every((route) => p176.public_html_routes.includes(route)), "Phase 176 is missing a detail route from its route inventory.");
assert(JSON.stringify(p176.public_json_exports) === JSON.stringify([p176.routes.public_export]), "Phase 176 public export inventory changed.");
assert(p175.counts.combined_owner_controlled_backlog === 37 && p176.counts.combined_owner_controlled_backlog === 37, "The 36 + 1 owner-count contract changed.");

console.log("Phase 175–176 assertions passed: 36 owner dockets, 18 compatibility cells, 21 governed evidence decisions, 37 + 5 routes, 2 exports, 0 fabricated outcomes, 0 transferred observations.");
