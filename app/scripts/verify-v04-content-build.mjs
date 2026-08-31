import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(appRoot, "dist");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const [program, authority, sourcesExport] = await Promise.all([
  readJson(appRoot, "src", "data", "v04-public-conversion-observatory.json"),
  readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json"),
  readJson(distRoot, "data", "sources.json"),
]);
const sitemap = await readFile(join(distRoot, "sitemap.xml"), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const routeFile = (route) => join(distRoot, route.replace(/^\//, ""), "index.html");

check(program.counts.public_html_routes === 189 && program.public_html_routes.length === 189, "The v0.4 public HTML inventory is incomplete.");
check(program.counts.public_json_exports === 5 && program.public_json_exports.length === 5, "The v0.4 public export inventory is incomplete.");

for (const route of program.public_html_routes) {
  try {
    const html = await readFile(routeFile(route), "utf8");
    check(html.includes(`<link rel="canonical" href="https://ftfn.io${route}"`), `${route} has the wrong canonical URL.`);
    check(html.includes('<meta name="robots" content="index, follow"'), `${route} is not indexable.`);
    check(sitemap.includes(`https://ftfn.io${route}`), `${route} is missing from the sitemap.`);
  } catch {
    failures.push(`Missing generated v0.4 route: ${route}`);
  }
}

for (const exportRoute of program.public_json_exports) {
  try {
    const exportRecord = await readJson(distRoot, exportRoute.replace(/^\//, ""));
    check(exportRecord.schema_version === "1.0", `${exportRoute} is not a schema 1.0 export.`);
  } catch {
    failures.push(`Missing or invalid v0.4 export: ${exportRoute}`);
  }
}

const sourceById = new Map(sourcesExport.records.map((source) => [source.id, source]));
for (const rail of authority.rails) {
  const source = sourceById.get(rail.source_id);
  check(source?.monitoring_status === "Candidate", `${rail.source_id} is missing from the public source export or advanced beyond Candidate.`);
  const route = `/atlas/sources/${rail.source_id}/`;
  try {
    const html = await readFile(routeFile(route), "utf8");
    check(html.includes(`<link rel="canonical" href="https://ftfn.io${route}"`), `${route} has the wrong canonical URL.`);
    check(sitemap.includes(`https://ftfn.io${route}`), `${route} is missing from the sitemap.`);
  } catch {
    failures.push(`Missing Phase 117 source page: ${route}`);
  }
}

const hub = await readFile(routeFile("/review/v04/"), "utf8");
const reviewIndex = await readFile(routeFile("/review/"), "utf8");
const dataIndex = await readFile(routeFile("/data/"), "utf8");
check(hub.includes("Make conversion visible") && hub.includes("Coverage is not a verdict"), "The v0.4 hub is missing its public objective or evidence boundary.");
check(reviewIndex.includes("Public Conversion Observatory") && reviewIndex.includes("Phases 116–119"), "The Review hub does not surface v0.4.");
check(dataIndex.includes("FTFN v0.4") && dataIndex.includes("v04-public-conversion-observatory.json"), "The data catalogue does not surface the v0.4 export.");

if (failures.length) {
  console.error("FTFN v0.4 build verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("FTFN v0.4 build verification passed: 189 canonical reading routes, 80 Candidate source pages, five public exports, sitemap coverage, and discovery surfaces.");
