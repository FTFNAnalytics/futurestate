import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };

const registry = await readJson(appRoot, "src", "data", "phase-76-cross-case-learning-portfolio-policy-retirement-registry.json");
const phase75 = await readJson(appRoot, "src", "data", "phase-75-decision-accountability-realized-impact-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const learning = registry.institutional_learning_dossiers;
const comparisons = registry.cross_case_transfer_registers;
const portfolios = registry.portfolio_governance_registers;
const policies = registry.policy_supersession_retirement_ledgers;

check(registry.phase === "76" && registry.schema_version === "1.0", "Phase 76 registry identity is incorrect.");
check(learning.length === 8, "Expected 8 institutional-learning dossiers.");
check(comparisons.length === 28, "Expected all 28 pairwise transfer registers.");
check(portfolios.length === 6, "Expected 6 portfolio-governance registers.");
check(policies.length === 8, "Expected 8 policy-retirement ledgers.");
check(registry.learning_admission_gates.length === 14, "Expected 14 learning-admission gates.");
check(registry.transfer_comparison_gates.length === 16, "Expected 16 transfer-comparison gates.");
check(registry.portfolio_governance_gates.length === 14, "Expected 14 portfolio-governance gates.");
check(registry.policy_lifecycle_gates.length === 14, "Expected 14 policy-lifecycle gates.");
check(registry.learning_retention_classes.length === 12, "Expected 12 learning-retention classes.");
check(registry.transfer_condition_classes.length === 12, "Expected 12 transfer-condition classes.");
check(registry.portfolio_risk_triggers.length === 12, "Expected 12 portfolio-risk triggers.");
check(registry.retirement_obligations.length === 10, "Expected 10 decommissioning obligations.");

const allRecords = [...learning, ...comparisons, ...portfolios, ...policies];
check(new Set(allRecords.map((record) => record.slug)).size === 50, "Phase 76 slugs must be unique.");
check(allRecords.every((record) => record.record_status === "Published" && record.phase64_cell_change === "none"), "Every Phase 76 record must be Published with no Phase 64 change.");

for (const record of learning) {
  check(record.learning_state === "Inactive - No Independently Audited Decision" && record.admission_decision === "Not Open", record.institutional_learning_dossier_id + " opened learning early.");
  check(record.learning_admission_checks.length === 14 && record.learning_admission_checks.every((item) => item.decision_state === "Inactive"), record.institutional_learning_dossier_id + " gate state is wrong.");
  check(record.retention_records.length === 12 && record.retention_records.every((item) => item.retention_state === "Empty" && item.record_ids.length === 0), record.institutional_learning_dossier_id + " retention classes are not empty.");
  check(record.cross_case_transfer_register_ids.length === 7, record.institutional_learning_dossier_id + " must bind the other seven cases exactly once.");
  check(record.audit_receipt_ids.length === 0 && record.learning_memo_id === null && record.bounded_lesson_records.length === 0 && record.non_transfer_finding_records.length === 0 && record.failure_and_negative_result_records.length === 0 && record.admission_receipt_id === null, record.institutional_learning_dossier_id + " contains invented learning evidence.");
  check(!record.automatic_learning_allowed && !record.automatic_transfer_allowed && !record.automatic_policy_reuse_allowed && !record.automatic_scoring_allowed && !record.automatic_ranking_allowed, record.institutional_learning_dossier_id + " enables an automatic decision.");
}

const pairKeys = new Set();
for (const record of comparisons) {
  const key = [record.left_institutional_learning_dossier_id, record.right_institutional_learning_dossier_id].sort().join("|");
  pairKeys.add(key);
  check(record.left_institutional_learning_dossier_id !== record.right_institutional_learning_dossier_id, record.cross_case_transfer_register_id + " compares a case with itself.");
  check(record.comparison_state === "Inactive - Fewer Than Two Independently Audited Decisions" && record.transfer_decision === "Not Open", record.cross_case_transfer_register_id + " opened comparison early.");
  check(record.comparison_checks.length === 16 && record.comparison_checks.every((item) => item.decision_state === "Inactive"), record.cross_case_transfer_register_id + " gate state is wrong.");
  check(record.transfer_condition_records.length === 12 && record.transfer_condition_records.every((item) => item.condition_state === "Not Assessable" && item.finding_ids.length === 0), record.cross_case_transfer_register_id + " transfer conditions are not empty.");
  check(record.eligible_decision_version_ids.length === 0 && record.transfer_condition_findings.length === 0 && record.non_transfer_findings.length === 0 && record.bounded_reuse_decision === null && record.comparison_receipt_id === null, record.cross_case_transfer_register_id + " contains an invented transfer finding.");
  check(!record.automatic_comparability_allowed && !record.automatic_transfer_allowed && !record.automatic_policy_reuse_allowed && !record.automatic_score_allowed && !record.automatic_rank_allowed, record.cross_case_transfer_register_id + " enables automatic transfer.");
}
check(pairKeys.size === 28, "Pairwise transfer records are duplicated or missing.");

const expectedMembers = [5, 6, 2, 3, 2, 6];
for (const [index, record] of portfolios.entries()) {
  const memberCount = expectedMembers[index];
  check(record.institutional_learning_dossier_ids.length === memberCount, record.portfolio_governance_register_id + " membership count is wrong.");
  check(record.cross_case_transfer_register_ids.length === memberCount * (memberCount - 1) / 2, record.portfolio_governance_register_id + " pairwise coverage is wrong.");
  check(record.portfolio_state === "Inactive - No Admitted Cross-Case Evidence" && record.governance_decision === "Not Open", record.portfolio_governance_register_id + " opened governance early.");
  check(record.portfolio_checks.length === 14 && record.portfolio_checks.every((item) => item.decision_state === "Inactive"), record.portfolio_governance_register_id + " gate state is wrong.");
  check(record.portfolio_risk_trigger_records.length === 12 && record.portfolio_risk_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids.length === 0), record.portfolio_governance_register_id + " risk triggers are not dormant.");
  check(record.shared_dependency_records.length === 0 && record.concentration_findings.length === 0 && record.cumulative_burden_findings.length === 0 && record.distributional_findings.length === 0 && record.governance_decision_record === null && record.governance_receipt_id === null, record.portfolio_governance_register_id + " contains an invented portfolio conclusion.");
  check(!record.automatic_portfolio_membership_allowed && !record.automatic_resource_reallocation_allowed && !record.automatic_rebalance_allowed && !record.automatic_score_allowed && !record.automatic_rank_allowed, record.portfolio_governance_register_id + " enables automatic governance.");
}

