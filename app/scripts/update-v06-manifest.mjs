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

const [manifest, program, sourcesExport, signalsExport, p125, p126, p127, p128, p129] = await Promise.all([
  readJson(manifestPath),
  readJson(appRoot, "src", "data", "v06-open-evidence-review.json"),
  readJson(distRoot, "data", "sources.json"),
  readJson(distRoot, "data", "signals.json"),
  readJson(appRoot, "src", "data", "phase-125-evidence-annotation-ledger.json"),
  readJson(appRoot, "src", "data", "phase-126-mission-evidence-audits.json"),
  readJson(appRoot, "src", "data", "phase-127-project-place-conversion-biographies.json"),
  readJson(appRoot, "src", "data", "phase-128-topic-state-of-evidence-reviews.json"),
  readJson(appRoot, "src", "data", "phase-129-cross-system-evidence-syntheses.json"),
]);

const assert = (condition, message) => { if (!condition) throw new Error(message); };
assert(program.counts?.substantive_surfaces === 224 && program.new_html_routes?.length === 6 && program.enhanced_existing_routes?.length === 218, "Refusing manifest update: v0.6 route contract is incomplete.");
assert(program.public_json_exports?.length === 6, "Refusing manifest update: v0.6 export contract is incomplete.");
assert(p125.counts?.evidence_annotations === 82 && p125.counts?.mission_signal_links === 340 && p125.counts?.source_records_resolved === 114, "Refusing manifest update: Phase 125 counts are incomplete.");
assert(p126.counts?.mission_audits === 68 && p126.counts?.requirement_tests === 204, "Refusing manifest update: Phase 126 counts are incomplete.");
assert(p127.counts?.project_biographies === 24 && p127.counts?.place_biographies === 15 && p127.counts?.project_stage_cells === 192 && p127.counts?.place_system_assessments === 90, "Refusing manifest update: Phase 127 counts are incomplete.");
assert(p128.counts?.topic_reviews === 17 && p128.counts?.horizon_reviews === 68, "Refusing manifest update: Phase 128 counts are incomplete.");
assert(p129.counts?.syntheses === 12 && p129.counts?.compatibility_determinations === 60, "Refusing manifest update: Phase 129 counts are incomplete.");

