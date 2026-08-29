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

const registry = await readJson(appRoot, "src", "data", "phase-79-public-wealth-long-horizon-stewardship-intergenerational-balance-sheet-registry.json");
const phase78 = await readJson(appRoot, "src", "data", "phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const assets = registry.public_asset_obligation_registers;
const lifecycles = registry.lifecycle_cost_maintenance_ledgers;
const procurement = registry.procurement_dependency_contingent_risk_registers;
const balances = registry.intergenerational_balance_sheet_stewardship_ledgers;

check(registry.phase === "79" && registry.schema_version === "1.0", "Phase 79 registry identity is invalid.");
check(assets.length === 8 && lifecycles.length === 8 && procurement.length === 8 && balances.length === 8, "Phase 79 record-family counts are invalid.");
check(registry.asset_obligation_gates.length === 18 && registry.lifecycle_maintenance_gates.length === 18 && registry.procurement_risk_gates.length === 20 && registry.intergenerational_stewardship_gates.length === 20, "Phase 79 gate counts are invalid.");
for (const [name, expected] of [["asset_classes", 14], ["obligation_classes", 14], ["lifecycle_stages", 12], ["maintenance_duties", 12], ["dependency_classes", 12], ["liability_classes", 14], ["insurance_limits", 10], ["distribution_accounts", 12], ["future_user_tests", 12], ["fiscal_stress_triggers", 12], ["stewardship_duties", 12]]) check(registry[name].length === expected, `Phase 79 ${name} count is invalid.`);

const ids = [...assets.map((record) => record.public_asset_obligation_register_id), ...lifecycles.map((record) => record.lifecycle_cost_maintenance_ledger_id), ...procurement.map((record) => record.procurement_dependency_contingent_risk_register_id), ...balances.map((record) => record.intergenerational_balance_sheet_stewardship_ledger_id)];
check(new Set(ids).size === 32, "Phase 79 record IDs are not unique.");
check(new Set([...assets, ...lifecycles, ...procurement, ...balances].map((record) => record.slug)).size === 32, "Phase 79 slugs are not unique.");
check(new Set(assets.map((record) => record.emergency_authority_normalization_ledger_id)).size === 8, "Phase 78 emergency ledgers do not map one-to-one to Phase 79 asset registers.");
check(assets.every((record) => phase78.emergency_authority_normalization_ledgers.some((item) => item.emergency_authority_normalization_ledger_id === record.emergency_authority_normalization_ledger_id && item.cohort_id === record.cohort_id)), "A Phase 79 asset register lacks its exact Phase 78 predecessor.");

assets.forEach((record) => {
  check(record.register_state === "Inactive - No Executed Phase 78 Compact" && record.admission_decision === "Not Open", `${record.public_asset_obligation_register_id} is not inactive.`);
  check(record.asset_obligation_checks.length === 18 && record.asset_obligation_checks.every((item) => item.decision_state === "Inactive"), `${record.public_asset_obligation_register_id} has an active gate.`);
  check(record.asset_class_records.length === 14 && record.asset_class_records.every((item) => item.asset_state === "Unregistered" && isEmpty(item.asset_ids) && isEmpty(item.value_records) && isEmpty(item.restriction_ids)), `${record.public_asset_obligation_register_id} contains an admitted asset.`);
  check(record.obligation_class_records.length === 14 && record.obligation_class_records.every((item) => item.obligation_state === "Unregistered" && isEmpty(item.obligation_ids) && isEmpty(item.owner_ids) && isEmpty(item.funding_records)), `${record.public_asset_obligation_register_id} contains a recognized obligation.`);
  for (const field of ["executed_phase78_compact_ids", "authority_records", "asset_records", "beneficial_ownership_records", "control_right_records", "condition_and_capability_records", "nonmarket_value_records", "restriction_and_encumbrance_records", "obligation_records", "counterparty_records", "distribution_records", "future_user_records"]) check(isEmpty(record[field]), `${record.public_asset_obligation_register_id} contains premature ${field}.`);
  for (const field of ["valuation_method_record", "first_reviewer_id", "second_reviewer_id", "register_receipt_id"]) check(record[field] === null, `${record.public_asset_obligation_register_id} contains premature ${field}.`);
  check(record.market_value_as_public_value_allowed === false && record.asset_as_authority_allowed === false && record.automatic_valuation_allowed === false && record.automatic_obligation_recognition_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.public_asset_obligation_register_id} violates an automation boundary.`);
});

lifecycles.forEach((record, index) => {
  check(record.lifecycle_state === "Inactive - No Admitted Public Asset Or Obligation" && record.planning_decision === "Not Open", `${record.lifecycle_cost_maintenance_ledger_id} is not inactive.`);
  check(record.public_asset_obligation_register_id === assets[index].public_asset_obligation_register_id, `${record.lifecycle_cost_maintenance_ledger_id} lacks its asset register.`);
  check(record.lifecycle_maintenance_checks.length === 18 && record.lifecycle_maintenance_checks.every((item) => item.decision_state === "Inactive"), `${record.lifecycle_cost_maintenance_ledger_id} has an active gate.`);
  check(record.lifecycle_stage_records.length === 12 && record.lifecycle_stage_records.every((item) => item.stage_state === "Unplanned" && isEmpty(item.cost_records) && isEmpty(item.evidence_ids) && item.decision_id === null), `${record.lifecycle_cost_maintenance_ledger_id} contains a lifecycle plan.`);
  check(record.maintenance_duty_records.length === 12 && record.maintenance_duty_records.every((item) => item.duty_state === "Unfunded" && isEmpty(item.owner_ids) && isEmpty(item.schedule_records) && isEmpty(item.backlog_records)), `${record.lifecycle_cost_maintenance_ledger_id} contains a funded maintenance duty.`);
  for (const field of ["alternative_records", "capital_cost_records", "operating_cost_records", "maintenance_plan_records", "renewal_plan_records", "resilience_cost_records", "externality_cost_records", "decommissioning_cost_records", "restoration_cost_records", "scenario_records", "variance_trigger_records"]) check(isEmpty(record[field]), `${record.lifecycle_cost_maintenance_ledger_id} contains premature ${field}.`);
  for (const field of ["public_need_record", "no_action_baseline_record", "design_life_record", "affordability_and_funding_record", "first_reviewer_id", "second_reviewer_id", "lifecycle_receipt_id"]) check(record[field] === null, `${record.lifecycle_cost_maintenance_ledger_id} contains premature ${field}.`);
  check(record.capital_cost_as_lifecycle_cost_allowed === false && record.deferred_maintenance_as_savings_allowed === false && record.automatic_discount_rate_allowed === false && record.automatic_affordability_finding_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.lifecycle_cost_maintenance_ledger_id} violates an automation boundary.`);
});

