import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readText = (...parts) => readFile(join(...parts), "utf8");
const readJson = async (...parts) => JSON.parse(await readText(...parts));
const registry = await readJson(appRoot, "src", "data", "phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json");
const phase76 = await readJson(appRoot, "src", "data", "phase-76-cross-case-learning-portfolio-policy-retirement-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const isEmpty = (value) => Array.isArray(value) && value.length === 0;

const standing = registry.stakeholder_standing_notice_registers;
const deliberation = registry.deliberation_issue_response_dockets;
const mandates = registry.mandate_legitimacy_appeal_registers;
const adaptive = registry.adaptive_mandate_review_ledgers;
check(registry.phase === "77" && registry.schema_version === "1.0", "The Phase 77 registry identity is wrong.");
check(standing.length === 8 && deliberation.length === 8 && mandates.length === 8 && adaptive.length === 8, "Phase 77 must publish four eight-record families.");
check(registry.standing_notice_gates.length === 16 && registry.deliberation_gates.length === 18 && registry.mandate_appeal_gates.length === 16 && registry.adaptive_review_gates.length === 14, "The Phase 77 gate taxonomies are incomplete.");
check(registry.constituency_classes.length === 12 && registry.issue_classes.length === 12 && registry.participation_quality_dimensions.length === 12 && registry.appeal_grounds.length === 10 && registry.adaptive_triggers.length === 12, "The Phase 77 constituency, issue, quality, appeal, or trigger taxonomy is incomplete.");

const expectedCohorts = phase76.institutional_learning_dossiers.map((record) => record.cohort_id).sort();
for (const [records, label] of [[standing, "standing"], [deliberation, "deliberation"], [mandates, "mandate"], [adaptive, "adaptive"]]) {
  check(JSON.stringify(records.map((record) => record.cohort_id).sort()) === JSON.stringify(expectedCohorts), `The ${label} records do not map exactly once to the eight Phase 76 cohorts.`);
}

standing.forEach((record, index) => {
  const padded = String(index + 1).padStart(3, "0");
  check(record.stakeholder_standing_notice_register_id === `77-SSR-${padded}`, `Standing identity ${padded} is wrong.`);
  check(record.record_status === "Published" && record.standing_state === "Inactive - No Admitted Cross-Case Finding" && record.opening_decision === "Not Open", `${record.stakeholder_standing_notice_register_id} advanced prematurely.`);
  check(record.standing_notice_checks.length === 16 && record.standing_notice_checks.every((item) => item.decision_state === "Inactive"), `${record.stakeholder_standing_notice_register_id} has an active standing gate.`);
  check(record.constituency_standing_records.length === 12 && record.constituency_standing_records.every((item) => item.standing_state === "Unassessed" && isEmpty(item.claimant_ids) && isEmpty(item.evidence_ids) && isEmpty(item.challenge_ids)), `${record.stakeholder_standing_notice_register_id} has premature constituency evidence.`);
  check(isEmpty(record.admitted_cross_case_finding_ids) && record.public_decision_question === null && record.convening_authority_id === null && record.decision_scope_record === null && isEmpty(record.stakeholder_inventory_records) && isEmpty(record.rights_and_treaty_records) && isEmpty(record.standing_decision_records), `${record.stakeholder_standing_notice_register_id} contains a premature standing decision.`);
  check(record.notice_plan_id === null && record.accessibility_plan_id === null && record.participation_support_plan_id === null && record.privacy_and_safety_plan_id === null && isEmpty(record.standing_challenge_records) && record.first_reviewer_id === null && record.second_reviewer_id === null && record.standing_notice_receipt_id === null, `${record.stakeholder_standing_notice_register_id} contains premature notice, review, or receipt data.`);
  check(record.automatic_standing_allowed === false && record.automatic_exclusion_allowed === false && record.participation_volume_as_legitimacy_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.stakeholder_standing_notice_register_id} violates an automation boundary.`);
});

deliberation.forEach((record, index) => {
  const padded = String(index + 1).padStart(3, "0");
  check(record.deliberation_issue_response_docket_id === `77-DIR-${padded}`, `Deliberation identity ${padded} is wrong.`);
  check(record.record_status === "Published" && record.deliberation_state === "Inactive - No Authorized Participation Process" && record.process_decision === "Not Open", `${record.deliberation_issue_response_docket_id} advanced prematurely.`);
  check(record.deliberation_checks.length === 18 && record.deliberation_checks.every((item) => item.decision_state === "Inactive"), `${record.deliberation_issue_response_docket_id} has an active gate.`);
  check(record.issue_matrix_records.length === 12 && record.issue_matrix_records.every((item) => item.issue_state === "Unopened" && isEmpty(item.submission_ids) && isEmpty(item.evidence_ids) && item.response_record_id === null && isEmpty(item.dissent_record_ids)), `${record.deliberation_issue_response_docket_id} has a premature issue.`);
  check(record.participation_quality_records.length === 12 && record.participation_quality_records.every((item) => item.measurement_state === "Not Measured" && isEmpty(item.evidence_ids) && item.finding_id === null), `${record.deliberation_issue_response_docket_id} has a premature quality finding.`);
  for (const field of ["consultation_records", "consent_boundary_records", "public_comment_records", "affected_community_hearing_records", "workforce_hearing_records", "service_user_accessibility_hearing_records", "technical_expert_hearing_records", "intergenerational_review_records", "material_issue_records", "reasoned_response_records", "dissent_and_non_consensus_records"]) check(isEmpty(record[field]), `${record.deliberation_issue_response_docket_id} contains premature ${field}.`);
  check(record.process_authorization_id === null && record.process_calendar === null && record.common_record_version_id === null && record.quality_assessment_record === null && record.first_reviewer_id === null && record.second_reviewer_id === null && record.deliberation_receipt_id === null, `${record.deliberation_issue_response_docket_id} contains premature process or receipt data.`);
  check(record.automatic_consensus_allowed === false && record.automatic_consent_allowed === false && record.comment_count_as_weight_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.deliberation_issue_response_docket_id} violates an automation boundary.`);
});

