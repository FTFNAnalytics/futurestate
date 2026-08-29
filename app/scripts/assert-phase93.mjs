import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-93-economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation-registry.json");
const phase92 = await readJson(appRoot, "src", "data", "phase-92-fiscal-policy-public-revenue-sovereign-debt-trade-external-balance-macroeconomic-coordination-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const strategies = registry.economic_development_mission_sector_strategy_production_ecosystem_dossiers;
const innovation = registry.innovation_research_diffusion_commercialization_standards_ledgers;
const regions = registry.regional_cluster_corridor_supplier_workforce_convergence_registers;
const transformation = registry.productive_transformation_diversification_decarbonization_shared_prosperity_ledgers;

check(registry.phase === "93" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 93 registry metadata is invalid.");
check(strategies.length === 8 && innovation.length === 8 && regions.length === 8 && transformation.length === 8, "Phase 93 must preserve four eight-record families.");
check(registry.strategy_gates.length === 20 && registry.innovation_gates.length === 20 && registry.region_gates.length === 22 && registry.transformation_gates.length === 24, "Phase 93 must preserve an 86-gate chain.");
check(registry.development_mission_sector_strategy_classes.length === 14 && registry.production_ecosystem_readiness_dimensions.length === 12 && registry.industrial_strategy_additionality_governance_safeguards.length === 12, "Phase 93 strategy taxonomies are incomplete.");
check(registry.innovation_research_transfer_pathways.length === 14 && registry.innovation_diffusion_commercialization_dimensions.length === 12 && registry.innovation_access_public_return_safeguards.length === 12, "Phase 93 innovation taxonomies are incomplete.");
check(registry.regional_cluster_corridor_network_classes.length === 14 && registry.regional_supplier_workforce_infrastructure_dimensions.length === 12 && registry.regional_equity_convergence_anchoring_safeguards.length === 12, "Phase 93 regional taxonomies are incomplete.");
check(registry.productive_transformation_strategy_classes.length === 14 && registry.productive_capability_distribution_dimensions.length === 12 && registry.productive_transformation_democratic_safeguards.length === 12 && registry.long_horizon_productive_transformation_tests.length === 12, "Phase 93 transformation taxonomies are incomplete.");

const cohorts = phase92.trade_external_balance_supply_resilience_macroeconomic_coordination_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["strategy", strategies, "economic_development_mission_sector_strategy_production_ecosystem_dossier_id", "strategy_state", "strategy_decision", "strategy_checks", 20],
  ["innovation", innovation, "innovation_research_diffusion_commercialization_standards_ledger_id", "innovation_state", "innovation_decision", "innovation_checks", 20],
  ["region", regions, "regional_cluster_corridor_supplier_workforce_convergence_register_id", "region_state", "region_decision", "region_checks", 22],
  ["transformation", transformation, "productive_transformation_diversification_decarbonization_shared_prosperity_ledger_id", "transformation_state", "transformation_decision", "transformation_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), `Phase 93 ${name} cohorts do not preserve Phase 92 identity.`);
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, `Phase 93 ${name} identities are not unique.`);
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", `${record[idKey]} is not a Published inactive contract.`);
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), `${record[idKey]} has an invalid gate set.`);
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", `${record[idKey]} crosses a review, automation, propagation, or stage boundary.`);
    for (const [key, value] of Object.entries(record)) if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records") && key !== "innovation_research_transfer_pathway_records") check(Array.isArray(value) && value.length === 0, `${record[idKey]} ${key} must remain empty.`);
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, `Phase 93 metric ${key} must remain zero.`);

