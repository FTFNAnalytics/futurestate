import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-56w-named-record-retrieval-cross-lane-expansion.json"));
const review = await readJson(join(dataRoot, "phase-56w-publication-review.json"));
const phase56v = await readJson(join(dataRoot, "phase-56v-second-order-recovery-leads-supporting-artifacts.json"));
const collection = await readJson(join(contentRoot, "research-collections", "gao-named-record-retrieval-cross-lane-expansion-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^(55[1-9]|560)-56w-/.test(name));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56w-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56w-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));
const publishedRecords = ledger.records.filter((record) => record.record_status === "Published");
const heldRecords = ledger.records.filter((record) => record.record_status === "In Review");
const namedRecords = ledger.records.filter((record) => record.record_type === "Named target retrieval");
const crossLaneRecords = ledger.records.filter((record) => record.record_type === "Compatible cross-lane expansion");

check(ledger.phase === "56W", "Phase 56W ledger has the wrong phase.");
check(ledger.records.length === 10 && new Set(ledger.records.map((record) => record.record_id)).size === 10, "Phase 56W must contain ten unique records.");
check(namedRecords.length === 7 && crossLaneRecords.length === 3, "Phase 56W must contain seven named-target records and three cross-lane records.");
check(publishedRecords.length === 6 && heldRecords.length === 4, "Phase 56W must publish six records and hold four In Review.");
check(namedRecords.filter((record) => record.record_status === "Published").length === 3 && crossLaneRecords.every((record) => record.record_status === "Published"), "Phase 56W publication classification is incorrect.");
check(namedRecords.every((record) => record.parent_lead_id && record.parent_record_id), "Every named-target record must retain its Phase 56V parent lead and record.");
check(crossLaneRecords.every((record) => record.parent_lead_id === null && record.parent_record_id === null), "Cross-lane records must remain distinct from named-target parents.");
check(new Set(namedRecords.map((record) => record.parent_lead_id)).size === 7, "Each named-target record must use a distinct Phase 56V parent lead.");
check(namedRecords.every((record) => phase56v.records.some((parent) => parent.lead_id === record.parent_lead_id)), "Every Phase 56W parent lead must resolve to Phase 56V.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.records.every((record) => record.exact_target_artifact_acquired === false), "Phase 56W must record zero exact target artifacts.");
check(ledger.public_agency_contacts_or_foia_requests === 0 && ledger.records.every((record) => record.contact_or_foia_submitted === false), "Phase 56W must record no agency contact or FOIA submission.");
check(ledger.records.every((record) => record.directive_scope_change === false && record.implementation_change === false && record.closure_change === false), "Phase 56W must preserve directive scope, implementation, and closure.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 56W aggregate change lists must remain empty.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase56v.post_batch_visible_scope), "Phase 56W must preserve the visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56W must preserve the 1 / 21 / 2 entity evidence ledger.");
check(JSON.stringify(ledger.agency_status_conflicts) === JSON.stringify(["DOE-02", "DOE-05"]), "Phase 56W must preserve the DOE-02 and DOE-05 agency-GAO conflicts.");
check(ledger.records.every((record) => record.target_artifact && record.finding && record.material_narrowing && record.evidence_limits.length >= 3 && record.next_action && record.authority_boundary), "Every Phase 56W record must contain the full evidence contract.");

check(sourceFiles.length === 7 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56W must add seven current Tier 1 official sources.");
check(sources.filter((source) => source.live_access_type === "Data Download").length === 3 && sources.filter((source) => source.live_access_type === "Report Series").length === 4, "Phase 56W source access types must contain three downloads and four report-series surfaces.");
check(review.document_decisions.promoted.length === 6 && review.document_decisions.held.length === 4, "Phase 56W document publication decisions are incorrect.");
check(review.signal_decisions.promoted.length === 6 && review.signal_decisions.held.length === 0, "Phase 56W signal publication decisions are incorrect.");
check(collection.document_ids.length === 10, "Phase 56W collection must reference ten documents.");
check(documents.length === 10 && documents.filter((document) => document.record_status === "Published").length === 6 && documents.filter((document) => document.record_status === "In Review").length === 4, "Phase 56W must generate six Published and four In Review documents.");
check(documents.every((document) => document.capture_status === "Official link record"), "Every Phase 56W document must be an official-link record.");
check(signalFiles.length === 6, "Phase 56W must generate six Published signals.");
check(documents.every((document) => document.evidence_limits.some((item) => item.includes("does not mean")) && document.evidence_limits.some((item) => item.includes("FOIA")) && document.evidence_limits.some((item) => item.includes("GAO"))), "Every Phase 56W document must preserve nonexistence, no-contact, and GAO-authority boundaries.");

const requiredPublishedSlugs = [
  "va-jec-effectiveness-assessment-status",
  "nnsa-pit-production-project-cost-trail",
  "hanford-dfhlw-decision-and-progress-record",
  "infrastructure-funding-review-status",
  "hanford-low-activity-waste-grout-plan",
  "doe-em-aging-infrastructure-constraint",
];
check(requiredPublishedSlugs.every((slug) => publishedRecords.some((record) => record.record_id === `record-56w-${slug}`)), "Phase 56W is missing a required Published record.");
const requiredHeldSlugs = [
  "dot-unified-grants-award-deployment-record",
  "doe-waste-disposal-optimal-strategy-analysis",
  "hhs-cross-component-after-action-report",
  "hhs-external-stakeholder-after-action-report",
];
check(requiredHeldSlugs.every((slug) => heldRecords.some((record) => record.record_id === `record-56w-${slug}`)), "Phase 56W is missing a required In Review hold.");
check(ledger.records.find((record) => record.action_key === "DOE-01")?.finding.includes("5.879431 billion"), "NNSA project-cost narrowing must preserve the published cost boundary.");
check(ledger.records.find((record) => record.action_key === "VA-05")?.finding.includes("inventory, not the assessment"), "VA-05 must preserve the inventory-versus-effectiveness distinction.");
check(ledger.records.find((record) => record.action_key === "DOT-05")?.record_status === "In Review", "DOT-05 must remain In Review.");
check(ledger.records.filter((record) => record.action_key === "DOE-05").every((record) => record.closure_change === false), "Hanford decision and progress evidence must not change closure.");

for (const { file, key, expectedEntities, expectedRecords } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expectedEntities: 3, expectedRecords: 8 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expectedEntities: 3, expectedRecords: 8 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expectedEntities: 3, expectedRecords: 8 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56w_named_record_retrieval_ledger === "phase-56w-named-record-retrieval-cross-lane-expansion.json", `${file} does not name the Phase 56W ledger.`);
  check(entityLedger[key].filter((record) => record.phase_56w_coverage_decision).length === expectedEntities, `${file} must integrate ${expectedEntities} Phase 56W agency decision(s).`);
  check(entityLedger[key].reduce((sum, record) => sum + (record.phase_56w_named_record_retrieval?.length ?? 0), 0) === expectedRecords, `${file} must integrate ${expectedRecords} Phase 56W records.`);
  check(entityLedger[key].filter((record) => record.phase_56w_coverage_decision).every((record) => record.phase_56w_coverage_decision.prior_closure_status === record.phase_56w_coverage_decision.current_closure_status), `${file} must preserve every prior entity closure status.`);
}

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-027-named-record-retrieval"), `${file} must link Research Watch 027.`);
  check(pathway.research_collection_ids.includes("research-collection-gao-named-record-retrieval-cross-lane-expansion-2026"), `${file} must link the Phase 56W collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56W named-record retrieval"), `${file} must include the Phase 56W dependency stage.`);
}

await access(join(appRoot, "public", "downloads", "gao-named-record-retrieval-cross-lane-expansion-2026.zip"));

if (failures.length) {
  console.error("Phase 56W assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56W assertions passed: 10 records, 6 Published additions, 4 In Review holds, 7 Tier 1 sources, 0 exact targets, no scope/implementation/closure changes, and an unchanged 1 / 21 / 2 entity evidence ledger.");