procurement.forEach((record, index) => {
  check(record.procurement_risk_state === "Inactive - No Authorized Lifecycle Plan" && record.commitment_decision === "Not Open", `${record.procurement_dependency_contingent_risk_register_id} is not inactive.`);
  check(record.lifecycle_cost_maintenance_ledger_id === lifecycles[index].lifecycle_cost_maintenance_ledger_id, `${record.procurement_dependency_contingent_risk_register_id} lacks its lifecycle ledger.`);
  check(record.procurement_risk_checks.length === 20 && record.procurement_risk_checks.every((item) => item.decision_state === "Inactive"), `${record.procurement_dependency_contingent_risk_register_id} has an active gate.`);
  check(record.dependency_class_records.length === 12 && record.dependency_class_records.every((item) => item.dependency_state === "Unassessed" && isEmpty(item.vendor_ids) && isEmpty(item.exposure_records) && isEmpty(item.mitigation_ids)), `${record.procurement_dependency_contingent_risk_register_id} contains a dependency finding.`);
  check(record.liability_class_records.length === 14 && record.liability_class_records.every((item) => item.liability_state === "Unrecognized" && isEmpty(item.obligation_ids) && isEmpty(item.exposure_records) && isEmpty(item.funding_ids)), `${record.procurement_dependency_contingent_risk_register_id} contains a liability.`);
  check(record.insurance_limit_records.length === 10 && record.insurance_limit_records.every((item) => item.limit_state === "Unassessed" && isEmpty(item.policy_ids) && isEmpty(item.exposure_ids) && item.gap_finding_id === null), `${record.procurement_dependency_contingent_risk_register_id} contains an insurance finding.`);
  for (const field of ["public_option_and_alternative_records", "market_capacity_records", "vendor_identity_records", "supply_dependency_records", "lock_in_and_exit_records", "public_data_ip_records", "public_capacity_records", "pricing_records", "debt_records", "guarantee_and_indemnity_records", "contingent_liability_records", "insurance_records", "uninsurable_risk_records", "performance_and_remedy_records", "integrity_and_conflict_records", "failure_and_continuity_records"]) check(isEmpty(record[field]), `${record.procurement_dependency_contingent_risk_register_id} contains premature ${field}.`);
  for (const field of ["authorized_procurement_need_record", "first_reviewer_id", "second_reviewer_id", "procurement_risk_receipt_id"]) check(record[field] === null, `${record.procurement_dependency_contingent_risk_register_id} contains premature ${field}.`);
  check(record.procurement_as_public_value_allowed === false && record.insurance_as_risk_elimination_allowed === false && record.contribution_as_control_allowed === false && record.automatic_vendor_selection_allowed === false && record.automatic_liability_recognition_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.procurement_dependency_contingent_risk_register_id} violates an automation boundary.`);
});

balances.forEach((record, index) => {
  check(record.balance_sheet_state === "Inactive - No Verified Public Wealth Inputs" && record.stewardship_decision === "Not Open", `${record.intergenerational_balance_sheet_stewardship_ledger_id} is not inactive.`);
  check(record.procurement_dependency_contingent_risk_register_id === procurement[index].procurement_dependency_contingent_risk_register_id, `${record.intergenerational_balance_sheet_stewardship_ledger_id} lacks its procurement-risk register.`);
  check(record.intergenerational_stewardship_checks.length === 20 && record.intergenerational_stewardship_checks.every((item) => item.decision_state === "Inactive"), `${record.intergenerational_balance_sheet_stewardship_ledger_id} has an active gate.`);
  check(record.distribution_account_records.length === 12 && record.distribution_account_records.every((item) => item.account_state === "Unmeasured" && isEmpty(item.benefit_records) && isEmpty(item.burden_records) && isEmpty(item.remedy_ids)), `${record.intergenerational_balance_sheet_stewardship_ledger_id} contains a distributional finding.`);
  check(record.future_user_test_records.length === 12 && record.future_user_test_records.every((item) => item.test_state === "Not Tested" && isEmpty(item.evidence_ids) && item.finding_id === null && isEmpty(item.condition_ids)), `${record.intergenerational_balance_sheet_stewardship_ledger_id} contains a future-user finding.`);
  check(record.fiscal_stress_trigger_records.length === 12 && record.fiscal_stress_trigger_records.every((item) => item.trigger_state === "Dormant" && isEmpty(item.event_ids) && item.review_id === null && item.decision_id === null), `${record.intergenerational_balance_sheet_stewardship_ledger_id} contains an active stress trigger.`);
  check(record.stewardship_duty_records.length === 12 && record.stewardship_duty_records.every((item) => item.duty_state === "Unassigned" && isEmpty(item.owner_ids) && isEmpty(item.funding_ids) && isEmpty(item.receipt_ids)), `${record.intergenerational_balance_sheet_stewardship_ledger_id} contains an assigned stewardship duty.`);
  for (const field of ["current_and_future_standing_records", "baseline_and_scenario_records", "temporal_flow_records", "distributional_balance_records", "natural_cultural_community_asset_records", "deferred_maintenance_liability_records", "reserve_records", "sinking_fund_records", "decommissioning_and_restoration_fund_records", "future_option_value_records", "irreversible_loss_records", "stress_test_records", "restructuring_records", "restoration_plan_records"]) check(isEmpty(record[field]), `${record.intergenerational_balance_sheet_stewardship_ledger_id} contains premature ${field}.`);
  for (const field of ["recognition_basis_record", "time_horizon_record", "public_reason_record", "intergenerational_audit_record", "first_reviewer_id", "second_reviewer_id", "stewardship_receipt_id"]) check(record[field] === null, `${record.intergenerational_balance_sheet_stewardship_ledger_id} contains premature ${field}.`);
  check(record.present_value_as_intergenerational_fairness_allowed === false && record.reserve_as_funded_obligation_allowed === false && record.emergency_authority_as_fiscal_authority_allowed === false && record.automatic_discount_rate_allowed === false && record.automatic_restructuring_allowed === false && record.automatic_score_allowed === false && record.automatic_rank_allowed === false && record.phase64_cell_change === "none", `${record.intergenerational_balance_sheet_stewardship_ledger_id} violates an automation boundary.`);
});

const nonZeroMetrics = new Set(["public_asset_obligation_registers", "lifecycle_cost_maintenance_ledgers", "procurement_dependency_contingent_risk_registers", "intergenerational_balance_sheet_stewardship_ledgers", "asset_obligation_gates", "lifecycle_maintenance_gates", "procurement_risk_gates", "intergenerational_stewardship_gates", "asset_classes", "obligation_classes", "lifecycle_stages", "maintenance_duties", "dependency_classes", "liability_classes", "insurance_limits", "distribution_accounts", "future_user_tests", "fiscal_stress_triggers", "stewardship_duties"]);
for (const [key, value] of Object.entries(registry.metrics)) if (!nonZeroMetrics.has(key)) check(value === 0, `Phase 79 metric ${key} must remain zero.`);

const guideIds = ["briefing-public-wealth-balance-sheet-001", "briefing-lifecycle-costing-whole-life-affordability-001", "briefing-procurement-vendor-lockin-public-options-001", "briefing-debt-guarantees-contingent-liabilities-001", "briefing-insurance-uninsurable-public-risk-001", "briefing-natural-cultural-community-assets-001", "briefing-maintenance-state-good-repair-deferred-liability-001", "briefing-reserves-sinking-funds-liquidity-001", "briefing-decommissioning-restoration-funding-001", "briefing-distributional-public-balance-sheets-001", "briefing-future-users-option-value-irreversibility-001", "briefing-fiscal-stress-restructuring-restoration-001"];
for (const id of guideIds) {
  const body = await readText(appRoot, "src", "content", "briefings", id + ".mdx");
  check(body.includes('record_status: "Published"') && body.length > 7000 && body.includes("## Public contract"), `${id} is missing, short, or not Published.`);
}
const mapSlugs = ["public-asset-register-is-not-market-valuation", "capital-authorization-is-not-lifecycle-affordability", "procurement-contract-is-not-public-capacity", "insurance-coverage-is-not-risk-elimination", "reserve-balance-is-not-funded-restoration", "present-value-is-not-intergenerational-fairness"];
const mapIds = [];
for (const slug of mapSlugs) {
  const map = await readJson(appRoot, "src", "content", "dependency-maps", slug + ".json");
  mapIds.push(map.id);
  check(map.record_status === "Published" && map.nodes.length === 7 && map.links.length === 6 && map.interpretation_boundary.includes("does not establish"), `${slug} is invalid.`);
}

const pathwayIds = [...new Set(assets.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, `Expected 10 Phase 79 pathway integrations, found ${pathwayIds.length}.`);
for (const pathwayId of pathwayIds) {
  const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 79 guides or maps.`);
}
for (const record of assets) {
  const body = await readText(appRoot, "src", "content", "briefings", record.canonical_briefing_id + ".mdx");
  check(body.includes("## Phase 79 public-wealth and intergenerational-stewardship boundary"), `${record.canonical_briefing_id} omits Phase 79.`);
}
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 79 public-wealth and long-horizon stewardship boundary"), `${file} omits Phase 79.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-implementation-commitment-ledger-001.mdx", "briefing-realized-impact-audit-001.mdx", "briefing-institutional-memory-negative-results-001.mdx", "briefing-policy-retirement-decommissioning-001.mdx", "briefing-fiscal-capacity-contribution-sharing-001.mdx", "briefing-emergency-authority-normalization-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 79 public-wealth, lifecycle, and intergenerational control"), `${file} omits the Phase 79 operating control.`);

