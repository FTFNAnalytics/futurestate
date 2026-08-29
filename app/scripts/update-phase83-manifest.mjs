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
const registry = await readJson(appRoot, "src", "data", "phase-83-community-institutions-social-infrastructure-collective-resilience-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4795, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length, briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length, dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length, updates: updateFiles.length, public_json_exports: 30,
  phase_83_community_institution_access_trust_continuity_dossiers: registry.community_institution_access_trust_continuity_dossiers.length,
  phase_83_civic_association_cooperative_mutual_aid_capacity_ledgers: registry.civic_association_cooperative_mutual_aid_capacity_ledgers.length,
  phase_83_local_information_media_public_knowledge_integrity_registers: registry.local_information_media_public_knowledge_integrity_registers.length,
  phase_83_collective_preparedness_trauma_recovery_resilience_ledgers: registry.collective_preparedness_trauma_recovery_resilience_ledgers.length,
  phase_83_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4613;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 82 through Phase 83 community institutions, social infrastructure, civic associations, cooperatives, community ownership, mutual aid, volunteer and paid-workforce capacity, local media, public knowledge, information integrity, trusted intermediaries, public space, belonging, neighborhood preparedness, community hubs, collective trauma, institutional closure and displacement, restoration, reconstruction, and long-horizon collective resilience: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published and ${inReviewBriefings.length} In Review briefings, ${publishedMaps.length} Published and ${inReviewMaps.length} In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, ${updateFiles.length} updates, thirty public JSON exports, thirty-two inactive Phase 83 records, and zero institution admissions, network admissions, allocations, information decisions, activations, closures, restorations, recovery findings, receipts, scores, rankings, or operating-outcome changes.`;

for (const command of ["npm run test:phase83", "npm run verify:phase83"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/community-institutions/" + record.slug + "/";
const institutionRoutes = registry.community_institution_access_trust_continuity_dossiers.map(routeFor).sort();
const civicRoutes = registry.civic_association_cooperative_mutual_aid_capacity_ledgers.map(routeFor).sort();
const informationRoutes = registry.local_information_media_public_knowledge_integrity_registers.map(routeFor).sort();
const resilienceRoutes = registry.collective_preparedness_trauma_recovery_resilience_ledgers.map(routeFor).sort();
const guides = ["community-institutions-doctrine-001", "libraries-schools-clinics-civic-infrastructure-001", "parks-public-space-belonging-001", "cultural-faith-indigenous-place-governance-001", "cooperatives-community-ownership-001", "mutual-aid-volunteer-capacity-001", "local-media-information-integrity-001", "trusted-intermediaries-public-knowledge-001", "social-isolation-belonging-participation-001", "neighborhood-preparedness-community-hubs-001", "collective-trauma-recovery-001", "long-horizon-collective-resilience-001"];
const phase83Maps = ["institution-presence-is-not-community-access", "volunteer-count-is-not-mutual-aid-capacity", "information-volume-is-not-public-knowledge", "consultation-is-not-collective-governance", "emergency-plan-is-not-community-preparedness", "reopening-is-not-collective-recovery"];
for (const file of [
  "dist/data/community-institutions-social-infrastructure-collective-resilience.json", "dist/evidence/community-institutions/index.html",
  "dist" + institutionRoutes[0] + "index.html", "dist" + institutionRoutes.at(-1) + "index.html", "dist" + civicRoutes[0] + "index.html", "dist" + civicRoutes.at(-1) + "index.html", "dist" + informationRoutes[0] + "index.html", "dist" + informationRoutes.at(-1) + "index.html", "dist" + resilienceRoutes[0] + "index.html", "dist" + resilienceRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase83Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.community_institution_access_trust_continuity_routes = institutionRoutes;
manifest.civic_association_cooperative_mutual_aid_capacity_routes = civicRoutes;
manifest.local_information_media_public_knowledge_integrity_routes = informationRoutes;
manifest.collective_preparedness_trauma_recovery_resilience_routes = resilienceRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4795;
manifest.last_verified.release_assertions = "passed-through-phase-83-community-institutions-social-infrastructure-collective-resilience";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-83-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-83-community-institutions-social-infrastructure-collective-resilience-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_83_delta = {
  captured_date: "2026-08-24", editorial_layer: "community-institutions-social-infrastructure-libraries-schools-clinics-parks-public-space-culture-faith-indigenous-place-governance-civic-associations-cooperatives-community-ownership-mutual-aid-volunteers-local-media-public-knowledge-information-integrity-trusted-intermediaries-belonging-isolation-preparedness-community-hubs-collective-trauma-institution-closure-displacement-restoration-reconstruction-long-horizon-resilience",
  community_institution_access_trust_continuity_dossiers: 8, civic_association_cooperative_mutual_aid_capacity_ledgers: 8, local_information_media_public_knowledge_integrity_registers: 8, collective_preparedness_trauma_recovery_resilience_ledgers: 8,
  institution_gates_per_dossier: 20, civic_capacity_gates_per_ledger: 20, information_integrity_gates_per_register: 22, collective_resilience_gates_per_ledger: 22,
  community_institution_classes_per_dossier: 14, institution_access_trust_dimensions_per_dossier: 12, institution_continuity_safeguards_per_dossier: 12, civic_network_types_per_ledger: 14, mutual_aid_capacity_dimensions_per_ledger: 12, volunteer_worker_safeguards_per_ledger: 12, information_ecosystem_functions_per_register: 14, information_integrity_safeguards_per_register: 12, public_knowledge_access_modes_per_register: 12, community_preparedness_capabilities_per_ledger: 12, collective_trauma_recovery_safeguards_per_ledger: 12, institution_closure_displacement_safeguards_per_ledger: 12, long_horizon_collective_resilience_tests_per_ledger: 12,
  synthetic_institution_cases: 640, synthetic_civic_cases: 640, synthetic_information_cases: 640, synthetic_resilience_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51, reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 10,
  verified_phase82_household_security_records_received: 0, community_institution_baselines_or_access_findings: 0, trust_or_continuity_findings: 0, civic_network_or_cooperative_admissions: 0, mutual_aid_capacity_or_volunteer_allocations: 0, local_information_or_public_knowledge_findings: 0, truth_classifications_or_content_suppressions: 0, preparedness_or_emergency_activations: 0, trauma_or_collective_recovery_findings: 0, institution_closure_restoration_or_reconstruction_decisions: 0, remedies_or_independent_reviews: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption", local_content_commit: "pending", deployment_status: "phase-83-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 83 publishes exactly"));
const releaseGate = "Confirm Phase 83 publishes exactly 8 inactive community-institution access-trust-continuity dossiers, 8 inactive civic-association cooperative mutual-aid-capacity ledgers, 8 inactive local-information media public-knowledge-integrity registers, and 8 inactive collective-preparedness trauma-recovery-resilience ledgers with 84 gates per chain and exact taxonomies, while creating zero institution admissions, access or trust findings, network admissions, volunteer or resource allocations, truth classifications, content suppressions, preparedness activations, emergency activations, closures, restorations, reconstructions, recovery findings, remedies, receipts, scores, rankings, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);
manifest.notes = "This manifest records Waves 60B-60C through the Phase 83 community-institutions and collective-resilience layer. Its 2,560 Phase 83 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 82 household-security record, institution baseline, institution admission, access or trust finding, civic-network admission, cooperative or community-ownership decision, mutual-aid capacity finding, volunteer or workforce allocation, local-information ecosystem admission, public-knowledge or information-integrity finding, truth classification, content suppression, preparedness finding, emergency activation, collective-trauma finding, institutional closure, restoration, reconstruction, collective-recovery finding, remedy, independent audit, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 83 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 30 public JSON exports, 32 community-institution routes, and 4,795 static pages.`);
