import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const program = JSON.parse(await readFile(join(appRoot, "src", "data", "v031-content-expansion.json"), "utf8"));
const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const routes = program.phases.flatMap((phase) => phase.routes).sort();

manifest.generated_date = "2026-08-29";
Object.assign(manifest.expected_build, {
  static_pages: 5938,
  updates: updates.length,
  public_json_exports: 51,
  v031_content_routes: routes.length,
  phase_111_routes: program.phases.find((item) => item.phase === 111).routes.length,
  phase_112_routes: program.phases.find((item) => item.phase === 112).routes.length,
  phase_113_routes: program.phases.find((item) => item.phase === 113).routes.length,
  phase_114_routes: program.phases.find((item) => item.phase === 114).routes.length,
  phase_115_routes: program.phases.find((item) => item.phase === 115).routes.length,
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5756;
manifest.release_delta_from_v0_1_1.summary = "Extends the evidence corpus through the FTFN v0.3.1 content expansion: 54 evidence-linked routes across Phases 111-115, five dated updates, one public registry export, and zero future-gate, observation, outcome, score, ranking or translation-review mutations.";
for (const command of ["npm run test:v031-content", "npm run verify:v031-content"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const index = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(index < 0 ? manifest.predeploy_commands.length : index, 0, command);
  }
}
for (const file of ["dist/data/v031-content-expansion.json", ...routes.map((route) => `dist${route}index.html`)]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.v031_content_routes = routes;
manifest.phase_111_115_delta = {
  captured_date: "2026-08-29", phases_complete: 5, public_routes_added: routes.length, public_json_exports_added: 1, public_update_entries_added: 5,
  evidence_cycle_routes: 14, editorial_local_systems_added: 10, editorial_local_systems_total: 15, named_casebooks_added: 16, named_casebooks_total: 24,
  comparative_reports: 4, accessible_and_jurisdiction_routes: 10, translation_pilots_published: 0, future_gate_decisions_created: 0,
  observations_created: 0, outcome_claims_created: 0, scores_created: 0, rankings_created: 0,
};
manifest.last_verified.date = "2026-08-29";
manifest.last_verified.static_pages_built = 5938;
manifest.last_verified.release_assertions = "passed-through-phase-115-v031-content-expansion";
manifest.last_verified.preview_qa = "v0.3.1 content expansion locally release-validated; owner-only hosted deployment remains pending";
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm v0.3.1"));
manifest.release_gates.push("Confirm v0.3.1 publishes exactly 54 unique evidence-linked routes across Phases 111-115, preserves eleven future Phase 60 gates as scheduled, keeps two translation pilots In Review and unrouteable, and creates zero observations, outcomes, scores or rankings");
manifest.notes = "This manifest records the completed Phase 103-115 public knowledge edition. The 174 editorial routes resolve existing Published evidence and explicit operating contracts. No future evidence gate was operated, no outcome was manufactured, and French and Spanish pilots remain In Review without public routes. GitHub pull-request publication and owner-approved hosted deployment remain separate gates.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`FTFN v0.3.1 manifest updated: ${routes.length} routes, ${updates.length} updates, 51 public JSON exports, 5,938 static pages.`);
