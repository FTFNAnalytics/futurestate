import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readFrontmatter = async (path) => {
  const body = await readFile(path, "utf8");
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`Missing frontmatter: ${path}`);
  return yaml.load(match[1]);
};
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const [atlas, coverage116, projects61, events62, gates63, matrix64, program03, program031, cycle60] = await Promise.all([
  readJson(dataRoot, "phase-119-deep-project-place-atlas.json"),
  readJson(dataRoot, "phase-116-coverage-architecture.json"),
  readJson(dataRoot, "phase-61-project-conversion-registry.json"),
  readJson(dataRoot, "phase-62-conversion-event-ledgers.json"),
  readJson(dataRoot, "phase-63-conversion-gate-calendar.json"),
  readJson(dataRoot, "phase-64-conversion-stage-matrix.json"),
  readJson(dataRoot, "v03-editorial-program.json"),
  readJson(dataRoot, "v031-content-expansion.json"),
  readJson(dataRoot, "phase-60-operating-cycle.json"),
]);

const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.endsWith(".json"));
const signals = await Promise.all(signalFiles.map((name) => readFrontmatter(join(contentRoot, "signals", name))));
const sources = await Promise.all(sourceFiles.map((name) => readJson(contentRoot, "sources", name)));
const signalById = new Map(signals.map((record) => [record.id, record]));
const sourceIds = new Set(sources.map((record) => record.id));

check(atlas.schema_version === "1.0" && atlas.phase === 119 && atlas.record_status === "Published", "The Phase 119 registry must be a Published schema 1.0 record.");
check(atlas.effective_date === "2026-08-30", "Phase 119 must retain its actual review date.");
check(atlas.projects.length === 24 && atlas.places.length === 15, "The Atlas must contain exactly 24 projects and 15 places.");
check(atlas.projects.filter((record) => record.coverage.tier_id === "Tier A").length === 8, "Exactly eight project files must remain Tier A governed files.");
check(atlas.projects.filter((record) => record.coverage.tier_id === "Tier B").length === 16, "Exactly sixteen project files must remain Tier B curated cases.");
check(atlas.places.filter((record) => record.coverage.tier_id === "Tier A").length === 5, "Exactly five places must remain Tier A canonical local profiles.");
check(atlas.places.filter((record) => record.coverage.tier_id === "Tier B").length === 10, "Exactly ten places must remain Tier B curated portraits.");
check(new Set(atlas.projects.map((record) => record.atlas_project_id)).size === 24, "Project Atlas IDs must be unique.");
check(new Set(atlas.projects.map((record) => record.canonical_id)).size === 24, "Project canonical IDs must be unique.");
check(new Set(atlas.projects.map((record) => record.slug)).size === 24, "Project slugs must be unique.");
check(new Set(atlas.places.map((record) => record.atlas_place_id)).size === 15, "Place Atlas IDs must be unique.");
check(new Set(atlas.places.map((record) => record.canonical_id)).size === 15, "Place canonical IDs must be unique.");
check(new Set(atlas.places.map((record) => record.slug)).size === 15, "Place slugs must be unique.");
check(atlas.update_owners.length === 3 && atlas.update_owners.every((owner) => owner.owner_id && owner.role), "All three update-owner roles are required.");
check(atlas.identity_contract?.canonical_identity_registry === "phase-116-coverage-architecture" && atlas.identity_contract?.atlas_project_id_role.includes("record identity") && atlas.identity_contract?.atlas_place_id_role.includes("record identity"), "Phase 119 must identify Phase 116 as canonical and scope 119 IDs to record identity.");

const canonicalCasebooks = coverage116.entity_registry.casebooks;
const canonicalLocalSystems = coverage116.entity_registry.local_systems;
check(canonicalCasebooks.length === 24 && canonicalLocalSystems.length === 15, "The Phase 116 canonical entity inventory is incomplete.");
check(canonicalCasebooks.every((canonical) => atlas.projects.some((record) => record.canonical_id === canonical.canonical_id && record.slug === canonical.slug)), "Phase 119 does not join one-to-one to every Phase 116 casebook canonical ID.");
check(canonicalLocalSystems.every((canonical) => atlas.places.some((record) => record.canonical_id === canonical.canonical_id && record.slug === canonical.slug)), "Phase 119 does not join one-to-one to every Phase 116 local-system canonical ID.");
check(atlas.projects.every((record) => canonicalCasebooks.some((canonical) => canonical.canonical_id === record.canonical_id && canonical.slug === record.slug)), "A Phase 119 project canonical ID is absent from Phase 116.");
check(atlas.places.every((record) => canonicalLocalSystems.some((canonical) => canonical.canonical_id === record.canonical_id && canonical.slug === record.slug)), "A Phase 119 place canonical ID is absent from Phase 116.");

