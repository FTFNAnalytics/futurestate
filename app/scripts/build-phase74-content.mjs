import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const phase68 = await readJson(join(dataRoot, "phase-68-compatible-series-outcome-cohorts.json"));
const phase73 = await readJson(join(dataRoot, "phase-73-analysis-execution-result-adjudication-registry.json"));

const synthesisEligibilityGates = [
  ["74-IN-01-IDENTITY", "Adjudicated result identity", "The exact Phase 73 result, adjudication receipt, current public lineage, and correction status are present."],
  ["74-IN-02-QUESTION", "Question, population, and setting", "The research question, population, geography, setting, and eligibility boundary are explicit."],
  ["74-IN-03-MEASURE", "Measure, estimand, and scale", "The outcome definition, unit, denominator, contrast, estimand, direction, and effect scale are compatible or explicitly transformed."],
  ["74-IN-04-INTERVENTION", "Intervention or exposure identity", "The intervention, exposure, implementation version, intensity, timing, and comparison condition are exact."],
  ["74-IN-05-PERIOD", "Time basis and follow-up", "The baseline, observation window, follow-up, lag, cadence, and event-time basis are visible."],
  ["74-IN-06-DESIGN", "Design and identification class", "The design, identification assumptions, assignment process, controls, and inferential class remain attached."],
  ["74-IN-07-INPUT", "Input provenance and independence", "Sources, cohorts, samples, operators, code, environments, and shared dependencies are resolved before any independence claim."],
  ["74-IN-08-UNCERTAINTY", "Uncertainty and practical magnitude", "Intervals, uncertainty sources, precision, practical magnitude, and inability to distinguish effects are explicit."],
  ["74-IN-09-DEVIATION", "Deviation and amendment lineage", "All protocol deviations, amendments, timing, materiality, and impacts on the estimand remain visible."],
  ["74-IN-10-ROBUSTNESS", "Robustness and falsification", "Sensitivity, falsification, negative-control, placebo, and failure-test records accompany the result."],
  ["74-IN-11-ADVERSE", "Null, adverse, and disconfirming evidence", "Nulls, harms, reversals, warnings, exclusions, and disconfirming findings are preserved."],
  ["74-IN-12-REPLICATION", "Replication and reproducibility", "Independent and non-independent replications, disagreements, and unresolved reproduction failures are distinguished."],
  ["74-IN-13-CLAIM", "Bounded claim and correction readiness", "The adjudicated claim class, exact public language, limitations, corrections, supersession, and withdrawal duties are current."],
  ["74-IN-14-DECISION", "Dual eligibility review and receipt", "Two independent reviewers issue a bounded synthesis-input decision and propagate its receipt to every assigned surface."],
].map(([gate_id, label, question]) => ({ gate_id, label, question }));

