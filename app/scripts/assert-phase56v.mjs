import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const dataRoot = join(appRoot, "src", "data");
const contentRoot = join(appRoot, "src", "content");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const ledger = await readJson(join(dataRoot, "phase-56v-second-order-recovery-leads-supporting-artifacts.json"));
const review = await readJson(join(dataRoot, "phase-56v-publication-review.json"));
const phase56u = await readJson(join(dataRoot, "phase-56u-custodian-exact-artifact-recovery-batch-one.json"));
const collection = await readJson(join(contentRoot, "research-collections", "gao-second-order-recovery-leads-supporting-artifacts-2026.json"));
const documentFiles = (await readdir(join(contentRoot, "research-documents"))).filter((name) => /^(54[1-9]|550)-56v-/.test(name));
const documents = await Promise.all(documentFiles.map((name) => readJson(join(contentRoot, "research-documents", name))));
const signalFiles = (await readdir(join(contentRoot, "signals"))).filter((name) => name.startsWith("signal-56v-") && name.endsWith(".mdx"));
const sourceFiles = (await readdir(join(contentRoot, "sources"))).filter((name) => name.startsWith("source-56v-") && name.endsWith(".json"));
const sources = await Promise.all(sourceFiles.map((name) => readJson(join(contentRoot, "sources", name))));

const ticketKeys = ["DOE-01", "DOE-02", "DOE-05", "HHS-04-R1", "HHS-04-R2", "DOT-05", "VA-04", "VA-05"];
const parentPairs = phase56u.records.flatMap((record) => record.current_official_near_matches.map((item) => `${record.action_key}|${item.source_id}|${item.locator}`));
const childPairs = ledger.records.map((record) => `${record.action_key}|${record.phase_56u_near_match.source_id}|${record.phase_56u_near_match.locator}`);
check(ledger.phase === "56V", "Phase 56V ledger has the wrong phase.");
check(ledger.records.length === 10 && new Set(ledger.records.map((record) => record.lead_id)).size === 10, "Phase 56V must contain ten unique lead chains.");
check(new Set(ledger.records.map((record) => record.action_key)).size === 8 && ticketKeys.every((key) => ledger.records.some((record) => record.action_key === key)), "Phase 56V must preserve all eight ticket identities.");
check(parentPairs.length === 10 && childPairs.length === 10 && parentPairs.every((pair) => childPairs.includes(pair)) && new Set(childPairs).size === 10, "Phase 56V must decompose every Phase 56U near-match exactly once.");
check(ledger.records.every((record) => record.phase_56u_record_id && record.phase_56u_near_match && record.lead_type && record.material_narrowing), "Every Phase 56V record must retain its parent and name a lead type and material narrowing.");
check(ledger.records.every((record) => record.decomposition_path.length >= 1 && record.decomposition_path.every((item) => item.source_id && item.locator && item.artifact_function && item.why_not_target)), "Every Phase 56V record must contain a complete decomposition path.");
check(ledger.records.every((record) => record.directive_element_tests.length === 3 && record.directive_element_tests.every((item) => item.phase_56v_decision === "Not established by located public record")), "Every Phase 56V record must test all three directive elements without inference.");
check(ledger.parent_near_matches_decomposed === 10 && ledger.lead_chain_count === 10 && ledger.material_downstream_locators_added === 10, "Phase 56V aggregate lead counts are incorrect.");
check(ledger.new_official_source_profiles === 12 && ledger.official_supporting_artifacts_profiled === 12, "Phase 56V must profile twelve official supporting artifacts.");
check(ledger.recommendation_specific_supporting_artifacts_located === 1 && ledger.records.filter((record) => record.recommendation_specific_supporting_artifact_located).map((record) => record.action_key).join() === "VA-05", "Phase 56V must identify exactly one recommendation-specific supporting artifact for VA-05.");
check(ledger.exact_target_artifacts_acquired === 0 && ledger.records.every((record) => record.exact_target_artifact_acquired === false), "Phase 56V must record zero acquired exact target artifacts.");
check(JSON.stringify(ledger.agency_status_conflicts) === JSON.stringify(["DOE-05"]), "Phase 56V must preserve DOE-05 as the agency-GAO status conflict.");
check(ledger.records.every((record) => record.stop_rule && record.reopening_trigger && record.next_action && record.authority_boundary), "Every Phase 56V record must include its stop rule, reopening trigger, next action, and authority boundary.");
check(ledger.records.every((record) => record.contact_or_foia_submitted === false), "Phase 56V must not represent source decomposition as an agency contact or FOIA request.");
check(ledger.records.every((record) => record.directive_scope_change === false && record.implementation_change === false && record.closure_change === false), "Phase 56V must preserve directive scope, implementation, and closure.");
check(ledger.directive_scope_changes.length === 0 && ledger.implementation_changes.length === 0 && ledger.closure_changes.length === 0, "Phase 56V aggregate change lists must remain empty.");
check(JSON.stringify(ledger.prior_visible_scope) === JSON.stringify(ledger.post_batch_visible_scope) && JSON.stringify(ledger.post_batch_visible_scope) === JSON.stringify(phase56u.post_batch_visible_scope), "Phase 56V must preserve the Phase 56U visible-scope counts.");
check(ledger.post_batch_closure_counts.closed === 1 && ledger.post_batch_closure_counts.partially_closed === 21 && ledger.post_batch_closure_counts.open === 2, "Phase 56V must preserve the 1 / 21 / 2 entity evidence ledger.");
check(sourceFiles.length === 12 && sources.every((source) => source.credibility_level === "Tier 1" && source.monitoring_status === "Active" && source.last_checked_date === "2026-08-02"), "Phase 56V must add twelve current Tier 1 official sources.");
check(sources.filter((source) => source.live_access_type === "Data Download").length === 8 && sources.filter((source) => source.live_access_type !== "Data Download").length === 4, "Phase 56V source access types must contain eight downloads and four manual surfaces.");
check(review.new_source_profiles === 12 && review.parent_near_matches_decomposed === 10 && review.exact_target_artifacts_acquired === 0, "Phase 56V publication review counts are incorrect.");
check(review.document_decisions.promoted.length === 10 && review.document_decisions.held.length === 0, "Phase 56V must promote ten lead documents with no holds.");
check(review.signal_decisions.promoted.length === 10 && review.signal_decisions.held.length === 0, "Phase 56V must promote ten lead signals with no holds.");
check(collection.document_ids.length === 10, "Phase 56V collection must reference ten documents.");
check(documents.length === 10 && documents.every((document) => document.record_status === "Published" && document.capture_status === "Official link record"), "Phase 56V must generate ten Published official-link documents.");
check(signalFiles.length === 10, "Phase 56V must generate ten Published signals.");
check(documents.every((document) => document.evidence_limits.some((item) => item.includes("does not mean")) && document.evidence_limits.some((item) => item.includes("GAO"))), "Every Phase 56V document must preserve nonexistence and GAO-authority boundaries.");

