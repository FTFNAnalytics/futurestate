import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const sourcesRoot = join(appRoot, "src", "content", "sources");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items) => [...new Set(items)];

const names = {
  189: "phase-189-global-authority-rail-activation.json",
  190: "phase-190-global-jurisdiction-system-profiles.json",
  191: "phase-191-international-named-project-conversion-cohort.json",
  192: "phase-192-global-place-systems-atlas.json",
  193: "phase-193-comparative-evidence-lab.json",
  194: "phase-194-longitudinal-outcomes-observatory.json",
  195: "phase-195-canonical-question-library.json",
  196: "phase-196-global-reference-candidate-gate.json",
};
const phases = await Promise.all(Object.values(names).map(readJson));
const [p189, p190, p191, p192, p193, p194, p195, p196] = phases;
check(phases.every((phase, index) => phase.phase === 189 + index && phase.program_id === `FTFN-PHASE-${189 + index}` && phase.schema_version === "1.0"), "Phase 189–196 identity, order, or schema is invalid.");

check(p189.authority_rail_review_packets.length === 80 && p189.artifact_acquisition_slots.length === 120, "Phase 189 requires 80 rail packets and 120 artifact slots.");
check(unique(p189.authority_rail_review_packets.map((record) => record.upstream_rail_id)).length === 80, "Phase 189 rail identities must be unique.");
check(unique(p189.artifact_acquisition_slots.map((record) => record.artifact_acquisition_slot_id)).length === 120, "Phase 189 artifact-slot identities must be unique.");
check(p189.artifact_acquisition_slots.every((record) => record.candidate_url === null && record.exact_artifact_title === null && record.artifact_date === null && record.checked_date === null && record.acquisition_decision === null && record.review_outcome === null), "Phase 189 predated or invented an artifact identity, check, or outcome.");
check(p189.authority_rail_review_packets.every((record) => record.review_date === null && record.review_outcome === null && record.accepted_artifact_ids.length === 0), "Phase 189 predated a rail review.");

check(p190.jurisdiction_system_profiles.length === 20 && unique(p190.jurisdiction_system_profiles.map((record) => record.upstream_jurisdiction_id)).length === 20, "Phase 190 requires twenty unique jurisdiction profiles.");
check(p190.jurisdiction_system_profiles.flatMap((record) => record.authority_topology).length === 80, "Phase 190 requires eighty authority-topology bindings.");
check(p190.jurisdiction_system_profiles.every((record) => record.authority_topology.length === 4 && record.review_date === null && record.review_outcome === null && record.translation_review_decision === null), "Phase 190 topology or future-decision boundaries are invalid.");

check(p191.project_conversion_packets.length === 40, "Phase 191 requires forty project packets.");
check(p191.project_conversion_packets.filter((record) => record.project_name !== null).length === 4 && p191.project_conversion_packets.filter((record) => record.project_name === null).length === 36, "Phase 191 must preserve four exact anchors and thirty-six open dockets.");
check(p191.project_conversion_packets.flatMap((record) => record.stage_tests).length === 320 && p191.project_conversion_packets.every((record) => record.stage_tests.every((cell) => cell.decision === null) && record.review_date === null && record.conversion_decision === null && record.decision_receipt_id === null), "Phase 191 predated a stage or conversion decision.");
check(unique(p191.project_conversion_packets.map((record) => record.international_project_packet_id)).length === 40, "Phase 191 project identities must be unique.");

check(p192.place_system_dossiers.length === 20 && p192.place_system_dossiers.filter((record) => record.place_name !== null).length === 3 && p192.place_system_dossiers.filter((record) => record.place_name === null).length === 17, "Phase 192 must contain three exact place anchors and seventeen open dockets.");
check(p192.place_system_dossiers.flatMap((record) => record.six_layer_reading).length === 120, "Phase 192 requires 120 six-layer cells.");
check(p192.place_system_dossiers.every((record) => record.six_layer_reading.every((cell) => cell.finding === null) && record.selection_decision === null && record.outcome === null && record.score === null && record.rank === null), "Phase 192 invented a place finding, decision, outcome, score, or rank.");

check(p193.comparison_passports.length === 24 && unique(p193.comparison_passports.map((record) => record.global_comparison_passport_id)).length === 24, "Phase 193 requires twenty-four unique comparison passports.");
check(p193.comparison_passports.every((record) => record.left.jurisdiction_id !== record.right.jurisdiction_id && record.left.exact_artifact_id === null && record.right.exact_artifact_id === null && record.comparable_claim === null && record.verdict.startsWith("Blocked") && record.score === null && record.rank === null && record.review_date === null), "Phase 193 crossed a compatibility or future-review boundary.");

