import { access, readFile } from "node:fs/promises";
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
const assertTaxonomy = (records, expected, stateField, state, label) => check(records.length === expected && records.every((item) => item[stateField] === state && Object.entries(item).filter(([key]) => key.endsWith("_ids")).every(([, value]) => isEmpty(value)) && Object.entries(item).filter(([key]) => key.endsWith("_id") && !key.includes(label)).every(([, value]) => value === null || typeof value === "string")), `${label} taxonomy is invalid.`);

const registry = await readJson(appRoot, "src", "data", "phase-82-household-capability-care-infrastructure-everyday-security-registry.json");
const phase81 = await readJson(appRoot, "src", "data", "phase-81-universal-service-essential-systems-public-option-delivery-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const capability = registry.household_capability_service_bundle_dossiers;
const care = registry.care_infrastructure_workforce_capacity_ledgers;
const burden = registry.household_affordability_time_debt_administrative_burden_registers;
const recovery = registry.neighborhood_access_displacement_crisis_recovery_ledgers;
const families = [capability, care, burden, recovery];

check(registry.phase === "82" && registry.schema_version === "1.0", "Phase 82 registry identity is invalid.");
check(families.every((items) => items.length === 8), "Phase 82 record-family counts are invalid.");
check(registry.capability_gates.length === 20 && registry.care_capacity_gates.length === 20 && registry.household_burden_gates.length === 22 && registry.neighborhood_recovery_gates.length === 22, "Phase 82 gate counts are invalid.");
for (const [key, expected] of [["household_capability_dimensions",14],["household_service_bundle_classes",12],["life_course_stages",12],["care_service_classes",14],["care_capacity_dimensions",12],["care_workforce_safeguards",12],["household_burden_dimensions",14],["shock_arrears_pathways",12],["administrative_burden_safeguards",12],["neighborhood_access_tests",12],["displacement_mobility_safeguards",12],["crisis_stabilizers",12],["long_horizon_household_security_tests",12]]) check(registry[key].length === expected, `Phase 82 ${key} count is invalid.`);

const all = families.flat();
const ids = all.map((record) => Object.values(record).find((value) => typeof value === "string" && /^82-(HCD|CWL|HBR|NCR)-/.test(value)));
check(new Set(ids).size === 32 && new Set(all.map((record) => record.slug)).size === 32, "Phase 82 IDs or slugs are not unique.");
check(new Set(capability.map((record) => record.rights_quality_step_in_restoration_ledger_id)).size === 8, "Phase 81 restoration ledgers do not map one-to-one to Phase 82 capability dossiers.");
check(capability.every((record) => phase81.rights_quality_step_in_restoration_ledgers.some((item) => item.rights_quality_step_in_restoration_ledger_id === record.rights_quality_step_in_restoration_ledger_id && item.cohort_id === record.cohort_id)), "A Phase 82 capability dossier lacks its exact Phase 81 predecessor.");

const governedSuffixes = ["_records", "_ids"];
const assertEmptyFields = (record, taxonomyNames, idFields, label) => {
  for (const [key, value] of Object.entries(record)) if ((governedSuffixes.some((suffix) => key.endsWith(suffix)) && !taxonomyNames.includes(key) && !["source_ids", "signal_ids", "evidence_gap_ids", "reader_pathway_ids", "local_system_ids"].includes(key)) || idFields.includes(key)) check(isEmpty(value), `${label} contains governed data in ${key}.`);
  for (const [key, value] of Object.entries(record)) if (key.endsWith("_allowed")) check(value === false, `${label} permits ${key}.`);
  check(record.first_reviewer_id === null && record.second_reviewer_id === null && record.propagation_status === "not_started" && record.phase64_cell_change === "none", `${label} crossed its review or propagation boundary.`);
};

for (const record of capability) {
  check(record.capability_state === "Inactive - No Verified Phase 81 Universal-Service Record" && record.adoption_decision === "Not Open" && record.capability_checks.length === 20 && record.capability_checks.every((item) => item.decision_state === "Inactive"), `${record.household_capability_service_bundle_dossier_id} is not inactive.`);
  assertTaxonomy(record.household_capability_dimension_records,14,"capability_state","Not Assessed","capability"); assertTaxonomy(record.household_service_bundle_class_records,12,"bundle_state","Unassigned","bundle"); assertTaxonomy(record.life_course_stage_records,12,"stage_state","Unassessed","stage");
  assertEmptyFields(record,["household_capability_dimension_records","household_service_bundle_class_records","life_course_stage_records"],["capability_receipt_id"],record.household_capability_service_bundle_dossier_id);
}
for (const record of care) {
  check(record.care_state === "Inactive - No Adopted Household-Capability Floor" && record.capacity_decision === "Not Open" && record.care_capacity_checks.length === 20 && record.care_capacity_checks.every((item) => item.decision_state === "Inactive"), `${record.care_infrastructure_workforce_capacity_ledger_id} is not inactive.`);
  assertTaxonomy(record.care_service_class_records,14,"service_state","Unassessed","service"); assertTaxonomy(record.care_capacity_dimension_records,12,"capacity_state","Not Measured","capacity"); assertTaxonomy(record.care_workforce_safeguard_records,12,"safeguard_state","Unverified","safeguard");
  assertEmptyFields(record,["care_service_class_records","care_capacity_dimension_records","care_workforce_safeguard_records"],["care_capacity_receipt_id"],record.care_infrastructure_workforce_capacity_ledger_id);
}
for (const record of burden) {
  check(record.burden_state === "Inactive - No Verified Care-Capacity Record" && record.protection_decision === "Not Open" && record.household_burden_checks.length === 22 && record.household_burden_checks.every((item) => item.decision_state === "Inactive"), `${record.household_affordability_time_debt_administrative_burden_register_id} is not inactive.`);
  assertTaxonomy(record.household_burden_dimension_records,14,"burden_state","Not Measured","burden"); assertTaxonomy(record.shock_arrears_pathway_records,12,"pathway_state","Dormant","pathway"); assertTaxonomy(record.administrative_burden_safeguard_records,12,"safeguard_state","Unverified","safeguard");
  assertEmptyFields(record,["household_burden_dimension_records","shock_arrears_pathway_records","administrative_burden_safeguard_records"],["burden_receipt_id"],record.household_affordability_time_debt_administrative_burden_register_id);
}
for (const record of recovery) {
  check(record.recovery_state === "Inactive - No Verified Household-Burden Baseline" && record.recovery_decision === "Not Open" && record.neighborhood_recovery_checks.length === 22 && record.neighborhood_recovery_checks.every((item) => item.decision_state === "Inactive"), `${record.neighborhood_access_displacement_crisis_recovery_ledger_id} is not inactive.`);
  assertTaxonomy(record.neighborhood_access_test_records,12,"test_state","Not Tested","access"); assertTaxonomy(record.displacement_mobility_safeguard_records,12,"safeguard_state","Unverified","safeguard"); assertTaxonomy(record.crisis_stabilizer_records,12,"stabilizer_state","Unassigned","stabilizer"); assertTaxonomy(record.long_horizon_household_security_test_records,12,"test_state","Not Tested","security");
  assertEmptyFields(record,["neighborhood_access_test_records","displacement_mobility_safeguard_records","crisis_stabilizer_records","long_horizon_household_security_test_records"],["recovery_receipt_id"],record.neighborhood_access_displacement_crisis_recovery_ledger_id);
}

const countMetricKeys = new Set(["household_capability_service_bundle_dossiers","care_infrastructure_workforce_capacity_ledgers","household_affordability_time_debt_administrative_burden_registers","neighborhood_access_displacement_crisis_recovery_ledgers","capability_gates","care_capacity_gates","household_burden_gates","neighborhood_recovery_gates","household_capability_dimensions","household_service_bundle_classes","life_course_stages","care_service_classes","care_capacity_dimensions","care_workforce_safeguards","household_burden_dimensions","shock_arrears_pathways","administrative_burden_safeguards","neighborhood_access_tests","displacement_mobility_safeguards","crisis_stabilizers","long_horizon_household_security_tests"]);
for (const [key, value] of Object.entries(registry.metrics)) if (!countMetricKeys.has(key)) check(value === 0, `Phase 82 metric ${key} must remain zero.`);

const guideIds = ["briefing-household-capability-doctrine-001","briefing-time-poverty-unpaid-care-001","briefing-care-infrastructure-workforce-001","briefing-essential-service-bundles-households-001","briefing-neighborhood-proximity-rural-access-001","briefing-household-affordability-arrears-debt-001","briefing-administrative-burden-benefit-access-001","briefing-disability-universal-design-home-community-001","briefing-life-course-transitions-household-security-001","briefing-displacement-household-mobility-001","briefing-crisis-stabilization-recovery-001","briefing-long-horizon-household-security-001"];
const mapIds = ["dependency-map-service-availability-is-not-household-capability","dependency-map-unpaid-care-is-not-free-capacity","dependency-map-program-eligibility-is-not-benefit-access","dependency-map-low-monthly-bill-is-not-household-affordability","dependency-map-neighborhood-proximity-is-not-accessibility","dependency-map-temporary-relief-is-not-household-recovery"];
for (const id of guideIds) check(await exists(appRoot,"src","content","briefings",id + ".mdx"), `${id} is missing.`);
for (const id of mapIds) check(await exists(appRoot,"src","content","dependency-maps",id.replace("dependency-map-","") + ".json"), `${id} is missing.`);
for (const pathwayId of new Set(capability.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot,"src","content","reader-pathways",pathwayId.replace("reader-pathway-","") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 82 guides or maps.`); }
for (const record of capability) check((await readText(appRoot,"src","content","briefings",record.canonical_briefing_id + ".mdx")).includes("## Phase 82 household-capability and everyday-security boundary"), `${record.canonical_briefing_id} omits Phase 82.`);
for (const file of ["local-us-southwest-chip-corridor.mdx","local-ontario-real-estate.mdx","local-northern-virginia-data-center-corridor.mdx","local-florida-space-coast-launch-corridor.mdx","local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot,"src","content","local-systems",file)).includes("## Phase 82 household capability, care, access, and recovery boundary"), `${file} omits Phase 82.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx","briefing-decision-accountability-desk-001.mdx","briefing-public-investment-doctrine-001.mdx","briefing-universal-service-doctrine-001.mdx","briefing-essential-service-floors-001.mdx","briefing-affordability-cross-subsidy-001.mdx","briefing-coverage-capacity-access-001.mdx","briefing-accessibility-user-rights-remedy-001.mdx","briefing-continuity-mutual-aid-essential-systems-001.mdx","briefing-emergency-rationing-restoration-long-horizon-accountability-001.mdx"]) check((await readText(appRoot,"src","content","briefings",file)).includes("## Phase 82 household capability, care, burden, and recovery control"), `${file} omits the Phase 82 operating control.`);

check(await exists(appRoot,"src","pages","evidence","household-capability","index.astro") && await exists(appRoot,"src","pages","evidence","household-capability","[id].astro") && await exists(appRoot,"src","pages","data","household-capability-care-everyday-security.json.ts"), "Phase 82 routes or export are missing.");
const dataIndex = await readText(appRoot,"src","pages","data","index.astro"); check(dataIndex.includes("Household Capability, Care And Everyday Security") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 82.");
const sitemap = await readText(appRoot,"src","pages","sitemap.xml.ts"); check(sitemap.includes("householdCapabilityRegistry") && sitemap.includes("/evidence/household-capability/"), "The sitemap omits Phase 82.");
const phase81Detail = await readText(appRoot,"src","pages","evidence","essential-services","[id].astro"); check(phase81Detail.includes("Phase 82 Destination") && phase81Detail.includes("/evidence/household-capability/"), "Phase 81 detail routes omit the Phase 82 handoff.");
check(manifest.expected_build.static_pages >= 4744 && manifest.expected_build.public_json_exports >= 29 && manifest.expected_build.phase_82_household_capability_service_bundle_dossiers === 8 && manifest.expected_build.phase_82_care_infrastructure_workforce_capacity_ledgers === 8 && manifest.expected_build.phase_82_household_affordability_time_debt_administrative_burden_registers === 8 && manifest.expected_build.phase_82_neighborhood_access_displacement_crisis_recovery_ledgers === 8 && manifest.expected_build.phase_82_synthetic_cases === 2560, "The release manifest omits Phase 82 counts.");
check(manifest.household_capability_service_bundle_routes?.length === 8 && manifest.care_infrastructure_workforce_capacity_routes?.length === 8 && manifest.household_affordability_time_debt_administrative_burden_routes?.length === 8 && manifest.neighborhood_access_displacement_crisis_recovery_routes?.length === 8, "The release manifest omits Phase 82 routes.");

if (failures.length) { console.error(`Phase 82 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 82 assertions passed: 8 inactive capability dossiers, 8 inactive care ledgers, 8 inactive burden registers, 8 inactive recovery ledgers, 84 gates per chain, exact taxonomies, 10 pathways, and 0 household classifications, floors, allocations, findings, protections, interventions, remedies, receipts, scores, rankings, or stage changes.");
