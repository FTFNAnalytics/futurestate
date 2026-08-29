import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const phase68 = await readJson("src", "data", "phase-68-compatible-series-outcome-cohorts.json");
const phase71 = await readJson("src", "data", "phase-71-longitudinal-panel-outcome-comparison-registry.json");
const registry = await readJson("src", "data", "phase-72-outcome-evidence-counterfactual-design-registry.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-72-outcome-evidence-counterfactual-design.json");
const packetBriefing = await readText("src", "content", "briefings", "briefing-outcome-evidence-packet-desk-001.mdx");
const designBriefing = await readText("src", "content", "briefings", "briefing-counterfactual-design-desk-001.mdx");
const operatingBriefings = await Promise.all([
  "briefing-outcomes-watch-001-what-actually-changed.mdx",
  "briefing-longitudinal-panel-desk-001.mdx",
  "briefing-outcome-claim-comparison-protocol-001.mdx",
  "briefing-series-admission-protocol-001.mdx",
  "briefing-outcome-cohort-admission-desk-001.mdx"
].map((name) => readText("src", "content", "briefings", name)));
const map = await readJson("src", "content", "dependency-maps", "descriptive-change-is-not-causal-effect.json");
const endpoint = await readText("src", "pages", "data", "outcome-evidence-counterfactual-designs.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");
const registryPage = await readText("src", "pages", "evidence", "claims", "index.astro");
const detailPage = await readText("src", "pages", "evidence", "claims", "[id].astro");
const sitemap = await readText("src", "pages", "sitemap.xml.ts");

check(registry.schema_version === "1.0" && registry.phase === "72", "The Phase 72 registry must identify schema 1.0 and Phase 72.");
check(registry.claim_class_taxonomy.length === 7 && registry.outcome_packet_dimensions.length === 12 && registry.alternative_explanation_categories.length === 10 && registry.counterfactual_design_gates.length === 12 && registry.counterfactual_design_families.length === 6, "Phase 72 must define seven claim classes, twelve packet gates, ten alternative categories, twelve design gates, and six design families.");
check(registry.outcome_evidence_packets.length === 32 && registry.alternative_explanation_registers.length === 8 && registry.counterfactual_design_dockets.length === 8, "Phase 72 must contain 32 packets, 8 alternative registers, and 8 design dockets.");
check(new Set(registry.outcome_evidence_packets.map((record) => record.evidence_packet_id)).size === 32 && new Set(registry.outcome_evidence_packets.map((record) => record.slug)).size === 32, "Outcome packet IDs and slugs must be unique.");
check(new Set(registry.alternative_explanation_registers.map((record) => record.alternative_register_id)).size === 8, "Alternative register IDs must be unique.");
check(new Set(registry.counterfactual_design_dockets.map((record) => record.counterfactual_docket_id)).size === 8 && new Set(registry.counterfactual_design_dockets.map((record) => record.slug)).size === 8, "Counterfactual docket IDs and slugs must be unique.");

for (const panel of phase71.longitudinal_panel_shells) {
  const packets = registry.outcome_evidence_packets.filter((record) => record.panel_id === panel.panel_id);
  check(packets.length === 1, `${panel.panel_id} must map to exactly one outcome packet.`);
  const packet = packets[0];
  if (!packet) continue;
  const outcome = phase71.outcome_claim_dockets.find((record) => record.cohort_id === panel.cohort_id);
  check(packet.panel_slug === panel.slug && packet.panel_state === panel.panel_state && packet.outcome_claim_docket_id === outcome?.outcome_claim_docket_id && packet.cohort_id === panel.cohort_id && packet.file_id === panel.file_id && packet.named_entity === panel.named_entity && packet.measure_id === panel.measure_id, `${packet.evidence_packet_id} changes an upstream identity.`);
  check(packet.specification_id === panel.specification_id && packet.review_docket_id === panel.review_docket_id && packet.series_admission_docket_id === panel.series_admission_docket_id, `${packet.evidence_packet_id} changes a measurement or review binding.`);
  check(packet.claim_class_ids.length === 7 && JSON.stringify(packet.claim_class_ids) === JSON.stringify(registry.claim_class_taxonomy.map((record) => record.claim_class_id)), `${packet.evidence_packet_id} changes the claim-class taxonomy.`);
  check(packet.packet_checks.length === 12 && packet.packet_checks.every((item) => item.decision_state === "Not Ready"), `${packet.evidence_packet_id} must expose twelve Not Ready checks.`);
  check(packet.packet_state === "Empty - No Eligible Panel" && ["selected_claim_class_id", "outcome_question", "proposed_claim_text", "verb_strength", "baseline_period", "followup_period", "calculation_specification", "attribution_boundary", "uncertainty_statement", "first_reviewer_id", "second_reviewer_id", "decision_date", "decision_receipt_id"].every((key) => packet[key] === null), `${packet.evidence_packet_id} invents eligibility, language, calculation, attribution, uncertainty, review, or receipt state.`);
  check([packet.supporting_panel_ids, packet.supporting_observation_ids, packet.adverse_observation_ids, packet.alternative_explanation_entry_ids, packet.sensitivity_records, packet.reproducibility_artifact_ids].every((items) => items.length === 0), `${packet.evidence_packet_id} invents evidence, adverse records, alternatives, sensitivity, or reproducibility artifacts.`);
  check(packet.propagation_status === "not_started" && packet.automatic_claim_classification_allowed === false && packet.automatic_publication_allowed === false && packet.phase64_cell_change === "none", `${packet.evidence_packet_id} enables an automatic claim or state change.`);
}

