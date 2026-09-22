import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptRoot, "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const topicsRoot = join(appRoot, "src", "content", "topics");
const workPackagesRoot = join(workspaceRoot, "docs", "work-packages");

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};
const writeText = async (path, value) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value.endsWith("\n") ? value : `${value}\n`, "utf8");
};
const sha = (value) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const unique = (values) => [...new Set(values.filter(Boolean))];

const phaseFiles = {
  197: "phase-197-underrepresented-region-topic-gap-closure.json",
  198: "phase-198-failure-delay-reversal-correction-casebooks.json",
  199: "phase-199-distribution-affordability-service-quality-observatory.json",
  200: "phase-200-cross-system-constraint-monographs.json",
  201: "phase-201-change-intelligence-correction-service.json",
  202: "phase-202-accessible-multilingual-low-bandwidth-editions.json",
  203: "phase-203-state-of-future-systems-2026.json",
  204: "phase-204-v1-public-reference-edition-promotion-gate.json",
};

const [p136, p170, p178, p161] = await Promise.all([
  readJson(join(dataRoot, "phase-136-named-project-chronicles.json")),
  readJson(join(dataRoot, "phase-170-fifteen-place-systems-atlas.json")),
  readJson(join(dataRoot, "phase-178-systems-atlas-and-compendium-depth-expansion.json")),
  readJson(join(dataRoot, "phase-161-stack-watch.json")),
]);
const topicNames = (await readdir(topicsRoot)).filter((name) => name.endsWith(".json")).sort();
const topics = (await Promise.all(topicNames.map((name) => readJson(join(topicsRoot, name))))).sort((a, b) => a.name.localeCompare(b.name));

if (p136.project_chronicles?.length !== 24 || p170.place_system_dossiers?.length !== 15 || p178.place_system_dossiers?.length !== 10 || p161.stack_watch_packets?.length !== 24 || topics.length !== 17) {
  throw new Error("Phase 197–204 requires the exact 24-project, 25-place-dossier, 24-packet, and 17-topic input shelves.");
}

const boundaries = [
  "This is an append-only definitive-edition layer over the existing governed corpus; it does not rewrite an upstream evidence decision, project stage, place state, receipt, or validation baseline.",
  "Research targets, casebook classifications, outcome panels, translations, expert review, repository publication, hosting, DNS, public launch, and v1 promotion remain distinct decisions.",
  "A source-bound context statement is not a compatible longitudinal observation. Outcome values remain null unless entity, period, measure, method, denominator, revision lineage, and receiving authority all pass a dated admission decision.",
  "No missing artifact is treated as nonexistent; no delay, failure, reversal, cause, correction, distributional effect, affordability result, service-quality result, score, rank, or causal finding is invented.",
];

const registry = ({ phase, title, summary, key, records, counts, extras = {} }) => {
  const section = phaseFiles[phase].replace(/^phase-\d+-|\.json$/g, "");
  const hub = `/review/v1reference/${section}/`;
  const publicExport = `/data/${phaseFiles[phase]}`;
  return {
    schema_version: "1.0",
    phase,
    program_id: `FTFN-PHASE-${phase}`,
    dataset: phaseFiles[phase].replace(/\.json$/, "").replaceAll("-", "_"),
    title,
    effective_date: "2026-09-01",
    record_status: "Prepared content — public release not authorized",
    build_status: "Complete locally",
    summary,
    record_scope: "Phase 197–204 definitive public-reference edition candidate layer.",
    publication_boundaries: boundaries,
    routes: { hub, public_export: publicExport },
    counts,
    [key]: records,
    ...extras,
    public_html_routes: [hub, ...records.map((record) => record.route)],
    public_json_exports: [publicExport],
  };
};

const focusTopicIds = [
  "topic-agriculture-and-bioeconomy",
  "topic-ai-for-science",
  "topic-discovery-technologies",
  "topic-quantum",
];
const focusTopics = focusTopicIds.map((id) => topics.find((topic) => topic.id === id));
if (focusTopics.some((topic) => !topic)) throw new Error("An underrepresented focus topic is missing.");
const regions = [
  { id: "sub-saharan-africa", label: "Sub-Saharan Africa", authority_need: "A national, subnational, regional, or public research authority with jurisdiction over the named system." },
  { id: "latin-america-caribbean", label: "Latin America and the Caribbean", authority_need: "A national, subnational, regional, or public research authority with jurisdiction over the named system." },
  { id: "south-asia", label: "South Asia", authority_need: "A national, subnational, regional, or public research authority with jurisdiction over the named system." },
  { id: "southeast-asia", label: "Southeast Asia", authority_need: "A national, subnational, regional, or public research authority with jurisdiction over the named system." },
  { id: "middle-east-north-africa", label: "Middle East and North Africa", authority_need: "A national, subnational, regional, or public research authority with jurisdiction over the named system." },
  { id: "pacific-small-island-states", label: "Pacific and small-island states", authority_need: "A national, territorial, regional, or public research authority with jurisdiction over the named system." },
];
const entityKinds = ["Named project", "Receiving place system"];
let gapIndex = 0;
const gapClosurePackets = focusTopics.flatMap((topic) => regions.flatMap((region) => entityKinds.map((entityKind) => {
  gapIndex += 1;
  const kindSlug = entityKind === "Named project" ? "project" : "place";
  return {
    gap_closure_packet_id: `197-GAP-${String(gapIndex).padStart(3, "0")}`,
    slug: `${topic.slug}-${region.id}-${kindSlug}`,
    title: `${topic.name} — ${region.label} ${kindSlug} acquisition contract`,
    state: "Research target — identity and evidence not yet acquired",
    topic_id: topic.id,
    topic_name: topic.name,
    region_id: region.id,
    region: region.label,
    target_entity_kind: entityKind,
    named_entity: null,
    jurisdiction: null,
    canonical_identity_id: null,
    admission_outcome: null,
    admission_date: null,
    orientation_source_ids: topic.featured_sources.slice(0, 3),
    orientation_source_role: "Existing topic-orientation sources only; they are not evidence of a project or place in the target region.",
    regional_authority_requirement: region.authority_need,
    required_artifact_chain: [
      "An exact official authority or program record naming the entity and jurisdiction",
      "An implementing-party or receiving-system record fixing the intervention and current state",
      "A dated artifact establishing authorization, delivery, acceptance, recurring operation, or a bounded outcome without skipping stages",
    ],
    admission_tests: ["identity", "authority", "artifact date", "stage scope", "receiving party", "method and denominator when quantitative", "revision lineage"],
    exact_next_artifact: `A ${region.label} official record that names one ${topic.name} ${kindSlug}, fixes its jurisdiction and responsible authority, and exposes a stage-specific artifact that can be reviewed without transferring the orientation sources geographically.`,
    stop_rule: "Do not create a named entity, stage, regional performance claim, comparison, or outcome from a topic source, search result, announcement, adjacent country, or proposed target.",
    route: `/review/v1reference/underrepresented-region-topic-gap-closure/${topic.slug}-${region.id}-${kindSlug}/`,
  };
})));

