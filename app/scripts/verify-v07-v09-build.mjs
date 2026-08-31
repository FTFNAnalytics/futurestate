import { access, readdir, readFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const receiptPath = join(dataRoot, "phase-144-local-validation-receipt.json");
const failures = [];

const expected = Object.freeze({
  htmlPages: 6504,
  publicJsonExports: 86,
  updateEntries: 169,
  editionRoutes: 170,
  editionExports: 18,
});

const programFiles = [
  "v07-evidence-admission-dockets.json",
  "v08-conversion-longitudinal-atlas.json",
  "v09-living-public-intelligence.json",
];

const requiredReceiptCommands = [
  "validate:candidates",
  "validate:content",
  "source:health",
  "test:v04",
  "test:v05",
  "test:v06",
  "verify:phase58",
  "verify:phase59",
  "verify:phase60",
  "verify:phase61",
  "test:v09",
  "check",
  "verify:v09",
];

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

const readOptionalJson = async (path) => {
  try {
    return await readJson(path);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};

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

const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
};

const inspectRouteStructure = (html, route) => {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const canonical = linkTags.some(
    (tag) => attribute(tag, "rel")?.toLowerCase() === "canonical" && attribute(tag, "href") === `https://ftfn.io${route}`,
  );
  const robots = metaTags.find((tag) => attribute(tag, "name")?.toLowerCase() === "robots");
  const robotDirectives = (attribute(robots ?? "", "content") ?? "")
    .toLowerCase()
    .split(",")
    .map((item) => item.trim());
  const viewport = metaTags.find((tag) => attribute(tag, "name")?.toLowerCase() === "viewport");
  const viewportValue = (attribute(viewport ?? "", "content") ?? "").toLowerCase().replaceAll(" ", "");

  return {
    canonical,
    indexFollow: robotDirectives.includes("index") && robotDirectives.includes("follow"),
    language: attribute(htmlTag, "lang")?.toLowerCase() === "en",
    viewport: viewportValue.includes("width=device-width") && viewportValue.includes("initial-scale=1"),
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

const stateCounts = (audit) => ({
  passed: audit.launch_gates?.filter((gate) => gate.state === "Pass").length ?? 0,
  held: audit.launch_gates?.filter((gate) => gate.state === "Held").length ?? 0,
  pending: audit.launch_gates?.filter((gate) => gate.state === "Pending build").length ?? 0,
});

const sameSet = (left, right) => left.length === right.length
  && new Set(left).size === left.length
  && new Set(right).size === right.length
  && left.every((item) => new Set(right).has(item));

const verifyAuditState = (audit, label, receipt) => {
  const states = stateCounts(audit);
  check(audit.v1_promotion_state === "Held", `Phase 144 ${label} data must keep v1 promotion Held.`);
  check(audit.launch_gates?.length === 14, `Phase 144 ${label} data must contain fourteen launch gates.`);
  check(audit.counts?.false_passes === 0, `Phase 144 ${label} data must contain zero false passes.`);
  if (receipt) {
    check(states.passed === 10 && states.held === 4 && states.pending === 0, `Phase 144 ${label} data must be in the receipted 10 Pass / 4 Held / 0 Pending build state.`);
    check(audit.counts?.passed === 10 && audit.counts?.held === 4 && audit.counts?.pending_build === 0, `Phase 144 ${label} count fields do not match the receipted gate states.`);
    check(audit.build_status === "Complete locally", `Phase 144 ${label} build status must be Complete locally after a receipt.`);
    check(audit.local_validation_receipt?.receipt_id === receipt.receipt_id, `Phase 144 ${label} data does not embed the current local validation receipt.`);
  } else {
    check(states.passed === 8 && states.held === 4 && states.pending === 2, `Phase 144 ${label} data must be in the unreceipted 8 Pass / 4 Held / 2 Pending build state.`);
    check(audit.counts?.passed === 8 && audit.counts?.held === 4 && audit.counts?.pending_build === 2, `Phase 144 ${label} count fields do not match the pending gate states.`);
    check(audit.build_status === "Candidate assembled — validation pending", `Phase 144 ${label} build status must remain validation-pending without a receipt.`);
    check(audit.local_validation_receipt == null, `Phase 144 ${label} data must not claim local validation without a receipt.`);
  }
};

const main = async () => {
  check(await exists(distRoot), `Missing production build directory: ${distRoot}`);
  if (!(await exists(distRoot))) throw new Error("Production output is required before v0.7-v0.9 post-build verification.");

  const programs = await Promise.all(programFiles.map((name) => readJson(join(dataRoot, name))));
  for (const [index, program] of programs.entries()) {
    const phaseExportRoutes = program.phases?.map((phase) => phase.public_export) ?? [];
    const phaseRegistries = await Promise.all(phaseExportRoutes.map((route) => readJson(join(dataRoot, route.replace(/^\/data\//, "")))));
    const expectedRoutes = [`/review/v${program.version.replace(".", "")}/`, ...phaseRegistries.flatMap((registry) => registry.public_html_routes ?? [])];
    const expectedExports = [...phaseExportRoutes, `/data/${programFiles[index]}`];
    check(sameSet(program.public_html_routes ?? [], expectedRoutes), `v${program.version} does not exactly inventory its version hub and five phase route sets.`);
    check(sameSet(program.public_json_exports ?? [], expectedExports), `v${program.version} does not exactly inventory its five phase exports and aggregate export.`);
  }
  const allFiles = await collectFiles(distRoot);
  const downloadsRoot = join(distRoot, "downloads");
  const htmlFiles = allFiles.filter((path) => extname(path).toLowerCase() === ".html" && !isInside(downloadsRoot, path));
  const dataDirectory = join(distRoot, "data");
  const publicJsonFiles = allFiles.filter(
    (path) => dirname(path) === dataDirectory && extname(path).toLowerCase() === ".json",
  );
  check(htmlFiles.length === expected.htmlPages, `Expected exactly ${expected.htmlPages} HTML pages outside /downloads, found ${htmlFiles.length}.`);
  check(publicJsonFiles.length === expected.publicJsonExports, `Expected exactly ${expected.publicJsonExports} top-level /data JSON exports, found ${publicJsonFiles.length}.`);

  const routeEntries = programs.flatMap((program) => program.public_html_routes ?? []);
  const routeInventory = [...new Set(routeEntries)];
  check(routeEntries.length === expected.editionRoutes, `Expected ${expected.editionRoutes} declared v0.7-v0.9 route entries, found ${routeEntries.length}.`);
  check(routeInventory.length === expected.editionRoutes, `Expected ${expected.editionRoutes} unique v0.7-v0.9 routes, found ${routeInventory.length}.`);
  const sitemapPath = join(distRoot, "sitemap.xml");
  check(await exists(sitemapPath), "The production sitemap is missing.");
  const sitemap = await exists(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
  for (const route of routeInventory) {
    if (!route.startsWith("/") || !route.endsWith("/") || route.includes("..")) {
      failures.push(`Unsafe or non-canonical route declaration: ${route}`);
      continue;
    }
    const path = join(distRoot, route.slice(1), "index.html");
    if (!(await exists(path))) {
      failures.push(`Missing HTML route ${route}`);
      continue;
    }
    const html = await readFile(path, "utf8");
    for (const [name, passed] of Object.entries(inspectRouteStructure(html, route))) {
      if (!passed) failures.push(`${route} failed the ${name} document-structure check.`);
    }
    if (!sitemap.includes(`<loc>https://ftfn.io${route}</loc>`)) failures.push(`Sitemap is missing ${route}`);
  }

  const exportEntries = programs.flatMap((program) => program.public_json_exports ?? []);
  const exportInventory = [...new Set(exportEntries)];
  check(exportEntries.length === expected.editionExports, `Expected ${expected.editionExports} declared v0.7-v0.9 export entries, found ${exportEntries.length}.`);
  check(exportInventory.length === expected.editionExports, `Expected ${expected.editionExports} unique v0.7-v0.9 exports, found ${exportInventory.length}.`);
  for (const route of exportInventory) {
    if (!route.startsWith("/data/") || !route.endsWith(".json") || route.includes("..")) {
      failures.push(`Unsafe or non-canonical export declaration: ${route}`);
      continue;
    }
    const path = join(distRoot, route.slice(1));
    if (!(await exists(path))) {
      failures.push(`Missing JSON export ${route}`);
      continue;
    }
    const dataset = await readJson(path);
    if (dataset.schema_version !== "1.0") failures.push(`${route} does not use schema_version 1.0.`);
  }

  const updateFiles = (await readdir(updateRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(updateRoot, entry.name));
  check(updateFiles.length === expected.updateEntries, `Expected exactly ${expected.updateEntries} update entries, found ${updateFiles.length}.`);
  const updatesPagePath = join(distRoot, "updates", "index.html");
  check(await exists(updatesPagePath), "The rendered /updates/ page is missing.");
  const updatesHtml = await exists(updatesPagePath) ? await readFile(updatesPagePath, "utf8") : "";
  const renderedUpdateRows = (updatesHtml.match(/<article\b[^>]*\bclass=(["'])[^"']*\bsource-row\b[^"']*\1/gi) ?? []).length;
  check(renderedUpdateRows === expected.updateEntries, `Expected ${expected.updateEntries} rendered update entries, found ${renderedUpdateRows}.`);
  for (const path of updateFiles) {
    const update = await readJson(path);
    if (!updatesHtml.includes(update.title) && !updatesHtml.includes(htmlEscape(update.title))) {
      failures.push(`/updates/ is missing the entry titled ${JSON.stringify(update.title)}.`);
    }
  }

  const receipt = await readOptionalJson(receiptPath);
  if (receipt) {
    check(receipt.schema_version === "1.0", "The Phase 144 receipt must use schema_version 1.0.");
    check(receipt.receipt_id === "144-LOCAL-VALIDATION-2026-08-30", "The Phase 144 receipt has the wrong identity.");
    check(receipt.validated_date === "2026-08-30", "The Phase 144 receipt must be dated 2026-08-30.");
    check(receipt.status === "Passed" && receipt.validation_result === "Passed local checks", "The Phase 144 receipt must record Passed local checks.");
    check(receipt.public_launch_authorized === false, "Local validation must not authorize public launch.");
    check(receipt.owner_acceptance === false, "Local validation must not claim owner acceptance.");
    check(receipt.hosted_deployment_authorized === false, "Local validation must not authorize hosted deployment.");
    check(receipt.v1_promotion_state === "Held", "The Phase 144 receipt must keep v1 promotion Held.");
    check(/^[a-f0-9]{64}$/.test(receipt.artifact_digest ?? ""), "The Phase 144 receipt must carry a SHA-256 candidate digest.");
    check(receipt.metrics?.html_pages_excluding_downloads === expected.htmlPages, "The receipt must record exactly 6,504 HTML pages.");
    check(receipt.metrics?.top_level_data_json_exports === expected.publicJsonExports, "The receipt must record exactly 86 top-level /data JSON exports.");
    check(receipt.metrics?.update_entries_rendered === expected.updateEntries, "The receipt must record exactly 169 rendered update entries.");
    check(receipt.metrics?.v07_v09_public_html_routes === expected.editionRoutes, "The receipt must record exactly 170 v0.7-v0.9 routes.");
    check(receipt.metrics?.v07_v09_public_json_exports === expected.editionExports, "The receipt must record exactly 18 v0.7-v0.9 exports.");
    check(receipt.metrics?.schema_1_0_exports === expected.editionExports, "The receipt must record 18 schema-1.0 v0.7-v0.9 exports.");
    check(Array.isArray(receipt.checks) && receipt.checks.length > requiredReceiptCommands.length, "The Phase 144 receipt must contain structural and command checks.");
    check(receipt.checks?.every((item) => item.status === "Passed"), "Every Phase 144 receipt check must be Passed.");
    for (const script of requiredReceiptCommands) {
      check(receipt.checks?.some((item) => item.command === `npm run ${script}`), `The Phase 144 receipt is missing npm run ${script}.`);
    }
  }

  const sourceAudit = await readJson(join(dataRoot, "phase-144-v1-launch-candidate-audit.json"));
  const builtAuditPath = join(distRoot, "data", "phase-144-v1-launch-candidate-audit.json");
  check(await exists(builtAuditPath), "The built Phase 144 JSON export is missing.");
  const builtAudit = await exists(builtAuditPath) ? await readJson(builtAuditPath) : {};
  verifyAuditState(sourceAudit, "source", receipt);
  verifyAuditState(builtAudit, "built", receipt);

  const builtV09Path = join(distRoot, "data", "v09-living-public-intelligence.json");
  check(await exists(builtV09Path), "The built v0.9 aggregate export is missing.");
  const builtV09 = await exists(builtV09Path) ? await readJson(builtV09Path) : {};
  for (const [label, program] of [["source", programs[2]], ["built", builtV09]]) {
    check(program.release_state?.v1_promotion === "Held", `The v0.9 ${label} aggregate must keep v1 promotion Held.`);
    check(program.status === (receipt ? "Complete locally" : "Candidate assembled — validation pending"), `The v0.9 ${label} aggregate has a receipt-inconsistent status.`);
  }

  if (failures.length) {
    console.error("v0.7-v0.9 post-build verification failed:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  const receiptState = receipt ? "dated local receipt embedded" : "validation gates pending";
  console.log(`v0.7-v0.9 post-build verification passed: ${htmlFiles.length} HTML pages, ${publicJsonFiles.length} public JSON exports, ${updateFiles.length} rendered updates, ${routeInventory.length} edition routes, ${exportInventory.length} schema-1.0 edition exports, ${receiptState}, and v1 Held.`);
};

main().catch((error) => {
  console.error("v0.7-v0.9 post-build verification failed:");
  console.error(`- ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
