import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const distRoot = join(appRoot, "dist");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const readData = (name) => readJson(join(appRoot, "src", "data", name));

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : [path];
    }),
  );
  return nested.flat();
}

const routeToOutput = (route) => `dist/${route.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
const exportToOutput = (route) => `dist/${route.replace(/^\//, "")}`;
const unique = (items) => [...new Set(items)];
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const [manifest, packageJson, v07, v08, v09] = await Promise.all([
  readJson(manifestPath),
  readJson(join(appRoot, "package.json")),
  readData("v07-evidence-admission-dockets.json"),
  readData("v08-conversion-longitudinal-atlas.json"),
  readData("v09-living-public-intelligence.json"),
]);

const phaseFiles = [
  "phase-130-authority-gap-closure-maps.json",
  "phase-131-priority-evidence-admission-dockets.json",
  "phase-132-dated-source-check-receipts.json",
  "phase-133-requirement-adjudication-board.json",
  "phase-134-mission-decision-register.json",
  "phase-135-atlas-conversion-readiness-audit.json",
  "phase-136-named-project-chronicles.json",
  "phase-137-place-delivery-ledgers.json",
  "phase-138-longitudinal-evidence-eligibility.json",
  "phase-139-comparative-dossier-rereview.json",
  "phase-140-living-topic-desks.json",
  "phase-141-frontier-systems-almanac.json",
  "phase-142-topic-delivery-roadmaps.json",
  "phase-143-editorial-cadence-editions.json",
  "phase-144-v1-launch-candidate-audit.json",
];
const phases = await Promise.all(phaseFiles.map(readData));
const phaseByNumber = new Map(phases.map((phase) => [phase.phase, phase]));
const programs = [v07, v08, v09];
const versionRoutes = programs.flatMap((program) => program.public_html_routes);
const versionExports = programs.flatMap((program) => program.public_json_exports);
const p132 = phaseByNumber.get(132);
const p138 = phaseByNumber.get(138);
const p139 = phaseByNumber.get(139);
const p140 = phaseByNumber.get(140);
const p141 = phaseByNumber.get(141);
const p142 = phaseByNumber.get(142);
const p143 = phaseByNumber.get(143);
const p144 = phaseByNumber.get(144);

assert(v07.public_html_routes.length === 12 && v07.public_json_exports.length === 6, "v0.7 route contract changed.");
assert(v08.public_html_routes.length === 57 && v08.public_json_exports.length === 6, "v0.8 route contract changed.");
assert(v09.public_html_routes.length === 101 && v09.public_json_exports.length === 6, "v0.9 route contract changed.");
assert(unique(versionRoutes).length === 170, "v0.7-v0.9 routes are not a unique 170-route inventory.");
assert(unique(versionExports).length === 18, "v0.7-v0.9 exports are not a unique 18-export inventory.");
assert(p132.source_check_receipts.every((receipt) => receipt.source_checked_date === "2026-08-30" && receipt.source_check_provenance.every((source) => source.source_last_checked_date === "2026-08-30")), "Phase 132 provenance must be dated 2026-08-30.");
assert(p138.counts.legacy_panel_joins === 12 && p138.counts.governed_file_joins === 8, "Phase 138 must preserve twelve legacy and eight governed joins.");
const eligibilityIds = new Set(p138.eligibility_records.map((record) => record.eligibility_id));
assert(p139.comparison_reviews.every((review) => review.longitudinal_eligibility_ids.every((id) => eligibilityIds.has(id))), "Phase 139 contains an unresolved eligibility join.");
assert(p140.counts.desks_in_inaugural_edition === 17, "Phase 140 must place all seventeen desks in the inaugural edition.");
assert(p141.almanac_entries.every((entry) => !("evidence_ids" in entry) && Array.isArray(entry.mission_ids) && Array.isArray(entry.signal_ids) && Array.isArray(entry.source_ids)), "Phase 141 typed references are incomplete.");
assert(p142.topic_roadmaps.flatMap((roadmap) => roadmap.horizon_milestones).every((milestone) => "mission_decision_id" in milestone), "Phase 142 decision joins are incomplete.");
const inauguralEdition = p143.editions.find((edition) => edition.edition_id === "143-EDITION-001");
assert(Object.keys(inauguralEdition?.editorial_sections ?? {}).length === 6 && inauguralEdition?.desk_dispatches?.length === 17 && p143.counts.published_editions === 1 && p143.counts.scheduled_editions === 4, "Phase 143 final edition contract is incomplete.");
assert(p144.counts.launch_gates === 14 && p144.counts.passed === 10 && p144.counts.held === 4 && p144.counts.pending_build === 0 && p144.local_validation_receipt?.status === "Passed" && p144.v1_promotion_state === "Held", "Phase 144 must have a Passed validation receipt, a 10/4/0 gate split and a Held promotion.");

const distFiles = await collectFiles(distRoot);
const staticPages = distFiles.filter((path) => extname(path) === ".html" && !path.startsWith(join(distRoot, "downloads"))).length;
const publicJsonExports = distFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path) === ".json").length;
const updateCount = (await readdir(join(appRoot, "src", "content", "updates"))).filter((name) => name.endsWith(".json")).length;

