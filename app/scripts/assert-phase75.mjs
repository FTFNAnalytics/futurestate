import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const phase74 = await readJson("src", "data", "phase-74-evidence-synthesis-challenge-decision-translation-registry.json");
const registry = await readJson("src", "data", "phase-75-decision-accountability-realized-impact-registry.json");
const update = await readJson("src", "content", "updates", "2026-08-24-phase-75-decision-accountability-realized-impact.json");
const guideNames = [
  "briefing-decision-accountability-desk-001.mdx",
  "briefing-implementation-commitment-ledger-001.mdx",
  "briefing-realized-impact-audit-001.mdx",
  "briefing-reversal-remediation-desk-001.mdx"
];
const guides = await Promise.all(guideNames.map((name) => readText("src", "content", "briefings", name)));
const operatingNames = [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-evidence-synthesis-desk-001.mdx",
  "briefing-challenge-decision-translation-desk-001.mdx",
  "briefing-result-adjudication-desk-001.mdx",
  "briefing-outcome-evidence-packet-desk-001.mdx",
  "briefing-counterfactual-design-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx",
  "briefing-conversion-stage-matrix-001.mdx"
];
const operatingBriefings = await Promise.all(operatingNames.map((name) => readText("src", "content", "briefings", name)));
const implementationMap = await readJson("src", "content", "dependency-maps", "recommendation-is-not-authorization-or-implementation.json");
const impactMap = await readJson("src", "content", "dependency-maps", "delivered-output-is-not-realized-benefit.json");
const endpoint = await readText("src", "pages", "data", "decision-accountability-realized-impact.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");
const registryPage = await readText("src", "pages", "evidence", "accountability", "index.astro");
const detailPage = await readText("src", "pages", "evidence", "accountability", "[id].astro");
const synthesisDetail = await readText("src", "pages", "evidence", "synthesis", "[id].astro");
const sitemap = await readText("src", "pages", "sitemap.xml.ts");

check(registry.schema_version === "1.0" && registry.phase === "75" && registry.captured_date === "2026-08-24" && registry.as_of_date === "2026-08-24", "The Phase 75 registry must identify schema 1.0, Phase 75, and the structural release date.");
check(registry.accountability_gates.length === 16 && registry.implementation_realization_gates.length === 16 && registry.post_decision_audit_gates.length === 12, "Phase 75 must define sixteen accountability gates, sixteen implementation-realization gates, and twelve audit gates.");
check(registry.safeguard_triggers.length === 12 && registry.remediation_classes.length === 10, "Phase 75 must define twelve safeguard triggers and ten remediation classes.");
check(registry.decision_accountability_dossiers.length === 8 && registry.implementation_commitment_realization_ledgers.length === 32 && registry.post_decision_audit_remediation_registers.length === 8, "Phase 75 must contain 8 accountability dossiers, 32 commitment-realization ledgers, and 8 audit-remediation registers.");
check(new Set(registry.decision_accountability_dossiers.map((record) => record.decision_accountability_dossier_id)).size === 8 && new Set(registry.decision_accountability_dossiers.map((record) => record.slug)).size === 8, "Decision-accountability IDs and slugs must be unique.");
check(new Set(registry.implementation_commitment_realization_ledgers.map((record) => record.implementation_commitment_realization_ledger_id)).size === 32 && new Set(registry.implementation_commitment_realization_ledgers.map((record) => record.slug)).size === 32, "Implementation-ledger IDs and slugs must be unique.");
check(new Set(registry.post_decision_audit_remediation_registers.map((record) => record.post_decision_audit_remediation_register_id)).size === 8, "Audit-remediation IDs must be unique.");

