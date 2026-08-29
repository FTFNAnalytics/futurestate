import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-56u-custodian-exact-artifact-recovery-batch-one.json"));
const review = await readJson(join(dataRoot, "phase-56u-publication-review.json"));
const phase56t = await readJson(join(dataRoot, "phase-56t-official-response-acquisition-artifact-sufficiency-queue.json"));
const collection = await readJson(join(contentRoot, "research-collections", "gao-custodian-exact-artifact-recovery-batch-one-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^53[3-9]-56u-|^540-56u-/.test(name));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56u-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56u-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));

const ticketKeys = ["DOE-01", "DOE-02", "DOE-05", "HHS-04-R1", "HHS-04-R2", "DOT-05", "VA-04", "VA-05"];
check(ledger.phase === "56U", "Phase 56U ledger has the wrong phase.");
check(ledger.records.length === 8 && new Set(ledger.records.map((record) => record.action_key)).size === 8, "Phase 56U must contain eight unique recovery records.");
check(ticketKeys.every((key) => ledger.records.some((record) => record.action_key === key)), "Phase 56U must cover the exact eight Phase 56T acquisition tickets.");
check(ledger.records.every((record) => record.phase_56t_record_id && record.target_artifact && record.likely_custodian), "Every Phase 56U record must retain its Phase 56T ticket, target, and custodian.");
check(ledger.records.every((record) => record.search_surfaces.length >= 6 && record.exact_title_and_custodian_queries.length >= 6), "Every Phase 56U record must name at least six public surfaces and six exact-title or custodian queries.");
check(ledger.records.every((record) => record.current_official_near_matches.length >= 1 && record.current_official_near_matches.every((item) => item.source_id && item.locator && item.relation && item.why_not_exact)), "Every Phase 56U record must include a bounded official near-match with a locator and rejection reason.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.records.every((record) => record.exact_target_artifact_acquired === false), "Phase 56U must record zero acquired exact target artifacts.");
check(ledger.near_matches_reviewed === 10, "Phase 56U must record exactly ten reviewed official near-matches.");
check(ledger.result_class_counts["Recommendation-specific agency status located; exact target artifact not acquired"] === 3, "Phase 56U must contain three recommendation-specific agency-status results.");
check(ledger.result_class_counts["Current official near-match reviewed; exact target artifact not acquired"] === 5, "Phase 56U must contain five current official near-match results.");
check(JSON.stringify(ledger.agency_status_conflicts) === JSON.stringify(["DOE-05"]), "Phase 56U must preserve DOE-05 as the one agency-GAO status conflict.");
check(ledger.records.every((record) => record.stop_rule && record.reopening_trigger && record.next_action && record.authority_boundary), "Every Phase 56U record must include a stop rule, reopening trigger, next action, and authority boundary.");
check(ledger.records.every((record) => record.contact_or_foia_submitted === false), "Phase 56U must not represent any search as an agency contact or submitted FOIA request.");
check(ledger.records.every((record) => record.directive_scope_change === false && record.implementation_change === false && record.closure_change === false), "Phase 56U must preserve directive scope, implementation, and closure.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 56U aggregate change lists must remain empty.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase56t.scope_element_counts), "Phase 56U must preserve the Phase 56T visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56U must preserve the 1 / 21 / 2 entity evidence ledger.");
check(sourceFiles.length === 7 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56U must add seven current Tier 1 official sources.");
check(sources.filter((source) => source.live_access_type === "Data Download").length === 4 && sources.filter((source) => source.live_access_type !== "Data Download").length === 3, "Phase 56U source access types must contain four downloads and three manual surfaces.");
check(review.new_source_profiles === 7 && review.exact_target_artifacts_acquired === 0 && review.near_matches_reviewed === 10, "Phase 56U publication review counts are incorrect.");
check(review.document_decisions.promoted.length === 8 && review.document_decisions.held.length === 0, "Phase 56U must promote eight recovery documents with no holds.");
check(review.signal_decisions.promoted.length === 8 && review.signal_decisions.held.length === 0, "Phase 56U must promote eight recovery signals with no holds.");
check(collection.document_ids.length === 8, "Phase 56U collection must reference eight documents.");
check(documents.length === 8 && documents.every((document) => document.record_status === "Published" && document.capture_status === "Official link record"), "Phase 56U must generate eight Published official-link documents.");
check(signalFiles.length === 8, "Phase 56U must generate eight Published signals.");
check(documents.every((document) => document.evidence_limits.some((item) => item.includes("does not mean")) && document.evidence_limits.some((item) => item.includes("GAO"))), "Every Phase 56U document must preserve nonexistence and GAO-authority boundaries.");

for (const { file, key, expectedEntities, expectedRecords } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expectedEntities: 3, expectedRecords: 6 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expectedEntities: 3, expectedRecords: 6 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expectedEntities: 3, expectedRecords: 6 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56u_exact_artifact_recovery_ledger === "phase-56u-custodian-exact-artifact-recovery-batch-one.json", `${file} does not name the Phase 56U ledger.`);
  check(entityLedger[key].filter((record) => record.phase_56u_coverage_decision).length === expectedEntities, `${file} must integrate ${expectedEntities} Phase 56U agency decision(s).`);
  check(entityLedger[key].reduce((sum, record) => sum + (record.phase_56u_exact_artifact_recovery?.length ?? 0), 0) === expectedRecords, `${file} must integrate ${expectedRecords} Phase 56U ticket records.`);
  check(entityLedger[key].filter((record) => record.phase_56u_coverage_decision).every((record) => record.phase_56u_coverage_decision.prior_closure_status === record.phase_56u_coverage_decision.current_closure_status), `${file} must preserve every prior entity closure status.`);
}

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-025-exact-artifact-recovery-batch-one"), `${file} must link Research Watch 025.`);
  check(pathway.research_collection_ids.includes("research-collection-gao-custodian-exact-artifact-recovery-batch-one-2026"), `${file} must link the Phase 56U collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56U exact-artifact recovery batch one"), `${file} must include the Phase 56U dependency stage.`);
}

await access(join(appRoot, "public", "downloads", "gao-custodian-exact-artifact-recovery-batch-one-2026.zip"));

if (failures.length) {
  console.error("Phase 56U assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56U assertions passed: 8 custodian-level searches, 10 official near-matches, 7 new sources, 0 exact target artifacts, 1 agency-GAO status conflict, no FOIA/contact claim, zero scope/implementation/closure changes, and an unchanged 1 / 21 / 2 entity evidence ledger.");
