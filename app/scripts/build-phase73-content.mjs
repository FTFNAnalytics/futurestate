import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const phase68 = await readJson(join(dataRoot, "phase-68-compatible-series-outcome-cohorts.json"));
const phase72 = await readJson(join(dataRoot, "phase-72-outcome-evidence-counterfactual-design-registry.json"));

const executionGates = [
  ["73-EXEC-01-DESIGN", "Registered design and authorization", "The exact Phase 72 design, registration receipt, authorized question, estimand, and execution scope are present."],
  ["73-EXEC-02-INPUT", "Frozen input snapshot", "Every input, inclusion, exclusion, version, period, checksum, and lineage receipt is frozen before execution."],
  ["73-EXEC-03-CODE", "Code and calculation identity", "The analysis repository, immutable commit, dependency graph, tests, and calculation entrypoint are identified."],
  ["73-EXEC-04-ENVIRONMENT", "Environment and runtime identity", "The operating environment, package lock, container or runtime, architecture, locale, and environment digest are reproducible."],
  ["73-EXEC-05-PLAN", "Analysis plan and estimand lock", "The registered plan version, outcome, contrast, estimand, transformations, model, and decision rules match the authorized design."],
  ["73-EXEC-06-RANDOMNESS", "Randomness and seed commitment", "Random seeds, allocation material, stochastic procedures, and entropy commitments are frozen without exposing blinded results."],
  ["73-EXEC-07-AUTHORITY", "Runner identity and least privilege", "The authorized runner, access scope, conflict status, separation of duties, and data-handling boundary are recorded."],
  ["73-EXEC-08-PREFLIGHT", "Preflight tests and failure rules", "Schema, unit, integration, negative, boundary, and expected-failure tests pass before the production run."],
  ["73-EXEC-09-BLINDING", "Blinding and masking control", "Result visibility, label masking, blind-break authority, leakage tests, and prohibited inspection paths are explicit."],
  ["73-EXEC-10-LOG", "Immutable execution log", "Start, stop, command, input, environment, warning, error, retry, and operator events are append-only and receipt-bound."],
  ["73-EXEC-11-OUTPUT", "Output manifest and checksums", "Every output, table, figure, diagnostic, excluded result, checksum, and retention location appears in one manifest."],
  ["73-EXEC-12-DEVIATION", "Deviation and amendment capture", "Planned and unplanned departures are recorded before interpretation and linked to their adjudication or amendment receipt."],
  ["73-EXEC-13-REPLICATION", "Independent execution or replication", "A separately authorized runner can reproduce the primary output from the frozen bundle without undisclosed intervention."],
  ["73-EXEC-14-DECISION", "Dual review, execution receipt, and propagation", "Two independent reviewers authorize the bounded execution state and complete every assigned propagation surface."],
].map(([gate_id, label, question]) => ({ gate_id, label, question }));

const deviationCategories = [
  ["73-DEV-01-ELIGIBILITY", "Eligibility, population, or inclusion change"],
  ["73-DEV-02-INPUT", "Input, source, version, or lineage change"],
  ["73-DEV-03-MEASURE", "Outcome, variable, unit, or denominator change"],
  ["73-DEV-04-TIME", "Baseline, follow-up, cadence, lag, or window change"],
  ["73-DEV-05-COMPARISON", "Comparison, control, matching, or donor-pool change"],
  ["73-DEV-06-METHOD", "Model, estimator, transformation, or threshold change"],
  ["73-DEV-07-MISSING", "Missing-data, attrition, exclusion, or censoring change"],
  ["73-DEV-08-INTERFERENCE", "Interference, spillover, contamination, or treatment-version change"],
  ["73-DEV-09-ENVIRONMENT", "Code, dependency, environment, runtime, or execution change"],
  ["73-DEV-10-POSTRESULT", "Post-result, unblinding, interpretation, or disclosure change"],
].map(([category_id, label]) => ({ category_id, label }));