for (const translation of phase74.decision_translation_reevaluation_registers) {
  const decision = registry.decision_accountability_dossiers.find((record) => record.decision_translation_reevaluation_register_id === translation.decision_translation_reevaluation_register_id);
  const audit = registry.post_decision_audit_remediation_registers.find((record) => record.cohort_id === translation.cohort_id);
  const ledgers = registry.implementation_commitment_realization_ledgers.filter((record) => record.cohort_id === translation.cohort_id);
  check(decision?.file_id === translation.file_id && decision?.named_entity === translation.named_entity && decision?.cohort_id === translation.cohort_id && decision?.phase74_translation_state === translation.translation_state && ledgers.length === 4, translation.cohort_id + " lacks an exact Phase 75 accountability chain.");
  check(decision?.accountability_state === "Inactive - No Authorized Institutional Decision" && decision?.accountability_decision === "Not Open" && decision?.accountability_checks.length === 16 && decision?.accountability_checks.every((item) => item.decision_state === "Inactive"), translation.cohort_id + " prematurely opens an accountability decision.");
  check(decision && ["decision_record_id", "decision_version", "authority_record", "exact_decision_question", "selected_option_id", "status_quo_option_id", "option_selection_rationale", "recommendation_id", "authorization_id", "authorization_date", "monitoring_plan_id", "sunset_date", "next_review_date", "first_reviewer_id", "second_reviewer_id", "accountability_receipt_id"].every((key) => decision[key] === null), translation.cohort_id + " invents a decision, owner, rationale, authority, authorization, sunset, reviewer, or receipt.");
  check(decision && [decision.decision_owner_records, decision.evidence_and_challenge_lineage_ids, decision.value_judgment_records, decision.expected_benefit_records, decision.expected_harm_records, decision.distributional_assessment_records, decision.feasibility_assessment_records, decision.conflict_disclosure_records, decision.recusal_records, decision.dissent_archive_ids, decision.authorization_terms].every((items) => items.length === 0), translation.cohort_id + " invents decision-accountability content.");
  check(decision?.propagation_status === "not_started" && decision?.automatic_authorization_allowed === false && decision?.automatic_implementation_allowed === false && decision?.automatic_sunset_extension_allowed === false && decision?.automatic_scoring_allowed === false && decision?.automatic_ranking_allowed === false && decision?.phase64_cell_change === "none", translation.cohort_id + " enables an automatic decision or stage change.");

  check(audit?.decision_accountability_dossier_id === decision?.decision_accountability_dossier_id && audit?.implementation_commitment_realization_ledger_ids.length === 4, translation.cohort_id + " lacks an exact audit-remediation register.");
  check(audit?.audit_state === "Inactive - No Authorized Decision" && audit?.audit_decision === "Not Scheduled" && audit?.audit_checks.length === 12 && audit?.audit_checks.every((item) => item.decision_state === "Inactive"), translation.cohort_id + " prematurely opens an audit.");
  check(audit?.remediation_class_records.length === 10 && audit?.remediation_class_records.every((item) => item.action_state === "Unavailable" && item.event_ids.length === 0 && item.decision_receipt_id === null), translation.cohort_id + " invents a remediation action.");
  check(audit && ["audit_plan_id", "audit_period", "sunset_enforcement_record", "reversal_decision_id", "first_auditor_id", "second_auditor_id"].every((key) => audit[key] === null), translation.cohort_id + " invents an audit, sunset, reversal, or auditor.");
  check(audit && [audit.compliance_records, audit.milestone_audit_records, audit.realization_audit_records, audit.distributional_audit_records, audit.counterfactual_decision_audit_records, audit.safeguard_event_ids, audit.post_decision_challenge_ids, audit.remediation_decision_ids, audit.compensation_or_restoration_records, audit.audit_receipt_ids].every((items) => items.length === 0), translation.cohort_id + " invents an audit, challenge, remedy, or receipt.");
  check(audit?.propagation_status === "not_started" && audit?.silent_renewal_allowed === false && audit?.automatic_sunset_extension_allowed === false && audit?.automatic_remediation_closure_allowed === false && audit?.automatic_score_allowed === false && audit?.automatic_rank_allowed === false && audit?.phase64_cell_change === "none", translation.cohort_id + " enables silent or automatic audit action.");
}

