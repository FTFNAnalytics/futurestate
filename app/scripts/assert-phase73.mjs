import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const phase68 = await readJson("src", "data", "phase-68-compatible-series-outcome-cohorts.json");
const phase72 = await readJson("src", "data", "phase-72-outcome-evidence-counterfactual-design-registry.json");
const registry = await readJson("src", "data", "phase-73-analysis-execution-result-adjudication-registry.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-73-analysis-execution-result-adjudication.json");
const executionBriefing = await readText("src", "content", "briefings", "briefing-registered-analysis-execution-desk-001.mdx");
const adjudicationBriefing = await readText("src", "content", "briefings", "briefing-result-adjudication-desk-001.mdx");
const operatingBriefings = await Promise.all([
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-outcome-evidence-packet-desk-001.mdx",
  "briefing-counterfactual-design-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx",
  "briefing-longitudinal-panel-desk-001.mdx",
  "briefing-series-admission-protocol-001.mdx"
].map((name) => readText("src", "content", "briefings", name)));
const map = await readJson("src", "content", "dependency-maps", "registered-design-is-not-published-result.json");
const endpoint = await readText("src", "pages", "data", "analysis-execution-result-adjudication.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");
const registryPage = await readText("src", "pages", "evidence", "analysis", "index.astro");
const detailPage = await readText("src", "pages", "evidence", "analysis", "[id].astro");
const phase72Detail = await readText("src", "pages", "evidence", "claims", "[id].astro");
const sitemap = await readText("src", "pages", "sitemap.xml.ts");

check(registry.schema_version === "1.0" && registry.phase === "73", "The Phase 73 registry must identify schema 1.0 and Phase 73.");
check(registry.execution_gates.length === 14 && registry.deviation_categories.length === 10 && registry.adjudication_gates.length === 14 && registry.correction_classes.length === 8, "Phase 73 must define fourteen execution gates, ten deviation categories, fourteen adjudication gates, and eight correction classes.");
check(registry.analysis_execution_dockets.length === 32 && registry.protocol_deviation_registers.length === 8 && registry.result_adjudication_dockets.length === 8 && registry.correction_withdrawal_registers.length === 8, "Phase 73 must contain 32 execution dockets and 8 each of deviation, adjudication, and correction registers.");
check(new Set(registry.analysis_execution_dockets.map((record) => record.analysis_execution_docket_id)).size === 32 && new Set(registry.analysis_execution_dockets.map((record) => record.slug)).size === 32, "Execution docket IDs and slugs must be unique.");
check(new Set(registry.protocol_deviation_registers.map((record) => record.protocol_deviation_register_id)).size === 8, "Deviation register IDs must be unique.");
check(new Set(registry.result_adjudication_dockets.map((record) => record.result_adjudication_docket_id)).size === 8 && new Set(registry.result_adjudication_dockets.map((record) => record.slug)).size === 8, "Adjudication docket IDs and slugs must be unique.");
check(new Set(registry.correction_withdrawal_registers.map((record) => record.correction_withdrawal_register_id)).size === 8, "Correction register IDs must be unique.");

for (const packet of phase72.outcome_evidence_packets) {
  const executions = registry.analysis_execution_dockets.filter((record) => record.evidence_packet_id === packet.evidence_packet_id);
  check(executions.length === 1, `${packet.evidence_packet_id} must map to exactly one execution docket.`);
  const execution = executions[0];
  if (!execution) continue;
  const design = phase72.counterfactual_design_dockets.find((record) => record.cohort_id === packet.cohort_id);
  check(execution.evidence_packet_slug === packet.slug && execution.counterfactual_docket_id === design?.counterfactual_docket_id && execution.counterfactual_docket_slug === design?.slug && execution.cohort_id === packet.cohort_id && execution.file_id === packet.file_id && execution.named_entity === packet.named_entity && execution.measure_id === packet.measure_id, `${execution.analysis_execution_docket_id} changes an upstream identity.`);
  check(execution.execution_checks.length === 14 && execution.execution_checks.every((item) => item.decision_state === "Inactive"), `${execution.analysis_execution_docket_id} must expose fourteen inactive checks.`);
  check(execution.execution_state === "Inactive - No Registered Design" && execution.execution_decision === "Not Authorized", `${execution.analysis_execution_docket_id} prematurely authorizes an execution.`);
  check(["registered_design_receipt_id", "frozen_input_snapshot_id", "code_repository_url", "code_commit_sha", "environment_lock_id", "environment_digest", "container_or_runtime_id", "analysis_plan_version", "estimand_id", "random_seed_commitment", "runner_identity", "execution_started_at", "execution_completed_at", "immutable_execution_log_id", "output_manifest_id", "primary_result_artifact_id", "first_reviewer_id", "second_reviewer_id", "decision_date", "execution_receipt_id"].every((key) => execution[key] === null), `${execution.analysis_execution_docket_id} invents an execution artifact, identity, output, reviewer, or receipt.`);
  check(execution.input_manifest_ids.length === 0 && execution.replication_execution_ids.length === 0 && execution.propagation_status === "not_started", `${execution.analysis_execution_docket_id} invents an input, replication, or propagation record.`);
  check(execution.execution_allowed === false && execution.result_unblinding_allowed === false && execution.automatic_rerun_allowed === false && execution.automatic_result_publication_allowed === false && execution.phase64_cell_change === "none", `${execution.analysis_execution_docket_id} enables execution, unblinding, automation, publication, or a stage change.`);
}

