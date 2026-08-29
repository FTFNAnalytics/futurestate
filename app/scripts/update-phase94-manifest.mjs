import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readFrontmatter = async (directory) => Promise.all((await readdir(directory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(directory, name), "utf8");
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));
const briefings = await readFrontmatter(join(appRoot, "src", "content", "briefings"));
const signals = await readFrontmatter(join(appRoot, "src", "content", "signals"));
const maps = await Promise.all((await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json")).map((name) => readJson(appRoot, "src", "content", "dependency-maps", name)));
const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const registry = await readJson(appRoot, "src", "data", "phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published"), inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published"), inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published"), inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-26";
Object.assign(manifest.expected_build, {
  static_pages: 5356, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length,
  briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length, public_json_exports: 41,
  phase_94_energy_water_industrial_utility_reliability_dossiers: registry.energy_water_industrial_utility_reliability_dossiers.length,
  phase_94_minerals_materials_processing_circularity_qualification_ledgers: registry.minerals_materials_processing_circularity_qualification_ledgers.length,
  phase_94_manufacturing_equipment_automation_maintenance_quality_accepted_production_registers: registry.manufacturing_equipment_automation_maintenance_quality_accepted_production_registers.length,
  phase_94_logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers: registry.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers.length,
  phase_94_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5174;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 93 through Phase 94 physical-economy transformation: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, forty-one public JSON exports, thirty-two inactive Phase 94 records, and zero utility, material, production, logistics, reserve, conversion, sovereignty, transition, score, ranking, or operating-outcome changes.`;
for (const command of ["npm run test:phase94", "npm run verify:phase94"]) if (!manifest.predeploy_commands.includes(command)) { const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release"); manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command); }

const routeFor = (record) => "/evidence/energy-materials-manufacturing-supply-chains/" + record.slug + "/";
const utilityRoutes = registry.energy_water_industrial_utility_reliability_dossiers.map(routeFor).sort();
const materialRoutes = registry.minerals_materials_processing_circularity_qualification_ledgers.map(routeFor).sort();
const manufacturingRoutes = registry.manufacturing_equipment_automation_maintenance_quality_accepted_production_registers.map(routeFor).sort();
const supplyRoutes = registry.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers.map(routeFor).sort();
const guides = ["energy-materials-manufacturing-logistics-strategic-supply-chain-doctrine-001", "energy-generation-grid-fuels-storage-reliability-001", "industrial-water-utilities-infrastructure-continuity-001", "minerals-metals-chemicals-advanced-materials-001", "extraction-refining-processing-fabrication-recycling-001", "material-qualification-traceability-standards-circularity-001", "factories-equipment-tooling-automation-maintenance-001", "accepted-production-quality-yield-reliability-001", "supplier-tiers-inventory-logistics-visibility-001", "ports-rail-road-aviation-maritime-warehousing-cold-chain-001", "strategic-reserves-emergency-conversion-mutual-aid-001", "technology-sovereignty-just-industrial-transition-001"];
const phase94Maps = ["installed-capacity-is-not-delivered-reliable-energy", "resource-endowment-is-not-qualified-material-supply", "factory-announcement-is-not-accepted-production", "logistics-throughput-is-not-resilient-access", "domestic-content-percentage-is-not-technological-sovereignty", "decarbonization-target-is-not-just-industrial-transition"];
for (const file of [
  "dist/data/energy-materials-manufacturing-logistics-strategic-supply-chain-transformation.json", "dist/evidence/energy-materials-manufacturing-supply-chains/index.html",
  "dist" + utilityRoutes[0] + "index.html", "dist" + utilityRoutes.at(-1) + "index.html", "dist" + materialRoutes[0] + "index.html", "dist" + materialRoutes.at(-1) + "index.html",
  "dist" + manufacturingRoutes[0] + "index.html", "dist" + manufacturingRoutes.at(-1) + "index.html", "dist" + supplyRoutes[0] + "index.html", "dist" + supplyRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase94Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.energy_water_industrial_utility_reliability_routes = utilityRoutes;
manifest.minerals_materials_processing_circularity_qualification_routes = materialRoutes;
manifest.manufacturing_equipment_automation_maintenance_quality_accepted_production_routes = manufacturingRoutes;
manifest.logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_routes = supplyRoutes;

manifest.last_verified.date = "2026-08-26";
manifest.last_verified.static_pages_built = 5356;
manifest.last_verified.release_assertions = "passed-through-phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-94-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-94-energy-materials-manufacturing-logistics-strategic-supply-chain-transformation-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_94_delta = {
  captured_date: "2026-08-26", editorial_layer: "energy-generation-grids-fuels-storage-water-wastewater-industrial-utilities-reliability-affordability-restoration-minerals-metals-chemicals-advanced-materials-extraction-refining-processing-fabrication-recycling-qualification-traceability-standards-circularity-factories-equipment-tooling-automation-maintenance-quality-yield-accepted-production-supplier-tiers-inventory-logistics-visibility-ports-rail-road-aviation-maritime-warehousing-cold-chain-strategic-reserves-emergency-conversion-mutual-aid-technology-sovereignty-just-industrial-transition",
  energy_water_industrial_utility_reliability_dossiers: 8, minerals_materials_processing_circularity_qualification_ledgers: 8, manufacturing_equipment_automation_maintenance_quality_accepted_production_registers: 8, logistics_inventory_strategic_reserves_emergency_conversion_supply_chain_resilience_ledgers: 8,
  utility_gates_per_dossier: 20, material_gates_per_ledger: 20, manufacturing_gates_per_register: 22, supply_chain_gates_per_ledger: 24, total_gates_per_chain: 86,
  synthetic_utility_cases: 640, synthetic_material_cases: 640, synthetic_manufacturing_cases: 640, synthetic_supply_chain_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase93_transformation_records_received: 0, industrial_utility_reliability_decisions: 0, qualified_material_supply_decisions: 0, accepted_manufacturing_production_decisions: 0, strategic_supply_chain_resilience_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 95 Infrastructure, Construction, Buildings, Public Works And Territorial Systems Delivery",
  local_content_commit: "pending", deployment_status: "phase-94-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 94 publishes exactly"));
manifest.release_gates.push("Confirm Phase 94 publishes exactly 8 inactive energy-water-industrial-utility-reliability dossiers, 8 inactive minerals-materials-processing-circularity-qualification ledgers, 8 inactive manufacturing-equipment-automation-maintenance-quality-accepted-production registers, and 8 inactive logistics-inventory-strategic-reserves-emergency-conversion-supply-chain-resilience ledgers with 86 gates per chain and exact taxonomies, while creating zero allocation, capacity, reliability, qualification, certification, production, quality, customer-acceptance, shipment, inventory, reserve, conversion, mutual-aid, resilient-access, technology-sovereignty, just-transition, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 94 physical-economy layer. Its 2,560 Phase 94 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 93 transformation record, utility allocation, reliability finding, qualified material supply, factory or equipment acceptance, production or quality finding, customer acceptance, shipment, inventory, reserve release, emergency conversion, mutual-aid activation, resilient-access, technology-sovereignty or just-transition conclusion, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 94 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 41 public JSON exports, 32 physical-economy routes, and 5,356 static pages.`);