const p197 = registry({
  phase: 197,
  title: "Underrepresented Region and Topic Gap Closure",
  summary: "Turn four topic gaps across six underrepresented world regions into forty-eight exact project/place acquisition contracts without manufacturing an entity or claiming the 100-project/70-place target has been reached.",
  key: "gap_closure_packets",
  records: gapClosurePackets,
  counts: {
    gap_closure_packets: 48,
    underrepresented_topics: 4,
    underrepresented_regions: 6,
    project_target_contracts: 24,
    place_target_contracts: 24,
    orientation_source_bindings: gapClosurePackets.flatMap((record) => record.orientation_source_ids).length,
    named_entities_created: 0,
    admissions_created: 0,
  },
  extras: {
    portfolio_target_contract: {
      project_reference_target: 100,
      place_reference_target: 70,
      verified_phase_119_project_baseline: 24,
      verified_phase_170_place_baseline: 15,
      additional_phase_178_place_dossiers: 10,
      project_target_achieved: false,
      place_target_achieved: false,
      boundary: "The numerical targets are editorial coverage goals, not current inventory claims. Later-wave records may alter the remaining gap only after exact identity reconciliation.",
    },
  },
});

const candidateClassifications = [
  { label: "Delay", test: "A dated authoritative baseline and a later authoritative schedule state refer to the same milestone and entity." },
  { label: "Failure", test: "The responsible or receiving authority records a failed test, rejected delivery, unmet requirement, or terminated operating result." },
  { label: "Reversal", test: "A competent authority formally rescinds, cancels, withdraws, or replaces an earlier decision for the same entity." },
  { label: "Correction", test: "An issuer or accountable operator records a corrective action, revised result, restored condition, or superseding method." },
];
const casebookPackets = p136.project_chronicles.map((project, index) => ({
  casebook_packet_id: `198-CASE-${String(index + 1).padStart(3, "0")}`,
  upstream_chronicle_id: project.chronicle_id,
  atlas_project_id: project.atlas_project_id,
  slug: project.slug,
  title: `${project.title}: failure, delay, reversal, and correction research packet`,
  state: "Research packet — event classification not adjudicated",
  named_entity: project.title,
  inherited_stage: project.inherited_stage,
  inherited_stage_basis: project.stage_basis,
  inherited_unresolved_bridge: project.unresolved_bridge,
  source_ids: project.source_ids,
  signal_ids: project.signal_ids,
  upstream_record_digest: sha({ id: project.chronicle_id, title: project.title, stage: project.inherited_stage, sources: project.source_ids, signals: project.signal_ids }),
  candidate_classifications: candidateClassifications,
  classification_decision: null,
  classification_date: null,
  confirmed_disruption: null,
  causal_attribution: null,
  correction_status: null,
  realized_outcome: null,
  research_sections: [
    { heading: "Baseline", question: "Which dated authoritative commitment, requirement, schedule, or operating baseline applies to the exact named entity?" },
    { heading: "Observed divergence", question: "Which later artifact records a missed milestone, failed test, withdrawal, revision, incident, or disputed result without relying on inference?" },
    { heading: "Attribution", question: "Who attributes the driver, which alternatives remain open, and what evidence would separate correlation, sequence, and cause?" },
    { heading: "Correction", question: "Which accountable authority records the remedy, acceptance test, restart, replacement, or superseding decision?" },
    { heading: "Outcome", question: "Which compatible later observation shows whether the corrected condition persisted for the same entity and denominator?" },
  ],
  exact_next_artifact: project.exact_next_artifact,
  stop_rule: `Preserve the upstream rule: ${project.stop_rule} Additionally, do not label this project delayed, failed, reversed, corrected, recovered, or successful until the exact classification test is adjudicated.`,
  route: `/review/v1reference/failure-delay-reversal-correction-casebooks/${project.slug}/`,
}));