for (const cohort of phase68.cohort_records) {
  const design = phase72.counterfactual_design_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  const deviation = registry.protocol_deviation_registers.find((record) => record.cohort_id === cohort.cohort_id);
  const adjudication = registry.result_adjudication_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  const correction = registry.correction_withdrawal_registers.find((record) => record.cohort_id === cohort.cohort_id);
  check(deviation?.file_id === cohort.file_id && deviation?.named_entity === cohort.named_entity && deviation?.counterfactual_docket_id === design?.counterfactual_docket_id && deviation?.analysis_execution_docket_ids.length === 4, `${cohort.cohort_id} lacks an exact deviation register.`);
  check(deviation?.register_state === "Empty - No Authorized Execution" && deviation?.category_records.length === 10 && deviation?.category_records.every((item) => item.record_state === "Not Recorded" && item.deviation_detected === null && item.planned_or_unplanned === null && item.discovery_stage === null && item.materiality === null && item.description === null && item.reason === null && item.impact_on_estimand === null && item.amendment_artifact_id === null && item.reviewer_disposition === null && item.decision_receipt_id === null), `${cohort.cohort_id} invents a deviation record.`);
  check(deviation && deviation.deviation_event_ids.length === 0 && deviation.protocol_amendment_ids.length === 0 && deviation.decision_receipt_id === null && deviation.propagation_status === "not_started" && deviation.silence_means_no_deviation === false && deviation.automatic_waiver_allowed === false && deviation.phase64_cell_change === "none", `${cohort.cohort_id} enables a silent or automatic deviation decision.`);
  check(adjudication?.file_id === cohort.file_id && adjudication?.named_entity === cohort.named_entity && adjudication?.counterfactual_docket_id === design?.counterfactual_docket_id && adjudication?.analysis_execution_docket_ids.length === 4 && adjudication?.protocol_deviation_register_id === deviation?.protocol_deviation_register_id && adjudication?.correction_withdrawal_register_id === correction?.correction_withdrawal_register_id, `${cohort.cohort_id} lacks an exact adjudication docket.`);
  check(adjudication?.adjudication_state === "Inactive - No Blinded Result" && adjudication?.adjudication_decision === "Not Adjudicated" && adjudication?.adjudication_checks.length === 14 && adjudication?.adjudication_checks.every((item) => item.decision_state === "Inactive"), `${cohort.cohort_id} prematurely adjudicates a result.`);
  check(adjudication && ["blind_break_authorization_id", "primary_result_artifact_id", "primary_effect_record", "uncertainty_record", "multiplicity_adjustment", "selected_claim_class_id", "proposed_public_language", "adjudicated_claim_strength", "limitation_statement", "first_reviewer_id", "second_reviewer_id", "decision_date", "adjudication_receipt_id"].every((key) => adjudication[key] === null), `${cohort.cohort_id} invents a result, claim, reviewer, or receipt.`);
  check(adjudication && [adjudication.robustness_records, adjudication.falsification_records, adjudication.adverse_or_null_result_ids, adjudication.subgroup_records, adjudication.deviation_record_ids, adjudication.replication_records, adjudication.alternative_explanation_disposition_ids].every((items) => items.length === 0), `${cohort.cohort_id} invents a validation, adverse, deviation, replication, or alternative record.`);
  check(adjudication?.propagation_status === "not_started" && adjudication?.automatic_claim_upgrade_allowed === false && adjudication?.automatic_causal_publication_allowed === false && adjudication?.automatic_scoring_allowed === false && adjudication?.automatic_ranking_allowed === false && adjudication?.phase64_cell_change === "none", `${cohort.cohort_id} enables automatic adjudication or a stage change.`);
  check(correction?.file_id === cohort.file_id && correction?.named_entity === cohort.named_entity && correction?.register_state === "Empty - No Published Result" && correction?.correction_classes.length === 8 && correction?.correction_classes.every((item) => item.event_state === "No Event" && item.event_ids.length === 0), `${cohort.cohort_id} lacks an empty correction register.`);
  check(correction && [correction.published_result_ids, correction.correction_event_ids, correction.withdrawal_event_ids, correction.supersession_event_ids, correction.reader_notice_ids, correction.decision_receipt_ids].every((items) => items.length === 0) && correction.current_public_result_id === null && correction.propagation_status === "not_started" && correction.silent_correction_allowed === false && correction.automatic_withdrawal_allowed === false && correction.phase64_cell_change === "none", `${cohort.cohort_id} invents or hides a correction or withdrawal.`);
}

