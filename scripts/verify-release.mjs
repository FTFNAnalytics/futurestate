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
const researchExport = await readJson(join(distRoot, "data", "research.json"));
const pathwaysExport = await readJson(join(distRoot, "data", "pathways.json"));
const sitemap = await readText(join(distRoot, "sitemap.xml"));
const robots = await readText(join(distRoot, "robots.txt"));
const updatesHtml = await readText(join(distRoot, "updates", "index.html"));
const atlasHtml = await readText(join(distRoot, "atlas", "index.html"));
const researchCollectionDirectory = join(appRoot, "src", "content", "research-collections");
const researchDocumentDirectory = join(appRoot, "src", "content", "research-documents");
const readerPathwayDirectory = join(appRoot, "src", "content", "reader-pathways");
const evidenceGapDirectory = join(appRoot, "src", "content", "evidence-gaps");
const localSystemDirectory = join(appRoot, "src", "content", "local-systems");
const briefingDirectory = join(appRoot, "src", "content", "briefings");
const dependencyMapDirectory = join(appRoot, "src", "content", "dependency-maps");
const signalDirectory = join(appRoot, "src", "content", "signals");
const phase55WReviewPath = join(appRoot, "src", "data", "phase-55w-publication-review.json");
const phase55XReviewPath = join(appRoot, "src", "data", "phase-55x-publication-review.json");
const researchCollectionFiles = (await readdir(researchCollectionDirectory)).filter((name) => name.endsWith(".json"));
const researchDocumentFiles = (await readdir(researchDocumentDirectory)).filter((name) => name.endsWith(".json"));
const readerPathwayFiles = (await readdir(readerPathwayDirectory)).filter((name) => name.endsWith(".json"));
const evidenceGapFiles = (await readdir(evidenceGapDirectory)).filter((name) => name.endsWith(".json"));
const localSystemFiles = (await readdir(localSystemDirectory)).filter(
  (name) => name.endsWith(".md") || name.endsWith(".mdx"),
);
const briefingFiles = (await readdir(briefingDirectory)).filter(
  (name) => name.endsWith(".md") || name.endsWith(".mdx"),
);
const dependencyMapFiles = (await readdir(dependencyMapDirectory)).filter((name) => name.endsWith(".json"));
const signalFiles = (await readdir(signalDirectory)).filter(
  (name) => name.endsWith(".md") || name.endsWith(".mdx"),
);
const researchCollections = await Promise.all(
  researchCollectionFiles.map((name) => readJson(join(researchCollectionDirectory, name))),
);
const researchDocuments = await Promise.all(
  researchDocumentFiles.map((name) => readJson(join(researchDocumentDirectory, name))),
);
const readerPathways = await Promise.all(
  readerPathwayFiles.map((name) => readJson(join(readerPathwayDirectory, name))),
);
const phase55WReview = await readJson(phase55WReviewPath);
const phase55XReview = await readJson(phase55XReviewPath);
const evidenceGaps = await Promise.all(
  evidenceGapFiles.map((name) => readJson(join(evidenceGapDirectory, name))),
);
const allDistFiles = await collectFiles(distRoot);
const downloadsRoot = join(distRoot, "downloads");
const htmlCount = allDistFiles.filter(
  (path) => extname(path) === ".html" && !path.startsWith(downloadsRoot),
).length;
const publicTextExtensions = new Set([".html", ".json", ".xml", ".txt", ".js", ".css"]);
const publicTextFiles = allDistFiles.filter((path) => publicTextExtensions.has(extname(path)));
const publicBuildText = (await Promise.all(publicTextFiles.map((path) => readText(path)))).join("\n");
const signalStatusById = new Map(
  await Promise.all(
    signalFiles.map(async (name) => {
      const text = await readText(join(signalDirectory, name));
      const id = text.match(/^id:\s*"([^"]+)"/m)?.[1];
      const status = text.match(/^record_status:\s*"([^"]+)"/m)?.[1];
      return [id, status];
    }),
  ),
);
const briefingStatusById = new Map(
  await Promise.all(
    briefingFiles.map(async (name) => {
      const text = await readText(join(briefingDirectory, name));
      const id = text.match(/^id:\s*"([^"]+)"/m)?.[1];
      const status = text.match(/^record_status:\s*"([^"]+)"/m)?.[1];
      return [id, status];
    }),
  ),
);
const dependencyMapStatusById = new Map(
  await Promise.all(
    dependencyMapFiles.map(async (name) => {
      const map = await readJson(join(dependencyMapDirectory, name));
      return [map.id, map.record_status];
    }),
  ),
);

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
check(
  evidenceGaps.length === manifest.expected_build.evidence_gaps,
  `Expected ${manifest.expected_build.evidence_gaps} evidence gaps, found ${evidenceGaps.length}.`,
);
check(
  localSystemFiles.length === manifest.expected_build.local_systems,
  `Expected ${manifest.expected_build.local_systems} local systems, found ${localSystemFiles.length}.`,
);
check(
  briefingFiles.length === manifest.expected_build.briefings,
  `Expected ${manifest.expected_build.briefings} briefings, found ${briefingFiles.length}.`,
);
check(
  dependencyMapFiles.length === manifest.expected_build.dependency_maps,
  `Expected ${manifest.expected_build.dependency_maps} dependency maps, found ${dependencyMapFiles.length}.`,
);
check(
  [signals, sources, topics, researchExport, pathwaysExport].every((dataset) => dataset.schema_version === "1.0"),
  "All public exports must use schema version 1.0.",
);
check(manifest.expected_build.public_json_exports === 5, "Manifest must record five public JSON exports.");
check(
  researchExport.count === manifest.expected_build.research_export_records,
  `Expected ${manifest.expected_build.research_export_records} research export records, found ${researchExport.count}.`,
);
check(
  pathwaysExport.count === manifest.expected_build.published_reader_pathways,
  `Expected ${manifest.expected_build.published_reader_pathways} pathway export records, found ${pathwaysExport.count}.`,
);
check(signals.records.every((record) => record.record_status === "Published"), "Signal export contains a non-Published record.");
check(
  pathwaysExport.records.every((record) => record.record_status === "Published"),
  "Pathway export contains a non-Published record.",
);
check(
  researchExport.records.every((record) => record.record_status === "Published"),
  "Research export contains a non-Published record.",
);
check(!JSON.stringify(signals).includes('"editorial_notes"'), "Signal export leaked editorial_notes.");
check(!JSON.stringify(sources).includes('"automation_notes"') && !JSON.stringify(sources).includes('"notes"'), "Source export leaked private notes.");
check(!publicBuildText.includes("candidate-source-"), "Public build leaked a private source-candidate ID.");
check(!publicBuildText.includes("private-data/source-candidates"), "Public build references the private candidate registry path.");

