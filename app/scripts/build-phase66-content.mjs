import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDirectory, "..");
const contentRoot = join(appRoot, "src", "content");
const today = "2026-08-12";

const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = async (path, value) => {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      await writeFile(path, content, "utf8");
      return;
    } catch (error) {
      if (attempt === 6) throw error;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 100));
    }
  }
};

const phase65 = await readJson(appRoot, "src", "data", "phase-65-content-expansion.json");
const matrix = await readJson(appRoot, "src", "data", "phase-64-conversion-stage-matrix.json");
const gates = await readJson(appRoot, "src", "data", "phase-63-conversion-gate-calendar.json");
const matrixByFile = new Map(matrix.file_rows.map((row) => [row.file_id, row]));
const gateByFile = new Map(gates.gate_records.map((record) => [record.file_id, record]));
const phase65ReviewById = new Map(phase65.research_record_reviews.map((record) => [record.id, record]));
const phase65NamedPackById = new Map(phase65.named_file_reporting_packs.map((pack) => [pack.pack_id, pack]));

const stageTaxonomy = [
  {
    stage_id: "66-STAGE-01-VALIDATION",
    phase64_stage_id: "64-STAGE-05-VALIDATION",
    label: "Validation",
    question: "Does a same-entity record document the named inspection, test, compliance check, qualification, result, exception, correction, or retest?"
  },
  {
    stage_id: "66-STAGE-02-ACCEPTANCE",
    phase64_stage_id: "64-STAGE-06-ACCEPTANCE",
    label: "Acceptance",
    question: "Does a named receiving authority or customer accept the defined asset, service, product, cutover, occupancy, or operating condition?"
  },
  {
    stage_id: "66-STAGE-03-REPEAT",
    phase64_stage_id: "64-STAGE-07-REPEAT",
    label: "Recurring operation",
    question: "Does the record establish compatible repeated service, output, use, monitoring, shipment, or operation for the same entity?"
  },
  {
    stage_id: "66-STAGE-04-OUTCOME",
    phase64_stage_id: "64-STAGE-08-OUTCOME",
    label: "Comparable outcome",
    question: "Does a repeated series preserve entity, period, definition, method, denominator, and receiving-system acceptance well enough to support an outcome claim?"
  }
];

