import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items) => new Set(items).size === items.length;

const names = [
  "phase-130-authority-gap-closure-maps.json", "phase-131-priority-evidence-admission-dockets.json", "phase-132-dated-source-check-receipts.json", "phase-133-requirement-adjudication-board.json", "phase-134-mission-decision-register.json",
  "phase-135-atlas-conversion-readiness-audit.json", "phase-136-named-project-chronicles.json", "phase-137-place-delivery-ledgers.json", "phase-138-longitudinal-evidence-eligibility.json", "phase-139-comparative-dossier-rereview.json",
  "phase-140-living-topic-desks.json", "phase-141-frontier-systems-almanac.json", "phase-142-topic-delivery-roadmaps.json", "phase-143-editorial-cadence-editions.json", "phase-144-v1-launch-candidate-audit.json",
];
const registries = await Promise.all(names.map(readJson));
const byPhase = new Map(registries.map((registry) => [registry.phase, registry]));
const [missions, audits, authority, acquisition, dossiers, cycle, v07, v08, v09] = await Promise.all([
  readJson("phase-121-priority-research-missions.json"), readJson("phase-126-mission-evidence-audits.json"), readJson("phase-117-global-authority-graph.json"), readJson("phase-120-evidence-acquisition-packets.json"), readJson("phase-123-comparative-delivery-dossiers.json"), readJson("phase-60-operating-cycle.json"), readJson("v07-evidence-admission-dockets.json"), readJson("v08-conversion-longitudinal-atlas.json"), readJson("v09-living-public-intelligence.json"),
]);

check(registries.length === 15 && registries.every((registry, index) => registry.phase === 130 + index), "Phase 130–144 registry sequence is incomplete.");
for (const registry of registries) {
  const validBuildStatus = registry.phase === 144 ? ["Complete locally", "Candidate assembled — validation pending"].includes(registry.build_status) : registry.build_status === "Complete locally";
  check(registry.schema_version === "1.0" && registry.effective_date === "2026-08-30" && validBuildStatus, `Phase ${registry.phase} identity, date, or build status is invalid.`);
  check(registry.public_html_routes.length >= 1 && unique(registry.public_html_routes), `Phase ${registry.phase} route inventory is empty or duplicated.`);
  check(registry.public_json_exports.length === 1 && registry.public_json_exports[0] === registry.routes.public_export, `Phase ${registry.phase} export contract is invalid.`);
  check(registry.publication_boundaries.length === 4, `Phase ${registry.phase} does not carry all four publication boundaries.`);
}

const p130 = byPhase.get(130); const p131 = byPhase.get(131); const p132 = byPhase.get(132); const p133 = byPhase.get(133); const p134 = byPhase.get(134);
check(p130.gap_maps.length === 12 && p130.counts.artifacts_admitted === 0, "Phase 130 must map all twelve gaps and admit zero artifacts.");
check(p131.admission_dockets.length === 6 && p131.admission_dockets.flatMap((record) => record.requirements).length === 18, "Phase 131 must contain six mission and eighteen requirement dockets.");
check(p131.admission_dockets.every((docket) => docket.requirements.every((item) => item.owner_decision === "Pending required human adjudication")), "Phase 131 contains a fabricated owner decision.");
const p132SourceIds = [...new Set(p132.source_check_receipts.flatMap((receipt) => receipt.source_ids))];
const p132Sources = await Promise.all(p132SourceIds.map((id) => readJson(join("..", "content", "sources", `${id}.json`))));
check(p132SourceIds.length === 12 && p132Sources.every((source) => source.last_checked_date === "2026-08-30"), "Phase 132 must resolve twelve official sources rechecked on 2026-08-30.");
check(p132.source_check_receipts.length === 18 && p132.counts.evidence_admission_receipts === 0 && p132.source_check_receipts.every((receipt) => receipt.source_checked_date === "2026-08-30" && receipt.admission_effect === "None" && receipt.source_check_provenance.every((source) => source.source_last_checked_date === "2026-08-30")), "Phase 132 source-check provenance or admission-receipt boundaries are invalid.");
const allowedRequirementDecisions = new Set(["Pending owner adjudication", "Accepted", "Rejected", "Inadmissible", "Bounded gap"]);
check(p133.adjudication_items.length === 18 && p133.adjudication_items.every((item) => allowedRequirementDecisions.has(item.decision_state) && (item.decision_state === "Pending owner adjudication" ? item.decision_date === null && item.decision_receipt_id === null && item.accepted_source_ids.length === 0 : Boolean(item.decision_date && item.decision_receipt_id))), "Phase 133 contains a malformed or unreceipted adjudication state.");
check(p134.mission_decisions.length === 6 && p134.mission_decisions.every((item) => item.answer === null ? item.decision_date === null && item.decision_receipt_id === null : Boolean(item.decision_date && item.decision_receipt_id && item.requirements_decided === item.requirements_total)), "Phase 134 contains a malformed mission answer or receipt.");

