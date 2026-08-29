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
const registry = await readJson(appRoot, "src", "data", "phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");
const order = registry.international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers;
const multilateral = registry.multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers;
const mobility = registry.migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers;
const futures = registry.global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers;

manifest.generated_date = "2026-08-27";
Object.assign(manifest.expected_build, {
  static_pages: 5662,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 47,
  phase_100_international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers: order.length,
  phase_100_multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers: multilateral.length,
  phase_100_migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers: mobility.length,
  phase_100_global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers: futures.length,
  phase_100_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5480;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends Phase 99 through Phase 100 international order, multilateral cooperation, humanitarian responsibility, global commons, cross-border risk and shared human futures: 715 sources, 1,406 signals, 1,121 Published signals, " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, fifteen reader pathways, sixteen evidence gaps, " + updates.length + " updates, forty-seven public JSON exports, thirty-two inactive Phase 100 records, and zero treaty, multilateral, humanitarian, global-commons, shared-futures, score, ranking, or operating-outcome changes.";
for (const command of ["npm run test:phase100", "npm run verify:phase100"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const routeFor = (record) => "/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/" + record.slug + "/";
const orderRoutes = order.map(routeFor).sort();
const multilateralRoutes = multilateral.map(routeFor).sort();
const mobilityRoutes = mobility.map(routeFor).sort();
const futuresRoutes = futures.map(routeFor).sort();
const guides = [
  "international-order-multilateral-cooperation-global-commons-shared-futures-doctrine-001",
  "diplomacy-recognition-negotiation-peaceful-dispute-resolution-001",
  "treaties-ratification-domestic-implementation-compliance-001",
  "multilateral-membership-representation-voice-influence-reform-001",
  "development-cooperation-finance-additionality-local-ownership-delivery-001",
  "collective-action-coordination-burden-sharing-crisis-capability-001",
  "migration-mobility-rights-safe-regular-pathways-001",
  "refugee-asylum-displacement-humanitarian-protection-responsibility-001",
  "climate-ocean-biodiversity-polar-global-commons-stewardship-001",
  "pandemic-biosecurity-cross-border-health-risk-coordination-001",
  "digital-space-nuclear-cyber-frontier-catastrophic-risk-001",
  "future-generations-intergenerational-equity-shared-human-futures-001"
];
const phase100Maps = ["treaty-signed-is-not-effective-cooperation", "institutional-membership-is-not-equal-representation-or-influence", "global-commitment-is-not-financed-delivery", "data-sharing-is-not-coordinated-cross-border-risk-reduction", "shared-resource-designation-is-not-governed-stewardship", "global-goal-is-not-a-secured-shared-human-future"];
for (const file of [
  "dist/data/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures.json",
  "dist/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/index.html",
  "dist" + orderRoutes[0] + "index.html",
  "dist" + orderRoutes.at(-1) + "index.html",
  "dist" + multilateralRoutes[0] + "index.html",
  "dist" + multilateralRoutes.at(-1) + "index.html",
  "dist" + mobilityRoutes[0] + "index.html",
  "dist" + mobilityRoutes.at(-1) + "index.html",
  "dist" + futuresRoutes[0] + "index.html",
  "dist" + futuresRoutes.at(-1) + "index.html",
  ...guides.map((slug) => "dist/briefings/" + slug + "/index.html"),
  ...phase100Maps.map((slug) => "dist/atlas/dependency-maps/" + slug + "/index.html")
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_routes = orderRoutes;
manifest.multilateral_institutions_representation_development_cooperation_collective_delivery_routes = multilateralRoutes;
manifest.migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_routes = mobilityRoutes;
manifest.global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_routes = futuresRoutes;

manifest.last_verified.date = "2026-08-27";
manifest.last_verified.static_pages_built = 5662;
manifest.last_verified.release_assertions = "passed-through-phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-100-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_100_delta = {
  captured_date: "2026-08-27",
  editorial_layer: "international-order-diplomacy-treaties-international-law-peaceful-dispute-resolution-multilateral-institutions-representation-development-cooperation-collective-delivery-migration-displacement-refugee-asylum-humanitarian-protection-shared-responsibility-global-commons-transboundary-risk-catastrophic-risk-intergenerational-shared-human-futures",
  international_order_dossiers: 8,
  multilateral_collective_delivery_ledgers: 8,
  humanitarian_shared_responsibility_registers: 8,
  global_commons_shared_futures_ledgers: 8,
  international_order_gates_per_dossier: 20,
  multilateral_gates_per_ledger: 22,
  humanitarian_gates_per_register: 22,
  shared_futures_gates_per_ledger: 24,
  total_gates_per_chain: 88,
  synthetic_international_order_cases: 640,
  synthetic_multilateral_cases: 640,
  synthetic_humanitarian_cases: 640,
  synthetic_shared_futures_cases: 640,
  synthetic_cases_total: 2560,
  new_briefings_added_published: 12,
  dependency_maps_added_published: 6,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 51,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operating_briefings_deepened: 12,
  verified_phase99_legitimacy_resilience_records_received: 0,
  international_order_treaty_decisions: 0,
  multilateral_representation_delivery_decisions: 0,
  migration_humanitarian_protection_decisions: 0,
  global_commons_shared_futures_decisions: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 101 Whole-System Futures, Scenario Governance, Polycrisis Readiness, Civilizational Resilience And Future Generations",
  local_content_commit: "pending",
  deployment_status: "phase-100-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 100 publishes exactly"));
manifest.release_gates.push("Confirm Phase 100 publishes exactly 8 inactive international-order dossiers, 8 inactive multilateral collective-delivery ledgers, 8 inactive humanitarian shared-responsibility registers, and 8 inactive global-commons shared-futures ledgers with 88 gates per chain and exact taxonomies, while creating zero treaty, international-order, representation, delivery, migration, protection, stewardship, cross-border-risk, shared-futures, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 100 international-order, multilateral-cooperation, humanitarian-responsibility, global-commons, cross-border-risk and shared-human-futures layer. Its 2,560 Phase 100 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 99 democratic-legitimacy record, treaty, international-law, multilateral, representation, finance, delivery, migration, asylum, refugee, humanitarian, global-commons, risk-reduction, catastrophic-risk, intergenerational, shared-futures, independent-review, receipt, signal-promotion, named-file-stage, Phase 64 cell, score, rank, or operating-outcome decision was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Phase 100 manifest updated: " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, " + updates.length + " updates, 47 public JSON exports, 32 Phase 100 routes, and 5,662 static pages.");
