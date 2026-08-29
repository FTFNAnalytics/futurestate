import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const readJson = async (...parts) => JSON.parse(await readFile(join(appRoot, ...parts), "utf8"));
const readText = async (...parts) => readFile(join(appRoot, ...parts), "utf8");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const registry = await readJson("src", "data", "phase-70-observation-review-series-admission-registry.json");
const phase68 = await readJson("src", "data", "phase-68-compatible-series-outcome-cohorts.json");
const phase69 = await readJson("src", "data", "phase-69-measurement-observation-break-registry.json");
const update = await readJson("src", "content", "updates", "2026-08-23-phase-70-observation-review-series-admission.json");
const reviewBriefing = await readText("src", "content", "briefings", "briefing-observation-review-desk-001.mdx");
const admissionBriefing = await readText("src", "content", "briefings", "briefing-series-admission-protocol-001.mdx");
const outcomes = await readText("src", "content", "briefings", "briefing-outcomes-watch-001-what-actually-changed.mdx");
const phase68Desk = await readText("src", "content", "briefings", "briefing-outcome-cohort-admission-desk-001.mdx");
const dictionary = await readText("src", "content", "briefings", "briefing-measurement-dictionary-001.mdx");
const breakBriefing = await readText("src", "content", "briefings", "briefing-series-break-adjudication-001.mdx");
const map = await readJson("src", "content", "dependency-maps", "reviewed-observation-is-not-admitted-series.json");
const endpoint = await readText("src", "pages", "data", "observation-review-series-admission.json.ts");
const dataIndex = await readText("src", "pages", "data", "index.astro");
const registryPage = await readText("src", "pages", "evidence", "review", "index.astro");
const detailPage = await readText("src", "pages", "evidence", "review", "[id].astro");
const sitemap = await readText("src", "pages", "sitemap.xml.ts");

check(registry.schema_version === "1.0" && registry.phase === "70", "The Phase 70 registry must identify schema 1.0 and Phase 70.");
check(registry.review_dimensions.length === 12 && registry.admission_dimensions.length === 8, "Phase 70 must define twelve review and eight admission dimensions.");
check(registry.observation_review_dockets.length === 32 && registry.observation_revision_lineage_registers.length === 32 && registry.series_admission_dockets.length === 8, "Phase 70 must contain 32 review dockets, 32 lineage registers, and 8 admission dockets.");
check(new Set(registry.observation_review_dockets.map((record) => record.review_docket_id)).size === 32 && new Set(registry.observation_review_dockets.map((record) => record.slug)).size === 32, "Review docket IDs and slugs must be unique.");
check(new Set(registry.observation_revision_lineage_registers.map((record) => record.lineage_register_id)).size === 32, "Lineage register IDs must be unique.");
check(new Set(registry.series_admission_dockets.map((record) => record.admission_docket_id)).size === 8 && new Set(registry.series_admission_dockets.map((record) => record.slug)).size === 8, "Admission docket IDs and slugs must be unique.");