for (const input of phase74.result_synthesis_input_dockets) {
  const ledger = registry.implementation_commitment_realization_ledgers.find((record) => record.result_synthesis_input_docket_id === input.result_synthesis_input_docket_id);
  check(ledger?.cohort_id === input.cohort_id && ledger?.file_id === input.file_id && ledger?.named_entity === input.named_entity && ledger?.measure_id === input.measure_id && ledger?.measure_label === input.measure_label, input.result_synthesis_input_docket_id + " lacks an exact Phase 75 measure lineage.");
  check(ledger?.commitment_state === "Inactive - No Authorized Decision" && ledger?.realization_state === "Inactive - No Implementation Commitment" && ledger?.implementation_realization_checks.length === 16 && ledger?.implementation_realization_checks.every((item) => item.decision_state === "Inactive"), input.result_synthesis_input_docket_id + " prematurely creates a commitment or realization.");
  check(ledger?.safeguard_trigger_records.length === 12 && ledger?.safeguard_trigger_records.every((item) => item.trigger_state === "Dormant" && item.event_ids.length === 0), input.result_synthesis_input_docket_id + " invents a safeguard trigger.");
  check(ledger && ["authorization_id", "commitment_record_id", "commitment_owner_id", "commitment_scope", "resource_baseline", "capacity_baseline", "outcome_baseline", "counterfactual_decision_audit_id", "reversal_record", "first_reviewer_id", "second_reviewer_id"].every((key) => ledger[key] === null), input.result_synthesis_input_docket_id + " invents a commitment, baseline, audit, reversal, or reviewer.");
  check(ledger && [ledger.beneficiary_records, ledger.amendment_records, ledger.budget_commitment_records, ledger.workforce_commitment_records, ledger.asset_commitment_records, ledger.milestone_records, ledger.dependency_records, ledger.safeguard_records, ledger.stop_work_rule_ids, ledger.delivered_output_records, ledger.acceptance_records, ledger.benefit_realization_records, ledger.harm_realization_records, ledger.burden_records, ledger.distributional_monitoring_records, ledger.deviation_records, ledger.incident_records, ledger.complaint_records, ledger.remediation_records, ledger.realization_receipt_ids].every((items) => items.length === 0), input.result_synthesis_input_docket_id + " invents implementation or impact content.");
  check(ledger?.propagation_status === "not_started" && ledger?.automatic_commitment_creation_allowed === false && ledger?.automatic_benefit_attribution_allowed === false && ledger?.automatic_net_benefit_claim_allowed === false && ledger?.automatic_stage_advance_allowed === false && ledger?.automatic_scoring_allowed === false && ledger?.automatic_ranking_allowed === false && ledger?.phase64_cell_change === "none", input.result_synthesis_input_docket_id + " enables automatic implementation, impact, or stage change.");
}

