import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-registry.json");
const phase94 = await readJson(appRoot, "src", "data", "phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const territorial = registry.spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers;
const projects = registry.project_design_engineering_cost_estimation_permitting_procurement_ledgers;
const construction = registry.construction_contractors_trades_materials_safety_inspection_registers;
const stewardship = registry.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers;

check(registry.phase === "95" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 95 registry metadata is invalid.");
check(registry.effective_date === "2026-08-27", "Phase 95 must use the current Edmonton calendar date.");
check(territorial.length === 8 && projects.length === 8 && construction.length === 8 && stewardship.length === 8, "Phase 95 must preserve four eight-record families.");
check(registry.territorial_gates.length === 20 && registry.project_gates.length === 22 && registry.construction_gates.length === 22 && registry.stewardship_gates.length === 24, "Phase 95 must preserve an 88-gate chain.");
check(registry.territorial_planning_site_classes.length === 14 && registry.territorial_readiness_dimensions.length === 12 && registry.territorial_rights_public_value_safeguards.length === 12, "Phase 95 territorial taxonomies are incomplete.");
check(registry.project_design_procurement_classes.length === 14 && registry.project_definition_design_delivery_dimensions.length === 12 && registry.project_procurement_governance_safeguards.length === 12, "Phase 95 project taxonomies are incomplete.");
check(registry.construction_work_package_classes.length === 14 && registry.construction_delivery_assurance_dimensions.length === 12 && registry.construction_worker_community_safeguards.length === 12, "Phase 95 construction taxonomies are incomplete.");
check(registry.asset_service_stewardship_classes.length === 14 && registry.asset_service_stewardship_dimensions.length === 12 && registry.territorial_service_rights_safeguards.length === 12 && registry.long_horizon_territorial_system_tests.length === 12, "Phase 95 stewardship taxonomies are incomplete.");

const cohorts = phase94.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["territorial", territorial, "spatial_planning_land_assembly_rights_of_way_site_readiness_dossier_id", "territorial_state", "territorial_decision", "territorial_checks", 20],
  ["project", projects, "project_design_engineering_cost_estimation_permitting_procurement_ledger_id", "project_state", "project_decision", "project_checks", 22],
  ["construction", construction, "construction_contractors_trades_materials_safety_inspection_register_id", "construction_state", "construction_decision", "construction_checks", 22],
  ["stewardship", stewardship, "commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledger_id", "stewardship_state", "stewardship_decision", "stewardship_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), `Phase 95 ${name} cohorts do not preserve Phase 94 identity.`);
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, `Phase 95 ${name} identities are not unique.`);
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", `${record[idKey]} is not a Published inactive contract.`);
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), `${record[idKey]} has an invalid gate set.`);
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", `${record[idKey]} crosses a review, automation, propagation, or stage boundary.`);
    for (const [key, value] of Object.entries(record)) if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records")) check(Array.isArray(value) && value.length === 0, `${record[idKey]} ${key} must remain empty.`);
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, `Phase 95 metric ${key} must remain zero.`);

const guides = ["infrastructure-construction-buildings-public-works-territorial-systems-doctrine-001", "spatial-planning-land-assembly-rights-of-way-site-readiness-001", "permitting-environmental-review-utilities-community-consent-001", "project-definition-design-engineering-cost-estimation-001", "procurement-contracting-project-packaging-market-capacity-001", "contractors-trades-materials-equipment-construction-logistics-001", "construction-safety-quality-inspection-change-control-001", "buildings-housing-civic-industrial-public-facilities-001", "transportation-water-energy-digital-public-works-001", "commissioning-accessibility-handover-operations-maintenance-001", "climate-adaptation-disaster-reconstruction-community-recovery-001", "public-space-place-value-community-benefit-indigenous-rights-001"];
const maps = ["capital-plan-is-not-executable-project", "permit-is-not-construction-start", "construction-spending-is-not-commissioned-asset", "substantial-completion-is-not-safe-accessible-service", "floor-area-is-not-place-value", "reconstruction-output-is-not-community-recovery"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", `briefing-${slug}.mdx`), `Phase 95 guide ${slug} is missing.`);
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", `${slug}.json`), `Phase 95 map ${slug} is missing.`);
const guideIds = guides.map((slug) => `briefing-${slug}`), mapIds = maps.map((slug) => `dependency-map-${slug}`);
for (const pathwayId of new Set(territorial.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 95 content.`); }
for (const id of new Set(territorial.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", `${id}.mdx`)).includes("## Phase 95 infrastructure, construction, buildings, public works, and territorial-systems boundary"), `${id} omits Phase 95.`);
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 95 infrastructure, construction, buildings, public works, and territorial-systems boundary"), `${file} omits Phase 95.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 95 infrastructure, construction, buildings, public works, and territorial-systems control"), `${file} omits Phase 95 control.`);

check(await exists(appRoot, "src", "pages", "evidence", "infrastructure-construction-buildings-public-works-territorial-systems", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "infrastructure-construction-buildings-public-works-territorial-systems", "[id].astro") && await exists(appRoot, "src", "pages", "data", "infrastructure-construction-buildings-public-works-territorial-systems-delivery.json.ts"), "Phase 95 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Infrastructure, Construction, Buildings, Public Works And Territorial Systems Delivery") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 95.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("territorialSystemsDeliveryRegistry") && sitemap.includes("/evidence/infrastructure-construction-buildings-public-works-territorial-systems/"), "The sitemap omits Phase 95.");
const phase94Detail = await readText(appRoot, "src", "pages", "evidence", "energy-materials-manufacturing-supply-chains", "[id].astro");
check(phase94Detail.includes("Phase 95 Destination") && phase94Detail.includes("/evidence/infrastructure-construction-buildings-public-works-territorial-systems/"), "Phase 94 detail routes omit the Phase 95 handoff.");
check(manifest.expected_build.static_pages >= 5407 && manifest.expected_build.public_json_exports >= 42 && manifest.expected_build.phase_95_spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers === 8 && manifest.expected_build.phase_95_project_design_engineering_cost_estimation_permitting_procurement_ledgers === 8 && manifest.expected_build.phase_95_construction_contractors_trades_materials_safety_inspection_registers === 8 && manifest.expected_build.phase_95_commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers === 8 && manifest.expected_build.phase_95_synthetic_cases === 2560, "The release manifest omits Phase 95 counts.");
check(manifest.spatial_planning_land_assembly_rights_of_way_site_readiness_routes?.length === 8 && manifest.project_design_engineering_cost_estimation_permitting_procurement_routes?.length === 8 && manifest.construction_contractors_trades_materials_safety_inspection_routes?.length === 8 && manifest.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_routes?.length === 8, "The release manifest omits Phase 95 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery.md"), "The Phase 95 work package is missing.");
if (failures.length) { console.error(`Phase 95 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 95 assertions passed: 8 inactive territorial-readiness dossiers, 8 inactive project ledgers, 8 inactive construction registers, 8 inactive stewardship ledgers, 88 gates per chain, exact taxonomies, 10 pathways, and 0 project, construction, commissioning, recovery, score, ranking, or Phase 64 decisions.");
