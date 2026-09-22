import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1monthDigestFromDisk, isValidV1monthValidationReceipt, v1monthPhases } from "./lib/v1month-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");

const phaseFiles = [
  "phase-157-v1-candidate-preservation-ledger.json",
  "phase-158-september-evidence-operations-desk.json",
  "phase-159-owner-decision-sprint.json",
  "phase-160-longitudinal-pilot-matrices.json",
  "phase-161-stack-watch.json",
  "phase-162-local-system-expansion.json",
  "phase-163-september-editorial-runbooks.json",
  "phase-164-monthly-candidate-decision.json",
];

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  }));
  return nested.flat();
};
const unique = (items) => [...new Set(items.filter(Boolean))];
const routeToOutput = (route) => `dist/${route.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
const exportToOutput = (route) => `dist/${route.replace(/^\//, "")}`;
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const manifest = await readJson(manifestPath);
const aggregate = await readJson(join(dataRoot, "v1-monthly-operating-program.json"));
const phases = await Promise.all(phaseFiles.map((name) => readJson(join(dataRoot, name))));
const phaseByNumber = new Map(phases.map((phase) => [phase.phase, phase]));
const p156 = await readJson(join(dataRoot, "phase-156-v1-launch-decision.json"));
const p164 = phaseByNumber.get(164);
const receipt = p164.local_validation_receipt;
const currentDigest = await computeV1monthDigestFromDisk({ aggregate, dataRoot, updateRoot });

assert(manifest.package_version === "0.9.0" && manifest.content_version === "0.9", "The v0.9 deployment boundary must remain controlling while v1 is Held.");
assert(phases.length === 8 && phases.every((phase, index) => phase.phase === v1monthPhases[index]), "The Phase 157–164 registry inventory is incomplete or out of order.");
assert(aggregate.program_id === "FTFN-V1-SEPTEMBER-OPERATING-PROGRAM" && aggregate.schema_version === "1.0", "The v1month aggregate has an invalid identity or schema version.");
assert(aggregate.public_html_routes.length === 67 && new Set(aggregate.public_html_routes).size === 67, "The v1month overlay must inventory exactly 67 unique HTML routes.");
assert(aggregate.public_json_exports.length === 9 && new Set(aggregate.public_json_exports).size === 9, "The v1month overlay must inventory exactly nine unique JSON exports.");
assert(aggregate.publication_update_files.length === 8 && new Set(aggregate.publication_update_files).size === 8, "The v1month overlay must inventory exactly eight immutable publication updates.");
assert(aggregate.baseline_v1rc?.receipt_id === p156.local_validation_receipt?.receipt_id && aggregate.baseline_v1rc?.artifact_digest === p156.local_validation_receipt?.artifact_digest, "The v1month overlay does not bind the current immutable Phase 156 receipt and digest.");
assert(isValidV1monthValidationReceipt({ receipt, aggregate, candidateDigest: currentDigest }), "Phase 164 does not embed a current, well-formed, digest-matching validation receipt.");
assert(receipt.metrics?.overlay_public_html_routes === 67 && receipt.metrics?.structurally_audited_overlay_routes === 67, "The Phase 164 receipt does not validate the exact 67-route overlay contract.");
assert(receipt.metrics?.overlay_public_json_exports === 9 && receipt.metrics?.schema_1_0_overlay_exports === 9, "The Phase 164 receipt does not validate the exact nine-export schema contract.");
assert(receipt.metrics?.overlay_update_records === 8, "The Phase 164 receipt does not validate the eight immutable overlay updates.");
assert(p164.counts?.pending_build === 0 && p164.counts?.passed + p164.counts?.held === 14, "Phase 164 must be locally validated with fourteen resolved local gate states.");
assert(p164.v1_promotion_state === "Held" && aggregate.v1_promotion_state === "Held", "The Phase 164 overlay must keep v1 promotion Held.");
assert(Object.values(p164.owner_authority ?? {}).every((value) => value === false), "Phase 164 must retain false evidence-admission, owner, GitHub, hosting, and public-launch authority.");
assert(receipt.evidence_admission_authorized === false && receipt.owner_acceptance === false && receipt.github_publication_authorized === false && receipt.hosted_deployment_authorized === false && receipt.public_launch_authorized === false && receipt.v1_promotion_state === "Held", "The Phase 164 receipt overstates evidence, owner, repository, hosting, launch, or promotion authority.");

const distFiles = await collectFiles(distRoot);
const staticPages = distFiles.filter((path) => extname(path).toLowerCase() === ".html" && !path.startsWith(join(distRoot, "downloads"))).length;
const publicJsonExports = distFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceCount = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const historicalSnapshot = receipt.metrics?.whole_site_snapshot;

assert(staticPages >= historicalSnapshot?.html_pages_excluding_downloads, "The current HTML count is below the Phase 164 historical whole-site snapshot.");
assert(publicJsonExports >= historicalSnapshot?.top_level_data_json_exports, "The current JSON count is below the Phase 164 historical whole-site snapshot.");
assert(updateCount >= historicalSnapshot?.update_entries_rendered, "The current update count is below the Phase 164 historical whole-site snapshot.");
assert(sourceCount >= 816, `Expected at least the 816-source Phase 164 corpus, found ${sourceCount}.`);

manifest.generated_date = aggregate.effective_date;
manifest.build_id = "ftfn-v0.9-plus-v1rc-plus-v1month";
manifest.expected_build.static_pages = staticPages;
manifest.expected_build.public_json_exports = publicJsonExports;
manifest.expected_build.updates = updateCount;
manifest.expected_build.sources = sourceCount;
manifest.expected_build.v1month_public_html_routes = 67;
manifest.expected_build.v1month_public_json_exports = 9;
for (const phase of phases) {
  for (const [key, value] of Object.entries(phase.counts ?? {})) manifest.expected_build[`phase_${phase.phase}_${key}`] = value;
}

manifest.v1month_public_html_routes = aggregate.public_html_routes;
manifest.v1month_public_json_exports = aggregate.public_json_exports;
manifest.phase_157_164_delta = {
  captured_date: aggregate.effective_date,
  phases_complete_locally: 8,
  release: "v1 September Operating Program",
  public_html_routes_added: aggregate.public_html_routes.length,
  public_json_exports_added: aggregate.public_json_exports.length,
  publication_updates_added: aggregate.publication_update_files.length,
  canonical_sources: sourceCount,
  phase_counts: Object.fromEntries(phases.map((phase) => [`phase_${phase.phase}`, phase.counts])),
  september_operation_packets: phaseByNumber.get(158).counts.september_operation_packets,
  pending_owner_actions: phaseByNumber.get(159).counts.pending_owner_actions,
  compatibility_pilots: phaseByNumber.get(160).counts.compatibility_pilots,
  observations_transferred: phaseByNumber.get(160).counts.observations_transferred,
  stack_watch_packets: phaseByNumber.get(161).counts.stack_watch_packets,
  claim_blocks: phaseByNumber.get(161).counts.claim_blocks,
  local_system_briefs: phaseByNumber.get(162).counts.local_system_briefs,
  timeline_entries: phaseByNumber.get(162).counts.timeline_entries,
  dependency_maps: phaseByNumber.get(162).counts.dependency_maps,
  editorial_runbooks: phaseByNumber.get(163).counts.editorial_runbooks,
  desk_window_bindings: phaseByNumber.get(163).counts.desk_window_bindings,
  local_validation_receipt_id: receipt.receipt_id,
  local_validation_artifact_digest: receipt.artifact_digest,
  baseline_phase156_receipt_id: aggregate.baseline_v1rc.receipt_id,
  baseline_phase156_artifact_digest: aggregate.baseline_v1rc.artifact_digest,
  v1_promotion_state: "Held",
  owner_acceptance: false,
  evidence_admission_authorized: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
};
manifest.v1_monthly_operating_program = {
  content_version: "v1 September operating overlay",
  effective_date: aggregate.effective_date,
  local_operating_program_verified: true,
  validation_receipt_id: receipt.receipt_id,
  artifact_digest: receipt.artifact_digest,
  baseline_v1rc_receipt_id: aggregate.baseline_v1rc.receipt_id,
  baseline_v1rc_artifact_digest: aggregate.baseline_v1rc.artifact_digest,
  readiness_gate_state: {
    passed: p164.counts.passed,
    held: p164.counts.held,
    pending_build: p164.counts.pending_build,
  },
  v1_promotion: "Held",
  owner_acceptance: false,
  evidence_admission_authorized: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
  custom_domain_attached: false,
  dns_changed: false,
};

const overlayCommands = ["npm run test:v1month", "npm run verify:v1month"];
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !overlayCommands.includes(command));
const verifyReleaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(verifyReleaseIndex < 0 ? manifest.predeploy_commands.length : verifyReleaseIndex, 0, ...overlayCommands);
manifest.required_output_files = unique([
  ...manifest.required_output_files,
  ...aggregate.public_html_routes.map(routeToOutput),
  ...aggregate.public_json_exports.map(exportToOutput),
]).sort();

const inventoryGate = `Confirm ${staticPages.toLocaleString("en-US")} generated HTML pages, ${publicJsonExports} top-level public JSON exports, ${updateCount} update records and all required outputs`;
const overlayGates = [
  "Confirm the v1 September operating overlay publishes exactly 67 unique HTML routes and nine schema-1.0 JSON exports across Phases 157–164",
  "Confirm the overlay preserves the exact Phase 156 receipt and digest while treating its whole-site inventory metrics as a historical snapshot",
  "Confirm all ten September evidence operations, 68 desk windows, and four editions retain independent null future decision and receipt fields until their lawful dates",
  "Confirm 36 owner actions and the longitudinal no-series boundary remain owner-gated with zero fabricated decisions or transferred observations",
  "Confirm all alternative artifacts remain candidates unless a dated authorized evidence decision admits them",
  "Confirm Phase 164 retains v1 Held and false evidence-admission, owner, GitHub-publication, hosted-deployment, and public-launch authority",
];
manifest.release_gates = unique([
  ...manifest.release_gates.filter((gate) => !/^Confirm [\d,]+ generated HTML pages, \d+ top-level public JSON exports, \d+ update records and all required outputs$/.test(gate)
    && !gate.startsWith("Confirm the v1 September operating overlay")
    && !gate.startsWith("Confirm the overlay preserves the exact Phase 156")
    && !gate.startsWith("Confirm all ten September evidence operations")
    && !gate.startsWith("Confirm 36 owner actions")
    && !gate.startsWith("Confirm all alternative artifacts remain candidates")
    && !gate.startsWith("Confirm Phase 164 retains v1 Held")),
  inventoryGate,
  ...overlayGates,
]);

manifest.last_verified = {
  ...manifest.last_verified,
  date: aggregate.effective_date,
  candidate_validation: "passed-v1month-phases-157-164-local-only",
  astro_check: "passed",
  build: "passed",
  static_pages_built: staticPages,
  release_assertions: "passed-through-phase-164-v1-september-operating-overlay-held",
  preview_qa: "Phases 157–164 are locally validated as an append-only operating overlay; v0.9 remains controlling and v1 promotion, owner acceptance, GitHub publication, hosting, and public launch remain unauthorized",
};

const overlayLimitations = [
  `The ${publicJsonExports} top-level public JSON files are static build exports, not a live API or database-backed service.`,
  `The source registry contains ${sourceCount} canonical records; a source record or alternative artifact is not evidence admission and does not answer an owner-gated requirement by itself.`,
  `${phaseByNumber.get(158).counts.future_operations} September operation(s) remain future and ${phaseByNumber.get(158).counts.due_operations_pending} are due without a lawful receipt; no result is predated.`,
  `${phaseByNumber.get(159).counts.pending_owner_actions} of ${phaseByNumber.get(159).counts.total_owner_actions} authority, requirement, and mission action(s) remain owner-gated; no generated board is an owner decision.`,
  `Phase 160 transfers ${phaseByNumber.get(160).counts.observations_transferred} observations, admits ${phaseByNumber.get(160).counts.admitted_series} series, and retains the zero-series boundary for owner disposition.`,
  `Four September editorial runbooks bind ${phaseByNumber.get(163).counts.desk_window_bindings} desk windows and four edition packets without predating any review or publication decision.`,
  "The Phase 156 receipt remains an immutable v1-RC baseline; its whole-site inventory totals are historical snapshots and are not rewritten as this append-only overlay grows.",
  "The Phase 164 local validation receipt does not authorize evidence admission, owner acceptance, GitHub publication, hosted deployment, public launch, custom-domain attachment, or DNS changes.",
];
manifest.known_limitations = unique([
  ...manifest.known_limitations.filter((note) => !/^The \d+ top-level public JSON files/.test(note)
    && !note.startsWith("The source registry contains")
    && !/^\d+ September operation\(s\)/.test(note)
    && !/^\d+ of \d+ authority, requirement, and mission action/.test(note)
    && !note.startsWith("Phase 160 transfers")
    && !note.startsWith("Four September editorial runbooks bind")
    && !note.startsWith("The Phase 156 receipt remains an immutable v1-RC baseline")
    && !note.startsWith("The Phase 164 local validation receipt")),
  ...overlayLimitations,
]);
manifest.notes = unique([
  ...manifest.notes.filter((note) => !note.startsWith("Phases 157–164 add the v1 September operating overlay")),
  `Phases 157–164 add the v1 September operating overlay without rewriting the Phase 156 candidate. The overlay contributes 67 routes, nine exports, 24 Stack Watch packets, four local-system briefs, four editorial runbooks, and a receipt-backed local audit; v0.9 remains controlling and v1 promotion remains Held.`,
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 164 manifest: ${staticPages} pages, ${publicJsonExports} exports, ${sourceCount} sources, ${updateCount} updates, 67 v1month routes, nine v1month exports, and v1 Held.`);
