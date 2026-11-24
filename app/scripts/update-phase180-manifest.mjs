import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  computeV1octDigestFromDisk,
  isValidV1octValidationReceipt,
  v1octPhases,
  v1octSourceNames,
} from "./lib/v1oct-candidate-digest.mjs";

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
  "phase-173-september-closeout-october-opening-ledger.json",
  "phase-174-evidence-cycle-closure-intake.json",
  "phase-175-owner-disposition-sprint-ii.json",
  "phase-176-longitudinal-admission-and-zero-series-decision.json",
  "phase-177-october-stack-watch-and-source-currency-sweep.json",
  "phase-178-systems-atlas-and-compendium-depth-expansion.json",
  "phase-179-october-weekly-editions-and-month-end-synthesis.json",
  "phase-180-october-state-report-and-v1-promotion-gate.json",
];
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
const aggregate = await readJson(join(dataRoot, "v1-october-operating-program.json"));
const phases = await Promise.all(phaseFiles.map((name) => readJson(join(dataRoot, name))));
const phaseByNumber = new Map(phases.map((phase) => [phase.phase, phase]));
const p180 = phaseByNumber.get(180);
const receipt = p180.local_validation_receipt;
const candidateDigest = await computeV1octDigestFromDisk({ dataRoot, updatesRoot: updateRoot, sourcesRoot: sourceRoot });

assert(manifest.package_version === "0.9.0" && manifest.content_version === "0.9", "v0.9 must remain controlling while v1 is Held.");
assert(phases.every((phase, index) => phase.phase === v1octPhases[index]), "Phase 173–180 inventory is incomplete or out of order.");
assert(aggregate.program_id === "FTFN-V1-OCTOBER-OPERATING-PROGRAM" && aggregate.schema_version === "1.0", "The v1oct aggregate identity is invalid.");
assert(
  aggregate.counts?.primary_records === 267 &&
  aggregate.public_html_routes?.length === 260 && new Set(aggregate.public_html_routes).size === 260 &&
  aggregate.public_json_exports?.length === 9 && new Set(aggregate.public_json_exports).size === 9 &&
  aggregate.publication_update_files?.length === 8 && new Set(aggregate.publication_update_files).size === 8 &&
  aggregate.counts?.new_source_profiles === 10,
  "The v1oct inventory must remain exactly 267 records / 260 routes / 9 exports / 8 updates / 10 source profiles.",
);
assert((await Promise.all(v1octSourceNames.map((name) => exists(join(sourceRoot, name))))).every(Boolean), "One or more bound v1oct source profiles are missing.");
assert(isValidV1octValidationReceipt({ receipt, aggregate, candidateDigest }), "Phase 180 lacks a current digest-matching receipt.");
assert(
  p180.counts?.passed === 8 && p180.counts?.held === 8 && p180.counts?.pending_build === 0 && p180.counts?.false_passes === 0 &&
  p180.v1_promotion_state === "Held" && aggregate.v1_promotion_state === "Held" &&
  Object.values(p180.owner_authority ?? {}).every((value) => value === false),
  "Phase 180 must be 8 Pass / 8 Held / 0 Pending / 0 false passes and preserve every owner/publication hold.",
);
assert(JSON.stringify(receipt) === JSON.stringify(aggregate.local_validation_receipt), "Phase 180 and aggregate receipts differ.");
assert(
  aggregate.baseline_v1rc?.receipt_id === "156-LOCAL-VALIDATION-2026-08-31-a750bba9528e" &&
  aggregate.baseline_v1rc?.artifact_digest === "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a" &&
  aggregate.baseline_v1month?.receipt_id === "164-LOCAL-VALIDATION-2026-09-01-d2846dc22604" &&
  aggregate.baseline_v1month?.artifact_digest === "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19" &&
  aggregate.baseline_v1cycle?.receipt_id === "172-LOCAL-VALIDATION-2026-09-01-65326aad9d30" &&
  aggregate.baseline_v1cycle?.artifact_digest === "cdf822b6451e02523dbdcadfc0f21470011285033de55c919718785aaffd9b34",
  "The immutable Phase 156, 164, or 172 baseline binding changed.",
);

