import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = join(appRoot, "dist");
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const program = await readJson(appRoot, "src", "data", "v031-content-expansion.json");
const exportData = await readJson(distRoot, "data", "v031-content-expansion.json");
const sitemap = await readFile(join(distRoot, "sitemap.xml"), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const routeFile = (route) => join(distRoot, route.replace(/^\//, ""), "index.html");
const routes = program.phases.flatMap((phase) => phase.routes);

check(exportData.schema_version === "1.0" && exportData.dataset === "v031_content_expansion" && exportData.count === 54, "The v0.3.1 public export is incomplete.");
for (const route of routes) {
  try {
    const path = routeFile(route);
    await access(path);
    const html = await readFile(path, "utf8");
    check(html.includes(`<link rel="canonical" href="https://ftfn.io${route}"`), `${route} has the wrong canonical URL.`);
    check(html.includes('<meta name="robots" content="index, follow"'), `${route} is not indexable.`);
    check(sitemap.includes(`https://ftfn.io${route}`), `${route} is missing from the sitemap.`);
  } catch { failures.push(`Missing generated route: ${route}`); }
}
for (const pilot of program.translation_pilots) check(!sitemap.includes(`/${pilot.language.toLowerCase()}/`), `${pilot.language} pilot leaked into the sitemap.`);
const hub = await readFile(routeFile("/review/"), "utf8");
check(hub.includes("Evidence in public context") && hub.includes("Twenty-four named casebooks"), "The Review hub is missing the expansion shelf.");

if (failures.length) {
  console.error("FTFN v0.3.1 build verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("FTFN v0.3.1 build verification passed: 54 indexed routes and one public export.");
