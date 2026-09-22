import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1rcDigestFromDisk, isValidV1rcValidationReceipt } from "./lib/v1rc-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const distRoot = join(appRoot, "dist");
const updateRoot = join(appRoot, "src", "content", "updates");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  }));
  return nested.flat();
};
const unique = (items) => [...new Set(items)];
const routeToOutput = (route) => `dist/${route.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
const exportToOutput = (route) => `dist/${route.replace(/^\//, "")}`;
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const manifest = await readJson(manifestPath);
const aggregate = await readJson(join(dataRoot, "v1-release-candidate.json"));
const phaseFiles = [
  "phase-145-evidence-gate-operations-journal.json",
  "phase-146-authority-gap-resolution-program.json",
  "phase-147-evidence-adjudication-record.json",
  "phase-148-atlas-changefeed.json",
  "phase-149-longitudinal-evidence-lab.json",
  "phase-150-comparison-passports-2-0.json",
  "phase-151-weekly-desk-review-ledger.json",
  "phase-152-frontier-topic-field-guides.json",
  "phase-153-future-state-report-series.json",
  "phase-154-september-edition-packets.json",
  "phase-155-public-method-corrections-library.json",
  "phase-156-v1-launch-decision.json",
];
const phases = await Promise.all(phaseFiles.map((name) => readJson(join(dataRoot, name))));
const phaseByNumber = new Map(phases.map((phase) => [phase.phase, phase]));
const p156 = phaseByNumber.get(156);
const receipt = p156.local_validation_receipt;
const currentDigest = await computeV1rcDigestFromDisk({ aggregate, dataRoot, updateRoot });
const priorDeploymentState = manifest.v1_release_candidate ?? {};
const preserveDeploymentState = priorDeploymentState.artifact_digest === receipt?.artifact_digest;

assert(manifest.package_version === "0.9.0" && manifest.content_version === "0.9", "The v0.9 deployment boundary must remain controlling while v1 is held.");
assert(isValidV1rcValidationReceipt({ receipt, aggregate, candidateDigest: currentDigest }), "Phase 156 does not embed a current, well-formed, digest-matching validation receipt.");
assert(p156.counts.pending_build === 0 && p156.counts.passed + p156.counts.held === 14, "Phase 156 must be locally validated with fourteen resolved local gate states.");
assert(p156.v1_promotion_state === (p156.launch_gates.every((gate) => gate.state === "Pass") ? "Ready for promotion" : "Held"), "Phase 156 promotion state is not derived from its gates.");
assert(aggregate.public_html_routes.length >= 58 && new Set(aggregate.public_html_routes).size === aggregate.public_html_routes.length && aggregate.public_json_exports.length === 13, "The v1-RC route/export inventory is incomplete or duplicated.");

const distFiles = await collectFiles(distRoot);
const staticPages = distFiles.filter((path) => extname(path).toLowerCase() === ".html" && !path.startsWith(join(distRoot, "downloads"))).length;
const publicJsonExports = distFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot)).filter((name) => name.endsWith(".json")).length;

assert(staticPages === receipt.metrics.html_pages_excluding_downloads, `Built HTML count ${staticPages} does not match the Phase 156 receipt.`);
assert(publicJsonExports === receipt.metrics.top_level_data_json_exports, `Built JSON count ${publicJsonExports} does not match the Phase 156 receipt.`);
assert(updateCount === receipt.metrics.update_entries_rendered, `Update count ${updateCount} does not match the Phase 156 receipt.`);

manifest.generated_date = aggregate.effective_date;
manifest.build_id = "ftfn-v0.9-plus-v1rc";
manifest.expected_build.static_pages = staticPages;
manifest.expected_build.public_json_exports = publicJsonExports;
manifest.expected_build.updates = updateCount;
manifest.expected_build.v1rc_public_html_routes = aggregate.public_html_routes.length;
manifest.expected_build.v1rc_public_json_exports = aggregate.public_json_exports.length;
delete manifest.expected_build.phase_146_exact_artifacts_admitted;
delete manifest.expected_build.phase_154_source_binders_complete;
for (const phase of phases) {
  for (const [key, value] of Object.entries(phase.counts ?? {})) manifest.expected_build[`phase_${phase.phase}_${key}`] = value;
}