assert(staticPages === 6504, `Expected 6,504 built HTML pages, found ${staticPages}.`);
assert(publicJsonExports === 86, `Expected 86 public JSON exports, found ${publicJsonExports}.`);
assert(updateCount === 169, `Expected 169 update records, found ${updateCount}.`);

manifest.generated_date = "2026-08-30";
manifest.build_id = "ftfn-v0.9";
manifest.package_version = packageJson.version;
manifest.content_version = "0.9";
manifest.deployment_status = "v0.9-locally-release-validated-owner-only-deployment-pending-historical-version-79-remains-live";
manifest.private_preview = {
  ...manifest.private_preview,
  content_scope: "Historical owner-only version 79 preview; it does not contain the current uncommitted v0.9 working tree.",
};
manifest.current_release_deployment = {
  content_version: "0.9",
  local_release_verified: true,
  github_published: false,
  hosted: false,
  owner_acceptance: false,
  public_launch_authorized: false,
  historical_owner_only_preview_remains_live: true,
};
manifest.expected_build.static_pages = staticPages;
manifest.expected_build.public_json_exports = publicJsonExports;
manifest.expected_build.updates = updateCount;
manifest.expected_build.content_version = "0.9";
manifest.expected_build.v07_public_html_routes = 12;
manifest.expected_build.v07_public_json_exports = 6;
manifest.expected_build.v08_public_html_routes = 57;
manifest.expected_build.v08_public_json_exports = 6;
manifest.expected_build.v09_public_html_routes = 101;
manifest.expected_build.v09_public_json_exports = 6;
manifest.expected_build.v07_v09_public_html_routes = 170;
manifest.expected_build.v07_v09_public_json_exports = 18;

for (const phase of phases) {
  for (const [key, value] of Object.entries(phase.counts ?? {})) {
    manifest.expected_build[`phase_${phase.phase}_${key}`] = value;
  }
}

manifest.v07_public_html_routes = v07.public_html_routes;
manifest.v08_public_html_routes = v08.public_html_routes;
manifest.v09_public_html_routes = v09.public_html_routes;
manifest.v07_public_json_exports = v07.public_json_exports;
manifest.v08_public_json_exports = v08.public_json_exports;
manifest.v09_public_json_exports = v09.public_json_exports;
manifest.phase_130_134_delta = {
  captured_date: "2026-08-30",
  phases_complete: 5,
  release: "v0.7 Evidence Admission Dockets",
  public_html_routes_added: v07.public_html_routes.length,
  public_json_exports_added: v07.public_json_exports.length,
  phase_counts: Object.fromEntries([...phaseByNumber].filter(([phase]) => phase >= 130 && phase <= 134).map(([phase, data]) => [`phase_${phase}`, data.counts])),
  artifacts_admitted: 0,
  requirement_decisions_created: 0,
  mission_answers_created: 0,
};
manifest.phase_135_139_delta = {
  captured_date: "2026-08-30",
  phases_complete: 5,
  release: "v0.8 Conversion and Longitudinal Atlas",
  public_html_routes_added: v08.public_html_routes.length,
  public_json_exports_added: v08.public_json_exports.length,
  phase_counts: Object.fromEntries([...phaseByNumber].filter(([phase]) => phase >= 135 && phase <= 139).map(([phase, data]) => [`phase_${phase}`, data.counts])),
  stage_advances: 0,
  admitted_series: 0,
  outcome_claims_created: 0,
  comparison_verdict_changes: 0,
};
manifest.phase_140_144_delta = {
  captured_date: "2026-08-30",
  phases_complete: 5,
  release: "v0.9 Living Public Intelligence",
  public_html_routes_added: v09.public_html_routes.length,
  public_json_exports_added: v09.public_json_exports.length,
  phase_counts: Object.fromEntries([...phaseByNumber].filter(([phase]) => phase >= 140 && phase <= 144).map(([phase, data]) => [`phase_${phase}`, data.counts])),
  v1_promotion_state: phaseByNumber.get(144).v1_promotion_state,
  local_validation_receipt_id: phaseByNumber.get(144).local_validation_receipt.receipt_id,
  receipt_follow_up: {
    status: "completed",
    completed_date: "2026-08-31",
    detail: "The immutable receipt retains its at-issuance next action; receipt embedding, production rebuild, manifest update and final release verification are complete.",
  },
  public_launch_authorized: false,
  hosted_deployment_authorized: false,
};