const fileSpecs = [
  {
    sequence: 1,
    pack_id: "65-NAMED-01-TSMC",
    file_id: "61-PROJECT-TSMC-ARIZONA",
    label: "TSMC Arizona",
    slug: "acceptance-dossier-001-tsmc-arizona",
    briefing_id: "briefing-acceptance-dossier-001-tsmc-arizona",
    canonical_file: "briefing-project-conversion-001-tsmc-arizona.mdx",
    local_file: "local-us-southwest-chip-corridor.mdx",
    signal_ids: ["signal-aps-tsmc-service-territory-capacity-boundary", "signal-phoenix-tsmc-fab3-topping-out", "signal-tsmc-phoenix-wastewater-infrastructure-agreement"],
    gap_ids: ["gap-001", "gap-002", "gap-003"],
    constraints: ["Power", "Water", "Manufacturing", "Labor", "Data Quality"],
    stage_support: { "66-STAGE-03-REPEAT": ["research-doc-phase65-001"] },
    review_classes: { "research-doc-phase65-001": "Stage-adjacent / held" },
    boundary: "The City-relayed Fab 1 volume-production statement remains a bounded single observation. Construction, planning, workforce, water, and agreement records do not establish accepted utility service, customer qualification, or a compatible recurring facility series.",
    next_artifact: "Facility-specific inspection, utility acceptance, equipment or product qualification, customer acceptance, and a compatible repeat production series."
  },
  {
    sequence: 2,
    pack_id: "65-NAMED-02-TORONTO",
    file_id: "61-PROJECT-TORONTO-24-254930",
    label: "Toronto application 24 254930",
    slug: "acceptance-dossier-002-toronto-24-254930",
    briefing_id: "briefing-acceptance-dossier-002-toronto-24-254930",
    canonical_file: "briefing-project-conversion-002-toronto-24-254930.mdx",
    local_file: "local-ontario-real-estate.mdx",
    signal_ids: ["signal-toronto-24-254930-community-council-recommendation", "signal-cmhc-june-2026-toronto-construction-stage-baseline"],
    gap_ids: ["gap-004", "gap-005"],
    constraints: ["Regulation", "Infrastructure", "Capital", "Labor", "Data Quality"],
    stage_support: {},
    review_classes: { "research-doc-phase65-009": "Stage-adjacent / held", "research-doc-phase65-010": "Stage-adjacent / held" },
    boundary: "Council adoption and item history establish authority and unresolved conditions. Citywide pipeline, permit, power, and reliability records cannot substitute for this application's condition compliance, permit, start, completion, or occupancy.",
    next_artifact: "Enacted amendment numbers or accepted condition compliance followed by a project-specific building permit, start, completion, and occupancy record."
  },
  {
    sequence: 3,
    pack_id: "65-NAMED-03-NOVA",
    file_id: "61-PROJECT-NOVA-LARGE-LOAD",
    label: "Northern Virginia large-load delivery",
    slug: "acceptance-dossier-003-northern-virginia-large-load",
    briefing_id: "briefing-acceptance-dossier-003-northern-virginia-large-load",
    canonical_file: "briefing-project-conversion-003-northern-virginia-large-load.mdx",
    local_file: "local-northern-virginia-data-center-corridor.mdx",
    signal_ids: ["signal-virginia-data-center-air-permit-trail", "signal-virginia-gs5-large-load-rate-class"],
    gap_ids: ["gap-008", "gap-011"],
    constraints: ["Power", "Infrastructure", "Regulation", "Land Use", "Data Quality"],
    stage_support: {},
    review_classes: { "research-doc-phase65-019": "Stage-adjacent / held", "research-doc-phase65-020": "Stage-adjacent / held" },
    boundary: "A future rate class, conditional transmission decision, forecast, permit trail, land-use rule, and reclaimed-water program remain upstream of an accepted named-customer service record.",
    next_artifact: "Final route and land rights followed by construction, inspection, energization, a named GS-5 service agreement, metered operation, and compatible reliability."
  },
  {
    sequence: 4,
    pack_id: "65-NAMED-04-SPACE-COAST",
    file_id: "61-PROJECT-SPACE-COAST-AUTHORITY",
    label: "Florida Space Coast authority stack",
    slug: "acceptance-dossier-004-space-coast-authority",
    briefing_id: "briefing-acceptance-dossier-004-space-coast-authority",
    canonical_file: "briefing-project-conversion-004-space-coast-authority.mdx",
    local_file: "local-florida-space-coast-launch-corridor.mdx",
    signal_ids: ["signal-faa-part450-operator-transition", "signal-kennedy-multiuser-master-plan", "signal-ksc-causeway-bridge-operational"],
    gap_ids: ["gap-010", "gap-013", "gap-016"],
    constraints: ["Infrastructure", "Regulation", "Safety", "Capital", "Data Quality"],
    stage_support: {},
    review_classes: {
      "research-doc-phase65-025": "Stage-adjacent / held",
      "research-doc-phase65-026": "Stage-adjacent / held",
      "research-doc-phase65-031": "Stage-adjacent / held"
    },
    boundary: "Operator transition, environmental decisions, a programme shelf, a master plan, and an operational causeway bridge concern distinct scopes. None transfers acceptance or repeat-operation evidence into the Shuttle Landing Facility, LC-39A, or SLC-40 file.",
    next_artifact: "A formal Shuttle Landing Facility licence disposition or site-and-operator-specific asset acceptance, mission use, repeated service, utilization, safety, and reliability record."
  },
  {
    sequence: 5,
    pack_id: "65-NAMED-05-NEVADA",
    file_id: "61-PROJECT-NEVADA-LITHIUM",
    label: "Nevada lithium projects",
    slug: "acceptance-dossier-005-nevada-lithium",
    briefing_id: "briefing-acceptance-dossier-005-nevada-lithium",
    canonical_file: "briefing-project-conversion-005-nevada-lithium.mdx",
    local_file: "local-nevada-lithium-processing-corridor.mdx",
    signal_ids: ["signal-thacker-pass-federal-land-authorization", "signal-thacker-pass-doe-loan-financial-close", "signal-thacker-pass-state-environmental-permit-stack", "signal-rhyolite-ridge-water-permit-preoperation-gates"],
    gap_ids: ["gap-007", "gap-012"],
    constraints: ["Materials", "Water", "Manufacturing", "Capital", "Data Quality"],
    stage_support: { "66-STAGE-01-VALIDATION": ["research-doc-phase65-040"] },
    review_classes: { "research-doc-phase65-040": "Stage-adjacent / held" },
    boundary: "Rhyolite Ridge's water permit defines future inspection, monitoring, modeling, reporting, and pre-operation duties but does not establish their satisfaction. Thacker Pass authorization and financial close do not establish qualified material or customer receipt.",
    next_artifact: "A named inspection, accepted construction completion, commissioning result, compliant operating measurement, qualified lot, customer receipt, or recurring output series."
  },
  {
    sequence: 6,
    pack_id: "65-NAMED-06-GSA-PQC",
    file_id: "61-ADOPTION-GSA-PQC",
    label: "GSA post-quantum acquisition",
    slug: "acceptance-dossier-006-gsa-pqc",
    briefing_id: "briefing-acceptance-dossier-006-gsa-pqc",
    canonical_file: "briefing-adoption-case-001-gsa-pqc.mdx",
    local_file: null,
    signal_ids: ["signal-gsa-pqc-procurement-paths", "signal-gsa-onegov-ai-procurement-channel", "signal-56o-gsa-priority-portfolio-two-implemented-11-current", "signal-sample-007"],
    gap_ids: ["gap-009", "gap-016"],
    constraints: ["Standards", "Cybersecurity", "Supply Chain", "Labor", "Data Quality"],
    stage_support: {},
    review_classes: { "research-doc-phase65-044": "Stage-adjacent / held", "research-doc-phase65-045": "Stage-adjacent / held" },
    boundary: "Acquisition channels, migration policy, credential drafts, preliminary interoperability material, cybersecurity guidance, and oversight context do not identify a completed named agency migration.",
    next_artifact: "A named agency inventory, solicitation, award, interoperability result, tested cutover, receiving-authority acceptance, rollback record, or legacy retirement."
  },
  {
    sequence: 7,
    pack_id: "65-NAMED-07-NIST-ARIA",
    file_id: "61-ADOPTION-NIST-ARIA",
    label: "NIST ARIA assurance",
    slug: "acceptance-dossier-007-nist-aria",
    briefing_id: "briefing-acceptance-dossier-007-nist-aria",
    canonical_file: "briefing-adoption-case-002-nist-aria.mdx",
    local_file: null,
    signal_ids: ["signal-nist-aria-pilot-multilevel-evaluation", "signal-nist-ai-metrology-method-selection-layer", "signal-nist-ai-rmf-critical-infrastructure-profile-concept"],
    gap_ids: ["gap-014", "gap-016"],
    constraints: ["Data Quality", "Standards", "Cybersecurity", "Regulation", "Public Trust"],
    stage_support: { "66-STAGE-01-VALIDATION": ["research-doc-phase65-049"] },
    review_classes: { "research-doc-phase65-049": "Same-entity downstream evidence", "research-doc-phase65-050": "Stage-adjacent / held" },
    boundary: "The ARIA 0.1 pilot is direct evidence of one multi-level evaluation. It does not establish a receiving institution's authorization, continuous monitoring, incident response, correction, repeated independent review, or mission outcome.",
    next_artifact: "A named system evaluation connected to authorization, deployment monitoring, incidents, corrective action, repeat review, and a stable mission or service measure."
  },
  {
    sequence: 8,
    pack_id: "65-NAMED-08-WAYMO",
    file_id: "61-ADOPTION-WAYMO-CALIFORNIA",
    label: "Waymo California service",
    slug: "acceptance-dossier-008-waymo-california",
    briefing_id: "briefing-acceptance-dossier-008-waymo-california",
    canonical_file: "briefing-adoption-case-003-waymo-california.mdx",
    local_file: null,
    signal_ids: ["signal-cpuc-waymo-fared-driverless-expansion-2024", "signal-nhtsa-waymo-flooded-roadway-recall-2026", "signal-california-av-testing-miles-2024"],
    gap_ids: ["gap-015", "gap-016"],
    constraints: ["Safety", "Regulation", "Accessibility", "Public Trust", "Data Quality"],
    stage_support: {
      "66-STAGE-02-ACCEPTANCE": ["research-doc-phase65-057"],
      "66-STAGE-03-REPEAT": ["research-doc-phase65-058"]
    },
    review_classes: {
      "research-doc-phase65-057": "Same-entity downstream evidence",
      "research-doc-phase65-058": "Stage-adjacent / held",
      "research-doc-phase65-059": "Stage-adjacent / held",
      "research-doc-phase65-060": "Stage-adjacent / held"
    },
    boundary: "CPUC service authority supplies partial acceptance evidence and creates a recurring reporting rail. DMV testing miles and general oversight records do not establish stable passenger-service availability, quality, accessibility, safety, complaints, cost, or coverage.",
    next_artifact: "A stable Waymo passenger-service series with geography, period, service exposure, rides, interventions, safety events, accessibility, complaints, cost, and compatible definitions."
  }
];