const synthesisGates = [
  ["74-SYN-01-SCOPE", "Synthesis question and scope lock", "The body-level question, population, intervention or exposure, comparison, outcome, period, and exclusions are registered before synthesis."],
  ["74-SYN-02-ELIGIBILITY", "Complete eligible-result set", "Every eligible, null, adverse, corrected, withdrawn, and excluded result is enumerated with reasons."],
  ["74-SYN-03-INDEPENDENCE", "Study and provenance independence", "Shared cohorts, sources, operators, code, assumptions, funders, and institutional dependencies are mapped."],
  ["74-SYN-04-COMPATIBILITY", "Measure and estimand compatibility", "Measures, denominators, contrasts, estimands, scales, directions, and transformations are compared without silent harmonization."],
  ["74-SYN-05-DESIGN", "Design diversity and inferential limits", "Design classes and identification assumptions are kept visible rather than pooled into a stronger claim class."],
  ["74-SYN-06-DIRECTION", "Direction and consistency", "Agreement, reversal, nulls, and discordance are assessed without vote counting."],
  ["74-SYN-07-MAGNITUDE", "Magnitude and practical importance", "Effect magnitudes, thresholds, baselines, and practical importance are compared on defensible scales."],
  ["74-SYN-08-UNCERTAINTY", "Uncertainty and precision", "Within-result and body-level uncertainty, imprecision, missingness, and unresolved intervals remain explicit."],
  ["74-SYN-09-HETEROGENEITY", "Heterogeneity and transfer limits", "Population, setting, timing, implementation, and contextual heterogeneity constrain transfer."],
  ["74-SYN-10-ADVERSE", "Null, adverse, and omitted evidence", "Null, adverse, disconfirming, unpublished, and missing-result risks are assessed."],
  ["74-SYN-11-BIAS", "Bias, deviations, and corrections", "Selection, measurement, model, reporting, deviation, correction, and withdrawal risks affect the body-level decision."],
  ["74-SYN-12-TRIANGULATION", "Triangulation and replication portfolio", "Independent methods, replications, mechanisms, and negative evidence are distinguished from repeated use of one dependency."],
  ["74-SYN-13-LANGUAGE", "Evidence grade and bounded synthesis language", "The evidence grade, uncertainty, contradictions, dissent, and verb strength support the exact proposed sentence."],
  ["74-SYN-14-DECISION", "Dual synthesis adjudication and receipt", "Two independent reviewers issue one synthesis decision and complete challenge, correction, and propagation readiness."],
].map(([gate_id, label, question]) => ({ gate_id, label, question }));

const evidenceGradeClasses = [
  ["74-GRADE-00-NONE", "No eligible adjudicated results"],
  ["74-GRADE-01-SINGLE", "Single bounded result"],
  ["74-GRADE-02-MIXED", "Mixed or materially contradictory body"],
  ["74-GRADE-03-CONVERGENT-DESCRIPTIVE", "Convergent descriptive body"],
  ["74-GRADE-04-CONVERGENT-ASSOCIATIVE", "Convergent associative body"],
  ["74-GRADE-05-BOUNDED-ATTRIBUTION", "Bounded attribution body"],
  ["74-GRADE-06-BOUNDED-CAUSAL", "Bounded causal body"],
].map(([evidence_grade_id, label]) => ({ evidence_grade_id, label }));

const contradictionCategories = [
  ["74-CONTRA-01-DIRECTION", "Direction or sign"],
  ["74-CONTRA-02-MAGNITUDE", "Magnitude or practical importance"],
  ["74-CONTRA-03-TIME", "Timing, lag, cadence, or durability"],
  ["74-CONTRA-04-POPULATION", "Population, geography, or setting"],
  ["74-CONTRA-05-MEASURE", "Measure, unit, denominator, or estimand"],
  ["74-CONTRA-06-INTERVENTION", "Intervention, exposure, comparison, or implementation version"],
  ["74-CONTRA-07-DESIGN", "Design, identification, model, or assumption"],
  ["74-CONTRA-08-PROVENANCE", "Source, cohort, operator, code, or shared dependency"],
  ["74-CONTRA-09-ADVERSE", "Null, adverse, safety, or distributional evidence"],
  ["74-CONTRA-10-CORRECTION", "Deviation, correction, supersession, or withdrawal"],
].map(([contradiction_category_id, label]) => ({ contradiction_category_id, label }));

const challengeReviewGates = [
  ["74-CHAL-01-IDENTITY", "Challenge identity and timestamp"],
  ["74-CHAL-02-STANDING", "Standing, expertise, conflict, and funding disclosure"],
  ["74-CHAL-03-CLAIM", "Exact challenged claim and version"],
  ["74-CHAL-04-SCOPE", "Bounded challenge scope"],
  ["74-CHAL-05-EVIDENCE", "Cited evidence and provenance"],
  ["74-CHAL-06-REPRODUCTION", "Reproducible critique or calculation"],
  ["74-CHAL-07-METHOD", "Method, assumption, and alternative explanation"],
  ["74-CHAL-08-OMISSION", "Omitted, null, adverse, or contradictory evidence"],
  ["74-CHAL-09-RESPONSE", "Point-by-point public response"],
  ["74-CHAL-10-INDEPENDENCE", "Independent challenge adjudication"],
  ["74-CHAL-11-CORRECTION", "Revision, correction, withdrawal, or no-change decision"],
  ["74-CHAL-12-RECEIPT", "Dual review, reader notice, receipt, and propagation"],
].map(([gate_id, label]) => ({ gate_id, label }));

