import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const program = JSON.parse(await readFile(join(appRoot, "src", "data", "v03-editorial-program.json"), "utf8"));
const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const routes = program.phases.flatMap((phase) => phase.routes).sort();

manifest.generated_date = "2026-08-29";
Object.assign(manifest.expected_build, {
  static_pages: 5884,
  updates: updates.length,
  public_json_exports: 50,
  v03_editorial_routes: routes.length,
  phase_103_routes: program.phases.find((item) => item.phase === 103).routes.length,
  phase_104_routes: program.phases.find((item) => item.phase === 104).routes.length,
  phase_105_routes: program.phases.find((item) => item.phase === 105).routes.length,
  phase_106_routes: program.phases.find((item) => item.phase === 106).routes.length,
  phase_107_routes: program.phases.find((item) => item.phase === 107).routes.length,
  phase_108_routes: program.phases.find((item) => item.phase === 108).routes.length,
  phase_109_routes: program.phases.find((item) => item.phase === 109).routes.length,
  phase_110_routes: program.phases.find((item) => item.phase === 110).routes.length,
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5702;
manifest.release_delta_from_v0_1_1.summary = "Extends the evidence corpus through the FTFN v0.3 public knowledge edition: 120 evidence-linked editorial routes across Phases 103-110, eight dated updates, one public registry export, and zero future-gate, observation, outcome, score, ranking or translation-review mutations.";
for (const command of ["npm run test:v03-editorial", "npm run verify:v03-editorial"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const index = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(index < 0 ? manifest.predeploy_commands.length : index, 0, command);
  }
}
for (const file of [
  "dist/data/v03-editorial-review.json", "dist/review/index.html", "dist/review/method/index.html",
  "dist/review/state-of-frontier-systems/index.html", "dist/review/corrections/index.html", "dist/review/freshness/index.html",
  "dist/review/calendar/index.html", ...routes.map((route) => `dist${route}index.html`),
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.v03_editorial_routes = routes;
manifest.phase_103_110_delta = {
  captured_date: "2026-08-29",
  phases_complete: 8,
  public_routes_added: routes.length,
  public_json_exports_added: 1,
  public_update_entries_added: 8,
  canonical_topic_chapters: 17,
  local_system_portraits: 5,
  named_casebooks: 8,
  cross_system_stories: 12,
  outcome_observatories: 8,
  uncertainty_pages: 17,
  civic_learning_modules: 17,
  accessible_editions: 22,
  living_publication_routes: 12,
  translation_pilots_published: 0,
  future_gate_decisions_created: 0,
  observations_created: 0,
  outcome_claims_created: 0,
  scores_created: 0,
  rankings_created: 0,
};
manifest.last_verified.date = "2026-08-29";
manifest.last_verified.static_pages_built = 5884;
manifest.last_verified.release_assertions = "passed-through-phase-110-v03-public-knowledge-edition";
manifest.last_verified.preview_qa = "v0.3 editorial program locally release-validated; visual QA not requested; owner-only deployment pending; existing hosted version remains unchanged";
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm v0.3"));
manifest.release_gates.push("Confirm v0.3 publishes exactly 120 unique evidence-linked routes across Phases 103-110, keeps two translation pilots In Review and unrouteable, and creates zero future receipts, gate advances, observations, outcome claims, scores or rankings");
manifest.notes = "This manifest records the completed Phase 103-110 v0.3 public knowledge edition on top of the Phase 102 corpus. The 120 routes are editorial reading surfaces over existing evidence and bounded operating contracts. No future evidence gate was operated, no outcome was manufactured, and French and Spanish translation pilots remain In Review without public routes. Commit, push and owner-approved deployment remain separate gates.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`FTFN v0.3 manifest updated: ${routes.length} routes, ${updates.length} updates, 50 public JSON exports, 5,884 static pages.`);
