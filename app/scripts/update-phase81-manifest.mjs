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
const registry = await readJson(appRoot, "src", "data", "phase-81-universal-service-essential-systems-public-option-delivery-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4693, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length, briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length, dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length, updates: updateFiles.length, public_json_exports: 28,
  phase_81_service_floor_universal_access_dossiers: registry.service_floor_universal_access_dossiers.length,
  phase_81_affordability_cross_subsidy_coverage_ledgers: registry.affordability_cross_subsidy_coverage_ledgers.length,
  phase_81_provider_plurality_interoperability_continuity_registers: registry.provider_plurality_interoperability_continuity_registers.length,
  phase_81_rights_quality_step_in_restoration_ledgers: registry.rights_quality_step_in_restoration_ledgers.length,
  phase_81_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4511;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends Phase 80 through Phase 81 universal-service floors, eligible publics, access, affordability, cross-subsidy, coverage and capacity, provider plurality, public options, interoperability and portability, maintenance and continuity, mutual aid, user rights and remedies, quality and reliability, provider failure and step-in, emergency rationing, restoration, and long-horizon service accountability: 715 sources, 1,406 signals, 1,121 Published signals, 201 Published and zero In Review briefings, fifty-one Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 106 updates, twenty-eight public JSON exports, thirty-two inactive Phase 81 records, and zero service-floor, fiscal, provider, intervention, restoration, score, ranking, receipt, or operating-outcome changes.";

for (const command of ["npm run test:phase81", "npm run verify:phase81"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const floorRoutes = registry.service_floor_universal_access_dossiers.map((record) => "/evidence/essential-services/" + record.slug + "/").sort();
const affordabilityRoutes = registry.affordability_cross_subsidy_coverage_ledgers.map((record) => "/evidence/essential-services/" + record.slug + "/").sort();
const providerRoutes = registry.provider_plurality_interoperability_continuity_registers.map((record) => "/evidence/essential-services/" + record.slug + "/").sort();
const restorationRoutes = registry.rights_quality_step_in_restoration_ledgers.map((record) => "/evidence/essential-services/" + record.slug + "/").sort();
const guides = ["universal-service-doctrine-001", "essential-service-floors-001", "eligibility-access-nondiscrimination-001", "affordability-cross-subsidy-001", "coverage-capacity-access-001", "public-options-provider-plurality-001", "interoperability-open-standards-data-portability-001", "accessibility-user-rights-remedy-001", "continuity-mutual-aid-essential-systems-001", "service-quality-reliability-state-good-repair-001", "provider-failure-step-in-public-option-001", "emergency-rationing-restoration-long-horizon-accountability-001"];
const phase81Maps = ["infrastructure-coverage-is-not-service-access", "low-average-price-is-not-affordability", "provider-presence-is-not-universal-service", "technical-interface-is-not-interoperability-rights", "average-uptime-is-not-universal-quality", "emergency-rationing-is-not-permanent-service-reduction"];
for (const file of [
  "dist/data/universal-service-essential-systems-public-options.json", "dist/evidence/essential-services/index.html",
  "dist" + floorRoutes[0] + "index.html", "dist" + floorRoutes.at(-1) + "index.html", "dist" + affordabilityRoutes[0] + "index.html", "dist" + affordabilityRoutes.at(-1) + "index.html", "dist" + providerRoutes[0] + "index.html", "dist" + providerRoutes.at(-1) + "index.html", "dist" + restorationRoutes[0] + "index.html", "dist" + restorationRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase81Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.service_floor_universal_access_routes = floorRoutes;
manifest.affordability_cross_subsidy_coverage_routes = affordabilityRoutes;
manifest.provider_plurality_interoperability_continuity_routes = providerRoutes;
manifest.rights_quality_step_in_restoration_routes = restorationRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4693;
manifest.last_verified.release_assertions = "passed-through-phase-81-universal-service-essential-systems-public-option-delivery";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-81-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-81-universal-service-essential-systems-public-option-delivery-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_81_delta = {
  captured_date: "2026-08-24", editorial_layer: "universal-service-essential-systems-service-floors-access-affordability-cross-subsidy-coverage-capacity-provider-plurality-public-options-interoperability-portability-continuity-rights-quality-step-in-rationing-restoration-remedy",
  service_floor_universal_access_dossiers: 8, affordability_cross_subsidy_coverage_ledgers: 8, provider_plurality_interoperability_continuity_registers: 8, rights_quality_step_in_restoration_ledgers: 8,
  service_floor_gates_per_dossier: 20, affordability_coverage_gates_per_ledger: 20, provider_continuity_gates_per_register: 22, rights_restoration_gates_per_ledger: 22,
  essential_service_classes_per_dossier: 14, service_floor_dimensions_per_dossier: 14, eligibility_access_duties_per_dossier: 12, affordability_protections_per_ledger: 12, cross_subsidy_mechanisms_per_ledger: 12, coverage_access_dimensions_per_ledger: 12, provider_operating_models_per_register: 12, interoperability_requirements_per_register: 14, continuity_capabilities_per_register: 12, user_rights_per_ledger: 14, quality_measures_per_ledger: 14, failure_triggers_per_ledger: 12, restoration_duties_per_ledger: 12,
  synthetic_service_floor_cases: 640, synthetic_affordability_cases: 640, synthetic_provider_cases: 640, synthetic_restoration_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51, reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 10,
  verified_phase80_realization_records_received: 0, service_floors_or_eligibility_rules_adopted: 0, tariffs_subsidies_or_cross_subsidies_authorized: 0, coverage_access_or_quality_findings: 0, provider_models_or_open_standards_authorized: 0, continuity_or_mutual_aid_activations: 0, rights_or_remedies_issued: 0, provider_failures_or_step_in_decisions: 0, emergency_rationing_or_restoration_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption", local_content_commit: "pending", deployment_status: "phase-81-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 81 publishes exactly"));
const releaseGate = "Confirm Phase 81 publishes exactly 8 inactive service-floor and universal-access dossiers, 8 inactive affordability-cross-subsidy-coverage ledgers, 8 inactive provider-plurality-interoperability-continuity registers, and 8 inactive rights-quality-step-in-restoration ledgers with 84 gates per chain and exact taxonomies, while creating zero classifications, floors, eligibility decisions, tariffs, subsidies, coverage findings, provider decisions, standards, continuity findings, rights findings, interventions, rationing rules, restoration priorities, remedies, receipts, scores, rankings, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);
manifest.notes = "This manifest records Waves 60B-60C through the Phase 81 universal-service and essential-systems layer. Its 2,560 Phase 81 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 80 realization record, essential-service class, service floor, eligibility rule, tariff, subsidy, cross-subsidy, coverage or access finding, provider authorization, open standard, interoperability finding, continuity exercise, rights charter, quality finding, provider-failure trigger, step-in decision, rationing rule, restoration priority, remedy, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 81 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 28 public JSON exports, 32 essential-service routes, and 4,693 static pages.`);
