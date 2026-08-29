import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const phase68 = await readJson("src", "data", "phase-68-compatible-series-outcome-cohorts.json");
const phase69 = await readJson("src", "data", "phase-69-measurement-observation-break-registry.json");
const phase70 = await readJson("src", "data", "phase-70-observation-review-series-admission-registry.json");
const registry = await readJson("src", "data", "phase-71-longitudinal-panel-outcome-comparison-registry.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-71-longitudinal-outcome-comparison-control.json");
const panelBriefing = await readText("src", "content", "briefings", "briefing-longitudinal-panel-desk-001.mdx");
const outcomeBriefing = await readText("src", "content", "briefings", "briefing-outcome-claim-comparison-protocol-001.mdx");
const outcomesWatch = await readText("src", "content", "briefings", "briefing-outcomes-watch-001-what-actually-changed.mdx");
const reviewDesk = await readText("src", "content", "briefings", "briefing-observation-review-desk-001.mdx");
const admissionProtocol = await readText("src", "content", "briefings", "briefing-series-admission-protocol-001.mdx");
const cohortDesk = await readText("src", "content", "briefings", "briefing-outcome-cohort-admission-desk-001.mdx");
const map = await readJson("src", "content", "dependency-maps", "admitted-series-is-not-causal-outcome.json");
const endpoint = await readText("src", "pages", "data", "longitudinal-panels-outcome-claims.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");
const registryPage = await readText("src", "pages", "evidence", "outcomes", "index.astro");
const detailPage = await readText("src", "pages", "evidence", "outcomes", "[id].astro");
const sitemap = await readText("src", "pages", "sitemap.xml.ts");

check(registry.schema_version === "1.0" && registry.phase === "71", "The Phase 71 registry must identify schema 1.0 and Phase 71.");
check(registry.outcome_inference_dimensions.length === 10 && registry.comparison_eligibility_dimensions.length === 10, "Phase 71 must define ten outcome and ten comparison dimensions.");
check(registry.longitudinal_panel_shells.length === 32 && registry.outcome_claim_dockets.length === 8 && registry.comparison_embargo_registers.length === 8, "Phase 71 must contain 32 panels, 8 claim dockets, and 8 comparison registers.");
check(new Set(registry.longitudinal_panel_shells.map((record) => record.panel_id)).size === 32 && new Set(registry.longitudinal_panel_shells.map((record) => record.slug)).size === 32, "Panel IDs and slugs must be unique.");
check(new Set(registry.outcome_claim_dockets.map((record) => record.outcome_claim_docket_id)).size === 8 && new Set(registry.outcome_claim_dockets.map((record) => record.slug)).size === 8, "Outcome docket IDs and slugs must be unique.");
check(new Set(registry.comparison_embargo_registers.map((record) => record.comparison_register_id)).size === 8, "Comparison register IDs must be unique.");

for (const spec of phase69.measurement_specifications) {
  const panels = registry.longitudinal_panel_shells.filter((record) => record.specification_id === spec.specification_id);
  check(panels.length === 1, `${spec.specification_id} must map to exactly one panel.`);
  const panel = panels[0];
  if (!panel) continue;
  const review = phase70.observation_review_dockets.find((record) => record.specification_id === spec.specification_id);
  const admission = phase70.series_admission_dockets.find((record) => record.cohort_id === spec.cohort_id);
  check(panel.review_docket_id === review?.review_docket_id && panel.series_admission_docket_id === admission?.admission_docket_id && panel.cohort_id === spec.cohort_id && panel.named_entity === spec.named_entity && panel.measure_id === spec.measure_id, `${panel.panel_id} changes its upstream binding.`);
  check(panel.numerator_contract === spec.numerator_contract && panel.denominator_contract === spec.denominator_contract && panel.scope_contract === spec.scope_contract && panel.unit_contract === spec.unit_contract && panel.period_contract === spec.period_contract && panel.method_contract === spec.method_contract && panel.exception_contract === spec.exception_contract, `${panel.panel_id} changes a measurement contract.`);
  check(panel.panel_state === "Empty - No Admitted Series" && panel.current_series_id === null && panel.admitted === false, `${panel.panel_id} invents a series.`);
  check([panel.accepted_observation_ids, panel.series_point_ids, panel.period_axis, panel.values, panel.revisions, panel.breaks, panel.uncertainty_notes, panel.outcome_claim_ids].every((items) => items.length === 0), `${panel.panel_id} invents a point, value, revision, break, uncertainty record, or claim.`);
  check(["first_period", "last_period", "minimum_periods_for_claim", "current_direction", "current_magnitude", "current_trend"].every((key) => panel[key] === null), `${panel.panel_id} invents a period, sufficiency threshold, direction, magnitude, or trend.`);
  check(panel.automatic_trend_allowed === false && panel.phase64_cell_change === "none", `${panel.panel_id} enables automatic inference or a cell change.`);
}

