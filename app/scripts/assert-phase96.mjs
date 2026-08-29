import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readText = (...parts) => readFile(join(...parts), "utf8");
const exists = async (...parts) => { try { await access(join(...parts)); return true; } catch { return false; } };
const registry = await readJson(appRoot, "src", "data", "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json");
const phase95 = await readJson(appRoot, "src", "data", "phase-95-infrastructure-construction-buildings-public-works-territorial-systems-delivery-registry.json");
const manifest = await readJson(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const mobility = registry.passenger_mobility_demand_accessibility_affordability_inclusion_dossiers;
const services = registry.multimodal_transportation_service_planning_operations_safety_reliability_ledgers;
const freight = registry.freight_goods_movement_intermodal_logistics_delivery_resilience_registers;
const digital = registry.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers;

check(registry.phase === "96" && registry.schema_version === "1.0" && registry.record_status === "Published" && registry.operating_state === "governed_empty_state", "Phase 96 registry metadata is invalid.");
check(registry.effective_date === "2026-08-27", "Phase 96 must use the current Edmonton calendar date.");
check(mobility.length === 8 && services.length === 8 && freight.length === 8 && digital.length === 8, "Phase 96 must preserve four eight-record families.");
check(registry.mobility_gates.length === 20 && registry.service_gates.length === 22 && registry.freight_gates.length === 22 && registry.digital_gates.length === 24, "Phase 96 must preserve an 88-gate chain.");
check(registry.mobility_demand_access_classes.length === 14 && registry.mobility_access_dimensions.length === 12 && registry.mobility_rights_safeguards.length === 12, "Phase 96 mobility taxonomies are incomplete.");
check(registry.transportation_service_network_classes.length === 14 && registry.transportation_service_dimensions.length === 12 && registry.transportation_governance_safeguards.length === 12, "Phase 96 service taxonomies are incomplete.");
check(registry.freight_network_classes.length === 14 && registry.freight_delivery_resilience_dimensions.length === 12 && registry.freight_public_value_safeguards.length === 12, "Phase 96 freight taxonomies are incomplete.");
check(registry.digital_network_classes.length === 14 && registry.digital_access_dimensions.length === 12 && registry.digital_rights_safeguards.length === 12 && registry.long_horizon_access_tests.length === 12, "Phase 96 digital-access taxonomies are incomplete.");

const cohorts = phase95.commissioning_accessibility_asset_handover_operations_maintenance_adaptation_reconstruction_territorial_value_ledgers.map((record) => record.cohort_id).sort();
for (const [name, records, idKey, stateKey, decisionKey, checksKey, gateCount] of [
  ["mobility", mobility, "passenger_mobility_demand_accessibility_affordability_inclusion_dossier_id", "mobility_state", "mobility_decision", "mobility_checks", 20],
  ["service", services, "multimodal_transportation_service_planning_operations_safety_reliability_ledger_id", "service_state", "service_decision", "service_checks", 22],
  ["freight", freight, "freight_goods_movement_intermodal_logistics_delivery_resilience_register_id", "freight_state", "freight_decision", "freight_checks", 22],
  ["digital", digital, "communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledger_id", "digital_state", "digital_decision", "digital_checks", 24]
]) {
  check(records.map((record) => record.cohort_id).sort().join("|") === cohorts.join("|"), `Phase 96 ${name} cohorts do not preserve Phase 95 identity.`);
  check(new Set(records.map((record) => record[idKey])).size === 8 && new Set(records.map((record) => record.slug)).size === 8, `Phase 96 ${name} identities are not unique.`);
  for (const record of records) {
    check(record.record_status === "Published" && record[stateKey].startsWith("Inactive -") && record[decisionKey] === "Not Open", `${record[idKey]} is not a Published inactive contract.`);
    check(record[checksKey].length === gateCount && record[checksKey].every((item) => item.decision_state === "Inactive" && item.basis), `${record[idKey]} has an invalid gate set.`);
    check(record.propagation_status === "not_started" && record.first_reviewer_id === null && record.second_reviewer_id === null && !record.automatic_score_allowed && !record.automatic_rank_allowed && record.phase64_cell_change === "none", `${record[idKey]} crosses a review, automation, propagation, or stage boundary.`);
    for (const [key, value] of Object.entries(record)) if (key.endsWith("_records") && !key.includes("_class_records") && !key.includes("_dimension_records") && !key.includes("_safeguard_records") && !key.includes("_test_records")) check(Array.isArray(value) && value.length === 0, `${record[idKey]} ${key} must remain empty.`);
  }
}
for (const key of Object.keys(registry.metrics)) check(registry.metrics[key] === 0, `Phase 96 metric ${key} must remain zero.`);

const guides = ["mobility-transportation-freight-communications-digital-networks-territorial-access-doctrine-001", "travel-demand-accessibility-proximity-complete-trips-001", "walking-cycling-wheelchair-micromobility-public-realm-001", "roads-streets-traffic-safety-vision-zero-001", "public-transit-rail-schedules-fares-service-quality-001", "aviation-maritime-ports-intercity-rural-remote-mobility-001", "freight-intermodal-terminals-last-mile-reliable-delivery-001", "transport-labor-operations-maintenance-state-of-good-repair-001", "communications-broadband-mobile-satellite-universal-connectivity-001", "digital-public-infrastructure-interoperability-data-rights-cybersecurity-001", "emergency-continuity-evacuation-restoration-community-recovery-001", "territorial-access-affordability-equity-indigenous-mobility-long-horizon-001"];
const maps = ["infrastructure-availability-is-not-usable-access", "scheduled-service-is-not-completed-trip", "vehicle-throughput-is-not-safe-mobility", "freight-movement-is-not-reliable-delivery", "network-coverage-is-not-affordable-reliable-connectivity", "restored-route-is-not-community-recovery"];
for (const slug of guides) check(await exists(appRoot, "src", "content", "briefings", `briefing-${slug}.mdx`), `Phase 96 guide ${slug} is missing.`);
for (const slug of maps) check(await exists(appRoot, "src", "content", "dependency-maps", `${slug}.json`), `Phase 96 map ${slug} is missing.`);
const guideIds = guides.map((slug) => `briefing-${slug}`), mapIds = maps.map((slug) => `dependency-map-${slug}`);
for (const pathwayId of new Set(mobility.flatMap((record) => record.reader_pathway_ids))) { const pathway = await readJson(appRoot, "src", "content", "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json"); check(guideIds.every((id) => pathway.briefing_ids.includes(id)) && mapIds.every((id) => pathway.dependency_map_ids.includes(id)), `${pathwayId} omits Phase 96 content.`); }
for (const id of new Set(mobility.map((record) => record.canonical_briefing_id))) check((await readText(appRoot, "src", "content", "briefings", `${id}.mdx`)).includes("## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access boundary"), `${id} omits Phase 96.`);
for (const file of ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"]) check((await readText(appRoot, "src", "content", "local-systems", file)).includes("## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access boundary"), `${file} omits Phase 96.`);
for (const file of ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"]) check((await readText(appRoot, "src", "content", "briefings", file)).includes("## Phase 96 mobility, transportation, freight, communications, digital-networks, and territorial-access control"), `${file} omits Phase 96 control.`);

check(await exists(appRoot, "src", "pages", "evidence", "mobility-transportation-freight-communications-digital-networks", "index.astro") && await exists(appRoot, "src", "pages", "evidence", "mobility-transportation-freight-communications-digital-networks", "[id].astro") && await exists(appRoot, "src", "pages", "data", "mobility-transportation-freight-communications-digital-networks-territorial-access.json.ts"), "Phase 96 routes or export are missing.");
const dataIndex = await readText(appRoot, "src", "pages", "data", "index.astro");
check(dataIndex.includes("Mobility, Transportation, Freight, Communications, Digital Networks And Territorial Access") && dataIndex.includes("bounded public contracts"), "The data index omits Phase 96.");
const sitemap = await readText(appRoot, "src", "pages", "sitemap.xml.ts");
check(sitemap.includes("mobilityNetworkAccessRegistry") && sitemap.includes("/evidence/mobility-transportation-freight-communications-digital-networks/"), "The sitemap omits Phase 96.");
const phase95Detail = await readText(appRoot, "src", "pages", "evidence", "infrastructure-construction-buildings-public-works-territorial-systems", "[id].astro");
check(phase95Detail.includes("Phase 96 Destination") && phase95Detail.includes("/evidence/mobility-transportation-freight-communications-digital-networks/"), "Phase 95 detail routes omit the Phase 96 handoff.");
check(manifest.expected_build.static_pages >= 5458 && manifest.expected_build.public_json_exports >= 43 && manifest.expected_build.phase_96_passenger_mobility_demand_accessibility_affordability_inclusion_dossiers === 8 && manifest.expected_build.phase_96_multimodal_transportation_service_planning_operations_safety_reliability_ledgers === 8 && manifest.expected_build.phase_96_freight_goods_movement_intermodal_logistics_delivery_resilience_registers === 8 && manifest.expected_build.phase_96_communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers === 8 && manifest.expected_build.phase_96_synthetic_cases === 2560, "The release manifest omits Phase 96 counts.");
check(manifest.passenger_mobility_demand_accessibility_affordability_inclusion_routes?.length === 8 && manifest.multimodal_transportation_service_planning_operations_safety_reliability_routes?.length === 8 && manifest.freight_goods_movement_intermodal_logistics_delivery_resilience_routes?.length === 8 && manifest.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_routes?.length === 8, "The release manifest omits Phase 96 routes.");
check(await exists(workspaceRoot, "docs", "work-packages", "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access.md"), "The Phase 96 work package is missing.");
if (failures.length) { console.error(`Phase 96 assertions failed with ${failures.length} issue(s):`); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log("Phase 96 assertions passed: 8 inactive mobility-access dossiers, 8 inactive service ledgers, 8 inactive freight registers, 8 inactive digital-access ledgers, 88 gates per chain, exact taxonomies, 10 pathways, and 0 trip, safety, delivery, connectivity, score, ranking, or Phase 64 decisions.");
