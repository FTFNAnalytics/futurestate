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
const registry = await readJson(appRoot, "src", "data", "phase-80-public-investment-portfolios-transition-pathways-place-based-capacity-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4642, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length, briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length, dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length, updates: updateFiles.length, public_json_exports: 27,
  phase_80_public_investment_mission_thesis_dossiers: registry.public_investment_mission_thesis_dossiers.length,
  phase_80_portfolio_membership_dependency_sequence_registers: registry.portfolio_membership_dependency_sequence_registers.length,
  phase_80_place_based_delivery_capacity_transition_ledgers: registry.place_based_delivery_capacity_transition_ledgers.length,
  phase_80_portfolio_stress_rebalancing_realization_ledgers: registry.portfolio_stress_rebalancing_realization_ledgers.length,
  phase_80_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4460;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends Phase 79 through Phase 80 public-investment missions, theses, portfolio membership, dependencies, capital sequencing, funding and financing, delivery institutions, workforce and supplier readiness, land-water-energy constraints, place-based obligations, just transition, option preservation, off-ramps, stress rebalancing, and public-value realization: 715 sources, 1,406 signals, 1,121 Published signals, 189 Published and zero In Review briefings, forty-five Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 105 updates, twenty-seven public JSON exports, thirty-two inactive Phase 80 records, and zero selection, priority, funding, financing, allocation, readiness, rebalancing, realization, score, ranking, receipt, or operating-outcome changes.";

for (const command of ["npm run test:phase80", "npm run verify:phase80"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const thesisRoutes = registry.public_investment_mission_thesis_dossiers.map((record) => "/evidence/investment-portfolios/" + record.slug + "/").sort();
const portfolioRoutes = registry.portfolio_membership_dependency_sequence_registers.map((record) => "/evidence/investment-portfolios/" + record.slug + "/").sort();
const capacityRoutes = registry.place_based_delivery_capacity_transition_ledgers.map((record) => "/evidence/investment-portfolios/" + record.slug + "/").sort();
const realizationRoutes = registry.portfolio_stress_rebalancing_realization_ledgers.map((record) => "/evidence/investment-portfolios/" + record.slug + "/").sort();
const guides = ["public-investment-doctrine-001", "mission-thesis-public-purpose-001", "portfolio-construction-without-ranking-001", "dependency-capital-sequencing-001", "public-funding-versus-financing-001", "delivery-institutions-owner-capacity-001", "workforce-supplier-readiness-001", "land-water-energy-infrastructure-constraints-001", "place-based-value-just-transition-001", "option-preservation-stage-gates-offramps-001", "portfolio-stress-rebalancing-concentration-001", "public-value-realization-transition-accountability-001"];
const phase80Maps = ["project-list-is-not-investment-portfolio", "funding-is-not-financing-capacity", "earliest-ready-is-not-highest-public-priority", "procurement-capacity-is-not-delivery-capacity", "local-expenditure-is-not-just-transition", "delivered-output-is-not-realized-public-value"];
for (const file of [
  "dist/data/public-investment-portfolios-transition-capacity.json", "dist/evidence/investment-portfolios/index.html",
  "dist" + thesisRoutes[0] + "index.html", "dist" + thesisRoutes.at(-1) + "index.html", "dist" + portfolioRoutes[0] + "index.html", "dist" + portfolioRoutes.at(-1) + "index.html", "dist" + capacityRoutes[0] + "index.html", "dist" + capacityRoutes.at(-1) + "index.html", "dist" + realizationRoutes[0] + "index.html", "dist" + realizationRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase80Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.public_investment_mission_thesis_routes = thesisRoutes;
manifest.portfolio_membership_dependency_sequence_routes = portfolioRoutes;
manifest.place_based_delivery_capacity_transition_routes = capacityRoutes;
manifest.portfolio_stress_rebalancing_realization_routes = realizationRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4642;
manifest.last_verified.release_assertions = "passed-through-phase-80-public-investment-portfolios-transition-pathways-place-based-capacity";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-80-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-80-public-investment-portfolios-transition-pathways-place-based-capacity-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_80_delta = {
  captured_date: "2026-08-24", editorial_layer: "public-investment-missions-theses-portfolios-dependencies-sequencing-funding-financing-delivery-capacity-workforce-suppliers-resources-place-just-transition-options-offramps-stress-rebalancing-realization",
  public_investment_mission_thesis_dossiers: 8, portfolio_membership_dependency_sequence_registers: 8, place_based_delivery_capacity_transition_ledgers: 8, portfolio_stress_rebalancing_realization_ledgers: 8,
  investment_thesis_gates_per_dossier: 18, portfolio_sequence_gates_per_register: 20, delivery_transition_gates_per_ledger: 20, realization_gates_per_ledger: 20,
  mission_classes_per_dossier: 12, investment_instrument_classes_per_dossier: 12, dependency_classes_per_register: 12, sequence_stages_per_register: 12, delivery_capacity_dimensions_per_ledger: 14, workforce_supplier_readiness_dimensions_per_ledger: 12, place_based_obligations_per_ledger: 12, just_transition_safeguards_per_ledger: 12, stress_triggers_per_ledger: 12, rebalancing_actions_per_ledger: 10, realization_tests_per_ledger: 12,
  synthetic_thesis_cases: 640, synthetic_portfolio_cases: 640, synthetic_capacity_cases: 640, synthetic_realization_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51, reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 8,
  verified_phase79_stewardship_records_received: 0, investment_theses_or_missions_admitted: 0, portfolio_members_or_sequences_authorized: 0, funding_or_financing_mixes_authorized: 0, delivery_capacity_or_readiness_findings: 0, resource_allocations_or_place_obligations: 0, just_transition_safeguards_verified: 0, stress_tests_or_rebalancing_decisions: 0, offramps_activated: 0, outputs_or_realization_findings: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption", local_content_commit: "pending", deployment_status: "phase-80-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 80 publishes exactly"));
const releaseGate = "Confirm Phase 80 publishes exactly 8 inactive public-investment mission-thesis dossiers, 8 inactive portfolio membership-dependency-sequence registers, 8 inactive place-based delivery-capacity and just-transition ledgers, and 8 inactive portfolio stress-rebalancing-realization ledgers with 78 gates per chain and exact taxonomies, while creating zero selections, priorities, membership decisions, funding, financing, allocations, readiness findings, transition findings, stress results, rebalancing decisions, realization findings, receipts, scores, rankings, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);
manifest.notes = "This manifest records Waves 60B-60C through the Phase 80 public-investment portfolio and place-based transition layer. Its 2,560 Phase 80 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 79 stewardship record, mission, thesis, portfolio member, priority, dependency decision, sequence, funding, financing, capacity finding, workforce or supplier readiness finding, resource allocation, place obligation, just-transition safeguard, stress test, off-ramp, rebalancing, output, realization finding, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 80 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updateFiles.length} updates, 27 public JSON exports, 32 portfolio routes, and 4,642 static pages.`);
