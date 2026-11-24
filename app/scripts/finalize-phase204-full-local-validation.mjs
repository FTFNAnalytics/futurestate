import { spawnSync } from "node:child_process";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  canonicalV1refJson,
  computeV1refCandidateDigest,
  isValidV1refValidationReceipt,
  sha256V1ref,
  v1refValidationScope,
  v1refValidatorContractVersion,
} from "./lib/v1ref-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const sourcesRoot = join(appRoot, "src", "content", "sources");
const distRoot = join(appRoot, "dist");
const receiptRoot = join(dataRoot, "phase-204-receipts");
const aggregatePath = join(dataRoot, "v1-public-reference-edition.json");
const phase204Path = join(dataRoot, "phase-204-v1-public-reference-edition-promotion-gate.json");
const edmontonDate = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const validationDate = process.env.FTFN_EFFECTIVE_DATE ?? edmontonDate;
if (!/^\d{4}-\d{2}-\d{2}$/.test(validationDate) || validationDate < edmontonDate) throw new Error(`Validation must use the current or later America/Edmonton date; received ${validationDate}, current ${edmontonDate}.`);
if (validationDate > edmontonDate && process.env.FTFN_ALLOW_FUTURE_DATE !== "1") throw new Error(`Refusing future validation date ${validationDate}.`);

const runNpmScript = (script) => {
  console.log(`\n> npm run ${script}`);
  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", `npm.cmd run ${script}`] : ["run", script];
  const run = spawnSync(command, args, { cwd: appRoot, stdio: "inherit", shell: false });
  if (run.error || run.status !== 0) throw new Error(`npm run ${script} failed (${run.error?.message ?? `exit ${run.status}`}); no full Phase 181–204 receipt was written.`);
};

const validationScripts = [
  "validate:candidates", "validate:content", "source:health",
  "test:v1rc", "test:v1month", "test:v1cycle", "test:v1oct", "test:v1ref",
  "test:phase58", "verify:phase58", "verify:phase59", "verify:phase60", "verify:phase60c", "verify:phase61", "test:phase67", "verify:phase67",
  "current:test", "check", "build", "verify:v1rc", "verify:v1month", "verify:v1cycle", "verify:v1oct", "current:verify",
  "verify:release",
];
for (const script of validationScripts) runNpmScript(script);