const pathwayIds = [...new Set(registry.analysis_execution_dockets.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 73 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", `${id.replace("reader-pathway-", "")}.json`);
  check(pathway.briefing_ids.includes("briefing-registered-analysis-execution-desk-001") && pathway.briefing_ids.includes("briefing-result-adjudication-desk-001"), `${id} omits a Phase 73 briefing.`);
  check(pathway.dependency_map_ids.includes("dependency-map-registered-design-is-not-published-result"), `${id} omits the Phase 73 map.`);
}

const canonicalIds = [...new Set(registry.analysis_execution_dockets.map((record) => record.canonical_briefing_id))];
check(canonicalIds.length === 8, "Phase 73 must deepen eight canonical named files.");
for (const id of canonicalIds) check((await readText("src", "content", "briefings", `${id}.mdx`)).includes("## Phase 73 execution and result-adjudication boundary"), `${id} omits Phase 73.`);
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
check(localFiles.length === 5 && (await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)))).every((text) => text.includes("## Phase 73 execution boundary")), "All five local systems must expose the Phase 73 boundary.");

for (const [text, headings] of [[executionBriefing, ["Why execution needs a separate authorization", "Fourteen execution gates", "Frozen input, code, and environment", "Blinding, logging, and outputs", "Deviations and independent replication", "Execution boundary"]], [adjudicationBriefing, ["Why a result is not a claim", "Fourteen adjudication gates", "Robustness, falsification, and adverse results", "Deviations and replication", "Claim strength and publication", "Correction and withdrawal", "Publication boundary"]]]) {
  check(/record_status:\s*"Published"/.test(text), "Both Phase 73 briefings must be Published.");
  headings.forEach((heading) => check(text.includes(`## ${heading}`), `A Phase 73 briefing is missing ${heading}.`));
}
check(operatingBriefings.every((text) => text.includes("## Phase 73 registered execution and adjudication control")), "A required operating briefing omits Phase 73.");
check(map.record_status === "Published" && map.nodes.length === 10 && map.links.length === 9, "The Phase 73 dependency map is incomplete.");
check(map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("causal")) && map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("rank")), "The Phase 73 map must reject causal and ranking inference.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 73 update invents a receipt or decision.");
check(endpoint.includes('"analysis_execution_result_adjudication"') && endpoint.includes("registry.protocol_deviation_registers") && endpoint.includes("registry.correction_withdrawal_registers"), "The Phase 73 public endpoint is incomplete.");
check(dataIndex.includes("Analysis Execution And Result Adjudication") && dataIndex.includes("bounded public contracts"), "The public data index omits Phase 73.");
check(registryPage.includes("data-analysis-registry") && registryPage.includes("Search thirty-two inactive analysis executions") && registryPage.includes("8 empty correction registers"), "The Phase 73 registry page is incomplete.");
check(detailPage.includes("Fourteen execution gates remain Inactive") && detailPage.includes("Ten deviation categories remain Not Recorded") && detailPage.includes("Fourteen adjudication gates remain Inactive") && detailPage.includes("Eight correction classes remain at No Event") && detailPage.includes("A result artifact is not a publishable claim"), "The Phase 73 detail template omits a control boundary.");
check(phase72Detail.includes("analysisRegistry.analysis_execution_dockets") && phase72Detail.includes("Phase 73 destination"), "The Phase 72 detail template omits the Phase 73 handoff.");
check(sitemap.includes("analysisRegistry.analysis_execution_dockets") && sitemap.includes("analysisRegistry.result_adjudication_dockets") && sitemap.includes('\"/evidence/analysis/\"'), "The sitemap source omits Phase 73 routes.");
check(phase72.metrics.registered_counterfactual_designs === 0 && phase72.metrics.inspected_results === 0 && phase72.metrics.published_claims === 0 && phase72.metrics.causal_claims_published === 0, "Phase 73 changes the inherited design or claim baseline.");
check(registry.metrics.registered_designs_received === 0 && registry.metrics.executions_authorized === 0 && registry.metrics.executions_completed === 0 && registry.metrics.deviations_recorded === 0 && registry.metrics.results_unblinded === 0 && registry.metrics.results_adjudicated === 0 && registry.metrics.independent_replications_completed === 0, "Phase 73 creates a design receipt, execution, deviation, result, adjudication, or replication.");
check(registry.metrics.claims_published === 0 && registry.metrics.causal_claims_published === 0 && registry.metrics.corrections_issued === 0 && registry.metrics.withdrawals_issued === 0 && registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0 && registry.metrics.decision_receipts_created === 0 && registry.metrics.phase64_cells_advanced === 0, "Phase 73 creates a claim, correction, withdrawal, score, rank, receipt, or stage change.");

if (failures.length) {
  console.error("Phase 73 assertions failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1);
}

console.log("Phase 73 assertions passed: 32 inactive analysis-execution dockets, 8 empty deviation registers, 8 inactive result-adjudication dockets, 8 empty correction-withdrawal registers, 14 execution gates, 10 deviation categories, 14 adjudication gates, 8 correction classes, 10 pathways, 5 local systems, and 0 design receipts, executions, deviations, results, replications, claims, corrections, withdrawals, receipts, scores, rankings, or stage changes.");