for (const record of policies) {
  check(record.lifecycle_state === "Inactive - No Authorized Policy Or Retirement Decision" && record.retirement_decision === "Not Open", record.policy_supersession_retirement_ledger_id + " opened a policy lifecycle early.");
  check(record.lifecycle_checks.length === 14 && record.lifecycle_checks.every((item) => item.decision_state === "Inactive"), record.policy_supersession_retirement_ledger_id + " lifecycle gates are wrong.");
  check(record.decommissioning_obligation_records.length === 10 && record.decommissioning_obligation_records.every((item) => item.obligation_state === "Unavailable" && item.evidence_ids.length === 0 && item.receipt_id === null), record.policy_supersession_retirement_ledger_id + " decommissioning duties are not empty.");
  check(record.policy_record_id === null && record.successor_policy_id === null && record.supersession_decision_id === null && record.transition_plan_id === null && record.decommissioning_plan_id === null && record.residual_obligation_records.length === 0 && record.unresolved_harm_records.length === 0 && record.retirement_receipt_id === null, record.policy_supersession_retirement_ledger_id + " contains an invented policy action.");
  check(!record.silent_renewal_allowed && !record.automatic_supersession_allowed && !record.automatic_retirement_allowed && !record.automatic_archive_deletion_allowed && !record.automatic_score_allowed && !record.automatic_rank_allowed, record.policy_supersession_retirement_ledger_id + " enables automatic lifecycle action.");
}

