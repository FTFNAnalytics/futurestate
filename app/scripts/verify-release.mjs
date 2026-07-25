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
const phase55YReviewPath = join(appRoot, "src", "data", "phase-55y-publication-review.json");
const phase55ZReviewPath = join(appRoot, "src", "data", "phase-55z-publication-review.json");
const phase56AReviewPath = join(appRoot, "src", "data", "phase-56a-publication-review.json");
const phase56BReviewPath = join(appRoot, "src", "data", "phase-56b-publication-review.json");
const phase56BPanelsPath = join(appRoot, "src", "data", "phase-56b-entity-panels.json");
const phase56CReviewPath = join(appRoot, "src", "data", "phase-56c-publication-review.json");
const phase56CDossiersPath = join(appRoot, "src", "data", "phase-56c-entity-dossiers.json");
const phase56DReviewPath = join(appRoot, "src", "data", "phase-56d-publication-review.json");
const phase56DTestsPath = join(appRoot, "src", "data", "phase-56d-alternative-tests.json");
const phase56EReviewPath = join(appRoot, "src", "data", "phase-56e-publication-review.json");
const phase56EPanelsPath = join(appRoot, "src", "data", "phase-56e-second-cohort-panels.json");
const phase56EDossiersPath = join(appRoot, "src", "data", "phase-56e-second-cohort-dossiers.json");
const phase56ETestsPath = join(appRoot, "src", "data", "phase-56e-second-cohort-tests.json");
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
const phase55YReview = await readJson(phase55YReviewPath);
const phase55ZReview = await readJson(phase55ZReviewPath);
const phase56AReview = await readJson(phase56AReviewPath);
const phase56BReview = await readJson(phase56BReviewPath);
const phase56BPanels = await readJson(phase56BPanelsPath);
const phase56CReview = await readJson(phase56CReviewPath);
const phase56CDossiers = await readJson(phase56CDossiersPath);
const phase56DReview = await readJson(phase56DReviewPath);
const phase56DTests = await readJson(phase56DTestsPath);
const phase56EReview = await readJson(phase56EReviewPath);
const phase56EPanels = await readJson(phase56EPanelsPath);
const phase56EDossiers = await readJson(phase56EDossiersPath);
const phase56ETests = await readJson(phase56ETestsPath);
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
  const expectedStatus = id === "dependency-map-autonomy-rules-are-not-service" ? "Published" : "In Review";
  check(dependencyMapStatusById.get(id) === expectedStatus, `Phase 55W held dependency map ${id} has the wrong current status.`);
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

const phase55YSignals = phase55YReview.signal_decisions;
const phase55YSignalIds = [...phase55YSignals.promoted, ...phase55YSignals.held];
check(phase55YReview.journey_count === 4, `Expected four Phase 55Y journeys, found ${phase55YReview.journey_count}.`);
check(phase55YReview.primary_record_count === 24, `Expected 24 Phase 55Y primary records, found ${phase55YReview.primary_record_count}.`);
check(phase55YSignals.reviewed === 12, `Expected 12 Phase 55Y signal decisions, found ${phase55YSignals.reviewed}.`);
check(phase55YSignals.promoted.length === 8, `Expected eight Phase 55Y Published signals, found ${phase55YSignals.promoted.length}.`);
check(phase55YSignals.held.length === 4, `Expected four Phase 55Y held signals, found ${phase55YSignals.held.length}.`);
check(new Set(phase55YSignalIds).size === 12, "Phase 55Y signal decision IDs must be unique.");
for (const id of phase55YSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 55Y Published signal ${id} has the wrong status.`);
}
for (const id of phase55YSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 55Y held signal ${id} has the wrong status.`);
}
const phase55YCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-operational-evidence-receiving-systems-2024-2026",
);
check(Boolean(phase55YCollection), "Phase 55Y operational-evidence research collection is missing.");
if (phase55YCollection) {
  check(phase55YCollection.document_ids.length === 24, `Expected 24 Phase 55Y documents, found ${phase55YCollection.document_ids.length}.`);
  const phase55YDocuments = phase55YCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(phase55YDocuments.length === 24, `Expected all 24 Phase 55Y documents to resolve, found ${phase55YDocuments.length}.`);
  check(
    phase55YDocuments.filter((document) => document.record_status === "Published").length === 20,
    "Phase 55Y must contain twenty Published research documents.",
  );
  check(
    phase55YDocuments.filter((document) => document.record_status === "In Review").length === 4,
    "Phase 55Y must contain four held research documents.",
  );
  check(
    phase55YDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 55Y research documents must use the declared official-link capture contract.",
  );
}
check(
  readerPathwayById.get("reader-pathway-autonomy-regulation-to-service")?.record_status === "Published",
  "Phase 55Y autonomy pathway should be Published.",
);
check(
  dependencyMapStatusById.get("dependency-map-autonomy-rules-are-not-service") === "Published",
  "Phase 55Y autonomy dependency map should be Published.",
);

