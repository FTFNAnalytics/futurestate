import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57c-service-reliability-adoption-recurring-output-validation.json"));
const review = await readJson(join(dataRoot, "phase-57c-publication-review.json"));
const phase57b = await readJson(join(dataRoot, "phase-57b-accepted-service-independent-outcome-validation.json"));
const collection = await readJson(join(contentRoot, "research-collections", "service-reliability-adoption-recurring-output-validation-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57c-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57c-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-57c-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const record = (key) => ledger.records.find((item) => item.action_key === key);

check(ledger.phase === "57C", "Phase 57C ledger has the wrong phase.");
check(ledger.records.length === 20 && new Set(ledger.records.map((item) => item.record_id)).size === 20, "Phase 57C must contain twenty unique records.");
check(ledger.records_published === 12 && ledger.records_held === 8, "Phase 57C must publish twelve records and hold eight.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({ "Service inventory and reliability boundary": 5, "Repeat operating output": 4, "Accepted disposal and closed-loop outcome": 2, "Cross-system validation boundary": 1, "Service reliability hold": 2, "Adoption and activation hold": 3, "Recurring output and baseline hold": 3 }), "Phase 57C evidence-stage counts are incorrect.");
check(ledger.records.every((item) => item.denominator && item.evidence_limits.length >= 3 && item.next_action && item.authority_boundary), "Every Phase 57C record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57C must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((item) => !item.contact_or_foia_submitted), "Phase 57C must record no agency contact or FOIA submission.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 57C must record no directive-scope, implementation, or closure change.");
check(ledger.records.every((item) => !item.directive_scope_change && !item.implementation_change && !item.closure_change), "Phase 57C records must preserve directive scope, implementation, and closure.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57b.post_batch_visible_scope), "Phase 57C must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57C must preserve the 1 / 21 / 2 entity evidence ledger.");
check(ledger.new_official_source_profiles === 2 && ledger.carried_official_source_profiles === 14, "Phase 57C source counts are incorrect.");
check(sourceFiles.length === 2 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 57C must add two current Tier 1 sources.");
check(documents.length === 20 && documents.filter((item) => item.record_status === "Published").length === 12 && documents.filter((item) => item.record_status === "In Review").length === 8, "Phase 57C document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57C document must be an official-link record.");
check(signalFiles.length === 20, "Phase 57C must generate twenty signals.");
check(collection.document_ids.length === 20 && review.promoted_document_ids.length === 12 && review.promoted_signal_ids.length === 12 && review.held_document_ids.length === 8 && review.held_signal_ids.length === 8, "Phase 57C collection or publication-review counts are incorrect.");

check(record("AMTRAK-ADA-PORTFOLIO-2026-01")?.denominator.includes("385 active-station") && record("AMTRAK-ADA-PORTFOLIO-2026-01")?.denominator.includes("46 platform-excluded"), "The Amtrak portfolio panel must preserve the full station denominator and responsibility boundary.");
check(record("AMTRAK-ABT-BACKLOG-2026-01")?.denominator.includes("231 railcar") && record("AMTRAK-ABT-BACKLOG-2026-01")?.evidence_limits.some((item) => item.includes("eligible fleet")), "The boarding-ramp inventory must remain separate from the eligible fleet.");
check(record("AMTRAK-PIDS-CLOSEOUT-HOLD-2026-02")?.record_status === "In Review" && record("AMTRAK-NAMED-RELIABILITY-HOLD-2026-01")?.record_status === "In Review", "Both Amtrak reliability holds must remain In Review.");
check(record("LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-02")?.denominator.includes("104 BEAD locations") && record("LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-02")?.record_status === "In Review", "The Louisiana adoption hold must retain its 104-location denominator.");
check(record("MT-BEAD-QUARTERLY-HOLD-2026-02")?.evidence_limits.some((item) => item.includes("Instructions are not")), "Montana reporting instructions must remain separate from results.");
check(record("HANFORD-WTP-GALLON-SERIES-2026-01")?.evidence_limits.some((item) => item.includes("do not support an inferred monthly")), "The Hanford gallon progression must not fabricate a monthly rate.");
check(record("HANFORD-WTP-CONTAINER-SERIES-2026-01")?.denominator.includes("produced") && record("HANFORD-WTP-CONTAINER-SERIES-2026-01")?.denominator.includes("shipped"), "The Hanford container panel must preserve stage distinctions.");
check(record("HANFORD-TBI-CLOSED-LOOP-2025-01")?.finding.includes("more than 99 percent") && record("HANFORD-TBI-CLOSED-LOOP-2025-01")?.finding.includes("permanently disposed"), "The TBI closed-loop cohort must preserve its bounded treatment and disposal result.");
check(record("HANFORD-GROUNDWATER-MASS-2026-01")?.evidence_limits.some((item) => item.includes("cannot be assigned to FY 2024")), "Lifetime groundwater contaminant mass must remain separate from FY 2024 volume.");
check(record("NNSA-PIT-PROJECT-BASELINE-BOUNDARY-2026-01")?.evidence_limits.some((item) => item.includes("project baseline") || item.includes("Project baseline")), "The NNSA project-to-program boundary must remain explicit.");
check(record("NNSA-PIT-RATE-HOLD-2026-02")?.record_status === "In Review" && record("NNSA-PIT-RATE-HOLD-2026-02")?.evidence_limits.some((item) => item.includes("target count")), "The NNSA recurring-output objective must remain separate from actual output.");
check(record("NNSA-PIT-PEIS-HOLD-2026-02")?.record_status === "In Review" && record("NNSA-PIT-GAO-BASELINE-HOLD-2026-03")?.record_status === "In Review", "The NNSA capacity and program-baseline holds must remain In Review.");
const phase57bHolds = phase57b.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
check(JSON.stringify([...ledger.preserved_phase57b_holds].sort()) === JSON.stringify(phase57bHolds) && phase57bHolds.length === 7, "All seven Phase 57B holds must remain explicitly preserved.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-033-service-reliability-adoption-recurring-output-validation"), `${file} must link Research Watch 033.`);
  check(pathway.research_collection_ids.includes("research-collection-service-reliability-adoption-recurring-output-validation-2026"), `${file} must link the Phase 57C collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57C service reliability, adoption, and recurring-output validation panels"), `${file} must include the Phase 57C dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57c-service-reliability-adoption-recurring-output"), "Dependency map must include the Phase 57C node.");
check(map.links.filter((link) => link.from === "node-phase57c-service-reliability-adoption-recurring-output").length === 3, "Dependency map must include three Phase 57C links.");
await access(join(appRoot, "public", "downloads", "service-reliability-adoption-recurring-output-validation-2026.zip"));

if (failures.length) {
  console.error("Phase 57C assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57C assertions passed: 12 Published, 8 In Review, 2 new Tier 1 sources, all 7 Phase 57B holds preserved, 0 exact targets, and unchanged scope and closure ledgers.");
