import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(appRoot, "dist");
const atlas = JSON.parse(await readFile(join(appRoot, "src", "data", "phase-119-deep-project-place-atlas.json"), "utf8"));
const publicExport = JSON.parse(await readFile(join(distRoot, "data", "deep-project-place-atlas.json"), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const routeFile = (route) => join(distRoot, route.replace(/^\//, ""), "index.html");
const routes = [
  atlas.routes.project_index,
  atlas.routes.place_index,
  ...atlas.projects.map((record) => record.routes.atlas),
  ...atlas.places.map((record) => record.routes.atlas),
];

check(routes.length === 41 && new Set(routes).size === 41, "The Phase 119 HTML route inventory must contain 41 unique routes.");
check(publicExport.schema_version === "1.0" && publicExport.dataset === "deep_project_place_atlas", "The Phase 119 public export has the wrong contract.");
check(publicExport.counts.projects_total === 24 && publicExport.counts.places_total === 15, "The Phase 119 public export is incomplete.");

for (const route of routes) {
  try {
    const path = routeFile(route);
    await access(path);
    const html = await readFile(path, "utf8");
    check(html.includes(`<link rel="canonical" href="https://ftfn.io${route}"`), `${route} has the wrong canonical URL.`);
    check(html.includes('<meta name="robots" content="index, follow"'), `${route} is not indexable.`);
  } catch {
    failures.push(`Missing generated Phase 119 route: ${route}`);
  }
}

const projectIndex = await readFile(routeFile(atlas.routes.project_index), "utf8");
const placeIndex = await readFile(routeFile(atlas.routes.place_index), "utf8");
check(projectIndex.includes("24 named cases") && projectIndex.includes("8 governed conversion files") && projectIndex.includes("16 curated evidence cases"), "The Project Atlas index is missing tier counts.");
check(placeIndex.includes("15 place systems") && placeIndex.includes("5 canonical local profiles") && placeIndex.includes("10 curated portraits"), "The Place Atlas index is missing tier counts.");

const vbb = await readFile(routeFile("/atlas/projects/victoria-big-battery/"), "utf8");
check(vbb.includes("3 records") && vbb.includes("Victorian Big Battery moved from a commissioning fire"), "The Victorian Big Battery route did not repair the prior empty keyword result.");
const expandedCasebook = await readFile(routeFile("/review/casebooks/expanded/victoria-big-battery/"), "utf8");
check(expandedCasebook.includes("3 Published signals") && expandedCasebook.includes("Open the canonical Project Atlas file"), "The prior expanded casebook does not resolve to its explicit Phase 119 shelf.");

if (failures.length > 0) {
  console.error("FTFN Phase 119 build verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("FTFN Phase 119 build verification passed: 41 canonical HTML routes, one public JSON export, and explicit expanded-casebook evidence resolution.");
