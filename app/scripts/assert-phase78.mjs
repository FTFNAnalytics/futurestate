import { readFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readText = async (...parts) => readFile(join(...parts), "utf8");
const readJson = async (...parts) => JSON.parse(await readText(...parts));
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const isEmpty = (value) => Array.isArray(value) ? value.length === 0 : value && typeof value === "object" ? Object.keys(value).length === 0 : value === null || value === "";

const registry = await readJson(appRoot, "src", "data", "phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json");
const phase77 = await readJson(appRoot, "src", "data", "phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const authority = registry.interjurisdictional_authority_externality_maps;
const compacts = registry.shared_public_value_contribution_compacts;
const continuity = registry.mutual_aid_continuity_dispute_registers;
const emergencies = registry.emergency_authority_normalization_ledgers;

check(registry.phase === "78" && registry.schema_version === "1.0", "Phase 78 registry identity is invalid.");
check(authority.length === 8 && compacts.length === 8 && continuity.length === 8 && emergencies.length === 8, "Phase 78 record-family counts are invalid.");
check(registry.authority_externality_gates.length === 16 && registry.compact_contribution_gates.length === 18 && registry.continuity_dispute_gates.length === 16 && registry.emergency_normalization_gates.length === 18, "Phase 78 gate counts are invalid.");
for (const [name, expected] of [["jurisdiction_classes", 12], ["externality_classes", 12], ["public_value_classes", 12], ["contribution_classes", 12], ["continuity_obligations", 12], ["dispute_grounds", 10], ["emergency_safeguards", 12], ["restoration_triggers", 12]]) check(registry[name].length === expected, `Phase 78 ${name} count is invalid.`);

const ids = [...authority.map((record) => record.interjurisdictional_authority_externality_map_id), ...compacts.map((record) => record.shared_public_value_contribution_compact_id), ...continuity.map((record) => record.mutual_aid_continuity_dispute_register_id), ...emergencies.map((record) => record.emergency_authority_normalization_ledger_id)];
check(new Set(ids).size === 32, "Phase 78 record IDs are not unique.");
check(new Set([...authority, ...compacts, ...continuity, ...emergencies].map((record) => record.slug)).size === 32, "Phase 78 slugs are not unique.");
check(new Set(authority.map((record) => record.adaptive_mandate_review_ledger_id)).size === 8, "Phase 77 mandate ledgers do not map one-to-one to Phase 78 authority maps.");
check(authority.every((record) => phase77.adaptive_mandate_review_ledgers.some((item) => item.adaptive_mandate_review_ledger_id === record.adaptive_mandate_review_ledger_id && item.cohort_id === record.cohort_id)), "A Phase 78 authority map lacks its exact Phase 77 predecessor.");

authority.forEach((record) => {
  check(record.mapping_state === "Inactive - No Authorized Public Mandate" && record.opening_decision === "Not Open", `${record.interjurisdictional_authority_externality_map_id} is not inactive.`);
  check(record.authority_externality_checks.length === 16 && record.authority_externality_checks.every((item) => item.decision_state === "Inactive"), `${record.interjurisdictional_authority_externality_map_id} has an active gate.`);
  check(record.jurisdiction_assignment_records.length === 12 && record.jurisdiction_assignment_records.every((item) => item.assignment_state === "Unmapped" && isEmpty(item.authority_ids) && isEmpty(item.duty_ids) && isEmpty(item.dispute_ids)), `${record.interjurisdictional_authority_externality_map_id} contains a jurisdiction assignment.`);
  check(record.externality_records.length === 12 && record.externality_records.every((item) => item.assessment_state === "Unassessed" && isEmpty(item.origin_ids) && isEmpty(item.destination_ids) && isEmpty(item.evidence_ids) && item.finding_id === null), `${record.interjurisdictional_authority_externality_map_id} contains an externality finding.`);
  for (const field of ["authorized_public_mandate_ids", "authority_inventory_records", "treaty_and_rights_records", "shared_asset_and_flow_records", "standing_refresh_records", "alternative_scenario_records", "jurisdiction_conflict_records"]) check(isEmpty(record[field]), `${record.interjurisdictional_authority_externality_map_id} contains premature ${field}.`);
  for (const field of ["joint_authority_question", "geography_and_population_record", "common_evidence_record_id", "first_reviewer_id", "second_reviewer_id", "mapping_receipt_id"]) check(record[field] === null, `${record.interjurisdictional_authority_externality_map_id} contains premature ${field}.`);
  check(record.automatic_authority_assignment_allowed === false && record.automatic_externality_finding_allowed === false && record.automatic_forum_selection_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.interjurisdictional_authority_externality_map_id} violates an automation boundary.`);
});

compacts.forEach((record, index) => {
  check(record.compact_state === "Inactive - No Admitted Joint-Authority Question" && record.compact_decision === "Not Open", `${record.shared_public_value_contribution_compact_id} is not inactive.`);
  check(record.interjurisdictional_authority_externality_map_id === authority[index].interjurisdictional_authority_externality_map_id, `${record.shared_public_value_contribution_compact_id} lacks its authority map.`);
  check(record.compact_contribution_checks.length === 18 && record.compact_contribution_checks.every((item) => item.decision_state === "Inactive"), `${record.shared_public_value_contribution_compact_id} has an active gate.`);
  check(record.public_value_records.length === 12 && record.public_value_records.every((item) => item.value_state === "Not Valued" && isEmpty(item.beneficiary_ids) && isEmpty(item.indicator_ids) && item.allocation_finding_id === null), `${record.shared_public_value_contribution_compact_id} contains a value allocation.`);
  check(record.contribution_records.length === 12 && record.contribution_records.every((item) => item.contribution_state === "Uncommitted" && isEmpty(item.contributor_ids) && isEmpty(item.amount_or_capacity_records) && isEmpty(item.condition_ids)), `${record.shared_public_value_contribution_compact_id} contains a contribution.`);
  for (const field of ["authorized_party_records", "non_party_and_affected_public_records", "rights_and_treaty_terms", "benefit_burden_allocation_records", "fiscal_commitment_records", "capacity_commitment_records", "baseline_and_indicator_records", "transparency_and_audit_terms", "safeguard_records", "compact_authorization_records"]) check(isEmpty(record[field]), `${record.shared_public_value_contribution_compact_id} contains premature ${field}.`);
  for (const field of ["compact_purpose_record", "joint_governance_terms", "dispute_resolution_terms", "amendment_withdrawal_termination_terms", "independent_review_record", "executed_compact_id", "compact_receipt_id"]) check(record[field] === null, `${record.shared_public_value_contribution_compact_id} contains premature ${field}.`);
  check(record.contribution_as_control_allowed === false && record.automatic_value_allocation_allowed === false && record.automatic_compact_authorization_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.shared_public_value_contribution_compact_id} violates an automation boundary.`);
});

continuity.forEach((record, index) => {
  check(record.continuity_state === "Inactive - No Executed Compact" && record.operating_decision === "Not Open", `${record.mutual_aid_continuity_dispute_register_id} is not inactive.`);
  check(record.shared_public_value_contribution_compact_id === compacts[index].shared_public_value_contribution_compact_id, `${record.mutual_aid_continuity_dispute_register_id} lacks its compact.`);
  check(record.continuity_dispute_checks.length === 16 && record.continuity_dispute_checks.every((item) => item.decision_state === "Inactive"), `${record.mutual_aid_continuity_dispute_register_id} has an active gate.`);
  check(record.continuity_obligation_records.length === 12 && record.continuity_obligation_records.every((item) => item.obligation_state === "Dormant" && isEmpty(item.owner_ids) && isEmpty(item.resource_ids) && isEmpty(item.activation_ids) && item.closure_id === null), `${record.mutual_aid_continuity_dispute_register_id} contains an active continuity obligation.`);
  check(record.dispute_ground_records.length === 10 && record.dispute_ground_records.every((item) => item.ground_state === "Unavailable" && isEmpty(item.dispute_ids) && isEmpty(item.decision_ids) && isEmpty(item.remedy_ids)), `${record.mutual_aid_continuity_dispute_register_id} contains a dispute.`);
  for (const field of ["critical_service_records", "resource_inventory_records", "mutual_aid_request_records", "command_and_coordination_records", "interoperability_records", "rights_and_access_safeguard_records", "cost_reimbursement_liability_records", "scarcity_and_priority_records", "common_operating_picture_records", "dispute_records", "interim_measure_records", "remedy_records", "demobilization_and_handback_records"]) check(isEmpty(record[field]), `${record.mutual_aid_continuity_dispute_register_id} contains premature ${field}.`);
  for (const field of ["executed_compact_id", "after_action_review_record", "first_reviewer_id", "second_reviewer_id", "continuity_receipt_id"]) check(record[field] === null, `${record.mutual_aid_continuity_dispute_register_id} contains premature ${field}.`);
  check(record.automatic_mutual_aid_activation_allowed === false && record.automatic_priority_allocation_allowed === false && record.automatic_dispute_disposition_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.mutual_aid_continuity_dispute_register_id} violates an automation boundary.`);
});

emergencies.forEach((record, index) => {
  check(record.emergency_state === "Inactive - No Lawfully Activated Emergency Authority" && record.emergency_decision === "Not Open", `${record.emergency_authority_normalization_ledger_id} is not inactive.`);
  check(record.mutual_aid_continuity_dispute_register_id === continuity[index].mutual_aid_continuity_dispute_register_id, `${record.emergency_authority_normalization_ledger_id} lacks its continuity register.`);
  check(record.emergency_normalization_checks.length === 18 && record.emergency_normalization_checks.every((item) => item.decision_state === "Inactive"), `${record.emergency_authority_normalization_ledger_id} has an active gate.`);
  check(record.emergency_safeguard_records.length === 12 && record.emergency_safeguard_records.every((item) => item.safeguard_state === "Inactive" && isEmpty(item.evidence_ids) && isEmpty(item.breach_ids) && isEmpty(item.remedy_ids)), `${record.emergency_authority_normalization_ledger_id} contains an active safeguard.`);
  check(record.restoration_trigger_records.length === 12 && record.restoration_trigger_records.every((item) => item.trigger_state === "Dormant" && isEmpty(item.event_ids) && item.review_id === null && item.decision_id === null), `${record.emergency_authority_normalization_ledger_id} contains an active restoration trigger.`);
  for (const field of ["qualifying_emergency_evidence_records", "rights_and_treaty_safeguard_records", "oversight_records", "continuity_activation_records", "crisis_evidence_and_communication_records", "emergency_data_records", "emergency_procurement_and_fiscal_records", "harm_complaint_and_remedy_records", "challenge_and_appeal_records", "restoration_records"]) check(isEmpty(record[field]), `${record.emergency_authority_normalization_ledger_id} contains premature ${field}.`);
  for (const field of ["lawful_authority_record", "activation_decision_record", "necessity_and_proportionality_record", "emergency_scope_record", "activation_date", "expiry_date", "after_action_accountability_record", "democratic_reauthorization_record", "first_reviewer_id", "second_reviewer_id", "normalization_receipt_id"]) check(record[field] === null, `${record.emergency_authority_normalization_ledger_id} contains premature ${field}.`);
  check(record.silent_emergency_extension_allowed === false && record.compact_authority_laundering_allowed === false && record.automatic_rights_suspension_allowed === false && record.automatic_reauthorization_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.emergency_authority_normalization_ledger_id} violates an automation boundary.`);
});

