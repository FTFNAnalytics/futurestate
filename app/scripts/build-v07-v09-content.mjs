import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(appRoot, "..");
const dataRoot = join(appRoot, "src", "data");
const sourceRoot = join(appRoot, "src", "content", "sources");
const updateRoot = join(appRoot, "src", "content", "updates");
const docsRoot = join(workspaceRoot, "docs");
const workPackageRoot = join(docsRoot, "work-packages");
const effectiveDate = "2026-08-30";

const readJson = async (name) => JSON.parse(await readFile(join(dataRoot, name), "utf8"));
const readOptionalJson = async (name) => {
  try {
    return await readJson(name);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
};
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
const unique = (items) => [...new Set(items.filter(Boolean))];
const byId = (items, key) => new Map(items.map((item) => [item[key], item]));
const phaseId = (phase, suffix) => `${phase}-${suffix}`;

await Promise.all([mkdir(updateRoot, { recursive: true }), mkdir(workPackageRoot, { recursive: true })]);

const [missions, audits, atlas, biographies, topicReviews, dossiers, syntheses, authority, acquisition, cycle, legacyPanelsA, legacyPanelsB, measurementRegistry, observationRegistry] = await Promise.all([
  readJson("phase-121-priority-research-missions.json"),
  readJson("phase-126-mission-evidence-audits.json"),
  readJson("phase-119-deep-project-place-atlas.json"),
  readJson("phase-127-project-place-conversion-biographies.json"),
  readJson("phase-128-topic-state-of-evidence-reviews.json"),
  readJson("phase-123-comparative-delivery-dossiers.json"),
  readJson("phase-129-cross-system-evidence-syntheses.json"),
  readJson("phase-117-global-authority-graph.json"),
  readJson("phase-120-evidence-acquisition-packets.json"),
  readJson("phase-60-operating-cycle.json"),
  readJson("phase-56b-entity-panels.json"),
  readJson("phase-56e-second-cohort-panels.json"),
  readJson("phase-69-measurement-observation-break-registry.json"),
  readJson("phase-70-observation-review-series-admission-registry.json"),
]);
const [localValidationReceipt, existingP133, existingP134, existingP143] = await Promise.all([
  readOptionalJson("phase-144-local-validation-receipt.json"),
  readOptionalJson("phase-133-requirement-adjudication-board.json"),
  readOptionalJson("phase-134-mission-decision-register.json"),
  readOptionalJson("phase-143-editorial-cadence-editions.json"),
]);
const localValidationPassed = localValidationReceipt?.status === "Passed" && localValidationReceipt?.validated_date === effectiveDate;

const sourceFiles = (await readdir(sourceRoot)).filter((name) => name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map(async (name) => JSON.parse(await readFile(join(sourceRoot, name), "utf8"))));
const sourceMap = byId(sources, "id");
const missionMap = byId(missions.missions, "mission_id");
const auditMap = byId(audits.mission_audits, "mission_id");
const projectBioMap = byId(biographies.project_biographies, "atlas_project_id");
const placeBioMap = byId(biographies.place_biographies, "atlas_place_id");

const publicationBoundaries = [
  "AI-assisted source triage can map exact artifacts and expose their limits, but it cannot stand in for the repository's required human admissibility decision.",
  "A source-check receipt proves only that the named official artifact was inspected on the stated date; it does not admit the artifact, satisfy a requirement, or answer a mission.",
  "No project stage, place state, comparison verdict, observation, outcome, score, rank, causal finding, recommendation, or future Phase 60 decision is created.",
  "A repository-bounded gap says what this reviewed corpus has not established; it never asserts that qualifying evidence does not exist elsewhere.",
];

const phaseMeta = {
  130: ["Authority-gap closure maps", "Map every uncovered mission to its present official-source shelf, missing authority role, and next acquisition action."],
  131: ["Priority evidence admission dockets", "Assemble eighteen requirement-specific dockets for six high-value missions without treating a candidate artifact as admitted evidence."],
  132: ["Dated source-check receipts", "Publish inspectable receipts for the official artifacts reviewed during triage and retain the owner-decision boundary."],
  133: ["Requirement adjudication board", "Place all eighteen requirements on one decision board with acceptance tests, rejection risks, and explicit pending-owner states."],
  134: ["Mission decision register", "Give each priority mission a complete decision packet while keeping every answer unadjudicated until owner review."],
  135: ["Atlas conversion-readiness audit", "Audit all thirty-nine Atlas identities for content-conversion readiness without reading readiness as project performance."],
  136: ["Named project chronicles", "Publish twenty-four stage-bounded project chronicles with exact evidence rails, turning points, and next artifacts."],
  137: ["Place delivery ledgers", "Publish fifteen place ledgers that separate receiving-system context from the stages of projects located inside each place."],
  138: ["Longitudinal evidence eligibility", "Test all thirty-nine Atlas records for stable identity, period, measure, and denominator prerequisites without manufacturing a series."],
  139: ["Comparative dossier re-review", "Re-review all twelve comparison passports against the new chronicles and ledgers while preserving Context only."],
  140: ["Living topic desks", "Turn all seventeen topic reviews into maintained public desks with current reads, open missions, watch queues, and reader paths."],
  141: ["Frontier systems almanac", "Create one inspectable almanac entry for every topic, project, and place in the v0.9 public intelligence layer."],
  142: ["Topic delivery roadmaps", "Give every topic a four-horizon evidence roadmap with exact missions, stopping rules, and next editorial actions."],
  143: ["Editorial cadence and editions", "Publish the inaugural v0.9 desk edition and a transparent four-edition forward schedule without predating future content."],
  144: ["v1 launch-candidate audit", "Audit the complete v0.7-v0.9 system against evidence, conversion, longitudinal, editorial, accessibility, and release gates."],
};

const routeByPhase = {
  130: "/review/v07/authority-gaps/", 131: "/review/v07/admission-dockets/", 132: "/review/v07/source-checks/", 133: "/review/v07/requirements/", 134: "/review/v07/missions/",
  135: "/review/v08/readiness/", 136: "/review/v08/projects/", 137: "/review/v08/places/", 138: "/review/v08/longitudinal/", 139: "/review/v08/comparisons/",
  140: "/review/v09/desks/", 141: "/review/v09/almanac/", 142: "/review/v09/roadmaps/", 143: "/review/v09/editions/", 144: "/review/v09/launch-audit/",
};

const exportNameByPhase = {
  130: "phase-130-authority-gap-closure-maps.json",
  131: "phase-131-priority-evidence-admission-dockets.json",
  132: "phase-132-dated-source-check-receipts.json",
  133: "phase-133-requirement-adjudication-board.json",
  134: "phase-134-mission-decision-register.json",
  135: "phase-135-atlas-conversion-readiness-audit.json",
  136: "phase-136-named-project-chronicles.json",
  137: "phase-137-place-delivery-ledgers.json",
  138: "phase-138-longitudinal-evidence-eligibility.json",
  139: "phase-139-comparative-dossier-rereview.json",
  140: "phase-140-living-topic-desks.json",
  141: "phase-141-frontier-systems-almanac.json",
  142: "phase-142-topic-delivery-roadmaps.json",
  143: "phase-143-editorial-cadence-editions.json",
  144: "phase-144-v1-launch-candidate-audit.json",
};

const makeRegistry = (phase, extra) => ({
  schema_version: "1.0",
  phase,
  program_id: `FTFN-PHASE-${phase}`,
  dataset: exportNameByPhase[phase].replace(/\.json$/, "").replaceAll("-", "_"),
  title: phaseMeta[phase][0],
  effective_date: effectiveDate,
  record_status: "Published",
  build_status: "Complete locally",
  summary: phaseMeta[phase][1],
  record_scope: `${phaseMeta[phase][0]} records governed by the stated publication boundaries.`,
  publication_boundaries: publicationBoundaries,
  routes: { hub: routeByPhase[phase], public_export: `/data/${exportNameByPhase[phase]}` },
  ...extra,
});

const priorityMissionIds = ["121-MISSION-004", "121-MISSION-013", "121-MISSION-016", "121-MISSION-025", "121-MISSION-049", "121-MISSION-060"];
const gapMissions = missions.missions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0);

