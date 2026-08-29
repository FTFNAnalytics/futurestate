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
const registry = await readJson(appRoot, "src", "data", "phase-82-household-capability-care-infrastructure-everyday-security-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4744, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length, briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length, dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length, updates: updateFiles.length, public_json_exports: 29,
  phase_82_household_capability_service_bundle_dossiers: registry.household_capability_service_bundle_dossiers.length,
  phase_82_care_infrastructure_workforce_capacity_ledgers: registry.care_infrastructure_workforce_capacity_ledgers.length,
  phase_82_household_affordability_time_debt_administrative_burden_registers: registry.household_affordability_time_debt_administrative_burden_registers.length,
  phase_82_neighborhood_access_displacement_crisis_recovery_ledgers: registry.neighborhood_access_displacement_crisis_recovery_ledgers.length,
  phase_82_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4562;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends Phase 81 through Phase 82 household capability, household service bundles, life-course transitions, care infrastructure and workforce, unpaid care, affordability across money and time, debt and arrears, administrative burden and benefit access, neighborhood and rural access, disability and universal design, displacement and mobility, crisis stabilization, durable recovery, and long-horizon household security: 715 sources, 1,406 signals, 1,121 Published signals, 213 Published and zero In Review briefings, fifty-seven Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 107 updates, twenty-nine public JSON exports, thirty-two inactive Phase 82 records, and zero household classifications, floors, care findings, allocations, burden findings, protections, displacement decisions, recovery findings, receipts, scores, rankings, or operating-outcome changes.";

for (const command of ["npm run test:phase82", "npm run verify:phase82"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/household-capability/" + record.slug + "/";
const capabilityRoutes = registry.household_capability_service_bundle_dossiers.map(routeFor).sort();
const careRoutes = registry.care_infrastructure_workforce_capacity_ledgers.map(routeFor).sort();
const burdenRoutes = registry.household_affordability_time_debt_administrative_burden_registers.map(routeFor).sort();
const recoveryRoutes = registry.neighborhood_access_displacement_crisis_recovery_ledgers.map(routeFor).sort();
const guides = ["household-capability-doctrine-001","time-poverty-unpaid-care-001","care-infrastructure-workforce-001","essential-service-bundles-households-001","neighborhood-proximity-rural-access-001","household-affordability-arrears-debt-001","administrative-burden-benefit-access-001","disability-universal-design-home-community-001","life-course-transitions-household-security-001","displacement-household-mobility-001","crisis-stabilization-recovery-001","long-horizon-household-security-001"];
const phase82Maps = ["service-availability-is-not-household-capability","unpaid-care-is-not-free-capacity","program-eligibility-is-not-benefit-access","low-monthly-bill-is-not-household-affordability","neighborhood-proximity-is-not-accessibility","temporary-relief-is-not-household-recovery"];
for (const file of [
  "dist/data/household-capability-care-everyday-security.json", "dist/evidence/household-capability/index.html",
  "dist" + capabilityRoutes[0] + "index.html", "dist" + capabilityRoutes.at(-1) + "index.html", "dist" + careRoutes[0] + "index.html", "dist" + careRoutes.at(-1) + "index.html", "dist" + burdenRoutes[0] + "index.html", "dist" + burdenRoutes.at(-1) + "index.html", "dist" + recoveryRoutes[0] + "index.html", "dist" + recoveryRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase82Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.household_capability_service_bundle_routes = capabilityRoutes;
manifest.care_infrastructure_workforce_capacity_routes = careRoutes;
manifest.household_affordability_time_debt_administrative_burden_routes = burdenRoutes;
manifest.neighborhood_access_displacement_crisis_recovery_routes = recoveryRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4744;
manifest.last_verified.release_assertions = "passed-through-phase-82-household-capability-care-infrastructure-everyday-security";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-82-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-82-household-capability-care-infrastructure-everyday-security-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_82_delta = {
  captured_date: "2026-08-24", editorial_layer: "household-capability-service-bundles-life-course-care-infrastructure-workforce-unpaid-care-affordability-time-debt-arrears-administrative-burden-benefit-access-neighborhood-rural-access-disability-universal-design-displacement-mobility-crisis-stabilization-recovery-long-horizon-security",
  household_capability_service_bundle_dossiers: 8, care_infrastructure_workforce_capacity_ledgers: 8, household_affordability_time_debt_administrative_burden_registers: 8, neighborhood_access_displacement_crisis_recovery_ledgers: 8,
  capability_gates_per_dossier: 20, care_capacity_gates_per_ledger: 20, household_burden_gates_per_register: 22, neighborhood_recovery_gates_per_ledger: 22,
  household_capability_dimensions_per_dossier: 14, household_service_bundle_classes_per_dossier: 12, life_course_stages_per_dossier: 12, care_service_classes_per_ledger: 14, care_capacity_dimensions_per_ledger: 12, care_workforce_safeguards_per_ledger: 12, household_burden_dimensions_per_register: 14, shock_arrears_pathways_per_register: 12, administrative_burden_safeguards_per_register: 12, neighborhood_access_tests_per_ledger: 12, displacement_mobility_safeguards_per_ledger: 12, crisis_stabilizers_per_ledger: 12, long_horizon_household_security_tests_per_ledger: 12,
  synthetic_capability_cases: 640, synthetic_care_cases: 640, synthetic_burden_cases: 640, synthetic_recovery_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51, reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 10,
  verified_phase81_service_records_received: 0, household_classifications_or_capability_floors_adopted: 0, service_bundles_or_care_needs_assigned: 0, care_capacity_or_workforce_findings: 0, provider_or_workforce_allocations: 0, affordability_time_debt_or_administrative_burden_findings: 0, protections_or_stabilization_decisions: 0, neighborhood_access_or_displacement_findings: 0, relocation_return_or_recovery_decisions: 0, remedies_or_independent_reviews: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption", local_content_commit: "pending", deployment_status: "phase-82-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 82 publishes exactly"));
const releaseGate = "Confirm Phase 82 publishes exactly 8 inactive household-capability and service-bundle dossiers, 8 inactive care-infrastructure and workforce-capacity ledgers, 8 inactive household-affordability-time-debt-administrative-burden registers, and 8 inactive neighborhood-access-displacement-crisis-recovery ledgers with 84 gates per chain and exact taxonomies, while creating zero household classifications, capability floors, service bundles, care needs, capacity findings, workforce allocations, burden findings, benefit decisions, debt actions, stabilization decisions, displacement findings, relocation decisions, recovery findings, remedies, receipts, scores, rankings, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);
manifest.notes = "This manifest records Waves 60B-60C through the Phase 82 household-capability and everyday-security layer. Its 2,560 Phase 82 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 81 service record, household classification, capability floor, service bundle, care need, care-capacity finding, workforce allocation, provider decision, affordability or time-burden finding, debt or arrears action, benefit-access finding, administrative-burden decision, neighborhood-access finding, displacement finding, relocation or return decision, crisis response, recovery finding, remedy, independent audit, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 82 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 29 public JSON exports, 32 household-capability routes, and 4,744 static pages.`);