for (const spec of phase69.measurement_specifications) {
  const reviews = registry.observation_review_dockets.filter((record) => record.specification_id === spec.specification_id);
  check(reviews.length === 1, `${spec.specification_id} must map to exactly one review docket.`);
  const docket = reviews[0];
  if (!docket) continue;
  const envelope = phase69.observation_intake_envelopes.find((record) => record.specification_id === spec.specification_id);
  check(docket.intake_envelope_id === envelope?.envelope_id && docket.cohort_id === spec.cohort_id && docket.file_id === spec.file_id && docket.named_entity === spec.named_entity && docket.measure_id === spec.measure_id, `${docket.review_docket_id} changes its Phase 69 binding.`);
  check(docket.review_checks.length === 12 && docket.review_checks.every((item) => item.decision_state === "Not Reviewed"), `${docket.review_docket_id} must expose twelve Not Reviewed checks.`);
  check(docket.required_observation_field_ids.length === 18 && JSON.stringify(docket.required_observation_field_ids) === JSON.stringify(spec.required_field_ids), `${docket.review_docket_id} changes the eighteen-field intake contract.`);
  check(docket.docket_state === "Awaiting Submission" && ["submitted_observation_id", "submitted_payload_hash", "first_reviewer_id", "first_review_date", "first_review_decision", "second_reviewer_id", "second_review_date", "second_review_decision", "conflict_or_recusal_state", "adjudication_decision", "decision_date", "receipt_type", "receipt_id", "break_decision_id"].every((key) => docket[key] === null), `${docket.review_docket_id} invents a submission, review, decision, or receipt.`);
  check(docket.accepted_observation_ids.length === 0 && docket.rejected_observation_ids.length === 0 && docket.revision_lineage_ids.length === 0 && docket.propagation_status === "not_started", `${docket.review_docket_id} invents an observation or propagation.`);
  check(docket.auto_acceptance_allowed === false && docket.direct_publication_allowed === false && docket.phase64_cell_change === "none", `${docket.review_docket_id} enables automatic state change.`);
  const lineage = registry.observation_revision_lineage_registers.find((record) => record.review_docket_id === docket.review_docket_id);
  check(lineage?.specification_id === spec.specification_id && lineage?.register_state === "Empty" && lineage?.current_observation_version_id === null, `${docket.review_docket_id} lacks an exact empty lineage register.`);
  check(lineage && [lineage.observation_versions, lineage.correction_events, lineage.supersession_events, lineage.withdrawal_events, lineage.published_observation_ids].every((items) => items.length === 0) && lineage.unresolved_revision_count === 0 && lineage.phase64_cell_change === "none", `${docket.review_docket_id} invents revision lineage.`);
}

for (const cohort of phase68.cohort_records) {
  const docket = registry.series_admission_dockets.find((record) => record.cohort_id === cohort.cohort_id);
  check(docket?.file_id === cohort.file_id && docket?.named_entity === cohort.named_entity, `${cohort.cohort_id} lacks an exact admission docket.`);
  check(docket?.measurement_specification_ids.length === 4 && docket?.review_docket_ids.length === 4, `${cohort.cohort_id} must bind four specifications and four reviews.`);
  check(docket?.admission_checks.length === 8 && docket?.admission_checks.filter((item) => item.decision_state === "Contract Present").length === 1 && docket?.admission_checks.filter((item) => item.decision_state === "Not Ready").length === 7, `${cohort.cohort_id} must preserve one contract and seven not-ready admission gates.`);
  check(docket?.admission_state === "Not Ready - No Reviewed Observations" && docket?.admission_decision === "Not Admitted", `${cohort.cohort_id} is prematurely admitted.`);
  check(docket && [docket.candidate_observation_ids, docket.eligible_observation_ids, docket.admitted_series_ids, docket.series_receipt_ids].every((items) => items.length === 0), `${cohort.cohort_id} invents observations, receipts, or series.`);
  check(docket && ["proposed_series_definition", "minimum_qualifying_observations", "first_reviewer_id", "second_reviewer_id", "decision_date", "decision_receipt_id"].every((key) => docket[key] === null), `${cohort.cohort_id} invents a series definition, threshold, reviewer, or decision.`);
  check(docket?.propagation_status === "not_started" && docket?.auto_admission_allowed === false && docket?.phase64_cell_change === "none" && docket?.outcome_claim_created === false, `${cohort.cohort_id} enables a premature admission or outcome.`);
}

const pathwayIds = [...new Set(registry.observation_review_dockets.flatMap((record) => record.reader_pathway_ids))];
check(pathwayIds.length === 10, "Phase 70 must integrate ten distinct reader pathways.");
for (const id of pathwayIds) {
  const pathway = await readJson("src", "content", "reader-pathways", `${id.replace("reader-pathway-", "")}.json`);
  check(pathway.briefing_ids.includes("briefing-observation-review-desk-001") && pathway.briefing_ids.includes("briefing-series-admission-protocol-001"), `${id} omits a Phase 70 briefing.`);
  check(pathway.dependency_map_ids.includes("dependency-map-reviewed-observation-is-not-admitted-series"), `${id} omits the Phase 70 map.`);
}

