import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const phase68 = await readJson("src", "data", "phase-68-compatible-series-outcome-cohorts.json");
const phase73 = await readJson("src", "data", "phase-73-analysis-execution-result-adjudication-registry.json");
const registry = await readJson("src", "data", "phase-74-evidence-synthesis-challenge-decision-translation-registry.json");
const update = await readJson("src", "content", "updates", "2026-08-24-phase-74-evidence-synthesis-decision-translation.json");
const synthesisBriefing = await readText("src", "content", "briefings", "briefing-evidence-synthesis-desk-001.mdx");
const decisionBriefing = await readText("src", "content", "briefings", "briefing-challenge-decision-translation-desk-001.mdx");
const operatingBriefings = await Promise.all([
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-registered-analysis-execution-desk-001.mdx",
  "briefing-result-adjudication-desk-001.mdx",
  "briefing-outcome-evidence-packet-desk-001.mdx",
  "briefing-counterfactual-design-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx"
].map((name) => readText("src", "content", "briefings", name)));
const map = await readJson("src", "content", "dependency-maps", "adjudicated-result-is-not-decision-recommendation.json");
const endpoint = await readText("src", "pages", "data", "evidence-synthesis-challenge-decision-translation.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");
const registryPage = await readText("src", "pages", "evidence", "synthesis", "index.astro");
const detailPage = await readText("src", "pages", "evidence", "synthesis", "[id].astro");
const phase73Detail = await readText("src", "pages", "evidence", "analysis", "[id].astro");
const sitemap = await readText("src", "pages", "sitemap.xml.ts");

check(registry.schema_version === "1.0" && registry.phase === "74" && registry.captured_date === "2026-08-24" && registry.as_of_date === "2026-08-24", "The Phase 74 registry must identify schema 1.0, Phase 74, and the 2026-08-24 structural release date.");
check(registry.synthesis_eligibility_gates.length === 14 && registry.synthesis_gates.length === 14 && registry.evidence_grade_classes.length === 7 && registry.contradiction_categories.length === 10, "Phase 74 must define fourteen input gates, fourteen synthesis gates, seven evidence-grade classes, and ten contradiction categories.");
check(registry.challenge_review_gates.length === 12 && registry.decision_translation_gates.length === 14 && registry.reevaluation_triggers.length === 10, "Phase 74 must define twelve challenge gates, fourteen translation gates, and ten reevaluation triggers.");
check(registry.result_synthesis_input_dockets.length === 32 && registry.synthesis_contradiction_dossiers.length === 8 && registry.external_challenge_response_dockets.length === 8 && registry.decision_translation_reevaluation_registers.length === 8, "Phase 74 must contain 32 inputs and 8 each of synthesis, challenge, and translation records.");
check(new Set(registry.result_synthesis_input_dockets.map((record) => record.result_synthesis_input_docket_id)).size === 32 && new Set(registry.result_synthesis_input_dockets.map((record) => record.slug)).size === 32, "Synthesis-input IDs and slugs must be unique.");
check(new Set(registry.synthesis_contradiction_dossiers.map((record) => record.synthesis_contradiction_dossier_id)).size === 8 && new Set(registry.synthesis_contradiction_dossiers.map((record) => record.slug)).size === 8, "Synthesis-dossier IDs and slugs must be unique.");
check(new Set(registry.external_challenge_response_dockets.map((record) => record.external_challenge_response_docket_id)).size === 8, "Challenge docket IDs must be unique.");
check(new Set(registry.decision_translation_reevaluation_registers.map((record) => record.decision_translation_reevaluation_register_id)).size === 8, "Translation register IDs must be unique.");

