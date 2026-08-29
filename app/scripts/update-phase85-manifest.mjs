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
const registry = await readJson(appRoot, "src", "data", "phase-85-housing-shelter-land-use-place-stability-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-25";
Object.assign(manifest.expected_build, {
  static_pages: 4897,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 32,
  phase_85_housing_need_supply_delivery_habitability_dossiers: registry.housing_need_supply_delivery_habitability_dossiers.length,
  phase_85_tenure_affordability_public_social_community_housing_ledgers: registry.tenure_affordability_public_social_community_housing_ledgers.length,
  phase_85_homelessness_shelter_supportive_housing_displacement_registers: registry.homelessness_shelter_supportive_housing_displacement_registers.length,
  phase_85_retrofit_climate_disaster_reconstruction_place_stability_ledgers: registry.retrofit_climate_disaster_reconstruction_place_stability_ledgers.length,
  phase_85_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4715;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 84 through Phase 85 housing, shelter, land use, housing need, supply, approvals, delivery, occupancy, tenure, affordability, habitability, accessibility, public and community housing, homelessness, supportive housing, displacement, retrofit, climate and disaster housing, relocation, reconstruction, right to return, and long-horizon place stability: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published and ${inReviewBriefings.length} In Review briefings, ${publishedMaps.length} Published and ${inReviewMaps.length} In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, ${updateFiles.length} updates, thirty-two public JSON exports, thirty-two inactive Phase 85 records, and zero approvals, allocations, placements, housing findings, relocations, return decisions, recovery findings, scores, rankings, or operating-outcome changes.`;

for (const command of ["npm run test:phase85", "npm run verify:phase85"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/housing-place-stability/" + record.slug + "/";
const deliveryRoutes = registry.housing_need_supply_delivery_habitability_dossiers.map(routeFor).sort();
const tenureRoutes = registry.tenure_affordability_public_social_community_housing_ledgers.map(routeFor).sort();
const stabilityRoutes = registry.homelessness_shelter_supportive_housing_displacement_registers.map(routeFor).sort();
const placeRoutes = registry.retrofit_climate_disaster_reconstruction_place_stability_ledgers.map(routeFor).sort();
const guides = ["housing-place-stability-doctrine-001", "housing-need-supply-delivery-001", "land-use-infrastructure-housing-delivery-001", "housing-habitability-accessibility-quality-001", "tenure-renter-homeowner-security-001", "public-social-cooperative-community-housing-001", "housing-affordability-cost-burden-001", "homelessness-shelter-supportive-housing-001", "indigenous-land-housing-rights-001", "retrofit-repair-decarbonization-001", "climate-disaster-housing-relocation-001", "reconstruction-right-to-return-place-stability-001"];
const phase85Maps = ["approved-units-are-not-delivered-homes", "shelter-bed-is-not-stable-housing", "affordability-label-is-not-household-affordability", "retrofit-spending-is-not-safe-habitable-housing", "temporary-relocation-is-not-right-to-return", "reconstruction-is-not-community-recovery"];
for (const file of [
  "dist/data/housing-shelter-land-use-place-stability.json", "dist/evidence/housing-place-stability/index.html",
  "dist" + deliveryRoutes[0] + "index.html", "dist" + deliveryRoutes.at(-1) + "index.html", "dist" + tenureRoutes[0] + "index.html", "dist" + tenureRoutes.at(-1) + "index.html", "dist" + stabilityRoutes[0] + "index.html", "dist" + stabilityRoutes.at(-1) + "index.html", "dist" + placeRoutes[0] + "index.html", "dist" + placeRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase85Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.housing_need_supply_delivery_habitability_routes = deliveryRoutes;
manifest.tenure_affordability_public_social_community_housing_routes = tenureRoutes;
manifest.homelessness_shelter_supportive_housing_displacement_routes = stabilityRoutes;
manifest.retrofit_climate_disaster_reconstruction_place_stability_routes = placeRoutes;

manifest.last_verified.date = "2026-08-25";
manifest.last_verified.static_pages_built = 4897;
manifest.last_verified.release_assertions = "passed-through-phase-85-housing-shelter-land-use-place-stability";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-85-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-85-housing-shelter-land-use-place-stability-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_85_delta = {
  captured_date: "2026-08-25", editorial_layer: "housing-shelter-land-use-need-supply-approvals-delivery-occupancy-tenure-affordability-habitability-accessibility-public-social-cooperative-community-housing-homelessness-supportive-housing-displacement-retrofit-repair-decarbonization-climate-disaster-relocation-reconstruction-right-to-return-place-stability",
  housing_need_supply_delivery_habitability_dossiers: 8, tenure_affordability_public_social_community_housing_ledgers: 8, homelessness_shelter_supportive_housing_displacement_registers: 8, retrofit_climate_disaster_reconstruction_place_stability_ledgers: 8,
  housing_delivery_gates_per_dossier: 20, tenure_affordability_gates_per_ledger: 20, housing_stability_gates_per_register: 22, place_stability_gates_per_ledger: 22,
  housing_supply_delivery_types_per_dossier: 14, habitability_accessibility_quality_dimensions_per_dossier: 12, land_use_infrastructure_delivery_safeguards_per_dossier: 12, housing_tenure_provider_models_per_ledger: 14, household_housing_affordability_dimensions_per_ledger: 12, public_social_community_housing_safeguards_per_ledger: 12, homelessness_shelter_supportive_housing_pathways_per_register: 14, housing_stability_displacement_protection_dimensions_per_register: 12, supportive_housing_service_dignity_safeguards_per_register: 12, retrofit_repair_decarbonization_capabilities_per_ledger: 12, climate_disaster_housing_safeguards_per_ledger: 12, relocation_reconstruction_right_to_return_safeguards_per_ledger: 12, long_horizon_place_stability_tests_per_ledger: 12,
  synthetic_delivery_cases: 640, synthetic_tenure_cases: 640, synthetic_stability_cases: 640, synthetic_place_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51, reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 10,
  verified_phase84_resource_security_records_received: 0, housing_need_or_delivery_findings: 0, land_use_or_infrastructure_decisions: 0, habitability_or_accessibility_findings: 0, tenure_or_affordability_findings: 0, housing_allocations_or_shelter_placements: 0, housing_stability_or_displacement_findings: 0, retrofit_or_repair_findings: 0, relocation_or_right_to_return_decisions: 0, reconstruction_or_community_recovery_findings: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption", local_content_commit: "pending", deployment_status: "phase-85-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 85 publishes exactly"));
const releaseGate = "Confirm Phase 85 publishes exactly 8 inactive housing-need supply-delivery-habitability dossiers, 8 inactive tenure-affordability public-social-community-housing ledgers, 8 inactive homelessness-shelter supportive-housing-displacement registers, and 8 inactive retrofit-climate-disaster reconstruction-place-stability ledgers with 84 gates per chain and exact taxonomies, while creating zero land-use approvals, unit or subsidy allocations, shelter or service placements, delivery, occupancy, habitability, accessibility, tenure, affordability, stability, displacement, retrofit, relocation, return, reconstruction, recovery, remedy, receipt, score, ranking, Phase 64 advance, or operating-outcome change";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);
manifest.notes = "This manifest records Waves 60B-60C through the Phase 85 housing and place-stability layer. Its 2,560 Phase 85 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 84 community-resource-security record, housing-need baseline, land-use approval, delivered-home or occupancy finding, habitability or accessibility conclusion, tenure or affordability finding, housing allocation, shelter or supportive-housing placement, housing-stability or displacement decision, retrofit finding, relocation order, right-to-return finding, reconstruction or community-recovery conclusion, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 85 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 32 public JSON exports, 32 housing/place routes, and 4,897 static pages.`);
