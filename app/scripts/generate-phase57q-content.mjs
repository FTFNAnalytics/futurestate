import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { countBy, runPhase57qHarness } from "./phase57q-release-lifecycle-harness.mjs";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const contentRoot = join(appRoot, "src", "content");
const dataRoot = join(appRoot, "src", "data");
const capturedDate = "2026-08-09";
const collectionSlug = "manual-release-authorization-publication-bundles-withdrawal-rollback-receipts-2026";
const collectionId = `research-collection-${collectionSlug}`;
const briefingSlug = "research-watch-047-manual-release-publication-bundles-rollback-receipts";
const briefingId = `briefing-${briefingSlug}`;
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = async (path, value) => writeFile(path, json(value), "utf8");
const yamlList = (name, items) => [name + ":", ...items.map((item) => "  - " + JSON.stringify(item))].join("\n");
const appendUnique = (items, additions) => [...new Set([...(items ?? []), ...additions])];
const passedCount = (rows) => rows.filter((row) => row.passed).length;

for (const name of ["research-documents", "signals", "research-collections", "briefings", "updates"]) {
  await mkdir(join(contentRoot, name), { recursive: true });
}

const phase57p = JSON.parse(await readFile(join(dataRoot, "phase-57p-append-only-dual-review-audit-chains-cross-role-adjudication-publication-review-receipts.json"), "utf8"));
const audit57p = JSON.parse(await readFile(join(dataRoot, "phase-57p-append-only-dual-review-audit-chains.json"), "utf8"));
if (phase57p.phase !== "57P" || phase57p.records.length !== 29 || audit57p.schemas.length !== 9) {
  throw new Error("Phase 57Q requires the complete Phase 57P record and audit-chain baseline.");
}
const harness = runPhase57qHarness(audit57p.schemas);
if (harness.checklistSchemas.length !== 9 || harness.bundleSchemas.length !== 9 || harness.lifecycleSchemas.length !== 9 || harness.releaseCases.length !== 126 || harness.bundleCases.length !== 126 || harness.lifecycleCases.length !== 144 || harness.allCases.length !== 396 || harness.failures.length) {
  throw new Error("Phase 57Q requires 396 passing release, bundle, withdrawal, and rollback cases across nine contracts.");
}

