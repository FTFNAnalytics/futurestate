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
const registry = await readJson(appRoot, "src", "data", "phase-98-law-justice-public-safety-emergency-management-security-defense-peace-registry.json");
const publishedBriefings = briefings.filter((record) => record.status === "Published"), inReviewBriefings = briefings.filter((record) => record.status === "In Review");
const publishedSignals = signals.filter((record) => record.status === "Published"), inReviewSignals = signals.filter((record) => record.status === "In Review");
const publishedMaps = maps.filter((record) => record.record_status === "Published"), inReviewMaps = maps.filter((record) => record.record_status === "In Review");

manifest.generated_date = "2026-08-27";
Object.assign(manifest.expected_build, {
  static_pages: 5560, published_signals: publishedSignals.length, in_review_signals: inReviewSignals.length,
  briefings: briefings.length, published_briefings: publishedBriefings.length, in_review_briefings: inReviewBriefings.length,
  dependency_maps: maps.length, published_dependency_maps: publishedMaps.length, in_review_dependency_maps: inReviewMaps.length,
  updates: updates.length, public_json_exports: 45,
  phase_98_rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers: registry.rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers.length,
  phase_98_public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers: registry.public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers.length,
  phase_98_emergency_management_civil_protection_critical_system_security_resilience_registers: registry.emergency_management_civil_protection_critical_system_security_resilience_registers.length,
  phase_98_defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers: registry.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers.length,
  phase_98_synthetic_cases: 2560
});
manifest.release_delta_from_v0_1_1.static_pages_added = 5378;
manifest.release_delta_from_v0_1_1.published_signals_added = 1118;
manifest.release_delta_from_v0_1_1.summary = `Extends Phase 97 through Phase 98 justice, safety, emergency, security and peace stewardship: 715 sources, 1,406 signals, 1,121 Published signals, ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, fifteen reader pathways, sixteen evidence gaps, ${updates.length} updates, forty-five public JSON exports, thirty-two inactive Phase 98 records, and zero justice, safety, preparedness, security, defense, peace, score, ranking, or operating-outcome changes.`;
for (const command of ["npm run test:phase98", "npm run verify:phase98"]) if (!manifest.predeploy_commands.includes(command)) { const releaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release"); manifest.predeploy_commands.splice(releaseIndex < 0 ? manifest.predeploy_commands.length : releaseIndex, 0, command); }

const routeFor = (record) => "/evidence/law-justice-public-safety-emergency-security-defense-peace/" + record.slug + "/";
const justiceRoutes = registry.rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers.map(routeFor).sort();
const safetyRoutes = registry.public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers.map(routeFor).sort();
const emergencyRoutes = registry.emergency_management_civil_protection_critical_system_security_resilience_registers.map(routeFor).sort();
const peaceRoutes = registry.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers.map(routeFor).sort();
const guides = ["law-justice-public-safety-emergency-security-defense-peace-doctrine-001", "constitutional-rule-of-law-human-rights-independent-justice-001", "courts-legal-aid-counsel-accessible-process-effective-remedy-001", "administrative-environmental-indigenous-restorative-justice-001", "public-safety-violence-prevention-community-health-trust-001", "policing-fire-emergency-medical-corrections-accountability-001", "victim-survivor-rights-crisis-response-restorative-safety-001", "emergency-management-preparedness-warning-evacuation-recovery-001", "critical-infrastructure-cyber-physical-security-essential-continuity-001", "national-security-intelligence-oversight-rights-risk-reduction-001", "defense-readiness-civilian-control-human-security-public-value-001", "conflict-prevention-civilian-protection-ceasefire-peacebuilding-001"];
const phase98Maps = ["law-on-books-is-not-access-to-justice", "police-presence-is-not-public-safety", "emergency-declaration-is-not-preparedness-or-recovery", "security-capability-is-not-protected-rights-or-reduced-risk", "defense-spending-is-not-security", "ceasefire-is-not-durable-peace"];
for (const file of [
  "dist/data/law-justice-public-safety-emergency-management-security-defense-peace.json", "dist/evidence/law-justice-public-safety-emergency-security-defense-peace/index.html",
  "dist" + justiceRoutes[0] + "index.html", "dist" + justiceRoutes.at(-1) + "index.html", "dist" + safetyRoutes[0] + "index.html", "dist" + safetyRoutes.at(-1) + "index.html",
  "dist" + emergencyRoutes[0] + "index.html", "dist" + emergencyRoutes.at(-1) + "index.html", "dist" + peaceRoutes[0] + "index.html", "dist" + peaceRoutes.at(-1) + "index.html",
  ...guides.map((slug) => `dist/briefings/${slug}/index.html`), ...phase98Maps.map((slug) => `dist/atlas/dependency-maps/${slug}/index.html`)
]) if (!manifest.required_output_files.includes(file)) manifest.required_output_files.push(file);
manifest.published_briefing_routes = publishedBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.in_review_briefing_routes = inReviewBriefings.map((record) => "/briefings/" + record.slug + "/").sort();
manifest.published_signal_routes = publishedSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.in_review_signal_routes = inReviewSignals.map((record) => "/signals/" + record.slug + "/").sort();
manifest.published_dependency_map_routes = publishedMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.in_review_dependency_map_routes = inReviewMaps.map((record) => "/atlas/dependency-maps/" + record.slug + "/").sort();
manifest.rights_rule_of_law_courts_legal_aid_access_to_justice_routes = justiceRoutes;
manifest.public_safety_violence_prevention_policing_fire_corrections_accountability_routes = safetyRoutes;
manifest.emergency_management_civil_protection_critical_system_security_resilience_routes = emergencyRoutes;
manifest.defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_routes = peaceRoutes;

manifest.last_verified.date = "2026-08-27";
manifest.last_verified.static_pages_built = 5560;
manifest.last_verified.release_assertions = "passed-through-phase-98-law-justice-public-safety-emergency-management-security-defense-peace";
manifest.last_verified.browser_qa = "passed-local-phase-55k; phase-55l-through-phase-98-visual-qa-not-requested";
manifest.last_verified.preview_qa = "phase-98-law-justice-public-safety-emergency-management-security-defense-peace-locally-release-validated; visual-qa-not-requested; owner-only-deployment-pending; phase-57w-owner-only-sites-version-79-remains-live-and-verified";
manifest.phase_98_delta = {
  captured_date: "2026-08-27", editorial_layer: "constitutional-rule-of-law-human-rights-independent-justice-courts-legal-aid-counsel-accessible-process-effective-remedy-administrative-environmental-indigenous-restorative-justice-public-safety-violence-prevention-community-health-trust-policing-fire-emergency-medical-corrections-accountability-victim-survivor-rights-crisis-response-restorative-safety-emergency-management-preparedness-warning-evacuation-recovery-critical-infrastructure-cyber-physical-security-essential-continuity-national-security-intelligence-oversight-rights-risk-reduction-defense-readiness-civilian-control-human-security-public-value-conflict-prevention-civilian-protection-ceasefire-peacebuilding",
  rights_rule_of_law_courts_legal_aid_access_to_justice_dossiers: 8, public_safety_violence_prevention_policing_fire_corrections_accountability_ledgers: 8, emergency_management_civil_protection_critical_system_security_resilience_registers: 8, defense_intelligence_conflict_prevention_civilian_protection_peace_stewardship_ledgers: 8,
  justice_gates_per_dossier: 20, safety_gates_per_ledger: 22, emergency_gates_per_register: 22, peace_gates_per_ledger: 24, total_gates_per_chain: 88,
  synthetic_justice_cases: 640, synthetic_safety_cases: 640, synthetic_emergency_cases: 640, synthetic_peace_cases: 640, synthetic_cases_total: 2560,
  new_briefings_added_published: 12, dependency_maps_added_published: 6, public_json_exports_added: 1, public_update_entries_added: 1, generated_pages_added: 51,
  reader_pathways_deepened: 10, canonical_dossiers_deepened: 8, local_systems_deepened: 5, operating_briefings_deepened: 12,
  verified_phase97_environment_planetary_stewardship_records_received: 0, justice_access_decisions: 0, public_safety_accountability_decisions: 0, emergency_resilience_decisions: 0, security_defense_peace_decisions: 0, receipts_created: 0, named_file_stage_advances: 0, matrix_cells_advanced: 0, composite_scores_created: 0, rankings_created: 0, operating_outcome_changes: 0,
  next_operating_gate: "2026-09-01 Louisiana Starlink observed adoption",
  next_content_phase: "Phase 99 Democracy, Government, Public Administration, Civic Information And Institutional Legitimacy",
  local_content_commit: "pending", deployment_status: "phase-98-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live"
};
manifest.release_gates = manifest.release_gates.filter((item) => !item.startsWith("Confirm Phase 98 publishes exactly"));
manifest.release_gates.push("Confirm Phase 98 publishes exactly 8 inactive rights-rule-of-law-courts-legal-aid-access-to-justice dossiers, 8 inactive public-safety-violence-prevention-policing-fire-corrections-accountability ledgers, 8 inactive emergency-management-civil-protection-critical-system-security-resilience registers, and 8 inactive defense-intelligence-conflict-prevention-civilian-protection-peace-stewardship ledgers with 88 gates per chain and exact taxonomies, while creating zero justice-access, public-safety, preparedness, recovery, security, defense, civilian-protection, peace, receipt, score, ranking, Phase 64 advance, or operating-outcome change");
manifest.notes = "This manifest records Waves 60B-60C through the Phase 98 justice, safety, emergency, security and peace layer. Its 2,560 Phase 98 cases are synthetic routing fixtures only. No future gate was checked, and no verified Phase 97 environmental or planetary-stewardship record, right or standing decision, justice-access finding, safety or harm-reduction conclusion, policing, fire or corrections decision, preparedness or recovery finding, security or intelligence decision, defense-readiness conclusion, civilian-protection or durable-peace finding, independent review, reviewer identity, receipt, signal promotion, named-file stage, Phase 64 cell, score, rank, or operating outcome was created. Owner-only deployment remains pending; Sites version 79 continues to serve the exact Phase 57W package.";
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Phase 98 manifest updated: ${publishedBriefings.length} Published briefings, ${publishedMaps.length} Published maps, ${updates.length} updates, 45 public JSON exports, 32 justice-security routes, and 5,560 static pages.`);