const p198 = registry({
  phase: 198,
  title: "Failure, Delay, Reversal, and Correction Casebooks",
  summary: "Open twenty-four named, source-bound research packets that make adverse-event and corrective-action evidence inspectable while leaving every classification, cause, correction result, and realized outcome null.",
  key: "casebook_packets",
  records: casebookPackets,
  counts: {
    casebook_packets: 24,
    named_project_bindings: 24,
    source_bindings: casebookPackets.flatMap((record) => record.source_ids).length,
    classification_decisions: 0,
    confirmed_disruptions: 0,
    causal_attributions: 0,
    correction_outcomes: 0,
  },
  extras: { classification_taxonomy: candidateClassifications },
});

const measureFamilies = [
  { id: "distribution-access", label: "Distribution and access", required: ["eligible population or assets", "served population or assets", "geography", "period", "method"] },
  { id: "affordability-burden", label: "Affordability and burden", required: ["price or expenditure", "income or cost denominator", "population", "period", "method"] },
  { id: "service-quality-reliability", label: "Service quality and reliability", required: ["service unit", "failure or availability measure", "population or asset denominator", "period", "method"] },
];
const outcomePanels = p161.stack_watch_packets.map((packet, index) => {
  const family = measureFamilies[index % measureFamilies.length];
  const supported = packet.claim_blocks.find((claim) => claim.claim_type === "Supported observation") ?? packet.claim_blocks[0];
  return {
    outcome_panel_id: `199-PANEL-${String(index + 1).padStart(3, "0")}`,
    upstream_packet_id: packet.stack_watch_packet_id,
    slug: `${packet.slug}-${family.id}`,
    title: `${packet.title}: ${family.label.toLowerCase()} panel`,
    state: "Panel specification complete — no compatible outcome observation admitted",
    measure_family_id: family.id,
    measure_family: family.label,
    stack_lane: packet.stack_lane,
    source_ids: packet.source_ids,
    topic_ids: packet.topic_ids,
    project_chronicle_ids: packet.project_chronicle_ids,
    place_ledger_ids: packet.place_ledger_ids,
    source_bound_context: {
      claim_block_id: supported.claim_block_id,
      text: supported.text,
      source_semantic_digest: supported.source_semantic_digest,
      role: "Orientation context only — not an observation in this panel",
    },
    required_fields: family.required,
    entity: null,
    observation_period: null,
    numerator: null,
    denominator: null,
    unit: null,
    method: null,
    outcome_value: null,
    attribution: null,
    compatibility_decision: null,
    admitted_observations: [],
    exact_next_artifact: `An official ${family.label.toLowerCase()} return for a named entity that supplies ${family.required.join(", ")} and exposes revision lineage.`,
    stop_rule: "Do not convert availability, capacity, funding, a forecast, an offer, a single milestone, or the source-bound context claim into a population outcome or longitudinal observation.",
    route: `/review/v1reference/distribution-affordability-service-quality-observatory/${packet.slug}-${family.id}/`,
  };
});

const p199 = registry({
  phase: 199,
  title: "Distribution, Affordability, and Service-Quality Observatory",
  summary: "Prepare twenty-four source-bound measurement panels—eight each for distribution, affordability, and service quality—while admitting zero observations and preserving every outcome field as null.",
  key: "outcome_panels",
  records: outcomePanels,
  counts: {
    outcome_panels: 24,
    distribution_panels: 8,
    affordability_panels: 8,
    service_quality_panels: 8,
    source_bound_context_blocks: 24,
    admitted_observations: 0,
    non_null_outcome_values: 0,
    compatibility_decisions: 0,
  },
  extras: { measure_families: measureFamilies },
});

