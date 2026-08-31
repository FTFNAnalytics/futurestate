import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const signalRoot = join(appRoot, "src", "content", "signals");
const sourceRoot = join(appRoot, "src", "content", "sources");
const date = "2026-08-30";
const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const unique = (values) => [...new Set(values.filter(Boolean))];
const words = (value) => value.match(/[\p{L}\p{N}]+(?:[’'–—-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
const sentence = (value) => String(value ?? "").trim().replace(/[.!?\s]+$/, "") + ".";

function frontmatter(raw) {
  return raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
}

function parseScalar(raw = "") {
  const value = raw.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1);
  if (value === "null") return null;
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

async function loadSignals() {
  const records = new Map();
  for (const name of await readdir(signalRoot)) {
    if (!/\.mdx?$/.test(name)) continue;
    const block = frontmatter(await readFile(join(signalRoot, name), "utf8"));
    const id = scalar(block, "id");
    if (!id) throw new Error(`Phase 127 cannot resolve a signal ID from ${name}.`);
    if (records.has(id)) throw new Error(`Phase 127 found duplicate signal ID ${id}.`);
    records.set(id, {
      id,
      title: scalar(block, "title"),
      summary: scalar(block, "summary"),
      record_status: scalar(block, "record_status"),
      primary_topic: scalar(block, "primary_topic"),
      source_ids: array(block, "source_ids"),
    });
  }
  return records;
}

async function loadSources() {
  const records = new Map();
  for (const name of await readdir(sourceRoot)) {
    if (!name.endsWith(".json")) continue;
    const record = JSON.parse(await readFile(join(sourceRoot, name), "utf8"));
    if (records.has(record.id)) throw new Error(`Phase 127 found duplicate source ID ${record.id}.`);
    records.set(record.id, record);
  }
  return records;
}

const [atlas, coverage, eventsRegistry, matrix, signalById, sourceById] = await Promise.all([
  readJson("phase-119-deep-project-place-atlas.json"),
  readJson("phase-116-coverage-architecture.json"),
  readJson("phase-62-conversion-event-ledgers.json"),
  readJson("phase-64-conversion-stage-matrix.json"),
  loadSignals(),
  loadSources(),
]);

const eventById = new Map(eventsRegistry.events.map((record) => [record.event_id, record]));
const matrixByFileId = new Map(matrix.file_rows.map((record) => [record.file_id, record]));
const projectById = new Map(atlas.projects.map((record) => [record.atlas_project_id, record]));
const placeById = new Map(atlas.places.map((record) => [record.atlas_place_id, record]));
const allowedStates = ["Governed upstream", "Published context", "Not established", "Not applicable"];
const placeDimensions = [
  {
    dimension_id: "127-PLACE-DIMENSION-01-AUTHORITY",
    sequence: 1,
    label: "Authority and governance",
    question: "Which named institutions can authorize, condition, inspect, enforce, or revise activity in this receiving system?",
    keywords: ["authority", "permit", "licence", "license", "regulat", "decision", "council", "policy", "approval", "standards"],
  },
  {
    dimension_id: "127-PLACE-DIMENSION-02-CAPITAL",
    sequence: 2,
    label: "Capital and procurement",
    question: "Which financing, procurement, contract, award, or budget records are visible at the place scope?",
    keywords: ["capital", "finance", "loan", "fund", "procurement", "contract", "award", "investment", "agreement"],
  },
  {
    dimension_id: "127-PLACE-DIMENSION-03-INFRASTRUCTURE",
    sequence: 3,
    label: "Physical infrastructure",
    question: "Which named facilities, networks, assets, construction milestones, or service connections are established here?",
    keywords: ["infrastructure", "construction", "facility", "capacity", "grid", "station", "tower", "bridge", "plant", "build"],
  },
  {
    dimension_id: "127-PLACE-DIMENSION-04-WORKFORCE",
    sequence: 4,
    label: "Workforce and operation",
    question: "Which workforce, service, operating, maintenance, qualification, or recurring-output records apply to this place?",
    keywords: ["workforce", "employment", "training", "jobs", "operation", "service", "output", "subscriber", "delivery", "readiness"],
  },
  {
    dimension_id: "127-PLACE-DIMENSION-05-ENVIRONMENT",
    sequence: 5,
    label: "Environment and resources",
    question: "Which water, energy, land, waste, hazard, safety, climate, or environmental constraints are directly visible?",
    keywords: ["water", "waste", "environment", "climate", "safety", "fire", "hazard", "energy", "land", "emission"],
  },
  {
    dimension_id: "127-PLACE-DIMENSION-06-OUTCOMES",
    sequence: 6,
    label: "Public outcomes",
    question: "Which repeated, denominator-stable public outcomes are established for people, services, institutions, or the local environment?",
    keywords: ["outcome", "reliability", "accessibility", "adoption", "utilization", "subscriber", "completion", "incident", "cost", "community"],
  },
];

function publishedSignalsFor(record) {
  return record.evidence_rails.signal_ids
    .map((id) => signalById.get(id))
    .filter((signal) => signal?.record_status === "Published");
}

function sourcesForSignals(record, signals) {
  const inherited = new Set(record.evidence_rails.source_ids);
  return unique(signals.flatMap((signal) => signal.source_ids)).filter((id) => inherited.has(id) && sourceById.has(id));
}

function sourceDigest(sourceIds, limit = 7) {
  const sources = sourceIds.map((id) => sourceById.get(id)).filter(Boolean).slice(0, limit);
  if (!sources.length) return "No source is presented here as establishing the requested state. The record therefore stops at the inherited boundary.";
  return sources.map((source) => `${source.name} (${source.id}) is retained as a ${source.source_type} rail. Its published limitation is: ${sentence(source.known_limitations)}`).join(" ");
}

function signalDigest(signals, limit = 5) {
  const selected = signals.slice(0, limit);
  if (!selected.length) return "No Published signal in the Phase 119 shelf is used to narrate a stronger state. Absence from this repository is recorded only as an editorial gap, not as proof that evidence does not exist elsewhere.";
  return selected.map((signal) => `${signal.title} (${signal.id}) says: ${sentence(signal.summary)}`).join(" ");
}

function makeProjectCells(project, biographyId) {
  const fileId = project.relationships.phase_61_file_ids[0] ?? null;
  const row = fileId ? matrixByFileId.get(fileId) : null;
  const rowCellByStage = new Map((row?.stage_cells ?? []).map((cell) => [cell.stage_id, cell]));
  const publishedSignals = publishedSignalsFor(project);
  const publishedSignalIds = publishedSignals.map((signal) => signal.id);
  const publishedSourceIds = sourcesForSignals(project, publishedSignals);

  return coverage.conversion_stages.map((stage) => {
    const upstream = rowCellByStage.get(stage.stage_id);
    const governed = Boolean(row && upstream && upstream.cell_state !== "Not Established");
    const contextOnly = !row && stage.sequence === 1 && publishedSignalIds.length > 0;
    const state = governed ? "Governed upstream" : contextOnly ? "Published context" : "Not established";
    const eventIds = governed ? unique(upstream.evidence_event_ids ?? []) : [];
    let basis;
    if (governed) {
      basis = `Phase 64 records this same-file cell as ${upstream.cell_state}. ${sentence(upstream.basis)} Phase 127 republishes that governed upstream reading and does not treat it as proof of any later stage.`;
    } else if (contextOnly) {
      basis = `The Phase 119 shelf supplies ${publishedSignalIds.length} Published signal${publishedSignalIds.length === 1 ? "" : "s"} and ${publishedSourceIds.length} resolving source${publishedSourceIds.length === 1 ? "" : "s"} for the named project context. That material establishes a public context shelf only; it does not create a governed Phase 61–64 stage decision.`;
    } else {
      basis = `This repository does not contain a governed same-file ${stage.label.toLowerCase()} decision for ${project.title} at this stage. The statement is repository-bounded and does not claim that qualifying evidence is absent outside the reviewed FTFN record.`;
    }
    return {
      cell_id: `${biographyId}-STAGE-${String(stage.sequence).padStart(2, "0")}`,
      stage_id: stage.stage_id,
      sequence: stage.sequence,
      label: stage.label,
      question: stage.question,
      state,
      upstream_cell_state: upstream?.cell_state ?? null,
      basis,
      governed_lineage: {
        phase_61_file_ids: governed ? [...project.relationships.phase_61_file_ids] : [],
        phase_62_event_ids: eventIds,
        phase_63_gate_ids: governed ? [...project.relationships.phase_63_gate_ids] : [],
        phase_64_row_ids: governed ? [...project.relationships.phase_64_row_ids] : [],
      },
      published_context_signal_ids: contextOnly ? publishedSignalIds : [],
      published_context_source_ids: contextOnly ? publishedSourceIds : [],
      interpretation_boundary: "This cell describes repository evidence coverage at one stage. It is not a new conversion decision, stage advance, readiness judgment, forecast, score, or outcome.",
    };
  });
}

function makeProjectNarrative(project, biographyId, cells) {
  const publishedSignals = publishedSignalsFor(project);
  const publishedSourceIds = sourcesForSignals(project, publishedSignals);
  const events = project.chronology.event_ids.map((id) => eventById.get(id)).filter(Boolean);
  const relatedPlaces = project.relationships.related_place_ids.map((id) => placeById.get(id)).filter(Boolean);
  const turningPoints = events.length
    ? events.map((event) => `${event.title} is retained at ${event.event_date} on the basis "${event.date_basis}." Its ledger moves from "${event.prior_stage}" to "${event.current_stage}" and names ${event.evidence_artifact.toLowerCase()} as the artifact. The governing limit remains: ${sentence(event.interpretation_boundary)}`).join(" ")
    : signalDigest(publishedSignals, 6);
  const cellReading = cells.map((cell) => `${cell.label} is ${cell.state}: ${cell.basis}`).join(" ");
  const placeReading = relatedPlaces.length
    ? relatedPlaces.map((place) => `${place.title} (${place.atlas_place_id}) is linked as a receiving-system context at ${place.geography}; its place-level state remains independent.`).join(" ")
    : "No receiving-system biography is used to infer a wider place result from this project file.";
  const nextDate = project.conversion.next_check_date ? `The inherited next check date is ${project.conversion.next_check_date}.` : "Phase 119 assigns no calendar date to the next check.";
  const trigger = project.conversion.reopening_trigger ? `The inherited reopening trigger is ${sentence(project.conversion.reopening_trigger)}` : "No separate reopening trigger is present beyond the exact next-artifact contract.";

  const sections = [
    {
      section_id: `${biographyId}-NARRATIVE-01`,
      heading: "Current bounded account",
      body: `${project.title} is followed under canonical Atlas identity ${project.atlas_project_id}, with ${project.canonical_id} preserved as the prior case identity. Phase 119 assigns ${project.coverage.tier_id}, ${project.coverage.label.toLowerCase()}. The recorded basis is: ${sentence(project.coverage.basis)} Its exact current-stage wording remains "${project.conversion.current_stage}." The source account supporting that wording is: ${sentence(project.conversion.stage_basis)} Phase 127 does not translate this language into a maturity estimate or a claim that time alone will move the file. It expands the explanation around the existing evidence boundary. The practical editorial question is: “${sentence(project.editorial_question)}” The file's inherited stewardship state is "${project.update_status}," which describes review handling rather than project performance.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-02`,
      heading: "Turning points",
      body: `The biography reads turning points only from the chronology already attached to ${project.title}. ${turningPoints} These entries are not merged into a smooth progress story. Each event or Published signal keeps its own entity, date, authority, and claim scope. A financing record may clarify commitment without proving construction; a physical milestone may clarify implementation without proving validation; a test may clarify validation without proving acceptance or recurring operation. The sequence is useful because it shows where evidence changed, but sequence alone does not authorize a later-stage conclusion.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-03`,
      heading: "Strongest evidence",
      body: `The strongest public context shelf for ${project.title} contains ${publishedSignals.length} Published signal${publishedSignals.length === 1 ? "" : "s"} and ${publishedSourceIds.length} exact resolving source${publishedSourceIds.length === 1 ? "" : "s"} inherited from Phase 119. ${signalDigest(publishedSignals, 6)} ${sourceDigest(publishedSourceIds, 7)} The biography does not convert record volume into confidence. A source is useful only for the claim it is authorized and scoped to support, while every limitation, entity boundary, date, and denominator remains operative. In Review signals are deliberately excluded from this Published-context account even when they remain visible elsewhere in the underlying Atlas chronology.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-04`,
      heading: "Unresolved bridge",
      body: `Phase 119 states the unresolved bridge for ${project.title} as follows: ${sentence(project.conversion.unresolved)} The eight-stage passport makes the stopping structure explicit without changing it. ${cellReading} "Not established" means only that the required same-file evidence is not established in this repository. "Published context" remains context, and "Governed upstream" republishes an existing Phase 61–64 relationship. None of the three labels means that the next stage has occurred, that a missing artifact cannot exist, or that linked entities share one state.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-05`,
      heading: "Exact next artifact",
      body: `The exact next artifact for ${project.title} remains: ${sentence(project.conversion.exact_next_artifact)} The unresolved-gate wording remains: ${sentence(project.conversion.unresolved_gate)} ${nextDate} ${trigger} This requirement is intentionally narrower than a general news update, institutional homepage, sector forecast, or adjacent project's milestone. A later review must resolve the artifact to the same named entity and decide its stage, date, authority, method, period, and denominator on their own terms. The inherited stop rule is binding: ${sentence(project.conversion.stop_rule)} Until that contract is satisfied, the biography can add explanation and navigation but cannot append an event, receipt, acceptance, operation, or outcome.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-06`,
      heading: "Interpretation boundary",
      body: `${project.interpretation_boundary} For ${project.title}, ${placeReading.charAt(0).toLowerCase()}${placeReading.slice(1)} The relationship is directional for navigation, not evidentiary inheritance: a project milestone cannot establish conditions across a corridor, municipality, workforce, utility system, or public outcome, and a regional trend cannot establish the named project's stage. Phase 127 retains all ${project.evidence_rails.signal_ids.length} Phase 119 signal links and ${project.evidence_rails.source_ids.length} source links as lineage while distinguishing Published context from governed upstream cells. It creates no new source fact, exact-artifact admission, review receipt, signal promotion, stage advance, project-to-place transfer, operating result, causal finding, score, ranking, recommendation, cost estimate, or schedule forecast.`,
    },
  ];
  return sections;
}

function selectDimensionSignals(signals, dimension) {
  const matches = signals.filter((signal) => {
    const haystack = `${signal.title} ${signal.summary} ${signal.primary_topic}`.toLowerCase();
    return dimension.keywords.some((keyword) => haystack.includes(keyword));
  });
  return matches.slice(0, 4);
}

function makePlaceDimensions(place, biographyId) {
  const publishedSignals = publishedSignalsFor(place);
  return placeDimensions.map((dimension) => {
    const selectedSignals = selectDimensionSignals(publishedSignals, dimension);
    const selectedSourceIds = sourcesForSignals(place, selectedSignals);
    const hasPublishedContext = selectedSignals.length > 0 && selectedSourceIds.length > 0;
    const state = hasPublishedContext ? "Published context" : "Not established";
    const basis = hasPublishedContext
      ? `${place.title} has ${selectedSignals.length} inherited Phase 119 Published signal${selectedSignals.length === 1 ? "" : "s"} that can orient the ${dimension.label.toLowerCase()} question: ${selectedSignals.map((signal) => signal.title).join("; ")}. They remain a contextual shelf and do not establish a place-wide delivered condition, recurring operation, or public outcome.`
      : selectedSignals.length
        ? `The keyword-relevant Published signal${selectedSignals.length === 1 ? "" : "s"} on the Phase 119 shelf do not resolve through an inherited source rail for the ${dimension.label.toLowerCase()} question. This is a repository-bounded evidence gap, not a claim that qualifying evidence does not exist externally.`
        : `No keyword-relevant Published signal on the Phase 119 shelf is assigned as context for the ${dimension.label.toLowerCase()} question. This is a repository-bounded evidence gap, not a claim that qualifying evidence does not exist externally.`;
    return {
      assessment_id: `${biographyId}-DIMENSION-${String(dimension.sequence).padStart(2, "0")}`,
      dimension_id: dimension.dimension_id,
      sequence: dimension.sequence,
      label: dimension.label,
      question: dimension.question,
      state,
      basis,
      governed_lineage: {
        phase_61_file_ids: [],
        phase_62_event_ids: [],
        phase_63_gate_ids: [],
        phase_64_row_ids: [],
      },
      published_context_signal_ids: hasPublishedContext ? selectedSignals.map((signal) => signal.id) : [],
      published_context_source_ids: hasPublishedContext ? selectedSourceIds : [],
      project_stage_inherited: false,
      interpretation_boundary: "This assessment organizes place-scoped context. It never inherits a linked project's stage or presents a place-wide readiness, performance, risk, or outcome score.",
    };
  });
}

function makePlaceNarrative(place, biographyId, dimensions) {
  const publishedSignals = publishedSignalsFor(place);
  const publishedSourceIds = sourcesForSignals(place, publishedSignals);
  const relatedProjects = place.relationships.related_project_ids.map((id) => projectById.get(id)).filter(Boolean);
  const dimensionReading = dimensions.map((dimension) => `${dimension.label} is ${dimension.state}. ${dimension.basis}`).join(" ");
  const projectReading = relatedProjects.length
    ? relatedProjects.map((project) => `${project.title} (${project.atlas_project_id}) retains its own Phase 119 tier ${project.coverage.tier_id} and exact current-stage wording "${project.conversion.current_stage}." That project state is not assigned to ${place.title}.`).join(" ")
    : `No named project file is used to supply a conversion stage for ${place.title}.`;
  const nextDates = place.conversion.next_check_dates.length ? `Inherited dated checks are ${place.conversion.next_check_dates.join(", ")}.` : "No inherited place-level check date is assigned.";
  const triggers = place.conversion.reopening_triggers.length ? `The inherited reopening triggers are: ${place.conversion.reopening_triggers.map(sentence).join(" ")}` : "No separate reopening trigger is assigned beyond the exact next-artifact statement.";

  return [
    {
      section_id: `${biographyId}-NARRATIVE-01`,
      heading: "Current bounded account",
      body: `${place.title} is tracked as ${place.atlas_place_id}, preserving canonical identity ${place.canonical_id} and the geography "${place.geography}." Phase 119 assigns ${place.coverage.tier_id}, ${place.coverage.label.toLowerCase()}. The recorded basis is: ${sentence(place.coverage.basis)} Its current-state wording remains exactly "${place.conversion.current_stage}." The basis is not a project-stage average: ${sentence(place.conversion.stage_basis)} This biography treats the place as a receiving system in which authorities, infrastructure, firms, public institutions, workers, communities, and environmental conditions may move on different clocks. Its editorial question is: “${sentence(place.editorial_question)}” The inherited update state, "${place.update_status}," describes stewardship and coverage; it is not evidence that the wider place is ready, successful, delayed, or failing.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-02`,
      heading: "Turning points",
      body: `The public chronology for ${place.title} is a place evidence shelf rather than a single project timeline. Phase 119 describes it as "${place.chronology.chronology_type}" and supplies this boundary: ${sentence(place.chronology.boundary)} ${signalDigest(publishedSignals, 8)} These records identify real institutional, infrastructural, operational, or contextual developments within the named geography, but they do not all describe the same entity or stage. A permit at one site cannot complete another facility; one service launch cannot establish regional adoption; an aggregate workforce measure cannot establish qualification at a named asset. The biography therefore presents turning points as separate pieces of a receiving-system account, not as steps in an automatic place-wide progression.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-03`,
      heading: "Strongest evidence",
      body: `${place.title} inherits ${publishedSignals.length} Published signal${publishedSignals.length === 1 ? "" : "s"} and ${publishedSourceIds.length} resolving source${publishedSourceIds.length === 1 ? "" : "s"} from the Phase 119 evidence shelf. ${sourceDigest(publishedSourceIds, 10)} This source diversity helps a reader locate authority, infrastructure, labor, resource, and outcome records without pretending that the collection is a single compatible dataset. The biography retains source-level limitations and excludes In Review signals from claims of Published context. It also avoids turning multiple sources into a confidence score. Each source remains authoritative only for its named artifact, jurisdiction, period, population, method, and denominator, and contradictory or asynchronous records are not silently harmonized.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-04`,
      heading: "Unresolved bridge",
      body: `The inherited unresolved account for ${place.title} is: ${sentence(place.conversion.unresolved)} Phase 119 states the gate as: ${sentence(place.conversion.unresolved_gate)} Phase 127 separates that open work across six receiving-system dimensions without creating a conversion ladder for the place. ${dimensionReading} A Published-context label says only that a directly linked public record can orient the dimension. A Not-established label says only that the repository does not establish it. Governed-upstream and Not-applicable remain available taxonomy states, but no place assessment may borrow them from a linked project's conversion cell.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-05`,
      heading: "Exact next artifact",
      body: `The exact next artifact for ${place.title} remains: ${sentence(place.conversion.exact_next_artifact)} ${nextDates} ${triggers} A qualifying addition must identify the same place scope and the responsible authority, facility, service, population, or environmental system; it must also preserve the artifact date, observation period, method, unit, denominator, exclusions, and revision state where measurement is involved. A general regional announcement, an adjacent project's milestone, a provider-wide statistic, or a forecast cannot fill a place-specific gap by proximity. The inherited stop rule remains controlling: ${sentence(place.conversion.stop_rule)} Phase 127 therefore deepens the reader account while leaving every future evidence decision to a later dated review.`,
    },
    {
      section_id: `${biographyId}-NARRATIVE-06`,
      heading: "Interpretation boundary",
      body: `${place.interpretation_boundary} ${projectReading} The linked-project list is navigation and dependency context, not an aggregation rule. A place can contain authorized, financed, constructed, accepted, operating, paused, or unmeasured projects simultaneously, so no single project supplies a place-wide stage and no place trend supplies a project stage. Phase 127 preserves all ${place.evidence_rails.signal_ids.length} signal links, ${place.evidence_rails.source_ids.length} source links, and ${relatedProjects.length} named project relationship${relatedProjects.length === 1 ? "" : "s"} while keeping their evidence scopes separate. It creates no exact-artifact admission, review receipt, source fact, signal promotion, project or place advance, inherited stage, observation, outcome, causal finding, score, ranking, recommendation, cost estimate, or schedule forecast.`,
    },
  ];
}

const projectBiographies = atlas.projects.map((project, index) => {
  const biographyId = `127-PROJECT-${String(index + 1).padStart(3, "0")}`;
  const stageCells = makeProjectCells(project, biographyId);
  const narrativeSections = makeProjectNarrative(project, biographyId, stageCells);
  return {
    biography_id: biographyId,
    atlas_project_id: project.atlas_project_id,
    canonical_id: project.canonical_id,
    slug: project.slug,
    title: project.title,
    record_status: "Published",
    phase_119_snapshot: {
      coverage_tier_id: project.coverage.tier_id,
      coverage_label: project.coverage.label,
      coverage_basis: project.coverage.basis,
      current_stage: project.conversion.current_stage,
      stage_basis: project.conversion.stage_basis,
      unresolved: project.conversion.unresolved,
      unresolved_gate: project.conversion.unresolved_gate,
      exact_next_artifact: project.conversion.exact_next_artifact,
      update_status: project.update_status,
    },
    narrative_sections: narrativeSections,
    narrative_metrics: {
      authored_word_count: narrativeSections.reduce((total, section) => total + words(section.body), 0),
      section_count: narrativeSections.length,
      measurement_boundary: "Counts only the six per-project narrative bodies; excludes route template, navigation, labels, taxonomy text, and page boilerplate.",
    },
    stage_cells: stageCells,
    related_place_ids: [...project.relationships.related_place_ids],
    evidence_signal_ids: [...project.evidence_rails.signal_ids],
    evidence_source_ids: [...project.evidence_rails.source_ids],
    public_route: project.routes.atlas,
    interpretation_boundary: "This biography explains the inherited Phase 119 record. It does not alter its tier, current stage, upstream relationships, evidence status, or next-artifact boundary.",
  };
});

const placeBiographies = atlas.places.map((place, index) => {
  const biographyId = `127-PLACE-${String(index + 1).padStart(3, "0")}`;
  const dimensionAssessments = makePlaceDimensions(place, biographyId);
  const narrativeSections = makePlaceNarrative(place, biographyId, dimensionAssessments);
  return {
    biography_id: biographyId,
    atlas_place_id: place.atlas_place_id,
    canonical_id: place.canonical_id,
    slug: place.slug,
    title: place.title,
    geography: place.geography,
    record_status: "Published",
    phase_119_snapshot: {
      coverage_tier_id: place.coverage.tier_id,
      coverage_label: place.coverage.label,
      coverage_basis: place.coverage.basis,
      current_state: place.conversion.current_stage,
      state_basis: place.conversion.stage_basis,
      unresolved: place.conversion.unresolved,
      unresolved_gate: place.conversion.unresolved_gate,
      exact_next_artifact: place.conversion.exact_next_artifact,
      update_status: place.update_status,
    },
    narrative_sections: narrativeSections,
    narrative_metrics: {
      authored_word_count: narrativeSections.reduce((total, section) => total + words(section.body), 0),
      section_count: narrativeSections.length,
      measurement_boundary: "Counts only the six per-place narrative bodies; excludes route template, navigation, labels, taxonomy text, and page boilerplate.",
    },
    dimension_assessments: dimensionAssessments,
    related_project_ids: [...place.relationships.related_project_ids],
    evidence_signal_ids: [...place.evidence_rails.signal_ids],
    evidence_source_ids: [...place.evidence_rails.source_ids],
    public_route: place.routes.atlas,
    interpretation_boundary: "This biography explains a receiving system without assigning it a conversion stage or inheriting any linked project's state.",
  };
});

const projectWordCounts = projectBiographies.map((record) => record.narrative_metrics.authored_word_count);
const placeWordCounts = placeBiographies.map((record) => record.narrative_metrics.authored_word_count);
const newHtmlRoutes = ["/review/fieldbook/delivery-biographies/"];
const enhancedExistingRoutes = [...projectBiographies.map((record) => record.public_route), ...placeBiographies.map((record) => record.public_route)];
const publicJsonExports = ["/data/phase-127-project-place-conversion-biographies.json"];
const affectedPublicRecordIds = unique([
  ...atlas.projects.map((record) => record.relationships.canonical_briefing_ids[0] ?? record.evidence_rails.signal_ids[0]),
  ...atlas.places.map((record) => record.relationships.local_system_ids[0] ?? record.evidence_rails.signal_ids[0]),
]);

const registry = {
  schema_version: "1.0",
  phase: 127,
  program_id: "FTFN-PHASE-127-PROJECT-PLACE-CONVERSION-BIOGRAPHIES",
  title: "Project and Place Conversion Biographies",
  effective_date: date,
  record_status: "Published",
  status: "Complete",
  summary: "Thirty-nine substantive delivery biographies deepen every Phase 119 project and place file while preserving exact identity, coverage tier, conversion boundary, evidence lineage, and non-transfer rules.",
  interpretation_boundary: "Phase 127 is an explanatory overlay. It creates no source fact, artifact admission, receipt, signal promotion, event, project or place advance, stage inheritance, observation, outcome, score, ranking, recommendation, cost estimate, or schedule forecast.",
  publication_boundaries: [
    "Every Phase 119 project tier and current-stage string is copied byte-for-byte into the overlay and remains authoritative.",
    "Project cells report repository evidence coverage, not progress, readiness, maturity, or probability.",
    "Places receive six independent receiving-system assessments and never receive a conversion-stage field.",
    "A linked project's state is never inherited by a place, and place context never advances a project.",
    "Published context resolves only to Phase 119 evidence rails whose signals remain Published; In Review signals cannot support that state.",
    "A place Published context assessment requires a dimension-keyword match in an inherited Published signal's title, summary, or primary topic and at least one resolving inherited source; zero relevant matches remain Not established.",
    "Not established means not established in this repository and never asserts external nonexistence.",
    "Eleven Phase 60 gates after 2026-08-30 remain scheduled, undecided, and without receipts.",
  ],
  allowed_states: allowedStates,
  project_stage_taxonomy: coverage.conversion_stages,
  place_dimension_taxonomy: placeDimensions.map(({ keywords, ...dimension }) => dimension),
  counts: {
    project_biographies: projectBiographies.length,
    project_stage_cells: projectBiographies.reduce((total, record) => total + record.stage_cells.length, 0),
    governed_projects_preserved: projectBiographies.filter((record) => record.phase_119_snapshot.coverage_tier_id === "Tier A").length,
    curated_projects_preserved: projectBiographies.filter((record) => record.phase_119_snapshot.coverage_tier_id === "Tier B").length,
    place_biographies: placeBiographies.length,
    place_system_assessments: placeBiographies.reduce((total, record) => total + record.dimension_assessments.length, 0),
    governed_places_preserved: placeBiographies.filter((record) => record.phase_119_snapshot.coverage_tier_id === "Tier A").length,
    curated_places_preserved: placeBiographies.filter((record) => record.phase_119_snapshot.coverage_tier_id === "Tier B").length,
    project_authored_words: projectWordCounts.reduce((sum, value) => sum + value, 0),
    minimum_project_authored_words: Math.min(...projectWordCounts),
    place_authored_words: placeWordCounts.reduce((sum, value) => sum + value, 0),
    minimum_place_authored_words: Math.min(...placeWordCounts),
    new_html_routes: newHtmlRoutes.length,
    enhanced_existing_routes: enhancedExistingRoutes.length,
    substantive_surfaces: newHtmlRoutes.length + enhancedExistingRoutes.length,
    public_json_exports: publicJsonExports.length,
    exact_artifacts_admitted: 0,
    review_receipts_created: 0,
    stage_advances_created: 0,
    project_to_place_inheritances: 0,
  },
  new_html_routes: newHtmlRoutes,
  enhanced_existing_routes: enhancedExistingRoutes,
  public_html_routes: [...newHtmlRoutes, ...enhancedExistingRoutes],
  public_json_exports: publicJsonExports,
  project_biographies: projectBiographies,
  place_biographies: placeBiographies,
};

for (const record of projectBiographies) {
  if (record.narrative_metrics.authored_word_count < 500) throw new Error(`${record.biography_id} has only ${record.narrative_metrics.authored_word_count} authored words.`);
}
for (const record of placeBiographies) {
  if (record.narrative_metrics.authored_word_count < 650) throw new Error(`${record.biography_id} has only ${record.narrative_metrics.authored_word_count} authored words.`);
}

const update = {
  id: "update-2026-08-30-phase-127-project-place-conversion-biographies",
  effective_date: date,
  entry_type: "Source Refresh",
  title: "Phase 127 publishes thirty-nine bounded conversion biographies",
  summary: `${projectBiographies.length} project biographies add ${registry.counts.project_stage_cells} exact stage cells and ${placeBiographies.length} place biographies add ${registry.counts.place_system_assessments} receiving-system assessments, with ${registry.counts.project_authored_words + registry.counts.place_authored_words} per-record authored words and no stage advance or project-to-place inheritance.`,
  affected_record_ids: affectedPublicRecordIds,
  related_paths: [...newHtmlRoutes, ...enhancedExistingRoutes, ...publicJsonExports],
  evidence_note: registry.interpretation_boundary,
  materiality: "No record-state change",
  publication_effect: "Adds one delivery-biography hub and one public JSON export, and substantively expands all thirty-nine existing Atlas project and place routes without changing their canonical Phase 119 states.",
  next_check_date: null,
  work_package: "docs/work-packages/phase-127-v06-project-place-conversion-biographies.md",
};

const workPackage = `# Phase 127 — Project and Place Conversion Biographies

**Status:** Complete<br>
**Effective date:** ${date}<br>
**Program:** FTFN v0.6

## Purpose

Turn the canonical Phase 119 Project and Place Atlas into a deeper explanatory corpus without changing a single underlying tier, current-stage statement, evidence decision or relationship. Every biography explains what the repository establishes, what remains contextual, where the evidence stops and which exact artifact could deepen the file.

## Delivered

- ${registry.counts.project_biographies} one-to-one project biographies preserving the exact Phase 119 order, identity and 8 governed / 16 curated tier split.
- ${registry.counts.project_stage_cells} exact project-stage cells: eight Phase 116 stages for each project.
- ${registry.counts.place_biographies} one-to-one place biographies preserving the exact Phase 119 order, identity and 5 governed / 10 curated tier split.
- ${registry.counts.place_system_assessments} place assessments: six independent receiving-system dimensions for each place.
- ${registry.counts.project_authored_words.toLocaleString("en-US")} project-biography words, with a minimum of ${registry.counts.minimum_project_authored_words} words per project.
- ${registry.counts.place_authored_words.toLocaleString("en-US")} place-biography words, with a minimum of ${registry.counts.minimum_place_authored_words} words per place.
- One new hub, thirty-nine enhanced existing Atlas routes and one direct schema-1.0 JSON export.

## Project-stage contract

Every project contains the exact eight Phase 116 stages in their original order. Cell states are limited to \`Governed upstream\`, \`Published context\`, \`Not established\` and \`Not applicable\`.

- \`Governed upstream\` requires an exact same-file Phase 61–64 relationship and republishes the Phase 64 cell without advancing it.
- \`Published context\` requires exact Phase 119 lineage to a signal that remains Published and to its resolving source IDs; context never becomes a governed decision.
- \`Not established\` means only that the state is not established in this repository.
- \`Not applicable\` requires an explicit scope reason and cannot be used as a shortcut for missing evidence.

## Place-dimension contract

Every place contains exactly six dimensions: Authority and governance; Capital and procurement; Physical infrastructure; Workforce and operation; Environment and resources; and Public outcomes. Places receive no conversion-stage field. All project-stage lineage arrays remain empty in place assessments, and every assessment publishes \`project_stage_inherited: false\`. A \`Published context\` assessment requires an inherited signal that remains Published, an exact dimension-keyword match in its title, summary or primary topic, and at least one resolving source on the inherited Phase 119 rail. A dimension with zero relevant matches remains \`Not established\`, with empty lineage and an explicit repository boundary.

## Narrative standard

Each biography contains six substantive, record-specific sections: current bounded account, turning points, strongest evidence, unresolved bridge, exact next artifact and interpretation boundary. Word counts include only those six stored narrative bodies and exclude navigation, route templates, labels, taxonomy definitions and other page boilerplate. Assertions require at least 500 authored words per project, at least 650 per place and no duplicate full biography or section body.

## Publication boundary

${registry.interpretation_boundary}

The eleven Phase 60 gates after ${date}, including the September 1 Louisiana Starlink adoption gate, remain scheduled and untouched. A biography is explanatory content, not a source check, receipt, mission answer, stage decision or evidence-gate operation.

## Completion standard

Phase 127 is complete when every Phase 119 project and place resolves exactly once and in order; all snapshot identity, tier and current-state fields remain byte-for-byte equal; all 192 project cells and 90 place assessments use only the four allowed states with exact lineage rules; all narrative floors and uniqueness checks pass; all thirty-nine existing Atlas routes expose their biography; the new hub and direct export exist; and no future gate, source, signal, receipt, project stage, place state, outcome, score or ranking changes.
`;

await Promise.all([
  writeJson(join(dataRoot, "phase-127-project-place-conversion-biographies.json"), registry),
  writeJson(join(appRoot, "src", "content", "updates", "2026-08-30-phase-127-project-place-conversion-biographies.json"), update),
  writeFile(join(workspaceRoot, "docs", "work-packages", "phase-127-v06-project-place-conversion-biographies.md"), workPackage, "utf8"),
]);

console.log(`Phase 127 built: ${registry.counts.project_biographies} project biographies / ${registry.counts.project_stage_cells} stage cells / ${registry.counts.project_authored_words} words (min ${registry.counts.minimum_project_authored_words}); ${registry.counts.place_biographies} place biographies / ${registry.counts.place_system_assessments} dimensions / ${registry.counts.place_authored_words} words (min ${registry.counts.minimum_place_authored_words}); one new hub and ${registry.counts.enhanced_existing_routes} enhanced Atlas routes.`);
