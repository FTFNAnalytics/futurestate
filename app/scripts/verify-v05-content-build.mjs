import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(appRoot, "dist");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const routeFile = (route) => join(distRoot, route.replace(/^\//, ""), "index.html");
const sameSet = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && new Set(left).size === left.length && new Set(right).size === right.length && left.every((item) => new Set(right).has(item));

const [program, phase117, phase120, phase121, phase123, phase124, signalsExport, sourcesExport] = await Promise.all([
  readJson(appRoot, "src", "data", "v05-evidence-fieldbook.json"),
  readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json"),
  readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json"),
  readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json"),
  readJson(appRoot, "src", "data", "phase-123-comparative-delivery-dossiers.json"),
  readJson(appRoot, "src", "data", "phase-124-topic-research-workbenches.json"),
  readJson(distRoot, "data", "signals.json"),
  readJson(distRoot, "data", "sources.json"),
]);
const sitemap = await readFile(join(distRoot, "sitemap.xml"), "utf8");

const routeInventory = (value, label) => {
  check(Array.isArray(value), label + " must be an array.");
  const routes = Array.isArray(value) ? value : [];
  check(routes.every((route) => typeof route === "string" && route.startsWith("/") && route.endsWith("/")), label + " must contain canonical trailing-slash route strings.");
  check(new Set(routes).size === routes.length, label + " contains duplicate routes.");
  return routes;
};

const newRoutes = routeInventory(program.new_html_routes, "new_html_routes");
const enhancedRoutes = routeInventory(program.enhanced_existing_routes, "enhanced_existing_routes");
const exportRoutes = Array.isArray(program.public_json_exports) ? program.public_json_exports : [];
check(exportRoutes.every((route) => typeof route === "string" && /^\/data\/[a-z0-9-]+\.json$/.test(route)), "public_json_exports must contain top-level /data/*.json routes.");
check(new Set(exportRoutes).size === exportRoutes.length, "public_json_exports contains duplicate routes.");
check(newRoutes.length === 121 && program.counts?.new_html_routes === 121, "v0.5 must own exactly 121 new HTML routes.");
check(enhancedRoutes.length === 92 && program.counts?.enhanced_existing_routes === 92, "v0.5 must enhance exactly 92 existing routes.");
check(exportRoutes.length === 6 && program.counts?.public_json_exports === 6, "v0.5 must publish exactly six JSON exports.");
check(program.counts?.substantive_surfaces === 213, "v0.5 must expose 213 substantive new or enhanced surfaces.");
check(new Set([...newRoutes, ...enhancedRoutes]).size === 213, "New and enhanced v0.5 route inventories overlap or contain duplicates.");

const readRoute = async (route, label = "route") => {
  try {
    const html = await readFile(routeFile(route), "utf8");
    check(html.includes('<link rel="canonical" href="https://ftfn.io' + route + '"'), route + " has the wrong canonical URL.");
    check(html.includes('<meta name="robots" content="index, follow"'), route + " is not indexable.");
    check(sitemap.includes("https://ftfn.io" + route), route + " is missing from the sitemap.");
    return html;
  } catch {
    failures.push("Missing generated v0.5 " + label + ": " + route);
    return "";
  }
};

for (const route of newRoutes) await readRoute(route, "new route");

for (const exportRoute of exportRoutes) {
  try {
    const record = await readJson(distRoot, exportRoute.replace(/^\//, ""));
    check(record && typeof record === "object" && !Array.isArray(record), exportRoute + " must serialize a JSON object.");
    check(record.schema_version === "1.0", exportRoute + " is not a schema 1.0 export.");
  } catch {
    failures.push("Missing or invalid v0.5 export: " + exportRoute);
  }
}

const publishedSignalById = new Map((signalsExport.records ?? []).map((signal) => [signal.id, signal]));
const sourceById = new Map((sourcesExport.records ?? []).map((source) => [source.id, source]));
check(phase117.rails.length === 80 && phase120.acquisition_packets.length === 80, "The Phase 117/120 authority inventory must remain eighty rails and packets.");
for (const packet of phase120.acquisition_packets) {
  const route = packet.routes?.authority_rail;
  check(enhancedRoutes.includes(route), packet.packet_id + " authority route is missing from the enhanced inventory.");
  check(packet.artifact_targets.length === 4, packet.packet_id + " does not preserve four prepared artifact targets.");
  const source = sourceById.get(packet.source_id);
  check(source?.monitoring_status === "Candidate", packet.source_id + " is missing from the public source export or advanced beyond Candidate.");
  const html = await readRoute(route, "enhanced Phase 120 authority route");
  for (const marker of [packet.packet_id, "Authority-to-artifact packet", "Four prepared targets", "Capture metadata", "Invalid substitutions", packet.disposition.status]) {
    check(html.includes(marker), route + " is missing Phase 120 packet content: " + marker + ".");
  }
}
check(phase117.rails.every((rail) => sourceById.get(rail.source_id)?.monitoring_status === "Candidate"), "One or more Phase 117 public sources advanced beyond Candidate.");

check(phase123.dossiers.length === 12, "Phase 123 must retain twelve comparison dossiers.");
for (const dossier of phase123.dossiers) {
  const route = dossier.route;
  check(enhancedRoutes.includes(route), dossier.dossier_id + " system route is missing from the enhanced inventory.");
  const html = await readRoute(route, "enhanced Phase 123 system route");
  for (const marker of ["Comparison passport", dossier.comparison_passport.verdict, dossier.comparison_passport.identity, "Exact source provenance", "Reader checklist", "Interpretation boundary"]) {
    check(html.includes(marker), route + " is missing Phase 123 comparison-passport content: " + marker + ".");
  }
  for (const signalId of dossier.evidence_signal_ids ?? []) {
    check(publishedSignalById.has(signalId), dossier.dossier_id + " references " + signalId + ", which is absent from the Published signals export.");
  }
  for (const sourceId of dossier.evidence_source_ids ?? []) {
    check(sourceById.has(sourceId), dossier.dossier_id + " references missing public source " + sourceId + ".");
    check(html.includes(`/atlas/sources/${sourceId}/`) && html.includes(sourceId), route + " is missing exact Phase 123 source provenance: " + sourceId + ".");
  }
}

const acquisitionCoveredState = "Exact topic-and-stage packet joins available — artifacts remain unreviewed";
const acquisitionGapState = "No exact Phase 120 topic-and-stage packet join — acquisition coverage gap";
const workbenchMissionLinks = phase124.workbenches.flatMap((workbench) => (workbench.mission_links ?? []).map((link) => ({ ...link, workbench_topic_id: workbench.topic_id })));
check(workbenchMissionLinks.length === 68 && new Set(workbenchMissionLinks.map((link) => link.mission_id)).size === 68, "Phase 124 must expose each of the 68 Phase 121 missions exactly once.");
for (const mission of phase121.missions) {
  const links = workbenchMissionLinks.filter((link) => link.mission_id === mission.mission_id);
  check(links.length === 1, mission.mission_id + " must resolve to exactly one Phase 124 workbench mission link.");
  const link = links[0];
  if (!link) continue;
  check(link.workbench_topic_id === mission.topic_id, mission.mission_id + " is linked from the wrong Phase 124 topic workbench.");
  check(link.acquisition_state === mission.relationships.acquisition_state, mission.mission_id + " Phase 124 acquisition state differs from Phase 121.");
  check(sameSet(link.acquisition_packet_ids, mission.relationships.acquisition_packet_ids), mission.mission_id + " Phase 124 acquisition packet IDs differ from Phase 121.");
}
const coveredMissionLinks = workbenchMissionLinks.filter((link) => link.acquisition_state === acquisitionCoveredState && Array.isArray(link.acquisition_packet_ids) && link.acquisition_packet_ids.length > 0);
const gapMissionLinks = workbenchMissionLinks.filter((link) => link.acquisition_state === acquisitionGapState && Array.isArray(link.acquisition_packet_ids) && link.acquisition_packet_ids.length === 0);
check(coveredMissionLinks.length === 56 && gapMissionLinks.length === 12, "Phase 124 must preserve the exact Phase 121 acquisition split of 56 covered missions and 12 coverage gaps.");
check(phase124.counts.missions_with_acquisition_packets === 56 && phase124.counts.missions_with_acquisition_coverage_gaps === 12, "Phase 124 published acquisition counts must report 56 covered missions and 12 coverage gaps.");

const expectedEnhanced = [
  ...phase120.acquisition_packets.map((packet) => packet.routes.authority_rail),
  ...phase123.dossiers.map((dossier) => dossier.route),
].sort();
check(JSON.stringify([...enhancedRoutes].sort()) === JSON.stringify(expectedEnhanced), "The 92-route enhanced inventory differs from the Phase 120 and 123 contracts.");

const hub = await readRoute("/review/v05/", "aggregate hub");
let reviewIndex = "";
let dataIndex = "";
try { reviewIndex = await readFile(routeFile("/review/"), "utf8"); }
catch { failures.push("Missing generated Review index: /review/."); }
try { dataIndex = await readFile(routeFile("/data/"), "utf8"); }
catch { failures.push("Missing generated data index: /data/."); }
check(/v0\.5/i.test(hub) && /Evidence Fieldbook/i.test(hub), "The /review/v05/ hub is missing its v0.5 Evidence Fieldbook identity.");
check(/v0\.5/i.test(reviewIndex) && reviewIndex.includes("/review/v05/"), "The Review index does not surface the v0.5 hub.");
check(/v0\.5/i.test(dataIndex) && dataIndex.includes("/data/v05-evidence-fieldbook.json"), "The data index does not surface the v0.5 aggregate export.");

if (failures.length) {
  console.error("FTFN v0.5 build verification failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log("FTFN v0.5 build verification passed: 121 canonical new routes, 92 enhanced routes, six public exports, 80 Candidate authority packets, 12 Published-signal/source-complete comparison passports, a preserved 56/12 mission acquisition split, sitemap coverage, and v0.5 hub discovery.");
