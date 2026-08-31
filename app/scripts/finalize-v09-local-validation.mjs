import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const updateRoot = join(appRoot, "src", "content", "updates");
const distRoot = join(appRoot, "dist");
const receiptPath = join(dataRoot, "phase-144-local-validation-receipt.json");
const validationDate = "2026-08-30";

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

const validationScripts = [
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

const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
};

const hasRouteStructure = (html, route) => {
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

const digestFiles = async (paths) => {
  const hash = createHash("sha256");
  for (const path of [...new Set(paths)].sort()) {
    hash.update(relative(distRoot, path).replaceAll("\\", "/"));
    hash.update("\0");
    hash.update(await readFile(path));
    hash.update("\0");
  }
  return hash.digest("hex");
};

const stateCounts = (audit) => ({
  passed: audit.launch_gates?.filter((gate) => gate.state === "Pass").length ?? 0,
  held: audit.launch_gates?.filter((gate) => gate.state === "Held").length ?? 0,
  pending: audit.launch_gates?.filter((gate) => gate.state === "Pending build").length ?? 0,
});

const sameSet = (left, right) => left.length === right.length
  && new Set(left).size === left.length
  && new Set(right).size === right.length
  && left.every((item) => new Set(right).has(item));

const inspectPendingCandidate = async () => {
  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };

  check(await exists(distRoot), `Missing production build directory: ${distRoot}`);
  if (failures.length) return { failures };

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

  const routeLists = programs.map((program) => program.public_html_routes ?? []);
  const routeInventory = [...new Set(routeLists.flat())];
  check(routeLists.flat().length === expected.editionRoutes, `Expected ${expected.editionRoutes} declared v0.7-v0.9 route entries, found ${routeLists.flat().length}.`);
  check(routeInventory.length === expected.editionRoutes, `Expected ${expected.editionRoutes} unique v0.7-v0.9 routes, found ${routeInventory.length}.`);

  const sitemapPath = join(distRoot, "sitemap.xml");
  check(await exists(sitemapPath), "The production sitemap is missing.");
  const sitemap = await exists(sitemapPath) ? await readFile(sitemapPath, "utf8") : "";
  const routeFiles = [];
  for (const route of routeInventory) {
    if (!route.startsWith("/") || !route.endsWith("/") || route.includes("..")) {
      failures.push(`Unsafe or non-canonical route declaration: ${route}`);
      continue;
    }
    const path = join(distRoot, route.slice(1), "index.html");
    routeFiles.push(path);
    if (!(await exists(path))) {
      failures.push(`Missing HTML route ${route}`);
      continue;
    }
    const html = await readFile(path, "utf8");
    const structure = hasRouteStructure(html, route);
    for (const [name, passed] of Object.entries(structure)) {
      if (!passed) failures.push(`${route} failed the ${name} document-structure check.`);
    }
    if (!sitemap.includes(`<loc>https://ftfn.io${route}</loc>`)) failures.push(`Sitemap is missing ${route}`);
  }

  const exportLists = programs.map((program) => program.public_json_exports ?? []);
  const exportInventory = [...new Set(exportLists.flat())];
  check(exportLists.flat().length === expected.editionExports, `Expected ${expected.editionExports} declared v0.7-v0.9 export entries, found ${exportLists.flat().length}.`);
  check(exportInventory.length === expected.editionExports, `Expected ${expected.editionExports} unique v0.7-v0.9 exports, found ${exportInventory.length}.`);
  const editionExportFiles = [];
  for (const route of exportInventory) {
    if (!route.startsWith("/data/") || !route.endsWith(".json") || route.includes("..")) {
      failures.push(`Unsafe or non-canonical export declaration: ${route}`);
      continue;
    }
    const path = join(distRoot, route.slice(1));
    editionExportFiles.push(path);
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

  const sourceAudit = await readJson(join(dataRoot, "phase-144-v1-launch-candidate-audit.json"));
  const builtAuditPath = join(distRoot, "data", "phase-144-v1-launch-candidate-audit.json");
  check(await exists(builtAuditPath), "The built Phase 144 JSON export is missing.");
  const builtAudit = await exists(builtAuditPath) ? await readJson(builtAuditPath) : {};
  for (const [label, audit] of [["source", sourceAudit], ["built", builtAudit]]) {
    const states = stateCounts(audit);
    check(audit.v1_promotion_state === "Held", `Phase 144 ${label} data must keep v1 promotion Held.`);
    check(audit.launch_gates?.length === 14, `Phase 144 ${label} data must contain fourteen launch gates.`);
    check(states.passed === 8 && states.held === 4 && states.pending === 2, `Phase 144 ${label} data must be in the pre-receipt 8 Pass / 4 Held / 2 Pending build state.`);
    check(audit.counts?.passed === 8 && audit.counts?.held === 4 && audit.counts?.pending_build === 2 && audit.counts?.false_passes === 0, `Phase 144 ${label} count fields must match the pre-receipt gate state with zero false passes.`);
    check(audit.build_status === "Candidate assembled — validation pending", `Phase 144 ${label} build status must remain validation-pending before the receipt is issued.`);
    check(audit.local_validation_receipt == null, `Phase 144 ${label} data already embeds a local validation receipt.`);
  }
  check(programs[2]?.release_state?.v1_promotion === "Held", "The v0.9 aggregate must keep v1 promotion Held.");
  check(programs[2]?.status === "Candidate assembled — validation pending", "The v0.9 aggregate must remain validation-pending before the receipt is issued.");
  const builtV09Path = join(distRoot, "data", "v09-living-public-intelligence.json");
  check(await exists(builtV09Path), "The built v0.9 aggregate export is missing.");
  const builtV09 = await exists(builtV09Path) ? await readJson(builtV09Path) : {};
  check(builtV09.release_state?.v1_promotion === "Held", "The built v0.9 aggregate must keep v1 promotion Held.");
  check(builtV09.status === "Candidate assembled — validation pending", "The built v0.9 aggregate must remain validation-pending before the receipt is issued.");

  const digestInputs = [...htmlFiles, ...publicJsonFiles, sitemapPath, join(distRoot, "robots.txt")]
    .filter((path) => allFiles.includes(path) || path === sitemapPath);
  const artifactDigest = failures.length === 0 ? await digestFiles(digestInputs) : null;

  return {
    failures,
    artifactDigest,
    metrics: {
      html_pages_excluding_downloads: htmlFiles.length,
      top_level_data_json_exports: publicJsonFiles.length,
      update_entries_rendered: updateFiles.length,
      v07_v09_public_html_routes: routeInventory.length,
      v07_v09_public_json_exports: exportInventory.length,
      schema_1_0_exports: editionExportFiles.length,
      structurally_audited_routes: routeFiles.length,
    },
  };
};

const fail = (heading, failures) => {
  console.error(heading);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
};

const main = async () => {
  if (await exists(receiptPath)) {
    fail("Phase 144 local validation was not finalized:", [
      "A local validation receipt already exists. Receipts are immutable; verify the existing receipt or remove it only through an explicit governed correction.",
    ]);
  }

  const initial = await inspectPendingCandidate();
  if (initial.failures.length) fail("Phase 144 local validation preflight failed; no receipt was written:", initial.failures);

  const commandChecks = [];
  for (const script of validationScripts) {
    console.log(`\n[Phase 144] npm run ${script}`);
    const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
    const args = process.platform === "win32"
      ? ["/d", "/s", "/c", `npm.cmd run ${script}`]
      : ["run", script];
    const result = spawnSync(command, args, { cwd: appRoot, stdio: "inherit", shell: false });
    if (result.error || result.status !== 0) {
      const detail = result.error ? result.error.message : `exit code ${result.status}`;
      fail("Phase 144 local validation failed; no receipt was written:", [`npm run ${script} failed (${detail}).`]);
    }
    commandChecks.push({ check_id: `npm-run-${script.replaceAll(":", "-")}`, status: "Passed", command: `npm run ${script}` });
  }

  const final = await inspectPendingCandidate();
  if (final.failures.length) fail("The production candidate changed or failed after validation; no receipt was written:", final.failures);
  if (final.artifactDigest !== initial.artifactDigest) {
    fail("The production candidate changed during validation; no receipt was written:", [
      `Initial digest ${initial.artifactDigest}; final digest ${final.artifactDigest}.`,
    ]);
  }

  const structuralChecks = [
    ["production-html-inventory", `${final.metrics.html_pages_excluding_downloads} HTML pages outside /downloads`],
    ["public-json-inventory", `${final.metrics.top_level_data_json_exports} top-level /data JSON exports`],
    ["update-index-rendering", `${final.metrics.update_entries_rendered} source update entries rendered on /updates/`],
    ["edition-route-inventory", `${final.metrics.v07_v09_public_html_routes} unique v0.7-v0.9 routes`],
    ["edition-route-structure", `${final.metrics.structurally_audited_routes} routes checked for canonical, index/follow, language, viewport, main, h1, navigation, and sitemap coverage`],
    ["edition-export-inventory", `${final.metrics.v07_v09_public_json_exports} unique v0.7-v0.9 JSON exports`],
    ["schema-contract", `${final.metrics.schema_1_0_exports} v0.7-v0.9 exports use schema_version 1.0`],
    ["v1-promotion-boundary", "v1 promotion remains Held"],
  ].map(([check_id, detail]) => ({ check_id, status: "Passed", detail }));

  const receipt = {
    schema_version: "1.0",
    receipt_id: "144-LOCAL-VALIDATION-2026-08-30",
    phase: 144,
    validated_date: validationDate,
    status: "Passed",
    validation_result: "Passed local checks",
    scope: "Local production candidate validation only; this receipt is not owner acceptance or public-launch authorization.",
    artifact_digest_algorithm: "sha256",
    artifact_digest: final.artifactDigest,
    metrics: final.metrics,
    checks: [...structuralChecks, ...commandChecks],
    public_launch_authorized: false,
    owner_acceptance: false,
    hosted_deployment_authorized: false,
    v1_promotion_state: "Held",
    next_action: "Regenerate v0.7-v0.9 so Phase 144 embeds this receipt, rebuild production output, and rerun post-build and release verification before any separate owner-acceptance decision.",
  };

  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(`\nPhase 144 local validation passed. Wrote ${receiptPath}.`);
  console.log("Public launch is not authorized, owner acceptance is false, and v1 promotion remains Held.");
};

main().catch((error) => {
  console.error("Phase 144 local validation failed; no receipt was written:");
  console.error(`- ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
