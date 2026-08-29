import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");

const phase68 = await readJson(join(dataRoot, "phase-68-compatible-series-outcome-cohorts.json"));
const phase71 = await readJson(join(dataRoot, "phase-71-longitudinal-panel-outcome-comparison-registry.json"));

const claimClassTaxonomy = [
  ["72-CLASS-01-STRUCTURAL", "Structural status", "Describes the existence, stage, authority, or workflow state of a record. It is not an operating outcome."],
  ["72-CLASS-02-LEVEL", "Same-entity descriptive level", "Reports one reviewed level under one exact entity, measure, period, method, and denominator contract."],
  ["72-CLASS-03-CHANGE", "Same-entity descriptive change", "Reports a reviewed within-entity direction and magnitude across compatible periods without attribution."],
  ["72-CLASS-04-TARGET", "Target attainment", "Compares a reviewed same-entity result with one explicit target whose authority, definition, period, and threshold are compatible."],
  ["72-CLASS-05-ASSOCIATION", "Association", "Reports a bounded relationship without claiming contribution, attribution, or causation."],
  ["72-CLASS-06-ATTRIBUTION", "Contribution or attribution", "Requires a named intervention boundary, alternative-explanation assessment, defensible comparison basis, and explicit limits."],
  ["72-CLASS-07-CAUSAL", "Causal effect", "Requires a registered counterfactual design, estimand, identification assumptions, robustness tests, and separate human authorization."],
].map(([claim_class_id, label, boundary]) => ({ claim_class_id, label, boundary }));

const outcomePacketDimensions = [
  ["72-PACKET-01-PANEL", "Eligible panel and complete lineage", "The packet resolves to one Phase 71 panel backed by an admitted series, accepted observations, revisions, breaks, and receipts."],
  ["72-PACKET-02-QUESTION", "Exact outcome question", "The entity, population, measure, period, receiving system, and decision use are explicit."],
  ["72-PACKET-03-CLASS", "Claim class and verb strength", "The proposed language stays within one declared Phase 72 claim class and its evidence ceiling."],
  ["72-PACKET-04-CALCULATION", "Direction, magnitude, and calculation", "Every value, transformation, direction, magnitude, and rate is reproducible from admitted points."],
  ["72-PACKET-05-TIME", "Baseline, follow-up, and timing", "Baseline, follow-up, cadence, lag, exposure window, partial periods, and temporal ordering are explicit."],
  ["72-PACKET-06-CONTINUITY", "Missingness, breaks, and revisions", "Missing periods, method changes, corrections, restatements, segmentations, and bridges remain visible."],
  ["72-PACKET-07-ADVERSE", "Adverse and disconfirming evidence", "Failures, outages, reversals, exclusions, rejected units, and disconfirming observations remain in the packet."],
  ["72-PACKET-08-ALTERNATIVES", "Alternative-explanation inventory", "Every applicable Phase 72 alternative category has evidence for, evidence against, uncertainty, and an adjudicated disposition."],
  ["72-PACKET-09-ATTRIBUTION", "Actor, intervention, and receiving boundary", "The responsible actor, intervention, receiving authority, spillover risk, and no-transfer boundary are explicit."],
  ["72-PACKET-10-UNCERTAINTY", "Uncertainty and sensitivity", "Coverage, measurement uncertainty, sampling or model uncertainty, and sensitivity to definitions and assumptions are explicit."],
  ["72-PACKET-11-REPRODUCIBILITY", "Reproducible artifact bundle", "Public inputs, versions, calculations, exclusions, provenance, and a durable result snapshot can be independently inspected."],
  ["72-PACKET-12-DECISION", "Dual review, receipt, and propagation", "Two authorized reviewers decide the bounded language and complete every assigned reader-surface update."],
].map(([dimension_id, label, question]) => ({ dimension_id, label, question }));

const alternativeExplanationCategories = [
  ["72-ALT-01-PRETREND", "Pre-existing trend or mean reversion"],
  ["72-ALT-02-CONCURRENT", "Concurrent investment or intervention"],
  ["72-ALT-03-POLICY", "Policy, regulatory, or acceptance change"],
  ["72-ALT-04-MARKET", "Market, demand, price, or macroeconomic change"],
  ["72-ALT-05-CAPACITY", "Capacity, supplier, or input availability"],
  ["72-ALT-06-WORKFORCE", "Workforce, skills, staffing, or learning effects"],
  ["72-ALT-07-INFRASTRUCTURE", "Utility, infrastructure, logistics, or receiving-system change"],
  ["72-ALT-08-MEASUREMENT", "Measurement, method, definition, or reporting change"],
  ["72-ALT-09-SELECTION", "Selection, composition, survivorship, or denominator change"],
  ["72-ALT-10-EXTERNAL", "Weather, incident, disruption, seasonality, or other external event"],
].map(([category_id, label]) => ({ category_id, label }));