const evidencePlans = {
  "121-MISSION-004": [
    { source_ids: ["source-56k-f15ex-ex16-portland-receipt-2026"], triage: "Candidate identity context", note: "The official receipt fixes one F-15EX tail, receiving wing, and arrival date. It does not establish a stable product-and-facility denominator for an outcome series." },
    { source_ids: [], triage: "Acquisition gap", note: "No exact multi-period operating series is mapped in the reviewed mission shelf." },
    { source_ids: ["source-56l-monaghan-medical-ccida-fye2025"], triage: "Candidate reporting context", note: "The certified annual report supplies a reporting period and attribution limits for a different named facility; it does not supply product downtime, revision, or operating-series evidence for the broader mission." },
  ],
  "121-MISSION-013": [
    { source_ids: ["source-56k-f15ex-ex16-portland-receipt-2026"], triage: "Candidate exact identity artifact", note: "The official record names F-15EX tail 16, the 142nd Wing, Portland, and a receiving date; owner review must still decide whether that bounded identity satisfies the mission requirement." },
    { source_ids: ["source-faa-powered-lift-final-rule-2024"], triage: "Adjacent authority artifact", note: "The final rule defines powered-lift pilot certification and operating pathways, not a named fleet's capacity or readiness baseline." },
    { source_ids: ["source-faa-powered-lift-final-rule-2024"], triage: "Adjacent period artifact", note: "The rule has a dated ten-year regulatory framework, but a regulatory period is not a current operating period for a named fleet, airport, or route." },
  ],
  "121-MISSION-016": [
    { source_ids: ["source-56a-dot-atcr-2022", "source-56a-dot-atcr-2023", "source-56a-dot-atcr-2024"], triage: "Candidate service-quality series", note: "The DOT reports expose carrier service-quality measures and reporting bases. They do not, without a mission-specific denominator review, establish exposure-compatible aviation safety outcomes." },
    { source_ids: ["source-56a-dot-atcr-2022", "source-56a-dot-atcr-2023", "source-56a-dot-atcr-2024"], triage: "Candidate multi-period context", note: "The annual shelves contain monthly reporting periods, but route or fleet identity compatibility has not been established." },
    { source_ids: [], triage: "Acquisition gap", note: "No exact environmental-and-access denominator artifact is mapped in the reviewed mission shelf." },
  ],
  "121-MISSION-025": [
    { source_ids: ["source-doe-thacker-pass-loan-2024", "source-blm-rhyolite-ridge-rod-2024"], triage: "Candidate exact identity artifacts", note: "The official artifacts distinguish Thacker Pass from Rhyolite Ridge and name lithium or lithium-boron project scope. They cannot be silently merged into one asset baseline." },
    { source_ids: ["source-doe-thacker-pass-loan-2024"], triage: "Candidate forecast-definition artifact", note: "DOE states an expected fully operational capacity. That is a source-defined forecast, not a current operating-capacity observation." },
    { source_ids: ["source-blm-rhyolite-ridge-rod-2024"], triage: "Candidate authority-state artifact", note: "The BLM record documents federal approval and conditions. Authorization does not establish construction, commissioning, compliance performance, or operation." },
  ],
  "121-MISSION-049": [
    { source_ids: ["source-cpuc-waymo-al2-disposition-2024", "source-cpuc-av-advice-letter-status-2026"], triage: "Candidate exact service-identity artifacts", note: "The CPUC records identify Waymo, approved advice letters, deployment territory or ODD, and effective dates. This is authorization identity, not proof of trip volume or quality." },
    { source_ids: ["source-cpuc-waymo-al2-disposition-2024"], triage: "Candidate ODD context", note: "An operational design domain bounds authorized service conditions but does not expose the trip, passenger, fleet-hour, or geographic-service denominator required by the mission." },
    { source_ids: ["source-cpuc-waymo-al2-disposition-2024", "source-cpuc-av-advice-letter-status-2026"], triage: "Adjacent authorization artifacts", note: "Approvals and filing status do not establish a current reliability, accessibility, affordability, safety, or service-quality baseline." },
  ],
  "121-MISSION-060": [
    { source_ids: ["source-nist-pqc"], triage: "Inadmissible-subject warning", note: "The NIST artifact concerns post-quantum cryptography standards, not a stable quantum-computing task-and-system outcome denominator." },
    { source_ids: ["source-nist-pqc", "source-omb-m-26-15-pqc-migration"], triage: "Inadmissible-subject warning", note: "Standards and federal migration plans are cybersecurity adoption evidence. They do not document multi-period accepted use of quantum computing." },
    { source_ids: ["source-nist-pqc", "source-omb-m-26-15-pqc-migration"], triage: "Boundary context only", note: "The sources explicitly separate a future cryptographically relevant quantum-computer risk from current PQC migration. That boundary is useful context but not a quantum outcome observation." },
  ],
};

const phase130Records = gapMissions.map((mission, index) => ({
  gap_map_id: phaseId(130, `GAP-${String(index + 1).padStart(3, "0")}`),
  mission_id: mission.mission_id,
  topic_id: mission.topic_id,
  slug: mission.slug,
  title: mission.title,
  gap_type: "No Phase 120 packet joins both topic and target conversion stage",
  current_source_ids: mission.relationships.context_source_ids,
  current_signal_ids: mission.relationships.context_signal_ids,
  priority_docket: priorityMissionIds.includes(mission.mission_id),
  map_state: priorityMissionIds.includes(mission.mission_id) ? "Priority admission path assembled" : "Authority gap mapped — acquisition remains open",
  missing_authority_role: `An official artifact directly satisfying ${mission.research_contract.required_evidence.join("; ")} under the stored identity, period, method, and denominator contract.`,
  next_action: priorityMissionIds.includes(mission.mission_id)
    ? `Use Phase 131 to inspect requirement-specific candidates and retain owner adjudication for ${mission.mission_id}.`
    : `Acquire an exact official artifact for the target stage before opening a mission-specific admissibility review for ${mission.mission_id}.`,
  route: `${routeByPhase[130]}#${mission.slug}`,
}));

const p130 = makeRegistry(130, {
  decision_state: "Mapping complete — evidence acquisition remains open",
  counts: { gap_missions: 12, priority_paths: 6, acquisition_paths_open: 12, artifacts_admitted: 0, mission_answers_created: 0 },
  gap_maps: phase130Records,
});

const dockets = priorityMissionIds.map((missionId, missionIndex) => {
  const mission = missionMap.get(missionId);
  const audit = auditMap.get(missionId);
  return {
    docket_id: phaseId(131, `DOCKET-${String(missionIndex + 1).padStart(3, "0")}`),
    mission_id: missionId,
    slug: mission.slug,
    title: mission.title,
    question: mission.research_contract.question,
    completion_rule: mission.research_contract.completion_rule,
    upstream_answer_state: mission.answer_state,
    requirements: mission.research_contract.required_evidence.map((requirement, requirementIndex) => {
      const plan = evidencePlans[missionId][requirementIndex];
      return {
        requirement_docket_id: phaseId(131, `REQ-${String(missionIndex + 1).padStart(2, "0")}-${String(requirementIndex + 1).padStart(2, "0")}`),
        requirement,
        phase_126_test_id: audit.requirement_tests[requirementIndex].test_id,
        phase_126_screen_state: audit.requirement_tests[requirementIndex].review_state,
        candidate_source_ids: plan.source_ids,
        candidate_artifacts: plan.source_ids.map((sourceId) => {
          const source = sourceMap.get(sourceId);
          return { source_id: sourceId, name: source.name, url: source.url, authority: source.source_owner ?? source.name, known_limitations: source.known_limitations ?? "No additional limitation recorded." };
        }),
        triage_state: plan.triage,
        triage_note: plan.note,
        owner_decision: "Pending required human adjudication",
        acceptance_test: `Confirm that one exact artifact directly establishes “${requirement}” for the mission's named subject, geography, period, method, and denominator.`,
        rejection_test: "Reject portals, discovery rails, subject adjacency, forecasts represented as observations, stage substitution, entity mismatch, and denominator mismatch.",
      };
    }),
    route: `${routeByPhase[131]}#${mission.slug}`,
  };
});

const allRequirements = dockets.flatMap((docket) => docket.requirements.map((requirement) => ({ docket, requirement })));
const p131 = makeRegistry(131, {
  review_authority: "Prepared by AI-assisted triage; admissibility remains owner-controlled.",
  counts: { mission_dockets: 6, requirement_dockets: 18, candidate_artifact_links: allRequirements.reduce((sum, item) => sum + item.requirement.candidate_source_ids.length, 0), owner_decisions_pending: 18, artifacts_admitted: 0 },
  admission_dockets: dockets,
});

const sourceCheckReceipts = allRequirements.map(({ docket, requirement }, index) => ({
  receipt_id: phaseId(132, `SOURCE-CHECK-${String(index + 1).padStart(3, "0")}`),
  source_checked_date: effectiveDate,
  mission_id: docket.mission_id,
  requirement_docket_id: requirement.requirement_docket_id,
  requirement: requirement.requirement,
  source_ids: requirement.candidate_source_ids,
  artifacts: requirement.candidate_artifacts,
  source_check_provenance: requirement.candidate_source_ids.map((sourceId) => ({
    source_id: sourceId,
    official_url: sourceMap.get(sourceId)?.url,
    source_last_checked_date: sourceMap.get(sourceId)?.last_checked_date,
  })),
  check_result: requirement.candidate_source_ids.length ? "Official artifact identity and access path inspected" : "No exact artifact mapped in current shelf",
  triage_state: requirement.triage_state,
  evidence_note: requirement.triage_note,
  admissibility_decision: "Not made — pending required human adjudication",
  admission_effect: "None",
  interpretation_boundary: "This receipt records the source check and triage boundary only. It is not an evidence-admission receipt.",
}));

const p132 = makeRegistry(132, {
  receipt_contract: "Dated source-check receipts are distinct from evidence-admission receipts.",
  counts: { source_check_receipts: 18, receipts_with_artifacts: sourceCheckReceipts.filter((receipt) => receipt.source_ids.length).length, bounded_no_artifact_receipts: sourceCheckReceipts.filter((receipt) => !receipt.source_ids.length).length, evidence_admission_receipts: 0 },
  source_check_receipts: sourceCheckReceipts,
});

const previousAdjudicationById = byId(existingP133?.adjudication_items ?? [], "adjudication_id");
const adjudicationItems = allRequirements.map(({ docket, requirement }, index) => {
  const adjudicationId = phaseId(133, `ADJUDICATION-${String(index + 1).padStart(3, "0")}`);
  const base = {
    adjudication_id: adjudicationId,
    mission_id: docket.mission_id,
    requirement_docket_id: requirement.requirement_docket_id,
    source_check_receipt_id: sourceCheckReceipts[index].receipt_id,
    requirement: requirement.requirement,
    candidate_source_ids: requirement.candidate_source_ids,
    triage_state: requirement.triage_state,
    acceptance_test: requirement.acceptance_test,
    rejection_test: requirement.rejection_test,
    decision_state: "Pending owner adjudication",
    accepted_source_ids: [],
    rejected_source_ids: [],
    decision_date: null,
    decision_receipt_id: null,
    next_action: "An authorized human reviewer must record Accepted, Rejected, Inadmissible, or Bounded gap with a dated decision receipt.",
  };
  const previous = previousAdjudicationById.get(adjudicationId);
  if (!previous || previous.decision_state === "Pending owner adjudication") return base;
  if (previous.mission_id !== base.mission_id || previous.requirement_docket_id !== base.requirement_docket_id) throw new Error(`${adjudicationId} changed identity; refusing to overwrite a governed owner decision.`);
  return { ...base, decision_state: previous.decision_state, accepted_source_ids: previous.accepted_source_ids, rejected_source_ids: previous.rejected_source_ids, decision_date: previous.decision_date, decision_receipt_id: previous.decision_receipt_id, next_action: previous.next_action };
});
const countDecisions = (state) => adjudicationItems.filter((item) => item.decision_state.toLowerCase() === state.toLowerCase()).length;

