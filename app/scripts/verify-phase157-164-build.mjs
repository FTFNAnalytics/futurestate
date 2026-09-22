import { access, readdir, readFile } from "node:fs/promises";
import {verifiedPaginatedUpdateHtml} from './lib/verify-update-archive.mjs';
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1monthDigestFromDisk, isValidV1monthValidationReceipt, v1monthPublicationDate } from "./lib/v1month-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const failures = [];

const check = (condition, message) => {
  if (!condition) failures.push(message);
};
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
const routeToHtml = (route) => join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] ?? null;
const inspectStructure = (html, route) => {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  const robots = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "robots") ?? "";
  const directives = (attribute(robots, "content") ?? "").toLowerCase().split(",").map((item) => item.trim());
  const viewport = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "viewport") ?? "";
  const viewportValue = (attribute(viewport, "content") ?? "").toLowerCase().replaceAll(" ", "");
  return {
    canonical: links.some((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical" && attribute(tag, "href") === `https://ftfn.io${route}`),
    indexFollow: directives.includes("index") && directives.includes("follow"),
    language: attribute(htmlTag, "lang")?.toLowerCase() === "en",
    viewport: viewportValue.includes("width=device-width") && viewportValue.includes("initial-scale=1"),
    main: /<main\b/i.test(html),
    heading: /<h1\b/i.test(html),
    navigation: /<nav\b/i.test(html),
  };
};
const isInside = (parent, path) => {
  const candidate = relative(parent, path);
  return candidate !== "" && !candidate.startsWith("..") && !isAbsolute(candidate);
};
const htmlEscape = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

check(await exists(distRoot), `Missing production build directory: ${distRoot}`);
if (!(await exists(distRoot))) throw new Error("Run the production build before Phase 157–164 verification.");

const aggregatePath = join(dataRoot, "v1-monthly-operating-program.json");
const sourceAggregate = await readJson(aggregatePath);
const builtAggregatePath = join(distRoot, "data", "v1-monthly-operating-program.json");
check(await exists(builtAggregatePath), "The built v1month aggregate export is missing.");
const builtAggregate = await exists(builtAggregatePath) ? await readJson(builtAggregatePath) : null;
check(JSON.stringify(sourceAggregate) === JSON.stringify(builtAggregate), "The built v1month aggregate does not equal its source registry.");
check(sourceAggregate.program_id === "FTFN-V1-SEPTEMBER-OPERATING-PROGRAM", "The v1month aggregate has the wrong program ID.");
check(sourceAggregate.baseline_v1rc?.artifact_digest === "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a", "The v1month overlay is not bound to the immutable Phase 156 digest.");

const routes = sourceAggregate.public_html_routes ?? [];
const exports = sourceAggregate.public_json_exports ?? [];
check(routes.length === 67 && new Set(routes).size === 67, `Expected exactly 67 unique v1month routes, found ${routes.length}/${new Set(routes).size}.`);
check(exports.length === 9 && new Set(exports).size === 9, `Expected exactly 9 unique v1month exports, found ${exports.length}/${new Set(exports).size}.`);

const sitemapPath = join(distRoot, "sitemap.xml");
check(await exists(sitemapPath), "The production sitemap is missing.");
const sitemap = await exists(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
let structurallyAudited = 0;
for (const route of routes) {
  const htmlPath = routeToHtml(route);
  check(await exists(htmlPath), `Missing v1month route output ${route}.`);
  if (!(await exists(htmlPath))) continue;
  const html = await readFile(htmlPath, "utf8");
  for (const [key, value] of Object.entries(inspectStructure(html, route))) check(value, `Route ${route} failed structural check: ${key}.`);
  check(sitemap.includes(`<loc>https://ftfn.io${route}</loc>`), `Route ${route} is missing from the sitemap.`);
  structurallyAudited += 1;
}

let schemaExports = 0;
for (const route of exports) {
  const name = route.replace(/^\/data\//, "");
  const sourcePath = join(dataRoot, name);
  const builtPath = join(distRoot, "data", name);
  check(await exists(sourcePath), `Missing source export ${route}.`);
  check(await exists(builtPath), `Missing built export ${route}.`);
  if (!(await exists(sourcePath)) || !(await exists(builtPath))) continue;
  const [source, built] = await Promise.all([readJson(sourcePath), readJson(builtPath)]);
  check(source.schema_version === "1.0" && built.schema_version === "1.0", `Export ${route} must use schema_version 1.0.`);
  if (source.schema_version === "1.0" && built.schema_version === "1.0") schemaExports += 1;
  check(JSON.stringify(source) === JSON.stringify(built), `Built export ${route} differs from its source file.`);
}

const updateNames = sourceAggregate.publication_update_files ?? [];
const expectedUpdateNames = Array.from({ length: 8 }, (_, index) => `${v1monthPublicationDate}-phase-${157 + index}.json`);
check(updateNames.length === 8 && new Set(updateNames).size === 8 && expectedUpdateNames.every((name) => updateNames.includes(name)), "The overlay update inventory must contain the eight Phase 157–164 updates exactly once.");
const updateIndexPath = routeToHtml("/updates/");
check(await exists(updateIndexPath), "The rendered update index is missing.");
const updateIndex = await verifiedPaginatedUpdateHtml({appRoot});
for (const name of updateNames) {
  const path = join(updateRoot, name);
  check(await exists(path), `Inventoried overlay update ${name} is missing.`);
  if (await exists(path)) check(updateIndex.includes(htmlEscape((await readJson(path)).title)), `The update index does not render overlay update ${name}.`);
}

const phase164Source = await readJson(join(dataRoot, "phase-164-monthly-candidate-decision.json"));
const phase164Built = await readJson(join(distRoot, "data", "phase-164-monthly-candidate-decision.json"));
check(JSON.stringify(phase164Source) === JSON.stringify(phase164Built), "The built Phase 164 decision differs from source.");
const gateCounts = {
  passed: phase164Source.readiness_gates.filter((gate) => gate.state === "Pass").length,
  held: phase164Source.readiness_gates.filter((gate) => gate.state === "Held").length,
  pending_build: phase164Source.readiness_gates.filter((gate) => gate.state === "Pending build").length,
};
check(gateCounts.passed + gateCounts.held + gateCounts.pending_build === 14, "Phase 164 gate-state counts do not total fourteen.");
check(phase164Source.v1_promotion_state === (phase164Source.readiness_gates.every((gate) => gate.state === "Pass") ? "Ready for promotion" : "Held"), "Phase 164 promotion state is not derived from its gates.");
check(Object.values(phase164Source.owner_authority ?? {}).every((value) => value === false), "Phase 164 overstates owner, publication, hosting, launch, or promotion authority.");

const currentDigest = await computeV1monthDigestFromDisk({ aggregate: sourceAggregate, dataRoot, updateRoot });
const receipt = phase164Source.local_validation_receipt;
if (receipt) {
  check(isValidV1monthValidationReceipt({ receipt, aggregate: sourceAggregate, candidateDigest: currentDigest }), "The embedded Phase 164 receipt is malformed or does not match the current normalized overlay.");
  const archivedReceiptPath = join(dataRoot, "phase-164-receipts", `${receipt.receipt_id}.json`);
  check(await exists(archivedReceiptPath), "The embedded Phase 164 receipt has no immutable archived receipt file.");
  if (await exists(archivedReceiptPath)) check(JSON.stringify(receipt) === JSON.stringify(await readJson(archivedReceiptPath)), "The embedded Phase 164 receipt differs from its immutable archive file.");
  check(gateCounts.passed === 10 && gateCounts.held === 4 && gateCounts.pending_build === 0, `A validated overlay must be 10 Pass / 4 Held / 0 Pending; found ${gateCounts.passed}/${gateCounts.held}/${gateCounts.pending_build}.`);
  check(receipt.metrics?.overlay_public_html_routes === routes.length && receipt.metrics?.overlay_public_json_exports === exports.length, "The Phase 164 receipt has stale overlay route/export metrics.");
  check(receipt.metrics?.schema_1_0_overlay_exports === schemaExports && receipt.metrics?.structurally_audited_overlay_routes === structurallyAudited, "The Phase 164 receipt has stale schema or structural metrics.");
} else {
  check(gateCounts.passed === 9 && gateCounts.held === 4 && gateCounts.pending_build === 1, `A receipt-free overlay must be 9 Pass / 4 Held / 1 Pending; found ${gateCounts.passed}/${gateCounts.held}/${gateCounts.pending_build}.`);
  check(phase164Source.readiness_gates.find((gate) => gate.gate_id === "164-GATE-13-LOCAL-VALIDATION")?.state === "Pending build", "A receipt-free overlay must leave the local-validation gate pending.");
}

const allFiles = await collectFiles(distRoot);
const downloadsRoot = join(distRoot, "downloads");
const htmlCount = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(downloadsRoot, path)).length;
const builtDataRoot = join(distRoot, "data");
const jsonCount = allFiles.filter((path) => dirname(path) === builtDataRoot && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
if (receipt) {
  const snapshot = receipt.metrics?.whole_site_snapshot ?? {};
  check(htmlCount >= snapshot.html_pages_excluding_downloads, "The current whole-site HTML inventory is below the Phase 164 historical snapshot.");
  check(jsonCount >= snapshot.top_level_data_json_exports, "The current whole-site JSON inventory is below the Phase 164 historical snapshot.");
  check(updateCount >= snapshot.update_entries_rendered, "The current update inventory is below the Phase 164 historical snapshot.");
}

if (failures.length) {
  console.error(`Phase 157–164 post-build verification failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 157–164 post-build verification passed: ${routes.length} overlay routes, ${exports.length} exports, ${structurallyAudited} structured pages, ${htmlCount} whole-build HTML pages, ${jsonCount} top-level JSON exports, and v1 ${phase164Source.v1_promotion_state}.`);
