import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const effectiveDate = "2026-08-30";
const disposition = "Prepared — no exact artifact admitted";
const readJson = async (...parts) => JSON.parse(await readFile(join(...parts), "utf8"));
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const authorityGraph = await readJson(appRoot, "src", "data", "phase-117-global-authority-graph.json");
const coverage = await readJson(appRoot, "src", "data", "phase-116-coverage-architecture.json");

const stageIdByLabel = new Map(coverage.conversion_stages.map((stage) => [stage.label, stage.stage_id]));
const questionsByTopic = new Map(coverage.coverage_matrix.map((row) => [
  row.topic_id,
  coverage.priority_questions.filter((question) => row.priority_question_ids.includes(question.question_id)),
]));

const commonCaptureMetadata = [
  "Exact artifact title as published",
  "Issuing institution and accountable sub-unit",
  "Canonical official artifact URL rather than the institutional landing page",
  "Publication, decision, observation, or release date shown by the artifact",
  "FTFN capture date and reviewer identity",
  "Named geography, entity, facility, project, service, or cohort",
  "Claim type and the conversion stage the artifact can directly support",
  "Observed period, unit, denominator, method, and revision where measurement is present",
  "Stable document, dataset, docket, table, release, or decision identifier",
  "Language, translation state, access limitation, and archived-copy status",
  "Explicit evidence limit and the next claim the artifact does not establish",
  "Source-record ID assigned only after artifact-level review",
];

const commonAdmissibilityTests = [
  "The opened object is an exact official artifact, not only an institution, portal, search result, topic page, or document-family landing page.",
  "The issuing authority, artifact identity, date, geography, entity scope, and claim scope are visible and internally consistent.",
  "The artifact directly supports the proposed claim type and conversion stage without inference from an earlier or adjacent stage.",
  "Any quantity preserves its original unit, denominator, observation period, method, revision, and stated uncertainty.",
  "A reviewer can record a bounded conclusion and a stopping point without inferring external nonexistence from a failed search.",
];

const commonInvalidSubstitutions = [
  "Institutional homepage or portal identity substituted for the exact report, dataset, docket, filing, permit, inspection, acceptance, or operating record.",
  "Search-result snippet, navigation label, metadata card, media summary, or third-party restatement substituted for the official artifact.",
  "Announcement, plan, target, award, or authorization substituted for implementation, validation, acceptance, repeated operation, adoption, or outcome.",
  "Aggregate national or system context substituted for a named place, project, asset, operator, service, or receiving cohort.",
  "Forecast, modelled scenario, capacity value, or self-reported milestone substituted for an observed and method-bounded result.",
  "A later revision silently combined with an earlier series, definition, geography, or denominator.",
];

