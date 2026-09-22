import { spawnSync } from "node:child_process";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalJson, computeV1octDigestFromDisk, isValidV1octValidationReceipt, sha256, v1octValidationScope, v1octValidatorContractVersion } from "./lib/v1oct-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updatesRoot = join(appRoot, "src", "content", "updates");
const sourcesRoot = join(appRoot, "src", "content", "sources");
const distRoot = join(appRoot, "dist");
const receiptRoot = join(dataRoot, "phase-180-receipts");
const edmontonDate = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const validationDate = process.env.FTFN_EFFECTIVE_DATE ?? edmontonDate;
if (!/^\d{4}-\d{2}-\d{2}$/.test(validationDate) || validationDate < edmontonDate) throw new Error(`Validation must use the current or later America/Edmonton date; received ${validationDate}, current ${edmontonDate}.`);
if (validationDate > edmontonDate && process.env.FTFN_ALLOW_FUTURE_DATE !== "1") throw new Error(`Refusing future validation date ${validationDate}.`);

const commands = [
  "validate:candidates", "validate:content", "source:health",
  "test:v1rc", "test:v1month", "test:v1cycle", "test:v1oct",
  "test:phase58", "verify:phase58", "verify:phase60", "verify:phase60c", "test:phase67", "verify:phase67",
  "check", "build", "verify:v1rc", "verify:v1month", "verify:v1cycle"
];
const commandChecks = [];
for (const script of commands) {
  console.log(`\n> npm run ${script}`);
  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", `npm.cmd run ${script}`] : ["run", script];
  const run = spawnSync(command, args, { cwd: appRoot, stdio: "inherit", shell: false });
  if (run.error || run.status !== 0) throw new Error(`npm run ${script} failed (${run.error?.message ?? `exit ${run.status}`}); no Phase 180 receipt was written.`);
  commandChecks.push({ check_id: `npm-run-${script.replaceAll(":", "-")}`, status: "Passed", detail: `npm run ${script}` });
}

const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const collectFiles = async (root) => {
  const files = [];
  const visit = async (directory) => { for (const entry of await readdir(directory, { withFileTypes: true })) { const path = join(directory, entry.name); if (entry.isDirectory()) await visit(path); else if (entry.isFile()) files.push(path); } };
  await visit(root); return files;
};
const isInside = (parent, path) => { const candidate = relative(parent, path); return candidate !== "" && !candidate.startsWith("..") && !isAbsolute(candidate); };

