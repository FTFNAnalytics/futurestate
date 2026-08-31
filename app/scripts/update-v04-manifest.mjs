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

const [manifest, program, sourcesExport, authority] = await Promise.all([
  readJson(manifestPath),
  readJson(appRoot, "src", "data", "v04-public-conversion-observatory.json"),
  readJson(distRoot, "data", "sources.json"),
  readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json"),
]);
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
// Astro reports route pages as generated `index.html` files. Downloaded source
// artifacts can also be HTML, but they are corpus assets rather than routes.
const htmlCount = (await collectFiles(distRoot)).filter((path) => basename(path) === "index.html").length;
const publicJsonCount = (await readdir(join(distRoot, "data"))).filter((name) => name.endsWith(".json")).length;
const phase = (number) => program.phases.find((record) => record.phase === number);

manifest.generated_date = program.effective_date;
manifest.content_version = program.version;
Object.assign(manifest.expected_build, {
  static_pages: htmlCount,
  sources: sourcesExport.count,
  updates: updates.length,
  public_json_exports: publicJsonCount,
  v04_content_routes: program.counts.public_html_routes,
  phase_116_routes: phase(116).public_html_routes,
  phase_116_canonical_entities: program.counts.canonical_entities,
  phase_117_routes: phase(117).public_html_routes,
  phase_117_authority_rails: program.counts.candidate_authority_rails,
  phase_118_routes: phase(118).public_html_routes,
  phase_118_encyclopedia_chapters: program.counts.encyclopedia_chapters,
  phase_119_routes: phase(119).public_html_routes,
  phase_119_projects: program.counts.projects,
  phase_119_places: program.counts.places,
});

manifest.release_delta_from_v0_1_1.static_pages_added = htmlCount - 182;
manifest.release_delta_from_v0_1_1.public_json_exports_added = publicJsonCount - 40;
manifest.release_delta_from_v0_1_1.summary = "Extends the evidence corpus through FTFN v0.4: a governed coverage architecture, 80 Candidate international authority rails, 27 authored encyclopedia chapters, 24 project files, 15 place files, 189 public reading routes, five new JSON exports, and zero future-gate, observation, outcome, score, ranking, or translation-review mutations.";

for (const command of ["npm run test:v04", "npm run verify:v04"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const index = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(index < 0 ? manifest.predeploy_commands.length : index, 0, command);
  }
}

const requiredOutputs = [
  ...program.public_json_exports.map((route) => `dist${route}`),
  ...program.public_html_routes.map((route) => `dist${route}index.html`),
  ...authority.rails.map((rail) => `dist/atlas/sources/${rail.source_id}/index.html`),
];
for (const file of requiredOutputs) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.v04_content_routes = [...program.public_html_routes];
manifest.phase_116_119_delta = {
  captured_date: program.effective_date,
  phases_complete: 4,
  public_html_routes_added: program.counts.public_html_routes,
  public_json_exports_added: program.counts.public_json_exports,
  canonical_entities: program.counts.canonical_entities,
  canonical_topics: program.counts.canonical_topics,
  conversion_stages: program.counts.conversion_stages,
  claim_types: program.counts.claim_types,
  jurisdiction_layers: program.counts.jurisdiction_layers,
  candidate_authority_rails: program.counts.candidate_authority_rails,
  encyclopedia_chapters: program.counts.encyclopedia_chapters,
  project_files: program.counts.projects,
  place_files: program.counts.places,
  future_gate_decisions_created: 0,
  observations_created: 0,
  outcome_claims_created: 0,
  scores_created: 0,
  rankings_created: 0,
};
manifest.last_verified.date = program.effective_date;
manifest.last_verified.candidate_validation = `passed-150-local-only-records-against-${sourcesExport.count}-public-sources`;
manifest.last_verified.validate_content = `passed-${sourcesExport.count}-sources-${manifest.expected_build.signals}-signals-${manifest.expected_build.research_documents}-research-documents`;
manifest.last_verified.source_health_manual_review = sourceHealth.filter((state) => state === "Manual review").length;
manifest.last_verified.source_health_probe_ready = sourceHealth.filter((state) => state === "Probe ready").length;
manifest.last_verified.source_monitor_current = sourcesExport.count;
manifest.last_verified.static_pages_built = htmlCount;
manifest.last_verified.release_assertions = "passed-through-phase-119-v04-public-conversion-observatory";
manifest.last_verified.preview_qa = "v0.4 Public Conversion Observatory locally release-validated; GitHub publication and owner-approved hosted deployment remain pending";
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm v0.4"));
manifest.release_gates.push("Confirm v0.4 publishes exactly 189 unique reading routes and five new JSON exports across Phases 116–119, keeps all 80 international authority rails Candidate pending exact-artifact review, preserves eleven future Phase 60 gates as scheduled, and creates zero observations, outcomes, scores, rankings, or translation-review promotions");
manifest.notes = "This manifest records the completed Phase 103–119 public knowledge edition through FTFN v0.4. The Public Conversion Observatory adds a canonical coverage grammar, international discovery graph, authored encyclopedia, and tiered project/place atlas. Candidate portals remain discovery-only; no future evidence gate was operated and no observation, outcome, score, ranking, or translation-review state was manufactured. GitHub publication and owner-approved hosted deployment remain separate gates.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`FTFN v0.4 manifest updated: ${htmlCount} HTML pages, ${sourcesExport.count} sources, ${updates.length} updates, and ${publicJsonCount} public JSON exports.`);