const p133 = makeRegistry(133, {
  decision_contract: "Every requirement has a complete adjudication packet; none has a fabricated decision.",
  counts: { requirements: 18, pending_owner_adjudication: countDecisions("Pending owner adjudication"), accepted: countDecisions("Accepted"), rejected: countDecisions("Rejected"), inadmissible: countDecisions("Inadmissible"), bounded_gap_decisions: countDecisions("Bounded gap") },
  adjudication_items: adjudicationItems,
});

const previousMissionDecisionById = byId(existingP134?.mission_decisions ?? [], "mission_decision_id");
const missionDecisions = dockets.map((docket, index) => {
  const missionDecisionId = phaseId(134, `MISSION-${String(index + 1).padStart(3, "0")}`);
  const requirementItems = adjudicationItems.filter((item) => item.mission_id === docket.mission_id);
  const base = {
    mission_decision_id: missionDecisionId,
    mission_id: docket.mission_id,
    slug: docket.slug,
    title: docket.title,
    question: docket.question,
    upstream_answer_state: docket.upstream_answer_state,
    requirement_adjudication_ids: requirementItems.map((item) => item.adjudication_id),
    requirements_total: 3,
    requirements_decided: requirementItems.filter((item) => item.decision_state !== "Pending owner adjudication").length,
    mission_decision_state: "Decision packet complete — mission answer remains unadjudicated",
    answer: null,
    decision_date: null,
    decision_receipt_id: null,
    current_read: evidencePlans[docket.mission_id].map((item) => item.note).join(" "),
    next_action: "Complete all three owner adjudications, then apply the stored mission completion rule without converting partial context into a complete answer.",
    route: `${routeByPhase[134]}${docket.slug}/`,
  };
  const previous = previousMissionDecisionById.get(missionDecisionId);
  if (!previous || (previous.answer === null && previous.decision_receipt_id === null)) return base;
  if (previous.mission_id !== base.mission_id) throw new Error(`${missionDecisionId} changed identity; refusing to overwrite a governed owner decision.`);
  return { ...base, mission_decision_state: previous.mission_decision_state, answer: previous.answer, decision_date: previous.decision_date, decision_receipt_id: previous.decision_receipt_id, current_read: previous.current_read, next_action: previous.next_action };
});

const p134 = makeRegistry(134, {
  release_state: `Decision architecture complete — ${missionDecisions.filter((decision) => decision.answer === null).length} owner decision(s) remain open`,
  counts: { mission_decision_packets: 6, answers_adjudicated: missionDecisions.filter((decision) => decision.answer !== null).length, owner_decisions_pending: missionDecisions.filter((decision) => decision.answer === null).length, canonical_missions_mutated: 0 },
  mission_decisions: missionDecisions,
});

const readinessRecords = [
  ...atlas.projects.map((record, index) => ({
    readiness_id: phaseId(135, `PROJECT-${String(index + 1).padStart(3, "0")}`), entity_kind: "project", entity_id: record.atlas_project_id, slug: record.slug, title: record.title,
    coverage_tier: record.coverage.tier_id, inherited_state: record.conversion.current_stage, signal_ids: record.evidence_rails.signal_ids, source_ids: record.evidence_rails.source_ids,
    content_readiness: record.coverage.tier_id === "Tier A" ? "Ready for governed project chronicle" : "Ready for curated project chronicle",
    readiness_basis: `${record.evidence_rails.signal_ids.length} signal links and ${record.evidence_rails.source_ids.length} source links resolve under the Phase 119 identity.`,
    blocking_boundary: record.conversion.unresolved, interpretation_boundary: "Content readiness is not project readiness, maturity, quality, safety, performance, or likely success.",
  })),
  ...atlas.places.map((record, index) => ({
    readiness_id: phaseId(135, `PLACE-${String(index + 1).padStart(3, "0")}`), entity_kind: "place", entity_id: record.atlas_place_id, slug: record.slug, title: record.title,
    coverage_tier: record.coverage.tier_id, inherited_state: record.conversion.current_stage, signal_ids: record.evidence_rails.signal_ids, source_ids: record.evidence_rails.source_ids,
    content_readiness: "Ready for place delivery ledger", readiness_basis: `${record.evidence_rails.signal_ids.length} signal links and ${record.evidence_rails.source_ids.length} source links resolve under the Phase 119 place identity.`,
    blocking_boundary: record.conversion.unresolved, interpretation_boundary: "A place ledger cannot inherit one project stage or convert evidence volume into a place-performance judgment.",
  })),
];

const p135 = makeRegistry(135, {
  readiness_definition: "Readiness to publish a bounded content record from resolved upstream IDs.",
  counts: { atlas_records: 39, projects: 24, places: 15, tier_a_records: readinessRecords.filter((record) => record.coverage_tier === "Tier A").length, tier_b_records: readinessRecords.filter((record) => record.coverage_tier === "Tier B").length, project_or_place_stage_advances: 0 },
  readiness_records: readinessRecords,
});

const projectChronicles = atlas.projects.map((project, index) => {
  const bio = projectBioMap.get(project.atlas_project_id);
  return {
    chronicle_id: phaseId(136, `CHRONICLE-${String(index + 1).padStart(3, "0")}`), atlas_project_id: project.atlas_project_id, slug: project.slug, title: project.title,
    coverage_tier: project.coverage.tier_id, inherited_stage: project.conversion.current_stage, stage_basis: project.conversion.stage_basis,
    event_ids: project.chronology.event_ids, signal_ids: project.evidence_rails.signal_ids, source_ids: project.evidence_rails.source_ids,
    current_account: bio?.narrative_sections?.find((section) => section.heading === "Current bounded account")?.body ?? `${project.title} retains the exact Phase 119 stage and evidence boundary.`,
    turning_points: bio?.narrative_sections?.find((section) => section.heading === "Turning points")?.body ?? project.chronology.boundary,
    unresolved_bridge: project.conversion.unresolved,
    exact_next_artifact: project.conversion.exact_next_artifact,
    stop_rule: project.conversion.stop_rule,
    reader_questions: ["What is the exact named entity?", "Which conversion stage does each artifact support?", "What receiving-party record is still missing?", "Which future check or trigger can legitimately reopen the file?"],
    route: `${routeByPhase[136]}${project.slug}/`,
  };
});

const p136 = makeRegistry(136, {
  counts: { project_chronicles: 24, governed_chronicles: projectChronicles.filter((record) => record.coverage_tier === "Tier A").length, curated_chronicles: projectChronicles.filter((record) => record.coverage_tier === "Tier B").length, event_links: projectChronicles.reduce((sum, record) => sum + record.event_ids.length, 0), stage_advances: 0 },
  project_chronicles: projectChronicles,
});

const placeLedgers = atlas.places.map((place, index) => {
  const bio = placeBioMap.get(place.atlas_place_id);
  return {
    ledger_id: phaseId(137, `LEDGER-${String(index + 1).padStart(3, "0")}`), atlas_place_id: place.atlas_place_id, slug: place.slug, title: place.title,
    geography: place.geography, system_type: place.system_type, coverage_tier: place.coverage.tier_id, inherited_state: place.conversion.current_stage,
    related_project_ids: place.relationships.related_project_ids, signal_ids: place.evidence_rails.signal_ids, source_ids: place.evidence_rails.source_ids,
    receiving_system_read: bio?.narrative_sections?.[0]?.body ?? place.editorial_question,
    open_system_needs: String(place.conversion.unresolved).split(/\s{2,}|;\s*/).filter(Boolean),
    exact_next_artifact: place.conversion.exact_next_artifact,
    stop_rule: place.conversion.stop_rule,
    place_stage: null,
    interpretation_boundary: "The ledger organizes place-bound dependencies and evidence. It creates no synthetic place stage, outcome, readiness score, or ranking.",
    route: `${routeByPhase[137]}${place.slug}/`,
  };
});

const p137 = makeRegistry(137, {
  counts: { place_ledgers: 15, governed_ledgers: placeLedgers.filter((record) => record.coverage_tier === "Tier A").length, curated_ledgers: placeLedgers.filter((record) => record.coverage_tier === "Tier B").length, related_project_links: placeLedgers.reduce((sum, record) => sum + record.related_project_ids.length, 0), synthetic_place_stages: 0 },
  place_ledgers: placeLedgers,
});