const distFiles = await collectFiles(distRoot);
const staticPages = distFiles.filter((path) => extname(path).toLowerCase() === ".html" && !path.startsWith(join(distRoot, "downloads"))).length;
const publicJsonExports = distFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceNames = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => entry.name);
const sourceRecords = await Promise.all(sourceNames.map((name) => readJson(join(sourceRoot, name))));
const sourceCount = sourceNames.length;
const signalCount = (await readdir(signalRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".mdx")).length;
const researchDocumentCount = (await readdir(researchDocumentRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const builtAggregate = await readJson(exportToBuiltPath("/data/v1-october-operating-program.json"));
assert(JSON.stringify(builtAggregate) === JSON.stringify(aggregate), "The built v1oct aggregate differs from its source.");
for (const route of aggregate.public_html_routes) assert(await exists(routeToBuiltPath(route)), `Missing built route ${route}.`);
for (const route of aggregate.public_json_exports) assert(await exists(exportToBuiltPath(route)), `Missing built export ${route}.`);
assert(
  staticPages >= receipt.metrics.whole_site_snapshot.html_pages_excluding_downloads &&
  publicJsonExports >= receipt.metrics.whole_site_snapshot.top_level_data_json_exports,
  "Current build inventory is below the Phase 180 validation snapshot.",
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
manifest.build_id = "ftfn-v0.9-plus-v1rc-plus-v1month-plus-v1cycle-plus-v1oct";
Object.assign(manifest.expected_build, {
  static_pages: staticPages,
  public_json_exports: publicJsonExports,
  updates: updateCount,
  sources: sourceCount,
  v1oct_primary_records: 267,
  v1oct_public_html_routes: 260,
  v1oct_public_json_exports: 9,
  v1oct_publication_updates: 8,
  v1oct_source_profiles_bound: 10,
});
for (const phase of phases) for (const [key, value] of Object.entries(phase.counts ?? {})) manifest.expected_build[`phase_${phase.phase}_${key}`] = value;
manifest.v1oct_public_html_routes = aggregate.public_html_routes;
manifest.v1oct_public_json_exports = aggregate.public_json_exports;
manifest.phase_173_180_delta = {
  captured_date: aggregate.effective_date,
  phases_complete_locally: 8,
  release: "v1 October Operating Program",
  primary_records: 267,
  public_html_routes_added: 260,
  public_json_exports_added: 9,
  publication_updates_added: 8,
  source_profiles_bound: 10,
  canonical_sources: sourceCount,
  phase_counts: Object.fromEntries(phases.map((phase) => [`phase_${phase.phase}`, phase.counts])),
  local_validation_receipt_id: receipt.receipt_id,
  local_validation_artifact_digest: receipt.artifact_digest,
  baseline_phase156_receipt_id: aggregate.baseline_v1rc.receipt_id,
  baseline_phase156_artifact_digest: aggregate.baseline_v1rc.artifact_digest,
  baseline_phase164_receipt_id: aggregate.baseline_v1month.receipt_id,
  baseline_phase164_artifact_digest: aggregate.baseline_v1month.artifact_digest,
  baseline_phase172_receipt_id: aggregate.baseline_v1cycle.receipt_id,
  baseline_phase172_artifact_digest: aggregate.baseline_v1cycle.artifact_digest,
  v1_promotion_state: "Held",
  owner_acceptance: false,
  github_publication_authorized: false,
  github_published: false,
  hosted_deployment_authorized: false,
  hosted: false,
  public_launch_authorized: false,
};
manifest.v1_october_operating_program = {
  content_version: aggregate.version,
  effective_date: aggregate.effective_date,
  local_operating_program_verified: true,
  validation_receipt_id: receipt.receipt_id,
  artifact_digest: receipt.artifact_digest,
  readiness_gate_state: { passed: p180.counts.passed, held: p180.counts.held, pending_build: p180.counts.pending_build },
  primary_records: 267,
  public_html_routes: 260,
  public_json_exports: 9,
  publication_updates: 8,
  source_profiles_bound: 10,
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

const commands = ["npm run test:v1oct", "npm run verify:v1oct"];
manifest.predeploy_commands = manifest.predeploy_commands.filter((command) => !commands.includes(command));
const verifyIndex = manifest.predeploy_commands.indexOf("npm run verify:release");
manifest.predeploy_commands.splice(verifyIndex < 0 ? manifest.predeploy_commands.length : verifyIndex, 0, ...commands);
manifest.required_output_files = unique([
  ...manifest.required_output_files,
  ...aggregate.public_html_routes.map(routeToOutput),
  ...aggregate.public_json_exports.map(exportToOutput),
]).sort();
const inventoryGate = `Confirm ${staticPages.toLocaleString("en-US")} generated HTML pages, ${publicJsonExports} top-level public JSON exports, ${updateCount} update records and all required outputs`;
const octoberGates = [
  "Confirm the Phase 173–180 program publishes exactly 267 primary records, 260 unique HTML routes, nine schema-1.0 JSON exports, eight dated updates, and ten bound source profiles",
  "Confirm the exact immutable Phase 156, Phase 164, and Phase 172 receipts and digests remain bound",
  "Confirm 83 September calendar records, ten Cycle 001 items, and five October editorial decisions remain future at the September 1 cutoff",
  "Confirm thirty-seven owner-controlled actions and twenty-one governed longitudinal decisions retain null outcomes with zero observations transferred",
  "Confirm all October source findings remain null and the atlas and compendium create no causal verdict, stage, score, or rank",
  "Confirm Phase 180 remains 8 Pass / 8 Held / 0 Pending with GitHub publication, hosting, launch, and v1 promotion unauthorized",
];
manifest.release_gates = unique([
  ...manifest.release_gates.filter((gate) =>
    !/^Confirm [\d,]+ generated HTML pages, \d+ top-level public JSON exports, \d+ update records and all required outputs$/.test(gate) &&
    !gate.startsWith("Confirm the Phase 173–180 program") &&
    !gate.startsWith("Confirm the exact immutable Phase 156, Phase 164, and Phase 172") &&
    !gate.startsWith("Confirm 83 September calendar records") &&
    !gate.startsWith("Confirm thirty-seven owner-controlled actions") &&
    !gate.startsWith("Confirm all October source findings") &&
    !gate.startsWith("Confirm Phase 180 remains")
  ),
  inventoryGate,
  ...octoberGates,
]);
manifest.last_verified = {
  ...manifest.last_verified,
  date: aggregate.effective_date,
  candidate_validation: "passed-v1oct-phases-173-180-local-only",
  validate_content: `passed-${sourceCount}-sources-${signalCount}-signals-${researchDocumentCount}-research-documents`,
  source_health: "passed",
  source_health_manual_review: sourceHealth.filter((state) => state === "Manual review").length,
  source_health_probe_ready: sourceHealth.filter((state) => state === "Probe ready").length,
  astro_check: "passed",
  build: "passed",
  static_pages_built: staticPages,
  release_assertions: "passed-through-phase-180-accelerated-october-program-v1-held",
  preview_qa: "Phases 173–180 are locally validated; all future calendar work, owner decisions, external publication, and v1 promotion remain Held",
};
const limitations = [
  "Eighty-three September calendar records and ten Cycle 001 items remain future at the September 1 cutoff; no later result is predated.",
  "Thirty-seven owner-controlled actions and twenty-one governed longitudinal decisions remain unresolved; zero observations were transferred.",
  "Five October editorial decisions and every October source-currency finding remain null until their lawful cutoffs or review dates.",
  "The Phase 180 receipt validates local artifacts only; it does not authorize GitHub publication, hosting, DNS, public launch, or v1 promotion.",
];
manifest.known_limitations = unique([
  ...manifest.known_limitations.filter((note) =>
    !note.startsWith("Eighty-three September calendar records") &&
    !note.startsWith("Thirty-seven owner-controlled actions") &&
    !note.startsWith("Five October editorial decisions") &&
    !note.startsWith("The Phase 180 receipt validates local artifacts only")
  ),
  ...limitations,
]);
manifest.notes = unique([
  ...manifest.notes.filter((note) => !note.startsWith("Phases 173–180 add the accelerated October operating program")),
  "Phases 173–180 add the accelerated October operating program with 267 primary records, 260 routes, nine exports, eight updates, and ten official-source profiles; future and owner work remains Held.",
]);

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Updated Phase 180 manifest: ${staticPages} pages, ${publicJsonExports} exports, ${sourceCount} sources, ${updateCount} updates, 260 v1oct routes, nine v1oct exports, and v1 Held.`);
