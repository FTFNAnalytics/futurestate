import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1octDigestFromDisk, isValidV1octValidationReceipt } from "./lib/v1oct-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data"), updatesRoot = join(appRoot, "src", "content", "updates"), sourcesRoot = join(appRoot, "src", "content", "sources"), distRoot = join(appRoot, "dist");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const routeToHtml = (route) => join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] ?? null;
const inspect = (html, route) => {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const links = html.match(/<link\b[^>]*>/gi) ?? [], metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  const robots = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "robots") ?? "";
  const directives = (attribute(robots, "content") ?? "").toLowerCase().split(",").map((item) => item.trim());
  const viewport = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "viewport") ?? "";
  const viewportValue = (attribute(viewport, "content") ?? "").toLowerCase().replaceAll(" ", "");
  return { canonical: links.some((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical" && attribute(tag, "href") === `https://ftfn.io${route}`), indexFollow: directives.includes("index") && directives.includes("follow"), language: attribute(htmlTag, "lang")?.toLowerCase() === "en", viewport: viewportValue.includes("width=device-width") && viewportValue.includes("initial-scale=1"), main: /<main\b/i.test(html), heading: /<h1\b/i.test(html), navigation: /<nav\b/i.test(html) };
};

check(await exists(distRoot), "Missing production build; run npm run build first.");
if (!(await exists(distRoot))) throw new Error("Phase 173–180 build verification cannot continue without dist.");
const aggregate = await readJson(join(dataRoot, "v1-october-operating-program.json"));
const p180 = await readJson(join(dataRoot, "phase-180-october-state-report-and-v1-promotion-gate.json"));
const digest = await computeV1octDigestFromDisk({ dataRoot, updatesRoot, sourcesRoot });
check(aggregate.counts.primary_records === 267 && aggregate.public_html_routes.length === 260 && aggregate.public_json_exports.length === 9 && aggregate.publication_update_files.length === 8, "The source aggregate inventory is not 267/260/9/8.");
check(p180.counts.passed === 8 && p180.counts.held === 8 && p180.counts.pending_build === 0, "Phase 180 must be 8 Pass / 8 Held / 0 Pending after validation.");
check(isValidV1octValidationReceipt({ receipt: p180.local_validation_receipt, aggregate, candidateDigest: digest }), "Phase 180 lacks a current digest-matching validation receipt.");
check(JSON.stringify(p180.local_validation_receipt) === JSON.stringify(aggregate.local_validation_receipt), "Phase 180 and aggregate receipts differ.");
check(aggregate.v1_promotion_state === "Held" && p180.v1_promotion_state === "Held" && Object.values(p180.owner_authority).every((value) => value === false), "The built candidate overstates owner, publication, or v1 authority.");

const builtAggregatePath = join(distRoot, "data", "v1-october-operating-program.json");
check(await exists(builtAggregatePath), "The built v1oct aggregate export is missing.");
if (await exists(builtAggregatePath)) check(JSON.stringify(aggregate) === JSON.stringify(await readJson(builtAggregatePath)), "The built v1oct aggregate differs from source.");
for (const route of aggregate.public_json_exports) {
  const path = join(distRoot, route.replace(/^\//, ""));
  check(await exists(path), `Missing built export ${route}.`);
  if (await exists(path)) check((await readJson(path)).schema_version === "1.0", `Built export ${route} is not schema 1.0.`);
}
for (const route of aggregate.public_html_routes) {
  const path = routeToHtml(route);
  check(await exists(path), `Missing built route ${route}.`);
  if (!(await exists(path))) continue;
  const html = await readFile(path, "utf8");
  const structure = inspect(html, route);
  for (const [key, value] of Object.entries(structure)) check(value, `${route} failed ${key} structure check.`);
}
const sitemapPath = join(distRoot, "sitemap.xml");
check(await exists(sitemapPath), "Built sitemap is missing.");
if (await exists(sitemapPath)) {
  const sitemap = await readFile(sitemapPath, "utf8");
  for (const route of aggregate.public_html_routes) check(sitemap.includes(`https://ftfn.io${route}`), `Sitemap omits ${route}.`);
}
if (failures.length) throw new Error(`Phase 173–180 build verification failed:\n- ${failures.join("\n- ")}`);
console.log("Phase 173–180 production verification passed: 260 structurally audited routes, 9 schema-1.0 exports, a current digest-bound receipt, 8 Pass / 8 Held, and v1 Held.");