const monographSpecs = [
  ["compute-power-water", "Compute, power, and water", "How should readers separate announced compute capacity from accepted electric and water service and from recurring operation?", ["Compute infrastructure", "Electric systems", "Water systems"]],
  ["mining-processing-manufacturing", "Mining, processing, and manufacturing", "Which records bridge an identified resource, permitted extraction, qualified processing, accepted manufacturing input, and recurring output?", ["Resource extraction", "Processing", "Manufacturing"]],
  ["infrastructure-access-affordability", "Infrastructure, access, and affordability", "When does installed or available infrastructure become service taken at a disclosed price and burden?", ["Physical infrastructure", "Service access", "Affordability"]],
  ["standards-procurement-implementation", "Standards, procurement, and implementation", "Which institutional records connect a published standard to contract language, tested implementation, accepted cutover, and retirement of the prior state?", ["Standards", "Procurement", "Implementation"]],
  ["instrument-data-decision", "Research instruments, data, and decisions", "Which calibration, product, workflow, adoption, and decision records connect instrument availability to a bounded research or public-use result?", ["Instruments", "Data products", "Decision workflows"]],
  ["land-permits-construction-operation", "Land, permits, construction, and operation", "Which independent approvals and receiving-party records distinguish site control from lawful construction, acceptance, and operation?", ["Land", "Permitting", "Construction", "Operation"]],
  ["workforce-housing-service-capacity", "Workforce, housing, and service capacity", "How can a named project be read alongside local labor and service constraints without attributing community outcomes to the project?", ["Workforce", "Housing", "Public services"]],
  ["climate-infrastructure-reliability", "Climate exposure and infrastructure reliability", "Which hazard, design, incident, restoration, and recurring-service records support a bounded resilience account?", ["Climate hazards", "Infrastructure", "Reliability"]],
  ["finance-contracting-acceptance", "Finance, contracting, and acceptance", "Which chain separates announced value, appropriated authority, obligation, award, delivery, acceptance, payment, and realized service?", ["Finance", "Contracting", "Acceptance"]],
  ["safety-incident-correction-restart", "Safety, incident, correction, and restart", "Which records establish the incident scope, responsible authority, remedy, validation, restart, and later performance without implying recovery from sequence alone?", ["Safety", "Corrective action", "Restart"]],
  ["logistics-supply-recurring-output", "Logistics, supply chains, and recurring output", "Which supplier, shipment, inventory, qualification, receiving, and repeated-output records reveal conversion beyond a capacity announcement?", ["Logistics", "Supply chain", "Recurring output"]],
  ["public-authority-private-delivery", "Public authority, private delivery, and public outcomes", "Which records preserve the separate roles of rulemaker, funder, implementer, receiver, evaluator, and affected public?", ["Public authority", "Private delivery", "Public outcomes"]],
];
const monographs = monographSpecs.map(([slug, title, question, systems], index) => {
  const packets = [p161.stack_watch_packets[index * 2], p161.stack_watch_packets[index * 2 + 1]];
  const sourceContext = packets.map((packet) => {
    const supported = packet.claim_blocks.find((claim) => claim.claim_type === "Supported observation") ?? packet.claim_blocks[0];
    return { packet_id: packet.stack_watch_packet_id, title: packet.title, claim_block_id: supported.claim_block_id, text: supported.text, source_ids: packet.source_ids, source_semantic_digest: supported.source_semantic_digest };
  });
  return {
    monograph_id: `200-MONOGRAPH-${String(index + 1).padStart(2, "0")}`,
    slug,
    title,
    state: "Complete locally — source-bound noncausal synthesis",
    governing_question: question,
    systems,
    upstream_packet_ids: packets.map((packet) => packet.stack_watch_packet_id),
    source_ids: unique(packets.flatMap((packet) => packet.source_ids)),
    topic_ids: unique(packets.flatMap((packet) => packet.topic_ids)),
    project_chronicle_ids: unique(packets.flatMap((packet) => packet.project_chronicle_ids)),
    place_ledger_ids: unique(packets.flatMap((packet) => packet.place_ledger_ids)),
    source_context: sourceContext,
    sections: [
      { heading: "System question", text: `${question} The chapter treats each institution, artifact, stage, and receiving party as an independent identity.` },
      { heading: "What the paired record establishes", text: `${packets[0].title} and ${packets[1].title} supply two bounded official-source contexts. Their claims remain attached to their original entities, periods, measures, authorities, and limitations.` },
      { heading: "Conversion chain", text: `The useful analytical object is the chain across ${systems.join(", ")}. Authority, finance, construction, validation, acceptance, operation, distribution, affordability, service quality, and public outcome are not interchangeable states.` },
      { heading: "Comparison boundary", text: "The paired sources are not normalized into one denominator, score, rank, trend, or causal estimate. Difference in stage or timing is not evidence that one system produced the state of another." },
      { heading: "Research agenda", text: "Acquire the next receiving-party artifact for each open bridge, preserve revision lineage, and admit a comparison only after entity, period, measure, method, denominator, and authority are compatible." },
    ],
    causal_finding: null,
    comparative_score: null,
    outcome_claim: null,
    stop_rule: "Do not convert adjacency, sequence, shared geography, shared funding, or two source-bound context claims into causation or a common performance measure.",
    route: `/review/v1reference/cross-system-constraint-monographs/${slug}/`,
  };
});

const p200 = registry({
  phase: 200,
  title: "Cross-System Constraint Monographs",
  summary: "Publish twelve substantial, source-bound monographs that make recurring conversion chains legible without normalizing unlike measures or manufacturing causal findings.",
  key: "monographs",
  records: monographs,
  counts: {
    monographs: 12,
    source_context_blocks: 24,
    chapter_sections: 60,
    source_bindings: monographs.flatMap((record) => record.source_ids).length,
    causal_findings: 0,
    scores_or_ranks: 0,
    outcome_claims: 0,
  },
});