const counterfactualDesignGates = [
  ["72-CF-01-QUESTION", "Causal question and intervention", "The intervention, alternative, timing, mechanism, and causal question are explicit."],
  ["72-CF-02-UNIT", "Treatment unit and population", "Treatment unit, eligible population, inclusion rules, assignment level, and analysis level are explicit."],
  ["72-CF-03-ESTIMAND", "Outcome and estimand", "The exact outcome, contrast, population, period, and causal estimand are declared before analysis."],
  ["72-CF-04-BASELINE", "Baseline and pre-period", "Pre-intervention coverage can assess trends, seasonality, shocks, and design assumptions."],
  ["72-CF-05-COMPARISON", "Comparison or control construction", "Control eligibility, matching variables, donor pool, assignment mechanism, and exclusions are inspectable."],
  ["72-CF-06-IDENTIFICATION", "Identification assumptions", "Randomization, exchangeability, parallel trends, continuity, exclusion, or other identifying assumptions are testable and explicit."],
  ["72-CF-07-INTERFERENCE", "Interference and spillovers", "Contamination, displacement, network effects, concurrent exposure, and treatment-version variation are addressed."],
  ["72-CF-08-CONFOUNDING", "Confounding and selection", "Observed and plausible unobserved confounding, selection, composition, and treatment timing are addressed."],
  ["72-CF-09-MISSING", "Missing data and attrition", "Missing outcomes, censoring, attrition, revisions, and differential observation are visible and handled prospectively."],
  ["72-CF-10-FALSIFICATION", "Robustness and falsification", "Placebos, negative controls, pre-trend checks, alternate specifications, and failure thresholds are predeclared."],
  ["72-CF-11-UNCERTAINTY", "Power, uncertainty, and sensitivity", "Precision, detectable effect, clustering, multiple testing, sensitivity, and uncertainty communication are explicit."],
  ["72-CF-12-REGISTRATION", "Pre-registration, dual review, and propagation", "The design is frozen, independently reviewed, receipt-bound, and propagated before result inspection."],
].map(([gate_id, label, question]) => ({ gate_id, label, question }));

const counterfactualDesignFamilies = [
  ["72-DESIGN-01-RANDOMIZED", "Randomized assignment"],
  ["72-DESIGN-02-INTERRUPTED", "Interrupted time series"],
  ["72-DESIGN-03-DID", "Difference in differences"],
  ["72-DESIGN-04-SYNTHETIC", "Synthetic control"],
  ["72-DESIGN-05-MATCHED", "Matched comparison"],
  ["72-DESIGN-06-DISCONTINUITY", "Regression discontinuity"],
].map(([design_family_id, label]) => ({ design_family_id, label }));

const outcomeByCohort = new Map(phase71.outcome_claim_dockets.map((record) => [record.cohort_id, record]));
const comparisonByCohort = new Map(phase71.comparison_embargo_registers.map((record) => [record.cohort_id, record]));
const cohortIndex = new Map(phase68.cohort_records.map((record, index) => [record.cohort_id, index]));

