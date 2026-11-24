import { spawnSync } from "node:child_process";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  computeV1monthDigestFromDisk,
  computeV1monthValidationBundleDigest,
  isValidV1monthValidationReceipt,
  v1monthValidationScope,
  v1monthValidatorContractVersion,
} from "./lib/v1month-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const aggregatePath = join(dataRoot, "v1-monthly-operating-program.json");
const receiptRoot = join(dataRoot, "phase-164-receipts");
const edmontonDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Edmonton",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const validationDate = process.env.FTFN_EFFECTIVE_DATE ?? edmontonDate;

if (!/^\d{4}-\d{2}-\d{2}$/.test(validationDate)) throw new Error(`FTFN_EFFECTIVE_DATE must use YYYY-MM-DD; received ${validationDate}.`);
const validationTimestamp = Date.parse(`${validationDate}T00:00:00Z`);
if (!Number.isFinite(validationTimestamp) || new Date(validationTimestamp).toISOString().slice(0, 10) !== validationDate) throw new Error(`FTFN_EFFECTIVE_DATE is not a valid calendar date: ${validationDate}.`);
if (validationDate < edmontonDate) throw new Error(`Refusing past validation date ${validationDate}; validation runs must use current America/Edmonton date ${edmontonDate}.`);
if (validationDate > edmontonDate && process.env.FTFN_ALLOW_FUTURE_DATE !== "1") throw new Error(`Refusing future validation date ${validationDate}; current America/Edmonton date is ${edmontonDate}.`);