const phase55ZSignals = phase55ZReview.signal_decisions;
const phase55ZSignalIds = [...phase55ZSignals.promoted, ...phase55ZSignals.held];
const phase55ZDocuments = phase55ZReview.document_decisions;
const phase55ZDocumentIds = [...phase55ZDocuments.published, ...phase55ZDocuments.held];
check(phase55ZReview.portfolio_count === 4, `Expected four Phase 55Z portfolios, found ${phase55ZReview.portfolio_count}.`);
check(phase55ZReview.primary_record_count === 32, `Expected 32 Phase 55Z primary records, found ${phase55ZReview.primary_record_count}.`);
check(phase55ZSignals.reviewed === 16, `Expected 16 Phase 55Z signal decisions, found ${phase55ZSignals.reviewed}.`);
check(phase55ZSignals.promoted.length === 12, `Expected twelve Phase 55Z Published signals, found ${phase55ZSignals.promoted.length}.`);
check(phase55ZSignals.held.length === 4, `Expected four Phase 55Z held signals, found ${phase55ZSignals.held.length}.`);
check(new Set(phase55ZSignalIds).size === 16, "Phase 55Z signal decision IDs must be unique.");
for (const id of phase55ZSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 55Z Published signal ${id} has the wrong status.`);
}
for (const id of phase55ZSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 55Z held signal ${id} has the wrong status.`);
}
check(phase55ZDocuments.reviewed === 32, `Expected 32 Phase 55Z document decisions, found ${phase55ZDocuments.reviewed}.`);
check(phase55ZDocuments.published.length === 28, `Expected 28 Phase 55Z Published documents, found ${phase55ZDocuments.published.length}.`);
check(phase55ZDocuments.held.length === 4, `Expected four Phase 55Z held documents, found ${phase55ZDocuments.held.length}.`);
check(new Set(phase55ZDocumentIds).size === 32, "Phase 55Z document decision IDs must be unique.");
const phase55ZCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-comparative-operating-outcomes-2023-2026",
);
check(Boolean(phase55ZCollection), "Phase 55Z comparative operating-outcomes research collection is missing.");
if (phase55ZCollection) {
  check(phase55ZCollection.document_ids.length === 32, `Expected 32 Phase 55Z documents, found ${phase55ZCollection.document_ids.length}.`);
  const resolvedPhase55ZDocuments = phase55ZCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase55ZDocuments.length === 32, `Expected all 32 Phase 55Z documents to resolve, found ${resolvedPhase55ZDocuments.length}.`);
  check(
    resolvedPhase55ZDocuments.filter((document) => document.record_status === "Published").length === 28,
    "Phase 55Z must contain 28 Published research documents.",
  );
  check(
    resolvedPhase55ZDocuments.filter((document) => document.record_status === "In Review").length === 4,
    "Phase 55Z must contain four held research documents.",
  );
  check(
    resolvedPhase55ZDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 55Z research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-004-comparative-operating-outcomes") === "Published",
  "Phase 55Z comparative operating-outcomes briefing should be Published.",
);
check(
  dependencyMapStatusById.get("dependency-map-comparative-outcomes-require-common-denominators") === "Published",
  "Phase 55Z comparison-protocol dependency map should be Published.",
);