mandates.forEach((record, index) => {
  const padded = String(index + 1).padStart(3, "0");
  check(record.mandate_legitimacy_appeal_register_id === `77-MLA-${padded}`, `Mandate identity ${padded} is wrong.`);
  check(record.record_status === "Published" && record.mandate_state === "Inactive - No Completed Reasoned-Response Record" && record.mandate_decision === "Not Open", `${record.mandate_legitimacy_appeal_register_id} advanced prematurely.`);
  check(record.mandate_legitimacy_checks.length === 16 && record.mandate_legitimacy_checks.every((item) => item.decision_state === "Inactive"), `${record.mandate_legitimacy_appeal_register_id} has an active mandate gate.`);
  check(record.appeal_ground_records.length === 10 && record.appeal_ground_records.every((item) => item.ground_state === "Unavailable" && isEmpty(item.appeal_ids) && isEmpty(item.decision_ids) && isEmpty(item.remedy_ids)), `${record.mandate_legitimacy_appeal_register_id} has premature appeal evidence.`);
  for (const field of ["completed_reasoned_response_ids", "dissent_record_ids", "appeal_records", "reconsideration_records", "stay_records", "remedy_records", "mandate_conditions"]) check(isEmpty(record[field]), `${record.mandate_legitimacy_appeal_register_id} contains premature ${field}.`);
  for (const field of ["authority_record", "procedure_compliance_record", "standing_coverage_record", "accessibility_finding_record", "rights_and_consent_finding_record", "distributional_finding_record", "proportionality_record", "legitimacy_audit_record", "mandate_terms", "mandate_start_date", "mandate_end_or_review_date", "first_reviewer_id", "second_reviewer_id", "mandate_receipt_id"]) check(record[field] === null, `${record.mandate_legitimacy_appeal_register_id} contains premature ${field}.`);
  check(record.automatic_legitimacy_allowed === false && record.automatic_mandate_allowed === false && record.automatic_appeal_disposition_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.mandate_legitimacy_appeal_register_id} violates an automation boundary.`);
});

adaptive.forEach((record, index) => {
  const padded = String(index + 1).padStart(3, "0");
  check(record.adaptive_mandate_review_ledger_id === `77-AMR-${padded}`, `Adaptive identity ${padded} is wrong.`);
  check(record.record_status === "Published" && record.adaptive_state === "Inactive - No Authorized Public Mandate" && record.review_decision === "Not Open", `${record.adaptive_mandate_review_ledger_id} advanced prematurely.`);
  check(record.adaptive_review_checks.length === 14 && record.adaptive_review_checks.every((item) => item.decision_state === "Inactive"), `${record.adaptive_mandate_review_ledger_id} has an active adaptive gate.`);
  check(record.adaptive_trigger_records.length === 12 && record.adaptive_trigger_records.every((item) => item.trigger_state === "Dormant" && isEmpty(item.event_ids) && item.review_id === null), `${record.adaptive_mandate_review_ledger_id} has a premature trigger.`);
  for (const field of ["mandate_condition_records", "baseline_records", "review_indicator_records", "monitoring_records", "trigger_event_records", "reopened_standing_records", "updated_notice_records", "changed_condition_records", "updated_impact_records", "adaptive_option_records", "reasoned_response_records", "safeguard_and_remedy_records"]) check(isEmpty(record[field]), `${record.adaptive_mandate_review_ledger_id} contains premature ${field}.`);
  for (const field of ["authorized_mandate_id", "mandate_version", "mandate_owner_id", "scheduled_review_date", "sunset_date", "adaptive_decision_record", "first_reviewer_id", "second_reviewer_id", "adaptive_review_receipt_id"]) check(record[field] === null, `${record.adaptive_mandate_review_ledger_id} contains premature ${field}.`);
  check(record.silent_renewal_allowed === false && record.automatic_mandate_extension_allowed === false && record.automatic_trigger_disposition_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.adaptive_mandate_review_ledger_id} violates an automation boundary.`);
});

