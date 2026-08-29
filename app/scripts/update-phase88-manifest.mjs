import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const readFrontmatter = async (directory) => Promise.all((await readdir(directory)).filter((name) => name.endsWith(".mdx")).map(async (name) => {
  const content = await readFile(join(directory, name), "utf8");
  return { status: content.match(/^record_status:\s*"([^"]+)"/m)?.[1], slug: content.match(/^slug:\s*"([^"]+)"/m)?.[1] };
}));

const briefings = await readFrontmatter(join(appRoot, "src", "content", "briefings"));
const signals = await readFrontmatter(join(appRoot, "src", "content", "signals"));
const maps = await Promise.all((await readdir(join(appRoot, "src", "content", "dependency-maps"))).filter((name) => name.endsWith(".json")).map((name) => readJson(appRoot, "src", "content", "dependency-maps", name)));
const updates = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json"));
const registry = await readJson(appRoot, "src", "data", "phase-88-work-labor-livelihoods-economic-democracy-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-25";
Object.assign(manifest.expected_build, {
  static_pages: 5050,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 35,
  phase_88_job_access_matching_hiring_nondiscrimination_dossiers: registry.job_access_matching_hiring_nondiscrimination_dossiers.length,
  phase_88_job_quality_wages_benefits_hours_safety_ledgers: registry.job_quality_wages_benefits_hours_safety_ledgers.length,
  phase_88_worker_voice_organizing_collective_bargaining_economic_democracy_registers: registry.worker_voice_organizing_collective_bargaining_economic_democracy_registers.length,
  phase_88_livelihood_security_displacement_just_transition_long_horizon_ledgers: registry.livelihood_security_displacement_just_transition_long_horizon_ledgers.length,
  phase_88_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4868;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 87 through Phase 88 work, labor, livelihoods, and economic democracy: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, thirty-five public JSON exports, thirty-two inactive Phase 88 records, and zero job, hiring, job-quality, safety, bargaining, ownership, livelihood, just-transition, score, ranking, or operating-outcome changes.`;

for (const command of ["npm run test:phase88", "npm run verify:phase88"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/work-labor-livelihoods/" + record.slug + "/";
const accessRoutes = registry.job_access_matching_hiring_nondiscrimination_dossiers.map(routeFor).sort();
const qualityRoutes = registry.job_quality_wages_benefits_hours_safety_ledgers.map(routeFor).sort();
const voiceRoutes = registry.worker_voice_organizing_collective_bargaining_economic_democracy_registers.map(routeFor).sort();
const livelihoodRoutes = registry.livelihood_security_displacement_just_transition_long_horizon_ledgers.map(routeFor).sort();
const guides = ["work-labor-livelihoods-economic-democracy-doctrine-001", "job-access-matching-hiring-001", "job-quality-decent-work-001", "wages-benefits-household-livelihood-security-001", "hours-scheduling-time-autonomy-001", "worker-health-safety-dignity-001", "worker-voice-organizing-collective-bargaining-001", "platform-gig-informal-contingent-work-001", "care-domestic-agricultural-migrant-work-001", "automation-climate-industrial-transition-001", "cooperatives-employee-ownership-public-employment-001", "labor-standards-enforcement-remedy-001"];
const phase88Maps = ["job-posting-is-not-available-job", "employment-is-not-decent-work", "wage-rate-is-not-household-livelihood-security", "training-completion-is-not-durable-career-mobility", "worker-consultation-is-not-bargaining-power", "reemployment-is-not-just-transition"];
for (const file of [
  "dist/data/work-labor-livelihoods-economic-democracy.json", "dist/evidence/work-labor-livelihoods/index.html",
  "dist" + accessRoutes[0] + "index.html", "dist" + accessRoutes.at(-1) + "index.html",
  "dist" + qualityRoutes[0] + "index.html", "dist" + qualityRoutes.at(-1) + "index.html",
  "dist" + voiceRoutes[0] + "index.html", "dist" + voiceRoutes.at(-1) + "index.html",
  "dist" + livelihoodRoutes[0] + "index.html", "dist" + livelihoodRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`),
  ...phase88Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.job_access_matching_hiring_nondiscrimination_routes = accessRoutes;
manifest.job_quality_wages_benefits_hours_safety_routes = qualityRoutes;
manifest.worker_voice_organizing_collective_bargaining_economic_democracy_routes = voiceRoutes;
manifest.livelihood_security_displacement_just_transition_long_horizon_routes = livelihoodRoutes;

manifest.last_verified.date = "2026-08-25";
manifest.last_verified.static_pages_built = 5050;
manifest.last_verified.release_assertions = "passed-through-phase-88-work-labor-livelihoods-economic-democracy";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-88-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-88-work-labor-livelihoods-economic-democracy-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_88_delta = {
  captured_date: "2026-08-25",
  editorial_layer: "job-access-matching-hiring-nondiscrimination-job-quality-wages-benefits-hours-scheduling-health-safety-dignity-worker-voice-organizing-collective-bargaining-economic-democracy-cooperatives-employee-ownership-public-employment-livelihood-security-displacement-automation-climate-industrial-transition-regional-equity-long-horizon-economic-agency",
  job_access_matching_hiring_nondiscrimination_dossiers: 8,
  job_quality_wages_benefits_hours_safety_ledgers: 8,
  worker_voice_organizing_collective_bargaining_economic_democracy_registers: 8,
  livelihood_security_displacement_just_transition_long_horizon_ledgers: 8,
  job_access_gates_per_dossier: 20, job_quality_gates_per_ledger: 20, worker_voice_gates_per_register: 22, livelihood_gates_per_ledger: 22,
  synthetic_job_access_cases: 640, synthetic_job_quality_cases: 640, synthetic_worker_voice_cases: 640, synthetic_livelihood_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase87_human_development_records_received: 0, available_job_or_hiring_decisions: 0, job_quality_or_compensation_findings: 0, safety_or_dignity_findings: 0, organizing_or_bargaining_findings: 0, economic_democracy_or_ownership_findings: 0, livelihood_security_findings: 0, displacement_or_just_transition_findings: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 89 Income, Wealth, Poverty, Social Protection And Economic Security",
  local_content_commit: "pending",
  deployment_status: "phase-88-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 88 publishes exactly"));
manifest.release_gates.push("Confirm Phase 88 publishes exactly 8 inactive job-access-matching-hiring-nondiscrimination dossiers, 8 inactive job-quality-wages-benefits-hours-safety ledgers, 8 inactive worker-voice-organizing-collective-bargaining-economic-democracy registers, and 8 inactive livelihood-security-displacement-just-transition-long-horizon ledgers with 84 gates per chain and exact taxonomies, while creating zero job, hiring, classification, quality, pay, safety, bargaining, ownership, livelihood, transition, remedy, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 88 work, labor, livelihoods, and economic-democracy layer. Its 2,560 Phase 88 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 87 human-development record, available-job or hiring decision, worker classification, job-quality, pay, hours, safety, dignity, organizing, bargaining, ownership, livelihood-security, displacement, just-transition, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 88 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 35 public JSON exports, 32 labor and livelihood routes, and 5,050 static pages.`);
