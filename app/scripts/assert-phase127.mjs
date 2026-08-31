import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const sameSet = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && new Set(left).size === left.length && new Set(right).size === right.length && left.every((item) => new Set(right).has(item));
const sameArray = (left, right) => Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
const unique = (values) => [...new Set(values.filter(Boolean))];
const words = (value) => value.match(/[\p{L}\p{N}]+(?:[’'–—-][\p{L}\p{N}]+)*/gu)?.length ?? 0;

function frontmatter(raw) {
  return raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
}

function parseScalar(raw = "") {
  const value = raw.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1);
  return value;
}

function scalar(block, key) {
  const match = block.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  return match ? parseScalar(match[1]) : "";
}

function array(block, key) {
  const lines = block.split(/\r?\n/);
  const start = lines.findIndex((line) => new RegExp(`^${key}:\\s*$`).test(line));
  if (start < 0) return [];
  const values = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^\s+-\s+(.*)$/);
    if (!match) break;
    values.push(parseScalar(match[1]));
  }
  return values;
}

const [registry, atlas, coverage, matrix, cycle, queue, envelopes, propagation] = await Promise.all([
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-119-deep-project-place-atlas.json"),
  readJson("phase-116-coverage-architecture.json"),
  readJson("phase-64-conversion-stage-matrix.json"),
  readJson("phase-60-operating-cycle.json"),
  readJson("phase-58-dated-evidence-queue.json"),
  readJson("phase-67-evidence-return-envelope-ledger.json"),
  readJson("phase-60-propagation-contract.json"),
]);

const signalById = new Map();
for (const name of await readdir(join(appRoot, "src", "content", "signals"))) {
  if (!/\.mdx?$/.test(name)) continue;
  const block = frontmatter(await readFile(join(appRoot, "src", "content", "signals", name), "utf8"));
  const id = scalar(block, "id");
  signalById.set(id, {
    id,
    title: scalar(block, "title"),
    summary: scalar(block, "summary"),
    primary_topic: scalar(block, "primary_topic"),
    record_status: scalar(block, "record_status"),
    source_ids: array(block, "source_ids"),
  });
}

const sourceIds = new Set();
for (const name of await readdir(join(appRoot, "src", "content", "sources"))) {
  if (!name.endsWith(".json")) continue;
  sourceIds.add(JSON.parse(await readFile(join(appRoot, "src", "content", "sources", name), "utf8")).id);
}

const matrixByFileId = new Map(matrix.file_rows.map((record) => [record.file_id, record]));
const allowedStates = new Set(["Governed upstream", "Published context", "Not established", "Not applicable"]);
const expectedHeadings = ["Current bounded account", "Turning points", "Strongest evidence", "Unresolved bridge", "Exact next artifact", "Interpretation boundary"];
const expectedDimensionLabels = ["Authority and governance", "Capital and procurement", "Physical infrastructure", "Workforce and operation", "Environment and resources", "Public outcomes"];
const expectedDimensionKeywords = [
  ["authority", "permit", "licence", "license", "regulat", "decision", "council", "policy", "approval", "standards"],
  ["capital", "finance", "loan", "fund", "procurement", "contract", "award", "investment", "agreement"],
  ["infrastructure", "construction", "facility", "capacity", "grid", "station", "tower", "bridge", "plant", "build"],
  ["workforce", "employment", "training", "jobs", "operation", "service", "output", "subscriber", "delivery", "readiness"],
  ["water", "waste", "environment", "climate", "safety", "fire", "hazard", "energy", "land", "emission"],
  ["outcome", "reliability", "accessibility", "adoption", "utilization", "subscriber", "completion", "incident", "cost", "community"],
];
const allNarrativeBodies = [];
const projectNarratives = [];
const placeNarratives = [];

