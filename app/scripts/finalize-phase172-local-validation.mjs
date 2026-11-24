import { spawnSync } from "node:child_process";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalJson, computeV1cycleDigestFromDisk, isValidV1cycleValidationReceipt, sha256, v1cyclePublicationDate, v1cycleValidationScope, v1cycleValidatorContractVersion } from "./lib/v1cycle-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const sourceRoot = join(appRoot, "src", "content", "sources");
const distRoot = join(appRoot, "dist");
const receiptRoot = join(dataRoot, "phase-172-receipts");
const aggregatePath = join(dataRoot, "v1-september-evidence-cycle.json");
const edmontonDate = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const validationDate = process.env.FTFN_EFFECTIVE_DATE ?? edmontonDate;
if (!/^\d{4}-\d{2}-\d{2}$/.test(validationDate) || validationDate < edmontonDate) throw new Error(`Validation must use the current or later America/Edmonton date; received ${validationDate}, current ${edmontonDate}.`);
if (validationDate > edmontonDate && process.env.FTFN_ALLOW_FUTURE_DATE !== "1") throw new Error(`Refusing future validation date ${validationDate}.`);

const commands = ["validate:candidates", "validate:content", "source:health", "test:v1rc", "test:v1month", "test:v1cycle", "check", "build", "verify:v1rc", "verify:v1month", "verify:v1cycle"];
const commandChecks = [];
for (const script of commands) {
  console.log(`\n> npm run ${script}`);
  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", `npm.cmd run ${script}`] : ["run", script];
  const run = spawnSync(command, args, { cwd: appRoot, stdio: "inherit", shell: false });
  if (run.error || run.status !== 0) {
    const detail = run.error ? run.error.message : `exit code ${run.status}`;
    throw new Error(`npm run ${script} failed (${detail}); no Phase 172 receipt was written.`);
  }
  commandChecks.push({ check_id: `npm-run-${script.replaceAll(":", "-")}`, status: "Passed", detail: `npm run ${script}` });
}

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
  await visit(root); return files;
};
const isInside = (parent, path) => { const candidate = relative(parent, path); return candidate !== "" && !candidate.startsWith("..") && !isAbsolute(candidate); };

const aggregate = await readJson(aggregatePath);
const phase172 = await readJson(join(dataRoot, "phase-172-september-state-report.json"));
const phase165 = await readJson(join(dataRoot, "phase-165-live-evidence-operations-cycle-001.json"));
const phase156 = await readJson(join(dataRoot, "phase-156-v1-launch-decision.json"));
const phase164 = await readJson(join(dataRoot, "phase-164-monthly-candidate-decision.json"));
const candidateDigest = await computeV1cycleDigestFromDisk({ dataRoot, updatesRoot: updateRoot });
if (aggregate.public_html_routes.length !== 90 || aggregate.public_json_exports.length !== 9 || aggregate.publication_update_files.length !== 8) throw new Error("The Phase 172 candidate inventory is not 90/9/8.");
if (phase172.counts.passed !== 6 || phase172.counts.held !== 7 || phase172.counts.pending_build !== 1) throw new Error("Receipt-free Phase 172 must be 6 Pass / 7 Held / 1 Pending build.");
if (phase156.local_validation_receipt.artifact_digest !== aggregate.baseline_v1rc.artifact_digest || phase164.local_validation_receipt.artifact_digest !== aggregate.baseline_v1month.artifact_digest) throw new Error("An immutable baseline binding changed.");
if (phase165.current_decision_receipt.receipt_id !== "receipt-60-louisiana-starlink-2026-09-01-no-material-change") throw new Error("The September 1 evidence receipt is missing.");

