import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const contentRoot = path.join(appRoot, "src", "content");

const errors = [];
const notices = [];

function toPosixPath(filePath) {
  return path.relative(appRoot, filePath).replaceAll(path.sep, "/");
}

function readJsonCollection(collectionName) {
  const collectionDir = path.join(contentRoot, collectionName);
  return readdirSync(collectionDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(collectionDir, fileName);
      const data = JSON.parse(readFileSync(filePath, "utf8"));
      return { collectionName, filePath, data };
    });
}

function readMdxCollection(collectionName) {
  const collectionDir = path.join(contentRoot, collectionName);
  return readdirSync(collectionDir)
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
    .map((fileName) => {
      const filePath = path.join(collectionDir, fileName);
      const text = readFileSync(filePath, "utf8");
      const data = parseFrontmatter(text, filePath);
      return { collectionName, filePath, data };
    });
}

function parseFrontmatter(text, filePath) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    errors.push(`${toPosixPath(filePath)} is missing frontmatter.`);
    return {};
  }

  const lines = match[1].split(/\r?\n/);
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line.trim()) {
      continue;
    }

    if (/^\s/.test(line)) {
      continue;
    }

    const fieldMatch = line.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/);

    if (!fieldMatch) {
      errors.push(`${toPosixPath(filePath)} has unsupported frontmatter line: ${line}`);
      continue;
    }

    const [, key, rawValue = ""] = fieldMatch;

    if (rawValue.trim() === "" && lines[index + 1]?.match(/^\s+-\s+/)) {
      const values = [];

      while (lines[index + 1]?.match(/^\s+-\s+/)) {
        index += 1;
        values.push(parseScalar(lines[index].replace(/^\s+-\s+/, "")));
      }

      data[key] = values;
      continue;
    }

    data[key] = parseScalar(rawValue);
  }

  return data;
}

function parseScalar(rawValue) {
  const value = rawValue.trim();

  if (value === "null") {
    return null;
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function indexBy(records, fieldName) {
  const index = new Map();

  for (const record of records) {
    const value = record.data[fieldName];

    if (!value) {
      errors.push(`${toPosixPath(record.filePath)} is missing ${fieldName}.`);
      continue;
    }

    if (index.has(value)) {
      const firstRecord = index.get(value);
      errors.push(
        `Duplicate ${fieldName} "${value}" in ${toPosixPath(firstRecord.filePath)} and ${toPosixPath(record.filePath)}.`
      );
      continue;
    }

    index.set(value, record);
  }

  return index;
}

function asArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null || value === "") {
    return [];
  }

  return [value];
}

function requireReferences(record, fieldName, targetIndex, targetLabel) {
  for (const value of asArray(record.data[fieldName])) {
    if (!targetIndex.has(value)) {
      errors.push(
        `${toPosixPath(record.filePath)} field ${fieldName} references missing ${targetLabel} "${value}".`
      );
    }
  }
}

function requireResolvedLocalSystemName(record, localSystemNames) {
  const value = record.data.local_system;

  if (!value || value === "Cross-system") {
    return;
  }

  if (!localSystemNames.has(value)) {
    errors.push(
      `${toPosixPath(record.filePath)} field local_system references "${value}", but no local system has that name.`
    );
  }
}

function requireDependencyMapNodeReferences(record, referenceIndexes) {
  const nodes = asArray(record.data.nodes);

  for (const node of nodes) {
    if (!node.record_id) {
      continue;
    }

    const index = referenceIndexes.get(node.node_type);

    if (!index) {
      continue;
    }

    if (!index.has(node.record_id)) {
      errors.push(
        `${toPosixPath(record.filePath)} node "${node.id}" references missing ${node.node_type} "${node.record_id}".`
      );
    }
  }
}

function requireDependencyMapLinks(record) {
  const nodeIds = new Set(asArray(record.data.nodes).map((node) => node.id));

  for (const link of asArray(record.data.links)) {
    if (!nodeIds.has(link.from)) {
      errors.push(`${toPosixPath(record.filePath)} link references missing from node "${link.from}".`);
    }

    if (!nodeIds.has(link.to)) {
      errors.push(`${toPosixPath(record.filePath)} link references missing to node "${link.to}".`);
    }
  }
}

function validateSlugUniqueness(records, collectionLabel) {
  const slugIndex = new Map();

  for (const record of records) {
    const slug = record.data.slug;

    if (!slug) {
      errors.push(`${toPosixPath(record.filePath)} is missing slug.`);
      continue;
    }

    if (slugIndex.has(slug)) {
      errors.push(
        `Duplicate ${collectionLabel} slug "${slug}" in ${toPosixPath(slugIndex.get(slug).filePath)} and ${toPosixPath(record.filePath)}.`
      );
      continue;
    }

    slugIndex.set(slug, record);
  }
}

const sources = readJsonCollection("sources");
const topics = readJsonCollection("topics");
const organizations = readJsonCollection("organizations");
const technologies = readJsonCollection("technologies");
const evidenceGaps = readJsonCollection("evidence-gaps");
const dependencyMaps = readJsonCollection("dependency-maps");
const updates = readJsonCollection("updates");
const researchCollections = readJsonCollection("research-collections");
const researchDocuments = readJsonCollection("research-documents");
const signals = readMdxCollection("signals");
const localSystems = readMdxCollection("local-systems");
const briefings = readMdxCollection("briefings");