const zeroMetrics = ["independently_audited_decisions_received", "learning_dossiers_admitted", "institutional_learning_memos_published", "negative_or_failure_records_admitted", "pairwise_comparisons_opened", "comparable_pairs_adjudicated", "transfer_findings_published", "non_transfer_findings_published", "bounded_reuse_decisions_issued", "portfolio_findings_published", "shared_dependencies_adjudicated", "concentration_findings_adjudicated", "cumulative_burden_findings_adjudicated", "portfolio_rebalance_decisions_issued", "policy_supersessions_issued", "policy_retirements_issued", "decommissioning_plans_activated", "decommissioning_obligations_closed", "unresolved_harms_erased", "archives_deleted", "receipts_created", "scores_created", "rankings_created", "phase64_cells_advanced"];
check(zeroMetrics.every((key) => registry.metrics[key] === 0), "A Phase 76 outcome metric is non-zero.");
check(phase75.metrics.counterfactual_decision_audits_completed === 0 && phase75.metrics.authorized_decisions_received === 0 && phase75.metrics.receipts_created === 0, "Phase 75 prerequisites changed unexpectedly.");

const guideIds = ["briefing-cross-case-infrastructure-delivery-001", "briefing-cross-case-public-authority-001", "briefing-cross-case-regulated-autonomy-001", "briefing-cross-case-industrial-capacity-001", "briefing-cross-case-digital-assurance-001", "briefing-cross-case-local-system-burden-001", "briefing-institutional-memory-negative-results-001", "briefing-policy-retirement-decommissioning-001"];
const guideFiles = guideIds.map((id) => id + ".mdx");
for (const file of guideFiles) {
  const body = await readFile(join(appRoot, "src", "content", "briefings", file), "utf8");
  check(body.includes('record_status: "Published"'), file + " is not Published.");
  check(body.includes("## ") && body.length > 2500, file + " is not a substantive guide.");
}

const mapFiles = ["audited-decision-is-not-transferable-policy.json", "portfolio-benefit-is-not-shared-benefit.json", "supersession-is-not-retirement-or-erasure.json"];
const mapIds = [];
for (const file of mapFiles) {
  const map = await readJson(appRoot, "src", "content", "dependency-maps", file);
  mapIds.push(map.id);
  check(map.record_status === "Published" && map.nodes.length >= 8 && map.links.length >= 7, file + " is incomplete.");
  check(map.what_this_map_does_not_prove.length >= 3 && map.next_records_needed.length >= 3, file + " lacks boundaries.");
}

