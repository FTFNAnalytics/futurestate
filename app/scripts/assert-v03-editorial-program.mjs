import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const program = await readJson(appRoot, "src", "data", "v03-editorial-program.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const routes = program.phases.flatMap((phase) => phase.routes);
check(program.schema_version === "1.0" && program.record_status === "Published", "The v0.3 program must be a Published schema 1.0 dataset.");
check(program.effective_date === "2026-08-29", "The v0.3 program must retain its actual effective date.");
check(program.phases.length === 8 && program.phases.every((phase, index) => phase.phase === 103 + index && phase.status === "Complete"), "Phases 103-110 must be complete and contiguous.");
check(routes.length === 120 && new Set(routes).size === 120 && program.counts.public_routes === 120, "The program must publish exactly 120 unique routes.");
check(program.topics.length === 17 && program.local_systems.length === 5 && program.casebooks.length === 8, "Canonical review counts must be 17 topics, five places and eight casebooks.");
check(program.cross_system_stories.length === 12 && program.outcomes.length === 8 && program.journeys.length === 8, "Story, outcome and journey counts are incomplete.");
check(program.accessible_editions.length === 22 && program.accessible_editions.every((edition) => edition.review_state === "Published"), "Accessible editions must contain 17 plain-language and five low-bandwidth routes.");
check(program.translation_pilots.length === 2 && program.translation_pilots.every((pilot) => pilot.status === "In Review" && pilot.publication_route === null), "Translation pilots must remain unrouteable and In Review.");
check(program.cross_system_stories.every((story) => story.interpretation_boundary.includes("creates no new evidence")), "Every cross-system story needs the no-new-evidence boundary.");
check(program.publication_boundaries.some((item) => item.includes("future receipt")) && program.publication_boundaries.some((item) => item.includes("qualified human reviewer")), "Future-gate and human-translation boundaries are required.");

const expectedTemplates = [
  "src/pages/review/index.astro", "src/pages/review/method.astro", "src/pages/review/topics/[slug].astro",
  "src/pages/review/places/[slug].astro", "src/pages/review/casebooks/[slug].astro", "src/pages/review/systems/[slug].astro",
  "src/pages/review/outcomes/[slug].astro", "src/pages/review/uncertainty/[slug].astro", "src/pages/learn/[slug].astro",
  "src/pages/editions/[slug].astro", "src/pages/review/state-of-frontier-systems/index.astro", "src/pages/review/corrections/index.astro",
  "src/pages/review/freshness/index.astro", "src/pages/review/calendar/index.astro", "src/pages/review/journeys/[slug].astro",
  "src/pages/data/v03-editorial-review.json.ts",
];
for (const path of expectedTemplates) {
  try { await access(join(appRoot, path)); } catch { failures.push(`Missing route template: ${path}`); }
}

const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.startsWith("2026-08-29-phase-10") || name.startsWith("2026-08-29-phase-110"));
check(updates.length === 8, `Expected eight v0.3 phase updates, found ${updates.length}.`);
for (let phase = 103; phase <= 110; phase += 1) {
  const workPackage = (await readdir(join(workspaceRoot, "docs", "work-packages"))).find((name) => name.startsWith(`phase-${phase}-v03-`));
  check(Boolean(workPackage), `Missing Phase ${phase} work package.`);
}

const phase60 = await readJson(appRoot, "src", "data", "phase-60-operating-cycle.json");
const futureRecords = phase60.records.filter((record) => record.scheduled_check_date > "2026-08-29");
check(futureRecords.every((record) => !record.decision_date && !record.receipt_id), "A future Phase 60 gate has been operated or predated.");
const phase69 = await readJson(appRoot, "src", "data", "phase-69-measurement-observation-break-registry.json");
check(phase69.measurement_specifications.every((spec) => spec.current_observation_count === 0 && spec.current_series_point_count === 0), "The editorial program must not create observations or series points.");

if (failures.length) {
  console.error("FTFN v0.3 editorial assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("FTFN v0.3 editorial assertions passed: 8 phases, 120 routes, 0 future-gate or outcome mutations.");