const adjudicationGates = [
  ["73-ADJ-01-EXECUTION", "Authorized execution and complete receipt", "The adjudication resolves to a complete, authorized, reproducible Phase 73 execution bundle."],
  ["73-ADJ-02-BLIND", "Blind-break authorization", "The result was not inspected before the registered design and execution receipts authorized unblinding."],
  ["73-ADJ-03-PRIMARY", "Primary result and estimand", "The reported result matches the registered primary outcome, contrast, population, period, and estimand."],
  ["73-ADJ-04-UNCERTAINTY", "Uncertainty and precision", "Intervals, coverage, model or sampling uncertainty, practical magnitude, and failure to distinguish effects are explicit."],
  ["73-ADJ-05-ROBUSTNESS", "Robustness and sensitivity", "Every predeclared alternative specification and sensitivity result is visible, including reversals and failures."],
  ["73-ADJ-06-FALSIFICATION", "Falsification and negative controls", "Placebos, pre-trends, negative controls, balance, discontinuity, and manipulation tests are adjudicated against failure rules."],
  ["73-ADJ-07-ADVERSE", "Null, adverse, and disconfirming results", "Nulls, harms, reversals, exclusions, warnings, and disconfirming outputs remain attached to the result bundle."],
  ["73-ADJ-08-MULTIPLICITY", "Subgroups and multiplicity", "Exploratory analyses, subgroup selection, repeated testing, family-wise decisions, and multiplicity adjustments are explicit."],
  ["73-ADJ-09-DEVIATIONS", "Deviations and amendments", "Every deviation, discovery stage, materiality assessment, amendment, impact on estimand, and reviewer disposition is visible."],
  ["73-ADJ-10-REPLICATION", "Independent replication", "An independent execution or replication result, differences, unresolved failures, and reproducibility limits are assessed."],
  ["73-ADJ-11-ALTERNATIVES", "Alternative explanations and design assumptions", "Phase 72 alternatives, identification assumptions, confounding, spillovers, attrition, and measurement limits are revisited after execution."],
  ["73-ADJ-12-LANGUAGE", "Claim class and verb strength", "The proposed language stays within the strongest evidence class supported after all adverse, deviation, and replication review."],
  ["73-ADJ-13-CORRECTION", "Correction and withdrawal readiness", "Result identity, public lineage, supersession, correction, withdrawal, and reader-notice procedures are ready before publication."],
  ["73-ADJ-14-DECISION", "Dual adjudication, receipt, and propagation", "Two independent reviewers issue one bounded claim decision and complete every assigned public and operational propagation surface."],
].map(([gate_id, label, question]) => ({ gate_id, label, question }));

const correctionClasses = [
  ["73-CORR-01-INPUT", "Source, input, or lineage correction"],
  ["73-CORR-02-CODE", "Calculation, code, or output correction"],
  ["73-CORR-03-ENVIRONMENT", "Environment, dependency, or runtime correction"],
  ["73-CORR-04-METHOD", "Method, model, estimand, or design correction"],
  ["73-CORR-05-INTERPRETATION", "Interpretation, uncertainty, or claim-strength correction"],
  ["73-CORR-06-ATTRIBUTION", "Comparison, alternative-explanation, attribution, or causal correction"],
  ["73-CORR-07-DISCLOSURE", "Disclosure, conflict, limitation, or provenance correction"],
  ["73-CORR-08-WITHDRAWAL", "Withdrawal, retraction, or complete supersession"],
].map(([correction_class_id, label]) => ({ correction_class_id, label }));

const designByCohort = new Map(phase72.counterfactual_design_dockets.map((record) => [record.cohort_id, record]));
const cohortIndex = new Map(phase68.cohort_records.map((record, index) => [record.cohort_id, index]));

