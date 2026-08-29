import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const program = await readJson(appRoot, "src", "data", "v031-content-expansion.json");
const cycle = await readJson(appRoot, "src", "data", "phase-60-operating-cycle.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const routes = program.phases.flatMap((phase) => phase.routes);
check(program.schema_version === "1.0" && program.record_status === "Published", "The expansion must be a Published schema 1.0 program.");
check(program.effective_date === "2026-08-29", "The expansion must retain its actual effective date.");
check(program.phases.length === 5 && program.phases.every((phase, index) => phase.phase === 111 + index && phase.status === "Complete"), "Phases 111-115 must be complete and contiguous.");
check(routes.length === 54 && new Set(routes).size === 54 && program.counts.public_routes === 54, "The program must publish exactly 54 unique routes.");
check(program.evidence_cycle.records.length === 13 && program.counts.evidence_cycle_routes === 14, "Phase 111 must publish one cycle hub and thirteen gate pages.");
check(program.evidence_cycle.records.every((record) => cycle.records.some((source) => source.cycle_item_id === record.cycle_item_id && source.decision_status === record.decision_status && source.decision_date === record.decision_date && source.receipt_id === record.receipt_id)), "The public cycle changed an upstream decision state.");
check(cycle.records.filter((record) => record.scheduled_check_date > "2026-08-29").every((record) => record.decision_status === "scheduled" && !record.decision_date && !record.receipt_id), "A future Phase 60 gate was operated or predated.");
check(program.regions.length === 10 && program.counts.editorial_local_systems_total === 15, "Phase 112 must expand editorial local-system coverage from five to fifteen.");
check(program.casebooks.length === 16 && program.counts.casebooks_total === 24, "Phase 113 must expand the casebook shelf from eight to twenty-four.");
check(program.reports.length === 4 && program.lenses.length === 5 && program.counts.accessible_and_lens_routes === 10, "Phase 114 or 115 route counts are incomplete.");
check(program.translation_pilots.length === 2 && program.translation_pilots.every((pilot) => pilot.status === "In Review" && pilot.publication_route === null), "Translation pilots must remain In Review and unrouteable.");
check(program.publication_boundaries.some((item) => item.includes("No future Phase 60 gate")) && program.publication_boundaries.some((item) => item.includes("qualified human reviewer")), "Future-gate and human-review boundaries are required.");

for (const path of [
  "src/pages/review/evidence-cycle/index.astro", "src/pages/review/evidence-cycle/[slug].astro", "src/pages/review/regions/[slug].astro",
  "src/pages/review/casebooks/expanded/[slug].astro", "src/pages/review/reports/[slug].astro", "src/pages/review/accessibility/index.astro",
  "src/pages/review/accessibility/reports/[slug].astro", "src/pages/review/lenses/[slug].astro", "src/pages/data/v031-content-expansion.json.ts",
]) { try { await access(join(appRoot, path)); } catch { failures.push(`Missing route template: ${path}`); } }

const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.includes("v031"));
check(updates.length === 5, `Expected five v0.3.1 updates, found ${updates.length}.`);
for (let phase = 111; phase <= 115; phase += 1) {
  const workPackage = (await readdir(join(workspaceRoot, "docs", "work-packages"))).find((name) => name.startsWith(`phase-${phase}-v031-`));
  check(Boolean(workPackage), `Missing Phase ${phase} work package.`);
}

if (failures.length) {
  console.error("FTFN v0.3.1 content assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("FTFN v0.3.1 assertions passed: 5 phases, 54 routes, 0 future-gate, outcome or translation-review mutations.");