const dossierRows = [];
const recordReviews = [];
for (const spec of fileSpecs) {
  const pack = phase65NamedPackById.get(spec.pack_id);
  const matrixRow = matrixByFile.get(spec.file_id);
  const gate = gateByFile.get(spec.file_id);
  if (!pack || !matrixRow || !gate) throw new Error(`Phase 66 cannot resolve ${spec.file_id} across Phase 63-65.`);
  const stageDecisions = stageTaxonomy.map((stage) => {
    const inherited = matrixRow.stage_cells.find((cell) => cell.stage_id === stage.phase64_stage_id);
    return {
      stage_id: stage.stage_id,
      phase64_stage_id: stage.phase64_stage_id,
      decision_state: inherited.cell_state,
      decision: "No Change",
      supporting_phase65_record_ids: spec.stage_support[stage.stage_id] ?? [],
      basis: inherited.basis,
      exact_qualifying_artifact: stage.stage_id === "66-STAGE-01-VALIDATION"
        ? `A same-entity ${spec.next_artifact.toLowerCase()}`
        : stage.stage_id === "66-STAGE-02-ACCEPTANCE"
          ? `A named receiving-authority or customer acceptance record. ${spec.next_artifact}`
          : stage.stage_id === "66-STAGE-03-REPEAT"
            ? `A compatible repeated-operation record for the same entity. ${spec.next_artifact}`
            : `A repeated outcome series with stable identity, period, definition, method, denominator, and acceptance. ${spec.next_artifact}`
    };
  });
  const packReviews = pack.phase65_record_ids.map((recordId) => {
    const review = phase65ReviewById.get(recordId);
    if (!review) throw new Error(`Missing Phase 65 record review ${recordId}.`);
    const reviewClass = spec.review_classes[recordId] ?? "Context only";
    const relevantStages = stageDecisions.filter((decision) => decision.supporting_phase65_record_ids.includes(recordId)).map((decision) => decision.stage_id);
    const row = {
      review_id: `66-REVIEW-${String(recordReviews.length + 1).padStart(2, "0")}`,
      file_id: spec.file_id,
      phase65_record_id: recordId,
      source_document_id: review.source_document_id,
      title: review.title,
      review_class: reviewClass,
      relevant_stage_ids: relevantStages,
      decision: reviewClass === "Context only" ? "Do not transfer into a downstream stage" : "Retain only at the stated same-entity or adjacent stage",
      rationale: reviewClass === "Same-entity downstream evidence"
        ? `The record concerns the named file and supports only the bounded Phase 64 state cited in this dossier; it does not flow automatically to a later stage.`
        : reviewClass === "Stage-adjacent / held"
          ? `The record is relevant to the file or downstream question but lacks the accepted result, stable series, exact scope, or receiving-system proof required for a complete downstream state.`
          : `The record supplies local, sector, policy, planning, comparison, or adjacent-entity context and cannot be transferred into validation, acceptance, recurring operation, or outcome evidence for this named file.`
    };
    recordReviews.push(row);
    return row;
  });
  dossierRows.push({
    dossier_id: `66-DOSSIER-${String(spec.sequence).padStart(2, "0")}`,
    file_id: spec.file_id,
    named_entity: matrixRow.named_entity,
    kind: matrixRow.kind,
    canonical_briefing_id: gate.canonical_briefing_id,
    acceptance_briefing_id: spec.briefing_id,
    gate_id: gate.gate_id,
    gate_mode: gate.gate_mode,
    next_check_date: gate.next_check_date,
    reopening_trigger: gate.reopening_trigger,
    exact_next_artifact: gate.exact_next_artifact,
    stop_rule: gate.stop_rule,
    interpretation_boundary: spec.boundary,
    stage_decisions: stageDecisions,
    record_reviews: packReviews.map((row) => row.review_id)
  });
}