manifest.v1rc_public_html_routes = aggregate.public_html_routes;
manifest.v1rc_public_json_exports = aggregate.public_json_exports;
manifest.phase_145_156_delta = {
  captured_date: aggregate.effective_date,
  phases_complete_locally: 12,
  release: "v1 Release Candidate",
  public_html_routes_added: aggregate.public_html_routes.length,
  public_json_exports_added: aggregate.public_json_exports.length,
  phase_counts: Object.fromEntries(phases.map((phase) => [`phase_${phase.phase}`, phase.counts])),
  alternative_official_artifacts_checked: phaseByNumber.get(146).counts.unique_alternative_artifacts_checked,
  field_guides: phaseByNumber.get(152).counts.field_guides,
  flagship_reports: phaseByNumber.get(153).counts.flagship_reports,
  local_validation_receipt_id: receipt.receipt_id,
  local_validation_artifact_digest: receipt.artifact_digest,
  v1_promotion_state: p156.v1_promotion_state,
  owner_acceptance: p156.owner_packet.owner_acceptance,
  github_published: preserveDeploymentState ? priorDeploymentState.github_published ?? false : false,
  hosted: preserveDeploymentState ? priorDeploymentState.hosted ?? false : false,
  public_launch_authorized: p156.owner_packet.public_launch_authorized,
};
manifest.v1_release_candidate = {
  content_version: "1.0 release candidate",
  effective_date: aggregate.effective_date,
  local_release_candidate_verified: true,
  validation_receipt_id: receipt.receipt_id,
  artifact_digest: receipt.artifact_digest,
  launch_gate_state: { passed: p156.counts.passed, held: p156.counts.held, pending_build: p156.counts.pending_build },
  v1_promotion: p156.v1_promotion_state,
  owner_acceptance: p156.owner_packet.owner_acceptance,
  github_published: preserveDeploymentState ? priorDeploymentState.github_published ?? false : false,
  hosted: preserveDeploymentState ? priorDeploymentState.hosted ?? false : false,
  public_launch_authorized: p156.owner_packet.public_launch_authorized,
  custom_domain_attached: preserveDeploymentState ? priorDeploymentState.custom_domain_attached ?? false : false,
  dns_changed: preserveDeploymentState ? priorDeploymentState.dns_changed ?? false : false,
};

const candidateCommands = ["npm run test:v1rc", "npm run verify:v1rc"];
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !candidateCommands.includes(command));
const verifyReleaseIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(verifyReleaseIndex < 0 ? manifest.predeploy_commands.length : verifyReleaseIndex, 0, ...candidateCommands);
manifest.required_output_files = unique([
  ...manifest.required_output_files,
  ...aggregate.public_html_routes.map(routeToOutput),
  ...aggregate.public_json_exports.map(exportToOutput),
]).sort();

const inventoryGate = `Confirm ${staticPages.toLocaleString("en-US")} generated HTML pages, ${publicJsonExports} top-level public JSON exports, ${updateCount} update records and all required outputs`;
const candidateGates = [
  `Confirm the v1 release candidate publishes exactly its current ${aggregate.public_html_routes.length} unique HTML routes and 13 schema-1.0 JSON exports across Phases 145–156`,
  "Confirm all future Phase 145 gates and Phase 151/154 editorial windows remain unpredated and independently receipted when operated",
  "Confirm alternative official-source discovery remains candidate evidence until dated owner adjudication",
  "Confirm Phase 156 remains Held until evidence admission, authority disposition, longitudinal or accepted no-series boundary, and owner acceptance gates pass",
];
manifest.release_gates = unique([
  ...manifest.release_gates.filter((gate) => !/^Confirm [\d,]+ generated HTML pages, \d+ top-level public JSON exports, \d+ update records and all required outputs$/.test(gate) && !gate.startsWith("Confirm the v1 release candidate") && !gate.startsWith("Confirm all future Phase 145") && !gate.startsWith("Confirm alternative official-source") && !gate.startsWith("Confirm Phase 156 remains Held")),
  inventoryGate,
  ...candidateGates,
]);

