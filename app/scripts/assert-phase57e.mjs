import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-57e-asset-reliability-cohort-adoption-accepted-output-closure.json"));
const review = await readJson(join(dataRoot, "phase-57e-publication-review.json"));
const phase57d = await readJson(join(dataRoot, "phase-57d-persistent-service-quality-compatible-time-series-replication.json"));
const collection = await readJson(join(contentRoot, "research-collections", "asset-reliability-cohort-adoption-accepted-output-closure-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => name.includes("-57e-") && name.endsWith(".json"));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-57e-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-57e-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const record = (key) => ledger.records.find((item) => item.action_key === key);

check(ledger.phase === "57E", "Phase 57E ledger has the wrong phase.");
check(ledger.records.length === 24 && new Set(ledger.records.map((item) => item.record_id)).size === 24, "Phase 57E must contain twenty-four unique records.");
check(ledger.records_published === 15 && ledger.records_held === 9, "Phase 57E must publish fifteen records and hold nine.");
check(JSON.stringify(ledger.evidence_stage_counts) === JSON.stringify({
  "Asset-quality reconciliation": 3,
  "Asset reliability hold": 2,
  "Adoption and retention acceptance control": 4,
  "Adoption and retention result hold": 3,
  "Accepted-output closure": 4,
  "Accepted-output mass-balance hold": 1,
  "Independent program-governance closure": 4,
  "Recurring output and baseline hold": 3,
}), "Phase 57E evidence-stage counts are incorrect.");
check(ledger.records.every((item) => item.denominator && item.evidence_limits.length >= 3 && item.next_action && item.authority_boundary), "Every Phase 57E record needs a denominator and full boundary contract.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.exact_target_trigger_events === 0, "Phase 57E must record zero exact-target acquisitions and triggers.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((item) => !item.contact_or_foia_submitted), "Phase 57E must record no agency contact or FOIA submission.");
check(ledger.directive_scope_changes.length === 0 && ledger.records.every((item) => !item.directive_scope_change), "Phase 57E must preserve directive scope.");
check(ledger.implementation_changes.length === 4 && ledger.closure_changes.length === 4 && ledger.independent_recommendation_closures === 4, "Phase 57E must record four independent GAO implementation and closure changes.");
check(ledger.inherited_entity_ledger_closure_changes.length === 0, "Independent GAO closures must not alter the inherited entity ledger.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase57d.post_batch_visible_scope), "Phase 57E must preserve visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 57E must preserve the 1 / 21 / 2 entity evidence ledger.");
check(ledger.new_official_source_profiles === 7 && ledger.carried_official_source_profiles === 14, "Phase 57E source counts are incorrect.");
check(sourceFiles.length === 7 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-03"), "Phase 57E must add seven current Tier 1 sources.");
check(documents.length === 24 && documents.filter((item) => item.record_status === "Published").length === 15 && documents.filter((item) => item.record_status === "In Review").length === 9, "Phase 57E document counts or statuses are incorrect.");
check(documents.every((item) => item.capture_status === "Official link record"), "Every Phase 57E document must be an official-link record.");
check(signalFiles.length === 24, "Phase 57E must generate twenty-four signals.");
check(collection.document_ids.length === 24 && review.promoted_document_ids.length === 15 && review.promoted_signal_ids.length === 15 && review.held_document_ids.length === 9 && review.held_signal_ids.length === 9, "Phase 57E collection or publication-review counts are incorrect.");

check(record("AMTRAK-PIDS-CROSS-REPORT-RECONCILIATION-2026-01")?.finding.includes("93") && record("AMTRAK-PIDS-CROSS-REPORT-RECONCILIATION-2026-01")?.finding.includes("117"), "The Amtrak reconciliation must retain the incompatible PIDS counts.");
check(record("AMTRAK-DIGITAL-ACCESSIBILITY-REMEDIATION-2026-01")?.finding.includes("mobile-app landscape requirement"), "The Amtrak digital remediation record must retain its named exception.");
check(record("MT-BEAD-SPEED-ACCEPTANCE-CONTROL-2026-01")?.finding.includes("80 percent") && record("MT-BEAD-LATENCY-ACCEPTANCE-CONTROL-2026-01")?.finding.includes("100 milliseconds"), "Montana speed and latency controls must retain their exact thresholds.");
check(record("MT-BEAD-AVAILABILITY-ACCEPTANCE-CONTROL-2026-01")?.finding.includes("48 hours") && record("MT-BEAD-ACTIVE-SUBSCRIBER-TEST-CONTROL-2026-01")?.denominator.includes("active-subscriber"), "Montana availability and subscriber-test controls must retain their exact acceptance boundaries.");
check(record("HANFORD-WTP-ACCEPTABLE-GLASS-MILESTONE-2026-01")?.finding.includes("acceptable quality") && record("HANFORD-WTP-CONTAINER-STAGE-CROSSWALK-2026-01")?.finding.includes("34") && record("HANFORD-WTP-CONTAINER-STAGE-CROSSWALK-2026-01")?.finding.includes("66") && record("HANFORD-WTP-CONTAINER-STAGE-CROSSWALK-2026-01")?.finding.includes("30"), "Hanford accepted-glass and container-stage records must retain their exact observations.");
check(record("HANFORD-WTP-MASS-BALANCE-HOLD-2026-01")?.record_status === "In Review" && record("HANFORD-WTP-MASS-BALANCE-HOLD-2026-01")?.denominator.includes("complete DFLAW monthly material balance"), "The new Hanford mass-balance hold must remain explicit.");

const gaoClosures = ledger.records.filter((item) => item.evidence_stage === "Independent program-governance closure");
check(gaoClosures.length === 4 && gaoClosures.every((item) => item.record_status === "Published" && item.implementation_change && item.closure_change && item.finding.includes("Closed-Implemented")), "All four GAO governance recommendations must be independently closed and Published.");
check(record("NNSA-PIT-GAO-BASELINE-HOLD-2026-05")?.record_status === "In Review" && record("NNSA-PIT-GAO-BASELINE-HOLD-2026-05")?.finding.includes("GAO-23-104661"), "The separate plutonium enterprise-baseline hold must remain In Review.");

const phase57dHolds = phase57d.records.filter((item) => item.record_status === "In Review").map((item) => item.action_key).sort();
const inheritedParents = ledger.records.filter((item) => item.parent_hold_key).map((item) => item.parent_hold_key).sort();
check(JSON.stringify([...ledger.preserved_phase57d_holds].sort()) === JSON.stringify(phase57dHolds) && JSON.stringify(inheritedParents) === JSON.stringify(phase57dHolds) && phase57dHolds.length === 8, "All eight Phase 57D holds must remain explicitly preserved exactly once.");
check(ledger.new_visible_holds.length === 1 && ledger.new_visible_holds[0] === "HANFORD-WTP-MASS-BALANCE-HOLD-2026-01", "Phase 57E must add exactly one visible hold.");

for (const file of ["policy-standards-to-implementation.json", "cross-corridor-authorization-to-operation.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-035-asset-reliability-cohort-adoption-accepted-output-closure"), `${file} must link Research Watch 035.`);
  check(pathway.research_collection_ids.includes("research-collection-asset-reliability-cohort-adoption-accepted-output-closure-2026"), `${file} must link the Phase 57E collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 57E asset reliability, cohort adoption, and accepted-output closure panels"), `${file} must include the Phase 57E dependency stage.`);
}

const map = await readJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"));
check(map.nodes.some((node) => node.id === "node-phase57e-asset-adoption-accepted-output"), "Dependency map must include the Phase 57E node.");
check(map.links.filter((link) => link.from === "node-phase57e-asset-adoption-accepted-output").length === 3, "Dependency map must include three Phase 57E links.");
await access(join(appRoot, "public", "downloads", "asset-reliability-cohort-adoption-accepted-output-closure-2026.zip"));

if (failures.length) {
  console.error("Phase 57E assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 57E assertions passed: 15 Published, 9 In Review, 7 new Tier 1 sources, all 8 Phase 57D holds preserved, 1 new mass-balance hold, 4 independent GAO closures, and unchanged entity scope and closure ledgers.");