const stageDecisions = dossierRows.flatMap((dossier) => dossier.stage_decisions.map((decision) => ({ ...decision, file_id: dossier.file_id })));
const decisionCounts = Object.fromEntries(matrix.cell_states.map((state) => [state, stageDecisions.filter((decision) => decision.decision_state === state).length]));
const classCounts = Object.fromEntries(["Same-entity downstream evidence", "Stage-adjacent / held", "Context only"].map((reviewClass) => [reviewClass, recordReviews.filter((record) => record.review_class === reviewClass).length]));

const ledger = {
  schema_version: "1.0",
  phase: "66",
  ledger_id: "acceptance-repeat-operation-ledger-001",
  title: "Acceptance And Repeated Operation Dossiers",
  captured_date: today,
  as_of_date: today,
  scope: "Sixty-four Phase 65 named-file records tested against validation, acceptance, recurring operation, and comparable outcome for the same eight Phase 61 files.",
  interpretation_boundary: "A reviewed record changes only the exact same-entity downstream question it satisfies. Authority, commitment, construction, planning, adjacent assets, other entities, and one-time observations do not transfer into acceptance, repeat operation, or outcome evidence.",
  stage_taxonomy: stageTaxonomy,
  decision_states: matrix.cell_states,
  metrics: {
    named_files: dossierRows.length,
    records_reviewed: recordReviews.length,
    stage_decisions: stageDecisions.length,
    evidence_present: decisionCounts["Evidence Present"],
    partial_or_held: decisionCounts["Partial / Held"],
    not_established: decisionCounts["Not Established"],
    same_entity_downstream_records: classCounts["Same-entity downstream evidence"],
    stage_adjacent_or_held_records: classCounts["Stage-adjacent / held"],
    context_only_records: classCounts["Context only"],
    matrix_cells_advanced: 0,
    new_sources: 0,
    new_signals: 0,
    signal_promotions: 0,
    receipts_created: 0,
    public_exports_added: 0,
    scores_created: 0,
    rankings_created: 0
  },
  dossier_rows: dossierRows,
  record_reviews: recordReviews,
  cross_file_rules: [
    "The named entity and exact asset, system, site, operator, institution, or project scope must match.",
    "The record must name the downstream authority, test, acceptance event, repeated series, or outcome definition it supports.",
    "An adjacent entity, corridor aggregate, planning baseline, forecast, permit obligation, or general programme record cannot be transferred into a named-file stage.",
    "A single accepted event does not establish recurring operation; repeated operation does not establish a comparable outcome without stable definitions and denominators.",
    "Any future stage change requires a real source review and the existing Phase 60-64 propagation contract."
  ]
};
await writeJson(join(appRoot, "src", "data", "phase-66-acceptance-repeat-operation-ledger.json"), ledger);

