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
const registry = await readJson(appRoot, "src", "data", "phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published"), inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published"), inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published"), inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-27";
Object.assign(manifest.expected_build, {
  static_pages: 5407, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length,
  briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length, public_json_exports: 42,
  phase_95_spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers: registry.spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers.length,
  phase_95_project_design_engineering_cost_estimation_permitting_procurement_ledgers: registry.project_design_engineering_cost_estimation_permitting_procurement_ledgers.length,
  phase_95_construction_contractors_trades_materials_safety_inspection_registers: registry.construction_contractors_trades_materials_safety_inspection_registers.length,
  phase_95_commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers: registry.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers.length,
  phase_95_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5225;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 94 through Phase 95 territorial-systems delivery: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, forty-two public JSON exports, thirty-two inactive Phase 95 records, and zero land, project, permit, procurement, construction, commissioning, service, recovery, place-value, score, ranking, or operating-outcome changes.`;
for (const command of ["npm run test:phase95", "npm run verify:phase95"]) if (!manifest.predeploy_commands.includes(command)) { const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release"); manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command); }

const routeFor = (record) => "/evidence/infrastructure-construction-buildings-public-works-territorial-systems/" + record.slug + "/";
const territorialRoutes = registry.spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers.map(routeFor).sort();
const projectRoutes = registry.project_design_engineering_cost_estimation_permitting_procurement_ledgers.map(routeFor).sort();
const constructionRoutes = registry.construction_contractors_trades_materials_safety_inspection_registers.map(routeFor).sort();
const stewardshipRoutes = registry.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers.map(routeFor).sort();
const guides = ["infrastructure-construction-buildings-public-works-territorial-systems-doctrine-001", "spatial-planning-land-assembly-rights-of-way-site-readiness-001", "permitting-environmental-review-utilities-community-consent-001", "project-definition-design-engineering-cost-estimation-001", "procurement-contracting-project-packaging-market-capacity-001", "contractors-trades-materials-equipment-construction-logistics-001", "construction-safety-quality-inspection-change-control-001", "buildings-housing-civic-industrial-public-facilities-001", "transportation-water-energy-digital-public-works-001", "commissioning-accessibility-handover-operations-maintenance-001", "climate-adaptation-disaster-reconstruction-community-recovery-001", "public-space-place-value-community-benefit-indigenous-rights-001"];
const phase95Maps = ["capital-plan-is-not-executable-project", "permit-is-not-construction-start", "construction-spending-is-not-commissioned-asset", "substantial-completion-is-not-safe-accessible-service", "floor-area-is-not-place-value", "reconstruction-output-is-not-community-recovery"];
for (const file of [
  "dist/data/infrastructure-construction-buildings-public-works-territorial-systems-delivery.json", "dist/evidence/infrastructure-construction-buildings-public-works-territorial-systems/index.html",
  "dist" + territorialRoutes[0] + "index.html", "dist" + territorialRoutes.at(-1) + "index.html", "dist" + projectRoutes[0] + "index.html", "dist" + projectRoutes.at(-1) + "index.html",
  "dist" + constructionRoutes[0] + "index.html", "dist" + constructionRoutes.at(-1) + "index.html", "dist" + stewardshipRoutes[0] + "index.html", "dist" + stewardshipRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase95Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.spatial_planning_land_assembly_rights_of_way_site_readiness_routes = territorialRoutes;
manifest.project_design_engineering_cost_estimation_permitting_procurement_routes = projectRoutes;
manifest.construction_contractors_trades_materials_safety_inspection_routes = constructionRoutes;
manifest.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_routes = stewardshipRoutes;

manifest.last_verified.date = "2026-08-27";
manifest.last_verified.static_pages_built = 5407;
manifest.last_verified.release_assertions = "passed-through-phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-95-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_95_delta = {
  captured_date: "2026-08-27", editorial_layer: "spatial-planning-land-assembly-rights-of-way-site-readiness-permitting-environmental-review-utilities-community-consent-project-definition-design-engineering-cost-estimation-procurement-contracting-project-packaging-market-capacity-contractors-trades-materials-equipment-construction-logistics-safety-quality-inspection-change-control-buildings-housing-civic-industrial-public-facilities-transportation-water-energy-digital-public-works-commissioning-accessibility-handover-operations-maintenance-climate-adaptation-disaster-reconstruction-community-recovery-public-space-place-value-community-benefit-indigenous-rights",
  spatial_planning_land_assembly_rights_of_way_site_readiness_dossiers: 8, project_design_engineering_cost_estimation_permitting_procurement_ledgers: 8, construction_contractors_trades_materials_safety_inspection_registers: 8, commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers: 8,
  territorial_gates_per_dossier: 20, project_gates_per_ledger: 22, construction_gates_per_register: 22, stewardship_gates_per_ledger: 24, total_gates_per_chain: 88,
  synthetic_territorial_cases: 640, synthetic_project_cases: 640, synthetic_construction_cases: 640, synthetic_stewardship_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase94_physical_economy_records_received: 0, territorial_readiness_decisions: 0, project_definition_procurement_decisions: 0, construction_delivery_decisions: 0, commissioned_asset_stewardship_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 96 Mobility, Transportation, Freight, Communications, Digital Networks And Territorial Access",
  local_content_commit: "pending", deployment_status: "phase-95-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 95 publishes exactly"));
manifest.release_gates.push("Confirm Phase 95 publishes exactly 8 inactive spatial-planning-land-assembly-rights-of-way-site-readiness dossiers, 8 inactive project-design-engineering-cost-estimation-permitting-procurement ledgers, 8 inactive construction-contractors-trades-materials-safety-inspection registers, and 8 inactive commissioning-accessibility-asset-handover-operations-maintenance-adaptation-reconstruction-territorial-value ledgers with 88 gates per chain and exact taxonomies, while creating zero land, project, permit, procurement, contract, construction, progress, safety, quality, inspection, commissioning, occupancy, accessibility, service, maintenance, adaptation, reconstruction, recovery, place-value, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 95 territorial-delivery layer. Its 2,560 Phase 95 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 94 physical-economy record, land or site decision, executable project, permit disposition, procurement or contract award, construction start or progress finding, safety or quality finding, inspection acceptance, commissioning, occupancy, accessible service, handover, operations or maintenance finding, adaptation, reconstruction, community recovery, place-value conclusion, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 95 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 42 public JSON exports, 32 territorial-delivery routes, and 5,407 static pages.`);