const outcomeEvidencePackets = phase71.longitudinal_panel_shells.map((panel, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const cohortNumber = String(cohortIndex.get(panel.cohort_id) + 1).padStart(3, "0");
  const outcome = outcomeByCohort.get(panel.cohort_id);
  return {
    evidence_packet_id: `72-OEP-${padded}`,
    slug: panel.slug.replace(/^71-panel-/, "72-oep-"),
    record_kind: "outcome_evidence_packet",
    record_status: "Published",
    packet_state: "Empty - No Eligible Panel",
    panel_id: panel.panel_id,
    panel_slug: panel.slug,
    panel_state: panel.panel_state,
    outcome_claim_docket_id: outcome.outcome_claim_docket_id,
    outcome_claim_docket_slug: outcome.slug,
    cohort_id: panel.cohort_id,
    file_id: panel.file_id,
    file_kind: panel.file_kind,
    named_entity: panel.named_entity,
    specification_id: panel.specification_id,
    review_docket_id: panel.review_docket_id,
    series_admission_docket_id: panel.series_admission_docket_id,
    measure_id: panel.measure_id,
    measure_label: panel.measure_label,
    claim_class_ids: claimClassTaxonomy.map((record) => record.claim_class_id),
    packet_checks: outcomePacketDimensions.map((dimension) => ({
      dimension_id: dimension.dimension_id,
      label: dimension.label,
      decision_state: "Not Ready",
      basis: "The Phase 71 panel contains no admitted series or eligible result."
    })),
    alternative_explanation_register_id: `72-AER-${cohortNumber}`,
    counterfactual_design_docket_id: `72-CFD-${cohortNumber}`,
    exact_next_artifact: outcome.exact_next_artifact,
    source_ids: panel.source_ids,
    signal_ids: panel.signal_ids,
    evidence_gap_ids: panel.evidence_gap_ids,
    canonical_briefing_id: panel.canonical_briefing_id,
    reader_pathway_ids: panel.reader_pathway_ids,
    local_system_ids: panel.local_system_ids,
    dependency_map_ids: [
      "dependency-map-admitted-series-is-not-causal-outcome",
      "dependency-map-descriptive-change-is-not-causal-effect"
    ],
    selected_claim_class_id: null,
    outcome_question: null,
    proposed_claim_text: null,
    verb_strength: null,
    baseline_period: null,
    followup_period: null,
    calculation_specification: null,
    supporting_panel_ids: [],
    supporting_observation_ids: [],
    adverse_observation_ids: [],
    alternative_explanation_entry_ids: [],
    attribution_boundary: null,
    uncertainty_statement: null,
    sensitivity_records: [],
    reproducibility_artifact_ids: [],
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    decision_receipt_id: null,
    propagation_status: "not_started",
    automatic_claim_classification_allowed: false,
    automatic_publication_allowed: false,
    phase64_cell_change: "none"
  };
});

const alternativeExplanationRegisters = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const outcome = outcomeByCohort.get(cohort.cohort_id);
  const packets = outcomeEvidencePackets.filter((record) => record.cohort_id === cohort.cohort_id);
  return {
    alternative_register_id: `72-AER-${padded}`,
    record_kind: "alternative_explanation_register",
    record_status: "Published",
    register_state: "Empty - No Eligible Claim Packet",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    named_entity: cohort.named_entity,
    outcome_claim_docket_id: outcome.outcome_claim_docket_id,
    outcome_claim_docket_slug: outcome.slug,
    evidence_packet_ids: packets.map((record) => record.evidence_packet_id),
    category_assessments: alternativeExplanationCategories.map((category) => ({
      category_id: category.category_id,
      label: category.label,
      assessment_state: "Not Assessed",
      applicability_decision: null,
      evidence_for_ids: [],
      evidence_against_ids: [],
      uncertainty_note: null,
      disposition: null
    })),
    selected_alternative_entry_ids: [],
    adverse_observation_ids: [],
    reviewer_notes: [],
    decision_date: null,
    decision_receipt_id: null,
    propagation_status: "not_started",
    silence_means_none: false,
    automatic_none_allowed: false,
    phase64_cell_change: "none"
  };
});