const sourceIds = indexBy(sources, "id");
const topicIds = indexBy(topics, "id");
const organizationIds = indexBy(organizations, "id");
const technologyIds = indexBy(technologies, "id");
const evidenceGapIds = indexBy(evidenceGaps, "id");
const signalIds = indexBy(signals, "id");
const localSystemIds = indexBy(localSystems, "id");
const briefingIds = indexBy(briefings, "id");
const dependencyMapIds = indexBy(dependencyMaps, "id");
const researchCollectionIds = indexBy(researchCollections, "id");
const researchDocumentIds = indexBy(researchDocuments, "id");
indexBy(updates, "id");

const allPublicRecordIds = new Map([
  ...sourceIds,
  ...topicIds,
  ...organizationIds,
  ...technologyIds,
  ...evidenceGapIds,
  ...signalIds,
  ...localSystemIds,
  ...briefingIds,
  ...dependencyMapIds,
  ...researchCollectionIds,
  ...researchDocumentIds
]);

const localSystemNames = new Set(localSystems.map((record) => record.data.name).filter(Boolean));
const dependencyMapNodeIndexes = new Map([
  ["Signal", signalIds],
  ["Source", sourceIds],
  ["Technology", technologyIds],
  ["Local System", localSystemIds],
  ["Evidence Gap", evidenceGapIds],
  ["Topic", topicIds]
]);

validateSlugUniqueness(signals, "signal");
validateSlugUniqueness(topics, "topic");
validateSlugUniqueness(organizations, "organization");
validateSlugUniqueness(technologies, "technology");
validateSlugUniqueness(localSystems, "local system");
validateSlugUniqueness(briefings, "briefing");
validateSlugUniqueness(evidenceGaps, "evidence gap");
validateSlugUniqueness(dependencyMaps, "dependency map");
validateSlugUniqueness(researchCollections, "research collection");
validateSlugUniqueness(researchDocuments, "research document");

for (const record of signals) {
  requireReferences(record, "source_ids", sourceIds, "source");
  requireReferences(record, "evidence_gap_ids", evidenceGapIds, "evidence gap");

  if (record.data.record_status === "Published" && !record.data.published_date) {
    errors.push(`${toPosixPath(record.filePath)} is Published but has no published_date.`);
  }

  if (record.data.record_status === "Published" && record.data.verification_status === "Unreviewed") {
    errors.push(`${toPosixPath(record.filePath)} is Published but verification_status is Unreviewed.`);
  }
}

for (const record of topics) {
  requireReferences(record, "featured_sources", sourceIds, "source");
}

for (const record of organizations) {
  requireReferences(record, "source_ids", sourceIds, "source");
}

for (const record of technologies) {
  requireReferences(record, "source_ids", sourceIds, "source");
}

for (const record of localSystems) {
  requireReferences(record, "source_ids", sourceIds, "source");
  requireReferences(record, "evidence_gap_ids", evidenceGapIds, "evidence gap");
}

for (const record of briefings) {
  requireReferences(record, "signal_ids", signalIds, "signal");
  requireReferences(record, "evidence_gap_ids", evidenceGapIds, "evidence gap");

  if (record.data.record_status === "Published" && !record.data.published_date) {
    errors.push(`${toPosixPath(record.filePath)} is Published but has no published_date.`);
  }
}

for (const record of evidenceGaps) {
  requireReferences(record, "related_source_ids", sourceIds, "source");
  requireReferences(record, "related_signal_ids", signalIds, "signal");
  requireReferences(record, "related_local_system_ids", localSystemIds, "local system");
  requireResolvedLocalSystemName(record, localSystemNames);

  if (record.data.status === "Resolved") {
    errors.push(`${toPosixPath(record.filePath)} is marked Resolved. Phase 22 requires resolved gaps to be reviewed manually before passing validation.`);
  }
}

for (const record of dependencyMaps) {
  requireReferences(record, "source_ids", sourceIds, "source");
  requireReferences(record, "signal_ids", signalIds, "signal");
  requireReferences(record, "technology_ids", technologyIds, "technology");
  requireReferences(record, "local_system_ids", localSystemIds, "local system");
  requireReferences(record, "evidence_gap_ids", evidenceGapIds, "evidence gap");
  requireDependencyMapNodeReferences(record, dependencyMapNodeIndexes);
  requireDependencyMapLinks(record);
}

for (const record of researchCollections) {
  requireReferences(record, "document_ids", researchDocumentIds, "research document");
}

for (const record of researchDocuments) {
  requireReferences(record, "collection_id", researchCollectionIds, "research collection");
  requireReferences(record, "source_id", sourceIds, "source");
}

for (const record of updates) {
  requireReferences(record, "affected_record_ids", allPublicRecordIds, "public record");
}

if (topicIds.size === 0 || organizationIds.size === 0 || technologyIds.size === 0 || briefingIds.size === 0) {
  notices.push("One or more reference collections are empty. This is allowed only during early scaffolding.");
}

if (errors.length > 0) {
  console.error("FTFN content reference validation failed:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("FTFN content reference validation passed.");
console.log(
  [
    `${sources.length} sources`,
    `${signals.length} signals`,
    `${topics.length} topics`,
    `${organizations.length} organizations`,
    `${technologies.length} technologies`,
    `${localSystems.length} local systems`,
    `${briefings.length} briefings`,
    `${evidenceGaps.length} evidence gaps`,
    `${dependencyMaps.length} dependency maps`,
    `${researchCollections.length} research collections`,
    `${researchDocuments.length} research documents`,
    `${updates.length} updates`
  ].join(", ")
);

for (const notice of notices) {
  console.log(`Notice: ${notice}`);
}