const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const collectFiles = async (root) => {
  const files = [];
  const visit = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path); else if (entry.isFile()) files.push(path);
    }
  };
  await visit(root);
  return files;
};
const isInside = (parent, path) => {
  const candidate = relative(parent, path);
  return candidate !== "" && !candidate.startsWith("..") && !isAbsolute(candidate);
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const aggregate = await readJson(aggregatePath);
const phase204 = await readJson(phase204Path);
assert(
  aggregate.program_id === "FTFN-V1-PUBLIC-REFERENCE-EDITION"
  && aggregate.schema_version === "1.0"
  && aggregate.version === "v1ref",
  "The Phase 181–204 aggregate identity is invalid.",
);
assert(
  aggregate.counts?.phases === 24
  && aggregate.counts?.primary_records === 1048
  && aggregate.counts?.public_html_routes === 3216
  && aggregate.counts?.detail_routes === 1048
  && aggregate.counts?.native_declared_routes === 1071
  && aggregate.counts?.immutable_edition_routes === 1073
  && aggregate.counts?.canonical_reference_routes === 1073
  && aggregate.counts?.public_json_exports === 25
  && aggregate.counts?.publication_updates === 24,
  "The Phase 181–204 candidate inventory is not the exact 24 / 1,048 / 3,216 / 25 / 24 contract.",
);
assert(aggregate.public_html_routes.length === 3216 && new Set(aggregate.public_html_routes).size === 3216, "The candidate must declare exactly 3,216 unique HTML routes.");
assert(Object.keys(aggregate.canonical_route_map ?? {}).length === 3216 && aggregate.public_html_routes.every((route) => Boolean(aggregate.canonical_route_map[route])), "Every public HTML route must have one explicit canonical mapping.");
assert(aggregate.canonical_html_routes?.length === 1073 && new Set(aggregate.canonical_html_routes).size === 1073 && aggregate.canonical_html_routes.every((route) => route.startsWith("/reference/")), "The candidate must declare exactly 1,073 unique canonical reference routes.");
assert(aggregate.canonical_route_map?.["/reference/"] === "/reference/" && aggregate.canonical_route_map?.["/review/v1ref/"] === "/reference/", "The stable reference root must self-canonicalize and the immutable root must point to it.");
assert(aggregate.public_json_exports.length === 25 && new Set(aggregate.public_json_exports).size === 25, "The candidate must declare exactly 25 unique public JSON exports.");
assert(aggregate.publication_update_files.length === 24 && new Set(aggregate.publication_update_files).size === 24, "The candidate must declare exactly 24 unique publication updates.");
assert(phase204.counts?.promotion_gates === 16 && phase204.counts?.passed === 9 && phase204.counts?.held === 7 && phase204.counts?.false_passes === 0, "Phase 204 must remain 9 Pass / 7 Held / 0 false passes across sixteen gates.");
assert(phase204.v1_public_reference_promotion_state === "Held" && Object.values(phase204.owner_authority ?? {}).every((value) => value === false), "Phase 204 overstates promotion or owner authority.");
assert(aggregate.v1_promotion_state === "Held" && aggregate.owner_acceptance === false && aggregate.github_publication_authorized === false && aggregate.hosted_deployment_authorized === false && aggregate.public_launch_authorized === false, "The aggregate overstates owner, repository, hosting, launch, or v1 authority.");
assert(Boolean(aggregate.baseline_phase180?.receipt_id) && Boolean(aggregate.baseline_phase180?.artifact_digest) && aggregate.baseline_phase180?.v1_promotion_state === "Held", "The immutable Phase 180 receipt/digest binding is missing or its v1 hold changed.");

const candidateDigest = await computeV1refCandidateDigest({ appRoot, aggregate });
if (aggregate.local_validation_receipt) assert(isValidV1refValidationReceipt({ receipt: aggregate.local_validation_receipt, aggregate, candidateDigest }), "The aggregate embeds a stale or invalid full validation receipt.");

const allFiles = await collectFiles(distRoot);
const htmlCount = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(join(distRoot, "downloads"), path)).length;
const jsonCount = allFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updatesRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceCount = (await readdir(sourcesRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
for (const route of aggregate.public_html_routes) {
  const output = join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
  assert(await exists(output), `Missing built route ${route}.`);
}
for (const route of aggregate.public_json_exports) assert(await exists(join(distRoot, route.replace(/^\//, ""))), `Missing built export ${route}.`);

const metrics = {
  validated_phase_range: "181–204",
  phase_count: 24,
  primary_records: 1048,
  public_html_routes: 3216,
  structurally_auditable_html_routes: 3216,
  native_declared_routes: 1071,
  immutable_edition_routes: 1073,
  canonical_reference_routes: 1073,
  canonical_index_routes: 1073,
  public_json_exports: 25,
  schema_1_0_public_json_exports: 25,
  publication_updates: 24,
  candidate_artifacts: candidateDigest.artifact_count,
  candidate_artifact_manifest_digest: candidateDigest.artifact_manifest_digest,
  baseline_phase180_receipt_id: aggregate.baseline_phase180.receipt_id,
  baseline_phase180_artifact_digest: aggregate.baseline_phase180.artifact_digest,
  phase204_wave_receipt_id: aggregate.phase_204_wave_validation_receipt?.receipt_id ?? null,
  whole_site_snapshot: {
    html_pages_excluding_downloads: htmlCount,
    top_level_data_json_exports: jsonCount,
    update_entries_rendered: updateCount,
    canonical_source_records: sourceCount,
  },
};
const commandChecks = validationScripts.map((script) => ({ check_id: `npm-run-${script.replaceAll(":", "-")}`, status: "Passed", detail: `npm run ${script}` }));
const validationBundleDigest = sha256V1ref(canonicalV1refJson({ contract: v1refValidatorContractVersion, candidate_digest: candidateDigest, metrics, commands: validationScripts }));
const receipt = {
  schema_version: "1.0",
  receipt_id: `204-FULL-LOCAL-VALIDATION-${validationDate}-${validationBundleDigest.slice(0, 12)}`,
  receipt_type: "Full local reference validation",
  phase: 204,
  validated_phase_range: "181–204",
  effective_date: aggregate.effective_date,
  validated_date: validationDate,
  validated_at: new Date().toISOString(),
  status: "Passed",
  validation_result: "Passed local Phase 181–204 public-reference candidate checks",
  validator_contract_version: v1refValidatorContractVersion,
  scope: v1refValidationScope,
  artifact_digest_algorithm: "sha256",
  artifact_digest_contract: "SHA-256 over the exact Phase 181–204 registries, work packages, dated updates, integrated route code, social card, and normalized aggregate. Receipt-derived aggregate fields are normalized so the immutable receipt cannot hash itself.",
  artifact_digest: candidateDigest.digest,
  artifact_manifest_digest: candidateDigest.artifact_manifest_digest,
  validation_bundle_digest: validationBundleDigest,
  phase_count: 24,
  primary_records: 1048,
  public_html_routes: 3216,
  public_json_exports: 25,
  publication_updates: 24,
  metrics,
  checks: [
    { check_id: "immutable-phase180-baseline", status: "Passed", detail: `${aggregate.baseline_phase180.receipt_id} / ${aggregate.baseline_phase180.artifact_digest}` },
    { check_id: "exact-reference-inventory", status: "Passed", detail: "24 phases / 1,048 records / 3,216 routes / 25 exports / 24 updates" },
    { check_id: "future-evidence-boundary", status: "Passed", detail: "No future source return, outcome value, trend, causal conclusion, score, or rank admitted" },
    { check_id: "owner-publication-boundary", status: "Passed", detail: "Owner acceptance, translation/expert approval, repository publication, hosting, launch, and v1 promotion remain Held or false" },
    ...commandChecks,
  ],
  evidence_admission_authorized: false,
  owner_acceptance: false,
  translation_approval: false,
  expert_review_approval: false,
  github_publication_authorized: false,
  hosted_deployment_authorized: false,
  public_launch_authorized: false,
  v1_promotion_state: "Held",
  next_action: "Rebuild the aggregate to embed this receipt, rebuild and verify deterministic output, update the deployment manifest, and continue only due evidence and owner gates on their lawful dates.",
};
assert(isValidV1refValidationReceipt({ receipt, aggregate, candidateDigest }), "The generated full Phase 181–204 receipt failed its own contract.");

await mkdir(receiptRoot, { recursive: true });
const receiptPath = join(receiptRoot, `${receipt.receipt_id}.json`);
let archivedReceipt = receipt;
try {
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
} catch (error) {
  if (error?.code !== "EEXIST") throw error;
  archivedReceipt = await readJson(receiptPath);
  assert(isValidV1refValidationReceipt({ receipt: archivedReceipt, aggregate, candidateDigest }), `Receipt archive collision at ${receiptPath}.`);
  console.log(`Reusing immutable full Phase 181–204 receipt ${archivedReceipt.receipt_id}.`);
}

const rebuild = spawnSync(process.execPath, ["./scripts/build-v1-public-reference-edition.mjs"], { cwd: appRoot, stdio: "inherit", shell: false });
if (rebuild.error || rebuild.status !== 0) throw new Error(`The receipt was archived, but rebuilding the v1 reference aggregate failed (${rebuild.error?.message ?? `exit ${rebuild.status}`}).`);
const rebuiltAggregate = await readJson(aggregatePath);
const rebuiltDigest = await computeV1refCandidateDigest({ appRoot, aggregate: rebuiltAggregate });
assert(rebuiltDigest.digest === candidateDigest.digest, "Embedding the receipt changed the normalized candidate digest.");
assert(isValidV1refValidationReceipt({ receipt: rebuiltAggregate.local_validation_receipt, aggregate: rebuiltAggregate, candidateDigest: rebuiltDigest }), "The rebuilt aggregate did not embed a current full validation receipt.");
assert(rebuiltAggregate.v1_promotion_state === "Held" && rebuiltAggregate.github_publication_authorized === false && rebuiltAggregate.hosted_deployment_authorized === false && rebuiltAggregate.public_launch_authorized === false, "The rebuilt aggregate changed an owner/publication hold.");

console.log(`Created and embedded immutable full Phase 181–204 local-validation receipt ${rebuiltAggregate.local_validation_receipt.receipt_id}; artifact digest ${rebuiltAggregate.local_validation_receipt.artifact_digest}. Run npm run build, npm run verify:v1ref, then npm run update:v1ref-manifest to refresh the production snapshot.`);