const workflowStages = [
  { sequence: 1, stage: "Intake", rule: "Record the exact challenged claim, artifact, submitter basis, and discovery time without changing public state." },
  { sequence: 2, stage: "Identity resolution", rule: "Resolve entity, issuer, artifact version, date, and canonical claim identity." },
  { sequence: 3, stage: "Source diff", rule: "Archive the prior locator and capture the exact added, removed, revised, or superseded scope." },
  { sequence: 4, stage: "Evidence review", rule: "Determine whether the change affects context, an admitted observation, a decision, a stage, or no governed claim." },
  { sequence: 5, stage: "Impact graph", rule: "Enumerate every source, signal, dossier, pathway, panel, report, export, and update that consumes the claim." },
  { sequence: 6, stage: "Decision", rule: "Issue Correct, Clarify, Retract, Supersede, No Material Change, or Bounded Blocker with reviewer, rationale, date, and receipt." },
  { sequence: 7, stage: "Propagation", rule: "Apply the same decision to all affected surfaces while preserving prior versions and independent identities." },
  { sequence: 8, stage: "Verification and notice", rule: "Re-run assertions, publish a plain-language notice when authorized, and retain the immutable propagation receipt." },
];
const changeServiceRecords = topics.map((topic, index) => ({
  change_service_record_id: `201-DESK-${String(index + 1).padStart(2, "0")}`,
  slug: topic.slug,
  title: `${topic.name} change-intelligence and correction desk`,
  state: "Active service specification — no change or correction inferred",
  topic_id: topic.id,
  source_ids: topic.featured_sources,
  monitored_claim_scope: `${topic.name} canonical topic content, source profiles, signals, project/place links, comparisons, panels, briefs, and report chapters.`,
  intake_triggers: ["Issuer correction or retraction", "Artifact revision or supersession", "Broken or materially redirected official locator", "Identity, period, method, denominator, unit, or attribution challenge", "Contradictory official record requiring adjudication"],
  service_levels: {
    acknowledge: "Record on discovery; no silent mutation",
    preserve: "Archive the prior identity and locator before a governed correction",
    decide: "No fixed time promise; priority follows claim reach, public-risk severity, and evidence availability",
    propagate: "Only after a dated authorized decision and complete impact inventory",
  },
  workflow_stage_ids: workflowStages.map((stage) => `201-WORKFLOW-${String(stage.sequence).padStart(2, "0")}`),
  current_change: null,
  current_correction_decision: null,
  decision_date: null,
  receipt_id: null,
  open_correction_count: 0,
  exact_next_artifact: `A dated source revision, correction, retraction, superseding artifact, or well-specified claim challenge affecting ${topic.name}.`,
  stop_rule: "Do not silently rewrite history, infer a correction from a changed page, or propagate a challenge as fact before identity resolution and a dated decision.",
  route: `/review/v1reference/change-intelligence-correction-service/${topic.slug}/`,
}));

const p201 = registry({
  phase: 201,
  title: "Change Intelligence and Correction Service",
  summary: "Stand up seventeen topic correction desks and an eight-stage immutable workflow without inventing a current correction or silently replacing source history.",
  key: "change_service_records",
  records: changeServiceRecords,
  counts: {
    change_service_records: 17,
    workflow_stages: 8,
    monitored_source_bindings: changeServiceRecords.flatMap((record) => record.source_ids).length,
    open_corrections: 0,
    correction_decisions: 0,
    silent_mutations_authorized: 0,
  },
  extras: { workflow_stages: workflowStages.map((stage) => ({ workflow_stage_id: `201-WORKFLOW-${String(stage.sequence).padStart(2, "0")}`, ...stage })), correction_decisions: [] },
});

const modeSpecs = [
  { id: "plain-language-en", language: "English", mode: "Plain-language edition", state: "Specification complete — human editorial production required", translation: false, requirements: ["Lead with the bounded answer", "Define necessary technical terms", "State what the evidence does not show", "Preserve source and correction links", "Use short sections and concrete questions"] },
  { id: "low-bandwidth-en", language: "English", mode: "Low-bandwidth HTML edition", state: "Specification complete — packaging and device testing required", translation: false, requirements: ["Semantic HTML without client-side rendering dependency", "Text-first payload target under 64 KB before source downloads", "No information conveyed by color alone", "Tables retain captions and row headers", "All source links remain directly reachable"] },
  { id: "fr-human-reviewed", language: "French", mode: "Human-reviewed translation", state: "Held — qualified human translation and subject review required", translation: true, requirements: ["Translate meaning rather than identifiers", "Preserve proper names and evidence states", "Review terminology against the English canonical record", "Record translator and reviewer", "Issue a dated approval receipt"] },
  { id: "es-human-reviewed", language: "Spanish", mode: "Human-reviewed translation", state: "Held — qualified human translation and subject review required", translation: true, requirements: ["Translate meaning rather than identifiers", "Preserve proper names and evidence states", "Review terminology against the English canonical record", "Record translator and reviewer", "Issue a dated approval receipt"] },
];
let editionIndex = 0;
const editionContracts = topics.flatMap((topic) => modeSpecs.map((mode) => {
  editionIndex += 1;
  return {
    edition_contract_id: `202-EDITION-${String(editionIndex).padStart(3, "0")}`,
    slug: `${topic.slug}-${mode.id}`,
    title: `${topic.name}: ${mode.mode}`,
    state: mode.state,
    topic_id: topic.id,
    canonical_language: "English",
    target_language: mode.language,
    edition_mode: mode.mode,
    is_translation: mode.translation,
    source_ids: topic.featured_sources.slice(0, 3),
    canonical_content_digest: sha({ id: topic.id, summary: topic.summary, questions: topic.watch_questions }),
    requirements: mode.requirements,
    accessibility_baseline: ["Landmark and heading order", "Keyboard-operable navigation", "Visible focus", "Descriptive link text", "Text alternatives for meaningful visuals", "No color-only meaning", "Readable tables", "Correction and source access"],
    rendered_content: null,
    translated_content: null,
    human_editor: null,
    subject_reviewer: null,
    review_date: null,
    approval_receipt_id: null,
    publication_state: "Held",
    stop_rule: mode.translation ? "Do not label machine-generated or unreviewed text as an approved translation." : "Do not label a specification as a tested, accessible, or published edition.",
    route: `/review/v1reference/accessible-multilingual-low-bandwidth-editions/${topic.slug}-${mode.id}/`,
  };
}));

