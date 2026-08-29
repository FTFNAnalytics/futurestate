import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readText = async (...parts) => readFile(join(...parts), "utf8");
const readJson = async (...parts) => JSON.parse(await readText(...parts));
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const isEmpty = (value) => Array.isArray(value) ? value.length === 0 : value && typeof value === "object" ? Object.keys(value).length === 0 : value === null || value === "";
const assertTaxonomy = (records, expected, stateField, state, label) => check(records.length === expected && records.every((item) => item[stateField] === state && Object.entries(item).filter(([key]) => key.endsWith("_ids")).every(([, value]) => isEmpty(value))), `${label} taxonomy is invalid.`);

const registry = await readJson(appRoot, "src", "data", "phase-83-community-institutions-social-infrastructure-collective-resilience-registry.json");
const phase82 = await readJson(appRoot, "src", "data", "phase-82-household-capability-care-infrastructure-everyday-security-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const institutions = registry.community_institution_access_trust_continuity_dossiers;
const civic = registry.civic_association_cooperative_mutual_aid_capacity_ledgers;
const information = registry.local_information_media_public_knowledge_integrity_registers;
const resilience = registry.collective_preparedness_trauma_recovery_resilience_ledgers;
const families = [institutions, civic, information, resilience];

check(registry.phase === "83" && registry.schema_version === "1.0", "Phase 83 registry identity is invalid.");
check(families.every((items) => items.length === 8), "Phase 83 record-family counts are invalid.");
check(registry.institution_gates.length === 20 && registry.civic_capacity_gates.length === 20 && registry.information_integrity_gates.length === 22 && registry.collective_resilience_gates.length === 22, "Phase 83 gate counts are invalid.");
for (const [key, expected] of [["community_institution_classes",14],["institution_access_trust_dimensions",12],["institution_continuity_safeguards",12],["civic_network_types",14],["mutual_aid_capacity_dimensions",12],["volunteer_worker_safeguards",12],["information_ecosystem_functions",14],["information_integrity_safeguards",12],["public_knowledge_access_modes",12],["community_preparedness_capabilities",12],["collective_trauma_recovery_safeguards",12],["institution_closure_displacement_safeguards",12],["long_horizon_collective_resilience_tests",12]]) check(registry[key].length === expected, `Phase 83 ${key} count is invalid.`);

const all = families.flat();
const ids = all.map((record) => Object.values(record).find((value) => typeof value === "string" && /^83-(CID|CML|LIR|CRL)-/.test(value)));
check(new Set(ids).size === 32 && new Set(all.map((record) => record.slug)).size === 32, "Phase 83 IDs or slugs are not unique.");
check(new Set(institutions.map((record) => record.neighborhood_access_displacement_crisis_recovery_ledger_id)).size === 8, "Phase 82 recovery ledgers do not map one-to-one to Phase 83 institution dossiers.");
check(institutions.every((record) => phase82.neighborhood_access_displacement_crisis_recovery_ledgers.some((item) => item.neighborhood_access_displacement_crisis_recovery_ledger_id === record.neighborhood_access_displacement_crisis_recovery_ledger_id && item.cohort_id === record.cohort_id)), "A Phase 83 institution dossier lacks its exact Phase 82 predecessor.");

const assertEmptyFields = (record, taxonomyNames, idFields, label) => {
  for (const [key, value] of Object.entries(record)) if ((key.endsWith("_records") && !taxonomyNames.includes(key) && !["source_ids", "signal_ids", "evidence_gap_ids", "reader_pathway_ids", "local_system_ids"].includes(key)) || idFields.includes(key)) check(isEmpty(value), `${label} contains governed data in ${key}.`);
  for (const [key, value] of Object.entries(record)) if (key.endsWith("_allowed")) check(value === false, `${label} permits ${key}.`);
  check(record.first_reviewer_id === null && record.second_reviewer_id === null && record.propagation_status === "not_started" && record.phase64_cell_change === "none", `${label} crossed its review or propagation boundary.`);
};

for (const record of institutions) {
  check(record.institution_state === "Inactive - No Verified Phase 82 Household-Security Record" && record.institution_decision === "Not Open" && record.institution_checks.length === 20 && record.institution_checks.every((item) => item.decision_state === "Inactive"), `${record.community_institution_access_trust_continuity_dossier_id} is not inactive.`);
  assertTaxonomy(record.community_institution_class_records,14,"institution_state","Unassessed","institution class"); assertTaxonomy(record.institution_access_trust_dimension_records,12,"dimension_state","Not Measured","access and trust"); assertTaxonomy(record.institution_continuity_safeguard_records,12,"safeguard_state","Unverified","institution continuity");
  assertEmptyFields(record,["community_institution_class_records","institution_access_trust_dimension_records","institution_continuity_safeguard_records"],["institution_receipt_id"],record.community_institution_access_trust_continuity_dossier_id);
}
for (const record of civic) {
  check(record.civic_state === "Inactive - No Adopted Community-Institution Baseline" && record.capacity_decision === "Not Open" && record.civic_capacity_checks.length === 20 && record.civic_capacity_checks.every((item) => item.decision_state === "Inactive"), `${record.civic_association_cooperative_mutual_aid_capacity_ledger_id} is not inactive.`);
  assertTaxonomy(record.civic_network_type_records,14,"network_state","Unassessed","civic network"); assertTaxonomy(record.mutual_aid_capacity_dimension_records,12,"capacity_state","Not Measured","mutual aid"); assertTaxonomy(record.volunteer_worker_safeguard_records,12,"safeguard_state","Unverified","volunteer safeguard");
  assertEmptyFields(record,["civic_network_type_records","mutual_aid_capacity_dimension_records","volunteer_worker_safeguard_records"],["civic_capacity_receipt_id"],record.civic_association_cooperative_mutual_aid_capacity_ledger_id);
}
for (const record of information) {
  check(record.information_state === "Inactive - No Verified Civic-Network Capacity" && record.information_decision === "Not Open" && record.information_integrity_checks.length === 22 && record.information_integrity_checks.every((item) => item.decision_state === "Inactive"), `${record.local_information_media_public_knowledge_integrity_register_id} is not inactive.`);
  assertTaxonomy(record.information_ecosystem_function_records,14,"function_state","Unassessed","information function"); assertTaxonomy(record.information_integrity_safeguard_records,12,"safeguard_state","Unverified","information integrity"); assertTaxonomy(record.public_knowledge_access_mode_records,12,"access_state","Unassessed","knowledge access");
  assertEmptyFields(record,["information_ecosystem_function_records","information_integrity_safeguard_records","public_knowledge_access_mode_records"],["information_receipt_id"],record.local_information_media_public_knowledge_integrity_register_id);
}
for (const record of resilience) {
  check(record.resilience_state === "Inactive - No Verified Local-Information Baseline" && record.resilience_decision === "Not Open" && record.collective_resilience_checks.length === 22 && record.collective_resilience_checks.every((item) => item.decision_state === "Inactive"), `${record.collective_preparedness_trauma_recovery_resilience_ledger_id} is not inactive.`);
  assertTaxonomy(record.community_preparedness_capability_records,12,"capability_state","Not Tested","preparedness"); assertTaxonomy(record.collective_trauma_recovery_safeguard_records,12,"safeguard_state","Unverified","trauma recovery"); assertTaxonomy(record.institution_closure_displacement_safeguard_records,12,"safeguard_state","Unverified","closure"); assertTaxonomy(record.long_horizon_collective_resilience_test_records,12,"test_state","Not Tested","collective resilience");
  assertEmptyFields(record,["community_preparedness_capability_records","collective_trauma_recovery_safeguard_records","institution_closure_displacement_safeguard_records","long_horizon_collective_resilience_test_records"],["resilience_receipt_id"],record.collective_preparedness_trauma_recovery_resilience_ledger_id);
}

const countKeys = new Set(["community_institution_access_trust_continuity_dossiers", "civic_association_cooperative_mutual_aid_capacity_ledgers", "local_information_media_public_knowledge_integrity_registers", "collective_preparedness_trauma_recovery_resilience_ledgers", "institution_gates", "civic_capacity_gates", "information_integrity_gates", "collective_resilience_gates", "community_institution_classes", "institution_access_trust_dimensions", "institution_continuity_safeguards", "civic_network_types", "mutual_aid_capacity_dimensions", "volunteer_worker_safeguards", "information_ecosystem_functions", "information_integrity_safeguards", "public_knowledge_access_modes", "community_preparedness_capabilities", "collective_trauma_recovery_safeguards", "institution_closure_displacement_safeguards", "long_horizon_collective_resilience_tests"]);
for (const [key, value] of Object.entries(registry.metrics)) if (!countKeys.has(key)) check(value === 0, `Phase 83 metric ${key} must remain zero.`);

const guideIds = ["briefing-community-institutions-doctrine-001", "briefing-libraries-schools-clinics-civic-infrastructure-001", "briefing-parks-public-space-belonging-001", "briefing-cultural-faith-indigenous-place-governance-001", "briefing-cooperatives-community-ownership-001", "briefing-mutual-aid-volunteer-capacity-001", "briefing-local-media-information-integrity-001", "briefing-trusted-intermediaries-public-knowledge-001", "briefing-social-isolation-belonging-participation-001", "briefing-neighborhood-preparedness-community-hubs-001", "briefing-collective-trauma-recovery-001", "briefing-long-horizon-collective-resilience-001"];
const mapIds = ["dependency-map-institution-presence-is-not-community-access", "dependency-map-volunteer-count-is-not-mutual-aid-capacity", "dependency-map-information-volume-is-not-public-knowledge", "dependency-map-consultation-is-not-collective-governance", "dependency-map-emergency-plan-is-not-community-preparedness", "dependency-map-reopening-is-not-collective-recovery"];
for (const id of guideIds) check(await exists(appRoot,"src","content","briefings",id + ".mdx"), `${id} is missing.`);
for (const id of mapIds) check(await exists(appRoot,"src","content","dependency-maps",id.replace("dependency-map-","") + ".json"), `${id} is missing.`);
for (const pathwayId of new Set(institutions.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot,"src","content","reader-pathways",pathwayId.replace("reader-pathway-","") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 83 guides or maps.`); }
for (const record of institutions) check((await readText(appRoot,"src","content","briefings",record.canonical_briefing_id + ".mdx")).includes("## Phase 83 community-institutions and collective-resilience boundary"), `${record.canonical_briefing_id} omits Phase 83.`);
for (const file of ["local-us-southwest-chip-corridor.mdx","local-ontario-real-estate.mdx","local-northern-virginia-data-center-corridor.mdx","local-florida-space-coast-launch-corridor.mdx","local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot,"src","content","local-systems",file)).includes("## Phase 83 community institutions, information, and collective resilience boundary"), `${file} omits Phase 83.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx","briefing-decision-accountability-desk-001.mdx","briefing-public-investment-doctrine-001.mdx","briefing-universal-service-doctrine-001.mdx","briefing-household-capability-doctrine-001.mdx","briefing-community-standing-affected-publics-001.mdx","briefing-continuity-mutual-aid-essential-systems-001.mdx","briefing-crisis-stabilization-recovery-001.mdx","briefing-shared-public-value-allocation-001.mdx","briefing-emergency-rationing-restoration-long-horizon-accountability-001.mdx"]) check((await readText(appRoot,"src","content","briefings",file)).includes("## Phase 83 community-institutions and collective-resilience control"), `${file} omits the Phase 83 operating control.`);

check(await exists(appRoot,"src","pages","evidence","community-institutions","index.astro") && await exists(appRoot,"src","pages","evidence","community-institutions","[id].astro") && await exists(appRoot,"src","pages","data","community-institutions-social-infrastructure-collective-resilience.json.ts"), "Phase 83 routes or export are missing.");
const dataIndex = await readText(appRoot,"src","pages","data","index.astro"); check(dataIndex.includes("Community Institutions And Collective Resilience") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 83.");
const sitemap = await readText(appRoot,"src","pages","sitemap.xml.ts"); check(sitemap.includes("communityInstitutionsRegistry") && sitemap.includes("/evidence/community-institutions/"), "The sitemap omits Phase 83.");
const phase82Detail = await readText(appRoot,"src","pages","evidence","household-capability","[id].astro"); check(phase82Detail.includes("Phase 83 Destination") && phase82Detail.includes("/evidence/community-institutions/"), "Phase 82 detail routes omit the Phase 83 handoff.");
check(manifest.expected_build.static_pages >= 4795 && manifest.expected_build.public_json_exports >= 30 && manifest.expected_build.phase_83_community_institution_access_trust_continuity_dossiers === 8 && manifest.expected_build.phase_83_civic_association_cooperative_mutual_aid_capacity_ledgers === 8 && manifest.expected_build.phase_83_local_information_media_public_knowledge_integrity_registers === 8 && manifest.expected_build.phase_83_collective_preparedness_trauma_recovery_resilience_ledgers === 8 && manifest.expected_build.phase_83_synthetic_cases === 2560, "The release manifest omits Phase 83 counts.");
check(manifest.community_institution_access_trust_continuity_routes?.length === 8 && manifest.civic_association_cooperative_mutual_aid_capacity_routes?.length === 8 && manifest.local_information_media_public_knowledge_integrity_routes?.length === 8 && manifest.collective_preparedness_trauma_recovery_resilience_routes?.length === 8, "The release manifest omits Phase 83 routes.");

if (failures.length) { console.error(`Phase 83 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 83 assertions passed: 8 inactive institution dossiers, 8 inactive civic ledgers, 8 inactive information registers, 8 inactive resilience ledgers, 84 gates per chain, exact taxonomies, 10 pathways, and 0 admissions, allocations, activations, closures, restorations, recovery findings, receipts, scores, rankings, or stage changes.");