const yamlList = (items) => items.map((item) => `  - "${item.replaceAll('"', '\\"')}"`).join("\n");
const table = (decisions) => [
  "| Downstream test | Decision | Basis |",
  "| --- | --- | --- |",
  ...decisions.map((decision) => {
    const stage = stageTaxonomy.find((item) => item.stage_id === decision.stage_id);
    return `| ${stage.label} | ${decision.decision_state} | ${decision.basis.replaceAll("|", "\\|")} |`;
  })
].join("\n");

for (const spec of fileSpecs) {
  const dossier = dossierRows.find((row) => row.file_id === spec.file_id);
  const reviews = recordReviews.filter((row) => row.file_id === spec.file_id);
  const content = `---
id: "${spec.briefing_id}"
title: "Acceptance Dossier ${String(spec.sequence).padStart(3, "0")}: ${spec.label}"
slug: "${spec.slug}"
record_status: "Published"
summary: "Phase 66 tests the eight-record ${spec.label} reporting pack against validation, acceptance, recurring operation, and comparable outcome. ${spec.boundary}"
published_date: ${today}
captured_date: ${today}
signal_ids:
${yamlList(spec.signal_ids)}
evidence_gap_ids:
${yamlList(spec.gap_ids)}
claim_scope: "Editorial Synthesis"
local_evidence_level: "${spec.local_file ? "Project-Level Evidence" : "General Source Layer"}"
last_reviewed_date: ${today}
top_takeaways:
  - "Each Phase 65 record is tested against four exact downstream questions for the same named file."
  - "The current decisions remain ${dossier.stage_decisions.map((decision) => decision.decision_state).join(", ")}; no Phase 64 cell changes."
  - "Context, adjacent entities, authority, plans, and one-time observations do not transfer into acceptance or repeat operation."
constraint_watch:
${yamlList(spec.constraints)}
what_to_watch_next:
  - "${spec.next_artifact.replaceAll('"', '\\"')}"
  - "A named receiving authority, accepted result, exception and correction trail, or stable repeat series"
  - "A same-entity record that satisfies the existing Phase 63 gate and complete propagation contract"
---

## Four downstream tests

${table(dossier.stage_decisions)}

## Record-level review

${reviews.map((review) => {
    const phase65Review = phase65ReviewById.get(review.phase65_record_id);
    return `- [${review.title}](/research/documents/${phase65Review.slug}/) — **${review.review_class}.** ${review.rationale}`;
  }).join("\n")}

## Interpretation boundary

${spec.boundary}

## Exact next artifact

${spec.next_artifact}

The Phase 63 gate remains ${dossier.gate_mode === "Dated Check" ? `a dated check for ${dossier.next_check_date}` : "source-triggered"}. ${dossier.stop_rule}

## Publication decision

This dossier publishes because it makes sixty-four existing record reviews and thirty-two downstream decisions inspectable without changing an underlying source, signal, receipt, event, gate, or matrix cell. A future change requires a newly reviewed same-entity artifact and complete Phase 60-64 propagation.
`;
  await writeFile(join(contentRoot, "briefings", `${spec.briefing_id}.mdx`), content, "utf8");
}