const phase56ASignals = phase56AReview.signal_decisions;
const phase56ASignalIds = [...phase56ASignals.promoted, ...phase56ASignals.held];
const phase56ADocuments = phase56AReview.document_decisions;
const phase56ADocumentIds = [...phase56ADocuments.published, ...phase56ADocuments.held];
check(phase56AReview.portfolio_count === 4, `Expected four Phase 56A portfolios, found ${phase56AReview.portfolio_count}.`);
check(phase56AReview.series_count === 16, `Expected sixteen Phase 56A series, found ${phase56AReview.series_count}.`);
check(phase56AReview.primary_record_count === 48, `Expected 48 Phase 56A primary records, found ${phase56AReview.primary_record_count}.`);
check(phase56ASignals.reviewed === 20, `Expected 20 Phase 56A signal decisions, found ${phase56ASignals.reviewed}.`);
check(phase56ASignals.promoted.length === 16, `Expected sixteen Phase 56A Published signals, found ${phase56ASignals.promoted.length}.`);
check(phase56ASignals.held.length === 4, `Expected four Phase 56A held signals, found ${phase56ASignals.held.length}.`);
check(new Set(phase56ASignalIds).size === 20, "Phase 56A signal decision IDs must be unique.");
for (const id of phase56ASignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56A Published signal ${id} has the wrong status.`);
}
for (const id of phase56ASignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56A held signal ${id} has the wrong status.`);
}
check(phase56ADocuments.reviewed === 48, `Expected 48 Phase 56A document decisions, found ${phase56ADocuments.reviewed}.`);
check(phase56ADocuments.published.length === 44, `Expected 44 Phase 56A Published documents, found ${phase56ADocuments.published.length}.`);
check(phase56ADocuments.held.length === 4, `Expected four Phase 56A held documents, found ${phase56ADocuments.held.length}.`);
check(new Set(phase56ADocumentIds).size === 48, "Phase 56A document decision IDs must be unique.");
check(
  Object.keys(phase56AReview.series_records).length === 16 &&
    Object.values(phase56AReview.series_records).every((recordIds) => recordIds.length === 3),
  "Phase 56A must contain sixteen three-observation series.",
);
const phase56ACollection = researchCollections.find(
  (collection) => collection.id === "research-collection-longitudinal-operating-series-2020-2025",
);
check(Boolean(phase56ACollection), "Phase 56A longitudinal operating-series research collection is missing.");
if (phase56ACollection) {
  check(phase56ACollection.document_ids.length === 48, `Expected 48 Phase 56A documents, found ${phase56ACollection.document_ids.length}.`);
  const resolvedPhase56ADocuments = phase56ACollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56ADocuments.length === 48, `Expected all 48 Phase 56A documents to resolve, found ${resolvedPhase56ADocuments.length}.`);
  check(
    resolvedPhase56ADocuments.filter((document) => document.record_status === "Published").length === 44,
    "Phase 56A must contain 44 Published research documents.",
  );
  check(
    resolvedPhase56ADocuments.filter((document) => document.record_status === "In Review").length === 4,
    "Phase 56A must contain four held research documents.",
  );
  check(
    resolvedPhase56ADocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56A research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-005-longitudinal-operating-series") === "Published",
  "Phase 56A longitudinal operating-series briefing should be Published.",
);
check(
  phase56AReview.longitudinal_rule.includes("At least two compatible time points"),
  "Phase 56A publication review is missing the two-compatible-time-point rule.",
);
check(
  phase56AReview.comparison_rule.includes("No cross-domain comparison or ranking"),
  "Phase 56A publication review is missing the cross-domain comparison stop rule.",
);