const authorityBoundary = "Agency assertions, independent oversight, FTFN controls, evidence-review identity, publication-review identity, escalation ownership, release identity, publication identity, withdrawal identity, rollback identity, acceptance, implementation, capability, closure, and operating outcomes remain separate evidence states.";
const agencyMeta = {
  DOT: { topics: ["Mobility", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-015", "gap-016"] },
  NTIA: { topics: ["Chips and Compute", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Human Systems"], gaps: ["gap-016"] },
  DOE: { topics: ["Energy", "Policy and Standards", "Finance and Risk"], layers: ["Enabling Infrastructure", "Resource Foundations"], gaps: ["gap-008", "gap-016"] },
};
const agencyByRail = { Amtrak: "DOT", Broadband: "NTIA", Hanford: "DOE", NNSA: "DOE" };
const labels = {
  "REOPEN-AMTRAK-PIDS": "Amtrak PIDS closeout",
  "REOPEN-AMTRAK-RELIABILITY": "Amtrak named-asset reliability",
  "REOPEN-LA-NEXTLINK-ADOPTION": "Louisiana Nextlink adoption",
  "REOPEN-LA-STARLINK-ADOPTION": "Louisiana Starlink adoption",
  "REOPEN-MT-BEAD-QUARTER": "Montana BEAD completed quarter",
  "REOPEN-HANFORD-MASS-BALANCE": "Hanford complete material balance",
  "REOPEN-NNSA-QUALIFIED-RATE": "NNSA recurring qualified rate",
  "REOPEN-NNSA-ACCEPTED-CAPACITY": "NNSA accepted operating capacity",
  "REOPEN-NNSA-GAO-BASELINE": "NNSA GAO enterprise baseline",
};
const held57p = phase57p.records.filter((record) => record.record_status === "In Review");
const holdByContract = new Map(held57p.map((record) => [record.reopening_contract_id, record]));
const sourcesForRail = (rail) => [...new Set(phase57p.records.filter((record) => {
  if (rail === "Amtrak") return record.agency === "DOT";
  if (rail === "Broadband") return record.agency === "NTIA";
  if (rail === "Hanford") return /^Hanford|HANFORD/.test(`${record.title} ${record.action_key}`);
  return /^NNSA/.test(`${record.title} ${record.action_key}`);
}).flatMap((record) => record.supporting_source_ids))];
const sourceIdsByRail = Object.fromEntries(["Amtrak", "Broadband", "Hanford", "NNSA"].map((rail) => [rail, sourcesForRail(rail)]));

await writeJson(join(dataRoot, "phase-57q-manual-release-authorization-checklists.json"), {
  phase: "57Q", captured_date: capturedDate, registry_type: "Manual release-authorization checklist schemas and adversarial authorization cases",
  checklist_schema_count: harness.checklistSchemas.length, release_case_count: harness.releaseCases.length,
  valid_manual_authorization_routes: harness.releaseCases.filter((row) => row.test_class === "valid_manual_authorization").length,
  rejected_release_routes: harness.releaseCases.filter((row) => row.test_class !== "valid_manual_authorization").length,
  passed_case_count: passedCount(harness.releaseCases), failed_case_count: harness.releaseCases.filter((row) => !row.passed).length,
  actual_release_authorizations_created: 0, actual_release_actors_created: 0, automatic_release_or_publication_allowed: false,
  rule: "A named human release actor distinct from both reviewers must verify all twelve checklist items. A valid authorization remains a separate append-only receipt and does not itself publish.",
  schemas: harness.checklistSchemas, case_distribution: harness.distributions.release, cases: harness.releaseCases,
});
await writeJson(join(dataRoot, "phase-57q-immutable-publication-bundle-manifests.json"), {
  phase: "57Q", captured_date: capturedDate, registry_type: "Immutable publication-bundle manifest schemas and digest-integrity cases",
  bundle_schema_count: harness.bundleSchemas.length, bundle_case_count: harness.bundleCases.length,
  valid_bundle_routes: harness.bundleCases.filter((row) => row.test_class === "valid_immutable_bundle").length,
  rejected_bundle_routes: harness.bundleCases.filter((row) => row.test_class !== "valid_immutable_bundle").length,
  passed_case_count: passedCount(harness.bundleCases), failed_case_count: harness.bundleCases.filter((row) => !row.passed).length,
  actual_publication_bundles_created: 0, actual_artifacts_bound: 0, actual_sources_cited: 0, automatic_publication_allowed: false,
  rule: "Each signed manifest binds the exact packet, evidence receipt, publication receipt, cited-source digests, canonical artifact order, and release-authorization digest without permitting later mutation.",
  schemas: harness.bundleSchemas, case_distribution: harness.distributions.bundle, cases: harness.bundleCases,
});
await writeJson(join(dataRoot, "phase-57q-withdrawal-rollback-receipt-fixtures.json"), {
  phase: "57Q", captured_date: capturedDate, registry_type: "Append-only release, publication, withdrawal, rollback, and supersession lifecycle fixtures",
  lifecycle_schema_count: harness.lifecycleSchemas.length, lifecycle_case_count: harness.lifecycleCases.length,
  release_append_routes: harness.lifecycleCases.filter((row) => row.test_class === "manual_release_appended").length,
  publication_append_routes: harness.lifecycleCases.filter((row) => row.test_class === "publication_appended_after_release").length,
  withdrawal_append_routes: harness.lifecycleCases.filter((row) => row.test_class === "withdrawal_appended").length,
  rollback_append_routes: harness.lifecycleCases.filter((row) => row.test_class === "rollback_appended").length,
  supersession_append_routes: harness.lifecycleCases.filter((row) => row.test_class === "supersession_appended").length,
  history_preservation_routes: harness.lifecycleCases.filter((row) => row.test_class === "prior_history_preserved").length,
  rejected_lifecycle_routes: harness.lifecycleCases.filter((row) => !["manual_release_appended", "publication_appended_after_release", "withdrawal_appended", "rollback_appended", "supersession_appended", "prior_history_preserved"].includes(row.test_class)).length,
  passed_case_count: passedCount(harness.lifecycleCases), failed_case_count: harness.lifecycleCases.filter((row) => !row.passed).length,
  actual_publications: 0, actual_withdrawals: 0, actual_rollbacks: 0, actual_supersessions: 0, prior_events_mutated: 0,
  rule: "Release, publication, withdrawal, rollback, and supersession append new events. Withdrawal or rollback may change only current publication availability; neither can erase history or change evidence, acceptance, implementation, capability, closure, or operating-outcome state.",
  schemas: harness.lifecycleSchemas, case_distribution: harness.distributions.lifecycle, cases: harness.lifecycleCases,
});
await writeJson(join(dataRoot, "phase-57q-release-lifecycle-harness-results.json"), {
  phase: "57Q", captured_date: capturedDate, registry_type: "Executable manual-release, bundle-integrity, withdrawal, and rollback harness results",
  total_case_count: harness.allCases.length, passed_case_count: passedCount(harness.allCases), failed_case_count: harness.failures.length,
  release_authorization_cases: harness.releaseCases.length, publication_bundle_cases: harness.bundleCases.length, lifecycle_cases: harness.lifecycleCases.length,
  result_counts: countBy(harness.allCases, "actual_decision"),
  actual_candidate_packets_evaluated: 0, actual_reviewer_identities: 0, actual_release_actors: 0, actual_release_authorizations: 0,
  actual_publication_bundles: 0, actual_publications: 0, actual_withdrawals: 0, actual_rollbacks: 0, actual_supersessions: 0,
  eligible_records_accepted: 0, reopening_triggers_fired: 0, automated_closures_or_publications: 0, evidence_records_created: 0,
  test_ids: harness.allCases.map((row) => row.test_id),
});

const specs = [];
for (const schema of audit57p.schemas) {
  const contractId = schema.contract_id;
  const rail = schema.evidence_rail;
  const agency = agencyByRail[rail];
  const label = labels[contractId];
  const slug = contractId.toLowerCase().replace(/^reopen-/, "");
  const action = contractId.replace(/^REOPEN-/, "");
  const sourceIds = sourceIdsByRail[rail];
  specs.push(
    { slug: `${slug}-twelve-item-manual-release-authorization-checklist`, agency, actionKey: `${action}-MANUAL-RELEASE-CHECKLIST-2026-01`, stage: "Manual release-authorization checklist controls", sourceIds, title: `${label} receives a twelve-item manual release-authorization checklist`, finding: "One valid fixture reaches a human release receipt that still awaits separate publication; thirteen incomplete, colliding-role, mismatched-digest, unresolved-block, chronology, or automated-actor fixtures are rejected.", denominator: "Twelve required checklist items, fourteen adversarial cases, one bounded valid route, thirteen explicit rejections, and zero actual release authorizations.", limits: ["A synthetic valid route is not an actual authorization.", "The release actor must be a named human distinct from both reviewers.", "A release receipt cannot mutate the packet or either review receipt and cannot publish automatically."], next: `Apply the checklist only after ${label} has one complete cited packet and two separately attributable accept receipts.`, registry: "phase-57q-manual-release-authorization-checklists.json" },
    { slug: `${slug}-immutable-publication-bundle-manifest`, agency, actionKey: `${action}-IMMUTABLE-PUBLICATION-BUNDLE-2026-01`, stage: "Immutable publication-bundle manifest controls", sourceIds, title: `${label} receives an immutable publication-bundle manifest`, finding: "The manifest binds the exact packet, both review receipts, cited-source digests, canonical artifact order, release-authorization binding, and its own signature; thirteen mutation or completeness attacks are rejected.", denominator: "One contract-specific schema, fourteen digest-integrity cases, one bounded valid route, thirteen explicit rejections, and zero actual publication bundles.", limits: ["A synthetic manifest does not contain or cite an actual candidate packet.", "Hash integrity does not validate the truth of a claim.", "A complete bundle remains unpublished until a separate manual publication event."], next: `Build an actual bundle only from the exact ${label} packet and immutable evidence, publication, and release receipts.`, registry: "phase-57q-immutable-publication-bundle-manifests.json" },
    { slug: `${slug}-withdrawal-rollback-and-supersession-receipts`, agency, actionKey: `${action}-WITHDRAWAL-ROLLBACK-RECEIPTS-2026-01`, stage: "Withdrawal, rollback, and supersession receipt controls", sourceIds, title: `${label} withdrawal and rollback receipts preserve the complete publication history`, finding: "Release, publication, withdrawal, rollback, and supersession append as new events; mutation, replacement, deletion, chronology regression, history erasure, state inflation, unauthorized actors, and unknown targets are rejected.", denominator: "One lifecycle machine, sixteen cases, six bounded append or preservation routes, ten explicit rejections, and zero actual publication lifecycle events.", limits: ["Withdrawal and rollback may affect only current publication availability.", "Neither event erases earlier review, release, or publication history.", "Rollback cannot change evidence, acceptance, implementation, capability, closure, or operating outcomes."], next: `Require a named actor, cited reason, target event, increasing time, and immutable prior digest for every future ${label} withdrawal or rollback.`, registry: "phase-57q-withdrawal-rollback-receipt-fixtures.json" },
    { slug: `${slug}-zero-actual-release-publication-withdrawal-or-rollback-events`, agency, actionKey: `${action}-ZERO-PHASE57Q-LIFECYCLE-EVENTS-2026-01`, stage: "Zero-automation release lifecycle controls", sourceIds, title: `${label} records zero actual release, publication, withdrawal, or rollback events`, finding: "Forty-four fixture-only cases prove manual release, immutable bundle, and reversible publication behavior without assigning a real actor, evaluating a real packet, or changing any public claim state.", denominator: "Fourteen release cases, fourteen bundle cases, sixteen lifecycle cases, and zero actual release actors, authorizations, bundles, publications, withdrawals, rollbacks, triggers, or closures.", limits: ["Synthetic actors, bundles, receipts, and transitions remain outside the evidence and publication ledgers.", "Passing workflow fixtures do not establish eligibility or operating outcomes.", "No test event creates a publication or changes the inherited hold."], next: `Preserve the hold until ${label} receives complete cited evidence, dual review, a separate human release receipt, and a separate manual publication decision.`, registry: "phase-57q-release-lifecycle-harness-results.json" },
  );
}

const nextHoldKeys = {
  "AMTRAK-PIDS-CLOSEOUT-HOLD-2027-03": "AMTRAK-PIDS-CLOSEOUT-HOLD-2027-04",
  "AMTRAK-NAMED-RELIABILITY-HOLD-2027-02": "AMTRAK-NAMED-RELIABILITY-HOLD-2027-03",
  "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2027-03": "LA-BEAD-NEXTLINK-VALIDATION-HOLD-2027-04",
  "LA-BEAD-STARLINK-HOLD-2027-03": "LA-BEAD-STARLINK-HOLD-2027-04",
  "MT-BEAD-QUARTERLY-HOLD-2027-03": "MT-BEAD-QUARTERLY-HOLD-2027-04",
  "HANFORD-WTP-MASS-BALANCE-HOLD-2026-12": "HANFORD-WTP-MASS-BALANCE-HOLD-2027-01",
  "NNSA-PIT-RATE-HOLD-2027-03": "NNSA-PIT-RATE-HOLD-2027-04",
  "NNSA-PIT-PEIS-HOLD-2027-03": "NNSA-PIT-PEIS-HOLD-2027-04",
  "NNSA-PIT-GAO-BASELINE-HOLD-2027-04": "NNSA-PIT-GAO-BASELINE-HOLD-2027-05",
};
const heldSpecs = audit57p.schemas.map((schema) => {
  const prior = holdByContract.get(schema.contract_id);
  if (!prior || !nextHoldKeys[prior.action_key]) throw new Error(`Missing Phase 57Q hold lineage for ${schema.contract_id}`);
  return {
    slug: `preserved-${schema.contract_id.toLowerCase().replace(/^reopen-/, "")}`, agency: prior.agency,
    actionKey: nextHoldKeys[prior.action_key], parentHoldKey: prior.action_key, reopeningContractId: schema.contract_id,
    stage: "Manual release, publication-bundle, and rollback hold", sourceIds: prior.supporting_source_ids,
    title: `${labels[schema.contract_id]} remains In Review after release and rollback lifecycle execution`,
    finding: "Forty-four fixture-only cases pass, but no actual target packet, dual-review accept receipts, release actor, authorization receipt, publication bundle, publication event, withdrawal, or rollback exists.",
    denominator: "One inherited hold, one twelve-item checklist, fourteen release cases, fourteen bundle cases, sixteen lifecycle cases, and zero actual workflow events.",
    limits: ["Synthetic release and rollback events are not actual publication history.", "No fixture creates a release actor, authorization, bundle, publication, withdrawal, or rollback.", "The inherited hold cannot close or publish automatically."],
    next: prior.next_action, registry: "phase-57q-release-lifecycle-harness-results.json",
  };
});
const allSpecs = [...specs, ...heldSpecs];
if (specs.length !== 36 || heldSpecs.length !== 9 || allSpecs.length !== 45) throw new Error("Phase 57Q must contain thirty-six Published controls and nine held records.");

const sourceById = new Map();
for (const id of [...new Set(allSpecs.flatMap((spec) => spec.sourceIds))]) {
  const source = JSON.parse(await readFile(join(contentRoot, "sources", `${id}.json`), "utf8"));
  sourceById.set(id, { id, url: source.url, owner: source.source_owner ?? source.name });
}
const records = allSpecs.map((spec, index) => ({
  record_id: `record-57q-${spec.slug}`, document_id: `research-doc-57q-${spec.slug}`, signal_id: `signal-57q-${spec.slug}`,
  document_number: 1018 + index, record_status: index < 36 ? "Published" : "In Review", agency: spec.agency,
  action_key: spec.actionKey, parent_hold_key: spec.parentHoldKey ?? null, reopening_contract_id: spec.reopeningContractId ?? null,
  evidence_stage: spec.stage, title: spec.title, finding: spec.finding, denominator: spec.denominator, evidence_limits: spec.limits,
  next_action: spec.next, structured_registry_file: spec.registry, source_id: spec.sourceIds[0], supporting_source_ids: [...new Set(spec.sourceIds)],
  official_url: sourceById.get(spec.sourceIds[0])?.url, publication_date: capturedDate,
  document_type: index < 36 ? "Data Release" : "Technical Report", authority_boundary: authorityBoundary,
}));
const published = records.filter((record) => record.record_status === "Published");
const held = records.filter((record) => record.record_status === "In Review");
const carriedSourceIds = [...new Set(records.flatMap((record) => record.supporting_source_ids))];
if (carriedSourceIds.length !== 36) throw new Error(`Phase 57Q must carry thirty-six Tier 1 sources; found ${carriedSourceIds.length}.`);

const ledger = {
  phase: "57Q", captured_date: capturedDate,
  goal: "Make final human release authorization separately attributable, bind exact publication artifacts immutably, and make withdrawal and rollback reversible without allowing any workflow completion to publish automatically.",
  publication_rule: "Publish only release-control, bundle-integrity, and rollback-receipt controls; preserve all nine outcome holds and keep every synthetic actor, bundle, receipt, withdrawal, rollback, and transition outside the evidence and publication ledgers.",
  authority_rule: authorityBoundary,
  records_reviewed: records.length, records_published: published.length, records_held: held.length, evidence_stage_counts: countBy(records, "evidence_stage"),
  new_official_source_profiles: 0, carried_official_source_profiles: carriedSourceIds.length,
  structured_rails: [
    { file: "phase-57q-manual-release-authorization-checklists.json", schemas: 9, cases: 126, failed_cases: 0 },
    { file: "phase-57q-immutable-publication-bundle-manifests.json", schemas: 9, cases: 126, failed_cases: 0 },
    { file: "phase-57q-withdrawal-rollback-receipt-fixtures.json", schemas: 9, cases: 144, failed_cases: 0 },
  ],
  release_checklist_schemas: 9, publication_bundle_schemas: 9, lifecycle_state_machines: 9,
  release_authorization_cases: 126, publication_bundle_cases: 126, withdrawal_rollback_lifecycle_cases: 144,
  valid_manual_authorization_routes: 9, rejected_release_routes: 117, valid_bundle_routes: 9, rejected_bundle_routes: 117,
  release_append_routes: 9, publication_append_routes: 9, withdrawal_append_routes: 9, rollback_append_routes: 9, supersession_append_routes: 9, history_preservation_routes: 9, rejected_lifecycle_routes: 90,
  total_workflow_cases: 396, workflow_test_failures: 0,
  actual_candidate_packets_evaluated: 0, actual_reviewer_identities: 0, actual_release_actors: 0, actual_release_authorizations: 0,
  actual_publication_bundles: 0, actual_publications: 0, actual_withdrawals: 0, actual_rollbacks: 0, actual_supersessions: 0,
  eligible_records_accepted: 0, exact_target_artifacts_acquired: 0, exact_target_trigger_events: 0, public_agency_contacts_or_foia_requests: 0,
  directive_scope_changes: [], implementation_changes: [], capability_changes: [], closure_changes: [], operating_outcome_changes: [], inherited_entity_ledger_closure_changes: [],
  prior_visible_scope: phase57p.post_batch_visible_scope, post_batch_visible_scope: phase57p.post_batch_visible_scope, post_batch_closure_counts: phase57p.post_batch_closure_counts,
  preserved_phase57p_holds: held57p.map((record) => record.action_key), reopening_contract_ids: audit57p.schemas.map((schema) => schema.contract_id), new_visible_holds: [], records,
};
await writeJson(join(dataRoot, "phase-57q-manual-release-authorization-publication-bundles-withdrawal-rollback-receipts.json"), ledger);
await writeJson(join(dataRoot, "phase-57q-publication-review.json"), {
  phase: "57Q", captured_date: capturedDate,
  promoted_document_ids: published.map((record) => record.document_id), promoted_signal_ids: published.map((record) => record.signal_id),
  held_document_ids: held.map((record) => record.document_id), held_signal_ids: held.map((record) => record.signal_id),
  inherited_hold_lineage: held.map((record) => ({ action_key: record.action_key, parent_hold_key: record.parent_hold_key, reopening_contract_id: record.reopening_contract_id })),
  release_checklist_schemas_created: 9, bundle_schemas_created: 9, lifecycle_state_machines_created: 9,
  release_cases_executed: 126, bundle_cases_executed: 126, lifecycle_cases_executed: 144, total_workflow_cases_executed: 396,
  actual_release_authorizations: 0, actual_publication_bundles: 0, actual_publications: 0, actual_withdrawals: 0, actual_rollbacks: 0,
  decision: "Thirty-six contract-specific release, immutable-bundle, withdrawal, rollback, and zero-automation controls publish. Nine inherited holds remain In Review; every event is synthetic, prior history is immutable, release remains distinct from publication, and no trigger, closure, release, publication, withdrawal, or rollback event is recorded.",
});

for (const record of records) {
  const meta = agencyMeta[record.agency];
  const archiveName = `${String(record.document_number - 1017).padStart(2, "0")}-phase57q-record.txt`;
  const firstSource = sourceById.get(record.source_id);
  const sourceUrls = record.supporting_source_ids.map((id) => sourceById.get(id)?.url).filter(Boolean);
  await writeJson(join(contentRoot, "research-documents", `${record.document_number}-57q-${record.record_id.replace(/^record-57q-/, "")}.json`), {
    id: record.document_id, collection_id: collectionId, title: record.title, slug: record.document_id.replace(/^research-doc-/, ""), record_status: record.record_status,
    publisher: firstSource?.owner ?? "U.S. public-sector authority", publication_date: record.publication_date, document_type: record.document_type,
    summary: `${record.finding} Denominator: ${record.denominator}`,
    key_findings: [`Evidence stage: ${record.evidence_stage}.`, `Finding: ${record.finding}`, `Denominator: ${record.denominator}`, ...record.evidence_limits.map((limit) => `Boundary: ${limit}`), `Next action: ${record.next_action}`],
    why_it_matters: record.record_status === "Published" ? "The record makes final human release, exact-artifact binding, withdrawal, rollback, and supersession explicit without creating an actual publication event." : "The hold remains actionable while synthetic release infrastructure stays separate from evidence, reviewer identity, and actual publication state.",
    ftfn_relevance: ["Separates evidence review, publication review, release authorization, publication, withdrawal, and rollback across all nine contracts.", "Binds exact packets and receipts through immutable, canonical bundle digests.", "Proves that withdrawal and rollback append without erasing history or changing evidence and operating-outcome states."],
    evidence_limits: ["Not publicly acquired does not mean nonexistent, withheld, or never submitted.", "FTFN public-source research is not agency contact or a submitted FOIA request.", ...record.evidence_limits, "The inherited 1 Closed / 21 Partially Closed / 2 Open entity ledger remains unchanged.", "No record supports a ranking, composite score, readiness score, generalized savings claim, or unsupported causal inference."],
    primary_topics: meta.topics, framework_layers: meta.layers, constraint_tags: ["Data Quality", "Regulation", "Public Trust"],
    source_id: record.source_id, supporting_source_ids: record.supporting_source_ids, supporting_official_urls: sourceUrls, official_url: record.official_url,
    local_capture_path: `/downloads/${collectionSlug}/official-links/${archiveName}`, archive_member: `official-links/${archiveName}`,
    capture_status: "Official link record", captured_date: capturedDate,
  });
  const signal = [
    "---", `id: ${JSON.stringify(record.signal_id)}`, `title: ${JSON.stringify(record.title)}`, `slug: ${JSON.stringify(record.signal_id.replace(/^signal-/, ""))}`,
    `record_status: ${JSON.stringify(record.record_status)}`, `summary: ${JSON.stringify(record.finding)}`, yamlList("source_ids", record.supporting_source_ids),
    `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, `primary_topic: ${JSON.stringify(meta.topics[0])}`, yamlList("framework_layers", meta.layers),
    "signal_type: \"Research Result\"", "maturity_level: \"Infrastructure\"", "time_horizon: \"Now\"", "evidence_quality: \"Official Data\"", "verification_status: \"Verified Against Primary Source\"",
    `why_it_matters: ${JSON.stringify(`Evidence stage: ${record.evidence_stage}. Denominator: ${record.denominator}`)}`,
    yamlList("dependencies", ["one complete cited packet", "separate evidence and publication accept receipts", "a named human release actor distinct from both reviewers", "an immutable publication bundle", "a separate manual publication event"]),
    yamlList("constraints", ["Data Quality", "Regulation", "Public Trust"]), yamlList("receiving_systems", ["Phase 57Q manual-release, immutable-bundle, withdrawal, and rollback controls"]),
    yamlList("local_implications", ["Do not convert a synthetic actor, bundle, authorization, publication, withdrawal, rollback, or supersession into evidence, eligibility, a trigger, closure, or operating-outcome change."]),
    yamlList("evidence_gap_ids", meta.gaps), "claim_scope: \"Specific Source Update\"", "local_evidence_level: \"General Source Layer\"", `last_reviewed_date: ${capturedDate}`,
    `editorial_notes: ${JSON.stringify(record.record_status === "Published" ? "Published under the Phase 57Q manual-release and reversible-publication control contract." : `Held under ${record.reopening_contract_id}; no actual Phase 57Q release, bundle, publication, withdrawal, or rollback event exists.`)}`,
    "---", "", "## Phase 57Q workflow control", "", record.finding, "", "## Evidence stage and denominator", "", `**${record.evidence_stage}.** ${record.denominator}`, "", `Structured registry: ${record.structured_registry_file}.`, "",
    ...(record.reopening_contract_id ? [`Reopening contract: ${record.reopening_contract_id}. Trigger state: **not fired**.`, ""] : []),
    "## Evidence boundaries", "", ...record.evidence_limits.map((limit) => `- ${limit}`), "",
    "Actual release actors, authorizations, bundles, publications, withdrawals, rollbacks, and supersessions: **Zero**. Trigger and closure events: **Zero**. FTFN submitted no agency contact or FOIA request.", "",
    `Next action: ${record.next_action}`, "", "## Authority boundary", "", record.authority_boundary, "",
  ].join("\n");
  await writeFile(join(contentRoot, "signals", `${record.signal_id}.mdx`), signal, "utf8");
}

await writeJson(join(contentRoot, "research-collections", `${collectionSlug}.json`), {
  id: collectionId, title: "Manual Release Authorization, Publication Bundles, and Rollback Receipts, 2026", slug: collectionSlug, record_status: "Published",
  summary: "Phase 57Q executes 396 synthetic release, immutable-bundle, withdrawal, rollback, and supersession cases across nine contracts while preserving every inherited outcome hold and requiring a separate manual publication event after release.",
  scope: "Nine twelve-item release checklists, nine immutable bundle schemas, nine lifecycle machines, 126 release cases, 126 bundle cases, 144 lifecycle cases, thirty-six Published controls, nine preserved holds, zero actual lifecycle events, and zero triggers or closures.",
  captured_date: capturedDate, document_ids: records.map((record) => record.document_id), download_path: `/downloads/${collectionSlug}.zip`,
  download_note: "The forty-eight-file archive contains forty-five official-link records, consolidated summaries, a README, and a checksum manifest.",
  method_note: "Every release actor, bundle, receipt, publication, withdrawal, rollback, supersession, and transition is synthetic. Release remains distinct from publication, exact artifacts remain digest-bound, all earlier history remains immutable, and no workflow event changes evidence or operating-outcome state.",
});

const signalIds = records.map((record) => record.signal_id);
const publishedSignalIds = published.map((record) => record.signal_id);
const briefing = [
  "---", `id: ${JSON.stringify(briefingId)}`, "title: \"Research Watch 047: Manual Release and Reversible Publication\"", `slug: ${JSON.stringify(briefingSlug)}`, "record_status: \"Published\"",
  "summary: \"Phase 57Q passes 396 synthetic release, bundle-integrity, withdrawal, and rollback cases while keeping every actual actor, authorization, bundle, publication, withdrawal, rollback, trigger, and closure count at zero.\"",
  `published_date: ${capturedDate}`, `captured_date: ${capturedDate}`, yamlList("signal_ids", signalIds), yamlList("evidence_gap_ids", ["gap-008", "gap-015", "gap-016"]),
  "claim_scope: \"Editorial Synthesis\"", "local_evidence_level: \"General Source Layer\"", `last_reviewed_date: ${capturedDate}`,
  yamlList("top_takeaways", [
    "Nine twelve-item checklists require a named human release actor distinct from evidence and publication reviewers.",
    "Nine immutable bundle schemas bind the exact packet, both review receipts, cited-source digests, canonical artifact order, and release receipt.",
    "Nine lifecycle machines append release, publication, withdrawal, rollback, and supersession without deleting or rewriting earlier history.",
    "Thirty-six controls publish, all nine holds remain In Review, and zero actual release or publication lifecycle events are recorded.",
  ]),
  yamlList("constraint_watch", ["Data Quality", "Regulation", "Public Trust"]),
  yamlList("what_to_watch_next", ["One cited Amtrak asset-period bundle", "Privacy-safe completed broadband bundles", "Stable Hanford identity and custody bundle", "Exact NNSA site-period output, capacity, and GAO closure bundles"]),
  "---", "", "## What Phase 57Q proves", "",
  "Final human release authorization, exact-artifact bundle integrity, publication, withdrawal, rollback, and supersession can remain separately attributable, append-only, and reversible across all nine contracts.", "",
  "## What did not move", "",
  "No synthetic actor, receipt, bundle, or lifecycle transition is an actual editorial event. No packet, release, publication, withdrawal, rollback, trigger, or closure exists, and every inherited hold remains In Review.", "",
  "## Evidence boundary", "",
  "The entity ledger remains one Closed, twenty-one Partially Closed, and two Open. Phase 57Q records no agency contact, FOIA request, directive-scope change, implementation change, capability change, closure change, or operating-outcome change.", "",
].join("\n");
await writeFile(join(contentRoot, "briefings", `${briefingSlug}.mdx`), briefing, "utf8");

await writeJson(join(contentRoot, "updates", "2026-08-09-phase-57q-manual-release-publication-bundles-rollback-receipts.json"), {
  id: "update-2026-08-09-phase-57q-manual-release-publication-bundles-rollback-receipts", effective_date: capturedDate, entry_type: "Research Collection",
  title: "Phase 57Q makes final release human-attributed and publication reversible",
  summary: "Thirty-six carried Tier 1 sources support thirty-six Published controls, nine preserved holds, twenty-seven contract-specific schemas, 396 executable cases, and an explicit second manual decision between release authorization and publication.",
  affected_record_ids: [collectionId, briefingId, ...signalIds], related_paths: [`/research/${collectionSlug}/`, `/briefings/${briefingSlug}/`, ...signalIds.map((id) => `/signals/${id.replace(/^signal-/, "")}/`)],
  evidence_note: "Synthetic actors, bundles, receipts, publications, withdrawals, rollbacks, and supersessions remain separate from source evidence, actual reviewer identity, eligibility, operating outcomes, fired triggers, and closure.",
  work_package: "docs/work-packages/phase-57q-manual-release-authorization-publication-bundles-rollback-receipts.md",
});

const updateJson = async (path, mutate) => { const value = JSON.parse(await readFile(path, "utf8")); mutate(value); await writeJson(path, value); };
for (const [file, selected, question] of [
  ["finance-and-risk.json", carriedSourceIds, "Which Phase 57Q contract first produces an exact immutable bundle, separate human release receipt, separate publication event, and reversible withdrawal or rollback history?"],
  ["policy-and-standards.json", carriedSourceIds, "Which actual packet first clears every Phase 57Q release-role, digest-integrity, publication, withdrawal, rollback, and history-preservation gate?"],
  ["mobility.json", sourceIdsByRail.Amtrak, "Which official Amtrak packet first clears Phase 57Q with a human release receipt, exact publication bundle, and separate publication decision?"],
  ["chips-and-compute.json", sourceIdsByRail.Broadband, "Which privacy-safe broadband packet first clears Phase 57Q immutable bundle, human release, and reversible-publication controls?"],
  ["energy.json", [...new Set([...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA])], "Which cited Hanford or NNSA packet first clears Phase 57Q exact-bundle, human-release, publication, withdrawal, and rollback controls?"],
]) {
  await updateJson(join(contentRoot, "topics", file), (value) => {
    value.featured_sources = appendUnique(value.featured_sources, selected);
    value.watch_questions = appendUnique((value.watch_questions ?? []).filter((item) => !item.includes("Which Phase 57Q") && !item.includes("first clears Phase 57Q")), [question]);
  });
}
const publishedByAgency = (agency) => published.filter((record) => record.agency === agency).map((record) => record.signal_id);
for (const [file, selectedSignals, selectedSources] of [
  ["policy-standards-to-implementation.json", publishedSignalIds, carriedSourceIds],
  ["cross-corridor-authorization-to-operation.json", [...publishedByAgency("DOT"), ...publishedByAgency("NTIA")], [...sourceIdsByRail.Amtrak, ...sourceIdsByRail.Broadband]],
  ["energy-grid-capacity-to-service.json", publishedByAgency("DOE"), [...sourceIdsByRail.Hanford, ...sourceIdsByRail.NNSA]],
]) {
  await updateJson(join(contentRoot, "reader-pathways", file), (value) => {
    value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57q-")), selectedSignals);
    value.source_ids = appendUnique(value.source_ids, selectedSources); value.briefing_ids = appendUnique(value.briefing_ids, [briefingId]); value.research_collection_ids = appendUnique(value.research_collection_ids, [collectionId]);
    value.dependency_stack = value.dependency_stack.filter((item) => item.stage !== "Phase 57Q manual release, immutable bundles, and reversible publication");
    value.dependency_stack.push({ stage: "Phase 57Q manual release, immutable bundles, and reversible publication", current_state: "Nine release checklists, nine bundle schemas, nine lifecycle machines, and 396 cases pass; zero actual actors, releases, publications, withdrawals, rollbacks, triggers, or closures are recorded.", boundary: "Synthetic actors, bundles, receipts, and transitions are workflow infrastructure, not evidence, eligibility, release, publication, closure, or operating outcomes." });
    value.evidence_limits = appendUnique(value.evidence_limits, ["Phase 57Q prohibits release-role collapse, digest mutation, history erasure, automatic publication, rollback state inflation, trigger firing, closure, ranking, generalized savings, and unsupported causal inference."]);
    value.next_records = appendUnique(value.next_records, ["One complete cited packet with immutable evidence and publication receipts, a separately attributable human release authorization, an exact signed bundle, and a separate manual publication event."]);
  });
}
await updateJson(join(contentRoot, "dependency-maps", "comparative-outcomes-require-common-denominators.json"), (value) => {
  value.summary = "A comparison and inference protocol: Phase 57Q keeps release authorization, exact publication bundles, publication, withdrawal, rollback, and supersession separately attributable and append-only while preserving every operating-outcome hold.";
  value.source_ids = appendUnique(value.source_ids, carriedSourceIds); value.signal_ids = appendUnique(value.signal_ids.filter((id) => !id.startsWith("signal-57q-")), publishedSignalIds);
  value.nodes = value.nodes.filter((node) => node.id !== "node-phase57q-manual-release-bundles"); value.links = value.links.filter((link) => link.from !== "node-phase57q-manual-release-bundles");
  value.nodes.push({ id: "node-phase57q-manual-release-bundles", label: "Nine release checklists; nine immutable bundles; nine reversible lifecycles; zero actual events", node_type: "Signal", note: "Release remains distinct from publication, exact artifacts remain digest-bound, and withdrawal or rollback never erases prior history." });
  value.links.push(
    { from: "node-phase57q-manual-release-bundles", to: "node-phase57p-dual-review-audit", relationship: "Depends On", confidence: "Supported", note: "Phase 57Q begins only after Phase 57P keeps both review receipts, disagreements, adjudication, and supersession separately attributable and immutable." },
    { from: "node-phase57q-manual-release-bundles", to: "node-denominator-break", relationship: "Constrained By", confidence: "Partial", note: "An actual bundle still requires one cited packet with compatible identity, definition, unit, method, denominator, period, privacy, authority, and acceptance." },
    { from: "node-phase57q-manual-release-bundles", to: "node-causal-hold", relationship: "Limited By", confidence: "Missing Evidence", note: "Release and publication controls do not establish operating outcomes, eligibility, implementation, closure, or causation." },
  );
  value.what_this_map_supports = appendUnique(value.what_this_map_supports, ["Nine release checklists, nine immutable bundle schemas, nine reversible publication lifecycles, 396 passing cases, zero actual events, and nine preserved holds."]);
  value.next_records_needed = appendUnique(value.next_records_needed, ["One complete cited packet with immutable review receipts, a separate human release receipt, an exact signed publication bundle, and a separate manual publication event without changing identity, period, denominator, privacy, authority, acceptance, capability, implementation, closure, or outcome attribution."]);
});

console.log(`Generated Phase 57Q: ${published.length} Published controls, ${held.length} In Review holds, ${carriedSourceIds.length} carried Tier 1 sources, ${harness.allCases.length} workflow cases, and Research Watch 047.`);