const decisionTranslationGates = [
  ["74-DT-01-AUTHORITY", "Decision audience and authority"],
  ["74-DT-02-QUESTION", "Exact decision question and boundary"],
  ["74-DT-03-SYNTHESIS", "Current synthesis claim and evidence grade"],
  ["74-DT-04-OPTIONS", "Decision options and status quo"],
  ["74-DT-05-BENEFITS", "Expected benefits and beneficiaries"],
  ["74-DT-06-HARMS", "Harms, adverse outcomes, and burden"],
  ["74-DT-07-DISTRIBUTION", "Distribution, equity, and affected groups"],
  ["74-DT-08-FEASIBILITY", "Feasibility, capacity, cost, and dependencies"],
  ["74-DT-09-UNCERTAINTY", "Uncertainty, scenarios, and value of information"],
  ["74-DT-10-REVERSIBILITY", "Reversibility, safeguards, and failure response"],
  ["74-DT-11-AUTHORIZATION", "Legal, policy, and operational authorization"],
  ["74-DT-12-CONFLICT", "Conflicts, dissent, and recommendation disagreement"],
  ["74-DT-13-REEVALUATION", "Monitoring, sunset, and reevaluation rule"],
  ["74-DT-14-DECISION", "Dual translation review, receipt, and propagation"],
].map(([gate_id, label]) => ({ gate_id, label }));

const reevaluationTriggers = [
  ["74-REEVAL-01-NEW-RESULT", "New adjudicated result"],
  ["74-REEVAL-02-REPLICATION", "Replication agreement or failure"],
  ["74-REEVAL-03-CONTRADICTION", "Material contradiction"],
  ["74-REEVAL-04-ADVERSE", "New adverse or safety evidence"],
  ["74-REEVAL-05-CORRECTION", "Correction, supersession, or withdrawal"],
  ["74-REEVAL-06-MEASURE", "Measure, denominator, or estimand change"],
  ["74-REEVAL-07-CONTEXT", "Population, setting, or implementation change"],
  ["74-REEVAL-08-CHALLENGE", "Upheld external challenge"],
  ["74-REEVAL-09-AUTHORITY", "Legal, policy, or authority change"],
  ["74-REEVAL-10-SUNSET", "Scheduled sunset or review date"],
].map(([trigger_id, label]) => ({ trigger_id, label }));

const cohortIndex = new Map(phase68.cohort_records.map((record, index) => [record.cohort_id, index]));
const adjudicationByCohort = new Map(phase73.result_adjudication_dockets.map((record) => [record.cohort_id, record]));