const phase56BSignals = phase56BReview.signal_decisions;
const phase56BSignalIds = [...phase56BSignals.promoted, ...phase56BSignals.held];
const phase56BDocuments = phase56BReview.document_decisions;
check(phase56BReview.portfolio_count === 4, `Expected four Phase 56B portfolios, found ${phase56BReview.portfolio_count}.`);
check(phase56BReview.panel_count === 12, `Expected twelve Phase 56B panels, found ${phase56BReview.panel_count}.`);
check(phase56BReview.primary_record_count === 17, `Expected 17 Phase 56B primary records, found ${phase56BReview.primary_record_count}.`);
check(phase56BSignals.reviewed === 16, `Expected sixteen Phase 56B signal decisions, found ${phase56BSignals.reviewed}.`);
check(phase56BSignals.promoted.length === 12, `Expected twelve Phase 56B Published signals, found ${phase56BSignals.promoted.length}.`);
check(phase56BSignals.held.length === 4, `Expected four Phase 56B held signals, found ${phase56BSignals.held.length}.`);
check(new Set(phase56BSignalIds).size === 16, "Phase 56B signal decision IDs must be unique.");
for (const id of phase56BSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56B Published signal ${id} has the wrong status.`);
}
for (const id of phase56BSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56B held signal ${id} has the wrong status.`);
}
check(phase56BDocuments.reviewed === 17, `Expected 17 Phase 56B document decisions, found ${phase56BDocuments.reviewed}.`);
check(phase56BDocuments.published.length === 17, `Expected 17 Phase 56B Published documents, found ${phase56BDocuments.published.length}.`);
check(phase56BDocuments.held.length === 0, `Expected no Phase 56B held documents, found ${phase56BDocuments.held.length}.`);
check(phase56BPanels.panel_count === 12 && phase56BPanels.panels.length === 12, "Phase 56B entity-panel ledger must contain twelve panels.");
check(
  new Set(phase56BPanels.panels.map((panel) => panel.entity_id)).size === 12,
  "Phase 56B Published panels must have twelve unique stable entity IDs.",
);
for (const panel of phase56BPanels.panels) {
  check(panel.record_status === "Published", `Phase 56B panel ${panel.panel_id} should be Published.`);
  check(panel.observations.length >= 2, `Phase 56B panel ${panel.panel_id} needs at least two observations.`);
  check(
    [
      panel.entity_id,
      panel.indicator,
      panel.unit,
      panel.denominator,
      panel.period,
      panel.geography,
      panel.method,
      panel.attribution,
      panel.comparison_boundary,
    ].every(Boolean),
    `Phase 56B panel ${panel.panel_id} is missing a measurement-contract field.`,
  );
  check(
    panel.observations.every((observation) => observation.period && observation.label && observation.source_id),
    `Phase 56B panel ${panel.panel_id} has an incomplete observation.`,
  );
  check(
    panel.reporting_breaks.length > 0 && panel.missing_data.length > 0 && panel.merger_exit_notes.length > 0,
    `Phase 56B panel ${panel.panel_id} must preserve breaks, missing data, and identity-change handling.`,
  );
}
check(
  Object.keys(phase56BReview.portfolio_panels).length === 4
    && Object.values(phase56BReview.portfolio_panels).every((panelIds) => panelIds.length === 3),
  "Phase 56B must contain three named panels in each of four portfolios.",
);
const phase56BCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-entity-operating-panels-2021-2026",
);
check(Boolean(phase56BCollection), "Phase 56B entity operating-panel research collection is missing.");
if (phase56BCollection) {
  check(phase56BCollection.document_ids.length === 17, `Expected 17 Phase 56B documents, found ${phase56BCollection.document_ids.length}.`);
  const resolvedPhase56BDocuments = phase56BCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56BDocuments.length === 17, `Expected all 17 Phase 56B documents to resolve, found ${resolvedPhase56BDocuments.length}.`);
  check(
    resolvedPhase56BDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56B research documents should be Published.",
  );
  check(
    resolvedPhase56BDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56B research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-006-entity-operating-panels") === "Published",
  "Phase 56B entity operating-panel briefing should be Published.",
);
check(
  phase56BReview.entity_rule.includes("stable entity ID") && phase56BReview.entity_rule.includes("at least two compatible observations"),
  "Phase 56B publication review is missing the entity-panel publication rule.",
);
check(
  phase56BReview.context_rule.includes("National context and entity performance remain separate"),
  "Phase 56B publication review is missing the national-context boundary.",
);
check(
  phase56BReview.comparison_rule.includes("No cross-entity ranking"),
  "Phase 56B publication review is missing the cross-entity ranking stop rule.",
);