const p202 = registry({
  phase: 202,
  title: "Accessible, Multilingual, and Low-Bandwidth Editions",
  summary: "Create sixty-eight topic-edition contracts across plain-language English, low-bandwidth HTML, French, and Spanish while holding every rendered edition and both translation programs for human review.",
  key: "edition_contracts",
  records: editionContracts,
  counts: {
    edition_contracts: 68,
    topics_covered: 17,
    plain_language_contracts: 17,
    low_bandwidth_contracts: 17,
    french_translation_contracts: 17,
    spanish_translation_contracts: 17,
    translation_contracts_held: 34,
    rendered_editions: 0,
    approved_translations: 0,
  },
  extras: { mode_contracts: modeSpecs },
});

const reportRecords = [];
for (const [index, topic] of topics.entries()) {
  reportRecords.push({
    report_record_id: `203-TOPIC-${String(index + 1).padStart(2, "0")}`,
    record_kind: "Topic chapter",
    slug: `topic-${topic.slug}`,
    title: `${topic.name}: state, evidence chain, and next decisive record`,
    state: "Complete editorial chapter — source-bound; public release held",
    topic_id: topic.id,
    source_ids: topic.featured_sources,
    sections: [
      { heading: "State of the evidence", text: topic.summary },
      { heading: "System constraints", text: `${topic.name} is tracked across ${topic.framework_layers.join(", ")}. Its declared constraints are ${topic.primary_constraints.join(", ")}; these are an editorial framework, not a measured causal model.` },
      { heading: "Decision questions", text: topic.watch_questions.slice(0, 4).join(" ") },
      { heading: "Evidence boundary", text: "Follow source, signal, project, place, comparison, and outcome identities independently. Do not move a record from authorization to operation or from availability to public outcome without the receiving-party artifact and compatible method." },
    ],
    outcome_claim: null,
    score_or_rank: null,
    route: `/review/v1reference/state-of-future-systems-2026/topic-${topic.slug}/`,
  });
}
for (const [index, monograph] of monographs.entries()) {
  reportRecords.push({
    report_record_id: `203-SYNTHESIS-${String(index + 1).padStart(2, "0")}`,
    record_kind: "Cross-system finding",
    slug: `synthesis-${monograph.slug}`,
    title: monograph.title,
    state: "Complete bounded synthesis — noncausal",
    upstream_monograph_id: monograph.monograph_id,
    source_ids: monograph.source_ids,
    supported_finding: `The evidence for ${monograph.title.toLowerCase()} is most legible as a staged chain with distinct authorities and receiving parties; the paired official contexts do not supply one common performance measure or causal estimate.`,
    sections: monograph.sections,
    causal_finding: null,
    comparative_score: null,
    route: `/review/v1reference/state-of-future-systems-2026/synthesis-${monograph.slug}/`,
  });
}
for (const [index, casebook] of casebookPackets.entries()) {
  reportRecords.push({
    report_record_id: `203-CASE-${String(index + 1).padStart(2, "0")}`,
    record_kind: "Named case profile",
    slug: `case-${casebook.slug}`,
    title: casebook.named_entity,
    state: "Complete bounded profile — adverse-event classification remains open",
    upstream_casebook_packet_id: casebook.casebook_packet_id,
    source_ids: casebook.source_ids,
    inherited_stage: casebook.inherited_stage,
    evidence_problem: casebook.inherited_unresolved_bridge,
    exact_next_artifact: casebook.exact_next_artifact,
    classification_decision: null,
    realized_outcome: null,
    route: `/review/v1reference/state-of-future-systems-2026/case-${casebook.slug}/`,
  });
}
const appendixSources = unique(p161.stack_watch_packets.slice(0, 6).flatMap((packet) => packet.source_ids));
const appendices = [
  ["methods", "Methods and evidence-state grammar", "Defines identity, authority, date, stage, admission, comparison, causal, correction, and publication rules used throughout the report."],
  ["source-catalogue", "Source catalogue and artifact lineage", "Maps report records to exact source IDs and preserves issuer, artifact, revision, and checked-date lineage without treating a link as admission."],
  ["corrections", "Corrections and version history", "Explains the eight-stage correction workflow, immutable prior versions, impact propagation, notices, and decision receipts."],
  ["accessibility", "Accessible-use and translation statement", "Discloses that edition contracts exist while rendered plain-language, low-bandwidth, French, and Spanish editions remain unapproved and unpublished."],
  ["limitations", "Limitations and open research register", "Collects target contracts, null observations, unadjudicated classifications, noncomparability decisions, owner gates, and exact next artifacts."],
].map(([slug, title, text], index) => ({
  report_record_id: `203-APPENDIX-${String(index + 1).padStart(2, "0")}`,
  record_kind: "Method appendix",
  slug: `appendix-${slug}`,
  title,
  state: "Complete editorial appendix — public release held",
  source_ids: appendixSources,
  abstract: text,
  route: `/review/v1reference/state-of-future-systems-2026/appendix-${slug}/`,
}));
reportRecords.push(...appendices);

const p203 = registry({
  phase: 203,
  title: "State of Future Systems 2026",
  summary: "Assemble a fifty-eight-record definitive report package: seventeen topic chapters, twelve bounded cross-system findings, twenty-four named case profiles, and five method appendices.",
  key: "report_package_records",
  records: reportRecords,
  counts: {
    report_package_records: 58,
    topic_chapters: 17,
    cross_system_findings: 12,
    named_case_profiles: 24,
    method_appendices: 5,
    public_release_decisions: 0,
    causal_findings: 0,
    scores_or_ranks: 0,
  },
  extras: {
    report_state: "Complete editorial package locally — expert review, accessible editions, repository publication, and public release held",
    editorial_thesis: "The useful unit of analysis is the evidence-to-outcome chain: identity, authority, implementation, acceptance, recurring operation, distribution, affordability, service quality, and public outcome remain separately inspectable.",
  },
});

