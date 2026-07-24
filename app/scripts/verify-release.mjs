import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const workspaceRoot = resolve(appRoot, "..");
const distRoot = join(appRoot, "dist");
const manifestPath = join(workspaceRoot, "deployment", "ftfn-v0.2-build.json");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const readText = (path) => readFile(path, "utf8");
const readJson = async (path) => JSON.parse(await readText(path));

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(path) : [path];
    }),
  );
  return nested.flat();
}

function routeToHtml(route) {
  const cleanRoute = route.replace(/^\//, "").replace(/\/$/, "");
  return join(distRoot, cleanRoute, "index.html");
}

function hasRobots(html, expected) {
  const tag = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? "";
  const content = tag.match(/content=["']([^"']+)["']/i)?.[1] ?? "";
  return content.toLowerCase().replace(/\s+/g, " ") === expected;
}

function hasCanonical(html, expected) {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ?? "";
  return tag.includes(`href="${expected}"`) || tag.includes(`href='${expected}'`);
}

const manifest = await readJson(manifestPath);
const signals = await readJson(join(distRoot, "data", "signals.json"));
const sources = await readJson(join(distRoot, "data", "sources.json"));
const topics = await readJson(join(distRoot, "data", "topics.json"));
const sitemap = await readText(join(distRoot, "sitemap.xml"));
const robots = await readText(join(distRoot, "robots.txt"));
const updatesHtml = await readText(join(distRoot, "updates", "index.html"));
const atlasHtml = await readText(join(distRoot, "atlas", "index.html"));
const researchCollectionDirectory = join(appRoot, "src", "content", "research-collections");
const researchDocumentDirectory = join(appRoot, "src", "content", "research-documents");
const readerPathwayDirectory = join(appRoot, "src", "content", "reader-pathways");
const researchCollectionFiles = (await readdir(researchCollectionDirectory)).filter((name) => name.endsWith(".json"));
const researchDocumentFiles = (await readdir(researchDocumentDirectory)).filter((name) => name.endsWith(".json"));
const readerPathwayFiles = (await readdir(readerPathwayDirectory)).filter((name) => name.endsWith(".json"));
const researchCollections = await Promise.all(
  researchCollectionFiles.map((name) => readJson(join(researchCollectionDirectory, name))),
);
const researchDocuments = await Promise.all(
  researchDocumentFiles.map((name) => readJson(join(researchDocumentDirectory, name))),
);
const readerPathways = await Promise.all(
  readerPathwayFiles.map((name) => readJson(join(readerPathwayDirectory, name))),
);
const allDistFiles = await collectFiles(distRoot);
const downloadsRoot = join(distRoot, "downloads");
const htmlCount = allDistFiles.filter(
  (path) => extname(path) === ".html" && !path.startsWith(downloadsRoot),
).length;
const publicTextExtensions = new Set([".html", ".json", ".xml", ".txt", ".js", ".css"]);
const publicTextFiles = allDistFiles.filter((path) => publicTextExtensions.has(extname(path)));
const publicBuildText = (await Promise.all(publicTextFiles.map((path) => readText(path)))).join("\n");

check(htmlCount === manifest.expected_build.static_pages, `Expected ${manifest.expected_build.static_pages} HTML files, found ${htmlCount}.`);
check(signals.count === manifest.expected_build.published_signals, `Expected ${manifest.expected_build.published_signals} exported signals, found ${signals.count}.`);
check(sources.count === manifest.expected_build.sources, `Expected ${manifest.expected_build.sources} exported sources, found ${sources.count}.`);
check(topics.count === manifest.expected_build.topics, `Expected ${manifest.expected_build.topics} exported topics, found ${topics.count}.`);
check(
  researchCollections.length === manifest.expected_build.research_collections,
  `Expected ${manifest.expected_build.research_collections} research collections, found ${researchCollections.length}.`,
);
check(
  researchDocuments.length === manifest.expected_build.research_documents,
  `Expected ${manifest.expected_build.research_documents} research documents, found ${researchDocuments.length}.`,
);
check(
  readerPathways.length === manifest.expected_build.reader_pathways,
  `Expected ${manifest.expected_build.reader_pathways} reader pathways, found ${readerPathways.length}.`,
);
check(signals.schema_version === "1.0" && sources.schema_version === "1.0" && topics.schema_version === "1.0", "All public exports must use schema version 1.0.");
check(signals.records.every((record) => record.record_status === "Published"), "Signal export contains a non-Published record.");
check(!JSON.stringify(signals).includes('"editorial_notes"'), "Signal export leaked editorial_notes.");
check(!JSON.stringify(sources).includes('"automation_notes"') && !JSON.stringify(sources).includes('"notes"'), "Source export leaked private notes.");
check(!publicBuildText.includes("candidate-source-"), "Public build leaked a private source-candidate ID.");
check(!publicBuildText.includes("private-data/source-candidates"), "Public build references the private candidate registry path.");

const researchDocumentById = new Map(researchDocuments.map((document) => [document.id, document]));
for (const collection of researchCollections) {
  const collectionRoute = `/research/${collection.slug}/`;
  const collectionHtml = await readText(routeToHtml(collectionRoute));
  check(hasCanonical(collectionHtml, `${manifest.canonical_site}${collectionRoute}`), `${collectionRoute} has the wrong canonical URL.`);
  for (const documentId of collection.document_ids) {
    const document = researchDocumentById.get(documentId);
    check(Boolean(document), `${collection.id} references missing research document ${documentId}.`);
    if (document) {
      check(
        collectionHtml.includes(`/research/documents/${document.slug}/`),
        `${collectionRoute} is missing research document route: ${document.slug}.`,
      );
    }
  }
}

const expectedResearchLocations = [
  ...researchCollections
    .filter((collection) => collection.record_status === "Published")
    .map((collection) => `${manifest.canonical_site}/research/${collection.slug}/`),
  ...researchDocuments
    .filter((document) => document.record_status === "Published")
    .map((document) => `${manifest.canonical_site}/research/documents/${document.slug}/`),
].sort();
const researchLocations = [...sitemap.matchAll(/<loc>(https:\/\/ftfn\.io\/research\/[^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .sort();
check(
  JSON.stringify(researchLocations) === JSON.stringify(expectedResearchLocations),
  "Sitemap research membership does not match the Published research collection.",
);

for (const requiredPath of manifest.required_output_files) {
  const absolutePath = join(appRoot, requiredPath);
  check(allDistFiles.includes(absolutePath), `Missing required output: ${requiredPath}.`);
}

check(robots.includes("User-agent: *"), "robots.txt is missing the user-agent rule.");
check(robots.includes("Allow: /"), "robots.txt is missing the allow rule.");
check(robots.includes("Sitemap: https://ftfn.io/sitemap.xml"), "robots.txt does not reference the canonical sitemap.");
check(!sitemap.includes("127.0.0.1") && !sitemap.includes("localhost"), "sitemap.xml contains a local URL.");

const signalLocations = [...sitemap.matchAll(/<loc>(https:\/\/ftfn\.io\/signals\/[^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedSignalLocations = manifest.published_signal_routes.map((route) => `${manifest.canonical_site}${route}`).sort();
check(signalLocations.length === expectedSignalLocations.length, `Expected ${expectedSignalLocations.length} signal URLs in the sitemap, found ${signalLocations.length}.`);
check(JSON.stringify(signalLocations.sort()) === JSON.stringify(expectedSignalLocations), "Sitemap signal membership does not match the Published export.");

const sourceById = new Map(sources.records.map((record) => [record.id, record]));
const publishedSourceIds = [...new Set(signals.records.flatMap((record) => record.source_ids))];
const publishedSupportMinimumDate =
  manifest.last_verified.published_support_minimum_date ?? manifest.last_verified.date;
check(
  publishedSourceIds.length === manifest.expected_build.published_support_sources,
  `Expected ${manifest.expected_build.published_support_sources} unique Published-support sources, found ${publishedSourceIds.length}.`,
);
for (const sourceId of publishedSourceIds) {
  const source = sourceById.get(sourceId);
  check(Boolean(source), `Published source ${sourceId} is missing from the source export.`);
  check(
    source?.last_checked_date >= publishedSupportMinimumDate,
    `Published source ${sourceId} was not checked on or after ${publishedSupportMinimumDate}.`,
  );
}

for (const record of signals.records) {
  const html = await readText(routeToHtml(record.path));
  check(hasRobots(html, "index, follow"), `${record.path} is missing index, follow.`);
  check(hasCanonical(html, `${manifest.canonical_site}${record.path}`), `${record.path} has the wrong canonical URL.`);
}

for (const [label, route] of Object.entries(manifest.indexing_samples)) {
  const html = await readText(routeToHtml(route));
  const expectedRobots = label.startsWith("published_") ? "index, follow" : "noindex, follow";
  check(hasRobots(html, expectedRobots), `${route} is missing ${expectedRobots}.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  if (expectedRobots.startsWith("noindex")) {
    check(!sitemap.includes(`${manifest.canonical_site}${route}`), `${route} should not appear in the sitemap.`);
  }
}

const synthesisRouteGroups = [
  {
    label: "briefing",
    published: manifest.published_briefing_routes,
    inReview: manifest.in_review_briefing_routes,
  },
  {
    label: "dependency map",
    published: manifest.published_dependency_map_routes,
    inReview: manifest.in_review_dependency_map_routes,
  },
];

for (const group of synthesisRouteGroups) {
  for (const route of group.published) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "index, follow"), `${route} is missing index, follow.`);
    check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
    check(sitemap.includes(`${manifest.canonical_site}${route}`), `Published ${group.label} ${route} is missing from the sitemap.`);
  }

  for (const route of group.inReview) {
    const html = await readText(routeToHtml(route));
    check(hasRobots(html, "noindex, follow"), `${route} is missing noindex, follow.`);
    check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
    check(!sitemap.includes(`${manifest.canonical_site}${route}`), `In Review ${group.label} ${route} should not appear in the sitemap.`);
  }
}

check(
  manifest.reader_pathway_routes.length === manifest.expected_build.reader_pathway_surfaces,
  `Expected ${manifest.expected_build.reader_pathway_surfaces} reader-pathway surfaces, found ${manifest.reader_pathway_routes.length}.`,
);
check(
  atlasHtml.includes("data-reader-pathway-index"),
  "Atlas index is missing the reader-pathway index.",
);
for (const pathway of readerPathways) {
  check(atlasHtml.includes(pathway.title), `Atlas index is missing reader pathway: ${pathway.title}.`);
}
for (const route of manifest.reader_pathway_routes) {
  const html = await readText(routeToHtml(route));
  check(html.includes("data-reader-pathway="), `${route} is missing a reader pathway.`);
  check(html.includes("Current State"), `${route} is missing the Current State section.`);
  check(html.includes("Dependency Stack"), `${route} is missing the Dependency Stack section.`);
  check(html.includes("Evidence Limits"), `${route} is missing the Evidence Limits section.`);
  check(html.includes("Published Evidence"), `${route} is missing the Published Evidence section.`);
  check(html.includes("What To Watch Next"), `${route} is missing the What To Watch Next section.`);
  check(hasCanonical(html, `${manifest.canonical_site}${route}`), `${route} has the wrong canonical URL.`);
  check(sitemap.includes(`${manifest.canonical_site}${route}`), `${route} is missing from the sitemap.`);
}

const updateDirectory = join(appRoot, "src", "content", "updates");
const updateFiles = (await readdir(updateDirectory)).filter((name) => name.endsWith(".json"));
check(updateFiles.length === manifest.expected_build.updates, `Expected ${manifest.expected_build.updates} update records, found ${updateFiles.length}.`);
for (const filename of updateFiles) {
  const update = await readJson(join(updateDirectory, filename));
  check(updatesHtml.includes(update.title), `Update page is missing: ${update.title}.`);
}

if (failures.length > 0) {
  console.error("FTFN v0.2 release verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("FTFN v0.2 release verification passed.");
console.log(`${htmlCount} HTML pages; ${signals.count} Published signals; ${sources.count} sources; ${topics.count} topics; ${updateFiles.length} updates.`);
console.log(
  `${publishedSourceIds.length} Published-support sources checked on or after ${publishedSupportMinimumDate}.`,
);
console.log(`${researchCollections.length} research collection; ${researchDocuments.length} research documents; downloadable archive present.`);
console.log(
  `${manifest.published_briefing_routes.length} Published briefings; ${manifest.published_dependency_map_routes.length} Published dependency maps.`,
);
console.log(
  `${readerPathways.length} reader pathways across ${manifest.reader_pathway_routes.length} existing Atlas surfaces.`,
);
console.log("Robots, sitemap, canonical, indexing, reader pathways, required outputs, private-registry exclusion, and public export boundaries passed.");