const pathwayIds = [...new Set(registry.implementation_commitment_realization_ledgers.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 75 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", id.replace("reader-pathway-", "") + ".json");
  for (const guide of ["briefing-decision-accountability-desk-001", "briefing-implementation-commitment-ledger-001", "briefing-realized-impact-audit-001", "briefing-reversal-remediation-desk-001"]) check(pathway.briefing_ids.includes(guide), id + " omits " + guide + ".");
  for (const map of ["dependency-map-recommendation-is-not-authorization-or-implementation", "dependency-map-delivered-output-is-not-realized-benefit"]) check(pathway.dependency_map_ids.includes(map), id + " omits " + map + ".");
}

const canonicalIds = [...new Set(registry.implementation_commitment_realization_ledgers.map((record) => record.canonical_briefing_id))];
check(canonicalIds.length === 8, "Phase 75 must deepen eight canonical named files.");
for (const id of canonicalIds) check((await readText("src", "content", "briefings", id + ".mdx")).includes("## Phase 75 decision accountability and realized-impact boundary"), id + " omits Phase 75.");
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
check(localFiles.length === 5 && (await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)))).every((text) => text.includes("## Phase 75 accountability and impact boundary")), "All five local systems must expose the Phase 75 boundary.");
check(guides.every((text) => /record_status:\s*"Published"/.test(text)), "All four Phase 75 guides must be Published.");
for (const [text, headings] of [
  [guides[0], ["The accountability gap", "Sixteen gates before a decision record opens", "Options and the status quo", "Evidence and judgment remain separate", "Conflicts, recusal, and dissent", "Conditions, sunset, and receipt"]],
  [guides[1], ["The missing middle", "A commitment is a versioned artifact", "Baselines before activity", "Milestones and acceptance", "Dependencies and safeguards", "Public contract"]],
  [guides[2], ["The realization ladder", "Benefits and harms use the same discipline", "Distribution is part of the result", "Counterfactual decision audit", "Net benefit is an adjudication", "Inspect the empty state"]],
  [guides[3], ["Decisions need an exit", "Twelve audit gates", "Triggered review", "Remediation is not a footnote", "Sunset and renewal", "Public correction and propagation"]]
]) headings.forEach((heading) => check(text.includes("## " + heading), "A Phase 75 guide is missing " + heading + "."));
check(operatingBriefings.every((text) => text.includes("## Phase 75 accountability, implementation, and impact audit")), "A required operating briefing omits Phase 75.");
for (const map of [implementationMap, impactMap]) check(map.record_status === "Published" && map.nodes.length === 11 && map.links.length === 10 && map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("rank")), map.id + " is incomplete or permits ranking inference.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 75 update invents a receipt or decision.");
check(endpoint.includes("phase-75-decision-accountability-realized-impact-registry.json") && endpoint.includes("decision_accountability_realized_impact") && endpoint.includes("registry.post_decision_audit_remediation_registers"), "The Phase 75 public endpoint is incomplete.");
check(dataIndex.includes("Decision Accountability And Realized Impact") && dataIndex.includes("bounded public contracts"), "The public data index omits Phase 75.");
check(registryPage.includes("Eight institutional decision records remain closed") && registryPage.includes("Thirty-two measure-level ledgers remain inactive") && registryPage.includes("0 impacts"), "The Phase 75 registry page is incomplete.");
check(detailPage.includes("Sixteen gates remain Inactive") && detailPage.includes("Twelve trigger classes remain Dormant") && detailPage.includes("Twelve audit gates remain Inactive") && detailPage.includes("Ten action classes remain Unavailable") && detailPage.includes("A recommendation is not an accountable institutional decision"), "The Phase 75 detail template omits a control boundary.");
check(synthesisDetail.includes("Phase 75 Destination") && synthesisDetail.includes("accountabilityRegistry.decision_accountability_dossiers"), "The Phase 74 detail template omits the Phase 75 handoff.");
check(sitemap.includes("accountabilityRegistry.implementation_commitment_realization_ledgers") && sitemap.includes("accountabilityRegistry.decision_accountability_dossiers") && sitemap.includes('"\/evidence\/accountability\/"'), "The sitemap source omits Phase 75 routes.");
check(phase74.metrics.recommendations_published === 0 && phase74.metrics.decision_authorizations_issued === 0, "Phase 75 changes the inherited recommendation or authorization baseline.");
check(Object.entries(registry.metrics).filter(([key]) => !key.includes("dossiers") && !key.includes("ledgers") && !key.includes("registers") && !key.includes("gates") && !key.includes("triggers") && !key.includes("classes")).every(([, value]) => value === 0), "Phase 75 creates an operational decision, implementation, impact, audit, remedy, receipt, score, rank, or stage change.");

if (failures.length) {
  console.error("Phase 75 assertions failed:");
  failures.forEach((failure) => console.error("- " + failure));
  process.exit(1);
}

console.log("Phase 75 assertions passed: 8 inactive decision-accountability dossiers, 32 inactive implementation-commitment and realization ledgers, 8 inactive post-decision audit and remediation registers, 16 accountability gates, 16 implementation-realization gates, 12 audit gates, 12 safeguard triggers, 10 remediation classes, 10 pathways, 5 local systems, and 0 authorizations, commitments, baselines, safeguards, outputs, benefits, harms, distributional findings, audits, reversals, remediations, receipts, scores, rankings, or stage changes.");