const candidateDigest = sha({
  197: p197,
  198: p198,
  199: p199,
  200: p200,
  201: p201,
  202: p202,
  203: p203,
});
const validationReceipt = {
  schema_version: "1.0",
  receipt_id: `204-LOCAL-VALIDATION-2026-09-01-${candidateDigest.slice(0, 12)}`,
  receipt_type: "Local candidate validation",
  validated_phase_range: "197–203",
  validation_date: "2026-09-01",
  artifact_digest: candidateDigest,
  scope: "Validates the exact Phase 197–203 JSON candidate generated from the governed local input shelves. It does not validate future evidence, translations, expert approval, Git publication, hosting, DNS, public launch, or v1 promotion.",
};
const gateSpecs = [
  ["197-INVENTORY", "Gap-closure inventory", "Pass", "Forty-eight target contracts cover four topics, six regions, and two entity kinds with zero invented identities."],
  ["198-CASEBOOKS", "Casebook integrity", "Pass", "Twenty-four named project packets retain exact upstream source and signal identities while all classifications and outcomes remain null."],
  ["199-OBSERVATORY", "Outcome-panel integrity", "Pass", "Twenty-four panels divide evenly across three measure families and admit zero observations or outcome values."],
  ["200-MONOGRAPHS", "Cross-system monographs", "Pass", "Twelve monographs carry twenty-four source contexts and zero causal findings, scores, or outcome claims."],
  ["201-CORRECTIONS", "Correction service", "Pass", "Seventeen topic desks bind an eight-stage workflow and expose zero invented correction decisions."],
  ["202-EDITION-CONTRACTS", "Accessible-edition contracts", "Pass", "Sixty-eight edition contracts exist; all thirty-four French and Spanish contracts remain held for human review."],
  ["203-REPORT", "State of Future Systems report package", "Pass", "The report inventory is exactly 17 topic chapters, 12 bounded findings, 24 named cases, and 5 appendices."],
  ["CONTENT-BOUNDARIES", "Evidence and publication boundaries", "Pass", "Target, classification, observation, causation, translation, correction, owner, and publication states remain independently typed."],
  ["LOCAL-VALIDATION", "Local candidate validation", "Pass", `Receipt ${validationReceipt.receipt_id} binds the exact Phase 197–203 digest.`],
  ["PORTFOLIO-TARGETS", "100-project and 70-place target attainment", "Held", "Phase 197 creates acquisition contracts; it does not establish that either portfolio target has been reached."],
  ["LIVE-EVIDENCE", "September and October evidence operations", "Held", "Calendar-governed evidence checks remain outside this build and must run only on their lawful dates."],
  ["OWNER-ADJUDICATION", "Owner evidence and mission decisions", "Held", "No independent owner decision is supplied by this build."],
  ["EXPERT-REVIEW", "Independent subject-matter review", "Held", "The report and casebooks have not received an independently identified expert-review receipt."],
  ["TRANSLATION-REVIEW", "Human translation approval", "Held", "French and Spanish contracts contain no translated text, named reviewer, decision date, or approval receipt."],
  ["GIT-HOSTING-DNS", "Repository publication and delivery", "Held", "This build does not authorize commit, push, hosting, DNS, or public launch."],
  ["V1-PROMOTION", "v1 public-reference promotion", "Held", "Promotion requires all mandatory external, owner, review, publication, and delivery gates; those authorities remain false."],
];
const promotionGates = gateSpecs.map(([slug, title, state, evidence], index) => ({
  promotion_gate_id: `204-GATE-${String(index + 1).padStart(2, "0")}-${slug}`,
  slug: slug.toLowerCase(),
  title,
  state,
  derived_pass: state === "Pass",
  evidence,
  receipt_id: slug === "LOCAL-VALIDATION" ? validationReceipt.receipt_id : null,
  next_action: state === "Pass" ? "Preserve this gate and rerun validation after any candidate change." : {
    "PORTFOLIO-TARGETS": "Reconcile exact project/place identities after later acquisitions; never count target contracts as entities.",
    "LIVE-EVIDENCE": "Run each scheduled gate only when lawful and issue a dated receipt even for No Material Change or a bounded blocker.",
    "OWNER-ADJUDICATION": "Obtain dated owner decisions for the exact dockets and candidate digests.",
    "EXPERT-REVIEW": "Commission and record named subject review of methods, topic chapters, casebooks, and limitations.",
    "TRANSLATION-REVIEW": "Produce human translations and obtain separate language and subject-review receipts.",
    "GIT-HOSTING-DNS": "Obtain explicit authority, then validate the same digest through repository and delivery surfaces.",
    "V1-PROMOTION": "Promote only an immutable digest after every mandatory gate is terminal and no false pass remains.",
  }[slug],
  route: `/review/v1reference/v1-public-reference-edition-promotion-gate/${slug.toLowerCase()}/`,
}));