const analysisExecutionDockets = phase72.outcome_evidence_packets.map((packet, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const cohortNumber = String(cohortIndex.get(packet.cohort_id) + 1).padStart(3, "0");
  const design = designByCohort.get(packet.cohort_id);
  return {
    analysis_execution_docket_id: `73-AEX-${padded}`,
    slug: packet.slug.replace(/^72-oep-/, "73-aex-"),
    record_kind: "analysis_execution_docket",
    record_status: "Published",
    execution_state: "Inactive - No Registered Design",
    execution_decision: "Not Authorized",
    evidence_packet_id: packet.evidence_packet_id,
    evidence_packet_slug: packet.slug,
    counterfactual_docket_id: design.counterfactual_docket_id,
    counterfactual_docket_slug: design.slug,
    counterfactual_design_state: design.design_state,
    cohort_id: packet.cohort_id,
    file_id: packet.file_id,
    file_kind: packet.file_kind,
    named_entity: packet.named_entity,
    measure_id: packet.measure_id,
    measure_label: packet.measure_label,
    execution_checks: executionGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No Phase 72 design is registered for result inspection." })),
    protocol_deviation_register_id: `73-PDR-${cohortNumber}`,
    result_adjudication_docket_id: `73-RAD-${cohortNumber}`,
    correction_withdrawal_register_id: `73-CWR-${cohortNumber}`,
    exact_next_artifact: packet.exact_next_artifact,
    source_ids: packet.source_ids,
    signal_ids: packet.signal_ids,
    evidence_gap_ids: packet.evidence_gap_ids,
    canonical_briefing_id: packet.canonical_briefing_id,
    reader_pathway_ids: packet.reader_pathway_ids,
    local_system_ids: packet.local_system_ids,
    dependency_map_ids: ["dependency-map-descriptive-change-is-not-causal-effect", "dependency-map-registered-design-is-not-published-result"],
    registered_design_receipt_id: null,
    frozen_input_snapshot_id: null,
    input_manifest_ids: [],
    code_repository_url: null,
    code_commit_sha: null,
    environment_lock_id: null,
    environment_digest: null,
    container_or_runtime_id: null,
    analysis_plan_version: null,
    estimand_id: null,
    random_seed_commitment: null,
    runner_identity: null,
    execution_started_at: null,
    execution_completed_at: null,
    immutable_execution_log_id: null,
    output_manifest_id: null,
    primary_result_artifact_id: null,
    replication_execution_ids: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    execution_receipt_id: null,
    propagation_status: "not_started",
    execution_allowed: false,
    result_unblinding_allowed: false,
    automatic_rerun_allowed: false,
    automatic_result_publication_allowed: false,
    phase64_cell_change: "none"
  };
});

const protocolDeviationRegisters = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const design = designByCohort.get(cohort.cohort_id);
  return {
    protocol_deviation_register_id: `73-PDR-${padded}`,
    record_kind: "protocol_deviation_register",
    record_status: "Published",
    register_state: "Empty - No Authorized Execution",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    named_entity: cohort.named_entity,
    counterfactual_docket_id: design.counterfactual_docket_id,
    analysis_execution_docket_ids: analysisExecutionDockets.filter((record) => record.cohort_id === cohort.cohort_id).map((record) => record.analysis_execution_docket_id),
    category_records: deviationCategories.map((category) => ({
      category_id: category.category_id,
      label: category.label,
      record_state: "Not Recorded",
      deviation_detected: null,
      planned_or_unplanned: null,
      discovery_stage: null,
      materiality: null,
      description: null,
      reason: null,
      impact_on_estimand: null,
      amendment_artifact_id: null,
      reviewer_disposition: null,
      decision_receipt_id: null
    })),
    deviation_event_ids: [],
    protocol_amendment_ids: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    decision_receipt_id: null,
    propagation_status: "not_started",
    silence_means_no_deviation: false,
    automatic_waiver_allowed: false,
    phase64_cell_change: "none"
  };
});

const correctionWithdrawalRegisters = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  return {
    correction_withdrawal_register_id: `73-CWR-${padded}`,
    record_kind: "correction_withdrawal_register",
    record_status: "Published",
    register_state: "Empty - No Published Result",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    named_entity: cohort.named_entity,
    correction_classes: correctionClasses.map((item) => ({ correction_class_id: item.correction_class_id, label: item.label, event_state: "No Event", event_ids: [] })),
    published_result_ids: [],
    correction_event_ids: [],
    withdrawal_event_ids: [],
    supersession_event_ids: [],
    reader_notice_ids: [],
    current_public_result_id: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    decision_receipt_ids: [],
    propagation_status: "not_started",
    silent_correction_allowed: false,
    automatic_withdrawal_allowed: false,
    phase64_cell_change: "none"
  };
});

