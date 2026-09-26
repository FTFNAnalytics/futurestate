import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v1refPhaseDefinitions, v1refProgramId } from "./lib/v1ref-config.mjs";
import { collectPrimaryRecords, recordId } from "./lib/v1ref-records.mjs";
import { readerCatalog } from "../src/lib/reader-catalog.mjs";

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
  const valueAtField = arrayField.split(".").reduce((value, key) => value?.[key], registry);
  const records = Array.isArray(valueAtField) ? valueAtField : valueAtField && typeof valueAtField === "object" ? [valueAtField] : null;
  const index = new Map();

  if (!Array.isArray(records)) {
    errors.push(`${toPosixPath(filePath)} is missing registry array or object ${arrayField}.`);
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
const evidenceRecordSpecs = [
  ["montana-project-dossiers.json", "records", "record_id", "Montana project dossier"],
  ["phase-207-current-operations.json", "review_policy", "policy_id", "Owner-authorized review policy"],
  ["phase-60-operating-cycle.json", "records", "cycle_item_id", "Phase 60 cycle gate"],
  ["phase-60c-editorial-desk.json", "records", "desk_item_id", "Phase 60C desk check"],
  ["phase-61-project-conversion-registry.json", "records", "file_id", "Phase 61 named file"],
  ["phase-63-conversion-gate-calendar.json", "gate_records", "gate_id", "Phase 63 conversion gate"],
  ["phase-67-evidence-return-envelope-ledger.json", "envelope_records", "envelope_id", "Phase 67 return envelope"],
  ["phase-67-qualification-packet-registry.json", "packet_records", "packet_id", "Phase 67 qualification packet"],
  ["phase-119-deep-project-place-atlas.json", "places", "atlas_place_id", "Atlas place"],
];
const evidenceRecordIds = new Map(evidenceRecordSpecs.flatMap(spec=>[...readRegistryIdIndex(...spec)]));
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
  ["phase-145-evidence-gate-operations-journal.json", "gate_operations", "operation_id", "Phase 145 gate operation"],
  ["phase-146-authority-gap-resolution-program.json", "gap_dispositions", "disposition_id", "Phase 146 gap disposition"],
  ["phase-147-evidence-adjudication-record.json", "adjudication_records", "adjudication_record_id", "Phase 147 adjudication record"],
  ["phase-148-atlas-changefeed.json", "changefeed_reviews", "changefeed_id", "Phase 148 changefeed review"],
  ["phase-149-longitudinal-evidence-lab.json", "longitudinal_reviews", "lab_review_id", "Phase 149 longitudinal review"],
  ["phase-150-comparison-passports-2-0.json", "comparison_passports", "passport_id", "Phase 150 comparison passport"],
  ["phase-151-weekly-desk-review-ledger.json", "desk_review_ledgers", "desk_review_id", "Phase 151 desk-review ledger"],
  ["phase-152-frontier-topic-field-guides.json", "field_guides", "field_guide_id", "Phase 152 field guide"],
  ["phase-153-future-state-report-series.json", "flagship_reports", "report_id", "Phase 153 flagship report"],
  ["phase-154-september-edition-packets.json", "edition_packets", "edition_packet_id", "Phase 154 edition packet"],
  ["phase-155-public-method-corrections-library.json", "method_records", "method_id", "Phase 155 method record"],
  ["phase-156-v1-launch-decision.json", "launch_gates", "gate_id", "Phase 156 launch gate"],
  ["phase-157-v1-candidate-preservation-ledger.json", "preservation_records", "preservation_id", "Phase 157 preservation record"],
  ["phase-158-september-evidence-operations-desk.json", "operation_packets", "operation_packet_id", "Phase 158 operation packet"],
  ["phase-159-owner-decision-sprint.json", "authority_mission_boards", "mission_board_id", "Phase 159 mission board"],
  ["phase-160-longitudinal-pilot-matrices.json", "pilot_matrices", "pilot_matrix_id", "Phase 160 pilot matrix"],
  ["phase-161-stack-watch.json", "stack_watch_packets", "stack_watch_packet_id", "Phase 161 Stack Watch packet"],
  ["phase-162-local-system-expansion.json", "local_system_briefs", "local_system_brief_id", "Phase 162 local-system brief"],
  ["phase-163-september-editorial-runbooks.json", "editorial_runbooks", "editorial_runbook_id", "Phase 163 editorial runbook"],
  ["phase-164-monthly-candidate-decision.json", "readiness_gates", "gate_id", "Phase 164 readiness gate"],
  ["phase-165-live-evidence-operations-cycle-001.json", "operation_runs", "operation_run_id", "Phase 165 operation run"],
  ["phase-166-weekly-desk-closures-and-editions.json", "weekly_cycles", "weekly_cycle_id", "Phase 166 weekly cycle"],
  ["phase-167-authority-resolution-hearings.json", "authority_hearings", "authority_hearing_id", "Phase 167 authority hearing"],
  ["phase-168-requirement-mission-adjudication.json", "adjudication_dockets", "adjudication_docket_id", "Phase 168 adjudication docket"],
  ["phase-169-longitudinal-pilot-adjudication.json", "longitudinal_adjudication_packets", "longitudinal_adjudication_packet_id", "Phase 169 longitudinal adjudication packet"],
  ["phase-170-fifteen-place-systems-atlas.json", "place_system_dossiers", "place_system_dossier_id", "Phase 170 place-system dossier"],
  ["phase-171-frontier-systems-compendium.json", "compendium_records", "compendium_record_id", "Phase 171 compendium record"],
  ["phase-172-september-state-report.json", "state_report_gates", "gate_id", "Phase 172 state-report gate"],
  ["phase-173-september-closeout-october-opening-ledger.json", "carryover_records", "carryover_id", "Phase 173 carryover record"],
  ["phase-174-evidence-cycle-closure-intake.json", "cycle_001_closeout.audit_items", "audit_item_id", "Phase 174 Cycle 001 audit item"],
  ["phase-174-evidence-cycle-closure-intake.json", "cycle_002_intake.candidates", "candidate_id", "Phase 174 Cycle 002 candidate"],
  ["phase-175-owner-disposition-sprint-ii.json", "owner_disposition_packets", "owner_disposition_packet_id", "Phase 175 owner-disposition packet"],
  ["phase-176-longitudinal-admission-and-zero-series-decision.json", "pilot_admission_packets", "pilot_admission_packet_id", "Phase 176 pilot-admission packet"],
  ["phase-176-longitudinal-admission-and-zero-series-decision.json", "zero_series_owner_disposition", "zero_series_disposition_id", "Phase 176 zero-series disposition"],
  ["phase-177-october-stack-watch-and-source-currency-sweep.json", "packets", "phase_177_packet_id", "Phase 177 Stack Watch packet"],
  ["phase-178-systems-atlas-and-compendium-depth-expansion.json", "place_system_dossiers", "place_system_dossier_id", "Phase 178 place-system dossier"],
  ["phase-178-systems-atlas-and-compendium-depth-expansion.json", "comparison_overlays", "comparison_overlay_id", "Phase 178 comparison overlay"],
  ["phase-178-systems-atlas-and-compendium-depth-expansion.json", "interpretive_essays", "interpretive_essay_id", "Phase 178 interpretive essay"],
  ["phase-179-october-weekly-editions-and-month-end-synthesis.json", "editorial_cycles", "editorial_cycle_id", "Phase 179 editorial cycle"],
  ["phase-180-october-state-report-and-v1-promotion-gate.json", "state_report_gates", "gate_id", "Phase 180 state-report gate"],
];
const releaseProgramIds = new Map(
  releaseRecordSpecs.map(([fileName]) => {
    const phase = Number(fileName.match(/^phase-(\d+)-/)?.[1]);
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
  errors.push("Phase 130–180 registries contain a duplicate public record ID across release phases.");
}
const v1refProgramIds = new Map();
const v1refRecordIds = new Map();
for (const definition of v1refPhaseDefinitions) {
  const filePath = path.join(dataRoot, definition.file);
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  if (data.phase !== definition.phase || data.program_id !== `FTFN-PHASE-${definition.phase}`) {
    errors.push(`${toPosixPath(filePath)} has an invalid Phase ${definition.phase} identity.`);
  }
  v1refProgramIds.set(data.program_id, { collectionName: "v1 reference program", filePath, data });
  for (const record of collectPrimaryRecords(data)) {
    const id = recordId(record);
    if (!id) {
      errors.push(`${toPosixPath(filePath)} contains a routed public record without an ID.`);
    } else if (v1refRecordIds.has(id)) {
      errors.push(`${toPosixPath(filePath)} contains duplicate Phase 181–204 public record ID "${id}".`);
    } else {
      v1refRecordIds.set(id, { collectionName: `Phase ${definition.phase} public record`, filePath, data: record });
    }
  }
}
const v1refAggregatePath = path.join(dataRoot, "v1-public-reference-edition.json");
const v1refAggregate = JSON.parse(readFileSync(v1refAggregatePath, "utf8"));
if (v1refAggregate.program_id !== v1refProgramId || v1refRecordIds.size !== 1048) {
  errors.push(`${toPosixPath(v1refAggregatePath)} does not bind the exact Phase 181–204 program identity and 1,048-record inventory.`);
}
v1refProgramIds.set(v1refAggregate.program_id, { collectionName: "v1 reference aggregate", filePath: v1refAggregatePath, data: v1refAggregate });
indexBy(updates, "id");

// These identities already have static Atlas project routes. Validate against the
// source registry, never against IDs supplied by an update itself.
const atlasProjectIds = readRegistryIdIndex("phase-119-deep-project-place-atlas.json", "projects", "atlas_project_id", "Atlas project");
const atlasProjectSlugs = new Set();
for (const [id, record] of atlasProjectIds) {
  const slug = record.data.slug;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || atlasProjectSlugs.has(slug)) {
    errors.push(`${toPosixPath(record.filePath)} contains an invalid or duplicate routed project slug for "${id}".`);
  }
  atlasProjectSlugs.add(slug);
}

// Current drafts have real reader routes, including the selected field report.
// Identity resolution does not confer publication or independent approval.
const currentReaderIds = readRegistryIdIndex("phase-205-216-current-editorial.json", "records", "record_id", "current reader draft");
for (const [id, record] of currentReaderIds) {
  const catalogEntries = readerCatalog.filter((entry) => entry.id === id);
  if (catalogEntries.length !== 1 || !record.data.route?.startsWith("/") || catalogEntries[0]?.route !== record.data.route) {
    errors.push(`${toPosixPath(record.filePath)} contains an unresolved current reader route for "${id}".`);
  }
}

const allPublicRecordIds = new Map([
  ...currentReaderIds,
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
  ...releaseRecordIds,
  ...v1refProgramIds,
  ...v1refRecordIds,
  ...evidenceRecordIds,
  ...atlasProjectIds
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