for (const [key, value] of Object.entries(registry.metrics)) {
  if (["interjurisdictional_authority_externality_maps", "shared_public_value_contribution_compacts", "mutual_aid_continuity_dispute_registers", "emergency_authority_normalization_ledgers", "authority_externality_gates", "compact_contribution_gates", "continuity_dispute_gates", "emergency_normalization_gates", "jurisdiction_classes", "externality_classes", "public_value_classes", "contribution_classes", "continuity_obligations", "dispute_grounds", "emergency_safeguards", "restoration_triggers"].includes(key)) continue;
  check(value === 0, `Phase 78 metric ${key} must remain zero.`);
}

const guideIds = ["briefing-cooperative-federalism-municipal-authority-001", "briefing-indigenous-treaty-intergovernmental-compacts-001", "briefing-cross-border-infrastructure-externalities-001", "briefing-shared-public-value-allocation-001", "briefing-fiscal-capacity-contribution-sharing-001", "briefing-mutual-aid-service-continuity-001", "briefing-intergovernmental-dispute-resolution-001", "briefing-emergency-powers-civil-safeguards-001", "briefing-crisis-evidence-public-communication-001", "briefing-emergency-authority-normalization-001"];
const mapIds = ["dependency-map-one-public-mandate-is-not-a-multi-authority-compact", "dependency-map-local-benefit-is-not-shared-public-value", "dependency-map-fiscal-contribution-is-not-governing-control", "dependency-map-emergency-activation-is-not-permanent-authority", "dependency-map-service-continuity-is-not-rights-suspension"];
for (const guideId of guideIds) {
  const content = await readText(appRoot, "src", "content", "briefings", guideId + ".mdx");
  check(content.includes('record_status: "Published"') && content.length > 7000 && content.includes("## Bound emergency authority") && content.includes("## Public contract"), `${guideId} is missing or too thin.`);
}
for (const mapId of mapIds) {
  const map = await readJson(appRoot, "src", "content", "dependency-maps", mapId.replace("dependency-map-", "") + ".json");
  check(map.id === mapId && map.record_status === "Published" && map.nodes.length === 7 && map.links.length === 6 && map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("score")), `${mapId} is incomplete.`);
}