const expectedProjectLegacyIds = [...program03.casebooks.map((record) => record.file_id), ...program031.casebooks.map((record) => record.casebook_id)];
const actualProjectLegacyIds = atlas.projects.flatMap((record) => record.legacy_ids);
check(expectedProjectLegacyIds.every((id) => actualProjectLegacyIds.includes(id)) && actualProjectLegacyIds.length === expectedProjectLegacyIds.length, "Every one of the 24 prior casebooks must resolve exactly once.");
const expectedPlaceLegacyIds = [...program03.local_systems.map((record) => record.id), ...program031.regions.map((record) => record.portrait_id)];
const actualPlaceLegacyIds = atlas.places.flatMap((record) => record.legacy_ids);
check(expectedPlaceLegacyIds.every((id) => actualPlaceLegacyIds.includes(id)) && actualPlaceLegacyIds.length === expectedPlaceLegacyIds.length, "Every one of the 15 prior place records must resolve exactly once.");

const tierAProjects = atlas.projects.filter((record) => record.coverage.tier_id === "Tier A");
for (const project of tierAProjects) {
  const fileId = project.relationships.phase_61_file_ids[0];
  const sourceProject = projects61.records.find((record) => record.file_id === fileId);
  const sourceLedger = events62.ledgers.find((record) => record.file_id === fileId);
  const sourceGate = gates63.gate_records.find((record) => record.file_id === fileId);
  const sourceMatrix = matrix64.file_rows.find((record) => record.file_id === fileId);
  check(Boolean(sourceProject && sourceLedger && sourceGate && sourceMatrix), `${project.atlas_project_id} has an incomplete Phase 61–64 relationship set.`);
  if (sourceProject && sourceLedger && sourceGate) {
    check(project.conversion.current_stage === sourceProject.current_stage, `${project.atlas_project_id} changed its governed current stage.`);
    check(JSON.stringify(project.chronology.event_ids) === JSON.stringify(sourceLedger.event_ids), `${project.atlas_project_id} changed its governed event ledger.`);
    check(project.relationships.phase_63_gate_ids.length === 1 && project.relationships.phase_63_gate_ids[0] === sourceGate.gate_id, `${project.atlas_project_id} changed its governed gate identity.`);
    check(JSON.stringify(project.evidence_rails.signal_ids) === JSON.stringify(sourceProject.signal_ids), `${project.atlas_project_id} changed its governed signal rail.`);
    check(JSON.stringify(project.evidence_rails.source_ids) === JSON.stringify(sourceProject.source_ids), `${project.atlas_project_id} changed its governed source rail.`);
  }
}

const tierBProjects = atlas.projects.filter((record) => record.coverage.tier_id === "Tier B");
for (const project of tierBProjects) {
  check(project.relationships.phase_61_file_ids.length === 0 && project.relationships.phase_62_event_ids.length === 0 && project.relationships.phase_63_gate_ids.length === 0 && project.relationships.phase_64_row_ids.length === 0, `${project.atlas_project_id} invented a governed Phase 61–64 relationship.`);
  check(project.conversion.current_stage.startsWith("Not established"), `${project.atlas_project_id} must expose its unestablished governed stage.`);
  check(project.chronology.chronology_type === "Curated Published-signal chronology" && project.evidence_rails.signal_ids.length > 0, `${project.atlas_project_id} needs a nonempty explicit curated chronology.`);
  check(project.evidence_rails.signal_ids.every((id) => !id.includes("signal_terms")), `${project.atlas_project_id} contains a keyword selector instead of stable IDs.`);
}
check(atlas.projects.find((record) => record.slug === "victoria-big-battery")?.evidence_rails.signal_ids.length === 3, "The Victorian Big Battery case must repair its prior zero-record keyword result with three explicit signals.");

for (const record of [...atlas.projects, ...atlas.places]) {
  check(Boolean(record.update_owner_id && record.update_status && record.last_reviewed_date), `${record.slug} lacks update ownership or status.`);
  check(Boolean(record.conversion.current_stage && record.conversion.unresolved && record.conversion.unresolved_gate && record.conversion.exact_next_artifact && record.conversion.stop_rule), `${record.slug} lacks a bounded conversion or next-artifact contract.`);
  check(record.evidence_rails.signal_ids.every((id) => signalById.has(id)), `${record.slug} links a missing signal.`);
  check(record.evidence_rails.source_ids.every((id) => sourceIds.has(id)), `${record.slug} links a missing source.`);
  check(record.evidence_rails.signal_ids.length === new Set(record.evidence_rails.signal_ids).size, `${record.slug} repeats a signal ID.`);
  check(record.evidence_rails.source_ids.length === new Set(record.evidence_rails.source_ids).size, `${record.slug} repeats a source ID.`);
}
for (const record of [
  ...atlas.projects.filter((item) => item.coverage.tier_id === "Tier B"),
  ...atlas.places.filter((item) => item.coverage.tier_id === "Tier B"),
]) {
  check(record.evidence_rails.signal_ids.every((id) => signalById.get(id)?.record_status === "Published"), `${record.slug} uses a non-Published signal in a Tier B public evidence shelf.`);
}