const phase56CSignals = phase56CReview.signal_decisions;
const phase56CSignalIds = [...phase56CSignals.promoted, ...phase56CSignals.held];
check(phase56CReview.source_count === 20, `Expected 20 Phase 56C source profiles, found ${phase56CReview.source_count}.`);
check(phase56CReview.document_count === 24, `Expected 24 Phase 56C documents, found ${phase56CReview.document_count}.`);
check(phase56CReview.dossier_count === 12, `Expected twelve Phase 56C dossiers, found ${phase56CReview.dossier_count}.`);
check(phase56CSignals.reviewed === 16, `Expected sixteen Phase 56C signal decisions, found ${phase56CSignals.reviewed}.`);
check(phase56CSignals.promoted.length === 12, `Expected twelve Phase 56C Published signals, found ${phase56CSignals.promoted.length}.`);
check(phase56CSignals.held.length === 4, `Expected four Phase 56C held signals, found ${phase56CSignals.held.length}.`);
check(new Set(phase56CSignalIds).size === 16, "Phase 56C signal decision IDs must be unique.");
for (const id of phase56CSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56C Published signal ${id} has the wrong status.`);
}
for (const id of phase56CSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56C held signal ${id} has the wrong status.`);
}
check(
  phase56CDossiers.dossier_count === 12 && phase56CDossiers.dossiers.length === 12,
  "Phase 56C entity-dossier ledger must contain twelve dossiers.",
);
check(
  new Set(phase56CDossiers.dossiers.map((dossier) => dossier.entity_id)).size === 12,
  "Phase 56C Published dossiers must preserve twelve unique stable entity IDs.",
);
for (const dossier of phase56CDossiers.dossiers) {
  check(dossier.record_status === "Published", `Phase 56C dossier ${dossier.dossier_id} should be Published.`);
  check(dossier.temporal_order.length === 4, `Phase 56C dossier ${dossier.dossier_id} must have four temporal stages.`);
  check(
    dossier.temporal_order.map((record) => record.stage).join("|")
      === "Baseline condition|Named intervention or input|Constraint|Observed outcome or later boundary",
    `Phase 56C dossier ${dossier.dossier_id} has an invalid temporal order.`,
  );
  check(
    [
      dossier.parent_panel_id,
      dossier.parent_signal_id,
      dossier.entity_id,
      dossier.attribution,
      dossier.independent_validation,
      dossier.causal_boundary,
    ].every(Boolean),
    `Phase 56C dossier ${dossier.dossier_id} is missing an attribution or entity-contract field.`,
  );
  check(
    dossier.alternative_explanations.length > 0 && dossier.next_records.length > 0 && dossier.source_ids.length > 0,
    `Phase 56C dossier ${dossier.dossier_id} must preserve alternative explanations and next records.`,
  );
  check(
    dossier.causal_boundary.includes("does not establish causation"),
    `Phase 56C dossier ${dossier.dossier_id} is missing the causal-inference hold.`,
  );
}
const phase56CCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-entity-driver-constraint-dossiers-2021-2026",
);
check(Boolean(phase56CCollection), "Phase 56C entity driver and constraint research collection is missing.");
if (phase56CCollection) {
  check(phase56CCollection.document_ids.length === 24, `Expected 24 Phase 56C documents, found ${phase56CCollection.document_ids.length}.`);
  const resolvedPhase56CDocuments = phase56CCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56CDocuments.length === 24, `Expected all 24 Phase 56C documents to resolve, found ${resolvedPhase56CDocuments.length}.`);
  check(
    resolvedPhase56CDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56C research documents should be Published.",
  );
  check(
    resolvedPhase56CDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56C research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-007-entity-driver-constraint-dossiers") === "Published",
  "Phase 56C entity driver and constraint briefing should be Published.",
);
check(
  phase56CReview.attribution_rule.includes("who made the claim"),
  "Phase 56C publication review is missing the attribution rule.",
);
check(
  phase56CReview.temporal_rule.includes("without converting sequence into proof"),
  "Phase 56C publication review is missing the temporal-order stop rule.",
);
check(
  phase56CReview.comparison_rule.includes("No ranking, composite score, readiness score"),
  "Phase 56C publication review is missing the comparison and scoring stop rule.",
);

