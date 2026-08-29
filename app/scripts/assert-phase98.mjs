import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json");
const phase97 = await readJson(appRoot, "src", "data", "phase-97-environment-climate-ecosystems-pollution-waste-circularity-planetary-system-stewardship-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const justice = registry.rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers;
const safety = registry.public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers;
const emergency = registry.emergency_management_civil_protection_critical_system_security_resilience_registers;
const peace = registry.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers;

check(registry.phase === "98" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 98 registry metadata is invalid.");
check(registry.effective_date === "2026-08-27", "Phase 98 must use the current Edmonton calendar date.");
check(justice.length === 8 && safety.length === 8 && emergency.length === 8 && peace.length === 8, "Phase 98 must preserve four eight-record families.");
check(registry.justice_gates.length === 20 && registry.safety_gates.length === 22 && registry.emergency_gates.length === 22 && registry.peace_gates.length === 24, "Phase 98 must preserve an 88-gate chain.");
check(registry.justice_access_classes.length === 14 && registry.justice_access_dimensions.length === 12 && registry.justice_rights_safeguards.length === 12, "Phase 98 justice taxonomies are incomplete.");
check(registry.public_safety_classes.length === 14 && registry.public_safety_dimensions.length === 12 && registry.safety_rights_safeguards.length === 12, "Phase 98 safety taxonomies are incomplete.");
check(registry.emergency_resilience_classes.length === 14 && registry.emergency_resilience_dimensions.length === 12 && registry.emergency_rights_safeguards.length === 12, "Phase 98 emergency taxonomies are incomplete.");
check(registry.security_peace_classes.length === 14 && registry.security_peace_dimensions.length === 12 && registry.security_peace_safeguards.length === 12 && registry.long_horizon_peace_tests.length === 12, "Phase 98 security-peace taxonomies are incomplete.");

const cohorts = phase97.waste_materials_circularity_climate_adaptation_disaster_risk_planetary_system_stewardship_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["justice", justice, "rights_rule_of_law_courts_legal_aid_access_to_justice_dossier_id", "justice_state", "justice_decision", "justice_checks", 20],
  ["safety", safety, "public_safety_violence_prevention_policing_fire_corrections_accountability_ledger_id", "safety_state", "safety_decision", "safety_checks", 22],
  ["emergency", emergency, "emergency_management_civil_protection_critical_system_security_resilience_register_id", "emergency_state", "emergency_decision", "emergency_checks", 22],
  ["peace", peace, "defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledger_id", "peace_state", "peace_decision", "peace_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), `Phase 98 ${name} cohorts do not preserve Phase 97 identity.`);
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, `Phase 98 ${name} identities are not unique.`);
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", `${record[idKey]} is not a Published inactive contract.`);
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), `${record[idKey]} has an invalid gate set.`);
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", `${record[idKey]} crosses a review, automation, propagation, or stage boundary.`);
    for (const [key, value] of Object.entries(record)) if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records")) check(Array.isArray(value) && value.length === 0, `${record[idKey]} ${key} must remain empty.`);
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, `Phase 98 metric ${key} must remain zero.`);

const guides = ["law-justice-public-safety-emergency-security-defense-peace-doctrine-001", "constitutional-rule-of-law-human-rights-independent-justice-001", "courts-legal-aid-counsel-accessible-process-effective-remedy-001", "administrative-environmental-indigenous-restorative-justice-001", "public-safety-violence-prevention-community-health-trust-001", "policing-fire-emergency-medical-corrections-accountability-001", "victim-survivor-rights-crisis-response-restorative-safety-001", "emergency-management-preparedness-warning-evacuation-recovery-001", "critical-infrastructure-cyber-physical-security-essential-continuity-001", "national-security-intelligence-oversight-rights-risk-reduction-001", "defense-readiness-civilian-control-human-security-public-value-001", "conflict-prevention-civilian-protection-ceasefire-peacebuilding-001"];
const maps = ["law-on-books-is-not-access-to-justice", "police-presence-is-not-public-safety", "emergency-declaration-is-not-preparedness-or-recovery", "security-capability-is-not-protected-rights-or-reduced-risk", "defense-spending-is-not-security", "ceasefire-is-not-durable-peace"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", `briefing-${slug}.mdx`), `Phase 98 guide ${slug} is missing.`);
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", `${slug}.json`), `Phase 98 map ${slug} is missing.`);
const guideIds = guides.map((slug) => `briefing-${slug}`), mapIds = maps.map((slug) => `dependency-map-${slug}`);
for (const pathwayId of new Set(justice.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 98 content.`); }
for (const id of new Set(justice.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", `${id}.mdx`)).includes("## Phase 98 law, justice, public safety, emergency management, security, defense, and peace boundary"), `${id} omits Phase 98.`);
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 98 law, justice, public safety, emergency management, security, defense, and peace boundary"), `${file} omits Phase 98.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 98 law, justice, public safety, emergency management, security, defense, and peace control"), `${file} omits Phase 98 control.`);

check(await exists(appRoot, "src", "pages", "evidence", "law-justice-public-safety-emergency-security-defense-peace", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "law-justice-public-safety-emergency-security-defense-peace", "[id].astro") && await exists(appRoot, "src", "pages", "data", "law-justice-public-safety-emergency-management-security-defense-peace.json.ts"), "Phase 98 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Law, Justice, Public Safety, Emergency Management, Security, Defense And Peace") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 98.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("justiceSafetySecurityPeaceRegistry") && sitemap.includes("/evidence/law-justice-public-safety-emergency-security-defense-peace/"), "The sitemap omits Phase 98.");
const phase97Detail = await readText(appRoot, "src", "pages", "evidence", "environment-climate-ecosystems-pollution-waste-circularity", "[id].astro");
check(phase97Detail.includes("Phase 98 Destination") && phase97Detail.includes("/evidence/law-justice-public-safety-emergency-security-defense-peace/"), "Phase 97 detail routes omit the Phase 98 handoff.");
check(manifest.expected_build.static_pages >= 5560 && manifest.expected_build.public_json_exports >= 45 && manifest.expected_build.phase_98_rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers === 8 && manifest.expected_build.phase_98_public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers === 8 && manifest.expected_build.phase_98_emergency_management_civil_protection_critical_system_security_resilience_registers === 8 && manifest.expected_build.phase_98_defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers === 8 && manifest.expected_build.phase_98_synthetic_cases === 2560, "The release manifest omits Phase 98 counts.");
check(manifest.rights_rule_of_law_courts_legal_aid_access_to_justice_routes?.length === 8 && manifest.public_safety_violence_prevention_policing_fire_corrections_accountability_routes?.length === 8 && manifest.emergency_management_civil_protection_critical_system_security_resilience_routes?.length === 8 && manifest.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_routes?.length === 8, "The release manifest omits Phase 98 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-98-law-justice-public-safety-emergency-management-security-defense-peace.md"), "The Phase 98 work package is missing.");
if (failures.length) { console.error(`Phase 98 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 98 assertions passed: 8 inactive justice dossiers, 8 inactive safety ledgers, 8 inactive emergency registers, 8 inactive peace ledgers, 88 gates per chain, exact taxonomies, 10 pathways, and 0 justice, safety, security, peace, score, ranking, or Phase 64 decisions.");