const legacyPanelIdByAtlasEntity = {
  "119-PROJECT-009": "panel-56b-manatee-battery-capacity",
  "119-PROJECT-010": "panel-56b-moss-landing-battery-capacity",
  "119-PROJECT-011": "panel-56b-gateway-battery-capacity",
  "119-PROJECT-012": "panel-56e-hornsdale-power-reserve",
  "119-PROJECT-013": "panel-56e-victorian-big-battery",
  "119-PROJECT-014": "panel-56e-dalrymple-escri-bess",
  "119-PROJECT-015": "panel-56e-f35-fort-worth-line",
  "119-PROJECT-016": "panel-56e-f15ex-st-louis-line",
  "119-PROJECT-017": "panel-56e-kc46-everett-line",
  "119-PROJECT-018": "panel-56b-current-applications-output",
  "119-PROJECT-019": "panel-56b-island-components-output",
  "119-PROJECT-020": "panel-56b-monaghan-medical-output",
};
const legacyPanelById = byId([...legacyPanelsA.panels, ...legacyPanelsB.panels], "panel_id");
const seriesAdmissionByFileId = byId(observationRegistry.series_admission_dockets, "file_id");
const longitudinalEligibility = readinessRecords.map((record, index) => {
  const atlasProject = record.entity_kind === "project" ? atlas.projects.find((project) => project.atlas_project_id === record.entity_id) : null;
  const governedFileId = atlasProject?.relationships.phase_61_file_ids?.[0] ?? null;
  const legacyPanel = legacyPanelById.get(legacyPanelIdByAtlasEntity[record.entity_id]);
  const measurementSpecifications = governedFileId ? measurementRegistry.measurement_specifications.filter((specification) => specification.file_id === governedFileId) : [];
  const seriesAdmission = governedFileId ? seriesAdmissionByFileId.get(governedFileId) : null;
  const hasCandidateShelf = Boolean(legacyPanel || governedFileId || record.signal_ids.length >= 2);
  return {
    eligibility_id: phaseId(138, `ELIGIBILITY-${String(index + 1).padStart(3, "0")}`), entity_kind: record.entity_kind, entity_id: record.entity_id, slug: record.slug, title: record.title,
    legacy_panel_id: legacyPanel?.panel_id ?? null,
    legacy_panel_record_status: legacyPanel?.record_status ?? null,
    legacy_observation_count: legacyPanel?.observations?.length ?? 0,
    governed_file_id: governedFileId,
    measurement_specification_ids: measurementSpecifications.map((specification) => specification.specification_id),
    series_admission_docket_id: seriesAdmission?.admission_docket_id ?? null,
    tests: [
      { dimension: "identity", state: legacyPanel || governedFileId ? "Exact upstream identity join available" : "Canonical Atlas identity only", reason: legacyPanel ? `Curated mapping resolves exact legacy panel ${legacyPanel.panel_id} for ${legacyPanel.entity_name}; no legacy observation is transferred into the governed chain.` : governedFileId ? `The Atlas identity resolves to governed file ${governedFileId}.` : "No curated legacy-panel or governed-file join is established beyond the Phase 119 identity." },
      { dimension: "period", state: legacyPanel ? "Legacy periods present — compatibility not adjudicated" : measurementSpecifications.length ? "Prospective period contract present — no observations" : "Repeated period not established", reason: legacyPanel ? `The legacy panel records ${legacyPanel.observations.length} observations under period ${legacyPanel.period}; Phase 138 does not declare them compatible with the newer Phase 68–74 chain.` : measurementSpecifications.length ? `${measurementSpecifications.length} Phase 69 specification(s) define prospective period contracts, while every current observation count remains zero.` : "Signal-link count is not treated as a repeated observation period." },
      { dimension: "measure", state: legacyPanel ? "Legacy measure present — admission not transferred" : measurementSpecifications.length ? "Prospective measures specified — unobserved" : "Repeated measure not established", reason: legacyPanel ? `The legacy indicator is “${legacyPanel.indicator}” in ${legacyPanel.unit}; its observations remain in Phase 56.` : measurementSpecifications.length ? `${measurementSpecifications.length} source-bounded measure contracts await a first qualifying observation.` : "No source-defined repeated measure is joined for this Atlas record." },
      { dimension: "denominator", state: legacyPanel?.denominator ? "Legacy denominator recorded — compatibility not adjudicated" : measurementSpecifications.length ? "Prospective denominator contracts present — unobserved" : "Stable denominator not established", reason: legacyPanel?.denominator ? `The legacy denominator is “${legacyPanel.denominator}”; Phase 138 creates no cross-period or cross-regime bridge.` : measurementSpecifications.length ? "Each Phase 69 specification requires a source-declared denominator, but no accepted payload exists." : "No stable repeated denominator is joined for this Atlas record." },
    ],
    candidate_state: legacyPanel ? "Legacy panel candidate shelf — governed admission transfer prohibited" : governedFileId ? "Governed specification shelf — observation chain empty" : hasCandidateShelf ? "Evidence shelf — longitudinal compatibility not established" : "No repeated-record candidate shelf",
    eligibility_outcome: "Not eligible for longitudinal admission",
    series_admitted: false,
    observation_values: [],
    next_record: seriesAdmission?.exact_next_artifact ?? "A repeated, source-defined measure for the same entity with compatible periods, methods, denominators, revisions, and acceptance state.",
  };
});

const p138 = makeRegistry(138, {
  counts: { eligibility_reviews: 39, candidate_shelves: longitudinalEligibility.filter((record) => record.candidate_state !== "No repeated-record candidate shelf").length, legacy_panel_joins: longitudinalEligibility.filter((record) => record.legacy_panel_id).length, governed_file_joins: longitudinalEligibility.filter((record) => record.governed_file_id).length, admitted_series: 0, observation_values_created: 0, outcome_claims_created: 0 },
  eligibility_records: longitudinalEligibility,
});

const comparisonReviews = dossiers.dossiers.map((dossier, index) => {
  const synthesis = syntheses.syntheses.find((record) => record.dossier_id === dossier.dossier_id);
  return {
    rereview_id: phaseId(139, `REREVIEW-${String(index + 1).padStart(3, "0")}`), dossier_id: dossier.dossier_id, synthesis_id: synthesis.synthesis_id, slug: dossier.slug, title: dossier.title,
    project_chronicle_ids: dossier.atlas_project_ids.map((id) => projectChronicles.find((record) => record.atlas_project_id === id)?.chronicle_id).filter(Boolean),
    place_ledger_ids: dossier.atlas_place_ids.map((id) => placeLedgers.find((record) => record.atlas_place_id === id)?.ledger_id).filter(Boolean),
    longitudinal_eligibility_ids: [...dossier.atlas_project_ids, ...dossier.atlas_place_ids].map((id) => longitudinalEligibility.find((record) => record.entity_id === id)?.eligibility_id).filter(Boolean),
    identity_test: "Passed for exact joins; entities remain non-equivalent.", stage_test: "No common stage admitted.", period_test: "No common observation window admitted.", denominator_test: "No common performance denominator admitted.",
    inherited_verdict: dossier.comparison_passport.verdict, rereview_verdict: "Context only", verdict_changed: false,
    what_is_comparable: dossier.what_is_comparable, what_must_not_be_compared: dossier.what_must_not_be_compared, decisive_next_evidence: dossier.decisive_next_evidence,
    route: `${routeByPhase[139]}${dossier.slug}/`,
  };
});

const p139 = makeRegistry(139, {
  counts: { dossier_rereviews: 12, context_only: 12, verdict_changes: 0, scores_created: 0, ranks_created: 0, causal_findings_created: 0 },
  comparison_reviews: comparisonReviews,
});

const topicDesks = topicReviews.topic_reviews.map((review, index) => {
  const topicMissions = missions.missions.filter((mission) => mission.topic_id === review.topic_id);
  const gapIds = topicMissions.filter((mission) => mission.relationships.acquisition_packet_ids.length === 0).map((mission) => mission.mission_id);
  return {
    desk_id: phaseId(140, `DESK-${String(index + 1).padStart(3, "0")}`), topic_id: review.topic_id, slug: review.slug, title: review.title.replace(" state of evidence", " intelligence desk"),
    desk_state: "Active — inaugural edition published", current_read: review.authored_sections.executive_read,
    strongest_current_evidence: review.authored_sections.strongest_current_evidence, contested_reading: review.authored_sections.contested_reading,
    mission_ids: topicMissions.map((mission) => mission.mission_id), acquisition_gap_mission_ids: gapIds,
    authority_gap_map_ids: phase130Records.filter((record) => topicMissions.some((mission) => mission.mission_id === record.mission_id)).map((record) => record.gap_map_id),
    admission_docket_ids: dockets.filter((record) => topicMissions.some((mission) => mission.mission_id === record.mission_id)).map((record) => record.docket_id),
    source_check_receipt_ids: sourceCheckReceipts.filter((record) => topicMissions.some((mission) => mission.mission_id === record.mission_id)).map((record) => record.receipt_id),
    requirement_adjudication_ids: adjudicationItems.filter((record) => topicMissions.some((mission) => mission.mission_id === record.mission_id)).map((record) => record.adjudication_id),
    mission_decision_ids: missionDecisions.filter((record) => topicMissions.some((mission) => mission.mission_id === record.mission_id)).map((record) => record.mission_decision_id),
    project_chronicle_ids: review.exact_joins.project_biography_ids.map((id) => projectChronicles.find((record) => projectBioMap.get(record.atlas_project_id)?.biography_id === id)?.chronicle_id).filter(Boolean),
    place_ledger_ids: review.exact_joins.place_biography_ids.map((id) => placeLedgers.find((record) => placeBioMap.get(record.atlas_place_id)?.biography_id === id)?.ledger_id).filter(Boolean),
    comparison_rereview_ids: review.exact_joins.dossier_ids.map((id) => comparisonReviews.find((record) => record.dossier_id === id)?.rereview_id).filter(Boolean),
    next_actions: review.horizon_sections.map((section) => ({ horizon: section.horizon, mission_id: section.mission_id, action: section.next_artifact ?? section.analysis.slice(0, 280) })),
    cadence: { weekly: "Review material source or gate changes", monthly: "Publish a bounded desk state", quarterly: "Re-audit mission, Atlas, and comparison joins" },
    route: `${routeByPhase[140]}${review.slug}/`,
  };
});

const p140 = makeRegistry(140, {
  counts: { living_topic_desks: 17, mission_links: topicDesks.reduce((sum, desk) => sum + desk.mission_ids.length, 0), acquisition_gap_links: topicDesks.reduce((sum, desk) => sum + desk.acquisition_gap_mission_ids.length, 0), desks_in_inaugural_edition: 17 },
  topic_desks: topicDesks,
});

