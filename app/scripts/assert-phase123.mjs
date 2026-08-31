import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const readJson = async (name) => JSON.parse(await readFile(join(appRoot, "src", "data", name), "utf8"));
const frontmatter = (raw) => raw.split(/^---\s*$/m)[1] ?? "";
const scalar = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\r\\n]+))\\s*$`, "m"));
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
};
const sameSet = (left, right) => left.length === right.length && left.every((item) => new Set(right).has(item));
const [registry, v03, atlas, operatingCycle] = await Promise.all([
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("v03-editorial-program.json"),
  readJson("phase-119-deep-project-place-atlas.json"),
  readJson("phase-60-operating-cycle.json"),
]);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const projectIds = new Set(atlas.projects.map((record) => record.atlas_project_id));
const placeIds = new Set(atlas.places.map((record) => record.atlas_place_id));
const storyIds = new Set(v03.cross_system_stories.map((record) => record.story_id));
const projectById = new Map(atlas.projects.map((record) => [record.atlas_project_id, record]));
const placeById = new Map(atlas.places.map((record) => [record.atlas_place_id, record]));
const signalStatusById = new Map();
for (const name of await readdir(join(appRoot, "src", "content", "signals"))) {
  if (!/\.mdx?$/.test(name)) continue;
  const block = frontmatter(await readFile(join(appRoot, "src", "content", "signals", name), "utf8"));
  signalStatusById.set(scalar(block, "id"), scalar(block, "record_status"));
}
const sourceIds = new Set();
for (const name of await readdir(join(appRoot, "src", "content", "sources"))) {
  if (!name.endsWith(".json")) continue;
  sourceIds.add((await JSON.parse(await readFile(join(appRoot, "src", "content", "sources", name), "utf8"))).id);
}
const systemTemplate = await readFile(join(appRoot, "src", "pages", "review", "systems", "[slug].astro"), "utf8");
const update = JSON.parse(await readFile(join(appRoot, "src", "content", "updates", "2026-08-30-phase-123-comparative-delivery-dossiers.json"), "utf8"));
const workPackage = await readFile(join(workspaceRoot, "docs", "work-packages", "phase-123-v05-comparative-delivery-dossiers.md"), "utf8");

check(registry.program_id === "FTFN-PHASE-123-COMPARATIVE-DELIVERY-DOSSIERS" && registry.status === "Complete", "Phase 123 registry identity or status is invalid.");
check(registry.dossiers.length === 12 && registry.counts.dossiers === 12, "Phase 123 must contain twelve dossiers.");
check(new Set(registry.dossiers.map((record) => record.dossier_id)).size === 12, "Phase 123 dossier IDs must be unique.");
check(new Set(registry.dossiers.map((record) => record.legacy_story_id)).size === 12 && sameSet(registry.dossiers.map((record) => record.legacy_story_id), [...storyIds]), "Every Phase 105 story must resolve exactly once.");
for (const record of registry.dossiers) {
  check(record.atlas_project_ids.length >= 2 && new Set(record.atlas_project_ids).size === record.atlas_project_ids.length && record.atlas_project_ids.every((id) => projectIds.has(id)), `${record.dossier_id} needs at least two unique exact project joins.`);
  check(record.atlas_place_ids.length >= 1 && new Set(record.atlas_place_ids).size === record.atlas_place_ids.length && record.atlas_place_ids.every((id) => placeIds.has(id)), `${record.dossier_id} needs a unique exact place join.`);
  check(record.evidence_signal_ids.length >= 2 && new Set(record.evidence_signal_ids).size === record.evidence_signal_ids.length, `${record.dossier_id} signal links are insufficient or duplicated.`);
  check(record.evidence_source_ids.length >= 2 && new Set(record.evidence_source_ids).size === record.evidence_source_ids.length, `${record.dossier_id} source links are insufficient or duplicated.`);
  const atlasRecords = [
    ...record.atlas_project_ids.map((id) => projectById.get(id)),
    ...record.atlas_place_ids.map((id) => placeById.get(id)),
  ];
  const inheritedSignals = new Set(atlasRecords.flatMap((item) => item?.evidence_rails.signal_ids ?? []));
  const inheritedSources = new Set(atlasRecords.flatMap((item) => item?.evidence_rails.source_ids ?? []));
  for (const id of record.evidence_signal_ids) {
    check(signalStatusById.has(id), `${record.dossier_id} references missing signal ${id}.`);
    check(signalStatusById.get(id) === "Published", `${record.dossier_id} references non-Published signal ${id}.`);
    check(inheritedSignals.has(id), `${record.dossier_id} signal ${id} is not inherited from a selected Atlas record.`);
  }
  for (const id of record.evidence_source_ids) {
    check(sourceIds.has(id), `${record.dossier_id} references missing source ${id}.`);
    check(inheritedSources.has(id), `${record.dossier_id} source ${id} is not inherited from a selected Atlas record.`);
  }
  check(record.comparison_passport.verdict === "Context only" && /No shared performance denominator/.test(record.comparison_passport.unit_and_denominator), `${record.dossier_id} must preserve its comparison embargo.`);
  check(record.reader_checklist.length >= 5 && record.what_is_comparable && record.what_must_not_be_compared && record.decisive_next_evidence, `${record.dossier_id} lacks its reviewer contract.`);
  check(/does not rank/.test(record.interpretation_boundary), `${record.dossier_id} lacks the non-ranking boundary.`);
}
const signalLinkCount = registry.dossiers.reduce((sum, record) => sum + record.evidence_signal_ids.length, 0);
const sourceLinkCount = registry.dossiers.reduce((sum, record) => sum + record.evidence_source_ids.length, 0);
check(registry.counts.evidence_signal_links === signalLinkCount, "Phase 123 aggregate Published-signal link count is stale.");
check(registry.counts.evidence_source_links === sourceLinkCount, "Phase 123 aggregate source-link count is stale.");
check(update.summary.includes(`${signalLinkCount} Published signal links`) && update.summary.includes(`${sourceLinkCount} source links`), "The Phase 123 update does not expose the recomputed evidence-link counts.");
check(workPackage.includes(`${signalLinkCount} existing Published signal links`) && workPackage.includes(`${sourceLinkCount} inherited, resolved source links`), "The Phase 123 work package does not expose the recomputed evidence-link counts.");
check(systemTemplate.includes('getCollection("sources")') && systemTemplate.includes("dossier.evidence_source_ids.map") && systemTemplate.includes("Exact source provenance") && systemTemplate.includes("/atlas/sources/"), "The enhanced system template does not resolve and expose every exact Phase 123 source ID.");
const future = operatingCycle.records.filter((record) => record.scheduled_check_date > "2026-08-30");
check(future.length === 11 && future.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 123 must leave eleven future gates untouched.");

if (failures.length) {
  console.error("Phase 123 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Phase 123 assertions passed: ${registry.dossiers.length} explicit dossiers, ${registry.counts.evidence_signal_links} signal links, ${registry.counts.evidence_source_links} source links and zero rankings.`);
