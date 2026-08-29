import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-registry.json");
const phase96 = await readJson(appRoot, "src", "data", "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const climate = registry.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers;
const pollution = registry.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers;
const ecosystems = registry.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers;
const planetary = registry.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers;

check(registry.phase === "97" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 97 registry metadata is invalid.");
check(registry.effective_date === "2026-08-27", "Phase 97 must use the current Edmonton calendar date.");
check(climate.length === 8 && pollution.length === 8 && ecosystems.length === 8 && planetary.length === 8, "Phase 97 must preserve four eight-record families.");
check(registry.climate_gates.length === 20 && registry.pollution_gates.length === 22 && registry.ecosystem_gates.length === 22 && registry.planetary_gates.length === 24, "Phase 97 must preserve an 88-gate chain.");
check(registry.climate_transition_classes.length === 14 && registry.climate_mitigation_dimensions.length === 12 && registry.climate_justice_safeguards.length === 12, "Phase 97 climate taxonomies are incomplete.");
check(registry.pollution_exposure_classes.length === 14 && registry.pollution_exposure_dimensions.length === 12 && registry.environmental_justice_safeguards.length === 12, "Phase 97 pollution taxonomies are incomplete.");
check(registry.ecosystem_classes.length === 14 && registry.ecosystem_integrity_dimensions.length === 12 && registry.biodiversity_rights_safeguards.length === 12, "Phase 97 ecosystem taxonomies are incomplete.");
check(registry.circularity_stewardship_classes.length === 14 && registry.planetary_stewardship_dimensions.length === 12 && registry.planetary_governance_safeguards.length === 12 && registry.long_horizon_planetary_tests.length === 12, "Phase 97 planetary taxonomies are incomplete.");

const cohorts = phase96.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["climate", climate, "greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossier_id", "climate_state", "climate_decision", "climate_checks", 20],
  ["pollution", pollution, "air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledger_id", "pollution_state", "pollution_decision", "pollution_checks", 22],
  ["ecosystem", ecosystems, "ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_register_id", "ecosystem_state", "ecosystem_decision", "ecosystem_checks", 22],
  ["planetary", planetary, "waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledger_id", "planetary_state", "planetary_decision", "planetary_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), `Phase 97 ${name} cohorts do not preserve Phase 96 identity.`);
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, `Phase 97 ${name} identities are not unique.`);
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", `${record[idKey]} is not a Published inactive contract.`);
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), `${record[idKey]} has an invalid gate set.`);
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", `${record[idKey]} crosses a review, automation, propagation, or stage boundary.`);
    for (const [key, value] of Object.entries(record)) if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records")) check(Array.isArray(value) && value.length === 0, `${record[idKey]} ${key} must remain empty.`);
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, `Phase 97 metric ${key} must remain zero.`);

const guides = ["environment-climate-ecosystems-pollution-waste-circularity-planetary-stewardship-doctrine-001", "greenhouse-gas-inventories-carbon-budgets-targets-delivered-decarbonization-001", "energy-transport-buildings-industry-land-use-climate-mitigation-001", "climate-adaptation-vulnerability-resilience-loss-and-damage-001", "air-quality-noise-toxic-exposure-environmental-health-001", "water-soil-chemical-pollution-remediation-environmental-justice-001", "ecosystems-biodiversity-habitat-connectivity-species-recovery-001", "forests-wetlands-freshwater-oceans-coasts-cryosphere-001", "waste-prevention-reuse-repair-recycling-circularity-001", "materials-product-stewardship-epr-ewaste-hazardous-waste-001", "indigenous-stewardship-environmental-rights-just-transition-001", "planetary-boundaries-monitoring-restoration-long-horizon-001"];
const maps = ["emissions-target-is-not-delivered-decarbonization", "permit-limit-is-not-healthy-exposure", "protected-area-designation-is-not-ecosystem-recovery", "waste-diversion-is-not-circular-material-stewardship", "adaptation-spending-is-not-reduced-climate-vulnerability", "restored-infrastructure-is-not-restored-community-or-ecosystem"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", `briefing-${slug}.mdx`), `Phase 97 guide ${slug} is missing.`);
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", `${slug}.json`), `Phase 97 map ${slug} is missing.`);
const guideIds = guides.map((slug) => `briefing-${slug}`), mapIds = maps.map((slug) => `dependency-map-${slug}`);
for (const pathwayId of new Set(climate.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 97 content.`); }
for (const id of new Set(climate.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", `${id}.mdx`)).includes("## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship boundary"), `${id} omits Phase 97.`);
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship boundary"), `${file} omits Phase 97.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 97 environment, climate, ecosystems, pollution, waste, circularity, and planetary-stewardship control"), `${file} omits Phase 97 control.`);

check(await exists(appRoot, "src", "pages", "evidence", "environment-climate-ecosystems-pollution-waste-circularity", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "environment-climate-ecosystems-pollution-waste-circularity", "[id].astro") && await exists(appRoot, "src", "pages", "data", "environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship.json.ts"), "Phase 97 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Environment, Climate, Ecosystems, Pollution, Waste, Circularity And Planetary-System Stewardship") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 97.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("environmentPlanetaryStewardshipRegistry") && sitemap.includes("/evidence/environment-climate-ecosystems-pollution-waste-circularity/"), "The sitemap omits Phase 97.");
const phase96Detail = await readText(appRoot, "src", "pages", "evidence", "mobility-transportation-freight-communications-digital-networks", "[id].astro");
check(phase96Detail.includes("Phase 97 Destination") && phase96Detail.includes("/evidence/environment-climate-ecosystems-pollution-waste-circularity/"), "Phase 96 detail routes omit the Phase 97 handoff.");
check(manifest.expected_build.static_pages >= 5509 && manifest.expected_build.public_json_exports >= 44 && manifest.expected_build.phase_97_greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_dossiers === 8 && manifest.expected_build.phase_97_air_water_soil_noise_chemical_pollution_exposure_environmental_justice_ledgers === 8 && manifest.expected_build.phase_97_ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_registers === 8 && manifest.expected_build.phase_97_waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers === 8 && manifest.expected_build.phase_97_synthetic_cases === 2560, "The release manifest omits Phase 97 counts.");
check(manifest.greenhouse_gas_emissions_climate_mitigation_decarbonization_transition_routes?.length === 8 && manifest.air_water_soil_noise_chemical_pollution_exposure_environmental_justice_routes?.length === 8 && manifest.ecosystems_biodiversity_habitat_land_freshwater_ocean_restoration_routes?.length === 8 && manifest.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_routes?.length === 8, "The release manifest omits Phase 97 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship.md"), "The Phase 97 work package is missing.");
if (failures.length) { console.error(`Phase 97 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 97 assertions passed: 8 inactive climate dossiers, 8 inactive pollution ledgers, 8 inactive ecosystem registers, 8 inactive planetary ledgers, 88 gates per chain, exact taxonomies, 10 pathways, and 0 mitigation, exposure, restoration, circularity, score, ranking, or Phase 64 decisions.");