const phase55WSignals = phase55WReview.signal_decisions;
const phase55WSignalIds = [
  ...phase55WSignals.promoted,
  ...phase55WSignals.held,
  ...phase55WSignals.published_controls_confirmed,
];
check(phase55WSignals.reviewed === 45, `Expected 45 Phase 55W signal decisions, found ${phase55WSignals.reviewed}.`);
check(phase55WSignals.promoted.length === 12, `Expected 12 Phase 55W promotions, found ${phase55WSignals.promoted.length}.`);
check(phase55WSignals.held.length === 27, `Expected 27 Phase 55W holds, found ${phase55WSignals.held.length}.`);
check(
  phase55WSignals.published_controls_confirmed.length === 6,
  `Expected six Phase 55W Published controls, found ${phase55WSignals.published_controls_confirmed.length}.`,
);
check(new Set(phase55WSignalIds).size === 45, "Phase 55W signal decision IDs must be unique.");
for (const id of phase55WSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 55W promoted signal ${id} is not Published.`);
}
for (const id of phase55WSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 55W held signal ${id} is not In Review.`);
}
for (const id of phase55WSignals.published_controls_confirmed) {
  check(signalStatusById.get(id) === "Published", `Phase 55W control signal ${id} is not Published.`);
}

const phase55WSynthesis = phase55WReview.synthesis_decisions;
for (const id of phase55WSynthesis.published_briefings) {
  check(briefingStatusById.get(id) === "Published", `Phase 55W Published briefing ${id} has the wrong status.`);
}
for (const id of phase55WSynthesis.held_briefings) {
  check(briefingStatusById.get(id) === "In Review", `Phase 55W held briefing ${id} has the wrong status.`);
}
for (const id of phase55WSynthesis.published_dependency_maps) {
  check(dependencyMapStatusById.get(id) === "Published", `Phase 55W Published dependency map ${id} has the wrong status.`);
}
for (const id of phase55WSynthesis.held_dependency_maps) {
  check(dependencyMapStatusById.get(id) === "In Review", `Phase 55W held dependency map ${id} has the wrong status.`);
}