for (const execution of phase73.analysis_execution_dockets) {
  const inputs = registry.result_synthesis_input_dockets.filter((record) => record.analysis_execution_docket_id === execution.analysis_execution_docket_id);
  check(inputs.length === 1, `${execution.analysis_execution_docket_id} must map to exactly one Phase 74 input.`);
  const input = inputs[0];
  if (!input) continue;
  const adjudication = phase73.result_adjudication_dockets.find((record) => record.cohort_id === execution.cohort_id);
  check(input.analysis_execution_docket_slug === execution.slug && input.result_adjudication_docket_id === adjudication?.result_adjudication_docket_id && input.result_adjudication_docket_slug === adjudication?.slug && input.cohort_id === execution.cohort_id && input.file_id === execution.file_id && input.named_entity === execution.named_entity && input.measure_id === execution.measure_id, `${input.result_synthesis_input_docket_id} changes an upstream identity.`);
  check(input.eligibility_checks.length === 14 && input.eligibility_checks.every((item) => item.decision_state === "Inactive"), `${input.result_synthesis_input_docket_id} must expose fourteen inactive checks.`);
  check(input.input_state === "Inactive - No Adjudicated Result" && input.input_decision === "Not Eligible", `${input.result_synthesis_input_docket_id} prematurely admits a result.`);
  check(["adjudicated_result_id", "adjudication_receipt_id", "current_public_result_id", "result_version", "correction_status", "claim_class_id", "exact_claim_language", "effect_record", "uncertainty_record", "result_period", "design_class", "provisional_evidence_grade_id", "first_reviewer_id", "second_reviewer_id", "decision_date", "eligibility_receipt_id"].every((key) => input[key] === null), `${input.result_synthesis_input_docket_id} invents a result, grade, reviewer, or receipt.`);
  check([input.shared_provenance_ids, input.replication_result_ids, input.adverse_or_null_result_ids].every((items) => items.length === 0) && input.propagation_status === "not_started", `${input.result_synthesis_input_docket_id} invents a synthesis-input record or propagation.`);
  check(input.eligible_for_synthesis === false && input.automatic_evidence_grade_allowed === false && input.automatic_pooling_allowed === false && input.automatic_claim_upgrade_allowed === false && input.phase64_cell_change === "none", `${input.result_synthesis_input_docket_id} enables synthesis automation or a stage change.`);
}

for (const cohort of phase68.cohort_records) {
  const adjudication = phase73.result_adjudication_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  const synthesis = registry.synthesis_contradiction_dossiers.find((record) => record.cohort_id === cohort.cohort_id);
  const challenge = registry.external_challenge_response_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  const translation = registry.decision_translation_reevaluation_registers.find((record) => record.cohort_id === cohort.cohort_id);
  check(synthesis?.file_id === cohort.file_id && synthesis?.named_entity === cohort.named_entity && synthesis?.result_adjudication_docket_id === adjudication?.result_adjudication_docket_id && synthesis?.result_synthesis_input_docket_ids.length === 4, `${cohort.cohort_id} lacks an exact synthesis dossier.`);
  check(synthesis?.synthesis_state === "Inactive - No Eligible Results" && synthesis?.synthesis_decision === "Not Synthesized" && synthesis?.synthesis_checks.length === 14 && synthesis?.synthesis_checks.every((item) => item.decision_state === "Inactive"), `${cohort.cohort_id} prematurely synthesizes evidence.`);
  check(synthesis?.contradiction_register.length === 10 && synthesis?.contradiction_register.every((item) => item.record_state === "Not Assessable" && item.contradiction_detected === null && item.materiality === null && item.affected_result_ids.length === 0 && item.description === null && item.resolution === null && item.dissent_ids.length === 0 && item.decision_receipt_id === null), `${cohort.cohort_id} invents a contradiction decision.`);
  check(synthesis && ["synthesis_question", "protocol_version", "selected_evidence_grade_id", "proposed_synthesis_language", "uncertainty_statement", "limitation_statement", "first_reviewer_id", "second_reviewer_id", "decision_date", "synthesis_receipt_id"].every((key) => synthesis[key] === null), `${cohort.cohort_id} invents a synthesis, grade, reviewer, or receipt.`);
  check(synthesis && [synthesis.eligible_result_ids, synthesis.excluded_result_records, synthesis.shared_dependency_records, synthesis.compatibility_records, synthesis.triangulation_records, synthesis.replication_portfolio_records, synthesis.heterogeneity_records, synthesis.adverse_or_null_result_ids, synthesis.dissent_statement_ids].every((items) => items.length === 0), `${cohort.cohort_id} invents a body-level evidence record.`);
  check(synthesis?.propagation_status === "not_started" && synthesis?.automatic_pooling_allowed === false && synthesis?.automatic_evidence_grade_allowed === false && synthesis?.automatic_claim_publication_allowed === false && synthesis?.automatic_recommendation_allowed === false && synthesis?.automatic_scoring_allowed === false && synthesis?.automatic_ranking_allowed === false && synthesis?.phase64_cell_change === "none", `${cohort.cohort_id} enables automatic synthesis or a stage change.`);

  check(challenge?.file_id === cohort.file_id && challenge?.named_entity === cohort.named_entity && challenge?.synthesis_contradiction_dossier_id === synthesis?.synthesis_contradiction_dossier_id, `${cohort.cohort_id} lacks an exact challenge docket.`);
  check(challenge?.challenge_state === "Inactive - No Synthesis Claim" && challenge?.challenge_decision === "Not Open" && challenge?.challenge_checks.length === 12 && challenge?.challenge_checks.every((item) => item.decision_state === "Inactive"), `${cohort.cohort_id} prematurely opens a challenge.`);
  check(challenge && [challenge.challenge_packet_ids, challenge.challenger_identity_records, challenge.conflict_disclosure_ids, challenge.challenged_claim_versions, challenge.evidence_submission_ids, challenge.reproducible_critique_ids, challenge.response_packet_ids, challenge.independent_adjudication_ids, challenge.revision_decision_ids, challenge.reader_notice_ids, challenge.challenge_receipt_ids].every((items) => items.length === 0), `${cohort.cohort_id} invents a challenge or response.`);
  check(challenge?.first_reviewer_id === null && challenge?.second_reviewer_id === null && challenge?.decision_date === null && challenge?.propagation_status === "not_started" && challenge?.anonymous_assertion_is_evidence === false && challenge?.automatic_claim_reversal_allowed === false && challenge?.automatic_publication_allowed === false && challenge?.silent_challenge_disposition_allowed === false && challenge?.phase64_cell_change === "none", `${cohort.cohort_id} enables automatic or silent challenge disposition.`);

  check(translation?.file_id === cohort.file_id && translation?.named_entity === cohort.named_entity && translation?.synthesis_contradiction_dossier_id === synthesis?.synthesis_contradiction_dossier_id && translation?.external_challenge_response_docket_id === challenge?.external_challenge_response_docket_id, `${cohort.cohort_id} lacks an exact translation register.`);
  check(translation?.translation_state === "Inactive - No Adjudicated Synthesis" && translation?.translation_decision === "No Decision Translation" && translation?.translation_checks.length === 14 && translation?.translation_checks.every((item) => item.decision_state === "Inactive"), `${cohort.cohort_id} prematurely translates a synthesis.`);
  check(translation?.reevaluation_trigger_records.length === 10 && translation?.reevaluation_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids.length === 0), `${cohort.cohort_id} invents a reevaluation trigger.`);
  check(translation && ["decision_audience", "decision_authority", "exact_decision_question", "synthesis_claim_id", "evidence_grade_id", "status_quo_option_id", "reversibility_record", "legal_authority_record", "proposed_recommendation", "monitoring_plan_id", "sunset_date", "next_reevaluation_date", "first_reviewer_id", "second_reviewer_id", "decision_date", "translation_receipt_id"].every((key) => translation[key] === null), `${cohort.cohort_id} invents a decision, recommendation, sunset, reviewer, or receipt.`);
  check(translation && [translation.decision_option_records, translation.benefit_records, translation.harm_records, translation.distributional_records, translation.feasibility_records, translation.uncertainty_scenario_records, translation.recommendation_conflict_records].every((items) => items.length === 0), `${cohort.cohort_id} invents an option, benefit, harm, distribution, feasibility, uncertainty, or conflict record.`);
  check(translation?.propagation_status === "not_started" && translation?.automatic_recommendation_allowed === false && translation?.automatic_adoption_allowed === false && translation?.automatic_sunset_extension_allowed === false && translation?.automatic_scoring_allowed === false && translation?.automatic_ranking_allowed === false && translation?.phase64_cell_change === "none", `${cohort.cohort_id} enables an automatic decision or a stage change.`);
}