const canonicalIds = [...new Set(registry.observation_review_dockets.map((record) => record.canonical_briefing_id))];
check(canonicalIds.length === 8, "Phase 70 must deepen eight canonical named files.");
for (const id of canonicalIds) check((await readText("src", "content", "briefings", `${id}.mdx`)).includes("## Phase 70 observation review and series admission"), `${id} omits Phase 70.`);
const localFiles = (await readdir(join(appRoot, "src", "content", "local-systems"))).filter((name) => name.endsWith(".mdx"));
check(localFiles.length === 5 && (await Promise.all(localFiles.map((name) => readText("src", "content", "local-systems", name)))).every((text) => text.includes("## Phase 70 human-review boundary")), "All five local systems must expose the Phase 70 boundary.");

for (const [text, headings] of [[reviewBriefing, ["Why review begins after intake", "Twelve review dimensions", "Dual-control decision path", "Revision lineage", "Reject and hold rules", "Publication boundary"]], [admissionBriefing, ["Why acceptance does not admit a series", "Eight admission gates", "Admission decisions", "Breaks remain visible", "Outcome boundary", "Publication boundary"]]]) {
  check(/record_status:\s*"Published"/.test(text), "Both Phase 70 briefings must be Published.");
  headings.forEach((heading) => check(text.includes(`## ${heading}`), `A Phase 70 briefing is missing ${heading}.`));
}
check([outcomes, phase68Desk, dictionary, breakBriefing].every((text) => text.includes("## Phase 70 review and admission control")), "A required operating briefing omits Phase 70.");
check(map.record_status === "Published" && map.nodes.length === 8 && map.links.length === 7, "The Phase 70 dependency map is incomplete.");
check(map.what_this_map_does_not_prove.some((item) => item.toLowerCase().includes("outcome")), "The Phase 70 map must reject outcome inference.");
check(update.materiality === "No record-state change" && !update.receipt_id && !update.decision_date, "The Phase 70 update invents a receipt or decision.");
check(endpoint.includes('"observation_review_series_admission"') && endpoint.includes("registry.observation_revision_lineage_registers") && endpoint.includes("registry.series_admission_dockets"), "The Phase 70 public endpoint is incomplete.");
check(dataIndex.includes("Observation Review And Series Admission") && dataIndex.includes("bounded public contracts"), "The public data index omits Phase 70.");
check(registryPage.includes("data-review-registry") && registryPage.includes("Search the empty observation-review desk") && registryPage.includes("8 admission dockets"), "The Phase 70 registry page is incomplete.");
check(detailPage.includes("Twelve decisions remain Not Reviewed") && detailPage.includes("Eight gates before a compatible series") && detailPage.includes("A review docket is not a reviewed observation"), "The Phase 70 detail template omits a control boundary.");
check(sitemap.includes("reviewRegistry.observation_review_dockets") && sitemap.includes("reviewRegistry.series_admission_dockets") && sitemap.includes('"/evidence/review/"'), "The sitemap source omits Phase 70 routes.");
check(phase69.metrics.observations_created === 0 && phase69.metrics.values_created === 0 && phase69.metrics.series_points_created === 0 && phase68.metrics.admitted_cohorts === 0, "Phase 70 changes the inherited evidence baseline.");
check(registry.metrics.submitted_observations === 0 && registry.metrics.completed_first_reviews === 0 && registry.metrics.completed_second_reviews === 0 && registry.metrics.accepted_observations === 0 && registry.metrics.revision_events === 0 && registry.metrics.decision_receipts_created === 0 && registry.metrics.admitted_series_created === 0, "Phase 70 creates real workflow state.");
check(registry.metrics.phase64_cells_advanced === 0 && registry.metrics.scores_created === 0 && registry.metrics.rankings_created === 0 && registry.metrics.outcome_claims_created === 0, "Phase 70 advances cells, scores, ranks, or claims outcomes.");

if (failures.length) {
  console.error("Phase 70 assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Phase 70 assertions passed: 32 empty review dockets, 32 empty revision-lineage registers, 8 not-ready admission dockets, 12 review dimensions, 8 admission gates, 10 pathways, 5 local systems, and 0 submissions, reviews, receipts, observations, revisions, series, scores, rankings, or outcome claims.");
