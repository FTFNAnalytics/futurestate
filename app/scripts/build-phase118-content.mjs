import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");

const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const words = (value) => String(value).trim().split(/\s+/).filter(Boolean).length;
const frontmatter = (raw) => raw.split(/^---\s*$/m)[1] ?? "";
const scalar = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|([^\\r\\n]+))\\s*$`, "m"));
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim();
};
const list = (block, key) => {
  const match = block.match(new RegExp(`^${key}:\\s*\\r?\\n((?:[ \\t]+-[^\\r\\n]*(?:\\r?\\n|$))+)`, "m"));
  return [...(match?.[1] ?? "").matchAll(/^\s*-\s*(?:"([^"]*)"|'([^']*)'|([^\r\n]+))\s*$/gm)]
    .map((item) => (item[1] ?? item[2] ?? item[3] ?? "").trim());
};

async function loadPublishedEvidence() {
  const directory = join(appRoot, "src", "content", "signals");
  const records = new Map();
  for (const name of await readdir(directory)) {
    if (!name.endsWith(".mdx")) continue;
    const block = frontmatter(await readFile(join(directory, name), "utf8"));
    const id = scalar(block, "id");
    records.set(id, {
      id,
      title: scalar(block, "title"),
      status: scalar(block, "record_status"),
      topic: scalar(block, "primary_topic"),
      sourceIds: list(block, "source_ids"),
    });
  }
  return records;
}

export async function validatePhase118() {
  const registry = await readJson(appRoot, "src", "data", "phase-118-canonical-living-encyclopedia.json");
  const signalById = await loadPublishedEvidence();
  const sourceFiles = (await readdir(join(appRoot, "src", "content", "sources"))).filter((name) => name.endsWith(".json"));
  const sourceIds = new Set();
  for (const name of sourceFiles) sourceIds.add((await readJson(appRoot, "src", "content", "sources", name)).id);
  const topicFiles = (await readdir(join(appRoot, "src", "content", "topics"))).filter((name) => name.endsWith(".json"));
  const topicById = new Map();
  for (const name of topicFiles) {
    const topic = await readJson(appRoot, "src", "content", "topics", name);
    topicById.set(topic.id, topic);
  }

  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const chapters = [...registry.topic_chapters, ...registry.foundation_chapters];
  const selectedSignalIds = new Set();
  const selectedSourceIds = new Set();

  check(registry.schema_version === "1.0" && registry.record_status === "Published", "Registry must be Published schema 1.0.");
  check(registry.effective_date === "2026-08-30" && registry.edition === "v0.4", "Registry must retain the Phase 118 date and v0.4 edition.");
  check(registry.topic_chapters.length === 17, `Expected 17 topic chapters, found ${registry.topic_chapters.length}.`);
  check(registry.foundation_chapters.length >= 8 && registry.foundation_chapters.length <= 12, "Expected 8-12 foundation chapters.");
  check(chapters.length === registry.counts.chapters, "Chapter count does not match registry counts.");
  check(registry.public_routes.length === registry.counts.public_routes && new Set(registry.public_routes).size === registry.public_routes.length, "Public route inventory is incomplete or duplicated.");
  check(registry.publication_boundary.includes("no new source fact") && registry.publication_boundary.includes("no causal finding"), "Publication boundary must prohibit new facts and causal findings.");

  const ids = new Set();
  const slugs = new Set();
  const decks = new Set();
  for (const chapter of chapters) {
    check(!ids.has(chapter.chapter_id), `Duplicate chapter ID: ${chapter.chapter_id}`); ids.add(chapter.chapter_id);
    check(!slugs.has(chapter.slug), `Duplicate chapter slug: ${chapter.slug}`); slugs.add(chapter.slug);
    check(!decks.has(chapter.deck), `Duplicate chapter deck: ${chapter.slug}`); decks.add(chapter.deck);
    check(chapter.executive_synthesis.length >= 2 && words(chapter.executive_synthesis.join(" ")) >= 60, `${chapter.slug}: executive synthesis is too thin.`);
    check(words(chapter.historical_baseline) >= 25, `${chapter.slug}: historical baseline is too thin.`);
    check(words(chapter.current_evidence_state) >= 25, `${chapter.slug}: current evidence state is too thin.`);
    check(chapter.conversion_chain.length === 4 && new Set(chapter.conversion_chain.map((item) => item.stage)).size === 4, `${chapter.slug}: conversion chain must contain four distinct stages.`);
    check(chapter.contested_interpretations.length >= 2, `${chapter.slug}: at least two contested interpretations are required.`);
    check(chapter.contested_interpretations.every((item) => words(item.interpretation) >= 7 && words(item.counterevidence) >= 12), `${chapter.slug}: contested reading or counterevidence is too thin.`);
    check(chapter.decisive_evidence.length >= 3 && chapter.claim_boundaries.length >= 3, `${chapter.slug}: decisive-evidence or claim-boundary list is incomplete.`);
    check(chapter.evidence_signal_ids.length >= 4 && new Set(chapter.evidence_signal_ids).size === chapter.evidence_signal_ids.length, `${chapter.slug}: each chapter requires at least four distinct curated evidence IDs.`);

    if (chapter.topic_id) {
      const topic = topicById.get(chapter.topic_id);
      check(Boolean(topic), `${chapter.slug}: unknown topic ID ${chapter.topic_id}.`);
      check(topic?.slug === chapter.slug && topic?.name === chapter.topic_name, `${chapter.slug}: topic identity differs from the canonical topic record.`);
    }

    for (const id of chapter.evidence_signal_ids) {
      const signal = signalById.get(id);
      check(Boolean(signal), `${chapter.slug}: unknown evidence signal ${id}.`);
      check(signal?.status === "Published", `${chapter.slug}: evidence signal ${id} is not Published.`);
      check((signal?.sourceIds.length ?? 0) > 0, `${chapter.slug}: evidence signal ${id} has no source IDs.`);
      selectedSignalIds.add(id);
      for (const sourceId of signal?.sourceIds ?? []) {
        check(sourceIds.has(sourceId), `${chapter.slug}: evidence signal ${id} references missing source ${sourceId}.`);
        selectedSourceIds.add(sourceId);
      }
    }
  }

  const expectedTopicRoutes = registry.topic_chapters.map((chapter) => `/review/encyclopedia/topics/${chapter.slug}/`);
  const expectedFoundationRoutes = registry.foundation_chapters.map((chapter) => `/review/encyclopedia/foundations/${chapter.slug}/`);
  for (const route of ["/review/encyclopedia/", "/data/phase-118-canonical-living-encyclopedia.json", ...expectedTopicRoutes, ...expectedFoundationRoutes]) {
    check(registry.public_routes.includes(route), `Missing public route from registry: ${route}`);
  }

  const narrativeWords = chapters.reduce((sum, chapter) => sum
    + words(chapter.deck)
    + words(chapter.executive_synthesis.join(" "))
    + words(chapter.historical_baseline)
    + words(chapter.current_evidence_state)
    + words(chapter.conversion_chain.map((item) => `${item.stage} ${item.reading}`).join(" "))
    + words(chapter.contested_interpretations.map((item) => `${item.interpretation} ${item.counterevidence}`).join(" "))
    + words(chapter.decisive_evidence.join(" "))
    + words(chapter.claim_boundaries.join(" ")), 0);
  check(narrativeWords >= 9000, `Canonical encyclopedia contains only ${narrativeWords} narrative words; expected at least 9,000.`);

  if (failures.length) {
    const error = new Error(`Phase 118 content build failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
    error.failures = failures;
    throw error;
  }

  return {
    chapters: chapters.length,
    topicChapters: registry.topic_chapters.length,
    foundationChapters: registry.foundation_chapters.length,
    publicRoutes: registry.public_routes.length,
    narrativeWords,
    curatedPublishedSignals: selectedSignalIds.size,
    linkedSources: selectedSourceIds.size,
    workspaceRoot,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await validatePhase118();
    console.log(`Phase 118 content build passed: ${result.chapters} chapters, ${result.narrativeWords} narrative words, ${result.curatedPublishedSignals} Published signals, ${result.linkedSources} linked sources, ${result.publicRoutes} routes.`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