const targetTemplates = {
  "Official statistics and measurement": [
    {
      kind: "current-release",
      label: "Current official statistical release",
      purpose: "Locate a dated release that fixes the relevant baseline, observation period, geography, and published measure.",
      admissibility: "Admit only a named release or bulletin whose issuer, release date, measured scope, and underlying table or series are identifiable.",
      invalid: "A portal homepage, dashboard screenshot, unsourced chart, or general statistical theme page is not the release.",
    },
    {
      kind: "machine-readable-series",
      label: "Machine-readable time series or table",
      purpose: "Locate the official downloadable table, API series, or dataset that preserves periods, units, denominators, revisions, and stable identifiers.",
      admissibility: "Admit only when the official table or series identifier, variable definitions, periods, units, and download or API path are visible.",
      invalid: "A prose summary, single chart image, third-party mirror, or extracted number without its table identity is not a machine-readable series.",
    },
    {
      kind: "methodology-note",
      label: "Methodology, definitions, and quality note",
      purpose: "Locate the official method record needed to interpret population, coverage, sampling, seasonal treatment, uncertainty, and comparability.",
      admissibility: "Admit only an issuer-controlled methodology or metadata artifact tied to the named release, table, survey, account, or series.",
      invalid: "A generic glossary or unrelated methods page cannot supply missing definitions for the selected series.",
    },
    {
      kind: "revision-calendar",
      label: "Revision history or release calendar",
      purpose: "Locate the official revision, correction, release-calendar, or version record needed to maintain the evidence over time.",
      admissibility: "Admit only a dated revision notice, release schedule, version history, or correction explicitly governing the selected statistical family.",
      invalid: "An undated update-frequency statement or inferred cadence is not a revision or release record.",
    },
  ],
  "Energy, utility and system operation": [
    {
      kind: "authority-plan",
      label: "Current governing rule, licence, or system plan",
      purpose: "Locate the exact authority artifact that defines the operator, obligation, planning boundary, or regulated system state.",
      admissibility: "Admit only the issued rule, licence, order, approved plan, or equivalent official artifact with a visible date and governed scope.",
      invalid: "A consultation page, policy announcement, draft without status, or institutional mandate is not the operative authority artifact.",
    },
    {
      kind: "capacity-register",
      label: "Asset, project, or system-capacity register",
      purpose: "Locate the official register or dataset that identifies named assets, projects, capacities, connection states, and effective dates.",
      admissibility: "Admit only a register, queue, inventory, or dataset with stable entity identity, capacity definition, status field, and observation date.",
      invalid: "Announced nameplate capacity, a map marker, or an aggregate target cannot substitute for the official register entry.",
    },
    {
      kind: "operating-series",
      label: "Operating, dispatch, production, or demand series",
      purpose: "Locate repeated official observations that can establish operation or output over a declared interval.",
      admissibility: "Admit only observations with stable asset or system identity, timestamp or period, unit, denominator where relevant, method, and revision state.",
      invalid: "Installed capacity, commissioning, one event, or a forecast cannot establish recurring operation.",
    },
    {
      kind: "reliability-acceptance",
      label: "Reliability, adequacy, acceptance, or performance report",
      purpose: "Locate the official evaluation that distinguishes accepted service, recurring performance, deficiencies, and measured system consequences.",
      admissibility: "Admit only a dated report or decision with a named system or asset, assessment method, period, metrics, and unresolved limitations.",
      invalid: "Operator marketing, aggregate capacity, or a single successful test cannot substitute for accepted or repeated performance evidence.",
    },
  ],
  "Infrastructure, environment and territorial delivery": [
    {
      kind: "project-register",
      label: "Named project or assessment register entry",
      purpose: "Locate the official record that fixes project identity, proponent, geography, authority file, and current procedural state.",
      admissibility: "Admit only a stable official project, assessment, planning, procurement, or environmental register entry with a file identifier.",
      invalid: "A search result, press release, map pin, or similarly named project is not the canonical register record.",
    },
    {
      kind: "decision-permit",
      label: "Decision, permit, authorization, or condition set",
      purpose: "Locate the executed authority artifact and its conditions without treating permission as implementation or operation.",
      admissibility: "Admit only an issued decision, permit, authorization, order, by-law, or condition schedule with status, date, and named scope.",
      invalid: "An application, recommendation, agenda item, consultation, or draft is not an enacted or issued authority decision.",
    },
    {
      kind: "delivery-record",
      label: "Procurement, finance, construction, or implementation record",
      purpose: "Locate the exact artifact that establishes a bounded delivery step after authority and before acceptance.",
      admissibility: "Admit only a contract, award, financing close, notice to proceed, construction filing, progress certificate, or equivalent named implementation record.",
      invalid: "Budget authority, announced funding, planned schedule, or proposed scope is not evidence that work occurred.",
    },
    {
      kind: "completion-acceptance",
      label: "Inspection, completion, acceptance, or service-entry record",
      purpose: "Locate the receiving or inspecting authority record that identifies what was completed, tested, accepted, opened, or cut over.",
      admissibility: "Admit only a dated inspection, completion certificate, acceptance decision, occupancy record, commissioning acceptance, or service-entry artifact with named scope.",
      invalid: "Construction progress, ceremonial opening, contractor assertion, or authorization to begin does not establish formal acceptance or repeated service.",
    },
  ],
  "Science, technology and industrial innovation": [
    {
      kind: "program-authority",
      label: "Program authority, call, or technical scope",
      purpose: "Locate the official program instrument that fixes objectives, eligibility, technical scope, evaluation rules, and decision authority.",
      admissibility: "Admit only an issued program document, call, strategy instrument, standardization mandate, or technical scope with a visible version and date.",
      invalid: "An institutional mission statement, news story, topic page, or aspiration is not the operative program instrument.",
    },
    {
      kind: "award-recipient",
      label: "Award, recipient, procurement, or funded-project record",
      purpose: "Locate the official transaction or award artifact that identifies recipient, amount or instrument, scope, and award date.",
      admissibility: "Admit only a named official award, agreement, contract, grant, recipient register, or procurement record with stable identifiers.",
      invalid: "Program authorization, available funding, applicant intent, or aggregate portfolio value does not prove a named award or obligation.",
    },
    {
      kind: "technical-result",
      label: "Technical result, validation, or evaluation report",
      purpose: "Locate a result artifact with a named system, task, method, comparator, metric, limitation, and publication date.",
      admissibility: "Admit only an official technical report, evaluation, test record, dataset, or reviewed result whose method and measured scope are inspectable.",
      invalid: "A capability claim, demonstration announcement, abstract, award description, or forecast is not a validated result.",
    },
    {
      kind: "adoption-standard",
      label: "Standard, trial acceptance, adoption, or repeated-use record",
      purpose: "Locate the institutional record that distinguishes a published standard or trial from accepted and repeated use.",
      admissibility: "Admit only a dated standard/version, conformance decision, acceptance record, procurement adoption, operating report, or repeated-use artifact with named scope.",
      invalid: "Standard publication, pilot launch, partnership, or claimed readiness alone does not establish adoption, conformity, recurring use, or outcome.",
    },
  ],
};