const gateCommands = [
  "npm run test:v07",
  "npm run verify:v07",
  "npm run test:v08",
  "npm run verify:v08",
  "npm run test:v09",
  "npm run verify:v09",
];
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !gateCommands.includes(command));
const verifyReleaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(verifyReleaseIndex < 0 ? manifest.predeploy_commands.length : verifyReleaseIndex, 0, ...gateCommands);

manifest.required_output_files = unique([
  ...manifest.required_output_files,
  ...versionRoutes.map(routeToOutput),
  ...versionExports.map(exportToOutput),
]).sort();

const newReleaseGates = [
  "Confirm v0.7 publishes exactly 12 unique HTML routes and six JSON exports while retaining zero admitted artifacts, zero requirement decisions and zero mission answers",
  "Confirm v0.8 publishes exactly 57 unique HTML routes and six JSON exports while retaining zero stage advances, admitted longitudinal series, outcomes, scores, rankings or causal findings",
  "Confirm v0.9 publishes exactly 101 unique HTML routes and six JSON exports, one current inaugural edition and four unpredated scheduled editions, while v1 promotion remains Held",
];
const supersededGlobalGatePrefixes = [
  "Confirm 3,725 generated HTML pages",
  "Confirm all 1,011 Published signal URLs",
  "Confirm all fifty-five Published briefing URLs",
  "Confirm all six Published dependency-map URLs",
  "Confirm all 498 sources supporting Published signals",
  "Confirm all five public JSON exports",
  "Confirm the 78-entry public update log",
  "Confirm all fifty-nine research collections",
];
const currentGlobalReleaseGates = [
  "Confirm 6,504 generated HTML pages, 86 top-level public JSON exports, 169 update records and all required outputs",
  "Confirm all 1,121 Published signal URLs are present in the sitemap and all 285 In Review signal URLs remain outside it",
  "Confirm all 453 Published briefing URLs and 177 Published dependency-map URLs are indexed under their declared publication policy",
  "Confirm all 502 sources supporting Published signals were checked on or after 2026-07-22",
  "Confirm all 64 research collections render 1,629 document summaries and their downloadable archives",
];
manifest.release_gates = unique([
  ...manifest.release_gates.filter((gate) =>
    !gate.startsWith("Confirm v0.7") &&
    !gate.startsWith("Confirm v0.8") &&
    !gate.startsWith("Confirm v0.9") &&
    !supersededGlobalGatePrefixes.some((prefix) => gate.startsWith(prefix))
  ),
  ...currentGlobalReleaseGates,
  ...newReleaseGates,
]);

manifest.last_verified = {
  ...manifest.last_verified,
  date: "2026-08-31",
  validate_content: "passed-795-sources-1406-signals-1629-research-documents",
  source_health: "passed",
  astro_check: "passed",
  build: "passed",
  static_pages_built: staticPages,
  release_assertions: "passed-through-phase-144-v09-living-public-intelligence",
  hosted_routes_checked: 0,
  preview_qa: "v0.9 Living Public Intelligence locally release-validated; v1 promotion remains held; GitHub publication and owner-approved hosted deployment remain separate gates",
};

const v09Limitations = [
  "The 86 top-level public JSON files are static build exports, not a live API or database-backed service.",
  `The v0.7 admission dockets currently preserve ${phaseByNumber.get(133).counts.pending_owner_adjudication} pending requirement decisions and ${phaseByNumber.get(134).counts.owner_decisions_pending} pending mission decisions; any later governed decisions require dated receipts, and source-check receipts remain triage records rather than evidence-admission receipts.`,
  "The v0.8 longitudinal layer admits no series, values or outcome claims and preserves all twelve comparative dossiers as Context only.",
  "The v0.9 publication layer contains one current inaugural edition and four future scheduled editions with no future-dated content; Phase 144 keeps v1 promotion Held.",
  "The immutable Phase 144 receipt preserves its next_action as an at-issuance instruction; its requested embedding, rebuild, manifest update and final release verification completed on 2026-08-31.",
];
manifest.known_limitations = unique([
  ...manifest.known_limitations.filter((note) => !note.startsWith("The package version remains 0.2.0-dev") && !note.startsWith("The five public JSON files") && !note.startsWith("The 86 top-level public JSON files") && !note.startsWith("The v0.7 admission dockets") && !note.startsWith("The v0.8 longitudinal layer") && !note.startsWith("The v0.9 publication layer") && !note.startsWith("The immutable Phase 144 receipt")),
  ...v09Limitations,
]);
manifest.notes = [
  "This manifest records the completed Phase 103-144 public knowledge edition through FTFN v0.9. v0.7 adds owner-gated evidence-admission dockets, v0.8 adds bounded conversion and longitudinal reading layers, and v0.9 adds living desks, an almanac, topic roadmaps and an editorial cadence while preserving all evidence and decision boundaries. GitHub publication, hosted deployment and v1 promotion remain separate gates.",
];

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated v0.9 manifest: ${staticPages} pages, ${publicJsonExports} exports, ${updateCount} updates, 170 version routes, and v1 held.`);