for (const cohort of phase68.cohort_records) {
  const outcome = registry.outcome_claim_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  const comparison = registry.comparison_embargo_registers.find((record) => record.cohort_id === cohort.cohort_id);
  const admission = phase70.series_admission_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  check(outcome?.file_id === cohort.file_id && outcome?.named_entity === cohort.named_entity && outcome?.series_admission_docket_id === admission?.admission_docket_id, `${cohort.cohort_id} lacks an exact outcome docket.`);
  check(outcome?.panel_ids.length === 4 && outcome?.outcome_inference_checks.length === 10 && outcome?.outcome_inference_checks.every((item) => item.decision_state === "Not Ready"), `${cohort.cohort_id} must bind four panels and ten not-ready outcome gates.`);
  check(outcome?.docket_state === "Not Ready - No Admitted Series" && outcome?.claim_decision === "Not Published", `${cohort.cohort_id} is prematurely published as an outcome.`);
  check(outcome && [outcome.supporting_panel_ids, outcome.supporting_observation_ids, outcome.adverse_observation_ids, outcome.alternative_explanation_records].every((items) => items.length === 0), `${cohort.cohort_id} invents claim evidence.`);
  check(outcome && ["proposed_claim_text", "proposed_claim_type", "uncertainty_statement", "attribution_statement", "first_reviewer_id", "second_reviewer_id", "decision_date", "decision_receipt_id"].every((key) => outcome[key] === null), `${cohort.cohort_id} invents a claim, reviewer, or receipt.`);
  check(outcome?.causal_claim_allowed === false && outcome?.automatic_publication_allowed === false && outcome?.score_created === false && outcome?.ranking_created === false && outcome?.phase64_cell_change === "none", `${cohort.cohort_id} enables premature inference.`);
  check(comparison?.outcome_claim_docket_id === outcome?.outcome_claim_docket_id && comparison?.comparison_state === "Embargoed - No Common Admitted Series", `${cohort.cohort_id} lacks the exact comparison embargo.`);
  check(comparison?.comparison_checks.length === 10 && comparison?.comparison_checks.every((item) => item.decision_state === "Not Ready"), `${cohort.cohort_id} must expose ten not-ready comparison gates.`);
  check(comparison && [comparison.comparison_candidate_ids, comparison.approved_peer_ids, comparison.approved_measure_ids].every((items) => items.length === 0) && ["comparison_decision", "decision_date", "decision_receipt_id"].every((key) => comparison[key] === null), `${cohort.cohort_id} invents a comparison or receipt.`);
  check(comparison?.cross_entity_transfer_allowed === false && comparison?.automatic_comparison_allowed === false && comparison?.score_created === false && comparison?.ranking_created === false && comparison?.phase64_cell_change === "none", `${cohort.cohort_id} enables comparison, scoring, ranking, or a cell change.`);
}