const acquisitionPackets = authorityGraph.rails.map((rail, packetIndex) => {
  const templates = targetTemplates[rail.authority_class];
  if (!templates) throw new Error(`No Phase 120 target template for ${rail.authority_class}.`);

  const conversionStageIds = rail.conversion_stages.map((label) => {
    const stageId = stageIdByLabel.get(label);
    if (!stageId) throw new Error(`No Phase 116 stage ID for Phase 117 label: ${label}.`);
    return stageId;
  });
  const priorityQuestionIds = [...new Set(rail.topic_ids
    .flatMap((topicId) => questionsByTopic.get(topicId) ?? [])
    .filter((question) => question.target_stage_ids.some((stageId) => conversionStageIds.includes(stageId)))
    .map((question) => question.question_id))];

  return {
    packet_id: `120-PACKET-${String(packetIndex + 1).padStart(3, "0")}`,
    packet_slug: rail.slug,
    rail_id: rail.rail_id,
    source_id: rail.source_id,
    jurisdiction_id: rail.jurisdiction_id,
    jurisdiction_name: rail.jurisdiction_name,
    institution_name: rail.institution_name,
    authority_class: rail.authority_class,
    topic_ids: rail.topic_ids,
    conversion_stage_ids: conversionStageIds,
    official_entry_path: {
      url: rail.official_url,
      label: `${rail.institution_name} official entry point`,
      path_state: "Candidate discovery entry — exact artifact not selected",
      boundary: "The entry path identifies where an official artifact may be found. It is not itself an admitted artifact or evidence decision.",
    },
    required_capture_metadata: commonCaptureMetadata,
    admissibility_tests: commonAdmissibilityTests,
    invalid_substitutions: commonInvalidSubstitutions,
    disposition: {
      status: disposition,
      disposition_date: effectiveDate,
      artifacts_admitted: 0,
      source_records_created: 0,
      signal_records_created: 0,
      completion_state: "Identified",
      note: "Phase 120 prepares the acquisition contract only. No official artifact was opened, reviewed, captured, or admitted by this packet build.",
    },
    artifact_targets: templates.map((template, targetIndex) => ({
      target_id: `120-TARGET-${String(packetIndex * 4 + targetIndex + 1).padStart(3, "0")}`,
      target_order: targetIndex + 1,
      target_kind: template.kind,
      target_label: `${rail.institution_name}: ${template.label}`,
      purpose: template.purpose,
      applicable_conversion_stage_ids: conversionStageIds,
      admissibility_test: template.admissibility,
      invalid_substitution: template.invalid,
      review_state: "Prepared target — exact artifact not reviewed",
      exact_artifact_title: null,
      exact_artifact_url: null,
      exact_artifact_source_id: null,
    })),
    mission_linkage: {
      phase: 121,
      linkage_status: "Placeholder — Phase 121 mission registry not yet published",
      priority_question_ids: priorityQuestionIds,
      phase_121_mission_ids: [],
      linkage_rule: "Phase 121 may assign a packet to a mission only by exact topic, evidence need, and conversion-stage fit; this placeholder creates no mission outcome.",
    },
    stop_rule: "Stop at the prepared acquisition contract. Do not treat the portal, target description, failed search, metadata card, or adjacent document as an exact artifact, evidence decision, observation, receipt, stage advance, operation, outcome, score, or ranking.",
    next_trigger: "A dated human review opens the official entry path for a named Phase 121 mission and records an exact-artifact admission, bounded no-find, or access blocker without inferring nonexistence.",
    owner: {
      owner_id: "120-OWNER-AUTHORITY-ACQUISITION-DESK",
      role: "FTFN authority acquisition and evidence-admission reviewer",
      responsibility: "Resolve exact artifact identity, preserve claim and conversion boundaries, record the dated disposition, and route any admitted artifact through normal source and signal review.",
    },
    routes: {
      authority_rail: `/review/authority/rails/${rail.slug}/`,
      fieldbook_hub: "/review/fieldbook/acquisition/",
      data: "/data/phase-120-evidence-acquisition-packets.json",
    },
  };
});