const aggregate = await readJson(join(dataRoot, "v1-october-operating-program.json"));
const p180 = await readJson(join(dataRoot, "phase-180-october-state-report-and-v1-promotion-gate.json"));
if (p180.local_validation_receipt) throw new Error("Phase 180 already embeds a receipt. Rebuild the receipt-free normalized candidate before creating a new immutable receipt.");
if (p180.counts.passed !== 7 || p180.counts.held !== 8 || p180.counts.pending_build !== 1) throw new Error("Receipt-free Phase 180 must be 7 Pass / 8 Held / 1 Pending build.");
if (aggregate.counts.public_html_routes !== 260 || aggregate.counts.public_json_exports !== 9 || aggregate.counts.publication_updates !== 8 || aggregate.counts.primary_records !== 267) throw new Error("The Phase 180 candidate inventory is not 267/260/9/8.");
const candidateDigest = await computeV1octDigestFromDisk({ dataRoot, updatesRoot, sourcesRoot });
const allFiles = await collectFiles(distRoot);
const htmlCount = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(join(distRoot, "downloads"), path)).length;
const jsonCount = allFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updatesRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceCount = (await readdir(sourcesRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
for (const route of aggregate.public_html_routes) {
  const output = join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
  if (!(await exists(output))) throw new Error(`Missing built route ${route}.`);
}
for (const route of aggregate.public_json_exports) if (!(await exists(join(distRoot, route.replace(/^\//, ""))))) throw new Error(`Missing built export ${route}.`);

const metrics = {
  overlay_public_html_routes: 260,
  structurally_audited_overlay_routes: 260,
  overlay_public_json_exports: 9,
  schema_1_0_overlay_exports: 9,
  overlay_update_records: 8,
  primary_records: 267,
  source_profiles_bound: 10,
  baseline_phase156_receipt_id: aggregate.baseline_v1rc.receipt_id,
  baseline_phase156_artifact_digest: aggregate.baseline_v1rc.artifact_digest,
  baseline_phase164_receipt_id: aggregate.baseline_v1month.receipt_id,
  baseline_phase164_artifact_digest: aggregate.baseline_v1month.artifact_digest,
  baseline_phase172_receipt_id: aggregate.baseline_v1cycle.receipt_id,
  baseline_phase172_artifact_digest: aggregate.baseline_v1cycle.artifact_digest,
  whole_site_snapshot: { html_pages_excluding_downloads: htmlCount, top_level_data_json_exports: jsonCount, update_entries_rendered: updateCount, canonical_source_records: sourceCount }
};
const bundleDigest = sha256(canonicalJson({ contract: v1octValidatorContractVersion, candidateDigest, metrics }));
const receipt = {
  schema_version: "1.0",
  receipt_id: `180-LOCAL-VALIDATION-${validationDate}-${bundleDigest.slice(0, 12)}`,
  receipt_type: "Local Validation",
  phase: 180,
  effective_date: "2026-09-01",
  validated_date: validationDate,
  validated_at: new Date().toISOString(),
  status: "Passed",
  validation_result: "Passed local Phase 173–180 accelerated operating-program checks",
  validator_contract_version: v1octValidatorContractVersion,
  scope: v1octValidationScope,
  artifact_digest_algorithm: "sha256",
  artifact_digest_contract: "SHA-256 over nine normalized schema-1.0 Phase 173–180 exports, the exact 260-route and nine-export inventories, eight dated updates, and ten complete source profiles. Only receipt-derived Phase 180 fields are normalized.",
  artifact_digest: candidateDigest,
  validation_bundle_digest: bundleDigest,
  public_html_routes: 260,
  public_json_exports: 9,
  publication_updates: 8,
  source_profiles_bound: 10,
  metrics,
  checks: [
    { check_id: "immutable-baselines", status: "Passed", detail: "Exact Phase 156, 164, and 172 receipt/digest bindings preserved" },
    { check_id: "route-export-update-source-contract", status: "Passed", detail: "260 routes / 9 exports / 8 updates / 10 bound source profiles" },
    { check_id: "calendar-owner-boundary", status: "Passed", detail: "Future calendar and all owner decisions remain null or Held" },
    ...commandChecks
  ],
  evidence_admission_authorized: false,
  owner_acceptance: false,
  github_publication_authorized: false,
  hosted_deployment_authorized: false,
  public_launch_authorized: false,
  v1_promotion_state: "Held",
  next_action: "Embed this receipt, rebuild and verify deterministic output, update the manifest, then operate the September 6 desk closures only on their lawful date."
};
if (!isValidV1octValidationReceipt({ receipt, aggregate, candidateDigest })) throw new Error("The generated Phase 180 receipt failed its own contract.");
await mkdir(receiptRoot, { recursive: true });
const receiptPath = join(receiptRoot, `${receipt.receipt_id}.json`);
try { await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" }); }
catch (error) {
  if (error?.code !== "EEXIST") throw error;
  const existing = await readJson(receiptPath);
  if (!isValidV1octValidationReceipt({ receipt: existing, aggregate, candidateDigest })) throw new Error(`Receipt archive collision at ${receiptPath}.`);
  console.log(`Reusing immutable Phase 180 receipt ${existing.receipt_id}; artifact digest ${existing.artifact_digest}.`);
  process.exit(0);
}
console.log(`Created immutable Phase 180 local-validation receipt ${receipt.receipt_id}; artifact digest ${receipt.artifact_digest}.`);