const pathwayIds = [...new Set(learning.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Expected 10 Phase 76 pathway integrations.");
for (const pathwayId of pathwayIds) {
  const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  check(guideIds.every((id) => pathway.briefing_ids.includes(id)), pathwayId + " is missing a Phase 76 guide.");
  check(mapIds.every((id) => pathway.dependency_map_ids.includes(id)), pathwayId + " is missing a Phase 76 map.");
}

for (const record of learning) {
  const body = await readFile(join(appRoot, "src", "content", "briefings", record.canonical_briefing_id + ".mdx"), "utf8");
  check(body.includes("## Phase 76 institutional learning and policy-retirement boundary"), record.canonical_briefing_id + " lacks its Phase 76 section.");
}
for (const filename of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) {
  const body = await readFile(join(appRoot, "src", "content", "local-systems", filename), "utf8");
  check(body.includes("## Phase 76 cross-case and cumulative-burden boundary"), filename + " lacks its Phase 76 boundary.");
}
for (const filename of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-implementation-commitment-ledger-001.mdx", "briefing-realized-impact-audit-001.mdx", "briefing-reversal-remediation-desk-001.mdx", "briefing-evidence-synthesis-desk-001.mdx", "briefing-outcome-claim-comparison-protocol-001.mdx", "briefing-conversion-stage-matrix-001.mdx"]) {
  const body = await readFile(join(appRoot, "src", "content", "briefings", filename), "utf8");
  check(body.includes("## Phase 76 cross-case learning, portfolio, and retirement control"), filename + " lacks its Phase 76 integration.");
}

const indexSource = await readFile(join(appRoot, "src", "pages", "evidence", "learning", "index.astro"), "utf8");
const detailSource = await readFile(join(appRoot, "src", "pages", "evidence", "learning", "[id].astro"), "utf8");
const exportSource = await readFile(join(appRoot, "src", "pages", "data", "cross-case-learning-portfolio-policy-retirement.json.ts"), "utf8");
const dataIndex = await readFile(join(appRoot, "src", "pages", "data", "index.astro"), "utf8");
const sitemap = await readFile(join(appRoot, "src", "pages", "sitemap.xml.ts"), "utf8");
const phase75Detail = await readFile(join(appRoot, "src", "pages", "evidence", "accountability", "[id].astro"), "utf8");
check(indexSource.includes("data-learning-registry") && indexSource.includes("All twenty-eight possible case pairs"), "Phase 76 index contract is missing.");
check(detailSource.includes("Fourteen gates remain Inactive") && detailSource.includes("Sixteen gates remain Inactive") && detailSource.includes("Ten obligations remain Unavailable"), "Phase 76 detail templates are incomplete.");
check(exportSource.includes('dataset: "cross_case_learning_portfolio_policy_retirement"'), "Phase 76 export contract is missing.");
check(dataIndex.includes("bounded public contracts") && dataIndex.includes("Cross-Case Learning, Portfolios And Policy Retirement"), "Data index is not updated for Phase 76.");
check(sitemap.includes('"/evidence/learning/"') && sitemap.includes("learningRegistry.cross_case_transfer_registers"), "Sitemap omits Phase 76 routes.");
check(phase75Detail.includes("Phase 76 Destination"), "Phase 75 detail pages lack the Phase 76 destination.");
check(await exists(appRoot, "src", "content", "updates", "2026-08-24-phase-76-cross-case-learning-portfolio-retirement.json"), "Phase 76 update is missing.");

check(manifest.expected_build.static_pages >= 4445 && manifest.expected_build.public_json_exports >= 23, "Manifest build or export count is below the Phase 76 baseline.");
check(manifest.expected_build.published_briefings >= 145 && manifest.expected_build.published_dependency_maps >= 24 && manifest.expected_build.updates >= 101, "Manifest content counts are below the Phase 76 baseline.");
check(manifest.expected_build.phase_76_synthetic_cases === 1400, "Manifest synthetic-case count is stale.");
check(manifest.institutional_learning_routes.length === 8 && manifest.cross_case_transfer_routes.length === 28 && manifest.portfolio_governance_routes.length === 6 && manifest.policy_supersession_retirement_routes.length === 8, "Manifest Phase 76 route arrays are incomplete.");

if (failures.length) {
  console.error("Phase 76 assertions failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log("Phase 76 assertions passed: 8 inactive institutional-learning dossiers, 28 inactive pairwise transfer registers, 6 inactive portfolio-governance registers, 8 inactive policy-retirement ledgers, 14 learning gates, 16 transfer gates, 14 portfolio gates, 14 policy-lifecycle gates, 12 retention classes, 12 transfer-condition classes, 12 portfolio-risk triggers, 10 decommissioning obligations, 10 pathways, and 0 audited decisions, lessons, comparisons, transfer findings, portfolio conclusions, supersessions, retirements, decommissioning closures, archive deletions, receipts, scores, rankings, or stage changes.");