check(p194.longitudinal_adjudication_packets.length === 24 && p194.longitudinal_adjudication_packets.flatMap((record) => record.eligibility_tests).length === 144, "Phase 194 requires twenty-four packets and 144 eligibility tests.");
check(p194.longitudinal_adjudication_packets.every((record) => record.candidate_observation_ids.length === 0 && record.admitted_observation_ids.length === 0 && record.compatibility_decision === null && record.admission_decision === null && record.decision_date === null && record.decision_receipt_id === null), "Phase 194 invented a series, observation, or decision.");

check(p195.question_briefs.length === 102 && p195.question_briefs.filter((record) => record.upstream_question_id).length === 68 && p195.question_briefs.filter((record) => !record.upstream_question_id).length === 34, "Phase 195 must contain 68 inherited and 34 recurring briefs.");
check(unique(p195.question_briefs.map((record) => record.canonical_question_brief_id)).length === 102 && unique(p195.question_briefs.filter((record) => record.upstream_question_id).map((record) => record.upstream_question_id)).length === 68, "Phase 195 question identities are duplicated.");
const recurringByTopic = new Map();
for (const record of p195.question_briefs.filter((item) => !item.upstream_question_id)) recurringByTopic.set(record.topic_id, (recurringByTopic.get(record.topic_id) ?? 0) + 1);
check(recurringByTopic.size === 17 && [...recurringByTopic.values()].every((count) => count === 2), "Phase 195 requires two recurring briefs for each of seventeen topics.");
check(p195.question_briefs.every((record) => record.factual_answer_review_date === null && record.factual_answer_decision === null && record.exact_artifact_ids.length === 0), "Phase 195 invented an artifact-level factual answer.");

const gateCounts = { passed: p196.candidate_gates.filter((record) => record.state === "Pass").length, held: p196.candidate_gates.filter((record) => record.state === "Held").length };
check(p196.candidate_gates.length === 18 && gateCounts.passed === 12 && gateCounts.held === 6, "Phase 196 must report 12 Pass and 6 Held gates.");
check(p196.candidate_gates.filter((record) => record.state === "Pass").every((record) => record.derived_pass === true && record.proof === true), "Phase 196 contains a false Pass.");
check(p196.candidate_gates.filter((record) => record.state === "Held").every((record) => record.derived_pass === false && record.owner_decision === null && record.decision_date === null && record.exact_next_action), "Phase 196 Held gates require null decisions and exact next actions.");
check(p196.promotion_state === "Held" && p196.promotion_decision === null && p196.publication_decision === null && p196.expert_review_decision === null && p196.translation_review_decision === null && p196.counts.false_passes === 0, "Phase 196 overstated review or promotion authority.");

const idsByPhase = [
  p189.authority_rail_review_packets.map((record) => record.authority_rail_review_packet_id),
  p190.jurisdiction_system_profiles.map((record) => record.jurisdiction_system_profile_id),
  p191.project_conversion_packets.map((record) => record.international_project_packet_id),
  p192.place_system_dossiers.map((record) => record.global_place_dossier_id),
  p193.comparison_passports.map((record) => record.global_comparison_passport_id),
  p194.longitudinal_adjudication_packets.map((record) => record.longitudinal_adjudication_packet_id),
  p195.question_briefs.map((record) => record.canonical_question_brief_id),
  p196.candidate_gates.map((record) => record.candidate_gate_id),
];
const allPrimaryIds = idsByPhase.flat();
check(unique(allPrimaryIds).length === allPrimaryIds.length, "A primary Phase 189–196 identity is duplicated.");
const routeLists = phases.map((phase) => phase.public_html_routes);
check(routeLists.every((routes) => routes.length === unique(routes).length), "A Phase 189–196 route list contains duplicates.");

const sourceIds = unique([
  ...p189.authority_rail_review_packets.map((record) => record.source_id),
  ...p191.project_conversion_packets.flatMap((record) => record.source_ids),
  ...p192.place_system_dossiers.flatMap((record) => record.source_ids),
  ...p193.comparison_passports.flatMap((record) => [record.left.source_id, record.right.source_id]),
  ...p194.longitudinal_adjudication_packets.flatMap((record) => record.source_ids),
]);
for (const sourceId of sourceIds) {
  try { await access(join(sourcesRoot, `${sourceId}.json`)); }
  catch { failures.push(`Missing referenced source profile ${sourceId}.`); }
}

if (failures.length) throw new Error(`Phase 189–196 assertions failed:\n- ${failures.join("\n- ")}`);
console.log(`Phase 189–196 assertions passed: ${allPrimaryIds.length} primary records, 120 artifact slots, 8 exports, ${sourceIds.length} resolved source identities, 12 Pass / 6 Held gates, and global promotion Held.`);