for (const cohort of phase68.cohort_records) {
  const outcome = phase71.outcome_claim_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  const comparison = phase71.comparison_embargo_registers.find((record) => record.cohort_id === cohort.cohort_id);
  const alternative = registry.alternative_explanation_registers.find((record) => record.cohort_id === cohort.cohort_id);
  const design = registry.counterfactual_design_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  check(alternative?.file_id === cohort.file_id && alternative?.named_entity === cohort.named_entity && alternative?.outcome_claim_docket_id === outcome?.outcome_claim_docket_id, `${cohort.cohort_id} lacks an exact alternative register.`);
  check(alternative?.evidence_packet_ids.length === 4 && alternative?.category_assessments.length === 10 && alternative?.category_assessments.every((item) => item.assessment_state === "Not Assessed"), `${cohort.cohort_id} must bind four packets and ten unassessed categories.`);
  check(alternative?.register_state === "Empty - No Eligible Claim Packet" && alternative && alternative.category_assessments.every((item) => item.applicability_decision === null && item.evidence_for_ids.length === 0 && item.evidence_against_ids.length === 0 && item.uncertainty_note === null && item.disposition === null), `${cohort.cohort_id} invents an alternative assessment.`);
  check(alternative && alternative.selected_alternative_entry_ids.length === 0 && alternative.adverse_observation_ids.length === 0 && alternative.reviewer_notes.length === 0 && alternative.decision_date === null && alternative.decision_receipt_id === null && alternative.propagation_status === "not_started" && alternative.silence_means_none === false && alternative.automatic_none_allowed === false && alternative.phase64_cell_change === "none", `${cohort.cohort_id} enables a silent or automatic alternative decision.`);
  check(design?.file_id === cohort.file_id && design?.named_entity === cohort.named_entity && design?.outcome_claim_docket_id === outcome?.outcome_claim_docket_id && design?.comparison_register_id === comparison?.comparison_register_id && design?.alternative_explanation_register_id === alternative?.alternative_register_id, `${cohort.cohort_id} lacks an exact counterfactual docket.`);
  check(design?.evidence_packet_ids.length === 4 && design?.design_family_ids.length === 6 && design?.design_checks.length === 12 && design?.design_checks.every((item) => item.decision_state === "Inactive"), `${cohort.cohort_id} must bind four packets, six families, and twelve inactive gates.`);
  check(design?.design_state === "Inactive - No Causal Claim Proposed" && design?.design_decision === "Not Registered", `${cohort.cohort_id} prematurely registers a design.`);
  check(design && ["selected_design_family_id", "causal_question", "intervention_definition", "treatment_unit", "eligible_population", "outcome_definition", "estimand", "assignment_mechanism", "baseline_period", "followup_period", "missing_data_plan", "power_or_precision_plan", "sensitivity_plan", "preregistration_artifact_id", "first_reviewer_id", "second_reviewer_id", "decision_date", "decision_receipt_id"].every((key) => design[key] === null), `${cohort.cohort_id} invents a design, estimand, plan, reviewer, or receipt.`);
  check(design && [design.comparison_unit_ids, design.donor_pool_ids, design.confounder_records, design.spillover_records, design.falsification_test_records].every((items) => items.length === 0), `${cohort.cohort_id} invents a comparison, confounder, spillover, or test record.`);
  check(design?.propagation_status === "not_started" && design?.result_inspection_allowed === false && design?.automatic_design_selection_allowed === false && design?.causal_publication_allowed === false && design?.phase64_cell_change === "none", `${cohort.cohort_id} enables result inspection, design selection, causal publication, or a cell change.`);
}

