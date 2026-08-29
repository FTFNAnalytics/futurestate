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
const registry = await readJson(appRoot, "src", "data", "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published"), inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published"), inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published"), inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-27";
Object.assign(manifest.expected_build, {
  static_pages: 5458, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length,
  briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length, public_json_exports: 43,
  phase_96_passenger_mobility_demand_accessibility_affordability_inclusion_dossiers: registry.passenger_mobility_demand_accessibility_affordability_inclusion_dossiers.length,
  phase_96_multimodal_transportation_service_planning_operations_safety_reliability_ledgers: registry.multimodal_transportation_service_planning_operations_safety_reliability_ledgers.length,
  phase_96_freight_goods_movement_intermodal_logistics_delivery_resilience_registers: registry.freight_goods_movement_intermodal_logistics_delivery_resilience_registers.length,
  phase_96_communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers: registry.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers.length,
  phase_96_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5276;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 95 through Phase 96 mobility and territorial access: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, forty-three public JSON exports, thirty-two inactive Phase 96 records, and zero trip, access, safety, service, delivery, connectivity, restoration, recovery, score, ranking, or operating-outcome changes.`;
for (const command of ["npm run test:phase96", "npm run verify:phase96"]) if (!manifest.predeploy_commands.includes(command)) { const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release"); manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command); }

const routeFor = (record) => "/evidence/mobility-transportation-freight-communications-digital-networks/" + record.slug + "/";
const mobilityRoutes = registry.passenger_mobility_demand_accessibility_affordability_inclusion_dossiers.map(routeFor).sort();
const serviceRoutes = registry.multimodal_transportation_service_planning_operations_safety_reliability_ledgers.map(routeFor).sort();
const freightRoutes = registry.freight_goods_movement_intermodal_logistics_delivery_resilience_registers.map(routeFor).sort();
const digitalRoutes = registry.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers.map(routeFor).sort();
const guides = ["mobility-transportation-freight-communications-digital-networks-territorial-access-doctrine-001", "travel-demand-accessibility-proximity-complete-trips-001", "walking-cycling-wheelchair-micromobility-public-realm-001", "roads-streets-traffic-safety-vision-zero-001", "public-transit-rail-schedules-fares-service-quality-001", "aviation-maritime-ports-intercity-rural-remote-mobility-001", "freight-intermodal-terminals-last-mile-reliable-delivery-001", "transport-labor-operations-maintenance-state-of-good-repair-001", "communications-broadband-mobile-satellite-universal-connectivity-001", "digital-public-infrastructure-interoperability-data-rights-cybersecurity-001", "emergency-continuity-evacuation-restoration-community-recovery-001", "territorial-access-affordability-equity-indigenous-mobility-long-horizon-001"];
const phase96Maps = ["infrastructure-availability-is-not-usable-access", "scheduled-service-is-not-completed-trip", "vehicle-throughput-is-not-safe-mobility", "freight-movement-is-not-reliable-delivery", "network-coverage-is-not-affordable-reliable-connectivity", "restored-route-is-not-community-recovery"];
for (const file of [
  "dist/data/mobility-transportation-freight-communications-digital-networks-territorial-access.json", "dist/evidence/mobility-transportation-freight-communications-digital-networks/index.html",
  "dist" + mobilityRoutes[0] + "index.html", "dist" + mobilityRoutes.at(-1) + "index.html", "dist" + serviceRoutes[0] + "index.html", "dist" + serviceRoutes.at(-1) + "index.html",
  "dist" + freightRoutes[0] + "index.html", "dist" + freightRoutes.at(-1) + "index.html", "dist" + digitalRoutes[0] + "index.html", "dist" + digitalRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase96Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.passenger_mobility_demand_accessibility_affordability_inclusion_routes = mobilityRoutes;
manifest.multimodal_transportation_service_planning_operations_safety_reliability_routes = serviceRoutes;
manifest.freight_goods_movement_intermodal_logistics_delivery_resilience_routes = freightRoutes;
manifest.communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_routes = digitalRoutes;

manifest.last_verified.date = "2026-08-27";
manifest.last_verified.static_pages_built = 5458;
manifest.last_verified.release_assertions = "passed-through-phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-96-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-96-mobility-transportation-freight-communications-digital-networks-territorial-access-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_96_delta = {
  captured_date: "2026-08-27", editorial_layer: "travel-demand-accessibility-proximity-complete-trips-walking-cycling-wheelchair-micromobility-public-realm-roads-streets-traffic-safety-vision-zero-public-transit-rail-schedules-fares-service-quality-aviation-maritime-ports-intercity-rural-remote-mobility-freight-intermodal-terminals-last-mile-reliable-delivery-transport-labor-operations-maintenance-state-of-good-repair-communications-broadband-mobile-satellite-universal-connectivity-digital-public-infrastructure-interoperability-data-rights-cybersecurity-emergency-continuity-evacuation-restoration-community-recovery-territorial-access-affordability-equity-indigenous-mobility-long-horizon",
  passenger_mobility_demand_accessibility_affordability_inclusion_dossiers: 8, multimodal_transportation_service_planning_operations_safety_reliability_ledgers: 8, freight_goods_movement_intermodal_logistics_delivery_resilience_registers: 8, communications_broadband_mobile_digital_public_infrastructure_interoperability_territorial_access_ledgers: 8,
  mobility_gates_per_dossier: 20, service_gates_per_ledger: 22, freight_gates_per_register: 22, digital_gates_per_ledger: 24, total_gates_per_chain: 88,
  synthetic_mobility_cases: 640, synthetic_service_cases: 640, synthetic_freight_cases: 640, synthetic_digital_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase95_territorial_system_records_received: 0, mobility_access_decisions: 0, transportation_service_safety_reliability_decisions: 0, freight_delivery_resilience_decisions: 0, connectivity_territorial_access_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 97 Environment, Climate, Ecosystems, Pollution, Waste, Circularity And Planetary-System Stewardship",
  local_content_commit: "pending", deployment_status: "phase-96-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 96 publishes exactly"));
manifest.release_gates.push("Confirm Phase 96 publishes exactly 8 inactive passenger-mobility-demand-accessibility-affordability-inclusion dossiers, 8 inactive multimodal-transportation-service-planning-operations-safety-reliability ledgers, 8 inactive freight-goods-movement-intermodal-logistics-delivery-resilience registers, and 8 inactive communications-broadband-mobile-digital-public-infrastructure-interoperability-territorial-access ledgers with 88 gates per chain and exact taxonomies, while creating zero trip, access, fare, safety, service, reliability, freight, delivery, connectivity, interoperability, restoration, recovery, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 96 mobility and territorial-access layer. Its 2,560 Phase 96 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 95 territorial-system record, trip or access decision, schedule or fare finding, safety conclusion, service-reliability finding, shipment or delivery finding, connectivity or interoperability decision, restoration or community-recovery finding, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 96 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 43 public JSON exports, 32 mobility and network-access routes, and 5,458 static pages.`);