const resultAdjudicationDockets = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const short = cohort.cohort_id.toLowerCase().replace(/^68-cohort-\d+-/, "");
  const design = designByCohort.get(cohort.cohort_id);
  return {
    result_adjudication_docket_id: `73-RAD-${padded}`,
    slug: `73-rad-${padded}-${short}`,
    record_kind: "result_adjudication_docket",
    record_status: "Published",
    adjudication_state: "Inactive - No Blinded Result",
    adjudication_decision: "Not Adjudicated",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    file_kind: cohort.file_kind,
    named_entity: cohort.named_entity,
    counterfactual_docket_id: design.counterfactual_docket_id,
    counterfactual_docket_slug: design.slug,
    counterfactual_design_state: design.design_state,
    analysis_execution_docket_ids: analysisExecutionDockets.filter((record) => record.cohort_id === cohort.cohort_id).map((record) => record.analysis_execution_docket_id),
    protocol_deviation_register_id: `73-PDR-${padded}`,
    correction_withdrawal_register_id: `73-CWR-${padded}`,
    adjudication_checks: adjudicationGates.map((gate) => ({ gate_id: gate.gate_id, label: gate.label, decision_state: "Inactive", basis: "No authorized execution or blinded result exists." })),
    exact_next_artifact: design.exact_next_artifact,
    source_ids: cohort.source_ids,
    signal_ids: cohort.signal_ids,
    evidence_gap_ids: cohort.evidence_gap_ids,
    canonical_briefing_id: cohort.canonical_briefing_id,
    reader_pathway_ids: cohort.reader_pathway_ids,
    local_system_ids: cohort.local_system_ids,
    dependency_map_ids: ["dependency-map-registered-design-is-not-published-result"],
    blind_break_authorization_id: null,
    primary_result_artifact_id: null,
    primary_effect_record: null,
    uncertainty_record: null,
    robustness_records: [],
    falsification_records: [],
    adverse_or_null_result_ids: [],
    subgroup_records: [],
    multiplicity_adjustment: null,
    deviation_record_ids: [],
    replication_records: [],
    alternative_explanation_disposition_ids: [],
    selected_claim_class_id: null,
    proposed_public_language: null,
    adjudicated_claim_strength: null,
    limitation_statement: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    adjudication_receipt_id: null,
    propagation_status: "not_started",
    automatic_claim_upgrade_allowed: false,
    automatic_causal_publication_allowed: false,
    automatic_scoring_allowed: false,
    automatic_ranking_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "73",
  registry_id: "registered-analysis-execution-result-adjudication-registry-001",
  title: "Registered Analysis Execution, Deviation, Result Adjudication And Correction Registry",
  captured_date: "2026-08-23",
  as_of_date: "2026-08-23",
  scope: "Thirty-two inactive analysis-execution dockets, eight empty protocol-deviation registers, eight inactive result-adjudication dockets, and eight empty correction-withdrawal registers for the Phase 72 claim and design layer.",
  interpretation_boundary: "A registered design is not an authorized execution. Reproducible execution is not a valid result. A result is not a publishable claim. Replication does not erase deviations, nulls, adverse evidence, uncertainty, corrections, or withdrawal duties. No result may be inspected or published automatically.",
  execution_gates: executionGates,
  deviation_categories: deviationCategories,
  adjudication_gates: adjudicationGates,
  correction_classes: correctionClasses,
  execution_states: ["Inactive - No Registered Design", "Preflight", "Held", "Authorized For Blinded Execution", "Executed - Awaiting Adjudication", "Rejected"],
  deviation_register_states: ["Empty - No Authorized Execution", "Recording", "Under Review", "Complete For Adjudication", "Held"],
  adjudication_states: ["Inactive - No Blinded Result", "Under Blinded Intake", "Held", "Eligible For Human Adjudication", "Published Bounded Result", "Rejected"],
  correction_register_states: ["Empty - No Published Result", "Monitoring", "Correction Pending", "Withdrawal Pending", "Superseded"],
  metrics: {
    analysis_execution_dockets: analysisExecutionDockets.length,
    inactive_analysis_execution_dockets: analysisExecutionDockets.length,
    protocol_deviation_registers: protocolDeviationRegisters.length,
    empty_protocol_deviation_registers: protocolDeviationRegisters.length,
    result_adjudication_dockets: resultAdjudicationDockets.length,
    inactive_result_adjudication_dockets: resultAdjudicationDockets.length,
    correction_withdrawal_registers: correctionWithdrawalRegisters.length,
    empty_correction_withdrawal_registers: correctionWithdrawalRegisters.length,
    execution_gates: executionGates.length,
    deviation_categories: deviationCategories.length,
    adjudication_gates: adjudicationGates.length,
    correction_classes: correctionClasses.length,
    registered_designs_received: 0,
    executions_authorized: 0,
    executions_completed: 0,
    deviations_recorded: 0,
    results_unblinded: 0,
    results_adjudicated: 0,
    independent_replications_completed: 0,
    claims_published: 0,
    causal_claims_published: 0,
    corrections_issued: 0,
    withdrawals_issued: 0,
    scores_created: 0,
    rankings_created: 0,
    decision_receipts_created: 0,
    phase64_cells_advanced: 0
  },
  analysis_execution_dockets: analysisExecutionDockets,
  protocol_deviation_registers: protocolDeviationRegisters,
  result_adjudication_dockets: resultAdjudicationDockets,
  correction_withdrawal_registers: correctionWithdrawalRegisters
};