const synthesisInputDockets = phase73.analysis_execution_dockets.map((execution, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const cohortNumber = String(cohortIndex.get(execution.cohort_id) + 1).padStart(3, "0");
  const adjudication = adjudicationByCohort.get(execution.cohort_id);
  return {
    result_synthesis_input_docket_id: `74-SIN-${padded}`,
    slug: execution.slug.replace(/^73-aex-/, "74-sin-"),
    record_kind: "result_synthesis_input_docket",
    record_status: "Published",
    input_state: "Inactive - No Adjudicated Result",
    input_decision: "Not Eligible",
    analysis_execution_docket_id: execution.analysis_execution_docket_id,
    analysis_execution_docket_slug: execution.slug,
    result_adjudication_docket_id: adjudication.result_adjudication_docket_id,
    result_adjudication_docket_slug: adjudication.slug,
    phase73_adjudication_state: adjudication.adjudication_state,
    cohort_id: execution.cohort_id,
    file_id: execution.file_id,
    file_kind: execution.file_kind,
    named_entity: execution.named_entity,
    measure_id: execution.measure_id,
    measure_label: execution.measure_label,
    eligibility_checks: synthesisEligibilityGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No Phase 73 result has been adjudicated." })),
    synthesis_contradiction_dossier_id: `74-SYN-${cohortNumber}`,
    external_challenge_response_docket_id: `74-XCR-${cohortNumber}`,
    decision_translation_reevaluation_register_id: `74-DTR-${cohortNumber}`,
    exact_next_artifact: execution.exact_next_artifact,
    source_ids: execution.source_ids,
    signal_ids: execution.signal_ids,
    evidence_gap_ids: execution.evidence_gap_ids,
    canonical_briefing_id: execution.canonical_briefing_id,
    reader_pathway_ids: execution.reader_pathway_ids,
    local_system_ids: execution.local_system_ids,
    dependency_map_ids: ["dependency-map-registered-design-is-not-published-result", "dependency-map-adjudicated-result-is-not-decision-recommendation"],
    adjudicated_result_id: null,
    adjudication_receipt_id: null,
    current_public_result_id: null,
    result_version: null,
    correction_status: null,
    claim_class_id: null,
    exact_claim_language: null,
    effect_record: null,
    uncertainty_record: null,
    result_period: null,
    design_class: null,
    shared_provenance_ids: [],
    replication_result_ids: [],
    adverse_or_null_result_ids: [],
    provisional_evidence_grade_id: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    eligibility_receipt_id: null,
    propagation_status: "not_started",
    eligible_for_synthesis: false,
    automatic_evidence_grade_allowed: false,
    automatic_pooling_allowed: false,
    automatic_claim_upgrade_allowed: false,
    phase64_cell_change: "none"
  };
});

const synthesisContradictionDossiers = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const short = cohort.cohort_id.toLowerCase().replace(/^68-cohort-\d+-/, "");
  const adjudication = adjudicationByCohort.get(cohort.cohort_id);
  return {
    synthesis_contradiction_dossier_id: `74-SYN-${padded}`,
    slug: `74-syn-${padded}-${short}`,
    record_kind: "synthesis_contradiction_dossier",
    record_status: "Published",
    synthesis_state: "Inactive - No Eligible Results",
    synthesis_decision: "Not Synthesized",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    file_kind: cohort.file_kind,
    named_entity: cohort.named_entity,
    result_adjudication_docket_id: adjudication.result_adjudication_docket_id,
    result_adjudication_docket_slug: adjudication.slug,
    result_synthesis_input_docket_ids: synthesisInputDockets.filter((record) => record.cohort_id === cohort.cohort_id).map((record) => record.result_synthesis_input_docket_id),
    external_challenge_response_docket_id: `74-XCR-${padded}`,
    decision_translation_reevaluation_register_id: `74-DTR-${padded}`,
    synthesis_checks: synthesisGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No eligible adjudicated result exists." })),
    contradiction_register: contradictionCategories.map((category) => ({
      contradiction_category_id: category.contradiction_category_id,
      label: category.label,
      record_state: "Not Assessable",
      contradiction_detected: null,
      materiality: null,
      affected_result_ids: [],
      description: null,
      resolution: null,
      dissent_ids: [],
      decision_receipt_id: null
    })),
    exact_next_artifact: adjudication.exact_next_artifact,
    source_ids: cohort.source_ids,
    signal_ids: cohort.signal_ids,
    evidence_gap_ids: cohort.evidence_gap_ids,
    canonical_briefing_id: cohort.canonical_briefing_id,
    reader_pathway_ids: cohort.reader_pathway_ids,
    local_system_ids: cohort.local_system_ids,
    dependency_map_ids: ["dependency-map-registered-design-is-not-published-result", "dependency-map-adjudicated-result-is-not-decision-recommendation"],
    synthesis_question: null,
    protocol_version: null,
    eligible_result_ids: [],
    excluded_result_records: [],
    shared_dependency_records: [],
    compatibility_records: [],
    triangulation_records: [],
    replication_portfolio_records: [],
    heterogeneity_records: [],
    adverse_or_null_result_ids: [],
    selected_evidence_grade_id: null,
    proposed_synthesis_language: null,
    uncertainty_statement: null,
    limitation_statement: null,
    dissent_statement_ids: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    synthesis_receipt_id: null,
    propagation_status: "not_started",
    automatic_pooling_allowed: false,
    automatic_evidence_grade_allowed: false,
    automatic_claim_publication_allowed: false,
    automatic_recommendation_allowed: false,
    automatic_scoring_allowed: false,
    automatic_ranking_allowed: false,
    phase64_cell_change: "none"
  };
});