const registry = {
  schema_version: "1.0",
  program_id: "FTFN-V0.5-PHASE-120-EVIDENCE-ACQUISITION-PACKETS",
  phase: 120,
  title: "Authority-to-artifact acquisition packets",
  effective_date: effectiveDate,
  record_status: "Published",
  preparation_state: disposition,
  summary: "Eighty rail-specific acquisition packets turn the Phase 117 authority graph into an actionable fieldbook with four bounded artifact targets per rail while admitting no artifact and changing no evidence state.",
  publication_boundary: "Phase 120 prepares acquisition instructions. It does not claim that a target artifact exists, admit a source, create a signal, operate a dated evidence gate, advance a conversion stage, or establish an observation, outcome, score, ranking, or comparison.",
  counts: {
    acquisition_packets: acquisitionPackets.length,
    artifact_targets: acquisitionPackets.reduce((sum, packet) => sum + packet.artifact_targets.length, 0),
    targets_per_packet: 4,
    jurisdictions: new Set(acquisitionPackets.map((packet) => packet.jurisdiction_id)).size,
    authority_classes: new Set(acquisitionPackets.map((packet) => packet.authority_class)).size,
    topics_linked: new Set(acquisitionPackets.flatMap((packet) => packet.topic_ids)).size,
    conversion_stages_linked: new Set(acquisitionPackets.flatMap((packet) => packet.conversion_stage_ids)).size,
    candidate_source_records_preserved: acquisitionPackets.length,
    source_records_added: 0,
    signal_records_added: 0,
    exact_artifacts_admitted: 0,
    enhanced_existing_authority_routes: acquisitionPackets.length,
    new_html_routes: 1,
    public_json_exports: 1,
  },
  disposition_contract: {
    allowed_phase_120_disposition: disposition,
    interpretation: "Prepared means that the target, metadata, tests, substitutions, stop rule, trigger, and owner are specified. It does not mean acquired, reviewed, admitted, unavailable, or nonexistent.",
  },
  required_capture_metadata: commonCaptureMetadata,
  admissibility_principles: commonAdmissibilityTests,
  invalid_substitution_principles: commonInvalidSubstitutions,
  routes: {
    hub: "/review/fieldbook/acquisition/",
    data: "/data/phase-120-evidence-acquisition-packets.json",
    enhanced_route_pattern: "/review/authority/rails/{phase-117-rail-slug}/",
  },
  acquisition_packets: acquisitionPackets,
};

await writeJson(join(appRoot, "src", "data", "phase-120-evidence-acquisition-packets.json"), registry);

