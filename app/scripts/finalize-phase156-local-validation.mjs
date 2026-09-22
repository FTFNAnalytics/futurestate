import { spawnSync } from "node:child_process";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1rcDigestFromDisk, computeV1rcValidationBundleDigest, isValidV1rcValidationReceipt, v1rcValidationScope, v1rcValidatorContractVersion } from "./lib/v1rc-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const legacyReceiptPath = join(dataRoot, "phase-156-local-validation-receipt.json");
const receiptRoot = join(dataRoot, "phase-156-receipts");
const aggregatePath = join(dataRoot, "v1-release-candidate.json");
const edmontonDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Edmonton",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const validationDate = process.env.FTFN_EFFECTIVE_DATE ?? edmontonDate;

if (!/^\d{4}-\d{2}-\d{2}$/.test(validationDate)) {
  throw new Error(`FTFN_EFFECTIVE_DATE must use YYYY-MM-DD; received ${validationDate}.`);
}
const validationDateTimestamp = Date.parse(`${validationDate}T00:00:00Z`);
if (!Number.isFinite(validationDateTimestamp) || new Date(validationDateTimestamp).toISOString().slice(0, 10) !== validationDate) {
  throw new Error(`FTFN_EFFECTIVE_DATE is not a valid calendar date: ${validationDate}.`);
}
if (validationDate < edmontonDate) {
  throw new Error(`Refusing past validation date ${validationDate}; validation runs must use the current America/Edmonton date ${edmontonDate}.`);
}
if (validationDate > edmontonDate && process.env.FTFN_ALLOW_FUTURE_DATE !== "1") {
  throw new Error(`Refusing future validation date ${validationDate}; the current America/Edmonton date is ${edmontonDate}. Set FTFN_ALLOW_FUTURE_DATE=1 only inside an isolated fixture test.`);
}

const validationScripts = [
  "validate:candidates",
  "validate:content",
  "source:health",
  "verify:phase58",
  "verify:phase59",
  "verify:phase60",
  "verify:phase60c",
  "verify:phase61",
  "test:v09",
  "test:v1rc",
  "check",
  "build",
  "verify:v1rc",
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

const readValidationReceipts = async () => {
  const receipts = [];
  if (await exists(legacyReceiptPath)) receipts.push(await readJson(legacyReceiptPath));
  if (await exists(receiptRoot)) {
    for (const entry of await readdir(receiptRoot, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".json")) receipts.push(await readJson(join(receiptRoot, entry.name)));
    }
  }
  return receipts;
};

