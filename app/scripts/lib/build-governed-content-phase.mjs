import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(value, null, 2) + "\n", "utf8");
};
const unique = (items) => [...new Set(items)];
const yamlList = (items) => items.map((item) => "  - \"" + item + "\"").join("\n");
const recordsForTaxonomy = (items, idField, stateField, state) => items.map((item) => ({
  [idField]: item.id,
  label: item.label,
  [stateField]: state
}));

export async function buildGovernedContentPhase(config) {
  const upstreamRegistry = await readJson(join(dataRoot, config.upstreamRegistryFilename));
  const upstream = upstreamRegistry[config.upstreamFamilyKey];
  if (!Array.isArray(upstream) || upstream.length !== 8) throw new Error("Expected exactly eight upstream records for Phase " + config.phase + ".");

  const registry = {
    schema_version: "1.0",
    phase: String(config.phase),
    title: config.title,
    effective_date: config.date,
    record_status: "Published",
    operating_state: "governed_empty_state",
    decision_boundary: config.decisionBoundary,
    interpretation_boundary: config.interpretationBoundary
  };

  for (const family of config.families) {
    registry[family.gatesKey] = family.gateLabels.map((label, index) => ({
      gate_id: String(config.phase) + "-" + family.gatePrefix + "-" + String(index + 1).padStart(2, "0"),
      label
    }));
    registry[family.classesKey] = family.classLabels.map((label, index) => ({
      id: String(config.phase) + "-" + family.classPrefix + "-" + String(index + 1).padStart(2, "0"),
      label
    }));
    registry[family.dimensionsKey] = family.dimensionLabels.map((label, index) => ({
      id: String(config.phase) + "-" + family.dimensionPrefix + "-" + String(index + 1).padStart(2, "0"),
      label
    }));
    registry[family.safeguardsKey] = family.safeguardLabels.map((label, index) => ({
      id: String(config.phase) + "-" + family.safeguardPrefix + "-" + String(index + 1).padStart(2, "0"),
      label
    }));
    if (family.testsKey) {
      registry[family.testsKey] = family.testLabels.map((label, index) => ({
        id: String(config.phase) + "-" + family.testPrefix + "-" + String(index + 1).padStart(2, "0"),
        label
      }));
    }
  }

  const familyRecords = [];
  for (let familyIndex = 0; familyIndex < config.families.length; familyIndex += 1) {
    const family = config.families[familyIndex];
    const records = upstream.map((source, index) => {
      const number = String(index + 1).padStart(3, "0");
      const entitySlug = source.slug.replace(/^\d+-[a-z]+-\d+-/, "");
      const predecessor = familyIndex === 0 ? source : familyRecords[familyIndex - 1][index];
      const gates = registry[family.gatesKey];
      const record = {
        [family.idKey]: String(config.phase) + "-" + family.idPrefix + "-" + number + "-" + source.cohort_id,
        slug: String(config.phase) + "-" + family.slugPrefix + "-" + number + "-" + entitySlug,
        record_kind: family.recordKind,
        cohort_id: source.cohort_id,
        file_id: source.file_id,
        named_entity: source.named_entity,
        source_ids: source.source_ids,
        signal_ids: source.signal_ids,
        evidence_gap_ids: source.evidence_gap_ids,
        canonical_briefing_id: source.canonical_briefing_id,
        reader_pathway_ids: source.reader_pathway_ids,
        local_system_ids: source.local_system_ids,
        record_status: "Published",
        propagation_status: "not_started",
        first_reviewer_id: null,
        second_reviewer_id: null,
        automatic_score_allowed: false,
        automatic_rank_allowed: false,
        phase64_cell_change: "none",
        [family.predecessorLinkKey]: predecessor[family.predecessorIdKey],
        [family.stateKey]: family.inactiveState,
        [family.decisionKey]: "Not Open",
        [family.checksKey]: gates.map((gate) => ({
          gate_id: gate.gate_id,
          label: gate.label,
          decision_state: "Inactive",
          basis: family.inactiveBasis
        })),
        [family.classRecordsKey]: recordsForTaxonomy(registry[family.classesKey], family.classRecordIdKey, "class_state", "Unassessed"),
        [family.dimensionRecordsKey]: recordsForTaxonomy(registry[family.dimensionsKey], family.dimensionRecordIdKey, "dimension_state", "Not Measured"),
        [family.safeguardRecordsKey]: recordsForTaxonomy(registry[family.safeguardsKey], family.safeguardRecordIdKey, "safeguard_state", "Unverified")
      };
      if (family.testsKey) record[family.testRecordsKey] = recordsForTaxonomy(registry[family.testsKey], family.testRecordIdKey, "test_state", "Not Tested");
      for (const field of family.emptyRecordFields) record[field] = [];
      record[family.receiptKey] = null;
      for (const field of family.falseFields) record[field] = false;
      return record;
    });
    familyRecords.push(records);
    registry[family.recordsKey] = records;
  }

  registry.metrics = {
    inherited_cohorts: upstream.length,
    governed_records: familyRecords.flat().length,
    gates_per_chain: config.families.reduce((sum, family) => sum + family.gateLabels.length, 0),
    verified_upstream_records_received: 0,
    substantive_decisions: 0,
    independent_reviews_completed: 0,
    receipts_created: 0,
    scores_created: 0,
    rankings_created: 0,
    phase64_cells_advanced: 0
  };
  await writeJson(join(dataRoot, config.registryFilename), registry);

  const sourceIds = unique(upstream.flatMap((record) => record.source_ids));
  const signalIds = unique(upstream.flatMap((record) => record.signal_ids));
  const evidenceGapIds = unique(upstream.flatMap((record) => record.evidence_gap_ids));
  const localSystemIds = unique(upstream.flatMap((record) => record.local_system_ids));
  const guideIds = [];
  for (const guide of config.guides) {
    const id = "briefing-" + guide.slug;
    guideIds.push(id);
    const frontmatter = [
      "---",
      "id: \"" + id + "\"",
      "title: \"" + guide.title + "\"",
      "slug: \"" + guide.slug + "\"",
      "record_status: \"Published\"",
      "summary: \"" + guide.summary.replaceAll("\"", "'") + "\"",
      "published_date: " + config.date,
      "captured_date: " + config.date,
      "signal_ids:",
      yamlList(signalIds),
      "evidence_gap_ids:",
      yamlList(evidenceGapIds),
      "claim_scope: \"Editorial Synthesis\"",
      "local_evidence_level: \"General Source Layer\"",
      "last_reviewed_date: " + config.date,
      "top_takeaways:",
      yamlList(config.topTakeaways),
      "constraint_watch:",
      yamlList(["Public Trust", "Infrastructure", "Capital", "Labor", "Regulation", "Interpretation"]),
      "what_to_watch_next:",
      yamlList(config.watchNext),
      "---",
      "",
      guide.summary,
      "",
      config.guideBody.trim(),
      ""
    ].join("\n");
    await writeFile(join(contentRoot, "briefings", id + ".mdx"), frontmatter, "utf8");
  }

  const mapIds = [];
  for (const map of config.maps) {
    const id = "dependency-map-" + map.slug;
    mapIds.push(id);
    await writeJson(join(contentRoot, "dependency-maps", map.slug + ".json"), {
      id,
      title: map.title,
      slug: map.slug,
      summary: map.summary,
      map_type: "Dependency Stack",
      record_status: "Published",
      primary_topic: "Policy and Standards",
      framework_layers: ["Human Systems", "Enabling Infrastructure", "Frontier Domains"],
      constraint_tags: ["Public Trust", "Infrastructure", "Capital", "Labor", "Regulation", "Interpretation"],
      map_question: map.question,
      interpretation_boundary: config.interpretationBoundary,
      source_ids: sourceIds,
      signal_ids: signalIds,
      technology_ids: [],
      local_system_ids: localSystemIds,
      evidence_gap_ids: evidenceGapIds,
      nodes: [
        { id: "node-upstream", label: config.upstreamNodeLabel, node_type: "Evidence Gap", record_id: "gap-016", note: "No qualifying upstream record exists." },
        { id: "node-1", label: config.mapNodeLabels[0], node_type: "Constraint", note: config.mapNodeNotes[0] },
        { id: "node-2", label: config.mapNodeLabels[1], node_type: "Constraint", note: config.mapNodeNotes[1] },
        { id: "node-3", label: config.mapNodeLabels[2], node_type: "Constraint", note: config.mapNodeNotes[2] },
        { id: "node-4", label: config.mapNodeLabels[3], node_type: "Constraint", note: config.mapNodeNotes[3] },
        { id: "node-receipt", label: "Independent review, challenge, correction, remedy and receipts", node_type: "Evidence Gap", record_id: "gap-016", note: "No Phase " + config.phase + " receipt exists." }
      ],
      links: [["node-upstream", "node-1"], ["node-1", "node-2"], ["node-2", "node-3"], ["node-3", "node-4"], ["node-4", "node-receipt"]].map(([from, to]) => ({
        from,
        to,
        relationship: "Depends On",
        confidence: "Missing Evidence",
        note: "The downstream decision remains closed until its predecessor is reviewed and receipted."
      })),
      what_this_map_supports: config.mapSupports,
      what_this_map_does_not_prove: config.mapDoesNotProve,
      next_records_needed: config.nextRecordsNeeded
    });
  }

  const firstFamily = familyRecords[0];
  const pathwayIds = unique(firstFamily.flatMap((record) => record.reader_pathway_ids));
  for (const pathwayId of pathwayIds) {
    const path = join(contentRoot, "reader-pathways", pathwayId.replace("reader-pathway-", "") + ".json");
    const pathway = await readJson(path);
    pathway.briefing_ids = unique([...(pathway.briefing_ids ?? []), ...guideIds]);
    pathway.dependency_map_ids = unique([...(pathway.dependency_map_ids ?? []), ...mapIds]);
    pathway.last_reviewed_date = config.date;
    await writeJson(path, pathway);
  }

  for (let index = 0; index < upstream.length; index += 1) {
    const source = upstream[index];
    const records = familyRecords.map((family) => family[index]);
    const path = join(contentRoot, "briefings", source.canonical_briefing_id + ".mdx");
    let body = await readFile(path, "utf8");
    if (!body.includes(config.canonicalHeading)) {
      const links = records.map((record, familyIndex) => {
        const family = config.families[familyIndex];
        return "[" + record[family.idKey] + "](/evidence/" + config.routeBase + "/" + record.slug + "/)";
      });
      body = body.trimEnd() + "\n\n" + config.canonicalHeading + "\n\nThe [" + config.title + " Registry](/evidence/" + config.routeBase + "/) assigns " + links.join(", ") + " to this named file. " + config.zeroDecisionSentence + "\n";
      await writeFile(path, body, "utf8");
    }
  }

  const localFiles = ["local-us-southwest-chip-corridor.mdx", "local-ontario-real-estate.mdx", "local-northern-virginia-data-center-corridor.mdx", "local-florida-space-coast-launch-corridor.mdx", "local-nevada-lithium-processing-corridor.mdx"];
  for (const filename of localFiles) {
    const path = join(contentRoot, "local-systems", filename);
    let body = await readFile(path, "utf8");
    if (!body.includes(config.localHeading)) {
      body = body.trimEnd() + "\n\n" + config.localHeading + "\n\nThe [" + config.title + " Registry](/evidence/" + config.routeBase + "/) " + config.localIntegrationText + "\n";
      await writeFile(path, body, "utf8");
    }
  }

  const operatingBriefings = ["briefing-outcomes-watch-001-what-actually-changed.mdx", "briefing-decision-accountability-desk-001.mdx", "briefing-public-investment-doctrine-001.mdx", "briefing-procurement-vendor-lockin-public-options-001.mdx", "briefing-public-wealth-balance-sheet-001.mdx", "briefing-cooperatives-employee-ownership-public-employment-001.mdx", "briefing-worker-voice-organizing-collective-bargaining-001.mdx", "briefing-platform-gig-informal-contingent-work-001.mdx", "briefing-distributional-public-balance-sheets-001.mdx", "briefing-community-wealth-universal-supports-public-options-001.mdx", "briefing-cross-case-public-authority-001.mdx", "briefing-shared-public-value-allocation-001.mdx"];
  for (const filename of operatingBriefings) {
    const path = join(contentRoot, "briefings", filename);
    let body = await readFile(path, "utf8");
    if (!body.includes(config.operatingHeading)) {
      body = body.trimEnd() + "\n\n" + config.operatingHeading + "\n\nThe [" + config.title + " Registry](/evidence/" + config.routeBase + "/) adds four eight-record inactive families. " + config.zeroDecisionSentence + "\n";
      await writeFile(path, body, "utf8");
    }
  }

  await writeJson(join(contentRoot, "updates", config.updateFilename), {
    id: "update-" + config.updateFilename.replace(/\.json$/, ""),
    effective_date: config.date,
    entry_type: "Source Refresh",
    title: config.updateTitle,
    summary: config.updateSummary,
    affected_record_ids: [...guideIds, ...mapIds, "briefing-outcomes-watch-001-what-actually-changed", "gap-015", "gap-016"],
    related_paths: ["/evidence/" + config.routeBase + "/", ...config.guides.map((guide) => "/briefings/" + guide.slug + "/"), "/data/" + config.routeBase + ".json"],
    evidence_note: config.updateEvidenceNote,
    materiality: "No record-state change",
    publication_effect: "Adds twelve Published briefings, six Published maps, one searchable registry with thirty-two detail routes, one public export, and reader-surface integrations while leaving all evidence and operating states unchanged.",
    next_check_date: "2026-09-01",
    work_package: "docs/work-packages/" + config.workPackageFilename
  });

  console.log("Phase " + config.phase + " content built: four eight-record inactive families, " + guideIds.length + " guides, " + mapIds.length + " maps, " + pathwayIds.length + " pathways, and 0 substantive decisions.");
}