for (const { file, key, expectedEntities, expectedRecords } of [
  { file: "phase-56b-entity-panels.json", key: "panels", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56c-entity-dossiers.json", key: "dossiers", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56d-alternative-tests.json", key: "tests", expectedEntities: 1, expectedRecords: 2 },
  { file: "phase-56e-second-cohort-panels.json", key: "panels", expectedEntities: 3, expectedRecords: 8 },
  { file: "phase-56e-second-cohort-dossiers.json", key: "dossiers", expectedEntities: 3, expectedRecords: 8 },
  { file: "phase-56e-second-cohort-tests.json", key: "tests", expectedEntities: 3, expectedRecords: 8 },
]) {
  const entityLedger = await readJson(join(dataRoot, file));
  check(entityLedger.phase_56v_supporting_artifact_decomposition_ledger === "phase-56v-second-order-recovery-leads-supporting-artifacts.json", `${file} does not name the Phase 56V ledger.`);
  check(entityLedger[key].filter((record) => record.phase_56v_coverage_decision).length === expectedEntities, `${file} must integrate ${expectedEntities} Phase 56V agency decision(s).`);
  check(entityLedger[key].reduce((sum, record) => sum + (record.phase_56v_supporting_artifact_decomposition?.length ?? 0), 0) === expectedRecords, `${file} must integrate ${expectedRecords} Phase 56V lead records.`);
  check(entityLedger[key].filter((record) => record.phase_56v_coverage_decision).every((record) => record.phase_56v_coverage_decision.prior_closure_status === record.phase_56v_coverage_decision.current_closure_status), `${file} must preserve every prior entity closure status.`);
}

for (const file of ["policy-standards-to-implementation.json", "autonomy-regulation-to-service.json", "energy-grid-capacity-to-service.json"]) {
  const pathway = await readJson(join(contentRoot, "reader-pathways", file));
  check(pathway.briefing_ids.includes("briefing-research-watch-026-second-order-recovery-leads"), `${file} must link Research Watch 026.`);
  check(pathway.research_collection_ids.includes("research-collection-gao-second-order-recovery-leads-supporting-artifacts-2026"), `${file} must link the Phase 56V collection.`);
  check(pathway.dependency_stack.some((item) => item.stage === "Phase 56V second-order recovery leads"), `${file} must include the Phase 56V dependency stage.`);
}

await access(join(appRoot, "public", "downloads", "gao-second-order-recovery-leads-supporting-artifacts-2026.zip"));

if (failures.length) {
  console.error("Phase 56V assertions failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Phase 56V assertions passed: 10 near-matches decomposed, 12 official supporting sources, 1 recommendation-specific supporting artifact, 0 exact targets, no scope/implementation/closure changes, and an unchanged 1 / 21 / 2 entity evidence ledger.");
