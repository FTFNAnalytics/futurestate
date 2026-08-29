import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation-registry.json");
const phase93 = await readJson(appRoot, "src", "data", "phase-93-economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const utilities = registry.energy_water_industrial_utility_reliability_dossiers;
const materials = registry.minerals_materials_processing_circularity_qualification_ledgers;
const manufacturing = registry.manufacturing_equipment_automation_maintenance_quality_accepted_production_registers;
const supplyChains = registry.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers;

check(registry.phase === "94" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 94 registry metadata is invalid.");
check(utilities.length === 8 && materials.length === 8 && manufacturing.length === 8 && supplyChains.length === 8, "Phase 94 must preserve four eight-record families.");
check(registry.energy_gates.length === 20 && registry.material_gates.length === 20 && registry.manufacturing_gates.length === 22 && registry.supply_chain_gates.length === 24, "Phase 94 must preserve an 86-gate chain.");
check(registry.energy_water_industrial_utility_classes.length === 14 && registry.industrial_utility_reliability_access_dimensions.length === 12 && registry.energy_water_utility_rights_resilience_safeguards.length === 12, "Phase 94 utility taxonomies are incomplete.");
check(registry.mineral_material_processing_supply_classes.length === 14 && registry.material_qualification_circularity_traceability_dimensions.length === 12 && registry.material_rights_environment_public_value_safeguards.length === 12, "Phase 94 material taxonomies are incomplete.");
check(registry.manufacturing_factory_production_system_classes.length === 14 && registry.equipment_automation_maintenance_quality_dimensions.length === 12 && registry.worker_community_accepted_production_safeguards.length === 12, "Phase 94 manufacturing taxonomies are incomplete.");
check(registry.logistics_inventory_reserve_network_classes.length === 14 && registry.supply_chain_visibility_access_resilience_dimensions.length === 12 && registry.strategic_supply_chain_governance_safeguards.length === 12 && registry.long_horizon_physical_economy_tests.length === 12, "Phase 94 supply-chain taxonomies are incomplete.");

const cohorts = phase93.productive_transformation_diversification_decarbonization_shared_prosperity_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["utility", utilities, "energy_water_industrial_utility_reliability_dossier_id", "energy_state", "energy_decision", "energy_checks", 20],
  ["material", materials, "minerals_materials_processing_circularity_qualification_ledger_id", "materials_state", "materials_decision", "materials_checks", 20],
  ["manufacturing", manufacturing, "manufacturing_equipment_automation_maintenance_quality_accepted_production_register_id", "manufacturing_state", "manufacturing_decision", "manufacturing_checks", 22],
  ["supply chain", supplyChains, "logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledger_id", "supply_chain_state", "supply_chain_decision", "supply_chain_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), `Phase 94 ${name} cohorts do not preserve Phase 93 identity.`);
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, `Phase 94 ${name} identities are not unique.`);
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", `${record[idKey]} is not a Published inactive contract.`);
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), `${record[idKey]} has an invalid gate set.`);
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", `${record[idKey]} crosses a review, automation, propagation, or stage boundary.`);
    for (const [key, value] of Object.entries(record)) if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records")) check(Array.isArray(value) && value.length === 0, `${record[idKey]} ${key} must remain empty.`);
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, `Phase 94 metric ${key} must remain zero.`);

const guides = ["energy-materials-manufacturing-logistics-strategic-supply-chain-doctrine-001", "energy-generation-grid-fuels-storage-reliability-001", "industrial-water-utilities-infrastructure-continuity-001", "minerals-metals-chemicals-advanced-materials-001", "extraction-refining-processing-fabrication-recycling-001", "material-qualification-traceability-standards-circularity-001", "factories-equipment-tooling-automation-maintenance-001", "accepted-production-quality-yield-reliability-001", "supplier-tiers-inventory-logistics-visibility-001", "ports-rail-road-aviation-maritime-warehousing-cold-chain-001", "strategic-reserves-emergency-conversion-mutual-aid-001", "technology-sovereignty-just-industrial-transition-001"];
const maps = ["installed-capacity-is-not-delivered-reliable-energy", "resource-endowment-is-not-qualified-material-supply", "factory-announcement-is-not-accepted-production", "logistics-throughput-is-not-resilient-access", "domestic-content-percentage-is-not-technological-sovereignty", "decarbonization-target-is-not-just-industrial-transition"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", `briefing-${slug}.mdx`), `Phase 94 guide ${slug} is missing.`);
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", `${slug}.json`), `Phase 94 map ${slug} is missing.`);
const guideIds = guides.map((slug) => `briefing-${slug}`), mapIds = maps.map((slug) => `dependency-map-${slug}`);
for (const pathwayId of new Set(utilities.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 94 content.`); }
for (const id of new Set(utilities.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", `${id}.mdx`)).includes("## Phase 94 energy, materials, manufacturing, logistics, and strategic supply-chain boundary"), `${id} omits Phase 94.`);
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 94 energy, materials, manufacturing, logistics, and strategic supply-chain boundary"), `${file} omits Phase 94.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 94 energy, materials, manufacturing, logistics, and strategic supply-chain control"), `${file} omits Phase 94 control.`);

check(await exists(appRoot, "src", "pages", "evidence", "energy-materials-manufacturing-supply-chains", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "energy-materials-manufacturing-supply-chains", "[id].astro") && await exists(appRoot, "src", "pages", "data", "energy-materials-manufacturing-logistics-strategic-supply-chain-transformation.json.ts"), "Phase 94 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Energy, Materials, Manufacturing, Logistics And Strategic Supply-Chain Transformation") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 94.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("physicalEconomySupplyChainRegistry") && sitemap.includes("/evidence/energy-materials-manufacturing-supply-chains/"), "The sitemap omits Phase 94.");
const phase93Detail = await readText(appRoot, "src", "pages", "evidence", "economic-development-industrial-strategy-productive-transformation", "[id].astro");
check(phase93Detail.includes("Phase 94 Destination") && phase93Detail.includes("/evidence/energy-materials-manufacturing-supply-chains/"), "Phase 93 detail routes omit the Phase 94 handoff.");
check(manifest.expected_build.static_pages >= 5356 && manifest.expected_build.public_json_exports >= 41 && manifest.expected_build.phase_94_energy_water_industrial_utility_reliability_dossiers === 8 && manifest.expected_build.phase_94_minerals_materials_processing_circularity_qualification_ledgers === 8 && manifest.expected_build.phase_94_manufacturing_equipment_automation_maintenance_quality_accepted_production_registers === 8 && manifest.expected_build.phase_94_logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers === 8 && manifest.expected_build.phase_94_synthetic_cases === 2560, "The release manifest omits Phase 94 counts.");
check(manifest.energy_water_industrial_utility_reliability_routes?.length === 8 && manifest.minerals_materials_processing_circularity_qualification_routes?.length === 8 && manifest.manufacturing_equipment_automation_maintenance_quality_accepted_production_routes?.length === 8 && manifest.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_routes?.length === 8, "The release manifest omits Phase 94 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation.md"), "The Phase 94 work package is missing.");
if (failures.length) { console.error(`Phase 94 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 94 assertions passed: 8 inactive utility dossiers, 8 inactive material ledgers, 8 inactive manufacturing registers, 8 inactive supply-chain ledgers, 86 gates per chain, exact taxonomies, 10 pathways, and 0 reliability, qualification, production, resilience, score, ranking, or Phase 64 decisions.");