check(registry.schema_version === "1.0", "Phase 127 must use schema version 1.0.");
check(registry.phase === 127 && registry.program_id === "FTFN-PHASE-127-PROJECT-PLACE-CONVERSION-BIOGRAPHIES", "Phase 127 program identity is invalid.");
check(registry.effective_date === "2026-08-30" && registry.record_status === "Published" && registry.status === "Complete", "Phase 127 release state or effective date is invalid.");
check(registry.counts.project_biographies === 24 && registry.project_biographies.length === 24, "Phase 127 must contain 24 project biographies.");
check(registry.counts.project_stage_cells === 192, "Phase 127 must contain exactly 192 project-stage cells.");
check(registry.counts.place_biographies === 15 && registry.place_biographies.length === 15, "Phase 127 must contain 15 place biographies.");
check(registry.counts.place_system_assessments === 90, "Phase 127 must contain exactly 90 place-system assessments.");
check(registry.counts.governed_projects_preserved === 8 && registry.counts.curated_projects_preserved === 16, "Phase 127 must preserve the Phase 119 project tier split of 8/16.");
check(registry.counts.governed_places_preserved === 5 && registry.counts.curated_places_preserved === 10, "Phase 127 must preserve the Phase 119 place tier split of 5/10.");
check(registry.counts.exact_artifacts_admitted === 0 && registry.counts.review_receipts_created === 0 && registry.counts.stage_advances_created === 0 && registry.counts.project_to_place_inheritances === 0, "Phase 127 must create no artifact, receipt, stage advance, or project-to-place inheritance.");
check(sameSet(registry.allowed_states, [...allowedStates]), "Phase 127 allowed-state taxonomy is invalid.");

check(registry.new_html_routes.length === 1 && registry.new_html_routes[0] === "/review/fieldbook/delivery-biographies/", "Phase 127 must add exactly one delivery-biography hub.");
check(registry.enhanced_existing_routes.length === 39 && new Set(registry.enhanced_existing_routes).size === 39, "Phase 127 must expose 39 unique enhanced Atlas routes.");
check(registry.public_json_exports.length === 1 && registry.public_json_exports[0] === "/data/phase-127-project-place-conversion-biographies.json", "Phase 127 public export route is invalid.");
check(registry.counts.new_html_routes === 1 && registry.counts.enhanced_existing_routes === 39 && registry.counts.substantive_surfaces === 40 && registry.counts.public_json_exports === 1, "Phase 127 route counts must be 1 new, 39 enhanced, 40 substantive and one export.");
check(registry.public_html_routes.length === 40 && sameSet(registry.public_html_routes, [...registry.new_html_routes, ...registry.enhanced_existing_routes]), "Phase 127 public route union is invalid.");
check(!registry.enhanced_existing_routes.includes(registry.new_html_routes[0]), "Phase 127 new and enhanced routes overlap.");

check(registry.project_stage_taxonomy.length === 8, "Phase 127 must copy all eight Phase 116 stages.");
for (let index = 0; index < coverage.conversion_stages.length; index += 1) {
  const expected = coverage.conversion_stages[index];
  const actual = registry.project_stage_taxonomy[index];
  check(actual.stage_id === expected.stage_id && actual.sequence === expected.sequence && actual.label === expected.label && actual.question === expected.question, `Phase 127 stage taxonomy differs from Phase 116 at sequence ${index + 1}.`);
}
check(registry.place_dimension_taxonomy.length === 6 && registry.place_dimension_taxonomy.map((record) => record.label).join("|") === expectedDimensionLabels.join("|"), "Phase 127 place-dimension taxonomy is invalid.");

