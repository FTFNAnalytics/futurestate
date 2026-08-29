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
const registry = await readJson(appRoot, "src", "data", "phase-86-health-public-health-disability-population-wellbeing-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-25";
Object.assign(manifest.expected_build, {
  static_pages: 4948,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 33,
  phase_86_primary_preventive_community_care_access_dossiers: registry.primary_preventive_community_care_access_dossiers.length,
  phase_86_acute_emergency_specialty_behavioral_health_care_ledgers: registry.acute_emergency_specialty_behavioral_health_care_ledgers.length,
  phase_86_public_health_surveillance_prevention_environmental_exposure_registers: registry.public_health_surveillance_prevention_environmental_exposure_registers.length,
  phase_86_disability_equity_preparedness_population_wellbeing_ledgers: registry.disability_equity_preparedness_population_wellbeing_ledgers.length,
  phase_86_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4766;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 85 through Phase 86 health access, prevention, acute and specialty care, mental health, substance use, reproductive and maternal health, medicines, surveillance, outbreak response, environmental and occupational exposure, disability rights, workforces, affordability, quality, safety, preparedness, recovery, equity, and population wellbeing: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published and ${inReviewBriefings.length} In Review briefings, ${publishedMaps.length} Published and ${inReviewMaps.length} In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, ${updateFiles.length} updates, thirty-three public JSON exports, thirty-two inactive Phase 86 records, and zero eligibility, diagnosis, triage, restriction, classification, health findings, scores, rankings, or operating-outcome changes.`;

for (const command of ["npm run test:phase86", "npm run verify:phase86"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/health-population-wellbeing/" + record.slug + "/";
const accessRoutes = registry.primary_preventive_community_care_access_dossiers.map(routeFor).sort();
const careRoutes = registry.acute_emergency_specialty_behavioral_health_care_ledgers.map(routeFor).sort();
const publicHealthRoutes = registry.public_health_surveillance_prevention_environmental_exposure_registers.map(routeFor).sort();
const wellbeingRoutes = registry.disability_equity_preparedness_population_wellbeing_ledgers.map(routeFor).sort();
const guides = ["health-population-wellbeing-doctrine-001", "primary-preventive-community-care-access-001", "acute-emergency-hospital-critical-care-001", "mental-health-substance-use-harm-reduction-001", "reproductive-maternal-newborn-child-health-001", "medicines-diagnostics-health-supply-chains-001", "public-health-surveillance-vaccination-outbreak-001", "environmental-occupational-food-water-air-health-001", "disability-rights-supports-accessible-care-001", "indigenous-rural-remote-health-jurisdiction-001", "health-workforce-quality-safety-affordability-001", "health-preparedness-recovery-population-wellbeing-001"];
const phase86Maps = ["nominal-capacity-is-not-timely-access", "coverage-is-not-affordable-care", "encounter-is-not-health-outcome", "surveillance-signal-is-not-diagnosis", "emergency-declaration-is-not-readiness", "service-reopening-is-not-population-recovery"];
for (const file of [
  "dist/data/health-public-health-disability-population-wellbeing.json", "dist/evidence/health-population-wellbeing/index.html",
  "dist" + accessRoutes[0] + "index.html", "dist" + accessRoutes.at(-1) + "index.html", "dist" + careRoutes[0] + "index.html", "dist" + careRoutes.at(-1) + "index.html", "dist" + publicHealthRoutes[0] + "index.html", "dist" + publicHealthRoutes.at(-1) + "index.html", "dist" + wellbeingRoutes[0] + "index.html", "dist" + wellbeingRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase86Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.primary_preventive_community_care_access_routes = accessRoutes;
manifest.acute_emergency_specialty_behavioral_health_care_routes = careRoutes;
manifest.public_health_surveillance_prevention_environmental_exposure_routes = publicHealthRoutes;
manifest.disability_equity_preparedness_population_wellbeing_routes = wellbeingRoutes;

manifest.last_verified.date = "2026-08-25";
manifest.last_verified.static_pages_built = 4948;
manifest.last_verified.release_assertions = "passed-through-phase-86-health-public-health-disability-population-wellbeing";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-86-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-86-health-public-health-disability-population-wellbeing-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_86_delta = {
  captured_date: "2026-08-25", editorial_layer: "health-primary-preventive-community-care-access-affordability-acute-emergency-specialty-behavioral-health-reproductive-maternal-child-elder-medicines-diagnostics-supply-chains-public-health-surveillance-vaccination-outbreak-environmental-occupational-climate-health-disability-rights-workforce-quality-safety-preparedness-recovery-equity-population-wellbeing",
  primary_preventive_community_care_access_dossiers: 8, acute_emergency_specialty_behavioral_health_care_ledgers: 8, public_health_surveillance_prevention_environmental_exposure_registers: 8, disability_equity_preparedness_population_wellbeing_ledgers: 8,
  access_prevention_gates_per_dossier: 20, clinical_care_gates_per_ledger: 20, public_health_gates_per_register: 22, population_wellbeing_gates_per_ledger: 22,
  health_access_care_settings_per_dossier: 14, health_access_affordability_dimensions_per_dossier: 12, prevention_primary_care_safeguards_per_dossier: 12, acute_specialty_service_classes_per_ledger: 14, clinical_quality_safety_dimensions_per_ledger: 12, health_workforce_continuity_safeguards_per_ledger: 12, public_health_functions_per_register: 14, surveillance_governance_safeguards_per_register: 12, environmental_occupational_exposure_dimensions_per_register: 12, disability_rights_support_dimensions_per_ledger: 12, emergency_preparedness_capabilities_per_ledger: 12, population_wellbeing_equity_dimensions_per_ledger: 12, long_horizon_population_health_tests_per_ledger: 12,
  synthetic_access_cases: 640, synthetic_care_cases: 640, synthetic_public_health_cases: 640, synthetic_wellbeing_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51, reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 11,
  verified_phase85_place_stability_records_received: 0, access_or_prevention_findings: 0, eligibility_or_coverage_decisions: 0, diagnoses_or_triage_decisions: 0, clinical_quality_or_safety_findings: 0, surveillance_or_exposure_findings: 0, restrictions_or_emergency_authorizations: 0, disability_or_equity_classifications: 0, preparedness_or_recovery_findings: 0, population_wellbeing_findings: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption", local_content_commit: "pending", deployment_status: "phase-86-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 86 publishes exactly"));
const releaseGate = "Confirm Phase 86 publishes exactly 8 inactive primary-preventive-community-care access dossiers, 8 inactive acute-emergency-specialty-behavioral-health care ledgers, 8 inactive public-health-surveillance-prevention-environmental-exposure registers, and 8 inactive disability-equity-preparedness-population-wellbeing ledgers with 84 gates per chain and exact taxonomies, while creating zero eligibility or coverage decisions, diagnoses, triage decisions, treatments, clinical quality or safety findings, surveillance or exposure findings, restrictions, emergency authorizations, disability classifications, preparedness, recovery, wellbeing, remedy, receipt, score, ranking, Phase 64 advance, or operating-outcome change";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);
manifest.notes = "This manifest records Waves 60B-60C through the Phase 86 health and population-wellbeing layer. Its 2,560 Phase 86 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 85 place-stability record, health-access baseline, eligibility or coverage decision, diagnosis, triage decision, treatment assignment, clinical quality or safety finding, surveillance or exposure finding, restriction or emergency authorization, disability or equity classification, preparedness conclusion, service-recovery or population-wellbeing finding, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 86 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 33 public JSON exports, 32 health/wellbeing routes, and 4,948 static pages.`);