manifest.last_verified = {
  ...manifest.last_verified,
  date: aggregate.effective_date,
  candidate_validation: "passed-v1rc-phases-145-156-local-only",
  astro_check: "passed",
  build: "passed",
  static_pages_built: staticPages,
  release_assertions: `passed-through-phase-156-v1-release-candidate-${p156.v1_promotion_state.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  preview_qa: `v1 release candidate locally validated with promotion state ${p156.v1_promotion_state}; v0.9 remains the controlling release until a separate publication action; GitHub publication, hosted deployment, owner acceptance, and public launch remain distinct gates`,
};

const candidateLimitations = [
  `The ${publicJsonExports} top-level public JSON files are static build exports, not a live API or database-backed service.`,
  phaseByNumber.get(146).counts.owner_dispositions_pending > 0 ? `The v1 release candidate maps alternative official sources without admitting them as evidence; ${phaseByNumber.get(146).counts.owner_dispositions_pending} authority disposition(s) remain owner-gated.` : null,
  phaseByNumber.get(147).counts.owner_decisions_pending > 0 ? `${phaseByNumber.get(147).counts.owner_decisions_pending} of ${phaseByNumber.get(147).counts.total_decision_packets} requirement/mission adjudication(s) remain owner-gated; no generated packet is an owner decision.` : null,
  phaseByNumber.get(149).counts.admitted_series === 0 && phaseByNumber.get(149).counts.no_series_boundary_owner_acceptance === 0 ? "No longitudinal series is admitted and the zero-series launch boundary remains owner-gated." : null,
  `${phaseByNumber.get(154).counts.time_gated_editions} future and ${phaseByNumber.get(154).counts.due_editions_pending} due September edition(s), plus ${phaseByNumber.get(145).counts.future_time_gated_operations} future and ${phaseByNumber.get(145).counts.due_operations_pending} due evidence/recheck operation(s), remain calendar-bound or receipt-pending; no future result or editorial decision is predated.`,
  "The Phase 156 local validation receipt does not authorize GitHub publication, hosted deployment, owner acceptance, public launch, custom-domain attachment, or DNS changes.",
  `The Phase 145 journal carries ${phaseByNumber.get(145).counts.completed_upstream_decisions} completed upstream decision(s), ${phaseByNumber.get(145).counts.future_time_gated_operations} future operation(s), and ${phaseByNumber.get(145).counts.due_operations_pending} due operation(s) awaiting a lawful receipt; future checks are not represented as completed.`,
];
manifest.known_limitations = unique([
  ...manifest.known_limitations.filter((note) => !/^The \d+ top-level public JSON files/.test(note) && !note.startsWith("The v1 release candidate") && !/^\d+ of \d+ requirement\/mission adjudication/.test(note) && !note.startsWith("Eighteen requirement and six mission") && !note.startsWith("No longitudinal series is admitted") && !note.startsWith("Four September editions") && !/^\d+ September edition\(s\)/.test(note) && !/^\d+ future and \d+ due September edition/.test(note) && !note.startsWith("The Phase 156 local validation receipt") && !note.startsWith("Phase 60 completes the evidence-to-decision operating system") && !note.startsWith("The Phase 145 journal carries")),
  ...candidateLimitations,
]);
manifest.notes = unique([
  ...manifest.notes.filter((note) => !note.startsWith("Phases 145–156 add a separately named v1 release-candidate layer")),
  `Phases 145–156 add a separately named v1 release-candidate layer over the immutable v0.9 snapshot. Local validation is complete, but v1 promotion remains ${p156.v1_promotion_state} with ${p156.counts.held} Held gate(s); the deployment manifest therefore retains v0.9 as the controlling release until every promotion gate passes.`,
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 156 manifest: ${staticPages} pages, ${publicJsonExports} exports, ${updateCount} updates, ${aggregate.public_html_routes.length} v1-RC routes, 13 v1-RC exports, and v1 ${p156.v1_promotion_state}.`);