for (let index = 0; index < registry.project_biographies.length; index += 1) {
  const record = registry.project_biographies[index];
  const upstream = atlas.projects[index];
  const expectedId = `127-PROJECT-${String(index + 1).padStart(3, "0")}`;
  check(record.biography_id === expectedId, `${record.biography_id} breaks Phase 127 project ID order.`);
  check(record.atlas_project_id === upstream.atlas_project_id && record.canonical_id === upstream.canonical_id && record.slug === upstream.slug && record.title === upstream.title, `${expectedId} does not preserve Phase 119 project identity and order.`);
  check(record.public_route === upstream.routes.atlas && registry.enhanced_existing_routes.includes(record.public_route), `${expectedId} does not resolve to its exact existing Atlas route.`);
  const snapshot = record.phase_119_snapshot;
  check(snapshot.coverage_tier_id === upstream.coverage.tier_id && snapshot.coverage_label === upstream.coverage.label && snapshot.coverage_basis === upstream.coverage.basis, `${expectedId} changes its Phase 119 project coverage tier.`);
  check(snapshot.current_stage === upstream.conversion.current_stage && snapshot.stage_basis === upstream.conversion.stage_basis, `${expectedId} changes its Phase 119 current-stage account.`);
  check(snapshot.unresolved === upstream.conversion.unresolved && snapshot.unresolved_gate === upstream.conversion.unresolved_gate && snapshot.exact_next_artifact === upstream.conversion.exact_next_artifact && snapshot.update_status === upstream.update_status, `${expectedId} changes its inherited project boundary or stewardship state.`);
  check(sameSet(record.related_place_ids, upstream.relationships.related_place_ids) && sameSet(record.evidence_signal_ids, upstream.evidence_rails.signal_ids) && sameSet(record.evidence_source_ids, upstream.evidence_rails.source_ids), `${expectedId} changes Phase 119 project relationships or evidence rails.`);

  check(record.stage_cells.length === 8, `${expectedId} must contain exactly eight project-stage cells.`);
  const fileId = upstream.relationships.phase_61_file_ids[0] ?? null;
  const matrixRow = fileId ? matrixByFileId.get(fileId) : null;
  const matrixCells = new Map((matrixRow?.stage_cells ?? []).map((cell) => [cell.stage_id, cell]));
  for (let stageIndex = 0; stageIndex < record.stage_cells.length; stageIndex += 1) {
    const cell = record.stage_cells[stageIndex];
    const stage = coverage.conversion_stages[stageIndex];
    const upstreamCell = matrixCells.get(stage.stage_id);
    const expectedState = matrixRow && upstreamCell?.cell_state !== "Not Established"
      ? "Governed upstream"
      : !matrixRow && stage.sequence === 1 && cell.published_context_signal_ids.length > 0
        ? "Published context"
        : "Not established";
    check(cell.cell_id === `${expectedId}-STAGE-${String(stage.sequence).padStart(2, "0")}`, `${expectedId} has a malformed stage-cell ID at ${stage.stage_id}.`);
    check(cell.stage_id === stage.stage_id && cell.sequence === stage.sequence && cell.label === stage.label && cell.question === stage.question, `${cell.cell_id} changes the Phase 116 stage identity or order.`);
    check(allowedStates.has(cell.state) && cell.state === expectedState, `${cell.cell_id} has an unsupported or non-derived state ${cell.state}.`);
    check(cell.basis && cell.interpretation_boundary.includes("not a new conversion decision"), `${cell.cell_id} lacks a bounded basis.`);
    if (cell.state === "Governed upstream") {
      check(Boolean(matrixRow && upstreamCell), `${cell.cell_id} claims governed lineage without a Phase 64 cell.`);
      check(cell.upstream_cell_state === upstreamCell?.cell_state && cell.upstream_cell_state !== "Not Established", `${cell.cell_id} changes its Phase 64 cell state.`);
      check(sameSet(cell.governed_lineage.phase_61_file_ids, upstream.relationships.phase_61_file_ids), `${cell.cell_id} has wrong Phase 61 lineage.`);
      check(sameSet(cell.governed_lineage.phase_62_event_ids, upstreamCell?.evidence_event_ids ?? []), `${cell.cell_id} has wrong Phase 62 event lineage.`);
      check(sameSet(cell.governed_lineage.phase_63_gate_ids, upstream.relationships.phase_63_gate_ids) && sameSet(cell.governed_lineage.phase_64_row_ids, upstream.relationships.phase_64_row_ids), `${cell.cell_id} has wrong Phase 63–64 lineage.`);
      check(cell.published_context_signal_ids.length === 0 && cell.published_context_source_ids.length === 0, `${cell.cell_id} mixes governed and context lineages.`);
    } else if (cell.state === "Published context") {
      check(Object.values(cell.governed_lineage).every((ids) => ids.length === 0), `${cell.cell_id} presents context as governed lineage.`);
      check(cell.published_context_signal_ids.length > 0 && cell.published_context_source_ids.length > 0, `${cell.cell_id} lacks exact Published context lineage.`);
      for (const signalId of cell.published_context_signal_ids) {
        const signal = signalById.get(signalId);
        check(signal?.record_status === "Published" && upstream.evidence_rails.signal_ids.includes(signalId), `${cell.cell_id} uses missing, non-Published, or non-inherited signal ${signalId}.`);
      }
      for (const sourceId of cell.published_context_source_ids) {
        check(sourceIds.has(sourceId) && upstream.evidence_rails.source_ids.includes(sourceId), `${cell.cell_id} uses missing or non-inherited source ${sourceId}.`);
        check(cell.published_context_signal_ids.some((signalId) => signalById.get(signalId)?.source_ids.includes(sourceId)), `${cell.cell_id} source ${sourceId} is not carried by its Published signal lineage.`);
      }
    } else {
      check(Object.values(cell.governed_lineage).every((ids) => ids.length === 0) && cell.published_context_signal_ids.length === 0 && cell.published_context_source_ids.length === 0, `${cell.cell_id} attaches evidence lineage to ${cell.state}.`);
      check(cell.state !== "Not applicable" || /scope/i.test(cell.basis), `${cell.cell_id} uses Not applicable without explicit scope reasoning.`);
      check(cell.state !== "Not established" || /repository/i.test(cell.basis), `${cell.cell_id} must bound Not established to this repository.`);
    }
  }

  check(record.narrative_sections.length === 6 && record.narrative_sections.map((section) => section.heading).join("|") === expectedHeadings.join("|"), `${expectedId} lacks the six required narrative sections in order.`);
  const count = record.narrative_sections.reduce((total, section) => total + words(section.body), 0);
  check(count === record.narrative_metrics.authored_word_count && count >= 500, `${expectedId} authored narrative has ${count} words; at least 500 are required.`);
  check(record.narrative_metrics.measurement_boundary.includes("excludes route template"), `${expectedId} does not expose the word-count boundary.`);
  check(record.narrative_sections.every((section, sectionIndex) => section.section_id === `${expectedId}-NARRATIVE-${String(sectionIndex + 1).padStart(2, "0")}` && section.body.includes(record.title)), `${expectedId} has a malformed or non-record-specific narrative section.`);
  const fullNarrative = record.narrative_sections.map((section) => section.body).join("\n");
  check(!/[?!]\./.test(fullNarrative), `${expectedId} contains a duplicated terminal-punctuation artifact.`);
  projectNarratives.push(fullNarrative);
  allNarrativeBodies.push(...record.narrative_sections.map((section) => section.body));
}

