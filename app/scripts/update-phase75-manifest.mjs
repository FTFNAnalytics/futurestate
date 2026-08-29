import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
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
const accountability = await readJson(appRoot, "src", "data", "phase-75-decision-accountability-realized-impact-registry.json");

const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-24";
Object.assign(manifest.expected_build, {
  static_pages: 4383,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updateFiles.length,
  public_json_exports: 22,
  phase_75_decision_accountability_dossiers: accountability.decision_accountability_dossiers.length,
  phase_75_implementation_commitment_realization_ledgers: accountability.implementation_commitment_realization_ledgers.length,
  phase_75_post_decision_audit_remediation_registers: accountability.post_decision_audit_remediation_registers.length,
  phase_75_synthetic_cases: 1200
});

manifest.release_delta_from_v0_1_1.static_pages_added = 4201;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = "Extends the Wave 60C release through Phase 75 decision accountability, implementation commitment, realized-impact audit, sunset, reversal, and remediation control: 715 sources, 1,406 signals, 1,121 Published signals, 137 Published and zero In Review briefings, twenty-one Published and one In Review dependency maps, fifteen reader pathways, sixteen evidence gaps, 100 updates, twenty-two public JSON exports, eight inactive decision-accountability dossiers, thirty-two inactive implementation-and-realization ledgers, eight inactive audit-remediation registers, and zero authorized decisions, commitments, baselines, safeguards, outputs, benefits, harms, distributional findings, audits, reversals, remediations, scores, rankings, receipts, or operating-outcome changes.";

for (const command of ["npm run test:phase75", "npm run verify:phase75"]) {
  if (!manifest.predeploy_commands.includes(command)) {
    const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
    manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
  }
}

const ledgerRoutes = accountability.implementation_commitment_realization_ledgers.map((record) => "/evidence/accountability/" + record.slug + "/").sort();
const decisionRoutes = accountability.decision_accountability_dossiers.map((record) => "/evidence/accountability/" + record.slug + "/").sort();
for (const file of [
  "dist/data/decision-accountability-realized-impact.json",
  "dist/evidence/accountability/index.html",
  "dist" + ledgerRoutes[0] + "index.html",
  "dist" + ledgerRoutes.at(-1) + "index.html",
  "dist" + decisionRoutes[0] + "index.html",
  "dist" + decisionRoutes.at(-1) + "index.html",
  "dist/briefings/decision-accountability-desk-001/index.html",
  "dist/briefings/implementation-commitment-ledger-001/index.html",
  "dist/briefings/realized-impact-audit-001/index.html",
  "dist/briefings/reversal-remediation-desk-001/index.html",
  "dist/atlas/dependency-maps/recommendation-is-not-authorization-or-implementation/index.html",
  "dist/atlas/dependency-maps/delivered-output-is-not-realized-benefit/index.html"
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.decision_accountability_routes = decisionRoutes;
manifest.implementation_commitment_realization_routes = ledgerRoutes;

manifest.last_verified.date = "2026-08-24";
manifest.last_verified.static_pages_built = 4383;
manifest.last_verified.release_assertions = "passed-through-phase-75-decision-accountability-implementation-realized-impact-audit";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-75-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-75-decision-accountability-implementation-realized-impact-audit-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_75_delta = {
  captured_date: "2026-08-24",
  editorial_layer: "decision-accountability-implementation-commitment-realized-impact-audit-sunset-reversal-remediation",
  decision_accountability_dossiers: 8,
  implementation_commitment_realization_ledgers: 32,
  post_decision_audit_remediation_registers: 8,
  accountability_gates_per_dossier: 16,
  implementation_realization_gates_per_ledger: 16,
  audit_gates_per_register: 12,
  safeguard_triggers_per_ledger: 12,
  remediation_classes_per_register: 10,
  synthetic_accountability_cases: 384,
  synthetic_implementation_realization_cases: 576,
  synthetic_audit_remediation_cases: 240,
  synthetic_cases_total: 1200,
  new_briefings_added_published: 4,
  dependency_maps_added_published: 2,
  public_json_exports_added: 1,
  public_update_entries_added: 1,
  generated_pages_added: 47,
  reader_pathways_deepened: 10,
  canonical_dossiers_deepened: 8,
  local_systems_deepened: 5,
  operating_briefings_deepened: 8,
  authorized_decisions_received: 0,
  decision_owners_recorded: 0,
  option_rationales_recorded: 0,
  conflicts_or_recusals_recorded: 0,
  dissents_archived: 0,
  implementation_commitments_recorded: 0,
  baselines_registered: 0,
  milestones_recorded: 0,
  safeguard_events_recorded: 0,
  stop_work_events_recorded: 0,
  accepted_outputs_recorded: 0,
  benefits_adjudicated: 0,
  harms_adjudicated: 0,
  distributional_findings_adjudicated: 0,
  counterfactual_decision_audits_completed: 0,
  post_decision_challenges_received: 0,
  sunsets_enforced: 0,
  reversals_issued: 0,
  remediations_issued: 0,
  corrections_issued: 0,
  withdrawals_issued: 0,
  receipts_created: 0,
  named_file_stage_advances: 0,
  matrix_cells_advanced: 0,
  composite_scores_created: 0,
  rankings_created: 0,
  operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-75-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 75 publishes exactly"));
const releaseGate = "Confirm Phase 75 publishes exactly 8 inactive decision-accountability dossiers, 32 inactive implementation-commitment and realization ledgers, and 8 inactive post-decision audit and remediation registers with 16 accountability gates, 16 implementation-realization gates, 12 audit gates, 12 safeguard triggers, and 10 remediation classes, while creating zero authorizations, commitments, baselines, safeguards, outputs, benefits, harms, distributional findings, audits, reversals, remediations, corrections, withdrawals, scores, rankings, receipts, Phase 64 advances, or operating-outcome changes";
if (!manifest.release_gates.includes(releaseGate)) manifest.release_gates.push(releaseGate);

manifest.notes = "This manifest records Waves 60B-60C through the Phase 75 decision-accountability, implementation-commitment, realized-impact, sunset, reversal, and remediation layer. Its 1,200 synthetic cases test future routing only. No future gate was checked, and no real recommendation, authorized decision, owner, option rationale, conflict, recusal, dissent, commitment, baseline, resource, milestone, safeguard event, stop-work event, accepted output, benefit, harm, burden, distributional finding, counterfactual decision audit, post-decision challenge, sunset action, reversal, remediation, correction, withdrawal, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("Phase 75 manifest updated: " + publishedBriefings.length + " Published briefings, " + publishedMaps.length + " Published maps, " + updateFiles.length + " updates, 22 public JSON exports, 40 accountability routes, and 4,383 static pages.");
