import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const briefingsDirectory = join(appRoot, "src", "content", "briefings");
const briefingFiles = (await readdir(briefingsDirectory)).filter((name) => name.endsWith(".mdx"));
const briefings = await Promise.all(briefingFiles.map(async (name) => {
  const text = await readFile(join(briefingsDirectory, name), "utf8");
  return {
    status: text.match(/^record_status:\s*"([^"]+)"/m)?.[1],
    slug: text.match(/^slug:\s*"([^"]+)"/m)?.[1]
  };
}));
const publishedBriefings = briefings.filter((briefing) => briefing.status === "Published");
const inReviewBriefings = briefings.filter((briefing) => briefing.status === "In Review");

manifest.generated_date = "2026-08-11";
Object.assign(manifest.expected_build, {
  static_pages: 4005,
  briefings: 101,
  published_briefings: 96,
  in_review_briefings: 0,
  research_collections: 64,
  research_documents: 1629,
  updates: 88,
  research_export_records: 1425
});
manifest.release_delta_from_v0_1_1.static_pages_added = 3823;
manifest.release_delta_from_v0_1_1.summary = "Extends the Phase 55K through Phase 64 release with the Phase 65 content-only field reporting expansion: 715 public sources, 1,406 signals, 1,120 Published signals, ninety-six Published and zero In Review briefings, five Archived briefing histories, nine Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 88 updates, sixty-four research collections, 1,629 research documents, 1,425 Published research export records, ninety-six primary-record reviews, eight named-file packs, eight topic packs, forty-eight signal decisions, and eleven unchanged public-data exports.";

for (const command of [
  "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug phase65-named-project-delivery-evidence-2021-2026",
  "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug phase65-institutional-receiving-system-acceptance-2021-2026",
  "powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-research-archive.ps1 -CollectionSlug phase65-undercovered-frontier-systems-2023-2026"
]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const validationIndex = manifest.predeploy_commands.indexOf("npm run validate:content");
    manifest.predeploy_commands.splice(validationIndex < 0 ? manifest.predeploy_commands.length : validationIndex, 0, command);
  }
}
const phase65Verify = "npm run verify:phase65";
if (!manifest.predeploy_commands.includes(phase65Verify)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, phase65Verify);
}
for (const file of [
  "dist/downloads/phase65-named-project-delivery-evidence-2021-2026.zip",
  "dist/downloads/phase65-institutional-receiving-system-acceptance-2021-2026.zip",
  "dist/downloads/phase65-undercovered-frontier-systems-2023-2026.zip"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((briefing) => `/briefings/${briefing.slug}/`).sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((briefing) => `/briefings/${briefing.slug}/`).sort();
manifest.last_verified.static_pages_built = 4005;
manifest.last_verified.release_assertions = "passed-through-phase-65-field-reporting-expansion";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-65-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-65-local-field-reporting-release-validated-owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_65_delta = {
  editorial_layer: "field-reporting-expansion",
  primary_records_reviewed: 96,
  research_collections_added: 3,
  named_file_reporting_packs: 8,
  undercovered_topic_packs: 8,
  signal_decisions: 48,
  published_signal_reconfirmations: 32,
  in_review_signal_retentions: 16,
  signal_status_changes: 0,
  new_briefings_added_published: 11,
  inherited_briefings_repaired_published: 2,
  inherited_briefings_archived: 5,
  inherited_briefings_remaining_in_review: 0,
  canonical_named_briefings_deepened: 8,
  local_systems_deepened: 5,
  topic_families_deepened: 8,
  public_update_entries_added: 1,
  generated_pages_added: 110,
  public_json_exports_added: 0,
  schemas_added: 0,
  automation_added: 0,
  phase_64_cells_advanced: 0,
  receipts_created: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  local_content_commit: "pending",
  deployment_status: "local_field-reporting-release-validated_owner-only-deployment-pending_phase-57w-version-79-remains-live"
};

const gate = "Confirm Phase 65 contains 96 unique primary-record reviews, three 32-record collections, eight named-file packs, eight undercovered-topic packs, 48 no-state-change signal decisions, eleven new Published briefings, seven final legacy dispositions, zero remaining In Review briefings, reconciled gap-006 identity, and no matrix, schema, export, automation, score, rank, or unsupported outcome change";
if (!manifest.release_gates.includes(gate)) manifest.release_gates.push(gate);
manifest.notes = "This manifest records the locally release-validated Phase 65 content-only field reporting expansion. Ninety-six unique primary records are re-reviewed into three 32-record downloadable collections and sixteen reporting packs. Forty-eight signals receive explicit no-state-change decisions: thirty-two Published reconfirmations and sixteen In Review retentions. Eleven new briefings publish, two inherited syntheses are repaired and published, five superseded drafts are archived, and no briefing remains In Review. The phase reconciles gap-006 as the ENSO local-interpretation lane and changes no source, signal, Phase 64 cell, schema, public export, automation, receipt, score, rank, or operating-outcome state. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 65 deployment manifest updated: ${publishedBriefings.length} Published briefings, ${inReviewBriefings.length} In Review briefings, 64 research collections, 1,629 research documents, and 4,005 static pages.`);
