import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1refCandidateDigest, isValidV1refValidationReceipt } from "./lib/v1ref-candidate-digest.mjs";
import { v1refPhaseDefinitions } from "./lib/v1ref-config.mjs";
import {verifyPublicJsonInventory, applyExportInventory} from './lib/public-json-inventory.mjs';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const signalRoot = join(appRoot, "src", "content", "signals");
const researchDocumentRoot = join(appRoot, "src", "content", "research-documents");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const collectFiles = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? collectFiles(path) : [path];
}))).flat();
const unique = (items) => [...new Set(items.filter(Boolean))];
const routeToOutput = (route) => `dist/${route.replace(/^\//, "").replace(/\/$/, "")}/index.html`;
const exportToOutput = (route) => `dist/${route.replace(/^\//, "")}`;
const routeToBuiltPath = (route) => join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
const exportToBuiltPath = (route) => join(distRoot, route.replace(/^\//, ""));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const manifest = await readJson(manifestPath);
const aggregate = await readJson(join(dataRoot, "v1-public-reference-edition.json"));
const phases = await Promise.all(v1refPhaseDefinitions.map(({ file }) => readJson(join(dataRoot, file))));
const phase204 = phases.at(-1);
const receipt = aggregate.local_validation_receipt;
const currentEditorial = await readJson(join(dataRoot, "phase-205-216-current-editorial.json"));
const operatingCycle = await readJson(join(dataRoot, "phase-60-operating-cycle.json"));
const candidateDigest = await computeV1refCandidateDigest({ appRoot, aggregate });

assert(manifest.package_version === "0.9.0" && manifest.content_version === "0.9", "v0.9 must remain controlling while v1 is Held.");
assert(phases.every((phase, index) => phase.phase === v1refPhaseDefinitions[index].phase), "The Phase 181–204 inventory is incomplete or out of order.");
assert(aggregate.program_id === "FTFN-V1-PUBLIC-REFERENCE-EDITION" && aggregate.schema_version === "1.0" && aggregate.version === "v1ref", "The v1 reference aggregate identity is invalid.");
assert(
  aggregate.counts?.phases === 24
  && aggregate.counts?.primary_records === 1048
  && aggregate.counts?.public_html_routes === 3216
  && aggregate.counts?.detail_routes === 1048
  && aggregate.counts?.native_declared_routes === 1071
  && aggregate.counts?.immutable_edition_routes === 1073
  && aggregate.counts?.canonical_reference_routes === 1073
  && aggregate.counts?.public_json_exports === 25
  && aggregate.counts?.publication_updates === 24
  && aggregate.public_html_routes?.length === 3216
  && new Set(aggregate.public_html_routes).size === 3216
  && Object.keys(aggregate.canonical_route_map ?? {}).length === 3216
  && aggregate.canonical_html_routes?.length === 1073
  && new Set(aggregate.canonical_html_routes).size === 1073
  && aggregate.public_json_exports?.length === 25
  && new Set(aggregate.public_json_exports).size === 25
  && aggregate.publication_update_files?.length === 24
  && new Set(aggregate.publication_update_files).size === 24,
  "The v1 reference inventory must remain exactly 24 phases / 1,048 records / 3,216 routes / 25 exports / 24 updates.",
);
assert(isValidV1refValidationReceipt({ receipt, aggregate, candidateDigest }), "The v1 reference aggregate lacks a current full digest-matching Phase 181–204 receipt.");
assert(aggregate.phase_204_wave_validation_receipt?.receipt_type === "Local candidate validation", "The bounded Phase 197–203 wave receipt is not preserved separately.");
assert(
  phase204.counts?.promotion_gates === 16
  && phase204.counts?.passed === 9
  && phase204.counts?.held === 7
  && phase204.counts?.false_passes === 0
  && phase204.v1_public_reference_promotion_state === "Held"
  && Object.values(phase204.owner_authority ?? {}).every((value) => value === false)
  && aggregate.v1_promotion_state === "Held"
  && aggregate.owner_acceptance === false
  && aggregate.github_publication_authorized === false
  && aggregate.hosted_deployment_authorized === false
  && aggregate.public_launch_authorized === false,
  "Phase 204 must remain 9 Pass / 7 Held / 0 false passes and preserve every owner/publication hold.",
);

const distFiles = await collectFiles(distRoot);
const staticPages = distFiles.filter((path) => extname(path).toLowerCase() === ".html" && !path.startsWith(join(distRoot, "downloads"))).length;
const declaredExports = await verifyPublicJsonInventory(appRoot, manifest);
const publicJsonExports = declaredExports.length;
applyExportInventory(manifest, declaredExports);
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceNames = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name);
const sourceRecords = await Promise.all(sourceNames.map((name) => readJson(join(sourceRoot, name))));
const sourceCount = sourceNames.length;
const signalCount = (await readdir(signalRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).length;
const researchDocumentCount = (await readdir(researchDocumentRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const builtAggregate = await readJson(exportToBuiltPath("/data/v1-public-reference-edition.json"));
assert(JSON.stringify(builtAggregate) === JSON.stringify(aggregate), "The built v1 reference aggregate differs from source.");
for (const route of aggregate.public_html_routes) assert(await exists(routeToBuiltPath(route)), `Missing built route ${route}.`);
for (const route of aggregate.public_json_exports) assert(await exists(exportToBuiltPath(route)), `Missing built export ${route}.`);
assert(
  staticPages >= receipt.metrics.whole_site_snapshot.html_pages_excluding_downloads
  && publicJsonExports >= receipt.metrics.whole_site_snapshot.top_level_data_json_exports,
  "The current build inventory is below the full Phase 181–204 validation snapshot.",
);

const endpointFieldByAccessType = new Map([
  ["API", "api_url"], ["RSS Feed", "feed_url"], ["Data Download", "data_download_url"],
  ["Docket Search", "docket_search_url"], ["Filing System", "api_url"],
]);
const sourceHealth = sourceRecords.map((record) => {
  const accessType = record.live_access_type ?? "Manual Page Check";
  const endpointField = endpointFieldByAccessType.get(accessType);
  return endpointField && (record[endpointField] || (accessType === "Filing System" && record.docket_search_url)) ? "Probe ready" : "Manual review";
});

manifest.generated_date = aggregate.effective_date;
manifest.build_id = "ftfn-v0.9-plus-v1rc-plus-v1month-plus-v1cycle-plus-v1oct-plus-v1ref";
Object.assign(manifest.expected_build, {
  static_pages: staticPages,
  public_json_exports: publicJsonExports,
  updates: updateCount,
  sources: sourceCount,
  v1ref_phases: 24,
  v1ref_primary_records: 1048,
  v1ref_public_html_routes: 3216,
  v1ref_public_json_exports: 25,
  v1ref_publication_updates: 24,
});
for (const phase of phases) for (const [key, value] of Object.entries(phase.counts ?? {})) manifest.expected_build[`phase_${phase.phase}_${key}`] = value;
manifest.v1ref_public_html_routes = aggregate.public_html_routes;
manifest.v1ref_public_json_exports = aggregate.public_json_exports;
manifest.phase_181_204_delta = {
  captured_date: aggregate.effective_date,
  phases_complete_locally: 24,
  release: "v1 Public Reference Edition candidate",
  primary_records: 1048,
  public_html_routes_added: 3216,
  native_declared_routes: 1071,
  immutable_edition_routes: 1073,
  canonical_reference_routes: 1073,
  canonical_index_routes: 1073,
  public_json_exports_added: 25,
  publication_updates_added: 24,
  canonical_sources: sourceCount,
  phase_counts: Object.fromEntries(phases.map((phase) => [`phase_${phase.phase}`, phase.counts])),
  local_validation_receipt_id: receipt.receipt_id,
  local_validation_artifact_digest: receipt.artifact_digest,
  local_validation_artifact_manifest_digest: receipt.artifact_manifest_digest,
  baseline_phase180_receipt_id: aggregate.baseline_phase180.receipt_id,
  baseline_phase180_artifact_digest: aggregate.baseline_phase180.artifact_digest,
  phase204_wave_receipt_id: aggregate.phase_204_wave_validation_receipt.receipt_id,
  promotion_gate_state: { passed: phase204.counts.passed, held: phase204.counts.held, false_passes: phase204.counts.false_passes },
  v1_promotion_state: "Held",
  owner_acceptance: false,
  translation_approval: false,
  expert_review_approval: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
};
manifest.v1_public_reference_edition = {
  content_version: aggregate.version,
  effective_date: aggregate.effective_date,
  local_reference_candidate_verified: true,
  validation_receipt_id: receipt.receipt_id,
  artifact_digest: receipt.artifact_digest,
  artifact_manifest_digest: receipt.artifact_manifest_digest,
  phases: 24,
  primary_records: 1048,
  public_html_routes: 3216,
  public_json_exports: 25,
  publication_updates: 24,
  readiness_gate_state: { passed: phase204.counts.passed, held: phase204.counts.held, false_passes: phase204.counts.false_passes },
  next_lawful_calendar_date: operatingCycle.records.map(record => record.next_check_date).filter(date => date && date >= receipt.validated_date).sort()[0] ?? null,
  evidence_cycle_close_date: "2026-10-09",
  v1_promotion: "Held",
  owner_acceptance: false,
  translation_approval: false,
  expert_review_approval: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
  custom_domain_attached: false,
  dns_changed: false,
};

const commands = ["npm run test:v1ref", "npm run verify:v1ref"];
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !commands.includes(command));
const verifyIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(verifyIndex < 0 ? manifest.predeploy_commands.length : verifyIndex, 0, ...commands);
manifest.required_output_files = unique([
  ...manifest.required_output_files,
  ...aggregate.public_html_routes.map(routeToOutput),
  ...aggregate.public_json_exports.map(exportToOutput),
]).sort();
const inventoryGate = `Confirm ${staticPages.toLocaleString("en-US")} generated HTML pages, ${publicJsonExports} top-level public JSON exports, ${updateCount} update records and all required outputs`;
const referenceGates = [
  "Confirm the Phase 181–204 public-reference candidate contains exactly 24 phases, 1,048 primary records, 3,216 unique HTML routes, 25 schema-1.0 JSON exports, and 24 dated updates",
  "Confirm all 1,071 declared native routes, 1,073 immutable v1ref routes, and 1,073 stable reference routes are rendered and canonicalized",
  "Confirm the exact immutable Phase 180 receipt and bounded Phase 204 wave receipt remain separately bound",
  "Confirm no future evidence, outcome value, trend, causal conclusion, score, rank, owner decision, translation approval, or expert approval has been invented",
  "Confirm Phase 204 remains 9 Pass / 7 Held / 0 false passes with repository publication, hosting, launch, and v1 promotion unauthorized",
];
manifest.release_gates = unique([
  ...manifest.release_gates.filter((gate) =>
    !/^Confirm [\d,]+ generated HTML pages, \d+ top-level public JSON exports, \d+ update records and all required outputs$/.test(gate)
    && !gate.startsWith("Confirm the Phase 181–204 public-reference candidate")
    && !gate.startsWith("Confirm all 1,071 declared native routes")
    && !gate.startsWith("Confirm the exact immutable Phase 180 receipt")
    && !gate.startsWith("Confirm no future evidence, outcome value")
    && !gate.startsWith("Confirm Phase 204 remains")
  ),
  inventoryGate,
  ...referenceGates,
]);
manifest.last_verified = {
  ...manifest.last_verified,
  date: receipt.validated_date,
  effective_content_date: aggregate.effective_date,
  candidate_validation: "passed-v1ref-phases-181-204-local-only",
  validate_content: `passed-${sourceCount}-sources-${signalCount}-signals-${researchDocumentCount}-research-documents`,
  source_health: "passed",
  source_health_manual_review: sourceHealth.filter((state) => state === "Manual review").length,
  source_health_probe_ready: sourceHealth.filter((state) => state === "Probe ready").length,
  astro_check: "passed",
  build: "passed",
  static_pages_built: staticPages,
  release_assertions: "passed-through-phase-204-full-public-reference-candidate-v1-held",
  preview_qa: "Local build and current projections verified; independent editorial/accessibility acceptance, future evidence, owner decisions, publication, hosting, launch and v1 promotion remain Held",
};
manifest.current_editorial_extension = {
  ...manifest.current_editorial_extension,
  as_of_date: currentEditorial.as_of_date,
  state: "Local build validated; editorial and release acceptance held",
  validated_date: receipt.validated_date,
  validation_receipt_id: receipt.receipt_id,
  reader_drafts: currentEditorial.records.length,
  independent_review_approvals: 0,
  source_commit: null,
  github_publication: false,
  hosted_deployment: false,
  phase_216_complete: false,
};
const limitations = [
  "The Phase 181–204 reference candidate organizes and expands inherited evidence without converting future acquisition slots into returned evidence or admitting synthetic outcomes, trends, causal conclusions, scores, or ranks.",
  "Accessible and multilingual edition contracts remain Held until real translation, expert-review, and accessibility approvals are received.",
  "Owner-controlled promotions, corrections, classifications, and evidence admissions remain unresolved unless an explicit dated receipt already exists.",
  "The full Phase 204 receipt validates local artifacts only; it does not authorize GitHub publication, hosting, DNS, public launch, or v1 promotion.",
];
manifest.known_limitations = unique([
  ...manifest.known_limitations.filter((note) =>
    !note.startsWith("The Phase 181–204 reference candidate organizes")
    && !note.startsWith("Accessible and multilingual edition contracts remain")
    && !note.startsWith("Owner-controlled promotions, corrections")
    && !note.startsWith("The full Phase 204 receipt validates local artifacts only")
  ),
  ...limitations,
]);
manifest.notes = unique([
  ...manifest.notes.filter((note) => !note.startsWith("Phases 181–204 add the public-reference candidate")),
  "Phases 181–204 add the public-reference candidate with 1,048 primary records, 3,216 routes, 25 exports, and 24 dated updates while preserving all evidence, owner, publication, hosting, launch, and v1 boundaries.",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 204 manifest: ${staticPages} pages, ${publicJsonExports} exports, ${sourceCount} sources, ${updateCount} updates, 3,216 v1ref routes, 25 v1ref exports, and v1 Held.`);
