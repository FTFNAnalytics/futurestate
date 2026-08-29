import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readFrontmatterRecords = async (directory) => Promise.all((await readdir(directory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(directory, name), "utf8");
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));

const briefings = await readFrontmatterRecords(join(appRoot, "src", "content", "briefings"));
const signals = await readFrontmatterRecords(join(appRoot, "src", "content", "signals"));
const maps = await Promise.all((await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json")).map((name) => readJson(appRoot, "src", "content", "dependency-maps", name)));
const updateFiles = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const registry = await readJson(appRoot, "src", "data", "phase-84-food-systems-local-provisioning-community-resource-security-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4846,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 31,
  phase_84_food_production_land_water_sovereignty_dossiers: registry.food_production_land_water_sovereignty_dossiers.length,
  phase_84_processing_storage_distribution_local_provisioning_ledgers: registry.processing_storage_distribution_local_provisioning_ledgers.length,
  phase_84_food_access_affordability_nutrition_institutional_meals_registers: registry.food_access_affordability_nutrition_institutional_meals_registers.length,
  phase_84_reserve_contamination_circularity_community_resource_security_ledgers: registry.reserve_contamination_circularity_community_resource_security_ledgers.length,
  phase_84_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4664;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 83 through Phase 84 food systems, local provisioning, land, water, Indigenous food sovereignty, processing, storage, cold chain, logistics, markets, public procurement, community benefit, agricultural and food workforces, food access, affordability, nutrition, institutional meals, emergency reserves, contamination, circular flows, climate adaptation, and long-horizon community resource security: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published and ${inReviewBriefings.length} In Review briefings, ${publishedMaps.length} Published and ${inReviewMaps.length} In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, ${updateFiles.length} updates, thirty-one public JSON exports, thirty-two inactive Phase 84 records, and zero allocations, procurement decisions, nutrition findings, reserve releases, recalls, remedies, scores, rankings, or operating-outcome changes.`;

for (const command of ["npm run test:phase84", "npm run verify:phase84"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/food-systems/" + record.slug + "/";
const productionRoutes = registry.food_production_land_water_sovereignty_dossiers.map(routeFor).sort();
const provisioningRoutes = registry.processing_storage_distribution_local_provisioning_ledgers.map(routeFor).sort();
const accessRoutes = registry.food_access_affordability_nutrition_institutional_meals_registers.map(routeFor).sort();
const securityRoutes = registry.reserve_contamination_circularity_community_resource_security_ledgers.map(routeFor).sort();
const guides = ["food-systems-doctrine-001", "regional-neighborhood-provisioning-001", "land-access-tenure-stewardship-001", "indigenous-food-sovereignty-001", "food-water-energy-climate-dependencies-001", "agricultural-food-workforce-001", "processing-storage-cold-chain-001", "logistics-markets-public-procurement-001", "school-institutional-meals-001", "food-affordability-nutrition-dignity-001", "emergency-reserves-community-kitchens-001", "food-waste-circularity-resource-security-001"];
const phase84Maps = ["food-availability-is-not-nutritional-access", "inventory-is-not-usable-reserve", "local-production-is-not-resilient-provisioning", "procurement-spend-is-not-community-benefit", "waste-diversion-is-not-circular-capacity", "short-term-distribution-is-not-durable-food-security"];
for (const file of [
  "dist/data/food-systems-local-provisioning-community-resource-security.json", "dist/evidence/food-systems/index.html",
  "dist" + productionRoutes[0] + "index.html", "dist" + productionRoutes.at(-1) + "index.html", "dist" + provisioningRoutes[0] + "index.html", "dist" + provisioningRoutes.at(-1) + "index.html", "dist" + accessRoutes[0] + "index.html", "dist" + accessRoutes.at(-1) + "index.html", "dist" + securityRoutes[0] + "index.html", "dist" + securityRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase84Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.food_production_land_water_sovereignty_routes = productionRoutes;
manifest.processing_storage_distribution_local_provisioning_routes = provisioningRoutes;
manifest.food_access_affordability_nutrition_institutional_meals_routes = accessRoutes;
manifest.reserve_contamination_circularity_community_resource_security_routes = securityRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4846;
manifest.last_verified.release_assertions = "passed-through-phase-84-food-systems-local-provisioning-community-resource-security";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-84-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-84-food-systems-local-provisioning-community-resource-security-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_84_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "food-systems-local-provisioning-production-land-water-indigenous-food-sovereignty-processing-storage-cold-chain-logistics-markets-public-procurement-community-benefit-agricultural-food-workforce-access-affordability-nutrition-dignity-school-institutional-meals-community-kitchens-emergency-reserves-contamination-biosecurity-waste-circular-flows-climate-adaptation-community-resource-security",
  food_production_land_water_sovereignty_dossiers: 8,
  processing_storage_distribution_local_provisioning_ledgers: 8,
  food_access_affordability_nutrition_institutional_meals_registers: 8,
  reserve_contamination_circularity_community_resource_security_ledgers: 8,
  production_gates_per_dossier: 20,
  provisioning_gates_per_ledger: 20,
  food_access_gates_per_register: 22,
  resource_security_gates_per_ledger: 22,
  food_production_system_types_per_dossier: 14,
  land_access_tenure_stewardship_safeguards_per_dossier: 12,
  water_energy_climate_dependency_tests_per_dossier: 12,
  processing_storage_distribution_modes_per_ledger: 14,
  local_procurement_community_benefit_dimensions_per_ledger: 12,
  food_workforce_logistics_safeguards_per_ledger: 12,
  food_access_channels_per_register: 14,
  affordability_nutrition_dignity_dimensions_per_register: 12,
  institutional_meal_community_provisioning_safeguards_per_register: 12,
  emergency_reserve_capabilities_per_ledger: 12,
  contamination_biosecurity_safeguards_per_ledger: 12,
  food_waste_circular_flow_capabilities_per_ledger: 12,
  long_horizon_community_resource_security_tests_per_ledger: 12,
  synthetic_production_cases: 640,
  synthetic_provisioning_cases: 640,
  synthetic_access_cases: 640,
  synthetic_security_cases: 640,
  synthetic_cases_total: 2560,
  new_briefings_added_published: 12,
  dependency_maps_added_published: 6,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 51,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operating_briefings_deepened: 10,
  verified_phase83_collective_resilience_records_received: 0,
  production_land_water_or_sovereignty_findings: 0,
  provisioning_capacity_procurement_or_inventory_decisions: 0,
  food_access_nutrition_benefit_or_meal_decisions: 0,
  reserve_release_rationing_recall_or_remedy_decisions: 0,
  circularity_or_resource_security_findings: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-84-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 84 publishes exactly"));
const releaseGate = "Confirm Phase 84 publishes exactly 8 inactive food-production land-water-sovereignty dossiers, 8 inactive processing-storage-distribution local-provisioning ledgers, 8 inactive food-access affordability-nutrition institutional-meals registers, and 8 inactive reserve-contamination-circularity community-resource-security ledgers with 84 gates per chain and exact taxonomies, while creating zero land or water allocations, sovereignty findings, capacity findings, procurement decisions, community-benefit findings, food or benefit allocations, nutrition findings, reserve releases, rationing orders, recalls, remedies, circularity or security findings, receipts, scores, rankings, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);
manifest.notes = "This manifest records Waves 60B-60C through the Phase 84 food-systems and community-resource-security layer. Its 2,560 Phase 84 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 83 collective-resilience record, production baseline, land or water allocation, food-sovereignty finding, processing or storage capacity finding, procurement decision, community-benefit finding, workforce or inventory allocation, food-access, affordability, nutrition, benefit, or institutional-meal decision, reserve release, rationing order, recall, contamination remedy, circular-capacity or resource-security finding, independent audit, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 84 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 31 public JSON exports, 32 food-system routes, and 4,846 static pages.`);