for (const [key, value] of Object.entries(registry.metrics)) {
  if (["stakeholder_standing_notice_registers", "deliberation_issue_response_dockets", "mandate_legitimacy_appeal_registers", "adaptive_mandate_review_ledgers", "standing_notice_gates", "deliberation_gates", "mandate_appeal_gates", "adaptive_review_gates", "constituency_classes", "issue_classes", "participation_quality_dimensions", "appeal_grounds", "adaptive_triggers"].includes(key)) continue;
  check(value === 0, `Phase 77 metric ${key} must remain zero.`);
}

const guideIds = ["briefing-community-standing-affected-publics-001", "briefing-indigenous-treaty-consultation-boundaries-001", "briefing-worker-supply-chain-voice-001", "briefing-accessibility-service-user-participation-001", "briefing-environmental-justice-cumulative-burden-deliberation-001", "briefing-technical-expert-public-knowledge-001", "briefing-public-reason-issue-response-001", "briefing-dissent-appeal-reconsideration-001", "briefing-intergenerational-future-user-review-001", "briefing-adaptive-democratic-mandate-001"];
const mapIds = ["dependency-map-notice-is-not-accessible-participation", "dependency-map-participation-volume-is-not-consent-or-legitimacy", "dependency-map-comment-count-is-not-reasoned-response", "dependency-map-mandate-is-not-permanent-authorization"];
for (const guideId of guideIds) {
  const content = await readText(appRoot, "src", "content", "briefings", guideId + ".mdx");
  check(content.includes('record_status: "Published"') && content.length > 3500, `${guideId} is missing or too thin.`);
}
for (const mapId of mapIds) {
  const map = await readJson(appRoot, "src", "content", "dependency-maps", mapId.replace("dependency-map-", "") + ".json");
  check(map.id === mapId && map.record_status === "Published" && map.nodes.length >= 6 && map.links.length >= 5, `${mapId} is incomplete.`);
}

