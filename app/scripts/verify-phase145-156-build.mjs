import { access, readdir, readFile } from "node:fs/promises";
import {verifiedPaginatedUpdateHtml} from './lib/verify-update-archive.mjs';
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1rcDigestFromDisk, isValidV1rcValidationReceipt, v1rcPublicationDate } from "./lib/v1rc-candidate-digest.mjs";
import { isValidV1rcOwnerReceipt, v1rcOwnerReceiptArchiveName } from "./lib/v1rc-owner-receipt.mjs";

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
const routeToHtml = (route) => {
  const clean = route.replace(/^\//, "").replace(/\/$/, "");
  return join(distRoot, clean, "index.html");
};
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] ?? null;
const inspectStructure = (html, route) => {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const canonical = linkTags.some((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical" && attribute(tag, "href") === `https://ftfn.io${route}`);
  const robotsTag = metaTags.find((tag) => attribute(tag, "name")?.toLowerCase() === "robots") ?? "";
  const robotDirectives = (attribute(robotsTag, "content") ?? "").toLowerCase().split(",").map((item) => item.trim());
  const viewportTag = metaTags.find((tag) => attribute(tag, "name")?.toLowerCase() === "viewport") ?? "";
  const viewport = (attribute(viewportTag, "content") ?? "").toLowerCase().replaceAll(" ", "");
  return {
    canonical,
    indexFollow: robotDirectives.includes("index") && robotDirectives.includes("follow"),
    language: attribute(htmlTag, "lang")?.toLowerCase() === "en",
    viewport: viewport.includes("width=device-width") && viewport.includes("initial-scale=1"),
    main: /<main\b/i.test(html),
    heading: /<h1\b/i.test(html),
    navigation: /<nav\b/i.test(html),
  };
};
const htmlEscape = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");
const isInside = (parent, path) => {
  const candidate = relative(parent, path);
  return candidate !== "" && !candidate.startsWith("..") && !isAbsolute(candidate);
};

check(await exists(distRoot), `Missing production build directory: ${distRoot}`);
if (!(await exists(distRoot))) throw new Error("Run the production build before v1-RC verification.");

const aggregatePath = join(dataRoot, "v1-release-candidate.json");
const sourceAggregate = await readJson(aggregatePath);
const builtAggregatePath = join(distRoot, "data", "v1-release-candidate.json");
check(await exists(builtAggregatePath), "The built v1-RC aggregate export is missing.");
const builtAggregate = await exists(builtAggregatePath) ? await readJson(builtAggregatePath) : null;
check(JSON.stringify(sourceAggregate) === JSON.stringify(builtAggregate), "The built v1-RC aggregate does not equal its source registry.");

const routes = sourceAggregate.public_html_routes ?? [];
const exports = sourceAggregate.public_json_exports ?? [];
check(routes.length >= 58 && new Set(routes).size === routes.length, `Expected at least the 58 initial unique v1-RC routes, found ${routes.length}/${new Set(routes).size}.`);
check(exports.length === 13 && new Set(exports).size === 13, `Expected 13 unique v1-RC exports, found ${exports.length}/${new Set(exports).size}.`);

const sitemapPath = join(distRoot, "sitemap.xml");
check(await exists(sitemapPath), "The production sitemap is missing.");
const sitemap = await exists(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
let structurallyAudited = 0;
for (const route of routes) {
  const htmlPath = routeToHtml(route);
  check(await exists(htmlPath), `Missing v1-RC route output ${route}.`);
  if (!(await exists(htmlPath))) continue;
  const html = await readFile(htmlPath, "utf8");
  const structure = inspectStructure(html, route);
  for (const [key, value] of Object.entries(structure)) check(value, `Route ${route} failed structural check: ${key}.`);
  check(sitemap.includes(`<loc>https://ftfn.io${route}</loc>`), `Route ${route} is missing from the sitemap.`);
  structurallyAudited += 1;
}

for (const route of exports) {
  const name = route.replace(/^\/data\//, "");
  const sourcePath = join(dataRoot, name);
  const builtPath = join(distRoot, "data", name);
  check(await exists(sourcePath), `Missing source export ${route}.`);
  check(await exists(builtPath), `Missing built export ${route}.`);
  if (!(await exists(sourcePath)) || !(await exists(builtPath))) continue;
  const [source, built] = await Promise.all([readJson(sourcePath), readJson(builtPath)]);
  check(source.schema_version === "1.0" && built.schema_version === "1.0", `Export ${route} must use schema_version 1.0.`);
  check(JSON.stringify(source) === JSON.stringify(built), `Built export ${route} differs from its source file.`);
}

const updateIndexPath = routeToHtml("/updates/");
check(await exists(updateIndexPath), "The rendered update index is missing.");
const updateIndex = await verifiedPaginatedUpdateHtml({appRoot});
for (let phase = 145; phase <= 156; phase += 1) {
  const updatePath = join(updateRoot, `${v1rcPublicationDate}-phase-${phase}.json`);
  check(await exists(updatePath), `Phase ${phase} update source is missing.`);
  if (!(await exists(updatePath))) continue;
  const update = await readJson(updatePath);
  check(updateIndex.includes(htmlEscape(update.title)), `The update index does not render the Phase ${phase} update title.`);
}
check(Array.isArray(sourceAggregate.publication_update_files) && new Set(sourceAggregate.publication_update_files).size === sourceAggregate.publication_update_files.length, "The v1-RC update inventory is missing or duplicated.");
for (const name of sourceAggregate.publication_update_files ?? []) {
  const updatePath = join(updateRoot, name);
  check(await exists(updatePath), `Inventoried v1-RC update ${name} is missing.`);
  if (await exists(updatePath)) check(updateIndex.includes(htmlEscape((await readJson(updatePath)).title)), `The update index does not render inventoried v1-RC update ${name}.`);
}

const phase156Source = await readJson(join(dataRoot, "phase-156-v1-launch-decision.json"));
const phase156Built = await readJson(join(distRoot, "data", "phase-156-v1-launch-decision.json"));
check(JSON.stringify(phase156Source) === JSON.stringify(phase156Built), "The built Phase 156 audit differs from source.");
const stateCounts = {
  passed: phase156Source.launch_gates.filter((gate) => gate.state === "Pass").length,
  held: phase156Source.launch_gates.filter((gate) => gate.state === "Held").length,
  pending: phase156Source.launch_gates.filter((gate) => gate.state === "Pending build").length,
};
check(stateCounts.passed + stateCounts.held + stateCounts.pending === 14, "Phase 156 gate-state counts do not total fourteen.");
const everyGatePasses = phase156Source.launch_gates.every((gate) => gate.state === "Pass");
check(phase156Source.v1_promotion_state === (everyGatePasses ? "Ready for promotion" : "Held"), "Phase 156 promotion state does not equal its derived gates.");
check(!phase156Source.owner_packet?.public_launch_authorized || phase156Source.owner_packet?.owner_acceptance, "Phase 156 overstates public-launch authority.");
check(!phase156Source.owner_packet?.hosted_deployment_authorized || phase156Source.owner_packet?.owner_acceptance, "Phase 156 overstates hosted-deployment authority.");

const receipt = phase156Source.local_validation_receipt;
const currentDigest = await computeV1rcDigestFromDisk({ aggregate: sourceAggregate, dataRoot, updateRoot });
if (receipt) {
  check(isValidV1rcValidationReceipt({ receipt, aggregate: sourceAggregate, candidateDigest: currentDigest }), "The embedded Phase 156 receipt is malformed or does not match the current normalized candidate.");
  const archivedReceiptPath = join(dataRoot, "phase-156-receipts", `${receipt.receipt_id}.json`);
  check(await exists(archivedReceiptPath), "The embedded Phase 156 receipt has no immutable archived receipt file.");
  if (await exists(archivedReceiptPath)) check(JSON.stringify(receipt) === JSON.stringify(await readJson(archivedReceiptPath)), "The embedded Phase 156 receipt differs from its immutable archived file.");
  check(receipt.metrics?.v1rc_public_html_routes === routes.length && receipt.metrics?.v1rc_public_json_exports === exports.length, "The Phase 156 receipt has stale v1-RC route/export metrics.");
  check(receipt.metrics?.structurally_audited_v1rc_routes === structurallyAudited, "The Phase 156 receipt has a stale structural-audit count.");
  check(receipt.v1_promotion_state === "Held" && receipt.owner_acceptance === false && receipt.public_launch_authorized === false && receipt.hosted_deployment_authorized === false, "The Phase 156 receipt must not claim owner, launch, hosted, or promotion authority.");
} else {
  check(phase156Source.launch_gates.find((gate) => gate.gate_id === "156-GATE-12-ACCESSIBLE-STRUCTURE")?.state === "Pending build" && phase156Source.launch_gates.find((gate) => gate.gate_id === "156-GATE-13-RELEASE-VALIDATION")?.state === "Pending build", "A receipt-free candidate must leave both local-validation gates pending.");
}

const ownerReceipt = phase156Source.owner_acceptance_receipt;
const expectedOwnerGateSnapshot = phase156Source.launch_gates.map((gate) => ({
  gate_id: gate.gate_id,
  state: gate.gate_id === "156-GATE-14-OWNER-ACCEPTANCE" ? "Held" : gate.state,
}));
const ownerReceiptValid = Boolean(ownerReceipt) && isValidV1rcOwnerReceipt({
  receipt: ownerReceipt,
  aggregate: sourceAggregate,
  candidateDigest: currentDigest,
  verifiedGitCommit: process.env.FTFN_VERIFIED_GIT_COMMIT,
  expectedGateSnapshot: expectedOwnerGateSnapshot,
  requiredLimitations: phase156Source.owner_packet?.boundaries_requiring_acceptance ?? [],
  effectiveDate: sourceAggregate.effective_date,
});
check(phase156Source.owner_packet?.owner_acceptance === ownerReceiptValid, "Phase 156 owner acceptance is not backed by a shared-contract-valid receipt and verified candidate commit.");
if (ownerReceipt) {
  check(ownerReceiptValid, "The embedded Phase 156 owner receipt is malformed, stale, or bound to a different digest, gate snapshot, limitation set, or verified commit.");
  const archivedOwnerReceiptPath = join(dataRoot, "phase-156-owner-receipts", v1rcOwnerReceiptArchiveName(ownerReceipt));
  check(await exists(archivedOwnerReceiptPath), "The embedded Phase 156 owner receipt has no immutable content-addressed archive file.");
  if (await exists(archivedOwnerReceiptPath)) check(JSON.stringify(ownerReceipt) === JSON.stringify(await readJson(archivedOwnerReceiptPath)), "The embedded Phase 156 owner receipt differs from its immutable archive file.");
  check(phase156Source.owner_packet.public_launch_authorized === ownerReceipt.public_launch_authorized && phase156Source.owner_packet.hosted_deployment_authorized === ownerReceipt.hosted_deployment_authorized, "Phase 156 deployment/launch authority differs from its valid owner receipt.");
} else {
  check(phase156Source.owner_packet?.owner_acceptance === false && phase156Source.owner_packet?.public_launch_authorized === false && phase156Source.owner_packet?.hosted_deployment_authorized === false, "A receipt-free Phase 156 candidate must retain a false owner/deployment/launch boundary.");
}

const allFiles = await collectFiles(distRoot);
const downloadsRoot = join(distRoot, "downloads");
const htmlCount = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(downloadsRoot, path)).length;
const dataRootBuilt = join(distRoot, "data");
const jsonCount = allFiles.filter((path) => dirname(path) === dataRootBuilt && extname(path).toLowerCase() === ".json").length;
const updateCount = (await readdir(updateRoot, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).length;
if (receipt) {
  check(htmlCount >= receipt.metrics?.html_pages_excluding_downloads, "The current whole-build HTML inventory is below the historical Phase 156 receipt snapshot.");
  check(jsonCount >= receipt.metrics?.top_level_data_json_exports, "The current whole-build JSON inventory is below the historical Phase 156 receipt snapshot.");
  check(updateCount >= receipt.metrics?.update_entries_rendered, "The current update inventory is below the historical Phase 156 receipt snapshot.");
}

if (failures.length) {
  console.error(`Phase 145–156 post-build verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Phase 145–156 post-build verification passed: ${routes.length} v1-RC routes, ${exports.length} exports, ${structurallyAudited} structured pages, ${htmlCount} whole-build HTML pages, ${jsonCount} top-level JSON exports, and v1 Held.`);