const pathwayIds = [...new Set(registry.outcome_evidence_packets.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 72 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", `${id.replace("reader-pathway-", "")}.json`);
  check(pathway.briefing_ids.includes("briefing-outcome-evidence-packet-desk-001") && pathway.briefing_ids.includes("briefing-counterfactual-design-desk-001"), `${id} omits a Phase 72 briefing.`);
  check(pathway.dependency_map_ids.includes("dependency-map-descriptive-change-is-not-causal-effect"), `${id} omits the Phase 72 map.`);
}

const canonicalIds = [...new Set(registry.outcome_evidence_packets.map((record) => record.canonical_briefing_id))];
check(canonicalIds.length === 8, "Phase 72 must deepen eight canonical named files.");
for (const id of canonicalIds) check((await readText("src", "content", "briefings", `${id}.mdx`)).includes("## Phase 72 claim-language and counterfactual boundary"), `${id} omits Phase 72.`);
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
check(localFiles.length === 5 && (await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)))).every((text) => text.includes("## Phase 72 claim-strength boundary")), "All five local systems must expose the Phase 72 boundary.");

for (const [text, headings] of [[packetBriefing, ["Why claim language needs a contract", "Seven claim classes", "Twelve packet gates", "Adverse evidence and alternatives", "Uncertainty and reproducibility", "Publication boundary"]], [designBriefing, ["Why descriptive change is not a causal effect", "Ten alternative-explanation categories", "Six design families", "Twelve design gates", "Registration before result inspection", "Publication boundary"]]]) {
  check(/record_status:\s*"Published"/.test(text), "Both Phase 72 briefings must be Published.");
  headings.forEach((heading) => check(text.includes(`## ${heading}`), `A Phase 72 briefing is missing ${heading}.`));
}
check(operatingBriefings.every((text) => text.includes("## Phase 72 evidence packet and design control")), "A required operating briefing omits Phase 72.");
check(map.record_status === "Published" && map.nodes.length === 9 && map.links.length === 8, "The Phase 72 dependency map is incomplete.");
check(map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("causal")) && map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("rank")), "The Phase 72 map must reject causal and ranking inference.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 72 update invents a receipt or decision.");
check(endpoint.includes('"outcome_evidence_counterfactual_designs"') && endpoint.includes("registry.alternative_explanation_registers") && endpoint.includes("registry.counterfactual_design_dockets"), "The Phase 72 public endpoint is incomplete.");
check(dataIndex.includes("Outcome Evidence And Counterfactual Designs") && dataIndex.includes("bounded public contracts"), "The public data index omits Phase 72.");
check(registryPage.includes("data-claim-registry") && registryPage.includes("Search thirty-two empty claim packets") && registryPage.includes("8 inactive designs"), "The Phase 72 registry page is incomplete.");
check(detailPage.includes("Twelve evidence-packet gates remain Not Ready") && detailPage.includes("Ten categories remain Not Assessed") && detailPage.includes("Twelve design gates remain Inactive") && detailPage.includes("An evidence-packet contract is not a proposed or published claim"), "The Phase 72 detail template omits a control boundary.");
check(sitemap.includes("outcomeDesignRegistry.outcome_evidence_packets") && sitemap.includes("outcomeDesignRegistry.counterfactual_design_dockets") && sitemap.includes('"/evidence/claims/"'), "The sitemap source omits Phase 72 routes.");
check(phase71.metrics.admitted_series_received === 0 && phase71.metrics.values_published === 0 && phase71.metrics.outcome_claims_published === 0 && phase71.metrics.comparisons_approved === 0, "Phase 72 changes the inherited evidence baseline.");
check(registry.metrics.eligible_panels_received === 0 && registry.metrics.submitted_outcome_packets === 0 && registry.metrics.assessed_alternative_explanations === 0 && registry.metrics.registered_counterfactual_designs === 0 && registry.metrics.inspected_results === 0 && registry.metrics.published_claims === 0 && registry.metrics.causal_claims_published === 0, "Phase 72 creates a panel, packet, assessment, design, result, or claim.");
check(registry.metrics.comparisons_approved === 0 && registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0 && registry.metrics.decision_receipts_created === 0 && registry.metrics.phase64_cells_advanced === 0, "Phase 72 creates a comparison, score, rank, receipt, or stage change.");

if (failures.length) {
  console.error("Phase 72 assertions failed:"); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1);
}

console.log("Phase 72 assertions passed: 32 empty outcome-evidence packets, 8 empty alternative-explanation registers, 8 inactive counterfactual-design dockets, 7 claim classes, 12 packet gates, 10 alternative categories, 12 design gates, 6 design families, 10 pathways, 5 local systems, and 0 eligible panels, claims, assessments, designs, results, receipts, scores, rankings, or stage changes.");