check(await exists(appRoot, "src", "pages", "evidence", "stewardship", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "stewardship", "[id].astro") && await exists(appRoot, "src", "pages", "data", "public-wealth-intergenerational-stewardship.json.ts"), "Phase 79 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Public Wealth And Intergenerational Stewardship") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 79.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("stewardshipRegistry") && sitemap.includes("/evidence/stewardship/"), "The sitemap omits Phase 79.");
const phase78Detail = await readText(appRoot, "src", "pages", "evidence", "compacts", "[id].astro");
check(phase78Detail.includes("Phase 79 Destination") && phase78Detail.includes("/evidence/stewardship/"), "Phase 78 detail routes omit the Phase 79 handoff.");
check(manifest.expected_build.static_pages >= 4591 && manifest.expected_build.public_json_exports >= 26 && manifest.expected_build.phase_79_public_asset_obligation_registers === 8 && manifest.expected_build.phase_79_lifecycle_cost_maintenance_ledgers === 8 && manifest.expected_build.phase_79_procurement_dependency_contingent_risk_registers === 8 && manifest.expected_build.phase_79_intergenerational_balance_sheet_stewardship_ledgers === 8 && manifest.expected_build.phase_79_synthetic_cases === 2560, "The release manifest omits Phase 79 counts.");
check(manifest.public_asset_obligation_routes?.length === 8 && manifest.lifecycle_cost_maintenance_routes?.length === 8 && manifest.procurement_dependency_contingent_risk_routes?.length === 8 && manifest.intergenerational_balance_sheet_stewardship_routes?.length === 8, "The release manifest omits Phase 79 routes.");

if (failures.length) {
  console.error(`Phase 79 assertions failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 79 assertions passed: 8 inactive asset-obligation registers, 8 inactive lifecycle-maintenance ledgers, 8 inactive procurement and contingent-risk registers, 8 inactive intergenerational balance-sheet ledgers, 18 asset gates, 18 lifecycle gates, 20 procurement gates, 20 stewardship gates, 14 asset classes, 14 obligation classes, 12 lifecycle stages, 12 maintenance duties, 12 dependency classes, 14 liability classes, 10 insurance limits, 12 distribution accounts, 12 future-user tests, 12 stress triggers, 12 stewardship duties, 10 pathways, and 0 valuation, commitment, liability, funding, audit, receipt, score, ranking, or stage changes.");