const externalChallengeResponseDockets = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  return {
    external_challenge_response_docket_id: `74-XCR-${padded}`,
    record_kind: "external_challenge_response_docket",
    record_status: "Published",
    challenge_state: "Inactive - No Synthesis Claim",
    challenge_decision: "Not Open",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    named_entity: cohort.named_entity,
    synthesis_contradiction_dossier_id: `74-SYN-${padded}`,
    challenge_checks: challengeReviewGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No synthesis claim exists to challenge." })),
    challenge_packet_ids: [],
    challenger_identity_records: [],
    conflict_disclosure_ids: [],
    challenged_claim_versions: [],
    evidence_submission_ids: [],
    reproducible_critique_ids: [],
    response_packet_ids: [],
    independent_adjudication_ids: [],
    revision_decision_ids: [],
    reader_notice_ids: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    challenge_receipt_ids: [],
    propagation_status: "not_started",
    anonymous_assertion_is_evidence: false,
    automatic_claim_reversal_allowed: false,
    automatic_publication_allowed: false,
    silent_challenge_disposition_allowed: false,
    phase64_cell_change: "none"
  };
});

const decisionTranslationReevaluationRegisters = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  return {
    decision_translation_reevaluation_register_id: `74-DTR-${padded}`,
    record_kind: "decision_translation_reevaluation_register",
    record_status: "Published",
    translation_state: "Inactive - No Adjudicated Synthesis",
    translation_decision: "No Decision Translation",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    named_entity: cohort.named_entity,
    synthesis_contradiction_dossier_id: `74-SYN-${padded}`,
    external_challenge_response_docket_id: `74-XCR-${padded}`,
    translation_checks: decisionTranslationGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No adjudicated synthesis exists." })),
    reevaluation_trigger_records: reevaluationTriggers.map((trigger) => ({ trigger_id: trigger.trigger_id, label: trigger.label, trigger_state: "Dormant", event_ids: [] })),
    decision_audience: null,
    decision_authority: null,
    exact_decision_question: null,
    synthesis_claim_id: null,
    evidence_grade_id: null,
    decision_option_records: [],
    status_quo_option_id: null,
    benefit_records: [],
    harm_records: [],
    distributional_records: [],
    feasibility_records: [],
    uncertainty_scenario_records: [],
    reversibility_record: null,
    legal_authority_record: null,
    recommendation_conflict_records: [],
    proposed_recommendation: null,
    monitoring_plan_id: null,
    sunset_date: null,
    next_reevaluation_date: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    translation_receipt_id: null,
    propagation_status: "not_started",
    automatic_recommendation_allowed: false,
    automatic_adoption_allowed: false,
    automatic_sunset_extension_allowed: false,
    automatic_scoring_allowed: false,
    automatic_ranking_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "74",
  registry_id: "evidence-synthesis-challenge-decision-translation-registry-001",
  title: "Evidence Synthesis, Contradiction, External Challenge, Decision Translation And Reevaluation Registry",
  captured_date: "2026-08-24",
  as_of_date: "2026-08-24",
  scope: "Thirty-two inactive result-synthesis input dockets, eight inactive synthesis-contradiction dossiers, eight inactive external challenge-response dockets, and eight inactive decision-translation and reevaluation registers for the Phase 73 result layer.",
  interpretation_boundary: "An adjudicated result is not a body of evidence. Convergence is not independence. A synthesis is not a decision recommendation. A recommendation is not authorization or an operating outcome. Contradictions, challenges, dissent, corrections, sunset rules, and reevaluation duties cannot be hidden or automated.",
  synthesis_eligibility_gates: synthesisEligibilityGates,
  synthesis_gates: synthesisGates,
  evidence_grade_classes: evidenceGradeClasses,
  contradiction_categories: contradictionCategories,
  challenge_review_gates: challengeReviewGates,
  decision_translation_gates: decisionTranslationGates,
  reevaluation_triggers: reevaluationTriggers,
  input_states: ["Inactive - No Adjudicated Result", "Under Eligibility Review", "Held", "Eligible For Synthesis", "Excluded", "Superseded"],
  synthesis_states: ["Inactive - No Eligible Results", "Protocol Registered", "Under Synthesis", "Held", "Eligible For Human Adjudication", "Published Bounded Synthesis", "Rejected", "Superseded"],
  challenge_states: ["Inactive - No Synthesis Claim", "Open For Challenge", "Under Response", "Under Independent Adjudication", "Resolved", "Held"],
  translation_states: ["Inactive - No Adjudicated Synthesis", "Under Option Translation", "Held", "Eligible For Human Decision", "Published Bounded Recommendation", "Rejected", "Sunset", "Superseded"],
  metrics: {
    result_synthesis_input_dockets: synthesisInputDockets.length,
    inactive_result_synthesis_input_dockets: synthesisInputDockets.length,
    synthesis_contradiction_dossiers: synthesisContradictionDossiers.length,
    inactive_synthesis_contradiction_dossiers: synthesisContradictionDossiers.length,
    external_challenge_response_dockets: externalChallengeResponseDockets.length,
    inactive_external_challenge_response_dockets: externalChallengeResponseDockets.length,
    decision_translation_reevaluation_registers: decisionTranslationReevaluationRegisters.length,
    inactive_decision_translation_reevaluation_registers: decisionTranslationReevaluationRegisters.length,
    synthesis_eligibility_gates: synthesisEligibilityGates.length,
    synthesis_gates: synthesisGates.length,
    evidence_grade_classes: evidenceGradeClasses.length,
    contradiction_categories: contradictionCategories.length,
    challenge_review_gates: challengeReviewGates.length,
    decision_translation_gates: decisionTranslationGates.length,
    reevaluation_triggers: reevaluationTriggers.length,
    adjudicated_results_received: 0,
    synthesis_inputs_admitted: 0,
    synthesis_protocols_registered: 0,
    contradictions_recorded: 0,
    replications_portfolioed: 0,
    evidence_grades_assigned: 0,
    syntheses_adjudicated: 0,
    synthesis_claims_published: 0,
    challenges_received: 0,
    challenge_responses_published: 0,
    recommendations_published: 0,
    decision_authorizations_issued: 0,
    reevaluations_scheduled: 0,
    corrections_issued: 0,
    withdrawals_issued: 0,
    scores_created: 0,
    rankings_created: 0,
    decision_receipts_created: 0,
    phase64_cells_advanced: 0
  },
  result_synthesis_input_dockets: synthesisInputDockets,
  synthesis_contradiction_dossiers: synthesisContradictionDossiers,
  external_challenge_response_dockets: externalChallengeResponseDockets,
  decision_translation_reevaluation_registers: decisionTranslationReevaluationRegisters
};

