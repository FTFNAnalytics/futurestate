import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, "..");
const contentRoot = path.join(appRoot, "src", "content");
const dataRoot = path.join(appRoot, "src", "data");

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

function readRegistryIdIndex(fileName, arrayField, idField, label) {
  const filePath = path.join(dataRoot, fileName);
  const registry = JSON.parse(readFileSync(filePath, "utf8"));
  const records = registry[arrayField];
  const index = new Map();

  if (!Array.isArray(records)) {
    errors.push(`${toPosixPath(filePath)} is missing registry array ${arrayField}.`);
    return index;
  }

  for (const record of records) {
    const value = record[idField];

    if (!value) {
      errors.push(`${toPosixPath(filePath)} contains a ${label} without ${idField}.`);
      continue;
    }

    if (index.has(value)) {
      errors.push(`${toPosixPath(filePath)} contains duplicate ${label} ID "${value}".`);
      continue;
    }

    index.set(value, { collectionName: label, filePath, data: record });
  }

  return index;
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

function requirePublishedReferences(record, fieldName, targetIndex, targetLabel) {
  for (const value of asArray(record.data[fieldName])) {
    const target = targetIndex.get(value);

    if (target && target.data.record_status !== "Published") {
      errors.push(
        `${toPosixPath(record.filePath)} is Published but field ${fieldName} references non-Published ${targetLabel} "${value}".`
      );
    }
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
const readerPathways = readJsonCollection("reader-pathways");
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
const readerPathwayIds = indexBy(readerPathways, "id");
const missionIds = readRegistryIdIndex("phase-121-priority-research-missions.json", "missions", "mission_id", "mission");
const dossierIds = readRegistryIdIndex("phase-123-comparative-delivery-dossiers.json", "dossiers", "dossier_id", "dossier");
const releaseRecordSpecs = [
  ["phase-130-authority-gap-closure-maps.json", "gap_maps", "gap_map_id", "Phase 130 gap map"],
  ["phase-131-priority-evidence-admission-dockets.json", "admission_dockets", "docket_id", "Phase 131 admission docket"],
  ["phase-132-dated-source-check-receipts.json", "source_check_receipts", "receipt_id", "Phase 132 source-check receipt"],
  ["phase-133-requirement-adjudication-board.json", "adjudication_items", "adjudication_id", "Phase 133 adjudication"],
  ["phase-134-mission-decision-register.json", "mission_decisions", "mission_decision_id", "Phase 134 mission decision"],
  ["phase-135-atlas-conversion-readiness-audit.json", "readiness_records", "readiness_id", "Phase 135 readiness record"],
  ["phase-136-named-project-chronicles.json", "project_chronicles", "chronicle_id", "Phase 136 project chronicle"],
  ["phase-137-place-delivery-ledgers.json", "place_ledgers", "ledger_id", "Phase 137 place ledger"],
  ["phase-138-longitudinal-evidence-eligibility.json", "eligibility_records", "eligibility_id", "Phase 138 eligibility record"],
  ["phase-139-comparative-dossier-rereview.json", "comparison_reviews", "rereview_id", "Phase 139 comparison review"],
  ["phase-140-living-topic-desks.json", "topic_desks", "desk_id", "Phase 140 topic desk"],
  ["phase-141-frontier-systems-almanac.json", "almanac_entries", "almanac_id", "Phase 141 almanac entry"],
  ["phase-142-topic-delivery-roadmaps.json", "topic_roadmaps", "roadmap_id", "Phase 142 topic roadmap"],
  ["phase-143-editorial-cadence-editions.json", "editions", "edition_id", "Phase 143 edition"],
  ["phase-144-v1-launch-candidate-audit.json", "launch_gates", "gate_id", "Phase 144 launch gate"],
];
const releaseProgramIds = new Map(
  releaseRecordSpecs.map(([fileName], index) => {
    const phase = 130 + index;
    const filePath = path.join(dataRoot, fileName);
    const data = JSON.parse(readFileSync(filePath, "utf8"));

    if (data.program_id !== `FTFN-PHASE-${phase}`) {
      errors.push(`${toPosixPath(filePath)} has unexpected program_id "${data.program_id}".`);
    }

    return [data.program_id, { collectionName: "release program", filePath, data }];
  })
);
const releaseRecordIndexes = releaseRecordSpecs.map((spec) => readRegistryIdIndex(...spec));
const releaseRecordIds = new Map(releaseRecordIndexes.flatMap((index) => [...index]));
const indexedReleaseRecordCount = releaseRecordIndexes.reduce((sum, index) => sum + index.size, 0);
if (releaseRecordIds.size !== indexedReleaseRecordCount) {
  errors.push("Phase 130–144 registries contain a duplicate public record ID across release phases.");
}
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
  ...researchDocumentIds,
  ...readerPathwayIds,
  ...missionIds,
  ...dossierIds,
  ...releaseProgramIds,
  ...releaseRecordIds
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
validateSlugUniqueness(readerPathways, "reader pathway");

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

  if (record.data.record_status === "Published") {
    for (const signalId of asArray(record.data.signal_ids)) {
      const signal = signalIds.get(signalId);

      if (signal && signal.data.record_status !== "Published") {
        errors.push(
          `${toPosixPath(record.filePath)} is Published but references non-Published signal "${signalId}".`
        );
      }
    }
  }
}

for (const record of researchCollections) {
  requireReferences(record, "document_ids", researchDocumentIds, "research document");
}

for (const record of researchDocuments) {
  requireReferences(record, "collection_id", researchCollectionIds, "research collection");
  requireReferences(record, "source_id", sourceIds, "source");
}

for (const record of readerPathways) {
  requireReferences(record, "topic_ids", topicIds, "topic");
  requireReferences(record, "local_system_ids", localSystemIds, "local system");
  requireReferences(record, "signal_ids", signalIds, "signal");
  requireReferences(record, "source_ids", sourceIds, "source");
  requireReferences(record, "organization_ids", organizationIds, "organization");
  requireReferences(record, "technology_ids", technologyIds, "technology");
  requireReferences(record, "briefing_ids", briefingIds, "briefing");
  requireReferences(record, "dependency_map_ids", dependencyMapIds, "dependency map");
  requireReferences(record, "research_collection_ids", researchCollectionIds, "research collection");
  requireReferences(record, "evidence_gap_ids", evidenceGapIds, "evidence gap");

  if (asArray(record.data.topic_ids).length === 0 && asArray(record.data.local_system_ids).length === 0) {
    errors.push(`${toPosixPath(record.filePath)} does not target a topic or local-system surface.`);
  }

  if (record.data.record_status === "Published") {
    requirePublishedReferences(record, "signal_ids", signalIds, "signal");
    requirePublishedReferences(record, "briefing_ids", briefingIds, "briefing");
    requirePublishedReferences(record, "dependency_map_ids", dependencyMapIds, "dependency map");
    requirePublishedReferences(record, "research_collection_ids", researchCollectionIds, "research collection");
  }
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
    `${readerPathways.length} reader pathways`,
    `${missionIds.size} missions`,
    `${dossierIds.size} dossiers`,
    `${updates.length} updates`
  ].join(", ")
);

for (const notice of notices) {
  console.log(`Notice: ${notice}`);
}