const pathwayIds = [...new Set(authority.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, `Expected 10 integrated pathways, found ${pathwayIds.length}.`);
for (const pathwayId of pathwayIds) {
  const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits a Phase 78 guide or map.`);
}
for (const record of authority) {
  const briefing = await readText(appRoot, "src", "content", "briefings", record.canonical_briefing_id + ".mdx");
  check(briefing.includes("## Phase 78 interjurisdictional-compact and emergency-resilience boundary"), `${record.canonical_briefing_id} omits its Phase 78 boundary.`);
}
for (const filename of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) {
  const body = await readText(appRoot, "src", "content", "local-systems", filename);
  check(body.includes("## Phase 78 compact, continuity, and emergency boundary"), `${filename} omits its Phase 78 boundary.`);
}
for (const filename of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-implementation-commitment-ledger-001.mdx", "briefing-realized-impact-audit-001.mdx", "briefing-reversal-remediation-desk-001.mdx", "briefing-evidence-synthesis-desk-001.mdx", "briefing-institutional-memory-negative-results-001.mdx", "briefing-policy-retirement-decommissioning-001.mdx"]) {
  const body = await readText(appRoot, "src", "content", "briefings", filename);
  check(body.includes("## Phase 78 compact, continuity, and emergency-resilience control"), `${filename} omits its Phase 78 operating boundary.`);
}

const indexPage = await readText(appRoot, "src", "pages", "evidence", "compacts", "index.astro");
const detailPage = await readText(appRoot, "src", "pages", "evidence", "compacts", "[id].astro");
const endpoint = await readText(appRoot, "src", "pages", "data", "interjurisdictional-compacts-emergency-resilience.json.ts");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
const deliberationDetail = await readText(appRoot, "src", "pages", "evidence", "deliberation", "[id].astro");
check(indexPage.includes("data-compacts-registry") && indexPage.includes("8 inactive authority maps") && indexPage.includes("0 compact records"), "The Phase 78 index is incomplete.");
check(detailPage.includes("Interjurisdictional Authority And Externality Map") && detailPage.includes("A public mandate is not a compact"), "The Phase 78 detail template is incomplete.");
check(endpoint.includes("phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json") && endpoint.includes("interjurisdictional_compacts_shared_public_value_emergency_resilience"), "The Phase 78 public endpoint is incomplete.");
check(dataIndex.includes("Interjurisdictional Compacts And Emergency Resilience") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 78.");
check(sitemap.includes("compactsRegistry") && sitemap.includes("/evidence/compacts/"), "The sitemap omits Phase 78.");
check(deliberationDetail.includes("Phase 78 Destination") && deliberationDetail.includes("/evidence/compacts/"), "The Phase 77 detail route omits its Phase 78 destination.");
check(await exists(appRoot, "src", "content", "updates", "2026-08-24-phase-78-interjurisdictional-compacts-emergency-resilience.json"), "The Phase 78 update is missing.");

check(manifest.expected_build.static_pages >= 4540 && manifest.expected_build.public_json_exports >= 25 && manifest.expected_build.phase_78_interjurisdictional_authority_externality_maps === 8 && manifest.expected_build.phase_78_shared_public_value_contribution_compacts === 8 && manifest.expected_build.phase_78_mutual_aid_continuity_dispute_registers === 8 && manifest.expected_build.phase_78_emergency_authority_normalization_ledgers === 8 && manifest.expected_build.phase_78_synthetic_cases === 2048, "The release manifest omits Phase 78 counts.");
check(manifest.interjurisdictional_authority_externality_routes?.length === 8 && manifest.shared_public_value_contribution_routes?.length === 8 && manifest.mutual_aid_continuity_dispute_routes?.length === 8 && manifest.emergency_authority_normalization_routes?.length === 8, "The release manifest omits Phase 78 routes.");

if (failures.length) {
  console.error("Phase 78 assertions failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Phase 78 assertions passed: 8 inactive authority-externality maps, 8 inactive shared-value contribution compacts, 8 inactive continuity-dispute registers, 8 inactive emergency-normalization ledgers, 16 authority gates, 18 compact gates, 16 continuity gates, 18 emergency gates, 12 jurisdiction classes, 12 externality classes, 12 public-value classes, 12 contribution classes, 12 continuity obligations, 10 dispute grounds, 12 safeguards, 12 restoration triggers, 10 pathways, and 0 compact, contribution, activation, emergency, normalization, reauthorization, receipt, score, ranking, or stage changes.");