const almanacEntries = [
  ...topicDesks.map((desk, index) => ({ almanac_id: phaseId(141, `TOPIC-${String(index + 1).padStart(3, "0")}`), kind: "topic", canonical_id: desk.topic_id, slug: desk.slug, title: desk.title, state: desk.desk_state, current_read: desk.current_read, mission_ids: desk.mission_ids, signal_ids: [], source_ids: [], open_boundary: desk.acquisition_gap_mission_ids.length ? `${desk.acquisition_gap_mission_ids.length} mission acquisition gap(s) remain.` : "No Phase 120 acquisition gap; mission adjudication can still remain open.", route: `${routeByPhase[141]}topics/${desk.slug}/` })),
  ...projectChronicles.map((record, index) => ({ almanac_id: phaseId(141, `PROJECT-${String(index + 1).padStart(3, "0")}`), kind: "project", canonical_id: record.atlas_project_id, slug: record.slug, title: record.title, state: record.inherited_stage, current_read: record.current_account, mission_ids: [], signal_ids: record.signal_ids, source_ids: record.source_ids, open_boundary: record.unresolved_bridge, route: `${routeByPhase[141]}projects/${record.slug}/` })),
  ...placeLedgers.map((record, index) => ({ almanac_id: phaseId(141, `PLACE-${String(index + 1).padStart(3, "0")}`), kind: "place", canonical_id: record.atlas_place_id, slug: record.slug, title: record.title, state: record.inherited_state, current_read: record.receiving_system_read, mission_ids: [], signal_ids: record.signal_ids, source_ids: record.source_ids, open_boundary: record.exact_next_artifact, route: `${routeByPhase[141]}places/${record.slug}/` })),
];

const p141 = makeRegistry(141, {
  counts: { almanac_entries: 56, topics: 17, projects: 24, places: 15 },
  almanac_entries: almanacEntries,
});

const topicRoadmaps = topicDesks.map((desk, index) => {
  const topicMissions = missions.missions.filter((mission) => mission.topic_id === desk.topic_id);
  return {
    roadmap_id: phaseId(142, `ROADMAP-${String(index + 1).padStart(3, "0")}`), topic_id: desk.topic_id, desk_id: desk.desk_id, slug: desk.slug, title: `${desk.title.replace(" intelligence desk", "")} delivery roadmap`,
    horizon_milestones: topicMissions.map((mission) => {
      const decision = missionDecisions.find((record) => record.mission_id === mission.mission_id);
      return {
        horizon: mission.research_horizon, mission_id: mission.mission_id, mission_decision_id: decision?.mission_decision_id ?? null, question: mission.research_contract.question, required_evidence: mission.research_contract.required_evidence,
        current_state: decision?.mission_decision_state ?? mission.answer_state,
        next_action: decision?.next_action ?? mission.stewardship.next_action, stop_rule: mission.stop_rule,
      };
    }),
    delivery_sequence: ["Resolve exact authority and artifact identity", "Adjudicate every mission requirement", "Retain project and place conversion boundaries", "Admit compatible longitudinal evidence only after all four eligibility tests", "Revise synthesis only through a dated governed decision"],
    success_definition: "A bounded, source-resolved public answer or explicit gap for every horizon, with no stage substitution or hidden denominator change.",
    route: `${routeByPhase[142]}${desk.slug}/`,
  };
});

const p142 = makeRegistry(142, {
  counts: { topic_roadmaps: 17, horizon_milestones: topicRoadmaps.reduce((sum, record) => sum + record.horizon_milestones.length, 0), numeric_rankings: 0 },
  topic_roadmaps: topicRoadmaps,
});

const editionTemplates = [
  {
    edition_id: "143-EDITION-001",
    slug: "inaugural-desk-edition",
    title: "Inaugural frontier intelligence desk edition",
    publication_date: effectiveDate,
    state: "Published",
    focus: "All seventeen topic desks, thirty-nine Atlas files, twelve comparison re-reviews, and the open evidence-admission boundary.",
    included_desk_ids: topicDesks.map((desk) => desk.desk_id),
    editorial_sections: {
      opening_read: "The corpus is strongest as a map of institutions, projects, places, and decision requirements. It is not yet a scorecard of outcomes. This inaugural edition therefore leads with what can be traced, keeps open requirements visible, and refuses to convert source proximity into proof.",
      evidence_admission: "Six priority mission packets expose eighteen requirement-level decisions. Official artifacts were rechecked on 2026-08-30, but all admissibility decisions and mission answers remain owner-gated. Twelve additional missions still lack an exact Phase 120 topic-and-stage acquisition path.",
      conversion_read: "The Atlas carries twenty-four named project chronicles and fifteen place ledgers. Eight projects have governed Phase 61 files; sixteen remain curated. A place ledger describes its receiving system and linked projects but never inherits a synthetic project stage.",
      longitudinal_read: "All thirty-nine Atlas identities have an eligibility review. Thirty-eight have a candidate shelf and one has no repeated-record candidate shelf, but none passes the full identity, period, measure, and denominator chain required to admit a longitudinal series.",
      comparison_read: "All twelve cross-system dossiers remain Context only. Exact joins improve navigation and make boundaries inspectable; they do not establish a common stage, observation window, denominator, score, rank, or causal result.",
      next_watch: "The next lawful evidence operation is the Louisiana Starlink adoption gate on 2026-09-01. Later September and October gates remain scheduled. New editions must be written only from evidence available on or after their stated dates.",
    },
    desk_dispatches: topicDesks.map((desk) => ({
      desk_id: desk.desk_id,
      topic_id: desk.topic_id,
      title: desk.title,
      current_read: desk.current_read,
      open_mission_count: desk.mission_ids.length,
      acquisition_gap_count: desk.acquisition_gap_mission_ids.length,
      next_action: desk.next_actions[0]?.action ?? "Continue the governed evidence watch.",
      route: desk.route,
    })),
    boundary: "This authored edition reports the corpus state at 2026-08-30; it does not predate a later gate or evidence decision.",
  },
  { edition_id: "143-EDITION-002", slug: "evidence-watch-2026-09-06", title: "Evidence watch", publication_date: "2026-09-06", state: "Scheduled — no content prepublished", focus: "Official-artifact changes and the September 1 evidence gate.", included_desk_ids: [], boundary: "The edition must be written from evidence available on or after its date." },
  { edition_id: "143-EDITION-003", slug: "conversion-watch-2026-09-13", title: "Conversion watch", publication_date: "2026-09-13", state: "Scheduled — no content prepublished", focus: "Named project and place changes after the September 9–10 gates.", included_desk_ids: [], boundary: "No future result or project state is inferred." },
  { edition_id: "143-EDITION-004", slug: "comparison-watch-2026-09-20", title: "Comparison watch", publication_date: "2026-09-20", state: "Scheduled — no content prepublished", focus: "Compatibility changes supported by newly admitted common measures, if any.", included_desk_ids: [], boundary: "Context only remains controlling unless a later governed re-review changes it." },
  { edition_id: "143-EDITION-005", slug: "monthly-state-2026-09-27", title: "Monthly state of frontier systems", publication_date: "2026-09-27", state: "Scheduled — no content prepublished", focus: "A dated synthesis of September evidence and conversion decisions.", included_desk_ids: [], boundary: "The edition is a schedule entry, not a future-dated report." },
];
const previousEditionById = byId(existingP143?.editions ?? [], "edition_id");
const editions = editionTemplates.map((edition) => {
  const base = { ...edition, route: `${routeByPhase[143]}${edition.slug}/` };
  const previous = previousEditionById.get(edition.edition_id);
  if (!previous || previous.state === "Scheduled — no content prepublished") return base;
  if (previous.slug !== base.slug || previous.publication_date !== base.publication_date) throw new Error(`${edition.edition_id} changed identity or date; refusing to overwrite a published governed edition.`);
  return { ...base, ...previous, route: base.route };
});

const p143 = makeRegistry(143, {
  cadence_contract: { weekly: "One evidence or conversion desk edition", monthly: "One state-of-frontier-systems edition", quarterly: "Full mission, Atlas, comparison, freshness, accessibility, and release audit", correction_rule: "Material errors receive a dated correction entry; silent revision is prohibited." },
  counts: { editions: 5, published_editions: editions.filter((edition) => edition.state === "Published").length, scheduled_editions: editions.filter((edition) => edition.state === "Scheduled — no content prepublished").length, desks_in_inaugural_edition: editions[0].included_desk_ids.length, future_content_predated: 0 },
  editions,
});

const localValidationReason = localValidationPassed
  ? `The ${localValidationReceipt.checks.length}-check local validation receipt passed on ${localValidationReceipt.validated_date}.`
  : "Candidate, content, source-health, phase, Astro, production, route, and release verification must pass after generation.";
const launchGates = [
  ["evidence-admission", "Held", "All eighteen v0.7 requirement decisions and six mission decisions remain owner-gated."],
  ["authority-coverage", "Held", "Twelve Phase 120 mission acquisition gaps remain visible."],
  ["atlas-identity", "Pass", "All twenty-four projects and fifteen places resolve to canonical Phase 119 identities."],
  ["project-chronicles", "Pass", "Twenty-four stage-bounded chronicles are published."],
  ["place-ledgers", "Pass", "Fifteen receiving-system ledgers are published without synthetic stages."],
  ["longitudinal-evidence", "Held", "No series is admitted until identity, period, measure, and denominator all pass."],
  ["comparative-integrity", "Pass", "All twelve dossiers retain Context only and create no score or rank."],
  ["topic-desks", "Pass", "Seventeen active desks and seventeen four-horizon roadmaps are published."],
  ["editorial-cadence", "Pass", "The inaugural edition is published and future editions remain explicitly scheduled."],
  ["future-gate-integrity", "Pass", "All post-2026-08-30 Phase 60 gates retain their upstream state."],
  ["machine-readable-contract", "Pass", "Fifteen phase registries and three version aggregates expose the release."],
  ["accessible-structure", localValidationPassed ? "Pass" : "Pending build", localValidationPassed ? "All 170 edition routes passed the automated language, viewport, landmark, heading, canonical, and indexing structure audit; this is not an accessibility certification." : "Run the automated structural accessibility checks across all 170 edition routes."],
  ["release-validation", localValidationPassed ? "Pass" : "Pending build", localValidationReason],
  ["owner-acceptance", "Held", "Owner acceptance and public-launch authorization are not recorded."],
].map(([gate_id, state, reason], index) => ({ gate_id: phaseId(144, `GATE-${String(index + 1).padStart(2, "0")}-${gate_id.toUpperCase()}`), label: gate_id.replaceAll("-", " "), state, reason }));