const counterfactualDesignDockets = phase68.cohort_records.map((cohort, index) => {
  const padded = String(index + 1).padStart(3, "0");
  const short = cohort.cohort_id.toLowerCase().replace(/^68-cohort-\d+-/, "");
  const outcome = outcomeByCohort.get(cohort.cohort_id);
  const comparison = comparisonByCohort.get(cohort.cohort_id);
  const packets = outcomeEvidencePackets.filter((record) => record.cohort_id === cohort.cohort_id);
  return {
    counterfactual_docket_id: `72-CFD-${padded}`,
    slug: `72-cfd-${padded}-${short}`,
    record_kind: "counterfactual_design_docket",
    record_status: "Published",
    design_state: "Inactive - No Causal Claim Proposed",
    design_decision: "Not Registered",
    cohort_id: cohort.cohort_id,
    file_id: cohort.file_id,
    file_kind: cohort.file_kind,
    named_entity: cohort.named_entity,
    outcome_claim_docket_id: outcome.outcome_claim_docket_id,
    outcome_claim_docket_slug: outcome.slug,
    comparison_register_id: comparison.comparison_register_id,
    alternative_explanation_register_id: `72-AER-${padded}`,
    evidence_packet_ids: packets.map((record) => record.evidence_packet_id),
    design_family_ids: counterfactualDesignFamilies.map((record) => record.design_family_id),
    design_checks: counterfactualDesignGates.map((gate) => ({
      gate_id: gate.gate_id,
      label: gate.label,
      decision_state: "Inactive",
      basis: "No eligible outcome packet or causal claim proposal exists."
    })),
    exact_next_artifact: outcome.exact_next_artifact,
    source_ids: cohort.source_ids,
    signal_ids: cohort.signal_ids,
    evidence_gap_ids: cohort.evidence_gap_ids,
    canonical_briefing_id: cohort.canonical_briefing_id,
    reader_pathway_ids: cohort.reader_pathway_ids,
    local_system_ids: cohort.local_system_ids,
    dependency_map_ids: ["dependency-map-descriptive-change-is-not-causal-effect"],
    selected_design_family_id: null,
    causal_question: null,
    intervention_definition: null,
    treatment_unit: null,
    eligible_population: null,
    outcome_definition: null,
    estimand: null,
    assignment_mechanism: null,
    baseline_period: null,
    followup_period: null,
    comparison_unit_ids: [],
    donor_pool_ids: [],
    confounder_records: [],
    spillover_records: [],
    missing_data_plan: null,
    falsification_test_records: [],
    power_or_precision_plan: null,
    sensitivity_plan: null,
    preregistration_artifact_id: null,
    first_reviewer_id: null,
    second_reviewer_id: null,
    decision_date: null,
    decision_receipt_id: null,
    propagation_status: "not_started",
    result_inspection_allowed: false,
    automatic_design_selection_allowed: false,
    causal_publication_allowed: false,
    phase64_cell_change: "none"
  };
});

const registry = {
  schema_version: "1.0",
  phase: "72",
  registry_id: "outcome-evidence-packet-counterfactual-design-registry-001",
  title: "Outcome Evidence Packet, Alternative Explanation And Counterfactual Design Registry",
  captured_date: "2026-08-23",
  as_of_date: "2026-08-23",
  scope: "Thirty-two empty outcome-evidence packets, eight empty alternative-explanation registers, and eight inactive counterfactual-design dockets for the Phase 71 panel and claim layer.",
  interpretation_boundary: "A packet contract is not an eligible panel or proposed claim. A claim class is an evidence ceiling, not a publication decision. An alternative-explanation category is not an assessed explanation. A design family is not a registered counterfactual, and no descriptive change may be upgraded to attribution or causation automatically.",
  claim_class_taxonomy: claimClassTaxonomy,
  outcome_packet_dimensions: outcomePacketDimensions,
  alternative_explanation_categories: alternativeExplanationCategories,
  counterfactual_design_gates: counterfactualDesignGates,
  counterfactual_design_families: counterfactualDesignFamilies,
  packet_states: ["Empty - No Eligible Panel", "Held", "Eligible For Outcome Review", "Published Bounded Claim", "Rejected"],
  alternative_register_states: ["Empty - No Eligible Claim Packet", "Under Assessment", "Complete For Claim Review", "Held"],
  counterfactual_design_states: ["Inactive - No Causal Claim Proposed", "Draft Design", "Held", "Registered Before Result Inspection", "Rejected"],
  metrics: {
    outcome_evidence_packets: outcomeEvidencePackets.length,
    empty_outcome_evidence_packets: outcomeEvidencePackets.length,
    alternative_explanation_registers: alternativeExplanationRegisters.length,
    empty_alternative_explanation_registers: alternativeExplanationRegisters.length,
    counterfactual_design_dockets: counterfactualDesignDockets.length,
    inactive_counterfactual_design_dockets: counterfactualDesignDockets.length,
    claim_classes: claimClassTaxonomy.length,
    outcome_packet_dimensions: outcomePacketDimensions.length,
    alternative_explanation_categories: alternativeExplanationCategories.length,
    counterfactual_design_gates: counterfactualDesignGates.length,
    counterfactual_design_families: counterfactualDesignFamilies.length,
    eligible_panels_received: 0,
    submitted_outcome_packets: 0,
    assessed_alternative_explanations: 0,
    registered_counterfactual_designs: 0,
    inspected_results: 0,
    published_claims: 0,
    causal_claims_published: 0,
    comparisons_approved: 0,
    scores_created: 0,
    rankings_created: 0,
    decision_receipts_created: 0,
    phase64_cells_advanced: 0
  },
  outcome_evidence_packets: outcomeEvidencePackets,
  alternative_explanation_registers: alternativeExplanationRegisters,
  counterfactual_design_dockets: counterfactualDesignDockets
};