const p135 = byPhase.get(135); const p136 = byPhase.get(136); const p137 = byPhase.get(137); const p138 = byPhase.get(138); const p139 = byPhase.get(139);
check(p135.readiness_records.length === 39 && p135.counts.projects === 24 && p135.counts.places === 15 && p135.counts.project_or_place_stage_advances === 0, "Phase 135 Atlas audit is incomplete or advances a state.");
check(p136.project_chronicles.length === 24 && new Set(p136.project_chronicles.map((item) => item.atlas_project_id)).size === 24 && p136.counts.stage_advances === 0, "Phase 136 must contain twenty-four unique, non-advancing project chronicles.");
check(p137.place_ledgers.length === 15 && p137.place_ledgers.every((item) => item.place_stage === null) && p137.counts.synthetic_place_stages === 0, "Phase 137 must contain fifteen ledgers and zero synthetic place stages.");
check(p138.eligibility_records.length === 39 && p138.counts.legacy_panel_joins === 12 && p138.counts.governed_file_joins === 8 && p138.eligibility_records.every((item) => item.tests.length === 4 && item.series_admitted === false && item.observation_values.length === 0 && item.eligibility_outcome === "Not eligible for longitudinal admission") && p138.counts.admitted_series === 0, "Phase 138 must preserve 39 four-test reviews, twelve legacy joins, eight governed joins, and zero admissions.");
const eligibilityIds = new Set(p138.eligibility_records.map((item) => item.eligibility_id));
check(p139.comparison_reviews.length === 12 && p139.comparison_reviews.every((item) => item.inherited_verdict === "Context only" && item.rereview_verdict === "Context only" && item.verdict_changed === false && item.longitudinal_eligibility_ids.every((id) => eligibilityIds.has(id))), "Phase 139 changed a context-only verdict or contains an unresolved eligibility join.");

const p140 = byPhase.get(140); const p141 = byPhase.get(141); const p142 = byPhase.get(142); const p143 = byPhase.get(143); const p144 = byPhase.get(144);
const renderedV08V09 = JSON.stringify([p136, p137, p141]);
check(!renderedV08V09.includes("because The ") && !renderedV08V09.includes("?."), "Phase 136, 137, or 141 contains a known inherited prose defect.");
check(p140.topic_desks.length === 17 && p140.counts.mission_links === 68 && p140.counts.desks_in_inaugural_edition === 17 && p140.topic_desks.every((desk) => desk.mission_ids.length === desk.next_actions.length && desk.mission_decision_ids.every((id) => p134.mission_decisions.some((record) => record.mission_decision_id === id))), "Phase 140 must publish seventeen fully joined desks and sixty-eight mission links.");
check(p141.almanac_entries.length === 56 && p141.counts.topics === 17 && p141.counts.projects === 24 && p141.counts.places === 15 && p141.almanac_entries.every((item) => !("evidence_ids" in item) && Array.isArray(item.mission_ids) && Array.isArray(item.signal_ids) && Array.isArray(item.source_ids)), "Phase 141 almanac must contain 56 exact entities with typed references.");
const missionDecisionByMissionId = new Map(p134.mission_decisions.map((item) => [item.mission_id, item]));
check(p142.topic_roadmaps.length === 17 && p142.counts.horizon_milestones === 68 && p142.counts.numeric_rankings === 0 && p142.topic_roadmaps.flatMap((item) => item.horizon_milestones).every((milestone) => { const decision = missionDecisionByMissionId.get(milestone.mission_id); return decision ? milestone.mission_decision_id === decision.mission_decision_id && milestone.current_state === decision.mission_decision_state : milestone.mission_decision_id === null; }), "Phase 142 must contain 68 decision-linked horizon milestones and zero ranks.");
const inauguralEdition = p143.editions.find((item) => item.edition_id === "143-EDITION-001");
check(p143.editions.length === 5 && inauguralEdition?.state === "Published" && Object.keys(inauguralEdition?.editorial_sections ?? {}).length === 6 && inauguralEdition?.desk_dispatches?.length === 17 && p143.counts.published_editions + p143.counts.scheduled_editions === 5 && p143.editions.filter((item) => item.state.startsWith("Scheduled")).every((item) => item.included_desk_ids.length === 0), "Phase 143 lacks its authored inaugural edition or predates scheduled content.");
const validationPassed = p144.local_validation_receipt?.status === "Passed";
check(p144.launch_gates.length === 14 && p144.v1_promotion_state === "Held" && p144.counts.false_passes === 0 && p144.counts.held === 4 && p144.counts.passed === (validationPassed ? 10 : 8) && p144.counts.pending_build === (validationPassed ? 0 : 2), "Phase 144 must retain fourteen honest gates, four holds, and the receipt-derived validation split.");

