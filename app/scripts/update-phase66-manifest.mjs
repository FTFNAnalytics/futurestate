import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const briefingDirectory = join(appRoot, "src", "content", "briefings");
const briefingFiles = (await readdir(briefingDirectory)).filter((name) => name.endsWith(".mdx"));
const briefings = await Promise.all(briefingFiles.map(async (name) => {
  const text = await readFile(join(briefingDirectory, name), "utf8");
  return {
    status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1],
    slug: text.match(/^slug:\s*"([^"]+)"/m)?.[1]
  };
}));
const mapDirectory = join(appRoot, "src", "content", "dependency-maps");
const mapFiles = (await readdir(mapDirectory)).filter((name) => name.endsWith(".json"));
const maps = await Promise.all(mapFiles.map(async (name) => JSON.parse(await readFile(join(mapDirectory, name), "utf8"))));
const publishedBriefings = briefings.filter((briefing) => briefing.status === "Published");
const inReviewBriefings = briefings.filter((briefing) => briefing.status === "In Review");
const publishedMaps = maps.filter((map) => map.record_status === "Published");
const inReviewMaps = maps.filter((map) => map.record_status === "In Review");

manifest.generated_date = "2026-08-12";
Object.assign(manifest.expected_build, {
  static_pages: 4016,
  briefings: 111,
  published_briefings: 106,
  in_review_briefings: 0,
  dependency_maps: 11,
  published_dependency_maps: 10,
  in_review_dependency_maps: 1,
  research_collections: 64,
  research_documents: 1629,
  updates: 89,
  research_export_records: 1425
});
manifest.release_delta_from_v0_1_1.static_pages_added = 3834;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 65 release with Phase 66 acceptance and repeated-operation qualification: 715 public sources, 1,406 signals, 1,120 Published signals, 106 Published and zero In Review briefings, five Archived briefing histories, ten Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 89 updates, sixty-four research collections, 1,629 research documents, 1,425 Published research export records, sixty-four classified named-file reviews, and thirty-two explicit downstream decisions without a matrix advance or public-data contract change.";

const phase66Verify = "npm run verify:phase66";
if (!manifest.predeploy_commands.includes(phase66Verify)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, phase66Verify);
}
manifest.published_briefing_routes = publishedBriefings.map((briefing) => `/briefings/${briefing.slug}/`).sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((briefing) => `/briefings/${briefing.slug}/`).sort();
manifest.published_dependency_map_routes = publishedMaps.map((map) => `/atlas/dependency-maps/${map.slug}/`).sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((map) => `/atlas/dependency-maps/${map.slug}/`).sort();
manifest.last_verified.date = "2026-08-12";
manifest.last_verified.static_pages_built = 4016;
manifest.last_verified.release_assertions = "passed-through-phase-66-acceptance-repeated-operation";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-66-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-66-local-release-validated-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_66_delta = {
  editorial_layer: "acceptance-and-repeated-operation",
  inherited_named_file_records_classified: 64,
  same_entity_downstream_records: 2,
  stage_adjacent_or_held_records: 15,
  context_only_records: 47,
  named_file_dossiers_added_published: 8,
  cross_system_reader_guides_added_published: 2,
  dependency_maps_added_published: 1,
  downstream_stage_decisions: 32,
  evidence_present_decisions: 1,
  partial_or_held_decisions: 4,
  not_established_decisions: 27,
  canonical_named_briefings_deepened: 8,
  local_systems_deepened: 5,
  reader_pathways_deepened: 10,
  public_update_entries_added: 1,
  generated_pages_added: 11,
  phase_64_cells_advanced: 0,
  sources_added: 0,
  signals_added: 0,
  signal_status_changes: 0,
  public_json_exports_added: 0,
  schemas_added: 0,
  automation_added: 0,
  receipts_created: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  local_content_commit: "pending",
  deployment_status: "local_release_validated_owner-only-deployment-pending_phase-57w-version-79-remains-live"
};

const gate = "Confirm Phase 66 classifies all 64 Phase 65 named-file records exactly once, preserves 32 downstream decisions at 1 Evidence Present / 4 Partial or Held / 27 Not Established, publishes eight dossiers, two reader guides, and one dependency map, and makes no matrix, source, signal, receipt, export, schema, automation, score, rank, or operating-outcome change";
if (!manifest.release_gates.includes(gate)) manifest.release_gates.push(gate);
manifest.notes = "This manifest records the locally release-validated Phase 66 acceptance and repeated-operation layer. Sixty-four inherited named-file reviews are classified as two same-entity downstream records, fifteen stage-adjacent or held records, and forty-seven context-only records. Thirty-two exact downstream decisions remain one Evidence Present, four Partial or Held, and twenty-seven Not Established. Eight acceptance dossiers, two cross-system reader guides, one dependency map, and one update publish. No Phase 64 cell, source, signal, receipt, event, gate, public export, schema, automation, score, ranking, or operating-outcome state changes. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 66 deployment manifest updated: ${publishedBriefings.length} Published briefings, ${inReviewBriefings.length} In Review briefings, ${publishedMaps.length} Published dependency maps, ${inReviewMaps.length} In Review dependency maps, and 4,016 static pages.`);
