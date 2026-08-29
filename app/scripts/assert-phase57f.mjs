import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57f-measured-reliability-observed-adoption-full-output-reconciliation.json"));
const review = await readJson(join(dataRoot, "phase-57f-publication-review.json"));
const phase57e = await readJson(join(dataRoot, "phase-57e-asset-reliability-cohort-adoption-accepted-output-closure.json"));
const collection = await readJson(join(contentRoot, "research-collections", "measured-reliability-observed-adoption-full-output-reconciliation-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57f-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57f-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-57f-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const record = (key) => ledger.records.find((item) => item.action_key === key);

check(ledger.phase === "57F", "Phase 57F ledger has the wrong phase.");
check(ledger.records.length === 25 && new Set(ledger.records.map((item) => item.record_id)).size === 25, "Phase 57F must contain twenty-five unique records.");
check(ledger.records_published === 16 && ledger.records_held === 9, "Phase 57F must publish sixteen records and hold nine.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({
  "Measured reliability denominator reconciliation": 4,
  "Measured reliability outcome hold": 2,
  "Observed adoption measurement contract": 4,
  "Observed adoption outcome hold": 3,
  "Full output reconciliation": 4,
  "Full output reconciliation hold": 1,
  "Qualified output reconciliation": 4,
  "Qualified output outcome hold": 3,
}), "Phase 57F evidence-stage counts are incorrect.");
check(ledger.records.every((item) => item.denominator && item.evidence_limits.length >= 3 && item.next_action && item.authority_boundary), "Every Phase 57F record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57F must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((item) => !item.contact_or_foia_submitted), "Phase 57F must record no agency contact or FOIA submission.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0 && ledger.inherited_entity_ledger_closure_changes.length === 0, "Phase 57F must preserve directive and closure state.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57e.post_batch_visible_scope), "Phase 57F must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57F must preserve the 1 / 21 / 2 entity evidence ledger.");
check(ledger.new_official_source_profiles === 7 && ledger.carried_official_source_profiles === 17, "Phase 57F source counts are incorrect.");
check(sourceFiles.length === 7 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-03"), "Phase 57F must add seven current Tier 1 sources.");
check(documents.length === 25 && documents.filter((item) => item.record_status === "Published").length === 16 && documents.filter((item) => item.record_status === "In Review").length === 9, "Phase 57F document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57F document must be an official-link record.");
check(signalFiles.length === 25, "Phase 57F must generate twenty-five signals.");
check(collection.document_ids.length === 25 && review.promoted_document_ids.length === 16 && review.promoted_signal_ids.length === 16 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57F collection or publication-review counts are incorrect.");

check(record("AMTRAK-PIDS-HISTORICAL-COHORT-2026-01")?.finding.includes("120") && record("AMTRAK-PIDS-HISTORICAL-COHORT-2026-01")?.finding.includes("96") && record("AMTRAK-PIDS-HISTORICAL-COHORT-2026-01")?.finding.includes("93") && record("AMTRAK-PIDS-HISTORICAL-COHORT-2026-01")?.finding.includes("117"), "The Amtrak lineage reconciliation must preserve all four counts.");
check(record("MT-BEAD-LEO-TEN-YEAR-REPORTING-2026-01")?.finding.includes("ten years") && record("MT-BEAD-LEO-SUBSCRIBER-COUNT-CONTRACT-2026-01")?.finding.includes("active subscribers") && record("MT-BEAD-LEO-CPE-SHIPMENT-CONTRACT-2026-01")?.finding.includes("customer premises equipment"), "Montana's adoption-measurement contract must preserve its exact fields.");
check(record("HANFORD-WTP-19-CONTAINER-SHIPMENT-2026-01")?.finding.includes("19") && record("HANFORD-WTP-CONTAINER-PROGRESSION-2026-01")?.finding.includes("34") && record("HANFORD-WTP-CONTAINER-PROGRESSION-2026-01")?.finding.includes("66") && record("HANFORD-WTP-100K-IMMOBILIZED-2026-01")?.finding.includes("100,000"), "Hanford's stage ledger must retain its exact bounded observations.");
check(record("HANFORD-WTP-CONTAINER-SPECIFICATION-2026-01")?.evidence_limits.some((item) => item.includes("cannot be multiplied")), "The Hanford container specification must prohibit synthetic output mass.");
check(record("NNSA-PIT-CURRENT-RD-CAPABILITY-2026-01")?.finding.includes("unsuitable for stockpile use") && record("NNSA-PIT-FPU-CAPABILITY-CROSSWALK-2026-01")?.finding.includes("diamond-stamped"), "The NNSA state reconciliation must preserve both official assertions.");
check(record("NNSA-PIT-GAO-23-STATUS-2026-01")?.finding.includes("Open") && record("NNSA-PIT-GAO-23-STATUS-2026-01")?.finding.includes("December 2026"), "The exact GAO-23 status and forecast must remain bounded.");

const phase57eHolds = phase57e.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
const inheritedParents = ledger.records.filter((item) => item.parent_hold_key).map((item) => item.parent_hold_key).sort();
check(JSON.stringify([...ledger.preserved_phase57e_holds].sort()) === JSON.stringify(phase57eHolds) && JSON.stringify(inheritedParents) === JSON.stringify(phase57eHolds) && phase57eHolds.length === 9, "All nine Phase 57E holds must remain explicitly preserved exactly once.");
check(ledger.new_visible_holds.length === 0, "Phase 57F must add no new visible hold.");
check(record("AMTRAK-PIDS-CLOSEOUT-HOLD-2026-05")?.record_status === "In Review" && record("AMTRAK-NAMED-RELIABILITY-HOLD-2026-04")?.record_status === "In Review", "Both Amtrak outcome holds must remain In Review.");
check(record("LA-BEAD-NEXTLINK-VALIDATION-HOLD-2026-05")?.record_status === "In Review" && record("LA-BEAD-STARLINK-HOLD-2026-05")?.record_status === "In Review" && record("MT-BEAD-QUARTERLY-HOLD-2026-05")?.record_status === "In Review", "All three broadband outcome holds must remain In Review.");
check(record("HANFORD-WTP-MASS-BALANCE-HOLD-2026-02")?.record_status === "In Review", "The Hanford mass-balance hold must remain In Review.");
check(record("NNSA-PIT-RATE-HOLD-2026-05")?.record_status === "In Review" && record("NNSA-PIT-PEIS-HOLD-2026-05")?.record_status === "In Review" && record("NNSA-PIT-GAO-BASELINE-HOLD-2026-06")?.record_status === "In Review", "All three NNSA outcome holds must remain In Review.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-036-measured-reliability-observed-adoption-full-output-reconciliation"), `${file} must link Research Watch 036.`);
  check(pathway.research_collection_ids.includes("research-collection-measured-reliability-observed-adoption-full-output-reconciliation-2026"), `${file} must link the Phase 57F collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57F measured reliability, observed adoption, and full output reconciliation panels"), `${file} must include the Phase 57F dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57f-measured-adoption-output"), "Dependency map must include the Phase 57F node.");
check(map.links.filter((link) => link.from === "node-phase57f-measured-adoption-output").length === 3, "Dependency map must include three Phase 57F links.");
await access(join(appRoot, "public", "downloads", "measured-reliability-observed-adoption-full-output-reconciliation-2026.zip"));

if (failures.length) {
  console.error("Phase 57F assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57F assertions passed: 16 Published, 9 In Review, 7 new Tier 1 sources, all 9 Phase 57E holds preserved, no new hold, and unchanged scope and closure ledgers.");