const p204 = registry({
  phase: 204,
  title: "v1 Public-Reference Edition Promotion Gate",
  summary: "Derive a sixteen-gate state report with nine locally passed content/integrity gates and seven legitimate holds; v1 public-reference promotion remains Held.",
  key: "promotion_gates",
  records: promotionGates,
  counts: {
    promotion_gates: 16,
    passed: 9,
    held: 7,
    false_passes: 0,
    locally_validated_phases: 7,
  },
  extras: {
    candidate_digest: candidateDigest,
    local_validation_receipt: validationReceipt,
    v1_public_reference_promotion_state: "Held",
    owner_authority: {
      target_attainment: false,
      evidence_admission: false,
      project_or_place_stage_change: false,
      casebook_classification: false,
      outcome_admission: false,
      correction_decision: false,
      expert_review: false,
      translation_approval: false,
      repository_publication: false,
      hosting: false,
      dns: false,
      public_launch: false,
      v1_promotion: false,
    },
  },
});

const phases = [p197, p198, p199, p200, p201, p202, p203, p204];
for (const phase of phases) await writeJson(join(dataRoot, phaseFiles[phase.phase]), phase);

const workPackages = {
  197: {
    objective: "Close geographic and topic blind spots through exact acquisition contracts while treating 100 projects and 70 places as targets, never as achieved inventory.",
    inventory: ["48 gap-closure packets", "4 focus topics × 6 regions × 2 entity kinds", "0 invented identities or admissions"],
    acceptance: ["Every packet names an authority, identity, stage, and next-artifact test", "Orientation sources are explicitly non-geographic", "Targets and current inventories remain separate"],
  },
  198: {
    objective: "Make adverse events and recovery evidence as inspectable as progress evidence.",
    inventory: ["24 named casebook research packets", "5 research sections per packet", "Exact upstream project, source, signal, stage, and stop-rule bindings"],
    acceptance: ["Classification, cause, correction, and outcome fields remain null", "No sequence is treated as causation", "Each packet states the exact next artifact"],
  },
  199: {
    objective: "Create a public-outcome measurement layer for distribution, affordability, and service quality.",
    inventory: ["24 panel specifications", "8 panels per measure family", "24 source-bound orientation claims and zero admitted observations"],
    acceptance: ["Entity, period, numerator, denominator, unit, method, and attribution are explicit fields", "All outcome values remain null", "Context never substitutes for admission"],
  },
  200: {
    objective: "Explain the cross-system chains that govern real-world conversion without manufacturing causal conclusions.",
    inventory: ["12 monographs", "60 substantive sections", "24 exact source-context blocks"],
    acceptance: ["Every monograph has at least two official-source bindings", "Comparability and causality boundaries are explicit", "No score, rank, or outcome claim is created"],
  },
  201: {
    objective: "Make corrections visible, reversible, propagatable, and independently verifiable.",
    inventory: ["17 topic correction desks", "8 ordered workflow stages", "Explicit correction decision vocabulary and immutable history contract"],
    acceptance: ["No silent mutation", "No challenged claim becomes a correction before a dated decision", "Every correction requires an impact graph and receipt"],
  },
  202: {
    objective: "Prepare accessible, low-bandwidth, French, and Spanish editions without passing specifications off as completed human-reviewed content.",
    inventory: ["68 edition contracts", "17 per mode", "34 translation holds"],
    acceptance: ["Rendered and translated content remain null", "French and Spanish require language and subject review", "Accessibility requirements cover structure, keyboard use, text alternatives, color, tables, and correction access"],
  },
  203: {
    objective: "Assemble the definitive State of Future Systems 2026 editorial package.",
    inventory: ["17 topic chapters", "12 bounded cross-system findings", "24 named cases", "5 method appendices"],
    acceptance: ["Every record has source bindings", "The report carries zero causal findings or ranks", "Expert, translation, Git, and public-release states remain held"],
  },
  204: {
    objective: "Promote only a fully authorized, immutable public-reference candidate.",
    inventory: ["16 promotion gates", "9 local passes", "7 external, owner, calendar, review, or publication holds", `Candidate digest ${candidateDigest}`],
    acceptance: ["Zero false passes", "Local validation does not imply public authorization", "v1 remains Held until every mandatory gate is terminal"],
  },
};

for (const phase of phases) {
  const spec = workPackages[phase.phase];
  const lines = [
    `# Phase ${phase.phase} work package — ${phase.title}`,
    "",
    "**State:** Complete locally; public release not authorized  ",
    "**Effective date:** 2026-09-01",
    "",
    "## Objective",
    "",
    spec.objective,
    "",
    "## Delivered inventory",
    "",
    ...spec.inventory.map((item) => `- ${item}`),
    "",
    "## Publication boundary",
    "",
    ...boundaries.map((item) => `- ${item}`),
    "",
    "## Acceptance",
    "",
    ...spec.acceptance.map((item) => `- ${item}`),
    "",
    "## Machine contract",
    "",
    `- Registry: \`app/src/data/${phaseFiles[phase.phase]}\``,
    `- Hub: \`${phase.routes.hub}\``,
    `- Public export target: \`${phase.routes.public_export}\``,
    `- Primary record count: ${phase.public_html_routes.length - 1}`,
    "",
  ];
  await writeText(join(workPackagesRoot, phaseFiles[phase.phase].replace(/\.json$/, ".md")), lines.join("\n"));
}

console.log(`Built Phases 197–204: ${gapClosurePackets.length} gap contracts, ${casebookPackets.length} casebooks, ${outcomePanels.length} panels, ${monographs.length} monographs, ${changeServiceRecords.length} correction desks, ${editionContracts.length} edition contracts, ${reportRecords.length} report records, and 9 Pass / 7 Held promotion gates.`);
