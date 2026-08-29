import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy-registry.json");
const phase98 = await readJson(appRoot, "src", "data", "phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const democracy = registry.elections_representation_participation_inclusion_democratic_integrity_dossiers;
const government = registry.constitutional_legislative_executive_public_administration_capability_ledgers;
const accountability = registry.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers;
const legitimacy = registry.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers;

check(registry.phase === "99" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 99 registry metadata is invalid.");
check(registry.effective_date === "2026-08-27", "Phase 99 must use the current Edmonton calendar date.");
check(democracy.length === 8 && government.length === 8 && accountability.length === 8 && legitimacy.length === 8, "Phase 99 must preserve four eight-record families.");
check(registry.democracy_gates.length === 20 && registry.government_gates.length === 22 && registry.accountability_gates.length === 22 && registry.legitimacy_gates.length === 24, "Phase 99 must preserve an 88-gate chain.");
check(registry.democracy_classes.length === 14 && registry.democracy_dimensions.length === 12 && registry.democracy_safeguards.length === 12, "Phase 99 democracy taxonomies are incomplete.");
check(registry.government_capability_classes.length === 14 && registry.government_capability_dimensions.length === 12 && registry.government_safeguards.length === 12, "Phase 99 government taxonomies are incomplete.");
check(registry.accountability_classes.length === 14 && registry.accountability_dimensions.length === 12 && registry.accountability_safeguards.length === 12, "Phase 99 accountability taxonomies are incomplete.");
check(registry.legitimacy_classes.length === 14 && registry.legitimacy_dimensions.length === 12 && registry.legitimacy_safeguards.length === 12 && registry.long_horizon_democratic_resilience_tests.length === 12, "Phase 99 legitimacy-resilience taxonomies are incomplete.");

const cohorts = phase98.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["democracy", democracy, "elections_representation_participation_inclusion_democratic_integrity_dossier_id", "democracy_state", "democracy_decision", "democracy_checks", 20],
  ["government", government, "constitutional_legislative_executive_public_administration_capability_ledger_id", "government_capacity_state", "government_capacity_decision", "government_checks", 22],
  ["accountability", accountability, "public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_register_id", "accountability_state", "accountability_decision", "accountability_checks", 22],
  ["legitimacy", legitimacy, "civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledger_id", "legitimacy_state", "legitimacy_decision", "legitimacy_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), "Phase 99 " + name + " cohorts do not preserve Phase 98 identity.");
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, "Phase 99 " + name + " identities are not unique.");
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", record[idKey] + " is not a Published inactive contract.");
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), record[idKey] + " has an invalid gate set.");
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", record[idKey] + " crosses a review, automation, propagation, or stage boundary.");
    for (const [key, value] of Object.entries(record)) {
      if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records")) check(Array.isArray(value) && value.length === 0, record[idKey] + " " + key + " must remain empty.");
    }
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, "Phase 99 metric " + key + " must remain zero.");

const guides = ["democracy-government-public-administration-civic-information-legitimacy-doctrine-001", "elections-franchise-representation-participation-integrity-001", "electoral-administration-campaign-finance-boundaries-transition-001", "legislatures-constitutional-accountability-law-making-oversight-001", "executive-government-delivery-public-administration-capability-001", "public-service-merit-integrity-capability-continuity-001", "fiscal-transparency-budget-audit-procurement-integrity-001", "open-government-records-access-public-reasoning-accountability-001", "civic-information-media-pluralism-local-news-information-integrity-001", "public-consultation-petition-participatory-deliberative-democracy-001", "public-trust-institutional-legitimacy-rights-performance-fairness-001", "democratic-resilience-continuity-renewal-nonrecurrence-001"];
const maps = ["election-held-is-not-inclusive-representative-democracy", "public-institution-is-not-administrative-capacity", "published-plan-is-not-accountable-government-delivery", "open-data-is-not-usable-civic-information", "approval-or-compliance-is-not-institutional-legitimacy", "government-continuity-is-not-democratic-resilience"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", "briefing-" + slug + ".mdx"), "Phase 99 guide " + slug + " is missing.");
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", slug + ".json"), "Phase 99 map " + slug + " is missing.");
const guideIds = guides.map((slug) => "briefing-" + slug);
const mapIds = maps.map((slug) => "dependency-map-" + slug);
for (const pathwayId of new Set(democracy.flatMap((record) => record.reader_pathway_ids))) {
  const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
  check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), pathwayId + " omits Phase 99 content.");
}
for (const id of new Set(democracy.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", id + ".mdx")).includes("## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy boundary"), id + " omits Phase 99.");
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy boundary"), file + " omits Phase 99.");
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 99 democracy, government, public administration, civic information, and institutional legitimacy control"), file + " omits Phase 99 control.");

check(await exists(appRoot, "src", "pages", "evidence", "democracy-government-public-administration-civic-information-institutional-legitimacy", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "democracy-government-public-administration-civic-information-institutional-legitimacy", "[id].astro") && await exists(appRoot, "src", "pages", "data", "democracy-government-public-administration-civic-information-institutional-legitimacy.json.ts"), "Phase 99 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Democracy, Government, Public Administration, Civic Information And Institutional Legitimacy") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 99.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("democracyGovernmentLegitimacyRegistry") && sitemap.includes("/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/"), "The sitemap omits Phase 99.");
const phase98Detail = await readText(appRoot, "src", "pages", "evidence", "law-justice-public-safety-emergency-security-defense-peace", "[id].astro");
check(phase98Detail.includes("Phase 99 Destination") && phase98Detail.includes("/evidence/democracy-government-public-administration-civic-information-institutional-legitimacy/"), "Phase 98 detail routes omit the Phase 99 handoff.");
check(manifest.expected_build.static_pages >= 5611 && manifest.expected_build.public_json_exports >= 46 && manifest.expected_build.phase_99_elections_representation_participation_inclusion_democratic_integrity_dossiers === 8 && manifest.expected_build.phase_99_constitutional_legislative_executive_public_administration_capability_ledgers === 8 && manifest.expected_build.phase_99_public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_registers === 8 && manifest.expected_build.phase_99_civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_ledgers === 8 && manifest.expected_build.phase_99_synthetic_cases === 2560, "The release manifest omits Phase 99 counts.");
check(manifest.elections_representation_participation_inclusion_democratic_integrity_routes?.length === 8 && manifest.constitutional_legislative_executive_public_administration_capability_routes?.length === 8 && manifest.public_accountability_fiscal_transparency_audit_procurement_integrity_open_government_routes?.length === 8 && manifest.civic_information_media_pluralism_public_trust_institutional_legitimacy_democratic_resilience_routes?.length === 8, "The release manifest omits Phase 99 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-99-democracy-government-public-administration-civic-information-institutional-legitimacy.md"), "The Phase 99 work package is missing.");
if (failures.length) {
  console.error("Phase 99 assertions failed with " + failures.length + " issue(s):");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}
console.log("Phase 99 assertions passed: 8 inactive democracy dossiers, 8 inactive government ledgers, 8 inactive accountability registers, 8 inactive legitimacy-resilience ledgers, 88 gates per chain, exact taxonomies, 10 pathways, and 0 democracy, government, accountability, legitimacy, resilience, score, ranking, or Phase 64 decisions.");
