import { access, readdir, readFile } from "node:fs/promises";
import {verifiedPaginatedUpdateHtml} from './lib/verify-update-archive.mjs';
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1cycleDigestFromDisk, isValidV1cycleValidationReceipt, v1cyclePublicationDate } from "./lib/v1cycle-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
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
    main: /<main\b/i.test(html), heading: /<h1\b/i.test(html), navigation: /<nav\b/i.test(html),
  };
};
const isInside = (parent, path) => { const candidate = relative(parent, path); return candidate !== "" && !candidate.startsWith("..") && !isAbsolute(candidate); };
const htmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

check(await exists(distRoot), `Missing production build directory: ${distRoot}`);
if (!(await exists(distRoot))) throw new Error("Run the production build before Phase 165–172 verification.");

const aggregate = await readJson(join(dataRoot, "v1-september-evidence-cycle.json"));
const builtAggregatePath = join(distRoot, "data", "v1-september-evidence-cycle.json");
check(await exists(builtAggregatePath), "The built v1cycle aggregate export is missing.");
if (await exists(builtAggregatePath)) check(JSON.stringify(aggregate) === JSON.stringify(await readJson(builtAggregatePath)), "The built v1cycle aggregate differs from source.");
check(aggregate.program_id === "FTFN-V1-SEPTEMBER-EVIDENCE-TO-PUBLICATION-CYCLE", "The v1cycle aggregate has the wrong program ID.");
check(aggregate.baseline_v1rc?.artifact_digest === "5a8041408c755e79e4ddde898fe9639d04d85cdcf4bdba5a5d4014d21c14b31a", "The Phase 156 baseline digest changed.");
check(aggregate.baseline_v1month?.artifact_digest === "c306c3db8f861805be0482f82985df7de7fa1124b055f8e76023b5ba680c8a19", "The Phase 164 baseline digest changed.");