for (let index = 0; index < registry.place_biographies.length; index += 1) {
  const record = registry.place_biographies[index];
  const upstream = atlas.places[index];
  const expectedId = `127-PLACE-${String(index + 1).padStart(3, "0")}`;
  check(record.biography_id === expectedId, `${record.biography_id} breaks Phase 127 place ID order.`);
  check(record.atlas_place_id === upstream.atlas_place_id && record.canonical_id === upstream.canonical_id && record.slug === upstream.slug && record.title === upstream.title && record.geography === upstream.geography, `${expectedId} does not preserve Phase 119 place identity and order.`);
  check(record.public_route === upstream.routes.atlas && registry.enhanced_existing_routes.includes(record.public_route), `${expectedId} does not resolve to its exact existing Atlas route.`);
  const snapshot = record.phase_119_snapshot;
  check(snapshot.coverage_tier_id === upstream.coverage.tier_id && snapshot.coverage_label === upstream.coverage.label && snapshot.coverage_basis === upstream.coverage.basis, `${expectedId} changes its Phase 119 place coverage tier.`);
  check(snapshot.current_state === upstream.conversion.current_stage && snapshot.state_basis === upstream.conversion.stage_basis, `${expectedId} changes its Phase 119 place current-state account.`);
  check(snapshot.unresolved === upstream.conversion.unresolved && snapshot.unresolved_gate === upstream.conversion.unresolved_gate && snapshot.exact_next_artifact === upstream.conversion.exact_next_artifact && snapshot.update_status === upstream.update_status, `${expectedId} changes its inherited place boundary or stewardship state.`);
  check(sameSet(record.related_project_ids, upstream.relationships.related_project_ids) && sameSet(record.evidence_signal_ids, upstream.evidence_rails.signal_ids) && sameSet(record.evidence_source_ids, upstream.evidence_rails.source_ids), `${expectedId} changes Phase 119 place relationships or evidence rails.`);
  check(!Object.hasOwn(record, "conversion_stage") && !Object.hasOwn(record, "stage_cells"), `${expectedId} must not receive a place-level conversion stage.`);

  check(record.dimension_assessments.length === 6, `${expectedId} must contain exactly six place assessments.`);
  for (let dimensionIndex = 0; dimensionIndex < record.dimension_assessments.length; dimensionIndex += 1) {
    const assessment = record.dimension_assessments[dimensionIndex];
    const taxonomy = registry.place_dimension_taxonomy[dimensionIndex];
    const keywords = expectedDimensionKeywords[dimensionIndex];
    const relevantSignals = upstream.evidence_rails.signal_ids
      .map((signalId) => signalById.get(signalId))
      .filter((signal) => {
        if (signal?.record_status !== "Published") return false;
        const haystack = `${signal.title} ${signal.summary} ${signal.primary_topic}`.toLowerCase();
        return keywords.some((keyword) => haystack.includes(keyword));
      })
      .slice(0, 4);
    const inheritedSourceIds = new Set(upstream.evidence_rails.source_ids);
    const relevantSourceIds = unique(relevantSignals.flatMap((signal) => signal.source_ids))
      .filter((sourceId) => inheritedSourceIds.has(sourceId) && sourceIds.has(sourceId));
    const expectedContextState = relevantSignals.length > 0 && relevantSourceIds.length > 0;
    const expectedSignalIds = expectedContextState ? relevantSignals.map((signal) => signal.id) : [];
    const expectedSourceIds = expectedContextState ? relevantSourceIds : [];
    check(assessment.assessment_id === `${expectedId}-DIMENSION-${String(dimensionIndex + 1).padStart(2, "0")}`, `${expectedId} has a malformed place-assessment ID.`);
    check(assessment.dimension_id === taxonomy.dimension_id && assessment.sequence === taxonomy.sequence && assessment.label === taxonomy.label && assessment.question === taxonomy.question, `${assessment.assessment_id} changes the place-dimension identity or order.`);
    check(allowedStates.has(assessment.state) && ["Published context", "Not established"].includes(assessment.state), `${assessment.assessment_id} has unsupported place state ${assessment.state}.`);
    check(assessment.project_stage_inherited === false && Object.values(assessment.governed_lineage).every((ids) => ids.length === 0), `${assessment.assessment_id} inherits project-stage or governed project lineage.`);
    check(assessment.interpretation_boundary.includes("never inherits a linked project's stage"), `${assessment.assessment_id} lacks the non-inheritance boundary.`);
    check(assessment.state === (expectedContextState ? "Published context" : "Not established"), `${assessment.assessment_id} does not reflect its exact keyword-relevant Published signal and resolving-source status.`);
    check(sameArray(assessment.published_context_signal_ids, expectedSignalIds), `${assessment.assessment_id} does not carry the exact ordered keyword-relevant Published signal lineage.`);
    check(sameArray(assessment.published_context_source_ids, expectedSourceIds), `${assessment.assessment_id} does not carry the exact ordered resolving-source lineage.`);
    if (assessment.state === "Published context") {
      check(assessment.published_context_signal_ids.length > 0 && assessment.published_context_source_ids.length > 0, `${assessment.assessment_id} lacks exact Published context lineage.`);
      for (const signalId of assessment.published_context_signal_ids) {
        const signal = signalById.get(signalId);
        check(signal?.record_status === "Published" && upstream.evidence_rails.signal_ids.includes(signalId), `${assessment.assessment_id} uses missing, non-Published, or non-inherited signal ${signalId}.`);
        const haystack = `${signal?.title} ${signal?.summary} ${signal?.primary_topic}`.toLowerCase();
        check(keywords.some((keyword) => haystack.includes(keyword)), `${assessment.assessment_id} uses signal ${signalId} without a dimension-keyword match.`);
      }
      for (const sourceId of assessment.published_context_source_ids) {
        check(sourceIds.has(sourceId) && upstream.evidence_rails.source_ids.includes(sourceId), `${assessment.assessment_id} uses missing or non-inherited source ${sourceId}.`);
        check(assessment.published_context_signal_ids.some((signalId) => signalById.get(signalId)?.source_ids.includes(sourceId)), `${assessment.assessment_id} source ${sourceId} is not carried by its Published signal lineage.`);
      }
    } else {
      check(assessment.published_context_signal_ids.length === 0 && assessment.published_context_source_ids.length === 0 && /repository/i.test(assessment.basis), `${assessment.assessment_id} must expose a repository-bounded evidence gap without lineage.`);
    }
  }

  check(record.narrative_sections.length === 6 && record.narrative_sections.map((section) => section.heading).join("|") === expectedHeadings.join("|"), `${expectedId} lacks the six required narrative sections in order.`);
  const count = record.narrative_sections.reduce((total, section) => total + words(section.body), 0);
  check(count === record.narrative_metrics.authored_word_count && count >= 650, `${expectedId} authored narrative has ${count} words; at least 650 are required.`);
  check(record.narrative_metrics.measurement_boundary.includes("excludes route template"), `${expectedId} does not expose the word-count boundary.`);
  check(record.narrative_sections.every((section, sectionIndex) => section.section_id === `${expectedId}-NARRATIVE-${String(sectionIndex + 1).padStart(2, "0")}` && section.body.includes(record.title)), `${expectedId} has a malformed or non-record-specific narrative section.`);
  const fullNarrative = record.narrative_sections.map((section) => section.body).join("\n");
  check(!/[?!]\./.test(fullNarrative), `${expectedId} contains a duplicated terminal-punctuation artifact.`);
  placeNarratives.push(fullNarrative);
  allNarrativeBodies.push(...record.narrative_sections.map((section) => section.body));
}