await writeJson(join(appRoot, "src", "content", "updates", "2026-08-30-phase-120-evidence-acquisition-packets.json"), {
  id: "update-2026-08-30-phase-120-evidence-acquisition-packets",
  effective_date: effectiveDate,
  entry_type: "Source Refresh",
  title: "Phase 120 prepares the authority-to-artifact fieldbook",
  summary: "Eighty Candidate authority rails now carry four explicit acquisition targets, capture requirements, admission tests, invalid substitutions, owners, stopping boundaries, and Phase 121 linkage placeholders.",
  affected_record_ids: acquisitionPackets.map((packet) => packet.source_id),
  related_paths: ["/review/fieldbook/acquisition/", "/review/authority/", "/data/phase-120-evidence-acquisition-packets.json"],
  evidence_note: "Every packet is Prepared — no exact artifact admitted. The eighty Phase 117 portal records remain Candidate and no new source, signal, receipt, gate decision, observation, outcome, score, or ranking is created.",
  materiality: "No record-state change",
  publication_effect: "Adds one acquisition-fieldbook hub, one public JSON registry, and Phase 120 acquisition sections on eighty existing authority-rail routes.",
  work_package: "docs/work-packages/phase-120-v05-evidence-acquisition-packets.md",
});

const workPackage = `# Phase 120 — Authority-to-artifact acquisition packets

**Status:** Complete
**Effective date:** ${effectiveDate}
**Program:** FTFN v0.5 — The Evidence Fieldbook

## Objective

Turn all eighty Phase 117 Candidate authority rails into explicit, reviewable acquisition contracts without pretending that a portal is an artifact or that a target has already been acquired. Each packet names four distinct artifact targets, the metadata and tests needed for admission, invalid substitutions, a dated preparation disposition, an owner, a stopping boundary, a next trigger, and the Phase 116 questions that a later Phase 121 mission may assign.

## Delivered

- ${acquisitionPackets.length} authority-to-artifact acquisition packets, one for every Phase 117 rail.
- ${registry.counts.artifact_targets} distinct targets, exactly four per packet.
- Exact joins to ${registry.counts.candidate_source_records_preserved} Candidate source records, ${registry.counts.jurisdictions} jurisdiction layers, ${registry.counts.authority_classes} authority classes, ${registry.counts.topics_linked} topics, and ${registry.counts.conversion_stages_linked} canonical conversion stages.
- Twelve required capture fields, five common admissibility tests, and six invalid-substitution controls on every packet.
- Phase 121 linkage placeholders drawn from the existing 68 Phase 116 priority questions.
- One public acquisition hub, one machine-readable JSON endpoint, and materially expanded sections on all eighty existing authority-rail pages.
- A deterministic builder, independent assertion script, and dated public update.

## Preparation state

Every packet is **${disposition}**. Phase 120 did not browse for, open, capture, assess, or admit an exact official artifact. It did not infer that an artifact exists or does not exist. A later dated human review must record an exact-artifact admission, bounded no-find, or access blocker against a named mission.

The original eighty Phase 117 source records remain \`Candidate\`. An institutional portal cannot be promoted as though it were the exact report, dataset, docket, filing, permit, inspection, acceptance, operating, or outcome record. Any admitted artifact requires its own reviewed source identity.

## Public surfaces

- \`/review/fieldbook/acquisition/\`
- \`/data/phase-120-evidence-acquisition-packets.json\`
- Eighty enriched \`/review/authority/rails/{slug}/\` routes inherited from Phase 117

The hub is the only new HTML route. The eighty packet-bearing rail routes already existed and are counted as enhanced surfaces, not new routes.

## Completion standard

Phase 120 is complete when every Phase 117 rail and Candidate source resolves exactly once; every packet carries four unique target kinds and all required control fields; all 320 targets remain explicitly unreviewed with no exact artifact identity; all Phase 121 links remain placeholders over valid Phase 116 question IDs; all future Phase 60 decisions and receipts remain untouched; the hub, data endpoint, work package, update, and enriched rail template exist; and phase-local assertions and Astro checking pass.

## Verification

From \`app/\`:

\`\`\`text
node ./scripts/build-phase120-evidence-acquisition-packets.mjs
node ./scripts/assert-phase120.mjs
npm run check
\`\`\`
`;

await writeFile(join(workspaceRoot, "docs", "work-packages", "phase-120-v05-evidence-acquisition-packets.md"), workPackage, "utf8");

console.log(`Phase 120 built: ${acquisitionPackets.length} packets, ${registry.counts.artifact_targets} prepared targets, zero admitted artifacts.`);