const routes = aggregate.public_html_routes ?? [];
const exports = aggregate.public_json_exports ?? [];
check(routes.length === 90 && new Set(routes).size === 90, `Expected 90 unique v1cycle routes; found ${routes.length}/${new Set(routes).size}.`);
check(exports.length === 9 && new Set(exports).size === 9, `Expected nine unique v1cycle exports; found ${exports.length}/${new Set(exports).size}.`);
const sitemapPath = join(distRoot, "sitemap.xml");
check(await exists(sitemapPath), "The production sitemap is missing.");
const sitemap = await exists(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
let structurallyAudited = 0;
for (const route of routes) {
  const path = routeToHtml(route);
  check(await exists(path), `Missing v1cycle route output ${route}.`);
  if (!(await exists(path))) continue;
  const html = await readFile(path, "utf8");
  for (const [key, value] of Object.entries(inspectStructure(html, route))) check(value, `Route ${route} failed structural check: ${key}.`);
  check(sitemap.includes(`<loc>https://ftfn.io${route}</loc>`), `Route ${route} is missing from the sitemap.`);
  structurallyAudited += 1;
}

let schemaExports = 0;
for (const route of exports) {
  const name = route.replace(/^\/data\//, "");
  const sourcePath = join(dataRoot, name);
  const builtPath = join(distRoot, "data", name);
  check(await exists(sourcePath) && await exists(builtPath), `Source or built export ${route} is missing.`);
  if (!(await exists(sourcePath)) || !(await exists(builtPath))) continue;
  const [source, built] = await Promise.all([readJson(sourcePath), readJson(builtPath)]);
  check(source.schema_version === "1.0" && built.schema_version === "1.0", `Export ${route} must use schema 1.0.`);
  check(JSON.stringify(source) === JSON.stringify(built), `Built export ${route} differs from source.`);
  if (source.schema_version === "1.0" && built.schema_version === "1.0") schemaExports += 1;
}

const expectedUpdates = Array.from({ length: 8 }, (_, index) => `${v1cyclePublicationDate}-phase-${165 + index}.json`);
check(aggregate.publication_update_files?.length === 8 && expectedUpdates.every((name) => aggregate.publication_update_files.includes(name)), "The v1cycle update inventory is not exact.");
const updateIndexPath = routeToHtml("/updates/");
check(await exists(updateIndexPath), "The rendered update index is missing.");
const updateIndex = await verifiedPaginatedUpdateHtml({appRoot});
for (const name of expectedUpdates) {
  const path = join(updateRoot, name);
  check(await exists(path), `Missing v1cycle update ${name}.`);
  if (await exists(path)) check(updateIndex.includes(htmlEscape((await readJson(path)).title)), `The update index does not render ${name}.`);
}

const phase165 = await readJson(join(dataRoot, "phase-165-live-evidence-operations-cycle-001.json"));
const evidenceReceipt = phase165.current_decision_receipt;
const evidenceArchivePath = join(dataRoot, "phase-165-receipts", `${evidenceReceipt.receipt_id}.json`);
check(await exists(evidenceArchivePath), "The September 1 evidence receipt archive is missing.");
if (await exists(evidenceArchivePath)) check(JSON.stringify(evidenceReceipt) === JSON.stringify(await readJson(evidenceArchivePath)), "The embedded evidence receipt differs from its archive.");

const phase172 = await readJson(join(dataRoot, "phase-172-september-state-report.json"));
const gateCounts = {
  passed: phase172.state_report_gates.filter((gate) => gate.state === "Pass").length,
  held: phase172.state_report_gates.filter((gate) => gate.state === "Held").length,
  pending: phase172.state_report_gates.filter((gate) => gate.state === "Pending build").length,
};
check(gateCounts.passed + gateCounts.held + gateCounts.pending === 14, "Phase 172 gate counts do not total fourteen.");
check(phase172.v1_promotion_state === "Held" && Object.values(phase172.owner_authority ?? {}).every((value) => value === false), "Phase 172 overstates owner, publication, hosting, launch, or promotion authority.");
const currentDigest = await computeV1cycleDigestFromDisk({ dataRoot, updatesRoot: updateRoot });
const receipt = phase172.local_validation_receipt;
if (receipt) {
  check(isValidV1cycleValidationReceipt({ receipt, aggregate, candidateDigest: currentDigest }), "The embedded Phase 172 validation receipt is invalid or stale.");
  const archivePath = join(dataRoot, "phase-172-receipts", `${receipt.receipt_id}.json`);
  check(await exists(archivePath), "The embedded Phase 172 receipt has no archive.");
  if (await exists(archivePath)) check(JSON.stringify(receipt) === JSON.stringify(await readJson(archivePath)), "The embedded Phase 172 receipt differs from its archive.");
  check(gateCounts.passed === 7 && gateCounts.held === 7 && gateCounts.pending === 0, `Validated Phase 172 must be 7/7/0; found ${gateCounts.passed}/${gateCounts.held}/${gateCounts.pending}.`);
  check(receipt.metrics?.overlay_public_html_routes === 90 && receipt.metrics?.structurally_audited_overlay_routes === 90, "The receipt has stale route metrics.");
  check(receipt.metrics?.overlay_public_json_exports === 9 && receipt.metrics?.schema_1_0_overlay_exports === schemaExports, "The receipt has stale export metrics.");
} else {
  check(gateCounts.passed === 6 && gateCounts.held === 7 && gateCounts.pending === 1, `Pre-receipt Phase 172 must be 6/7/1; found ${gateCounts.passed}/${gateCounts.held}/${gateCounts.pending}.`);
}

const allFiles = await collectFiles(distRoot);
const htmlCount = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(join(distRoot, "downloads"), path)).length;
const jsonCount = allFiles.filter((path) => dirname(path) === join(distRoot, "data") && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;

if (failures.length) {
  console.error(`Phase 165–172 post-build verification failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Phase 165–172 post-build verification passed: ${routes.length} overlay routes, ${exports.length} exports, ${structurallyAudited} structured pages, ${htmlCount} whole-build HTML pages, ${jsonCount} top-level JSON exports, ${updateCount} updates, and Phase 172 ${gateCounts.passed}/${gateCounts.held}/${gateCounts.pending}.`);