await writeJson(join(dataRoot, "phase-74-evidence-synthesis-challenge-decision-translation-registry.json"), registry);

const pathwayIds = [...new Set(synthesisInputDockets.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", `${pathwayId.replace("reader-pathway-", "")}.json`);
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, "briefing-evidence-synthesis-desk-001", "briefing-challenge-decision-translation-desk-001"] )];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, "dependency-map-adjudicated-result-is-not-decision-recommendation"] )];
  await writeJson(path, pathway);
}

for (const cohort of phase68.cohort_records) {
  const inputs = synthesisInputDockets.filter((record) => record.cohort_id === cohort.cohort_id);
  const synthesis = synthesisContradictionDossiers.find((record) => record.cohort_id === cohort.cohort_id);
  const path = join(contentRoot, "briefings", `${cohort.canonical_briefing_id}.mdx`);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 74 synthesis and decision-translation boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 74 synthesis and decision-translation boundary\n\n[Evidence Synthesis Desk 001](/briefings/evidence-synthesis-desk-001/) assigns four inactive synthesis-input dockets to this named file: ${inputs.map((record) => `[${record.result_synthesis_input_docket_id}](/evidence/synthesis/${record.slug}/)`).join(", ")}. [${synthesis.synthesis_contradiction_dossier_id}](/evidence/synthesis/${synthesis.slug}/) remains Inactive with no eligible result, synthesis, contradiction, evidence grade, external challenge, recommendation, sunset, reevaluation, reviewer, receipt, score, rank, or Phase 64 cell change.\n`;
    await writeFile(path, body, "utf8");
  }
}

const localFileById = {
  "local-us-southwest-chip-corridor": "local-us-southwest-chip-corridor.mdx",
  "local-ontario-real-estate": "local-ontario-real-estate.mdx",
  "local-northern-virginia-data-center-corridor": "local-northern-virginia-data-center-corridor.mdx",
  "local-florida-space-coast-launch-corridor": "local-florida-space-coast-launch-corridor.mdx",
  "local-nevada-lithium-processing-corridor": "local-nevada-lithium-processing-corridor.mdx"
};
for (const [localId, filename] of Object.entries(localFileById)) {
  const cohorts = phase68.cohort_records.filter((record) => record.local_system_ids.includes(localId));
  const path = join(contentRoot, "local-systems", filename);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 74 synthesis boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 74 synthesis boundary\n\nThe [Evidence Synthesis And Decision Registry](/evidence/synthesis/) publishes inactive synthesis, contradiction, challenge, translation, and reevaluation contracts for ${cohorts.map((record) => record.named_entity).join(" and ")}. A local result, several concordant outputs, or a high evidence grade cannot become a recommendation or authorization without independence, contradiction, adverse-evidence, external-challenge, option, harm, equity, feasibility, dissent, sunset, and dual-review controls.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-registered-analysis-execution-desk-001.mdx",
  "briefing-result-adjudication-desk-001.mdx",
  "briefing-outcome-evidence-packet-desk-001.mdx",
  "briefing-counterfactual-design-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 74 evidence synthesis and decision translation")) {
    body = `${body.trimEnd()}\n\n## Phase 74 evidence synthesis and decision translation\n\n[Evidence Synthesis Desk 001](/briefings/evidence-synthesis-desk-001/) and the [Challenge And Decision Translation Desk](/briefings/challenge-decision-translation-desk-001/) add thirty-two inactive synthesis-input dockets and eight each of synthesis-contradiction, external-challenge, and decision-translation/reevaluation controls. They create zero adjudicated-result inputs, syntheses, contradictions, evidence grades, challenge decisions, recommendations, authorizations, reevaluations, corrections, withdrawals, scores, rankings, receipts, or stage changes.\n`;
    await writeFile(path, body, "utf8");
  }
}

console.log(`Phase 74 content built: ${synthesisInputDockets.length} inactive inputs, ${synthesisContradictionDossiers.length} inactive synthesis dossiers, ${externalChallengeResponseDockets.length} inactive challenge dockets, ${decisionTranslationReevaluationRegisters.length} inactive translation registers, ${synthesisEligibilityGates.length} input gates, ${synthesisGates.length} synthesis gates, ${contradictionCategories.length} contradiction categories, ${challengeReviewGates.length} challenge gates, ${decisionTranslationGates.length} translation gates, ${reevaluationTriggers.length} reevaluation triggers, ${pathwayIds.length} pathways, and 0 syntheses or recommendations.`);