const phase56DSignals = phase56DReview.signal_decisions;
const phase56DSignalIds = [...phase56DSignals.promoted, ...phase56DSignals.held];
check(phase56DReview.source_count === 20, `Expected 20 Phase 56D source profiles, found ${phase56DReview.source_count}.`);
check(phase56DReview.document_count === 24, `Expected 24 Phase 56D documents, found ${phase56DReview.document_count}.`);
check(phase56DReview.entity_test_count === 12, `Expected twelve Phase 56D entity tests, found ${phase56DReview.entity_test_count}.`);
check(phase56DSignals.reviewed === 16, `Expected sixteen Phase 56D signal decisions, found ${phase56DSignals.reviewed}.`);
check(phase56DSignals.promoted.length === 10, `Expected ten Phase 56D Published signals, found ${phase56DSignals.promoted.length}.`);
check(phase56DSignals.held.length === 6, `Expected six Phase 56D held signals, found ${phase56DSignals.held.length}.`);
check(new Set(phase56DSignalIds).size === 16, "Phase 56D signal decision IDs must be unique.");
for (const id of phase56DSignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56D Published signal ${id} has the wrong status.`);
}
for (const id of phase56DSignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56D held signal ${id} has the wrong status.`);
}
check(
  phase56DTests.test_count === 12 && phase56DTests.tests.length === 12,
  "Phase 56D alternative-explanation ledger must contain twelve entity tests.",
);
check(
  new Set(phase56DTests.tests.map((test) => test.entity_id)).size === 12,
  "Phase 56D tests must preserve twelve unique stable entity IDs.",
);
check(
  phase56DTests.tests.filter((test) => test.record_status === "Published").length === 10
    && phase56DTests.tests.filter((test) => test.record_status === "In Review").length === 2,
  "Phase 56D entity tests must contain ten Published and two In Review records.",
);
for (const test of phase56DTests.tests) {
  check(
    [
      test.parent_dossier_id,
      test.parent_panel_id,
      test.entity_id,
      test.signal_id,
      test.compatibility,
      test.result,
      test.attribution,
      test.validation_status,
      test.causal_boundary,
    ].every(Boolean),
    `Phase 56D test ${test.test_id} is missing a compatibility, attribution, validation, or parent-contract field.`,
  );
  check(
    test.source_ids.length === 2
      && test.tested_alternative_explanations.length > 0
      && test.later_observations.length === 2
      && test.next_records.length > 0,
    `Phase 56D test ${test.test_id} must preserve two records, named alternatives, two observations, and next records.`,
  );
  check(
    test.causal_boundary.includes("does not establish causation"),
    `Phase 56D test ${test.test_id} is missing the causal-inference boundary.`,
  );
}
const phase56DCollection = researchCollections.find(
  (collection) => collection.id === "research-collection-repeat-outcomes-alternative-explanation-tests-2010-2026",
);
check(Boolean(phase56DCollection), "Phase 56D repeat-outcome and alternative-test research collection is missing.");
if (phase56DCollection) {
  check(phase56DCollection.document_ids.length === 24, `Expected 24 Phase 56D documents, found ${phase56DCollection.document_ids.length}.`);
  const resolvedPhase56DDocuments = phase56DCollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56DDocuments.length === 24, `Expected all 24 Phase 56D documents to resolve, found ${resolvedPhase56DDocuments.length}.`);
  check(
    resolvedPhase56DDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56D research documents should be Published.",
  );
  check(
    resolvedPhase56DDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56D research documents must use the declared official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-008-repeat-outcomes-alternative-tests") === "Published",
  "Phase 56D repeat-outcome and alternative-test briefing should be Published.",
);
check(
  phase56DReview.compatibility_rule.includes("entity, unit, denominator, method, and observation window"),
  "Phase 56D publication review is missing the compatibility rule.",
);
check(
  phase56DReview.alternative_rule.includes("named Phase 56C alternative explanations"),
  "Phase 56D publication review is missing the alternative-explanation rule.",
);
check(
  phase56DReview.closure_rule.includes("Regulator-verified closure"),
  "Phase 56D publication review is missing the closure-attribution rule.",
);
check(
  phase56DReview.comparison_rule.includes("No causal effect, ranking, composite score, readiness score"),
  "Phase 56D publication review is missing the causal, comparison, and scoring stop rule.",
);

