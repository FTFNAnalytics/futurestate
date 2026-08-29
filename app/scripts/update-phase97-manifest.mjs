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
const registry = await readJson(appRoot, "src", "data", "phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published"), inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published"), inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published"), inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-27";
Object.assign(manifest.expected_build, {
  static_pages: 5509, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length,
  briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length, public_json_exports: 44,
  phase_97_greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers: registry.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers.length,
  phase_97_air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers: registry.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers.length,
  phase_97_ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers: registry.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers.length,
  phase_97_waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers: registry.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers.length,
  phase_97_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5327;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 96 through Phase 97 environmental and planetary stewardship: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, forty-four public JSON exports, thirty-two inactive Phase 97 records, and zero mitigation, exposure, health, restoration, circularity, adaptation, recovery, score, ranking, or operating-outcome changes.`;
for (const command of ["npm run test:phase97", "npm run verify:phase97"]) if (!manifest.predeploy_commands.includes(command)) { const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release"); manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command); }

const routeFor = (record) => "/evidence/environment-climate-ecosystems-pollution-waste-circularity/" + record.slug + "/";
const climateRoutes = registry.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers.map(routeFor).sort();
const pollutionRoutes = registry.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers.map(routeFor).sort();
const ecosystemRoutes = registry.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers.map(routeFor).sort();
const planetaryRoutes = registry.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers.map(routeFor).sort();
const guides = ["environment-climate-ecosystems-pollution-waste-circularity-planetary-stewardship-doctrine-001", "greenhouse-gas-inventories-carbon-budgets-targets-delivered-decarbonization-001", "energy-transport-buildings-industry-land-use-climate-mitigation-001", "climate-adaptation-vulnerability-resilience-loss-and-damage-001", "air-quality-noise-toxic-exposure-environmental-health-001", "water-soil-chemical-pollution-remediation-environmental-justice-001", "ecosystems-biodiversity-habitat-connectivity-species-recovery-001", "forests-wetlands-freshwater-oceans-coasts-cryosphere-001", "waste-prevention-reuse-repair-recycling-circularity-001", "materials-product-stewardship-epr-ewaste-hazardous-waste-001", "indigenous-stewardship-environmental-rights-just-transition-001", "planetary-boundaries-monitoring-restoration-long-horizon-001"];
const phase97Maps = ["emissions-target-is-not-delivered-decarbonization", "permit-limit-is-not-healthy-exposure", "protected-area-designation-is-not-ecosystem-recovery", "waste-diversion-is-not-circular-material-stewardship", "adaptation-spending-is-not-reduced-climate-vulnerability", "restored-infrastructure-is-not-restored-community-or-ecosystem"];
for (const file of [
  "dist/data/environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship.json", "dist/evidence/environment-climate-ecosystems-pollution-waste-circularity/index.html",
  "dist" + climateRoutes[0] + "index.html", "dist" + climateRoutes.at(-1) + "index.html", "dist" + pollutionRoutes[0] + "index.html", "dist" + pollutionRoutes.at(-1) + "index.html",
  "dist" + ecosystemRoutes[0] + "index.html", "dist" + ecosystemRoutes.at(-1) + "index.html", "dist" + planetaryRoutes[0] + "index.html", "dist" + planetaryRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase97Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_routes = climateRoutes;
manifest.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_routes = pollutionRoutes;
manifest.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_routes = ecosystemRoutes;
manifest.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_routes = planetaryRoutes;

manifest.last_verified.date = "2026-08-27";
manifest.last_verified.static_pages_built = 5509;
manifest.last_verified.release_assertions = "passed-through-phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-97-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_97_delta = {
  captured_date: "2026-08-27", editorial_layer: "greenhouse-gas-inventories-carbon-budgets-targets-delivered-decarbonization-energy-transport-buildings-industry-land-use-climate-mitigation-climate-adaptation-vulnerability-resilience-loss-and-damage-air-quality-noise-toxic-exposure-environmental-health-water-soil-chemical-pollution-remediation-environmental-justice-ecosystems-biodiversity-habitat-connectivity-species-recovery-forests-wetlands-freshwater-oceans-coasts-cryosphere-waste-prevention-reuse-repair-recycling-circularity-materials-product-stewardship-epr-ewaste-hazardous-waste-indigenous-stewardship-environmental-rights-just-transition-planetary-boundaries-monitoring-restoration-long-horizon",
  greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers: 8, air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers: 8, ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers: 8, waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers: 8,
  climate_gates_per_dossier: 20, pollution_gates_per_ledger: 22, ecosystem_gates_per_register: 22, planetary_gates_per_ledger: 24, total_gates_per_chain: 88,
  synthetic_climate_cases: 640, synthetic_pollution_cases: 640, synthetic_ecosystem_cases: 640, synthetic_planetary_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase96_mobility_network_access_records_received: 0, climate_mitigation_decisions: 0, pollution_exposure_environmental_justice_decisions: 0, ecosystem_integrity_restoration_decisions: 0, circularity_adaptation_planetary_stewardship_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 98 Law, Justice, Public Safety, Emergency Management, Security, Defense And Peace",
  local_content_commit: "pending", deployment_status: "phase-97-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 97 publishes exactly"));
manifest.release_gates.push("Confirm Phase 97 publishes exactly 8 inactive greenhouse-gas-emissions-climate-mitigation-decarbonization-transition dossiers, 8 inactive air-water-soil-noise-chemical-pollution-exposure-environmental-justice ledgers, 8 inactive ecosystems-biodiversity-habitat-land-freshwater-ocean-restoration registers, and 8 inactive waste-materials-circularity-climate-adaptation-disaster-risk-planetary-system-stewardship ledgers with 88 gates per chain and exact taxonomies, while creating zero mitigation, exposure, health, compliance, remediation, ecosystem, biodiversity, restoration, circularity, adaptation, vulnerability, recovery, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 97 environmental and planetary-stewardship layer. Its 2,560 Phase 97 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 96 mobility or network-access record, emissions or mitigation decision, exposure or health finding, compliance or enforcement conclusion, ecosystem or biodiversity finding, restoration or circularity decision, adaptation or vulnerability finding, community or ecosystem recovery finding, planetary-boundary conclusion, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 97 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 44 public JSON exports, 32 environmental-stewardship routes, and 5,509 static pages.`);