const pathwayIds = [...new Set(registry.longitudinal_panel_shells.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 71 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", `${id.replace("reader-pathway-", "")}.json`);
  check(pathway.briefing_ids.includes("briefing-longitudinal-panel-desk-001") && pathway.briefing_ids.includes("briefing-outcome-claim-comparison-protocol-001"), `${id} omits a Phase 71 briefing.`);
  check(pathway.dependency_map_ids.includes("dependency-map-admitted-series-is-not-causal-outcome"), `${id} omits the Phase 71 map.`);
}

const canonicalIds = [...new Set(registry.longitudinal_panel_shells.map((record) => record.canonical_briefing_id))];
check(canonicalIds.length === 8, "Phase 71 must deepen eight canonical named files.");
for (const id of canonicalIds) check((await readText("src", "content", "briefings", `${id}.mdx`)).includes("## Phase 71 longitudinal outcome boundary"), `${id} omits Phase 71.`);
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
check(localFiles.length === 5 && (await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)))).every((text) => text.includes("## Phase 71 outcome and comparison boundary")), "All five local systems must expose the Phase 71 boundary.");

for (const [text, headings] of [[panelBriefing, ["Why panels begin empty", "Thirty-two exact contracts", "What an admitted series may populate", "Breaks, revisions, and missing periods", "Trend boundary", "Publication boundary"]], [outcomeBriefing, ["Why an outcome claim is a separate decision", "Ten outcome-inference gates", "Descriptive, attributable, and causal language", "Ten comparison-eligibility gates", "Scoring and ranking prohibition", "Publication boundary"]]]) {
  check(/record_status:\s*"Published"/.test(text), "Both Phase 71 briefings must be Published.");
  headings.forEach((heading) => check(text.includes(`## ${heading}`), `A Phase 71 briefing is missing ${heading}.`));
}
check([outcomesWatch, reviewDesk, admissionProtocol, cohortDesk].every((text) => text.includes("## Phase 71 panel, claim, and comparison control")), "A required operating briefing omits Phase 71.");
check(map.record_status === "Published" && map.nodes.length === 8 && map.links.length === 7, "The Phase 71 dependency map is incomplete.");
check(map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("caus")) && map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("rank")), "The Phase 71 map must reject causal and ranking inference.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 71 update invents a receipt or decision.");
check(endpoint.includes('"longitudinal_panels_outcome_claims"') && endpoint.includes("registry.outcome_claim_dockets") && endpoint.includes("registry.comparison_embargo_registers"), "The Phase 71 public endpoint is incomplete.");
check(dataIndex.includes("Longitudinal Panels And Outcome Claims") && dataIndex.includes("bounded public contracts"), "The public data index omits Phase 71.");
check(registryPage.includes("data-outcome-registry") && registryPage.includes("Search thirty-two empty panel shells") && registryPage.includes("8 comparison embargoes"), "The Phase 71 registry page is incomplete.");
check(detailPage.includes("Ten outcome gates remain Not Ready") && detailPage.includes("Ten comparison gates remain Not Ready") && detailPage.includes("A panel shell is not an admitted series or trend"), "The Phase 71 detail template omits a control boundary.");
check(sitemap.includes("longitudinalOutcomeRegistry.longitudinal_panel_shells") && sitemap.includes("longitudinalOutcomeRegistry.outcome_claim_dockets") && sitemap.includes('"/evidence/outcomes/"'), "The sitemap source omits Phase 71 routes.");
check(phase70.metrics.admitted_series_created === 0 && phase69.metrics.values_created === 0 && phase69.metrics.series_points_created === 0 && phase68.metrics.admitted_cohorts === 0, "Phase 71 changes the inherited evidence baseline.");
check(registry.metrics.admitted_series_received === 0 && registry.metrics.panel_series_points === 0 && registry.metrics.values_published === 0 && registry.metrics.trends_created === 0 && registry.metrics.outcome_claims_published === 0 && registry.metrics.comparisons_approved === 0, "Phase 71 creates real series, values, trends, claims, or comparisons.");
check(registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0 && registry.metrics.decision_receipts_created === 0 && registry.metrics.phase64_cells_advanced === 0, "Phase 71 creates scores, rankings, receipts, or stage changes.");

if (failures.length) {
  console.error("Phase 71 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 71 assertions passed: 32 empty panel shells, 8 not-ready outcome-claim dockets, 8 active comparison embargoes, 10 outcome gates, 10 comparison gates, 10 pathways, 5 local systems, and 0 series, points, values, trends, claims, comparisons, scores, rankings, receipts, or stage changes.");
