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
const registry = await readJson(appRoot, "src", "data", "phase-90-markets-firms-competition-corporate-power-democratic-economic-governance-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-25";
Object.assign(manifest.expected_build, {
  static_pages: 5152,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 37,
  phase_90_firm_formation_ownership_control_governance_dossiers: registry.firm_formation_ownership_control_governance_dossiers.length,
  phase_90_market_structure_competition_pricing_conduct_ledgers: registry.market_structure_competition_pricing_conduct_ledgers.length,
  phase_90_corporate_power_platform_supply_chain_public_support_registers: registry.corporate_power_platform_supply_chain_public_support_registers.length,
  phase_90_democratic_economic_governance_rights_remedy_long_horizon_ledgers: registry.democratic_economic_governance_rights_remedy_long_horizon_ledgers.length,
  phase_90_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4970;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 89 through Phase 90 markets, firms, competition, corporate power, and democratic economic governance: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, thirty-seven public JSON exports, thirty-two inactive Phase 90 records, and zero firm, market, power, subsidy, merger, remedy, public-value, score, ranking, or operating-outcome changes.`;

for (const command of ["npm run test:phase90", "npm run verify:phase90"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/markets-firms-economic-governance/" + record.slug + "/";
const firmRoutes = registry.firm_formation_ownership_control_governance_dossiers.map(routeFor).sort();
const marketRoutes = registry.market_structure_competition_pricing_conduct_ledgers.map(routeFor).sort();
const powerRoutes = registry.corporate_power_platform_supply_chain_public_support_registers.map(routeFor).sort();
const governanceRoutes = registry.democratic_economic_governance_rights_remedy_long_horizon_ledgers.map(routeFor).sort();
const guides = ["markets-firms-competition-corporate-power-democratic-economic-governance-doctrine-001", "firm-formation-enterprise-lifecycle-001", "ownership-control-beneficial-ownership-001", "corporate-governance-boards-stakeholders-public-obligations-001", "market-structure-concentration-entry-contestability-001", "competition-monopoly-monopsony-collusion-exclusion-001", "prices-markups-profits-rents-quality-pass-through-001", "mergers-acquisitions-rollups-remedies-001", "platforms-data-algorithms-network-effects-001", "supply-chains-buyer-power-franchises-procurement-001", "enterprise-plurality-small-business-cooperatives-public-options-001", "corporate-support-accountability-rights-remedies-public-value-001"];
const phase90Maps = ["firm-count-is-not-competitive-market", "lower-price-is-not-complete-consumer-welfare", "market-concentration-is-not-proven-abuse", "profit-is-not-productive-investment", "merger-approval-is-not-public-benefit", "corporate-disclosure-is-not-democratic-accountability"];
for (const file of [
  "dist/data/markets-firms-competition-corporate-power-democratic-economic-governance.json", "dist/evidence/markets-firms-economic-governance/index.html",
  "dist" + firmRoutes[0] + "index.html", "dist" + firmRoutes.at(-1) + "index.html",
  "dist" + marketRoutes[0] + "index.html", "dist" + marketRoutes.at(-1) + "index.html",
  "dist" + powerRoutes[0] + "index.html", "dist" + powerRoutes.at(-1) + "index.html",
  "dist" + governanceRoutes[0] + "index.html", "dist" + governanceRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`),
  ...phase90Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.firm_formation_ownership_control_governance_routes = firmRoutes;
manifest.market_structure_competition_pricing_conduct_routes = marketRoutes;
manifest.corporate_power_platform_supply_chain_public_support_routes = powerRoutes;
manifest.democratic_economic_governance_rights_remedy_long_horizon_routes = governanceRoutes;

manifest.last_verified.date = "2026-08-25";
manifest.last_verified.static_pages_built = 5152;
manifest.last_verified.release_assertions = "passed-through-phase-90-markets-firms-competition-corporate-power-democratic-economic-governance";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-90-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-90-markets-firms-competition-corporate-power-democratic-economic-governance-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_90_delta = {
  captured_date: "2026-08-25",
  editorial_layer: "firm-formation-enterprise-identity-ownership-control-beneficial-ownership-corporate-governance-market-definition-structure-concentration-entry-contestability-competition-monopoly-monopsony-collusion-exclusion-prices-markups-profits-rents-quality-mergers-acquisitions-rollups-platforms-data-algorithms-network-effects-supply-chains-buyer-power-franchises-financialization-lobbying-public-support-procurement-subsidies-tax-expenditures-rights-remedies-public-value-democratic-economic-governance",
  firm_formation_ownership_control_governance_dossiers: 8,
  market_structure_competition_pricing_conduct_ledgers: 8,
  corporate_power_platform_supply_chain_public_support_registers: 8,
  democratic_economic_governance_rights_remedy_long_horizon_ledgers: 8,
  firm_gates_per_dossier: 20, market_gates_per_ledger: 20, power_gates_per_register: 22, governance_gates_per_ledger: 22,
  synthetic_firm_cases: 640, synthetic_market_cases: 640, synthetic_power_cases: 640, synthetic_governance_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase89_economic_security_records_received: 0, firm_identity_or_governance_findings: 0, market_structure_or_competition_findings: 0, corporate_power_or_public_support_findings: 0, democratic_governance_or_public_value_decisions: 0, merger_or_remedy_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 91 Finance, Banking, Credit, Capital Allocation, Monetary Systems And Financial Stability",
  local_content_commit: "pending",
  deployment_status: "phase-90-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 90 publishes exactly"));
manifest.release_gates.push("Confirm Phase 90 publishes exactly 8 inactive firm-formation-ownership-control-governance dossiers, 8 inactive market-structure-competition-pricing-conduct ledgers, 8 inactive corporate-power-platform-supply-chain-public-support registers, and 8 inactive democratic-economic-governance-rights-remedy-long-horizon ledgers with 84 gates per chain and exact taxonomies, while creating zero firm classification, ownership or control finding, market definition, competition or conduct finding, corporate-power conclusion, subsidy or tax decision, merger or remedy decision, public-value finding, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 90 markets, firms, competition, corporate-power, and democratic-economic-governance layer. Its 2,560 Phase 90 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 89 economic-security record, firm classification, ownership or control finding, market definition, competition, price, quality, labor, conduct, platform, supply-chain, finance, influence, public-support, subsidy, tax, merger, remedy, penalty, public-value, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 90 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 37 public JSON exports, 32 market-governance routes, and 5,152 static pages.`);