const p144 = makeRegistry(144, {
  build_status: localValidationPassed ? "Complete locally" : "Candidate assembled — validation pending",
  audit_result: localValidationPassed ? "v0.9 complete locally — v1 promotion held for owner acceptance, evidence admission, authority coverage, and longitudinal evidence" : "v0.9 candidate assembled — local validation pending and v1 promotion held",
  counts: { launch_gates: launchGates.length, passed: launchGates.filter((gate) => gate.state === "Pass").length, held: launchGates.filter((gate) => gate.state === "Held").length, pending_build: launchGates.filter((gate) => gate.state === "Pending build").length, false_passes: 0 },
  launch_gates: launchGates,
  v1_promotion_state: "Held",
  local_validation_receipt: localValidationPassed ? localValidationReceipt : null,
  promotion_requirements: ["Owner-adjudicate the eighteen v0.7 requirement dockets and six mission decisions.", "Close or explicitly carry the twelve mission acquisition gaps.", "Admit at least one genuinely compatible longitudinal series or retain a documented no-series launch boundary.", "Pass the complete production verification suite and owner acceptance review."],
});

const registries = [p130, p131, p132, p133, p134, p135, p136, p137, p138, p139, p140, p141, p142, p143, p144];

const detailRoutes = {
  130: [], 131: [], 132: [], 133: [], 134: missionDecisions.map((record) => record.route), 135: [],
  136: projectChronicles.map((record) => record.route), 137: placeLedgers.map((record) => record.route), 138: [], 139: comparisonReviews.map((record) => record.route),
  140: topicDesks.map((record) => record.route), 141: almanacEntries.map((record) => record.route), 142: topicRoadmaps.map((record) => record.route), 143: editions.map((record) => record.route), 144: [],
};

for (const registry of registries) {
  registry.public_html_routes = unique([registry.routes.hub, ...detailRoutes[registry.phase]]);
  registry.public_json_exports = [registry.routes.public_export];
  await writeJson(join(dataRoot, exportNameByPhase[registry.phase]), registry);
}

const makeVersion = (version, phases, title, summary) => {
  const selected = registries.filter((registry) => phases.includes(registry.phase));
  const newHtmlRoutes = unique([`/review/v${version.replace(".", "")}/`, ...selected.flatMap((registry) => registry.public_html_routes)]);
  return {
    schema_version: "1.0", program_id: `FTFN-V${version}-${title.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`, dataset: `v${version.replace(".", "")}_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/_$/, "")}`, version, title: `FTFN v${version} — ${title}`, effective_date: effectiveDate,
    record_status: "Published", status: "Complete locally", summary,
    record_scope: `Five-phase v${version} content program with exact public route and export inventories.`,
    phases: selected.map((registry) => ({ phase: registry.phase, title: registry.title, status: registry.build_status, hub_route: registry.routes.hub, public_export: registry.routes.public_export })),
    counts: { phases: selected.length, public_html_routes: newHtmlRoutes.length, phase_hubs: selected.length, detail_routes: newHtmlRoutes.length - selected.length - 1, public_json_exports: selected.length + 1 },
    publication_boundaries: publicationBoundaries,
    public_html_routes: newHtmlRoutes,
    public_json_exports: [...selected.map((registry) => registry.routes.public_export), `/data/v${version.replace(".", "")}-${version === "0.7" ? "evidence-admission-dockets" : version === "0.8" ? "conversion-longitudinal-atlas" : "living-public-intelligence"}.json`],
  };
};

const v07 = makeVersion("0.7", [130, 131, 132, 133, 134], "Evidence Admission Dockets", "A complete, inspectable owner-review system for twelve acquisition gaps, six priority missions, eighteen requirement dockets, dated source checks, adjudication packets, and mission decisions—without fabricating a human evidence decision.");
v07.evidence_state = { source_checks_complete: 18, owner_requirement_decisions_pending: p133.counts.pending_owner_adjudication, owner_mission_decisions_pending: p134.counts.owner_decisions_pending, artifacts_admitted: 0, canonical_answer_states_changed: 0 };
const v08 = makeVersion("0.8", [135, 136, 137, 138, 139], "Conversion and Longitudinal Atlas", "A complete public conversion layer spanning all thirty-nine Atlas identities, twenty-four project chronicles, fifteen place ledgers, thirty-nine longitudinal eligibility reviews, and twelve context-only comparison re-reviews.");
v08.evidence_state = { atlas_records: 39, admitted_longitudinal_series: 0, comparison_verdict_changes: 0, stage_advances: 0 };
const v09 = makeVersion("0.9", [140, 141, 142, 143, 144], "Living Public Intelligence", "A maintained public intelligence layer with seventeen topic desks, a fifty-six-entity almanac, seventeen delivery roadmaps, an authored inaugural edition, a visible publishing cadence, and a candid v1 launch audit.");
v09.status = localValidationPassed ? "Complete locally" : "Candidate assembled — validation pending";
v09.release_state = { desks: 17, almanac_entries: 56, roadmaps: 17, published_editions: 1, scheduled_editions: 4, v1_promotion: "Held" };

await Promise.all([
  writeJson(join(dataRoot, "v07-evidence-admission-dockets.json"), v07),
  writeJson(join(dataRoot, "v08-conversion-longitudinal-atlas.json"), v08),
  writeJson(join(dataRoot, "v09-living-public-intelligence.json"), v09),
]);

