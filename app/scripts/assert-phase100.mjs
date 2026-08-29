import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures-registry.json");
const phase99 = await readJson(appRoot, "src", "data", "phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const order = registry.international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers;
const multilateral = registry.multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers;
const mobility = registry.migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers;
const futures = registry.global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers;
const upstream = phase99.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers;

check(registry.phase === "100" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 100 registry metadata is invalid.");
check(registry.effective_date === "2026-08-27", "Phase 100 must use the current Edmonton calendar date.");
check(order.length === 8 && multilateral.length === 8 && mobility.length === 8 && futures.length === 8, "Phase 100 must preserve four eight-record families.");
check(registry.international_order_gates.length === 20 && registry.multilateral_gates.length === 22 && registry.human_mobility_gates.length === 22 && registry.shared_futures_gates.length === 24, "Phase 100 must preserve an 88-gate chain.");
for (const [label, classes, dimensions, safeguards] of [
  ["international-order", registry.international_order_classes, registry.international_order_dimensions, registry.international_order_safeguards],
  ["multilateral", registry.multilateral_classes, registry.multilateral_dimensions, registry.multilateral_safeguards],
  ["human-mobility", registry.human_mobility_classes, registry.human_mobility_dimensions, registry.human_mobility_safeguards],
  ["global-futures", registry.global_commons_classes, registry.global_futures_dimensions, registry.global_futures_safeguards]
]) check(classes.length === 14 && dimensions.length === 12 && safeguards.length === 12, "Phase 100 " + label + " taxonomies are incomplete.");
check(registry.long_horizon_shared_futures_tests.length === 12, "Phase 100 long-horizon tests are incomplete.");

for (let index = 0; index < 8; index += 1) {
  const chain = [order[index], multilateral[index], mobility[index], futures[index]];
  check(chain.every((record) => record.cohort_id === upstream[index].cohort_id && record.file_id === upstream[index].file_id && record.named_entity === upstream[index].named_entity), "Phase 100 cohort identity drift at index " + index + ".");
  check(order[index].civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledger_id === upstream[index].civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledger_id, "Phase 100 lost its Phase 99 predecessor at index " + index + ".");
  check(multilateral[index].international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossier_id === order[index].international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossier_id, "Phase 100 multilateral link drift at index " + index + ".");
  check(mobility[index].multilateral_institutions_representation_development_cooperation_collective_delivery_ledger_id === multilateral[index].multilateral_institutions_representation_development_cooperation_collective_delivery_ledger_id, "Phase 100 mobility link drift at index " + index + ".");
  check(futures[index].migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_register_id === mobility[index].migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_register_id, "Phase 100 futures link drift at index " + index + ".");
  for (const record of chain) {
    check(record.record_status === "Published" && record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", "A Phase 100 record crossed its review boundary.");
    for (const [key, value] of Object.entries(record)) {
      if (key.endsWith("_records") && !/(class|dimension|safeguard|test)_records$/.test(key)) check(Array.isArray(value) && value.length === 0, "Premature Phase 100 evidence exists in " + key + ".");
      if (key.endsWith("_receipt_id")) check(value === null, "A premature Phase 100 receipt exists in " + key + ".");
    }
  }
  check(order[index].international_order_decision === "Not Open" && multilateral[index].multilateral_decision === "Not Open" && mobility[index].human_mobility_decision === "Not Open" && futures[index].shared_futures_decision === "Not Open", "A Phase 100 decision opened prematurely.");
  check(order[index].international_order_checks.length === 20 && multilateral[index].multilateral_checks.length === 22 && mobility[index].human_mobility_checks.length === 22 && futures[index].shared_futures_checks.length === 24, "A Phase 100 record has the wrong gate count.");
  check(chain.flatMap((record) => Object.entries(record).filter(([key]) => key.endsWith("_checks")).flatMap(([, checks]) => checks)).every((gate) => gate.decision_state === "Inactive"), "A Phase 100 gate advanced prematurely.");
}

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
const maps = [
  "treaty-signed-is-not-effective-cooperation",
  "institutional-membership-is-not-equal-representation-or-influence",
  "global-commitment-is-not-financed-delivery",
  "data-sharing-is-not-coordinated-cross-border-risk-reduction",
  "shared-resource-designation-is-not-governed-stewardship",
  "global-goal-is-not-a-secured-shared-human-future"
];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", "briefing-" + slug + ".mdx"), "Phase 100 guide " + slug + " is missing.");
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", slug + ".json"), "Phase 100 map " + slug + " is missing.");
const guideIds = guides.map((slug) => "briefing-" + slug);
const mapIds = maps.map((slug) => "dependency-map-" + slug);
for (const pathwayId of new Set(order.flatMap((record) => record.reader_pathway_ids))) {
  const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), pathwayId + " omits Phase 100 content.");
}
for (const id of new Set(order.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", id + ".mdx")).includes("## Phase 100 international order, multilateral cooperation, global commons, cross-border risk, and shared human futures boundary"), id + " omits Phase 100.");
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 100 international order, multilateral cooperation, global commons, cross-border risk, and shared human futures boundary"), file + " omits Phase 100.");
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 100 international order, multilateral cooperation, global commons, cross-border risk, and shared human futures control"), file + " omits Phase 100 control.");

check(await exists(appRoot, "src", "pages", "evidence", "international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures", "[id].astro") && await exists(appRoot, "src", "pages", "data", "international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures.json.ts"), "Phase 100 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("International Order, Multilateral Cooperation, Global Commons, Cross-Border Risk And Shared Human Futures") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 100.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("internationalOrderSharedFuturesRegistry") && sitemap.includes("/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/"), "The sitemap omits Phase 100.");
const phase99Detail = await readText(appRoot, "src", "pages", "evidence", "democracy-government-public-administration-civic-information-institutional-legitimacy", "[id].astro");
check(phase99Detail.includes("Phase 100 Destination") && phase99Detail.includes("/evidence/international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures/"), "Phase 99 detail routes omit the Phase 100 handoff.");
check(manifest.expected_build.static_pages >= 5662 && manifest.expected_build.public_json_exports >= 47 && manifest.expected_build.phase_100_international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_dossiers === 8 && manifest.expected_build.phase_100_multilateral_institutions_representation_development_cooperation_collective_delivery_ledgers === 8 && manifest.expected_build.phase_100_migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_registers === 8 && manifest.expected_build.phase_100_global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_ledgers === 8 && manifest.expected_build.phase_100_synthetic_cases === 2560, "The release manifest omits Phase 100 counts.");
check(manifest.international_order_diplomacy_treaties_international_law_peaceful_dispute_resolution_routes?.length === 8 && manifest.multilateral_institutions_representation_development_cooperation_collective_delivery_routes?.length === 8 && manifest.migration_displacement_refugee_asylum_humanitarian_protection_shared_responsibility_routes?.length === 8 && manifest.global_commons_transboundary_risk_catastrophic_risk_intergenerational_shared_human_futures_routes?.length === 8, "The release manifest omits Phase 100 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-100-international-order-multilateral-cooperation-global-commons-cross-border-risk-shared-human-futures.md"), "The Phase 100 work package is missing.");
if (failures.length) {
  console.error("Phase 100 assertions failed with " + failures.length + " issue(s):");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("Phase 100 assertions passed: 8 inactive international-order dossiers, 8 inactive multilateral ledgers, 8 inactive humanitarian registers, 8 inactive shared-futures ledgers, 88 gates per chain, exact taxonomies, 10 pathways, and 0 treaty, multilateral, humanitarian, global-commons, shared-futures, score, ranking, or Phase 64 decisions.");