await writeJson(join(dataRoot, "phase-73-analysis-execution-result-adjudication-registry.json"), registry);

const pathwayIds = [...new Set(analysisExecutionDockets.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", `${pathwayId.replace("reader-pathway-", "")}.json`);
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, "briefing-registered-analysis-execution-desk-001", "briefing-result-adjudication-desk-001"] )];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, "dependency-map-registered-design-is-not-published-result"] )];
  await writeJson(path, pathway);
}

for (const cohort of phase68.cohort_records) {
  const executions = analysisExecutionDockets.filter((record) => record.cohort_id === cohort.cohort_id);
  const adjudication = resultAdjudicationDockets.find((record) => record.cohort_id === cohort.cohort_id);
  const path = join(contentRoot, "briefings", `${cohort.canonical_briefing_id}.mdx`);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 73 execution and result-adjudication boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 73 execution and result-adjudication boundary\n\n[Registered Analysis Execution Desk 001](/briefings/registered-analysis-execution-desk-001/) assigns four inactive execution dockets to this named file: ${executions.map((record) => `[${record.analysis_execution_docket_id}](/evidence/analysis/${record.slug}/)`).join(", ")}. [${adjudication.result_adjudication_docket_id}](/evidence/analysis/${adjudication.slug}/) remains Inactive with no result, deviation, replication, correction, withdrawal, reviewer, receipt, score, rank, or Phase 64 cell change.\n`;
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
  if (!body.includes("## Phase 73 execution boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 73 execution boundary\n\nThe [Analysis Execution And Result Registry](/evidence/analysis/) publishes inactive execution and adjudication contracts for ${cohorts.map((record) => record.named_entity).join(" and ")}. Local relevance, a registered design, successful code execution, or one favorable output cannot become a public result without deviation review, robustness and falsification checks, independent replication, claim-strength adjudication, and correction readiness.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-outcome-evidence-packet-desk-001.mdx",
  "briefing-counterfactual-design-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx",
  "briefing-longitudinal-panel-desk-001.mdx",
  "briefing-series-admission-protocol-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 73 registered execution and adjudication control")) {
    body = `${body.trimEnd()}\n\n## Phase 73 registered execution and adjudication control\n\n[Registered Analysis Execution Desk 001](/briefings/registered-analysis-execution-desk-001/) and the [Result Adjudication Desk](/briefings/result-adjudication-desk-001/) add thirty-two inactive execution dockets, eight empty deviation registers, eight inactive adjudication dockets, and eight empty correction-withdrawal registers. They create zero registered-design receipts, executions, deviations, unblinded results, replications, claims, corrections, withdrawals, scores, rankings, receipts, or stage changes.\n`;
    await writeFile(path, body, "utf8");
  }
}

console.log(`Phase 73 content built: ${analysisExecutionDockets.length} inactive execution dockets, ${protocolDeviationRegisters.length} empty deviation registers, ${resultAdjudicationDockets.length} inactive adjudication dockets, ${correctionWithdrawalRegisters.length} empty correction registers, ${executionGates.length} execution gates, ${deviationCategories.length} deviation categories, ${adjudicationGates.length} adjudication gates, ${correctionClasses.length} correction classes, ${pathwayIds.length} pathways, and 0 executions or results.`);