const allFiles = await collectFiles(distRoot);
const htmlCount = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(join(distRoot, "downloads"), path)).length;
const jsonCount = allFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
const sourceCount = (await readdir(sourceRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
for (const route of aggregate.public_html_routes) if (!(await exists(join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html")))) throw new Error(`Missing built route ${route}.`);
for (const route of aggregate.public_json_exports) if (!(await exists(join(distRoot, route.replace(/^\//, ""))))) throw new Error(`Missing built export ${route}.`);

const metrics = {
  overlay_public_html_routes: 90,
  structurally_audited_overlay_routes: 90,
  overlay_public_json_exports: 9,
  schema_1_0_overlay_exports: 9,
  overlay_update_records: 8,
  primary_records: aggregate.counts.primary_records,
  baseline_phase156_receipt_id: aggregate.baseline_v1rc.receipt_id,
  baseline_phase156_artifact_digest: aggregate.baseline_v1rc.artifact_digest,
  baseline_phase164_receipt_id: aggregate.baseline_v1month.receipt_id,
  baseline_phase164_artifact_digest: aggregate.baseline_v1month.artifact_digest,
  evidence_decision_receipt_id: phase165.current_decision_receipt.receipt_id,
  whole_site_snapshot: { html_pages_excluding_downloads: htmlCount, top_level_data_json_exports: jsonCount, update_entries_rendered: updateCount, canonical_source_records: sourceCount },
};
const bundleDigest = sha256(canonicalJson({ contract: v1cycleValidatorContractVersion, candidateDigest, metrics }));
const receipt = {
  schema_version: "1.0",
  receipt_id: `172-LOCAL-VALIDATION-${validationDate}-${bundleDigest.slice(0, 12)}`,
  receipt_type: "Local Validation",
  phase: 172,
  effective_date: v1cyclePublicationDate,
  validated_date: validationDate,
  validated_at: new Date().toISOString(),
  status: "Passed",
  validation_result: "Passed local Phase 165–172 evidence-to-publication-cycle checks",
  validator_contract_version: v1cycleValidatorContractVersion,
  scope: v1cycleValidationScope,
  artifact_digest_algorithm: "sha256",
  artifact_digest_contract: "SHA-256 over the normalized nine schema-1.0 Phase 165–172 exports, exact ninety-route inventory, and eight dated updates. Only receipt-derived Phase 172 fields are normalized; evidence, calendar, owner, and publication states remain bound.",
  artifact_digest: candidateDigest,
  validation_bundle_digest: bundleDigest,
  public_html_routes: 90,
  public_json_exports: 9,
  publication_updates: 8,
  metrics,
  checks: [
    { check_id: "immutable-baselines", status: "Passed", detail: "Exact Phase 156 and Phase 164 receipt/digest bindings preserved" },
    { check_id: "september-evidence-receipt", status: "Passed", detail: phase165.current_decision_receipt.receipt_id },
    { check_id: "route-export-update-contract", status: "Passed", detail: "90 routes / 9 exports / 8 updates" },
    { check_id: "calendar-owner-boundary", status: "Passed", detail: "Future operations and all owner decisions remain unpredated and Held" },
    ...commandChecks,
  ],
  evidence_admission_authorized: false,
  owner_acceptance: false,
  github_publication_authorized: false,
  hosted_deployment_authorized: false,
  public_launch_authorized: false,
  v1_promotion_state: "Held",
  next_action: "Embed this receipt, rebuild, verify deterministic output, update the manifest, then operate the September 6 desk closures only on their lawful date.",
};
if (!isValidV1cycleValidationReceipt({ receipt, aggregate, candidateDigest })) throw new Error("The generated receipt failed its own contract.");
await mkdir(receiptRoot, { recursive: true });
const receiptPath = join(receiptRoot, `${receipt.receipt_id}.json`);
const serialized = `${JSON.stringify(receipt, null, 2)}\n`;
try {
  await writeFile(receiptPath, serialized, { encoding: "utf8", flag: "wx" });
} catch (error) {
  if (error?.code !== "EEXIST") throw error;
  const existing = await readJson(receiptPath);
  if (!isValidV1cycleValidationReceipt({ receipt: existing, aggregate, candidateDigest })) throw new Error(`Receipt archive collision at ${receiptPath}.`);
  console.log(`Reusing immutable Phase 172 receipt ${existing.receipt_id}; artifact digest ${existing.artifact_digest}.`);
  process.exit(0);
}
console.log(`Created immutable Phase 172 local-validation receipt ${receipt.receipt_id}; artifact digest ${receipt.artifact_digest}.`);
