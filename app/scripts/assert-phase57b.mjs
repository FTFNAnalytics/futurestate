import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57b-accepted-service-independent-outcome-validation.json"));
const review = await readJson(join(dataRoot, "phase-57b-publication-review.json"));
const phase57a = await readJson(join(dataRoot, "phase-57a-fixed-cohort-completion-realized-outcomes.json"));
const collection = await readJson(join(contentRoot, "research-collections", "accepted-service-independent-outcome-validation-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57b-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57b-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-57b-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const record = (key) => ledger.records.find((item) => item.action_key === key);

check(ledger.phase === "57B", "Phase 57B ledger has the wrong phase.");
check(ledger.records.length === 17 && new Set(ledger.records.map((item) => item.record_id)).size === 17, "Phase 57B must contain seventeen unique records.");
check(ledger.records_published === 10 && ledger.records_held === 7, "Phase 57B must publish ten records and hold seven.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({ "Accepted-service cohort": 5, "Observed operating output": 5, "Closeout or performance hold": 4, "Rate, capacity, and baseline hold": 3 }), "Phase 57B evidence-stage counts are incorrect.");
check(ledger.records.every((item) => item.denominator && item.evidence_limits.length >= 3 && item.next_action && item.authority_boundary), "Every Phase 57B record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57B must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((item) => !item.contact_or_foia_submitted), "Phase 57B must record no agency contact or FOIA submission.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 57B must record no directive-scope, implementation, or closure change.");
check(ledger.records.every((item) => !item.directive_scope_change && !item.implementation_change && !item.closure_change), "Phase 57B records must preserve directive scope, implementation, and closure.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57a.post_batch_visible_scope), "Phase 57B must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57B must preserve the 1 / 21 / 2 entity evidence ledger.");
check(ledger.new_official_source_profiles === 11 && ledger.carried_official_source_profiles === 5, "Phase 57B source counts are incorrect.");
check(sourceFiles.length === 11 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 57B must add eleven current Tier 1 sources.");
check(documents.length === 17 && documents.filter((item) => item.record_status === "Published").length === 10 && documents.filter((item) => item.record_status === "In Review").length === 7, "Phase 57B document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57B document must be an official-link record.");
check(signalFiles.length === 17, "Phase 57B must generate seventeen signals.");
check(collection.document_ids.length === 17 && review.promoted_document_ids.length === 10 && review.promoted_signal_ids.length === 10 && review.held_document_ids.length === 7 && review.held_signal_ids.length === 7, "Phase 57B collection or publication-review counts are incorrect.");

check(record("AMTRAK-ADA-SUBSTANTIAL-2026-01")?.denominator.includes("Camden") && record("AMTRAK-ADA-SUBSTANTIAL-2026-01")?.denominator.includes("Rugby"), "The Amtrak passenger-use panel must preserve all eleven named stations.");
check(record("AMTRAK-ADA-MATCHED-2026-01")?.denominator.includes("three named stations") && record("AMTRAK-ADA-MATCHED-2026-01")?.evidence_limits.some((item) => item.includes("deterministic list intersection")), "The three-station match must remain an explicit deterministic reconciliation.");
check(record("AMTRAK-PIDS-CLOSEOUT-HOLD-2026-01")?.record_status === "In Review", "The Amtrak PIDS closeout must remain In Review.");
check(record("LA-BEAD-NEXTLINK-SERVICE-2026-01")?.denominator.includes("104 BEAD locations"), "The Louisiana live-service panel must retain its 104-location denominator.");
check(record("LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-01")?.finding.includes("subscriber") && record("LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-01")?.record_status === "In Review", "The Louisiana validation hold must preserve the missing subscriber evidence.");
check(ledger.reopened_holds.length === 1 && ledger.reopened_holds[0].result.includes("broader nearly 5,000-location authorization cohort remains open"), "The Louisiana authorization hold may be reopened only for the 104-location cohort.");
check(record("MT-BEAD-QUARTERLY-HOLD-2026-01")?.evidence_limits.some((item) => item.includes("instructions are not")), "Montana reporting instructions must remain separate from results.");
check(record("HANFORD-WATER-SERVICE-2026-01")?.evidence_limits.some((item) => item.includes("capability")), "Hanford water capability must remain separate from observed throughput.");
check(record("HANFORD-ECOLOGY-WTP-2026-01")?.denominator.includes("50,000 gallons") && record("HANFORD-ECOLOGY-WTP-2026-01")?.denominator.includes("34 containers"), "The Ecology snapshot must retain both reported units.");
check(record("HANFORD-IDF-SHIPMENTS-2026-01")?.evidence_limits.some((item) => item.includes("not proof") && item.includes("accepted")), "The 66-container shipment record must remain separate from acceptance.");
check(record("HANFORD-GROUNDWATER-FY2024-01")?.evidence_limits.some((item) => item.includes("not annual contaminant mass")), "Groundwater volume must remain separate from contaminant mass.");
check(record("NNSA-PIT-RATE-HOLD-2026-01")?.record_status === "In Review" && record("NNSA-PIT-RATE-HOLD-2026-01")?.evidence_limits.some((item) => item.includes("objective")), "The NNSA production objective must remain separate from actual output.");
check(record("NNSA-PIT-PEIS-HOLD-2026-01")?.evidence_limits.some((item) => item.includes("Analyzed capacity is not")), "PEIS analytical scenarios must remain separate from output.");
check(record("NNSA-PIT-GAO-BASELINE-HOLD-2026-02")?.record_status === "In Review" && record("NNSA-PIT-GAO-BASELINE-HOLD-2026-02")?.finding.includes("lifecycle cost estimate"), "The April 2026 GAO baseline record must remain an explicit hold.");
check(ledger.preserved_holds.includes("MT-BEAD-TEST-HOLD-01") && ledger.preserved_holds.includes("NNSA-PIT-BASELINE-HOLD-01"), "The Montana and NNSA Phase 57A holds must remain preserved.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-032-accepted-service-independent-outcome-validation"), `${file} must link Research Watch 032.`);
  check(pathway.research_collection_ids.includes("research-collection-accepted-service-independent-outcome-validation-2026"), `${file} must link the Phase 57B collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57B accepted-service and independent-outcome validation panels"), `${file} must include the Phase 57B dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57b-accepted-service-independent-outcomes"), "Dependency map must include the Phase 57B node.");
check(map.links.filter((link) => link.from === "node-phase57b-accepted-service-independent-outcomes").length === 3, "Dependency map must include three Phase 57B links.");
await access(join(appRoot, "public", "downloads", "accepted-service-independent-outcome-validation-2026.zip"));

if (failures.length) {
  console.error("Phase 57B assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57B assertions passed: 10 Published, 7 In Review, 11 new Tier 1 sources, explicit accepted-service and independent-outcome contracts, 0 exact targets, and unchanged scope and closure ledgers.");
