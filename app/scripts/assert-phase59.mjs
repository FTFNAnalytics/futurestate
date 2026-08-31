import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const manifest = await readJson("src", "data", "phase-59-content-pushes.json");
const update = await readJson("src", "content", "updates", "2026-08-11-phase-59-editorial-flagship-build.json");
const signalFiles = await readdir(join(appRoot, "src", "content", "signals"));
const sourceFiles = await readdir(join(appRoot, "src", "content", "sources"));

check(manifest.phase === "59", "The content manifest must identify Phase 59.");
check(manifest.local_conversion_dossiers.length === 5, "Phase 59 must publish five local conversion dossiers.");
check(manifest.technology_adoption_dossiers.length === 5, "Phase 59 must publish five technology-adoption dossiers.");
check(manifest.reader_integration.new_published_briefings === 12, "Phase 59 must publish twelve synthesis briefings.");
check(manifest.reader_integration.new_published_dependency_maps === 2, "Phase 59 must publish two dependency maps.");
check(manifest.reader_integration.reader_pathways_deepened === 14, "Phase 59 must deepen fourteen reader pathways.");
check(manifest.reader_integration.new_sources === 0 && manifest.reader_integration.new_signals === 0, "Phase 59 must remain a synthesis phase with no new source or signal records.");
check(manifest.reader_integration.underlying_signal_promotions === 0 && manifest.reader_integration.evidence_gaps_resolved === 0, "Phase 59 must not promote underlying signals or resolve gaps by synthesis.");
check(manifest.reader_integration.composite_scores_created === 0, "Phase 59 must create no composite score.");
check(signalFiles.filter((name) => name.endsWith(".mdx")).length === 1406, "Phase 59 must preserve the 1,406-signal corpus.");
check(sourceFiles.filter((name) => name.endsWith(".json")).length >= 715, "Phase 59 must preserve its 715-source baseline while allowing later governed source expansion.");

const briefingIds = [
  ...manifest.local_conversion_dossiers.map((item) => item.briefing_id),
  manifest.cross_system_products.briefing_id,
  manifest.measured_outcomes_product.briefing_id,
  ...manifest.technology_adoption_dossiers
];

const briefingFiles = [
  "briefing-local-conversion-001-southwest-chips.mdx",
  "briefing-local-conversion-002-northern-virginia-compute.mdx",
  "briefing-local-conversion-003-nevada-lithium.mdx",
  "briefing-local-conversion-004-space-coast.mdx",
  "briefing-local-conversion-005-ontario-housing.mdx",
  "briefing-constraint-atlas-001-frontier-system-conversion.mdx",
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-adoption-001-post-quantum-migration.mdx",
  "briefing-adoption-002-ai-assurance.mdx",
  "briefing-adoption-003-autonomy-evtol.mdx",
  "briefing-adoption-004-advanced-manufacturing.mdx",
  "briefing-adoption-005-critical-minerals.mdx"
];

check(new Set(briefingIds).size === 12, "Every Phase 59 briefing must have a unique ID.");
for (const file of briefingFiles) {
  const content = await readText("src", "content", "briefings", file);
  check(/record_status: "Published"/.test(content), `${file} must be Published.`);
  check((content.match(/last_reviewed_date:\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? "") >= "2026-08-11", `${file} must preserve the Phase 59-or-later review date.`);
  check(/## Boundary|## What remains open|## Comparison boundary|## Reader boundary/.test(content), `${file} must expose an interpretation or evidence boundary.`);
}

for (const mapFile of ["frontier-system-constraint-atlas.json", "technology-adoption-is-not-operating-outcome.json"]) {
  const map = await readJson("src", "content", "dependency-maps", mapFile);
  check(map.record_status === "Published", `${mapFile} must be Published.`);
  check(map.what_this_map_does_not_prove.length >= 3, `${mapFile} must expose at least three non-claims.`);
  check(!JSON.stringify(map).toLowerCase().includes('"score"'), `${mapFile} must not create a score field.`);
}

for (const dossier of manifest.local_conversion_dossiers) {
  const localFile = `${dossier.local_system_id.replace("local-", "local-")}.mdx`;
  const content = await readText("src", "content", "local-systems", localFile);
  check((content.match(/last_reviewed_date:\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? "") >= "2026-08-11", `${localFile} must preserve the Phase 59-or-later review date.`);
  check(content.includes("## Phase 59 Canonical Conversion View"), `${localFile} must link its canonical conversion view.`);
}

const pathwayFiles = [
  "local-conversion-southwest-ontario.json",
  "northern-virginia-compute-to-service.json",
  "nevada-lithium-authorization-to-output.json",
  "space-coast-plan-to-mission.json",
  "chips-compute-research-to-fab.json",
  "ai-infrastructure-policy-to-assurance.json",
  "autonomy-regulation-to-service.json",
  "advanced-manufacturing-research-to-production.json",
  "advanced-manufacturing-workforce-to-operating-capacity.json",
  "critical-minerals-to-industrial-capacity.json",
  "policy-standards-to-implementation.json",
  "cross-corridor-authorization-to-operation.json",
  "energy-grid-capacity-to-service.json",
  "industrial-water-agreement-to-reuse-operation.json"
];

for (const pathwayFile of pathwayFiles) {
  const pathway = await readJson("src", "content", "reader-pathways", pathwayFile);
  const hasPhase59Briefing = pathway.briefing_ids.some((id) => briefingIds.includes(id));
  const hasPhase59Map = pathway.dependency_map_ids.some((id) => [manifest.cross_system_products.dependency_map_id, manifest.technology_adoption_map_id].includes(id));
  check(hasPhase59Briefing, `${pathwayFile} must reference a Phase 59 briefing.`);
  check(hasPhase59Map, `${pathwayFile} must reference a Phase 59 dependency map.`);
}

check(update.affected_record_ids.length === 14, "The Phase 59 update must name all twelve briefings and two maps.");
check(/adds no source, signal, promotion, gap resolution, score, ranking, or operating-outcome claim/.test(update.evidence_note), "The Phase 59 update must preserve the synthesis boundary.");

if (failures.length) {
  console.error("Phase 59 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 59 assertions passed: 5 local dossiers, 1 Constraint Atlas briefing, 1 Outcomes Watch, 5 adoption dossiers, 2 dependency maps, and 14 integrated pathways with no new source, signal, promotion, gap resolution, or score.");