const pathwayIds = [...new Set(registry.result_synthesis_input_dockets.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 74 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", `${id.replace("reader-pathway-", "")}.json`);
  check(pathway.briefing_ids.includes("briefing-evidence-synthesis-desk-001") && pathway.briefing_ids.includes("briefing-challenge-decision-translation-desk-001"), `${id} omits a Phase 74 briefing.`);
  check(pathway.dependency_map_ids.includes("dependency-map-adjudicated-result-is-not-decision-recommendation"), `${id} omits the Phase 74 map.`);
}

const canonicalIds = [...new Set(registry.result_synthesis_input_dockets.map((record) => record.canonical_briefing_id))];
check(canonicalIds.length === 8, "Phase 74 must deepen eight canonical named files.");
for (const id of canonicalIds) check((await readText("src", "content", "briefings", `${id}.mdx`)).includes("## Phase 74 synthesis and decision-translation boundary"), `${id} omits Phase 74.`);
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
check(localFiles.length === 5 && (await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)))).every((text) => text.includes("## Phase 74 synthesis boundary")), "All five local systems must expose the Phase 74 boundary.");

for (const [text, headings] of [[synthesisBriefing, ["Why one result is not a body of evidence", "Fourteen synthesis-input gates", "Fourteen body-level synthesis gates", "Compatibility and independence", "Triangulation and replication portfolios", "Evidence grades and bounded language", "Contradictions, dissent, and correction", "Synthesis boundary"]], [decisionBriefing, ["Why challenge is part of publication", "Twelve external-challenge gates", "Evidence does not choose the decision", "Fourteen decision-translation gates", "Options, harms, and distribution", "Sunset and reevaluation", "Decision boundary"]]]) {
  check(/record_status:\s*"Published"/.test(text), "Both Phase 74 briefings must be Published.");
  headings.forEach((heading) => check(text.includes(`## ${heading}`), `A Phase 74 briefing is missing ${heading}.`));
}
check(operatingBriefings.every((text) => text.includes("## Phase 74 evidence synthesis and decision translation")), "A required operating briefing omits Phase 74.");
check(map.record_status === "Published" && map.nodes.length === 11 && map.links.length === 10, "The Phase 74 dependency map is incomplete.");
check(map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("recommendation")) && map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("rank")), "The Phase 74 map must reject recommendation and ranking inference.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 74 update invents a receipt or decision.");
check(endpoint.includes('"evidence_synthesis_challenge_decision_translation"') && endpoint.includes("registry.external_challenge_response_dockets") && endpoint.includes("registry.decision_translation_reevaluation_registers"), "The Phase 74 public endpoint is incomplete.");
check(dataIndex.includes("Evidence Synthesis, Challenge And Decision Translation") && dataIndex.includes("bounded public contracts"), "The public data index omits Phase 74.");
check(registryPage.includes("data-synthesis-registry") && registryPage.includes("Search thirty-two inactive synthesis inputs") && registryPage.includes("0 recommendations"), "The Phase 74 registry page is incomplete.");
check(detailPage.includes("Fourteen result-input gates remain Inactive") && detailPage.includes("Fourteen synthesis gates remain Inactive") && detailPage.includes("Ten contradiction categories remain Not Assessable") && detailPage.includes("Twelve challenge gates remain Inactive") && detailPage.includes("Fourteen translation gates remain Inactive") && detailPage.includes("Ten reevaluation triggers remain Dormant") && detailPage.includes("A synthesis is not a decision recommendation or authorization"), "The Phase 74 detail template omits a control boundary.");
check(phase73Detail.includes("synthesisRegistry.result_synthesis_input_dockets") && phase73Detail.includes("Phase 74 Destination"), "The Phase 73 detail template omits the Phase 74 handoff.");
check(sitemap.includes("synthesisRegistry.result_synthesis_input_dockets") && sitemap.includes("synthesisRegistry.synthesis_contradiction_dossiers") && sitemap.includes('\"/evidence/synthesis/\"'), "The sitemap source omits Phase 74 routes.");
check(phase73.metrics.results_adjudicated === 0 && phase73.metrics.claims_published === 0 && phase73.metrics.causal_claims_published === 0, "Phase 74 changes the inherited result or claim baseline.");
check(registry.metrics.adjudicated_results_received === 0 && registry.metrics.synthesis_inputs_admitted === 0 && registry.metrics.synthesis_protocols_registered === 0 && registry.metrics.contradictions_recorded === 0 && registry.metrics.replications_portfolioed === 0 && registry.metrics.evidence_grades_assigned === 0 && registry.metrics.syntheses_adjudicated === 0 && registry.metrics.synthesis_claims_published === 0, "Phase 74 creates a result input, synthesis, contradiction, replication portfolio, grade, or claim.");
check(registry.metrics.challenges_received === 0 && registry.metrics.challenge_responses_published === 0 && registry.metrics.recommendations_published === 0 && registry.metrics.decision_authorizations_issued === 0 && registry.metrics.reevaluations_scheduled === 0 && registry.metrics.corrections_issued === 0 && registry.metrics.withdrawals_issued === 0 && registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0 && registry.metrics.decision_receipts_created === 0 && registry.metrics.phase64_cells_advanced === 0, "Phase 74 creates a challenge, recommendation, authority, reevaluation, correction, withdrawal, score, rank, receipt, or stage change.");

if (failures.length) {
  console.error("Phase 74 assertions failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1);
}

console.log("Phase 74 assertions passed: 32 inactive synthesis inputs, 8 inactive synthesis-contradiction dossiers, 8 inactive challenge-response dockets, 8 inactive decision-translation/reevaluation registers, 14 input gates, 14 synthesis gates, 7 evidence grades, 10 contradiction categories, 12 challenge gates, 14 translation gates, 10 reevaluation triggers, 10 pathways, 5 local systems, and 0 results, syntheses, grades, challenges, recommendations, authorizations, reevaluations, corrections, withdrawals, receipts, scores, rankings, or stage changes.");