const validationScripts = [
  "validate:candidates",
  "validate:content",
  "source:health",
  "test:v1rc",
  "test:v1month",
  "check",
  "build",
  "verify:v1rc",
  "verify:v1month",
];

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const collectFiles = async (root) => {
  const files = [];
  const visit = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile()) files.push(path);
    }
  };
  await visit(root);
  return files;
};
const isInside = (parent, path) => {
  const candidate = relative(parent, path);
  return candidate !== "" && !candidate.startsWith("..") && !isAbsolute(candidate);
};
const routeToHtml = (route) => join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] ?? null;
const structurallyValid = (html, route) => {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  const robots = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "robots") ?? "";
  const directives = (attribute(robots, "content") ?? "").toLowerCase().split(",").map((item) => item.trim());
  const viewport = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "viewport") ?? "";
  const viewportValue = (attribute(viewport, "content") ?? "").toLowerCase().replaceAll(" ", "");
  return links.some((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical" && attribute(tag, "href") === `https://ftfn.io${route}`)
    && directives.includes("index")
    && directives.includes("follow")
    && attribute(htmlTag, "lang")?.toLowerCase() === "en"
    && viewportValue.includes("width=device-width")
    && viewportValue.includes("initial-scale=1")
    && /<main\b/i.test(html)
    && /<h1\b/i.test(html)
    && /<nav\b/i.test(html);
};

const inspectCandidate = async () => {
  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };
  check(await exists(distRoot), `Missing production build directory: ${distRoot}`);
  if (failures.length) return { failures };

  const aggregate = await readJson(aggregatePath);
  const phase164 = await readJson(join(dataRoot, "phase-164-monthly-candidate-decision.json"));
  const phase156 = await readJson(join(dataRoot, "phase-156-v1-launch-decision.json"));
  check(aggregate.program_id === "FTFN-V1-SEPTEMBER-OPERATING-PROGRAM", "The overlay has the wrong program ID.");
  check(aggregate.public_html_routes?.length === 67 && new Set(aggregate.public_html_routes).size === 67, "The overlay must inventory exactly 67 unique routes.");
  check(aggregate.public_json_exports?.length === 9 && new Set(aggregate.public_json_exports).size === 9, "The overlay must inventory exactly nine unique exports.");
  check(aggregate.publication_update_files?.length === 8 && new Set(aggregate.publication_update_files).size === 8, "The overlay must inventory exactly eight unique updates.");
  check(aggregate.baseline_v1rc?.receipt_id === phase156.local_validation_receipt?.receipt_id && aggregate.baseline_v1rc?.artifact_digest === phase156.local_validation_receipt?.artifact_digest, "The overlay baseline does not match the immutable Phase 156 receipt.");
  check(phase164.v1_promotion_state === "Held" && Object.values(phase164.owner_authority ?? {}).every((value) => value === false), "Phase 164 must retain false owner/publication/hosting/launch authority and v1 Held.");

  const sitemapPath = join(distRoot, "sitemap.xml");
  const sitemap = await exists(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
  check(Boolean(sitemap), "The production sitemap is missing.");
  let structuredRoutes = 0;
  for (const route of aggregate.public_html_routes ?? []) {
    const path = routeToHtml(route);
    check(await exists(path), `Missing built overlay route ${route}.`);
    if (!(await exists(path))) continue;
    const html = await readFile(path, "utf8");
    check(structurallyValid(html, route), `Overlay route ${route} failed canonical, robots, language, viewport, or semantic structure checks.`);
    check(sitemap.includes(`<loc>https://ftfn.io${route}</loc>`), `Overlay route ${route} is absent from the sitemap.`);
    if (structurallyValid(html, route)) structuredRoutes += 1;
  }

  let schemaExports = 0;
  for (const route of aggregate.public_json_exports ?? []) {
    const relativePath = route.replace(/^\//, "");
    const source = join(appRoot, "src", relativePath);
    const built = join(distRoot, relativePath);
    check(await exists(source) && await exists(built), `Overlay export ${route} is missing from source or production output.`);
    if (!(await exists(source)) || !(await exists(built))) continue;
    const [sourceValue, builtValue] = await Promise.all([readJson(source), readJson(built)]);
    check(JSON.stringify(sourceValue) === JSON.stringify(builtValue), `Built overlay export ${route} differs from source.`);
    check(sourceValue.schema_version === "1.0" && builtValue.schema_version === "1.0", `Overlay export ${route} must use schema_version 1.0.`);
    if (sourceValue.schema_version === "1.0" && builtValue.schema_version === "1.0") schemaExports += 1;
  }

  for (const name of aggregate.publication_update_files ?? []) check(await exists(join(updateRoot, name)), `Overlay update ${name} is missing.`);
  const allFiles = await collectFiles(distRoot);
  const htmlFiles = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(join(distRoot, "downloads"), path));
  const publicJsonFiles = allFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json");
  const updateFiles = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json"));
  const metrics = {
    overlay_public_html_routes: aggregate.public_html_routes?.length ?? 0,
    overlay_public_json_exports: aggregate.public_json_exports?.length ?? 0,
    schema_1_0_overlay_exports: schemaExports,
    structurally_audited_overlay_routes: structuredRoutes,
    overlay_update_records: aggregate.publication_update_files?.length ?? 0,
    baseline_phase156_artifact_digest: aggregate.baseline_v1rc?.artifact_digest,
    whole_site_snapshot: {
      html_pages_excluding_downloads: htmlFiles.length,
      top_level_data_json_exports: publicJsonFiles.length,
      update_entries_rendered: updateFiles.length,
    },
  };
  return {
    failures,
    aggregate,
    phase164,
    metrics,
    artifactDigest: failures.length === 0 ? await computeV1monthDigestFromDisk({ aggregate, dataRoot, updateRoot }) : null,
  };
};

const fail = (heading, failures) => {
  console.error(heading);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
};

const readReceipts = async () => {
  if (!(await exists(receiptRoot))) return [];
  const entries = await readdir(receiptRoot, { withFileTypes: true });
  return Promise.all(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => readJson(join(receiptRoot, entry.name))));
};

const initialAggregate = await readJson(aggregatePath);
const initialArtifactDigest = await computeV1monthDigestFromDisk({ aggregate: initialAggregate, dataRoot, updateRoot });
if (validationDate < initialAggregate.effective_date) fail("Phase 164 local validation refused an invalid date:", [`Validation date ${validationDate} cannot precede overlay effective date ${initialAggregate.effective_date}.`]);

const existingReceipt = (await readReceipts()).find((receipt) => isValidV1monthValidationReceipt({ receipt, aggregate: initialAggregate, candidateDigest: initialArtifactDigest }));
if (existingReceipt) {
  console.log(`Phase 164 local validation already has an immutable matching receipt: ${existingReceipt.receipt_id}, digest ${existingReceipt.artifact_digest}.`);
  process.exit(0);
}