const researchDocumentById = new Map(researchDocuments.map((document) => [document.id, document]));
const readerPathwayById = new Map(readerPathways.map((pathway) => [pathway.id, pathway]));
const phase55XSignals = phase55XReview.signal_decisions;
const phase55XResearch = phase55XReview.research_decisions;
const phase55XSynthesis = phase55XReview.synthesis_decisions;
const phase55XSignalIds = [...phase55XSignals.published, ...phase55XSignals.held];
check(phase55XSignals.reviewed === 12, `Expected 12 Phase 55X signal decisions, found ${phase55XSignals.reviewed}.`);
check(phase55XSignals.published.length === 8, `Expected eight Phase 55X Published signals, found ${phase55XSignals.published.length}.`);
check(phase55XSignals.held.length === 4, `Expected four Phase 55X held signals, found ${phase55XSignals.held.length}.`);
check(new Set(phase55XSignalIds).size === 12, "Phase 55X signal decision IDs must be unique.");
for (const id of phase55XSignals.published) {
  check(signalStatusById.get(id) === "Published", `Phase 55X Published signal ${id} has the wrong status.`);
}
for (const id of phase55XSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 55X held signal ${id} has the wrong status.`);
}
const phase55XCollection = researchCollections.find(
  (collection) => collection.id === phase55XResearch.collection_id,
);
check(Boolean(phase55XCollection), "Phase 55X local implementation research collection is missing.");
check(phase55XResearch.documents_reviewed === 24, `Expected 24 Phase 55X research decisions, found ${phase55XResearch.documents_reviewed}.`);
if (phase55XCollection) {
  check(phase55XCollection.document_ids.length === 24, `Expected 24 Phase 55X documents, found ${phase55XCollection.document_ids.length}.`);
  const phase55XDocuments = phase55XCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(
    phase55XDocuments.filter((document) => document.record_status === "Published").length === 22,
    "Phase 55X must contain twenty-two Published research documents.",
  );
  check(
    phase55XDocuments.filter((document) => document.record_status === "In Review").length === 2,
    "Phase 55X must contain two held research documents.",
  );
  check(
    phase55XDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 55X research documents must use the declared official-link capture contract.",
  );
}
for (const id of phase55XResearch.held_documents) {
  check(researchDocumentById.get(id)?.record_status === "In Review", `Phase 55X held research document ${id} has the wrong status.`);
}
for (const id of phase55XSynthesis.held_briefings) {
  check(briefingStatusById.get(id) === "In Review", `Phase 55X held briefing ${id} has the wrong status.`);
}
for (const id of phase55XSynthesis.pathways_remaining_in_review) {
  check(readerPathwayById.get(id)?.record_status === "In Review", `Phase 55X pathway ${id} should remain In Review.`);
}

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

const phase55VCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-cross-corridor-infrastructure-conversion-2024-2026",
);
check(Boolean(phase55VCollection), "Phase 55V cross-corridor research collection is missing.");
if (phase55VCollection) {
  const phase55VDocuments = phase55VCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(phase55VDocuments.length === 18, `Expected 18 Phase 55V research documents, found ${phase55VDocuments.length}.`);
  check(
    phase55VDocuments.filter((document) => document.capture_status === "Original file captured").length === 4,
    "Phase 55V must contain four captured official files.",
  );
  check(
    phase55VDocuments.filter((document) => document.capture_status === "Official link record").length === 14,
    "Phase 55V must contain fourteen official-link records.",
  );
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

const signalsIndexHtml = await readText(join(distRoot, "signals", "index.html"));
const researchIndexHtml = await readText(join(distRoot, "research", "index.html"));
const sourceMonitorHtml = await readText(join(distRoot, "atlas", "source-monitor", "index.html"));
const dataIndexHtml = await readText(join(distRoot, "data", "index.html"));
check(
  signalsIndexHtml.includes('data-filter="evidence"')
    && signalsIndexHtml.includes('data-filter="sourceType"')
    && signalsIndexHtml.includes('data-filter="watchLane"'),
  "Signal index is missing Phase 55W evidence, source-type, or watch-lane filters.",
);
check(researchIndexHtml.includes("data-research-filter"), "Research index is missing the Phase 55W document-shelf filter.");
check(sourceMonitorHtml.includes("data-source-filter"), "Source Monitor is missing the Phase 55W corpus filter.");
check(
  dataIndexHtml.includes("/data/research.json") && dataIndexHtml.includes("/data/pathways.json"),
  "Data index is missing the Phase 55W research or pathway export.",
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

check(
  manifest.published_briefing_routes.length === manifest.expected_build.published_briefings,
  `Expected ${manifest.expected_build.published_briefings} Published briefing routes, found ${manifest.published_briefing_routes.length}.`,
);
check(
  manifest.in_review_briefing_routes.length === manifest.expected_build.in_review_briefings,
  `Expected ${manifest.expected_build.in_review_briefings} In Review briefing routes, found ${manifest.in_review_briefing_routes.length}.`,
);
check(
  manifest.published_dependency_map_routes.length === manifest.expected_build.published_dependency_maps,
  `Expected ${manifest.expected_build.published_dependency_maps} Published dependency-map routes, found ${manifest.published_dependency_map_routes.length}.`,
);
check(
  manifest.in_review_dependency_map_routes.length === manifest.expected_build.in_review_dependency_maps,
  `Expected ${manifest.expected_build.in_review_dependency_maps} In Review dependency-map routes, found ${manifest.in_review_dependency_map_routes.length}.`,
);

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

const phase55QDecisions = evidenceGaps.filter((gap) => gap.latest_review?.phase === "Phase 55Q");
check(
  phase55QDecisions.length === manifest.expected_build.phase_55q_gap_decisions,
  `Expected ${manifest.expected_build.phase_55q_gap_decisions} Phase 55Q evidence decisions, found ${phase55QDecisions.length}.`,
);
const expectedPhase55QRoutes = phase55QDecisions
  .map((gap) => `/atlas/evidence-gaps/${gap.slug}/`)
  .sort();
check(
  JSON.stringify(expectedPhase55QRoutes) === JSON.stringify([...manifest.phase_55q_gap_routes].sort()),
  "Phase 55Q evidence-gap route membership does not match the manifest.",
);
for (const gap of phase55QDecisions) {
  const route = `/atlas/evidence-gaps/${gap.slug}/`;
  const html = await readText(routeToHtml(route));
  check(html.includes('data-evidence-decision="Phase 55Q"'), `${route} is missing the Phase 55Q decision marker.`);
  check(html.includes("Named Authoritative Records"), `${route} is missing named authoritative records.`);
  check(html.includes("Stage Result"), `${route} is missing the stage result.`);
  check(html.includes("Stop Rule"), `${route} is missing the stop rule.`);
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
console.log(`${localSystemFiles.length} local systems; ${phase55QDecisions.length} Phase 55Q evidence-gap decisions passed.`);
console.log("Robots, sitemap, canonical, indexing, reader pathways, evidence decisions, required outputs, private-registry exclusion, and public export boundaries passed.");