const inspectCandidate = async () => {
  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };
  check(await exists(distRoot), `Missing production build directory: ${distRoot}`);
  if (failures.length) return { failures };

  const aggregate = await readJson(aggregatePath);
  const phase156 = await readJson(join(dataRoot, "phase-156-v1-launch-decision.json"));
  check(aggregate.public_html_routes?.length >= 58 && new Set(aggregate.public_html_routes).size === aggregate.public_html_routes.length, "The candidate must retain at least the 58 initial unique routes.");
  check(aggregate.public_json_exports?.length === 13 && new Set(aggregate.public_json_exports).size === 13, "The candidate must inventory 13 unique exports.");
  check(phase156.v1_promotion_state === "Held", "Local validation cannot promote v1.");
  check(phase156.owner_packet?.owner_acceptance === false && phase156.owner_packet?.public_launch_authorized === false && phase156.owner_packet?.hosted_deployment_authorized === false, "The candidate overstates owner or deployment authority.");

  const sitemapPath = join(distRoot, "sitemap.xml");
  check(await exists(sitemapPath), "The production sitemap is missing.");
  const sitemap = await exists(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
  let structuredRoutes = 0;
  for (const route of aggregate.public_html_routes ?? []) {
    const path = routeToHtml(route);
    check(await exists(path), `Missing route ${route}.`);
    if (!(await exists(path))) continue;
    const html = await readFile(path, "utf8");
    check(structurallyValid(html, route), `Route ${route} failed the canonical accessibility-structure contract.`);
    check(sitemap.includes(`<loc>https://ftfn.io${route}</loc>`), `The sitemap is missing ${route}.`);
    structuredRoutes += 1;
  }

  let schemaExports = 0;
  for (const route of aggregate.public_json_exports ?? []) {
    const name = route.replace(/^\/data\//, "");
    const sourcePath = join(dataRoot, name);
    const builtPath = join(distRoot, "data", name);
    check(await exists(sourcePath) && await exists(builtPath), `Missing source or built export ${route}.`);
    if (!(await exists(sourcePath)) || !(await exists(builtPath))) continue;
    const [source, built] = await Promise.all([readJson(sourcePath), readJson(builtPath)]);
    check(source.schema_version === "1.0" && built.schema_version === "1.0", `${route} does not use schema_version 1.0.`);
    check(JSON.stringify(source) === JSON.stringify(built), `${route} differs between source and build.`);
    schemaExports += 1;
  }

  const allFiles = await collectFiles(distRoot);
  const downloadsRoot = join(distRoot, "downloads");
  const htmlFiles = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(downloadsRoot, path));
  const builtDataRoot = join(distRoot, "data");
  const publicJsonFiles = allFiles.filter((path) => dirname(path) === builtDataRoot && extname(path).toLowerCase() === ".json");
  const updateFiles = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json"));
  const updatesHtmlPath = routeToHtml("/updates/");
  const updatesHtml = await exists(updatesHtmlPath) ? await readFile(updatesHtmlPath, "utf8") : "";
  const renderedUpdateRows = (updatesHtml.match(/<article\b[^>]*\bclass=(["'])[^"']*\bsource-row\b[^"']*\1/gi) ?? []).length;
  check(renderedUpdateRows === updateFiles.length, `The update index renders ${renderedUpdateRows} rows for ${updateFiles.length} update sources.`);

  return {
    failures,
    aggregate,
    artifactDigest: failures.length === 0 ? await computeV1rcDigestFromDisk({ aggregate, dataRoot, updateRoot }) : null,
    metrics: {
      html_pages_excluding_downloads: htmlFiles.length,
      top_level_data_json_exports: publicJsonFiles.length,
      update_entries_rendered: renderedUpdateRows,
      v1rc_public_html_routes: aggregate.public_html_routes?.length ?? 0,
      v1rc_public_json_exports: aggregate.public_json_exports?.length ?? 0,
      schema_1_0_v1rc_exports: schemaExports,
      structurally_audited_v1rc_routes: structuredRoutes,
    },
  };
};

const fail = (heading, failures) => {
  console.error(heading);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
};

const initial = await inspectCandidate();
if (initial.failures.length) fail("Phase 156 local validation preflight failed; no receipt was written:", initial.failures);
if (validationDate !== initial.aggregate.effective_date) {
  fail("Phase 156 local validation refused an invalid date:", [`Validation date ${validationDate} must equal candidate effective date ${initial.aggregate.effective_date}. Regenerate the candidate for the current date before finalizing.`]);
}
const matchingReceipt = (await readValidationReceipts()).find((receipt) => (
  isValidV1rcValidationReceipt({ receipt, aggregate: initial.aggregate, candidateDigest: initial.artifactDigest, metrics: initial.metrics })
));
if (matchingReceipt) {
  await mkdir(receiptRoot, { recursive: true });
  const canonicalReceiptPath = join(receiptRoot, `${matchingReceipt.receipt_id}.json`);
  const serializedReceipt = `${JSON.stringify(matchingReceipt, null, 2)}\n`;
  try {
    await writeFile(canonicalReceiptPath, serializedReceipt, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
    const archived = await readFile(canonicalReceiptPath, "utf8");
    if (archived !== serializedReceipt) fail("Phase 156 receipt archive collision:", [`${canonicalReceiptPath} exists with different bytes.`]);
  }
  console.log(`Phase 156 local validation already has an immutable matching receipt: ${matchingReceipt.receipt_id}, digest ${matchingReceipt.artifact_digest}.`);
  process.exit(0);
}

const commandChecks = [];
for (const script of validationScripts) {
  console.log(`\n[Phase 156] npm run ${script}`);
  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", `npm.cmd run ${script}`] : ["run", script];
  const result = spawnSync(command, args, { cwd: appRoot, stdio: "inherit", shell: false });
  if (result.error || result.status !== 0) {
    const detail = result.error ? result.error.message : `exit code ${result.status}`;
    fail("Phase 156 local validation failed; no receipt was written:", [`npm run ${script} failed (${detail}).`]);
  }
  commandChecks.push({ check_id: `npm-run-${script.replaceAll(":", "-")}`, status: "Passed", command: `npm run ${script}` });
}

const final = await inspectCandidate();
if (final.failures.length) fail("The v1 release candidate failed after validation; no receipt was written:", final.failures);
if (final.artifactDigest !== initial.artifactDigest) fail("The v1 release candidate changed during validation; no receipt was written:", [`Initial digest ${initial.artifactDigest}; final digest ${final.artifactDigest}.`]);

const structuralChecks = [
  ["production-html-inventory", `${final.metrics.html_pages_excluding_downloads} HTML pages outside /downloads`],
  ["public-json-inventory", `${final.metrics.top_level_data_json_exports} top-level /data JSON exports`],
  ["update-index-rendering", `${final.metrics.update_entries_rendered} update entries rendered`],
  ["v1rc-route-inventory", `${final.metrics.v1rc_public_html_routes} unique v1-RC routes`],
  ["v1rc-route-structure", `${final.metrics.structurally_audited_v1rc_routes} v1-RC routes structurally audited`],
  ["v1rc-export-inventory", `${final.metrics.v1rc_public_json_exports} unique v1-RC JSON exports`],
  ["v1rc-schema-contract", `${final.metrics.schema_1_0_v1rc_exports} v1-RC exports use schema_version 1.0`],
  ["owner-authority-boundary", "owner acceptance, public launch, hosted deployment, and v1 promotion remain unauthorized"],
].map(([check_id, detail]) => ({ check_id, status: "Passed", detail }));

const validationBundleDigest = computeV1rcValidationBundleDigest({ candidateArtifactDigest: final.artifactDigest, metrics: final.metrics });
const receipt = {
  schema_version: "1.0",
  receipt_id: `156-LOCAL-VALIDATION-${validationDate}-${validationBundleDigest.slice(0, 12)}`,
  phase: 156,
  candidate_effective_date: final.aggregate.effective_date,
  validated_date: validationDate,
  validated_at: new Date().toISOString(),
  status: "Passed",
  validation_result: "Passed local release-candidate checks",
  validator_contract_version: v1rcValidatorContractVersion,
  scope: v1rcValidationScope,
  artifact_digest_algorithm: "sha256",
  artifact_digest_contract: "SHA-256 over normalized schema-1.0 v1-RC source exports, the complete current route inventory, and every explicitly inventoried v1-RC publication/lifecycle update; receipt- and owner-derived Phase 156 fields are normalized to their pre-receipt state to avoid self-reference.",
  artifact_digest: final.artifactDigest,
  validation_bundle_digest: validationBundleDigest,
  metrics: final.metrics,
  checks: [...structuralChecks, ...commandChecks],
  evidence_admission_authorized: false,
  owner_acceptance: false,
  github_publication_authorized: false,
  hosted_deployment_authorized: false,
  public_launch_authorized: false,
  v1_promotion_state: "Held",
  next_action: "Regenerate Phases 145–156 so the receipt is embedded, rebuild, reverify the stable digest contract, update the deployment manifest, and present the remaining owner and calendar gates without promoting v1.",
};

await mkdir(receiptRoot, { recursive: true });
const receiptPath = join(receiptRoot, `${receipt.receipt_id}.json`);
try {
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
} catch (error) {
  if (error?.code === "EEXIST") fail("Phase 156 local validation was not finalized:", [`Immutable receipt path already exists with a non-reusable bundle: ${receiptPath}.`]);
  throw error;
}
console.log(`Phase 156 local validation receipt written: ${receipt.receipt_id}, digest ${receipt.artifact_digest}, ${receipt.metrics.v1rc_public_html_routes} routes, ${receipt.metrics.v1rc_public_json_exports} exports, and v1 Held.`);