for (const project of atlas.projects) {
  for (const placeId of project.relationships.related_place_ids) {
    const place = atlas.places.find((record) => record.atlas_place_id === placeId);
    check(Boolean(place), `${project.atlas_project_id} links a missing place ${placeId}.`);
    check(place?.relationships.related_project_ids.includes(project.atlas_project_id), `${project.atlas_project_id} and ${placeId} are not reciprocal.`);
  }
}
for (const place of atlas.places) {
  for (const projectId of place.relationships.related_project_ids) {
    const project = atlas.projects.find((record) => record.atlas_project_id === projectId);
    check(Boolean(project), `${place.atlas_place_id} links a missing project ${projectId}.`);
    check(project?.relationships.related_place_ids.includes(place.atlas_place_id), `${place.atlas_place_id} and ${projectId} are not reciprocal.`);
  }
}

const computedCounts = {
  project_signal_links: atlas.projects.reduce((sum, record) => sum + record.evidence_rails.signal_ids.length, 0),
  project_source_links: atlas.projects.reduce((sum, record) => sum + record.evidence_rails.source_ids.length, 0),
  place_signal_links: atlas.places.reduce((sum, record) => sum + record.evidence_rails.signal_ids.length, 0),
  place_source_links: atlas.places.reduce((sum, record) => sum + record.evidence_rails.source_ids.length, 0),
};
for (const [key, value] of Object.entries(computedCounts)) check(atlas.counts[key] === value, `The ${key} count is stale.`);
check(atlas.counts.public_html_routes === 41 && atlas.counts.public_json_exports === 1, "The Phase 119 public route contract must be 41 HTML routes and one JSON export.");

const futureCycleRecords = cycle60.records.filter((record) => record.scheduled_check_date > atlas.effective_date);
check(futureCycleRecords.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 119 operated or predated a future Phase 60 gate.");

const expandedCaseRoute = await readFile(join(appRoot, "src", "pages", "review", "casebooks", "expanded", "[slug].astro"), "utf8");
const expandedPlaceRoute = await readFile(join(appRoot, "src", "pages", "review", "regions", "[slug].astro"), "utf8");
check(expandedCaseRoute.includes("atlasProject.evidence_rails.signal_ids") && !expandedCaseRoute.includes("record.signal_terms"), "The sixteen expanded casebooks still use keyword-only signal selection.");
check(expandedPlaceRoute.includes("atlasPlace.evidence_rails.signal_ids") && !expandedPlaceRoute.includes("portrait.signal_terms"), "The ten expanded place portraits still use keyword-only signal selection.");

for (const path of [
  "scripts/build-phase119-deep-project-place-atlas.mjs",
  "scripts/assert-phase119.mjs",
  "scripts/verify-phase119-build.mjs",
  "src/pages/atlas/projects/index.astro",
  "src/pages/atlas/projects/[slug].astro",
  "src/pages/atlas/places/index.astro",
  "src/pages/atlas/places/[slug].astro",
  "src/pages/data/deep-project-place-atlas.json.ts",
]) {
  try { await access(join(appRoot, path)); } catch { failures.push(`Missing Phase 119 file: ${path}`); }
}
try { await access(join(workspaceRoot, "docs", "work-packages", "phase-119-v04-deep-project-place-atlas.md")); } catch { failures.push("Missing Phase 119 work package."); }
try {
  const update = await readJson(contentRoot, "updates", "2026-08-30-phase-119-deep-project-place-atlas.json");
  check(update.id === "update-2026-08-30-phase-119-deep-project-place-atlas" && update.materiality === "No record-state change", "The Phase 119 public update has the wrong identity or materiality.");
  check(update.related_paths.includes(atlas.routes.project_index) && update.related_paths.includes(atlas.routes.place_index) && update.related_paths.includes(atlas.routes.public_export), "The Phase 119 public update is missing Atlas routes.");
} catch { failures.push("Missing or unreadable Phase 119 public update."); }

if (failures.length > 0) {
  console.error("FTFN Phase 119 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`FTFN Phase 119 assertions passed: ${atlas.projects.length} projects, ${atlas.places.length} places, ${computedCounts.project_signal_links + computedCounts.place_signal_links} explicit signal links, and ${computedCounts.project_source_links + computedCounts.place_source_links} explicit source links.`);