const versionLabel = (phase) => phase <= 134 ? "v0.7" : phase <= 139 ? "v0.8" : "v0.9";
const primaryRecordsByPhase = new Map([
  [130, p130.gap_maps], [131, p131.admission_dockets], [132, p132.source_check_receipts], [133, p133.adjudication_items], [134, p134.mission_decisions],
  [135, p135.readiness_records], [136, p136.project_chronicles], [137, p137.place_ledgers], [138, p138.eligibility_records], [139, p139.comparison_reviews],
  [140, p140.topic_desks], [141, p141.almanac_entries], [142, p142.topic_roadmaps], [143, p143.editions], [144, p144.launch_gates],
]);
const inputsByPhase = {
  130: ["phase-121-priority-research-missions.json", "phase-120-evidence-acquisition-packets.json"],
  131: ["phase-126-mission-evidence-audits.json", "phase-121-priority-research-missions.json", "public source registry"],
  132: ["phase-131-priority-evidence-admission-dockets.json", "twelve official source URLs rechecked on 2026-08-30"],
  133: ["phase-131-priority-evidence-admission-dockets.json", "phase-132-dated-source-check-receipts.json", "preserved owner decisions, if present"],
  134: ["phase-121-priority-research-missions.json", "phase-133-requirement-adjudication-board.json", "preserved owner mission decisions, if present"],
  135: ["phase-119-deep-project-place-atlas.json", "phase-127-project-place-conversion-biographies.json"],
  136: ["phase-119-deep-project-place-atlas.json", "phase-127-project-place-conversion-biographies.json", "phase-62-conversion-event-ledgers.json"],
  137: ["phase-119-deep-project-place-atlas.json", "phase-127-project-place-conversion-biographies.json"],
  138: ["phase-119-deep-project-place-atlas.json", "phase-56b/56e entity panels", "phase-69 measurement registry", "phase-70 observation/admission registry"],
  139: ["phase-123-comparative-delivery-dossiers.json", "phase-129-cross-system-evidence-syntheses.json", "Phases 136–138"],
  140: ["phase-128-topic-state-of-evidence-reviews.json", "Phases 130–139"],
  141: ["Phases 136, 137 and 140 with typed mission, signal and source references"],
  142: ["phase-121-priority-research-missions.json", "phase-134-mission-decision-register.json", "phase-140-living-topic-desks.json"],
  143: ["phase-140-living-topic-desks.json", "preserved governed edition records, if present"],
  144: ["Phases 130–143", "phase-144-local-validation-receipt.json when the local suite has passed"],
};
const integrationByPhase = {
  130: "Expanded authority-gap cards on the v0.7 hub and exact backlinks from canonical mission files.",
  131: "Six mission cards expose all eighteen nested requirement dockets, candidate artifacts and acceptance tests.",
  132: "Eighteen dated receipts expose official URLs, source checked dates, triage results and the no-admission effect; priority mission pages show their exact receipts.",
  133: "The public board exposes acceptance/rejection tests, decision state and next action; priority mission pages join the exact adjudication IDs.",
  134: "Six mission detail routes expose the answer-state packet and remain linked from canonical Phase 121 mission pages.",
  135: "All 24 canonical project and 15 canonical place pages expose their readiness record and blocking boundary.",
  136: "Twenty-four detail routes and all canonical project pages expose stage-bounded chronicles.",
  137: "Fifteen detail routes and all canonical place pages expose receiving-system ledgers without a synthetic place stage.",
  138: "The hub exposes every four-test eligibility record; all canonical project and place pages show their exact eligibility ID and next record.",
  139: "Twelve detail routes join chronicles, ledgers and exact Phase 138 eligibility records while retaining Context only.",
  140: "Seventeen desk routes carry exact Phase 130–134 control IDs plus v0.8 project, place and comparison joins.",
  141: "Fifty-six detail routes separate mission IDs, signal IDs and source IDs by record kind.",
  142: "Seventeen roadmap routes resolve current state and next action from Phase 134 when a governed mission packet exists.",
  143: "Five edition routes include one authored current edition, seventeen desk dispatches and four empty future schedules.",
  144: "The public audit exposes fourteen gates; automated accessibility structure and release validation require a dated local receipt, while owner acceptance remains Held.",
};
const phaseSpecificAssertions = {
  130: ["Twelve and only twelve Phase 121 acquisition gaps remain open.", "The six priority paths are flagged without implying an admission."],
  131: ["Six mission dockets contain eighteen requirement dockets and twenty-five candidate-source links.", "Every owner decision remains pending unless a preserved dated decision receipt exists."],
  132: ["All twelve cited official source records carry last_checked_date 2026-08-30.", "Sixteen receipts carry candidate artifacts, two are bounded no-artifact receipts, and none is an admission receipt."],
  133: ["A rebuild preserves non-pending owner fields and fails if a governed decision changes identity.", "Accepted, rejected, inadmissible and bounded-gap totals are derived from preserved decision states."],
  134: ["A rebuild preserves a receipted mission answer and never mutates the canonical Phase 121 record.", "Requirement-decision counts are recalculated from Phase 133."],
  135: ["Thirty-nine Atlas IDs resolve one-to-one: 24 projects and 15 places.", "Readiness is content readiness only; no project or place stage advances."],
  136: ["All 192 inherited project-stage cells, seventeen event links and exact evidence rails remain unchanged.", "No chronicle contains broken because-clause or editorial-question prose."],
  137: ["All fifteen place IDs and sixteen related-project links resolve reciprocally.", "place_stage remains null everywhere."],
  138: ["Twelve curated Phase 56 panel joins and eight governed Phase 69/70 file joins are explicit and non-transferable.", "All 39 reviews retain zero admitted series, observation values and outcome claims."],
  139: ["All twelve inherited verdicts and re-review verdicts remain Context only.", "Every Phase 138 join resolves; no score, rank or causal finding is created."],
  140: ["Seventeen desks resolve all 68 missions and twelve acquisition gaps.", "Every v0.7 control ID is typed and resolves to the correct topic mission."],
  141: ["The 56 entries remain exactly 17 topics, 24 projects and 15 places.", "Mission contracts are never labeled as evidence IDs."],
  142: ["Seventeen roadmaps contain 68 horizon milestones.", "Priority current states are read from Phase 134 rather than a hard-coded label."],
  143: ["The inaugural edition contains six authored sections and seventeen desk dispatches.", "A rebuild preserves any later governed edition and never prepublishes a scheduled edition."],
  144: ["The audit contains fourteen gates and zero false passes.", "A local validation receipt can pass structural accessibility and release validation, but cannot clear the four owner/evidence holds or promote v1."],
};
const nextActionByPhase = {
  130: "Acquire an exact topic-and-stage authority rail or retain the bounded gap.", 131: "Owner-review each requirement against its acceptance and rejection test.", 132: "Route the dated triage receipt to Phase 133; do not convert it into an admission.", 133: "Record a dated authorized decision receipt for each requirement.", 134: "Answer a mission only after all three requirement decisions satisfy its completion rule.",
  135: "Use readiness results to choose editorial work, never to score delivery performance.", 136: "Update a chronicle only from a dated upstream stage or evidence event.", 137: "Update place context without inheriting the stage of any linked project.", 138: "Acquire and independently review a compatible repeated observation before admission.", 139: "Reopen comparison only when a common identity, stage, period and denominator are established.",
  140: "Operate the desk on material evidence or governed decision changes.", 141: "Keep typed references and current boundaries synchronized with their canonical files.", 142: "Propagate later Phase 134 decisions into the matching horizon milestone.", 143: "Write each scheduled edition only on or after its date and preserve its governed content.", 144: "Keep v1 Held until owner acceptance and the remaining evidence conditions are explicitly resolved.",
};
const futureGates = cycle.records.filter((record) => record.scheduled_check_date > effectiveDate);
const countTable = (counts) => Object.entries(counts).map(([key, value]) => `| ${key.replaceAll("_", " ")} | ${value} |`).join("\n");
const workPackageFilename = (registry) => `phase-${registry.phase}-${registry.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}.md`;
const normalizeGeneratedMarkdown = (document) => document.replace(/ {2}\n/g, "\n\n");

for (const registry of registries) {
  const primaryRecords = primaryRecordsByPhase.get(registry.phase);
  const recordKeys = primaryRecords[0] ? Object.keys(primaryRecords[0]).join(", ") : "No primary record fields";
  const workPackage = `# Phase ${registry.phase} — ${registry.title}\n\n**Version:** ${versionLabel(registry.phase)}  \n**Effective date:** ${effectiveDate}  \n**Status:** ${registry.build_status}\n\n## Objective\n\n${registry.summary}\n\n## Upstream inputs\n\n${inputsByPhase[registry.phase].map((input) => `- \`${input}\``).join("\n")}\n\n## Dataset contract\n\n- Program ID: \`${registry.program_id}\`\n- Dataset: \`${registry.dataset}\`\n- Record scope: ${registry.record_scope}\n- Primary records: ${primaryRecords.length}\n- Primary record fields: ${recordKeys}\n\n| Count | Value |\n| --- | ---: |\n${countTable(registry.counts)}\n\n## Reader integration\n\n- Hub: \`${registry.routes.hub}\`\n- Public JSON: \`${registry.routes.public_export}\`\n- Indexable phase routes: ${registry.public_html_routes.length}\n- ${integrationByPhase[registry.phase]}\n\nHub-only records render their nested fields in accessible disclosure controls; detail-route phases render the complete scalar, object and list contract. The JSON endpoint serializes the direct schema-1.0 registry without a wrapper.\n\n## Acceptance and assertion matrix\n\n- Every upstream ID must resolve to the exact record kind declared by the phase.\n- Every route must build with \`index, follow\`, the exact \`https://ftfn.io\` canonical URL and one sitemap entry.\n- ${phaseSpecificAssertions[registry.phase].join("\n- ")}\n- All eleven post-${effectiveDate} Phase 60 gates remain scheduled, undated and unreceipted.\n- The corpus remains 795 sources and 1,406 signals: 1,121 Published and 285 In Review.\n\n## Preservation and rebuild behavior\n\nPhase 133 requirement decisions, Phase 134 mission answers and Phase 143 governed editions are preservation-safe. The generator retains any non-pending receipted record and fails on an identity conflict instead of silently replacing it. Phase 144 derives its two local validation gates only from a dated validation receipt.\n\n## Publication boundaries\n\n${publicationBoundaries.map((boundary) => `- ${boundary}`).join("\n")}\n\n## Next action\n\n${nextActionByPhase[registry.phase]}\n`;
  await writeFile(join(workPackageRoot, workPackageFilename(registry)), normalizeGeneratedMarkdown(workPackage), "utf8");

  const affectedIds = unique([registry.program_id, ...primaryRecords.map((record) => Object.entries(record).find(([key]) => key.endsWith("_id"))?.[1])]);
  const relatedPaths = unique([...registry.public_html_routes, registry.routes.public_export]);
  const update = {
    id: `update-${effectiveDate}-phase-${registry.phase}`,
    effective_date: effectiveDate,
    entry_type: "Publication Promotion",
    title: `Phase ${registry.phase} publishes ${registry.title.toLowerCase()}`,
    summary: registry.summary,
    affected_record_ids: affectedIds,
    related_paths: relatedPaths,
    evidence_note: publicationBoundaries[registry.phase <= 134 ? 0 : registry.phase <= 139 ? 2 : 3],
    materiality: "No record-state change",
    publication_effect: `Adds or updates ${registry.public_html_routes.length} public HTML route(s), their canonical integration, and one schema-1.0 JSON export.`,
    next_check_date: null,
    work_package: `docs/work-packages/${workPackageFilename(registry)}`,
  };
  await writeJson(join(updateRoot, `${effectiveDate}-phase-${registry.phase}.json`), update);
}