const crossBriefings = [
  {
    id: "briefing-acceptance-watch-002-eight-files-four-tests",
    title: "Acceptance Watch 002: Eight Files, Four Downstream Tests",
    slug: "acceptance-watch-002-eight-files-four-downstream-tests",
    signal_ids: fileSpecs.flatMap((spec) => spec.signal_ids.slice(0, 1)),
    gap_ids: ["gap-002", "gap-004", "gap-009", "gap-011", "gap-012", "gap-013", "gap-014", "gap-015", "gap-016"],
    constraints: ["Data Quality", "Interpretation", "Regulation", "Infrastructure", "Public Trust"],
    summary: "A cross-file guide to the thirty-two Phase 66 decisions: one Evidence Present, four Partial/Held, and twenty-seven Not Established, with no stage transfer or matrix advance.",
    body: `## Current distribution

Phase 66 asks four downstream questions of eight named files, creating thirty-two decisions:

- **1 Evidence Present:** NIST ARIA validation;
- **4 Partial / Held:** TSMC recurring operation, Nevada validation, and Waymo acceptance and recurring operation;
- **27 Not Established:** every remaining file-test combination.

These are the inherited Phase 64 states after the Phase 65 record-level review. Phase 66 advances none of them.

## Why the files remain different

Validation may mean inspection, commissioning, qualification, interoperability, evaluation, or safety correction. Acceptance may mean utility service, occupancy, customer receipt, cutover, authorization, or asset handoff. Repeat operation requires a compatible series for the same entity. A comparable outcome adds stable definitions, periods, methods, denominators, and receiving-system acceptance.

## No-transfer result

The sixty-four reviewed records contain two same-entity downstream records, fifteen stage-adjacent or held records, and forty-seven context-only records. A record's relevance does not make it qualifying evidence for a later stage.`
  },
  {
    id: "briefing-repeat-operation-watch-001-after-acceptance",
    title: "Repeat Operation Watch 001: What Counts After Acceptance",
    slug: "repeat-operation-watch-001-what-counts-after-acceptance",
    signal_ids: ["signal-nist-aria-pilot-multilevel-evaluation", "signal-cpuc-waymo-fared-driverless-expansion-2024", "signal-chandler-reclaimed-water-operating-scale", "signal-faa-reaches-one-thousand-commercial-space-operations", "signal-56a-air-travel-consumer"],
    gap_ids: ["gap-002", "gap-010", "gap-013", "gap-014", "gap-015", "gap-016"],
    constraints: ["Data Quality", "Interpretation", "Infrastructure", "Safety", "Public Trust"],
    summary: "A reader guide to the evidence required after a one-time acceptance: stable entity, period, definition, method, denominator, exceptions, and repeat receiving-system operation.",
    body: `## Acceptance is an event; operation is a series

An accepted asset, service, product, occupancy, cutover, or authorization can be decisive without establishing what happened next. Repeat operation needs multiple compatible observations for the same entity and scope.

## Minimum repeat-operation contract

1. stable entity and asset, service, system, product, or operator identity;
2. explicit observation period and frequency;
3. unchanged or reconciled definition and method;
4. a denominator such as service exposure, output opportunity, eligible users, capacity, or accepted scope;
5. exceptions, interruptions, corrections, revisions, and missing periods;
6. evidence that the receiving system continued to accept the operation.

## Outcome boundary

Repeated activity is not automatically performance or benefit. A comparable outcome still needs a named outcome measure, stable denominator, attribution boundary, and evidence that changing conditions or definitions have not been silently combined.`
  }
];

for (const briefing of crossBriefings) {
  const content = `---
id: "${briefing.id}"
title: "${briefing.title}"
slug: "${briefing.slug}"
record_status: "Published"
summary: "${briefing.summary}"
published_date: ${today}
captured_date: ${today}
signal_ids:
${yamlList(briefing.signal_ids)}
evidence_gap_ids:
${yamlList(briefing.gap_ids)}
claim_scope: "Editorial Synthesis"
local_evidence_level: "General Source Layer"
last_reviewed_date: ${today}
top_takeaways:
  - "A downstream decision applies only to the exact named entity and evidence question it satisfies."
  - "Validation, acceptance, recurring operation, and comparable outcome remain separate states."
  - "Phase 66 records no matrix advance, score, ranking, or operating-outcome change."
constraint_watch:
${yamlList(briefing.constraints)}
what_to_watch_next:
  - "Same-entity validation results with exceptions, corrections, and retests"
  - "Named receiving-authority or customer acceptance records"
  - "Compatible repeated operation and outcome series with stable denominators"
---

${briefing.body}

## Publication boundary

This guide interprets the Phase 66 ledger. It does not create a new evidence record, transfer evidence across files, or change an underlying source, signal, receipt, event, gate, or matrix cell.
`;
  await writeFile(join(contentRoot, "briefings", `${briefing.id}.mdx`), content, "utf8");
}