check(registry.project_biographies.reduce((sum, record) => sum + record.stage_cells.length, 0) === 192, "Phase 127 project-stage aggregate is stale.");
check(registry.place_biographies.reduce((sum, record) => sum + record.dimension_assessments.length, 0) === 90, "Phase 127 place-assessment aggregate is stale.");
const projectWordCounts = registry.project_biographies.map((record) => record.narrative_metrics.authored_word_count);
const placeWordCounts = registry.place_biographies.map((record) => record.narrative_metrics.authored_word_count);
check(registry.counts.project_authored_words === projectWordCounts.reduce((sum, value) => sum + value, 0) && registry.counts.minimum_project_authored_words === Math.min(...projectWordCounts), "Phase 127 project word metrics are stale.");
check(registry.counts.place_authored_words === placeWordCounts.reduce((sum, value) => sum + value, 0) && registry.counts.minimum_place_authored_words === Math.min(...placeWordCounts), "Phase 127 place word metrics are stale.");
check(new Set(projectNarratives).size === 24 && new Set(placeNarratives).size === 15 && new Set(allNarrativeBodies).size === allNarrativeBodies.length, "Phase 127 contains duplicated full biographies or narrative-section bodies.");

const futureGates = cycle.records.filter((record) => record.scheduled_check_date > registry.effective_date);
check(futureGates.length === 11 && futureGates.every((record) => record.decision_status === "scheduled" && record.decision_date === null && record.receipt_id === null), "Phase 127 must leave all eleven post-August-30 Phase 60 gates scheduled and unreceipted.");
const starlinkCycle = cycle.records.find((record) => record.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION");
const starlinkQueue = queue.records.find((record) => record.queue_id === "58-QUEUE-LOUISIANA-STARLINK-ADOPTION");
const starlinkEnvelope = envelopes.envelope_records.find((record) => record.envelope_id === "67-RETURN-003");
check(starlinkCycle?.scheduled_check_date === "2026-09-01" && starlinkCycle.decision_status === "scheduled" && starlinkCycle.decision_date === null && starlinkCycle.receipt_id === null, "Phase 127 must not operate the September 1 Starlink gate.");
check(starlinkQueue?.current_decision === "queued_watch" && starlinkQueue.latest_receipt_id === null && starlinkQueue.next_check_date === "2026-09-01" && starlinkQueue.underlying_signal_status === "In Review", "Phase 127 must not change the Starlink queue or signal state.");
check(starlinkEnvelope?.envelope_state === "Scheduled" && starlinkEnvelope.attempted_surfaces.length === 0 && starlinkEnvelope.access_result === null && starlinkEnvelope.receipt_id === null && starlinkEnvelope.decision_date === null && starlinkEnvelope.decision_status === "scheduled" && starlinkEnvelope.propagation_status === "not_started" && starlinkEnvelope.next_check_date === null, "Phase 127 must not populate the future Starlink return envelope.");
check(!propagation.cycle_decision_proofs.some((record) => record.cycle_item_id === "60-CYCLE-LOUISIANA-STARLINK-ADOPTION"), "Phase 127 must not precreate a Starlink propagation proof.");
check(signalById.get("signal-57y-preserved-la-starlink-adoption")?.record_status === "In Review", "Phase 127 must keep the future Starlink signal In Review.");

const requiredFiles = [
  "src/data/phase-127-project-place-conversion-biographies.json",
  "src/pages/data/phase-127-project-place-conversion-biographies.json.ts",
  "src/pages/review/fieldbook/delivery-biographies/index.astro",
  "src/content/updates/2026-08-30-phase-127-project-place-conversion-biographies.json",
];
for (const path of requiredFiles) {
  try { await access(join(appRoot, path)); } catch { failures.push(`Missing Phase 127 artifact: ${path}`); }
}
try { await access(join(workspaceRoot, "docs", "work-packages", "phase-127-v06-project-place-conversion-biographies.md")); }
catch { failures.push("Missing Phase 127 work package."); }

const projectTemplate = await readFile(join(appRoot, "src", "pages", "atlas", "projects", "[slug].astro"), "utf8");
const placeTemplate = await readFile(join(appRoot, "src", "pages", "atlas", "places", "[slug].astro"), "utf8");
const hub = await readFile(join(appRoot, "src", "pages", "review", "fieldbook", "delivery-biographies", "index.astro"), "utf8");
const endpoint = await readFile(join(appRoot, "src", "pages", "data", "phase-127-project-place-conversion-biographies.json.ts"), "utf8");
check(projectTemplate.includes("phase-127-project-place-conversion-biographies.json") && projectTemplate.includes("Phase 127") && projectTemplate.includes("biography.biography_id") && projectTemplate.includes("biography.stage_cells"), "Every project route must render its exact Phase 127 biography ID and stage cells.");
check(placeTemplate.includes("phase-127-project-place-conversion-biographies.json") && placeTemplate.includes("Phase 127") && placeTemplate.includes("biography.biography_id") && placeTemplate.includes("biography.dimension_assessments"), "Every place route must render its exact Phase 127 biography ID and dimension assessments.");
check(hub.includes("Project and Place Conversion Biographies") && hub.includes("phase-127-project-place-conversion-biographies.json") && hub.includes("project_biographies") && hub.includes("place_biographies"), "The Phase 127 hub must expose both biography sets and the direct export.");
check(endpoint.includes("JSON.stringify(registry, null, 2)") && !endpoint.includes("registry:"), "The Phase 127 endpoint must serialize the direct schema-1.0 registry without a wrapper.");

const update = JSON.parse(await readFile(join(appRoot, "src", "content", "updates", "2026-08-30-phase-127-project-place-conversion-biographies.json"), "utf8"));
const workPackage = await readFile(join(workspaceRoot, "docs", "work-packages", "phase-127-v06-project-place-conversion-biographies.md"), "utf8");
const expectedAffectedPublicIds = [...new Set([
  ...atlas.projects.map((record) => record.relationships.canonical_briefing_ids[0] ?? record.evidence_rails.signal_ids[0]),
  ...atlas.places.map((record) => record.relationships.local_system_ids[0] ?? record.evidence_rails.signal_ids[0]),
].filter(Boolean))];
check(sameSet(update.affected_record_ids, expectedAffectedPublicIds), "The Phase 127 update must name the exact resolving public briefing, signal, or local-system records for all Atlas biographies.");
check(update.related_paths.length === 41 && sameSet(update.related_paths, [...registry.new_html_routes, ...registry.enhanced_existing_routes, ...registry.public_json_exports]), "The Phase 127 update must expose all 41 affected public paths.");
check(update.materiality === "No record-state change" && /no stage advance or project-to-place inheritance/i.test(update.summary), "The Phase 127 update lacks its no-state-change boundary.");
check(workPackage.includes("192 exact project-stage cells") && workPackage.includes("90 place assessments") && workPackage.includes(`${registry.counts.minimum_project_authored_words} words per project`) && workPackage.includes(`${registry.counts.minimum_place_authored_words} words per place`), "The Phase 127 work package does not expose exact counts and narrative floors.");

if (failures.length) {
  console.error("Phase 127 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 127 assertions passed: 24 project biographies, 192 exact stage cells, 15 place biographies, 90 exact place-system assessments, ${registry.counts.project_authored_words} project words (min ${registry.counts.minimum_project_authored_words}), ${registry.counts.place_authored_words} place words (min ${registry.counts.minimum_place_authored_words}), one new hub, 39 enhanced Atlas routes, and eleven future gates untouched.`);
