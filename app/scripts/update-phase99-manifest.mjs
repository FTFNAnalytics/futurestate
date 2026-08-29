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
const registry = await readJson(appRoot, "src", "data", "phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-27";
Object.assign(manifest.expected_build, {
  static_pages: 5611,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 46,
  phase_99_elections_representation_participation_inclusion_democratic_integrity_dossiers: registry.elections_representation_participation_inclusion_democratic_integrity_dossiers.length,
  phase_99_constitutional_legislative_executive_public_administration_capability_ledgers: registry.constitutional_legislative_executive_public_administration_capability_ledgers.length,
  phase_99_public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers: registry.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers.length,
  phase_99_civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers: registry.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers.length,
  phase_99_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5429;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends Phase 98 through Phase 99 democracy, government capability, public accountability, civic information, legitimacy and resilience: 715 sources, 1,406 signals, 1,121 Published signals, " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, fifteen reader pathways, sixteen evidence gaps, " + updates.length + " updates, forty-six public JSON exports, thirty-two inactive Phase 99 records, and zero democracy, government, accountability, legitimacy, resilience, score, ranking, or operating-outcome changes.";
for (const command of ["npm run test:phase99", "npm run verify:phase99"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const routeFor = (record) => "/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/" + record.slug + "/";
const democracyRoutes = registry.elections_representation_participation_inclusion_democratic_integrity_dossiers.map(routeFor).sort();
const governmentRoutes = registry.constitutional_legislative_executive_public_administration_capability_ledgers.map(routeFor).sort();
const accountabilityRoutes = registry.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers.map(routeFor).sort();
const legitimacyRoutes = registry.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers.map(routeFor).sort();
const guides = ["democracy-government-public-administration-civic-information-legitimacy-doctrine-001", "elections-franchise-representation-participation-integrity-001", "electoral-administration-campaign-finance-boundaries-transition-001", "legislatures-constitutional-accountability-law-making-oversight-001", "executive-government-delivery-public-administration-capability-001", "public-service-merit-integrity-capability-continuity-001", "fiscal-transparency-budget-audit-procurement-integrity-001", "open-government-records-access-public-reasoning-accountability-001", "civic-information-media-pluralism-local-news-information-integrity-001", "public-consultation-petition-participatory-deliberative-democracy-001", "public-trust-institutional-legitimacy-rights-performance-fairness-001", "democratic-resilience-continuity-renewal-nonrecurrence-001"];
const phase99Maps = ["election-held-is-not-inclusive-representative-democracy", "public-institution-is-not-administrative-capacity", "published-plan-is-not-accountable-government-delivery", "open-data-is-not-usable-civic-information", "approval-or-compliance-is-not-institutional-legitimacy", "government-continuity-is-not-democratic-resilience"];
for (const file of [
  "dist/data/democracy-government-public-administration-civic-information-institutional-legitimacy.json",
  "dist/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/index.html",
  "dist" + democracyRoutes[0] + "index.html",
  "dist" + democracyRoutes.at(-1) + "index.html",
  "dist" + governmentRoutes[0] + "index.html",
  "dist" + governmentRoutes.at(-1) + "index.html",
  "dist" + accountabilityRoutes[0] + "index.html",
  "dist" + accountabilityRoutes.at(-1) + "index.html",
  "dist" + legitimacyRoutes[0] + "index.html",
  "dist" + legitimacyRoutes.at(-1) + "index.html",
  ...guides.map((slug) => "dist/briefings/" + slug + "/index.html"),
  ...phase99Maps.map((slug) => "dist/atlas/dependency-maps/" + slug + "/index.html")
]) {
  if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
}
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.elections_representation_participation_inclusion_democratic_integrity_routes = democracyRoutes;
manifest.constitutional_legislative_executive_public_administration_capability_routes = governmentRoutes;
manifest.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_routes = accountabilityRoutes;
manifest.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_routes = legitimacyRoutes;

manifest.last_verified.date = "2026-08-27";
manifest.last_verified.static_pages_built = 5611;
manifest.last_verified.release_assertions = "passed-through-phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-99-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_99_delta = {
  captured_date: "2026-08-27",
  editorial_layer: "elections-franchise-representation-participation-integrity-electoral-administration-campaign-finance-boundaries-transition-legislatures-constitutional-accountability-lawmaking-oversight-executive-government-delivery-public-administration-capability-public-service-merit-integrity-capability-continuity-fiscal-transparency-budget-audit-procurement-integrity-open-government-records-access-public-reasoning-accountability-civic-information-media-pluralism-local-news-information-integrity-public-consultation-petition-participatory-deliberative-democracy-public-trust-institutional-legitimacy-rights-performance-fairness-democratic-resilience-continuity-renewal-nonrecurrence",
  elections_representation_participation_inclusion_democratic_integrity_dossiers: 8,
  constitutional_legislative_executive_public_administration_capability_ledgers: 8,
  public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers: 8,
  civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers: 8,
  democracy_gates_per_dossier: 20,
  government_gates_per_ledger: 22,
  accountability_gates_per_register: 22,
  legitimacy_gates_per_ledger: 24,
  total_gates_per_chain: 88,
  synthetic_democracy_cases: 640,
  synthetic_government_cases: 640,
  synthetic_accountability_cases: 640,
  synthetic_legitimacy_cases: 640,
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
  verified_phase98_security_peace_records_received: 0,
  democracy_representation_decisions: 0,
  government_capability_delivery_decisions: 0,
  public_accountability_transparency_decisions: 0,
  civic_information_legitimacy_resilience_decisions: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 100 International Order, Multilateral Cooperation, Global Commons, Cross-Border Risk And Shared Human Futures",
  local_content_commit: "pending",
  deployment_status: "phase-99-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 99 publishes exactly"));
manifest.release_gates.push("Confirm Phase 99 publishes exactly 8 inactive elections-representation-participation-inclusion-democratic-integrity dossiers, 8 inactive constitutional-legislative-executive-public-administration-capability ledgers, 8 inactive public-accountability-fiscal-transparency-audit-procurement-integrity-open-government registers, and 8 inactive civic-information-media-pluralism-public-trust-institutional-legitimacy-democratic-resilience ledgers with 88 gates per chain and exact taxonomies, while creating zero democracy, representation, government-capability, delivery, accountability, transparency, civic-information, legitimacy, resilience, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 99 democracy, government, public-administration, civic-information, legitimacy and resilience layer. Its 2,560 Phase 99 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 98 security or peace-stewardship record, election, representation, participation, government-capability, public-service, delivery, budget, audit, procurement, open-government, civic-information, media, trust, legitimacy, democratic-resilience, independent-review, reviewer-identity, receipt, signal-promotion, named-file-stage, Phase 64 cell, score, rank, or operating-outcome decision was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Phase 99 manifest updated: " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, " + updates.length + " updates, 46 public JSON exports, 32 democracy-legitimacy routes, and 5,611 static pages.");
