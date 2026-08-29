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
const registry = await readJson(appRoot, "src", "data", "phase-93-economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published"), inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published"), inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published"), inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-26";
Object.assign(manifest.expected_build, {
  static_pages: 5305, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length,
  briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length, public_json_exports: 40,
  phase_93_economic_development_mission_sector_strategy_production_ecosystem_dossiers: registry.economic_development_mission_sector_strategy_production_ecosystem_dossiers.length,
  phase_93_innovation_research_diffusion_commercialization_standards_ledgers: registry.innovation_research_diffusion_commercialization_standards_ledgers.length,
  phase_93_regional_cluster_corridor_supplier_workforce_convergence_registers: registry.regional_cluster_corridor_supplier_workforce_convergence_registers.length,
  phase_93_productive_transformation_diversification_decarbonization_shared_prosperity_ledgers: registry.productive_transformation_diversification_decarbonization_shared_prosperity_ledgers.length,
  phase_93_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5123;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 92 through Phase 93 economic development, industrial strategy, innovation systems, regional convergence, and productive transformation: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, forty public JSON exports, thirty-two inactive Phase 93 records, and zero mission, sector, firm, subsidy, procurement, innovation, readiness, standard, commercialization, adoption, cluster, supplier, workforce, convergence, transformation, score, ranking, or operating-outcome changes.`;
for (const command of ["npm run test:phase93", "npm run verify:phase93"]) if (!manifest.predeploy_commands.includes(command)) { const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release"); manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command); }

const routeFor = (record) => "/evidence/economic-development-industrial-strategy-productive-transformation/" + record.slug + "/";
const strategyRoutes = registry.economic_development_mission_sector_strategy_production_ecosystem_dossiers.map(routeFor).sort();
const innovationRoutes = registry.innovation_research_diffusion_commercialization_standards_ledgers.map(routeFor).sort();
const regionRoutes = registry.regional_cluster_corridor_supplier_workforce_convergence_registers.map(routeFor).sort();
const transformationRoutes = registry.productive_transformation_diversification_decarbonization_shared_prosperity_ledgers.map(routeFor).sort();
const guides = ["economic-development-industrial-strategy-innovation-regional-convergence-productive-transformation-doctrine-001", "missions-sector-strategies-policy-coherence-001", "production-ecosystems-inputs-infrastructure-coordination-001", "industrial-policy-instruments-subsidies-conditions-additionality-001", "research-development-demonstration-commercialization-001", "technology-diffusion-extension-standards-interoperability-001", "development-finance-public-procurement-market-shaping-001", "supplier-development-small-enterprise-cooperatives-domestic-value-001", "clusters-corridors-regional-innovation-local-governance-001", "workforce-skills-job-quality-just-transition-001", "diversification-decarbonization-resilience-productive-upgrading-001", "regional-convergence-shared-prosperity-long-horizon-transformation-001"];
const phase93Maps = ["subsidy-volume-is-not-additional-productive-capacity", "firm-attraction-is-not-rooted-regional-development", "patent-count-is-not-innovation-diffusion", "export-complexity-is-not-shared-prosperity", "infrastructure-spending-is-not-executable-production-ecosystem", "output-growth-is-not-just-productive-transformation"];
for (const file of [
  "dist/data/economic-development-industrial-strategy-innovation-systems-regional-convergence-productive-transformation.json", "dist/evidence/economic-development-industrial-strategy-productive-transformation/index.html",
  "dist" + strategyRoutes[0] + "index.html", "dist" + strategyRoutes.at(-1) + "index.html", "dist" + innovationRoutes[0] + "index.html", "dist" + innovationRoutes.at(-1) + "index.html",
  "dist" + regionRoutes[0] + "index.html", "dist" + regionRoutes.at(-1) + "index.html", "dist" + transformationRoutes[0] + "index.html", "dist" + transformationRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase93Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.economic_development_mission_sector_strategy_production_ecosystem_routes = strategyRoutes;
manifest.innovation_research_diffusion_commercialization_standards_routes = innovationRoutes;
manifest.regional_cluster_corridor_supplier_workforce_convergence_routes = regionRoutes;
manifest.productive_transformation_diversification_decarbonization_shared_prosperity_routes = transformationRoutes;

manifest.last_verified.date = "2026-08-26";
manifest.last_verified.static_pages_built = 5305;
manifest.last_verified.release_assertions = "passed-through-phase-93-economic-development-industrial-strategy-innovation-regional-convergence-productive-transformation";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-93-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-93-economic-development-industrial-strategy-innovation-regional-convergence-productive-transformation-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_93_delta = {
  captured_date: "2026-08-26", editorial_layer: "economic-development-missions-sector-strategies-production-ecosystems-industrial-policy-instruments-subsidies-conditions-additionality-research-development-demonstration-validation-commercialization-technology-diffusion-extension-standards-interoperability-development-finance-public-procurement-market-shaping-supplier-development-small-enterprise-cooperatives-domestic-value-clusters-corridors-regional-innovation-local-governance-workforce-skills-job-quality-just-transition-diversification-decarbonization-resilience-productive-upgrading-regional-convergence-shared-prosperity-long-horizon-transformation",
  economic_development_mission_sector_strategy_production_ecosystem_dossiers: 8, innovation_research_diffusion_commercialization_standards_ledgers: 8, regional_cluster_corridor_supplier_workforce_convergence_registers: 8, productive_transformation_diversification_decarbonization_shared_prosperity_ledgers: 8,
  strategy_gates_per_dossier: 20, innovation_gates_per_ledger: 20, region_gates_per_register: 22, transformation_gates_per_ledger: 24, total_gates_per_chain: 86,
  synthetic_strategy_cases: 640, synthetic_innovation_cases: 640, synthetic_region_cases: 640, synthetic_transformation_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase92_macro_records_received: 0, mission_sector_strategy_production_ecosystem_decisions: 0, innovation_diffusion_commercialization_standards_decisions: 0, regional_cluster_supplier_workforce_convergence_decisions: 0, productive_transformation_diversification_decarbonization_shared_prosperity_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 94 Energy, Materials, Manufacturing, Logistics And Strategic Supply-Chain Transformation",
  local_content_commit: "pending", deployment_status: "phase-93-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 93 publishes exactly"));
manifest.release_gates.push("Confirm Phase 93 publishes exactly 8 inactive economic-development-mission-sector-strategy-production-ecosystem dossiers, 8 inactive innovation-research-diffusion-commercialization-standards ledgers, 8 inactive regional-cluster-corridor-supplier-workforce-convergence registers, and 8 inactive productive-transformation-diversification-decarbonization-shared-prosperity ledgers with 86 gates per chain and exact taxonomies, while creating zero mission, sector, firm, subsidy, procurement, additionality, capacity, research-validity, readiness, patent, licence, standard, certification, commercialization, adoption, cluster, corridor, supplier, workforce, convergence, productivity, diversification, decarbonization, resilience, shared-prosperity, just-transformation, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 93 economic-development, industrial-strategy, innovation-system, regional-convergence, and productive-transformation layer. Its 2,560 Phase 93 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 92 macroeconomic record, mission, sector priority, firm selection, subsidy, procurement, investment allocation, additionality or capacity finding, research-validity or readiness conclusion, patent, licence, standard, certification, commercialization or adoption decision, cluster or corridor designation, supplier or workforce decision, regional-convergence finding, productivity, diversification, decarbonization, resilience, shared-prosperity or just-transformation conclusion, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 93 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 40 public JSON exports, 32 development routes, and 5,305 static pages.`);
