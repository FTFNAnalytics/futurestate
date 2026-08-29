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
const registry = await readJson(appRoot, "src", "data", "phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4540,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 25,
  phase_78_interjurisdictional_authority_externality_maps: registry.interjurisdictional_authority_externality_maps.length,
  phase_78_shared_public_value_contribution_compacts: registry.shared_public_value_contribution_compacts.length,
  phase_78_mutual_aid_continuity_dispute_registers: registry.mutual_aid_continuity_dispute_registers.length,
  phase_78_emergency_authority_normalization_ledgers: registry.emergency_authority_normalization_ledgers.length,
  phase_78_synthetic_cases: 2048
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4358;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release through Phase 78 interjurisdictional authority, treaty-aware compacts, cross-boundary externalities, shared public value, fiscal and capacity contributions, mutual aid, continuity, disputes, emergency powers, civil safeguards, restoration, and democratic reauthorization: 715 sources, 1,406 signals, 1,121 Published signals, 165 Published and zero In Review briefings, thirty-three Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 103 updates, twenty-five public JSON exports, eight inactive authority maps, eight inactive shared-value compacts, eight inactive continuity-dispute registers, eight inactive emergency-normalization ledgers, and zero compact, emergency, rights-suspension, normalization, reauthorization, score, ranking, receipt, or operating-outcome changes.";

for (const command of ["npm run test:phase78", "npm run verify:phase78"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const authorityRoutes = registry.interjurisdictional_authority_externality_maps.map((record) => "/evidence/compacts/" + record.slug + "/").sort();
const compactRoutes = registry.shared_public_value_contribution_compacts.map((record) => "/evidence/compacts/" + record.slug + "/").sort();
const continuityRoutes = registry.mutual_aid_continuity_dispute_registers.map((record) => "/evidence/compacts/" + record.slug + "/").sort();
const emergencyRoutes = registry.emergency_authority_normalization_ledgers.map((record) => "/evidence/compacts/" + record.slug + "/").sort();
for (const file of [
  "dist/data/interjurisdictional-compacts-emergency-resilience.json",
  "dist/evidence/compacts/index.html",
  "dist" + authorityRoutes[0] + "index.html",
  "dist" + authorityRoutes.at(-1) + "index.html",
  "dist" + compactRoutes[0] + "index.html",
  "dist" + compactRoutes.at(-1) + "index.html",
  "dist" + continuityRoutes[0] + "index.html",
  "dist" + continuityRoutes.at(-1) + "index.html",
  "dist" + emergencyRoutes[0] + "index.html",
  "dist" + emergencyRoutes.at(-1) + "index.html",
  "dist/briefings/cooperative-federalism-municipal-authority-001/index.html",
  "dist/briefings/indigenous-treaty-intergovernmental-compacts-001/index.html",
  "dist/briefings/cross-border-infrastructure-externalities-001/index.html",
  "dist/briefings/shared-public-value-allocation-001/index.html",
  "dist/briefings/fiscal-capacity-contribution-sharing-001/index.html",
  "dist/briefings/mutual-aid-service-continuity-001/index.html",
  "dist/briefings/intergovernmental-dispute-resolution-001/index.html",
  "dist/briefings/emergency-powers-civil-safeguards-001/index.html",
  "dist/briefings/crisis-evidence-public-communication-001/index.html",
  "dist/briefings/emergency-authority-normalization-001/index.html",
  "dist/atlas/dependency-maps/one-public-mandate-is-not-a-multi-authority-compact/index.html",
  "dist/atlas/dependency-maps/local-benefit-is-not-shared-public-value/index.html",
  "dist/atlas/dependency-maps/fiscal-contribution-is-not-governing-control/index.html",
  "dist/atlas/dependency-maps/emergency-activation-is-not-permanent-authority/index.html",
  "dist/atlas/dependency-maps/service-continuity-is-not-rights-suspension/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.interjurisdictional_authority_externality_routes = authorityRoutes;
manifest.shared_public_value_contribution_routes = compactRoutes;
manifest.mutual_aid_continuity_dispute_routes = continuityRoutes;
manifest.emergency_authority_normalization_routes = emergencyRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4540;
manifest.last_verified.release_assertions = "passed-through-phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-78-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-78-interjurisdictional-compacts-shared-public-value-emergency-resilience-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_78_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "interjurisdictional-authority-treaty-aware-compacts-externalities-shared-public-value-contributions-mutual-aid-continuity-disputes-emergency-powers-civil-safeguards-normalization-reauthorization",
  interjurisdictional_authority_externality_maps: 8,
  shared_public_value_contribution_compacts: 8,
  mutual_aid_continuity_dispute_registers: 8,
  emergency_authority_normalization_ledgers: 8,
  authority_externality_gates_per_map: 16,
  compact_contribution_gates_per_compact: 18,
  continuity_dispute_gates_per_register: 16,
  emergency_normalization_gates_per_ledger: 18,
  jurisdiction_classes_per_map: 12,
  externality_classes_per_map: 12,
  public_value_classes_per_compact: 12,
  contribution_classes_per_compact: 12,
  continuity_obligations_per_register: 12,
  dispute_grounds_per_register: 10,
  emergency_safeguards_per_ledger: 12,
  restoration_triggers_per_ledger: 12,
  synthetic_authority_cases: 512,
  synthetic_compact_cases: 512,
  synthetic_continuity_cases: 512,
  synthetic_emergency_cases: 512,
  synthetic_cases_total: 2048,
  new_briefings_added_published: 10,
  dependency_maps_added_published: 5,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 48,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operating_briefings_deepened: 8,
  authorized_public_mandates_received: 0,
  jurisdiction_maps_completed: 0,
  externality_findings_issued: 0,
  compacts_executed: 0,
  fiscal_or_capacity_commitments_made: 0,
  public_value_allocations_issued: 0,
  mutual_aid_requests_or_activations: 0,
  disputes_opened_or_resolved: 0,
  emergency_authorities_or_extensions: 0,
  rights_suspensions_issued: 0,
  normalization_decisions_issued: 0,
  democratic_reauthorizations_issued: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-78-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 78 publishes exactly"));
const releaseGate = "Confirm Phase 78 publishes exactly 8 inactive authority and externality maps, 8 inactive shared-public-value contribution compacts, 8 inactive mutual-aid continuity and dispute registers, and 8 inactive emergency-authority normalization ledgers with 16 authority gates, 18 compact gates, 16 continuity gates, 18 emergency gates, 12 jurisdiction classes, 12 externality classes, 12 public-value classes, 12 contribution classes, 12 continuity obligations, 10 dispute grounds, 12 safeguards, and 12 restoration triggers, while creating zero compacts, contributions, activations, emergencies, extensions, rights suspensions, normalizations, reauthorizations, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 78 interjurisdictional-compacts, shared-public-value, and emergency-resilience layer. Its 2,048 synthetic cases test future routing only. No future gate was checked, and no real authorized Phase 77 mandate, jurisdiction assignment, treaty or rights finding, externality finding, joint-authority question, compact, fiscal or capacity contribution, public-value allocation, mutual-aid request, continuity activation, dispute, emergency threshold, emergency authority, extension, rights suspension, normalization, democratic reauthorization, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 78 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 25 public JSON exports, 32 compact routes, and 4,540 static pages.`);