const dependencyMap = {
  id: "dependency-map-acceptance-is-not-repeat-operation",
  title: "Acceptance Is Not Repeat Operation",
  slug: "acceptance-is-not-repeat-operation",
  summary: "A four-stage map separating validation, receiving-system acceptance, recurring operation, and comparable outcome while preserving the Phase 66 no-transfer rule.",
  map_type: "Evidence Gap Map",
  record_status: "Published",
  primary_topic: "Policy and Standards",
  framework_layers: ["Enabling Infrastructure", "Frontier Domains", "Human Systems"],
  constraint_tags: ["Data Quality", "Interpretation", "Regulation", "Infrastructure", "Public Trust"],
  map_question: "What evidence is required after implementation before a named file can support an accepted, repeated, or comparable operating claim?",
  interpretation_boundary: "The four nodes are distinct evidence questions, not a universal linear workflow. A file can enter at different points, and no node automatically proves the next one.",
  source_ids: [
    "source-phoenix-tsmc-july-2026-fab-update",
    "source-toronto-2026-sc33-9-item-history",
    "source-virginia-scc-golden-mars-2026",
    "source-faa-shuttle-landing-facility-license",
    "source-ndep-rhyolite-ridge-water-permit-2025",
    "source-gsa-pqc-buyers-guide-2025",
    "source-nist-aria-pilot-evaluation-2025",
    "source-cpuc-waymo-al2-disposition-2024"
  ],
  signal_ids: fileSpecs.flatMap((spec) => spec.signal_ids.slice(0, 1)),
  technology_ids: [],
  local_system_ids: [
    "local-us-southwest-chip-corridor",
    "local-ontario-real-estate",
    "local-northern-virginia-data-center-corridor",
    "local-florida-space-coast-launch-corridor",
    "local-nevada-lithium-processing-corridor"
  ],
  evidence_gap_ids: ["gap-002", "gap-004", "gap-009", "gap-011", "gap-012", "gap-013", "gap-014", "gap-015", "gap-016"],
  nodes: [
    { id: "node-validation", label: "Named validation", node_type: "Constraint", note: "Inspection, test, compliance, qualification, exception, correction, and retest must match the named scope." },
    { id: "node-acceptance", label: "Receiving-system acceptance", node_type: "Constraint", note: "A named authority or customer accepts the defined asset, service, product, occupancy, cutover, or operating condition." },
    { id: "node-repeat", label: "Compatible recurring operation", node_type: "Constraint", note: "Multiple observations preserve entity, scope, period, definition, method, denominator, and exceptions." },
    { id: "node-outcome", label: "Comparable outcome", node_type: "Evidence Gap", record_id: "gap-016", note: "A repeated series supports only a bounded outcome with a stable measure, denominator, acceptance state, and attribution boundary." },
    { id: "node-no-transfer", label: "No automatic evidence transfer", node_type: "Constraint", note: "Adjacent entities, plans, authority, construction, one-time events, and context records do not flow forward or sideways." }
  ],
  links: [
    { from: "node-validation", to: "node-acceptance", relationship: "Depends On", confidence: "Partial", note: "A successful test may be necessary but does not itself establish acceptance." },
    { from: "node-acceptance", to: "node-repeat", relationship: "Depends On", confidence: "Partial", note: "One accepted event does not establish recurring operation." },
    { from: "node-repeat", to: "node-outcome", relationship: "Limited By", confidence: "Missing Evidence", note: "Repeated activity still needs a stable outcome definition, denominator, and attribution boundary." },
    { from: "node-no-transfer", to: "node-outcome", relationship: "Limited By", confidence: "Supported", note: "The no-transfer rule prevents context and upstream records from becoming outcome evidence." }
  ],
  what_this_map_supports: [
    "Validation, acceptance, recurring operation, and comparable outcome can be reviewed as separate downstream questions.",
    "Same-entity identity, receiving-system authority, compatible repetition, and stable denominators are distinct evidence requirements.",
    "A held or context record can guide the next search without changing a matrix cell."
  ],
  what_this_map_does_not_prove: [
    "It does not establish readiness, maturity, value, risk, safety, performance, or probability for any file.",
    "It does not rank or compare unlike named systems.",
    "It does not convert a test, acceptance event, or repeated activity into an operating outcome."
  ],
  next_records_needed: [
    "Same-entity validation results with exceptions, corrections, and retests.",
    "Named receiving-system or customer acceptance records.",
    "Compatible repeat-operation and outcome series with stable identity, method, period, and denominator."
  ]
};
await writeJson(join(contentRoot, "dependency-maps", "acceptance-is-not-repeat-operation.json"), dependencyMap);

