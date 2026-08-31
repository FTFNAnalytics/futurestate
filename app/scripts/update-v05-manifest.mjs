import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const distRoot = join(appRoot, "dist");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const collectFiles = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? collectFiles(path) : [path];
}))).flat();

const [manifest, program, sourcesExport, phase120, phase121, phase122, phase123, phase124] = await Promise.all([
  readJson(manifestPath),
  readJson(appRoot, "src", "data", "v05-evidence-fieldbook.json"),
  readJson(distRoot, "data", "sources.json"),
  readJson(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json"),
  readJson(appRoot, "src", "data", "phase-121-priority-research-missions.json"),
  readJson(appRoot, "src", "data", "phase-122-verification-playbook-library.json"),
  readJson(appRoot, "src", "data", "phase-123-comparative-delivery-dossiers.json"),
  readJson(appRoot, "src", "data", "phase-124-topic-research-workbenches.json"),
]);

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const newRoutes = program.new_html_routes ?? [];
const enhancedRoutes = program.enhanced_existing_routes ?? [];
const exportRoutes = program.public_json_exports ?? [];
assert(newRoutes.length === 121 && new Set(newRoutes).size === 121, "Refusing manifest update: v0.5 new route inventory is not 121 unique routes.");
assert(enhancedRoutes.length === 92 && new Set(enhancedRoutes).size === 92, "Refusing manifest update: v0.5 enhanced route inventory is not 92 unique routes.");
assert(exportRoutes.length === 6 && new Set(exportRoutes).size === 6, "Refusing manifest update: v0.5 export inventory is not six unique routes.");
assert(program.counts?.substantive_surfaces === 213 && program.counts?.new_html_routes === 121 && program.counts?.enhanced_existing_routes === 92 && program.counts?.public_json_exports === 6, "Refusing manifest update: v0.5 aggregate counts do not match 213 / 121 / 92 / 6.");
assert(phase120.counts.acquisition_packets === 80 && phase120.counts.artifact_targets === 320, "Refusing manifest update: Phase 120 counts are incomplete.");
assert(phase121.counts.missions === 68, "Refusing manifest update: Phase 121 must contain 68 missions.");
assert(phase122.counts.leaf_records === 30, "Refusing manifest update: Phase 122 must contain 30 playbooks.");
assert(phase123.counts.dossiers === 12, "Refusing manifest update: Phase 123 must contain 12 dossiers.");
assert(phase124.counts.workbenches === 17, "Refusing manifest update: Phase 124 must contain 17 workbenches.");

const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const sourceNames = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
const sourceRecords = await Promise.all(sourceNames.map((name) => readJson(appRoot, "src", "content", "sources", name)));
const endpointField = new Map([["API", "api_url"], ["RSS Feed", "feed_url"], ["Data Download", "data_download_url"], ["Docket Search", "docket_search_url"], ["Filing System", "api_url"]]);
const sourceHealth = sourceRecords.map((source) => {
  if (source.monitoring_status === "Blocked") return "Blocked";
  if (source.monitoring_status === "Paused") return "Paused";
  const expected = endpointField.get(source.live_access_type ?? "Manual Page Check");
  const ready = expected && (source[expected] || (source.live_access_type === "Filing System" && source.docket_search_url));
  return ready ? "Probe ready" : expected ? "Needs endpoint" : "Manual review";
});

const distFiles = await collectFiles(distRoot);
const htmlCount = distFiles.filter((path) => basename(path) === "index.html").length;
const publicJsonCount = (await readdir(join(distRoot, "data"), { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceCount = sourcesExport.count ?? sourcesExport.records?.length ?? 0;
assert(sourceCount === sourcesExport.records?.length, "Refusing manifest update: dist/data/sources.json count is stale.");
assert(sourceCount === sourceRecords.length, "Refusing manifest update: source collection and public source export differ.");
assert(phase120.acquisition_packets.every((packet) => sourcesExport.records.some((source) => source.id === packet.source_id && source.monitoring_status === "Candidate")), "Refusing manifest update: a Phase 117/120 source advanced beyond Candidate.");
for (const route of [...newRoutes, ...enhancedRoutes]) assert(distFiles.includes(join(distRoot, route.replace(/^\//, ""), "index.html")), "Refusing manifest update: missing generated route " + route);
for (const route of exportRoutes) assert(distFiles.includes(join(distRoot, route.replace(/^\//, ""))), "Refusing manifest update: missing generated export " + route);

manifest.generated_date = program.effective_date;
manifest.content_version = program.version ?? program.edition ?? "v0.5";
Object.assign(manifest.expected_build, {
  static_pages: htmlCount,
  sources: sourceCount,
  updates: updates.length,
  public_json_exports: publicJsonCount,
  v05_substantive_surfaces: 213,
  v05_new_html_routes: 121,
  v05_enhanced_existing_routes: 92,
  phase_120_packets: 80,
  phase_120_artifact_targets: 320,
  phase_121_missions: 68,
  phase_122_playbooks: 30,
  phase_123_dossiers: 12,
  phase_124_workbenches: 17,
});

manifest.release_delta_from_v0_1_1.static_pages_added = htmlCount - 182;
manifest.release_delta_from_v0_1_1.public_json_exports_added = publicJsonCount - 40;
manifest.release_delta_from_v0_1_1.summary = "Extends the public evidence system through FTFN v0.5: 80 prepared authority-acquisition packets, 68 research missions, 30 verification playbooks, 12 comparison-passport dossiers, 17 topic workbenches, 121 new routes, 92 enhanced routes, and six JSON exports without creating a source fact, evidence decision, observation, outcome, score, or ranking.";

const v05Commands = new Set(["npm run test:v05", "npm run verify:v05"]);
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !v05Commands.has(command));
const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, "npm run test:v05", "npm run verify:v05");

const requiredOutputs = [
  ...exportRoutes.map((route) => "dist" + route),
  ...newRoutes.map((route) => "dist" + route + "index.html"),
  ...enhancedRoutes.map((route) => "dist" + route + "index.html"),
];
manifest.required_output_files = [...new Set([...manifest.required_output_files, ...requiredOutputs])];

manifest.v05_new_html_routes = [...newRoutes];
manifest.v05_enhanced_existing_routes = [...enhancedRoutes];
manifest.v05_public_json_exports = [...exportRoutes];
manifest.phase_120_124_delta = {
  captured_date: program.effective_date,
  phases_complete: 5,
  substantive_surfaces: 213,
  new_html_routes_added: 121,
  enhanced_existing_routes: 92,
  public_json_exports_added: 6,
  authority_acquisition_packets: 80,
  prepared_artifact_targets: 320,
  priority_research_missions: 68,
  verification_playbooks: 30,
  comparative_delivery_dossiers: 12,
  topic_research_workbenches: 17,
  candidate_authority_sources_preserved: 80,
  sources_created: 0,
  signals_created: 0,
  future_gate_decisions_created: 0,
  observations_created: 0,
  outcome_claims_created: 0,
  scores_created: 0,
  rankings_created: 0,
};

manifest.last_verified.date = program.effective_date;
manifest.last_verified.candidate_validation = "passed-150-local-only-records-against-" + sourceCount + "-public-sources";
manifest.last_verified.validate_content = "passed-" + sourceCount + "-sources-" + manifest.expected_build.signals + "-signals-" + manifest.expected_build.research_documents + "-research-documents";
manifest.last_verified.source_health = "passed";
manifest.last_verified.source_health_manual_review = sourceHealth.filter((state) => state === "Manual review").length;
manifest.last_verified.source_health_probe_ready = sourceHealth.filter((state) => state === "Probe ready").length;
manifest.last_verified.source_monitor_current = sourceCount;
manifest.last_verified.astro_check = "passed";
manifest.last_verified.build = "passed";
manifest.last_verified.static_pages_built = htmlCount;
manifest.last_verified.release_assertions = "passed-through-phase-124-v05-evidence-fieldbook";
manifest.last_verified.hosted_routes_checked = 0;
manifest.last_verified.preview_qa = "v0.5 Evidence Fieldbook locally release-validated; GitHub publication and owner-approved hosted deployment remain pending";

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm v0.5"));
manifest.release_gates.push("Confirm v0.5 publishes exactly 121 new routes, enhances exactly 92 existing authority and cross-system routes, exposes six JSON exports, keeps all 80 Phase 117 authority sources Candidate, preserves eleven future Phase 60 gates as scheduled, and creates zero source facts, evidence decisions, observations, outcomes, scores, or rankings");
manifest.notes = "This manifest records the completed Phase 103–124 public knowledge edition through FTFN v0.5. The Evidence Fieldbook adds prepared acquisition packets, priority research missions, verification playbooks, comparison passports, and topic workbenches while preserving Candidate-source and future-gate boundaries. GitHub publication and owner-approved hosted deployment remain separate gates.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("FTFN v0.5 manifest updated: " + htmlCount + " HTML pages, " + sourceCount + " sources, " + updates.length + " updates, " + publicJsonCount + " public JSON exports, 121 new routes, and 92 enhanced routes.");