const pathwayIds = [...new Set(standing.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, `Expected 10 integrated pathways, found ${pathwayIds.length}.`);
for (const pathwayId of pathwayIds) {
  const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits a Phase 77 guide or map.`);
}
for (const record of standing) {
  const briefing = await readText(appRoot, "src", "content", "briefings", record.canonical_briefing_id + ".mdx");
  check(briefing.includes("## Phase 77 public-deliberation and adaptive-mandate boundary"), `${record.canonical_briefing_id} omits its Phase 77 boundary.`);
}
for (const filename of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) {
  const body = await readText(appRoot, "src", "content", "local-systems", filename);
  check(body.includes("## Phase 77 affected-public and adaptive-mandate boundary"), `${filename} omits its Phase 77 boundary.`);
}
for (const filename of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-implementation-commitment-ledger-001.mdx", "briefing-realized-impact-audit-001.mdx", "briefing-reversal-remediation-desk-001.mdx", "briefing-evidence-synthesis-desk-001.mdx", "briefing-institutional-memory-negative-results-001.mdx", "briefing-policy-retirement-decommissioning-001.mdx"]) {
  const body = await readText(appRoot, "src", "content", "briefings", filename);
  check(body.includes("## Phase 77 participation, public reason, and adaptive mandate control"), `${filename} omits its Phase 77 operating boundary.`);
}

const indexPage = await readText(appRoot, "src", "pages", "evidence", "deliberation", "index.astro");
const detailPage = await readText(appRoot, "src", "pages", "evidence", "deliberation", "[id].astro");
const endpoint = await readText(appRoot, "src", "pages", "data", "public-deliberation-adaptive-mandate.json.ts");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
const learningDetail = await readText(appRoot, "src", "pages", "evidence", "learning", "[id].astro");
check(indexPage.includes("data-deliberation-registry") && indexPage.includes("8 inactive standing registers") && indexPage.includes("0 participation records"), "The Phase 77 index is incomplete.");
check(detailPage.includes("Stakeholder Standing And Notice Register") && detailPage.includes("Participation does not establish consent"), "The Phase 77 detail template is incomplete.");
check(endpoint.includes("phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json") && endpoint.includes("public_deliberation_participatory_governance_adaptive_mandate"), "The Phase 77 public endpoint is incomplete.");
check(dataIndex.includes("Public Deliberation And Adaptive Mandate") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 77.");
check(sitemap.includes("deliberationRegistry") && sitemap.includes("/evidence/deliberation/"), "The sitemap omits Phase 77.");
check(learningDetail.includes("Phase 77 Destination") && learningDetail.includes("/evidence/deliberation/"), "The Phase 76 detail route omits its Phase 77 destination.");

check(manifest.expected_build.static_pages >= 4492 && manifest.expected_build.public_json_exports >= 24 && manifest.expected_build.phase_77_stakeholder_standing_notice_registers === 8 && manifest.expected_build.phase_77_deliberation_issue_response_dockets === 8 && manifest.expected_build.phase_77_mandate_legitimacy_appeal_registers === 8 && manifest.expected_build.phase_77_adaptive_mandate_review_ledgers === 8 && manifest.expected_build.phase_77_synthetic_cases === 1600, "The release manifest omits the Phase 77 baseline.");
check(manifest.stakeholder_standing_notice_routes?.length === 8 && manifest.deliberation_issue_response_routes?.length === 8 && manifest.mandate_legitimacy_appeal_routes?.length === 8 && manifest.adaptive_mandate_review_routes?.length === 8, "The release manifest omits Phase 77 routes.");

if (failures.length) {
  console.error("Phase 77 assertions failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Phase 77 assertions passed: 8 inactive standing-notice registers, 8 inactive deliberation-response dockets, 8 inactive mandate-appeal registers, 8 inactive adaptive-review ledgers, 16 standing gates, 18 deliberation gates, 16 mandate gates, 14 adaptive gates, 12 constituency classes, 12 issue classes, 12 quality dimensions, 10 appeal grounds, 12 adaptive triggers, 10 pathways, and 0 participation, consent, response, legitimacy, appeal, mandate, review, receipt, score, ranking, or stage changes.");