for (const spec of fileSpecs) {
  const dossier = dossierRows.find((row) => row.file_id === spec.file_id);
  const section = `## Phase 66 acceptance and repeat-operation test

[Acceptance Dossier ${String(spec.sequence).padStart(3, "0")}](/briefings/${spec.slug}/) tests all eight Phase 65 records against validation, acceptance, recurring operation, and comparable outcome.

${dossier.stage_decisions.map((decision) => {
    const stage = stageTaxonomy.find((item) => item.stage_id === decision.stage_id);
    return `- **${stage.label}: ${decision.decision_state}.** ${decision.basis}`;
  }).join("\n")}

No Phase 64 cell changes. ${spec.boundary}
`;
  const path = join(contentRoot, "briefings", spec.canonical_file);
  let text = await readFile(path, "utf8");
  text = text.replace(/\n## Phase 66 acceptance and repeat-operation test[\s\S]*$/, "");
  await writeFile(path, `${text.trimEnd()}\n\n${section}`, "utf8");

  if (spec.local_file) {
    const localPath = join(contentRoot, "local-systems", spec.local_file);
    let localText = await readFile(localPath, "utf8");
    const localSection = `## Phase 66 downstream evidence boundary

[Acceptance Dossier ${String(spec.sequence).padStart(3, "0")}](/briefings/${spec.slug}/) preserves the local system's exact validation, acceptance, recurring-operation, and outcome questions. ${spec.boundary}

The local dossier remains a constraint and evidence trail; it is not a readiness score or a substitute for the named receiving authority, customer, or compatible operating series.
`;
    localText = localText.replace(/\n## Phase 66 downstream evidence boundary[\s\S]*$/, "");
    await writeFile(localPath, `${localText.trimEnd()}\n\n${localSection}`, "utf8");
  }
}

const pathwayBindings = [
  ["local-conversion-southwest-ontario.json", [fileSpecs[0].briefing_id, fileSpecs[1].briefing_id]],
  ["chips-compute-research-to-fab.json", [fileSpecs[0].briefing_id]],
  ["industrial-water-agreement-to-reuse-operation.json", [fileSpecs[0].briefing_id]],
  ["northern-virginia-compute-to-service.json", [fileSpecs[2].briefing_id]],
  ["space-coast-plan-to-mission.json", [fileSpecs[3].briefing_id]],
  ["nevada-lithium-authorization-to-output.json", [fileSpecs[4].briefing_id]],
  ["policy-standards-to-implementation.json", [fileSpecs[5].briefing_id, fileSpecs[6].briefing_id]],
  ["ai-infrastructure-policy-to-assurance.json", [fileSpecs[6].briefing_id]],
  ["autonomy-regulation-to-service.json", [fileSpecs[7].briefing_id]],
  ["cross-corridor-authorization-to-operation.json", [...fileSpecs.map((spec) => spec.briefing_id), ...crossBriefings.map((briefing) => briefing.id)]]
];
for (const [file, briefingIds] of pathwayBindings) {
  const path = join(contentRoot, "reader-pathways", file);
  const pathway = await readJson(contentRoot, "reader-pathways", file);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, ...briefingIds])];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, dependencyMap.id])];
  await writeJson(path, pathway);
}

for (const file of ["briefing-validation-acceptance-watch-001.mdx", "briefing-conversion-stage-matrix-001.mdx"]) {
  const path = join(contentRoot, "briefings", file);
  let text = await readFile(path, "utf8");
  const section = `## Phase 66 downstream review

Phase 66 tests sixty-four named-file records against thirty-two downstream questions. The result remains one Evidence Present, four Partial/Held, and twenty-seven Not Established decisions, with zero Phase 64 cell advances. See [Acceptance Watch 002](/briefings/acceptance-watch-002-eight-files-four-downstream-tests/) and [Repeat Operation Watch 001](/briefings/repeat-operation-watch-001-what-counts-after-acceptance/).
`;
  text = text.replace(/\n## Phase 66 downstream review[\s\S]*$/, "");
  await writeFile(path, `${text.trimEnd()}\n\n${section}`, "utf8");
}

const update = {
  id: "update-2026-08-12-phase-66-acceptance-repeat-operation",
  effective_date: today,
  entry_type: "Signal Repair",
  title: "Phase 66 tests named files for acceptance and repeated operation",
  summary: "Sixty-four Phase 65 named-file records now have record-level downstream classifications, and all eight files have explicit validation, acceptance, recurring-operation, and comparable-outcome decisions. Eight dossiers, two reader guides, and one dependency map publish without changing an underlying evidence state.",
  affected_record_ids: [...fileSpecs.map((spec) => spec.briefing_id), ...crossBriefings.map((briefing) => briefing.id), dependencyMap.id],
  related_paths: ["/briefings/", "/atlas/dependency-maps/acceptance-is-not-repeat-operation/", "/atlas/local-systems/", "/atlas/pathways/"],
  evidence_note: "Phase 66 reuses the sixty-four Phase 65 named-file reviews and preserves their official source identities. It records one Evidence Present, four Partial/Held, and twenty-seven Not Established downstream decisions with zero matrix advances.",
  receipt_type: "No Material Change",
  materiality: "No record-state change",
  source_checked_date: today,
  decision_date: today,
  prior_state: "Phase 65 exposed eight reporting packs but did not apply one explicit downstream qualification test to every record.",
  current_state: "Every named-file record is classified as same-entity downstream evidence, stage-adjacent or held, or context only; every file has four exact downstream decisions and a Published dossier.",
  publication_effect: "Adds eight Published acceptance dossiers, two Published reader guides, one Published dependency map, one update, and no source, signal, receipt, event, gate, matrix, export, score, ranking, or operating-outcome change.",
  work_package: "docs/work-packages/phase-66-acceptance-repeated-operation.md"
};
await writeJson(join(contentRoot, "updates", "2026-08-12-phase-66-acceptance-repeat-operation.json"), update);

console.log(`Phase 66 content built: ${recordReviews.length} record reviews, ${stageDecisions.length} downstream decisions (${decisionCounts["Evidence Present"]} Evidence Present / ${decisionCounts["Partial / Held"]} Partial or Held / ${decisionCounts["Not Established"]} Not Established), 8 dossiers, 2 cross-file guides, 1 map, and 0 matrix advances.`);