for (const [version, program, phases, routeCount] of [["0.7", v07, [130, 131, 132, 133, 134], 12], ["0.8", v08, [135, 136, 137, 138, 139], 57], ["0.9", v09, [140, 141, 142, 143, 144], 101]]) {
  const validStatus = version === "0.9" ? ["Complete locally", "Candidate assembled — validation pending"].includes(program.status) : program.status === "Complete locally";
  check(program.version === version && validStatus && program.phases.map((item) => item.phase).join(",") === phases.join(","), `v${version} identity or phase sequence is invalid.`);
  check(program.public_html_routes.length === routeCount && unique(program.public_html_routes) && program.public_json_exports.length === 6 && unique(program.public_json_exports), `v${version} route/export inventory is invalid.`);
}

check(authority.rails.length === 80 && authority.rails.every((rail) => rail.mapping_state === "Mapped candidate authority rail" && rail.artifact_review_state === "Exact artifact review required"), "A Phase 117 authority rail changed from Candidate.");
check(acquisition.acquisition_packets.length === 80 && acquisition.counts.artifact_targets === 320 && acquisition.counts.exact_artifacts_admitted === 0, "Phase 120 acquisition baseline changed.");
check(missions.missions.length === 68 && missions.missions.every((mission) => mission.answer_state === "Research packet assembled — answer not adjudicated"), "A Phase 121 mission answer changed.");
check(missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0).length === 12, "The 56/12 mission acquisition split changed.");
check(audits.counts.requirement_tests === 204 && audits.counts.requirements_with_potentially_relevant_context === 90 && audits.counts.requirements_without_screened_term_overlap === 114, "The Phase 126 audit baseline changed.");
check(dossiers.dossiers.length === 12 && dossiers.dossiers.every((record) => record.comparison_passport.verdict === "Context only"), "A Phase 123 verdict changed.");
const future = cycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(future.length === 11 && future.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "A future Phase 60 gate was operated or predated.");

const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const signalFiles = (await readdir(join(appRoot, "src", "content", "signals"))).filter((name) => /\.mdx?$/.test(name));
check(sourceFiles.length === 795 && signalFiles.length === 1406, "The 795-source / 1,406-signal corpus changed.");
const updateFiles = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => /^2026-08-30-phase-1(3\d|4[0-4])\.json$/.test(name));
check(updateFiles.length === 15, "Exactly fifteen Phase 130–144 update records are required.");
for (const registry of registries) {
  const slug = registry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
  try { await readFile(join(workspaceRoot, "docs", "work-packages", `phase-${registry.phase}-${slug}.md`), "utf8"); } catch { failures.push(`Phase ${registry.phase} work package is missing.`); }
}

if (failures.length) {
  console.error("FTFN v0.7-v0.9 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.7-v0.9 assertions passed: 15 complete content phases, 170 public routes, 18 exports, 12 acquisition gaps, 18 pending owner requirement decisions, 39 Atlas reviews, 56 almanac entries, 17 desks, and a truthful v1 hold.");