const versionPrograms = [
  { version: v07, phaseRange: "130–134", thesis: "Build a preservation-safe evidence-admission operating surface: map acquisition gaps, assemble requirement dockets, record dated official-source checks, and expose—but never fabricate—owner decisions." },
  { version: v08, phaseRange: "135–139", thesis: "Convert the complete named Atlas into project and place narratives, then test longitudinal and comparative eligibility against real legacy and governed evidence chains without transferring observations or verdicts." },
  { version: v09, phaseRange: "140–144", thesis: "Operate the corpus as living public intelligence through connected desks, an almanac, roadmaps, authored editions and an honest v1 audit." },
];
const phaseRows = (version) => version.phases.map((phase) => {
  const registry = registries.find((item) => item.phase === phase.phase);
  const primaryRecords = primaryRecordsByPhase.get(phase.phase);
  return `| ${phase.phase} | ${phase.title} | ${primaryRecords.length} | ${registry.public_html_routes.length} | ${phase.status} |`;
}).join("\n");
const routeFamilies = (version) => version.phases.map((phase) => `- Phase ${phase.phase}: \`${phase.hub_route}\` and \`${phase.public_export}\``).join("\n");
const roadmapDocument = ({ version, phaseRange, thesis }) => `# ${version.title} roadmap\n\n**Effective date:** ${effectiveDate}  \n**Execution status:** ${version.status}\n\n## Release objective\n\n${thesis}\n\n${version.summary}\n\n## Executed phase program\n\n| Phase | Content goal | Primary records | Public routes | Status |\n| ---: | --- | ---: | ---: | --- |\n${phaseRows(version)}\n\n## Public surface contract\n\n- Phase range: ${phaseRange}\n- ${version.counts.public_html_routes} unique indexable HTML routes\n- ${version.counts.public_json_exports} direct schema-1.0 JSON exports\n- ${version.counts.phase_hubs} phase hubs and ${version.counts.detail_routes} detail routes\n\n${routeFamilies(version)}\n\n## Content goals delivered\n\n${version.phases.map((phase) => `- **Phase ${phase.phase}:** ${integrationByPhase[phase.phase]} Next: ${nextActionByPhase[phase.phase]}`).join("\n")}\n\n## Cross-release invariants\n\n${publicationBoundaries.map((boundary) => `- ${boundary}`).join("\n")}\n- All 80 Phase 117 authority rails remain Candidate and all 320 Phase 120 exact-artifact targets remain unreviewed unless a later governed receipt says otherwise.\n- The 56/12 mission acquisition split, twelve Context only comparisons and eleven future Phase 60 gates remain explicit.\n\n## Completion definition\n\nContent completion means the phase registries, reader surfaces, exports, assertions and preservation controls exist and build. It does not authorize owner decisions, v1 promotion, Git publication, hosted deployment, DNS changes or public launch.\n`;
const buildSummaryDocument = ({ version, phaseRange }) => `# ${version.title} build summary\n\n**Effective date:** ${effectiveDate}  \n**Local state:** ${version.status}\n\n## Outcome\n\n${version.summary}\n\nAll five phases in ${phaseRange} are generated, linked to their canonical readers, exported as direct schema-1.0 JSON, and covered by invariants. Mutable owner decisions and later editions are preserved on rebuild.\n\n## Delivered inventory\n\n| Phase | Primary records | Routes | Export |\n| ---: | ---: | ---: | --- |\n${version.phases.map((phase) => { const registry = registries.find((item) => item.phase === phase.phase); return `| ${phase.phase} | ${primaryRecordsByPhase.get(phase.phase).length} | ${registry.public_html_routes.length} | \`${registry.routes.public_export}\` |`; }).join("\n")}\n\n- Version routes: ${version.counts.public_html_routes}\n- Version exports: ${version.counts.public_json_exports}\n- Cumulative local target after v0.7–v0.9: 6,504 HTML pages, 86 public JSON exports and 169 update records\n- Corpus: 795 sources; 1,406 signals; 1,121 Published; 285 In Review\n\n## Validation\n\n- Content assertions: passed during generation\n- Candidate/content/source-health checks: required and recorded by the Phase 144 receipt\n- Astro diagnostics, production build, route/canonical/sitemap and release verification: ${localValidationPassed ? `passed on ${localValidationReceipt.validated_date}` : "pending final local validation receipt"}\n- v1 promotion: Held\n\n## Boundary result\n\nNo source promotion, evidence admission, mission answer, stage advance, longitudinal observation, outcome claim, comparison verdict, score, rank, causal finding, recommendation or future Phase 60 decision was created by this release.\n\n## Git and deployment\n\nThis build performs no commit, push, merge, hosted deployment, public-access change, custom-domain attachment or DNS mutation. Those remain separate user-authorized operations.\n`;

const governedBuildSummaryDocument = (program) => buildSummaryDocument(program)
  .replace("Cumulative local target after v0.7–v0.9", localValidationPassed ? "Cumulative receipt-backed local contract after v0.7–v0.9" : "Cumulative local target after v0.7–v0.9")
  .replace("Candidate/content/source-health checks: required and recorded by the Phase 144 receipt", localValidationPassed ? `Candidate/content/source-health checks: recorded by receipt ${localValidationReceipt.receipt_id} on ${localValidationReceipt.validated_date}` : "Candidate/content/source-health checks: pending final local validation receipt")
  .replace(/Astro diagnostics, production build, route\/canonical\/sitemap and release verification: .*\n/, "Final production, route/canonical/sitemap, manifest and global release verification: rerun after generation before inheriting a verified-release claim\n")
  .replace("- v1 promotion: Held", localValidationPassed ? "- Receipt `next_action` context: immutable at-issuance instruction; confirm its follow-up separately after the final rebuild\n- v1 promotion: Held" : "- v1 promotion: Held");

for (const program of versionPrograms) {
  const prefix = `v${program.version.version}`;
  await writeFile(join(docsRoot, `roadmap-${prefix}.md`), normalizeGeneratedMarkdown(roadmapDocument(program)), "utf8");
  await writeFile(join(docsRoot, `build-summary-${prefix}.md`), normalizeGeneratedMarkdown(governedBuildSummaryDocument(program)), "utf8");
}

const handoff = `# FTFN v0.9 session handoff\n\n**Effective date:** ${effectiveDate}  \n**Local state:** ${v09.status}\n\n## Read first\n\n1. \`docs/roadmap-v0.7.md\` — evidence-admission control.\n2. \`docs/roadmap-v0.8.md\` — conversion and longitudinal boundaries.\n3. \`docs/roadmap-v0.9.md\` — living publication and v1 gates.\n4. \`app/src/data/phase-144-v1-launch-candidate-audit.json\` — current launch truth.\n5. \`app/src/data/phase-60-operating-cycle.json\` — lawful dated evidence operations.\n\n## Current release inventory\n\n- Fifteen complete content phases: 130–144.\n- 170 unique v0.7–v0.9 public HTML routes and eighteen new JSON exports.\n- Cumulative target: 6,504 HTML pages, 86 exports and 169 update records.\n- v0.7: twelve acquisition-gap maps, six mission dockets, eighteen source checks, eighteen requirement adjudications and six mission decisions.\n- v0.8: 39 readiness audits, 24 project chronicles, 15 place ledgers, 39 longitudinal reviews and twelve comparison re-reviews.\n- v0.9: seventeen desks, 56 almanac entries, seventeen roadmaps, one authored current edition, four empty future schedules and fourteen launch gates.\n\n## Open owner queue\n\nRequirement decisions (${p133.counts.pending_owner_adjudication}):\n\n${p133.adjudication_items.filter((item) => item.decision_state === "Pending owner adjudication").map((item) => `- \`${item.adjudication_id}\` — ${item.mission_id}: ${item.requirement}`).join("\n")}\n\nMission decisions (${p134.counts.owner_decisions_pending}):\n\n${p134.mission_decisions.filter((item) => item.answer === null).map((item) => `- \`${item.mission_decision_id}\` — ${item.mission_id}: ${item.title}`).join("\n")}\n\n## Future Phase 60 calendar\n\n${futureGates.map((record) => `- ${record.scheduled_check_date}: \`${record.cycle_item_id}\` — ${record.decision_status}; no decision date or receipt.`).join("\n")}\n\nThe next legal gate is 2026-09-01. Never predate a gate or infer nonexistence from a bounded search.\n\n## Rebuild and verification\n\nRun from \`app/\`:\n\n\`\`\`text\nnpm run build:phase127-content\nnpm run build:v09-content\nnpm run validate:candidates\nnpm run validate:content\nnpm run source:health\nnpm run test:v09\nnpm run check\nnpm run build\nnpm run verify:v09\nnpm run update:v09-manifest\nnpm run verify:release\n\`\`\`\n\nAfter the first complete validation, create or refresh \`phase-144-local-validation-receipt.json\`, rebuild v0.7–v0.9 so the two local gates become Pass, then rerun the final production and release checks.\n\n## Preservation rules\n\n- The generator preserves receipted Phase 133 decisions, Phase 134 answers and governed Phase 143 editions.\n- It aborts on identity conflicts rather than overwriting governed state.\n- Phase 56 observations remain legacy context and never enter Phase 68–74 by implication.\n- Owner acceptance, public launch and v1 promotion cannot be derived from automated validation.\n\n## Recovery\n\nIf a check fails, leave the Phase 144 receipt absent or remove only the invalid receipt file, fix the defect, rebuild and rerun the full suite. Do not reset unrelated user work or edit an owner decision back to Pending.\n\n## Git and deployment state\n\nNo Git commit, push, merge, Sites deployment, public-access change, custom-domain action or DNS mutation is part of this build.\n`;
const governedHandoff = handoff
  .replace("Cumulative target: 6,504 HTML pages, 86 exports and 169 update records.", localValidationPassed ? "Cumulative receipt-backed local contract: 6,504 HTML pages, 86 exports and 169 update records." : "Cumulative target: 6,504 HTML pages, 86 exports and 169 update records.")
  .replace("After the first complete validation, create or refresh `phase-144-local-validation-receipt.json`, rebuild v0.7–v0.9 so the two local gates become Pass, then rerun the final production and release checks.", localValidationPassed ? `Receipt \`${localValidationReceipt.receipt_id}\` is embedded. Its stored \`next_action\` is the immutable instruction recorded at issuance; confirm its follow-up separately after the final rebuild. Do not silently reuse the receipt after governed content changes; rerun the full suite and handle any replacement as an explicit receipt correction before rebuilding.` : "After the first complete validation, create `phase-144-local-validation-receipt.json`, rebuild v0.7–v0.9 so the two local gates become Pass, then rerun the final production and release checks.");
await writeFile(join(docsRoot, "session-handoff-v0.9.md"), normalizeGeneratedMarkdown(governedHandoff), "utf8");
if (authority.rails.length !== 80 || acquisition.acquisition_packets.length !== 80 || acquisition.counts.exact_artifacts_admitted !== 0) throw new Error("Upstream acquisition baseline changed during v0.7-v0.9 generation.");
if (missions.missions.some((mission) => mission.answer_state !== "Research packet assembled — answer not adjudicated")) throw new Error("A canonical Phase 121 answer state changed.");
if (futureGates.length !== 11 || futureGates.some((record) => record.decision_status !== "scheduled" || record.decision_date !== null || record.receipt_id !== null)) throw new Error("A future Phase 60 gate was operated or predated.");

console.log(`FTFN v0.7-v0.9 built: ${registries.length} phases, ${v07.counts.public_html_routes + v08.counts.public_html_routes + v09.counts.public_html_routes} version routes, 18 phase/version exports, 15 updates, and zero fabricated owner decisions.`);