const phase56ESignals = phase56EReview.signal_decisions;
const phase56ESignalIds = [...phase56ESignals.promoted, ...phase56ESignals.held];
check(phase56EReview.source_count === 40, `Expected 40 Phase 56E source profiles, found ${phase56EReview.source_count}.`);
check(phase56EReview.document_count === 48, `Expected 48 Phase 56E documents, found ${phase56EReview.document_count}.`);
check(phase56EReview.entity_count === 12, `Expected twelve Phase 56E entities, found ${phase56EReview.entity_count}.`);
check(phase56EReview.vertical_layer_count === 36, `Expected 36 Phase 56E entity layers, found ${phase56EReview.vertical_layer_count}.`);
check(
  phase56EReview.cohort_screen.screened === 12
    && phase56EReview.cohort_screen.retained === 12
    && phase56EReview.cohort_screen.held_for_insufficient_evidence === 0,
  "Phase 56E cohort screen must retain all twelve screened entities with no insufficient-evidence holds.",
);
check(phase56ESignals.reviewed === 40, `Expected 40 Phase 56E signal decisions, found ${phase56ESignals.reviewed}.`);
check(phase56ESignals.promoted.length === 36, `Expected 36 Phase 56E Published signals, found ${phase56ESignals.promoted.length}.`);
check(phase56ESignals.held.length === 4, `Expected four Phase 56E held signals, found ${phase56ESignals.held.length}.`);
check(new Set(phase56ESignalIds).size === 40, "Phase 56E signal decision IDs must be unique.");
for (const id of phase56ESignals.promoted) {
  check(signalStatusById.get(id) === "Published", `Phase 56E Published signal ${id} has the wrong status.`);
}
for (const id of phase56ESignals.held) {
  check(signalStatusById.get(id) === "In Review", `Phase 56E held signal ${id} has the wrong status.`);
}

