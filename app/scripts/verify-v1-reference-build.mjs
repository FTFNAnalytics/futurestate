import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { computeV1refCandidateDigest, isValidV1refValidationReceipt } from "./lib/v1ref-candidate-digest.mjs";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(appRoot, "src", "data");
const distRoot = join(appRoot, "dist");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const routeToHtml = (route) => join(distRoot, route.replace(/^\//, "").replace(/\/$/, ""), "index.html");
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] ?? null;
const inspect = (html, canonicalRoute) => {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  const robots = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "robots") ?? "";
  const directives = (attribute(robots, "content") ?? "").toLowerCase().split(",").map((item) => item.trim());
  const viewport = metas.find((tag) => attribute(tag, "name")?.toLowerCase() === "viewport") ?? "";
  const viewportValue = (attribute(viewport, "content") ?? "").toLowerCase().replaceAll(" ", "");
  return {
    canonical: links.some((tag) => attribute(tag, "rel")?.toLowerCase() === "canonical" && attribute(tag, "href") === `https://ftfn.io${canonicalRoute}`),
    indexFollow: directives.includes("index") && directives.includes("follow"),
    language: attribute(htmlTag, "lang")?.toLowerCase() === "en",
    viewport: viewportValue.includes("width=device-width") && viewportValue.includes("initial-scale=1"),
    main: /<main\b/i.test(html),
    heading: /<h1\b/i.test(html),
    navigation: /<nav\b/i.test(html),
  };
};

check(await exists(distRoot), "Missing production build; run npm run build first.");
if (!(await exists(distRoot))) throw new Error("v1 reference build verification cannot continue without dist.");

const aggregate = await readJson(join(dataRoot, "v1-public-reference-edition.json"));
const phase204 = await readJson(join(dataRoot, "phase-204-v1-public-reference-edition-promotion-gate.json"));
const candidateDigest = await computeV1refCandidateDigest({ appRoot, aggregate });
const receipt = aggregate.local_validation_receipt;

check(aggregate.program_id === "FTFN-V1-PUBLIC-REFERENCE-EDITION" && aggregate.schema_version === "1.0" && aggregate.version === "v1ref", "The source aggregate identity is invalid.");
check(
  aggregate.counts?.phases === 24
  && aggregate.counts?.primary_records === 1048
  && aggregate.counts?.public_html_routes === 3216
  && aggregate.counts?.detail_routes === 1048
  && aggregate.counts?.native_declared_routes === 1071
  && aggregate.counts?.immutable_edition_routes === 1073
  && aggregate.counts?.canonical_reference_routes === 1073
  && aggregate.counts?.public_json_exports === 25
  && aggregate.counts?.publication_updates === 24
  && aggregate.counts?.canonical_topic_editions === 17
  && aggregate.counts?.question_briefs === 102,
  "The source aggregate inventory is not the exact 24-phase / 1,048-record / 3,216-route / 25-export / 24-update reference contract.",
);
check(aggregate.public_html_routes?.length === 3216 && new Set(aggregate.public_html_routes).size === 3216, "The public HTML route inventory is not exactly 3,216 unique routes.");
check(Object.keys(aggregate.canonical_route_map ?? {}).length === 3216 && aggregate.public_html_routes.every((route) => Boolean(aggregate.canonical_route_map[route])), "The canonical map does not cover every public HTML route.");
check(aggregate.canonical_html_routes?.length === 1073 && new Set(aggregate.canonical_html_routes).size === 1073 && aggregate.canonical_html_routes.every((route) => route.startsWith("/reference/")), "The canonical index inventory is not exactly 1,073 stable reference routes.");
check(aggregate.canonical_route_map?.["/reference/"] === "/reference/" && aggregate.canonical_route_map?.["/review/v1ref/"] === "/reference/", "The canonical root mapping is invalid.");
check(aggregate.public_json_exports?.length === 25 && new Set(aggregate.public_json_exports).size === 25, "The public JSON inventory is not exactly 25 unique exports.");
check(aggregate.publication_update_files?.length === 24 && new Set(aggregate.publication_update_files).size === 24, "The publication update inventory is not exactly 24 unique files.");
check(aggregate.local_validation_state === "Passed", "The source aggregate is not in Passed local-validation state.");
check(isValidV1refValidationReceipt({ receipt, aggregate, candidateDigest }), "The source aggregate lacks a current full Phase 181–204 digest-matching validation receipt.");
check(aggregate.phase_204_wave_validation_receipt?.receipt_type === "Local candidate validation", "The bounded Phase 197–203 wave receipt is not preserved separately.");
check(aggregate.v1_promotion_state === "Held" && aggregate.owner_acceptance === false && aggregate.github_publication_authorized === false && aggregate.hosted_deployment_authorized === false && aggregate.public_launch_authorized === false, "The source aggregate overstates owner, repository, hosting, launch, or v1 authority.");
check(phase204.v1_public_reference_promotion_state === "Held" && Object.values(phase204.owner_authority ?? {}).every((value) => value === false), "Phase 204 overstates promotion or owner authority.");

const builtAggregatePath = join(distRoot, "data", "v1-public-reference-edition.json");
check(await exists(builtAggregatePath), "The built v1 reference aggregate export is missing.");
if (await exists(builtAggregatePath)) check(JSON.stringify(aggregate) === JSON.stringify(await readJson(builtAggregatePath)), "The built v1 reference aggregate differs from source.");

for (const route of aggregate.public_json_exports ?? []) {
  const path = join(distRoot, route.replace(/^\//, ""));
  check(await exists(path), `Missing built export ${route}.`);
  if (await exists(path)) check((await readJson(path)).schema_version === "1.0", `Built export ${route} is not schema 1.0.`);
}

for (const route of aggregate.public_html_routes ?? []) {
  const path = routeToHtml(route);
  check(await exists(path), `Missing built route ${route}.`);
  if (!(await exists(path))) continue;
  const structure = inspect(await readFile(path, "utf8"), aggregate.canonical_route_map[route]);
  for (const [key, value] of Object.entries(structure)) check(value, `${route} failed ${key} structure check.`);
}

const sitemapPath = join(distRoot, "sitemap.xml");
check(await exists(sitemapPath), "Built sitemap is missing.");
if (await exists(sitemapPath)) {
  const sitemap = await readFile(sitemapPath, "utf8");
  for (const route of aggregate.canonical_html_routes ?? []) check(sitemap.includes(`<loc>https://ftfn.io${route}</loc>`), `Sitemap omits canonical route ${route}.`);
  for (const route of aggregate.public_html_routes?.filter((candidate) => aggregate.canonical_route_map[candidate] !== candidate) ?? []) {
    check(!sitemap.includes(`<loc>https://ftfn.io${route}</loc>`), `Sitemap includes non-canonical duplicate ${route}.`);
  }
}

if (failures.length) throw new Error(`v1 reference build verification failed:\n- ${failures.join("\n- ")}`);
console.log("v1 reference production verification passed: 3,216 structurally audited routes, 25 schema-1.0 exports, 24 dated updates, a current full Phase 181–204 receipt, and every owner/publication/hosting/launch/v1 authority held.");
