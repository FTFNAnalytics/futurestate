import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readFrontmatterRecords = async (directory) => Promise.all((await readdir(directory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(directory, name), "utf8");
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));

const briefings = await readFrontmatterRecords(join(appRoot, "src", "content", "briefings"));
const signals = await readFrontmatterRecords(join(appRoot, "src", "content", "signals"));
const maps = await Promise.all((await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json")).map((name) => readJson(appRoot, "src", "content", "dependency-maps", name)));
const updateFiles = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const registry = await readJson(appRoot, "src", "data", "phase-77-public-deliberation-participatory-governance-adaptive-mandate-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4492,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 24,
  phase_77_stakeholder_standing_notice_registers: registry.stakeholder_standing_notice_registers.length,
  phase_77_deliberation_issue_response_dockets: registry.deliberation_issue_response_dockets.length,
  phase_77_mandate_legitimacy_appeal_registers: registry.mandate_legitimacy_appeal_registers.length,
  phase_77_adaptive_mandate_review_ledgers: registry.adaptive_mandate_review_ledgers.length,
  phase_77_synthetic_cases: 1600
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4310;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release through Phase 77 public deliberation, stakeholder standing, accessible notice, consultation and consent boundaries, public comment, hearings, reasoned response, participation quality, dissent, appeal, legitimacy audit, adaptive mandate, and reopening control: 715 sources, 1,406 signals, 1,121 Published signals, 155 Published and zero In Review briefings, twenty-eight Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 102 updates, twenty-four public JSON exports, eight inactive standing registers, eight inactive deliberation dockets, eight inactive mandate-appeal registers, eight inactive adaptive-review ledgers, and zero participation, consent, response, legitimacy, appeal, mandate, review, score, ranking, receipt, or operating-outcome changes.";

for (const command of ["npm run test:phase77", "npm run verify:phase77"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const standingRoutes = registry.stakeholder_standing_notice_registers.map((record) => "/evidence/deliberation/" + record.slug + "/").sort();
const deliberationRoutes = registry.deliberation_issue_response_dockets.map((record) => "/evidence/deliberation/" + record.slug + "/").sort();
const mandateRoutes = registry.mandate_legitimacy_appeal_registers.map((record) => "/evidence/deliberation/" + record.slug + "/").sort();
const adaptiveRoutes = registry.adaptive_mandate_review_ledgers.map((record) => "/evidence/deliberation/" + record.slug + "/").sort();
for (const file of [
  "dist/data/public-deliberation-adaptive-mandate.json",
  "dist/evidence/deliberation/index.html",
  "dist" + standingRoutes[0] + "index.html",
  "dist" + standingRoutes.at(-1) + "index.html",
  "dist" + deliberationRoutes[0] + "index.html",
  "dist" + deliberationRoutes.at(-1) + "index.html",
  "dist" + mandateRoutes[0] + "index.html",
  "dist" + mandateRoutes.at(-1) + "index.html",
  "dist" + adaptiveRoutes[0] + "index.html",
  "dist" + adaptiveRoutes.at(-1) + "index.html",
  "dist/briefings/community-standing-affected-publics-001/index.html",
  "dist/briefings/indigenous-treaty-consultation-boundaries-001/index.html",
  "dist/briefings/worker-supply-chain-voice-001/index.html",
  "dist/briefings/accessibility-service-user-participation-001/index.html",
  "dist/briefings/environmental-justice-cumulative-burden-deliberation-001/index.html",
  "dist/briefings/technical-expert-public-knowledge-001/index.html",
  "dist/briefings/public-reason-issue-response-001/index.html",
  "dist/briefings/dissent-appeal-reconsideration-001/index.html",
  "dist/briefings/intergenerational-future-user-review-001/index.html",
  "dist/briefings/adaptive-democratic-mandate-001/index.html",
  "dist/atlas/dependency-maps/notice-is-not-accessible-participation/index.html",
  "dist/atlas/dependency-maps/participation-volume-is-not-consent-or-legitimacy/index.html",
  "dist/atlas/dependency-maps/comment-count-is-not-reasoned-response/index.html",
  "dist/atlas/dependency-maps/mandate-is-not-permanent-authorization/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.stakeholder_standing_notice_routes = standingRoutes;
manifest.deliberation_issue_response_routes = deliberationRoutes;
manifest.mandate_legitimacy_appeal_routes = mandateRoutes;
manifest.adaptive_mandate_review_routes = adaptiveRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4492;
manifest.last_verified.release_assertions = "passed-through-phase-77-public-deliberation-participatory-governance-adaptive-mandate";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-77-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-77-public-deliberation-participatory-governance-adaptive-mandate-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_77_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "stakeholder-standing-notice-accessibility-consultation-consent-public-comment-hearing-public-reason-dissent-appeal-legitimacy-adaptive-mandate",
  stakeholder_standing_notice_registers: 8,
  deliberation_issue_response_dockets: 8,
  mandate_legitimacy_appeal_registers: 8,
  adaptive_mandate_review_ledgers: 8,
  standing_notice_gates_per_register: 16,
  deliberation_gates_per_docket: 18,
  mandate_appeal_gates_per_register: 16,
  adaptive_review_gates_per_ledger: 14,
  constituency_classes_per_register: 12,
  issue_classes_per_docket: 12,
  participation_quality_dimensions_per_docket: 12,
  appeal_grounds_per_register: 10,
  adaptive_triggers_per_ledger: 12,
  synthetic_standing_cases: 400,
  synthetic_deliberation_cases: 400,
  synthetic_mandate_cases: 400,
  synthetic_adaptive_review_cases: 400,
  synthetic_cases_total: 1600,
  new_briefings_added_published: 10,
  dependency_maps_added_published: 4,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 47,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operating_briefings_deepened: 8,
  admitted_cross_case_findings_received: 0,
  standing_decisions_issued: 0,
  notice_plans_activated: 0,
  comments_received: 0,
  hearings_completed: 0,
  consultation_records_created: 0,
  consent_findings_issued: 0,
  reasoned_responses_issued: 0,
  participation_quality_findings: 0,
  legitimacy_audits_completed: 0,
  appeals_received: 0,
  mandates_authorized: 0,
  adaptive_reviews_opened: 0,
  mandate_changes_issued: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-77-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 77 publishes exactly"));
const releaseGate = "Confirm Phase 77 publishes exactly 8 inactive stakeholder-standing and notice registers, 8 inactive deliberation and reasoned-response dockets, 8 inactive mandate-legitimacy and appeal registers, and 8 inactive adaptive-mandate review ledgers with 16 standing gates, 18 deliberation gates, 16 mandate gates, 14 adaptive gates, 12 constituency classes, 12 issue classes, 12 quality dimensions, 10 appeal grounds, and 12 adaptive triggers, while creating zero participation, consent, responses, legitimacy findings, appeals, mandates, adaptive reviews, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 77 public-deliberation, participatory-governance, and adaptive-mandate layer. Its 1,600 synthetic cases test future routing only. No future gate was checked, and no real admitted Phase 76 cross-case finding, standing decision, notice or access receipt, participation process, comment, hearing, consultation, consent finding, material issue, reasoned response, participation-quality finding, legitimacy audit, appeal, stay, reconsideration, public mandate, adaptive trigger, mandate change, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Phase 77 manifest updated: " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, " + updateFiles.length + " updates, 24 public JSON exports, 32 deliberation routes, and 4,492 static pages.");