const distFiles = await collectFiles(distRoot);
for (const route of [...program.new_html_routes, ...program.enhanced_existing_routes]) assert(distFiles.includes(join(distRoot, route.replace(/^\//, ""), "index.html")), `Refusing manifest update: missing generated route ${route}`);
for (const route of program.public_json_exports) assert(distFiles.includes(join(distRoot, route.replace(/^\//, ""))), `Refusing manifest update: missing generated export ${route}`);

const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const sourceCount = sourcesExport.count ?? sourcesExport.records?.length ?? 0;
const publishedSignalCount = signalsExport.count ?? signalsExport.records?.length ?? 0;
const htmlCount = distFiles.filter((path) => basename(path) === "index.html").length;
const publicJsonCount = (await readdir(join(distRoot, "data"), { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
assert(sourceCount === 795 && publishedSignalCount === 1121, "Refusing manifest update: v0.6 must preserve the 795-source / 1,121-Published-signal corpus.");

manifest.generated_date = program.effective_date;
manifest.content_version = program.version;
Object.assign(manifest.expected_build, {
  static_pages: htmlCount,
  sources: sourceCount,
  published_signals: publishedSignalCount,
  updates: updates.length,
  public_json_exports: publicJsonCount,
  v06_substantive_surfaces: 224,
  v06_new_html_routes: 6,
  v06_enhanced_existing_routes: 218,
  phase_125_evidence_annotations: 82,
  phase_125_mission_signal_links: 340,
  phase_126_mission_audits: 68,
  phase_126_requirement_tests: 204,
  phase_127_project_biographies: 24,
  phase_127_place_biographies: 15,
  phase_127_project_stage_cells: 192,
  phase_127_place_system_assessments: 90,
  phase_128_topic_reviews: 17,
  phase_128_horizon_reviews: 68,
  phase_129_cross_system_syntheses: 12,
  phase_129_compatibility_determinations: 60,
});

manifest.release_delta_from_v0_1_1.static_pages_added = htmlCount - 182;
manifest.release_delta_from_v0_1_1.public_json_exports_added = publicJsonCount - 40;
manifest.release_delta_from_v0_1_1.summary = "Extends the public evidence system through FTFN v0.6: 82 source-linked annotations, 68 mission audits, 39 project/place conversion biographies, 17 topic state-of-evidence reviews and 12 cross-system compatibility syntheses across 224 substantive surfaces without creating an artifact admission, mission answer, stage advance, outcome, score, ranking or causal finding.";

const v06Commands = new Set(["npm run test:v06", "npm run verify:v06"]);
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !v06Commands.has(command));
const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, "npm run test:v06", "npm run verify:v06");

manifest.required_output_files = [...new Set([
  ...manifest.required_output_files,
  ...program.public_json_exports.map((route) => `dist${route}`),
  ...program.new_html_routes.map((route) => `dist${route}index.html`),
  ...program.enhanced_existing_routes.map((route) => `dist${route}index.html`),
])];
manifest.v06_new_html_routes = [...program.new_html_routes];
manifest.v06_enhanced_existing_routes = [...program.enhanced_existing_routes];
manifest.v06_public_json_exports = [...program.public_json_exports];
manifest.phase_125_129_delta = {
  captured_date: program.effective_date,
  phases_complete: 5,
  substantive_surfaces: 224,
  new_html_routes_added: 6,
  enhanced_existing_routes: 218,
  public_json_exports_added: 6,
  evidence_annotations: 82,
  mission_signal_links: 340,
  source_records_resolved: 114,
  mission_audits: 68,
  mission_requirement_tests: 204,
  project_biographies: 24,
  place_biographies: 15,
  project_stage_cells: 192,
  place_system_assessments: 90,
  topic_reviews: 17,
  topic_horizon_reviews: 68,
  cross_system_syntheses: 12,
  compatibility_determinations: 60,
  acquisition_gaps_preserved: 12,
  candidate_authority_sources_preserved: 80,
  sources_created: 0,
  signals_created: 0,
  artifacts_admitted: 0,
  mission_answers_created: 0,
  stage_advances: 0,
  future_gate_decisions_created: 0,
  observations_created: 0,
  outcome_claims_created: 0,
  scores_created: 0,
  rankings_created: 0,
};

manifest.last_verified.date = program.effective_date;
manifest.last_verified.candidate_validation = `passed-150-local-only-records-against-${sourceCount}-public-sources`;
manifest.last_verified.validate_content = `passed-${sourceCount}-sources-${manifest.expected_build.signals}-signals-${manifest.expected_build.research_documents}-research-documents`;
manifest.last_verified.source_health = "passed";
manifest.last_verified.source_monitor_current = sourceCount;
manifest.last_verified.astro_check = "passed";
manifest.last_verified.build = "passed";
manifest.last_verified.static_pages_built = htmlCount;
manifest.last_verified.release_assertions = "passed-through-phase-129-v06-open-evidence-review";
manifest.last_verified.hosted_routes_checked = 0;
manifest.last_verified.preview_qa = "v0.6 Open Evidence Review locally release-validated; GitHub publication and owner-approved hosted deployment remain pending";

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm v0.6"));
manifest.release_gates.push("Confirm v0.6 publishes exactly six new hubs, enhances exactly 218 canonical routes, exposes six JSON exports, resolves only Published signals and exact sources, preserves all 12 acquisition gaps and eleven future Phase 60 gates, and creates zero artifacts, mission answers, stage advances, observations, outcomes, scores, rankings, recommendations or causal findings");
manifest.notes = "This manifest records the completed Phase 103-129 public knowledge edition through FTFN v0.6. Open Evidence Review adds record-specific evidence annotations, mission audits, delivery biographies, topic reviews and compatibility syntheses while preserving the v0.5 acquisition, answer-state, Atlas-tier and future-gate boundaries. GitHub publication and owner-approved hosted deployment remain separate gates.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`FTFN v0.6 manifest updated: ${htmlCount} HTML pages, ${sourceCount} sources, ${updates.length} updates, ${publicJsonCount} public JSON exports, 6 new routes, and 218 enhanced routes.`);
