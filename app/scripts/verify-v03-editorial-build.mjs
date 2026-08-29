import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(appRoot, "dist");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const program = await readJson(appRoot, "src", "data", "v03-editorial-program.json");
const exportData = await readJson(distRoot, "data", "v03-editorial-review.json");
const sitemap = await readFile(join(distRoot, "sitemap.xml"), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const routeFile = (route) => join(distRoot, route.replace(/^\//, ""), "index.html");

const routes = program.phases.flatMap((phase) => phase.routes);
check(exportData.schema_version === "1.0" && exportData.dataset === "v03_editorial_review" && exportData.count === 120, "The public v0.3 export is incomplete.");
for (const route of routes) {
  try {
    const path = routeFile(route);
    await access(path);
    const html = await readFile(path, "utf8");
    check(html.includes(`<link rel="canonical" href="https://ftfn.io${route}"`), `${route} has the wrong canonical URL.`);
    check(html.includes('<meta name="robots" content="index, follow"'), `${route} is not indexable.`);
    check(sitemap.includes(`https://ftfn.io${route}`), `${route} is missing from the sitemap.`);
  } catch {
    failures.push(`Missing generated route: ${route}`);
  }
}
for (const pilot of program.translation_pilots) check(!sitemap.includes(`/${pilot.language.toLowerCase()}/`), `${pilot.language} pilot leaked into the sitemap.`);
const reviewHtml = await readFile(routeFile("/review/"), "utf8");
check(reviewHtml.includes("The FTFN Review") && reviewHtml.includes("Narrative casebooks") && reviewHtml.includes("Living publication"), "The Review hub is incomplete.");
const homeHtml = await readFile(routeFile("/"), "utf8");
check(homeHtml.includes('href="/review/"'), "The homepage does not link to the Review.");

if (failures.length) {
  console.error("FTFN v0.3 build verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("FTFN v0.3 build verification passed: 120 indexed routes and one public export.");