check(
  phase56EPanels.panel_count === 12 && phase56EPanels.panels.length === 12,
  "Phase 56E panel ledger must contain twelve entity panels.",
);
check(
  phase56EDossiers.dossier_count === 12 && phase56EDossiers.dossiers.length === 12,
  "Phase 56E dossier ledger must contain twelve entity dossiers.",
);
check(
  phase56ETests.test_count === 12 && phase56ETests.tests.length === 12,
  "Phase 56E test ledger must contain twelve alternative-explanation tests.",
);
const phase56EPanelEntityIds = new Set(phase56EPanels.panels.map((panel) => panel.entity_id));
const phase56EDossierEntityIds = new Set(phase56EDossiers.dossiers.map((dossier) => dossier.entity_id));
const phase56ETestEntityIds = new Set(phase56ETests.tests.map((test) => test.entity_id));
check(phase56EPanelEntityIds.size === 12, "Phase 56E panels must preserve twelve unique stable entity IDs.");
check(
  [...phase56EPanelEntityIds].every((id) => phase56EDossierEntityIds.has(id) && phase56ETestEntityIds.has(id)),
  "Every Phase 56E entity must resolve across the panel, dossier, and test ledgers.",
);
for (const panel of phase56EPanels.panels) {
  check(
    [
      panel.panel_id,
      panel.entity_id,
      panel.indicator,
      panel.unit,
      panel.denominator,
      panel.method,
      panel.attribution,
      panel.signal_id,
      panel.comparison_boundary,
    ].every(Boolean),
    `Phase 56E panel ${panel.panel_id} is missing a measurement or publication-contract field.`,
  );
  check(
    panel.source_ids.length >= 3
      && panel.observations.length >= 3
      && panel.reporting_breaks.length > 0
      && panel.next_records.length > 0,
    `Phase 56E panel ${panel.panel_id} is missing source, observation, break, or next-record coverage.`,
  );
}
for (const dossier of phase56EDossiers.dossiers) {
  check(
    [
      dossier.dossier_id,
      dossier.parent_panel_id,
      dossier.entity_id,
      dossier.signal_id,
      dossier.attribution,
      dossier.temporal_boundary,
    ].every(Boolean),
    `Phase 56E dossier ${dossier.dossier_id} is missing its parent, attribution, or temporal boundary.`,
  );
  check(
    dossier.source_ids.length === 4
      && dossier.driver_candidates.length > 0
      && dossier.constraints.length > 0
      && dossier.alternative_explanations.length > 0
      && dossier.next_records.length > 0,
    `Phase 56E dossier ${dossier.dossier_id} is missing its four-record or driver-and-constraint contract.`,
  );
}
for (const test of phase56ETests.tests) {
  check(
    [
      test.test_id,
      test.parent_dossier_id,
      test.parent_panel_id,
      test.entity_id,
      test.signal_id,
      test.compatibility,
      test.result,
      test.attribution,
      test.validation_status,
      test.causal_boundary,
    ].every(Boolean),
    `Phase 56E test ${test.test_id} is missing a compatibility, attribution, validation, or parent-contract field.`,
  );
  check(
    test.source_ids.length === 2
      && test.tested_alternative_explanations.length > 0
      && test.later_observations.length === 2
      && test.next_records.length > 0,
    `Phase 56E test ${test.test_id} must preserve two later records, named alternatives, two observations, and next records.`,
  );
  check(
    test.causal_boundary.includes("do not establish causation"),
    `Phase 56E test ${test.test_id} is missing the causal-inference boundary.`,
  );
}
const phase56ECollection = researchCollections.find(
  (collection) => collection.id === "research-collection-second-entity-cohort-vertical-replication-2018-2026",
);
check(Boolean(phase56ECollection), "Phase 56E second-cohort research collection is missing.");
if (phase56ECollection) {
  check(phase56ECollection.document_ids.length === 48, `Expected 48 Phase 56E documents, found ${phase56ECollection.document_ids.length}.`);
  const resolvedPhase56EDocuments = phase56ECollection.document_ids
    .map((documentId) => researchDocumentById.get(documentId))
    .filter(Boolean);
  check(resolvedPhase56EDocuments.length === 48, `Expected all 48 Phase 56E documents to resolve, found ${resolvedPhase56EDocuments.length}.`);
  check(
    resolvedPhase56EDocuments.every((document) => document.record_status === "Published"),
    "All Phase 56E research documents should be Published.",
  );
  check(
    resolvedPhase56EDocuments.every((document) => document.capture_status === "Official link record"),
    "Phase 56E research documents must use the official-link capture contract.",
  );
}
check(
  briefingStatusById.get("briefing-research-watch-009-second-cohort-vertical-replication") === "Published",
  "Phase 56E second-cohort briefing should be Published.",
);
check(
  phase56EReview.vertical_rule.includes("panel, driver-and-constraint dossier, and alternative-explanation test"),
  "Phase 56E review is missing the vertical-replication rule.",
);
check(
  phase56EReview.attribution_rule.includes("who made the claim"),
  "Phase 56E review is missing the attribution rule.",
);
check(
  phase56EReview.compatibility_rule.includes("Entity, unit, denominator, method, attribution, and observation window"),
  "Phase 56E review is missing the compatibility rule.",
);
check(
  phase56EReview.comparison_rule.includes("No causal effect, ranking, composite score, readiness score"),
  "Phase 56E review is missing the causal, comparison, and scoring stop rule.",
);

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