const commandChecks = [];
for (const script of validationScripts) {
  console.log(`\n[Phase 164] npm run ${script}`);
  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", `npm.cmd run ${script}`] : ["run", script];
  const result = spawnSync(command, args, { cwd: appRoot, stdio: "inherit", shell: false });
  if (result.error || result.status !== 0) {
    const detail = result.error ? result.error.message : `exit code ${result.status}`;
    fail("Phase 164 local validation failed; no receipt was written:", [`npm run ${script} failed (${detail}).`]);
  }
  commandChecks.push({ check_id: `npm-run-${script.replaceAll(":", "-")}`, status: "Passed", command: `npm run ${script}` });
}

const final = await inspectCandidate();
if (final.failures.length) fail("The Phase 157–164 overlay failed after validation; no receipt was written:", final.failures);
if (final.artifactDigest !== initialArtifactDigest) fail("The Phase 157–164 overlay changed during validation; no receipt was written:", [`Initial digest ${initialArtifactDigest}; final digest ${final.artifactDigest}.`]);

const structuralChecks = [
  ["overlay-route-inventory", `${final.metrics.overlay_public_html_routes} unique overlay routes`],
  ["overlay-route-structure", `${final.metrics.structurally_audited_overlay_routes} overlay routes structurally audited`],
  ["overlay-export-inventory", `${final.metrics.overlay_public_json_exports} unique overlay exports`],
  ["overlay-schema-contract", `${final.metrics.schema_1_0_overlay_exports} overlay exports use schema_version 1.0`],
  ["overlay-update-inventory", `${final.metrics.overlay_update_records} immutable Phase 157–164 updates`],
  ["phase156-baseline-binding", `immutable Phase 156 digest ${final.metrics.baseline_phase156_artifact_digest}`],
  ["time-and-owner-boundary", "future evidence/editorial results remain unpredated and all owner/publication/hosting/launch authority remains false"],
].map(([check_id, detail]) => ({ check_id, status: "Passed", detail }));

const validationBundleDigest = computeV1monthValidationBundleDigest({ candidateArtifactDigest: final.artifactDigest, metrics: final.metrics });
const receipt = {
  schema_version: "1.0",
  receipt_id: `164-LOCAL-VALIDATION-${validationDate}-${validationBundleDigest.slice(0, 12)}`,
  phase: 164,
  candidate_effective_date: final.aggregate.effective_date,
  validated_date: validationDate,
  validated_at: new Date().toISOString(),
  status: "Passed",
  validation_result: "Passed local Phase 157–164 operating-overlay checks",
  validator_contract_version: v1monthValidatorContractVersion,
  scope: v1monthValidationScope,
  artifact_digest_algorithm: "sha256",
  artifact_digest_contract: "SHA-256 over the normalized nine schema-1.0 Phase 157–164 source exports, exact 67-route overlay inventory, eight inventoried publication updates, source-semantic bindings, and immutable Phase 156 receipt/digest baseline. Receipt-derived Phase 164 fields are normalized to their pre-receipt state.",
  artifact_digest: final.artifactDigest,
  validation_bundle_digest: validationBundleDigest,
  metrics: final.metrics,
  historical_whole_site_inventory_snapshot: true,
  checks: [...structuralChecks, ...commandChecks],
  evidence_admission_authorized: false,
  owner_acceptance: false,
  github_publication_authorized: false,
  hosted_deployment_authorized: false,
  public_launch_authorized: false,
  v1_promotion_state: "Held",
  next_action: "Regenerate Phases 157–164 so this receipt is embedded, rebuild, verify the stable overlay digest, update the deployment manifest, and operate each future evidence or editorial window only on its lawful date.",
};

if (!isValidV1monthValidationReceipt({ receipt, aggregate: final.aggregate, candidateDigest: final.artifactDigest, metrics: final.metrics })) fail("The generated Phase 164 receipt failed its own contract; no receipt was written:", ["Receipt contract mismatch."]);

await mkdir(receiptRoot, { recursive: true });
const receiptPath = join(receiptRoot, `${receipt.receipt_id}.json`);
const serialized = `${JSON.stringify(receipt, null, 2)}\n`;
try {
  await writeFile(receiptPath, serialized, { encoding: "utf8", flag: "wx" });
} catch (error) {
  if (error?.code !== "EEXIST") throw error;
  if (await readFile(receiptPath, "utf8") !== serialized) fail("Phase 164 receipt archive collision:", [`${receiptPath} exists with different bytes.`]);
}

console.log(`Created immutable Phase 164 local-validation receipt ${receipt.receipt_id}; artifact digest ${receipt.artifact_digest}.`);
