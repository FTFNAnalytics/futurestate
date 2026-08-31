import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePhase118 } from "./build-phase118-content.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

let report;
try { report = await validatePhase118(); }
catch (error) { failures.push(...(error.failures ?? [error.message])); }

const requiredFiles = [
  "src/data/phase-118-canonical-living-encyclopedia.json",
  "src/components/review/CanonicalChapter.astro",
  "src/pages/review/encyclopedia/index.astro",
  "src/pages/review/encyclopedia/topics/[slug].astro",
  "src/pages/review/encyclopedia/foundations/[slug].astro",
  "src/pages/data/phase-118-canonical-living-encyclopedia.json.ts",
  "scripts/build-phase118-content.mjs",
  "scripts/assert-phase118.mjs",
];
for (const path of requiredFiles) {
  try { await access(join(appRoot, path)); }
  catch { failures.push(`Missing Phase 118 file: ${path}`); }
}
try { await access(join(workspaceRoot, "docs", "work-packages", "phase-118-canonical-living-encyclopedia.md")); }
catch { failures.push("Missing Phase 118 work package."); }

const component = await readFile(join(appRoot, "src", "components", "review", "CanonicalChapter.astro"), "utf8");
for (const requiredText of [
  "Executive synthesis", "Historical baseline", "Current evidence state", "Dependency and conversion chain",
  "Contested interpretations", "Decisive evidence", "Claim boundary", "Primary source trail", "Open official source",
]) check(component.includes(requiredText), `Canonical chapter route is missing section: ${requiredText}`);

const topicRoute = await readFile(join(appRoot, "src", "pages", "review", "encyclopedia", "topics", "[slug].astro"), "utf8");
const foundationRoute = await readFile(join(appRoot, "src", "pages", "review", "encyclopedia", "foundations", "[slug].astro"), "utf8");
check(topicRoute.includes('record_status === "Published"') && foundationRoute.includes('record_status === "Published"'), "Both chapter routes must filter curated evidence to Published records.");
check(topicRoute.includes("source_ids") && foundationRoute.includes("source_ids"), "Both chapter routes must derive source links from upstream signal source IDs.");
check(report?.topicChapters === 17 && report?.foundationChapters === 10 && report?.chapters === 27, "Compiled Phase 118 counts are wrong.");
check((report?.curatedPublishedSignals ?? 0) >= 55, "Phase 118 should curate at least 55 distinct Published signals.");
check((report?.linkedSources ?? 0) >= 45, "Phase 118 should expose at least 45 distinct source records.");

if (failures.length) {
  console.error("Phase 118 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 118 assertions passed: ${report.chapters} substantive chapters, ${report.narrativeWords} narrative words, ${report.curatedPublishedSignals} Published signals, ${report.linkedSources} sources, and ${report.publicRoutes} routes.`);