await writeJson(join(dataRoot, "phase-72-outcome-evidence-counterfactual-design-registry.json"), registry);

const pathwayIds = [...new Set(outcomeEvidencePackets.flatMap((record) => record.reader_pathway_ids))];
for (const pathwayId of pathwayIds) {
  const path = join(contentRoot, "reader-pathways", `${pathwayId.replace("reader-pathway-", "")}.json`);
  const pathway = await readJson(path);
  pathway.briefing_ids = [...new Set([...pathway.briefing_ids, "briefing-outcome-evidence-packet-desk-001", "briefing-counterfactual-design-desk-001"] )];
  pathway.dependency_map_ids = [...new Set([...pathway.dependency_map_ids, "dependency-map-descriptive-change-is-not-causal-effect"] )];
  await writeJson(path, pathway);
}

for (const cohort of phase68.cohort_records) {
  const packets = outcomeEvidencePackets.filter((record) => record.cohort_id === cohort.cohort_id);
  const alternative = alternativeExplanationRegisters.find((record) => record.cohort_id === cohort.cohort_id);
  const design = counterfactualDesignDockets.find((record) => record.cohort_id === cohort.cohort_id);
  const path = join(contentRoot, "briefings", `${cohort.canonical_briefing_id}.mdx`);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 72 claim-language and counterfactual boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 72 claim-language and counterfactual boundary\n\n[Outcome Evidence Packet Desk 001](/briefings/outcome-evidence-packet-desk-001/) assigns four empty claim packets to this named file: ${packets.map((record) => `[${record.evidence_packet_id}](/evidence/claims/${record.slug}/)`).join(", ")}. ${alternative.alternative_register_id} contains ten unassessed alternative-explanation categories, and [${design.counterfactual_docket_id}](/evidence/claims/${design.slug}/) remains Inactive with no selected design. No eligible panel, claim class, proposed language, assessment, counterfactual, result inspection, receipt, score, rank, or Phase 64 cell change exists.\n`;
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
  if (!body.includes("## Phase 72 claim-strength boundary")) {
    body = `${body.trimEnd()}\n\n## Phase 72 claim-strength boundary\n\nThe [Outcome Evidence And Counterfactual Registry](/evidence/claims/) publishes empty packet and design contracts for ${cohorts.map((record) => record.named_entity).join(" and ")}. Local context, authorization, acceptance, one observed level, or descriptive change cannot become attribution or causal effect without an assessed alternative register and a separately registered design.\n`;
    await writeFile(path, body, "utf8");
  }
}

for (const briefingName of [
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-longitudinal-panel-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx",
  "briefing-series-admission-protocol-001.mdx",
  "briefing-outcome-cohort-admission-desk-001.mdx"
]) {
  const path = join(contentRoot, "briefings", briefingName);
  let body = await readFile(path, "utf8");
  if (!body.includes("## Phase 72 evidence packet and design control")) {
    body = `${body.trimEnd()}\n\n## Phase 72 evidence packet and design control\n\n[Outcome Evidence Packet Desk 001](/briefings/outcome-evidence-packet-desk-001/) and the [Counterfactual Design Desk](/briefings/counterfactual-design-desk-001/) add thirty-two empty claim packets, eight empty alternative-explanation registers, and eight inactive causal-design dockets. They create zero eligible panels, proposed claims, assessments, registered designs, inspected results, receipts, scores, rankings, or stage changes.\n`;
    await writeFile(path, body, "utf8");
  }
}

console.log(`Phase 72 content built: ${outcomeEvidencePackets.length} empty outcome packets, ${alternativeExplanationRegisters.length} empty alternative registers, ${counterfactualDesignDockets.length} inactive counterfactual dockets, ${outcomePacketDimensions.length} packet gates, ${alternativeExplanationCategories.length} alternative categories, ${counterfactualDesignGates.length} design gates, ${pathwayIds.length} pathways, and 0 proposed claims or designs.`);