const guides = ["economic-development-industrial-strategy-innovation-regional-convergence-productive-transformation-doctrine-001", "missions-sector-strategies-policy-coherence-001", "production-ecosystems-inputs-infrastructure-coordination-001", "industrial-policy-instruments-subsidies-conditions-additionality-001", "research-development-demonstration-commercialization-001", "technology-diffusion-extension-standards-interoperability-001", "development-finance-public-procurement-market-shaping-001", "supplier-development-small-enterprise-cooperatives-domestic-value-001", "clusters-corridors-regional-innovation-local-governance-001", "workforce-skills-job-quality-just-transition-001", "diversification-decarbonization-resilience-productive-upgrading-001", "regional-convergence-shared-prosperity-long-horizon-transformation-001"];
const maps = ["subsidy-volume-is-not-additional-productive-capacity", "firm-attraction-is-not-rooted-regional-development", "patent-count-is-not-innovation-diffusion", "export-complexity-is-not-shared-prosperity", "infrastructure-spending-is-not-executable-production-ecosystem", "output-growth-is-not-just-productive-transformation"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", `briefing-${slug}.mdx`), `Phase 93 guide ${slug} is missing.`);
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", `${slug}.json`), `Phase 93 map ${slug} is missing.`);
const guideIds = guides.map((slug) => `briefing-${slug}`), mapIds = maps.map((slug) => `dependency-map-${slug}`);
for (const pathwayId of new Set(strategies.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 93 content.`); }
for (const id of new Set(strategies.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", `${id}.mdx`)).includes("## Phase 93 economic development, industrial strategy, innovation systems, regional convergence, and productive transformation boundary"), `${id} omits Phase 93.`);
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 93 economic development, industrial strategy, innovation systems, regional convergence, and productive transformation boundary"), `${file} omits Phase 93.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 93 economic development, industrial strategy, innovation systems, regional convergence, and productive transformation control"), `${file} omits Phase 93 control.`);

check(await exists(appRoot, "src", "pages", "evidence", "economic-development-industrial-strategy-productive-transformation", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "economic-development-industrial-strategy-productive-transformation", "[id].astro") && await exists(appRoot, "src", "pages", "data", "economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation.json.ts"), "Phase 93 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Economic Development, Industrial Strategy, Innovation Systems, Regional Convergence And Productive Transformation") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 93.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("economicDevelopmentTransformationRegistry") && sitemap.includes("/evidence/economic-development-industrial-strategy-productive-transformation/"), "The sitemap omits Phase 93.");
const phase92Detail = await readText(appRoot, "src", "pages", "evidence", "fiscal-revenue-debt-trade-macro-coordination", "[id].astro");
check(phase92Detail.includes("Phase 93 Destination") && phase92Detail.includes("/evidence/economic-development-industrial-strategy-productive-transformation/"), "Phase 92 detail routes omit the Phase 93 handoff.");
check(manifest.expected_build.static_pages >= 5305 && manifest.expected_build.public_json_exports >= 40 && manifest.expected_build.phase_93_economic_development_mission_sector_strategy_production_ecosystem_dossiers === 8 && manifest.expected_build.phase_93_innovation_research_diffusion_commercialization_standards_ledgers === 8 && manifest.expected_build.phase_93_regional_cluster_corridor_supplier_workforce_convergence_registers === 8 && manifest.expected_build.phase_93_productive_transformation_diversification_decarbonization_shared_prosperity_ledgers === 8 && manifest.expected_build.phase_93_synthetic_cases === 2560, "The release manifest omits Phase 93 counts.");
check(manifest.economic_development_mission_sector_strategy_production_ecosystem_routes?.length === 8 && manifest.innovation_research_diffusion_commercialization_standards_routes?.length === 8 && manifest.regional_cluster_corridor_supplier_workforce_convergence_routes?.length === 8 && manifest.productive_transformation_diversification_decarbonization_shared_prosperity_routes?.length === 8, "The release manifest omits Phase 93 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-93-economic-development-industrial-strategy-innovation-regional-convergence-productive-transformation.md"), "The Phase 93 work package is missing.");
if (failures.length) { console.error(`Phase 93 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 93 assertions passed: 8 inactive strategy dossiers, 8 inactive innovation ledgers, 8 inactive region registers, 8 inactive transformation ledgers, 86 gates per chain, exact taxonomies, 10 pathways, and 0 mission, innovation, convergence, transformation, score, ranking, or Phase 64 decisions.");
