import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1cycleDigestFromDisk, isValidV1cycleValidationReceipt, v1cyclePhases } from "./lib/v1cycle-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const signalRoot = join(appRoot, "src", "content", "signals");
const researchDocumentRoot = join(appRoot, "src", "content", "research-documents");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const phaseFiles = [
  "phase-165-live-evidence-operations-cycle-001.json", "phase-166-weekly-desk-closures-and-editions.json",
  "phase-167-authority-resolution-hearings.json", "phase-168-requirement-mission-adjudication.json",
  "phase-169-longitudinal-pilot-adjudication.json", "phase-170-fifteen-place-systems-atlas.json",
  "phase-171-frontier-systems-compendium.json", "phase-172-september-state-report.json",
];
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const collectFiles = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
  const path = join(directory, entry.name); return entry.isDirectory() ? collectFiles(path) : [path];
}))).flat();
const unique = (items) => [...new Set(items.filter(Boolean))];
const routeToOutput = (route) => `dist/${route.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
const exportToOutput = (route) => `dist/${route.replace(/^\//, "")}`;
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const manifest = await readJson(manifestPath);
const aggregate = await readJson(join(dataRoot, "v1-september-evidence-cycle.json"));
const phases = await Promise.all(phaseFiles.map((name) => readJson(join(dataRoot, name))));
const phase60Cycle = await readJson(join(dataRoot, "phase-60-operating-cycle.json"));
const phase60Propagation = await readJson(join(dataRoot, "phase-60-propagation-contract.json"));
const phase58Receipts = await readJson(join(dataRoot, "phase-58-change-receipts.json"));
const phase67Returns = await readJson(join(dataRoot, "phase-67-evidence-return-envelope-ledger.json"));
const phase67Packets = await readJson(join(dataRoot, "phase-67-qualification-packet-registry.json"));
const phaseByNumber = new Map(phases.map((phase) => [phase.phase, phase]));
const p172 = phaseByNumber.get(172);
const receipt = p172.local_validation_receipt;
const starlinkCycleItem = phase60Cycle.records.find((record) => record.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
const starlinkPropagationProof = phase60Propagation.cycle_decision_proofs.find((proof) => proof.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
const starlinkReturnEnvelope = phase67Returns.envelope_records.find((record) => record.envelope_id === "67-RETURN-003");
const starlinkReceipt = phase58Receipts.receipts.find((record) => record.receipt_id === "receipt-60-louisiana-starlink-2026-09-01-no-material-change");
const currentDigest = await computeV1cycleDigestFromDisk({ dataRoot, updatesRoot: updateRoot });
assert(manifest.package_version === "0.9.0" && manifest.content_version === "0.9", "v0.9 must remain controlling while v1 is Held.");
assert(phases.every((phase, index) => phase.phase === v1cyclePhases[index]), "Phase 165–172 inventory is incomplete or out of order.");
assert(aggregate.program_id === "FTFN-V1-SEPTEMBER-EVIDENCE-TO-PUBLICATION-CYCLE" && aggregate.schema_version === "1.0", "The v1cycle aggregate identity is invalid.");
assert(aggregate.public_html_routes.length === 90 && new Set(aggregate.public_html_routes).size === 90, "The v1cycle route inventory is not exact.");
assert(aggregate.public_json_exports.length === 9 && new Set(aggregate.public_json_exports).size === 9, "The v1cycle export inventory is not exact.");
assert(aggregate.publication_update_files.length === 8 && new Set(aggregate.publication_update_files).size === 8, "The v1cycle update inventory is not exact.");
assert(isValidV1cycleValidationReceipt({ receipt, aggregate, candidateDigest: currentDigest }), "Phase 172 lacks a current digest-matching receipt.");
assert(p172.counts.passed === 7 && p172.counts.held === 7 && p172.counts.pending_build === 0 && p172.v1_promotion_state === "Held", "Phase 172 must be 7 Pass / 7 Held / 0 Pending and retain v1 Held.");
assert(Object.values(p172.owner_authority).every((value) => value === false), "Phase 172 overstates owner or publication authority.");
assert(phase60Cycle.operating_measures.completed_cycle_decisions === 3 && phase60Cycle.records.filter((record) => record.decision_status === "scheduled").length === 10, "The Phase 60 cycle must contain three completed decisions and ten scheduled gates.");
assert(starlinkCycleItem?.decision_status === "no_material_change" && starlinkCycleItem?.decision_date === "2026-09-01" && starlinkCycleItem?.receipt_id === starlinkReceipt?.receipt_id && starlinkCycleItem?.next_check_date === "2026-09-08" && starlinkCycleItem?.official_surface_count === 9 && starlinkCycleItem?.content_propagation_status === "complete" && starlinkCycleItem?.git_backed_release_status === "held", "The September 1 Phase 60 cycle decision is incomplete or overstates Git-backed release.");
assert(starlinkPropagationProof?.proof_id === "60-PROP-LOUISIANA-STARLINK-2026-09-01" && starlinkPropagationProof?.propagation_status === "complete_locally_git_held" && starlinkPropagationProof?.content_propagation_status === "complete" && starlinkPropagationProof?.git_backed_release_status === "held" && starlinkPropagationProof?.named_file_ids?.length === 0 && JSON.stringify(starlinkPropagationProof?.referenced_place_context_ids) === JSON.stringify(["162-BRIEF-004"]) && starlinkPropagationProof?.referenced_operation_overlay_id === "165-OPERATION-001" && !("place_overlay_ids" in starlinkPropagationProof) && !("operation_overlay_id" in starlinkPropagationProof), "The September 1 propagation proof is incomplete, overbroad, or incorrectly transfers to a named file.");
assert(starlinkReturnEnvelope?.envelope_state === "Propagation Complete — Git Held" && starlinkReturnEnvelope?.receipt_id === starlinkReceipt?.receipt_id && starlinkReturnEnvelope?.named_file_ids?.length === 0 && starlinkReturnEnvelope?.next_check_date === "2026-09-08" && starlinkReturnEnvelope?.content_propagation_status === "complete" && starlinkReturnEnvelope?.git_backed_release_status === "held", "The September 1 evidence-return envelope is incomplete, incorrectly bound, or overstates Git-backed release.");
assert(phase67Returns.metrics.receipts_created === 3 && phase67Returns.metrics.decisions_completed === 3 && phase67Returns.metrics.propagation_completed === 3 && phase67Returns.envelope_records.filter((record) => record.envelope_state === "Scheduled").length === 10, "The Phase 67 return ledger must record three complete and ten scheduled envelopes.");
assert(phase67Packets.operational_status === "Three Cycle Receipts Recorded; Qualification Packets Awaiting File Evidence", "The Phase 67 qualification registry does not preserve the bounded post-September 1 state.");

const distFiles = await collectFiles(distRoot);
const staticPages = distFiles.filter((path) => extname(path).toLowerCase() === ".html" && !path.startsWith(join(distRoot, "downloads"))).length;
const publicJsonExports = distFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceNames = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name);
const sourceRecords = await Promise.all(sourceNames.map((name) => readJson(join(sourceRoot, name))));
const sourceCount = sourceNames.length;
const signalCount = (await readdir(signalRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).length;
const researchDocumentCount = (await readdir(researchDocumentRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const endpointFieldByAccessType = new Map([["API", "api_url"], ["RSS Feed", "feed_url"], ["Data Download", "data_download_url"], ["Docket Search", "docket_search_url"], ["Filing System", "api_url"]]);
const sourceHealth = sourceRecords.map((record) => {
  const accessType = record.live_access_type ?? "Manual Page Check";
  const endpointField = endpointFieldByAccessType.get(accessType);
  const probeReady = endpointField && (record[endpointField] || (accessType === "Filing System" && record.docket_search_url));
  return probeReady ? "Probe ready" : "Manual review";
});
const sourceHealthManualReview = sourceHealth.filter((state) => state === "Manual review").length;
const sourceHealthProbeReady = sourceHealth.filter((state) => state === "Probe ready").length;
assert(staticPages >= receipt.metrics.whole_site_snapshot.html_pages_excluding_downloads && publicJsonExports >= receipt.metrics.whole_site_snapshot.top_level_data_json_exports, "Current build inventory is below the Phase 172 validation snapshot.");

manifest.generated_date = aggregate.effective_date;
manifest.build_id = "ftfn-v0.9-plus-v1rc-plus-v1month-plus-v1cycle";
manifest.expected_build.static_pages = staticPages;
manifest.expected_build.public_json_exports = publicJsonExports;
manifest.expected_build.updates = updateCount;
manifest.expected_build.sources = sourceCount;
manifest.expected_build.v1cycle_public_html_routes = 90;
manifest.expected_build.v1cycle_public_json_exports = 9;
for (const phase of phases) for (const [key, value] of Object.entries(phase.counts ?? {})) manifest.expected_build[`phase_${phase.phase}_${key}`] = value;
manifest.v1cycle_public_html_routes = aggregate.public_html_routes;
manifest.v1cycle_public_json_exports = aggregate.public_json_exports;
manifest.phase_165_172_delta = {
  captured_date: aggregate.effective_date,
  phases_complete_locally: 8,
  release: "v1 September Evidence-to-Publication Cycle",
  primary_records: aggregate.counts.primary_records,
  public_html_routes_added: 90,
  public_json_exports_added: 9,
  publication_updates_added: 8,
  canonical_sources: sourceCount,
  phase_counts: Object.fromEntries(phases.map((phase) => [`phase_${phase.phase}`, phase.counts])),
  evidence_decisions_complete: phaseByNumber.get(165).counts.terminal_evidence_decisions,
  evidence_decision_receipt_id: phaseByNumber.get(165).current_decision_receipt.receipt_id,
  future_operations: phaseByNumber.get(165).counts.future_operations,
  future_desk_windows: phaseByNumber.get(166).counts.unique_desk_windows,
  authority_hearings_pending: phaseByNumber.get(167).counts.owner_actions_pending,
  adjudication_dockets_pending: phaseByNumber.get(168).counts.adjudication_dockets,
  observations_transferred: phaseByNumber.get(169).counts.observations_transferred,
  place_dossiers: phaseByNumber.get(170).counts.place_system_dossiers,
  compendium_records: phaseByNumber.get(171).counts.compendium_records,
  local_validation_receipt_id: receipt.receipt_id,
  local_validation_artifact_digest: receipt.artifact_digest,
  baseline_phase156_receipt_id: aggregate.baseline_v1rc.receipt_id,
  baseline_phase156_artifact_digest: aggregate.baseline_v1rc.artifact_digest,
  baseline_phase164_receipt_id: aggregate.baseline_v1month.receipt_id,
  baseline_phase164_artifact_digest: aggregate.baseline_v1month.artifact_digest,
  v1_promotion_state: "Held",
  owner_acceptance: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
};
manifest.phase_60c_september_1_result = {
  captured_date: "2026-09-01",
  cycle_item_id: starlinkCycleItem.cycle_item_id,
  propagation_proof_id: starlinkPropagationProof.proof_id,
  return_envelope_id: starlinkReturnEnvelope.envelope_id,
  update_id: starlinkPropagationProof.update_id,
  receipt_id: starlinkReceipt.receipt_id,
  receipt_artifact_digest: phaseByNumber.get(165).current_decision_receipt.artifact_digest,
  decision_status: starlinkCycleItem.decision_status,
  underlying_signal_status: "In Review",
  content_propagation_status: starlinkPropagationProof.content_propagation_status,
  git_backed_release_status: starlinkPropagationProof.git_backed_release_status,
  completed_cycle_decisions: phase60Cycle.operating_measures.completed_cycle_decisions,
  scheduled_cycle_gates: phase60Cycle.records.filter((record) => record.decision_status === "scheduled").length,
  terminal_return_decisions: phase67Returns.metrics.decisions_completed,
  release_verified_return_envelopes: phase67Returns.envelope_records.filter((record) => record.envelope_state === "Release Verified").length,
  git_held_return_envelopes: phase67Returns.envelope_records.filter((record) => record.envelope_state === "Propagation Complete — Git Held").length,
  scheduled_return_envelopes: phase67Returns.envelope_records.filter((record) => record.envelope_state === "Scheduled").length,
  official_surfaces_checked: starlinkReceipt.official_surface_checks.length,
  next_public_surface_recheck: starlinkCycleItem.next_check_date,
  next_scheduled_cycle_gate: "2026-09-09",
  phase_61_named_file_transfer: false,
  local_release_validated: true,
  owner_acceptance: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
};
manifest.phase_67_delta = {
  ...manifest.phase_67_delta,
  operational_receipts_created: 3,
  completed_operational_checks: 3,
  remaining_scheduled_envelopes: 10,
  deployment_status: "wave-60c-september-1-gate-locally-release-validated-owner-only-deployment-pending-phase-57w-version-79-remains-live",
};
manifest.v1_september_evidence_cycle = {
  content_version: aggregate.version,
  effective_date: aggregate.effective_date,
  local_cycle_verified: true,
  validation_receipt_id: receipt.receipt_id,
  artifact_digest: receipt.artifact_digest,
  evidence_decision_receipt_id: phaseByNumber.get(165).current_decision_receipt.receipt_id,
  readiness_gate_state: { passed: p172.counts.passed, held: p172.counts.held, pending_build: p172.counts.pending_build },
  next_lawful_calendar_date: "2026-09-06",
  evidence_cycle_close_date: "2026-10-09",
  v1_promotion: "Held",
  owner_acceptance: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
  custom_domain_attached: false,
  dns_changed: false,
};

const commands = ["npm run test:v1cycle", "npm run verify:v1cycle"];
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !commands.includes(command));
const verifyIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(verifyIndex < 0 ? manifest.predeploy_commands.length : verifyIndex, 0, ...commands);
manifest.required_output_files = unique([...manifest.required_output_files, ...aggregate.public_html_routes.map(routeToOutput), ...aggregate.public_json_exports.map(exportToOutput)]).sort();
const inventoryGate = `Confirm ${staticPages.toLocaleString("en-US")} generated HTML pages, ${publicJsonExports} top-level public JSON exports, ${updateCount} update records and all required outputs`;
const cycleGates = [
  "Confirm the Phase 165–172 cycle publishes exactly 90 unique HTML routes, nine schema-1.0 JSON exports, and eight dated updates",
  "Confirm the exact immutable Phase 156 and Phase 164 receipts and digests remain bound",
  "Confirm the September 1 Louisiana Starlink decision is No Material Change and does not infer adoption, non-adoption, service availability, success, or failure",
  "Confirm nine later operations, sixty-eight desk windows, four editions, twelve authority hearings, and twenty-four adjudication dockets retain lawful future or owner-gated state",
  "Confirm the longitudinal layer transfers zero observations and the place/compendium layers create no stage, causal result, score, or rank",
  "Confirm Phase 172 remains 7 Pass / 7 Held / 0 Pending with GitHub publication, hosting, launch, and v1 promotion unauthorized",
];
manifest.release_gates = unique([
  ...manifest.release_gates.filter((gate) => !/^Confirm [\d,]+ generated HTML pages, \d+ top-level public JSON exports, \d+ update records and all required outputs$/.test(gate) && !gate.startsWith("Confirm the Phase 165–172 cycle") && !gate.startsWith("Confirm the exact immutable Phase 156 and Phase 164") && !gate.startsWith("Confirm the September 1 Louisiana Starlink") && !gate.startsWith("Confirm nine later operations") && !gate.startsWith("Confirm the longitudinal layer") && !gate.startsWith("Confirm Phase 172 remains")),
  inventoryGate, ...cycleGates,
]);
manifest.last_verified = {
  ...manifest.last_verified,
  date: aggregate.effective_date,
  candidate_validation: "passed-v1cycle-phases-165-172-local-only",
  validate_content: `passed-${sourceCount}-sources-${signalCount}-signals-${researchDocumentCount}-research-documents`,
  source_health: "passed",
  source_health_manual_review: sourceHealthManualReview,
  source_health_probe_ready: sourceHealthProbeReady,
  astro_check: "passed",
  build: "passed",
  static_pages_built: staticPages,
  release_assertions: "passed-through-phase-172-plus-september-1-phase-60c-operating-decision-v1-held",
  preview_qa: "Phases 165–172 and the canonical September 1 Phase 60C decision are locally validated; ten cycle gates, future calendar work, and owner decisions remain Held, and repository publication, hosting, public launch, and v1 promotion remain unauthorized",
};
const limitations = [
  `${phaseByNumber.get(165).counts.future_operations} evidence operations remain future after the September 1 bounded decision; no later result is predated.`,
  `${phaseByNumber.get(166).counts.unique_desk_windows} desk windows and four editions remain time-gated.`,
  "Twelve authority hearings, eighteen requirement decisions, six mission decisions, and the zero-series boundary require explicit owner receipts.",
  "The fifteen-place atlas creates no synthetic place stage, and the compendium creates no new evidence admission, comparison verdict, score, or rank.",
  "The Phase 172 receipt validates local artifacts only; it does not authorize GitHub publication, hosting, DNS, public launch, or v1 promotion.",
];
manifest.known_limitations = unique([...manifest.known_limitations.filter((note) => !note.endsWith("evidence operations remain future after the September 1 bounded decision; no later result is predated.") && !note.includes("desk windows and four editions remain time-gated") && !note.startsWith("Twelve authority hearings, eighteen requirement") && !note.startsWith("The fifteen-place atlas creates") && !note.startsWith("The Phase 172 receipt validates local artifacts only")), ...limitations]);
manifest.notes = unique([...manifest.notes.filter((note) => !note.startsWith("Phases 165–172 add the September evidence-to-publication cycle")), `Phases 165–172 add the September evidence-to-publication cycle with 90 routes, nine exports, one lawful No Material Change receipt, a complete fifteen-place atlas, and a twelve-record compendium; future and owner work remains Held.`]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 172 manifest: ${staticPages} pages, ${publicJsonExports} exports, ${sourceCount} sources, ${updateCount} updates, 90 v1cycle routes, nine v1cycle exports, and v1 Held.`);
