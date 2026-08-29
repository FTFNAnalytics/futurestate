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
const registry = await readJson(appRoot, "src", "data", "phase-87-education-learning-skills-knowledge-cultural-capability-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published");
const inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published");
const inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published");
const inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-25";
Object.assign(manifest.expected_build, {
  static_pages: 4999,
  published_signals: publishedSignals.length,
  in_review_signals: inReviewSignals.length,
  briefings: briefings.length,
  published_briefings: publishedBriefings.length,
  in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length,
  published_dependency_maps: publishedMaps.length,
  in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length,
  public_json_exports: 34,
  phase_87_early_childhood_school_access_inclusion_learning_dossiers: registry.early_childhood_school_access_inclusion_learning_dossiers.length,
  phase_87_postsecondary_vocational_apprenticeship_affordability_ledgers: registry.postsecondary_vocational_apprenticeship_affordability_ledgers.length,
  phase_87_learning_capability_credential_skills_transition_registers: registry.learning_capability_credential_skills_transition_registers.length,
  phase_87_public_knowledge_culture_research_community_learning_ledgers: registry.public_knowledge_culture_research_community_learning_ledgers.length,
  phase_87_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 4817;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 86 through Phase 87 education, learning, skills, knowledge, and cultural capability: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, thirty-four public JSON exports, thirty-two inactive Phase 87 records, and zero enrollment, admission, learning, credential, capability, transition, public-knowledge, cultural-recovery, score, ranking, or operating-outcome changes.`;

for (const command of ["npm run test:phase87", "npm run verify:phase87"]) if (!manifest.predeploy_commands.includes(command)) {
  const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
  manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command);
}

const routeFor = (record) => "/evidence/education-knowledge-culture/" + record.slug + "/";
const schoolRoutes = registry.early_childhood_school_access_inclusion_learning_dossiers.map(routeFor).sort();
const postsecondaryRoutes = registry.postsecondary_vocational_apprenticeship_affordability_ledgers.map(routeFor).sort();
const capabilityRoutes = registry.learning_capability_credential_skills_transition_registers.map(routeFor).sort();
const knowledgeRoutes = registry.public_knowledge_culture_research_community_learning_ledgers.map(routeFor).sort();
const guides = ["education-human-development-doctrine-001", "early-childhood-family-development-001", "school-attendance-access-learning-inclusion-001", "disability-language-accessible-inclusive-education-001", "indigenous-education-jurisdiction-knowledge-language-001", "teachers-education-workers-institutional-capacity-001", "postsecondary-affordability-student-support-001", "vocational-apprenticeship-skills-recognition-001", "learning-assessment-credential-capability-001", "libraries-digital-access-media-information-literacy-001", "research-public-knowledge-translation-001", "arts-culture-community-learning-recovery-001"];
const phase87Maps = ["enrollment-is-not-learning", "credential-is-not-demonstrated-capability", "training-seat-is-not-access-to-decent-work", "published-research-is-not-usable-public-knowledge", "digital-access-is-not-information-literacy", "institution-reopening-is-not-community-learning-recovery"];
for (const file of [
  "dist/data/education-learning-skills-knowledge-cultural-capability.json", "dist/evidence/education-knowledge-culture/index.html",
  "dist" + schoolRoutes[0] + "index.html", "dist" + schoolRoutes.at(-1) + "index.html",
  "dist" + postsecondaryRoutes[0] + "index.html", "dist" + postsecondaryRoutes.at(-1) + "index.html",
  "dist" + capabilityRoutes[0] + "index.html", "dist" + capabilityRoutes.at(-1) + "index.html",
  "dist" + knowledgeRoutes[0] + "index.html", "dist" + knowledgeRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`),
  ...phase87Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);

manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.early_childhood_school_access_inclusion_learning_routes = schoolRoutes;
manifest.postsecondary_vocational_apprenticeship_affordability_routes = postsecondaryRoutes;
manifest.learning_capability_credential_skills_transition_routes = capabilityRoutes;
manifest.public_knowledge_culture_research_community_learning_routes = knowledgeRoutes;

manifest.last_verified.date = "2026-08-25";
manifest.last_verified.static_pages_built = 4999;
manifest.last_verified.release_assertions = "passed-through-phase-87-education-learning-skills-knowledge-cultural-capability";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-87-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-87-education-learning-skills-knowledge-cultural-capability-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";

manifest.phase_87_delta = {
  captured_date: "2026-08-25",
  editorial_layer: "early-childhood-school-access-inclusion-learning-postsecondary-vocational-apprenticeship-affordability-student-support-assessment-credentials-demonstrated-capability-skills-work-civic-transition-libraries-research-public-knowledge-information-literacy-arts-culture-community-learning-recovery-human-development",
  early_childhood_school_access_inclusion_learning_dossiers: 8,
  postsecondary_vocational_apprenticeship_affordability_ledgers: 8,
  learning_capability_credential_skills_transition_registers: 8,
  public_knowledge_culture_research_community_learning_ledgers: 8,
  school_gates_per_dossier: 20, postsecondary_gates_per_ledger: 20, capability_gates_per_register: 22, knowledge_gates_per_ledger: 22,
  synthetic_school_cases: 640, synthetic_postsecondary_cases: 640, synthetic_capability_cases: 640, synthetic_knowledge_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase86_population_wellbeing_records_received: 0, enrollment_or_admission_decisions: 0, learning_or_inclusion_findings: 0, credential_or_capability_findings: 0, work_or_civic_transition_findings: 0, public_knowledge_or_research_findings: 0, cultural_capability_or_recovery_findings: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  local_content_commit: "pending",
  deployment_status: "phase-87-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};

manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 87 publishes exactly"));
manifest.release_gates.push("Confirm Phase 87 publishes exactly 8 inactive early-childhood and school-access dossiers, 8 inactive postsecondary-vocational-apprenticeship-affordability ledgers, 8 inactive learning-capability-credential-transition registers, and 8 inactive public-knowledge-culture-community-learning ledgers with 84 gates per chain and exact taxonomies, while creating zero enrollment, admission, learning, credential, capability, transition, public-knowledge, information-literacy, cultural-recovery, remedy, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 87 education and cultural-capability layer. Its 2,560 Phase 87 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 86 population-wellbeing record, learner enrollment, admission, learning finding, credential, capability conclusion, work or civic transition, public-knowledge or information-literacy finding, cultural classification, community-learning recovery, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 87 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 34 public JSON exports, 32 education and cultural-capability routes, and 4,999 static pages.`);
